'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload, Download, ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight,
  Type, Pen, Square, Circle, Minus, Image as ImageIcon, Highlighter,
  Eraser, Undo2, Redo2, Trash2, MousePointer2, FileSignature,
  Stamp, ArrowUpRight, ShieldCheck, RotateCcw, Palette, Bold, Italic,
  AlignLeft, AlignCenter, AlignRight, Eye, EyeOff, Copy, X, Loader2,
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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
  height: number;
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

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';

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

function getAnnotBounds(a: Annotation): { x: number; y: number; w: number; h: number } {
  if (a.type === 'draw') {
    const pts = a.points;
    if (pts.length === 0) return { x: a.x, y: a.y, w: 0, h: 0 };
    const xs = pts.map(p => p.x);
    const ys = pts.map(p => p.y);
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  }
  const w = 'width' in a ? (a as any).width : 100;
  const h = 'height' in a ? (a as any).height : 30;
  return { x: a.x, y: a.y, w, h };
}

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
  const [customColor, setCustomColor] = useState('#3B82F6');
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

  /* ── Interaction state ── */
  const [zoom, setZoom] = useState(1);
  const [drawing, setDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState<Point[]>([]);
  const [shapeStart, setShapeStart] = useState<Point | null>(null);
  const [shapeEnd, setShapeEnd] = useState<Point | null>(null);
  const [dragging, setDragging] = useState<{ id: string; offX: number; offY: number } | null>(null);
  const [resizing, setResizing] = useState<{ id: string; handle: ResizeHandle; startBounds: { x: number; y: number; w: number; h: number }; startMouse: Point } | null>(null);
  const [editingText, setEditingText] = useState<string | null>(null);
  const dragUndoPushed = useRef(false);

  /* ── Signature pad ── */
  const [showSigPad, setShowSigPad] = useState(false);
  const [showStamps, setShowStamps] = useState(false);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const sigDrawing = useRef(false);

  /* ── Refs ── */
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const textEditRef = useRef<HTMLTextAreaElement>(null);

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
    setEditingText(null);
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
        const scale = 2; // render at 2x for sharpness
        const vp = p.getViewport({ scale });
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

  const pushUndo = useCallback((current?: Annotation[]) => {
    const snap = current ?? annotations;
    setUndoStack(prev => [...prev.slice(-50), snap]);
    setRedoStack([]);
  }, [annotations]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    setRedoStack(r => [...r, annotations]);
    setAnnotations(undoStack[undoStack.length - 1]);
    setUndoStack(u => u.slice(0, -1));
    setSelected(null);
  }, [undoStack, annotations]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    setUndoStack(u => [...u, annotations]);
    setAnnotations(redoStack[redoStack.length - 1]);
    setRedoStack(r => r.slice(0, -1));
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

  /* Apply current properties to selected annotation */
  const selectedAnn = annotations.find(a => a.id === selected);

  useEffect(() => {
    if (!selected || !selectedAnn) return;
    const patch: Record<string, unknown> = {};
    if (selectedAnn.color !== color && selectedAnn.type !== 'whiteout' && selectedAnn.type !== 'image' && selectedAnn.type !== 'signature' && selectedAnn.type !== 'stamp') {
      patch.color = color;
    }
    if (selectedAnn.opacity !== opacity) patch.opacity = opacity;
    if (selectedAnn.type === 'text') {
      const t = selectedAnn as TextAnnotation;
      if (t.fontSize !== fontSize) patch.fontSize = fontSize;
      if (t.fontFamily !== fontFamily) patch.fontFamily = fontFamily;
      if (t.bold !== bold) patch.bold = bold;
      if (t.italic !== italic) patch.italic = italic;
      if (t.align !== textAlign) patch.align = textAlign;
    }
    if ('lineWidth' in selectedAnn && (selectedAnn as any).lineWidth !== lineWidth) {
      patch.lineWidth = lineWidth;
    }
    if ('fill' in selectedAnn && (selectedAnn as any).fill !== fillShape) {
      patch.fill = fillShape;
    }
    if (Object.keys(patch).length > 0) {
      updateAnnotation(selected, patch as Partial<Annotation>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, opacity, fontSize, fontFamily, bold, italic, textAlign, lineWidth, fillShape]);

  /* Load selected annotation's properties into toolbar */
  useEffect(() => {
    if (!selectedAnn) return;
    if (selectedAnn.color && selectedAnn.type !== 'whiteout' && selectedAnn.type !== 'image') setColor(selectedAnn.color);
    if (selectedAnn.opacity) setOpacity(selectedAnn.opacity);
    if (selectedAnn.type === 'text') {
      const t = selectedAnn as TextAnnotation;
      setFontSize(t.fontSize);
      setFontFamily(t.fontFamily);
      setBold(t.bold);
      setItalic(t.italic);
      setTextAlign(t.align);
    }
    if ('lineWidth' in selectedAnn) setLineWidth((selectedAnn as any).lineWidth);
    if ('fill' in selectedAnn) setFillShape((selectedAnn as any).fill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const pageAnnotations = annotations.filter(a => a.page === currentPage);

  /* ══════════════════════════════════════════════════════════
     MOUSE / TOUCH EVENTS
     ══════════════════════════════════════════════════════════ */

  const getPos = useCallback((clientX: number, clientY: number): Point => {
    const rect = overlayRef.current!.getBoundingClientRect();
    return { x: (clientX - rect.left) / zoom, y: (clientY - rect.top) / zoom };
  }, [zoom]);

  const getPosFromEvent = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return getPos(touch.clientX, touch.clientY);
    }
    return getPos((e as React.MouseEvent).clientX, (e as React.MouseEvent).clientY);
  }, [getPos]);

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (editingText) return;
    const pos = getPosFromEvent(e);

    if (tool === 'select') {
      // Check resize handles first
      if (selected) {
        const selAnn = pageAnnotations.find(a => a.id === selected);
        if (selAnn && selAnn.type !== 'draw') {
          const b = getAnnotBounds(selAnn);
          const handleSize = 8 / zoom;
          const handles: { handle: ResizeHandle; hx: number; hy: number }[] = [
            { handle: 'nw', hx: b.x, hy: b.y },
            { handle: 'ne', hx: b.x + b.w, hy: b.y },
            { handle: 'sw', hx: b.x, hy: b.y + b.h },
            { handle: 'se', hx: b.x + b.w, hy: b.y + b.h },
            { handle: 'n', hx: b.x + b.w / 2, hy: b.y },
            { handle: 's', hx: b.x + b.w / 2, hy: b.y + b.h },
            { handle: 'e', hx: b.x + b.w, hy: b.y + b.h / 2 },
            { handle: 'w', hx: b.x, hy: b.y + b.h / 2 },
          ];
          for (const { handle, hx, hy } of handles) {
            if (Math.abs(pos.x - hx) < handleSize && Math.abs(pos.y - hy) < handleSize) {
              pushUndo();
              dragUndoPushed.current = true;
              setResizing({ id: selected, handle, startBounds: b, startMouse: pos });
              return;
            }
          }
        }
      }

      // Hit test annotations (reverse order = top first)
      const hit = [...pageAnnotations].reverse().find(a => {
        const b = getAnnotBounds(a);
        return pos.x >= b.x - 5 && pos.x <= b.x + b.w + 5 && pos.y >= b.y - 5 && pos.y <= b.y + b.h + 5;
      });
      if (hit) {
        setSelected(hit.id);
        pushUndo();
        dragUndoPushed.current = true;
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
        width: 200, height: 30,
      });
      setEditingText(id);
      setTimeout(() => textEditRef.current?.focus(), 50);
      return;
    }

    if (tool === 'draw' || tool === 'eraser') {
      setDrawing(true);
      setDrawPoints([pos]);
      return;
    }

    if (['rect', 'circle', 'line', 'arrow', 'highlight', 'whiteout'].includes(tool)) {
      setShapeStart(pos);
      setShapeEnd(pos);
      return;
    }
  }, [tool, pageAnnotations, selected, getPosFromEvent, addAnnotation, pushUndo, currentPage, color, opacity, fontSize, fontFamily, bold, italic, textAlign, editingText, zoom]);

  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPosFromEvent(e);

    if (resizing) {
      const { handle, startBounds, startMouse } = resizing;
      const dx = pos.x - startMouse.x;
      const dy = pos.y - startMouse.y;
      let { x, y, w, h } = startBounds;

      if (handle.includes('e')) w = Math.max(20, w + dx);
      if (handle.includes('w')) { x = x + dx; w = Math.max(20, w - dx); }
      if (handle.includes('s')) h = Math.max(20, h + dy);
      if (handle.includes('n')) { y = y + dy; h = Math.max(20, h - dy); }

      updateAnnotation(resizing.id, { x, y, width: w, height: h } as Partial<Annotation>);
      return;
    }

    if (dragging) {
      updateAnnotation(dragging.id, { x: pos.x - dragging.offX, y: pos.y - dragging.offY });
      return;
    }

    if (drawing) {
      setDrawPoints(prev => [...prev, pos]);
      return;
    }

    if (shapeStart) {
      setShapeEnd(pos);
      return;
    }
  }, [resizing, dragging, drawing, shapeStart, getPosFromEvent, updateAnnotation]);

  const handlePointerUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPosFromEvent(e);

    if (resizing) {
      setResizing(null);
      dragUndoPushed.current = false;
      return;
    }

    if (dragging) {
      setDragging(null);
      dragUndoPushed.current = false;
      return;
    }

    if (drawing && drawPoints.length > 1) {
      const finalPoints = [...drawPoints, pos];
      if (tool === 'eraser') {
        pushUndo();
        const toRemove = new Set<string>();
        for (const a of pageAnnotations) {
          const b = getAnnotBounds(a);
          for (const p of finalPoints) {
            if (p.x >= b.x - 15 && p.x <= b.x + b.w + 15 && p.y >= b.y - 15 && p.y <= b.y + b.h + 15) {
              toRemove.add(a.id);
              break;
            }
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

    if (shapeStart && shapeEnd) {
      const x1 = Math.min(shapeStart.x, pos.x);
      const y1 = Math.min(shapeStart.y, pos.y);
      const w = Math.abs(pos.x - shapeStart.x);
      const h = Math.abs(pos.y - shapeStart.y);

      if (w > 5 || h > 5) {
        if (tool === 'highlight') {
          addAnnotation({ id: newId(), page: currentPage, type: 'highlight', x: x1, y: y1, color: '#FBBF24', opacity: 0.35, width: w, height: h });
        } else if (tool === 'whiteout') {
          addAnnotation({ id: newId(), page: currentPage, type: 'whiteout', x: x1, y: y1, color: '#FFFFFF', opacity: 1, width: w, height: h });
        } else if (tool === 'line' || tool === 'arrow') {
          // Lines store start at (x,y), with width=dx, height=dy (can be negative for direction)
          addAnnotation({
            id: newId(), page: currentPage, type: tool,
            x: shapeStart.x, y: shapeStart.y, color, opacity,
            width: pos.x - shapeStart.x, height: pos.y - shapeStart.y, lineWidth, fill: false,
          });
        } else {
          addAnnotation({
            id: newId(), page: currentPage, type: tool as 'rect' | 'circle',
            x: x1, y: y1, color, opacity, width: w, height: h, lineWidth, fill: fillShape,
          });
        }
      }

      setShapeStart(null);
      setShapeEnd(null);
      return;
    }

    setDrawing(false);
    setDrawPoints([]);
    setShapeStart(null);
    setShapeEnd(null);
  }, [resizing, dragging, drawing, drawPoints, shapeStart, shapeEnd, tool, getPosFromEvent, addAnnotation, pushUndo, currentPage, color, opacity, lineWidth, fillShape, pageAnnotations]);

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
     SIGNATURE PAD (mouse + touch)
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

    const getXY = (e: MouseEvent | TouchEvent) => {
      const r = c.getBoundingClientRect();
      if ('touches' in e) {
        const t = e.touches[0] || e.changedTouches[0];
        return { x: t.clientX - r.left, y: t.clientY - r.top };
      }
      return { x: (e as MouseEvent).clientX - r.left, y: (e as MouseEvent).clientY - r.top };
    };
    const onDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      sigDrawing.current = true;
      ctx.beginPath();
      const { x, y } = getXY(e);
      ctx.moveTo(x, y);
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!sigDrawing.current) return;
      e.preventDefault();
      const { x, y } = getXY(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    const onUp = () => { sigDrawing.current = false; };

    c.addEventListener('mousedown', onDown);
    c.addEventListener('mousemove', onMove);
    c.addEventListener('mouseup', onUp);
    c.addEventListener('mouseleave', onUp);
    c.addEventListener('touchstart', onDown, { passive: false });
    c.addEventListener('touchmove', onMove, { passive: false });
    c.addEventListener('touchend', onUp);

    return () => {
      c.removeEventListener('mousedown', onDown);
      c.removeEventListener('mousemove', onMove);
      c.removeEventListener('mouseup', onUp);
      c.removeEventListener('mouseleave', onUp);
      c.removeEventListener('touchstart', onDown);
      c.removeEventListener('touchmove', onMove);
      c.removeEventListener('touchend', onUp);
    };
  }, [showSigPad]);

  const addSignature = useCallback(() => {
    if (!sigCanvasRef.current) return;
    addAnnotation({
      id: newId(), page: currentPage, type: 'signature',
      x: 50, y: 50, color: '', opacity: 1,
      dataUrl: sigCanvasRef.current.toDataURL('image/png'),
      width: 200, height: 80,
    });
    setShowSigPad(false);
  }, [addAnnotation, currentPage]);

  /* ══════════════════════════════════════════════════════════
     STAMP
     ══════════════════════════════════════════════════════════ */

  const addStamp = useCallback((text: string) => {
    const c = document.createElement('canvas');
    c.width = 240; c.height = 80;
    const ctx = c.getContext('2d')!;
    ctx.strokeStyle = '#EF4444'; ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 224, 64);
    ctx.font = 'bold 28px Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#EF4444'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, 120, 42);

    addAnnotation({
      id: newId(), page: currentPage, type: 'stamp',
      x: 100, y: 100, color: '', opacity: 0.8,
      dataUrl: c.toDataURL('image/png'), width: 240, height: 80,
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
      const fonts: Record<string, any> = {
        'Helvetica': await doc.embedFont(StandardFonts.Helvetica),
        'Helvetica-Bold': await doc.embedFont(StandardFonts.HelveticaBold),
        'Times-Roman': await doc.embedFont(StandardFonts.TimesRoman),
        'Times-Roman-Bold': await doc.embedFont(StandardFonts.TimesRomanBold),
        'Courier': await doc.embedFont(StandardFonts.Courier),
        'Courier-Bold': await doc.embedFont(StandardFonts.CourierBold),
      };

      const pdfPages = doc.getPages();

      for (let pi = 0; pi < pdfPages.length; pi++) {
        const page = pdfPages[pi];
        const pg = pages[pi];
        if (!pg) continue;
        const pAnns = annotations.filter(a => a.page === pi);
        const scaleX = pg.pdfWidth / pg.width;
        const scaleY = pg.pdfHeight / pg.height;
        const toPdfX = (cx: number) => cx * scaleX;
        const toPdfY = (cy: number) => pg.pdfHeight - cy * scaleY;

        for (const a of pAnns) {
          if (a.type === 'text' && a.text.trim()) {
            const t = a as TextAnnotation;
            const fontKey = `${t.fontFamily}${t.bold ? '-Bold' : ''}`;
            const font = fonts[fontKey] || fonts['Helvetica'];
            const pdfFontSize = t.fontSize * scaleX;
            t.text.split('\n').forEach((line, li) => {
              page.drawText(line, {
                x: toPdfX(t.x),
                y: toPdfY(t.y) - (li + 1) * pdfFontSize * 1.2,
                size: pdfFontSize,
                font,
                color: hexToRgb(t.color),
                opacity: t.opacity,
              });
            });
          }

          if (a.type === 'draw') {
            const pts = (a as DrawAnnotation).points;
            for (let i = 0; i < pts.length - 1; i++) {
              page.drawLine({
                start: { x: toPdfX(pts[i].x), y: toPdfY(pts[i].y) },
                end: { x: toPdfX(pts[i + 1].x), y: toPdfY(pts[i + 1].y) },
                thickness: (a as DrawAnnotation).lineWidth * scaleX,
                color: hexToRgb(a.color),
                opacity: a.opacity,
              });
            }
          }

          if (a.type === 'rect') {
            const s = a as ShapeAnnotation;
            page.drawRectangle({
              x: toPdfX(s.x), y: toPdfY(s.y + s.height),
              width: s.width * scaleX, height: s.height * scaleY,
              borderColor: hexToRgb(s.color), borderWidth: s.lineWidth * scaleX,
              color: s.fill ? hexToRgb(s.color) : undefined,
              opacity: s.fill ? s.opacity * 0.3 : s.opacity,
              borderOpacity: s.opacity,
            });
          }

          if (a.type === 'circle') {
            const s = a as ShapeAnnotation;
            const rx = (s.width / 2) * scaleX;
            const ry = (s.height / 2) * scaleY;
            page.drawEllipse({
              x: toPdfX(s.x) + rx, y: toPdfY(s.y) - ry,
              xScale: rx, yScale: ry,
              borderColor: hexToRgb(s.color), borderWidth: s.lineWidth * scaleX,
              color: s.fill ? hexToRgb(s.color) : undefined,
              opacity: s.fill ? s.opacity * 0.3 : s.opacity,
              borderOpacity: s.opacity,
            });
          }

          if (a.type === 'line' || a.type === 'arrow') {
            const s = a as ShapeAnnotation;
            const sx = toPdfX(s.x);
            const sy = toPdfY(s.y);
            const ex = toPdfX(s.x + s.width);
            const ey = toPdfY(s.y + s.height);
            page.drawLine({
              start: { x: sx, y: sy }, end: { x: ex, y: ey },
              thickness: s.lineWidth * scaleX, color: hexToRgb(s.color), opacity: s.opacity,
            });
            if (a.type === 'arrow') {
              const angle = Math.atan2(sy - ey, ex - sx);
              const hl = 12 * scaleX;
              page.drawLine({ start: { x: ex, y: ey }, end: { x: ex - hl * Math.cos(angle - 0.4), y: ey + hl * Math.sin(angle - 0.4) }, thickness: s.lineWidth * scaleX, color: hexToRgb(s.color), opacity: s.opacity });
              page.drawLine({ start: { x: ex, y: ey }, end: { x: ex - hl * Math.cos(angle + 0.4), y: ey + hl * Math.sin(angle + 0.4) }, thickness: s.lineWidth * scaleX, color: hexToRgb(s.color), opacity: s.opacity });
            }
          }

          if (a.type === 'highlight') {
            const h = a as HighlightAnnotation;
            page.drawRectangle({
              x: toPdfX(h.x), y: toPdfY(h.y + h.height),
              width: h.width * scaleX, height: h.height * scaleY,
              color: hexToRgb(h.color), opacity: h.opacity,
            });
          }

          if (a.type === 'whiteout') {
            const w = a as WhiteoutAnnotation;
            page.drawRectangle({
              x: toPdfX(w.x), y: toPdfY(w.y + w.height),
              width: w.width * scaleX, height: w.height * scaleY,
              color: rgb(1, 1, 1), opacity: 1,
            });
          }

          if (a.type === 'image' || a.type === 'signature' || a.type === 'stamp') {
            const im = a as ImageAnnotation;
            try {
              const imgBytes = await fetch(im.dataUrl).then(r => r.arrayBuffer());
              const img = im.dataUrl.includes('image/png')
                ? await doc.embedPng(imgBytes)
                : await doc.embedJpg(imgBytes);
              page.drawImage(img, {
                x: toPdfX(im.x), y: toPdfY(im.y + im.height),
                width: im.width * scaleX, height: im.height * scaleY,
                opacity: im.opacity,
              });
            } catch { /* skip */ }
          }
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
  }, [pdfBytes, pages, annotations, pdfName]);

  /* ══════════════════════════════════════════════════════════
     KEYBOARD SHORTCUTS
     ══════════════════════════════════════════════════════════ */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editingText) {
        if (e.key === 'Escape') setEditingText(null);
        return;
      }
      if (e.key === 'Delete' || (e.key === 'Backspace' && !editingText)) { if (selected) { e.preventDefault(); deleteSelected(); } }
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
      if (e.ctrlKey && e.key === 'd') { e.preventDefault(); duplicateSelected(); }
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); savePdf(); }
      if (e.key === 'Escape') { setSelected(null); }
      if (!e.ctrlKey && !e.altKey) {
        if (e.key === 'v') setTool('select');
        if (e.key === 't') setTool('text');
        if (e.key === 'p') setTool('draw');
        if (e.key === 'r') setTool('rect');
        if (e.key === 'h') setTool('highlight');
        if (e.key === 'e') setTool('eraser');
      }
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
     RENDER ANNOTATIONS
     ══════════════════════════════════════════════════════════ */

  const resizeHandleCursors: Record<ResizeHandle, string> = {
    nw: 'nwse-resize', ne: 'nesw-resize', sw: 'nesw-resize', se: 'nwse-resize',
    n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize',
  };

  function renderResizeHandles(a: Annotation) {
    if (a.id !== selected || a.type === 'draw') return null;
    const b = getAnnotBounds(a);
    const hs = 7;
    const positions: { handle: ResizeHandle; x: number; y: number }[] = [
      { handle: 'nw', x: b.x - hs / 2, y: b.y - hs / 2 },
      { handle: 'ne', x: b.x + b.w - hs / 2, y: b.y - hs / 2 },
      { handle: 'sw', x: b.x - hs / 2, y: b.y + b.h - hs / 2 },
      { handle: 'se', x: b.x + b.w - hs / 2, y: b.y + b.h - hs / 2 },
      { handle: 'n', x: b.x + b.w / 2 - hs / 2, y: b.y - hs / 2 },
      { handle: 's', x: b.x + b.w / 2 - hs / 2, y: b.y + b.h - hs / 2 },
      { handle: 'e', x: b.x + b.w - hs / 2, y: b.y + b.h / 2 - hs / 2 },
      { handle: 'w', x: b.x - hs / 2, y: b.y + b.h / 2 - hs / 2 },
    ];
    return positions.map(({ handle, x, y }) => (
      <div
        key={handle}
        className="absolute bg-white border-2 border-indigo-500 rounded-sm"
        style={{
          left: x, top: y, width: hs, height: hs,
          cursor: resizeHandleCursors[handle],
          pointerEvents: 'auto',
          zIndex: 999,
        }}
      />
    ));
  }

  function renderAnnotation(a: Annotation) {
    const isSelected = a.id === selected;
    const isInteractive = tool === 'select' || tool === 'eraser';
    const base: React.CSSProperties = {
      position: 'absolute',
      left: a.x,
      top: a.y,
      pointerEvents: isInteractive ? 'auto' : 'none',
      cursor: isInteractive ? 'move' : 'default',
    };

    const selectionBorder = isSelected ? '2px solid #6366F1' : 'none';

    if (a.type === 'text') {
      const t = a as TextAnnotation;
      const isEditing = editingText === a.id;
      return (
        <div key={a.id} style={{ ...base, zIndex: isEditing ? 100 : 10 }}>
          <div
            style={{
              width: t.width, minHeight: 24,
              color: t.color, fontSize: t.fontSize,
              fontFamily: t.fontFamily === 'Courier' ? 'monospace' : t.fontFamily === 'Times-Roman' ? 'serif' : 'sans-serif',
              fontWeight: t.bold ? 700 : 400,
              fontStyle: t.italic ? 'italic' : 'normal',
              textAlign: t.align, opacity: t.opacity,
              lineHeight: 1.3, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              padding: '2px 4px',
              outline: isEditing ? '2px solid #6366F1' : selectionBorder,
              outlineOffset: 2,
              background: isEditing ? 'rgba(99,102,241,0.04)' : 'transparent',
              borderRadius: 2,
            }}
            onDoubleClick={e => { e.stopPropagation(); setSelected(a.id); setEditingText(a.id); }}
          >
            {isEditing ? (
              <textarea
                ref={textEditRef}
                defaultValue={t.text}
                autoFocus
                className="w-full bg-transparent border-none outline-none resize-none p-0 m-0"
                style={{
                  color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit',
                  fontWeight: 'inherit', fontStyle: 'inherit', textAlign: 'inherit',
                  lineHeight: 'inherit', minHeight: 24,
                }}
                onBlur={e => {
                  updateAnnotation(a.id, { text: e.target.value });
                  setEditingText(null);
                }}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    updateAnnotation(a.id, { text: (e.target as HTMLTextAreaElement).value });
                    setEditingText(null);
                  }
                  e.stopPropagation();
                }}
                onMouseDown={e => e.stopPropagation()}
                onTouchStart={e => e.stopPropagation()}
              />
            ) : (
              <span>{t.text || 'Double-click to type...'}</span>
            )}
          </div>
          {renderResizeHandles(a)}
        </div>
      );
    }

    if (a.type === 'draw') {
      const d = a as DrawAnnotation;
      if (d.points.length < 2) return null;
      const xs = d.points.map(p => p.x);
      const ys = d.points.map(p => p.y);
      const minX = Math.min(...xs) - d.lineWidth;
      const minY = Math.min(...ys) - d.lineWidth;
      const maxX = Math.max(...xs) + d.lineWidth;
      const maxY = Math.max(...ys) + d.lineWidth;
      const pathD = d.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x - minX + d.lineWidth},${p.y - minY + d.lineWidth}`).join(' ');

      return (
        <svg
          key={a.id}
          style={{
            ...base,
            left: minX, top: minY,
            width: maxX - minX + d.lineWidth, height: maxY - minY + d.lineWidth,
            outline: isSelected ? '2px solid #6366F1' : 'none',
            outlineOffset: 4,
          }}
        >
          <path d={pathD} fill="none" stroke={d.color} strokeWidth={d.lineWidth}
            strokeLinecap="round" strokeLinejoin="round" opacity={d.opacity} />
        </svg>
      );
    }

    if (a.type === 'rect') {
      const s = a as ShapeAnnotation;
      return (
        <div key={a.id} style={base}>
          <div style={{
            width: s.width, height: s.height,
            border: `${s.lineWidth}px solid ${s.color}`,
            background: s.fill ? s.color + '4D' : 'transparent',
            opacity: s.opacity, borderRadius: 2,
            outline: selectionBorder, outlineOffset: 2,
          }} />
          {renderResizeHandles(a)}
        </div>
      );
    }

    if (a.type === 'circle') {
      const s = a as ShapeAnnotation;
      return (
        <div key={a.id} style={base}>
          <div style={{
            width: s.width, height: s.height,
            border: `${s.lineWidth}px solid ${s.color}`,
            background: s.fill ? s.color + '4D' : 'transparent',
            opacity: s.opacity, borderRadius: '50%',
            outline: selectionBorder, outlineOffset: 2,
          }} />
          {renderResizeHandles(a)}
        </div>
      );
    }

    if (a.type === 'line' || a.type === 'arrow') {
      const s = a as ShapeAnnotation;
      const len = Math.sqrt(s.width ** 2 + s.height ** 2);
      return (
        <svg key={a.id} style={{
          ...base,
          width: Math.abs(s.width) + s.lineWidth * 4,
          height: Math.abs(s.height) + s.lineWidth * 4,
          overflow: 'visible',
          outline: isSelected ? '2px solid #6366F1' : 'none',
          outlineOffset: 4,
        }}>
          <line x1={s.lineWidth * 2} y1={s.lineWidth * 2}
            x2={s.width + s.lineWidth * 2} y2={s.height + s.lineWidth * 2}
            stroke={s.color} strokeWidth={s.lineWidth} strokeLinecap="round" opacity={s.opacity} />
          {a.type === 'arrow' && len > 10 && (
            <polygon
              points={arrowHead(s.lineWidth * 2, s.lineWidth * 2, s.width + s.lineWidth * 2, s.height + s.lineWidth * 2, 12)}
              fill={s.color} opacity={s.opacity} />
          )}
        </svg>
      );
    }

    if (a.type === 'highlight') {
      const h = a as HighlightAnnotation;
      return (
        <div key={a.id} style={base}>
          <div style={{
            width: h.width, height: h.height,
            background: h.color, opacity: h.opacity,
            borderRadius: 2, mixBlendMode: 'multiply' as const,
            outline: selectionBorder, outlineOffset: 2,
          }} />
          {renderResizeHandles(a)}
        </div>
      );
    }

    if (a.type === 'whiteout') {
      const w = a as WhiteoutAnnotation;
      return (
        <div key={a.id} style={base}>
          <div style={{
            width: w.width, height: w.height, background: '#FFFFFF',
            outline: selectionBorder, outlineOffset: 2,
          }} />
          {renderResizeHandles(a)}
        </div>
      );
    }

    if (a.type === 'image' || a.type === 'signature' || a.type === 'stamp') {
      const im = a as ImageAnnotation;
      return (
        <div key={a.id} style={base}>
          <img src={im.dataUrl} alt={a.type} draggable={false}
            style={{
              width: im.width, height: im.height, opacity: im.opacity,
              objectFit: 'contain', outline: selectionBorder, outlineOffset: 2,
            }} />
          {renderResizeHandles(a)}
        </div>
      );
    }

    return null;
  }

  /* ══════════════════════════════════════════════════════════
     RENDER LIVE PREVIEW (shapes + freehand while drawing)
     ══════════════════════════════════════════════════════════ */

  function renderLivePreview() {
    // Freehand preview
    if (drawing && drawPoints.length > 1) {
      const lw = tool === 'eraser' ? 20 : lineWidth;
      const c = tool === 'eraser' ? '#EF4444' : color;
      const o = tool === 'eraser' ? 0.3 : opacity;
      const d = drawPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
      return (
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          <path d={d} fill="none" stroke={c} strokeWidth={lw} strokeLinecap="round" strokeLinejoin="round" opacity={o} />
        </svg>
      );
    }

    // Shape preview
    if (shapeStart && shapeEnd) {
      const dx = shapeEnd.x - shapeStart.x;
      const dy = shapeEnd.y - shapeStart.y;
      const x1 = Math.min(shapeStart.x, shapeEnd.x);
      const y1 = Math.min(shapeStart.y, shapeEnd.y);
      const w = Math.abs(dx);
      const h = Math.abs(dy);
      const previewColor = tool === 'highlight' ? '#FBBF24' : tool === 'whiteout' ? '#94A3B8' : color;

      return (
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          {(tool === 'rect' || tool === 'highlight' || tool === 'whiteout') && (
            <rect x={x1} y={y1} width={w} height={h}
              fill="none" stroke={previewColor} strokeWidth={2} strokeDasharray="6 4" opacity={0.6} />
          )}
          {tool === 'circle' && (
            <ellipse cx={x1 + w / 2} cy={y1 + h / 2} rx={w / 2} ry={h / 2}
              fill="none" stroke={previewColor} strokeWidth={2} strokeDasharray="6 4" opacity={0.6} />
          )}
          {(tool === 'line' || tool === 'arrow') && (
            <>
              <line x1={shapeStart.x} y1={shapeStart.y} x2={shapeEnd.x} y2={shapeEnd.y}
                stroke={previewColor} strokeWidth={2} strokeDasharray="6 4" opacity={0.6} />
              {tool === 'arrow' && Math.sqrt(dx * dx + dy * dy) > 15 && (
                <polygon points={arrowHead(shapeStart.x, shapeStart.y, shapeEnd.x, shapeEnd.y, 12)}
                  fill={previewColor} opacity={0.6} />
              )}
            </>
          )}
        </svg>
      );
    }

    return null;
  }

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
      className={`p-2 rounded-lg transition-all ${
        tool === t
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
    </button>
  );

  const divider = <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-0.5 flex-shrink-0" />;

  return (
    <div className="space-y-2">
      {/* ── TOOLBAR ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-1.5 sm:p-2">
        <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
          {toolBtn('select', <MousePointer2 className="w-4 h-4" />, 'Select & Move', 'V')}
          {divider}
          {toolBtn('text', <Type className="w-4 h-4" />, 'Add Text', 'T')}
          {toolBtn('draw', <Pen className="w-4 h-4" />, 'Pen Draw', 'P')}
          {divider}
          {toolBtn('rect', <Square className="w-4 h-4" />, 'Rectangle', 'R')}
          {toolBtn('circle', <Circle className="w-4 h-4" />, 'Circle')}
          {toolBtn('line', <Minus className="w-4 h-4" />, 'Line')}
          {toolBtn('arrow', <ArrowUpRight className="w-4 h-4" />, 'Arrow')}
          {divider}
          {toolBtn('highlight', <Highlighter className="w-4 h-4" />, 'Highlight', 'H')}
          {toolBtn('whiteout', <Square className="w-4 h-4 fill-white stroke-slate-400" />, 'Whiteout / Redact')}
          {toolBtn('eraser', <Eraser className="w-4 h-4" />, 'Eraser', 'E')}
          {divider}
          {toolBtn('image', <ImageIcon className="w-4 h-4" />, 'Add Image')}
          {toolBtn('signature', <FileSignature className="w-4 h-4" />, 'Signature')}
          {toolBtn('stamp', <Stamp className="w-4 h-4" />, 'Stamp')}
          {divider}

          <button onClick={undo} disabled={undoStack.length === 0} title="Undo (Ctrl+Z)"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={redo} disabled={redoStack.length === 0} title="Redo (Ctrl+Y)"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors">
            <Redo2 className="w-4 h-4" />
          </button>

          {selected && (
            <>
              {divider}
              <button onClick={duplicateSelected} title="Duplicate (Ctrl+D)"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
              <button onClick={deleteSelected} title="Delete (Del)"
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="flex-1" />

          <button onClick={zoomOut} className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 min-w-[3rem] text-center select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={zoomIn} className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={zoomFit} title="Reset zoom"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── PROPERTIES BAR ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Color palette */}
          <Palette className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <div className="flex gap-0.5 flex-wrap">
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  color === c ? 'border-indigo-500 scale-125 shadow-sm' : 'border-slate-200 dark:border-slate-600 hover:scale-110'
                }`}
                style={{ background: c }} />
            ))}
            {/* Custom color input */}
            <div className="relative w-5 h-5">
              <input type="color" value={customColor}
                onChange={e => { setCustomColor(e.target.value); setColor(e.target.value); }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-600"
                style={{ background: `conic-gradient(red, yellow, lime, aqua, blue, magenta, red)` }} />
            </div>
          </div>

          {divider}

          {/* Text properties */}
          {(tool === 'text' || selectedAnn?.type === 'text') && (
            <>
              <select value={fontFamily} onChange={e => setFontFamily(e.target.value)}
                className="text-xs px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <input type="number" value={fontSize} min={8} max={120}
                onChange={e => setFontSize(Number(e.target.value) || 16)}
                className="w-14 text-xs px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300" />
              <button onClick={() => setBold(!bold)}
                className={`p-1 rounded ${bold ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setItalic(!italic)}
                className={`p-1 rounded ${italic ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <Italic className="w-3.5 h-3.5" />
              </button>
              <div className="flex gap-0.5">
                {(['left', 'center', 'right'] as const).map(al => (
                  <button key={al} onClick={() => setTextAlign(al)}
                    className={`p-1 rounded ${textAlign === al ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                    {al === 'left' ? <AlignLeft className="w-3.5 h-3.5" /> : al === 'center' ? <AlignCenter className="w-3.5 h-3.5" /> : <AlignRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
              {divider}
            </>
          )}

          {/* Line width */}
          {['draw', 'rect', 'circle', 'line', 'arrow'].includes(tool) && (
            <>
              <label className="text-xs text-slate-500 dark:text-slate-400">Width</label>
              <input type="range" min={1} max={10} value={lineWidth}
                onChange={e => setLineWidth(Number(e.target.value))}
                className="w-20 accent-indigo-600" />
              <span className="text-xs text-slate-500 w-4">{lineWidth}</span>
            </>
          )}

          {/* Fill toggle */}
          {['rect', 'circle'].includes(tool) && (
            <button onClick={() => setFillShape(!fillShape)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                fillShape
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}>
              {fillShape ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Fill
            </button>
          )}

          {/* Opacity */}
          <label className="text-xs text-slate-500 dark:text-slate-400 ml-auto">Opacity</label>
          <input type="range" min={0.1} max={1} step={0.1} value={opacity}
            onChange={e => setOpacity(Number(e.target.value))}
            className="w-16 accent-indigo-600" />
        </div>
      </div>

      {/* ── CANVAS AREA ── */}
      <div className="bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-auto" style={{ maxHeight: '70vh' }}>
        {currentPageData && (
          <div className="flex justify-center p-4" style={{ minWidth: currentPageData.width * zoom + 32 }}>
            <div
              ref={overlayRef}
              className="relative shadow-xl bg-white"
              style={{
                width: currentPageData.width * zoom,
                height: currentPageData.height * zoom,
                cursor:
                  tool === 'select' ? (dragging || resizing ? 'grabbing' : 'default')
                  : tool === 'text' ? 'text'
                  : 'crosshair',
              }}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={() => { if (dragging) setDragging(null); if (resizing) setResizing(null); }}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            >
              {/* PDF page */}
              <img src={currentPageData.dataUrl} alt={`Page ${currentPage + 1}`}
                draggable={false} className="absolute inset-0 w-full h-full select-none"
                style={{ pointerEvents: 'none' }} />

              {/* Annotation layer (scaled) */}
              <div className="absolute inset-0" style={{
                transform: `scale(${zoom})`, transformOrigin: 'top left',
                width: currentPageData.width, height: currentPageData.height,
              }}>
                {pageAnnotations.map(renderAnnotation)}
                {renderLivePreview()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── PAGE NAV + ACTIONS ── */}
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
            <span className="text-xs text-slate-400 hidden sm:inline">
              {annotations.length} annotation{annotations.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => {
              setPdfBytes(null); setPages([]); setAnnotations([]); setUndoStack([]);
              setRedoStack([]); setSelected(null); setCurrentPage(0); setEditingText(null);
            }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <RotateCcw className="w-4 h-4" /> New
            </button>
            <button onClick={savePdf} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* ── PAGE THUMBNAILS ── */}
      {pages.length > 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2.5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {pages.map((pg, i) => {
              const pageAnns = annotations.filter(a => a.page === i).length;
              return (
                <button key={i} onClick={() => setCurrentPage(i)}
                  className={`flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all ${
                    i === currentPage
                      ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                  }`}>
                  <img src={pg.dataUrl} alt={`Page ${i + 1}`} className="w-16 h-auto object-contain" draggable={false} />
                  <div className="text-[10px] text-center py-0.5 text-slate-500 dark:text-slate-400">
                    {i + 1}{pageAnns > 0 && <span className="text-indigo-500 ml-0.5">({pageAnns})</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg p-3">{error}</div>}

      {/* ── HIDDEN INPUTS ── */}
      <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageAdd} />

      {/* ── SIGNATURE PAD MODAL ── */}
      {showSigPad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowSigPad(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Draw Your Signature</h3>
              <button onClick={() => setShowSigPad(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Draw below with your mouse or finger</p>
            <canvas ref={sigCanvasRef} width={400} height={160}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg cursor-crosshair bg-white touch-none" />
            <div className="flex justify-between mt-3">
              <button onClick={() => {
                const ctx = sigCanvasRef.current?.getContext('2d');
                if (ctx && sigCanvasRef.current) { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height); }
              }}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                Clear
              </button>
              <button onClick={addSignature}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">
                Add Signature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STAMP PICKER ── */}
      {showStamps && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowStamps(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Choose Stamp</h3>
              <button onClick={() => setShowStamps(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {STAMPS.map(s => (
                <button key={s} onClick={() => addStamp(s)}
                  className="px-4 py-3 text-sm font-bold text-red-500 border-2 border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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

function arrowHead(x1: number, y1: number, x2: number, y2: number, size: number) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  return `${x2},${y2} ${x2 - size * Math.cos(angle - 0.4)},${y2 - size * Math.sin(angle - 0.4)} ${x2 - size * Math.cos(angle + 0.4)},${y2 - size * Math.sin(angle + 0.4)}`;
}
