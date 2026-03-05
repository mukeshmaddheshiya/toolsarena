'use client';
import { useState, useMemo } from 'react';
import { TrendingUp, IndianRupee, BarChart3, ArrowUpRight, Calculator, PieChart, Target, TrendingDown } from 'lucide-react';
import React from 'react';

type InvestMode = 'sip' | 'lumpsum' | 'both';

interface CalcResult {
  invested: number;
  returns: number;
  total: number;
  xirr: number;
  yearlyData: { year: number; invested: number; value: number }[];
}

function calcSIP(monthly: number, rate: number, years: number): CalcResult {
  const months = years * 12;
  const r = rate / 100 / 12;
  const yearlyData: { year: number; invested: number; value: number }[] = [];

  let totalValue = 0;
  if (r > 0) {
    totalValue = monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  } else {
    totalValue = monthly * months;
  }

  for (let y = 1; y <= years; y++) {
    const m = y * 12;
    const val = r > 0 ? monthly * ((Math.pow(1 + r, m) - 1) / r) * (1 + r) : monthly * m;
    yearlyData.push({ year: y, invested: monthly * m, value: val });
  }

  const invested = monthly * months;
  return { invested, returns: totalValue - invested, total: totalValue, xirr: rate, yearlyData };
}

function calcLumpsum(amount: number, rate: number, years: number): CalcResult {
  const r = rate / 100;
  const yearlyData: { year: number; invested: number; value: number }[] = [];

  for (let y = 1; y <= years; y++) {
    yearlyData.push({ year: y, invested: amount, value: amount * Math.pow(1 + r, y) });
  }

  const total = amount * Math.pow(1 + r, years);
  return { invested: amount, returns: total - amount, total, xirr: rate, yearlyData };
}

// SIP needed for goal
function sipForGoal(targetAmount: number, rate: number, years: number): number {
  const months = years * 12;
  const r = rate / 100 / 12;
  if (r <= 0) return targetAmount / months;
  return targetAmount / (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
}

export function MutualFundCalculatorTool() {
  const [mode, setMode] = useState<InvestMode>('sip');
  const [sipAmount, setSipAmount] = useState('10000');
  const [lumpsumAmount, setLumpsumAmount] = useState('500000');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [years, setYears] = useState('10');
  const [showTable, setShowTable] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [goalAmount, setGoalAmount] = useState('5000000');
  const [inflationRate, setInflationRate] = useState('6');

  const sip = parseFloat(sipAmount) || 0;
  const lumpsum = parseFloat(lumpsumAmount) || 0;
  const rate = parseFloat(expectedReturn) || 0;
  const tenure = parseInt(years) || 1;
  const inflation = parseFloat(inflationRate) || 6;

  const result = useMemo((): CalcResult => {
    if (mode === 'sip') return calcSIP(sip, rate, tenure);
    if (mode === 'lumpsum') return calcLumpsum(lumpsum, rate, tenure);

    const sipRes = calcSIP(sip, rate, tenure);
    const lsRes = calcLumpsum(lumpsum, rate, tenure);
    return {
      invested: sipRes.invested + lsRes.invested,
      returns: sipRes.returns + lsRes.returns,
      total: sipRes.total + lsRes.total,
      xirr: rate,
      yearlyData: sipRes.yearlyData.map((d, i) => ({
        year: d.year,
        invested: d.invested + lsRes.yearlyData[i].invested,
        value: d.value + lsRes.yearlyData[i].value,
      })),
    };
  }, [mode, sip, lumpsum, rate, tenure]);

  const investedPct = result.total > 0 ? (result.invested / result.total) * 100 : 0;
  const returnsPct = 100 - investedPct;
  const wealthMultiplier = result.invested > 0 ? (result.total / result.invested).toFixed(1) : '0';

  // Inflation-adjusted
  const inflationAdjusted = useMemo(() => {
    const factor = Math.pow(1 + inflation / 100, tenure);
    return result.total / factor;
  }, [result.total, inflation, tenure]);

  // Goal planning
  const goalSIP = useMemo(() => {
    const goal = parseFloat(goalAmount) || 0;
    return sipForGoal(goal, rate, tenure);
  }, [goalAmount, rate, tenure]);

  // SVG donut chart
  const donutChart = useMemo(() => {
    const size = 140;
    const r = 50;
    const cx = size / 2;
    const cy = size / 2;
    const circ = 2 * Math.PI * r;
    const investedLen = (investedPct / 100) * circ;
    const returnsLen = (returnsPct / 100) * circ;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="18" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#6366f1" strokeWidth="18"
          strokeDasharray={`${investedLen} ${circ}`} strokeDashoffset="0"
          transform={`rotate(-90 ${cx} ${cy})`} className="transition-all duration-500" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22c55e" strokeWidth="18"
          strokeDasharray={`${returnsLen} ${circ}`} strokeDashoffset={`${-investedLen}`}
          transform={`rotate(-90 ${cx} ${cy})`} className="transition-all duration-500" />
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[10px] font-bold">
          {wealthMultiplier}x
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" className="fill-slate-500 text-[8px]">
          Multiplier
        </text>
      </svg>
    );
  }, [investedPct, returnsPct, wealthMultiplier]);

  // Bar chart
  const maxVal = result.yearlyData.length > 0 ? Math.max(...result.yearlyData.map(d => d.value)) : 1;

  const fundCategories = [
    { name: 'Large Cap', return: '10-12%', risk: 'Moderate', color: 'bg-blue-500' },
    { name: 'Mid Cap', return: '12-15%', risk: 'High', color: 'bg-purple-500' },
    { name: 'Small Cap', return: '15-18%', risk: 'Very High', color: 'bg-red-500' },
    { name: 'Index Fund', return: '10-13%', risk: 'Moderate', color: 'bg-green-500' },
    { name: 'ELSS (Tax)', return: '12-15%', risk: 'High', color: 'bg-amber-500' },
    { name: 'Debt Fund', return: '6-8%', risk: 'Low', color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Mutual Fund Returns Calculator</h2>
            <p className="text-emerald-100 text-xs">SIP & Lumpsum investment calculator | Visualize wealth growth</p>
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        {([['sip', 'SIP (Monthly)'], ['lumpsum', 'Lumpsum (One-time)'], ['both', 'SIP + Lumpsum']] as const).map(([val, label]) => (
          <button key={val} onClick={() => setMode(val)}
            className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${mode === val
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Input */}
        <div className="space-y-4">
          {(mode === 'sip' || mode === 'both') && (
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Monthly SIP Amount (Rs)</label>
              <input type="number" value={sipAmount} onChange={e => setSipAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              <input type="range" min="500" max="100000" step="500" value={sip}
                onChange={e => setSipAmount(e.target.value)}
                className="w-full mt-1.5 accent-emerald-600" />
              <div className="flex flex-wrap gap-1.5 mt-1">
                {[1000, 2500, 5000, 10000, 25000, 50000].map(v => (
                  <button key={v} onClick={() => setSipAmount(String(v))}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${sip === v ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    Rs {v.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(mode === 'lumpsum' || mode === 'both') && (
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Lumpsum Amount (Rs)</label>
              <input type="number" value={lumpsumAmount} onChange={e => setLumpsumAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              <input type="range" min="10000" max="5000000" step="10000" value={lumpsum}
                onChange={e => setLumpsumAmount(e.target.value)}
                className="w-full mt-1.5 accent-emerald-600" />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Expected Annual Return (%)</label>
            <input type="number" value={expectedReturn} onChange={e => setExpectedReturn(e.target.value)} step="0.5"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input type="range" min="4" max="25" step="0.5" value={rate}
              onChange={e => setExpectedReturn(e.target.value)}
              className="w-full mt-1 accent-emerald-600" />
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {[8, 10, 12, 14, 15, 18].map(r => (
                <button key={r} onClick={() => setExpectedReturn(String(r))}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${rate === r ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {r}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Investment Period (Years)</label>
            <input type="number" value={years} onChange={e => setYears(e.target.value)} min="1" max="40"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input type="range" min="1" max="40" value={tenure}
              onChange={e => setYears(e.target.value)}
              className="w-full mt-1.5 accent-emerald-600" />
          </div>

          {/* Fund Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Fund Categories & Expected Returns</h4>
            <div className="grid grid-cols-3 gap-2">
              {fundCategories.map(f => (
                <button key={f.name} onClick={() => setExpectedReturn(f.return.split('-')[0])}
                  className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={`w-2 h-2 rounded-full ${f.color}`} />
                    <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">{f.name}</span>
                  </div>
                  <div className="text-[9px] text-slate-500">{f.return} | {f.risk}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {/* Total with donut */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">{donutChart}</div>
              <div className="flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-indigo-500" />
                    <div className="text-xs">
                      <span className="text-slate-500">Invested: </span>
                      <span className="font-bold text-indigo-600">Rs {(result.invested / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <div className="text-xs">
                      <span className="text-slate-500">Returns: </span>
                      <span className="font-bold text-green-600">Rs {(result.returns / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                  <div className="border-t pt-2">
                    <div className="text-[10px] text-slate-500">Total Value</div>
                    <div className="text-xl font-bold text-emerald-600">Rs {(result.total / 100000).toFixed(1)}L</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-lg text-xs font-medium">
                {wealthMultiplier}x wealth multiplier in {tenure} years
              </span>
            </div>
          </div>

          {/* Growth Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Invested ({investedPct.toFixed(0)}%)</span>
              <span>Returns ({returnsPct.toFixed(0)}%)</span>
            </div>
            <div className="h-5 rounded-full overflow-hidden flex">
              <div className="bg-indigo-500 h-full transition-all" style={{ width: `${investedPct}%` }} />
              <div className="bg-green-500 h-full transition-all" style={{ width: `${returnsPct}%` }} />
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">Growth Over Time</h4>
            <div className="flex items-end gap-1 h-32">
              {result.yearlyData.map(d => (
                <div key={d.year} className="flex-1 flex flex-col items-center gap-0.5" title={`Year ${d.year}: Rs ${Math.round(d.value).toLocaleString('en-IN')}`}>
                  <div className="w-full relative rounded-t" style={{ height: `${(d.value / maxVal) * 100}%`, minHeight: '4px' }}>
                    <div className="absolute inset-0 bg-green-500 rounded-t" />
                    <div className="absolute inset-0 bg-indigo-500 rounded-b" style={{ height: `${(d.invested / d.value) * 100}%`, top: 'auto' }} />
                  </div>
                  {(d.year === 1 || d.year === tenure || d.year % 5 === 0) && (
                    <span className="text-[8px] text-slate-400">{d.year}Y</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-2 text-[9px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-500" /> Invested</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500" /> Returns</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-500">Absolute Returns</div>
              <div className="text-sm font-bold text-green-600">{result.invested > 0 ? ((result.returns / result.invested) * 100).toFixed(0) : 0}%</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-500">In Rs Crore</div>
              <div className="text-sm font-bold text-emerald-600">Rs {(result.total / 10000000).toFixed(2)} Cr</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-500">CAGR</div>
              <div className="text-sm font-bold text-blue-600">{rate}%</div>
            </div>
          </div>

          {/* Inflation-Adjusted */}
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
                <div className="text-[10px] text-slate-500">Nominal Value</div>
                <div className="text-sm font-bold text-emerald-600">Rs {(result.total / 100000).toFixed(1)}L</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Real Value (Today's money)</div>
                <div className="text-sm font-bold text-amber-600">Rs {(inflationAdjusted / 100000).toFixed(1)}L</div>
              </div>
            </div>
            <div className="text-[10px] text-amber-500 mt-1 text-center">
              Real annual return after inflation: {(rate - inflation).toFixed(1)}% | Purchasing power loss: {((1 - inflationAdjusted / result.total) * 100).toFixed(0)}%
            </div>
          </div>

          {/* Goal-based Planning */}
          <button onClick={() => setShowGoal(!showGoal)}
            className={`w-full py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${showGoal ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}>
            <Target className="w-3.5 h-3.5" />
            {showGoal ? 'Hide' : 'Show'} Goal-Based SIP Planner
          </button>

          {showGoal && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-3">
              <div>
                <label className="text-xs text-blue-700 dark:text-blue-400 font-medium mb-1 block">Target Amount (Rs)</label>
                <input type="number" value={goalAmount} onChange={e => setGoalAmount(e.target.value)}
                  className="w-full rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {[
                    { label: 'Rs 10L', val: '1000000' },
                    { label: 'Rs 25L', val: '2500000' },
                    { label: 'Rs 50L', val: '5000000' },
                    { label: 'Rs 1 Cr', val: '10000000' },
                    { label: 'Rs 5 Cr', val: '50000000' },
                  ].map(g => (
                    <button key={g.val} onClick={() => setGoalAmount(g.val)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium ${goalAmount === g.val ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'}`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center">
                <div className="text-[10px] text-slate-500">Required Monthly SIP at {rate}% for {tenure} years</div>
                <div className="text-xl font-bold text-blue-600">Rs {Math.round(goalSIP).toLocaleString('en-IN')}/month</div>
                <div className="text-[10px] text-slate-400 mt-1">Daily: Rs {Math.round(goalSIP / 30).toLocaleString('en-IN')} | Weekly: Rs {Math.round(goalSIP * 12 / 52).toLocaleString('en-IN')}</div>
              </div>
            </div>
          )}

          {/* Year table toggle */}
          <button onClick={() => setShowTable(!showTable)}
            className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors">
            {showTable ? 'Hide' : 'Show'} Year-by-Year Breakdown
          </button>

          {showTable && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    {['Year', 'Invested', 'Value', 'Gain'].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {result.yearlyData.map(y => (
                    <tr key={y.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-300">{y.year}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Rs {y.invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      <td className="px-3 py-2 font-medium text-emerald-600">Rs {y.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      <td className="px-3 py-2 text-green-600">Rs {(y.value - y.invested).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
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
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mutual Fund Investment Tips</h4>
        <div className="grid md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-2">
            <p><strong>SIP vs Lumpsum:</strong> SIP (Systematic Investment Plan) averages out market volatility through rupee cost averaging. Lumpsum works better in a rising market. Combine both for optimal strategy.</p>
            <p><strong>Power of Compounding:</strong> Starting early matters more than investing more. Rs 5,000/month SIP at 12% for 25 years = Rs 95L. Starting 10 years late with Rs 10,000/month = only Rs 50L.</p>
          </div>
          <div className="space-y-2">
            <p><strong>Tax on Mutual Funds:</strong> Equity funds: STCG (15%) if sold within 1 year, LTCG (12.5%) above Rs 1.25L/year if held over 1 year. Debt funds: taxed at slab rate.</p>
            <p><strong>ELSS for Tax Saving:</strong> Equity Linked Saving Scheme qualifies for Section 80C deduction up to Rs 1.5L. Shortest lock-in (3 years) among all 80C instruments.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
