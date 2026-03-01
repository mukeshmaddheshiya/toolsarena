'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Download, RotateCw, Loader2, FileText, X } from 'lucide-react';

interface PageInfo {
  index: number;
  rotation: number; // current rotation offset (0, 90, 180, 270)
}

export function PdfRotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [globalRotation, setGlobalRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
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
      setPageCount(count);
      setPages(Array.from({ length: count }, (_, i) => ({ index: i, rotation: 0 })));
      setGlobalRotation(0);
    } catch {
      alert('Failed to read PDF. The file may be corrupted or encrypted.');
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

  const rotatePage = (idx: number, deg: number) => {
    setPages(prev => prev.map(p => p.index === idx ? { ...p, rotation: (p.rotation + deg + 360) % 360 } : p));
  };

  const applyGlobal = (deg: number) => {
    const next = (globalRotation + deg + 360) % 360;
    setGlobalRotation(next);
    setPages(prev => prev.map(p => ({ ...p, rotation: (p.rotation + deg + 360) % 360 })));
  };

  const process = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument, degrees } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const outDoc = await PDFDocument.create();
      const copied = await outDoc.copyPages(srcDoc, pages.map(p => p.index));
      for (let i = 0; i < copied.length; i++) {
        const pg = copied[i];
        const existing = pg.getRotation().angle;
        pg.setRotation(degrees((existing + pages[i].rotation) % 360));
        outDoc.addPage(pg);
      }
      const out = await outDoc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, '') + '-rotated.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed: ' + (err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const rotationLabel = (r: number) => r === 0 ? '0°' : r === 90 ? '90° CW' : r === 180 ? '180°' : '270° CW';

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      {!file && (
        <div
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${dragging ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10'}`}
        >
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-orange-400" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Drop your PDF here or click to browse</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Supports all PDF files</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-10 text-gray-500 dark:text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          <span>Reading PDF…</span>
        </div>
      )}

      {/* Controls */}
      {file && !loading && (
        <>
          {/* File info + change */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-orange-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{file.name}</p>
              <p className="text-sm text-gray-400">{pageCount} page{pageCount !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => { setFile(null); setPages([]); setPageCount(0); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Global rotation */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Rotate All Pages</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: '90° Clockwise', deg: 90 },
                { label: '90° Counter-CW', deg: -90 },
                { label: '180°', deg: 180 },
              ].map(({ label, deg }) => (
                <button
                  key={label}
                  onClick={() => applyGlobal(deg)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-sm font-medium transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                  {label}
                </button>
              ))}
              <button
                onClick={() => { setGlobalRotation(0); setPages(prev => prev.map(p => ({ ...p, rotation: 0 }))); }}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Per-page controls */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Per-Page Rotation</span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-72 overflow-y-auto">
              {pages.map((p) => (
                <div key={p.index} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-14 shrink-0">Page {p.index + 1}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${p.rotation === 0 ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'}`}>
                    {rotationLabel(p.rotation)}
                  </span>
                  <div className="flex gap-2 ml-auto">
                    <button onClick={() => rotatePage(p.index, 90)} className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors" title="Rotate 90° CW">
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => rotatePage(p.index, -90)} className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors rotate-y-180" title="Rotate 90° CCW" style={{ transform: 'scaleX(-1)' }}>
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => rotatePage(p.index, 180)} className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors" title="Rotate 180°">
                      <span className="text-xs font-bold">180</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download */}
          <button
            onClick={process}
            disabled={processing}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : <><Download className="w-5 h-5" /> Download Rotated PDF</>}
          </button>
        </>
      )}
    </div>
  );
}
