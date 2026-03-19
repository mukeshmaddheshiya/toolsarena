'use client';
import { useState, useMemo } from 'react';

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

export function LumpsumCalculatorTool() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(6);
  const [showTable, setShowTable] = useState(false);

  const { futureValue, totalReturns, multiplier, doublingYears, realReturn, schedule } = useMemo(() => {
    const futureValue = principal * Math.pow(1 + rate / 100, years);
    const totalReturns = futureValue - principal;
    const multiplier = principal > 0 ? futureValue / principal : 0;
    const doublingYears = rate > 0 ? (72 / rate).toFixed(1) : '∞';
    const realRate = ((1 + rate / 100) / (1 + inflation / 100) - 1) * 100;
    const realFV = principal * Math.pow(1 + realRate / 100, years);
    const realReturn = realFV - principal;

    const schedule = [];
    for (let y = 1; y <= years; y++) {
      const opening = principal * Math.pow(1 + rate / 100, y - 1);
      const closing = principal * Math.pow(1 + rate / 100, y);
      schedule.push({ year: y, opening, growth: closing - opening, closing });
    }

    return { futureValue, totalReturns, multiplier, doublingYears, realReturn, schedule };
  }, [principal, rate, years, inflation]);

  // SIP comparison: same total invested as monthly SIP
  const sipMonthly = principal / (years * 12);
  const sipFV = useMemo(() => {
    const r = rate / 12 / 100;
    const n = years * 12;
    return sipMonthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  }, [sipMonthly, rate, years]);

  const returnsPct = principal > 0 ? (totalReturns / principal) * 100 : 0;
  const principalPct = futureValue > 0 ? (principal / futureValue) * 100 : 0;

  const sliderClass = 'w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800';
  const inputClass = 'mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Investment Amount</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmt(principal)}</span></div>
          <input type="range" min={1000} max={100000000} step={1000} value={principal} onChange={e => setPrincipal(+e.target.value)} className={sliderClass} />
          <input type="number" value={principal} min={1000} step={1000} onChange={e => setPrincipal(Math.max(1000, +e.target.value || 1000))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Expected Return (% p.a.)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{rate}%</span></div>
          <input type="range" min={1} max={30} step={0.5} value={rate} onChange={e => setRate(+e.target.value)} className={sliderClass} />
          <input type="number" value={rate} min={1} max={30} step={0.5} onChange={e => setRate(Math.max(1, +e.target.value || 1))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Time Period (years)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{years} yr</span></div>
          <input type="range" min={1} max={30} step={1} value={years} onChange={e => setYears(+e.target.value)} className={sliderClass} />
          <input type="number" value={years} min={1} max={30} onChange={e => setYears(Math.max(1, +e.target.value || 1))} className={inputClass} />
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="text-sm text-emerald-200 mb-1">Future Value</div>
          <div className="text-4xl font-heading font-bold">{fmt(futureValue)}</div>
          <div className="text-sm text-emerald-300 mt-1">Your money grew {multiplier.toFixed(1)}×</div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-emerald-200">Invested</div>
            <div className="font-bold text-lg">{fmt(principal)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-emerald-200">Returns</div>
            <div className="font-bold text-lg">{fmt(totalReturns)}</div>
            <div className="text-xs text-emerald-300">+{returnsPct.toFixed(0)}%</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-emerald-200">Doubling Time</div>
            <div className="font-bold text-lg">{doublingYears} yr</div>
            <div className="text-xs text-emerald-300">Rule of 72</div>
          </div>
        </div>
        <div className="mt-5 h-4 rounded-full overflow-hidden bg-green-900 flex">
          <div className="bg-emerald-300 transition-all" style={{ width: `${principalPct}%` }} />
          <div className="bg-yellow-300 flex-1" />
        </div>
        <div className="flex justify-between text-xs mt-1.5 text-emerald-300">
          <span>Investment {principalPct.toFixed(1)}%</span><span>Returns {(100 - principalPct).toFixed(1)}%</span>
        </div>
      </div>

      {/* Lumpsum vs SIP */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Lumpsum vs SIP Comparison</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Same total amount ({fmt(principal)}) invested as lumpsum vs monthly SIP of {fmt(sipMonthly)}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Lumpsum</div>
            <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{fmt(futureValue)}</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="text-xs text-blue-600 dark:text-blue-400">SIP ({fmt(sipMonthly)}/mo)</div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-400">{fmt(sipFV)}</div>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {futureValue > sipFV ? `Lumpsum gives ${fmt(futureValue - sipFV)} more — because entire amount compounds from day 1.` : `SIP gives ${fmt(sipFV - futureValue)} more in this scenario.`}
        </p>
      </div>

      {/* Inflation adjusted */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Inflation-Adjusted Returns</h3>
        <div className="flex items-center gap-3 mb-3">
          <label className="text-sm text-slate-600 dark:text-slate-400">Inflation Rate:</label>
          <input type="number" value={inflation} min={0} max={15} step={0.5} onChange={e => setInflation(Math.max(0, +e.target.value || 0))}
            className="w-20 px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100" />
          <span className="text-sm text-slate-500">%</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-center">
          <div><div className="text-xs text-slate-500 dark:text-slate-400">Nominal Returns</div><div className="text-lg font-bold text-slate-900 dark:text-slate-100">{fmt(totalReturns)}</div></div>
          <div><div className="text-xs text-slate-500 dark:text-slate-400">Real Returns (after inflation)</div><div className="text-lg font-bold text-amber-600 dark:text-amber-400">{fmt(realReturn)}</div></div>
        </div>
      </div>

      {/* Year by year */}
      <div>
        <button onClick={() => setShowTable(!showTable)} className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
          {showTable ? 'Hide' : 'Show'} Year-by-Year Growth &rarr;
        </button>
        {showTable && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-96">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                <tr>{['Year', 'Opening', 'Growth', 'Closing'].map(h => <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {schedule.map(row => (
                  <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-2 font-medium text-slate-900 dark:text-slate-100">{row.year}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{fmt(row.opening)}</td>
                    <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">+{fmt(row.growth)}</td>
                    <td className="px-4 py-2 font-medium text-slate-900 dark:text-slate-100">{fmt(row.closing)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">* Returns are estimated based on the assumed rate of return. Mutual fund and equity investments are subject to market risks. Past performance does not guarantee future results. Consult a financial advisor before investing.</p>
    </div>
  );
}
