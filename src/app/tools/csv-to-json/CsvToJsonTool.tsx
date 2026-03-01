'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Upload, Download, ArrowLeftRight } from 'lucide-react';

const SAMPLE_CSV = `name,age,city,email
Alice,28,New York,alice@example.com
Bob,34,London,bob@example.com
Charlie,22,Tokyo,charlie@example.com`;

const SAMPLE_JSON = `[
  {"name":"Alice","age":28,"city":"New York"},
  {"name":"Bob","age":34,"city":"London"},
  {"name":"Charlie","age":22,"city":"Tokyo"}
]`;

type Mode = 'csv-to-json' | 'json-to-csv';

function csvToJson(csv: string, delimiter: string): { result: string; error: string } {
  try {
    const lines = csv.trim().split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return { result: '', error: 'CSV must have a header row and at least one data row.' };

    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows = lines.slice(1).map(line => {
      const vals: string[] = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') { inQuotes = !inQuotes; }
        else if (ch === delimiter && !inQuotes) { vals.push(cur.trim()); cur = ''; }
        else { cur += ch; }
      }
      vals.push(cur.trim());
      const obj: Record<string, string | number> = {};
      headers.forEach((h, i) => {
        const v = (vals[i] ?? '').replace(/^["']|["']$/g, '');
        obj[h] = isNaN(Number(v)) || v === '' ? v : Number(v);
      });
      return obj;
    });

    return { result: JSON.stringify(rows, null, 2), error: '' };
  } catch (e) {
    return { result: '', error: (e as Error).message };
  }
}

function jsonToCsv(json: string, delimiter: string): { result: string; error: string } {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data) || data.length === 0) return { result: '', error: 'JSON must be a non-empty array of objects.' };
    const headers = Object.keys(data[0]);
    const escape = (v: unknown) => {
      const s = String(v ?? '');
      return s.includes(delimiter) || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = [headers.join(delimiter), ...data.map((row: Record<string, unknown>) => headers.map(h => escape(row[h])).join(delimiter))];
    return { result: rows.join('\n'), error: '' };
  } catch (e) {
    return { result: '', error: (e as Error).message };
  }
}

export function CsvToJsonTool() {
  const [mode, setMode] = useState<Mode>('csv-to-json');
  const [input, setInput] = useState(SAMPLE_CSV);
  const [delimiter, setDelimiter] = useState(',');
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => {
    if (!input.trim()) return { result: '', error: '' };
    return mode === 'csv-to-json' ? csvToJson(input, delimiter) : jsonToCsv(input, delimiter);
  }, [input, mode, delimiter]);

  const swap = () => {
    setMode(m => m === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json');
    setInput(result || (mode === 'csv-to-json' ? SAMPLE_JSON : SAMPLE_CSV));
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    if (!result) return;
    const ext = mode === 'csv-to-json' ? 'json' : 'csv';
    const mime = mode === 'csv-to-json' ? 'application/json' : 'text/csv';
    const blob = new Blob([result], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setInput(ev.target?.result as string ?? '');
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle + options */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <span className={`font-semibold text-sm ${mode === 'csv-to-json' ? 'text-blue-600' : 'text-gray-400'}`}>CSV</span>
          <button
            onClick={swap}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
          <span className={`font-semibold text-sm ${mode === 'json-to-csv' ? 'text-blue-600' : 'text-gray-400'}`}>JSON</span>
        </div>

        {mode === 'csv-to-json' && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Delimiter:</label>
            <select
              value={delimiter}
              onChange={e => setDelimiter(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
        )}

        <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5" />
          Upload file
          <input type="file" accept=".csv,.json,.txt" className="hidden" onChange={loadFile} />
        </label>
      </div>

      {/* Editor panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}
            </span>
            <button onClick={() => setInput('')} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Clear</button>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'csv-to-json' ? 'Paste CSV here…' : 'Paste JSON array here…'}
            spellCheck={false}
            className="w-full h-64 p-4 font-mono text-sm bg-transparent text-gray-800 dark:text-gray-200 resize-none focus:outline-none"
          />
        </div>

        {/* Output */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}
            </span>
            <div className="flex gap-2">
              {result && (
                <>
                  <button onClick={copy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                    {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                  <button onClick={download} className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </>
              )}
            </div>
          </div>
          {error ? (
            <div className="p-4 text-sm text-red-500 dark:text-red-400">{error}</div>
          ) : (
            <textarea
              value={result}
              readOnly
              placeholder="Output will appear here…"
              spellCheck={false}
              className="w-full h-64 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 resize-none focus:outline-none"
            />
          )}
        </div>
      </div>

      {/* Stats */}
      {result && !error && (
        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 px-1">
          <span>Input: {input.length.toLocaleString()} chars</span>
          <span>·</span>
          <span>Output: {result.length.toLocaleString()} chars</span>
          {mode === 'csv-to-json' && (
            <>
              <span>·</span>
              <span>
                {(() => { try { return JSON.parse(result).length + ' rows'; } catch { return ''; } })()}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
