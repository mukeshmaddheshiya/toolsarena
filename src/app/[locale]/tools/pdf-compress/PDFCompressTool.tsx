'use client';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { downloadBlob, formatFileSize } from '@/lib/utils';
import { Loader2, FileArchive, Info } from 'lucide-react';

export function PDFCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; savings: number } | null>(null);
  const [error, setError] = useState('');

  async function handleFiles(files: File[]) {
    setFile(files[0]);
    setResult(null);
    setError('');
  }

  async function compress() {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      // Re-save with optimized structure (removes unused objects, flattens references)
      const compressedBytes = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
      const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const savings = ((file.size - blob.size) / file.size) * 100;
      setResult({ blob, savings });
    } catch (e) {
      setError(`Failed to compress: ${(e as Error).message}. The PDF may be encrypted or corrupted.`);
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!result || !file) return;
    downloadBlob(result.blob, `compressed-${file.name}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Browser-based PDF optimization:</strong> This tool optimizes the PDF structure by removing unused objects and compressing internal streams. For image-heavy PDFs or maximum compression, use a desktop tool like Adobe Acrobat or Smallpdf.
        </div>
      </div>

      {!file ? (
        <FileDropzone accept=".pdf,application/pdf" multiple={false} maxSizeMB={100} onFiles={handleFiles} description="PDF file only — max 100MB" />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{file.name}</p>
              <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setResult(null); }} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Remove</button>
          </div>

          {!result && (
            <button onClick={compress} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-primary-800 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileArchive className="w-4 h-4" />}
              {loading ? 'Optimizing PDF...' : 'Compress PDF'}
            </button>
          )}

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          {result && (
            <div className={`p-4 rounded-xl border ${result.savings > 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-semibold text-sm ${result.savings > 0 ? 'text-green-800 dark:text-green-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    {result.savings > 0 ? `Saved ${result.savings.toFixed(1)}%!` : 'PDF already optimized'}
                  </p>
                  <p className="text-xs mt-0.5 text-slate-500">
                    {formatFileSize(file.size)} → {formatFileSize(result.blob.size)}
                    {result.savings > 0 && ` (−${formatFileSize(file.size - result.blob.size)})`}
                  </p>
                </div>
                <DownloadButton onClick={download} label="Download" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
