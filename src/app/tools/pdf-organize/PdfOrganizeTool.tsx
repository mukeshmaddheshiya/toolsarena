'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Download, Loader2, FileText, X, ArrowUp, ArrowDown, Trash2, Copy } from 'lucide-react';

interface PageEntry {
  uid: string;
  originalIndex: number;
  label: string;
}

export function PdfOrganizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf') return;
    setLoading(true);
    setFile(f);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      setPages(Array.from({ length: count }, (_, i) => ({
        uid: Math.random().toString(36).slice(2),
        originalIndex: i,
        label: `Page ${i + 1}`,
      })));
    } catch {
      alert('Failed to read PDF.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const move = (idx: number, dir: -1 | 1) => {
    setPages(prev => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  const remove = (uid: string) => {
    setPages(prev => prev.filter(p => p.uid !== uid));
  };

  const duplicate = (idx: number) => {
    setPages(prev => {
      const arr = [...prev];
      const clone = { ...arr[idx], uid: Math.random().toString(36).slice(2) };
      arr.splice(idx + 1, 0, clone);
      return arr;
    });
  };

  const reset = () => {
    if (!file) return;
    const count = pages.length;
    setPages(Array.from({ length: count }, (_, i) => ({
      uid: Math.random().toString(36).slice(2),
      originalIndex: i,
      label: `Page ${i + 1}`,
    })));
  };

  const process = async () => {
    if (!file || !pages.length) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const outDoc = await PDFDocument.create();

      const indices = pages.map(p => p.originalIndex);
      const copied = await outDoc.copyPages(srcDoc, indices);
      for (const pg of copied) {
        outDoc.addPage(pg);
      }

      const out = await outDoc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, '') + '-organized.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed: ' + (err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file && (
        <div
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${dragging ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10'}`}
        >
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-purple-400" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Drop your PDF here or click to browse</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Reorder, delete, or duplicate pages</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-10 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" /> Reading PDF…
        </div>
      )}

      {file && !loading && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-purple-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{file.name}</p>
              <p className="text-sm text-gray-400">{pages.length} page{pages.length !== 1 ? 's' : ''} in output</p>
            </div>
            <button onClick={() => { setFile(null); setPages([]); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Info bar */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/10 rounded-xl px-4 py-2.5">
            <span className="text-purple-500">💡</span>
            Use the arrows to reorder pages, trash to delete, and copy to duplicate. Then download the result.
          </div>

          {/* Page list */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pages ({pages.length})
              </span>
              <button onClick={reset} className="text-xs text-gray-400 hover:text-purple-600 transition-colors">Reset order</button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[28rem] overflow-y-auto">
              {pages.map((p, idx) => (
                <div key={p.uid} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs font-bold text-purple-700 dark:text-purple-400 shrink-0">
                    {idx + 1}
                  </div>
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{p.label}</span>
                  {p.originalIndex !== idx && (
                    <span className="text-xs text-purple-500 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full shrink-0">
                      orig. {p.originalIndex + 1}
                    </span>
                  )}
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-1.5 rounded text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 disabled:opacity-30 transition-colors">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => move(idx, 1)} disabled={idx === pages.length - 1} className="p-1.5 rounded text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 disabled:opacity-30 transition-colors">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => duplicate(idx)} className="p-1.5 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Duplicate page">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(p.uid)} disabled={pages.length <= 1} className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30 transition-colors" title="Remove page">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={process} disabled={processing || pages.length === 0}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
            {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : <><Download className="w-5 h-5" /> Download Organized PDF</>}
          </button>
        </>
      )}
    </div>
  );
}
