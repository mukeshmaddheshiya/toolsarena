'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { RotateCcw } from 'lucide-react';

type Mode = 'encode' | 'decode';
type EncType = 'component' | 'full';

export function URLEncoderTool() {
  const [mode, setMode] = useState<Mode>('encode');
  const [encType, setEncType] = useState<EncType>('component');
  const [input, setInput] = useState('');

  function getOutput(): string {
    if (!input) return '';
    try {
      if (mode === 'encode') {
        return encType === 'component' ? encodeURIComponent(input) : encodeURI(input);
      } else {
        return encType === 'component' ? decodeURIComponent(input) : decodeURI(input);
      }
    } catch {
      return 'Error: Invalid input for decoding.';
    }
  }

  const output = getOutput();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* Mode toggle */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          {(['encode', 'decode'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setInput('');
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                mode === m
                  ? 'bg-white dark:bg-slate-800 text-primary-800 dark:text-primary-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Encoding type */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          {(
            [
              ['component', 'Component (strict)'],
              ['full', 'Full URL (preserves ://?&#)'],
            ] as const
          ).map(([t, l]) => (
            <button
              key={t}
              onClick={() => setEncType(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                encType === t
                  ? 'bg-white dark:bg-slate-800 text-primary-800 dark:text-primary-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Input
            </label>
            {input && (
              <button
                onClick={() => setInput('')}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Enter URL or text to encode...\ne.g. https://example.com/search?q=hello world&lang=en'
                : 'Paste encoded URL to decode...'
            }
            className="tool-textarea min-h-[200px] text-sm"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Output
            </label>
            {output && !output.startsWith('Error') && <CopyButton text={output} size="sm" />}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Output will appear here..."
            className={`tool-textarea min-h-[200px] text-sm bg-slate-50 dark:bg-slate-900 ${
              output.startsWith('Error') ? 'text-red-600 dark:text-red-400' : ''
            }`}
          />
        </div>
      </div>

      {/* Quick examples */}
      <div>
        <p className="text-xs text-slate-400 mb-2">Quick examples:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Space → %20', val: 'hello world' },
            { label: '& in query', val: 'name=John&age=30' },
            { label: 'Full URL', val: 'https://example.com/path?q=hello world' },
          ].map(({ label, val }) => (
            <button
              key={label}
              onClick={() => {
                setInput(val);
                setMode('encode');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
