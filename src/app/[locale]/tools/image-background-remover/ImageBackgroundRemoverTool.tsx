'use client';
import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Loader2, RotateCcw, ImageIcon } from 'lucide-react';

export function ImageBackgroundRemoverTool() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback(async (file: File) => {
    setError(null);
    setProcessing(true);
    setProgress(10);
    setResultImage(null);

    const reader = new FileReader();
    reader.onload = (e) => setOriginalImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setFileName(file.name.replace(/\.[^.]+$/, ''));

    try {
      setProgress(20);
      const { removeBackground } = await import('@imgly/background-removal');
      setProgress(30);

      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round(30 + (current / total) * 60);
            setProgress(Math.min(pct, 90));
          }
        },
      });

      setProgress(95);
      const url = URL.createObjectURL(blob);
      setResultImage(url);
      setProgress(100);
    } catch (err) {
      setError('Failed to remove background. Please try a different image or a smaller file.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }
    processImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = `${fileName}-no-bg.png`;
    a.click();
  };

  const reset = () => {
    setOriginalImage(null);
    setResultImage(null);
    setError(null);
    setProcessing(false);
    setProgress(0);
    setFileName('');
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      {!originalImage && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors"
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">
            Drop your image here or click to upload
          </p>
          <p className="text-sm text-slate-500">Supports JPEG, PNG, WebP — Max 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {/* Processing state */}
      {processing && (
        <div className="text-center py-8">
          <Loader2 className="w-10 h-10 text-primary-600 mx-auto mb-4 animate-spin" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Removing background... This may take 10-30 seconds
          </p>
          <div className="w-64 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            First use downloads the AI model (~40MB). Subsequent uses are faster.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {originalImage && !processing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Results</h3>
            <div className="flex gap-2">
              {resultImage && (
                <button onClick={handleDownload} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors">
                  <Download className="w-4 h-4" /> Download PNG
                </button>
              )}
              <button onClick={reset} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium transition-colors">
                <RotateCcw className="w-4 h-4" /> New Image
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Original</p>
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                <img src={originalImage} alt="Original" className="w-full h-auto max-h-96 object-contain" />
              </div>
            </div>

            {/* Result */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Background Removed</p>
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden" style={{ backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%)', backgroundSize: '20px 20px' }}>
                {resultImage ? (
                  <img src={resultImage} alt="Background removed" className="w-full h-auto max-h-96 object-contain" />
                ) : (
                  <div className="flex items-center justify-center h-64 text-slate-400">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
