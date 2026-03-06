'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Trash2, Undo, EyeOff, X, Info } from 'lucide-react';

interface Region {
  x: number; y: number; w: number; h: number;
}

export function BlurFaceInPhotoTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [blurAmount, setBlurAmount] = useState(20);
  const [drawing, setDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState<Region | null>(null);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setRegions([]);
    setFileName(file.name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (e) => setImageSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Load image onto canvas when source changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      fitCanvas(img);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const fitCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const container = containerRef.current;
    if (!canvas || !overlay || !container) return;

    const maxW = container.clientWidth;
    const scale = Math.min(1, maxW / img.naturalWidth);
    const dw = Math.round(img.naturalWidth * scale);
    const dh = Math.round(img.naturalHeight * scale);

    canvas.width = dw;
    canvas.height = dh;
    overlay.width = dw;
    overlay.height = dh;
    setDisplaySize({ w: dw, h: dh });

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, dw, dh);
  }, []);

  // Redraw on resize
  useEffect(() => {
    const onResize = () => { if (imgRef.current) fitCanvas(imgRef.current); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [fitCanvas]);

  // Draw region overlays
  const drawOverlays = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext('2d')!;
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const allRegions = currentRect ? [...regions, currentRect] : regions;
    allRegions.forEach((r, i) => {
      ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.setLineDash([]);
      // Label
      if (i < regions.length) {
        ctx.fillStyle = 'rgba(139, 92, 246, 0.85)';
        ctx.fillRect(r.x, r.y - 20, 24, 20);
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.fillText(`${i + 1}`, r.x + 7, r.y - 5);
      }
    });
  }, [regions, currentRect]);

  useEffect(() => { drawOverlays(); }, [drawOverlays]);

  // Get coords relative to canvas
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = overlayRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPos(e);
    setDrawing(true);
    setDrawStart(pos);
    setCurrentRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
  };

  const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    const x = Math.min(drawStart.x, pos.x);
    const y = Math.min(drawStart.y, pos.y);
    const w = Math.abs(pos.x - drawStart.x);
    const h = Math.abs(pos.y - drawStart.y);
    setCurrentRect({ x, y, w, h });
  };

  const onPointerUp = () => {
    if (!drawing || !currentRect) { setDrawing(false); return; }
    setDrawing(false);
    if (currentRect.w > 5 && currentRect.h > 5) {
      setRegions(prev => [...prev, currentRect]);
    }
    setCurrentRect(null);
  };

  const removeRegion = (index: number) => {
    setRegions(prev => prev.filter((_, i) => i !== index));
  };

  const undoLast = () => {
    setRegions(prev => prev.slice(0, -1));
  };

  const clearAll = () => setRegions([]);

  const applyBlur = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || regions.length === 0) return;

    // Work at full resolution for quality output
    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = naturalSize.w;
    fullCanvas.height = naturalSize.h;
    const fCtx = fullCanvas.getContext('2d')!;
    fCtx.drawImage(img, 0, 0);

    const scaleX = naturalSize.w / displaySize.w;
    const scaleY = naturalSize.h / displaySize.h;

    regions.forEach(r => {
      const rx = Math.round(r.x * scaleX);
      const ry = Math.round(r.y * scaleY);
      const rw = Math.round(r.w * scaleX);
      const rh = Math.round(r.h * scaleY);

      // Scale-down/up blur trick — multiple passes for stronger effect
      const passes = Math.ceil(blurAmount / 10);
      const factor = blurAmount;
      fCtx.imageSmoothingEnabled = true;
      fCtx.imageSmoothingQuality = 'low';

      for (let p = 0; p < passes; p++) {
        const sw = Math.max(1, Math.round(rw / factor));
        const sh = Math.max(1, Math.round(rh / factor));
        // Draw region scaled down into top-left corner area (temp)
        fCtx.drawImage(fullCanvas, rx, ry, rw, rh, rx, ry, sw, sh);
        // Draw it back scaled up
        fCtx.drawImage(fullCanvas, rx, ry, sw, sh, rx, ry, rw, rh);
      }
    });

    // Update display canvas
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(fullCanvas, 0, 0, displaySize.w, displaySize.h);

    // Store result for download
    imgRef.current = null;
    const resultImg = new Image();
    resultImg.onload = () => { imgRef.current = resultImg; };
    resultImg.src = fullCanvas.toDataURL('image/png');

    setRegions([]);
  };

  const handleDownload = (format: 'png' | 'jpeg') => {
    const img = imgRef.current;
    if (!img) return;
    const c = document.createElement('canvas');
    c.width = naturalSize.w;
    c.height = naturalSize.h;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const a = document.createElement('a');
    a.href = c.toDataURL(`image/${format}`, format === 'jpeg' ? 0.92 : undefined);
    a.download = `${fileName}-blurred.${format}`;
    a.click();
  };

  const reset = () => {
    setImageSrc(null);
    setRegions([]);
    setCurrentRect(null);
    setFileName('');
    setNaturalSize({ w: 0, h: 0 });
    setDisplaySize({ w: 0, h: 0 });
    imgRef.current = null;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!imageSrc && (
        <div
          onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors"
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">Drop your image here or click to upload</p>
          <p className="text-sm text-slate-500">Supports JPEG, PNG, WebP</p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      )}

      {imageSrc && (
        <>
          {/* Instructions */}
          <div className="flex items-start gap-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl px-4 py-3">
            <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Click and drag on the image to select areas to blur. Add multiple regions, then click &quot;Apply Blur&quot; to process.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3">
            {/* Blur slider */}
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-slate-500" />
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">Blur: {blurAmount}px</label>
              <input type="range" min={5} max={50} value={blurAmount} onChange={(e) => setBlurAmount(Number(e.target.value))}
                className="w-28 accent-purple-600" />
            </div>

            <div className="h-6 w-px bg-slate-300 dark:bg-slate-600 hidden sm:block" />

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 ml-auto">
              <button onClick={applyBlur} disabled={regions.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium transition-colors">
                <EyeOff className="w-3.5 h-3.5" /> Apply Blur
              </button>
              <button onClick={undoLast} disabled={regions.length === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium transition-colors border border-slate-200 dark:border-slate-600">
                <Undo className="w-3.5 h-3.5" /> Undo
              </button>
              <button onClick={clearAll} disabled={regions.length === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium transition-colors border border-slate-200 dark:border-slate-600">
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
              <button onClick={reset} className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                New Image
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div ref={containerRef} className="relative mx-auto max-w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 select-none touch-none"
            style={{ backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%)', backgroundSize: '16px 16px' }}>
            <canvas ref={canvasRef} className="block max-w-full" />
            <canvas ref={overlayRef}
              className="absolute top-0 left-0 block max-w-full cursor-crosshair"
              onMouseDown={onPointerDown} onMouseMove={onPointerMove} onMouseUp={onPointerUp} onMouseLeave={onPointerUp}
              onTouchStart={onPointerDown} onTouchMove={onPointerMove} onTouchEnd={onPointerUp}
            />
          </div>

          {/* Regions List */}
          {regions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Blur Regions ({regions.length})</h3>
              <div className="flex flex-wrap gap-2">
                {regions.map((r, i) => (
                  <div key={i} className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg px-3 py-1.5">
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                      Region {i + 1}: {Math.round(r.w)}x{Math.round(r.h)}
                    </span>
                    <button onClick={() => removeRegion(i)} className="text-purple-400 hover:text-red-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Buttons */}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleDownload('png')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 text-sm font-medium transition-colors shadow-sm">
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button onClick={() => handleDownload('jpeg')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700">
              <Download className="w-4 h-4" /> Download JPEG
            </button>
          </div>
        </>
      )}
    </div>
  );
}
