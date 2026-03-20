'use client';

import { useState, useCallback } from 'react';
import { BarChart2, IndianRupee, TrendingUp, TrendingDown, Info, AlertCircle } from 'lucide-react';

type TxType = 'eq_intraday' | 'eq_delivery' | 'eq_futures' | 'eq_options' | 'currency' | 'commodity';
type Broker = 'zerodha' | 'upstox' | 'angel' | 'groww' | 'hdfc' | 'icici' | 'sharekhan';

const TX_LABELS: Record<TxType, string> = {
  eq_intraday: 'Equity Intraday',
  eq_delivery: 'Equity Delivery',
  eq_futures: 'Equity Futures',
  eq_options: 'Equity Options',
  currency: 'Currency',
  commodity: 'Commodity',
};

const BROKER_LABELS: Record<Broker, string> = {
  zerodha: 'Zerodha',
  upstox: 'Upstox',
  angel: 'Angel One',
  groww: 'Groww',
  hdfc: 'HDFC Securities',
  icici: 'ICICI Direct',
  sharekhan: 'Sharekhan',
};

interface ChargesResult {
  buyValue: number;
  sellValue: number;
  turnover: number;
  grossPnl: number;
  brokerage: number;
  stt: number;
  exchangeCharge: number;
  sebiCharge: number;
  gst: number;
  stampDuty: number;
  dpCharge: number;
  totalCharges: number;
  netPnl: number;
  breakEvenPrice: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

function getBrokerage(broker: Broker, txType: TxType, turnover: number, buyValue: number): number {
  const flat = 20;
  const pct = (rate: number) => Math.min(flat, turnover * rate);

  switch (broker) {
    case 'zerodha':
      if (txType === 'eq_delivery') return 0;
      if (txType === 'eq_options') return flat * 2;
      return pct(0.0003) * 2;
    case 'upstox':
      if (txType === 'eq_delivery') return 0;
      if (txType === 'eq_options') return flat * 2;
      return flat * 2;
    case 'angel':
      if (txType === 'eq_delivery') return 0;
      return flat * 2;
    case 'groww':
      if (txType === 'eq_delivery') return 0;
      return flat * 2;
    case 'hdfc':
      if (txType === 'eq_delivery') return turnover * 0.005;
      if (txType === 'eq_intraday') return turnover * 0.0005;
      return turnover * 0.0005;
    case 'icici':
      if (txType === 'eq_delivery') return turnover * 0.005;
      if (txType === 'eq_intraday') return turnover * 0.001;
      return turnover * 0.001;
    case 'sharekhan':
      if (txType === 'eq_delivery') return turnover * 0.004;
      if (txType === 'eq_intraday') return turnover * 0.001;
      return turnover * 0.001;
    default:
      return flat * 2;
  }
}

function getSTT(txType: TxType, buyValue: number, sellValue: number, quantity: number): number {
  switch (txType) {
    case 'eq_delivery':
      return (buyValue + sellValue) * 0.001;
    case 'eq_intraday':
      return sellValue * 0.00025;
    case 'eq_futures':
      return sellValue * 0.0001025;
    case 'eq_options':
      return (sellValue / 100000) * 50;
    case 'currency':
      return 0;
    case 'commodity':
      return sellValue * 0.0001;
    default:
      return 0;
  }
}

function getStampDuty(txType: TxType, buyValue: number): number {
  if (txType === 'eq_delivery') return buyValue * 0.00015;
  if (txType === 'currency' || txType === 'commodity') return buyValue * 0.00003;
  return buyValue * 0.00003;
}

function calcCharges(
  buyPrice: number,
  sellPrice: number,
  quantity: number,
  txType: TxType,
  broker: Broker
): ChargesResult {
  const buyValue = buyPrice * quantity;
  const sellValue = sellPrice * quantity;
  const turnover = buyValue + sellValue;
  const grossPnl = sellValue - buyValue;

  const brokerage = getBrokerage(broker, txType, turnover, buyValue);
  const stt = getSTT(txType, buyValue, sellValue, quantity);
  const exchangeCharge = turnover * 0.0000322;
  const sebiCharge = turnover * 0.000001;
  const gst = (brokerage + exchangeCharge) * 0.18;
  const stampDuty = getStampDuty(txType, buyValue);
  const dpCharge = txType === 'eq_delivery' ? 13.5 * 1.18 : 0;

  const totalCharges = brokerage + stt + exchangeCharge + sebiCharge + gst + stampDuty + dpCharge;
  const netPnl = grossPnl - totalCharges;

  const breakEvenPrice = buyPrice + totalCharges / quantity;

  return {
    buyValue,
    sellValue,
    turnover,
    grossPnl,
    brokerage,
    stt,
    exchangeCharge,
    sebiCharge,
    gst,
    stampDuty,
    dpCharge,
    totalCharges,
    netPnl,
    breakEvenPrice,
  };
}

export function DematChargesCalculatorTool() {
  const [txType, setTxType] = useState<TxType>('eq_intraday');
  const [buyPrice, setBuyPrice] = useState('450');
  const [sellPrice, setSellPrice] = useState('460');
  const [quantity, setQuantity] = useState('100');
  const [broker, setBroker] = useState<Broker>('zerodha');
  const [results, setResults] = useState<ChargesResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    const bp = parseFloat(buyPrice);
    const sp = parseFloat(sellPrice);
    const qty = parseInt(quantity);

    if (!buyPrice || isNaN(bp) || bp <= 0) errs.buyPrice = 'Enter a valid buy price';
    if (!sellPrice || isNaN(sp) || sp <= 0) errs.sellPrice = 'Enter a valid sell price';
    if (!quantity || isNaN(qty) || qty < 1) errs.quantity = 'Enter a valid quantity';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [buyPrice, sellPrice, quantity]);

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calcCharges(
      parseFloat(buyPrice),
      parseFloat(sellPrice),
      parseInt(quantity),
      txType,
      broker
    );
    setResults(res);
  };

  const handleReset = () => {
    setBuyPrice('450');
    setSellPrice('460');
    setQuantity('100');
    setResults(null);
    setErrors({});
  };

  const chargeRows = results
    ? [
        { label: 'Brokerage', value: results.brokerage, note: BROKER_LABELS[broker] },
        { label: 'STT (Securities Transaction Tax)', value: results.stt, note: '' },
        { label: 'Exchange Transaction Charges', value: results.exchangeCharge, note: 'NSE 0.00322%' },
        { label: 'SEBI Turnover Charges', value: results.sebiCharge, note: '0.0001%' },
        { label: 'GST (18%)', value: results.gst, note: 'On brokerage + exchange charges' },
        { label: 'Stamp Duty', value: results.stampDuty, note: 'On buy value' },
        ...(results.dpCharge > 0
          ? [{ label: 'DP Charges', value: results.dpCharge, note: '₹13.5 + GST per scrip' }]
          : []),
      ]
    : [];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
          <BarChart2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Demat Account Charges Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Calculate all trading charges: brokerage, STT, GST, stamp duty and more
          </p>
        </div>
      </div>

      {/* Transaction Type */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TX_LABELS) as TxType[]).map((type) => (
          <button
            key={type}
            onClick={() => setTxType(type)}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all border ${
              txType === type
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            {TX_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Buy Price */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Buy Price (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IndianRupee className="w-4 h-4" />
            </span>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.buyPrice ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="450"
              step="0.05"
            />
          </div>
          {errors.buyPrice && <p className="text-xs text-red-500">{errors.buyPrice}</p>}
        </div>

        {/* Sell Price */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Sell Price (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IndianRupee className="w-4 h-4" />
            </span>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.sellPrice ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="460"
              step="0.05"
            />
          </div>
          {errors.sellPrice && <p className="text-xs text-red-500">{errors.sellPrice}</p>}
        </div>

        {/* Quantity */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Quantity (Shares / Lots)
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.quantity ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
            }`}
            placeholder="100"
            min="1"
          />
          {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
        </div>

        {/* Broker */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Broker
          </label>
          <select
            value={broker}
            onChange={(e) => setBroker(e.target.value as Broker)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {(Object.keys(BROKER_LABELS) as Broker[]).map((b) => (
              <option key={b} value={b}>
                {BROKER_LABELS[b]}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="sm:col-span-2 flex gap-3 pt-2">
          <button
            onClick={handleCalculate}
            className="flex-1 py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Calculate Charges
          </button>
          <button
            onClick={handleReset}
            className="py-2.5 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-lg text-sm transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Turnover</p>
              <p className="text-base font-bold text-slate-800 dark:text-slate-100">{fmt(results.turnover)}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Gross P&L</p>
              <p className={`text-base font-bold ${results.grossPnl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {results.grossPnl >= 0 ? '+' : ''}{fmt(results.grossPnl)}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Total Charges</p>
              <p className="text-base font-bold text-red-500">{fmt(results.totalCharges)}</p>
            </div>
            <div className={`p-4 rounded-xl border shadow-sm ${
              results.netPnl >= 0
                ? 'bg-emerald-600 border-emerald-600'
                : 'bg-red-600 border-red-600'
            }`}>
              <p className="text-xs text-white/80 font-medium mb-1">Net P&L</p>
              <p className="text-base font-bold text-white">
                {results.netPnl >= 0 ? '+' : ''}{fmt(results.netPnl)}
              </p>
            </div>
          </div>

          {/* Charges Table */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Itemized Charges Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2 text-slate-500 dark:text-slate-400 font-medium">Charge</th>
                    <th className="text-left py-2 text-slate-500 dark:text-slate-400 font-medium hidden sm:table-cell">
                      Basis
                    </th>
                    <th className="text-right py-2 text-slate-500 dark:text-slate-400 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {chargeRows.map((row) => (
                    <tr key={row.label} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 text-slate-700 dark:text-slate-200">{row.label}</td>
                      <td className="py-2.5 text-slate-400 dark:text-slate-500 text-xs hidden sm:table-cell">
                        {row.note}
                      </td>
                      <td className="py-2.5 text-right font-medium text-slate-700 dark:text-slate-200">
                        {fmt(row.value)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <td className="py-2.5 font-bold text-slate-800 dark:text-slate-100">Total Charges</td>
                    <td className="hidden sm:table-cell"></td>
                    <td className="py-2.5 text-right font-bold text-red-500">
                      {fmt(results.totalCharges)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* P&L Summary + Break-even */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Trade Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Buy Value</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{fmt(results.buyValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Sell Value</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{fmt(results.sellValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Gross P&L</span>
                  <span className={`font-medium ${results.grossPnl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {results.grossPnl >= 0 ? '+' : ''}{fmt(results.grossPnl)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Total Charges</span>
                  <span className="font-medium text-red-500">-{fmt(results.totalCharges)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Net P&L</span>
                  <span className={`font-bold ${results.netPnl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {results.netPnl >= 0 ? '+' : ''}{fmt(results.netPnl)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Break-Even Analysis
              </h3>
              <div className="flex flex-col items-center justify-center h-24 gap-1">
                <p className="text-xs text-slate-400">Minimum sell price to break even</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {fmt(results.breakEvenPrice)}
                </p>
                <p className="text-xs text-slate-400">per share after all charges</p>
              </div>
              <div className={`mt-2 p-2 rounded-lg text-xs text-center ${
                parseFloat(sellPrice) >= results.breakEvenPrice
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
              }`}>
                {parseFloat(sellPrice) >= results.breakEvenPrice ? (
                  <span className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Sell price covers charges — profitable trade
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    Sell price is below break-even — net loss
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex gap-2 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              <span className="font-semibold">Disclaimer:</span> Charges shown are approximate and based on
              publicly available broker rate cards as of 2024-25. Actual charges may differ based on your
              brokerage plan, exchange segment, and regulatory updates. Verify with your broker for exact
              figures before trading.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
