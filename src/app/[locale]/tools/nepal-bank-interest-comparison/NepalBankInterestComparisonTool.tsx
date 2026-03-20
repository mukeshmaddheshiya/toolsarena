'use client';

import { useState } from 'react';
import { Landmark, TrendingUp, Info } from 'lucide-react';

interface BankData {
  name: string;
  shortName: string;
  type: string;
  savingsRate: number;
  fd3m: number;
  fd6m: number;
  fd1y: number;
  fd2y: number;
}

const BANKS: BankData[] = [
  {
    name: 'Nepal Bank Limited',
    shortName: 'NBL',
    type: 'Government',
    savingsRate: 4.5,
    fd3m: 6.5,
    fd6m: 7.5,
    fd1y: 8.5,
    fd2y: 8.75,
  },
  {
    name: 'Rastriya Banijya Bank',
    shortName: 'RBB',
    type: 'Government',
    savingsRate: 4.5,
    fd3m: 6.5,
    fd6m: 7.5,
    fd1y: 8.5,
    fd2y: 8.75,
  },
  {
    name: 'NABIL Bank',
    shortName: 'NABIL',
    type: 'Private',
    savingsRate: 5.0,
    fd3m: 7.0,
    fd6m: 8.0,
    fd1y: 9.5,
    fd2y: 9.75,
  },
  {
    name: 'Standard Chartered Nepal',
    shortName: 'SCB Nepal',
    type: 'Joint Venture',
    savingsRate: 4.0,
    fd3m: 6.0,
    fd6m: 7.0,
    fd1y: 8.0,
    fd2y: 8.25,
  },
  {
    name: 'Himalayan Bank',
    shortName: 'HBL',
    type: 'Private',
    savingsRate: 5.0,
    fd3m: 7.0,
    fd6m: 8.0,
    fd1y: 9.5,
    fd2y: 9.75,
  },
  {
    name: 'NIC Asia Bank',
    shortName: 'NIC Asia',
    type: 'Private',
    savingsRate: 5.5,
    fd3m: 7.5,
    fd6m: 8.5,
    fd1y: 10.0,
    fd2y: 10.25,
  },
  {
    name: 'Everest Bank',
    shortName: 'EBL',
    type: 'Joint Venture',
    savingsRate: 5.0,
    fd3m: 7.0,
    fd6m: 8.0,
    fd1y: 9.5,
    fd2y: 9.75,
  },
  {
    name: 'Sanima Bank',
    shortName: 'Sanima',
    type: 'Private',
    savingsRate: 5.5,
    fd3m: 7.5,
    fd6m: 8.5,
    fd1y: 10.0,
    fd2y: 10.5,
  },
  {
    name: 'Global IME Bank',
    shortName: 'GIBL',
    type: 'Private',
    savingsRate: 5.5,
    fd3m: 7.5,
    fd6m: 8.5,
    fd1y: 10.0,
    fd2y: 10.25,
  },
  {
    name: 'NMB Bank',
    shortName: 'NMB',
    type: 'Private',
    savingsRate: 5.5,
    fd3m: 7.5,
    fd6m: 8.5,
    fd1y: 10.0,
    fd2y: 10.5,
  },
  {
    name: 'Kumari Bank',
    shortName: 'Kumari',
    type: 'Private',
    savingsRate: 5.5,
    fd3m: 7.5,
    fd6m: 8.5,
    fd1y: 9.75,
    fd2y: 10.0,
  },
];

type Tab = 'savings' | 'fd';
type Tenure = '3m' | '6m' | '1y' | '2y';

const TENURE_LABELS: Record<Tenure, string> = {
  '3m': '3 Months',
  '6m': '6 Months',
  '1y': '1 Year',
  '2y': '2 Years',
};

const TENURE_YEARS: Record<Tenure, number> = {
  '3m': 0.25,
  '6m': 0.5,
  '1y': 1,
  '2y': 2,
};

const TYPE_COLORS: Record<string, string> = {
  Government: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Private: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Joint Venture': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

function fmt(n: number): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function NepalBankInterestComparisonTool() {
  const [tab, setTab] = useState<Tab>('fd');
  const [tenure, setTenure] = useState<Tenure>('1y');
  const [amount, setAmount] = useState<string>('100000');

  const principal = parseFloat(amount) || 0;
  const tenureYears = TENURE_YEARS[tenure];

  function getRateForBank(bank: BankData): number {
    if (tab === 'savings') return bank.savingsRate;
    const fdRates: Record<Tenure, number> = {
      '3m': bank.fd3m,
      '6m': bank.fd6m,
      '1y': bank.fd1y,
      '2y': bank.fd2y,
    };
    return fdRates[tenure];
  }

  const sortedBanks = [...BANKS].sort((a, b) => getRateForBank(b) - getRateForBank(a));
  const topRate = getRateForBank(sortedBanks[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-5 flex items-center gap-2">
          <Landmark className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Nepal Bank Interest Rate Comparison
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-900/40">
          <button
            onClick={() => setTab('savings')}
            className={[
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              tab === 'savings'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
            ].join(' ')}
          >
            Savings Account
          </button>
          <button
            onClick={() => setTab('fd')}
            className={[
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              tab === 'fd'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
            ].join(' ')}
          >
            Fixed Deposit
          </button>
        </div>

        {/* Tenure selector (FD only) */}
        {tab === 'fd' && (
          <div className="mb-4 flex flex-wrap gap-2">
            {(Object.keys(TENURE_LABELS) as Tenure[]).map((t) => (
              <button
                key={t}
                onClick={() => setTenure(t)}
                className={[
                  'rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors',
                  tenure === t
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400',
                ].join(' ')}
              >
                {TENURE_LABELS[t]}
              </button>
            ))}
          </div>
        )}

        {/* Amount input */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">
            Investment Amount (रु)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-gray-500 dark:text-gray-400">
              रु
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-9 pr-4 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter amount"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Best rate highlight */}
      {principal > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
          <div className="flex items-center gap-2 text-sm opacity-80">
            <TrendingUp className="h-4 w-4" />
            Best available rate for {tab === 'savings' ? 'savings' : TENURE_LABELS[tenure]}
          </div>
          <div className="mt-1 text-3xl font-bold">{topRate}% p.a.</div>
          <div className="mt-1 text-sm opacity-80">
            At {sortedBanks[0].name} · Interest earned:{' '}
            <span className="font-semibold">
              रु {fmt(principal * (topRate / 100) * tenureYears)}
            </span>{' '}
            · Maturity:{' '}
            <span className="font-semibold">
              रु {fmt(principal + principal * (topRate / 100) * tenureYears)}
            </span>
          </div>
        </div>
      )}

      {/* Comparison table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            {tab === 'savings' ? 'Savings Account Rates' : `Fixed Deposit Rates — ${TENURE_LABELS[tenure]}`}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Sorted by highest rate · All rates % per annum · Indicative 2025 figures
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                  Rank
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                  Bank
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">
                  Rate (% p.a.)
                </th>
                {principal > 0 && (
                  <>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">
                      Interest Earned
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">
                      Maturity Amount
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {sortedBanks.map((bank, idx) => {
                const rate = getRateForBank(bank);
                const interest = principal * (rate / 100) * tenureYears;
                const maturity = principal + interest;
                const isTop = idx === 0;
                return (
                  <tr
                    key={bank.shortName}
                    className={
                      isTop
                        ? 'bg-blue-50/60 dark:bg-blue-950/20'
                        : 'hover:bg-gray-50/50 dark:hover:bg-gray-750/50'
                    }
                  >
                    <td className="px-4 py-3">
                      <span
                        className={[
                          'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                          isTop
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
                        ].join(' ')}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {bank.name}
                      </div>
                      <span
                        className={[
                          'mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                          TYPE_COLORS[bank.type],
                        ].join(' ')}
                      >
                        {bank.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={[
                          'text-base font-bold',
                          isTop ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300',
                        ].join(' ')}
                      >
                        {rate}%
                      </span>
                    </td>
                    {principal > 0 && (
                      <>
                        <td className="px-4 py-3 text-right font-medium text-green-700 dark:text-green-400">
                          रु {fmt(interest)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800 dark:text-gray-100">
                          रु {fmt(maturity)}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FD full rates table */}
      {tab === 'fd' && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              All FD Rates by Tenure
            </h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              % per annum — rates updated quarterly per NRB directives
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Bank</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">3 Months</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">6 Months</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">1 Year</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">2 Years</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {BANKS.map((bank) => (
                  <tr key={bank.shortName} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/50">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                      {bank.shortName}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{bank.fd3m}%</td>
                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{bank.fd6m}%</td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-700 dark:text-blue-400">{bank.fd1y}%</td>
                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{bank.fd2y}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Interest rates are indicative figures based on 2025 NRB-published data. Banks revise
          rates quarterly. Always confirm current rates directly with your bank before investing.
          Interest is subject to 5% TDS.
        </span>
      </div>
    </div>
  );
}
