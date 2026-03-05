'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Coffee, Brain, X } from 'lucide-react';

type Mode = 'work' | 'shortBreak' | 'longBreak';

const DEFAULT_DURATIONS = { work: 25, shortBreak: 5, longBreak: 15 };
const MODE_CONFIG: Record<Mode, { label: string; color: string; bg: string; icon: typeof Brain }> = {
  work: { label: 'Focus Time', color: 'text-red-500', bg: 'bg-red-500', icon: Brain },
  shortBreak: { label: 'Short Break', color: 'text-green-500', bg: 'bg-green-500', icon: Coffee },
  longBreak: { label: 'Long Break', color: 'text-blue-500', bg: 'bg-blue-500', icon: Coffee },
};

export function PomodoroTimerTool() {
  const [durations, setDurations] = useState(DEFAULT_DURATIONS);
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState(durations.work * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const totalSeconds = durations[mode] * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const config = MODE_CONFIG[mode];

  const playBeep = useCallback(() => {
    try {
      const ctx = audioRef.current || new AudioContext();
      audioRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }, []);

  const switchMode = useCallback((newMode: Mode) => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode(newMode);
    setTimeLeft(durations[newMode] * 60);
  }, [durations]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          playBeep();
          // Auto switch
          if (mode === 'work') {
            const newSessions = sessions + 1;
            setSessions(newSessions);
            const nextMode = newSessions % 4 === 0 ? 'longBreak' : 'shortBreak';
            setTimeout(() => switchMode(nextMode), 500);
          } else {
            setTimeout(() => switchMode('work'), 500);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode, sessions, switchMode, playBeep]);

  const toggleRunning = () => setRunning(r => !r);
  const reset = () => { setRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); setTimeLeft(durations[mode] * 60); };

  const Icon = config.icon;

  return (
    <div className="max-w-md mx-auto space-y-8">
      {/* Mode tabs */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1">
        {(Object.keys(MODE_CONFIG) as Mode[]).map(m => (
          <button key={m} onClick={() => switchMode(m)}
            className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${mode === m ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {MODE_CONFIG[m].label}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div className="relative w-64 h-64 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" strokeWidth="6" className="stroke-slate-200 dark:stroke-slate-700" />
          <circle cx="60" cy="60" r="54" fill="none" strokeWidth="6" strokeLinecap="round"
            className={`${config.color.replace('text-', 'stroke-')} transition-all duration-1000`}
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className={`w-6 h-6 ${config.color} mb-2`} />
          <span className="text-4xl font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-slate-500 mt-1">{config.label}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={toggleRunning}
          className={`w-16 h-16 rounded-full ${config.bg} hover:opacity-90 text-white flex items-center justify-center shadow-lg transition-all`}>
          {running ? <Pause className="w-7 h-7" fill="currentColor" /> : <Play className="w-7 h-7 ml-1" fill="currentColor" />}
        </button>
        <button onClick={reset} className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-400 flex items-center justify-center transition-colors">
          <RotateCcw className="w-5 h-5" />
        </button>
        <button onClick={() => setShowSettings(true)} className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-400 flex items-center justify-center transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Session counter */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < (sessions % 4) ? config.bg : 'bg-slate-200 dark:bg-slate-700'}`} />
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">{sessions} sessions completed</p>
      </div>

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSettings(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Timer Settings</h3>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            {([['work', 'Focus Duration'], ['shortBreak', 'Short Break'], ['longBreak', 'Long Break']] as [Mode, string][]).map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label} (minutes)</label>
                <input type="number" min={1} max={120} value={durations[key]}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(120, Number(e.target.value)));
                    setDurations(d => ({ ...d, [key]: v }));
                    if (mode === key) setTimeLeft(v * 60);
                  }}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm"
                />
              </div>
            ))}
            <button onClick={() => setShowSettings(false)} className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
