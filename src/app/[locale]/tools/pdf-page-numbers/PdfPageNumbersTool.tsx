'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Download, Loader2, FileText, X } from 'lucide-react';

type Position = 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right';
type Format = 'number' | 'page-of-total' | 'dash-number-dash';

export function PdfPageNumbersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [startNum, setStartNum] = useState(1);
  const [position, setPosition] = useState<Position>('bottom-center');
  const [format, setFormat] = useState<Format>('number');
  const [fontSize, setFontSize] = useState(11);
  const [color, setColor] = useState('#000000');
  const [margin, setMargin] = useState(20);
  const [prefix, setPrefix] = useState('');
  const [skipFirst, setSkipFirst] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf') return;
    setLoading(true);
    setFile(f);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    } catch {
      alert('Failed to read PDF.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const formatLabel = (pageNum: number, total: number): string => {
    const n = pageNum + startNum - 1;
    switch (format) {
      case 'number': return `${prefix}${n}`;
      case 'page-of-total': return `${prefix}${n} / ${total + startNum - 1}`;
      case 'dash-number-dash': return `${prefix}- ${n} -`;
    }
  };

  const hexToRgb = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
  });

  const process = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const total = pages.length;
      const { r, g, b } = hexToRgb(color);

      pages.forEach((page, idx) => {
        if (skipFirst && idx === 0) return;
        const { width, height } = page.getSize();
        const label = formatLabel(idx + 1, total);
        const textWidth = font.widthOfTextAtSize(label, fontSize);

        let x: number;
        let y: number;
        const isTop = position.startsWith('top');
        y = isTop ? height - margin - fontSize : margin;

        if (position.includes('center')) {
          x = (width - textWidth) / 2;
        } else if (position.includes('left')) {
          x = margin;
        } else {
          x = width - textWidth - margin;
        }

        page.drawText(label, { x, y, size: fontSize, font, color: rgb(r, g, b) });
      });

      const out = await pdf.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, '') + '-numbered.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed: ' + (err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const previewLabel = formatLabel(1, pageCount || 10);

  return (
    <div className="space-y-6">
      {!file && (
        <div
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${dragging ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10'}`}
        >
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-green-400" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Drop your PDF here or click to browse</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Automatically add page numbers to every page</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-10 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-green-500" /> Reading PDF…
        </div>
      )}

      {file && !loading && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{file.name}</p>
              <p className="text-sm text-gray-400">{pageCount} page{pageCount !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => { setFile(null); setPageCount(0); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Preview (first page)</p>
            <div className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 h-28 flex items-center justify-center">
              <span className="text-xs text-gray-300 dark:text-gray-600">Page content</span>
              <span
                style={{ color, fontSize: Math.min(fontSize, 14) }}
                className={`absolute font-mono ${
                  position === 'bottom-center' ? 'bottom-2 left-1/2 -translate-x-1/2' :
                  position === 'bottom-left' ? 'bottom-2 left-3' :
                  position === 'bottom-right' ? 'bottom-2 right-3' :
                  position === 'top-center' ? 'top-2 left-1/2 -translate-x-1/2' :
                  position === 'top-left' ? 'top-2 left-3' :
                  'top-2 right-3'
                }`}
              >
                {previewLabel}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Page Number Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Position</label>
                <select value={position} onChange={e => setPosition(e.target.value as Position)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Format</label>
                <select value={format} onChange={e => setFormat(e.target.value as Format)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="number">1, 2, 3…</option>
                  <option value="page-of-total">1 / 10, 2 / 10…</option>
                  <option value="dash-number-dash">- 1 -, - 2 -…</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Start from</label>
                <input type="number" min={0} max={999} value={startNum} onChange={e => setStartNum(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Font Size: {fontSize}pt</label>
                <input type="range" min={8} max={24} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Margin: {margin}px</label>
                <input type="range" min={5} max={60} value={margin} onChange={e => setMargin(Number(e.target.value))} className="w-full accent-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Color</label>
                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9 w-full rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Prefix (optional)</label>
                <input value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="e.g. Page " className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <input type="checkbox" id="skipFirst" checked={skipFirst} onChange={e => setSkipFirst(e.target.checked)} className="w-4 h-4 accent-green-500" />
                <label htmlFor="skipFirst" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">Skip first page (cover)</label>
              </div>
            </div>
          </div>

          <button onClick={process} disabled={processing}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
            {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : <><Download className="w-5 h-5" /> Download PDF with Page Numbers</>}
          </button>
        </>
      )}
    </div>
  );
}
