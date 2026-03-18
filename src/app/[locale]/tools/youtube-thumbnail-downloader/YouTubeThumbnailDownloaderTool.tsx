'use client';
import { useState } from 'react';
import { Download, Search, ExternalLink, Copy, Check } from 'lucide-react';

const QUALITIES = [
  { key: 'maxresdefault', label: 'Max Resolution', size: '1280x720' },
  { key: 'sddefault', label: 'Standard', size: '640x480' },
  { key: 'hqdefault', label: 'High Quality', size: '480x360' },
  { key: 'mqdefault', label: 'Medium Quality', size: '320x180' },
  { key: 'default', label: 'Default', size: '120x90' },
];

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const match = url.trim().match(p);
    if (match) return match[1];
  }
  return null;
}

export function YouTubeThumbnailDownloaderTool() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleFetch = () => {
    setError('');
    setCopiedKey(null);
    const id = extractVideoId(url);
    if (!id) {
      setError('Please enter a valid YouTube video URL or video ID.');
      setVideoId(null);
      return;
    }
    setVideoId(id);
  };

  const getThumbnailUrl = (id: string, quality: string) =>
    `https://img.youtube.com/vi/${id}/${quality}.jpg`;

  const handleDownload = async (quality: string) => {
    if (!videoId) return;
    const imgUrl = getThumbnailUrl(videoId, quality);
    try {
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `youtube-thumbnail-${videoId}-${quality}.jpg`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab
      window.open(imgUrl, '_blank');
    }
  };

  const copyUrl = (quality: string) => {
    if (!videoId) return;
    navigator.clipboard.writeText(getThumbnailUrl(videoId, quality));
    setCopiedKey(quality);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube video URL or ID here..."
          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-base text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
        />
        <button
          onClick={handleFetch}
          disabled={!url.trim()}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" /> Get Thumbnails
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2">{error}</p>
      )}

      {/* Results */}
      {videoId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Thumbnails for video: {videoId}</h3>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
            >
              Open Video <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Main preview */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <img
              src={getThumbnailUrl(videoId, 'maxresdefault')}
              alt="YouTube thumbnail max resolution"
              className="w-full h-auto"
              onError={(e) => { (e.target as HTMLImageElement).src = getThumbnailUrl(videoId, 'hqdefault'); }}
            />
          </div>

          {/* All quality options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUALITIES.map(q => (
              <div key={q.key} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <img
                  src={getThumbnailUrl(videoId, q.key)}
                  alt={`Thumbnail ${q.label}`}
                  className="w-full h-auto"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="px-3 py-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{q.label}</p>
                    <p className="text-[10px] text-slate-400">{q.size}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => copyUrl(q.key)}
                      className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors"
                      title="Copy URL"
                    >
                      {copiedKey === q.key ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDownload(q.key)}
                      className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Copyright disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400">
            <strong>Copyright Notice:</strong> YouTube thumbnails are owned by the video creator. Downloading thumbnails for personal reference is generally acceptable, but using them commercially or redistributing without the creator&apos;s permission may violate copyright law.
          </div>
        </div>
      )}
    </div>
  );
}
