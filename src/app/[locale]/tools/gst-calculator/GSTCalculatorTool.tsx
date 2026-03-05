'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { Receipt } from 'lucide-react';

const GST_RATES = [5, 12, 18, 28];

export function GSTCalculatorTool() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [transactionType, setTransactionType] = useState<'intrastate' | 'interstate'>('intrastate');

  const val = parseFloat(amount) || 0;
  let baseAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (mode === 'exclusive') {
    baseAmount = val;
    gstAmount = val * rate / 100;
    totalAmount = val + gstAmount;
  } else {
    totalAmount = val;
    baseAmount = val / (1 + rate / 100);
    gstAmount = totalAmount - baseAmount;
  }

  const halfGst = gstAmount / 2;
  const fmt = (n: number) => '\u20B9' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className="space-y-5">
      {/* Mode */}
      <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {[{ v: 'exclusive', l: 'Add GST (GST exclusive)' }, { v: 'inclusive', l: 'Remove GST (GST inclusive)' }].map(({ v, l }) => (
          <button key={v} onClick={() => setMode(v as typeof mode)} className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${mode === v ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Amount input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {mode === 'exclusive' ? 'Base Amount (\u20B9)' : 'Amount Including GST (\u20B9)'}
        </label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
        />
      </div>

      {/* Rate selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">GST Rate</label>
        <div className="flex gap-2">
          {GST_RATES.map(r => (
            <button key={r} onClick={() => setRate(r)} className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${rate === r ? 'bg-primary-800 text-white border-primary-800' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-400'}`}>
              {r}%
            </button>
          ))}
        </div>
      </div>

      {/* Transaction type */}
      <div className="flex gap-4">
        {[{ v: 'intrastate', l: 'Intra-state (CGST + SGST)' }, { v: 'interstate', l: 'Inter-state (IGST)' }].map(({ v, l }) => (
          <label key={v} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="txtype" value={v} checked={transactionType === v} onChange={() => setTransactionType(v as typeof transactionType)} className="text-primary-800" />
            <span className="text-sm text-slate-700 dark:text-slate-300">{l}</span>
          </label>
        ))}
      </div>

      {/* Results */}
      {val > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-primary-800 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Receipt className="w-4 h-4" />
              <span className="font-medium text-sm">GST Breakdown</span>
            </div>
            <span className="text-white text-xs bg-primary-700 px-2 py-0.5 rounded-full">GST @{rate}%</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm text-slate-600 dark:text-slate-400">Base Amount</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-100">{fmt(baseAmount)}</span>
                <CopyButton text={baseAmount.toFixed(2)} size="sm" label="" />
              </div>
            </div>
            {transactionType === 'intrastate' ? (
              <>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">CGST ({rate / 2}%)</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{fmt(halfGst)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">SGST ({rate / 2}%)</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{fmt(halfGst)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-slate-600 dark:text-slate-400">IGST ({rate}%)</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{fmt(gstAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-t border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Total GST</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{fmt(gstAmount)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl px-4 -mx-1">
              <span className="font-bold text-slate-900 dark:text-slate-100">Total Amount</span>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xl text-primary-800 dark:text-primary-400">{fmt(totalAmount)}</span>
                <CopyButton text={totalAmount.toFixed(2)} size="sm" label="" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
