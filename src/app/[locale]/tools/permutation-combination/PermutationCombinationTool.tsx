'use client';
import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';

const INPUT_CLASS = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const LABEL_CLASS = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
const CARD_CLASS = 'bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4';

// BigInt factorial for n <= 170
function factorialBig(n: number): bigint {
  if (n < 0) return BigInt(0);
  if (n === 0 || n === 1) return BigInt(1);
  let result = BigInt(1);
  for (let i = 2; i <= n; i++) result *= BigInt(i);
  return result;
}

// Approximate factorial using Stirling's for n > 170
function factorialApprox(n: number): string {
  if (n <= 170) {
    const val = factorialBig(n);
    return val.toString();
  }
  // Use Stirling's approximation log(n!) ≈ n*ln(n) - n + 0.5*ln(2πn)
  const lnFact = n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n);
  const exp10 = lnFact / Math.log(10);
  const exponent = Math.floor(exp10);
  const coeff = Math.pow(10, exp10 - exponent);
  return `≈ ${coeff.toFixed(4)} × 10^${exponent}`;
}

function formatBig(val: bigint): string {
  const s = val.toString();
  if (s.length > 25) {
    const exp = s.length - 1;
    const coeff = s[0] + '.' + s.slice(1, 5);
    return `${coeff} × 10^${exp} (${s.length} digits)`;
  }
  return s;
}

interface PCResult {
  nPr: string;
  nCr: string;
  nFact: string;
  nPrSteps: string[];
  nCrSteps: string[];
  isExact: boolean;
  error?: string;
}

function computePC(n: number, r: number): PCResult {
  if (!Number.isInteger(n) || !Number.isInteger(r)) return { nPr: '', nCr: '', nFact: '', nPrSteps: [], nCrSteps: [], isExact: false, error: 'n and r must be integers' };
  if (n < 0 || r < 0) return { nPr: '', nCr: '', nFact: '', nPrSteps: [], nCrSteps: [], isExact: false, error: 'n and r must be non-negative' };
  if (r > n) return { nPr: '', nCr: '', nFact: '', nPrSteps: [], nCrSteps: [], isExact: false, error: 'r cannot be greater than n' };

  const isExact = n <= 170;
  let nPr: string;
  let nCr: string;
  let nPrSteps: string[] = [];
  let nCrSteps: string[] = [];

  if (isExact) {
    const nF = factorialBig(n);
    const nrF = factorialBig(n - r);
    const rF = factorialBig(r);
    const permVal = nF / nrF;
    const combVal = permVal / rF;

    nPr = formatBig(permVal);
    nCr = formatBig(combVal);

    // Build step-by-step for nPr
    if (r === 0) {
      nPrSteps = [`${n}P0 = 1 (choosing 0 items always gives 1 arrangement)`];
    } else if (r === n) {
      nPrSteps = [
        `${n}P${r} = ${n}! / (${n}-${r})!`,
        `= ${n}! / 0!`,
        `= ${n}! / 1`,
        `= ${formatBig(nF)}`,
      ];
    } else {
      // Show multiplication chain (truncate for readability when r > 6)
      const chainArr = Array.from({ length: r }, (_, i) => n - i);
      const chain = r > 6
        ? `${chainArr.slice(0, 3).join(' × ')} × … × ${chainArr[r - 1]}`
        : chainArr.join(' × ');
      nPrSteps = [
        `${n}P${r} = ${n}! / (${n}-${r})!`,
        `= ${n}! / ${n - r}!`,
        `= ${chain}`,
        `= ${nPr}`,
      ];
    }

    // Build step-by-step for nCr
    if (r === 0 || r === n) {
      nCrSteps = [`${n}C${r} = 1 (only one way to choose ${r === 0 ? '0' : 'all'} items)`];
    } else {
      const chainPArr = Array.from({ length: r }, (_, i) => n - i);
      const chainP = r > 6
        ? `${chainPArr.slice(0, 3).join(' × ')} × … × ${chainPArr[r - 1]}`
        : chainPArr.join(' × ');
      nCrSteps = [
        `${n}C${r} = ${n}! / (${r}! × ${n - r}!)`,
        `= (${chainP}) / ${r}!`,
        `= ${formatBig(permVal)} / ${formatBig(rF)}`,
        `= ${nCr}`,
      ];
    }
  } else {
    // Approximation for large n
    const logPerm = Array.from({ length: r }, (_, i) => Math.log10(n - i)).reduce((a, b) => a + b, 0);
    const permExp = Math.floor(logPerm);
    const permCoeff = Math.pow(10, logPerm - permExp);
    nPr = `≈ ${permCoeff.toFixed(4)} × 10^${permExp}`;

    const logComb = logPerm - Array.from({ length: r }, (_, i) => Math.log10(i + 1)).reduce((a, b) => a + b, 0);
    const combExp = Math.floor(logComb);
    const combCoeff = Math.pow(10, logComb - combExp);
    nCr = `≈ ${combCoeff.toFixed(4)} × 10^${combExp}`;

    nPrSteps = [`${n}P${r} = ${n}! / ${n - r}!  (approximation for large n)`];
    nCrSteps = [`${n}C${r} = ${n}! / (${r}! × ${n - r}!)  (approximation for large n)`];
  }

  const nFact = n <= 170 ? formatBig(factorialBig(n)) : factorialApprox(n);

  return { nPr, nCr, nFact, nPrSteps, nCrSteps, isExact };
}

export function PermutationCombinationTool() {
  const [n, setN] = useState('');
  const [r, setR] = useState('');
  const [factN, setFactN] = useState('');

  const nVal = parseInt(n);
  const rVal = parseInt(r);
  const factNVal = parseInt(factN);

  const result = useMemo<PCResult | null>(() => {
    if (!n.trim() || !r.trim()) return null;
    if (isNaN(nVal) || isNaN(rVal)) return { nPr: '', nCr: '', nFact: '', nPrSteps: [], nCrSteps: [], isExact: false, error: 'Enter valid integers' };
    return computePC(nVal, rVal);
  }, [n, r, nVal, rVal]);

  const factResult = useMemo(() => {
    if (!factN.trim() || isNaN(factNVal) || factNVal < 0) return null;
    if (!Number.isInteger(factNVal) || factNVal > 10000) return 'Enter an integer between 0 and 10000';
    return factNVal <= 170 ? formatBig(factorialBig(factNVal)) : factorialApprox(factNVal);
  }, [factN, factNVal]);

  return (
    <div className="space-y-6">
      {/* Main Calculator */}
      <div className={CARD_CLASS + ' border-primary-200 dark:border-primary-800'}>
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">Permutation & Combination Calculator</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>n (Total items)</label>
            <input
              type="number"
              value={n}
              onChange={e => setN(e.target.value)}
              placeholder="e.g. 10"
              min="0"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>r (Items to choose)</label>
            <input
              type="number"
              value={r}
              onChange={e => setR(e.target.value)}
              placeholder="e.g. 3"
              min="0"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        {result?.error && (
          <div className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2">
            {result.error}
          </div>
        )}
      </div>

      {result && !result.error && (
        <>
          {/* Results */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: `${nVal}P${rVal}`, subtitle: 'Permutations (order matters)', value: result.nPr, color: 'text-blue-600 dark:text-blue-400' },
              { label: `${nVal}C${rVal}`, subtitle: 'Combinations (order irrelevant)', value: result.nCr, color: 'text-green-600 dark:text-green-400' },
              { label: `${nVal}!`, subtitle: 'Factorial of n', value: result.nFact, color: 'text-purple-600 dark:text-purple-400' },
            ].map(({ label, subtitle, value, color }) => (
              <div key={label} className={CARD_CLASS + ' text-center'}>
                <div className={`text-2xl font-heading font-bold ${color} mb-1`}>{label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{subtitle}</div>
                <div className="text-base font-mono font-semibold text-slate-800 dark:text-slate-200 break-all">{value}</div>
                <div className="mt-2 flex justify-center">
                  <CopyButton text={value} size="sm" />
                </div>
              </div>
            ))}
          </div>

          {!result.isExact && (
            <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-2">
              n &gt; 170: showing approximations (≈) using logarithms. For exact values use n ≤ 170.
            </div>
          )}

          {/* Step-by-step */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: `Step-by-step: ${nVal}P${rVal}`, steps: result.nPrSteps },
              { title: `Step-by-step: ${nVal}C${rVal}`, steps: result.nCrSteps },
            ].map(({ title, steps }) => (
              <div key={title} className={CARD_CLASS}>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{title}</h3>
                <ol className="space-y-1">
                  {steps.map((step, i) => (
                    <li key={i} className="text-sm font-mono text-slate-600 dark:text-slate-400">{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Concept explanation */}
      <div className={CARD_CLASS}>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Permutations vs Combinations</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Permutation (nPr)</div>
            <div className="text-slate-600 dark:text-slate-400 text-xs mb-2">Order MATTERS. Different arrangements are counted separately.</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Example: From {'{A, B, C}'}, choosing 2 → AB, BA, AC, CA, BC, CB = <strong>6 permutations</strong></div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="font-semibold text-green-700 dark:text-green-300 mb-1">Combination (nCr)</div>
            <div className="text-slate-600 dark:text-slate-400 text-xs mb-2">Order DOESN'T matter. AB and BA are the same selection.</div>
            <div className="text-xs text-green-600 dark:text-green-400">Example: From {'{A, B, C}'}, choosing 2 → AB, AC, BC = <strong>3 combinations</strong></div>
          </div>
        </div>
      </div>

      {/* Separate factorial calculator */}
      <div className={CARD_CLASS}>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Factorial Calculator (n!)</h3>
        <div className="flex gap-3">
          <input
            type="number"
            value={factN}
            onChange={e => setFactN(e.target.value)}
            placeholder="Enter n (0–10000)"
            min="0"
            max="10000"
            className={INPUT_CLASS}
          />
        </div>
        {factResult && (
          <div className="mt-3 flex items-start gap-3">
            <div className="flex-1">
              <span className="text-sm text-slate-500 dark:text-slate-400">{factNVal}! = </span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 break-all text-sm">{factResult}</span>
            </div>
            <CopyButton text={`${factNVal}! = ${factResult}`} size="sm" />
          </div>
        )}
      </div>
    </div>
  );
}
