'use client';
import { useState, useMemo } from 'react';
import { Clock, Mic, BookOpen, ChevronDown, ChevronUp, RotateCcw, Headphones, Zap, Target } from 'lucide-react';
import { CopyButton } from '@/components/common/CopyButton';

const PROFILES = [
  { id: 'slow',    label: 'Slow Reader',   wpm: 150,  icon: '🐢', color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' },
  { id: 'average', label: 'Average Adult', wpm: 238,  icon: '👤', color: 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' },
  { id: 'fast',    label: 'Fast Reader',   wpm: 350,  icon: '⚡', color: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
  { id: 'speed',   label: 'Speed Reader',  wpm: 600,  icon: '🚀', color: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' },
];

function formatTime(minutes: number): string {
  if (minutes < 1) return '< 1 min';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function getWordFrequency(text: string): { word: string; count: number }[] {
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const stopWords = new Set(['the','and','for','are','but','not','you','all','can','her','was','one','our','out','day','get','has','him','his','how','man','new','now','old','see','two','way','who','boy','did','its','let','put','say','she','too','use','that','this','with','have','from','they','will','been','each','from','here','more','also','some','than','then','them','these','this','time','very','well','what','when','your']);
  const freq: Record<string, number> = {};
  for (const w of words) {
    if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
  }
  return Object.entries(freq)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

function analyzeText(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, '').length;
  const sentences = (text.match(/[.!?]+/g) || []).length || (trimmed ? 1 : 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
  const paraCount = paragraphs.length || (trimmed ? 1 : 0);
  const avgWordsPerSentence = sentences > 0 ? (wordCount / sentences).toFixed(1) : '0';
  const avgWordsPerParagraph = paraCount > 0 ? Math.round(wordCount / paraCount) : 0;
  const syllableCount = words.reduce((acc, w) => {
    const s = w.toLowerCase().replace(/[^a-z]/g, '');
    const matches = s.match(/[aeiouy]+/g);
    return acc + Math.max(1, matches ? matches.length : 1);
  }, 0);
  const fleschScore = sentences > 0
    ? Math.max(0, Math.min(100, 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllableCount / wordCount)))
    : 0;
  const readabilityLabel = fleschScore >= 80 ? 'Very Easy' : fleschScore >= 70 ? 'Easy' : fleschScore >= 60 ? 'Standard' : fleschScore >= 50 ? 'Fairly Difficult' : fleschScore >= 30 ? 'Difficult' : 'Very Difficult';

  const paraBreakdown = (text.split(/\n\s*\n/).filter(p => p.trim()) || [trimmed]).map((p, i) => {
    const wc = p.trim().split(/\s+/).filter(Boolean).length;
    return { index: i + 1, wordCount: wc };
  });

  return { wordCount, charCount, charNoSpaces, sentences, paraCount, avgWordsPerSentence, avgWordsPerParagraph, fleschScore, readabilityLabel, paraBreakdown };
}

export function ReadingTimeCalculatorTool() {
  const [text, setText] = useState('');
  const [customWpm, setCustomWpm] = useState(238);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);

  const stats = useMemo(() => analyzeText(text), [text]);
  const keywords = useMemo(() => (text.length > 50 ? getWordFrequency(text) : []), [text]);

  const speakingTime = stats ? stats.wordCount / 130 : 0;
  const audiobookTime = stats ? stats.wordCount / 150 : 0;

  return (
    <div className="space-y-5">
      {/* Custom WPM */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Target className="w-4 h-4" /> Your Reading Speed
          </label>
          <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{customWpm} WPM</span>
        </div>
        <input type="range" min={80} max={700} step={10} value={customWpm} onChange={e => setCustomWpm(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
        <div className="flex justify-between text-xs text-slate-400 mt-1"><span>80 WPM</span><span>Average: 238</span><span>700 WPM</span></div>
      </div>

      {/* Stat cards — reading profiles */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PROFILES.map(p => (
            <div key={p.id} className={`rounded-xl p-3 text-center ${p.color}`}>
              <div className="text-lg mb-0.5">{p.icon}</div>
              <div className="text-xl font-heading font-bold">{formatTime(stats.wordCount / p.wpm)}</div>
              <div className="text-xs font-medium mt-0.5 opacity-80">{p.label}</div>
              <div className="text-xs opacity-60">{p.wpm} WPM</div>
            </div>
          ))}
        </div>
      )}

      {/* Your custom reading time */}
      {stats && (
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-primary-700 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your Reading Time</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">{formatTime(stats.wordCount / customWpm)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Speaking Time</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">{formatTime(speakingTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Audiobook Time</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">{formatTime(audiobookTime)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Text stats */}
      {stats && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { label: 'Words', value: stats.wordCount.toLocaleString(), color: 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' },
            { label: 'Characters', value: stats.charCount.toLocaleString(), color: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30' },
            { label: 'No Spaces', value: stats.charNoSpaces.toLocaleString(), color: 'text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30' },
            { label: 'Sentences', value: stats.sentences.toLocaleString(), color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30' },
            { label: 'Paragraphs', value: stats.paraCount.toLocaleString(), color: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30' },
            { label: 'Avg WPS', value: stats.avgWordsPerSentence, color: 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
              <div className="text-xl font-heading font-bold">{s.value}</div>
              <div className="text-xs font-medium mt-0.5 opacity-80">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Readability */}
      {stats && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Readability — Flesch Score</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{stats.readabilityLabel} ({Math.round(stats.fleschScore)}/100)</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${stats.fleschScore}%`, background: stats.fleschScore >= 70 ? '#22c55e' : stats.fleschScore >= 50 ? '#f59e0b' : '#ef4444' }} />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Complex</span><span>Standard</span><span>Simple</span></div>
        </div>
      )}

      {/* Paragraph breakdown toggle */}
      {stats && stats.paraBreakdown.length > 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button onClick={() => setShowBreakdown(v => !v)} className="w-full flex items-center justify-between p-4 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" />Paragraph Breakdown ({stats.paraBreakdown.length} paragraphs)</span>
            {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showBreakdown && (
            <div className="px-4 pb-4 space-y-2 max-h-60 overflow-y-auto">
              {stats.paraBreakdown.map(p => (
                <div key={p.index} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-20 shrink-0">Para {p.index}</span>
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 rounded-full" style={{ width: `${Math.min(100, (p.wordCount / (stats.wordCount || 1)) * 100 * (stats.paraBreakdown.length))}%` }} />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 w-20 text-right shrink-0">{p.wordCount} words · {formatTime(p.wordCount / customWpm)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Keyword frequency toggle */}
      {keywords.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button onClick={() => setShowKeywords(v => !v)} className="w-full flex items-center justify-between p-4 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-purple-500" />Top Keywords</span>
            {showKeywords ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showKeywords && (
            <div className="px-4 pb-4 flex flex-wrap gap-2">
              {keywords.map(k => (
                <span key={k.word} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {k.word} <span className="text-slate-400 dark:text-slate-500">×{k.count}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste your article, blog post, essay, script, or any text here…"
          className="tool-textarea min-h-[240px]"
          aria-label="Text input for reading time calculation"
        />
        {text && (
          <div className="absolute bottom-3 right-3 flex gap-2">
            <CopyButton text={text} size="sm" />
            <button onClick={() => setText('')} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>
        )}
      </div>

      {!text && (
        <p className="text-xs text-center text-slate-400 dark:text-slate-500">
          Average adult reads at 238 WPM — drag the slider above to set your personal speed.
        </p>
      )}
    </div>
  );
}
