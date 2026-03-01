'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus } from 'lucide-react';

interface Preset { label: string; seconds: number; }
const PRESETS: Preset[] = [
  { label: '1 min', seconds: 60 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '25 min', seconds: 1500 },
  { label: '30 min', seconds: 1800 },
  { label: '1 hour', seconds: 3600 },
];

function pad(n: number) { return String(n).padStart(2, '0'); }

function secsToHMS(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return { h, m, sec };
}

export function CountdownTimerTool() {
  const [total, setTotal] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [inputH, setInputH] = useState(0);
  const [inputM, setInputM] = useState(5);
  const [inputS, setInputS] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setRunning(false);
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            stop();
            setFinished(true);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, stop]);

  const applyInput = () => {
    const secs = inputH * 3600 + inputM * 60 + inputS;
    if (secs <= 0) return;
    setTotal(secs);
    setRemaining(secs);
    setFinished(false);
    stop();
  };

  const applyPreset = (s: number) => {
    stop();
    setTotal(s);
    setRemaining(s);
    setFinished(false);
    const { h, m, sec } = secsToHMS(s);
    setInputH(h); setInputM(m); setInputS(sec);
  };

  const reset = () => {
    stop();
    setRemaining(total);
    setFinished(false);
  };

  const toggle = () => {
    if (finished) return;
    if (running) stop();
    else setRunning(true);
  };

  const { h, m, sec } = secsToHMS(remaining);
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  const circumference = 2 * Math.PI * 90;

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap gap-2 justify-center">
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => applyPreset(p.seconds)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            {p.label}
          </button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-52 h-52">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-700" strokeWidth="10" />
            <circle cx="100" cy="100" r="90" fill="none"
              stroke={finished ? '#ef4444' : '#3b82f6'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (pct / 100) * circumference}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {finished ? (
              <span className="text-2xl font-bold text-red-500 animate-pulse">Time's Up!</span>
            ) : (
              <>
                <span className="text-4xl font-bold font-mono text-gray-800 dark:text-gray-100 tabular-nums">
                  {h > 0 ? `${pad(h)}:` : ''}{pad(m)}:{pad(sec)}
                </span>
                <span className="text-xs text-gray-400 mt-1">{pct.toFixed(0)}% remaining</span>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button onClick={reset} className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button onClick={toggle} disabled={finished && remaining === 0}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl shadow-lg transition-all ${running ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-40`}>
            {running ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
          </button>
          <button onClick={() => { stop(); setRemaining(r => Math.min(total, r + 60)); setFinished(false); }}
            className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="+1 min">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Custom time input */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Custom Time</p>
        <div className="flex items-center gap-3 flex-wrap">
          {([['Hours', inputH, setInputH, 23], ['Minutes', inputM, setInputM, 59], ['Seconds', inputS, setInputS, 59]] as [string, number, (v: number) => void, number][]).map(([label, val, setter, max]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <label className="text-xs text-gray-400">{label}</label>
              <input type="number" min={0} max={max} value={val}
                onChange={e => setter(Number(e.target.value))}
                className="w-16 text-center px-2 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <button onClick={applyInput}
            className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
            Set Timer
          </button>
        </div>
      </div>
    </div>
  );
}
