'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  ZoomIn,
  ZoomOut,
  Type,
  Star,
  Copy,
  Check,
  RotateCcw,
  Search,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  Shield,
  Image as ImageIcon,
  Columns2,
  ChevronDown,
  ChevronUp,
  History,
  Trash2,
  Eye,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FontCategory = 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';

interface FontEntry {
  name: string;
  family: string;           // CSS font-family value
  category: FontCategory;
}

interface StarredFont {
  name: string;
  family: string;
  category: FontCategory;
  timestamp: number;
}

interface HistoryEntry {
  id: string;
  imageDataUrl: string;
  sampleText: string;
  starredFonts: StarredFont[];
  date: string;
}

type ViewMode = 'grid' | 'list';

/* ------------------------------------------------------------------ */
/*  Font database                                                      */
/* ------------------------------------------------------------------ */

const FONTS: FontEntry[] = [
  // Sans-serif
  { name: 'Arial', family: 'Arial, sans-serif', category: 'sans-serif' },
  { name: 'Helvetica', family: 'Helvetica, Arial, sans-serif', category: 'sans-serif' },
  { name: 'Verdana', family: 'Verdana, Geneva, sans-serif', category: 'sans-serif' },
  { name: 'Trebuchet MS', family: '"Trebuchet MS", Helvetica, sans-serif', category: 'sans-serif' },
  { name: 'Gill Sans', family: '"Gill Sans", "Gill Sans MT", Calibri, sans-serif', category: 'sans-serif' },
  { name: 'Segoe UI', family: '"Segoe UI", Tahoma, Geneva, sans-serif', category: 'sans-serif' },
  { name: 'Tahoma', family: 'Tahoma, Geneva, sans-serif', category: 'sans-serif' },
  { name: 'Geneva', family: 'Geneva, Tahoma, sans-serif', category: 'sans-serif' },
  { name: 'Calibri', family: 'Calibri, "Gill Sans", sans-serif', category: 'sans-serif' },
  { name: 'Candara', family: 'Candara, Calibri, sans-serif', category: 'sans-serif' },
  { name: 'Optima', family: 'Optima, "Segoe UI", sans-serif', category: 'sans-serif' },
  { name: 'Futura', family: 'Futura, "Trebuchet MS", sans-serif', category: 'sans-serif' },
  { name: 'Century Gothic', family: '"Century Gothic", CenturyGothic, sans-serif', category: 'sans-serif' },
  { name: 'Franklin Gothic', family: '"Franklin Gothic Medium", sans-serif', category: 'sans-serif' },
  { name: 'Lucida Grande', family: '"Lucida Grande", "Lucida Sans", sans-serif', category: 'sans-serif' },
  { name: 'Lucida Sans', family: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', category: 'sans-serif' },

  // Serif
  { name: 'Times New Roman', family: '"Times New Roman", Times, serif', category: 'serif' },
  { name: 'Georgia', family: 'Georgia, "Times New Roman", serif', category: 'serif' },
  { name: 'Garamond', family: 'Garamond, "Times New Roman", serif', category: 'serif' },
  { name: 'Palatino', family: '"Palatino Linotype", Palatino, serif', category: 'serif' },
  { name: 'Book Antiqua', family: '"Book Antiqua", Palatino, serif', category: 'serif' },
  { name: 'Cambria', family: 'Cambria, Georgia, serif', category: 'serif' },
  { name: 'Didot', family: 'Didot, "Bodoni MT", serif', category: 'serif' },
  { name: 'Bodoni MT', family: '"Bodoni MT", Didot, serif', category: 'serif' },
  { name: 'Rockwell', family: 'Rockwell, "Courier Bold", serif', category: 'serif' },
  { name: 'Baskerville', family: 'Baskerville, "Times New Roman", serif', category: 'serif' },
  { name: 'Perpetua', family: 'Perpetua, Baskerville, serif', category: 'serif' },
  { name: 'Calisto MT', family: '"Calisto MT", "Bookman Old Style", serif', category: 'serif' },

  // Monospace
  { name: 'Courier New', family: '"Courier New", Courier, monospace', category: 'monospace' },
  { name: 'Lucida Console', family: '"Lucida Console", Monaco, monospace', category: 'monospace' },
  { name: 'Monaco', family: 'Monaco, "Lucida Console", monospace', category: 'monospace' },
  { name: 'Consolas', family: 'Consolas, "Courier New", monospace', category: 'monospace' },
  { name: 'Menlo', family: 'Menlo, Monaco, monospace', category: 'monospace' },
  { name: 'Cascadia Code', family: '"Cascadia Code", Consolas, monospace', category: 'monospace' },
  { name: 'Andale Mono', family: '"Andale Mono", monospace', category: 'monospace' },
  { name: 'Source Code Pro', family: '"Source Code Pro", Consolas, monospace', category: 'monospace' },

  // Display / Decorative
  { name: 'Impact', family: 'Impact, "Arial Black", sans-serif', category: 'display' },
  { name: 'Comic Sans MS', family: '"Comic Sans MS", cursive', category: 'display' },
  { name: 'Copperplate', family: 'Copperplate, "Copperplate Gothic Light", serif', category: 'display' },
  { name: 'Papyrus', family: 'Papyrus, fantasy', category: 'display' },
  { name: 'Arial Black', family: '"Arial Black", Gadget, sans-serif', category: 'display' },
  { name: 'Stencil', family: 'Stencil, "Arial Black", sans-serif', category: 'display' },
  { name: 'Haettenschweiler', family: 'Haettenschweiler, "Arial Narrow Bold", sans-serif', category: 'display' },
  { name: 'Cooper Black', family: '"Cooper Black", serif', category: 'display' },

  // Handwriting / Cursive
  { name: 'Brush Script MT', family: '"Brush Script MT", cursive', category: 'handwriting' },
  { name: 'Lucida Handwriting', family: '"Lucida Handwriting", cursive', category: 'handwriting' },
  { name: 'Segoe Script', family: '"Segoe Script", cursive', category: 'handwriting' },
  { name: 'Bradley Hand', family: '"Bradley Hand", cursive', category: 'handwriting' },
  { name: 'Snell Roundhand', family: '"Snell Roundhand", cursive', category: 'handwriting' },
  { name: 'Apple Chancery', family: '"Apple Chancery", cursive', category: 'handwriting' },
  { name: 'MV Boli', family: '"MV Boli", cursive', category: 'handwriting' },
  { name: 'Mistral', family: 'Mistral, cursive', category: 'handwriting' },
];

const CATEGORY_LABELS: Record<FontCategory, string> = {
  'sans-serif': 'Sans-Serif',
  serif: 'Serif',
  monospace: 'Monospace',
  display: 'Display',
  handwriting: 'Handwriting',
};

const CATEGORY_COLORS: Record<FontCategory, string> = {
  'sans-serif': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  serif: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  monospace: 'bg-green-500/10 text-green-400 border-green-500/20',
  display: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  handwriting: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
};

const STORAGE_KEY = 'font-identifier-history';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 5)));
  } catch {
    /* quota exceeded – silently ignore */
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FontIdentifierTool() {
  /* ----- image state ----- */
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);

  /* ----- text / font controls ----- */
  const [sampleText, setSampleText] = useState('The quick brown fox jumps');
  const [fontSize, setFontSize] = useState(28);
  const [fontWeight, setFontWeight] = useState(400);
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.4);

  /* ----- gallery / filter ----- */
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FontCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showControls, setShowControls] = useState(true);

  /* ----- starred & compare ----- */
  const [starredFonts, setStarredFonts] = useState<StarredFont[]>([]);
  const [compareFonts, setCompareFonts] = useState<string[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);

  /* ----- misc ----- */
  const [copiedFont, setCopiedFont] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [hoveredFont, setHoveredFont] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  /* load history on mount */
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  /* ----- filtered fonts ----- */
  const filteredFonts = useMemo(() => {
    return FONTS.filter((f) => {
      const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
      const matchesSearch =
        !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  /* ----- handlers ----- */

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setImageDataUrl(await fileToDataUrl(file));
    setZoom(100);
    setStarredFonts([]);
    setCompareFonts([]);
    setIsCompareMode(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const toggleStar = useCallback(
    (font: FontEntry) => {
      setStarredFonts((prev) => {
        const exists = prev.some((s) => s.name === font.name);
        if (exists) return prev.filter((s) => s.name !== font.name);
        return [...prev, { ...font, timestamp: Date.now() }];
      });
    },
    [],
  );

  const toggleCompare = useCallback((fontName: string) => {
    setCompareFonts((prev) => {
      if (prev.includes(fontName)) return prev.filter((n) => n !== fontName);
      if (prev.length >= 3) return [...prev.slice(1), fontName];
      return [...prev, fontName];
    });
  }, []);

  const copyCSS = useCallback((font: FontEntry) => {
    const css = `font-family: ${font.family};\nfont-weight: ${fontWeight};\nfont-style: ${fontStyle};\nfont-size: ${fontSize}px;\nletter-spacing: ${letterSpacing}px;\nline-height: ${lineHeight};`;
    navigator.clipboard.writeText(css).then(() => {
      setCopiedFont(font.name);
      setTimeout(() => setCopiedFont(null), 2000);
    });
  }, [fontWeight, fontStyle, fontSize, letterSpacing, lineHeight]);

  const saveToHistory = useCallback(() => {
    if (!imageDataUrl) return;
    const entry: HistoryEntry = {
      id: generateId(),
      imageDataUrl,
      sampleText,
      starredFonts,
      date: new Date().toLocaleDateString(),
    };
    const updated = [entry, ...history].slice(0, 5);
    setHistory(updated);
    saveHistory(updated);
  }, [imageDataUrl, sampleText, starredFonts, history]);

  const loadFromHistory = useCallback((entry: HistoryEntry) => {
    setImageUrl(entry.imageDataUrl);
    setImageDataUrl(entry.imageDataUrl);
    setSampleText(entry.sampleText);
    setStarredFonts(entry.starredFonts);
    setShowHistory(false);
    setZoom(100);
  }, []);

  const deleteHistory = useCallback(
    (id: string) => {
      const updated = history.filter((h) => h.id !== id);
      setHistory(updated);
      saveHistory(updated);
    },
    [history],
  );

  const handleReset = useCallback(() => {
    if (imageUrl && !imageUrl.startsWith('data:')) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setImageDataUrl(null);
    setZoom(100);
    setSampleText('The quick brown fox jumps');
    setFontSize(28);
    setFontWeight(400);
    setFontStyle('normal');
    setLetterSpacing(0);
    setLineHeight(1.4);
    setSearchQuery('');
    setActiveCategory('all');
    setStarredFonts([]);
    setCompareFonts([]);
    setIsCompareMode(false);
  }, [imageUrl]);

  const loadExample = useCallback(() => {
    /* Create a simple example canvas image with styled text */
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 600, 200);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 48px Georgia';
    ctx.fillText('Hello World', 40, 90);
    ctx.font = '24px Georgia';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('What font is this?', 40, 140);
    const dataUrl = canvas.toDataURL('image/png');
    setImageUrl(dataUrl);
    setImageDataUrl(dataUrl);
    setSampleText('Hello World');
    setZoom(100);
    setStarredFonts([]);
    setCompareFonts([]);
    setIsCompareMode(false);
  }, []);

  /* ----- star helpers ----- */
  const isStarred = useCallback(
    (name: string) => starredFonts.some((s) => s.name === name),
    [starredFonts],
  );

  const isCompared = useCallback(
    (name: string) => compareFonts.includes(name),
    [compareFonts],
  );

  const comparedFontEntries = useMemo(
    () => FONTS.filter((f) => compareFonts.includes(f.name)),
    [compareFonts],
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* Privacy badge */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1.5 text-xs text-green-400">
          <Shield className="w-3.5 h-3.5" />
          100% Client-Side &mdash; Your images never leave your device
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            History ({history.length})
          </button>
          <button
            onClick={loadExample}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Try Example
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* History dropdown */}
      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-200">Recent Identifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="relative rounded-lg border border-zinc-700 bg-zinc-800 p-2 group cursor-pointer hover:border-zinc-500 transition-colors"
                    onClick={() => loadFromHistory(entry)}
                  >
                    <img
                      src={entry.imageDataUrl}
                      alt="History"
                      className="w-full h-20 object-cover rounded"
                    />
                    <p className="text-xs text-zinc-400 mt-1.5 truncate">{entry.sampleText}</p>
                    <p className="text-[10px] text-zinc-500">{entry.date} &middot; {entry.starredFonts.length} starred</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistory(entry.id);
                      }}
                      className="absolute top-1 right-1 p-1 rounded bg-zinc-900/80 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload / Image Preview */}
      {!imageUrl ? (
        <div
          ref={dropRef}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-500/5'
              : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center">
            <Upload className="w-7 h-7 text-zinc-400" />
          </div>
          <div className="text-center">
            <p className="text-zinc-200 font-medium">
              Drop an image here or click to upload
            </p>
            <p className="text-zinc-500 text-sm mt-1">
              Upload an image containing the font you want to identify
            </p>
          </div>
          <p className="text-xs text-zinc-600">PNG, JPG, WEBP, SVG accepted</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image preview */}
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm text-zinc-300 font-medium">
                <ImageIcon className="w-4 h-4" />
                Uploaded Image
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom((z) => Math.max(25, z - 25))}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-zinc-500 w-10 text-center">{zoom}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(300, z + 25))}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title="Upload new"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>
            </div>
            <div className="overflow-auto p-4 max-h-[400px] bg-zinc-950/50 flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Font sample"
                style={{ width: `${zoom}%`, maxWidth: 'none' }}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Starred / compare panel */}
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm text-zinc-300 font-medium">
                <Star className="w-4 h-4 text-yellow-400" />
                Starred Matches ({starredFonts.length})
              </div>
              <div className="flex items-center gap-2">
                {starredFonts.length > 0 && (
                  <button
                    onClick={saveToHistory}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg transition-colors"
                  >
                    Save to History
                  </button>
                )}
                {compareFonts.length >= 2 && (
                  <button
                    onClick={() => setIsCompareMode(!isCompareMode)}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors ${
                      isCompareMode
                        ? 'bg-purple-600 text-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    <Columns2 className="w-3 h-3" />
                    Compare ({compareFonts.length})
                  </button>
                )}
              </div>
            </div>
            <div className="p-4 max-h-[350px] overflow-y-auto">
              {starredFonts.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-8">
                  Star fonts from the gallery below to see them here
                </p>
              ) : (
                <div className="space-y-2">
                  {starredFonts.map((sf) => (
                    <div
                      key={sf.name}
                      className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-zinc-400">{sf.name}</p>
                        <p
                          className="text-lg text-zinc-100 truncate"
                          style={{
                            fontFamily: sf.family,
                            fontWeight,
                            fontStyle,
                            letterSpacing: `${letterSpacing}px`,
                          }}
                        >
                          {sampleText}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 ml-2 shrink-0">
                        <button
                          onClick={() => toggleCompare(sf.name)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isCompared(sf.name)
                              ? 'bg-purple-600 text-white'
                              : 'bg-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                          title="Add to compare"
                        >
                          <Columns2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleStar(sf)}
                          className="p-1.5 rounded-lg bg-zinc-700 text-yellow-400 hover:bg-zinc-600 transition-colors"
                          title="Remove star"
                        >
                          <Star className="w-3.5 h-3.5 fill-yellow-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compare mode overlay */}
      <AnimatePresence>
        {isCompareMode && comparedFontEntries.length >= 2 && imageUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-xl border border-purple-500/30 bg-zinc-900 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-purple-500/20 px-4 py-2.5 bg-purple-500/5">
              <p className="text-sm font-medium text-purple-300">
                Side-by-Side Comparison
              </p>
              <button
                onClick={() => setIsCompareMode(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-zinc-800">
              {/* original image column */}
              <div className="p-4">
                <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Original</p>
                <div className="overflow-hidden rounded-lg bg-zinc-950 flex items-center justify-center p-2 h-32">
                  <img src={imageUrl} alt="Original" className="max-h-full object-contain" />
                </div>
              </div>
              {comparedFontEntries.map((cf) => (
                <div key={cf.name} className="p-4">
                  <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">
                    {cf.name}
                  </p>
                  <div
                    className="overflow-hidden rounded-lg bg-zinc-950 flex items-center justify-center p-4 h-32"
                    style={{
                      fontFamily: cf.family,
                      fontSize: `${fontSize}px`,
                      fontWeight,
                      fontStyle,
                      letterSpacing: `${letterSpacing}px`,
                      lineHeight,
                    }}
                  >
                    <span className="text-zinc-100">{sampleText}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls bar */}
      <div className="rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden">
        <button
          onClick={() => setShowControls(!showControls)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
            <SlidersHorizontal className="w-4 h-4" />
            Font Controls &amp; Sample Text
          </div>
          {showControls ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </button>

        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-zinc-700 p-4 space-y-4">
                {/* Sample text */}
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">
                    Sample Text (type text that matches your image)
                  </label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={sampleText}
                      onChange={(e) => setSampleText(e.target.value)}
                      placeholder="Type sample text..."
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 pl-10 pr-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Sliders row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* Font size */}
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Size: {fontSize}px
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={72}
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  {/* Font weight */}
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Weight: {fontWeight}
                    </label>
                    <input
                      type="range"
                      min={100}
                      max={900}
                      step={100}
                      value={fontWeight}
                      onChange={(e) => setFontWeight(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  {/* Letter spacing */}
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Spacing: {letterSpacing}px
                    </label>
                    <input
                      type="range"
                      min={-5}
                      max={20}
                      step={0.5}
                      value={letterSpacing}
                      onChange={(e) => setLetterSpacing(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  {/* Line height */}
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">
                      Line-Height: {lineHeight}
                    </label>
                    <input
                      type="range"
                      min={0.8}
                      max={3}
                      step={0.1}
                      value={lineHeight}
                      onChange={(e) => setLineHeight(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  {/* Font style */}
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Style</label>
                    <div className="flex rounded-lg border border-zinc-700 overflow-hidden">
                      <button
                        onClick={() => setFontStyle('normal')}
                        className={`flex-1 py-1.5 text-xs transition-colors ${
                          fontStyle === 'normal'
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => setFontStyle('italic')}
                        className={`flex-1 py-1.5 text-xs italic transition-colors ${
                          fontStyle === 'italic'
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                      >
                        Italic
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gallery header: search + filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fonts..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category pills */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-full px-3 py-1 text-xs border transition-colors ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'
            }`}
          >
            All ({FONTS.length})
          </button>
          {(Object.keys(CATEGORY_LABELS) as FontCategory[]).map((cat) => {
            const count = FONTS.filter((f) => f.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs border transition-colors ${
                  activeCategory === cat
                    ? CATEGORY_COLORS[cat]
                    : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          })}

          {/* View toggle */}
          <div className="flex rounded-lg border border-zinc-700 overflow-hidden ml-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
              title="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Font count */}
      <p className="text-xs text-zinc-500">
        Showing {filteredFonts.length} of {FONTS.length} fonts
      </p>

      {/* Font gallery */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredFonts.map((font) => (
            <motion.div
              key={font.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onMouseEnter={() => setHoveredFont(font.name)}
              onMouseLeave={() => setHoveredFont(null)}
              className={`group relative rounded-xl border bg-zinc-900 overflow-hidden transition-all ${
                isStarred(font.name)
                  ? 'border-yellow-500/30'
                  : isCompared(font.name)
                  ? 'border-purple-500/30'
                  : 'border-zinc-700 hover:border-zinc-500'
              }`}
            >
              {/* Font header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-medium text-zinc-200 truncate">
                    {font.name}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full border shrink-0 ${CATEGORY_COLORS[font.category]}`}
                  >
                    {CATEGORY_LABELS[font.category]}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => toggleCompare(font.name)}
                    className={`p-1 rounded transition-colors ${
                      isCompared(font.name)
                        ? 'text-purple-400'
                        : 'text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100'
                    }`}
                    title="Compare"
                  >
                    <Columns2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleStar(font)}
                    className={`p-1 rounded transition-colors ${
                      isStarred(font.name)
                        ? 'text-yellow-400'
                        : 'text-zinc-600 hover:text-yellow-400 opacity-0 group-hover:opacity-100'
                    }`}
                    title="Star as match"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${isStarred(font.name) ? 'fill-yellow-400' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Font preview */}
              <div className="px-3 py-4 min-h-[80px] flex items-center">
                <p
                  className="text-zinc-100 break-words w-full"
                  style={{
                    fontFamily: font.family,
                    fontSize: `${hoveredFont === font.name ? Math.min(fontSize * 1.2, 60) : fontSize}px`,
                    fontWeight,
                    fontStyle,
                    letterSpacing: `${letterSpacing}px`,
                    lineHeight,
                    transition: 'font-size 0.2s ease',
                  }}
                >
                  {sampleText || 'The quick brown fox'}
                </p>
              </div>

              {/* Footer with CSS copy */}
              <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-800 bg-zinc-950/30">
                <code className="text-[10px] text-zinc-500 truncate max-w-[70%]">
                  font-family: {font.family}
                </code>
                <button
                  onClick={() => copyCSS(font)}
                  className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-200 transition-colors"
                  title="Copy CSS"
                >
                  {copiedFont === font.name ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy CSS
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 divide-y divide-zinc-800 overflow-hidden">
          {filteredFonts.map((font) => (
            <motion.div
              key={font.name}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onMouseEnter={() => setHoveredFont(font.name)}
              onMouseLeave={() => setHoveredFont(null)}
              className={`group flex items-center gap-4 px-4 py-3 hover:bg-zinc-800/50 transition-colors ${
                isStarred(font.name) ? 'bg-yellow-500/5' : ''
              }`}
            >
              {/* Font name + category */}
              <div className="w-40 shrink-0">
                <p className="text-sm font-medium text-zinc-200">{font.name}</p>
                <span
                  className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full border mt-0.5 ${CATEGORY_COLORS[font.category]}`}
                >
                  {CATEGORY_LABELS[font.category]}
                </span>
              </div>

              {/* Preview */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-zinc-100 truncate"
                  style={{
                    fontFamily: font.family,
                    fontSize: `${fontSize}px`,
                    fontWeight,
                    fontStyle,
                    letterSpacing: `${letterSpacing}px`,
                    lineHeight,
                  }}
                >
                  {sampleText || 'The quick brown fox'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleCompare(font.name)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isCompared(font.name)
                      ? 'bg-purple-600/20 text-purple-400'
                      : 'text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100'
                  }`}
                  title="Compare"
                >
                  <Columns2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleStar(font)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isStarred(font.name)
                      ? 'text-yellow-400'
                      : 'text-zinc-600 hover:text-yellow-400 opacity-0 group-hover:opacity-100'
                  }`}
                  title="Star"
                >
                  <Star
                    className={`w-4 h-4 ${isStarred(font.name) ? 'fill-yellow-400' : ''}`}
                  />
                </button>
                <button
                  onClick={() => copyCSS(font)}
                  className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-all"
                  title="Copy CSS"
                >
                  {copiedFont === font.name ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredFonts.length === 0 && (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 py-12 text-center">
          <Search className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">
            No fonts match &ldquo;{searchQuery}&rdquo;
            {activeCategory !== 'all' && ` in ${CATEGORY_LABELS[activeCategory]}`}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* How it works */}
      <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-3">How to Identify a Font</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '1',
              title: 'Upload Image',
              desc: 'Upload an image containing the font you want to identify.',
            },
            {
              step: '2',
              title: 'Type Sample Text',
              desc: 'Type the same text that appears in the image for accurate comparison.',
            },
            {
              step: '3',
              title: 'Adjust & Compare',
              desc: 'Tune font size, weight, and spacing. Browse or search the font gallery.',
            },
            {
              step: '4',
              title: 'Star & Copy CSS',
              desc: 'Star the closest matches, compare side by side, and copy the CSS code.',
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{item.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
