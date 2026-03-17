'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize } from '@/lib/utils';
import {
  Film, RotateCcw, Loader2, ArrowRight, Play, Pause, Settings,
  ArrowRightLeft, Volume2, VolumeX, CheckCircle2, Scissors, Info,
  X, Clock, Zap, Plus, Trash2, Download
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────────── */

type QualityPreset = 'low' | 'medium' | 'high' | 'original' | 'custom';
type Resolution = 'original' | '1080' | '720' | '480' | '360';
type OutputFormat = 'webm' | 'mp4';
type ConvertSpeed = 1 | 2 | 4 | 8 | 16;

interface VideoInfo {
  file: File;
  url: string;
  width: number;
  height: number;
  duration: number;
}

interface BatchItem {
  id: string;
  file: File;
  url: string;
  state: 'queued' | 'converting' | 'done' | 'error';
  progress: number;
  convertedUrl: string;
  convertedSize: number;
  actualMimeType: string;
  error: string;
  width: number;
  height: number;
  duration: number;
}

/* ── Helpers ───────────────────────────────────────────────────────── */

function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatTimeInput(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(1);
  return `${m}:${parseFloat(s) < 10 ? '0' : ''}${s}`;
}

function parseTimeInput(value: string): number {
  const parts = value.split(':');
  if (parts.length === 2) {
    return (parseInt(parts[0]) || 0) * 60 + (parseFloat(parts[1]) || 0);
  }
  return parseFloat(value) || 0;
}

function getTargetResolution(original: { width: number; height: number }, res: Resolution): { width: number; height: number } {
  if (res === 'original') return { width: Math.round(original.width / 2) * 2, height: Math.round(original.height / 2) * 2 };
  const targetHeight = parseInt(res);
  const aspect = original.width / original.height;
  const width = Math.round(targetHeight * aspect / 2) * 2;
  const height = Math.round(targetHeight / 2) * 2;
  return { width, height };
}

function getBitrate(preset: QualityPreset, customBitrate: number, originalSize: number, duration: number): number {
  switch (preset) {
    case 'low': return 500_000;
    case 'medium': return 1_500_000;
    case 'high': return 3_000_000;
    case 'original': return duration > 0 ? Math.round((originalSize * 8) / duration) : 3_000_000;
    case 'custom': return customBitrate;
  }
}

function getOutputMimeType(format: OutputFormat): string {
  if (format === 'mp4') {
    if (typeof MediaRecorder !== 'undefined') {
      if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) return 'video/mp4;codecs=avc1';
      if (MediaRecorder.isTypeSupported('video/mp4')) return 'video/mp4';
    }
    return MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
  }
  return MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
}

function getFileExtension(mimeType: string): string {
  if (mimeType.startsWith('video/mp4')) return 'mp4';
  return 'webm';
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/* ── Component ─────────────────────────────────────────────────────── */

export function MovToMp4Tool() {
  /* ── Single file mode state ── */
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [preset, setPreset] = useState<QualityPreset>('original');
  const [resolution, setResolution] = useState<Resolution>('original');
  const [customBitrate, setCustomBitrate] = useState(2_000_000);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('mp4');
  const [muteAudio, setMuteAudio] = useState(false);
  const [convertSpeed, setConvertSpeed] = useState<ConvertSpeed>(1);

  /* ── Trim state ── */
  const [trimEnabled, setTrimEnabled] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  /* ── Conversion state ── */
  const [state, setState] = useState<'idle' | 'loaded' | 'converting' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [convertedUrl, setConvertedUrl] = useState('');
  const [convertedSize, setConvertedSize] = useState(0);
  const [actualMimeType, setActualMimeType] = useState('');
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversionStartTime, setConversionStartTime] = useState(0);
  const [showFileInfo, setShowFileInfo] = useState(false);

  /* ── Batch mode state ── */
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [batchConverting, setBatchConverting] = useState(false);

  /* ── Refs ── */
  const videoRef = useRef<HTMLVideoElement>(null);
  const convertedVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cancelRef = useRef(false);
  const batchCancelRef = useRef(false);
  const progressRef = useRef<HTMLDivElement>(null);

  /* ── Helpers ── */
  const inputExt = videoInfo?.file.name.split('.').pop()?.toUpperCase() || 'MOV';
  const clipDuration = trimEnabled ? Math.max(0, trimEnd - trimStart) : (videoInfo?.duration || 0);
  const bitrate = getBitrate(preset, customBitrate, videoInfo?.file.size || 0, videoInfo?.duration || 0);
  const estimatedSize = bitrate * clipDuration / 8;
  const sizeChange = videoInfo && convertedSize ? ((videoInfo.file.size - convertedSize) / videoInfo.file.size * 100) : 0;
  const estimatedConversionTime = clipDuration > 0 ? Math.ceil(clipDuration / convertSpeed) : 0;

  /* ── Single file handlers ── */
  const handleFiles = useCallback((files: File[]) => {
    if (mode === 'batch') {
      const newItems: BatchItem[] = files.map(file => ({
        id: generateId(),
        file,
        url: URL.createObjectURL(file),
        state: 'queued' as const,
        progress: 0,
        convertedUrl: '',
        convertedSize: 0,
        actualMimeType: '',
        error: '',
        width: 0,
        height: 0,
        duration: 0,
      }));
      setBatchItems(prev => [...prev, ...newItems]);
      return;
    }

    const file = files[0];
    if (!file) return;
    setError('');
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    if (videoInfo?.url) URL.revokeObjectURL(videoInfo.url);

    const url = URL.createObjectURL(file);
    setVideoInfo({ file, url, width: 0, height: 0, duration: 0 });
    setState('loaded');
    setConvertedUrl('');
    setConvertedSize(0);
    setActualMimeType('');
    setTrimEnabled(false);
    setTrimStart(0);
    setTrimEnd(0);
    setShowFileInfo(false);
  }, [convertedUrl, videoInfo?.url, mode]);

  const handleVideoLoaded = useCallback(() => {
    const video = videoRef.current;
    if (!video || !videoInfo) return;
    video.volume = 0; // Mute preview without setting .muted (which blocks MediaElementSource)
    setVideoInfo(prev => prev ? {
      ...prev,
      width: video.videoWidth,
      height: video.videoHeight,
      duration: video.duration,
    } : null);
    setTrimEnd(video.duration);
  }, [videoInfo]);

  const convertVideo = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !videoInfo) return;

    setState('converting');
    setProgress(0);
    setError('');
    cancelRef.current = false;
    setConversionStartTime(Date.now());
    setTimeout(() => progressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);

    try {
      const { width, height } = getTargetResolution(
        { width: videoInfo.width, height: videoInfo.height },
        resolution
      );
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      const mimeType = getOutputMimeType(outputFormat);
      setActualMimeType(mimeType);

      const stream = canvas.captureStream(30);

      // Add audio track if not muted
      if (!muteAudio) {
        try {
          const audioCtx = new AudioContext();
          const source = audioCtx.createMediaElementSource(video);
          const destination = audioCtx.createMediaStreamDestination();
          source.connect(destination);
          source.connect(audioCtx.destination);
          destination.stream.getAudioTracks().forEach(track => stream.addTrack(track));
        } catch {
          // Video might not have audio
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: bitrate,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      const done = new Promise<Blob>(resolve => {
        mediaRecorder.onstop = () => {
          const blobType = mimeType.split(';')[0];
          resolve(new Blob(chunks, { type: blobType }));
        };
      });

      // Set start position for trim
      const startPos = trimEnabled ? trimStart : 0;
      const endPos = trimEnabled ? trimEnd : videoInfo.duration;
      video.currentTime = startPos;

      // Wait for seek to complete
      await new Promise<void>(resolve => {
        const onSeeked = () => { video.removeEventListener('seeked', onSeeked); resolve(); };
        video.addEventListener('seeked', onSeeked);
      });

      // Use volume=0 instead of muted so MediaElementSource still captures audio
      video.muted = false;
      video.volume = 0;
      video.playbackRate = convertSpeed;
      await video.play();
      mediaRecorder.start(100);

      // Progress tracking
      const progressInterval = setInterval(() => {
        if (cancelRef.current) return;
        const totalClip = endPos - startPos;
        const currentPos = video.currentTime - startPos;
        if (totalClip > 0) {
          setProgress(Math.min(95, Math.round((currentPos / totalClip) * 100)));
        }
      }, 150);

      // Draw loop
      const drawFrame = () => {
        if (cancelRef.current) return;
        if (!video.paused && !video.ended && video.currentTime < endPos) {
          ctx.drawImage(video, 0, 0, width, height);
          requestAnimationFrame(drawFrame);
        }
      };
      drawFrame();

      // Wait for video to reach end position or finish
      await new Promise<void>(resolve => {
        const checkEnd = () => {
          if (cancelRef.current) { resolve(); return; }
          if (video.currentTime >= endPos - 0.1 || video.ended) {
            resolve();
          } else {
            requestAnimationFrame(checkEnd);
          }
        };
        video.onended = () => resolve();
        checkEnd();
      });

      clearInterval(progressInterval);

      if (cancelRef.current) {
        mediaRecorder.stop();
        video.pause();
        video.playbackRate = 1;
        setState('loaded');
        return;
      }

      mediaRecorder.stop();
      video.pause();
      video.playbackRate = 1;

      const blob = await done;
      setProgress(100);

      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
      setConvertedUrl(URL.createObjectURL(blob));
      setConvertedSize(blob.size);
      setState('done');
      setTimeout(() => progressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } catch (e) {
      setError(`Conversion failed: ${(e as Error).message}. Try a different browser or check if the video is playable.`);
      setState('loaded');
      if (videoRef.current) videoRef.current.playbackRate = 1;
    }
  }, [videoInfo, resolution, preset, customBitrate, convertedUrl, muteAudio, outputFormat, trimEnabled, trimStart, trimEnd, convertSpeed, bitrate]);

  const cancelConversion = useCallback(() => {
    cancelRef.current = true;
  }, []);

  const reconvert = useCallback(() => {
    setState('loaded');
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setConvertedUrl('');
    setConvertedSize(0);
    setProgress(0);
  }, [convertedUrl]);

  const reset = () => {
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    if (videoInfo?.url) URL.revokeObjectURL(videoInfo.url);
    setVideoInfo(null);
    setConvertedUrl('');
    setConvertedSize(0);
    setActualMimeType('');
    setProgress(0);
    setError('');
    setState('idle');
    setIsPlaying(false);
    setTrimEnabled(false);
    setTrimStart(0);
    setTrimEnd(0);
    setShowFileInfo(false);
  };

  const downloadConverted = () => {
    if (!convertedUrl) return;
    const ext = getFileExtension(actualMimeType);
    const a = document.createElement('a');
    a.href = convertedUrl;
    a.download = (videoInfo?.file.name.replace(/\.[^.]+$/, '') || 'video') + `-converted.${ext}`;
    a.click();
  };

  /* ── Batch handlers ── */
  const removeBatchItem = (id: string) => {
    setBatchItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item?.url) URL.revokeObjectURL(item.url);
      if (item?.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
      return prev.filter(i => i.id !== id);
    });
  };

  const convertBatch = useCallback(async () => {
    setBatchConverting(true);
    batchCancelRef.current = false;

    for (let idx = 0; idx < batchItems.length; idx++) {
      if (batchCancelRef.current) break;
      const item = batchItems[idx];
      if (item.state !== 'queued') continue;

      setBatchItems(prev => prev.map((it, i) => i === idx ? { ...it, state: 'converting' as const, progress: 0 } : it));

      try {
        const blob = await convertSingleFile(item, idx);
        if (batchCancelRef.current) break;
        const url = URL.createObjectURL(blob);
        const mimeType = getOutputMimeType(outputFormat);
        setBatchItems(prev => prev.map((it, i) => i === idx ? {
          ...it,
          state: 'done' as const,
          progress: 100,
          convertedUrl: url,
          convertedSize: blob.size,
          actualMimeType: mimeType.split(';')[0],
        } : it));
      } catch (e) {
        setBatchItems(prev => prev.map((it, i) => i === idx ? {
          ...it,
          state: 'error' as const,
          error: (e as Error).message,
        } : it));
      }
    }

    setBatchConverting(false);
  }, [batchItems, outputFormat, preset, customBitrate, resolution, muteAudio, convertSpeed]); // eslint-disable-line react-hooks/exhaustive-deps

  const convertSingleFile = useCallback(async (item: BatchItem, idx: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      video.src = item.url;
      video.playsInline = true;
      video.volume = 0;

      video.onloadedmetadata = async () => {
        try {
          const { width, height } = getTargetResolution(
            { width: video.videoWidth, height: video.videoHeight },
            resolution
          );
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          const br = getBitrate(preset, customBitrate, item.file.size, video.duration);
          const mimeType = getOutputMimeType(outputFormat);
          const stream = canvas.captureStream(30);

          if (!muteAudio) {
            try {
              const audioCtx = new AudioContext();
              const source = audioCtx.createMediaElementSource(video);
              const dest = audioCtx.createMediaStreamDestination();
              source.connect(dest);
              source.connect(audioCtx.destination);
              dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
            } catch { /* no audio */ }
          }

          const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: br });
          const chunks: Blob[] = [];
          recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

          const done = new Promise<Blob>(res => {
            recorder.onstop = () => res(new Blob(chunks, { type: mimeType.split(';')[0] }));
          });

          video.currentTime = 0;
          video.playbackRate = convertSpeed;
          await video.play();
          recorder.start(100);

          const progressInt = setInterval(() => {
            if (video.duration > 0) {
              const p = Math.min(95, Math.round((video.currentTime / video.duration) * 100));
              setBatchItems(prev => prev.map((it, i) => i === idx ? { ...it, progress: p } : it));
            }
          }, 200);

          const drawFrame = () => {
            if (!video.paused && !video.ended) {
              ctx.drawImage(video, 0, 0, width, height);
              requestAnimationFrame(drawFrame);
            }
          };
          drawFrame();

          await new Promise<void>(res => { video.onended = () => res(); });
          clearInterval(progressInt);
          recorder.stop();
          video.pause();
          video.playbackRate = 1;

          const blob = await done;
          URL.revokeObjectURL(item.url);
          resolve(blob);
        } catch (e) {
          reject(e);
        }
      };

      video.onerror = () => reject(new Error('Could not load video'));
    });
  }, [resolution, preset, customBitrate, outputFormat, muteAudio, convertSpeed]);

  const downloadBatchItem = (item: BatchItem) => {
    if (!item.convertedUrl) return;
    const ext = getFileExtension(item.actualMimeType);
    const a = document.createElement('a');
    a.href = item.convertedUrl;
    a.download = item.file.name.replace(/\.[^.]+$/, '') + `-converted.${ext}`;
    a.click();
  };

  const downloadAllBatch = () => {
    batchItems.filter(i => i.state === 'done').forEach(item => {
      setTimeout(() => downloadBatchItem(item), 100);
    });
  };

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
      if (videoInfo?.url) URL.revokeObjectURL(videoInfo.url);
      batchItems.forEach(item => {
        if (item.url) URL.revokeObjectURL(item.url);
        if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Data ── */
  const presetButtons: { key: QualityPreset; label: string; desc: string }[] = [
    { key: 'low', label: 'Low', desc: '500 Kbps' },
    { key: 'medium', label: 'Medium', desc: '1.5 Mbps' },
    { key: 'high', label: 'High', desc: '3 Mbps' },
    { key: 'original', label: 'Original', desc: 'Match source' },
    { key: 'custom', label: 'Custom', desc: 'Set bitrate' },
  ];

  const resolutions: { key: Resolution; label: string }[] = [
    { key: 'original', label: 'Original' },
    { key: '1080', label: '1080p' },
    { key: '720', label: '720p' },
    { key: '480', label: '480p' },
    { key: '360', label: '360p' },
  ];

  const formatOptions: { key: OutputFormat; label: string; desc: string }[] = [
    { key: 'mp4', label: 'MP4', desc: 'Best compatibility' },
    { key: 'webm', label: 'WebM', desc: 'Smaller size' },
  ];

  const speedOptions: ConvertSpeed[] = [1, 2, 4, 8, 16];

  const batchDoneCount = batchItems.filter(i => i.state === 'done').length;

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />

      {/* Mode switcher */}
      {state === 'idle' && batchItems.length === 0 && (
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
          <button
            onClick={() => setMode('single')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              mode === 'single' ? 'bg-white dark:bg-slate-700 shadow text-primary-700 dark:text-primary-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Single File
          </button>
          <button
            onClick={() => setMode('batch')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              mode === 'batch' ? 'bg-white dark:bg-slate-700 shadow text-primary-700 dark:text-primary-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Batch Convert
          </button>
        </div>
      )}

      {/* ═══════════════ SINGLE FILE MODE ═══════════════ */}
      {mode === 'single' && (
        <>
          {/* Upload */}
          {state === 'idle' && (
            <FileDropzone
              accept="video/quicktime,video/mp4,video/x-m4v,video/webm,video/x-msvideo,video/x-matroska,.mov,.mp4,.m4v,.webm,.avi,.mkv"
              maxSizeMB={500}
              onFiles={handleFiles}
              description="MOV, MP4, AVI, MKV, WebM — max 500MB"
            />
          )}

          {/* Video loaded */}
          {state !== 'idle' && videoInfo && (
            <div className="space-y-5">
              {/* Video Preview */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black">
                <video
                  ref={videoRef}
                  src={videoInfo.url}
                  onLoadedMetadata={handleVideoLoaded}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full max-h-[350px] object-contain"
                  playsInline
                />
                <button
                  onClick={() => {
                    const v = videoRef.current;
                    if (!v) return;
                    if (v.paused) { v.play(); setIsPlaying(true); }
                    else { v.pause(); setIsPlaying(false); }
                  }}
                  className="absolute bottom-3 left-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                {/* Info badges */}
                <div className="absolute top-3 right-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">{inputExt}</span>
                  <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">{formatFileSize(videoInfo.file.size)}</span>
                  {videoInfo.width > 0 && (
                    <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">{videoInfo.width}×{videoInfo.height}</span>
                  )}
                  {videoInfo.duration > 0 && (
                    <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">{formatDuration(videoInfo.duration)}</span>
                  )}
                </div>
                {/* Conversion badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-600/90 text-white text-xs font-bold">
                    <ArrowRightLeft className="w-3 h-3" /> {inputExt} → {outputFormat.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* File info panel */}
              {(state === 'loaded' || state === 'done') && videoInfo.width > 0 && (
                <button
                  onClick={() => setShowFileInfo(!showFileInfo)}
                  className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  {showFileInfo ? 'Hide' : 'Show'} file details
                </button>
              )}
              {showFileInfo && videoInfo.width > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Format', value: inputExt },
                    { label: 'Resolution', value: `${videoInfo.width}×${videoInfo.height}` },
                    { label: 'Duration', value: formatDuration(videoInfo.duration) },
                    { label: 'File Size', value: formatFileSize(videoInfo.file.size) },
                    { label: 'Est. Bitrate', value: videoInfo.duration > 0 ? `${((videoInfo.file.size * 8) / videoInfo.duration / 1_000_000).toFixed(1)} Mbps` : '-' },
                    { label: 'Aspect Ratio', value: videoInfo.width > 0 ? `${(videoInfo.width / videoInfo.height).toFixed(2)}:1` : '-' },
                    { label: 'Pixels', value: `${(videoInfo.width * videoInfo.height / 1_000_000).toFixed(1)}MP` },
                    { label: 'File Name', value: videoInfo.file.name },
                  ].map(item => (
                    <div key={item.label} className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">{item.label}</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Settings */}
              {(state === 'loaded' || state === 'done') && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100">Conversion Settings</h3>
                  </div>

                  {/* Output format */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Output Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      {formatOptions.map(f => (
                        <button
                          key={f.key}
                          onClick={() => setOutputFormat(f.key)}
                          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            outputFormat === f.key
                              ? 'bg-primary-800 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'
                          }`}
                        >
                          <div>{f.label}</div>
                          <div className={`text-xs mt-0.5 ${outputFormat === f.key ? 'text-primary-200' : 'text-slate-400'}`}>{f.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality presets */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quality</label>
                    <div className="grid grid-cols-5 gap-2">
                      {presetButtons.map(p => (
                        <button
                          key={p.key}
                          onClick={() => setPreset(p.key)}
                          className={`px-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            preset === p.key
                              ? 'bg-primary-800 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'
                          }`}
                        >
                          <div className="text-xs sm:text-sm">{p.label}</div>
                          <div className={`text-[10px] sm:text-xs mt-0.5 ${preset === p.key ? 'text-primary-200' : 'text-slate-400'}`}>{p.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom bitrate slider */}
                  {preset === 'custom' && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bitrate</label>
                        <span className="text-sm font-bold text-primary-700 dark:text-primary-400">
                          {(customBitrate / 1_000_000).toFixed(1)} Mbps
                        </span>
                      </div>
                      <input
                        type="range" min={100_000} max={8_000_000} step={100_000}
                        value={customBitrate} onChange={e => setCustomBitrate(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1"><span>100 Kbps</span><span>8 Mbps</span></div>
                    </div>
                  )}

                  {/* Resolution */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Resolution</label>
                    <div className="flex flex-wrap gap-2">
                      {resolutions.map(r => (
                        <button
                          key={r.key}
                          onClick={() => setResolution(r.key)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            resolution === r.key
                              ? 'bg-primary-800 text-white'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Conversion speed */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Conversion Speed</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {speedOptions.map(s => (
                        <button
                          key={s}
                          onClick={() => setConvertSpeed(s)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            convertSpeed === s
                              ? 'bg-primary-800 text-white'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                      Higher speed = faster conversion. Lower speed = better quality on some devices.
                    </p>
                  </div>

                  {/* Trim controls */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                      <input type="checkbox" checked={trimEnabled} onChange={e => setTrimEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500" />
                      <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-slate-500" />
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Trim Video</span>
                          <p className="text-xs text-slate-400 dark:text-slate-500">Cut a specific portion before converting</p>
                        </div>
                      </div>
                    </label>

                    {trimEnabled && videoInfo.duration > 0 && (
                      <div className="mt-3 space-y-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        {/* Timeline visualization */}
                        <div className="relative h-8 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                          <div
                            className="absolute top-0 bottom-0 bg-primary-500/30 dark:bg-primary-400/20 border-x-2 border-primary-500 dark:border-primary-400"
                            style={{
                              left: `${(trimStart / videoInfo.duration) * 100}%`,
                              width: `${((trimEnd - trimStart) / videoInfo.duration) * 100}%`,
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded">
                              {formatDuration(trimEnd - trimStart)}
                            </span>
                          </div>
                        </div>

                        {/* Start/End inputs */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Start Time</label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="range"
                                min={0} max={Math.max(0, trimEnd - 0.1)} step={0.1}
                                value={trimStart}
                                onChange={e => setTrimStart(parseFloat(e.target.value))}
                                className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-primary-800"
                              />
                              <input
                                type="text"
                                value={formatTimeInput(trimStart)}
                                onChange={e => {
                                  const t = parseTimeInput(e.target.value);
                                  if (t >= 0 && t < trimEnd) setTrimStart(t);
                                }}
                                className="w-16 text-center text-xs px-1.5 py-1 rounded border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">End Time</label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="range"
                                min={trimStart + 0.1} max={videoInfo.duration} step={0.1}
                                value={trimEnd}
                                onChange={e => setTrimEnd(parseFloat(e.target.value))}
                                className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-primary-800"
                              />
                              <input
                                type="text"
                                value={formatTimeInput(trimEnd)}
                                onChange={e => {
                                  const t = parseTimeInput(e.target.value);
                                  if (t > trimStart && t <= videoInfo.duration) setTrimEnd(t);
                                }}
                                className="w-16 text-center text-xs px-1.5 py-1 rounded border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between text-xs text-slate-400">
                          <span>0:00</span>
                          <span>Clip: {formatDuration(clipDuration)}</span>
                          <span>{formatDuration(videoInfo.duration)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Audio toggle */}
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                    <input type="checkbox" checked={muteAudio} onChange={e => setMuteAudio(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500" />
                    <div className="flex items-center gap-2">
                      {muteAudio ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-slate-500" />}
                      <div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Remove Audio</span>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Strip audio track for smaller file size</p>
                      </div>
                    </div>
                  </label>

                  {/* Estimated output */}
                  {videoInfo.duration > 0 && preset !== 'original' && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-2 px-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Original: <strong>{formatFileSize(videoInfo.file.size)}</strong></span>
                      <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                      <span className="text-primary-700 dark:text-primary-400">Est. output: <strong>~{formatFileSize(estimatedSize)}</strong></span>
                      <span className="text-slate-400 dark:text-slate-500">|</span>
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> ~{estimatedConversionTime}s
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Convert button */}
              {state === 'loaded' && (
                <div className="flex gap-3">
                  <button
                    onClick={convertVideo}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-800 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                    Convert{trimEnabled ? ' & Trim' : ''} to {outputFormat.toUpperCase()}
                  </button>
                  <button onClick={reset}
                    className="flex items-center gap-1.5 px-4 py-3 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Converting */}
              {state === 'converting' && (
                <div ref={progressRef} className="flex flex-col items-center gap-3 py-8">
                  <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Converting {inputExt} to {outputFormat.toUpperCase()} at {convertSpeed}x speed... {progress}%
                  </p>
                  <div className="w-full max-w-md h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-700 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  {conversionStartTime > 0 && progress > 5 && (
                    <p className="text-xs text-slate-400">
                      Elapsed: {Math.round((Date.now() - conversionStartTime) / 1000)}s
                      {progress > 10 && ` — Est. remaining: ~${Math.max(1, Math.round(((Date.now() - conversionStartTime) / progress) * (100 - progress) / 1000))}s`}
                    </p>
                  )}
                  <button
                    onClick={cancelConversion}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}

              {/* Result */}
              {state === 'done' && convertedUrl && (
                <div ref={progressRef} className="space-y-4">
                  {/* Success banner */}
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Converted successfully to <strong>{getFileExtension(actualMimeType).toUpperCase()}</strong>
                      {trimEnabled && ` (trimmed to ${formatDuration(clipDuration)})`}
                    </p>
                  </div>

                  {/* Comparison card */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Original ({inputExt})</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatFileSize(videoInfo.file.size)}</p>
                      <p className="text-xs text-slate-400 mt-1">{videoInfo.width}×{videoInfo.height} · {formatDuration(videoInfo.duration)}</p>
                    </div>
                    <div className={`p-4 bg-white dark:bg-slate-800 rounded-xl border text-center ${
                      sizeChange > 0 ? 'border-green-200 dark:border-green-800' : 'border-slate-200 dark:border-slate-700'
                    }`}>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Converted ({getFileExtension(actualMimeType).toUpperCase()})</p>
                      <p className={`text-2xl font-bold ${
                        sizeChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-slate-100'
                      }`}>{formatFileSize(convertedSize)}</p>
                      <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                        sizeChange > 0
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : sizeChange < 0
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {sizeChange > 0 ? `-${sizeChange.toFixed(0)}% smaller` : sizeChange < 0 ? `+${Math.abs(sizeChange).toFixed(0)}% larger` : 'Same size'}
                      </span>
                    </div>
                  </div>

                  {/* Converted video preview */}
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black">
                    <video
                      ref={convertedVideoRef}
                      src={convertedUrl}
                      controls
                      className="w-full max-h-[300px] object-contain"
                      playsInline
                    />
                  </div>

                  <div className="flex gap-3">
                    <DownloadButton onClick={downloadConverted} label={`Download ${getFileExtension(actualMimeType).toUpperCase()}`} className="flex-1 justify-center py-3" />
                    <button onClick={reconvert}
                      className="inline-flex items-center gap-1.5 px-4 py-3 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-900/20 rounded-xl transition-colors font-medium">
                      <Settings className="w-4 h-4" /> Re-convert
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
        </>
      )}

      {/* ═══════════════ BATCH MODE ═══════════════ */}
      {mode === 'batch' && (
        <div className="space-y-5">
          {/* Add files area */}
          <FileDropzone
            accept="video/quicktime,video/mp4,video/x-m4v,video/webm,video/x-msvideo,video/x-matroska,.mov,.mp4,.m4v,.webm,.avi,.mkv"
            maxSizeMB={500}
            onFiles={handleFiles}
            description="Drop multiple MOV, MP4, AVI, MKV, WebM files — max 500MB each"
            multiple
          />

          {/* Batch queue */}
          {batchItems.length > 0 && (
            <>
              {/* Batch settings */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100">Batch Settings (applied to all files)</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Format */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Output Format</label>
                    <div className="flex gap-2">
                      {formatOptions.map(f => (
                        <button key={f.key} onClick={() => setOutputFormat(f.key)}
                          className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            outputFormat === f.key
                              ? 'bg-primary-800 text-white'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>{f.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Quality */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Quality</label>
                    <div className="flex gap-1">
                      {presetButtons.slice(0, 4).map(p => (
                        <button key={p.key} onClick={() => setPreset(p.key)}
                          className={`flex-1 px-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            preset === p.key
                              ? 'bg-primary-800 text-white'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>{p.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Resolution */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Resolution</label>
                    <div className="flex gap-1">
                      {resolutions.map(r => (
                        <button key={r.key} onClick={() => setResolution(r.key)}
                          className={`flex-1 px-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            resolution === r.key
                              ? 'bg-primary-800 text-white'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>{r.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Speed */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Speed</label>
                    <div className="flex gap-1">
                      {speedOptions.map(s => (
                        <button key={s} onClick={() => setConvertSpeed(s)}
                          className={`flex-1 px-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            convertSpeed === s
                              ? 'bg-primary-800 text-white'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>{s}x</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* File list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{batchItems.length} file{batchItems.length !== 1 ? 's' : ''} queued</p>
                  {batchDoneCount > 0 && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">{batchDoneCount}/{batchItems.length} done</span>
                  )}
                </div>
                {batchItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Film className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{item.file.name}</p>
                      <p className="text-xs text-slate-400">{formatFileSize(item.file.size)}</p>
                      {item.state === 'converting' && (
                        <div className="mt-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-600 rounded-full transition-all duration-300" style={{ width: `${item.progress}%` }} />
                        </div>
                      )}
                      {item.state === 'error' && (
                        <p className="text-xs text-red-500 mt-0.5">{item.error}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.state === 'queued' && (
                        <span className="text-xs text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full">Queued</span>
                      )}
                      {item.state === 'converting' && (
                        <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">{item.progress}%</span>
                      )}
                      {item.state === 'done' && (
                        <>
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">{formatFileSize(item.convertedSize)}</span>
                          <button onClick={() => downloadBatchItem(item)}
                            className="p-1.5 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {item.state === 'error' && (
                        <span className="text-xs text-red-500 px-2 py-0.5 bg-red-50 dark:bg-red-900/20 rounded-full">Failed</span>
                      )}
                      {item.state !== 'converting' && (
                        <button onClick={() => removeBatchItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Batch actions */}
              <div className="flex gap-3">
                {!batchConverting && batchItems.some(i => i.state === 'queued') && (
                  <button onClick={convertBatch}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-800 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">
                    <ArrowRightLeft className="w-5 h-5" />
                    Convert All ({batchItems.filter(i => i.state === 'queued').length} files)
                  </button>
                )}
                {batchConverting && (
                  <button onClick={() => { batchCancelRef.current = true; }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-colors">
                    <X className="w-5 h-5" /> Cancel Batch
                  </button>
                )}
                {batchDoneCount > 1 && (
                  <button onClick={downloadAllBatch}
                    className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-xl transition-colors">
                    <Download className="w-4 h-4" /> Download All
                  </button>
                )}
                {!batchConverting && (
                  <button onClick={() => { batchItems.forEach(i => { if (i.url) URL.revokeObjectURL(i.url); if (i.convertedUrl) URL.revokeObjectURL(i.convertedUrl); }); setBatchItems([]); }}
                    className="flex items-center gap-1.5 px-4 py-3 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
                    <RotateCcw className="w-4 h-4" /> Clear All
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>
      )}
    </div>
  );
}
