'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Image, Type, Download, Copy, Upload, Check, Archive } from 'lucide-react';

type Mode = 'image' | 'text';

const SIZES = [16, 32, 48, 180, 192, 512] as const;
const FONTS = ['Arial', 'Georgia', 'monospace'] as const;

export function FaviconGeneratorTool() {
  const [mode, setMode] = useState<Mode>('image');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [text, setText] = useState('A');
  const [fontSize, setFontSize] = useState(70);
  const [bgColor, setBgColor] = useState('#6366f1');
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgTransparent, setBgTransparent] = useState(false);
  const [borderRadius, setBorderRadius] = useState(20);
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const generateFromImage = useCallback((src: string) => {
    const img = new window.Image();
    img.onload = () => {
      const result: Record<number, string> = {};
      for (const size of SIZES) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, size, size);
        result[size] = canvas.toDataURL('image/png');
      }
      setPreviews(result);
    };
    img.src = src;
  }, []);

  const generateFromText = useCallback(() => {
    const result: Record<number, string> = {};
    for (const size of SIZES) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      const r = (borderRadius / 100) * (size / 2);
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(size - r, 0);
      ctx.quadraticCurveTo(size, 0, size, r);
      ctx.lineTo(size, size - r);
      ctx.quadraticCurveTo(size, size, size - r, size);
      ctx.lineTo(r, size);
      ctx.quadraticCurveTo(0, size, 0, size - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();

      if (!bgTransparent) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
      }

      const scaledFont = Math.round((fontSize / 100) * size);
      ctx.fillStyle = textColor;
      ctx.font = `bold ${scaledFont}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.slice(0, 2), size / 2, size / 2 + scaledFont * 0.05);

      result[size] = canvas.toDataURL('image/png');
    }
    setPreviews(result);
  }, [text, fontSize, bgColor, textColor, bgTransparent, borderRadius, fontFamily]);

  useEffect(() => {
    if (mode === 'text') generateFromText();
  }, [mode, generateFromText]);

  useEffect(() => {
    if (mode === 'image' && imageSrc) generateFromImage(imageSrc);
  }, [mode, imageSrc, generateFromImage]);

  const handleFile = (file: File) => {
    if (!file.type.match(/^image\/(png|jpeg|svg\+xml|webp)$/)) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      generateFromImage(src);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const downloadPng = (size: number) => {
    const url = previews[size];
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `favicon-${size}x${size}.png`;
    a.click();
  };

  const htmlTags = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">`;

  const copyHtml = async () => {
    await navigator.clipboard.writeText(htmlTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [zipping, setZipping] = useState(false);

  const downloadZip = async () => {
    if (!hasPreviews) return;
    setZipping(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      for (const size of SIZES) {
        const dataUrl = previews[size];
        if (!dataUrl) continue;
        const base64 = dataUrl.split(',')[1];
        zip.file(`favicon-${size}x${size}.png`, base64, { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'favicons.zip';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) { console.error('ZIP failed:', e); }
    finally { setZipping(false); }
  };

  const hasPreviews = Object.keys(previews).length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-6 text-center text-white sm:p-10">
        <h1 className="text-2xl font-bold sm:text-3xl">Favicon Generator</h1>
        <p className="mt-2 text-purple-100">
          Create favicons from an image or text/emoji — download PNGs for every size.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {([['image', Image, 'From Image'], ['text', Type, 'From Text / Emoji']] as const).map(
          ([key, Icon, label]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                mode === key
                  ? 'bg-white text-purple-700 shadow dark:bg-gray-700 dark:text-purple-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          )
        )}
      </div>

      {/* Image Mode */}
      {mode === 'image' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition ${
            dragOver
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-300 bg-gray-50 hover:border-purple-400 dark:border-gray-600 dark:bg-gray-800/50'
          }`}
        >
          <Upload className="mb-3 h-10 w-10 text-purple-500" />
          <p className="font-medium text-gray-700 dark:text-gray-200">
            Drop an image here or click to upload
          </p>
          <p className="mt-1 text-sm text-gray-400">JPG, PNG, SVG, or WebP</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {/* Text Mode */}
      {mode === 'text' && (
        <div className="grid gap-5 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:grid-cols-2">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Text / Emoji (1-2 chars)
              </span>
              <input
                type="text"
                maxLength={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Font Size ({fontSize}%)
              </span>
              <input
                type="range"
                min={30}
                max={100}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Border Radius ({borderRadius}%)
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Font Family
              </span>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {FONTS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="block flex-1">
                <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Background
                </span>
                <input
                  type="color"
                  value={bgColor}
                  disabled={bgTransparent}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-full cursor-pointer rounded-lg disabled:opacity-40"
                />
              </label>
              <label className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  checked={bgTransparent}
                  onChange={(e) => setBgTransparent(e.target.checked)}
                  className="h-4 w-4 accent-purple-600"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Transparent</span>
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Text Color
              </span>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-full cursor-pointer rounded-lg"
              />
            </label>

            {/* Live large preview */}
            <div className="flex items-center justify-center pt-2">
              <div className="text-center">
                <span className="mb-2 block text-xs text-gray-400">Preview (192px)</span>
                {previews[192] ? (
                  <img
                    src={previews[192]}
                    alt="Favicon preview"
                    width={96}
                    height={96}
                    className="mx-auto rounded-lg"
                  />
                ) : (
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100 text-gray-300 dark:bg-gray-700">
                    No preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Size Previews & Downloads */}
      {hasPreviews && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Generated Favicons
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {SIZES.map((size) => (
              <div
                key={size}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 sm:p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center">
                  {previews[size] && (
                    <img
                      src={previews[size]}
                      alt={`${size}x${size}`}
                      style={{ width: Math.min(size, 64), height: Math.min(size, 64) }}
                      className="rounded"
                    />
                  )}
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
                  {size}x{size}
                </span>
                <button
                  onClick={() => downloadPng(size)}
                  className="flex items-center gap-1 rounded-lg bg-purple-600 px-2.5 py-1.5 text-[10px] sm:text-xs font-medium text-white transition hover:bg-purple-700"
                >
                  <Download className="h-3 w-3" />
                  PNG
                </button>
              </div>
            ))}
          </div>

          {/* Download All as ZIP */}
          <button
            onClick={downloadZip}
            disabled={zipping}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
          >
            <Archive className="h-4 w-4" />
            {zipping ? 'Creating ZIP...' : 'Download All Sizes as ZIP'}
          </button>
        </div>
      )}

      {/* HTML Meta Tags */}
      {hasPreviews && (
        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              HTML Meta Tags
            </h2>
            <button
              onClick={copyHtml}
              className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300">
            {htmlTags}
          </pre>
        </div>
      )}
    </div>
  );
}
