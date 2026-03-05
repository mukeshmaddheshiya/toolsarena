'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Pen, Eraser, Download, Trash2, Undo2, Circle, Minus } from 'lucide-react';

type Tool = 'pen' | 'eraser';

export function OnlineWhiteboardTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#1e293b');
  const [lineWidth, setLineWidth] = useState(3);
  const [history, setHistory] = useState<ImageData[]>([]);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getCtx = useCallback(() => canvasRef.current?.getContext('2d') || null, []);

  const saveState = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    const data = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory(prev => [...prev.slice(-30), data]);
  }, [getCtx]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const ctx = canvas.getContext('2d')!;
      const imgData = canvas.width > 0 ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
      canvas.width = rect.width;
      canvas.height = Math.max(500, rect.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (imgData) ctx.putImageData(imgData, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

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
    e.preventDefault();
    saveState();
    setDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || !lastPos.current) return;
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 4 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => {
    setDrawing(false);
    lastPos.current = null;
  };

  const undo = () => {
    if (history.length === 0) return;
    const ctx = getCtx();
    if (!ctx) return;
    const prev = history[history.length - 1];
    ctx.putImageData(prev, 0, 0);
    setHistory(h => h.slice(0, -1));
  };

  const clearCanvas = () => {
    saveState();
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = `whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
  };

  const COLORS = ['#1e293b', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2">
        {/* Tools */}
        <div className="flex gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
          <button onClick={() => setTool('pen')}
            className={`p-2 rounded-lg transition-colors ${tool === 'pen' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`} title="Pen">
            <Pen className="w-4 h-4" />
          </button>
          <button onClick={() => setTool('eraser')}
            className={`p-2 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`} title="Eraser">
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Colors */}
        {tool === 'pen' && (
          <div className="flex gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c ? 'border-primary-500 scale-110' : 'border-transparent hover:scale-110'}`}
                style={{ backgroundColor: c }} title={c} />
            ))}
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
              className="w-6 h-6 rounded-full cursor-pointer border-0" title="Custom color" />
          </div>
        )}

        {/* Line width */}
        <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
          <Minus className="w-3 h-3 text-slate-400" />
          <input type="range" min={1} max={20} value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-20 accent-primary-600" />
          <Circle className="w-4 h-4 text-slate-400" />
        </div>

        {/* Actions */}
        <div className="flex gap-1 ml-auto">
          <button onClick={undo} disabled={history.length === 0}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-30" title="Undo">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={clearCanvas} className="p-2 text-slate-500 hover:text-red-500" title="Clear">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={handleDownload}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-xs font-medium transition-colors">
            <Download className="w-3.5 h-3.5" /> Save PNG
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white" style={{ touchAction: 'none' }}>
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair block"
          style={{ minHeight: 500 }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>
    </div>
  );
}
