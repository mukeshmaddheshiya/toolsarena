'use client';
import { useState, useEffect } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { DownloadButton } from '@/components/common/DownloadButton';
import { formatFileSize, downloadBlob } from '@/lib/utils';
import { Loader2, FileImage } from 'lucide-react';

export function PDFToImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [dpi, setDpi] = useState(150);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<{ blob: Blob; name: string; pageNum: number }[]>([]);
  const [error, setError] = useState('');
  const [pdfJsReady, setPdfJsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).pdfjsLib) { setPdfJsReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setPdfJsReady(true);
    };
    document.head.appendChild(script);
  }, []);

  async function handleFiles(files: File[]) {
    setFile(files[0]);
    setImages([]);
    setError('');
  }

  async function convert() {
    if (!file || !pdfJsReady) return;
    setLoading(true);
    setError('');
    setImages([]);
    try {
      const pdfjsLib = (window as any).pdfjsLib;
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdfDoc.numPages;
      const scale = dpi / 96;
      const results: { blob: Blob; name: string; pageNum: number }[] = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        if (format === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob>((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error('Failed')), format, 0.92));
        const ext = format === 'image/png' ? 'png' : 'jpg';
        results.push({ blob, name: `page-${pageNum}.${ext}`, pageNum });
      }
      setImages(results);
    } catch (e) {
      setError(`Failed to convert: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  function downloadAll() {
    images.forEach(img => downloadBlob(img.blob, img.name));
  }

  return (
    <div className="space-y-5">
      {!file ? (
        <FileDropzone accept=".pdf,application/pdf" multiple={false} maxSizeMB={50} onFiles={handleFiles} description="PDF file only — max 50MB" />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{file.name}</p>
              <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setImages([]); }} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Remove</button>
          </div>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Output Format</label>
              <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {([['image/png', 'PNG (lossless)'], ['image/jpeg', 'JPEG (smaller)']] as const).map(([v, l]) => (
                  <button key={v} onClick={() => setFormat(v)} className={`flex-1 py-2 text-sm font-medium transition-colors ${format === v ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400'}`}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Resolution (DPI)</label>
                <span className="text-xs font-bold text-primary-700 dark:text-primary-400">{dpi} DPI</span>
              </div>
              <input type="range" min={72} max={300} step={24} value={dpi} onChange={e => setDpi(parseInt(e.target.value))} className="w-full accent-primary-800" />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>72 (screen)</span><span>300 (print)</span></div>
            </div>
          </div>

          <button onClick={convert} disabled={loading || !pdfJsReady} className="flex items-center gap-2 px-5 py-2.5 bg-primary-800 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors text-sm">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileImage className="w-4 h-4" />}
            {!pdfJsReady ? 'Loading PDF engine...' : loading ? 'Converting pages...' : 'Convert to Images'}
          </button>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">{images.length} page{images.length > 1 ? 's' : ''} converted</p>
                {images.length > 1 && <button onClick={downloadAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-800 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors">Download All</button>}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map(img => {
                  const url = URL.createObjectURL(img.blob);
                  return (
                    <div key={img.pageNum} className="space-y-1.5">
                      <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img src={url} alt={`Page ${img.pageNum}`} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Page {img.pageNum}</span>
                        <button onClick={() => downloadBlob(img.blob, img.name)} className="text-xs text-primary-700 dark:text-primary-400 hover:underline">Download</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
