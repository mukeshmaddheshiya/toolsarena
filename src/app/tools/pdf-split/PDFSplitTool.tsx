'use client';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { downloadBlob, formatFileSize } from '@/lib/utils';
import { Loader2, Scissors } from 'lucide-react';

type SplitMode = 'all' | 'range' | 'every';

function parsePageRange(rangeStr: string, totalPages: number): number[][] {
  const groups: number[][] = [];
  const parts = rangeStr.split(',').map(s => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      const s = Math.max(1, start);
      const e = Math.min(totalPages, end);
      const pages = [];
      for (let i = s; i <= e; i++) pages.push(i - 1); // 0-indexed
      groups.push(pages);
    } else {
      const n = parseInt(part);
      if (n >= 1 && n <= totalPages) groups.push([n - 1]);
    }
  }
  return groups;
}

export function PDFSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [mode, setMode] = useState<SplitMode>('all');
  const [rangeStr, setRangeStr] = useState('');
  const [everyN, setEveryN] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<{ blob: Blob; name: string; pages: string }[]>([]);

  async function handleFiles(files: File[]) {
    const f = files[0];
    setFile(f);
    setResults([]);
    setError('');
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setTotalPages(pdf.getPageCount());
    } catch {
      setError('Could not read this PDF. Ensure it is not password-protected.');
    }
  }

  async function splitPDF() {
    if (!file) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pageGroups: number[][] = [];

      if (mode === 'all') {
        for (let i = 0; i < totalPages; i++) pageGroups.push([i]);
      } else if (mode === 'range') {
        const groups = parsePageRange(rangeStr, totalPages);
        if (groups.length === 0) { setError('Invalid page range. Use format: 1-3, 5, 7-10'); setLoading(false); return; }
        groups.forEach(g => pageGroups.push(g));
      } else {
        for (let i = 0; i < totalPages; i += everyN) {
          const group = [];
          for (let j = i; j < Math.min(i + everyN, totalPages); j++) group.push(j);
          pageGroups.push(group);
        }
      }

      const splitResults: { blob: Blob; name: string; pages: string }[] = [];
      for (let i = 0; i < pageGroups.length; i++) {
        const group = pageGroups[i];
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(pdf, group);
        copiedPages.forEach(p => newDoc.addPage(p));
        const splitBytes = await newDoc.save();
        const blob = new Blob([splitBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        const pagesLabel = group.length === 1 ? `p${group[0] + 1}` : `p${group[0] + 1}-${group[group.length - 1] + 1}`;
        splitResults.push({ blob, name: `split-${pagesLabel}.pdf`, pages: group.map(p => p + 1).join(', ') });
      }
      setResults(splitResults);
    } catch (e) {
      setError(`Failed to split: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  function downloadAll() {
    results.forEach(r => downloadBlob(r.blob, r.name));
  }

  return (
    <div className="space-y-5">
      {!file ? (
        <FileDropzone accept=".pdf,application/pdf" multiple={false} maxSizeMB={100} onFiles={handleFiles} description="PDF file only — max 100MB" />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{file.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{totalPages} pages · {formatFileSize(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setResults([]); setTotalPages(0); }} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Remove</button>
          </div>

          {/* Split mode */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Split Mode</label>
            <div className="space-y-2">
              {([
                ['all', 'Split into individual pages', 'Creates one PDF per page'],
                ['range', 'Custom page ranges', 'e.g., 1-3, 5, 7-10'],
                ['every', 'Every N pages', 'Divide into equal chunks'],
              ] as const).map(([v, label, desc]) => (
                <label key={v} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${mode === v ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                  <input type="radio" name="mode" value={v} checked={mode === v} onChange={() => setMode(v)} className="mt-0.5 accent-primary-800" />
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</div>
                    <div className="text-xs text-slate-500">{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {mode === 'range' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Page Ranges</label>
              <input value={rangeStr} onChange={e => setRangeStr(e.target.value)} placeholder="e.g. 1-3, 5, 7-10" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
              <p className="text-xs text-slate-400 mt-1">Total pages: {totalPages}. Separate multiple ranges with commas.</p>
            </div>
          )}

          {mode === 'every' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pages per split ({Math.ceil(totalPages / everyN)} parts)</label>
              <input type="number" value={everyN} min={1} max={totalPages} onChange={e => setEveryN(Math.max(1, parseInt(e.target.value) || 1))} className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
            </div>
          )}

          <button onClick={splitPDF} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-primary-800 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors text-sm">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4" />}
            Split PDF
          </button>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          {results.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">Split into {results.length} files</p>
                {results.length > 1 && <button onClick={downloadAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-800 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors">Download All</button>}
              </div>
              {results.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{r.name}</p>
                    <p className="text-xs text-slate-500">Pages: {r.pages} · {formatFileSize(r.blob.size)}</p>
                  </div>
                  <DownloadButton onClick={() => downloadBlob(r.blob, r.name)} label="Download" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
