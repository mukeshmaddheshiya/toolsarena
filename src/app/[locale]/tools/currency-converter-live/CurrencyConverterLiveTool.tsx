'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeftRight,
  RefreshCw,
  DollarSign,
  AlertCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';

const API_URL = 'https://open.er-api.com/v6/latest/USD';
const CACHE_KEY = 'currency_rates_cache';

const FEATURED_CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', flag: '\u{1F1EE}\u{1F1F3}' },
  { code: 'NPR', name: 'Nepalese Rupee', flag: '\u{1F1F3}\u{1F1F5}' },
  { code: 'USD', name: 'US Dollar', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'EUR', name: 'Euro', flag: '\u{1F1EA}\u{1F1FA}' },
  { code: 'GBP', name: 'British Pound', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'AED', name: 'UAE Dirham', flag: '\u{1F1E6}\u{1F1EA}' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '\u{1F1F8}\u{1F1EC}' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '\u{1F1E8}\u{1F1E6}' },
  { code: 'AUD', name: 'Australian Dollar', flag: '\u{1F1E6}\u{1F1FA}' },
  { code: 'JPY', name: 'Japanese Yen', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'PKR', name: 'Pakistani Rupee', flag: '\u{1F1F5}\u{1F1F0}' },
  { code: 'BDT', name: 'Bangladeshi Taka', flag: '\u{1F1E7}\u{1F1E9}' },
  { code: 'CHF', name: 'Swiss Franc', flag: '\u{1F1E8}\u{1F1ED}' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '\u{1F1F8}\u{1F1E6}' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '\u{1F1F2}\u{1F1FE}' },
  { code: 'QAR', name: 'Qatari Riyal', flag: '\u{1F1F6}\u{1F1E6}' },
  { code: 'KWD', name: 'Kuwaiti Dinar', flag: '\u{1F1F0}\u{1F1FC}' },
  { code: 'OMR', name: 'Omani Rial', flag: '\u{1F1F4}\u{1F1F2}' },
  { code: 'BHD', name: 'Bahraini Dinar', flag: '\u{1F1E7}\u{1F1ED}' },
];

interface RatesData {
  rates: Record<string, number>;
  base: string;
  time_last_update_unix: number;
}

interface CachedData {
  rates: Record<string, number>;
  base: string;
  timestamp: number;
}

function formatNumber(value: number, decimals = 4): string {
  if (!isFinite(value)) return '—';
  if (value >= 1000) {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value);
  }
  return value.toFixed(decimals);
}

function formatTimestamp(unix: number): string {
  return new Date(unix * 1000).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function loadCache(): CachedData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachedData;
  } catch {
    return null;
  }
}

function saveCache(data: RatesData): void {
  try {
    const cache: CachedData = {
      rates: data.rates,
      base: data.base,
      timestamp: data.time_last_update_unix,
    };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // sessionStorage not available
  }
}

export function CurrencyConverterLiveTool() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');

  const fetchRates = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);

    if (!force) {
      const cached = loadCache();
      if (cached) {
        setRates(cached.rates);
        setLastUpdated(cached.timestamp);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: RatesData = await res.json();
      saveCache(data);
      setRates(data.rates);
      setLastUpdated(data.time_last_update_unix);
    } catch {
      setError('Failed to fetch exchange rates. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const convert = useCallback(
    (amt: number, from: string, to: string): number | null => {
      if (!rates) return null;
      const fromRate = from === 'USD' ? 1 : rates[from];
      const toRate = to === 'USD' ? 1 : rates[to];
      if (!fromRate || !toRate) return null;
      const inUSD = amt / fromRate;
      return inUSD * toRate;
    },
    [rates]
  );

  const parsedAmount = parseFloat(amount) || 0;
  const converted = convert(parsedAmount, fromCurrency, toCurrency);
  const reverseRate = convert(1, toCurrency, fromCurrency);
  const forwardRate = convert(1, fromCurrency, toCurrency);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const toInfo = FEATURED_CURRENCIES.find((c) => c.code === toCurrency);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Main Converter Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Live Currency Converter</h2>
          {lastUpdated && (
            <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              Updated {formatTimestamp(lastUpdated)}
            </span>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1.5">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Currency Selectors */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1.5">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {FEATURED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} — {c.name}
                </option>
              ))}
              {rates &&
                Object.keys(rates)
                  .filter((code) => !FEATURED_CURRENCIES.some((c) => c.code === code))
                  .sort()
                  .map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            className="mt-5 p-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl text-slate-700 dark:text-slate-300 transition-all"
            title="Swap currencies"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1.5">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {FEATURED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} — {c.name}
                </option>
              ))}
              {rates &&
                Object.keys(rates)
                  .filter((code) => !FEATURED_CURRENCIES.some((c) => c.code === code))
                  .sort()
                  .map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
            </select>
          </div>
        </div>

        {/* Result */}
        {loading ? (
          <div className="bg-slate-100 dark:bg-slate-900/60 rounded-xl p-6 text-center">
            <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-400 text-sm">Fetching live rates...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-700/50 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-rose-700 dark:text-rose-300 text-sm font-medium">{error}</p>
              <button
                onClick={() => fetchRates(true)}
                className="mt-2 text-xs text-rose-500 dark:text-rose-400 underline hover:text-rose-700 dark:hover:text-rose-300"
              >
                Retry
              </button>
            </div>
          </div>
        ) : converted !== null ? (
          <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-700/50 rounded-2xl p-5 space-y-3">
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                {formatNumber(parsedAmount, 2)} {fromCurrency} =
              </p>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-300 tracking-tight">
                {formatNumber(converted, converted >= 1 ? 2 : 6)}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                {toInfo?.flag} {toCurrency} — {toInfo?.name}
              </p>
            </div>

            <div className="h-px bg-indigo-200 dark:bg-indigo-700/30" />

            <div className="flex justify-around text-center text-sm">
              <div>
                <p className="text-slate-500 text-xs">1 {fromCurrency}</p>
                <p className="text-slate-800 dark:text-slate-200 font-semibold font-mono">
                  = {formatNumber(forwardRate ?? 0)} {toCurrency}
                </p>
              </div>
              <div className="w-px bg-indigo-200 dark:bg-indigo-700/30" />
              <div>
                <p className="text-slate-500 text-xs">1 {toCurrency}</p>
                <p className="text-slate-800 dark:text-slate-200 font-semibold font-mono">
                  = {formatNumber(reverseRate ?? 0)} {fromCurrency}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Refresh Button */}
        <div className="flex justify-end">
          <button
            onClick={() => fetchRates(true)}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 text-slate-700 dark:text-slate-300 rounded-lg text-xs transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Rates
          </button>
        </div>
      </div>

      {/* Multi-Currency Table */}
      {rates && !loading && !error && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {formatNumber(parsedAmount, 2)} {fromCurrency} in Major Currencies
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FEATURED_CURRENCIES.filter((c) => c.code !== fromCurrency).map((currency) => {
              const val = convert(parsedAmount, fromCurrency, currency.code);
              return (
                <div
                  key={currency.code}
                  className="flex items-center justify-between bg-slate-100 dark:bg-slate-900/60 rounded-xl px-4 py-2.5"
                >
                  <span className="text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2">
                    <span className="text-base">{currency.flag}</span>
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-slate-500 text-xs hidden sm:inline">{currency.name}</span>
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 text-sm font-mono font-semibold">
                    {val !== null ? formatNumber(val, val >= 1 ? 2 : 6) : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/40 rounded-xl px-4 py-3 text-xs text-amber-600/70 dark:text-amber-300/70 leading-relaxed">
        <strong className="text-amber-700 dark:text-amber-300">Disclaimer:</strong> Exchange rates are mid-market rates
        from open.er-api.com and are updated daily. These are not the rates you will receive when
        you buy or sell currency. Banks, money transfer services, and ATMs apply their own margins.
        Use this tool for reference and planning only.
      </div>
    </div>
  );
}
