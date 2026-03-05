'use client';
import { useState, useMemo, useCallback } from 'react';
import { Copy, Check, RefreshCw, Type, Wand2, ArrowRight } from 'lucide-react';

type Mode = 'standard' | 'formal' | 'casual' | 'shorter' | 'longer' | 'creative';

const MODES: { id: Mode; name: string; desc: string; color: string }[] = [
  { id: 'standard', name: 'Standard', desc: 'Clear rewording', color: 'bg-blue-500' },
  { id: 'formal', name: 'Formal', desc: 'Professional tone', color: 'bg-slate-700' },
  { id: 'casual', name: 'Casual', desc: 'Friendly & simple', color: 'bg-green-500' },
  { id: 'shorter', name: 'Shorter', desc: 'Concise version', color: 'bg-orange-500' },
  { id: 'longer', name: 'Longer', desc: 'Expanded version', color: 'bg-purple-500' },
  { id: 'creative', name: 'Creative', desc: 'Unique phrasing', color: 'bg-pink-500' },
];

/* ─── Synonym and Transformation Engine ─── */
const SYNONYMS: Record<string, string[]> = {
  // Common verbs
  'help': ['assist', 'aid', 'support'], 'use': ['utilize', 'employ', 'leverage'], 'make': ['create', 'produce', 'develop'],
  'get': ['obtain', 'acquire', 'receive'], 'give': ['provide', 'offer', 'deliver'], 'show': ['demonstrate', 'display', 'reveal'],
  'tell': ['inform', 'notify', 'communicate'], 'find': ['discover', 'locate', 'identify'], 'know': ['understand', 'recognize', 'comprehend'],
  'think': ['believe', 'consider', 'reckon'], 'want': ['desire', 'wish', 'require'], 'need': ['require', 'demand', 'necessitate'],
  'try': ['attempt', 'endeavor', 'strive'], 'start': ['begin', 'commence', 'initiate'], 'keep': ['maintain', 'retain', 'preserve'],
  'change': ['modify', 'alter', 'transform'], 'move': ['relocate', 'shift', 'transfer'], 'work': ['function', 'operate', 'perform'],
  'run': ['operate', 'execute', 'manage'], 'build': ['construct', 'develop', 'establish'],
  // Common adjectives
  'big': ['large', 'significant', 'substantial'], 'small': ['compact', 'minor', 'modest'], 'good': ['excellent', 'outstanding', 'quality'],
  'bad': ['poor', 'inadequate', 'subpar'], 'new': ['novel', 'fresh', 'recent'], 'old': ['previous', 'former', 'established'],
  'important': ['crucial', 'vital', 'essential'], 'different': ['distinct', 'varied', 'diverse'], 'hard': ['difficult', 'challenging', 'tough'],
  'easy': ['simple', 'straightforward', 'effortless'], 'fast': ['rapid', 'swift', 'quick'], 'high': ['elevated', 'superior', 'advanced'],
  'great': ['remarkable', 'exceptional', 'outstanding'], 'best': ['optimal', 'finest', 'top-tier'],
  // Common nouns
  'problem': ['issue', 'challenge', 'concern'], 'way': ['method', 'approach', 'manner'], 'place': ['location', 'area', 'site'],
  'part': ['component', 'element', 'section'], 'group': ['team', 'collection', 'ensemble'], 'thing': ['item', 'aspect', 'element'],
  'result': ['outcome', 'consequence', 'effect'], 'reason': ['rationale', 'justification', 'basis'],
  // Common adverbs
  'very': ['extremely', 'remarkably', 'highly'], 'really': ['genuinely', 'truly', 'certainly'], 'also': ['additionally', 'furthermore', 'moreover'],
  'however': ['nevertheless', 'nonetheless', 'yet'], 'therefore': ['consequently', 'thus', 'hence'],
  // Phrases
  'a lot of': ['numerous', 'a great deal of', 'substantial'], 'because of': ['due to', 'owing to', 'as a result of'],
  'in order to': ['to', 'so as to', 'for the purpose of'], 'as well as': ['along with', 'in addition to', 'together with'],
};

const FORMAL_SWAPS: Record<string, string> = {
  "can't": "cannot", "won't": "will not", "don't": "do not", "isn't": "is not", "aren't": "are not",
  "wasn't": "was not", "weren't": "were not", "didn't": "did not", "hasn't": "has not",
  'gonna': 'going to', 'wanna': 'want to', 'gotta': 'have to', 'kinda': 'kind of', 'sorta': 'sort of',
  'stuff': 'materials', 'things': 'items', 'guys': 'individuals', 'kids': 'children', 'lots': 'many',
  'ok': 'acceptable', 'okay': 'acceptable', 'pretty': 'quite', 'awesome': 'excellent', 'cool': 'impressive',
};

const CASUAL_SWAPS: Record<string, string> = {
  'cannot': "can't", 'will not': "won't", 'do not': "don't", 'is not': "isn't",
  'additionally': 'also', 'furthermore': 'plus', 'however': 'but', 'therefore': 'so',
  'utilize': 'use', 'commence': 'start', 'obtain': 'get', 'require': 'need', 'sufficient': 'enough',
  'approximately': 'about', 'demonstrate': 'show', 'individuals': 'people', 'subsequently': 'then',
  'nevertheless': 'still', 'endeavor': 'try', 'numerous': 'lots of', 'facilitate': 'help',
};

function hashStr(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function paraphrase(text: string, mode: Mode): string {
  if (!text.trim()) return '';

  const sentences = text.split(/(?<=[.!?])\s+/);

  const processed = sentences.map((sentence, si) => {
    let result = sentence;

    // Apply mode-specific transformations
    if (mode === 'formal') {
      for (const [from, to] of Object.entries(FORMAL_SWAPS)) {
        result = result.replace(new RegExp(`\\b${from}\\b`, 'gi'), to);
      }
    } else if (mode === 'casual') {
      for (const [from, to] of Object.entries(CASUAL_SWAPS)) {
        result = result.replace(new RegExp(`\\b${from}\\b`, 'gi'), to);
      }
    }

    // Synonym replacement (more aggressive for creative mode)
    const words = result.split(/(\s+)/);
    const threshold = mode === 'creative' ? 0.6 : mode === 'standard' ? 0.4 : 0.3;

    const replaced = words.map((word, wi) => {
      if (/^\s+$/.test(word)) return word;
      const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
      const syns = SYNONYMS[clean];
      if (!syns || syns.length === 0) return word;

      const hash = hashStr(clean + si + wi + mode);
      if ((hash % 100) / 100 > threshold) return word;

      const syn = syns[hash % syns.length];
      // Preserve case
      const punct = word.replace(/[a-zA-Z]/g, '');
      const letters = word.replace(/[^a-zA-Z]/g, '');
      const isCapitalized = letters[0] === letters[0]?.toUpperCase();
      const final = isCapitalized ? syn.charAt(0).toUpperCase() + syn.slice(1) : syn;
      // Reattach punctuation
      if (word.endsWith(punct) && punct) return final + punct;
      return final;
    });

    result = replaced.join('');

    // Mode-specific sentence modifications
    if (mode === 'shorter') {
      // Remove filler words
      result = result.replace(/\b(very|really|quite|just|actually|basically|simply|literally|definitely|certainly|obviously)\b\s*/gi, '');
      result = result.replace(/\s+/g, ' ').trim();
    }

    if (mode === 'longer' && result.length > 15) {
      // Add connecting phrases
      const connectors = ['In other words, ', 'To elaborate, ', 'More specifically, ', 'That is to say, '];
      if (si > 0 && si % 2 === 0) {
        const c = connectors[hashStr(result) % connectors.length];
        result = c + result.charAt(0).toLowerCase() + result.slice(1);
      }
    }

    if (mode === 'creative') {
      // Restructure some sentences
      if (si % 3 === 0 && result.includes(',')) {
        const parts = result.split(',');
        if (parts.length === 2) {
          result = parts[1].trim() + ', ' + parts[0].trim().toLowerCase();
          result = result.charAt(0).toUpperCase() + result.slice(1);
        }
      }
    }

    return result;
  });

  return processed.join(' ');
}

export function ParaphrasingTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('standard');
  const [copied, setCopied] = useState(false);
  const [version, setVersion] = useState(0); // force re-calc

  const output = useMemo(() => paraphrase(input, mode), [input, mode, version]);

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
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Paraphrasing Tool</h2>
            <p className="text-teal-100 text-xs">Rewrite text in 6 different styles instantly | 100% Free & Private</p>
          </div>
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${mode === m.id
              ? `${m.color} text-white shadow-md scale-105`
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}>
            <div>{m.name}</div>
            <div className={`text-[9px] mt-0.5 ${mode === m.id ? 'text-white/80' : 'text-slate-400'}`}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Input / Output */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Original Text</span>
            <span className="text-[10px] text-slate-400">{wordCount(input)} words</span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter or paste your text here to paraphrase..."
            rows={12}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" /> Paraphrased
              <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-medium text-white ${MODES.find(m => m.id === mode)?.color}`}>{MODES.find(m => m.id === mode)?.name}</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">{wordCount(output)} words</span>
              <button onClick={() => setVersion(v => v + 1)} title="Regenerate"
                className="p-1 text-slate-400 hover:text-primary-600 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Paraphrased text will appear here..."
            rows={12}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 resize-none leading-relaxed focus:outline-none"
          />
          <div className="flex gap-2">
            <button onClick={copy} disabled={!output}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-primary-600 text-white hover:bg-primary-700'} disabled:opacity-40`}>
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Result</>}
            </button>
          </div>
        </div>
      </div>

      {/* Comparison stats */}
      {input && output && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Original</div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{wordCount(input)} words</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Paraphrased</div>
            <div className="text-lg font-bold text-primary-600">{wordCount(output)} words</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Change</div>
            <div className="text-lg font-bold text-emerald-600">
              {wordCount(input) > 0 ? `${Math.round(((wordCount(output) - wordCount(input)) / wordCount(input)) * 100)}%` : '0%'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
