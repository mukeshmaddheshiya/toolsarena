'use client';
import { useState, useMemo, useCallback } from 'react';
import { Copy, Check, Repeat, Type, Hash } from 'lucide-react';

export function TextRepeaterTool() {
  const [text, setText] = useState('');
  const [count, setCount] = useState('10');
  const [separator, setSeparator] = useState('newline');
  const [customSep, setCustomSep] = useState('');
  const [addNumber, setAddNumber] = useState(false);
  const [copied, setCopied] = useState(false);

  const separatorMap: Record<string, string> = {
    newline: '\n',
    space: ' ',
    comma: ', ',
    dash: ' - ',
    tab: '\t',
    none: '',
    custom: customSep,
  };

  const result = useMemo(() => {
    if (!text) return '';
    const n = Math.min(10000, Math.max(1, parseInt(count) || 1));
    const sep = separatorMap[separator] ?? '\n';
    const lines: string[] = [];
    for (let i = 0; i < n; i++) {
      lines.push(addNumber ? `${i + 1}. ${text}` : text);
    }
    return lines.join(sep);
  }, [text, count, separator, customSep, addNumber]);

  const stats = useMemo(() => {
    if (!result) return { chars: 0, words: 0, lines: 0 };
    return {
      chars: result.length,
      words: result.split(/\s+/).filter(Boolean).length,
      lines: result.split('\n').length,
    };
  }, [result]);

  const copy = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Text Repeater</h2>
            <p className="text-violet-200 text-xs">Repeat any text up to 10,000 times instantly</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Text to Repeat</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Enter your text here..."
              rows={3}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Repeat Count</label>
              <input
                type="number"
                min={1}
                max={10000}
                value={count}
                onChange={e => setCount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Separator</label>
              <select
                value={separator}
                onChange={e => setSeparator(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="newline">New Line</option>
                <option value="space">Space</option>
                <option value="comma">Comma</option>
                <option value="dash">Dash</option>
                <option value="tab">Tab</option>
                <option value="none">None</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {separator === 'custom' && (
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Custom Separator</label>
              <input
                type="text"
                value={customSep}
                onChange={e => setCustomSep(e.target.value)}
                placeholder="e.g. | or ;"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={addNumber} onChange={e => setAddNumber(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400">Add line numbers (1. 2. 3. ...)</span>
          </label>

          {/* Quick count presets */}
          <div>
            <div className="text-xs text-slate-500 mb-2">Quick Count</div>
            <div className="flex flex-wrap gap-1.5">
              {['5', '10', '25', '50', '100', '500', '1000', '5000'].map(v => (
                <button key={v} onClick={() => setCount(v)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${count === v ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-violet-100'}`}>
                  {v}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Type className="w-3 h-3" />{stats.chars.toLocaleString()} chars</span>
              <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{stats.words.toLocaleString()} words</span>
            </div>
            <button
              onClick={copy}
              disabled={!result}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${copied
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40'
                }`}
            >
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
          <textarea
            readOnly
            value={result}
            rows={14}
            placeholder="Repeated text will appear here..."
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 font-mono resize-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
