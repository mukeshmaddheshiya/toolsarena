'use client';
import { useState, useMemo } from 'react';

type Frequency = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

const FREQUENCIES: { value: Frequency; label: string; n: number }[] = [
  { value: 'monthly', label: 'Monthly (12/yr)', n: 12 },
  { value: 'quarterly', label: 'Quarterly (4/yr)', n: 4 },
  { value: 'half-yearly', label: 'Half-Yearly (2/yr)', n: 2 },
  { value: 'yearly', label: 'Yearly (1/yr)', n: 1 },
];

interface YearRow {
  year: number;
  openingBalance: number;
  interest: number;
  closingBalance: number;
}

function calcCI(principal: number, rate: number, years: number, compFreq: number) {
  const amount = principal * Math.pow(1 + rate / 100 / compFreq, compFreq * years);
  const interest = amount - principal;
  return { amount, interest };
}

function buildYearlyBreakdown(principal: number, rate: number, years: number, compFreq: number): YearRow[] {
  const rows: YearRow[] = [];
  let balance = principal;
  for (let y = 1; y <= years; y++) {
    const closing = balance * Math.pow(1 + rate / 100 / compFreq, compFreq);
    const interest = closing - balance;
    rows.push({ year: y, openingBalance: balance, interest, closingBalance: closing });
    balance = closing;
  }
  return rows;
}

const fmtINR = (n: number) => '\u20B9' + Math.round(n).toLocaleString('en-IN');
const fmtNum = (n: number) => Math.round(n).toLocaleString('en-IN');

export function CompoundInterestCalculatorTool() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState<Frequency>('yearly');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const compFreq = FREQUENCIES.find(f => f.value === frequency)!.n;

  const { amount, interest } = useMemo(
    () => calcCI(principal, rate, years, compFreq),
    [principal, rate, years, compFreq],
  );

  const breakdown = useMemo(
    () => (showBreakdown ? buildYearlyBreakdown(principal, rate, years, compFreq) : []),
    [showBreakdown, principal, rate, years, compFreq],
  );

  const principalPct = (principal / amount) * 100;
  const interestPct = (interest / amount) * 100;

  // Simple interest comparison
  const simpleInterest = principal * rate * years / 100;
  const ciAdvantage = interest - simpleInterest;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Principal */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Principal Amount
            </label>
            <span className="text-sm font-bold text-primary-700 dark:text-primary-400">
              {fmtINR(principal)}
            </span>
          </div>
          <input
            type="range"
            min={1000}
            max={10000000}
            step={1000}
            value={principal}
            onChange={e => setPrincipal(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
          />
          <input
            type="number"
            value={principal}
            min={1000}
            max={100000000}
            step={1000}
            onChange={e => setPrincipal(Math.max(1000, parseFloat(e.target.value) || 1000))}
            className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
          />
        </div>

        {/* Rate */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Interest Rate (% p.a.)
            </label>
            <span className="text-sm font-bold text-primary-700 dark:text-primary-400">
              {rate}%
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={0.1}
            value={rate}
            onChange={e => setRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
          />
          <input
            type="number"
            value={rate}
            min={1}
            max={50}
            step={0.1}
            onChange={e => setRate(Math.max(0.1, parseFloat(e.target.value) || 1))}
            className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
          />
        </div>

        {/* Years */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Time Period (years)
            </label>
            <span className="text-sm font-bold text-primary-700 dark:text-primary-400">
              {years} yr
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={years}
            onChange={e => setYears(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
          />
          <input
            type="number"
            value={years}
            min={1}
            max={50}
            step={1}
            onChange={e => setYears(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
          />
        </div>

        {/* Compounding Frequency */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Compounding Frequency
          </label>
          <select
            value={frequency}
            onChange={e => setFrequency(e.target.value as Frequency)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
          >
            {FREQUENCIES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            How often interest is compounded
          </p>
        </div>
      </div>

      {/* Results Card */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="text-sm text-primary-200 mb-1">Total Value at Maturity</div>
          <div className="text-4xl font-heading font-bold">{fmtINR(amount)}</div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm text-primary-200">Principal</div>
            <div className="font-bold text-lg">{fmtINR(principal)}</div>
            <div className="text-xs text-primary-300">{principalPct.toFixed(1)}%</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm text-primary-200">Total Interest</div>
            <div className="font-bold text-lg">{fmtINR(interest)}</div>
            <div className="text-xs text-primary-300">{interestPct.toFixed(1)}%</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm text-primary-200">Interest Earned</div>
            <div className="font-bold text-lg">{(interest / principal * 100).toFixed(1)}%</div>
            <div className="text-xs text-primary-300">on principal</div>
          </div>
        </div>

        {/* Visual bar */}
        <div className="mt-5 h-4 rounded-full overflow-hidden bg-primary-950 flex">
          <div
            className="bg-emerald-400 transition-all duration-500 rounded-l-full"
            style={{ width: `${principalPct}%` }}
          />
          <div className="bg-amber-400 flex-1 rounded-r-full" />
        </div>
        <div className="flex justify-between text-xs mt-1.5 text-primary-300">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            Principal {principalPct.toFixed(1)}%
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-400" />
            Interest {interestPct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* CI vs SI Comparison */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Compound Interest vs Simple Interest
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Compound Interest</div>
            <div className="text-lg font-bold text-primary-700 dark:text-primary-400">{fmtINR(interest)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Simple Interest</div>
            <div className="text-lg font-bold text-slate-600 dark:text-slate-300">{fmtINR(simpleInterest)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Extra Earnings (CI)</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">+{fmtINR(ciAdvantage)}</div>
          </div>
        </div>

        {/* CI vs SI bar comparison */}
        <div className="mt-4 space-y-2">
          <div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>CI: {fmtINR(amount)}</span>
              <span>100%</span>
            </div>
            <div className="h-3 bg-primary-200 dark:bg-primary-900 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>SI: {fmtINR(principal + simpleInterest)}</span>
              <span>{((principal + simpleInterest) / amount * 100).toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-400 dark:bg-slate-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (principal + simpleInterest) / amount * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Formula Used
        </h3>
        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-700 dark:text-slate-300 text-center">
          A = P × (1 + r/n)<sup>n×t</sup>
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div><strong className="text-slate-700 dark:text-slate-300">A</strong> = Final Amount</div>
          <div><strong className="text-slate-700 dark:text-slate-300">P</strong> = Principal ({fmtINR(principal)})</div>
          <div><strong className="text-slate-700 dark:text-slate-300">r</strong> = Rate ({rate}%)</div>
          <div><strong className="text-slate-700 dark:text-slate-300">n</strong> = Comp. freq ({compFreq}/yr)</div>
          <div><strong className="text-slate-700 dark:text-slate-300">t</strong> = Time ({years} yrs)</div>
        </div>
      </div>

      {/* Year-by-Year Breakdown */}
      <div>
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline"
        >
          {showBreakdown ? 'Hide' : 'Show'} Year-by-Year Breakdown &rarr;
        </button>
        {showBreakdown && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-96">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                <tr>
                  {['Year', 'Opening Balance', 'Interest Earned', 'Closing Balance'].map(h => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {breakdown.map(row => (
                  <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-2 text-slate-900 dark:text-slate-100 font-medium">
                      {row.year}
                    </td>
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                      {fmtINR(row.openingBalance)}
                    </td>
                    <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400 font-medium">
                      +{fmtINR(row.interest)}
                    </td>
                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300 font-medium">
                      {fmtINR(row.closingBalance)}
                    </td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <td className="px-4 py-2.5 text-slate-900 dark:text-slate-100">Total</td>
                  <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{fmtINR(principal)}</td>
                  <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400">+{fmtINR(interest)}</td>
                  <td className="px-4 py-2.5 text-slate-900 dark:text-slate-100">{fmtINR(amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        * This calculator provides estimates for educational purposes. Actual returns depend on the financial product,
        institution, and applicable taxes. Consult a financial advisor for investment decisions.
      </p>
    </div>
  );
}
