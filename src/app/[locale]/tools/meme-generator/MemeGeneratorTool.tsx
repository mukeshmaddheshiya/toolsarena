'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Upload, Type, Palette, Image as ImageIcon, X, Plus, Trash2, Move } from 'lucide-react';

interface TextBox {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  strokeColor: string;
  bold: boolean;
}

const MEME_TEMPLATES = [
  { id: 'custom', name: 'Upload Your Own', thumb: '' },
  { id: 'drake', name: 'Drake', w: 600, h: 600, defaultTexts: [{ x: 0.72, y: 0.2, text: 'No' }, { x: 0.72, y: 0.7, text: 'Yes' }] },
  { id: 'distracted', name: 'Distracted BF', w: 800, h: 533, defaultTexts: [{ x: 0.15, y: 0.9, text: 'GF' }, { x: 0.5, y: 0.5, text: 'BF' }, { x: 0.82, y: 0.9, text: 'Other' }] },
  { id: 'think', name: 'Thinking', w: 500, h: 500, defaultTexts: [{ x: 0.5, y: 0.08, text: 'Top text' }] },
  { id: 'success', name: 'Success Kid', w: 500, h: 500, defaultTexts: [{ x: 0.5, y: 0.08, text: 'Top text' }, { x: 0.5, y: 0.92, text: 'Bottom text' }] },
  { id: 'doge', name: 'Doge', w: 620, h: 620, defaultTexts: [{ x: 0.5, y: 0.08, text: 'Wow' }, { x: 0.5, y: 0.92, text: 'Such meme' }] },
];

let nextId = 1;
function uid() { return `tb-${nextId++}`; }

export function MemeGeneratorTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([
    { id: uid(), text: 'TOP TEXT', x: 0.5, y: 0.08, fontSize: 42, color: '#ffffff', strokeColor: '#000000', bold: true },
    { id: uid(), text: 'BOTTOM TEXT', x: 0.5, y: 0.92, fontSize: 42, color: '#ffffff', strokeColor: '#000000', bold: true },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('#1e293b');
  const [canvasSize, setCanvasSize] = useState({ w: 600, h: 600 });
  const [dragging, setDragging] = useState<string | null>(null);

  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvasSize.w;
    canvas.height = canvasSize.h;

    // Background
    if (image) {
      ctx.drawImage(image, 0, 0, canvasSize.w, canvasSize.h);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasSize.w, canvasSize.h);
    }

    // Text boxes
    for (const tb of textBoxes) {
      const x = tb.x * canvasSize.w;
      const y = tb.y * canvasSize.h;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${tb.bold ? 'bold ' : ''}${tb.fontSize}px Impact, Arial, sans-serif`;
      ctx.lineWidth = tb.fontSize / 8;
      ctx.strokeStyle = tb.strokeColor;
      ctx.fillStyle = tb.color;
      ctx.lineJoin = 'round';
      ctx.strokeText(tb.text, x, y);
      ctx.fillText(tb.text, x, y);
    }
  }, [image, textBoxes, bgColor, canvasSize]);

  useEffect(() => { drawMeme(); }, [drawMeme]);

  const loadImage = (src: string) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImage(img);
      setImageSrc(src);
      const maxW = 800;
      const scale = Math.min(1, maxW / img.width);
      setCanvasSize({ w: Math.round(img.width * scale), h: Math.round(img.height * scale) });
    };
    img.src = src;
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => loadImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const updateBox = (id: string, updates: Partial<TextBox>) => {
    setTextBoxes(prev => prev.map(tb => tb.id === id ? { ...tb, ...updates } : tb));
  };

  const addTextBox = () => {
    const id = uid();
    setTextBoxes(prev => [...prev, { id, text: 'NEW TEXT', x: 0.5, y: 0.5, fontSize: 36, color: '#ffffff', strokeColor: '#000000', bold: true }]);
    setSelectedId(id);
  };

  const removeBox = (id: string) => {
    setTextBoxes(prev => prev.filter(tb => tb.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleCanvasPointer = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;

    // Find nearest text box
    let nearest: TextBox | null = null;
    let minD = 0.1;
    for (const tb of textBoxes) {
      const d = Math.sqrt((tb.x - px) ** 2 + (tb.y - py) ** 2);
      if (d < minD) { minD = d; nearest = tb; }
    }
    if (nearest) {
      setSelectedId(nearest.id);
      setDragging(nearest.id);
    }
  };

  const handleCanvasMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const px = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const py = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    updateBox(dragging, { x: px, y: py });
  };

  const download = () => {
    drawMeme();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'meme.png';
    a.click();
  };

  const selected = textBoxes.find(tb => tb.id === selectedId);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
            <span>😂</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Meme Generator</h2>
            <p className="text-red-100 text-xs">Upload image or use blank canvas, add text, download meme</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-3 space-y-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 flex justify-center" style={{ touchAction: 'none' }}>
            <canvas
              ref={canvasRef}
              className="max-w-full cursor-move"
              style={{ maxHeight: 500 }}
              onMouseDown={handleCanvasPointer}
              onMouseMove={handleCanvasMove}
              onMouseUp={() => setDragging(null)}
              onMouseLeave={() => setDragging(null)}
              onTouchStart={handleCanvasPointer}
              onTouchMove={handleCanvasMove}
              onTouchEnd={() => setDragging(null)}
            />
          </div>
          <p className="text-[10px] text-slate-500 text-center">Click & drag text to reposition. Click a text to select it for editing.</p>

          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={download}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-sm font-medium transition-colors shadow-md">
              <Download className="w-4 h-4" /> Download Meme
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Image source */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Image
            </div>
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors">
                <Upload className="w-3.5 h-3.5" /> Upload Image
              </button>
              {image && (
                <button onClick={() => { setImage(null); setImageSrc(null); }}
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />

            {!image && (
              <div>
                <div className="text-[10px] text-slate-500 mb-1">Or set canvas background</div>
                <div className="flex items-center gap-2">
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <input type="number" value={canvasSize.w} onChange={e => setCanvasSize(p => ({ ...p, w: parseInt(e.target.value) || 600 }))}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-xs" placeholder="Width" />
                    <input type="number" value={canvasSize.h} onChange={e => setCanvasSize(p => ({ ...p, h: parseInt(e.target.value) || 600 }))}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-xs" placeholder="Height" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Text Boxes list */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Type className="w-4 h-4" /> Text Layers</span>
              <button onClick={addTextBox}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                <Plus className="w-3 h-3" /> Add Text
              </button>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {textBoxes.map(tb => (
                <div key={tb.id}
                  onClick={() => setSelectedId(tb.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${selectedId === tb.id ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'}`}>
                  <Move className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-xs flex-1 truncate text-slate-700 dark:text-slate-300">{tb.text || '(empty)'}</span>
                  <button onClick={e => { e.stopPropagation(); removeBox(tb.id); }} className="text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected text editor */}
          {selected && (
            <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Edit Text</div>
              <input
                type="text"
                value={selected.text}
                onChange={e => updateBox(selected.id, { text: e.target.value })}
                placeholder="Enter text..."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Font Size</label>
                  <input type="range" min={12} max={80} value={selected.fontSize}
                    onChange={e => updateBox(selected.id, { fontSize: parseInt(e.target.value) })}
                    className="w-full accent-primary-600" />
                  <span className="text-[10px] text-slate-400">{selected.fontSize}px</span>
                </div>
                <div className="flex items-end gap-2 pb-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Fill</label>
                    <input type="color" value={selected.color} onChange={e => updateBox(selected.id, { color: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Stroke</label>
                    <input type="color" value={selected.strokeColor} onChange={e => updateBox(selected.id, { strokeColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0" />
                  </div>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={selected.bold} onChange={e => updateBox(selected.id, { bold: e.target.checked })}
                      className="w-4 h-4 rounded" />
                    <span className="text-[10px] text-slate-500 font-bold">B</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
