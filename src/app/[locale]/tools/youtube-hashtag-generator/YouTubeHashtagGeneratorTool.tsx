'use client';

import { useState, useMemo, useCallback } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { Hash, Search, Copy, Check, RotateCcw, TrendingUp, Sparkles, Tag, Shuffle, Flame, X } from 'lucide-react';

/* ── Hashtag Database ──────────────────────────────────────────────── */

const NICHE_HASHTAGS: Record<string, { trending: string[]; popular: string[]; niche: string[] }> = {
  gaming: {
    trending: ['#gaming', '#gamer', '#gameplay', '#gamingcommunity', '#gaminglife'],
    popular: ['#videogames', '#ps5', '#xbox', '#nintendo', '#pcgaming', '#twitch', '#streamer', '#esports', '#gamingsetup', '#gamingpc'],
    niche: ['#retrogaming', '#indiegames', '#speedrun', '#gamereview', '#letsplay', '#walkthrough', '#gameclips', '#gamingmoments', '#gamingnews', '#mobilegaming'],
  },
  tech: {
    trending: ['#tech', '#technology', '#techreview', '#gadgets', '#technews'],
    popular: ['#smartphone', '#laptop', '#apple', '#samsung', '#android', '#iphone', '#unboxing', '#techyoutuber', '#innovation', '#ai'],
    niche: ['#techtips', '#techdeals', '#coding', '#programming', '#webdev', '#cybersecurity', '#iot', '#robotics', '#software', '#startups'],
  },
  education: {
    trending: ['#education', '#learning', '#study', '#students', '#knowledge'],
    popular: ['#tutorial', '#howto', '#studytips', '#onlinelearning', '#studywithme', '#exam', '#science', '#math', '#english', '#history'],
    niche: ['#studymotivation', '#learnwithme', '#edtech', '#homeschool', '#collegetips', '#studyhacks', '#upsc', '#competitive', '#elearning', '#teachertok'],
  },
  fitness: {
    trending: ['#fitness', '#workout', '#gym', '#fit', '#health'],
    popular: ['#exercise', '#training', '#bodybuilding', '#yoga', '#weightloss', '#motivation', '#fitnessmotivation', '#healthy', '#muscle', '#cardio'],
    niche: ['#homeworkout', '#calisthenics', '#crossfit', '#stretching', '#nutrition', '#mealprep', '#gymlife', '#personaltrainer', '#fitfam', '#transformation'],
  },
  cooking: {
    trending: ['#cooking', '#food', '#recipe', '#foodie', '#delicious'],
    popular: ['#homecooking', '#chef', '#yummy', '#dinner', '#lunch', '#breakfast', '#baking', '#healthyfood', '#indianfood', '#streetfood'],
    niche: ['#easyrecipe', '#quickrecipe', '#mealprep', '#vegetarian', '#vegan', '#keto', '#airfryer', '#instantpot', '#foodblogger', '#cookingathome'],
  },
  vlog: {
    trending: ['#vlog', '#vlogger', '#dailyvlog', '#vlogging', '#lifestyle'],
    popular: ['#dayinmylife', '#grwm', '#routine', '#travel', '#life', '#family', '#couple', '#friends', '#adventure', '#explore'],
    niche: ['#minivlog', '#weekvlog', '#morningroutine', '#nightroutine', '#productive', '#aesthetic', '#cozy', '#dayinthelife', '#college', '#adayinmylife'],
  },
  music: {
    trending: ['#music', '#song', '#singer', '#musician', '#newmusic'],
    popular: ['#cover', '#singing', '#guitar', '#piano', '#hiphop', '#rap', '#pop', '#remix', '#beats', '#producer'],
    niche: ['#songcover', '#acousticcover', '#musicproduction', '#songwriter', '#unsigned', '#indiemusic', '#livemusic', '#musicvideo', '#beatmaking', '#vocals'],
  },
  beauty: {
    trending: ['#beauty', '#makeup', '#skincare', '#beautytips', '#glam'],
    popular: ['#makeupartist', '#mua', '#tutorial', '#cosmetics', '#skincareroutine', '#hair', '#nails', '#fashion', '#style', '#beautyblogger'],
    niche: ['#drugstoremakeup', '#affordablebeauty', '#cleanskincare', '#naturalmakeup', '#hairtutorial', '#nailart', '#perfume', '#beautyhacks', '#getready', '#transformation'],
  },
  finance: {
    trending: ['#finance', '#money', '#investing', '#stocks', '#crypto'],
    popular: ['#personalfinance', '#financialfreedom', '#wealth', '#trading', '#stockmarket', '#bitcoin', '#savings', '#budget', '#passive', '#income'],
    niche: ['#financetips', '#moneytips', '#debtfree', '#sidehustle', '#realestate', '#forex', '#dividends', '#etf', '#financialliteracy', '#wealthbuilding'],
  },
  travel: {
    trending: ['#travel', '#traveling', '#wanderlust', '#explore', '#adventure'],
    popular: ['#travelgram', '#travelvlog', '#vacation', '#trip', '#tourist', '#backpacking', '#roadtrip', '#hotel', '#beach', '#nature'],
    niche: ['#budgettravel', '#solotravel', '#traveltips', '#hiddenplaces', '#travelphotography', '#digitalnomad', '#worldtravel', '#travelguide', '#luxurytravel', '#camping'],
  },
  motivation: {
    trending: ['#motivation', '#inspiration', '#mindset', '#success', '#goals'],
    popular: ['#motivational', '#selfimprovement', '#discipline', '#growth', '#grind', '#hustle', '#positivity', '#believe', '#nevergiveup', '#winning'],
    niche: ['#morningmotivation', '#entrepreneurmindset', '#dailymotivation', '#selfhelp', '#personaldevelopment', '#productivitytips', '#habits', '#stoicism', '#mentalhealthawareness', '#confidence'],
  },
  entertainment: {
    trending: ['#entertainment', '#funny', '#comedy', '#viral', '#trending'],
    popular: ['#memes', '#lol', '#fun', '#reaction', '#challenge', '#prank', '#skit', '#shorts', '#reels', '#tiktok'],
    niche: ['#moviereview', '#tvshow', '#anime', '#celebrity', '#popculture', '#standup', '#roast', '#storytime', '#drama', '#compilation'],
  },
};

const GENERAL_HASHTAGS = ['#youtube', '#youtuber', '#youtubechannel', '#youtubevideos', '#subscribe', '#viral', '#trending', '#fyp', '#shorts', '#newvideo', '#video', '#content', '#creator', '#contentcreator', '#smallyoutuber'];

/* ── Component ─────────────────────────────────────────────────────── */

export function YouTubeHashtagGeneratorTool() {
  const [selectedNiche, setSelectedNiche] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [maxHashtags, setMaxHashtags] = useState(15);

  const nicheData = selectedNiche ? NICHE_HASHTAGS[selectedNiche] : null;

  const topicHashtags = useMemo(() => {
    if (!customTopic.trim()) return [];
    const words = customTopic.toLowerCase().split(/[\s,]+/).filter(Boolean);
    const tags: string[] = [];
    words.forEach(w => {
      const clean = w.replace(/[^a-z0-9]/g, '');
      if (clean.length >= 2) {
        tags.push(`#${clean}`);
      }
    });
    // Also generate compound tags
    if (words.length >= 2) {
      for (let i = 0; i < words.length - 1; i++) {
        const compound = words[i].replace(/[^a-z0-9]/g, '') + words[i + 1].replace(/[^a-z0-9]/g, '');
        if (compound.length >= 4 && compound.length <= 30) {
          tags.push(`#${compound}`);
        }
      }
    }
    return [...new Set(tags)];
  }, [customTopic]);

  const allSuggested = useMemo(() => {
    const tags: string[] = [];
    if (nicheData) {
      tags.push(...nicheData.trending, ...nicheData.popular, ...nicheData.niche);
    }
    tags.push(...topicHashtags);
    tags.push(...GENERAL_HASHTAGS);
    return [...new Set(tags)];
  }, [nicheData, topicHashtags]);

  const toggleHashtag = useCallback((tag: string) => {
    setSelectedHashtags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else if (next.size < maxHashtags) next.add(tag);
      return next;
    });
  }, [maxHashtags]);

  const selectAll = (tags: string[]) => {
    setSelectedHashtags(prev => {
      const next = new Set(prev);
      tags.forEach(t => { if (next.size < maxHashtags) next.add(t); });
      return next;
    });
  };

  const randomSelect = () => {
    const available = allSuggested.filter(t => !selectedHashtags.has(t));
    const shuffled = available.sort(() => Math.random() - 0.5);
    const count = Math.min(maxHashtags - selectedHashtags.size, 5);
    setSelectedHashtags(prev => {
      const next = new Set(prev);
      shuffled.slice(0, count).forEach(t => next.add(t));
      return next;
    });
  };

  const output = [...selectedHashtags].join(' ');

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  const niches = Object.keys(NICHE_HASHTAGS);

  const nicheLabels: Record<string, { label: string; icon: string }> = {
    gaming: { label: 'Gaming', icon: '🎮' },
    tech: { label: 'Tech', icon: '💻' },
    education: { label: 'Education', icon: '📚' },
    fitness: { label: 'Fitness', icon: '💪' },
    cooking: { label: 'Cooking', icon: '🍳' },
    vlog: { label: 'Vlog', icon: '📹' },
    music: { label: 'Music', icon: '🎵' },
    beauty: { label: 'Beauty', icon: '💄' },
    finance: { label: 'Finance', icon: '💰' },
    travel: { label: 'Travel', icon: '✈️' },
    motivation: { label: 'Motivation', icon: '🔥' },
    entertainment: { label: 'Entertainment', icon: '🎬' },
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';

  return (
    <div className="space-y-5">
      {/* Niche selector */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          <Tag className="w-4 h-4 text-red-500" /> Select Your Niche
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {niches.map(n => (
            <button key={n} onClick={() => setSelectedNiche(n === selectedNiche ? '' : n)}
              className={`p-3 rounded-xl text-center transition-all ${
                selectedNiche === n
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-red-300'
              }`}>
              <span className="text-xl block">{nicheLabels[n].icon}</span>
              <span className="text-xs font-medium mt-1 block">{nicheLabels[n].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom topic */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          <Search className="w-4 h-4 text-primary-600 dark:text-primary-400" /> Describe Your Video
        </label>
        <input type="text" value={customTopic} onChange={e => setCustomTopic(e.target.value)}
          placeholder="e.g., iPhone 16 unboxing review camera test"
          className={inputClass} />
        <p className="text-xs text-slate-400">Enter keywords from your video title or topic to generate targeted hashtags</p>
      </div>

      {/* Max hashtags slider */}
      <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">Max hashtags:</label>
        <input type="range" min={5} max={30} value={maxHashtags}
          onChange={e => setMaxHashtags(parseInt(e.target.value))}
          className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-red-500" />
        <span className="text-sm font-bold text-red-600 w-8 text-right">{maxHashtags}</span>
      </div>

      {/* Suggested hashtags */}
      {(nicheData || topicHashtags.length > 0) && (
        <div className="space-y-4">
          {/* Trending */}
          {nicheData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Trending
                </h3>
                <button onClick={() => selectAll(nicheData.trending)}
                  className="text-[10px] text-primary-600 dark:text-primary-400 hover:underline">Add all</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {nicheData.trending.map(tag => (
                  <button key={tag} onClick={() => toggleHashtag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedHashtags.has(tag)
                        ? 'bg-red-500 text-white'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                    }`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular */}
          {nicheData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Popular
                </h3>
                <button onClick={() => selectAll(nicheData.popular)}
                  className="text-[10px] text-primary-600 dark:text-primary-400 hover:underline">Add all</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {nicheData.popular.map(tag => (
                  <button key={tag} onClick={() => toggleHashtag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedHashtags.has(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                    }`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Niche specific */}
          {nicheData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Niche-Specific
                </h3>
                <button onClick={() => selectAll(nicheData.niche)}
                  className="text-[10px] text-primary-600 dark:text-primary-400 hover:underline">Add all</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {nicheData.niche.map(tag => (
                  <button key={tag} onClick={() => toggleHashtag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedHashtags.has(tag)
                        ? 'bg-green-500 text-white'
                        : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
                    }`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Topic generated */}
          {topicHashtags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" /> From Your Topic
                </h3>
                <button onClick={() => selectAll(topicHashtags)}
                  className="text-[10px] text-primary-600 dark:text-primary-400 hover:underline">Add all</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {topicHashtags.map(tag => (
                  <button key={tag} onClick={() => toggleHashtag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedHashtags.has(tag)
                        ? 'bg-purple-500 text-white'
                        : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                    }`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* General */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> General YouTube
              </h3>
              <button onClick={() => selectAll(GENERAL_HASHTAGS)}
                className="text-[10px] text-primary-600 dark:text-primary-400 hover:underline">Add all</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {GENERAL_HASHTAGS.map(tag => (
                <button key={tag} onClick={() => toggleHashtag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedHashtags.has(tag)
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={randomSelect}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <Shuffle className="w-3.5 h-3.5" /> Random +5
        </button>
        <button onClick={() => setSelectedHashtags(new Set())}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Clear Selected
        </button>
      </div>

      {/* Selected output */}
      {selectedHashtags.size > 0 && (
        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100">
              Selected Hashtags ({selectedHashtags.size}/{maxHashtags})
            </h3>
            <button onClick={copyOutput}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}>
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy All</>}
            </button>
          </div>

          {/* Selected tags display */}
          <div className="flex flex-wrap gap-1.5">
            {[...selectedHashtags].map(tag => (
              <span key={tag} onClick={() => toggleHashtag(tag)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500 text-white cursor-pointer hover:bg-red-600 transition-colors flex items-center gap-1">
                {tag} <X className="w-3 h-3" />
              </span>
            ))}
          </div>

          {/* Output text */}
          <div className="relative">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-mono break-all leading-relaxed">
              {output}
            </div>
            <div className="absolute top-2 right-2">
              <CopyButton text={output} size="sm" />
            </div>
          </div>

          {/* Character count */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{output.length} characters</span>
            <span>{selectedHashtags.size} hashtags</span>
          </div>

          {/* YouTube tips */}
          <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <strong>YouTube Tip:</strong> Place hashtags in your video description (not title). YouTube shows the first 3 hashtags above your video title. Use 3-15 hashtags for best results — more than 15 may be ignored.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
