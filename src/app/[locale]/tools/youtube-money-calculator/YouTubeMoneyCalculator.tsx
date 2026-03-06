'use client';
import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Globe, BarChart3, Users, Eye, Tv, Info, ChevronDown, ChevronUp } from 'lucide-react';

/* ─── Data ─── */
const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', cpmRange: [2, 12], avg: 5.5 },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', cpmRange: [3, 10], avg: 5.0 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', cpmRange: [2.5, 10], avg: 4.8 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', cpmRange: [3, 11], avg: 5.2 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', cpmRange: [2.5, 9], avg: 4.5 },
  { code: 'IN', name: 'India', flag: '🇮🇳', cpmRange: [0.3, 2.5], avg: 1.0 },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', cpmRange: [0.2, 1.5], avg: 0.5 },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', cpmRange: [0.3, 2.0], avg: 0.7 },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', cpmRange: [0.2, 1.5], avg: 0.5 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', cpmRange: [0.5, 3.5], avg: 1.5 },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', cpmRange: [0.3, 2.0], avg: 0.8 },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', cpmRange: [0.3, 2.0], avg: 0.7 },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', cpmRange: [0.5, 3.0], avg: 1.2 },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', cpmRange: [2, 8], avg: 4.0 },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', cpmRange: [1.5, 6], avg: 3.0 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', cpmRange: [3, 10], avg: 5.0 },
];

const NICHES = [
  { name: 'Finance / Insurance', cpm: [8, 15], emoji: '💰' },
  { name: 'Technology / SaaS', cpm: [6, 12], emoji: '💻' },
  { name: 'Health / Fitness', cpm: [4, 10], emoji: '🏥' },
  { name: 'Education', cpm: [4, 8], emoji: '📚' },
  { name: 'Business / Marketing', cpm: [5, 10], emoji: '📈' },
  { name: 'Real Estate', cpm: [6, 12], emoji: '🏠' },
  { name: 'Food / Cooking', cpm: [2, 5], emoji: '🍕' },
  { name: 'Travel / Lifestyle', cpm: [3, 7], emoji: '✈️' },
  { name: 'Entertainment', cpm: [1, 4], emoji: '🎬' },
  { name: 'Gaming', cpm: [2, 5], emoji: '🎮' },
  { name: 'Music', cpm: [1, 3], emoji: '🎵' },
  { name: 'Vlogs / Daily Life', cpm: [1, 4], emoji: '📹' },
];

const MILESTONES = [
  { subs: '1K', views: 500, label: 'Just Started' },
  { subs: '10K', views: 5000, label: 'Growing' },
  { subs: '50K', views: 25000, label: 'Rising Star' },
  { subs: '100K', views: 50000, label: 'Silver Play Button' },
  { subs: '500K', views: 200000, label: 'Major Creator' },
  { subs: '1M', views: 500000, label: 'Gold Play Button' },
  { subs: '10M', views: 3000000, label: 'Diamond Play Button' },
];

function formatCurrency(num: number): string {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  if (num >= 1) return `$${num.toFixed(2)}`;
  return `$${num.toFixed(3)}`;
}

function formatINR(usd: number): string {
  const inr = usd * 83.5;
  if (inr >= 10_000_000) return `₹${(inr / 10_000_000).toFixed(2)} Cr`;
  if (inr >= 100_000) return `₹${(inr / 100_000).toFixed(1)} L`;
  if (inr >= 1_000) return `₹${(inr / 1_000).toFixed(1)}K`;
  return `₹${inr.toFixed(0)}`;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toLocaleString();
}

export function YouTubeMoneyCalculator() {
  const [dailyViews, setDailyViews] = useState(10000);
  const [cpm, setCpm] = useState(4.0);
  const [country, setCountry] = useState('US');
  const [monetizationRate, setMonetizationRate] = useState(50);
  const [showNiches, setShowNiches] = useState(false);
  const [showMilestones, setShowMilestones] = useState(true);

  const selectedCountry = COUNTRIES.find(c => c.code === country)!;

  const earnings = useMemo(() => {
    const monetizedViews = dailyViews * (monetizationRate / 100);
    const daily = (monetizedViews / 1000) * cpm * 0.55; // YouTube takes 45%
    return {
      daily,
      weekly: daily * 7,
      monthly: daily * 30,
      yearly: daily * 365,
      per1kViews: (cpm * 0.55 * (monetizationRate / 100)),
      monetizedDaily: monetizedViews,
    };
  }, [dailyViews, cpm, monetizationRate]);

  // Bar chart max for visual scaling
  const maxBar = earnings.yearly;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">YouTube Money Calculator</h2>
            <p className="text-red-100 text-xs">Estimate your earnings from views, CPM & audience</p>
          </div>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Daily Views */}
        <div className="space-y-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-500" /> Daily Views
            </label>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100">{formatNumber(dailyViews)}</span>
          </div>
          <input
            type="range" min={100} max={5000000} step={100} value={dailyViews}
            onChange={e => setDailyViews(parseInt(e.target.value))}
            className="w-full accent-red-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>100</span><span>50K</span><span>500K</span><span>5M</span>
          </div>
          <input
            type="number" value={dailyViews} min={0}
            onChange={e => setDailyViews(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-center font-mono"
            placeholder="Enter exact views"
          />
        </div>

        {/* CPM */}
        <div className="space-y-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-green-500" /> CPM (per 1,000 views)
            </label>
            <span className="text-sm font-black text-green-600">${cpm.toFixed(2)}</span>
          </div>
          <input
            type="range" min={0.1} max={20} step={0.1} value={cpm}
            onChange={e => setCpm(parseFloat(e.target.value))}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>$0.10</span><span>$5</span><span>$10</span><span>$20</span>
          </div>
        </div>

        {/* Country */}
        <div className="space-y-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-purple-500" /> Audience Country
          </label>
          <select
            value={country}
            onChange={e => {
              setCountry(e.target.value);
              const c = COUNTRIES.find(c => c.code === e.target.value);
              if (c) setCpm(c.avg);
            }}
            className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name} (${c.cpmRange[0]}-${c.cpmRange[1]} CPM)</option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400">
            Avg CPM: ${selectedCountry.avg.toFixed(2)} · Range: ${selectedCountry.cpmRange[0]}-${selectedCountry.cpmRange[1]}
          </p>
        </div>

        {/* Monetization Rate */}
        <div className="space-y-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-orange-500" /> Monetization Rate
            </label>
            <span className="text-sm font-black text-orange-600">{monetizationRate}%</span>
          </div>
          <input
            type="range" min={20} max={80} step={5} value={monetizationRate}
            onChange={e => setMonetizationRate(parseInt(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>20%</span><span>50% (avg)</span><span>80%</span>
          </div>
          <p className="text-[10px] text-slate-400 flex items-center gap-1">
            <Info className="w-3 h-3" /> % of views with ads shown. Typically 40-60%.
          </p>
        </div>
      </div>

      {/* Earnings Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Daily', value: earnings.daily, color: 'from-blue-500 to-blue-600', icon: '📅' },
          { label: 'Weekly', value: earnings.weekly, color: 'from-purple-500 to-purple-600', icon: '📆' },
          { label: 'Monthly', value: earnings.monthly, color: 'from-green-500 to-green-600', icon: '🗓️' },
          { label: 'Yearly', value: earnings.yearly, color: 'from-red-500 to-orange-500', icon: '🎯' },
        ].map(item => (
          <div key={item.label} className={`bg-gradient-to-br ${item.color} rounded-xl p-4 text-white relative overflow-hidden`}>
            <div className="absolute top-1 right-2 text-2xl opacity-20">{item.icon}</div>
            <p className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{item.label}</p>
            <p className="text-xl font-black mt-1">{formatCurrency(item.value)}</p>
            <p className="text-[10px] text-white/60 mt-0.5">{formatINR(item.value)}</p>
          </div>
        ))}
      </div>

      {/* Revenue Breakdown */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" /> Revenue Breakdown
        </h3>
        <div className="space-y-2.5">
          {[
            { label: 'Gross Revenue (before YouTube cut)', value: earnings.monthly / 0.55, pct: 100 },
            { label: 'YouTube\'s Share (45%)', value: (earnings.monthly / 0.55) * 0.45, pct: 45, isDeduction: true },
            { label: 'Your Earnings (55%)', value: earnings.monthly, pct: 55 },
          ].map(row => (
            <div key={row.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={`${row.isDeduction ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}>
                  {row.isDeduction ? '−' : ''} {row.label}
                </span>
                <span className={`font-bold ${row.isDeduction ? 'text-red-500' : 'text-slate-900 dark:text-slate-100'}`}>
                  {formatCurrency(row.value)}/mo
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${row.isDeduction ? 'bg-red-400' : 'bg-green-500'}`}
                  style={{ width: `${row.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          <span className="text-[10px] text-slate-400">Estimated earnings per 1,000 views:</span>
          <span className="text-xs font-black text-green-600">{formatCurrency(earnings.per1kViews)}</span>
          <span className="text-[10px] text-slate-400">({formatINR(earnings.per1kViews)})</span>
        </div>
      </div>

      {/* Milestone Earnings */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <button
          onClick={() => setShowMilestones(!showMilestones)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" /> Earnings by Subscriber Milestones
          </h3>
          {showMilestones ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {showMilestones && (
          <div className="space-y-2">
            {MILESTONES.map(m => {
              const monthlyEarnings = (m.views * (monetizationRate / 100) / 1000) * cpm * 0.55 * 30;
              const barWidth = maxBar > 0 ? Math.min(100, (monthlyEarnings / (MILESTONES[MILESTONES.length - 1].views * (monetizationRate / 100) / 1000 * cpm * 0.55 * 30)) * 100) : 0;
              return (
                <div key={m.subs} className="flex items-center gap-3">
                  <div className="w-16 shrink-0 text-right">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">{m.subs}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="w-full h-6 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(barWidth, 8)}%` }}
                      >
                        <span className="text-[10px] font-bold text-white whitespace-nowrap">
                          {formatCurrency(monthlyEarnings)}/mo
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-20 shrink-0">
                    <span className="text-[10px] text-slate-400">{m.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CPM by Niche */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <button
          onClick={() => setShowNiches(!showNiches)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" /> CPM by Niche (Click to Apply)
          </h3>
          {showNiches ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {showNiches && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {NICHES.map(n => {
              const avg = (n.cpm[0] + n.cpm[1]) / 2;
              return (
                <button
                  key={n.name}
                  onClick={() => setCpm(avg)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all hover:shadow-sm ${
                    Math.abs(cpm - avg) < 0.5
                      ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg">{n.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{n.name}</p>
                    <p className="text-[10px] text-slate-400">${n.cpm[0]}-${n.cpm[1]} CPM</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
        <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">💡 Tips to Increase YouTube Earnings</h3>
        <ul className="space-y-1.5 text-xs text-amber-700 dark:text-amber-400">
          <li>• <strong>Target high-CPM niches</strong> — Finance, tech, and health videos earn 3-5x more per view</li>
          <li>• <strong>Create longer videos</strong> — Videos over 8 minutes allow mid-roll ads, doubling ad revenue</li>
          <li>• <strong>Focus on US/UK audience</strong> — CPM is 5-10x higher than India/Southeast Asia</li>
          <li>• <strong>Post consistently</strong> — Channels with 3+ videos/week grow subscribers 2x faster</li>
          <li>• <strong>Diversify income</strong> — Add sponsorships, merch, and affiliate links alongside AdSense</li>
        </ul>
      </div>
    </div>
  );
}
