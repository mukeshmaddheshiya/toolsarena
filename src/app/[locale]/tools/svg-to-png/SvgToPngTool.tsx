'use client';
import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, FileCode } from 'lucide-react';

export function SvgToPngTool() {
  const [svgContent, setSvgContent] = useState('');
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(2);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparent, setTransparent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSvg = (content: string, name: string) => {
    setError(null);
    setPngUrl(null);
    setSvgContent(content);
    setFileName(name.replace(/\.svg$/i, ''));

    const blob = new Blob([content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    setSvgUrl(url);
  };

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.svg') && file.type !== 'image/svg+xml') {
      setError('Please upload an SVG file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => loadSvg(e.target?.result as string, file.name);
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const convert = () => {
    if (!svgContent) return;
    setError(null);

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) { setError('Invalid SVG content.'); return; }

    let w = parseFloat(svgEl.getAttribute('width') || '300');
    let h = parseFloat(svgEl.getAttribute('height') || '150');

    const vb = svgEl.getAttribute('viewBox');
    if (vb) {
      const parts = vb.split(/[\s,]+/).map(Number);
      if (parts.length === 4) { w = parts[2]; h = parts[3]; }
    }

    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d')!;

    if (!transparent) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const img = new Image();
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const png = canvas.toDataURL('image/png');
      setPngUrl(png);
    };
    img.onerror = () => {
      setError('Failed to render SVG. Make sure it is valid.');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleDownload = () => {
    if (!pngUrl) return;
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `${fileName}-${scale}x.png`;
    a.click();
  };

  const reset = () => {
    setSvgContent('');
    setSvgUrl(null);
    setPngUrl(null);
    setError(null);
    setFileName('image');
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!svgContent && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors"
        >
          <FileCode className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">
            Drop your SVG file here or click to upload
          </p>
          <p className="text-sm text-slate-500">Or paste SVG code below</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {/* Paste SVG code */}
      {!svgContent && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Or paste SVG code</label>
          <textarea
            rows={6}
            placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>'
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm p-3 font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            onBlur={(e) => {
              const val = e.target.value.trim();
              if (val.startsWith('<svg')) loadSvg(val, 'pasted-svg');
            }}
          />
        </div>
      )}

      {/* Settings + Convert */}
      {svgContent && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Scale</label>
              <select value={scale} onChange={(e) => setScale(Number(e.target.value))} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm px-3 py-2">
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={3}>3x</option>
                <option value={4}>4x</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="transparent" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="rounded" />
              <label htmlFor="transparent" className="text-sm text-slate-700 dark:text-slate-300">Transparent background</label>
            </div>
            {!transparent && (
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Background</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-9 rounded border border-slate-300 cursor-pointer" />
              </div>
            )}
            <button onClick={convert} className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors">
              Convert to PNG
            </button>
            <button onClick={reset} className="inline-flex items-center gap-1 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Preview */}
      {svgContent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">SVG Preview</p>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 flex items-center justify-center min-h-[200px]">
              {svgUrl && <img src={svgUrl} alt="SVG preview" className="max-w-full max-h-80 object-contain" />}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">PNG Output</p>
              {pngUrl && (
                <button onClick={handleDownload} className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              )}
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex items-center justify-center min-h-[200px]" style={{ backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%)', backgroundSize: '16px 16px' }}>
              {pngUrl ? (
                <img src={pngUrl} alt="PNG output" className="max-w-full max-h-80 object-contain" />
              ) : (
                <p className="text-sm text-slate-400 p-4">Click &quot;Convert to PNG&quot; to generate</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
