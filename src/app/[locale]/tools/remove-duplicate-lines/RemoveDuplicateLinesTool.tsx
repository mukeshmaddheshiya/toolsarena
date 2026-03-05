'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { ListFilter, RotateCcw } from 'lucide-react';

export function RemoveDuplicateLinesTool() {
  const [input, setInput] = useState('');
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [sortLines, setSortLines] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [removeBlanks, setRemoveBlanks] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ original: 0, unique: 0, removed: 0 });

  function process() {
    let lines = input.split('\n');
    if (trimWhitespace) lines = lines.map(l => l.trim());
    if (removeBlanks) lines = lines.filter(l => l.length > 0);
    const seen = new Set<string>();
    const unique = lines.filter(line => {
      const key = caseInsensitive ? line.toLowerCase() : line;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const sorted = sortLines ? [...unique].sort((a, b) => a.localeCompare(b)) : unique;
    setOutput(sorted.join('\n'));
    setStats({ original: lines.length, unique: sorted.length, removed: lines.length - sorted.length });
    setProcessed(true);
  }

  return (
    <div className="space-y-4">
      {/* Options */}
      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        {[
          { label: 'Case insensitive', value: caseInsensitive, set: setCaseInsensitive },
          { label: 'Sort lines A-Z', value: sortLines, set: setSortLines },
          { label: 'Trim whitespace', value: trimWhitespace, set: setTrimWhitespace },
          { label: 'Remove blank lines', value: removeBlanks, set: setRemoveBlanks },
        ].map(({ label, value, set }) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={value} onChange={e => set(e.target.checked)} className="w-4 h-4 rounded text-primary-800" />
            <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
          </label>
        ))}
      </div>

      {/* I/O */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Input ({input.split('\n').length} lines)</label>
          <textarea value={input} onChange={e => { setInput(e.target.value); setProcessed(false); }} placeholder="Paste your text with duplicate lines here..." className="tool-textarea min-h-[240px]" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Output ({processed ? stats.unique : 0} unique lines)</label>
            {output && <CopyButton text={output} size="sm" />}
          </div>
          <textarea value={output} readOnly placeholder="Deduplicated output will appear here..." className="tool-textarea min-h-[240px] bg-slate-50 dark:bg-slate-900" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={process} disabled={!input.trim()} className="flex items-center gap-2 px-5 py-2 bg-primary-800 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors text-sm">
          <ListFilter className="w-4 h-4" /> Remove Duplicates
        </button>
        {processed && (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Removed <strong className="text-red-600 dark:text-red-400">{stats.removed}</strong> duplicate{stats.removed !== 1 ? 's' : ''}
          </div>
        )}
        {input && (
          <button onClick={() => { setInput(''); setOutput(''); setProcessed(false); }} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 ml-auto">
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
