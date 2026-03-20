// app/tools/utility-tools/whatsapp-chat-analyzer/WhatsAppChatAnalyzerTool.tsx
'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Upload, MessageCircle, Users, Calendar, Flame, Hash,
  SmilePlus, Image, TrendingUp, Shield, X
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface ParsedMessage {
  timestamp: Date;
  sender: string;
  content: string;
  isMedia: boolean;
  isSystem: boolean;
}

interface ChatStats {
  totalMessages: number;
  totalWords: number;
  dateRange: { start: Date; end: Date };
  activeDays: number;
  senders: Record<string, number>;
  heatmap: number[][];          // [dayOfWeek 0-6][hour 0-23]
  topWords: [string, number][];
  topEmojis: [string, number][];
  mediaCount: number;
  longestStreak: number;
  peakDay: { date: string; count: number };
  avgWordsPerSender: Record<string, number>;
}

// ── Parser ─────────────────────────────────────────────────────────────────────
const IOS_REGEX = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\]\s+([^:]+):\s(.+)$/;
const ANDROID_REGEX = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}(?:\s*[AP]M)?)\s+-\s+([^:]+):\s(.+)$/;

function parseDate(dateStr: string, timeStr: string): Date | null {
  try {
    const combined = `${dateStr} ${timeStr}`;
    const d = new Date(combined);
    if (!isNaN(d.getTime())) return d;

    // Try DD/MM/YYYY format
    const [day, month, year] = dateStr.split('/');
    const fullYear = year.length === 2 ? `20${year}` : year;
    const iso = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timeStr.replace(' ', 'T')}`;
    const d2 = new Date(iso);
    return isNaN(d2.getTime()) ? null : d2;
  } catch {
    return null;
  }
}

const SYSTEM_PATTERNS = [
  /joined using this link/i, /was added/i, /left/i, /changed the subject/i,
  /changed this group/i, /Messages and calls are end-to-end encrypted/i,
  /created group/i, /added you/i, /security code changed/i,
];

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','by',
  'is','was','are','were','be','been','i','you','he','she','it','we','they',
  'this','that','have','has','do','did','will','not','no','so','ok','okay',
  'yes','yeah','yep','hi','hey','haha','lol','omg','so','na','ka','ko',
]);

function extractEmojis(text: string): string[] {
  const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
  return text.match(emojiRegex) ?? [];
}

function parseChat(raw: string): ParsedMessage[] {
  const lines = raw.split('\n');
  const messages: ParsedMessage[] = [];
  let currentMsg: ParsedMessage | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const iosMatch = trimmed.match(IOS_REGEX);
    const androidMatch = trimmed.match(ANDROID_REGEX);
    const match = iosMatch ?? androidMatch;

    if (match) {
      if (currentMsg) messages.push(currentMsg);
      const [, dateStr, timeStr, sender, content] = match;
      const timestamp = parseDate(dateStr.replace('[', ''), timeStr.replace(']', ''));
      if (!timestamp) continue;

      const isMedia = /<Media omitted>|<attached>|image omitted|video omitted|audio omitted|sticker omitted|document omitted/i.test(content);
      const isSystem = SYSTEM_PATTERNS.some((p) => p.test(content));

      currentMsg = { timestamp, sender: sender.trim(), content, isMedia, isSystem };
    } else if (currentMsg) {
      currentMsg.content += '\n' + trimmed;
    }
  }
  if (currentMsg) messages.push(currentMsg);
  return messages.filter((m) => !m.isSystem);
}

function computeStats(messages: ParsedMessage[]): ChatStats {
  if (messages.length === 0) throw new Error('No messages found');

  const senders: Record<string, number> = {};
  const senderWords: Record<string, number> = {};
  const heatmap: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  const wordFreq: Record<string, number> = {};
  const emojiFreq: Record<string, number> = {};
  const dailyCounts: Record<string, number> = {};
  let totalWords = 0;
  let mediaCount = 0;

  for (const msg of messages) {
    const { sender, content, timestamp, isMedia } = msg;
    senders[sender] = (senders[sender] ?? 0) + 1;

    const dow = timestamp.getDay();
    const hour = timestamp.getHours();
    heatmap[dow][hour]++;

    const dateKey = timestamp.toISOString().split('T')[0];
    dailyCounts[dateKey] = (dailyCounts[dateKey] ?? 0) + 1;

    if (isMedia) {
      mediaCount++;
    } else {
      const words = content.match(/\b[a-zA-Z\u0900-\u097F]+\b/g) ?? [];
      totalWords += words.length;
      senderWords[sender] = (senderWords[sender] ?? 0) + words.length;
      words.forEach((w) => {
        const lower = w.toLowerCase();
        if (!STOP_WORDS.has(lower) && lower.length > 2) {
          wordFreq[lower] = (wordFreq[lower] ?? 0) + 1;
        }
      });
      const emojis = extractEmojis(content);
      emojis.forEach((e) => { emojiFreq[e] = (emojiFreq[e] ?? 0) + 1; });
    }
  }

  const sortedDates = Object.keys(dailyCounts).sort();
  const activeDays = sortedDates.length;

  // Longest streak
  let longestStreak = 1;
  let currentStreak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  // Peak day
  const peakDateKey = sortedDates.reduce((a, b) => (dailyCounts[a] > dailyCounts[b] ? a : b));

  // Avg words per sender
  const avgWordsPerSender: Record<string, number> = {};
  for (const s of Object.keys(senders)) {
    avgWordsPerSender[s] = senders[s] > 0 ? Math.round((senderWords[s] ?? 0) / senders[s]) : 0;
  }

  return {
    totalMessages: messages.length,
    totalWords,
    dateRange: {
      start: messages[0].timestamp,
      end: messages[messages.length - 1].timestamp,
    },
    activeDays,
    senders,
    heatmap,
    topWords: Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 20) as [string, number][],
    topEmojis: Object.entries(emojiFreq).sort((a, b) => b[1] - a[1]).slice(0, 20) as [string, number][],
    mediaCount,
    longestStreak,
    peakDay: { date: peakDateKey, count: dailyCounts[peakDateKey] },
    avgWordsPerSender,
  };
}

// ── Heatmap ────────────────────────────────────────────────────────────────────
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function HeatmapGrid({ heatmap }: { heatmap: number[][] }) {
  const max = Math.max(...heatmap.flatMap((r) => r));
  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        <div className="flex gap-1 mb-1 ml-10">
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="w-7 text-center text-[9px] text-slate-600">
              {h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`}
            </div>
          ))}
        </div>
        {heatmap.map((row, d) => (
          <div key={d} className="flex items-center gap-1 mb-1">
            <div className="w-9 text-[10px] text-slate-500 text-right pr-1">{DAYS[d]}</div>
            {row.map((val, h) => {
              const intensity = max > 0 ? val / max : 0;
              return (
                <div
                  key={h}
                  className="w-7 h-5 rounded-sm transition-all"
                  style={{
                    backgroundColor: `rgba(99, 102, 241, ${intensity > 0 ? 0.1 + intensity * 0.9 : 0})`,
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                  }}
                  title={`${DAYS[d]} ${h}:00 — ${val} messages`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
type TabKey = 'overview' | 'senders' | 'heatmap' | 'words' | 'emojis';

export function WhatsAppChatAnalyzerTool() {
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    setLoading(true);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const messages = parseChat(text);
        if (messages.length === 0) {
          setError('No messages could be parsed. Please ensure this is a valid WhatsApp export .txt file.');
          setStats(null);
        } else {
          const s = computeStats(messages);
          setStats(s);
        }
      } catch (err) {
        setError(`Parse error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setStats(null);
      } finally {
        setLoading(false);
        // Clear file from memory
        if (fileRef.current) fileRef.current.value = '';
      }
    };
    reader.readAsText(file, 'utf-8');
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const reset = () => {
    setStats(null);
    setError(null);
    setFileName(null);
    setLoading(false);
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { key: 'senders', label: 'Senders', icon: <Users className="w-3.5 h-3.5" /> },
    { key: 'heatmap', label: 'Heatmap', icon: <Flame className="w-3.5 h-3.5" /> },
    { key: 'words', label: 'Top Words', icon: <Hash className="w-3.5 h-3.5" /> },
    { key: 'emojis', label: 'Emojis', icon: <SmilePlus className="w-3.5 h-3.5" /> },
  ];

  // Privacy banner
  const PrivacyBanner = () => (
    <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
      <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
      <p className="text-xs text-emerald-300 leading-relaxed">
        <strong>100% Private</strong> — Your chat is processed entirely in your browser.
        No data is uploaded to any server. Your conversation stays on your device.
      </p>
    </div>
  );

  return (
    <div className="space-y-5">
      <PrivacyBanner />

      {!stats && (
        <div>
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-slate-600 hover:border-indigo-500 rounded-xl p-10 text-center transition-colors cursor-pointer group"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="w-10 h-10 text-slate-600 group-hover:text-indigo-400 mx-auto mb-3 transition-colors" />
            <p className="text-slate-300 font-medium mb-1">Drop your WhatsApp .txt export here</p>
            <p className="text-slate-500 text-sm">or click to browse</p>
            {loading && <p className="text-indigo-400 text-sm mt-3 animate-pulse">Parsing chat...</p>}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".txt"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          {error && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Export instructions */}
          <div className="mt-4 p-4 bg-slate-800/60 rounded-xl border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-indigo-400" />
              How to export your WhatsApp chat
            </h3>
            <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
              <li>Open the chat in WhatsApp</li>
              <li>Tap the three-dot menu (⋮) at the top right</li>
              <li>Select <strong className="text-slate-300">More</strong> → <strong className="text-slate-300">Export Chat</strong></li>
              <li>Choose <strong className="text-slate-300">Without Media</strong></li>
              <li>Save the .txt file and upload it here</li>
            </ol>
          </div>
        </div>
      )}

      {stats && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-medium text-slate-300">{fileName}</span>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded hover:bg-slate-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Analyze another
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === t.key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Messages', value: stats.totalMessages.toLocaleString(), icon: <MessageCircle className="w-4 h-4" /> },
                  { label: 'Total Words', value: stats.totalWords.toLocaleString(), icon: <Hash className="w-4 h-4" /> },
                  { label: 'Active Days', value: stats.activeDays.toLocaleString(), icon: <Calendar className="w-4 h-4" /> },
                  { label: 'Media Shared', value: stats.mediaCount.toLocaleString(), icon: <Image className="w-4 h-4" /> },
                ].map((s) => (
                  <div key={s.label} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 text-indigo-400 mb-2">{s.icon}</div>
                    <div className="text-xl font-bold text-slate-100">{s.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-500 mb-1">Date Range</div>
                  <div className="text-sm text-slate-200">
                    {stats.dateRange.start.toLocaleDateString()} — {stats.dateRange.end.toLocaleDateString()}
                  </div>
                </div>
                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-500 mb-1">Longest Streak</div>
                  <div className="text-sm text-slate-200">
                    <span className="text-amber-400 font-bold">{stats.longestStreak}</span> consecutive days
                  </div>
                </div>
                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-500 mb-1">Peak Day</div>
                  <div className="text-sm text-slate-200">
                    {stats.peakDay.date} — <span className="text-indigo-400 font-bold">{stats.peakDay.count}</span> messages
                  </div>
                </div>
                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-500 mb-1">Participants</div>
                  <div className="text-sm text-slate-200">
                    <span className="text-indigo-400 font-bold">{Object.keys(stats.senders).length}</span> senders
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Senders */}
          {activeTab === 'senders' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300">Top Senders by Message Count</h3>
              {Object.entries(stats.senders)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([sender, count], i) => {
                  const maxCount = Object.values(stats.senders).reduce((a, b) => Math.max(a, b), 0);
                  const pct = Math.round((count / stats.totalMessages) * 100);
                  const barW = Math.round((count / maxCount) * 100);
                  const colors = [
                    'bg-indigo-500', 'bg-sky-500', 'bg-emerald-500',
                    'bg-amber-500', 'bg-purple-500', 'bg-pink-500',
                    'bg-teal-500', 'bg-orange-500', 'bg-rose-500', 'bg-cyan-500',
                  ];
                  return (
                    <div key={sender}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-300 truncate max-w-[60%]">{sender}</span>
                        <div className="text-xs text-slate-500 flex gap-2">
                          <span>{count.toLocaleString()} msgs</span>
                          <span>{pct}%</span>
                          <span>{stats.avgWordsPerSender[sender] ?? 0} avg words</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${colors[i % colors.length]}`}
                          style={{ width: `${barW}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Heatmap */}
          {activeTab === 'heatmap' && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Activity Heatmap (Day × Hour)</h3>
              <HeatmapGrid heatmap={stats.heatmap} />
              <p className="text-xs text-slate-600 mt-2">Darker cells = more messages. Hover for exact count.</p>
            </div>
          )}

          {/* Top words */}
          {activeTab === 'words' && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Top 20 Words (stop words excluded)</h3>
              <div className="flex flex-wrap gap-2">
                {stats.topWords.map(([word, count]) => {
                  const maxC = stats.topWords[0]?.[1] ?? 1;
                  const intensity = count / maxC;
                  return (
                    <span
                      key={word}
                      className="px-2.5 py-1 rounded-lg text-sm bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      style={{ opacity: 0.4 + intensity * 0.6, fontSize: `${0.75 + intensity * 0.35}rem` }}
                      title={`${count} times`}
                    >
                      {word} <span className="text-xs opacity-60">{count}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Emojis */}
          {activeTab === 'emojis' && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Most Used Emojis</h3>
              {stats.topEmojis.length === 0 ? (
                <p className="text-slate-500 text-sm">No emojis found in this chat.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {stats.topEmojis.map(([emoji, count]) => (
                    <div key={emoji} className="flex flex-col items-center p-2 bg-slate-800/60 rounded-xl border border-slate-700 min-w-[56px]">
                      <span className="text-2xl">{emoji}</span>
                      <span className="text-xs text-slate-400 mt-1">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <PrivacyBanner />
        </div>
      )}
    </div>
  );
}
