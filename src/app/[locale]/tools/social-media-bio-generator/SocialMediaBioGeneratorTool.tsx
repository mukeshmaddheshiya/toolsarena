'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Copy, Check, Shuffle, Heart, Instagram, Twitter, Linkedin, Youtube,
  Shield, Zap, Sparkles, ChevronDown, ChevronUp, X, Music,
} from 'lucide-react';

/* ─── Types ─── */
type Platform = 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';
type Category = 'creator' | 'business' | 'personal' | 'funny' | 'professional' | 'motivational' | 'minimalist' | 'aesthetic';

interface PlatformInfo {
  id: Platform;
  name: string;
  icon: React.ElementType;
  limit: number;
  color: string;
  bg: string;
}

const PLATFORMS: PlatformInfo[] = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, limit: 150, color: 'text-pink-500', bg: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, limit: 160, color: 'text-sky-500', bg: 'bg-sky-500' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, limit: 220, color: 'text-blue-600', bg: 'bg-blue-600' },
  { id: 'tiktok', name: 'TikTok', icon: Music, limit: 80, color: 'text-black dark:text-white', bg: 'bg-black dark:bg-white' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, limit: 1000, color: 'text-red-600', bg: 'bg-red-600' },
];

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'creator', label: 'Creator', emoji: '\u{1F3A8}' },
  { id: 'business', label: 'Business', emoji: '\u{1F4BC}' },
  { id: 'personal', label: 'Personal', emoji: '\u{1F9D1}' },
  { id: 'funny', label: 'Funny/Witty', emoji: '\u{1F602}' },
  { id: 'professional', label: 'Professional', emoji: '\u{1F454}' },
  { id: 'motivational', label: 'Motivational', emoji: '\u{1F525}' },
  { id: 'minimalist', label: 'Minimalist', emoji: '\u{2728}' },
  { id: 'aesthetic', label: 'Aesthetic', emoji: '\u{1F338}' },
];

/* ─── 120+ Bio Templates ─── */
const TEMPLATES: Record<Platform, Record<Category, string[]>> = {
  instagram: {
    creator: [
      'Creating content that makes you stop scrolling | [niche] | DM for collabs',
      '[niche] creator | Turning ideas into scroll-stopping content | Link below',
      'Your favorite [niche] creator\'s favorite creator | New posts daily',
      'Making the internet a little more [adjective] | [niche] | [city]',
      'POV: you found the best [niche] page on IG | Collab? DM me',
      'Building in public | [niche] tips you won\'t find anywhere else',
    ],
    business: [
      '[business name] | [what you sell] | Free shipping $50+ | Shop below',
      'Handmade [product] for people who care | [city]-based | Orders open',
      '[business name] | Making [product] you\'ll actually love | Est. [year]',
      'We make [product] | 10K+ happy customers | Use code IG10 for 10% off',
      'Small batch. Big quality. | [product] made with intention | Shop now',
      'Your [product] obsession starts here | [business name] | Worldwide shipping',
    ],
    personal: [
      '[name] | [city] | Coffee addict & [hobby] enthusiast',
      'Just a [age]yo trying to figure it out | [city] | [hobby]',
      '[name] | Living somewhere between ambition and a nap',
      'Plot twist enthusiast | [hobby] | Probably at [place] right now',
      '[city] | Dog parent | [hobby] | Currently reading [book]',
      'Not all who wander are lost. But I definitely need Google Maps.',
    ],
    funny: [
      'Professional overthinker | Part-time snack enthusiast',
      'My hobbies include eating and complaining that I\'m getting fat',
      'I put the "pro" in procrastination',
      'CEO of starting shows and never finishing them',
      'Running on caffeine, sarcasm, and inappropriate thoughts',
      'I\'m not lazy, I\'m on energy-saving mode',
    ],
    professional: [
      '[role] | Helping [audience] do [result] | Speaking & consulting',
      '[title] at [company] | [industry] insights | Let\'s connect below',
      '[role] | [years]+ years in [industry] | Sharing what I\'ve learned',
      'Founder @[company] | Forbes [year] | Building the future of [industry]',
      '[role] by day | [hobby] by night | [city]',
      '[title] | Previously [company] | Writing about [topic]',
    ],
    motivational: [
      'Your only limit is your mind | [niche] | Daily motivation',
      'Building the life I don\'t need a vacation from',
      'Started from the bottom, still climbing | [niche] | [city]',
      'Dream it. Plan it. Do it. | [niche] | Follow for daily fire',
      'Proof that [background] kids can make it too',
      'Turning setbacks into setups since [year]',
    ],
    minimalist: [
      '[name] | [niche]',
      '[role]. [city]. [one word].',
      'Less noise. More signal.',
      '[niche] | [city]',
      'Making things. Sharing things.',
      '[name] | Creating.',
    ],
    aesthetic: [
      '\u{2729} [niche] \u{2729} [city] \u{2729} creating beauty in the everyday',
      '\u{1F33F} slow living | [niche] | finding magic in the mundane',
      '\u{2601}\uFE0F dreamer | [niche] curator | [city] sunsets',
      '\u{1F33C} [name] | soft life advocate | [niche] & golden hours',
      '\u{2615} mornings, [hobby], & everything in between | [city]',
      '\u{1F3B6} curating a life worth saving to Pinterest | [niche]',
    ],
  },
  twitter: {
    creator: [
      '[niche] creator | Tweeting things I wish I knew earlier | DMs open',
      'Writing threads about [niche] so you don\'t have to Google it',
      'I make [content type] about [niche] | [follower count]+ on [other platform]',
      'Documenting my [niche] journey | Today\'s lesson in the pinned tweet',
    ],
    business: [
      '[business name] | [one-liner about product] | Support: @[handle]',
      'Building [product] to help [audience] [benefit] | [business name]',
      'We\'re [business name]. We make [product]. That\'s literally it.',
      '[business name] | [product] for [audience] | YC [batch] | We\'re hiring',
    ],
    personal: [
      '[name] | Opinions are my own and probably wrong',
      'Thoughts on [topic], [topic], and whatever else I feel like',
      '[name] | [city] | Tweeting into the void since [year]',
      'I tweet so my therapist has something to discuss',
    ],
    funny: [
      'My tweets are cries for help disguised as jokes',
      'Professionally unhinged since [year]',
      'I don\'t have a blue check but I have trust issues',
      'Putting the "hot" in hot take | Absolutely unqualified',
    ],
    professional: [
      '[role] at [company] | Writing about [topic] | Previously @[company] | [city]',
      '[title] | Helping [audience] achieve [result] | Open to connect',
      'Building @[company] | [industry] | Thoughts on [topic] and [topic]',
      '[role] | [years]+ yrs in [industry] | Advisor @[company] | [city]',
    ],
    motivational: [
      'Went from [start] to [achievement] | Sharing the playbook here',
      'Building in public | Day [number] of [goal] | Follow the journey',
      'Your timeline\'s daily reminder to bet on yourself',
      'Failed [number] times. Succeeded once. That\'s all it takes.',
    ],
    minimalist: [
      '[name]. [role]. Ships things.',
      '[topic] | [city]',
      'I write code and words.',
      '[role] at [company].',
    ],
    aesthetic: [
      '\u{2728} writer of soft things | [city] mornings | [niche]',
      '\u{1F319} midnight thoughts & [topic] musings',
      '\u{1F33F} words, [niche], & quiet rebellion',
      '\u{1F3B6} curating vibes | [niche] thoughts | [city]',
    ],
  },
  linkedin: {
    creator: [
      '[role] | Creating content that makes [industry] less boring | [follower count]+ followers here for it',
      'I talk about [topic] and [topic] so you can [benefit] | Content Creator | [company]',
      'LinkedIn\'s favorite [niche] creator | Turning [industry] jargon into plain English | Follow for daily posts',
    ],
    business: [
      '[title] at [company] | We help [audience] [result] | [metric]+ customers served',
      'Co-founder [company] | [product] for [audience] | Hiring [roles] | DM me',
      'Building [company] | [one-liner] | Backed by [investors] | Series [round]',
    ],
    personal: [
      '[name] | [role] who believes work should be fun | [city] | Coffee meetings welcome',
      'Career changer: [old role] to [new role] | Sharing the messy middle',
      '[role] | Parent of [number] | [hobby] on weekends | Believer in work-life balance',
    ],
    funny: [
      'Agree? | Like. | Thoughts? | Comment. | Want more? | Follow. (I\'m kidding, please just be normal)',
      'My LinkedIn posts are 40% value, 60% coping mechanism',
      'I survived corporate America and all I got was this LinkedIn profile',
    ],
    professional: [
      '[title] | Helping [audience] achieve [result] | [years]+ years in [industry] | Open to connect',
      '[role] at [company] | Ex-[company] | [degree] from [university] | [topic] & [topic]',
      '[title] | [industry] leader | Board member @[org] | Speaker | Author of [book]',
      'VP [department] at [company] | Building world-class [teams/products] | Mentor | [city]',
    ],
    motivational: [
      'From [humble start] to [achievement] | Proving that [lesson] | Follow for the unfiltered journey',
      'I help [audience] go from [point A] to [point B] | [years]+ transformations | Let\'s connect',
      'Built [company] from $0 to $[revenue] | Sharing every lesson I learned the hard way',
    ],
    minimalist: [
      '[role] at [company]. I build things.',
      '[industry]. [city]. Open to connect.',
      '[name] | [role] | [company]',
    ],
    aesthetic: [
      '\u{2728} Designing a career I love | [role] at [company] | [city] sunsets & strategy sessions',
      '\u{1F33F} People-first leader | [industry] | Building with empathy and intention',
      '\u{1F3AF} Purposeful work. Meaningful connections. | [role] | [company]',
    ],
  },
  tiktok: {
    creator: [
      '[niche] tips that actually work',
      'Making [niche] content your FYP needed',
      'The [niche] account you\'ve been looking for',
      'Watch me [activity] | New vids daily',
    ],
    business: [
      '[product] that hits different | Link in bio',
      'Small biz making [product] you\'ll love',
      '[business name] | Shop our TikTok faves',
      'We make [product] go viral | [business name]',
    ],
    personal: [
      'Just vibes and questionable decisions',
      '[age] | [city] | Chaos coordinator',
      'Main character energy | [city]',
      'Living my best unfiltered life',
    ],
    funny: [
      'I make the videos your therapist warned you about',
      'Unhinged but make it entertaining',
      'My humor is a coping mechanism, enjoy',
      'Certified yapper | Professional silly goose',
    ],
    professional: [
      '[role] | [industry] tips in 60 sec',
      'Learn [topic] the easy way',
      '[niche] pro | Real talk only',
      'Career tips from a real [role]',
    ],
    motivational: [
      'Proof it\'s possible | [niche]',
      'Watch me build [goal] from zero',
      'Your sign to start today',
      'Day [number] of chasing dreams',
    ],
    minimalist: [
      '[niche] | [city]',
      '[name]. Makes things.',
      'Content.',
      '[one word that describes you]',
    ],
    aesthetic: [
      '\u{2729} [niche] & daydreams',
      '\u{1F338} soft content for soft souls',
      '\u{1F33F} cozy [niche] vibes',
      '\u{2615} aesthetic [niche] | [city]',
    ],
  },
  youtube: {
    creator: [
      'New videos every [day] | [subscriber count] strong | Business: [email]\n\nI make videos about [niche] that are actually worth your time. If you like [content type], you\'re in the right place.\n\nSubscribe and hit the bell so you never miss an upload.',
      'Welcome to my channel! I create [content type] about [niche].\n\n\u{1F4C5} Upload schedule: Every [day]\n\u{1F4E7} Business inquiries: [email]\n\u{1F517} My links: [link]',
      '[niche] creator making the content I wish existed when I started.\n\nNew video every [day] | [subscriber count]+ subscribers\n\nCollabs & business: [email]',
    ],
    business: [
      '[business name] - Official YouTube Channel\n\nWe help [audience] [benefit]. Subscribe for [content type] every [day].\n\n\u{1F6D2} Shop: [link]\n\u{1F4E7} Support: [email]',
      'Welcome to [business name]! We make [product] for [audience].\n\nHere you\'ll find: tutorials, behind-the-scenes, and product updates.\n\nSubscribe to stay in the loop.',
      '[business name] | [tagline]\n\nSubscribe for weekly [content type].\nWebsite: [link] | Support: [email]',
    ],
    personal: [
      'Hey, I\'m [name]! Just a [descriptor] sharing my life and [hobby].\n\nI upload whenever inspiration strikes. Subscribe if you vibe with it.\n\n[city] based | [age] years old',
      'Welcome to my little corner of YouTube.\n\nI post vlogs, [hobby] content, and whatever else I feel like. No algorithm chasing, just real content.\n\nSay hi in the comments!',
    ],
    funny: [
      'I make videos that are either genius or unhinged. No in-between.\n\nSubscribe if you want to laugh and question my sanity simultaneously.\n\nBusiness: [email] (serious inquiries only, I mean it)',
      'Welcome to the channel your recommended page warned you about.\n\nNew chaos every [day]. Subscribe before I do something even weirder.',
    ],
    professional: [
      '[name] | [role] with [years]+ years of experience in [industry].\n\nI share [content type] to help [audience] [result]. New videos every [day].\n\n\u{1F4E7} Speaking & consulting: [email]\n\u{1F4D6} My book: [title]',
      '[industry] insights from a [role] who\'s been in the trenches.\n\nNo fluff, no filler. Just actionable [topic] advice.\n\nSubscribe for weekly deep dives.',
    ],
    motivational: [
      'I went from [start] to [achievement], and I\'m documenting every step.\n\nThis channel is your proof that it\'s possible. Subscribe for the real, unfiltered journey.\n\n[niche] | Uploads every [day]',
      'Your weekly dose of real talk and motivation.\n\nI share my story of [journey] to inspire you to take action. No fake guru energy.\n\nSubscribe and let\'s grow together.',
    ],
    minimalist: [
      '[name] | [niche]\nNew videos weekly.',
      '[niche] content. No filler.\nSubscribe.',
    ],
    aesthetic: [
      '\u{2729} Welcome to a space of calm, beauty, and [niche].\n\nI create aesthetic [content type] to inspire your [goal]. New uploads every [day].\n\n\u{1F33F} Slow living | [niche] | Intentional content',
      '\u{1F338} Curating beauty one video at a time.\n\n[niche] | [city] | Cozy vibes\n\nNew videos every [day] | Business: [email]',
    ],
  },
};

/* ─── Popular Bio Emojis ─── */
const BIO_EMOJIS = [
  '\u{2728}','\u{1F525}','\u{1F4AB}','\u{1F680}','\u{1F3AF}','\u{1F4A1}','\u{1F31F}','\u{1F33F}',
  '\u{2615}','\u{1F4F8}','\u{1F3A8}','\u{1F3B5}','\u{1F4DA}','\u{1F4BB}','\u{270F}\uFE0F','\u{1F4A4}',
  '\u{1F308}','\u{1F338}','\u{1F33B}','\u{1F33C}','\u{2764}\uFE0F','\u{1F49C}','\u{1F499}','\u{1F49B}',
  '\u{2B50}','\u{1F31E}','\u{1F319}','\u{2601}\uFE0F','\u{26A1}','\u{1F48E}','\u{1F451}','\u{1F3C6}',
  '\u{1F393}','\u{1F4BC}','\u{1F4CC}','\u{1F517}','\u{1F4AC}','\u{1F4E7}','\u{1F30D}','\u{1F3E0}',
  '\u{1F436}','\u{1F431}','\u{1F60E}','\u{1F914}','\u{1F4AA}','\u{1F64F}','\u{1F389}','\u{1F381}',
  '\u{270C}\uFE0F','\u{1F91D}',
];

/* ─── Placeholder extraction ─── */
function extractPlaceholders(template: string): string[] {
  const matches = template.match(/\[([^\]]+)\]/g) || [];
  return [...new Set(matches.map(m => m.slice(1, -1)))];
}

function applyPlaceholders(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`[${key}]`, value || `[${key}]`);
  }
  return result;
}

/* ─── Invisible line break for Instagram ─── */
const INSTA_LINE_BREAK = '\n\u{200B}\n';

/* ─── Favorites storage key ─── */
const FAVORITES_KEY = 'bio-generator-favorites';

function loadFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch { return []; }
}

/* ─── Main Component ─── */
export function SocialMediaBioGeneratorTool() {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [category, setCategory] = useState<Category>('creator');
  const [templateIndex, setTemplateIndex] = useState(0);
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [customBio, setCustomBio] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  useEffect(() => { setFavorites(loadFavorites()); }, []);

  const platformInfo = PLATFORMS.find(p => p.id === platform)!;
  const templates = TEMPLATES[platform][category];
  const currentTemplate = templates[templateIndex % templates.length];
  const placeholders = useMemo(() => extractPlaceholders(currentTemplate), [currentTemplate]);

  const bioText = useCustom ? customBio : applyPlaceholders(currentTemplate, placeholderValues);
  const charCount = bioText.length;
  const charLimit = platformInfo.limit;
  const isOverLimit = charCount > charLimit;
  const charPercent = Math.min((charCount / charLimit) * 100, 100);

  // Reset template index and placeholders when platform/category changes
  useEffect(() => {
    setTemplateIndex(0);
    setPlaceholderValues({});
    setUseCustom(false);
    setCustomBio('');
  }, [platform, category]);

  const handleShuffle = useCallback(() => {
    const max = templates.length;
    let next = Math.floor(Math.random() * max);
    if (next === templateIndex && max > 1) next = (next + 1) % max;
    setTemplateIndex(next);
    setPlaceholderValues({});
  }, [templates.length, templateIndex]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(bioText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  }, [bioText]);

  const handleFavorite = useCallback(() => {
    const updated = favorites.includes(bioText)
      ? favorites.filter(f => f !== bioText)
      : [...favorites, bioText];
    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }, [bioText, favorites]);

  const removeFavorite = useCallback((bio: string) => {
    const updated = favorites.filter(f => f !== bio);
    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }, [favorites]);

  const insertLineBreak = useCallback(() => {
    if (useCustom) {
      setCustomBio(prev => prev + INSTA_LINE_BREAK);
    }
  }, [useCustom]);

  const insertEmoji = useCallback((emoji: string) => {
    if (useCustom) {
      setCustomBio(prev => prev + emoji);
    }
  }, [useCustom]);

  const isFavorited = favorites.includes(bioText);

  return (
    <div className="space-y-6">
      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Shield, label: '100% Private', desc: 'Nothing stored on servers' },
          { icon: Zap, label: '120+ Templates', desc: 'All platforms covered' },
          { icon: Sparkles, label: 'One-Click Copy', desc: 'Ready to paste anywhere' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <Icon className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400 mb-1" />
            <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{label}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Platform Selector */}
      <div>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Choose Platform</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {PLATFORMS.map(p => {
            const Icon = p.icon;
            const active = platform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  active
                    ? 'bg-fuchsia-50 dark:bg-fuchsia-950/40 border-fuchsia-300 dark:border-fuchsia-700 text-fuchsia-700 dark:text-fuchsia-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-fuchsia-200 dark:hover:border-fuchsia-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {p.name}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-fuchsia-200 dark:bg-fuchsia-900 text-fuchsia-800 dark:text-fuchsia-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {p.limit}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Selector */}
      <div>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Bio Style</p>
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5">
          {CATEGORIES.map(c => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                  active
                    ? 'bg-fuchsia-50 dark:bg-fuchsia-950/40 border-fuchsia-300 dark:border-fuchsia-700 text-fuchsia-700 dark:text-fuchsia-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-fuchsia-200 dark:hover:border-fuchsia-800'
                }`}
              >
                <span className="mr-1">{c.emoji}</span>{c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Template / Custom Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setUseCustom(false)}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all border ${
            !useCustom
              ? 'bg-fuchsia-600 text-white border-fuchsia-600'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
          }`}
        >
          Use Template
        </button>
        <button
          onClick={() => setUseCustom(true)}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all border ${
            useCustom
              ? 'bg-fuchsia-600 text-white border-fuchsia-600'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
          }`}
        >
          Write Custom
        </button>
      </div>

      {/* Template mode */}
      {!useCustom && (
        <div className="space-y-4">
          {/* Current template display */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/30 dark:to-pink-950/30 border border-fuchsia-200 dark:border-fuchsia-800">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-[10px] uppercase tracking-wider font-bold text-fuchsia-600 dark:text-fuchsia-400">Template {templateIndex + 1} of {templates.length}</p>
              <button
                onClick={handleShuffle}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-fuchsia-200 dark:border-fuchsia-700 text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-medium hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 transition-colors"
              >
                <Shuffle className="w-3 h-3" /> Shuffle
              </button>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{currentTemplate}</p>
          </div>

          {/* Placeholder inputs */}
          {placeholders.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Personalize Your Bio</p>
              <div className="grid grid-cols-2 gap-2">
                {placeholders.map(ph => (
                  <div key={ph}>
                    <label className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1 capitalize">{ph}</label>
                    <input
                      type="text"
                      value={placeholderValues[ph] || ''}
                      onChange={e => setPlaceholderValues(prev => ({ ...prev, [ph]: e.target.value }))}
                      placeholder={ph}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 focus:border-fuchsia-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom mode */}
      {useCustom && (
        <div>
          <textarea
            value={customBio}
            onChange={e => setCustomBio(e.target.value)}
            placeholder="Write your bio here..."
            rows={4}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 focus:border-fuchsia-400 resize-none"
          />
        </div>
      )}

      {/* Emoji Picker & Line Break */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowEmojis(!showEmojis)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-fuchsia-300 transition-colors"
        >
          {showEmojis ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          Emojis
        </button>
        {platform === 'instagram' && useCustom && (
          <button
            onClick={insertLineBreak}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-fuchsia-300 transition-colors"
          >
            Add Line Break
          </button>
        )}
      </div>

      {showEmojis && (
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-10 gap-1">
            {BIO_EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                disabled={!useCustom}
                className={`p-1.5 rounded-lg text-base hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/30 transition-colors ${
                  !useCustom ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                }`}
                title={useCustom ? 'Click to insert' : 'Switch to custom mode to insert emojis'}
              >
                {emoji}
              </button>
            ))}
          </div>
          {!useCustom && (
            <p className="text-[10px] text-slate-400 mt-2 text-center">Switch to &ldquo;Write Custom&rdquo; mode to insert emojis</p>
          )}
        </div>
      )}

      {/* Live Preview */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <platformInfo.icon className={`w-4 h-4 ${platformInfo.color}`} />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{platformInfo.name} Preview</span>
          </div>
          <span className={`text-[11px] font-mono font-bold ${isOverLimit ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
            {charCount}/{charLimit}
          </span>
        </div>

        {/* Character limit bar */}
        <div className="h-1 bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full transition-all duration-300 rounded-r-full ${
              isOverLimit ? 'bg-red-500' : charPercent > 80 ? 'bg-amber-500' : 'bg-fuchsia-500'
            }`}
            style={{ width: `${Math.min(charPercent, 100)}%` }}
          />
        </div>

        <div className="p-4">
          {bioText && !bioText.includes('[') ? (
            <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{bioText}</p>
          ) : bioText ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed italic">{bioText}</p>
          ) : (
            <p className="text-sm text-slate-400 italic">Your bio will appear here...</p>
          )}
        </div>

        {isOverLimit && (
          <div className="px-4 pb-3">
            <p className="text-[11px] text-red-500 font-medium">
              Over limit by {charCount - charLimit} characters. {platformInfo.name} will truncate your bio.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          disabled={!bioText}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all bg-fuchsia-600 hover:bg-fuchsia-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Bio</>}
        </button>
        <button
          onClick={handleFavorite}
          disabled={!bioText}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border disabled:opacity-40 disabled:cursor-not-allowed ${
            isFavorited
              ? 'bg-pink-50 dark:bg-pink-950/30 border-pink-300 dark:border-pink-700 text-pink-600 dark:text-pink-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-pink-300'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-pink-500 text-pink-500' : ''}`} />
        </button>
        {!useCustom && (
          <button
            onClick={handleShuffle}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-fuchsia-300"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div>
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2"
          >
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            Saved Bios ({favorites.length})
            {showFavorites ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {showFavorites && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {favorites.map((fav, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  <p className="flex-1 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{fav}</p>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(fav);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFavorite(fav)}
                      className="p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
