'use client';
import { useState, useMemo } from 'react';

const fmt = (n: number) => '\u20B9' + Math.round(n).toLocaleString('en-IN');

export function SIPCalculatorTool() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const { invested, returns, total } = useMemo(() => {
    const n = years * 12;
    const r = rate / 12 / 100;
    const total = monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const invested = monthly * n;
    return { invested, returns: total - invested, total };
  }, [monthly, rate, years]);

  const returnPct = ((returns / invested) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Monthly SIP (\u20B9)', value: monthly, set: setMonthly, min: 500, max: 1000000, step: 500, display: `\u20B9${monthly.toLocaleString('en-IN')}` },
          { label: 'Expected Return (% p.a.)', value: rate, set: setRate, min: 1, max: 30, step: 0.5, display: `${rate}%` },
          { label: 'Time Period (years)', value: years, set: setYears, min: 1, max: 40, step: 1, display: `${years} yr` },
        ].map(({ label, value, set, min, max, step, display }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{display}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
            <input type="number" value={value} min={min} max={max} step={step} onChange={e => set(parseFloat(e.target.value) || min)} className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="text-sm text-green-200 mb-1">Total Wealth at Maturity</div>
          <div className="text-4xl font-heading font-bold">{fmt(total)}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm text-green-200">Invested</div>
            <div className="font-bold text-xl">{fmt(invested)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm text-green-200">Est. Returns</div>
            <div className="font-bold text-xl">{fmt(returns)}</div>
            <div className="text-xs text-green-300">+{returnPct}%</div>
          </div>
        </div>
        {/* Bar */}
        <div className="mt-4 h-3 bg-green-800 rounded-full overflow-hidden flex">
          <div className="bg-green-300 transition-all" style={{ width: `${(invested / total) * 100}%` }} />
          <div className="bg-yellow-300 flex-1" />
        </div>
        <div className="flex justify-between text-xs text-green-300 mt-1">
          <span>&#9632; Invested {((invested / total) * 100).toFixed(0)}%</span>
          <span>&#9632; Returns {((returns / total) * 100).toFixed(0)}%</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">* Estimates are indicative. Actual returns vary with market conditions. Past performance is not a guarantee of future returns.</p>
    </div>
  );
}
