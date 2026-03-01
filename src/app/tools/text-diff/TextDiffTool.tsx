'use client';

import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

type DiffType = 'equal' | 'insert' | 'delete';
interface DiffPart { type: DiffType; value: string; }

// Simple LCS-based word/line diff
function diffLines(a: string, b: string): DiffPart[] {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const m = aLines.length, n = bLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = aLines[i-1] === bLines[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
  const result: DiffPart[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i-1] === bLines[j-1]) {
      result.unshift({ type: 'equal', value: aLines[i-1] }); i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      result.unshift({ type: 'insert', value: bLines[j-1] }); j--;
    } else {
      result.unshift({ type: 'delete', value: aLines[i-1] }); i--;
    }
  }
  return result;
}

export function TextDiffTool() {
  const [left, setLeft] = useState('The quick brown fox\njumps over the lazy dog\nHello World\nLine four here');
  const [right, setRight] = useState('The quick brown fox\nleaps over the lazy cat\nHello World!\nLine four here\nNew line added');
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'split' | 'unified'>('split');

  const diff = useMemo(() => diffLines(left, right), [left, right]);

  const stats = useMemo(() => ({
    added: diff.filter(d => d.type === 'insert').length,
    removed: diff.filter(d => d.type === 'delete').length,
    unchanged: diff.filter(d => d.type === 'equal').length,
  }), [diff]);

  const copyDiff = async () => {
    const text = diff.map(d => {
      const prefix = d.type === 'insert' ? '+ ' : d.type === 'delete' ? '- ' : '  ';
      return prefix + d.value;
    }).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-3 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
          {(['split', 'unified'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${view === v ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              {v}
            </button>
          ))}
        </div>
        <div className="flex gap-3 text-xs">
          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg font-medium">+{stats.added} added</span>
          <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-lg font-medium">−{stats.removed} removed</span>
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg font-medium">{stats.unchanged} unchanged</span>
        </div>
        <div className="flex-1" />
        <button onClick={copyDiff} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          {copied ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Diff</>}
        </button>
      </div>

      {view === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[{ label: 'Original', val: left, set: setLeft, side: 'left' as const }, { label: 'Modified', val: right, set: setRight, side: 'right' as const }].map(({ label, val, set, side }) => (
            <div key={side} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
                <button onClick={() => set('')} className="text-xs text-gray-400 hover:text-red-500">Clear</button>
              </div>
              <textarea value={val} onChange={e => set(e.target.value)} spellCheck={false}
                className="w-full h-48 p-4 font-mono text-sm bg-transparent text-gray-800 dark:text-gray-200 resize-none focus:outline-none" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {[{ label: 'Original', val: left, set: setLeft }, { label: 'Modified', val: right, set: setRight }].map(({ label, val, set }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
              </div>
              <textarea value={val} onChange={e => set(e.target.value)} spellCheck={false}
                className="w-full h-36 p-4 font-mono text-sm bg-transparent text-gray-800 dark:text-gray-200 resize-none focus:outline-none" />
            </div>
          ))}
        </div>
      )}

      {/* Diff output */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Diff Result</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-sm">
            <tbody>
              {diff.map((part, i) => (
                <tr key={i} className={part.type === 'insert' ? 'bg-green-50 dark:bg-green-900/20' : part.type === 'delete' ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                  <td className={`w-6 text-center text-xs select-none py-0.5 px-2 border-r ${part.type === 'insert' ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' : part.type === 'delete' ? 'text-red-500 dark:text-red-400 border-red-200 dark:border-red-800' : 'text-gray-300 dark:text-gray-600 border-gray-100 dark:border-gray-700'}`}>
                    {part.type === 'insert' ? '+' : part.type === 'delete' ? '−' : ' '}
                  </td>
                  <td className={`py-0.5 px-3 whitespace-pre-wrap break-all ${part.type === 'insert' ? 'text-green-800 dark:text-green-300' : part.type === 'delete' ? 'text-red-700 dark:text-red-300 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                    {part.value || ' '}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
