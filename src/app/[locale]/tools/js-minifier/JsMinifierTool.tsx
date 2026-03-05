'use client';
import { useState, useCallback } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { ClipboardPaste, Trash2 } from 'lucide-react';

function minifyJS(code: string): string {
  let result = code;
  // Remove single-line comments (but not URLs like http://)
  result = result.replace(/(?<![:\/"'])\/\/.*$/gm, '');
  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  // Collapse whitespace (preserve strings)
  const parts: string[] = [];
  let inStr: string | null = null;
  let escaped = false;
  let current = '';
  for (let i = 0; i < result.length; i++) {
    const ch = result[i];
    if (escaped) { current += ch; escaped = false; continue; }
    if (ch === '\\') { current += ch; escaped = true; continue; }
    if (!inStr && (ch === '"' || ch === "'" || ch === '`')) { current += ch; inStr = ch; continue; }
    if (inStr && ch === inStr) { current += ch; inStr = null; continue; }
    if (!inStr && /\s/.test(ch)) {
      if (current.length > 0) parts.push(current);
      current = '';
      // Keep one space if between word characters
      const prev = result[i - 1];
      const next = result[i + 1];
      if (prev && next && /\w/.test(prev) && /\w/.test(next)) {
        parts.push(' ');
      }
      continue;
    }
    current += ch;
  }
  if (current) parts.push(current);
  result = parts.join('');
  // Remove spaces around operators
  result = result.replace(/\s*([{}()[\];,<>=!&|?:+\-*/%^~])\s*/g, '$1');
  // Restore necessary spaces
  result = result.replace(/\b(var|let|const|return|typeof|instanceof|in|of|new|delete|throw|case|void|yield|async|await|function|class|extends|import|export|from|default|if|else|for|while|do|switch|break|continue|try|catch|finally)\b/g, ' $1 ');
  // Clean up double spaces
  result = result.replace(/\s{2,}/g, ' ');
  result = result.replace(/;\s*}/g, '}');
  return result.trim();
}

export function JsMinifierTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState<{ original: number; minified: number } | null>(null);

  const handleMinify = useCallback(() => {
    if (!input.trim()) return;
    const result = minifyJS(input);
    setOutput(result);
    setStats({ original: new Blob([input]).size, minified: new Blob([result]).size });
  }, [input]);

  const handlePaste = async () => {
    try { const t = await navigator.clipboard.readText(); setInput(t); } catch {}
  };

  const clear = () => { setInput(''); setOutput(''); setStats(null); };
  const saved = stats ? stats.original - stats.minified : 0;
  const pct = stats && stats.original > 0 ? Math.round((saved / stats.original) * 100) : 0;

  return (
    <div className="space-y-4">
      {stats && (
        <div className="flex flex-wrap gap-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 text-sm">
          <span className="text-slate-600 dark:text-slate-400">Original: <strong className="text-slate-800 dark:text-slate-200">{(stats.original / 1024).toFixed(2)} KB</strong></span>
          <span className="text-slate-600 dark:text-slate-400">Minified: <strong className="text-slate-800 dark:text-slate-200">{(stats.minified / 1024).toFixed(2)} KB</strong></span>
          <span className="text-green-700 dark:text-green-400 font-semibold">Saved {pct}% ({(saved / 1024).toFixed(2)} KB)</span>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Input JavaScript</label>
            <div className="flex gap-1">
              <button onClick={handlePaste} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" title="Paste"><ClipboardPaste className="w-4 h-4" /></button>
              <button onClick={clear} className="p-1.5 text-slate-400 hover:text-red-500" title="Clear"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} placeholder={`function greet(name) {\n  // Say hello\n  console.log("Hello, " + name);\n}`} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono p-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Minified JavaScript</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea value={output} readOnly rows={14} placeholder="Minified JS will appear here..." className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-sm font-mono p-4 text-slate-800 dark:text-slate-200 resize-none" />
        </div>
      </div>
      <button onClick={handleMinify} disabled={!input.trim()} className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors">
        Minify JavaScript
      </button>
    </div>
  );
}
