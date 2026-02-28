'use client';
import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize, downloadBlob } from '@/lib/utils';
import { ImageDown, RotateCcw, Loader2 } from 'lucide-react';

interface CompressedResult {
  file: File;
  originalFile: File;
  objectUrl: string;
  originalUrl: string;
  savings: number;
}

export function ImageCompressorTool() {
  const [quality, setQuality] = useState(80);
  const [maxWidthHeight, setMaxWidthHeight] = useState(1920);
  const [results, setResults] = useState<CompressedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const processFiles = useCallback(async (files: File[]) => {
    setLoading(true);
    setError('');
    setResults([]);
    const processed: CompressedResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(Math.round(((i) / files.length) * 100));
      try {
        const options = {
          maxSizeMB: 10,
          maxWidthOrHeight: maxWidthHeight,
          useWebWorker: true,
          fileType: file.type as string,
          initialQuality: quality / 100,
          onProgress: (p: number) => setProgress(Math.round((i / files.length + p / 100 / files.length) * 100)),
        };
        const compressed = await imageCompression(file, options);
        const savings = ((file.size - compressed.size) / file.size) * 100;
        processed.push({
          file: compressed,
          originalFile: file,
          objectUrl: URL.createObjectURL(compressed),
          originalUrl: URL.createObjectURL(file),
          savings,
        });
      } catch (e) {
        setError(`Failed to compress "${file.name}": ${(e as Error).message}`);
      }
    }
    setResults(processed);
    setProgress(100);
    setLoading(false);
  }, [quality, maxWidthHeight]);

  function reset() {
    results.forEach(r => { URL.revokeObjectURL(r.objectUrl); URL.revokeObjectURL(r.originalUrl); });
    setResults([]);
    setError('');
    setProgress(0);
  }

  function downloadAll() {
    results.forEach(r => downloadBlob(r.file, `compressed-${r.file.name}`));
  }

  return (
    <div className="space-y-5">
      {/* Settings */}
      <div className="grid sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quality</label>
            <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{quality}%</span>
          </div>
          <input type="range" min={10} max={100} step={5} value={quality} onChange={e => setQuality(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Smaller file</span><span>Better quality</span></div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Max Dimension</label>
            <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{maxWidthHeight}px</span>
          </div>
          <input type="range" min={480} max={4096} step={240} value={maxWidthHeight} onChange={e => setMaxWidthHeight(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
        </div>
      </div>

      {/* Upload */}
      {results.length === 0 && !loading && (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
          multiple
          maxSizeMB={20}
          onFiles={processFiles}
          description="JPEG, PNG, WebP, GIF — max 20MB each — up to 20 files"
        />
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Compressing... {progress}%</p>
          <div className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary-700 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100">Compressed Images ({results.length})</h3>
            <div className="flex gap-2">
              {results.length > 1 && <button onClick={downloadAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-800 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"><ImageDown className="w-3.5 h-3.5" />Download All</button>}
              <button onClick={reset} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"><RotateCcw className="w-3.5 h-3.5" />New Upload</button>
            </div>
          </div>
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <img src={r.objectUrl} alt={r.file.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate">{r.originalFile.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-slate-500">Original: <strong>{formatFileSize(r.originalFile.size)}</strong></span>
                    <span className="text-slate-400">→</span>
                    <span className="text-green-600 dark:text-green-400">Compressed: <strong>{formatFileSize(r.file.size)}</strong></span>
                    <span className={`font-bold px-1.5 py-0.5 rounded-full text-xs ${r.savings > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600'}`}>
                      {r.savings > 0 ? `-${r.savings.toFixed(0)}%` : 'No reduction'}
                    </span>
                  </div>
                </div>
                <DownloadButton onClick={() => downloadBlob(r.file, `compressed-${r.file.name}`)} label="Download" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
