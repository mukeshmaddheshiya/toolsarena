'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Copy, Check, RotateCcw, Sparkles, ChevronDown, ChevronUp,
  AlertCircle, Braces, Shield, Code2,
} from 'lucide-react';

/* ───── Types ───── */
interface Options {
  rootName: string;
  useInterface: boolean;
  allOptional: boolean;
  readonly: boolean;
  exportTypes: boolean;
  inlineNested: boolean;
  useUnknownForNull: boolean;
}

const DEFAULT_OPTIONS: Options = {
  rootName: 'Root',
  useInterface: true,
  allOptional: false,
  readonly: false,
  exportTypes: false,
  inlineNested: false,
  useUnknownForNull: false,
};

const EXAMPLE_JSON = JSON.stringify(
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    isActive: true,
    address: { street: '123 Main St', city: 'Mumbai', zip: '400001' },
    orders: [{ id: 101, amount: 599.99, status: 'delivered' }],
    tags: ['premium', 'verified'],
    metadata: null,
  },
  null,
  2,
);

/* ───── Conversion engine ───── */
interface TypeDef {
  name: string;
  fields: { key: string; type: string }[];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function singularize(s: string): string {
  if (s.endsWith('ies')) return s.slice(0, -3) + 'y';
  if (s.endsWith('ses') || s.endsWith('xes') || s.endsWith('zes'))
    return s.slice(0, -2);
  if (s.endsWith('s') && !s.endsWith('ss')) return s.slice(0, -1);
  return s;
}

function sanitizeKey(key: string): string {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
}

function inferType(
  value: unknown,
  name: string,
  collected: TypeDef[],
  opts: Options,
): string {
  if (value === null) return opts.useUnknownForNull ? 'unknown' : 'null';
  if (value === undefined) return 'undefined';

  switch (typeof value) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
      break;
    default:
      return 'unknown';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]';
    const elementTypes = value.map((el, i) =>
      inferType(el, singularize(name) + (i > 0 ? '' : ''), collected, opts),
    );
    const unique = [...new Set(elementTypes)];
    if (unique.length === 1) return `${unique[0]}[]`;
    return `(${unique.join(' | ')})[]`;
  }

  // Object -> create named interface
  const typeName = capitalize(name);
  const obj = value as Record<string, unknown>;
  const fields: { key: string; type: string }[] = [];

  for (const [k, v] of Object.entries(obj)) {
    const fieldType = inferType(v, k, collected, opts);
    fields.push({ key: k, type: fieldType });
  }

  if (!opts.inlineNested) {
    const exists = collected.find((t) => t.name === typeName);
    if (!exists) {
      collected.push({ name: typeName, fields });
    }
    return typeName;
  }

  // Inline: build inline object type
  const parts = fields.map((f) => {
    const ro = opts.readonly ? 'readonly ' : '';
    const opt = opts.allOptional ? '?' : '';
    return `${ro}${sanitizeKey(f.key)}${opt}: ${f.type}`;
  });
  return `{ ${parts.join('; ')} }`;
}

function generateTS(json: unknown, opts: Options): string {
  const collected: TypeDef[] = [];
  const rootType = inferType(json, opts.rootName, collected, opts);

  if (opts.inlineNested) {
    const exp = opts.exportTypes ? 'export ' : '';
    if (opts.useInterface) {
      // For inline mode with root being an object, unwrap
      if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
        const obj = json as Record<string, unknown>;
        const innerCollected: TypeDef[] = [];
        const fields: string[] = [];
        for (const [k, v] of Object.entries(obj)) {
          const ft = inferType(v, k, innerCollected, opts);
          const ro = opts.readonly ? 'readonly ' : '';
          const op = opts.allOptional ? '?' : '';
          fields.push(`  ${ro}${sanitizeKey(k)}${op}: ${ft};`);
        }
        return `${exp}interface ${opts.rootName} {\n${fields.join('\n')}\n}`;
      }
      return `${exp}type ${opts.rootName} = ${rootType};`;
    }
    return `${exp}type ${opts.rootName} = ${rootType};`;
  }

  // Separate interfaces mode
  const lines: string[] = [];
  const exp = opts.exportTypes ? 'export ' : '';

  // Reverse so root is last (more natural reading order: dependencies first)
  const ordered = [...collected].reverse();

  // Re-reverse to put root first (more intuitive)
  ordered.reverse();

  for (let idx = 0; idx < ordered.length; idx++) {
    const def = ordered[idx];
    if (idx > 0) lines.push('');
    if (opts.useInterface) {
      lines.push(`${exp}interface ${def.name} {`);
    } else {
      lines.push(`${exp}type ${def.name} = {`);
    }
    for (const f of def.fields) {
      const ro = opts.readonly ? 'readonly ' : '';
      const op = opts.allOptional ? '?' : '';
      lines.push(`  ${ro}${sanitizeKey(f.key)}${op}: ${f.type};`);
    }
    if (opts.useInterface) {
      lines.push('}');
    } else {
      lines.push('};');
    }
  }

  // If root is an array or primitive, add a type alias
  if (collected.length === 0 || (Array.isArray(json))) {
    if (collected.length > 0 && Array.isArray(json)) {
      lines.push('');
    }
    if (collected.length === 0) {
      lines.push(`${exp}type ${opts.rootName} = ${rootType};`);
    } else if (Array.isArray(json)) {
      lines.push(`${exp}type ${opts.rootName} = ${rootType};`);
    }
  }

  return lines.join('\n');
}

/* ───── Syntax highlight ───── */
function highlightTS(code: string): string {
  // Order matters: keywords, types, then strings, punctuation
  let html = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Strings (single and double quoted)
  html = html.replace(
    /('(?:[^'\\]|\\.)*')/g,
    '<span class="text-amber-600 dark:text-amber-400">$1</span>',
  );

  // Keywords
  html = html.replace(
    /\b(interface|type|export|readonly)\b/g,
    '<span class="text-purple-600 dark:text-purple-400 font-semibold">$1</span>',
  );

  // Types
  html = html.replace(
    /\b(string|number|boolean|null|unknown|undefined)\b/g,
    '<span class="text-teal-600 dark:text-teal-400">$1</span>',
  );

  // Braces and brackets
  html = html.replace(
    /([{}[\]()])/g,
    '<span class="text-slate-500 dark:text-slate-400">$1</span>',
  );

  return html;
}

/* ───── Error parsing ───── */
function parseJsonError(input: string, error: Error): string {
  const msg = error.message;
  const posMatch = msg.match(/position\s+(\d+)/i);
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    const before = input.slice(0, pos);
    const line = (before.match(/\n/g) || []).length + 1;
    const col = pos - before.lastIndexOf('\n');
    return `Syntax error at line ${line}, column ${col}: ${msg}`;
  }
  const lineMatch = msg.match(/line\s+(\d+)/i);
  if (lineMatch) {
    return `Syntax error at line ${lineMatch[1]}: ${msg}`;
  }
  return `Invalid JSON: ${msg}`;
}

/* ───── Component ───── */
export function JsonToTypescriptTool() {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { output: '', error: null };
    try {
      const parsed = JSON.parse(trimmed);
      const ts = generateTS(parsed, options);
      return { output: ts, error: null };
    } catch (e) {
      return { output: '', error: parseJsonError(trimmed, e as Error) };
    }
  }, [input, options]);

  const lineNumbers = useMemo(() => {
    const lines = input.split('\n').length;
    return Array.from({ length: Math.max(lines, 1) }, (_, i) => i + 1);
  }, [input]);

  const outputLines = useMemo(() => {
    if (!result.output) return [];
    return result.output.split('\n');
  }, [result.output]);

  const handleCopy = useCallback(async () => {
    if (!result.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
    } catch {
      const el = document.createElement('textarea');
      el.value = result.output;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result.output]);

  const handlePrettify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
    } catch {
      /* ignore if invalid */
    }
  }, [input]);

  const handleReset = useCallback(() => {
    setInput('');
    setOptions(DEFAULT_OPTIONS);
  }, []);

  const handleExample = useCallback(() => {
    setInput(EXAMPLE_JSON);
  }, []);

  const setOpt = <K extends keyof Options>(key: K, value: Options[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-5">
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleExample}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-900/50 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Try Example
        </button>
        <button
          onClick={handlePrettify}
          disabled={!input.trim()}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Braces className="w-3.5 h-3.5" />
          Prettify
        </button>
        <button
          onClick={handleReset}
          disabled={!input.trim()}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear
        </button>

        <div className="flex-1" />

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <Code2 className="w-3.5 h-3.5" />
          Settings
          {showSettings ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
          {/* Root name */}
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Root type name
            </span>
            <input
              type="text"
              value={options.rootName}
              onChange={(e) => setOpt('rootName', e.target.value || 'Root')}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              placeholder="Root"
            />
          </label>

          {/* Toggle options */}
          {(
            [
              ['useInterface', 'Use interface (vs type)'],
              ['allOptional', 'All properties optional (?)'],
              ['readonly', 'Add readonly modifier'],
              ['exportTypes', 'Export types'],
              ['inlineNested', 'Inline nested types'],
              ['useUnknownForNull', 'Use unknown for null'],
            ] as [keyof Options, string][]
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={options[key] as boolean}
                onChange={(e) => setOpt(key, e.target.checked as never)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-teal-600 focus:ring-teal-500 accent-teal-600"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {label}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* Editor panels */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* JSON input */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              JSON Input
            </label>
            {result.error && (
              <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="w-3 h-3" />
                Error
              </span>
            )}
            {result.output && !result.error && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <Check className="w-3 h-3" />
                Valid
              </span>
            )}
          </div>
          <div className="relative flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex-1 min-h-[320px] md:min-h-[480px]">
            {/* Line numbers */}
            <div
              className="select-none py-3 px-2 text-right text-xs leading-[1.625rem] font-mono text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-700 overflow-hidden min-w-[2.5rem]"
              aria-hidden="true"
            >
              {lineNumbers.map((n) => (
                <div key={n}>{n}</div>
              ))}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your JSON here...'
              spellCheck={false}
              className="flex-1 py-3 px-3 font-mono text-sm leading-[1.625rem] resize-none bg-transparent text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>
          {/* Error message */}
          {result.error && (
            <div className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{result.error}</span>
            </div>
          )}
        </div>

        {/* TypeScript output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              TypeScript Output
            </label>
            <button
              onClick={handleCopy}
              disabled={!result.output}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                copied
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="relative flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 overflow-hidden flex-1 min-h-[320px] md:min-h-[480px]">
            {/* Line numbers */}
            <div
              className="select-none py-3 px-2 text-right text-xs leading-[1.625rem] font-mono text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 overflow-hidden min-w-[2.5rem]"
              aria-hidden="true"
            >
              {outputLines.length > 0
                ? outputLines.map((_, i) => <div key={i}>{i + 1}</div>)
                : <div>1</div>}
            </div>
            <div className="flex-1 py-3 px-3 font-mono text-sm leading-[1.625rem] overflow-auto">
              {result.output ? (
                <pre className="whitespace-pre">
                  {outputLines.map((line, i) => (
                    <div
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: highlightTS(line) || '&nbsp;',
                      }}
                    />
                  ))}
                </pre>
              ) : (
                <span className="text-slate-400 dark:text-slate-600 italic">
                  TypeScript types will appear here...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trust badge */}
      <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <span className="text-xs text-slate-600 dark:text-slate-400">
          100% client-side. Your JSON never leaves your browser.
        </span>
      </div>
    </div>
  );
}
