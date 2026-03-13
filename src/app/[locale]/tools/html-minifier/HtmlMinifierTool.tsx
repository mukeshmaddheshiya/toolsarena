'use client';
import { useState, useCallback, useEffect } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { Minimize2 } from 'lucide-react';

// Optional closing tags that can be removed
const OPTIONAL_CLOSE_TAGS = [
  'li', 'dt', 'dd', 'p', 'rt', 'rp', 'optgroup', 'option',
  'colgroup', 'caption', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function minifyHtml(
  html: string,
  opts: {
    removeComments: boolean;
    collapseWhitespace: boolean;
    collapseSpaces: boolean;
    removeOptionalTags: boolean;
  }
): string {
  // Extract <script> and <style> blocks so their contents are not mangled
  const preserved: string[] = [];
  let result = html.replace(
    /(<(?:script|style)[^>]*>)([\s\S]*?)(<\/(?:script|style)>)/gi,
    (_, open, content, close) => {
      const idx = preserved.length;
      preserved.push(open + content + close);
      return `\x00PRESERVED${idx}\x00`;
    }
  );

  // 1. Remove HTML comments (but not IE conditional comments)
  if (opts.removeComments) {
    result = result.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
  }

  // 2. Trim each line
  result = result
    .split('\n')
    .map(line => line.trim())
    .join('\n');

  // 3. Collapse whitespace between tags
  if (opts.collapseWhitespace) {
    result = result.replace(/>\s+</g, '><');
  }

  // 4. Collapse multiple spaces
  if (opts.collapseSpaces) {
    result = result.replace(/[ \t]{2,}/g, ' ');
  }

  // 5. Remove blank lines
  result = result.replace(/\n+/g, '');

  // 6. Remove optional closing tags
  if (opts.removeOptionalTags) {
    for (const tag of OPTIONAL_CLOSE_TAGS) {
      const re = new RegExp(`</${tag}>`, 'gi');
      result = result.replace(re, '');
    }
  }

  // Restore preserved blocks
  result = result.replace(/\x00PRESERVED(\d+)\x00/g, (_, idx) => preserved[parseInt(idx)]);

  return result.trim();
}

export function HtmlMinifierTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [removeComments, setRemoveComments] = useState(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [removeOptionalTags, setRemoveOptionalTags] = useState(false);

  const opts = { removeComments, collapseWhitespace, collapseSpaces, removeOptionalTags };

  const doMinify = useCallback(() => {
    setOutput(minifyHtml(input, opts));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, removeComments, collapseWhitespace, collapseSpaces, removeOptionalTags]);

  // Auto-minify for small inputs
  useEffect(() => {
    if (input.length > 0 && input.length <= 10240) {
      setOutput(minifyHtml(input, opts));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, removeComments, collapseWhitespace, collapseSpaces, removeOptionalTags]);

  const origBytes = new TextEncoder().encode(input).length;
  const minBytes = new TextEncoder().encode(output).length;
  const savings = origBytes > 0 ? origBytes - minBytes : 0;
  const savingsPct = origBytes > 0 ? ((savings / origBytes) * 100).toFixed(1) : '0';

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';

  return (
    <div className="space-y-5">
      {/* Options */}
      <div className="grid sm:grid-cols-2 gap-3">
        {(
          [
            { key: 'removeComments', label: 'Remove HTML comments', value: removeComments, set: setRemoveComments },
            { key: 'collapseWhitespace', label: 'Remove whitespace between tags', value: collapseWhitespace, set: setCollapseWhitespace },
            { key: 'collapseSpaces', label: 'Collapse multiple spaces', value: collapseSpaces, set: setCollapseSpaces },
            { key: 'removeOptionalTags', label: 'Remove optional closing tags', value: removeOptionalTags, set: setRemoveOptionalTags },
          ] as const
        ).map(opt => (
          <label
            key={opt.key}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <input
              type="checkbox"
              checked={opt.value}
              onChange={e => (opt.set as (v: boolean) => void)(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 cursor-pointer"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
              {opt.label}
            </span>
          </label>
        ))}
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          HTML Input
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste your HTML here..."
          className={`${inputClass} min-h-[200px] font-mono resize-y`}
        />
      </div>

      {/* Minify button (for large inputs) */}
      {input.length > 10240 && (
        <button
          onClick={doMinify}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
        >
          <Minimize2 className="w-4 h-4" />
          Minify HTML
        </button>
      )}

      {/* Stats */}
      {output && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Original', value: formatBytes(origBytes) },
            { label: 'Minified', value: formatBytes(minBytes) },
            { label: 'Savings', value: `${formatBytes(savings)} (${savingsPct}%)` },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center"
            >
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">
                {stat.label}
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Minified Output
            </label>
            <CopyButton text={output} size="sm" />
          </div>
          <textarea
            value={output}
            readOnly
            className={`${inputClass} min-h-[150px] font-mono resize-y bg-slate-50 dark:bg-slate-900`}
          />
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5">
            <strong>Note:</strong> Whitespace inside <code>&lt;script&gt;</code> and <code>&lt;style&gt;</code> blocks may be affected. Review the output before using in production.
          </p>
        </div>
      )}
    </div>
  );
}
