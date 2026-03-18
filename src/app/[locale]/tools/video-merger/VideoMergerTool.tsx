'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize } from '@/lib/utils';
import {
  Film, RotateCcw, Loader2, Plus, X,
  ArrowUp, ArrowDown, Settings, CheckCircle,
  Clock, GripVertical, Upload,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────────────────── */

interface Clip {
  id: string;
  file: File;
  url: string;
  thumbnailUrl: string;
  name: string;
  width: number;
  height: number;
  duration: number;
}

type AppState = 'idle' | 'loaded' | 'merging' | 'done';
type Quality = 'high' | 'medium' | 'low';
type OutputRes = 'original' | '1080' | '720' | '480';
type Transition = 'none' | 'fade';

/* ── Helpers ────────────────────────────────────────────────────────── */

function formatDuration(s: number): string {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function getBitrate(q: Quality): number {
  return q === 'high' ? 4_000_000 : q === 'medium' ? 2_000_000 : 800_000;
}

function getOutputDimensions(clips: Clip[], res: OutputRes): { width: number; height: number } {
  const validClips = clips.filter(c => c.width > 0 && c.height > 0);
  if (validClips.length === 0) return { width: 1280, height: 720 };

  if (res === 'original') {
    const maxW = Math.max(...validClips.map(c => c.width));
    const maxH = Math.max(...validClips.map(c => c.height));
    return { width: Math.round(maxW / 2) * 2, height: Math.round(maxH / 2) * 2 };
  }

  const targetH = parseInt(res);
  const aspect = validClips[0].width / validClips[0].height;
  const w = Math.round((targetH * aspect) / 2) * 2;
  return { width: w, height: targetH };
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

/* ── Load clip metadata + thumbnail ────────────────────────────────── */

function loadClipMeta(file: File): Promise<Omit<Clip, 'id' | 'file'>> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration * 0.1);
    };

    video.onseeked = () => {
      let thumbnailUrl = '';
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = Math.round(120 / (video.videoWidth / video.videoHeight)) || 68;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          thumbnailUrl = canvas.toDataURL('image/jpeg', 0.75);
        }
      } catch {
        // Thumbnail generation failed — not critical
      }

      resolve({
        url,
        thumbnailUrl,
        name: file.name,
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      });
      video.src = '';
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Cannot load "${file.name}". File may be corrupt or unsupported.`));
    };

    video.src = url;
  });
}

/* ── Component ──────────────────────────────────────────────────────── */

export function VideoMergerTool() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [appState, setAppState] = useState<AppState>('idle');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState('');
  const [loadingFiles, setLoadingFiles] = useState(false);

  const [quality, setQuality] = useState<Quality>('medium');
  const [outputRes, setOutputRes] = useState<OutputRes>('720');
  const [transition, setTransition] = useState<Transition>('none');
  const [muteAudio, setMuteAudio] = useState(false);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const abortRef = useRef(false);

  /* ── Add clips ──────────────────────────────────────────────────── */

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setError('');
    const fileArray = Array.from(files).filter(f => f.type.startsWith('video/') || /\.(mp4|webm|mov|avi|mkv)$/i.test(f.name));

    if (fileArray.length === 0) {
      setError('Please select valid video files (MP4, WebM, MOV, AVI).');
      return;
    }

    setClips(prev => {
      const remaining = 10 - prev.length;
      if (remaining <= 0) {
        setError('Maximum 10 clips allowed. Remove some clips first.');
        return prev;
      }
      return prev;
    });

    setLoadingFiles(true);
    try {
      const toAdd = fileArray.slice(0, 10 - clips.length);
      const newClips: Clip[] = await Promise.all(
        toAdd.map(async (file) => {
          const meta = await loadClipMeta(file);
          return { id: uid(), file, ...meta };
        })
      );

      setClips(prev => {
        const combined = [...prev, ...newClips].slice(0, 10);
        if (combined.length > 0 && appState === 'idle') setAppState('loaded');
        return combined;
      });

      if (appState === 'done') setAppState('loaded');
    } catch (e) {
      setError(`Failed to load video: ${(e as Error).message}`);
    } finally {
      setLoadingFiles(false);
    }
  }, [clips.length, appState]);

  /* ── Remove a clip ──────────────────────────────────────────────── */

  const removeClip = useCallback((id: string) => {
    setClips(prev => {
      const clip = prev.find(c => c.id === id);
      if (clip) URL.revokeObjectURL(clip.url);
      const updated = prev.filter(c => c.id !== id);
      if (updated.length === 0) setAppState('idle');
      return updated;
    });
  }, []);

  /* ── Reorder: arrow buttons ─────────────────────────────────────── */

  const moveClip = useCallback((index: number, dir: 'up' | 'down') => {
    setClips(prev => {
      const arr = [...prev];
      const target = dir === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return prev;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  }, []);

  /* ── Reorder: drag-and-drop ─────────────────────────────────────── */

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) setDragOverIndex(index);
  };
  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    setClips(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIndex, 1);
      arr.splice(targetIndex, 0, moved);
      return arr;
    });
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  /* ── Main merge function ────────────────────────────────────────── */

  const mergeVideos = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || clips.length < 2) return;

    abortRef.current = false;
    setAppState('merging');
    setProgress(0);
    setProgressLabel('Preparing...');
    setError('');

    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl('');
    setResultSize(0);

    try {
      const { width, height } = getOutputDimensions(clips, outputRes);
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const bitrate = getBitrate(quality);
      const stream = canvas.captureStream(30);

      let audioCtx: AudioContext | null = null;
      let audioDest: MediaStreamAudioDestinationNode | null = null;
      if (!muteAudio) {
        try {
          audioCtx = new AudioContext();
          audioDest = audioCtx.createMediaStreamDestination();
          audioDest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
        } catch {
          // Audio context not available
        }
      }

      const mimeType = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4',
      ].find(m => MediaRecorder.isTypeSupported(m));

      if (!mimeType) {
        throw new Error('Your browser does not support video recording. Please use Chrome, Firefox, or Edge.');
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: bitrate,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const recordingDone = new Promise<Blob>(resolve => {
        mediaRecorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
      });

      mediaRecorder.start(100);

      const FADE_DURATION_MS = 500;
      const FADE_FPS = 30;
      const FADE_FRAMES = Math.round((FADE_DURATION_MS / 1000) * FADE_FPS);

      for (let i = 0; i < clips.length; i++) {
        if (abortRef.current) break;

        const clip = clips[i];
        const clipNum = i + 1;
        setProgressLabel(`Processing clip ${clipNum} of ${clips.length}...`);

        const videoEl = document.createElement('video');
        videoEl.src = clip.url;
        videoEl.muted = true;
        videoEl.playsInline = true;
        videoEl.crossOrigin = 'anonymous';

        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error(`Timeout loading clip: ${clip.name}`)), 15000);
          videoEl.oncanplay = () => { clearTimeout(timeout); resolve(); };
          videoEl.onerror = () => { clearTimeout(timeout); reject(new Error(`Cannot play clip: ${clip.name}`)); };
          videoEl.load();
        });

        let audioSource: MediaElementAudioSourceNode | null = null;
        if (audioCtx && audioDest && !muteAudio) {
          try {
            audioSource = audioCtx.createMediaElementSource(videoEl);
            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 1;
            audioSource.connect(gainNode);
            gainNode.connect(audioDest);
          } catch {
            // Some browsers disallow MediaElementSource
          }
        }

        videoEl.currentTime = 0;
        await videoEl.play();

        const doFadeIn = transition === 'fade' && i > 0;

        if (doFadeIn) {
          for (let f = 0; f < FADE_FRAMES; f++) {
            if (videoEl.paused || videoEl.ended) break;
            const alpha = f / FADE_FRAMES;
            ctx.globalAlpha = alpha;
            ctx.drawImage(videoEl, 0, 0, width, height);
            await new Promise(r => setTimeout(r, 1000 / FADE_FPS));
          }
          ctx.globalAlpha = 1;
        }

        await new Promise<void>(resolve => {
          let animId: number;

          const drawFrame = () => {
            if (abortRef.current || videoEl.ended) {
              cancelAnimationFrame(animId);
              resolve();
              return;
            }
            if (!videoEl.paused) {
              ctx.globalAlpha = 1;
              ctx.drawImage(videoEl, 0, 0, width, height);
            }
            animId = requestAnimationFrame(drawFrame);
          };

          videoEl.onended = () => {
            cancelAnimationFrame(animId);
            resolve();
          };

          animId = requestAnimationFrame(drawFrame);
        });

        const doFadeOut = transition === 'fade' && i < clips.length - 1;

        if (doFadeOut) {
          const lastFrameCanvas = document.createElement('canvas');
          lastFrameCanvas.width = width;
          lastFrameCanvas.height = height;
          const lastFrameCtx = lastFrameCanvas.getContext('2d')!;
          lastFrameCtx.drawImage(videoEl, 0, 0, width, height);

          for (let f = FADE_FRAMES; f >= 0; f--) {
            const alpha = f / FADE_FRAMES;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = alpha;
            ctx.drawImage(lastFrameCanvas, 0, 0, width, height);
            await new Promise(r => setTimeout(r, 1000 / FADE_FPS));
          }
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, width, height);
        }

        videoEl.pause();
        videoEl.src = '';
        if (audioSource) {
          try { audioSource.disconnect(); } catch { /* ignore */ }
        }

        setProgress(Math.round((clipNum / clips.length) * 90));
      }

      if (abortRef.current) {
        mediaRecorder.stop();
        setAppState('loaded');
        return;
      }

      setProgressLabel('Finalizing merged video...');
      mediaRecorder.stop();

      const blob = await recordingDone;

      if (blob.size === 0) {
        throw new Error('Output video is empty. Try a different browser or shorter clips.');
      }

      setProgress(100);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultSize(blob.size);
      setAppState('done');
      setProgressLabel('');
    } catch (e) {
      if (!abortRef.current) {
        setError(`Merge failed: ${(e as Error).message}. Try using Chrome or Firefox.`);
        setAppState('loaded');
      }
    }
  }, [clips, quality, outputRes, transition, muteAudio, resultUrl]);

  /* ── Download result ────────────────────────────────────────────── */

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const isWebm = resultUrl.includes('webm') ||
      (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/webm'));
    a.download = `merged-video-toolsarena.${isWebm ? 'webm' : 'mp4'}`;
    a.click();
  };

  /* ── Reset everything ───────────────────────────────────────────── */

  const reset = useCallback(() => {
    abortRef.current = true;
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setClips(prev => {
      prev.forEach(c => { try { URL.revokeObjectURL(c.url); } catch {} });
      return [];
    });
    setResultUrl('');
    setResultSize(0);
    setProgress(0);
    setProgressLabel('');
    setError('');
    setAppState('idle');
    setLoadingFiles(false);
  }, [resultUrl]);

  /* ── Computed values ────────────────────────────────────────────── */

  const totalDuration = clips.reduce((sum, c) => sum + (c.duration || 0), 0);
  const totalSize = clips.reduce((sum, c) => sum + (c.file.size || 0), 0);

  /* ── Cleanup on unmount ─────────────────────────────────────────── */

  useEffect(() => {
    return () => {
      abortRef.current = true;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      clips.forEach(c => { try { URL.revokeObjectURL(c.url); } catch {} });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />

      {/* ── IDLE: Upload zone ── */}
      {appState === 'idle' && (
        <label
          className="flex flex-col items-center justify-center w-full min-h-[200px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 border-slate-300 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-slate-800"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        >
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.webm,.mov,.avi"
            multiple
            className="sr-only"
            onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }}
          />
          <Upload className="w-12 h-12 text-slate-400 mb-3" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            <span className="text-primary-600 dark:text-primary-400">Click to upload</span> or drag & drop
          </p>
          <p className="text-xs text-slate-400 mt-1">MP4, WebM, MOV, AVI — up to 10 clips, max 500MB each</p>
        </label>
      )}

      {/* ── LOADED / DONE: Clip list + controls ── */}
      {(appState === 'loaded' || appState === 'done') && clips.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Film className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100">
                {clips.length} Clip{clips.length !== 1 ? 's' : ''}
              </h3>
              {totalDuration > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatDuration(totalDuration)} total
                </span>
              )}
              {totalSize > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {formatFileSize(totalSize)}
                </span>
              )}
            </div>

            {clips.length < 10 && (
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 cursor-pointer transition-colors border border-primary-200 dark:border-primary-800 flex-shrink-0">
                <Plus className="w-4 h-4" />
                Add Clips
                <input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.webm,.mov,.avi" multiple className="sr-only" onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }} />
              </label>
            )}
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <GripVertical className="w-3.5 h-3.5" /> Drag rows or use arrows to reorder clips
          </p>

          <div className="space-y-2">
            {clips.map((clip, index) => (
              <div
                key={clip.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={e => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all select-none ${
                  dragIndex === index
                    ? 'opacity-40 border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                    : dragOverIndex === index
                    ? 'border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors flex-shrink-0">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div className="w-[60px] h-[40px] rounded-lg overflow-hidden bg-slate-900 flex-shrink-0 flex items-center justify-center">
                  {clip.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={clip.thumbnailUrl} alt={`Clip ${index + 1} thumbnail`} className="w-full h-full object-cover" />
                  ) : (
                    <Film className="w-5 h-5 text-slate-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate leading-tight">{clip.name}</p>
                  <div className="flex flex-wrap items-center gap-x-2 mt-0.5">
                    {clip.duration > 0 && <span className="text-xs text-slate-400">{formatDuration(clip.duration)}</span>}
                    {clip.width > 0 && <span className="text-xs text-slate-400">{clip.width}&times;{clip.height}</span>}
                    <span className="text-xs text-slate-400">{formatFileSize(clip.file.size)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button onClick={() => moveClip(index, 'up')} disabled={index === 0} title="Move up" className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => moveClip(index, 'down')} disabled={index === clips.length - 1} title="Move down" className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button onClick={() => removeClip(clip.id)} title="Remove clip" className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {loadingFiles && (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading clip metadata...
            </div>
          )}

          {clips.length === 1 && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-400">
              Add at least one more clip to start merging.
            </div>
          )}

          {/* ── Settings panel ── */}
          {clips.length >= 2 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100">Merge Settings</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Output Quality</label>
                <div className="grid grid-cols-3 gap-2">
                  {([{ key: 'high' as Quality, label: 'High', desc: '4 Mbps' }, { key: 'medium' as Quality, label: 'Medium', desc: '2 Mbps' }, { key: 'low' as Quality, label: 'Low', desc: '800 Kbps' }] as const).map(q => (
                    <button key={q.key} onClick={() => setQuality(q.key)} className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${quality === q.key ? 'bg-primary-800 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'}`}>
                      <div>{q.label}</div>
                      <div className={`text-xs mt-0.5 ${quality === q.key ? 'text-primary-200' : 'text-slate-400'}`}>{q.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Output Resolution</label>
                <div className="flex flex-wrap gap-2">
                  {([{ key: 'original' as OutputRes, label: 'Original' }, { key: '1080' as OutputRes, label: '1080p' }, { key: '720' as OutputRes, label: '720p' }, { key: '480' as OutputRes, label: '480p' }] as const).map(r => (
                    <button key={r.key} onClick={() => setOutputRes(r.key)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${outputRes === r.key ? 'bg-primary-800 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'}`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Transition Between Clips</label>
                <div className="grid grid-cols-2 gap-2">
                  {([{ key: 'none' as Transition, label: 'No Transition', desc: 'Instant cut between clips' }, { key: 'fade' as Transition, label: 'Fade', desc: 'Smooth fade in & out' }] as const).map(t => (
                    <button key={t.key} onClick={() => setTransition(t.key)} className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${transition === t.key ? 'bg-primary-800 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'}`}>
                      <div>{t.label}</div>
                      <div className={`text-xs mt-0.5 ${transition === t.key ? 'text-primary-200' : 'text-slate-400'}`}>{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                <input type="checkbox" checked={muteAudio} onChange={e => setMuteAudio(e.target.checked)} className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500" />
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Remove Audio</span>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Strip all audio from merged output — results in smaller file size</p>
                </div>
              </label>
            </div>
          )}

          {/* ── Action buttons ── */}
          {clips.length >= 2 && (
            <div className="flex gap-3">
              <button onClick={mergeVideos} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-800 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">
                <Film className="w-5 h-5" />
                {appState === 'done' ? 'Re-merge Videos' : `Merge ${clips.length} Video${clips.length !== 1 ? 's' : ''}`}
              </button>
              <button onClick={reset} title="Start over" className="flex items-center gap-1.5 px-4 py-3 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── MERGING: Progress ── */}
      {appState === 'merging' && (
        <div className="flex flex-col items-center gap-4 py-10">
          <div className="relative">
            <Loader2 className="w-14 h-14 text-primary-700 animate-spin" />
            <Film className="w-6 h-6 text-primary-500 absolute inset-0 m-auto" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Merging Videos — {progress}%</p>
            {progressLabel && <p className="text-sm text-slate-500 dark:text-slate-400">{progressLabel}</p>}
          </div>
          <div className="w-full max-w-sm h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-600 to-primary-700 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-400 text-center max-w-xs leading-relaxed">
            Processing happens in real time — this takes roughly the same duration as your total video length. Keep this tab open and active.
          </p>
        </div>
      )}

      {/* ── DONE: Result ── */}
      {appState === 'done' && resultUrl && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">Videos merged successfully!</p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                {clips.length} clips &middot; {formatDuration(totalDuration)} total &middot; {formatFileSize(resultSize)} output
              </p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black">
            <video src={resultUrl} controls className="w-full max-h-[400px] object-contain" playsInline />
          </div>
          <DownloadButton onClick={downloadResult} label="Download Merged Video" className="w-full justify-center py-3" />
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
