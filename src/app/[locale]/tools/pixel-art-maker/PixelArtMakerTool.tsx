'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Pencil,
  Eraser,
  PaintBucket,
  Pipette,
  Minus,
  Undo2,
  Redo2,
  Trash2,
  Download,
  FlipHorizontal,
  Sparkles,
  Keyboard,
  Grid3X3,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
type ToolMode = 'pencil' | 'eraser' | 'fill' | 'eyedropper' | 'line';
type GridSize = 8 | 16 | 32 | 64;
type ExportScale = 1 | 2 | 4 | 8 | 16;

const GRID_SIZES: GridSize[] = [8, 16, 32, 64];
const EXPORT_SCALES: ExportScale[] = [1, 2, 4, 8, 16];
const MAX_HISTORY = 50;
const EMPTY = '';

const PRESET_PALETTE = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00',
  '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FF8800', '#8800FF', '#0088FF', '#88FF00',
  '#FF0088', '#888888', '#CC4444', '#44AA44',
];

// Heart pattern for 16x16 "Try Example"
function getHeartPattern(): Map<number, string> {
  const m = new Map<number, string>();
  const rows = [
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const offsetR = 2;
  const offsetC = 1;
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      if (rows[r][c]) {
        m.set((r + offsetR) * 16 + (c + offsetC), '#FF2255');
      }
    }
  }
  return m;
}

function createEmpty(size: number): string[] {
  return new Array(size * size).fill(EMPTY);
}

function floodFill(
  pixels: string[],
  size: number,
  startIdx: number,
  fillColor: string
): string[] {
  const target = pixels[startIdx];
  if (target === fillColor) return pixels;
  const result = [...pixels];
  const stack = [startIdx];
  const visited = new Set<number>();
  while (stack.length > 0) {
    const idx = stack.pop()!;
    if (visited.has(idx)) continue;
    if (result[idx] !== target) continue;
    visited.add(idx);
    result[idx] = fillColor;
    const row = Math.floor(idx / size);
    const col = idx % size;
    if (row > 0) stack.push(idx - size);
    if (row < size - 1) stack.push(idx + size);
    if (col > 0) stack.push(idx - 1);
    if (col < size - 1) stack.push(idx + 1);
  }
  return result;
}

function bresenhamLine(
  x0: number,
  y0: number,
  x1: number,
  y1: number
): [number, number][] {
  const points: [number, number][] = [];
  let dx = Math.abs(x1 - x0);
  let dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let cx = x0,
    cy = y0;
  while (true) {
    points.push([cx, cy]);
    if (cx === x1 && cy === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      cx += sx;
    }
    if (e2 <= dx) {
      err += dx;
      cy += sy;
    }
  }
  return points;
}

// ── Component ────────────────────────────────────────────────────────────────
export function PixelArtMakerTool() {
  const [gridSize, setGridSize] = useState<GridSize>(16);
  const [pixels, setPixels] = useState<string[]>(() => createEmpty(16));
  const [activeTool, setActiveTool] = useState<ToolMode>('pencil');
  const [color, setColor] = useState('#000000');
  const [showGrid, setShowGrid] = useState(true);
  const [mirrorMode, setMirrorMode] = useState(false);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [exportScale, setExportScale] = useState<ExportScale>(8);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // History for undo/redo
  const historyRef = useRef<string[][]>([createEmpty(16)]);
  const historyIdxRef = useRef(0);

  // Line tool state
  const lineStartRef = useRef<number | null>(null);
  const [linePreview, setLinePreview] = useState<Set<number>>(new Set());

  // Drawing state
  const isDrawingRef = useRef(false);

  const pushHistory = useCallback((newPixels: string[]) => {
    const h = historyRef.current;
    const idx = historyIdxRef.current;
    // Trim future states
    historyRef.current = h.slice(0, idx + 1);
    historyRef.current.push(newPixels);
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current.shift();
    } else {
      historyIdxRef.current = historyRef.current.length - 1;
    }
    historyIdxRef.current = historyRef.current.length - 1;
  }, []);

  const undo = useCallback(() => {
    if (historyIdxRef.current > 0) {
      historyIdxRef.current--;
      setPixels([...historyRef.current[historyIdxRef.current]]);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIdxRef.current < historyRef.current.length - 1) {
      historyIdxRef.current++;
      setPixels([...historyRef.current[historyIdxRef.current]]);
    }
  }, []);

  const addRecentColor = useCallback((c: string) => {
    if (!c || c === EMPTY) return;
    setRecentColors((prev) => {
      const filtered = prev.filter((rc) => rc !== c);
      return [c, ...filtered].slice(0, 8);
    });
  }, []);

  const applyPixel = useCallback(
    (idx: number, currentPixels: string[], commitHistory: boolean): string[] => {
      const newPixels = [...currentPixels];
      const size = Math.sqrt(newPixels.length);

      if (activeTool === 'pencil') {
        newPixels[idx] = color;
        if (mirrorMode) {
          const col = idx % size;
          const row = Math.floor(idx / size);
          const mirrorCol = size - 1 - col;
          newPixels[row * size + mirrorCol] = color;
        }
      } else if (activeTool === 'eraser') {
        newPixels[idx] = EMPTY;
        if (mirrorMode) {
          const col = idx % size;
          const row = Math.floor(idx / size);
          const mirrorCol = size - 1 - col;
          newPixels[row * size + mirrorCol] = EMPTY;
        }
      } else if (activeTool === 'fill') {
        const filled = floodFill(newPixels, size, idx, color);
        if (commitHistory) {
          pushHistory(filled);
          addRecentColor(color);
        }
        return filled;
      } else if (activeTool === 'eyedropper') {
        const picked = currentPixels[idx];
        if (picked && picked !== EMPTY) {
          setColor(picked);
          addRecentColor(picked);
        }
        return currentPixels;
      }

      if (commitHistory) {
        pushHistory(newPixels);
        addRecentColor(color);
      }
      return newPixels;
    },
    [activeTool, color, mirrorMode, pushHistory, addRecentColor]
  );

  const handleCellDown = useCallback(
    (idx: number) => {
      if (activeTool === 'line') {
        lineStartRef.current = idx;
        setLinePreview(new Set([idx]));
        return;
      }
      isDrawingRef.current = true;
      const newPixels = applyPixel(idx, pixels, true);
      setPixels(newPixels);
    },
    [activeTool, pixels, applyPixel]
  );

  const handleCellMove = useCallback(
    (idx: number) => {
      if (activeTool === 'line' && lineStartRef.current !== null) {
        const size = gridSize;
        const sr = Math.floor(lineStartRef.current / size);
        const sc = lineStartRef.current % size;
        const er = Math.floor(idx / size);
        const ec = idx % size;
        const pts = bresenhamLine(sc, sr, ec, er);
        setLinePreview(new Set(pts.map(([x, y]) => y * size + x)));
        return;
      }
      if (!isDrawingRef.current) return;
      if (activeTool === 'fill' || activeTool === 'eyedropper') return;
      const newPixels = applyPixel(idx, pixels, false);
      setPixels(newPixels);
    },
    [activeTool, gridSize, pixels, applyPixel]
  );

  const handleCellUp = useCallback(
    (idx: number) => {
      if (activeTool === 'line' && lineStartRef.current !== null) {
        const size = gridSize;
        const sr = Math.floor(lineStartRef.current / size);
        const sc = lineStartRef.current % size;
        const er = Math.floor(idx / size);
        const ec = idx % size;
        const pts = bresenhamLine(sc, sr, ec, er);
        const newPixels = [...pixels];
        for (const [x, y] of pts) {
          const i = y * size + x;
          newPixels[i] = color;
          if (mirrorMode) {
            const mirrorX = size - 1 - x;
            newPixels[y * size + mirrorX] = color;
          }
        }
        pushHistory(newPixels);
        addRecentColor(color);
        setPixels(newPixels);
        lineStartRef.current = null;
        setLinePreview(new Set());
        return;
      }
      if (isDrawingRef.current) {
        // Commit current state to history if we were dragging
        pushHistory(pixels);
        addRecentColor(color);
        isDrawingRef.current = false;
      }
    },
    [activeTool, gridSize, pixels, color, mirrorMode, pushHistory, addRecentColor]
  );

  const handleGlobalMouseUp = useCallback(() => {
    if (activeTool === 'line' && lineStartRef.current !== null) {
      lineStartRef.current = null;
      setLinePreview(new Set());
    }
    if (isDrawingRef.current) {
      pushHistory(pixels);
      addRecentColor(color);
      isDrawingRef.current = false;
    }
  }, [activeTool, pixels, pushHistory, addRecentColor, color]);

  useEffect(() => {
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [handleGlobalMouseUp]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      const key = e.key.toLowerCase();
      if (key === 'b') setActiveTool('pencil');
      else if (key === 'e') setActiveTool('eraser');
      else if (key === 'g') setActiveTool('fill');
      else if (key === 'i') setActiveTool('eyedropper');
      else if (key === 'l') setActiveTool('line');
      else if (key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const handleChangeGridSize = useCallback(
    (newSize: GridSize) => {
      const newPixels = createEmpty(newSize);
      // Copy existing pixels into new grid
      const oldSize = gridSize;
      const minSize = Math.min(oldSize, newSize);
      for (let r = 0; r < minSize; r++) {
        for (let c = 0; c < minSize; c++) {
          newPixels[r * newSize + c] = pixels[r * oldSize + c];
        }
      }
      setGridSize(newSize);
      setPixels(newPixels);
      historyRef.current = [newPixels];
      historyIdxRef.current = 0;
    },
    [gridSize, pixels]
  );

  const clearCanvas = useCallback(() => {
    const empty = createEmpty(gridSize);
    setPixels(empty);
    pushHistory(empty);
  }, [gridSize, pushHistory]);

  const tryExample = useCallback(() => {
    const newSize: GridSize = 16;
    const newPixels = createEmpty(newSize);
    const heart = getHeartPattern();
    heart.forEach((c, idx) => {
      newPixels[idx] = c;
    });
    setGridSize(newSize);
    setPixels(newPixels);
    historyRef.current = [newPixels];
    historyIdxRef.current = 0;
  }, []);

  const exportPNG = useCallback(() => {
    const canvas = document.createElement('canvas');
    const dim = gridSize * exportScale;
    canvas.width = dim;
    canvas.height = dim;
    const ctx = canvas.getContext('2d')!;
    // Transparent background
    ctx.clearRect(0, 0, dim, dim);
    for (let i = 0; i < pixels.length; i++) {
      if (pixels[i] && pixels[i] !== EMPTY) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        ctx.fillStyle = pixels[i];
        ctx.fillRect(
          col * exportScale,
          row * exportScale,
          exportScale,
          exportScale
        );
      }
    }
    const link = document.createElement('a');
    link.download = `pixel-art-${gridSize}x${gridSize}-${exportScale}x.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [gridSize, pixels, exportScale]);

  // Determine cell size responsively
  const getCellSizeClass = () => {
    switch (gridSize) {
      case 8:
        return 'w-8 h-8 sm:w-10 sm:h-10';
      case 16:
        return 'w-5 h-5 sm:w-6 sm:h-6';
      case 32:
        return 'w-3 h-3 sm:w-4 sm:h-4';
      case 64:
        return 'w-[6px] h-[6px] sm:w-2 sm:h-2';
    }
  };

  const canUndo = historyIdxRef.current > 0;
  const canRedo = historyIdxRef.current < historyRef.current.length - 1;

  const toolButtons: {
    mode: ToolMode;
    icon: typeof Pencil;
    label: string;
    shortcut: string;
  }[] = [
    { mode: 'pencil', icon: Pencil, label: 'Pencil', shortcut: 'B' },
    { mode: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E' },
    { mode: 'fill', icon: PaintBucket, label: 'Fill', shortcut: 'G' },
    { mode: 'eyedropper', icon: Pipette, label: 'Eyedropper', shortcut: 'I' },
    { mode: 'line', icon: Minus, label: 'Line', shortcut: 'L' },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Drawing Tools */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
          {toolButtons.map(({ mode, icon: Icon, label, shortcut }) => (
            <button
              key={mode}
              onClick={() => setActiveTool(mode)}
              title={`${label} (${shortcut})`}
              className={`rounded-md p-2 transition-colors ${
                activeTool === mode
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Redo2 className="h-4 w-4" />
          </button>
          <button
            onClick={clearCanvas}
            title="Clear Canvas"
            className="rounded-md p-2 text-gray-600 transition-colors hover:bg-red-100 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Grid"
            className={`rounded-md p-2 transition-colors ${
              showGrid
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMirrorMode(!mirrorMode)}
            title="Mirror Mode (Horizontal Symmetry)"
            className={`rounded-md p-2 transition-colors ${
              mirrorMode
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <FlipHorizontal className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            title="Keyboard Shortcuts"
            className={`rounded-md p-2 transition-colors ${
              showShortcuts
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Keyboard className="h-4 w-4" />
          </button>
        </div>

        {/* Try Example */}
        <button
          onClick={tryExample}
          className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
        >
          <Sparkles className="h-4 w-4" />
          Try Example
        </button>
      </div>

      {/* Shortcuts panel */}
      {showShortcuts && (
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-sm dark:border-purple-800 dark:bg-purple-900/20">
          <h3 className="mb-2 font-semibold text-purple-800 dark:text-purple-200">
            Keyboard Shortcuts
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
            <div>
              <kbd className="rounded bg-purple-200 px-1.5 py-0.5 font-mono text-xs dark:bg-purple-800">
                B
              </kbd>{' '}
              Pencil
            </div>
            <div>
              <kbd className="rounded bg-purple-200 px-1.5 py-0.5 font-mono text-xs dark:bg-purple-800">
                E
              </kbd>{' '}
              Eraser
            </div>
            <div>
              <kbd className="rounded bg-purple-200 px-1.5 py-0.5 font-mono text-xs dark:bg-purple-800">
                G
              </kbd>{' '}
              Fill
            </div>
            <div>
              <kbd className="rounded bg-purple-200 px-1.5 py-0.5 font-mono text-xs dark:bg-purple-800">
                I
              </kbd>{' '}
              Eyedropper
            </div>
            <div>
              <kbd className="rounded bg-purple-200 px-1.5 py-0.5 font-mono text-xs dark:bg-purple-800">
                L
              </kbd>{' '}
              Line
            </div>
            <div>
              <kbd className="rounded bg-purple-200 px-1.5 py-0.5 font-mono text-xs dark:bg-purple-800">
                Ctrl+Z
              </kbd>{' '}
              Undo
            </div>
            <div>
              <kbd className="rounded bg-purple-200 px-1.5 py-0.5 font-mono text-xs dark:bg-purple-800">
                Ctrl+Shift+Z
              </kbd>{' '}
              Redo
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left sidebar: Color & Settings */}
        <div className="flex w-full flex-col gap-4 lg:w-56 lg:shrink-0">
          {/* Color Picker */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color
            </label>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 shrink-0 rounded-lg border-2 border-gray-300 shadow-inner dark:border-gray-600"
                style={{ backgroundColor: color }}
              />
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-full cursor-pointer rounded-lg"
              />
            </div>
            <input
              type="text"
              value={color}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9a-fA-F]{0,6}$/.test(val)) setColor(val);
              }}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 font-mono text-sm uppercase dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              maxLength={7}
            />
          </div>

          {/* Preset Palette */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Palette
            </label>
            <div className="grid grid-cols-8 gap-1">
              {PRESET_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    addRecentColor(c);
                  }}
                  title={c}
                  className={`h-6 w-6 rounded border transition-transform hover:scale-110 ${
                    color === c
                      ? 'border-purple-500 ring-2 ring-purple-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Recent
              </label>
              <div className="flex flex-wrap gap-1">
                {recentColors.map((c, i) => (
                  <button
                    key={`${c}-${i}`}
                    onClick={() => setColor(c)}
                    title={c}
                    className={`h-6 w-6 rounded border transition-transform hover:scale-110 ${
                      color === c
                        ? 'border-purple-500 ring-2 ring-purple-400'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Grid Size */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Canvas Size
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {GRID_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleChangeGridSize(s)}
                  className={`rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                    gridSize === s
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {s}x{s}
                </button>
              ))}
            </div>
          </div>

          {/* Export */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Export Scale
            </label>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {EXPORT_SCALES.map((s) => (
                <button
                  key={s}
                  onClick={() => setExportScale(s)}
                  className={`rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                    exportScale === s
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              Output: {gridSize * exportScale}x{gridSize * exportScale}px
            </p>
            <button
              onClick={exportPNG}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
            >
              <Download className="h-4 w-4" />
              Export PNG
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto">
          <div className="flex items-center justify-center">
            <div
              className="inline-grid select-none rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                touchAction: 'none',
              }}
              onMouseLeave={() => {
                if (isDrawingRef.current) {
                  pushHistory(pixels);
                  addRecentColor(color);
                  isDrawingRef.current = false;
                }
              }}
            >
              {pixels.map((cellColor, idx) => {
                const isLinePreview = linePreview.has(idx);
                const bg = isLinePreview
                  ? color
                  : cellColor && cellColor !== EMPTY
                  ? cellColor
                  : undefined;
                const isTransparent = !bg;

                return (
                  <div
                    key={idx}
                    className={`${getCellSizeClass()} ${
                      showGrid
                        ? 'border-[0.5px] border-gray-200 dark:border-gray-700'
                        : ''
                    } ${
                      isTransparent
                        ? 'bg-[length:10px_10px] bg-[position:0_0,5px_5px]'
                        : ''
                    } ${isLinePreview ? 'opacity-70' : ''}`}
                    style={{
                      backgroundColor: bg || undefined,
                      backgroundImage: isTransparent
                        ? 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%), linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%)'
                        : undefined,
                      cursor:
                        activeTool === 'eyedropper'
                          ? 'crosshair'
                          : 'pointer',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleCellDown(idx);
                    }}
                    onMouseEnter={() => handleCellMove(idx)}
                    onMouseUp={() => handleCellUp(idx)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleCellDown(idx);
                    }}
                    onTouchEnd={() => handleCellUp(idx)}
                  />
                );
              })}
            </div>
          </div>

          {/* Active tool indicator */}
          <div className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
            Active:{' '}
            <span className="font-medium capitalize text-purple-600 dark:text-purple-400">
              {activeTool}
            </span>
            {mirrorMode && (
              <span className="ml-2 rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                Mirror ON
              </span>
            )}
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
              {gridSize}x{gridSize}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
