'use client';

import { useState, useMemo, useCallback } from 'react';
import { Copy, CheckCheck, Search, X } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
type ContentType = 'Profile' | 'Post' | 'Story' | 'Cover' | 'Video' | 'Other';

interface DimEntry {
  name: string;
  width: number;
  height: number;
  maxFileSizeMB?: number;
  formats: string[];
  notes?: string;
  type: ContentType;
}

interface Platform {
  id: string;
  name: string;
  color: string;
  entries: DimEntry[];
}

// ── Data ───────────────────────────────────────────────────────────────────────
const PLATFORMS: Platform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    color: 'from-pink-500 to-purple-600',
    entries: [
      { name: 'Profile Picture', width: 320, height: 320, maxFileSizeMB: 8, formats: ['JPG', 'PNG'], notes: 'Displayed as circle', type: 'Profile' },
      { name: 'Post — Square', width: 1080, height: 1080, maxFileSizeMB: 8, formats: ['JPG', 'PNG'], notes: '1:1 ratio', type: 'Post' },
      { name: 'Post — Portrait', width: 1080, height: 1350, maxFileSizeMB: 8, formats: ['JPG', 'PNG'], notes: '4:5 ratio, max feed coverage', type: 'Post' },
      { name: 'Post — Landscape', width: 1080, height: 566, maxFileSizeMB: 8, formats: ['JPG', 'PNG'], notes: '1.91:1 ratio', type: 'Post' },
      { name: 'Story', width: 1080, height: 1920, maxFileSizeMB: 30, formats: ['JPG', 'PNG', 'MP4'], notes: '9:16 ratio, 15 sec max', type: 'Story' },
      { name: 'Reel', width: 1080, height: 1920, maxFileSizeMB: 100, formats: ['MP4', 'MOV'], notes: '9:16, up to 90 sec', type: 'Video' },
      { name: 'IGTV Cover', width: 420, height: 654, maxFileSizeMB: 8, formats: ['JPG', 'PNG'], notes: '~1:1.55 ratio', type: 'Cover' },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: 'from-red-500 to-red-700',
    entries: [
      { name: 'Channel Art / Banner', width: 2560, height: 1440, maxFileSizeMB: 6, formats: ['JPG', 'PNG', 'GIF', 'BMP'], notes: 'Safe zone: 1546×423px', type: 'Cover' },
      { name: 'Profile Picture', width: 800, height: 800, maxFileSizeMB: 4, formats: ['JPG', 'PNG'], notes: 'Displayed as circle', type: 'Profile' },
      { name: 'Thumbnail', width: 1280, height: 720, maxFileSizeMB: 2, formats: ['JPG', 'PNG', 'GIF'], notes: '16:9 ratio, most important asset', type: 'Other' },
      { name: 'Community Post Image', width: 1080, height: 1080, maxFileSizeMB: 8, formats: ['JPG', 'PNG'], notes: '1:1 ratio', type: 'Post' },
      { name: 'Shorts', width: 1080, height: 1920, maxFileSizeMB: 256, formats: ['MP4', 'MOV'], notes: '9:16, up to 60 sec', type: 'Video' },
      { name: 'Banner (safe zone)', width: 2048, height: 1152, maxFileSizeMB: 6, formats: ['JPG', 'PNG'], notes: 'Minimum recommended', type: 'Cover' },
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: 'from-blue-500 to-blue-700',
    entries: [
      { name: 'Cover Photo', width: 820, height: 312, maxFileSizeMB: 8, formats: ['JPG', 'PNG'], notes: 'Mobile: 640×360px', type: 'Cover' },
      { name: 'Profile Picture', width: 170, height: 170, maxFileSizeMB: 8, formats: ['JPG', 'PNG'], notes: 'Displayed as circle', type: 'Profile' },
      { name: 'Post Image', width: 1200, height: 630, maxFileSizeMB: 8, formats: ['JPG', 'PNG'], notes: '1.91:1 ratio', type: 'Post' },
      { name: 'Story', width: 1080, height: 1920, maxFileSizeMB: 30, formats: ['JPG', 'PNG', 'MP4'], notes: '9:16, 20 sec max', type: 'Story' },
      { name: 'Event Cover', width: 1920, height: 1080, maxFileSizeMB: 8, formats: ['JPG', 'PNG'], notes: '16:9 ratio', type: 'Cover' },
      { name: 'Group Cover', width: 1640, height: 856, maxFileSizeMB: 8, formats: ['JPG', 'PNG'], notes: '~1.91:1 ratio', type: 'Cover' },
    ],
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    color: 'from-slate-500 to-slate-800',
    entries: [
      { name: 'Header Image', width: 1500, height: 500, maxFileSizeMB: 5, formats: ['JPG', 'PNG', 'GIF'], notes: '3:1 ratio', type: 'Cover' },
      { name: 'Profile Picture', width: 400, height: 400, maxFileSizeMB: 2, formats: ['JPG', 'PNG', 'GIF'], notes: 'Displayed as circle', type: 'Profile' },
      { name: 'Post Image', width: 1200, height: 675, maxFileSizeMB: 5, formats: ['JPG', 'PNG', 'GIF', 'WEBP'], notes: '16:9 ratio', type: 'Post' },
      { name: 'Summary Card', width: 800, height: 418, maxFileSizeMB: 5, formats: ['JPG', 'PNG', 'GIF', 'WEBP'], notes: '~1.91:1 ratio', type: 'Other' },
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: 'from-sky-600 to-blue-800',
    entries: [
      { name: 'Cover Photo', width: 1584, height: 396, maxFileSizeMB: 8, formats: ['JPG', 'PNG'], notes: '4:1 ratio', type: 'Cover' },
      { name: 'Profile Picture', width: 400, height: 400, maxFileSizeMB: 8, formats: ['JPG', 'PNG'], notes: 'Min 200×200px', type: 'Profile' },
      { name: 'Post Image', width: 1200, height: 627, maxFileSizeMB: 5, formats: ['JPG', 'PNG'], notes: '~1.91:1 ratio', type: 'Post' },
      { name: 'Company Logo', width: 300, height: 300, maxFileSizeMB: 4, formats: ['JPG', 'PNG'], notes: 'Displays at 68×68px', type: 'Profile' },
      { name: 'Blog Post Image', width: 744, height: 400, maxFileSizeMB: 5, formats: ['JPG', 'PNG'], notes: '~1.86:1 ratio', type: 'Post' },
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    color: 'from-green-500 to-green-700',
    entries: [
      { name: 'Status / Story', width: 1080, height: 1920, maxFileSizeMB: 16, formats: ['JPG', 'PNG', 'MP4'], notes: '9:16 ratio', type: 'Story' },
      { name: 'Profile Photo', width: 500, height: 500, maxFileSizeMB: 5, formats: ['JPG', 'PNG'], notes: 'Displayed as circle', type: 'Profile' },
      { name: 'Link Preview Image', width: 300, height: 200, maxFileSizeMB: 2, formats: ['JPG', 'PNG'], notes: '3:2 ratio', type: 'Other' },
    ],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    color: 'from-red-500 to-red-700',
    entries: [
      { name: 'Pin Image', width: 1000, height: 1500, maxFileSizeMB: 20, formats: ['JPG', 'PNG'], notes: '2:3 ratio, recommended', type: 'Post' },
      { name: 'Profile Picture', width: 165, height: 165, maxFileSizeMB: 2, formats: ['JPG', 'PNG'], notes: 'Displayed as circle', type: 'Profile' },
      { name: 'Board Cover', width: 222, height: 150, maxFileSizeMB: 2, formats: ['JPG', 'PNG'], notes: 'Auto-cropped from pins', type: 'Cover' },
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: 'from-slate-900 to-slate-700',
    entries: [
      { name: 'Video', width: 1080, height: 1920, maxFileSizeMB: 72, formats: ['MP4', 'MOV'], notes: '9:16, up to 10 min', type: 'Video' },
      { name: 'Profile Picture', width: 200, height: 200, maxFileSizeMB: 2, formats: ['JPG', 'PNG', 'GIF'], notes: 'Displayed as circle', type: 'Profile' },
    ],
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    color: 'from-yellow-400 to-yellow-500',
    entries: [
      { name: 'Snap / Story', width: 1080, height: 1920, maxFileSizeMB: 5, formats: ['JPG', 'PNG', 'MP4'], notes: '9:16 ratio', type: 'Story' },
    ],
  },
  {
    id: 'gmb',
    name: 'Google My Business',
    color: 'from-blue-500 to-green-500',
    entries: [
      { name: 'Cover Photo', width: 1080, height: 608, maxFileSizeMB: 5, formats: ['JPG', 'PNG'], notes: '16:9 ratio', type: 'Cover' },
      { name: 'Logo', width: 250, height: 250, maxFileSizeMB: 5, formats: ['JPG', 'PNG'], notes: 'Square, min 250×250px', type: 'Profile' },
    ],
  },
];

const TYPES: ContentType[] = ['Profile', 'Post', 'Story', 'Cover', 'Video', 'Other'];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function aspectRatio(w: number, h: number): string {
  const g = gcd(w, h);
  return `${w / g}:${h / g}`;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function SocialMediaDimensionsGuideTool() {
  const [activePlatform, setActivePlatform] = useState<string>('instagram');
  const [activeType, setActiveType] = useState<ContentType | 'All'>('All');
  const [search, setSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const platform = PLATFORMS.find((p) => p.id === activePlatform) ?? PLATFORMS[0];

  const filteredEntries = useMemo(() => {
    return platform.entries.filter((e) => {
      const matchesType = activeType === 'All' || e.type === activeType;
      const matchesSearch =
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        `${e.width}x${e.height}`.includes(search) ||
        e.formats.some((f) => f.toLowerCase().includes(search.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [platform, activeType, search]);

  const copyDimensions = useCallback(
    async (entry: DimEntry, key: string) => {
      await navigator.clipboard.writeText(`${entry.width} × ${entry.height}px`);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    },
    []
  );

  const maxArea = useMemo(
    () => Math.max(...filteredEntries.map((e) => e.width * e.height)),
    [filteredEntries]
  );

  return (
    <div className="space-y-5">
      {/* Last updated badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full">
          Last updated: March 2025
        </span>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dimensions..."
            className="pl-8 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 w-48"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Platform tabs */}
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePlatform(p.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activePlatform === p.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {(['All', ...TYPES] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              activeType === t
                ? 'bg-indigo-500/30 text-indigo-700 dark:text-indigo-300 border border-indigo-500/50'
                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 border border-slate-200 dark:border-slate-700 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Entries grid */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No results found for your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry) => {
            const key = `${platform.id}-${entry.name}`;
            const ar = aspectRatio(entry.width, entry.height);
            const area = entry.width * entry.height;
            const relSize = Math.sqrt(area / maxArea);
            const previewW = Math.round(relSize * 80);
            const previewH = Math.round((entry.height / entry.width) * previewW);
            const clampH = Math.min(previewH, 80);
            const clampW = clampH < previewH ? Math.round((entry.width / entry.height) * clampH) : previewW;

            return (
              <div key={key} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                        entry.type === 'Profile' ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' :
                        entry.type === 'Post' ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400' :
                        entry.type === 'Story' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' :
                        entry.type === 'Cover' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                        entry.type === 'Video' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
                        'bg-slate-500/20 text-slate-600 dark:text-slate-400'
                      }`}>
                        {entry.type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{entry.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                        {entry.width} × {entry.height}
                      </span>
                      <span className="text-xs text-slate-500">px</span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                      <span>Ratio: <span className="text-slate-700 dark:text-slate-300">{ar}</span></span>
                      {entry.maxFileSizeMB && (
                        <span>Max: <span className="text-slate-700 dark:text-slate-300">{entry.maxFileSizeMB}MB</span></span>
                      )}
                      <span>Formats: <span className="text-slate-700 dark:text-slate-300">{entry.formats.join(', ')}</span></span>
                    </div>
                    {entry.notes && (
                      <p className="text-xs text-slate-500 mt-1.5 italic">{entry.notes}</p>
                    )}
                  </div>

                  {/* Visual preview */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div
                      className={`bg-gradient-to-br ${platform.color} opacity-30 rounded border border-white/10`}
                      style={{ width: `${Math.max(clampW, 20)}px`, height: `${Math.max(clampH, 20)}px`, minWidth: '20px', minHeight: '20px' }}
                    />
                    <button
                      onClick={() => copyDimensions(entry, key)}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {copiedKey === key ? (
                        <><CheckCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Copied</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copy</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-600 text-center">
        Specifications sourced from official platform documentation. Last reviewed March 2025.
      </p>
    </div>
  );
}
