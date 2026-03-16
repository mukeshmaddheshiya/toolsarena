'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize } from '@/lib/utils';
import { Images, RotateCcw, Loader2, X, GripVertical, Play, Pause } from 'lucide-react';

/* ── Minimal GIF89a Encoder ────────────────────────────────────────── */

class GifEncoder {
  private width: number;
  private height: number;
  private data: number[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  private writeByte(b: number) { this.data.push(b & 0xff); }
  private writeShort(s: number) { this.writeByte(s & 0xff); this.writeByte((s >> 8) & 0xff); }
  private writeString(s: string) { for (let i = 0; i < s.length; i++) this.writeByte(s.charCodeAt(i)); }

  start(loops: number = 0) {
    this.writeString('GIF89a');
    this.writeShort(this.width);
    this.writeShort(this.height);
    this.writeByte(0x70);
    this.writeByte(0);
    this.writeByte(0);
    // Netscape looping extension
    this.writeByte(0x21);
    this.writeByte(0xff);
    this.writeByte(11);
    this.writeString('NETSCAPE2.0');
    this.writeByte(3);
    this.writeByte(1);
    this.writeShort(loops);
    this.writeByte(0);
  }

  addFrame(imageData: ImageData, delayCentiseconds: number) {
    const pixels = imageData.data;
    const { palette, indexed } = this.quantize(pixels);

    // Graphic Control Extension
    this.writeByte(0x21);
    this.writeByte(0xf9);
    this.writeByte(4);
    this.writeByte(0x00);
    this.writeShort(delayCentiseconds);
    this.writeByte(0);
    this.writeByte(0);

    // Image Descriptor
    this.writeByte(0x2c);
    this.writeShort(0);
    this.writeShort(0);
    this.writeShort(this.width);
    this.writeShort(this.height);
    this.writeByte(0x87); // local color table, 256 colors

    // Local Color Table
    for (let i = 0; i < 256; i++) {
      this.writeByte(palette[i * 3] || 0);
      this.writeByte(palette[i * 3 + 1] || 0);
      this.writeByte(palette[i * 3 + 2] || 0);
    }

    this.writeLZW(indexed);
  }

  finish(): Uint8Array {
    this.writeByte(0x3b);
    return new Uint8Array(this.data);
  }

  private quantize(pixels: Uint8ClampedArray): { palette: number[]; indexed: number[] } {
    const palette: number[] = [];
    const colorMap = new Map<number, number>();
    const indexed: number[] = [];

    let idx = 0;
    for (let r = 0; r < 6; r++) {
      for (let g = 0; g < 6; g++) {
        for (let b = 0; b < 6; b++) {
          palette.push(Math.round(r * 255 / 5), Math.round(g * 255 / 5), Math.round(b * 255 / 5));
          colorMap.set((r << 16) | (g << 8) | b, idx++);
        }
      }
    }
    while (palette.length < 768) palette.push(0);

    const numPixels = pixels.length / 4;
    for (let i = 0; i < numPixels; i++) {
      const r = Math.round(pixels[i * 4] * 5 / 255);
      const g = Math.round(pixels[i * 4 + 1] * 5 / 255);
      const b = Math.round(pixels[i * 4 + 2] * 5 / 255);
      indexed.push(colorMap.get((r << 16) | (g << 8) | b) || 0);
    }

    return { palette, indexed };
  }

  private writeLZW(indexed: number[]) {
    const minCodeSize = 8;
    this.writeByte(minCodeSize);

    const clearCode = 1 << minCodeSize;
    const eoiCode = clearCode + 1;
    let codeSize = minCodeSize + 1;
    let nextCode = eoiCode + 1;

    const output: number[] = [];
    let bitBuffer = 0;
    let bitCount = 0;

    const emit = (code: number) => {
      bitBuffer |= code << bitCount;
      bitCount += codeSize;
      while (bitCount >= 8) {
        output.push(bitBuffer & 0xff);
        bitBuffer >>= 8;
        bitCount -= 8;
      }
    };

    let table = new Map<string, number>();
    const resetTable = () => {
      table = new Map();
      for (let i = 0; i < clearCode; i++) table.set(String(i), i);
      codeSize = minCodeSize + 1;
      nextCode = eoiCode + 1;
    };

    resetTable();
    emit(clearCode);

    let w = String(indexed[0]);
    for (let i = 1; i < indexed.length; i++) {
      const k = String(indexed[i]);
      const wk = w + ',' + k;
      if (table.has(wk)) {
        w = wk;
      } else {
        emit(table.get(w)!);
        if (nextCode < 4096) {
          table.set(wk, nextCode++);
          if (nextCode > (1 << codeSize) && codeSize < 12) codeSize++;
        } else {
          emit(clearCode);
          resetTable();
        }
        w = k;
      }
    }
    emit(table.get(w)!);
    emit(eoiCode);
    if (bitCount > 0) output.push(bitBuffer & 0xff);

    let pos = 0;
    while (pos < output.length) {
      const blockSize = Math.min(255, output.length - pos);
      this.writeByte(blockSize);
      for (let i = 0; i < blockSize; i++) this.writeByte(output[pos + i]);
      pos += blockSize;
    }
    this.writeByte(0);
  }
}

/* ── Types ─────────────────────────────────────────────────────────── */

interface FrameImage {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
}

/* ── Component ─────────────────────────────────────────────────────── */

export function GifMakerTool() {
  const [frames, setFrames] = useState<FrameImage[]>([]);
  const [delay, setDelay] = useState(500); // ms
  const [outputWidth, setOutputWidth] = useState(480);
  const [loops, setLoops] = useState(0); // 0 = infinite

  const [state, setState] = useState<'idle' | 'generating' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [gifUrl, setGifUrl] = useState('');
  const [gifSize, setGifSize] = useState(0);
  const [error, setError] = useState('');

  // Preview animation
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const previewTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = useCallback((files: File[]) => {
    setError('');
    const promises = files.map(file => new Promise<FrameImage>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => resolve({ id: crypto.randomUUID(), file, url, width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Failed to load ${file.name}`)); };
      img.src = url;
    }));

    Promise.all(promises).then(newFrames => {
      setFrames(prev => [...prev, ...newFrames]);
    }).catch(e => setError((e as Error).message));
  }, []);

  const removeFrame = (index: number) => {
    setFrames(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const duplicateFrame = (index: number) => {
    setFrames(prev => {
      const frame = prev[index];
      const newFrame: FrameImage = { ...frame, id: crypto.randomUUID() };
      const updated = [...prev];
      updated.splice(index + 1, 0, newFrame);
      return updated;
    });
  };

  const reverseFrames = () => setFrames(prev => [...prev].reverse());

  const clearAllFrames = () => {
    frames.forEach(f => URL.revokeObjectURL(f.url));
    setFrames([]);
  };

  // Drag-and-drop reorder
  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setFrames(prev => {
      const items = [...prev];
      const [removed] = items.splice(dragIndex, 1);
      items.splice(index, 0, removed);
      return items;
    });
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  // Preview animation
  const togglePreview = () => {
    if (isPreviewPlaying) {
      if (previewTimer.current) clearInterval(previewTimer.current);
      setIsPreviewPlaying(false);
    } else {
      setIsPreviewPlaying(true);
      setPreviewIndex(0);
      previewTimer.current = setInterval(() => {
        setPreviewIndex(prev => (prev + 1) % frames.length);
      }, delay);
    }
  };

  useEffect(() => {
    return () => { if (previewTimer.current) clearInterval(previewTimer.current); };
  }, []);

  useEffect(() => {
    // Restart preview if delay changes while playing
    if (isPreviewPlaying && previewTimer.current) {
      clearInterval(previewTimer.current);
      previewTimer.current = setInterval(() => {
        setPreviewIndex(prev => (prev + 1) % frames.length);
      }, delay);
    }
  }, [delay, isPreviewPlaying, frames.length]);

  const generateGif = useCallback(async () => {
    if (frames.length < 2) { setError('Add at least 2 images to create a GIF.'); return; }

    setState('generating');
    setProgress(0);
    setError('');

    try {
      const canvas = canvasRef.current!;
      // Calculate height from first image aspect ratio
      const firstFrame = frames[0];
      const aspect = firstFrame.height / firstFrame.width;
      const w = outputWidth;
      const h = Math.round(w * aspect);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      const delayCentiseconds = Math.round(delay / 10);
      const encoder = new GifEncoder(w, h);
      encoder.start(loops);

      for (let i = 0; i < frames.length; i++) {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load frame ${i + 1}`));
          img.src = frames[i].url;
        });

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        encoder.addFrame(imageData, delayCentiseconds);

        setProgress(Math.round(((i + 1) / frames.length) * 100));
        await new Promise(r => setTimeout(r, 0));
      }

      const gifData = encoder.finish();
      const blob = new Blob([gifData.buffer as ArrayBuffer], { type: 'image/gif' });
      if (gifUrl) URL.revokeObjectURL(gifUrl);
      setGifUrl(URL.createObjectURL(blob));
      setGifSize(blob.size);
      setState('done');
    } catch (e) {
      setError(`Generation failed: ${(e as Error).message}`);
      setState('idle');
    }
  }, [frames, outputWidth, delay, loops, gifUrl]);

  const reset = () => {
    frames.forEach(f => URL.revokeObjectURL(f.url));
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    if (previewTimer.current) clearInterval(previewTimer.current);
    setFrames([]);
    setGifUrl('');
    setGifSize(0);
    setProgress(0);
    setError('');
    setState('idle');
    setIsPreviewPlaying(false);
  };

  const downloadGif = () => {
    if (!gifUrl) return;
    const a = document.createElement('a');
    a.href = gifUrl;
    a.download = 'animated.gif';
    a.click();
  };

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />

      {/* Upload area */}
      <FileDropzone
        accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
        multiple
        maxSizeMB={20}
        onFiles={handleFiles}
        description="JPEG, PNG, WebP — max 20MB each — upload multiple images"
      />

      {/* Frames grid */}
      {frames.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100">
              <Images className="w-4 h-4 inline mr-1.5" />
              Frames ({frames.length})
              <span className="text-xs font-normal text-slate-400 ml-2">
                Total: {((frames.length * delay) / 1000).toFixed(1)}s
              </span>
            </h3>
            <div className="flex items-center gap-1.5">
              {frames.length >= 2 && (
                <>
                  <button onClick={togglePreview} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    {isPreviewPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isPreviewPlaying ? 'Stop' : 'Preview'}
                  </button>
                  <button onClick={reverseFrames} title="Reverse frame order"
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <RotateCcw className="w-3 h-3" /> Reverse
                  </button>
                </>
              )}
              <button onClick={clearAllFrames} title="Remove all frames"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <X className="w-3 h-3" /> Clear
              </button>
            </div>
          </div>

          {/* Preview window */}
          {isPreviewPlaying && frames.length >= 2 && (
            <div className="flex justify-center p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <img
                src={frames[previewIndex]?.url}
                alt={`Frame ${previewIndex + 1}`}
                className="max-h-[250px] rounded-lg object-contain"
              />
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {frames.map((frame, i) => (
              <div
                key={frame.id}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={e => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                  dragIndex === i
                    ? 'border-primary-500 scale-95 opacity-50'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary-400'
                }`}
              >
                <img src={frame.url} alt={`Frame ${i + 1}`} className="w-full aspect-square object-cover" />
                {/* Frame number */}
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-xs font-bold">
                  {i + 1}
                </div>
                {/* Drag handle */}
                <div className="absolute top-1 left-1 p-0.5 rounded bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-3 h-3" />
                </div>
                {/* Duplicate button */}
                <button
                  onClick={() => duplicateFrame(i)}
                  title="Duplicate frame"
                  className="absolute top-1 right-7 p-0.5 rounded-full bg-blue-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                >
                  <Images className="w-3 h-3" />
                </button>
                {/* Remove button */}
                <button
                  onClick={() => removeFrame(i)}
                  className="absolute top-1 right-1 p-0.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      {frames.length >= 2 && state !== 'generating' && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100">GIF Settings</h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Frame Delay</label>
                <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{delay}ms</span>
              </div>
              <input
                type="range" min={100} max={2000} step={50}
                value={delay} onChange={e => setDelay(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Fast</span><span>Slow</span></div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Width</label>
                <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{outputWidth}px</span>
              </div>
              <input
                type="range" min={160} max={800} step={20}
                value={outputWidth} onChange={e => setOutputWidth(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Loop</label>
                <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{loops === 0 ? 'Infinite' : `${loops}×`}</span>
              </div>
              <input
                type="range" min={0} max={10} step={1}
                value={loops} onChange={e => setLoops(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>∞</span><span>10×</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Generate button */}
      {frames.length >= 2 && state === 'idle' && (
        <div className="flex gap-3">
          <button
            onClick={generateGif}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-800 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            <Images className="w-5 h-5" />
            Create GIF
          </button>
          <button onClick={reset}
            className="flex items-center gap-1.5 px-4 py-3 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Generating */}
      {state === 'generating' && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Creating GIF... {progress}%</p>
          <div className="w-full max-w-md h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary-700 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Result */}
      {state === 'done' && gifUrl && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100">Your GIF</h3>
              <span className="text-sm font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {formatFileSize(gifSize)}
              </span>
            </div>
            <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 flex justify-center">
              <img src={gifUrl} alt="Generated GIF" className="max-h-[400px] object-contain" />
            </div>
          </div>
          <div className="flex gap-3">
            <DownloadButton onClick={downloadGif} label="Download GIF" className="flex-1 justify-center py-3" />
            <button onClick={reset}
              className="inline-flex items-center gap-1.5 px-4 py-3 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
              <RotateCcw className="w-4 h-4" /> Start Over
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>
      )}
    </div>
  );
}
