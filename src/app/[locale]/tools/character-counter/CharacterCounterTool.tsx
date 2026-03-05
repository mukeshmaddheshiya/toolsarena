'use client';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { CopyButton } from '@/components/common/CopyButton';

const LIMITS = [
  { name: 'Twitter/X', limit: 280, color: 'bg-sky-500' },
  { name: 'SMS', limit: 160, color: 'bg-green-500' },
  { name: 'Meta Description', limit: 155, color: 'bg-amber-500' },
  { name: 'Instagram', limit: 2200, color: 'bg-pink-500' },
];

export function CharacterCounterTool() {
  const [text, setText] = useState('');
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split('\n').length;

  return (
    <div className="space-y-4">
      {/* Main stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Characters', value: chars, color: 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' },
          { label: 'Without Spaces', value: charsNoSpaces, color: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30' },
          { label: 'Words', value: words, color: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30' },
          { label: 'Lines', value: lines, color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <div className="text-3xl font-heading font-bold">{s.value.toLocaleString()}</div>
            <div className="text-xs font-medium mt-1 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Platform limits */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Platform Character Limits</p>
        <div className="space-y-3">
          {LIMITS.map(({ name, limit, color }) => {
            const pct = Math.min(100, (chars / limit) * 100);
            const over = chars > limit;
            return (
              <div key={name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{name}</span>
                  <span className={`text-xs font-bold ${over ? 'text-red-600 dark:text-red-400' : 'text-slate-500'}`}>
                    {chars}/{limit} {over && `(+${chars - limit})`}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-200 ${over ? 'bg-red-500' : color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste your text here to count characters..."
          className="tool-textarea min-h-[220px]"
        />
        {text && (
          <div className="absolute bottom-3 right-3 flex gap-2">
            <CopyButton text={text} size="sm" />
            <button onClick={() => setText('')} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
