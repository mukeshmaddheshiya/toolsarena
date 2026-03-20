'use client';

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
} from 'react';
import {
  Image,
  Download,
  Upload,
  Type,
  Square,
  Circle,
  Minus,
  Trash2,
  Layers,
  RefreshCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Plus,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type BgType = 'solid' | 'linear' | 'radial' | 'image';
type GradDir = 'to right' | 'to bottom' | 'to bottom right' | 'to bottom left';
type ShapeType = 'rect' | 'circle' | 'line';
type TextAlign = 'left' | 'center' | 'right';
type GoogleFont =
  | 'Roboto'
  | 'Poppins'
  | 'Montserrat'
  | 'Playfair Display'
  | 'Raleway'
  | 'Oswald'
  | 'Lato'
  | 'Nunito'
  | 'Merriweather'
  | 'Ubuntu';

interface TextElement {
  id: string;
  text: string;
  font: GoogleFont;
  size: number;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: TextAlign;
  letterSpacing: number;
  x: number; // normalised 0-1
  y: number;
}

interface ShapeElement {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  borderColor: string;
  borderWidth: number;
  opacity: number;
}

interface ImageElement {
  id: string;
  src: string;
  x: number;
  y: number;
  scale: number;
  img: HTMLImageElement;
}

interface CanvasState {
  bgType: BgType;
  bgColor: string;
  gradColor1: string;
  gradColor2: string;
  gradDir: GradDir;
  bgImageSrc: string | null;
  bgImageEl: HTMLImageElement | null;
  textElements: TextElement[];
  shapeElements: ShapeElement[];
  imageElements: ImageElement[];
}

interface CanvasPreset {
  label: string;
  group: string;
  w: number;
  h: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESETS: CanvasPreset[] = [
  { label: 'Facebook Cover', group: 'Facebook', w: 820, h: 312 },
  { label: 'Facebook Post', group: 'Facebook', w: 1200, h: 630 },
  { label: 'Instagram Post', group: 'Instagram', w: 1080, h: 1080 },
  { label: 'Instagram Story', group: 'Instagram', w: 1080, h: 1920 },
  { label: 'LinkedIn Banner', group: 'LinkedIn', w: 1584, h: 396 },
  { label: 'LinkedIn Post', group: 'LinkedIn', w: 1200, h: 627 },
  { label: 'Twitter/X Header', group: 'Twitter/X', w: 1500, h: 500 },
  { label: 'Twitter/X Post', group: 'Twitter/X', w: 1200, h: 675 },
  { label: 'YouTube Channel Art', group: 'YouTube', w: 2560, h: 1440 },
  { label: 'WhatsApp Status', group: 'WhatsApp', w: 1080, h: 1920 },
  { label: 'Business Flyer A4', group: 'Print', w: 794, h: 1123 },
  { label: 'Business Flyer A5', group: 'Print', w: 595, h: 842 },
  { label: 'Event Banner', group: 'Print', w: 1920, h: 600 },
  { label: 'Custom', group: 'Custom', w: 800, h: 600 },
];

const FONTS: GoogleFont[] = [
  'Roboto', 'Poppins', 'Montserrat', 'Playfair Display', 'Raleway',
  'Oswald', 'Lato', 'Nunito', 'Merriweather', 'Ubuntu',
];

const GRAD_DIRS: GradDir[] = ['to right', 'to bottom', 'to bottom right', 'to bottom left'];

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Poppins:wght@400;700&family=Montserrat:wght@400;700&family=Playfair+Display:wght@400;700&family=Raleway:wght@400;700&family=Oswald:wght@400;700&family=Lato:wght@400;700&family=Nunito:wght@400;700&family=Merriweather:wght@400;700&family=Ubuntu:wght@400;700&display=swap';

interface Template {
  name: string;
  bgType: BgType;
  bgColor?: string;
  gradColor1?: string;
  gradColor2?: string;
  gradDir?: GradDir;
  texts: Array<Partial<TextElement> & { text: string }>;
}

const TEMPLATES: Template[] = [
  {
    name: 'Birthday',
    bgType: 'linear',
    gradColor1: '#f59e0b',
    gradColor2: '#ec4899',
    gradDir: 'to bottom right',
    texts: [
      { text: 'Happy Birthday!', font: 'Playfair Display', size: 72, color: '#ffffff', bold: true, x: 0.5, y: 0.35, align: 'center' },
      { text: 'Wishing you a wonderful day', font: 'Poppins', size: 32, color: '#fde8f5', x: 0.5, y: 0.6, align: 'center' },
    ],
  },
  {
    name: 'Business',
    bgType: 'linear',
    gradColor1: '#0f172a',
    gradColor2: '#1e3a5f',
    gradDir: 'to bottom right',
    texts: [
      { text: 'YOUR COMPANY NAME', font: 'Montserrat', size: 60, color: '#ffffff', bold: true, x: 0.5, y: 0.35, align: 'center', letterSpacing: 4 },
      { text: 'Professional • Reliable • Trusted', font: 'Raleway', size: 28, color: '#94a3b8', x: 0.5, y: 0.6, align: 'center' },
    ],
  },
  {
    name: 'Sale / Offer',
    bgType: 'linear',
    gradColor1: '#dc2626',
    gradColor2: '#f97316',
    gradDir: 'to right',
    texts: [
      { text: '50% OFF', font: 'Oswald', size: 96, color: '#ffffff', bold: true, x: 0.5, y: 0.3, align: 'center' },
      { text: 'Limited Time Offer — Shop Now!', font: 'Poppins', size: 32, color: '#fef3c7', x: 0.5, y: 0.6, align: 'center' },
    ],
  },
  {
    name: 'Event',
    bgType: 'linear',
    gradColor1: '#1e1b4b',
    gradColor2: '#4c1d95',
    gradDir: 'to bottom',
    texts: [
      { text: 'JOIN US FOR AN EVENT', font: 'Poppins', size: 52, color: '#c4b5fd', bold: true, x: 0.5, y: 0.3, align: 'center' },
      { text: 'Saturday, April 5 · 7:00 PM', font: 'Roboto', size: 30, color: '#e9d5ff', x: 0.5, y: 0.55, align: 'center' },
      { text: 'City Convention Center', font: 'Raleway', size: 24, color: '#a78bfa', x: 0.5, y: 0.7, align: 'center' },
    ],
  },
  {
    name: 'Announcement',
    bgType: 'solid',
    bgColor: '#f8fafc',
    texts: [
      { text: 'IMPORTANT ANNOUNCEMENT', font: 'Montserrat', size: 48, color: '#0f172a', bold: true, x: 0.5, y: 0.3, align: 'center', letterSpacing: 2 },
      { text: 'We have exciting news to share with you!', font: 'Lato', size: 28, color: '#475569', x: 0.5, y: 0.58, align: 'center' },
    ],
  },
  {
    name: 'Motivational',
    bgType: 'linear',
    gradColor1: '#064e3b',
    gradColor2: '#065f46',
    gradDir: 'to bottom',
    texts: [
      { text: '"Dream Big,', font: 'Playfair Display', size: 64, color: '#6ee7b7', italic: true, x: 0.5, y: 0.3, align: 'center' },
      { text: 'Work Hard."', font: 'Playfair Display', size: 64, color: '#6ee7b7', italic: true, x: 0.5, y: 0.52, align: 'center' },
      { text: '— Stay Focused', font: 'Raleway', size: 24, color: '#a7f3d0', x: 0.5, y: 0.72, align: 'center' },
    ],
  },
  {
    name: 'Product Launch',
    bgType: 'linear',
    gradColor1: '#0ea5e9',
    gradColor2: '#6366f1',
    gradDir: 'to bottom right',
    texts: [
      { text: 'INTRODUCING', font: 'Oswald', size: 36, color: '#bae6fd', x: 0.5, y: 0.22, align: 'center', letterSpacing: 6 },
      { text: 'Product Name', font: 'Poppins', size: 80, color: '#ffffff', bold: true, x: 0.5, y: 0.45, align: 'center' },
      { text: 'Available Now — Learn More', font: 'Roboto', size: 28, color: '#e0f2fe', x: 0.5, y: 0.7, align: 'center' },
    ],
  },
  {
    name: 'Holiday Greeting',
    bgType: 'linear',
    gradColor1: '#14532d',
    gradColor2: '#991b1b',
    gradDir: 'to bottom right',
    texts: [
      { text: 'Season\'s Greetings', font: 'Playfair Display', size: 64, color: '#fbbf24', italic: true, x: 0.5, y: 0.35, align: 'center' },
      { text: 'Wishing you joy and peace', font: 'Nunito', size: 30, color: '#fef9ee', x: 0.5, y: 0.6, align: 'center' },
    ],
  },
];

// ─── Default state ────────────────────────────────────────────────────────────

function defaultState(): CanvasState {
  return {
    bgType: 'linear',
    bgColor: '#1e293b',
    gradColor1: '#6366f1',
    gradColor2: '#0ea5e9',
    gradDir: 'to bottom right',
    bgImageSrc: null,
    bgImageEl: null,
    textElements: [
      {
        id: crypto.randomUUID(),
        text: 'Your Headline Here',
        font: 'Poppins',
        size: 64,
        color: '#ffffff',
        bold: true,
        italic: false,
        underline: false,
        align: 'center',
        letterSpacing: 0,
        x: 0.5,
        y: 0.38,
      },
      {
        id: crypto.randomUUID(),
        text: 'Your tagline or subtext goes here',
        font: 'Roboto',
        size: 28,
        color: '#cbd5e1',
        bold: false,
        italic: false,
        underline: false,
        align: 'center',
        letterSpacing: 0,
        x: 0.5,
        y: 0.62,
      },
    ],
    shapeElements: [],
    imageElements: [],
  };
}

// ─── Drawing ─────────────────────────────────────────────────────────────────

function drawBannerCanvas(
  canvas: HTMLCanvasElement,
  state: CanvasState,
  cw: number,
  ch: number,
  scale: number,
): void {
  const w = cw * scale;
  const h = ch * scale;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);

  // Background
  if (state.bgType === 'solid') {
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, w, h);
  } else if (state.bgType === 'linear') {
    const dir = state.gradDir;
    let grad: CanvasGradient;
    if (dir === 'to right') grad = ctx.createLinearGradient(0, 0, w, 0);
    else if (dir === 'to bottom') grad = ctx.createLinearGradient(0, 0, 0, h);
    else if (dir === 'to bottom right') grad = ctx.createLinearGradient(0, 0, w, h);
    else grad = ctx.createLinearGradient(w, 0, 0, h);
    grad.addColorStop(0, state.gradColor1);
    grad.addColorStop(1, state.gradColor2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (state.bgType === 'radial') {
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2);
    grad.addColorStop(0, state.gradColor1);
    grad.addColorStop(1, state.gradColor2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (state.bgType === 'image' && state.bgImageEl) {
    ctx.drawImage(state.bgImageEl, 0, 0, w, h);
  } else {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h);
  }

  // Shapes
  for (const s of state.shapeElements) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    const sx = s.x * w;
    const sy = s.y * h;
    const sw = s.w * w;
    const sh = s.h * h;

    if (s.type === 'line') {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = Math.max(1, s.borderWidth * scale);
      ctx.beginPath();
      ctx.moveTo(sx, sy + sh / 2);
      ctx.lineTo(sx + sw, sy + sh / 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = s.color;
      if (s.borderWidth > 0) {
        ctx.strokeStyle = s.borderColor;
        ctx.lineWidth = s.borderWidth * scale;
      }
      if (s.type === 'rect') {
        ctx.fillRect(sx, sy, sw, sh);
        if (s.borderWidth > 0) ctx.strokeRect(sx, sy, sw, sh);
      } else {
        ctx.beginPath();
        ctx.ellipse(sx + sw / 2, sy + sh / 2, sw / 2, sh / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        if (s.borderWidth > 0) ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Overlay images
  for (const img of state.imageElements) {
    const iw = img.img.naturalWidth;
    const ih = img.img.naturalHeight;
    const targetW = w * img.scale;
    const targetH = (ih / iw) * targetW;
    ctx.drawImage(img.img, img.x * w - targetW / 2, img.y * h - targetH / 2, targetW, targetH);
  }

  // Text elements
  for (const te of state.textElements) {
    ctx.save();
    const fs = te.size * scale;
    const weight = te.bold ? 'bold' : 'normal';
    const style = te.italic ? 'italic' : 'normal';
    ctx.font = `${style} ${weight} ${fs}px "${te.font}", sans-serif`;
    ctx.fillStyle = te.color;
    ctx.textAlign = te.align;
    ctx.textBaseline = 'middle';

    if (te.letterSpacing !== 0) {
      // Manual letter spacing
      const chars = te.text.split('');
      let totalW = 0;
      for (const c of chars) totalW += ctx.measureText(c).width + te.letterSpacing * scale;
      let cx = te.align === 'center' ? te.x * w - totalW / 2 : te.align === 'right' ? te.x * w - totalW : te.x * w;
      for (const c of chars) {
        ctx.fillText(c, cx, te.y * h);
        cx += ctx.measureText(c).width + te.letterSpacing * scale;
      }
    } else {
      ctx.fillText(te.text, te.x * w, te.y * h);
    }

    // Underline
    if (te.underline) {
      const measured = ctx.measureText(te.text).width;
      const ux = te.align === 'center' ? te.x * w - measured / 2 : te.align === 'right' ? te.x * w - measured : te.x * w;
      ctx.strokeStyle = te.color;
      ctx.lineWidth = Math.max(1, fs / 20);
      ctx.beginPath();
      ctx.moveTo(ux, te.y * h + fs * 0.6);
      ctx.lineTo(ux + measured, te.y * h + fs * 0.6);
      ctx.stroke();
    }

    ctx.restore();
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function BannerPosterMakerTool() {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const bgImageUploadRef = useRef<HTMLInputElement>(null);

  const [presetIdx, setPresetIdx] = useState(1); // Facebook Post default
  const [customW, setCustomW] = useState(800);
  const [customH, setCustomH] = useState(600);
  const [state, setState] = useState<CanvasState>(defaultState);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'size' | 'background' | 'text' | 'shapes' | 'images' | 'templates'>('background');

  const dragging = useRef<{ id: string; kind: 'text' | 'image'; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const isCustom = PRESETS[presetIdx]?.label === 'Custom';
  const canvasW = isCustom ? customW : (PRESETS[presetIdx]?.w ?? 1200);
  const canvasH = isCustom ? customH : (PRESETS[presetIdx]?.h ?? 630);

  // Compute preview scale to fit within ~700px wide
  const maxPreviewW = 700;
  const maxPreviewH = 480;
  const scaleW = maxPreviewW / canvasW;
  const scaleH = maxPreviewH / canvasH;
  const previewScale = Math.min(scaleW, scaleH, 1);
  const previewW = Math.round(canvasW * previewScale);
  const previewH = Math.round(canvasH * previewScale);

  // Load Google Fonts
  useEffect(() => {
    if (!document.getElementById('gf-banner')) {
      const link = document.createElement('link');
      link.id = 'gf-banner';
      link.rel = 'stylesheet';
      link.href = GOOGLE_FONTS_URL;
      document.head.appendChild(link);
    }
  }, []);

  const redraw = useCallback(() => {
    if (!previewCanvasRef.current) return;
    drawBannerCanvas(previewCanvasRef.current, state, canvasW, canvasH, previewScale);
  }, [state, canvasW, canvasH, previewScale]);

  useEffect(() => { redraw(); }, [redraw]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function updateState(patch: Partial<CanvasState>) {
    setState(prev => ({ ...prev, ...patch }));
  }

  function updateText(id: string, patch: Partial<TextElement>) {
    setState(prev => ({
      ...prev,
      textElements: prev.textElements.map(t => t.id === id ? { ...t, ...patch } : t),
    }));
  }

  function addText() {
    const el: TextElement = {
      id: crypto.randomUUID(),
      text: 'New Text',
      font: 'Poppins',
      size: 48,
      color: '#ffffff',
      bold: false,
      italic: false,
      underline: false,
      align: 'center',
      letterSpacing: 0,
      x: 0.5,
      y: 0.5 + Math.random() * 0.1 - 0.05,
    };
    setState(prev => ({ ...prev, textElements: [...prev.textElements, el] }));
    setSelectedTextId(el.id);
  }

  function removeText(id: string) {
    setState(prev => ({ ...prev, textElements: prev.textElements.filter(t => t.id !== id) }));
    if (selectedTextId === id) setSelectedTextId(null);
  }

  function addShape(type: ShapeType) {
    setState(prev => ({
      ...prev,
      shapeElements: [
        ...prev.shapeElements,
        {
          id: crypto.randomUUID(),
          type,
          x: 0.05,
          y: 0.05,
          w: type === 'line' ? 0.6 : 0.35,
          h: type === 'line' ? 0.05 : type === 'circle' ? 0.35 : 0.25,
          color: '#6366f1',
          borderColor: '#818cf8',
          borderWidth: 0,
          opacity: 0.7,
        },
      ],
    }));
  }

  function handleBgImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => updateState({ bgType: 'image', bgImageSrc: url, bgImageEl: img });
    img.src = url;
  }

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setState(prev => ({
        ...prev,
        imageElements: [
          ...prev.imageElements,
          { id: crypto.randomUUID(), src: url, x: 0.5, y: 0.5, scale: 0.4, img },
        ],
      }));
    };
    img.src = url;
  }

  function applyTemplate(t: Template) {
    setState(prev => ({
      ...prev,
      bgType: t.bgType,
      bgColor: t.bgColor ?? prev.bgColor,
      gradColor1: t.gradColor1 ?? prev.gradColor1,
      gradColor2: t.gradColor2 ?? prev.gradColor2,
      gradDir: t.gradDir ?? prev.gradDir,
      textElements: t.texts.map(tx => ({
        id: crypto.randomUUID(),
        text: tx.text,
        font: tx.font ?? 'Poppins',
        size: tx.size ?? 48,
        color: tx.color ?? '#ffffff',
        bold: tx.bold ?? false,
        italic: tx.italic ?? false,
        underline: tx.underline ?? false,
        align: tx.align ?? 'center',
        letterSpacing: tx.letterSpacing ?? 0,
        x: tx.x ?? 0.5,
        y: tx.y ?? 0.5,
      })),
      shapeElements: [],
      imageElements: [],
    }));
    setSelectedTextId(null);
  }

  // Drag
  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = previewCanvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / previewW;
    const my = (e.clientY - rect.top) / previewH;

    for (let i = state.imageElements.length - 1; i >= 0; i--) {
      const img = state.imageElements[i];
      if (Math.abs(img.x - mx) < 0.2 && Math.abs(img.y - my) < 0.2) {
        dragging.current = { id: img.id, kind: 'image', startX: mx, startY: my, origX: img.x, origY: img.y };
        return;
      }
    }
    for (let i = state.textElements.length - 1; i >= 0; i--) {
      const te = state.textElements[i];
      if (Math.abs(te.x - mx) < 0.3 && Math.abs(te.y - my) < 0.08) {
        setSelectedTextId(te.id);
        dragging.current = { id: te.id, kind: 'text', startX: mx, startY: my, origX: te.x, origY: te.y };
        return;
      }
    }
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!dragging.current) return;
    const rect = previewCanvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / previewW;
    const my = (e.clientY - rect.top) / previewH;
    const dx = mx - dragging.current.startX;
    const dy = my - dragging.current.startY;
    const nx = Math.max(0, Math.min(1, dragging.current.origX + dx));
    const ny = Math.max(0, Math.min(1, dragging.current.origY + dy));
    if (dragging.current.kind === 'text') {
      updateText(dragging.current.id, { x: nx, y: ny });
    } else {
      setState(prev => ({
        ...prev,
        imageElements: prev.imageElements.map(img => img.id === dragging.current!.id ? { ...img, x: nx, y: ny } : img),
      }));
    }
  }

  function onMouseUp() { dragging.current = null; }

  async function exportImage(fmt: 'png' | 'jpg') {
    const canvas = document.createElement('canvas');
    drawBannerCanvas(canvas, state, canvasW, canvasH, 1);
    const mime = fmt === 'png' ? 'image/png' : 'image/jpeg';
    const url = canvas.toDataURL(mime, 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `banner.${fmt}`;
    a.click();
  }

  const selectedText = state.textElements.find(t => t.id === selectedTextId) ?? null;

  const TABS = ['size', 'background', 'text', 'shapes', 'images', 'templates'] as const;
  type Tab = typeof TABS[number];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* ── Left Panel ── */}
        <div className="flex flex-col gap-4 xl:w-80 shrink-0">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-900 p-1 border border-slate-700">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as Tab)}
                className={`flex-1 min-w-fit px-2 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                  activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 flex flex-col gap-4">

            {/* ── Size ── */}
            {activeTab === 'size' && (
              <>
                <p className="text-xs font-medium text-slate-300">Canvas Size</p>
                <select
                  value={presetIdx}
                  onChange={e => setPresetIdx(parseInt(e.target.value))}
                  className="w-full bg-slate-800 text-slate-200 rounded-md px-3 py-2 text-sm border border-slate-600 focus:outline-none focus:border-indigo-500"
                >
                  {PRESETS.map((p, i) => (
                    <option key={p.label} value={i}>{p.label} {p.label !== 'Custom' ? `(${p.w}×${p.h})` : ''}</option>
                  ))}
                </select>
                {isCustom && (
                  <div className="flex gap-2 items-center">
                    <input type="number" value={customW} onChange={e => setCustomW(Math.max(100, parseInt(e.target.value) || 800))}
                      className="flex-1 bg-slate-800 border border-slate-600 text-slate-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500" placeholder="Width" />
                    <span className="text-slate-500 text-sm">×</span>
                    <input type="number" value={customH} onChange={e => setCustomH(Math.max(100, parseInt(e.target.value) || 600))}
                      className="flex-1 bg-slate-800 border border-slate-600 text-slate-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500" placeholder="Height" />
                  </div>
                )}
                <div className="rounded-lg bg-slate-800 border border-slate-700 p-3">
                  <p className="text-xs text-slate-400">
                    Canvas: <span className="text-slate-200 font-medium">{canvasW} × {canvasH} px</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Preview at <span className="text-slate-400">{previewW} × {previewH} px</span> ({Math.round(previewScale * 100)}%)
                  </p>
                </div>
              </>
            )}

            {/* ── Background ── */}
            {activeTab === 'background' && (
              <>
                <div className="flex flex-wrap gap-1">
                  {(['solid', 'linear', 'radial', 'image'] as BgType[]).map(t => (
                    <button key={t}
                      onClick={() => updateState({ bgType: t })}
                      className={`flex-1 min-w-fit py-1.5 px-2 rounded-md text-xs font-medium capitalize transition-colors ${state.bgType === t ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                      {t}
                    </button>
                  ))}
                </div>

                {state.bgType === 'solid' && (
                  <Row label="Color">
                    <input type="color" value={state.bgColor}
                      onChange={e => updateState({ bgColor: e.target.value })}
                      className="h-8 w-14 rounded cursor-pointer bg-transparent" />
                  </Row>
                )}

                {(state.bgType === 'linear' || state.bgType === 'radial') && (
                  <>
                    <Row label="Color 1">
                      <input type="color" value={state.gradColor1}
                        onChange={e => updateState({ gradColor1: e.target.value })}
                        className="h-8 w-14 rounded cursor-pointer bg-transparent" />
                    </Row>
                    <Row label="Color 2">
                      <input type="color" value={state.gradColor2}
                        onChange={e => updateState({ gradColor2: e.target.value })}
                        className="h-8 w-14 rounded cursor-pointer bg-transparent" />
                    </Row>
                    {state.bgType === 'linear' && (
                      <Row label="Direction">
                        <select value={state.gradDir}
                          onChange={e => updateState({ gradDir: e.target.value as GradDir })}
                          className="flex-1 bg-slate-800 text-slate-200 rounded-md px-2 py-1 text-xs border border-slate-600">
                          {GRAD_DIRS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </Row>
                    )}
                  </>
                )}

                {state.bgType === 'image' && (
                  <button onClick={() => bgImageUploadRef.current?.click()}
                    className="flex items-center gap-2 justify-center rounded-lg border border-dashed border-slate-600 py-3 text-sm text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors">
                    <Upload className="w-4 h-4" /> Upload Background Image
                  </button>
                )}
                <input ref={bgImageUploadRef} type="file" accept="image/*" className="hidden" onChange={handleBgImageUpload} />
              </>
            )}

            {/* ── Text ── */}
            {activeTab === 'text' && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-300">Text Layers</p>
                  <button onClick={addText}
                    className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded-md transition-colors">
                    <Plus className="w-3 h-3" /> Add Text
                  </button>
                </div>

                <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
                  {state.textElements.map(te => (
                    <button key={te.id} onClick={() => setSelectedTextId(te.id)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors border ${
                        selectedTextId === te.id ? 'bg-indigo-700/50 border-indigo-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}>
                      <span className="truncate flex-1 text-left">{te.text || '(empty)'}</span>
                      <button onClick={ev => { ev.stopPropagation(); removeText(te.id); }} className="ml-2 text-red-400 hover:text-red-300">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </button>
                  ))}
                </div>

                {selectedText && (
                  <div className="flex flex-col gap-3 border-t border-slate-700 pt-3">
                    <p className="text-xs font-medium text-slate-300">Edit Layer</p>

                    <textarea value={selectedText.text}
                      onChange={e => updateText(selectedText.id, { text: e.target.value })}
                      rows={2}
                      className="w-full rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-sm px-3 py-2 resize-none focus:outline-none focus:border-indigo-500" />

                    <Row label="Font">
                      <select value={selectedText.font}
                        onChange={e => updateText(selectedText.id, { font: e.target.value as GoogleFont })}
                        className="flex-1 bg-slate-800 text-slate-200 rounded-md px-2 py-1 text-xs border border-slate-600">
                        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </Row>

                    <Row label="Size">
                      <input type="range" min="10" max="160" step="2" value={selectedText.size}
                        onChange={e => updateText(selectedText.id, { size: parseInt(e.target.value) })}
                        className="flex-1 accent-indigo-500" />
                      <span className="text-xs text-slate-400 w-8 text-right">{selectedText.size}</span>
                    </Row>

                    <Row label="Color">
                      <input type="color" value={selectedText.color}
                        onChange={e => updateText(selectedText.id, { color: e.target.value })}
                        className="h-8 w-14 rounded cursor-pointer bg-transparent" />
                    </Row>

                    <Row label="Spacing">
                      <input type="range" min="-2" max="20" step="0.5" value={selectedText.letterSpacing}
                        onChange={e => updateText(selectedText.id, { letterSpacing: parseFloat(e.target.value) })}
                        className="flex-1 accent-indigo-500" />
                      <span className="text-xs text-slate-400 w-8 text-right">{selectedText.letterSpacing}</span>
                    </Row>

                    <div className="flex gap-2 flex-wrap">
                      <TogBtn active={selectedText.bold} onClick={() => updateText(selectedText.id, { bold: !selectedText.bold })}>
                        <Bold className="w-3.5 h-3.5" />
                      </TogBtn>
                      <TogBtn active={selectedText.italic} onClick={() => updateText(selectedText.id, { italic: !selectedText.italic })}>
                        <Italic className="w-3.5 h-3.5" />
                      </TogBtn>
                      <TogBtn active={selectedText.underline} onClick={() => updateText(selectedText.id, { underline: !selectedText.underline })}>
                        <Underline className="w-3.5 h-3.5" />
                      </TogBtn>
                    </div>

                    <div className="flex gap-1">
                      {(['left', 'center', 'right'] as TextAlign[]).map(a => (
                        <button key={a} onClick={() => updateText(selectedText.id, { align: a, x: a === 'left' ? 0.05 : a === 'right' ? 0.95 : 0.5 })}
                          className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-colors ${selectedText.align === a ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                          {a === 'left' ? <AlignLeft className="w-3.5 h-3.5" /> : a === 'center' ? <AlignCenter className="w-3.5 h-3.5" /> : <AlignRight className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Shapes ── */}
            {activeTab === 'shapes' && (
              <>
                <div className="flex gap-2">
                  <button onClick={() => addShape('rect')}
                    className="flex-1 flex items-center gap-1.5 justify-center rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white py-2.5 text-xs transition-colors">
                    <Square className="w-3.5 h-3.5" /> Rect
                  </button>
                  <button onClick={() => addShape('circle')}
                    className="flex-1 flex items-center gap-1.5 justify-center rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white py-2.5 text-xs transition-colors">
                    <Circle className="w-3.5 h-3.5" /> Circle
                  </button>
                  <button onClick={() => addShape('line')}
                    className="flex-1 flex items-center gap-1.5 justify-center rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white py-2.5 text-xs transition-colors">
                    <Minus className="w-3.5 h-3.5" /> Line
                  </button>
                </div>
                {state.shapeElements.length > 0 && (
                  <div className="flex flex-col gap-2 border-t border-slate-700 pt-3 max-h-48 overflow-y-auto">
                    {state.shapeElements.map((sl, i) => (
                      <div key={sl.id} className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 flex items-center gap-2">
                        <span className="text-xs text-slate-400 capitalize flex-1">{sl.type} {i + 1}</span>
                        <input type="color" value={sl.color}
                          onChange={e => setState(prev => ({ ...prev, shapeElements: prev.shapeElements.map(s => s.id === sl.id ? { ...s, color: e.target.value } : s) }))}
                          className="h-6 w-8 rounded cursor-pointer bg-transparent" />
                        <input type="range" min="0.05" max="1" step="0.05" value={sl.opacity}
                          onChange={e => setState(prev => ({ ...prev, shapeElements: prev.shapeElements.map(s => s.id === sl.id ? { ...s, opacity: parseFloat(e.target.value) } : s) }))}
                          className="w-14 accent-indigo-500" />
                        <button onClick={() => setState(prev => ({ ...prev, shapeElements: prev.shapeElements.filter(s => s.id !== sl.id) }))}
                          className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Images ── */}
            {activeTab === 'images' && (
              <>
                <button onClick={() => imageUploadRef.current?.click()}
                  className="flex items-center gap-2 justify-center rounded-lg border border-dashed border-slate-600 py-3 text-sm text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors">
                  <Upload className="w-4 h-4" /> Upload Image
                </button>
                <input ref={imageUploadRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                {state.imageElements.length > 0 && (
                  <div className="flex flex-col gap-2 border-t border-slate-700 pt-3">
                    {state.imageElements.map((img, i) => (
                      <div key={img.id} className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 flex items-center gap-2">
                        <span className="text-xs text-slate-400 flex-1">Image {i + 1}</span>
                        <input type="range" min="0.05" max="1.2" step="0.05" value={img.scale}
                          onChange={e => setState(prev => ({ ...prev, imageElements: prev.imageElements.map(im => im.id === img.id ? { ...im, scale: parseFloat(e.target.value) } : im) }))}
                          className="w-20 accent-indigo-500" />
                        <span className="text-xs text-slate-500 w-8 text-right">{Math.round(img.scale * 100)}%</span>
                        <button onClick={() => setState(prev => ({ ...prev, imageElements: prev.imageElements.filter(im => im.id !== img.id) }))}
                          className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <p className="text-xs text-slate-500">Drag images on the canvas to reposition them.</p>
                  </div>
                )}
              </>
            )}

            {/* ── Templates ── */}
            {activeTab === 'templates' && (
              <>
                <p className="text-xs text-slate-400">Click a template to apply it instantly.</p>
                <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
                  {TEMPLATES.map(t => (
                    <button key={t.name} onClick={() => applyTemplate(t)}
                      className="flex items-center gap-3 rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500 px-3 py-2.5 text-sm text-slate-200 hover:text-white transition-colors text-left">
                      <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
                      {t.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { setState(defaultState()); setSelectedTextId(null); }}
                  className="flex items-center gap-2 justify-center rounded-lg border border-slate-600 hover:border-slate-400 text-slate-400 hover:text-slate-200 py-2 text-sm transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> Reset to default
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Right: Preview + Export ── */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div className="rounded-xl bg-slate-900 border border-slate-700 p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-slate-200">
                  {PRESETS[presetIdx]?.label} — {canvasW}×{canvasH}px
                </span>
              </div>
              <span className="text-xs text-slate-500">Drag text & images to reposition</span>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[520px]">
              <div style={{ width: previewW, minWidth: 200 }}>
                <canvas
                  ref={previewCanvasRef}
                  style={{ width: previewW, height: previewH, display: 'block', cursor: 'crosshair' }}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                  className="rounded-lg border border-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-700 p-4">
            <p className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => exportImage('png')}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors">
                <Download className="w-4 h-4" /> Download PNG
              </button>
              <button onClick={() => exportImage('jpg')}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors">
                <Download className="w-4 h-4" /> Download JPG
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Exported at full {canvasW}×{canvasH}px resolution. No watermark.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-16 shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-1">{children}</div>
    </div>
  );
}

function TogBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors border ${active ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
    >
      {children}
    </button>
  );
}
