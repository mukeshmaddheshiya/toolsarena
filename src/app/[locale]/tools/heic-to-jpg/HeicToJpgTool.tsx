'use client';

import { useState, useCallback } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize, downloadBlob } from '@/lib/utils';
import { ImageDown, RotateCcw, Loader2, Check, X, FileImage, Settings, Archive } from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────────── */

type OutputFormat = 'jpeg' | 'png' | 'webp';

interface ConvertedFile {
  originalFile: File;
  originalUrl: string;
  convertedBlob: Blob;
  convertedUrl: string;
  convertedName: string;
  originalSize: number;
  convertedSize: number;
  width: number;
  height: number;
  status: 'success' | 'error';
  error?: string;
}

/* ── Component ─────────────────────────────────────────────────────── */

export function HeicToJpgTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ConvertedFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [error, setError] = useState('');

  // Settings
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpeg');
  const [quality, setQuality] = useState(92);
  const [autoConvert, setAutoConvert] = useState(true);

  const processFiles = useCallback(async (inputFiles: File[]) => {
    setError('');
    setConverting(true);
    setProgress(0);
    setResults([]);

    const converted: ConvertedFile[] = [];

    // Dynamic import heic2any (it's a large library, only load when needed)
    const heic2any = (await import('heic2any')).default;

    for (let i = 0; i < inputFiles.length; i++) {
      const file = inputFiles[i];
      setCurrentFile(file.name);
      setProgress(Math.round((i / inputFiles.length) * 100));

      try {
        const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : outputFormat === 'png' ? 'image/png' : 'image/webp';

        // Convert HEIC to target format
        const result = await heic2any({
          blob: file,
          toType: mimeType,
          quality: quality / 100,
        });

        // heic2any can return single blob or array (for multi-image HEIC)
        const blobs = Array.isArray(result) ? result : [result];

        for (let j = 0; j < blobs.length; j++) {
          const blob = blobs[j];
          const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
          const baseName = file.name.replace(/\.(heic|heif)$/i, '');
          const suffix = blobs.length > 1 ? `-${j + 1}` : '';
          const convertedName = `${baseName}${suffix}.${ext}`;

          // Get image dimensions
          const url = URL.createObjectURL(blob);
          const dims = await getImageDimensions(url);

          converted.push({
            originalFile: file,
            originalUrl: URL.createObjectURL(file),
            convertedBlob: blob,
            convertedUrl: url,
            convertedName,
            originalSize: file.size,
            convertedSize: blob.size,
            width: dims.width,
            height: dims.height,
            status: 'success',
          });
        }
      } catch (e) {
        // Check if it's not a HEIC file — try direct canvas conversion
        try {
          const bitmap = await createImageBitmap(file);
          const canvas = document.createElement('canvas');
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(bitmap, 0, 0);

          const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : outputFormat === 'png' ? 'image/png' : 'image/webp';
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(b => b ? resolve(b) : reject(new Error('Canvas conversion failed')), mimeType, quality / 100);
          });

          const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
          const baseName = file.name.replace(/\.[^.]+$/, '');

          converted.push({
            originalFile: file,
            originalUrl: URL.createObjectURL(file),
            convertedBlob: blob,
            convertedUrl: URL.createObjectURL(blob),
            convertedName: `${baseName}.${ext}`,
            originalSize: file.size,
            convertedSize: blob.size,
            width: bitmap.width,
            height: bitmap.height,
            status: 'success',
          });
        } catch {
          converted.push({
            originalFile: file,
            originalUrl: '',
            convertedBlob: new Blob(),
            convertedUrl: '',
            convertedName: '',
            originalSize: file.size,
            convertedSize: 0,
            width: 0,
            height: 0,
            status: 'error',
            error: `Failed to convert "${file.name}": ${(e as Error).message}`,
          });
        }
      }
    }

    setResults(converted);
    setProgress(100);
    setConverting(false);
    setCurrentFile('');
  }, [outputFormat, quality]);

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    if (autoConvert) {
      processFiles(newFiles);
    }
  }, [autoConvert, processFiles]);

  const downloadAll = () => {
    const successResults = results.filter(r => r.status === 'success');
    successResults.forEach(r => downloadBlob(r.convertedBlob, r.convertedName));
  };

  const downloadSingle = (result: ConvertedFile) => {
    downloadBlob(result.convertedBlob, result.convertedName);
  };

  const reset = () => {
    results.forEach(r => {
      if (r.convertedUrl) URL.revokeObjectURL(r.convertedUrl);
      if (r.originalUrl) URL.revokeObjectURL(r.originalUrl);
    });
    setFiles([]);
    setResults([]);
    setProgress(0);
    setError('');
    setConverting(false);
    setCurrentFile('');
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const totalSavedBytes = results.reduce((sum, r) => r.status === 'success' ? sum + (r.originalSize - r.convertedSize) : sum, 0);

  const formatLabels: Record<OutputFormat, { label: string; desc: string }> = {
    jpeg: { label: 'JPG', desc: 'Best for photos' },
    png: { label: 'PNG', desc: 'Lossless, transparent' },
    webp: { label: 'WebP', desc: 'Modern, smallest' },
  };

  return (
    <div className="space-y-5">
      {/* Settings panel — always visible */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-slate-100">Conversion Settings</h3>
        </div>

        {/* Output format */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Output Format</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(formatLabels) as OutputFormat[]).map(fmt => (
              <button
                key={fmt}
                onClick={() => setOutputFormat(fmt)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  outputFormat === fmt
                    ? 'bg-primary-800 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'
                }`}
              >
                <div className="font-bold">{formatLabels[fmt].label}</div>
                <div className={`text-xs mt-0.5 ${outputFormat === fmt ? 'text-primary-200' : 'text-slate-400'}`}>
                  {formatLabels[fmt].desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quality slider (not for PNG) */}
        {outputFormat !== 'png' && (
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quality</label>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{quality}%</span>
            </div>
            <input
              type="range" min={10} max={100} step={1}
              value={quality} onChange={e => setQuality(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>Smaller file</span><span>Best quality</span>
            </div>
          </div>
        )}

        {/* Auto-convert toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={autoConvert} onChange={e => setAutoConvert(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500" />
          <span className="text-sm text-slate-700 dark:text-slate-300">Auto-convert on upload</span>
        </label>
      </div>

      {/* Upload area */}
      {results.length === 0 && !converting && (
        <FileDropzone
          accept=".heic,.heif,image/heic,image/heif"
          multiple
          maxSizeMB={50}
          onFiles={handleFiles}
          description="HEIC, HEIF files — max 50MB each — batch upload supported"
        />
      )}

      {/* Converting progress */}
      {converting && (
        <div className="flex flex-col items-center gap-4 py-10">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary-700 animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-400">
              {progress}%
            </span>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Converting...</p>
            <p className="text-xs text-slate-400 mt-1 truncate max-w-[250px]">{currentFile}</p>
          </div>
          <div className="w-full max-w-md h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-600 to-primary-800 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !converting && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{successCount} converted</span>
              </div>
              {errorCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <X className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">{errorCount} failed</span>
                </div>
              )}
              {totalSavedBytes > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
                  Saved {formatFileSize(Math.abs(totalSavedBytes))}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {successCount > 1 && (
                <button onClick={downloadAll}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary-800 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                  <Archive className="w-4 h-4" /> Download All ({successCount})
                </button>
              )}
              <button onClick={reset}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> New Upload
              </button>
            </div>
          </div>

          {/* File list */}
          <div className="space-y-3">
            {results.map((result, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                result.status === 'success'
                  ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
              }`}>
                {/* Preview */}
                {result.status === 'success' && result.convertedUrl ? (
                  <img src={result.convertedUrl} alt={result.convertedName}
                    className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-700" />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 shrink-0">
                    <X className="w-6 h-6 text-red-400" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                    {result.status === 'success' ? result.convertedName : result.originalFile.name}
                  </p>
                  {result.status === 'success' ? (
                    <div className="flex items-center gap-3 mt-1 text-xs flex-wrap">
                      <span className="text-slate-500 dark:text-slate-400">
                        HEIC: <strong>{formatFileSize(result.originalSize)}</strong>
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="text-green-600 dark:text-green-400">
                        {outputFormat.toUpperCase()}: <strong>{formatFileSize(result.convertedSize)}</strong>
                      </span>
                      <span className="text-slate-400">{result.width}x{result.height}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{result.error}</p>
                  )}
                </div>

                {/* Download */}
                {result.status === 'success' && (
                  <DownloadButton onClick={() => downloadSingle(result)} label="Download" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual convert button when auto-convert is off */}
      {files.length > 0 && !autoConvert && results.length === 0 && !converting && (
        <button onClick={() => processFiles(files)}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-800 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">
          <FileImage className="w-5 h-5" />
          Convert {files.length} File{files.length > 1 ? 's' : ''}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>
      )}
    </div>
  );
}

/* ── Utility ──────────────────────────────────────────────────────── */

function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });
}
