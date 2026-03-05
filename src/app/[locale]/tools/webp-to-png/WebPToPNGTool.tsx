'use client';
import { useState, useRef, useCallback } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { downloadBlob, formatFileSize } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';

interface ConvResult { blob: Blob; name: string; originalSize: number; newSize: number; previewUrl: string; }

export function WebPToPNGTool() {
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
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
          if (!blob) { reject(new Error('Failed')); return; }
          const name = file.name.replace(/\.webp$/i, '.png');
          resolve({ blob, name, originalSize: file.size, newSize: blob.size, previewUrl: URL.createObjectURL(blob) });
          URL.revokeObjectURL(url);
        }, 'image/png');
      };
      img.onerror = reject;
      img.src = url;
    });
  }, []);

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
      {results.length === 0 && !loading ? (
        <FileDropzone accept=".webp,image/webp" multiple maxSizeMB={20} onFiles={handleFiles} description="WebP files only — max 20MB each — batch up to 20 files" />
      ) : loading ? (
        <div className="py-12 text-center text-slate-500">Converting WebP to PNG...</div>
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
                <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(r.originalSize)} WebP → {formatFileSize(r.newSize)} PNG</p>
              </div>
              <DownloadButton onClick={() => downloadBlob(r.blob, r.name)} label="Download PNG" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
