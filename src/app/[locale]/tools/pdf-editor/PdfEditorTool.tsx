'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload, Download, ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight,
  Type, Pen, Square, Circle, Minus, Image as ImageIcon, Highlighter,
  Eraser, Undo2, Redo2, Trash2, MousePointer2, FileSignature,
  Stamp, ArrowUpRight, ShieldCheck, RotateCcw, Palette, Bold, Italic,
  AlignLeft, AlignCenter, AlignRight, Eye, EyeOff, Move, Copy, X,
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

/* ══════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════ */

type ToolType =
  | 'select' | 'text' | 'draw' | 'rect' | 'circle'
  | 'line' | 'arrow' | 'highlight' | 'whiteout' | 'image'
  | 'signature' | 'stamp' | 'eraser';

interface Point { x: number; y: number }

interface BaseAnnotation {
  id: string;
  page: number;
  type: string;
  x: number;
  y: number;
  color: string;
  opacity: number;
}

interface TextAnnotation extends BaseAnnotation {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  width: number;
}

interface DrawAnnotation extends BaseAnnotation {
  type: 'draw';
  points: Point[];
  lineWidth: number;
}

interface ShapeAnnotation extends BaseAnnotation {
  type: 'rect' | 'circle' | 'line' | 'arrow';
  width: number;
  height: number;
  lineWidth: number;
  fill: boolean;
}

interface HighlightAnnotation extends BaseAnnotation {
  type: 'highlight';
  width: number;
  height: number;
}

interface WhiteoutAnnotation extends BaseAnnotation {
  type: 'whiteout';
  width: number;
  height: number;
}

interface ImageAnnotation extends BaseAnnotation {
  type: 'image' | 'signature' | 'stamp';
  dataUrl: string;
  width: number;
  height: number;
}

type Annotation = TextAnnotation | DrawAnnotation | ShapeAnnotation | HighlightAnnotation | WhiteoutAnnotation | ImageAnnotation;

interface PageData {
  dataUrl: string;
  width: number;
  height: number;
  pdfWidth: number;
  pdfHeight: number;
}

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════════ */

const STAMPS = ['APPROVED', 'DRAFT', 'CONFIDENTIAL', 'COPY', 'VOID', 'FINAL', 'REVIEWED', 'URGENT'];

const FONTS = ['Helvetica', 'Times-Roman', 'Courier'];

const COLORS = [
  '#000000', '#EF4444', '#F59E0B', '#22C55E', '#3B82F6',
  '#8B5CF6', '#EC4899', '#FFFFFF', '#6B7280', '#0EA5E9',
];

let _annotId = 0;
function newId() { return `a-${++_annotId}-${Date.now()}`; }

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */

export function PdfEditorTool() {
  /* ── PDF state ── */
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pdfName, setPdfName] = useState('');
  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  /* ── Tool state ── */
  const [tool, setTool] = useState<ToolType>('select');
  const [color, setColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [lineWidth, setLineWidth] = useState(2);
  const [opacity, setOpacity] = useState(1);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [fillShape, setFillShape] = useState(false);

  /* ── Annotations ── */
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<Annotation[][]>([]);
  const [redoStack, setRedoStack] = useState<Annotation[][]>([]);

  /* ── Canvas state ── */
  const [zoom, setZoom] = useState(1);
  const [drawing, setDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState<Point[]>([]);
  const [shapeStart, setShapeStart] = useState<Point | null>(null);
  const [shapePreview, setShapePreview] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [dragging, setDragging] = useState<{ id: string; offX: number; offY: number } | null>(null);
  const [editingText, setEditingText] = useState<string | null>(null);

  /* ── Signature pad ── */
  const [showSigPad, setShowSigPad] = useState(false);
  const [showStamps, setShowStamps] = useState(false);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const sigDrawing = useRef(false);

  /* ── Refs ── */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

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
    setAnnotations([]);
    setUndoStack([]);
    setRedoStack([]);
    setSelected(null);
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

      for (let i = 1; i <= totalPages; i++) {
        const p = await doc.getPage(i);
        const vp = p.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext('2d')!;
        await p.render({ canvasContext: ctx, viewport: vp }).promise;
        const originalVp = p.getViewport({ scale: 1 });
        pageList.push({
          dataUrl: canvas.toDataURL('image/png'),
          width: vp.width,
          height: vp.height,
          pdfWidth: originalVp.width,
          pdfHeight: originalVp.height,
        });
      }

      setPages(pageList);
    } catch (e) {
      setError(`Failed to load PDF: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [pdfJsReady]);

  /* ══════════════════════════════════════════════════════════
     UNDO / REDO
     ══════════════════════════════════════════════════════════ */

  const pushUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-50), annotations]);
    setRedoStack([]);
  }, [annotations]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack(r => [...r, annotations]);
    setUndoStack(u => u.slice(0, -1));
    setAnnotations(prev);
    setSelected(null);
  }, [undoStack, annotations]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(u => [...u, annotations]);
    setRedoStack(r => r.slice(0, -1));
    setAnnotations(next);
    setSelected(null);
  }, [redoStack, annotations]);

  /* ══════════════════════════════════════════════════════════
     ANNOTATION HELPERS
     ══════════════════════════════════════════════════════════ */

  const addAnnotation = useCallback((a: Annotation) => {
    pushUndo();
    setAnnotations(prev => [...prev, a]);
    setSelected(a.id);
  }, [pushUndo]);

  const updateAnnotation = useCallback((id: string, patch: Partial<Annotation>) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, ...patch } as Annotation : a));
  }, []);

  const deleteSelected = useCallback(() => {
    if (!selected) return;
    pushUndo();
    setAnnotations(prev => prev.filter(a => a.id !== selected));
    setSelected(null);
  }, [selected, pushUndo]);

  const duplicateSelected = useCallback(() => {
    if (!selected) return;
    const ann = annotations.find(a => a.id === selected);
    if (!ann) return;
    const dup = { ...ann, id: newId(), x: ann.x + 20, y: ann.y + 20 };
    addAnnotation(dup as Annotation);
  }, [selected, annotations, addAnnotation]);

  const pageAnnotations = annotations.filter(a => a.page === currentPage);

  /* ══════════════════════════════════════════════════════════
     CANVAS / MOUSE EVENTS
     ══════════════════════════════════════════════════════════ */

  const getPos = useCallback((e: React.MouseEvent): Point => {
    const rect = overlayRef.current!.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom };
  }, [zoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (editingText) return;
    const pos = getPos(e);

    if (tool === 'select') {
      // Check if clicking on an annotation
      const hit = [...pageAnnotations].reverse().find(a => {
        if (a.type === 'draw') {
          return a.points.some(p => Math.abs(p.x - pos.x) < 10 && Math.abs(p.y - pos.y) < 10);
        }
        const w = 'width' in a ? (a as any).width : 100;
        const h = 'height' in a ? (a as any).height : 30;
        return pos.x >= a.x && pos.x <= a.x + w && pos.y >= a.y && pos.y <= a.y + h;
      });
      if (hit) {
        setSelected(hit.id);
        setDragging({ id: hit.id, offX: pos.x - hit.x, offY: pos.y - hit.y });
      } else {
        setSelected(null);
      }
      return;
    }

    if (tool === 'text') {
      const id = newId();
      addAnnotation({
        id, page: currentPage, type: 'text',
        x: pos.x, y: pos.y, color, opacity,
        text: '', fontSize, fontFamily, bold, italic, align: textAlign,
        width: 200,
      });
      setEditingText(id);
      return;
    }

    if (tool === 'draw' || tool === 'eraser') {
      setDrawing(true);
      setDrawPoints([pos]);
      return;
    }

    if (['rect', 'circle', 'line', 'arrow', 'highlight', 'whiteout'].includes(tool)) {
      setShapeStart(pos);
      setShapePreview(null);
      return;
    }
  }, [tool, pageAnnotations, getPos, addAnnotation, currentPage, color, opacity, fontSize, fontFamily, bold, italic, textAlign, editingText]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const pos = getPos(e);

    if (dragging) {
      pushUndo();
      updateAnnotation(dragging.id, { x: pos.x - dragging.offX, y: pos.y - dragging.offY });
      return;
    }

    if (drawing) {
      setDrawPoints(prev => [...prev, pos]);
      return;
    }

    if (shapeStart) {
      setShapePreview({
        x: Math.min(shapeStart.x, pos.x),
        y: Math.min(shapeStart.y, pos.y),
        w: Math.abs(pos.x - shapeStart.x),
        h: Math.abs(pos.y - shapeStart.y),
      });
      return;
    }
  }, [dragging, drawing, shapeStart, getPos, pushUndo, updateAnnotation]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    const pos = getPos(e);

    if (dragging) {
      setDragging(null);
      return;
    }

    if (drawing && drawPoints.length > 1) {
      const finalPoints = [...drawPoints, pos];
      if (tool === 'eraser') {
        // Erase: remove annotations near the eraser path
        pushUndo();
        const toRemove = new Set<string>();
        for (const a of pageAnnotations) {
          for (const p of finalPoints) {
            const dist = Math.abs(p.x - a.x) + Math.abs(p.y - a.y);
            if (dist < 30) toRemove.add(a.id);
          }
        }
        if (toRemove.size > 0) {
          setAnnotations(prev => prev.filter(a => !toRemove.has(a.id)));
        }
      } else {
        addAnnotation({
          id: newId(), page: currentPage, type: 'draw',
          x: 0, y: 0, color, opacity, points: finalPoints, lineWidth,
        });
      }
      setDrawing(false);
      setDrawPoints([]);
      return;
    }

    if (shapeStart && shapePreview && (shapePreview.w > 5 || shapePreview.h > 5)) {
      const sx = Math.min(shapeStart.x, pos.x);
      const sy = Math.min(shapeStart.y, pos.y);
      const sw = Math.abs(pos.x - shapeStart.x);
      const sh = Math.abs(pos.y - shapeStart.y);

      if (tool === 'highlight') {
        addAnnotation({
          id: newId(), page: currentPage, type: 'highlight',
          x: sx, y: sy, color: '#FBBF24', opacity: 0.35, width: sw, height: sh,
        });
      } else if (tool === 'whiteout') {
        addAnnotation({
          id: newId(), page: currentPage, type: 'whiteout',
          x: sx, y: sy, color: '#FFFFFF', opacity: 1, width: sw, height: sh,
        });
      } else if (['rect', 'circle', 'line', 'arrow'].includes(tool)) {
        addAnnotation({
          id: newId(), page: currentPage, type: tool as 'rect' | 'circle' | 'line' | 'arrow',
          x: sx, y: sy, color, opacity,
          width: sw, height: sh, lineWidth, fill: fillShape,
        });
      }

      setShapeStart(null);
      setShapePreview(null);
      return;
    }

    setDrawing(false);
    setDrawPoints([]);
    setShapeStart(null);
    setShapePreview(null);
  }, [dragging, drawing, drawPoints, shapeStart, shapePreview, tool, getPos, addAnnotation, currentPage, color, opacity, lineWidth, fillShape, pushUndo, pageAnnotations]);

  /* ══════════════════════════════════════════════════════════
     DRAW ON CANVAS (FREEHAND / PREVIEW)
     ══════════════════════════════════════════════════════════ */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || pages.length === 0) return;
    const pg = pages[currentPage];
    if (!pg) return;

    canvas.width = pg.width;
    canvas.height = pg.height;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw active freehand stroke
    if (drawing && drawPoints.length > 1) {
      ctx.strokeStyle = tool === 'eraser' ? '#FF000055' : color;
      ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = tool === 'eraser' ? 0.3 : opacity;
      ctx.beginPath();
      ctx.moveTo(drawPoints[0].x, drawPoints[0].y);
      for (let i = 1; i < drawPoints.length; i++) {
        ctx.lineTo(drawPoints[i].x, drawPoints[i].y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw shape preview
    if (shapePreview && shapeStart) {
      ctx.strokeStyle = tool === 'highlight' ? '#FBBF24' : tool === 'whiteout' ? '#94A3B8' : color;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.globalAlpha = 0.6;

      if (tool === 'rect' || tool === 'highlight' || tool === 'whiteout') {
        ctx.strokeRect(shapePreview.x, shapePreview.y, shapePreview.w, shapePreview.h);
      } else if (tool === 'circle') {
        ctx.beginPath();
        ctx.ellipse(
          shapePreview.x + shapePreview.w / 2,
          shapePreview.y + shapePreview.h / 2,
          shapePreview.w / 2,
          shapePreview.h / 2,
          0, 0, Math.PI * 2
        );
        ctx.stroke();
      } else if (tool === 'line' || tool === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(shapeStart.x, shapeStart.y);
        const endX = shapeStart.x + (shapePreview.x - Math.min(shapeStart.x, shapeStart.x + shapePreview.w - shapePreview.w)) + shapePreview.w;
        const endY = shapeStart.y + shapePreview.h;
        ctx.lineTo(shapePreview.x + shapePreview.w, shapePreview.y + shapePreview.h);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }
  }, [drawing, drawPoints, shapePreview, shapeStart, pages, currentPage, color, lineWidth, opacity, tool]);

  /* ══════════════════════════════════════════════════════════
     IMAGE ADD
     ══════════════════════════════════════════════════════════ */

  const handleImageAdd = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const maxW = 300;
        const scale = img.width > maxW ? maxW / img.width : 1;
        addAnnotation({
          id: newId(), page: currentPage, type: 'image',
          x: 50, y: 50, color: '', opacity: 1,
          dataUrl: reader.result as string,
          width: img.width * scale, height: img.height * scale,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [addAnnotation, currentPage]);

  /* ══════════════════════════════════════════════════════════
     SIGNATURE PAD
     ══════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (!showSigPad || !sigCanvasRef.current) return;
    const c = sigCanvasRef.current;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    const onDown = (e: MouseEvent) => {
      sigDrawing.current = true;
      ctx.beginPath();
      const r = c.getBoundingClientRect();
      ctx.moveTo(e.clientX - r.left, e.clientY - r.top);
    };
    const onMove = (e: MouseEvent) => {
      if (!sigDrawing.current) return;
      const r = c.getBoundingClientRect();
      ctx.lineTo(e.clientX - r.left, e.clientY - r.top);
      ctx.stroke();
    };
    const onUp = () => { sigDrawing.current = false; };

    c.addEventListener('mousedown', onDown);
    c.addEventListener('mousemove', onMove);
    c.addEventListener('mouseup', onUp);
    c.addEventListener('mouseleave', onUp);

    return () => {
      c.removeEventListener('mousedown', onDown);
      c.removeEventListener('mousemove', onMove);
      c.removeEventListener('mouseup', onUp);
      c.removeEventListener('mouseleave', onUp);
    };
  }, [showSigPad]);

  const addSignature = useCallback(() => {
    if (!sigCanvasRef.current) return;
    const dataUrl = sigCanvasRef.current.toDataURL('image/png');
    addAnnotation({
      id: newId(), page: currentPage, type: 'signature',
      x: 50, y: 50, color: '', opacity: 1,
      dataUrl, width: 200, height: 80,
    });
    setShowSigPad(false);
  }, [addAnnotation, currentPage]);

  /* ══════════════════════════════════════════════════════════
     STAMP
     ══════════════════════════════════════════════════════════ */

  const addStamp = useCallback((text: string) => {
    // Create a stamp as a canvas -> dataUrl
    const c = document.createElement('canvas');
    c.width = 240;
    c.height = 80;
    const ctx = c.getContext('2d')!;
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 224, 64);
    ctx.font = 'bold 28px Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#EF4444';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 120, 42);

    addAnnotation({
      id: newId(), page: currentPage, type: 'stamp',
      x: 100, y: 100, color: '', opacity: 0.8,
      dataUrl: c.toDataURL('image/png'),
      width: 240, height: 80,
    });
    setShowStamps(false);
  }, [addAnnotation, currentPage]);

  /* ══════════════════════════════════════════════════════════
     SAVE PDF
     ══════════════════════════════════════════════════════════ */

  const savePdf = useCallback(async () => {
    if (!pdfBytes || pages.length === 0) return;
    setSaving(true);
    setError('');

    try {
      const doc = await PDFDocument.load(pdfBytes.slice(0));
      const helvetica = await doc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
      const timesBold = await doc.embedFont(StandardFonts.TimesRomanBold);
      const timesRoman = await doc.embedFont(StandardFonts.TimesRoman);
      const courier = await doc.embedFont(StandardFonts.Courier);
      const courierBold = await doc.embedFont(StandardFonts.CourierBold);

      const fontMap: Record<string, any> = {
        'Helvetica': helvetica,
        'Helvetica-Bold': helveticaBold,
        'Times-Roman': timesRoman,
        'Times-Roman-Bold': timesBold,
        'Courier': courier,
        'Courier-Bold': courierBold,
      };

      const pdfPages = doc.getPages();

      for (let pi = 0; pi < pdfPages.length; pi++) {
        const page = pdfPages[pi];
        const pg = pages[pi];
        if (!pg) continue;
        const pAnns = annotations.filter(a => a.page === pi);
        const scaleX = pg.pdfWidth / pg.width;
        const scaleY = pg.pdfHeight / pg.height;

        for (const a of pAnns) {
          const pdfX = a.x * scaleX;
          const pdfY = pg.pdfHeight - (a.y * scaleY);

          if (a.type === 'text' && a.text.trim()) {
            const fontKey = `${a.fontFamily}${a.bold ? '-Bold' : ''}`;
            const font = fontMap[fontKey] || helvetica;
            const lines = a.text.split('\n');
            const pdfFontSize = a.fontSize * scaleX;
            lines.forEach((line, li) => {
              page.drawText(line, {
                x: pdfX,
                y: pdfY - (li + 1) * pdfFontSize * 1.2,
                size: pdfFontSize,
                font,
                color: hexToRgb(a.color),
                opacity: a.opacity,
              });
            });
          }

          if (a.type === 'draw') {
            const pts = a.points;
            for (let i = 0; i < pts.length - 1; i++) {
              const x1 = pts[i].x * scaleX;
              const y1 = pg.pdfHeight - pts[i].y * scaleY;
              const x2 = pts[i + 1].x * scaleX;
              const y2 = pg.pdfHeight - pts[i + 1].y * scaleY;
              page.drawLine({
                start: { x: x1, y: y1 },
                end: { x: x2, y: y2 },
                thickness: a.lineWidth * scaleX,
                color: hexToRgb(a.color),
                opacity: a.opacity,
              });
            }
          }

          if (a.type === 'rect') {
            const w = a.width * scaleX;
            const h = a.height * scaleY;
            page.drawRectangle({
              x: pdfX,
              y: pdfY - h,
              width: w,
              height: h,
              borderColor: hexToRgb(a.color),
              borderWidth: a.lineWidth * scaleX,
              color: a.fill ? hexToRgb(a.color) : undefined,
              opacity: a.fill ? a.opacity * 0.3 : a.opacity,
              borderOpacity: a.opacity,
            });
          }

          if (a.type === 'circle') {
            const rx = (a.width / 2) * scaleX;
            const ry = (a.height / 2) * scaleY;
            page.drawEllipse({
              x: pdfX + rx,
              y: pdfY - ry,
              xScale: rx,
              yScale: ry,
              borderColor: hexToRgb(a.color),
              borderWidth: a.lineWidth * scaleX,
              color: a.fill ? hexToRgb(a.color) : undefined,
              opacity: a.fill ? a.opacity * 0.3 : a.opacity,
              borderOpacity: a.opacity,
            });
          }

          if (a.type === 'line' || a.type === 'arrow') {
            const endX = pdfX + a.width * scaleX;
            const endY = pdfY - a.height * scaleY;
            page.drawLine({
              start: { x: pdfX, y: pdfY },
              end: { x: endX, y: endY },
              thickness: a.lineWidth * scaleX,
              color: hexToRgb(a.color),
              opacity: a.opacity,
            });
            if (a.type === 'arrow') {
              // Small arrowhead
              const angle = Math.atan2(pdfY - endY, endX - pdfX);
              const hl = 12 * scaleX;
              page.drawLine({
                start: { x: endX, y: endY },
                end: { x: endX - hl * Math.cos(angle - 0.4), y: endY + hl * Math.sin(angle - 0.4) },
                thickness: a.lineWidth * scaleX,
                color: hexToRgb(a.color),
                opacity: a.opacity,
              });
              page.drawLine({
                start: { x: endX, y: endY },
                end: { x: endX - hl * Math.cos(angle + 0.4), y: endY + hl * Math.sin(angle + 0.4) },
                thickness: a.lineWidth * scaleX,
                color: hexToRgb(a.color),
                opacity: a.opacity,
              });
            }
          }

          if (a.type === 'highlight') {
            page.drawRectangle({
              x: pdfX,
              y: pdfY - a.height * scaleY,
              width: a.width * scaleX,
              height: a.height * scaleY,
              color: hexToRgb(a.color),
              opacity: a.opacity,
            });
          }

          if (a.type === 'whiteout') {
            page.drawRectangle({
              x: pdfX,
              y: pdfY - a.height * scaleY,
              width: a.width * scaleX,
              height: a.height * scaleY,
              color: rgb(1, 1, 1),
              opacity: 1,
            });
          }

          if (a.type === 'image' || a.type === 'signature' || a.type === 'stamp') {
            try {
              const imgBytes = await fetch(a.dataUrl).then(r => r.arrayBuffer());
              const isPng = a.dataUrl.includes('image/png');
              const img = isPng
                ? await doc.embedPng(imgBytes)
                : await doc.embedJpg(imgBytes);
              page.drawImage(img, {
                x: pdfX,
                y: pdfY - a.height * scaleY,
                width: a.width * scaleX,
                height: a.height * scaleY,
                opacity: a.opacity,
              });
            } catch {
              // Skip image if embedding fails
            }
          }
        }
      }

      const savedBytes = await doc.save();
      const blob = new Blob([savedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfName.replace(/\.pdf$/i, '') + '-edited.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(`Save failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }, [pdfBytes, pages, annotations, pdfName]);

  /* ══════════════════════════════════════════════════════════
     KEYBOARD SHORTCUTS
     ══════════════════════════════════════════════════════════ */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editingText) return;
      if (e.key === 'Delete' || e.key === 'Backspace') { if (selected) { e.preventDefault(); deleteSelected(); } }
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
      if (e.ctrlKey && e.key === 'd') { e.preventDefault(); duplicateSelected(); }
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); savePdf(); }
      if (e.key === 'Escape') { setSelected(null); setEditingText(null); }
      if (e.key === 'v') setTool('select');
      if (e.key === 't') setTool('text');
      if (e.key === 'p') setTool('draw');
      if (e.key === 'r') setTool('rect');
      if (e.key === 'h') setTool('highlight');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editingText, selected, deleteSelected, undo, redo, duplicateSelected, savePdf]);

  /* ══════════════════════════════════════════════════════════
     ZOOM
     ══════════════════════════════════════════════════════════ */

  const zoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.25, 0.25));
  const zoomFit = () => setZoom(1);

  /* ══════════════════════════════════════════════════════════
     RENDER ANNOTATION OVERLAYS
     ══════════════════════════════════════════════════════════ */

  function renderAnnotation(a: Annotation) {
    const isSelected = a.id === selected;
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: a.x,
      top: a.y,
      pointerEvents: tool === 'select' || tool === 'eraser' ? 'auto' : 'none',
      outline: isSelected ? '2px solid #3B82F6' : 'none',
      outlineOffset: 2,
      cursor: tool === 'select' ? 'move' : 'default',
    };

    if (a.type === 'text') {
      return (
        <div
          key={a.id}
          style={{
            ...baseStyle,
            width: a.width,
            minHeight: 24,
            color: a.color,
            fontSize: a.fontSize,
            fontFamily: a.fontFamily === 'Courier' ? 'monospace' : a.fontFamily === 'Times-Roman' ? 'serif' : 'sans-serif',
            fontWeight: a.bold ? 700 : 400,
            fontStyle: a.italic ? 'italic' : 'normal',
            textAlign: a.align,
            opacity: a.opacity,
            lineHeight: 1.3,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            padding: '2px 4px',
            background: editingText === a.id ? 'rgba(59,130,246,0.05)' : 'transparent',
            border: editingText === a.id ? '1px dashed #3B82F6' : isSelected ? 'none' : '1px dashed transparent',
          }}
          contentEditable={editingText === a.id}
          suppressContentEditableWarning
          onDoubleClick={(e) => {
            e.stopPropagation();
            setSelected(a.id);
            setEditingText(a.id);
          }}
          onBlur={(e) => {
            const newText = e.currentTarget.textContent || '';
            updateAnnotation(a.id, { text: newText });
            setEditingText(null);
          }}
          onMouseDown={(e) => {
            if (editingText === a.id) e.stopPropagation();
          }}
        >
          {a.text || (editingText === a.id ? '' : 'Click to type...')}
        </div>
      );
    }

    if (a.type === 'draw') {
      // Render SVG for draw annotations
      const pts = a.points;
      if (pts.length < 2) return null;
      const minX = Math.min(...pts.map(p => p.x)) - 5;
      const minY = Math.min(...pts.map(p => p.y)) - 5;
      const maxX = Math.max(...pts.map(p => p.x)) + 5;
      const maxY = Math.max(...pts.map(p => p.y)) + 5;
      const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x - minX},${p.y - minY}`).join(' ');
      return (
        <svg
          key={a.id}
          style={{
            ...baseStyle,
            left: minX,
            top: minY,
            width: maxX - minX,
            height: maxY - minY,
          }}
          viewBox={`0 0 ${maxX - minX} ${maxY - minY}`}
        >
          <path
            d={pathD}
            fill="none"
            stroke={a.color}
            strokeWidth={a.lineWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={a.opacity}
          />
        </svg>
      );
    }

    if (a.type === 'rect') {
      return (
        <div
          key={a.id}
          style={{
            ...baseStyle,
            width: a.width,
            height: a.height,
            border: `${a.lineWidth}px solid ${a.color}`,
            background: a.fill ? a.color + '4D' : 'transparent',
            opacity: a.opacity,
            borderRadius: 2,
          }}
        />
      );
    }

    if (a.type === 'circle') {
      return (
        <div
          key={a.id}
          style={{
            ...baseStyle,
            width: a.width,
            height: a.height,
            border: `${a.lineWidth}px solid ${a.color}`,
            background: a.fill ? a.color + '4D' : 'transparent',
            opacity: a.opacity,
            borderRadius: '50%',
          }}
        />
      );
    }

    if (a.type === 'line' || a.type === 'arrow') {
      return (
        <svg
          key={a.id}
          style={{
            ...baseStyle,
            width: a.width + a.lineWidth * 2,
            height: a.height + a.lineWidth * 2,
            overflow: 'visible',
          }}
        >
          <line
            x1={0} y1={0} x2={a.width} y2={a.height}
            stroke={a.color} strokeWidth={a.lineWidth}
            strokeLinecap="round" opacity={a.opacity}
          />
          {a.type === 'arrow' && (
            <polygon
              points={arrowHead(0, 0, a.width, a.height, 12)}
              fill={a.color} opacity={a.opacity}
            />
          )}
        </svg>
      );
    }

    if (a.type === 'highlight') {
      return (
        <div
          key={a.id}
          style={{
            ...baseStyle,
            width: a.width,
            height: a.height,
            background: a.color,
            opacity: a.opacity,
            borderRadius: 2,
            mixBlendMode: 'multiply',
          }}
        />
      );
    }

    if (a.type === 'whiteout') {
      return (
        <div
          key={a.id}
          style={{
            ...baseStyle,
            width: a.width,
            height: a.height,
            background: '#FFFFFF',
            borderRadius: 1,
          }}
        />
      );
    }

    if (a.type === 'image' || a.type === 'signature' || a.type === 'stamp') {
      return (
        <img
          key={a.id}
          src={a.dataUrl}
          alt={a.type}
          draggable={false}
          style={{
            ...baseStyle,
            width: a.width,
            height: a.height,
            opacity: a.opacity,
            objectFit: 'contain',
          }}
        />
      );
    }

    return null;
  }

  /* ══════════════════════════════════════════════════════════
     UI
     ══════════════════════════════════════════════════════════ */

  const currentPageData = pages[currentPage];
  const hasAnnotations = annotations.length > 0;

  // UPLOAD SCREEN
  if (!pdfBytes || pages.length === 0) {
    return (
      <div className="space-y-5">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={e => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file?.type === 'application/pdf') loadPdf(file);
          }}
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">
            Upload PDF to Edit
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Drop your PDF here or click to browse. Files never leave your device.
          </p>
          {loading && <p className="mt-3 text-indigo-600 dark:text-indigo-400 animate-pulse">Loading PDF...</p>}
          {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) loadPdf(f);
          }}
        />
      </div>
    );
  }

  // EDITOR SCREEN
  const toolBtn = (t: ToolType, icon: React.ReactNode, label: string, shortcut?: string) => (
    <button
      key={t}
      onClick={() => {
        if (t === 'image') { imgInputRef.current?.click(); return; }
        if (t === 'signature') { setShowSigPad(true); return; }
        if (t === 'stamp') { setShowStamps(!showStamps); return; }
        setTool(t);
        setEditingText(null);
      }}
      title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
      className={`p-2 rounded-lg transition-colors ${
        tool === t
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="space-y-3">
      {/* ── TOOLBAR ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Tool buttons */}
          {toolBtn('select', <MousePointer2 className="w-4 h-4" />, 'Select', 'V')}

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {toolBtn('text', <Type className="w-4 h-4" />, 'Add Text', 'T')}
          {toolBtn('draw', <Pen className="w-4 h-4" />, 'Draw', 'P')}

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {toolBtn('rect', <Square className="w-4 h-4" />, 'Rectangle', 'R')}
          {toolBtn('circle', <Circle className="w-4 h-4" />, 'Circle')}
          {toolBtn('line', <Minus className="w-4 h-4" />, 'Line')}
          {toolBtn('arrow', <ArrowUpRight className="w-4 h-4" />, 'Arrow')}

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {toolBtn('highlight', <Highlighter className="w-4 h-4" />, 'Highlight', 'H')}
          {toolBtn('whiteout', <Square className="w-4 h-4 fill-white stroke-slate-400" />, 'Whiteout')}
          {toolBtn('eraser', <Eraser className="w-4 h-4" />, 'Eraser')}

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {toolBtn('image', <ImageIcon className="w-4 h-4" />, 'Add Image')}
          {toolBtn('signature', <FileSignature className="w-4 h-4" />, 'Signature')}
          {toolBtn('stamp', <Stamp className="w-4 h-4" />, 'Stamp')}

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* Undo / Redo */}
          <button onClick={undo} disabled={undoStack.length === 0}
            title="Undo (Ctrl+Z)"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={redo} disabled={redoStack.length === 0}
            title="Redo (Ctrl+Y)"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
            <Redo2 className="w-4 h-4" />
          </button>

          {selected && (
            <>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-0.5" />
              <button onClick={duplicateSelected} title="Duplicate (Ctrl+D)"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
              <button onClick={deleteSelected} title="Delete"
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Zoom */}
          <button onClick={zoomOut} className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={zoomIn} className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={zoomFit} title="Fit to view"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── PROPERTIES BAR ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Color */}
          <div className="flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex gap-0.5">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    color === c ? 'border-indigo-500 scale-125' : 'border-slate-200 dark:border-slate-600'
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

          {/* Font size */}
          {(tool === 'text' || (selected && annotations.find(a => a.id === selected)?.type === 'text')) && (
            <>
              <select
                value={fontFamily}
                onChange={e => setFontFamily(e.target.value)}
                className="text-xs px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <input
                type="number"
                value={fontSize}
                min={8}
                max={120}
                onChange={e => setFontSize(Number(e.target.value) || 16)}
                className="w-14 text-xs px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              />
              <button onClick={() => setBold(!bold)}
                className={`p-1 rounded ${bold ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-slate-500'}`}>
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setItalic(!italic)}
                className={`p-1 rounded ${italic ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-slate-500'}`}>
                <Italic className="w-3.5 h-3.5" />
              </button>
              <div className="flex gap-0.5">
                {(['left', 'center', 'right'] as const).map(al => (
                  <button key={al} onClick={() => setTextAlign(al)}
                    className={`p-1 rounded ${textAlign === al ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-slate-500'}`}>
                    {al === 'left' ? <AlignLeft className="w-3.5 h-3.5" /> : al === 'center' ? <AlignCenter className="w-3.5 h-3.5" /> : <AlignRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
              <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
            </>
          )}

          {/* Line width */}
          {['draw', 'rect', 'circle', 'line', 'arrow'].includes(tool) && (
            <>
              <label className="text-xs text-slate-500 dark:text-slate-400">Width</label>
              <input
                type="range"
                min={1}
                max={10}
                value={lineWidth}
                onChange={e => setLineWidth(Number(e.target.value))}
                className="w-20 accent-indigo-600"
              />
              <span className="text-xs text-slate-500 w-4">{lineWidth}</span>
            </>
          )}

          {/* Fill toggle for shapes */}
          {['rect', 'circle'].includes(tool) && (
            <button onClick={() => setFillShape(!fillShape)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                fillShape
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}>
              {fillShape ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              Fill
            </button>
          )}

          {/* Opacity */}
          <label className="text-xs text-slate-500 dark:text-slate-400 ml-auto">Opacity</label>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.1}
            value={opacity}
            onChange={e => setOpacity(Number(e.target.value))}
            className="w-16 accent-indigo-600"
          />
        </div>
      </div>

      {/* ── CANVAS AREA ── */}
      <div className="bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-auto" style={{ maxHeight: '70vh' }}>
        {currentPageData && (
          <div className="flex justify-center p-4" style={{ minWidth: currentPageData.width * zoom + 32 }}>
            <div
              ref={overlayRef}
              className="relative shadow-xl"
              style={{
                width: currentPageData.width * zoom,
                height: currentPageData.height * zoom,
                cursor:
                  tool === 'select' ? 'default'
                  : tool === 'text' ? 'text'
                  : tool === 'draw' || tool === 'eraser' ? 'crosshair'
                  : 'crosshair',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                if (dragging) setDragging(null);
              }}
            >
              {/* PDF page background */}
              <img
                src={currentPageData.dataUrl}
                alt={`Page ${currentPage + 1}`}
                draggable={false}
                className="absolute inset-0 w-full h-full select-none"
                style={{ pointerEvents: 'none' }}
              />

              {/* Annotations overlay (scaled) */}
              <div
                className="absolute inset-0"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: currentPageData.width, height: currentPageData.height }}
              >
                {pageAnnotations.map(renderAnnotation)}
              </div>

              {/* Drawing canvas (for active freehand strokes & shape previews) */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                style={{
                  width: currentPageData.width * zoom,
                  height: currentPageData.height * zoom,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── PAGE NAV + ACTIONS ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Page nav */}
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Page {currentPage + 1} of {pages.length}
            </span>
            <button onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))} disabled={currentPage >= pages.length - 1}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPdfBytes(null);
                setPages([]);
                setAnnotations([]);
                setUndoStack([]);
                setRedoStack([]);
                setSelected(null);
                setCurrentPage(0);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> New PDF
            </button>
            <button
              onClick={savePdf}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              {saving ? 'Saving...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* ── PAGE THUMBNAILS ── */}
      {pages.length > 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {pages.map((pg, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all ${
                  i === currentPage
                    ? 'border-indigo-500 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                }`}
              >
                <img
                  src={pg.dataUrl}
                  alt={`Page ${i + 1}`}
                  className="w-16 h-auto object-contain"
                  draggable={false}
                />
                <div className="text-xs text-center py-0.5 text-slate-500 dark:text-slate-400">{i + 1}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg p-3">{error}</div>
      )}

      {/* ── HIDDEN INPUTS ── */}
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageAdd}
      />

      {/* ── SIGNATURE PAD MODAL ── */}
      {showSigPad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowSigPad(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Draw Your Signature</h3>
              <button onClick={() => setShowSigPad(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <canvas
              ref={sigCanvasRef}
              width={400}
              height={160}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg cursor-crosshair bg-white"
            />
            <div className="flex justify-between mt-3">
              <button
                onClick={() => {
                  const ctx = sigCanvasRef.current?.getContext('2d');
                  if (ctx && sigCanvasRef.current) {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);
                  }
                }}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Clear
              </button>
              <button
                onClick={addSignature}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Add Signature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STAMP PICKER ── */}
      {showStamps && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowStamps(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Choose Stamp</h3>
              <button onClick={() => setShowStamps(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {STAMPS.map(s => (
                <button
                  key={s}
                  onClick={() => addStamp(s)}
                  className="px-4 py-3 text-sm font-bold text-red-500 border-2 border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TRUST BADGE ── */}
      <div className="flex items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-500 py-2">
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
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return rgb(r, g, b);
}

function arrowHead(x1: number, y1: number, x2: number, y2: number, size: number) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const p1x = x2 - size * Math.cos(angle - 0.4);
  const p1y = y2 - size * Math.sin(angle - 0.4);
  const p2x = x2 - size * Math.cos(angle + 0.4);
  const p2y = y2 - size * Math.sin(angle + 0.4);
  return `${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}`;
}
