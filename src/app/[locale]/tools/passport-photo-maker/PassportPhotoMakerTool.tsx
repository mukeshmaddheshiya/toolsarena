'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, RotateCcw, Printer } from 'lucide-react';

const SIZES = [
  { label: 'India (2×2 in / 51×51 mm)', w: 600, h: 600, key: 'india' },
  { label: 'US (2×2 in / 51×51 mm)', w: 600, h: 600, key: 'us' },
  { label: 'UK (35×45 mm)', w: 413, h: 531, key: 'uk' },
  { label: 'EU / Schengen (35×45 mm)', w: 413, h: 531, key: 'eu' },
  { label: 'China (33×48 mm)', w: 390, h: 567, key: 'china' },
  { label: 'Japan (35×45 mm)', w: 413, h: 531, key: 'japan' },
  { label: 'Custom', w: 600, h: 600, key: 'custom' },
];

const BG_COLORS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Light Blue', value: '#dbeafe' },
  { label: 'Light Gray', value: '#f1f5f9' },
  { label: 'Red', value: '#fecaca' },
];

export function PassportPhotoMakerTool() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [sizeKey, setSizeKey] = useState('india');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [dragging, setDragging] = useState<'move' | 'resize' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cx: 0, cy: 0, cw: 0, ch: 0 });
  const [imgDims, setImgDims] = useState({ w: 0, h: 0, natW: 0, natH: 0 });
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [customW, setCustomW] = useState(600);
  const [customH, setCustomH] = useState(600);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedSize = SIZES.find(s => s.key === sizeKey)!;
  const outputW = sizeKey === 'custom' ? customW : selectedSize.w;
  const outputH = sizeKey === 'custom' ? customH : selectedSize.h;
  const aspectRatio = outputW / outputH;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setResultUrl(null);
    setFileName(file.name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onImageLoad = () => {
    if (!imgRef.current) return;
    const { width, height, naturalWidth, naturalHeight } = imgRef.current;
    setImgDims({ w: width, h: height, natW: naturalWidth, natH: naturalHeight });
    initCrop(width, height);
  };

  const initCrop = useCallback((imgW: number, imgH: number) => {
    let cw = Math.min(imgW * 0.75, imgH * 0.75 * aspectRatio);
    let ch = cw / aspectRatio;
    if (ch > imgH * 0.75) { ch = imgH * 0.75; cw = ch * aspectRatio; }
    setCropArea({ x: (imgW - cw) / 2, y: (imgH - ch) / 2, w: cw, h: ch });
  }, [aspectRatio]);

  useEffect(() => {
    if (imgDims.w > 0) initCrop(imgDims.w, imgDims.h);
  }, [aspectRatio, imgDims.w, imgDims.h, initCrop]);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

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
          x: clamp(dragStart.cx + dx, 0, imgDims.w - prev.w),
          y: clamp(dragStart.cy + dy, 0, imgDims.h - prev.h),
        }));
      } else {
        let nw = clamp(dragStart.cw + dx, 40, imgDims.w - dragStart.cx);
        let nh = nw / aspectRatio;
        if (dragStart.cy + nh > imgDims.h) {
          nh = imgDims.h - dragStart.cy;
          nw = nh * aspectRatio;
        }
        setCropArea(prev => ({ ...prev, w: nw, h: nh }));
      }
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging, dragStart, imgDims, aspectRatio]);

  const generatePhoto = () => {
    if (!imgRef.current) return;
    const scaleX = imgDims.natW / imgDims.w;
    const scaleY = imgDims.natH / imgDims.h;
    const canvas = document.createElement('canvas');
    canvas.width = outputW;
    canvas.height = outputH;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, outputW, outputH);
    ctx.drawImage(
      imgRef.current,
      cropArea.x * scaleX, cropArea.y * scaleY,
      cropArea.w * scaleX, cropArea.h * scaleY,
      0, 0, outputW, outputH
    );
    setResultUrl(canvas.toDataURL('image/jpeg', 0.95));
  };

  const generatePrintSheet = () => {
    if (!resultUrl) return;
    const img = new Image();
    img.onload = () => {
      // 4x6 inch print sheet at 300 DPI
      const sheetW = 1800;
      const sheetH = 1200;
      const canvas = document.createElement('canvas');
      canvas.width = sheetW;
      canvas.height = sheetH;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, sheetW, sheetH);

      const gap = 20;
      const photoW = outputW > 500 ? Math.round(outputW * 0.8) : outputW;
      const photoH = outputH > 500 ? Math.round(outputH * 0.8) : outputH;
      const cols = Math.floor((sheetW - gap) / (photoW + gap));
      const rows = Math.floor((sheetH - gap) / (photoH + gap));
      const startX = (sheetW - (cols * (photoW + gap) - gap)) / 2;
      const startY = (sheetH - (rows * (photoH + gap) - gap)) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.drawImage(img, startX + c * (photoW + gap), startY + r * (photoH + gap), photoW, photoH);
        }
      }

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/jpeg', 0.95);
      a.download = `${fileName}-passport-sheet.jpg`;
      a.click();
    };
    img.src = resultUrl;
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${fileName}-passport-${sizeKey}.jpg`;
    a.click();
  };

  const reset = () => { setImage(null); setResultUrl(null); setFileName(''); };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!image && (
        <div
          onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors"
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">Drop your photo here or click to upload</p>
          <p className="text-sm text-slate-500">Upload a clear, front-facing photo (JPEG or PNG)</p>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      )}

      {/* Editor */}
      {image && !resultUrl && (
        <>
          {/* Controls */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Photo Size</label>
                <select value={sizeKey} onChange={(e) => setSizeKey(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                  {SIZES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Background Color</label>
                <div className="flex gap-2">
                  {BG_COLORS.map(c => (
                    <button key={c.value} onClick={() => setBgColor(c.value)}
                      className={`w-8 h-8 rounded-lg border-2 transition-transform ${bgColor === c.value ? 'border-primary-500 scale-110' : 'border-slate-300 dark:border-slate-600 hover:scale-105'}`}
                      style={{ backgroundColor: c.value }} title={c.label} />
                  ))}
                </div>
              </div>
            </div>
            {sizeKey === 'custom' && (
              <div className="flex flex-wrap gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Width (px)</label>
                  <input type="number" min={100} max={2000} value={customW} onChange={(e) => setCustomW(Number(e.target.value))}
                    className="w-24 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Height (px)</label>
                  <input type="number" min={100} max={2000} value={customH} onChange={(e) => setCustomH(Number(e.target.value))}
                    className="w-24 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm" />
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button onClick={generatePhoto} className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors">
                Generate Photo
              </button>
              <button onClick={reset} className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <RotateCcw className="w-4 h-4 inline mr-1" /> <span className="hidden sm:inline">New Photo</span><span className="sm:hidden">New</span>
              </button>
            </div>
          </div>

          {/* Crop area */}
          <div className="relative inline-block mx-auto max-w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 select-none">
            <img ref={imgRef} src={image} alt="Source" onLoad={onImageLoad} className="block max-w-full max-h-[500px] object-contain" draggable={false} />
            {imgDims.w > 0 && (
              <>
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5))', clipPath: `polygon(0 0,100% 0,100% 100%,0 100%,0 0,${cropArea.x}px ${cropArea.y}px,${cropArea.x}px ${cropArea.y + cropArea.h}px,${cropArea.x + cropArea.w}px ${cropArea.y + cropArea.h}px,${cropArea.x + cropArea.w}px ${cropArea.y}px,${cropArea.x}px ${cropArea.y}px)` }} />
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'move')}
                  className="absolute border-2 border-white cursor-move"
                  style={{ left: cropArea.x, top: cropArea.y, width: cropArea.w, height: cropArea.h }}
                >
                  {/* Center guide lines */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30" />
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
                  </div>
                  <div onMouseDown={(e) => handleMouseDown(e, 'resize')} className="absolute -right-2 -bottom-2 w-5 h-5 bg-white border-2 border-primary-600 rounded-sm cursor-se-resize" />
                  <div className="absolute -top-7 left-0 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded whitespace-nowrap">
                    {outputW} x {outputH}px
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="text-xs text-slate-500 text-center">Drag to position the crop area. Align your face within the frame.</p>
        </>
      )}

      {/* Result */}
      {resultUrl && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Passport Photo</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleDownload} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors">
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span> Photo
              </button>
              <button onClick={generatePrintSheet} className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium transition-colors">
                <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Print</span> Sheet
              </button>
              <button onClick={() => setResultUrl(null)} className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Adjust</button>
              <button onClick={reset} className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">New Photo</button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden inline-block" style={{ backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%)', backgroundSize: '16px 16px' }}>
              <img src={resultUrl} alt="Passport photo" className="max-w-full max-h-80 object-contain" />
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center">Size: {outputW} x {outputH}px | Format: {selectedSize.label}</p>
        </div>
      )}
    </div>
  );
}
