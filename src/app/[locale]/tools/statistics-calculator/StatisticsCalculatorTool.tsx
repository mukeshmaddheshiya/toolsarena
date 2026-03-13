'use client';
import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';

const INPUT_CLASS = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const LABEL_CLASS = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
const CARD_CLASS = 'bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4';

function parseNumbers(input: string): number[] {
  return input
    .split(/[\s,\n]+/)
    .map(s => s.trim())
    .filter(s => s !== '')
    .map(Number)
    .filter(n => !isNaN(n) && isFinite(n));
}

function median(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return 0;
  const mid = Math.floor(n / 2);
  return n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function modes(nums: number[]): number[] {
  const freq: Record<string, number> = {};
  nums.forEach(n => { freq[n] = (freq[n] || 0) + 1; });
  const maxFreq = Math.max(...Object.values(freq));
  if (maxFreq === 1) return [];
  return Object.entries(freq)
    .filter(([, count]) => count === maxFreq)
    .map(([val]) => Number(val))
    .sort((a, b) => a - b);
}

// Q1 = median of lower half (excluding median element if odd count)
// Q3 = median of upper half (excluding median element if odd count)
function quartile(sorted: number[], q: 0.25 | 0.75): number {
  const n = sorted.length;
  if (n === 0) return 0;
  const mid = Math.floor(n / 2);
  if (q === 0.25) {
    // Lower half: elements before the middle index
    const lower = sorted.slice(0, mid);
    return median(lower);
  } else {
    // Upper half: elements after the middle index (skip median for odd n)
    const upper = n % 2 === 0 ? sorted.slice(mid) : sorted.slice(mid + 1);
    return median(upper);
  }
}

interface Stats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  modes: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  stdDev: number;
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
  sorted: number[];
  frequency: [number, number][];
}

function computeStats(nums: number[]): Stats {
  const sorted = [...nums].sort((a, b) => a - b);
  const count = nums.length;
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = sum / count;
  const med = median(sorted);
  const modeList = modes(nums);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;
  const variance = nums.reduce((acc, n) => acc + (n - mean) ** 2, 0) / count;
  const stdDev = Math.sqrt(variance);
  const q1 = quartile(sorted, 0.25);
  const q2 = median(sorted);
  const q3 = quartile(sorted, 0.75);
  const iqr = q3 - q1;

  const freqMap: Map<number, number> = new Map();
  nums.forEach(n => freqMap.set(n, (freqMap.get(n) || 0) + 1));
  const frequency: [number, number][] = [...freqMap.entries()].sort((a, b) => a[0] - b[0]);

  return { count, sum, mean, median: med, modes: modeList, min, max, range, variance, stdDev, q1, q2, q3, iqr, sorted, frequency };
}

function fmt(n: number): string {
  if (!isFinite(n)) return 'N/A';
  if (Number.isInteger(n)) return n.toString();
  const s = n.toPrecision(8);
  return parseFloat(s).toString();
}

export function StatisticsCalculatorTool() {
  const [input, setInput] = useState('');

  const nums = useMemo(() => parseNumbers(input), [input]);
  const stats = useMemo(() => (nums.length > 0 ? computeStats(nums) : null), [nums]);

  const allStatsText = stats
    ? [
        `Count: ${stats.count}`,
        `Sum: ${fmt(stats.sum)}`,
        `Mean: ${fmt(stats.mean)}`,
        `Median: ${fmt(stats.median)}`,
        `Mode(s): ${stats.modes.length > 0 ? stats.modes.map(fmt).join(', ') : 'No mode'}`,
        `Min: ${fmt(stats.min)}`,
        `Max: ${fmt(stats.max)}`,
        `Range: ${fmt(stats.range)}`,
        `Variance: ${fmt(stats.variance)}`,
        `Std Deviation: ${fmt(stats.stdDev)}`,
        `Q1: ${fmt(stats.q1)}`,
        `Q2 (Median): ${fmt(stats.q2)}`,
        `Q3: ${fmt(stats.q3)}`,
        `IQR: ${fmt(stats.iqr)}`,
      ].join('\n')
    : '';

  const statCards = stats
    ? [
        { label: 'Count', value: fmt(stats.count) },
        { label: 'Sum', value: fmt(stats.sum) },
        { label: 'Mean', value: fmt(stats.mean) },
        { label: 'Median', value: fmt(stats.median) },
        { label: 'Mode(s)', value: stats.modes.length > 0 ? stats.modes.map(fmt).join(', ') : 'No mode' },
        { label: 'Min', value: fmt(stats.min) },
        { label: 'Max', value: fmt(stats.max) },
        { label: 'Range', value: fmt(stats.range) },
        { label: 'Variance', value: fmt(stats.variance) },
        { label: 'Std Deviation', value: fmt(stats.stdDev) },
        { label: 'Q1 (25th)', value: fmt(stats.q1) },
        { label: 'Q2 (50th)', value: fmt(stats.q2) },
        { label: 'Q3 (75th)', value: fmt(stats.q3) },
        { label: 'IQR', value: fmt(stats.iqr) },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className={LABEL_CLASS}>Enter Numbers</label>
        <textarea
          rows={4}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter numbers separated by commas, spaces, or new lines&#10;e.g. 4, 7, 13, 2, 7, 9, 1"
          className={INPUT_CLASS + ' resize-none'}
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {nums.length > 0 ? `${nums.length} number(s) parsed` : 'Separate values with commas, spaces, or new lines'}
        </p>
      </div>

      {/* Stats grid */}
      {stats && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Results</h2>
            <CopyButton text={allStatsText} label="Copy All Stats" size="sm" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {statCards.map(({ label, value }) => (
              <div key={label} className={CARD_CLASS}>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</div>
                <div className="text-base font-bold font-heading text-slate-900 dark:text-slate-100 break-all">{value}</div>
              </div>
            ))}
          </div>

          {/* Sorted list */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Sorted Numbers ({stats.count})
            </h3>
            <div className={CARD_CLASS + ' overflow-x-auto'}>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-mono break-all">
                {stats.sorted.map(fmt).join(', ')}
              </p>
            </div>
          </div>

          {/* Frequency table — only show when dataset has ≤50 unique values AND some value repeats */}
          {stats.frequency.length <= 50 && stats.frequency.some(([, c]) => c > 1) && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Frequency Table
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">Value</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">Count</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">Frequency %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {stats.frequency.map(([val, count]) => (
                      <tr key={val} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-2 font-mono text-slate-700 dark:text-slate-300">{fmt(val)}</td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{count}</td>
                        <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                          {((count / stats.count) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {nums.length === 0 && input.trim() !== '' && (
        <div className="text-sm text-red-600 dark:text-red-400">
          No valid numbers found. Please check your input.
        </div>
      )}

      {input.trim() === '' && (
        <div className={CARD_CLASS + ' text-center py-10'}>
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            Enter a dataset above to see statistics
          </p>
        </div>
      )}
    </div>
  );
}
