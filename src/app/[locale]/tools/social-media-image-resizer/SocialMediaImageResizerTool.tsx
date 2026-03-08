'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  Download,
  Image as ImageIcon,
  Check,
  CheckSquare,
  Square,
  X,
  Shield,
  Loader2,
  ChevronDown,
  ChevronUp,
  Trash2,
} from 'lucide-react';

/* ────────────────────── Platform presets ────────────────────── */

interface PlatformPreset {
  id: string;
  platform: string;
  label: string;
  width: number;
  height: number;
}

const PRESETS: PlatformPreset[] = [
  { id: 'ig-post', platform: 'Instagram', label: 'Post', width: 1080, height: 1080 },
  { id: 'ig-story', platform: 'Instagram', label: 'Story', width: 1080, height: 1920 },
  { id: 'ig-reel', platform: 'Instagram', label: 'Reel Cover', width: 1080, height: 1920 },
  { id: 'fb-post', platform: 'Facebook', label: 'Post', width: 1200, height: 630 },
  { id: 'fb-cover', platform: 'Facebook', label: 'Cover', width: 820, height: 312 },
  { id: 'fb-story', platform: 'Facebook', label: 'Story', width: 1080, height: 1920 },
  { id: 'tw-post', platform: 'Twitter/X', label: 'Post', width: 1200, height: 675 },
  { id: 'tw-header', platform: 'Twitter/X', label: 'Header', width: 1500, height: 500 },
  { id: 'li-post', platform: 'LinkedIn', label: 'Post', width: 1200, height: 627 },
  { id: 'li-cover', platform: 'LinkedIn', label: 'Cover', width: 1584, height: 396 },
  { id: 'yt-thumb', platform: 'YouTube', label: 'Thumbnail', width: 1280, height: 720 },
  { id: 'yt-art', platform: 'YouTube', label: 'Channel Art', width: 2560, height: 1440 },
  { id: 'pin', platform: 'Pinterest', label: 'Pin', width: 1000, height: 1500 },
  { id: 'wa-status', platform: 'WhatsApp', label: 'Status', width: 1080, height: 1920 },
  { id: 'tt-cover', platform: 'TikTok', label: 'Cover', width: 1080, height: 1920 },
];

/* Default presets auto-selected on first load */
const DEFAULT_SELECTED = new Set(['ig-post', 'fb-post', 'tw-post', 'yt-thumb']);

/* Group presets by platform for the UI */
const platformGroups = PRESETS.reduce<Record<string, PlatformPreset[]>>((acc, p) => {
  (acc[p.platform] ??= []).push(p);
  return acc;
}, {});

/* ────────────────────── Generated image type ────────────────── */

interface GeneratedImage {
  preset: PlatformPreset;
  blob: Blob;
  url: string;
  fileName: string;
  sizeKB: number;
}

/* ────────────────────── Helper: format file size ────────────── */

function fmtSize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
}

/* ────────────────────── Helper: robust download ─────────────── */

function triggerDownload(url: string, fileName: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  // Small delay before removing to ensure mobile browsers pick up the click
  setTimeout(() => document.body.removeChild(a), 100);
}

/* ════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════ */

export function SocialMediaImageResizerTool() {
  /* ── state ── */
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set(DEFAULT_SELECTED));
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [quality, setQuality] = useState(85);
  const [generated, setGenerated] = useState<GeneratedImage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [draggingFocal, setDraggingFocal] = useState(false);
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(new Set(Object.keys(platformGroups)));
  const [isDragOver, setIsDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const generatedRef = useRef<GeneratedImage[]>([]);

  // Keep the ref in sync with state so the generate callback can clean up old URLs
  generatedRef.current = generated;

  /* ── load image ── */
  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSourceFile(file);
    setGenerated([]);

    const url = URL.createObjectURL(file);
    setSourcePreview(url);

    const img = new window.Image();
    img.onload = () => setSourceImg(img);
    img.src = url;
  }, []);

  /* ── drop / paste handlers ── */
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) loadImage(file);
    },
    [loadImage],
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadImage(file);
    },
    [loadImage],
  );

  /* ── selection helpers ── */
  const togglePreset = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected = selected.size === PRESETS.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(PRESETS.map((p) => p.id)));

  const togglePlatformExpand = (platform: string) => {
    setExpandedPlatforms((prev) => {
      const next = new Set(prev);
      next.has(platform) ? next.delete(platform) : next.add(platform);
      return next;
    });
  };

  /* ── focal-point drag on preview image ── */
  const updateFocal = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      setFocalPoint({ x, y });
    },
    [],
  );

  useEffect(() => {
    if (!draggingFocal) return;
    const onMove = (e: MouseEvent) => updateFocal(e);
    const onUp = () => setDraggingFocal(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [draggingFocal, updateFocal]);

  /* ── generate images using canvas ── */
  const generateImages = useCallback(async () => {
    if (!sourceImg || selected.size === 0) return;
    setGenerating(true);

    // Revoke old URLs using the ref to avoid stale closure
    generatedRef.current.forEach((g) => URL.revokeObjectURL(g.url));

    const results: GeneratedImage[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    for (const preset of PRESETS) {
      if (!selected.has(preset.id)) continue;

      canvas.width = preset.width;
      canvas.height = preset.height;

      // Smart crop around focal point
      const srcAspect = sourceImg.width / sourceImg.height;
      const dstAspect = preset.width / preset.height;

      let sx: number, sy: number, sw: number, sh: number;

      if (srcAspect > dstAspect) {
        // source is wider — crop width
        sh = sourceImg.height;
        sw = sh * dstAspect;
        sy = 0;
        sx = (sourceImg.width - sw) * focalPoint.x;
      } else {
        // source is taller — crop height
        sw = sourceImg.width;
        sh = sw / dstAspect;
        sx = 0;
        sy = (sourceImg.height - sh) * focalPoint.y;
      }

      ctx.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, preset.width, preset.height);

      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), mimeType, quality / 100),
      );

      const slug = `${preset.platform.toLowerCase().replace(/\//g, '-')}-${preset.label.toLowerCase().replace(/\s/g, '-')}`;
      const ext = format === 'png' ? 'png' : 'jpg';
      const fileName = `${slug}-${preset.width}x${preset.height}.${ext}`;

      results.push({
        preset,
        blob,
        url: URL.createObjectURL(blob),
        fileName,
        sizeKB: blob.size / 1024,
      });
    }

    setGenerated(results);
    setGenerating(false);
  }, [sourceImg, selected, format, quality, focalPoint]);

  /* ── download helpers ── */
  const downloadOne = (g: GeneratedImage) => {
    triggerDownload(g.url, g.fileName);
  };

  const downloadAll = () => {
    generated.forEach((g, i) => {
      // Stagger downloads slightly so browsers don't block them
      setTimeout(() => triggerDownload(g.url, g.fileName), i * 150);
    });
  };

  /* ── reset ── */
  const reset = () => {
    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
    generated.forEach((g) => URL.revokeObjectURL(g.url));
    setSourceImg(null);
    setSourceFile(null);
    setSourcePreview(null);
    setGenerated([]);
    setSelected(new Set(DEFAULT_SELECTED));
    setFocalPoint({ x: 0.5, y: 0.5 });
    if (inputRef.current) inputRef.current.value = '';
  };

  /* ════════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════════ */

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Trust badge */}
      <div className="flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300">
        <Shield className="h-4 w-4 shrink-0" />
        <span>100% Private — images processed entirely in your browser</span>
      </div>

      {/* ── Upload area ── */}
      {!sourceImg ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-20 text-center transition-colors ${
            isDragOver
              ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
              : 'border-gray-300 bg-white hover:border-violet-400 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-violet-500'
          }`}
        >
          <Upload className="h-12 w-12 text-violet-500" />
          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Drag & drop your image here
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              or click to browse — JPG, PNG, WebP accepted
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
      ) : (
        <>
          {/* ── Source preview + focal point ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-5 w-5 text-violet-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate max-w-[200px] sm:max-w-none">
                    {sourceFile?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {sourceImg.width} x {sourceImg.height}px
                    {sourceFile && ` — ${fmtSize(sourceFile.size / 1024)}`}
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>

            <div className="relative mx-auto max-h-[340px] max-w-full overflow-hidden rounded-lg">
              <p className="mb-1 text-xs text-gray-400 dark:text-gray-500">
                Click or drag on the image to set the focal point for cropping
              </p>
              <div
                ref={previewRef}
                className="relative inline-block max-h-[300px] cursor-crosshair select-none overflow-hidden rounded-lg"
                onMouseDown={(e) => {
                  updateFocal(e);
                  setDraggingFocal(true);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sourcePreview!}
                  alt="Source"
                  className="block max-h-[300px] w-auto rounded-lg"
                  draggable={false}
                />
                {/* Focal point indicator */}
                <div
                  className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg"
                  style={{
                    left: `${focalPoint.x * 100}%`,
                    top: `${focalPoint.y * 100}%`,
                    background: 'rgba(139,92,246,0.7)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Settings row ── */}
          <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 sm:gap-6 sm:p-6">
            {/* Format */}
            <div className="min-w-[120px]">
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Format
              </label>
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setFormat('jpeg')}
                  className={`flex-1 rounded-l-lg px-4 py-2 text-sm font-medium transition-colors ${
                    format === 'jpeg'
                      ? 'bg-violet-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  JPG
                </button>
                <button
                  onClick={() => setFormat('png')}
                  className={`flex-1 rounded-r-lg px-4 py-2 text-sm font-medium transition-colors ${
                    format === 'png'
                      ? 'bg-violet-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  PNG
                </button>
              </div>
            </div>

            {/* Quality */}
            <div className="min-w-[180px] flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min={60}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-violet-600 dark:bg-gray-700"
              />
              <div className="mt-0.5 flex justify-between text-[10px] text-gray-400">
                <span>60%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={generateImages}
              disabled={selected.size === 0 || generating}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
              {generating ? 'Generating...' : `Resize (${selected.size})`}
            </button>
          </div>

          {/* ── Platform selection ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                Select Platforms & Sizes
              </h3>
              <button
                onClick={toggleAll}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {allSelected ? (
                  <>
                    <X className="h-3.5 w-3.5" /> Deselect All
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-3.5 w-3.5" /> Select All
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              {Object.entries(platformGroups).map(([platform, presets]) => {
                const isExpanded = expandedPlatforms.has(platform);
                const selectedInGroup = presets.filter((p) => selected.has(p.id)).length;
                const allInGroupSelected = selectedInGroup === presets.length;

                return (
                  <div
                    key={platform}
                    className="rounded-xl border border-gray-100 dark:border-gray-800"
                  >
                    <button
                      onClick={() => togglePlatformExpand(platform)}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {platform}
                        </span>
                        {selectedInGroup > 0 && (
                          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                            {selectedInGroup}/{presets.length}
                          </span>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-100 px-4 pb-3 pt-2 dark:border-gray-800">
                        {/* toggle all in group */}
                        <button
                          onClick={() => {
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (allInGroupSelected) {
                                presets.forEach((p) => next.delete(p.id));
                              } else {
                                presets.forEach((p) => next.add(p.id));
                              }
                              return next;
                            });
                          }}
                          className="mb-2 text-[11px] font-medium text-violet-600 hover:underline dark:text-violet-400"
                        >
                          {allInGroupSelected ? 'Deselect all' : 'Select all'} {platform}
                        </button>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {presets.map((p) => {
                            const isChecked = selected.has(p.id);
                            return (
                              <button
                                key={p.id}
                                onClick={() => togglePreset(p.id)}
                                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                                  isChecked
                                    ? 'border-violet-300 bg-violet-50 dark:border-violet-700 dark:bg-violet-950/40'
                                    : 'border-gray-150 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600'
                                }`}
                              >
                                {isChecked ? (
                                  <Check className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                                ) : (
                                  <Square className="h-4 w-4 shrink-0 text-gray-400" />
                                )}
                                <div>
                                  <span className="font-medium text-gray-800 dark:text-gray-100">
                                    {p.label}
                                  </span>
                                  <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">
                                    {p.width}x{p.height}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Generated images grid ── */}
          {generated.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  Resized Images ({generated.length})
                </h3>
                <button
                  onClick={downloadAll}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-violet-700"
                >
                  <Download className="h-4 w-4" />
                  Download All
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {generated.map((g) => (
                  <div
                    key={g.preset.id}
                    className="group overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50"
                  >
                    {/* Thumbnail */}
                    <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={g.url}
                        alt={`${g.preset.platform} ${g.preset.label}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex items-center justify-between px-3 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {g.preset.platform} — {g.preset.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {g.preset.width}x{g.preset.height} &middot; {fmtSize(g.sizeKB)}
                        </p>
                      </div>
                      <button
                        onClick={() => downloadOne(g)}
                        className="rounded-lg p-2 text-violet-600 transition-colors hover:bg-violet-100 dark:text-violet-400 dark:hover:bg-violet-900/40"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
