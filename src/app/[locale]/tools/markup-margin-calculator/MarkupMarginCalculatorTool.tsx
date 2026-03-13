'use client';

import { useState, useCallback } from 'react';

// ── helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number | null) {
  if (n === null || isNaN(n) || !isFinite(n)) return '';
  return n.toFixed(2);
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const labelClass =
  'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

const QUICK_MARKUPS = [10, 20, 25, 33, 50, 100];

type Field = 'cost' | 'selling' | 'grossProfit' | 'markup' | 'margin';

interface Fields {
  cost: string;
  selling: string;
  grossProfit: string;
  markup: string;
  margin: string;
}

function deriveAll(changed: Field, val: number, prev: Fields): Fields {
  let cost = parseFloat(prev.cost);
  let selling = parseFloat(prev.selling);
  let grossProfit = parseFloat(prev.grossProfit);
  let markup = parseFloat(prev.markup);
  let margin = parseFloat(prev.margin);

  // Derive all from the changed field
  if (changed === 'cost') {
    cost = val;
    if (!isNaN(selling) && isFinite(selling)) {
      grossProfit = selling - cost;
      markup = cost > 0 ? (grossProfit / cost) * 100 : NaN;
      margin = selling > 0 ? (grossProfit / selling) * 100 : NaN;
    } else if (!isNaN(markup) && isFinite(markup)) {
      grossProfit = (markup / 100) * cost;
      selling = cost + grossProfit;
      margin = selling > 0 ? (grossProfit / selling) * 100 : NaN;
    }
  } else if (changed === 'selling') {
    selling = val;
    if (!isNaN(cost) && isFinite(cost)) {
      grossProfit = selling - cost;
      markup = cost > 0 ? (grossProfit / cost) * 100 : NaN;
      margin = selling > 0 ? (grossProfit / selling) * 100 : NaN;
    }
  } else if (changed === 'grossProfit') {
    grossProfit = val;
    if (!isNaN(cost) && isFinite(cost) && cost > 0) {
      selling = cost + grossProfit;
      markup = (grossProfit / cost) * 100;
      margin = selling > 0 ? (grossProfit / selling) * 100 : NaN;
    }
  } else if (changed === 'markup') {
    markup = val;
    if (!isNaN(cost) && isFinite(cost) && cost > 0) {
      grossProfit = (markup / 100) * cost;
      selling = cost + grossProfit;
      margin = selling > 0 ? (grossProfit / selling) * 100 : NaN;
    }
  } else if (changed === 'margin') {
    margin = val;
    if (!isNaN(cost) && isFinite(cost) && cost > 0 && margin < 100) {
      // margin = grossProfit / selling → selling = cost / (1 - margin/100)
      selling = cost / (1 - margin / 100);
      grossProfit = selling - cost;
      markup = (grossProfit / cost) * 100;
    }
  }

  // Only update fields that are not the one being typed
  const result: Fields = { ...prev, [changed]: prev[changed] };
  if (changed !== 'cost') result.cost = isNaN(cost) || !isFinite(cost) ? '' : fmt(cost)!;
  if (changed !== 'selling') result.selling = isNaN(selling) || !isFinite(selling) ? '' : fmt(selling)!;
  if (changed !== 'grossProfit') result.grossProfit = isNaN(grossProfit) || !isFinite(grossProfit) ? '' : fmt(grossProfit)!;
  if (changed !== 'markup') result.markup = isNaN(markup) || !isFinite(markup) ? '' : fmt(markup)!;
  if (changed !== 'margin') result.margin = isNaN(margin) || !isFinite(margin) ? '' : fmt(margin)!;

  return result;
}

export function MarkupMarginCalculatorTool() {
  const [fields, setFields] = useState<Fields>({
    cost: '',
    selling: '',
    grossProfit: '',
    markup: '',
    margin: '',
  });

  const handleChange = useCallback((field: Field, rawVal: string) => {
    const numVal = parseFloat(rawVal);
    setFields(prev => {
      const updated = { ...prev, [field]: rawVal };
      if (isNaN(numVal) || rawVal === '' || rawVal === '-') return updated;
      return deriveAll(field, numVal, updated);
    });
  }, []);

  function applyQuickMarkup(markupPct: number) {
    const cost = parseFloat(fields.cost);
    if (!cost || cost <= 0) return;
    const grossProfit = (markupPct / 100) * cost;
    const selling = cost + grossProfit;
    const margin = (grossProfit / selling) * 100;
    setFields({
      cost: fmt(cost)!,
      selling: fmt(selling)!,
      grossProfit: fmt(grossProfit)!,
      markup: fmt(markupPct)!,
      margin: fmt(margin)!,
    });
  }

  const hasValues = fields.cost || fields.selling || fields.grossProfit;

  const grossProfitNum = parseFloat(fields.grossProfit);
  const profitColor =
    !isNaN(grossProfitNum) && isFinite(grossProfitNum)
      ? grossProfitNum >= 0
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-red-600 dark:text-red-400'
      : 'text-slate-700 dark:text-slate-300';

  // Field config
  const fieldConfig: {
    key: Field;
    label: string;
    placeholder: string;
    colorClass: string;
    suffix?: string;
    prefix?: string;
  }[] = [
    {
      key: 'cost',
      label: 'Cost Price',
      placeholder: '0.00',
      prefix: '$',
      colorClass: 'text-blue-600 dark:text-blue-400',
    },
    {
      key: 'selling',
      label: 'Selling Price',
      placeholder: '0.00',
      prefix: '$',
      colorClass: profitColor,
    },
    {
      key: 'grossProfit',
      label: 'Gross Profit',
      placeholder: '0.00',
      prefix: '$',
      colorClass: profitColor,
    },
    {
      key: 'markup',
      label: 'Markup %',
      placeholder: '0.00',
      suffix: '%',
      colorClass: 'text-violet-600 dark:text-violet-400',
    },
    {
      key: 'margin',
      label: 'Profit Margin %',
      placeholder: '0.00',
      suffix: '%',
      colorClass: profitColor,
    },
  ];

  return (
    <div className="space-y-5">
      {/* ── Bidirectional inputs ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Live Calculator — edit any field
          </h3>
          <button
            onClick={() =>
              setFields({ cost: '', selling: '', grossProfit: '', markup: '', margin: '' })
            }
            className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 underline"
          >
            Clear all
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fieldConfig.map(fc => (
            <div key={fc.key}>
              <label className={`${labelClass} ${fc.colorClass}`}>{fc.label}</label>
              <div className="relative">
                {fc.prefix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500 pointer-events-none">
                    {fc.prefix}
                  </span>
                )}
                <input
                  type="number"
                  step="any"
                  placeholder={fc.placeholder}
                  value={fields[fc.key]}
                  onChange={e => handleChange(fc.key, e.target.value)}
                  className={`${inputClass} ${fc.prefix ? 'pl-7' : ''} ${
                    fc.suffix ? 'pr-8' : ''
                  } font-mono`}
                />
                {fc.suffix && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500 pointer-events-none">
                    {fc.suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick markup buttons */}
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            Quick Markup (requires Cost Price):
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_MARKUPS.map(m => (
              <button
                key={m}
                onClick={() => applyQuickMarkup(m)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                {m}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Explanation card ── */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-4 space-y-2">
        <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">
          Markup vs Margin — Know the Difference
        </h4>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-blue-700 dark:text-blue-400">
          <div className="space-y-1">
            <p>
              <strong>Markup %</strong> is calculated on{' '}
              <span className="underline">COST PRICE</span>.
            </p>
            <p className="font-mono bg-blue-100 dark:bg-blue-900/40 rounded px-2 py-1">
              Markup = (Gross Profit / Cost) × 100
            </p>
          </div>
          <div className="space-y-1">
            <p>
              <strong>Margin %</strong> is calculated on{' '}
              <span className="underline">SELLING PRICE</span>.
            </p>
            <p className="font-mono bg-blue-100 dark:bg-blue-900/40 rounded px-2 py-1">
              Margin = (Gross Profit / Selling Price) × 100
            </p>
          </div>
        </div>

        {hasValues && fields.markup && fields.margin && (
          <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 mt-2">
            Your {fields.markup}% markup = {fields.margin}% margin. They are NOT the same!
          </p>
        )}

        <p className="text-xs text-blue-600 dark:text-blue-500">
          Example: Cost = $100, Selling = $150. Gross Profit = $50.{' '}
          <strong>Markup = 50%</strong> (50/100). <strong>Margin = 33.3%</strong> (50/150).
        </p>

        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
          A 50% markup = 33.3% margin. They are NOT the same!
        </p>
      </div>
    </div>
  );
}
