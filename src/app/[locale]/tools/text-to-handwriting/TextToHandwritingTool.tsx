'use client';

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
} from 'react';
import {
  PenLine,
  Download,
  ChevronLeft,
  ChevronRight,
  Archive,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type HandwritingFont =
  | 'Caveat'
  | 'Kalam'
  | 'Indie Flower'
  | 'Shadows Into Light'
  | 'Dancing Script'
  | 'Patrick Hand';

type InkColor = 'Black' | 'Dark Blue' | 'Blue' | 'Red' | 'Pencil Gray';
type PaperStyle = 'White' | 'Ruled' | 'Grid' | 'Yellow Notepad';

interface Settings {
  font: HandwritingFont;
  fontSize: number;
  lineHeight: number;
  inkColor: InkColor;
  paperStyle: PaperStyle;
  margin: number;
  naturalness: number; // 0-100, controls wobble/jitter intensity
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_W = 1588; // 2x A4 for sharp output
const PAGE_H = 2246;
const PREVIEW_SCALE = 0.275; // Fits nicely in preview

const FONTS: { name: HandwritingFont; label: string; sample: string }[] = [
  { name: 'Caveat', label: 'Caveat', sample: 'Casual handwriting' },
  { name: 'Kalam', label: 'Kalam', sample: 'Natural writing' },
  { name: 'Indie Flower', label: 'Indie Flower', sample: 'Bubbly style' },
  { name: 'Shadows Into Light', label: 'Shadows Into Light', sample: 'Light cursive' },
  { name: 'Dancing Script', label: 'Dancing Script', sample: 'Elegant cursive' },
  { name: 'Patrick Hand', label: 'Patrick Hand', sample: 'Clean print' },
];

const INK_COLORS: { name: InkColor; hex: string; shadow: string }[] = [
  { name: 'Black', hex: '#111111', shadow: '#00000018' },
  { name: 'Dark Blue', hex: '#0d1f3c', shadow: '#00002018' },
  { name: 'Blue', hex: '#1e40af', shadow: '#1e40af15' },
  { name: 'Red', hex: '#b91c1c', shadow: '#b91c1c15' },
  { name: 'Pencil Gray', hex: '#4a4a5a', shadow: '#00000010' },
];

const PAPER_STYLES: { name: PaperStyle; bg: string }[] = [
  { name: 'White', bg: '#ffffff' },
  { name: 'Ruled', bg: '#fffef8' },
  { name: 'Grid', bg: '#ffffff' },
  { name: 'Yellow Notepad', bg: '#fef9d9' },
];

const DEFAULT_SETTINGS: Settings = {
  font: 'Kalam',
  fontSize: 44,
  lineHeight: 2.0,
  inkColor: 'Dark Blue',
  paperStyle: 'Ruled',
  margin: 120,
  naturalness: 65,
};

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Kalam:wght@300;400;700&family=Indie+Flower&family=Shadows+Into+Light&family=Dancing+Script:wght@400;500;600;700&family=Patrick+Hand&display=swap';

// ─── Seeded random for reproducible jitter ───────────────────────────────────

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Paper rendering ─────────────────────────────────────────────────────────

function drawPaper(
  ctx: CanvasRenderingContext2D,
  style: PaperStyle,
  w: number,
  h: number,
  margin: number,
  lineSpacing: number,
): void {
  const bgColor = PAPER_STYLES.find(p => p.name === style)?.bg ?? '#ffffff';

  // Base fill
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  // Subtle paper grain texture
  const grainIntensity = style === 'Yellow Notepad' ? 8 : 4;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const rng = seededRng(42);
  for (let i = 0; i < data.length; i += 4) {
    const noise = (rng() - 0.5) * grainIntensity;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);

  // Ruled lines
  if (style === 'Ruled' || style === 'Yellow Notepad') {
    const lineColor = style === 'Yellow Notepad' ? 'rgba(180,160,100,0.35)' : 'rgba(120,170,220,0.35)';
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    for (let y = margin + lineSpacing; y < h - margin / 2; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(margin * 0.4, y);
      ctx.lineTo(w - margin * 0.4, y);
      ctx.stroke();
    }
    // Red margin line
    ctx.strokeStyle = 'rgba(220,80,80,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin - 15, 0);
    ctx.lineTo(margin - 15, h);
    ctx.stroke();
  } else if (style === 'Grid') {
    ctx.strokeStyle = 'rgba(160,190,230,0.3)';
    ctx.lineWidth = 1;
    const gridSize = lineSpacing;
    for (let x = margin * 0.4; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = margin * 0.4; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  // Subtle page edge shadow (left)
  const shadow = ctx.createLinearGradient(0, 0, 12, 0);
  shadow.addColorStop(0, 'rgba(0,0,0,0.05)');
  shadow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadow;
  ctx.fillRect(0, 0, 12, h);

  // Very subtle vignette at bottom
  const bottomShadow = ctx.createLinearGradient(0, h - 40, 0, h);
  bottomShadow.addColorStop(0, 'rgba(0,0,0,0)');
  bottomShadow.addColorStop(1, 'rgba(0,0,0,0.02)');
  ctx.fillStyle = bottomShadow;
  ctx.fillRect(0, h - 40, w, 40);
}

// ─── Handwriting rendering ───────────────────────────────────────────────────

function drawHandwriting(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  settings: Settings,
  w: number,
): void {
  const { font, fontSize, lineHeight, inkColor, margin, naturalness } = settings;
  const ink = INK_COLORS.find(c => c.name === inkColor) ?? INK_COLORS[0];
  const lineSpacing = Math.round(fontSize * lineHeight);
  const intensity = naturalness / 100;

  const textX = margin;
  const textW = w - margin * 2;

  const rng = seededRng(7);

  // Per-line baseline drift (slow wave)
  let lineDrift = 0;

  let y = margin + fontSize + lineSpacing * 0.3;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];

    // Slow wave drift for the whole line baseline
    lineDrift = Math.sin(lineIdx * 0.4 + 1.7) * 3 * intensity;

    let x = textX;

    // Slight per-line indent variation
    x += (rng() - 0.5) * 6 * intensity;

    // Word-level processing for natural spacing
    const words = line.split(' ');
    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      if (wi > 0) {
        // Word space with variation
        const spaceWidth = fontSize * 0.35 + (rng() - 0.5) * fontSize * 0.12 * intensity;
        x += spaceWidth;
      }

      // Per-word slight baseline shift
      const wordBaselineShift = (rng() - 0.5) * 3 * intensity;

      // Per-word slight size variation
      const wordSizeVariation = 1 + (rng() - 0.5) * 0.04 * intensity;
      const wordFontSize = fontSize * wordSizeVariation;

      for (let ci = 0; ci < word.length; ci++) {
        const char = word[ci];
        const charFontSize = wordFontSize + (rng() - 0.5) * 2 * intensity;

        ctx.font = `${Math.round(charFontSize)}px "${font}", cursive`;

        const charWidth = ctx.measureText(char).width;

        // Per-character jitter
        const rotation = (rng() - 0.5) * (3.5 * intensity) * (Math.PI / 180);
        const xJitter = (rng() - 0.5) * 1.8 * intensity;
        const yJitter = (rng() - 0.5) * 2.5 * intensity;

        // Ink pressure variation (opacity + slight size)
        const pressureCycle = Math.sin(x * 0.008 + lineIdx * 2.1);
        const opacity = 0.82 + pressureCycle * 0.12 * intensity + rng() * 0.06 * intensity;
        const finalOpacity = Math.min(1, Math.max(0.7, opacity));

        const cx = x + charWidth / 2 + xJitter;
        const cy = y + lineDrift + wordBaselineShift + yJitter;

        // Ink bleed / shadow (subtle smudge behind text)
        if (inkColor !== 'Pencil Gray') {
          ctx.save();
          ctx.globalAlpha = 0.08 * intensity;
          ctx.fillStyle = ink.shadow;
          ctx.translate(cx + 0.5, cy + 1);
          ctx.rotate(rotation);
          ctx.font = `${Math.round(charFontSize + 1)}px "${font}", cursive`;
          ctx.fillText(char, -charWidth / 2, 0);
          ctx.restore();
        }

        // Main character
        ctx.save();
        ctx.globalAlpha = finalOpacity;
        ctx.fillStyle = ink.hex;
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.font = `${Math.round(charFontSize)}px "${font}", cursive`;
        ctx.fillText(char, -charWidth / 2, 0);
        ctx.restore();

        x += charWidth + (rng() - 0.5) * 1.2 * intensity;

        if (x > textX + textW) break;
      }
      if (x > textX + textW) break;
    }
    y += lineSpacing;
  }
}

// ─── Text wrapping & pagination ──────────────────────────────────────────────

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  font: string,
  fontSize: number,
): string[] {
  ctx.font = `${fontSize}px "${font}", cursive`;
  const rawLines = text.split('\n');
  const wrapped: string[] = [];
  for (const raw of rawLines) {
    if (raw.trim() === '') { wrapped.push(''); continue; }
    const words = raw.split(' ');
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        wrapped.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) wrapped.push(current);
  }
  return wrapped;
}

function paginateLines(
  lines: string[],
  fontSize: number,
  lineHeight: number,
  margin: number,
  pageH: number,
): string[][] {
  const lineSpacing = Math.round(fontSize * lineHeight);
  const usableH = pageH - margin * 2 - fontSize;
  const linesPerPage = Math.max(1, Math.floor(usableH / lineSpacing));
  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage));
  }
  return pages.length ? pages : [[]];
}

function renderPage(
  canvas: HTMLCanvasElement,
  pageLines: string[],
  settings: Settings,
  scale: number = 1,
): void {
  const w = Math.round(PAGE_W * scale);
  const h = Math.round(PAGE_H * scale);
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);

  const scaled: Settings = {
    ...settings,
    fontSize: Math.round(settings.fontSize * scale),
    margin: Math.round(settings.margin * scale),
  };

  const lineSpacing = Math.round(scaled.fontSize * scaled.lineHeight);
  drawPaper(ctx, settings.paperStyle, w, h, scaled.margin, lineSpacing);
  drawHandwriting(ctx, pageLines, scaled, w);
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TextToHandwritingTool() {
  const [text, setText] = useState<string>(
    'The quick brown fox jumps over the lazy dog.\n\nStart typing your own text here to see it rendered in beautiful handwriting. You can write as much as you like — the tool will automatically create multiple pages.',
  );
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [pages, setPages] = useState<string[][]>([[]]);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load Google Fonts
  useEffect(() => {
    if (!document.getElementById('gf-handwriting')) {
      const link = document.createElement('link');
      link.id = 'gf-handwriting';
      link.rel = 'stylesheet';
      link.href = GOOGLE_FONTS_URL;
      document.head.appendChild(link);
    }
    const timer = setTimeout(() => setFontsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Compute pages
  const computePages = useCallback(() => {
    const offscreen = offscreenCanvasRef.current ?? document.createElement('canvas');
    offscreenCanvasRef.current = offscreen;
    offscreen.width = PAGE_W;
    offscreen.height = PAGE_H;
    const ctx = offscreen.getContext('2d')!;
    const wrapped = wrapText(ctx, text, PAGE_W - settings.margin * 2, settings.font, settings.fontSize);
    const paginated = paginateLines(wrapped, settings.fontSize, settings.lineHeight, settings.margin, PAGE_H);
    setPages(paginated);
    setCurrentPage(prev => Math.min(prev, paginated.length - 1));
  }, [text, settings]);

  useEffect(() => { computePages(); }, [computePages]);

  // Redraw preview
  useEffect(() => {
    if (!previewCanvasRef.current || !fontsLoaded) return;
    renderPage(previewCanvasRef.current, pages[currentPage] ?? [], settings, PREVIEW_SCALE);
  }, [pages, currentPage, settings, fontsLoaded]);

  useEffect(() => {
    if (!previewCanvasRef.current) return;
    renderPage(previewCanvasRef.current, pages[currentPage] ?? [], settings, PREVIEW_SCALE);
  }, [pages, currentPage, settings]);

  function updateSettings(patch: Partial<Settings>) {
    setSettings(prev => ({ ...prev, ...patch }));
  }

  async function downloadPage(pageIdx: number) {
    const canvas = document.createElement('canvas');
    renderPage(canvas, pages[pageIdx] ?? [], settings, 1);
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `handwriting-page-${pageIdx + 1}.png`;
    a.click();
  }

  async function downloadAllZip() {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    for (let i = 0; i < pages.length; i++) {
      const canvas = document.createElement('canvas');
      renderPage(canvas, pages[i], settings, 1);
      const dataUrl = canvas.toDataURL('image/png');
      const base64 = dataUrl.split(',')[1];
      zip.file(`handwriting-page-${i + 1}.png`, base64, { base64: true });
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'handwriting-pages.zip';
    a.click();
    URL.revokeObjectURL(url);
  }

  const previewW = Math.round(PAGE_W * PREVIEW_SCALE);
  const previewH = Math.round(PAGE_H * PREVIEW_SCALE);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* ── Left: Controls ── */}
        <div className="flex flex-col gap-4 xl:w-80 shrink-0">
          {/* Text input */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <PenLine className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Your Text
            </label>
            <textarea
              value={text}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
              rows={8}
              placeholder="Type or paste your text here..."
              className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm px-3 py-2 resize-none focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
            <p className="text-xs text-slate-500">{text.length} characters · {pages.length} page{pages.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Font selector */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-3">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Handwriting Font</p>
            <div className="flex flex-col gap-1.5">
              {FONTS.map(f => (
                <button
                  key={f.name}
                  onClick={() => updateSettings({ font: f.name })}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 transition-colors border ${
                    settings.font === f.name
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  <span className="text-sm font-medium">{f.label}</span>
                  <span className={`text-xs ${settings.font === f.name ? 'text-indigo-200' : 'text-slate-500'}`}>{f.sample}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Typography controls */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-3">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Typography</p>
            <SliderRow label="Font Size" value={settings.fontSize} min={24} max={64} step={2} display={`${settings.fontSize}px`} onChange={v => updateSettings({ fontSize: v })} />
            <SliderRow label="Line Height" value={settings.lineHeight} min={1.5} max={3.0} step={0.1} display={settings.lineHeight.toFixed(1)} onChange={v => updateSettings({ lineHeight: v })} />
            <SliderRow label="Margin" value={settings.margin} min={40} max={200} step={10} display={`${settings.margin}px`} onChange={v => updateSettings({ margin: v })} />
          </div>

          {/* Ink color */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-3">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Ink Color</p>
            <div className="flex flex-wrap gap-2">
              {INK_COLORS.map(ink => (
                <button
                  key={ink.name}
                  onClick={() => updateSettings({ inkColor: ink.name })}
                  title={ink.name}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                    settings.inkColor === ink.name
                      ? 'border-indigo-500 bg-indigo-600 text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  <span className="inline-block w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600" style={{ backgroundColor: ink.hex }} />
                  {ink.name}
                </button>
              ))}
            </div>
          </div>

          {/* Paper style */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-3">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Paper Style</p>
            <div className="grid grid-cols-2 gap-2">
              {PAPER_STYLES.map(p => (
                <button
                  key={p.name}
                  onClick={() => updateSettings({ paperStyle: p.name })}
                  className={`rounded-lg px-3 py-2 text-xs font-medium border transition-colors ${
                    settings.paperStyle === p.name
                      ? 'border-indigo-500 bg-indigo-600 text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Naturalness slider */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-3">
            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Naturalness</p>
              <p className="text-xs text-slate-500 mt-0.5">Controls wobble, spacing jitter, and ink pressure variation</p>
            </div>
            <SliderRow label="" value={settings.naturalness} min={0} max={100} step={5} display={`${settings.naturalness}%`} onChange={v => updateSettings({ naturalness: v })} />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Neat &amp; uniform</span>
              <span>Natural &amp; organic</span>
            </div>
          </div>
        </div>

        {/* ── Right: Preview ── */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <PenLine className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Preview — Page {currentPage + 1} of {pages.length}
                </span>
              </div>
              {pages.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {pages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                        i === currentPage ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
                    disabled={currentPage === pages.length - 1}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Canvas */}
            <div className="overflow-x-auto flex justify-center">
              <div className="rounded-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-600" style={{ width: previewW, height: previewH }}>
                <canvas ref={previewCanvasRef} style={{ width: previewW, height: previewH, display: 'block' }} />
              </div>
            </div>
          </div>

          {/* Download */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Download className="w-4 h-4" /> Download
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => downloadPage(currentPage)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" /> Download Page {currentPage + 1} as PNG
              </button>
              {pages.length > 1 && (
                <button
                  onClick={downloadAllZip}
                  className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  <Archive className="w-4 h-4" /> Download All Pages as ZIP
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">Exported at 1588×2246px (A4 at 192 DPI) for sharp, print-ready output. No watermark.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slider helper ───────────────────────────────────────────────────────────

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-xs text-slate-600 dark:text-slate-400 w-20 shrink-0">{label}</span>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-indigo-500"
      />
      <span className="text-xs text-slate-600 dark:text-slate-400 w-12 text-right">{display}</span>
    </div>
  );
}
