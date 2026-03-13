'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';

// ─── Conversion tables ────────────────────────────────────────────────────────

const INT_TO_ROMAN: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

const ROMAN_VALUES: Record<string, number> = {
  M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1,
};

const REFERENCE: [string, number][] = [
  ['I', 1], ['V', 5], ['X', 10], ['L', 50], ['C', 100], ['D', 500], ['M', 1000],
];

// ─── Logic ────────────────────────────────────────────────────────────────────

function intToRoman(n: number): { roman: string; steps: { numeral: string; value: number }[] } {
  let remaining = n;
  const steps: { numeral: string; value: number }[] = [];
  for (const [val, numeral] of INT_TO_ROMAN) {
    while (remaining >= val) {
      steps.push({ numeral, value: val });
      remaining -= val;
    }
  }
  return { roman: steps.map(s => s.numeral).join(''), steps };
}

function romanToInt(s: string): number | null {
  const upper = s.toUpperCase().trim();
  if (!/^[MDCLXVI]+$/.test(upper)) return null;
  let total = 0;
  for (let i = 0; i < upper.length; i++) {
    const curr = ROMAN_VALUES[upper[i]];
    const next = ROMAN_VALUES[upper[i + 1]];
    if (curr === undefined) return null;
    if (next && curr < next) {
      total -= curr;
    } else {
      total += curr;
    }
  }
  // Validate by converting back
  const { roman } = intToRoman(total);
  if (roman !== upper) return null;
  return total;
}

// ─── Component ────────────────────────────────────────────────────────────────

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

export function RomanNumeralConverterTool() {
  const [mode, setMode] = useState<'int' | 'roman'>('int');
  const [intInput, setIntInput] = useState('');
  const [romanInput, setRomanInput] = useState('');

  // Integer → Roman
  let intResult: ReturnType<typeof intToRoman> | null = null;
  let intError = '';
  if (mode === 'int' && intInput) {
    const n = parseInt(intInput, 10);
    if (isNaN(n) || !Number.isInteger(n)) intError = 'Please enter a whole number.';
    else if (n <= 0) intError = 'Number must be greater than 0.';
    else if (n > 3999) intError = 'Number must be ≤ 3999.';
    else intResult = intToRoman(n);
  }

  // Roman → Integer
  let romanResult: number | null = null;
  let romanError = '';
  if (mode === 'roman' && romanInput) {
    romanResult = romanToInt(romanInput);
    if (romanResult === null) romanError = 'Invalid Roman numeral.';
  }

  const resultText =
    mode === 'int'
      ? intResult?.roman ?? ''
      : romanResult !== null
      ? String(romanResult)
      : '';

  return (
    <div className="space-y-5">
      {/* Mode tabs */}
      <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 gap-1 bg-slate-50 dark:bg-slate-900">
        {(
          [
            { key: 'int', label: 'Integer → Roman' },
            { key: 'roman', label: 'Roman → Integer' },
          ] as const
        ).map(tab => (
          <button
            key={tab.key}
            onClick={() => setMode(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === tab.key
                ? 'bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input */}
      {mode === 'int' ? (
        <div>
          <label className={labelClass}>Enter a number (1–3999)</label>
          <input
            type="number"
            min={1}
            max={3999}
            value={intInput}
            onChange={e => setIntInput(e.target.value)}
            placeholder="e.g. 1994"
            className={inputClass}
          />
          {intError && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{intError}</p>}
        </div>
      ) : (
        <div>
          <label className={labelClass}>Enter a Roman numeral</label>
          <input
            type="text"
            value={romanInput}
            onChange={e => setRomanInput(e.target.value.toUpperCase())}
            placeholder="e.g. MCMXCIV"
            className={`${inputClass} uppercase`}
          />
          {romanError && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">{romanError}</p>
          )}
        </div>
      )}

      {/* Result */}
      {resultText && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Result
            </span>
            <CopyButton text={resultText} size="sm" />
          </div>
          <p className="text-4xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {resultText}
          </p>
        </div>
      )}

      {/* Step-by-step breakdown (int → roman) */}
      {mode === 'int' && intResult && intResult.steps.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Step-by-step Breakdown
          </p>
          <div className="flex flex-wrap gap-1.5 items-center text-sm">
            {intResult.steps.map((step, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <span className="font-mono font-bold text-primary-700 dark:text-primary-400">
                  {step.numeral}
                </span>
                <span className="text-slate-500 dark:text-slate-400">({step.value})</span>
                {i < intResult!.steps.length - 1 && (
                  <span className="text-slate-400 dark:text-slate-500 ml-0.5">+</span>
                )}
              </span>
            ))}
            <span className="text-slate-500 dark:text-slate-400 ml-1">
              = {intResult.roman} ({parseInt(intInput)})
            </span>
          </div>
        </div>
      )}

      {/* Quick reference table */}
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Quick Reference
        </p>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {REFERENCE.map(([numeral, value]) => (
            <div
              key={numeral}
              className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-center"
            >
              <p className="text-lg font-bold text-primary-700 dark:text-primary-400 font-mono">
                {numeral}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
