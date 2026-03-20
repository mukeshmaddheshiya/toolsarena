'use client';

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
} from 'react';
import {
  Youtube,
  Download,
  Upload,
  Type,
  Square,
  Circle,
  Smile,
  Layers,
  RefreshCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Trash2,
  Monitor,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type BgType = 'solid' | 'gradient' | 'image';
type GradientDir = 'to right' | 'to bottom' | 'to bottom right' | 'to bottom left';
type FontFamily = 'Impact' | 'Arial Black' | 'Roboto' | 'Montserrat' | 'Bebas Neue';
type ShapeType = 'rect' | 'circle';
type HAlign = 'left' | 'center' | 'right';
type VAlign = 'top' | 'center' | 'bottom';

interface TextLayer {
  id: string;
  text: string;
  font: FontFamily;
  size: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  shadow: boolean;
  bold: boolean;
  italic: boolean;
  x: number; // 0-1 normalised
  y: number; // 0-1 normalised
  hAlign: HAlign;
  vAlign: VAlign;
  role: 'title' | 'subtitle';
}

interface ShapeLayer {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  opacity: number;
}

interface EmojiLayer {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

interface CanvasState {
  bgType: BgType;
  bgColor: string;
  gradColor1: string;
  gradColor2: string;
  gradDir: GradientDir;
  bgImageSrc: string | null;
  overlayImageSrc: string | null;
  overlayX: number;
  overlayY: number;
  overlayScale: number;
  textLayers: TextLayer[];
  shapeLayers: ShapeLayer[];
  emojiLayers: EmojiLayer[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CANVAS_W = 1280;
const CANVAS_H = 720;
const PREVIEW_W = 640;
const PREVIEW_H = 360;
const SCALE = PREVIEW_W / CANVAS_W;

const FONTS: FontFamily[] = ['Impact', 'Arial Black', 'Roboto', 'Montserrat', 'Bebas Neue'];
const EMOJIS = ['🔥', '💡', '⚡', '🎯', '🚀', '💰', '👑', '🏆'];
const GRAD_DIRS: GradientDir[] = ['to right', 'to bottom', 'to bottom right', 'to bottom left'];

const TEMPLATES: { name: string; state: Partial<CanvasState> }[] = [
  {
    name: 'Gaming',
    state: {
      bgType: 'solid',
      bgColor: '#0d0d1a',
      textLayers: [
        makeText('EPIC GAMEPLAY', 'title', '#00ff88', 0.5, 0.35, 72),
        makeText('Watch till the end...', 'subtitle', '#ffffff', 0.5, 0.65, 36),
      ],
    },
  },
  {
    name: 'Tutorial',
    state: {
      bgType: 'gradient',
      gradColor1: '#1e3a8a',
      gradColor2: '#3b82f6',
      gradDir: 'to bottom right',
      textLayers: [
        makeText('HOW TO DO IT', 'title', '#ffffff', 0.5, 0.35, 68),
        makeText('Step-by-step guide', 'subtitle', '#bfdbfe', 0.5, 0.65, 34),
      ],
    },
  },
  {
    name: 'Vlog',
    state: {
      bgType: 'gradient',
      gradColor1: '#f59e0b',
      gradColor2: '#ef4444',
      gradDir: 'to right',
      textLayers: [
        makeText('MY DAY VLOG', 'title', '#ffffff', 0.5, 0.35, 70),
        makeText('You won\'t believe this!', 'subtitle', '#fef3c7', 0.5, 0.65, 34),
      ],
    },
  },
  {
    name: 'Finance',
    state: {
      bgType: 'gradient',
      gradColor1: '#064e3b',
      gradColor2: '#10b981',
      gradDir: 'to bottom right',
      textLayers: [
        makeText('MAKE MONEY ONLINE', 'title', '#ffffff', 0.5, 0.35, 62),
        makeText('$10,000/month strategy', 'subtitle', '#a7f3d0', 0.5, 0.65, 34),
      ],
    },
  },
  {
    name: 'Motivational',
    state: {
      bgType: 'gradient',
      gradColor1: '#7c3aed',
      gradColor2: '#f97316',
      gradDir: 'to right',
      textLayers: [
        makeText('NEVER GIVE UP', 'title', '#ffffff', 0.5, 0.35, 76),
        makeText('Your mindset matters', 'subtitle', '#fde8d8', 0.5, 0.65, 34),
      ],
    },
  },
];

function makeText(
  text: string,
  role: 'title' | 'subtitle',
  color: string,
  x: number,
  y: number,
  size: number,
): TextLayer {
  return {
    id: crypto.randomUUID(),
    text,
    font: role === 'title' ? 'Impact' : 'Roboto',
    size,
    color,
    strokeColor: '#000000',
    strokeWidth: role === 'title' ? 3 : 0,
    shadow: false,
    bold: false,
    italic: false,
    x,
    y,
    hAlign: 'center',
    vAlign: 'center',
    role,
  };
}

function defaultState(): CanvasState {
  return {
    bgType: 'solid',
    bgColor: '#1e293b',
    gradColor1: '#6366f1',
    gradColor2: '#0ea5e9',
    gradDir: 'to right',
    bgImageSrc: null,
    overlayImageSrc: null,
    overlayX: 0.5,
    overlayY: 0.5,
    overlayScale: 0.6,
    textLayers: [
      makeText('YOUR TITLE HERE', 'title', '#ffffff', 0.5, 0.35, 72),
      makeText('Your subtitle goes here', 'subtitle', '#cbd5e1', 0.5, 0.65, 36),
    ],
    shapeLayers: [],
    emojiLayers: [],
  };
}

// ─── Drawing ─────────────────────────────────────────────────────────────────

function drawCanvas(
  canvas: HTMLCanvasElement,
  state: CanvasState,
  bgImage: HTMLImageElement | null,
  overlayImage: HTMLImageElement | null,
  scale: number = 1,
): void {
  const w = CANVAS_W * scale;
  const h = CANVAS_H * scale;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);

  // Background
  if (state.bgType === 'solid') {
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, w, h);
  } else if (state.bgType === 'gradient') {
    let grad: CanvasGradient;
    const dir = state.gradDir;
    if (dir === 'to right') grad = ctx.createLinearGradient(0, 0, w, 0);
    else if (dir === 'to bottom') grad = ctx.createLinearGradient(0, 0, 0, h);
    else if (dir === 'to bottom right') grad = ctx.createLinearGradient(0, 0, w, h);
    else grad = ctx.createLinearGradient(w, 0, 0, h);
    grad.addColorStop(0, state.gradColor1);
    grad.addColorStop(1, state.gradColor2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (state.bgType === 'image' && bgImage) {
    ctx.drawImage(bgImage, 0, 0, w, h);
  } else {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h);
  }

  // Shapes
  for (const s of state.shapeLayers) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.fillStyle = s.color;
    if (s.type === 'rect') {
      ctx.fillRect(s.x * w, s.y * h, s.w * w, s.h * h);
    } else {
      ctx.beginPath();
      ctx.ellipse(
        (s.x + s.w / 2) * w,
        (s.y + s.h / 2) * h,
        (s.w / 2) * w,
        (s.h / 2) * h,
        0, 0, Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.restore();
  }

  // Overlay image
  if (overlayImage) {
    const iw = overlayImage.naturalWidth;
    const ih = overlayImage.naturalHeight;
    const targetW = w * state.overlayScale;
    const targetH = (ih / iw) * targetW;
    const ix = state.overlayX * w - targetW / 2;
    const iy = state.overlayY * h - targetH / 2;
    ctx.drawImage(overlayImage, ix, iy, targetW, targetH);
  }

  // Text layers
  for (const tl of state.textLayers) {
    ctx.save();
    const fontSize = tl.size * scale;
    const weight = tl.bold ? 'bold' : 'normal';
    const style = tl.italic ? 'italic' : 'normal';
    ctx.font = `${style} ${weight} ${fontSize}px "${tl.font}", sans-serif`;
    ctx.textAlign = tl.hAlign === 'left' ? 'left' : tl.hAlign === 'right' ? 'right' : 'center';
    ctx.textBaseline = 'middle';

    const tx = tl.x * w;
    const ty = tl.y * h;

    if (tl.shadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 8 * scale;
      ctx.shadowOffsetX = 3 * scale;
      ctx.shadowOffsetY = 3 * scale;
    }

    if (tl.strokeWidth > 0) {
      ctx.strokeStyle = tl.strokeColor;
      ctx.lineWidth = tl.strokeWidth * scale;
      ctx.lineJoin = 'round';
      ctx.strokeText(tl.text, tx, ty);
    }

    ctx.fillStyle = tl.color;
    ctx.fillText(tl.text, tx, ty);
    ctx.restore();
  }

  // Emoji layers
  for (const el of state.emojiLayers) {
    ctx.save();
    ctx.font = `${el.size * scale}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(el.emoji, el.x * w, el.y * h);
    ctx.restore();
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ThumbnailMakerTool() {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const smallPreviewRef = useRef<HTMLCanvasElement>(null);
  const exportCanvasRef = useRef<HTMLCanvasElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<CanvasState>(defaultState);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'background' | 'text' | 'shapes' | 'stickers' | 'templates'>('background');

  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const overlayImageRef = useRef<HTMLImageElement | null>(null);

  // Drag state
  const dragging = useRef<{ id: string; kind: 'text' | 'emoji' | 'overlay'; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const redraw = useCallback(() => {
    if (previewCanvasRef.current) {
      drawCanvas(previewCanvasRef.current, state, bgImageRef.current, overlayImageRef.current, SCALE);
    }
    if (smallPreviewRef.current) {
      drawCanvas(smallPreviewRef.current, state, bgImageRef.current, overlayImageRef.current, 168 / CANVAS_W);
    }
  }, [state]);

  useEffect(() => {
    // Load Google Fonts
    if (!document.getElementById('gf-thumbnail')) {
      const link = document.createElement('link');
      link.id = 'gf-thumbnail';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Montserrat:wght@400;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => { redraw(); }, [redraw]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function updateState(patch: Partial<CanvasState>) {
    setState(prev => ({ ...prev, ...patch }));
  }

  function updateTextLayer(id: string, patch: Partial<TextLayer>) {
    setState(prev => ({
      ...prev,
      textLayers: prev.textLayers.map(t => t.id === id ? { ...t, ...patch } : t),
    }));
  }

  function addTextLayer() {
    const newLayer = makeText('New Text', 'subtitle', '#ffffff', 0.5, 0.5, 40);
    setState(prev => ({ ...prev, textLayers: [...prev.textLayers, newLayer] }));
    setSelectedTextId(newLayer.id);
  }

  function removeTextLayer(id: string) {
    setState(prev => ({ ...prev, textLayers: prev.textLayers.filter(t => t.id !== id) }));
    setSelectedTextId(null);
  }

  function addShape(type: ShapeType) {
    setState(prev => ({
      ...prev,
      shapeLayers: [
        ...prev.shapeLayers,
        {
          id: crypto.randomUUID(),
          type,
          x: 0.1,
          y: 0.1,
          w: 0.3,
          h: 0.2,
          color: '#6366f1',
          opacity: 0.5,
        },
      ],
    }));
  }

  function addEmoji(emoji: string) {
    setState(prev => ({
      ...prev,
      emojiLayers: [
        ...prev.emojiLayers,
        { id: crypto.randomUUID(), emoji, x: 0.1 + Math.random() * 0.8, y: 0.1 + Math.random() * 0.8, size: 60 },
      ],
    }));
  }

  function applyTemplate(idx: number) {
    const t = TEMPLATES[idx];
    setState(prev => ({
      ...prev,
      ...t.state,
      textLayers: (t.state.textLayers ?? prev.textLayers).map(tl => ({ ...tl, id: crypto.randomUUID() })),
    }));
  }

  function handleBgUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { bgImageRef.current = img; updateState({ bgType: 'image', bgImageSrc: url }); };
    img.src = url;
    e.target.value = '';
  }

  function handleOverlayUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { overlayImageRef.current = img; updateState({ overlayImageSrc: url }); };
    img.src = url;
    e.target.value = '';
  }

  // Drag on preview canvas
  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = previewCanvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / PREVIEW_W;
    const my = (e.clientY - rect.top) / PREVIEW_H;

    // Check emoji layers (top-most)
    for (let i = state.emojiLayers.length - 1; i >= 0; i--) {
      const el = state.emojiLayers[i];
      if (Math.abs(el.x - mx) < 0.06 && Math.abs(el.y - my) < 0.08) {
        dragging.current = { id: el.id, kind: 'emoji', startX: mx, startY: my, origX: el.x, origY: el.y };
        return;
      }
    }
    // Check text layers
    for (let i = state.textLayers.length - 1; i >= 0; i--) {
      const tl = state.textLayers[i];
      if (Math.abs(tl.x - mx) < 0.25 && Math.abs(tl.y - my) < 0.08) {
        setSelectedTextId(tl.id);
        dragging.current = { id: tl.id, kind: 'text', startX: mx, startY: my, origX: tl.x, origY: tl.y };
        return;
      }
    }
    // Check overlay
    if (state.overlayImageSrc && Math.abs(state.overlayX - mx) < 0.25 && Math.abs(state.overlayY - my) < 0.3) {
      dragging.current = { id: 'overlay', kind: 'overlay', startX: mx, startY: my, origX: state.overlayX, origY: state.overlayY };
    }
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!dragging.current) return;
    const rect = previewCanvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / PREVIEW_W;
    const my = (e.clientY - rect.top) / PREVIEW_H;
    const dx = mx - dragging.current.startX;
    const dy = my - dragging.current.startY;
    const nx = Math.max(0, Math.min(1, dragging.current.origX + dx));
    const ny = Math.max(0, Math.min(1, dragging.current.origY + dy));

    if (dragging.current.kind === 'text') {
      updateTextLayer(dragging.current.id, { x: nx, y: ny });
    } else if (dragging.current.kind === 'emoji') {
      setState(prev => ({
        ...prev,
        emojiLayers: prev.emojiLayers.map(el => el.id === dragging.current!.id ? { ...el, x: nx, y: ny } : el),
      }));
    } else if (dragging.current.kind === 'overlay') {
      updateState({ overlayX: nx, overlayY: ny });
    }
  }

  function onMouseUp() { dragging.current = null; }

  async function exportImage(format: 'png' | 'jpg') {
    const canvas = exportCanvasRef.current!;
    drawCanvas(canvas, state, bgImageRef.current, overlayImageRef.current, 1);
    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const url = canvas.toDataURL(mime, 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thumbnail.${format}`;
    a.click();
  }

  const selectedText = state.textLayers.find(t => t.id === selectedTextId) ?? null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Mobile warning */}
      <div className="flex items-center gap-2 rounded-lg bg-indigo-950/60 border border-indigo-800/50 px-4 py-2 text-sm text-indigo-300 md:hidden">
        <Monitor className="w-4 h-4 shrink-0" />
        For best results, use on desktop
      </div>

      {/* Hidden full-res export canvas */}
      <canvas ref={exportCanvasRef} className="hidden" />

      <div className="flex flex-col xl:flex-row gap-6">
        {/* ── Left Panel ── */}
        <div className="flex flex-col gap-4 min-w-0 xl:w-80 shrink-0">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-900 p-1 border border-slate-700">
            {(['background', 'text', 'shapes', 'stickers', 'templates'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-fit px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 flex flex-col gap-4">
            {/* ── Background ── */}
            {activeTab === 'background' && (
              <>
                <div className="flex gap-2">
                  {(['solid', 'gradient', 'image'] as BgType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => updateState({ bgType: t })}
                      className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                        state.bgType === t ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {state.bgType === 'solid' && (
                  <LabelRow label="Color">
                    <input type="color" value={state.bgColor}
                      onChange={e => updateState({ bgColor: e.target.value })}
                      className="h-8 w-12 rounded cursor-pointer bg-transparent" />
                  </LabelRow>
                )}

                {state.bgType === 'gradient' && (
                  <>
                    <LabelRow label="Color 1">
                      <input type="color" value={state.gradColor1}
                        onChange={e => updateState({ gradColor1: e.target.value })}
                        className="h-8 w-12 rounded cursor-pointer bg-transparent" />
                    </LabelRow>
                    <LabelRow label="Color 2">
                      <input type="color" value={state.gradColor2}
                        onChange={e => updateState({ gradColor2: e.target.value })}
                        className="h-8 w-12 rounded cursor-pointer bg-transparent" />
                    </LabelRow>
                    <LabelRow label="Direction">
                      <select
                        value={state.gradDir}
                        onChange={e => updateState({ gradDir: e.target.value as GradientDir })}
                        className="flex-1 bg-slate-800 text-slate-200 rounded-md px-2 py-1 text-xs border border-slate-600"
                      >
                        {GRAD_DIRS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </LabelRow>
                  </>
                )}

                {state.bgType === 'image' && (
                  <button
                    onClick={() => bgInputRef.current?.click()}
                    className="flex items-center gap-2 justify-center rounded-lg border border-dashed border-slate-600 py-3 text-sm text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Upload Background Image
                  </button>
                )}
                <input ref={bgInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />

                <div className="border-t border-slate-700 pt-3">
                  <p className="text-xs text-slate-400 mb-2 font-medium">Overlay Image (person/object)</p>
                  <button
                    onClick={() => overlayInputRef.current?.click()}
                    className="w-full flex items-center gap-2 justify-center rounded-lg border border-dashed border-slate-600 py-3 text-sm text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {state.overlayImageSrc ? 'Replace Overlay Image' : 'Upload Overlay Image'}
                  </button>
                  {state.overlayImageSrc && (
                    <>
                      <LabelRow label="Scale" className="mt-3">
                        <input type="range" min="0.1" max="1.2" step="0.05"
                          value={state.overlayScale}
                          onChange={e => updateState({ overlayScale: parseFloat(e.target.value) })}
                          className="flex-1 accent-indigo-500" />
                        <span className="text-xs text-slate-400 w-8 text-right">{Math.round(state.overlayScale * 100)}%</span>
                      </LabelRow>
                      <p className="text-xs text-slate-500 mt-1">Drag the overlay image on the canvas to reposition it.</p>
                    </>
                  )}
                  <input ref={overlayInputRef} type="file" accept="image/*" className="hidden" onChange={handleOverlayUpload} />
                </div>
              </>
            )}

            {/* ── Text ── */}
            {activeTab === 'text' && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-300">Text Layers</p>
                  <button
                    onClick={addTextLayer}
                    className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded-md transition-colors"
                  >
                    <Type className="w-3 h-3" /> Add Text
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  {state.textLayers.map(tl => (
                    <button
                      key={tl.id}
                      onClick={() => setSelectedTextId(tl.id)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                        selectedTextId === tl.id
                          ? 'bg-indigo-700/50 border border-indigo-600 text-white'
                          : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="truncate flex-1 text-left">{tl.text || '(empty)'}</span>
                      <span className="text-slate-500 ml-2 capitalize">{tl.role}</span>
                    </button>
                  ))}
                </div>

                {selectedText && (
                  <div className="flex flex-col gap-3 border-t border-slate-700 pt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-300">Edit Selected Layer</p>
                      <button onClick={() => removeTextLayer(selectedText.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      value={selectedText.text}
                      onChange={e => updateTextLayer(selectedText.id, { text: e.target.value })}
                      rows={2}
                      className="w-full rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-sm px-3 py-2 resize-none focus:outline-none focus:border-indigo-500"
                    />

                    <LabelRow label="Font">
                      <select
                        value={selectedText.font}
                        onChange={e => updateTextLayer(selectedText.id, { font: e.target.value as FontFamily })}
                        className="flex-1 bg-slate-800 text-slate-200 rounded-md px-2 py-1 text-xs border border-slate-600"
                      >
                        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </LabelRow>

                    <LabelRow label="Size">
                      <input type="range" min="16" max="120" step="2"
                        value={selectedText.size}
                        onChange={e => updateTextLayer(selectedText.id, { size: parseInt(e.target.value) })}
                        className="flex-1 accent-indigo-500" />
                      <span className="text-xs text-slate-400 w-8 text-right">{selectedText.size}</span>
                    </LabelRow>

                    <LabelRow label="Color">
                      <input type="color" value={selectedText.color}
                        onChange={e => updateTextLayer(selectedText.id, { color: e.target.value })}
                        className="h-8 w-12 rounded cursor-pointer bg-transparent" />
                    </LabelRow>

                    <LabelRow label="Stroke">
                      <input type="color" value={selectedText.strokeColor}
                        onChange={e => updateTextLayer(selectedText.id, { strokeColor: e.target.value })}
                        className="h-7 w-9 rounded cursor-pointer bg-transparent" />
                      <input type="range" min="0" max="10" step="1"
                        value={selectedText.strokeWidth}
                        onChange={e => updateTextLayer(selectedText.id, { strokeWidth: parseInt(e.target.value) })}
                        className="flex-1 accent-indigo-500" />
                      <span className="text-xs text-slate-400 w-4 text-right">{selectedText.strokeWidth}</span>
                    </LabelRow>

                    <div className="flex gap-2">
                      <ToggleBtn active={selectedText.bold} onClick={() => updateTextLayer(selectedText.id, { bold: !selectedText.bold })}>B</ToggleBtn>
                      <ToggleBtn active={selectedText.italic} onClick={() => updateTextLayer(selectedText.id, { italic: !selectedText.italic })}>I</ToggleBtn>
                      <ToggleBtn active={selectedText.shadow} onClick={() => updateTextLayer(selectedText.id, { shadow: !selectedText.shadow })}>Shadow</ToggleBtn>
                    </div>

                    {/* Alignment */}
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Horizontal</p>
                      <div className="flex gap-1">
                        {(['left', 'center', 'right'] as HAlign[]).map(a => (
                          <button key={a}
                            onClick={() => updateTextLayer(selectedText.id, { hAlign: a, x: a === 'left' ? 0.05 : a === 'right' ? 0.95 : 0.5 })}
                            className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-colors ${selectedText.hAlign === a ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                          >
                            {a === 'left' ? <AlignLeft className="w-3.5 h-3.5" /> : a === 'center' ? <AlignCenter className="w-3.5 h-3.5" /> : <AlignRight className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 mb-1">Vertical</p>
                      <div className="flex gap-1">
                        {(['top', 'center', 'bottom'] as VAlign[]).map(a => (
                          <button key={a}
                            onClick={() => updateTextLayer(selectedText.id, { vAlign: a, y: a === 'top' ? 0.1 : a === 'bottom' ? 0.9 : 0.5 })}
                            className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-colors ${selectedText.vAlign === a ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                          >
                            {a === 'top' ? <AlignStartVertical className="w-3.5 h-3.5" /> : a === 'center' ? <AlignCenterVertical className="w-3.5 h-3.5" /> : <AlignEndVertical className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
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
                    className="flex-1 flex items-center gap-2 justify-center rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white py-2.5 text-sm transition-colors">
                    <Square className="w-4 h-4" /> Rectangle
                  </button>
                  <button onClick={() => addShape('circle')}
                    className="flex-1 flex items-center gap-2 justify-center rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white py-2.5 text-sm transition-colors">
                    <Circle className="w-4 h-4" /> Circle
                  </button>
                </div>
                {state.shapeLayers.length > 0 && (
                  <div className="flex flex-col gap-2 border-t border-slate-700 pt-3">
                    {state.shapeLayers.map((sl, i) => (
                      <div key={sl.id} className="flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2">
                        <span className="text-xs text-slate-400 capitalize flex-1">{sl.type} {i + 1}</span>
                        <input type="color" value={sl.color}
                          onChange={e => setState(prev => ({ ...prev, shapeLayers: prev.shapeLayers.map(s => s.id === sl.id ? { ...s, color: e.target.value } : s) }))}
                          className="h-6 w-8 rounded cursor-pointer bg-transparent" />
                        <input type="range" min="0.1" max="1" step="0.05" value={sl.opacity}
                          onChange={e => setState(prev => ({ ...prev, shapeLayers: prev.shapeLayers.map(s => s.id === sl.id ? { ...s, opacity: parseFloat(e.target.value) } : s) }))}
                          className="w-16 accent-indigo-500" />
                        <button onClick={() => setState(prev => ({ ...prev, shapeLayers: prev.shapeLayers.filter(s => s.id !== sl.id) }))}
                          className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Stickers ── */}
            {activeTab === 'stickers' && (
              <>
                <p className="text-xs text-slate-400">Click an emoji to place it on the canvas. Drag to reposition.</p>
                <div className="grid grid-cols-4 gap-2">
                  {EMOJIS.map(emoji => (
                    <button key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500 py-3 text-2xl transition-colors hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {state.emojiLayers.length > 0 && (
                  <div className="flex items-center justify-between border-t border-slate-700 pt-3">
                    <span className="text-xs text-slate-400">{state.emojiLayers.length} emoji(s) placed</span>
                    <button
                      onClick={() => setState(prev => ({ ...prev, emojiLayers: [] }))}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear all
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── Templates ── */}
            {activeTab === 'templates' && (
              <>
                <p className="text-xs text-slate-400">Select a preset template to apply instantly.</p>
                <div className="flex flex-col gap-2">
                  {TEMPLATES.map((t, i) => (
                    <button key={t.name}
                      onClick={() => applyTemplate(i)}
                      className="flex items-center gap-3 rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500 px-3 py-2.5 text-sm text-slate-200 hover:text-white transition-colors text-left"
                    >
                      <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
                      {t.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { setState(defaultState()); bgImageRef.current = null; overlayImageRef.current = null; }}
                  className="flex items-center gap-2 justify-center rounded-lg border border-slate-600 hover:border-slate-400 text-slate-400 hover:text-slate-200 py-2 text-sm transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset to default
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Right: Canvas + Export ── */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {/* Preview */}
          <div className="rounded-xl bg-slate-900 border border-slate-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <Youtube className="w-4 h-4 text-red-500" />
                Preview — 1280×720
              </div>
              <span className="text-xs text-slate-500">Drag text / emoji / overlay to reposition</span>
            </div>
            <div className="overflow-x-auto">
              <canvas
                ref={previewCanvasRef}
                style={{ width: PREVIEW_W, height: PREVIEW_H, cursor: 'crosshair', display: 'block' }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                className="rounded-lg border border-slate-700"
              />
            </div>
          </div>

          {/* Small preview */}
          <div className="rounded-xl bg-slate-900 border border-slate-700 p-4">
            <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1">
              <Youtube className="w-3.5 h-3.5 text-red-500" /> How it looks in YouTube search results
            </p>
            <div className="flex items-start gap-3">
              <div
                style={{ width: 168, height: 94, overflow: 'hidden', borderRadius: 6, flexShrink: 0, border: '1px solid #334155', position: 'relative' }}
              >
                <canvas
                  ref={smallPreviewRef}
                  style={{ width: 168, height: 94, display: 'block' }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-slate-200 font-medium leading-tight">
                  {state.textLayers[0]?.text || 'Title'}
                </p>
                <p className="text-xs text-slate-500">ToolsArena • 125K views</p>
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="rounded-xl bg-slate-900 border border-slate-700 p-4">
            <p className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Thumbnail
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => exportImage('png')}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" /> Download PNG
              </button>
              <button
                onClick={() => exportImage('jpg')}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" /> Download JPG
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Exported at full 1280×720px resolution. No watermark.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function LabelRow({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-xs text-slate-400 w-14 shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-1">{children}</div>
    </div>
  );
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${active ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}
    >
      {children}
    </button>
  );
}
