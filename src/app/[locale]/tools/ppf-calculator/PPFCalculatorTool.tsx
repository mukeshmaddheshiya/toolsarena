'use client';
import { useState, useMemo } from 'react';
import { PiggyBank, IndianRupee, TrendingUp, Calendar, Shield, Info, TrendingDown, BarChart3 } from 'lucide-react';
import React from 'react';

interface YearData {
  year: number;
  deposit: number;
  openingBalance: number;
  interest: number;
  closingBalance: number;
  totalDeposited: number;
  totalInterest: number;
}

function calculatePPF(annual: number, rate: number, tenure: number): { years: YearData[]; summary: { totalDeposit: number; totalInterest: number; maturity: number } } {
  const years: YearData[] = [];
  let balance = 0;
  let totalDeposited = 0;
  let totalInterest = 0;

  for (let y = 1; y <= tenure; y++) {
    const opening = balance;
    const deposit = annual;
    totalDeposited += deposit;
    const interest = (opening + deposit) * (rate / 100);
    totalInterest += interest;
    balance = opening + deposit + interest;

    years.push({
      year: y,
      deposit,
      openingBalance: opening,
      interest,
      closingBalance: balance,
      totalDeposited,
      totalInterest,
    });
  }

  return {
    years,
    summary: { totalDeposit: totalDeposited, totalInterest, maturity: balance },
  };
}

export function PPFCalculatorTool() {
  const [annualDeposit, setAnnualDeposit] = useState('150000');
  const [interestRate, setInterestRate] = useState('7.1');
  const [tenure, setTenure] = useState('15');
  const [showTable, setShowTable] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [inflationRate, setInflationRate] = useState('6');

  const deposit = parseFloat(annualDeposit) || 0;
  const rate = parseFloat(interestRate) || 0;
  const years = parseInt(tenure) || 15;
  const inflation = parseFloat(inflationRate) || 6;

  const result = useMemo(() => calculatePPF(deposit, rate, years), [deposit, rate, years]);

  const depositPct = result.summary.maturity > 0 ? (result.summary.totalDeposit / result.summary.maturity) * 100 : 0;
  const interestPct = 100 - depositPct;

  // Inflation-adjusted value
  const inflationAdjusted = useMemo(() => {
    const factor = Math.pow(1 + inflation / 100, years);
    return result.summary.maturity / factor;
  }, [result.summary.maturity, inflation, years]);

  // Compare with other investments
  const comparison = useMemo(() => {
    const investments = [
      { name: 'PPF', rate, taxFree: true },
      { name: 'FD (Post-tax)', rate: 7.0 * 0.7, taxFree: false }, // 30% tax bracket
      { name: 'NPS (Equity)', rate: 10, taxFree: false },
      { name: 'ELSS (Equity MF)', rate: 12, taxFree: false },
      { name: 'Sukanya Samriddhi', rate: 8.2, taxFree: true },
    ];
    return investments.map(inv => {
      const r = calculatePPF(deposit, inv.rate, years);
      const postTax = inv.taxFree ? r.summary.maturity : r.summary.maturity - (r.summary.totalInterest * 0.1); // simplified LTCG
      return { ...inv, maturity: postTax };
    });
  }, [deposit, rate, years]);

  // SVG Donut Chart
  const donutChart = useMemo(() => {
    const size = 160;
    const r = 60;
    const cx = size / 2;
    const cy = size / 2;
    const circ = 2 * Math.PI * r;
    const depositLen = (depositPct / 100) * circ;
    const interestLen = (interestPct / 100) * circ;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="20" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#6366f1" strokeWidth="20"
          strokeDasharray={`${depositLen} ${circ}`} strokeDashoffset="0"
          transform={`rotate(-90 ${cx} ${cy})`} className="transition-all duration-500" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22c55e" strokeWidth="20"
          strokeDasharray={`${interestLen} ${circ}`} strokeDashoffset={`${-depositLen}`}
          transform={`rotate(-90 ${cx} ${cy})`} className="transition-all duration-500" />
        <text x={cx} y={cy - 8} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-xs font-bold">
          Rs {(result.summary.maturity / 100000).toFixed(1)}L
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" className="fill-slate-500 text-[9px]">
          Maturity
        </text>
      </svg>
    );
  }, [depositPct, interestPct, result.summary.maturity]);

  // Milestone years for bar chart
  const milestones = useMemo(() => {
    const ms = [5, 10, 15, 20, 25, 30].filter(y => y <= years);
    return ms.map(y => {
      const r = calculatePPF(deposit, rate, y);
      return { year: y, value: r.summary.maturity, deposit: r.summary.totalDeposit, interest: r.summary.totalInterest };
    });
  }, [deposit, rate, years]);

  const maxMilestone = Math.max(...milestones.map(m => m.value), 1);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">PPF Calculator India</h2>
            <p className="text-indigo-200 text-xs">Public Provident Fund returns calculator | Tax-free under Section 80C</p>
          </div>
        </div>
      </div>

      {/* Current Rate Badge */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-lg font-medium">
          Current Rate: 7.1% p.a. (Q4 FY 2025-26)
        </span>
        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-lg font-medium">
          Lock-in: 15 years
        </span>
        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2.5 py-1 rounded-lg font-medium">
          Tax-Free (EEE)
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Annual Deposit (Rs)</label>
            <input type="number" value={annualDeposit} onChange={e => setAnnualDeposit(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            <input type="range" min="500" max="150000" step="500" value={deposit}
              onChange={e => setAnnualDeposit(e.target.value)}
              className="w-full mt-1.5 accent-indigo-600" />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Rs 500 (min)</span>
              <span>Rs 1,50,000 (max)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Interest Rate (% p.a.)</label>
            <input type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} step="0.1"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {[7.0, 7.1, 7.5, 8.0, 8.5].map(r => (
                <button key={r} onClick={() => setInterestRate(String(r))}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${rate === r ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-indigo-50'}`}>
                  {r}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Tenure (Years)</label>
            <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} min="15" max="50"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {[15, 20, 25, 30].map(y => (
                <button key={y} onClick={() => setTenure(String(y))}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${years === y ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-indigo-50'}`}>
                  {y} years
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Minimum 15 years, extendable in blocks of 5 years</p>
          </div>

          {/* Monthly equivalent */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-[10px] text-slate-500">Monthly Deposit Equivalent</div>
            <div className="text-lg font-bold text-indigo-600">Rs {Math.round(deposit / 12).toLocaleString('en-IN')}/month</div>
          </div>

          {/* Tax Savings */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
            <div className="text-[10px] text-green-600 uppercase font-medium mb-1">Annual Tax Saving (Section 80C)</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { slab: '5%', save: deposit * 0.05 },
                { slab: '20%', save: deposit * 0.20 },
                { slab: '30%', save: deposit * 0.30 },
              ].map(s => (
                <div key={s.slab}>
                  <div className="text-[10px] text-slate-500">{s.slab} slab</div>
                  <div className="text-xs font-bold text-green-600">Rs {s.save.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {/* Donut Chart */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-6">
            <div className="flex-shrink-0">{donutChart}</div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-indigo-500" />
                <div className="text-xs">
                  <div className="text-slate-500">Total Invested</div>
                  <div className="font-bold text-slate-700 dark:text-slate-300">Rs {result.summary.totalDeposit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <div className="text-xs">
                  <div className="text-slate-500">Interest Earned</div>
                  <div className="font-bold text-green-600">Rs {result.summary.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="text-[10px] text-slate-500">Maturity Amount</div>
                <div className="text-xl font-bold text-indigo-600">Rs {result.summary.maturity.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 text-center">
              <div className="text-[10px] text-indigo-500 uppercase">Deposited</div>
              <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300">Rs {(result.summary.totalDeposit / 100000).toFixed(1)}L</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
              <div className="text-[10px] text-green-500 uppercase">Interest</div>
              <div className="text-sm font-bold text-green-700 dark:text-green-300">Rs {(result.summary.totalInterest / 100000).toFixed(1)}L</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center">
              <div className="text-[10px] text-purple-500 uppercase">Wealth Gain</div>
              <div className="text-sm font-bold text-purple-700 dark:text-purple-300">{result.summary.totalDeposit > 0 ? ((result.summary.totalInterest / result.summary.totalDeposit) * 100).toFixed(0) : 0}%</div>
            </div>
          </div>

          {/* Growth Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Deposit ({depositPct.toFixed(0)}%)</span>
              <span>Interest ({interestPct.toFixed(0)}%)</span>
            </div>
            <div className="h-4 rounded-full overflow-hidden flex">
              <div className="bg-indigo-500 h-full transition-all" style={{ width: `${depositPct}%` }} />
              <div className="bg-green-500 h-full transition-all" style={{ width: `${interestPct}%` }} />
            </div>
          </div>

          {/* Inflation-Adjusted Value */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> Inflation-Adjusted Value
              </div>
              <div className="flex items-center gap-1">
                <input type="number" value={inflationRate} onChange={e => setInflationRate(e.target.value)}
                  className="w-14 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-center focus:ring-1 focus:ring-amber-500 outline-none" />
                <span className="text-[10px] text-amber-600">% inflation</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-[10px] text-slate-500">Nominal (Today)</div>
                <div className="text-sm font-bold text-indigo-600">Rs {(result.summary.maturity / 100000).toFixed(1)}L</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Real Value (After inflation)</div>
                <div className="text-sm font-bold text-amber-600">Rs {(inflationAdjusted / 100000).toFixed(1)}L</div>
              </div>
            </div>
            <div className="text-[10px] text-amber-500 mt-1 text-center">
              Purchasing power reduces by {((1 - inflationAdjusted / result.summary.maturity) * 100).toFixed(0)}% over {years} years at {inflation}% inflation
            </div>
          </div>

          {/* Growth Milestone Chart */}
          {milestones.length > 1 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <h5 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-1">
                <BarChart3 className="w-3 h-3" /> Growth at Milestones
              </h5>
              <div className="flex items-end gap-2 h-32">
                {milestones.map(m => (
                  <div key={m.year} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] font-bold text-indigo-600">Rs {(m.value / 100000).toFixed(1)}L</div>
                    <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                      <div className="w-full bg-green-400 rounded-t transition-all" style={{ height: `${(m.interest / m.value) * (m.value / maxMilestone) * 80}px` }} />
                      <div className="w-full bg-indigo-400 rounded-b transition-all" style={{ height: `${(m.deposit / m.value) * (m.value / maxMilestone) * 80}px` }} />
                    </div>
                    <div className="text-[9px] text-slate-500">Yr {m.year}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-2 text-[9px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-400" /> Deposits</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-400" /> Interest</span>
              </div>
            </div>
          )}

          {/* Compare with other investments */}
          <button onClick={() => setShowComparison(!showComparison)}
            className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            {showComparison ? 'Hide' : 'Compare with'} Other Investments
          </button>

          {showComparison && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    {['Investment', 'Rate', 'Maturity', 'vs PPF'].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {comparison.map(inv => {
                    const diff = inv.maturity - result.summary.maturity;
                    return (
                      <tr key={inv.name} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${inv.name === 'PPF' ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                        <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-300">
                          {inv.name}
                          {inv.taxFree && <span className="ml-1 text-[8px] bg-green-100 text-green-600 px-1 rounded">Tax-Free</span>}
                        </td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{inv.rate.toFixed(1)}%</td>
                        <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-300">Rs {(inv.maturity / 100000).toFixed(1)}L</td>
                        <td className={`px-3 py-2 font-medium ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                          {inv.name === 'PPF' ? '-' : `${diff >= 0 ? '+' : ''}Rs ${(diff / 100000).toFixed(1)}L`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-[9px] text-slate-400 px-3 py-1.5 bg-slate-50 dark:bg-slate-800">
                * Returns are approximate. Equity returns assume 10% LTCG tax above Rs 1L. FD assumes 30% tax bracket. Past performance does not guarantee future results.
              </p>
            </div>
          )}

          {/* Year-by-Year Table */}
          <button onClick={() => setShowTable(!showTable)}
            className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors">
            {showTable ? 'Hide' : 'Show'} Year-by-Year Breakdown
          </button>

          {showTable && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    {['Year', 'Deposit', 'Interest', 'Balance'].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {result.years.map(y => (
                    <tr key={y.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-300">{y.year}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Rs {y.deposit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      <td className="px-3 py-2 text-green-600">Rs {y.interest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      <td className="px-3 py-2 font-medium text-indigo-600">Rs {y.closingBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">PPF Account Rules</h4>
        <div className="grid md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-2">
            <p><strong>Tax Benefits (EEE):</strong> PPF enjoys Exempt-Exempt-Exempt status — deposit up to Rs 1.5L qualifies for 80C deduction, interest is tax-free, and maturity is also tax-free.</p>
            <p><strong>Deposit Limits:</strong> Minimum Rs 500/year, Maximum Rs 1,50,000/year. Can be deposited in lump sum or up to 12 installments.</p>
            <p><strong>Partial Withdrawal:</strong> Allowed from 7th year onwards. Can withdraw up to 50% of balance at the end of 4th year or previous year, whichever is lower.</p>
          </div>
          <div className="space-y-2">
            <p><strong>Loan Against PPF:</strong> Available from 3rd to 6th year. Maximum 25% of balance at end of 2nd preceding year. Interest is 1% above PPF rate.</p>
            <p><strong>Extension:</strong> After 15 years, can extend in blocks of 5 years with or without fresh contributions.</p>
            <p><strong>Where to Open:</strong> Post offices, SBI, and most nationalized banks. Can also open online through internet banking of select banks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
