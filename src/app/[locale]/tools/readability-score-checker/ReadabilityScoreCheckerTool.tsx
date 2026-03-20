// app/tools/text-tools/readability-score-checker/ReadabilityScoreCheckerTool.tsx
'use client';

import { useState, useMemo } from 'react';
import { BookOpen, X, BarChart2, FileText, Clock } from 'lucide-react';

// ── Syllable Counter ───────────────────────────────────────────────────────────
function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length === 0) return 0;
  if (w.length <= 3) return 1;

  let count = 0;
  const vowels = 'aeiouy';
  let prevWasVowel = false;

  // Remove silent e at end
  const cleaned = w.replace(/e$/, '');

  for (let i = 0; i < cleaned.length; i++) {
    const isVowel = vowels.includes(cleaned[i]);
    if (isVowel && !prevWasVowel) count++;
    prevWasVowel = isVowel;
  }

  // Handle special suffixes
  if (w.endsWith('le') && w.length > 2 && !vowels.includes(w[w.length - 3])) count++;
  if (w.endsWith('es') || w.endsWith('ed')) count = Math.max(count - 1, 1);

  return Math.max(count, 1);
}

function isPolysyllabic(word: string): boolean {
  return countSyllables(word) >= 3;
}

// ── Text Stats ─────────────────────────────────────────────────────────────────
interface TextStats {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  charCount: number;
  charNoSpaces: number;
  syllableCount: number;
  complexWordCount: number;
  avgSentenceLength: number;
  avgSyllablesPerWord: number;
  avgWordLength: number;
  readingTimeMin: number;
  topWords: [string, number][];
}

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','by',
  'from','is','was','are','were','be','been','being','have','has','had','do',
  'does','did','will','would','could','should','may','might','shall','can',
  'i','you','he','she','it','we','they','this','that','these','those','as',
  'if','not','no','so','yet','nor','than','then','when','where','who','which',
]);

function computeStats(text: string): TextStats {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      wordCount: 0, sentenceCount: 0, paragraphCount: 0, charCount: 0,
      charNoSpaces: 0, syllableCount: 0, complexWordCount: 0,
      avgSentenceLength: 0, avgSyllablesPerWord: 0, avgWordLength: 0,
      readingTimeMin: 0, topWords: [],
    };
  }

  const words = trimmed.match(/\b[a-zA-Z]+\b/g) ?? [];
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const paragraphs = trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const complexWords = words.filter(isPolysyllabic).length;

  const wc = words.length;
  const sc = Math.max(sentences.length, 1);

  const freq: Record<string, number> = {};
  words.forEach((w) => {
    const lower = w.toLowerCase();
    if (!STOP_WORDS.has(lower) && lower.length > 2) {
      freq[lower] = (freq[lower] ?? 0) + 1;
    }
  });
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15) as [string, number][];

  return {
    wordCount: wc,
    sentenceCount: sc,
    paragraphCount: Math.max(paragraphs.length, 1),
    charCount: trimmed.length,
    charNoSpaces: trimmed.replace(/\s/g, '').length,
    syllableCount: syllables,
    complexWordCount: complexWords,
    avgSentenceLength: wc / sc,
    avgSyllablesPerWord: wc > 0 ? syllables / wc : 0,
    avgWordLength: wc > 0 ? words.reduce((s, w) => s + w.length, 0) / wc : 0,
    readingTimeMin: wc / 200,
    topWords,
  };
}

// ── Readability Formulas ───────────────────────────────────────────────────────
interface Scores {
  fleschEase: number;
  fleschKincaid: number;
  gunningFog: number;
  smog: number;
  ari: number;
  colemanLiau: number;
}

function computeScores(stats: TextStats): Scores | null {
  const { wordCount: wc, sentenceCount: sc, syllableCount: sy, complexWordCount: cx,
    charNoSpaces: ch, avgSentenceLength: asl, avgSyllablesPerWord: asw } = stats;
  if (wc < 10 || sc < 1) return null;

  const fleschEase = 206.835 - 1.015 * asl - 84.6 * asw;
  const fleschKincaid = 0.39 * asl + 11.8 * asw - 15.59;
  const gunningFog = 0.4 * (asl + (cx / wc) * 100);
  const polysyllabicPer30 = cx * (30 / sc);
  const smog = 3 + Math.sqrt(polysyllabicPer30);
  const ari = 4.71 * (ch / wc) + 0.5 * (wc / sc) - 21.43;
  const L = (ch / wc) * 100;
  const S = (sc / wc) * 100;
  const colemanLiau = 0.0588 * L - 0.296 * S - 15.8;

  return {
    fleschEase: Math.round(fleschEase * 10) / 10,
    fleschKincaid: Math.round(fleschKincaid * 10) / 10,
    gunningFog: Math.round(gunningFog * 10) / 10,
    smog: Math.round(smog * 10) / 10,
    ari: Math.round(ari * 10) / 10,
    colemanLiau: Math.round(colemanLiau * 10) / 10,
  };
}

// ── Score Interpretation ───────────────────────────────────────────────────────
interface Interpretation {
  label: string;
  audience: string;
  color: 'green' | 'yellow' | 'red';
}

function interpretFlesch(score: number): Interpretation {
  if (score >= 90) return { label: 'Very Easy', audience: 'General public (5th grade)', color: 'green' };
  if (score >= 80) return { label: 'Easy', audience: 'General public (6th grade)', color: 'green' };
  if (score >= 70) return { label: 'Fairly Easy', audience: 'General public (7th grade)', color: 'green' };
  if (score >= 60) return { label: 'Standard', audience: 'General audience (8th–9th grade)', color: 'yellow' };
  if (score >= 50) return { label: 'Fairly Difficult', audience: 'High school / some college', color: 'yellow' };
  if (score >= 30) return { label: 'Difficult', audience: 'College level', color: 'red' };
  return { label: 'Very Confusing', audience: 'Graduate / professional level', color: 'red' };
}

function interpretGrade(grade: number): Interpretation {
  if (grade <= 6) return { label: `Grade ${Math.max(1, Math.round(grade))}`, audience: 'Elementary / general public', color: 'green' };
  if (grade <= 9) return { label: `Grade ${Math.round(grade)}`, audience: 'Middle / high school', color: 'yellow' };
  if (grade <= 12) return { label: `Grade ${Math.round(grade)}`, audience: 'High school', color: 'yellow' };
  if (grade <= 16) return { label: `Grade ${Math.round(grade)}`, audience: 'College level', color: 'red' };
  return { label: 'Graduate+', audience: 'Graduate / professional', color: 'red' };
}

const COLOR_VARIANTS = {
  green: {
    card: 'bg-emerald-500/10 border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300',
    score: 'text-emerald-400',
  },
  yellow: {
    card: 'bg-amber-500/10 border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300',
    score: 'text-amber-400',
  },
  red: {
    card: 'bg-red-500/10 border-red-500/20',
    badge: 'bg-red-500/20 text-red-300',
    score: 'text-red-400',
  },
};

// ── Component ──────────────────────────────────────────────────────────────────
const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet. Reading comprehension depends on sentence structure, vocabulary complexity, and the background knowledge of the reader. Longer sentences with more complex vocabulary tend to score lower on readability scales, making them suitable for academic or professional audiences rather than general readers.`;

export function ReadabilityScoreCheckerTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => computeStats(text), [text]);
  const scores = useMemo(() => computeScores(stats), [stats]);

  const readingTime = (() => {
    const mins = stats.readingTimeMin;
    if (mins < 1) return `${Math.max(1, Math.round(mins * 60))} sec`;
    return `${Math.round(mins)} min`;
  })();

  const scoreCards = scores
    ? [
        {
          name: 'Flesch Reading Ease',
          value: scores.fleschEase,
          range: '0–100 (higher = easier)',
          interp: interpretFlesch(scores.fleschEase),
        },
        {
          name: 'Flesch-Kincaid Grade',
          value: scores.fleschKincaid,
          range: 'US grade level',
          interp: interpretGrade(scores.fleschKincaid),
        },
        {
          name: 'Gunning Fog Index',
          value: scores.gunningFog,
          range: 'Years of education',
          interp: interpretGrade(scores.gunningFog),
        },
        {
          name: 'SMOG Index',
          value: scores.smog,
          range: 'Years of education',
          interp: interpretGrade(scores.smog),
        },
        {
          name: 'ARI',
          value: scores.ari,
          range: 'Grade level (char-based)',
          interp: interpretGrade(scores.ari),
        },
        {
          name: 'Coleman-Liau',
          value: scores.colemanLiau,
          range: 'Grade level',
          interp: interpretGrade(scores.colemanLiau),
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-300">Paste or type your text</label>
          <div className="flex items-center gap-2">
            {text && (
              <button
                onClick={() => setText('')}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-slate-700"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
            <button
              onClick={() => setText(SAMPLE_TEXT)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors px-2 py-1 rounded hover:bg-slate-700"
            >
              Load sample
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your article, essay, email, or any text here to analyze its readability..."
          className="w-full h-52 px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-slate-100 text-sm resize-none focus:outline-none focus:border-indigo-500 placeholder-slate-600"
        />
        <div className="flex gap-4 mt-1.5 text-xs text-slate-600">
          <span>{stats.wordCount} words</span>
          <span>{stats.sentenceCount} sentences</span>
          <span>{stats.charCount} characters</span>
        </div>
      </div>

      {/* Min word warning */}
      {text.trim().length > 0 && stats.wordCount < 10 && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-300">
          Add at least 10 words for readability scores.
        </div>
      )}

      {/* Score cards */}
      {scores && (
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-400" />
            Readability Scores
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scoreCards.map((card) => {
              const cv = COLOR_VARIANTS[card.interp.color];
              return (
                <div key={card.name} className={`p-4 rounded-xl border ${cv.card}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs text-slate-400 font-medium leading-tight">{card.name}</span>
                    <span className={`text-2xl font-bold ${cv.score}`}>{card.value}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 mb-2">{card.range}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cv.badge}`}>
                    {card.interp.label}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1.5 leading-tight">
                    {card.interp.audience}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Text stats */}
      {stats.wordCount > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Text Statistics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Words', value: stats.wordCount.toLocaleString() },
              { label: 'Sentences', value: stats.sentenceCount.toLocaleString() },
              { label: 'Paragraphs', value: stats.paragraphCount.toLocaleString() },
              { label: 'Characters', value: stats.charCount.toLocaleString() },
              { label: 'Avg Sentence Length', value: `${stats.avgSentenceLength.toFixed(1)} words` },
              { label: 'Avg Word Length', value: `${stats.avgWordLength.toFixed(1)} chars` },
              { label: 'Avg Syllables/Word', value: stats.avgSyllablesPerWord.toFixed(2) },
              { label: 'Complex Words', value: stats.complexWordCount.toLocaleString() },
            ].map((s) => (
              <div key={s.label} className="p-3 bg-slate-800/60 rounded-lg border border-slate-700">
                <div className="text-xs text-slate-500 mb-0.5">{s.label}</div>
                <div className="text-sm font-semibold text-slate-200">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Reading time */}
          <div className="mt-3 flex items-center gap-2 p-3 bg-slate-800/60 rounded-lg border border-slate-700">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-sm text-slate-400">Estimated reading time:</span>
            <span className="text-sm font-semibold text-indigo-300">{readingTime}</span>
            <span className="text-xs text-slate-600">@ 200 wpm average</span>
          </div>
        </div>
      )}

      {/* Top words */}
      {stats.topWords.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Most Frequent Words <span className="text-slate-600 font-normal">(stop words excluded)</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.topWords.map(([word, count]) => {
              const maxCount = stats.topWords[0][1];
              const intensity = count / maxCount;
              const opacity = Math.round(20 + intensity * 60);
              return (
                <span
                  key={word}
                  className="px-2.5 py-1 rounded-lg text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  style={{ opacity: 0.4 + intensity * 0.6 }}
                  title={`${count} occurrence${count !== 1 ? 's' : ''}`}
                >
                  {word}
                  <span className="ml-1.5 text-xs opacity-60">{count}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-600 text-center">
        All analysis is performed in-browser. No text is transmitted to any server.
      </p>
    </div>
  );
}
