'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Download, Loader2, FileText, X, Table } from 'lucide-react';

type Delimiter = ',' | ';' | '\t' | '|';
type Style = 'default' | 'striped' | 'minimal' | 'bordered';

const STYLES: { id: Style; label: string }[] = [
  { id: 'default',  label: 'Default'  },
  { id: 'striped',  label: 'Striped'  },
  { id: 'minimal',  label: 'Minimal'  },
  { id: 'bordered', label: 'Bordered' },
];

function parseCsv(text: string, delimiter: Delimiter): string[][] {
  const lines = text.trim().split(/\r?\n/);
  return lines.map(line => {
    const row: string[] = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; }
      else if (ch === delimiter && !inQ) { row.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    row.push(cur.trim());
    return row;
  });
}

const SAMPLE = `Name,Department,Role,Salary,Start Date
Alice Johnson,Engineering,Senior Developer,"$95,000",2021-03-15
Bob Smith,Marketing,Content Manager,"$72,000",2020-07-01
Carol White,Design,UI/UX Lead,"$88,000",2019-11-20
David Brown,Engineering,DevOps Engineer,"$91,000",2022-01-10
Emma Wilson,HR,People Manager,"$78,000",2018-06-05`;

export function CsvToPdfTool() {
  const [csvText, setCsvText] = useState(SAMPLE);
  const [delimiter, setDelimiter] = useState<Delimiter>(',');
  const [style, setStyle] = useState<Style>('striped');
  const [headerColor, setHeaderColor] = useState('#1e40af');
  const [title, setTitle] = useState('');
  const [fontSize, setFontSize] = useState(10);
  const [hasHeader, setHasHeader] = useState(true);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((f: File) => {
    const reader = new FileReader();
    reader.onload = e => setCsvText(e.target?.result as string ?? '');
    reader.readAsText(f);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const hexToRgb = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
  });

  const process = async () => {
    if (!csvText.trim()) return;
    setProcessing(true);
    try {
      const { PDFDocument, StandardFonts, rgb, degrees } = await import('pdf-lib');
      const rows = parseCsv(csvText, delimiter);
      if (!rows.length) { alert('No data found in CSV.'); return; }

      const headers = hasHeader ? rows[0] : rows[0].map((_, i) => `Column ${i + 1}`);
      const dataRows = hasHeader ? rows.slice(1) : rows;
      const colCount = headers.length;

      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

      const PAGE_W = 841.89; // A4 landscape
      const PAGE_H = 595.28;
      const MARGIN = 40;
      const usableW = PAGE_W - MARGIN * 2;
      const ROW_H = fontSize * 2.2;
      const HEADER_H = ROW_H + 4;
      const TITLE_H = title ? fontSize * 2.5 : 0;

      const colW = usableW / colCount;
      const rowsPerPage = Math.floor((PAGE_H - MARGIN * 2 - TITLE_H - HEADER_H) / ROW_H);

      const hRgb = hexToRgb(headerColor);
      const headerTextRgb = rgb(1, 1, 1);
      const stripedRgb = rgb(0.95, 0.97, 1);
      const borderRgb = rgb(0.8, 0.85, 0.92);
      const textRgb = rgb(0.1, 0.1, 0.2);

      let pageIndex = 0;
      let page = pdf.addPage([PAGE_W, PAGE_H]);

      const drawRow = (rowData: string[], y: number, isHeader: boolean, rowIdx: number) => {
        const rowRgb = isHeader
          ? rgb(hRgb.r, hRgb.g, hRgb.b)
          : style === 'striped' && rowIdx % 2 === 1
            ? stripedRgb
            : rgb(1, 1, 1);

        if (style !== 'minimal') {
          page.drawRectangle({
            x: MARGIN,
            y: y - (isHeader ? HEADER_H : ROW_H),
            width: usableW,
            height: isHeader ? HEADER_H : ROW_H,
            color: rowRgb,
          });
        }

        if (style === 'bordered' || style === 'default') {
          page.drawRectangle({
            x: MARGIN,
            y: y - (isHeader ? HEADER_H : ROW_H),
            width: usableW,
            height: isHeader ? HEADER_H : ROW_H,
            borderColor: borderRgb,
            borderWidth: 0.5,
          });
        }

        rowData.forEach((cell, ci) => {
          const cellX = MARGIN + ci * colW;
          const maxChars = Math.floor(colW / (fontSize * 0.6));
          const text = (cell ?? '').length > maxChars ? cell.slice(0, maxChars - 1) + '…' : (cell ?? '');
          page.drawText(text, {
            x: cellX + 5,
            y: y - (isHeader ? HEADER_H : ROW_H) + (isHeader ? HEADER_H : ROW_H) * 0.28,
            size: fontSize,
            font: isHeader ? fontBold : font,
            color: isHeader ? headerTextRgb : textRgb,
            maxWidth: colW - 10,
          });
        });
      };

      const drawPage = (startRow: number) => {
        let y = PAGE_H - MARGIN;

        if (title && startRow === 0) {
          page.drawText(title, {
            x: MARGIN,
            y: y - TITLE_H * 0.6,
            size: fontSize * 1.6,
            font: fontBold,
            color: rgb(hRgb.r, hRgb.g, hRgb.b),
          });
          y -= TITLE_H;
        }

        // Header
        drawRow(headers, y, true, -1);
        y -= HEADER_H;

        const end = Math.min(startRow + rowsPerPage, dataRows.length);
        for (let ri = startRow; ri < end; ri++) {
          drawRow(dataRows[ri], y, false, ri - startRow);
          y -= ROW_H;
        }

        // Page number
        page.drawText(`Page ${pageIndex + 1}`, {
          x: PAGE_W / 2 - 20,
          y: MARGIN / 2,
          size: 8,
          font,
          color: rgb(0.5, 0.5, 0.5),
        });
      };

      drawPage(0);

      let drawn = rowsPerPage;
      while (drawn < dataRows.length) {
        pageIndex++;
        page = pdf.addPage([PAGE_W, PAGE_H]);
        drawPage(drawn);
        drawn += rowsPerPage;
      }

      void degrees; // suppress unused warning

      const out = await pdf.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (title || 'data') + '.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed: ' + (err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const rows = parseCsv(csvText, delimiter);
  const previewHeaders = hasHeader ? rows[0] : rows[0]?.map((_, i) => `Col ${i + 1}`);
  const previewData = hasHeader ? rows.slice(1, 5) : rows.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">CSV Data</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={delimiter} onChange={e => setDelimiter(e.target.value as Delimiter)}
              className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value={'\t'}>Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
            <div
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 text-xs cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <Upload className="w-3 h-3" /> Upload CSV
            </div>
            <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
            <button onClick={() => setCsvText('')} className="px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-red-500 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <textarea
          value={csvText}
          onChange={e => setCsvText(e.target.value)}
          placeholder="Paste your CSV data here, or upload a file…"
          spellCheck={false}
          className="w-full h-44 p-4 font-mono text-xs bg-transparent text-gray-800 dark:text-gray-200 resize-none focus:outline-none"
        />
      </div>

      {/* Live preview table */}
      {rows.length > 0 && previewHeaders && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preview (first 4 rows)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ backgroundColor: headerColor }}>
                  {previewHeaders.map((h, i) => (
                    <th key={i} className="px-3 py-2 text-left font-semibold text-white whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 1 && style === 'striped' ? 'bg-blue-50 dark:bg-blue-900/10' : ''}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 whitespace-nowrap">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > (hasHeader ? 5 : 4) && (
            <p className="text-xs text-gray-400 px-4 py-2">… and {rows.length - (hasHeader ? 5 : 4)} more rows</p>
          )}
        </div>
      )}

      {/* PDF options */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">PDF Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Document Title (optional)</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Employee Report"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Table Style</label>
            <select value={style} onChange={e => setStyle(e.target.value as Style)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {STYLES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Header Color</label>
            <input type="color" value={headerColor} onChange={e => setHeaderColor(e.target.value)} className="h-9 w-full rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Font Size: {fontSize}pt</label>
            <input type="range" min={7} max={14} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>
          <div className="flex items-center gap-3 pt-4">
            <input type="checkbox" id="hasHeader" checked={hasHeader} onChange={e => setHasHeader(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
            <label htmlFor="hasHeader" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">First row is header</label>
          </div>
        </div>
        <p className="text-xs text-gray-400">Output: A4 Landscape • auto multi-page for large datasets</p>
      </div>

      <button onClick={process} disabled={processing || !csvText.trim()}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
        {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating PDF…</> : <><FileText className="w-5 h-5" /> Convert CSV to PDF</>}
      </button>
    </div>
  );
}
