'use client';
import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { CheckCircle, XCircle, RotateCcw, Minimize2, Maximize2 } from 'lucide-react';

type Mode = 'formatted' | 'minified' | 'validate';

export function JSONFormatterTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('formatted');

  const result = useMemo(() => {
    if (!input.trim()) return { valid: null, output: '', error: null, parsed: null };
    try {
      const parsed = JSON.parse(input);
      const formatted =
        mode === 'minified'
          ? JSON.stringify(parsed)
          : JSON.stringify(parsed, null, 2);
      return { valid: true, output: formatted, error: null, parsed };
    } catch (e) {
      return { valid: false, output: '', error: (e as Error).message, parsed: null };
    }
  }, [input, mode]);

  const lineCount = result.output.split('\n').length;

  return (
    <div className="space-y-4">
      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
        {(
          [
            ['formatted', 'Formatted', Maximize2],
            ['minified', 'Minified', Minimize2],
            ['validate', 'Validate', CheckCircle],
          ] as const
        ).map(([m, label, Icon]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-white dark:bg-slate-800 text-primary-800 dark:text-primary-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Input/Output layout */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Input JSON
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
            placeholder={'{\n  "key": "value",\n  "number": 42,\n  "array": [1, 2, 3]\n}'}
            className="tool-textarea min-h-[320px] text-xs"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {mode === 'validate' ? 'Validation Result' : 'Output'}
              </label>
              {result.valid !== null &&
                (result.valid ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Valid JSON
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                    <XCircle className="w-3.5 h-3.5" />
                    Invalid JSON
                  </span>
                ))}
            </div>
            {result.output && <CopyButton text={result.output} size="sm" />}
          </div>

          {result.error ? (
            <div className="min-h-[320px] rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                JSON Parse Error
              </p>
              <p className="text-xs text-red-600 dark:text-red-300 font-mono">{result.error}</p>
            </div>
          ) : mode === 'validate' && result.valid ? (
            <div className="min-h-[320px] rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4 flex flex-col items-center justify-center gap-3">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="text-green-700 dark:text-green-400 font-semibold">Valid JSON</p>
              <p className="text-xs text-green-600 dark:text-green-500">
                {typeof result.parsed === 'object' && result.parsed !== null
                  ? Array.isArray(result.parsed)
                    ? `Array with ${(result.parsed as unknown[]).length} items`
                    : `Object with ${Object.keys(result.parsed as object).length} keys`
                  : `Type: ${typeof result.parsed}`}
              </p>
            </div>
          ) : (
            <textarea
              value={result.output}
              readOnly
              className="tool-textarea min-h-[320px] text-xs bg-slate-50 dark:bg-slate-900"
              spellCheck={false}
            />
          )}
        </div>
      </div>

      {result.output && mode !== 'validate' && (
        <p className="text-xs text-slate-400">
          {lineCount.toLocaleString()} lines · {result.output.length.toLocaleString()} characters
        </p>
      )}
    </div>
  );
}
