'use client';
import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { Link, RotateCcw } from 'lucide-react';

const STOP_WORDS = new Set(['a','an','the','and','but','or','nor','for','yet','so','at','by','in','of','on','to','up','is','it','as','be','do','go','he','me','my','no','so','to','we','am','are','was','were','has','had','not','this','that','with','from','into','have','been','will','can','its','our','out','who','they','you','i','the']);

function toSlug(text: string, options: { separator: string; removeStop: boolean }): string {
  let s = text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .trim();
  const words = s.split(/\s+/).filter(Boolean);
  const filtered = options.removeStop ? words.filter(w => !STOP_WORDS.has(w)) : words;
  return filtered.join(options.separator).replace(new RegExp(`${options.separator}+`, 'g'), options.separator).replace(new RegExp(`^${options.separator}|${options.separator}$`, 'g'), '');
}

export function TextToSlugTool() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [removeStop, setRemoveStop] = useState(false);

  const slug = useMemo(() => toSlug(input, { separator, removeStop }), [input, separator, removeStop]);

  return (
    <div className="space-y-4">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Text</label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. How to Build a SEO-Optimized Website in 2025"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
        />
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Separator</label>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            {['-', '_', '.'].map(sep => (
              <button key={sep} onClick={() => setSeparator(sep)} className={`px-4 py-1.5 text-sm font-mono transition-colors ${separator === sep ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                {sep === '-' ? 'hyphen (-)' : sep === '_' ? 'underscore (_)' : 'dot (.)'}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer mt-4">
          <input type="checkbox" checked={removeStop} onChange={e => setRemoveStop(e.target.checked)} className="w-4 h-4 rounded text-primary-800" />
          <span className="text-sm text-slate-700 dark:text-slate-300">Remove stop words</span>
        </label>
      </div>

      {/* Output */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link className="w-3.5 h-3.5" />
            <span>Generated Slug</span>
          </div>
          {slug && <CopyButton text={slug} size="sm" />}
        </div>
        <div className="font-mono text-base text-primary-700 dark:text-primary-400 break-all">
          {slug || <span className="text-slate-400 dark:text-slate-600 text-sm">Your slug will appear here...</span>}
        </div>
        {slug && (
          <div className="mt-2 text-xs text-slate-400">
            Full URL preview: <span className="text-slate-600 dark:text-slate-400">https://example.com/blog/<span className="text-primary-600 dark:text-primary-400">{slug}</span></span>
          </div>
        )}
      </div>

      {input && (
        <button onClick={() => setInput('')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
      )}
    </div>
  );
}
