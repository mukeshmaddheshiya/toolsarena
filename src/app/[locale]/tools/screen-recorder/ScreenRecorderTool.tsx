'use client';
import { useState, useRef, useCallback } from 'react';
import { Monitor, StopCircle, Download, Play, RotateCcw } from 'lucide-react';

export function ScreenRecorderTool() {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [recordAudio, setRecordAudio] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const startRecording = useCallback(async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: recordAudio,
      });

      let combinedStream = displayStream;

      if (recordAudio) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const tracks = [...displayStream.getTracks(), ...audioStream.getTracks()];
          combinedStream = new MediaStream(tracks);
        } catch {
          // Mic not available, continue with display audio only
        }
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm',
      });

      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoUrl(URL.createObjectURL(blob));
        combinedStream.getTracks().forEach(t => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
      };

      // Stop when user stops screen share
      displayStream.getVideoTracks()[0].onended = () => { recorder.stop(); setRecording(false); };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setVideoUrl(null);
      setDuration(0);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch {
      // User cancelled screen share
    }
  }, [recordAudio]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }, []);

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    a.click();
  };

  const reset = () => { setVideoUrl(null); setDuration(0); };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Controls */}
      {!recording && !videoUrl && (
        <div className="text-center space-y-6 py-8">
          <Monitor className="w-16 h-16 text-slate-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Record Your Screen</h3>
            <p className="text-sm text-slate-500">Share a tab, window, or entire screen. Everything is recorded locally in your browser.</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <input type="checkbox" id="audio" checked={recordAudio} onChange={(e) => setRecordAudio(e.target.checked)} className="rounded" />
            <label htmlFor="audio" className="text-sm text-slate-600 dark:text-slate-400">Include microphone audio</label>
          </div>

          <button onClick={startRecording}
            className="inline-flex items-center gap-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-base font-medium shadow-lg transition-colors">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
            Start Recording
          </button>
        </div>
      )}

      {/* Recording state */}
      {recording && (
        <div className="text-center space-y-6 py-8">
          <div className="inline-flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-6 py-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-700 dark:text-red-400 font-medium">Recording</span>
            <span className="font-mono text-lg text-red-600 dark:text-red-300 tabular-nums">{formatDuration(duration)}</span>
          </div>

          <button onClick={stopRecording}
            className="inline-flex items-center gap-2 px-8 py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-xl text-base font-medium shadow-lg transition-colors">
            <StopCircle className="w-5 h-5" />
            Stop Recording
          </button>
        </div>
      )}

      {/* Preview */}
      {videoUrl && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Recording ({formatDuration(duration)})
            </h3>
            <div className="flex gap-2">
              <button onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors">
                <Download className="w-4 h-4" /> Download WebM
              </button>
              <button onClick={reset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <RotateCcw className="w-4 h-4" /> New Recording
              </button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black">
            <video src={videoUrl} controls className="w-full max-h-[500px]">
              <track kind="captions" />
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
