'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Copy, Check, Trash2, RotateCcw, Lightbulb, Target, Zap, HelpCircle, Hash, Eye, Clock, ChevronDown } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */

type Platform = 'youtube' | 'instagram' | 'twitter' | 'blog' | 'email' | 'tiktok' | 'linkedin';

interface PlatformConfig {
  id: Platform;
  name: string;
  icon: string;
  idealMin: number;
  idealMax: number;
  unit: 'chars' | 'words';
  emojiBonus: boolean;
  tips: string;
}

interface ScoreResult {
  overall: number;
  power: number;
  emotion: number;
  clarity: number;
  curiosity: number;
  specificity: number;
  suggestions: string[];
}

interface HistoryEntry {
  text: string;
  platform: Platform;
  score: number;
  timestamp: number;
}

const PLATFORMS: PlatformConfig[] = [
  { id: 'youtube', name: 'YouTube Title', icon: '▶', idealMin: 40, idealMax: 65, unit: 'chars', emojiBonus: false, tips: 'Keep 40-65 chars. Front-load keywords.' },
  { id: 'instagram', name: 'Instagram Caption', icon: '📷', idealMin: 10, idealMax: 40, unit: 'words', emojiBonus: true, tips: 'First line is the hook. Use emojis.' },
  { id: 'twitter', name: 'Twitter/X Post', icon: '𝕏', idealMin: 70, idealMax: 140, unit: 'chars', emojiBonus: true, tips: 'Aim for 70-140 chars. Be punchy.' },
  { id: 'blog', name: 'Blog Headline', icon: 'B', idealMin: 50, idealMax: 70, unit: 'chars', emojiBonus: false, tips: '50-70 chars. Include primary keyword.' },
  { id: 'email', name: 'Email Subject', icon: '✉', idealMin: 30, idealMax: 50, unit: 'chars', emojiBonus: false, tips: '30-50 chars. Personalize when possible.' },
  { id: 'tiktok', name: 'TikTok Hook', icon: '♪', idealMin: 5, idealMax: 15, unit: 'words', emojiBonus: true, tips: 'Under 15 words. Instant curiosity.' },
  { id: 'linkedin', name: 'LinkedIn Post', icon: 'in', idealMin: 10, idealMax: 30, unit: 'words', emojiBonus: false, tips: 'Professional tone. Story hooks work.' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   POWER WORDS DATABASE (200+)
   ═══════════════════════════════════════════════════════════════════════════ */

const POWER_WORDS = {
  urgency: ['now', 'today', 'hurry', 'limited', 'fast', 'quick', 'instantly', 'immediately', 'urgent', 'deadline', 'last chance', 'running out', 'before', 'ending', 'soon', 'final', 'rush', 'act now', 'dont wait', 'while', 'expires', 'countdown', 'tonight', 'closing', 'once'],
  emotional: ['shocking', 'unbelievable', 'incredible', 'amazing', 'mind-blowing', 'insane', 'terrifying', 'heartbreaking', 'jaw-dropping', 'devastating', 'stunning', 'disturbing', 'horrifying', 'beautiful', 'hilarious', 'ridiculous', 'disgusting', 'brilliant', 'extraordinary', 'outrageous', 'phenomenal', 'breathtaking', 'unforgettable', 'epic', 'legendary', 'crazy', 'wild', 'brutal', 'savage', 'insanely'],
  value: ['free', 'proven', 'guaranteed', 'easy', 'simple', 'effortless', 'powerful', 'ultimate', 'essential', 'complete', 'best', 'top', 'premium', 'exclusive', 'bonus', 'save', 'discount', 'cheap', 'affordable', 'valuable', 'priceless', 'profitable', 'rewarding', 'worth', 'bargain', 'hack', 'cheat code', 'shortcut', 'blueprint', 'framework', 'formula', 'system', 'method', 'strategy', 'technique'],
  curiosity: ['hidden', 'revealed', 'truth', 'secret', 'mystery', 'unknown', 'discovered', 'exposed', 'untold', 'underground', 'confidential', 'classified', 'forbidden', 'banned', 'censored', 'controversial', 'suppressed', 'leaked', 'insider', 'behind the scenes', 'little-known', 'overlooked', 'underrated', 'unexpected', 'surprising', 'strange', 'weird', 'bizarre', 'unusual', 'rare'],
  authority: ['expert', 'research', 'study', 'science', 'data', 'proof', 'evidence', 'backed', 'certified', 'official', 'professional', 'tested', 'verified', 'confirmed', 'according', 'results', 'statistics', 'analysis', 'report', 'survey'],
  action: ['discover', 'learn', 'master', 'unlock', 'transform', 'boost', 'skyrocket', 'dominate', 'crush', 'explode', 'supercharge', 'maximize', 'optimize', 'accelerate', 'upgrade', 'revolutionize', 'conquer', 'achieve', 'build', 'create', 'launch', 'grow', 'double', 'triple', 'eliminate', 'destroy', 'stop', 'avoid', 'escape', 'overcome'],
  negative: ['never', 'stop', 'avoid', 'mistake', 'wrong', 'fail', 'worst', 'dangerous', 'warning', 'risk', 'scam', 'trap', 'lie', 'myth', 'fake', 'toxic', 'deadly', 'painful', 'ruining', 'killing', 'destroying', 'losing', 'wasting'],
};

const ALL_POWER_WORDS = Object.values(POWER_WORDS).flat();

const CURIOSITY_PATTERNS = [
  /\?$/, /\?[^a-z]*$/i, /what\s+(happens|if|is|are|was|were|do|does|did|would|could|should)/i,
  /how\s+(to|i|do|does|did|can|could|would|many|much|long)/i, /why\s+(do|does|did|is|are|was|were|you|we|they|most|this)/i,
  /who\s+(is|are|was|were|would|could|should|did)/i, /when\s+(did|do|does|will|should|is|was)/i,
  /did\s+you\s+know/i, /you\s+won'?t\s+believe/i, /guess\s+what/i, /wait\s+(till|until|for)/i,
  /here'?s?\s+(why|what|how|the)/i, /the\s+reason\s+(why|is)/i, /this\s+is\s+(why|how|what)/i,
  /what\s+no\s+one\s+tells/i, /nobody\s+(talks|knows|told)/i, /but\s+then/i,
  /plot\s+twist/i, /turns?\s+out/i, /what\s+happened\s+next/i, /the\s+truth\s+about/i,
  /I\s+was\s+wrong/i, /I\s+can'?t\s+believe/i, /watch\s+(this|till|until|what)/i,
];

const GENERIC_PHRASES = [
  'in this video', 'in today\'s video', 'hey guys', 'hi everyone', 'welcome back',
  'let me show you', 'i want to talk', 'check this out', 'click here', 'subscribe',
  'in this article', 'in this post', 'read more', 'learn more', 'continue reading',
  'good morning', 'happy monday', 'new post', 'new video', 'link in bio',
];

const PASSIVE_PATTERNS = [
  /\b(is|are|was|were|be|been|being)\s+(being\s+)?\w+ed\b/i,
  /\bget(s|ting)?\s+\w+ed\b/i,
];

const EXAMPLE_HOOK = "Check out my new video about productivity tips for working from home this year";

/* ═══════════════════════════════════════════════════════════════════════════
   SCORING ENGINE
   ═══════════════════════════════════════════════════════════════════════════ */

function scoreText(text: string, platform: PlatformConfig): ScoreResult {
  const trimmed = text.trim();
  if (!trimmed) return { overall: 0, power: 0, emotion: 0, clarity: 0, curiosity: 0, specificity: 0, suggestions: [] };

  const lower = trimmed.toLowerCase();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = trimmed.length;
  const suggestions: string[] = [];

  // ── 1. POWER WORDS (0-20) ──
  let powerScore = 0;
  const foundPower: string[] = [];
  for (const word of ALL_POWER_WORDS) {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lower)) {
      foundPower.push(word);
    }
  }
  const powerRatio = foundPower.length / Math.max(wordCount, 1);
  powerScore = Math.min(20, Math.round(foundPower.length * 4 + powerRatio * 30));
  if (foundPower.length === 0) {
    const cats = Object.entries(POWER_WORDS);
    const cat = cats[Math.floor(Math.random() * 3)];
    const examples = cat[1].slice(0, 3).map(w => `"${w}"`).join(', ');
    suggestions.push(`Add a power word like ${examples} to grab attention instantly.`);
  }

  // ── 2. EMOTIONAL TRIGGER (0-20) ──
  let emotionScore = 0;
  const emotionalWords = [...POWER_WORDS.emotional, ...POWER_WORDS.negative];
  let emotionCount = 0;
  for (const w of emotionalWords) {
    if (new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lower)) emotionCount++;
  }
  const hasExclamation = /!/.test(trimmed);
  const capsWords = words.filter(w => w.length > 2 && w === w.toUpperCase() && /[A-Z]/.test(w));
  const capsRatio = capsWords.length / Math.max(wordCount, 1);
  emotionScore = Math.min(20, emotionCount * 5 + (hasExclamation ? 2 : 0) + (capsRatio > 0 && capsRatio < 0.4 ? 3 : 0));
  if (capsRatio > 0.5) {
    emotionScore = Math.max(0, emotionScore - 5);
    suggestions.push('Too many ALL CAPS words looks spammy. Use caps on 1-2 key words only.');
  }
  if (emotionCount === 0 && !hasExclamation) {
    suggestions.push('Add an emotional trigger word like "shocking", "incredible", or "devastating" to create impact.');
  }

  // ── 3. CLARITY (0-20) ──
  let clarityScore = 10;
  const measure = platform.unit === 'chars' ? charCount : wordCount;
  const { idealMin, idealMax } = platform;

  if (measure >= idealMin && measure <= idealMax) {
    clarityScore = 18;
  } else if (measure < idealMin) {
    const deficit = (idealMin - measure) / idealMin;
    clarityScore = Math.max(4, Math.round(18 - deficit * 20));
    suggestions.push(`Your text is short for ${platform.name}. Aim for ${idealMin}-${idealMax} ${platform.unit}.`);
  } else {
    const excess = (measure - idealMax) / idealMax;
    clarityScore = Math.max(4, Math.round(18 - excess * 15));
    suggestions.push(`Your text is long for ${platform.name}. Trim to ${idealMin}-${idealMax} ${platform.unit} for best engagement.`);
  }

  // Passive voice penalty
  const passiveCount = PASSIVE_PATTERNS.filter(p => p.test(trimmed)).length;
  if (passiveCount > 0) {
    clarityScore = Math.max(0, clarityScore - passiveCount * 2);
    suggestions.push('Use active voice for more punch. "X does Y" is stronger than "Y is done by X".');
  }

  // Average word length check
  const avgWordLen = words.reduce((s, w) => s + w.replace(/[^a-zA-Z]/g, '').length, 0) / Math.max(wordCount, 1);
  if (avgWordLen > 7) {
    clarityScore = Math.max(0, clarityScore - 2);
    suggestions.push('Use shorter, simpler words. Hooks should be instantly understandable.');
  }
  clarityScore = Math.min(20, clarityScore + 2); // base boost

  // ── 4. CURIOSITY GAP (0-20) ──
  let curiosityScore = 0;
  let curiosityMatches = 0;
  for (const pat of CURIOSITY_PATTERNS) {
    if (pat.test(trimmed)) curiosityMatches++;
  }
  curiosityScore = Math.min(20, curiosityMatches * 5);

  // Ellipsis or dash for incomplete thought
  if (/\.{2,}|—|--|\.\.\.$/.test(trimmed)) {
    curiosityScore = Math.min(20, curiosityScore + 4);
  }

  // Open loop patterns
  if (/\b(part\s*\d|step\s*1|reason\s*#?\d|tip\s*#?\d)\b/i.test(trimmed)) {
    curiosityScore = Math.min(20, curiosityScore + 3);
  }

  if (curiosityScore < 6) {
    suggestions.push('Create a curiosity gap: ask a question, use "Here\'s why...", or hint at a reveal.');
  }

  // ── 5. SPECIFICITY (0-20) ──
  let specificityScore = 0;
  const hasNumbers = /\d+/.test(trimmed);
  const numberCount = (trimmed.match(/\d+/g) || []).length;
  if (hasNumbers) specificityScore += Math.min(10, numberCount * 4);

  // Named entities (capitalized words that aren't sentence starters)
  const midCaps = words.slice(1).filter(w => /^[A-Z][a-z]/.test(w) && w.length > 2);
  specificityScore += Math.min(6, midCaps.length * 3);

  // Specific patterns: year, percentage, dollar, time
  if (/\b20\d{2}\b/.test(trimmed)) specificityScore += 2;
  if (/%|\bpercent\b/i.test(trimmed)) specificityScore += 2;
  if (/\$|₹|€|£/.test(trimmed)) specificityScore += 2;
  if (/\b\d+\s*(min|hour|day|week|month|second|sec|hr)/i.test(trimmed)) specificityScore += 3;
  specificityScore = Math.min(20, specificityScore);

  if (!hasNumbers) {
    suggestions.push('Add a number for specificity: "Top 5...", "3 ways...", or "in 24 hours".');
  }

  // ── GENERIC PHRASE PENALTY ──
  let genericPenalty = 0;
  for (const phrase of GENERIC_PHRASES) {
    if (lower.includes(phrase)) genericPenalty += 4;
  }

  // ── EMOJI CHECK ──
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{FE0F}]/gu;
  const emojiCount = (trimmed.match(emojiRegex) || []).length;
  if (platform.emojiBonus && emojiCount > 0) {
    emotionScore = Math.min(20, emotionScore + Math.min(3, emojiCount));
  } else if (!platform.emojiBonus && emojiCount > 2) {
    clarityScore = Math.max(0, clarityScore - 2);
    suggestions.push(`Limit emojis for ${platform.name}. Keep it professional and clean.`);
  }

  // ── OVERALL ──
  const raw = powerScore + emotionScore + clarityScore + curiosityScore + specificityScore;
  const overall = Math.max(0, Math.min(100, raw - genericPenalty));

  // Trim suggestions to 5
  const finalSuggestions = suggestions.slice(0, 5);

  // If score is high but we have few suggestions, add a praise
  if (overall > 70 && finalSuggestions.length < 2) {
    finalSuggestions.push('Great hook! Your text has strong engagement potential.');
  }

  return { overall, power: powerScore, emotion: emotionScore, clarity: clarityScore, curiosity: curiosityScore, specificity: specificityScore, suggestions: finalSuggestions };
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOCAL STORAGE HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'hook-scorer-history';

function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(entries: HistoryEntry[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 5))); } catch {}
}

/* ═══════════════════════════════════════════════════════════════════════════
   CIRCULAR SCORE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function CircularScore({ score, size = 140 }: { score: number; size?: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score < 40 ? '#ef4444' : score < 70 ? '#f59e0b' : '#22c55e';
  const label = score < 40 ? 'Weak' : score < 70 ? 'Good' : 'Strong';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DIMENSION BAR COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function DimensionBar({ label, score, max = 20, icon }: { label: string; score: number; max?: number; icon: React.ReactNode }) {
  const pct = Math.min(100, (score / max) * 100);
  const color = pct < 40 ? 'bg-red-500' : pct < 70 ? 'bg-amber-500' : 'bg-green-500';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
          {icon}{label}
        </span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">{score}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function HookCaptionScorerTool() {
  const [text, setText] = useState('');
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => { setHistory(loadHistory()); }, []);

  const platformConfig = useMemo(() => PLATFORMS.find(p => p.id === platform)!, [platform]);
  const result = useMemo(() => scoreText(text, platformConfig), [text, platformConfig]);

  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text]);
  const wordCount = text.trim() ? words.length : 0;
  const charCount = text.length;

  const lengthValue = platformConfig.unit === 'chars' ? charCount : wordCount;
  const lengthInRange = lengthValue >= platformConfig.idealMin && lengthValue <= platformConfig.idealMax;
  const lengthLabel = `${lengthValue} ${platformConfig.unit} (ideal: ${platformConfig.idealMin}-${platformConfig.idealMax})`;

  const handleSaveToHistory = useCallback(() => {
    if (!text.trim() || result.overall === 0) return;
    const entry: HistoryEntry = { text: text.trim().slice(0, 200), platform, score: result.overall, timestamp: Date.now() };
    const updated = [entry, ...history.filter(h => h.text !== entry.text)].slice(0, 5);
    setHistory(updated);
    saveHistory(updated);
  }, [text, platform, result.overall, history]);

  const handleTryExample = useCallback(() => {
    setText(EXAMPLE_HOOK);
  }, []);

  const handleCopyReport = useCallback(() => {
    const report = [
      `Hook/Caption Score Report`,
      `========================`,
      `Platform: ${platformConfig.name}`,
      `Text: "${text.trim()}"`,
      ``,
      `Overall Score: ${result.overall}/100`,
      `  Power Words: ${result.power}/20`,
      `  Emotional Trigger: ${result.emotion}/20`,
      `  Clarity: ${result.clarity}/20`,
      `  Curiosity Gap: ${result.curiosity}/20`,
      `  Specificity: ${result.specificity}/20`,
      ``,
      `Suggestions:`,
      ...result.suggestions.map((s, i) => `  ${i + 1}. ${s}`),
      ``,
      `Generated by ToolsArena.in`,
    ].join('\n');
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text, platformConfig, result]);

  const handleClear = useCallback(() => {
    setText('');
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const handleRestoreFromHistory = useCallback((entry: HistoryEntry) => {
    setText(entry.text);
    setPlatform(entry.platform);
    setShowHistory(false);
  }, []);

  // Auto-save to history on meaningful change (debounce via blur)
  const handleBlur = useCallback(() => { handleSaveToHistory(); }, [handleSaveToHistory]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ── HEADER ── */}
      <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 dark:border-amber-800/50 dark:from-amber-950/30 dark:to-yellow-950/20">
        <h2 className="flex items-center gap-2 text-lg font-bold text-amber-900 dark:text-amber-100">
          <Target className="h-5 w-5 text-amber-600" />
          Hook & Caption Scorer
        </h2>
        <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-200/70">
          Score your hooks, captions, and headlines on 5 dimensions. Get actionable suggestions to boost engagement.
        </p>
      </div>

      {/* ── PLATFORM SELECTOR ── */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Platform Context</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => setPlatform(p.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all
                ${platform === p.id
                  ? 'border-amber-400 bg-amber-100 text-amber-900 shadow-sm dark:border-amber-600 dark:bg-amber-900/40 dark:text-amber-100'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:bg-amber-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-amber-700 dark:hover:bg-amber-950/30'
                }`}>
              <span className="text-base leading-none">{p.icon}</span>
              <span className="hidden sm:inline">{p.name}</span>
              <span className="sm:hidden">{p.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{platformConfig.tips}</p>
      </div>

      {/* ── INPUT + SCORES GRID ── */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* LEFT: Textarea (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="relative">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onBlur={handleBlur}
              placeholder="Type or paste your hook, caption, or headline here..."
              rows={5}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-amber-500 resize-y"
            />
          </div>

          {/* Counts bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-gray-500 dark:text-gray-400">{wordCount} words</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-gray-500 dark:text-gray-400">{charCount} characters</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className={lengthInRange ? 'font-medium text-green-600 dark:text-green-400' : 'font-medium text-amber-600 dark:text-amber-400'}>
              {lengthLabel}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button onClick={handleTryExample}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-900/40">
              <Lightbulb className="h-3.5 w-3.5" /> Try Example
            </button>
            <button onClick={handleCopyReport} disabled={!text.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy Report'}
            </button>
            <button onClick={handleClear} disabled={!text.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
          </div>

          {/* ── SUGGESTIONS ── */}
          {result.suggestions.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800/40 dark:bg-amber-950/20">
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber-900 dark:text-amber-200">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                Suggestions to Improve
              </h3>
              <ul className="space-y-1.5">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-amber-800 dark:text-amber-300/90">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-800 dark:bg-amber-800 dark:text-amber-200">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT: Score Panel (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Circular overall score */}
          <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Overall Score</span>
            <CircularScore score={result.overall} />
          </div>

          {/* Dimension breakdown */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Score Breakdown</span>
            <DimensionBar label="Power Words" score={result.power} icon={<Zap className="h-3.5 w-3.5 text-amber-500" />} />
            <DimensionBar label="Emotional Trigger" score={result.emotion} icon={<Target className="h-3.5 w-3.5 text-red-500" />} />
            <DimensionBar label="Clarity" score={result.clarity} icon={<Eye className="h-3.5 w-3.5 text-blue-500" />} />
            <DimensionBar label="Curiosity Gap" score={result.curiosity} icon={<HelpCircle className="h-3.5 w-3.5 text-purple-500" />} />
            <DimensionBar label="Specificity" score={result.specificity} icon={<Hash className="h-3.5 w-3.5 text-green-500" />} />
          </div>
        </div>
      </div>

      {/* ── HISTORY ── */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <button onClick={() => setShowHistory(!showHistory)}
          className="flex w-full items-center justify-between px-4 py-3 text-left">
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Clock className="h-4 w-4 text-gray-400" />
            Recent Scores ({history.length})
          </span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
        </button>

        {showHistory && (
          <div className="border-t border-gray-100 dark:border-gray-700">
            {history.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">No history yet. Score a hook to see it here.</p>
            ) : (
              <>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {history.map((entry, i) => {
                    const scoreColor = entry.score < 40 ? 'text-red-500' : entry.score < 70 ? 'text-amber-500' : 'text-green-500';
                    const plat = PLATFORMS.find(p => p.id === entry.platform);
                    return (
                      <button key={i} onClick={() => handleRestoreFromHistory(entry)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-750">
                        <span className={`text-lg font-bold tabular-nums ${scoreColor}`}>{entry.score}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-gray-800 dark:text-gray-200">{entry.text}</p>
                          <p className="text-xs text-gray-400">{plat?.name} &middot; {new Date(entry.timestamp).toLocaleDateString()}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-gray-100 px-4 py-2 dark:border-gray-700">
                  <button onClick={handleClearHistory}
                    className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400">
                    <Trash2 className="h-3 w-3" /> Clear History
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
