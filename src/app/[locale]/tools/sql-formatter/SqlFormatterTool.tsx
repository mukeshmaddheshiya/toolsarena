'use client';
import { useState, useCallback } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { ClipboardPaste, Trash2 } from 'lucide-react';

const KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'UNION', 'UNION ALL', 'AS', 'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IN', 'NOT', 'NULL', 'IS', 'BETWEEN', 'LIKE', 'EXISTS', 'INTO', 'WITH'];

function formatSQL(sql: string, indentSize: number): string {
  const indent = ' '.repeat(indentSize);
  let formatted = sql.trim();
  // Normalize whitespace
  formatted = formatted.replace(/\s+/g, ' ');

  // Uppercase keywords
  const kwRegex = new RegExp(`\\b(${KEYWORDS.map(k => k.replace(/\s/g, '\\s+')).join('|')})\\b`, 'gi');
  formatted = formatted.replace(kwRegex, (m) => m.toUpperCase());

  // Add newlines before major keywords
  const majorKw = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL', 'INSERT INTO', 'UPDATE', 'DELETE FROM', 'SET', 'VALUES', 'WITH'];
  for (const kw of majorKw) {
    const re = new RegExp(`\\b${kw}\\b`, 'g');
    formatted = formatted.replace(re, `\n${kw}`);
  }

  // Add newline+indent before JOIN keywords
  const joinKw = ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'JOIN'];
  for (const kw of joinKw) {
    const re = new RegExp(`\\b${kw}\\b`, 'g');
    formatted = formatted.replace(re, `\n${kw}`);
  }

  // Indent AND/OR
  formatted = formatted.replace(/\b(AND|OR)\b/g, `\n${indent}$1`);

  // Indent ON
  formatted = formatted.replace(/\bON\b/g, `\n${indent}ON`);

  // Clean up
  formatted = formatted.replace(/^\n+/, '');
  formatted = formatted.replace(/\n\s*\n/g, '\n');

  // Indent subqueries (basic)
  const lines = formatted.split('\n');
  let level = 0;
  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    const opens = (trimmed.match(/\(/g) || []).length;
    const closes = (trimmed.match(/\)/g) || []).length;
    if (closes > opens) level = Math.max(0, level - (closes - opens));
    result.push(indent.repeat(level) + trimmed);
    if (opens > closes) level += opens - closes;
  }

  return result.join('\n');
}

export function SqlFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const handleFormat = useCallback(() => {
    if (!input.trim()) return;
    setOutput(formatSQL(input, indentSize));
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
          </select>
        </div>
        <button onClick={handleFormat} disabled={!input.trim()}
          className="px-4 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-xs font-medium transition-colors">
          Format SQL
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Input SQL</label>
            <div className="flex gap-1">
              <button onClick={handlePaste} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" title="Paste"><ClipboardPaste className="w-4 h-4" /></button>
              <button onClick={clear} className="p-1.5 text-slate-400 hover:text-red-500" title="Clear"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14}
            placeholder="SELECT u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100 ORDER BY o.total DESC"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono p-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Formatted SQL</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea value={output} readOnly rows={14}
            placeholder="Formatted SQL will appear here..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-sm font-mono p-4 text-slate-800 dark:text-slate-200 resize-none" />
        </div>
      </div>
    </div>
  );
}
