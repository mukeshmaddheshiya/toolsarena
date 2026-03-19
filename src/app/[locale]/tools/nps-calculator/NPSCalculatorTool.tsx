'use client';
import { useState, useMemo } from 'react';

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

interface YearRow { year: number; age: number; deposit: number; interest: number; balance: number }

export function NPSCalculatorTool() {
  const [monthly, setMonthly] = useState(5000);
  const [currentAge, setCurrentAge] = useState(30);
  const [returnRate, setReturnRate] = useState(10);
  const [annuityPct, setAnnuityPct] = useState(40);
  const [annuityRate, setAnnuityRate] = useState(6);
  const [showTable, setShowTable] = useState(false);

  const retirementAge = 60;
  const investmentYears = Math.max(0, retirementAge - currentAge);

  const { totalInvestment, corpus, lumpSum, annuityCorpus, monthlyPension, schedule } = useMemo(() => {
    const yearly = monthly * 12;
    const totalInvestment = yearly * investmentYears;
    const r = returnRate / 100;
    let balance = 0;
    const schedule: YearRow[] = [];
    for (let y = 1; y <= investmentYears; y++) {
      const interest = balance * r;
      balance = balance + yearly + interest;
      schedule.push({ year: y, age: currentAge + y, deposit: yearly, interest, balance });
    }
    const corpus = balance;
    const annuityCorpus = corpus * (annuityPct / 100);
    const lumpSum = corpus - annuityCorpus;
    const monthlyPension = (annuityCorpus * (annuityRate / 100)) / 12;
    return { totalInvestment, corpus, lumpSum, annuityCorpus, monthlyPension, schedule };
  }, [monthly, currentAge, returnRate, annuityPct, annuityRate, investmentYears]);

  const wealthGained = corpus - totalInvestment;
  const investPct = totalInvestment > 0 && corpus > 0 ? (totalInvestment / corpus) * 100 : 0;
  const taxBenefit80C = Math.min(monthly * 12, 150000);
  const taxBenefit1B = Math.min(monthly * 12, 50000);

  const sliderClass = 'w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800';
  const inputClass = 'mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Monthly Contribution</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmt(monthly)}</span></div>
          <input type="range" min={500} max={150000} step={500} value={monthly} onChange={e => setMonthly(+e.target.value)} className={sliderClass} />
          <input type="number" value={monthly} min={500} max={150000} step={500} onChange={e => setMonthly(Math.max(500, +e.target.value || 500))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Current Age</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{currentAge} yr (retire at 60)</span></div>
          <input type="range" min={18} max={59} value={currentAge} onChange={e => setCurrentAge(+e.target.value)} className={sliderClass} />
          <input type="number" value={currentAge} min={18} max={59} onChange={e => setCurrentAge(Math.max(18, Math.min(59, +e.target.value || 18)))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Expected Return (% p.a.)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{returnRate}%</span></div>
          <input type="range" min={8} max={14} step={0.5} value={returnRate} onChange={e => setReturnRate(+e.target.value)} className={sliderClass} />
          <input type="number" value={returnRate} min={1} max={20} step={0.5} onChange={e => setReturnRate(Math.max(1, +e.target.value || 1))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Annuity Purchase (%)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{annuityPct}%</span></div>
          <input type="range" min={40} max={100} step={5} value={annuityPct} onChange={e => setAnnuityPct(+e.target.value)} className={sliderClass} />
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Minimum 40% mandatory</p>
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Expected Annuity Rate (%)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{annuityRate}%</span></div>
          <input type="range" min={1} max={10} step={0.5} value={annuityRate} onChange={e => setAnnuityRate(+e.target.value)} className={sliderClass} />
          <input type="number" value={annuityRate} min={1} max={10} step={0.5} onChange={e => setAnnuityRate(Math.max(1, +e.target.value || 1))} className={inputClass} />
        </div>
        <div className="flex items-center justify-center">
          <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full">
            <div className="text-xs text-slate-500 dark:text-slate-400">Investment Period</div>
            <div className="text-2xl font-bold text-primary-700 dark:text-primary-400">{investmentYears} years</div>
            <div className="text-xs text-slate-400">Age {currentAge} → 60</div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="text-sm text-blue-200 mb-1">Total Corpus at 60</div>
          <div className="text-4xl font-heading font-bold">{fmt(corpus)}</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-blue-200">Monthly Pension</div>
            <div className="font-bold text-lg">{fmt(monthlyPension)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-blue-200">Lump Sum (tax-free)</div>
            <div className="font-bold text-lg">{fmt(lumpSum)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-blue-200">Total Investment</div>
            <div className="font-bold text-lg">{fmt(totalInvestment)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-blue-200">Wealth Gained</div>
            <div className="font-bold text-lg">{fmt(wealthGained)}</div>
          </div>
        </div>
        <div className="mt-5 h-4 rounded-full overflow-hidden bg-blue-950 flex">
          <div className="bg-emerald-400 transition-all" style={{ width: `${investPct}%` }} />
          <div className="bg-amber-400 flex-1" />
        </div>
        <div className="flex justify-between text-xs mt-1.5 text-blue-300">
          <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-400" /> Invested {investPct.toFixed(1)}%</span>
          <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-400" /> Returns {(100 - investPct).toFixed(1)}%</span>
        </div>
      </div>

      {/* Corpus Split */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Corpus Split at Retirement</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Lump Sum Withdrawal ({100 - annuityPct}%)</div>
            <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{fmt(lumpSum)}</div>
            <div className="text-xs text-emerald-500">Tax-free</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="text-xs text-blue-600 dark:text-blue-400">Annuity Corpus ({annuityPct}%)</div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-400">{fmt(annuityCorpus)}</div>
            <div className="text-xs text-blue-500">→ {fmt(monthlyPension)}/month pension</div>
          </div>
        </div>
      </div>

      {/* Tax Benefits */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Tax Benefits</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">Sec 80CCD(1) — within 80C limit</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{fmt(taxBenefit80C)}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">Sec 80CCD(1B) — additional</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{fmt(taxBenefit1B)}</span>
          </div>
        </div>
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
                  <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-2 font-medium text-slate-900 dark:text-slate-100">{row.year}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{row.age}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{fmt(row.deposit)}</td>
                    <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">+{fmt(row.interest)}</td>
                    <td className="px-4 py-2 font-medium text-slate-900 dark:text-slate-100">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">* NPS returns are market-linked and not guaranteed. The calculator provides estimates based on assumed rates. Actual returns may vary. Minimum 40% annuity purchase is mandatory. Consult a PFRDA-registered advisor.</p>
    </div>
  );
}
