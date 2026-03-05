'use client';
import { useState, useRef } from 'react';
import { Upload, Download, Trash2, GripVertical, X, FileImage } from 'lucide-react';

export function ImageToPdfTool() {
  const [images, setImages] = useState<{ id: string; name: string; url: string; file: File }[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [margin, setMargin] = useState(20);
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const newImages = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(f => ({
        id: Math.random().toString(36).slice(2),
        name: f.name,
        url: URL.createObjectURL(f),
        file: f,
      }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => setImages(prev => prev.filter(i => i.id !== id));
  const moveImage = (from: number, to: number) => {
    setImages(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setGenerating(true);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.create();

      const pageSizes: Record<string, [number, number]> = {
        a4: [595.28, 841.89],
        letter: [612, 792],
      };

      for (const img of images) {
        const bytes = await img.file.arrayBuffer();
        let pdfImage;
        if (img.file.type === 'image/png') pdfImage = await doc.embedPng(bytes);
        else pdfImage = await doc.embedJpg(bytes);

        const imgW = pdfImage.width;
        const imgH = pdfImage.height;

        let pageW: number, pageH: number;
        if (pageSize === 'fit') {
          pageW = imgW + margin * 2;
          pageH = imgH + margin * 2;
        } else {
          [pageW, pageH] = pageSizes[pageSize];
        }

        const page = doc.addPage([pageW, pageH]);
        const availW = pageW - margin * 2;
        const availH = pageH - margin * 2;
        const scale = Math.min(availW / imgW, availH / imgH, 1);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const x = margin + (availW - drawW) / 2;
        const y = margin + (availH - drawH) / 2;

        page.drawImage(pdfImage, { x, y, width: drawW, height: drawH });
      }

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'images.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors"
      >
        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-base font-medium text-slate-700 dark:text-slate-300 mb-1">Drop images here or click to upload</p>
        <p className="text-sm text-slate-500">Supports JPEG, PNG — Add multiple images</p>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      </div>

      {/* Settings */}
      {images.length > 0 && (
        <div className="flex flex-wrap items-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Page Size</label>
            <select value={pageSize} onChange={(e) => setPageSize(e.target.value as typeof pageSize)}
              className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm px-3 py-2">
              <option value="a4">A4</option>
              <option value="letter">US Letter</option>
              <option value="fit">Fit to Image</option>
            </select>
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Margin: {margin}px</label>
            <input type="range" min={0} max={60} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full max-w-[7rem] accent-primary-600" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
            <button onClick={generatePdf} disabled={generating}
              className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium transition-colors">
              {generating ? 'Generating...' : <><Download className="w-4 h-4 inline mr-1" /> Generate PDF</>}
            </button>
            <button onClick={() => setImages([])} className="px-3 py-2 text-sm text-slate-500 hover:text-red-500">
              <Trash2 className="w-4 h-4 inline mr-1" /> <span className="hidden sm:inline">Clear All</span><span className="sm:hidden">Clear</span>
            </button>
          </div>
        </div>
      )}

      {/* Image list */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">{images.length} image{images.length > 1 ? 's' : ''} — drag to reorder</p>
          {images.map((img, i) => (
            <div key={img.id} className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
              <button className="cursor-grab text-slate-400 hover:text-slate-600" onMouseDown={() => {}} title="Drag to reorder">
                <GripVertical className="w-4 h-4" />
              </button>
              <img src={img.url} alt={img.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{img.name}</p>
                <p className="text-xs text-slate-500">Page {i + 1}</p>
              </div>
              <div className="flex gap-1">
                {i > 0 && <button onClick={() => moveImage(i, i - 1)} className="p-1 text-slate-400 hover:text-slate-600 text-xs">Up</button>}
                {i < images.length - 1 && <button onClick={() => moveImage(i, i + 1)} className="p-1 text-slate-400 hover:text-slate-600 text-xs">Down</button>}
                <button onClick={() => removeImage(img.id)} className="p-1 text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
