'use client';

import { useState, useMemo } from 'react';

type Mode = 'nsc' | 'kvp' | 'compare';

const NSC_RATE = 7.7;
const KVP_RATE = 7.5;
const NSC_YEARS = 5;
const KVP_DOUBLING_MONTHS = 115;

const formatINR = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

function calcNSC(principal: number) {
  const maturity = principal * Math.pow(1 + NSC_RATE / 100, NSC_YEARS);
  const interest = maturity - principal;
  return { maturity, interest };
}

function calcKVP(principal: number) {
  const maturity = principal * 2;
  const interest = principal;
  const years = Math.floor(KVP_DOUBLING_MONTHS / 12);
  const months = KVP_DOUBLING_MONTHS % 12;
  return { maturity, interest, years, months };
}

export function NscKvpCalculatorTool() {
  const [amount, setAmount] = useState(100000);
  const [mode, setMode] = useState<Mode>('compare');

  const nsc = useMemo(() => calcNSC(amount), [amount]);
  const kvp = useMemo(() => calcKVP(amount), [amount]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Mode selector */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-700/50 rounded-xl">
        {(['nsc', 'kvp', 'compare'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-transparent text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            {m === 'nsc' ? 'NSC Only' : m === 'kvp' ? 'KVP Only' : 'Compare Both'}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Investment Amount</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium text-gray-700 dark:text-slate-300">Amount to Invest</label>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{formatINR(amount)}</span>
          </div>
          <input
            type="range"
            min={1000}
            max={1500000}
            step={1000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 dark:text-slate-500">
            <span>₹1,000</span><span>₹15,00,000</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">Or enter amount directly</label>
          <input
            type="number"
            min={1000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* NSC Result */}
      {(mode === 'nsc' || mode === 'compare') && (
        <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-blue-700 dark:text-blue-400">NSC — National Savings Certificate</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">7.7% p.a. compounded annually • 5-year lock-in</p>
            </div>
            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full">80C Eligible</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center bg-gray-50 dark:bg-slate-900 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Principal</p>
              <p className="text-sm font-bold text-gray-800 dark:text-slate-100">{formatINR(amount)}</p>
            </div>
            <div className="text-center bg-green-50 dark:bg-green-950/30 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Interest Earned</p>
              <p className="text-sm font-bold text-green-600 dark:text-green-400">{formatINR(nsc.interest)}</p>
            </div>
            <div className="text-center bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Maturity Value</p>
              <p className="text-sm font-bold text-blue-700 dark:text-blue-400">{formatINR(nsc.maturity)}</p>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 text-xs text-blue-800 dark:text-blue-300">
            <strong>Tax Benefit:</strong> Your investment of {formatINR(Math.min(amount, 150000))} qualifies for Section 80C deduction. At 30% slab, potential tax saving of {formatINR(Math.min(amount, 150000) * 0.3)}.
          </div>
        </div>
      )}

      {/* KVP Result */}
      {(mode === 'kvp' || mode === 'compare') && (
        <div className="bg-white dark:bg-slate-800 border border-green-200 dark:border-green-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-green-700 dark:text-green-400">KVP — Kisan Vikas Patra</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">7.5% p.a. • Doubles in {kvp.years} yrs {kvp.months} months (115 months)</p>
            </div>
            <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full">Doubles Money</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center bg-gray-50 dark:bg-slate-900 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Principal</p>
              <p className="text-sm font-bold text-gray-800 dark:text-slate-100">{formatINR(amount)}</p>
            </div>
            <div className="text-center bg-green-50 dark:bg-green-950/30 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Interest Earned</p>
              <p className="text-sm font-bold text-green-600 dark:text-green-400">{formatINR(kvp.interest)}</p>
            </div>
            <div className="text-center bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Maturity Value</p>
              <p className="text-sm font-bold text-green-700 dark:text-green-400">{formatINR(kvp.maturity)}</p>
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-xl p-3 text-xs text-yellow-800 dark:text-yellow-300">
            <strong>Note:</strong> KVP does not offer Section 80C benefit. Maturity proceeds are taxable as per your income slab. No TDS is deducted at source.
          </div>
        </div>
      )}

      {/* Compare table */}
      {mode === 'compare' && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-slate-100 mb-4">Side-by-Side Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900">
                  <th className="text-left py-2 px-3 text-gray-600 dark:text-slate-400 font-medium rounded-tl-lg">Parameter</th>
                  <th className="text-center py-2 px-3 text-blue-700 dark:text-blue-400 font-medium">NSC</th>
                  <th className="text-center py-2 px-3 text-green-700 dark:text-green-400 font-medium rounded-tr-lg">KVP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                <tr>
                  <td className="py-2 px-3 text-gray-600 dark:text-slate-400">Interest Rate</td>
                  <td className="py-2 px-3 text-center font-medium text-slate-800 dark:text-slate-200">7.7% p.a.</td>
                  <td className="py-2 px-3 text-center font-medium text-slate-800 dark:text-slate-200">7.5% p.a.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-gray-600 dark:text-slate-400">Lock-in Period</td>
                  <td className="py-2 px-3 text-center font-medium text-slate-800 dark:text-slate-200">5 Years</td>
                  <td className="py-2 px-3 text-center font-medium text-slate-800 dark:text-slate-200">{kvp.years} Yrs {kvp.months} Mo</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-gray-600 dark:text-slate-400">Maturity Value</td>
                  <td className="py-2 px-3 text-center font-bold text-blue-700 dark:text-blue-400">{formatINR(nsc.maturity)}</td>
                  <td className="py-2 px-3 text-center font-bold text-green-700 dark:text-green-400">{formatINR(kvp.maturity)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-gray-600 dark:text-slate-400">Interest Earned</td>
                  <td className="py-2 px-3 text-center text-green-600 dark:text-green-400">{formatINR(nsc.interest)}</td>
                  <td className="py-2 px-3 text-center text-green-600 dark:text-green-400">{formatINR(kvp.interest)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-gray-600 dark:text-slate-400">Section 80C Benefit</td>
                  <td className="py-2 px-3 text-center text-green-600 dark:text-green-400 font-medium">Yes</td>
                  <td className="py-2 px-3 text-center text-red-500 dark:text-red-400 font-medium">No</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-gray-600 dark:text-slate-400">Compounding</td>
                  <td className="py-2 px-3 text-center text-slate-800 dark:text-slate-200">Annual</td>
                  <td className="py-2 px-3 text-center text-slate-800 dark:text-slate-200">Annual</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-gray-600 dark:text-slate-400">Premature Withdrawal</td>
                  <td className="py-2 px-3 text-center text-red-500 dark:text-red-400">Not Allowed</td>
                  <td className="py-2 px-3 text-center text-yellow-600 dark:text-yellow-400">After 2.5 Years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
