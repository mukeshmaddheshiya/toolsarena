'use client';

import { useState, useCallback, useMemo } from 'react';
import { ArrowLeftRight, AlertTriangle, ChevronDown, Info, DollarSign, RotateCcw } from 'lucide-react';

// ── Currency data ─────────────────────────────────────────────────────────────

interface Currency {
  code: string;
  name: string;
  flag: string;
  rateToNPR: number; // How many NPR per 1 unit of this currency
  note?: string;
}

const CURRENCIES: Currency[] = [
  { code: 'NPR', name: 'Nepalese Rupee',     flag: '🇳🇵', rateToNPR: 1 },
  { code: 'USD', name: 'US Dollar',           flag: '🇺🇸', rateToNPR: 134.50 },
  { code: 'EUR', name: 'Euro',                flag: '🇪🇺', rateToNPR: 146.20 },
  { code: 'GBP', name: 'British Pound',       flag: '🇬🇧', rateToNPR: 170.80 },
  { code: 'INR', name: 'Indian Rupee',        flag: '🇮🇳', rateToNPR: 1.60,   note: 'Pegged rate: 1 INR = 1.60 NPR' },
  { code: 'AUD', name: 'Australian Dollar',   flag: '🇦🇺', rateToNPR: 87.30 },
  { code: 'CAD', name: 'Canadian Dollar',     flag: '🇨🇦', rateToNPR: 98.50 },
  { code: 'CHF', name: 'Swiss Franc',         flag: '🇨🇭', rateToNPR: 153.40 },
  { code: 'JPY', name: 'Japanese Yen',        flag: '🇯🇵', rateToNPR: 0.90 },
  { code: 'CNY', name: 'Chinese Yuan',        flag: '🇨🇳', rateToNPR: 18.60 },
  { code: 'SGD', name: 'Singapore Dollar',    flag: '🇸🇬', rateToNPR: 100.40 },
  { code: 'AED', name: 'UAE Dirham',          flag: '🇦🇪', rateToNPR: 36.60 },
  { code: 'SAR', name: 'Saudi Riyal',         flag: '🇸🇦', rateToNPR: 35.80 },
  { code: 'QAR', name: 'Qatari Riyal',        flag: '🇶🇦', rateToNPR: 36.90 },
  { code: 'MYR', name: 'Malaysian Ringgit',   flag: '🇲🇾', rateToNPR: 30.20 },
  { code: 'KRW', name: 'South Korean Won',    flag: '🇰🇷', rateToNPR: 0.097 },
  { code: 'HKD', name: 'Hong Kong Dollar',    flag: '🇭🇰', rateToNPR: 17.30 },
  { code: 'THB', name: 'Thai Baht',           flag: '🇹🇭', rateToNPR: 3.80 },
  { code: 'SEK', name: 'Swedish Krona',       flag: '🇸🇪', rateToNPR: 12.70 },
  { code: 'DKK', name: 'Danish Krone',        flag: '🇩🇰', rateToNPR: 19.60 },
  { code: 'KWD', name: 'Kuwaiti Dinar',       flag: '🇰🇼', rateToNPR: 437.00 },
  { code: 'BHD', name: 'Bahraini Dinar',      flag: '🇧🇭', rateToNPR: 356.00 },
];

// Remittance-origin currencies (common for Nepali migrant workers)
const REMITTANCE_CURRENCIES = ['USD', 'AED', 'SAR', 'QAR', 'MYR', 'GBP'];

const CURRENCY_MAP = new Map<string, Currency>(CURRENCIES.map(c => [c.code, c]));

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCurrency(code: string): Currency {
  return CURRENCY_MAP.get(code) ?? CURRENCIES[0];
}

function convert(amount: number, from: string, to: string, customRate: number | null): number {
  if (isNaN(amount) || amount < 0) return 0;

  const fromCur = getCurrency(from);
  const toCur = getCurrency(to);

  // If custom rate is active and either side is NPR, use it directly
  if (customRate !== null && customRate > 0) {
    if (from === 'NPR') {
      // custom rate = NPR per 1 unit of "to" currency
      return amount / customRate;
    }
    if (to === 'NPR') {
      return amount * customRate;
    }
    // Both non-NPR: convert via NPR using custom rate for "from"
    const amountInNPR = amount * customRate;
    return amountInNPR / toCur.rateToNPR;
  }

  // Standard conversion: both to NPR first, then to target
  const amountInNPR = amount * fromCur.rateToNPR;
  return amountInNPR / toCur.rateToNPR;
}

function fmtAmount(val: number, decimals = 2): string {
  if (!isFinite(val)) return '—';
  return val.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtRate(val: number): string {
  if (!isFinite(val)) return '—';
  if (val >= 1) return val.toFixed(4).replace(/\.?0+$/, '');
  // Small rates (JPY, KRW): show more precision
  return val.toPrecision(4).replace(/\.?0+$/, '');
}

// ── Sub-components ────────────────────────────────────────────────────────────

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const labelClass =
  'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

interface CurrencySelectProps {
  value: string;
  onChange: (code: string) => void;
  id: string;
  label: string;
}

function CurrencySelect({ value, onChange, id, label }: CurrencySelectProps) {
  const selected = getCurrency(value);
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none select-none">
          {selected.flag}
        </span>
        <select
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`${inputClass} pl-10 pr-8 appearance-none cursor-pointer`}
        >
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>
              {c.code} – {c.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type TabId = 'converter' | 'rates' | 'remittance';

export function NrbForexConverterTool() {
  const [activeTab, setActiveTab] = useState<TabId>('converter');
  const [fromCode, setFromCode] = useState('USD');
  const [toCode, setToCode] = useState('NPR');
  const [amountStr, setAmountStr] = useState('1');
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [customRateStr, setCustomRateStr] = useState('');
  const [remittanceCode, setRemittanceCode] = useState('AED');
  const [remittanceAmountStr, setRemittanceAmountStr] = useState('1000');
  const [feePercent, setFeePercent] = useState('2');

  const amount = parseFloat(amountStr) || 0;
  const customRate = useCustomRate && customRateStr !== '' ? parseFloat(customRateStr) : null;

  const result = useMemo(
    () => convert(amount, fromCode, toCode, customRate),
    [amount, fromCode, toCode, customRate]
  );

  const effectiveRate = useMemo(() => {
    if (customRate !== null && customRate > 0) {
      if (fromCode === 'NPR') return 1 / customRate;
      return customRate;
    }
    return convert(1, fromCode, toCode, null);
  }, [fromCode, toCode, customRate]);

  const fromCur = getCurrency(fromCode);
  const toCur = getCurrency(toCode);

  const handleSwap = useCallback(() => {
    setFromCode(toCode);
    setToCode(fromCode);
    setUseCustomRate(false);
    setCustomRateStr('');
  }, [fromCode, toCode]);

  const handleReset = useCallback(() => {
    setFromCode('USD');
    setToCode('NPR');
    setAmountStr('1');
    setUseCustomRate(false);
    setCustomRateStr('');
  }, []);

  // Remittance calculation
  const remittanceAmount = parseFloat(remittanceAmountStr) || 0;
  const fee = parseFloat(feePercent) || 0;
  const remittanceCur = getCurrency(remittanceCode);
  const remittanceNPRBefore = remittanceAmount * remittanceCur.rateToNPR;
  const feeAmountNPR = remittanceNPRBefore * (fee / 100);
  const remittanceNPRAfter = remittanceNPRBefore - feeAmountNPR;

  const tabs: { id: TabId; label: string }[] = [
    { id: 'converter', label: 'Converter' },
    { id: 'rates', label: 'All Rates' },
    { id: 'remittance', label: 'Remittance' },
  ];

  return (
    <div className="space-y-4">
      {/* Warning banner */}
      <div className="flex gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          Rates shown are <strong>reference rates only</strong>. For official daily rates, visit{' '}
          <span className="font-mono font-medium">nrb.org.np</span> (Nepal Rastra Bank). Rates update
          daily and may differ from rates shown here.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Converter Tab ── */}
      {activeTab === 'converter' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            {/* Amount input */}
            <div>
              <label htmlFor="amount" className={labelClass}>Amount</label>
              <input
                id="amount"
                type="number"
                min="0"
                step="any"
                value={amountStr}
                onChange={e => setAmountStr(e.target.value)}
                className={inputClass}
                placeholder="Enter amount"
              />
            </div>

            {/* From / Swap / To */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <CurrencySelect
                id="from-currency"
                label="From"
                value={fromCode}
                onChange={code => { setFromCode(code); setUseCustomRate(false); setCustomRateStr(''); }}
              />
              <button
                onClick={handleSwap}
                aria-label="Swap currencies"
                className="mb-0.5 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors border border-slate-200 dark:border-slate-600"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
              <CurrencySelect
                id="to-currency"
                label="To"
                value={toCode}
                onChange={code => { setToCode(code); setUseCustomRate(false); setCustomRateStr(''); }}
              />
            </div>

            {/* Custom rate toggle */}
            <div className="flex items-center gap-3">
              <button
                role="switch"
                aria-checked={useCustomRate}
                onClick={() => { setUseCustomRate(v => !v); if (useCustomRate) setCustomRateStr(''); }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  useCustomRate ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                    useCustomRate ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400">Use custom rate</span>
            </div>

            {useCustomRate && (
              <div>
                <label htmlFor="custom-rate" className={labelClass}>
                  Custom rate: 1 {fromCode} =
                  <span className="text-slate-500 dark:text-slate-400 font-normal"> ? {toCode}</span>
                </label>
                <input
                  id="custom-rate"
                  type="number"
                  min="0"
                  step="any"
                  value={customRateStr}
                  onChange={e => setCustomRateStr(e.target.value)}
                  className={inputClass}
                  placeholder={`Reference: ${fmtRate(convert(1, fromCode, toCode, null))}`}
                />
              </div>
            )}
          </div>

          {/* Result */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              {fmtAmount(amount)} {fromCur.flag} {fromCode} =
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              {fmtAmount(result)} <span className="text-primary-600 dark:text-primary-400">{toCur.flag} {toCode}</span>
            </div>
            <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              {useCustomRate && customRate ? (
                <span className="text-amber-600 dark:text-amber-400">Using custom rate: 1 {fromCode} = {fmtRate(customRate)} {toCode}</span>
              ) : (
                <>1 {fromCur.flag} {fromCode} = {fmtRate(effectiveRate)} {toCur.flag} {toCode} &nbsp;·&nbsp; Reference rate</>
              )}
            </div>
            {/* Reverse rate */}
            <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              1 {toCur.flag} {toCode} = {fmtRate(1 / effectiveRate)} {fromCur.flag} {fromCode}
            </div>
          </div>

          {/* INR special note */}
          {(fromCode === 'INR' || toCode === 'INR') && (
            <div className="flex gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
              <Info className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-300">
                <strong>INR/NPR Pegged Rate:</strong> The Indian Rupee and Nepalese Rupee maintain a
                nearly fixed exchange rate of <strong>1 INR = 1.60 NPR</strong> (100 INR = 160 NPR).
                This rate is set by the Nepal Rastra Bank and changes very rarely.
              </p>
            </div>
          )}

          {/* Reset */}
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      )}

      {/* ── All Rates Tab ── */}
      {activeTab === 'rates' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Approximate NRB Reference Rates
            </h3>
            <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">per 1 unit → NPR</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  {['Currency', 'Code', 'Buy (approx)', 'Sell (approx)', 'Notes'].map(h => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {CURRENCIES.filter(c => c.code !== 'NPR').map(c => {
                  // Approximate buy/sell spread: ~0.5% each side
                  const buy = c.rateToNPR * 0.995;
                  const sell = c.rateToNPR * 1.005;
                  return (
                    <tr
                      key={c.code}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {c.flag} {c.name}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {c.code}
                      </td>
                      <td className="px-4 py-2.5 text-green-700 dark:text-green-400 font-mono text-xs">
                        {fmtRate(buy)}
                      </td>
                      <td className="px-4 py-2.5 text-red-600 dark:text-red-400 font-mono text-xs">
                        {fmtRate(sell)}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-400 dark:text-slate-500">
                        {c.note ?? (
                          c.code === 'JPY' ? 'Per 1 JPY (≈ 90 per 100 JPY)' :
                          c.code === 'KRW' ? 'Per 1 KRW (≈ 9.70 per 100 KRW)' :
                          c.code === 'THB' ? 'Per 1 THB (≈ 38 per 10 THB)' :
                          ''
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Buy = bank buys foreign currency from you &nbsp;·&nbsp; Sell = bank sells foreign currency to you.
              Spread shown is indicative (~0.5% each side). Actual bank rates may vary.
              Visit <span className="font-mono">nrb.org.np</span> for official daily published rates.
            </p>
          </div>
        </div>
      )}

      {/* ── Remittance Tab ── */}
      {activeTab === 'remittance' && (
        <div className="space-y-4">
          <div className="flex gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
            <Info className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-800 dark:text-blue-300">
              Estimate how much NPR you will receive when sending money from abroad. Nepal receives
              significant remittances from workers in the UAE, Saudi Arabia, Qatar, Malaysia, and other countries.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            {/* Currency selector — remittance origin */}
            <div>
              <label htmlFor="remittance-currency" className={labelClass}>Send from (currency)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none select-none">
                  {getCurrency(remittanceCode).flag}
                </span>
                <select
                  id="remittance-currency"
                  value={remittanceCode}
                  onChange={e => setRemittanceCode(e.target.value)}
                  className={`${inputClass} pl-10 pr-8 appearance-none cursor-pointer`}
                >
                  {CURRENCIES.filter(c => c.code !== 'NPR').map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} – {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              {/* Quick select for common remittance countries */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {REMITTANCE_CURRENCIES.map(code => (
                  <button
                    key={code}
                    onClick={() => setRemittanceCode(code)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                      remittanceCode === code
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {getCurrency(code).flag} {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="remittance-amount" className={labelClass}>
                Amount to send ({remittanceCode})
              </label>
              <input
                id="remittance-amount"
                type="number"
                min="0"
                step="any"
                value={remittanceAmountStr}
                onChange={e => setRemittanceAmountStr(e.target.value)}
                className={inputClass}
                placeholder="e.g. 1000"
              />
            </div>

            {/* Fee */}
            <div>
              <label htmlFor="fee-percent" className={labelClass}>
                Estimated bank/remittance fee (%)
              </label>
              <input
                id="fee-percent"
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={feePercent}
                onChange={e => setFeePercent(e.target.value)}
                className={inputClass}
                placeholder="2"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['0', '1', '1.5', '2', '3', '5'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFeePercent(f)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                      feePercent === f
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {f}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Remittance result */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                {fmtAmount(remittanceAmount)} {getCurrency(remittanceCode).flag} {remittanceCode} at reference rate
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                NPR {fmtAmount(remittanceNPRBefore)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                Fee deduction ({fee}%)
              </span>
              <span className="text-red-600 dark:text-red-400 font-medium">
                − NPR {fmtAmount(feeAmountNPR)}
              </span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Estimated NPR received
              </span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                NPR {fmtAmount(remittanceNPRAfter)}
              </span>
            </div>
          </div>

          {/* Remittance info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Popular Remittance Corridors to Nepal
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { code: 'AED', country: 'UAE', note: 'Largest corridor' },
                { code: 'SAR', country: 'Saudi Arabia', note: '' },
                { code: 'QAR', country: 'Qatar', note: '' },
                { code: 'MYR', country: 'Malaysia', note: '' },
                { code: 'USD', country: 'USA / Global', note: '' },
                { code: 'GBP', country: 'United Kingdom', note: '' },
              ].map(item => {
                const cur = getCurrency(item.code);
                return (
                  <button
                    key={item.code}
                    onClick={() => setRemittanceCode(item.code)}
                    className={`text-left p-3 rounded-xl border transition-colors ${
                      remittanceCode === item.code
                        ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="text-base mb-0.5">{cur.flag}</div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.code}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.country}</div>
                    {item.note && <div className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">{item.note}</div>}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 px-1">
            Actual NPR received depends on the remittance service provider's exchange rate and fee structure.
            Rates shown are NRB reference rates. Always compare rates across providers before sending.
          </p>
        </div>
      )}
    </div>
  );
}
