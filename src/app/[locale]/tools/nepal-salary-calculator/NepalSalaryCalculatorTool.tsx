'use client';
import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatNPR(amount: number): string {
  return new Intl.NumberFormat('en-NP', { maximumFractionDigits: 0 }).format(amount);
}

function rs(amount: number): string {
  return `Rs ${formatNPR(amount)}`;
}

// ─── Tax Calculation (FY 2081/82) ───────────────────────────────────────────

interface TaxSlab {
  min: number;
  max: number;
  rate: number;
  label: string;
}

const TAX_SLABS_SINGLE: TaxSlab[] = [
  { min: 0,       max: 500000,   rate: 0.01, label: 'Up to Rs 5,00,000 @ 1%' },
  { min: 500000,  max: 700000,   rate: 0.10, label: 'Rs 5,00,001–7,00,000 @ 10%' },
  { min: 700000,  max: 2000000,  rate: 0.20, label: 'Rs 7,00,001–20,00,000 @ 20%' },
  { min: 2000000, max: 4000000,  rate: 0.30, label: 'Rs 20,00,001–40,00,000 @ 30%' },
  { min: 4000000, max: Infinity, rate: 0.36, label: 'Above Rs 40,00,000 @ 36%' },
];

const TAX_SLABS_MARRIED: TaxSlab[] = [
  { min: 0,       max: 600000,   rate: 0.01, label: 'Up to Rs 6,00,000 @ 1%' },
  { min: 600000,  max: 800000,   rate: 0.10, label: 'Rs 6,00,001–8,00,000 @ 10%' },
  { min: 800000,  max: 2000000,  rate: 0.20, label: 'Rs 8,00,001–20,00,000 @ 20%' },
  { min: 2000000, max: 4000000,  rate: 0.30, label: 'Rs 20,00,001–40,00,000 @ 30%' },
  { min: 4000000, max: Infinity, rate: 0.36, label: 'Above Rs 40,00,000 @ 36%' },
];

function calcAnnualTax(annualTaxableIncome: number, isMarried: boolean): number {
  const slabs = isMarried ? TAX_SLABS_MARRIED : TAX_SLABS_SINGLE;
  let tax = 0;
  for (const slab of slabs) {
    if (annualTaxableIncome <= slab.min) break;
    const taxable = Math.min(annualTaxableIncome, slab.max) - slab.min;
    tax += taxable * slab.rate;
  }
  // Social security surtax: 1% on income above Rs 20,00,000
  if (annualTaxableIncome > 2000000) {
    tax += (annualTaxableIncome - 2000000) * 0.01;
  }
  return tax;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type DeductionType = 'pf' | 'cit' | 'ssf';
type MaritalStatus = 'single' | 'married';

interface SalaryInputs {
  basicSalary: number;
  gradeAllowance: number;
  dearnessAllowance: number;
  otherAllowances: number;
  deductionType: DeductionType;
  maritalStatus: MaritalStatus;
}

interface SalaryBreakdown {
  basicSalary: number;
  gradeAllowance: number;
  dearnessAllowance: number;
  otherAllowances: number;
  grossSalary: number;
  // Deductions
  employeeDeduction: number;   // PF/CIT/SSF employee share
  employerContribution: number; // PF/CIT/SSF employer share
  deductionLabel: string;
  // Tax
  annualGross: number;
  annualEmployeeDeduction: number;
  annualTaxableIncome: number;
  monthlyTax: number;
  annualTax: number;
  // Net
  netSalary: number;
  ctcTotal: number; // gross + employer contribution
}

function calcSalary(inputs: SalaryInputs): SalaryBreakdown {
  const { basicSalary, gradeAllowance, dearnessAllowance, otherAllowances, deductionType, maritalStatus } = inputs;
  const grossSalary = basicSalary + gradeAllowance + dearnessAllowance + otherAllowances;

  let employeeDeduction = 0;
  let employerContribution = 0;
  let deductionLabel = '';

  if (deductionType === 'pf') {
    employeeDeduction = basicSalary * 0.10;
    employerContribution = basicSalary * 0.10;
    deductionLabel = 'PF (10% of Basic)';
  } else if (deductionType === 'cit') {
    employeeDeduction = basicSalary * 0.10;
    employerContribution = basicSalary * 0.10;
    deductionLabel = 'CIT (10% of Basic)';
  } else {
    // SSF: 11% of gross for employee, 20% of gross for employer
    employeeDeduction = grossSalary * 0.11;
    employerContribution = grossSalary * 0.20;
    deductionLabel = 'SSF (11% of Gross)';
  }

  // Annual figures for tax calculation
  const annualGross = grossSalary * 12;
  const annualEmployeeDeduction = employeeDeduction * 12;

  // Taxable income = Annual gross - PF/CIT/SSF employee contribution
  const annualTaxableIncome = Math.max(0, annualGross - annualEmployeeDeduction);
  const annualTax = calcAnnualTax(annualTaxableIncome, maritalStatus === 'married');
  const monthlyTax = annualTax / 12;

  const netSalary = grossSalary - employeeDeduction - monthlyTax;
  const ctcTotal = grossSalary + employerContribution;

  return {
    basicSalary,
    gradeAllowance,
    dearnessAllowance,
    otherAllowances,
    grossSalary,
    employeeDeduction,
    employerContribution,
    deductionLabel,
    annualGross,
    annualEmployeeDeduction,
    annualTaxableIncome,
    monthlyTax,
    annualTax,
    netSalary,
    ctcTotal,
  };
}

// ─── Input Field Component ───────────────────────────────────────────────────

function InputField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 dark:text-slate-400 font-medium select-none">
          Rs
        </span>
        <input
          type="number"
          min={0}
          step={500}
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
          placeholder="0"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

// ─── Breakdown Row ────────────────────────────────────────────────────────────

function BreakdownRow({
  label,
  monthly,
  annual,
  highlight,
  negative,
  bold,
  indent,
}: {
  label: string;
  monthly: number;
  annual: number;
  highlight?: 'green' | 'red' | 'blue';
  negative?: boolean;
  bold?: boolean;
  indent?: boolean;
}) {
  const sign = negative ? '−' : '';
  const colorMap = {
    green: 'text-emerald-600 dark:text-emerald-400',
    red: 'text-red-600 dark:text-red-400',
    blue: 'text-blue-600 dark:text-blue-400',
  };
  const valueClass = highlight ? colorMap[highlight] : 'text-slate-700 dark:text-slate-300';
  const labelClass = bold
    ? 'font-semibold text-slate-900 dark:text-slate-100'
    : 'text-slate-600 dark:text-slate-400';

  return (
    <tr className="border-b border-slate-100 dark:border-slate-700/50 last:border-0">
      <td className={`py-2.5 pr-4 text-sm ${labelClass} ${indent ? 'pl-5' : 'pl-1'}`}>
        {label}
      </td>
      <td className={`py-2.5 px-3 text-sm text-right ${bold ? 'font-semibold' : ''} ${valueClass}`}>
        {sign}{rs(monthly)}
      </td>
      <td className={`py-2.5 pl-3 text-sm text-right ${bold ? 'font-semibold' : ''} ${valueClass}`}>
        {sign}{rs(annual)}
      </td>
    </tr>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function NepalSalaryCalculatorTool() {
  const [basicSalary, setBasicSalary] = useState(30000);
  const [gradeAllowance, setGradeAllowance] = useState(0);
  const [dearnessAllowance, setDearnessAllowance] = useState(0);
  const [otherAllowances, setOtherAllowances] = useState(5000);
  const [deductionType, setDeductionType] = useState<DeductionType>('pf');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('single');
  const [showEmployer, setShowEmployer] = useState(false);

  const result = useMemo(
    () =>
      calcSalary({
        basicSalary,
        gradeAllowance,
        dearnessAllowance,
        otherAllowances,
        deductionType,
        maritalStatus,
      }),
    [basicSalary, gradeAllowance, dearnessAllowance, otherAllowances, deductionType, maritalStatus]
  );

  const copyText = [
    `Nepal Salary Breakdown (FY 2081/82)`,
    `Basic Salary: ${rs(result.basicSalary)}`,
    `Gross Salary: ${rs(result.grossSalary)}`,
    `${result.deductionLabel}: -${rs(result.employeeDeduction)}`,
    `Income Tax (TDS): -${rs(result.monthlyTax)}`,
    `Net Take-Home: ${rs(result.netSalary)}`,
    `Annual Net: ${rs(result.netSalary * 12)}`,
  ].join('\n');

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300">
          <strong>Note:</strong> This calculator is for reference only. Actual deductions may vary based on company policy, grade increments, and individual circumstances. Consult your HR department or a Chartered Accountant for exact figures.
        </p>
      </div>

      {/* Inputs grid */}
      <div>
        <h2 className="text-base font-heading font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Salary Components (Monthly)
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField
            label="Basic Salary"
            value={basicSalary}
            onChange={setBasicSalary}
            hint="PF/CIT is calculated on basic salary"
          />
          <InputField
            label="Grade / Scale Allowance"
            value={gradeAllowance}
            onChange={setGradeAllowance}
            hint="Annual grade increment (if applicable)"
          />
          <InputField
            label="Dearness Allowance (DA)"
            value={dearnessAllowance}
            onChange={setDearnessAllowance}
          />
          <InputField
            label="Other Allowances"
            value={otherAllowances}
            onChange={setOtherAllowances}
            hint="Travel, medical, house rent, etc."
          />
        </div>
      </div>

      {/* Options */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Deduction Type */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Deduction Scheme
          </h3>
          <div className="space-y-2">
            {(
              [
                { value: 'pf', label: 'PF (Provident Fund)', sub: 'Employee 10% + Employer 10% of Basic' },
                { value: 'cit', label: 'CIT (Citizen Investment Trust)', sub: 'Employee 10% + Employer 10% of Basic' },
                { value: 'ssf', label: 'SSF (Social Security Fund)', sub: 'Employee 11% + Employer 20% of Gross' },
              ] as { value: DeductionType; label: string; sub: string }[]
            ).map(({ value, label, sub }) => (
              <label
                key={value}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  deductionType === value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="deductionType"
                  value={value}
                  checked={deductionType === value}
                  onChange={() => setDeductionType(value)}
                  className="mt-0.5 accent-primary-600"
                />
                <div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Marital Status */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Marital Status <span className="text-slate-400 dark:text-slate-500 font-normal">(for tax slabs)</span>
          </h3>
          <div className="space-y-2">
            {(
              [
                { value: 'single', label: 'Single / Individual', sub: 'First slab: 1% up to Rs 5,00,000' },
                { value: 'married', label: 'Married Couple', sub: 'First slab: 1% up to Rs 6,00,000 (+Rs 1L benefit)' },
              ] as { value: MaritalStatus; label: string; sub: string }[]
            ).map(({ value, label, sub }) => (
              <label
                key={value}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  maritalStatus === value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="maritalStatus"
                  value={value}
                  checked={maritalStatus === value}
                  onChange={() => setMaritalStatus(value)}
                  className="mt-0.5 accent-primary-600"
                />
                <div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</div>
                </div>
              </label>
            ))}
          </div>

          {/* Tax Year Badge */}
          <div className="mt-4 inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg px-3 py-1.5">
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">FY 2081/82 (2024/25) Tax Slabs</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-heading font-semibold text-slate-800 dark:text-slate-200">
            Salary Breakdown
          </h2>
          <CopyButton text={copyText} size="sm" label="Copy Summary" />
        </div>

        {/* Net Salary Hero */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-5 mb-4 text-white text-center">
          <div className="text-sm text-emerald-100 mb-1">Monthly Take-Home (Net Salary)</div>
          <div className="text-4xl font-heading font-bold tracking-tight">
            {rs(result.netSalary)}
          </div>
          <div className="text-sm text-emerald-200 mt-2">
            Annual: {rs(result.netSalary * 12)}
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide py-2 pl-1 pr-4">
                  Component
                </th>
                <th className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide py-2 px-3">
                  Monthly
                </th>
                <th className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide py-2 pl-3">
                  Annual
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Earnings */}
              <tr>
                <td colSpan={3} className="pt-3 pb-1 pl-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Earnings
                </td>
              </tr>
              <BreakdownRow label="Basic Salary" monthly={result.basicSalary} annual={result.basicSalary * 12} indent />
              {result.gradeAllowance > 0 && (
                <BreakdownRow label="Grade / Scale Allowance" monthly={result.gradeAllowance} annual={result.gradeAllowance * 12} indent />
              )}
              {result.dearnessAllowance > 0 && (
                <BreakdownRow label="Dearness Allowance" monthly={result.dearnessAllowance} annual={result.dearnessAllowance * 12} indent />
              )}
              {result.otherAllowances > 0 && (
                <BreakdownRow label="Other Allowances" monthly={result.otherAllowances} annual={result.otherAllowances * 12} indent />
              )}
              <BreakdownRow label="Gross Salary" monthly={result.grossSalary} annual={result.annualGross} bold />

              {/* Deductions */}
              <tr>
                <td colSpan={3} className="pt-3 pb-1 pl-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Deductions
                </td>
              </tr>
              <BreakdownRow
                label={result.deductionLabel}
                monthly={result.employeeDeduction}
                annual={result.annualEmployeeDeduction}
                negative
                highlight="red"
                indent
              />
              <BreakdownRow
                label={`Income Tax / TDS (${maritalStatus === 'married' ? 'Married' : 'Single'})`}
                monthly={result.monthlyTax}
                annual={result.annualTax}
                negative
                highlight="red"
                indent
              />
              <BreakdownRow
                label="Total Deductions"
                monthly={result.employeeDeduction + result.monthlyTax}
                annual={result.annualEmployeeDeduction + result.annualTax}
                negative
                bold
                highlight="red"
              />

              {/* Net */}
              <tr>
                <td colSpan={3} className="pt-2">
                  <div className="border-t-2 border-slate-300 dark:border-slate-600" />
                </td>
              </tr>
              <BreakdownRow
                label="Net Take-Home Salary"
                monthly={result.netSalary}
                annual={result.netSalary * 12}
                bold
                highlight="green"
              />
            </tbody>
          </table>
        </div>

        {/* Taxable Income Info */}
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">Annual Taxable Income</div>
            <div className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {rs(result.annualTaxableIncome)}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              After {deductionType === 'ssf' ? 'SSF' : deductionType.toUpperCase()} deduction
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">Effective Tax Rate</div>
            <div className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {result.annualTaxableIncome > 0
                ? ((result.annualTax / result.annualTaxableIncome) * 100).toFixed(2)
                : '0.00'}%
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">On taxable income</div>
          </div>
        </div>
      </div>

      {/* Employer Cost (CTC) */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <button
          onClick={() => setShowEmployer(!showEmployer)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-sm font-heading font-semibold text-slate-800 dark:text-slate-200">
            Total Cost to Company (CTC)
          </h3>
          {showEmployer ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showEmployer && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide py-2 pl-1 pr-4">Component</th>
                  <th className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide py-2 px-3">Monthly</th>
                  <th className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide py-2 pl-3">Annual</th>
                </tr>
              </thead>
              <tbody>
                <BreakdownRow label="Gross Salary" monthly={result.grossSalary} annual={result.annualGross} />
                <BreakdownRow
                  label={`Employer ${deductionType === 'ssf' ? 'SSF (20% of Gross)' : deductionType === 'pf' ? 'PF (10% of Basic)' : 'CIT (10% of Basic)'}`}
                  monthly={result.employerContribution}
                  annual={result.employerContribution * 12}
                  highlight="blue"
                  indent
                />
                <BreakdownRow
                  label="Total CTC"
                  monthly={result.ctcTotal}
                  annual={result.ctcTotal * 12}
                  bold
                  highlight="blue"
                />
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Gross (Monthly)', value: rs(result.grossSalary), color: 'text-slate-800 dark:text-slate-200' },
          { label: `${deductionType.toUpperCase()} Deduction`, value: rs(result.employeeDeduction), color: 'text-red-600 dark:text-red-400' },
          { label: 'Income Tax (Monthly)', value: rs(result.monthlyTax), color: 'text-red-600 dark:text-red-400' },
          { label: 'Net (Monthly)', value: rs(result.netSalary), color: 'text-emerald-600 dark:text-emerald-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</div>
            <div className={`text-sm font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
