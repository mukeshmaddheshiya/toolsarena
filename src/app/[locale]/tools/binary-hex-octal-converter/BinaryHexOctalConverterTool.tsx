'use client';
import { useState, useCallback } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { Binary, Hash, RotateCcw, Zap, Info, Type } from 'lucide-react';

type Base = 'decimal' | 'binary' | 'octal' | 'hex';

const BASES: { key: Base; label: string; radix: number; pattern: RegExp; placeholder: string; icon: React.ReactNode }[] = [
  { key: 'decimal', label: 'Decimal (Base 10)', radix: 10, pattern: /^[0-9]*$/, placeholder: 'e.g. 255', icon: <Hash className="w-4 h-4" /> },
  { key: 'binary', label: 'Binary (Base 2)', radix: 2, pattern: /^[01]*$/, placeholder: 'e.g. 11111111', icon: <Binary className="w-4 h-4" /> },
  { key: 'octal', label: 'Octal (Base 8)', radix: 8, pattern: /^[0-7]*$/, placeholder: 'e.g. 377', icon: <Hash className="w-4 h-4 rotate-12" /> },
  { key: 'hex', label: 'Hexadecimal (Base 16)', radix: 16, pattern: /^[0-9a-fA-F]*$/, placeholder: 'e.g. FF', icon: <Hash className="w-4 h-4 -rotate-12" /> },
];

const EXAMPLES = [
  { label: '255', decimal: '255' },
  { label: '1024', decimal: '1024' },
  { label: '65535', decimal: '65535' },
  { label: '42', decimal: '42' },
  { label: '128', decimal: '128' },
  { label: '256', decimal: '256' },
];

function bigIntToBase(value: bigint, radix: number): string {
  if (value === BigInt(0)) return '0';
  const digits = '0123456789abcdef';
  let result = '';
  let v = value < BigInt(0) ? -value : value;
  const r = BigInt(radix);
  while (v > BigInt(0)) {
    result = digits[Number(v % r)] + result;
    v = v / r;
  }
  return value < BigInt(0) ? '-' + result : result;
}

function parseBigInt(value: string, radix: number): bigint | null {
  if (!value) return null;
  try {
    const clean = value.toLowerCase().replace(/^0+(?=.)/, '');
    const r = BigInt(radix);
    let result = BigInt(0);
    for (const ch of clean) {
      const d = '0123456789abcdef'.indexOf(ch);
      if (d < 0 || d >= radix) return null;
      result = result * r + BigInt(d);
    }
    return result;
  } catch {
    return null;
  }
}

function formatNibbles(bin: string): string {
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, '0');
  return padded.match(/.{4}/g)?.join(' ') ?? bin;
}

function formatBytes(bin: string): string {
  const padded = bin.padStart(Math.ceil(bin.length / 8) * 8, '0');
  return padded.match(/.{8}/g)?.join(' ') ?? bin;
}

function fitsIn(bits: number): { b8: boolean; b16: boolean; b32: boolean; b64: boolean } {
  return { b8: bits <= 8, b16: bits <= 16, b32: bits <= 32, b64: bits <= 64 };
}

export function BinaryHexOctalConverterTool() {
  const [values, setValues] = useState<Record<Base, string>>({ decimal: '', binary: '', octal: '', hex: '' });
  const [error, setError] = useState('');
  const [text, setText] = useState('');

  const updateAll = useCallback((source: Base, raw: string) => {
    const base = BASES.find((b) => b.key === source)!;
    if (raw && !base.pattern.test(raw)) {
      setError(`Invalid character for ${base.label}`);
      return;
    }
    setError('');
    if (!raw) {
      setValues({ decimal: '', binary: '', octal: '', hex: '' });
      return;
    }
    const num = parseBigInt(raw, base.radix);
    if (num === null) {
      setError('Could not parse number');
      return;
    }
    setValues({
      decimal: source === 'decimal' ? raw : bigIntToBase(num, 10),
      binary: source === 'binary' ? raw : bigIntToBase(num, 2),
      octal: source === 'octal' ? raw : bigIntToBase(num, 8),
      hex: source === 'hex' ? raw : bigIntToBase(num, 16),
    });
  }, []);

  const handleExample = (dec: string) => updateAll('decimal', dec);
  const handleClear = () => {
    setValues({ decimal: '', binary: '', octal: '', hex: '' });
    setError('');
  };

  const binValue = values.binary;
  const bitCount = binValue ? binValue.replace(/^0+/, '').length || 1 : 0;
  const fit = fitsIn(bitCount);
  const hasValue = binValue.length > 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Binary className="w-7 h-7" />
          <h2 className="text-xl font-bold">Number Base Converter</h2>
        </div>
        <p className="text-indigo-100 text-sm">Convert between decimal, binary, octal, and hexadecimal in real time. Supports arbitrarily large numbers.</p>
      </div>

      {/* Quick Examples */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-3 h-3" /> Quick examples
        </span>
        {EXAMPLES.map((ex) => (
          <button key={ex.label} onClick={() => handleExample(ex.decimal)} className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors">
            {ex.label}
          </button>
        ))}
        {hasValue && (
          <button onClick={handleClear} className="ml-auto inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <RotateCcw className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Converter Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        {BASES.map((base) => (
          <div key={base.key} className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {base.icon} {base.label}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={values[base.key]}
                onChange={(e) => updateAll(base.key, e.target.value)}
                placeholder={base.placeholder}
                spellCheck={false}
                autoComplete="off"
                className="tool-input flex-1 font-mono text-sm"
              />
              {values[base.key] && <CopyButton text={values[base.key]} size="sm" />}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}

      {/* Bit Info Cards */}
      {hasValue && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-500" /> Bit Representation
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Nibbles (4-bit groups)</span>
                <p className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all">{formatNibbles(binValue)}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Bytes (8-bit groups)</span>
                <p className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all">{formatBytes(binValue)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500" /> Size Info
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Bits needed: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{bitCount}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '8-bit', ok: fit.b8 },
                { label: '16-bit', ok: fit.b16 },
                { label: '32-bit', ok: fit.b32 },
                { label: '64-bit', ok: fit.b64 },
              ].map((s) => (
                <span key={s.label} className={`px-2 py-0.5 rounded text-[10px] font-semibold ${s.ok ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {s.label} {s.ok ? 'OK' : 'NO'}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Text to Binary */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Type className="w-4 h-4 text-indigo-500" /> Text to Binary / Hex
        </h3>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type any text to see character codes..."
          className="tool-input w-full text-sm"
        />
        {text && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-[10px] uppercase text-slate-400">
                  <th className="py-1.5 pr-3">Char</th>
                  <th className="py-1.5 pr-3">ASCII</th>
                  <th className="py-1.5 pr-3">Binary</th>
                  <th className="py-1.5">Hex</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {[...text].map((ch, i) => {
                  const code = ch.charCodeAt(0);
                  return (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-1 pr-3 font-sans font-medium text-slate-700 dark:text-slate-300">{ch === ' ' ? '\u2423' : ch}</td>
                      <td className="py-1 pr-3 text-slate-600 dark:text-slate-400">{code}</td>
                      <td className="py-1 pr-3 text-slate-600 dark:text-slate-400">{code.toString(2).padStart(8, '0')}</td>
                      <td className="py-1 text-slate-600 dark:text-slate-400">{code.toString(16).padStart(2, '0')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
