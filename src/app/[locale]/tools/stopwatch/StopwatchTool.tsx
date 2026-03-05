'use client';
import { useState, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Flag, Trash2 } from 'lucide-react';

function formatTime(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const centis = Math.floor((ms % 1000) / 10);
  if (hours > 0) return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
}

export function StopwatchTool() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<{ num: number; split: number; total: number }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const accumulatedRef = useRef(0);

  const start = useCallback(() => {
    setRunning(true);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setTime(accumulatedRef.current + (Date.now() - startTimeRef.current));
    }, 10);
  }, []);

  const pause = useCallback(() => {
    setRunning(false);
    accumulatedRef.current += Date.now() - startTimeRef.current;
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    setTime(0);
    setLaps([]);
    accumulatedRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const lap = useCallback(() => {
    const lastTotal = laps.length > 0 ? laps[0].total : 0;
    setLaps(prev => [{ num: prev.length + 1, split: time - lastTotal, total: time }, ...prev]);
  }, [time, laps]);

  const bestLap = laps.length > 1 ? Math.min(...laps.map(l => l.split)) : -1;
  const worstLap = laps.length > 1 ? Math.max(...laps.map(l => l.split)) : -1;

  return (
    <div className="max-w-lg mx-auto space-y-8">
      {/* Display */}
      <div className="text-center">
        <div className="text-6xl sm:text-7xl font-mono font-bold text-slate-900 dark:text-slate-100 tracking-tight tabular-nums">
          {formatTime(time)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {!running ? (
          <button onClick={start} className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-colors">
            <Play className="w-7 h-7 ml-1" fill="currentColor" />
          </button>
        ) : (
          <button onClick={pause} className="w-16 h-16 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center shadow-lg transition-colors">
            <Pause className="w-7 h-7" fill="currentColor" />
          </button>
        )}

        {running && (
          <button onClick={lap} className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-colors">
            <Flag className="w-5 h-5" />
          </button>
        )}

        {time > 0 && !running && (
          <button onClick={reset} className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-lg transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Laps</h3>
            <button onClick={() => setLaps([])} className="text-xs text-slate-400 hover:text-red-500 inline-flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
            {laps.map(l => (
              <div key={l.num} className={`flex items-center justify-between px-4 py-2.5 text-sm ${l.split === bestLap ? 'bg-green-50 dark:bg-green-900/20' : l.split === worstLap ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                <span className="font-medium text-slate-500 w-16">Lap {l.num}</span>
                <span className={`font-mono ${l.split === bestLap ? 'text-green-600 dark:text-green-400 font-semibold' : l.split === worstLap ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                  {formatTime(l.split)}
                </span>
                <span className="font-mono text-slate-400 w-28 text-right">{formatTime(l.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
