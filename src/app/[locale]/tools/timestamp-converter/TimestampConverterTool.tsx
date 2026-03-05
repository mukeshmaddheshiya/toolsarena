'use client';
import { useState, useEffect } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { Clock, RefreshCw } from 'lucide-react';

export function TimestampConverterTool() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [tsResult, setTsResult] = useState<{ local: string; utc: string; iso: string; relative: string } | null>(null);
  const [dateResult, setDateResult] = useState<{ seconds: string; milliseconds: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  function convertTimestamp() {
    const val = tsInput.trim();
    if (!val) return;
    let ms: number;
    const num = parseInt(val);
    if (val.length >= 13) ms = num; // milliseconds
    else ms = num * 1000; // seconds
    const d = new Date(ms);
    if (isNaN(d.getTime())) return;
    const diffMs = Date.now() - ms;
    const diffSec = Math.abs(diffMs / 1000);
    let relative = '';
    if (diffSec < 60) relative = 'just now';
    else if (diffSec < 3600) relative = `${Math.floor(diffSec / 60)} min ${diffMs > 0 ? 'ago' : 'from now'}`;
    else if (diffSec < 86400) relative = `${Math.floor(diffSec / 3600)} hr ${diffMs > 0 ? 'ago' : 'from now'}`;
    else relative = `${Math.floor(diffSec / 86400)} days ${diffMs > 0 ? 'ago' : 'from now'}`;
    setTsResult({
      local: d.toLocaleString(),
      utc: d.toUTCString(),
      iso: d.toISOString(),
      relative,
    });
  }

  function convertDate() {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return;
    setDateResult({
      seconds: Math.floor(d.getTime() / 1000).toString(),
      milliseconds: d.getTime().toString(),
    });
  }

  const todayStr = new Date().toISOString().slice(0, 16);

  return (
    <div className="space-y-6">
      {/* Live timestamp */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Current Unix Timestamp</span>
          </div>
          <span className="flex items-center gap-1 text-xs text-green-400"><RefreshCw className="w-3 h-3 animate-spin" />Live</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-3xl font-bold text-green-400">{now}</div>
          <CopyButton text={String(now)} size="sm" />
        </div>
        <p className="text-xs text-slate-400 mt-1">Milliseconds: {now * 1000}</p>
      </div>

      {/* Timestamp → Date */}
      <div className="space-y-3">
        <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100">Timestamp → Date</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={tsInput}
            onChange={e => setTsInput(e.target.value)}
            placeholder="e.g. 1700000000 or 1700000000000"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
          />
          <button onClick={convertTimestamp} className="px-4 py-2.5 bg-primary-800 hover:bg-primary-700 text-white font-medium rounded-xl text-sm transition-colors">
            Convert
          </button>
          <button onClick={() => { setTsInput(String(now)); }} className="px-3 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Use Now
          </button>
        </div>
        {tsResult && (
          <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            {[
              { label: 'Local Time', value: tsResult.local },
              { label: 'UTC', value: tsResult.utc },
              { label: 'ISO 8601', value: tsResult.iso },
              { label: 'Relative', value: tsResult.relative },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-24 shrink-0">{label}</span>
                <span className="flex-1 text-sm font-mono text-slate-900 dark:text-slate-100 truncate">{value}</span>
                <CopyButton text={value} size="sm" label="" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Date → Timestamp */}
      <div className="space-y-3">
        <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100">Date → Timestamp</h3>
        <div className="flex gap-2">
          <input type="datetime-local" value={dateInput} onChange={e => setDateInput(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
          <button onClick={convertDate} className="px-4 py-2.5 bg-primary-800 hover:bg-primary-700 text-white font-medium rounded-xl text-sm transition-colors">Convert</button>
          <button onClick={() => setDateInput(todayStr)} className="px-3 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Now</button>
        </div>
        {dateResult && (
          <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            {[
              { label: 'Unix (seconds)', value: dateResult.seconds },
              { label: 'Unix (ms)', value: dateResult.milliseconds },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-32 shrink-0">{label}</span>
                <span className="flex-1 text-sm font-mono text-green-600 dark:text-green-400">{value}</span>
                <CopyButton text={value} size="sm" label="" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
