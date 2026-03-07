'use client';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Download,
  Image as ImageIcon,
  Type,
  Palette,
  LayoutTemplate,
  Eye,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Save,
  FolderOpen,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Archive,
} from 'lucide-react';

/* ──────────────────────── TYPES ──────────────────────── */

type TextAlign = 'left' | 'center' | 'right';

type BackgroundType = 'solid' | 'gradient' | 'image';

interface GradientPreset {
  name: string;
  css: string;
}

interface SlideTemplate {
  name: string;
  icon: string;
  headline: string;
  body: string;
  bgType: BackgroundType;
  bgColor: string;
  bgGradient: string;
  textColor: string;
  fontFamily: string;
  textAlign: TextAlign;
}

interface SlideData {
  id: string;
  headline: string;
  body: string;
  bgType: BackgroundType;
  bgColor: string;
  bgGradient: string;
  bgImageUrl: string;
  textColor: string;
  fontFamily: string;
  textAlign: TextAlign;
  overlayImageUrl: string;
}

interface CarouselConfig {
  name: string;
  slides: SlideData[];
  savedAt: number;
}

/* ──────────────────────── CONSTANTS ──────────────────────── */

const MAX_SLIDES = 10;
const SLIDE_SIZE = 1080;

const GRADIENT_PRESETS: GradientPreset[] = [
  { name: 'Sunset Blaze', css: 'linear-gradient(135deg, #ff6b6b, #feca57)' },
  { name: 'Ocean Deep', css: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { name: 'Mint Fresh', css: 'linear-gradient(135deg, #11998e, #38ef7d)' },
  { name: 'Berry Crush', css: 'linear-gradient(135deg, #8E2DE2, #4A00E0)' },
  { name: 'Coral Reef', css: 'linear-gradient(135deg, #ff9a9e, #fecfef)' },
  { name: 'Northern Lights', css: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { name: 'Twilight', css: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
  { name: 'Warm Flame', css: 'linear-gradient(135deg, #f5af19, #f12711)' },
  { name: 'Midnight City', css: 'linear-gradient(135deg, #232526, #414345)' },
  { name: 'Cool Blues', css: 'linear-gradient(135deg, #2193b0, #6dd5ed)' },
  { name: 'Peach Melt', css: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
  { name: 'Electric Violet', css: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { name: 'Rose Water', css: 'linear-gradient(135deg, #e55d87, #5fc3e4)' },
  { name: 'Lemon Twist', css: 'linear-gradient(135deg, #f7ff00, #db36a4)' },
  { name: 'Deep Space', css: 'linear-gradient(135deg, #000428, #004e92)' },
  { name: 'Candy Shop', css: 'linear-gradient(135deg, #fc5c7d, #6a82fb)' },
  { name: 'Forest Glow', css: 'linear-gradient(135deg, #134e5e, #71b280)' },
];

const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Sans Serif', value: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" },
  { label: 'Serif', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Monospace', value: "'Courier New', Consolas, monospace" },
  { label: 'Cursive', value: "'Brush Script MT', 'Segoe Script', cursive" },
  { label: 'Fantasy', value: "Impact, 'Arial Black', fantasy" },
];

const SLIDE_TEMPLATES: SlideTemplate[] = [
  {
    name: 'Title Slide',
    icon: '1',
    headline: 'Your Title Here',
    body: 'Swipe to learn more',
    bgType: 'gradient',
    bgColor: '#667eea',
    bgGradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    textColor: '#ffffff',
    fontFamily: FONT_OPTIONS[0].value,
    textAlign: 'center',
  },
  {
    name: 'Quote Slide',
    icon: '"',
    headline: '"Your inspiring quote goes here"',
    body: '- Author Name',
    bgType: 'gradient',
    bgColor: '#232526',
    bgGradient: 'linear-gradient(135deg, #232526, #414345)',
    textColor: '#ffffff',
    fontFamily: FONT_OPTIONS[1].value,
    textAlign: 'center',
  },
  {
    name: 'Tip / Fact',
    icon: '!',
    headline: 'Did You Know?',
    body: 'Add your interesting fact or helpful tip here. Keep it concise and engaging.',
    bgType: 'gradient',
    bgColor: '#11998e',
    bgGradient: 'linear-gradient(135deg, #11998e, #38ef7d)',
    textColor: '#ffffff',
    fontFamily: FONT_OPTIONS[0].value,
    textAlign: 'left',
  },
  {
    name: 'Numbered List',
    icon: '#',
    headline: 'Step 1',
    body: 'Describe the first step or point in detail here.',
    bgType: 'gradient',
    bgColor: '#ff6b6b',
    bgGradient: 'linear-gradient(135deg, #ff6b6b, #feca57)',
    textColor: '#ffffff',
    fontFamily: FONT_OPTIONS[0].value,
    textAlign: 'left',
  },
  {
    name: 'CTA Slide',
    icon: '>',
    headline: 'Follow for More!',
    body: 'Like, save & share this post.\n@yourusername',
    bgType: 'gradient',
    bgColor: '#fc5c7d',
    bgGradient: 'linear-gradient(135deg, #fc5c7d, #6a82fb)',
    textColor: '#ffffff',
    fontFamily: FONT_OPTIONS[0].value,
    textAlign: 'center',
  },
];

const EXAMPLE_CAROUSEL: SlideData[] = [
  {
    id: 'ex-1',
    headline: '5 Habits That Changed My Life',
    body: 'Swipe to discover each one',
    bgType: 'gradient',
    bgColor: '#667eea',
    bgGradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    bgImageUrl: '',
    textColor: '#ffffff',
    fontFamily: FONT_OPTIONS[0].value,
    textAlign: 'center',
    overlayImageUrl: '',
  },
  {
    id: 'ex-2',
    headline: '1. Wake Up Early',
    body: 'Start your day at 5:30 AM. The quiet morning hours are when your mind is sharpest and distractions are fewest.',
    bgType: 'gradient',
    bgColor: '#11998e',
    bgGradient: 'linear-gradient(135deg, #11998e, #38ef7d)',
    bgImageUrl: '',
    textColor: '#ffffff',
    fontFamily: FONT_OPTIONS[0].value,
    textAlign: 'left',
    overlayImageUrl: '',
  },
  {
    id: 'ex-3',
    headline: '2. Read Every Day',
    body: 'Even 20 minutes of reading expands your knowledge and creativity. Books are the best investment you can make.',
    bgType: 'gradient',
    bgColor: '#2193b0',
    bgGradient: 'linear-gradient(135deg, #2193b0, #6dd5ed)',
    bgImageUrl: '',
    textColor: '#ffffff',
    fontFamily: FONT_OPTIONS[0].value,
    textAlign: 'left',
    overlayImageUrl: '',
  },
  {
    id: 'ex-4',
    headline: '3. Exercise Daily',
    body: 'Move your body for at least 30 minutes. Physical health directly impacts mental clarity and emotional resilience.',
    bgType: 'gradient',
    bgColor: '#f5af19',
    bgGradient: 'linear-gradient(135deg, #f5af19, #f12711)',
    bgImageUrl: '',
    textColor: '#ffffff',
    fontFamily: FONT_OPTIONS[0].value,
    textAlign: 'left',
    overlayImageUrl: '',
  },
  {
    id: 'ex-5',
    headline: 'Follow for More Tips!',
    body: 'Like, save & share this post.\nDouble-tap if you agree!\n@toolsarena',
    bgType: 'gradient',
    bgColor: '#fc5c7d',
    bgGradient: 'linear-gradient(135deg, #fc5c7d, #6a82fb)',
    bgImageUrl: '',
    textColor: '#ffffff',
    fontFamily: FONT_OPTIONS[0].value,
    textAlign: 'center',
    overlayImageUrl: '',
  },
];

/* ──────────────────────── HELPERS ──────────────────────── */

function uid(): string {
  return `slide-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createBlankSlide(): SlideData {
  return {
    id: uid(),
    headline: '',
    body: '',
    bgType: 'solid',
    bgColor: '#4f46e5',
    bgGradient: GRADIENT_PRESETS[0].css,
    bgImageUrl: '',
    textColor: '#ffffff',
    fontFamily: FONT_OPTIONS[0].value,
    textAlign: 'center',
    overlayImageUrl: '',
  };
}

function slideFromTemplate(template: SlideTemplate): SlideData {
  return {
    id: uid(),
    headline: template.headline,
    body: template.body,
    bgType: template.bgType,
    bgColor: template.bgColor,
    bgGradient: template.bgGradient,
    bgImageUrl: '',
    textColor: template.textColor,
    fontFamily: template.fontFamily,
    textAlign: template.textAlign,
    overlayImageUrl: '',
  };
}

const STORAGE_KEY = 'toolsarena_carousel_history';

function loadHistory(): CarouselConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CarouselConfig[];
  } catch {
    return [];
  }
}

function saveHistory(configs: CarouselConfig[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs.slice(0, 5)));
  } catch {
    /* quota exceeded — silently fail */
  }
}

/* ──────────────────────── SLIDE RENDERER ──────────────────────── */

function SlideCanvas({
  slide,
  scale,
  isExport,
}: {
  slide: SlideData;
  scale: number;
  isExport?: boolean;
}) {
  const bgStyle: React.CSSProperties = (() => {
    switch (slide.bgType) {
      case 'gradient':
        return { background: slide.bgGradient };
      case 'image':
        return slide.bgImageUrl
          ? {
              backgroundImage: `url(${slide.bgImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { background: slide.bgColor };
      default:
        return { background: slide.bgColor };
    }
  })();

  const containerStyle: React.CSSProperties = {
    width: SLIDE_SIZE,
    height: SLIDE_SIZE,
    transform: isExport ? undefined : `scale(${scale})`,
    transformOrigin: 'top left',
    ...bgStyle,
  };

  const textAlignMap: Record<TextAlign, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <div
      style={containerStyle}
      className="relative flex flex-col justify-center overflow-hidden"
    >
      {/* Overlay image */}
      {slide.overlayImageUrl && (
        <img
          src={slide.overlayImageUrl}
          alt="overlay"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ opacity: 0.25 }}
        />
      )}

      {/* Text content */}
      <div
        className={`relative z-10 flex flex-col gap-6 px-20 py-16 w-full h-full justify-center ${textAlignMap[slide.textAlign]}`}
      >
        {slide.headline && (
          <h2
            style={{
              color: slide.textColor,
              fontFamily: slide.fontFamily,
              fontSize: 72,
              lineHeight: 1.15,
              fontWeight: 800,
              wordBreak: 'break-word',
            }}
          >
            {slide.headline}
          </h2>
        )}
        {slide.body && (
          <p
            style={{
              color: slide.textColor,
              fontFamily: slide.fontFamily,
              fontSize: 40,
              lineHeight: 1.45,
              fontWeight: 400,
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              opacity: 0.92,
            }}
          >
            {slide.body}
          </p>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────── MAIN COMPONENT ──────────────────────── */

export function InstagramCarouselMakerTool() {
  /* ── State ── */
  const [slides, setSlides] = useState<SlideData[]>([createBlankSlide()]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<CarouselConfig[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [notification, setNotification] = useState('');

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.35);

  const activeSlide = slides[activeIndex] ?? slides[0];

  /* ── Load history on mount ── */
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  /* ── Responsive preview scale ── */
  useEffect(() => {
    function calcScale() {
      if (previewContainerRef.current) {
        const w = previewContainerRef.current.clientWidth;
        setPreviewScale(Math.min(w / SLIDE_SIZE, 0.55));
      }
    }
    calcScale();
    window.addEventListener('resize', calcScale);
    return () => window.removeEventListener('resize', calcScale);
  }, []);

  /* ── Notifications ── */
  const notify = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2500);
  }, []);

  /* ── Slide management ── */
  const addSlide = useCallback(() => {
    if (slides.length >= MAX_SLIDES) {
      notify(`Maximum ${MAX_SLIDES} slides allowed`);
      return;
    }
    const ns = createBlankSlide();
    setSlides((prev) => [...prev, ns]);
    setActiveIndex(slides.length);
  }, [slides.length, notify]);

  const addFromTemplate = useCallback(
    (template: SlideTemplate) => {
      if (slides.length >= MAX_SLIDES) {
        notify(`Maximum ${MAX_SLIDES} slides allowed`);
        return;
      }
      const ns = slideFromTemplate(template);
      setSlides((prev) => [...prev, ns]);
      setActiveIndex(slides.length);
      setShowTemplates(false);
    },
    [slides.length, notify],
  );

  const deleteSlide = useCallback(
    (index: number) => {
      if (slides.length <= 1) {
        notify('Need at least one slide');
        return;
      }
      setSlides((prev) => prev.filter((_, i) => i !== index));
      setActiveIndex((prev) => (prev >= index && prev > 0 ? prev - 1 : prev));
    },
    [slides.length, notify],
  );

  const duplicateSlide = useCallback(
    (index: number) => {
      if (slides.length >= MAX_SLIDES) {
        notify(`Maximum ${MAX_SLIDES} slides allowed`);
        return;
      }
      const clone: SlideData = { ...slides[index], id: uid() };
      const next = [...slides];
      next.splice(index + 1, 0, clone);
      setSlides(next);
      setActiveIndex(index + 1);
    },
    [slides, notify],
  );

  const moveSlide = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= slides.length) return;
      const next = [...slides];
      [next[index], next[target]] = [next[target], next[index]];
      setSlides(next);
      setActiveIndex(target);
    },
    [slides],
  );

  const updateSlide = useCallback(
    (field: keyof SlideData, value: string) => {
      setSlides((prev) =>
        prev.map((s, i) => (i === activeIndex ? { ...s, [field]: value } : s)),
      );
    },
    [activeIndex],
  );

  /* ── Image upload ── */
  const handleImageUpload = useCallback(
    (field: 'bgImageUrl' | 'overlayImageUrl') => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          updateSlide(field, reader.result as string);
          if (field === 'bgImageUrl') updateSlide('bgType', 'image');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    },
    [updateSlide],
  );

  /* ── Download single ── */
  const downloadSlide = useCallback(
    async (index: number) => {
      setDownloading(true);
      try {
        const html2canvas = (await import('html2canvas-pro')).default;
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = `${SLIDE_SIZE}px`;
        container.style.height = `${SLIDE_SIZE}px`;
        document.body.appendChild(container);

        const { createRoot } = await import('react-dom/client');
        const { flushSync } = await import('react-dom');

        const root = createRoot(container);
        flushSync(() => {
          root.render(
            <SlideCanvas slide={slides[index]} scale={1} isExport />,
          );
        });

        await new Promise((r) => setTimeout(r, 300));

        const canvas = await html2canvas(container, {
          width: SLIDE_SIZE,
          height: SLIDE_SIZE,
          scale: 1,
          useCORS: true,
          backgroundColor: null,
        });

        root.unmount();
        document.body.removeChild(container);

        const link = document.createElement('a');
        link.download = `carousel-slide-${index + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        notify(`Slide ${index + 1} downloaded!`);
      } catch (err) {
        console.error(err);
        notify('Download failed. Please try again.');
      } finally {
        setDownloading(false);
      }
    },
    [slides, notify],
  );

  /* ── Download all as sequential PNGs ── */
  const downloadAll = useCallback(async () => {
    setDownloadingAll(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const { createRoot } = await import('react-dom/client');
      const { flushSync } = await import('react-dom');

      for (let i = 0; i < slides.length; i++) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = `${SLIDE_SIZE}px`;
        container.style.height = `${SLIDE_SIZE}px`;
        document.body.appendChild(container);

        const root = createRoot(container);
        flushSync(() => {
          root.render(
            <SlideCanvas slide={slides[i]} scale={1} isExport />,
          );
        });

        await new Promise((r) => setTimeout(r, 300));

        const canvas = await html2canvas(container, {
          width: SLIDE_SIZE,
          height: SLIDE_SIZE,
          scale: 1,
          useCORS: true,
          backgroundColor: null,
        });

        root.unmount();
        document.body.removeChild(container);

        const link = document.createElement('a');
        link.download = `carousel-slide-${i + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        await new Promise((r) => setTimeout(r, 400));
      }
      notify(`All ${slides.length} slides downloaded!`);
    } catch (err) {
      console.error(err);
      notify('Download failed. Please try again.');
    } finally {
      setDownloadingAll(false);
    }
  }, [slides, notify]);

  /* ── Try Example ── */
  const tryExample = useCallback(() => {
    const example = EXAMPLE_CAROUSEL.map((s) => ({ ...s, id: uid() }));
    setSlides(example);
    setActiveIndex(0);
    notify('Example carousel loaded!');
  }, [notify]);

  /* ── Reset ── */
  const resetAll = useCallback(() => {
    setSlides([createBlankSlide()]);
    setActiveIndex(0);
    setPreviewMode(false);
    notify('Carousel reset!');
  }, [notify]);

  /* ── Save / Load history ── */
  const saveToHistory = useCallback(() => {
    const name = saveName.trim() || `Carousel ${new Date().toLocaleDateString()}`;
    const config: CarouselConfig = {
      name,
      slides: slides.map((s) => ({ ...s, bgImageUrl: '', overlayImageUrl: '' })),
      savedAt: Date.now(),
    };
    const updated = [config, ...history].slice(0, 5);
    setHistory(updated);
    saveHistory(updated);
    setShowSaveInput(false);
    setSaveName('');
    notify(`Saved "${name}"`);
  }, [saveName, slides, history, notify]);

  const loadFromHistory = useCallback(
    (config: CarouselConfig) => {
      setSlides(config.slides.map((s) => ({ ...s, id: uid() })));
      setActiveIndex(0);
      setShowHistory(false);
      notify(`Loaded "${config.name}"`);
    },
    [notify],
  );

  const deleteFromHistory = useCallback(
    (index: number) => {
      const updated = history.filter((_, i) => i !== index);
      setHistory(updated);
      saveHistory(updated);
    },
    [history],
  );

  /* ── Preview navigation ── */
  const previewPrev = useCallback(() => {
    setPreviewIndex((p) => Math.max(0, p - 1));
  }, []);

  const previewNext = useCallback(() => {
    setPreviewIndex((p) => Math.min(slides.length - 1, p + 1));
  }, [slides.length]);

  /* ── Computed ── */
  const previewHeight = useMemo(
    () => SLIDE_SIZE * previewScale,
    [previewScale],
  );

  /* ──────────────────────── RENDER ──────────────────────── */

  return (
    <div className="space-y-5">
      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-[9999] bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-medium shadow-lg"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-12 w-20 h-20 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <LayoutTemplate className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Instagram Carousel Maker</h2>
            <p className="text-purple-100 text-xs">
              Create stunning multi-slide carousel posts — download as PNG
            </p>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={tryExample}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition"
        >
          <Sparkles className="w-3.5 h-3.5" /> Try Example
        </button>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
        >
          <LayoutTemplate className="w-3.5 h-3.5" /> Templates
        </button>
        <button
          onClick={() => setShowSaveInput(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
        >
          <Save className="w-3.5 h-3.5" /> Save
        </button>
        <button
          onClick={() => {
            setHistory(loadHistory());
            setShowHistory(!showHistory);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition"
        >
          <FolderOpen className="w-3.5 h-3.5" /> History
        </button>
        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
        <button
          onClick={() => {
            setPreviewMode(!previewMode);
            setPreviewIndex(activeIndex);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition ml-auto"
        >
          <Eye className="w-3.5 h-3.5" /> {previewMode ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Save input modal */}
      <AnimatePresence>
        {showSaveInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <input
                type="text"
                placeholder="Carousel name..."
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200"
                onKeyDown={(e) => e.key === 'Enter' && saveToHistory()}
              />
              <button
                onClick={saveToHistory}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveInput(false)}
                className="px-2 py-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates panel */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
              {SLIDE_TEMPLATES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => addFromTemplate(t)}
                  className="flex flex-col items-center gap-1 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition text-center"
                >
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {t.icon}
                  </span>
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              {history.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-3">
                  No saved carousels yet
                </p>
              ) : (
                history.map((cfg, i) => (
                  <div
                    key={cfg.savedAt}
                    className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {cfg.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {cfg.slides.length} slides &middot;{' '}
                        {new Date(cfg.savedAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => loadFromHistory(cfg)}
                      className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-semibold rounded-md hover:bg-indigo-700 transition"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteFromHistory(i)}
                      className="p-1 text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PREVIEW MODE ── */}
      {previewMode ? (
        <div className="space-y-4">
          <div
            ref={previewContainerRef}
            className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center"
            style={{ minHeight: previewHeight + 32 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slides[previewIndex]?.id}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.25 }}
                className="mx-auto"
                style={{
                  width: SLIDE_SIZE * previewScale,
                  height: previewHeight,
                  overflow: 'hidden',
                  borderRadius: 8,
                }}
              >
                <SlideCanvas
                  slide={slides[previewIndex]}
                  scale={previewScale}
                />
              </motion.div>
            </AnimatePresence>

            {/* Left / Right arrows */}
            {previewIndex > 0 && (
              <button
                onClick={previewPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {previewIndex < slides.length - 1 && (
              <button
                onClick={previewNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Instagram-style dots */}
          <div className="flex items-center justify-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setPreviewIndex(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === previewIndex
                    ? 'w-2.5 h-2.5 bg-indigo-500'
                    : 'w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* ── EDIT MODE ── */
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          {/* Left: Preview + Thumbnails */}
          <div className="space-y-4">
            {/* Main preview */}
            <div
              ref={previewContainerRef}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden p-4 flex items-center justify-center"
              style={{ minHeight: previewHeight + 32 }}
            >
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: SLIDE_SIZE * previewScale,
                  height: previewHeight,
                  overflow: 'hidden',
                  borderRadius: 8,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                }}
              >
                <SlideCanvas slide={activeSlide} scale={previewScale} />
              </motion.div>
            </div>

            {/* Instagram dots under preview */}
            <div className="flex items-center justify-center gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === activeIndex
                      ? 'w-2.5 h-2.5 bg-indigo-500'
                      : 'w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            {/* Thumbnails strip */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {slides.map((s, i) => (
                <motion.div
                  key={s.id}
                  layout
                  className={`relative shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                    i === activeIndex
                      ? 'border-indigo-500 shadow-lg'
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                  style={{ width: 80, height: 80 }}
                  onClick={() => setActiveIndex(i)}
                >
                  <div
                    style={{
                      width: SLIDE_SIZE,
                      height: SLIDE_SIZE,
                      transform: `scale(${80 / SLIDE_SIZE})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <SlideCanvas slide={s} scale={80 / SLIDE_SIZE} />
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 bg-black/60 text-white text-[9px] font-bold px-1 rounded">
                    {i + 1}
                  </div>

                  {/* Slide actions overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-0.5 opacity-0 hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSlide(i, 'up');
                      }}
                      className="w-5 h-5 bg-white/90 rounded flex items-center justify-center"
                      title="Move left"
                    >
                      <ChevronLeft className="w-3 h-3 text-slate-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateSlide(i);
                      }}
                      className="w-5 h-5 bg-white/90 rounded flex items-center justify-center"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3 text-slate-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSlide(i);
                      }}
                      className="w-5 h-5 bg-red-500/90 rounded flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSlide(i, 'down');
                      }}
                      className="w-5 h-5 bg-white/90 rounded flex items-center justify-center"
                      title="Move right"
                    >
                      <ChevronRight className="w-3 h-3 text-slate-700" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Add slide button */}
              {slides.length < MAX_SLIDES && (
                <button
                  onClick={addSlide}
                  className="shrink-0 w-[80px] h-[80px] rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-400 transition"
                >
                  <Plus className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Download buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => downloadSlide(activeIndex)}
                disabled={downloading}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Exporting...' : `Download Slide ${activeIndex + 1}`}
              </button>
              <button
                onClick={downloadAll}
                disabled={downloadingAll}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                <Archive className="w-4 h-4" />
                {downloadingAll
                  ? 'Exporting All...'
                  : `Download All (${slides.length} slides)`}
              </button>
            </div>
          </div>

          {/* Right: Settings panel */}
          <div className="space-y-4">
            {/* Slide info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-indigo-500" />
                  Slide {activeIndex + 1} of {slides.length}
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveSlide(activeIndex, 'up')}
                    disabled={activeIndex === 0}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button
                    onClick={() => moveSlide(activeIndex, 'down')}
                    disabled={activeIndex === slides.length - 1}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button
                    onClick={() => duplicateSlide(activeIndex)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button
                    onClick={() => deleteSlide(activeIndex)}
                    className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                  Headline
                </label>
                <input
                  type="text"
                  placeholder="Enter headline..."
                  value={activeSlide.headline}
                  onChange={(e) => updateSlide('headline', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Body */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                  Body Text
                </label>
                <textarea
                  placeholder="Enter body text..."
                  value={activeSlide.body}
                  onChange={(e) => updateSlide('body', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              {/* Text Alignment */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                  Alignment
                </label>
                <div className="flex gap-1">
                  {([
                    { val: 'left' as TextAlign, icon: AlignLeft },
                    { val: 'center' as TextAlign, icon: AlignCenter },
                    { val: 'right' as TextAlign, icon: AlignRight },
                  ]).map(({ val, icon: Icon }) => (
                    <button
                      key={val}
                      onClick={() => updateSlide('textAlign', val)}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition ${
                        activeSlide.textAlign === val
                          ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Font family */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                  Font
                </label>
                <select
                  value={activeSlide.fontFamily}
                  onChange={(e) => updateSlide('fontFamily', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.label} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text color */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeSlide.textColor}
                    onChange={(e) => updateSlide('textColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={activeSlide.textColor}
                    onChange={(e) => updateSlide('textColor', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Background settings */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-purple-500" />
                Background
              </h3>

              {/* BG type toggles */}
              <div className="flex gap-1">
                {(['solid', 'gradient', 'image'] as BackgroundType[]).map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() => updateSlide('bgType', t)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                        activeSlide.bgType === t
                          ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ),
                )}
              </div>

              {/* Solid color picker */}
              {activeSlide.bgType === 'solid' && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeSlide.bgColor}
                    onChange={(e) => updateSlide('bgColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={activeSlide.bgColor}
                    onChange={(e) => updateSlide('bgColor', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 font-mono outline-none"
                  />
                </div>
              )}

              {/* Gradient presets */}
              {activeSlide.bgType === 'gradient' && (
                <div className="grid grid-cols-4 gap-1.5">
                  {GRADIENT_PRESETS.map((g) => (
                    <button
                      key={g.name}
                      onClick={() => updateSlide('bgGradient', g.css)}
                      title={g.name}
                      className={`h-9 rounded-lg border-2 transition ${
                        activeSlide.bgGradient === g.css
                          ? 'border-purple-500 shadow-md scale-105'
                          : 'border-transparent hover:border-purple-300'
                      }`}
                      style={{ background: g.css }}
                    />
                  ))}
                </div>
              )}

              {/* Image upload */}
              {activeSlide.bgType === 'image' && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleImageUpload('bgImageUrl')}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-500 hover:text-indigo-500 hover:border-indigo-400 transition"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {activeSlide.bgImageUrl
                      ? 'Change Background Image'
                      : 'Upload Background Image'}
                  </button>
                  {activeSlide.bgImageUrl && (
                    <button
                      onClick={() => updateSlide('bgImageUrl', '')}
                      className="text-xs text-red-500 hover:text-red-700 transition"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Overlay image */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-teal-500" />
                Overlay Image
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Add a logo or icon overlay on top of the slide background
              </p>
              <button
                onClick={() => handleImageUpload('overlayImageUrl')}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-500 hover:text-teal-500 hover:border-teal-400 transition"
              >
                <ImageIcon className="w-4 h-4" />
                {activeSlide.overlayImageUrl
                  ? 'Change Overlay'
                  : 'Upload Overlay'}
              </button>
              {activeSlide.overlayImageUrl && (
                <button
                  onClick={() => updateSlide('overlayImageUrl', '')}
                  className="text-xs text-red-500 hover:text-red-700 transition"
                >
                  Remove overlay
                </button>
              )}
            </div>

            {/* Quick add slide */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-500" />
                Add Slide
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={addSlide}
                  disabled={slides.length >= MAX_SLIDES}
                  className="flex items-center justify-center gap-1 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition border border-emerald-200 dark:border-emerald-800 disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" /> Blank
                </button>
                {SLIDE_TEMPLATES.slice(0, 3).map((t) => (
                  <button
                    key={t.name}
                    onClick={() => addFromTemplate(t)}
                    disabled={slides.length >= MAX_SLIDES}
                    className="flex items-center justify-center gap-1 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition border border-indigo-200 dark:border-indigo-800 disabled:opacity-40 truncate px-2"
                  >
                    {t.icon} {t.name}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                {slides.length}/{MAX_SLIDES} slides
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy badge */}
      <div className="flex items-center justify-center gap-2 py-3">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Everything runs in your browser. No images are uploaded to any server.
        </span>
      </div>

      {/* Hidden export container */}
      <div ref={exportRef} className="fixed -left-[9999px] top-0" />
    </div>
  );
}
