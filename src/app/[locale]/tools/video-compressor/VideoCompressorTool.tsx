'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize } from '@/lib/utils';
import { Film, RotateCcw, Loader2, Minimize2, ArrowRight, Play, Pause, Settings } from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────────── */

type QualityPreset = 'low' | 'medium' | 'high' | 'custom';
type Resolution = 'original' | '1080' | '720' | '480' | '360';

interface VideoInfo {
  file: File;
  url: string;
  width: number;
  height: number;
  duration: number;
}

/* ── Helpers ───────────────────────────────────────────────────────── */

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getTargetResolution(original: { width: number; height: number }, res: Resolution): { width: number; height: number } {
  if (res === 'original') return original;
  const targetHeight = parseInt(res);
  const aspect = original.width / original.height;
  // Make width even for encoding
  const width = Math.round(targetHeight * aspect / 2) * 2;
  return { width, height: targetHeight };
}

function getBitrate(preset: QualityPreset, customBitrate: number): number {
  switch (preset) {
    case 'low': return 500_000;
    case 'medium': return 1_000_000;
    case 'high': return 2_000_000;
    case 'custom': return customBitrate;
  }
}

/* ── Component ─────────────────────────────────────────────────────── */

export function VideoCompressorTool() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [preset, setPreset] = useState<QualityPreset>('medium');
  const [resolution, setResolution] = useState<Resolution>('720');
  const [customBitrate, setCustomBitrate] = useState(1_000_000);

  const [muteAudio, setMuteAudio] = useState(false);
  const [state, setState] = useState<'idle' | 'loaded' | 'compressing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState('');
  const [compressedSize, setCompressedSize] = useState(0);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const compressedVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError('');
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    if (videoInfo?.url) URL.revokeObjectURL(videoInfo.url);

    const url = URL.createObjectURL(file);
    setVideoInfo({ file, url, width: 0, height: 0, duration: 0 });
    setState('loaded');
    setCompressedUrl('');
    setCompressedSize(0);
  }, [compressedUrl, videoInfo?.url]);

  const handleVideoLoaded = useCallback(() => {
    const video = videoRef.current;
    if (!video || !videoInfo) return;
    setVideoInfo(prev => prev ? { ...prev, width: video.videoWidth, height: video.videoHeight, duration: video.duration } : null);
  }, [videoInfo]);

  const compressVideo = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !videoInfo) return;

    setState('compressing');
    setProgress(0);
    setError('');

    try {
      const { width, height } = getTargetResolution(
        { width: videoInfo.width, height: videoInfo.height },
        resolution
      );
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      const bitrate = getBitrate(preset, customBitrate);
      const stream = canvas.captureStream(30);

      // Add audio track if available and not muted
      if (!muteAudio) {
        try {
          const audioCtx = new AudioContext();
          const source = audioCtx.createMediaElementSource(video);
          const destination = audioCtx.createMediaStreamDestination();
          source.connect(destination);
          source.connect(audioCtx.destination);
          destination.stream.getAudioTracks().forEach(track => stream.addTrack(track));
        } catch {
          // Video might not have audio — that's fine
        }
      }

      // Detect best supported MIME type (Safari = mp4, Chrome/Firefox = webm)
      const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'].find(
        m => MediaRecorder.isTypeSupported(m)
      );
      if (!mimeType) {
        throw new Error('Your browser does not support video recording. Please try Chrome, Firefox, or Safari 14.6+.');
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: bitrate,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      const done = new Promise<Blob>(resolve => {
        mediaRecorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
      });

      // Play video and draw frames to canvas
      video.currentTime = 0;
      video.muted = true;
      await video.play();
      mediaRecorder.start(100);

      // Progress tracking
      const progressInterval = setInterval(() => {
        if (video.duration > 0) {
          setProgress(Math.min(95, Math.round((video.currentTime / video.duration) * 100)));
        }
      }, 200);

      // Draw loop
      const drawFrame = () => {
        if (!video.paused && !video.ended) {
          ctx.drawImage(video, 0, 0, width, height);
          requestAnimationFrame(drawFrame);
        }
      };
      drawFrame();

      await new Promise<void>(resolve => {
        video.onended = () => resolve();
      });

      clearInterval(progressInterval);
      mediaRecorder.stop();
      video.pause();

      const blob = await done;
      setProgress(100);

      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      setCompressedUrl(URL.createObjectURL(blob));
      setCompressedSize(blob.size);
      setState('done');
    } catch (e) {
      setError(`Compression failed: ${(e as Error).message}. Try a different browser or video format.`);
      setState('loaded');
    }
  }, [videoInfo, resolution, preset, customBitrate, compressedUrl, muteAudio]);

  const reset = () => {
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    if (videoInfo?.url) URL.revokeObjectURL(videoInfo.url);
    setVideoInfo(null);
    setCompressedUrl('');
    setCompressedSize(0);
    setProgress(0);
    setError('');
    setState('idle');
    setIsPlaying(false);
  };

  const downloadCompressed = () => {
    if (!compressedUrl) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    // Detect extension from the blob type
    const ext = compressedUrl && compressedSize > 0 ? (
      typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/mp4') && !MediaRecorder.isTypeSupported('video/webm')
        ? 'mp4' : 'webm'
    ) : 'webm';
    a.download = (videoInfo?.file.name.replace(/\.[^.]+$/, '') || 'video') + `-compressed.${ext}`;
    a.click();
  };

  // Estimate output size
  const estimatedSize = videoInfo
    ? (getBitrate(preset, customBitrate) * videoInfo.duration / 8)
    : 0;

  const savings = videoInfo && compressedSize
    ? ((videoInfo.file.size - compressedSize) / videoInfo.file.size * 100)
    : 0;

  useEffect(() => {
    return () => {
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      if (videoInfo?.url) URL.revokeObjectURL(videoInfo.url);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const presetButtons: { key: QualityPreset; label: string; desc: string }[] = [
    { key: 'low', label: 'Low', desc: '500 Kbps' },
    { key: 'medium', label: 'Medium', desc: '1 Mbps' },
    { key: 'high', label: 'High', desc: '2 Mbps' },
    { key: 'custom', label: 'Custom', desc: 'Set bitrate' },
  ];

  const resolutions: { key: Resolution; label: string }[] = [
    { key: 'original', label: 'Original' },
    { key: '1080', label: '1080p' },
    { key: '720', label: '720p' },
    { key: '480', label: '480p' },
    { key: '360', label: '360p' },
  ];

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />

      {/* Upload */}
      {state === 'idle' && (
        <FileDropzone
          accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
          maxSizeMB={500}
          onFiles={handleFiles}
          description="MP4, WebM, MOV — max 500MB"
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
              muted
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
              <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">{formatFileSize(videoInfo.file.size)}</span>
              {videoInfo.width > 0 && (
                <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">{videoInfo.width}×{videoInfo.height}</span>
              )}
              {videoInfo.duration > 0 && (
                <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">{formatDuration(videoInfo.duration)}</span>
              )}
            </div>
          </div>

          {/* Settings */}
          {(state === 'loaded' || state === 'done') && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100">Compression Settings</h3>
              </div>

              {/* Quality presets */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quality</label>
                <div className="grid grid-cols-4 gap-2">
                  {presetButtons.map(p => (
                    <button
                      key={p.key}
                      onClick={() => setPreset(p.key)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        preset === p.key
                          ? 'bg-primary-800 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'
                      }`}
                    >
                      <div>{p.label}</div>
                      <div className={`text-xs mt-0.5 ${preset === p.key ? 'text-primary-200' : 'text-slate-400'}`}>{p.desc}</div>
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
                    type="range" min={100_000} max={5_000_000} step={100_000}
                    value={customBitrate} onChange={e => setCustomBitrate(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>100 Kbps</span><span>5 Mbps</span></div>
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

              {/* Mute audio toggle */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                <input type="checkbox" checked={muteAudio} onChange={e => setMuteAudio(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500" />
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Remove Audio</span>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Strip audio track for smaller file size</p>
                </div>
              </label>

              {/* Estimated output */}
              {videoInfo.duration > 0 && (
                <div className="flex items-center justify-center gap-3 py-2 px-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Original: <strong>{formatFileSize(videoInfo.file.size)}</strong></span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="text-primary-700 dark:text-primary-400">Estimated: <strong>~{formatFileSize(estimatedSize)}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Compress button */}
          {state === 'loaded' && (
            <div className="flex gap-3">
              <button
                onClick={compressVideo}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-800 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
              >
                <Minimize2 className="w-5 h-5" />
                Compress Video
              </button>
              <button onClick={reset}
                className="flex items-center gap-1.5 px-4 py-3 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Compressing */}
          {state === 'compressing' && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Compressing video... {progress}%</p>
              <div className="w-full max-w-md h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary-700 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-slate-400">Playing through video in background — this takes roughly the video&apos;s length</p>
            </div>
          )}

          {/* Result */}
          {state === 'done' && compressedUrl && (
            <div className="space-y-4">
              {/* Comparison card */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Original</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatFileSize(videoInfo.file.size)}</p>
                  <p className="text-xs text-slate-400 mt-1">{videoInfo.width}×{videoInfo.height}</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-green-200 dark:border-green-800 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Compressed</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatFileSize(compressedSize)}</p>
                  <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                    savings > 0
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    {savings > 0 ? `-${savings.toFixed(0)}% smaller` : 'No reduction'}
                  </span>
                </div>
              </div>

              {/* Compressed video preview */}
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black">
                <video
                  ref={compressedVideoRef}
                  src={compressedUrl}
                  controls
                  className="w-full max-h-[300px] object-contain"
                  playsInline
                />
              </div>

              <div className="flex gap-3">
                <DownloadButton onClick={downloadCompressed} label="Download Compressed Video" className="flex-1 justify-center py-3" />
                <button onClick={reset}
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors">
                  <RotateCcw className="w-4 h-4" /> New Video
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
