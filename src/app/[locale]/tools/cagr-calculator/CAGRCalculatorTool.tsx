'use client';
import { useState, useMemo } from 'react';

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

type Mode = 'cagr' | 'future' | 'initial';

const BENCHMARKS = [
  { label: 'FD (Bank)', range: '6-7%', color: 'bg-slate-400' },
  { label: 'Gold', range: '8-10%', color: 'bg-amber-500' },
  { label: 'Nifty 50', range: '12-14%', color: 'bg-blue-500' },
  { label: 'Mid Cap', range: '14-18%', color: 'bg-indigo-500' },
  { label: 'Small Cap', range: '15-22%', color: 'bg-purple-500' },
];

export function CAGRCalculatorTool() {
  const [mode, setMode] = useState<Mode>('cagr');
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(300000);
  const [cagrInput, setCagrInput] = useState(12);
  const [years, setYears] = useState(5);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => {
    switch (mode) {
      case 'cagr': {
        if (initialValue <= 0 || finalValue <= 0 || years <= 0) return null;
        const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
        const absReturn = ((finalValue - initialValue) / initialValue) * 100;
        const totalReturn = finalValue - initialValue;
        const multiplier = finalValue / initialValue;
        return { cagr, absReturn, totalReturn, multiplier, initial: initialValue, final: finalValue, years };
      }
      case 'future': {
        if (initialValue <= 0 || cagrInput <= 0 || years <= 0) return null;
        const fv = initialValue * Math.pow(1 + cagrInput / 100, years);
        const absReturn = ((fv - initialValue) / initialValue) * 100;
        const totalReturn = fv - initialValue;
        const multiplier = fv / initialValue;
        return { cagr: cagrInput, absReturn, totalReturn, multiplier, initial: initialValue, final: fv, years };
      }
      case 'initial': {
        if (finalValue <= 0 || cagrInput <= 0 || years <= 0) return null;
        const iv = finalValue / Math.pow(1 + cagrInput / 100, years);
        const absReturn = ((finalValue - iv) / iv) * 100;
        const totalReturn = finalValue - iv;
        const multiplier = finalValue / iv;
        return { cagr: cagrInput, absReturn, totalReturn, multiplier, initial: iv, final: finalValue, years };
      }
    }
  }, [mode, initialValue, finalValue, cagrInput, years]);

  const schedule = useMemo(() => {
    if (!result) return [];
    const rows = [];
    for (let y = 0; y <= result.years; y++) {
      const value = result.initial * Math.pow(1 + result.cagr / 100, y);
      const growth = y > 0 ? value - result.initial * Math.pow(1 + result.cagr / 100, y - 1) : 0;
      rows.push({ year: y, value, growth, growthPct: y > 0 ? result.cagr : 0 });
    }
    return rows;
  }, [result]);

  const modes: { value: Mode; label: string }[] = [
    { value: 'cagr', label: 'Calculate CAGR' },
    { value: 'future', label: 'Future Value' },
    { value: 'initial', label: 'Initial Value' },
  ];

  const sliderClass = 'w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800';
  const inputClass = 'mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

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

      {/* Inputs */}
      <div className="grid sm:grid-cols-3 gap-4">
        {(mode === 'cagr' || mode === 'future') && (
          <div>
            <div className="flex justify-between mb-1"><label className={labelClass}>Initial Value</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmt(initialValue)}</span></div>
            <input type="range" min={1000} max={1000000000} step={10000} value={initialValue} onChange={e => setInitialValue(+e.target.value)} className={sliderClass} />
            <input type="number" value={initialValue} min={1000} step={1000} onChange={e => setInitialValue(Math.max(1000, +e.target.value || 1000))} className={inputClass} />
          </div>
        )}
        {(mode === 'cagr' || mode === 'initial') && (
          <div>
            <div className="flex justify-between mb-1"><label className={labelClass}>Final Value</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmt(finalValue)}</span></div>
            <input type="range" min={1000} max={1000000000} step={10000} value={finalValue} onChange={e => setFinalValue(+e.target.value)} className={sliderClass} />
            <input type="number" value={finalValue} min={1000} step={1000} onChange={e => setFinalValue(Math.max(1000, +e.target.value || 1000))} className={inputClass} />
          </div>
        )}
        {(mode === 'future' || mode === 'initial') && (
          <div>
            <div className="flex justify-between mb-1"><label className={labelClass}>CAGR (%)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{cagrInput}%</span></div>
            <input type="range" min={1} max={50} step={0.5} value={cagrInput} onChange={e => setCagrInput(+e.target.value)} className={sliderClass} />
            <input type="number" value={cagrInput} min={1} max={50} step={0.5} onChange={e => setCagrInput(Math.max(1, +e.target.value || 1))} className={inputClass} />
          </div>
        )}
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Time Period (years)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{years} yr</span></div>
          <input type="range" min={1} max={50} step={1} value={years} onChange={e => setYears(+e.target.value)} className={sliderClass} />
          <input type="number" value={years} min={1} max={50} onChange={e => setYears(Math.max(1, +e.target.value || 1))} className={inputClass} />
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white">
          <div className="text-center mb-6">
            <div className="text-sm text-indigo-200 mb-1">{mode === 'cagr' ? 'CAGR' : mode === 'future' ? 'Future Value' : 'Required Initial Investment'}</div>
            <div className="text-4xl font-heading font-bold">
              {mode === 'cagr' ? `${result.cagr.toFixed(2)}%` : mode === 'future' ? fmt(result.final) : fmt(result.initial)}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-indigo-200">Initial</div><div className="font-bold">{fmt(result.initial)}</div></div>
            <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-indigo-200">Final</div><div className="font-bold">{fmt(result.final)}</div></div>
            <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-indigo-200">Absolute Return</div><div className="font-bold">{result.absReturn.toFixed(1)}%</div></div>
            <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-indigo-200">Multiplier</div><div className="font-bold">{result.multiplier.toFixed(2)}×</div></div>
          </div>
        </div>
      )}

      {/* Benchmarks */}
      {result && mode === 'cagr' && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">How Your CAGR Compares</h3>
          <div className="space-y-2">
            {BENCHMARKS.map(b => {
              const midRange = parseInt(b.range.split('-')[0]);
              const yourCagr = result.cagr;
              return (
                <div key={b.label} className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${b.color}`} />
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-24">{b.label}</span>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${b.color} rounded-full`} style={{ width: `${Math.min(100, midRange * 3)}%` }} />
                  </div>
                  <span className="text-xs text-slate-500 w-16 text-right">{b.range}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-300" />
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 w-24">Your CAGR</span>
              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, result.cagr * 3)}%` }} />
              </div>
              <span className="text-xs font-bold text-emerald-600 w-16 text-right">{result.cagr.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* What-if */}
      {result && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">What If Scenarios</h3>
          <div className="space-y-1.5">
            {[-5, -2, 0, 2, 5].map(diff => {
              const r = result.cagr + diff;
              const fv = result.initial * Math.pow(1 + r / 100, result.years);
              return (
                <div key={diff} className={`flex justify-between text-sm py-1.5 ${diff === 0 ? 'font-bold text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'}`}>
                  <span>{r.toFixed(1)}% CAGR {diff === 0 ? '(current)' : ''}</span>
                  <span>{fmt(fv)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Year by year */}
      <div>
        <button onClick={() => setShowTable(!showTable)} className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
          {showTable ? 'Hide' : 'Show'} Year-by-Year Growth &rarr;
        </button>
        {showTable && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-96">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                <tr>{['Year', 'Value', 'Growth (₹)', 'Growth (%)'].map(h => <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {schedule.map(row => (
                  <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-2 font-medium text-slate-900 dark:text-slate-100">{row.year}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{fmt(row.value)}</td>
                    <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">{row.growth > 0 ? `+${fmt(row.growth)}` : '—'}</td>
                    <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{row.growthPct > 0 ? `${row.growthPct.toFixed(1)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">* CAGR is a theoretical measure of growth assuming constant returns. Actual investment returns vary year to year. Past performance is not indicative of future results.</p>
    </div>
  );
}
