'use client';

import { useState, useRef, useCallback } from 'react';
import { ImageDown, Upload, Download, RotateCcw, Loader2, Info, CheckCircle } from 'lucide-react';

interface CompressionResult {
  blob: Blob;
  url: string;
  sizeKB: number;
  quality: number;
  iterations: number;
  reduction: number;
}

export function CompressImageToKbTool() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [targetKB, setTargetKB] = useState<number>(100);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError('Please upload a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('File size must be under 25 MB.');
      return;
    }
    setError('');
    setResult(null);
    setOriginalFile(file);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setOriginalUrl(URL.createObjectURL(file));
  }, [originalUrl]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const compress = useCallback(async () => {
    if (!originalFile || !canvasRef.current) return;
    if (targetKB < 1 || targetKB > 50000) {
      setError('Target size must be between 1 KB and 50,000 KB.');
      return;
    }

    setCompressing(true);
    setError('');
    setIteration(0);

    const img = new Image();
    img.src = originalUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
    });

    const canvas = canvasRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    const targetBytes = targetKB * 1024;
    let low = 0.01;
    let high = 1.0;
    let bestBlob: Blob | null = null;
    let bestQuality = 0.5;
    let bestDiff = Infinity;
    let iterCount = 0;

    for (let i = 0; i < 20; i++) {
      iterCount = i + 1;
      setIteration(iterCount);
      const mid = (low + high) / 2;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Compression failed'))),
          'image/jpeg',
          mid
        );
      });

      const diff = Math.abs(blob.size - targetBytes);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestBlob = blob;
        bestQuality = mid;
      }

      if (blob.size > targetBytes) {
        high = mid;
      } else if (blob.size < targetBytes) {
        low = mid;
      }

      // Close enough: within 1% of target or within 0.5 KB
      if (diff < targetBytes * 0.01 || diff < 512) break;

      // Allow a brief pause so UI updates
      await new Promise((r) => setTimeout(r, 20));
    }

    if (!bestBlob) {
      setError('Compression failed. Try a different target size.');
      setCompressing(false);
      return;
    }

    const sizeKB = bestBlob.size / 1024;
    const reduction = ((originalFile.size - bestBlob.size) / originalFile.size) * 100;

    setResult({
      blob: bestBlob,
      url: URL.createObjectURL(bestBlob),
      sizeKB,
      quality: bestQuality,
      iterations: iterCount,
      reduction,
    });
    setCompressing(false);
  }, [originalFile, originalUrl, targetKB]);

  const downloadResult = useCallback(() => {
    if (!result || !originalFile) return;
    const a = document.createElement('a');
    a.href = result.url;
    const baseName = originalFile.name.replace(/\.[^.]+$/, '');
    a.download = `${baseName}-${Math.round(result.sizeKB)}kb.jpg`;
    a.click();
  }, [result, originalFile]);

  const reset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setOriginalFile(null);
    setOriginalUrl('');
    setResult(null);
    setError('');
    setIteration(0);
    setCompressing(false);
    if (inputRef.current) inputRef.current.value = '';
  }, [originalUrl, result]);

  const originalSizeKB = originalFile ? (originalFile.size / 1024).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Upload Area */}
      {!originalFile && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 p-10 sm:p-14 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Upload className="w-10 h-10 text-indigo-500" />
          <p className="text-center text-slate-600 dark:text-slate-400 font-medium">
            Drag & drop your image here or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
          </p>
          <p className="text-xs text-slate-400">JPG, PNG, WebP — max 25 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Preview + Controls */}
      {originalFile && !result && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-5 p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <img
              src={originalUrl}
              alt="Original preview"
              className="w-full sm:w-40 h-40 object-contain rounded-xl bg-slate-100 dark:bg-slate-900 shrink-0"
            />
            <div className="flex-1 space-y-3">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{originalFile.name}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  Original size: <strong className="text-slate-700 dark:text-slate-300">{originalSizeKB} KB</strong>
                </p>
              </div>

              <div>
                <label htmlFor="targetKB" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Target file size (KB)
                </label>
                <div className="flex gap-3">
                  <input
                    id="targetKB"
                    name="targetKB"
                    type="number"
                    min={1}
                    max={50000}
                    value={targetKB}
                    onChange={(e) => setTargetKB(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full sm:w-40 px-4 py-2.5 text-base rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    placeholder="e.g. 100"
                  />
                  <button
                    onClick={compress}
                    disabled={compressing}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
                  >
                    {compressing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageDown className="w-4 h-4" />}
                    Compress
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[20, 50, 100, 200, 500].map((kb) => (
                  <button
                    key={kb}
                    onClick={() => setTargetKB(kb)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                      targetKB === kb
                        ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-600 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {kb} KB
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Choose a different image
          </button>
        </div>
      )}

      {/* Compressing Progress */}
      {compressing && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 className="w-9 h-9 text-indigo-600 animate-spin" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Compressing to {targetKB} KB... iteration {iteration}/20
          </p>
          <div className="w-56 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-200"
              style={{ width: `${(iteration / 20) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>
      )}

      {/* Result */}
      {result && originalFile && (
        <div className="space-y-5">
          <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Compression Complete</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={result.url}
                alt="Compressed preview"
                className="w-full sm:w-48 h-48 object-contain rounded-xl bg-slate-100 dark:bg-slate-900 shrink-0"
              />
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <p className="text-xs text-slate-500 mb-0.5">Original Size</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{originalSizeKB} KB</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-xs text-green-600 dark:text-green-400 mb-0.5">Compressed Size</p>
                    <p className="font-bold text-green-700 dark:text-green-300">{result.sizeKB.toFixed(1)} KB</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <p className="text-xs text-slate-500 mb-0.5">Target Size</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{targetKB} KB</p>
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-0.5">Reduction</p>
                    <p className="font-bold text-indigo-700 dark:text-indigo-300">
                      {result.reduction > 0 ? `-${result.reduction.toFixed(1)}%` : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Quality: <strong className="text-slate-700 dark:text-slate-300">{(result.quality * 100).toFixed(1)}%</strong></span>
                  <span>Iterations: <strong className="text-slate-700 dark:text-slate-300">{result.iterations}</strong></span>
                  <span>Format: <strong className="text-slate-700 dark:text-slate-300">JPEG</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={downloadResult}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Download Compressed Image
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Compress Another Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Info className="w-5 h-5 text-indigo-500" />
          <h3 className="font-semibold">How Compress Image to Exact KB Works</h3>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <p>
            This tool lets you compress any image to an exact target file size in KB. Whether you need to compress an image to 50 KB, 100 KB, or 200 KB for form uploads, email attachments, or website requirements, this tool finds the precise JPEG quality setting to match your target.
          </p>
          <p>
            <strong>How it works:</strong> The tool uses a binary search algorithm on the JPEG quality parameter (ranging from 1% to 100%). It draws your image on an HTML5 Canvas and repeatedly exports it with different quality values, narrowing down in up to 20 iterations to find the quality that produces a file size closest to your target KB.
          </p>
          <p>
            <strong>Privacy:</strong> All processing happens entirely in your browser. Your images are never uploaded to any server.
          </p>
        </div>
      </div>
    </div>
  );
}
