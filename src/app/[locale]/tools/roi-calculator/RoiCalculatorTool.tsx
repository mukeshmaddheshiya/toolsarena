'use client';

import { useState, useMemo } from 'react';

// ── helpers ──────────────────────────────────────────────────────────────────
function pct(n: number, decimals = 2) {
  return n.toFixed(decimals) + '%';
}
function currency(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function yearsFromMonths(y: number, m: number) {
  return y + m / 12;
}

interface RoiResult {
  roi: number;
  netProfit: number;
  annualisedRoi: number | null;
  isProfit: boolean;
}

function calcRoi(initial: number, netProfit: number, years: number): RoiResult {
  const roi = (netProfit / initial) * 100;
  const totalYears = years;
  let annualisedRoi: number | null = null;
  if (totalYears > 0) {
    const base = 1 + roi / 100;
    // Can't compute real-valued root of a negative base (total loss > 100%)
    if (base > 0) {
      annualisedRoi = (Math.pow(base, 1 / totalYears) - 1) * 100;
    }
    // base === 0 means 100% loss; annualisedRoi stays null (N/A)
  }
  return { roi, netProfit, annualisedRoi, isProfit: netProfit >= 0 };
}

// ── comparison investment ────────────────────────────────────────────────────
interface CompareInvestment {
  name: string;
  initial: string;
  finalValue: string;
  years: string;
  months: string;
}

const emptyInvestment = (): CompareInvestment => ({
  name: '',
  initial: '',
  finalValue: '',
  years: '1',
  months: '0',
});

// ── shared class strings ─────────────────────────────────────────────────────
const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const labelClass =
  'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
const cardClass =
  'bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4';

export function RoiCalculatorTool() {
  const [mode, setMode] = useState<'profit' | 'values'>('values');
  const [initial, setInitial] = useState('');
  const [netProfitInput, setNetProfitInput] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [years, setYears] = useState('1');
  const [months, setMonths] = useState('0');

  // compare
  const [showCompare, setShowCompare] = useState(false);
  const [investments, setInvestments] = useState<CompareInvestment[]>([
    emptyInvestment(),
    emptyInvestment(),
  ]);

  const result = useMemo<RoiResult | null>(() => {
    const inv = parseFloat(initial);
    if (!inv || inv <= 0) return null;

    let profit: number;
    if (mode === 'profit') {
      profit = parseFloat(netProfitInput);
      if (isNaN(profit)) return null;
    } else {
      const fin = parseFloat(finalValue);
      if (isNaN(fin)) return null;
      profit = fin - inv;
    }

    const totalYears = yearsFromMonths(parseFloat(years) || 0, parseFloat(months) || 0);
    return calcRoi(inv, profit, totalYears);
  }, [mode, initial, netProfitInput, finalValue, years, months]);

  const compareResults = useMemo(() => {
    return investments
      .map((inv, idx) => {
        const init = parseFloat(inv.initial);
        const fin = parseFloat(inv.finalValue);
        if (!init || init <= 0 || isNaN(fin)) return null;
        const profit = fin - init;
        const totalYears = yearsFromMonths(parseFloat(inv.years) || 0, parseFloat(inv.months) || 0);
        const r = calcRoi(init, profit, totalYears);
        return { ...r, name: inv.name || `Investment ${idx + 1}`, idx };
      })
      .filter(Boolean) as (RoiResult & { name: string; idx: number })[];
  }, [investments]);

  const sortedCompare = useMemo(
    () => [...compareResults].sort((a, b) => b.roi - a.roi),
    [compareResults]
  );

  function updateInvestment(idx: number, field: keyof CompareInvestment, val: string) {
    setInvestments(prev => prev.map((inv, i) => (i === idx ? { ...inv, [field]: val } : inv)));
  }

  function addInvestment() {
    if (investments.length < 3) setInvestments(prev => [...prev, emptyInvestment()]);
  }

  function removeInvestment(idx: number) {
    setInvestments(prev => prev.filter((_, i) => i !== idx));
  }

  const roiColor = (r: RoiResult) =>
    r.isProfit
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-red-600 dark:text-red-400';

  return (
    <div className="space-y-5">
      {/* ── Inputs ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Investment Details</h3>

        {/* Mode toggle */}
        <div>
          <label className={labelClass}>Input Mode</label>
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
            {([['values', 'Initial + Final Value'], ['profit', 'Net Profit']] as const).map(
              ([m, label]) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-5 py-2 text-sm font-medium transition-colors ${
                    mode === m
                      ? 'bg-primary-800 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Initial Investment ($)</label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 10000"
              value={initial}
              onChange={e => setInitial(e.target.value)}
              className={inputClass}
            />
          </div>

          {mode === 'profit' ? (
            <div>
              <label className={labelClass}>Net Profit / Loss ($)</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 2500 or -500"
                value={netProfitInput}
                onChange={e => setNetProfitInput(e.target.value)}
                className={inputClass}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Use negative for a loss.
              </p>
            </div>
          ) : (
            <div>
              <label className={labelClass}>Final Value ($)</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 12500"
                value={finalValue}
                onChange={e => setFinalValue(e.target.value)}
                className={inputClass}
              />
            </div>
          )}
        </div>

        {/* Period */}
        <div>
          <label className={labelClass}>Investment Period (for annualised ROI)</label>
          <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
            <div>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Years"
                value={years}
                onChange={e => setYears(e.target.value)}
                className={inputClass}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Years</p>
            </div>
            <div>
              <input
                type="number"
                min="0"
                max="11"
                step="1"
                placeholder="Months"
                value={months}
                onChange={e => setMonths(e.target.value)}
                className={inputClass}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Months</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="grid sm:grid-cols-3 gap-4">
          {/* ROI % */}
          <div className={cardClass}>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">ROI</p>
            <p className={`text-2xl font-bold ${roiColor(result)}`}>{pct(result.roi)}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {result.isProfit ? 'Profit' : 'Loss'}
            </p>
          </div>

          {/* Net Profit */}
          <div className={cardClass}>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Net {result.isProfit ? 'Profit' : 'Loss'}
            </p>
            <p className={`text-2xl font-bold ${roiColor(result)}`}>
              {result.netProfit < 0 ? '-' : ''}${currency(Math.abs(result.netProfit))}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Final – Initial
            </p>
          </div>

          {/* Annualised ROI */}
          <div className={cardClass}>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Annualised ROI
            </p>
            {result.annualisedRoi !== null ? (
              <p className={`text-2xl font-bold ${roiColor(result)}`}>
                {pct(result.annualisedRoi)}
              </p>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">
                {(parseFloat(years) || 0) === 0 && (parseFloat(months) || 0) === 0
                  ? 'N/A (period = 0)'
                  : result.roi <= -100
                  ? 'N/A (total loss)'
                  : 'Enter period'}
              </p>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Compounded annual rate
            </p>
          </div>
        </div>
      )}

      {/* ── Compare Investments ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <button
          onClick={() => setShowCompare(v => !v)}
          className="w-full flex items-center justify-between px-4 sm:px-5 py-4 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <span>Compare Investments (up to 3)</span>
          <span className="text-slate-400 dark:text-slate-500">{showCompare ? '▲' : '▼'}</span>
        </button>

        {showCompare && (
          <div className="px-4 sm:px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-slate-700 pt-4">
            {investments.map((inv, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Investment {idx + 1}
                  </span>
                  {investments.length > 2 && (
                    <button
                      onClick={() => removeInvestment(idx)}
                      className="text-xs text-red-500 dark:text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Stocks"
                      value={inv.name}
                      onChange={e => updateInvestment(idx, 'name', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Initial Investment ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="e.g. 5000"
                      value={inv.initial}
                      onChange={e => updateInvestment(idx, 'initial', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Final Value ($)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 6500"
                      value={inv.finalValue}
                      onChange={e => updateInvestment(idx, 'finalValue', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClass}>Years</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="1"
                        value={inv.years}
                        onChange={e => updateInvestment(idx, 'years', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Months</label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        step="1"
                        placeholder="0"
                        value={inv.months}
                        onChange={e => updateInvestment(idx, 'months', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {investments.length < 3 && (
              <button
                onClick={addInvestment}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                + Add Investment
              </button>
            )}

            {/* Comparison table */}
            {sortedCompare.length >= 2 && (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      {['Rank', 'Name', 'Initial', 'Net Profit/Loss', 'ROI %', 'Annualised ROI'].map(
                        h => (
                          <th
                            key={h}
                            className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-400"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                    {sortedCompare.map((r, rank) => (
                      <tr key={r.idx} className={rank === 0 ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}>
                        <td className="px-3 py-2.5 font-bold text-slate-700 dark:text-slate-300">
                          {rank === 0 ? '🥇' : rank === 1 ? '🥈' : '🥉'}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                          {r.name}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-slate-400">
                          ${currency(parseFloat(investments[r.idx].initial))}
                        </td>
                        <td
                          className={`px-3 py-2.5 font-mono font-semibold ${
                            r.isProfit
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {r.netProfit < 0 ? '-' : '+'}${currency(Math.abs(r.netProfit))}
                        </td>
                        <td
                          className={`px-3 py-2.5 font-mono font-bold ${
                            r.isProfit
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {pct(r.roi)}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-slate-400">
                          {r.annualisedRoi !== null ? pct(r.annualisedRoi) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
