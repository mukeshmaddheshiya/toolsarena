'use client';

import { useState, useMemo, useCallback } from 'react';
import { Bot, FileText, Copy, Download, Plus, Trash2, Check, AlertTriangle, Info } from 'lucide-react';

interface RuleGroup {
  id: string;
  userAgent: string;
  customAgent: string;
  allowPaths: string[];
  disallowPaths: string[];
  crawlDelay: string;
}

const AGENT_OPTIONS = ['*', 'Googlebot', 'Bingbot', 'Googlebot-Image', 'Yandex', 'DuckDuckBot', 'Custom'];

const PRESETS: Record<string, { label: string; groups: Omit<RuleGroup, 'id'>[]; sitemaps: string[] }> = {
  allowAll: { label: 'Allow All', groups: [{ userAgent: '*', customAgent: '', allowPaths: ['/'], disallowPaths: [], crawlDelay: '' }], sitemaps: [] },
  blockAll: { label: 'Block All', groups: [{ userAgent: '*', customAgent: '', allowPaths: [], disallowPaths: ['/'], crawlDelay: '' }], sitemaps: [] },
  blockAI: { label: 'Block AI Bots', groups: [
    { userAgent: '*', customAgent: '', allowPaths: ['/'], disallowPaths: [], crawlDelay: '' },
    ...['GPTBot', 'ChatGPT-User', 'CCBot', 'Google-Extended'].map(a => ({ userAgent: 'Custom', customAgent: a, allowPaths: [] as string[], disallowPaths: ['/'], crawlDelay: '' })),
  ], sitemaps: [] },
  standard: { label: 'Standard', groups: [{ userAgent: '*', customAgent: '', allowPaths: ['/'], disallowPaths: ['/admin/', '/private/', '/api/'], crawlDelay: '' }], sitemaps: ['https://example.com/sitemap.xml'] },
  wordpress: { label: 'WordPress Default', groups: [{ userAgent: '*', customAgent: '', allowPaths: ['/wp-admin/admin-ajax.php'], disallowPaths: ['/wp-admin/'], crawlDelay: '' }], sitemaps: ['https://example.com/sitemap.xml'] },
};

const uid = () => Math.random().toString(36).slice(2, 9);

export function RobotsTxtGeneratorTool() {
  const [groups, setGroups] = useState<RuleGroup[]>([{ id: uid(), userAgent: '*', customAgent: '', allowPaths: ['/'], disallowPaths: [], crawlDelay: '' }]);
  const [sitemaps, setSitemaps] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const updateGroup = useCallback((id: string, patch: Partial<RuleGroup>) => {
    setGroups(g => g.map(r => r.id === id ? { ...r, ...patch } : r));
  }, []);

  const addGroup = () => setGroups(g => [...g, { id: uid(), userAgent: '*', customAgent: '', allowPaths: [], disallowPaths: [], crawlDelay: '' }]);
  const removeGroup = (id: string) => setGroups(g => g.filter(r => r.id !== id));

  const addPath = (id: string, type: 'allowPaths' | 'disallowPaths') => {
    setGroups(g => g.map(r => r.id === id ? { ...r, [type]: [...r[type], ''] } : r));
  };
  const updatePath = (id: string, type: 'allowPaths' | 'disallowPaths', idx: number, val: string) => {
    setGroups(g => g.map(r => r.id === id ? { ...r, [type]: r[type].map((p, i) => i === idx ? val : p) } : r));
  };
  const removePath = (id: string, type: 'allowPaths' | 'disallowPaths', idx: number) => {
    setGroups(g => g.map(r => r.id === id ? { ...r, [type]: r[type].filter((_, i) => i !== idx) } : r));
  };

  const applyPreset = (key: string) => {
    const p = PRESETS[key];
    if (!p) return;
    setGroups(p.groups.map(g => ({ ...g, id: uid() })));
    setSitemaps([...p.sitemaps]);
  };

  const warnings = useMemo(() => {
    const w: string[] = [];
    groups.forEach(g => {
      const agent = g.userAgent === 'Custom' ? g.customAgent : g.userAgent;
      if (g.disallowPaths.includes('/') && g.allowPaths.length > 0) w.push(`"${agent}" blocks everything (Disallow: /) but also has Allow rules -- Allow rules may be ignored by some crawlers.`);
      if (!agent.trim()) w.push('A group has an empty User-Agent -- this will be invalid.');
    });
    return w;
  }, [groups]);

  const output = useMemo(() => {
    const lines: string[] = [];
    groups.forEach((g, i) => {
      if (i > 0) lines.push('');
      const agent = g.userAgent === 'Custom' ? g.customAgent.trim() || '*' : g.userAgent;
      lines.push(`User-agent: ${agent}`);
      g.disallowPaths.forEach(p => lines.push(`Disallow: ${p}`));
      g.allowPaths.forEach(p => lines.push(`Allow: ${p}`));
      if (g.crawlDelay) lines.push(`Crawl-delay: ${g.crawlDelay}`);
    });
    if (sitemaps.some(s => s.trim())) {
      lines.push('');
      sitemaps.forEach(s => { if (s.trim()) lines.push(`Sitemap: ${s.trim()}`); });
    }
    return lines.join('\n');
  }, [groups, sitemaps]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const inputCls = 'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none';
  const btnSm = 'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors';

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-green-600 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Bot className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Robots.txt Generator</h2>
        </div>
        <p className="text-teal-100 text-sm">Create a valid robots.txt file to control how search engine crawlers access your site.</p>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Presets:</span>
        {Object.entries(PRESETS).map(([k, v]) => (
          <button key={k} onClick={() => applyPreset(k)} className={`${btnSm} bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:hover:bg-teal-800/60`}>{v.label}</button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-4">
          {groups.map((g, gi) => (
            <div key={g.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Group {gi + 1}</h3>
                {groups.length > 1 && (
                  <button onClick={() => removeGroup(g.id)} className="text-red-500 hover:text-red-700 p-1" title="Remove group"><Trash2 className="h-4 w-4" /></button>
                )}
              </div>

              {/* User-Agent */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">User-Agent</label>
                <select value={g.userAgent} onChange={e => updateGroup(g.id, { userAgent: e.target.value })} className={inputCls}>
                  {AGENT_OPTIONS.map(a => <option key={a} value={a}>{a === '*' ? '* (All Bots)' : a}</option>)}
                </select>
                {g.userAgent === 'Custom' && (
                  <input value={g.customAgent} onChange={e => updateGroup(g.id, { customAgent: e.target.value })} placeholder="e.g. GPTBot" className={`${inputCls} mt-2`} />
                )}
              </div>

              {/* Disallow */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Disallow Paths</label>
                  <button onClick={() => addPath(g.id, 'disallowPaths')} className="text-teal-600 hover:text-teal-800 dark:text-teal-400"><Plus className="h-4 w-4" /></button>
                </div>
                {g.disallowPaths.map((p, pi) => (
                  <div key={pi} className="flex gap-2 mb-1.5">
                    <input value={p} onChange={e => updatePath(g.id, 'disallowPaths', pi, e.target.value)} placeholder="/path/" className={inputCls} />
                    <button onClick={() => removePath(g.id, 'disallowPaths', pi)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                {g.disallowPaths.length === 0 && <p className="text-xs text-gray-400 italic">No disallow rules</p>}
              </div>

              {/* Allow */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Allow Paths</label>
                  <button onClick={() => addPath(g.id, 'allowPaths')} className="text-teal-600 hover:text-teal-800 dark:text-teal-400"><Plus className="h-4 w-4" /></button>
                </div>
                {g.allowPaths.map((p, pi) => (
                  <div key={pi} className="flex gap-2 mb-1.5">
                    <input value={p} onChange={e => updatePath(g.id, 'allowPaths', pi, e.target.value)} placeholder="/path/" className={inputCls} />
                    <button onClick={() => removePath(g.id, 'allowPaths', pi)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                {g.allowPaths.length === 0 && <p className="text-xs text-gray-400 italic">No allow rules</p>}
              </div>

              {/* Crawl-delay */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Crawl-delay (seconds, optional)</label>
                <input type="number" min="0" value={g.crawlDelay} onChange={e => updateGroup(g.id, { crawlDelay: e.target.value })} placeholder="e.g. 10" className={inputCls} />
              </div>
            </div>
          ))}

          <button onClick={addGroup} className={`${btnSm} w-full justify-center bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 py-2`}>
            <Plus className="h-4 w-4" /> Add User-Agent Group
          </button>

          {/* Sitemaps */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Sitemap URLs</h3>
              <button onClick={() => setSitemaps(s => [...s, ''])} className="text-teal-600 hover:text-teal-800 dark:text-teal-400"><Plus className="h-4 w-4" /></button>
            </div>
            {sitemaps.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input value={s} onChange={e => setSitemaps(prev => prev.map((v, j) => j === i ? e.target.value : v))} placeholder="https://example.com/sitemap.xml" className={inputCls} />
                <button onClick={() => setSitemaps(prev => prev.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            {sitemaps.length === 0 && <p className="text-xs text-gray-400 italic">No sitemaps added</p>}
          </div>
        </div>

        {/* Preview & Actions */}
        <div className="space-y-4">
          {warnings.length > 0 && (
            <div className="rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 p-4 space-y-2">
              {warnings.map((w, i) => (
                <div key={i} className="flex gap-2 text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /><span>{w}</span>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FileText className="h-4 w-4" /> robots.txt Preview
              </div>
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className={`${btnSm} ${copied ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:hover:bg-teal-800/60'}`}>
                  {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                </button>
                <button onClick={downloadFile} className={`${btnSm} bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-800/60`}>
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            </div>
            <pre className="p-4 text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-x-auto min-h-[200px] bg-gray-50 dark:bg-gray-900">{output}</pre>
          </div>

          {/* Info */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-teal-600" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Robots.txt Syntax Guide</h3>
            </div>
            <dl className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div><dt className="font-semibold inline">User-agent:</dt> <dd className="inline">Specifies the crawler. Use <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">*</code> for all bots.</dd></div>
              <div><dt className="font-semibold inline">Disallow:</dt> <dd className="inline">Blocks a path from crawling. <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">Disallow: /</code> blocks the entire site.</dd></div>
              <div><dt className="font-semibold inline">Allow:</dt> <dd className="inline">Overrides a Disallow for a specific sub-path (supported by Google, Bing).</dd></div>
              <div><dt className="font-semibold inline">Crawl-delay:</dt> <dd className="inline">Seconds between requests (honored by Bing/Yandex, ignored by Google).</dd></div>
              <div><dt className="font-semibold inline">Sitemap:</dt> <dd className="inline">Full URL to your XML sitemap. Can list multiple.</dd></div>
            </dl>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">Place the file at the root of your domain: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">https://example.com/robots.txt</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
