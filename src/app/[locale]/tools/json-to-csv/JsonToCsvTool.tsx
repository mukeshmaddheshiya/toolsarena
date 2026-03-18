'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import {
  Upload, Download, Copy, Check, ArrowLeftRight, FileSpreadsheet,
  ChevronDown, ChevronUp, Table, Settings, RefreshCw,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────────────────── */

type Mode = 'json-to-csv' | 'csv-to-json';
type Delimiter = ',' | '\t' | ';' | '|';

interface ConversionResult {
  output: string;
  rows: number;
  cols: number;
  headers: string[];
  previewRows: Record<string, string>[];
  error: string;
}

/* ── Helpers ────────────────────────────────────────────────────────── */

/** Flatten a nested object into dot-notation keys */
function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flattenObject(val as Record<string, unknown>, fullKey));
    } else if (Array.isArray(val)) {
      result[fullKey] = JSON.stringify(val);
    } else {
      result[fullKey] = val === null || val === undefined ? '' : String(val);
    }
  }
  return result;
}

/** Escape a CSV cell value per RFC 4180 */
function escapeCsvCell(value: string, delimiter: string): string {
  if (
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r')
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Parse CSV line handling quoted fields */
function parseCsvLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

/** Convert JSON array to CSV */
function jsonToCsvConvert(
  jsonStr: string,
  delimiter: Delimiter,
  flatten: boolean,
  selectedFields: Set<string> | null,
  includeHeader: boolean,
): ConversionResult {
  try {
    const raw = JSON.parse(jsonStr.trim());
    if (!Array.isArray(raw) || raw.length === 0) {
      return { output: '', rows: 0, cols: 0, headers: [], previewRows: [], error: 'Input must be a non-empty JSON array of objects.' };
    }

    const data: Record<string, string>[] = raw.map(item => {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        return { value: String(item) };
      }
      return flatten
        ? flattenObject(item as Record<string, unknown>)
        : Object.fromEntries(
            Object.entries(item as Record<string, unknown>).map(([k, v]) => [
              k,
              v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v),
            ])
          );
    });

    const headerSet = new Set<string>();
    data.forEach(row => Object.keys(row).forEach(k => headerSet.add(k)));
    const allHeaders = Array.from(headerSet);

    const headers = selectedFields
      ? allHeaders.filter(h => selectedFields.has(h))
      : allHeaders;

    if (headers.length === 0) {
      return { output: '', rows: 0, cols: 0, headers: allHeaders, previewRows: [], error: 'No fields selected. Please select at least one column.' };
    }

    const lines: string[] = [];
    if (includeHeader) {
      lines.push(headers.map(h => escapeCsvCell(h, delimiter)).join(delimiter));
    }
    data.forEach(row => {
      lines.push(headers.map(h => escapeCsvCell(row[h] ?? '', delimiter)).join(delimiter));
    });

    const previewRows = data.slice(0, 5).map(row =>
      Object.fromEntries(headers.map(h => [h, row[h] ?? '']))
    );

    return {
      output: lines.join('\n'),
      rows: data.length,
      cols: headers.length,
      headers: allHeaders,
      previewRows,
      error: '',
    };
  } catch (e) {
    return { output: '', rows: 0, cols: 0, headers: [], previewRows: [], error: `Invalid JSON: ${(e as Error).message}` };
  }
}

/** Convert CSV to JSON */
function csvToJsonConvert(csvStr: string, delimiter: Delimiter): ConversionResult {
  try {
    const lines = csvStr.trim().split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) {
      return { output: '', rows: 0, cols: 0, headers: [], previewRows: [], error: 'CSV must have a header row and at least one data row.' };
    }
    const headers = parseCsvLine(lines[0], delimiter);
    const data = lines.slice(1).map(line => {
      const vals = parseCsvLine(line, delimiter);
      const obj: Record<string, unknown> = {};
      headers.forEach((h, i) => {
        const v = vals[i] ?? '';
        obj[h] = isNaN(Number(v)) || v.trim() === '' ? v : Number(v);
      });
      return obj;
    });

    const jsonStr = JSON.stringify(data, null, 2);
    const previewRows = data.slice(0, 5).map(row =>
      Object.fromEntries(Object.entries(row).map(([k, v]) => [k, String(v)]))
    );

    return {
      output: jsonStr,
      rows: data.length,
      cols: headers.length,
      headers,
      previewRows,
      error: '',
    };
  } catch (e) {
    return { output: '', rows: 0, cols: 0, headers: [], previewRows: [], error: `Conversion failed: ${(e as Error).message}` };
  }
}

/* ── Sample data ────────────────────────────────────────────────────── */

const SAMPLE_JSON = `[
  {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 28,
    "address": {
      "city": "New York",
      "country": "USA"
    },
    "active": true
  },
  {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob@example.com",
    "age": 34,
    "address": {
      "city": "London",
      "country": "UK"
    },
    "active": false
  },
  {
    "id": 3,
    "name": "Charlie Kumar",
    "email": "charlie@example.com",
    "age": 22,
    "address": {
      "city": "Mumbai",
      "country": "India"
    },
    "active": true
  }
]`;

const SAMPLE_CSV = `id,name,email,age,city,country,active
1,Alice Johnson,alice@example.com,28,New York,USA,true
2,Bob Smith,bob@example.com,34,London,UK,false
3,Charlie Kumar,charlie@example.com,22,Mumbai,India,true`;

const DELIMITER_OPTIONS: { label: string; value: Delimiter; ext: string }[] = [
  { label: 'Comma (CSV)', value: ',', ext: 'csv' },
  { label: 'Tab (TSV)', value: '\t', ext: 'tsv' },
  { label: 'Semicolon', value: ';', ext: 'csv' },
  { label: 'Pipe (|)', value: '|', ext: 'csv' },
];

/* ── Component ──────────────────────────────────────────────────────── */

export function JsonToCsvTool() {
  const [mode, setMode] = useState<Mode>('json-to-csv');
  const [input, setInput] = useState(SAMPLE_JSON);
  const [delimiter, setDelimiter] = useState<Delimiter>(',');
  const [flatten, setFlatten] = useState(true);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [selectedFields, setSelectedFields] = useState<Set<string> | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Run conversion */
  const result = useMemo<ConversionResult>(() => {
    if (!input.trim()) return { output: '', rows: 0, cols: 0, headers: [], previewRows: [], error: '' };
    if (mode === 'json-to-csv') {
      const raw = jsonToCsvConvert(input, delimiter, flatten, null, true);
      const fields = selectedFields ?? (raw.headers.length > 0 ? new Set(raw.headers) : null);
      return jsonToCsvConvert(input, delimiter, flatten, fields, includeHeader);
    } else {
      return csvToJsonConvert(input, delimiter);
    }
  }, [input, mode, delimiter, flatten, selectedFields, includeHeader]);

  /* Initialize selectedFields when headers are first detected */
  const allHeaders = useMemo(() => {
    if (mode !== 'json-to-csv' || !input.trim()) return [];
    try {
      const raw = JSON.parse(input.trim());
      if (!Array.isArray(raw) || raw.length === 0) return [];
      const set = new Set<string>();
      raw.forEach((item: unknown) => {
        if (typeof item === 'object' && item !== null) {
          const flat = flatten
            ? flattenObject(item as Record<string, unknown>)
            : (item as Record<string, unknown>);
          Object.keys(flat).forEach(k => set.add(k));
        }
      });
      return Array.from(set);
    } catch {
      return [];
    }
  }, [input, mode, flatten]);

  const effectiveSelectedFields = selectedFields ?? new Set(allHeaders);

  const toggleField = (field: string) => {
    const next = new Set(effectiveSelectedFields);
    if (next.has(field)) {
      if (next.size > 1) next.delete(field);
    } else {
      next.add(field);
    }
    setSelectedFields(next);
  };

  const selectAll = () => setSelectedFields(new Set(allHeaders));
  const selectNone = () => {
    if (allHeaders.length > 0) setSelectedFields(new Set([allHeaders[0]]));
  };

  /* Swap modes */
  const swap = () => {
    const nextMode = mode === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv';
    setMode(nextMode);
    setInput(result.output || (nextMode === 'json-to-csv' ? SAMPLE_JSON : SAMPLE_CSV));
    setSelectedFields(null);
  };

  /* Copy */
  const copy = useCallback(async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result.output]);

  /* Download */
  const download = useCallback(() => {
    if (!result.output) return;
    const delimOpt = DELIMITER_OPTIONS.find(d => d.value === delimiter) ?? DELIMITER_OPTIONS[0];
    const ext = mode === 'json-to-csv' ? delimOpt.ext : 'json';
    const mime = mode === 'json-to-csv' ? 'text/csv' : 'application/json';
    const blob = new Blob([result.output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result.output, mode, delimiter]);

  /* File upload */
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setInput((ev.target?.result as string) ?? '');
      setSelectedFields(null);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const isJsonMode = mode === 'json-to-csv';

  return (
    <div className="space-y-4">

      {/* ── Top bar: mode toggle + options ── */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold transition-colors ${isJsonMode ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`}>
            JSON
          </span>
          <button
            onClick={swap}
            title="Swap direction"
            className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
          <span className={`text-sm font-bold transition-colors ${!isJsonMode ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`}>
            CSV
          </span>
        </div>

        <div className="w-px h-5 bg-slate-300 dark:bg-slate-600" />

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-400">Delimiter:</span>
          <select
            value={delimiter}
            onChange={e => setDelimiter(e.target.value as Delimiter)}
            className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            {DELIMITER_OPTIONS.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <label
            title="Upload file"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv,.txt"
              className="sr-only"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={() => setShowSettings(v => !v)}
            title="Settings"
            className={`p-1.5 rounded-lg border transition-colors ${
              showSettings
                ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setInput(isJsonMode ? SAMPLE_JSON : SAMPLE_CSV); setSelectedFields(null); }}
            title="Load sample"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Settings panel ── */}
      {showSettings && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Options</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {isJsonMode && (
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                <input type="checkbox" checked={flatten} onChange={e => { setFlatten(e.target.checked); setSelectedFields(null); }} className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Flatten Nested Objects</span>
                  <p className="text-xs text-slate-400 mt-0.5">address.city instead of nested JSON</p>
                </div>
              </label>
            )}
            {isJsonMode && (
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                <input type="checkbox" checked={includeHeader} onChange={e => setIncludeHeader(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Include Header Row</span>
                  <p className="text-xs text-slate-400 mt-0.5">First row contains column names</p>
                </div>
              </label>
            )}
          </div>

          {isJsonMode && allHeaders.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Fields to include ({effectiveSelectedFields.size}/{allHeaders.length})</p>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">All</button>
                  <button onClick={selectNone} className="text-xs text-slate-500 dark:text-slate-400 hover:underline">None</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {allHeaders.map(field => (
                  <label key={field} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={effectiveSelectedFields.has(field)} onChange={() => toggleField(field)} className="w-3.5 h-3.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md border transition-colors ${
                      effectiveSelectedFields.has(field)
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}>{field}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Editor panes ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              {isJsonMode ? <><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />JSON Input</> : <><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />CSV Input</>}
            </span>
            <button onClick={() => setInput('')} className="text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">Clear</button>
          </div>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setSelectedFields(null); }}
            placeholder={isJsonMode ? 'Paste JSON array here\u2026' : 'Paste CSV here\u2026'}
            spellCheck={false}
            className="flex-1 w-full h-64 p-4 font-mono text-sm bg-transparent text-slate-800 dark:text-slate-200 resize-y focus:outline-none leading-relaxed"
          />
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center gap-3 text-xs text-slate-400">
            <span>{input.length.toLocaleString()} chars</span>
            {isJsonMode && input.trim() && (
              <span>{(() => { try { const a = JSON.parse(input); return Array.isArray(a) ? `${a.length} rows` : ''; } catch { return ''; } })()}</span>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              {isJsonMode ? <><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />CSV Output</> : <><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />JSON Output</>}
            </span>
            <div className="flex items-center gap-2">
              {result.output && (
                <>
                  <button onClick={copy} className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {copied ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                  <button onClick={download} className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Download {isJsonMode ? DELIMITER_OPTIONS.find(d => d.value === delimiter)?.ext?.toUpperCase() || 'CSV' : 'JSON'}
                  </button>
                </>
              )}
            </div>
          </div>

          {result.error ? (
            <div className="flex-1 p-4 text-sm text-red-600 dark:text-red-400">
              <p className="font-medium mb-1">Error</p>
              <p className="text-xs font-mono">{result.error}</p>
            </div>
          ) : (
            <textarea
              value={result.output}
              readOnly
              placeholder="Output will appear here\u2026"
              spellCheck={false}
              className="flex-1 w-full h-64 p-4 font-mono text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 resize-y focus:outline-none leading-relaxed"
            />
          )}

          {result.output && !result.error && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><FileSpreadsheet className="w-3.5 h-3.5" />{result.rows} rows</span>
              <span>&middot;</span>
              <span>{result.cols} columns</span>
              <span>&middot;</span>
              <span>{result.output.length.toLocaleString()} chars</span>
              <span>&middot;</span>
              <span>{(new Blob([result.output]).size / 1024).toFixed(1)} KB</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Download CTA ── */}
      {result.output && !result.error && (
        <button
          onClick={download}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary-800 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
        >
          <Download className="w-5 h-5" />
          Download {isJsonMode
            ? (DELIMITER_OPTIONS.find(d => d.value === delimiter)?.ext?.toUpperCase() || 'CSV')
            : 'JSON'
          } File
        </button>
      )}

      {/* ── Table Preview ── */}
      {result.previewRows.length > 0 && !result.error && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button
            onClick={() => setShowPreview(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Table Preview</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">first {result.previewRows.length} rows</span>
            </div>
            {showPreview ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showPreview && result.previewRows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    {Object.keys(result.previewRows[0]).map(header => (
                      <th key={header} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap font-mono">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.previewRows.map((row, i) => (
                    <tr key={i} className={`border-b border-slate-100 dark:border-slate-800 ${i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-900/50'}`}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400 max-w-[200px] truncate font-mono" title={val}>
                          {val || <span className="text-slate-300 dark:text-slate-600 italic">empty</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.rows > 5 && (
                <div className="px-4 py-2.5 text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 text-center border-t border-slate-200 dark:border-slate-700">
                  + {result.rows - 5} more rows in the full output
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
