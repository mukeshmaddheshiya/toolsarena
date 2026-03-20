'use client';

import { useState, useMemo } from 'react';

type PrepayMode = 'reduce-tenure' | 'reduce-emi';

const formatINR = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

function calcEMI(principal: number, ratePercent: number, months: number): number {
  if (principal <= 0 || ratePercent <= 0 || months <= 0) return 0;
  const r = ratePercent / 12 / 100;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function calcBalanceAtMonth(principal: number, ratePercent: number, totalMonths: number, atMonth: number): number {
  const r = ratePercent / 12 / 100;
  const emi = calcEMI(principal, ratePercent, totalMonths);
  return principal * Math.pow(1 + r, atMonth) - emi * ((Math.pow(1 + r, atMonth) - 1) / r);
}

function calcMonthsForEMI(principal: number, ratePercent: number, emi: number): number {
  if (principal <= 0 || ratePercent <= 0 || emi <= 0) return 0;
  const r = ratePercent / 12 / 100;
  if (emi <= principal * r) return Infinity;
  return Math.ceil(Math.log(emi / (emi - principal * r)) / Math.log(1 + r));
}

export function HomeLoanPrepaymentTool() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [prepaymentAmount, setPrepaymentAmount] = useState(500000);
  const [prepaymentMonth, setPrepaymentMonth] = useState(24);
  const [mode, setMode] = useState<PrepayMode>('reduce-tenure');

  const results = useMemo(() => {
    const totalMonths = tenureYears * 12;
    const originalEMI = calcEMI(loanAmount, interestRate, totalMonths);
    const originalTotalPayment = originalEMI * totalMonths;
    const originalTotalInterest = originalTotalPayment - loanAmount;

    // Balance just before prepayment
    const balanceBeforePrepayment = calcBalanceAtMonth(loanAmount, interestRate, totalMonths, prepaymentMonth);
    const balanceAfterPrepayment = Math.max(0, balanceBeforePrepayment - prepaymentAmount);

    const remainingMonthsOriginal = totalMonths - prepaymentMonth;

    let newEMI = originalEMI;
    let newRemainingMonths = remainingMonthsOriginal;
    let newTotalInterest = 0;

    if (mode === 'reduce-tenure') {
      // Keep EMI same, reduce tenure
      newRemainingMonths = calcMonthsForEMI(balanceAfterPrepayment, interestRate, originalEMI);
      newEMI = originalEMI;
    } else {
      // Keep tenure same, reduce EMI
      newRemainingMonths = remainingMonthsOriginal;
      newEMI = calcEMI(balanceAfterPrepayment, interestRate, remainingMonthsOriginal);
    }

    // New total interest = interest paid before prepayment + interest after prepayment
    const interestPaidBeforePrepayment = originalEMI * prepaymentMonth - (loanAmount - balanceBeforePrepayment);
    const interestAfterPrepayment = newEMI * newRemainingMonths - balanceAfterPrepayment;
    newTotalInterest = interestPaidBeforePrepayment + interestAfterPrepayment;

    const interestSaved = originalTotalInterest - newTotalInterest;
    const monthsSaved = mode === 'reduce-tenure' ? remainingMonthsOriginal - newRemainingMonths : 0;
    const yearsSaved = Math.floor(monthsSaved / 12);
    const extraMonthsSaved = monthsSaved % 12;

    const newTotalTenureMonths = prepaymentMonth + newRemainingMonths;
    const newTenureYears = Math.floor(newTotalTenureMonths / 12);
    const newTenureMonths = newTotalTenureMonths % 12;

    return {
      originalEMI,
      originalTotalInterest,
      balanceBeforePrepayment,
      balanceAfterPrepayment,
      newEMI,
      newRemainingMonths,
      newTotalInterest,
      interestSaved,
      monthsSaved,
      yearsSaved,
      extraMonthsSaved,
      newTenureYears,
      newTenureMonths,
    };
  }, [loanAmount, interestRate, tenureYears, prepaymentAmount, prepaymentMonth, mode]);

  const modeStyle = (m: PrepayMode) =>
    m === mode
      ? 'bg-blue-600 text-white border-blue-600'
      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-300 dark:border-slate-600 hover:border-blue-400';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Inputs */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Loan Details</h2>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium text-gray-700 dark:text-slate-300">Original Loan Amount</label>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{formatINR(loanAmount)}</span>
          </div>
          <input
            type="range"
            min={500000}
            max={20000000}
            step={100000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 dark:text-slate-500">
            <span>₹5L</span><span>₹2Cr</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Interest Rate (% p.a.)</label>
            <input
              type="number"
              min={5}
              max={18}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Original Tenure (Years)</label>
            <select
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 15, 20, 25, 30].map((y) => (
                <option key={y} value={y}>{y} years</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Prepayment Amount</label>
            <input
              type="number"
              min={10000}
              value={prepaymentAmount}
              onChange={(e) => setPrepaymentAmount(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Prepay at Month #</label>
            <input
              type="number"
              min={1}
              max={tenureYears * 12 - 1}
              value={prepaymentMonth}
              onChange={(e) => setPrepaymentMonth(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">After Prepayment, I want to:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('reduce-tenure')}
              className={`py-3 px-4 text-sm font-medium border rounded-xl transition-all text-left ${modeStyle('reduce-tenure')}`}
            >
              <div className="font-semibold">Reduce Tenure</div>
              <div className="text-xs opacity-70 mt-0.5">Keep same EMI, close loan earlier</div>
            </button>
            <button
              onClick={() => setMode('reduce-emi')}
              className={`py-3 px-4 text-sm font-medium border rounded-xl transition-all text-left ${modeStyle('reduce-emi')}`}
            >
              <div className="font-semibold">Reduce EMI</div>
              <div className="text-xs opacity-70 mt-0.5">Same tenure, lower monthly payment</div>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-600 text-white rounded-2xl p-5 col-span-2 sm:col-span-1">
          <p className="text-xs opacity-80 mb-1">Total Interest Saved</p>
          <p className="text-3xl font-bold">{formatINR(results.interestSaved)}</p>
          <p className="text-xs opacity-70 mt-1">By prepaying {formatINR(prepaymentAmount)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 col-span-2 sm:col-span-1">
          {mode === 'reduce-tenure' ? (
            <>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Loan Closed Earlier By</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {results.yearsSaved > 0 ? `${results.yearsSaved}y ` : ''}{results.extraMonthsSaved}m
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                New closure: {results.newTenureYears}yr {results.newTenureMonths}mo from start
              </p>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">New Monthly EMI</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatINR(results.newEMI)}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                Reduced from {formatINR(results.originalEMI)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-gray-800 dark:text-slate-100 mb-4">Before vs After Comparison</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-900">
              <th className="text-left py-2 px-3 text-gray-600 dark:text-slate-400 font-medium rounded-tl-lg">Parameter</th>
              <th className="text-right py-2 px-3 text-gray-600 dark:text-slate-400 font-medium">Without Prepayment</th>
              <th className="text-right py-2 px-3 text-green-700 dark:text-green-400 font-medium rounded-tr-lg">With Prepayment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            <tr>
              <td className="py-2 px-3 text-gray-600 dark:text-slate-400">Monthly EMI</td>
              <td className="py-2 px-3 text-right font-medium text-gray-800 dark:text-slate-200">{formatINR(results.originalEMI)}</td>
              <td className="py-2 px-3 text-right font-medium text-green-700 dark:text-green-400">{formatINR(results.newEMI)}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-gray-600 dark:text-slate-400">Outstanding at Month {prepaymentMonth}</td>
              <td className="py-2 px-3 text-right font-medium text-gray-800 dark:text-slate-200">{formatINR(results.balanceBeforePrepayment)}</td>
              <td className="py-2 px-3 text-right font-medium text-green-700 dark:text-green-400">{formatINR(results.balanceAfterPrepayment)}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-gray-600 dark:text-slate-400">Total Interest Paid</td>
              <td className="py-2 px-3 text-right font-medium text-red-500">{formatINR(results.originalTotalInterest)}</td>
              <td className="py-2 px-3 text-right font-medium text-green-700 dark:text-green-400">{formatINR(results.newTotalInterest)}</td>
            </tr>
            <tr className="bg-green-50 dark:bg-green-950/30">
              <td className="py-2 px-3 text-green-800 dark:text-green-300 font-semibold">Interest Saved</td>
              <td className="py-2 px-3 text-right text-gray-400 dark:text-slate-500">—</td>
              <td className="py-2 px-3 text-right font-bold text-green-700 dark:text-green-400">{formatINR(results.interestSaved)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
