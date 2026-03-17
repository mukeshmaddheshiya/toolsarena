'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize, downloadBlob } from '@/lib/utils';
import { ZoomIn, RotateCcw, Loader2, Sparkles, SlidersHorizontal, Eye, EyeOff, ArrowRight, Maximize2, Settings, Image, Palette, Shield, Contrast } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════════
   IMAGE PROCESSING ENGINE — Bicubic + Lanczos + Unsharp Mask + Denoise
   ══════════════════════════════════════════════════════════════════════ */

type UpscaleMethod = 'bicubic' | 'lanczos';

function upscaleImage(
  source: ImageData,
  scale: number,
  sharpen: number,
  denoise: number,
  method: UpscaleMethod,
  colorEnhance: number,
  onProgress?: (pct: number) => void,
): ImageData {
  const srcW = source.width;
  const srcH = source.height;
  const dstW = Math.round(srcW * scale);
  const dstH = Math.round(srcH * scale);
  const src = source.data;

  function clamp(v: number, min: number, max: number) {
    return v < min ? min : v > max ? max : v;
  }

  function getPixel(x: number, y: number, ch: number): number {
    return src[(clamp(y, 0, srcH - 1) * srcW + clamp(x, 0, srcW - 1)) * 4 + ch];
  }

  /* ── Bicubic kernel ── */
  function cubic(t: number): number {
    const a = -0.5;
    const at = Math.abs(t);
    if (at <= 1) return (a + 2) * at * at * at - (a + 3) * at * at + 1;
    if (at < 2) return a * at * at * at - 5 * a * at * at + 8 * a * at - 4 * a;
    return 0;
  }

  /* ── Lanczos kernel (a=3, sharper but slower) ── */
  function sinc(x: number): number {
    if (x === 0) return 1;
    const px = Math.PI * x;
    return Math.sin(px) / px;
  }
  function lanczos3(x: number): number {
    if (Math.abs(x) >= 3) return 0;
    return sinc(x) * sinc(x / 3);
  }

  const kernelFn = method === 'lanczos' ? lanczos3 : cubic;

  // Step 1: Interpolation upscale
  const upscaled = new Uint8ClampedArray(dstW * dstH * 4);

  for (let dy = 0; dy < dstH; dy++) {
    if (onProgress && dy % 50 === 0) onProgress(10 + (dy / dstH) * 40);
    const srcY = dy / scale;
    const iy = Math.floor(srcY);
    const fy = srcY - iy;

    for (let dx = 0; dx < dstW; dx++) {
      const srcX = dx / scale;
      const ix = Math.floor(srcX);
      const fx = srcX - ix;

      for (let ch = 0; ch < 4; ch++) {
        let sum = 0;
        let weightSum = 0;
        const startM = method === 'lanczos' ? -2 : -1;
        const endM = method === 'lanczos' ? 3 : 2;

        for (let m = startM; m <= endM; m++) {
          const wy = kernelFn(m - fy);
          for (let n = startM; n <= endM; n++) {
            const w = wy * kernelFn(n - fx);
            sum += getPixel(ix + n, iy + m, ch) * w;
            weightSum += w;
          }
        }

        upscaled[(dy * dstW + dx) * 4 + ch] = clamp(Math.round(sum / weightSum), 0, 255);
      }
    }
  }

  onProgress?.(55);

  // Step 2: Denoise (bilateral-inspired: box blur blended)
  let processed = upscaled;
  if (denoise > 0) {
    const denoised = new Uint8ClampedArray(dstW * dstH * 4);
    const radius = Math.ceil(denoise * 2);
    const kernelSize = (2 * radius + 1) ** 2;

    for (let y = 0; y < dstH; y++) {
      for (let x = 0; x < dstW; x++) {
        for (let ch = 0; ch < 3; ch++) {
          let sum = 0;
          for (let ky = -radius; ky <= radius; ky++) {
            for (let kx = -radius; kx <= radius; kx++) {
              sum += processed[(clamp(y + ky, 0, dstH - 1) * dstW + clamp(x + kx, 0, dstW - 1)) * 4 + ch];
            }
          }
          const denoiseVal = sum / kernelSize;
          const origVal = processed[(y * dstW + x) * 4 + ch];
          denoised[(y * dstW + x) * 4 + ch] = Math.round(origVal * (1 - denoise) + denoiseVal * denoise);
        }
        denoised[(y * dstW + x) * 4 + 3] = processed[(y * dstW + x) * 4 + 3];
      }
    }
    processed = denoised;
  }

  onProgress?.(70);

  // Step 3: Unsharp Mask (3x3 laplacian)
  if (sharpen > 0) {
    const sharpened = new Uint8ClampedArray(dstW * dstH * 4);
    const strength = sharpen * 2.5;

    for (let y = 0; y < dstH; y++) {
      for (let x = 0; x < dstW; x++) {
        for (let ch = 0; ch < 3; ch++) {
          const idx = (y * dstW + x) * 4 + ch;
          const center = processed[idx];
          let neighbors = 0;
          let count = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              if (kx === 0 && ky === 0) continue;
              neighbors += processed[(clamp(y + ky, 0, dstH - 1) * dstW + clamp(x + kx, 0, dstW - 1)) * 4 + ch];
              count++;
            }
          }
          const edge = center - neighbors / count;
          sharpened[idx] = clamp(Math.round(center + edge * strength), 0, 255);
        }
        sharpened[(y * dstW + x) * 4 + 3] = processed[(y * dstW + x) * 4 + 3];
      }
    }
    processed = sharpened;
  }

  onProgress?.(85);

  // Step 4: Color enhancement (saturation + contrast boost)
  if (colorEnhance > 0) {
    const enhanced = new Uint8ClampedArray(processed.length);
    const sat = 1 + colorEnhance * 0.4;    // up to 1.4x saturation
    const cont = 1 + colorEnhance * 0.15;  // up to 1.15x contrast

    for (let i = 0; i < processed.length; i += 4) {
      let r = processed[i], g = processed[i + 1], b = processed[i + 2];

      // Saturation via luminance
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      r = clamp(Math.round(lum + (r - lum) * sat), 0, 255);
      g = clamp(Math.round(lum + (g - lum) * sat), 0, 255);
      b = clamp(Math.round(lum + (b - lum) * sat), 0, 255);

      // Contrast
      r = clamp(Math.round(((r / 255 - 0.5) * cont + 0.5) * 255), 0, 255);
      g = clamp(Math.round(((g / 255 - 0.5) * cont + 0.5) * 255), 0, 255);
      b = clamp(Math.round(((b / 255 - 0.5) * cont + 0.5) * 255), 0, 255);

      enhanced[i] = r;
      enhanced[i + 1] = g;
      enhanced[i + 2] = b;
      enhanced[i + 3] = processed[i + 3];
    }
    processed = enhanced;
  }

  onProgress?.(95);

  return new ImageData(processed, dstW, dstH);
}

/* ── Helpers ── */

function formatDimensions(w: number, h: number) { return `${w} × ${h}`; }
function formatMegapixels(w: number, h: number) { return ((w * h) / 1_000_000).toFixed(1) + ' MP'; }

/* ══════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════ */

type ScaleFactor = 2 | 3 | 4 | 6 | 8;
type OutputFormat = 'png' | 'jpeg' | 'webp';
type Preset = 'photo' | 'illustration' | 'text' | 'anime' | 'custom';

const PRESETS: Record<Exclude<Preset, 'custom'>, { sharpen: number; denoise: number; method: UpscaleMethod; colorEnhance: number; label: string; desc: string; emoji: string }> = {
  photo: { sharpen: 0.45, denoise: 0.15, method: 'lanczos', colorEnhance: 0.2, label: 'Photo', desc: 'Best for photographs', emoji: '📷' },
  illustration: { sharpen: 0.6, denoise: 0, method: 'bicubic', colorEnhance: 0.3, label: 'Illustration', desc: 'Digital art, graphics', emoji: '🎨' },
  text: { sharpen: 0.8, denoise: 0, method: 'lanczos', colorEnhance: 0, label: 'Text / Logo', desc: 'Screenshots, logos, text', emoji: '📝' },
  anime: { sharpen: 0.5, denoise: 0.1, method: 'lanczos', colorEnhance: 0.25, label: 'Anime / Cartoon', desc: 'Anime, manga, cartoons', emoji: '🎌' },
};

export function ImageUpscalerTool() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  // Settings
  const [scale, setScale] = useState<ScaleFactor>(2);
  const [sharpen, setSharpen] = useState(0.45);
  const [denoise, setDenoise] = useState(0.15);
  const [method, setMethod] = useState<UpscaleMethod>('lanczos');
  const [colorEnhance, setColorEnhance] = useState(0.2);
  const [preset, setPreset] = useState<Preset>('photo');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [jpegQuality, setJpegQuality] = useState(92);

  // State
  const [state, setState] = useState<'idle' | 'loaded' | 'processing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultWidth, setResultWidth] = useState(0);
  const [resultHeight, setResultHeight] = useState(0);
  const [error, setError] = useState('');
  const [showComparison, setShowComparison] = useState(true);
  const [comparePosition, setComparePosition] = useState(50);
  const [processingTime, setProcessingTime] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleFiles = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError('');
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    if (imageUrl) URL.revokeObjectURL(imageUrl);

    const url = URL.createObjectURL(file);
    setImageFile(file);
    setImageUrl(url);
    setState('loaded');
    setResultUrl('');
    setResultBlob(null);

    const img = new window.Image();
    img.onload = () => { setImgWidth(img.naturalWidth); setImgHeight(img.naturalHeight); };
    img.src = url;
  }, [imageUrl, resultUrl]);

  const applyPreset = useCallback((p: Exclude<Preset, 'custom'>) => {
    const cfg = PRESETS[p];
    setSharpen(cfg.sharpen);
    setDenoise(cfg.denoise);
    setMethod(cfg.method);
    setColorEnhance(cfg.colorEnhance);
    setPreset(p);
  }, []);

  const processImage = useCallback(async () => {
    if (!imageUrl || !canvasRef.current) return;

    setState('processing');
    setProgress(5);
    setError('');
    const startTime = performance.now();

    try {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
      });

      setProgress(10);

      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = img.naturalWidth;
      srcCanvas.height = img.naturalHeight;
      const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true })!;
      srcCtx.drawImage(img, 0, 0);
      const sourceData = srcCtx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);

      const outW = Math.round(img.naturalWidth * scale);
      const outH = Math.round(img.naturalHeight * scale);
      const maxPixels = 8000 * 8000;
      if (outW * outH > maxPixels) {
        setError(`Output would be ${outW}×${outH} (${formatMegapixels(outW, outH)}). Max is ~64 MP. Try a smaller scale.`);
        setState('loaded');
        return;
      }

      // Yield to UI
      await new Promise(r => setTimeout(r, 50));

      const result = upscaleImage(sourceData, scale, sharpen, denoise, method, colorEnhance, (pct) => setProgress(pct));

      // Draw result
      const outCanvas = canvasRef.current;
      outCanvas.width = result.width;
      outCanvas.height = result.height;
      outCanvas.getContext('2d')!.putImageData(result, 0, 0);

      setProgress(97);

      // Convert to blob
      const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : outputFormat === 'webp' ? 'image/webp' : 'image/png';
      const quality = outputFormat === 'png' ? undefined : jpegQuality / 100;
      const blob = await new Promise<Blob>((resolve, reject) => {
        outCanvas.toBlob(b => b ? resolve(b) : reject(new Error('Failed to encode')), mimeType, quality);
      });

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setResultBlob(blob);
      setResultWidth(result.width);
      setResultHeight(result.height);
      setProgress(100);
      setState('done');
      setComparePosition(50);
      setProcessingTime(Math.round(performance.now() - startTime));
    } catch (e) {
      setError(`Upscaling failed: ${(e as Error).message}`);
      setState('loaded');
    }
  }, [imageUrl, scale, sharpen, denoise, method, colorEnhance, outputFormat, jpegQuality, resultUrl]);

  const downloadResult = () => {
    if (!resultBlob || !imageFile) return;
    const baseName = imageFile.name.replace(/\.[^.]+$/, '');
    const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
    downloadBlob(resultBlob, `${baseName}-${scale}x-upscaled.${ext}`);
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageFile(null);
    setImageUrl('');
    setResultUrl('');
    setResultBlob(null);
    setImgWidth(0); setImgHeight(0);
    setResultWidth(0); setResultHeight(0);
    setError('');
    setState('idle');
    setProgress(0);
    setProcessingTime(0);
  };

  // Comparison slider drag
  const handleCompareMouseDown = () => { isDraggingRef.current = true; };
  const handleCompareMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current || !compareRef.current) return;
    const rect = compareRef.current.getBoundingClientRect();
    setComparePosition(Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => handleCompareMove(e.clientX);
    const onTouch = (e: TouchEvent) => handleCompareMove(e.touches[0].clientX);
    const onUp = () => { isDraggingRef.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouch);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onUp);
    };
  }, [handleCompareMove]);

  useEffect(() => () => {
    // cleanup urls
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const outW = Math.round(imgWidth * scale);
  const outH = Math.round(imgHeight * scale);

  const inputClass = 'w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800';
  const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';
  const valueClass = 'text-sm font-bold text-primary-700 dark:text-primary-400';

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />

      {/* Upload */}
      {state === 'idle' && (
        <>
          <FileDropzone
            accept="image/jpeg,image/png,image/webp,image/bmp,.jpg,.jpeg,.png,.webp,.bmp"
            maxSizeMB={30}
            onFiles={handleFiles}
            description="JPG, PNG, WebP, BMP — Max 30MB — Works best for images under 4000×4000px"
          />

          {/* Feature highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Maximize2, label: 'Up to 8x', desc: 'Upscale factor' },
              { icon: Sparkles, label: 'Smart Sharpen', desc: 'Unsharp mask' },
              { icon: Shield, label: '100% Private', desc: 'Browser-only' },
              { icon: Palette, label: '4 Presets', desc: 'Photo, Art, Text, Anime' },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <f.icon className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{f.label}</p>
                  <p className="text-[10px] text-slate-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {state !== 'idle' && imageUrl && (
        <div className="space-y-5">
          {/* Image preview with info bar */}
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Original" className="w-full max-h-[350px] object-contain" />
            <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                <Image className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[150px]">{imageFile?.name}</span>
                <span className="font-medium shrink-0">{formatFileSize(imageFile?.size || 0)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs shrink-0">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                  {formatDimensions(imgWidth, imgHeight)}
                </span>
                <span className="text-slate-400">{formatMegapixels(imgWidth, imgHeight)}</span>
              </div>
            </div>
          </div>

          {/* Settings */}
          {(state === 'loaded' || state === 'done') && (
            <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Upscale Settings</h3>
              </div>

              {/* Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Quick Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.entries(PRESETS) as [Exclude<Preset, 'custom'>, typeof PRESETS['photo']][]).map(([key, cfg]) => (
                    <button key={key} onClick={() => applyPreset(key)}
                      className={`p-3 rounded-xl text-left transition-all ${
                        preset === key
                          ? 'bg-primary-800 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'
                      }`}>
                      <div className="text-base mb-0.5">{cfg.emoji}</div>
                      <p className="text-xs font-bold">{cfg.label}</p>
                      <p className={`text-[10px] ${preset === key ? 'text-primary-200' : 'text-slate-400'}`}>{cfg.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale factor — 5 options */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Scale Factor</label>
                <div className="grid grid-cols-5 gap-2">
                  {([2, 3, 4, 6, 8] as ScaleFactor[]).map(s => (
                    <button key={s} onClick={() => setScale(s)}
                      className={`relative px-2 py-3 rounded-xl text-center transition-all ${
                        scale === s
                          ? 'bg-primary-800 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'
                      }`}>
                      <div className="text-lg font-black">{s}x</div>
                      <div className={`text-[9px] mt-0.5 leading-tight ${scale === s ? 'text-primary-200' : 'text-slate-400'}`}>
                        {formatDimensions(imgWidth * s, imgHeight * s)}
                      </div>
                      {s === 2 && <span className="absolute -top-1 -right-1 text-[8px] px-1 py-0.5 rounded-full bg-green-500 text-white font-bold">Fast</span>}
                      {s === 8 && <span className="absolute -top-1 -right-1 text-[8px] px-1 py-0.5 rounded-full bg-amber-500 text-white font-bold">HD</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output dimensions preview */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="text-sm">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">{formatDimensions(imgWidth, imgHeight)}</span>
                  <span className="text-blue-400 mx-2">→</span>
                  <span className="text-blue-900 dark:text-blue-100 font-bold">{formatDimensions(outW, outH)}</span>
                  <span className="text-blue-500 dark:text-blue-400 text-xs ml-2">({formatMegapixels(outW, outH)})</span>
                </div>
              </div>

              {/* Advanced toggle */}
              <button onClick={() => { setShowAdvanced(!showAdvanced); if (!showAdvanced) setPreset('custom'); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                <Settings className="w-3.5 h-3.5" /> Advanced Controls
                <span className="text-[10px]">{showAdvanced ? '▲' : '▼'}</span>
              </button>

              {showAdvanced && (
                <div className="space-y-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  {/* Algorithm */}
                  <div>
                    <label className={labelClass}>Upscale Algorithm</label>
                    <div className="flex gap-2 mt-1.5">
                      {(['lanczos', 'bicubic'] as UpscaleMethod[]).map(m => (
                        <button key={m} onClick={() => { setMethod(m); setPreset('custom'); }}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                            method === m
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-300 dark:border-primary-700'
                              : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                          }`}>
                          {m === 'lanczos' ? 'Lanczos-3 (Sharper)' : 'Bicubic (Smoother)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sharpen */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className={`${labelClass} flex items-center gap-1`}><Sparkles className="w-3.5 h-3.5" />Sharpen</label>
                      <span className={valueClass}>{Math.round(sharpen * 100)}%</span>
                    </div>
                    <input type="range" min={0} max={1} step={0.05} value={sharpen}
                      onChange={e => { setSharpen(parseFloat(e.target.value)); setPreset('custom'); }}
                      className={inputClass} />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5"><span>None</span><span>Maximum</span></div>
                  </div>

                  {/* Denoise */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className={`${labelClass} flex items-center gap-1`}><Shield className="w-3.5 h-3.5" />Denoise</label>
                      <span className={valueClass}>{Math.round(denoise * 100)}%</span>
                    </div>
                    <input type="range" min={0} max={0.5} step={0.05} value={denoise}
                      onChange={e => { setDenoise(parseFloat(e.target.value)); setPreset('custom'); }}
                      className={inputClass} />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5"><span>None</span><span>Strong</span></div>
                  </div>

                  {/* Color Enhancement */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className={`${labelClass} flex items-center gap-1`}><Contrast className="w-3.5 h-3.5" />Color Enhance</label>
                      <span className={valueClass}>{Math.round(colorEnhance * 100)}%</span>
                    </div>
                    <input type="range" min={0} max={1} step={0.05} value={colorEnhance}
                      onChange={e => { setColorEnhance(parseFloat(e.target.value)); setPreset('custom'); }}
                      className={inputClass} />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5"><span>Original</span><span>Vivid</span></div>
                  </div>

                  {/* Output Format */}
                  <div>
                    <label className={labelClass}>Output Format</label>
                    <div className="flex gap-2 mt-1.5">
                      {(['png', 'jpeg', 'webp'] as OutputFormat[]).map(f => (
                        <button key={f} onClick={() => setOutputFormat(f)}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                            outputFormat === f
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-300 dark:border-primary-700'
                              : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                          }`}>
                          {f.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* JPEG/WebP Quality */}
                  {outputFormat !== 'png' && (
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className={labelClass}>Quality</label>
                        <span className={valueClass}>{jpegQuality}%</span>
                      </div>
                      <input type="range" min={50} max={100} step={1} value={jpegQuality}
                        onChange={e => setJpegQuality(parseInt(e.target.value))}
                        className={inputClass} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          {state === 'loaded' && (
            <div className="flex gap-3">
              <button onClick={processImage}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-800 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors text-base">
                <Maximize2 className="w-5 h-5" />
                Upscale {scale}x{preset !== 'custom' ? ` (${PRESETS[preset].label})` : ''}
              </button>
              <button onClick={reset}
                className="flex items-center px-4 py-3.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Processing */}
          {state === 'processing' && (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="relative">
                <Loader2 className="w-14 h-14 text-primary-700 animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-400">{progress}%</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Upscaling {scale}x with {method === 'lanczos' ? 'Lanczos-3' : 'Bicubic'} interpolation...
                </p>
                <p className="text-xs text-slate-400 mt-1">{formatDimensions(imgWidth, imgHeight)} → {formatDimensions(outW, outH)}</p>
              </div>
              <div className="w-full max-w-md h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-600 to-primary-800 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex flex-wrap gap-3 text-[10px] text-slate-400">
                {progress < 55 && <span>Interpolating pixels...</span>}
                {progress >= 55 && progress < 70 && <span>Denoising...</span>}
                {progress >= 70 && progress < 85 && <span>Sharpening edges...</span>}
                {progress >= 85 && progress < 95 && <span>Enhancing colors...</span>}
                {progress >= 95 && <span>Encoding output...</span>}
              </div>
            </div>
          )}

          {/* Result */}
          {state === 'done' && resultUrl && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Upscaled Result</h3>
                  <p className="text-xs text-slate-400">Processed in {(processingTime / 1000).toFixed(1)}s</p>
                </div>
                <button onClick={() => setShowComparison(!showComparison)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  {showComparison ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showComparison ? 'Hide Comparison' : 'Compare'}
                </button>
              </div>

              {/* Side-by-side comparison slider */}
              {showComparison ? (
                <div
                  ref={compareRef}
                  className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 select-none cursor-col-resize bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#e2e8f0_0%_50%)] bg-[length:16px_16px] dark:bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)]"
                  style={{ aspectRatio: `${imgWidth}/${imgHeight}`, maxHeight: '500px' }}
                  onMouseDown={handleCompareMouseDown}
                  onTouchStart={handleCompareMouseDown}
                >
                  {/* Upscaled (full background) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resultUrl} alt="Upscaled" className="absolute inset-0 w-full h-full object-contain" />
                  {/* Original (clipped) */}
                  <div className="absolute inset-0 overflow-hidden" style={{ width: `${comparePosition}%` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Original" className="w-full h-full object-contain" style={{ width: `${100 / (comparePosition / 100)}%`, maxWidth: 'none' }} />
                  </div>
                  {/* Divider line */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10" style={{ left: `${comparePosition}%` }}>
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center border-2 border-primary-600">
                      <ArrowRight className="w-4 h-4 text-primary-600 rotate-180" />
                      <ArrowRight className="w-4 h-4 text-primary-600 -ml-1" />
                    </div>
                  </div>
                  {/* Labels */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 text-white text-xs font-medium backdrop-blur-sm">Original</div>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-primary-600 text-white text-xs font-medium">{scale}x Upscaled</div>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resultUrl} alt="Upscaled" className="w-full max-h-[500px] object-contain" />
                </div>
              )}

              {/* Stats comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs text-slate-400 mb-1">Original</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatDimensions(imgWidth, imgHeight)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatFileSize(imageFile?.size || 0)} • {formatMegapixels(imgWidth, imgHeight)}</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-green-200 dark:border-green-800 text-center">
                  <p className="text-xs text-green-600 dark:text-green-400 mb-1">{scale}x Upscaled</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">{formatDimensions(resultWidth, resultHeight)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatFileSize(resultBlob?.size || 0)} • {formatMegapixels(resultWidth, resultHeight)}</p>
                </div>
              </div>

              {/* Enhancement badge */}
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <Maximize2 className="w-3.5 h-3.5" />
                  {scale * scale}x more pixels • {method === 'lanczos' ? 'Lanczos-3' : 'Bicubic'}{sharpen > 0 ? ' + Sharpened' : ''}{colorEnhance > 0 ? ' + Enhanced' : ''}
                </span>
              </div>

              {/* Download & actions */}
              <div className="flex flex-wrap gap-3">
                <DownloadButton onClick={downloadResult}
                  label={`Download ${outputFormat.toUpperCase()} (${formatFileSize(resultBlob?.size || 0)})`}
                  className="flex-1 justify-center py-3" />
                <button onClick={() => setState('loaded')}
                  className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                  <ZoomIn className="w-4 h-4" /> Adjust & Re-upscale
                </button>
                <button onClick={reset}
                  className="flex items-center px-4 py-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">{error}</p>
      )}
    </div>
  );
}
