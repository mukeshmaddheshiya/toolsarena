'use client';

import { useState, useMemo } from 'react';

type ServiceType = 'data' | 'voice' | 'combo';
type Operator = 'ntc' | 'ncell' | 'both';

interface Pack {
  operator: 'NTC' | 'Ncell';
  price: number;
  type: ServiceType;
  data?: number; // GB
  minutes?: number;
  validity: number; // days
  label: string;
  notes?: string;
}

const ALL_PACKS: Pack[] = [
  // NTC Data
  { operator: 'NTC', price: 100, type: 'data', data: 2, validity: 3, label: 'NTC 2GB/3days' },
  { operator: 'NTC', price: 200, type: 'data', data: 5, validity: 7, label: 'NTC 5GB/7days' },
  { operator: 'NTC', price: 300, type: 'data', data: 10, validity: 28, label: 'NTC 10GB/28days' },
  { operator: 'NTC', price: 500, type: 'combo', data: 20, minutes: 100, validity: 28, label: 'NTC 20GB+100min/28days', notes: '100 free minutes included' },
  { operator: 'NTC', price: 1000, type: 'data', data: 50, validity: 28, label: 'NTC 50GB/28days' },
  // NTC Voice
  { operator: 'NTC', price: 50, type: 'voice', minutes: 60, validity: 7, label: 'NTC 60min/7days', notes: 'NTC-NTC calls only' },
  { operator: 'NTC', price: 150, type: 'voice', minutes: 200, validity: 30, label: 'NTC 200min/30days', notes: 'All networks' },
  { operator: 'NTC', price: 300, type: 'combo', data: 2, minutes: 9999, validity: 30, label: 'NTC Unlimited+2GB/30days', notes: 'Unlimited NTC calls + 2GB data' },
  // Ncell Data
  { operator: 'Ncell', price: 98, type: 'data', data: 2, validity: 3, label: 'Ncell 2GB/3days' },
  { operator: 'Ncell', price: 198, type: 'data', data: 5, validity: 7, label: 'Ncell 5GB/7days' },
  { operator: 'Ncell', price: 298, type: 'data', data: 10, validity: 28, label: 'Ncell 10GB/28days' },
  { operator: 'Ncell', price: 498, type: 'data', data: 20, validity: 28, label: 'Ncell 20GB/28days' },
  { operator: 'Ncell', price: 998, type: 'data', data: 50, validity: 28, label: 'Ncell 50GB/28days' },
  // Ncell Voice
  { operator: 'Ncell', price: 49, type: 'voice', minutes: 60, validity: 7, label: 'Ncell 60min/7days' },
  { operator: 'Ncell', price: 149, type: 'voice', minutes: 200, validity: 30, label: 'Ncell 200min/30days', notes: 'All networks' },
];

function getValueScore(pack: Pack): number {
  if (pack.type === 'data' || (pack.type === 'combo' && pack.data)) {
    return (pack.data ?? 0) / pack.price;
  }
  if (pack.type === 'voice') {
    return (pack.minutes ?? 0) / pack.price;
  }
  return 0;
}

function formatScore(pack: Pack): string {
  const score = getValueScore(pack);
  if (pack.type === 'data') return `${(score * 1000).toFixed(1)} MB/रु.`;
  if (pack.type === 'voice') return `${score.toFixed(2)} min/रु.`;
  if (pack.type === 'combo') {
    const dataScore = ((pack.data ?? 0) / pack.price * 1000).toFixed(1);
    return `${dataScore} MB/रु. (data)`;
  }
  return '';
}

const SERVICE_LABELS: Record<ServiceType, string> = {
  data: 'Data',
  voice: 'Voice+SMS',
  combo: 'Combo',
};

const OPERATOR_BG: Record<string, string> = {
  NTC: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Ncell: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
};

export function NepalTelecomCalculatorTool() {
  const [budget, setBudget] = useState<string>('300');
  const [serviceType, setServiceType] = useState<ServiceType>('data');
  const [operator, setOperator] = useState<Operator>('both');

  const budgetNum = parseFloat(budget) || 0;

  const filtered = useMemo(() => {
    return ALL_PACKS.filter((p) => {
      const typeMatch = serviceType === 'combo' ? p.type === 'combo' : (p.type === serviceType || p.type === 'combo');
      const opMatch =
        operator === 'both' ||
        (operator === 'ntc' && p.operator === 'NTC') ||
        (operator === 'ncell' && p.operator === 'Ncell');
      const budgetMatch = budgetNum <= 0 || p.price <= budgetNum;
      return typeMatch && opMatch && budgetMatch;
    });
  }, [budget, serviceType, operator, budgetNum]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => getValueScore(b) - getValueScore(a));
  }, [filtered]);

  const bestScore = sorted.length > 0 ? getValueScore(sorted[0]) : 0;

  // Comparison pairs: NTC vs Ncell for similar prices
  const comparisonPairs = useMemo(() => {
    const ntcPacks = ALL_PACKS.filter(
      (p) => p.operator === 'NTC' && (p.type === serviceType || serviceType === 'combo')
    );
    const ncellPacks = ALL_PACKS.filter(
      (p) => p.operator === 'Ncell' && (p.type === serviceType || serviceType === 'combo')
    );
    const pairs: { ntc: Pack; ncell: Pack }[] = [];
    ntcPacks.forEach((ntc) => {
      const closest = ncellPacks.reduce(
        (prev, cur) =>
          Math.abs(cur.price - ntc.price) < Math.abs(prev.price - ntc.price) ? cur : prev,
        ncellPacks[0]
      );
      if (closest && !pairs.find((p) => p.ncell.label === closest.label)) {
        pairs.push({ ntc, ncell: closest });
      }
    });
    return pairs.slice(0, 5);
  }, [serviceType]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Budget Input */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4">Your Recharge Budget</h2>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-500 dark:text-slate-400">रु.</span>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter amount"
            min={0}
            className="flex-1 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-xl font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">Shows packs at or below your budget</p>
      </div>

      {/* Service Type Toggle */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-3">Service Type</h2>
        <div className="flex gap-2">
          {(['data', 'voice', 'combo'] as ServiceType[]).map((s) => (
            <button
              key={s}
              onClick={() => setServiceType(s)}
              className={`flex-1 py-2 rounded-xl font-medium text-sm transition-colors ${
                serviceType === s
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {SERVICE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Operator Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-3">Operator</h2>
        <div className="flex gap-2">
          {(['ntc', 'ncell', 'both'] as Operator[]).map((op) => (
            <button
              key={op}
              onClick={() => setOperator(op)}
              className={`flex-1 py-2 rounded-xl font-medium text-sm transition-colors ${
                operator === op
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {op === 'ntc' ? 'NTC' : op === 'ncell' ? 'Ncell' : 'Both'}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4">
          Matching Packs ({sorted.length})
        </h2>
        {sorted.length === 0 ? (
          <p className="text-gray-400 dark:text-slate-500 text-center py-8">No packs found for your selection. Try increasing your budget or changing filters.</p>
        ) : (
          <div className="space-y-3">
            {sorted.map((pack, idx) => {
              const isBest = getValueScore(pack) === bestScore && bestScore > 0;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                    isBest ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/30' : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${OPERATOR_BG[pack.operator]}`}>
                      {pack.operator}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-slate-100">{pack.label}</p>
                      {pack.notes && (
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{pack.notes}</p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Valid: {pack.validity} days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <span className="text-lg font-bold text-gray-800 dark:text-slate-100">रु.{pack.price}</span>
                    <span className="text-xs text-gray-500 dark:text-slate-400">{formatScore(pack)}</span>
                    {isBest && (
                      <span className="text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">
                        Best Value
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {operator === 'both' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4">NTC vs Ncell Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-2 pr-4 text-gray-600 dark:text-slate-400 font-medium">NTC Pack</th>
                  <th className="text-center py-2 px-2 text-blue-600 dark:text-blue-400 font-medium">NTC रु.</th>
                  <th className="text-center py-2 px-2 text-purple-600 dark:text-purple-400 font-medium">Ncell रु.</th>
                  <th className="text-left py-2 pl-4 text-gray-600 dark:text-slate-400 font-medium">Ncell Pack</th>
                </tr>
              </thead>
              <tbody>
                {comparisonPairs.map((pair, i) => {
                  const ntcScore = getValueScore(pair.ntc);
                  const ncellScore = getValueScore(pair.ncell);
                  const ntcWins = ntcScore >= ncellScore;
                  return (
                    <tr key={i} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                      <td className="py-2 pr-4 text-gray-700 dark:text-slate-300">{pair.ntc.label}</td>
                      <td className={`text-center py-2 px-2 font-semibold ${ntcWins ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-slate-500'}`}>
                        रु.{pair.ntc.price}
                      </td>
                      <td className={`text-center py-2 px-2 font-semibold ${!ntcWins ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-slate-500'}`}>
                        रु.{pair.ncell.price}
                      </td>
                      <td className="py-2 pl-4 text-gray-700 dark:text-slate-300">{pair.ncell.label}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Balance Check Tip */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
        <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Quick Balance Check</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-3 border border-amber-100 dark:border-amber-800">
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">NTC Balance</p>
            <p className="font-bold text-blue-700 dark:text-blue-400 text-lg">*9988#</p>
          </div>
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-3 border border-amber-100 dark:border-amber-800">
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Ncell Balance</p>
            <p className="font-bold text-purple-700 dark:text-purple-400 text-lg">*9999#</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 dark:text-slate-500 text-center pb-2">
        * Rates are approximate 2024/25 figures. Check operator website for current offers.
      </p>
    </div>
  );
}
