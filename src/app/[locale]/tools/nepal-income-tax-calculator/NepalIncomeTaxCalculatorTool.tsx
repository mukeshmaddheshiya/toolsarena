'use client';
import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { AlertTriangle, Info } from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatNPR(amount: number): string {
  return new Intl.NumberFormat('en-NP', { maximumFractionDigits: 0 }).format(amount);
}

function rs(amount: number): string {
  return `Rs ${formatNPR(amount)}`;
}

// ─── Tax Slab Types ───────────────────────────────────────────────────────────

interface TaxSlab {
  min: number;
  max: number;
  rate: number;
  label: string;
  color: string;
  bgLight: string;
  bgDark: string;
}

// ─── FY 2081/82 (2024/25) Slabs ──────────────────────────────────────────────

const SLABS_SINGLE_2081: TaxSlab[] = [
  {
    min: 0, max: 500000, rate: 0.01,
    label: 'Up to Rs 5,00,000', color: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-50', bgDark: 'dark:bg-emerald-900/20',
  },
  {
    min: 500000, max: 700000, rate: 0.10,
    label: 'Rs 5,00,001 – 7,00,000', color: 'text-yellow-600 dark:text-yellow-400',
    bgLight: 'bg-yellow-50', bgDark: 'dark:bg-yellow-900/20',
  },
  {
    min: 700000, max: 2000000, rate: 0.20,
    label: 'Rs 7,00,001 – 20,00,000', color: 'text-orange-600 dark:text-orange-400',
    bgLight: 'bg-orange-50', bgDark: 'dark:bg-orange-900/20',
  },
  {
    min: 2000000, max: 4000000, rate: 0.30,
    label: 'Rs 20,00,001 – 40,00,000', color: 'text-red-500 dark:text-red-400',
    bgLight: 'bg-red-50', bgDark: 'dark:bg-red-900/20',
  },
  {
    min: 4000000, max: Infinity, rate: 0.36,
    label: 'Above Rs 40,00,000', color: 'text-red-700 dark:text-red-300',
    bgLight: 'bg-red-100', bgDark: 'dark:bg-red-900/30',
  },
];

const SLABS_MARRIED_2081: TaxSlab[] = [
  {
    min: 0, max: 600000, rate: 0.01,
    label: 'Up to Rs 6,00,000', color: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-50', bgDark: 'dark:bg-emerald-900/20',
  },
  {
    min: 600000, max: 800000, rate: 0.10,
    label: 'Rs 6,00,001 – 8,00,000', color: 'text-yellow-600 dark:text-yellow-400',
    bgLight: 'bg-yellow-50', bgDark: 'dark:bg-yellow-900/20',
  },
  {
    min: 800000, max: 2000000, rate: 0.20,
    label: 'Rs 8,00,001 – 20,00,000', color: 'text-orange-600 dark:text-orange-400',
    bgLight: 'bg-orange-50', bgDark: 'dark:bg-orange-900/20',
  },
  {
    min: 2000000, max: 4000000, rate: 0.30,
    label: 'Rs 20,00,001 – 40,00,000', color: 'text-red-500 dark:text-red-400',
    bgLight: 'bg-red-50', bgDark: 'dark:bg-red-900/20',
  },
  {
    min: 4000000, max: Infinity, rate: 0.36,
    label: 'Above Rs 40,00,000', color: 'text-red-700 dark:text-red-300',
    bgLight: 'bg-red-100', bgDark: 'dark:bg-red-900/30',
  },
];

// FY 2080/81 (2023/24) – same structure, only first two slabs differ slightly
const SLABS_SINGLE_2080: TaxSlab[] = [
  {
    min: 0, max: 500000, rate: 0.01,
    label: 'Up to Rs 5,00,000', color: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-50', bgDark: 'dark:bg-emerald-900/20',
  },
  {
    min: 500000, max: 700000, rate: 0.10,
    label: 'Rs 5,00,001 – 7,00,000', color: 'text-yellow-600 dark:text-yellow-400',
    bgLight: 'bg-yellow-50', bgDark: 'dark:bg-yellow-900/20',
  },
  {
    min: 700000, max: 2000000, rate: 0.20,
    label: 'Rs 7,00,001 – 20,00,000', color: 'text-orange-600 dark:text-orange-400',
    bgLight: 'bg-orange-50', bgDark: 'dark:bg-orange-900/20',
  },
  {
    min: 2000000, max: 4000000, rate: 0.30,
    label: 'Rs 20,00,001 – 40,00,000', color: 'text-red-500 dark:text-red-400',
    bgLight: 'bg-red-50', bgDark: 'dark:bg-red-900/20',
  },
  {
    min: 4000000, max: Infinity, rate: 0.36,
    label: 'Above Rs 40,00,000', color: 'text-red-700 dark:text-red-300',
    bgLight: 'bg-red-100', bgDark: 'dark:bg-red-900/30',
  },
];

const SLABS_MARRIED_2080: TaxSlab[] = [
  {
    min: 0, max: 600000, rate: 0.01,
    label: 'Up to Rs 6,00,000', color: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-50', bgDark: 'dark:bg-emerald-900/20',
  },
  {
    min: 600000, max: 800000, rate: 0.10,
    label: 'Rs 6,00,001 – 8,00,000', color: 'text-yellow-600 dark:text-yellow-400',
    bgLight: 'bg-yellow-50', bgDark: 'dark:bg-yellow-900/20',
  },
  {
    min: 800000, max: 2000000, rate: 0.20,
    label: 'Rs 8,00,001 – 20,00,000', color: 'text-orange-600 dark:text-orange-400',
    bgLight: 'bg-orange-50', bgDark: 'dark:bg-orange-900/20',
  },
  {
    min: 2000000, max: 4000000, rate: 0.30,
    label: 'Rs 20,00,001 – 40,00,000', color: 'text-red-500 dark:text-red-400',
    bgLight: 'bg-red-50', bgDark: 'dark:bg-red-900/20',
  },
  {
    min: 4000000, max: Infinity, rate: 0.36,
    label: 'Above Rs 40,00,000', color: 'text-red-700 dark:text-red-300',
    bgLight: 'bg-red-100', bgDark: 'dark:bg-red-900/30',
  },
];

// ─── Tax Engine ───────────────────────────────────────────────────────────────

type FiscalYear = '2081/82' | '2080/81';
type TaxpayerType = 'single' | 'married' | 'foreign';

interface SlabResult {
  slab: TaxSlab;
  taxableInSlab: number;
  taxInSlab: number;
}

interface TaxResult {
  grossIncome: number;
  pfDeduction: number;
  ssfDeduction: number;
  insuranceRebate: number;
  totalDeductions: number;
  taxableIncome: number;
  slabResults: SlabResult[];
  surcharge: number;   // 1% on income > 20L
  grossTax: number;
  totalTax: number;
  effectiveRate: number;
  monthlyTax: number;
}

function calcTax(
  annualIncome: number,
  taxpayerType: TaxpayerType,
  fiscalYear: FiscalYear,
  pfContribution: number,
  ssfContribution: number,
  insurancePremium: number,
): TaxResult {
  // For foreign employment: 50% exemption on income
  const grossIncome = taxpayerType === 'foreign' ? annualIncome * 0.50 : annualIncome;

  // PF deduction: full employee contribution allowed
  const pfDeduction = Math.min(pfContribution, annualIncome);

  // SSF rebate: 50% of SSF contribution or Rs 3,00,000, whichever is less
  const ssfDeduction = Math.min(ssfContribution * 0.5, 300000);

  // Insurance rebate: 15% of premium up to Rs 25,000 (max rebate)
  const rawInsuranceRebate = Math.min(insurancePremium * 0.15, 25000);

  const totalDeductions = pfDeduction + ssfDeduction;
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  // Select slabs
  let slabs: TaxSlab[];
  if (fiscalYear === '2081/82') {
    slabs = taxpayerType === 'married' ? SLABS_MARRIED_2081 : SLABS_SINGLE_2081;
  } else {
    slabs = taxpayerType === 'married' ? SLABS_MARRIED_2080 : SLABS_SINGLE_2080;
  }

  // Slab-by-slab calculation
  const slabResults: SlabResult[] = [];
  let grossTax = 0;
  for (const slab of slabs) {
    if (taxableIncome <= slab.min) break;
    const taxableInSlab = Math.min(taxableIncome, slab.max === Infinity ? taxableIncome : slab.max) - slab.min;
    const taxInSlab = taxableInSlab * slab.rate;
    grossTax += taxInSlab;
    slabResults.push({ slab, taxableInSlab, taxInSlab });
  }

  // Social security surtax: 1% on income above Rs 20,00,000
  const surcharge = taxableIncome > 2000000 ? (taxableIncome - 2000000) * 0.01 : 0;
  const grossTaxWithSurcharge = grossTax + surcharge;

  // Insurance rebate applied after tax calculation
  const insuranceRebate = Math.min(rawInsuranceRebate, grossTaxWithSurcharge);
  const totalTax = Math.max(0, grossTaxWithSurcharge - insuranceRebate);
  const effectiveRate = annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0;

  return {
    grossIncome,
    pfDeduction,
    ssfDeduction,
    insuranceRebate,
    totalDeductions,
    taxableIncome,
    slabResults,
    surcharge,
    grossTax: grossTaxWithSurcharge,
    totalTax,
    effectiveRate,
    monthlyTax: totalTax / 12,
  };
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function SlabBar({ result, maxTax }: { result: SlabResult; maxTax: number }) {
  const widthPct = maxTax > 0 ? Math.min((result.taxInSlab / maxTax) * 100, 100) : 0;
  const barColors: Record<string, string> = {
    'text-emerald-600 dark:text-emerald-400': 'bg-emerald-400',
    'text-yellow-600 dark:text-yellow-400': 'bg-yellow-400',
    'text-orange-600 dark:text-orange-400': 'bg-orange-400',
    'text-red-500 dark:text-red-400': 'bg-red-500',
    'text-red-700 dark:text-red-300': 'bg-red-700',
  };
  const barColor = barColors[result.slab.color] ?? 'bg-slate-400';

  return (
    <tr className={`${result.slab.bgLight} ${result.slab.bgDark} border-b border-slate-100 dark:border-slate-700/30`}>
      <td className="py-3 pl-3 pr-4">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{result.slab.label}</div>
        <div className={`text-xs font-bold ${result.slab.color}`}>{(result.slab.rate * 100).toFixed(0)}%</div>
      </td>
      <td className="py-3 px-3 text-sm text-right text-slate-700 dark:text-slate-300">
        {rs(result.taxableInSlab)}
      </td>
      <td className="py-3 pl-3 pr-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: `${widthPct}%` }}
            />
          </div>
          <span className={`text-sm font-semibold ${result.slab.color} whitespace-nowrap w-28 text-right`}>
            {rs(result.taxInSlab)}
          </span>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function NepalIncomeTaxCalculatorTool() {
  const [annualIncome, setAnnualIncome] = useState(600000);
  const [taxpayerType, setTaxpayerType] = useState<TaxpayerType>('single');
  const [fiscalYear, setFiscalYear] = useState<FiscalYear>('2081/82');
  const [pfContribution, setPfContribution] = useState(0);
  const [ssfContribution, setSsfContribution] = useState(0);
  const [insurancePremium, setInsurancePremium] = useState(0);
  const [showDeductions, setShowDeductions] = useState(false);

  const result = useMemo(
    () => calcTax(annualIncome, taxpayerType, fiscalYear, pfContribution, ssfContribution, insurancePremium),
    [annualIncome, taxpayerType, fiscalYear, pfContribution, ssfContribution, insurancePremium]
  );

  const maxSlabTax = Math.max(...result.slabResults.map((r) => r.taxInSlab), 1);

  const copyText = [
    `Nepal Income Tax Calculation – FY ${fiscalYear}`,
    `Taxpayer: ${taxpayerType === 'single' ? 'Individual (Single)' : taxpayerType === 'married' ? 'Individual (Married)' : 'Foreign Employment'}`,
    `Annual Income: ${rs(annualIncome)}`,
    `Total Deductions: ${rs(result.totalDeductions)}`,
    `Taxable Income: ${rs(result.taxableIncome)}`,
    `Total Tax: ${rs(result.totalTax)}`,
    `Effective Rate: ${result.effectiveRate.toFixed(2)}%`,
    `Monthly TDS: ${rs(result.monthlyTax)}`,
  ].join('\n');

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300">
          <strong>Note:</strong> This calculator is for reference only. Tax liability may vary based on your specific situation. Consult a Chartered Accountant or refer to the Inland Revenue Department (IRD) Nepal for exact calculations.
        </p>
      </div>

      {/* Configuration */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Fiscal Year */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Fiscal Year
          </label>
          <div className="flex gap-2">
            {(['2081/82', '2080/81'] as FiscalYear[]).map((fy) => (
              <button
                key={fy}
                onClick={() => setFiscalYear(fy)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                  fiscalYear === fy
                    ? 'bg-primary-800 text-white border-primary-800'
                    : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div>FY {fy}</div>
                <div className={`text-xs mt-0.5 ${fiscalYear === fy ? 'text-primary-200' : 'text-slate-400 dark:text-slate-500'}`}>
                  {fy === '2081/82' ? '2024/25 AD' : '2023/24 AD'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Taxpayer Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Taxpayer Type
          </label>
          <div className="space-y-2">
            {(
              [
                { value: 'single', label: 'Individual (Single)', sub: '1% slab up to Rs 5L' },
                { value: 'married', label: 'Individual (Married)', sub: '1% slab up to Rs 6L (+Rs 1L benefit)' },
                { value: 'foreign', label: 'Foreign Employment', sub: '50% income exemption applied' },
              ] as { value: TaxpayerType; label: string; sub: string }[]
            ).map(({ value, label, sub }) => (
              <label
                key={value}
                className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  taxpayerType === value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="taxpayerType"
                  value={value}
                  checked={taxpayerType === value}
                  onChange={() => setTaxpayerType(value)}
                  className="accent-primary-600"
                />
                <div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{sub}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Annual Income */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Annual Gross Income (Rs)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 dark:text-slate-400 font-medium select-none">
            Rs
          </span>
          <input
            type="number"
            min={0}
            step={10000}
            value={annualIncome || ''}
            onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 text-base"
            placeholder="e.g. 600000"
          />
        </div>
        {/* Quick shortcuts */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[300000, 500000, 700000, 1200000, 2000000, 3000000].map((v) => (
            <button
              key={v}
              onClick={() => setAnnualIncome(v)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                annualIncome === v
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {v >= 100000 ? `${(v / 100000).toFixed(0)}L` : formatNPR(v)}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Deductions */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <button
          onClick={() => setShowDeductions(!showDeductions)}
          className="flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-primary-400"
        >
          <Info className="w-4 h-4" />
          {showDeductions ? 'Hide' : 'Add'} Deductions & Rebates (Optional)
        </button>

        {showDeductions && (
          <div className="mt-4 grid sm:grid-cols-3 gap-4">
            {[
              {
                label: 'PF / CIT Contribution (Annual)',
                value: pfContribution,
                set: setPfContribution,
                hint: 'Full contribution deductible',
              },
              {
                label: 'SSF Contribution (Annual)',
                value: ssfContribution,
                set: setSsfContribution,
                hint: '50% deductible, max Rs 3,00,000',
              },
              {
                label: 'Life Insurance Premium (Annual)',
                value: insurancePremium,
                set: setInsurancePremium,
                hint: '15% rebate, max Rs 25,000',
              },
            ].map(({ label, value, set, hint }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {label}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 dark:text-slate-400 select-none">Rs</span>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={value || ''}
                    onChange={(e) => set(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
                    placeholder="0"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-heading font-semibold text-slate-800 dark:text-slate-200">
            Tax Calculation Result
          </h2>
          <CopyButton text={copyText} size="sm" label="Copy" />
        </div>

        {/* Hero Stats */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Taxable Income</div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-200">{rs(result.taxableIncome)}</div>
            {result.totalDeductions > 0 && (
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                After {rs(result.totalDeductions)} deductions
              </div>
            )}
          </div>
          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-center text-white">
            <div className="text-xs text-red-100 mb-1">Total Annual Tax</div>
            <div className="text-xl font-bold">{rs(result.totalTax)}</div>
            <div className="text-xs text-red-200 mt-0.5">Monthly TDS: {rs(result.monthlyTax)}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Effective Tax Rate</div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-200">
              {result.effectiveRate.toFixed(2)}%
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">On gross income</div>
          </div>
        </div>

        {/* Slab Breakdown */}
        {result.slabResults.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Tax by Slab
            </h3>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide py-2 pl-3 pr-4">
                      Income Slab
                    </th>
                    <th className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide py-2 px-3">
                      Taxable Amount
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide py-2 pl-3 pr-3">
                      Tax
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.slabResults.map((sr, i) => (
                    <SlabBar key={i} result={sr} maxTax={maxSlabTax} />
                  ))}
                  {result.surcharge > 0 && (
                    <tr className="bg-red-50 dark:bg-red-900/20 border-b border-slate-100 dark:border-slate-700/30">
                      <td className="py-3 pl-3 pr-4">
                        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Social Security Surtax</div>
                        <div className="text-xs font-bold text-red-600 dark:text-red-400">1% on income above Rs 20L</div>
                      </td>
                      <td className="py-3 px-3 text-sm text-right text-slate-700 dark:text-slate-300">
                        {rs(Math.max(0, result.taxableIncome - 2000000))}
                      </td>
                      <td className="py-3 pl-3 pr-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                          <span className="text-sm font-semibold text-red-600 dark:text-red-400 whitespace-nowrap w-28 text-right">
                            {rs(result.surcharge)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-white dark:bg-slate-800 border-t-2 border-slate-200 dark:border-slate-700">
                  <tr>
                    <td className="py-3 pl-3 pr-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Total Tax (before rebates)
                    </td>
                    <td className="py-3 px-3 text-sm text-right font-semibold text-slate-800 dark:text-slate-200">
                      {rs(result.grossTax)}
                    </td>
                    <td className="py-3 pl-3 pr-3" />
                  </tr>
                  {result.insuranceRebate > 0 && (
                    <tr className="border-t border-slate-100 dark:border-slate-700">
                      <td className="py-2.5 pl-3 pr-4 text-sm text-emerald-600 dark:text-emerald-400">
                        Insurance Premium Rebate
                      </td>
                      <td className="py-2.5 px-3 text-sm text-right text-emerald-600 dark:text-emerald-400 font-medium">
                        −{rs(result.insuranceRebate)}
                      </td>
                      <td className="py-2.5 pl-3 pr-3" />
                    </tr>
                  )}
                  <tr className="border-t-2 border-slate-300 dark:border-slate-600 bg-red-50 dark:bg-red-900/10">
                    <td className="py-3 pl-3 pr-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                      Net Tax Payable
                    </td>
                    <td className="py-3 px-3 text-sm text-right font-bold text-red-600 dark:text-red-400">
                      {rs(result.totalTax)}
                    </td>
                    <td className="py-3 pl-3 pr-3" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
            Enter an annual income above to see your tax breakdown.
          </div>
        )}

        {/* Income Waterfall */}
        {annualIncome > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Income Allocation
            </h3>
            <div className="space-y-2">
              {[
                {
                  label: 'Deductions (PF/SSF)',
                  value: result.totalDeductions,
                  pct: (result.totalDeductions / annualIncome) * 100,
                  bar: 'bg-blue-400',
                  text: 'text-blue-600 dark:text-blue-400',
                },
                {
                  label: 'Income Tax',
                  value: result.totalTax,
                  pct: (result.totalTax / annualIncome) * 100,
                  bar: 'bg-red-400',
                  text: 'text-red-600 dark:text-red-400',
                },
                {
                  label: 'Net Income (After Tax)',
                  value: annualIncome - result.totalTax - result.totalDeductions,
                  pct: ((annualIncome - result.totalTax - result.totalDeductions) / annualIncome) * 100,
                  bar: 'bg-emerald-400',
                  text: 'text-emerald-600 dark:text-emerald-400',
                },
              ].map(({ label, value, pct, bar, text }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-40 text-xs text-slate-600 dark:text-slate-400 shrink-0">{label}</div>
                  <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${bar}`}
                      style={{ width: `${Math.max(pct, 0)}%` }}
                    />
                  </div>
                  <div className={`text-xs font-semibold ${text} w-20 text-right shrink-0`}>
                    {pct.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 w-28 text-right shrink-0">
                    {rs(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deduction Summary */}
        {showDeductions && (result.pfDeduction > 0 || result.ssfDeduction > 0 || result.insuranceRebate > 0) && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
              Applied Deductions & Rebates
            </h4>
            <div className="space-y-1.5">
              {result.pfDeduction > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">PF/CIT Deduction (from taxable income)</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">−{rs(result.pfDeduction)}</span>
                </div>
              )}
              {result.ssfDeduction > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">SSF Deduction (50% of contribution)</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">−{rs(result.ssfDeduction)}</span>
                </div>
              )}
              {result.insuranceRebate > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Insurance Rebate (15%, max Rs 25,000)</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">−{rs(result.insuranceRebate)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reference Slab Table */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <h3 className="text-sm font-heading font-semibold text-slate-800 dark:text-slate-200 mb-3">
          FY {fiscalYear} Income Tax Slabs — {taxpayerType === 'married' ? 'Married' : 'Single'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 pr-4 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Income Range</th>
                <th className="text-right py-2 px-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Rate</th>
                <th className="text-right py-2 pl-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Tax on Range</th>
              </tr>
            </thead>
            <tbody>
              {(taxpayerType === 'married'
                ? fiscalYear === '2081/82' ? SLABS_MARRIED_2081 : SLABS_MARRIED_2080
                : fiscalYear === '2081/82' ? SLABS_SINGLE_2081 : SLABS_SINGLE_2080
              ).map((slab, i, arr) => {
                const rangeSize = slab.max === Infinity ? null : slab.max - slab.min;
                const taxOnRange = rangeSize !== null ? rangeSize * slab.rate : null;
                const prev = arr[i - 1];
                const cumulativeTax = arr.slice(0, i).reduce((sum, s) => {
                  const rs = s.max === Infinity ? 0 : (s.max - s.min) * s.rate;
                  return sum + rs;
                }, 0);
                return (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/30 last:border-0">
                    <td className={`py-2 pr-4 ${slab.color}`}>{slab.label}</td>
                    <td className={`py-2 px-3 text-right font-bold ${slab.color}`}>
                      {(slab.rate * 100).toFixed(0)}%
                    </td>
                    <td className="py-2 pl-3 text-right text-slate-600 dark:text-slate-400">
                      {taxOnRange !== null
                        ? `Up to ${rs(taxOnRange)} (cumulative: ${rs(cumulativeTax + taxOnRange)})`
                        : '—'}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-red-50 dark:bg-red-900/10 border-t border-slate-200 dark:border-slate-700">
                <td className="py-2 pr-4 text-red-600 dark:text-red-400 font-medium">Surtax on income &gt; Rs 20L</td>
                <td className="py-2 px-3 text-right font-bold text-red-600 dark:text-red-400">+1%</td>
                <td className="py-2 pl-3 text-right text-slate-500 dark:text-slate-400">Additional surcharge</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
