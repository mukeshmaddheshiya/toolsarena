'use client';
import { useState, useRef, useCallback } from 'react';
import { Upload, Copy, Check, Download, X, Languages, FileText, Loader2 } from 'lucide-react';

const LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'hin', name: 'Hindi' },
  { code: 'mar', name: 'Marathi' },
  { code: 'tam', name: 'Tamil' },
  { code: 'tel', name: 'Telugu' },
  { code: 'kan', name: 'Kannada' },
  { code: 'ben', name: 'Bengali' },
  { code: 'guj', name: 'Gujarati' },
  { code: 'mal', name: 'Malayalam' },
  { code: 'pan', name: 'Punjabi' },
  { code: 'urd', name: 'Urdu' },
  { code: 'ara', name: 'Arabic' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'spa', name: 'Spanish' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kor', name: 'Korean' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
];

export function ImageToTextTool() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [lang, setLang] = useState('eng');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(async (src: string, language: string) => {
    setProcessing(true);
    setProgress(0);
    setProgressMsg('Loading OCR engine...');
    setText('');
    setError('');

    try {
      const Tesseract = await import('tesseract.js');
      const result = await Tesseract.recognize(src, language, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
            setProgressMsg('Recognizing text...');
          } else {
            setProgressMsg(m.status.charAt(0).toUpperCase() + m.status.slice(1) + '...');
          }
        },
      });
      setText(result.data.text.trim());
    } catch (err) {
      setError('Failed to process image. Please try a different image or format.');
      console.error(err);
    }
    setProcessing(false);
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImage(src);
      processImage(src, lang);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const reScan = () => {
    if (image) processImage(image, lang);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'extracted-text.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Image to Text (OCR)</h2>
            <p className="text-cyan-100 text-xs">Extract text from images in 18+ languages | 100% Free & Private</p>
          </div>
        </div>
      </div>

      {/* Language selector */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Language:</span>
        </div>
        <select
          value={lang}
          onChange={e => { setLang(e.target.value); if (image) processImage(image, e.target.value); }}
          className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
        >
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <p className="text-[10px] text-slate-400 ml-auto">Powered by Tesseract.js — runs 100% in your browser</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image Upload */}
        <div className="space-y-3">
          {!image ? (
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
            >
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Drop an image here or click to upload</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP, BMP, TIFF supported</p>
            </div>
          ) : (
            <div className="relative">
              <img src={image} alt="Uploaded" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 max-h-[400px] object-contain bg-white dark:bg-slate-900" />
              <button onClick={() => { setImage(null); setText(''); setError(''); }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />

          {image && (
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
                <Upload className="w-3.5 h-3.5" /> New Image
              </button>
              <button onClick={reScan}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <FileText className="w-3.5 h-3.5" /> Re-scan
              </button>
            </div>
          )}

          {/* Progress bar */}
          {processing && (
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-400">{progressMsg}</span>
                <span className="text-xs text-blue-500 ml-auto">{progress}%</span>
              </div>
              <div className="h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800/40 p-3 text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Extracted Text */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
            </div>
            <div className="flex gap-1.5">
              <button onClick={copy} disabled={!text}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-primary-600 text-white hover:bg-primary-700'} disabled:opacity-40`}>
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
              <button onClick={downloadTxt} disabled={!text}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors disabled:opacity-40">
                <Download className="w-3.5 h-3.5" /> .txt
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={text}
            rows={16}
            placeholder={processing ? 'Extracting text...' : 'Extracted text will appear here...'}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 resize-none focus:outline-none leading-relaxed"
          />

          {/* Tips */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
            <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Tips for best results:</div>
            <ul className="text-[10px] text-slate-500 space-y-0.5">
              <li>Use clear, high-resolution images</li>
              <li>Ensure text is not rotated or skewed</li>
              <li>Good contrast between text and background helps</li>
              <li>Select the correct language for better accuracy</li>
              <li>Crop the image to include only the text area</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
