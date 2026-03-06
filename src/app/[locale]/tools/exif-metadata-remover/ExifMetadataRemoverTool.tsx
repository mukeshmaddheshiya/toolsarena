'use client';
import { useState, useCallback, useRef } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize, downloadBlob } from '@/lib/utils';
import { ShieldCheck, Trash2, RotateCcw, Loader2, ImageDown, Info, Download } from 'lucide-react';

interface ProcessedImage {
  originalFile: File;
  cleanedBlob: Blob;
  originalUrl: string;
  cleanedUrl: string;
  width: number;
  height: number;
  hasExif: boolean;
  sizeDiff: number;
}

function detectExif(buffer: ArrayBuffer): boolean {
  const view = new DataView(buffer);
  if (view.byteLength < 4) return false;
  // JPEG: check for APP1 marker (0xFFE1) containing "Exif"
  if (view.getUint8(0) === 0xFF && view.getUint8(1) === 0xD8) {
    let offset = 2;
    while (offset < view.byteLength - 4) {
      if (view.getUint8(offset) !== 0xFF) break;
      const marker = view.getUint8(offset + 1);
      if (marker === 0xE1) {
        const segLen = view.getUint16(offset + 2);
        if (offset + 4 + 4 <= view.byteLength) {
          const exifStr = String.fromCharCode(
            view.getUint8(offset + 4), view.getUint8(offset + 5),
            view.getUint8(offset + 6), view.getUint8(offset + 7)
          );
          if (exifStr === 'Exif') return true;
        }
        offset += 2 + segLen;
      } else if (marker === 0xDA) {
        break; // start of scan
      } else {
        const segLen = view.getUint16(offset + 2);
        offset += 2 + segLen;
      }
    }
  }
  return false;
}

function stripViaCanvas(
  img: HTMLImageElement, format: string, quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Canvas not supported'));
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('Export failed')),
      format === 'png' ? 'image/png' : 'image/jpeg',
      format === 'png' ? undefined : quality
    );
  });
}

export function ExifMetadataRemoverTool() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [quality, setQuality] = useState(92);
  const processingRef = useRef(false);

  const processFiles = useCallback(async (files: File[]) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setLoading(true);
    setError('');
    setImages([]);
    const results: ProcessedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      setProgress(Math.round((i / files.length) * 100));
      const file = files[i];
      try {
        const buffer = await file.arrayBuffer();
        const hasExif = detectExif(buffer);

        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = () => reject(new Error(`Failed to load "${file.name}"`));
          el.src = URL.createObjectURL(file);
        });

        const cleanedBlob = await stripViaCanvas(img, outputFormat, quality / 100);
        const originalUrl = URL.createObjectURL(file);
        const cleanedUrl = URL.createObjectURL(cleanedBlob);
        const sizeDiff = file.size - cleanedBlob.size;

        results.push({
          originalFile: file, cleanedBlob, originalUrl, cleanedUrl,
          width: img.naturalWidth, height: img.naturalHeight,
          hasExif, sizeDiff,
        });
      } catch (e) {
        setError(`Error processing "${file.name}": ${(e as Error).message}`);
      }
    }

    setImages(results);
    setProgress(100);
    setLoading(false);
    processingRef.current = false;
  }, [outputFormat, quality]);

  function reset() {
    images.forEach(r => { URL.revokeObjectURL(r.originalUrl); URL.revokeObjectURL(r.cleanedUrl); });
    setImages([]);
    setError('');
    setProgress(0);
  }

  function downloadAll() {
    images.forEach(r => {
      const ext = outputFormat === 'png' ? 'png' : 'jpg';
      const name = r.originalFile.name.replace(/\.[^.]+$/, '') + `-clean.${ext}`;
      downloadBlob(r.cleanedBlob, name);
    });
  }

  const ext = outputFormat === 'png' ? 'png' : 'jpg';

  return (
    <div className="space-y-5">
      {/* Hero banner */}
      <div className="rounded-xl bg-gradient-to-r from-red-600 to-pink-600 p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-7 h-7" />
          <h2 className="text-lg font-heading font-bold">Protect Your Privacy</h2>
        </div>
        <p className="text-sm text-red-100">
          Remove hidden EXIF metadata from your images — camera info, GPS location, timestamps, and more. All processing happens in your browser. Images never leave your device.
        </p>
      </div>

      {/* Settings */}
      <div className="grid sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Output Format</label>
          <div className="flex gap-2">
            {(['jpeg', 'png'] as const).map(fmt => (
              <button key={fmt} onClick={() => setOutputFormat(fmt)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  outputFormat === fmt
                    ? 'bg-primary-800 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}>
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {outputFormat === 'jpeg' && (
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">JPEG Quality</label>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{quality}%</span>
            </div>
            <input type="range" min={70} max={100} step={1} value={quality}
              onChange={e => setQuality(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800" />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Smaller file</span><span>Better quality</span>
            </div>
          </div>
        )}
      </div>

      {/* Upload */}
      {images.length === 0 && !loading && (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          multiple
          maxSizeMB={20}
          onFiles={processFiles}
          description="JPEG, PNG, WebP — max 20 MB each — multiple files supported"
        />
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="w-10 h-10 text-primary-700 animate-spin" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Stripping metadata... {progress}%</p>
          <div className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

      {/* Results */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-heading font-semibold text-slate-900 dark:text-slate-100">
              Cleaned Images ({images.length})
            </h3>
            <div className="flex gap-2">
              {images.length > 1 && (
                <button onClick={downloadAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-800 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                  <ImageDown className="w-3.5 h-3.5" />Download All
                </button>
              )}
              <button onClick={reset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />New Upload
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {images.map((r, i) => {
              const cleanName = r.originalFile.name.replace(/\.[^.]+$/, '') + `-clean.${ext}`;
              return (
                <div key={i} className="p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  {/* Mobile: stacked layout */}
                  <div className="flex items-start gap-3">
                    <img src={r.cleanedUrl} alt={r.originalFile.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-700" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate">
                        {r.originalFile.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {r.width} x {r.height}px &middot; {r.originalFile.type.split('/')[1].toUpperCase()}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="text-xs text-slate-500">
                          {formatFileSize(r.originalFile.size)}
                        </span>
                        <span className="text-slate-400 text-xs">&rarr;</span>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {formatFileSize(r.cleanedBlob.size)}
                        </span>
                        {r.sizeDiff > 0 && (
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            -{formatFileSize(r.sizeDiff)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${
                          r.hasExif
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                          <Trash2 className="w-3 h-3" />
                          {r.hasExif ? 'EXIF removed' : 'No EXIF'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <ShieldCheck className="w-3 h-3" />Clean
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Download button — full width on mobile */}
                  <div className="mt-3">
                    <button onClick={() => downloadBlob(r.cleanedBlob, cleanName)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary-800 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          All processing happens in your browser using the Canvas API. Your images are never uploaded to any server and never leave your device. The cleaned image is re-encoded from pixel data, which inherently strips all embedded metadata including EXIF, IPTC, XMP, GPS coordinates, camera info, and timestamps.
        </p>
      </div>
    </div>
  );
}
