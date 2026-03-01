'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Download, Loader2, FileText, X, Pen, Type, ImageIcon, Trash2 } from 'lucide-react';

type SignMode = 'draw' | 'type' | 'image';
type PlacementMode = 'all' | 'first' | 'last' | 'custom';

const CURSIVE_FONTS = [
  { label: 'Dancing Script', value: "'Dancing Script', cursive" },
  { label: 'Pacifico', value: "'Pacifico', cursive" },
  { label: 'Great Vibes', value: "'Great Vibes', cursive" },
];

export function PdfSignTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [signMode, setSignMode] = useState<SignMode>('draw');
  const [typedSig, setTypedSig] = useState('Your Signature');
  const [sigFont, setSigFont] = useState(CURSIVE_FONTS[0].value);
  const [sigColor, setSigColor] = useState('#1a1a2e');
  const [sigImage, setSigImage] = useState<File | null>(null);
  const [placement, setPlacement] = useState<PlacementMode>('last');
  const [customPage, setCustomPage] = useState(1);
  const [sigX, setSigX] = useState(72);
  const [sigY, setSigY] = useState(72);
  const [sigWidth, setSigWidth] = useState(180);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Load Google Fonts for type mode
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Pacifico&family=Great+Vibes&display=swap';
    document.head.appendChild(link);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !lastPos.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = sigColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
    setHasDrawing(true);
  };

  const stopDraw = () => { setIsDrawing(false); lastPos.current = null; };

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

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

  const getSigImageBytes = async (): Promise<{ bytes: ArrayBuffer; isPng: boolean } | null> => {
    if (signMode === 'draw') {
      const canvas = canvasRef.current!;
      if (!hasDrawing) return null;
      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/png'));
      return { bytes: await blob.arrayBuffer(), isPng: true };
    } else if (signMode === 'type') {
      // Render typed signature to canvas
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 500;
      offCanvas.height = 120;
      const ctx = offCanvas.getContext('2d')!;
      ctx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      ctx.font = `80px ${sigFont}`;
      ctx.fillStyle = sigColor;
      ctx.textBaseline = 'middle';
      ctx.fillText(typedSig, 10, 60);
      const blob = await new Promise<Blob>(res => offCanvas.toBlob(b => res(b!), 'image/png'));
      return { bytes: await blob.arrayBuffer(), isPng: true };
    } else if (signMode === 'image' && sigImage) {
      const bytes = await sigImage.arrayBuffer();
      const isPng = sigImage.type === 'image/png';
      return { bytes, isPng };
    }
    return null;
  };

  const process = async () => {
    if (!file) return;
    const sigData = await getSigImageBytes();
    if (!sigData) { alert('Please create or upload a signature first.'); return; }
    setProcessing(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = pdf.getPages();
      const total = pages.length;

      let pdfImg;
      if (sigData.isPng) {
        pdfImg = await pdf.embedPng(sigData.bytes);
      } else {
        pdfImg = await pdf.embedJpg(sigData.bytes);
      }

      const targetPages: number[] = [];
      if (placement === 'all') {
        targetPages.push(...pages.map((_, i) => i));
      } else if (placement === 'first') {
        targetPages.push(0);
      } else if (placement === 'last') {
        targetPages.push(total - 1);
      } else {
        const cp = Math.min(Math.max(1, customPage), total) - 1;
        targetPages.push(cp);
      }

      for (const idx of targetPages) {
        const page = pages[idx];
        const { height } = page.getSize();
        const aspectRatio = pdfImg.height / pdfImg.width;
        const drawH = sigWidth * aspectRatio;
        // pdf-lib y=0 is bottom; convert from top-left input
        const yFromBottom = height - sigY - drawH;
        page.drawImage(pdfImg, { x: sigX, y: yFromBottom, width: sigWidth, height: drawH });
      }

      const out = await pdf.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, '') + '-signed.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed: ' + (err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const canProcess = file && (
    (signMode === 'draw' && hasDrawing) ||
    (signMode === 'type' && typedSig.trim().length > 0) ||
    (signMode === 'image' && sigImage !== null)
  );

  return (
    <div className="space-y-6">
      {/* PDF upload */}
      {!file && (
        <div
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${dragging ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10'}`}
        >
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-violet-400" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Drop your PDF here or click to browse</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Sign your PDF with draw, type, or upload options</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-10 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" /> Reading PDF…
        </div>
      )}

      {file && !loading && (
        <>
          {/* File info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-violet-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{file.name}</p>
              <p className="text-sm text-gray-400">{pageCount} page{pageCount !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => { setFile(null); setPageCount(0); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Signature creator */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Create Your Signature</h3>

            {/* Mode tabs */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 w-fit">
              {([
                { id: 'draw', label: 'Draw', icon: <Pen className="w-3.5 h-3.5" /> },
                { id: 'type', label: 'Type', icon: <Type className="w-3.5 h-3.5" /> },
                { id: 'image', label: 'Upload', icon: <ImageIcon className="w-3.5 h-3.5" /> },
              ] as const).map(({ id, label, icon }) => (
                <button key={id} onClick={() => setSignMode(id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${signMode === id ? 'bg-violet-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* Draw mode */}
            {signMode === 'draw' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Ink color</label>
                  <input type="color" value={sigColor} onChange={e => setSigColor(e.target.value)} className="h-8 w-12 rounded border border-gray-200 cursor-pointer" />
                  <button onClick={clearCanvas} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-500 border border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 transition-colors ml-auto">
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
                <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-violet-200 dark:border-violet-700 bg-white dark:bg-gray-900">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={180}
                    className="w-full touch-none cursor-crosshair"
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onMouseLeave={stopDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={stopDraw}
                  />
                  {!hasDrawing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-sm text-gray-300 dark:text-gray-600">Draw your signature here</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Type mode */}
            {signMode === 'type' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Your name</label>
                    <input value={typedSig} onChange={e => setTypedSig(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Color</label>
                    <input type="color" value={sigColor} onChange={e => setSigColor(e.target.value)} className="h-9 w-full rounded-lg border border-gray-200 cursor-pointer" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CURSIVE_FONTS.map(f => (
                    <button key={f.value} onClick={() => setSigFont(f.value)}
                      className={`px-4 py-2 rounded-xl text-sm border transition-colors ${sigFont === f.value ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      style={{ fontFamily: f.value }}>
                      {typedSig || 'Signature'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload mode */}
            {signMode === 'image' && (
              <div>
                <input ref={imgInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={e => e.target.files?.[0] && setSigImage(e.target.files[0])} />
                <button onClick={() => imgInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-violet-200 dark:border-violet-700 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors w-full justify-center text-sm">
                  <Upload className="w-4 h-4" />
                  {sigImage ? sigImage.name : 'Upload signature image (PNG/JPG)'}
                </button>
                {sigImage && (
                  <p className="text-xs text-gray-400 mt-2">Tip: Use a PNG with transparent background for best results.</p>
                )}
              </div>
            )}
          </div>

          {/* Placement settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Placement</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Apply to</label>
                <select value={placement} onChange={e => setPlacement(e.target.value as PlacementMode)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option value="last">Last page only</option>
                  <option value="first">First page only</option>
                  <option value="all">All pages</option>
                  <option value="custom">Specific page</option>
                </select>
              </div>
              {placement === 'custom' && (
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Page number</label>
                  <input type="number" min={1} max={pageCount} value={customPage} onChange={e => setCustomPage(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Width: {sigWidth}pt</label>
                <input type="range" min={60} max={400} value={sigWidth} onChange={e => setSigWidth(Number(e.target.value))} className="w-full accent-violet-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Left offset: {sigX}pt</label>
                <input type="range" min={0} max={400} value={sigX} onChange={e => setSigX(Number(e.target.value))} className="w-full accent-violet-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Top offset: {sigY}pt</label>
                <input type="range" min={0} max={600} value={sigY} onChange={e => setSigY(Number(e.target.value))} className="w-full accent-violet-500" />
              </div>
            </div>
          </div>

          <button onClick={process} disabled={processing || !canProcess}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
            {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing…</> : <><Pen className="w-5 h-5" /> Download Signed PDF</>}
          </button>
        </>
      )}
    </div>
  );
}
