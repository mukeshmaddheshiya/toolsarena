'use client';
import { useState, useCallback } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { ClipboardPaste, Trash2 } from 'lucide-react';

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function beautifyHTML(html: string, indentSize: number = 2): string {
  const indent = ' '.repeat(indentSize);
  let result = '';
  let level = 0;

  // Normalize whitespace between tags
  let clean = html.replace(/>\s+</g, '><').trim();
  // Split into tokens (tags and text)
  const tokens = clean.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) || [];

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    // Comment
    if (trimmed.startsWith('<!--')) {
      result += indent.repeat(level) + trimmed + '\n';
      continue;
    }

    // Closing tag
    if (trimmed.startsWith('</')) {
      level = Math.max(0, level - 1);
      result += indent.repeat(level) + trimmed + '\n';
      continue;
    }

    // Opening tag
    if (trimmed.startsWith('<')) {
      result += indent.repeat(level) + trimmed + '\n';
      const tagName = (trimmed.match(/<([a-zA-Z][a-zA-Z0-9-]*)/)?.[1] || '').toLowerCase();
      // Don't increase indent for void/self-closing tags
      if (!VOID_TAGS.has(tagName) && !trimmed.endsWith('/>')) {
        level++;
      }
      continue;
    }

    // Text content
    result += indent.repeat(level) + trimmed + '\n';
  }

  return result.trimEnd();
}

export function HtmlBeautifierTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const handleBeautify = useCallback(() => {
    if (!input.trim()) return;
    setOutput(beautifyHTML(input, indentSize));
  }, [input, indentSize]);

  const handlePaste = async () => {
    try { const t = await navigator.clipboard.readText(); setInput(t); } catch {}
  };

  const clear = () => { setInput(''); setOutput(''); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Indent:</label>
          <select value={indentSize} onChange={(e) => setIndentSize(Number(e.target.value))}
            className="text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1">
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 tab</option>
          </select>
        </div>
        <button onClick={handleBeautify} disabled={!input.trim()}
          className="px-4 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-xs font-medium transition-colors">
          Beautify HTML
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Input HTML</label>
            <div className="flex gap-1">
              <button onClick={handlePaste} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" title="Paste"><ClipboardPaste className="w-4 h-4" /></button>
              <button onClick={clear} className="p-1.5 text-slate-400 hover:text-red-500" title="Clear"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16}
            placeholder='<div><h1>Hello</h1><p>World</p></div>'
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono p-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Beautified HTML</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea value={output} readOnly rows={16}
            placeholder="Formatted HTML will appear here..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-sm font-mono p-4 text-slate-800 dark:text-slate-200 resize-none" />
        </div>
      </div>
    </div>
  );
}
