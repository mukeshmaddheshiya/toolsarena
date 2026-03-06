'use client';
import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { PartyPopper, Download, Share2, Copy, Check, RotateCcw, Type, Palette, Sparkles, ChevronDown, ChevronUp, Link2, PenLine, Grid3X3 } from 'lucide-react';
import { ALL_TEMPLATES, ALL_CATEGORIES, CATEGORY_LABELS } from './templates';
import type { CardCategory, CardTemplate } from './templates';
import { CardPreview } from './CardPreview';

const FONTS = [
  { label: 'Elegant Serif', value: 'Georgia, serif' },
  { label: 'Classic Serif', value: 'Palatino, serif' },
  { label: 'Times', value: 'Times New Roman, serif' },
  { label: 'Clean Sans', value: 'Arial, sans-serif' },
  { label: 'Modern Sans', value: 'Verdana, sans-serif' },
  { label: 'Friendly', value: 'Trebuchet MS, sans-serif' },
  { label: 'Decorative', value: 'cursive' },
  { label: 'Monospace', value: 'Courier New, monospace' },
];

const ACCENT_COLORS = [
  '#e53e3e', '#dd6b20', '#d69e2e', '#38a169', '#319795',
  '#3182ce', '#5a67d8', '#805ad5', '#d53f8c', '#1a202c',
  '#d4af37', '#00bcd4',
];

interface CardState {
  recipientName: string;
  greeting: string;
  message: string;
  senderName: string;
  fontFamily: string;
  colorOverride?: string;
}

function encodeCardData(templateId: string, state: CardState): string {
  const d = {
    t: templateId,
    r: state.recipientName,
    g: state.greeting,
    m: state.message,
    s: state.senderName,
    f: state.fontFamily,
    c: state.colorOverride || '',
  };
  return btoa(encodeURIComponent(JSON.stringify(d)));
}

function decodeCardData(encoded: string): { templateId: string; state: Partial<CardState> } | null {
  try {
    const d = JSON.parse(decodeURIComponent(atob(encoded)));
    return {
      templateId: d.t || '',
      state: {
        recipientName: d.r || '',
        greeting: d.g || '',
        message: d.m || '',
        senderName: d.s || '',
        fontFamily: d.f || '',
        colorOverride: d.c || undefined,
      },
    };
  } catch {
    return null;
  }
}

/** Measures actual container width via ResizeObserver and computes card scale */
function useContainerScale(ref: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width ?? 600;
      setScale(Math.min(w / 600, 1));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return scale;
}

/** Measures the card's actual rendered height for proper wrapper sizing */
function useCardHeight(ref: React.RefObject<HTMLDivElement | null>) {
  const [h, setH] = useState(450);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(entries => {
      setH(entries[0]?.borderBoxSize?.[0]?.blockSize ?? entries[0]?.contentRect.height ?? 450);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return h;
}

/** Scaled card wrapper — renders 600px card and scales it to fit container */
function ScaledCard({ cardRef, template, state, containerRef }: {
  cardRef: React.RefObject<HTMLDivElement | null>;
  template: CardTemplate;
  state: CardState;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const scale = useContainerScale(containerRef);
  const cardHeight = useCardHeight(cardRef);

  return (
    <div ref={containerRef} className="w-full">
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 600 * scale,
        height: cardHeight * scale,
        overflow: 'hidden',
        borderRadius: 8,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, transform: `scale(${scale})`, transformOrigin: 'top left', width: 600 }}>
          <CardPreview ref={cardRef} template={template} state={state} />
        </div>
      </div>
    </div>
  );
}

export function GreetingCardMakerTool() {
  const [category, setCategory] = useState<CardCategory | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(ALL_TEMPLATES[0]);
  const [state, setState] = useState<CardState>({
    recipientName: '',
    greeting: '',
    message: '',
    senderName: '',
    fontFamily: '',
  });
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [viewMode, setViewMode] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Decode URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const cardParam = params.get('card');
    if (cardParam) {
      const decoded = decodeCardData(cardParam);
      if (decoded) {
        const tmpl = ALL_TEMPLATES.find(t => t.id === decoded.templateId);
        if (tmpl) {
          setSelectedTemplate(tmpl);
          setState(prev => ({ ...prev, ...decoded.state }));
          setViewMode(true);
        }
      }
    }
  }, []);

  const filteredTemplates = useMemo(() => {
    if (category === 'all') return ALL_TEMPLATES;
    return ALL_TEMPLATES.filter(t => t.category === category);
  }, [category]);

  const selectTemplate = useCallback((t: CardTemplate) => {
    setSelectedTemplate(t);
    setState(prev => ({
      ...prev,
      greeting: prev.greeting || '',
      message: prev.message || '',
    }));
  }, []);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `${selectedTemplate.name.replace(/\s+/g, '-').toLowerCase()}-card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
    setDownloading(false);
  }, [selectedTemplate.name]);

  const generateShareLink = useCallback(() => {
    const encoded = encodeCardData(selectedTemplate.id, state);
    const url = `${window.location.origin}${window.location.pathname}?card=${encoded}`;
    setShareUrl(url);
    return url;
  }, [selectedTemplate.id, state]);

  const copyShareLink = useCallback(async () => {
    const url = shareUrl || generateShareLink();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [shareUrl, generateShareLink]);

  // View mode — show card prominently
  if (viewMode) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white text-center">
          <h2 className="font-bold text-base sm:text-lg">You received a greeting!</h2>
          <p className="text-purple-200 text-xs mt-1">Someone sent you a special message</p>
        </div>

        <ScaledCard cardRef={cardRef} template={selectedTemplate} state={state} containerRef={containerRef} />

        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <button onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4" /> Save as Image
          </button>
          <button onClick={() => { setViewMode(false); }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-300 transition-colors">
            <Sparkles className="w-4 h-4" /> Create Your Own
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-3.5 sm:p-5 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
            <PartyPopper className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-[15px] sm:text-lg leading-tight">Greeting Card Maker</h2>
            <p className="text-purple-200 text-[11px] sm:text-xs">50+ templates &bull; Download or Share via Link</p>
          </div>
        </div>
      </div>

      {/* Category Tabs — scrollable horizontal */}
      <div className="overflow-x-auto -mx-1 px-1 scrollbar-thin">
        <div className="flex gap-1.5 min-w-max">
          <button onClick={() => setCategory('all')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${category === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-purple-50'}`}>
            All ({ALL_TEMPLATES.length})
          </button>
          {ALL_CATEGORIES.map(cat => {
            const count = ALL_TEMPLATES.filter(t => t.category === cat).length;
            return (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${category === cat ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-purple-50'}`}>
                {CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* MOBILE LAYOUT: stacked — Preview → Buttons → Templates → Editor */}
      {/* DESKTOP LAYOUT: side-by-side 2/5 editor | 3/5 preview */}

      <div className="grid lg:grid-cols-5 gap-3 sm:gap-5">
        {/* Left Panel — Editor (on mobile: shows AFTER preview via order) */}
        <div className="lg:col-span-2 space-y-2.5 sm:space-y-4 order-2 lg:order-1">

          {/* Template Grid — collapsible on mobile */}
          <div className="-mx-4 sm:mx-0">
            <button onClick={() => setShowTemplates(!showTemplates)}
              className="lg:hidden w-full flex items-center justify-between px-4 sm:px-3 py-3 sm:py-2.5 bg-slate-100 dark:bg-slate-800 sm:rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5"><Grid3X3 className="w-3.5 h-3.5" /> Choose Template</span>
              <span className="flex items-center gap-1 text-[10px] text-purple-600">
                {showTemplates ? 'Hide' : `${filteredTemplates.length} designs`}
                {showTemplates ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </span>
            </button>
            <div className="hidden lg:flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Choose Template</label>
              <span className="text-[10px] text-slate-400">{filteredTemplates.length} designs</span>
            </div>
            <div className={`${showTemplates ? 'grid mt-2' : 'hidden lg:grid'} grid-cols-4 sm:grid-cols-5 lg:grid-cols-3 gap-1.5 sm:gap-2 max-h-52 sm:max-h-56 overflow-y-auto px-4 sm:px-0`}>
              {filteredTemplates.map(t => (
                <button key={t.id} onClick={() => { selectTemplate(t); setShowTemplates(false); }}
                  className={`rounded-lg overflow-hidden transition-all ${selectedTemplate.id === t.id ? 'ring-2 ring-purple-500 scale-[1.03] shadow-lg' : 'ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-purple-300'}`}>
                  <div style={{ background: t.background, padding: '6px 3px', minHeight: 48 }}
                    className="flex flex-col items-center justify-center text-center">
                    <span style={{ fontSize: 16, lineHeight: 1 }}>{t.decorEmoji || '🎉'}</span>
                    <span style={{ fontSize: 6.5, color: '#fff', marginTop: 2, fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                      {t.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile toggle for editor fields */}
          <div className="-mx-4 sm:mx-0">
            <button onClick={() => setShowEditor(!showEditor)}
              className="lg:hidden w-full flex items-center justify-between px-4 sm:px-3 py-3 sm:py-2.5 bg-purple-50 dark:bg-purple-900/30 border-y sm:border border-purple-200 dark:border-purple-800 sm:rounded-lg text-xs font-medium text-purple-700 dark:text-purple-300">
              <span className="flex items-center gap-1.5"><PenLine className="w-3.5 h-3.5" /> Customize Text & Style</span>
              {showEditor ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Editor Fields */}
          <div className={`space-y-3 ${showEditor ? '' : 'hidden lg:block'}`}>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Recipient Name</label>
              <input type="text" value={state.recipientName} onChange={e => setState(p => ({ ...p, recipientName: e.target.value }))}
                placeholder="e.g. Priya, Mom, Rahul"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Greeting Title</label>
              <input type="text" value={state.greeting} onChange={e => setState(p => ({ ...p, greeting: e.target.value }))}
                placeholder={selectedTemplate.defaultGreeting}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Message</label>
              <textarea value={state.message} onChange={e => setState(p => ({ ...p, message: e.target.value }))}
                placeholder={selectedTemplate.defaultMessage}
                rows={3}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Your Name (Sender)</label>
              <input type="text" value={state.senderName} onChange={e => setState(p => ({ ...p, senderName: e.target.value }))}
                placeholder="e.g. Mukesh, The Sharma Family"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>

            {/* Font Picker */}
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Type className="w-3 h-3" /> Font Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {FONTS.map(f => (
                  <button key={f.value} onClick={() => setState(p => ({ ...p, fontFamily: f.value }))}
                    style={{ fontFamily: f.value }}
                    className={`px-2 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-[10px] font-medium transition-colors ${(state.fontFamily || selectedTemplate.fontFamily) === f.value ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-purple-50'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Override */}
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Palette className="w-3 h-3" /> Accent Color
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-1.5">
                <button onClick={() => setState(p => ({ ...p, colorOverride: undefined }))}
                  className={`w-8 h-8 sm:w-7 sm:h-7 rounded-lg border-2 flex items-center justify-center text-[9px] font-bold ${!state.colorOverride ? 'border-purple-500' : 'border-slate-300 dark:border-slate-600'}`}
                  title="Template default">
                  Auto
                </button>
                {ACCENT_COLORS.map(c => (
                  <button key={c} onClick={() => setState(p => ({ ...p, colorOverride: c }))}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 sm:w-7 sm:h-7 rounded-lg transition-transform ${state.colorOverride === c ? 'ring-2 ring-purple-500 ring-offset-1 scale-110' : 'hover:scale-110'}`}
                    title={c} />
                ))}
              </div>
            </div>

            <button onClick={() => setState({ recipientName: '', greeting: '', message: '', senderName: '', fontFamily: '' })}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 hover:bg-slate-200 transition-colors">
              <RotateCcw className="w-3 h-3" /> Reset All
            </button>
          </div>
        </div>

        {/* Right Panel — Preview + Actions (on mobile: shows FIRST via order) */}
        <div className="lg:col-span-3 space-y-2.5 sm:space-y-4 order-1 lg:order-2">
          {/* Preview — bleed edge-to-edge on mobile */}
          <div className="-mx-4 sm:mx-0 sm:bg-slate-100 sm:dark:bg-slate-800/50 sm:rounded-xl sm:p-4">
            <div className="hidden sm:flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Live Preview</h3>
              <span className="text-[10px] text-slate-400">{selectedTemplate.name}</span>
            </div>
            <ScaledCard cardRef={cardRef} template={selectedTemplate} state={state} containerRef={containerRef} />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button onClick={handleDownload} disabled={downloading}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-3 rounded-xl bg-purple-600 text-white text-xs sm:text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50">
              {downloading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {downloading ? 'Saving...' : 'Download PNG'}
            </button>
            <button onClick={() => { generateShareLink(); copyShareLink(); }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-pink-600 text-white hover:bg-pink-700'}`}>
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Share Link'}
            </button>
          </div>

          {/* Share URL Display */}
          {shareUrl && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 space-y-2">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Link2 className="w-3 h-3" /> Shareable Link
              </label>
              <div className="flex gap-1.5">
                <input readOnly value={shareUrl}
                  className="flex-1 min-w-0 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-2 text-xs font-mono text-purple-700 dark:text-purple-400 truncate" />
                <button onClick={copyShareLink}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors shrink-0 ${copied ? 'bg-green-100 text-green-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How it works — at bottom, not between buttons and controls */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 sm:p-4">
        <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-2">How It Works</h4>
        <div className="flex justify-between sm:justify-center sm:gap-8 text-center text-[10px] text-purple-600 dark:text-purple-300">
          <div>
            <div className="text-lg sm:text-2xl font-bold mb-0.5">1</div>
            <div className="font-medium leading-tight">Pick a<br />template</div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-bold mb-0.5">2</div>
            <div className="font-medium leading-tight">Add name<br />&amp; message</div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-bold mb-0.5">3</div>
            <div className="font-medium leading-tight">Download<br />or share</div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">About This Greeting Card Maker</h4>
        <div className="grid md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-2">
            <p><strong>50+ Beautiful Templates:</strong> Choose from professionally designed templates for Birthday, Wedding, Anniversary, Diwali, Holi, New Year, Valentine&apos;s Day, Mother&apos;s Day, Eid, Christmas, and many more occasions.</p>
            <p><strong>Fully Customizable:</strong> Add recipient name, personal message, choose fonts and accent colors. Live preview updates as you type.</p>
            <p><strong>Share via Link:</strong> Generate a unique shareable URL. Anyone who opens the link will see your customized greeting card.</p>
          </div>
          <div className="space-y-2">
            <p><strong>Download as Image:</strong> Save your card as a high-quality PNG image. Great for printing, sharing on Instagram stories, or sending as an attachment.</p>
            <p><strong>100% Free & Private:</strong> No sign-up required, no watermarks, unlimited cards. Everything runs in your browser.</p>
            <p><strong>Works on All Devices:</strong> Create beautiful greeting cards from your phone, tablet, or desktop.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
