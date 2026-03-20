'use client';

import { useState } from 'react';
import { ArrowRightLeft, Info, TrendingUp } from 'lucide-react';

interface CurrencyRate {
  code: string;
  name: string;
  flag: string;
  unit: number;
  buying: number;
  selling: number;
}

const RATES: CurrencyRate[] = [
  { code: 'USD', name: 'US Dollar',         flag: '🇺🇸', unit: 1,   buying: 132.58, selling: 133.18 },
  { code: 'EUR', name: 'Euro',              flag: '🇪🇺', unit: 1,   buying: 144.20, selling: 144.85 },
  { code: 'GBP', name: 'British Pound',     flag: '🇬🇧', unit: 1,   buying: 168.72, selling: 169.48 },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', unit: 1,   buying: 85.34,  selling: 85.73  },
  { code: 'CAD', name: 'Canadian Dollar',   flag: '🇨🇦', unit: 1,   buying: 97.12,  selling: 97.56  },
  { code: 'CHF', name: 'Swiss Franc',       flag: '🇨🇭', unit: 1,   buying: 148.90, selling: 149.57 },
  { code: 'JPY', name: 'Japanese Yen',      flag: '🇯🇵', unit: 100, buying: 88.42,  selling: 88.82  },
  { code: 'CNY', name: 'Chinese Yuan',      flag: '🇨🇳', unit: 1,   buying: 18.28,  selling: 18.36  },
  { code: 'SGD', name: 'Singapore Dollar',  flag: '🇸🇬', unit: 1,   buying: 99.45,  selling: 99.90  },
  { code: 'SAR', name: 'Saudi Riyal',       flag: '🇸🇦', unit: 1,   buying: 35.34,  selling: 35.50  },
  { code: 'QAR', name: 'Qatari Riyal',      flag: '🇶🇦', unit: 1,   buying: 36.40,  selling: 36.57  },
  { code: 'KWD', name: 'Kuwaiti Dinar',     flag: '🇰🇼', unit: 1,   buying: 430.25, selling: 432.20 },
  { code: 'AED', name: 'UAE Dirham',        flag: '🇦🇪', unit: 1,   buying: 36.10,  selling: 36.27  },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾', unit: 1,   buying: 29.85,  selling: 29.98  },
  { code: 'SEK', name: 'Swedish Krona',     flag: '🇸🇪', unit: 1,   buying: 12.42,  selling: 12.48  },
  { code: 'DKK', name: 'Danish Krone',      flag: '🇩🇰', unit: 1,   buying: 19.32,  selling: 19.41  },
  { code: 'HKD', name: 'Hong Kong Dollar',  flag: '🇭🇰', unit: 1,   buying: 17.02,  selling: 17.10  },
  { code: 'INR', name: 'Indian Rupee',      flag: '🇮🇳', unit: 100, buying: 158.80, selling: 159.20 },
];

const DISCLAIMER =
  "Indicative rates — reference data based on 2025 NRB figures. Visit nrb.org.np for today's official rates.";

function fmt(n: number) {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function NrbForexRatesTodayTool() {
  const [amount, setAmount] = useState<string>('1000');
  const [selectedCode, setSelectedCode] = useState<string>('USD');
  const [direction, setDirection] = useState<'nprToForeign' | 'foreignToNpr'>('nprToForeign');

  const selectedRate = RATES.find((r) => r.code === selectedCode)!;
  const mid = (selectedRate.buying + selectedRate.selling) / 2;

  const numericAmount = parseFloat(amount) || 0;
  let convertedResult = 0;
  if (direction === 'nprToForeign') {
    convertedResult = (numericAmount / mid) * selectedRate.unit;
  } else {
    convertedResult = (numericAmount * mid) / selectedRate.unit;
  }

  const fromLabel = direction === 'nprToForeign' ? 'NPR' : selectedCode;
  const toLabel   = direction === 'nprToForeign' ? selectedCode : 'NPR';

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{DISCLAIMER}</span>
      </div>

      {/* Converter */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Currency Converter</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Amount ({fromLabel})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter amount"
              min="0"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Currency
            </label>
            <select
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              {RATES.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.flag} {r.code} — {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() =>
              setDirection((d) => (d === 'nprToForeign' ? 'foreignToNpr' : 'nprToForeign'))
            }
            className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Swap direction: {fromLabel} → {toLabel}
          </button>
        </div>

        {numericAmount > 0 && (
          <div className="mt-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-center text-white">
            <p className="text-sm opacity-80">
              {fmt(numericAmount)} {fromLabel} =
            </p>
            <p className="mt-1 text-3xl font-bold">
              {toLabel === 'NPR' ? 'रु ' : ''}
              {fmt(convertedResult)} {toLabel}
            </p>
            <p className="mt-1 text-xs opacity-70">
              Mid rate used — Buying रु{fmt(selectedRate.buying)} · Selling रु{fmt(selectedRate.selling)} per {selectedRate.unit} {selectedRate.code}
            </p>
          </div>
        )}
      </div>

      {/* Full rates table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Full NRB Exchange Rates — NPR
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Rates per unit (JPY and INR shown per 100 units)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">
                  Currency
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">
                  Unit
                </th>
                <th className="px-4 py-3 text-right font-semibold text-green-700 dark:text-green-400">
                  Buying (रु)
                </th>
                <th className="px-4 py-3 text-right font-semibold text-red-600 dark:text-red-400">
                  Selling (रु)
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">
                  Mid Rate (रु)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {RATES.map((rate) => {
                const midRate = (rate.buying + rate.selling) / 2;
                return (
                  <tr
                    key={rate.code}
                    className="transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-950/20"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl leading-none">{rate.flag}</span>
                        <div>
                          <span className="font-semibold text-gray-800 dark:text-gray-100">
                            {rate.code}
                          </span>
                          <span className="ml-2 text-gray-500 dark:text-gray-400">{rate.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">
                      {rate.unit}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-green-700 dark:text-green-400">
                      {fmt(rate.buying)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-red-600 dark:text-red-400">
                      {fmt(rate.selling)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800 dark:text-gray-100">
                      {fmt(midRate)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-6 py-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Green = buying rate (bank buys foreign currency from you) · Red = selling rate (bank sells
          foreign currency to you)
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
            How NRB sets rates
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nepal Rastra Bank publishes indicative exchange rates each business day based on the INR
            peg and international market movements. Commercial banks operate within these guidelines
            but may offer slightly different rates.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
            NPR–INR peg
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The Nepali Rupee is pegged to the Indian Rupee at रु 1.60 NPR per INR (रु 160 per INR
            100). All other cross rates are derived from this fixed peg and prevailing international
            rates.
          </p>
        </div>
      </div>
    </div>
  );
}
