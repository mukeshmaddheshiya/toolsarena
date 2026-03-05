'use client';
import { useState, useMemo } from 'react';

type Mode = 'fd' | 'rd';
type Frequency = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

const FREQUENCIES: { value: Frequency; label: string; n: number }[] = [
  { value: 'monthly', label: 'Monthly', n: 12 },
  { value: 'quarterly', label: 'Quarterly', n: 4 },
  { value: 'half-yearly', label: 'Half-Yearly', n: 2 },
  { value: 'yearly', label: 'Yearly', n: 1 },
];

interface YearRow {
  year: number;
  openingBalance: number;
  deposited: number;
  interest: number;
  closingBalance: number;
}

// FD: A = P * (1 + r/n)^(n*t)
function calcFD(principal: number, rate: number, years: number, compFreq: number) {
  const amount = principal * Math.pow(1 + rate / 100 / compFreq, compFreq * years);
  return { amount, interest: amount - principal, invested: principal };
}

// RD: M = R * [(1+r/n)^(n*t) - 1] / (1 - (1+r/n)^(-1/n))  — simplified quarterly approach
// Using iterative approach for accuracy across all compounding frequencies
function calcRD(monthly: number, rate: number, years: number, compFreq: number) {
  const totalMonths = years * 12;
  const r = rate / 100 / compFreq;
  let balance = 0;

  for (let m = 1; m <= totalMonths; m++) {
    balance += monthly;
    // compound at each compounding interval
    if (m % (12 / compFreq) === 0) {
      balance = balance * (1 + r);
    }
  }

  const invested = monthly * totalMonths;
  return { amount: balance, interest: balance - invested, invested };
}

function buildFDBreakdown(principal: number, rate: number, years: number, compFreq: number): YearRow[] {
  const rows: YearRow[] = [];
  let balance = principal;
  for (let y = 1; y <= years; y++) {
    const closing = balance * Math.pow(1 + rate / 100 / compFreq, compFreq);
    rows.push({ year: y, openingBalance: balance, deposited: 0, interest: closing - balance, closingBalance: closing });
    balance = closing;
  }
  return rows;
}

function buildRDBreakdown(monthly: number, rate: number, years: number, compFreq: number): YearRow[] {
  const rows: YearRow[] = [];
  const r = rate / 100 / compFreq;
  let balance = 0;

  for (let y = 1; y <= years; y++) {
    const startBalance = balance;
    let yearDeposit = 0;
    for (let m = 1; m <= 12; m++) {
      balance += monthly;
      yearDeposit += monthly;
      if (((y - 1) * 12 + m) % (12 / compFreq) === 0) {
        balance = balance * (1 + r);
      }
    }
    rows.push({
      year: y,
      openingBalance: startBalance,
      deposited: yearDeposit,
      interest: balance - startBalance - yearDeposit,
      closingBalance: balance,
    });
  }
  return rows;
}

const fmtINR = (n: number) => '\u20B9' + Math.round(n).toLocaleString('en-IN');

export function FdRdCalculatorTool() {
  const [mode, setMode] = useState<Mode>('fd');

  // FD state
  const [fdPrincipal, setFdPrincipal] = useState(500000);
  const [fdRate, setFdRate] = useState(7);
  const [fdYears, setFdYears] = useState(5);
  const [fdFreq, setFdFreq] = useState<Frequency>('quarterly');

  // RD state
  const [rdMonthly, setRdMonthly] = useState(10000);
  const [rdRate, setRdRate] = useState(6.5);
  const [rdYears, setRdYears] = useState(5);
  const [rdFreq, setRdFreq] = useState<Frequency>('quarterly');

  const [showBreakdown, setShowBreakdown] = useState(false);

  const fdCompFreq = FREQUENCIES.find(f => f.value === fdFreq)!.n;
  const rdCompFreq = FREQUENCIES.find(f => f.value === rdFreq)!.n;

  const fdResult = useMemo(() => calcFD(fdPrincipal, fdRate, fdYears, fdCompFreq), [fdPrincipal, fdRate, fdYears, fdCompFreq]);
  const rdResult = useMemo(() => calcRD(rdMonthly, rdRate, rdYears, rdCompFreq), [rdMonthly, rdRate, rdYears, rdCompFreq]);

  const result = mode === 'fd' ? fdResult : rdResult;

  const fdBreakdown = useMemo(
    () => (showBreakdown && mode === 'fd' ? buildFDBreakdown(fdPrincipal, fdRate, fdYears, fdCompFreq) : []),
    [showBreakdown, mode, fdPrincipal, fdRate, fdYears, fdCompFreq],
  );
  const rdBreakdown = useMemo(
    () => (showBreakdown && mode === 'rd' ? buildRDBreakdown(rdMonthly, rdRate, rdYears, rdCompFreq) : []),
    [showBreakdown, mode, rdMonthly, rdRate, rdYears, rdCompFreq],
  );

  const breakdown = mode === 'fd' ? fdBreakdown : rdBreakdown;
  const investedPct = (result.invested / result.amount) * 100;
  const interestPct = (result.interest / result.amount) * 100;

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
        {([
          { value: 'fd' as Mode, label: 'Fixed Deposit (FD)', desc: 'Lump sum investment' },
          { value: 'rd' as Mode, label: 'Recurring Deposit (RD)', desc: 'Monthly investment' },
        ]).map(tab => (
          <button
            key={tab.value}
            onClick={() => { setMode(tab.value); setShowBreakdown(false); }}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              mode === tab.value
                ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <div>{tab.label}</div>
            <div className="text-xs font-normal mt-0.5 opacity-70">{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* FD Inputs */}
      {mode === 'fd' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Deposit Amount</label>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmtINR(fdPrincipal)}</span>
            </div>
            <input type="range" min={5000} max={10000000} step={5000} value={fdPrincipal} onChange={e => setFdPrincipal(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
            <input type="number" value={fdPrincipal} min={1000} max={100000000} step={1000} onChange={e => setFdPrincipal(Math.max(1000, parseFloat(e.target.value) || 1000))} className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Interest Rate (% p.a.)</label>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fdRate}%</span>
            </div>
            <input type="range" min={1} max={15} step={0.1} value={fdRate} onChange={e => setFdRate(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
            <input type="number" value={fdRate} min={0.5} max={20} step={0.1} onChange={e => setFdRate(Math.max(0.1, parseFloat(e.target.value) || 1))} className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tenure (years)</label>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fdYears} yr</span>
            </div>
            <input type="range" min={1} max={20} step={1} value={fdYears} onChange={e => setFdYears(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
            <input type="number" value={fdYears} min={1} max={30} step={1} onChange={e => setFdYears(Math.max(1, parseInt(e.target.value) || 1))} className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Compounding</label>
            <select value={fdFreq} onChange={e => setFdFreq(e.target.value as Frequency)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100">
              {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Banks typically use quarterly</p>
          </div>
        </div>
      )}

      {/* RD Inputs */}
      {mode === 'rd' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Deposit</label>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmtINR(rdMonthly)}</span>
            </div>
            <input type="range" min={500} max={500000} step={500} value={rdMonthly} onChange={e => setRdMonthly(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
            <input type="number" value={rdMonthly} min={100} max={1000000} step={100} onChange={e => setRdMonthly(Math.max(100, parseFloat(e.target.value) || 100))} className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Interest Rate (% p.a.)</label>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{rdRate}%</span>
            </div>
            <input type="range" min={1} max={12} step={0.1} value={rdRate} onChange={e => setRdRate(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
            <input type="number" value={rdRate} min={0.5} max={15} step={0.1} onChange={e => setRdRate(Math.max(0.1, parseFloat(e.target.value) || 1))} className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tenure (years)</label>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{rdYears} yr</span>
            </div>
            <input type="range" min={1} max={10} step={1} value={rdYears} onChange={e => setRdYears(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
            <input type="number" value={rdYears} min={1} max={10} step={1} onChange={e => setRdYears(Math.max(1, parseInt(e.target.value) || 1))} className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Compounding</label>
            <select value={rdFreq} onChange={e => setRdFreq(e.target.value as Frequency)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100">
              {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Banks typically use quarterly</p>
          </div>
        </div>
      )}

      {/* Results Card */}
      <div className={`rounded-2xl p-6 text-white ${
        mode === 'fd'
          ? 'bg-gradient-to-br from-blue-900 to-blue-700'
          : 'bg-gradient-to-br from-emerald-800 to-teal-700'
      }`}>
        <div className="text-center mb-6">
          <div className={`text-sm mb-1 ${mode === 'fd' ? 'text-blue-200' : 'text-emerald-200'}`}>
            {mode === 'fd' ? 'FD Maturity Value' : 'RD Maturity Value'}
          </div>
          <div className="text-4xl font-heading font-bold">{fmtINR(result.amount)}</div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 rounded-xl p-4">
            <div className={`text-sm ${mode === 'fd' ? 'text-blue-200' : 'text-emerald-200'}`}>
              {mode === 'fd' ? 'Deposit' : 'Total Invested'}
            </div>
            <div className="font-bold text-lg">{fmtINR(result.invested)}</div>
            <div className={`text-xs ${mode === 'fd' ? 'text-blue-300' : 'text-emerald-300'}`}>{investedPct.toFixed(1)}%</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className={`text-sm ${mode === 'fd' ? 'text-blue-200' : 'text-emerald-200'}`}>Interest Earned</div>
            <div className="font-bold text-lg">{fmtINR(result.interest)}</div>
            <div className={`text-xs ${mode === 'fd' ? 'text-blue-300' : 'text-emerald-300'}`}>{interestPct.toFixed(1)}%</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className={`text-sm ${mode === 'fd' ? 'text-blue-200' : 'text-emerald-200'}`}>Effective Return</div>
            <div className="font-bold text-lg">{(result.interest / result.invested * 100).toFixed(1)}%</div>
            <div className={`text-xs ${mode === 'fd' ? 'text-blue-300' : 'text-emerald-300'}`}>
              on {mode === 'fd' ? 'deposit' : 'invested'}
            </div>
          </div>
        </div>

        {/* Visual bar */}
        <div className="mt-5 h-4 rounded-full overflow-hidden bg-black/20 flex">
          <div
            className={`transition-all duration-500 rounded-l-full ${mode === 'fd' ? 'bg-blue-300' : 'bg-emerald-300'}`}
            style={{ width: `${investedPct}%` }}
          />
          <div className={`flex-1 rounded-r-full ${mode === 'fd' ? 'bg-amber-300' : 'bg-yellow-300'}`} />
        </div>
        <div className={`flex justify-between text-xs mt-1.5 ${mode === 'fd' ? 'text-blue-300' : 'text-emerald-300'}`}>
          <span className="flex items-center gap-1">
            <span className={`inline-block w-2.5 h-2.5 rounded-sm ${mode === 'fd' ? 'bg-blue-300' : 'bg-emerald-300'}`} />
            {mode === 'fd' ? 'Deposit' : 'Invested'} {investedPct.toFixed(1)}%
          </span>
          <span className="flex items-center gap-1">
            <span className={`inline-block w-2.5 h-2.5 rounded-sm ${mode === 'fd' ? 'bg-amber-300' : 'bg-yellow-300'}`} />
            Interest {interestPct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Quick Comparison — FD rates at different tenures / RD monthly amounts */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
          {mode === 'fd' ? 'Maturity at Different Tenures' : 'Maturity at Different Monthly Amounts'}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 dark:text-slate-400">
                <th className="text-left py-1.5 pr-4">{mode === 'fd' ? 'Tenure' : 'Monthly'}</th>
                <th className="text-right py-1.5 px-3">{mode === 'fd' ? 'Invested' : 'Total Invested'}</th>
                <th className="text-right py-1.5 px-3">Interest</th>
                <th className="text-right py-1.5 pl-3">Maturity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mode === 'fd'
                ? [1, 2, 3, 5, 7, 10].map(y => {
                    const r = calcFD(fdPrincipal, fdRate, y, fdCompFreq);
                    const isActive = y === fdYears;
                    return (
                      <tr key={y} className={isActive ? 'bg-primary-50 dark:bg-primary-900/20 font-medium' : ''}>
                        <td className="py-1.5 pr-4 text-slate-700 dark:text-slate-300">{y} yr{y > 1 ? 's' : ''}</td>
                        <td className="py-1.5 px-3 text-right text-slate-600 dark:text-slate-400">{fmtINR(fdPrincipal)}</td>
                        <td className="py-1.5 px-3 text-right text-emerald-600 dark:text-emerald-400">{fmtINR(r.interest)}</td>
                        <td className="py-1.5 pl-3 text-right text-slate-900 dark:text-slate-100 font-medium">{fmtINR(r.amount)}</td>
                      </tr>
                    );
                  })
                : [2000, 5000, 10000, 20000, 50000].map(m => {
                    const r = calcRD(m, rdRate, rdYears, rdCompFreq);
                    const isActive = m === rdMonthly;
                    return (
                      <tr key={m} className={isActive ? 'bg-primary-50 dark:bg-primary-900/20 font-medium' : ''}>
                        <td className="py-1.5 pr-4 text-slate-700 dark:text-slate-300">{fmtINR(m)}/mo</td>
                        <td className="py-1.5 px-3 text-right text-slate-600 dark:text-slate-400">{fmtINR(r.invested)}</td>
                        <td className="py-1.5 px-3 text-right text-emerald-600 dark:text-emerald-400">{fmtINR(r.interest)}</td>
                        <td className="py-1.5 pl-3 text-right text-slate-900 dark:text-slate-100 font-medium">{fmtINR(r.amount)}</td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Year-by-Year Breakdown */}
      <div>
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline"
        >
          {showBreakdown ? 'Hide' : 'Show'} Year-by-Year Breakdown &rarr;
        </button>
        {showBreakdown && breakdown.length > 0 && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-96">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                <tr>
                  {['Year', 'Opening', ...(mode === 'rd' ? ['Deposited'] : []), 'Interest', 'Closing'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {breakdown.map(row => (
                  <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-2 text-slate-900 dark:text-slate-100 font-medium">{row.year}</td>
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{fmtINR(row.openingBalance)}</td>
                    {mode === 'rd' && (
                      <td className="px-4 py-2 text-blue-600 dark:text-blue-400">{fmtINR(row.deposited)}</td>
                    )}
                    <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400 font-medium">+{fmtINR(row.interest)}</td>
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300 font-medium">{fmtINR(row.closingBalance)}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <td className="px-4 py-2.5 text-slate-900 dark:text-slate-100">Total</td>
                  <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{fmtINR(mode === 'fd' ? fdPrincipal : 0)}</td>
                  {mode === 'rd' && (
                    <td className="px-4 py-2.5 text-blue-600 dark:text-blue-400">{fmtINR(result.invested)}</td>
                  )}
                  <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400">+{fmtINR(result.interest)}</td>
                  <td className="px-4 py-2.5 text-slate-900 dark:text-slate-100">{fmtINR(result.amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        * Calculations are based on the standard {mode === 'fd' ? 'FD' : 'RD'} interest formula with{' '}
        {mode === 'fd' ? fdFreq : rdFreq} compounding. Actual returns may vary by bank. TDS may be applicable
        on interest exceeding {fmtINR(40000)}/year (or {fmtINR(50000)} for senior citizens). Consult your bank for exact rates.
      </p>
    </div>
  );
}
