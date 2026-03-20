'use client';

import { useState, useCallback, useMemo } from 'react';
import { CreditCard, ChevronDown, Info, TrendingDown, AlertCircle } from 'lucide-react';

interface Bank {
  name: string;
  rate: number;
}

interface EmiResult {
  emi: number;
  totalInterest: number;
  processingFeeAmount: number;
  totalAmount: number;
  effectiveAnnualRate: number;
  amortization: AmortizationRow[];
  revolvingSavings: number;
}

interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

const BANKS: Bank[] = [
  { name: 'HDFC Bank', rate: 13 },
  { name: 'ICICI Bank', rate: 14 },
  { name: 'SBI Card', rate: 14 },
  { name: 'Axis Bank', rate: 15 },
  { name: 'Kotak Mahindra', rate: 16 },
  { name: 'Yes Bank', rate: 18 },
  { name: 'Standard Chartered', rate: 15 },
  { name: 'American Express', rate: 14 },
  { name: 'Custom Rate', rate: -1 },
];

const TENURES = [3, 6, 9, 12, 18, 24];

const REVOLVING_RATE = 40; // 40% p.a. average revolving credit rate

function formatCurrency(value: number): string {
  return (
    '₹' +
    new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  );
}

function formatCurrencyShort(value: number): string {
  if (value >= 100000) return '₹' + (value / 100000).toFixed(2) + 'L';
  if (value >= 1000) return '₹' + (value / 1000).toFixed(2) + 'K';
  return '₹' + value.toFixed(2);
}

function calculateEmi(principal: number, annualRate: number, months: number): EmiResult | null {
  if (principal <= 0 || annualRate <= 0 || months <= 0) return null;

  const r = annualRate / 12 / 100;
  const n = months;

  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalAmount = emi * n;
  const totalInterest = totalAmount - principal;

  // Effective annual rate (EAR) = (1 + r)^12 - 1
  const effectiveAnnualRate = (Math.pow(1 + r, 12) - 1) * 100;

  // Amortization schedule
  const amortization: AmortizationRow[] = [];
  let balance = principal;
  for (let month = 1; month <= n; month++) {
    const interestForMonth = balance * r;
    const principalForMonth = emi - interestForMonth;
    balance -= principalForMonth;
    amortization.push({
      month,
      emi,
      principal: principalForMonth,
      interest: interestForMonth,
      balance: Math.max(0, balance),
    });
  }

  // Revolving credit comparison — what would have been paid at 40% p.a. for same months
  const revolvingEmi =
    (principal * (REVOLVING_RATE / 12 / 100) * Math.pow(1 + REVOLVING_RATE / 12 / 100, n)) /
    (Math.pow(1 + REVOLVING_RATE / 12 / 100, n) - 1);
  const revolvingTotal = revolvingEmi * n;
  const revolvingSavings = revolvingTotal - totalAmount;

  return {
    emi,
    totalInterest,
    processingFeeAmount: 0, // Set later
    totalAmount,
    effectiveAnnualRate,
    amortization,
    revolvingSavings,
  };
}

export function CreditCardEmiCalculatorTool() {
  const [amount, setAmount] = useState<string>('');
  const [selectedBankIndex, setSelectedBankIndex] = useState<number>(0);
  const [customRate, setCustomRate] = useState<string>('');
  const [tenure, setTenure] = useState<number>(12);
  const [processingFee, setProcessingFee] = useState<string>('1');
  const [result, setResult] = useState<EmiResult | null>(null);
  const [showAmortization, setShowAmortization] = useState(false);
  const [error, setError] = useState<string>('');

  const isCustomRate = BANKS[selectedBankIndex].rate === -1;
  const effectiveRate = isCustomRate ? parseFloat(customRate) || 0 : BANKS[selectedBankIndex].rate;

  const handleCalculate = useCallback(() => {
    const principal = parseFloat(amount.replace(/,/g, ''));
    if (!amount || isNaN(principal) || principal <= 0) {
      setError('Please enter a valid purchase amount.');
      setResult(null);
      return;
    }
    if (isCustomRate && (!customRate || parseFloat(customRate) <= 0)) {
      setError('Please enter a valid custom interest rate.');
      setResult(null);
      return;
    }
    setError('');

    const res = calculateEmi(principal, effectiveRate, tenure);
    if (!res) {
      setError('Unable to calculate. Please check your inputs.');
      return;
    }

    const feePercent = parseFloat(processingFee) || 0;
    const feeAmount = (principal * feePercent) / 100;
    res.processingFeeAmount = feeAmount;
    res.totalAmount = res.emi * tenure + feeAmount;

    setResult(res);
    setShowAmortization(false);
  }, [amount, effectiveRate, tenure, processingFee, isCustomRate, customRate]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
          <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Credit Card EMI Calculator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Calculate EMI, interest & compare vs revolving credit
          </p>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-5">
        {/* Purchase Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Purchase Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
              placeholder="e.g. 50000"
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>

        {/* Bank & Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Bank / Card Issuer
            </label>
            <div className="relative">
              <select
                value={selectedBankIndex}
                onChange={(e) => setSelectedBankIndex(Number(e.target.value))}
                className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {BANKS.map((b, i) => (
                  <option key={b.name} value={i}>
                    {b.name} {b.rate > 0 ? `(${b.rate}% p.a.)` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {isCustomRate ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Custom Interest Rate (% p.a.)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                step="0.1"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                placeholder="e.g. 15.5"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Interest Rate
              </label>
              <div className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 text-sm text-slate-600 dark:text-slate-400">
                {effectiveRate}% per annum
              </div>
            </div>
          )}
        </div>

        {/* Tenure */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            EMI Tenure (Months)
          </label>
          <div className="flex flex-wrap gap-2">
            {TENURES.map((t) => (
              <button
                key={t}
                onClick={() => setTenure(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  tenure === t
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                {t} mo
              </button>
            ))}
          </div>
        </div>

        {/* Processing Fee */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Processing Fee (%) — Optional
          </label>
          <div className="relative max-w-xs">
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={processingFee}
              onChange={(e) => setProcessingFee(e.target.value)}
              placeholder="e.g. 1"
              className="w-full pr-8 pl-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              %
            </span>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
        >
          Calculate EMI
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Monthly EMI', value: formatCurrency(result.emi), highlight: true },
              { label: 'Total Interest', value: formatCurrency(result.totalInterest), highlight: false },
              {
                label: 'Processing Fee',
                value: formatCurrency(result.processingFeeAmount),
                highlight: false,
              },
              { label: 'Total Payable', value: formatCurrency(result.totalAmount), highlight: false },
            ].map(({ label, value, highlight }) => (
              <div
                key={label}
                className={`rounded-xl p-4 border ${
                  highlight
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div
                  className={`text-xs font-medium mb-1 ${
                    highlight ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {label}
                </div>
                <div
                  className={`text-base font-bold tabular-nums ${
                    highlight ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Effective Rate */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-5 py-4 flex items-center gap-3">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Effective Annual Interest Rate:{' '}
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {result.effectiveAnnualRate.toFixed(2)}% p.a.
              </span>
            </p>
          </div>

          {/* Revolving Credit Comparison */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">
                  Is Converting to EMI Worth It?
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                  Compared to paying via revolving credit (avg {REVOLVING_RATE}% p.a.), converting to
                  EMI at {effectiveRate}% p.a. over {tenure} months{' '}
                  <strong>saves you approximately {formatCurrency(result.revolvingSavings)}</strong> in
                  interest.
                </p>
              </div>
            </div>
          </div>

          {/* Amortization Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setShowAmortization((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              Monthly Amortization Schedule
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showAmortization ? 'rotate-180' : ''}`}
              />
            </button>
            {showAmortization && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
                      <th className="px-4 py-2.5 text-left font-medium">Month</th>
                      <th className="px-4 py-2.5 text-right font-medium">EMI</th>
                      <th className="px-4 py-2.5 text-right font-medium">Principal</th>
                      <th className="px-4 py-2.5 text-right font-medium">Interest</th>
                      <th className="px-4 py-2.5 text-right font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {result.amortization.map((row) => (
                      <tr
                        key={row.month}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">
                          Month {row.month}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                          {formatCurrencyShort(row.emi)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-indigo-600 dark:text-indigo-400 tabular-nums">
                          {formatCurrencyShort(row.principal)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-red-500 dark:text-red-400 tabular-nums">
                          {formatCurrencyShort(row.interest)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400 tabular-nums">
                          {formatCurrencyShort(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <strong>Disclaimer:</strong> Actual charges vary by bank, card type, and promotional
              offers. Processing fees, GST on interest, and other charges may apply. Verify exact
              terms with your bank before converting a purchase to EMI.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
