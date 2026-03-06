'use client';
import { useState, useMemo, useCallback } from 'react';
import { Copy, Check, ArrowLeftRight, Languages, Trash2 } from 'lucide-react';

/* ─── Preeti to Unicode mapping ─── */
const PREETI_MAP: Record<string, string> = {
  // Vowels
  'c': 'अ', 'cf': 'आ', 'O': 'इ', 'O{': 'ई', 'p': 'उ', 'P': 'ऊ',
  '?': 'ऋ', 'P]': 'ऊ', 'Pf': 'ऊ', 'cf]': 'ओ', 'cf}': 'औ',
  'c]': 'ओ', 'c}': 'औ', 'o': 'ए', 'o]': 'ऐ',

  // Consonants
  's': 'ब', 'S': 'भ', 'b': 'द', 'B': 'ध', 'r': 'च', 'R': 'छ',
  'd': 'ड', 'D': 'ढ', 'k': 'क', 'K': 'ख', 'u': 'ग', 'U': 'घ',
  'v': 'ह', 'V': 'ह्', 'g': 'ज', 'G': 'झ', 'n': 'ल', 'N': 'ळ',
  'l': 'त', 'L': 'थ', 'w': 'ट', 'W': 'ठ', 'h': 'य', 'H': 'ञ',
  'x': 'न', 'X': 'ण', 'e': 'म', 'E': 'म्', 'z': 'श', 'Z': 'ष',
  'q': 'फ', 'Q': 'ङ', 't': 'ज्ञ', 'T': 'ट्ट', 'j': 'र',
  'a': 'प', 'A': 'ँ', 'i': 'स', 'I': 'क्ष', 'f': 'ा',
  ';': '्', '\\': 'ृ', '|': 'र्',

  // Matras and modifiers
  '/': 'श्र', '{': 'ी', '}': 'ू', 'm': 'ि', 'M': 'ं',
  '!': '!', '@': '@', '#': '#', '$': '$', '%': 'ः',
  '^': '^', '&': 'ज्', '*': '*', '(': '(', ')': ')',

  // Numbers
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',

  // Punctuation
  '.': '।', '=': '.', ',': ',', '\'': 'ु', '"': 'ू',
  '`': 'ञ', '~': 'ॐ', '_': ')', '+': 'ं',
  '-': '(', '[': 'ृ', ']': 'े', '>': 'श्र',
};

// Multi-char sequences (check these first, longest match)
const PREETI_MULTI: [string, string][] = [
  ['If', 'क्षा'], ['cf]', 'ओ'], ['cf}', 'औ'], ['c]', 'ओ'], ['c}', 'औ'],
  ['O{', 'ई'], ['o]', 'ऐ'], ['P]', 'ऊ'],
  ['q|m', 'फ्रि'], ['q|', 'फ्र'],
  ['\\|', 'र्‍ृ'],
];

function preetiToUnicode(preeti: string): string {
  let result = '';
  let i = 0;

  while (i < preeti.length) {
    let matched = false;

    // Try multi-char matches (longest first)
    for (const [from, to] of PREETI_MULTI) {
      if (preeti.substring(i, i + from.length) === from) {
        result += to;
        i += from.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const ch = preeti[i];
      if (PREETI_MAP[ch] !== undefined) {
        result += PREETI_MAP[ch];
      } else if (ch === '\n' || ch === '\r' || ch === '\t') {
        result += ch;
      } else if (ch === ' ') {
        result += ' ';
      } else {
        result += ch; // pass through unmapped
      }
      i++;
    }
  }

  // Post-processing: fix ikar position (move ि before consonant)
  result = result.replace(/(.)ि/g, (_, before) => {
    if (/[\u0915-\u0939\u0958-\u0961]/.test(before)) {
      return 'ि' + before;
    }
    return before + 'ि';
  });

  return result;
}

function unicodeToPreeti(unicode: string): string {
  // Build reverse map
  const reverseMap: [string, string][] = [];
  for (const [from, to] of PREETI_MULTI) {
    reverseMap.push([to, from]);
  }
  for (const [key, val] of Object.entries(PREETI_MAP)) {
    if (val && !reverseMap.some(([v]) => v === val)) {
      reverseMap.push([val, key]);
    }
  }
  // Sort by length descending for longest match
  reverseMap.sort((a, b) => b[0].length - a[0].length);

  let result = '';
  let i = 0;
  while (i < unicode.length) {
    let matched = false;
    for (const [from, to] of reverseMap) {
      if (unicode.substring(i, i + from.length) === from) {
        result += to;
        i += from.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += unicode[i];
      i++;
    }
  }
  return result;
}

type Mode = 'preeti-to-unicode' | 'unicode-to-preeti';

export function PreetiToUnicodeTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('preeti-to-unicode');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input.trim()) return '';
    return mode === 'preeti-to-unicode' ? preetiToUnicode(input) : unicodeToPreeti(input);
  }, [input, mode]);

  const copy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const wordCount = (t: string) => t ? t.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-blue-700 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">प्रिती → युनिकोड</h2>
            <p className="text-red-100 text-xs">Preeti to Unicode Converter — नेपाली फन्ट कन्भर्टर</p>
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => setMode(m => m === 'preeti-to-unicode' ? 'unicode-to-preeti' : 'preeti-to-unicode')}
          className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-800 border-2 border-red-200 dark:border-red-800 rounded-2xl shadow-sm hover:shadow-md transition-all group"
        >
          <span className={`text-sm font-bold ${mode === 'preeti-to-unicode' ? 'text-red-700 dark:text-red-400' : 'text-slate-400'}`}>
            Preeti (प्रिती)
          </span>
          <div className="w-9 h-9 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
            <ArrowLeftRight className="w-4 h-4 text-red-600" />
          </div>
          <span className={`text-sm font-bold ${mode === 'unicode-to-preeti' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-400'}`}>
            Unicode (युनिकोड)
          </span>
        </button>
      </div>

      {/* Input / Output */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {mode === 'preeti-to-unicode' ? 'Preeti Text (प्रिती)' : 'Unicode Text (युनिकोड)'}
            </span>
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
            placeholder={mode === 'preeti-to-unicode'
              ? 'Paste your Preeti font text here...\ne.g.: g;jfg{ xf], d]z sf] gfd g]kfn xf] .'
              : 'Paste your Unicode Nepali text here...\ne.g.: जवाफ हो, देश को नाम नेपाल हो ।'}
            rows={10}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none leading-relaxed placeholder:text-slate-400"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {mode === 'preeti-to-unicode' ? 'Unicode Output (युनिकोड)' : 'Preeti Output (प्रिती)'}
            </span>
            <span className="text-[10px] text-slate-400">{wordCount(output)} words</span>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder={mode === 'preeti-to-unicode'
              ? 'Unicode output will appear here...'
              : 'Preeti output will appear here...'}
            rows={10}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-emerald-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 resize-none leading-relaxed focus:outline-none"
          />
          <button
            onClick={copy}
            disabled={!output}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              copied
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700'
                : 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20'
            } disabled:opacity-40 disabled:shadow-none`}
          >
            {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Result</>}
          </button>
        </div>
      </div>

      {/* Stats */}
      {input && output && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Characters</div>
            <div className="text-lg font-black text-slate-700 dark:text-slate-300">{input.length}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Words</div>
            <div className="text-lg font-black text-red-600">{wordCount(output)}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Lines</div>
            <div className="text-lg font-black text-blue-600">{output.split('\n').length}</div>
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
        <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">📝 Preeti vs Unicode — के फरक छ?</h3>
        <ul className="space-y-1.5 text-xs text-amber-700 dark:text-amber-400">
          <li>• <strong>Preeti (प्रिती)</strong> — Legacy font used in Nepal. Requires Preeti font installed to display correctly.</li>
          <li>• <strong>Unicode (युनिकोड)</strong> — Universal standard. Works everywhere — web, mobile, email, social media.</li>
          <li>• Government of Nepal mandated Unicode for all official digital content.</li>
          <li>• Most Nepali websites, Facebook, and WhatsApp use Unicode Nepali text.</li>
        </ul>
      </div>
    </div>
  );
}
