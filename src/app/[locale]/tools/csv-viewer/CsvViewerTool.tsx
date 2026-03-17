'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize, downloadBlob } from '@/lib/utils';
import {
  Search, ArrowUpDown, ChevronUp, ChevronDown, Filter, Download, Copy,
  FileSpreadsheet, Info, X, RotateCcw, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, Loader2, Check, Table2, Eye, EyeOff,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════ */

type ColumnType = 'number' | 'text';
type SortDir = 'asc' | 'desc' | null;
type RowsPerPage = 25 | 50 | 100 | 'all';

interface SheetData {
  name: string;
  headers: string[];
  rows: string[][];
  colTypes: ColumnType[];
}

interface ParsedFile {
  fileName: string;
  fileSize: number;
  sheets: SheetData[];
  delimiter?: string;
}

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */

function detectDelimiter(text: string): string {
  const lines = text.split('\n').slice(0, 5).filter(l => l.trim());
  const delimiters = [',', ';', '\t', '|'];
  let best = ',';
  let bestScore = -1;

  for (const d of delimiters) {
    const counts = lines.map(l => l.split(d).length - 1);
    if (counts[0] === 0) continue;
    // Consistency: all lines have same count = good
    const allSame = counts.every(c => c === counts[0]);
    const score = counts[0] * (allSame ? 10 : 1);
    if (score > bestScore) { bestScore = score; best = d; }
  }
  return best;
}

function delimiterName(d: string): string {
  if (d === ',') return 'Comma';
  if (d === ';') return 'Semicolon';
  if (d === '\t') return 'Tab';
  if (d === '|') return 'Pipe';
  return d;
}

function detectColumnTypes(rows: string[][], colCount: number): ColumnType[] {
  const types: ColumnType[] = [];
  for (let c = 0; c < colCount; c++) {
    let numCount = 0;
    let total = 0;
    for (let r = 0; r < Math.min(rows.length, 30); r++) {
      const val = (rows[r]?.[c] || '').trim();
      if (!val) continue;
      total++;
      // Check if it's a number (including commas, currency symbols)
      const cleaned = val.replace(/[$€£¥₹,\s]/g, '');
      if (cleaned && !isNaN(Number(cleaned))) numCount++;
    }
    types.push(total > 0 && numCount / total > 0.7 ? 'number' : 'text');
  }
  return types;
}

function parseNumeric(val: string): number {
  const cleaned = val.replace(/[$€£¥₹,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export function CsvViewerTool() {
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [activeSheet, setActiveSheet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filtering
  const [globalSearch, setGlobalSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<number, string>>({});
  const [showColumnFilters, setShowColumnFilters] = useState(false);

  // Sorting
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPage>(25);

  // UI
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showFileInfo, setShowFileInfo] = useState(false);
  const [copied, setCopied] = useState('');

  // Column resize
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const resizingCol = useRef<number | null>(null);
  const resizeStartX = useRef(0);
  const resizeStartW = useRef(0);

  const toolRef = useRef<HTMLDivElement>(null);

  /* ── Parse file ── */
  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setParsedFile(null);
    setActiveSheet(0);
    setGlobalSearch('');
    setColumnFilters({});
    setSortCol(null);
    setSortDir(null);
    setPage(0);
    setSelectedRow(null);

    try {
      const XLSX = await import('xlsx');
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });

      // Detect delimiter for CSV
      let delimiter: string | undefined;
      if (file.name.match(/\.(csv|tsv|txt)$/i)) {
        const text = new TextDecoder().decode(data.slice(0, 10000));
        delimiter = detectDelimiter(text);
      }

      const sheets: SheetData[] = workbook.SheetNames.map(name => {
        const sheet = workbook.Sheets[name];
        const json: string[][] = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: '',
          raw: false,
        });

        const headers = (json[0] || []).map((h, i) => String(h || `Column ${i + 1}`));
        const rows = json.slice(1).filter(row => row.some(cell => String(cell).trim()));
        const colTypes = detectColumnTypes(rows.map(r => r.map(String)), headers.length);

        return { name, headers, rows: rows.map(r => r.map(String)), colTypes };
      });

      if (sheets.length === 0 || (sheets[0].headers.length === 0 && sheets[0].rows.length === 0)) {
        throw new Error('File appears to be empty or could not be parsed.');
      }

      // Set initial column widths
      const initWidths = sheets[0].headers.map(h => Math.max(100, Math.min(250, h.length * 10 + 60)));
      setColumnWidths(initWidths);

      setParsedFile({ fileName: file.name, fileSize: file.size, sheets, delimiter });
    } catch (e) {
      setError(`Failed to parse file: ${(e as Error).message}`);
    }
    setLoading(false);
  }, []);

  /* ── Data pipeline (useMemo chain) ── */
  const currentSheet = parsedFile?.sheets[activeSheet] ?? null;

  const globalFiltered = useMemo(() => {
    if (!currentSheet) return [];
    if (!globalSearch.trim()) return currentSheet.rows;
    const q = globalSearch.toLowerCase();
    return currentSheet.rows.filter(row => row.some(cell => cell.toLowerCase().includes(q)));
  }, [currentSheet, globalSearch]);

  const columnFilteredRows = useMemo(() => {
    const activeFilters = Object.entries(columnFilters).filter(([, v]) => v.trim());
    if (activeFilters.length === 0) return globalFiltered;
    return globalFiltered.filter(row =>
      activeFilters.every(([colStr, val]) => {
        const col = parseInt(colStr);
        return (row[col] || '').toLowerCase().includes(val.toLowerCase());
      })
    );
  }, [globalFiltered, columnFilters]);

  const sortedRows = useMemo(() => {
    if (sortCol === null || !sortDir || !currentSheet) return columnFilteredRows;
    const colType = currentSheet.colTypes[sortCol];
    const sorted = [...columnFilteredRows].sort((a, b) => {
      const va = a[sortCol] || '';
      const vb = b[sortCol] || '';
      if (colType === 'number') {
        return parseNumeric(va) - parseNumeric(vb);
      }
      return va.localeCompare(vb, undefined, { sensitivity: 'base' });
    });
    return sortDir === 'desc' ? sorted.reverse() : sorted;
  }, [columnFilteredRows, sortCol, sortDir, currentSheet]);

  const totalFilteredRows = sortedRows.length;
  const totalPages = rowsPerPage === 'all' ? 1 : Math.max(1, Math.ceil(totalFilteredRows / rowsPerPage));
  const safePage = Math.min(page, totalPages - 1);

  const paginatedRows = useMemo(() => {
    if (rowsPerPage === 'all') return sortedRows;
    const start = safePage * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, safePage, rowsPerPage]);

  // Reset page when filters change
  useEffect(() => { setPage(0); }, [globalSearch, columnFilters, sortCol, sortDir, activeSheet]);

  /* ── Sort handler ── */
  const handleSort = (col: number) => {
    if (sortCol === col) {
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') { setSortCol(null); setSortDir(null); }
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  /* ── Column resize ── */
  const handleResizeStart = (col: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizingCol.current = col;
    resizeStartX.current = e.clientX;
    resizeStartW.current = columnWidths[col] || 150;
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (resizingCol.current === null) return;
      const delta = e.clientX - resizeStartX.current;
      const newWidth = Math.max(60, resizeStartW.current + delta);
      setColumnWidths(prev => {
        const next = [...prev];
        next[resizingCol.current!] = newWidth;
        return next;
      });
    };
    const onUp = () => { resizingCol.current = null; };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
  }, []);

  /* ── Cell click → copy ── */
  const handleCellClick = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value.slice(0, 30));
      setTimeout(() => setCopied(''), 1500);
    } catch { /* clipboard not available */ }
  };

  /* ── Export ── */
  const exportCSV = () => {
    if (!currentSheet) return;
    const header = currentSheet.headers.join(',');
    const rows = sortedRows.map(row => row.map(cell => {
      const escaped = cell.replace(/"/g, '""');
      return cell.includes(',') || cell.includes('"') || cell.includes('\n') ? `"${escaped}"` : escaped;
    }).join(','));
    const csv = [header, ...rows].join('\n');
    downloadBlob(new Blob([csv], { type: 'text/csv' }), `${parsedFile?.fileName?.replace(/\.[^.]+$/, '') || 'data'}-export.csv`);
  };

  const copyTable = async () => {
    if (!currentSheet) return;
    const header = currentSheet.headers.join('\t');
    const rows = sortedRows.map(row => row.join('\t'));
    const text = [header, ...rows].join('\n');
    await navigator.clipboard.writeText(text);
    setCopied('table');
    setTimeout(() => setCopied(''), 1500);
  };

  /* ── Reset ── */
  const reset = () => {
    setParsedFile(null);
    setActiveSheet(0);
    setLoading(false);
    setError('');
    setGlobalSearch('');
    setColumnFilters({});
    setSortCol(null);
    setSortDir(null);
    setPage(0);
    setSelectedRow(null);
    setShowColumnFilters(false);
    setShowFileInfo(false);
    setColumnWidths([]);
  };

  /* ── Computed ── */
  const hasActiveFilters = globalSearch.trim() || Object.values(columnFilters).some(v => v.trim());
  const totalRows = currentSheet?.rows.length ?? 0;
  const colCount = currentSheet?.headers.length ?? 0;
  const startRow = rowsPerPage === 'all' ? 1 : safePage * (rowsPerPage as number) + 1;
  const endRow = rowsPerPage === 'all' ? totalFilteredRows : Math.min(startRow + (rowsPerPage as number) - 1, totalFilteredRows);

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div ref={toolRef} className="space-y-4">
      {/* Upload */}
      {!parsedFile && !loading && (
        <FileDropzone
          accept=".csv,.xlsx,.xls,.tsv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          maxSizeMB={100}
          onFiles={handleFiles}
          description="CSV, XLSX, XLS, TSV files — Max 100MB — 100% private, processed in your browser"
        />
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-16">
          <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Parsing spreadsheet...</p>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" style={{ width: `${60 + i * 20}px` }} />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={reset} className="text-red-600 hover:text-red-800 text-xs font-medium underline">Try another file</button>
        </div>
      )}

      {/* Main viewer */}
      {parsedFile && currentSheet && (
        <>
          {/* File info toggle + stats bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <FileSpreadsheet className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="font-medium truncate max-w-[200px]">{parsedFile.fileName}</span>
              <span className="hidden sm:inline">{formatFileSize(parsedFile.fileSize)}</span>
              <span className="px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-[10px]">
                {totalFilteredRows === totalRows ? `${totalRows} rows` : `${totalFilteredRows} / ${totalRows} rows`}
              </span>
              <span className="hidden sm:inline text-slate-400">{colCount} columns</span>
              {hasActiveFilters && (
                <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold text-[10px]">Filtered</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setShowFileInfo(!showFileInfo)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="File info">
                <Info className="w-4 h-4" />
              </button>
              <button onClick={reset}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="New file">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* File info panel */}
          {showFileInfo && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'File Name', value: parsedFile.fileName },
                { label: 'File Size', value: formatFileSize(parsedFile.fileSize) },
                { label: 'Rows', value: String(totalRows) },
                { label: 'Columns', value: String(colCount) },
                { label: 'Sheets', value: String(parsedFile.sheets.length) },
                { label: 'Active Sheet', value: currentSheet.name },
                ...(parsedFile.delimiter ? [{ label: 'Delimiter', value: delimiterName(parsedFile.delimiter) }] : []),
                { label: 'Format', value: parsedFile.fileName.split('.').pop()?.toUpperCase() || '?' },
              ].map(item => (
                <div key={item.label} className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Sheet tabs */}
          {parsedFile.sheets.length > 1 && (
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-1 overflow-x-auto">
              {parsedFile.sheets.map((sheet, i) => (
                <button key={i} onClick={() => { setActiveSheet(i); setColumnWidths(sheet.headers.map(h => Math.max(100, Math.min(250, h.length * 10 + 60)))); }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeSheet === i
                      ? 'bg-white dark:bg-slate-700 shadow text-primary-700 dark:text-primary-400'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}>
                  {sheet.name} <span className="text-[10px] text-slate-400 ml-1">({sheet.rows.length})</span>
                </button>
              ))}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] sm:max-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                placeholder="Search all columns..."
                className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-200"
              />
              {globalSearch && (
                <button onClick={() => setGlobalSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Column filters toggle */}
            <button onClick={() => setShowColumnFilters(!showColumnFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                showColumnFilters
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-300 dark:border-primary-700'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}>
              <Filter className="w-3.5 h-3.5" />
              {showColumnFilters ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              Filters
            </button>

            {/* Export */}
            <DownloadButton onClick={exportCSV} label="Export CSV" />

            {/* Copy */}
            <button onClick={copyTable}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 transition-all">
              {copied === 'table' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'table' ? 'Copied!' : 'Copy'}
            </button>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button onClick={() => { setGlobalSearch(''); setColumnFilters({}); }}
                className="flex items-center gap-1 px-2 py-2 rounded-lg text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>

          {/* Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-sm" role="grid">
                {/* Header */}
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    {/* Row number */}
                    <th className="px-2 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center w-12 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
                      #
                    </th>
                    {currentSheet.headers.map((header, ci) => (
                      <th key={ci}
                        className="relative group px-3 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 select-none"
                        style={{ minWidth: `${columnWidths[ci] || 120}px`, width: `${columnWidths[ci] || 120}px` }}
                      >
                        <button onClick={() => handleSort(ci)}
                          className="flex items-center gap-1.5 w-full hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                          aria-sort={sortCol === ci ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                          <span className="truncate">{header}</span>
                          {sortCol === ci && sortDir === 'asc' && <ChevronUp className="w-3.5 h-3.5 text-primary-600 shrink-0" />}
                          {sortCol === ci && sortDir === 'desc' && <ChevronDown className="w-3.5 h-3.5 text-primary-600 shrink-0" />}
                          {sortCol !== ci && <ArrowUpDown className="w-3 h-3 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 shrink-0" />}
                        </button>
                        {/* Resize handle */}
                        <div
                          onMouseDown={e => handleResizeStart(ci, e)}
                          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary-400 transition-colors"
                        />
                      </th>
                    ))}
                  </tr>
                  {/* Column filters row */}
                  {showColumnFilters && (
                    <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                      <td className="px-1 py-1.5 border-r border-slate-200 dark:border-slate-700" />
                      {currentSheet.headers.map((_, ci) => (
                        <td key={ci} className="px-1 py-1.5">
                          <div className="relative">
                            <input
                              type="text"
                              value={columnFilters[ci] || ''}
                              onChange={e => setColumnFilters(prev => ({ ...prev, [ci]: e.target.value }))}
                              placeholder="Filter..."
                              className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-slate-200"
                            />
                            {columnFilters[ci] && (
                              <button onClick={() => setColumnFilters(prev => { const n = { ...prev }; delete n[ci]; return n; })}
                                className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  )}
                </thead>

                {/* Body */}
                <tbody>
                  {paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={colCount + 1} className="text-center py-12 text-slate-400 dark:text-slate-500">
                        <Table2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No rows match your filters</p>
                        <button onClick={() => { setGlobalSearch(''); setColumnFilters({}); }}
                          className="mt-2 text-xs text-primary-600 hover:text-primary-700 underline">Clear all filters</button>
                      </td>
                    </tr>
                  ) : (
                    paginatedRows.map((row, ri) => {
                      const absoluteIndex = rowsPerPage === 'all' ? ri : safePage * (rowsPerPage as number) + ri;
                      return (
                        <tr key={ri}
                          onClick={() => setSelectedRow(selectedRow === absoluteIndex ? null : absoluteIndex)}
                          className={`border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors ${
                            selectedRow === absoluteIndex
                              ? 'bg-primary-50 dark:bg-primary-900/20'
                              : ri % 2 === 0
                                ? 'bg-white dark:bg-slate-800'
                                : 'bg-slate-50/50 dark:bg-slate-800/50'
                          } hover:bg-primary-50/50 dark:hover:bg-primary-900/10`}>
                          {/* Row number */}
                          <td className="px-2 py-2 text-[10px] text-slate-400 text-center border-r border-slate-100 dark:border-slate-800 tabular-nums">
                            {absoluteIndex + 1}
                          </td>
                          {currentSheet.headers.map((_, ci) => {
                            const value = row[ci] || '';
                            const isNum = currentSheet.colTypes[ci] === 'number';
                            return (
                              <td key={ci}
                                onClick={e => { e.stopPropagation(); handleCellClick(value); }}
                                className={`px-3 py-2 text-xs truncate max-w-[300px] ${
                                  isNum ? 'text-right tabular-nums text-slate-700 dark:text-slate-300' : 'text-slate-600 dark:text-slate-400'
                                } hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors`}
                                style={{ minWidth: `${columnWidths[ci] || 120}px` }}
                                title={value}>
                                {value}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Copied toast */}
          {copied && copied !== 'table' && (
            <div className="fixed bottom-4 right-4 z-50 px-3 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2">
              <Check className="w-3 h-3 inline mr-1" /> Copied: &quot;{copied}&quot;
            </div>
          )}

          {/* Pagination */}
          {totalFilteredRows > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Rows per page */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">Rows per page:</span>
                <select value={String(rowsPerPage)} onChange={e => { setRowsPerPage(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as RowsPerPage); setPage(0); }}
                  className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500">
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="all">All{totalFilteredRows > 5000 ? ` (${totalFilteredRows} rows - may be slow)` : ''}</option>
                </select>
              </div>

              {/* Range display */}
              <span className="text-slate-500 dark:text-slate-400">
                Showing <strong className="text-slate-700 dark:text-slate-200">{startRow}-{endRow}</strong> of <strong className="text-slate-700 dark:text-slate-200">{totalFilteredRows}</strong> rows
              </span>

              {/* Page navigation */}
              {rowsPerPage !== 'all' && totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(0)} disabled={safePage === 0}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors text-slate-500">
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors text-slate-500">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  {/* Page numbers */}
                  {(() => {
                    const pages: (number | '...')[] = [];
                    if (totalPages <= 7) {
                      for (let i = 0; i < totalPages; i++) pages.push(i);
                    } else {
                      pages.push(0);
                      if (safePage > 2) pages.push('...');
                      for (let i = Math.max(1, safePage - 1); i <= Math.min(totalPages - 2, safePage + 1); i++) pages.push(i);
                      if (safePage < totalPages - 3) pages.push('...');
                      pages.push(totalPages - 1);
                    }
                    return pages.map((p, i) =>
                      p === '...' ? (
                        <span key={`e${i}`} className="px-1 text-slate-400">...</span>
                      ) : (
                        <button key={p} onClick={() => setPage(p as number)}
                          className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                            safePage === p
                              ? 'bg-primary-800 text-white'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                          }`}>
                          {(p as number) + 1}
                        </button>
                      )
                    );
                  })()}
                  <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors text-slate-500">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setPage(totalPages - 1)} disabled={safePage >= totalPages - 1}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors text-slate-500">
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
