'use client';
import { useState } from 'react';

const CYCLE_MINUTES = 90;
const FALL_ASLEEP_MINUTES = 15;

interface SleepResult {
  time: string;
  cycles: number;
  totalHours: number;
  tag: string;
  tagColor: string;
}

function formatTime(date: Date): string {
  let h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function parseTime(hour: string, minute: string, ampm: string): Date {
  let h = parseInt(hour, 10) % 12;
  if (ampm === 'PM') h += 12;
  const m = parseInt(minute, 10);
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
  return d;
}

function getTag(cycles: number): { tag: string; color: string } {
  if (cycles === 6) return { tag: 'Recommended', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' };
  if (cycles === 5) return { tag: 'Optimal', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' };
  if (cycles === 4) return { tag: 'Acceptable', color: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' };
  if (cycles === 3) return { tag: 'Minimum', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' };
  return { tag: 'Short', color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' };
}

function calcBedtimes(wakeDate: Date): SleepResult[] {
  // Working backwards for N=6,5,4,3,2,1 cycles
  return [6, 5, 4, 3, 2, 1].map(n => {
    const totalMs = (n * CYCLE_MINUTES + FALL_ASLEEP_MINUTES) * 60 * 1000;
    const bedDate = new Date(wakeDate.getTime() - totalMs);
    const { tag, color } = getTag(n);
    return {
      time: formatTime(bedDate),
      cycles: n,
      totalHours: (n * CYCLE_MINUTES) / 60,
      tag,
      tagColor: color,
    };
  });
}

function calcWakeTimes(sleepDate: Date): SleepResult[] {
  // N=1,2,3,4,5,6 cycles
  return [1, 2, 3, 4, 5, 6].map(n => {
    const totalMs = (n * CYCLE_MINUTES + FALL_ASLEEP_MINUTES) * 60 * 1000;
    const wakeDate = new Date(sleepDate.getTime() + totalMs);
    const { tag, color } = getTag(n);
    return {
      time: formatTime(wakeDate),
      cycles: n,
      totalHours: (n * CYCLE_MINUTES) / 60,
      tag,
      tagColor: color,
    };
  });
}

function addMinutesToNow(minutes: number): string {
  return formatTime(new Date(Date.now() + minutes * 60 * 1000));
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = ['00', '15', '30', '45'];

export function SleepCycleCalculatorTool() {
  const [mode, setMode] = useState<'wakeAt' | 'sleepAt'>('wakeAt');
  const [hour, setHour] = useState('10');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('PM');

  const pickedDate = parseTime(hour, minute, ampm);
  const results = mode === 'wakeAt' ? calcBedtimes(pickedDate) : calcWakeTimes(pickedDate);

  const quickButtons = [
    { label: '90 min', mins: 90 },
    { label: '3h', mins: 180 },
    { label: '4.5h', mins: 270 },
    { label: '6h', mins: 360 },
    { label: '7.5h', mins: 450 },
    { label: '9h', mins: 540 },
  ];

  const selectClass =
    'px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';

  return (
    <div className="space-y-5">
      {/* Mode tabs */}
      <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
        <button
          onClick={() => setMode('wakeAt')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'wakeAt' ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          I want to wake up at...
        </button>
        <button
          onClick={() => setMode('sleepAt')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'sleepAt' ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          I want to sleep at...
        </button>
      </div>

      {/* Time picker */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {mode === 'wakeAt' ? 'Wake-up time' : 'Bedtime'}
        </label>
        <div className="flex gap-2 items-center flex-wrap">
          <select value={hour} onChange={e => setHour(e.target.value)} className={selectClass}>
            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          <span className="text-slate-500 dark:text-slate-400 font-bold">:</span>
          <select value={minute} onChange={e => setMinute(e.target.value)} className={selectClass}>
            {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={ampm} onChange={e => setAmpm(e.target.value as 'AM' | 'PM')} className={selectClass}>
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          {mode === 'wakeAt'
            ? `Go to bed at one of these times to wake up at ${hour}:${minute} ${ampm}:`
            : `Wake up at one of these times if you sleep at ${hour}:${minute} ${ampm}:`}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map(r => (
            <div key={r.cycles} className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100">{r.time}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.tagColor}`}>{r.tag}</span>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {r.cycles} cycle{r.cycles !== 1 ? 's' : ''} &bull; {r.totalHours} hrs sleep
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick "Wake me up in" */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Wake me up in... (from now)</div>
        <div className="flex flex-wrap gap-2">
          {quickButtons.map(btn => (
            <div key={btn.label} className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
              <span className="text-xs font-medium text-primary-700 dark:text-primary-400">{btn.label}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">&rarr;</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{addMinutesToNow(btn.mins)}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        Based on 90-minute sleep cycles + 15 minutes to fall asleep. Most adults need 5&ndash;6 cycles (7.5&ndash;9 hours).
      </p>
    </div>
  );
}
