'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Download, Eye, Code2 } from 'lucide-react';

const SAMPLE = `# Welcome to Markdown to HTML

This tool converts **Markdown** to clean *HTML* instantly.

## Features

- Converts headings, paragraphs, lists
- Supports **bold**, *italic*, \`inline code\`
- Handles [links](https://example.com) and images
- Fenced code blocks with syntax hints
- Tables and blockquotes

## Example Code

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table Example

| Name    | Role      | Score |
|---------|-----------|-------|
| Alice   | Developer | 95    |
| Bob     | Designer  | 88    |

> This is a blockquote. Use it to highlight important notes.

---

Visit [ToolsArena](https://toolsarena.vercel.app) for more free tools!
`;

// Simple but solid Markdown → HTML parser (no dependencies)
function parseMarkdown(md: string): string {
  let html = md;

  // Escape HTML entities first (except in code blocks)
  const codeBlocks: string[] = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre><code${lang ? ` class="language-${lang}"` : ''}>${escaped}</code></pre>`);
    return `\x00CODE${idx}\x00`;
  });

  // Inline code
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const escaped = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const idx = inlineCodes.length;
    inlineCodes.push(`<code>${escaped}</code>`);
    return `\x00INLINE${idx}\x00`;
  });

  // Headings
  html = html.replace(/^(#{1,6})\s+(.+)$/gm, (_, hashes, text) => {
    const level = hashes.length;
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  // Horizontal rule
  html = html.replace(/^[-*_]{3,}$/gm, '<hr>');

  // Blockquote
  html = html.replace(/^>\s?(.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Tables
  html = html.replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/g, (_, header, body) => {
    const headers = header.split('|').map((h: string) => h.trim()).filter(Boolean);
    const rows = body.trim().split('\n').map((row: string) =>
      row.split('|').map((c: string) => c.trim()).filter(Boolean)
    );
    const thead = `<thead><tr>${headers.map((h: string) => `<th>${h}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows.map((row: string[]) => `<tr>${row.map((c: string) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
    return `<table>\n${thead}\n${tbody}\n</table>`;
  });

  // Unordered lists
  html = html.replace(/((?:^[-*+]\s+.+\n?)+)/gm, match => {
    const items = match.trim().split('\n').map(l => `<li>${l.replace(/^[-*+]\s+/, '')}</li>`).join('');
    return `<ul>${items}</ul>\n`;
  });

  // Ordered lists
  html = html.replace(/((?:^\d+\.\s+.+\n?)+)/gm, match => {
    const items = match.trim().split('\n').map(l => `<li>${l.replace(/^\d+\.\s+/, '')}</li>`).join('');
    return `<ol>${items}</ol>\n`;
  });

  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Links & images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Paragraphs (double newline = paragraph break)
  html = html.replace(/\n{2,}/g, '\n\n');
  const blocks = html.split('\n\n');
  html = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    if (/^<(h[1-6]|ul|ol|li|blockquote|hr|table|pre|div)/.test(block)) return block;
    if (block.startsWith('\x00CODE')) return block;
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  // Restore code blocks
  codeBlocks.forEach((code, i) => { html = html.replace(`\x00CODE${i}\x00`, code); });
  inlineCodes.forEach((code, i) => { html = html.replace(`\x00INLINE${i}\x00`, code); });

  return html.trim();
}

export function MarkdownToHtmlTool() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [previewMode, setPreviewMode] = useState<'split' | 'preview' | 'code'>('split');
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => parseMarkdown(markdown), [markdown]);

  const copy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const full = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Converted Markdown</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #374151; }
  h1,h2,h3,h4,h5,h6 { font-weight: 700; margin-top: 1.5rem; }
  code { background: #f3f4f6; padding: 0.1em 0.3em; border-radius: 4px; font-size: 0.9em; }
  pre { background: #1f2937; color: #e5e7eb; padding: 1rem; border-radius: 8px; overflow-x: auto; }
  pre code { background: none; color: inherit; }
  blockquote { border-left: 4px solid #3b82f6; margin: 0; padding-left: 1rem; color: #6b7280; }
  table { border-collapse: collapse; width: 100%; }
  th,td { border: 1px solid #e5e7eb; padding: 0.5rem 1rem; text-align: left; }
  th { background: #f9fafb; }
  hr { border: none; border-top: 1px solid #e5e7eb; }
  img { max-width: 100%; }
  a { color: #3b82f6; }
</style>
</head>
<body>
${html}
</body>
</html>`;
    const blob = new Blob([full], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-3 flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
          {([
            { id: 'split',   label: 'Split',   icon: <ArrowLeftRightIcon /> },
            { id: 'preview', label: 'Preview', icon: <Eye className="w-3.5 h-3.5" /> },
            { id: 'code',    label: 'HTML',    icon: <Code2 className="w-3.5 h-3.5" /> },
          ] as const).map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setPreviewMode(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                previewMode === id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          {copied ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy HTML</>}
        </button>
        <button onClick={download} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors">
          <Download className="w-3.5 h-3.5" /> Download .html
        </button>
      </div>

      {/* Panes */}
      <div className={`grid gap-4 ${previewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Markdown editor */}
        {(previewMode === 'split' || previewMode === 'code') && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Markdown</span>
              <button onClick={() => setMarkdown('')} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Clear</button>
            </div>
            <textarea
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
              placeholder="Type or paste Markdown here…"
              spellCheck={false}
              className="w-full h-96 p-4 font-mono text-sm bg-transparent text-gray-800 dark:text-gray-200 resize-none focus:outline-none"
            />
          </div>
        )}

        {/* Output */}
        {previewMode !== 'code' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preview</span>
            </div>
            <div
              className="p-5 h-96 overflow-y-auto prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}

        {previewMode === 'code' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">HTML Output</span>
            </div>
            <textarea
              value={html}
              readOnly
              spellCheck={false}
              className="w-full h-96 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 resize-none focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 px-1">
        <span>{markdown.split(/\s+/).filter(Boolean).length} words</span>
        <span>·</span>
        <span>{markdown.length} chars</span>
        <span>·</span>
        <span>HTML: {html.length} chars</span>
      </div>
    </div>
  );
}

function ArrowLeftRightIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M21 12H3M3 12l4-4M3 12l4 4M21 12l-4-4M21 12l-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
