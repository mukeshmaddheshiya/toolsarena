'use client';

import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';

// ── Nepal Tax Slabs FY 2081/82 ───────────────────────────────────────────────
type MaritalStatus = 'single' | 'married';
type Scheme = 'pf-cit' | 'ssf';

interface TaxSlab {
  label: string;
  from: number;
  to: number;
  rate: number;
}

function getTaxSlabs(status: MaritalStatus): TaxSlab[] {
  const exempt = status === 'married' ? 600_000 : 500_000;
  return [
    { label: `Up to ${fmt(exempt)}`, from: 0,         to: exempt,     rate: 0    },
    { label: `Next 2,00,000`,        from: exempt,     to: exempt + 200_000, rate: 0.01 },
    { label: `Next 3,00,000`,        from: exempt + 200_000, to: exempt + 500_000, rate: 0.10 },
    { label: `Next 13,00,000`,       from: exempt + 500_000, to: exempt + 1_800_000, rate: 0.20 },
    { label: `Next 20,00,000`,       from: exempt + 1_800_000, to: exempt + 3_800_000, rate: 0.30 },
    { label: `Above that`,           from: exempt + 3_800_000, to: Infinity, rate: 0.36 },
  ];
}

function calcTax(taxableIncome: number, status: MaritalStatus): number {
  const slabs = getTaxSlabs(status);
  let tax = 0;
  for (const slab of slabs) {
    if (taxableIncome <= slab.from) break;
    const band = Math.min(taxableIncome, slab.to) - slab.from;
    tax += band * slab.rate;
  }
  return tax;
}

// ── Formatting helpers ────────────────────────────────────────────────────────
function fmt(n: number) {
  return 'Rs. ' + Math.round(n).toLocaleString('en-IN');
}
function fmtN(n: number) {
  return Math.round(n).toLocaleString('en-IN');
}

interface Row { label: string; amount: number; type: 'income' | 'deduction' | 'tax' | 'net' | 'note' }

export function NepalSalaryTaxCalculatorTool() {
  const [grossMonthly, setGrossMonthly] = useState('');
  const [basicPct, setBasicPct] = useState('60');
  const [marital, setMarital] = useState<MaritalStatus>('single');
  const [scheme, setScheme] = useState<Scheme>('pf-cit');
  const [view, setView] = useState<'monthly' | 'annual'>('monthly');

  const result = useMemo(() => {
    const gross = parseFloat(grossMonthly);
    const bpct  = parseFloat(basicPct) / 100;
    if (!gross || isNaN(gross) || gross <= 0) return null;
    if (!bpct  || isNaN(bpct)  || bpct  <= 0) return null;

    const grossAnnual = gross * 12;
    const basicAnnual = grossAnnual * bpct;

    let empDeduction  = 0; // employee deduction (reduces take-home)
    let taxDeduction  = 0; // deduction allowed from taxable income

    if (scheme === 'pf-cit') {
      const pf  = basicAnnual * 0.10; // employee PF 10%
      const cit = basicAnnual * 0.10; // employee CIT 10%
      empDeduction = pf + cit;
      taxDeduction = pf + cit; // both PF + CIT are deductible
    } else {
      const ssf = grossAnnual * 0.11; // employee SSF 11% of gross
      empDeduction = ssf;
      taxDeduction = ssf;
    }

    // Standard deduction (insurance premium allowance): Rs 20,000 max
    const stdDeduction = Math.min(grossAnnual * 0.01, 20_000);
    taxDeduction += stdDeduction;

    const taxableIncome = Math.max(0, grossAnnual - taxDeduction);
    const annualTax  = calcTax(taxableIncome, marital);
    const netAnnual  = grossAnnual - empDeduction - annualTax;
    const netMonthly = netAnnual / 12;

    const slabs = getTaxSlabs(marital);
    const slabBreakdown = slabs.map(slab => {
      const band = Math.max(0, Math.min(taxableIncome, slab.to) - slab.from);
      return { ...slab, band, tax: band * slab.rate };
    }).filter(s => s.band > 0);

    const div = view === 'monthly' ? 12 : 1;

    const rows: Row[] = [
      { label: 'Gross Salary',       amount: grossAnnual / div, type: 'income' },
      ...(scheme === 'pf-cit' ? [
        { label: 'Employee PF (10% of basic)',  amount: -(basicAnnual * 0.10) / div, type: 'deduction' as const },
        { label: 'Employee CIT (10% of basic)', amount: -(basicAnnual * 0.10) / div, type: 'deduction' as const },
        { label: 'Employer PF (10% of basic) ✓', amount: (basicAnnual * 0.10) / div, type: 'note' as const },
        { label: 'Employer CIT (10% of basic) ✓', amount: (basicAnnual * 0.10) / div, type: 'note' as const },
      ] : [
        { label: 'Employee SSF (11% of gross)', amount: -(grossAnnual * 0.11) / div, type: 'deduction' as const },
        { label: 'Employer SSF (20% of gross) ✓', amount: (grossAnnual * 0.20) / div, type: 'note' as const },
      ]),
      { label: 'Income Tax',         amount: -annualTax / div,  type: 'tax' },
      { label: 'Net Take-Home',      amount: netAnnual  / div,  type: 'net' },
    ];

    return { rows, annualTax, netMonthly, netAnnual, grossAnnual, empDeduction, taxableIncome, slabBreakdown, div };
  }, [grossMonthly, basicPct, marital, scheme, view]);

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Salary Details</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Gross Monthly Salary (Rs.)</label>
            <input type="number" min="0" step="100" placeholder="e.g. 50000" value={grossMonthly}
              onChange={e => setGrossMonthly(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Basic Salary % of Gross</label>
            <input type="number" min="1" max="100" step="1" placeholder="e.g. 60" value={basicPct}
              onChange={e => setBasicPct(e.target.value)} className={inputClass} />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">PF/CIT/SSF are calculated on basic salary</p>
          </div>
        </div>

        {/* Marital status */}
        <div>
          <label className={labelClass}>Marital Status (for tax exemption)</label>
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
            {(['single', 'married'] as const).map(s => (
              <button key={s} onClick={() => setMarital(s)}
                className={`px-5 py-2 text-sm font-medium capitalize transition-colors ${marital === s ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                {s} {s === 'single' ? '(Rs.5L exempt)' : '(Rs.6L exempt)'}
              </button>
            ))}
          </div>
        </div>

        {/* Scheme */}
        <div>
          <label className={labelClass}>Deduction Scheme</label>
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
            {([['pf-cit', 'PF + CIT (10%+10%)'], ['ssf', 'SSF (11%)']]) .map(([s, label]) => (
              <button key={s} onClick={() => setScheme(s as Scheme)}
                className={`px-5 py-2 text-sm font-medium transition-colors ${scheme === s ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {scheme === 'pf-cit' ? 'Most common. Provident Fund + Citizens Investment Trust.' : 'Social Security Fund — alternative to PF+CIT (employer pays 20%).'}
          </p>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* View toggle */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Salary Breakdown</h3>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
              {(['monthly', 'annual'] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-3 py-1.5 capitalize transition-colors ${view === v ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Breakdown table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {result.rows.map((row, i) => {
              if (row.type === 'note') return (
                <div key={i} className="flex justify-between items-center px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-xs text-slate-400 dark:text-slate-500 italic">{row.label}</span>
                  <span className="text-xs text-green-600 dark:text-green-500 font-mono">+{fmtN(row.amount)}</span>
                </div>
              );
              const isNet = row.type === 'net';
              const isDeduct = row.type === 'deduction' || row.type === 'tax';
              return (
                <div key={i} className={`flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-700 ${isNet ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                  <span className={`text-sm ${isNet ? 'font-bold text-green-800 dark:text-green-300' : 'text-slate-700 dark:text-slate-300'}`}>{row.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm font-semibold ${isNet ? 'text-green-700 dark:text-green-400' : isDeduct ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {isDeduct ? '-' : ''}{fmtN(Math.abs(row.amount))}
                    </span>
                    {isNet && <CopyButton text={fmtN(Math.abs(row.amount))} size="sm" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tax slab breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Tax Slab Breakdown — Annual Taxable Income: {fmt(result.taxableIncome)}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    {['Income Range', 'Rate', 'Income in Slab', 'Tax'].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {result.slabBreakdown.map((slab, i) => (
                    <tr key={i} className={slab.tax > 0 ? 'bg-orange-50/30 dark:bg-orange-900/10' : ''}>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{slab.label}</td>
                      <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">{(slab.rate * 100).toFixed(0)}%</td>
                      <td className="px-3 py-2 font-mono text-slate-700 dark:text-slate-300">{fmtN(slab.band)}</td>
                      <td className="px-3 py-2 font-mono text-orange-700 dark:text-orange-400">{fmtN(slab.tax)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900">
                    <td colSpan={3} className="px-3 py-2 font-bold text-slate-800 dark:text-slate-200">Total Annual Tax</td>
                    <td className="px-3 py-2 font-mono font-bold text-orange-700 dark:text-orange-400">{fmtN(result.annualTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Employer total cost note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-xs text-blue-800 dark:text-blue-300">
            <strong>Employer's Total Cost (annual):</strong>{' '}
            {scheme === 'pf-cit'
              ? `${fmt(result.grossAnnual)} gross + ${fmt(result.grossAnnual * parseFloat(basicPct) / 100 * 0.20)} employer PF+CIT = ${fmt(result.grossAnnual + result.grossAnnual * parseFloat(basicPct) / 100 * 0.20)}`
              : `${fmt(result.grossAnnual)} gross + ${fmt(result.grossAnnual * 0.20)} employer SSF = ${fmt(result.grossAnnual * 1.20)}`
            }
            <p className="mt-1 text-blue-700 dark:text-blue-400">✓ rows above show employer contributions (not deducted from your salary — it's extra cost borne by employer)</p>
          </div>
        </>
      )}
    </div>
  );
}
