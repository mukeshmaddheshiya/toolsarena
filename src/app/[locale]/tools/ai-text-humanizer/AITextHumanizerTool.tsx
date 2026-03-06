'use client';
import { useState, useMemo, useCallback } from 'react';
import { Copy, Check, RefreshCw, Sparkles, Shield, Zap, Eye, Bot, User, ArrowRight, BarChart3 } from 'lucide-react';

/* ─── Types ─── */
type Intensity = 'light' | 'medium' | 'heavy' | 'aggressive';

const INTENSITIES: { id: Intensity; name: string; desc: string; emoji: string; color: string; bg: string }[] = [
  { id: 'light', name: 'Light', desc: 'Minimal changes', emoji: '1', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  { id: 'medium', name: 'Medium', desc: 'Balanced rewrite', emoji: '2', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
  { id: 'heavy', name: 'Heavy', desc: 'Major restructuring', emoji: '3', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' },
  { id: 'aggressive', name: 'Aggressive', desc: 'Maximum humanization', emoji: '4', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
];

/* ─── AI Phrase Replacements ─── */
const AI_PHRASES: [RegExp, string[]][] = [
  [/\bdelve(?:s)? into\b/gi, ['look at', 'dig into', 'explore', 'break down']],
  [/\bit(?:'|')s important to note that\b/gi, ['keep in mind that', 'worth mentioning —', 'one thing to note:', "here's the thing —"]],
  [/\bit(?:'|')s worth noting that\b/gi, ['thing is,', 'also,', "here's something —", 'by the way,']],
  [/\bin today(?:'|')s (?:world|landscape|environment|era|age)\b/gi, ['these days', 'right now', 'nowadays', 'lately']],
  [/\bin the realm of\b/gi, ['in', 'when it comes to', 'with']],
  [/\blandscape\b/gi, ['space', 'world', 'scene', 'field']],
  [/\bleverage\b/gi, ['use', 'take advantage of', 'tap into', 'make the most of']],
  [/\bfacilitat(?:e|es|ing)\b/gi, ['help with', 'make easier', 'support', 'enable']],
  [/\butiliz(?:e|es|ing)\b/gi, ['use', 'work with', 'rely on', 'put to use']],
  [/\bfurthermore\b/gi, ['plus', 'also', 'on top of that', 'and']],
  [/\bmoreover\b/gi, ['also', 'besides', 'on top of that', 'and']],
  [/\bnevertheless\b/gi, ['still', 'but', 'even so', 'that said']],
  [/\bnonetheless\b/gi, ['still', 'but', 'even so', 'regardless']],
  [/\bconsequently\b/gi, ['so', 'because of this', 'as a result', 'that means']],
  [/\bnotwithstanding\b/gi, ['despite that', 'regardless', 'even so']],
  [/\bin conclusion\b/gi, ['to wrap up', 'all in all', 'bottom line', 'so basically']],
  [/\bin summary\b/gi, ['to sum it up', 'long story short', 'basically', 'in short']],
  [/\bensur(?:e|es|ing)\b/gi, ['make sure', 'see to it', 'guarantee', 'check that']],
  [/\bcommenc(?:e|es|ing)\b/gi, ['start', 'kick off', 'begin', 'get going']],
  [/\bsubsequently\b/gi, ['then', 'after that', 'later', 'next']],
  [/\bpivotal\b/gi, ['key', 'major', 'crucial', 'big']],
  [/\bparamount\b/gi, ['super important', 'critical', 'top priority', 'key']],
  [/\bseamless(?:ly)?\b/gi, ['smooth', 'easy', 'without a hitch', 'effortless']],
  [/\brobust\b/gi, ['strong', 'solid', 'reliable', 'sturdy']],
  [/\bcomprehensive\b/gi, ['thorough', 'complete', 'full', 'all-around']],
  [/\bmeticulous(?:ly)?\b/gi, ['careful', 'detailed', 'thorough', 'precise']],
  [/\bundeniably\b/gi, ['clearly', 'obviously', 'no doubt', 'for sure']],
  [/\boverall\b/gi, ['all things considered', 'in general', 'broadly speaking', 'on the whole']],
  [/\bplethora of\b/gi, ['tons of', 'a lot of', 'plenty of', 'loads of']],
  [/\bmyriad of\b/gi, ['tons of', 'all kinds of', 'lots of', 'countless']],
  [/\bmultifaceted\b/gi, ['complex', 'layered', 'nuanced', 'many-sided']],
  [/\bfoster(?:s|ing)?\b/gi, ['encourage', 'build', 'grow', 'support']],
  [/\bnavigate\b/gi, ['deal with', 'handle', 'work through', 'figure out']],
  [/\bholistic\b/gi, ['complete', 'all-around', 'full-picture', 'well-rounded']],
  [/\bintricate\b/gi, ['complex', 'detailed', 'tricky', 'involved']],
  [/\bunderscore(?:s)?\b/gi, ['highlight', 'show', 'point out', 'stress']],
  [/\btransformative\b/gi, ['game-changing', 'powerful', 'impactful', 'big']],
  [/\binnovative\b/gi, ['creative', 'fresh', 'new', 'cutting-edge']],
  [/\bgroundbreaking\b/gi, ['major', 'huge', 'revolutionary', 'game-changing']],
  [/\bcutting-edge\b/gi, ['latest', 'newest', 'advanced', 'modern']],
  [/\bstate-of-the-art\b/gi, ['latest', 'top-of-the-line', 'modern', 'advanced']],
];

/* ─── Contraction map ─── */
const CONTRACTIONS: [RegExp, string][] = [
  [/\bI am\b/g, "I'm"], [/\bI have\b/g, "I've"], [/\bI will\b/g, "I'll"], [/\bI would\b/g, "I'd"],
  [/\bdo not\b/gi, "don't"], [/\bdoes not\b/gi, "doesn't"], [/\bdid not\b/gi, "didn't"],
  [/\bis not\b/gi, "isn't"], [/\bare not\b/gi, "aren't"], [/\bwas not\b/gi, "wasn't"],
  [/\bwere not\b/gi, "weren't"], [/\bwill not\b/gi, "won't"], [/\bwould not\b/gi, "wouldn't"],
  [/\bcould not\b/gi, "couldn't"], [/\bshould not\b/gi, "shouldn't"], [/\bcan not\b/gi, "can't"],
  [/\bcannot\b/gi, "can't"], [/\bhas not\b/gi, "hasn't"], [/\bhave not\b/gi, "haven't"],
  [/\bit is\b/gi, "it's"], [/\bthat is\b/gi, "that's"], [/\bthere is\b/gi, "there's"],
  [/\blet us\b/gi, "let's"], [/\bthey are\b/gi, "they're"], [/\bwe are\b/gi, "we're"],
  [/\byou are\b/gi, "you're"], [/\bwho is\b/gi, "who's"], [/\bwhat is\b/gi, "what's"],
];

/* ─── Filler & transition injections ─── */
const SENTENCE_STARTERS = [
  'Honestly, ', 'Look, ', 'The thing is, ', 'Here\'s the deal — ', 'So basically, ',
  'In my experience, ', 'From what I\'ve seen, ', 'Truth be told, ', 'Let me put it this way — ',
  'If you ask me, ', 'Real talk — ', 'I think ', 'To be fair, ', 'You know, ',
];

const TRANSITIONS = [
  'And honestly, ', 'But here\'s the thing — ', 'Plus, ', 'That said, ', 'On the flip side, ',
  'Now, ', 'So, ', 'Actually, ', 'Funny enough, ', 'Thing is, ',
];

/* ─── Passive to active patterns ─── */
const PASSIVE_PATTERNS: [RegExp, string][] = [
  [/\bit (?:is|was) (?:widely )?(?:known|believed|thought|considered|recognized) that\b/gi, 'most people think'],
  [/\bcan be (?:seen|found|observed)\b/gi, 'shows up'],
  [/\bshould be (?:noted|mentioned|considered)\b/gi, "you should know"],
  [/\bit can be argued that\b/gi, "you could say"],
  [/\bit is (?:clear|evident|obvious) that\b/gi, "clearly,"],
];

/* ─── Hash helper ─── */
function hash(str: string, seed = 0): number {
  let h = seed;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(arr: T[], str: string, seed = 0): T {
  return arr[hash(str, seed) % arr.length];
}

/* ─── AI Detection Scoring ─── */
function getAIScore(text: string): number {
  if (!text.trim()) return 0;
  let score = 50; // start neutral
  const lower = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());

  // Check for AI markers
  const aiMarkers = [
    'delve', 'leverage', 'facilitate', 'utilize', 'furthermore', 'moreover',
    'nevertheless', 'consequently', 'paramount', 'pivotal', 'comprehensive',
    'meticulous', 'multifaceted', 'foster', 'navigate', 'holistic', 'intricate',
    'underscore', 'transformative', 'innovative', 'groundbreaking', 'cutting-edge',
    'state-of-the-art', 'seamless', 'robust', 'plethora', 'myriad',
    "it's important to note", "it's worth noting", 'in today\'s world',
    'in the realm of', 'in conclusion', 'in summary', 'undeniably',
  ];
  for (const marker of aiMarkers) {
    if (lower.includes(marker)) score += 4;
  }

  // Sentence length uniformity (AI tends to write uniform lengths)
  if (sentences.length > 2) {
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / lengths.length;
    if (variance < 15) score += 8; // very uniform = AI-like
    if (variance > 40) score -= 5; // varied = human-like
  }

  // No contractions = AI-like
  const hasContractions = /(?:'|')(?:s|t|re|ve|ll|d|m)\b/.test(text);
  if (!hasContractions && text.length > 100) score += 10;

  // Overly long sentences
  const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > 25).length;
  score += longSentences * 3;

  // Starts with "In today's..." etc
  if (/^In today/i.test(text)) score += 8;

  // Human markers (contractions, informal words, short sentences)
  const humanMarkers = ["i'm", "i've", "i'll", "i'd", "don't", "doesn't", "can't", "won't", "honestly", "basically", "you know", "kind of", "sort of", "pretty much", "the thing is"];
  for (const marker of humanMarkers) {
    if (lower.includes(marker)) score -= 3;
  }

  // Short sentences mixed in = human
  const shortSentences = sentences.filter(s => s.trim().split(/\s+/).length < 6).length;
  if (shortSentences > 0) score -= shortSentences * 2;

  // Questions = human
  const questions = (text.match(/\?/g) || []).length;
  score -= questions * 3;

  // First person = human
  if (/\bI\b/.test(text)) score -= 5;

  return Math.max(0, Math.min(100, score));
}

/* ─── Main Humanize Function ─── */
function humanize(text: string, intensity: Intensity): string {
  if (!text.trim()) return '';

  let result = text;
  const level = { light: 1, medium: 2, heavy: 3, aggressive: 4 }[intensity];

  // 1. Replace AI phrases
  for (const [pattern, replacements] of AI_PHRASES) {
    result = result.replace(pattern, (match) => {
      const replacement = pick(replacements, match);
      // Preserve capitalization of first letter
      if (match[0] === match[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  // 2. Add contractions (all levels)
  for (const [pattern, replacement] of CONTRACTIONS) {
    result = result.replace(pattern, (match) => {
      // Preserve case of first char
      if (match[0] === match[0].toUpperCase() && match[1] === match[1].toLowerCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  // 3. Fix passive voice (medium+)
  if (level >= 2) {
    for (const [pattern, replacement] of PASSIVE_PATTERNS) {
      result = result.replace(pattern, replacement);
    }
  }

  // 4. Work on sentence level
  const sentences = result.split(/(?<=[.!?])\s+/);
  const processed = sentences.map((sentence, i) => {
    let s = sentence;

    // Remove redundant openers
    s = s.replace(/^(?:Additionally|Furthermore|Moreover|Consequently|Subsequently|Hence|Thus|Therefore|Notably),?\s*/i, (match) => {
      if (level >= 2) {
        const alt = pick(TRANSITIONS, s + i);
        return alt;
      }
      return match;
    });

    // Break up very long sentences (heavy+)
    if (level >= 3) {
      const words = s.split(/\s+/);
      if (words.length > 30) {
        // Find a comma near the middle to split
        const mid = Math.floor(words.length / 2);
        let splitAt = -1;
        for (let j = mid - 5; j <= mid + 5 && j < words.length; j++) {
          if (j > 0 && words[j - 1].endsWith(',')) {
            splitAt = j;
            break;
          }
        }
        if (splitAt > 0) {
          words[splitAt - 1] = words[splitAt - 1].replace(/,$/, '.');
          words[splitAt] = words[splitAt].charAt(0).toUpperCase() + words[splitAt].slice(1);
          s = words.join(' ');
        }
      }
    }

    // Add conversational starters (heavy+ , every few sentences)
    if (level >= 3 && i > 0 && i % 3 === 0 && s.length > 20) {
      const starter = pick(SENTENCE_STARTERS, s + i);
      // Don't double up if sentence already starts conversationally
      if (!/^(?:Look|Honestly|So|But|And|Well|Now|Actually|Thing is)/i.test(s)) {
        s = starter + s.charAt(0).toLowerCase() + s.slice(1);
      }
    }

    // Aggressive: occasionally add short punchy follow-ups
    if (level >= 4 && i > 0 && i % 4 === 0) {
      const punches = ['And that matters.', 'Big difference.', 'Worth keeping in mind.', 'Pretty important.', 'Just saying.', 'Think about that.'];
      s = s + ' ' + pick(punches, s + i);
    }

    return s;
  });

  result = processed.join(' ');

  // 5. Final cleanup
  result = result.replace(/\s{2,}/g, ' ');
  result = result.replace(/\.\s*\./g, '.');
  result = result.replace(/,\s*,/g, ',');

  return result.trim();
}

/* ─── Component ─── */
export function AITextHumanizerTool() {
  const [input, setInput] = useState('');
  const [intensity, setIntensity] = useState<Intensity>('medium');
  const [copied, setCopied] = useState(false);
  const [version, setVersion] = useState(0);

  const output = useMemo(() => humanize(input, intensity), [input, intensity, version]);
  const inputScore = useMemo(() => getAIScore(input), [input]);
  const outputScore = useMemo(() => getAIScore(output), [output]);

  const copy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const wordCount = (t: string) => t ? t.split(/\s+/).filter(Boolean).length : 0;

  const getScoreLabel = (score: number) => {
    if (score >= 70) return { label: 'AI Detected', color: 'text-red-600', bg: 'bg-red-500' };
    if (score >= 45) return { label: 'Likely AI', color: 'text-orange-600', bg: 'bg-orange-500' };
    if (score >= 25) return { label: 'Mixed', color: 'text-yellow-600', bg: 'bg-yellow-500' };
    return { label: 'Human-like', color: 'text-green-600', bg: 'bg-green-500' };
  };

  const inputLabel = getScoreLabel(inputScore);
  const outputLabel = getScoreLabel(outputScore);

  return (
    <div className="space-y-5">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">AI Text Humanizer</h2>
            <p className="text-purple-200 text-xs">Transform AI text into natural, human-written content</p>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Shield, label: '100% Private', desc: 'Nothing leaves your browser' },
          { icon: Zap, label: 'Instant Results', desc: 'Real-time processing' },
          { icon: Eye, label: 'AI Score Check', desc: 'Built-in detection meter' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1" />
            <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{label}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Intensity Selector */}
      <div>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Humanization Intensity</p>
        <div className="grid grid-cols-4 gap-2">
          {INTENSITIES.map(m => (
            <button
              key={m.id}
              onClick={() => setIntensity(m.id)}
              className={`relative p-3 rounded-xl border-2 text-center transition-all ${
                intensity === m.id
                  ? `${m.bg} border-current ${m.color} shadow-sm scale-[1.02]`
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
              }`}
            >
              <div className={`text-lg font-black ${intensity === m.id ? m.color : 'text-slate-300 dark:text-slate-600'}`}>
                {m.emoji}
              </div>
              <div className={`text-xs font-bold mt-1 ${intensity === m.id ? m.color : ''}`}>{m.name}</div>
              <div className="text-[9px] text-slate-400 mt-0.5">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input / Output Panels */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-red-500" />
              AI-Generated Text
            </span>
            <span className="text-[10px] text-slate-400">{wordCount(input)} words</span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your AI-generated text here (from ChatGPT, Gemini, Claude, etc.)..."
            rows={14}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none leading-relaxed placeholder:text-slate-400"
          />
          {/* Input AI Score */}
          {input.trim() && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <BarChart3 className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-slate-500">Input AI Score</span>
                  <span className={`text-[10px] font-bold ${inputLabel.color}`}>{inputLabel.label} ({inputScore}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${inputLabel.bg} rounded-full transition-all duration-500`} style={{ width: `${inputScore}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-green-500" />
              Humanized Text
              <ArrowRight className="w-3 h-3 text-slate-300" />
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${INTENSITIES.find(m => m.id === intensity)?.color} ${INTENSITIES.find(m => m.id === intensity)?.bg} border`}>
                {INTENSITIES.find(m => m.id === intensity)?.name}
              </span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">{wordCount(output)} words</span>
              <button onClick={() => setVersion(v => v + 1)} title="Regenerate"
                className="p-1 text-slate-400 hover:text-purple-600 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Humanized text will appear here..."
            rows={14}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-green-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 resize-none leading-relaxed focus:outline-none"
          />
          {/* Output AI Score */}
          {output.trim() && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
              <BarChart3 className="w-4 h-4 text-green-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-slate-500">Output AI Score</span>
                  <span className={`text-[10px] font-bold ${outputLabel.color}`}>{outputLabel.label} ({outputScore}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${outputLabel.bg} rounded-full transition-all duration-500`} style={{ width: `${outputScore}%` }} />
                </div>
              </div>
            </div>
          )}
          {/* Copy button */}
          <div className="flex gap-2">
            <button onClick={copy} disabled={!output}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                copied
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-600/20'
              } disabled:opacity-40 disabled:shadow-none`}>
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Humanized Text</>}
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Stats */}
      {input && output && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-3 text-center">
            <div className="text-[10px] text-red-500/70 uppercase tracking-wider font-medium">Input Score</div>
            <div className={`text-2xl font-black ${inputLabel.color}`}>{inputScore}%</div>
            <div className={`text-[10px] font-bold ${inputLabel.color}`}>{inputLabel.label}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl p-3 text-center">
            <div className="text-[10px] text-green-500/70 uppercase tracking-wider font-medium">Output Score</div>
            <div className={`text-2xl font-black ${outputLabel.color}`}>{outputScore}%</div>
            <div className={`text-[10px] font-bold ${outputLabel.color}`}>{outputLabel.label}</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl p-3 text-center">
            <div className="text-[10px] text-purple-500/70 uppercase tracking-wider font-medium">Score Reduced</div>
            <div className="text-2xl font-black text-purple-600">
              {inputScore > outputScore ? `-${inputScore - outputScore}` : '0'}%
            </div>
            <div className="text-[10px] font-bold text-purple-500">Points dropped</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500/70 uppercase tracking-wider font-medium">Word Change</div>
            <div className="text-2xl font-black text-slate-700 dark:text-slate-300">
              {wordCount(input) > 0 ? `${Math.round(((wordCount(output) - wordCount(input)) / wordCount(input)) * 100)}%` : '0%'}
            </div>
            <div className="text-[10px] font-bold text-slate-500">
              {wordCount(output) >= wordCount(input) ? 'Words added' : 'Words reduced'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
