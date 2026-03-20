'use client';

import { useState } from 'react';
import { Youtube, TrendingUp, DollarSign, Users, Eye, Video, Calendar, AlertCircle } from 'lucide-react';

interface ChannelMetrics {
  avgViewsPerVideo: number;
  viewsPerDay: number;
  videosPerMonth: number;
  subscriberViewRatio: number;
  estimatedDailyEarnings: number;
  estimatedMonthlyEarnings: number;
  estimatedYearlyEarnings: number;
  channelAgeInDays: number;
  channelAgeLabel: string;
}

type BenchmarkLevel = 'poor' | 'average' | 'good' | 'excellent';

const benchmarkColorMap: Record<BenchmarkLevel, string> = {
  poor: 'text-red-500',
  average: 'text-yellow-500',
  good: 'text-green-500',
  excellent: 'text-blue-500',
};

const benchmarkBgMap: Record<BenchmarkLevel, string> = {
  poor: 'bg-red-50 border-red-200',
  average: 'bg-yellow-50 border-yellow-200',
  good: 'bg-green-50 border-green-200',
  excellent: 'bg-blue-50 border-blue-200',
};

function getBenchmarkLevel(value: number, thresholds: [number, number, number]): BenchmarkLevel {
  if (value < thresholds[0]) return 'poor';
  if (value < thresholds[1]) return 'average';
  if (value < thresholds[2]) return 'good';
  return 'excellent';
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toFixed(0);
}

function formatCurrency(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function YoutubeChannelStatsTool() {
  const [subscribers, setSubscribers] = useState('');
  const [videos, setVideos] = useState('');
  const [totalViews, setTotalViews] = useState('');
  const [startDate, setStartDate] = useState('');
  const [cpm, setCpm] = useState(2);
  const [metrics, setMetrics] = useState<ChannelMetrics | null>(null);
  const [error, setError] = useState('');

  function analyzeChannel() {
    setError('');
    const subs = parseInt(subscribers.replace(/,/g, ''), 10);
    const vids = parseInt(videos.replace(/,/g, ''), 10);
    const views = parseInt(totalViews.replace(/,/g, ''), 10);

    if (!subscribers || !videos || !totalViews || !startDate) {
      setError('Please fill in all fields before analyzing.');
      return;
    }
    if (!subs || !vids || !views || subs <= 0 || vids <= 0 || views <= 0) {
      setError('All numbers must be valid and greater than zero.');
      return;
    }

    const start = new Date(startDate);
    const now = new Date();
    const channelAgeInDays = Math.max(1, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const months = channelAgeInDays / 30.44;

    let channelAgeLabel = '';
    if (channelAgeInDays < 30) channelAgeLabel = `${channelAgeInDays} days`;
    else if (months < 12) channelAgeLabel = `${months.toFixed(1)} months`;
    else channelAgeLabel = `${(months / 12).toFixed(1)} years`;

    const avgViewsPerVideo = views / vids;
    const viewsPerDay = views / channelAgeInDays;
    const videosPerMonth = vids / (channelAgeInDays / 30.44);
    const subscriberViewRatio = views / subs;
    const estimatedDailyEarnings = (viewsPerDay / 1000) * cpm;
    const estimatedMonthlyEarnings = estimatedDailyEarnings * 30.44;
    const estimatedYearlyEarnings = estimatedDailyEarnings * 365;

    setMetrics({
      avgViewsPerVideo,
      viewsPerDay,
      videosPerMonth,
      subscriberViewRatio,
      estimatedDailyEarnings,
      estimatedMonthlyEarnings,
      estimatedYearlyEarnings,
      channelAgeInDays,
      channelAgeLabel,
    });
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-red-100 rounded-lg">
          <Youtube className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">YouTube Channel Stats Analyzer</h2>
          <p className="text-sm text-gray-500">Enter your channel data manually — no API or login needed.</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Video className="w-4 h-4 text-gray-500" /> Channel Data
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Subscribers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. 25000"
                value={subscribers}
                onChange={e => setSubscribers(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Videos Uploaded</label>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. 150"
                value={videos}
                onChange={e => setVideos(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total All-Time Views</label>
            <div className="relative">
              <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. 1500000"
                value={totalViews}
                onChange={e => setTotalViews(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Channel Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                max={today}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          </div>
        </div>

        {/* CPM Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CPM Rate:{' '}
            <span className="text-red-600 font-bold">${cpm.toFixed(2)}</span>
            <span className="text-gray-400 ml-2 text-xs">(Cost per 1,000 views)</span>
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-10">$0.50</span>
            <input
              type="range"
              min={0.5}
              max={10}
              step={0.25}
              value={cpm}
              onChange={e => setCpm(parseFloat(e.target.value))}
              className="flex-1 accent-red-500"
            />
            <span className="text-xs text-gray-400 w-10 text-right">$10.00</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Finance / Tech: $4–$10 · Entertainment: $1–$3 · Gaming: $1–$4
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={analyzeChannel}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Analyze My Channel
        </button>
      </div>

      {/* Results */}
      {metrics && (
        <div className="space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Avg Views / Video',
                value: formatNumber(metrics.avgViewsPerVideo),
                icon: Eye,
                colorClass: 'text-blue-600',
                bgClass: 'bg-blue-50',
              },
              {
                label: 'Views / Day',
                value: formatNumber(metrics.viewsPerDay),
                icon: TrendingUp,
                colorClass: 'text-green-600',
                bgClass: 'bg-green-50',
              },
              {
                label: 'Videos / Month',
                value: metrics.videosPerMonth.toFixed(1),
                icon: Video,
                colorClass: 'text-purple-600',
                bgClass: 'bg-purple-50',
              },
              {
                label: 'Sub-to-View Ratio',
                value: metrics.subscriberViewRatio.toFixed(1) + 'x',
                icon: Users,
                colorClass: 'text-orange-600',
                bgClass: 'bg-orange-50',
              },
              {
                label: 'Channel Age',
                value: metrics.channelAgeLabel,
                icon: Calendar,
                colorClass: 'text-gray-600',
                bgClass: 'bg-gray-100',
              },
              {
                label: 'Est. Monthly Earnings',
                value: formatCurrency(metrics.estimatedMonthlyEarnings),
                icon: DollarSign,
                colorClass: 'text-yellow-600',
                bgClass: 'bg-yellow-50',
              },
            ].map(({ label, value, icon: Icon, colorClass, bgClass }) => (
              <div key={label} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
                <div className={`inline-flex p-2 rounded-lg ${bgClass} mb-2`}>
                  <Icon className={`w-4 h-4 ${colorClass}`} />
                </div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className={`text-lg font-bold ${colorClass}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              Estimated Earnings at ${cpm.toFixed(2)} CPM
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Daily</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(metrics.estimatedDailyEarnings)}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Monthly</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(metrics.estimatedMonthlyEarnings)}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Yearly</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(metrics.estimatedYearlyEarnings)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Estimates are based on ad revenue only. Actual earnings vary by audience location, watch time, and ad formats.
            </p>
          </div>

          {/* Benchmarks */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Performance Benchmarks</h3>
            <div className="space-y-3">
              {(() => {
                const level = getBenchmarkLevel(metrics.avgViewsPerVideo, [1000, 10000, 100000]);
                const labelMap: Record<BenchmarkLevel, string> = {
                  poor: 'Below Average',
                  average: 'Average',
                  good: 'Good',
                  excellent: 'Excellent',
                };
                return (
                  <div className={`border rounded-lg p-3 ${benchmarkBgMap[level]}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Views per Video</span>
                      <span className={`text-sm font-bold ${benchmarkColorMap[level]}`}>{labelMap[level]}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Your avg: {formatNumber(metrics.avgViewsPerVideo)} · Average: 10K+ · Great: 100K+
                    </p>
                  </div>
                );
              })()}
              {(() => {
                const level = getBenchmarkLevel(metrics.subscriberViewRatio, [20, 50, 150]);
                const labelMap: Record<BenchmarkLevel, string> = {
                  poor: 'Low Engagement',
                  average: 'Moderate',
                  good: 'Strong',
                  excellent: 'Viral-level',
                };
                return (
                  <div className={`border rounded-lg p-3 ${benchmarkBgMap[level]}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subscriber Engagement Ratio</span>
                      <span className={`text-sm font-bold ${benchmarkColorMap[level]}`}>{labelMap[level]}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Your ratio: {metrics.subscriberViewRatio.toFixed(1)}x · Target: 50x+ for healthy engagement
                    </p>
                  </div>
                );
              })()}
              {(() => {
                const level: BenchmarkLevel =
                  metrics.videosPerMonth >= 4
                    ? 'good'
                    : metrics.videosPerMonth >= 1
                    ? 'average'
                    : 'poor';
                const labelMap: Record<BenchmarkLevel, string> = {
                  poor: 'Infrequent',
                  average: 'Moderate',
                  good: 'Consistent',
                  excellent: 'Consistent',
                };
                return (
                  <div className={`border rounded-lg p-3 ${benchmarkBgMap[level]}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Consistency</span>
                      <span className={`text-sm font-bold ${benchmarkColorMap[level]}`}>{labelMap[level]}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Your rate: {metrics.videosPerMonth.toFixed(1)} videos/month · Recommended: 4+ per month
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
