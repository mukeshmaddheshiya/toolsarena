'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Download,
  Loader2,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  Trash2,
  RotateCcw,
  Shield,
  Search,
  Eye,
  EyeOff,
  Square,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RedactionBox {
  id: string;
  pageIndex: number;
  /** Coordinates normalised to PDF page dimensions (0-1) */
  x: number;
  y: number;
  width: number;
  height: number;
  color: RedactionColor;
}

type RedactionColor = 'black' | 'white' | 'gray';

interface HistoryEntry {
  boxes: RedactionBox[];
}

interface PageThumbnail {
  pageIndex: number;
  dataUrl: string;
}

interface PdfJsPage {
  getViewport: (opts: { scale: number }) => { width: number; height: number };
  render: (ctx: {
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }) => { promise: Promise<void> };
}

interface PdfJsDocument {
  numPages: number;
  getPage: (num: number) => Promise<PdfJsPage>;
}

interface PdfJsLib {
  version: string;
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (opts: { data: ArrayBuffer }) => { promise: Promise<PdfJsDocument> };
}

type InteractionMode = 'draw' | 'select';

interface DragState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

interface SelectionState {
  boxId: string;
  handle: 'move' | 'nw' | 'ne' | 'sw' | 'se';
  originX: number;
  originY: number;
  origBox: RedactionBox;
}

const COLOR_MAP: Record<RedactionColor, string> = {
  black: '#000000',
  white: '#ffffff',
  gray: '#808080',
};

const COLOR_LABELS: Record<RedactionColor, string> = {
  black: 'Black',
  white: 'White',
  gray: 'Gray',
};

const HANDLE_SIZE = 8;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function RedactPdfTool() {
  /* ----- PDF state ----- */
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [pdfDoc, setPdfDoc] = useState<PdfJsDocument | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);

  /* ----- Libraries ----- */
  const [pdfJsReady, setPdfJsReady] = useState(false);

  /* ----- UI state ----- */
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<InteractionMode>('draw');
  const [selectedColor, setSelectedColor] = useState<RedactionColor>('black');
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [thumbnailsLoading, setThumbnailsLoading] = useState(false);

  /* ----- Search ----- */
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  /* ----- Redaction data ----- */
  const [boxes, setBoxes] = useState<RedactionBox[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([{ boxes: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  /* ----- Drawing / selection interaction ----- */
  const [drawState, setDrawState] = useState<DragState | null>(null);
  const [selectionState, setSelectionState] = useState<SelectionState | null>(null);

  /* ----- Refs ----- */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ----- Render dimensions (canvas pixel size at current zoom) ----- */
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [pdfPageWidth, setPdfPageWidth] = useState(0);
  const [pdfPageHeight, setPdfPageHeight] = useState(0);

  /* ================================================================ */
  /*  Load pdf.js via CDN script tag                                   */
  /* ================================================================ */

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const win = window as unknown as Record<string, unknown>;
    if (win['pdfjsLib']) {
      setPdfJsReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const lib = win['pdfjsLib'] as PdfJsLib;
      lib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setPdfJsReady(true);
    };
    document.head.appendChild(script);
  }, []);

  /* ================================================================ */
  /*  History helpers                                                   */
  /* ================================================================ */

  const pushHistory = useCallback(
    (newBoxes: RedactionBox[]) => {
      setHistory((prev) => {
        const trimmed = prev.slice(0, historyIndex + 1);
        return [...trimmed, { boxes: newBoxes }];
      });
      setHistoryIndex((i) => i + 1);
      setBoxes(newBoxes);
    },
    [historyIndex],
  );

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIdx = historyIndex - 1;
    setHistoryIndex(newIdx);
    setBoxes(history[newIdx].boxes);
    setSelectedBoxId(null);
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIdx = historyIndex + 1;
    setHistoryIndex(newIdx);
    setBoxes(history[newIdx].boxes);
    setSelectedBoxId(null);
  }, [historyIndex, history]);

  /* ================================================================ */
  /*  File loading                                                     */
  /* ================================================================ */

  const loadPdf = useCallback(
    async (f: File) => {
      if (!pdfJsReady) return;
      setLoading(true);
      setError('');
      setFileName(f.name);
      setFile(f);
      setBoxes([]);
      setHistory([{ boxes: [] }]);
      setHistoryIndex(0);
      setSelectedBoxId(null);
      setCurrentPage(0);
      setZoom(1);
      setThumbnails([]);

      try {
        const buf = await f.arrayBuffer();
        setPdfBytes(buf);
        const lib = (window as unknown as Record<string, unknown>)[
          'pdfjsLib'
        ] as PdfJsLib;
        const doc = await lib.getDocument({ data: buf.slice(0) }).promise;
        setPdfDoc(doc);
        setPageCount(doc.numPages);
      } catch {
        setError('Failed to load PDF. The file may be corrupted or encrypted.');
        setFile(null);
      } finally {
        setLoading(false);
      }
    },
    [pdfJsReady],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f && (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))) {
        loadPdf(f);
      }
    },
    [loadPdf],
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) loadPdf(f);
    },
    [loadPdf],
  );

  /* ================================================================ */
  /*  Render current PDF page onto canvas                              */
  /* ================================================================ */

  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;

    (async () => {
      const page = await pdfDoc.getPage(currentPage + 1);
      const baseViewport = page.getViewport({ scale: 1 });
      setPdfPageWidth(baseViewport.width);
      setPdfPageHeight(baseViewport.height);

      const scale = zoom * (window.devicePixelRatio || 1);
      const viewport = page.getViewport({ scale });

      const displayW = Math.round(baseViewport.width * zoom);
      const displayH = Math.round(baseViewport.height * zoom);
      setCanvasWidth(displayW);
      setCanvasHeight(displayH);

      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${displayW}px`;
      canvas.style.height = `${displayH}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx || cancelled) return;
      await page.render({ canvasContext: ctx, viewport }).promise;
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, currentPage, zoom]);

  /* ================================================================ */
  /*  Overlay canvas (redaction boxes)                                 */
  /* ================================================================ */

  const currentPageBoxes = useMemo(
    () => boxes.filter((b) => b.pageIndex === currentPage),
    [boxes, currentPage],
  );

  useEffect(() => {
    const overlay = overlayCanvasRef.current;
    if (!overlay || canvasWidth === 0) return;

    overlay.width = canvasWidth * (window.devicePixelRatio || 1);
    overlay.height = canvasHeight * (window.devicePixelRatio || 1);
    overlay.style.width = `${canvasWidth}px`;
    overlay.style.height = `${canvasHeight}px`;

    const ctx = overlay.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    /* Draw existing boxes */
    for (const box of currentPageBoxes) {
      const bx = box.x * canvasWidth;
      const by = box.y * canvasHeight;
      const bw = box.width * canvasWidth;
      const bh = box.height * canvasHeight;

      ctx.fillStyle = COLOR_MAP[box.color];
      ctx.globalAlpha = box.id === selectedBoxId ? 0.7 : 0.85;
      ctx.fillRect(bx, by, bw, bh);

      /* Selection outline */
      if (box.id === selectedBoxId) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(bx, by, bw, bh);
        ctx.setLineDash([]);

        /* Resize handles */
        const handles = [
          { cx: bx, cy: by },
          { cx: bx + bw, cy: by },
          { cx: bx, cy: by + bh },
          { cx: bx + bw, cy: by + bh },
        ];
        for (const h of handles) {
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(
            h.cx - HANDLE_SIZE / 2,
            h.cy - HANDLE_SIZE / 2,
            HANDLE_SIZE,
            HANDLE_SIZE,
          );
        }
      }
    }

    /* Draw in-progress rectangle */
    if (drawState && mode === 'draw') {
      const dx = drawState.currentX - drawState.startX;
      const dy = drawState.currentY - drawState.startY;
      ctx.fillStyle = COLOR_MAP[selectedColor];
      ctx.globalAlpha = 0.4;
      ctx.fillRect(drawState.startX, drawState.startY, dx, dy);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = COLOR_MAP[selectedColor];
      ctx.lineWidth = 1;
      ctx.strokeRect(drawState.startX, drawState.startY, dx, dy);
    }

    ctx.globalAlpha = 1;
  }, [currentPageBoxes, canvasWidth, canvasHeight, drawState, mode, selectedBoxId, selectedColor]);

  /* ================================================================ */
  /*  Generate thumbnails                                              */
  /* ================================================================ */

  useEffect(() => {
    if (!pdfDoc || pageCount === 0) return;
    let cancelled = false;
    setThumbnailsLoading(true);

    (async () => {
      const thumbs: PageThumbnail[] = [];
      for (let i = 0; i < pageCount; i++) {
        if (cancelled) return;
        const page = await pdfDoc.getPage(i + 1);
        const vp = page.getViewport({ scale: 0.2 });
        const c = document.createElement('canvas');
        c.width = vp.width;
        c.height = vp.height;
        const ctx = c.getContext('2d');
        if (!ctx) continue;
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        thumbs.push({ pageIndex: i, dataUrl: c.toDataURL('image/jpeg', 0.6) });
      }
      if (!cancelled) {
        setThumbnails(thumbs);
        setThumbnailsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, pageCount]);

  /* ================================================================ */
  /*  Mouse interactions on overlay canvas                             */
  /* ================================================================ */

  const getCanvasCoords = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
      const rect = overlayCanvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    [],
  );

  const hitTestBox = useCallback(
    (
      px: number,
      py: number,
    ): { boxId: string; handle: SelectionState['handle'] } | null => {
      /* Check in reverse so topmost box is hit first */
      for (let i = currentPageBoxes.length - 1; i >= 0; i--) {
        const box = currentPageBoxes[i];
        const bx = box.x * canvasWidth;
        const by = box.y * canvasHeight;
        const bw = box.width * canvasWidth;
        const bh = box.height * canvasHeight;

        /* Check resize handles first */
        const corners: Array<{
          cx: number;
          cy: number;
          handle: SelectionState['handle'];
        }> = [
          { cx: bx, cy: by, handle: 'nw' },
          { cx: bx + bw, cy: by, handle: 'ne' },
          { cx: bx, cy: by + bh, handle: 'sw' },
          { cx: bx + bw, cy: by + bh, handle: 'se' },
        ];
        if (box.id === selectedBoxId) {
          for (const c of corners) {
            if (
              Math.abs(px - c.cx) <= HANDLE_SIZE &&
              Math.abs(py - c.cy) <= HANDLE_SIZE
            ) {
              return { boxId: box.id, handle: c.handle };
            }
          }
        }

        /* Check inside box */
        if (px >= bx && px <= bx + bw && py >= by && py <= by + bh) {
          return { boxId: box.id, handle: 'move' };
        }
      }
      return null;
    },
    [currentPageBoxes, canvasWidth, canvasHeight, selectedBoxId],
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x, y } = getCanvasCoords(e);

      if (mode === 'select') {
        const hit = hitTestBox(x, y);
        if (hit) {
          setSelectedBoxId(hit.boxId);
          const box = boxes.find((b) => b.id === hit.boxId);
          if (box) {
            setSelectionState({
              boxId: hit.boxId,
              handle: hit.handle,
              originX: x,
              originY: y,
              origBox: { ...box },
            });
          }
        } else {
          setSelectedBoxId(null);
        }
        return;
      }

      /* Draw mode */
      setSelectedBoxId(null);
      setDrawState({ startX: x, startY: y, currentX: x, currentY: y });
    },
    [mode, getCanvasCoords, hitTestBox, boxes],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x, y } = getCanvasCoords(e);

      if (drawState && mode === 'draw') {
        setDrawState((prev) =>
          prev ? { ...prev, currentX: x, currentY: y } : null,
        );
        return;
      }

      if (selectionState && mode === 'select') {
        const dx = (x - selectionState.originX) / canvasWidth;
        const dy = (y - selectionState.originY) / canvasHeight;
        const orig = selectionState.origBox;

        let newBox: RedactionBox = { ...orig };

        switch (selectionState.handle) {
          case 'move':
            newBox = {
              ...orig,
              x: clamp(orig.x + dx, 0, 1 - orig.width),
              y: clamp(orig.y + dy, 0, 1 - orig.height),
            };
            break;
          case 'nw': {
            const nx = clamp(orig.x + dx, 0, orig.x + orig.width - 0.01);
            const ny = clamp(orig.y + dy, 0, orig.y + orig.height - 0.01);
            newBox = {
              ...orig,
              x: nx,
              y: ny,
              width: orig.x + orig.width - nx,
              height: orig.y + orig.height - ny,
            };
            break;
          }
          case 'ne': {
            const ny = clamp(orig.y + dy, 0, orig.y + orig.height - 0.01);
            const nw = clamp(orig.width + dx, 0.01, 1 - orig.x);
            newBox = {
              ...orig,
              y: ny,
              width: nw,
              height: orig.y + orig.height - ny,
            };
            break;
          }
          case 'sw': {
            const nx = clamp(orig.x + dx, 0, orig.x + orig.width - 0.01);
            const nh = clamp(orig.height + dy, 0.01, 1 - orig.y);
            newBox = {
              ...orig,
              x: nx,
              width: orig.x + orig.width - nx,
              height: nh,
            };
            break;
          }
          case 'se': {
            const nw = clamp(orig.width + dx, 0.01, 1 - orig.x);
            const nh = clamp(orig.height + dy, 0.01, 1 - orig.y);
            newBox = { ...orig, width: nw, height: nh };
            break;
          }
        }

        setBoxes((prev) =>
          prev.map((b) => (b.id === selectionState.boxId ? newBox : b)),
        );
      }
    },
    [drawState, selectionState, mode, getCanvasCoords, canvasWidth, canvasHeight],
  );

  const onMouseUp = useCallback(() => {
    /* Finish drawing */
    if (drawState && mode === 'draw') {
      const x1 = Math.min(drawState.startX, drawState.currentX) / canvasWidth;
      const y1 = Math.min(drawState.startY, drawState.currentY) / canvasHeight;
      const x2 = Math.max(drawState.startX, drawState.currentX) / canvasWidth;
      const y2 = Math.max(drawState.startY, drawState.currentY) / canvasHeight;
      const w = x2 - x1;
      const h = y2 - y1;

      if (w > 0.005 && h > 0.005) {
        const newBox: RedactionBox = {
          id: uid(),
          pageIndex: currentPage,
          x: x1,
          y: y1,
          width: w,
          height: h,
          color: selectedColor,
        };
        pushHistory([...boxes, newBox]);
      }
      setDrawState(null);
      return;
    }

    /* Finish select drag */
    if (selectionState && mode === 'select') {
      pushHistory([...boxes]);
      setSelectionState(null);
    }
  }, [
    drawState,
    selectionState,
    mode,
    canvasWidth,
    canvasHeight,
    currentPage,
    selectedColor,
    boxes,
    pushHistory,
  ]);

  /* ================================================================ */
  /*  Keyboard                                                         */
  /* ================================================================ */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedBoxId) {
          e.preventDefault();
          const filtered = boxes.filter((b) => b.id !== selectedBoxId);
          pushHistory(filtered);
          setSelectedBoxId(null);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedBoxId, boxes, pushHistory, undo, redo]);

  /* ================================================================ */
  /*  Delete selected box                                              */
  /* ================================================================ */

  const deleteSelected = useCallback(() => {
    if (!selectedBoxId) return;
    const filtered = boxes.filter((b) => b.id !== selectedBoxId);
    pushHistory(filtered);
    setSelectedBoxId(null);
  }, [selectedBoxId, boxes, pushHistory]);

  /* ================================================================ */
  /*  Text search & auto-redact                                        */
  /* ================================================================ */

  const searchAndRedact = useCallback(async () => {
    if (!pdfDoc || !searchQuery.trim()) return;
    setLoading(true);

    try {
      const lib = (window as unknown as Record<string, unknown>)[
        'pdfjsLib'
      ] as PdfJsLib;

      const newBoxes: RedactionBox[] = [...boxes];
      for (let i = 0; i < pageCount; i++) {
        const page = await pdfDoc.getPage(i + 1);
        const textContent = await (
          page as PdfJsPage & {
            getTextContent: () => Promise<{
              items: Array<{
                str: string;
                transform: number[];
                width: number;
                height: number;
              }>;
            }>;
          }
        ).getTextContent();

        const viewport = page.getViewport({ scale: 1 });
        const pageW = viewport.width;
        const pageH = viewport.height;

        const query = searchQuery.toLowerCase();

        for (const item of textContent.items) {
          if (item.str.toLowerCase().includes(query)) {
            /* transform[4] = x, transform[5] = y in PDF coords (bottom-left origin) */
            const tx = item.transform[4];
            const ty = item.transform[5];
            const tw = item.width;
            const th = item.height || (item.transform[3] > 0 ? item.transform[3] : 12);

            /* Convert from PDF coords (bottom-left) to normalised top-left */
            const nx = tx / pageW;
            const ny = 1 - (ty + th) / pageH;
            const nw = tw / pageW;
            const nh = th / pageH;

            if (nw > 0 && nh > 0) {
              newBoxes.push({
                id: uid(),
                pageIndex: i,
                x: clamp(nx, 0, 1),
                y: clamp(ny, 0, 1),
                width: clamp(nw, 0.001, 1 - nx),
                height: clamp(nh, 0.001, 1 - ny),
                color: selectedColor,
              });
            }
          }
        }

        /* Need access to getTextContent - ignoring lint for dynamic API */
        void lib;
      }

      if (newBoxes.length > boxes.length) {
        pushHistory(newBoxes);
      }
    } catch {
      setError('Text search failed. Some PDFs may not contain searchable text.');
    } finally {
      setLoading(false);
    }
  }, [pdfDoc, searchQuery, boxes, pageCount, selectedColor, pushHistory]);

  /* ================================================================ */
  /*  Apply redactions & download                                      */
  /* ================================================================ */

  const applyRedactions = useCallback(async () => {
    if (!pdfBytes || boxes.length === 0) return;
    setProcessing(true);
    setError('');

    try {
      const { PDFDocument, rgb } = await import('pdf-lib');
      const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const pages = doc.getPages();

      for (const box of boxes) {
        if (box.pageIndex >= pages.length) continue;
        const page = pages[box.pageIndex];
        const { width: pw, height: ph } = page.getSize();

        /* Convert normalised coords to PDF points (bottom-left origin) */
        const rx = box.x * pw;
        const rw = box.width * pw;
        const rh = box.height * ph;
        const ry = ph - (box.y * ph + rh); /* flip Y */

        let fillColor = rgb(0, 0, 0);
        if (box.color === 'white') fillColor = rgb(1, 1, 1);
        if (box.color === 'gray') fillColor = rgb(0.5, 0.5, 0.5);

        page.drawRectangle({
          x: rx,
          y: ry,
          width: rw,
          height: rh,
          color: fillColor,
        });
      }

      const saved = await doc.save();
      const blob = new Blob([saved.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace(/\.pdf$/i, '') + '_redacted.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError('Failed to apply redactions. Please try again.');
    } finally {
      setProcessing(false);
    }
  }, [pdfBytes, boxes, fileName]);

  /* ================================================================ */
  /*  Reset                                                            */
  /* ================================================================ */

  const reset = useCallback(() => {
    setFile(null);
    setFileName('');
    setPdfDoc(null);
    setPdfBytes(null);
    setPageCount(0);
    setCurrentPage(0);
    setZoom(1);
    setBoxes([]);
    setHistory([{ boxes: [] }]);
    setHistoryIndex(0);
    setSelectedBoxId(null);
    setDrawState(null);
    setSelectionState(null);
    setError('');
    setThumbnails([]);
    setSearchQuery('');
    setSearchOpen(false);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  /* ================================================================ */
  /*  Page navigation                                                  */
  /* ================================================================ */

  const goToPrev = useCallback(() => {
    setCurrentPage((p) => Math.max(0, p - 1));
    setSelectedBoxId(null);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentPage((p) => Math.min(pageCount - 1, p + 1));
    setSelectedBoxId(null);
  }, [pageCount]);

  /* ================================================================ */
  /*  Counts                                                           */
  /* ================================================================ */

  const totalRedactions = boxes.length;
  const pageRedactions = currentPageBoxes.length;

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  /* ---------- Upload screen ---------- */
  if (!file) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Privacy badge */}
        <div className="flex items-center justify-center gap-2 mb-6 text-sm text-green-700 dark:text-green-400">
          <Shield className="w-4 h-4" />
          <span>Your PDF never leaves your browser</span>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
            ${
              dragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800'
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={onFileChange}
            className="hidden"
          />
          <motion.div
            animate={{ scale: dragging ? 1.05 : 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Drop your PDF here or click to browse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                PDF files only. Everything is processed locally in your browser.
              </p>
            </div>
          </motion.div>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 mt-6 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading PDF...</span>
          </div>
        )}

        {error && (
          <p className="mt-4 text-center text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* How it works */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: <Upload className="w-5 h-5" />,
              title: 'Upload PDF',
              desc: 'Select or drag a PDF file to get started.',
            },
            {
              icon: <Square className="w-5 h-5" />,
              title: 'Draw Redactions',
              desc: 'Click and drag to draw rectangles over sensitive content.',
            },
            {
              icon: <Download className="w-5 h-5" />,
              title: 'Download',
              desc: 'Apply redactions and download the clean PDF.',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                {step.icon}
              </div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  /* ---------- Main editor ---------- */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* ===== Top toolbar ===== */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {/* File info */}
        <div className="flex items-center gap-2 mr-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[140px] truncate">
            {fileName}
          </span>
          <span className="text-xs text-gray-400">
            {pageCount} {pageCount === 1 ? 'page' : 'pages'}
          </span>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />

        {/* Mode toggle */}
        <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-0.5">
          <button
            onClick={() => setMode('draw')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              mode === 'draw'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800'
            }`}
          >
            Draw
          </button>
          <button
            onClick={() => setMode('select')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              mode === 'select'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800'
            }`}
          >
            Select
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />

        {/* Color picker */}
        <div className="flex items-center gap-1">
          {(Object.keys(COLOR_MAP) as RedactionColor[]).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              title={COLOR_LABELS[c]}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                selectedColor === c
                  ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-600'
                  : 'border-gray-300 dark:border-gray-500'
              }`}
              style={{ backgroundColor: COLOR_MAP[c] }}
            />
          ))}
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />

        {/* Undo / Redo */}
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          title="Undo (Ctrl+Z)"
          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 text-gray-600 dark:text-gray-300"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          title="Redo (Ctrl+Shift+Z)"
          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 text-gray-600 dark:text-gray-300"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Delete selected */}
        <AnimatePresence>
          {selectedBoxId && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={deleteSelected}
              title="Delete selected (Delete key)"
              className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />

        {/* Search */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          title="Search text & auto-redact"
          className={`p-1.5 rounded-lg transition-colors ${
            searchOpen
              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Thumbnails toggle */}
        <button
          onClick={() => setShowThumbnails(!showThumbnails)}
          title="Toggle page thumbnails"
          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          {showThumbnails ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
            title="Zoom out"
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-gray-500 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            title="Zoom in"
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />

        {/* Redact All */}
        <button
          onClick={applyRedactions}
          disabled={processing || boxes.length === 0}
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {processing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Redact All
        </button>

        {/* Reset */}
        <button
          onClick={reset}
          title="Reset"
          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* ===== Search bar ===== */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20">
              <Search className="w-4 h-4 text-yellow-600 dark:text-yellow-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') searchAndRedact();
                }}
                placeholder="Enter text to find and redact..."
                className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={searchAndRedact}
                disabled={loading || !searchQuery.trim()}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white disabled:opacity-40 transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Find & Redact'
                )}
              </button>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Main area: thumbnails + canvas ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* --- Thumbnails sidebar --- */}
        <AnimatePresence>
          {showThumbnails && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 120, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-y-auto"
            >
              <div className="p-2 space-y-2">
                {thumbnailsLoading && thumbnails.length === 0 && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                )}
                {thumbnails.map((thumb) => {
                  const thumbBoxCount = boxes.filter(
                    (b) => b.pageIndex === thumb.pageIndex,
                  ).length;
                  return (
                    <button
                      key={thumb.pageIndex}
                      onClick={() => {
                        setCurrentPage(thumb.pageIndex);
                        setSelectedBoxId(null);
                      }}
                      className={`relative w-full rounded-lg overflow-hidden border-2 transition-all ${
                        currentPage === thumb.pageIndex
                          ? 'border-blue-500 shadow-md'
                          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <img
                        src={thumb.dataUrl}
                        alt={`Page ${thumb.pageIndex + 1}`}
                        className="w-full h-auto"
                      />
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-medium bg-black/60 text-white px-1.5 py-0.5 rounded">
                        {thumb.pageIndex + 1}
                      </span>
                      {thumbBoxCount > 0 && (
                        <span className="absolute top-1 right-1 text-[9px] font-bold bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center">
                          {thumbBoxCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Canvas area --- */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 flex items-start justify-center p-4"
        >
          <div
            className="relative shadow-xl"
            style={{ width: canvasWidth || 'auto', height: canvasHeight || 'auto' }}
          >
            {/* PDF render canvas */}
            <canvas
              ref={canvasRef}
              className="block"
            />
            {/* Overlay canvas for redaction drawing */}
            <canvas
              ref={overlayCanvasRef}
              className={`absolute top-0 left-0 ${
                mode === 'draw' ? 'cursor-crosshair' : 'cursor-default'
              }`}
              style={{ width: canvasWidth, height: canvasHeight }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            />

            {/* Delete button on selected box */}
            {selectedBoxId && (() => {
              const box = boxes.find((b) => b.id === selectedBoxId);
              if (!box || box.pageIndex !== currentPage) return null;
              const bx = box.x * canvasWidth + box.width * canvasWidth;
              const by = box.y * canvasHeight;
              return (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={deleteSelected}
                  className="absolute w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg z-10"
                  style={{
                    left: bx - 4,
                    top: by - 10,
                  }}
                  title="Delete redaction"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ===== Bottom bar ===== */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrev}
            disabled={currentPage === 0}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 text-gray-600 dark:text-gray-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium min-w-[80px] text-center">
            Page {currentPage + 1} / {pageCount}
          </span>
          <button
            onClick={goToNext}
            disabled={currentPage >= pageCount - 1}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 text-gray-600 dark:text-gray-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Redaction count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            This page: {pageRedactions} redaction{pageRedactions !== 1 ? 's' : ''}
          </span>
          <span className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Total: {totalRedactions} redaction{totalRedactions !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Privacy badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
          <Shield className="w-3.5 h-3.5" />
          <span>Client-side only</span>
        </div>
      </div>

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <span className="text-sm">{error}</span>
            <button onClick={() => setError('')} className="hover:bg-red-500 rounded p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
