'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Bold,
  Italic,
  Heading,
  Link,
  Image,
  Code,
  List,
  Quote,
  Minus,
  Download,
  Upload,
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Lightweight Markdown-to-HTML converter (no external dependency)    */
/* ------------------------------------------------------------------ */
function markdownToHtml(md: string): string {
  let html = md;

  // Fenced code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
    return `<pre class="md-pre"><code>${escapeHtml(code.trimEnd())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="md-code">$1</code>');

  // Images (before links so ![...](...) is not caught by link regex)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="md-img" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>');

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // Horizontal rule
  html = html.replace(/^---+$/gm, '<hr />');

  // Blockquote
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>');

  // Bold & italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Unordered list items
  html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul class="md-ul">$1</ul>');

  // Ordered list items
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

  // Paragraphs: wrap remaining bare lines
  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<[a-z]/.test(trimmed)) return trimmed; // already wrapped
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .join('\n');

  return html;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ------------------------------------------------------------------ */
/*  Toolbar button definitions                                        */
/* ------------------------------------------------------------------ */
interface ToolbarBtn {
  label: string;
  icon: React.ReactNode;
  prefix: string;
  suffix: string;
  block?: boolean;
}

const TOOLBAR: ToolbarBtn[] = [
  { label: 'Bold', icon: <Bold className="w-4 h-4" />, prefix: '**', suffix: '**' },
  { label: 'Italic', icon: <Italic className="w-4 h-4" />, prefix: '*', suffix: '*' },
  { label: 'Heading', icon: <Heading className="w-4 h-4" />, prefix: '## ', suffix: '', block: true },
  { label: 'Link', icon: <Link className="w-4 h-4" />, prefix: '[', suffix: '](url)' },
  { label: 'Image', icon: <Image className="w-4 h-4" />, prefix: '![alt](', suffix: ')' },
  { label: 'Code', icon: <Code className="w-4 h-4" />, prefix: '`', suffix: '`' },
  { label: 'List', icon: <List className="w-4 h-4" />, prefix: '- ', suffix: '', block: true },
  { label: 'Blockquote', icon: <Quote className="w-4 h-4" />, prefix: '> ', suffix: '', block: true },
  { label: 'HR', icon: <Minus className="w-4 h-4" />, prefix: '\n---\n', suffix: '' },
];

/* ------------------------------------------------------------------ */
/*  Default sample markdown                                           */
/* ------------------------------------------------------------------ */
const DEFAULT_MD = `# Welcome to Markdown Editor

Write your **markdown** here and see the *live preview* on the right.

## Features

- Bold, italic, headings, links
- Code blocks and inline \`code\`
- Lists, blockquotes, horizontal rules
- Upload .md files or download your work

> This editor runs entirely in your browser. Nothing is uploaded.

---

### Code Example

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

[Visit ToolsArena](https://toolsarena.com)
`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function MarkdownEditorTool() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [showPreview, setShowPreview] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Stats */
  const charCount = markdown.length;
  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const lineCount = markdown.split('\n').length;

  /* Insert syntax at cursor */
  const insertSyntax = useCallback(
    (btn: ToolbarBtn) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = markdown.substring(start, end);
      const before = markdown.substring(0, start);
      const after = markdown.substring(end);

      let insertion: string;
      if (btn.block && !selected) {
        insertion = `${btn.prefix}text${btn.suffix}`;
      } else {
        insertion = `${btn.prefix}${selected || 'text'}${btn.suffix}`;
      }

      const newMd = before + insertion + after;
      setMarkdown(newMd);

      // Restore cursor position after React re-render
      const cursorPos = start + insertion.length;
      requestAnimationFrame(() => {
        ta.focus();
        ta.selectionStart = cursorPos;
        ta.selectionEnd = cursorPos;
      });
    },
    [markdown],
  );

  /* File upload */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setMarkdown(text);
    };
    reader.readAsText(file);
    // Reset so the same file can be re-uploaded
    e.target.value = '';
  };

  /* Download as .md */
  const downloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  /* Copy rendered HTML */
  const copyHtml = async () => {
    const html = markdownToHtml(markdown);
    try {
      await navigator.clipboard.writeText(html);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = html;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  };

  /* Rendered HTML for preview */
  const renderedHtml = markdownToHtml(markdown);

  /* Preview style block */
  const previewStyles = `
    .md-preview h1 { font-size:1.75rem; font-weight:700; margin:1rem 0 0.5rem; }
    .md-preview h2 { font-size:1.4rem; font-weight:700; margin:1rem 0 0.5rem; }
    .md-preview h3 { font-size:1.2rem; font-weight:600; margin:0.75rem 0 0.4rem; }
    .md-preview h4 { font-size:1.1rem; font-weight:600; margin:0.5rem 0 0.3rem; }
    .md-preview p { margin:0.5rem 0; line-height:1.7; }
    .md-preview ul.md-ul { list-style:disc; padding-left:1.5rem; margin:0.5rem 0; }
    .md-preview li { margin:0.2rem 0; }
    .md-preview .md-pre { background:#1e293b; color:#e2e8f0; padding:1rem; border-radius:0.5rem; overflow-x:auto; margin:0.75rem 0; font-size:0.85rem; }
    .md-preview .md-code { background:#f1f5f9; color:#dc2626; padding:0.15rem 0.35rem; border-radius:0.25rem; font-size:0.9em; }
    .dark .md-preview .md-code { background:#334155; color:#fbbf24; }
    .md-preview .md-link { color:#2563eb; text-decoration:underline; }
    .dark .md-preview .md-link { color:#60a5fa; }
    .md-preview .md-blockquote { border-left:4px solid #94a3b8; padding:0.5rem 1rem; margin:0.75rem 0; color:#64748b; background:#f8fafc; border-radius:0 0.5rem 0.5rem 0; }
    .dark .md-preview .md-blockquote { border-left-color:#475569; color:#94a3b8; background:#1e293b; }
    .md-preview hr { border:none; border-top:2px solid #e2e8f0; margin:1rem 0; }
    .dark .md-preview hr { border-top-color:#334155; }
    .md-preview img.md-img { max-width:100%; border-radius:0.5rem; margin:0.5rem 0; }
  `;

  return (
    <div className="space-y-4">
      <style dangerouslySetInnerHTML={{ __html: previewStyles }} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-2">
        {TOOLBAR.map((btn) => (
          <button
            key={btn.label}
            title={btn.label}
            onClick={() => insertSyntax(btn)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {btn.icon}
          </button>
        ))}

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

        {/* Upload */}
        <button
          title="Upload .md file"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <Upload className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt,text/markdown,text/plain"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Download */}
        <button
          title="Download as .md"
          onClick={downloadMd}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Copy HTML */}
        <button
          title="Copy rendered HTML"
          onClick={copyHtml}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

        {/* Toggle preview */}
        <button
          title={showPreview ? 'Hide preview' : 'Show preview'}
          onClick={() => setShowPreview(!showPreview)}
          className={`p-2 rounded-lg transition-colors ${
            showPreview
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Editor + Preview */}
      <div className={`grid gap-4 ${showPreview ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor pane */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Markdown
          </p>
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            className="w-full h-[500px] rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm p-4 font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y"
            placeholder="Type your markdown here..."
          />
        </div>

        {/* Preview pane */}
        {showPreview && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Preview
            </p>
            <div
              className="md-preview w-full h-[500px] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-slate-800 dark:text-slate-200 text-sm"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-2">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
        <span>{lineCount} lines</span>
      </div>
    </div>
  );
}
