'use client';
import { useState, useCallback, useRef } from 'react';
import { Copy, Check, Trash2, Keyboard } from 'lucide-react';

/* ─── Romanized Nepali to Unicode mapping ─── */
const CONSONANTS: [string, string][] = [
  ['ksha', 'क्ष'], ['gya', 'ज्ञ'], ['chha', 'छ'], ['chhya', 'छ्य'],
  ['kha', 'ख'], ['gha', 'घ'], ['nga', 'ङ'], ['cha', 'च'], ['jha', 'झ'],
  ['tha', 'ठ'], ['dha', 'ध'], ['pha', 'फ'], ['bha', 'भ'], ['sha', 'श'],
  ['shha', 'ष'], ['tra', 'त्र'], ['gna', 'ग्न'],
  ['ka', 'क'], ['ga', 'ग'], ['ja', 'ज'], ['ta', 'ट'], ['da', 'ड'],
  ['na', 'न'], ['pa', 'प'], ['ba', 'ब'], ['ma', 'म'], ['ya', 'य'],
  ['ra', 'र'], ['la', 'ल'], ['wa', 'व'], ['va', 'व'], ['sa', 'स'],
  ['ha', 'ह'],
  // Without trailing 'a' for halant
  ['ksh', 'क्ष्'], ['gy', 'ज्ञ्'], ['chh', 'छ्'],
  ['kh', 'ख्'], ['gh', 'घ्'], ['ng', 'ङ्'], ['ch', 'च्'], ['jh', 'झ्'],
  ['th', 'ठ्'], ['dh', 'ध्'], ['ph', 'फ्'], ['bh', 'भ्'], ['sh', 'श्'],
  ['k', 'क्'], ['g', 'ग्'], ['j', 'ज्'], ['t', 'ट्'], ['d', 'ड्'],
  ['n', 'न्'], ['p', 'प्'], ['b', 'ब्'], ['m', 'म्'], ['y', 'य्'],
  ['r', 'र्'], ['l', 'ल्'], ['w', 'व्'], ['v', 'व्'], ['s', 'स्'],
  ['h', 'ह्'],
];

const VOWELS: [string, string, string][] = [
  // [romanized, independent, matra]
  ['aa', 'आ', 'ा'], ['ai', 'ऐ', 'ै'], ['au', 'औ', 'ौ'],
  ['ee', 'ई', 'ी'], ['oo', 'ऊ', 'ू'], ['ou', 'ओ', 'ो'],
  ['ri', 'ऋ', 'ृ'],
  ['a', 'अ', ''], ['i', 'इ', 'ि'], ['u', 'उ', 'ु'],
  ['e', 'ए', 'े'], ['o', 'ओ', 'ो'],
];

const SPECIAL: [string, string][] = [
  ['shree', 'श्री'], ['om', 'ॐ'],
  ['0', '०'], ['1', '१'], ['2', '२'], ['3', '३'], ['4', '४'],
  ['5', '५'], ['6', '६'], ['7', '७'], ['8', '८'], ['9', '९'],
  ['.', '।'], ['..', '॥'], [',', ','],
];

function romanToNepali(roman: string): string {
  let result = '';
  let i = 0;
  const input = roman.toLowerCase();

  while (i < input.length) {
    // Skip spaces and pass through
    if (input[i] === ' ' || input[i] === '\n' || input[i] === '\t') {
      result += input[i];
      i++;
      continue;
    }

    let matched = false;

    // Try special sequences first
    for (const [from, to] of SPECIAL) {
      if (input.substring(i, i + from.length) === from) {
        result += to;
        i += from.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Try consonant + vowel combinations
    let consonantMatched = false;
    for (const [cFrom, cTo] of CONSONANTS) {
      if (input.substring(i, i + cFrom.length) === cFrom) {
        // Check if followed by a vowel matra
        const afterConsonant = i + cFrom.length;
        let vowelMatched = false;

        for (const [vFrom, , vMatra] of VOWELS) {
          if (input.substring(afterConsonant, afterConsonant + vFrom.length) === vFrom) {
            // Remove halant if consonant ends with it, add matra
            const base = cTo.endsWith('्') ? cTo.slice(0, -1) : cTo;
            result += base + vMatra;
            i = afterConsonant + vFrom.length;
            vowelMatched = true;
            break;
          }
        }

        if (!vowelMatched) {
          result += cTo;
          i += cFrom.length;
        }
        consonantMatched = true;
        break;
      }
    }
    if (consonantMatched) continue;

    // Try independent vowels
    for (const [vFrom, vIndependent] of VOWELS) {
      if (input.substring(i, i + vFrom.length) === vFrom) {
        result += vIndependent;
        i += vFrom.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Pass through unmatched characters
    result += input[i];
    i++;
  }

  return result;
}

const KEYBOARD_ROWS = [
  ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'],
  ['ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न'],
  ['प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श'],
  ['ष', 'स', 'ह', 'क्ष', 'ज्ञ', '्', 'ा', 'ि', 'ी', 'ु'],
  ['ू', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः', '।', 'ृ', 'ँ'],
];

export function NepaliTypingTool() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const output = romanToNepali(input);

  const copy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  function insertChar(char: string) {
    // Insert into output directly
    if (outputRef.current) {
      const textarea = outputRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const current = output;
      const newText = current.substring(0, start) + char + current.substring(end);
      // We can't directly set output since it's derived from input
      // Instead append to input a mapped version
      setInput(prev => prev + ' ');
      // For virtual keyboard, we'll append to a separate direct output
    }
  }

  const wordCount = (t: string) => t ? t.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-blue-700 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Keyboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">नेपाली टाइपिङ</h2>
            <p className="text-red-100 text-xs">Type Nepali using English keyboard — Romanized to Devanagari</p>
          </div>
        </div>
      </div>

      {/* Input / Output */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Type in English (Romanized)</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">{wordCount(input)} words</span>
              {input && (
                <button onClick={() => setInput('')} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Type here: "namaste nepal" → नमस्ते नेपाल'
            rows={10}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none leading-relaxed placeholder:text-slate-400"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">नेपाली (Nepali Unicode)</span>
            <span className="text-[10px] text-slate-400">{wordCount(output)} words</span>
          </div>
          <textarea
            ref={outputRef}
            readOnly
            value={output}
            placeholder="नेपाली टेक्स्ट यहाँ देखिनेछ..."
            rows={10}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-green-50/50 dark:bg-slate-800/50 px-4 py-3 text-base text-slate-800 dark:text-slate-200 resize-none leading-relaxed focus:outline-none font-[system-ui]"
          />
          <button
            onClick={copy}
            disabled={!output}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              copied ? 'bg-green-100 text-green-700' : 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20'
            } disabled:opacity-40 disabled:shadow-none`}
          >
            {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy नेपाली Text</>}
          </button>
        </div>
      </div>

      {/* Virtual Keyboard Toggle */}
      <button
        onClick={() => setShowKeyboard(!showKeyboard)}
        className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <Keyboard className="w-4 h-4" /> {showKeyboard ? 'Hide' : 'Show'} Nepali Keyboard
      </button>

      {showKeyboard && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} className="flex flex-wrap gap-1.5 justify-center">
              {row.map((ch, ci) => (
                <button
                  key={ci}
                  onClick={() => setInput(prev => prev + ch)}
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-red-700 transition-colors border border-slate-200 dark:border-slate-600"
                >
                  {ch}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Character Reference */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Quick Reference — How to Type</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 text-xs">
          {[
            ['ka', 'क'], ['kha', 'ख'], ['ga', 'ग'], ['gha', 'घ'],
            ['cha', 'च'], ['chha', 'छ'], ['ja', 'ज'], ['jha', 'झ'],
            ['ta', 'ट'], ['tha', 'ठ'], ['da', 'ड'], ['dha', 'ध'],
            ['na', 'न'], ['pa', 'प'], ['pha', 'फ'], ['ba', 'ब'],
            ['bha', 'भ'], ['ma', 'म'], ['ya', 'य'], ['ra', 'र'],
            ['la', 'ल'], ['wa', 'व'], ['sha', 'श'], ['sa', 'स'],
            ['ha', 'ह'], ['ksha', 'क्ष'], ['gya', 'ज्ञ'], ['tra', 'त्र'],
          ].map(([rom, nep]) => (
            <div key={rom} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-center">
              <span className="text-red-600 font-bold text-base">{nep}</span>
              <span className="block text-[9px] text-slate-400 mt-0.5">{rom}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
