// app/tools/color-blindness-simulator/ColorBlindnessSimulatorTool.tsx
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Eye, Upload, Download, X, Info, Pipette } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VisionType {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  affected: string;
  matrix: number[] | null; // null = normal, special = grayscale
  isGrayscale?: boolean;
}

// ─── Vision Types ─────────────────────────────────────────────────────────────

const VISION_TYPES: VisionType[] = [
  {
    id: 'normal',
    label: 'Normal Vision',
    shortLabel: 'Normal',
    description: 'Full color vision as perceived by people without color vision deficiency.',
    affected: '~91% of males, ~99.5% of females',
    matrix: null,
  },
  {
    id: 'deuteranopia',
    label: 'Deuteranopia',
    shortLabel: 'Deuteranopia',
    description: 'Red-green color blindness — missing green cones. Reds and greens appear similar.',
    affected: '~1% of males',
    matrix: [0.367, 0.861, -0.228, 0, 0, 0.280, 0.673, 0.047, 0, 0, -0.012, 0.043, 0.926, 0, 0, 0, 0, 0, 1, 0],
  },
  {
    id: 'protanopia',
    label: 'Protanopia',
    shortLabel: 'Protanopia',
    description: 'Red-green color blindness — missing red cones. Red appears very dark.',
    affected: '~1% of males',
    matrix: [0.152, 1.053, -0.205, 0, 0, 0.115, 0.786, 0.099, 0, 0, -0.004, -0.048, 1.052, 0, 0, 0, 0, 0, 1, 0],
  },
  {
    id: 'tritanopia',
    label: 'Tritanopia',
    shortLabel: 'Tritanopia',
    description: 'Blue-yellow color blindness — missing blue cones. Blues appear green, yellows pink.',
    affected: '~0.003% of population',
    matrix: [1.256, -0.077, -0.179, 0, 0, -0.078, 0.931, 0.148, 0, 0, 0.005, 0.691, 0.304, 0, 0, 0, 0, 0, 1, 0],
  },
  {
    id: 'deuteranomaly',
    label: 'Deuteranomaly',
    shortLabel: 'Deuteranomaly',
    description: 'Weak green cones — milder red-green color weakness, the most common type.',
    affected: '~5% of males',
    matrix: [0.624, 0.374, 0.002, 0, 0, 0.152, 0.772, 0.076, 0, 0, -0.023, 0.062, 0.949, 0, 0, 0, 0, 0, 1, 0],
  },
  {
    id: 'protanomaly',
    label: 'Protanomaly',
    shortLabel: 'Protanomaly',
    description: 'Weak red cones — mild red-green color weakness.',
    affected: '~1% of males',
    matrix: [0.817, 0.183, 0, 0, 0, 0.333, 0.667, 0, 0, 0, 0, 0.125, 0.875, 0, 0, 0, 0, 0, 1, 0],
  },
  {
    id: 'achromatopsia',
    label: 'Achromatopsia',
    shortLabel: 'Monochromacy',
    description: 'Complete color blindness — sees only shades of grey.',
    affected: '~1 in 30,000 people',
    matrix: null,
    isGrayscale: true,
  },
];

// ─── Canvas Processing ────────────────────────────────────────────────────────

function applyColorMatrix(
  sourceData: ImageData,
  visionType: VisionType
): ImageData {
  const src = sourceData.data;
  const output = new ImageData(sourceData.width, sourceData.height);
  const dst = output.data;

  for (let i = 0; i < src.length; i += 4) {
    const r = src[i] / 255;
    const g = src[i + 1] / 255;
    const b = src[i + 2] / 255;
    const a = src[i + 3];

    if (visionType.isGrayscale) {
      // ITU-R BT.601 luminance
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      dst[i]     = Math.round(lum * 255);
      dst[i + 1] = Math.round(lum * 255);
      dst[i + 2] = Math.round(lum * 255);
    } else if (visionType.matrix === null) {
      // Normal vision
      dst[i]     = src[i];
      dst[i + 1] = src[i + 1];
      dst[i + 2] = src[i + 2];
    } else {
      const m = visionType.matrix;
      // 4x5 matrix: [r_scale, g_scale, b_scale, a_scale, offset] × 4 rows
      const nr = m[0]*r + m[1]*g + m[2]*b + m[3]*a/255 + m[4];
      const ng = m[5]*r + m[6]*g + m[7]*b + m[8]*a/255 + m[9];
      const nb = m[10]*r + m[11]*g + m[12]*b + m[13]*a/255 + m[14];
      dst[i]     = Math.min(255, Math.max(0, Math.round(nr * 255)));
      dst[i + 1] = Math.min(255, Math.max(0, Math.round(ng * 255)));
      dst[i + 2] = Math.min(255, Math.max(0, Math.round(nb * 255)));
    }
    dst[i + 3] = a;
  }
  return output;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SimulationCard({
  visionType,
  imageData,
  width,
  height,
}: {
  visionType: VisionType;
  imageData: ImageData | null;
  width: number;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !imageData) return;
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const processed = applyColorMatrix(imageData, visionType);
    ctx.putImageData(processed, 0, 0);
  }, [imageData, visionType, width, height]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${visionType.id}-simulation.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden group">
      {/* Label bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800/80">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{visionType.label}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowInfo((v) => !v)}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            title="Info"
          >
            <Info size={13} />
          </button>
          <button
            onClick={handleDownload}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            title="Download"
          >
            <Download size={13} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative bg-slate-100 dark:bg-slate-950 flex items-center justify-center aspect-video overflow-hidden">
        {imageData ? (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="text-slate-400 dark:text-slate-700 text-xs">No image</div>
        )}
      </div>

      {/* Info panel */}
      {showInfo && (
        <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700/40 text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p>{visionType.description}</p>
          <p className="text-slate-500">Affected: <span className="text-indigo-600 dark:text-indigo-400">{visionType.affected}</span></p>
        </div>
      )}
    </div>
  );
}

// ─── Color Picker Panel ───────────────────────────────────────────────────────

function ColorPickerPanel({ originalImageData }: { originalImageData: ImageData | null }) {
  const [pickedColor, setPickedColor] = useState('#6366f1');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const getSimulatedColor = (hex: string, visionType: VisionType): string => {
    const { r, g, b } = hexToRgb(hex);
    const fakeImageData = {
      data: new Uint8ClampedArray([r, g, b, 255]),
      width: 1,
      height: 1,
    } as ImageData;
    const result = applyColorMatrix(fakeImageData, visionType);
    return rgbToHex(result.data[0], result.data[1], result.data[2]);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Pipette size={16} className="text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Color Vision Picker</h3>
        <span className="text-xs text-slate-500">
          — See how a color appears across all vision types
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Pick a color:</span>
          <input
            type="color"
            value={pickedColor}
            onChange={(e) => setPickedColor(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent p-0.5"
          />
        </label>
        <span className="font-mono text-sm text-slate-700 dark:text-slate-300">{pickedColor.toUpperCase()}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {VISION_TYPES.map((vt) => {
          const simColor = getSimulatedColor(pickedColor, vt);
          return (
            <div key={vt.id} className="flex flex-col items-center gap-1.5">
              <div
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner"
                style={{ backgroundColor: simColor }}
                title={simColor}
              />
              <span className="text-xs text-slate-500 text-center leading-tight">{vt.shortLabel}</span>
              <span className="text-xs font-mono text-slate-600">{simColor.toUpperCase()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ColorBlindnessSimulatorTool() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageName, setImageName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [sideBySide, setSideBySide] = useState(false);
  const [sideBySideType, setSideBySideType] = useState<string>('deuteranopia');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageName(file.name);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      // Limit max dimension for performance
      const MAX = 1200;
      let w = img.width;
      let h = img.height;
      if (w > MAX || h > MAX) {
        const ratio = Math.min(MAX / w, MAX / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h);
      setImageData(data);
      setImageWidth(w);
      setImageHeight(h);
      offscreenCanvasRef.current = canvas;
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadImage(file);
  };

  const clearImage = () => {
    setImageData(null);
    setImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sideBySideVisionType = VISION_TYPES.find((vt) => vt.id === sideBySideType) ?? VISION_TYPES[1];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
          <Eye className="text-indigo-600 dark:text-indigo-400" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Color Blindness Simulator</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Simulate 7 color vision types — all processing is 100% client-side
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      {!imageData ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <Upload size={32} className="mx-auto mb-3 text-slate-400 dark:text-slate-600" />
          <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">Drop your image here</p>
          <p className="text-slate-500 text-sm">or click to browse · PNG, JPG, WebP supported</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{imageName}</span>
              <span className="text-xs text-slate-500 dark:text-slate-600">
                {imageWidth}x{imageHeight}px
              </span>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-slate-600 dark:text-slate-400">Side-by-side</span>
                <button
                  onClick={() => setSideBySide((v) => !v)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    sideBySide ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      sideBySide ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>
              {sideBySide && (
                <select
                  value={sideBySideType}
                  onChange={(e) => setSideBySideType(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200"
                >
                  {VISION_TYPES.filter((v) => v.id !== 'normal').map((vt) => (
                    <option key={vt.id} value={vt.id}>{vt.label}</option>
                  ))}
                </select>
              )}
              <button
                onClick={clearImage}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-500/20 hover:border-red-300 dark:hover:border-red-500/30 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg text-xs transition-colors"
              >
                <X size={12} />
                Remove
              </button>
            </div>
          </div>

          {/* Simulation Grid or Side-by-Side */}
          {sideBySide ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimulationCard
                visionType={VISION_TYPES[0]}
                imageData={imageData}
                width={imageWidth}
                height={imageHeight}
              />
              <SimulationCard
                visionType={sideBySideVisionType}
                imageData={imageData}
                width={imageWidth}
                height={imageHeight}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {VISION_TYPES.map((vt) => (
                <SimulationCard
                  key={vt.id}
                  visionType={vt}
                  imageData={imageData}
                  width={imageWidth}
                  height={imageHeight}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Color Picker */}
      <ColorPickerPanel originalImageData={imageData} />

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { pct: '8%', label: 'of males are color blind', color: 'text-red-500 dark:text-red-400' },
          { pct: '0.5%', label: 'of females are color blind', color: 'text-orange-500 dark:text-orange-400' },
          { pct: '300M', label: 'people worldwide have color blindness', color: 'text-indigo-600 dark:text-indigo-400' },
        ].map(({ pct, label, color }) => (
          <div key={label} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${color}`}>{pct}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
