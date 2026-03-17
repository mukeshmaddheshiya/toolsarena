'use client';
import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Globe, BarChart3, Users, Eye, Tv, Info, ChevronDown, ChevronUp, Clock, Zap, ShieldOff, Handshake, Calculator } from 'lucide-react';

/* ─── Data ─── */
const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', cpmRange: [2, 12], avg: 5.5, currency: 'USD', rate: 1 },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', cpmRange: [3, 10], avg: 5.0, currency: 'GBP', rate: 0.79 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', cpmRange: [2.5, 10], avg: 4.8, currency: 'CAD', rate: 1.36 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', cpmRange: [3, 11], avg: 5.2, currency: 'AUD', rate: 1.53 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', cpmRange: [2.5, 9], avg: 4.5, currency: 'EUR', rate: 0.92 },
  { code: 'FR', name: 'France', flag: '🇫🇷', cpmRange: [2, 8], avg: 3.8, currency: 'EUR', rate: 0.92 },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', cpmRange: [2.5, 9], avg: 4.2, currency: 'EUR', rate: 0.92 },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', cpmRange: [3, 10], avg: 5.0, currency: 'SEK', rate: 10.5 },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', cpmRange: [4, 14], avg: 6.5, currency: 'CHF', rate: 0.88 },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', cpmRange: [3.5, 12], avg: 5.8, currency: 'NOK', rate: 10.8 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', cpmRange: [3, 10], avg: 5.0, currency: 'JPY', rate: 149 },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', cpmRange: [2, 8], avg: 3.5, currency: 'KRW', rate: 1320 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', cpmRange: [2, 8], avg: 3.8, currency: 'SGD', rate: 1.34 },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', cpmRange: [2, 8], avg: 4.0, currency: 'AED', rate: 3.67 },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', cpmRange: [1.5, 6], avg: 3.0, currency: 'SAR', rate: 3.75 },
  { code: 'IN', name: 'India', flag: '🇮🇳', cpmRange: [0.3, 2.5], avg: 1.0, currency: 'INR', rate: 83.5 },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', cpmRange: [0.2, 1.5], avg: 0.5, currency: 'NPR', rate: 133 },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', cpmRange: [0.3, 2.0], avg: 0.7, currency: 'PKR', rate: 278 },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', cpmRange: [0.2, 1.5], avg: 0.5, currency: 'BDT', rate: 110 },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', cpmRange: [0.2, 1.5], avg: 0.6, currency: 'LKR', rate: 310 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', cpmRange: [0.5, 3.5], avg: 1.5, currency: 'BRL', rate: 4.97 },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', cpmRange: [0.5, 3.0], avg: 1.2, currency: 'MXN', rate: 17.1 },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', cpmRange: [0.3, 2.0], avg: 0.8, currency: 'PHP', rate: 55.7 },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', cpmRange: [0.3, 2.0], avg: 0.7, currency: 'IDR', rate: 15700 },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', cpmRange: [0.3, 2.0], avg: 0.8, currency: 'THB', rate: 35.5 },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', cpmRange: [0.2, 1.5], avg: 0.5, currency: 'VND', rate: 24500 },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', cpmRange: [0.2, 1.5], avg: 0.5, currency: 'NGN', rate: 1550 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', cpmRange: [0.5, 3.0], avg: 1.5, currency: 'ZAR', rate: 18.5 },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', cpmRange: [0.2, 1.5], avg: 0.6, currency: 'KES', rate: 154 },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', cpmRange: [0.3, 2.0], avg: 0.8, currency: 'TRY', rate: 32 },
];

const NICHES = [
  { name: 'Finance / Insurance', cpm: [8, 15], emoji: '💰' },
  { name: 'Technology / SaaS', cpm: [6, 12], emoji: '💻' },
  { name: 'Health / Fitness', cpm: [4, 10], emoji: '🏥' },
  { name: 'Education / Online Courses', cpm: [4, 8], emoji: '📚' },
  { name: 'Business / Marketing', cpm: [5, 10], emoji: '📈' },
  { name: 'Real Estate', cpm: [6, 12], emoji: '🏠' },
  { name: 'Legal / Law', cpm: [7, 14], emoji: '⚖️' },
  { name: 'Automotive', cpm: [3, 8], emoji: '🚗' },
  { name: 'Food / Cooking', cpm: [2, 5], emoji: '🍕' },
  { name: 'Travel / Lifestyle', cpm: [3, 7], emoji: '✈️' },
  { name: 'Entertainment', cpm: [1, 4], emoji: '🎬' },
  { name: 'Gaming', cpm: [2, 5], emoji: '🎮' },
  { name: 'Music', cpm: [1, 3], emoji: '🎵' },
  { name: 'Beauty / Fashion', cpm: [2, 6], emoji: '💄' },
  { name: 'Vlogs / Daily Life', cpm: [1, 4], emoji: '📹' },
  { name: 'Pets / Animals', cpm: [1.5, 5], emoji: '🐶' },
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

type VideoLength = 'short' | 'under8' | 'over8' | 'over20';

function formatCurrency(num: number): string {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  if (num >= 1) return `$${num.toFixed(2)}`;
  return `$${num.toFixed(3)}`;
}

function formatLocal(usd: number, rate: number, currency: string): string {
  const val = usd * rate;
  if (currency === 'INR') {
    if (val >= 10_000_000) return `₹${(val / 10_000_000).toFixed(2)} Cr`;
    if (val >= 100_000) return `₹${(val / 100_000).toFixed(1)} L`;
    if (val >= 1_000) return `₹${(val / 1_000).toFixed(1)}K`;
    return `₹${val.toFixed(0)}`;
  }
  if (currency === 'NPR') {
    if (val >= 100_000) return `रू${(val / 100_000).toFixed(1)} L`;
    if (val >= 1_000) return `रू${(val / 1_000).toFixed(1)}K`;
    return `रू${val.toFixed(0)}`;
  }
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M ${currency}`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K ${currency}`;
  return `${val.toFixed(0)} ${currency}`;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toLocaleString();
}

/* ─── Component ─── */
type Tab = 'adsense' | 'shorts' | 'sponsorship' | 'total';

export function YouTubeMoneyCalculator() {
  const [dailyViews, setDailyViews] = useState(10000);
  const [cpm, setCpm] = useState(4.0);
  const [country, setCountry] = useState('US');
  const [monetizationRate, setMonetizationRate] = useState(50);
  const [videoLength, setVideoLength] = useState<VideoLength>('over8');
  const [adBlockPct, setAdBlockPct] = useState(30);
  const [activeTab, setActiveTab] = useState<Tab>('adsense');

  // Shorts
  const [dailyShortsViews, setDailyShortsViews] = useState(50000);

  // Sponsorship
  const [subscribers, setSubscribers] = useState(100000);
  const [sponsorDealsPerMonth, setSponsorDealsPerMonth] = useState(2);

  const [showNiches, setShowNiches] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const selectedCountry = COUNTRIES.find(c => c.code === country)!;

  // Video length multiplier (mid-roll ads)
  const lengthMultiplier = videoLength === 'short' ? 0.05 : videoLength === 'under8' ? 1 : videoLength === 'over8' ? 1.8 : 2.5;

  const earnings = useMemo(() => {
    const effectiveMonRate = monetizationRate * (1 - adBlockPct / 100);
    const monetizedViews = dailyViews * (effectiveMonRate / 100);
    const baseDailyAd = (monetizedViews / 1000) * cpm * 0.55;
    const daily = baseDailyAd * lengthMultiplier;

    // Shorts (YouTube Shorts fund pays ~$0.03-0.06 per 1K views)
    const shortsRpm = 0.04;
    const dailyShorts = (dailyShortsViews / 1000) * shortsRpm;

    // Sponsorship estimate: $10-50 per 1K subscribers for mid-tier creators
    const sponsorRate = cpm >= 5 ? 30 : cpm >= 2 ? 20 : 10; // per 1K subs
    const sponsorPerDeal = (subscribers / 1000) * sponsorRate;
    const monthlySponsorship = sponsorPerDeal * sponsorDealsPerMonth;

    // Merch/affiliate rough estimate (5-15% of ad revenue for active creators)
    const monthlyMerch = daily * 30 * 0.1;

    return {
      // AdSense
      daily,
      weekly: daily * 7,
      monthly: daily * 30,
      yearly: daily * 365,
      per1kViews: daily > 0 ? (daily / dailyViews) * 1000 : 0,
      rpm: daily > 0 ? (daily / dailyViews) * 1000 : 0,
      monetizedDaily: dailyViews * (effectiveMonRate / 100),
      // Shorts
      dailyShorts,
      monthlyShorts: dailyShorts * 30,
      yearlyShorts: dailyShorts * 365,
      // Sponsorship
      sponsorPerDeal,
      monthlySponsorship,
      yearlySponsorship: monthlySponsorship * 12,
      // Merch
      monthlyMerch,
      // Totals
      totalMonthly: daily * 30 + dailyShorts * 30 + monthlySponsorship + monthlyMerch,
      totalYearly: daily * 365 + dailyShorts * 365 + monthlySponsorship * 12 + monthlyMerch * 12,
    };
  }, [dailyViews, cpm, monetizationRate, adBlockPct, lengthMultiplier, dailyShortsViews, subscribers, sponsorDealsPerMonth]);

  const tabs: { key: Tab; label: string; icon: typeof DollarSign }[] = [
    { key: 'adsense', label: 'AdSense', icon: DollarSign },
    { key: 'shorts', label: 'Shorts', icon: Zap },
    { key: 'sponsorship', label: 'Sponsorship', icon: Handshake },
    { key: 'total', label: 'Total Income', icon: Calculator },
  ];

  const videoLengths: { key: VideoLength; label: string; desc: string }[] = [
    { key: 'short', label: 'Shorts (<60s)', desc: 'Shorts Fund only' },
    { key: 'under8', label: 'Under 8 min', desc: 'Pre-roll ads only' },
    { key: 'over8', label: '8-20 min', desc: '+ Mid-roll ads (1.8x)' },
    { key: 'over20', label: '20+ min', desc: '+ Multiple mid-rolls (2.5x)' },
  ];

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
            <p className="text-red-100 text-xs">Estimate earnings from AdSense, Shorts, Sponsorships & more</p>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === t.key
                ? 'bg-white dark:bg-slate-700 shadow text-red-600 dark:text-red-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}>
            <t.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ═══════ AdSense Tab ═══════ */}
      {activeTab === 'adsense' && (
        <>
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
              <input type="range" min={100} max={5000000} step={100} value={dailyViews}
                onChange={e => setDailyViews(parseInt(e.target.value))} className="w-full accent-red-500" />
              <div className="flex justify-between text-[10px] text-slate-400"><span>100</span><span>50K</span><span>500K</span><span>5M</span></div>
              <input type="number" value={dailyViews} min={0}
                onChange={e => setDailyViews(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-center font-mono dark:text-slate-100"
                placeholder="Enter exact views" />
            </div>

            {/* CPM */}
            <div className="space-y-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-green-500" /> CPM (per 1,000 views)
                </label>
                <span className="text-sm font-black text-green-600 dark:text-green-400">${cpm.toFixed(2)}</span>
              </div>
              <input type="range" min={0.1} max={20} step={0.1} value={cpm}
                onChange={e => setCpm(parseFloat(e.target.value))} className="w-full accent-green-500" />
              <div className="flex justify-between text-[10px] text-slate-400"><span>$0.10</span><span>$5</span><span>$10</span><span>$20</span></div>
            </div>

            {/* Country */}
            <div className="space-y-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-500" /> Audience Country
              </label>
              <select value={country}
                onChange={e => { setCountry(e.target.value); const c = COUNTRIES.find(c => c.code === e.target.value); if (c) setCpm(c.avg); }}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 dark:text-slate-100">
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name} (${c.cpmRange[0]}-${c.cpmRange[1]} CPM)</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">Avg CPM: ${selectedCountry.avg.toFixed(2)} · Range: ${selectedCountry.cpmRange[0]}-${selectedCountry.cpmRange[1]}</p>
            </div>

            {/* Video Length */}
            <div className="space-y-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> Video Length
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {videoLengths.map(v => (
                  <button key={v.key} onClick={() => setVideoLength(v.key)}
                    className={`p-2 rounded-lg text-left transition-all ${
                      videoLength === v.key
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-300 dark:border-indigo-700'
                        : 'border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}>
                    <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{v.label}</p>
                    <p className="text-[9px] text-slate-400">{v.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced settings */}
          <button onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
            <Info className="w-3.5 h-3.5" /> Advanced Settings
            {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showAdvanced && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-orange-500" /> Monetization Rate
                  </label>
                  <span className="text-sm font-black text-orange-600">{monetizationRate}%</span>
                </div>
                <input type="range" min={20} max={80} step={5} value={monetizationRate}
                  onChange={e => setMonetizationRate(parseInt(e.target.value))} className="w-full accent-orange-500" />
                <p className="text-[10px] text-slate-400 flex items-center gap-1"><Info className="w-3 h-3" /> % of views where ads are shown. Avg: 40-60%.</p>
              </div>
              <div className="space-y-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldOff className="w-3.5 h-3.5 text-red-500" /> Ad Blocker Impact
                  </label>
                  <span className="text-sm font-black text-red-600">{adBlockPct}%</span>
                </div>
                <input type="range" min={0} max={60} step={5} value={adBlockPct}
                  onChange={e => setAdBlockPct(parseInt(e.target.value))} className="w-full accent-red-500" />
                <p className="text-[10px] text-slate-400 flex items-center gap-1"><Info className="w-3 h-3" /> ~30% of viewers use ad blockers globally. Tech audience: 40-50%.</p>
              </div>
            </div>
          )}

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
                <p className="text-[10px] text-white/60 mt-0.5">{formatLocal(item.value, selectedCountry.rate, selectedCountry.currency)}</p>
              </div>
            ))}
          </div>

          {/* RPM Display */}
          <div className="flex items-center gap-4 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="text-center flex-1">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">CPM</p>
              <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">${cpm.toFixed(2)}</p>
              <p className="text-[9px] text-emerald-500">Cost per 1K impressions</p>
            </div>
            <div className="text-slate-300 dark:text-slate-600">→</div>
            <div className="text-center flex-1">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">RPM (Your Revenue)</p>
              <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">${earnings.rpm.toFixed(2)}</p>
              <p className="text-[9px] text-emerald-500">Revenue per 1K views (after YouTube&apos;s cut)</p>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" /> Revenue Breakdown (Monthly)
            </h3>
            <div className="space-y-2.5">
              {[
                { label: 'Gross Revenue (before YouTube cut)', value: earnings.monthly / 0.55, pct: 100, isDeduction: false },
                { label: 'YouTube\'s Share (45%)', value: (earnings.monthly / 0.55) * 0.45, pct: 45, isDeduction: true },
                { label: 'Your Earnings (55%)', value: earnings.monthly, pct: 55, isDeduction: false },
              ].map(row => (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={row.isDeduction ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}>{row.isDeduction ? '−' : ''} {row.label}</span>
                    <span className={`font-bold ${row.isDeduction ? 'text-red-500' : 'text-slate-900 dark:text-slate-100'}`}>{formatCurrency(row.value)}/mo</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${row.isDeduction ? 'bg-red-400' : 'bg-green-500'}`} style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ═══════ Shorts Tab ═══════ */}
      {activeTab === 'shorts' && (
        <>
          <div className="space-y-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-pink-500" /> Daily Shorts Views
              </label>
              <span className="text-sm font-black text-pink-600">{formatNumber(dailyShortsViews)}</span>
            </div>
            <input type="range" min={1000} max={10000000} step={1000} value={dailyShortsViews}
              onChange={e => setDailyShortsViews(parseInt(e.target.value))} className="w-full accent-pink-500" />
            <input type="number" value={dailyShortsViews} min={0}
              onChange={e => setDailyShortsViews(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-center font-mono dark:text-slate-100" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Daily', value: earnings.dailyShorts, color: 'from-pink-500 to-pink-600' },
              { label: 'Monthly', value: earnings.monthlyShorts, color: 'from-fuchsia-500 to-fuchsia-600' },
              { label: 'Yearly', value: earnings.yearlyShorts, color: 'from-purple-500 to-purple-600' },
            ].map(item => (
              <div key={item.label} className={`bg-gradient-to-br ${item.color} rounded-xl p-4 text-white`}>
                <p className="text-[10px] font-medium text-white/70 uppercase">{item.label}</p>
                <p className="text-xl font-black mt-1">{formatCurrency(item.value)}</p>
                <p className="text-[10px] text-white/60">{formatLocal(item.value, selectedCountry.rate, selectedCountry.currency)}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-800 rounded-xl">
            <h3 className="text-sm font-bold text-pink-800 dark:text-pink-300 mb-2">⚡ YouTube Shorts Earnings</h3>
            <ul className="space-y-1.5 text-xs text-pink-700 dark:text-pink-400">
              <li>• Shorts pay approximately <strong>$0.03-0.06 per 1,000 views</strong> (RPM)</li>
              <li>• That&apos;s roughly <strong>10-20x less</strong> than long-form videos</li>
              <li>• Shorts are best for <strong>growing subscribers</strong>, not direct revenue</li>
              <li>• Shorts Fund replaced by <strong>Shorts ad revenue sharing</strong> (45% to creator)</li>
              <li>• Viral Shorts can drive viewers to your long-form content (higher CPM)</li>
            </ul>
          </div>
        </>
      )}

      {/* ═══════ Sponsorship Tab ═══════ */}
      {activeTab === 'sponsorship' && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500" /> Subscribers
                </label>
                <span className="text-sm font-black text-blue-600">{formatNumber(subscribers)}</span>
              </div>
              <input type="range" min={1000} max={10000000} step={1000} value={subscribers}
                onChange={e => setSubscribers(parseInt(e.target.value))} className="w-full accent-blue-500" />
              <input type="number" value={subscribers} min={0}
                onChange={e => setSubscribers(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-center font-mono dark:text-slate-100" />
            </div>
            <div className="space-y-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Handshake className="w-3.5 h-3.5 text-amber-500" /> Sponsor Deals / Month
                </label>
                <span className="text-sm font-black text-amber-600">{sponsorDealsPerMonth}</span>
              </div>
              <input type="range" min={0} max={10} step={1} value={sponsorDealsPerMonth}
                onChange={e => setSponsorDealsPerMonth(parseInt(e.target.value))} className="w-full accent-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
              <p className="text-[10px] font-medium text-white/70 uppercase">Per Deal</p>
              <p className="text-xl font-black mt-1">{formatCurrency(earnings.sponsorPerDeal)}</p>
              <p className="text-[10px] text-white/60">{formatLocal(earnings.sponsorPerDeal, selectedCountry.rate, selectedCountry.currency)}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <p className="text-[10px] font-medium text-white/70 uppercase">Monthly</p>
              <p className="text-xl font-black mt-1">{formatCurrency(earnings.monthlySponsorship)}</p>
              <p className="text-[10px] text-white/60">{formatLocal(earnings.monthlySponsorship, selectedCountry.rate, selectedCountry.currency)}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
              <p className="text-[10px] font-medium text-white/70 uppercase">Yearly</p>
              <p className="text-xl font-black mt-1">{formatCurrency(earnings.yearlySponsorship)}</p>
              <p className="text-[10px] text-white/60">{formatLocal(earnings.yearlySponsorship, selectedCountry.rate, selectedCountry.currency)}</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">🤝 Sponsorship Rate Guide</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="text-left text-slate-500 dark:text-slate-400">
                  <th className="pb-1.5 font-semibold">Subscribers</th><th className="pb-1.5 font-semibold">Rate per Deal</th><th className="pb-1.5 font-semibold">Notes</th>
                </tr></thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  <tr><td className="py-1">10K-50K</td><td>$200-$1,000</td><td className="text-slate-400">Micro-influencer</td></tr>
                  <tr><td className="py-1">50K-200K</td><td>$1,000-$5,000</td><td className="text-slate-400">Mid-tier creator</td></tr>
                  <tr><td className="py-1">200K-1M</td><td>$5,000-$20,000</td><td className="text-slate-400">Established creator</td></tr>
                  <tr><td className="py-1">1M+</td><td>$20,000-$100,000+</td><td className="text-slate-400">Major creator</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══════ Total Income Tab ═══════ */}
      {activeTab === 'total' && (
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white">
              <p className="text-xs font-medium text-white/70 uppercase">Total Monthly</p>
              <p className="text-3xl font-black mt-1">{formatCurrency(earnings.totalMonthly)}</p>
              <p className="text-sm text-white/60">{formatLocal(earnings.totalMonthly, selectedCountry.rate, selectedCountry.currency)}</p>
            </div>
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-5 text-white">
              <p className="text-xs font-medium text-white/70 uppercase">Total Yearly</p>
              <p className="text-3xl font-black mt-1">{formatCurrency(earnings.totalYearly)}</p>
              <p className="text-sm text-white/60">{formatLocal(earnings.totalYearly, selectedCountry.rate, selectedCountry.currency)}</p>
            </div>
          </div>

          {/* Income breakdown */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Income Breakdown (Monthly)</h3>
            {[
              { label: 'AdSense (Long-form)', value: earnings.monthly, color: 'bg-green-500', emoji: '📺' },
              { label: 'YouTube Shorts', value: earnings.monthlyShorts, color: 'bg-pink-500', emoji: '⚡' },
              { label: 'Sponsorships', value: earnings.monthlySponsorship, color: 'bg-amber-500', emoji: '🤝' },
              { label: 'Merch & Affiliates (~10%)', value: earnings.monthlyMerch, color: 'bg-blue-500', emoji: '🛍️' },
            ].map(row => {
              const pct = earnings.totalMonthly > 0 ? (row.value / earnings.totalMonthly) * 100 : 0;
              return (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">{row.emoji} {row.label}</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(row.value)} <span className="text-slate-400 font-normal">({pct.toFixed(0)}%)</span></span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${row.color}`} style={{ width: `${Math.max(pct, 1)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ═══════ Shared Sections ═══════ */}

      {/* Milestone Earnings */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <button onClick={() => setShowMilestones(!showMilestones)} className="w-full flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" /> Earnings by Subscriber Milestones
          </h3>
          {showMilestones ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {showMilestones && (
          <div className="space-y-2">
            {MILESTONES.map(m => {
              const monthlyEarnings = (m.views * (monetizationRate / 100) / 1000) * cpm * 0.55 * 30;
              const maxEarnings = (MILESTONES[MILESTONES.length - 1].views * (monetizationRate / 100) / 1000 * cpm * 0.55 * 30);
              const barWidth = maxEarnings > 0 ? Math.min(100, (monthlyEarnings / maxEarnings) * 100) : 0;
              return (
                <div key={m.subs} className="flex items-center gap-3">
                  <div className="w-16 shrink-0 text-right">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">{m.subs}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="w-full h-7 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden relative">
                      <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(barWidth, 10)}%` }}>
                        <span className="text-[10px] font-bold text-white whitespace-nowrap">{formatCurrency(monthlyEarnings)}/mo</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-24 shrink-0">
                    <span className="text-[10px] text-slate-400">{m.label}</span>
                    <span className="text-[9px] text-slate-300 dark:text-slate-500 block">{formatLocal(monthlyEarnings, selectedCountry.rate, selectedCountry.currency)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CPM by Niche */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <button onClick={() => setShowNiches(!showNiches)} className="w-full flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" /> CPM by Niche (Click to Apply)
          </h3>
          {showNiches ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {showNiches && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {NICHES.map(n => {
              const avg = (n.cpm[0] + n.cpm[1]) / 2;
              return (
                <button key={n.name} onClick={() => setCpm(avg)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all hover:shadow-sm ${
                    Math.abs(cpm - avg) < 0.5
                      ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}>
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

      {/* Tips */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
        <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">💡 Tips to Increase YouTube Earnings</h3>
        <ul className="space-y-1.5 text-xs text-amber-700 dark:text-amber-400">
          <li>• <strong>Make videos 8+ minutes</strong> — enables mid-roll ads, nearly doubling ad revenue per video</li>
          <li>• <strong>Target high-CPM niches</strong> — Finance ($8-15), Tech ($6-12), Health ($4-10) pay 3-5x more per view</li>
          <li>• <strong>Focus on US/UK/CA/AU audience</strong> — CPM is 5-10x higher than India/Southeast Asia</li>
          <li>• <strong>Add sponsorships</strong> — Often worth 3-10x more than AdSense alone for established creators</li>
          <li>• <strong>Use Shorts to grow, Long-form to earn</strong> — Shorts pay ~$0.04/1K but drive subscribers to your channel</li>
          <li>• <strong>Reduce audience ad blocker usage</strong> — Mobile viewers have lower ad block rates (5%) vs desktop (30-50%)</li>
          <li>• <strong>Post 3+ videos/week</strong> — Consistent channels grow 2x faster and get more algorithmic reach</li>
        </ul>
      </div>
    </div>
  );
}
