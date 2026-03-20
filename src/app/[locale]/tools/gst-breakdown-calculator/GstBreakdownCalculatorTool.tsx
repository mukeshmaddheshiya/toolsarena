'use client';

import { useState, useCallback } from 'react';
import { Receipt, Copy, Printer, RefreshCw, ChevronDown, Info } from 'lucide-react';

type GstMode = 'exclusive' | 'inclusive';
type TransactionType = 'intrastate' | 'interstate';
type GstSlab = 0 | 5 | 12 | 18 | 28;

interface GstResult {
  baseAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  cess: number;
  totalTax: number;
  finalAmount: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cessRate: number;
}

const GST_SLABS: GstSlab[] = [0, 5, 12, 18, 28];

function formatIndian(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCurrency(value: number): string {
  return '₹' + formatIndian(value);
}

function calculateGst(
  amount: number,
  gstRate: GstSlab,
  mode: GstMode,
  transactionType: TransactionType,
  cessRate: number
): GstResult {
  let baseAmount: number;
  let gstAmount: number;
  let cessAmount: number;

  if (mode === 'exclusive') {
    baseAmount = amount;
    gstAmount = (baseAmount * gstRate) / 100;
    cessAmount = (baseAmount * cessRate) / 100;
  } else {
    const totalRate = 1 + gstRate / 100 + cessRate / 100;
    baseAmount = amount / totalRate;
    gstAmount = baseAmount * (gstRate / 100);
    cessAmount = baseAmount * (cessRate / 100);
  }

  const cgstRate = transactionType === 'intrastate' ? gstRate / 2 : 0;
  const sgstRate = transactionType === 'intrastate' ? gstRate / 2 : 0;
  const igstRate = transactionType === 'interstate' ? gstRate : 0;

  const cgst = transactionType === 'intrastate' ? gstAmount / 2 : 0;
  const sgst = transactionType === 'intrastate' ? gstAmount / 2 : 0;
  const igst = transactionType === 'interstate' ? gstAmount : 0;
  const totalTax = gstAmount + cessAmount;
  const finalAmount = baseAmount + totalTax;

  return {
    baseAmount,
    cgst,
    sgst,
    igst,
    cess: cessAmount,
    totalTax,
    finalAmount,
    cgstRate,
    sgstRate,
    igstRate,
    cessRate,
  };
}

export function GstBreakdownCalculatorTool() {
  const [amount, setAmount] = useState<string>('');
  const [gstSlab, setGstSlab] = useState<GstSlab>(18);
  const [mode, setMode] = useState<GstMode>('exclusive');
  const [transactionType, setTransactionType] = useState<TransactionType>('intrastate');
  const [cessRate, setCessRate] = useState<string>('0');
  const [result, setResult] = useState<GstResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>('');

  const handleCalculate = useCallback(() => {
    const parsed = parseFloat(amount.replace(/,/g, ''));
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid positive amount.');
      setResult(null);
      return;
    }
    setError('');
    const cessVal = parseFloat(cessRate) || 0;
    const res = calculateGst(parsed, gstSlab, mode, transactionType, cessVal);
    setResult(res);
  }, [amount, gstSlab, mode, transactionType, cessRate]);

  const handleReset = () => {
    setAmount('');
    setGstSlab(18);
    setMode('exclusive');
    setTransactionType('intrastate');
    setCessRate('0');
    setResult(null);
    setError('');
  };

  const handleCopy = () => {
    if (!result) return;
    const isIntra = transactionType === 'intrastate';
    const lines = [
      `GST Breakdown`,
      `Mode: ${mode === 'exclusive' ? 'GST Exclusive (Add GST)' : 'GST Inclusive (Remove GST)'}`,
      `Transaction: ${isIntra ? 'Intrastate (CGST + SGST)' : 'Interstate (IGST)'}`,
      `GST Rate: ${gstSlab}%`,
      ``,
      `Base Amount: ${formatCurrency(result.baseAmount)}`,
      isIntra ? `CGST (${result.cgstRate}%): ${formatCurrency(result.cgst)}` : '',
      isIntra ? `SGST (${result.sgstRate}%): ${formatCurrency(result.sgst)}` : '',
      !isIntra ? `IGST (${result.igstRate}%): ${formatCurrency(result.igst)}` : '',
      result.cessRate > 0 ? `Cess (${result.cessRate}%): ${formatCurrency(result.cess)}` : '',
      `Total Tax: ${formatCurrency(result.totalTax)}`,
      `Final Amount: ${formatCurrency(result.finalAmount)}`,
    ]
      .filter(Boolean)
      .join('\n');
    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => window.print();

  const isIntrastate = transactionType === 'intrastate';

  return (
    <div className="max-w-3xl mx-auto space-y-6 print:max-w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
          <Receipt className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            GST Breakdown Calculator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Calculate CGST, SGST & IGST for any amount instantly
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-5 print:border-slate-300">
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
          {(['exclusive', 'inclusive'] as GstMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {m === 'exclusive' ? 'Add GST (Exclusive)' : 'Remove GST (Inclusive)'}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-indigo-400" />
          {mode === 'exclusive'
            ? 'Enter base price — GST will be added on top to get the final amount.'
            : 'Enter total price inclusive of GST — calculator will extract base and tax.'}
        </p>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {mode === 'exclusive' ? 'Base Amount (₹)' : 'Total Amount including GST (₹)'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
              placeholder="Enter amount"
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>

        {/* GST Slab */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            GST Rate Slab
          </label>
          <div className="flex flex-wrap gap-2">
            {GST_SLABS.map((slab) => (
              <button
                key={slab}
                onClick={() => setGstSlab(slab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  gstSlab === slab
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                {slab}%
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                value: 'intrastate',
                label: 'Intrastate',
                sub: 'Same state → CGST + SGST',
              },
              {
                value: 'interstate',
                label: 'Interstate',
                sub: 'Different states → IGST',
              },
            ].map(({ value, label, sub }) => (
              <button
                key={value}
                onClick={() => setTransactionType(value as TransactionType)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  transactionType === value
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-sm">{label}</div>
                <div className="text-xs opacity-70 mt-0.5">{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Cess for 28% slab */}
        {gstSlab === 28 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Cess Rate (%) — Optional, for 28% slab goods
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={cessRate}
              onChange={(e) => setCessRate(e.target.value)}
              placeholder="e.g. 22 for automobiles"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleCalculate}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
          >
            Calculate GST
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            title="Reset"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden print:border-slate-300">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">GST Breakdown</h2>
            <div className="flex gap-2 print:hidden">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {/* Base Amount */}
            <div className="flex justify-between items-center px-5 py-3.5">
              <span className="text-sm text-slate-600 dark:text-slate-400">Base Amount</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                {formatCurrency(result.baseAmount)}
              </span>
            </div>

            {/* Tax rows */}
            {isIntrastate ? (
              <>
                <div className="flex justify-between items-center px-5 py-3.5 bg-indigo-50/50 dark:bg-indigo-900/10">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    CGST @ {result.cgstRate}%
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {formatCurrency(result.cgst)}
                  </span>
                </div>
                <div className="flex justify-between items-center px-5 py-3.5 bg-indigo-50/50 dark:bg-indigo-900/10">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    SGST @ {result.sgstRate}%
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {formatCurrency(result.sgst)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center px-5 py-3.5 bg-indigo-50/50 dark:bg-indigo-900/10">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  IGST @ {result.igstRate}%
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {formatCurrency(result.igst)}
                </span>
              </div>
            )}

            {/* Cess row */}
            {result.cessRate > 0 && (
              <div className="flex justify-between items-center px-5 py-3.5 bg-amber-50/50 dark:bg-amber-900/10">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Cess @ {result.cessRate}%
                </span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                  {formatCurrency(result.cess)}
                </span>
              </div>
            )}

            {/* Total Tax */}
            <div className="flex justify-between items-center px-5 py-3.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Total Tax Amount
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                {formatCurrency(result.totalTax)}
              </span>
            </div>

            {/* Final Amount — highlighted */}
            <div className="flex justify-between items-center px-5 py-4 bg-slate-50 dark:bg-slate-900/40">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Final Amount (Incl. GST)
              </span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {formatCurrency(result.finalAmount)}
              </span>
            </div>
          </div>

          {/* Summary chips */}
          <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full font-medium">
              GST Slab: {gstSlab}%
            </span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium">
              {isIntrastate ? 'Intrastate Transaction' : 'Interstate Transaction'}
            </span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium">
              {mode === 'exclusive' ? 'GST Exclusive' : 'GST Inclusive'}
            </span>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-center text-slate-400 dark:text-slate-500 print:text-slate-500">
        This calculator is for reference only. GST applicability depends on HSN/SAC codes and government
        notifications. Consult your CA or tax advisor for professional advice.
      </p>
    </div>
  );
}
