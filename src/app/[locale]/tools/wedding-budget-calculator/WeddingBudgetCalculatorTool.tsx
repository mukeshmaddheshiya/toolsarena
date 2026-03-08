'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Heart,
  IndianRupee,
  Users,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  PieChart,
  Wallet,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  percentage: number;
  allocated: number;
  spent: number;
}

const DEFAULT_CATEGORIES: Omit<CategoryItem, 'allocated' | 'spent'>[] = [
  { id: 'venue', name: 'Venue & Mandap', description: 'Venue booking, mandap decoration, lighting, generator', percentage: 25 },
  { id: 'catering', name: 'Catering', description: 'Food, beverages, welcome drinks, live counters, service staff', percentage: 20 },
  { id: 'decoration', name: 'Decoration & Flowers', description: 'Stage, entrance, flower arrangements, draping', percentage: 10 },
  { id: 'photography', name: 'Photography & Video', description: 'Pre-wedding shoot, wedding day, drone, album', percentage: 8 },
  { id: 'bride-outfit', name: "Bride's Outfit & Jewellery", description: 'Lehenga/saree, jewellery, accessories, mehndi outfit', percentage: 10 },
  { id: 'groom-outfit', name: "Groom's Outfit", description: 'Sherwani/suit, accessories, shoes', percentage: 5 },
  { id: 'mehndi-sangeet', name: 'Mehndi & Sangeet', description: 'Mehndi artist, sangeet setup, DJ/band, snacks', percentage: 5 },
  { id: 'baraat', name: 'Baraat & Band', description: 'Dhol, band, mare/ghodi, fireworks, baraat decorations', percentage: 3 },
  { id: 'invitations', name: 'Invitations & Stationery', description: 'Physical cards, e-invites, thank you cards', percentage: 2 },
  { id: 'makeup', name: 'Makeup & Hair', description: 'Bridal makeup, family makeup, hairstylist', percentage: 3 },
  { id: 'transport', name: 'Transport & Logistics', description: 'Cars, guest transport, hotel bookings', percentage: 3 },
  { id: 'pandit', name: 'Pandit & Rituals', description: 'Pandit fees, havan samagri, puja items', percentage: 2 },
  { id: 'misc', name: 'Miscellaneous', description: 'Tips, emergency fund, favors, trousseau packing', percentage: 4 },
];

function formatINR(amount: number): string {
  if (amount >= 10000000) {
    const crores = amount / 10000000;
    return crores % 1 === 0 ? `${crores} Cr` : `${crores.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return lakhs % 1 === 0 ? `${lakhs} L` : `${lakhs.toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN').format(Math.round(amount));
}

function formatINRFull(amount: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(amount));
}

function parseINRInput(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

export function WeddingBudgetCalculatorTool() {
  const [totalBudget, setTotalBudget] = useState<string>('');
  const [guestCount, setGuestCount] = useState<string>('');
  const [categories, setCategories] = useState<CategoryItem[]>(() =>
    DEFAULT_CATEGORIES.map((c) => ({ ...c, allocated: 0, spent: 0 }))
  );
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const budget = parseINRInput(totalBudget);
  const guests = parseInt(guestCount) || 0;

  const recalcCategories = useCallback(
    (newBudget: number, cats: CategoryItem[]): CategoryItem[] =>
      cats.map((c) => ({ ...c, allocated: Math.round((c.percentage / 100) * newBudget) })),
    []
  );

  const handleBudgetChange = (value: string) => {
    setTotalBudget(value);
    const newBudget = parseINRInput(value);
    setCategories((prev) => recalcCategories(newBudget, prev));
  };

  const handlePercentageChange = (id: string, newPct: string) => {
    const pct = Math.max(0, Math.min(100, parseFloat(newPct) || 0));
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, percentage: pct, allocated: Math.round((pct / 100) * budget) }
          : c
      )
    );
  };

  const handleAllocatedChange = (id: string, value: string) => {
    const amt = parseINRInput(value);
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, allocated: amt, percentage: budget > 0 ? parseFloat(((amt / budget) * 100).toFixed(2)) : 0 }
          : c
      )
    );
  };

  const handleSpentChange = (id: string, value: string) => {
    const amt = parseINRInput(value);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, spent: amt } : c))
    );
  };

  const summary = useMemo(() => {
    const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
    const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
    const remaining = budget - totalSpent;
    const perGuest = guests > 0 ? budget / guests : 0;
    const totalPctUsed = categories.reduce((sum, c) => sum + c.percentage, 0);
    return { totalAllocated, totalSpent, remaining, perGuest, totalPctUsed };
  }, [categories, budget, guests]);

  const handleTryExample = () => {
    const exampleBudget = 1500000;
    setTotalBudget('1500000');
    setGuestCount('300');
    setCategories(
      DEFAULT_CATEGORIES.map((c) => ({
        ...c,
        allocated: Math.round((c.percentage / 100) * exampleBudget),
        spent: 0,
      }))
    );
  };

  const handleReset = () => {
    setTotalBudget('');
    setGuestCount('');
    setCategories(DEFAULT_CATEGORIES.map((c) => ({ ...c, allocated: 0, spent: 0 })));
    setExpandedCategory(null);
  };

  const handleCopySummary = () => {
    const lines = [
      '=== Wedding Budget Summary ===',
      '',
      `Total Budget: Rs ${formatINRFull(budget)}`,
      `Guest Count: ${guests || 'N/A'}`,
      guests > 0 ? `Per Guest Cost: Rs ${formatINRFull(summary.perGuest)}` : '',
      '',
      `Total Allocated: Rs ${formatINRFull(summary.totalAllocated)}`,
      `Total Spent: Rs ${formatINRFull(summary.totalSpent)}`,
      `Remaining: Rs ${formatINRFull(summary.remaining)}`,
      '',
      '--- Category Breakdown ---',
      ...categories.map(
        (c) =>
          `${c.name} (${c.percentage}%): Allocated Rs ${formatINRFull(c.allocated)} | Spent Rs ${formatINRFull(c.spent)} | ${c.spent <= c.allocated ? 'Under Budget' : 'Over Budget'}`
      ),
    ]
      .filter(Boolean)
      .join('\n');
    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (cat: CategoryItem) => {
    if (cat.spent === 0 && cat.allocated === 0) return null;
    if (cat.spent === 0)
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          <Minus className="h-3 w-3" /> Not Started
        </span>
      );
    if (cat.spent <= cat.allocated)
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          <TrendingDown className="h-3 w-3" /> Under Budget
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
        <TrendingUp className="h-3 w-3" /> Over Budget
      </span>
    );
  };

  const getProgressWidth = (cat: CategoryItem) => {
    if (cat.allocated === 0) return 0;
    return Math.min((cat.spent / cat.allocated) * 100, 150);
  };

  const getProgressColor = (cat: CategoryItem) => {
    if (cat.allocated === 0) return 'bg-gray-300 dark:bg-gray-600';
    if (cat.spent <= cat.allocated) return 'bg-emerald-500';
    return 'bg-red-500';
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Heart className="h-6 w-6" />
              <h2 className="text-xl font-bold sm:text-2xl">Wedding Budget Calculator</h2>
            </div>
            <p className="text-sm text-rose-100 sm:text-base">
              Plan your dream Indian wedding with pre-filled categories and smart budget tracking.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleTryExample}
              className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-white/30"
            >
              <Sparkles className="h-4 w-4" /> Try Example
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-white/30"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Budget & Guest Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <IndianRupee className="h-4 w-4 text-rose-500" /> Total Budget
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">Rs</span>
            <input
              type="text"
              inputMode="numeric"
              value={totalBudget}
              onChange={(e) => handleBudgetChange(e.target.value)}
              placeholder="e.g. 1500000"
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-lg font-semibold text-gray-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-800"
            />
          </div>
          {budget > 0 && (
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              Rs {formatINRFull(budget)} ({formatINR(budget)})
            </p>
          )}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Users className="h-4 w-4 text-rose-500" /> Guest Count
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="e.g. 300"
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-lg font-semibold text-gray-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-800"
          />
          {guests > 0 && budget > 0 && (
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              Per guest cost: Rs {formatINRFull(summary.perGuest)}
            </p>
          )}
        </div>
      </div>

      {/* Summary Dashboard */}
      {budget > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Budget</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">Rs {formatINR(budget)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Allocated</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">Rs {formatINR(summary.totalAllocated)}</p>
            <p className={`mt-0.5 text-xs ${summary.totalPctUsed === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {summary.totalPctUsed.toFixed(1)}% of budget
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
            <p className={`mt-1 text-lg font-bold ${summary.totalSpent > budget ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
              Rs {formatINR(summary.totalSpent)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Remaining</p>
            <p className={`mt-1 text-lg font-bold ${summary.remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              Rs {formatINR(Math.abs(summary.remaining))}
              {summary.remaining < 0 && ' over'}
            </p>
          </div>
        </div>
      )}

      {/* Overall Progress */}
      {budget > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <PieChart className="h-4 w-4 text-rose-500" /> Overall Spending
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {budget > 0 ? ((summary.totalSpent / budget) * 100).toFixed(1) : '0'}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${summary.totalSpent > budget ? 'bg-red-500' : 'bg-rose-500'}`}
              style={{ width: `${Math.min((summary.totalSpent / budget) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Wallet className="h-5 w-5 text-rose-500" /> Category Breakdown
          </h3>
          {budget > 0 && (
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>
          )}
        </div>

        {categories.map((cat) => {
          const isExpanded = expandedCategory === cat.id;
          return (
            <div
              key={cat.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Category Header Row */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">{cat.name}</span>
                    <span className="rounded bg-rose-100 px-1.5 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                      {cat.percentage}%
                    </span>
                    {getStatusBadge(cat)}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{cat.description}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Rs {formatINR(cat.allocated)}
                  </span>
                  {cat.spent > 0 && (
                    <span className={`text-xs font-medium ${cat.spent > cat.allocated ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      Spent: Rs {formatINR(cat.spent)}
                    </span>
                  )}
                </div>
                <div className="shrink-0 text-gray-400">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {/* Progress Bar */}
              {cat.allocated > 0 && (
                <div className="px-4 pb-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(cat)}`}
                      style={{ width: `${Math.min(getProgressWidth(cat), 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Expanded Edit Panel */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-850">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Allocation (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={cat.percentage}
                        onChange={(e) => handlePercentageChange(cat.id, e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-800"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Budget Amount (Rs)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cat.allocated || ''}
                        onChange={(e) => handleAllocatedChange(cat.id, e.target.value)}
                        placeholder="0"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-800"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Actual Spent (Rs)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cat.spent || ''}
                        onChange={(e) => handleSpentChange(cat.id, e.target.value)}
                        placeholder="0"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-800"
                      />
                    </div>
                  </div>
                  {cat.allocated > 0 && cat.spent > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span>
                        Difference:{' '}
                        <strong className={cat.spent > cat.allocated ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}>
                          {cat.spent > cat.allocated ? '+' : '-'}Rs {formatINRFull(Math.abs(cat.spent - cat.allocated))}
                        </strong>
                      </span>
                      <span>
                        Usage:{' '}
                        <strong>{((cat.spent / cat.allocated) * 100).toFixed(1)}%</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Per Guest Section */}
      {budget > 0 && guests > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950/30">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-rose-800 dark:text-rose-300">
            <Users className="h-4 w-4" /> Per Guest Breakdown
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-xs text-rose-600 dark:text-rose-400">Total per Guest</p>
              <p className="text-base font-bold text-rose-900 dark:text-rose-200">Rs {formatINRFull(summary.perGuest)}</p>
            </div>
            <div>
              <p className="text-xs text-rose-600 dark:text-rose-400">Catering per Guest</p>
              <p className="text-base font-bold text-rose-900 dark:text-rose-200">
                Rs {formatINRFull((categories.find((c) => c.id === 'catering')?.allocated || 0) / guests)}
              </p>
            </div>
            <div>
              <p className="text-xs text-rose-600 dark:text-rose-400">Venue per Guest</p>
              <p className="text-base font-bold text-rose-900 dark:text-rose-200">
                Rs {formatINRFull((categories.find((c) => c.id === 'venue')?.allocated || 0) / guests)}
              </p>
            </div>
            <div>
              <p className="text-xs text-rose-600 dark:text-rose-400">Invite per Guest</p>
              <p className="text-base font-bold text-rose-900 dark:text-rose-200">
                Rs {formatINRFull((categories.find((c) => c.id === 'invitations')?.allocated || 0) / guests)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Budget Presets */}
      {!budget && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Quick Budget Presets</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Rs 5 Lakh', value: 500000 },
              { label: 'Rs 10 Lakh', value: 1000000 },
              { label: 'Rs 15 Lakh', value: 1500000 },
              { label: 'Rs 25 Lakh', value: 2500000 },
              { label: 'Rs 50 Lakh', value: 5000000 },
              { label: 'Rs 1 Crore', value: 10000000 },
            ].map((preset) => (
              <button
                key={preset.value}
                onClick={() => {
                  setTotalBudget(preset.value.toString());
                  setCategories((prev) => recalcCategories(preset.value, prev));
                }}
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-900/40"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Allocation Visual Chart */}
      {budget > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Budget Allocation Overview</h4>
          <div className="space-y-2">
            {categories
              .filter((c) => c.percentage > 0)
              .sort((a, b) => b.percentage - a.percentage)
              .map((cat) => (
                <div key={cat.id} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 truncate text-xs text-gray-600 dark:text-gray-400 sm:w-44">
                    {cat.name}
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-500"
                      style={{ width: `${(cat.percentage / Math.max(...categories.map((c) => c.percentage))) * 100}%` }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs font-medium text-gray-700 dark:text-gray-300">
                    {cat.percentage}%
                  </span>
                  <span className="hidden w-24 shrink-0 text-right text-xs font-medium text-gray-500 dark:text-gray-400 sm:block">
                    Rs {formatINR(cat.allocated)}
                  </span>
                </div>
              ))}
          </div>
          {summary.totalPctUsed !== 100 && (
            <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
              Total allocation is {summary.totalPctUsed.toFixed(1)}% — {summary.totalPctUsed < 100 ? `${(100 - summary.totalPctUsed).toFixed(1)}% unallocated` : `${(summary.totalPctUsed - 100).toFixed(1)}% over-allocated`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
