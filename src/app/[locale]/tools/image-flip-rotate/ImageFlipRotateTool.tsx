'use client';
import { useState, useRef, useCallback } from 'react';
import { FlipHorizontal2, FlipVertical2, RotateCcw, RotateCw, Download, RotateCcw as Reset, ImageIcon, Loader2 } from 'lucide-react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { downloadBlob } from '@/lib/utils';

interface ProcessedImage {
  objectUrl: string;
  name: string;
  blob: Blob;
}

type TransformState = {
  flipH: boolean;
  flipV: boolean;
  angle: number; // degrees: 0, 90, 180, 270, or custom
};

function applyTransformToCanvas(
  img: HTMLImageElement,
  transform: TransformState
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const radians = (transform.angle * Math.PI) / 180;
    const absCos = Math.abs(Math.cos(radians));
    const absSin = Math.abs(Math.sin(radians));
    canvas.width = Math.round(img.naturalWidth * absCos + img.naturalHeight * absSin);
    canvas.height = Math.round(img.naturalWidth * absSin + img.naturalHeight * absCos);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(radians);
    if (transform.flipH) ctx.scale(-1, 1);
    if (transform.flipV) ctx.scale(1, -1);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    canvas.toBlob(
      (blob) => { if (blob) resolve(blob); else reject(new Error('Canvas conversion failed')); },
      'image/png'
    );
  });
}

export function ImageFlipRotateTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [transform, setTransform] = useState<TransformState>({ flipH: false, flipV: false, angle: 0 });
  const [customAngle, setCustomAngle] = useState(0);
  const [useCustomAngle, setUseCustomAngle] = useState(false);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const effectiveAngle = useCustomAngle ? customAngle : transform.angle;

  const processImages = useCallback(async (filesToProcess: File[], t: TransformState, custom: number, isCustom: boolean) => {
    setLoading(true);
    setError('');
    const angle = isCustom ? custom : t.angle;
    const processed: ProcessedImage[] = [];
    for (const file of filesToProcess) {
      try {
        const url = URL.createObjectURL(file);
        const img = new Image();
        await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = url; });
        const blob = await applyTransformToCanvas(img, { ...t, angle });
        URL.revokeObjectURL(url);
        const ext = file.name.replace(/\.[^.]+$/, '');
        processed.push({ objectUrl: URL.createObjectURL(blob), name: `${ext}-edited.png`, blob });
      } catch (e) {
        setError(`Failed to process "${file.name}": ${(e as Error).message}`);
      }
    }
    setResults(processed);
    setLoading(false);
  }, []);

  function handleFiles(incoming: File[]) {
    setFiles(incoming);
    setResults([]);
    processImages(incoming, transform, customAngle, useCustomAngle);
  }

  function applyTransform(update: Partial<TransformState>, newCustom?: number, newIsCustom?: boolean) {
    const next = { ...transform, ...update };
    setTransform(next);
    const nextCustom = newCustom !== undefined ? newCustom : customAngle;
    const nextIsCustom = newIsCustom !== undefined ? newIsCustom : useCustomAngle;
    if (newCustom !== undefined) setCustomAngle(newCustom);
    if (newIsCustom !== undefined) setUseCustomAngle(newIsCustom);
    if (files.length > 0) processImages(files, next, nextCustom, nextIsCustom);
  }

  function rotate90CW() {
    setUseCustomAngle(false);
    const next = { ...transform, angle: (transform.angle + 90) % 360 };
    setTransform(next);
    if (files.length > 0) processImages(files, next, customAngle, false);
  }

  function rotate90CCW() {
    setUseCustomAngle(false);
    const next = { ...transform, angle: (transform.angle - 90 + 360) % 360 };
    setTransform(next);
    if (files.length > 0) processImages(files, next, customAngle, false);
  }

  function resetAll() {
    results.forEach(r => URL.revokeObjectURL(r.objectUrl));
    setFiles([]);
    setResults([]);
    setTransform({ flipH: false, flipV: false, angle: 0 });
    setCustomAngle(0);
    setUseCustomAngle(false);
    setError('');
  }

  const btnBase = 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border';
  const btnActive = 'bg-primary-800 text-white border-primary-800';
  const btnInactive = 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700';

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Flip</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => applyTransform({ flipH: !transform.flipH })} className={`${btnBase} ${transform.flipH ? btnActive : btnInactive}`}>
              <FlipHorizontal2 className="w-4 h-4" /> Flip Horizontal
            </button>
            <button onClick={() => applyTransform({ flipV: !transform.flipV })} className={`${btnBase} ${transform.flipV ? btnActive : btnInactive}`}>
              <FlipVertical2 className="w-4 h-4" /> Flip Vertical
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Rotate</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={rotate90CCW} className={`${btnBase} ${btnInactive}`}>
              <RotateCcw className="w-4 h-4" /> 90° Left
            </button>
            <button onClick={rotate90CW} className={`${btnBase} ${btnInactive}`}>
              <RotateCw className="w-4 h-4" /> 90° Right
            </button>
            {[180].map(deg => (
              <button key={deg} onClick={() => { setUseCustomAngle(false); const next = { ...transform, angle: deg }; setTransform(next); if (files.length > 0) processImages(files, next, customAngle, false); }} className={`${btnBase} ${!useCustomAngle && transform.angle === deg ? btnActive : btnInactive}`}>
                180°
              </button>
            ))}
            <button onClick={() => { setUseCustomAngle(false); const next = { ...transform, angle: 0 }; setTransform(next); if (files.length > 0) processImages(files, next, customAngle, false); }} className={`${btnBase} ${!useCustomAngle && transform.angle === 0 ? btnActive : btnInactive}`}>
              0°
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Custom Angle</p>
            <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{customAngle}°</span>
          </div>
          <input
            type="range" min={-180} max={180} step={1} value={customAngle}
            onChange={e => { const v = parseInt(e.target.value); setCustomAngle(v); setUseCustomAngle(true); if (files.length > 0) processImages(files, transform, v, true); }}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>-180°</span><span>0°</span><span>+180°</span></div>
        </div>

        <div className="pt-1 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-primary-100 dark:bg-primary-900 border border-primary-300 dark:border-primary-700" />
            Active: Flip H={transform.flipH ? 'Yes' : 'No'}, Flip V={transform.flipV ? 'Yes' : 'No'}, Angle={effectiveAngle}°
          </span>
        </div>
      </div>

      {/* Upload */}
      {files.length === 0 && (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,.jpg,.jpeg,.png,.webp,.gif,.bmp"
          multiple
          maxSizeMB={20}
          onFiles={handleFiles}
          description="JPG, PNG, WebP, GIF, BMP — up to 20MB each — supports multiple files"
        />
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Applying transform…</p>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

      {/* Results */}
      {results.length > 0 && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100">Result{results.length > 1 ? `s (${results.length})` : ''}</h3>
            <div className="flex gap-2">
              {results.length > 1 && (
                <button onClick={() => results.forEach(r => downloadBlob(r.blob, r.name))} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-800 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download All
                </button>
              )}
              <button onClick={resetAll} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Reset className="w-3.5 h-3.5" /> New Upload
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {results.map((r, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="relative bg-slate-100 dark:bg-slate-900 flex items-center justify-center min-h-[180px]">
                  {/* Checkerboard pattern for transparency */}
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-conic-gradient(#cbd5e1 0% 25%, transparent 0% 50%)', backgroundSize: '16px 16px' }} />
                  <img src={r.objectUrl} alt={r.name} className="relative max-h-[280px] max-w-full object-contain" />
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{r.name}</p>
                  <button onClick={() => downloadBlob(r.blob, r.name)} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-primary-800 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors">
                    <Download className="w-3.5 h-3.5" /> Save PNG
                  </button>
                </div>
              </div>
            ))}
          </div>
          {files.length > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Tip: Adjust flip/rotate controls above and results update instantly.
            </p>
          )}
        </div>
      )}

      {/* Empty state when files loaded but no results yet */}
      {files.length === 0 && results.length === 0 && !loading && (
        <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
          <ImageIcon className="w-10 h-10" />
          <p className="text-sm">Upload images to flip or rotate them</p>
        </div>
      )}
    </div>
  );
}
