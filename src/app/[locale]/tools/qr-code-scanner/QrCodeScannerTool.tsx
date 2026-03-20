'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import {
  ScanLine,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Wifi,
  AlertCircle,
  X,
  ImageIcon,
  Loader2,
} from 'lucide-react';

type DecodeResult =
  | { type: 'url'; raw: string; url: string }
  | { type: 'wifi'; raw: string; ssid: string; password: string; encryption: string; hidden: boolean }
  | { type: 'text'; raw: string };

function parseWifi(raw: string): { ssid: string; password: string; encryption: string; hidden: boolean } | null {
  // Format: WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
  if (!raw.toUpperCase().startsWith('WIFI:')) return null;
  const get = (key: string): string => {
    const match = raw.match(new RegExp(`${key}:([^;]*)`));
    return match ? match[1] : '';
  };
  return {
    ssid: get('S'),
    password: get('P'),
    encryption: get('T') || 'None',
    hidden: get('H').toLowerCase() === 'true',
  };
}

function classifyResult(raw: string): DecodeResult {
  // WiFi
  if (raw.toUpperCase().startsWith('WIFI:')) {
    const wifi = parseWifi(raw);
    if (wifi) return { type: 'wifi', raw, ...wifi };
  }
  // URL
  if (/^https?:\/\//i.test(raw)) {
    return { type: 'url', raw, url: raw };
  }
  return { type: 'text', raw };
}

export function QrCodeScannerTool() {
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resetState = () => {
    setResult(null);
    setError(null);
    setCopied(false);
    setCopiedField(null);
  };

  const decodeImage = useCallback(async (file: File) => {
    resetState();
    setIsDecoding(true);

    const url = URL.createObjectURL(file);
    setImagePreview(url);

    try {
      const jsQR = (await import('jsqr')).default;

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
      });

      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        setResult(classifyResult(code.data));
      } else {
        setError('No QR code found in image. Try a clearer or higher-resolution photo.');
      }
    } catch (err) {
      setError('Failed to process image. Please try a different file.');
    } finally {
      setIsDecoding(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) decodeImage(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        decodeImage(file);
      } else {
        setError('Please drop an image file (PNG, JPG, WebP, GIF).');
      }
    },
    [decodeImage]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const copyText = async (text: string, field?: string) => {
    await navigator.clipboard.writeText(text);
    if (field) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setImagePreview(null);
    resetState();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !imagePreview && fileInputRef.current?.click()}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 scale-[1.01]'
            : imagePreview
            ? 'border-slate-200 dark:border-slate-700 cursor-default'
            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }
        `}
      >
        {imagePreview ? (
          <div className="relative p-4">
            {/* Clear button */}
            <button
              onClick={(e) => { e.stopPropagation(); clearAll(); }}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-slate-800/70 text-white hover:bg-slate-900 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={imagePreview}
              alt="Uploaded QR code"
              className="max-h-72 mx-auto rounded-xl object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <ScanLine className="w-8 h-8 text-indigo-500" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                Drop a QR code image here
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                or click to browse — PNG, JPG, WebP, GIF
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Screenshots, photos, saved images all work</span>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload button when image is shown */}
      {imagePreview && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload a different image
        </button>
      )}

      {/* Decoding spinner */}
      {isDecoding && (
        <div className="flex items-center justify-center gap-3 py-6 text-indigo-600 dark:text-indigo-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Scanning for QR code…</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Result panels */}
      {result && !isDecoding && (
        <div className="space-y-4">
          {/* URL result */}
          {result.type === 'url' && (
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">URL Detected</h3>
              </div>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-indigo-600 dark:text-indigo-400 break-all hover:underline font-mono bg-white dark:bg-slate-900 rounded-lg px-3 py-2.5 border border-indigo-100 dark:border-indigo-900"
              >
                {result.url}
              </a>
              <button
                onClick={() => copyText(result.raw)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          )}

          {/* WiFi result */}
          {result.type === 'wifi' && (
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">WiFi Network</h3>
              </div>
              <div className="grid gap-3">
                <InfoRow label="Network Name (SSID)" value={result.ssid} onCopy={() => copyText(result.ssid, 'ssid')} copied={copiedField === 'ssid'} />
                <InfoRow label="Password" value={result.password || '(none)'} onCopy={result.password ? () => copyText(result.password, 'password') : undefined} copied={copiedField === 'password'} secret />
                <InfoRow label="Security" value={result.encryption} />
                {result.hidden && <InfoRow label="Hidden Network" value="Yes" />}
              </div>
            </div>
          )}

          {/* Plain text result */}
          {result.type === 'text' && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Decoded Text</h3>
              </div>
              <pre className="text-sm text-slate-700 dark:text-slate-300 break-all whitespace-pre-wrap font-mono bg-white dark:bg-slate-900 rounded-lg px-3 py-2.5 border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto">
                {result.raw}
              </pre>
              <button
                onClick={() => copyText(result.raw)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Privacy note */}
      <p className="text-xs text-center text-slate-400 dark:text-slate-500">
        All decoding happens locally in your browser. No images are uploaded to any server.
      </p>
    </div>
  );
}

// ─── Helper component ──────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
  secret?: boolean;
}

function InfoRow({ label, value, onCopy, copied, secret }: InfoRowProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-lg px-3 py-2.5 border border-emerald-100 dark:border-emerald-900">
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        <p className="text-sm font-mono text-slate-800 dark:text-slate-100 truncate">
          {secret && !revealed ? '••••••••' : value}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {secret && (
          <button
            onClick={() => setRevealed((r) => !r)}
            className="text-xs px-2 py-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {revealed ? 'Hide' : 'Show'}
          </button>
        )}
        {onCopy && (
          <button
            onClick={onCopy}
            className="p-1.5 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400 transition-colors"
            aria-label="Copy value"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
