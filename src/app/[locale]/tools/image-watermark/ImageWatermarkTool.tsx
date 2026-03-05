'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, RotateCcw, Type } from 'lucide-react';

export function ImageWatermarkTool() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [watermarkText, setWatermarkText] = useState('ToolsArena');
  const [fontSize, setFontSize] = useState(32);
  const [opacity, setOpacity] = useState(0.3);
  const [color, setColor] = useState('#ffffff');
  const [position, setPosition] = useState<'center' | 'bottom-right' | 'bottom-left' | 'tile'>('center');
  const [rotation, setRotation] = useState(-30);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFileName(file.name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => { imgRef.current = img; setImage(e.target?.result as string); };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (position === 'tile') {
      const stepX = fontSize * 8;
      const stepY = fontSize * 4;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
        for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
          ctx.fillText(watermarkText, x - canvas.width / 2, y - canvas.height / 2);
        }
      }
      ctx.restore();
    } else {
      let x = canvas.width / 2;
      let y = canvas.height / 2;
      if (position === 'bottom-right') { x = canvas.width - fontSize * 2; y = canvas.height - fontSize; ctx.textAlign = 'right'; }
      if (position === 'bottom-left') { x = fontSize * 2; y = canvas.height - fontSize; ctx.textAlign = 'left'; }
      ctx.save();
      ctx.translate(x, y);
      if (position === 'center') ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillText(watermarkText, 0, 0);
      // Add stroke for readability
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeText(watermarkText, 0, 0);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }, [watermarkText, fontSize, opacity, color, position, rotation]);

  useEffect(() => { if (image) renderCanvas(); }, [image, renderCanvas]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = `${fileName}-watermarked.png`;
    a.click();
  };

  const reset = () => { setImage(null); setFileName(''); };

  return (
    <div className="space-y-6">
      {!image && (
        <div
          onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors"
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">Drop your image here or click to upload</p>
          <p className="text-sm text-slate-500">Supports JPEG, PNG, WebP</p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      )}

      {image && (
        <>
          {/* Controls */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Watermark Text</label>
                <div className="flex gap-1">
                  <Type className="w-4 h-4 text-slate-400 mt-2" />
                  <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Position</label>
                <select value={position} onChange={(e) => setPosition(e.target.value as typeof position)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm">
                  <option value="center">Center</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="tile">Tile (Repeat)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Font Size: {fontSize}px</label>
                <input type="range" min={12} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-primary-600" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Opacity: {Math.round(opacity * 100)}%</label>
                <input type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-primary-600" />
              </div>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Color</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-9 rounded border border-slate-300 cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Rotation: {rotation}°</label>
                <input type="range" min={-180} max={180} value={rotation} onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-32 accent-primary-600" />
              </div>
              <div className="ml-auto flex gap-2">
                <button onClick={handleDownload} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors">
                  <Download className="w-4 h-4 inline mr-1" /> Download
                </button>
                <button onClick={reset} className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <RotateCcw className="w-4 h-4 inline mr-1" /> New Image
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <canvas ref={canvasRef} className="max-w-full h-auto mx-auto block" />
          </div>
        </>
      )}
    </div>
  );
}
