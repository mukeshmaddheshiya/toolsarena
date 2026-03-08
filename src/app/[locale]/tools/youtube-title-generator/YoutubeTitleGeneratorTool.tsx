'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Youtube,
  Type,
  FileText,
  ShieldCheck,
  Zap,
  Hash,
  ClipboardCopy,
  Lightbulb,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type TabMode = 'title' | 'description';

type Niche =
  | 'tech'
  | 'gaming'
  | 'vlog'
  | 'tutorial'
  | 'review'
  | 'cooking'
  | 'fitness'
  | 'finance'
  | 'travel'
  | 'education'
  | 'entertainment'
  | 'news'
  | 'music'
  | 'motivation';

interface GeneratedTitle {
  text: string;
  charCount: number;
  seoScore: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const NICHES: { value: Niche; label: string }[] = [
  { value: 'tech', label: 'Tech' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'vlog', label: 'Vlog' },
  { value: 'tutorial', label: 'Tutorial / How-To' },
  { value: 'review', label: 'Review' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'finance', label: 'Finance' },
  { value: 'travel', label: 'Travel' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'news', label: 'News' },
  { value: 'music', label: 'Music' },
  { value: 'motivation', label: 'Motivation' },
];

const POWER_WORDS = [
  'ultimate', 'secret', 'proven', 'free', 'instant', 'powerful', 'easy',
  'best', 'top', 'amazing', 'incredible', 'essential', 'complete', 'definitive',
  'exclusive', 'guaranteed', 'massive', 'mind-blowing', 'shocking', 'unbelievable',
  'epic', 'insane', 'game changer', 'genius', 'hack', 'mistake', 'truth',
  'actually', 'seriously', 'finally', 'warning', 'hurry', 'limited', 'now',
  'stop', 'watch', 'must', 'never', 'always', 'worst', 'exactly',
];

const CURRENT_YEAR = new Date().getFullYear();

const TITLE_TEMPLATES: Record<Niche, string[]> = {
  tech: [
    'How to [TOPIC] in [YEAR] (Step-by-Step Guide)',
    '[TOPIC] — The Ultimate Guide for [YEAR]',
    'I Tested [TOPIC] for 30 Days — Here\'s What Happened',
    'Stop Making This [TOPIC] Mistake! Here\'s the Fix',
    '[TOPIC] vs [TOPIC]: Which Is Actually Better in [YEAR]?',
    'The Truth About [TOPIC] Nobody Tells You',
    '[NUMBER] [TOPIC] Tips That Actually Work in [YEAR]',
    'Why [TOPIC] Is a Game Changer (Watch Before It\'s Too Late)',
    'Is [TOPIC] Worth It? Honest Review After [NUMBER] Months',
    '[TOPIC] Setup Guide — From Zero to Pro',
    'The Best [TOPIC] Settings for [YEAR] (You\'re Doing It Wrong)',
    'I Switched to [TOPIC] and I\'m Never Going Back',
    '[TOPIC] Explained in [NUMBER] Minutes (Simple Guide)',
    '[NUMBER] Hidden [TOPIC] Features You\'re Not Using',
    'Everything Wrong With [TOPIC] (And How to Fix It)',
    '[TOPIC] for Beginners — Complete Tutorial [YEAR]',
  ],
  gaming: [
    '[TOPIC] — [NUMBER] Tips to Dominate Every Match',
    'I Tried [TOPIC] for 24 Hours Straight — Here\'s What Happened',
    'The Secret [TOPIC] Strategy Nobody Knows About',
    '[TOPIC] Beginner to Pro Guide in [NUMBER] Minutes',
    '[TOPIC] Is Broken and Here\'s Why',
    'Best [TOPIC] Loadout in [YEAR] (Insane Damage)',
    '[NUMBER] [TOPIC] Mistakes You\'re Still Making',
    'How I Got [TOPIC] in Just [NUMBER] Days',
    '[TOPIC] Tips That Will Make You Unstoppable',
    'The Ultimate [TOPIC] Guide for [YEAR]',
    'Why [TOPIC] Is the Best Game of [YEAR]',
    'I Spent [NUMBER] Hours in [TOPIC] — Was It Worth It?',
    '[TOPIC] — Everything You Need to Know Before Playing',
    'Ranking Every [TOPIC] From Worst to Best',
    'Top [NUMBER] [TOPIC] Moments That Blew My Mind',
    '[TOPIC] World Record Attempt — Can I Beat It?',
  ],
  vlog: [
    'A Day in My Life — [TOPIC] Edition',
    'I Tried [TOPIC] for a Week (Honest Experience)',
    'Moving to [TOPIC] — Here\'s What It\'s Really Like',
    '[TOPIC] Vlog — Things Went Wrong',
    'My Honest [TOPIC] Experience (Not What I Expected)',
    'Living on [TOPIC] for [NUMBER] Days — Challenge',
    'What [NUMBER] Days of [TOPIC] Taught Me',
    'Behind the Scenes of [TOPIC] (Raw & Real)',
    '[TOPIC] Changed My Life — Here\'s How',
    'I Did [TOPIC] Every Day for a Month — Results',
    'Reacting to My First [TOPIC] Experience',
    'The Reality of [TOPIC] Nobody Shows You',
    'Why I Quit [TOPIC] (The Full Story)',
    'My [TOPIC] Transformation — Before & After',
    'Surprising My [TOPIC] — Emotional Reaction',
    '[TOPIC] House Tour — Finally Revealing Everything',
  ],
  tutorial: [
    'How to [TOPIC] in [YEAR] (Step-by-Step Guide)',
    '[TOPIC] Tutorial for Complete Beginners',
    'Learn [TOPIC] in [NUMBER] Minutes — Easy Tutorial',
    'The Complete [TOPIC] Course — Free [YEAR] Edition',
    '[TOPIC] Made Simple — Even a Beginner Can Do This',
    'Master [TOPIC] in [NUMBER] Easy Steps',
    '[TOPIC] Tutorial — From Zero to Hero',
    'How to [TOPIC] the Right Way (Common Mistakes to Avoid)',
    '[TOPIC] for Dummies — The Easiest Guide Ever',
    'The Only [TOPIC] Tutorial You\'ll Ever Need',
    '[NUMBER] [TOPIC] Tricks Every Beginner Should Know',
    'How I Learned [TOPIC] in [NUMBER] Days (My Method)',
    '[TOPIC] Crash Course — Everything You Need in [NUMBER] Minutes',
    'Beginner\'s Guide to [TOPIC] — Start Here',
    'How to [TOPIC] Without Any Experience',
    '[TOPIC] — [NUMBER] Pro Tips for Faster Results',
  ],
  review: [
    '[TOPIC] Review — Is It Worth Your Money in [YEAR]?',
    'I Used [TOPIC] for [NUMBER] Months — Honest Review',
    'The Truth About [TOPIC] (Unbiased Review)',
    '[TOPIC] — Best or Worst Purchase of [YEAR]?',
    '[NUMBER] Things I Love (and Hate) About [TOPIC]',
    'Don\'t Buy [TOPIC] Before Watching This',
    '[TOPIC] Review After [NUMBER] Months — Still Worth It?',
    '[TOPIC] vs [TOPIC] — The Definitive Comparison',
    'Is [TOPIC] Overhyped? My Honest Opinion',
    'Everything You Need to Know About [TOPIC] ([YEAR] Review)',
    'Why [TOPIC] Is the Best in Its Category',
    '[TOPIC] Unboxing + First Impressions — WOW',
    'The Good, the Bad, and the Ugly of [TOPIC]',
    '[TOPIC] Long-Term Review — [NUMBER] Months Later',
    'Should You Buy [TOPIC]? Watch This First',
    'Best [TOPIC] Under [NUMBER]? Let\'s Find Out',
  ],
  cooking: [
    'How to Make [TOPIC] — Easy Recipe in [NUMBER] Minutes',
    'The Best [TOPIC] Recipe You\'ll Ever Try',
    '[TOPIC] Recipe — Restaurant Quality at Home',
    'I Tried Making [TOPIC] for the First Time',
    '[NUMBER] [TOPIC] Recipes That Will Blow Your Mind',
    'Secret [TOPIC] Recipe — My Grandmother\'s Method',
    '[TOPIC] in [NUMBER] Minutes — Quick and Delicious',
    'You\'ve Been Making [TOPIC] Wrong Your Entire Life',
    'Cheap vs Expensive [TOPIC] — Can You Taste the Difference?',
    'The Perfect [TOPIC] — Tips from a Professional Chef',
    '[TOPIC] Meal Prep for the Entire Week',
    '[NUMBER]-Ingredient [TOPIC] — Anyone Can Make This',
    'Taste Testing [TOPIC] from [NUMBER] Different Countries',
    'How to Make [TOPIC] Without an Oven',
    'My Family\'s Secret [TOPIC] Recipe (Finally Revealed)',
    'Making [TOPIC] From Scratch — Is It Worth It?',
  ],
  fitness: [
    '[TOPIC] Workout — Get Results in [NUMBER] Days',
    'The Best [TOPIC] Exercises for Beginners',
    'I Did [TOPIC] Every Day for 30 Days — Transformation',
    '[NUMBER]-Minute [TOPIC] Workout — No Equipment Needed',
    'How I Transformed My Body With [TOPIC]',
    'Stop Doing [TOPIC] Wrong — Fix These Mistakes',
    'The Ultimate [TOPIC] Guide for [YEAR]',
    '[TOPIC] vs [TOPIC] — Which Burns More Fat?',
    'My [TOPIC] Routine — Full Workout Explained',
    '[NUMBER] [TOPIC] Mistakes Killing Your Progress',
    'How to Start [TOPIC] as a Complete Beginner',
    '[TOPIC] Diet Plan — What I Eat in a Day',
    'The Science Behind [TOPIC] (Why It Actually Works)',
    '[TOPIC] Challenge — [NUMBER] Days Transformation Results',
    'Best [TOPIC] Supplements in [YEAR] (Science-Based)',
    '[TOPIC] at Home — No Gym Required',
  ],
  finance: [
    'How to [TOPIC] in [YEAR] — Complete Guide',
    '[TOPIC] for Beginners — Start With Just [NUMBER]',
    '[NUMBER] [TOPIC] Mistakes That Are Costing You Money',
    'The Truth About [TOPIC] Nobody Talks About',
    'How I Made [TOPIC] — My Exact Strategy',
    '[TOPIC] vs [TOPIC] — Where Should You Put Your Money?',
    'Stop Wasting Money on [TOPIC] — Do This Instead',
    'The Best [TOPIC] Strategy for [YEAR]',
    'How to [TOPIC] and Build Wealth in Your 20s',
    '[TOPIC] Explained Simply in [NUMBER] Minutes',
    'Is [TOPIC] Still Worth It in [YEAR]?',
    '[NUMBER] [TOPIC] Tips That Made Me Rich',
    'My [TOPIC] Portfolio Reveal — Full Breakdown',
    'How to Retire Early With [TOPIC]',
    '[TOPIC] — The [NUMBER] Rules You Must Follow',
    'Why Most People Fail at [TOPIC] (And How to Avoid It)',
  ],
  travel: [
    '[TOPIC] Travel Guide — Everything You Need to Know',
    '[NUMBER] Things to Do in [TOPIC] ([YEAR] Guide)',
    'I Traveled to [TOPIC] on a Budget — Here\'s How',
    '[TOPIC] — The Most Beautiful Place I\'ve Ever Seen',
    'Don\'t Visit [TOPIC] Without Watching This First',
    '[TOPIC] in [NUMBER] Days — Perfect Itinerary',
    'Is [TOPIC] Worth Visiting? My Honest Experience',
    'The Ultimate [TOPIC] Travel Guide for [YEAR]',
    'Hidden Gems in [TOPIC] That Tourists Miss',
    'How Much Does [TOPIC] Really Cost? Full Breakdown',
    '[TOPIC] Street Food Tour — [NUMBER] Must-Try Dishes',
    'Living in [TOPIC] for [NUMBER] Days — Cost of Living',
    'Best Time to Visit [TOPIC] — Insider Tips',
    '[TOPIC] Travel Mistakes — Avoid These at All Costs',
    'My [TOPIC] Trip Went Completely Wrong (Storytime)',
    '[TOPIC] vs [TOPIC] — Which Destination Is Better?',
  ],
  education: [
    'How to Learn [TOPIC] Fast — Proven Study Method',
    '[TOPIC] Explained Simply in [NUMBER] Minutes',
    'The Complete [TOPIC] Guide for Students',
    'Why [TOPIC] Is More Important Than You Think',
    '[NUMBER] [TOPIC] Facts That Will Surprise You',
    'How to Study [TOPIC] Effectively — Science-Based Tips',
    '[TOPIC] Made Easy — Anyone Can Understand This',
    'Everything You Need to Know About [TOPIC]',
    'The History of [TOPIC] — A Complete Timeline',
    'Why Schools Don\'t Teach [TOPIC] (But Should)',
    'How [TOPIC] Actually Works — Simple Explanation',
    '[TOPIC] vs [TOPIC] — What\'s the Real Difference?',
    'Master [TOPIC] With These [NUMBER] Study Hacks',
    'The Biggest [TOPIC] Myths Debunked',
    'How to Pass [TOPIC] Exam — Tips from Top Students',
    '[TOPIC] in [NUMBER] Minutes — Quick Revision',
  ],
  entertainment: [
    'I Tried [TOPIC] and It Was Absolutely Insane',
    '[TOPIC] — You Won\'t Believe What Happened',
    '[NUMBER] [TOPIC] Moments That Broke the Internet',
    'Reacting to [TOPIC] for the First Time',
    'The Most Epic [TOPIC] Moments of [YEAR]',
    'Ranking [TOPIC] From Worst to Best',
    'I Spent [NUMBER] Hours Doing [TOPIC] — Was It Worth It?',
    'The [TOPIC] Challenge — Things Got Out of Hand',
    'Guess the [TOPIC] — Impossible Edition',
    'We Tried [TOPIC] and Instantly Regretted It',
    '[TOPIC] Tier List — My Controversial Rankings',
    'If [TOPIC] Were a Person — Funny Compilation',
    'The Craziest [TOPIC] You\'ve Never Heard Of',
    '[TOPIC] but It Gets Increasingly More Chaotic',
    'I Let [TOPIC] Control My Life for [NUMBER] Hours',
    '[TOPIC] Expectations vs Reality',
  ],
  news: [
    '[TOPIC] — Everything You Need to Know Right Now',
    'Breaking: [TOPIC] Changes Everything in [YEAR]',
    'The [TOPIC] Situation Explained in [NUMBER] Minutes',
    'Why [TOPIC] Matters More Than You Think',
    '[TOPIC] Update — What\'s Really Happening',
    'How [TOPIC] Will Affect You in [YEAR]',
    'The Truth Behind [TOPIC] (Full Analysis)',
    '[TOPIC] — [NUMBER] Things the Media Won\'t Tell You',
    'What Experts Say About [TOPIC]',
    '[TOPIC] Controversy Explained Simply',
    'Is [TOPIC] the Biggest Story of [YEAR]?',
    '[TOPIC] Deep Dive — Facts vs Fiction',
    'The Real Impact of [TOPIC] on Your Daily Life',
    '[TOPIC] Timeline — How We Got Here',
    'My Take on [TOPIC] (Unpopular Opinion)',
    '[TOPIC] — Separating Hype from Reality',
  ],
  music: [
    'How to Play [TOPIC] — Easy Tutorial for Beginners',
    '[TOPIC] Cover — My Version (Original by ...)',
    'Learning [TOPIC] in [NUMBER] Days — Music Challenge',
    'The Story Behind [TOPIC] — You Had No Idea',
    '[TOPIC] Reaction — First Time Hearing This',
    'How to Sing [TOPIC] — Vocal Tips and Techniques',
    '[NUMBER] [TOPIC] Songs You Need to Hear in [YEAR]',
    'Making [TOPIC] From Scratch — Beat Production Tutorial',
    'Why [TOPIC] Is the Greatest Song of All Time',
    '[TOPIC] Guitar Tutorial — Play It in [NUMBER] Minutes',
    'My [TOPIC] Practice Routine — [NUMBER] Hours a Day',
    'Beginner vs Pro — Playing [TOPIC] Side by Side',
    '[TOPIC] Music Theory Explained Simply',
    'How [TOPIC] Changed the Music Industry',
    'Ranking Every [TOPIC] Album from Worst to Best',
    '[TOPIC] Piano Tutorial — Easy to Hard',
  ],
  motivation: [
    'How [TOPIC] Can Change Your Life Forever',
    'Stop Waiting — Start [TOPIC] Today',
    'The [NUMBER]-Step [TOPIC] Formula for Success',
    'Why You Keep Failing at [TOPIC] (And How to Fix It)',
    '[TOPIC] — The Mindset Shift That Changed Everything',
    'How I Went From Zero to [TOPIC] in [NUMBER] Days',
    'The Secret to [TOPIC] That Top Performers Know',
    '[TOPIC] Motivation — Watch This When You Feel Like Giving Up',
    '[NUMBER] [TOPIC] Habits of Highly Successful People',
    'You\'re [NUMBER] Steps Away From [TOPIC] (Start Now)',
    'The Real Reason You\'re Not Achieving [TOPIC]',
    'How to Stay Disciplined With [TOPIC] Every Single Day',
    '[TOPIC] — It\'s Not Too Late to Start',
    'What [NUMBER] Days of [TOPIC] Taught Me About Life',
    'This [TOPIC] Advice Will Save You Years of Struggle',
    'From Broke to [TOPIC] — My Transformation Story',
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fillTemplate(template: string, topic: string): string {
  return template
    .replace(/\[TOPIC\]/g, topic)
    .replace(/\[YEAR\]/g, String(CURRENT_YEAR))
    .replace(/\[NUMBER\]/g, String(randomNumber(3, 15)));
}

function calcSeoScore(title: string): number {
  let score = 50;
  const len = title.length;
  if (len >= 50 && len <= 70) score += 25;
  else if (len >= 40 && len <= 80) score += 15;
  else if (len < 30 || len > 90) score -= 10;
  const lowerTitle = title.toLowerCase();
  const hasPowerWord = POWER_WORDS.some((w) => lowerTitle.includes(w));
  if (hasPowerWord) score += 10;
  if (/\d/.test(title)) score += 8;
  if (/[!?]/.test(title)) score += 4;
  if (/[\u2014\u2013—]/.test(title)) score += 3;
  return Math.min(100, Math.max(0, score));
}

function highlightPowerWords(text: string): (string | { word: string })[] {
  const parts: (string | { word: string })[] = [];
  const regex = new RegExp(`\\b(${POWER_WORDS.join('|')})\\b`, 'gi');
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push({ word: match[0] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

function getSeoColor(score: number): string {
  if (score >= 75) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
}

function getCharColor(count: number): string {
  if (count >= 50 && count <= 70) return 'text-green-500';
  if (count >= 40 && count <= 80) return 'text-yellow-500';
  return 'text-red-500';
}

// ─── Component ────────────────────────────────────────────────────────────────
export function YoutubeTitleGeneratorTool() {
  const [tab, setTab] = useState<TabMode>('title');

  // Title generator state
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [niche, setNiche] = useState<Niche>('tech');
  const [titles, setTitles] = useState<GeneratedTitle[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Description generator state
  const [videoTitle, setVideoTitle] = useState('');
  const [mainPoints, setMainPoints] = useState('');
  const [links, setLinks] = useState('');
  const [socialLinks, setSocialLinks] = useState(
    'Instagram: https://instagram.com/yourchannel\nTwitter: https://twitter.com/yourchannel\nTikTok: https://tiktok.com/@yourchannel'
  );
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [descCopied, setDescCopied] = useState(false);

  // ─── Title Generation ───────────────────────────────────────────────
  const generateTitles = useCallback(() => {
    if (!topic.trim()) return;
    const templates = TITLE_TEMPLATES[niche];
    const selected = shuffle(templates).slice(0, 10);
    const generated = selected.map((tmpl) => {
      const text = fillTemplate(tmpl, topic.trim());
      return {
        text,
        charCount: text.length,
        seoScore: calcSeoScore(text),
      };
    });
    setTitles(generated);
    setCopiedIdx(null);
  }, [topic, niche]);

  const loadTitleExample = useCallback(() => {
    setTopic('Artificial Intelligence');
    setAudience('beginners');
    setNiche('tech');
  }, []);

  const copyTitle = useCallback((text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }, []);

  // ─── Description Generation ─────────────────────────────────────────
  const generateDescription = useCallback(() => {
    if (!videoTitle.trim()) return;

    const points = mainPoints
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    const linkLines = links
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const socialLines = socialLinks
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const hookSentences = [
      `In this video, I break down everything you need to know about ${videoTitle.replace(/['"]/g, '')}.`,
      `Whether you're a complete beginner or looking to level up, this guide has you covered.`,
      `Make sure to watch until the end for a bonus tip that most people miss!`,
    ];

    let desc = '';
    desc += hookSentences.join(' ') + '\n\n';

    desc += '=== TIMESTAMPS ===\n';
    desc += '0:00 - Introduction\n';
    if (points.length > 0) {
      points.forEach((point, i) => {
        const minutes = (i + 1) * 2;
        desc += `${minutes}:00 - ${point}\n`;
      });
    } else {
      desc += '2:00 - Main Topic\n';
      desc += '5:00 - Key Insights\n';
      desc += '8:00 - Tips & Tricks\n';
    }
    desc += '\n';

    if (points.length > 0) {
      desc += '=== KEY POINTS ===\n';
      points.forEach((point) => {
        desc += `- ${point}\n`;
      });
      desc += '\n';
    }

    if (linkLines.length > 0) {
      desc += '=== LINKS & RESOURCES ===\n';
      linkLines.forEach((link) => {
        desc += `${link}\n`;
      });
      desc += '\n';
    }

    if (socialLines.length > 0) {
      desc += '=== FOLLOW ME ===\n';
      socialLines.forEach((link) => {
        desc += `${link}\n`;
      });
      desc += '\n';
    }

    const hashtags = videoTitle
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2)
      .slice(0, 5)
      .map((w) => `#${w}`)
      .join(' ');
    desc += `${hashtags} #YouTube #${CURRENT_YEAR}\n\n`;

    desc +=
      'DISCLAIMER: Some links above may be affiliate links, meaning I may earn a small commission at no extra cost to you. All opinions are my own.';

    setGeneratedDesc(desc);
    setDescCopied(false);
  }, [videoTitle, mainPoints, links, socialLinks]);

  const loadDescExample = useCallback(() => {
    setVideoTitle('How to Build a Website in 2026 (Complete Beginner Guide)');
    setMainPoints(
      'Choosing a domain, Setting up hosting, Installing WordPress, Picking a theme, Essential plugins'
    );
    setLinks(
      'https://example.com/hosting-deal\nhttps://example.com/theme-recommendation'
    );
  }, []);

  const copyDescription = useCallback(() => {
    navigator.clipboard.writeText(generatedDesc);
    setDescCopied(true);
    setTimeout(() => setDescCopied(false), 2000);
  }, [generatedDesc]);

  const descCharCount = useMemo(() => generatedDesc.length, [generatedDesc]);

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-xl bg-red-600 px-5 py-4 text-white dark:bg-red-700">
        <Youtube className="h-8 w-8 shrink-0" />
        <div>
          <h2 className="text-lg font-bold sm:text-xl">
            YouTube Title & Description Generator
          </h2>
          <p className="text-sm text-red-100">
            Generate SEO-optimized titles and descriptions using proven formulas
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        <button
          onClick={() => setTab('title')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
            tab === 'title'
              ? 'bg-white text-red-600 shadow dark:bg-gray-700 dark:text-red-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Type className="h-4 w-4" />
          Title Generator
        </button>
        <button
          onClick={() => setTab('description')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
            tab === 'description'
              ? 'bg-white text-red-600 shadow dark:bg-gray-700 dark:text-red-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          Description Generator
        </button>
      </div>

      {/* ─── TITLE GENERATOR ─────────────────────────────────────────── */}
      {tab === 'title' && (
        <div className="space-y-5">
          {/* Inputs */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Video Topic / Keyword <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Artificial Intelligence, React JS, Weight Loss..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Niche / Category
                  </label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value as Niche)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  >
                    {NICHES.map((n) => (
                      <option key={n.value} value={n.value}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target Audience (optional)
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. beginners, developers, students..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={generateTitles}
                  disabled={!topic.trim()}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Titles
                </button>
                {titles.length > 0 && (
                  <button
                    onClick={generateTitles}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Shuffle
                  </button>
                )}
                <button
                  onClick={loadTitleExample}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Lightbulb className="h-4 w-4" />
                  Try Example
                </button>
              </div>
            </div>
          </div>

          {/* Generated Titles */}
          {titles.length > 0 && (
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Zap className="h-4 w-4 text-red-500" />
                Generated Titles ({titles.length})
                <span className="ml-auto text-xs font-normal text-gray-400">
                  Power words highlighted in{' '}
                  <span className="font-medium text-red-500">red</span>
                </span>
              </h3>

              {titles.map((t, idx) => (
                <div
                  key={idx}
                  className="group flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-red-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-red-600"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600 dark:bg-red-900/40 dark:text-red-400">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                      {highlightPowerWords(t.text).map((part, pi) =>
                        typeof part === 'string' ? (
                          <span key={pi}>{part}</span>
                        ) : (
                          <span
                            key={pi}
                            className="font-semibold text-red-500 dark:text-red-400"
                          >
                            {part.word}
                          </span>
                        )
                      )}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs">
                      <span className={getCharColor(t.charCount)}>
                        {t.charCount} chars
                        {t.charCount >= 50 && t.charCount <= 70
                          ? ' (ideal)'
                          : t.charCount < 50
                            ? ' (short)'
                            : ' (long)'}
                      </span>
                      <span className={getSeoColor(t.seoScore)}>
                        SEO Score: {t.seoScore}/100
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyTitle(t.text, idx)}
                    className="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    title="Copy title"
                  >
                    {copiedIdx === idx ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SEO Tips */}
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800/50 dark:bg-yellow-900/20">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-yellow-800 dark:text-yellow-300">
              <Lightbulb className="h-4 w-4" />
              YouTube Title SEO Tips
            </h4>
            <ul className="space-y-1 text-xs leading-relaxed text-yellow-700 dark:text-yellow-400">
              <li>
                Keep titles between 50-70 characters for best CTR and SEO
                performance.
              </li>
              <li>
                Include numbers, brackets, or parentheses to increase click-through
                rate by up to 38%.
              </li>
              <li>
                Use power words like &ldquo;Ultimate,&rdquo;
                &ldquo;Secret,&rdquo; &ldquo;Proven&rdquo; to trigger
                emotional response.
              </li>
              <li>
                Put your main keyword at the beginning of the title for
                better YouTube search ranking.
              </li>
              <li>
                Avoid ALL CAPS titles — use Title Case for a professional
                look.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ─── DESCRIPTION GENERATOR ───────────────────────────────────── */}
      {tab === 'description' && (
        <div className="space-y-5">
          {/* Inputs */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Video Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g. How to Build a Website in 2026 (Complete Guide)"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Main Points (comma separated)
                </label>
                <textarea
                  value={mainPoints}
                  onChange={(e) => setMainPoints(e.target.value)}
                  rows={3}
                  placeholder="e.g. Choosing a domain, Setting up hosting, Installing WordPress..."
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Links & Resources (one per line)
                </label>
                <textarea
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  rows={2}
                  placeholder="https://example.com/resource-1&#10;https://example.com/resource-2"
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Social Media Links (one per line)
                </label>
                <textarea
                  value={socialLinks}
                  onChange={(e) => setSocialLinks(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={generateDescription}
                  disabled={!videoTitle.trim()}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Description
                </button>
                <button
                  onClick={loadDescExample}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Lightbulb className="h-4 w-4" />
                  Try Example
                </button>
              </div>
            </div>
          </div>

          {/* Generated Description */}
          {generatedDesc && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FileText className="h-4 w-4 text-red-500" />
                  Generated Description
                </h3>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium ${
                      descCharCount > 5000 ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    {descCharCount.toLocaleString()} / 5,000 chars
                  </span>
                  <button
                    onClick={copyDescription}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {descCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardCopy className="h-3.5 w-3.5" />
                        Copy All
                      </>
                    )}
                  </button>
                </div>
              </div>

              {descCharCount > 5000 && (
                <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  Description exceeds YouTube&apos;s 5,000 character limit.
                  Consider shortening it.
                </div>
              )}

              <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-4 font-sans text-sm leading-relaxed text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                {generatedDesc}
              </pre>
            </div>
          )}

          {/* Description Tips */}
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800/50 dark:bg-yellow-900/20">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-yellow-800 dark:text-yellow-300">
              <Lightbulb className="h-4 w-4" />
              YouTube Description Best Practices
            </h4>
            <ul className="space-y-1 text-xs leading-relaxed text-yellow-700 dark:text-yellow-400">
              <li>
                Place the most important keywords and links in the first 2-3
                lines (visible without clicking &ldquo;Show more&rdquo;).
              </li>
              <li>
                Include timestamps to improve user experience and enable
                YouTube chapters.
              </li>
              <li>
                Add 3-5 relevant hashtags — the first 3 appear above your
                video title.
              </li>
              <li>
                Use the full 5,000 character limit for better SEO — longer
                descriptions rank higher.
              </li>
              <li>
                Always include a call-to-action (subscribe, like, comment) in
                the description.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800/50 dark:bg-green-900/20">
        <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
        <p className="text-xs text-green-700 dark:text-green-400">
          100% free. No signup required. All processing happens in your
          browser — your data never leaves your device.
        </p>
      </div>

      {/* Legend / Score Guide */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <Hash className="h-4 w-4 text-red-500" />
          SEO Score Guide
        </h4>
        <div className="grid gap-2 text-xs sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 dark:bg-green-900/20">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-gray-700 dark:text-gray-300">
              75-100: Excellent — great CTR potential
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-yellow-50 px-3 py-2 dark:bg-yellow-900/20">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <span className="text-gray-700 dark:text-gray-300">
              50-74: Good — room for improvement
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-900/20">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-gray-700 dark:text-gray-300">
              0-49: Needs work — optimize further
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
