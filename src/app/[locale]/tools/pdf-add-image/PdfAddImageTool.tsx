'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Download, Loader2, FileText, X, ImageIcon, Plus, Trash2 } from 'lucide-react';

type PlacementMode = 'all' | 'first' | 'last' | 'custom';

interface ImageEntry {
  uid: string;
  file: File;
  preview: string;
  placement: PlacementMode;
  customPage: number;
  x: number;
  y: number;
  width: number;
  opacity: number;
}

export function PdfAddImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf') return;
    setLoading(true);
    setFile(f);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
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

  const addImage = (f: File) => {
    const entry: ImageEntry = {
      uid: Math.random().toString(36).slice(2),
      file: f,
      preview: URL.createObjectURL(f),
      placement: 'all',
      customPage: 1,
      x: 36,
      y: 36,
      width: 150,
      opacity: 1,
    };
    setImages(prev => [...prev, entry]);
  };

  const update = <K extends keyof ImageEntry>(uid: string, key: K, val: ImageEntry[K]) => {
    setImages(prev => prev.map(img => img.uid === uid ? { ...img, [key]: val } : img));
  };

  const remove = (uid: string) => {
    setImages(prev => {
      const img = prev.find(i => i.uid === uid);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.uid !== uid);
    });
  };

  const process = async () => {
    if (!file || !images.length) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = pdf.getPages();
      const total = pages.length;

      for (const imgEntry of images) {
        const imgBytes = await imgEntry.file.arrayBuffer();
        let pdfImg;
        if (imgEntry.file.type === 'image/png') {
          pdfImg = await pdf.embedPng(imgBytes);
        } else {
          // Convert to JPG via canvas if needed
          if (imgEntry.file.type === 'image/jpeg') {
            pdfImg = await pdf.embedJpg(imgBytes);
          } else {
            const canvas = document.createElement('canvas');
            const imgEl = new Image();
            await new Promise<void>(res => { imgEl.onload = () => res(); imgEl.src = imgEntry.preview; });
            canvas.width = imgEl.naturalWidth;
            canvas.height = imgEl.naturalHeight;
            canvas.getContext('2d')!.drawImage(imgEl, 0, 0);
            const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.95));
            pdfImg = await pdf.embedJpg(await blob.arrayBuffer());
          }
        }

        const aspectRatio = pdfImg.height / pdfImg.width;
        const drawH = imgEntry.width * aspectRatio;

        const targetPages: number[] = [];
        if (imgEntry.placement === 'all') targetPages.push(...pages.map((_, i) => i));
        else if (imgEntry.placement === 'first') targetPages.push(0);
        else if (imgEntry.placement === 'last') targetPages.push(total - 1);
        else targetPages.push(Math.min(Math.max(1, imgEntry.customPage), total) - 1);

        for (const idx of targetPages) {
          const page = pages[idx];
          const { height } = page.getSize();
          const yFromBottom = height - imgEntry.y - drawH;
          page.drawImage(pdfImg, {
            x: imgEntry.x,
            y: yFromBottom,
            width: imgEntry.width,
            height: drawH,
            opacity: imgEntry.opacity,
          });
        }
      }

      const out = await pdf.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, '') + '-with-images.pdf';
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
      {/* PDF upload */}
      {!file && (
        <div
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${dragging ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/10'}`}
        >
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-cyan-400" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Drop your PDF here or click to browse</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add logos, stamps, and images to PDF pages</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-10 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-500" /> Reading PDF…
        </div>
      )}

      {file && !loading && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-cyan-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{file.name}</p>
              <p className="text-sm text-gray-400">{pageCount} page{pageCount !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => { setFile(null); setPageCount(0); setImages([]); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Add image button */}
          <div className="flex gap-3 items-center">
            <input ref={imgInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple className="hidden"
              onChange={e => { if (e.target.files) Array.from(e.target.files).forEach(addImage); }} />
            <button onClick={() => imgInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-cyan-300 dark:border-cyan-700 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Image (PNG/JPG/WebP)
            </button>
            <span className="text-xs text-gray-400">Upload one or multiple images</span>
          </div>

          {/* Image list */}
          {images.length > 0 && (
            <div className="space-y-4">
              {images.map((img, i) => (
                <div key={img.uid} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
                  <div className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.preview} alt={img.file.name} className="w-16 h-16 object-contain rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">Image {i + 1}: {img.file.name}</p>
                        <button onClick={() => remove(img.uid)} className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Apply to</label>
                          <select value={img.placement} onChange={e => update(img.uid, 'placement', e.target.value as PlacementMode)}
                            className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            <option value="all">All pages</option>
                            <option value="first">First page</option>
                            <option value="last">Last page</option>
                            <option value="custom">Custom page</option>
                          </select>
                        </div>
                        {img.placement === 'custom' && (
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Page</label>
                            <input type="number" min={1} max={pageCount} value={img.customPage} onChange={e => update(img.uid, 'customPage', Number(e.target.value))}
                              className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                          </div>
                        )}
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Width: {img.width}pt</label>
                          <input type="range" min={20} max={500} value={img.width} onChange={e => update(img.uid, 'width', Number(e.target.value))} className="w-full accent-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Left: {img.x}pt</label>
                          <input type="range" min={0} max={500} value={img.x} onChange={e => update(img.uid, 'x', Number(e.target.value))} className="w-full accent-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Top: {img.y}pt</label>
                          <input type="range" min={0} max={700} value={img.y} onChange={e => update(img.uid, 'y', Number(e.target.value))} className="w-full accent-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Opacity: {Math.round(img.opacity * 100)}%</label>
                          <input type="range" min={10} max={100} value={Math.round(img.opacity * 100)} onChange={e => update(img.uid, 'opacity', Number(e.target.value) / 100)} className="w-full accent-cyan-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {images.length === 0 && (
            <div className="bg-cyan-50 dark:bg-cyan-900/10 rounded-2xl border border-cyan-200 dark:border-cyan-800 p-6 text-center">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
              <p className="text-sm text-cyan-700 dark:text-cyan-400">Click "Add Image" above to insert a logo or stamp</p>
            </div>
          )}

          <button onClick={process} disabled={processing || images.length === 0}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
            {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : <><Download className="w-5 h-5" /> Download PDF with Images</>}
          </button>
        </>
      )}
    </div>
  );
}
