'use client';
import { useState, useMemo } from 'react';
import { Clock, Mic, RotateCcw } from 'lucide-react';
import { CopyButton } from '@/components/common/CopyButton';

function countStats(text: string) {
  if (!text.trim()) return { words: 0, chars: text.length, charsNoSpaces: text.replace(/\s/g, '').length, sentences: 0, paragraphs: 0, lines: 0 };
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = (text.match(/[.!?]+/g) || []).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);
  const lines = text.split('\n').length;
  return { words, chars, charsNoSpaces, sentences, paragraphs, lines };
}

export function WordCounterTool() {
  const [text, setText] = useState('');
  const stats = useMemo(() => countStats(text), [text]);
  const readingTime = Math.max(1, Math.round(stats.words / 200));
  const speakingTime = Math.max(1, Math.round(stats.words / 130));

  const statCards = [
    { label: 'Words', value: stats.words, color: 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' },
    { label: 'Characters', value: stats.chars, color: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30' },
    { label: 'No Spaces', value: stats.charsNoSpaces, color: 'text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30' },
    { label: 'Sentences', value: stats.sentences, color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30' },
    { label: 'Paragraphs', value: stats.paragraphs, color: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30' },
    { label: 'Lines', value: stats.lines, color: 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30' },
  ];

  return (
    <div className="space-y-4">
      {/* Stats grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {statCards.map(s => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
            <div className="text-2xl font-heading font-bold">{s.value.toLocaleString()}</div>
            <div className="text-xs font-medium mt-0.5 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Time estimates */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm text-slate-600 dark:text-slate-400">
          <Clock className="w-4 h-4" />
          <span>Reading: <strong className="text-slate-900 dark:text-slate-100">{readingTime} min</strong></span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm text-slate-600 dark:text-slate-400">
          <Mic className="w-4 h-4" />
          <span>Speaking: <strong className="text-slate-900 dark:text-slate-100">{speakingTime} min</strong></span>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="tool-textarea min-h-[280px]"
          aria-label="Text input for word counting"
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
