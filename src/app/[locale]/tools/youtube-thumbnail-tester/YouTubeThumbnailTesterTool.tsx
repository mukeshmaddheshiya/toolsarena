'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  Image as ImageIcon,
  Monitor,
  Search,
  Smartphone,
  LayoutGrid,
  Vote,
  Download,
  RotateCcw,
  Shield,
  Sun,
  Moon,
  Lightbulb,
  Eye,
  Type,
  Smile,
  Clock,
  ThumbsUp,
  MoreVertical,
  Play,
  Trash2,
  Sparkles,
  History,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────

interface ThumbnailData {
  id: string;
  src: string;
  name: string;
}

interface VideoMetadata {
  title: string;
  channel: string;
  views: string;
  uploadDate: string;
}

interface VoteRecord {
  [thumbnailId: string]: number;
}

interface HistoryEntry {
  id: string;
  date: string;
  thumbnailCount: number;
  metadata: VideoMetadata;
  votes: VoteRecord;
}

type PreviewTab = 'homepage' | 'search' | 'sidebar' | 'mobile';

// ─── Helpers ─────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function formatNumber(num: string): string {
  const n = parseInt(num.replace(/,/g, ''), 10);
  if (isNaN(n)) return num;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
}

const STORAGE_KEY = 'yt-thumb-tester-history';

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 5)));
  } catch {
    // storage full — ignore
  }
}

// ─── Placeholder colors for "Try Example" ───────────────────────────

const EXAMPLE_COLORS = [
  { bg: '#FF0000', label: 'Thumbnail A — Bold Red' },
  { bg: '#1E90FF', label: 'Thumbnail B — Blue Sky' },
  { bg: '#FFD700', label: 'Thumbnail C — Gold Rush' },
];

function createColorPlaceholder(bg: string, label: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1280, 720);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 640, 360);
  return canvas.toDataURL('image/png');
}

// ─── Analysis helpers ────────────────────────────────────────────────

interface AnalysisTip {
  icon: React.ReactNode;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info';
}

function analyzeThumbnail(img: HTMLImageElement): AnalysisTip[] {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0);

  const tips: AnalysisTip[] = [];
  const w = canvas.width;
  const h = canvas.height;

  // sample pixels for brightness / contrast
  const sampleSize = 50;
  let totalBrightness = 0;
  let minBright = 255;
  let maxBright = 0;
  let count = 0;

  for (let sx = 0; sx < sampleSize; sx++) {
    for (let sy = 0; sy < sampleSize; sy++) {
      const px = Math.floor((sx / sampleSize) * w);
      const py = Math.floor((sy / sampleSize) * h);
      const pixel = ctx.getImageData(px, py, 1, 1).data;
      const brightness = 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2];
      totalBrightness += brightness;
      minBright = Math.min(minBright, brightness);
      maxBright = Math.max(maxBright, brightness);
      count++;
    }
  }

  const avgBrightness = totalBrightness / count;
  const contrastRange = maxBright - minBright;

  if (contrastRange > 150) {
    tips.push({
      icon: <Eye className="w-4 h-4" />,
      title: 'Good Contrast',
      description: 'High contrast range detected — your thumbnail will stand out in feeds.',
      type: 'success',
    });
  } else if (contrastRange > 80) {
    tips.push({
      icon: <Eye className="w-4 h-4" />,
      title: 'Moderate Contrast',
      description: 'Contrast is acceptable. Consider stronger highlights or shadows.',
      type: 'warning',
    });
  } else {
    tips.push({
      icon: <Eye className="w-4 h-4" />,
      title: 'Low Contrast',
      description: 'The image appears flat. Increase brightness/shadow difference for more impact.',
      type: 'warning',
    });
  }

  if (avgBrightness < 60) {
    tips.push({
      icon: <Sun className="w-4 h-4" />,
      title: 'Very Dark Image',
      description: 'Dark thumbnails can get lost on dark-mode YouTube. Add bright accents or text.',
      type: 'warning',
    });
  } else if (avgBrightness > 200) {
    tips.push({
      icon: <Sun className="w-4 h-4" />,
      title: 'Very Bright Image',
      description: 'Extremely bright thumbnails may look washed out. Add darker elements for depth.',
      type: 'warning',
    });
  }

  // aspect ratio
  const ratio = w / h;
  if (Math.abs(ratio - 16 / 9) < 0.1) {
    tips.push({
      icon: <Monitor className="w-4 h-4" />,
      title: 'Perfect Aspect Ratio',
      description: '16:9 ratio matches YouTube\'s native thumbnail format.',
      type: 'success',
    });
  } else {
    tips.push({
      icon: <Monitor className="w-4 h-4" />,
      title: 'Non-standard Ratio',
      description: `Current ratio is ${ratio.toFixed(2)}:1. YouTube uses 16:9 (1.78:1) — your thumbnail may be cropped.`,
      type: 'warning',
    });
  }

  // resolution
  if (w >= 1280) {
    tips.push({
      icon: <ImageIcon className="w-4 h-4" />,
      title: 'High Resolution',
      description: `${w}x${h} — great quality for all screen sizes.`,
      type: 'success',
    });
  } else {
    tips.push({
      icon: <ImageIcon className="w-4 h-4" />,
      title: 'Low Resolution',
      description: `${w}x${h} — recommended minimum is 1280x720 for crisp thumbnails.`,
      type: 'warning',
    });
  }

  tips.push({
    icon: <Type className="w-4 h-4" />,
    title: 'Text Readability',
    description: 'Use large, bold text (3-5 words max). Ensure text contrasts with background.',
    type: 'info',
  });

  tips.push({
    icon: <Smile className="w-4 h-4" />,
    title: 'Face Detection Tip',
    description: 'Thumbnails with expressive faces get up to 38% higher CTR. Include a face if relevant.',
    type: 'info',
  });

  return tips;
}

// ─── Confetti burst ──────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
  size: number;
}

function ConfettiBurst({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    const colors = ['#FF0000', '#FFD700', '#00FF00', '#1E90FF', '#FF69B4', '#FFA500'];
    const newParticles: Particle[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      color: colors[i % colors.length],
      angle: (i / 24) * 360,
      speed: 80 + Math.random() * 60,
      size: 4 + Math.random() * 6,
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 800);
    return () => clearTimeout(timer);
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.speed;
        const ty = Math.sin(rad) * p.speed;
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              left: '50%',
              top: '50%',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: tx, y: ty, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

// ─── Preview Tab Buttons ─────────────────────────────────────────────

const PREVIEW_TABS: { key: PreviewTab; label: string; icon: React.ReactNode }[] = [
  { key: 'homepage', label: 'Homepage', icon: <LayoutGrid className="w-4 h-4" /> },
  { key: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
  { key: 'sidebar', label: 'Sidebar', icon: <Monitor className="w-4 h-4" /> },
  { key: 'mobile', label: 'Mobile', icon: <Smartphone className="w-4 h-4" /> },
];

// ─── YouTube Mockup Components ───────────────────────────────────────

function YTTimestamp() {
  return (
    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1 py-0.5 rounded">
      12:34
    </span>
  );
}

function YTChannelAvatar({ dark }: { dark: boolean }) {
  return (
    <div className={`w-9 h-9 rounded-full flex-shrink-0 ${dark ? 'bg-zinc-600' : 'bg-gray-300'}`} />
  );
}

function YTVerifiedBadge() {
  return (
    <svg className="w-3 h-3 ml-0.5 inline" viewBox="0 0 24 24" fill="currentColor" opacity={0.6}>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function PlaceholderCard({ dark }: { dark: boolean }) {
  return (
    <div className="space-y-2">
      <div className={`aspect-video rounded-xl ${dark ? 'bg-zinc-700' : 'bg-gray-200'} relative`}>
        <YTTimestamp />
      </div>
      <div className="flex gap-2">
        <YTChannelAvatar dark={dark} />
        <div className="flex-1 space-y-1">
          <div className={`h-3 ${dark ? 'bg-zinc-600' : 'bg-gray-200'} rounded w-full`} />
          <div className={`h-3 ${dark ? 'bg-zinc-600' : 'bg-gray-200'} rounded w-3/4`} />
          <div className={`h-2 ${dark ? 'bg-zinc-700' : 'bg-gray-100'} rounded w-1/2 mt-1`} />
        </div>
      </div>
    </div>
  );
}

function HomepagePreview({
  thumbnails,
  meta,
  dark,
}: {
  thumbnails: ThumbnailData[];
  meta: VideoMetadata;
  dark: boolean;
}) {
  const bg = dark ? 'bg-zinc-900' : 'bg-white';
  const text = dark ? 'text-white' : 'text-zinc-900';
  const sub = dark ? 'text-zinc-400' : 'text-zinc-500';

  // build a grid: thumbnails interspersed with placeholders
  const items: (ThumbnailData | null)[] = [];
  thumbnails.forEach((t, i) => {
    if (i > 0) items.push(null); // placeholder between
    items.push(t);
  });
  // pad to at least 8
  while (items.length < 8) items.push(null);

  return (
    <div className={`${bg} rounded-xl p-4 sm:p-6`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, idx) =>
          item ? (
            <div key={item.id} className="space-y-2 group cursor-pointer">
              <div className="aspect-video rounded-xl overflow-hidden relative">
                <img
                  src={item.src}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <YTTimestamp />
              </div>
              <div className="flex gap-2">
                <YTChannelAvatar dark={dark} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-tight line-clamp-2 ${text}`}>
                    {meta.title || 'My YouTube Video'}
                  </p>
                  <p className={`text-xs mt-1 ${sub}`}>
                    {meta.channel || 'My Channel'}
                    <YTVerifiedBadge />
                  </p>
                  <p className={`text-xs ${sub}`}>
                    {formatNumber(meta.views || '125000')} &middot; {meta.uploadDate || '2 days ago'}
                  </p>
                </div>
                <MoreVertical className={`w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-60 ${text}`} />
              </div>
            </div>
          ) : (
            <PlaceholderCard key={`ph-${idx}`} dark={dark} />
          )
        )}
      </div>
    </div>
  );
}

function SearchPreview({
  thumbnails,
  meta,
  dark,
}: {
  thumbnails: ThumbnailData[];
  meta: VideoMetadata;
  dark: boolean;
}) {
  const bg = dark ? 'bg-zinc-900' : 'bg-white';
  const text = dark ? 'text-white' : 'text-zinc-900';
  const sub = dark ? 'text-zinc-400' : 'text-zinc-500';
  const desc = dark ? 'text-zinc-500' : 'text-zinc-400';

  return (
    <div className={`${bg} rounded-xl p-4 sm:p-6 space-y-4`}>
      {/* Search bar mockup */}
      <div className={`flex items-center gap-2 rounded-full border ${dark ? 'border-zinc-700 bg-zinc-800' : 'border-gray-300 bg-gray-50'} px-4 py-2 max-w-xl`}>
        <Search className={`w-4 h-4 ${sub}`} />
        <span className={`text-sm ${sub}`}>{meta.title || 'Search query...'}</span>
      </div>
      <div className="space-y-4">
        {thumbnails.map((thumb) => (
          <div key={thumb.id} className="flex gap-4 group cursor-pointer">
            <div className="w-[360px] max-w-[45%] flex-shrink-0 aspect-video rounded-xl overflow-hidden relative">
              <img
                src={thumb.src}
                alt={thumb.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <YTTimestamp />
            </div>
            <div className="flex-1 min-w-0 py-1">
              <p className={`text-lg font-medium leading-snug line-clamp-2 ${text}`}>
                {meta.title || 'My YouTube Video'}
              </p>
              <p className={`text-xs mt-1 ${sub}`}>
                {formatNumber(meta.views || '125000')} &middot; {meta.uploadDate || '2 days ago'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-6 h-6 rounded-full ${dark ? 'bg-zinc-600' : 'bg-gray-300'}`} />
                <p className={`text-xs ${sub}`}>
                  {meta.channel || 'My Channel'}
                  <YTVerifiedBadge />
                </p>
              </div>
              <p className={`text-xs mt-2 line-clamp-2 ${desc}`}>
                This is a preview of how your thumbnail appears in YouTube search results.
                Make sure it grabs attention even at smaller sizes.
              </p>
            </div>
          </div>
        ))}
        {/* placeholder results */}
        {[1, 2].map((i) => (
          <div key={`ph-${i}`} className="flex gap-4">
            <div className={`w-[360px] max-w-[45%] flex-shrink-0 aspect-video rounded-xl ${dark ? 'bg-zinc-700' : 'bg-gray-200'} relative`}>
              <YTTimestamp />
            </div>
            <div className="flex-1 space-y-2 py-1">
              <div className={`h-4 ${dark ? 'bg-zinc-600' : 'bg-gray-200'} rounded w-3/4`} />
              <div className={`h-3 ${dark ? 'bg-zinc-700' : 'bg-gray-100'} rounded w-1/2`} />
              <div className={`h-3 ${dark ? 'bg-zinc-700' : 'bg-gray-100'} rounded w-2/3 mt-2`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarPreview({
  thumbnails,
  meta,
  dark,
}: {
  thumbnails: ThumbnailData[];
  meta: VideoMetadata;
  dark: boolean;
}) {
  const bg = dark ? 'bg-zinc-900' : 'bg-white';
  const text = dark ? 'text-white' : 'text-zinc-900';
  const sub = dark ? 'text-zinc-400' : 'text-zinc-500';

  const allItems: (ThumbnailData | null)[] = [];
  thumbnails.forEach((t) => allItems.push(t));
  while (allItems.length < 6) allItems.push(null);

  return (
    <div className={`${bg} rounded-xl p-4 sm:p-6`}>
      <div className="flex gap-6">
        {/* Main video area */}
        <div className="flex-1 hidden md:block">
          <div className={`aspect-video rounded-xl ${dark ? 'bg-zinc-800' : 'bg-gray-100'} flex items-center justify-center`}>
            <Play className={`w-16 h-16 ${dark ? 'text-zinc-600' : 'text-gray-300'}`} />
          </div>
          <p className={`text-lg font-semibold mt-3 ${text}`}>Currently Watching Video</p>
          <p className={`text-sm ${sub}`}>Some Channel &middot; 1.2M views</p>
        </div>
        {/* Sidebar */}
        <div className="w-full md:w-[400px] space-y-3">
          <p className={`text-xs font-semibold uppercase tracking-wide ${sub}`}>Up next</p>
          {allItems.map((item, idx) =>
            item ? (
              <div key={item.id} className="flex gap-2 group cursor-pointer">
                <div className="w-[168px] flex-shrink-0 aspect-video rounded-lg overflow-hidden relative">
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <YTTimestamp />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium leading-tight line-clamp-2 ${text}`}>
                    {meta.title || 'My YouTube Video'}
                  </p>
                  <p className={`text-[11px] mt-1 ${sub}`}>
                    {meta.channel || 'My Channel'}
                  </p>
                  <p className={`text-[11px] ${sub}`}>
                    {formatNumber(meta.views || '125000')}
                  </p>
                </div>
              </div>
            ) : (
              <div key={`ph-${idx}`} className="flex gap-2">
                <div className={`w-[168px] flex-shrink-0 aspect-video rounded-lg ${dark ? 'bg-zinc-700' : 'bg-gray-200'} relative`}>
                  <YTTimestamp />
                </div>
                <div className="flex-1 space-y-1">
                  <div className={`h-3 ${dark ? 'bg-zinc-600' : 'bg-gray-200'} rounded w-full`} />
                  <div className={`h-3 ${dark ? 'bg-zinc-600' : 'bg-gray-200'} rounded w-3/4`} />
                  <div className={`h-2 ${dark ? 'bg-zinc-700' : 'bg-gray-100'} rounded w-1/2`} />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function MobilePreview({
  thumbnails,
  meta,
  dark,
}: {
  thumbnails: ThumbnailData[];
  meta: VideoMetadata;
  dark: boolean;
}) {
  const bg = dark ? 'bg-zinc-900' : 'bg-white';
  const text = dark ? 'text-white' : 'text-zinc-900';
  const sub = dark ? 'text-zinc-400' : 'text-zinc-500';

  const items: (ThumbnailData | null)[] = [...thumbnails];
  items.push(null);
  items.push(null);

  return (
    <div className="flex justify-center">
      <div className={`${bg} rounded-3xl border-4 ${dark ? 'border-zinc-700' : 'border-gray-300'} w-full max-w-[400px] overflow-hidden`}>
        {/* Status bar */}
        <div className={`flex justify-between items-center px-4 py-2 text-[10px] ${sub}`}>
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <div className={`w-4 h-2 rounded-sm ${dark ? 'bg-zinc-500' : 'bg-gray-400'}`} />
          </div>
        </div>
        {/* YouTube mobile header */}
        <div className={`flex items-center justify-between px-3 py-2 border-b ${dark ? 'border-zinc-800' : 'border-gray-100'}`}>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center">
              <Play className="w-3 h-3 text-white fill-white" />
            </div>
            <span className={`text-sm font-bold ${text}`}>YouTube</span>
          </div>
          <Search className={`w-4 h-4 ${sub}`} />
        </div>
        {/* Feed */}
        <div className="space-y-4 pb-4">
          {items.map((item, idx) =>
            item ? (
              <div key={item.id} className="cursor-pointer">
                <div className="aspect-video w-full relative">
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <YTTimestamp />
                </div>
                <div className="flex gap-3 px-3 pt-3">
                  <YTChannelAvatar dark={dark} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-tight line-clamp-2 ${text}`}>
                      {meta.title || 'My YouTube Video'}
                    </p>
                    <p className={`text-xs mt-0.5 ${sub}`}>
                      {meta.channel || 'My Channel'} &middot; {formatNumber(meta.views || '125000')} &middot; {meta.uploadDate || '2 days ago'}
                    </p>
                  </div>
                  <MoreVertical className={`w-4 h-4 flex-shrink-0 ${sub}`} />
                </div>
              </div>
            ) : (
              <div key={`ph-${idx}`}>
                <div className={`aspect-video w-full ${dark ? 'bg-zinc-700' : 'bg-gray-200'} relative`}>
                  <YTTimestamp />
                </div>
                <div className="flex gap-3 px-3 pt-3">
                  <YTChannelAvatar dark={dark} />
                  <div className="flex-1 space-y-1">
                    <div className={`h-3 ${dark ? 'bg-zinc-600' : 'bg-gray-200'} rounded w-full`} />
                    <div className={`h-2 ${dark ? 'bg-zinc-700' : 'bg-gray-100'} rounded w-2/3`} />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────

export function YouTubeThumbnailTesterTool() {
  const [thumbnails, setThumbnails] = useState<ThumbnailData[]>([]);
  const [metadata, setMetadata] = useState<VideoMetadata>({
    title: '',
    channel: '',
    views: '',
    uploadDate: '',
  });
  const [activeTab, setActiveTab] = useState<PreviewTab>('homepage');
  const [darkMockup, setDarkMockup] = useState(false);
  const [voteMode, setVoteMode] = useState(false);
  const [votes, setVotes] = useState<VoteRecord>({});
  const [votePair, setVotePair] = useState<[number, number]>([0, 1]);
  const [voteBurstId, setVoteBurstId] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisTips, setAnalysisTips] = useState<Record<string, AnalysisTip[]>>({});
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  // load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // ─── File handling ───────────────────────────────────────────────

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const remaining = 4 - thumbnails.length;
      if (remaining <= 0) return;
      const toProcess = Array.from(files).slice(0, remaining);

      toProcess.forEach((file) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          setThumbnails((prev) => {
            if (prev.length >= 4) return prev;
            return [...prev, { id: generateId(), src, name: file.name }];
          });
        };
        reader.readAsDataURL(file);
      });
    },
    [thumbnails.length]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) processFiles(e.target.files);
      e.target.value = '';
    },
    [processFiles]
  );

  const removeThumbnail = (id: string) => {
    setThumbnails((prev) => prev.filter((t) => t.id !== id));
    setVotes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setAnalysisTips((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (selectedAnalysis === id) setSelectedAnalysis(null);
  };

  // ─── Try Example ─────────────────────────────────────────────────

  const loadExample = () => {
    const examples = EXAMPLE_COLORS.map((c) => ({
      id: generateId(),
      src: createColorPlaceholder(c.bg, c.label),
      name: c.label,
    }));
    setThumbnails(examples);
    setMetadata({
      title: 'How I Gained 100K Subscribers in 30 Days',
      channel: 'Creator Academy',
      views: '1250000',
      uploadDate: '2 days ago',
    });
    setVotes({});
    setVoteBurstId(null);
    setShowAnalysis(false);
    setAnalysisTips({});
  };

  // ─── Vote mode ───────────────────────────────────────────────────

  const castVote = (thumbId: string) => {
    setVotes((prev) => ({ ...prev, [thumbId]: (prev[thumbId] || 0) + 1 }));
    setVoteBurstId(thumbId);
    setTimeout(() => setVoteBurstId(null), 800);

    // rotate pair
    if (thumbnails.length > 2) {
      setVotePair((prev) => {
        const next1 = (prev[1] + 1) % thumbnails.length;
        const next0 = next1 === prev[0] ? (next1 + 1) % thumbnails.length : prev[0];
        return [next0 === next1 ? (next1 + 1) % thumbnails.length : next0, next1];
      });
    }
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  // ─── Analysis ────────────────────────────────────────────────────

  const runAnalysis = () => {
    setShowAnalysis(true);
    thumbnails.forEach((thumb) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const tips = analyzeThumbnail(img);
        setAnalysisTips((prev) => ({ ...prev, [thumb.id]: tips }));
      };
      img.src = thumb.src;
    });
    if (thumbnails.length > 0) setSelectedAnalysis(thumbnails[0].id);
  };

  // ─── Export PNG ──────────────────────────────────────────────────

  const exportComparison = async () => {
    if (!comparisonRef.current) return;
    const html2canvas = (await import('html2canvas-pro')).default;
    const canvas = await html2canvas(comparisonRef.current, {
      backgroundColor: darkMockup ? '#18181b' : '#ffffff',
      useCORS: true,
    });
    const link = document.createElement('a');
    link.download = 'thumbnail-comparison.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // ─── History ─────────────────────────────────────────────────────

  const saveToHistory = () => {
    const entry: HistoryEntry = {
      id: generateId(),
      date: new Date().toISOString(),
      thumbnailCount: thumbnails.length,
      metadata: { ...metadata },
      votes: { ...votes },
    };
    const updated = [entry, ...history].slice(0, 5);
    setHistory(updated);
    saveHistory(updated);
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    setMetadata(entry.metadata);
    setVotes(entry.votes);
    setShowHistory(false);
  };

  // ─── Reset ───────────────────────────────────────────────────────

  const handleReset = () => {
    if (thumbnails.length > 0) saveToHistory();
    setThumbnails([]);
    setMetadata({ title: '', channel: '', views: '', uploadDate: '' });
    setVotes({});
    setVoteBurstId(null);
    setVoteMode(false);
    setShowAnalysis(false);
    setAnalysisTips({});
    setSelectedAnalysis(null);
    setActiveTab('homepage');
  };

  // ─── Render ──────────────────────────────────────────────────────

  const hasThumbnails = thumbnails.length > 0;
  const canVote = thumbnails.length >= 2;

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Upload Thumbnails
            <span className="text-sm font-normal text-zinc-500 ml-2">
              ({thumbnails.length}/4)
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={loadExample}
              className="text-sm px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Try Example
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
          </div>
        </div>

        {/* History panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Recent Tests</p>
                {history.length === 0 ? (
                  <p className="text-xs text-zinc-500">No saved tests yet.</p>
                ) : (
                  history.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => loadFromHistory(entry)}
                      className="w-full text-left p-3 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-sm"
                    >
                      <span className="font-medium text-zinc-900 dark:text-white">
                        {entry.metadata.title || 'Untitled Test'}
                      </span>
                      <span className="text-zinc-500 ml-2">
                        {entry.thumbnailCount} thumbnails &middot;{' '}
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drop zone */}
        {thumbnails.length < 4 && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${
              dragOver
                ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-red-400 dark:hover:border-red-500 bg-zinc-50 dark:bg-zinc-800/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload
              className={`w-10 h-10 mx-auto mb-3 ${
                dragOver ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500'
              }`}
            />
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Drop thumbnails here or click to browse
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              PNG, JPG, WebP up to 5MB each &middot; Max 4 thumbnails
            </p>
          </div>
        )}

        {/* Uploaded thumbnails */}
        {hasThumbnails && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {thumbnails.map((thumb, i) => (
              <motion.div
                key={thumb.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="aspect-video rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
                  <img
                    src={thumb.src}
                    alt={thumb.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeThumbnail(thumb.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] text-zinc-500 mt-1 truncate text-center">
                  Thumbnail {String.fromCharCode(65 + i)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Metadata Editor */}
      {hasThumbnails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"
        >
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Video Metadata
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Video Title
              </label>
              <input
                type="text"
                value={metadata.title}
                onChange={(e) => setMetadata((m) => ({ ...m, title: e.target.value }))}
                placeholder="How I Gained 100K Subscribers"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Channel Name
              </label>
              <input
                type="text"
                value={metadata.channel}
                onChange={(e) => setMetadata((m) => ({ ...m, channel: e.target.value }))}
                placeholder="Creator Academy"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                View Count
              </label>
              <input
                type="text"
                value={metadata.views}
                onChange={(e) => setMetadata((m) => ({ ...m, views: e.target.value }))}
                placeholder="1250000"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Upload Date
              </label>
              <input
                type="text"
                value={metadata.uploadDate}
                onChange={(e) => setMetadata((m) => ({ ...m, uploadDate: e.target.value }))}
                placeholder="2 days ago"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Controls Bar */}
      {hasThumbnails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Preview tabs */}
            <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
              {PREVIEW_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setVoteMode(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key && !voteMode
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
              {canVote && (
                <button
                  onClick={() => setVoteMode(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    voteMode
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  <Vote className="w-4 h-4" />
                  <span className="hidden sm:inline">Vote</span>
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMockup(!darkMockup)}
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                title={darkMockup ? 'Switch to light mockup' : 'Switch to dark mockup'}
              >
                {darkMockup ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={runAnalysis}
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                title="Analyze thumbnails"
              >
                <Lightbulb className="w-4 h-4" />
              </button>
              <button
                onClick={exportComparison}
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                title="Download comparison as PNG"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Preview Area */}
      {hasThumbnails && !voteMode && (
        <motion.div
          ref={comparisonRef}
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'homepage' && (
            <HomepagePreview thumbnails={thumbnails} meta={metadata} dark={darkMockup} />
          )}
          {activeTab === 'search' && (
            <SearchPreview thumbnails={thumbnails} meta={metadata} dark={darkMockup} />
          )}
          {activeTab === 'sidebar' && (
            <SidebarPreview thumbnails={thumbnails} meta={metadata} dark={darkMockup} />
          )}
          {activeTab === 'mobile' && (
            <MobilePreview thumbnails={thumbnails} meta={metadata} dark={darkMockup} />
          )}
        </motion.div>
      )}

      {/* Vote Mode */}
      {hasThumbnails && voteMode && canVote && (
        <motion.div
          ref={comparisonRef}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              Which thumbnail would you click?
            </h3>
            <p className="text-sm text-zinc-500 mt-1">
              Click on the thumbnail that grabs your attention more
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[votePair[0], votePair[1]].map((idx) => {
              const thumb = thumbnails[idx];
              if (!thumb) return null;
              const voteCount = votes[thumb.id] || 0;
              const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

              return (
                <motion.div
                  key={thumb.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => castVote(thumb.id)}
                  className="relative cursor-pointer group"
                >
                  <div className="aspect-video rounded-xl overflow-hidden border-2 border-transparent group-hover:border-red-500 transition-colors shadow-lg">
                    <img
                      src={thumb.src}
                      alt={thumb.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <ConfettiBurst active={voteBurstId === thumb.id} />

                  {/* Vote counter */}
                  <div className="mt-3 text-center">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Thumbnail {String.fromCharCode(65 + idx)}
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <motion.span
                        key={voteCount}
                        initial={{ scale: 1.4, color: '#ef4444' }}
                        animate={{ scale: 1, color: undefined }}
                        className="text-2xl font-bold text-zinc-900 dark:text-white"
                      >
                        {voteCount}
                      </motion.span>
                      <span className="text-sm text-zinc-500">votes</span>
                      {totalVotes > 0 && (
                        <span className="text-sm font-medium text-red-500">
                          ({percentage}%)
                        </span>
                      )}
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-red-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* All results summary */}
          {totalVotes > 0 && thumbnails.length > 2 && (
            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                All Thumbnails — {totalVotes} total votes
              </p>
              <div className="space-y-2">
                {thumbnails
                  .map((t, i) => ({
                    thumb: t,
                    idx: i,
                    count: votes[t.id] || 0,
                  }))
                  .sort((a, b) => b.count - a.count)
                  .map(({ thumb, idx, count }) => {
                    const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                    return (
                      <div key={thumb.id} className="flex items-center gap-3">
                        <div className="w-16 aspect-video rounded overflow-hidden flex-shrink-0">
                          <img src={thumb.src} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-700 dark:text-zinc-300">
                              Thumbnail {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="font-medium text-zinc-900 dark:text-white">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-red-500 rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Vote reset */}
          {totalVotes > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setVotes({});
                  setVoteBurstId(null);
                }}
                className="text-xs text-zinc-500 hover:text-red-500 transition-colors underline"
              >
                Reset votes
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Analysis Panel */}
      <AnimatePresence>
        {showAnalysis && hasThumbnails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Thumbnail Analysis Tips
                </h3>
                <button
                  onClick={() => setShowAnalysis(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnail selector */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {thumbnails.map((thumb, i) => (
                  <button
                    key={thumb.id}
                    onClick={() => setSelectedAnalysis(thumb.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all flex-shrink-0 ${
                      selectedAnalysis === thumb.id
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="w-10 aspect-video rounded overflow-hidden">
                      <img src={thumb.src} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Thumbnail {String.fromCharCode(65 + i)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tips */}
              {selectedAnalysis && analysisTips[selectedAnalysis] && (
                <div className="space-y-3">
                  {analysisTips[selectedAnalysis].map((tip, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className={`flex gap-3 p-3 rounded-xl ${
                        tip.type === 'success'
                          ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                          : tip.type === 'warning'
                          ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800'
                          : 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 mt-0.5 ${
                          tip.type === 'success'
                            ? 'text-green-600 dark:text-green-400'
                            : tip.type === 'warning'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {tip.icon}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            tip.type === 'success'
                              ? 'text-green-800 dark:text-green-300'
                              : tip.type === 'warning'
                              ? 'text-amber-800 dark:text-amber-300'
                              : 'text-blue-800 dark:text-blue-300'
                          }`}
                        >
                          {tip.title}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${
                            tip.type === 'success'
                              ? 'text-green-700 dark:text-green-400'
                              : tip.type === 'warning'
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-blue-700 dark:text-blue-400'
                          }`}
                        >
                          {tip.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {selectedAnalysis && !analysisTips[selectedAnalysis] && (
                <div className="text-center py-6">
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-zinc-500 mt-2">Analyzing...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side-by-side quick comparison */}
      {thumbnails.length >= 2 && !voteMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Side-by-Side Comparison
          </h3>
          <div className={`grid gap-4 ${thumbnails.length === 2 ? 'grid-cols-2' : thumbnails.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {thumbnails.map((thumb, i) => (
              <div key={thumb.id} className="group">
                <div className="aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 group-hover:border-red-500 transition-colors shadow-sm group-hover:shadow-lg">
                  <img
                    src={thumb.src}
                    alt={thumb.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-center text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-2">
                  {String.fromCharCode(65 + i)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Footer: Privacy + Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Shield className="w-3.5 h-3.5" />
          <span>All processing happens locally in your browser. No images are uploaded to any server.</span>
        </div>
        {hasThumbnails && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all &amp; start over
          </button>
        )}
      </div>
    </div>
  );
}
