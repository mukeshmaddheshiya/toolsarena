'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TrendingUp, Plus, X, Save, RotateCcw, AlertCircle } from 'lucide-react';

interface AssetItem {
  id: string;
  label: string;
  value: string;
}

interface AssetCategory {
  key: string;
  name: string;
  color: string;
  items: AssetItem[];
}

interface LiabilityItem {
  id: string;
  label: string;
  value: string;
}

const DEFAULT_ASSETS: AssetCategory[] = [
  {
    key: 'cash',
    name: 'Cash & Savings',
    color: '#6366f1',
    items: [
      { id: 'sa', label: 'Savings Account', value: '' },
      { id: 'fd', label: 'Fixed Deposits', value: '' },
      { id: 'cash', label: 'Cash in Hand', value: '' },
    ],
  },
  {
    key: 'investments',
    name: 'Investments',
    color: '#8b5cf6',
    items: [
      { id: 'stocks', label: 'Stocks / Shares', value: '' },
      { id: 'mf', label: 'Mutual Funds', value: '' },
      { id: 'ppf', label: 'PPF', value: '' },
      { id: 'nps', label: 'NPS', value: '' },
      { id: 'gold', label: 'Gold (physical/digital)', value: '' },
      { id: 'crypto', label: 'Crypto', value: '' },
    ],
  },
  {
    key: 'realestate',
    name: 'Real Estate',
    color: '#0ea5e9',
    items: [
      { id: 'home', label: 'Home (market value)', value: '' },
      { id: 'plot', label: 'Plot / Land', value: '' },
      { id: 'rental', label: 'Rental Property', value: '' },
    ],
  },
  {
    key: 'vehicles',
    name: 'Vehicles',
    color: '#f59e0b',
    items: [
      { id: 'car', label: 'Car (resale value)', value: '' },
      { id: 'bike', label: 'Bike / Scooter', value: '' },
    ],
  },
  {
    key: 'other',
    name: 'Other Assets',
    color: '#10b981',
    items: [
      { id: 'epf', label: 'EPF Balance', value: '' },
      { id: 'gratuity', label: 'Gratuity', value: '' },
      { id: 'biz', label: 'Business Value', value: '' },
    ],
  },
];

const DEFAULT_LIABILITIES: LiabilityItem[] = [
  { id: 'homeloan', label: 'Home Loan Outstanding', value: '' },
  { id: 'carloan', label: 'Car / Vehicle Loan', value: '' },
  { id: 'personalloan', label: 'Personal Loan', value: '' },
  { id: 'creditcard', label: 'Credit Card Dues', value: '' },
  { id: 'education', label: 'Education Loan', value: '' },
  { id: 'otherdebts', label: 'Other Debts', value: '' },
];

const STORAGE_KEY = 'toolsarena_networth_v1';

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function parseVal(v: string): number {
  const n = parseFloat(v.replace(/,/g, ''));
  return isNaN(n) || n < 0 ? 0 : n;
}

function formatCurrency(value: number): string {
  return (
    '₹' +
    new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  );
}

function getNetWorthCategory(netWorth: number): { label: string; color: string } {
  if (netWorth < 0) return { label: 'Negative Net Worth', color: 'text-red-600 dark:text-red-400' };
  if (netWorth < 2500000)
    return { label: 'Building Wealth', color: 'text-amber-600 dark:text-amber-400' };
  if (netWorth < 10000000)
    return { label: 'Comfortable', color: 'text-blue-600 dark:text-blue-400' };
  if (netWorth < 50000000)
    return { label: 'Wealthy', color: 'text-indigo-600 dark:text-indigo-400' };
  return { label: 'High Net Worth Individual', color: 'text-emerald-600 dark:text-emerald-400' };
}

export function NetWorthCalculatorTool() {
  const [assets, setAssets] = useState<AssetCategory[]>(DEFAULT_ASSETS);
  const [liabilities, setLiabilities] = useState<LiabilityItem[]>(DEFAULT_LIABILITIES);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'assets' | 'liabilities'>('assets');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.assets) setAssets(parsed.assets);
        if (parsed.liabilities) setLiabilities(parsed.liabilities);
        if (parsed.savedAt) setSavedAt(parsed.savedAt);
      }
    } catch {}
  }, []);

  // Auto-save to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ assets, liabilities, savedAt }));
    } catch {}
  }, [assets, liabilities, savedAt]);

  const totalAssets = useMemo(() => {
    return assets.reduce(
      (sum, cat) => sum + cat.items.reduce((s, item) => s + parseVal(item.value), 0),
      0
    );
  }, [assets]);

  const totalLiabilities = useMemo(() => {
    return liabilities.reduce((sum, item) => sum + parseVal(item.value), 0);
  }, [liabilities]);

  const netWorth = totalAssets - totalLiabilities;
  const netWorthCategory = getNetWorthCategory(netWorth);

  const assetCategoryTotals = useMemo(() => {
    return assets.map((cat) => ({
      key: cat.key,
      name: cat.name,
      color: cat.color,
      total: cat.items.reduce((s, item) => s + parseVal(item.value), 0),
    }));
  }, [assets]);

  const updateAssetItem = useCallback(
    (catKey: string, itemId: string, field: 'label' | 'value', val: string) => {
      setAssets((prev) =>
        prev.map((cat) =>
          cat.key === catKey
            ? {
                ...cat,
                items: cat.items.map((item) =>
                  item.id === itemId ? { ...item, [field]: val } : item
                ),
              }
            : cat
        )
      );
    },
    []
  );

  const addAssetItem = useCallback((catKey: string) => {
    setAssets((prev) =>
      prev.map((cat) =>
        cat.key === catKey
          ? { ...cat, items: [...cat.items, { id: uid(), label: 'New Item', value: '' }] }
          : cat
      )
    );
  }, []);

  const removeAssetItem = useCallback((catKey: string, itemId: string) => {
    setAssets((prev) =>
      prev.map((cat) =>
        cat.key === catKey
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat
      )
    );
  }, []);

  const updateLiability = useCallback((id: string, field: 'label' | 'value', val: string) => {
    setLiabilities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  }, []);

  const addLiability = useCallback(() => {
    setLiabilities((prev) => [...prev, { id: uid(), label: 'New Liability', value: '' }]);
  }, []);

  const removeLiability = useCallback((id: string) => {
    setLiabilities((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleSave = () => {
    const ts = new Date().toLocaleString('en-IN');
    setSavedAt(ts);
  };

  const handleReset = () => {
    if (!window.confirm('Reset all data? This cannot be undone.')) return;
    setAssets(DEFAULT_ASSETS);
    setLiabilities(DEFAULT_LIABILITIES);
    setSavedAt(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl shrink-0">
            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Net Worth Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Assets − Liabilities = Your Net Worth
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {savedAt && (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          Last saved: {savedAt} · Data stored in your browser only
        </p>
      )}

      {/* Net Worth Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
          <div className="text-center sm:text-center flex sm:block items-center justify-between px-3 py-2 sm:p-0 bg-slate-50 dark:bg-slate-700/30 sm:bg-transparent sm:dark:bg-transparent rounded-lg sm:rounded-none">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:mb-1">
              Total Assets
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatCurrency(totalAssets)}
            </div>
          </div>
          <div className="text-center sm:text-center flex sm:block items-center justify-between px-3 py-2 sm:p-0 bg-slate-50 dark:bg-slate-700/30 sm:bg-transparent sm:dark:bg-transparent rounded-lg sm:rounded-none sm:border-x sm:border-slate-100 sm:dark:border-slate-700">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:mb-1">
              Total Liabilities
            </div>
            <div className="text-base sm:text-lg font-bold text-red-500 dark:text-red-400 tabular-nums">
              {formatCurrency(totalLiabilities)}
            </div>
          </div>
          <div className="text-center sm:text-center flex sm:block items-center justify-between px-3 py-2 sm:p-0 bg-indigo-50 dark:bg-indigo-900/20 sm:bg-transparent sm:dark:bg-transparent rounded-lg sm:rounded-none">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:mb-1">
              Net Worth
            </div>
            <div
              className={`text-base sm:text-lg font-bold tabular-nums ${
                netWorth >= 0
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {netWorth < 0 ? '−' : ''}
              {formatCurrency(Math.abs(netWorth))}
            </div>
          </div>
        </div>

        {/* Net Worth Category Badge */}
        <div className="text-center">
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-slate-100 dark:bg-slate-700 ${netWorthCategory.color}`}
          >
            {netWorthCategory.label}
          </span>
        </div>

        {/* Asset Breakdown Bar */}
        {totalAssets > 0 && (
          <div className="mt-5">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
              Asset Breakdown
            </div>
            <div className="h-4 rounded-full overflow-hidden flex">
              {assetCategoryTotals
                .filter((c) => c.total > 0)
                .map((cat) => (
                  <div
                    key={cat.key}
                    title={`${cat.name}: ${formatCurrency(cat.total)}`}
                    style={{
                      width: `${(cat.total / totalAssets) * 100}%`,
                      backgroundColor: cat.color,
                    }}
                    className="h-full transition-all"
                  />
                ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              {assetCategoryTotals
                .filter((c) => c.total > 0)
                .map((cat) => (
                  <div key={cat.key} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}: {formatCurrency(cat.total)}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Section Toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
        {(['assets', 'liabilities'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeSection === s
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {s} {s === 'assets' ? `(${formatCurrency(totalAssets)})` : `(${formatCurrency(totalLiabilities)})`}
          </button>
        ))}
      </div>

      {/* Assets Section */}
      {activeSection === 'assets' && (
        <div className="space-y-4">
          {assets.map((cat) => (
            <div
              key={cat.key}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderLeft: `4px solid ${cat.color}` }}
              >
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    {cat.name}
                  </span>
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    {formatCurrency(
                      cat.items.reduce((s, item) => s + parseVal(item.value), 0)
                    )}
                  </span>
                </div>
                <button
                  onClick={() => addAssetItem(cat.key)}
                  className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  title="Add item"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {cat.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) =>
                        updateAssetItem(cat.key, item.id, 'label', e.target.value)
                      }
                      className="flex-1 min-w-0 text-sm text-slate-700 dark:text-slate-300 bg-transparent focus:outline-none truncate"
                    />
                    <div className="relative flex items-center shrink-0">
                      <span className="absolute left-2 text-xs text-slate-400">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={item.value}
                        onChange={(e) =>
                          updateAssetItem(cat.key, item.id, 'value', e.target.value)
                        }
                        placeholder="0"
                        className="w-24 sm:w-32 pl-6 pr-2 py-1 text-sm text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 tabular-nums"
                      />
                    </div>
                    <button
                      onClick={() => removeAssetItem(cat.key, item.id)}
                      className="p-1 rounded text-slate-300 hover:text-red-400 transition-colors shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Liabilities Section */}
      {activeSection === 'liabilities' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-700" style={{ borderLeft: '4px solid #ef4444' }}>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                All Liabilities
              </span>
              <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                {formatCurrency(totalLiabilities)}
              </span>
            </div>
            <button
              onClick={addLiability}
              className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              title="Add liability"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {liabilities.map((item) => (
              <div key={item.id} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateLiability(item.id, 'label', e.target.value)}
                  className="flex-1 min-w-0 text-sm text-slate-700 dark:text-slate-300 bg-transparent focus:outline-none truncate"
                />
                <div className="relative flex items-center shrink-0">
                  <span className="absolute left-2 text-xs text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={item.value}
                    onChange={(e) => updateLiability(item.id, 'value', e.target.value)}
                    placeholder="0"
                    className="w-24 sm:w-32 pl-6 pr-2 py-1 text-sm text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 tabular-nums"
                  />
                </div>
                <button
                  onClick={() => removeLiability(item.id)}
                  className="p-1 rounded text-slate-300 hover:text-red-400 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <strong>Disclaimer:</strong> This tool is for personal tracking purposes only and does
          not constitute financial advice. Asset valuations are user-entered estimates. Consult a
          certified financial planner for professional guidance.
        </p>
      </div>
    </div>
  );
}
