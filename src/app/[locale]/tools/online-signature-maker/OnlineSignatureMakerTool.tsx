'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Trash2, Undo2, Pen, Type, Palette } from 'lucide-react';

type Mode = 'draw' | 'type';

const FONTS = [
  { label: 'Cursive', family: 'cursive' },
  { label: 'Serif', family: 'Georgia, serif' },
  { label: 'Sans', family: 'Arial, sans-serif' },
  { label: 'Monospace', family: 'Courier New, monospace' },
];

const COLORS = ['#1e293b', '#1e40af', '#991b1b', '#166534', '#7c2d12', '#581c87'];

export function OnlineSignatureMakerTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>('draw');
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#1e293b');
  const [lineWidth, setLineWidth] = useState(3);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [typedName, setTypedName] = useState('');
  const [fontIdx, setFontIdx] = useState(0);
  const [fontSize, setFontSize] = useState(48);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getCtx = useCallback(() => canvasRef.current?.getContext('2d') || null, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 250;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const saveState = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    const data = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory(prev => [...prev.slice(-20), data]);
  }, [getCtx]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== 'draw') return;
    e.preventDefault();
    saveState();
    setDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || !lastPos.current || mode !== 'draw') return;
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => {
    setDrawing(false);
    lastPos.current = null;
  };

  const renderTypedSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!typedName) return;
    ctx.font = `italic ${fontSize}px ${FONTS[fontIdx].family}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName, canvas.width / 2, canvas.height * 0.55);
  }, [typedName, fontIdx, fontSize, color]);

  useEffect(() => {
    if (mode === 'type') renderTypedSignature();
  }, [mode, renderTypedSignature]);

  const undo = () => {
    if (history.length === 0) return;
    const ctx = getCtx();
    if (!ctx) return;
    ctx.putImageData(history[history.length - 1], 0, 0);
    setHistory(h => h.slice(0, -1));
  };

  const clearCanvas = () => {
    saveState();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

  };

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'signature.png';
    a.click();
  };

  const downloadTransparent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    // Make white and near-white pixels transparent
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) {
        data[i + 3] = 0;
      }
    }
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCanvas.getContext('2d')!.putImageData(imgData, 0, 0);
    const a = document.createElement('a');
    a.href = tempCanvas.toDataURL('image/png');
    a.download = 'signature-transparent.png';
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2">
        <div className="flex gap-1">
          <button onClick={() => { setMode('draw'); clearCanvas(); }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === 'draw' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
            <Pen className="w-3.5 h-3.5" /> Draw
          </button>
          <button onClick={() => { setMode('type'); setHistory([]); }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === 'type' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
            <Type className="w-3.5 h-3.5" /> Type
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1.5 ml-2">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          {COLORS.map(c => (
            <button key={c} onClick={() => { setColor(c); if (mode === 'type') renderTypedSignature(); }}
              className={`w-5 h-5 rounded-full border-2 transition-transform ${color === c ? 'border-primary-500 scale-110' : 'border-transparent hover:scale-110'}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Draw controls */}
        {mode === 'draw' && (
          <div className="flex items-center gap-2 ml-auto">
            <input type="range" min={1} max={8} value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-16 accent-primary-600" title="Pen thickness" />
            <button onClick={undo} disabled={history.length === 0}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-30" title="Undo">
              <Undo2 className="w-4 h-4" />
            </button>
            <button onClick={clearCanvas} className="p-1.5 text-slate-500 hover:text-red-500" title="Clear">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Type mode controls */}
      {mode === 'type' && (
        <div className="flex flex-wrap items-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2">
          <div className="flex-1 min-w-0">
            <label className="block text-xs text-slate-500 mb-1">Your Name</label>
            <input type="text" value={typedName} onChange={(e) => setTypedName(e.target.value)} placeholder="Type your name"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" maxLength={40} />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font</label>
            <select value={fontIdx} onChange={(e) => setFontIdx(Number(e.target.value))}
              className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm">
              {FONTS.map((f, i) => <option key={f.label} value={i}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Size: {fontSize}px</label>
            <input type="range" min={24} max={72} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20 accent-primary-600" />
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white" style={{ touchAction: 'none' }}>
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair block"
          style={{ height: 250 }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>

      <p className="text-xs text-slate-500 text-center">
        {mode === 'draw' ? 'Draw your signature above using mouse or touch.' : 'Type your name above to generate a signature.'}
      </p>

      {/* Download buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={downloadPNG}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-sm font-medium transition-colors shadow-md">
          <Download className="w-4 h-4" /> Download PNG
        </button>
        <button onClick={downloadTransparent}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium transition-colors">
          <Download className="w-4 h-4" /> Transparent PNG
        </button>
      </div>
    </div>
  );
}
