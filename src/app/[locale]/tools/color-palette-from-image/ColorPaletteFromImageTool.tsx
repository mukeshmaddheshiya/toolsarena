'use client';
import { useState, useRef, useCallback } from 'react';
import { Upload, Copy, Check, Palette, X, Image as ImageIcon } from 'lucide-react';

interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
  count: number;
  pct: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function colorDistance(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function extractColors(imageData: ImageData, numColors: number): ExtractedColor[] {
  const { data, width, height } = imageData;
  const step = Math.max(1, Math.floor((width * height) / 10000)); // sample ~10K pixels
  const samples: [number, number, number][] = [];

  for (let i = 0; i < data.length; i += 4 * step) {
    const a = data[i + 3];
    if (a < 128) continue; // skip transparent
    // Quantize to reduce noise
    const r = Math.round(data[i] / 8) * 8;
    const g = Math.round(data[i + 1] / 8) * 8;
    const b = Math.round(data[i + 2] / 8) * 8;
    samples.push([r, g, b]);
  }

  if (samples.length === 0) return [];

  // Simple k-means clustering
  let centroids: [number, number, number][] = [];
  const spacing = Math.floor(samples.length / numColors);
  for (let i = 0; i < numColors; i++) {
    centroids.push([...samples[Math.min(i * spacing, samples.length - 1)]]);
  }

  for (let iter = 0; iter < 15; iter++) {
    const clusters: [number, number, number][][] = centroids.map(() => []);
    for (const s of samples) {
      let minD = Infinity, minIdx = 0;
      for (let c = 0; c < centroids.length; c++) {
        const d = colorDistance(s, centroids[c]);
        if (d < minD) { minD = d; minIdx = c; }
      }
      clusters[minIdx].push(s);
    }
    let changed = false;
    for (let c = 0; c < centroids.length; c++) {
      if (clusters[c].length === 0) continue;
      const avg: [number, number, number] = [0, 0, 0];
      for (const s of clusters[c]) { avg[0] += s[0]; avg[1] += s[1]; avg[2] += s[2]; }
      const newC: [number, number, number] = [
        Math.round(avg[0] / clusters[c].length),
        Math.round(avg[1] / clusters[c].length),
        Math.round(avg[2] / clusters[c].length),
      ];
      if (colorDistance(newC, centroids[c]) > 2) changed = true;
      centroids[c] = newC;
    }
    if (!changed) break;
  }

  // Count pixels per centroid
  const counts = centroids.map(() => 0);
  for (const s of samples) {
    let minD = Infinity, minIdx = 0;
    for (let c = 0; c < centroids.length; c++) {
      const d = colorDistance(s, centroids[c]);
      if (d < minD) { minD = d; minIdx = c; }
    }
    counts[minIdx]++;
  }

  const total = samples.length;
  return centroids
    .map((c, i) => ({
      hex: rgbToHex(c[0], c[1], c[2]),
      rgb: c,
      count: counts[i],
      pct: (counts[i] / total) * 100,
    }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count);
}

function luminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function ColorPaletteFromImageTool() {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [numColors, setNumColors] = useState(6);
  const [processing, setProcessing] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback((src: string, count: number) => {
    setProcessing(true);
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current!;
      const maxDim = 600;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const extracted = extractColors(data, count);
      setColors(extracted);
      setProcessing(false);
    };
    img.src = src;
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImage(src);
      processImage(src, numColors);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const copyColor = async (hex: string, idx: number) => {
    await navigator.clipboard.writeText(hex);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const reExtract = (count: number) => {
    setNumColors(count);
    if (image) processImage(image, count);
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Color Palette from Image</h2>
            <p className="text-pink-100 text-xs">Extract dominant colors from any image instantly</p>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload & Preview */}
        <div className="space-y-4">
          {!image ? (
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
            >
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Drop an image here or click to upload</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP supported</p>
            </div>
          ) : (
            <div className="relative">
              <img src={image} alt="Uploaded" className="w-full rounded-xl border border-slate-200 dark:border-slate-700" />
              <button
                onClick={() => { setImage(null); setColors([]); }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />

          {image && (
            <div className="flex items-center gap-3">
              <button onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
                <ImageIcon className="w-3.5 h-3.5" /> Change Image
              </button>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">Colors:</span>
                {[4, 6, 8, 10, 12].map(c => (
                  <button key={c} onClick={() => reExtract(c)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${numColors === c ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-primary-100'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colors Panel */}
        <div className="space-y-4">
          {processing && (
            <div className="flex items-center justify-center py-10 text-sm text-slate-500">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-2" />
              Extracting colors...
            </div>
          )}

          {!processing && colors.length > 0 && (
            <>
              {/* Palette strip */}
              <div className="flex h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                {colors.map((c, i) => (
                  <div
                    key={i}
                    className="cursor-pointer hover:opacity-80 transition-opacity relative group"
                    style={{ backgroundColor: c.hex, flex: c.pct }}
                    onClick={() => copyColor(c.hex, i)}
                    title={c.hex}
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedIdx === i ? <Check className="w-4 h-4" style={{ color: luminance(...c.rgb) > 0.5 ? '#000' : '#fff' }} /> : <Copy className="w-3.5 h-3.5" style={{ color: luminance(...c.rgb) > 0.5 ? '#000' : '#fff' }} />}
                    </span>
                  </div>
                ))}
              </div>

              {/* Color Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {colors.map((c, i) => {
                  const [h, s, l] = rgbToHsl(...c.rgb);
                  const textColor = luminance(...c.rgb) > 0.5 ? '#1e293b' : '#ffffff';
                  return (
                    <button
                      key={i}
                      onClick={() => copyColor(c.hex, i)}
                      className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow text-left"
                    >
                      <div className="h-16 relative flex items-end p-2" style={{ backgroundColor: c.hex }}>
                        <span className="text-sm font-bold font-mono" style={{ color: textColor }}>{c.hex.toUpperCase()}</span>
                        {copiedIdx === i && (
                          <span className="absolute top-1 right-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/30 text-white">Copied!</span>
                        )}
                      </div>
                      <div className="px-2 py-1.5 bg-white dark:bg-slate-800 space-y-0.5">
                        <div className="text-[10px] text-slate-500">RGB({c.rgb.join(', ')})</div>
                        <div className="text-[10px] text-slate-500">HSL({h}, {s}%, {l}%)</div>
                        <div className="text-[10px] text-slate-400">{c.pct.toFixed(1)}% of image</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* CSS / Tailwind export */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Copy as CSS Variables</div>
                <pre className="text-[11px] text-slate-600 dark:text-slate-400 font-mono bg-white dark:bg-slate-800 rounded-lg p-2 overflow-x-auto border border-slate-200 dark:border-slate-700">
                  {`:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`}
                </pre>
                <button
                  onClick={() => { navigator.clipboard.writeText(`:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`); }}
                  className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  <Copy className="w-3 h-3" /> Copy CSS
                </button>
              </div>
            </>
          )}

          {!processing && colors.length === 0 && !image && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 text-center text-sm text-slate-500">
              Upload an image to extract its color palette
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
