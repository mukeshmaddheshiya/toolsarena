'use client';
import { useState, useMemo } from 'react';

type Mode = 'add-subtract' | 'difference' | 'decimal';

const pad = (n: number) => String(Math.abs(n)).padStart(2, '0');
const fmtTime = (h: number, m: number, s: number) => `${pad(h)}:${pad(m)}:${pad(s)}`;

export function TimeCalculatorTool() {
  const [mode, setMode] = useState<Mode>('add-subtract');

  // Add/Subtract
  const [startH, setStartH] = useState(9);
  const [startM, setStartM] = useState(0);
  const [startS, setStartS] = useState(0);
  const [op, setOp] = useState<'add' | 'sub'>('add');
  const [addD, setAddD] = useState(0);
  const [addH, setAddH] = useState(1);
  const [addM, setAddM] = useState(30);
  const [addS, setAddS] = useState(0);

  // Difference
  const [diffStartH, setDiffStartH] = useState(9);
  const [diffStartM, setDiffStartM] = useState(0);
  const [diffEndH, setDiffEndH] = useState(17);
  const [diffEndM, setDiffEndM] = useState(30);
  const [nextDay, setNextDay] = useState(false);

  // Decimal
  const [decH, setDecH] = useState(1);
  const [decM, setDecM] = useState(30);
  const [decS, setDecS] = useState(0);

  const addResult = useMemo(() => {
    let totalSecs = startH * 3600 + startM * 60 + startS;
    const durSecs = addD * 86400 + addH * 3600 + addM * 60 + addS;
    totalSecs = op === 'add' ? totalSecs + durSecs : totalSecs - durSecs;
    const days = Math.floor(totalSecs / 86400);
    let rem = ((totalSecs % 86400) + 86400) % 86400;
    const h = Math.floor(rem / 3600); rem %= 3600;
    const m = Math.floor(rem / 60);
    const s = rem % 60;
    const dayShift = totalSecs < 0 ? Math.ceil(totalSecs / 86400) - (totalSecs % 86400 === 0 ? 0 : 1) : days;
    return { h, m, s, dayShift };
  }, [startH, startM, startS, op, addD, addH, addM, addS]);

  const diffResult = useMemo(() => {
    let startSecs = diffStartH * 3600 + diffStartM * 60;
    let endSecs = diffEndH * 3600 + diffEndM * 60;
    if (nextDay) endSecs += 86400;
    let diff = endSecs - startSecs;
    if (diff < 0) diff += 86400;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    const totalMin = diff / 60;
    const decimalHours = diff / 3600;
    return { h, m, s, totalMin: Math.round(totalMin), totalSecs: diff, decimalHours: decimalHours.toFixed(2) };
  }, [diffStartH, diffStartM, diffEndH, diffEndM, nextDay]);

  const decResult = useMemo(() => {
    const totalSecs = decH * 3600 + decM * 60 + decS;
    const decimalHours = totalSecs / 3600;
    const decimalMin = totalSecs / 60;
    return { decimalHours: decimalHours.toFixed(4), decimalMin: decimalMin.toFixed(2), totalSecs };
  }, [decH, decM, decS]);

  const timeInputClass = 'w-16 text-center px-2 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const numInputClass = 'w-20 text-center px-2 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';

  const setNow = (setH: (n: number) => void, setM: (n: number) => void, setS?: (n: number) => void) => {
    const now = new Date();
    setH(now.getHours()); setM(now.getMinutes()); if (setS) setS(now.getSeconds());
  };

  const modes: { value: Mode; label: string }[] = [
    { value: 'add-subtract', label: 'Add/Subtract' },
    { value: 'difference', label: 'Time Difference' },
    { value: 'decimal', label: 'Time to Decimal' },
  ];

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 w-fit">
        {modes.map(m => (
          <button key={m.value} onClick={() => setMode(m.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${mode === m.value ? 'bg-primary-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'add-subtract' && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Time</label>
              <button onClick={() => setNow(setStartH, setStartM, setStartS)} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Now</button>
            </div>
            <div className="flex items-center gap-1">
              <input type="number" value={startH} min={0} max={23} onChange={e => setStartH(Math.min(23, Math.max(0, +e.target.value || 0)))} className={timeInputClass} />
              <span className="text-lg font-bold text-slate-400">:</span>
              <input type="number" value={startM} min={0} max={59} onChange={e => setStartM(Math.min(59, Math.max(0, +e.target.value || 0)))} className={timeInputClass} />
              <span className="text-lg font-bold text-slate-400">:</span>
              <input type="number" value={startS} min={0} max={59} onChange={e => setStartS(Math.min(59, Math.max(0, +e.target.value || 0)))} className={timeInputClass} />
            </div>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 w-fit">
            {(['add', 'sub'] as const).map(o => (
              <button key={o} onClick={() => setOp(o)}
                className={`px-5 py-2 text-sm font-medium ${op === o ? 'bg-primary-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                {o === 'add' ? '+ Add' : '− Subtract'}
              </button>
            ))}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Duration</label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-center"><input type="number" value={addD} min={0} max={365} onChange={e => setAddD(Math.max(0, +e.target.value || 0))} className={numInputClass} /><div className="text-xs text-slate-400 mt-1">Days</div></div>
              <div className="text-center"><input type="number" value={addH} min={0} max={23} onChange={e => setAddH(Math.max(0, +e.target.value || 0))} className={numInputClass} /><div className="text-xs text-slate-400 mt-1">Hours</div></div>
              <div className="text-center"><input type="number" value={addM} min={0} max={59} onChange={e => setAddM(Math.max(0, +e.target.value || 0))} className={numInputClass} /><div className="text-xs text-slate-400 mt-1">Minutes</div></div>
              <div className="text-center"><input type="number" value={addS} min={0} max={59} onChange={e => setAddS(Math.max(0, +e.target.value || 0))} className={numInputClass} /><div className="text-xs text-slate-400 mt-1">Seconds</div></div>
            </div>
          </div>
          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            {[{ l: '+30 min', h: 0, m: 30 }, { l: '+1 hour', h: 1, m: 0 }, { l: '+8 hours', h: 8, m: 0 }, { l: '+24 hours', h: 24, m: 0 }].map(p => (
              <button key={p.l} onClick={() => { setOp('add'); setAddD(0); setAddH(p.h); setAddM(p.m); setAddS(0); }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">{p.l}</button>
            ))}
          </div>
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white text-center">
            <div className="text-sm text-violet-200 mb-1">Result</div>
            <div className="text-4xl font-heading font-bold">{fmtTime(addResult.h, addResult.m, addResult.s)}</div>
            {addResult.dayShift !== 0 && <div className="text-sm text-violet-300 mt-1">{addResult.dayShift > 0 ? `+${addResult.dayShift} day(s)` : `${addResult.dayShift} day(s)`}</div>}
          </div>
        </div>
      )}

      {mode === 'difference' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Time</label>
                <button onClick={() => setNow(setDiffStartH, setDiffStartM)} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Now</button>
              </div>
              <div className="flex items-center gap-1">
                <input type="number" value={diffStartH} min={0} max={23} onChange={e => setDiffStartH(Math.min(23, +e.target.value || 0))} className={timeInputClass} />
                <span className="text-lg font-bold text-slate-400">:</span>
                <input type="number" value={diffStartM} min={0} max={59} onChange={e => setDiffStartM(Math.min(59, +e.target.value || 0))} className={timeInputClass} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">End Time</label>
              <div className="flex items-center gap-1">
                <input type="number" value={diffEndH} min={0} max={23} onChange={e => setDiffEndH(Math.min(23, +e.target.value || 0))} className={timeInputClass} />
                <span className="text-lg font-bold text-slate-400">:</span>
                <input type="number" value={diffEndM} min={0} max={59} onChange={e => setDiffEndM(Math.min(59, +e.target.value || 0))} className={timeInputClass} />
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <input type="checkbox" checked={nextDay} onChange={e => setNextDay(e.target.checked)} className="rounded border-slate-300 dark:border-slate-600" />
            End time is next day
          </label>
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white">
            <div className="text-center mb-4">
              <div className="text-sm text-violet-200 mb-1">Time Difference</div>
              <div className="text-4xl font-heading font-bold">{fmtTime(diffResult.h, diffResult.m, diffResult.s)}</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-violet-200">Decimal Hours</div><div className="font-bold">{diffResult.decimalHours}</div></div>
              <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-violet-200">Total Minutes</div><div className="font-bold">{diffResult.totalMin}</div></div>
              <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-violet-200">Total Seconds</div><div className="font-bold">{diffResult.totalSecs.toLocaleString()}</div></div>
            </div>
          </div>
        </div>
      )}

      {mode === 'decimal' && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Enter Time (HH:MM:SS)</label>
            <div className="flex items-center gap-1">
              <input type="number" value={decH} min={0} max={999} onChange={e => setDecH(Math.max(0, +e.target.value || 0))} className={timeInputClass} />
              <span className="text-lg font-bold text-slate-400">:</span>
              <input type="number" value={decM} min={0} max={59} onChange={e => setDecM(Math.min(59, Math.max(0, +e.target.value || 0)))} className={timeInputClass} />
              <span className="text-lg font-bold text-slate-400">:</span>
              <input type="number" value={decS} min={0} max={59} onChange={e => setDecS(Math.min(59, Math.max(0, +e.target.value || 0)))} className={timeInputClass} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white">
            <div className="text-center mb-4">
              <div className="text-sm text-violet-200 mb-1">Decimal Hours</div>
              <div className="text-4xl font-heading font-bold">{decResult.decimalHours}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-violet-200">Decimal Minutes</div><div className="font-bold">{decResult.decimalMin}</div></div>
              <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-violet-200">Total Seconds</div><div className="font-bold">{decResult.totalSecs.toLocaleString()}</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
