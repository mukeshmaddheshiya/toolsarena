'use client';
import { useState, useMemo } from 'react';

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

interface YearRow { year: number; age: number; deposit: number; interest: number; balance: number }

export function SukanyaSamriddhiCalculatorTool() {
  const [yearlyInvestment, setYearlyInvestment] = useState(150000);
  const [girlAge, setGirlAge] = useState(5);
  const [interestRate, setInterestRate] = useState(8.2);
  const [showTable, setShowTable] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const { totalInvestment, maturityValue, totalInterest, schedule, maturityAge } = useMemo(() => {
    const depositYears = 15;
    const maturityYears = 21;
    const r = interestRate / 100;
    let balance = 0;
    const schedule: YearRow[] = [];

    for (let y = 1; y <= maturityYears; y++) {
      const deposit = y <= depositYears ? yearlyInvestment : 0;
      balance += deposit;
      const interest = balance * r;
      balance += interest;
      schedule.push({ year: y, age: girlAge + y, deposit, interest, balance });
    }

    const totalInvestment = yearlyInvestment * depositYears;
    return { totalInvestment, maturityValue: balance, totalInterest: balance - totalInvestment, schedule, maturityAge: girlAge + maturityYears };
  }, [yearlyInvestment, girlAge, interestRate]);

  const interestPct = maturityValue > 0 ? (totalInterest / maturityValue) * 100 : 0;
  const investPct = 100 - interestPct;
  const taxSaved80C = Math.min(yearlyInvestment, 150000);

  const sliderClass = 'w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800';
  const inputClass = 'mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Yearly Investment</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmt(yearlyInvestment)}</span></div>
          <input type="range" min={250} max={150000} step={1000} value={yearlyInvestment} onChange={e => setYearlyInvestment(+e.target.value)} className={sliderClass} />
          <input type="number" value={yearlyInvestment} min={250} max={150000} step={1000} onChange={e => setYearlyInvestment(Math.max(250, Math.min(150000, +e.target.value || 250)))} className={inputClass} />
          <p className="mt-1 text-xs text-slate-400">Min ₹250 — Max ₹1,50,000/year</p>
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Girl&apos;s Current Age</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{girlAge} years</span></div>
          <input type="range" min={0} max={10} value={girlAge} onChange={e => setGirlAge(+e.target.value)} className={sliderClass} />
          <input type="number" value={girlAge} min={0} max={10} onChange={e => setGirlAge(Math.max(0, Math.min(10, +e.target.value || 0)))} className={inputClass} />
          <p className="mt-1 text-xs text-slate-400">Account for girls below 10 years</p>
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Interest Rate (% p.a.)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{interestRate}%</span></div>
          <input type="range" min={6} max={10} step={0.1} value={interestRate} onChange={e => setInterestRate(+e.target.value)} className={sliderClass} />
          <input type="number" value={interestRate} min={6} max={10} step={0.1} onChange={e => setInterestRate(Math.max(6, +e.target.value || 6))} className={inputClass} />
          <p className="mt-1 text-xs text-slate-400">Current rate: 8.2% p.a.</p>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-pink-600 to-rose-700 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="text-sm text-pink-200 mb-1">Maturity Value (at age {maturityAge})</div>
          <div className="text-4xl font-heading font-bold">{fmt(maturityValue)}</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-pink-200">Total Investment</div>
            <div className="font-bold text-lg">{fmt(totalInvestment)}</div>
            <div className="text-xs text-pink-300">15 years</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-pink-200">Interest Earned</div>
            <div className="font-bold text-lg">{fmt(totalInterest)}</div>
            <div className="text-xs text-pink-300">{interestPct.toFixed(1)}% of maturity</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-pink-200">Wealth Multiplier</div>
            <div className="font-bold text-lg">{(maturityValue / totalInvestment).toFixed(1)}×</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-pink-200">Maturity Year</div>
            <div className="font-bold text-lg">{new Date().getFullYear() + (21 - 0)}</div>
          </div>
        </div>
        <div className="mt-5 h-4 rounded-full overflow-hidden bg-pink-900 flex">
          <div className="bg-pink-300 transition-all" style={{ width: `${investPct}%` }} />
          <div className="bg-yellow-300 flex-1" />
        </div>
        <div className="flex justify-between text-xs mt-1.5 text-pink-300">
          <span>Investment {investPct.toFixed(1)}%</span><span>Interest {interestPct.toFixed(1)}%</span>
        </div>
      </div>

      {/* Tax Benefits */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
        <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Tax Benefits (EEE Status)</h3>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Section 80C Deduction</div>
            <div className="font-bold text-emerald-700 dark:text-emerald-400">{fmt(taxSaved80C)}/yr</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Interest Earned</div>
            <div className="font-bold text-emerald-700 dark:text-emerald-400">Tax Free</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Maturity Amount</div>
            <div className="font-bold text-emerald-700 dark:text-emerald-400">Tax Free</div>
          </div>
        </div>
      </div>

      {/* SSY Rules */}
      <div>
        <button onClick={() => setShowRules(!showRules)} className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
          {showRules ? 'Hide' : 'Show'} SSY Rules &rarr;
        </button>
        {showRules && (
          <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <p><strong className="text-slate-900 dark:text-slate-100">Eligibility:</strong> Girl child below 10 years of age</p>
            <p><strong className="text-slate-900 dark:text-slate-100">Deposit Period:</strong> First 15 years from account opening</p>
            <p><strong className="text-slate-900 dark:text-slate-100">Maturity:</strong> 21 years from account opening</p>
            <p><strong className="text-slate-900 dark:text-slate-100">Min/Max Deposit:</strong> ₹250/year — ₹1,50,000/year</p>
            <p><strong className="text-slate-900 dark:text-slate-100">Partial Withdrawal:</strong> 50% allowed after girl turns 18 (for education/marriage)</p>
            <p><strong className="text-slate-900 dark:text-slate-100">Accounts per family:</strong> Maximum 2 daughters (3 if twins)</p>
          </div>
        )}
      </div>

      {/* Year-by-year */}
      <div>
        <button onClick={() => setShowTable(!showTable)} className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
          {showTable ? 'Hide' : 'Show'} Year-by-Year Growth &rarr;
        </button>
        {showTable && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-96">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                <tr>{['Year', 'Age', 'Deposit', 'Interest', 'Balance'].map(h => <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {schedule.map(row => (
                  <tr key={row.year} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${row.deposit === 0 ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`}>
                    <td className="px-4 py-2 font-medium text-slate-900 dark:text-slate-100">{row.year}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{row.age}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{row.deposit > 0 ? fmt(row.deposit) : '—'}</td>
                    <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">+{fmt(row.interest)}</td>
                    <td className="px-4 py-2 font-medium text-slate-900 dark:text-slate-100">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">* SSY interest rate is revised quarterly by the Government of India. Current rate: 8.2% p.a. (subject to change). Calculator provides estimates based on assumed constant rate. Verify current rates at your nearest post office or bank.</p>
    </div>
  );
}
