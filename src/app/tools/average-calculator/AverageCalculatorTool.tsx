'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, X } from 'lucide-react';

interface Stats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  range: number;
  min: number;
  max: number;
  variance: number;
  stdDev: number;
  geometricMean: number;
  harmonicMean: number;
  q1: number;
  q3: number;
  iqr: number;
}

function calcStats(nums: number[]): Stats | null {
  if (!nums.length) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const n = nums.length;
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  // Median
  const mid = Math.floor(n / 2);
  const median = n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  // Mode
  const freq: Record<number, number> = {};
  for (const v of nums) freq[v] = (freq[v] || 0) + 1;
  const maxFreq = Math.max(...Object.values(freq));
  const mode = maxFreq > 1 ? Object.keys(freq).filter(k => freq[+k] === maxFreq).map(Number) : [];

  // Variance & Std Dev (population)
  const variance = nums.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);

  // Geometric mean (only positive numbers)
  const allPositive = nums.every(v => v > 0);
  const geometricMean = allPositive ? Math.exp(nums.reduce((a, v) => a + Math.log(v), 0) / n) : NaN;

  // Harmonic mean (only positive numbers)
  const harmonicMean = allPositive ? n / nums.reduce((a, v) => a + 1 / v, 0) : NaN;

  // Quartiles
  const q1idx = Math.floor(n / 4);
  const q3idx = Math.floor(3 * n / 4);
  const q1 = n % 4 === 0 ? (sorted[q1idx - 1] + sorted[q1idx]) / 2 : sorted[q1idx];
  const q3 = n % 4 === 0 ? (sorted[q3idx - 1] + sorted[q3idx]) / 2 : sorted[q3idx];

  return {
    count: n, sum, mean, median, mode,
    range: sorted[n - 1] - sorted[0],
    min: sorted[0], max: sorted[n - 1],
    variance, stdDev, geometricMean, harmonicMean,
    q1, q3, iqr: q3 - q1,
  };
}

function fmt(n: number, dp = 4): string {
  if (isNaN(n)) return 'N/A';
  return +n.toFixed(dp) + '';
}

const SAMPLE = '10, 20, 30, 40, 50, 20, 30';

export function AverageCalculatorTool() {
  const [input, setInput] = useState(SAMPLE);
  const [copied, setCopied] = useState<string | null>(null);

  const { nums, errors } = useMemo(() => {
    const raw = input.split(/[\s,;\n]+/).filter(Boolean);
    const errors: string[] = [];
    const nums: number[] = [];
    for (const r of raw) {
      const n = Number(r);
      if (isNaN(n)) errors.push(r);
      else nums.push(n);
    }
    return { nums, errors };
  }, [input]);

  const stats = useMemo(() => calcStats(nums), [nums]);

  const copy = async (val: string, key: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const CopyBtn = ({ val, k }: { val: string; k: string }) => (
    <button onClick={() => copy(val, k)} className="p-1 rounded text-gray-300 hover:text-blue-500 transition-colors">
      {copied === k ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );

  const StatCard = ({ label, value, k, highlight = false }: { label: string; value: string; k: string; highlight?: boolean }) => (
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${highlight ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{label}</p>
        <p className={`text-lg font-bold ${highlight ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-100'}`}>{value}</p>
      </div>
      <CopyBtn val={value} k={k} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Enter Numbers</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{nums.length} number{nums.length !== 1 ? 's' : ''}</span>
            <button onClick={() => setInput('')} className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter numbers separated by commas, spaces, or new lines…&#10;Example: 10, 25, 30.5, 42, 10"
          className="w-full h-28 px-4 py-3 text-sm bg-transparent text-gray-800 dark:text-gray-200 resize-none focus:outline-none font-mono"
        />
        {errors.length > 0 && (
          <div className="px-4 pb-3">
            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-1.5">
              Skipped non-numeric values: <strong>{errors.join(', ')}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Sample data', val: '10, 20, 30, 40, 50, 20, 30' },
          { label: 'Exam scores', val: '85, 92, 78, 96, 88, 74, 90, 83' },
          { label: 'With decimals', val: '1.5, 2.7, 3.2, 4.8, 2.1, 3.9' },
          { label: 'Clear', val: '' },
        ].map(({ label, val }) => (
          <button key={label} onClick={() => setInput(val)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            {label}
          </button>
        ))}
      </div>

      {/* Results */}
      {stats && (
        <>
          {/* Primary stats - big cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Average (Mean)" value={fmt(stats.mean)} k="mean" highlight />
            <StatCard label="Median" value={fmt(stats.median)} k="median" highlight />
            <StatCard label="Sum" value={fmt(stats.sum)} k="sum" highlight />
            <StatCard label="Count" value={String(stats.count)} k="count" highlight />
          </div>

          {/* Two columns of stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Central tendency */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Central Tendency</p>
              <StatCard label="Arithmetic Mean" value={fmt(stats.mean)} k="arith" />
              <StatCard label="Geometric Mean" value={fmt(stats.geometricMean)} k="geom" />
              <StatCard label="Harmonic Mean" value={fmt(stats.harmonicMean)} k="harm" />
              <div className="flex items-center justify-between px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Mode</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {stats.mode.length > 0 ? stats.mode.join(', ') : 'No mode'}
                  </p>
                </div>
                {stats.mode.length > 0 && <CopyBtn val={stats.mode.join(', ')} k="mode" />}
              </div>
            </div>

            {/* Spread & distribution */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Spread & Distribution</p>
              <StatCard label="Minimum" value={fmt(stats.min)} k="min" />
              <StatCard label="Maximum" value={fmt(stats.max)} k="max" />
              <StatCard label="Range (Max − Min)" value={fmt(stats.range)} k="range" />
              <StatCard label="Std Deviation (σ)" value={fmt(stats.stdDev)} k="std" />
              <StatCard label="Variance (σ²)" value={fmt(stats.variance)} k="var" />
            </div>
          </div>

          {/* Quartiles */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quartiles</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Q1 (25th Pct)" value={fmt(stats.q1)} k="q1" />
              <StatCard label="Q2 / Median (50th)" value={fmt(stats.median)} k="q2" />
              <StatCard label="Q3 (75th Pct)" value={fmt(stats.q3)} k="q3" />
              <StatCard label="IQR (Q3 − Q1)" value={fmt(stats.iqr)} k="iqr" />
            </div>
          </div>

          {/* Distribution bar */}
          {nums.length >= 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Distribution</p>
              <div className="space-y-2">
                {[...nums].sort((a, b) => a - b).map((v, i) => {
                  const pct = stats.max === stats.min ? 100 : ((v - stats.min) / (stats.range)) * 100;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-16 text-right shrink-0 font-mono">{fmt(v, 2)}</span>
                      <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all" style={{ width: `${Math.max(pct, 2)}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 w-12 shrink-0 font-mono">{pct.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-3 text-xs text-gray-400">
                <span>Min: {fmt(stats.min, 2)}</span>
                <span>Mean: {fmt(stats.mean, 2)}</span>
                <span>Max: {fmt(stats.max, 2)}</span>
              </div>
            </div>
          )}
        </>
      )}

      {!stats && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-4xl mb-3">∑</p>
          <p className="text-sm">Enter numbers above to see statistics</p>
        </div>
      )}
    </div>
  );
}
