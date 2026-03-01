'use client';

import { useState, useCallback } from 'react';
import { Wifi, WifiOff, RotateCcw, Activity, Zap, Signal } from 'lucide-react';

type TestState = 'idle' | 'ping' | 'download' | 'done' | 'error';

interface Result {
  ping: number;
  download: number;
  grade: string;
}

const DOWNLOAD_SIZES = [500_000, 2_000_000, 5_000_000, 10_000_000];
const CDN_URL = 'https://speed.cloudflare.com/__down?bytes=';

function getGrade(mbps: number): string {
  if (mbps >= 100) return 'Excellent';
  if (mbps >= 50) return 'Very Good';
  if (mbps >= 25) return 'Good';
  if (mbps >= 10) return 'Fair';
  if (mbps >= 5) return 'Slow';
  return 'Very Slow';
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case 'Excellent': return 'text-emerald-500';
    case 'Very Good': return 'text-green-500';
    case 'Good': return 'text-blue-500';
    case 'Fair': return 'text-yellow-500';
    case 'Slow': return 'text-orange-500';
    default: return 'text-red-500';
  }
}

function getGradeBg(grade: string): string {
  switch (grade) {
    case 'Excellent': return 'from-emerald-500 to-green-400';
    case 'Very Good': return 'from-green-500 to-teal-400';
    case 'Good': return 'from-blue-500 to-indigo-400';
    case 'Fair': return 'from-yellow-500 to-amber-400';
    case 'Slow': return 'from-orange-500 to-red-400';
    default: return 'from-red-500 to-rose-400';
  }
}

function SpeedGauge({ mbps, active }: { mbps: number; active: boolean }) {
  // Gauge from 0 to 200 Mbps range, capped
  const MAX = 200;
  const capped = Math.min(mbps, MAX);
  const pct = (capped / MAX) * 100;
  const circumference = 2 * Math.PI * 54;
  const dash = (pct / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-52 h-52">
      <svg className="w-52 h-52 -rotate-90" viewBox="0 0 120 120">
        {/* Track */}
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-gray-100 dark:text-gray-700" />
        {/* Progress */}
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke="url(#speedGrad)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className={`transition-all duration-500 ${active ? 'animate-pulse' : ''}`}
        />
        <defs>
          <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold font-mono text-gray-900 dark:text-white">
          {mbps > 0 ? mbps.toFixed(1) : '—'}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mbps</span>
      </div>
    </div>
  );
}

export function InternetSpeedTool() {
  const [state, setState] = useState<TestState>('idle');
  const [ping, setPing] = useState(0);
  const [downloadMbps, setDownloadMbps] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState('');

  const measurePing = useCallback(async (): Promise<number> => {
    const times: number[] = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try {
        await fetch(`${CDN_URL}1&r=${Math.random()}`, { cache: 'no-store' });
        times.push(performance.now() - start);
      } catch {
        // skip failed attempt
      }
    }
    if (times.length === 0) throw new Error('Network unreachable');
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  }, []);

  const measureDownload = useCallback(async (): Promise<number> => {
    const speeds: number[] = [];
    for (let i = 0; i < DOWNLOAD_SIZES.length; i++) {
      const bytes = DOWNLOAD_SIZES[i];
      setProgress(Math.round(((i + 1) / DOWNLOAD_SIZES.length) * 100));
      const start = performance.now();
      const res = await fetch(`${CDN_URL}${bytes}&r=${Math.random()}`, { cache: 'no-store' });
      await res.arrayBuffer();
      const elapsed = (performance.now() - start) / 1000;
      const mbps = (bytes * 8) / elapsed / 1_000_000;
      speeds.push(mbps);
      setDownloadMbps(parseFloat(mbps.toFixed(1)));
    }
    // Weighted average — give more weight to larger transfers
    const weighted = speeds.reduce((sum, s, i) => sum + s * (i + 1), 0);
    const totalWeight = speeds.reduce((sum, _, i) => sum + (i + 1), 0);
    return parseFloat((weighted / totalWeight).toFixed(1));
  }, []);

  const runTest = useCallback(async () => {
    setState('ping');
    setPing(0);
    setDownloadMbps(0);
    setProgress(0);
    setResult(null);
    setError('');

    try {
      setStatusMsg('Measuring ping...');
      const pingMs = await measurePing();
      setPing(pingMs);

      setState('download');
      setStatusMsg('Measuring download speed...');
      const dlMbps = await measureDownload();

      const grade = getGrade(dlMbps);
      setResult({ ping: pingMs, download: dlMbps, grade });
      setState('done');
      setStatusMsg('');
    } catch (e) {
      setError(`Test failed: ${(e as Error).message}. Check your connection and try again.`);
      setState('error');
    }
  }, [measurePing, measureDownload]);

  const reset = () => {
    setState('idle');
    setPing(0);
    setDownloadMbps(0);
    setProgress(0);
    setResult(null);
    setError('');
    setStatusMsg('');
  };

  const isRunning = state === 'ping' || state === 'download';

  return (
    <div className="space-y-8">
      {/* Main Speed Display */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <div className="flex flex-col items-center gap-6">
          {/* Gauge */}
          <SpeedGauge mbps={downloadMbps} active={state === 'download'} />

          {/* Status message */}
          {isRunning && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Activity className="w-4 h-4 animate-pulse text-blue-500" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Progress bar */}
          {state === 'download' && (
            <div className="w-full max-w-xs">
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-xs text-gray-400 mt-1">{progress}% complete</p>
            </div>
          )}

          {/* Grade badge */}
          {result && (
            <div className={`px-5 py-1.5 rounded-full text-white font-semibold text-sm bg-gradient-to-r ${getGradeBg(result.grade)}`}>
              {result.grade}
            </div>
          )}

          {/* Start / Retest button */}
          {!isRunning && (
            <button
              onClick={state === 'idle' || state === 'error' ? runTest : reset}
              className={`flex items-center gap-2 px-10 py-3.5 rounded-xl font-bold text-white text-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                state === 'done'
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                  : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700'
              }`}
            >
              {state === 'done' ? (
                <><RotateCcw className="w-5 h-5" /> Test Again</>
              ) : state === 'error' ? (
                <><RotateCcw className="w-5 h-5" /> Retry</>
              ) : (
                <><Zap className="w-5 h-5" /> Start Test</>
              )}
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              <WifiOff className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Ping */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Signal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
            {ping > 0 ? ping : '—'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Ping (ms)</span>
          {ping > 0 && (
            <span className={`text-xs font-medium ${ping < 20 ? 'text-emerald-500' : ping < 50 ? 'text-green-500' : ping < 100 ? 'text-yellow-500' : 'text-red-500'}`}>
              {ping < 20 ? 'Excellent' : ping < 50 ? 'Good' : ping < 100 ? 'Fair' : 'High'}
            </span>
          )}
        </div>

        {/* Download */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
            <Wifi className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
            {downloadMbps > 0 ? downloadMbps.toFixed(1) : '—'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Download (Mbps)</span>
          {result && (
            <span className={`text-xs font-medium ${getGradeColor(result.grade)}`}>{result.grade}</span>
          )}
        </div>

        {/* Connection type */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
            {result ? (result.download >= 25 ? '4K' : result.download >= 5 ? 'HD' : 'SD') : '—'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Streaming Quality</span>
          {result && (
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {result.download >= 25 ? 'Netflix 4K ready' : result.download >= 5 ? 'HD streaming OK' : 'SD only'}
            </span>
          )}
        </div>
      </div>

      {/* Reference table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">Speed Reference Guide</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-750">
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Activity</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Min Speed</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400">Recommended</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {[
                { activity: 'Web Browsing', min: '1 Mbps', rec: '5 Mbps' },
                { activity: 'HD Video Streaming', min: '5 Mbps', rec: '15 Mbps' },
                { activity: '4K Streaming', min: '25 Mbps', rec: '50 Mbps' },
                { activity: 'Video Calls (HD)', min: '3 Mbps', rec: '10 Mbps' },
                { activity: 'Online Gaming', min: '3 Mbps', rec: '25 Mbps' },
                { activity: 'Work from Home', min: '10 Mbps', rec: '50 Mbps' },
              ].map(row => (
                <tr key={row.activity} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="px-5 py-3 text-gray-800 dark:text-gray-200">{row.activity}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{row.min}</td>
                  <td className="px-5 py-3 font-medium text-blue-600 dark:text-blue-400">{row.rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
