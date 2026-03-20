'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Copy, Heart, RefreshCw, Check, Globe, Trash2 } from 'lucide-react';

type Industry = 'tech' | 'food' | 'fashion' | 'health' | 'finance' | 'education' | 'retail' | 'services';
type Style = 'modern' | 'traditional' | 'funny' | 'professional' | 'minimalist';

interface GeneratedName {
  name: string;
  domain: string;
  technique: string;
}

const INDUSTRY_LABELS: Record<Industry, string> = {
  tech: 'Tech / Software',
  food: 'Food & Beverage',
  fashion: 'Fashion & Apparel',
  health: 'Health & Wellness',
  finance: 'Finance & Banking',
  education: 'Education',
  retail: 'Retail & E-commerce',
  services: 'Services & Consulting',
};

const STYLE_LABELS: Record<Style, string> = {
  modern: 'Modern',
  traditional: 'Traditional',
  funny: 'Funny & Playful',
  professional: 'Professional',
  minimalist: 'Minimalist',
};

// Prefixes by industry
const PREFIXES: Record<Industry, string[]> = {
  tech: ['Nexus', 'Zync', 'Kode', 'Byte', 'Nova', 'Pixel', 'Algo', 'Cloud', 'Swift', 'Forge'],
  food: ['Spice', 'Masala', 'Fresh', 'Zest', 'Flavour', 'Naan', 'Curry', 'Chai', 'Aroma', 'Harvest'],
  fashion: ['Vogue', 'Drape', 'Stitch', 'Loom', 'Hem', 'Silk', 'Bloom', 'Chic', 'Weave', 'Thread'],
  health: ['Vital', 'Zen', 'Heal', 'Pure', 'Life', 'Care', 'Fit', 'Well', 'Calm', 'Thrive'],
  finance: ['Wealth', 'Coin', 'Fund', 'Trust', 'Capital', 'Credit', 'Finsure', 'Prosper', 'Asset', 'Sterling'],
  education: ['Learn', 'Edu', 'Scholar', 'Bright', 'Mind', 'Guru', 'Vidya', 'Smart', 'Excel', 'Inspire'],
  retail: ['Bazaar', 'Cart', 'Shop', 'Mart', 'Trade', 'Market', 'Deal', 'Pick', 'Grab', 'Store'],
  services: ['Prime', 'Pro', 'Expert', 'Skill', 'Serve', 'Help', 'Assist', 'Guide', 'Spark', 'Able'],
};

// Suffixes by industry
const SUFFIXES: Record<Industry, string[]> = {
  tech: ['Labs', 'Tech', 'AI', 'Hub', 'Ware', 'Stack', 'Net', 'Works', 'IO', 'Base'],
  food: ['Kitchen', 'Bites', 'Feast', 'Delight', 'Box', 'Basket', 'House', 'Express', 'Corner', 'Table'],
  fashion: ['Studio', 'Boutique', 'Wear', 'Closet', 'Threads', 'Co', 'Label', 'House', 'Atelier', 'Design'],
  health: ['Clinic', 'Care', 'Wellness', 'Life', 'Labs', 'Cure', 'Health', 'Plus', 'Zone', 'Path'],
  finance: ['Corp', 'Solutions', 'Advisors', 'Partners', 'Group', 'Finance', 'Capital', 'Holdings', 'Fund', 'Invest'],
  education: ['Academy', 'Institute', 'School', 'Classes', 'Learning', 'Training', 'Centre', 'Campus', 'Pathshala', 'Edu'],
  retail: ['Emporium', 'Store', 'Hub', 'World', 'Zone', 'Place', 'Point', 'Space', 'Online', 'Direct'],
  services: ['Solutions', 'Services', 'Agency', 'Consultants', 'Associates', 'Group', 'Team', 'Works', 'Partners', 'Plus'],
};

// Style modifiers — words that reflect the style
const STYLE_WORDS: Record<Style, string[]> = {
  modern: ['Neo', 'Flux', 'Dash', 'Sync', 'Zap', 'Leap', 'Wave', 'Grid', 'Flow', 'Peak'],
  traditional: ['Shree', 'Laxmi', 'Ganesh', 'Bharat', 'Desh', 'Ravi', 'Vastu', 'Siddhi', 'Kiran', 'Jai'],
  funny: ['Wacky', 'Zany', 'Oops', 'Quirk', 'Jolly', 'Funky', 'Fizz', 'Boop', 'Tickle', 'Giggle'],
  professional: ['Premier', 'Elite', 'Sterling', 'Pinnacle', 'Apex', 'Summit', 'Prestige', 'Axiom', 'Vanguard', 'Acumen'],
  minimalist: ['One', 'Base', 'Form', 'Arc', 'Core', 'Dot', 'Line', 'Edge', 'Nix', 'Raw'],
};

const FAVORITES_KEY = 'toolsarena_bizname_favorites';

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function toCamelCase(words: string[]): string {
  return words.map(capitalize).join('');
}

function toDomainSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function generateNames(keywords: string[], industry: Industry, style: Style): GeneratedName[] {
  const names: GeneratedName[] = [];
  const prefixes = PREFIXES[industry];
  const suffixes = SUFFIXES[industry];
  const styleWords = STYLE_WORDS[style];
  const kws = keywords.filter(k => k.trim().length > 0).map(k => capitalize(k.trim()));
  const kw0 = kws[0] || 'Prime';
  const kw1 = kws[1] || prefixes[3];
  const kw2 = kws[2] || suffixes[2];

  const candidates: Array<{ name: string; technique: string }> = [];

  // Prefix + keyword
  prefixes.slice(0, 5).forEach(p => {
    candidates.push({ name: p + kw0, technique: 'Prefix + Keyword' });
  });

  // Keyword + suffix
  suffixes.slice(0, 5).forEach(s => {
    candidates.push({ name: kw0 + s, technique: 'Keyword + Suffix' });
  });

  // Style word + keyword
  styleWords.slice(0, 3).forEach(sw => {
    candidates.push({ name: sw + kw0, technique: 'Style + Keyword' });
  });

  // Keyword + style word
  styleWords.slice(3, 6).forEach(sw => {
    candidates.push({ name: kw0 + sw, technique: 'Keyword + Style' });
  });

  // Compound: kw0 + kw1
  if (kws.length >= 2) {
    candidates.push({ name: toCamelCase([kw0, kw1]), technique: 'Compound Word' });
    candidates.push({ name: kw0 + '&' + kw1, technique: 'Compound Word' });
  }

  // Triple compound
  if (kws.length >= 3) {
    candidates.push({ name: toCamelCase([kw0, kw1, kw2]), technique: 'Triple Compound' });
  }

  // Alliteration: prefix starting with same letter as keyword
  const kw0Letter = kw0.charAt(0).toLowerCase();
  const alliPrefixes = prefixes.filter(p => p.toLowerCase().startsWith(kw0Letter));
  if (alliPrefixes.length > 0) {
    candidates.push({ name: alliPrefixes[0] + ' ' + kw0, technique: 'Alliteration' });
  }

  // Abbreviation style
  if (kws.length >= 2) {
    const abbr = kws.map(k => k.charAt(0).toUpperCase()).join('') + suffixes[0];
    candidates.push({ name: abbr, technique: 'Abbreviation' });
  }

  // Prefix + suffix (industry blend)
  prefixes.slice(5, 8).forEach((p, i) => {
    candidates.push({ name: p + suffixes[i + 1], technique: 'Industry Blend' });
  });

  // Drop vowel / tech style
  const techName = kw0.replace(/[aeiou]/gi, '').slice(0, 6) + 'ify';
  candidates.push({ name: capitalize(techName), technique: 'Tech Style' });

  // Add "ify" / "ly" / "io" variations
  candidates.push({ name: kw0 + 'ify', technique: 'Trendy Suffix' });
  candidates.push({ name: kw0 + 'ly', technique: 'Trendy Suffix' });
  candidates.push({ name: kw0 + 'io', technique: 'Modern TLD Style' });

  // Deduplicate and take first 20
  const seen = new Set<string>();
  for (const c of candidates) {
    const clean = c.name.replace(/\s+/g, ' ').trim();
    if (clean.length < 3 || seen.has(clean.toLowerCase())) continue;
    seen.add(clean.toLowerCase());
    const slug = toDomainSlug(clean);
    names.push({
      name: clean,
      domain: `${slug}.com / ${slug}.in / ${slug}.co.in`,
      technique: c.technique,
    });
    if (names.length >= 20) break;
  }

  return names;
}

export function BusinessNameGeneratorTool() {
  const [kw1, setKw1] = useState('');
  const [kw2, setKw2] = useState('');
  const [kw3, setKw3] = useState('');
  const [industry, setIndustry] = useState<Industry>('tech');
  const [style, setStyle] = useState<Style>('modern');
  const [names, setNames] = useState<GeneratedName[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedName, setCopiedName] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites, loaded]);

  function generate() {
    setError('');
    if (!kw1.trim()) {
      setError('Please enter at least one keyword.');
      return;
    }
    const keywords = [kw1, kw2, kw3].filter(k => k.trim().length > 0);
    setNames(generateNames(keywords, industry, style));
  }

  function copyName(name: string) {
    navigator.clipboard.writeText(name).then(() => {
      setCopiedName(name);
      setTimeout(() => setCopiedName(''), 2000);
    });
  }

  function toggleFavorite(name: string) {
    setFavorites(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
          <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Business Name Generator</h2>
          <p className="text-xs text-gray-500">For India and Nepal startups — 20 names in seconds</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Keywords (up to 3)</label>
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Keyword 1 *"
              value={kw1}
              onChange={e => setKw1(e.target.value)}
              maxLength={20}
              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              placeholder="Keyword 2"
              value={kw2}
              onChange={e => setKw2(e.target.value)}
              maxLength={20}
              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              placeholder="Keyword 3"
              value={kw3}
              onChange={e => setKw3(e.target.value)}
              maxLength={20}
              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Industry</label>
            <select
              value={industry}
              onChange={e => setIndustry(e.target.value as Industry)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {(Object.keys(INDUSTRY_LABELS) as Industry[]).map(ind => (
                <option key={ind} value={ind}>{INDUSTRY_LABELS[ind]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Naming Style</label>
            <select
              value={style}
              onChange={e => setStyle(e.target.value as Style)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {(Object.keys(STYLE_LABELS) as Style[]).map(s => (
                <option key={s} value={s}>{STYLE_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          onClick={generate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Generate 20 Names
        </button>
      </div>

      {/* Generated names */}
      {names.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Generated Names</h3>
            <span className="text-xs text-gray-400">{names.length} names · click heart to save</span>
          </div>
          <div className="space-y-2">
            {names.map((item, i) => {
              const isFav = favorites.includes(item.name);
              const isCopied = copiedName === item.name;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all group"
                >
                  <span className="text-xs text-gray-300 dark:text-gray-600 w-5 flex-shrink-0 font-medium">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-base">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Globe className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-400 truncate">{item.domain}</p>
                    </div>
                    <span className="inline-block text-xs bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded mt-1">{item.technique}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => copyName(item.name)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                      title="Copy name"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => toggleFavorite(item.name)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                      title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <Heart className={'w-4 h-4 ' + (isFav ? 'fill-red-500 text-red-500' : '')} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 text-center">
            Domain hints are not live checks. Verify availability at any domain registrar.
          </p>
        </div>
      )}

      {/* Saved favorites */}
      {favorites.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-red-800 dark:text-red-300 flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-red-500 text-red-500" /> Saved Names ({favorites.length})
            </h3>
            <button
              onClick={() => setFavorites([])}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites.map(name => (
              <div key={name} className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-lg px-2.5 py-1.5">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{name}</span>
                <button
                  onClick={() => copyName(name)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="Copy"
                >
                  {copiedName === name ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => toggleFavorite(name)}
                  className="text-red-300 hover:text-red-500 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
