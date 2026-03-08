'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  Download,
  Paintbrush,
  Eraser,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Type,
  Info,
  CheckCircle,
  Move,
} from 'lucide-react';

const FONTS = [
  'Arial',
  'Impact',
  'Georgia',
  'Playfair Display',
  'Bebas Neue',
  'Oswald',
  'Montserrat',
  'Lobster',
  'Roboto Condensed',
  'Anton',
];

export function TextBehindImageTool() {
  // Image state
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);

  // Text state
  const [text, setText] = useState('HELLO');
  const [fontFamily, setFontFamily] = useState('Impact');
  const [fontSize, setFontSize] = useState(120);
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('bold');
  const [letterSpacing, setLetterSpacing] = useState(5);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textOpacity, setTextOpacity] = useState(100);
  const [textX, setTextX] = useState(50);
  const [textY, setTextY] = useState(50);

  // Mask / brush state
  const [brushSize, setBrushSize] = useState(30);
  const [isErasing, setIsErasing] = useState(false);
  const [isPainting, setIsPainting] = useState(false);
  const [showMask, setShowMask] = useState(true);
  const [mode, setMode] = useState<'paint' | 'drag'>('paint');

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, textX: 0, textY: 0 });

  // Canvas refs
  const containerRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Canvas dimensions
  const [canvasW, setCanvasW] = useState(800);
  const [canvasH, setCanvasH] = useState(600);

  // Load image
  const handleImageLoad = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImageSrc(e.target?.result as string);
        setCanvasW(img.naturalWidth);
        setCanvasH(img.naturalHeight);
        // Reset mask
        setTimeout(() => {
          const maskCanvas = maskCanvasRef.current;
          if (maskCanvas) {
            maskCanvas.width = img.naturalWidth;
            maskCanvas.height = img.naturalHeight;
            const ctx = maskCanvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, img.naturalWidth, img.naturalHeight);
          }
        }, 50);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageLoad(file);
    },
    [handleImageLoad]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageLoad(file);
    },
    [handleImageLoad]
  );

  // Get canvas-relative coordinates from mouse/touch event
  const getCanvasCoords = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const scaleX = canvasW / rect.width;
      const scaleY = canvasH / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    },
    [canvasW, canvasH]
  );

  // Paint on mask canvas
  const paintAt = useCallback(
    (x: number, y: number) => {
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas) return;
      const ctx = maskCanvas.getContext('2d');
      if (!ctx) return;
      ctx.globalCompositeOperation = isErasing
        ? 'destination-out'
        : 'source-over';
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,0,0,1)';
      ctx.fill();
    },
    [brushSize, isErasing]
  );

  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!image) return;
      const coords = getCanvasCoords(e);

      if (mode === 'drag') {
        setIsDragging(true);
        dragStart.current = {
          x: coords.x,
          y: coords.y,
          textX,
          textY,
        };
        return;
      }

      setIsPainting(true);
      paintAt(coords.x, coords.y);
    },
    [image, mode, getCanvasCoords, paintAt, textX, textY]
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!image) return;
      const coords = getCanvasCoords(e);

      if (mode === 'drag' && isDragging) {
        const dx = coords.x - dragStart.current.x;
        const dy = coords.y - dragStart.current.y;
        setTextX(
          Math.max(0, Math.min(100, dragStart.current.textX + (dx / canvasW) * 100))
        );
        setTextY(
          Math.max(0, Math.min(100, dragStart.current.textY + (dy / canvasH) * 100))
        );
        return;
      }

      if (isPainting) {
        paintAt(coords.x, coords.y);
      }
    },
    [image, mode, isDragging, isPainting, getCanvasCoords, paintAt, canvasW, canvasH]
  );

  const handlePointerUp = useCallback(() => {
    setIsPainting(false);
    setIsDragging(false);
  }, []);

  // Clear mask
  const clearMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    renderPreview();
  }, [canvasW, canvasH]);

  // Reset all
  const resetAll = useCallback(() => {
    setImage(null);
    setImageSrc('');
    setText('HELLO');
    setFontFamily('Impact');
    setFontSize(120);
    setFontWeight('bold');
    setLetterSpacing(5);
    setTextColor('#ffffff');
    setTextOpacity(100);
    setTextX(50);
    setTextY(50);
    setBrushSize(30);
    setIsErasing(false);
    setShowMask(true);
    setMode('paint');
  }, []);

  // Render the composite preview
  const renderPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !image) return;

    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw background image
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(image, 0, 0, canvasW, canvasH);

    // 2. Draw text
    ctx.save();
    ctx.globalAlpha = textOpacity / 100;
    ctx.font = `${fontWeight} ${fontSize}px '${fontFamily}', sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = `${letterSpacing}px`;
    const tx = (textX / 100) * canvasW;
    const ty = (textY / 100) * canvasH;
    ctx.fillText(text, tx, ty);
    ctx.restore();

    // 3. Draw the foreground (masked area) from the original image on top of text
    if (maskCanvas && maskCanvas.width > 0) {
      // Create a temp canvas to extract the masked foreground
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvasW;
      tempCanvas.height = canvasH;
      const tCtx = tempCanvas.getContext('2d');
      if (tCtx) {
        // Draw original image
        tCtx.drawImage(image, 0, 0, canvasW, canvasH);
        // Use mask as clip: keep only the masked pixels
        tCtx.globalCompositeOperation = 'destination-in';
        tCtx.drawImage(maskCanvas, 0, 0);
        // Now tempCanvas has the image only where the mask was painted
        ctx.drawImage(tempCanvas, 0, 0);
      }
    }

    // 4. Optionally overlay the mask visualization
    if (showMask && maskCanvas && maskCanvas.width > 0) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.globalCompositeOperation = 'source-over';
      // Draw reddish overlay for painted mask areas
      const tempMask = document.createElement('canvas');
      tempMask.width = canvasW;
      tempMask.height = canvasH;
      const mCtx = tempMask.getContext('2d');
      if (mCtx) {
        mCtx.fillStyle = 'rgba(0,200,200,1)';
        mCtx.fillRect(0, 0, canvasW, canvasH);
        mCtx.globalCompositeOperation = 'destination-in';
        mCtx.drawImage(maskCanvas, 0, 0);
        ctx.drawImage(tempMask, 0, 0);
      }
      ctx.restore();
    }
  }, [
    image,
    canvasW,
    canvasH,
    text,
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    textColor,
    textOpacity,
    textX,
    textY,
    showMask,
  ]);

  // Re-render on any state change
  useEffect(() => {
    renderPreview();
  }, [renderPreview, isPainting]);

  // Also re-render after painting stops
  useEffect(() => {
    if (!isPainting) renderPreview();
  }, [isPainting, renderPreview]);

  // Continuously render while painting
  useEffect(() => {
    if (!isPainting && !isDragging) return;
    const id = setInterval(renderPreview, 50);
    return () => clearInterval(id);
  }, [isPainting, isDragging, renderPreview]);

  // Download
  const handleDownload = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !image) return;

    // Render final without mask overlay
    const prevShowMask = showMask;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvasW;
    exportCanvas.height = canvasH;
    const ctx = exportCanvas.getContext('2d');
    const maskCanvas = maskCanvasRef.current;
    if (!ctx) return;

    ctx.drawImage(image, 0, 0, canvasW, canvasH);
    ctx.save();
    ctx.globalAlpha = textOpacity / 100;
    ctx.font = `${fontWeight} ${fontSize}px '${fontFamily}', sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = `${letterSpacing}px`;
    const tx = (textX / 100) * canvasW;
    const ty = (textY / 100) * canvasH;
    ctx.fillText(text, tx, ty);
    ctx.restore();

    if (maskCanvas && maskCanvas.width > 0) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvasW;
      tempCanvas.height = canvasH;
      const tCtx = tempCanvas.getContext('2d');
      if (tCtx) {
        tCtx.drawImage(image, 0, 0, canvasW, canvasH);
        tCtx.globalCompositeOperation = 'destination-in';
        tCtx.drawImage(maskCanvas, 0, 0);
        ctx.drawImage(tempCanvas, 0, 0);
      }
    }

    const link = document.createElement('a');
    link.download = 'text-behind-image.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  }, [
    image,
    canvasW,
    canvasH,
    text,
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    textColor,
    textOpacity,
    textX,
    textY,
    showMask,
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Tutorial hint */}
      <div className="flex items-start gap-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-sm text-cyan-200 dark:border-cyan-500/30 dark:bg-cyan-950/30">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
        <div>
          <p className="font-semibold text-cyan-100">How it works:</p>
          <ol className="mt-1 list-inside list-decimal space-y-0.5 text-cyan-300/90">
            <li>Upload your photo</li>
            <li>Type your text and style it</li>
            <li>
              <strong>Paint over the subject</strong> (person/object) that should
              appear IN FRONT of the text
            </li>
            <li>Download your creation!</li>
          </ol>
        </div>
      </div>

      {!image ? (
        /* Upload area */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 transition-all ${
            dragOver
              ? 'border-cyan-400 bg-cyan-950/40'
              : 'border-gray-600 bg-gray-900/50 hover:border-cyan-500 hover:bg-gray-900/70'
          }`}
        >
          <Upload className="mb-4 h-12 w-12 text-cyan-400" />
          <p className="text-lg font-semibold text-gray-200">
            Drop your image here or click to upload
          </p>
          <p className="mt-1 text-sm text-gray-400">
            PNG, JPG, WebP supported
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Canvas area */}
          <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setMode('paint')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  mode === 'paint'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Paintbrush className="h-4 w-4" />
                Paint Mask
              </button>
              <button
                onClick={() => setMode('drag')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  mode === 'drag'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Move className="h-4 w-4" />
                Move Text
              </button>

              <div className="mx-1 h-6 w-px bg-gray-700" />

              {mode === 'paint' && (
                <>
                  <button
                    onClick={() => setIsErasing(false)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      !isErasing
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Paintbrush className="h-4 w-4" />
                    Brush
                  </button>
                  <button
                    onClick={() => setIsErasing(true)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isErasing
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Eraser className="h-4 w-4" />
                    Eraser
                  </button>
                </>
              )}

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setShowMask(!showMask)}
                  className="flex items-center gap-1.5 rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  title={showMask ? 'Hide mask overlay' : 'Show mask overlay'}
                >
                  {showMask ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  Mask
                </button>
                <button
                  onClick={clearMask}
                  className="flex items-center gap-1.5 rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Mask
                </button>
                <button
                  onClick={resetAll}
                  className="flex items-center gap-1.5 rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Brush size (only when paint mode) */}
            {mode === 'paint' && (
              <div className="flex items-center gap-3 rounded-lg bg-gray-900/60 px-4 py-2">
                <span className="text-xs font-medium text-gray-400">
                  Brush Size
                </span>
                <input
                  type="range"
                  min={5}
                  max={150}
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="h-2 flex-1 cursor-pointer accent-cyan-500"
                />
                <span className="w-8 text-right text-xs text-gray-400">
                  {brushSize}
                </span>
              </div>
            )}

            {/* Preview canvas */}
            <div
              ref={containerRef}
              className="relative overflow-hidden rounded-xl border border-gray-700 bg-gray-950"
              style={{ cursor: mode === 'drag' ? 'grab' : 'crosshair' }}
            >
              <canvas
                ref={previewCanvasRef}
                width={canvasW}
                height={canvasH}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                className="w-full h-auto block"
                style={{ touchAction: 'none' }}
              />
              {/* Hidden mask canvas (full res) */}
              <canvas
                ref={maskCanvasRef}
                width={canvasW}
                height={canvasH}
                className="hidden"
              />
            </div>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-500 hover:to-teal-500 hover:shadow-cyan-500/30"
            >
              <Download className="h-5 w-5" />
              Download PNG
            </button>
          </div>

          {/* Controls sidebar */}
          <div className="space-y-4">
            {/* Text input */}
            <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-4 space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <Type className="h-4 w-4 text-cyan-400" />
                Text Settings
              </h3>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Text
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text..."
                  className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-cyan-500 focus:outline-none"
                >
                  {FONTS.map((f) => (
                    <option key={f} value={f} style={{ fontFamily: f }}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-400">
                  Font Size
                  <span className="text-cyan-400">{fontSize}px</span>
                </label>
                <input
                  type="range"
                  min={20}
                  max={500}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Font Weight
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFontWeight('normal')}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      fontWeight === 'normal'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setFontWeight('bold')}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${
                      fontWeight === 'bold'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    Bold
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-400">
                  Letter Spacing
                  <span className="text-cyan-400">{letterSpacing}px</span>
                </label>
                <input
                  type="range"
                  min={-10}
                  max={50}
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-full cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-400">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border border-gray-600 bg-transparent"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full rounded-lg border border-gray-600 bg-gray-800 px-2 py-1.5 text-xs text-gray-300 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-400">
                  Text Opacity
                  <span className="text-cyan-400">{textOpacity}%</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={textOpacity}
                  onChange={(e) => setTextOpacity(Number(e.target.value))}
                  className="w-full cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            {/* Position controls */}
            <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-4 space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <Move className="h-4 w-4 text-cyan-400" />
                Text Position
              </h3>

              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-400">
                  Horizontal (X)
                  <span className="text-cyan-400">{textX.toFixed(0)}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={textX}
                  onChange={(e) => setTextX(Number(e.target.value))}
                  className="w-full cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-400">
                  Vertical (Y)
                  <span className="text-cyan-400">{textY.toFixed(0)}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={textY}
                  onChange={(e) => setTextY(Number(e.target.value))}
                  className="w-full cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Top', x: 50, y: 20 },
                  { label: 'Center', x: 50, y: 50 },
                  { label: 'Bottom', x: 50, y: 80 },
                  { label: 'Left', x: 20, y: 50 },
                  { label: 'Right', x: 80, y: 50 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setTextX(preset.x);
                      setTextY(preset.y);
                    }}
                    className="rounded-md bg-gray-800 px-2.5 py-1 text-xs text-gray-400 transition-colors hover:bg-cyan-600 hover:text-white"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mask instructions */}
            <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-4 space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <Paintbrush className="h-4 w-4 text-cyan-400" />
                Mask Instructions
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500" />
                  Select &quot;Paint Mask&quot; mode from the toolbar
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500" />
                  Paint over the subject that should appear IN FRONT of the text
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500" />
                  Use the Eraser to fix mistakes
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500" />
                  Toggle mask visibility with the Eye icon
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500" />
                  The cyan highlight shows where you have painted
                </li>
              </ul>
            </div>

            {/* Upload new image */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
            >
              <Upload className="h-4 w-4" />
              Upload New Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Trust badge */}
      <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl border border-gray-800 bg-gray-900/50 px-6 py-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-cyan-500" />
          100% Client-Side Processing
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-cyan-500" />
          No Image Upload to Server
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-cyan-500" />
          Free &amp; No Signup Required
        </span>
      </div>
    </div>
  );
}
