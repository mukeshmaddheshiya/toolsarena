'use client';

import { useState, useCallback } from 'react';
import { TrendingUp, IndianRupee, Calendar, Percent, Info, ArrowRight } from 'lucide-react';

interface YearData {
  year: number;
  monthlySip: number;
  totalInvested: number;
  totalValue: number;
  wealthGained: number;
}

interface Results {
  totalInvested: number;
  totalValue: number;
  wealthGained: number;
  yearData: YearData[];
  noStepUp: {
    totalInvested: number;
    totalValue: number;
    wealthGained: number;
  };
}

const formatINR = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const formatCompact = (value: number): string => {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)} L`;
  return formatINR(value);
};

function calculateStepUpSIP(
  monthlySip: number,
  stepUpPct: number,
  annualReturn: number,
  years: number
): Results {
  const monthlyRate = annualReturn / 100 / 12;
  const yearData: YearData[] = [];
  let corpus = 0;
  let totalInvested = 0;

  for (let y = 1; y <= years; y++) {
    const currentMonthlySip = monthlySip * Math.pow(1 + stepUpPct / 100, y - 1);
    for (let m = 0; m < 12; m++) {
      corpus = corpus * (1 + monthlyRate) + currentMonthlySip;
      totalInvested += currentMonthlySip;
    }
    yearData.push({
      year: y,
      monthlySip: currentMonthlySip,
      totalInvested,
      totalValue: corpus,
      wealthGained: corpus - totalInvested,
    });
  }

  // No step-up comparison
  let noCorpus = 0;
  let noInvested = 0;
  const totalMonths = years * 12;
  for (let m = 0; m < totalMonths; m++) {
    noCorpus = noCorpus * (1 + monthlyRate) + monthlySip;
    noInvested += monthlySip;
  }

  return {
    totalInvested,
    totalValue: corpus,
    wealthGained: corpus - totalInvested,
    yearData,
    noStepUp: {
      totalInvested: noInvested,
      totalValue: noCorpus,
      wealthGained: noCorpus - noInvested,
    },
  };
}

export function StepUpSipCalculatorTool() {
  const [monthlySip, setMonthlySip] = useState<string>('10000');
  const [stepUp, setStepUp] = useState<string>('10');
  const [returnRate, setReturnRate] = useState<string>('12');
  const [years, setYears] = useState<string>('15');
  const [results, setResults] = useState<Results | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    const sip = parseFloat(monthlySip);
    const su = parseFloat(stepUp);
    const rr = parseFloat(returnRate);
    const yr = parseInt(years);

    if (!monthlySip || isNaN(sip) || sip < 100) errs.monthlySip = 'Minimum SIP is ₹100';
    if (!stepUp || isNaN(su) || su < 0 || su > 50) errs.stepUp = 'Step-up must be between 0–50%';
    if (!returnRate || isNaN(rr) || rr <= 0 || rr > 50) errs.returnRate = 'Return rate must be 1–50%';
    if (!years || isNaN(yr) || yr < 1 || yr > 40) errs.years = 'Period must be 1–40 years';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [monthlySip, stepUp, returnRate, years]);

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateStepUpSIP(
      parseFloat(monthlySip),
      parseFloat(stepUp),
      parseFloat(returnRate),
      parseInt(years)
    );
    setResults(res);
  };

  const handleReset = () => {
    setMonthlySip('10000');
    setStepUp('10');
    setReturnRate('12');
    setYears('15');
    setResults(null);
    setErrors({});
  };

  const maxValue = results ? Math.max(...results.yearData.map((d) => d.totalValue)) : 1;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
          <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Step-Up SIP Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Increase your SIP annually and watch your wealth multiply
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Monthly SIP */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Monthly SIP Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IndianRupee className="w-4 h-4" />
            </span>
            <input
              type="number"
              value={monthlySip}
              onChange={(e) => setMonthlySip(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.monthlySip
                  ? 'border-red-400'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="10000"
              min="100"
            />
          </div>
          {errors.monthlySip && (
            <p className="text-xs text-red-500">{errors.monthlySip}</p>
          )}
        </div>

        {/* Annual Step-Up */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Annual Step-Up %
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Percent className="w-4 h-4" />
            </span>
            <select
              value={stepUp}
              onChange={(e) => setStepUp(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {[5, 10, 15, 20, 25, 30].map((v) => (
                <option key={v} value={v}>
                  {v}% per year
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expected Return */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Expected Annual Return (CAGR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Percent className="w-4 h-4" />
            </span>
            <input
              type="number"
              value={returnRate}
              onChange={(e) => setReturnRate(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.returnRate
                  ? 'border-red-400'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="12"
              step="0.1"
            />
          </div>
          {errors.returnRate && (
            <p className="text-xs text-red-500">{errors.returnRate}</p>
          )}
        </div>

        {/* Investment Period */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Investment Period (Years)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Calendar className="w-4 h-4" />
            </span>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.years ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="15"
              min="1"
              max="40"
            />
          </div>
          {errors.years && <p className="text-xs text-red-500">{errors.years}</p>}
        </div>

        {/* Buttons */}
        <div className="sm:col-span-2 flex gap-3 pt-2">
          <button
            onClick={handleCalculate}
            className="flex-1 py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Calculate Returns
          </button>
          <button
            onClick={handleReset}
            className="py-2.5 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-lg text-sm transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                Total Invested
              </p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {formatCompact(results.totalInvested)}
              </p>
              <p className="text-xs text-slate-400 mt-1">{formatINR(results.totalInvested)}</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 shadow-sm text-center">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">
                Expected Returns
              </p>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                {formatCompact(results.wealthGained)}
              </p>
              <p className="text-xs text-emerald-500 mt-1">{formatINR(results.wealthGained)}</p>
            </div>
            <div className="p-4 bg-indigo-600 rounded-xl shadow-sm text-center">
              <p className="text-xs font-medium text-indigo-200 uppercase tracking-wide mb-1">
                Total Maturity Value
              </p>
              <p className="text-2xl font-bold text-white">
                {formatCompact(results.totalValue)}
              </p>
              <p className="text-xs text-indigo-200 mt-1">{formatINR(results.totalValue)}</p>
            </div>
          </div>

          {/* Comparison */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-indigo-500" />
              Step-Up SIP vs Regular SIP Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left py-2 text-slate-500 dark:text-slate-400 font-medium">Metric</th>
                    <th className="text-right py-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                      With Step-Up ({stepUp}%/yr)
                    </th>
                    <th className="text-right py-2 text-slate-500 dark:text-slate-400 font-medium">
                      Without Step-Up
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  <tr>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">Total Invested</td>
                    <td className="py-2.5 text-right font-medium text-slate-800 dark:text-slate-100">
                      {formatCompact(results.totalInvested)}
                    </td>
                    <td className="py-2.5 text-right text-slate-500 dark:text-slate-400">
                      {formatCompact(results.noStepUp.totalInvested)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">Wealth Gained</td>
                    <td className="py-2.5 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCompact(results.wealthGained)}
                    </td>
                    <td className="py-2.5 text-right text-slate-500 dark:text-slate-400">
                      {formatCompact(results.noStepUp.wealthGained)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">Maturity Value</td>
                    <td className="py-2.5 text-right font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCompact(results.totalValue)}
                    </td>
                    <td className="py-2.5 text-right text-slate-500 dark:text-slate-400">
                      {formatCompact(results.noStepUp.totalValue)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg">
              <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                Step-Up SIP generates{' '}
                <span className="font-bold">
                  {formatCompact(results.totalValue - results.noStepUp.totalValue)}
                </span>{' '}
                more wealth than regular SIP over {years} years.
              </p>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Year-wise Wealth Growth
            </h3>
            <div className="space-y-2">
              {results.yearData
                .filter((_, i) => i % Math.ceil(results.yearData.length / 15) === 0 || i === results.yearData.length - 1)
                .map((d) => (
                  <div key={d.year} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400 w-12 shrink-0 text-right">
                      Yr {d.year}
                    </span>
                    <div className="flex-1 flex gap-1 h-6">
                      <div
                        className="bg-indigo-200 dark:bg-indigo-800 rounded-sm flex items-center justify-end pr-1"
                        style={{ width: `${(d.totalInvested / maxValue) * 100}%`, minWidth: '2px' }}
                      >
                      </div>
                      <div
                        className="bg-emerald-400 dark:bg-emerald-600 rounded-sm"
                        style={{
                          width: `${((d.totalValue - d.totalInvested) / maxValue) * 100}%`,
                          minWidth: '2px',
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200 w-24 shrink-0 text-right">
                      {formatCompact(d.totalValue)}
                    </span>
                  </div>
                ))}
            </div>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-indigo-200 dark:bg-indigo-800"></div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Invested</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600"></div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Returns</span>
              </div>
            </div>
          </div>

          {/* Year-wise Table */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Year-wise Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2 px-2 text-slate-500 dark:text-slate-400 font-medium">Year</th>
                    <th className="text-right py-2 px-2 text-slate-500 dark:text-slate-400 font-medium">Monthly SIP</th>
                    <th className="text-right py-2 px-2 text-slate-500 dark:text-slate-400 font-medium">Total Invested</th>
                    <th className="text-right py-2 px-2 text-slate-500 dark:text-slate-400 font-medium">Total Value</th>
                    <th className="text-right py-2 px-2 text-slate-500 dark:text-slate-400 font-medium">Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {results.yearData.map((d) => (
                    <tr key={d.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2 px-2 font-medium text-slate-700 dark:text-slate-200">
                        Year {d.year}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-600 dark:text-slate-300">
                        {formatINR(Math.round(d.monthlySip))}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-600 dark:text-slate-300">
                        {formatCompact(d.totalInvested)}
                      </td>
                      <td className="py-2 px-2 text-right font-medium text-indigo-600 dark:text-indigo-400">
                        {formatCompact(d.totalValue)}
                      </td>
                      <td className="py-2 px-2 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCompact(d.wealthGained)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex gap-2 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              <span className="font-semibold">Disclaimer:</span> Returns are estimated based on assumed
              CAGR. Mutual fund investments are subject to market risks. Past performance is not indicative
              of future returns. Please read all scheme-related documents carefully before investing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StepUpSipCalculatorTool;
