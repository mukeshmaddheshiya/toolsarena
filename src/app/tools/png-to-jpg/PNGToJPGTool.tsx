'use client';
import { useState, useRef, useCallback } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { downloadBlob, formatFileSize } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';

interface ConvResult { blob: Blob; name: string; originalSize: number; newSize: number; previewUrl: string; }

export function PNGToJPGTool() {
  const [quality, setQuality] = useState(85);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [results, setResults] = useState<ConvResult[]>([]);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const convertFile = useCallback((file: File): Promise<ConvResult> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, img.width, img.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
          if (!blob) { reject(new Error('Conversion failed')); return; }
          const name = file.name.replace(/\.png$/i, '.jpg');
          resolve({ blob, name, originalSize: file.size, newSize: blob.size, previewUrl: URL.createObjectURL(blob) });
          URL.revokeObjectURL(url);
        }, 'image/jpeg', quality / 100);
      };
      img.onerror = reject;
      img.src = url;
    });
  }, [quality, bgColor]);

  async function handleFiles(files: File[]) {
    setLoading(true);
    setResults([]);
    const res: ConvResult[] = [];
    for (const file of files) {
      try { res.push(await convertFile(file)); } catch { /* skip */ }
    }
    setResults(res);
    setLoading(false);
  }

  function reset() {
    results.forEach(r => URL.revokeObjectURL(r.previewUrl));
    setResults([]);
  }

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="sr-only" />

      {/* Settings */}
      <div className="grid sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">JPG Quality</label>
            <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{quality}%</span>
          </div>
          <input type="range" min={10} max={100} step={5} value={quality} onChange={e => setQuality(parseInt(e.target.value))} className="w-full accent-primary-800" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Background Color (replaces transparency)</label>
          <div className="flex items-center gap-3">
            {['#ffffff', '#000000', '#f3f4f6', '#1e293b'].map(c => (
              <button key={c} onClick={() => setBgColor(c)} style={{ backgroundColor: c }} className={`w-8 h-8 rounded-lg border-2 transition-all ${bgColor === c ? 'border-primary-500 scale-110' : 'border-slate-300 dark:border-slate-600'}`} title={c} />
            ))}
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0" title="Custom color" />
          </div>
        </div>
      </div>

      {results.length === 0 && !loading ? (
        <FileDropzone accept=".png,image/png" multiple maxSizeMB={20} onFiles={handleFiles} description="PNG files only — max 20MB each — batch convert up to 20 files" />
      ) : loading ? (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400">Converting...</div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100">Converted Files ({results.length})</h3>
            <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"><RotateCcw className="w-3.5 h-3.5" />New Conversion</button>
          </div>
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <img src={r.previewUrl} alt={r.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate">{r.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(r.originalSize)} PNG → {formatFileSize(r.newSize)} JPG</p>
              </div>
              <DownloadButton onClick={() => downloadBlob(r.blob, r.name)} label="Download JPG" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
