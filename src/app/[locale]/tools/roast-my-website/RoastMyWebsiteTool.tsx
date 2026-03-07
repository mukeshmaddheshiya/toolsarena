'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Globe,
  Upload,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  Trash2,
  Shield,
  ChevronDown,
  ChevronUp,
  History,
  Zap,
  Eye,
  Star,
  AlertTriangle,
  TrendingUp,
  Lock,
  Smartphone,
  Search,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChecklistItem {
  id: string;
  label: string;
  category: CategoryKey;
  weight: number;
}

type CategoryKey = 'seo' | 'performance' | 'design' | 'content' | 'security' | 'ux';

interface CategoryScore {
  score: number;
  roast: string;
  recommendations: string[];
}

interface URLAnalysis {
  length: number;
  isHTTPS: boolean;
  hasWWW: boolean;
  domainLength: number;
  hasHyphens: boolean;
  hasNumbers: boolean;
  tld: string;
  hasSubdomain: boolean;
  score: number;
}

interface RoastResult {
  url: string;
  overallScore: number;
  grade: string;
  gradeTitle: string;
  categories: Record<CategoryKey, CategoryScore>;
  urlAnalysis: URLAnalysis;
  timestamp: number;
}

interface HistoryEntry {
  url: string;
  score: number;
  grade: string;
  timestamp: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'ssl', label: 'Has SSL / HTTPS?', category: 'security', weight: 8 },
  { id: 'responsive', label: 'Mobile responsive?', category: 'ux', weight: 7 },
  { id: 'fast', label: 'Loads in < 3 seconds?', category: 'performance', weight: 8 },
  { id: 'favicon', label: 'Has favicon?', category: 'design', weight: 3 },
  { id: 'meta', label: 'Has meta description?', category: 'seo', weight: 7 },
  { id: 'og', label: 'Has Open Graph tags?', category: 'seo', weight: 5 },
  { id: 'sitemap', label: 'Has sitemap.xml?', category: 'seo', weight: 6 },
  { id: 'robots', label: 'Has robots.txt?', category: 'seo', weight: 5 },
  { id: 'semantic', label: 'Uses semantic HTML?', category: 'seo', weight: 5 },
  { id: 'alt', label: 'Has alt text on images?', category: 'seo', weight: 6 },
  { id: 'analytics', label: 'Has analytics installed?', category: 'performance', weight: 4 },
  { id: 'cta', label: 'Has clear CTA?', category: 'ux', weight: 6 },
  { id: 'contact', label: 'Has contact info?', category: 'content', weight: 5 },
  { id: 'privacy', label: 'Has privacy policy?', category: 'security', weight: 6 },
  { id: 'fonts', label: 'Uses custom fonts?', category: 'design', weight: 3 },
  { id: 'darkmode', label: 'Has dark mode?', category: 'design', weight: 3 },
  { id: 'social', label: 'Has social media links?', category: 'content', weight: 4 },
  { id: 'blog', label: 'Has blog / content section?', category: 'content', weight: 5 },
  { id: 'cookie', label: 'Cookie consent banner?', category: 'security', weight: 5 },
  { id: 'fourohfour', label: 'Has custom 404 page?', category: 'ux', weight: 4 },
];

const CATEGORY_META: Record<CategoryKey, { label: string; icon: typeof Flame; color: string }> = {
  seo: { label: 'SEO', icon: Search, color: '#f59e0b' },
  performance: { label: 'Performance', icon: Zap, color: '#3b82f6' },
  design: { label: 'Design', icon: Eye, color: '#a855f7' },
  content: { label: 'Content', icon: FileText, color: '#10b981' },
  security: { label: 'Security', icon: Lock, color: '#ef4444' },
  ux: { label: 'UX', icon: Smartphone, color: '#f97316' },
};

const ROAST_LINES: Record<CategoryKey, Record<string, string[]>> = {
  seo: {
    terrible: [
      "Google doesn't know your site exists. Congrats, you've achieved digital invisibility.",
      "Your SEO is so bad, even Bing won't index you.",
    ],
    bad: [
      "Search engines found your site... and immediately wished they hadn't.",
      "Your SEO strategy seems to be 'hope and pray.' Bold move.",
    ],
    okay: [
      "Your SEO is like a participation trophy -- present but not winning anything.",
      "Google acknowledges your existence. That's... something.",
    ],
    good: [
      "Solid SEO game! You actually read a blog post about it, didn't you?",
      "Your meta tags are looking fresh. Someone did their homework.",
    ],
    great: [
      "SEO masterclass! Google probably sends you a Christmas card.",
      "Your SEO is tighter than a drum. Search engines bow before you.",
    ],
  },
  performance: {
    terrible: [
      "Your site loads slower than a sloth on sedatives.",
      "I grew a beard waiting for your page to load. I'm female.",
    ],
    bad: [
      "Your load time gives users enough time to rethink their life choices.",
      "Dial-up internet users feel right at home on your site.",
    ],
    okay: [
      "It loads... eventually. Like waiting for your food at a busy restaurant.",
      "Not the fastest, not the slowest. The Honda Civic of websites.",
    ],
    good: [
      "Snappy performance! Your users actually get to see your content.",
      "Quick loading -- clearly someone cares about user experience.",
    ],
    great: [
      "Blazing fast! Your site loads before I even finish clicking.",
      "Speed demon! This thing is faster than my Wi-Fi.",
    ],
  },
  design: {
    terrible: [
      "Your design looks like it was created in MS Paint during an earthquake.",
      "This design screams 'my nephew built it for free.'",
    ],
    bad: [
      "Comic Sans would actually be an upgrade at this point.",
      "It's giving early-2000s Geocities energy. And not ironically.",
    ],
    okay: [
      "The design is... functional. Like a beige Toyota Camry.",
      "Not ugly, not pretty. Switzerland would be proud of this neutrality.",
    ],
    good: [
      "Actually looks pretty good! Someone has taste around here.",
      "Clean design! Your CSS skills are showing off.",
    ],
    great: [
      "Gorgeous design! Dribbble is leaking and I'm here for it.",
      "This is beautiful. Who hurt you enough to become this talented?",
    ],
  },
  content: {
    terrible: [
      "Your content is emptier than my fridge on a Sunday night.",
      "Where's the content? Did it go out for milk and never come back?",
    ],
    bad: [
      "Your content strategy is 'wing it.' Respect the honesty at least.",
      "The content is thinner than gas station coffee.",
    ],
    okay: [
      "You have content. Not great content, but content. Baby steps.",
      "Middle of the road content. Like a Wikipedia stub article.",
    ],
    good: [
      "Solid content game! You actually have something worth reading.",
      "Good stuff here! Your copywriter deserves a raise.",
    ],
    great: [
      "Content king/queen! Shakespeare would be taking notes.",
      "Your content is so good I forgot I was roasting you.",
    ],
  },
  security: {
    terrible: [
      "Your security is more open than a 24/7 convenience store. Hackers send thank-you cards.",
      "A toddler could hack this site. With a Fisher-Price laptop.",
    ],
    bad: [
      "Your security has more holes than Swiss cheese at a mouse convention.",
      "You're basically leaving the front door open with a 'welcome hackers' mat.",
    ],
    okay: [
      "Some security measures in place. You locked the front door but left the windows open.",
      "Partial security. Like wearing a seatbelt but no brakes.",
    ],
    good: [
      "Good security! You actually care about your users' data. Rare.",
      "Locked down nicely. Hackers will have to try harder.",
    ],
    great: [
      "Fort Knox vibes! Your security is tighter than airport customs.",
      "Maximum security! Even the NSA would need a minute.",
    ],
  },
  ux: {
    terrible: [
      "Using your site is like navigating a maze blindfolded. In the dark. On a unicycle.",
      "Your UX is a horror movie. Users enter and never return.",
    ],
    bad: [
      "Your users need a PhD just to find the navigation menu.",
      "The UX is so confusing, GPS couldn't help users navigate it.",
    ],
    okay: [
      "Usable, but barely. Like a TV remote with 200 buttons.",
      "Users can survive your site. Not enjoy it, but survive.",
    ],
    good: [
      "Smooth UX! Users can actually accomplish tasks. Revolutionary!",
      "Good user experience! You must have actually talked to real humans.",
    ],
    great: [
      "UX perfection! Apple would hire you on the spot.",
      "So intuitive my grandma could use it. And she still uses a flip phone.",
    ],
  },
};

const GRADE_TITLES: Record<string, string> = {
  'A+': 'Absolute Legend',
  A: 'Looking Fresh',
  B: 'Getting There',
  C: 'Needs CPR',
  D: 'Digital Dumpster Fire',
  F: 'Certified Disaster',
};

const OVERALL_ROASTS: Record<string, string[]> = {
  terrible: [
    "Your website looks like it was built during a power outage... blindfolded.",
    "I've seen better websites on the dark web. And I mean that literally.",
    "This site is a monument to human suffering. Whoever built this needs a hug.",
  ],
  bad: [
    "It's giving 2005 MySpace vibes. Not in a cool nostalgic way.",
    "Your website called. It wants to be put out of its misery.",
    "I've seen better user experiences at the DMV.",
  ],
  okay: [
    "Not terrible! Like a B- student who could do better but is too busy gaming.",
    "It's... fine. Like plain oatmeal. Functional but nobody's excited about it.",
    "Your website is the human-equivalent of 'meh.' It exists.",
  ],
  good: [
    "Okay, this is actually decent. Your developer deserves a raise. Or at least a coffee.",
    "Looking solid! You're in the top half of the internet, which is honestly an achievement.",
    "Not bad at all! A few tweaks and you'll be cooking with gas.",
  ],
  great: [
    "Sheesh! This site is cleaner than my apartment. Respect.",
    "Absolute fire! Did a team of caffeinated wizards build this?",
    "I came here to roast, but honestly... I'm impressed. Don't let it go to your head.",
  ],
};

// ─── Utility Functions ──────────────────────────────────────────────────────

function analyzeURL(url: string): URLAnalysis {
  let parsed: URL;
  try {
    parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
  } catch {
    return {
      length: url.length,
      isHTTPS: false,
      hasWWW: false,
      domainLength: url.length,
      hasHyphens: false,
      hasNumbers: false,
      tld: '',
      hasSubdomain: false,
      score: 20,
    };
  }

  const hostname = parsed.hostname;
  const isHTTPS = parsed.protocol === 'https:';
  const hasWWW = hostname.startsWith('www.');
  const domainParts = hostname.replace('www.', '').split('.');
  const domainName = domainParts[0];
  const tld = domainParts.slice(1).join('.');
  const hasHyphens = domainName.includes('-');
  const hasNumbers = /\d/.test(domainName);
  const hasSubdomain = domainParts.length > 2 && !hasWWW;

  let score = 100;
  if (!isHTTPS) score -= 25;
  if (domainName.length > 15) score -= 15;
  else if (domainName.length > 10) score -= 5;
  if (hasHyphens) score -= 10;
  if (hasNumbers) score -= 5;
  if (hasSubdomain) score -= 5;
  if (url.length > 50) score -= 10;
  if (tld !== 'com' && tld !== 'org' && tld !== 'io' && tld !== 'dev' && tld !== 'in') score -= 5;

  return {
    length: url.length,
    isHTTPS,
    hasWWW,
    domainLength: domainName.length,
    hasHyphens,
    hasNumbers,
    tld,
    hasSubdomain,
    score: Math.max(0, Math.min(100, score)),
  };
}

function getScoreTier(score: number): string {
  if (score < 30) return 'terrible';
  if (score < 50) return 'bad';
  if (score < 70) return 'okay';
  if (score < 85) return 'good';
  return 'great';
}

function getGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 45) return 'C';
  if (score >= 30) return 'D';
  return 'F';
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRecommendations(category: CategoryKey, score: number): string[] {
  const recs: Record<CategoryKey, string[]> = {
    seo: [
      score < 60 ? 'Add meta descriptions to every page' : '',
      score < 70 ? 'Create and submit a sitemap.xml' : '',
      score < 50 ? 'Add alt text to all images for accessibility and SEO' : '',
      score < 80 ? 'Implement Open Graph tags for better social sharing' : '',
      score < 40 ? 'Add a robots.txt file to guide search engine crawlers' : '',
      score < 60 ? 'Use semantic HTML5 elements (header, nav, main, footer)' : '',
    ],
    performance: [
      score < 60 ? 'Optimize and compress all images (use WebP format)' : '',
      score < 70 ? 'Enable browser caching and GZIP compression' : '',
      score < 50 ? 'Minimize render-blocking JavaScript and CSS' : '',
      score < 80 ? 'Set up performance monitoring with analytics' : '',
      score < 40 ? 'Consider using a CDN for static assets' : '',
    ],
    design: [
      score < 60 ? 'Add a favicon -- it is the tiny details that matter' : '',
      score < 50 ? 'Consider implementing a dark mode option' : '',
      score < 70 ? 'Use a consistent typography system with custom fonts' : '',
      score < 80 ? 'Ensure consistent spacing and visual hierarchy' : '',
    ],
    content: [
      score < 60 ? 'Add a blog or content section to establish authority' : '',
      score < 50 ? 'Include social media links for cross-platform presence' : '',
      score < 70 ? 'Add visible contact information to build trust' : '',
      score < 80 ? 'Create compelling, value-driven content for your audience' : '',
    ],
    security: [
      score < 50 ? 'Enable HTTPS immediately -- this is non-negotiable' : '',
      score < 60 ? 'Add a cookie consent banner for GDPR compliance' : '',
      score < 70 ? 'Create and link a privacy policy page' : '',
      score < 80 ? 'Implement Content Security Policy headers' : '',
    ],
    ux: [
      score < 60 ? 'Make your site fully mobile responsive' : '',
      score < 50 ? 'Add a clear call-to-action on your homepage' : '',
      score < 70 ? 'Create a custom 404 page to retain lost visitors' : '',
      score < 80 ? 'Improve navigation clarity and reduce clicks to content' : '',
    ],
  };
  return recs[category].filter(Boolean).slice(0, 3);
}

function computeResult(
  url: string,
  checkedItems: Set<string>,
  urlAnalysis: URLAnalysis
): RoastResult {
  const categoryScores: Record<CategoryKey, number> = {
    seo: 0,
    performance: 0,
    design: 0,
    content: 0,
    security: 0,
    ux: 0,
  };
  const categoryMaxes: Record<CategoryKey, number> = {
    seo: 0,
    performance: 0,
    design: 0,
    content: 0,
    security: 0,
    ux: 0,
  };

  for (const item of CHECKLIST_ITEMS) {
    categoryMaxes[item.category] += item.weight;
    if (checkedItems.has(item.id)) {
      categoryScores[item.category] += item.weight;
    }
  }

  const categories: Record<CategoryKey, CategoryScore> = {} as Record<CategoryKey, CategoryScore>;
  let totalWeighted = 0;
  let totalMax = 0;

  for (const key of Object.keys(categoryScores) as CategoryKey[]) {
    const max = categoryMaxes[key] || 1;
    let raw = Math.round((categoryScores[key] / max) * 100);

    // Blend URL analysis into SEO and security
    if (key === 'seo') raw = Math.round(raw * 0.7 + urlAnalysis.score * 0.3);
    if (key === 'security') {
      const sslBonus = urlAnalysis.isHTTPS ? 15 : -15;
      raw = Math.min(100, Math.max(0, raw + sslBonus));
    }

    const tier = getScoreTier(raw);
    categories[key] = {
      score: raw,
      roast: pickRandom(ROAST_LINES[key][tier]),
      recommendations: getRecommendations(key, raw),
    };
    totalWeighted += raw;
    totalMax += 100;
  }

  const overallScore = Math.round((totalWeighted / totalMax) * 100);
  const grade = getGrade(overallScore);
  const gradeTitle = GRADE_TITLES[grade] || 'Unknown';

  return {
    url,
    overallScore,
    grade,
    gradeTitle,
    categories,
    urlAnalysis,
    timestamp: Date.now(),
  };
}

// ─── Circular Gauge Component ────────────────────────────────────────────────

function CircularGauge({ score, size = 180 }: { score: number; size?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1500;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const color =
    animatedScore >= 85
      ? '#22c55e'
      : animatedScore >= 70
        ? '#84cc16'
        : animatedScore >= 50
          ? '#f59e0b'
          : animatedScore >= 30
            ? '#f97316'
            : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1f2937"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke 0.3s' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black" style={{ color }}>
          {animatedScore}
        </span>
        <span className="text-xs text-gray-400 uppercase tracking-wider">/ 100</span>
      </div>
    </div>
  );
}

// ─── Fire Particles ──────────────────────────────────────────────────────────

function FireParticles({ intensity }: { intensity: number }) {
  const count = Math.max(3, Math.round(intensity / 10));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-orange-400 text-lg"
          initial={{
            x: `${20 + Math.random() * 60}%`,
            y: '100%',
            opacity: 0.8,
            scale: 0.5 + Math.random() * 0.5,
          }}
          animate={{
            y: '-10%',
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeOut',
          }}
        >
          <Flame className="w-4 h-4" />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Category Card ───────────────────────────────────────────────────────────

function CategoryCard({
  categoryKey,
  data,
  delay,
}: {
  categoryKey: CategoryKey;
  data: CategoryScore;
  delay: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const meta = CATEGORY_META[categoryKey];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="cursor-pointer perspective-1000"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
        }}
      >
        {/* Front */}
        <div
          className="rounded-xl border border-gray-700/50 p-5 bg-gray-800/80 backdrop-blur"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5" style={{ color: meta.color }} />
              <span className="font-semibold text-white">{meta.label}</span>
            </div>
            <span
              className="text-2xl font-black"
              style={{ color: meta.color }}
            >
              {data.score}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-3">
            <motion.div
              className="h-2.5 rounded-full"
              style={{ backgroundColor: meta.color }}
              initial={{ width: 0 }}
              animate={{ width: `${data.score}%` }}
              transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-sm text-gray-300 italic leading-relaxed">
            &quot;{data.roast}&quot;
          </p>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <ChevronDown className="w-3 h-3" /> Click to see recommendations
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl border border-gray-700/50 p-5 bg-gray-800/80 backdrop-blur"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Icon className="w-5 h-5" style={{ color: meta.color }} />
            <span className="font-semibold text-white">{meta.label} - Recommendations</span>
          </div>
          {data.recommendations.length > 0 ? (
            <ul className="space-y-2">
              {data.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <TrendingUp className="w-4 h-4 mt-0.5 text-green-400 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Star className="w-4 h-4" /> All good here! Keep up the great work.
            </div>
          )}
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
            <ChevronUp className="w-3 h-3" /> Click to flip back
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function RoastMyWebsiteTool() {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<RoastResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('roast-history');
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const saveToHistory = useCallback(
    (entry: HistoryEntry) => {
      const updated = [entry, ...history].slice(0, 5);
      setHistory(updated);
      try {
        localStorage.setItem('roast-history', JSON.stringify(updated));
      } catch {
        /* ignore */
      }
    },
    [history]
  );

  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setUrlError('Please enter a URL');
      return false;
    }
    const urlPattern =
      /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i;
    if (!urlPattern.test(value.trim())) {
      setUrlError('Please enter a valid URL (e.g., example.com)');
      return false;
    }
    setUrlError('');
    return true;
  };

  const handleAnalyze = () => {
    if (!validateUrl(url)) return;
    setIsAnalyzing(true);
    setResult(null);

    // Simulate analysis delay for dramatic effect
    setTimeout(() => {
      const urlAnalysis = analyzeURL(url);
      const roastResult = computeResult(url, checkedItems, urlAnalysis);
      setResult(roastResult);
      setIsAnalyzing(false);
      saveToHistory({
        url: roastResult.url,
        score: roastResult.overallScore,
        grade: roastResult.grade,
        timestamp: roastResult.timestamp,
      });
      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }, 2000);
  };

  const handleReset = () => {
    setUrl('');
    setUrlError('');
    setScreenshot(null);
    setCheckedItems(new Set());
    setResult(null);
    setIsAnalyzing(false);
    setCopied(false);
  };

  const handleTryExample = () => {
    setUrl('https://example.com');
    const exampleChecked = new Set([
      'ssl',
      'responsive',
      'meta',
      'robots',
      'alt',
      'contact',
      'privacy',
      'fourohfour',
    ]);
    setCheckedItems(exampleChecked);
    setScreenshot(null);
  };

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setCheckedItems(new Set(CHECKLIST_ITEMS.map((i) => i.id)));
  };

  const handleDeselectAll = () => {
    setCheckedItems(new Set());
  };

  // Screenshot handling
  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshot(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  // Export as PNG
  const handleExportPNG = async () => {
    if (!resultRef.current) return;
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#111827',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `roast-${url.replace(/[^a-z0-9]/gi, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      /* ignore */
    }
  };

  // Copy result summary
  const handleCopy = () => {
    if (!result) return;
    const text = `Website Roast: ${result.url}\nScore: ${result.overallScore}/100 (${result.grade})\nTitle: ${result.gradeTitle}\n\n${Object.entries(result.categories)
      .map(
        ([key, cat]) =>
          `${CATEGORY_META[key as CategoryKey].label}: ${cat.score}/100 - "${cat.roast}"`
      )
      .join('\n')}\n\nRoasted at ToolsArena`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const overallTier = result ? getScoreTier(result.overallScore) : 'okay';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4"
        >
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-medium text-orange-300">
            Brutally Honest Website Feedback
          </span>
        </motion.div>
      </div>

      {/* URL Input */}
      <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-6 space-y-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Enter your website URL
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (urlError) validateUrl(e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="https://yourwebsite.com"
              className={`w-full pl-10 pr-4 py-3 bg-gray-900/80 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                urlError
                  ? 'border-red-500 focus:ring-red-500/40'
                  : 'border-gray-600 focus:ring-orange-500/40 focus:border-orange-500'
              }`}
            />
          </div>
          <button
            onClick={handleTryExample}
            className="px-4 py-3 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all text-sm whitespace-nowrap"
          >
            Try Example
          </button>
        </div>
        {urlError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> {urlError}
          </motion.p>
        )}
      </div>

      {/* Screenshot Upload */}
      <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Upload a screenshot (optional, for reference)
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-orange-400 bg-orange-500/10'
              : screenshot
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
          {screenshot ? (
            <div className="space-y-3">
              <div className="flex justify-center">
                <img
                  src={screenshot}
                  alt="Website screenshot"
                  className="max-h-48 rounded-lg border border-gray-600 object-contain"
                />
              </div>
              <p className="text-green-400 text-sm flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Screenshot uploaded
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setScreenshot(null);
                }}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-10 h-10 text-gray-500 mx-auto" />
              <p className="text-gray-400 text-sm">
                Drag & drop a screenshot here, or click to browse
              </p>
              <p className="text-gray-500 text-xs">PNG, JPG, WebP supported</p>
            </div>
          )}
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-semibold text-white text-lg">Quick Audit Checklist</h3>
            <p className="text-sm text-gray-400">
              Answer honestly -- the roast depends on it ({checkedItems.size}/{CHECKLIST_ITEMS.length})
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 text-xs border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-3 py-1.5 text-xs border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = checkedItems.has(item.id);
            const meta = CATEGORY_META[item.category];
            return (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                  isChecked
                    ? 'border-green-500/40 bg-green-500/10'
                    : 'border-gray-700/50 bg-gray-900/40 hover:bg-gray-700/30'
                }`}
              >
                {isChecked ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-500 shrink-0" />
                )}
                <span className={`text-sm ${isChecked ? 'text-white' : 'text-gray-400'}`}>
                  {item.label}
                </span>
                <span
                  className="ml-auto text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{
                    color: meta.color,
                    backgroundColor: `${meta.color}20`,
                  }}
                >
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20"
        >
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Flame className="w-5 h-5" />
              </motion.div>
              Roasting...
            </>
          ) : (
            <>
              <Flame className="w-5 h-5" /> Roast My Website
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 py-3.5 px-6 border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-xl transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-center gap-2 py-3.5 px-6 border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-xl transition-all"
        >
          <History className="w-4 h-4" /> History
        </button>
      </div>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-gray-400" /> Recent Roasts
              </h3>
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">No roasts yet. Go roast something!</p>
              ) : (
                <div className="space-y-2">
                  {history.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`text-lg font-black ${
                            entry.score >= 70
                              ? 'text-green-400'
                              : entry.score >= 45
                                ? 'text-yellow-400'
                                : 'text-red-400'
                          }`}
                        >
                          {entry.grade}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm text-white truncate">{entry.url}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(entry.timestamp).toLocaleDateString()} &middot; Score:{' '}
                            {entry.score}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setUrl(entry.url);
                          setShowHistory(false);
                        }}
                        className="text-xs text-orange-400 hover:text-orange-300 transition-colors shrink-0 ml-2"
                      >
                        Re-roast
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem('roast-history');
                }}
                className="mt-3 text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear history
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyzing Animation */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-800/80 border border-orange-500/30 rounded-2xl p-10 text-center relative overflow-hidden"
          >
            <FireParticles intensity={80} />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <Flame className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            </motion.div>
            <p className="text-xl font-bold text-white mb-2">Firing up the roast...</p>
            <p className="text-gray-400 text-sm">
              Analyzing URL, cross-checking your answers, preparing the burns...
            </p>
            <div className="mt-4 w-48 mx-auto bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            ref={resultRef}
            className="space-y-6"
          >
            {/* Overall Score Card */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-8 relative overflow-hidden">
              <FireParticles
                intensity={result.overallScore < 40 ? 90 : result.overallScore < 70 ? 50 : 20}
              />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-4">
                  <CircularGauge score={result.overallScore} size={180} />
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className={`text-5xl font-black mb-1 ${
                    result.overallScore >= 85
                      ? 'text-green-400'
                      : result.overallScore >= 70
                        ? 'text-lime-400'
                        : result.overallScore >= 50
                          ? 'text-yellow-400'
                          : result.overallScore >= 30
                            ? 'text-orange-400'
                            : 'text-red-400'
                  }`}
                >
                  {result.grade}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-lg font-semibold text-gray-300 mb-4"
                >
                  {result.gradeTitle}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="text-gray-400 italic max-w-lg leading-relaxed"
                >
                  &quot;{pickRandom(OVERALL_ROASTS[overallTier])}&quot;
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="flex items-center gap-2 mt-4 text-sm text-gray-500"
                >
                  <Globe className="w-4 h-4" />
                  <span className="truncate max-w-xs">{result.url}</span>
                  <ExternalLink className="w-3 h-3" />
                </motion.div>
              </div>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.keys(result.categories) as CategoryKey[]).map((key, i) => (
                <CategoryCard
                  key={key}
                  categoryKey={key}
                  data={result.categories[key]}
                  delay={0.3 + i * 0.15}
                />
              ))}
            </div>

            {/* URL Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-400" /> URL Analysis
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <URLBadge
                  label="HTTPS"
                  value={result.urlAnalysis.isHTTPS ? 'Yes' : 'No'}
                  good={result.urlAnalysis.isHTTPS}
                />
                <URLBadge
                  label="URL Length"
                  value={`${result.urlAnalysis.length} chars`}
                  good={result.urlAnalysis.length <= 50}
                />
                <URLBadge
                  label="Domain Length"
                  value={`${result.urlAnalysis.domainLength} chars`}
                  good={result.urlAnalysis.domainLength <= 15}
                />
                <URLBadge
                  label="Hyphens"
                  value={result.urlAnalysis.hasHyphens ? 'Yes' : 'No'}
                  good={!result.urlAnalysis.hasHyphens}
                />
                <URLBadge
                  label="Numbers"
                  value={result.urlAnalysis.hasNumbers ? 'Yes' : 'No'}
                  good={!result.urlAnalysis.hasNumbers}
                />
                <URLBadge
                  label="TLD"
                  value={`.${result.urlAnalysis.tld}`}
                  good={['com', 'org', 'io', 'dev', 'in'].includes(result.urlAnalysis.tld)}
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-400">URL Score:</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-orange-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.urlAnalysis.score}%` }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                  />
                </div>
                <span className="text-sm font-semibold text-orange-400">
                  {result.urlAnalysis.score}/100
                </span>
              </div>
            </motion.div>

            {/* Screenshot Reference */}
            {screenshot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-6"
              >
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-400" /> Your Screenshot
                </h3>
                <img
                  src={screenshot}
                  alt="Website screenshot reference"
                  className="rounded-lg border border-gray-600 max-h-64 object-contain mx-auto"
                />
              </motion.div>
            )}

            {/* Action Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              <button
                onClick={handleExportPNG}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors text-sm"
              >
                <Download className="w-4 h-4" /> Save as PNG
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Summary
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-600 text-gray-300 hover:bg-gray-700/50 rounded-xl transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Roast Another
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Shield className="w-3.5 h-3.5" />
        <span>All analysis runs locally in your browser. No data is sent to any server.</span>
      </div>
    </div>
  );
}

// ─── URL Badge Sub-Component ─────────────────────────────────────────────────

function URLBadge({
  label,
  value,
  good,
}: {
  label: string;
  value: string;
  good: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 text-center ${
        good
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-red-500/30 bg-red-500/5'
      }`}
    >
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p
        className={`text-sm font-semibold ${
          good ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
