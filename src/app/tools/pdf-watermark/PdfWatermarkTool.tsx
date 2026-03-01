'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Download, Loader2, FileText, X } from 'lucide-react';

type WatermarkType = 'text' | 'image';
type Position = 'center' | 'tile' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export function PdfWatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [wmType, setWmType] = useState<WatermarkType>('text');
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.3);
  const [color, setColor] = useState('#ff0000');
  const [position, setPosition] = useState<Position>('center');
  const [rotation, setRotation] = useState(45);
  const [wmImage, setWmImage] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

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

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r, g, b };
  };

  const process = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument, degrees, rgb, StandardFonts } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const { r, g, b } = hexToRgb(color);
      const pages = pdf.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();

        if (wmType === 'text') {
          const textWidth = font.widthOfTextAtSize(text, fontSize);
          const textHeight = font.heightAtSize(fontSize);

          const getPos = (): { x: number; y: number } => {
            const pad = 20;
            switch (position) {
              case 'center': return { x: (width - textWidth) / 2, y: (height - textHeight) / 2 };
              case 'top-left': return { x: pad, y: height - textHeight - pad };
              case 'top-right': return { x: width - textWidth - pad, y: height - textHeight - pad };
              case 'bottom-left': return { x: pad, y: pad };
              case 'bottom-right': return { x: width - textWidth - pad, y: pad };
              case 'tile': return { x: (width - textWidth) / 2, y: (height - textHeight) / 2 };
            }
          };

          if (position === 'tile') {
            const cols = Math.ceil(width / (textWidth + 60)) + 1;
            const rows = Math.ceil(height / (fontSize + 60)) + 1;
            for (let row = 0; row < rows; row++) {
              for (let col = 0; col < cols; col++) {
                page.drawText(text, {
                  x: col * (textWidth + 60) - textWidth / 2,
                  y: row * (fontSize + 60),
                  size: fontSize,
                  font,
                  color: rgb(r, g, b),
                  opacity,
                  rotate: degrees(rotation),
                });
              }
            }
          } else {
            const { x, y } = getPos();
            page.drawText(text, {
              x, y,
              size: fontSize,
              font,
              color: rgb(r, g, b),
              opacity,
              rotate: degrees(rotation),
            });
          }
        } else if (wmType === 'image' && wmImage) {
          const imgBytes = await wmImage.arrayBuffer();
          let pdfImg;
          if (wmImage.type === 'image/png') {
            pdfImg = await pdf.embedPng(imgBytes);
          } else {
            pdfImg = await pdf.embedJpg(imgBytes);
          }
          const imgDims = pdfImg.scale(0.3);
          const cx = (width - imgDims.width) / 2;
          const cy = (height - imgDims.height) / 2;
          page.drawImage(pdfImg, { x: cx, y: cy, width: imgDims.width, height: imgDims.height, opacity, rotate: degrees(rotation) });
        }
      }

      const out = await pdf.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, '') + '-watermarked.pdf';
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
      {/* Drop zone */}
      {!file && (
        <div
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${dragging ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'}`}
        >
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-blue-400" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Drop your PDF here or click to browse</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add text or image watermark to every page</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-10 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" /> Reading PDF…
        </div>
      )}

      {file && !loading && (
        <>
          {/* File info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{file.name}</p>
              <p className="text-sm text-gray-400">{pageCount} page{pageCount !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => { setFile(null); setPageCount(0); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Watermark options */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Watermark Settings</h3>

            {/* Type toggle */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 w-fit">
              {(['text', 'image'] as WatermarkType[]).map(t => (
                <button key={t} onClick={() => setWmType(t)}
                  className={`px-5 py-2 text-sm font-medium capitalize transition-colors ${wmType === t ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  {t === 'text' ? 'Text Watermark' : 'Image Watermark'}
                </button>
              ))}
            </div>

            {wmType === 'text' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Watermark Text</label>
                  <input value={text} onChange={e => setText(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Font Size: {fontSize}px</label>
                  <input type="range" min={12} max={120} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Color</label>
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9 w-full rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer" />
                </div>
              </div>
            )}

            {wmType === 'image' && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Watermark Image (PNG/JPG)</label>
                <input ref={imgRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={e => e.target.files?.[0] && setWmImage(e.target.files[0])} />
                <button onClick={() => imgRef.current?.click()} className="px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  {wmImage ? wmImage.name : 'Choose image…'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Opacity: {Math.round(opacity * 100)}%</label>
                <input type="range" min={5} max={100} value={Math.round(opacity * 100)} onChange={e => setOpacity(Number(e.target.value) / 100)} className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Rotation: {rotation}°</label>
                <input type="range" min={-180} max={180} value={rotation} onChange={e => setRotation(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Position</label>
                <select value={position} onChange={e => setPosition(e.target.value as Position)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="center">Center</option>
                  <option value="tile">Tile (repeat)</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>
            </div>
          </div>

          <button onClick={process} disabled={processing || (wmType === 'image' && !wmImage)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
            {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : <><Download className="w-5 h-5" /> Download Watermarked PDF</>}
          </button>
        </>
      )}
    </div>
  );
}
