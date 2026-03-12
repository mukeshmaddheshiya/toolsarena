'use client';
import { useState, useMemo, useCallback } from 'react';
import { RotateCcw, ClipboardPaste, Download, FlipHorizontal2 } from 'lucide-react';
import { CopyButton } from '@/components/common/CopyButton';

// ─── Shree Lipi → Unicode character map ──────────────────────────────────
// Based on Shree Lipi 7 encoding (commonly used in Nepal)
const SHREE_TO_UNICODE: Record<string, string> = {
  // Standalone vowels
  'A': 'अ', 'O': 'आ', 'B': 'इ', 'C': 'ई', 'D': 'उ', 'E': 'ऊ',
  'F': 'ए', 'G': 'ऐ', 'H': 'ओ', 'I': 'औ', 'J': 'अं', 'K': 'अः',
  // Consonants (lowercase)
  'a': 'क', 'b': 'ख', 'c': 'ग', 'd': 'घ', 'e': 'ङ',
  'f': 'च', 'g': 'छ', 'h': 'ज', 'i': 'झ', 'j': 'ञ',
  'k': 'ट', 'l': 'ठ', 'm': 'ड', 'n': 'ढ', 'o': 'ण',
  'p': 'त', 'q': 'थ', 'r': 'द', 's': 'ध', 't': 'न',
  'u': 'प', 'v': 'फ', 'w': 'ब', 'x': 'भ', 'y': 'म',
  'z': 'य', ';': 'र', ',': 'ल', '.': 'व', '?': 'श',
  '@': 'ष', '&': 'स', '/': 'ह', '{': 'क्ष', '}': 'त्र',
  // Matras (vowel signs)
  '=': 'ा', '#': 'ि', '$': 'ी', '%': 'ु', '^': 'ू',
  '\'': 'े', '"': 'ै', '!': 'ो', '~': 'ौ', '`': 'ं',
  '|': 'ः', '+': '्', ':': 'ँ',
  // Nepali numerals
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',
  // Punctuation & whitespace (pass-through)
  '-': '-', ' ': ' ', '\n': '\n', '\t': '\t',
  // Additional common mappings
  'L': 'ळ', 'M': 'क्', 'N': 'त्', 'P': 'ट्', 'Q': 'ट्ट',
  'R': 'द्द', 'S': 'ह्', 'T': 'ह्म', 'U': 'श्र', 'V': 'द्व',
  'W': 'ब्ब', 'X': 'भ्', 'Y': 'म्', 'Z': 'य्',
  '(': '(', ')': ')', '[': '[', ']': ']',
  '<': '<', '>': '>', '*': '*',
};

// Build the reverse map for Unicode → Shree Lipi
// Only use unambiguous single-character mappings for reverse
const UNICODE_TO_SHREE: Record<string, string> = {};
for (const [ascii, uni] of Object.entries(SHREE_TO_UNICODE)) {
  // Skip if this unicode value already has a mapping (keep first / shorter)
  if (!(uni in UNICODE_TO_SHREE)) {
    UNICODE_TO_SHREE[uni] = ascii;
  }
}

// ─── Sample texts ─────────────────────────────────────────────────────────
const SAMPLE_SHREE = `t]kfn ;'Gb/ b]z xf]
sf7df8f}+ g]kfnsf] /fhwfgL xf]
oxfF w]/} ;'Gb/ 7fFpx? 5g\``;

const SAMPLE_UNICODE = `नेपाल सुन्दर देश हो
काठमाडौं नेपालको राजधानी हो
यहाँ धेरै सुन्दर ठाँउहरू छन्`;

// ─── Conversion functions ─────────────────────────────────────────────────
function shreeLipiToUnicode(input: string): string {
  if (!input) return '';
  let result = '';
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    // Try 2-char combinations first (e.g., special sequences)
    const twoChar = input.slice(i, i + 2);
    if (twoChar.length === 2 && SHREE_TO_UNICODE[twoChar]) {
      result += SHREE_TO_UNICODE[twoChar];
      i++; // skip next char
    } else if (SHREE_TO_UNICODE[char] !== undefined) {
      result += SHREE_TO_UNICODE[char];
    } else {
      // Unknown character — pass through as-is
      result += char;
    }
  }
  return result;
}

function unicodeToShreeLipi(input: string): string {
  if (!input) return '';
  let result = '';
  // We need to iterate over Unicode code points (some Devanagari chars are multi-char in JS)
  const chars = [...input]; // spread handles surrogate pairs
  for (const char of chars) {
    if (UNICODE_TO_SHREE[char] !== undefined) {
      result += UNICODE_TO_SHREE[char];
    } else {
      result += char;
    }
  }
  return result;
}

// ─── Direction type ───────────────────────────────────────────────────────
type Direction = 'shree-to-unicode' | 'unicode-to-shree';

// ─── Main component ───────────────────────────────────────────────────────
export function ShreeLipiToUnicodeTool() {
  const [direction, setDirection] = useState<Direction>('shree-to-unicode');
  const [input, setInput] = useState('');

  const isShreeToUni = direction === 'shree-to-unicode';

  const output = useMemo<string>(() => {
    if (!input.trim()) return '';
    return isShreeToUni ? shreeLipiToUnicode(input) : unicodeToShreeLipi(input);
  }, [input, isShreeToUni]);

  const inputCharCount = input.length;
  const outputCharCount = output.length;
  const inputLineCount = input ? input.split('\n').length : 0;

  const handleClear = useCallback(() => setInput(''), []);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // Fallback: focus the textarea so user can paste manually
    }
  }, []);

  const handleSample = useCallback(() => {
    setInput(isShreeToUni ? SAMPLE_SHREE : SAMPLE_UNICODE);
  }, [isShreeToUni]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isShreeToUni ? 'unicode-converted.txt' : 'shreelipi-converted.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [output, isShreeToUni]);

  const handleSwapDirection = useCallback(() => {
    const newDir: Direction =
      direction === 'shree-to-unicode' ? 'unicode-to-shree' : 'shree-to-unicode';
    setDirection(newDir);
    // Swap: put current output into input
    if (output) setInput(output);
    else setInput('');
  }, [direction, output]);

  return (
    <div className="space-y-5">
      {/* ── Direction tabs ── */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
        {(
          [
            {
              id: 'shree-to-unicode' as Direction,
              label: 'Shree Lipi → Unicode',
              sublabel: 'Legacy font → Devanagari',
            },
            {
              id: 'unicode-to-shree' as Direction,
              label: 'Unicode → Shree Lipi',
              sublabel: 'Devanagari → Legacy font',
            },
          ] as const
        ).map(tab => (
          <button
            key={tab.id}
            onClick={() => { setDirection(tab.id); setInput(''); }}
            className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all duration-150 ${
              direction === tab.id
                ? 'bg-white dark:bg-slate-700 shadow text-primary-700 dark:text-primary-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <div className="text-sm font-medium leading-tight">{tab.label}</div>
            <div className="text-[11px] opacity-70 mt-0.5 hidden sm:block">{tab.sublabel}</div>
          </button>
        ))}
      </div>

      {/* ── Action bar ── */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handlePaste}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-400 hover:text-primary-700 dark:hover:text-primary-400 transition-all"
        >
          <ClipboardPaste className="w-3.5 h-3.5" /> Paste from Clipboard
        </button>
        <button
          onClick={handleSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-400 hover:text-primary-700 dark:hover:text-primary-400 transition-all"
        >
          Sample Text
        </button>
        {input && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        )}
        {output && (
          <button
            onClick={handleSwapDirection}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all"
          >
            <FlipHorizontal2 className="w-3.5 h-3.5" /> Swap & Reverse
          </button>
        )}
      </div>

      {/* ── Converter layout ── */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Input panel */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              {isShreeToUni ? 'Shree Lipi Input' : 'Unicode Input'}
            </label>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {inputCharCount.toLocaleString()} chars · {inputLineCount} lines
            </span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              isShreeToUni
                ? "Paste your Shree Lipi encoded text here...\n\nExample: t]kfn ;'Gb/ b]z xf]"
                : 'Paste your Unicode Devanagari text here...\n\nExample: नेपाल सुन्दर देश हो'
            }
            rows={12}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 resize-y font-mono leading-relaxed"
            style={{ minHeight: '220px' }}
            spellCheck={false}
          />
        </div>

        {/* Output panel */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              {isShreeToUni ? 'Unicode Output' : 'Shree Lipi Output'}
            </label>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {outputCharCount.toLocaleString()} chars
            </span>
          </div>
          <div className="relative flex-1">
            <textarea
              value={output}
              readOnly
              placeholder={
                isShreeToUni
                  ? 'Converted Unicode Devanagari text will appear here...'
                  : 'Converted Shree Lipi text will appear here...'
              }
              rows={12}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm dark:text-slate-100 resize-y font-mono leading-relaxed cursor-default focus:outline-none"
              style={{ minHeight: '220px' }}
              spellCheck={false}
            />
          </div>

          {/* Output actions */}
          {output && (
            <div className="flex items-center gap-2 flex-wrap">
              <CopyButton text={output} size="sm" label="Copy All" />
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-400 hover:text-primary-700 dark:hover:text-primary-400 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download .txt
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Info notice ── */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300">
        <strong>Note:</strong> This tool supports Shree Lipi 7 and common variants. Core vowels, consonants,
        matras (vowel signs), and Nepali numerals (०–९) are fully converted. Complex conjunct consonants
        may need manual verification. For best results, use text typed in Shree Lipi 7.
      </div>

      {/* ── Character map reference ── */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Character Mapping Reference
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {/* Vowels */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Vowels (Uppercase)
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                ['A', 'अ'], ['O', 'आ'], ['B', 'इ'],
                ['C', 'ई'], ['D', 'उ'], ['E', 'ऊ'],
                ['F', 'ए'], ['G', 'ऐ'], ['H', 'ओ'],
                ['I', 'औ'],
              ].map(([ascii, dev]) => (
                <div key={ascii} className="flex items-center gap-1 text-xs">
                  <span className="font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 min-w-[24px] text-center">
                    {ascii}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">→</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{dev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Matras */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Matras (Vowel Signs)
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                ['=', 'ा'], ['#', 'ि'], ['$', 'ी'],
                ['%', 'ु'], ['^', 'ू'], ["'", 'े'],
                ['"', 'ै'], ['!', 'ो'], ['~', 'ौ'],
                ['`', 'ं'], ['|', 'ः'], ['+', '्'],
                [':', 'ँ'],
              ].map(([ascii, dev]) => (
                <div key={ascii} className="flex items-center gap-1 text-xs">
                  <span className="font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 min-w-[24px] text-center">
                    {ascii}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">→</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{dev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Numerals */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Nepali Numerals
            </div>
            <div className="grid grid-cols-3 gap-1">
              {['0','1','2','3','4','5','6','7','8','9'].map((n, i) => (
                <div key={n} className="flex items-center gap-1 text-xs">
                  <span className="font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 min-w-[24px] text-center">
                    {n}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">→</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {['०','१','२','३','४','५','६','७','८','९'][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Special
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[
                ['{', 'क्ष'], ['}', 'त्र'],
              ].map(([ascii, dev]) => (
                <div key={ascii} className="flex items-center gap-1 text-xs">
                  <span className="font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 min-w-[24px] text-center">
                    {ascii}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">→</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{dev}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Consonants full table */}
        <div className="mt-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Consonants (Lowercase keys)
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {[
              ['a','क'], ['b','ख'], ['c','ग'], ['d','घ'], ['e','ङ'],
              ['f','च'], ['g','छ'], ['h','ज'], ['i','झ'], ['j','ञ'],
              ['k','ट'], ['l','ठ'], ['m','ड'], ['n','ढ'], ['o','ण'],
              ['p','त'], ['q','थ'], ['r','द'], ['s','ध'], ['t','न'],
              ['u','प'], ['v','फ'], ['w','ब'], ['x','भ'], ['y','म'],
              ['z','य'], [';','र'], [',','ल'], ['.','व'], ['?','श'],
              ['@','ष'], ['&','स'], ['/','ह'],
            ].map(([ascii, dev]) => (
              <div
                key={ascii}
                className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 gap-0.5"
              >
                <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{ascii}</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{dev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
