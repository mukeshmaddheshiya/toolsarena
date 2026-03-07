'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  MessageCircle, Download, RotateCcw, Plus, Trash2, Lock, History,
  X, ChevronDown, Phone, Video, MoreVertical, Send, Smile, Paperclip,
  Camera, Mic, Check, CheckCheck, Image as ImageIcon, Clock, Shield,
  Copy, ArrowLeft, Search, GripVertical, Sun, Moon, Upload, Palette,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type TickStatus = 'sent' | 'delivered' | 'read' | 'none';
type MessageType = 'text' | 'image' | 'voice' | 'deleted';
type ThemeMode = 'light' | 'dark';

interface ChatMessage {
  id: string;
  text: string;
  time: string;
  isSent: boolean;
  tickStatus: TickStatus;
  type: MessageType;
  replyTo?: string;
  starred?: boolean;
  imageCaption?: string;
}

interface ContactInfo {
  name: string;
  status: string;
  avatar: string | null;
  initials: string;
}

interface WallpaperConfig {
  type: 'wa-image' | 'color' | 'custom-image';
  /** For wa-image: path like /images/whatsapp/wa-dark-green.jpg; for color: hex; for custom-image: data URL */
  value: string;
}

interface HistoryItem {
  id: string;
  name: string;
  messageCount: number;
  savedAt: string;
  contact: ContactInfo;
  messages: ChatMessage[];
  theme: ThemeMode;
  wallpaper: WallpaperConfig;
  statusBarTime: string;
  batteryLevel: number;
}

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const WHATSAPP_GREEN = '#25D366';
const WHATSAPP_TEAL = '#128C7E';
const WHATSAPP_DARK_TEAL = '#075E54';
const WHATSAPP_LIGHT_GREEN = '#DCF8C6';
const WHATSAPP_BLUE_TICK = '#53BDEB';

const LIGHT_THEME = {
  headerBg: WHATSAPP_DARK_TEAL,
  headerText: '#FFFFFF',
  chatBg: '#ECE5DD',
  sentBubble: WHATSAPP_LIGHT_GREEN,
  sentText: '#303030',
  receivedBubble: '#FFFFFF',
  receivedText: '#303030',
  inputBg: '#FFFFFF',
  inputBarBg: '#F0F0F0',
  timeText: '#667781',
  wallpaperPattern: 'rgba(0,0,0,0.06)',
};

const DARK_THEME = {
  headerBg: '#1F2C34',
  headerText: '#E9EDEF',
  chatBg: '#0B141A',
  sentBubble: '#005C4B',
  sentText: '#E9EDEF',
  receivedBubble: '#202C33',
  receivedText: '#E9EDEF',
  inputBg: '#2A3942',
  inputBarBg: '#1F2C34',
  timeText: '#8696A0',
  wallpaperPattern: 'rgba(255,255,255,0.03)',
};

const DEFAULT_MESSAGES: ChatMessage[] = [
  { id: '1', text: 'Hey! How are you?', time: '10:30 AM', isSent: false, tickStatus: 'none', type: 'text' },
  { id: '2', text: "I'm good! Just finished work. What's up?", time: '10:31 AM', isSent: true, tickStatus: 'read', type: 'text' },
  { id: '3', text: 'Want to grab dinner tonight? Found a great new restaurant!', time: '10:32 AM', isSent: false, tickStatus: 'none', type: 'text' },
  { id: '4', text: 'Sure! Send me the location', time: '10:33 AM', isSent: true, tickStatus: 'read', type: 'text' },
  { id: '5', text: "I'll share it in a bit. It's near City Center Mall", time: '10:34 AM', isSent: false, tickStatus: 'none', type: 'text' },
  { id: '6', text: 'Perfect! See you at 8?', time: '10:35 AM', isSent: true, tickStatus: 'delivered', type: 'text' },
];

// Real WhatsApp wallpaper images
const WA_WALLPAPERS: { src: string; label: string; thumbBg: string }[] = [
  { src: '/images/whatsapp/wa-dark-green.jpg', label: 'Dark Green', thumbBg: '#0d2818' },
  { src: '/images/whatsapp/wa-dark-black.jpg', label: 'Dark Black', thumbBg: '#0a0a0a' },
  { src: '/images/whatsapp/wa-dark-gray.jpg', label: 'Dark Gray', thumbBg: '#2a2f32' },
];

const SOLID_WALLPAPERS = [
  '#ECE5DD', '#0B141A', '#B1D8B7', '#C9DAF8', '#F4CCCC',
  '#D5A6BD', '#FFE0B2', '#B39DDB', '#80CBC4', '#FFCCBC',
  '#E1BEE7', '#C5E1A5', '#FFF9C4', '#B2EBF2', '#008069', '#025144',
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/* ------------------------------------------------------------------ */
/*  TICK ICONS                                                         */
/* ------------------------------------------------------------------ */

function TickIcon({ status, theme }: { status: TickStatus; theme: ThemeMode }) {
  const t = theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  if (status === 'none') return null;
  if (status === 'sent') return (
    <Check size={14} style={{ color: t.timeText, marginLeft: 2, flexShrink: 0 }} />
  );
  const color = status === 'read' ? WHATSAPP_BLUE_TICK : t.timeText;
  return (
    <span style={{ marginLeft: 2, flexShrink: 0, display: 'inline-flex' }}>
      <CheckCheck size={14} style={{ color }} />
    </span>
  );
}


/* ------------------------------------------------------------------ */
/*  STATUS BAR                                                         */
/* ------------------------------------------------------------------ */

function StatusBar({ time, battery, theme }: { time: string; battery: number; theme: ThemeMode }) {
  const t = theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '4px 12px', fontSize: 12, fontWeight: 600,
      color: t.headerText, backgroundColor: t.headerBg,
      fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif',
    }}>
      <span>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Signal bars */}
        <svg width="16" height="12" viewBox="0 0 16 12">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill={t.headerText} />
          <rect x="4" y="5" width="3" height="7" rx="0.5" fill={t.headerText} />
          <rect x="8" y="2" width="3" height="10" rx="0.5" fill={t.headerText} />
          <rect x="12" y="0" width="3" height="12" rx="0.5" fill={t.headerText} opacity={0.4} />
        </svg>
        {/* WiFi */}
        <svg width="14" height="12" viewBox="0 0 14 12" fill={t.headerText}>
          <path d="M7 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
          <path d="M3.5 8.5a5 5 0 017 0" fill="none" stroke={t.headerText} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M1 5.5a9 9 0 0112 0" fill="none" stroke={t.headerText} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {/* Battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div style={{
            width: 22, height: 10, border: `1.5px solid ${t.headerText}`,
            borderRadius: 2, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', left: 1, top: 1, bottom: 1,
              width: `${Math.min(battery, 100) * 0.88}%`,
              backgroundColor: battery <= 20 ? '#FF3B30' : t.headerText,
              borderRadius: 1,
            }} />
          </div>
          <div style={{ width: 2, height: 5, backgroundColor: t.headerText, borderRadius: '0 1px 1px 0' }} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CHAT HEADER                                                        */
/* ------------------------------------------------------------------ */

function ChatHeader({ contact, theme }: { contact: ContactInfo; theme: ThemeMode }) {
  const t = theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 8px 8px 4px',
      backgroundColor: t.headerBg, color: t.headerText,
      fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif',
    }}>
      <ArrowLeft size={22} style={{ color: t.headerText, opacity: 0.9 }} />
      {/* Avatar */}
      <div style={{
        width: 38, height: 38, borderRadius: '50%', overflow: 'hidden',
        backgroundColor: '#4DB6AC', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
      }}>
        {contact.avatar ? (
          <img src={contact.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ color: '#FFF', fontSize: 15, fontWeight: 600 }}>{contact.initials}</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {contact.name}
        </div>
        <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.2 }}>{contact.status}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Video size={20} style={{ color: t.headerText, opacity: 0.9 }} />
        <Phone size={18} style={{ color: t.headerText, opacity: 0.9 }} />
        <MoreVertical size={20} style={{ color: t.headerText, opacity: 0.9 }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CHAT BUBBLE                                                        */
/* ------------------------------------------------------------------ */

function ChatBubble({ msg, theme }: { msg: ChatMessage; theme: ThemeMode }) {
  const t = theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  const isSent = msg.isSent;

  if (msg.type === 'deleted') {
    return (
      <div style={{
        alignSelf: isSent ? 'flex-end' : 'flex-start',
        maxWidth: '75%', padding: '6px 12px', borderRadius: 8,
        backgroundColor: isSent ? t.sentBubble : t.receivedBubble,
        opacity: 0.7, fontStyle: 'italic', fontSize: 13.5,
        color: t.timeText,
        fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          This message was deleted
        </span>
      </div>
    );
  }

  if (msg.type === 'image') {
    return (
      <div style={{
        alignSelf: isSent ? 'flex-end' : 'flex-start',
        maxWidth: '65%', borderRadius: 8, overflow: 'hidden',
        backgroundColor: isSent ? t.sentBubble : t.receivedBubble,
        fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif',
      }}>
        <div style={{
          width: '100%', height: 160, backgroundColor: theme === 'dark' ? '#374151' : '#E5E7EB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ImageIcon size={40} style={{ color: theme === 'dark' ? '#6B7280' : '#9CA3AF' }} />
        </div>
        {msg.imageCaption && (
          <div style={{ padding: '4px 8px', fontSize: 13.5, color: isSent ? t.sentText : t.receivedText }}>
            {msg.imageCaption}
          </div>
        )}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: 2, padding: '0 8px 4px', fontSize: 11, color: t.timeText,
        }}>
          <span>{msg.time}</span>
          {isSent && <TickIcon status={msg.tickStatus} theme={theme} />}
        </div>
      </div>
    );
  }

  if (msg.type === 'voice') {
    return (
      <div style={{
        alignSelf: isSent ? 'flex-end' : 'flex-start',
        maxWidth: '70%', padding: '6px 8px', borderRadius: 8,
        backgroundColor: isSent ? t.sentBubble : t.receivedBubble,
        fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', backgroundColor: WHATSAPP_TEAL,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Mic size={18} style={{ color: '#FFF' }} />
          </div>
          {/* Waveform */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5, height: 28 }}>
            {Array.from({ length: 28 }, (_, i) => {
              const h = Math.max(4, Math.sin(i * 0.7 + 1) * 14 + Math.cos(i * 1.3) * 8 + 12);
              return (
                <div key={i} style={{
                  width: 2.5, height: h, borderRadius: 2,
                  backgroundColor: isSent ? (theme === 'dark' ? '#8696A0' : '#5E8E75') : (theme === 'dark' ? '#8696A0' : '#A0AEB9'),
                }} />
              );
            })}
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 2, fontSize: 11, color: t.timeText,
        }}>
          <span>{msg.text || '0:32'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {msg.time}
            {isSent && <TickIcon status={msg.tickStatus} theme={theme} />}
          </span>
        </div>
      </div>
    );
  }

  // Text message
  const bubbleBg = isSent ? t.sentBubble : t.receivedBubble;
  const textColor = isSent ? t.sentText : t.receivedText;

  // Tail
  const tailColor = bubbleBg;

  return (
    <div style={{
      alignSelf: isSent ? 'flex-end' : 'flex-start',
      maxWidth: '75%', position: 'relative',
    }}>
      {/* Bubble tail */}
      <div style={{
        position: 'absolute', top: 0,
        ...(isSent
          ? { right: -6 }
          : { left: -6 }
        ),
        width: 0, height: 0,
        borderTop: `6px solid ${tailColor}`,
        borderLeft: isSent ? '6px solid transparent' : 'none',
        borderRight: isSent ? 'none' : '6px solid transparent',
      }} />
      <div style={{
        padding: '6px 8px 4px', borderRadius: 8,
        borderTopRightRadius: isSent ? 0 : 8,
        borderTopLeftRadius: isSent ? 8 : 0,
        backgroundColor: bubbleBg,
        fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif',
      }}>
        {msg.replyTo && (
          <div style={{
            borderLeft: `3px solid ${WHATSAPP_TEAL}`,
            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            borderRadius: 4, padding: '4px 8px', marginBottom: 4,
            fontSize: 12, color: t.timeText, maxHeight: 50, overflow: 'hidden',
          }}>
            {msg.replyTo}
          </div>
        )}
        {msg.starred && (
          <span style={{ float: 'right', marginLeft: 4, marginTop: -2 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>
        )}
        <span style={{
          fontSize: 14.2, lineHeight: 1.35, color: textColor,
          wordBreak: 'break-word', whiteSpace: 'pre-wrap',
        }}>
          {msg.text}
        </span>
        <span style={{
          float: 'right', display: 'inline-flex', alignItems: 'center',
          gap: 2, marginLeft: 8, marginTop: 2,
          fontSize: 11, color: t.timeText, whiteSpace: 'nowrap',
        }}>
          {msg.time}
          {isSent && <TickIcon status={msg.tickStatus} theme={theme} />}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  INPUT BAR                                                          */
/* ------------------------------------------------------------------ */

function InputBar({ theme }: { theme: ThemeMode }) {
  const t = theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 6px', backgroundColor: t.inputBarBg,
      fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', gap: 8,
        backgroundColor: t.inputBg, borderRadius: 24, padding: '8px 12px',
      }}>
        <Smile size={22} style={{ color: '#8696A0', flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 15, color: '#8696A0' }}>Type a message</span>
        <Paperclip size={20} style={{ color: '#8696A0', flexShrink: 0, transform: 'rotate(45deg)' }} />
        <Camera size={20} style={{ color: '#8696A0', flexShrink: 0 }} />
      </div>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        backgroundColor: WHATSAPP_TEAL, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Mic size={22} style={{ color: '#FFF' }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ENCRYPTION NOTICE                                                  */
/* ------------------------------------------------------------------ */

function EncryptionNotice({ theme }: { theme: ThemeMode }) {
  const t = theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  return (
    <div style={{
      textAlign: 'center', padding: '6px 12px', fontSize: 11.5,
      color: t.timeText,
      fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        borderRadius: 6, padding: '4px 10px',
      }}>
        <Lock size={11} />
        Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Tap to learn more.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DATE CHIP                                                          */
/* ------------------------------------------------------------------ */

function DateChip({ text, theme }: { text: string; theme: ThemeMode }) {
  return (
    <div style={{
      textAlign: 'center', padding: '4px 0',
      fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif',
    }}>
      <span style={{
        display: 'inline-block', fontSize: 12, fontWeight: 500,
        color: theme === 'dark' ? '#8696A0' : '#54656F',
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
        borderRadius: 8, padding: '4px 12px',
        boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
      }}>
        {text}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function WhatsAppChatGeneratorTool() {
  // Contact state
  const [contact, setContact] = useState<ContactInfo>({
    name: 'John Doe',
    status: 'online',
    avatar: null,
    initials: 'JD',
  });

  // Messages
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);

  // Theme & wallpaper
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [wallpaper, setWallpaper] = useState<WallpaperConfig>({
    type: 'wa-image',
    value: '/images/whatsapp/wa-dark-green.jpg',
  });

  // Status bar
  const [statusBarTime, setStatusBarTime] = useState('9:41');
  const [batteryLevel, setBatteryLevel] = useState(85);

  // Date chip
  const [dateChipText, setDateChipText] = useState('TODAY');
  const [showDateChip, setShowDateChip] = useState(true);
  const [showEncryption, setShowEncryption] = useState(true);

  // Editing message
  const [editingId, setEditingId] = useState<string | null>(null);

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Download
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Refs
  const previewRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wa-chat-gen-history');
      if (saved) setHistory(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveHistory = useCallback((items: HistoryItem[]) => {
    setHistory(items);
    try { localStorage.setItem('wa-chat-gen-history', JSON.stringify(items)); } catch { /* ignore */ }
  }, []);

  // Update initials when name changes
  useEffect(() => {
    setContact(c => ({ ...c, initials: getInitials(c.name || 'U') }));
  }, [contact.name]);

  // Handlers
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setContact(c => ({ ...c, avatar: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setWallpaper({ type: 'custom-image', value: reader.result as string });
    reader.readAsDataURL(file);
  };

  const addMessage = () => {
    const newMsg: ChatMessage = {
      id: genId(),
      text: 'New message',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      isSent: true,
      tickStatus: 'read',
      type: 'text',
    };
    setMessages(prev => [...prev, newMsg]);
    setEditingId(newMsg.id);
  };

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const duplicateMessage = (id: string) => {
    const idx = messages.findIndex(m => m.id === id);
    if (idx < 0) return;
    const clone = { ...messages[idx], id: genId() };
    const updated = [...messages];
    updated.splice(idx + 1, 0, clone);
    setMessages(updated);
  };

  const handleDownload = async () => {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `whatsapp-chat-${contact.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Save to history
      const item: HistoryItem = {
        id: genId(),
        name: contact.name,
        messageCount: messages.length,
        savedAt: new Date().toLocaleString(),
        contact, messages, theme, wallpaper, statusBarTime, batteryLevel,
      };
      const updated = [item, ...history].slice(0, 5);
      saveHistory(updated);
    } catch { /* ignore */ }
    setDownloading(false);
  };

  const handleCopyImage = async () => {
    if (!previewRef.current) return;
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(previewRef.current, { scale: 3, useCORS: true, backgroundColor: null });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }, 'image/png');
    } catch { /* ignore */ }
  };

  const loadHistory = (item: HistoryItem) => {
    setContact(item.contact);
    setMessages(item.messages);
    setTheme(item.theme);
    setWallpaper(item.wallpaper);
    setStatusBarTime(item.statusBarTime);
    setBatteryLevel(item.batteryLevel);
    setShowHistory(false);
  };

  const loadExample = () => {
    setContact({ name: 'Priya Sharma', status: 'online', avatar: null, initials: 'PS' });
    setMessages([
      { id: genId(), text: "Hey! Are you coming to the party tonight?", time: '7:30 PM', isSent: false, tickStatus: 'none', type: 'text' },
      { id: genId(), text: "Yes! What time does it start?", time: '7:31 PM', isSent: true, tickStatus: 'read', type: 'text' },
      { id: genId(), text: "8 PM at Rahul's place. Don't be late!", time: '7:31 PM', isSent: false, tickStatus: 'none', type: 'text' },
      { id: genId(), text: "Should I bring anything?", time: '7:32 PM', isSent: true, tickStatus: 'read', type: 'text' },
      { id: genId(), text: "Just bring some snacks and good vibes!", time: '7:32 PM', isSent: false, tickStatus: 'none', type: 'text' },
      { id: genId(), text: "Haha sure! See you there", time: '7:33 PM', isSent: true, tickStatus: 'delivered', type: 'text' },
      { id: genId(), text: "", time: '7:33 PM', isSent: false, tickStatus: 'none', type: 'voice' },
      { id: genId(), text: "On my way!", time: '8:05 PM', isSent: true, tickStatus: 'sent', type: 'text' },
    ]);
    setTheme('dark');
    setDateChipText('TODAY');
    setStatusBarTime('8:05');
    setBatteryLevel(72);
    setWallpaper({ type: 'wa-image', value: '/images/whatsapp/wa-dark-green.jpg' });
  };

  const resetAll = () => {
    setContact({ name: 'John Doe', status: 'online', avatar: null, initials: 'JD' });
    setMessages(DEFAULT_MESSAGES);
    setTheme('light');
    setWallpaper({ type: 'wa-image', value: '/images/whatsapp/wa-dark-green.jpg' });
    setStatusBarTime('9:41');
    setBatteryLevel(85);
    setDateChipText('TODAY');
    setShowDateChip(true);
    setShowEncryption(true);
    setEditingId(null);
  };

  const t = theme === 'dark' ? DARK_THEME : LIGHT_THEME;

  // Wallpaper background
  const chatBg = wallpaper.type === 'color' ? wallpaper.value : undefined;
  const chatBgImage = (wallpaper.type === 'wa-image' || wallpaper.type === 'custom-image')
    ? `url(${wallpaper.value})` : undefined;

  return (
    <div className="space-y-6">
      {/* Privacy badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"
      >
        <Shield size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <span className="text-sm text-emerald-700 dark:text-emerald-300">
          All processing happens in your browser. No data is uploaded anywhere.
        </span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ============================================= */}
        {/*  CONTROLS PANEL                                */}
        {/* ============================================= */}
        <div className="space-y-5">
          {/* Top action buttons */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={loadExample}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors"
            >
              Try Example
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={resetAll}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={14} /> Reset
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1.5"
            >
              <History size={14} /> History ({history.length})
            </motion.button>
          </div>

          {/* History panel */}
          <AnimatePresence>
            {showHistory && history.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="overflow-hidden"
              >
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  {history.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <button onClick={() => loadHistory(item)} className="flex-1 text-left">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.messageCount} messages &middot; {item.savedAt}</div>
                      </button>
                      <button onClick={() => saveHistory(history.filter(h => h.id !== item.id))}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact Settings */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3"
          >
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MessageCircle size={16} className="text-emerald-500" /> Contact Settings
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Name</label>
                <input
                  type="text" value={contact.name}
                  onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Status</label>
                <select
                  value={contact.status}
                  onChange={e => setContact(c => ({ ...c, status: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="online">online</option>
                  <option value="typing...">typing...</option>
                  <option value="last seen today at 10:30 AM">last seen today at 10:30 AM</option>
                  <option value="last seen yesterday at 9:15 PM">last seen yesterday at 9:15 PM</option>
                  <option value="click here for contact info">click here for contact info</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Profile Photo</label>
                <div className="flex items-center gap-2">
                  {contact.avatar && (
                    <img src={contact.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  )}
                  <button onClick={() => avatarInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1">
                    <Upload size={12} /> {contact.avatar ? 'Change' : 'Upload'}
                  </button>
                  {contact.avatar && (
                    <button onClick={() => setContact(c => ({ ...c, avatar: null }))}
                      className="p-1.5 text-slate-400 hover:text-red-500"><X size={14} /></button>
                  )}
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3"
          >
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Palette size={16} className="text-emerald-500" /> Appearance
            </h3>

            {/* Theme toggle */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Theme</label>
              <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1.5 text-xs flex items-center gap-1.5 transition-colors ${theme === 'light' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  <Sun size={12} /> Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1.5 text-xs flex items-center gap-1.5 transition-colors ${theme === 'dark' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  <Moon size={12} /> Dark
                </button>
              </div>
            </div>

            {/* Status bar */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Status Bar Time</label>
                <input type="text" value={statusBarTime}
                  onChange={e => setStatusBarTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Battery %</label>
                <input type="number" min={0} max={100} value={batteryLevel}
                  onChange={e => setBatteryLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              </div>
            </div>

            {/* Wallpaper */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">WhatsApp Wallpapers</label>
              <div className="flex flex-wrap gap-2 items-center mb-2">
                {WA_WALLPAPERS.map(wp => (
                  <button key={wp.label}
                    onClick={() => setWallpaper({ type: 'wa-image', value: wp.src })}
                    className={`w-8 h-8 rounded-lg border-2 transition-all relative overflow-hidden ${wallpaper.type === 'wa-image' && wallpaper.value === wp.src ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-300 dark:border-slate-600'}`}
                    style={{ backgroundColor: wp.thumbBg }}
                    title={wp.label}>
                    <img src={wp.src} alt={wp.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Solid Colors</label>
              <div className="flex flex-wrap gap-2 items-center">
                {SOLID_WALLPAPERS.map(color => (
                  <button key={color}
                    onClick={() => setWallpaper({ type: 'color', value: color })}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${wallpaper.type === 'color' && wallpaper.value === color ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-300 dark:border-slate-600'}`}
                    style={{ backgroundColor: color }} />
                ))}
                <button onClick={() => wallpaperInputRef.current?.click()}
                  className="w-8 h-8 rounded-lg border-2 border-dashed border-slate-400 dark:border-slate-500 flex items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
                  title="Upload image">
                  <ImageIcon size={14} />
                </button>
                <input ref={wallpaperInputRef} type="file" accept="image/*" className="hidden" onChange={handleWallpaperUpload} />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showDateChip} onChange={e => setShowDateChip(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Date chip</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showEncryption} onChange={e => setShowEncryption(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Encryption notice</span>
              </label>
            </div>

            {showDateChip && (
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Date Chip Text</label>
                <input type="text" value={dateChipText}
                  onChange={e => setDateChipText(e.target.value)}
                  placeholder="TODAY"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              </div>
            )}
          </motion.div>

          {/* Messages Editor */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Send size={16} className="text-emerald-500" /> Messages ({messages.length})
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={addMessage}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-1"
              >
                <Plus size={12} /> Add Message
              </motion.button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              <Reorder.Group axis="y" values={messages} onReorder={setMessages} className="space-y-2">
                {messages.map((msg) => (
                  <Reorder.Item key={msg.id} value={msg} className="cursor-grab active:cursor-grabbing">
                    <motion.div
                      layout
                      className={`p-3 rounded-lg border transition-colors ${
                        editingId === msg.id
                          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-600'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical size={14} className="text-slate-400 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          {/* Header row */}
                          <div className="flex items-center gap-2 mb-2">
                            <button
                              onClick={() => updateMessage(msg.id, { isSent: !msg.isSent })}
                              className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                                msg.isSent
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                              }`}
                            >
                              {msg.isSent ? 'SENT' : 'RECEIVED'}
                            </button>
                            <select value={msg.type}
                              onChange={e => updateMessage(msg.id, { type: e.target.value as MessageType })}
                              className="text-[10px] px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            >
                              <option value="text">Text</option>
                              <option value="image">Image</option>
                              <option value="voice">Voice</option>
                              <option value="deleted">Deleted</option>
                            </select>
                            {msg.isSent && msg.type !== 'deleted' && (
                              <select value={msg.tickStatus}
                                onChange={e => updateMessage(msg.id, { tickStatus: e.target.value as TickStatus })}
                                className="text-[10px] px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                              >
                                <option value="sent">Sent</option>
                                <option value="delivered">Delivered</option>
                                <option value="read">Read</option>
                              </select>
                            )}
                            <div className="flex items-center gap-1 ml-auto">
                              <button onClick={() => duplicateMessage(msg.id)} title="Duplicate"
                                className="p-1 text-slate-400 hover:text-emerald-500 transition-colors">
                                <Copy size={12} />
                              </button>
                              <button onClick={() => setEditingId(editingId === msg.id ? null : msg.id)} title="Edit"
                                className={`p-1 transition-colors ${editingId === msg.id ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500'}`}>
                                <ChevronDown size={12} className={`transition-transform ${editingId === msg.id ? 'rotate-180' : ''}`} />
                              </button>
                              <button onClick={() => deleteMessage(msg.id)} title="Delete"
                                className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Collapsed preview */}
                          {editingId !== msg.id && (
                            <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                              {msg.type === 'deleted' ? 'This message was deleted' :
                               msg.type === 'voice' ? `Voice message (${msg.text || '0:32'})` :
                               msg.type === 'image' ? `Photo${msg.imageCaption ? ': ' + msg.imageCaption : ''}` :
                               msg.text}
                            </div>
                          )}

                          {/* Expanded edit */}
                          <AnimatePresence>
                            {editingId === msg.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2 mt-1"
                              >
                                {(msg.type === 'text' || msg.type === 'image') && (
                                  <textarea
                                    value={msg.type === 'image' ? (msg.imageCaption || '') : msg.text}
                                    onChange={e => {
                                      if (msg.type === 'image') updateMessage(msg.id, { imageCaption: e.target.value });
                                      else updateMessage(msg.id, { text: e.target.value });
                                    }}
                                    placeholder={msg.type === 'image' ? 'Image caption (optional)...' : 'Message text...'}
                                    rows={2}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                                  />
                                )}
                                {msg.type === 'voice' && (
                                  <input type="text" value={msg.text} placeholder="Duration (e.g. 0:32)"
                                    onChange={e => updateMessage(msg.id, { text: e.target.value })}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
                                )}
                                <div className="grid grid-cols-2 gap-2">
                                  <input type="text" value={msg.time} placeholder="10:30 AM"
                                    onChange={e => updateMessage(msg.id, { time: e.target.value })}
                                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
                                  <input type="text" value={msg.replyTo || ''} placeholder="Reply to (optional)"
                                    onChange={e => updateMessage(msg.id, { replyTo: e.target.value || undefined })}
                                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={msg.starred || false}
                                    onChange={e => updateMessage(msg.id, { starred: e.target.checked })}
                                    className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                                  <span className="text-xs text-slate-600 dark:text-slate-400">Starred message</span>
                                </label>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          </motion.div>
        </div>

        {/* ============================================= */}
        {/*  LIVE PREVIEW                                  */}
        {/* ============================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Live Preview</h3>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleCopyImage}
                disabled={downloading}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1.5"
              >
                <Copy size={12} /> {copied ? 'Copied!' : 'Copy Image'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                disabled={downloading}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60 transition-colors flex items-center gap-1.5"
              >
                <Download size={12} /> {downloading ? 'Saving...' : 'Download PNG'}
              </motion.button>
            </div>
          </div>

          {/* Phone frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="mx-auto"
            style={{ maxWidth: 380 }}
          >
            <div style={{
              borderRadius: 28, overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.1)',
              border: '8px solid #1a1a1a',
            }}>
              <div ref={previewRef} style={{ width: '100%', position: 'relative' }}>
                {/* Status Bar */}
                <StatusBar time={statusBarTime} battery={batteryLevel} theme={theme} />

                {/* Header */}
                <ChatHeader contact={contact} theme={theme} />

                {/* Chat Area */}
                <div style={{
                  minHeight: 420, maxHeight: 520, position: 'relative',
                  backgroundColor: chatBg || t.chatBg,
                  backgroundImage: chatBgImage,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }}>
                  <div style={{
                    position: 'relative', zIndex: 1,
                    display: 'flex', flexDirection: 'column', gap: 4,
                    padding: '8px 12px 8px',
                  }}>
                    {/* Encryption notice */}
                    {showEncryption && <EncryptionNotice theme={theme} />}

                    {/* Date chip */}
                    {showDateChip && <DateChip text={dateChipText} theme={theme} />}

                    {/* Messages */}
                    {messages.map(msg => (
                      <ChatBubble key={msg.id} msg={msg} theme={theme} />
                    ))}
                  </div>
                </div>

                {/* Input Bar */}
                <InputBar theme={theme} />
              </div>
            </div>
          </motion.div>

          {/* Keyboard shortcut hints */}
          <div className="text-center text-xs text-slate-400 dark:text-slate-500 space-x-4">
            <span>Drag messages to reorder</span>
            <span>&middot;</span>
            <span>Click SENT/RECEIVED to toggle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
