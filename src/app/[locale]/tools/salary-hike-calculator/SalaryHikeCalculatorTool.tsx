'use client';

import { useState, useMemo, useCallback } from 'react';
import { TrendingUp, Copy, Check, Info, AlertCircle } from 'lucide-react';

type SalaryMode = 'monthly' | 'annual';

interface HikeResult {
  oldMonthly: number;
  oldAnnual: number;
  newMonthly: number;
  newAnnual: number;
  hikeAmount: number;
  hikeAmountMonthly: number;
}

const WHAT_IF_HIKES = [5, 10, 15, 20, 25, 30];

function formatINR(value: number): string {
  return '₹' + value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function calcResult(salary: number, mode: SalaryMode, hikePct: number): HikeResult {
  const oldAnnual = mode === 'monthly' ? salary * 12 : salary;
  const oldMonthly = mode === 'monthly' ? salary : salary / 12;
  const newAnnual = oldAnnual * (1 + hikePct / 100);
  const newMonthly = newAnnual / 12;
  return {
    oldMonthly,
    oldAnnual,
    newMonthly,
    newAnnual,
    hikeAmount: newAnnual - oldAnnual,
    hikeAmountMonthly: newMonthly - oldMonthly,
  };
}

function inHand(annual: number): number {
  return annual * 0.7;
}

export function SalaryHikeCalculatorTool() {
  const [salaryInput, setSalaryInput] = useState<string>('');
  const [mode, setMode] = useState<SalaryMode>('annual');
  const [hikePct, setHikePct] = useState<number>(10);
  const [hikeInput, setHikeInput] = useState<string>('10');
  const [showInHand, setShowInHand] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>('');

  const salary = parseFloat(salaryInput.replace(/,/g, '')) || 0;

  const result = useMemo<HikeResult | null>(() => {
    if (salary <= 0) return null;
    return calcResult(salary, mode, hikePct);
  }, [salary, mode, hikePct]);

  const handleHikeInput = useCallback((val: string) => {
    setHikeInput(val);
    const n = parseFloat(val);
    if (!isNaN(n) && n >= 1 && n <= 100) {
      setHikePct(n);
      setError('');
    } else if (val !== '') {
      setError('Hike must be between 1% and 100%.');
    }
  }, []);

  const handleSlider = useCallback((val: number) => {
    setHikePct(val);
    setHikeInput(String(val));
    setError('');
  }, []);

  const handleCopy = useCallback(() => {
    if (!result) return;
    const text = `Salary Hike Summary\nOld CTC: ${formatINR(result.oldAnnual)}/yr\nNew CTC: ${formatINR(result.newAnnual)}/yr\nHike Amount: ${formatINR(result.hikeAmount)}/yr (${hikePct}%)\nNew Monthly: ${formatINR(result.newMonthly)}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result, hikePct]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-green-100 dark:bg-green-900/40 rounded-xl">
          <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Salary Hike Calculator</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">See your new salary after any hike percentage</p>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-5">
        {/* Salary + mode toggle */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Salary (₹)</label>
            <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 text-xs font-semibold">
              {(['monthly', 'annual'] as SalaryMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 transition-colors ${
                    mode === m
                      ? 'bg-green-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {m === 'monthly' ? 'Monthly' : 'Annual'}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
            <input
              type="number"
              min="0"
              value={salaryInput}
              onChange={(e) => { setSalaryInput(e.target.value); setError(''); }}
              placeholder={mode === 'monthly' ? 'e.g. 80000' : 'e.g. 1200000'}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
        </div>

        {/* Hike Percentage */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hike Percentage</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="100"
                step="0.5"
                value={hikeInput}
                onChange={(e) => handleHikeInput(e.target.value)}
                className="w-20 text-center px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm text-slate-500">%</span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={hikePct}
            onChange={(e) => handleSlider(Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-0.5">
            <span>1%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
          </div>
          {error && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
        </div>

        {/* In-hand toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInHand((v) => !v)}
            className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${showInHand ? 'bg-green-600' : 'bg-slate-300 dark:bg-slate-600'}`}
          >
            <span className={`inline-block w-4 h-4 bg-white rounded-full shadow mt-0.5 transition-transform ${showInHand ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-sm text-slate-600 dark:text-slate-400">Show estimated in-hand (after ~30% deductions)</span>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* New Salary highlight */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5">
            <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">New Annual CTC</p>
            <p className="text-4xl font-bold text-green-700 dark:text-green-300">{formatINR(result.newAnnual)}</p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1">{formatINR(result.newMonthly)} / month</p>
            {showInHand && (
              <p className="text-sm text-green-600 dark:text-green-500 mt-2">
                Estimated in-hand: <strong>{formatINR(inHand(result.newAnnual) / 12)}/month</strong> · {formatINR(inHand(result.newAnnual))}/year
              </p>
            )}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Hike Amount (Annual)', value: formatINR(result.hikeAmount), color: 'text-green-600 dark:text-green-400' },
              { label: 'Hike Amount (Monthly)', value: formatINR(result.hikeAmountMonthly), color: 'text-green-600 dark:text-green-400' },
              { label: 'Hike Percentage', value: `${hikePct}%`, color: 'text-indigo-600 dark:text-indigo-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Old vs New comparison table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Old vs New CTC Comparison</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
                    <th className="px-5 py-2.5 text-left font-medium">Component</th>
                    <th className="px-5 py-2.5 text-right font-medium">Old CTC</th>
                    <th className="px-5 py-2.5 text-right font-medium text-green-600 dark:text-green-400">New CTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {[
                    { label: 'Monthly', old: result.oldMonthly, new_: result.newMonthly },
                    { label: 'Annual', old: result.oldAnnual, new_: result.newAnnual },
                    ...(showInHand ? [
                      { label: 'Est. In-Hand (Monthly)', old: inHand(result.oldAnnual) / 12, new_: inHand(result.newAnnual) / 12 },
                      { label: 'Est. In-Hand (Annual)', old: inHand(result.oldAnnual), new_: inHand(result.newAnnual) },
                    ] : []),
                  ].map(({ label, old, new_ }) => (
                    <tr key={label} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{label}</td>
                      <td className="px-5 py-3 text-right text-slate-500 dark:text-slate-400 tabular-nums">{formatINR(old)}</td>
                      <td className="px-5 py-3 text-right text-green-600 dark:text-green-400 font-semibold tabular-nums">{formatINR(new_)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* What-If table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">What If — Hike Scenarios</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
                    <th className="px-5 py-2.5 text-left font-medium">Hike %</th>
                    <th className="px-5 py-2.5 text-right font-medium">New Annual</th>
                    <th className="px-5 py-2.5 text-right font-medium">New Monthly</th>
                    <th className="px-5 py-2.5 text-right font-medium">Hike Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {WHAT_IF_HIKES.map((pct) => {
                    const r = calcResult(salary, mode, pct);
                    const isSelected = pct === hikePct;
                    return (
                      <tr
                        key={pct}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${isSelected ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                      >
                        <td className="px-5 py-2.5 font-semibold text-slate-700 dark:text-slate-200">
                          {pct}% {isSelected && <span className="ml-1 text-xs text-green-600 dark:text-green-400">(selected)</span>}
                        </td>
                        <td className="px-5 py-2.5 text-right tabular-nums text-indigo-600 dark:text-indigo-400 font-medium">{formatINR(r.newAnnual)}</td>
                        <td className="px-5 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-300">{formatINR(r.newMonthly)}</td>
                        <td className="px-5 py-2.5 text-right tabular-nums text-green-600 dark:text-green-400">+{formatINR(r.hikeAmount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <strong>Note:</strong> In-hand estimates use a flat 30% deduction for illustration. Actual take-home depends on your tax slab, investments under 80C/80D, HRA exemption, PF contributions, and other deductions. Consult a tax advisor for precise figures.
            </p>
          </div>
        </>
      )}

      {!result && salaryInput === '' && (
        <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
          Enter your current salary and hike percentage above to see results.
        </div>
      )}
    </div>
  );
}
