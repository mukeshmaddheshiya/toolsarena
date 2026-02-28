'use client';
import { useState } from 'react';
import { FileDropzone } from '@/components/tools/FileDropzone';
import { CopyButton } from '@/components/common/CopyButton';
import { formatFileSize, readFileAsDataURL } from '@/lib/utils';
import { RotateCcw, Code } from 'lucide-react';

export function ImageToBase64Tool() {
  const [result, setResult] = useState<{ dataUrl: string; base64: string; mimeType: string; fileName: string; originalSize: number } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFiles(files: File[]) {
    const file = files[0];
    setLoading(true);
    try {
      const dataUrl = await readFileAsDataURL(file);
      const base64 = dataUrl.split(',')[1];
      setResult({ dataUrl, base64, mimeType: file.type, fileName: file.name, originalSize: file.size });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {!result && !loading && (
        <FileDropzone accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.svg" multiple={false} maxSizeMB={10} onFiles={handleFiles} description="JPEG, PNG, WebP, GIF, SVG — max 10MB" />
      )}

      {loading && <div className="py-12 text-center text-slate-500">Converting...</div>}

      {result && (
        <div className="space-y-4">
          {/* Preview + info */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <img src={result.dataUrl} alt={result.fileName} className="w-20 h-20 object-cover rounded-xl shrink-0" />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{result.fileName}</p>
              <p className="text-xs text-slate-500 mt-1">Original: {formatFileSize(result.originalSize)} → Base64: {formatFileSize(result.base64.length)} (+{Math.round((result.base64.length / result.originalSize - 1) * 100)}%)</p>
              <p className="text-xs text-slate-500">MIME type: {result.mimeType}</p>
            </div>
            <button onClick={() => setResult(null)} className="ml-auto p-2 text-slate-400 hover:text-red-500 transition-colors"><RotateCcw className="w-4 h-4" /></button>
          </div>

          {/* Usage snippets */}
          <div className="space-y-3">
            {[
              { label: 'Base64 String', value: result.base64, desc: 'Raw Base64 data (without data URI prefix)' },
              { label: 'Data URI', value: result.dataUrl, desc: 'Complete data URI — use directly in src or url()' },
              { label: 'HTML img tag', value: `<img src="${result.dataUrl}" alt="${result.fileName}" />`, desc: 'Ready-to-use HTML' },
              { label: 'CSS background', value: `background-image: url("${result.dataUrl}");`, desc: 'CSS background-image value' },
            ].map(({ label, value, desc }) => (
              <div key={label} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
                    <span className="text-xs text-slate-400 ml-2">{desc}</span>
                  </div>
                  <CopyButton text={value} size="sm" label="" />
                </div>
                <div className="font-mono text-xs text-slate-500 dark:text-slate-400 truncate max-w-full">{value.substring(0, 100)}{value.length > 100 ? '...' : ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
