'use client';
import { useState, useMemo } from 'react';

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

interface YearRow { year: number; opening: number; emiPaid: number; principal: number; interest: number; closing: number }

export function HomeLoanEMICalculatorTool() {
  const [propValue, setPropValue] = useState(5000000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [processingFee, setProcessingFee] = useState(1);
  const [prepayment, setPrepayment] = useState(0);
  const [showAmort, setShowAmort] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  const loanAmount = propValue * (1 - downPct / 100);

  const { emi, totalPayment, totalInterest, schedule, prepaymentSavings, monthsReduced } = useMemo(() => {
    const P = loanAmount;
    const r = rate / 12 / 100;
    const n = years * 12;
    if (P <= 0 || r <= 0 || n <= 0) return { emi: 0, totalPayment: 0, totalInterest: 0, schedule: [] as YearRow[], prepaymentSavings: 0, monthsReduced: 0 };
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

    // Without prepayment
    const totalPaymentNoPre = emi * n;
    const totalInterestNoPre = totalPaymentNoPre - P;

    // With prepayment - build amortization
    const schedule: YearRow[] = [];
    let balance = P;
    let totalPaid = 0;
    let actualMonths = 0;
    for (let y = 1; y <= years && balance > 0; y++) {
      const opening = balance;
      let yearPrincipal = 0, yearInterest = 0, yearEmi = 0;
      for (let m = 0; m < 12 && balance > 0; m++) {
        const intPart = balance * r;
        const prinPart = emi - intPart + prepayment;
        yearInterest += intPart;
        yearPrincipal += Math.min(prinPart, balance);
        yearEmi += emi + prepayment;
        balance = Math.max(0, balance - (emi - intPart) - prepayment);
        totalPaid += emi + prepayment;
        actualMonths++;
      }
      schedule.push({ year: y, opening, emiPaid: yearEmi, principal: yearPrincipal, interest: yearInterest, closing: balance });
    }

    const totalInterest = totalPaid - P;
    const prepaymentSavings = prepayment > 0 ? totalInterestNoPre - totalInterest : 0;
    const monthsReduced = prepayment > 0 ? n - actualMonths : 0;

    return { emi, totalPayment: totalPaid, totalInterest, schedule, prepaymentSavings: Math.max(0, prepaymentSavings), monthsReduced: Math.max(0, monthsReduced) };
  }, [loanAmount, rate, years, prepayment]);

  const fee = loanAmount * (processingFee / 100);
  const principalPct = loanAmount > 0 && totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 0;
  const maxLoanEligible = monthlyIncome > 0 ? (monthlyIncome * 0.4) * (Math.pow(1 + rate / 12 / 100, years * 12) - 1) / (rate / 12 / 100 * Math.pow(1 + rate / 12 / 100, years * 12)) : 0;

  const sliderClass = 'w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800';
  const inputClass = 'mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Property Value</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmt(propValue)}</span></div>
          <input type="range" min={500000} max={100000000} step={100000} value={propValue} onChange={e => setPropValue(+e.target.value)} className={sliderClass} />
          <input type="number" value={propValue} min={500000} step={100000} onChange={e => setPropValue(Math.max(500000, +e.target.value || 500000))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Down Payment (%)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{downPct}% = {fmt(propValue * downPct / 100)}</span></div>
          <input type="range" min={5} max={50} step={1} value={downPct} onChange={e => setDownPct(+e.target.value)} className={sliderClass} />
          <input type="number" value={downPct} min={5} max={50} onChange={e => setDownPct(Math.max(5, +e.target.value || 5))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Interest Rate (% p.a.)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{rate}%</span></div>
          <input type="range" min={5} max={15} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} className={sliderClass} />
          <input type="number" value={rate} min={5} max={15} step={0.1} onChange={e => setRate(Math.max(1, +e.target.value || 5))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Loan Tenure (years)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{years} yr</span></div>
          <input type="range" min={1} max={30} step={1} value={years} onChange={e => setYears(+e.target.value)} className={sliderClass} />
          <input type="number" value={years} min={1} max={30} onChange={e => setYears(Math.max(1, +e.target.value || 1))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Processing Fee (%)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{processingFee}% = {fmt(fee)}</span></div>
          <input type="range" min={0} max={3} step={0.25} value={processingFee} onChange={e => setProcessingFee(+e.target.value)} className={sliderClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Monthly Prepayment</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmt(prepayment)}</span></div>
          <input type="range" min={0} max={100000} step={1000} value={prepayment} onChange={e => setPrepayment(+e.target.value)} className={sliderClass} />
          <input type="number" value={prepayment} min={0} step={1000} onChange={e => setPrepayment(Math.max(0, +e.target.value || 0))} className={inputClass} />
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-sky-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="text-sm text-sky-200 mb-1">Monthly EMI</div>
          <div className="text-4xl font-heading font-bold">{fmt(emi)}</div>
          {prepayment > 0 && <div className="text-sm text-sky-300 mt-1">+ {fmt(prepayment)} prepayment = {fmt(emi + prepayment)}/mo</div>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-sky-200">Loan Amount</div><div className="font-bold text-lg">{fmt(loanAmount)}</div></div>
          <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-sky-200">Total Interest</div><div className="font-bold text-lg">{fmt(totalInterest)}</div></div>
          <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-sky-200">Total Payment</div><div className="font-bold text-lg">{fmt(totalPayment)}</div></div>
          <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-sky-200">Processing Fee</div><div className="font-bold text-lg">{fmt(fee)}</div></div>
        </div>
        <div className="mt-5 h-4 rounded-full overflow-hidden bg-sky-900 flex">
          <div className="bg-emerald-400 transition-all" style={{ width: `${principalPct}%` }} />
          <div className="bg-amber-400 flex-1" />
        </div>
        <div className="flex justify-between text-xs mt-1.5 text-sky-300">
          <span>Principal {principalPct.toFixed(1)}%</span>
          <span>Interest {(100 - principalPct).toFixed(1)}%</span>
        </div>
      </div>

      {/* Prepayment Savings */}
      {prepayment > 0 && prepaymentSavings > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
          <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Prepayment Savings</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-center">
            <div><div className="text-xs text-emerald-600 dark:text-emerald-400">Interest Saved</div><div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{fmt(prepaymentSavings)}</div></div>
            <div><div className="text-xs text-emerald-600 dark:text-emerald-400">Tenure Reduced</div><div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{Math.floor(monthsReduced / 12)} yr {monthsReduced % 12} mo</div></div>
          </div>
        </div>
      )}

      {/* Loan Eligibility */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Loan Eligibility Estimator</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={`${labelClass} mb-1 block`}>Your Monthly Income</label>
            <input type="number" value={monthlyIncome} min={0} step={5000} onChange={e => setMonthlyIncome(Math.max(0, +e.target.value || 0))} className={inputClass} placeholder="Enter monthly income" />
          </div>
          <div className="flex items-end">
            {monthlyIncome > 0 && (
              <div className="w-full text-center py-2.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Max Eligible Loan (40% EMI rule)</div>
                <div className="text-xl font-bold text-primary-700 dark:text-primary-400">{fmt(maxLoanEligible)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rate Comparison */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Rate Comparison</h3>
        <div className="space-y-2">
          {[-1, -0.5, 0, 0.5, 1].map(diff => {
            const r2 = rate + diff;
            const r2m = r2 / 12 / 100;
            const n = years * 12;
            const emi2 = loanAmount * r2m * Math.pow(1 + r2m, n) / (Math.pow(1 + r2m, n) - 1);
            const total2 = emi2 * n;
            return (
              <div key={diff} className={`flex justify-between items-center py-1.5 text-sm ${diff === 0 ? 'font-bold text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'}`}>
                <span>{r2.toFixed(1)}% {diff === 0 ? '(current)' : ''}</span>
                <span>EMI: {fmt(emi2)}</span>
                <span>Total: {fmt(total2)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Amortization */}
      <div>
        <button onClick={() => setShowAmort(!showAmort)} className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
          {showAmort ? 'Hide' : 'Show'} Amortization Schedule &rarr;
        </button>
        {showAmort && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-96">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                <tr>{['Year', 'Opening', 'EMI Paid', 'Principal', 'Interest', 'Balance'].map(h => <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {schedule.map(row => (
                  <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-2 font-medium text-slate-900 dark:text-slate-100">{row.year}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{fmt(row.opening)}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{fmt(row.emiPaid)}</td>
                    <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">{fmt(row.principal)}</td>
                    <td className="px-4 py-2 text-amber-600 dark:text-amber-400">{fmt(row.interest)}</td>
                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{fmt(row.closing)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">* EMI calculations are indicative. Actual EMI may vary based on the lender&apos;s terms, processing fees, and applicable charges. Interest rates are subject to change. Consult your bank for exact figures.</p>
    </div>
  );
}
