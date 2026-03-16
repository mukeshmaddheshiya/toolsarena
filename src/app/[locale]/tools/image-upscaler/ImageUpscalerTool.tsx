'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize, downloadBlob } from '@/lib/utils';
import { ZoomIn, RotateCcw, Loader2, Settings, Maximize2, Sparkles, SlidersHorizontal, Eye, EyeOff, ArrowRight } from 'lucide-react';

/* ── Image Processing Engine ───────────────────────────────────────── */

function upscaleImage(
  source: ImageData,
  scale: number,
  sharpen: number,
  denoise: number,
): ImageData {
  const srcW = source.width;
  const srcH = source.height;
  const dstW = srcW * scale;
  const dstH = srcH * scale;
  const src = source.data;

  // Step 1: Bicubic interpolation upscale
  const upscaled = new Uint8ClampedArray(dstW * dstH * 4);

  // Bicubic kernel
  function cubic(t: number): number {
    const a = -0.5;
    const at = Math.abs(t);
    if (at <= 1) return (a + 2) * at * at * at - (a + 3) * at * at + 1;
    if (at < 2) return a * at * at * at - 5 * a * at * at + 8 * a * at - 4 * a;
    return 0;
  }

  function clamp(v: number, min: number, max: number) {
    return v < min ? min : v > max ? max : v;
  }

  function getPixel(x: number, y: number, ch: number): number {
    const cx = clamp(x, 0, srcW - 1);
    const cy = clamp(y, 0, srcH - 1);
    return src[(cy * srcW + cx) * 4 + ch];
  }

  for (let dy = 0; dy < dstH; dy++) {
    for (let dx = 0; dx < dstW; dx++) {
      const srcX = dx / scale;
      const srcY = dy / scale;
      const ix = Math.floor(srcX);
      const iy = Math.floor(srcY);
      const fx = srcX - ix;
      const fy = srcY - iy;

      for (let ch = 0; ch < 4; ch++) {
        let sum = 0;
        let weightSum = 0;

        for (let m = -1; m <= 2; m++) {
          for (let n = -1; n <= 2; n++) {
            const w = cubic(m - fy) * cubic(n - fx);
            sum += getPixel(ix + n, iy + m, ch) * w;
            weightSum += w;
          }
        }

        upscaled[(dy * dstW + dx) * 4 + ch] = clamp(Math.round(sum / weightSum), 0, 255);
      }
    }
  }

  // Step 2: Denoise (simple box blur pass if denoise > 0)
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
              const px = clamp(x + kx, 0, dstW - 1);
              const py = clamp(y + ky, 0, dstH - 1);
              sum += processed[(py * dstW + px) * 4 + ch];
            }
          }
          // Blend between original and denoised based on denoise strength
          const denoiseVal = sum / kernelSize;
          const origVal = processed[(y * dstW + x) * 4 + ch];
          denoised[(y * dstW + x) * 4 + ch] = Math.round(origVal * (1 - denoise) + denoiseVal * denoise);
        }
        denoised[(y * dstW + x) * 4 + 3] = processed[(y * dstW + x) * 4 + 3]; // alpha
      }
    }
    processed = denoised;
  }

  // Step 3: Sharpen (unsharp mask)
  if (sharpen > 0) {
    const sharpened = new Uint8ClampedArray(dstW * dstH * 4);
    const strength = sharpen * 2;

    for (let y = 0; y < dstH; y++) {
      for (let x = 0; x < dstW; x++) {
        for (let ch = 0; ch < 3; ch++) {
          const idx = (y * dstW + x) * 4 + ch;
          const center = processed[idx];

          // Simple 3x3 laplacian for edge detection
          let neighbors = 0;
          let count = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              if (kx === 0 && ky === 0) continue;
              const px = clamp(x + kx, 0, dstW - 1);
              const py = clamp(y + ky, 0, dstH - 1);
              neighbors += processed[(py * dstW + px) * 4 + ch];
              count++;
            }
          }

          const blur = neighbors / count;
          const edge = center - blur;
          sharpened[idx] = clamp(Math.round(center + edge * strength), 0, 255);
        }
        sharpened[(y * dstW + x) * 4 + 3] = processed[(y * dstW + x) * 4 + 3];
      }
    }
    processed = sharpened;
  }

  return new ImageData(processed, dstW, dstH);
}

/* ── Helpers ───────────────────────────────────────────────────────── */

function formatDimensions(w: number, h: number) {
  return `${w} × ${h}`;
}

function formatMegapixels(w: number, h: number) {
  return ((w * h) / 1_000_000).toFixed(1) + ' MP';
}

/* ── Component ─────────────────────────────────────────────────────── */

type ScaleFactor = 2 | 4 | 8;

export function ImageUpscalerTool() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  // Settings
  const [scale, setScale] = useState<ScaleFactor>(2);
  const [sharpen, setSharpen] = useState(0.5);
  const [denoise, setDenoise] = useState(0);

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
    img.onload = () => {
      setImgWidth(img.naturalWidth);
      setImgHeight(img.naturalHeight);
    };
    img.src = url;
  }, [imageUrl, resultUrl]);

  const processImage = useCallback(async () => {
    if (!imageUrl || !canvasRef.current) return;

    setState('processing');
    setProgress(10);
    setError('');

    try {
      // Load image
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
      });

      setProgress(20);

      // Draw to canvas to get ImageData
      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = img.naturalWidth;
      srcCanvas.height = img.naturalHeight;
      const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true })!;
      srcCtx.drawImage(img, 0, 0);
      const sourceData = srcCtx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);

      setProgress(30);

      // Process in chunks to keep UI responsive
      const outW = img.naturalWidth * scale;
      const outH = img.naturalHeight * scale;

      // For very large images, process in tiles
      const maxPixels = 4000 * 4000; // 16MP limit per tile
      if (outW * outH > maxPixels && scale > 2) {
        setError(`Output would be ${outW}×${outH} (${formatMegapixels(outW, outH)}). Try a smaller scale for this image.`);
        setState('loaded');
        return;
      }

      // Yield to UI before heavy processing
      await new Promise(r => setTimeout(r, 50));
      setProgress(40);

      const result = upscaleImage(sourceData, scale, sharpen, denoise);
      setProgress(80);

      // Draw result to output canvas
      const outCanvas = canvasRef.current;
      outCanvas.width = result.width;
      outCanvas.height = result.height;
      const outCtx = outCanvas.getContext('2d')!;
      outCtx.putImageData(result, 0, 0);

      setProgress(90);

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        outCanvas.toBlob(b => b ? resolve(b) : reject(new Error('Failed to encode')), 'image/png', 1);
      });

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setResultBlob(blob);
      setResultWidth(result.width);
      setResultHeight(result.height);
      setProgress(100);
      setState('done');
      setComparePosition(50);
    } catch (e) {
      setError(`Upscaling failed: ${(e as Error).message}`);
      setState('loaded');
    }
  }, [imageUrl, scale, sharpen, denoise, resultUrl]);

  const downloadResult = () => {
    if (!resultBlob || !imageFile) return;
    const baseName = imageFile.name.replace(/\.[^.]+$/, '');
    downloadBlob(resultBlob, `${baseName}-${scale}x-upscaled.png`);
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageFile(null);
    setImageUrl('');
    setResultUrl('');
    setResultBlob(null);
    setImgWidth(0);
    setImgHeight(0);
    setResultWidth(0);
    setResultHeight(0);
    setError('');
    setState('idle');
    setProgress(0);
    setScale(2);
    setSharpen(0.5);
    setDenoise(0);
  };

  // Comparison slider drag
  const handleCompareMouseDown = () => { isDraggingRef.current = true; };
  const handleCompareMouseUp = () => { isDraggingRef.current = false; };
  const handleCompareMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current || !compareRef.current) return;
    const rect = compareRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    setComparePosition(Math.max(5, Math.min(95, (x / rect.width) * 100)));
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

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const outW = imgWidth * scale;
  const outH = imgHeight * scale;

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />

      {/* Upload */}
      {state === 'idle' && (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          maxSizeMB={20}
          onFiles={handleFiles}
          description="JPG, PNG, WebP — max 20MB — best for images under 2000×2000px"
        />
      )}

      {state !== 'idle' && imageUrl && (
        <div className="space-y-5">
          {/* Image preview */}
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
            <img src={imageUrl} alt="Original" className="w-full max-h-[350px] object-contain" />
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{imageFile?.name}</span>
                <span className="font-medium">{formatFileSize(imageFile?.size || 0)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
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
                <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100">Upscale Settings</h3>
              </div>

              {/* Scale factor */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Scale Factor</label>
                <div className="grid grid-cols-3 gap-2">
                  {([2, 4, 8] as ScaleFactor[]).map(s => (
                    <button key={s} onClick={() => setScale(s)}
                      className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        scale === s
                          ? 'bg-primary-800 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'
                      }`}>
                      <div className="text-lg font-bold">{s}x</div>
                      <div className={`text-xs mt-0.5 ${scale === s ? 'text-primary-200' : 'text-slate-400'}`}>
                        {formatDimensions(imgWidth * s, imgHeight * s)}
                      </div>
                      {s === 2 && <span className="absolute top-1 right-1.5 text-[9px] px-1 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">Fast</span>}
                      {s === 8 && <span className="absolute top-1 right-1.5 text-[9px] px-1 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">Slow</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sharpen & Denoise */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Sparkles className="w-3.5 h-3.5 inline mr-1" />Sharpen
                    </label>
                    <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{Math.round(sharpen * 100)}%</span>
                  </div>
                  <input type="range" min={0} max={1} step={0.05} value={sharpen}
                    onChange={e => setSharpen(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5"><span>None</span><span>Max</span></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Settings className="w-3.5 h-3.5 inline mr-1" />Denoise
                    </label>
                    <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{Math.round(denoise * 100)}%</span>
                  </div>
                  <input type="range" min={0} max={0.5} step={0.05} value={denoise}
                    onChange={e => setDenoise(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5"><span>None</span><span>Smooth</span></div>
                </div>
              </div>

              {/* Output info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="text-center p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Input</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{formatDimensions(imgWidth, imgHeight)}</p>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Output</p>
                  <p className="text-xs font-bold text-primary-700 dark:text-primary-400">{formatDimensions(outW, outH)}</p>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Scale</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{scale}x upscale</p>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Megapixels</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{formatMegapixels(imgWidth, imgHeight)} → {formatMegapixels(outW, outH)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {state === 'loaded' && (
            <div className="flex gap-3">
              <button onClick={processImage}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-800 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors text-base">
                <Maximize2 className="w-5 h-5" />
                Upscale {scale}x
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
                <Loader2 className="w-12 h-12 text-primary-700 animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-400">{progress}%</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Upscaling {scale}x...</p>
                <p className="text-xs text-slate-400 mt-1">{formatDimensions(imgWidth, imgHeight)} → {formatDimensions(outW, outH)}</p>
              </div>
              <div className="w-full max-w-md h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-600 to-primary-800 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-slate-400">Bicubic interpolation + sharpening... this may take a moment for large images</p>
            </div>
          )}

          {/* Result */}
          {state === 'done' && resultUrl && (
            <div className="space-y-4">
              {/* Comparison toggle */}
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-lg text-slate-900 dark:text-slate-100">Upscaled Result</h3>
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
                  className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 select-none cursor-col-resize"
                  style={{ aspectRatio: `${imgWidth}/${imgHeight}`, maxHeight: '500px' }}
                  onMouseDown={handleCompareMouseDown}
                  onMouseUp={handleCompareMouseUp}
                  onTouchStart={handleCompareMouseDown}
                >
                  {/* Upscaled (background) */}
                  <img src={resultUrl} alt="Upscaled" className="absolute inset-0 w-full h-full object-contain" />
                  {/* Original (clipped) */}
                  <div className="absolute inset-0 overflow-hidden" style={{ width: `${comparePosition}%` }}>
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
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 text-white text-xs font-medium">Original</div>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-primary-600 text-white text-xs font-medium">{scale}x Upscaled</div>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
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

              {/* Download & actions */}
              <div className="flex gap-3">
                <DownloadButton onClick={downloadResult}
                  label={`Download ${scale}x PNG (${formatFileSize(resultBlob?.size || 0)})`}
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
        <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>
      )}
    </div>
  );
}
