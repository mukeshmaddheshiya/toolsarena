'use client';
import { useState, useMemo } from 'react';
import { Heart, Users, MessageCircle, TrendingUp, DollarSign, Award, BarChart3, Info } from 'lucide-react';

const TIERS = [
  { name: 'Nano', range: '1K-10K', avgRate: 5.6, earnings: '$10-100', color: 'bg-green-500' },
  { name: 'Micro', range: '10K-50K', avgRate: 3.8, earnings: '$100-500', color: 'bg-blue-500' },
  { name: 'Mid-tier', range: '50K-100K', avgRate: 2.4, earnings: '$500-2K', color: 'bg-purple-500' },
  { name: 'Macro', range: '100K-500K', avgRate: 1.8, earnings: '$2K-10K', color: 'bg-orange-500' },
  { name: 'Mega', range: '500K-1M', avgRate: 1.2, earnings: '$10K-25K', color: 'bg-red-500' },
  { name: 'Celebrity', range: '1M+', avgRate: 0.9, earnings: '$25K+', color: 'bg-pink-500' },
];

function getRating(rate: number): { label: string; color: string; textColor: string; emoji: string } {
  if (rate >= 6) return { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-600', emoji: '🔥' };
  if (rate >= 3) return { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-600', emoji: '👍' };
  if (rate >= 1) return { label: 'Average', color: 'bg-yellow-500', textColor: 'text-yellow-600', emoji: '😐' };
  return { label: 'Low', color: 'bg-red-500', textColor: 'text-red-600', emoji: '⚠️' };
}

function getTier(followers: number) {
  if (followers >= 1_000_000) return TIERS[5];
  if (followers >= 500_000) return TIERS[4];
  if (followers >= 100_000) return TIERS[3];
  if (followers >= 50_000) return TIERS[2];
  if (followers >= 10_000) return TIERS[1];
  return TIERS[0];
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function InstagramEngagementCalculator() {
  const [followers, setFollowers] = useState(10000);
  const [avgLikes, setAvgLikes] = useState(500);
  const [avgComments, setAvgComments] = useState(25);

  const stats = useMemo(() => {
    if (followers <= 0) return null;
    const engagementRate = ((avgLikes + avgComments) / followers) * 100;
    const likeRate = (avgLikes / followers) * 100;
    const commentRate = (avgComments / followers) * 100;
    const rating = getRating(engagementRate);
    const tier = getTier(followers);
    const estimatedReach = Math.round(followers * (engagementRate / 100) * 3.5);

    // Estimated earnings per post
    let earningsLow = 0, earningsHigh = 0;
    if (followers < 10_000) { earningsLow = 10; earningsHigh = 100; }
    else if (followers < 50_000) { earningsLow = 100; earningsHigh = 500; }
    else if (followers < 100_000) { earningsLow = 500; earningsHigh = 2000; }
    else if (followers < 500_000) { earningsLow = 2000; earningsHigh = 10000; }
    else if (followers < 1_000_000) { earningsLow = 10000; earningsHigh = 25000; }
    else { earningsLow = 25000; earningsHigh = 100000; }

    // Adjust by engagement quality
    const multiplier = engagementRate > 5 ? 1.5 : engagementRate > 3 ? 1.2 : engagementRate > 1 ? 1 : 0.7;
    earningsLow = Math.round(earningsLow * multiplier);
    earningsHigh = Math.round(earningsHigh * multiplier);

    return { engagementRate, likeRate, commentRate, rating, tier, estimatedReach, earningsLow, earningsHigh };
  }, [followers, avgLikes, avgComments]);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-16 h-16 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Instagram Engagement Calculator</h2>
            <p className="text-pink-100 text-xs">Check your engagement rate & estimated earnings</p>
          </div>
        </div>
      </div>

      {/* Input Cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5 text-purple-500" /> Followers
          </label>
          <input
            type="number" value={followers} min={0}
            onChange={e => setFollowers(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-center font-mono focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="e.g. 10000"
          />
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-2">
            <Heart className="w-3.5 h-3.5 text-red-500" /> Avg Likes/Post
          </label>
          <input
            type="number" value={avgLikes} min={0}
            onChange={e => setAvgLikes(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-center font-mono focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="e.g. 500"
          />
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-2">
            <MessageCircle className="w-3.5 h-3.5 text-blue-500" /> Avg Comments/Post
          </label>
          <input
            type="number" value={avgComments} min={0}
            onChange={e => setAvgComments(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-center font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. 25"
          />
        </div>
      </div>

      {stats && (
        <>
          {/* Main Result */}
          <div className="p-6 bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-800 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl text-center">
            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-1">Your Engagement Rate</p>
            <p className="text-5xl font-black text-slate-900 dark:text-white">
              {stats.engagementRate.toFixed(2)}%
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-2xl">{stats.rating.emoji}</span>
              <span className={`text-sm font-bold ${stats.rating.textColor}`}>{stats.rating.label}</span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">{stats.tier.name} Influencer</span>
            </div>
            {/* Progress bar */}
            <div className="mt-4 max-w-md mx-auto">
              <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                <span>0%</span><span>Low</span><span>Avg</span><span>Good</span><span>Excellent</span><span>10%+</span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 flex">
                  <div className="w-[10%] bg-red-400" /><div className="w-[20%] bg-yellow-400" />
                  <div className="w-[30%] bg-blue-400" /><div className="w-[40%] bg-green-400" />
                </div>
                <div
                  className="absolute top-0 h-full w-1 bg-slate-900 dark:bg-white rounded-full shadow-md transition-all duration-500"
                  style={{ left: `${Math.min(stats.engagementRate * 10, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-3 text-center">
              <Heart className="w-4 h-4 text-red-400 mx-auto mb-1" />
              <div className="text-[10px] text-red-400 uppercase font-medium">Like Rate</div>
              <div className="text-lg font-black text-red-600">{stats.likeRate.toFixed(2)}%</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-3 text-center">
              <MessageCircle className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-[10px] text-blue-400 uppercase font-medium">Comment Rate</div>
              <div className="text-lg font-black text-blue-600">{stats.commentRate.toFixed(2)}%</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl p-3 text-center">
              <TrendingUp className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-[10px] text-purple-400 uppercase font-medium">Est. Reach</div>
              <div className="text-lg font-black text-purple-600">{formatNum(stats.estimatedReach)}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl p-3 text-center">
              <DollarSign className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <div className="text-[10px] text-green-400 uppercase font-medium">Est. Per Post</div>
              <div className="text-lg font-black text-green-600">${stats.earningsLow}-{formatNum(stats.earningsHigh)}</div>
            </div>
          </div>

          {/* Benchmark Table */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-orange-500" /> Engagement Rate by Follower Tier
            </h3>
            <div className="space-y-2">
              {TIERS.map(t => {
                const isActive = t.name === stats.tier.name;
                return (
                  <div key={t.name} className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${isActive ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800' : ''}`}>
                    <div className={`w-2 h-2 rounded-full ${t.color} shrink-0`} />
                    <div className="flex-1 min-w-0 grid grid-cols-4 gap-2 text-xs">
                      <span className={`font-bold ${isActive ? 'text-purple-700 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'}`}>{t.name}</span>
                      <span className="text-slate-500">{t.range}</span>
                      <span className="text-slate-500">~{t.avgRate}% avg</span>
                      <span className="text-green-600 font-medium">{t.earnings}/post</span>
                    </div>
                    {isActive && <span className="text-[10px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-full shrink-0">You</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formula */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" /> How We Calculate
            </h3>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 font-mono text-xs text-center text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              Engagement Rate = ({formatNum(avgLikes)} likes + {formatNum(avgComments)} comments) / {formatNum(followers)} followers × 100 = <span className="font-bold text-purple-600">{stats.engagementRate.toFixed(2)}%</span>
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">💡 Tips to Boost Engagement</h3>
            <ul className="space-y-1.5 text-xs text-amber-700 dark:text-amber-400">
              <li>• <strong>Post at peak hours</strong> — Check Instagram Insights for when your audience is most active</li>
              <li>• <strong>Use Reels</strong> — Reels get 2-3x more reach than regular posts</li>
              <li>• <strong>Ask questions in captions</strong> — Drives comments and saves</li>
              <li>• <strong>Reply to every comment</strong> — Boosts algorithmic visibility</li>
              <li>• <strong>Use 3-5 relevant hashtags</strong> — Quality over quantity in 2026</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
