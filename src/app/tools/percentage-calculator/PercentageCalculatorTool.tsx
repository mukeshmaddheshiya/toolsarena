'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';

type Tab = 'pctof' | 'iswhat' | 'change' | 'add' | 'subtract';

const TABS: { id: Tab; label: string }[] = [
  { id: 'pctof', label: 'X% of Y' },
  { id: 'iswhat', label: 'X is what % of Y' },
  { id: 'change', label: '% Change' },
  { id: 'add', label: 'Add %' },
  { id: 'subtract', label: 'Subtract %' },
];

function fmt(n: number): string {
  return isFinite(n) ? (Number.isInteger(n) ? n.toLocaleString() : parseFloat(n.toFixed(4)).toLocaleString()) : 'Invalid';
}

export function PercentageCalculatorTool() {
  const [tab, setTab] = useState<Tab>('pctof');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const na = parseFloat(a);
  const nb = parseFloat(b);

  const results: Record<Tab, { result: string; explanation: string }> = {
    pctof: { result: fmt((na / 100) * nb), explanation: `${na}% of ${nb} = ${fmt((na / 100) * nb)}` },
    iswhat: { result: fmt((na / nb) * 100) + '%', explanation: `${na} is ${fmt((na / nb) * 100)}% of ${nb}` },
    change: {
      result: fmt(((nb - na) / na) * 100) + '%',
      explanation: `Change from ${na} to ${nb} = ${fmt(((nb - na) / na) * 100)}% ${(nb - na) >= 0 ? 'increase' : 'decrease'}`
    },
    add: { result: fmt(na * (1 + nb / 100)), explanation: `${na} + ${nb}% = ${fmt(na * (1 + nb / 100))}` },
    subtract: { result: fmt(na * (1 - nb / 100)), explanation: `${na} \u2212 ${nb}% = ${fmt(na * (1 - nb / 100))}` },
  };

  const labels: Record<Tab, [string, string]> = {
    pctof: ['Percentage (%)', 'Of Number'],
    iswhat: ['Number (X)', 'Of Number (Y)'],
    change: ['Original Value', 'New Value'],
    add: ['Original Number', 'Add Percentage (%)'],
    subtract: ['Original Number', 'Subtract Percentage (%)'],
  };

  const current = results[tab];
  const isValid = !isNaN(na) && !isNaN(nb) && nb !== 0;

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 min-w-[100px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-white dark:bg-slate-800 text-primary-800 dark:text-primary-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4">
        {labels[tab].map((label, i) => (
          <div key={label}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
            <input
              type="number"
              value={i === 0 ? a : b}
              onChange={e => i === 0 ? setA(e.target.value) : setB(e.target.value)}
              placeholder="Enter number"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
            />
          </div>
        ))}
      </div>

      {/* Result */}
      {isValid && (
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-heading font-bold text-primary-800 dark:text-primary-300">{current.result}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{current.explanation}</div>
            </div>
            <CopyButton text={current.result} />
          </div>
        </div>
      )}

      {!isValid && a && b && (
        <p className="text-sm text-amber-600 dark:text-amber-400">Please enter valid numbers. Division by zero is not allowed.</p>
      )}
    </div>
  );
}
