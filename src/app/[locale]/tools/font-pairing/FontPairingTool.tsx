'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Copy,
  Check,
  Shuffle,
  ArrowLeft,
  Sun,
  Moon,
  Filter,
  Code,
  Link,
  Layers,
  X,
} from 'lucide-react';

/* ────────────────────────────── Types ────────────────────────────── */

type StyleCategory = 'Modern' | 'Classic' | 'Elegant' | 'Playful' | 'Technical' | 'Minimal' | 'Bold' | 'Warm';
type UseCase = 'Blog' | 'Portfolio' | 'SaaS' | 'E-commerce' | 'Agency' | 'Documentation' | 'Magazine' | 'Landing Page' | 'Corporate';

interface FontPair {
  id: number;
  heading: string;
  body: string;
  category: StyleCategory;
  useCase: UseCase;
  description: string;
}

/* ────────────────────────────── Data ─────────────────────────────── */

const FONT_PAIRS: FontPair[] = [
  { id: 1, heading: 'Playfair Display', body: 'Source Sans 3', category: 'Elegant', useCase: 'Blog', description: 'A sophisticated serif paired with a clean humanist sans-serif. Perfect for editorial and lifestyle content.' },
  { id: 2, heading: 'Space Grotesk', body: 'Inter', category: 'Modern', useCase: 'SaaS', description: 'Geometric precision meets neutral readability. Ideal for tech products and dashboards.' },
  { id: 3, heading: 'Montserrat', body: 'Merriweather', category: 'Classic', useCase: 'Portfolio', description: 'Bold geometric headings with a warm readable serif body. A timeless professional combination.' },
  { id: 4, heading: 'Bebas Neue', body: 'Open Sans', category: 'Bold', useCase: 'Agency', description: 'Condensed uppercase impact with a friendly neutral body. Commands attention instantly.' },
  { id: 5, heading: 'Lora', body: 'Nunito', category: 'Warm', useCase: 'Blog', description: 'Elegant calligraphic serif with a rounded, friendly sans-serif. Inviting and approachable.' },
  { id: 6, heading: 'JetBrains Mono', body: 'IBM Plex Sans', category: 'Technical', useCase: 'Documentation', description: 'Developer-loved monospace paired with IBM\'s corporate sans. Built for technical writing.' },
  { id: 7, heading: 'DM Serif Display', body: 'DM Sans', category: 'Minimal', useCase: 'E-commerce', description: 'A refined display serif with its sans-serif sibling. Cohesive and modern minimalism.' },
  { id: 8, heading: 'Outfit', body: 'Crimson Pro', category: 'Modern', useCase: 'Magazine', description: 'Contemporary geometric sans with a refined serif. Editorial elegance meets modern design.' },
  { id: 9, heading: 'Poppins', body: 'Lora', category: 'Modern', useCase: 'Landing Page', description: 'Geometric perfection paired with organic serifs. Friendly yet professional.' },
  { id: 10, heading: 'Oswald', body: 'Quattrocento', category: 'Bold', useCase: 'Agency', description: 'Condensed neo-gothic headings with old-style serif body. Strong contrast and high impact.' },
  { id: 11, heading: 'Raleway', body: 'Roboto', category: 'Minimal', useCase: 'SaaS', description: 'Elegant thin sans-serif with Google\'s versatile workhorse. Clean and functional.' },
  { id: 12, heading: 'Cormorant Garamond', body: 'Fira Sans', category: 'Elegant', useCase: 'Portfolio', description: 'Display Garamond with a Mozilla-designed sans. Luxurious headings with technical precision.' },
  { id: 13, heading: 'Archivo Black', body: 'Libre Baskerville', category: 'Bold', useCase: 'Magazine', description: 'Powerful grotesque headlines over classic Baskerville. Editorial drama at its finest.' },
  { id: 14, heading: 'Sora', body: 'Noto Serif', category: 'Modern', useCase: 'Corporate', description: 'A variable geometric sans with universal serif coverage. Professional and globally ready.' },
  { id: 15, heading: 'Fraunces', body: 'Commissioner', category: 'Playful', useCase: 'Blog', description: 'A quirky soft-serif with a smooth variable sans. Personality-rich and expressive.' },
  { id: 16, heading: 'Plus Jakarta Sans', body: 'Literata', category: 'Modern', useCase: 'E-commerce', description: 'A premium modern sans with a book-optimized serif. Polished and contemporary.' },
  { id: 17, heading: 'Bitter', body: 'Source Sans 3', category: 'Classic', useCase: 'Documentation', description: 'Screen-optimized slab serif with a humanist sans body. Excellent readability at all sizes.' },
  { id: 18, heading: 'Cabin', body: 'Old Standard TT', category: 'Warm', useCase: 'Portfolio', description: 'Humanist sans headings with a classical didone body. Warm modernity meets tradition.' },
  { id: 19, heading: 'Righteous', body: 'Quicksand', category: 'Playful', useCase: 'Landing Page', description: 'Retro-futuristic display with rounded geometric sans. Fun, bold, and memorable.' },
  { id: 20, heading: 'Philosopher', body: 'Mulish', category: 'Elegant', useCase: 'Blog', description: 'An intellectual serif-inspired sans with a versatile body font. Thoughtful and refined.' },
  { id: 21, heading: 'Rubik', body: 'Karla', category: 'Minimal', useCase: 'SaaS', description: 'Rounded corners meet grotesque charm. Approachable and modern for product interfaces.' },
  { id: 22, heading: 'Vollkorn', body: 'Lato', category: 'Classic', useCase: 'Corporate', description: 'A warm book serif with a friendly corporate sans. Trustworthy and authoritative.' },
  { id: 23, heading: 'Libre Caslon Display', body: 'Libre Franklin', category: 'Elegant', useCase: 'Magazine', description: 'Classic Caslon display with Franklin Gothic. A timeless editorial pairing.' },
  { id: 24, heading: 'Space Mono', body: 'Work Sans', category: 'Technical', useCase: 'Agency', description: 'A quirky monospace with a versatile grotesque. Creative tech aesthetics.' },
  { id: 25, heading: 'Abril Fatface', body: 'Poppins', category: 'Playful', useCase: 'E-commerce', description: 'A bold didone display with geometric sans body. Eye-catching and stylish.' },
  { id: 26, heading: 'Manrope', body: 'Newsreader', category: 'Modern', useCase: 'Blog', description: 'A modern geometric sans with a news-inspired serif. Sharp and editorial.' },
  { id: 27, heading: 'Lexend', body: 'Merriweather Sans', category: 'Minimal', useCase: 'Documentation', description: 'Designed for reading ease with a warm sans body. Clarity and accessibility first.' },
];

const CATEGORIES: StyleCategory[] = ['Modern', 'Classic', 'Elegant', 'Playful', 'Technical', 'Minimal', 'Bold', 'Warm'];
const USE_CASES: UseCase[] = ['Blog', 'Portfolio', 'SaaS', 'E-commerce', 'Agency', 'Documentation', 'Magazine', 'Landing Page', 'Corporate'];

const CATEGORY_COLORS: Record<StyleCategory, string> = {
  Modern: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Classic: 'bg-stone-100 text-stone-700 dark:bg-stone-800/50 dark:text-stone-300',
  Elegant: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Playful: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Technical: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Minimal: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300',
  Bold: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  Warm: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

const SAMPLE_HEADING = 'The quick brown fox jumps over the lazy dog';
const SAMPLE_BODY = 'Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line spacing, and letter spacing.';

/* ────────────────────────────── Helpers ──────────────────────────── */

function fontToGoogleUrl(fonts: string[]): string {
  const families = fonts
    .map((f) => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

function fontToImportLink(heading: string, body: string): string {
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontToGoogleUrl([heading, body])}" rel="stylesheet">`;
}

function fontToCss(heading: string, body: string): string {
  return `/* Heading */
font-family: '${heading}', serif;

/* Body */
font-family: '${body}', sans-serif;`;
}

function fontToTailwind(heading: string, body: string): string {
  const hKey = heading.toLowerCase().replace(/\s+/g, '-');
  const bKey = body.toLowerCase().replace(/\s+/g, '-');
  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ['${heading}', 'serif'],
        body: ['${body}', 'sans-serif'],
      },
    },
  },
}

// Usage: className="font-heading" / className="font-body"
// Or with Tailwind v4 CSS:
@theme {
  --font-heading: '${heading}', serif;
  --font-body: '${body}', sans-serif;
}`;
}

/* ────────────────────────────── Component ────────────────────────── */

export function FontPairingTool() {
  const [selectedPair, setSelectedPair] = useState<FontPair | null>(null);
  const [headingText, setHeadingText] = useState(SAMPLE_HEADING);
  const [bodyText, setBodyText] = useState(SAMPLE_BODY);
  const [darkPreview, setDarkPreview] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<StyleCategory | null>(null);
  const [useCaseFilter, setUseCaseFilter] = useState<UseCase | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  /* ── Font Loading ─────────────────────────────────────────────── */

  const loadFont = useCallback(
    (fontName: string) => {
      if (loadedFonts.has(fontName)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontToGoogleUrl([fontName]);
      document.head.appendChild(link);
      setLoadedFonts((prev) => new Set(prev).add(fontName));
    },
    [loadedFonts]
  );

  // Load visible fonts
  useEffect(() => {
    const visible = filteredPairs.slice(0, 12);
    visible.forEach((p) => {
      loadFont(p.heading);
      loadFont(p.body);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, useCaseFilter]);

  // Load detail fonts
  useEffect(() => {
    if (selectedPair) {
      loadFont(selectedPair.heading);
      loadFont(selectedPair.body);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPair]);

  /* ── Filtering ────────────────────────────────────────────────── */

  const filteredPairs = useMemo(() => {
    return FONT_PAIRS.filter((p) => {
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (useCaseFilter && p.useCase !== useCaseFilter) return false;
      return true;
    });
  }, [categoryFilter, useCaseFilter]);

  /* ── Actions ──────────────────────────────────────────────────── */

  const copyToClipboard = useCallback(async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const randomize = useCallback(() => {
    const pool = filteredPairs.length > 0 ? filteredPairs : FONT_PAIRS;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    loadFont(pick.heading);
    loadFont(pick.body);
    setSelectedPair(pick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPairs]);

  const clearFilters = useCallback(() => {
    setCategoryFilter(null);
    setUseCaseFilter(null);
  }, []);

  const activeFilterCount = (categoryFilter ? 1 : 0) + (useCaseFilter ? 1 : 0);

  /* ── Copy Button Helper ───────────────────────────────────────── */

  function CopyBtn({ label, value, keyName, icon: Icon }: { label: string; value: string; keyName: string; icon: typeof Copy }) {
    const isCopied = copiedKey === keyName;
    return (
      <button
        onClick={() => copyToClipboard(value, keyName)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-amber-300 hover:bg-amber-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-amber-600 dark:hover:bg-amber-900/20"
      >
        {isCopied ? <Check size={16} className="text-green-600" /> : <Icon size={16} className="text-amber-600" />}
        {isCopied ? 'Copied!' : label}
      </button>
    );
  }

  /* ── Detail View ──────────────────────────────────────────────── */

  if (selectedPair) {
    const bg = darkPreview
      ? 'bg-gray-950 text-white'
      : 'bg-white text-gray-900';

    return (
      <div className="space-y-6">
        {/* Back + controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSelectedPair(null)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={16} /> Back to pairings
          </button>

          <button
            onClick={randomize}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 active:scale-95"
          >
            <Shuffle size={16} /> Random pair
          </button>

          <button
            onClick={() => setDarkPreview(!darkPreview)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {darkPreview ? <Sun size={16} /> : <Moon size={16} />}
            {darkPreview ? 'Light' : 'Dark'} preview
          </button>
        </div>

        {/* Pair name + tags */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedPair.heading} + {selectedPair.body}
          </h2>
          <div className="mt-2 flex gap-2">
            <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[selectedPair.category]}`}>
              {selectedPair.category}
            </span>
            <span className="inline-block rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              {selectedPair.useCase}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{selectedPair.description}</p>
        </div>

        {/* Large preview */}
        <div className={`rounded-2xl border border-gray-200 p-8 md:p-12 transition-colors dark:border-gray-700 ${bg}`}>
          <input
            value={headingText}
            onChange={(e) => setHeadingText(e.target.value)}
            className="mb-6 block w-full border-0 bg-transparent text-4xl font-bold outline-none md:text-5xl lg:text-6xl"
            style={{ fontFamily: `'${selectedPair.heading}', serif` }}
            placeholder="Type heading..."
          />
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            rows={4}
            className="block w-full resize-none border-0 bg-transparent text-lg leading-relaxed outline-none md:text-xl"
            style={{ fontFamily: `'${selectedPair.body}', sans-serif` }}
            placeholder="Type body text..."
          />
        </div>

        {/* Size scale */}
        <div className={`rounded-2xl border border-gray-200 p-8 transition-colors dark:border-gray-700 ${bg}`}>
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-gray-400">Type Scale Preview</p>
          <div className="space-y-5">
            {[
              { label: 'H1', size: 'text-5xl md:text-6xl', weight: 'font-bold', font: selectedPair.heading, family: 'serif' },
              { label: 'H2', size: 'text-3xl md:text-4xl', weight: 'font-bold', font: selectedPair.heading, family: 'serif' },
              { label: 'H3', size: 'text-2xl md:text-3xl', weight: 'font-semibold', font: selectedPair.heading, family: 'serif' },
              { label: 'Body', size: 'text-base md:text-lg', weight: 'font-normal', font: selectedPair.body, family: 'sans-serif' },
              { label: 'Small', size: 'text-sm', weight: 'font-normal', font: selectedPair.body, family: 'sans-serif' },
            ].map((item) => (
              <div key={item.label} className="flex items-baseline gap-4">
                <span className="w-14 shrink-0 text-right text-xs font-semibold uppercase tracking-wider text-amber-500">
                  {item.label}
                </span>
                <span
                  className={`${item.size} ${item.weight} leading-tight`}
                  style={{ fontFamily: `'${item.font}', ${item.family}` }}
                >
                  {headingText || SAMPLE_HEADING}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Paragraph preview */}
        <div className={`rounded-2xl border border-gray-200 p-8 transition-colors dark:border-gray-700 ${bg}`}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Long-form Reading Preview</p>
          <h3
            className="mb-4 text-3xl font-bold leading-tight"
            style={{ fontFamily: `'${selectedPair.heading}', serif` }}
          >
            Great design is invisible
          </h3>
          <div
            className="space-y-4 text-base leading-relaxed opacity-80 md:text-lg"
            style={{ fontFamily: `'${selectedPair.body}', sans-serif` }}
          >
            <p>
              Good typography establishes a visual hierarchy that enables readers to quickly scan content and find what they need. When headings and body text work together harmoniously, the reader can focus on the message rather than the medium.
            </p>
            <p>
              The best font pairings create contrast without conflict. A distinctive heading font draws the eye, while a well-chosen body font ensures comfortable reading over extended passages. The relationship between the two should feel natural and intentional.
            </p>
          </div>
        </div>

        {/* Copy actions */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
          <p className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Export this pairing</p>
          <div className="flex flex-wrap gap-3">
            <CopyBtn label="Copy CSS" value={fontToCss(selectedPair.heading, selectedPair.body)} keyName="css" icon={Code} />
            <CopyBtn label="Copy HTML Link" value={fontToImportLink(selectedPair.heading, selectedPair.body)} keyName="link" icon={Link} />
            <CopyBtn label="Copy Tailwind Config" value={fontToTailwind(selectedPair.heading, selectedPair.body)} keyName="tailwind" icon={Layers} />
          </div>

          {/* Code preview */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400">
              Show code snippets
            </summary>
            <div className="mt-3 space-y-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">Google Fonts HTML</p>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-green-400">
                  {fontToImportLink(selectedPair.heading, selectedPair.body)}
                </pre>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">CSS</p>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-green-400">
                  {fontToCss(selectedPair.heading, selectedPair.body)}
                </pre>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">Tailwind Config</p>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-green-400">
                  {fontToTailwind(selectedPair.heading, selectedPair.body)}
                </pre>
              </div>
            </div>
          </details>
        </div>
      </div>
    );
  }

  /* ── Browse View ──────────────────────────────────────────────── */

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredPairs.length} pairing{filteredPairs.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition ${
              activeFilterCount > 0
                ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Filter size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={randomize}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 active:scale-95"
          >
            <Shuffle size={16} /> Random
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter pairings</p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={14} /> Clear all
              </button>
            )}
          </div>

          <div className="mb-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Style</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    categoryFilter === cat
                      ? 'bg-amber-500 text-white'
                      : `${CATEGORY_COLORS[cat]} hover:ring-2 hover:ring-amber-300`
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Use Case</p>
            <div className="flex flex-wrap gap-2">
              {USE_CASES.map((uc) => (
                <button
                  key={uc}
                  onClick={() => setUseCaseFilter(useCaseFilter === uc ? null : uc)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    useCaseFilter === uc
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-50 text-amber-700 hover:ring-2 hover:ring-amber-300 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}
                >
                  {uc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {filteredPairs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 dark:border-gray-700">
          <p className="text-lg font-semibold text-gray-400 dark:text-gray-500">No pairings match your filters</p>
          <button
            onClick={clearFilters}
            className="mt-3 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPairs.map((pair) => (
            <button
              key={pair.id}
              onClick={() => {
                setSelectedPair(pair);
                setHeadingText(SAMPLE_HEADING);
                setBodyText(SAMPLE_BODY);
              }}
              onMouseEnter={() => {
                loadFont(pair.heading);
                loadFont(pair.body);
              }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white text-left transition-all hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-900 dark:hover:border-amber-600 dark:hover:shadow-amber-900/20"
            >
              {/* Preview area */}
              <div className="px-6 pb-4 pt-6">
                <p
                  className="mb-2 text-2xl font-bold leading-tight text-gray-900 dark:text-white md:text-3xl"
                  style={{ fontFamily: `'${pair.heading}', serif` }}
                >
                  Heading
                </p>
                <p
                  className="text-sm leading-relaxed text-gray-600 dark:text-gray-400"
                  style={{ fontFamily: `'${pair.body}', sans-serif` }}
                >
                  Body text looks like this. It should be easy to read and pair well with the heading above.
                </p>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 bg-gray-50/80 px-6 py-3 dark:border-gray-800 dark:bg-gray-800/50">
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    {pair.heading}
                    <span className="mx-1.5 text-amber-400">+</span>
                    {pair.body}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[pair.category]}`}>
                    {pair.category}
                  </span>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    {pair.useCase}
                  </span>
                </div>
              </div>

              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-2 ring-amber-400/50 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
