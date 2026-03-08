'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload, Download, ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight,
  RotateCcw, ShieldCheck, Loader2, Type, Undo2,
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/* ══════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════ */

interface PdfTextItem {
  id: string;
  page: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  originalText: string;
  edited: boolean;
}

interface PageData {
  dataUrl: string;
  width: number;
  height: number;
  pdfWidth: number;
  pdfHeight: number;
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */

export function PdfEditorTool() {
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pdfName, setPdfName] = useState('');
  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1);

  const [pdfTextItems, setPdfTextItems] = useState<PdfTextItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addedTexts, setAddedTexts] = useState<PdfTextItem[]>([]);
  const [addMode, setAddMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  /* ── PDF.js loading ── */
  const [pdfJsReady, setPdfJsReady] = useState(false);

  useEffect(() => {
    if ((window as any).pdfjsLib) { setPdfJsReady(true); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setPdfJsReady(true);
    };
    document.head.appendChild(s);
  }, []);

  /* ══════════════════════════════════════════════════════════
     LOAD PDF
     ══════════════════════════════════════════════════════════ */

  const loadPdf = useCallback(async (file: File) => {
    if (!pdfJsReady) { setError('PDF.js is still loading. Please wait.'); return; }
    setLoading(true);
    setError('');
    setPdfTextItems([]);
    setAddedTexts([]);
    setEditingId(null);
    setCurrentPage(0);
    setZoom(1);

    try {
      const buf = await file.arrayBuffer();
      setPdfBytes(buf);
      setPdfName(file.name);

      const pdfjsLib = (window as any).pdfjsLib;
      const doc = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
      const totalPages = doc.numPages;
      const pageList: PageData[] = [];
      const extracted: PdfTextItem[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const p = await doc.getPage(i);
        const scale = 2;
        const vp = p.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext('2d')!;
        await p.render({ canvasContext: ctx, viewport: vp }).promise;
        const originalVp = p.getViewport({ scale: 1 });
        pageList.push({
          dataUrl: canvas.toDataURL('image/png'),
          width: vp.width, height: vp.height,
          pdfWidth: originalVp.width, pdfHeight: originalVp.height,
        });

        // Extract text
        try {
          const textContent = await p.getTextContent();
          const pageIdx = i - 1;
          for (const item of textContent.items) {
            if (!('str' in item) || !item.str.trim()) continue;
            const tx = item.transform;
            const pdfFontSize = Math.abs(tx[3]) || Math.abs(tx[0]) || 12;
            const canvasX = tx[4] * scale;
            const canvasY = (originalVp.height - tx[5]) * scale;
            const canvasFontSize = pdfFontSize * scale;
            const canvasWidth = (item.width || 0) * scale;
            const canvasHeight = canvasFontSize * 1.3;

            if (canvasWidth < 2) continue;

            extracted.push({
              id: `pt-${pageIdx}-${extracted.length}`,
              page: pageIdx,
              text: item.str,
              x: canvasX,
              y: canvasY - canvasFontSize,
              width: canvasWidth + 8,
              height: canvasHeight,
              fontSize: canvasFontSize,
              fontFamily: item.fontName?.includes('Bold') ? 'Helvetica-Bold' :
                         item.fontName?.includes('Times') ? 'Times-Roman' :
                         item.fontName?.includes('Courier') ? 'Courier' : 'Helvetica',
              color: '#000000',
              originalText: item.str,
              edited: false,
            });
          }
        } catch { /* no text on this page */ }
      }

      setPages(pageList);
      setPdfTextItems(extracted);
    } catch (e) {
      setError(`Failed to load PDF: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [pdfJsReady]);

  /* ══════════════════════════════════════════════════════════
     TEXT EDITING
     ══════════════════════════════════════════════════════════ */

  const updateTextItem = useCallback((id: string, newText: string) => {
    // Check extracted items
    setPdfTextItems(prev => prev.map(t =>
      t.id === id ? { ...t, text: newText, edited: newText !== t.originalText } : t
    ));
    // Check added items
    setAddedTexts(prev => prev.map(t =>
      t.id === id ? { ...t, text: newText, edited: true } : t
    ));
  }, []);

  const pageTextItems = pdfTextItems.filter(t => t.page === currentPage);
  const pageAddedTexts = addedTexts.filter(t => t.page === currentPage);
  const editedCount = pdfTextItems.filter(t => t.edited).length + addedTexts.length;

  /* Handle click on canvas to add new text */
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!addMode || !overlayRef.current) return;
    if (editingId) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const id = `added-${Date.now()}`;
    const newItem: PdfTextItem = {
      id,
      page: currentPage,
      text: '',
      x,
      y,
      width: 200,
      height: 32,
      fontSize: 24,
      fontFamily: 'Helvetica',
      color: '#000000',
      originalText: '',
      edited: true,
    };
    setAddedTexts(prev => [...prev, newItem]);
    setEditingId(id);
    setAddMode(false);
  }, [addMode, currentPage, editingId, zoom]);

  /* ── Keyboard: Escape closes editing ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editingId && e.key === 'Escape') {
        setEditingId(null);
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editingId]);

  /* ══════════════════════════════════════════════════════════
     SAVE PDF
     ══════════════════════════════════════════════════════════ */

  const savePdf = useCallback(async () => {
    if (!pdfBytes || pages.length === 0) return;
    setSaving(true);
    setError('');

    try {
      const doc = await PDFDocument.load(pdfBytes.slice(0));
      const fonts: Record<string, any> = {
        'Helvetica': await doc.embedFont(StandardFonts.Helvetica),
        'Helvetica-Bold': await doc.embedFont(StandardFonts.HelveticaBold),
        'Times-Roman': await doc.embedFont(StandardFonts.TimesRoman),
        'Courier': await doc.embedFont(StandardFonts.Courier),
      };

      const pdfPages = doc.getPages();

      for (let pi = 0; pi < pdfPages.length; pi++) {
        const page = pdfPages[pi];
        const pg = pages[pi];
        if (!pg) continue;

        const scX = pg.pdfWidth / pg.width;
        const scY = pg.pdfHeight / pg.height;

        // Edited extracted text: whiteout original + draw new
        const editedItems = pdfTextItems.filter(t => t.page === pi && t.edited);
        for (const t of editedItems) {
          const pdfX = t.x * scX;
          const pdfY = pg.pdfHeight - (t.y + t.height) * scY;
          const pdfW = t.width * scX;
          const pdfH = t.height * scY;
          const pdfFontSize = t.fontSize * scX;

          // Whiteout
          page.drawRectangle({
            x: pdfX - 2, y: pdfY - 2,
            width: pdfW + 4, height: pdfH + 4,
            color: rgb(1, 1, 1), opacity: 1,
          });

          // Draw new text
          if (t.text.trim()) {
            const font = fonts[t.fontFamily] || fonts['Helvetica'];
            page.drawText(t.text, {
              x: pdfX,
              y: pdfY + pdfH * 0.18,
              size: pdfFontSize,
              font,
              color: hexToRgb(t.color),
            });
          }
        }

        // Added texts
        const added = addedTexts.filter(t => t.page === pi);
        for (const t of added) {
          if (!t.text.trim()) continue;
          const pdfX = t.x * scX;
          const pdfY = pg.pdfHeight - (t.y + t.height) * scY;
          const pdfFontSize = t.fontSize * scX;
          const font = fonts[t.fontFamily] || fonts['Helvetica'];
          page.drawText(t.text, {
            x: pdfX,
            y: pdfY + t.height * scY * 0.18,
            size: pdfFontSize,
            font,
            color: hexToRgb(t.color),
          });
        }
      }

      const savedBytes = await doc.save();
      const blob = new Blob([savedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfName.replace(/\.pdf$/i, '') + '-edited.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(`Save failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }, [pdfBytes, pages, pdfName, pdfTextItems, addedTexts]);

  /* ══════════════════════════════════════════════════════════
     RENDER TEXT ITEM
     ══════════════════════════════════════════════════════════ */

  function renderTextItem(t: PdfTextItem) {
    const isEditing = editingId === t.id;
    const fontFam = t.fontFamily.includes('Courier') ? 'monospace'
      : t.fontFamily.includes('Times') ? 'serif' : 'sans-serif';
    const fontWeight = t.fontFamily.includes('Bold') ? 700 : 400;

    return (
      <div
        key={t.id}
        style={{
          position: 'absolute',
          left: t.x,
          top: t.y,
          width: isEditing ? Math.max(t.width, 150) : t.width,
          height: t.height,
          zIndex: isEditing ? 200 : 50,
          pointerEvents: 'auto',
        }}
      >
        {isEditing ? (
          <input
            type="text"
            autoFocus
            defaultValue={t.text}
            className="w-full h-full border-none outline-none px-0.5"
            style={{
              fontSize: t.fontSize,
              fontFamily: fontFam,
              fontWeight,
              color: t.color,
              lineHeight: 1.1,
              margin: 0,
              padding: '1px 2px',
              background: 'rgba(219, 234, 254, 0.85)',
              boxShadow: '0 0 0 2px #3B82F6',
              borderRadius: 2,
              caretColor: '#3B82F6',
            }}
            onBlur={e => {
              updateTextItem(t.id, e.target.value);
              setEditingId(null);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                updateTextItem(t.id, (e.target as HTMLInputElement).value);
                setEditingId(null);
              }
              if (e.key === 'Escape') {
                setEditingId(null);
              }
              e.stopPropagation();
            }}
            onMouseDown={e => e.stopPropagation()}
          />
        ) : (
          <div
            onClick={e => { e.stopPropagation(); setEditingId(t.id); }}
            className="w-full h-full cursor-text transition-all duration-100"
            style={{
              borderRadius: 2,
              border: t.edited ? '2px solid #3B82F6' : '1px solid transparent',
              background: t.edited ? 'rgba(59,130,246,0.06)' : undefined,
            }}
            onMouseEnter={e => {
              if (!t.edited) (e.currentTarget as HTMLDivElement).style.background = 'rgba(59,130,246,0.08)';
              if (!t.edited) (e.currentTarget as HTMLDivElement).style.border = '1px dashed #93C5FD';
            }}
            onMouseLeave={e => {
              if (!t.edited) (e.currentTarget as HTMLDivElement).style.background = '';
              if (!t.edited) (e.currentTarget as HTMLDivElement).style.border = '1px solid transparent';
            }}
          />
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     ZOOM
     ══════════════════════════════════════════════════════════ */

  const zoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.25, 0.25));
  const zoomFit = () => setZoom(1);

  /* ══════════════════════════════════════════════════════════
     UI
     ══════════════════════════════════════════════════════════ */

  const currentPageData = pages[currentPage];

  // UPLOAD SCREEN
  if (!pdfBytes || pages.length === 0) {
    return (
      <div className="space-y-5">
        <div
          onClick={() => !loading && fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={e => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file?.type === 'application/pdf') loadPdf(file);
          }}
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 sm:p-16 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all group"
        >
          {loading ? (
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-indigo-500 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors" />
          )}
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">
            {loading ? 'Loading PDF...' : 'Upload PDF to Edit'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            Drop your PDF here or click to browse
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 100% Private</span>
            <span>No Upload to Server</span>
            <span>No Watermark</span>
            <span>No Signup</span>
          </div>
          {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
        </div>
        <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) loadPdf(f); }} />
      </div>
    );
  }

  // EDITOR SCREEN
  return (
    <div className="space-y-2">
      {/* ── TOP BAR ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Info */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-medium">Click any text to edit</span>
            {editedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium">
                {editedCount} edited
              </span>
            )}
          </div>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Add Text button */}
          <button
            onClick={() => setAddMode(!addMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all ${
              addMode
                ? 'bg-indigo-600 text-white shadow-md'
                : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Type className="w-4 h-4" />
            Add Text
          </button>

          {/* Undo edits */}
          {editedCount > 0 && (
            <button
              onClick={() => {
                setPdfTextItems(prev => prev.map(t => ({ ...t, text: t.originalText, edited: false })));
                setAddedTexts([]);
                setEditingId(null);
              }}
              className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Reset all edits"
            >
              <Undo2 className="w-3.5 h-3.5" />
              Reset
            </button>
          )}

          <div className="flex-1" />

          {/* Zoom */}
          <button onClick={zoomOut} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 min-w-[3rem] text-center select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={zoomIn} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={zoomFit} title="Reset zoom" className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── ADD TEXT HINT ── */}
      {addMode && (
        <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl px-4 py-2 text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
          <Type className="w-4 h-4 flex-shrink-0" />
          Click anywhere on the page to add new text.
          <button onClick={() => setAddMode(false)} className="ml-auto text-indigo-500 hover:text-indigo-700 text-xs font-medium">Cancel</button>
        </div>
      )}

      {/* ── PDF CANVAS ── */}
      <div className="bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-auto" style={{ maxHeight: '72vh' }}>
        {currentPageData && (
          <div className="flex justify-center p-4" style={{ minWidth: currentPageData.width * zoom + 32 }}>
            <div
              ref={overlayRef}
              className="relative shadow-xl bg-white"
              style={{
                width: currentPageData.width * zoom,
                height: currentPageData.height * zoom,
                cursor: addMode ? 'crosshair' : 'default',
              }}
              onClick={handleCanvasClick}
            >
              {/* PDF page image */}
              <img
                src={currentPageData.dataUrl}
                alt={`Page ${currentPage + 1}`}
                draggable={false}
                className="absolute inset-0 w-full h-full select-none"
                style={{ pointerEvents: 'none' }}
              />

              {/* Text overlay layer */}
              <div
                className="absolute inset-0"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  width: currentPageData.width,
                  height: currentPageData.height,
                }}
              >
                {pageTextItems.map(renderTextItem)}
                {pageAddedTexts.map(renderTextItem)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 select-none">
              Page <strong>{currentPage + 1}</strong> of {pages.length}
            </span>
            <button onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))} disabled={currentPage >= pages.length - 1}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => {
              setPdfBytes(null); setPages([]); setPdfTextItems([]); setAddedTexts([]);
              setEditingId(null); setCurrentPage(0);
            }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <RotateCcw className="w-4 h-4" /> New
            </button>
            <button onClick={savePdf} disabled={saving || editedCount === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 transition-colors shadow-sm">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {saving ? 'Applying...' : 'Apply changes'}
            </button>
          </div>
        </div>
      </div>

      {/* ── PAGE THUMBNAILS ── */}
      {pages.length > 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2.5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {pages.map((pg, i) => {
              const editCount = pdfTextItems.filter(t => t.page === i && t.edited).length
                + addedTexts.filter(t => t.page === i).length;
              return (
                <button key={i} onClick={() => setCurrentPage(i)}
                  className={`flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all ${
                    i === currentPage
                      ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                  }`}>
                  <img src={pg.dataUrl} alt={`Page ${i + 1}`} className="w-16 h-auto object-contain" draggable={false} />
                  <div className="text-[10px] text-center py-0.5 text-slate-500 dark:text-slate-400">
                    {i + 1}{editCount > 0 && <span className="text-blue-500 ml-0.5">({editCount})</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg p-3">{error}</div>}

      {/* ── TRUST BADGE ── */}
      <div className="flex items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-500 py-1">
        <ShieldCheck className="w-4 h-4" />
        <span>Your PDF never leaves your device. All editing happens in your browser.</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════ */

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  return rgb(
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255,
  );
}
