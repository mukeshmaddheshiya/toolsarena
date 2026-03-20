'use client';

import { useState, useMemo } from 'react';

interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

const formatINR = (amount: number) =>
  '\u20B9' + Math.round(amount).toLocaleString('en-IN');

export function CarLoanCalculatorTool() {
  const [carPrice, setCarPrice] = useState(800000);
  const [downPayment, setDownPayment] = useState(150000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenureMonths, setTenureMonths] = useState(60);

  const results = useMemo(() => {
    const loanAmount = carPrice - downPayment;
    if (loanAmount <= 0 || interestRate <= 0 || tenureMonths <= 0) return null;

    const monthlyRate = interestRate / 12 / 100;
    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - loanAmount;
    const ltcRatio = ((loanAmount / carPrice) * 100).toFixed(1);

    const amortization: AmortizationRow[] = [];
    let balance = loanAmount;
    const monthsToShow = Math.min(12, tenureMonths);
    for (let m = 1; m <= monthsToShow; m++) {
      const interestComp = balance * monthlyRate;
      const principalComp = emi - interestComp;
      balance -= principalComp;
      amortization.push({
        month: m,
        emi,
        principal: principalComp,
        interest: interestComp,
        balance: Math.max(0, balance),
      });
    }

    return { loanAmount, emi, totalPayment, totalInterest, ltcRatio, amortization };
  }, [carPrice, downPayment, interestRate, tenureMonths]);

  const ltcNum = results ? parseFloat(results.ltcRatio) : 0;
  const ltcColor = ltcNum <= 80 ? 'text-green-600' : ltcNum <= 90 ? 'text-yellow-600' : 'text-red-600';
  const ltcBg = ltcNum <= 80 ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : ltcNum <= 90 ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Inputs */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Car Loan Details</h2>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium text-gray-700 dark:text-gray-300">Car On-Road Price</label>
            <span className="text-blue-600 font-semibold">{formatINR(carPrice)}</span>
          </div>
          <input
            type="range"
            min={50000}
            max={2000000}
            step={10000}
            value={carPrice}
            onChange={(e) => setCarPrice(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{'\u20B9'}50K</span><span>{'\u20B9'}20L</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium text-gray-700 dark:text-gray-300">Down Payment</label>
            <span className="text-blue-600 font-semibold">{formatINR(downPayment)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={carPrice * 0.8}
            step={5000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{'\u20B9'}0</span><span>{formatINR(carPrice * 0.8)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Interest Rate (% p.a.)</label>
            <input
              type="number"
              min={7}
              max={18}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tenure (Months)</label>
            <select
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[12, 24, 36, 48, 60, 72, 84].map((m) => (
                <option key={m} value={m}>{m} months ({m / 12} yr{m > 12 ? 's' : ''})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="bg-blue-600 text-white rounded-2xl p-4 text-center">
              <p className="text-xs opacity-80 mb-1">Monthly EMI</p>
              <p className="text-xl font-bold">{formatINR(results.emi)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{formatINR(results.loanAmount)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Interest</p>
              <p className="text-lg font-bold text-red-600">{formatINR(results.totalInterest)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Payment</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{formatINR(results.totalPayment)}</p>
            </div>
          </div>

          {/* LTC Ratio */}
          <div className={`border rounded-2xl p-4 flex items-center justify-between ${ltcBg}`}>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Loan-to-Cost Ratio</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {ltcNum <= 80 ? 'Healthy ratio — good loan terms likely' : ltcNum <= 90 ? 'Acceptable — most banks will approve' : 'High — consider a larger down payment'}
              </p>
            </div>
            <p className={`text-3xl font-bold ${ltcColor}`}>{results.ltcRatio}%</p>
          </div>

          {/* Amortization */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Amortization Schedule — First {results.amortization.length} Months
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-700/50">
                    <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-medium rounded-tl-lg">Month</th>
                    <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">EMI</th>
                    <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">Principal</th>
                    <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">Interest</th>
                    <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400 font-medium rounded-tr-lg">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {results.amortization.map((row) => (
                    <tr key={row.month} className="border-t border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30">
                      <td className="py-2 px-3 text-gray-700 dark:text-gray-300 font-medium">{row.month}</td>
                      <td className="py-2 px-3 text-right text-gray-700 dark:text-gray-300">{formatINR(row.emi)}</td>
                      <td className="py-2 px-3 text-right text-green-600">{formatINR(row.principal)}</td>
                      <td className="py-2 px-3 text-right text-red-500">{formatINR(row.interest)}</td>
                      <td className="py-2 px-3 text-right text-gray-700 dark:text-gray-300">{formatINR(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tenureMonths > 12 && (
              <p className="text-xs text-gray-400 mt-3">Showing first 12 months of {tenureMonths}-month schedule.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
