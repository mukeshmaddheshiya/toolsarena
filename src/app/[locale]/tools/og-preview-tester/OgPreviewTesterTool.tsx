'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Copy, Check, AlertTriangle, CheckCircle2, Globe, Eye, Code2, Sparkles, Shield,
  Facebook, Twitter, Linkedin, MessageCircle, Hash, Search, ImageIcon, Type, Link2, FileText
} from 'lucide-react';

type InputMode = 'manual' | 'html';
type OgType = 'website' | 'article' | 'product';
type TwitterCard = 'summary' | 'summary_large_image';

interface OgData {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
  ogType: OgType;
  twitterCard: TwitterCard;
}

interface ValidationWarning {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

const EXAMPLE_DATA: OgData = {
  title: 'ToolsArena - 80+ Free Online Tools for Everyone',
  description: 'Free online tools for images, PDFs, text, calculators, SEO, and developers. No signup needed. Works in your browser — fast, private, and free.',
  image: 'https://toolsarena.in/og-image.png',
  url: 'https://toolsarena.in',
  siteName: 'ToolsArena',
  ogType: 'website',
  twitterCard: 'summary_large_image',
};

const EMPTY_DATA: OgData = {
  title: '',
  description: '',
  image: '',
  url: '',
  siteName: '',
  ogType: 'website',
  twitterCard: 'summary_large_image',
};

function extractOgFromHtml(html: string): Partial<OgData> {
  const get = (pattern: RegExp): string => {
    const match = html.match(pattern);
    return match ? match[1] : '';
  };
  return {
    title: get(/property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
           get(/content=["']([^"']+)["']\s+property=["']og:title["']/i) ||
           get(/<title>([^<]+)<\/title>/i),
    description: get(/property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
                 get(/content=["']([^"']+)["']\s+property=["']og:description["']/i) ||
                 get(/name=["']description["']\s+content=["']([^"']+)["']/i),
    image: get(/property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
           get(/content=["']([^"']+)["']\s+property=["']og:image["']/i),
    url: get(/property=["']og:url["']\s+content=["']([^"']+)["']/i) ||
         get(/content=["']([^"']+)["']\s+property=["']og:url["']/i),
    siteName: get(/property=["']og:site_name["']\s+content=["']([^"']+)["']/i) ||
              get(/content=["']([^"']+)["']\s+property=["']og:site_name["']/i),
    ogType: (get(/property=["']og:type["']\s+content=["']([^"']+)["']/i) || 'website') as OgType,
    twitterCard: (get(/name=["']twitter:card["']\s+content=["']([^"']+)["']/i) || 'summary_large_image') as TwitterCard,
  };
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '\u2026';
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url || 'example.com';
  }
}

export function OgPreviewTesterTool() {
  const [mode, setMode] = useState<InputMode>('manual');
  const [data, setData] = useState<OgData>(EMPTY_DATA);
  const [htmlInput, setHtmlInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const update = useCallback((field: keyof OgData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (field === 'image') setImageError(false);
  }, []);

  const handleExtractHtml = useCallback(() => {
    const extracted = extractOgFromHtml(htmlInput);
    setData(prev => ({
      ...prev,
      ...Object.fromEntries(Object.entries(extracted).filter(([, v]) => v)),
    }));
    setMode('manual');
  }, [htmlInput]);

  const handleTryExample = useCallback(() => {
    setData(EXAMPLE_DATA);
    setImageError(false);
  }, []);

  const handleReset = useCallback(() => {
    setData(EMPTY_DATA);
    setHtmlInput('');
    setImageError(false);
  }, []);

  const warnings = useMemo<ValidationWarning[]>(() => {
    const w: ValidationWarning[] = [];
    if (!data.title) w.push({ field: 'title', message: 'og:title is required', severity: 'error' });
    else if (data.title.length < 40) w.push({ field: 'title', message: `Title is short (${data.title.length}/40 min). Aim for 40-60 characters.`, severity: 'warning' });
    else if (data.title.length > 60) w.push({ field: 'title', message: `Title is long (${data.title.length}/60 max). May be truncated on some platforms.`, severity: 'warning' });
    if (!data.description) w.push({ field: 'description', message: 'og:description is required', severity: 'error' });
    else if (data.description.length < 80) w.push({ field: 'description', message: `Description is short (${data.description.length}/80 min). Aim for 80-160 chars.`, severity: 'warning' });
    else if (data.description.length > 160) w.push({ field: 'description', message: `Description is long (${data.description.length}/160 max). May be truncated.`, severity: 'warning' });
    if (!data.image) w.push({ field: 'image', message: 'og:image is recommended. Use 1200x630px for best results.', severity: 'warning' });
    if (!data.url) w.push({ field: 'url', message: 'og:url is recommended for canonical link.', severity: 'warning' });
    return w;
  }, [data]);

  const metaTagsOutput = useMemo(() => {
    const lines: string[] = [];
    lines.push('<!-- Open Graph Meta Tags -->');
    if (data.title) lines.push(`<meta property="og:title" content="${data.title}" />`);
    if (data.description) lines.push(`<meta property="og:description" content="${data.description}" />`);
    if (data.image) lines.push(`<meta property="og:image" content="${data.image}" />`);
    if (data.url) lines.push(`<meta property="og:url" content="${data.url}" />`);
    if (data.siteName) lines.push(`<meta property="og:site_name" content="${data.siteName}" />`);
    lines.push(`<meta property="og:type" content="${data.ogType}" />`);
    lines.push('');
    lines.push('<!-- Twitter Card Meta Tags -->');
    lines.push(`<meta name="twitter:card" content="${data.twitterCard}" />`);
    if (data.title) lines.push(`<meta name="twitter:title" content="${data.title}" />`);
    if (data.description) lines.push(`<meta name="twitter:description" content="${data.description}" />`);
    if (data.image) lines.push(`<meta name="twitter:image" content="${data.image}" />`);
    return lines.join('\n');
  }, [data]);

  const copyMetaTags = useCallback(async () => {
    await navigator.clipboard.writeText(metaTagsOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [metaTagsOutput]);

  const domain = getDomain(data.url);
  const hasContent = data.title || data.description;

  const charCount = (value: string, min: number, max: number) => {
    const len = value.length;
    let color = 'text-gray-400 dark:text-gray-500';
    if (len > 0 && len < min) color = 'text-amber-500';
    else if (len > max) color = 'text-amber-500';
    else if (len >= min && len <= max) color = 'text-green-500';
    return <span className={`text-xs ${color}`}>{len}/{min}-{max}</span>;
  };

  // Placeholder image component
  const PlaceholderImage = ({ className }: { className?: string }) => (
    <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className || ''}`}>
      <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
    </div>
  );

  // OG Image display component
  const OgImage = ({ className, alt }: { className?: string; alt?: string }) => {
    if (!data.image || imageError) return <PlaceholderImage className={className} />;
    return (
      <img
        src={data.image}
        alt={alt || data.title || 'OG Preview'}
        className={`object-cover ${className || ''}`}
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('manual')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              mode === 'manual'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="flex items-center gap-1.5"><Type className="w-4 h-4" /> Manual Input</span>
          </button>
          <button
            onClick={() => setMode('html')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              mode === 'html'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="flex items-center gap-1.5"><Code2 className="w-4 h-4" /> Paste HTML</span>
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleTryExample}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Try Example</span>
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* HTML Input Mode */}
      {mode === 'html' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Paste your HTML &lt;head&gt; section below
          </label>
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            rows={8}
            placeholder={'<meta property="og:title" content="My Page Title" />\n<meta property="og:description" content="Page description..." />\n<meta property="og:image" content="https://example.com/image.jpg" />'}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
          />
          <button
            onClick={handleExtractHtml}
            disabled={!htmlInput.trim()}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Extract OG Tags
          </button>
        </div>
      )}

      {/* Manual Input Mode */}
      {mode === 'manual' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* og:title */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-indigo-500" /> og:title <span className="text-red-400">*</span>
                </label>
                {charCount(data.title, 40, 60)}
              </div>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Your page title"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* og:description */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" /> og:description <span className="text-red-400">*</span>
                </label>
                {charCount(data.description, 80, 160)}
              </div>
              <textarea
                value={data.description}
                onChange={(e) => update('description', e.target.value)}
                rows={2}
                placeholder="A brief description of your page content"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
              />
            </div>

            {/* og:image */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-500" /> og:image URL
                </label>
                <span className="text-xs text-gray-400">Recommended: 1200x630px</span>
              </div>
              <input
                type="url"
                value={data.image}
                onChange={(e) => update('image', e.target.value)}
                placeholder="https://example.com/og-image.png"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {data.image && !imageError && (
                <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 max-w-xs">
                  <img
                    src={data.image}
                    alt="OG Image Preview"
                    className="w-full h-auto object-cover max-h-40"
                    onError={() => setImageError(true)}
                  />
                </div>
              )}
              {imageError && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Could not load image. Check the URL.
                </p>
              )}
            </div>

            {/* og:url */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1.5">
                <Link2 className="w-3.5 h-3.5 text-indigo-500" /> og:url
              </label>
              <input
                type="url"
                value={data.url}
                onChange={(e) => update('url', e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* og:site_name */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" /> og:site_name
              </label>
              <input
                type="text"
                value={data.siteName}
                onChange={(e) => update('siteName', e.target.value)}
                placeholder="My Website"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* og:type */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1.5">
                <Hash className="w-3.5 h-3.5 text-indigo-500" /> og:type
              </label>
              <select
                value={data.ogType}
                onChange={(e) => update('ogType', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
              </select>
            </div>

            {/* twitter:card */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1.5">
                <Twitter className="w-3.5 h-3.5 text-indigo-500" /> twitter:card
              </label>
              <select
                value={data.twitterCard}
                onChange={(e) => update('twitterCard', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="summary">summary</option>
                <option value="summary_large_image">summary_large_image</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Validation Warnings */}
      {warnings.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-indigo-500" /> Validation
          </h3>
          <div className="space-y-1.5">
            {warnings.map((w, i) => (
              <div key={i} className={`flex items-start gap-2 text-sm ${
                w.severity === 'error' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
              }`}>
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{w.message}</span>
              </div>
            ))}
          </div>
          {warnings.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" /> All OG tags look good!
            </div>
          )}
        </div>
      )}

      {warnings.length === 0 && hasContent && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-4">
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 font-medium">
            <CheckCircle2 className="w-4 h-4" /> All OG tags look good! Your social previews should display correctly.
          </div>
        </div>
      )}

      {/* Preview Cards */}
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-500" /> Live Previews
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Google Search Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Google Search</span>
            </div>
            <div className="p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{data.siteName || domain}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{data.url || 'https://example.com'}</p>
                  </div>
                </div>
                <h3 className="text-xl text-blue-700 dark:text-blue-400 leading-snug cursor-pointer hover:underline">
                  {truncate(data.title || 'Page Title', 60) || 'Page Title'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {truncate(data.description || 'Page description will appear here...', 160)}
                </p>
              </div>
            </div>
          </div>

          {/* Facebook Share Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <Facebook className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Facebook</span>
            </div>
            <div className="p-4">
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <OgImage className="w-full aspect-[1.91/1]" />
                <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2.5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{domain}</p>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug mt-0.5 line-clamp-2">
                    {data.title || 'Page Title'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                    {data.description || 'Description'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Twitter/X Card Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <Twitter className="w-4 h-4 text-gray-900 dark:text-gray-100" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Twitter / X</span>
            </div>
            <div className="p-4">
              {data.twitterCard === 'summary_large_image' ? (
                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <OgImage className="w-full aspect-[2/1]" />
                  <div className="px-3 py-2.5">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{domain}</p>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug mt-0.5 line-clamp-2">
                      {data.title || 'Page Title'}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                      {data.description || 'Description'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex">
                  <OgImage className="w-32 h-32 shrink-0" />
                  <div className="px-3 py-2.5 flex flex-col justify-center min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{domain}</p>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug mt-0.5 line-clamp-2">
                      {data.title || 'Page Title'}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                      {data.description || 'Description'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LinkedIn Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-blue-700" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">LinkedIn</span>
            </div>
            <div className="p-4">
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <OgImage className="w-full aspect-[1.91/1]" />
                <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2.5">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
                    {data.title || 'Page Title'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{domain}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Discord Embed Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Discord</span>
            </div>
            <div className="p-4">
              <div className="bg-gray-800 dark:bg-gray-950 rounded-lg overflow-hidden border-l-4 border-indigo-500">
                <div className="p-3 space-y-1.5">
                  <p className="text-xs text-gray-400 font-medium">{data.siteName || domain}</p>
                  <h4 className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer leading-snug">
                    {data.title || 'Page Title'}
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                    {data.description || 'Description'}
                  </p>
                  {(data.image && !imageError) && (
                    <div className="mt-2 rounded overflow-hidden max-w-full">
                      <img
                        src={data.image}
                        alt="Discord preview"
                        className="max-w-full max-h-48 rounded object-cover"
                        onError={() => setImageError(true)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">WhatsApp</span>
            </div>
            <div className="p-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl overflow-hidden max-w-sm">
                <OgImage className="w-full aspect-[1.91/1]" />
                <div className="px-3 py-2">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">{domain}</p>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug mt-0.5 line-clamp-2">
                    {data.title || 'Page Title'}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                    {data.description || 'Description'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Slack Unfurl Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden lg:col-span-2">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <Hash className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Slack</span>
            </div>
            <div className="p-4">
              <div className="border-l-4 border-gray-400 dark:border-gray-500 pl-3 max-w-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  {data.siteName && (
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{data.siteName}</span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer leading-snug">
                  {data.title || 'Page Title'}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 leading-relaxed line-clamp-3">
                  {data.description || 'Description'}
                </p>
                {(data.image && !imageError) && (
                  <div className="mt-2 rounded overflow-hidden">
                    <img
                      src={data.image}
                      alt="Slack preview"
                      className="max-w-xs max-h-48 rounded object-cover"
                      onError={() => setImageError(true)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Meta Tags */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-indigo-500" /> Generated Meta Tags
          </h3>
          <button
            onClick={copyMetaTags}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy OG Meta Tags</>}
          </button>
        </div>
        <pre className="p-4 text-sm text-gray-800 dark:text-gray-200 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-gray-900">
          {metaTagsOutput}
        </pre>
      </div>

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 py-2">
        <Shield className="w-4 h-4 text-green-500" />
        <span>100% client-side. Your data never leaves your browser.</span>
      </div>
    </div>
  );
}
