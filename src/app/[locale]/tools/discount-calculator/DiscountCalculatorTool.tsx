'use client';
import { useState } from 'react';
import { Tag } from 'lucide-react';
import { CopyButton } from '@/components/common/CopyButton';

export function DiscountCalculatorTool() {
  const [mode, setMode] = useState<'calc' | 'reverse' | 'stacked'>('calc');
  const [original, setOriginal] = useState('');
  const [discount, setDiscount] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [discount2, setDiscount2] = useState('');

  const orig = parseFloat(original) || 0;
  const disc = parseFloat(discount) || 0;
  const sale = parseFloat(salePrice) || 0;
  const disc2 = parseFloat(discount2) || 0;

  let result: { salePrice?: number; savings?: number; discountPct?: number; stacked?: number } = {};

  if (mode === 'calc' && orig > 0 && disc >= 0) {
    result.salePrice = orig * (1 - disc / 100);
    result.savings = orig - result.salePrice;
  } else if (mode === 'reverse' && orig > 0 && sale > 0) {
    result.discountPct = ((orig - sale) / orig) * 100;
    result.savings = orig - sale;
  } else if (mode === 'stacked' && orig > 0 && disc >= 0 && disc2 >= 0) {
    result.stacked = orig * (1 - disc / 100) * (1 - disc2 / 100);
    result.savings = orig - result.stacked;
    result.discountPct = ((orig - result.stacked) / orig) * 100;
  }

  const fmt = (n?: number) => n !== undefined ? `\u20B9${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : '';

  return (
    <div className="space-y-5">
      {/* Mode */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
        {[{ v: 'calc', l: 'Calculate Discount' }, { v: 'reverse', l: 'Find % Discount' }, { v: 'stacked', l: 'Stacked Discount' }].map(({ v, l }) => (
          <button key={v} onClick={() => setMode(v as typeof mode)} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-w-[130px] ${mode === v ? 'bg-white dark:bg-slate-800 text-primary-800 dark:text-primary-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Original Price (\u20B9)</label>
          <input type="number" value={original} onChange={e => setOriginal(e.target.value)} placeholder="e.g. 1000" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
        </div>
        {mode !== 'reverse' ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Discount (%)</label>
            <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="e.g. 20" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sale Price (\u20B9)</label>
            <input type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} placeholder="e.g. 800" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
          </div>
        )}
        {mode === 'stacked' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Additional Discount (%)</label>
            <input type="number" value={discount2} onChange={e => setDiscount2(e.target.value)} placeholder="e.g. 10" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
          </div>
        )}
      </div>

      {/* Results */}
      {(result.salePrice !== undefined || result.discountPct !== undefined || result.stacked !== undefined) && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold">
            <Tag className="w-4 h-4" /> Discount Results
          </div>
          {mode === 'calc' && result.salePrice !== undefined && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Sale Price</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-heading font-bold text-green-700 dark:text-green-400">{fmt(result.salePrice)}</span>
                  <CopyButton text={result.salePrice.toFixed(2)} size="sm" label="" />
                </div>
              </div>
              <div className="flex justify-between"><span className="text-sm text-slate-600 dark:text-slate-400">You Save</span><span className="font-bold text-red-600 dark:text-red-400">{fmt(result.savings)}</span></div>
            </>
          )}
          {mode === 'reverse' && result.discountPct !== undefined && (
            <>
              <div className="flex justify-between"><span className="text-sm text-slate-600 dark:text-slate-400">Discount %</span><span className="text-2xl font-heading font-bold text-green-700 dark:text-green-400">{result.discountPct.toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-600 dark:text-slate-400">Savings</span><span className="font-bold text-red-600 dark:text-red-400">{fmt(result.savings)}</span></div>
            </>
          )}
          {mode === 'stacked' && result.stacked !== undefined && (
            <>
              <div className="flex justify-between"><span className="text-sm text-slate-600 dark:text-slate-400">Final Price</span><span className="text-2xl font-heading font-bold text-green-700 dark:text-green-400">{fmt(result.stacked)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-600 dark:text-slate-400">Total Discount</span><span className="font-bold text-primary-700 dark:text-primary-400">{result.discountPct?.toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-600 dark:text-slate-400">Total Savings</span><span className="font-bold text-red-600 dark:text-red-400">{fmt(result.savings)}</span></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
