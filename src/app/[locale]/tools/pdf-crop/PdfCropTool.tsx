'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Download, Loader2, FileText, X } from 'lucide-react';

type CropMode = 'uniform' | 'per-page';
type MarginPreset = 'none' | 'small' | 'medium' | 'large';

interface CropValues { top: number; right: number; bottom: number; left: number; }

const PRESETS: Record<MarginPreset, CropValues> = {
  none:   { top: 0,  right: 0,  bottom: 0,  left: 0  },
  small:  { top: 18, right: 18, bottom: 18, left: 18 },
  medium: { top: 36, right: 36, bottom: 36, left: 36 },
  large:  { top: 72, right: 72, bottom: 72, left: 72 },
};

export function PdfCropTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null);
  const [cropMode] = useState<CropMode>('uniform');
  const [crop, setCrop] = useState<CropValues>({ top: 36, right: 36, bottom: 36, left: 36 });
  const [preset, setPreset] = useState<MarginPreset>('small');
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
      setPageCount(pdf.getPageCount());
      const firstPage = pdf.getPage(0);
      const { width, height } = firstPage.getSize();
      setPageSize({ width: Math.round(width), height: Math.round(height) });
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

  const applyPreset = (p: MarginPreset) => {
    setPreset(p);
    setCrop(PRESETS[p]);
  };

  const updateCrop = (side: keyof CropValues, val: number) => {
    setPreset('none');
    setCrop(prev => ({ ...prev, [side]: Math.max(0, val) }));
  };

  const process = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = pdf.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const x = crop.left;
        const y = crop.bottom;
        const w = Math.max(1, width - crop.left - crop.right);
        const h = Math.max(1, height - crop.top - crop.bottom);
        page.setCropBox(x, y, w, h);
        page.setBleedBox(x, y, w, h);
        page.setTrimBox(x, y, w, h);
        page.setArtBox(x, y, w, h);
      }

      const out = await pdf.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, '') + '-cropped.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed: ' + (err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const canCrop = pageSize
    ? crop.left + crop.right < pageSize.width && crop.top + crop.bottom < pageSize.height
    : true;

  return (
    <div className="space-y-6">
      {!file && (
        <div
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${dragging ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10'}`}
        >
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-rose-400" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Drop your PDF here or click to browse</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Trim margins from all pages uniformly</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-10 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-rose-500" /> Reading PDF…
        </div>
      )}

      {file && !loading && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-rose-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{file.name}</p>
              <p className="text-sm text-gray-400">
                {pageCount} page{pageCount !== 1 ? 's' : ''}
                {pageSize && ` · ${pageSize.width} × ${pageSize.height} pt (first page)`}
              </p>
            </div>
            <button onClick={() => { setFile(null); setPageCount(0); setPageSize(null); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Visual crop preview */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Crop Preview</p>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800">
                {/* Crop overlay */}
                <div
                  className="absolute inset-0 border-4 border-rose-400 bg-rose-50/10 dark:bg-rose-900/10 rounded"
                  style={{
                    top: `${(crop.top / (pageSize?.height || 842)) * 100}%`,
                    right: `${(crop.right / (pageSize?.width || 595)) * 100}%`,
                    bottom: `${(crop.bottom / (pageSize?.height || 842)) * 100}%`,
                    left: `${(crop.left / (pageSize?.width || 595)) * 100}%`,
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-300 dark:text-gray-600">Page</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Crop Margins</h3>
              <span className="text-xs text-gray-400">Values in points (1pt ≈ 0.35mm)</span>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PRESETS) as MarginPreset[]).map(p => (
                  <button key={p} onClick={() => applyPreset(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${preset === p ? 'bg-rose-600 text-white' : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                    {p === 'none' ? 'No crop' : p}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(['top', 'right', 'bottom', 'left'] as (keyof CropValues)[]).map(side => (
                <div key={side}>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 capitalize">{side}</label>
                  <input
                    type="number" min={0} max={300} value={crop[side]}
                    onChange={e => updateCrop(side, Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              ))}
            </div>

            {!canCrop && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                ⚠ Crop margins exceed page dimensions. Reduce the values.
              </p>
            )}
          </div>

          <button onClick={process} disabled={processing || !canCrop}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
            {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : <><Download className="w-5 h-5" /> Download Cropped PDF</>}
          </button>
        </>
      )}
    </div>
  );
}
