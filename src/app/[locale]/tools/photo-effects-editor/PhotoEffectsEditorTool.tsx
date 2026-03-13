'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { downloadBlob } from '@/lib/utils';
import { Download, RotateCcw, Loader2, Sliders } from 'lucide-react';

type EffectId = 'original' | 'grayscale' | 'sepia' | 'vintage' | 'sketch' | 'invert' | 'warm' | 'cool' | 'emboss' | 'posterize' | 'vignette' | 'sharpen';

interface Effect {
  id: EffectId;
  label: string;
  emoji: string;
  description: string;
}

const EFFECTS: Effect[] = [
  { id: 'original',   label: 'Original',   emoji: '🖼️', description: 'No effect' },
  { id: 'grayscale',  label: 'Grayscale',  emoji: '⚫', description: 'Classic black & white' },
  { id: 'sepia',      label: 'Sepia',      emoji: '🟤', description: 'Warm brownish tone' },
  { id: 'vintage',    label: 'Vintage',    emoji: '📷', description: 'Faded retro feel' },
  { id: 'sketch',     label: 'Pencil Sketch', emoji: '✏️', description: 'Hand-drawn look' },
  { id: 'warm',       label: 'Warm',       emoji: '🌅', description: 'Golden warm tone' },
  { id: 'cool',       label: 'Cool',       emoji: '❄️', description: 'Blue-tinted cool' },
  { id: 'invert',     label: 'Negative',   emoji: '🌑', description: 'Inverted colors' },
  { id: 'emboss',     label: 'Emboss',     emoji: '🗿', description: '3D relief texture' },
  { id: 'posterize',  label: 'Posterize',  emoji: '🎨', description: 'Poster art style' },
  { id: 'vignette',   label: 'Vignette',   emoji: '🔵', description: 'Dark edges focus' },
  { id: 'sharpen',    label: 'Sharpen',    emoji: '🔍', description: 'Crisp edge enhance' },
];

function applyGrayscale(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = g;
  }
}

function applySepia(data: Uint8ClampedArray, intensity: number) {
  const t = intensity / 100;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    data[i]     = Math.min(255, r * (1 - 0.607 * t) + g * (0.769 * t) + b * (0.189 * t));
    data[i + 1] = Math.min(255, r * (0.349 * t) + g * (1 - 0.314 * t) + b * (0.168 * t));
    data[i + 2] = Math.min(255, r * (0.272 * t) + g * (0.534 * t) + b * (1 - 0.869 * t));
  }
}

function applyVintage(data: Uint8ClampedArray, intensity: number) {
  const t = intensity / 100;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // Fade + sepia-lite + reduce blue
    data[i]     = Math.min(255, r * (1 - 0.3 * t) + 60 * t);
    data[i + 1] = Math.min(255, g * (1 - 0.2 * t) + 40 * t);
    data[i + 2] = Math.min(255, b * (1 - 0.5 * t) + 20 * t);
  }
}

function applyWarm(data: Uint8ClampedArray, intensity: number) {
  const t = intensity / 100;
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.min(255, data[i] + 40 * t);
    data[i + 1] = Math.min(255, data[i + 1] + 10 * t);
    data[i + 2] = Math.max(0,   data[i + 2] - 20 * t);
  }
}

function applyCool(data: Uint8ClampedArray, intensity: number) {
  const t = intensity / 100;
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.max(0,   data[i]     - 20 * t);
    data[i + 1] = Math.min(255, data[i + 1] + 5 * t);
    data[i + 2] = Math.min(255, data[i + 2] + 40 * t);
  }
}

function applyInvert(data: Uint8ClampedArray, intensity: number) {
  const t = intensity / 100;
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = data[i]     + (255 - 2 * data[i])     * t;
    data[i + 1] = data[i + 1] + (255 - 2 * data[i + 1]) * t;
    data[i + 2] = data[i + 2] + (255 - 2 * data[i + 2]) * t;
  }
}

function applyPosterize(data: Uint8ClampedArray, intensity: number) {
  const levels = Math.max(2, Math.round(8 - (intensity / 100) * 6));
  const step = 255 / (levels - 1);
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.round(Math.round(data[i]     / step) * step);
    data[i + 1] = Math.round(Math.round(data[i + 1] / step) * step);
    data[i + 2] = Math.round(Math.round(data[i + 2] / step) * step);
  }
}

function applyConvolution(data: Uint8ClampedArray, width: number, height: number, kernel: number[], factor = 1, bias = 0) {
  const size = Math.sqrt(kernel.length);
  const half = Math.floor(size / 2);
  const src = new Uint8ClampedArray(data);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;
      for (let ky = 0; ky < size; ky++) {
        for (let kx = 0; kx < size; kx++) {
          const px = Math.min(width - 1, Math.max(0, x + kx - half));
          const py = Math.min(height - 1, Math.max(0, y + ky - half));
          const idx = (py * width + px) * 4;
          const k = kernel[ky * size + kx];
          r += src[idx]     * k;
          g += src[idx + 1] * k;
          b += src[idx + 2] * k;
        }
      }
      const i = (y * width + x) * 4;
      data[i]     = Math.min(255, Math.max(0, r * factor + bias));
      data[i + 1] = Math.min(255, Math.max(0, g * factor + bias));
      data[i + 2] = Math.min(255, Math.max(0, b * factor + bias));
    }
  }
}

function boxBlur(data: Uint8ClampedArray, width: number, height: number, radius: number) {
  const size = 2 * radius + 1;
  const k = Array(size * size).fill(1 / (size * size));
  applyConvolution(data, width, height, k);
}

function applySketch(data: Uint8ClampedArray, width: number, height: number, intensity: number) {
  // Grayscale first
  applyGrayscale(data);
  // Copy grayscale
  const gray = new Uint8ClampedArray(data);
  // Invert
  for (let i = 0; i < gray.length; i += 4) { gray[i] = gray[i+1] = gray[i+2] = 255 - gray[i]; }
  // Blur the inverted
  boxBlur(gray, width, height, 3);
  // Color dodge blend
  const t = intensity / 100;
  for (let i = 0; i < data.length; i += 4) {
    const base = data[i];
    const blend = gray[i];
    const dodge = blend === 255 ? 255 : Math.min(255, (base * 256) / (256 - blend));
    const result = base + (dodge - base) * t;
    data[i] = data[i+1] = data[i+2] = Math.min(255, result);
  }
}

function applyEmboss(data: Uint8ClampedArray, width: number, height: number, intensity: number) {
  const t = intensity / 100;
  const kernel = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
  const src = new Uint8ClampedArray(data);
  applyConvolution(data, width, height, kernel, 1, 128);
  // Blend with original
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = src[i]     + (data[i]     - src[i])     * t;
    data[i + 1] = src[i + 1] + (data[i + 1] - src[i + 1]) * t;
    data[i + 2] = src[i + 2] + (data[i + 2] - src[i + 2]) * t;
  }
}

function applySharpen(data: Uint8ClampedArray, width: number, height: number, intensity: number) {
  const t = intensity / 100;
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const src = new Uint8ClampedArray(data);
  applyConvolution(data, width, height, kernel);
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = src[i]     + (data[i]     - src[i])     * t;
    data[i + 1] = src[i + 1] + (data[i + 1] - src[i + 1]) * t;
    data[i + 2] = src[i + 2] + (data[i + 2] - src[i + 2]) * t;
  }
}

function applyVignette(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  const t = intensity / 100;
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.7);
  gradient.addColorStop(0, `rgba(0,0,0,0)`);
  gradient.addColorStop(1, `rgba(0,0,0,${0.7 * t})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function processEffect(srcCanvas: HTMLCanvasElement, effectId: EffectId, intensity: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = srcCanvas.width;
  canvas.height = srcCanvas.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(srcCanvas, 0, 0);
  if (effectId === 'original') return canvas;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;
  switch (effectId) {
    case 'grayscale':  applyGrayscale(data); break;
    case 'sepia':      applySepia(data, intensity); break;
    case 'vintage':    applyVintage(data, intensity); break;
    case 'warm':       applyWarm(data, intensity); break;
    case 'cool':       applyCool(data, intensity); break;
    case 'invert':     applyInvert(data, intensity); break;
    case 'posterize':  applyPosterize(data, intensity); break;
    case 'sketch':     applySketch(data, width, height, intensity); break;
    case 'emboss':     applyEmboss(data, width, height, intensity); break;
    case 'sharpen':    applySharpen(data, width, height, intensity); break;
  }
  ctx.putImageData(imageData, 0, 0);
  if (effectId === 'vignette') applyVignette(ctx, width, height, intensity);
  return canvas;
}

export function PhotoEffectsEditorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [srcCanvas, setSrcCanvas] = useState<HTMLCanvasElement | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<EffectId>('original');
  const [intensity, setIntensity] = useState(80);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const prevUrlRef = useRef<string | null>(null);

  const applyAndPreview = useCallback((canvas: HTMLCanvasElement, effectId: EffectId, eff: number) => {
    setProcessing(true);
    setTimeout(() => {
      try {
        const result = processEffect(canvas, effectId, eff);
        result.toBlob(blob => {
          if (!blob) return;
          if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
          const url = URL.createObjectURL(blob);
          prevUrlRef.current = url;
          setPreviewUrl(url);
          setProcessing(false);
        }, 'image/png');
      } catch {
        setProcessing(false);
      }
    }, 20);
  }, []);

  function handleFile(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 1600;
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h);
        w = Math.round(w * ratio); h = Math.round(h * ratio);
      }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      setSrcCanvas(canvas);
      setSelectedEffect('original');
      setIntensity(80);
      applyAndPreview(canvas, 'original', 80);
    };
    img.src = url;
  }

  function handleEffectChange(eff: EffectId) {
    setSelectedEffect(eff);
    if (srcCanvas) applyAndPreview(srcCanvas, eff, intensity);
  }

  function handleIntensityChange(val: number) {
    setIntensity(val);
    if (srcCanvas) applyAndPreview(srcCanvas, selectedEffect, val);
  }

  function handleDownload() {
    if (!srcCanvas) return;
    const result = processEffect(srcCanvas, selectedEffect, intensity);
    result.toBlob(blob => {
      if (!blob || !file) return;
      const ext = file.name.replace(/\.[^.]+$/, '');
      downloadBlob(blob, `${ext}-${selectedEffect}.png`);
    }, 'image/png');
  }

  function resetTool() {
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    setFile(null); setSrcCanvas(null); setPreviewUrl(null);
    setSelectedEffect('original'); setIntensity(80);
  }

  return (
    <div className="space-y-5">
      {/* Upload */}
      {!file && (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
          multiple={false}
          maxSizeMB={20}
          onFiles={handleFile}
          description="JPG, PNG, WebP — max 20MB — processing is done locally in your browser"
        />
      )}

      {file && srcCanvas && (
        <>
          {/* Controls */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Intensity</span>
              </div>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{intensity}%</span>
            </div>
            <input type="range" min={10} max={100} step={5} value={intensity} onChange={e => handleIntensityChange(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" disabled={selectedEffect === 'original'} />
          </div>

          {/* Effect grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {EFFECTS.map(eff => (
              <button
                key={eff.id}
                onClick={() => handleEffectChange(eff.id)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all ${
                  selectedEffect === eff.id
                    ? 'bg-primary-800 border-primary-800 text-white scale-[1.03]'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-400 dark:hover:border-primary-500'
                }`}
              >
                <span className="text-xl leading-none">{eff.emoji}</span>
                <span className="text-xs font-medium leading-tight">{eff.label}</span>
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 min-h-[200px] flex items-center justify-center">
            {processing && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 rounded-xl">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            {/* Checkerboard */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-conic-gradient(#94a3b8 0% 25%, transparent 0% 50%)', backgroundSize: '16px 16px' }} />
            {previewUrl && (
              <img src={previewUrl} alt="Effect preview" className="relative max-h-[480px] max-w-full object-contain" />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleDownload} disabled={processing} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-800 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors">
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button onClick={resetTool} className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors">
              <RotateCcw className="w-4 h-4" /> New Image
            </button>
          </div>

          <p className="text-xs text-center text-slate-400 dark:text-slate-500">
            All effects run 100% in your browser — your image is never uploaded.
          </p>
        </>
      )}
    </div>
  );
}
