'use client';
import { useState } from 'react';

type Mode = 'text-to-binary' | 'binary-to-text' | 'text-to-hex' | 'text-to-octal' | 'text-to-decimal';

const MODES: { value: Mode; label: string }[] = [
  { value: 'text-to-binary', label: 'Text → Binary' },
  { value: 'binary-to-text', label: 'Binary → Text' },
  { value: 'text-to-hex', label: 'Text → Hex' },
  { value: 'text-to-octal', label: 'Text → Octal' },
  { value: 'text-to-decimal', label: 'Text → ASCII' },
];

function textToBinary(text: string, separator: string) {
  return [...text].map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(separator);
}
function binaryToText(binary: string) {
  const clean = binary.replace(/[^01]/g, '');
  if (clean.length % 8 !== 0) return { text: '', error: 'Binary length must be a multiple of 8 bits' };
  let text = '';
  for (let i = 0; i < clean.length; i += 8) text += String.fromCharCode(parseInt(clean.slice(i, i + 8), 2));
  return { text, error: '' };
}
function textToHex(text: string, upper: boolean, prefix: boolean) {
  return [...text].map(c => { const h = c.charCodeAt(0).toString(16); const v = upper ? h.toUpperCase() : h; return prefix ? `0x${v}` : v; }).join(' ');
}
function textToOctal(text: string) { return [...text].map(c => c.charCodeAt(0).toString(8)).join(' '); }
function textToDecimal(text: string) { return [...text].map(c => c.charCodeAt(0).toString()).join(' '); }

export function BinaryTranslatorTool() {
  const [mode, setMode] = useState<Mode>('text-to-binary');
  const [input, setInput] = useState('Hello World!');
  const [separator, setSeparator] = useState(' ');
  const [hexUpper, setHexUpper] = useState(true);
  const [hexPrefix, setHexPrefix] = useState(false);
  const [copied, setCopied] = useState(false);

  const output = (() => {
    if (!input) return '';
    switch (mode) {
      case 'text-to-binary': return textToBinary(input, separator);
      case 'binary-to-text': return binaryToText(input).text;
      case 'text-to-hex': return textToHex(input, hexUpper, hexPrefix);
      case 'text-to-octal': return textToOctal(input);
      case 'text-to-decimal': return textToDecimal(input);
    }
  })();

  const error = mode === 'binary-to-text' && input ? binaryToText(input).error : '';
  const charCount = mode === 'binary-to-text' ? output.length : input.length;
  const byteCount = mode === 'binary-to-text' ? new TextEncoder().encode(output).length : new TextEncoder().encode(input).length;

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swap = () => {
    if (mode === 'text-to-binary') { setMode('binary-to-text'); setInput(output); }
    else if (mode === 'binary-to-text') { setMode('text-to-binary'); setInput(output); }
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex flex-wrap gap-2">
        {MODES.map(m => (
          <button key={m.value} onClick={() => { setMode(m.value); setInput(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m.value ? 'bg-primary-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-400'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Options */}
      {mode === 'text-to-binary' && (
        <div className="flex items-center gap-4">
          <label className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <input type="checkbox" checked={separator === ' '} onChange={e => setSeparator(e.target.checked ? ' ' : '')} className="rounded border-slate-300 dark:border-slate-600" />
            Space between bytes
          </label>
        </div>
      )}
      {mode === 'text-to-hex' && (
        <div className="flex items-center gap-4">
          <label className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <input type="checkbox" checked={hexUpper} onChange={e => setHexUpper(e.target.checked)} className="rounded border-slate-300 dark:border-slate-600" />
            Uppercase
          </label>
          <label className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <input type="checkbox" checked={hexPrefix} onChange={e => setHexPrefix(e.target.checked)} className="rounded border-slate-300 dark:border-slate-600" />
            0x prefix
          </label>
        </div>
      )}

      {/* Input */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {mode === 'binary-to-text' ? 'Binary Input' : 'Text Input'}
          </label>
          <div className="flex gap-2">
            <button onClick={() => setInput(mode === 'binary-to-text' ? '01001000 01100101 01101100 01101100 01101111' : 'Hello World!')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Sample</button>
            <button onClick={() => setInput('')} className="text-xs text-red-500 hover:underline">Clear</button>
          </div>
        </div>
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={4} placeholder={mode === 'binary-to-text' ? 'Enter binary code...' : 'Enter text to convert...'}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 font-mono text-sm resize-y" />
      </div>

      {/* Swap Button */}
      {(mode === 'text-to-binary' || mode === 'binary-to-text') && (
        <div className="text-center">
          <button onClick={swap} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm font-medium">↕ Swap</button>
        </div>
      )}

      {/* Output */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {mode === 'binary-to-text' ? 'Decoded Text' : 'Converted Output'}
          </label>
          <button onClick={handleCopy} disabled={!output}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-primary-700 text-white hover:bg-primary-800 disabled:opacity-50 transition-colors">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        {error ? (
          <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">{error}</div>
        ) : (
          <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-800 dark:text-slate-200 min-h-[100px] whitespace-pre-wrap break-all">
            {output || <span className="text-slate-400">Output will appear here...</span>}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span>Characters: {charCount}</span>
        <span>Bytes: {byteCount}</span>
        {mode === 'text-to-binary' && <span>Bits: {input.length * 8}</span>}
      </div>

      {/* Step by step */}
      {mode === 'text-to-binary' && input.length > 0 && input.length <= 10 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Step-by-Step Breakdown</h3>
          <div className="space-y-1">
            {[...input].map((char, i) => (
              <div key={i} className="flex items-center gap-4 text-sm font-mono py-1 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="w-8 text-center text-lg">{char}</span>
                <span className="text-slate-400">→</span>
                <span className="text-slate-500 dark:text-slate-400">ASCII {char.charCodeAt(0)}</span>
                <span className="text-slate-400">→</span>
                <span className="text-primary-700 dark:text-primary-400 font-bold">{char.charCodeAt(0).toString(2).padStart(8, '0')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
