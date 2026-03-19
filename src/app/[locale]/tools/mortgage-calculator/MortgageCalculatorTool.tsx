'use client';
import { useState, useMemo } from 'react';

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

interface YearRow { year: number; opening: number; emiPaid: number; principalPaid: number; interestPaid: number; closing: number }

export function MortgageCalculatorTool() {
  const [homePrice, setHomePrice] = useState(5000000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [propTax, setPropTax] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [showAmort, setShowAmort] = useState(false);

  const loanAmount = homePrice * (1 - downPct / 100);
  const downPayment = homePrice - loanAmount;

  const { emi, totalPayment, totalInterest, schedule } = useMemo(() => {
    const P = loanAmount;
    const r = rate / 12 / 100;
    const n = years * 12;
    if (P <= 0 || r <= 0 || n <= 0) return { emi: 0, totalPayment: 0, totalInterest: 0, schedule: [] as YearRow[] };
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    const schedule: YearRow[] = [];
    let balance = P;
    for (let y = 1; y <= years; y++) {
      const opening = balance;
      let yearPrincipal = 0, yearInterest = 0;
      for (let m = 0; m < 12; m++) {
        const intPart = balance * r;
        const prinPart = emi - intPart;
        yearInterest += intPart;
        yearPrincipal += prinPart;
        balance -= prinPart;
      }
      schedule.push({ year: y, opening, emiPaid: emi * 12, principalPaid: yearPrincipal, interestPaid: yearInterest, closing: Math.max(0, balance) });
    }
    return { emi, totalPayment, totalInterest, schedule };
  }, [loanAmount, rate, years]);

  const monthlyTax = propTax / 12;
  const monthlyIns = insurance / 12;
  const totalMonthly = emi + monthlyTax + monthlyIns;
  const principalPct = loanAmount > 0 ? (loanAmount / totalPayment) * 100 : 0;

  const sliderClass = 'w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800';
  const inputClass = 'mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Home Price</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmt(homePrice)}</span></div>
          <input type="range" min={500000} max={100000000} step={100000} value={homePrice} onChange={e => setHomePrice(+e.target.value)} className={sliderClass} />
          <input type="number" value={homePrice} min={500000} max={100000000} step={100000} onChange={e => setHomePrice(Math.max(500000, +e.target.value || 500000))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Down Payment (%)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{downPct}% ({fmt(downPayment)})</span></div>
          <input type="range" min={5} max={50} step={1} value={downPct} onChange={e => setDownPct(+e.target.value)} className={sliderClass} />
          <input type="number" value={downPct} min={5} max={50} step={1} onChange={e => setDownPct(Math.max(5, +e.target.value || 5))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Interest Rate (% p.a.)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{rate}%</span></div>
          <input type="range" min={1} max={20} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} className={sliderClass} />
          <input type="number" value={rate} min={1} max={20} step={0.1} onChange={e => setRate(Math.max(0.1, +e.target.value || 1))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Loan Tenure (years)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{years} yr</span></div>
          <input type="range" min={1} max={30} step={1} value={years} onChange={e => setYears(+e.target.value)} className={sliderClass} />
          <input type="number" value={years} min={1} max={30} step={1} onChange={e => setYears(Math.max(1, +e.target.value || 1))} className={inputClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Property Tax (₹/year)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmt(propTax)}</span></div>
          <input type="number" value={propTax} min={0} max={1000000} step={1000} onChange={e => setPropTax(Math.max(0, +e.target.value || 0))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Home Insurance (₹/year)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmt(insurance)}</span></div>
          <input type="number" value={insurance} min={0} max={500000} step={1000} onChange={e => setInsurance(Math.max(0, +e.target.value || 0))} className={inputClass} />
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="text-sm text-blue-200 mb-1">Monthly Payment</div>
          <div className="text-4xl font-heading font-bold">{fmt(totalMonthly)}</div>
          {(monthlyTax > 0 || monthlyIns > 0) && (
            <div className="text-xs text-blue-300 mt-1">EMI {fmt(emi)} + Tax {fmt(monthlyTax)} + Insurance {fmt(monthlyIns)}</div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-blue-200">Loan Amount</div>
            <div className="font-bold text-lg">{fmt(loanAmount)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-blue-200">Total Interest</div>
            <div className="font-bold text-lg">{fmt(totalInterest)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-blue-200">Total Payment</div>
            <div className="font-bold text-lg">{fmt(totalPayment)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-blue-200">Down Payment</div>
            <div className="font-bold text-lg">{fmt(downPayment)}</div>
          </div>
        </div>
        <div className="mt-5 h-4 rounded-full overflow-hidden bg-blue-900 flex">
          <div className="bg-emerald-400 transition-all duration-500" style={{ width: `${principalPct}%` }} />
          <div className="bg-amber-400 flex-1" />
        </div>
        <div className="flex justify-between text-xs mt-1.5 text-blue-300">
          <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-400" /> Principal {principalPct.toFixed(1)}%</span>
          <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-400" /> Interest {(100 - principalPct).toFixed(1)}%</span>
        </div>
      </div>

      {/* Payment Breakdown */}
      {(monthlyTax > 0 || monthlyIns > 0) && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Monthly Payment Breakdown</h3>
          <div className="space-y-2">
            {[
              { label: 'Principal & Interest', value: emi, color: 'bg-blue-500', pct: (emi / totalMonthly) * 100 },
              { label: 'Property Tax', value: monthlyTax, color: 'bg-amber-500', pct: (monthlyTax / totalMonthly) * 100 },
              { label: 'Insurance', value: monthlyIns, color: 'bg-emerald-500', pct: (monthlyIns / totalMonthly) * 100 },
            ].filter(i => i.value > 0).map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                  <span>{item.label}</span><span className="font-medium">{fmt(item.value)} ({item.pct.toFixed(1)}%)</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amortization */}
      <div>
        <button onClick={() => setShowAmort(!showAmort)} className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
          {showAmort ? 'Hide' : 'Show'} Amortization Schedule &rarr;
        </button>
        {showAmort && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-96">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                <tr>
                  {['Year', 'Opening Balance', 'EMI Paid', 'Principal', 'Interest', 'Closing Balance'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {schedule.map(row => (
                  <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-2 text-slate-900 dark:text-slate-100 font-medium">{row.year}</td>
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{fmt(row.opening)}</td>
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{fmt(row.emiPaid)}</td>
                    <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">{fmt(row.principalPaid)}</td>
                    <td className="px-4 py-2 text-amber-600 dark:text-amber-400">{fmt(row.interestPaid)}</td>
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{fmt(row.closing)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">* This calculator provides estimates for planning purposes. Actual mortgage terms depend on the lender, credit score, and market conditions. Consult a financial advisor.</p>
    </div>
  );
}
