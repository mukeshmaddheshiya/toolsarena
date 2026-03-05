'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, RotateCcw, Crop, Square, Smartphone, Monitor, Image as ImageIcon } from 'lucide-react';

const PRESETS = [
  { label: 'Free', ratio: 0, icon: Crop },
  { label: '1:1', ratio: 1, icon: Square },
  { label: '16:9', ratio: 16 / 9, icon: Monitor },
  { label: '9:16', ratio: 9 / 16, icon: Smartphone },
  { label: '4:3', ratio: 4 / 3, icon: ImageIcon },
  { label: '3:2', ratio: 3 / 2, icon: ImageIcon },
];

export function ImageCropperTool() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [cropArea, setCropArea] = useState({ x: 50, y: 50, w: 200, h: 200 });
  const [dragging, setDragging] = useState<'move' | 'resize' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cx: 0, cy: 0, cw: 0, ch: 0 });
  const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0, natW: 0, natH: 0 });
  const [aspectRatio, setAspectRatio] = useState(0);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setCroppedUrl(null);
    setFileName(file.name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onImageLoad = () => {
    if (!imgRef.current) return;
    const { width, height, naturalWidth, naturalHeight } = imgRef.current;
    setImgDimensions({ w: width, h: height, natW: naturalWidth, natH: naturalHeight });
    const size = Math.min(width, height) * 0.7;
    setCropArea({ x: (width - size) / 2, y: (height - size) / 2, w: size, h: aspectRatio ? size / aspectRatio : size });
  };

  useEffect(() => {
    if (!imgDimensions.w) return;
    const { w, h } = imgDimensions;
    if (aspectRatio > 0) {
      let cw = Math.min(w * 0.7, h * 0.7 * aspectRatio);
      let ch = cw / aspectRatio;
      if (ch > h * 0.7) { ch = h * 0.7; cw = ch * aspectRatio; }
      setCropArea({ x: (w - cw) / 2, y: (h - ch) / 2, w: cw, h: ch });
    }
  }, [aspectRatio, imgDimensions]);

  const clamp = useCallback((val: number, min: number, max: number) => Math.max(min, Math.min(max, val)), []);

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize') => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(type);
    setDragStart({ x: e.clientX, y: e.clientY, cx: cropArea.x, cy: cropArea.y, cw: cropArea.w, ch: cropArea.h });
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      if (dragging === 'move') {
        setCropArea(prev => ({
          ...prev,
          x: clamp(dragStart.cx + dx, 0, imgDimensions.w - prev.w),
          y: clamp(dragStart.cy + dy, 0, imgDimensions.h - prev.h),
        }));
      } else {
        let nw = clamp(dragStart.cw + dx, 30, imgDimensions.w - dragStart.cx);
        let nh = aspectRatio > 0 ? nw / aspectRatio : clamp(dragStart.ch + dy, 30, imgDimensions.h - dragStart.cy);
        if (aspectRatio > 0 && dragStart.cy + nh > imgDimensions.h) {
          nh = imgDimensions.h - dragStart.cy;
          nw = nh * aspectRatio;
        }
        setCropArea(prev => ({ ...prev, w: nw, h: nh }));
      }
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging, dragStart, imgDimensions, aspectRatio, clamp]);

  const doCrop = () => {
    if (!imgRef.current) return;
    const scaleX = imgDimensions.natW / imgDimensions.w;
    const scaleY = imgDimensions.natH / imgDimensions.h;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(cropArea.w * scaleX);
    canvas.height = Math.round(cropArea.h * scaleY);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imgRef.current, cropArea.x * scaleX, cropArea.y * scaleY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    setCroppedUrl(canvas.toDataURL('image/png'));
  };

  const handleDownload = () => {
    if (!croppedUrl) return;
    const a = document.createElement('a');
    a.href = croppedUrl;
    a.download = `${fileName}-cropped.png`;
    a.click();
  };

  const reset = () => { setImage(null); setCroppedUrl(null); setFileName(''); };

  return (
    <div className="space-y-6">
      {!image && (
        <div
          onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors"
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">Drop your image here or click to upload</p>
          <p className="text-sm text-slate-500">Supports JPEG, PNG, WebP</p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      )}

      {image && !croppedUrl && (
        <>
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3">
            <span className="text-xs font-medium text-slate-500 mr-2">Aspect Ratio:</span>
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => setAspectRatio(p.ratio)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${aspectRatio === p.ratio ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>
                {p.label}
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              <button onClick={doCrop} className="px-4 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-xs font-medium transition-colors">
                <Crop className="w-3.5 h-3.5 inline mr-1" /> Crop
              </button>
              <button onClick={reset} className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset
              </button>
            </div>
          </div>

          <div ref={containerRef} className="relative inline-block mx-auto max-w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 select-none">
            <img ref={imgRef} src={image} alt="Source" onLoad={onImageLoad} className="block max-w-full max-h-[500px] object-contain" draggable={false} />
            {imgDimensions.w > 0 && (
              <>
                {/* Dark overlay outside crop */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5))`, clipPath: `polygon(0 0,100% 0,100% 100%,0 100%,0 0,${cropArea.x}px ${cropArea.y}px,${cropArea.x}px ${cropArea.y + cropArea.h}px,${cropArea.x + cropArea.w}px ${cropArea.y + cropArea.h}px,${cropArea.x + cropArea.w}px ${cropArea.y}px,${cropArea.x}px ${cropArea.y}px)` }} />
                {/* Crop selection */}
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'move')}
                  className="absolute border-2 border-white cursor-move"
                  style={{ left: cropArea.x, top: cropArea.y, width: cropArea.w, height: cropArea.h }}
                >
                  {/* Grid lines */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/40" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/40" />
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white/40" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-white/40" />
                  </div>
                  {/* Resize handle */}
                  <div onMouseDown={(e) => handleMouseDown(e, 'resize')} className="absolute -right-2 -bottom-2 w-5 h-5 bg-white border-2 border-primary-600 rounded-sm cursor-se-resize" />
                  {/* Size indicator */}
                  <div className="absolute -top-7 left-0 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded whitespace-nowrap">
                    {Math.round(cropArea.w * (imgDimensions.natW / imgDimensions.w))} x {Math.round(cropArea.h * (imgDimensions.natH / imgDimensions.h))}px
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {croppedUrl && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cropped Result</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleDownload} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors">
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span> PNG
              </button>
              <button onClick={() => setCroppedUrl(null)} className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium transition-colors">
                Crop Again
              </button>
              <button onClick={reset} className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">New Image</button>
            </div>
          </div>
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden inline-block" style={{ backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%)', backgroundSize: '16px 16px' }}>
            <img src={croppedUrl} alt="Cropped" className="max-w-full max-h-96 object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
