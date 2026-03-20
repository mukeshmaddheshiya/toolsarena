'use client';

import { useState, useMemo } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  AlertCircle,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type SchemaVersion = 'draft-07' | 'draft-2019-09' | 'draft-2020-12';

interface GeneratorOptions {
  version: SchemaVersion;
  addTitleDescription: boolean;
  markAllRequired: boolean;
  noAdditionalProperties: boolean;
}

type JsonSchema = Record<string, unknown>;

// ─── Constants ────────────────────────────────────────────────────────────────

const SCHEMA_URIS: Record<SchemaVersion, string> = {
  'draft-07': 'http://json-schema.org/draft-07/schema#',
  'draft-2019-09': 'https://json-schema.org/draft/2019-09/schema',
  'draft-2020-12': 'https://json-schema.org/draft/2020-12/schema',
};

const SAMPLE_JSON = JSON.stringify(
  {
    id: 1,
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    username: 'john_doe',
    email: 'john@example.com',
    website: 'https://johndoe.dev',
    birthdate: '1990-05-15',
    createdAt: '2024-01-15T10:30:00Z',
    isActive: true,
    score: 98.5,
    tags: ['developer', 'designer'],
    address: {
      street: '123 Main St',
      city: 'New York',
      zip: '10001',
      country: 'US',
    },
    preferences: {
      theme: 'dark',
      notifications: true,
      language: 'en',
    },
    roles: ['admin', 'user'],
    lastLogin: null,
  },
  null,
  2
);

// ─── Format Detectors ─────────────────────────────────────────────────────────

const FORMAT_PATTERNS: Array<{ format: string; pattern: RegExp }> = [
  { format: 'email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  { format: 'uri', pattern: /^https?:\/\/.+/ },
  { format: 'date', pattern: /^\d{4}-\d{2}-\d{2}$/ },
  {
    format: 'date-time',
    pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
  },
  {
    format: 'uuid',
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  },
];

function detectStringFormat(value: string): string | null {
  for (const { format, pattern } of FORMAT_PATTERNS) {
    if (pattern.test(value)) return format;
  }
  return null;
}

// ─── Schema Generator ─────────────────────────────────────────────────────────

function generateSchema(value: unknown, opts: GeneratorOptions, key?: string): JsonSchema {
  if (value === null) return { type: 'null' };

  if (Array.isArray(value)) {
    const schema: JsonSchema = { type: 'array' };
    if (opts.addTitleDescription && key) {
      schema.title = toTitle(key);
    }
    if (value.length === 0) {
      schema.items = {};
    } else {
      const itemSchemas = value.map((item) => generateSchema(item, opts));
      // Deduplicate by JSON stringifying
      const unique = Array.from(new Set(itemSchemas.map((s) => JSON.stringify(s)))).map(
        (s) => JSON.parse(s) as JsonSchema
      );
      schema.items = unique.length === 1 ? unique[0] : { oneOf: unique };
    }
    return schema;
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const properties: Record<string, JsonSchema> = {};
    const required: string[] = [];

    for (const [k, v] of Object.entries(obj)) {
      properties[k] = generateSchema(v, opts, k);
      if (opts.markAllRequired && v !== null) required.push(k);
    }

    const schema: JsonSchema = { type: 'object', properties };
    if (opts.addTitleDescription && key) {
      schema.title = toTitle(key);
    }
    if (required.length > 0) schema.required = required;
    if (opts.noAdditionalProperties) schema.additionalProperties = false;
    return schema;
  }

  if (typeof value === 'string') {
    const schema: JsonSchema = { type: 'string' };
    if (opts.addTitleDescription && key) schema.title = toTitle(key);
    const format = detectStringFormat(value);
    if (format) schema.format = format;
    return schema;
  }

  if (typeof value === 'number') {
    return {
      type: Number.isInteger(value) ? 'integer' : 'number',
      ...(opts.addTitleDescription && key ? { title: toTitle(key) } : {}),
    };
  }

  if (typeof value === 'boolean') {
    return {
      type: 'boolean',
      ...(opts.addTitleDescription && key ? { title: toTitle(key) } : {}),
    };
  }

  return {};
}

function toTitle(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function buildFullSchema(json: unknown, opts: GeneratorOptions): JsonSchema {
  const inner = generateSchema(json, opts, 'root');
  const schema: JsonSchema = {
    $schema: SCHEMA_URIS[opts.version],
    ...(opts.addTitleDescription ? { title: 'Generated Schema', description: '' } : {}),
    ...inner,
  };
  return schema;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-start gap-3 w-full text-left group"
    >
      <div className="shrink-0 mt-0.5">
        {checked ? (
          <ToggleRight size={20} className="text-indigo-600 dark:text-indigo-400" />
        ) : (
          <ToggleLeft size={20} className="text-slate-400 dark:text-slate-600" />
        )}
      </div>
      <div>
        <p className={`text-sm font-medium ${checked ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
          {label}
        </p>
        {description && <p className="text-xs text-slate-500 dark:text-slate-600 mt-0.5">{description}</p>}
      </div>
    </button>
  );
}

function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg text-xs font-medium transition-colors"
    >
      {copied ? <Check size={13} className="text-green-500 dark:text-green-400" /> : <Copy size={13} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function JsonSchemaGeneratorTool() {
  const [inputJson, setInputJson] = useState(SAMPLE_JSON);
  const [options, setOptions] = useState<GeneratorOptions>({
    version: 'draft-07',
    addTitleDescription: false,
    markAllRequired: true,
    noAdditionalProperties: false,
  });

  const setOpt = <K extends keyof GeneratorOptions>(key: K, value: GeneratorOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const { parsed, parseError } = useMemo(() => {
    try {
      return { parsed: JSON.parse(inputJson) as unknown, parseError: null };
    } catch (e) {
      return { parsed: null, parseError: (e as Error).message };
    }
  }, [inputJson]);

  const schemaOutput = useMemo(() => {
    if (!parsed) return '';
    try {
      const schema = buildFullSchema(parsed, options);
      return JSON.stringify(schema, null, 2);
    } catch {
      return '';
    }
  }, [parsed, options]);

  const handleDownload = () => {
    const blob = new Blob([schemaOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineCount = (s: string) => s.split('\n').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
          <Code2 className="text-indigo-600 dark:text-indigo-400" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">JSON Schema Generator</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Generate JSON Schema Draft 7 / 2019-09 / 2020-12 from JSON
          </p>
        </div>
      </div>

      {/* Options bar */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-6">
          {/* Version selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">Schema version</label>
            <div className="relative">
              <select
                value={options.version}
                onChange={(e) => setOpt('version', e.target.value as SchemaVersion)}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 pr-7 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="draft-07">Draft 7</option>
                <option value="draft-2019-09">Draft 2019-09</option>
                <option value="draft-2020-12">Draft 2020-12</option>
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
            </div>
          </div>

          <div className="h-5 border-l border-slate-200 dark:border-slate-700 hidden sm:block" />

          <Toggle
            checked={options.addTitleDescription}
            onChange={(v) => setOpt('addTitleDescription', v)}
            label="Add title/description"
          />
          <Toggle
            checked={options.markAllRequired}
            onChange={(v) => setOpt('markAllRequired', v)}
            label="Mark all required"
          />
          <Toggle
            checked={options.noAdditionalProperties}
            onChange={(v) => setOpt('noAdditionalProperties', v)}
            label="No additional properties"
          />
        </div>
      </div>

      {/* Editor panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Input JSON</span>
              {parseError ? (
                <span className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                  <AlertCircle size={12} />
                  Invalid JSON
                </span>
              ) : (
                <span className="text-xs text-green-600 dark:text-green-400">Valid</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInputJson(SAMPLE_JSON)}
                className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Load example
              </button>
              <CopyButton value={inputJson} />
            </div>
          </div>

          {parseError && (
            <div className="px-4 py-2 bg-red-50 dark:bg-red-500/10 border-b border-red-200 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400 font-mono">
              {parseError}
            </div>
          )}

          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            spellCheck={false}
            className="flex-1 min-h-[480px] p-4 bg-transparent text-slate-800 dark:text-slate-200 font-mono text-sm resize-none focus:outline-none leading-relaxed"
            placeholder='Paste your JSON here, e.g. {"name": "Alice", "age": 30}'
          />
          <div className="px-4 py-1.5 border-t border-slate-200 dark:border-slate-700/40 text-xs text-slate-500 dark:text-slate-600">
            {lineCount(inputJson)} lines · {inputJson.length} chars
          </div>
        </div>

        {/* Output */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Generated Schema</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={!schemaOutput}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Download size={13} />
                Download .json
              </button>
              <CopyButton value={schemaOutput} label="Copy Schema" />
            </div>
          </div>

          <div className="flex-1 min-h-[480px] relative overflow-auto">
            {schemaOutput ? (
              <pre className="p-4 text-sm font-mono text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre">
                <SyntaxHighlight code={schemaOutput} />
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-600">
                <div className="text-center">
                  <Code2 size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">
                    {parseError ? 'Fix the JSON error to generate schema' : 'Schema will appear here'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {schemaOutput && (
            <div className="px-4 py-1.5 border-t border-slate-200 dark:border-slate-700/40 text-xs text-slate-500 dark:text-slate-600">
              {lineCount(schemaOutput)} lines · {schemaOutput.length} chars
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Syntax Highlighter ───────────────────────────────────────────────────────

function SyntaxHighlight({ code }: { code: string }) {
  const tokens = tokenizeJson(code);
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} className={TOKEN_COLORS[t.type]}>
          {t.value}
        </span>
      ))}
    </>
  );
}

type TokenType = 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punctuation' | 'plain';

const TOKEN_COLORS: Record<TokenType, string> = {
  key: 'text-indigo-600 dark:text-indigo-300',
  string: 'text-green-700 dark:text-green-300',
  number: 'text-orange-600 dark:text-orange-300',
  boolean: 'text-yellow-700 dark:text-yellow-300',
  null: 'text-red-500 dark:text-red-400',
  punctuation: 'text-slate-500',
  plain: 'text-slate-800 dark:text-slate-200',
};

function tokenizeJson(code: string): { type: TokenType; value: string }[] {
  const tokens: { type: TokenType; value: string }[] = [];
  const regex =
    /("(?:[^"\\]|\\.)*")\s*:|("(?:[^"\\]|\\.)*")|(true|false)|(null)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}\[\],:])|(\s+)|([^\s{}\[\],:"]+)/g;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(code)) !== null) {
    if (match[1]) tokens.push({ type: 'key', value: match[0] });
    else if (match[2]) tokens.push({ type: 'string', value: match[2] });
    else if (match[3]) tokens.push({ type: 'boolean', value: match[3] });
    else if (match[4]) tokens.push({ type: 'null', value: match[4] });
    else if (match[5]) tokens.push({ type: 'number', value: match[5] });
    else if (match[6]) tokens.push({ type: 'punctuation', value: match[6] });
    else if (match[7]) tokens.push({ type: 'plain', value: match[7] });
    else tokens.push({ type: 'plain', value: match[0] });
  }
  return tokens;
}
