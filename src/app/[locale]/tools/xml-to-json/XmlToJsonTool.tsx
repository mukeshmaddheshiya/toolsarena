'use client';
import { useState, useCallback } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { ClipboardPaste, Trash2 } from 'lucide-react';

function xmlToJson(xml: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const error = doc.querySelector('parsererror');
  if (error) throw new Error(error.textContent || 'Invalid XML');

  function nodeToObj(node: Element): unknown {
    const obj: Record<string, unknown> = {};

    // Attributes
    if (node.attributes.length > 0) {
      const attrs: Record<string, string> = {};
      for (let i = 0; i < node.attributes.length; i++) {
        attrs[`@${node.attributes[i].name}`] = node.attributes[i].value;
      }
      Object.assign(obj, attrs);
    }

    // Child elements
    const children = Array.from(node.children);
    if (children.length === 0) {
      const text = node.textContent?.trim() || '';
      if (Object.keys(obj).length === 0) return text || null;
      if (text) obj['#text'] = text;
      return obj;
    }

    const grouped: Record<string, unknown[]> = {};
    for (const child of children) {
      const key = child.tagName;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(nodeToObj(child));
    }

    for (const [key, values] of Object.entries(grouped)) {
      obj[key] = values.length === 1 ? values[0] : values;
    }

    return obj;
  }

  const root = doc.documentElement;
  return { [root.tagName]: nodeToObj(root) };
}

export function XmlToJsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState(2);

  const handleConvert = useCallback(() => {
    if (!input.trim()) return;
    setError(null);
    try {
      const result = xmlToJson(input);
      setOutput(JSON.stringify(result, null, indent));
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, indent]);

  const handlePaste = async () => {
    try { const t = await navigator.clipboard.readText(); setInput(t); } catch {}
  };

  const clear = () => { setInput(''); setOutput(''); setError(null); };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Indent:</label>
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))}
            className="text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1">
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
        <button onClick={handleConvert} disabled={!input.trim()}
          className="px-4 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-xs font-medium transition-colors">
          Convert to JSON
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Input XML</label>
            <div className="flex gap-1">
              <button onClick={handlePaste} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" title="Paste"><ClipboardPaste className="w-4 h-4" /></button>
              <button onClick={clear} className="p-1.5 text-slate-400 hover:text-red-500" title="Clear"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16}
            placeholder={`<users>\n  <user id="1">\n    <name>John</name>\n    <email>john@example.com</email>\n  </user>\n</users>`}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono p-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Output JSON</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea value={output} readOnly rows={16}
            placeholder="JSON output will appear here..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-sm font-mono p-4 text-slate-800 dark:text-slate-200 resize-none" />
        </div>
      </div>
    </div>
  );
}
