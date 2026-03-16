'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize } from '@/lib/utils';
import { Scissors, RotateCcw, Loader2, Play, Pause, ZoomIn, ZoomOut, Volume2 } from 'lucide-react';

/* ── WAV Encoder ───────────────────────────────────────────────────── */

function encodeWav(audioBuffer: AudioBuffer, startSample: number, endSample: number, fadeInSamples: number, fadeOutSamples: number): Blob {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = endSample - startSample;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = length * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Get channel data
  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channels.push(audioBuffer.getChannelData(ch));
  }

  let offset = 44;
  for (let i = 0; i < length; i++) {
    // Calculate fade multiplier
    let fadeMultiplier = 1;
    if (i < fadeInSamples) fadeMultiplier = i / fadeInSamples;
    if (i > length - fadeOutSamples) fadeMultiplier = (length - i) / fadeOutSamples;

    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channels[ch][startSample + i] * fadeMultiplier;
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

/* ── Helpers ───────────────────────────────────────────────────────── */

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

function parseTime(str: string): number {
  const parts = str.split(':');
  if (parts.length !== 2) return 0;
  const [mStr, rest] = parts;
  const [sStr, msStr] = (rest || '0').split('.');
  return parseInt(mStr || '0') * 60 + parseInt(sStr || '0') + parseInt(msStr || '0') / 100;
}

/* ── Component ─────────────────────────────────────────────────────── */

export function AudioCutterTool() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [duration, setDuration] = useState(0);
  const [sampleRate, setSampleRate] = useState(0);
  const [channels, setChannels] = useState(0);

  // Selection
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  // Playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playMode, setPlayMode] = useState<'full' | 'selection'>('selection');

  // Settings
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);

  // State
  const [state, setState] = useState<'idle' | 'loaded' | 'processing' | 'done'>('idle');
  const [error, setError] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const playStartRef = useRef(0);
  const playOffsetRef = useRef(0);

  // Dragging handles
  const [dragging, setDragging] = useState<'start' | 'end' | 'region' | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartTimeRef = useRef(0);
  const dragEndTimeRef = useRef(0);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError('');
    stopPlayback();
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    try {
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = await ctx.decodeAudioData(arrayBuffer);

      setAudioFile(file);
      setAudioBuffer(buffer);
      setDuration(buffer.duration);
      setSampleRate(buffer.sampleRate);
      setChannels(buffer.numberOfChannels);
      setStartTime(0);
      setEndTime(buffer.duration);
      setResultBlob(null);
      setResultUrl('');
      setState('loaded');
      setZoom(1);
    } catch {
      setError('Failed to decode audio file. Try a different format.');
    }
  }, [resultUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // Draw waveform
  useEffect(() => {
    if (!audioBuffer || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    const containerWidth = (waveformContainerRef.current?.clientWidth || 800) * zoom;
    const height = 180;

    canvas.width = containerWidth * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Background
    const isDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
    ctx.fillRect(0, 0, containerWidth, height);

    // Selection highlight
    const selStart = (startTime / duration) * containerWidth;
    const selEnd = (endTime / duration) * containerWidth;
    ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)';
    ctx.fillRect(selStart, 0, selEnd - selStart, height);

    // Draw waveform
    const channelData = audioBuffer.getChannelData(0);
    const samplesPerPixel = Math.floor(channelData.length / containerWidth);
    const mid = height / 2;

    for (let x = 0; x < containerWidth; x++) {
      let min = 0, max = 0;
      const start = x * samplesPerPixel;
      for (let j = 0; j < samplesPerPixel; j++) {
        const val = channelData[start + j] || 0;
        if (val < min) min = val;
        if (val > max) max = val;
      }

      const timeAtX = (x / containerWidth) * duration;
      const inSelection = timeAtX >= startTime && timeAtX <= endTime;

      ctx.strokeStyle = inSelection
        ? (isDark ? '#818cf8' : '#4f46e5')
        : (isDark ? '#475569' : '#94a3b8');
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, mid + min * mid);
      ctx.lineTo(x, mid + max * mid);
      ctx.stroke();
    }

    // Selection handles
    ctx.fillStyle = isDark ? '#a5b4fc' : '#4338ca';
    // Left handle
    ctx.fillRect(selStart - 2, 0, 4, height);
    ctx.beginPath();
    ctx.arc(selStart, height / 2, 8, 0, Math.PI * 2);
    ctx.fill();
    // Right handle
    ctx.fillRect(selEnd - 2, 0, 4, height);
    ctx.beginPath();
    ctx.arc(selEnd, height / 2, 8, 0, Math.PI * 2);
    ctx.fill();

    // Playback cursor
    if (isPlaying || playbackTime > 0) {
      const cursorX = (playbackTime / duration) * containerWidth;
      ctx.strokeStyle = isDark ? '#f97316' : '#ea580c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cursorX, 0);
      ctx.lineTo(cursorX, height);
      ctx.stroke();
    }
  }, [audioBuffer, duration, startTime, endTime, zoom, playbackTime, isPlaying]);

  // Handle mouse interaction on waveform
  const handleWaveformMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current || !duration) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const containerWidth = rect.width;
    const time = (x / containerWidth) * duration;

    const selStartX = (startTime / duration) * containerWidth;
    const selEndX = (endTime / duration) * containerWidth;

    // Check if clicking near handles (within 15px)
    if (Math.abs(x - selStartX) < 15) {
      setDragging('start');
    } else if (Math.abs(x - selEndX) < 15) {
      setDragging('end');
    } else if (x > selStartX && x < selEndX) {
      setDragging('region');
      dragStartXRef.current = x;
      dragStartTimeRef.current = startTime;
      dragEndTimeRef.current = endTime;
    } else {
      // Click outside — set new start point
      setStartTime(Math.max(0, time));
    }
  }, [duration, startTime, endTime]);

  const handleWaveformMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !canvasRef.current || !duration) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = Math.max(0, Math.min(duration, (x / rect.width) * duration));

    if (dragging === 'start') {
      setStartTime(Math.min(time, endTime - 0.05));
    } else if (dragging === 'end') {
      setEndTime(Math.max(time, startTime + 0.05));
    } else if (dragging === 'region') {
      const dx = x - dragStartXRef.current;
      const dt = (dx / rect.width) * duration;
      const regionLen = dragEndTimeRef.current - dragStartTimeRef.current;
      let newStart = dragStartTimeRef.current + dt;
      let newEnd = dragEndTimeRef.current + dt;
      if (newStart < 0) { newStart = 0; newEnd = regionLen; }
      if (newEnd > duration) { newEnd = duration; newStart = duration - regionLen; }
      setStartTime(newStart);
      setEndTime(newEnd);
    }
  }, [dragging, duration, startTime, endTime]);

  const handleWaveformMouseUp = useCallback(() => setDragging(null), []);

  // Playback
  const stopPlayback = useCallback(() => {
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch { /* ignore */ }
      sourceNodeRef.current = null;
    }
    cancelAnimationFrame(animFrameRef.current);
    setIsPlaying(false);
  }, []);

  const playAudio = useCallback((mode: 'full' | 'selection') => {
    if (!audioBuffer || !audioContextRef.current) return;
    stopPlayback();

    const ctx = audioContextRef.current;
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = playbackSpeed;

    // Volume control via gain node
    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;
    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    const start = mode === 'selection' ? startTime : 0;
    const end = mode === 'selection' ? endTime : duration;
    const playDuration = end - start;

    source.start(0, start, playDuration);
    sourceNodeRef.current = source;
    playStartRef.current = ctx.currentTime;
    playOffsetRef.current = start;
    setPlayMode(mode);
    setIsPlaying(true);

    const updateCursor = () => {
      const elapsed = (ctx.currentTime - playStartRef.current) * playbackSpeed;
      setPlaybackTime(playOffsetRef.current + elapsed);
      if (elapsed < playDuration) {
        animFrameRef.current = requestAnimationFrame(updateCursor);
      } else {
        setIsPlaying(false);
        setPlaybackTime(0);
      }
    };
    animFrameRef.current = requestAnimationFrame(updateCursor);

    source.onended = () => {
      setIsPlaying(false);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [audioBuffer, startTime, endTime, duration, stopPlayback, playbackSpeed, volume]);

  // Cut and export
  const cutAudio = useCallback(() => {
    if (!audioBuffer) return;
    setState('processing');

    setTimeout(() => {
      try {
        const startSample = Math.floor(startTime * audioBuffer.sampleRate);
        const endSample = Math.floor(endTime * audioBuffer.sampleRate);
        const fadeInSamples = Math.floor(fadeIn * audioBuffer.sampleRate);
        const fadeOutSamples = Math.floor(fadeOut * audioBuffer.sampleRate);

        const blob = encodeWav(audioBuffer, startSample, endSample, fadeInSamples, fadeOutSamples);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setState('done');
      } catch (e) {
        setError(`Export failed: ${(e as Error).message}`);
        setState('loaded');
      }
    }, 50);
  }, [audioBuffer, startTime, endTime, fadeIn, fadeOut, resultUrl]);

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = (audioFile?.name.replace(/\.[^.]+$/, '') || 'audio') + '-trimmed.wav';
    a.click();
  };

  const reset = () => {
    stopPlayback();
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setAudioFile(null);
    setAudioBuffer(null);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setResultBlob(null);
    setResultUrl('');
    setError('');
    setState('idle');
    setZoom(1);
    setFadeIn(0);
    setFadeOut(0);
  };

  useEffect(() => {
    return () => {
      stopPlayback();
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectionDuration = endTime - startTime;

  return (
    <div className="space-y-5">
      {/* Upload */}
      {state === 'idle' && (
        <FileDropzone
          accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/flac,audio/aac,.mp3,.wav,.ogg,.m4a,.flac,.aac"
          maxSizeMB={100}
          onFiles={handleFiles}
          description="MP3, WAV, OGG, M4A, FLAC, AAC — max 100MB"
        />
      )}

      {/* Loaded state */}
      {state !== 'idle' && audioBuffer && (
        <div className="space-y-5">
          {/* Audio info */}
          <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <Volume2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-[200px]">{audioFile?.name}</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{formatTime(duration)}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{sampleRate} Hz</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{channels}ch</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{formatFileSize(audioFile?.size || 0)}</span>
            </div>
          </div>

          {/* Waveform */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Waveform</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setZoom(z => Math.max(1, z - 0.5))}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-400 w-10 text-center">{zoom}x</span>
                <button onClick={() => setZoom(z => Math.min(8, z + 0.5))}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={waveformContainerRef}
              className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 cursor-col-resize"
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleWaveformMouseDown}
                onMouseMove={handleWaveformMouseMove}
                onMouseUp={handleWaveformMouseUp}
                onMouseLeave={handleWaveformMouseUp}
              />
            </div>
          </div>

          {/* Time controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Start</label>
              <input
                type="text"
                value={formatTime(startTime)}
                onChange={e => {
                  const t = parseTime(e.target.value);
                  if (!isNaN(t) && t >= 0 && t < endTime) setStartTime(t);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">End</label>
              <input
                type="text"
                value={formatTime(endTime)}
                onChange={e => {
                  const t = parseTime(e.target.value);
                  if (!isNaN(t) && t > startTime && t <= duration) setEndTime(t);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Duration</label>
              <div className="w-full px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-sm font-mono text-center text-primary-700 dark:text-primary-400 font-bold">
                {formatTime(selectionDuration)}
              </div>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() => isPlaying ? stopPlayback() : playAudio('selection')}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-800 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {isPlaying && playMode === 'selection' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying && playMode === 'selection' ? 'Stop' : 'Play'}
              </button>
            </div>
          </div>

          {/* Playback & Effects Controls */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Playback & Effects</h3>

            {/* Speed & Volume */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs text-slate-600 dark:text-slate-400">Playback Speed</label>
                  <span className="text-xs font-bold text-primary-700 dark:text-primary-400">{playbackSpeed}x</span>
                </div>
                <div className="flex gap-1">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
                    <button key={s} onClick={() => setPlaybackSpeed(s)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                        playbackSpeed === s
                          ? 'bg-primary-800 text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs text-slate-600 dark:text-slate-400">
                    <Volume2 className="w-3 h-3 inline mr-1" />Volume
                  </label>
                  <span className="text-xs font-bold text-primary-700 dark:text-primary-400">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range" min={0} max={1.5} step={0.05}
                  value={volume} onChange={e => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
                />
              </div>
            </div>

            {/* Fade In/Out */}
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-2 block">Fade Effects</label>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Fade In</span>
                    <span className="text-xs font-bold text-primary-700 dark:text-primary-400">{fadeIn.toFixed(1)}s</span>
                  </div>
                  <input
                    type="range" min={0} max={3} step={0.1}
                    value={fadeIn} onChange={e => setFadeIn(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Fade Out</span>
                    <span className="text-xs font-bold text-primary-700 dark:text-primary-400">{fadeOut.toFixed(1)}s</span>
                  </div>
                  <input
                    type="range" min={0} max={3} step={0.1}
                    value={fadeOut} onChange={e => setFadeOut(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {(state === 'loaded' || state === 'done') && (
            <div className="flex gap-3">
              <button
                onClick={cutAudio}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-800 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
              >
                <Scissors className="w-5 h-5" />
                Cut & Export
              </button>
              <button onClick={() => playAudio('full')}
                className="flex items-center gap-1.5 px-4 py-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Play className="w-4 h-4" /> Full
              </button>
              <button onClick={reset}
                className="flex items-center gap-1.5 px-4 py-3 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Processing */}
          {state === 'processing' && (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="w-8 h-8 text-primary-700 animate-spin" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Processing audio...</p>
            </div>
          )}

          {/* Result */}
          {state === 'done' && resultUrl && (
            <div className="space-y-3">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100">Trimmed Audio</h3>
                  <span className="text-sm font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {formatFileSize(resultBlob?.size || 0)}
                  </span>
                </div>
                <audio controls src={resultUrl} className="w-full" />
                <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Original: {formatFileSize(audioFile?.size || 0)}</span>
                  <span>→</span>
                  <span>Trimmed: {formatFileSize(resultBlob?.size || 0)}</span>
                  <span>({formatTime(selectionDuration)})</span>
                </div>
              </div>
              <DownloadButton onClick={downloadResult} label="Download WAV" className="w-full justify-center py-3" />
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
