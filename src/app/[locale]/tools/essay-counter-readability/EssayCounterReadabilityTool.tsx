'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Copy,
  Download,
  BookOpen,
  BarChart3,
  FileText,
  Clock,
  Mic,
  Type,
  Hash,
  AlignLeft,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  History,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

/* ─── Types ─── */
interface ReadabilityScores {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gunningFog: number;
  colemanLiau: number;
  smog: number;
  ari: number;
}

interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  speakingTime: string;
  avgWordLength: number;
  avgSentenceLength: number;
  longestSentence: string;
  shortestSentence: string;
  uniqueWords: number;
  vocabularyRichness: number;
  syllableCount: number;
}

interface WordFrequency {
  word: string;
  count: number;
}

interface SentenceLengthBucket {
  range: string;
  count: number;
}

interface WritingSuggestion {
  type: 'warning' | 'info' | 'success';
  message: string;
}

interface HistoryEntry {
  id: string;
  timestamp: number;
  preview: string;
  wordCount: number;
  fleschScore: number;
}

/* ─── Constants ─── */
const STOP_WORDS = new Set([
  'the','be','to','of','and','a','in','that','have','i','it','for','not','on',
  'with','he','as','you','do','at','this','but','his','by','from','they','we',
  'say','her','she','or','an','will','my','one','all','would','there','their',
  'what','so','up','out','if','about','who','get','which','go','me','when',
  'make','can','like','time','no','just','him','know','take','people','into',
  'year','your','good','some','could','them','see','other','than','then','now',
  'look','only','come','its','over','think','also','back','after','use','two',
  'how','our','work','first','well','way','even','new','want','because','any',
  'these','give','day','most','us','is','are','was','were','been','has','had',
  'did','does','am','being','very','much','more','many','such','each','own',
]);

const SAMPLE_ESSAY = `The art of effective writing is a skill that transcends professional boundaries and personal interests. Whether composing a formal business proposal, crafting a compelling narrative, or simply expressing thoughts in a journal, the ability to communicate clearly through written words remains one of the most valuable competencies in modern society.

Good writing begins with understanding your audience. A piece written for academic peers will naturally differ in tone, vocabulary, and structure from one intended for a general readership. The most skilled writers adapt their style seamlessly, shifting between registers without losing their authentic voice. This adaptability is not merely a technical skill but an empathetic one, requiring the writer to consider perspectives beyond their own.

Clarity should always be the primary objective. Complex ideas need not be expressed in convoluted language. In fact, the greatest thinkers throughout history have often been those who could distill profound concepts into accessible prose. Albert Einstein reportedly said that if you cannot explain something simply, you do not understand it well enough. This principle applies directly to writing.

Structure provides the skeleton upon which good writing is built. Paragraphs should flow logically from one to the next, with transitions that guide the reader through the argument or narrative. Each paragraph should contain a central idea, supported by evidence or elaboration. Without this organizational framework, even the most brilliant insights can become lost in a sea of disconnected thoughts.

Revision is where good writing becomes great writing. The first draft captures ideas; subsequent revisions refine them. Professional authors often describe their revision process as more important than the initial composition. During revision, writers can identify redundancies, strengthen weak arguments, improve word choices, and ensure consistency in tone and style.

The digital age has transformed how we write and consume text. Attention spans have shortened, making conciseness more important than ever. Yet the fundamental principles of good writing remain unchanged. Whether carved in stone, printed on paper, or displayed on a screen, effective communication through writing requires thoughtfulness, practice, and a genuine desire to connect with readers.

In conclusion, writing well is not an innate talent reserved for a chosen few. It is a craft that can be developed through dedication, practice, and a willingness to learn from both successes and failures. The tools and mediums may evolve, but the power of well-chosen words to inform, persuade, and inspire will endure for generations to come.`;

const TABS = ['overview', 'readability', 'frequency', 'suggestions'] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  overview: 'Overview',
  readability: 'Readability',
  frequency: 'Word Frequency',
  suggestions: 'Suggestions',
};

const TAB_ICONS: Record<Tab, typeof BookOpen> = {
  overview: BarChart3,
  readability: BookOpen,
  frequency: Hash,
  suggestions: Sparkles,
};

/* ─── Syllable Counter ─── */
function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 2) return 1;

  let count = 0;
  const vowels = 'aeiouy';
  let prevVowel = false;

  for (let i = 0; i < w.length; i++) {
    const isVowel = vowels.includes(w[i]);
    if (isVowel && !prevVowel) count++;
    prevVowel = isVowel;
  }

  // Silent e at end
  if (w.endsWith('e') && !w.endsWith('le') && count > 1) count--;
  // -le ending adds a syllable if preceded by consonant
  if (w.endsWith('le') && w.length > 2 && !vowels.includes(w[w.length - 3])) {
    // already counted above in most cases
  }
  // Ensure at least 1
  if (count === 0) count = 1;

  return count;
}

function isComplexWord(word: string): boolean {
  return countSyllables(word) >= 3;
}

/* ─── Analysis Functions ─── */
function splitSentences(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .replace(/([.!?])\s+/g, '$1|')
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function getWords(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function computeStats(text: string): TextStats {
  const words = getWords(text);
  const sentences = splitSentences(text);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  const wordCount = words.length;
  const sentenceCount = Math.max(sentences.length, 1);
  const paragraphCount = Math.max(paragraphs.length, text.trim() ? 1 : 0);

  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const totalWordChars = words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, '').length, 0);

  const avgWordLength = wordCount > 0 ? totalWordChars / wordCount : 0;
  const avgSentenceLength = wordCount > 0 ? wordCount / sentenceCount : 0;

  const sentencesByLength = sentences.map((s) => ({
    text: s,
    wordCount: getWords(s).length,
  }));
  const longest =
    sentencesByLength.length > 0
      ? sentencesByLength.reduce((a, b) => (a.wordCount >= b.wordCount ? a : b))
      : { text: '', wordCount: 0 };
  const shortest =
    sentencesByLength.length > 0
      ? sentencesByLength.reduce((a, b) => (a.wordCount <= b.wordCount ? a : b))
      : { text: '', wordCount: 0 };

  const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z']/g, ''));
  const uniqueWords = new Set(lowerWords).size;
  const vocabularyRichness = wordCount > 0 ? uniqueWords / wordCount : 0;

  const readMinutes = wordCount / 200;
  const speakMinutes = wordCount / 130;

  const formatTime = (mins: number): string => {
    if (mins < 1) return `${Math.ceil(mins * 60)} sec`;
    const m = Math.floor(mins);
    const s = Math.round((mins - m) * 60);
    return s > 0 ? `${m} min ${s} sec` : `${m} min`;
  };

  return {
    words: wordCount,
    characters,
    charactersNoSpaces,
    sentences: sentences.length,
    paragraphs: paragraphCount,
    readingTime: formatTime(readMinutes),
    speakingTime: formatTime(speakMinutes),
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    longestSentence: longest.text,
    shortestSentence: shortest.text,
    uniqueWords,
    vocabularyRichness: Math.round(vocabularyRichness * 1000) / 1000,
    syllableCount: totalSyllables,
  };
}

function computeReadability(text: string, stats: TextStats): ReadabilityScores {
  const words = getWords(text);
  const wordCount = Math.max(stats.words, 1);
  const sentenceCount = Math.max(stats.sentences, 1);
  const syllableCount = stats.syllableCount;
  const charCount = stats.charactersNoSpaces;

  const complexWords = words.filter(isComplexWord).length;
  const polysyllables = words.filter((w) => countSyllables(w) >= 3).length;

  // Flesch Reading Ease
  const fleschReadingEase =
    206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);

  // Flesch-Kincaid Grade Level
  const fleschKincaidGrade =
    0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;

  // Gunning Fog Index
  const gunningFog = 0.4 * (wordCount / sentenceCount + 100 * (complexWords / wordCount));

  // Coleman-Liau Index
  const L = (charCount / wordCount) * 100;
  const S = (sentenceCount / wordCount) * 100;
  const colemanLiau = 0.0588 * L - 0.296 * S - 15.8;

  // SMOG
  const smog = 3 + Math.sqrt((polysyllables * 30) / sentenceCount);

  // ARI
  const ari = 4.71 * (charCount / wordCount) + 0.5 * (wordCount / sentenceCount) - 21.43;

  return {
    fleschReadingEase: Math.round(Math.max(0, Math.min(100, fleschReadingEase)) * 10) / 10,
    fleschKincaidGrade: Math.round(Math.max(0, fleschKincaidGrade) * 10) / 10,
    gunningFog: Math.round(Math.max(0, gunningFog) * 10) / 10,
    colemanLiau: Math.round(Math.max(0, colemanLiau) * 10) / 10,
    smog: Math.round(Math.max(0, smog) * 10) / 10,
    ari: Math.round(Math.max(0, ari) * 10) / 10,
  };
}

function getWordFrequency(text: string): WordFrequency[] {
  const words = getWords(text);
  const freq = new Map<string, number>();
  for (const w of words) {
    const lower = w.toLowerCase().replace(/[^a-z']/g, '');
    if (lower.length < 2 || STOP_WORDS.has(lower)) continue;
    freq.set(lower, (freq.get(lower) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));
}

function getSentenceLengthDistribution(text: string): SentenceLengthBucket[] {
  const sentences = splitSentences(text);
  const buckets: Record<string, number> = {
    '1-5': 0,
    '6-10': 0,
    '11-15': 0,
    '16-20': 0,
    '21-25': 0,
    '26-30': 0,
    '31+': 0,
  };
  for (const s of sentences) {
    const wc = getWords(s).length;
    if (wc <= 5) buckets['1-5']++;
    else if (wc <= 10) buckets['6-10']++;
    else if (wc <= 15) buckets['11-15']++;
    else if (wc <= 20) buckets['16-20']++;
    else if (wc <= 25) buckets['21-25']++;
    else if (wc <= 30) buckets['26-30']++;
    else buckets['31+']++;
  }
  return Object.entries(buckets).map(([range, count]) => ({ range, count }));
}

function getWritingSuggestions(text: string, stats: TextStats): WritingSuggestion[] {
  const suggestions: WritingSuggestion[] = [];
  const sentences = splitSentences(text);

  // Long sentences
  const longSentences = sentences.filter((s) => getWords(s).length > 30);
  if (longSentences.length > 0) {
    suggestions.push({
      type: 'warning',
      message: `${longSentences.length} sentence${longSentences.length > 1 ? 's' : ''} exceed${longSentences.length === 1 ? 's' : ''} 30 words. Consider breaking them into shorter, more digestible sentences.`,
    });
  }

  // Very short sentences (may be fragments)
  const veryShort = sentences.filter((s) => getWords(s).length <= 2 && getWords(s).length > 0);
  if (veryShort.length > 2) {
    suggestions.push({
      type: 'info',
      message: `Found ${veryShort.length} very short sentences (1-2 words). While effective for emphasis, too many can fragment your writing.`,
    });
  }

  // Passive voice hints
  const passivePatterns = /\b(is|are|was|were|been|being)\s+(being\s+)?\w+ed\b/gi;
  const passiveMatches = text.match(passivePatterns);
  if (passiveMatches && passiveMatches.length > 0) {
    suggestions.push({
      type: 'info',
      message: `Detected approximately ${passiveMatches.length} possible passive voice construction${passiveMatches.length > 1 ? 's' : ''}. Consider using active voice for more direct, engaging writing.`,
    });
  }

  // Overused words
  const freq = getWordFrequency(text);
  const overused = freq.filter((f) => f.count >= 5 && stats.words > 50);
  if (overused.length > 0) {
    const wordList = overused.slice(0, 5).map((f) => `"${f.word}" (${f.count}x)`).join(', ');
    suggestions.push({
      type: 'warning',
      message: `Frequently repeated words: ${wordList}. Consider using synonyms for variety.`,
    });
  }

  // Vocabulary richness
  if (stats.vocabularyRichness < 0.4 && stats.words > 100) {
    suggestions.push({
      type: 'warning',
      message: `Vocabulary richness is low (${(stats.vocabularyRichness * 100).toFixed(1)}%). Try incorporating more diverse vocabulary.`,
    });
  } else if (stats.vocabularyRichness > 0.7 && stats.words > 50) {
    suggestions.push({
      type: 'success',
      message: `Excellent vocabulary diversity (${(stats.vocabularyRichness * 100).toFixed(1)}%). Your word choices are varied and engaging.`,
    });
  }

  // Average sentence length
  if (stats.avgSentenceLength > 25) {
    suggestions.push({
      type: 'warning',
      message: `Average sentence length is ${stats.avgSentenceLength} words. Aim for 15-20 words for better readability.`,
    });
  } else if (stats.avgSentenceLength >= 12 && stats.avgSentenceLength <= 20) {
    suggestions.push({
      type: 'success',
      message: `Average sentence length (${stats.avgSentenceLength} words) is in the ideal range for readability.`,
    });
  }

  // Paragraph count
  if (stats.paragraphs === 1 && stats.words > 200) {
    suggestions.push({
      type: 'warning',
      message: 'Your text is a single large paragraph. Breaking it into multiple paragraphs improves readability and organization.',
    });
  }

  // Sentence variety
  const sentLengths = sentences.map((s) => getWords(s).length);
  if (sentLengths.length > 3) {
    const avg = sentLengths.reduce((a, b) => a + b, 0) / sentLengths.length;
    const variance = sentLengths.reduce((sum, l) => sum + (l - avg) ** 2, 0) / sentLengths.length;
    const stdDev = Math.sqrt(variance);
    if (stdDev < 3 && stats.words > 100) {
      suggestions.push({
        type: 'info',
        message: 'Sentences are very similar in length. Varying sentence length creates better rhythm and keeps readers engaged.',
      });
    }
  }

  if (suggestions.length === 0 && stats.words > 0) {
    suggestions.push({
      type: 'success',
      message: 'No major issues detected. Your writing looks well-structured!',
    });
  }

  return suggestions;
}

/* ─── Flesch Ease Label & Color ─── */
function fleschLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 90) return { label: 'Very Easy', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500' };
  if (score >= 80) return { label: 'Easy', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500' };
  if (score >= 70) return { label: 'Fairly Easy', color: 'text-lime-600 dark:text-lime-400', bg: 'bg-lime-500' };
  if (score >= 60) return { label: 'Standard', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500' };
  if (score >= 50) return { label: 'Fairly Difficult', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500' };
  if (score >= 30) return { label: 'Difficult', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500' };
  return { label: 'Very Difficult', color: 'text-red-700 dark:text-red-300', bg: 'bg-red-700' };
}

function gradeToAudience(grade: number): string {
  if (grade <= 5) return '5th grade or below';
  if (grade <= 8) return '6th-8th grade (middle school)';
  if (grade <= 12) return '9th-12th grade (high school)';
  if (grade <= 16) return 'College level';
  return 'Graduate / professional level';
}

/* ─── SVG Gauge Component ─── */
function ReadabilityGauge({
  value,
  max,
  label,
  sublabel,
  colorClass,
}: {
  value: number;
  max: number;
  label: string;
  sublabel: string;
  colorClass: string;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = 60;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <svg width="140" height="80" viewBox="0 0 140 80" className="mb-2">
        {/* Background arc */}
        <path
          d="M 10 75 A 60 60 0 0 1 130 75"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-slate-200 dark:text-slate-700"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <motion.path
          d="M 10 75 A 60 60 0 0 1 130 75"
          fill="none"
          strokeWidth="10"
          className={colorClass}
          strokeLinecap="round"
          stroke="currentColor"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
        {/* Value text */}
        <text x="70" y="68" textAnchor="middle" className="fill-slate-900 dark:fill-slate-100 text-2xl font-bold" fontSize="24" fontWeight="700">
          {value}
        </text>
      </svg>
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">{label}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 text-center mt-0.5">{sublabel}</div>
    </div>
  );
}

/* ─── Horizontal Bar ─── */
function HorizontalBar({ label, value, maxValue }: { label: string; value: number; maxValue: number }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-600 dark:text-slate-400 w-28 truncate font-medium" title={label}>
        {label}
      </span>
      <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-8 text-right">{value}</span>
    </div>
  );
}

/* ─── History Helpers ─── */
const HISTORY_KEY = 'essay-counter-history';
const MAX_HISTORY = 5;

function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
  } catch {
    // Storage full or unavailable
  }
}

/* ─── Export Function for Report ─── */
function generateReport(text: string, stats: TextStats, scores: ReadabilityScores, suggestions: WritingSuggestion[]): string {
  const fl = fleschLabel(scores.fleschReadingEase);
  return [
    '=== Essay Counter & Readability Report ===',
    `Generated: ${new Date().toLocaleString()}`,
    '',
    '--- Basic Statistics ---',
    `Words: ${stats.words}`,
    `Characters: ${stats.characters}`,
    `Characters (no spaces): ${stats.charactersNoSpaces}`,
    `Sentences: ${stats.sentences}`,
    `Paragraphs: ${stats.paragraphs}`,
    `Reading Time: ${stats.readingTime}`,
    `Speaking Time: ${stats.speakingTime}`,
    `Average Word Length: ${stats.avgWordLength} chars`,
    `Average Sentence Length: ${stats.avgSentenceLength} words`,
    `Unique Words: ${stats.uniqueWords}`,
    `Vocabulary Richness: ${(stats.vocabularyRichness * 100).toFixed(1)}%`,
    '',
    '--- Readability Scores ---',
    `Flesch Reading Ease: ${scores.fleschReadingEase} (${fl.label})`,
    `Flesch-Kincaid Grade: ${scores.fleschKincaidGrade}`,
    `Gunning Fog Index: ${scores.gunningFog}`,
    `Coleman-Liau Index: ${scores.colemanLiau}`,
    `SMOG Index: ${scores.smog}`,
    `Automated Readability Index: ${scores.ari}`,
    '',
    '--- Writing Suggestions ---',
    ...suggestions.map((s) => `[${s.type.toUpperCase()}] ${s.message}`),
    '',
    '--- Longest Sentence ---',
    stats.longestSentence || '(none)',
    '',
    '--- Shortest Sentence ---',
    stats.shortestSentence || '(none)',
    '',
    '--- Original Text ---',
    text,
  ].join('\n');
}

/* ─── Main Component ─── */
export function EssayCounterReadabilityTool() {
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.max(220, ta.scrollHeight)}px`;
    }
  }, [text]);

  // Memoized computations
  const stats = useMemo(() => computeStats(text), [text]);
  const scores = useMemo(() => computeReadability(text, stats), [text, stats]);
  const wordFreq = useMemo(() => getWordFrequency(text), [text]);
  const sentenceDist = useMemo(() => getSentenceLengthDistribution(text), [text]);
  const suggestions = useMemo(() => getWritingSuggestions(text, stats), [text, stats]);

  const handleReset = useCallback(() => {
    setText('');
    setActiveTab('overview');
  }, []);

  const handleTryExample = useCallback(() => {
    setText(SAMPLE_ESSAY);
  }, []);

  const handleSaveToHistory = useCallback(() => {
    if (stats.words < 10) return;
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      preview: text.slice(0, 80) + (text.length > 80 ? '...' : ''),
      wordCount: stats.words,
      fleschScore: scores.fleschReadingEase,
    };
    const updated = [entry, ...history.filter((h) => h.id !== entry.id)].slice(0, MAX_HISTORY);
    setHistory(updated);
    saveHistory(updated);
  }, [text, stats, scores, history]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const handleCopyStats = useCallback(() => {
    const report = generateReport(text, stats, scores, suggestions);
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text, stats, scores, suggestions]);

  const handleExport = useCallback(() => {
    const report = generateReport(text, stats, scores, suggestions);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `essay-analysis-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [text, stats, scores, suggestions]);

  const fl = fleschLabel(scores.fleschReadingEase);
  const hasText = stats.words > 0;

  /* ─── Stat Cards Data ─── */
  const statCards = [
    { label: 'Words', value: stats.words.toLocaleString(), icon: Type, color: 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' },
    { label: 'Characters', value: stats.characters.toLocaleString(), icon: Hash, color: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30' },
    { label: 'Sentences', value: stats.sentences.toLocaleString(), icon: AlignLeft, color: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30' },
    { label: 'Paragraphs', value: stats.paragraphs.toLocaleString(), icon: FileText, color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30' },
    { label: 'Reading Time', value: stats.readingTime, icon: Clock, color: 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30' },
    { label: 'Speaking Time', value: stats.speakingTime, icon: Mic, color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30' },
  ];

  return (
    <div className="space-y-5">
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleTryExample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors font-medium"
        >
          <BookOpen className="w-4 h-4" /> Try Example
        </button>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
        >
          <History className="w-4 h-4" /> History
          {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        {hasText && (
          <>
            <button
              onClick={handleSaveToHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors font-medium"
            >
              <CheckCircle className="w-4 h-4" /> Save Analysis
            </button>
            <button
              onClick={handleCopyStats}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy Stats'}
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              <Download className="w-4 h-4" /> Export TXT
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </>
        )}
        <div className="ml-auto inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5" /> Processed locally
        </div>
      </div>

      {/* History panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Analyses</h3>
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500">No saved analyses yet. Analyze some text and click &quot;Save Analysis&quot;.</p>
              ) : (
                <div className="space-y-2">
                  {history.map((entry) => (
                    <button
                      key={entry.id}
                      className="w-full text-left p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                      onClick={() => {
                        setShowHistory(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-[70%]">{entry.preview}</span>
                        <span className="text-xs text-slate-400">{new Date(entry.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>{entry.wordCount} words</span>
                        <span>Flesch: {entry.fleschScore}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your essay, article, or any text here to analyze readability, word count, and get writing suggestions..."
          className="tool-textarea min-h-[220px] w-full resize-none"
          spellCheck={false}
        />
      </div>

      {/* Stat cards grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        initial={false}
        animate={hasText ? { opacity: 1 } : { opacity: 0.5 }}
        transition={{ duration: 0.3 }}
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`rounded-xl p-3 sm:p-4 text-center ${card.color}`}>
              <Icon className="w-4 h-4 mx-auto mb-1 opacity-60" />
              <div className="text-xl sm:text-2xl font-heading font-bold">{card.value}</div>
              <div className="text-xs font-medium mt-0.5 opacity-80">{card.label}</div>
            </div>
          );
        })}
      </motion.div>

      {/* Secondary stats */}
      {hasText && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{stats.charactersNoSpaces.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Chars (no spaces)</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{stats.avgWordLength}</div>
            <div className="text-xs text-slate-500">Avg Word Length</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{stats.avgSentenceLength}</div>
            <div className="text-xs text-slate-500">Avg Sentence Length</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
              {stats.uniqueWords} <span className="text-sm font-normal text-slate-400">({(stats.vocabularyRichness * 100).toFixed(1)}%)</span>
            </div>
            <div className="text-xs text-slate-500">Unique Words (Richness)</div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      {hasText && (
        <>
          <div className="flex gap-1 overflow-x-auto bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {TABS.map((tab) => {
              const Icon = TAB_ICONS[tab];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{TAB_LABELS[tab]}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Flesch summary */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Readability Summary</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Your text scores <span className={`font-bold ${fl.color}`}>{scores.fleschReadingEase}</span> on the Flesch Reading Ease scale,
                          rated as <span className={`font-bold ${fl.color}`}>{fl.label}</span>.
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Grade level: <span className="font-semibold text-slate-700 dark:text-slate-300">{scores.fleschKincaidGrade}</span> ({gradeToAudience(scores.fleschKincaidGrade)})
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-bold text-white ${fl.bg}`}>
                        {fl.label}
                      </div>
                    </div>
                    {/* Flesch bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Very Difficult (0)</span>
                        <span>Very Easy (100)</span>
                      </div>
                      <div className="h-3 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 relative">
                        <motion.div
                          className="absolute top-0 w-1 h-full bg-white border-2 border-slate-800 dark:border-white rounded-full shadow-lg"
                          style={{ left: `${scores.fleschReadingEase}%`, transform: 'translateX(-50%)' }}
                          initial={{ left: '0%' }}
                          animate={{ left: `${scores.fleschReadingEase}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Longest & shortest sentence */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                      <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Longest Sentence ({getWords(stats.longestSentence).length} words)
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4">
                        {stats.longestSentence || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                      <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Shortest Sentence ({getWords(stats.shortestSentence).length} words)
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4">
                        {stats.shortestSentence || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Sentence length distribution */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Sentence Length Distribution
                    </h4>
                    <div className="space-y-2">
                      {sentenceDist.map((bucket) => {
                        const maxBucket = Math.max(...sentenceDist.map((b) => b.count), 1);
                        return (
                          <div key={bucket.range} className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 w-12 text-right font-mono">{bucket.range}</span>
                            <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${
                                  bucket.range === '31+' ? 'bg-red-400 dark:bg-red-500' : 'bg-primary-400 dark:bg-primary-500'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(bucket.count / maxBucket) * 100}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 w-6 font-mono">{bucket.count}</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Words per sentence</p>
                  </div>
                </div>
              )}

              {/* READABILITY TAB */}
              {activeTab === 'readability' && (
                <div className="space-y-4">
                  {/* Gauges grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <ReadabilityGauge
                      value={scores.fleschReadingEase}
                      max={100}
                      label="Flesch Reading Ease"
                      sublabel={fl.label}
                      colorClass={fl.color}
                    />
                    <ReadabilityGauge
                      value={scores.fleschKincaidGrade}
                      max={20}
                      label="Flesch-Kincaid Grade"
                      sublabel={gradeToAudience(scores.fleschKincaidGrade)}
                      colorClass={scores.fleschKincaidGrade <= 8 ? 'text-green-500' : scores.fleschKincaidGrade <= 12 ? 'text-yellow-500' : 'text-red-500'}
                    />
                    <ReadabilityGauge
                      value={scores.gunningFog}
                      max={20}
                      label="Gunning Fog Index"
                      sublabel={gradeToAudience(scores.gunningFog)}
                      colorClass={scores.gunningFog <= 10 ? 'text-green-500' : scores.gunningFog <= 14 ? 'text-yellow-500' : 'text-red-500'}
                    />
                    <ReadabilityGauge
                      value={scores.colemanLiau}
                      max={20}
                      label="Coleman-Liau Index"
                      sublabel={gradeToAudience(scores.colemanLiau)}
                      colorClass={scores.colemanLiau <= 8 ? 'text-green-500' : scores.colemanLiau <= 12 ? 'text-yellow-500' : 'text-red-500'}
                    />
                    <ReadabilityGauge
                      value={scores.smog}
                      max={20}
                      label="SMOG Index"
                      sublabel={gradeToAudience(scores.smog)}
                      colorClass={scores.smog <= 10 ? 'text-green-500' : scores.smog <= 14 ? 'text-yellow-500' : 'text-red-500'}
                    />
                    <ReadabilityGauge
                      value={scores.ari}
                      max={20}
                      label="ARI"
                      sublabel={gradeToAudience(scores.ari)}
                      colorClass={scores.ari <= 8 ? 'text-green-500' : scores.ari <= 12 ? 'text-yellow-500' : 'text-red-500'}
                    />
                  </div>

                  {/* Formulas reference */}
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Score Interpretation
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Flesch Reading Ease</p>
                        <div className="space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex gap-2"><span className="w-12 text-emerald-500 font-semibold">90-100</span> Very Easy</div>
                          <div className="flex gap-2"><span className="w-12 text-green-500 font-semibold">80-89</span> Easy</div>
                          <div className="flex gap-2"><span className="w-12 text-lime-500 font-semibold">70-79</span> Fairly Easy</div>
                          <div className="flex gap-2"><span className="w-12 text-yellow-500 font-semibold">60-69</span> Standard</div>
                          <div className="flex gap-2"><span className="w-12 text-orange-500 font-semibold">50-59</span> Fairly Difficult</div>
                          <div className="flex gap-2"><span className="w-12 text-red-500 font-semibold">30-49</span> Difficult</div>
                          <div className="flex gap-2"><span className="w-12 text-red-700 font-semibold">0-29</span> Very Difficult</div>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Grade-Level Scores</p>
                        <div className="space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex gap-2"><span className="w-8 text-green-500 font-semibold">1-5</span> Elementary school</div>
                          <div className="flex gap-2"><span className="w-8 text-lime-500 font-semibold">6-8</span> Middle school</div>
                          <div className="flex gap-2"><span className="w-8 text-yellow-500 font-semibold">9-12</span> High school</div>
                          <div className="flex gap-2"><span className="w-8 text-orange-500 font-semibold">13-16</span> College</div>
                          <div className="flex gap-2"><span className="w-8 text-red-500 font-semibold">17+</span> Graduate / professional</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Formulas */}
                  <details className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <summary className="cursor-pointer p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                      View Readability Formulas Used
                    </summary>
                    <div className="px-4 pb-4 space-y-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <p><strong className="text-slate-700 dark:text-slate-300">Flesch RE</strong> = 206.835 - 1.015(words/sentences) - 84.6(syllables/words)</p>
                      <p><strong className="text-slate-700 dark:text-slate-300">FK Grade</strong> = 0.39(words/sentences) + 11.8(syllables/words) - 15.59</p>
                      <p><strong className="text-slate-700 dark:text-slate-300">Gunning Fog</strong> = 0.4 * ((words/sentences) + 100(complex_words/words))</p>
                      <p><strong className="text-slate-700 dark:text-slate-300">Coleman-Liau</strong> = 0.0588*L - 0.296*S - 15.8</p>
                      <p><strong className="text-slate-700 dark:text-slate-300">SMOG</strong> = 3 + sqrt(polysyllables * 30 / sentences)</p>
                      <p><strong className="text-slate-700 dark:text-slate-300">ARI</strong> = 4.71(chars/words) + 0.5(words/sentences) - 21.43</p>
                    </div>
                  </details>
                </div>
              )}

              {/* WORD FREQUENCY TAB */}
              {activeTab === 'frequency' && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                      Top 20 Most Used Words <span className="normal-case font-normal">(excluding common stop words)</span>
                    </h4>
                    {wordFreq.length === 0 ? (
                      <p className="text-sm text-slate-400">Not enough meaningful words to analyze.</p>
                    ) : (
                      <div className="space-y-2">
                        {wordFreq.map((item) => (
                          <HorizontalBar
                            key={item.word}
                            label={item.word}
                            value={item.count}
                            maxValue={wordFreq[0].count}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Word cloud style summary */}
                  {wordFreq.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                      <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                        Word Cloud
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {wordFreq.map((item, i) => {
                          const sizeClass =
                            i < 3
                              ? 'text-xl font-bold'
                              : i < 7
                                ? 'text-base font-semibold'
                                : i < 12
                                  ? 'text-sm font-medium'
                                  : 'text-xs';
                          const colorClasses = [
                            'text-primary-600 dark:text-primary-400',
                            'text-purple-600 dark:text-purple-400',
                            'text-green-600 dark:text-green-400',
                            'text-amber-600 dark:text-amber-400',
                            'text-rose-600 dark:text-rose-400',
                            'text-cyan-600 dark:text-cyan-400',
                          ];
                          return (
                            <span
                              key={item.word}
                              className={`${sizeClass} ${colorClasses[i % colorClasses.length]} px-1`}
                              title={`${item.word}: ${item.count} occurrences`}
                            >
                              {item.word}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUGGESTIONS TAB */}
              {activeTab === 'suggestions' && (
                <div className="space-y-3">
                  {suggestions.map((suggestion, i) => {
                    const iconMap = {
                      warning: AlertTriangle,
                      info: BookOpen,
                      success: CheckCircle,
                    };
                    const colorMap = {
                      warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
                      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
                      success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
                    };
                    const iconColorMap = {
                      warning: 'text-amber-500',
                      info: 'text-blue-500',
                      success: 'text-green-500',
                    };
                    const SugIcon = iconMap[suggestion.type];

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex gap-3 p-4 rounded-xl border ${colorMap[suggestion.type]}`}
                      >
                        <SugIcon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColorMap[suggestion.type]}`} />
                        <p className="text-sm leading-relaxed">{suggestion.message}</p>
                      </motion.div>
                    );
                  })}

                  {/* Writing tips */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mt-4">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      General Writing Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex gap-2">
                        <span className="text-primary-500 font-bold shrink-0">1.</span>
                        Aim for a Flesch Reading Ease score of 60-70 for general audiences.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary-500 font-bold shrink-0">2.</span>
                        Keep average sentence length between 15-20 words for optimal readability.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary-500 font-bold shrink-0">3.</span>
                        Vary sentence length to create rhythm and maintain reader engagement.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary-500 font-bold shrink-0">4.</span>
                        Use active voice to make your writing more direct and engaging.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary-500 font-bold shrink-0">5.</span>
                        Break long paragraphs (over 150 words) into smaller, focused paragraphs.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary-500 font-bold shrink-0">6.</span>
                        Avoid jargon and complex vocabulary unless writing for a specialized audience.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {/* Empty state */}
      {!hasText && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            Paste or type your text above to see detailed analysis.
          </p>
          <button
            onClick={handleTryExample}
            className="mt-3 text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Or try with a sample essay
          </button>
        </motion.div>
      )}
    </div>
  );
}
