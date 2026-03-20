'use client';

import { useState, useMemo } from 'react';
import { ArrowDownCircle, AlertTriangle, TrendingUp, Info, ChevronDown } from 'lucide-react';

interface MonthRow {
  month: number;
  openingBalance: number;
  returnEarned: number;
  withdrawal: number;
  closingBalance: number;
}

interface SwpResult {
  months: number;
  totalWithdrawn: number;
  totalReturns: number;
  isInfinite: boolean;
  finalBalance: number;
  rows: MonthRow[];
}

function formatINR(val: number): string {
  return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function formatCompact(val: number): string {
  if (val >= 1_00_00_000) return '₹' + (val / 1_00_00_000).toFixed(2) + ' Cr';
  if (val >= 1_00_000) return '₹' + (val / 1_00_000).toFixed(2) + ' L';
  return formatINR(val);
}

function calculateSWP(corpus: number, monthlyWithdrawal: number, annualReturn: number): SwpResult {
  const monthlyRate = annualReturn / 100 / 12;
  const rows: MonthRow[] = [];
  let balance = corpus;
  let totalWithdrawn = 0;
  let totalReturns = 0;
  const MAX_MONTHS = 600; // cap at 50 years

  // Check if corpus grows (withdrawal < monthly return on first month)
  const firstMonthReturn = balance * monthlyRate;
  if (monthlyWithdrawal <= firstMonthReturn) {
    // Corpus grows — show 24 months for illustration
    for (let m = 1; m <= 24; m++) {
      const ret = balance * monthlyRate;
      balance = balance + ret - monthlyWithdrawal;
      totalWithdrawn += monthlyWithdrawal;
      totalReturns += ret;
      rows.push({ month: m, openingBalance: balance - ret + monthlyWithdrawal, returnEarned: ret, withdrawal: monthlyWithdrawal, closingBalance: balance });
    }
    return { months: Infinity, totalWithdrawn, totalReturns, isInfinite: true, finalBalance: balance, rows };
  }

  for (let m = 1; m <= MAX_MONTHS; m++) {
    const opening = balance;
    const ret = balance * monthlyRate;
    totalReturns += ret;
    balance = balance + ret - monthlyWithdrawal;

    if (balance <= 0) {
      const partialWithdrawal = opening + ret;
      totalWithdrawn += partialWithdrawal;
      rows.push({ month: m, openingBalance: opening, returnEarned: ret, withdrawal: partialWithdrawal, closingBalance: 0 });
      return { months: m, totalWithdrawn, totalReturns, isInfinite: false, finalBalance: 0, rows };
    }

    totalWithdrawn += monthlyWithdrawal;
    rows.push({ month: m, openingBalance: opening, returnEarned: ret, withdrawal: monthlyWithdrawal, closingBalance: balance });
  }

  return { months: MAX_MONTHS, totalWithdrawn, totalReturns, isInfinite: false, finalBalance: balance, rows };
}

export function SwpCalculatorTool() {
  const [corpus, setCorpus] = useState<string>('');
  const [withdrawal, setWithdrawal] = useState<string>('');
  const [returnRate, setReturnRate] = useState<string>('8');
  const [showFullTable, setShowFullTable] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculated, setCalculated] = useState(false);

  const result = useMemo<SwpResult | null>(() => {
    if (!calculated) return null;
    const c = parseFloat(corpus.replace(/,/g, ''));
    const w = parseFloat(withdrawal.replace(/,/g, ''));
    const r = parseFloat(returnRate);
    if (!c || !w || !r || c <= 0 || w <= 0 || r <= 0) return null;
    return calculateSWP(c, w, r);
  }, [calculated, corpus, withdrawal, returnRate]);

  const handleCalculate = () => {
    const errs: Record<string, string> = {};
    const c = parseFloat(corpus.replace(/,/g, ''));
    const w = parseFloat(withdrawal.replace(/,/g, ''));
    const r = parseFloat(returnRate);
    if (!corpus || isNaN(c) || c <= 0) errs.corpus = 'Enter a valid corpus amount.';
    if (!withdrawal || isNaN(w) || w <= 0) errs.withdrawal = 'Enter a valid withdrawal amount.';
    if (c && w && w >= c) errs.withdrawal = 'Withdrawal cannot exceed your entire corpus.';
    if (!returnRate || isNaN(r) || r <= 0 || r > 30) errs.returnRate = 'Enter a return rate between 0.1% and 30%.';
    setErrors(errs);
    if (Object.keys(errs).length === 0) setCalculated(true);
  };

  const displayedRows = result ? (showFullTable ? result.rows : result.rows.slice(0, 24)) : [];

  const monthlyReturn = result
    ? parseFloat(corpus.replace(/,/g, '')) * (parseFloat(returnRate) / 100 / 12)
    : 0;
  const isDepletingCorpus = result && !result.isInfinite;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-violet-100 dark:bg-violet-900/40 rounded-xl">
          <ArrowDownCircle className="w-6 h-6 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">SWP Calculator</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Systematic Withdrawal Plan — plan your retirement income</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        {/* Corpus */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Total Corpus (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
            <input
              type="number"
              min="0"
              value={corpus}
              onChange={(e) => { setCorpus(e.target.value); setCalculated(false); }}
              placeholder="e.g. 50,00,000"
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
          </div>
          {errors.corpus && <p className="mt-1 text-xs text-red-500">{errors.corpus}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Monthly Withdrawal */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Monthly Withdrawal (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
              <input
                type="number"
                min="0"
                value={withdrawal}
                onChange={(e) => { setWithdrawal(e.target.value); setCalculated(false); }}
                placeholder="e.g. 30000"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              />
            </div>
            {errors.withdrawal && <p className="mt-1 text-xs text-red-500">{errors.withdrawal}</p>}
          </div>

          {/* Return Rate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Expected Annual Return (%)</label>
            <div className="relative">
              <input
                type="number"
                min="0.1"
                max="30"
                step="0.1"
                value={returnRate}
                onChange={(e) => { setReturnRate(e.target.value); setCalculated(false); }}
                placeholder="8"
                className="w-full pl-4 pr-8 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
            {errors.returnRate && <p className="mt-1 text-xs text-red-500">{errors.returnRate}</p>}
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
        >
          Calculate SWP
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Status callout */}
          {result.isInfinite ? (
            <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">Your corpus is growing!</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Your monthly withdrawal of {formatINR(parseFloat(withdrawal))} is less than your monthly return of ~{formatINR(monthlyReturn)}. Your corpus will grow indefinitely.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Corpus is depleting</p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                  Your monthly withdrawal exceeds monthly returns (~{formatINR(monthlyReturn)}). Corpus will last for{' '}
                  <strong>{result.months} months ({(result.months / 12).toFixed(1)} years)</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              {
                label: 'Corpus Lasts',
                value: result.isInfinite ? '∞ (Forever)' : `${result.months} months`,
                sub: result.isInfinite ? 'Corpus growing' : `${(result.months / 12).toFixed(1)} years`,
                color: result.isInfinite ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400',
              },
              {
                label: 'Total Withdrawn',
                value: formatCompact(result.totalWithdrawn),
                sub: formatINR(result.totalWithdrawn),
                color: 'text-violet-600 dark:text-violet-400',
              },
              {
                label: 'Total Returns Earned',
                value: formatCompact(result.totalReturns),
                sub: formatINR(result.totalReturns),
                color: 'text-indigo-600 dark:text-indigo-400',
              },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Month-by-month table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                Month-by-Month Breakdown {!showFullTable && result.rows.length > 24 && `(First 24 of ${result.rows.length} months)`}
              </h3>
              {result.rows.length > 24 && (
                <button
                  onClick={() => setShowFullTable((v) => !v)}
                  className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline"
                >
                  {showFullTable ? 'Show less' : `Show all ${result.rows.length} months`}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFullTable ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
                    <th className="px-4 py-2.5 text-left font-medium">Month</th>
                    <th className="px-4 py-2.5 text-right font-medium">Opening Balance</th>
                    <th className="px-4 py-2.5 text-right font-medium">Return Earned</th>
                    <th className="px-4 py-2.5 text-right font-medium">Withdrawal</th>
                    <th className="px-4 py-2.5 text-right font-medium">Closing Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {displayedRows.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">Month {row.month}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-300">{formatCompact(row.openingBalance)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-emerald-600 dark:text-emerald-400">{formatCompact(row.returnEarned)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-red-500 dark:text-red-400">{formatCompact(row.withdrawal)}</td>
                      <td className={`px-4 py-2.5 text-right tabular-nums font-medium ${row.closingBalance < parseFloat(corpus.replace(/,/g, '')) * 0.1 && row.closingBalance > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'}`}>
                        {formatCompact(row.closingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <strong>Disclaimer:</strong> Returns are estimated based on a constant rate. Actual mutual fund returns fluctuate with markets. Consult a financial advisor before planning retirement withdrawals.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
