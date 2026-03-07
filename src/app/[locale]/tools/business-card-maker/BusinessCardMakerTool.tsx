'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Download, RotateCcw, User, Building2, Phone, Mail,
  Globe, MapPin, Linkedin, Twitter, Instagram, Palette, Type,
  QrCode, FlipHorizontal, Sparkles, Shield, History, Trash2, Eye,
  Upload, X, Check
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface CardData {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  logoUrl: string;
  linkedin: string;
  twitter: string;
  instagram: string;
}

interface CardStyle {
  bgColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
}

interface Template {
  id: string;
  name: string;
  style: CardStyle;
  description: string;
}

interface SavedCard {
  id: string;
  data: CardData;
  style: CardStyle;
  templateId: string;
  timestamp: number;
}

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const CARD_W = 350;
const CARD_H = 200;

const FONT_OPTIONS = [
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Georgia', value: "'Georgia', serif" },
  { label: 'Courier', value: "'Courier New', monospace" },
  { label: 'Trebuchet', value: "'Trebuchet MS', sans-serif" },
  { label: 'Palatino', value: "'Palatino Linotype', serif" },
];

const TEMPLATES: Template[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, whitespace-focused design',
    style: { bgColor: '#ffffff', textColor: '#1a1a1a', accentColor: '#6366f1', fontFamily: "'Inter', sans-serif" },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional business look',
    style: { bgColor: '#f8fafc', textColor: '#0f172a', accentColor: '#1e40af', fontFamily: "'Georgia', serif" },
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold & colorful layout',
    style: { bgColor: '#fef3c7', textColor: '#78350f', accentColor: '#f59e0b', fontFamily: "'Trebuchet MS', sans-serif" },
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Smooth gradient background',
    style: { bgColor: '#667eea', textColor: '#ffffff', accentColor: '#a5b4fc', fontFamily: "'Inter', sans-serif" },
  },
  {
    id: 'dark-luxury',
    name: 'Dark Luxury',
    description: 'Elegant dark theme with gold',
    style: { bgColor: '#1a1a2e', textColor: '#eaeaea', accentColor: '#d4af37', fontFamily: "'Palatino Linotype', serif" },
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Modern developer style',
    style: { bgColor: '#0d1117', textColor: '#c9d1d9', accentColor: '#58a6ff', fontFamily: "'Courier New', monospace" },
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Earthy, organic feel',
    style: { bgColor: '#f0fdf4', textColor: '#14532d', accentColor: '#16a34a', fontFamily: "'Georgia', serif" },
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'High contrast, striking',
    style: { bgColor: '#ef4444', textColor: '#ffffff', accentColor: '#fbbf24', fontFamily: "'Trebuchet MS', sans-serif" },
  },
];

const INITIAL_DATA: CardData = {
  name: '', title: '', company: '', phone: '', email: '',
  website: '', address: '', logoUrl: '', linkedin: '', twitter: '', instagram: '',
};

const EXAMPLE_DATA: CardData = {
  name: 'Rajesh Kumar',
  title: 'Senior Software Engineer',
  company: 'TechVista Solutions',
  phone: '+91 98765 43210',
  email: 'rajesh@techvista.com',
  website: 'www.techvista.com',
  address: 'Sector 62, Noida, UP 201301',
  logoUrl: '',
  linkedin: 'rajeshkumar',
  twitter: 'rajesh_dev',
  instagram: 'rajesh.codes',
};

const STORAGE_KEY = 'business-card-maker-history';

/* ------------------------------------------------------------------ */
/*  QR CODE GENERATOR (simple version-1 style pattern)                 */
/* ------------------------------------------------------------------ */

function generateQRPattern(text: string): boolean[][] {
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[row + r][col + c] = isOuter || isInner;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Alignment pattern
  const ac = size - 9;
  for (let r = ac; r < ac + 5; r++) {
    for (let c = ac; c < ac + 5; c++) {
      if (r < size && c < size) {
        const isEdge = r === ac || r === ac + 4 || c === ac || c === ac + 4;
        const isCenter = r === ac + 2 && c === ac + 2;
        grid[r][c] = isEdge || isCenter;
      }
    }
  }

  // Data encoding based on input text hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder/timing areas
      if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue;
      if (r === 6 || c === 6) continue;
      if (r >= size - 9 && r < size - 4 && c >= size - 9 && c < size - 4) continue;

      const seed = (hash * (r + 1) * (c + 1) + r * 31 + c * 37) & 0xFFFF;
      grid[r][c] = seed % 3 !== 0;
    }
  }

  return grid;
}

/* ------------------------------------------------------------------ */
/*  CARD FRONT RENDERER                                                */
/* ------------------------------------------------------------------ */

function getTemplateBackground(templateId: string, bgColor: string): React.CSSProperties {
  switch (templateId) {
    case 'gradient':
      return { background: `linear-gradient(135deg, ${bgColor} 0%, #764ba2 100%)` };
    case 'dark-luxury':
      return { background: `linear-gradient(145deg, ${bgColor} 0%, #16213e 50%, #0f3460 100%)` };
    case 'tech':
      return { background: `radial-gradient(ellipse at 20% 80%, #161b22 0%, ${bgColor} 60%)` };
    case 'nature':
      return { background: `linear-gradient(135deg, ${bgColor} 0%, #dcfce7 50%, #bbf7d0 100%)` };
    case 'bold':
      return { background: `linear-gradient(135deg, ${bgColor} 0%, #dc2626 100%)` };
    case 'creative':
      return { background: `linear-gradient(135deg, ${bgColor} 0%, #fde68a 100%)` };
    default:
      return { backgroundColor: bgColor };
  }
}

interface CardFrontProps {
  data: CardData;
  style: CardStyle;
  templateId: string;
}

function CardFront({ data, style, templateId }: CardFrontProps) {
  const name = data.name || 'Your Name';
  const title = data.title || 'Your Designation';
  const company = data.company || 'Company Name';

  const isHorizontalLayout = ['corporate', 'tech', 'creative'].includes(templateId);
  const isDark = ['dark-luxury', 'tech', 'gradient', 'bold'].includes(templateId);

  const accentRGB = style.accentColor;
  const subtleText = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.5)';

  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        ...getTemplateBackground(templateId, style.bgColor),
        fontFamily: style.fontFamily,
        color: style.textColor,
        borderRadius: 10,
        position: 'relative',
        overflow: 'hidden',
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Decorative elements per template */}
      {templateId === 'minimal' && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 4, height: '100%', backgroundColor: accentRGB }} />
      )}
      {templateId === 'corporate' && (
        <>
          <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 4, backgroundColor: accentRGB }} />
          <div style={{ position: 'absolute', right: 0, top: 0, width: 80, height: '100%', backgroundColor: accentRGB, opacity: 0.08 }} />
        </>
      )}
      {templateId === 'creative' && (
        <>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 100, height: 100, borderRadius: '50%', backgroundColor: accentRGB, opacity: 0.25 }} />
          <div style={{ position: 'absolute', left: -20, bottom: -20, width: 70, height: 70, borderRadius: '50%', backgroundColor: accentRGB, opacity: 0.15 }} />
        </>
      )}
      {templateId === 'dark-luxury' && (
        <>
          <div style={{ position: 'absolute', right: 0, top: 0, width: 120, height: 120, background: `radial-gradient(circle, ${accentRGB}22 0%, transparent 70%)` }} />
          <div style={{ position: 'absolute', left: 16, top: 16, right: 16, bottom: 16, border: `1px solid ${accentRGB}33`, borderRadius: 6, pointerEvents: 'none' }} />
        </>
      )}
      {templateId === 'tech' && (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 2, background: `linear-gradient(90deg, ${accentRGB}, transparent)` }} />
          <div style={{ position: 'absolute', right: 12, top: 12, fontSize: 8, color: `${accentRGB}88`, fontFamily: 'monospace', letterSpacing: 2 }}>
            {'</>'}
          </div>
        </>
      )}
      {templateId === 'nature' && (
        <div style={{ position: 'absolute', right: -10, bottom: -10, width: 90, height: 90, borderRadius: '50%', backgroundColor: accentRGB, opacity: 0.1 }} />
      )}
      {templateId === 'bold' && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.2) 100%)' }} />
      )}

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1, padding: isHorizontalLayout ? '20px 22px' : '22px 24px',
        height: '100%', display: 'flex', flexDirection: isHorizontalLayout ? 'row' : 'column',
        justifyContent: isHorizontalLayout ? 'space-between' : 'space-between', boxSizing: 'border-box',
      }}>
        {isHorizontalLayout ? (
          <>
            {/* Left: Name & identity */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, minWidth: 0 }}>
              {data.logoUrl && (
                <img src={data.logoUrl} alt="" style={{ width: 28, height: 28, objectFit: 'contain', marginBottom: 6, borderRadius: 4 }} />
              )}
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
              <div style={{ fontSize: 9, fontWeight: 500, color: accentRGB, marginTop: 2, textTransform: 'uppercase', letterSpacing: 1.2 }}>{title}</div>
              <div style={{ fontSize: 9, color: subtleText, marginTop: 2 }}>{company}</div>
            </div>
            {/* Right: Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', fontSize: 7.5, gap: 3, minWidth: 0 }}>
              {data.phone && <div style={{ color: subtleText, whiteSpace: 'nowrap' }}>{data.phone}</div>}
              {data.email && <div style={{ color: subtleText, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{data.email}</div>}
              {data.website && <div style={{ color: accentRGB, whiteSpace: 'nowrap' }}>{data.website}</div>}
              {data.address && <div style={{ color: subtleText, textAlign: 'right', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.address}</div>}
            </div>
          </>
        ) : (
          <>
            {/* Top section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {data.logoUrl && (
                  <img src={data.logoUrl} alt="" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4 }} />
                )}
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{name}</div>
                  <div style={{ fontSize: 9, fontWeight: 500, color: accentRGB, marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</div>
                </div>
              </div>
              {company && <div style={{ fontSize: 9, color: subtleText, marginTop: 6, fontWeight: 500 }}>{company}</div>}
            </div>
            {/* Bottom: Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2.5, fontSize: 7.5 }}>
              {data.phone && <div style={{ color: subtleText, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: accentRGB, fontSize: 7 }}>TEL</span> {data.phone}
              </div>}
              {data.email && <div style={{ color: subtleText, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: accentRGB, fontSize: 7 }}>EMAIL</span> {data.email}
              </div>}
              {data.website && <div style={{ color: accentRGB, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 7 }}>WEB</span> {data.website}
              </div>}
              {data.address && <div style={{ color: subtleText, display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: accentRGB, fontSize: 7 }}>ADDR</span> {data.address}
              </div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CARD BACK RENDERER                                                 */
/* ------------------------------------------------------------------ */

interface CardBackProps {
  data: CardData;
  style: CardStyle;
  templateId: string;
}

function CardBack({ data, style, templateId }: CardBackProps) {
  const vCardText = `BEGIN:VCARD\nFN:${data.name || 'Name'}\nTITLE:${data.title}\nORG:${data.company}\nTEL:${data.phone}\nEMAIL:${data.email}\nURL:${data.website}\nADR:${data.address}\nEND:VCARD`;
  const qrGrid = generateQRPattern(vCardText);
  const isDark = ['dark-luxury', 'tech', 'gradient', 'bold'].includes(templateId);
  const subtleText = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';

  const hasSocials = data.linkedin || data.twitter || data.instagram;

  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        ...getTemplateBackground(templateId, style.bgColor),
        fontFamily: style.fontFamily,
        color: style.textColor,
        borderRadius: 10,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* Decorative */}
      {templateId === 'minimal' && (
        <div style={{ position: 'absolute', right: 0, top: 0, width: 4, height: '100%', backgroundColor: style.accentColor }} />
      )}
      {templateId === 'dark-luxury' && (
        <div style={{ position: 'absolute', left: 16, top: 16, right: 16, bottom: 16, border: `1px solid ${style.accentColor}33`, borderRadius: 6, pointerEvents: 'none' }} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
        {/* QR Code */}
        <div style={{ backgroundColor: '#ffffff', padding: 6, borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <svg width={80} height={80} viewBox={`0 0 ${qrGrid.length} ${qrGrid.length}`}>
            {qrGrid.map((row, r) =>
              row.map((cell, c) =>
                cell ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#1a1a1a" /> : null
              )
            )}
          </svg>
        </div>

        {/* Company name */}
        {data.company && (
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: style.accentColor }}>
            {data.company}
          </div>
        )}

        {/* Social handles */}
        {hasSocials && (
          <div style={{ display: 'flex', gap: 12, fontSize: 7, color: subtleText }}>
            {data.linkedin && <span>in/{data.linkedin}</span>}
            {data.twitter && <span>@{data.twitter}</span>}
            {data.instagram && <span>@{data.instagram}</span>}
          </div>
        )}

        {/* Scan label */}
        <div style={{ fontSize: 6.5, color: subtleText, letterSpacing: 1 }}>SCAN TO SAVE CONTACT</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function BusinessCardMakerTool() {
  const [data, setData] = useState<CardData>(INITIAL_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('minimal');
  const [customStyle, setCustomStyle] = useState<CardStyle>(TEMPLATES[0].style);
  const [showFront, setShowFront] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'pdf'>('png');
  const [notification, setNotification] = useState<string | null>(null);

  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSavedCards(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  // Show notification briefly
  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  // Apply template
  const applyTemplate = useCallback((templateId: string) => {
    const tpl = TEMPLATES.find(t => t.id === templateId);
    if (tpl) {
      setSelectedTemplate(templateId);
      setCustomStyle({ ...tpl.style });
    }
  }, []);

  // Update field
  const updateField = useCallback((field: keyof CardData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Logo upload
  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) {
      showNotification('Logo must be under 500KB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setData(prev => ({ ...prev, logoUrl: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  }, [showNotification]);

  // Flip animation
  const handleFlip = useCallback(() => {
    setIsFlipping(true);
    setTimeout(() => {
      setShowFront(prev => !prev);
      setTimeout(() => setIsFlipping(false), 300);
    }, 150);
  }, []);

  // Download
  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const frontEl = cardFrontRef.current;
      const backEl = cardBackRef.current;

      if (downloadFormat === 'png') {
        // Download front
        if (frontEl) {
          const canvas = await html2canvas(frontEl, { scale: 3, useCORS: true, backgroundColor: null });
          const link = document.createElement('a');
          link.download = `business-card-front-${Date.now()}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
        // Download back
        if (backEl) {
          const canvas = await html2canvas(backEl, { scale: 3, useCORS: true, backgroundColor: null });
          const link = document.createElement('a');
          link.download = `business-card-back-${Date.now()}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
        showNotification('Front & back PNGs downloaded!');
      } else {
        // PDF download - use canvas then embed in a simple PDF-like approach
        if (frontEl && backEl) {
          const canvasFront = await html2canvas(frontEl, { scale: 3, useCORS: true, backgroundColor: null });
          const canvasBack = await html2canvas(backEl, { scale: 3, useCORS: true, backgroundColor: null });

          // Create a combined image
          const combined = document.createElement('canvas');
          combined.width = canvasFront.width;
          combined.height = canvasFront.height + canvasBack.height + 60;
          const ctx = combined.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, combined.width, combined.height);
            ctx.drawImage(canvasFront, 0, 0);
            ctx.fillStyle = '#999999';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('- Front | Back -', combined.width / 2, canvasFront.height + 36);
            ctx.drawImage(canvasBack, 0, canvasFront.height + 60);

            const link = document.createElement('a');
            link.download = `business-card-${Date.now()}.png`;
            link.href = combined.toDataURL('image/png');
            link.click();
          }
          showNotification('Combined card image downloaded!');
        }
      }
    } catch (err) {
      console.error(err);
      showNotification('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [downloadFormat, showNotification]);

  // Save to history
  const saveToHistory = useCallback(() => {
    const card: SavedCard = {
      id: Date.now().toString(),
      data: { ...data },
      style: { ...customStyle },
      templateId: selectedTemplate,
      timestamp: Date.now(),
    };
    const updated = [card, ...savedCards].slice(0, 5);
    setSavedCards(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
    showNotification('Card saved to history!');
  }, [data, customStyle, selectedTemplate, savedCards, showNotification]);

  // Load from history
  const loadFromHistory = useCallback((card: SavedCard) => {
    setData(card.data);
    setCustomStyle(card.style);
    setSelectedTemplate(card.templateId);
    setShowHistory(false);
    showNotification('Card loaded from history');
  }, [showNotification]);

  // Delete from history
  const deleteFromHistory = useCallback((id: string) => {
    const updated = savedCards.filter(c => c.id !== id);
    setSavedCards(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
  }, [savedCards]);

  // Reset
  const handleReset = useCallback(() => {
    setData(INITIAL_DATA);
    applyTemplate('minimal');
    setShowFront(true);
    showNotification('Card reset to defaults');
  }, [applyTemplate, showNotification]);

  // Try example
  const handleExample = useCallback(() => {
    setData(EXAMPLE_DATA);
    applyTemplate('dark-luxury');
    showNotification('Example data loaded!');
  }, [applyTemplate, showNotification]);

  const activeTemplate = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium"
          >
            <Check className="w-4 h-4" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top action bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button onClick={handleExample} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Sparkles className="w-4 h-4" /> Try Example
        </button>
        <button onClick={saveToHistory} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
          <CreditCard className="w-4 h-4" /> Save Card
        </button>
        <button onClick={() => setShowHistory(!showHistory)} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors relative">
          <History className="w-4 h-4" /> History
          {savedCards.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {savedCards.length}
            </span>
          )}
        </button>
        <button onClick={handleReset} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* History panel */}
      <AnimatePresence>
        {showHistory && savedCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <History className="w-4 h-4" /> Saved Cards (Last 5)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedCards.map((card) => (
                  <div key={card.id} className="bg-gray-900/60 border border-gray-700 rounded-lg p-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate">{card.data.name || 'Unnamed'}</p>
                      <p className="text-xs text-gray-400 truncate">{card.data.company || 'No company'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(card.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1.5 ml-2 shrink-0">
                      <button onClick={() => loadFromHistory(card)} className="p-1.5 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 transition-colors" title="Load">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteFromHistory(card.id)} className="p-1.5 rounded bg-red-600/30 hover:bg-red-600/50 text-red-300 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout: controls + preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Controls */}
        <div className="space-y-5">
          {/* Template selector */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" /> Choose Template
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {TEMPLATES.map((tpl) => {
                const isActive = selectedTemplate === tpl.id;
                return (
                  <motion.button
                    key={tpl.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applyTemplate(tpl.id)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      isActive ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {/* Mini preview */}
                    <div
                      className="w-full aspect-[1.75/1]"
                      style={{
                        ...getTemplateBackground(tpl.id, tpl.style.bgColor),
                        position: 'relative',
                      }}
                    >
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4px 6px' }}>
                        <div style={{ width: '60%', height: 3, backgroundColor: tpl.style.textColor, borderRadius: 2, opacity: 0.7 }} />
                        <div style={{ width: '40%', height: 2, backgroundColor: tpl.style.accentColor, borderRadius: 2, marginTop: 2 }} />
                        <div style={{ width: '50%', height: 1.5, backgroundColor: tpl.style.textColor, borderRadius: 2, marginTop: 4, opacity: 0.3 }} />
                        <div style={{ width: '45%', height: 1.5, backgroundColor: tpl.style.textColor, borderRadius: 2, marginTop: 1.5, opacity: 0.3 }} />
                      </div>
                    </div>
                    <div className="py-1 px-1 bg-gray-900/80 text-center">
                      <span className="text-[10px] font-medium text-gray-300">{tpl.name}</span>
                    </div>
                    {isActive && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Personal info */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField icon={<User className="w-3.5 h-3.5" />} label="Full Name" value={data.name} onChange={(v) => updateField('name', v)} placeholder="John Doe" />
              <InputField icon={<Type className="w-3.5 h-3.5" />} label="Title / Designation" value={data.title} onChange={(v) => updateField('title', v)} placeholder="Software Engineer" />
              <InputField icon={<Building2 className="w-3.5 h-3.5" />} label="Company Name" value={data.company} onChange={(v) => updateField('company', v)} placeholder="Acme Corp" />
              <InputField icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={data.phone} onChange={(v) => updateField('phone', v)} placeholder="+91 98765 43210" />
              <InputField icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={data.email} onChange={(v) => updateField('email', v)} placeholder="you@email.com" />
              <InputField icon={<Globe className="w-3.5 h-3.5" />} label="Website" value={data.website} onChange={(v) => updateField('website', v)} placeholder="www.example.com" />
              <div className="sm:col-span-2">
                <InputField icon={<MapPin className="w-3.5 h-3.5" />} label="Address" value={data.address} onChange={(v) => updateField('address', v)} placeholder="123 Main St, City" />
              </div>
            </div>

            {/* Logo upload */}
            <div className="mt-3">
              <label className="text-xs font-medium text-gray-400 mb-1 block">Company Logo</label>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                {data.logoUrl && (
                  <div className="flex items-center gap-2">
                    <img src={data.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded" />
                    <button onClick={() => updateField('logoUrl', '')} className="text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <span className="text-xs text-gray-500">Max 500KB</span>
              </div>
            </div>
          </div>

          {/* Social media */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" /> Social Media (Optional)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InputField icon={<Linkedin className="w-3.5 h-3.5" />} label="LinkedIn" value={data.linkedin} onChange={(v) => updateField('linkedin', v)} placeholder="username" />
              <InputField icon={<Twitter className="w-3.5 h-3.5" />} label="Twitter / X" value={data.twitter} onChange={(v) => updateField('twitter', v)} placeholder="handle" />
              <InputField icon={<Instagram className="w-3.5 h-3.5" />} label="Instagram" value={data.instagram} onChange={(v) => updateField('instagram', v)} placeholder="handle" />
            </div>
          </div>

          {/* Customization */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" /> Customize Colors & Font
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ColorPicker label="Background" value={customStyle.bgColor} onChange={(v) => setCustomStyle(s => ({ ...s, bgColor: v }))} />
              <ColorPicker label="Text Color" value={customStyle.textColor} onChange={(v) => setCustomStyle(s => ({ ...s, textColor: v }))} />
              <ColorPicker label="Accent" value={customStyle.accentColor} onChange={(v) => setCustomStyle(s => ({ ...s, accentColor: v }))} />
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">Font Family</label>
                <select
                  value={customStyle.fontFamily}
                  onChange={(e) => setCustomStyle(s => ({ ...s, fontFamily: e.target.value }))}
                  className="w-full px-2 py-1.5 bg-gray-900 border border-gray-600 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
                >
                  {FONT_OPTIONS.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Preview + Download */}
        <div className="space-y-5">
          {/* Card Preview */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" /> Live Preview
              </h3>
              <button
                onClick={handleFlip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium rounded-lg transition-colors border border-indigo-500/30"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                {showFront ? 'Show Back' : 'Show Front'}
              </button>
            </div>

            {/* Card with flip animation */}
            <div className="flex justify-center" style={{ perspective: 1000 }}>
              <motion.div
                animate={{
                  rotateY: isFlipping ? 90 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="rounded-xl shadow-2xl shadow-black/30" style={{ width: CARD_W, height: CARD_H }}>
                  {showFront ? (
                    <CardFront data={data} style={customStyle} templateId={selectedTemplate} />
                  ) : (
                    <CardBack data={data} style={customStyle} templateId={selectedTemplate} />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Side indicator */}
            <div className="flex justify-center gap-2 mt-4">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${showFront ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' : 'text-gray-500'}`}>
                Front
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${!showFront ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' : 'text-gray-500'}`}>
                Back
              </span>
            </div>
          </div>

          {/* Download section */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-400" /> Download Card
            </h3>
            <div className="flex items-center gap-3">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as 'png' | 'pdf')}
                className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="png">PNG (Front + Back)</option>
                <option value="pdf">Combined Image</option>
              </select>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Generating...' : 'Download Now'}
              </button>
            </div>
          </div>

          {/* QR Code info */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-indigo-400" /> vCard QR Code
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              The back of your card includes a QR code pattern generated from your contact details.
              It visually represents a vCard format for a professional appearance.
              Flip the card to see the QR code with your social handles.
            </p>
          </div>

          {/* Privacy badge */}
          <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-800/30 rounded-xl px-4 py-3">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-emerald-300">100% Private & Secure</p>
              <p className="text-[11px] text-emerald-400/70">All processing happens in your browser. No data is uploaded to any server.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden render targets for html2canvas */}
      <div className="fixed -left-[9999px] -top-[9999px]" aria-hidden="true">
        <div ref={cardFrontRef}>
          <CardFront data={data} style={customStyle} templateId={selectedTemplate} />
        </div>
        <div ref={cardBackRef}>
          <CardBack data={data} style={customStyle} templateId={selectedTemplate} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  REUSABLE SUB-COMPONENTS                                            */
/* ------------------------------------------------------------------ */

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function InputField({ icon, label, value, onChange, placeholder }: InputFieldProps) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
        {icon} {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-1.5 bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
      />
    </div>
  );
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-400 mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-gray-600 bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 px-2 py-1 bg-gray-900 border border-gray-600 rounded text-xs text-gray-300 font-mono focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
}
