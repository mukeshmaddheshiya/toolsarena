'use client';

import { useState, useMemo } from 'react';

// ── helpers ──────────────────────────────────────────────────────────────────
function currency(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmt(n: number, decimals = 2) {
  return n.toFixed(decimals);
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const labelClass =
  'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
const cardClass =
  'bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4';

interface AmortRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const PREVIEW_ROWS = 12;

export function LoanAmortizationCalculatorTool() {
  const [loanAmount, setLoanAmount] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [showAll, setShowAll] = useState(false);

  const result = useMemo(() => {
    const P = parseFloat(loanAmount);
    const annRate = parseFloat(annualRate);
    const tenureVal = parseFloat(tenure);

    if (!P || P <= 0 || isNaN(annRate) || annRate < 0 || !tenureVal || tenureVal <= 0) return null;

    const r = annRate / 100 / 12; // monthly rate
    const n = tenureUnit === 'years' ? Math.round(tenureVal * 12) : Math.round(tenureVal);

    if (n <= 0) return null;

    // EMI formula
    let emi: number;
    if (r === 0) {
      emi = P / n;
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    const interestPct = (totalInterest / P) * 100;

    // Build amortization schedule
    const schedule: AmortRow[] = [];
    let balance = P;
    for (let month = 1; month <= n; month++) {
      const interestAmt = balance * r;
      const principalAmt = emi - interestAmt;
      balance = Math.max(0, balance - principalAmt);
      // Force the final balance to exactly zero to avoid floating-point drift
      if (month === n) balance = 0;
      schedule.push({
        month,
        payment: emi,
        principal: principalAmt,
        interest: interestAmt,
        balance,
      });
    }

    return { emi, totalPayment, totalInterest, interestPct, schedule, n };
  }, [loanAmount, annualRate, tenure, tenureUnit]);

  const visibleRows = useMemo(() => {
    if (!result) return [];
    return showAll ? result.schedule : result.schedule.slice(0, PREVIEW_ROWS);
  }, [result, showAll]);

  return (
    <div className="space-y-5">
      {/* ── Inputs ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Loan Details</h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Loan Amount ($)</label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 200000"
              value={loanAmount}
              onChange={e => setLoanAmount(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Annual Interest Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g. 7.5"
              value={annualRate}
              onChange={e => setAnnualRate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Loan Tenure</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                step="1"
                placeholder={tenureUnit === 'years' ? 'e.g. 20' : 'e.g. 240'}
                value={tenure}
                onChange={e => { setTenure(e.target.value); setShowAll(false); }}
                className={inputClass}
              />
              {/* Unit toggle */}
              <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                {(['years', 'months'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => { setTenureUnit(u); setShowAll(false); }}
                    className={`px-3 py-2 text-xs font-medium transition-colors capitalize ${
                      tenureUnit === u
                        ? 'bg-primary-800 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      {result && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={cardClass}>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Monthly EMI
              </p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                ${currency(result.emi)}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                per month × {result.n} months
              </p>
            </div>

            <div className={cardClass}>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Total Interest
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${currency(result.totalInterest)}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                over loan tenure
              </p>
            </div>

            <div className={cardClass}>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Total Payment
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                ${currency(result.totalPayment)}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Principal + Interest
              </p>
            </div>

            <div className={cardClass}>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Interest as % of Principal
              </p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {fmt(result.interestPct)}%
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                cost of borrowing
              </p>
            </div>
          </div>

          {/* ── Amortization Schedule ── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Monthly Amortization Schedule
              </h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {result.n} months total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    {['Month', 'Payment', 'Principal', 'Interest', 'Balance'].map(h => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {visibleRows.map(row => (
                    <tr
                      key={row.month}
                      className={
                        row.month % 12 === 0
                          ? 'bg-blue-50/50 dark:bg-blue-900/10'
                          : ''
                      }
                    >
                      <td className="px-4 py-2.5 font-medium text-slate-600 dark:text-slate-400">
                        {row.month}
                        {row.month % 12 === 0 && (
                          <span className="ml-1.5 text-xs text-blue-500 dark:text-blue-400">
                            Yr {row.month / 12}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-slate-700 dark:text-slate-300">
                        ${currency(row.payment)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-emerald-600 dark:text-emerald-400">
                        ${currency(row.principal)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-red-500 dark:text-red-400">
                        ${currency(row.interest)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-slate-700 dark:text-slate-300">
                        ${currency(row.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Show All / Show Less */}
            {result.n > PREVIEW_ROWS && (
              <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-700 text-center">
                <button
                  onClick={() => setShowAll(v => !v)}
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {showAll
                    ? 'Show Less'
                    : `Show All ${result.n} Months (${result.n - PREVIEW_ROWS} more)`}
                </button>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-400">
            <strong>Disclaimer:</strong> This calculator is for reference only. Actual EMI and amortization may differ due to rounding, processing fees, and lender policies. Interest rates change frequently. Consult your lender or a financial advisor for exact figures.
          </div>
        </>
      )}
    </div>
  );
}
