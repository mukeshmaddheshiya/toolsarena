'use client';
import { useState, useCallback } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { ArrowLeftRight } from 'lucide-react';

// ─── Cipher logic ─────────────────────────────────────────────────────────────

function caesarShift(text: string, shift: number, decrypt: boolean): string {
  const s = decrypt ? (26 - (shift % 26)) % 26 : shift % 26;
  return text.replace(/[a-zA-Z]/g, ch => {
    const base = ch >= 'a' ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + s) % 26) + base);
  });
}

function atbash(text: string): string {
  return text.replace(/[a-zA-Z]/g, ch => {
    const base = ch >= 'a' ? 97 : 65;
    return String.fromCharCode(base + 25 - (ch.charCodeAt(0) - base));
  });
}

function vigenere(text: string, keyword: string, decrypt: boolean): string {
  if (!keyword) return text;
  const key = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  if (!key) return text;
  let ki = 0;
  return text.replace(/[a-zA-Z]/g, ch => {
    const base = ch >= 'a' ? 97 : 65;
    const k = key.charCodeAt(ki % key.length) - 65;
    ki++;
    const shift = decrypt ? (26 - k) % 26 : k;
    return String.fromCharCode(((ch.charCodeAt(0) - base + shift) % 26) + base);
  });
}

// ─── Cipher descriptions ──────────────────────────────────────────────────────

const CIPHER_INFO: Record<string, { name: string; description: string; historical: string }> = {
  caesar: {
    name: 'Caesar Cipher',
    description: 'Shifts each letter by a fixed number of positions in the alphabet.',
    historical: 'Used by Julius Caesar to communicate with his generals. One of the oldest known encryption techniques.',
  },
  rot13: {
    name: 'ROT13',
    description: 'A special case of the Caesar cipher with a shift of 13. Applying ROT13 twice returns the original text — it is its own inverse.',
    historical: 'Widely used in online forums in the 1980s–90s to obscure spoilers and punchlines.',
  },
  atbash: {
    name: 'Atbash Cipher',
    description: 'Reverses the alphabet — A↔Z, B↔Y, C↔X, and so on. Like ROT13, it is its own inverse.',
    historical: 'Originally a Hebrew cipher used in the Book of Jeremiah. The name comes from the first, last, second, and second-to-last Hebrew letters.',
  },
  vigenere: {
    name: 'Vigenère Cipher',
    description: 'A polyalphabetic substitution cipher that uses a keyword to determine the shift for each letter. C = (P + K) mod 26.',
    historical: 'Invented in the 16th century, it was called "le chiffre indéchiffrable" (the indecipherable cipher) for centuries until broken by Charles Babbage.',
  },
};

type CipherKey = 'caesar' | 'rot13' | 'atbash' | 'vigenere';

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

export function TextEncryptionTool() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [cipher, setCipher] = useState<CipherKey>('caesar');
  const [input, setInput] = useState('');
  const [caesarShiftVal, setCaesarShiftVal] = useState(3);
  const [vigenereKey, setVigenereKey] = useState('');

  const process = useCallback(
    (text: string): string => {
      if (!text) return '';
      const dec = mode === 'decrypt';
      switch (cipher) {
        case 'caesar':
          return caesarShift(text, caesarShiftVal, dec);
        case 'rot13':
          return caesarShift(text, 13, false); // rot13 is symmetric
        case 'atbash':
          return atbash(text); // atbash is symmetric
        case 'vigenere':
          return vigenere(text, vigenereKey, dec);
        default:
          return text;
      }
    },
    [mode, cipher, caesarShiftVal, vigenereKey]
  );

  const output = process(input);

  const swapInputOutput = () => {
    setInput(output);
    setMode(m => (m === 'encrypt' ? 'decrypt' : 'encrypt'));
  };

  const info = CIPHER_INFO[cipher];

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 gap-1 bg-slate-50 dark:bg-slate-900">
          {(['encrypt', 'decrypt'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                mode === m
                  ? 'bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Cipher selector */}
      <div>
        <label className={labelClass}>Cipher</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(CIPHER_INFO) as CipherKey[]).map(c => (
            <button
              key={c}
              onClick={() => setCipher(c)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${
                cipher === c
                  ? 'bg-primary-800 text-white border-primary-800'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              }`}
            >
              {CIPHER_INFO[c].name}
            </button>
          ))}
        </div>
      </div>

      {/* Cipher info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50 p-4">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">{info.name}</p>
        <p className="text-sm text-blue-700 dark:text-blue-400">{info.description}</p>
        <p className="text-xs text-blue-600 dark:text-blue-500 mt-1.5 italic">{info.historical}</p>
      </div>

      {/* Cipher-specific options */}
      {cipher === 'caesar' && (
        <div>
          <label className={labelClass}>
            Shift: <span className="font-bold text-primary-700 dark:text-primary-400">{caesarShiftVal}</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={25}
              value={caesarShiftVal}
              onChange={e => setCaesarShiftVal(parseInt(e.target.value))}
              className="flex-1 accent-primary-600"
            />
            <input
              type="number"
              min={1}
              max={25}
              value={caesarShiftVal}
              onChange={e => {
                const v = Math.max(1, Math.min(25, parseInt(e.target.value) || 1));
                setCaesarShiftVal(v);
              }}
              className={`${inputClass} w-20 text-center`}
            />
          </div>
        </div>
      )}

      {cipher === 'vigenere' && (
        <div>
          <label className={labelClass}>Keyword (A–Z letters only)</label>
          <input
            type="text"
            value={vigenereKey}
            onChange={e => setVigenereKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
            placeholder="e.g. SECRET"
            className={`${inputClass} uppercase`}
          />
        </div>
      )}

      {cipher === 'rot13' && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ROT13 uses a fixed shift of 13. Encrypt and Decrypt produce the same result since it is its own inverse.
          </p>
        </div>
      )}

      {cipher === 'atbash' && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Atbash is symmetric — applying it twice returns the original text.
          </p>
        </div>
      )}

      {/* Input / Output side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            {mode === 'encrypt' ? 'Plain' : 'Encrypted'} Text
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Enter text to ${mode}...`}
            className={`${inputClass} min-h-[160px] resize-y`}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={`${labelClass} mb-0`}>
              {mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} Text
            </label>
            {output && <CopyButton text={output} size="sm" />}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className={`${inputClass} min-h-[160px] resize-y bg-slate-50 dark:bg-slate-900`}
          />
        </div>
      </div>

      {/* Swap button */}
      {output && (
        <button
          onClick={swapInputOutput}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Swap & {mode === 'encrypt' ? 'Decrypt' : 'Encrypt'}
        </button>
      )}
    </div>
  );
}
