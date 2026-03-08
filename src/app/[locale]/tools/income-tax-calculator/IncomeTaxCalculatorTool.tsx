'use client';
import { useState, useMemo, useCallback } from 'react';
import {
  IndianRupee,
  Calculator,
  ChevronDown,
  ChevronUp,
  Shield,
  Copy,
  Check,
  Sparkles,
  TrendingDown,
  Award,
  Info,
} from 'lucide-react';

/* ─── Types ─── */
type FY = '2024-25' | '2025-26' | '2026-27';
type AgeGroup = 'below60' | '60to80' | 'above80';

interface IncomeInputs {
  grossSalary: string;
  housePropertyIncome: string;
  otherSourcesIncome: string;
  shortTermCapitalGains: string;
  longTermCapitalGains: string;
}

interface DeductionInputs {
  section80C: string;
  section80D: string;
  section80DParents: string;
  section80CCD1B: string;
  section80TTA: string;
  section24b: string;
  section80E: string;
  section80G: string;
  basicSalary: string;
  hraReceived: string;
  rentPaid: string;
  isMetro: boolean;
  employerNPS: string;
}

interface TaxResult {
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  slabTax: number;
  rebate87A: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  monthlyTakeHome: number;
  slabBreakdown: { label: string; amount: number; tax: number; rate: number }[];
}

/* ─── Constants ─── */
const FY_OPTIONS: { value: FY; label: string }[] = [
  { value: '2024-25', label: 'FY 2024-25 (AY 2025-26)' },
  { value: '2025-26', label: 'FY 2025-26 (AY 2026-27)' },
  { value: '2026-27', label: 'FY 2026-27 (AY 2027-28)' },
];

const AGE_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: 'below60', label: 'Below 60 years' },
  { value: '60to80', label: '60 to 80 years (Senior)' },
  { value: 'above80', label: 'Above 80 years (Super Senior)' },
];

const INR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const num = (s: string) => {
  const v = parseFloat(s.replace(/,/g, ''));
  return isNaN(v) ? 0 : Math.max(0, v);
};

/* ─── Tax slab helpers ─── */
function getOldSlabs(fy: FY, age: AgeGroup) {
  // Old regime slabs are same across FY 2024-27 for our purposes
  if (age === 'above80') {
    return [
      { upto: 500000, rate: 0 },
      { upto: 1000000, rate: 0.20 },
      { upto: Infinity, rate: 0.30 },
    ];
  }
  if (age === '60to80') {
    return [
      { upto: 300000, rate: 0 },
      { upto: 500000, rate: 0.05 },
      { upto: 1000000, rate: 0.20 },
      { upto: Infinity, rate: 0.30 },
    ];
  }
  return [
    { upto: 250000, rate: 0 },
    { upto: 500000, rate: 0.05 },
    { upto: 1000000, rate: 0.20 },
    { upto: Infinity, rate: 0.30 },
  ];
}

function getNewSlabs(fy: FY) {
  if (fy === '2024-25') {
    return [
      { upto: 300000, rate: 0 },
      { upto: 700000, rate: 0.05 },
      { upto: 1000000, rate: 0.10 },
      { upto: 1200000, rate: 0.15 },
      { upto: 1500000, rate: 0.20 },
      { upto: Infinity, rate: 0.30 },
    ];
  }
  // FY 2025-26 and 2026-27
  return [
    { upto: 400000, rate: 0 },
    { upto: 800000, rate: 0.05 },
    { upto: 1200000, rate: 0.10 },
    { upto: 1600000, rate: 0.15 },
    { upto: 2000000, rate: 0.20 },
    { upto: 2400000, rate: 0.25 },
    { upto: Infinity, rate: 0.30 },
  ];
}

function computeSlabTax(income: number, slabs: { upto: number; rate: number }[]) {
  let remaining = income;
  let tax = 0;
  let prev = 0;
  const breakdown: { label: string; amount: number; tax: number; rate: number }[] = [];

  for (const slab of slabs) {
    if (remaining <= 0) break;
    const slabWidth = slab.upto === Infinity ? remaining : slab.upto - prev;
    const taxable = Math.min(remaining, slabWidth);
    const slabTax = taxable * slab.rate;
    breakdown.push({
      label: slab.upto === Infinity ? `Above ${INR(prev)}` : `${INR(prev)} - ${INR(slab.upto)}`,
      amount: taxable,
      tax: slabTax,
      rate: slab.rate * 100,
    });
    tax += slabTax;
    remaining -= taxable;
    prev = slab.upto;
  }
  return { tax, breakdown };
}

function getSurcharge(income: number, tax: number): number {
  if (income <= 5000000) return 0;
  if (income <= 10000000) return tax * 0.10;
  if (income <= 20000000) return tax * 0.15;
  if (income <= 50000000) return tax * 0.25;
  return tax * 0.37;
}

function getNewRegimeSurcharge(income: number, tax: number): number {
  if (income <= 5000000) return 0;
  if (income <= 10000000) return tax * 0.10;
  if (income <= 20000000) return tax * 0.15;
  // New regime caps surcharge at 25%
  return tax * 0.25;
}

function getRebate87A(taxableIncome: number, slabTax: number, isNew: boolean, fy: FY): number {
  if (isNew) {
    if (fy === '2024-25') {
      return taxableIncome <= 700000 ? Math.min(slabTax, 25000) : 0;
    }
    // FY 2025-26+: rebate up to 60K for income up to 12L
    return taxableIncome <= 1200000 ? Math.min(slabTax, 60000) : 0;
  }
  // Old regime: rebate for income up to 5L
  return taxableIncome <= 500000 ? Math.min(slabTax, 12500) : 0;
}

function calcHRAExemption(basic: number, hraReceived: number, rentPaid: number, isMetro: boolean): number {
  if (basic <= 0 || hraReceived <= 0 || rentPaid <= 0) return 0;
  const a = hraReceived;
  const b = rentPaid - 0.10 * basic;
  const c = (isMetro ? 0.50 : 0.40) * basic;
  return Math.max(0, Math.min(a, b, c));
}

/* ─── Donut Chart SVG ─── */
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;
  const radius = 60;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 160 160" className="w-40 h-40">
        {segments
          .filter((s) => s.value > 0)
          .map((seg) => {
            const pct = seg.value / total;
            const dash = pct * circumference;
            const gap = circumference - dash;
            const currentOffset = offset;
            offset += dash;
            return (
              <circle
                key={seg.label}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="20"
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-currentOffset}
                className="transition-all duration-500"
              />
            );
          })}
        <text x={cx} y={cy - 6} textAnchor="middle" className="fill-gray-800 dark:fill-gray-200 text-[10px] font-semibold">
          Total Tax
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" className="fill-indigo-600 dark:fill-indigo-400 text-[11px] font-bold">
          {INR(total)}
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        {segments
          .filter((s) => s.value > 0)
          .map((seg) => (
            <span key={seg.label} className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="text-gray-600 dark:text-gray-400">{seg.label}</span>
            </span>
          ))}
      </div>
    </div>
  );
}

/* ─── Input helper ─── */
function Field({
  label,
  value,
  onChange,
  max,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
        {max && <span className="text-gray-400 dark:text-gray-500 ml-1">(max {INR(max)})</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">&#8377;</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          placeholder="0"
        />
      </div>
      {hint && <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

/* ─── Main Component ─── */
export function IncomeTaxCalculatorTool() {
  const [fy, setFy] = useState<FY>('2025-26');
  const [age, setAge] = useState<AgeGroup>('below60');
  const [copied, setCopied] = useState(false);
  const [showOldSlabs, setShowOldSlabs] = useState(false);
  const [showNewSlabs, setShowNewSlabs] = useState(false);

  const [income, setIncome] = useState<IncomeInputs>({
    grossSalary: '',
    housePropertyIncome: '',
    otherSourcesIncome: '',
    shortTermCapitalGains: '',
    longTermCapitalGains: '',
  });

  const [deductions, setDeductions] = useState<DeductionInputs>({
    section80C: '',
    section80D: '',
    section80DParents: '',
    section80CCD1B: '',
    section80TTA: '',
    section24b: '',
    section80E: '',
    section80G: '',
    basicSalary: '',
    hraReceived: '',
    rentPaid: '',
    isMetro: true,
    employerNPS: '',
  });

  const updateIncome = useCallback(
    (key: keyof IncomeInputs, val: string) => setIncome((prev) => ({ ...prev, [key]: val })),
    [],
  );
  const updateDeductions = useCallback(
    (key: keyof DeductionInputs, val: string | boolean) => setDeductions((prev) => ({ ...prev, [key]: val })),
    [],
  );

  const tryExample = useCallback(() => {
    setFy('2025-26');
    setAge('below60');
    setIncome({
      grossSalary: '1200000',
      housePropertyIncome: '0',
      otherSourcesIncome: '50000',
      shortTermCapitalGains: '0',
      longTermCapitalGains: '0',
    });
    setDeductions({
      section80C: '150000',
      section80D: '25000',
      section80DParents: '0',
      section80CCD1B: '50000',
      section80TTA: '10000',
      section24b: '200000',
      section80E: '0',
      section80G: '0',
      basicSalary: '480000',
      hraReceived: '240000',
      rentPaid: '20000',
      isMetro: true,
      employerNPS: '0',
    });
  }, []);

  /* ─── Compute ─── */
  const { oldResult, newResult } = useMemo(() => {
    const grossSalary = num(income.grossSalary);
    const houseProp = num(income.housePropertyIncome);
    const otherSrc = num(income.otherSourcesIncome);
    const stcg = num(income.shortTermCapitalGains);
    const ltcg = num(income.longTermCapitalGains);

    const totalGross = grossSalary + houseProp + otherSrc + stcg + ltcg;

    // ─── Old regime ───
    const oldStdDeduction = fy === '2024-25' ? 50000 : 50000;
    const sec80C = Math.min(num(deductions.section80C), 150000);
    const sec80D_self = Math.min(num(deductions.section80D), age === 'below60' ? 25000 : 50000);
    const sec80D_parents = Math.min(num(deductions.section80DParents), 50000);
    const sec80D = sec80D_self + sec80D_parents;
    const sec80CCD1B = Math.min(num(deductions.section80CCD1B), 50000);
    const sec80TTA = Math.min(num(deductions.section80TTA), 10000);
    const sec24b = Math.min(num(deductions.section24b), 200000);
    const sec80E = num(deductions.section80E);
    const sec80G = num(deductions.section80G);

    const basicSal = num(deductions.basicSalary);
    const hraRcvd = num(deductions.hraReceived);
    const rentPd = num(deductions.rentPaid) * 12;
    const hraExemption = calcHRAExemption(basicSal, hraRcvd, rentPd, deductions.isMetro);

    const oldTotalDeductions = oldStdDeduction + sec80C + sec80D + sec80CCD1B + sec80TTA + sec24b + sec80E + sec80G + hraExemption;
    const oldTaxableIncome = Math.max(0, totalGross - oldTotalDeductions);

    const oldSlabs = getOldSlabs(fy, age);
    const { tax: oldSlabTax, breakdown: oldBreakdown } = computeSlabTax(oldTaxableIncome, oldSlabs);
    const oldRebate = getRebate87A(oldTaxableIncome, oldSlabTax, false, fy);
    const oldTaxAfterRebate = Math.max(0, oldSlabTax - oldRebate);
    const oldSurcharge = getSurcharge(oldTaxableIncome, oldTaxAfterRebate);
    const oldCess = (oldTaxAfterRebate + oldSurcharge) * 0.04;
    const oldTotalTax = Math.round(oldTaxAfterRebate + oldSurcharge + oldCess);

    const oldRes: TaxResult = {
      grossIncome: totalGross,
      standardDeduction: oldStdDeduction,
      totalDeductions: oldTotalDeductions,
      taxableIncome: oldTaxableIncome,
      slabTax: oldSlabTax,
      rebate87A: oldRebate,
      taxAfterRebate: oldTaxAfterRebate,
      surcharge: oldSurcharge,
      cess: oldCess,
      totalTax: oldTotalTax,
      effectiveRate: totalGross > 0 ? (oldTotalTax / totalGross) * 100 : 0,
      monthlyTakeHome: Math.round((totalGross - oldTotalTax) / 12),
      slabBreakdown: oldBreakdown,
    };

    // ─── New regime ───
    const newStdDeduction = fy === '2024-25' ? 50000 : 75000;
    const empNPS = num(deductions.employerNPS);
    const newTotalDeductions = newStdDeduction + empNPS;
    const newTaxableIncome = Math.max(0, totalGross - newTotalDeductions);

    const newSlabs = getNewSlabs(fy);
    const { tax: newSlabTax, breakdown: newBreakdown } = computeSlabTax(newTaxableIncome, newSlabs);
    const newRebate = getRebate87A(newTaxableIncome, newSlabTax, true, fy);
    const newTaxAfterRebate = Math.max(0, newSlabTax - newRebate);
    const newSurcharge = getNewRegimeSurcharge(newTaxableIncome, newTaxAfterRebate);
    const newCess = (newTaxAfterRebate + newSurcharge) * 0.04;
    const newTotalTax = Math.round(newTaxAfterRebate + newSurcharge + newCess);

    const newRes: TaxResult = {
      grossIncome: totalGross,
      standardDeduction: newStdDeduction,
      totalDeductions: newTotalDeductions,
      taxableIncome: newTaxableIncome,
      slabTax: newSlabTax,
      rebate87A: newRebate,
      taxAfterRebate: newTaxAfterRebate,
      surcharge: newSurcharge,
      cess: newCess,
      totalTax: newTotalTax,
      effectiveRate: totalGross > 0 ? (newTotalTax / totalGross) * 100 : 0,
      monthlyTakeHome: Math.round((totalGross - newTotalTax) / 12),
      slabBreakdown: newBreakdown,
    };

    return { oldResult: oldRes, newResult: newRes };
  }, [income, deductions, fy, age]);

  const savings = oldResult.totalTax - newResult.totalTax;
  const recommended = savings >= 0 ? 'new' : 'old';
  const absSavings = Math.abs(savings);
  const hasIncome = oldResult.grossIncome > 0;

  const copySummary = useCallback(() => {
    const lines = [
      `Income Tax Summary (${fy})`,
      `Age: ${AGE_OPTIONS.find((a) => a.value === age)?.label}`,
      `Gross Income: ${INR(oldResult.grossIncome)}`,
      '',
      `OLD REGIME:`,
      `  Taxable Income: ${INR(oldResult.taxableIncome)}`,
      `  Total Tax: ${INR(oldResult.totalTax)}`,
      `  Effective Rate: ${oldResult.effectiveRate.toFixed(1)}%`,
      `  Monthly Take-Home: ${INR(oldResult.monthlyTakeHome)}`,
      '',
      `NEW REGIME:`,
      `  Taxable Income: ${INR(newResult.taxableIncome)}`,
      `  Total Tax: ${INR(newResult.totalTax)}`,
      `  Effective Rate: ${newResult.effectiveRate.toFixed(1)}%`,
      `  Monthly Take-Home: ${INR(newResult.monthlyTakeHome)}`,
      '',
      `Recommendation: ${recommended === 'new' ? 'New' : 'Old'} Regime saves you ${INR(absSavings)}/year`,
      '',
      'Calculated at toolsarena.in/tools/income-tax-calculator',
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [fy, age, oldResult, newResult, recommended, absSavings]);

  /* ─── Render ─── */
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 md:p-8 text-white">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Calculator className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Income Tax Calculator India</h1>
            <p className="text-indigo-100 text-sm mt-1">
              Comprehensive tax calculator with all deductions, Old vs New regime comparison, and slab-wise breakdown.
            </p>
          </div>
          <button
            onClick={tryExample}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Try Example (12L)
          </button>
        </div>
      </div>

      {/* FY + Age selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Financial Year</label>
          <select
            value={fy}
            onChange={(e) => setFy(e.target.value as FY)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {FY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Age Group</label>
          <select
            value={age}
            onChange={(e) => setAge(e.target.value as AgeGroup)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {AGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Income Inputs */}
      <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-indigo-500" />
          Income Details (Annual)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Gross Salary / CTC" value={income.grossSalary} onChange={(v) => updateIncome('grossSalary', v)} />
          <Field label="Income from House Property" value={income.housePropertyIncome} onChange={(v) => updateIncome('housePropertyIncome', v)} hint="Rental income minus 30% std deduction" />
          <Field label="Income from Other Sources" value={income.otherSourcesIncome} onChange={(v) => updateIncome('otherSourcesIncome', v)} hint="Interest, dividends, etc." />
          <Field label="Short-Term Capital Gains" value={income.shortTermCapitalGains} onChange={(v) => updateIncome('shortTermCapitalGains', v)} />
          <Field label="Long-Term Capital Gains" value={income.longTermCapitalGains} onChange={(v) => updateIncome('longTermCapitalGains', v)} />
        </div>
      </div>

      {/* Old Regime Deductions */}
      <div className="p-5 rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-950/20">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-indigo-500" />
          Old Regime Deductions
        </h2>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4">
          These deductions apply only under the Old Tax Regime. The New Regime only allows Std Deduction + Employer NPS.
        </p>

        {/* HRA Section */}
        <div className="mb-4 p-3 rounded-lg bg-white/70 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">HRA Exemption Calculation</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Basic Salary (Annual)" value={deductions.basicSalary} onChange={(v) => updateDeductions('basicSalary', v)} />
            <Field label="HRA Received (Annual)" value={deductions.hraReceived} onChange={(v) => updateDeductions('hraReceived', v)} />
            <Field label="Rent Paid (Monthly)" value={deductions.rentPaid} onChange={(v) => updateDeductions('rentPaid', v)} />
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">City Type</label>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => updateDeductions('isMetro', true)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    deductions.isMetro
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Metro
                </button>
                <button
                  onClick={() => updateDeductions('isMetro', false)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    !deductions.isMetro
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Non-Metro
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Section 80C (PPF, ELSS, LIC...)" value={deductions.section80C} onChange={(v) => updateDeductions('section80C', v)} max={150000} />
          <Field label="Section 80D - Self/Family" value={deductions.section80D} onChange={(v) => updateDeductions('section80D', v)} max={age === 'below60' ? 25000 : 50000} hint="Health insurance premium" />
          <Field label="Section 80D - Parents" value={deductions.section80DParents} onChange={(v) => updateDeductions('section80DParents', v)} max={50000} hint="Parents health insurance" />
          <Field label="Section 80CCD(1B) - NPS" value={deductions.section80CCD1B} onChange={(v) => updateDeductions('section80CCD1B', v)} max={50000} />
          <Field label="Section 80TTA - Savings Interest" value={deductions.section80TTA} onChange={(v) => updateDeductions('section80TTA', v)} max={10000} />
          <Field label="Sec 24(b) - Home Loan Interest" value={deductions.section24b} onChange={(v) => updateDeductions('section24b', v)} max={200000} />
          <Field label="Section 80E - Education Loan" value={deductions.section80E} onChange={(v) => updateDeductions('section80E', v)} hint="No upper limit" />
          <Field label="Section 80G - Donations" value={deductions.section80G} onChange={(v) => updateDeductions('section80G', v)} hint="Eligible donation amount" />
        </div>
      </div>

      {/* New Regime Deductions */}
      <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-500" />
          New Regime Deductions
        </h2>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4">
          Std Deduction of {INR(fy === '2024-25' ? 50000 : 75000)} is auto-applied. Only employer NPS (Sec 80CCD(2)) is additionally allowed.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Employer NPS Contribution (Sec 80CCD(2))" value={deductions.employerNPS} onChange={(v) => updateDeductions('employerNPS', v)} hint="Up to 10% of basic salary" />
        </div>
      </div>

      {/* ─── Results ─── */}
      {hasIncome && (
        <div className="space-y-6">
          {/* Recommendation Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 border border-indigo-200 dark:border-indigo-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {recommended === 'new' ? 'New Regime' : 'Old Regime'} is better for you
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You save {INR(absSavings)}/year ({INR(Math.round(absSavings / 12))}/month) with the{' '}
                  {recommended === 'new' ? 'New' : 'Old'} Regime
                </p>
              </div>
            </div>
            <button
              onClick={copySummary}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Old Regime Card */}
            <div className={`p-5 rounded-xl border-2 transition-colors ${
              recommended === 'old'
                ? 'border-indigo-500 bg-white dark:bg-gray-900'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Old Regime</h3>
                {recommended === 'old' && (
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded-full uppercase tracking-wide">
                    Recommended
                  </span>
                )}
              </div>
              <div className="space-y-2.5 text-sm">
                <Row label="Gross Income" value={INR(oldResult.grossIncome)} />
                <Row label="Standard Deduction" value={`- ${INR(oldResult.standardDeduction)}`} muted />
                <Row label="Chapter VIA + HRA" value={`- ${INR(oldResult.totalDeductions - oldResult.standardDeduction)}`} muted />
                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                <Row label="Taxable Income" value={INR(oldResult.taxableIncome)} bold />
                <Row label="Slab Tax" value={INR(oldResult.slabTax)} muted />
                {oldResult.rebate87A > 0 && <Row label="Rebate u/s 87A" value={`- ${INR(oldResult.rebate87A)}`} green />}
                {oldResult.surcharge > 0 && <Row label="Surcharge" value={`+ ${INR(Math.round(oldResult.surcharge))}`} muted />}
                <Row label="4% Cess" value={`+ ${INR(Math.round(oldResult.cess))}`} muted />
                <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
                <Row label="Total Tax" value={INR(oldResult.totalTax)} bold accent />
                <Row label="Effective Rate" value={`${oldResult.effectiveRate.toFixed(1)}%`} />
                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                <Row label="Monthly Take-Home" value={INR(oldResult.monthlyTakeHome)} bold />
              </div>

              {/* Slab breakdown toggle */}
              <button
                onClick={() => setShowOldSlabs(!showOldSlabs)}
                className="mt-3 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {showOldSlabs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Slab-wise breakdown
              </button>
              {showOldSlabs && (
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                        <th className="text-left py-1 font-medium">Slab</th>
                        <th className="text-right py-1 font-medium">Rate</th>
                        <th className="text-right py-1 font-medium">Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {oldResult.slabBreakdown.map((s) => (
                        <tr key={s.label} className="border-b border-gray-50 dark:border-gray-800">
                          <td className="py-1 text-gray-600 dark:text-gray-400">{s.label}</td>
                          <td className="py-1 text-right text-gray-600 dark:text-gray-400">{s.rate}%</td>
                          <td className="py-1 text-right font-medium text-gray-800 dark:text-gray-200">{INR(s.tax)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* New Regime Card */}
            <div className={`p-5 rounded-xl border-2 transition-colors ${
              recommended === 'new'
                ? 'border-indigo-500 bg-white dark:bg-gray-900'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">New Regime</h3>
                {recommended === 'new' && (
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded-full uppercase tracking-wide">
                    Recommended
                  </span>
                )}
              </div>
              <div className="space-y-2.5 text-sm">
                <Row label="Gross Income" value={INR(newResult.grossIncome)} />
                <Row label="Standard Deduction" value={`- ${INR(newResult.standardDeduction)}`} muted />
                {num(deductions.employerNPS) > 0 && (
                  <Row label="Employer NPS (80CCD(2))" value={`- ${INR(num(deductions.employerNPS))}`} muted />
                )}
                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                <Row label="Taxable Income" value={INR(newResult.taxableIncome)} bold />
                <Row label="Slab Tax" value={INR(newResult.slabTax)} muted />
                {newResult.rebate87A > 0 && <Row label="Rebate u/s 87A" value={`- ${INR(newResult.rebate87A)}`} green />}
                {newResult.surcharge > 0 && <Row label="Surcharge" value={`+ ${INR(Math.round(newResult.surcharge))}`} muted />}
                <Row label="4% Cess" value={`+ ${INR(Math.round(newResult.cess))}`} muted />
                <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
                <Row label="Total Tax" value={INR(newResult.totalTax)} bold accent />
                <Row label="Effective Rate" value={`${newResult.effectiveRate.toFixed(1)}%`} />
                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                <Row label="Monthly Take-Home" value={INR(newResult.monthlyTakeHome)} bold />
              </div>

              <button
                onClick={() => setShowNewSlabs(!showNewSlabs)}
                className="mt-3 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {showNewSlabs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Slab-wise breakdown
              </button>
              {showNewSlabs && (
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                        <th className="text-left py-1 font-medium">Slab</th>
                        <th className="text-right py-1 font-medium">Rate</th>
                        <th className="text-right py-1 font-medium">Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newResult.slabBreakdown.map((s) => (
                        <tr key={s.label} className="border-b border-gray-50 dark:border-gray-800">
                          <td className="py-1 text-gray-600 dark:text-gray-400">{s.label}</td>
                          <td className="py-1 text-right text-gray-600 dark:text-gray-400">{s.rate}%</td>
                          <td className="py-1 text-right font-medium text-gray-800 dark:text-gray-200">{INR(s.tax)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col items-center">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">Old Regime Tax Breakdown</p>
              <DonutChart
                segments={[
                  { label: 'Slab Tax', value: Math.max(0, oldResult.taxAfterRebate), color: '#6366f1' },
                  { label: 'Surcharge', value: oldResult.surcharge, color: '#f59e0b' },
                  { label: 'Cess', value: oldResult.cess, color: '#10b981' },
                ]}
              />
            </div>
            <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col items-center">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">New Regime Tax Breakdown</p>
              <DonutChart
                segments={[
                  { label: 'Slab Tax', value: Math.max(0, newResult.taxAfterRebate), color: '#6366f1' },
                  { label: 'Surcharge', value: newResult.surcharge, color: '#f59e0b' },
                  { label: 'Cess', value: newResult.cess, color: '#10b981' },
                ]}
              />
            </div>
          </div>

          {/* Quick comparison bar */}
          <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-4">Quick Comparison</h3>
            <div className="space-y-3">
              <CompareBar label="Total Tax" oldVal={oldResult.totalTax} newVal={newResult.totalTax} />
              <CompareBar label="Taxable Income" oldVal={oldResult.taxableIncome} newVal={newResult.taxableIncome} />
              <CompareBar label="Monthly Take-Home" oldVal={oldResult.monthlyTakeHome} newVal={newResult.monthlyTakeHome} higher />
            </div>
          </div>
        </div>
      )}

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-2 py-4 text-xs text-gray-400 dark:text-gray-500">
        <Shield className="w-3.5 h-3.5" />
        <span>All calculations happen in your browser. No data is stored or sent to any server.</span>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */
function Row({
  label,
  value,
  bold,
  muted,
  accent,
  green,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
  accent?: boolean;
  green?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={`${muted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'} ${bold ? 'font-semibold' : ''}`}>
        {label}
      </span>
      <span
        className={`${bold ? 'font-bold' : 'font-medium'} ${
          accent
            ? 'text-indigo-600 dark:text-indigo-400'
            : green
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-gray-800 dark:text-gray-200'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function CompareBar({
  label,
  oldVal,
  newVal,
  higher,
}: {
  label: string;
  oldVal: number;
  newVal: number;
  higher?: boolean;
}) {
  const maxVal = Math.max(oldVal, newVal, 1);
  const oldPct = (oldVal / maxVal) * 100;
  const newPct = (newVal / maxVal) * 100;
  const oldBetter = higher ? oldVal > newVal : oldVal < newVal;
  const newBetter = higher ? newVal > oldVal : newVal < oldVal;

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>{label}</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] w-8 text-gray-400 shrink-0">Old</span>
          <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${oldBetter ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              style={{ width: `${oldPct}%` }}
            />
          </div>
          <span className={`text-xs w-24 text-right font-medium ${oldBetter ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {INR(oldVal)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] w-8 text-gray-400 shrink-0">New</span>
          <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${newBetter ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              style={{ width: `${newPct}%` }}
            />
          </div>
          <span className={`text-xs w-24 text-right font-medium ${newBetter ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {INR(newVal)}
          </span>
        </div>
      </div>
    </div>
  );
}
