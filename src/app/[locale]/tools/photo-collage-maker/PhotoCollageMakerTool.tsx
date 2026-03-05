'use client';
import { useState, useRef, useCallback } from 'react';
import { Upload, Download, X, Grid3X3, LayoutGrid, Plus, RotateCcw } from 'lucide-react';

interface CollageImage {
  id: string;
  src: string;
  name: string;
}

interface LayoutDef {
  id: string;
  name: string;
  icon: string;
  cells: number;
  // Each cell: [x%, y%, w%, h%]
  positions: [number, number, number, number][];
}

const LAYOUTS: LayoutDef[] = [
  { id: '2h', name: '2 Horizontal', icon: '▬▬', cells: 2, positions: [[0, 0, 50, 100], [50, 0, 50, 100]] },
  { id: '2v', name: '2 Vertical', icon: '▐▐', cells: 2, positions: [[0, 0, 100, 50], [0, 50, 100, 50]] },
  { id: '3l', name: '3 Left Focus', icon: '█▐', cells: 3, positions: [[0, 0, 60, 100], [60, 0, 40, 50], [60, 50, 40, 50]] },
  { id: '3r', name: '3 Right Focus', icon: '▐█', cells: 3, positions: [[0, 0, 40, 50], [0, 50, 40, 50], [40, 0, 60, 100]] },
  { id: '3h', name: '3 Horizontal', icon: '▬▬▬', cells: 3, positions: [[0, 0, 33.33, 100], [33.33, 0, 33.34, 100], [66.67, 0, 33.33, 100]] },
  { id: '4g', name: '4 Grid', icon: '⊞', cells: 4, positions: [[0, 0, 50, 50], [50, 0, 50, 50], [0, 50, 50, 50], [50, 50, 50, 50]] },
  { id: '4t', name: '4 Top Focus', icon: '█▬', cells: 4, positions: [[0, 0, 100, 55], [0, 55, 33.33, 45], [33.33, 55, 33.34, 45], [66.67, 55, 33.33, 45]] },
  { id: '5x', name: '5 Mixed', icon: '⊞+', cells: 5, positions: [[0, 0, 50, 50], [50, 0, 50, 50], [0, 50, 33.33, 50], [33.33, 50, 33.34, 50], [66.67, 50, 33.33, 50]] },
  { id: '6g', name: '6 Grid', icon: '⊞⊞', cells: 6, positions: [[0, 0, 33.33, 50], [33.33, 0, 33.34, 50], [66.67, 0, 33.33, 50], [0, 50, 33.33, 50], [33.33, 50, 33.34, 50], [66.67, 50, 33.33, 50]] },
  { id: '9g', name: '9 Grid', icon: '▦', cells: 9, positions: Array.from({ length: 9 }, (_, i) => [((i % 3) * 33.33), (Math.floor(i / 3) * 33.33), 33.33, 33.34] as [number, number, number, number]) },
];

const BORDER_OPTIONS = [0, 2, 4, 6, 8, 10, 14];
const BG_COLORS = ['#ffffff', '#000000', '#1e293b', '#f97316', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
const SIZES = [
  { label: 'Instagram Post', w: 1080, h: 1080 },
  { label: 'Instagram Story', w: 1080, h: 1920 },
  { label: 'Facebook Cover', w: 820, h: 312 },
  { label: 'HD (1920x1080)', w: 1920, h: 1080 },
  { label: 'Square (1000)', w: 1000, h: 1000 },
  { label: 'A4 Landscape', w: 1123, h: 794 },
];

let nextId = 1;

export function PhotoCollageMakerTool() {
  const [images, setImages] = useState<CollageImage[]>([]);
  const [layoutId, setLayoutId] = useState('4g');
  const [borderWidth, setBorderWidth] = useState(4);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderRadius, setBorderRadius] = useState(0);
  const [outputSize, setOutputSize] = useState({ w: 1080, h: 1080 });
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const layout = LAYOUTS.find(l => l.id === layoutId) || LAYOUTS[5];

  const addImages = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        setImages(prev => [...prev, { id: `img-${nextId++}`, src: reader.result as string, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => setImages(prev => prev.filter(i => i.id !== id));

  const drawCollage = useCallback(async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    canvas.width = outputSize.w;
    canvas.height = outputSize.h;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each cell
    const positions = layout.positions;
    const promises = positions.map((pos, i) => {
      return new Promise<void>((resolve) => {
        const imgData = images[i % images.length];
        if (!imgData || images.length === 0) {
          resolve();
          return;
        }

        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const bw = borderWidth;
          const x = (pos[0] / 100) * canvas.width + bw;
          const y = (pos[1] / 100) * canvas.height + bw;
          const w = (pos[2] / 100) * canvas.width - bw * 2;
          const h = (pos[3] / 100) * canvas.height - bw * 2;

          ctx.save();
          if (borderRadius > 0) {
            const r = borderRadius;
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
            ctx.clip();
          }

          // Cover fill
          const imgRatio = img.width / img.height;
          const cellRatio = w / h;
          let sx = 0, sy = 0, sw = img.width, sh = img.height;
          if (imgRatio > cellRatio) {
            sw = img.height * cellRatio;
            sx = (img.width - sw) / 2;
          } else {
            sh = img.width / cellRatio;
            sy = (img.height - sh) / 2;
          }
          ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
          ctx.restore();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = imgData.src;
      });
    });

    await Promise.all(promises);
    return canvas;
  }, [images, layout, borderWidth, bgColor, borderRadius, outputSize]);

  const download = async () => {
    if (images.length === 0) return;
    const canvas = await drawCollage();
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'collage.png';
    a.click();
  };

  const previewRatio = outputSize.w / outputSize.h;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Photo Collage Maker</h2>
            <p className="text-pink-100 text-xs">Create beautiful collages with 10 layouts | Instagram, Facebook sizes</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Upload */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Photos ({images.length})</span>
              <button onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                <Plus className="w-3 h-3" /> Add Photos
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { if (e.target.files) addImages(e.target.files); e.target.value = ''; }} />

            {images.length === 0 ? (
              <div onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Click to add photos</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto">
                {images.map((img, i) => (
                  <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 bg-black/50 text-white text-[9px] px-1 rounded-br">{i + 1}</div>
                    <button onClick={() => removeImage(img.id)}
                      className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {images.length > 0 && (
              <button onClick={() => setImages([])} className="text-[10px] text-red-500 hover:text-red-600 flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>

          {/* Layout */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Grid3X3 className="w-4 h-4" /> Layout</span>
            <div className="grid grid-cols-5 gap-1.5">
              {LAYOUTS.map(l => (
                <button key={l.id} onClick={() => setLayoutId(l.id)}
                  className={`aspect-square rounded-lg text-xs font-mono flex flex-col items-center justify-center transition-colors ${layoutId === l.id ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600 hover:bg-primary-50'}`}>
                  <span className="text-[10px]">{l.icon}</span>
                  <span className="text-[8px] mt-0.5">{l.cells}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Output Size</span>
            <div className="flex flex-wrap gap-1.5">
              {SIZES.map(s => (
                <button key={s.label} onClick={() => setOutputSize({ w: s.w, h: s.h })}
                  className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${outputSize.w === s.w && outputSize.h === s.h ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600 hover:bg-primary-50'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Style</span>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Border: {borderWidth}px</label>
              <div className="flex gap-1">
                {BORDER_OPTIONS.map(b => (
                  <button key={b} onClick={() => setBorderWidth(b)}
                    className={`w-8 h-8 rounded-lg text-[10px] font-medium transition-colors ${borderWidth === b ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600'}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Corner Radius: {borderRadius}px</label>
              <input type="range" min={0} max={30} value={borderRadius} onChange={e => setBorderRadius(Number(e.target.value))} className="w-full accent-primary-600" />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Background</label>
              <div className="flex gap-1.5">
                {BG_COLORS.map(c => (
                  <button key={c} onClick={() => setBgColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${bgColor === c ? 'border-primary-500 scale-110' : 'border-slate-300 dark:border-slate-600 hover:scale-110'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-center" style={{ minHeight: 300 }}>
            {images.length > 0 ? (
              <div className="relative w-full" style={{ maxWidth: 500, aspectRatio: previewRatio, backgroundColor: bgColor, borderRadius: 8, overflow: 'hidden' }}>
                {layout.positions.map((pos, i) => {
                  const imgData = images[i % images.length];
                  if (!imgData) return null;
                  return (
                    <div key={i} className="absolute overflow-hidden" style={{
                      left: `${pos[0]}%`, top: `${pos[1]}%`,
                      width: `${pos[2]}%`, height: `${pos[3]}%`,
                      padding: borderWidth,
                    }}>
                      <img src={imgData.src} alt="" className="w-full h-full object-cover" style={{ borderRadius }} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-sm text-slate-500 py-10">
                <LayoutGrid className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p>Add photos to create your collage</p>
              </div>
            )}
          </div>
          <div className="text-center text-[10px] text-slate-400">{outputSize.w} x {outputSize.h} px</div>

          <div className="flex justify-center">
            <button onClick={download} disabled={images.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-sm font-medium transition-colors shadow-md disabled:opacity-40">
              <Download className="w-4 h-4" /> Download Collage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
