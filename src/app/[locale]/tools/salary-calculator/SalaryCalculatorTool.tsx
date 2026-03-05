'use client';
import { useState, useMemo, useCallback } from 'react';
import { IndianRupee, TrendingUp, PieChart, ArrowRightLeft, ChevronDown, ChevronUp, Info, Building2, Briefcase, Shield } from 'lucide-react';

/* ─── Types ─── */
interface SalaryInput {
  annualCTC: string;
  basicPct: string;
  hraPct: string;
  specialAllowance: string;
  lta: string;
  otherAllowances: string;
  employerPFPct: string;
  pfCapEnabled: boolean;
  includeGratuity: boolean;
  bonus: string;
  professionalTax: string;
  metro: boolean;
  rentPaid: string;
  // Old regime deductions
  deduction80C: string;
  deduction80D: string;
  deduction80CCD: string;
  homeLoanInterest: string;
  otherDeductions: string;
}

interface SalaryBreakdown {
  basic: number;
  hra: number;
  specialAllowance: number;
  lta: number;
  otherAllowances: number;
  bonus: number;
  grossSalary: number;
  employerPF: number;
  gratuity: number;
  employeePF: number;
  professionalTax: number;
  taxOld: number;
  taxNew: number;
  inHandOld: number;
  inHandNew: number;
  hraExemptionOld: number;
  totalDeductionsOld: number;
  taxableIncomeOld: number;
  taxableIncomeNew: number;
}

type ViewMode = 'annual' | 'monthly';

/* ─── Tax Computation Helpers (FY 2025-26) ─── */
const NEW_SLABS = [
  { upto: 400000, rate: 0 },
  { upto: 800000, rate: 0.05 },
  { upto: 1200000, rate: 0.10 },
  { upto: 1600000, rate: 0.15 },
  { upto: 2000000, rate: 0.20 },
  { upto: 2400000, rate: 0.25 },
  { upto: Infinity, rate: 0.30 },
];

const OLD_SLABS = [
  { upto: 250000, rate: 0 },
  { upto: 500000, rate: 0.05 },
  { upto: 1000000, rate: 0.20 },
  { upto: Infinity, rate: 0.30 },
];

function calcTaxFromSlabs(taxable: number, slabs: { upto: number; rate: number }[]): number {
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (taxable <= prev) break;
    const chunk = Math.min(taxable, slab.upto) - prev;
    tax += chunk * slab.rate;
    prev = slab.upto;
  }
  return tax;
}

function addSurchargeAndCess(tax: number, taxableIncome: number): number {
  // Surcharge
  let surchargeRate = 0;
  if (taxableIncome > 50000000) surchargeRate = 0.37;
  else if (taxableIncome > 20000000) surchargeRate = 0.25;
  else if (taxableIncome > 10000000) surchargeRate = 0.15;
  else if (taxableIncome > 5000000) surchargeRate = 0.10;
  const surcharge = tax * surchargeRate;
  // Cess 4%
  const cess = (tax + surcharge) * 0.04;
  return tax + surcharge + cess;
}

function calcNewRegimeTax(grossSalary: number, employerPF: number): number {
  const standardDeduction = 75000;
  const taxableIncome = Math.max(0, grossSalary - standardDeduction);
  let tax = calcTaxFromSlabs(taxableIncome, NEW_SLABS);
  // Rebate u/s 87A: if taxable income <= 12,00,000, rebate up to 60,000
  if (taxableIncome <= 1200000) {
    tax = Math.max(0, tax - 60000);
  }
  return addSurchargeAndCess(tax, taxableIncome);
}

function calcOldRegimeTax(
  grossSalary: number,
  hraExemption: number,
  ded80C: number,
  ded80D: number,
  ded80CCD: number,
  homeLoanInterest: number,
  otherDed: number,
  employeePF: number,
): number {
  const standardDeduction = 50000;
  // 80C includes employee PF
  const total80C = Math.min(150000, ded80C + employeePF);
  const total80D = Math.min(100000, ded80D);
  const total80CCD = Math.min(50000, ded80CCD); // NPS extra
  const totalHomeLoan = Math.min(200000, homeLoanInterest);
  const totalDeductions = total80C + total80D + total80CCD + totalHomeLoan + otherDed;
  const taxableIncome = Math.max(0, grossSalary - standardDeduction - hraExemption - totalDeductions);
  let tax = calcTaxFromSlabs(taxableIncome, OLD_SLABS);
  // Rebate u/s 87A: if taxable income <= 5,00,000, rebate up to 12,500
  if (taxableIncome <= 500000) {
    tax = Math.max(0, tax - 12500);
  }
  return addSurchargeAndCess(tax, taxableIncome);
}

function calcHRAExemption(basic: number, hra: number, rentPaid: number, metro: boolean): number {
  if (rentPaid <= 0 || hra <= 0) return 0;
  const a = hra;
  const b = rentPaid - 0.10 * basic;
  const c = (metro ? 0.50 : 0.40) * basic;
  return Math.max(0, Math.min(a, b, c));
}

/* ─── Formatting ─── */
function fmt(n: number): string {
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function fmtCurrency(n: number): string {
  return '\u20B9' + fmt(n);
}

/* ─── Defaults ─── */
const DEFAULTS: SalaryInput = {
  annualCTC: '1000000',
  basicPct: '40',
  hraPct: '50',
  specialAllowance: '',
  lta: '',
  otherAllowances: '',
  employerPFPct: '12',
  pfCapEnabled: true,
  includeGratuity: true,
  bonus: '',
  professionalTax: '2400',
  metro: true,
  rentPaid: '',
  deduction80C: '150000',
  deduction80D: '25000',
  deduction80CCD: '',
  homeLoanInterest: '',
  otherDeductions: '',
};

/* ─── Donut Chart ─── */
function DonutChart({ segments, size = 200 }: { segments: { label: string; value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;
  let cumAngle = -90;
  const paths: React.ReactElement[] = [];

  segments.forEach((seg, i) => {
    if (seg.value <= 0) return;
    const pct = seg.value / total;
    const angle = pct * 360;
    const startRad = (cumAngle * Math.PI) / 180;
    const endRad = ((cumAngle + angle) * Math.PI) / 180;
    const largeArc = angle > 180 ? 1 : 0;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    paths.push(
      <path
        key={i}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={seg.color}
        stroke="white"
        strokeWidth={2}
      />
    );
    cumAngle += angle;
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {paths}
        <circle cx={cx} cy={cy} r={r * 0.5} fill="white" className="dark:fill-slate-800" />
        <text x={cx} y={cy - 8} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400" fontSize={11}>In-Hand</text>
        <text x={cx} y={cy + 12} textAnchor="middle" className="fill-slate-900 dark:fill-slate-100 font-bold" fontSize={14}>{Math.round((segments[0]?.value || 0) / total * 100)}%</text>
      </svg>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {segments.map((seg, i) => seg.value > 0 && (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-slate-600 dark:text-slate-400">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Comparison Bar ─── */
function ComparisonBar({ oldVal, newVal, label }: { oldVal: number; newVal: number; label: string }) {
  const max = Math.max(oldVal, newVal, 1);
  const saving = newVal - oldVal;
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">{label}</div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 dark:text-slate-300">Old Regime</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{fmtCurrency(oldVal)}</span>
          </div>
          <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${(oldVal / max) * 100}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 dark:text-slate-300">New Regime</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{fmtCurrency(newVal)}</span>
          </div>
          <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(newVal / max) * 100}%` }} />
          </div>
        </div>
      </div>
      {saving !== 0 && (
        <div className={`mt-2 text-xs font-medium ${saving > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
          {saving > 0 ? `New regime saves you ${fmtCurrency(saving)}` : `Old regime saves you ${fmtCurrency(-saving)}`}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export function SalaryCalculatorTool() {
  const [input, setInput] = useState<SalaryInput>(DEFAULTS);
  const [viewMode, setViewMode] = useState<ViewMode>('annual');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showOldDeductions, setShowOldDeductions] = useState(false);

  const set = useCallback((key: keyof SalaryInput, value: string | boolean) => {
    setInput(prev => ({ ...prev, [key]: value }));
  }, []);

  const n = useCallback((val: string) => parseFloat(val) || 0, []);

  /* ─── Core Calculation ─── */
  const breakdown: SalaryBreakdown = useMemo(() => {
    const ctc = n(input.annualCTC);
    if (ctc <= 0) {
      return { basic: 0, hra: 0, specialAllowance: 0, lta: 0, otherAllowances: 0, bonus: 0, grossSalary: 0, employerPF: 0, gratuity: 0, employeePF: 0, professionalTax: 0, taxOld: 0, taxNew: 0, inHandOld: 0, inHandNew: 0, hraExemptionOld: 0, totalDeductionsOld: 0, taxableIncomeOld: 0, taxableIncomeNew: 0 };
    }

    const basicPct = Math.min(100, Math.max(0, n(input.basicPct))) / 100;
    const hraPct = n(input.hraPct) / 100;
    const pfPct = Math.min(12, n(input.employerPFPct)) / 100;

    const basic = Math.round(ctc * basicPct);
    const hra = Math.round(basic * hraPct);

    // PF: 12% of basic, capped at 15000/month base if cap enabled
    const pfBase = input.pfCapEnabled ? Math.min(basic, 15000 * 12) : basic;
    const employerPF = Math.round(pfBase * pfPct);
    const employeePF = Math.round(pfBase * 0.12);

    // Gratuity: 4.81% of basic
    const gratuity = input.includeGratuity ? Math.round(basic * 0.0481) : 0;

    const bonus = n(input.bonus);
    const lta = n(input.lta);
    const otherAllowances = n(input.otherAllowances);

    // Special allowance = CTC - basic - HRA - employer PF - gratuity - bonus - LTA - other
    const autoSpecial = ctc - basic - hra - employerPF - gratuity - bonus - lta - otherAllowances;
    const specialAllowance = input.specialAllowance ? n(input.specialAllowance) : Math.max(0, autoSpecial);

    // Gross salary = what employee gets before deductions (CTC - employer contributions)
    const grossSalary = ctc - employerPF - gratuity;

    const professionalTax = n(input.professionalTax);

    // HRA exemption for old regime
    const rentPaid = n(input.rentPaid);
    const hraExemptionOld = calcHRAExemption(basic, hra, rentPaid, input.metro);

    // Tax calculations
    const taxNew = Math.round(calcNewRegimeTax(grossSalary, employerPF));

    const taxOld = Math.round(calcOldRegimeTax(
      grossSalary,
      hraExemptionOld,
      n(input.deduction80C),
      n(input.deduction80D),
      n(input.deduction80CCD),
      n(input.homeLoanInterest),
      n(input.otherDeductions),
      employeePF,
    ));

    // In-hand = Gross - Employee PF - Professional Tax - Tax
    const inHandNew = grossSalary - employeePF - professionalTax - taxNew;
    const inHandOld = grossSalary - employeePF - professionalTax - taxOld;

    // Taxable income for display
    const taxableIncomeNew = Math.max(0, grossSalary - 75000);
    const total80C = Math.min(150000, n(input.deduction80C) + employeePF);
    const total80D = Math.min(100000, n(input.deduction80D));
    const total80CCD = Math.min(50000, n(input.deduction80CCD));
    const totalHomeLoan = Math.min(200000, n(input.homeLoanInterest));
    const totalDeductionsOld = total80C + total80D + total80CCD + totalHomeLoan + n(input.otherDeductions) + hraExemptionOld + 50000;
    const taxableIncomeOld = Math.max(0, grossSalary - totalDeductionsOld);

    return {
      basic, hra, specialAllowance, lta, otherAllowances, bonus,
      grossSalary, employerPF, gratuity, employeePF, professionalTax,
      taxOld, taxNew, inHandOld, inHandNew, hraExemptionOld,
      totalDeductionsOld, taxableIncomeOld, taxableIncomeNew,
    };
  }, [input, n]);

  const d = viewMode === 'monthly' ? 12 : 1;
  const bestRegime = breakdown.inHandNew >= breakdown.inHandOld ? 'new' : 'old';

  /* ─── Input Helpers ─── */
  function field(label: string, key: keyof SalaryInput, opts?: { placeholder?: string; suffix?: string; prefix?: string; info?: string }) {
    return (
      <div>
        <label className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          {label}
          {opts?.info && (
            <span className="group relative">
              <Info className="w-3 h-3 text-slate-400 cursor-help" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">{opts.info}</span>
            </span>
          )}
        </label>
        <div className="relative">
          {opts?.prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">{opts.prefix}</span>}
          <input
            type="text"
            inputMode="numeric"
            value={input[key] as string}
            onChange={e => {
              const v = e.target.value.replace(/[^0-9.]/g, '');
              set(key, v);
            }}
            placeholder={opts?.placeholder || '0'}
            className={`w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${opts?.prefix ? 'pl-7' : ''} ${opts?.suffix ? 'pr-8' : ''}`}
          />
          {opts?.suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">{opts.suffix}</span>}
        </div>
      </div>
    );
  }

  function toggle(label: string, key: keyof SalaryInput, info?: string) {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={input[key] as boolean}
          onChange={e => set(key, e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
        />
        <span className="text-xs text-slate-600 dark:text-slate-400">{label}</span>
        {info && (
          <span className="group relative">
            <Info className="w-3 h-3 text-slate-400 cursor-help" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">{info}</span>
          </span>
        )}
      </label>
    );
  }

  function resultRow(label: string, value: number, highlight?: 'green' | 'red' | 'blue' | 'bold') {
    const color = highlight === 'green' ? 'text-emerald-600 dark:text-emerald-400' :
      highlight === 'red' ? 'text-red-500 dark:text-red-400' :
        highlight === 'blue' ? 'text-blue-600 dark:text-blue-400' :
          highlight === 'bold' ? 'text-slate-900 dark:text-slate-100 font-bold' :
            'text-slate-700 dark:text-slate-300';
    return (
      <div className="flex justify-between items-center py-1.5">
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
        <span className={`text-sm font-medium tabular-nums ${color}`}>{fmtCurrency(Math.round(value / d))}</span>
      </div>
    );
  }

  const ctcVal = n(input.annualCTC);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">CTC to In-Hand Salary Calculator</h2>
            <p className="text-emerald-100 text-xs">FY 2025-26 | Old vs New Tax Regime | India</p>
          </div>
        </div>
        {ctcVal > 0 && (
          <div className="mt-3 flex flex-wrap gap-4">
            <div>
              <div className="text-emerald-200 text-[10px] uppercase tracking-wider">Annual CTC</div>
              <div className="text-xl font-bold">{fmtCurrency(ctcVal)}</div>
            </div>
            <div className="border-l border-white/30 pl-4">
              <div className="text-emerald-200 text-[10px] uppercase tracking-wider">Monthly In-Hand (Best)</div>
              <div className="text-xl font-bold">{fmtCurrency(Math.round(Math.max(breakdown.inHandNew, breakdown.inHandOld) / 12))}</div>
            </div>
            <div className="border-l border-white/30 pl-4">
              <div className="text-emerald-200 text-[10px] uppercase tracking-wider">Best Regime</div>
              <div className="text-xl font-bold flex items-center gap-1">
                <Shield className="w-4 h-4" />
                {bestRegime === 'new' ? 'New' : 'Old'} Regime
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* ─── Left: Input Panel ─── */}
        <div className="lg:col-span-2 space-y-4">
          {/* CTC Input */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Salary Details</span>
            </div>
            {field('Annual CTC (Cost to Company)', 'annualCTC', { prefix: '\u20B9', placeholder: '10,00,000' })}
            <div className="grid grid-cols-2 gap-3 mt-3">
              {field('Basic Salary', 'basicPct', { suffix: '% CTC', info: 'Usually 40-50% of CTC' })}
              {field('HRA', 'hraPct', { suffix: '% Basic', info: '40-50% of Basic' })}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {field('Employer PF', 'employerPFPct', { suffix: '% Basic', info: 'Max 12%' })}
              {field('Professional Tax', 'professionalTax', { prefix: '\u20B9', suffix: '/yr', info: 'Varies by state, typically 2400/yr' })}
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              {toggle('PF capped at \u20B915,000/mo base', 'pfCapEnabled', 'Most companies cap PF at 15K basic')}
              {toggle('Include Gratuity in CTC', 'includeGratuity', '4.81% of basic, paid after 5 yrs')}
              {toggle('Metro city (for HRA)', 'metro', 'Mumbai, Delhi, Chennai, Kolkata')}
            </div>
          </div>

          {/* Advanced */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 w-full text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Building2 className="w-4 h-4" />
            <span>Additional Components</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
          </button>
          {showAdvanced && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {field('Special Allowance', 'specialAllowance', { prefix: '\u20B9', placeholder: 'Auto', info: 'Auto-calculated if blank' })}
                {field('Bonus / Variable Pay', 'bonus', { prefix: '\u20B9' })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field('LTA (Leave Travel)', 'lta', { prefix: '\u20B9' })}
                {field('Other Allowances', 'otherAllowances', { prefix: '\u20B9' })}
              </div>
            </div>
          )}

          {/* Old Regime Deductions */}
          <button
            onClick={() => setShowOldDeductions(!showOldDeductions)}
            className="flex items-center gap-2 w-full text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span>Old Regime Deductions (80C, 80D, HRA)</span>
            {showOldDeductions ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
          </button>
          {showOldDeductions && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 space-y-3">
              <p className="text-[10px] text-amber-700 dark:text-amber-400">These deductions apply only under the Old Tax Regime.</p>
              <div className="grid grid-cols-2 gap-3">
                {field('Section 80C', 'deduction80C', { prefix: '\u20B9', info: 'PPF, ELSS, LIC, EPF etc. Max 1.5L' })}
                {field('Section 80D', 'deduction80D', { prefix: '\u20B9', info: 'Health insurance premium. Max 25K-1L' })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field('80CCD(1B) - NPS', 'deduction80CCD', { prefix: '\u20B9', info: 'Extra NPS deduction. Max 50K' })}
                {field('Home Loan Interest', 'homeLoanInterest', { prefix: '\u20B9', info: 'Section 24b. Max 2L' })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field('Monthly Rent Paid', 'rentPaid', { prefix: '\u20B9', info: 'For HRA exemption calculation' })}
                {field('Other Deductions', 'otherDeductions', { prefix: '\u20B9' })}
              </div>
            </div>
          )}

          {/* Quick CTC Presets */}
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Quick Select CTC</div>
            <div className="flex flex-wrap gap-1.5">
              {['300000', '500000', '700000', '1000000', '1200000', '1500000', '2000000', '2500000', '3000000', '5000000'].map(v => (
                <button
                  key={v}
                  onClick={() => set('annualCTC', v)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${input.annualCTC === v
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                    }`}
                >
                  {n(v) >= 100000 ? `${n(v) / 100000}L` : `${n(v) / 1000}K`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Right: Results Panel ─── */}
        <div className="lg:col-span-3 space-y-4">
          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
              {(['annual', 'monthly'] as ViewMode[]).map(m => (
                <button key={m} onClick={() => setViewMode(m)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === m ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {m === 'annual' ? 'Annual' : 'Monthly'}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              FY 2025-26
            </div>
          </div>

          {/* Regime Comparison */}
          <div className="grid sm:grid-cols-2 gap-3">
            <ComparisonBar oldVal={Math.round(breakdown.inHandOld / d)} newVal={Math.round(breakdown.inHandNew / d)} label={`${viewMode === 'monthly' ? 'Monthly' : 'Annual'} In-Hand Salary`} />
            <ComparisonBar oldVal={Math.round(breakdown.taxOld / d)} newVal={Math.round(breakdown.taxNew / d)} label={`${viewMode === 'monthly' ? 'Monthly' : 'Annual'} Income Tax`} />
          </div>

          {/* Best Regime Badge */}
          <div className={`rounded-xl p-3 text-center text-sm font-medium ${bestRegime === 'new'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
            }`}>
            <Shield className="w-4 h-4 inline mr-1 -mt-0.5" />
            {bestRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'} saves you more!
            You save <strong>{fmtCurrency(Math.abs(breakdown.inHandNew - breakdown.inHandOld))}</strong>/year
            ({fmtCurrency(Math.round(Math.abs(breakdown.inHandNew - breakdown.inHandOld) / 12))}/month)
          </div>

          {/* CTC Breakdown Table */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">CTC Breakdown</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {resultRow('Basic Salary', breakdown.basic)}
                {resultRow('HRA', breakdown.hra)}
                {resultRow('Special Allowance', breakdown.specialAllowance)}
                {breakdown.lta > 0 && resultRow('LTA', breakdown.lta)}
                {breakdown.otherAllowances > 0 && resultRow('Other Allowances', breakdown.otherAllowances)}
                {breakdown.bonus > 0 && resultRow('Bonus / Variable', breakdown.bonus)}
                {resultRow('Employer PF', breakdown.employerPF, 'blue')}
                {breakdown.gratuity > 0 && resultRow('Gratuity', breakdown.gratuity, 'blue')}
                <div className="pt-1">
                  {resultRow('Total CTC', ctcVal, 'bold')}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Deductions</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {resultRow('Employee PF', breakdown.employeePF, 'red')}
                {resultRow('Professional Tax', breakdown.professionalTax, 'red')}
                {resultRow(`Tax (New Regime)`, breakdown.taxNew, 'red')}
                {resultRow(`Tax (Old Regime)`, breakdown.taxOld, 'red')}
                <div className="pt-1">
                  {resultRow('Gross Salary', breakdown.grossSalary, 'bold')}
                </div>
                <div className="pt-1">
                  {resultRow('In-Hand (New Regime)', breakdown.inHandNew, 'green')}
                  {resultRow('In-Hand (Old Regime)', breakdown.inHandOld, 'green')}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Chart */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Salary Distribution ({bestRegime === 'new' ? 'New' : 'Old'} Regime)</span>
            </div>
            <div className="flex justify-center">
              <DonutChart
                size={220}
                segments={[
                  { label: 'In-Hand', value: bestRegime === 'new' ? breakdown.inHandNew : breakdown.inHandOld, color: '#10b981' },
                  { label: 'Employee PF', value: breakdown.employeePF, color: '#3b82f6' },
                  { label: 'Income Tax', value: bestRegime === 'new' ? breakdown.taxNew : breakdown.taxOld, color: '#ef4444' },
                  { label: 'Professional Tax', value: breakdown.professionalTax, color: '#f59e0b' },
                  { label: 'Employer PF', value: breakdown.employerPF, color: '#8b5cf6' },
                  { label: 'Gratuity', value: breakdown.gratuity, color: '#ec4899' },
                ]}
              />
            </div>
          </div>

          {/* Tax Slabs Reference */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800/40 p-4">
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-2">New Regime Tax Slabs (FY 2025-26)</div>
              <div className="space-y-0.5 text-[11px] text-emerald-700 dark:text-emerald-300">
                <div className="flex justify-between"><span>Up to 4L</span><span>Nil</span></div>
                <div className="flex justify-between"><span>4L - 8L</span><span>5%</span></div>
                <div className="flex justify-between"><span>8L - 12L</span><span>10%</span></div>
                <div className="flex justify-between"><span>12L - 16L</span><span>15%</span></div>
                <div className="flex justify-between"><span>16L - 20L</span><span>20%</span></div>
                <div className="flex justify-between"><span>20L - 24L</span><span>25%</span></div>
                <div className="flex justify-between"><span>Above 24L</span><span>30%</span></div>
              </div>
              <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-500">Standard Deduction: 75,000 | Rebate up to 12L</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/40 p-4">
              <div className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-2">Old Regime Tax Slabs (FY 2025-26)</div>
              <div className="space-y-0.5 text-[11px] text-amber-700 dark:text-amber-300">
                <div className="flex justify-between"><span>Up to 2.5L</span><span>Nil</span></div>
                <div className="flex justify-between"><span>2.5L - 5L</span><span>5%</span></div>
                <div className="flex justify-between"><span>5L - 10L</span><span>20%</span></div>
                <div className="flex justify-between"><span>Above 10L</span><span>30%</span></div>
              </div>
              <div className="mt-2 text-[10px] text-amber-600 dark:text-amber-500">Standard Deduction: 50,000 | 80C/80D/HRA allowed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
