'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Download, FileImage, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

type PageSize = 'A4' | 'Letter' | 'fit';
type Orientation = 'portrait' | 'landscape';

const PAGE_SIZES = {
  A4:     { w: 595.28, h: 841.89 },
  Letter: { w: 612,    h: 792 },
};

export function JpgToPdfTool() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [margin, setMargin] = useState(20);
  const [converting, setConverting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'].includes(f.type)
    );
    const newImages: ImageFile[] = arr.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const remove = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  const move = (idx: number, dir: -1 | 1) => {
    setImages(prev => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  const convert = async () => {
    if (!images.length) return;
    setConverting(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();

      for (const img of images) {
        const bytes = await img.file.arrayBuffer();
        let pdfImage;

        if (img.file.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(bytes);
        } else {
          // Convert to JPEG for pdf-lib (handles webp/bmp via canvas)
          if (img.file.type === 'image/jpeg') {
            pdfImage = await pdfDoc.embedJpg(bytes);
          } else {
            // Use canvas to convert non-jpg/png
            const canvas = document.createElement('canvas');
            const imgEl = new Image();
            await new Promise<void>(res => { imgEl.onload = () => res(); imgEl.src = img.preview; });
            canvas.width = imgEl.naturalWidth;
            canvas.height = imgEl.naturalHeight;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(imgEl, 0, 0);
            const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.95));
            const jpgBytes = await blob.arrayBuffer();
            pdfImage = await pdfDoc.embedJpg(jpgBytes);
          }
        }

        const imgWidth = pdfImage.width;
        const imgHeight = pdfImage.height;

        let pageW: number, pageH: number;
        if (pageSize === 'fit') {
          pageW = imgWidth;
          pageH = imgHeight;
        } else {
          const dims = PAGE_SIZES[pageSize];
          pageW = orientation === 'portrait' ? dims.w : dims.h;
          pageH = orientation === 'portrait' ? dims.h : dims.w;
        }

        const page = pdfDoc.addPage([pageW, pageH]);
        const usableW = pageW - margin * 2;
        const usableH = pageH - margin * 2;
        const scale = Math.min(usableW / imgWidth, usableH / imgHeight);
        const drawW = imgWidth * scale;
        const drawH = imgHeight * scale;
        const x = margin + (usableW - drawW) / 2;
        const y = margin + (usableH - drawH) / 2;

        page.drawImage(pdfImage, { x, y, width: drawW, height: drawH });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'images-converted.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Conversion failed: ' + (err as Error).message);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
          multiple
          className="hidden"
          onChange={e => e.target.files && addFiles(e.target.files)}
        />
        <Upload className="w-10 h-10 mx-auto mb-3 text-red-400" />
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Drop images here or click to browse
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Supports JPG, PNG, WebP, GIF, BMP — multiple files allowed
        </p>
      </div>

      {/* Image list */}
      {images.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileImage className="w-4 h-4 text-red-500" />
              {images.length} image{images.length > 1 ? 's' : ''} — drag to reorder
            </div>
            <button
              onClick={() => setImages([])}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {images.map((img, idx) => (
              <div key={img.id} className="flex items-center gap-3 px-4 py-3">
                {/* Thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.preview}
                  alt={img.name}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shrink-0"
                />
                {/* Name */}
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{img.name}</span>
                {/* Page number */}
                <span className="text-xs text-gray-400 shrink-0">Page {idx + 1}</span>
                {/* Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 transition-colors">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => move(idx, 1)} disabled={idx === images.length - 1} className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 transition-colors">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => remove(img.id)} className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">PDF Options</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Page size */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Page Size</label>
            <select
              value={pageSize}
              onChange={e => setPageSize(e.target.value as PageSize)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="A4">A4 (210 × 297 mm)</option>
              <option value="Letter">Letter (8.5 × 11 in)</option>
              <option value="fit">Fit to Image</option>
            </select>
          </div>
          {/* Orientation */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Orientation</label>
            <select
              value={orientation}
              onChange={e => setOrientation(e.target.value as Orientation)}
              disabled={pageSize === 'fit'}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          {/* Margin */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Margin: {margin}px
            </label>
            <input
              type="range"
              min={0}
              max={60}
              value={margin}
              onChange={e => setMargin(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
        </div>
      </div>

      {/* Convert button */}
      <button
        onClick={convert}
        disabled={!images.length || converting}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
      >
        {converting ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Converting…</>
        ) : (
          <><Download className="w-5 h-5" /> Convert to PDF & Download</>
        )}
      </button>
    </div>
  );
}
