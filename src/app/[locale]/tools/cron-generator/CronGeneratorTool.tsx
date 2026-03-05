'use client';
import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';

const MINUTE_OPTIONS = ['*', ...Array.from({ length: 60 }, (_, i) => String(i))];
const HOUR_OPTIONS = ['*', ...Array.from({ length: 24 }, (_, i) => String(i))];
const DOM_OPTIONS = ['*', ...Array.from({ length: 31 }, (_, i) => String(i + 1))];
const MONTH_OPTIONS = ['*', '1 (Jan)', '2 (Feb)', '3 (Mar)', '4 (Apr)', '5 (May)', '6 (Jun)', '7 (Jul)', '8 (Aug)', '9 (Sep)', '10 (Oct)', '11 (Nov)', '12 (Dec)'];
const DOW_OPTIONS = ['*', '0 (Sun)', '1 (Mon)', '2 (Tue)', '3 (Wed)', '4 (Thu)', '5 (Fri)', '6 (Sat)'];

const PRESETS = [
  { label: 'Every minute', cron: '* * * * *' },
  { label: 'Every 5 minutes', cron: '*/5 * * * *' },
  { label: 'Every 15 minutes', cron: '*/15 * * * *' },
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Every day at midnight', cron: '0 0 * * *' },
  { label: 'Every day at 9am', cron: '0 9 * * *' },
  { label: 'Every Monday at 9am', cron: '0 9 * * 1' },
  { label: 'Every 1st of month', cron: '0 0 1 * *' },
  { label: 'Every weekday at 9am', cron: '0 9 * * 1-5' },
  { label: 'Twice daily (9am, 6pm)', cron: '0 9,18 * * *' },
];

function describeCron(parts: string[]): string {
  if (parts.length !== 5) return 'Invalid cron expression';
  const [min, hour, dom, month, dow] = parts;

  let desc = '';

  // Minute
  if (min === '*') desc += 'Every minute';
  else if (min.startsWith('*/')) desc += `Every ${min.slice(2)} minutes`;
  else if (min.includes(',')) desc += `At minutes ${min}`;
  else desc += `At minute ${min}`;

  // Hour
  if (hour === '*') desc += ' of every hour';
  else if (hour.startsWith('*/')) desc += `, every ${hour.slice(2)} hours`;
  else if (hour.includes(',')) desc += `, at ${hour.split(',').map(h => `${h}:00`).join(' and ')}`;
  else desc += `, at ${hour.padStart(2, '0')}:${min === '*' ? '00' : min.padStart(2, '0')}`;

  // DOM
  if (dom !== '*') {
    if (dom.includes('-')) desc += `, on days ${dom} of the month`;
    else desc += `, on day ${dom} of the month`;
  }

  // Month
  if (month !== '*') {
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (month.includes(',')) desc += `, in ${month.split(',').map(m => months[+m] || m).join(', ')}`;
    else desc += `, in ${months[+month] || month}`;
  }

  // DOW
  if (dow !== '*') {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (dow.includes('-')) {
      const [s, e] = dow.split('-').map(Number);
      desc += `, ${days[s]} through ${days[e]}`;
    } else if (dow.includes(',')) {
      desc += `, on ${dow.split(',').map(d => days[+d] || d).join(', ')}`;
    } else {
      desc += `, on ${days[+dow] || dow}`;
    }
  }

  return desc + '.';
}

export function CronGeneratorTool() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dom, setDom] = useState('*');
  const [month, setMonth] = useState('*');
  const [dow, setDow] = useState('*');
  const [customInput, setCustomInput] = useState('');

  const extractVal = (v: string) => v.split(' ')[0];
  const cron = `${minute} ${hour} ${dom} ${extractVal(month)} ${extractVal(dow)}`;
  const description = useMemo(() => describeCron(cron.split(' ')), [cron]);

  const loadPreset = (preset: string) => {
    const parts = preset.split(' ');
    setMinute(parts[0]); setHour(parts[1]); setDom(parts[2]); setMonth(parts[3]); setDow(parts[4]);
  };

  const parseCustom = () => {
    const parts = customInput.trim().split(/\s+/);
    if (parts.length === 5) {
      setMinute(parts[0]); setHour(parts[1]); setDom(parts[2]); setMonth(parts[3]); setDow(parts[4]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Output */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 text-center">
        <p className="text-xs text-slate-400 mb-2 font-mono">CRON EXPRESSION</p>
        <div className="flex items-center justify-center gap-2">
          <code className="text-3xl sm:text-4xl font-mono font-bold text-green-400 tracking-widest">{cron}</code>
          <CopyButton text={cron} />
        </div>
        <p className="text-sm text-slate-300 mt-3">{description}</p>
      </div>

      {/* Presets */}
      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">Quick Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.cron} onClick={() => loadPreset(p.cron)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${cron === p.cron ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-400'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Builder */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
        {[
          { label: 'Minute', value: minute, set: setMinute, options: MINUTE_OPTIONS },
          { label: 'Hour', value: hour, set: setHour, options: HOUR_OPTIONS },
          { label: 'Day of Month', value: dom, set: setDom, options: DOM_OPTIONS },
          { label: 'Month', value: month, set: setMonth, options: MONTH_OPTIONS },
          { label: 'Day of Week', value: dow, set: setDow, options: DOW_OPTIONS },
        ].map(f => (
          <div key={f.label}>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{f.label}</label>
            <select value={f.value} onChange={(e) => f.set(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm px-2 py-2">
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Custom input */}
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Or paste a cron expression to decode</label>
        <div className="flex gap-2">
          <input type="text" value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="*/5 * * * *"
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-mono" />
          <button onClick={parseCustom} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">Decode</button>
        </div>
      </div>

      {/* Reference */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Cron Syntax Reference</h3>
        <div className="font-mono text-xs text-blue-700 dark:text-blue-400 space-y-1">
          <p>┌──────────── minute (0-59)</p>
          <p>│ ┌────────── hour (0-23)</p>
          <p>│ │ ┌──────── day of month (1-31)</p>
          <p>│ │ │ ┌────── month (1-12)</p>
          <p>│ │ │ │ ┌──── day of week (0-6, Sun=0)</p>
          <p>* * * * *</p>
          <p className="mt-2 text-blue-600 dark:text-blue-500">Special: * (any) , (list) - (range) / (step)</p>
        </div>
      </div>
    </div>
  );
}
