'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Download, RotateCcw, Music, FileVideo, Loader2, AlertCircle } from 'lucide-react';

type ConversionState = 'idle' | 'loading' | 'converting' | 'done' | 'error';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function encodeWav(audioBuffer: AudioBuffer): Blob {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitsPerSample = 16;

  const channels: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  const numSamples = audioBuffer.length;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numSamples * blockAlign;
  const bufferSize = 44 + dataSize;

  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // WAV header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, bufferSize - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleave audio data and convert to 16-bit PCM
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

export function Mp4ToMp3Tool() {
  const [state, setState] = useState<ConversionState>('idle');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const reset = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setState('idle');
    setFileName('');
    setFileSize(0);
    setDuration(0);
    setProgress(0);
    setAudioUrl(null);
    setErrorMsg('');
    setDragOver(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [audioUrl]);

  const processFile = useCallback(async (file: File) => {
    reset();
    setFileName(file.name);
    setFileSize(file.size);
    setState('loading');
    setErrorMsg('');

    try {
      // Step 1: Load the video to get duration
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          setDuration(video.duration);
          resolve();
        };
        video.onerror = () => reject(new Error('Could not load video file. The format may not be supported by your browser.'));
        video.src = videoUrl;
      });

      setState('converting');
      setProgress(10);

      // Step 2: Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      // Step 3: Decode audio using Web Audio API
      const audioContext = new AudioContext();
      let audioBuffer: AudioBuffer;

      try {
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      } catch {
        throw new Error('Could not decode audio from this video. The file may not contain an audio track, or the format is not supported by your browser.');
      }

      setProgress(70);

      // Step 4: Encode to WAV
      const wavBlob = encodeWav(audioBuffer);
      setProgress(90);

      // Step 5: Create download URL
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
      setProgress(100);
      setState('done');

      // Cleanup
      URL.revokeObjectURL(videoUrl);
      await audioContext.close();
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  }, [reset]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDownload = useCallback(() => {
    if (!audioUrl) return;
    const baseName = fileName.replace(/\.[^.]+$/, '');
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${baseName}.wav`;
    a.click();
  }, [audioUrl, fileName]);

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  return (
    <div className="space-y-6">
      {/* Upload area */}
      {state === 'idle' && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-slate-300 dark:border-slate-600 hover:border-primary-500'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
            Drop your video file here or click to browse
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Supports MP4, WebM, MOV, and other video formats
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,.mp4,.webm,.mov,.avi,.mkv,.m4v"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* File info + progress */}
      {state !== 'idle' && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3 mb-4">
            <FileVideo className="w-8 h-8 text-primary-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{fileName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatFileSize(fileSize)}
                {duration > 0 && <> &middot; {formatDuration(duration)}</>}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          {(state === 'loading' || state === 'converting') && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {state === 'loading' ? 'Loading video...' : 'Extracting audio...'}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 text-right">{progress}%</p>
            </div>
          )}

          {/* Error */}
          {state === 'error' && (
            <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{errorMsg}</p>
            </div>
          )}

          {/* Done: audio preview + download */}
          {state === 'done' && audioUrl && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Music className="w-4 h-4" />
                <span className="text-sm font-medium">Audio extracted successfully!</span>
              </div>

              {/* Audio player */}
              <div>
                <label className={labelClass}>Preview Audio</label>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  className="w-full"
                />
              </div>

              {/* Info banner */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-xs text-amber-800 dark:text-amber-300">
                The audio is saved as WAV (uncompressed, high quality). WAV files are larger than MP3 but preserve full audio quality and are compatible with all devices and audio editors.
              </div>

              {/* Download button */}
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download WAV Audio
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reset button */}
      {state !== 'idle' && (
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Start Over
        </button>
      )}
    </div>
  );
}
