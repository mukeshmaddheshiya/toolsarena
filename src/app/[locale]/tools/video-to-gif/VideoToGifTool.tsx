'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize } from '@/lib/utils';
import { Film, RotateCcw, Loader2, Settings, Play, Pause, Image, Gauge, ArrowDownUp, Repeat } from 'lucide-react';

/* ── Minimal GIF89a Encoder ────────────────────────────────────────── */

class GifEncoder {
  private width: number;
  private height: number;
  private delay: number;
  private data: number[] = [];

  constructor(width: number, height: number, delay: number) {
    this.width = width;
    this.height = height;
    this.delay = delay;
  }

  private writeByte(b: number) { this.data.push(b & 0xff); }
  private writeShort(s: number) { this.writeByte(s & 0xff); this.writeByte((s >> 8) & 0xff); }
  private writeString(s: string) { for (let i = 0; i < s.length; i++) this.writeByte(s.charCodeAt(i)); }

  start() {
    this.writeString('GIF89a');
    this.writeShort(this.width);
    this.writeShort(this.height);
    this.writeByte(0x70);
    this.writeByte(0);
    this.writeByte(0);
    this.writeByte(0x21);
    this.writeByte(0xff);
    this.writeByte(11);
    this.writeString('NETSCAPE2.0');
    this.writeByte(3);
    this.writeByte(1);
    this.writeShort(0);
    this.writeByte(0);
  }

  addFrame(imageData: ImageData) {
    const pixels = imageData.data;
    const { palette, indexed } = this.quantize(pixels);

    this.writeByte(0x21);
    this.writeByte(0xf9);
    this.writeByte(4);
    this.writeByte(0x00);
    this.writeShort(this.delay);
    this.writeByte(0);
    this.writeByte(0);

    this.writeByte(0x2c);
    this.writeShort(0);
    this.writeShort(0);
    this.writeShort(this.width);
    this.writeShort(this.height);
    this.writeByte(0x87);

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
          colorMap.set((r << 16) | (g << 8) | b, idx);
          idx++;
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

/* ── Helpers ───────────────────────────────────────────────────────── */

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 10);
  return `${m}:${s.toString().padStart(2, '0')}.${ms}`;
}

/* ── Component ─────────────────────────────────────────────────────── */

type SpeedOption = 0.25 | 0.5 | 1 | 1.5 | 2;

export function VideoToGifTool() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [duration, setDuration] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);

  // Settings
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5);
  const [fps, setFps] = useState(10);
  const [outputWidth, setOutputWidth] = useState(480);
  const [speed, setSpeed] = useState<SpeedOption>(1);
  const [reverse, setReverse] = useState(false);

  // State
  const [state, setState] = useState<'idle' | 'loaded' | 'converting' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [gifUrl, setGifUrl] = useState<string>('');
  const [gifSize, setGifSize] = useState(0);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError('');
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    if (videoUrl) URL.revokeObjectURL(videoUrl);

    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setState('loaded');
    setGifUrl('');
    setGifSize(0);
    setProgress(0);
  }, [gifUrl, videoUrl]);

  const handleVideoLoaded = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setVideoWidth(video.videoWidth);
    setVideoHeight(video.videoHeight);
    setStartTime(0);
    setEndTime(Math.min(video.duration, 10));
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); setIsPlaying(true); }
    else { video.pause(); setIsPlaying(false); }
  };

  // Computed values
  const aspect = videoWidth > 0 ? videoHeight / videoWidth : 0.5625;
  const outputHeight = Math.round(outputWidth * aspect);
  const clipDuration = endTime - startTime;
  const effectiveDuration = clipDuration / speed;
  const estFrames = Math.ceil(clipDuration * fps);
  const gifDelay = Math.round(100 / (fps * speed)); // centiseconds adjusted for speed
  const estSize = estFrames * outputWidth * outputHeight * 0.15;

  const convertToGif = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setState('converting');
    setProgress(0);
    setError('');

    try {
      const w = outputWidth;
      const h = outputHeight;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      const frameDuration = 1 / fps;
      const totalFrames = estFrames;

      const encoder = new GifEncoder(w, h, gifDelay);
      encoder.start();

      // Build frame time array
      const frameTimes: number[] = [];
      for (let i = 0; i < totalFrames; i++) {
        frameTimes.push(startTime + i * frameDuration);
      }
      if (reverse) frameTimes.reverse();

      for (let i = 0; i < frameTimes.length; i++) {
        video.currentTime = frameTimes[i];

        await new Promise<void>((resolve) => {
          const onSeeked = () => { video.removeEventListener('seeked', onSeeked); resolve(); };
          video.addEventListener('seeked', onSeeked);
        });

        ctx.drawImage(video, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        encoder.addFrame(imageData);

        setProgress(Math.round(((i + 1) / frameTimes.length) * 100));
        await new Promise(r => setTimeout(r, 0));
      }

      const gifData = encoder.finish();
      const blob = new Blob([gifData.buffer as ArrayBuffer], { type: 'image/gif' });
      if (gifUrl) URL.revokeObjectURL(gifUrl);
      setGifUrl(URL.createObjectURL(blob));
      setGifSize(blob.size);
      setState('done');
    } catch (e) {
      setError(`Conversion failed: ${(e as Error).message}`);
      setState('loaded');
    }
  }, [startTime, endTime, fps, outputWidth, outputHeight, gifDelay, estFrames, reverse, gifUrl]);

  const reset = () => {
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoFile(null);
    setVideoUrl('');
    setGifUrl('');
    setGifSize(0);
    setDuration(0);
    setProgress(0);
    setError('');
    setState('idle');
    setStartTime(0);
    setEndTime(5);
    setIsPlaying(false);
    setSpeed(1);
    setReverse(false);
  };

  const downloadGif = () => {
    if (!gifUrl) return;
    const a = document.createElement('a');
    a.href = gifUrl;
    a.download = (videoFile?.name.replace(/\.[^.]+$/, '') || 'video') + '.gif';
    a.click();
  };

  const previewClip = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = startTime;
    video.play();
    setIsPlaying(true);
    const checkEnd = () => {
      if (video.currentTime >= endTime) { video.pause(); setIsPlaying(false); return; }
      if (!video.paused) requestAnimationFrame(checkEnd);
    };
    requestAnimationFrame(checkEnd);
  };

  useEffect(() => {
    return () => {
      if (gifUrl) URL.revokeObjectURL(gifUrl);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const speedOptions: SpeedOption[] = [0.25, 0.5, 1, 1.5, 2];

  return (
    <div className="space-y-5">
      {/* Upload */}
      {state === 'idle' && (
        <FileDropzone
          accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.webm,.mov,.avi"
          maxSizeMB={500}
          onFiles={handleFiles}
          description="MP4, WebM, MOV, AVI — max 500MB"
        />
      )}

      <canvas ref={canvasRef} className="hidden" />

      {state !== 'idle' && videoUrl && (
        <div className="space-y-5">
          {/* Video Preview */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={handleVideoLoaded}
              onEnded={() => setIsPlaying(false)}
              className="w-full max-h-[400px] object-contain"
              playsInline
              muted
            />
            <button
              onClick={togglePlay}
              className="absolute bottom-3 left-3 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">{formatFileSize(videoFile?.size || 0)}</span>
              <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">{videoWidth}x{videoHeight}</span>
              <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Settings */}
          {(state === 'loaded' || state === 'done') && (
            <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-5">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100">GIF Settings</h3>
              </div>

              {/* Timeline - Start/End */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Trim Timeline</label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Start</span>
                      <span className="text-sm font-bold text-primary-700 dark:text-primary-400 font-mono">{formatDuration(startTime)}</span>
                    </div>
                    <input type="range" min={0} max={Math.max(0, endTime - 0.1)} step={0.1}
                      value={startTime} onChange={e => setStartTime(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">End</span>
                      <span className="text-sm font-bold text-primary-700 dark:text-primary-400 font-mono">{formatDuration(endTime)}</span>
                    </div>
                    <input type="range" min={startTime + 0.1} max={duration} step={0.1}
                      value={endTime} onChange={e => setEndTime(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
                  </div>
                </div>

                {/* Visual timeline */}
                <div className="relative h-9 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden mt-3">
                  <div className="absolute inset-0 flex items-center px-2">
                    <div className="w-full h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                  </div>
                  <div className="absolute top-0 h-full bg-primary-500/20 dark:bg-primary-400/20 border-x-2 border-primary-600 dark:border-primary-400 transition-all"
                    style={{ left: `${(startTime / duration) * 100}%`, width: `${(clipDuration / duration) * 100}%` }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary-700 dark:text-primary-300 bg-white/80 dark:bg-slate-800/80 px-1.5 py-0.5 rounded">
                        {formatDuration(clipDuration)}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-0.5 left-1 text-[9px] text-slate-400">0:00</div>
                  <div className="absolute bottom-0.5 right-1 text-[9px] text-slate-400">{formatDuration(duration)}</div>
                </div>
              </div>

              {/* FPS, Width, Speed */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Output Settings</label>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Frame Rate</span>
                      <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fps} FPS</span>
                    </div>
                    <input type="range" min={5} max={25} step={1} value={fps}
                      onChange={e => setFps(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5"><span>Smaller</span><span>Smoother</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Width</span>
                      <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{outputWidth}px</span>
                    </div>
                    <input type="range" min={160} max={800} step={20} value={outputWidth}
                      onChange={e => setOutputWidth(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5"><span>160px</span><span>800px</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Gauge className="w-3.5 h-3.5 inline mr-1" />Speed
                      </span>
                      <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{speed}x</span>
                    </div>
                    <div className="flex gap-1">
                      {speedOptions.map(s => (
                        <button key={s} onClick={() => setSpeed(s)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            speed === s
                              ? 'bg-primary-800 text-white'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reverse toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setReverse(!reverse)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    reverse
                      ? 'bg-primary-800 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'
                  }`}
                >
                  <Repeat className="w-4 h-4" /> Reverse GIF
                </button>
              </div>

              {/* Info summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="text-center p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Dimensions</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{outputWidth}x{outputHeight}</p>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Frames</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">~{estFrames}</p>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">GIF Duration</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{effectiveDuration.toFixed(1)}s</p>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Est. Size</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">~{formatFileSize(estSize)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {state === 'loaded' && (
            <div className="flex gap-3">
              <button onClick={convertToGif}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-800 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors text-base">
                <Image className="w-5 h-5" />
                Convert to GIF
              </button>
              <button onClick={previewClip}
                className="flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                title="Preview the selected clip">
                <Play className="w-4 h-4" /> Preview
              </button>
              <button onClick={reset}
                className="flex items-center px-4 py-3.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Converting progress */}
          {state === 'converting' && (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-primary-700 animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-400">{progress}%</span>
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Converting to GIF...</p>
              <div className="w-full max-w-md h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-600 to-primary-800 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-slate-400">Frame {Math.round(estFrames * progress / 100)} of {estFrames} {reverse && '(reversed)'}</p>
            </div>
          )}

          {/* Result */}
          {state === 'done' && gifUrl && (
            <div className="space-y-4">
              <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-lg text-slate-900 dark:text-slate-100">Your GIF is Ready</h3>
                  <span className="text-sm font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {formatFileSize(gifSize)}
                  </span>
                </div>
                <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                  <img src={gifUrl} alt="Generated GIF" className="w-full max-h-[400px] object-contain" />
                </div>
                {/* Comparison cards */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-400 mb-0.5">Original Video</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatFileSize(videoFile?.size || 0)}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                    <p className="text-xs text-green-600 dark:text-green-400 mb-0.5">GIF Output</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-400">{formatFileSize(gifSize)}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 text-center mt-2">
                  {outputWidth}x{outputHeight} • {estFrames} frames • {fps}fps{speed !== 1 ? ` • ${speed}x speed` : ''}{reverse ? ' • Reversed' : ''}
                </p>
              </div>

              <div className="flex gap-3">
                <DownloadButton onClick={downloadGif} label="Download GIF" className="flex-1 justify-center py-3" />
                <button onClick={() => { setState('loaded'); setGifUrl(''); }}
                  className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                  <ArrowDownUp className="w-4 h-4" /> Adjust & Reconvert
                </button>
                <button onClick={reset}
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
                  <RotateCcw className="w-4 h-4" /> New
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
