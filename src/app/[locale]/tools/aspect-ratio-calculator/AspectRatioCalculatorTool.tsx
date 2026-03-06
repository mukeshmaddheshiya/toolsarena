'use client';

import { useState, useCallback } from 'react';
import { Maximize, Monitor, Smartphone, Copy, Lock, Unlock, Check } from 'lucide-react';

const COMMON_RATIOS = [
  { w: 16, h: 9, name: 'HD Video', use: 'YouTube, TV', res: '1920x1080' },
  { w: 4, h: 3, name: 'Old TV', use: 'iPad', res: '1024x768' },
  { w: 1, h: 1, name: 'Square', use: 'Instagram Square', res: '1080x1080' },
  { w: 9, h: 16, name: 'Vertical', use: 'Stories, TikTok', res: '1080x1920' },
  { w: 21, h: 9, name: 'Ultrawide', use: 'Cinema, Monitor', res: '2560x1080' },
  { w: 3, h: 2, name: 'Photography', use: 'DSLR', res: '6000x4000' },
  { w: 2, h: 3, name: 'Portrait', use: 'Portrait Photo', res: '4000x6000' },
  { w: 1, h: 1.414, name: 'A4 Paper', use: 'Print, Document', res: '2480x3508' },
];

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export function AspectRatioCalculatorTool() {
  const [tab, setTab] = useState<'calculate' | 'resize'>('calculate');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [preset, setPreset] = useState('16:9');
  const [dim, setDim] = useState(1920);
  const [lockWidth, setLockWidth] = useState(true);
  const [copied, setCopied] = useState(false);

  const d = gcd(width, height);
  const rw = width && height ? width / d : 0;
  const rh = width && height ? height / d : 0;
  const decimal = height ? +(width / height).toFixed(4) : 0;
  const percent = height ? +((width / height) * 100).toFixed(2) : 0;
  const ratioStr = `${rw}:${rh}`;

  const matchedRatio = COMMON_RATIOS.find(r => {
    const rd = gcd(r.w * 1000, r.h * 1000);
    const nw = (r.w * 1000) / rd, nh = (r.h * 1000) / rd;
    const cd = gcd(rw * 1000, rh * 1000);
    const cw = (rw * 1000) / cd, ch = (rh * 1000) / cd;
    return Math.abs(nw / nh - cw / ch) < 0.001;
  });

  const previewSize = useCallback(() => {
    if (!width || !height) return { w: 200, h: 200 };
    const maxW = 400, maxH = 300;
    const scale = Math.min(maxW / width, maxH / height);
    return { w: Math.max(40, Math.round(width * scale)), h: Math.max(40, Math.round(height * scale)) };
  }, [width, height]);

  const resizedDim = useCallback(() => {
    const [pw, ph] = preset === 'custom' ? [rw, rh] : preset.split(':').map(Number);
    if (!pw || !ph) return 0;
    return lockWidth ? Math.round(dim * ph / pw) : Math.round(dim * pw / ph);
  }, [preset, dim, lockWidth, rw, rh]);

  const fillFromRatio = (w: number, h: number) => {
    if (tab === 'calculate') { setWidth(w > 1 ? Math.round(w) : w); setHeight(h > 1 ? Math.round(h) : h); }
    else { setPreset(h === 1.414 ? '1:1.414' : `${w}:${h}`); }
  };

  const copyRatio = async () => {
    await navigator.clipboard.writeText(ratioStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const pv = previewSize();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-6 text-white text-center">
        <Maximize className="mx-auto mb-2 h-10 w-10" />
        <h2 className="text-2xl font-bold">Aspect Ratio Calculator</h2>
        <p className="mt-1 text-orange-100 text-sm">Calculate, convert, and resize with any aspect ratio</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
        {(['calculate', 'resize'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${tab === t ? 'bg-white dark:bg-gray-700 shadow text-orange-600 dark:text-orange-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            {t === 'calculate' ? 'Calculate Ratio' : 'Resize by Ratio'}
          </button>
        ))}
      </div>

      {tab === 'calculate' ? (
        <div className="space-y-6">
          {/* Inputs */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Width</label>
                <input type="number" min={1} value={width} onChange={e => setWidth(+e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2.5 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Height</label>
                <input type="number" min={1} value={height} onChange={e => setHeight(+e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2.5 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Results */}
          {width > 0 && height > 0 && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-5">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Aspect Ratio</p>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{ratioStr}</p>
                </div>
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Decimal</p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{decimal}</p>
                </div>
                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Percentage</p>
                  <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{percent}%</p>
                </div>
              </div>

              {matchedRatio && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-2.5 text-sm text-green-700 dark:text-green-400">
                  <Monitor className="h-4 w-4 shrink-0" />
                  <span>Matches <strong>{matchedRatio.w}:{matchedRatio.h}</strong> &mdash; {matchedRatio.name} ({matchedRatio.use})</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Visual Preview</span>
                <button onClick={copyRatio}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 text-xs font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy Ratio'}
                </button>
              </div>
              <div className="flex justify-center">
                <div className="rounded-lg border-2 border-dashed border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-900/10 flex items-center justify-center text-xs text-orange-400"
                  style={{ width: pv.w, height: pv.h }}>
                  {width} x {height}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Resize Mode */
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Select Ratio</label>
            <div className="flex flex-wrap gap-2">
              {[...COMMON_RATIOS.filter(r => r.h !== 1.414).map(r => `${r.w}:${r.h}`), '1:1.414', 'custom'].map(r => (
                <button key={r} onClick={() => setPreset(r)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${preset === r ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                  {r === 'custom' ? 'Custom' : r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {lockWidth ? 'Width (input)' : 'Width (calculated)'}
              </label>
              <input type="number" min={1} value={lockWidth ? dim : resizedDim()} readOnly={!lockWidth}
                onChange={e => lockWidth && setDim(+e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 outline-none ${lockWidth ? 'border-orange-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-500' : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`} />
            </div>
            <button onClick={() => setLockWidth(!lockWidth)}
              className="mb-0.5 rounded-lg p-2.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
              title={lockWidth ? 'Width locked — switch to lock height' : 'Height locked — switch to lock width'}>
              {lockWidth ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
            </button>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {!lockWidth ? 'Height (input)' : 'Height (calculated)'}
              </label>
              <input type="number" min={1} value={!lockWidth ? dim : resizedDim()} readOnly={lockWidth}
                onChange={e => !lockWidth && setDim(+e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 outline-none ${!lockWidth ? 'border-orange-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-500' : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`} />
            </div>
          </div>

          {preset === 'custom' && (
            <p className="text-xs text-gray-500 dark:text-gray-400">Using your calculated ratio ({ratioStr}) from the Calculate tab.</p>
          )}
        </div>
      )}

      {/* Common Ratios Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-orange-500" /> Common Aspect Ratios
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-left text-xs text-gray-500 dark:text-gray-400">
                <th className="px-5 py-2.5 font-medium">Ratio</th>
                <th className="px-5 py-2.5 font-medium">Name / Use Case</th>
                <th className="px-5 py-2.5 font-medium hidden sm:table-cell">Example</th>
                <th className="px-5 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {COMMON_RATIOS.map(r => (
                <tr key={`${r.w}:${r.h}`} className="hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-colors cursor-pointer"
                  onClick={() => fillFromRatio(r.w, r.h)}>
                  <td className="px-5 py-3 font-semibold text-orange-600 dark:text-orange-400">{r.w}:{r.h}</td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{r.name} &mdash; {r.use}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell font-mono text-xs">{r.res}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-orange-500 dark:text-orange-400 font-medium">Use</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
