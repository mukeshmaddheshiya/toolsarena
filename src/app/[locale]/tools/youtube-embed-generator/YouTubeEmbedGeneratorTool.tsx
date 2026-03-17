'use client';

import { useState, useMemo, useCallback } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { Code, Play, Settings, Monitor, Smartphone, Tablet, Eye, EyeOff, RotateCcw, Link, Check } from 'lucide-react';

/* ── Helpers ───────────────────────────────────────────────────────── */

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.trim().match(p);
    if (m) return m[1];
  }
  return null;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/* ── Types ─────────────────────────────────────────────────────────── */

type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

interface EmbedOptions {
  autoplay: boolean;
  mute: boolean;
  loop: boolean;
  controls: boolean;
  showInfo: boolean;
  startTime: number;
  endTime: number;
  width: number;
  height: number;
  responsive: boolean;
  privacyMode: boolean;
  allowFullscreen: boolean;
  lazyLoad: boolean;
  branding: boolean;
  captions: boolean;
}

/* ── Component ─────────────────────────────────────────────────────── */

export function YouTubeEmbedGeneratorTool() {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [showPreview, setShowPreview] = useState(true);

  const [options, setOptions] = useState<EmbedOptions>({
    autoplay: false,
    mute: false,
    loop: false,
    controls: true,
    showInfo: true,
    startTime: 0,
    endTime: 0,
    width: 560,
    height: 315,
    responsive: true,
    privacyMode: false,
    allowFullscreen: true,
    lazyLoad: true,
    branding: false,
    captions: false,
  });

  const videoId = useMemo(() => extractVideoId(url), [url]);

  const embedUrl = useMemo(() => {
    if (!videoId) return '';
    const domain = options.privacyMode ? 'www.youtube-nocookie.com' : 'www.youtube.com';
    const params = new URLSearchParams();

    if (options.autoplay) params.set('autoplay', '1');
    if (options.mute) params.set('mute', '1');
    if (options.loop) { params.set('loop', '1'); params.set('playlist', videoId); }
    if (!options.controls) params.set('controls', '0');
    if (!options.showInfo) params.set('showinfo', '0');
    if (options.startTime > 0) params.set('start', String(options.startTime));
    if (options.endTime > 0) params.set('end', String(options.endTime));
    if (!options.branding) params.set('modestbranding', '1');
    if (options.captions) params.set('cc_load_policy', '1');
    params.set('rel', '0');

    const query = params.toString();
    return `https://${domain}/embed/${videoId}${query ? '?' + query : ''}`;
  }, [videoId, options]);

  const embedCode = useMemo(() => {
    if (!embedUrl) return '';

    if (options.responsive) {
      return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%">
  <iframe
    src="${embedUrl}"
    style="position:absolute;top:0;left:0;width:100%;height:100%"
    frameborder="0"
    ${options.allowFullscreen ? 'allowfullscreen' : ''}
    ${options.lazyLoad ? 'loading="lazy"' : ''}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    title="YouTube video player"
  ></iframe>
</div>`;
    }

    return `<iframe
  width="${options.width}"
  height="${options.height}"
  src="${embedUrl}"
  frameborder="0"
  ${options.allowFullscreen ? 'allowfullscreen' : ''}
  ${options.lazyLoad ? 'loading="lazy"' : ''}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  title="YouTube video player"
></iframe>`;
  }, [embedUrl, options]);

  const updateOption = useCallback(<K extends keyof EmbedOptions>(key: K, value: EmbedOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback handled by CopyButton */ }
  };

  const presetSizes = [
    { label: '560×315', w: 560, h: 315 },
    { label: '640×360', w: 640, h: 360 },
    { label: '853×480', w: 853, h: 480 },
    { label: '1280×720', w: 1280, h: 720 },
    { label: '1920×1080', w: 1920, h: 1080 },
  ];

  const deviceWidths: Record<PreviewDevice, string> = {
    desktop: 'w-full',
    tablet: 'w-[768px] max-w-full',
    mobile: 'w-[375px] max-w-full',
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';

  return (
    <div className="space-y-5">
      {/* URL Input */}
      <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          <Link className="w-4 h-4 text-red-500" /> YouTube Video URL
        </label>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or video ID"
          className={inputClass}
        />
        {url && !videoId && (
          <p className="text-xs text-red-500">Invalid YouTube URL. Paste a youtube.com or youtu.be link.</p>
        )}
        {videoId && (
          <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <Check className="w-3 h-3" /> Video ID: <code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">{videoId}</code>
          </p>
        )}
      </div>

      {videoId && (
        <>
          {/* Settings */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-5">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100">Embed Options</h3>
            </div>

            {/* Toggle grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {[
                { key: 'responsive' as const, label: 'Responsive', desc: 'Auto-fits container' },
                { key: 'autoplay' as const, label: 'Autoplay', desc: 'Play on load' },
                { key: 'mute' as const, label: 'Muted', desc: 'Start muted' },
                { key: 'loop' as const, label: 'Loop', desc: 'Repeat forever' },
                { key: 'controls' as const, label: 'Controls', desc: 'Show player controls' },
                { key: 'allowFullscreen' as const, label: 'Fullscreen', desc: 'Allow fullscreen' },
                { key: 'privacyMode' as const, label: 'Privacy Mode', desc: 'No-cookie domain' },
                { key: 'lazyLoad' as const, label: 'Lazy Load', desc: 'Load on scroll' },
                { key: 'captions' as const, label: 'Captions', desc: 'Show subtitles' },
                { key: 'branding' as const, label: 'YT Branding', desc: 'Show YouTube logo' },
              ].map(opt => (
                <label key={opt.key}
                  className={`flex items-start gap-2.5 p-3 rounded-xl cursor-pointer transition-all border ${
                    options[opt.key]
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}>
                  <input type="checkbox" checked={!!options[opt.key]}
                    onChange={e => updateOption(opt.key, e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{opt.label}</span>
                    <p className="text-[10px] text-slate-400">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Size controls (only when not responsive) */}
            {!options.responsive && (
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Size</label>
                <div className="flex flex-wrap gap-2">
                  {presetSizes.map(s => (
                    <button key={s.label} onClick={() => { updateOption('width', s.w); updateOption('height', s.h); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        options.width === s.w && options.height === s.h
                          ? 'bg-primary-800 text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Width (px)</label>
                    <input type="number" value={options.width} min={200} max={1920}
                      onChange={e => updateOption('width', parseInt(e.target.value) || 560)}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Height (px)</label>
                    <input type="number" value={options.height} min={100} max={1080}
                      onChange={e => updateOption('height', parseInt(e.target.value) || 315)}
                      className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Start/End time */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Start Time (seconds)</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={options.startTime} min={0}
                    onChange={e => updateOption('startTime', Math.max(0, parseInt(e.target.value) || 0))}
                    className={inputClass} />
                  {options.startTime > 0 && (
                    <span className="text-xs text-slate-400 whitespace-nowrap">{formatTime(options.startTime)}</span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">End Time (seconds, 0 = full)</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={options.endTime} min={0}
                    onChange={e => updateOption('endTime', Math.max(0, parseInt(e.target.value) || 0))}
                    className={inputClass} />
                  {options.endTime > 0 && (
                    <span className="text-xs text-slate-400 whitespace-nowrap">{formatTime(options.endTime)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Play className="w-4 h-4 text-red-500" /> Live Preview
              </h3>
              <div className="flex items-center gap-2">
                {/* Device switcher */}
                <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                  {([
                    { key: 'desktop' as PreviewDevice, icon: Monitor },
                    { key: 'tablet' as PreviewDevice, icon: Tablet },
                    { key: 'mobile' as PreviewDevice, icon: Smartphone },
                  ]).map(d => (
                    <button key={d.key} onClick={() => setPreviewDevice(d.key)}
                      className={`p-1.5 rounded-md transition-all ${
                        previewDevice === d.key
                          ? 'bg-white dark:bg-slate-700 shadow text-primary-700 dark:text-primary-400'
                          : 'text-slate-400'
                      }`} title={d.key}>
                      <d.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowPreview(!showPreview)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {showPreview && (
              <div className="flex justify-center">
                <div className={`${deviceWidths[previewDevice]} rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black`}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                      src={embedUrl}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      frameBorder="0"
                      allowFullScreen={options.allowFullscreen}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title="YouTube video player preview"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generated Code */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Code className="w-4 h-4 text-primary-600 dark:text-primary-400" /> Embed Code
              </h3>
              <div className="flex items-center gap-2">
                <CopyButton text={embedCode} size="sm" />
                <button onClick={copyCode}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-primary-800 hover:bg-primary-700 text-white'
                  }`}>
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Code className="w-3.5 h-3.5" /> Copy Code</>}
                </button>
              </div>
            </div>
            <pre className="p-4 bg-slate-900 dark:bg-slate-950 text-green-400 text-xs font-mono rounded-xl overflow-x-auto leading-relaxed border border-slate-700">
              {embedCode}
            </pre>
          </div>

          {/* Direct URL */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Direct Embed URL</span>
              <CopyButton text={embedUrl} size="sm" />
            </div>
            <code className="text-xs text-slate-600 dark:text-slate-300 font-mono break-all">{embedUrl}</code>
          </div>

          {/* Reset */}
          <button onClick={() => { setUrl(''); setOptions(prev => ({ ...prev, startTime: 0, endTime: 0 })); }}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> New Video
          </button>
        </>
      )}
    </div>
  );
}
