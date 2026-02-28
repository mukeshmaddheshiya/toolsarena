'use client';
import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { downloadBlob, formatFileSize } from '@/lib/utils';
import { FilePlus2, GripVertical, X, Loader2 } from 'lucide-react';

export function PDFMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [merged, setMerged] = useState<Blob | null>(null);
  const [mergedSize, setMergedSize] = useState(0);
  const [error, setError] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function addFiles(newFiles: File[]) {
    setFiles(prev => {
      const all = [...prev, ...newFiles];
      return all.slice(0, 20); // max 20
    });
    setMerged(null);
  }

  function removeFile(i: number) {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    setMerged(null);
  }

  function onDragStart(i: number) { setDragIndex(i); }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === i) return;
    setFiles(prev => {
      const next = [...prev];
      const [item] = next.splice(dragIndex, 1);
      next.splice(i, 0, item);
      return next;
    });
    setDragIndex(i);
  }
  function onDragEnd() { setDragIndex(null); }

  async function merge() {
    if (files.length < 2) { setError('Please upload at least 2 PDF files to merge.'); return; }
    setLoading(true);
    setError('');
    try {
      const mergedDoc = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedDoc.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedDoc.addPage(page));
      }
      const bytes = await mergedDoc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setMerged(blob);
      setMergedSize(blob.size);
    } catch (e) {
      setError(`Failed to merge: ${(e as Error).message}. Ensure all files are valid, non-encrypted PDFs.`);
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!merged) return;
    downloadBlob(merged, 'merged-toolsarena.pdf');
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept=".pdf,application/pdf"
        multiple
        maxSizeMB={50}
        onFiles={addFiles}
        description="PDF files only — max 50MB each — up to 20 files"
      />

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{files.length} file{files.length > 1 ? 's' : ''} — drag to reorder</p>
            {files.length > 1 && !loading && (
              <button onClick={merge} className="flex items-center gap-2 px-4 py-2 bg-primary-800 hover:bg-primary-700 text-white font-medium rounded-xl text-sm transition-colors">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FilePlus2 className="w-4 h-4" />}
                Merge {files.length} PDFs
              </button>
            )}
          </div>

          <div className="space-y-2">
            {files.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={e => onDragOver(e, i)}
                onDragEnd={onDragEnd}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${dragIndex === i ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 opacity-60' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
              >
                <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xs font-bold text-red-600 dark:text-red-400 shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                </div>
                <button onClick={() => removeFile(i)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 py-4 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Merging PDFs...</span>
            </div>
          )}

          {error && <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</p>}

          {merged && (
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div>
                <p className="font-semibold text-green-800 dark:text-green-300 text-sm">Merge Complete!</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                  {files.length} PDFs merged · {formatFileSize(mergedSize)}
                </p>
              </div>
              <DownloadButton onClick={download} label="Download Merged PDF" />
            </div>
          )}
        </div>
      )}

      {files.length === 0 && (
        <div className="text-center py-4 text-sm text-slate-400">Upload 2 or more PDF files above to merge them</div>
      )}
    </div>
  );
}
