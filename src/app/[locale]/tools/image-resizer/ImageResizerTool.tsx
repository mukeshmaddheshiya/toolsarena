'use client';
import { useState, useRef, useCallback } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { downloadBlob, formatFileSize } from '@/lib/utils';
import { Link, Unlink, Maximize2, RotateCcw } from 'lucide-react';

const PRESETS = [
  { label: 'HD 1280×720', w: 1280, h: 720 },
  { label: 'Full HD 1920×1080', w: 1920, h: 1080 },
  { label: 'Instagram 1080×1080', w: 1080, h: 1080 },
  { label: 'Twitter 1200×675', w: 1200, h: 675 },
  { label: 'Thumbnail 300×300', w: 300, h: 300 },
  { label: 'Profile 400×400', w: 400, h: 400 },
];

export function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockAspect, setLockAspect] = useState(true);
  const [preview, setPreview] = useState('');
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState(90);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFiles(files: File[]) {
    const f = files[0];
    setFile(f);
    setResultBlob(null);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setOriginalDims({ w: img.width, h: img.height });
      setWidth(String(img.width));
      setHeight(String(img.height));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function handleWidthChange(val: string) {
    setWidth(val);
    if (lockAspect && originalDims.w && val) {
      const ratio = originalDims.h / originalDims.w;
      setHeight(String(Math.round(parseInt(val) * ratio)));
    }
  }

  function handleHeightChange(val: string) {
    setHeight(val);
    if (lockAspect && originalDims.h && val) {
      const ratio = originalDims.w / originalDims.h;
      setWidth(String(Math.round(parseInt(val) * ratio)));
    }
  }

  function applyPreset(w: number, h: number) {
    setWidth(String(w));
    setHeight(String(h));
    setLockAspect(false);
  }

  function resize() {
    if (!file) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const w = parseInt(width);
    const h = parseInt(height);
    if (!w || !h) return;
    canvas.width = w;
    canvas.height = h;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => {
        if (!blob) return;
        setResultBlob(blob);
        setResultSize(blob.size);
        const previewUrl = URL.createObjectURL(blob);
        setPreview(previewUrl);
      }, format, quality / 100);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function download() {
    if (!resultBlob || !file) return;
    const ext = format.split('/')[1];
    downloadBlob(resultBlob, `resized-${file.name.split('.')[0]}.${ext}`);
  }

  function reset() {
    setFile(null);
    setPreview('');
    setResultBlob(null);
    setWidth('');
    setHeight('');
  }

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="sr-only" />

      {!file ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp"
          multiple={false}
          maxSizeMB={20}
          onFiles={handleFiles}
          description="JPEG, PNG, WebP — max 20MB"
        />
      ) : (
        <div className="space-y-4">
          {/* File info */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{file.name}</span>
            <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
              <span>{originalDims.w}×{originalDims.h}px</span>
              <span>{formatFileSize(file.size)}</span>
              <button onClick={reset} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 ml-1"><RotateCcw className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* Presets */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => applyPreset(p.w, p.h)} className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors">
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Width (px)</label>
              <input type="number" value={width} onChange={e => handleWidthChange(e.target.value)} min={1} max={8000} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
            </div>
            <button onClick={() => setLockAspect(!lockAspect)} className={`mt-5 p-2 rounded-lg border transition-colors ${lockAspect ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`} title={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}>
              {lockAspect ? <Link className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
            </button>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Height (px)</label>
              <input type="number" value={height} onChange={e => handleHeightChange(e.target.value)} min={1} max={8000} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
            </div>
          </div>

          {/* Format + Quality */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Output Format</label>
              <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {([['image/jpeg', 'JPEG'], ['image/png', 'PNG'], ['image/webp', 'WebP']] as const).map(([v, l]) => (
                  <button key={v} onClick={() => setFormat(v)} className={`flex-1 py-2 text-sm font-medium transition-colors ${format === v ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400'}`}>{l}</button>
                ))}
              </div>
            </div>
            {format !== 'image/png' && (
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Quality</label>
                  <span className="text-xs font-bold text-primary-700 dark:text-primary-400">{quality}%</span>
                </div>
                <input type="range" min={10} max={100} step={5} value={quality} onChange={e => setQuality(parseInt(e.target.value))} className="w-full accent-primary-800" />
              </div>
            )}
          </div>

          <button onClick={resize} className="flex items-center gap-2 px-5 py-2.5 bg-primary-800 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
            <Maximize2 className="w-4 h-4" /> Resize Image
          </button>

          {/* Result */}
          {preview && resultBlob && (
            <div className="space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <img src={preview} alt="Resized preview" className="max-h-64 object-contain" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {width}×{height}px · {formatFileSize(resultSize)}
                </span>
                <DownloadButton onClick={download} label="Download Resized Image" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
