'use client';

import { useState, useMemo } from 'react';

// ── helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
function currency(n: number) {
  return '$' + fmt(n);
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const labelClass =
  'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
const cardClass =
  'bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4';

// ── volume rows ───────────────────────────────────────────────────────────────
const VOLUME_LEVELS = [
  { label: '50% of BEP', factor: 0.5 },
  { label: '75% of BEP', factor: 0.75 },
  { label: '100% (Break-Even)', factor: 1.0 },
  { label: '150% of BEP', factor: 1.5 },
  { label: '200% of BEP', factor: 2.0 },
];

export function BreakEvenCalculatorTool() {
  const [fixedCosts, setFixedCosts] = useState('');
  const [varCostPerUnit, setVarCostPerUnit] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [currentUnits, setCurrentUnits] = useState('');

  type BepResult = {
    error: string | null;
    contributionMargin: number;
    contributionMarginRatio: number;
    bepUnits: number;
    bepRevenue: number;
    volumeTable: { label: string; factor: number; units: number; revenue: number; profit: number }[];
    safetyMargin: number | null;
    safetyUnits: number | null;
  };

  const result = useMemo((): BepResult | null => {
    const fc = parseFloat(fixedCosts);
    const vc = parseFloat(varCostPerUnit);
    const sp = parseFloat(sellingPrice);

    if (isNaN(fc) || isNaN(vc) || isNaN(sp) || fc < 0 || vc < 0 || sp <= 0) return null;
    if (sp <= vc) return { error: 'Selling price must be greater than variable cost per unit.', contributionMargin: 0, contributionMarginRatio: 0, bepUnits: 0, bepRevenue: 0, volumeTable: [], safetyMargin: null, safetyUnits: null };

    const contributionMargin = sp - vc;
    const contributionMarginRatio = (contributionMargin / sp) * 100;
    const bepUnits = fc / contributionMargin;
    const bepRevenue = fc / (contributionMarginRatio / 100);

    const volumeTable = VOLUME_LEVELS.map(row => {
      const units = bepUnits * row.factor;
      const revenue = units * sp;
      const totalVar = units * vc;
      const profit = revenue - totalVar - fc;
      return { ...row, units, revenue, profit };
    });

    // Safety margin
    const cu = parseFloat(currentUnits);
    let safetyMargin: number | null = null;
    let safetyUnits: number | null = null;
    if (!isNaN(cu) && cu > 0) {
      safetyMargin = ((cu - bepUnits) / cu) * 100;
      safetyUnits = cu - bepUnits;
    }

    return {
      error: null,
      contributionMargin,
      contributionMarginRatio,
      bepUnits,
      bepRevenue,
      volumeTable,
      safetyMargin,
      safetyUnits,
    };
  }, [fixedCosts, varCostPerUnit, sellingPrice, currentUnits]);

  return (
    <div className="space-y-5">
      {/* ── Inputs ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Cost & Price Details</h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Fixed Costs ($)</label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 10000"
              value={fixedCosts}
              onChange={e => setFixedCosts(e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Monthly or total — be consistent.
            </p>
          </div>
          <div>
            <label className={labelClass}>Variable Cost per Unit ($)</label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 8"
              value={varCostPerUnit}
              onChange={e => setVarCostPerUnit(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Selling Price per Unit ($)</label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 20"
              value={sellingPrice}
              onChange={e => setSellingPrice(e.target.value)}
              className={inputClass}
            />
            {result && 'error' in result && result.error && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{result.error}</p>
            )}
          </div>
        </div>

        {/* Optional: current sales */}
        <div className="sm:max-w-xs">
          <label className={labelClass}>Current Sales Units (optional — for safety margin)</label>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 800"
            value={currentUnits}
            onChange={e => setCurrentUnits(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* ── Results ── */}
      {result && !result.error && (
        <>
          {/* Stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={cardClass}>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Contribution Margin
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {currency(result.contributionMargin)}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">per unit</p>
            </div>

            <div className={cardClass}>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Contribution Margin Ratio
              </p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {fmt(result.contributionMarginRatio)}%
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">of selling price</p>
            </div>

            <div className={cardClass}>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Break-Even Units
              </p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {fmt(result.bepUnits, 0)} units
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                ({fmt(result.bepUnits, 1)} exact)
              </p>
            </div>

            <div className={cardClass}>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Break-Even Revenue
              </p>
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                {currency(result.bepRevenue)}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">total revenue needed</p>
            </div>
          </div>

          {/* Safety margin */}
          {result.safetyMargin !== null && (
            <div
              className={`rounded-xl border px-4 py-3 ${
                result.safetyMargin >= 0
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  result.safetyMargin >= 0
                    ? 'text-emerald-800 dark:text-emerald-300'
                    : 'text-red-800 dark:text-red-300'
                }`}
              >
                Margin of Safety:{' '}
                <span className="font-mono">{fmt(result.safetyMargin)}%</span>
                {' '}({fmt(result.safetyUnits!, 1)} units{' '}
                {result.safetyMargin >= 0 ? 'above' : 'below'} break-even)
              </p>
              <p
                className={`text-xs mt-1 ${
                  result.safetyMargin >= 0
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-red-700 dark:text-red-400'
                }`}
              >
                {result.safetyMargin >= 0
                  ? 'Your current sales are above break-even — you are profitable.'
                  : 'Your current sales are below break-even — you are operating at a loss.'}
              </p>
            </div>
          )}

          {/* Profit/Loss table at various volumes */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Profit / Loss at Different Sales Volumes
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    {['Sales Volume', 'Units Sold', 'Revenue', 'Profit / Loss'].map(h => (
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
                  {result.volumeTable.map((row, i) => {
                    const isBep = row.factor === 1;
                    const isProfit = row.profit > 0;
                    return (
                      <tr
                        key={i}
                        className={
                          isBep
                            ? 'bg-amber-50 dark:bg-amber-900/20'
                            : ''
                        }
                      >
                        <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                          {row.label}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                          {fmt(row.units, 0)}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">
                          {currency(row.revenue)}
                        </td>
                        <td
                          className={`px-4 py-3 font-mono font-semibold ${
                            isBep
                              ? 'text-amber-700 dark:text-amber-400'
                              : isProfit
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {isBep
                            ? '$0.00'
                            : (row.profit < 0 ? '-' : '+') + currency(Math.abs(row.profit))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
