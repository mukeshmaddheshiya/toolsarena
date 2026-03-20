'use client';

import { useState, useMemo } from 'react';

type CompoundingFreq = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';
type TenureUnit = 'months' | 'years';

const freqMap: Record<CompoundingFreq, number> = {
  monthly: 12,
  quarterly: 4,
  'half-yearly': 2,
  yearly: 1,
};

const freqLabels: Record<CompoundingFreq, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  'half-yearly': 'Half-Yearly',
  yearly: 'Yearly',
};

const bankRates = [
  { name: 'SBI', rate: 7.0, color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' },
  { name: 'HDFC Bank', rate: 7.1, color: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' },
  { name: 'ICICI Bank', rate: 7.1, color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300' },
  { name: 'Axis Bank', rate: 7.1, color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300' },
  { name: 'Bajaj Finance', rate: 7.9, color: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' },
];

const formatINR = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

function calcFD(principal: number, ratePercent: number, tenureMonths: number, freq: number) {
  const r = ratePercent / 100;
  const t = tenureMonths / 12;
  const maturity = principal * Math.pow(1 + r / freq, freq * t);
  const interest = maturity - principal;
  const eay = (Math.pow(1 + r / freq, freq) - 1) * 100;
  return { maturity, interest, eay };
}

export function FdMaturityCalculatorTool() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.1);
  const [tenure, setTenure] = useState(12);
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>('months');
  const [compounding, setCompounding] = useState<CompoundingFreq>('quarterly');

  const tenureMonths = tenureUnit === 'years' ? tenure * 12 : tenure;

  const result = useMemo(
    () => calcFD(principal, rate, tenureMonths, freqMap[compounding]),
    [principal, rate, tenureMonths, compounding]
  );

  const bankComparisons = useMemo(
    () =>
      bankRates.map((b) => ({
        ...b,
        ...calcFD(principal, b.rate, tenureMonths, freqMap['quarterly']),
      })),
    [principal, tenureMonths]
  );

  const maxMaturity = Math.max(...bankComparisons.map((b) => b.maturity));

  const compoundingBtnClass = (f: CompoundingFreq) =>
    f === compounding
      ? 'bg-blue-600 text-white border-blue-600'
      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500';

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 space-y-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">FD Details</h2>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium text-slate-700 dark:text-slate-300">Principal Amount</label>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{formatINR(principal)}</span>
          </div>
          <input
            type="range"
            min={1000}
            max={5000000}
            step={1000}
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Interest Rate (% p.a.)</label>
            <input
              type="number"
              min={1}
              max={15}
              step={0.05}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tenure
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={tenureUnit === 'years' ? 20 : 240}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={tenureUnit}
                onChange={(e) => setTenureUnit(e.target.value as TenureUnit)}
                className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Compounding Frequency</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(freqLabels) as CompoundingFreq[]).map((f) => (
              <button
                key={f}
                onClick={() => setCompounding(f)}
                className={`py-2 px-1 text-xs font-medium border rounded-lg transition-all ${compoundingBtnClass(f)}`}
              >
                {freqLabels[f]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-600 text-white rounded-2xl p-4 text-center">
          <p className="text-xs opacity-80 mb-1">Maturity Amount</p>
          <p className="text-lg font-bold">{formatINR(result.maturity)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Interest Earned</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatINR(result.interest)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Eff. Annual Yield</p>
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{result.eay.toFixed(2)}%</p>
        </div>
      </div>

      {/* Bank Comparison */}
      <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6">
        <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-1">Bank Rate Comparison</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
          Quarterly compounding • {tenure} {tenureUnit} • Principal {formatINR(principal)}
        </p>
        <div className="space-y-3">
          {bankComparisons.map((b) => (
            <div key={b.name} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="sm:w-28 shrink-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.color}`}>{b.name}</span>
              </div>
              <div className="flex-1">
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${(b.maturity / maxMaturity) * 100}%` }}
                  />
                </div>
              </div>
              <div className="sm:text-right sm:w-32 shrink-0 flex sm:block items-center gap-2">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{formatINR(b.maturity)}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{b.rate}% p.a.</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">* Rates are indicative for general FDs. Senior citizen rates are typically 0.25-0.50% higher. Check bank websites for current rates.</p>
      </div>
    </div>
  );
}
