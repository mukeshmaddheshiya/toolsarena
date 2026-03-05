'use client';

import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

type Tab = 'basic' | 'og' | 'twitter';

export function MetaTagGeneratorTool() {
  const [tab, setTab] = useState<Tab>('basic');
  const [copied, setCopied] = useState<Tab | 'all' | null>(null);

  // Basic SEO
  const [title, setTitle] = useState('My Awesome Page');
  const [description, setDescription] = useState('A short description of this page for search engines and social sharing.');
  const [keywords, setKeywords] = useState('keyword1, keyword2, keyword3');
  const [author, setAuthor] = useState('');
  const [robots, setRobots] = useState('index, follow');
  const [canonical, setCanonical] = useState('');
  const [lang, setLang] = useState('en');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');

  // Open Graph
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [ogType, setOgType] = useState('website');
  const [ogSiteName, setOgSiteName] = useState('');

  // Twitter
  const [twCard, setTwCard] = useState('summary_large_image');
  const [twTitle, setTwTitle] = useState('');
  const [twDescription, setTwDescription] = useState('');
  const [twImage, setTwImage] = useState('');
  const [twSite, setTwSite] = useState('');
  const [twCreator, setTwCreator] = useState('');

  const basicTags = useMemo(() => {
    const lines = [
      `<meta charset="UTF-8">`,
      `<meta name="viewport" content="${viewport}">`,
      `<title>${title}</title>`,
      description && `<meta name="description" content="${description}">`,
      keywords && `<meta name="keywords" content="${keywords}">`,
      author && `<meta name="author" content="${author}">`,
      `<meta name="robots" content="${robots}">`,
      lang && `<html lang="${lang}">`,
      canonical && `<link rel="canonical" href="${canonical}">`,
    ].filter(Boolean).join('\n');
    return lines;
  }, [title, description, keywords, author, robots, canonical, lang, viewport]);

  const ogTags = useMemo(() => {
    const t = ogTitle || title;
    const d = ogDescription || description;
    const lines = [
      `<meta property="og:type" content="${ogType}">`,
      t && `<meta property="og:title" content="${t}">`,
      d && `<meta property="og:description" content="${d}">`,
      ogUrl && `<meta property="og:url" content="${ogUrl}">`,
      ogImage && `<meta property="og:image" content="${ogImage}">`,
      ogSiteName && `<meta property="og:site_name" content="${ogSiteName}">`,
    ].filter(Boolean).join('\n');
    return lines;
  }, [ogTitle, ogDescription, ogImage, ogUrl, ogType, ogSiteName, title, description]);

  const twitterTags = useMemo(() => {
    const t = twTitle || title;
    const d = twDescription || description;
    const lines = [
      `<meta name="twitter:card" content="${twCard}">`,
      t && `<meta name="twitter:title" content="${t}">`,
      d && `<meta name="twitter:description" content="${d}">`,
      twImage && `<meta name="twitter:image" content="${twImage}">`,
      twSite && `<meta name="twitter:site" content="${twSite}">`,
      twCreator && `<meta name="twitter:creator" content="${twCreator}">`,
    ].filter(Boolean).join('\n');
    return lines;
  }, [twCard, twTitle, twDescription, twImage, twSite, twCreator, title, description]);

  const allTags = `<!-- Basic SEO -->\n${basicTags}\n\n<!-- Open Graph -->\n${ogTags}\n\n<!-- Twitter Card -->\n${twitterTags}`;

  const copy = async (text: string, key: Tab | 'all') => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const Input = ({ label, value, onChange, placeholder = '', maxLen }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; maxLen?: number }) => (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
        {maxLen && <span className={`text-xs ${value.length > maxLen ? 'text-red-500' : 'text-gray-400'}`}>{value.length}/{maxLen}</span>}
      </div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );

  const CodeBlock = ({ code, k }: { code: string; k: Tab | 'all' }) => (
    <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
      <button onClick={() => copy(code, k)} className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs transition-colors">
        {copied === k ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
      </button>
      <pre className="p-4 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap pt-10">{code}</pre>
    </div>
  );

  const TABS = [{ id: 'basic', label: 'Basic SEO' }, { id: 'og', label: 'Open Graph' }, { id: 'twitter', label: 'Twitter Card' }] as const;

  return (
    <div className="space-y-5">
      <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
        {tab === 'basic' && (
          <>
            <Input label="Page Title" value={title} onChange={setTitle} maxLen={60} />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Meta Description</label>
                <span className={`text-xs ${description.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>{description.length}/160</span>
              </div>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <Input label="Keywords (comma-separated)" value={keywords} onChange={setKeywords} placeholder="seo, tools, meta tags" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Author" value={author} onChange={setAuthor} />
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Robots</label>
                <select value={robots} onChange={e => setRobots(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {['index, follow','noindex, follow','index, nofollow','noindex, nofollow'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <Input label="Canonical URL (optional)" value={canonical} onChange={setCanonical} placeholder="https://example.com/page" />
          </>
        )}

        {tab === 'og' && (
          <>
            <p className="text-xs text-gray-400">Leave blank to use Basic SEO values for title/description.</p>
            <Input label="OG Title (optional)" value={ogTitle} onChange={setOgTitle} maxLen={60} />
            <Input label="OG Description (optional)" value={ogDescription} onChange={setOgDescription} maxLen={160} />
            <Input label="OG Image URL" value={ogImage} onChange={setOgImage} placeholder="https://example.com/og-image.jpg (1200×630)" />
            <Input label="OG URL" value={ogUrl} onChange={setOgUrl} placeholder="https://example.com/page" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Type</label>
                <select value={ogType} onChange={e => setOgType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {['website','article','product','profile','book'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <Input label="Site Name" value={ogSiteName} onChange={setOgSiteName} placeholder="ToolsArena" />
            </div>
          </>
        )}

        {tab === 'twitter' && (
          <>
            <p className="text-xs text-gray-400">Leave title/description blank to use Basic SEO values.</p>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Card Type</label>
              <select value={twCard} onChange={e => setTwCard(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['summary','summary_large_image','app','player'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <Input label="Twitter Title (optional)" value={twTitle} onChange={setTwTitle} maxLen={70} />
            <Input label="Twitter Description (optional)" value={twDescription} onChange={setTwDescription} maxLen={200} />
            <Input label="Twitter Image URL" value={twImage} onChange={setTwImage} placeholder="https://example.com/twitter-card.jpg" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="@Site handle" value={twSite} onChange={setTwSite} placeholder="@yourbrand" />
              <Input label="@Creator handle" value={twCreator} onChange={setTwCreator} placeholder="@author" />
            </div>
          </>
        )}
      </div>

      {/* Output */}
      <CodeBlock code={tab === 'basic' ? basicTags : tab === 'og' ? ogTags : twitterTags} k={tab} />

      {/* All tags */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">All Tags Combined</span>
          <button onClick={() => copy(allTags, 'all')} className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline">
            {copied === 'all' ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy all</>}
          </button>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 overflow-x-auto max-h-56">
          <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">{allTags}</pre>
        </div>
      </div>
    </div>
  );
}
