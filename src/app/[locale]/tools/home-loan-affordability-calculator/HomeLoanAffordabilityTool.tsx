'use client';

import { useState, useMemo } from 'react';

const formatINR = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

function calcMaxLoan(maxEMI: number, rate: number, tenureMonths: number): number {
  if (maxEMI <= 0 || rate <= 0 || tenureMonths <= 0) return 0;
  const r = rate / 12 / 100;
  return (maxEMI * (Math.pow(1 + r, tenureMonths) - 1)) / (r * Math.pow(1 + r, tenureMonths));
}

function calcEMI(principal: number, rate: number, tenureMonths: number): number {
  if (principal <= 0 || rate <= 0 || tenureMonths <= 0) return 0;
  const r = rate / 12 / 100;
  return (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
}

type Score = 'excellent' | 'good' | 'moderate' | 'stretched';

const scoreStyles: Record<Score, { label: string; border: string; bg: string; text: string; bar: string }> = {
  excellent: { label: 'Excellent', border: 'border-green-300 dark:border-green-700', bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-400', bar: 'bg-green-500' },
  good: { label: 'Good', border: 'border-blue-300 dark:border-blue-700', bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400', bar: 'bg-blue-500' },
  moderate: { label: 'Moderate', border: 'border-yellow-300 dark:border-yellow-700', bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-700 dark:text-yellow-400', bar: 'bg-yellow-500' },
  stretched: { label: 'Stretched', border: 'border-red-300 dark:border-red-700', bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400', bar: 'bg-red-500' },
};

export function HomeLoanAffordabilityTool() {
  const [monthlyIncome, setMonthlyIncome] = useState(80000);
  const [existingEMIs, setExistingEMIs] = useState(5000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const results = useMemo(() => {
    if (monthlyIncome <= 0) return null;

    const tenureMonths = tenureYears * 12;
    const safeLimit = monthlyIncome * 0.40;
    const maxNewEMI = Math.max(0, safeLimit - existingEMIs);
    const maxLoan = calcMaxLoan(maxNewEMI, interestRate, tenureMonths);
    const estimatedEMI = calcEMI(maxLoan, interestRate, tenureMonths);

    const currentFOIR = (existingEMIs / monthlyIncome) * 100;
    const projectedFOIR = ((existingEMIs + estimatedEMI) / monthlyIncome) * 100;

    let score: Score;
    if (projectedFOIR <= 35) score = 'excellent';
    else if (projectedFOIR <= 45) score = 'good';
    else if (projectedFOIR <= 55) score = 'moderate';
    else score = 'stretched';

    return {
      maxLoan,
      estimatedEMI,
      maxNewEMI,
      safeLimit,
      currentFOIR,
      projectedFOIR,
      score,
      tenureMonths,
    };
  }, [monthlyIncome, existingEMIs, interestRate, tenureYears]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Inputs */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Financial Details</h2>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium text-gray-700 dark:text-gray-300">Monthly Take-Home Income</label>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{formatINR(monthlyIncome)}</span>
          </div>
          <input
            type="range"
            min={15000}
            max={500000}
            step={5000}
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>₹15,000</span><span>₹5,00,000</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium text-gray-700 dark:text-gray-300">Existing EMIs per Month</label>
            <span className="text-orange-600 dark:text-orange-400 font-semibold">{formatINR(existingEMIs)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={monthlyIncome * 0.5}
            step={500}
            value={existingEMIs}
            onChange={(e) => setExistingEMIs(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>₹0</span><span>{formatINR(monthlyIncome * 0.5)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Interest Rate (% p.a.)</label>
            <input
              type="number"
              min={6}
              max={18}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tenure (Years)</label>
            <select
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 15, 20, 25, 30].map((y) => (
                <option key={y} value={y}>{y} years</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <>
          {/* Main result cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-600 text-white rounded-2xl p-5 col-span-2 sm:col-span-1">
              <p className="text-xs opacity-80 mb-1">Maximum Eligible Loan</p>
              <p className="text-3xl font-bold">{formatINR(results.maxLoan)}</p>
              <p className="text-xs opacity-70 mt-1">Based on 40% FOIR limit</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Estimated Monthly EMI</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{formatINR(results.estimatedEMI)}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">For {tenureYears} years @ {interestRate}%</p>
            </div>
          </div>

          {/* Affordability Score */}
          <div className={`border rounded-2xl p-5 ${scoreStyles[results.score].border} ${scoreStyles[results.score].bg}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Affordability Score</p>
                <p className={`text-2xl font-bold mt-0.5 ${scoreStyles[results.score].text}`}>
                  {scoreStyles[results.score].label}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Projected FOIR</p>
                <p className={`text-3xl font-bold ${scoreStyles[results.score].text}`}>
                  {results.projectedFOIR.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${scoreStyles[results.score].bar}`}
                style={{ width: `${Math.min(100, results.projectedFOIR)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {results.score === 'excellent' && 'Your FOIR is well below 40%. You have strong loan eligibility and may qualify for preferential rates.'}
              {results.score === 'good' && 'Your FOIR is within comfortable limits. Most banks will approve your home loan application.'}
              {results.score === 'moderate' && 'Your FOIR is slightly high. Consider reducing existing EMIs or adding a co-applicant to strengthen eligibility.'}
              {results.score === 'stretched' && 'Your FOIR exceeds 50%. Loan approval may be difficult. Reduce existing obligations or increase income before applying.'}
            </p>
          </div>

          {/* FOIR Breakdown */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">FOIR Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Monthly Income</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{formatINR(monthlyIncome)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Safe EMI Limit (40%)</span>
                <span className="font-medium text-green-600 dark:text-green-400">{formatINR(results.safeLimit)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Existing EMIs</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">– {formatINR(existingEMIs)}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-slate-700 pt-3 flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Available for Home Loan EMI</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{formatINR(results.maxNewEMI)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current FOIR (without home loan)</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{results.currentFOIR.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Projected FOIR (with home loan)</span>
                <span className={`font-bold ${scoreStyles[results.score].text}`}>{results.projectedFOIR.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
