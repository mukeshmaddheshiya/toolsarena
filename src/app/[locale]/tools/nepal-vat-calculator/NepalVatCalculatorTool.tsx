'use client';

import { useState } from 'react';
import { Receipt, CheckCircle, Info } from 'lucide-react';

const VAT_RATE = 0.13;
const VAT_PERCENT = 13;

type Mode = 'add' | 'extract';

function fmt(n: number): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const infoItems = [
  {
    title: 'VAT Rate',
    value: '13%',
    desc: 'Standard rate on most goods and services in Nepal since 1997.',
  },
  {
    title: 'Registration Threshold',
    value: 'रु 50 Lakh',
    desc: 'Annual turnover above रु 50,00,000 requires mandatory VAT registration.',
  },
  {
    title: 'Filing Frequency',
    value: 'Quarterly',
    desc: 'VAT returns must be filed every 3 months with the Inland Revenue Department.',
  },
  {
    title: 'VAT Invoice',
    value: 'Required',
    desc: 'Registered businesses must issue tax invoices for every taxable supply above रु 50.',
  },
];

export function NepalVatCalculatorTool() {
  const [amount, setAmount] = useState<string>('');
  const [mode, setMode] = useState<Mode>('add');

  const raw = parseFloat(amount) || 0;

  let netAmount = 0;
  let vatAmount = 0;
  let grossAmount = 0;

  if (raw > 0) {
    if (mode === 'add') {
      netAmount   = raw;
      vatAmount   = raw * VAT_RATE;
      grossAmount = raw + vatAmount;
    } else {
      grossAmount = raw;
      netAmount   = raw / (1 + VAT_RATE);
      vatAmount   = grossAmount - netAmount;
    }
  }

  const hasResult = raw > 0;

  return (
    <div className="space-y-6">
      {/* Input card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-5 flex items-center gap-2">
          <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Nepal VAT Calculator — {VAT_PERCENT}%
          </h2>
        </div>

        {/* Mode toggle */}
        <div className="mb-5">
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            Select calculation mode
          </p>
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-900/40">
            <button
              onClick={() => setMode('add')}
              className={[
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                mode === 'add'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
              ].join(' ')}
            >
              Add VAT to Price
            </button>
            <button
              onClick={() => setMode('extract')}
              className={[
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                mode === 'extract'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
              ].join(' ')}
            >
              Extract VAT from Price
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {mode === 'add'
              ? 'Enter a price without VAT (net/exclusive). We will calculate the 13% VAT and the final amount.'
              : 'Enter a price that already includes VAT (gross/inclusive). We will separate out the tax component.'}
          </p>
        </div>

        {/* Amount input */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {mode === 'add' ? 'Net Amount (before VAT)' : 'Gross Amount (VAT included)'} — रु
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-gray-500 dark:text-gray-400">
              रु
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-9 pr-4 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              placeholder="e.g. 10000"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Result card */}
      {hasResult && (
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm dark:border-blue-900/50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              VAT Breakdown
            </h3>
          </div>

          <div className="space-y-3">
            {/* Net */}
            <div className="flex items-center justify-between rounded-lg bg-white/70 px-4 py-3 dark:bg-gray-800/60">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Net Amount <span className="text-xs">(excluding VAT)</span>
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                रु {fmt(netAmount)}
              </span>
            </div>

            {/* VAT */}
            <div className="flex items-center justify-between rounded-lg bg-white/70 px-4 py-3 dark:bg-gray-800/60">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                VAT Amount <span className="text-xs">({VAT_PERCENT}%)</span>
              </span>
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                रु {fmt(vatAmount)}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-blue-200 dark:border-blue-800" />

            {/* Gross */}
            <div className="flex items-center justify-between rounded-lg bg-blue-600 px-4 py-3 text-white">
              <span className="font-medium">
                Gross Total <span className="text-xs opacity-80">(VAT included)</span>
              </span>
              <span className="text-xl font-bold">रु {fmt(grossAmount)}</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            VAT effective rate: {VAT_PERCENT}% · Formula:{' '}
            {mode === 'add'
              ? `Net × 1.${VAT_PERCENT} = Gross`
              : `Gross ÷ 1.${VAT_PERCENT} = Net`}
          </p>
        </div>
      )}

      {/* Info grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {infoItems.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {item.title}
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                {item.value}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* VAT notes */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            VAT in Nepal — Key Facts
          </h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <span>
              Nepal introduced VAT in 1997 under the Value Added Tax Act 2052. It replaced the
              earlier sales tax system.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <span>
              Businesses with annual turnover above रु 50 lakh must register for VAT with the
              Inland Revenue Department (IRD).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <span>
              VAT returns must be filed quarterly. Penalties apply for late filing and
              non-compliance.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <span>
              Exempt items include basic agricultural produce, health services, educational
              services, and financial services.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <span>
              Always issue a proper tax invoice for every taxable supply to maintain VAT compliance.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
