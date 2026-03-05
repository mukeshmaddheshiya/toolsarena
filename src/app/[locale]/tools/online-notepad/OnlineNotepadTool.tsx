'use client';
import { useState, useEffect, useCallback } from 'react';
import { Download, Trash2, FileText, Share2, Copy, Check } from 'lucide-react';

const STORAGE_KEY = 'toolsarena-notepad';
const MAX_SHARE_LENGTH = 1000;

export function OnlineNotepadTool() {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setText(stored);
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, text);
      if (text) setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 500);
    return () => clearTimeout(timer);
  }, [text]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const lineCount = text ? text.split('\n').length : 0;

  const handleDownload = useCallback(() => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notepad-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [text]);

  const clear = () => {
    setText('');
    localStorage.removeItem(STORAGE_KEY);
  };

  const getShareText = () => {
    const trimmed = text.trim();
    if (trimmed.length <= MAX_SHARE_LENGTH) return trimmed;
    return trimmed.slice(0, MAX_SHARE_LENGTH) + '...';
  };

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: 'My Note', text: getShareText() });
    } catch {
      // User cancelled or not supported
    }
  };

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(getShareText())}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`, '_blank');
  };

  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(getShareText())}`, '_blank');
  };

  const shareToEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent('Shared Note')}&body=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Size</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1"
            >
              {[12, 14, 16, 18, 20, 24].map(s => <option key={s} value={s}>{s}px</option>)}
            </select>
          </div>
          {saved && <span className="text-xs text-green-600 dark:text-green-400 font-medium">Auto-saved</span>}
          <div className="flex items-center gap-2 ml-auto">
            {/* Share button */}
            <div className="relative">
              <button
                onClick={() => setShowShare(!showShare)}
                disabled={!text.trim()}
                className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Share dropdown */}
              {showShare && text.trim() && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowShare(false)} />
                  <div className="fixed left-4 right-4 sm:absolute sm:left-auto sm:right-0 sm:w-56 top-auto mt-2 z-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-2 space-y-1">
                  {/* Copy text */}
                  <button onClick={() => { handleCopyText(); setShowShare(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    Copy all text
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-700 my-1" />

                  {/* WhatsApp */}
                  <button onClick={() => { shareToWhatsApp(); setShowShare(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </button>

                  {/* Twitter/X */}
                  <button onClick={() => { shareToTwitter(); setShowShare(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-slate-800 dark:text-slate-200" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X (Twitter)
                  </button>

                  {/* Telegram */}
                  <button onClick={() => { shareToTelegram(); setShowShare(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    Telegram
                  </button>

                  {/* Email */}
                  <button onClick={() => { shareToEmail(); setShowShare(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
                    Email
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-700 my-1" />

                  {/* Native share (mobile) */}
                  {'share' in navigator && (
                    <button onClick={() => { handleNativeShare(); setShowShare(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                      More options...
                    </button>
                  )}

                  {text.length > MAX_SHARE_LENGTH && (
                    <p className="text-[10px] text-slate-400 px-3 py-1">
                      Note: Social shares are trimmed to {MAX_SHARE_LENGTH} chars. Use &quot;Copy all text&quot; or &quot;Email&quot; for full content.
                    </p>
                  )}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleDownload}
              disabled={!text}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Download</span> .txt
            </button>
            <button
              onClick={clear}
              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing here... Your notes are auto-saved in your browser."
        style={{ fontSize: `${fontSize}px` }}
        className="w-full min-h-[400px] rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y leading-relaxed"
      />

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {wordCount} words</span>
        <span>{charCount} characters</span>
        <span>{lineCount} lines</span>
      </div>
    </div>
  );
}
