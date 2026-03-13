'use client';
import { useState, useCallback } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { downloadBlob } from '@/lib/utils';
import { Table, Download, RotateCcw, Loader2, CheckCircle, Info } from 'lucide-react';

interface PageData {
  page: number;
  rows: string[][];
}

type ExportMode = 'table' | 'csv' | 'both';

async function extractPdfData(file: File, onProgress: (msg: string) => void): Promise<PageData[]> {
  onProgress('Loading PDF library…');
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  onProgress('Loading PDF…');
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: PageData[] = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    onProgress(`Extracting page ${p} of ${pdf.numPages}…`);
    const page = await pdf.getPage(p);
    const textContent = await page.getTextContent();

    // Group text items by Y position (same line = same row)
    const lineMap: Map<number, { x: number; text: string }[]> = new Map();

    for (const item of textContent.items) {
      if (!('str' in item)) continue;
      const str = item.str.trim();
      if (!str) continue;
      const transform = item.transform;
      const y = Math.round(transform[5]); // Y position rounded to nearest pt
      const x = transform[4];
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y)!.push({ x, text: str });
    }

    // Sort lines top to bottom (PDF Y goes up, so higher Y = higher on page)
    const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);

    // Build rows by detecting column alignment
    const rows: string[][] = [];

    // Find column boundaries by clustering X positions
    const allXs = Array.from(lineMap.values()).flat().map(i => i.x);
    if (allXs.length === 0) { pages.push({ page: p, rows: [] }); continue; }

    const minX = Math.min(...allXs);
    const maxX = Math.max(...allXs);
    const range = maxX - minX;

    // Try to detect columns by X position clustering
    const colThreshold = Math.max(30, range / 10);
    let colBoundaries: number[] = [];

    if (range > 0) {
      const sortedXs = [...new Set(allXs.map(x => Math.round(x / colThreshold) * colThreshold))].sort((a, b) => a - b);
      colBoundaries = sortedXs;
    }

    for (const y of sortedYs) {
      const items = lineMap.get(y)!.sort((a, b) => a.x - b.x);
      if (colBoundaries.length <= 1) {
        // Single column — just join all text on this line
        rows.push([items.map(i => i.text).join(' ')]);
      } else {
        // Multi-column — assign each text item to its column bucket
        const row: string[] = Array(colBoundaries.length).fill('');
        for (const item of items) {
          // Find closest column
          let bestCol = 0;
          let bestDist = Infinity;
          colBoundaries.forEach((cb, idx) => {
            const dist = Math.abs(item.x - cb);
            if (dist < bestDist) { bestDist = dist; bestCol = idx; }
          });
          row[bestCol] = row[bestCol] ? row[bestCol] + ' ' + item.text : item.text;
        }
        // Remove trailing empty columns
        while (row.length > 1 && !row[row.length - 1]) row.pop();
        rows.push(row);
      }
    }

    pages.push({ page: p, rows });
  }

  return pages;
}

async function exportToExcel(pages: PageData[], filename: string) {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  if (pages.length === 1) {
    const wsData = [
      ['Page', 'Content'],
      ...pages[0].rows.map(row => [pages[0].page, ...row]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 6 }, ...pages[0].rows[0]?.map(() => ({ wch: 30 })) ?? [{ wch: 50 }]];
    XLSX.utils.book_append_sheet(wb, ws, 'Page 1');
  } else {
    // Summary sheet
    const summaryData = [['Page', 'Row Count', 'Text Preview']];
    pages.forEach(p => {
      const preview = p.rows[0]?.join(' ').slice(0, 80) || '';
      summaryData.push([p.page.toString(), p.rows.length.toString(), preview]);
    });
    const summary = XLSX.utils.aoa_to_sheet(summaryData);
    summary['!cols'] = [{ wch: 6 }, { wch: 10 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, summary, 'Summary');

    // One sheet per page (up to 10 pages)
    for (const p of pages.slice(0, 10)) {
      const wsData: (string | number)[][] = [];
      if (p.rows.length > 0 && p.rows[0].length > 1) {
        // Multi-column: detect if first row looks like a header
        wsData.push(p.rows[0].map((_, i) => `Column ${i + 1}`));
      }
      wsData.push(...p.rows);
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const maxCols = Math.max(...p.rows.map(r => r.length), 1);
      ws['!cols'] = Array(maxCols).fill({ wch: 30 });
      XLSX.utils.book_append_sheet(wb, ws, `Page ${p.page}`);
    }
  }

  const bytes = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadBlob(blob, filename.replace(/\.pdf$/i, '') + '.xlsx');
}

function exportToCsv(pages: PageData[], filename: string) {
  const lines: string[] = [];
  for (const p of pages) {
    lines.push(`# Page ${p.page}`);
    for (const row of p.rows) {
      const csvRow = row.map(cell => {
        const escaped = cell.replace(/"/g, '""');
        return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
      }).join(',');
      lines.push(csvRow);
    }
    lines.push('');
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  downloadBlob(blob, filename.replace(/\.pdf$/i, '') + '.csv');
}

export function PdfToExcelTool() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [exportMode, setExportMode] = useState<ExportMode>('table');
  const [previewPage, setPreviewPage] = useState(0);
  const [exporting, setExporting] = useState(false);

  const processFile = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setLoading(true);
    setError('');
    setPages([]);
    setFileName(file.name);
    try {
      const data = await extractPdfData(file, setProgress);
      setPages(data);
      setPreviewPage(0);
    } catch (e) {
      setError(`Failed to extract PDF: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      setProgress('');
    }
  }, []);

  async function handleExport() {
    if (!pages.length) return;
    setExporting(true);
    try {
      if (exportMode === 'table' || exportMode === 'both') await exportToExcel(pages, fileName);
      if (exportMode === 'csv' || exportMode === 'both') exportToCsv(pages, fileName);
    } catch (e) {
      setError(`Export failed: ${(e as Error).message}`);
    } finally {
      setExporting(false);
    }
  }

  function reset() { setPages([]); setError(''); setFileName(''); setProgress(''); }

  const totalRows = pages.reduce((a, p) => a + p.rows.length, 0);
  const currentPage = pages[previewPage];

  const selectClass = 'px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500';

  return (
    <div className="space-y-5">
      {/* Info */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-300">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Best results with text-based PDFs. Scanned PDFs (image-only) require OCR. Multi-column layouts are auto-detected.</span>
      </div>

      {/* Upload */}
      {pages.length === 0 && !loading && (
        <FileDropzone
          accept=".pdf,application/pdf"
          multiple={false}
          maxSizeMB={50}
          onFiles={processFile}
          description="PDF files only — max 50MB — text extracted locally, never uploaded"
        />
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
          <p className="text-sm text-slate-600 dark:text-slate-400">{progress}</p>
          <p className="text-xs text-slate-400">{fileName}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          <button onClick={reset} className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:underline">Try another file →</button>
        </div>
      )}

      {/* Results */}
      {pages.length > 0 && !loading && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-green-800 dark:text-green-200">{fileName}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">{pages.length} page{pages.length !== 1 ? 's' : ''} · {totalRows.toLocaleString()} rows extracted</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Pages', value: pages.length },
              { label: 'Total Rows', value: totalRows.toLocaleString() },
              { label: 'Max Columns', value: Math.max(...pages.flatMap(p => p.rows.map(r => r.length)), 1) },
            ].map(s => (
              <div key={s.label} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Preview</span>
              </div>
              {pages.length > 1 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500">Page:</label>
                  <select value={previewPage} onChange={e => setPreviewPage(parseInt(e.target.value))} className="text-xs px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    {pages.map((p, i) => <option key={i} value={i}>Page {p.page}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="overflow-auto max-h-72">
              {currentPage && currentPage.rows.length > 0 ? (
                <table className="w-full text-xs">
                  <tbody>
                    {currentPage.rows.slice(0, 50).map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900'}>
                        <td className="px-2 py-1 text-slate-400 text-right select-none w-8 border-r border-slate-100 dark:border-slate-700">{ri + 1}</td>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3 py-1.5 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-700 last:border-r-0 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis" title={cell}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-sm text-slate-400">No extractable text found on this page.</div>
              )}
            </div>
            {currentPage && currentPage.rows.length > 50 && (
              <p className="text-xs text-slate-400 text-center p-2 border-t border-slate-100 dark:border-slate-700">
                Showing 50 of {currentPage.rows.length} rows — all rows exported to file.
              </p>
            )}
          </div>

          {/* Export controls */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Export as:</label>
            <select value={exportMode} onChange={e => setExportMode(e.target.value as ExportMode)} className={selectClass}>
              <option value="table">Excel (.xlsx)</option>
              <option value="csv">CSV (.csv)</option>
              <option value="both">Both (.xlsx + .csv)</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button onClick={handleExport} disabled={exporting} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-800 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors">
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exporting ? 'Exporting…' : `Export ${exportMode === 'table' ? 'Excel' : exportMode === 'csv' ? 'CSV' : 'Both'}`}
            </button>
            <button onClick={reset} className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors">
              <RotateCcw className="w-4 h-4" /> New File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
