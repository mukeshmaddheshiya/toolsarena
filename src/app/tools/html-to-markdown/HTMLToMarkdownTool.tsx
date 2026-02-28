'use client';
import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { RotateCcw } from 'lucide-react';

function htmlToMarkdown(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  function processNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    const children = Array.from(el.childNodes).map(processNode).join('');

    switch (tag) {
      case 'h1':
        return `# ${children.trim()}\n\n`;
      case 'h2':
        return `## ${children.trim()}\n\n`;
      case 'h3':
        return `### ${children.trim()}\n\n`;
      case 'h4':
        return `#### ${children.trim()}\n\n`;
      case 'h5':
        return `##### ${children.trim()}\n\n`;
      case 'h6':
        return `###### ${children.trim()}\n\n`;
      case 'p':
        return `${children.trim()}\n\n`;
      case 'br':
        return '\n';
      case 'strong':
      case 'b':
        return `**${children}**`;
      case 'em':
      case 'i':
        return `_${children}_`;
      case 'del':
      case 's':
        return `~~${children}~~`;
      case 'code':
        return `\`${children}\``;
      case 'pre':
        return `\`\`\`\n${children.trim()}\n\`\`\`\n\n`;
      case 'blockquote':
        return (
          children
            .trim()
            .split('\n')
            .map((l) => `> ${l}`)
            .join('\n') + '\n\n'
        );
      case 'a':
        return `[${children}](${el.getAttribute('href') || '#'})`;
      case 'img':
        return `![${el.getAttribute('alt') || ''}](${el.getAttribute('src') || ''})`;
      case 'ul':
        return children + '\n';
      case 'ol': {
        let idx = 1;
        return (
          Array.from(el.querySelectorAll(':scope > li'))
            .map((li) => `${idx++}. ${li.textContent?.trim()}`)
            .join('\n') + '\n\n'
        );
      }
      case 'li':
        return `- ${children.trim()}\n`;
      case 'hr':
        return '\n---\n\n';
      case 'table': {
        const rows = Array.from(el.querySelectorAll('tr'));
        if (rows.length === 0) return '';
        const headerCells = Array.from(rows[0].querySelectorAll('th, td')).map(
          (c) => c.textContent?.trim() || ''
        );
        const header = `| ${headerCells.join(' | ')} |`;
        const separator = `| ${headerCells.map(() => '---').join(' | ')} |`;
        const body = rows
          .slice(1)
          .map(
            (r) =>
              `| ${Array.from(r.querySelectorAll('td'))
                .map((c) => c.textContent?.trim() || '')
                .join(' | ')} |`
          )
          .join('\n');
        return `${header}\n${separator}\n${body}\n\n`;
      }
      case 'head':
      case 'script':
      case 'style':
        return '';
      default:
        return children;
    }
  }

  return processNode(doc.body).replace(/\n{3,}/g, '\n\n').trim();
}

const SAMPLE_HTML = `<h1>Welcome to ToolsArena</h1>
<p>This is a <strong>free online tool</strong> to convert HTML to <em>Markdown</em>.</p>
<h2>Features</h2>
<ul>
  <li>Instant conversion</li>
  <li>Supports <code>inline code</code></li>
  <li>Handles <a href="https://toolsarena.in">links</a></li>
</ul>
<blockquote>All processing happens in your browser.</blockquote>
<h2>Example Table</h2>
<table>
  <tr><th>Name</th><th>Role</th></tr>
  <tr><td>Alice</td><td>Developer</td></tr>
  <tr><td>Bob</td><td>Designer</td></tr>
</table>`;

export function HTMLToMarkdownTool() {
  const [html, setHtml] = useState('');

  const markdown = useMemo(() => {
    if (!html.trim()) return '';
    try {
      return htmlToMarkdown(html);
    } catch {
      return '';
    }
  }, [html]);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* HTML Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              HTML Input
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setHtml(SAMPLE_HTML)}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
              >
                Load sample
              </button>
              {html && (
                <button
                  onClick={() => setHtml('')}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Paste HTML here..."
            className="tool-textarea min-h-[320px] text-xs"
            spellCheck={false}
          />
        </div>

        {/* Markdown Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Markdown Output
            </label>
            {markdown && <CopyButton text={markdown} size="sm" />}
          </div>
          <textarea
            value={markdown}
            readOnly
            placeholder="Markdown will appear here..."
            className="tool-textarea min-h-[320px] text-xs bg-slate-50 dark:bg-slate-900"
            spellCheck={false}
          />
        </div>
      </div>

      {html && markdown && (
        <p className="text-xs text-slate-400">
          {html.length.toLocaleString()} chars HTML → {markdown.length.toLocaleString()} chars
          Markdown
        </p>
      )}
    </div>
  );
}
