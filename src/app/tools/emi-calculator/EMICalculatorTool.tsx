'use client';
import { useState, useMemo } from 'react';

function calcEMI(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100;
  if (r === 0) return { emi: principal / months, totalAmount: principal, totalInterest: 0 };
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalAmount = emi * months;
  const totalInterest = totalAmount - principal;
  return { emi, totalAmount, totalInterest };
}

function buildAmortization(principal: number, annualRate: number, months: number, emi: number) {
  const r = annualRate / 12 / 100;
  let balance = principal;
  const rows = [];
  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);
    rows.push({ month: i, emi: emi, principal: principalPaid, interest, balance });
  }
  return rows;
}

const fmt = (n: number) => '\u20B9' + Math.round(n).toLocaleString('en-IN');

export function EMICalculatorTool() {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [showAmort, setShowAmort] = useState(false);

  const months = years * 12;
  const { emi, totalAmount, totalInterest } = useMemo(() => calcEMI(principal, rate, months), [principal, rate, months]);
  const amortization = useMemo(() => showAmort ? buildAmortization(principal, rate, months, emi) : [], [showAmort, principal, rate, months, emi]);

  const principalPct = ((principal / totalAmount) * 100).toFixed(1);
  const interestPct = ((totalInterest / totalAmount) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Loan Amount (\u20B9)', value: principal, set: setPrincipal, min: 10000, max: 100000000, step: 10000, fmt: (v: number) => '\u20B9' + v.toLocaleString('en-IN') },
          { label: 'Interest Rate (% p.a.)', value: rate, set: setRate, min: 1, max: 30, step: 0.1, fmt: (v: number) => v + '%' },
          { label: 'Loan Tenure (years)', value: years, set: setYears, min: 1, max: 30, step: 1, fmt: (v: number) => v + ' yr' },
        ].map(({ label, value, set, min, max, step, fmt: f }) => (
          <div key={label}>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{f(value)}</span>
            </div>
            <input
              type="range" min={min} max={max} step={step} value={value}
              onChange={e => set(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
            />
            <input
              type="number" value={value} min={min} max={max} step={step}
              onChange={e => set(parseFloat(e.target.value) || min)}
              className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
            />
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="text-sm text-primary-200 mb-1">Monthly EMI</div>
          <div className="text-4xl font-heading font-bold">{fmt(emi)}</div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-primary-200">Principal</div>
            <div className="font-bold">{fmt(principal)}</div>
            <div className="text-xs text-primary-300">{principalPct}%</div>
          </div>
          <div>
            <div className="text-sm text-primary-200">Total Interest</div>
            <div className="font-bold">{fmt(totalInterest)}</div>
            <div className="text-xs text-primary-300">{interestPct}%</div>
          </div>
          <div>
            <div className="text-sm text-primary-200">Total Amount</div>
            <div className="font-bold">{fmt(totalAmount)}</div>
            <div className="text-xs text-primary-300">over {years} yrs</div>
          </div>
        </div>
        {/* Visual bar */}
        <div className="mt-4 h-3 rounded-full overflow-hidden bg-primary-900 flex">
          <div className="bg-green-400 transition-all duration-500" style={{ width: `${principalPct}%` }} />
          <div className="bg-red-400 flex-1" />
        </div>
        <div className="flex justify-between text-xs mt-1 text-primary-300">
          <span>&#9632; Principal {principalPct}%</span>
          <span>&#9632; Interest {interestPct}%</span>
        </div>
      </div>

      {/* Amortization */}
      <div>
        <button onClick={() => setShowAmort(!showAmort)} className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
          {showAmort ? 'Hide' : 'Show'} Amortization Schedule &rarr;
        </button>
        {showAmort && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-80">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                <tr>
                  {['Month', 'EMI', 'Principal', 'Interest', 'Balance'].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {amortization.map(row => (
                  <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-3 py-1.5 text-slate-900 dark:text-slate-100">{row.month}</td>
                    <td className="px-3 py-1.5 text-slate-700 dark:text-slate-300">{fmt(row.emi)}</td>
                    <td className="px-3 py-1.5 text-green-600 dark:text-green-400">{fmt(row.principal)}</td>
                    <td className="px-3 py-1.5 text-red-600 dark:text-red-400">{fmt(row.interest)}</td>
                    <td className="px-3 py-1.5 text-slate-700 dark:text-slate-300">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
