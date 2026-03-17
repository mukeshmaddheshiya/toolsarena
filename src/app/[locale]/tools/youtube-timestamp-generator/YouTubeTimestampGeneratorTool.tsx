'use client';

import { useState, useCallback, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { Clock, Plus, X, GripVertical, RotateCcw, Copy, Check, ArrowUp, ArrowDown, Sparkles, FileText } from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────────── */

interface Timestamp {
  id: string;
  hours: number;
  minutes: number;
  seconds: number;
  title: string;
}

/* ── Helpers ───────────────────────────────────────────────────────── */

function formatTimestamp(t: Timestamp): string {
  if (t.hours > 0) {
    return `${t.hours}:${String(t.minutes).padStart(2, '0')}:${String(t.seconds).padStart(2, '0')}`;
  }
  return `${t.minutes}:${String(t.seconds).padStart(2, '0')}`;
}

function totalSeconds(t: Timestamp): number {
  return t.hours * 3600 + t.minutes * 60 + t.seconds;
}

function formatDuration(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/* ── Templates ─────────────────────────────────────────────────────── */

const TEMPLATES = [
  {
    name: 'Tutorial / How-To',
    icon: '📚',
    timestamps: [
      { title: 'Introduction', h: 0, m: 0, s: 0 },
      { title: 'What You Need', h: 0, m: 0, s: 30 },
      { title: 'Step 1: Setup', h: 0, m: 1, s: 15 },
      { title: 'Step 2: Main Process', h: 0, m: 3, s: 0 },
      { title: 'Step 3: Final Touches', h: 0, m: 6, s: 0 },
      { title: 'Results & Tips', h: 0, m: 8, s: 30 },
      { title: 'Conclusion', h: 0, m: 10, s: 0 },
    ],
  },
  {
    name: 'Podcast / Interview',
    icon: '🎙️',
    timestamps: [
      { title: 'Intro & Guest Introduction', h: 0, m: 0, s: 0 },
      { title: 'Topic 1', h: 0, m: 2, s: 0 },
      { title: 'Topic 2', h: 0, m: 10, s: 0 },
      { title: 'Topic 3', h: 0, m: 20, s: 0 },
      { title: 'Rapid Fire Questions', h: 0, m: 30, s: 0 },
      { title: 'Closing & Where to Find Guest', h: 0, m: 38, s: 0 },
    ],
  },
  {
    name: 'Review / Unboxing',
    icon: '📦',
    timestamps: [
      { title: 'Intro', h: 0, m: 0, s: 0 },
      { title: 'Unboxing', h: 0, m: 0, s: 30 },
      { title: 'First Impressions', h: 0, m: 2, s: 0 },
      { title: 'Design & Build', h: 0, m: 3, s: 30 },
      { title: 'Features & Specs', h: 0, m: 5, s: 0 },
      { title: 'Performance Test', h: 0, m: 7, s: 0 },
      { title: 'Pros & Cons', h: 0, m: 9, s: 0 },
      { title: 'Final Verdict', h: 0, m: 10, s: 30 },
    ],
  },
  {
    name: 'Music / Playlist',
    icon: '🎵',
    timestamps: [
      { title: 'Song 1 - Artist Name', h: 0, m: 0, s: 0 },
      { title: 'Song 2 - Artist Name', h: 0, m: 3, s: 45 },
      { title: 'Song 3 - Artist Name', h: 0, m: 7, s: 20 },
      { title: 'Song 4 - Artist Name', h: 0, m: 11, s: 0 },
      { title: 'Song 5 - Artist Name', h: 0, m: 14, s: 30 },
    ],
  },
  {
    name: 'Gaming',
    icon: '🎮',
    timestamps: [
      { title: 'Intro & Setup', h: 0, m: 0, s: 0 },
      { title: 'Gameplay Starts', h: 0, m: 1, s: 0 },
      { title: 'Epic Moment #1', h: 0, m: 5, s: 30 },
      { title: 'Boss Fight', h: 0, m: 12, s: 0 },
      { title: 'Epic Moment #2', h: 0, m: 18, s: 0 },
      { title: 'Final Thoughts', h: 0, m: 22, s: 0 },
    ],
  },
];

/* ── Component ─────────────────────────────────────────────────────── */

export function YouTubeTimestampGeneratorTool() {
  const [timestamps, setTimestamps] = useState<Timestamp[]>([
    { id: crypto.randomUUID(), hours: 0, minutes: 0, seconds: 0, title: 'Intro' },
  ]);
  const [copied, setCopied] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [showTemplates, setShowTemplates] = useState(true);

  // Drag state
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const addTimestamp = () => {
    const last = timestamps[timestamps.length - 1];
    const nextSecs = last ? totalSeconds(last) + 60 : 0;
    const h = Math.floor(nextSecs / 3600);
    const m = Math.floor((nextSecs % 3600) / 60);
    const s = nextSecs % 60;
    setTimestamps(prev => [...prev, { id: crypto.randomUUID(), hours: h, minutes: m, seconds: s, title: '' }]);
  };

  const removeTimestamp = (id: string) => {
    setTimestamps(prev => prev.filter(t => t.id !== id));
  };

  const updateTimestamp = (id: string, field: keyof Timestamp, value: string | number) => {
    setTimestamps(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const moveTimestamp = (index: number, direction: -1 | 1) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= timestamps.length) return;
    setTimestamps(prev => {
      const items = [...prev];
      [items[index], items[newIdx]] = [items[newIdx], items[index]];
      return items;
    });
  };

  const sortByTime = () => {
    setTimestamps(prev => [...prev].sort((a, b) => totalSeconds(a) - totalSeconds(b)));
  };

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setTimestamps(template.timestamps.map(t => ({
      id: crypto.randomUUID(),
      hours: t.h,
      minutes: t.m,
      seconds: t.s,
      title: t.title,
    })));
    setShowTemplates(false);
  };

  const clearAll = () => {
    setTimestamps([{ id: crypto.randomUUID(), hours: 0, minutes: 0, seconds: 0, title: 'Intro' }]);
    setVideoUrl('');
  };

  // Drag reorder
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setTimestamps(prev => {
      const items = [...prev];
      const [removed] = items.splice(dragIdx, 1);
      items.splice(idx, 0, removed);
      return items;
    });
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  // Output
  const output = useMemo(() => {
    const lines = timestamps
      .filter(t => t.title.trim())
      .map(t => `${formatTimestamp(t)} ${t.title.trim()}`);
    return lines.join('\n');
  }, [timestamps]);

  const outputWithUrl = useMemo(() => {
    if (!videoUrl.trim()) return output;
    return `${output}\n\n🔗 Watch: ${videoUrl.trim()}`;
  }, [output, videoUrl]);

  const chapterCount = timestamps.filter(t => t.title.trim()).length;
  const lastTs = timestamps[timestamps.length - 1];
  const totalDuration = lastTs ? totalSeconds(lastTs) : 0;
  const hasIntroAt0 = timestamps.length > 0 && totalSeconds(timestamps[0]) === 0;

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputWithUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* handled by CopyButton */ }
  };

  const inputClass = 'px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';

  return (
    <div className="space-y-5">
      {/* Templates */}
      {showTemplates && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" /> Start from Template
            </h3>
            <button onClick={() => setShowTemplates(false)} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              Skip
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {TEMPLATES.map(t => (
              <button key={t.name} onClick={() => applyTemplate(t)}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all text-left">
                <span className="text-2xl mb-1 block">{t.icon}</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{t.name}</span>
                <span className="text-[10px] text-slate-400 block">{t.timestamps.length} chapters</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span className="text-slate-700 dark:text-slate-300"><strong>{chapterCount}</strong> chapters</span>
          {totalDuration > 0 && (
            <span className="text-slate-400">• ~{formatDuration(totalDuration)}</span>
          )}
        </div>
        {!hasIntroAt0 && timestamps.length > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
            ⚠ YouTube chapters require first timestamp at 0:00
          </p>
        )}
      </div>

      {/* Timestamps editor */}
      <div className="space-y-2">
        {timestamps.map((t, i) => (
          <div key={t.id} draggable onDragStart={() => handleDragStart(i)}
            onDragOver={e => handleDragOver(e, i)} onDragEnd={handleDragEnd}
            className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
              dragIdx === i
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 opacity-60'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
            }`}>
            {/* Drag handle */}
            <div className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500">
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Chapter number */}
            <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>

            {/* Time inputs */}
            <div className="flex items-center gap-1 shrink-0">
              <input type="number" min={0} max={23} value={t.hours}
                onChange={e => updateTimestamp(t.id, 'hours', Math.max(0, parseInt(e.target.value) || 0))}
                className={`${inputClass} w-12 text-center font-mono text-xs`} placeholder="H" />
              <span className="text-slate-400 font-bold">:</span>
              <input type="number" min={0} max={59} value={t.minutes}
                onChange={e => updateTimestamp(t.id, 'minutes', Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                className={`${inputClass} w-12 text-center font-mono text-xs`} placeholder="MM" />
              <span className="text-slate-400 font-bold">:</span>
              <input type="number" min={0} max={59} value={t.seconds}
                onChange={e => updateTimestamp(t.id, 'seconds', Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                className={`${inputClass} w-12 text-center font-mono text-xs`} placeholder="SS" />
            </div>

            {/* Title */}
            <input type="text" value={t.title}
              onChange={e => updateTimestamp(t.id, 'title', e.target.value)}
              placeholder={`Chapter ${i + 1} title...`}
              className={`${inputClass} flex-1 min-w-0`} />

            {/* Move up/down */}
            <div className="flex flex-col gap-0.5 shrink-0">
              <button onClick={() => moveTimestamp(i, -1)} disabled={i === 0}
                className="p-0.5 text-slate-300 hover:text-slate-500 disabled:opacity-20 transition-colors">
                <ArrowUp className="w-3 h-3" />
              </button>
              <button onClick={() => moveTimestamp(i, 1)} disabled={i === timestamps.length - 1}
                className="p-0.5 text-slate-300 hover:text-slate-500 disabled:opacity-20 transition-colors">
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>

            {/* Remove */}
            <button onClick={() => removeTimestamp(t.id)}
              className="p-1 text-slate-300 hover:text-red-500 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={addTimestamp}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-800 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Chapter
        </button>
        <button onClick={sortByTime}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <Clock className="w-3.5 h-3.5" /> Sort by Time
        </button>
        <button onClick={() => setShowTemplates(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <Sparkles className="w-3.5 h-3.5" /> Templates
        </button>
        <button onClick={clearAll}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      {/* Optional video URL */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Video URL (optional — added to output)</label>
        <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className={`${inputClass} w-full`} />
      </div>

      {/* Output */}
      {chapterCount > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" /> Generated Timestamps
            </h3>
            <button onClick={copyOutput}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-primary-800 hover:bg-primary-700 text-white'
              }`}>
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Timestamps</>}
            </button>
          </div>
          <div className="relative">
            <pre className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {outputWithUrl}
            </pre>
            <div className="absolute top-2 right-2">
              <CopyButton text={outputWithUrl} size="sm" />
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Paste this in your YouTube video description. YouTube will automatically create chapters if the first timestamp is 0:00 and you have at least 3 timestamps.
          </p>
        </div>
      )}
    </div>
  );
}
