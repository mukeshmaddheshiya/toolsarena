'use client';
import { useState, useMemo } from 'react';

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

type Mode = 'interest' | 'principal' | 'rate' | 'time';
type TimeUnit = 'years' | 'months' | 'days';

export function SimpleInterestCalculatorTool() {
  const [mode, setMode] = useState<Mode>('interest');
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [time, setTime] = useState(5);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('years');
  const [siAmount, setSiAmount] = useState(40000);
  const [showTable, setShowTable] = useState(false);

  const timeInYears = timeUnit === 'years' ? time : timeUnit === 'months' ? time / 12 : time / 365;

  const result = useMemo(() => {
    switch (mode) {
      case 'interest': {
        const si = (principal * rate * timeInYears) / 100;
        const total = principal + si;
        const monthlyInterest = si / (timeInYears * 12 || 1);
        return { si, total, principal, rate, time: timeInYears, monthlyInterest };
      }
      case 'principal': {
        const p = rate > 0 && timeInYears > 0 ? (siAmount * 100) / (rate * timeInYears) : 0;
        return { si: siAmount, total: p + siAmount, principal: p, rate, time: timeInYears, monthlyInterest: siAmount / (timeInYears * 12 || 1) };
      }
      case 'rate': {
        const r = principal > 0 && timeInYears > 0 ? (siAmount * 100) / (principal * timeInYears) : 0;
        return { si: siAmount, total: principal + siAmount, principal, rate: r, time: timeInYears, monthlyInterest: siAmount / (timeInYears * 12 || 1) };
      }
      case 'time': {
        const t = principal > 0 && rate > 0 ? (siAmount * 100) / (principal * rate) : 0;
        return { si: siAmount, total: principal + siAmount, principal, rate, time: t, monthlyInterest: t > 0 ? siAmount / (t * 12) : 0 };
      }
    }
  }, [mode, principal, rate, timeInYears, siAmount, time]);

  // Compound interest comparison
  const ci = useMemo(() => {
    const amount = result.principal * Math.pow(1 + result.rate / 100, result.time);
    return amount - result.principal;
  }, [result]);

  const ciAdvantage = ci - result.si;

  const schedule = useMemo(() => {
    const years = Math.ceil(result.time);
    const yearlyInterest = (result.principal * result.rate) / 100;
    return Array.from({ length: years }, (_, i) => ({
      year: i + 1,
      opening: result.principal + yearlyInterest * i,
      interest: yearlyInterest,
      closing: result.principal + yearlyInterest * (i + 1),
    }));
  }, [result]);

  const modes: { value: Mode; label: string }[] = [
    { value: 'interest', label: 'Calculate Interest' },
    { value: 'principal', label: 'Find Principal' },
    { value: 'rate', label: 'Find Rate' },
    { value: 'time', label: 'Find Time' },
  ];

  const sliderClass = 'w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800';
  const inputClass = 'mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button key={m.value} onClick={() => setMode(m.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m.value ? 'bg-primary-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mode !== 'principal' && (
          <div>
            <div className="flex justify-between mb-1"><label className={labelClass}>Principal</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmt(principal)}</span></div>
            <input type="range" min={1000} max={10000000} step={1000} value={principal} onChange={e => setPrincipal(+e.target.value)} className={sliderClass} />
            <input type="number" value={principal} min={1000} step={1000} onChange={e => setPrincipal(Math.max(1000, +e.target.value || 1000))} className={inputClass} />
          </div>
        )}
        {mode !== 'rate' && (
          <div>
            <div className="flex justify-between mb-1"><label className={labelClass}>Rate (% p.a.)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{rate}%</span></div>
            <input type="range" min={0.1} max={30} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} className={sliderClass} />
            <input type="number" value={rate} min={0.1} max={30} step={0.1} onChange={e => setRate(Math.max(0.1, +e.target.value || 0.1))} className={inputClass} />
          </div>
        )}
        {mode !== 'time' && (
          <div>
            <div className="flex justify-between mb-1"><label className={labelClass}>Time Period</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{time} {timeUnit}</span></div>
            <input type="range" min={1} max={timeUnit === 'years' ? 30 : timeUnit === 'months' ? 360 : 3650} step={1} value={time} onChange={e => setTime(+e.target.value)} className={sliderClass} />
            <div className="flex gap-2 mt-2">
              <input type="number" value={time} min={1} onChange={e => setTime(Math.max(1, +e.target.value || 1))} className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100" />
              <select value={timeUnit} onChange={e => setTimeUnit(e.target.value as TimeUnit)} className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100">
                <option value="years">Years</option><option value="months">Months</option><option value="days">Days</option>
              </select>
            </div>
          </div>
        )}
        {mode !== 'interest' && (
          <div>
            <div className="flex justify-between mb-1"><label className={labelClass}>Interest Amount</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmt(siAmount)}</span></div>
            <input type="range" min={100} max={10000000} step={100} value={siAmount} onChange={e => setSiAmount(+e.target.value)} className={sliderClass} />
            <input type="number" value={siAmount} min={100} step={100} onChange={e => setSiAmount(Math.max(100, +e.target.value || 100))} className={inputClass} />
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="text-sm text-cyan-200 mb-1">Total Amount</div>
          <div className="text-4xl font-heading font-bold">{fmt(result.total)}</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-cyan-200">{mode === 'principal' ? 'Required Principal' : 'Principal'}</div>
            <div className="font-bold text-lg">{fmt(result.principal)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-cyan-200">Simple Interest</div>
            <div className="font-bold text-lg">{fmt(result.si)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-cyan-200">{mode === 'rate' ? 'Required Rate' : 'Rate'}</div>
            <div className="font-bold text-lg">{result.rate.toFixed(2)}% p.a.</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-cyan-200">{mode === 'time' ? 'Required Time' : 'Monthly Interest'}</div>
            <div className="font-bold text-lg">{mode === 'time' ? `${result.time.toFixed(1)} yr` : fmt(result.monthlyInterest)}</div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Formula</h3>
        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-700 dark:text-slate-300 text-center">
          SI = (P × R × T) / 100 = ({fmt(result.principal)} × {result.rate.toFixed(1)}% × {result.time.toFixed(1)}) / 100 = {fmt(result.si)}
        </div>
      </div>

      {/* SI vs CI Comparison */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Simple vs Compound Interest</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div><div className="text-xs text-slate-500 dark:text-slate-400">Simple Interest</div><div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{fmt(result.si)}</div></div>
          <div><div className="text-xs text-slate-500 dark:text-slate-400">Compound Interest</div><div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{fmt(ci)}</div></div>
          <div><div className="text-xs text-slate-500 dark:text-slate-400">CI Advantage</div><div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">+{fmt(ciAdvantage)}</div></div>
        </div>
        <div className="mt-4 space-y-2">
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1"><span>SI: {fmt(result.principal + result.si)}</span></div>
            <div className="h-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${ci > 0 ? ((result.si / ci) * 100) : 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1"><span>CI: {fmt(result.principal + ci)}</span></div>
            <div className="h-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Year by year */}
      {mode === 'interest' && (
        <div>
          <button onClick={() => setShowTable(!showTable)} className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
            {showTable ? 'Hide' : 'Show'} Year-by-Year Breakdown &rarr;
          </button>
          {showTable && (
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-96">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                  <tr>{['Year', 'Opening', 'Interest', 'Closing'].map(h => <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {schedule.map(row => (
                    <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-2 font-medium text-slate-900 dark:text-slate-100">{row.year}</td>
                      <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{fmt(row.opening)}</td>
                      <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">+{fmt(row.interest)}</td>
                      <td className="px-4 py-2 font-medium text-slate-900 dark:text-slate-100">{fmt(row.closing)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500">* This calculator provides estimates for educational purposes. Actual interest may vary based on the financial institution&apos;s terms and calculation methods.</p>
    </div>
  );
}
