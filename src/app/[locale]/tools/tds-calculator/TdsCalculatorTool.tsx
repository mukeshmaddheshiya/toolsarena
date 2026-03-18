'use client';

import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import {
  Shield,
  Sparkles,
  IndianRupee,
  Building2,
  Briefcase,
  Landmark,
  Home,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

type TdsMode = 'salary' | 'rent' | 'professional' | 'interest' | 'property';
type FY = '2024-25' | '2025-26' | '2026-27';
type Regime = 'old' | 'new';

interface SalaryInputs {
  annualSalary: string;
  ded80C: string;
  ded80D: string;
  hra: string;
  nps80CCD: string;
  homeLoan24b: string;
}

// ── Tax slab definitions ───────────────────────────────────────────────────────

const NEW_REGIME_SLABS: Record<FY, { limit: number; rate: number }[]> = {
  '2024-25': [
    { limit: 300000, rate: 0 },
    { limit: 300000, rate: 0.05 },
    { limit: 300000, rate: 0.10 },
    { limit: 300000, rate: 0.15 },
    { limit: 300000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ],
  '2025-26': [
    { limit: 400000, rate: 0 },
    { limit: 400000, rate: 0.05 },
    { limit: 400000, rate: 0.10 },
    { limit: 400000, rate: 0.15 },
    { limit: 400000, rate: 0.20 },
    { limit: 400000, rate: 0.25 },
    { limit: Infinity, rate: 0.30 },
  ],
  '2026-27': [
    { limit: 400000, rate: 0 },
    { limit: 400000, rate: 0.05 },
    { limit: 400000, rate: 0.10 },
    { limit: 400000, rate: 0.15 },
    { limit: 400000, rate: 0.20 },
    { limit: 400000, rate: 0.25 },
    { limit: Infinity, rate: 0.30 },
  ],
};

const OLD_REGIME_SLABS = [
  { limit: 250000, rate: 0 },
  { limit: 250000, rate: 0.05 },
  { limit: 500000, rate: 0.20 },
  { limit: Infinity, rate: 0.30 },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function calcTaxFromSlabs(income: number, slabs: { limit: number; rate: number }[]): number {
  let remaining = income;
  let tax = 0;
  for (const slab of slabs) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, slab.limit);
    tax += taxable * slab.rate;
    remaining -= taxable;
  }
  return tax;
}

function getNewRegimeStdDeduction(fy: FY): number {
  return fy === '2024-25' ? 50000 : 75000;
}

function getNewRegimeRebateLimit(fy: FY): { incomeLimit: number; maxRebate: number } {
  if (fy === '2024-25') return { incomeLimit: 700000, maxRebate: 25000 };
  return { incomeLimit: 1200000, maxRebate: 60000 };
}

function calcSalaryTds(
  annualSalary: number,
  deductions: { ded80C: number; ded80D: number; hra: number; nps: number; homeLoan: number },
  fy: FY,
  regime: Regime
) {
  if (annualSalary <= 0) return { taxableIncome: 0, tax: 0, cess: 0, totalTds: 0 };

  let taxableIncome: number;
  let tax: number;

  if (regime === 'new') {
    const stdDed = getNewRegimeStdDeduction(fy);
    taxableIncome = Math.max(0, annualSalary - stdDed);
    tax = calcTaxFromSlabs(taxableIncome, NEW_REGIME_SLABS[fy]);

    // Section 87A rebate
    const rebate = getNewRegimeRebateLimit(fy);
    if (taxableIncome <= rebate.incomeLimit) {
      tax = Math.max(0, tax - rebate.maxRebate);
    }
  } else {
    // Old regime: standard deduction 50k + all deductions
    const stdDed = 50000;
    const totalDeductions =
      Math.min(deductions.ded80C, 150000) +
      Math.min(deductions.ded80D, 100000) +
      deductions.hra +
      Math.min(deductions.nps, 50000) +
      Math.min(deductions.homeLoan, 200000);
    taxableIncome = Math.max(0, annualSalary - stdDed - totalDeductions);
    tax = calcTaxFromSlabs(taxableIncome, OLD_REGIME_SLABS);

    // Old regime 87A rebate (up to 5L taxable income, max 12,500)
    if (taxableIncome <= 500000) {
      tax = Math.max(0, tax - 12500);
    }
  }

  const cess = tax * 0.04;
  const totalTds = tax + cess;
  return { taxableIncome, tax, cess, totalTds };
}

const fmt = (n: number) =>
  '\u20B9' + Math.round(n).toLocaleString('en-IN');

const pct = (n: number) => n.toFixed(2) + '%';

const MODES: { key: TdsMode; label: string; icon: React.ElementType; section: string }[] = [
  { key: 'salary', label: 'Salary', icon: IndianRupee, section: 'Sec 192' },
  { key: 'rent', label: 'Rent', icon: Building2, section: 'Sec 194-IB' },
  { key: 'professional', label: 'Professional', icon: Briefcase, section: 'Sec 194J' },
  { key: 'interest', label: 'Interest', icon: Landmark, section: 'Sec 194A' },
  { key: 'property', label: 'Property', icon: Home, section: 'Sec 194-IA' },
];

const FY_OPTIONS: FY[] = ['2024-25', '2025-26', '2026-27'];

// ── Example data ───────────────────────────────────────────────────────────────

const EXAMPLES: Record<TdsMode, Record<string, string>> = {
  salary: { annualSalary: '1200000', ded80C: '150000', ded80D: '25000', hra: '120000', nps80CCD: '50000', homeLoan24b: '0' },
  rent: { monthlyRent: '75000' },
  professional: { fees: '500000' },
  interest: { interest: '100000', isSenior: '' },
  property: { saleAmount: '8000000' },
};

// ── Component ──────────────────────────────────────────────────────────────────

export function TdsCalculatorTool() {
  const [mode, setMode] = useState<TdsMode>('salary');
  const [fy, setFy] = useState<FY>('2025-26');

  // Salary inputs
  const [salaryInputs, setSalaryInputs] = useState<SalaryInputs>({
    annualSalary: '',
    ded80C: '',
    ded80D: '',
    hra: '',
    nps80CCD: '',
    homeLoan24b: '',
  });

  // Rent
  const [monthlyRent, setMonthlyRent] = useState('');

  // Professional
  const [fees, setFees] = useState('');

  // Interest
  const [interest, setInterest] = useState('');
  const [isSenior, setIsSenior] = useState(false);

  // Property
  const [saleAmount, setSaleAmount] = useState('');

  // ── Load example ──
  function loadExample() {
    const ex = EXAMPLES[mode];
    if (mode === 'salary') {
      setSalaryInputs({
        annualSalary: ex.annualSalary,
        ded80C: ex.ded80C,
        ded80D: ex.ded80D,
        hra: ex.hra,
        nps80CCD: ex.nps80CCD,
        homeLoan24b: ex.homeLoan24b,
      });
    } else if (mode === 'rent') setMonthlyRent(ex.monthlyRent);
    else if (mode === 'professional') setFees(ex.fees);
    else if (mode === 'interest') { setInterest(ex.interest); setIsSenior(false); }
    else setSaleAmount(ex.saleAmount);
  }

  // ── Results computation ──
  const results = useMemo(() => {
    if (mode === 'salary') {
      const salary = parseFloat(salaryInputs.annualSalary) || 0;
      const deds = {
        ded80C: parseFloat(salaryInputs.ded80C) || 0,
        ded80D: parseFloat(salaryInputs.ded80D) || 0,
        hra: parseFloat(salaryInputs.hra) || 0,
        nps: parseFloat(salaryInputs.nps80CCD) || 0,
        homeLoan: parseFloat(salaryInputs.homeLoan24b) || 0,
      };
      const oldRes = calcSalaryTds(salary, deds, fy, 'old');
      const newRes = calcSalaryTds(salary, deds, fy, 'new');
      return { type: 'salary' as const, salary, old: oldRes, new: newRes };
    }

    if (mode === 'rent') {
      const rent = parseFloat(monthlyRent) || 0;
      const annualRent = rent * 12;
      // TDS on rent: 2% if monthly rent > 50,000 (for FY 2025-26 onwards, 5% if annual > 6L was proposed but 2% is standard 194-IB)
      const tdsRate = rent > 50000 ? 0.02 : 0;
      const annualTds = annualRent * tdsRate;
      const monthlyTds = rent * tdsRate;
      return { type: 'rent' as const, rent, annualRent, tdsRate, annualTds, monthlyTds };
    }

    if (mode === 'professional') {
      const f = parseFloat(fees) || 0;
      const tdsRate = 0.10;
      const tds = f * tdsRate;
      return { type: 'professional' as const, fees: f, tdsRate, tds };
    }

    if (mode === 'interest') {
      const i = parseFloat(interest) || 0;
      const threshold = isSenior ? 50000 : 40000;
      const taxableInterest = Math.max(0, i - threshold);
      const tdsRate = 0.10;
      const tds = taxableInterest * tdsRate;
      return { type: 'interest' as const, interest: i, threshold, taxableInterest, tdsRate, tds };
    }

    // Property
    const amount = parseFloat(saleAmount) || 0;
    const threshold = 5000000;
    const tdsRate = amount > threshold ? 0.01 : 0;
    const tds = amount > threshold ? amount * tdsRate : 0;
    return { type: 'property' as const, amount, threshold, tdsRate, tds };
  }, [mode, fy, salaryInputs, monthlyRent, fees, interest, isSenior, saleAmount]);

  // ── Build copy text ──
  function getCopyText(): string {
    const lines: string[] = [`TDS Calculator - ${mode.charAt(0).toUpperCase() + mode.slice(1)} | FY ${fy}`];
    lines.push('---');
    if (results.type === 'salary') {
      lines.push(`Annual Salary: ${fmt(results.salary)}`);
      lines.push('');
      lines.push('Old Regime:');
      lines.push(`  Taxable Income: ${fmt(results.old.taxableIncome)}`);
      lines.push(`  Tax: ${fmt(results.old.tax)}`);
      lines.push(`  Cess (4%): ${fmt(results.old.cess)}`);
      lines.push(`  Total TDS: ${fmt(results.old.totalTds)}`);
      lines.push(`  Monthly TDS: ${fmt(results.old.totalTds / 12)}`);
      lines.push('');
      lines.push('New Regime:');
      lines.push(`  Taxable Income: ${fmt(results.new.taxableIncome)}`);
      lines.push(`  Tax: ${fmt(results.new.tax)}`);
      lines.push(`  Cess (4%): ${fmt(results.new.cess)}`);
      lines.push(`  Total TDS: ${fmt(results.new.totalTds)}`);
      lines.push(`  Monthly TDS: ${fmt(results.new.totalTds / 12)}`);
      const better = results.old.totalTds < results.new.totalTds ? 'Old' : 'New';
      const savings = Math.abs(results.old.totalTds - results.new.totalTds);
      lines.push('');
      lines.push(`Better Regime: ${better} (saves ${fmt(savings)})`);
    } else if (results.type === 'rent') {
      lines.push(`Monthly Rent: ${fmt(results.rent)}`);
      lines.push(`TDS Rate: ${pct(results.tdsRate * 100)}`);
      lines.push(`Monthly TDS: ${fmt(results.monthlyTds)}`);
      lines.push(`Annual TDS: ${fmt(results.annualTds)}`);
    } else if (results.type === 'professional') {
      lines.push(`Professional Fees: ${fmt(results.fees)}`);
      lines.push(`TDS Rate: 10%`);
      lines.push(`TDS Amount: ${fmt(results.tds)}`);
    } else if (results.type === 'interest') {
      lines.push(`Interest Income: ${fmt(results.interest)}`);
      lines.push(`Threshold: ${fmt(results.threshold)}`);
      lines.push(`Taxable Interest: ${fmt(results.taxableInterest)}`);
      lines.push(`TDS (10%): ${fmt(results.tds)}`);
    } else {
      lines.push(`Sale Amount: ${fmt(results.amount)}`);
      lines.push(`TDS Rate: ${pct(results.tdsRate * 100)}`);
      lines.push(`TDS Amount: ${fmt(results.tds)}`);
    }
    lines.push('');
    lines.push('Generated by ToolsArena.in');
    return lines.join('\n');
  }

  // ── Input helper ──
  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  function NumInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || '0'} className={inputClass} min="0" />
      </div>
    );
  }

  // ── Salary mode UI ──
  function renderSalaryInputs() {
    const update = (key: keyof SalaryInputs) => (v: string) =>
      setSalaryInputs(prev => ({ ...prev, [key]: v }));
    return (
      <div className="space-y-4">
        <NumInput label="Annual Salary / CTC (Rs.)" value={salaryInputs.annualSalary} onChange={update('annualSalary')} placeholder="e.g. 1200000" />
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Old Regime Deductions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumInput label="80C (PPF, ELSS, LIC)" value={salaryInputs.ded80C} onChange={update('ded80C')} placeholder="Max 1,50,000" />
            <NumInput label="80D (Health Insurance)" value={salaryInputs.ded80D} onChange={update('ded80D')} placeholder="Max 1,00,000" />
            <NumInput label="HRA Exemption" value={salaryInputs.hra} onChange={update('hra')} />
            <NumInput label="80CCD(1B) NPS" value={salaryInputs.nps80CCD} onChange={update('nps80CCD')} placeholder="Max 50,000" />
            <NumInput label="Sec 24b Home Loan Interest" value={salaryInputs.homeLoan24b} onChange={update('homeLoan24b')} placeholder="Max 2,00,000" />
          </div>
        </div>
      </div>
    );
  }

  function renderSalaryResults() {
    if (results.type !== 'salary' || results.salary <= 0) return null;
    const { old: o, new: n } = results;
    const better: Regime = o.totalTds <= n.totalTds ? 'old' : 'new';
    const savings = Math.abs(o.totalTds - n.totalTds);

    const rows: { label: string; old: string; new: string }[] = [
      { label: 'Gross Salary', old: fmt(results.salary), new: fmt(results.salary) },
      { label: 'Standard Deduction', old: fmt(50000), new: fmt(getNewRegimeStdDeduction(fy)) },
      { label: 'Other Deductions', old: fmt(Math.min(parseFloat(salaryInputs.ded80C) || 0, 150000) + Math.min(parseFloat(salaryInputs.ded80D) || 0, 100000) + (parseFloat(salaryInputs.hra) || 0) + Math.min(parseFloat(salaryInputs.nps80CCD) || 0, 50000) + Math.min(parseFloat(salaryInputs.homeLoan24b) || 0, 200000)), new: fmt(0) },
      { label: 'Taxable Income', old: fmt(o.taxableIncome), new: fmt(n.taxableIncome) },
      { label: 'Income Tax', old: fmt(o.tax), new: fmt(n.tax) },
      { label: 'Cess (4%)', old: fmt(o.cess), new: fmt(n.cess) },
      { label: 'Total TDS (Annual)', old: fmt(o.totalTds), new: fmt(n.totalTds) },
      { label: 'TDS per Month', old: fmt(o.totalTds / 12), new: fmt(n.totalTds / 12) },
      { label: 'Effective Rate', old: pct(results.salary > 0 ? (o.totalTds / results.salary) * 100 : 0), new: pct(results.salary > 0 ? (n.totalTds / results.salary) * 100 : 0) },
    ];

    return (
      <div className="space-y-4">
        {/* Regime recommendation */}
        <div className={`rounded-xl p-4 border ${better === 'new' ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {better === 'new' ? 'New' : 'Old'} Regime saves you more
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            You save {fmt(savings)} per year ({fmt(savings / 12)}/month) with the {better === 'new' ? 'New' : 'Old'} Regime.
          </p>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2.5 px-2 font-medium text-slate-500 dark:text-slate-400">Component</th>
                <th className={`text-right py-2.5 px-2 font-medium ${better === 'old' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>Old Regime</th>
                <th className={`text-right py-2.5 px-2 font-medium ${better === 'new' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>New Regime</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <td className="py-2 px-2 text-slate-700 dark:text-slate-300">{r.label}</td>
                  <td className="py-2 px-2 text-right text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm">{r.old}</td>
                  <td className="py-2 px-2 text-right text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm">{r.new}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* New regime slabs reference */}
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
            View FY {fy} New Regime Tax Slabs
          </summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-1.5 px-2 font-medium text-slate-500 dark:text-slate-400">Slab</th>
                  <th className="text-right py-1.5 px-2 font-medium text-slate-500 dark:text-slate-400">Rate</th>
                </tr>
              </thead>
              <tbody>
                {NEW_REGIME_SLABS[fy].map((s, i, arr) => {
                  const from = arr.slice(0, i).reduce((sum, x) => sum + (x.limit === Infinity ? 0 : x.limit), 0);
                  const to = s.limit === Infinity ? null : from + s.limit;
                  return (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <td className="py-1.5 px-2 text-slate-700 dark:text-slate-300">
                        {to ? `${fmt(from)} - ${fmt(to)}` : `Above ${fmt(from)}`}
                      </td>
                      <td className="py-1.5 px-2 text-right text-slate-900 dark:text-slate-100">{pct(s.rate * 100)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    );
  }

  // ── Simple mode results ──
  function renderSimpleResults() {
    if (results.type === 'salary') return null;

    let rows: { label: string; value: string }[] = [];
    let tdsAmount = 0;
    let baseAmount = 0;

    if (results.type === 'rent') {
      if (results.rent <= 0) return null;
      baseAmount = results.annualRent;
      tdsAmount = results.annualTds;
      rows = [
        { label: 'Monthly Rent', value: fmt(results.rent) },
        { label: 'Annual Rent', value: fmt(results.annualRent) },
        { label: 'TDS Applicable', value: results.rent > 50000 ? 'Yes (Rent > Rs.50,000/month)' : 'No (Rent <= Rs.50,000/month)' },
        { label: 'TDS Rate', value: pct(results.tdsRate * 100) },
        { label: 'Monthly TDS', value: fmt(results.monthlyTds) },
        { label: 'Annual TDS', value: fmt(results.annualTds) },
        { label: 'Net Monthly Payment', value: fmt(results.rent - results.monthlyTds) },
        { label: 'Effective Rate', value: pct(results.annualRent > 0 ? (results.annualTds / results.annualRent) * 100 : 0) },
      ];
    } else if (results.type === 'professional') {
      if (results.fees <= 0) return null;
      baseAmount = results.fees;
      tdsAmount = results.tds;
      rows = [
        { label: 'Professional Fees', value: fmt(results.fees) },
        { label: 'TDS Rate (Sec 194J)', value: '10%' },
        { label: 'TDS Amount', value: fmt(results.tds) },
        { label: 'Net Payment', value: fmt(results.fees - results.tds) },
        { label: 'Effective Rate', value: '10.00%' },
      ];
    } else if (results.type === 'interest') {
      if (results.interest <= 0) return null;
      baseAmount = results.interest;
      tdsAmount = results.tds;
      rows = [
        { label: 'Interest Income', value: fmt(results.interest) },
        { label: `Threshold (${isSenior ? 'Senior' : 'Non-Senior'})`, value: fmt(results.threshold) },
        { label: 'Taxable Interest', value: fmt(results.taxableInterest) },
        { label: 'TDS Rate (Sec 194A)', value: '10%' },
        { label: 'TDS Amount', value: fmt(results.tds) },
        { label: 'Net Interest', value: fmt(results.interest - results.tds) },
        { label: 'Effective Rate', value: pct(results.interest > 0 ? (results.tds / results.interest) * 100 : 0) },
      ];
    } else {
      if (results.amount <= 0) return null;
      baseAmount = results.amount;
      tdsAmount = results.tds;
      rows = [
        { label: 'Sale Amount', value: fmt(results.amount) },
        { label: 'Threshold (Sec 194-IA)', value: fmt(results.threshold) },
        { label: 'TDS Applicable', value: results.amount > results.threshold ? 'Yes' : 'No (Amount <= Rs.50 Lakh)' },
        { label: 'TDS Rate', value: pct(results.tdsRate * 100) },
        { label: 'TDS Amount', value: fmt(results.tds) },
        { label: 'Net Receivable', value: fmt(results.amount - results.tds) },
        { label: 'Effective Rate', value: pct(baseAmount > 0 ? (tdsAmount / baseAmount) * 100 : 0) },
      ];
    }

    return (
      <div className="space-y-3">
        {/* TDS highlight */}
        <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 p-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">TDS Deducted</p>
          <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{fmt(tdsAmount)}</p>
          {baseAmount > 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Effective rate: {pct((tdsAmount / baseAmount) * 100)}
            </p>
          )}
        </div>

        {/* Detail rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((r, i) => (
            <div key={i} className="flex justify-between py-2.5 text-sm">
              <span className="text-slate-600 dark:text-slate-400">{r.label}</span>
              <span className="font-medium text-slate-900 dark:text-slate-100 font-mono">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Check if we have results to show ──
  const hasResults = (() => {
    if (results.type === 'salary') return (results.salary > 0);
    if (results.type === 'rent') return ((results as { rent: number }).rent > 0);
    if (results.type === 'professional') return ((results as { fees: number }).fees > 0);
    if (results.type === 'interest') return ((results as { interest: number }).interest > 0);
    if (results.type === 'property') return ((results as { amount: number }).amount > 0);
    return false;
  })();

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60">
        {MODES.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                mode === m.key
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4 hidden sm:block" />
              <span>{m.label}</span>
              <span className="text-[10px] opacity-60 hidden md:inline">{m.section}</span>
            </button>
          );
        })}
      </div>

      {/* FY selector + actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">FY:</label>
          <select
            value={fy}
            onChange={e => setFy(e.target.value as FY)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
          >
            {FY_OPTIONS.map(f => (
              <option key={f} value={f}>FY {f}</option>
            ))}
          </select>
        </div>
        <button
          onClick={loadExample}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-950/70 transition-colors"
        >
          Try Example
        </button>
        {hasResults && <CopyButton text={getCopyText()} label="Copy Results" />}
      </div>

      {/* Main layout: inputs + results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Inputs */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">
            {MODES.find(m => m.key === mode)?.label} Details
          </h3>

          {mode === 'salary' && renderSalaryInputs()}

          {mode === 'rent' && (
            <NumInput label="Monthly Rent (Rs.)" value={monthlyRent} onChange={setMonthlyRent} placeholder="e.g. 75000" />
          )}

          {mode === 'professional' && (
            <NumInput label="Professional / Technical Fees (Rs.)" value={fees} onChange={setFees} placeholder="e.g. 500000" />
          )}

          {mode === 'interest' && (
            <div className="space-y-4">
              <NumInput label="Interest Income (Rs.)" value={interest} onChange={setInterest} placeholder="e.g. 100000" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSenior}
                  onChange={e => setIsSenior(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Senior Citizen (60+ years) - Threshold Rs.50,000
                </span>
              </label>
            </div>
          )}

          {mode === 'property' && (
            <div className="space-y-3">
              <NumInput label="Property Sale Amount (Rs.)" value={saleAmount} onChange={setSaleAmount} placeholder="e.g. 8000000" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                TDS @ 1% is deducted by buyer if sale consideration exceeds Rs.50 Lakh.
              </p>
            </div>
          )}

          {/* Section info */}
          <div className="mt-5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400 space-y-1">
            {mode === 'salary' && (
              <>
                <p><strong>Section 192:</strong> Employer deducts TDS on salary based on estimated annual income and applicable tax slab.</p>
                <p>New Regime is default from FY 2023-24. Old Regime allows deductions under 80C, 80D, HRA, etc.</p>
              </>
            )}
            {mode === 'rent' && (
              <p><strong>Section 194-IB:</strong> Tenant must deduct TDS at 2% if monthly rent exceeds Rs.50,000. TDS is deducted in the last month of tenancy or March, whichever is earlier.</p>
            )}
            {mode === 'professional' && (
              <p><strong>Section 194J:</strong> TDS at 10% on fees for professional or technical services. No threshold limit for companies; Rs.30,000 threshold for individuals/HUF.</p>
            )}
            {mode === 'interest' && (
              <p><strong>Section 194A:</strong> TDS at 10% on interest (other than on securities) exceeding Rs.40,000 (Rs.50,000 for senior citizens) in a financial year.</p>
            )}
            {mode === 'property' && (
              <p><strong>Section 194-IA:</strong> Buyer deducts TDS at 1% on consideration paid for transfer of immovable property (other than agricultural land) exceeding Rs.50 Lakh.</p>
            )}
          </div>
        </div>

        {/* Right: Results */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">
            TDS Calculation
          </h3>

          {!hasResults ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IndianRupee className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Enter values on the left to see TDS calculation
              </p>
            </div>
          ) : (
            <>
              {mode === 'salary' ? renderSalaryResults() : renderSimpleResults()}
            </>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-400">
        <strong>Disclaimer:</strong> TDS calculations are estimates for educational purposes only. TDS rates and thresholds change with each Finance Act. Always verify current rates on the Income Tax Department website and consult a qualified CA for filing.
      </div>

      {/* Trust badge */}
      <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
        <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-sm text-emerald-700 dark:text-emerald-300">
          All calculations happen in your browser. Your data never leaves your device.
        </span>
      </div>
    </div>
  );
}
