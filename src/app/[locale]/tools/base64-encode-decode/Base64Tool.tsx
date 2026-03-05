'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { RotateCcw, Upload } from 'lucide-react';
import { readFileAsArrayBuffer } from '@/lib/utils';

export function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');

  function getOutput(): string {
    if (!input.trim()) return '';
    try {
      if (mode === 'encode') {
        return btoa(unescape(encodeURIComponent(input)));
      } else {
        return decodeURIComponent(escape(atob(input.trim())));
      }
    } catch {
      return '';
    }
  }

  function validate(): string {
    if (!input.trim()) return '';
    try {
      if (mode === 'encode') btoa(unescape(encodeURIComponent(input)));
      else decodeURIComponent(escape(atob(input.trim())));
      return '';
    } catch (e) {
      return mode === 'decode'
        ? 'Invalid Base64 string. Ensure the input is valid Base64.'
        : (e as Error).message;
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const buf = await readFileAsArrayBuffer(file);
    const bytes = new Uint8Array(buf);
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const b64 = btoa(binary);
    const mimeType = file.type || 'application/octet-stream';
    setInput(`data:${mimeType};base64,${b64}`);
    setMode('encode');
    // Reset file input
    e.target.value = '';
  }

  const output = getOutput();
  const validationError = validate();

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
        {(['encode', 'decode'] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setInput('');
            }}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              mode === m
                ? 'bg-white dark:bg-slate-800 text-primary-800 dark:text-primary-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {mode === 'encode' ? 'Plain Text or Data URI' : 'Base64 String'}
          </label>
          <div className="flex gap-2">
            {mode === 'encode' && (
              <label className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">
                <Upload className="w-3 h-3" />
                Encode File
                <input type="file" onChange={handleFile} className="sr-only" />
              </label>
            )}
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
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'encode'
              ? 'Enter text to encode to Base64...'
              : 'Paste Base64 string to decode...'
          }
          className="tool-textarea min-h-[160px] text-xs"
          spellCheck={false}
        />
        {validationError && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{validationError}</p>
        )}
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
          </label>
          {output && <CopyButton text={output} size="sm" />}
        </div>
        <textarea
          value={output}
          readOnly
          placeholder={`${mode === 'encode' ? 'Base64 encoded' : 'Decoded'} output will appear here...`}
          className="tool-textarea min-h-[160px] text-xs bg-slate-50 dark:bg-slate-900"
          spellCheck={false}
        />
      </div>

      {input && output && (
        <p className="text-xs text-slate-400">
          Input: {input.length} chars → Output: {output.length} chars
          {mode === 'encode' &&
            ` (${Math.round((output.length / input.length - 1) * 100)}% larger)`}
        </p>
      )}
    </div>
  );
}
