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
  type: 'default' | 'doodle' | 'color' | 'image';
  color: string;
  doodleBg?: string;
  doodleIcon?: string;
  imageUrl: string | null;
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

// WhatsApp's actual default wallpaper doodle color combos: [background, icon color]
const DOODLE_WALLPAPERS: { bg: string; icon: string; label: string }[] = [
  { bg: '#ECE5DD', icon: '#c8beae', label: 'Light Default' },
  { bg: '#0B141A', icon: '#1a2e28', label: 'Dark Default' },
  { bg: '#EFEAE2', icon: '#d4cfc6', label: 'Light Warm' },
  { bg: '#0B2015', icon: '#16352a', label: 'Dark Green' },
  { bg: '#E2D9CC', icon: '#c4b8a5', label: 'Beige' },
  { bg: '#102B28', icon: '#1d4a3f', label: 'Dark Teal' },
  { bg: '#1B3D35', icon: '#2a5c4e', label: 'Forest' },
  { bg: '#172E35', icon: '#264a56', label: 'Dark Blue' },
];

const SOLID_WALLPAPERS = [
  '#B1D8B7', '#C9DAF8', '#F4CCCC', '#D5A6BD', '#FFE0B2',
  '#B39DDB', '#80CBC4', '#FFCCBC', '#E1BEE7', '#C5E1A5',
  '#FFF9C4', '#B2EBF2', '#008069', '#025144',
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
/*  WHATSAPP WALLPAPER PATTERN (SVG doodle)                            */
/* ------------------------------------------------------------------ */

function WallpaperDoodle({ theme, doodleBg, doodleIcon }: { theme: ThemeMode; doodleBg?: string; doodleIcon?: string }) {
  const c = doodleIcon || (theme === 'dark' ? '#233b34' : '#c8beae');
  const bg = doodleBg || (theme === 'dark' ? '#0B141A' : '#ECE5DD');
  const s = 1; // stroke width base
  // Dense scattered pattern matching real WhatsApp — 60+ icons in a 320x400 tile
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', backgroundColor: bg }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" fill="none" stroke={c} strokeWidth={s * 1.15} strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <pattern id="wa-doodle" x="0" y="0" width="320" height="400" patternUnits="userSpaceOnUse">
            {/* === Scattered WhatsApp doodle icons (mimics real wallpaper) === */}

            {/* "42" text */}
            <text x="12" y="18" fill={c} stroke="none" fontSize="14" fontWeight="bold" fontFamily="sans-serif">42</text>

            {/* Rocket */}
            <g transform="translate(50,5) rotate(30)">
              <ellipse cx="6" cy="10" rx="4" ry="8" /><path d="M2 15 L0 20 L6 17" /><path d="M10 15 L12 20 L6 17" />
              <line x1="3" y1="18" x2="2" y2="22" /><line x1="9" y1="18" x2="10" y2="22" />
            </g>

            {/* Planet / Saturn */}
            <g transform="translate(95,8)">
              <circle cx="8" cy="8" r="6" /><ellipse cx="8" cy="8" rx="12" ry="3" transform="rotate(-20 8 8)" />
            </g>

            {/* Smiley face */}
            <g transform="translate(140,3)">
              <circle cx="9" cy="9" r="9" /><circle cx="6" cy="7" r="1.2" fill={c} stroke="none" /><circle cx="12" cy="7" r="1.2" fill={c} stroke="none" />
              <path d="M5 12 Q9 16 13 12" />
            </g>

            {/* Stars cluster */}
            <g transform="translate(178,10)"><path d="M5 0 L6.5 4 L11 4 L7.5 6.5 L8.5 11 L5 8.5 L1.5 11 L2.5 6.5 L-1 4 L3.5 4Z" /></g>
            <circle cx="195" cy="6" r="1.5" fill={c} stroke="none" />
            <circle cx="192" cy="14" r="1" fill={c} stroke="none" />

            {/* "24" text */}
            <text x="210" y="17" fill={c} stroke="none" fontSize="13" fontWeight="bold" fontFamily="sans-serif">24</text>

            {/* Calendar */}
            <g transform="translate(240,3)">
              <rect x="0" y="3" width="14" height="12" rx="2" /><line x1="0" y1="7" x2="14" y2="7" /><line x1="4" y1="0" x2="4" y2="5" /><line x1="10" y1="0" x2="10" y2="5" />
            </g>

            {/* Bicycle */}
            <g transform="translate(275,5)">
              <circle cx="5" cy="12" r="5" /><circle cx="20" cy="12" r="5" /><path d="M5 12 L10 4 L15 12 L20 12" /><path d="M10 4 L17 4" /><line x1="14" y1="4" x2="15" y2="12" />
            </g>

            {/* === Row 2 === */}
            {/* Camera */}
            <g transform="translate(5,35)">
              <rect x="0" y="4" width="16" height="11" rx="2" /><circle cx="8" cy="10" r="3.5" /><path d="M5 4 L6.5 1 L11.5 1 L13 4" />
            </g>

            {/* Winking smiley */}
            <g transform="translate(38,32)">
              <circle cx="9" cy="9" r="9" /><circle cx="6" cy="7" r="1.2" fill={c} stroke="none" /><path d="M11 6 L13 8" /><path d="M5 12 Q9 16 13 12" />
            </g>

            {/* Musical notes */}
            <g transform="translate(68,30)">
              <line x1="3" y1="2" x2="3" y2="15" /><circle cx="1" cy="15" r="2.5" /><line x1="11" y1="0" x2="11" y2="13" /><circle cx="9" cy="13" r="2.5" /><line x1="3" y1="2" x2="11" y2="0" />
            </g>

            {/* Heart */}
            <g transform="translate(97,34)">
              <path d="M7 3 C7 0 11-1 11 3 C11 7 7 11 7 11 C7 11 3 7 3 3 C3-1 7 0 7 3Z" />
            </g>

            {/* Phone handset */}
            <g transform="translate(122,33)">
              <path d="M2 4 C2 2 4 0 6 0 L7 0 L7 5 L5 5 C5 8 9 12 12 12 L12 10 L17 10 L17 11 C17 13 15 15 13 15 C7 15 2 10 2 4Z" />
            </g>

            {/* BFF text */}
            <text x="152" y="45" fill={c} stroke="none" fontSize="11" fontWeight="bold" fontFamily="sans-serif">BFF</text>

            {/* Sunglasses emoji */}
            <g transform="translate(185,32)">
              <circle cx="9" cy="9" r="9" /><rect x="2" y="6" width="6" height="4" rx="1" fill={c} stroke="none" /><rect x="10" y="6" width="6" height="4" rx="1" fill={c} stroke="none" /><line x1="8" y1="8" x2="10" y2="8" /><path d="M6 13 Q9 15 12 13" />
            </g>

            {/* Cloud */}
            <g transform="translate(218,35)">
              <path d="M5 14 C1 14 0 11 2 9 C1 6 4 4 7 5 C8 2 13 2 14 5 C17 4 19 7 17 9 C19 11 18 14 15 14Z" />
            </g>

            {/* Burger */}
            <g transform="translate(248,33)">
              <path d="M1 10 Q8 10 15 10" /><path d="M0 10 C0 5 3 2 7.5 2 C12 2 15 5 15 10" /><line x1="0" y1="12" x2="15" y2="12" /><path d="M0 12 Q0 16 7.5 16 Q15 16 15 12" /><path d="M2 7 Q7.5 9 13 7" strokeWidth="0.8" />
            </g>

            {/* Gift box */}
            <g transform="translate(282,33)">
              <rect x="1" y="5" width="14" height="10" rx="1" /><rect x="0" y="3" width="16" height="4" rx="1" /><line x1="8" y1="3" x2="8" y2="15" /><path d="M8 3 C6-1 2 0 4 3" /><path d="M8 3 C10-1 14 0 12 3" />
            </g>

            {/* === Row 3 === */}
            {/* Lock */}
            <g transform="translate(12,68)">
              <rect x="0" y="7" width="12" height="9" rx="2" /><path d="M3 7 L3 4 C3 1 9 1 9 4 L9 7" /><circle cx="6" cy="12" r="1.5" fill={c} stroke="none" />
            </g>

            {/* Elephant */}
            <g transform="translate(42,65)">
              <ellipse cx="10" cy="10" rx="8" ry="7" /><path d="M2 10 C0 10 -1 15 2 17 L4 15" /><circle cx="6" cy="8" r="1" fill={c} stroke="none" /><circle cx="15" cy="12" r="2" /><line x1="7" y1="17" x2="7" y2="21" /><line x1="13" y1="17" x2="13" y2="21" />
            </g>

            {/* Headphones */}
            <g transform="translate(80,67)">
              <path d="M3 12 L3 9 C3 3 15 3 15 9 L15 12" /><rect x="1" y="12" width="4" height="5" rx="1.5" /><rect x="13" y="12" width="4" height="5" rx="1.5" />
            </g>

            {/* Android robot */}
            <g transform="translate(112,64)">
              <rect x="2" y="8" width="12" height="10" rx="2" /><path d="M2 8 C2 4 14 4 14 8" /><circle cx="6" cy="6" r="1" fill={c} stroke="none" /><circle cx="10" cy="6" r="1" fill={c} stroke="none" />
              <line x1="4" y1="1" x2="6" y2="4" /><line x1="12" y1="1" x2="10" y2="4" /><line x1="0" y1="10" x2="0" y2="15" strokeWidth="1.5" /><line x1="16" y1="10" x2="16" y2="15" strokeWidth="1.5" />
              <line x1="5" y1="18" x2="5" y2="22" /><line x1="11" y1="18" x2="11" y2="22" />
            </g>

            {/* Cat face */}
            <g transform="translate(148,66)">
              <circle cx="8" cy="10" r="8" /><path d="M1 5 L3 0 L6 5" /><path d="M15 5 L13 0 L10 5" />
              <circle cx="5" cy="9" r="1.2" fill={c} stroke="none" /><circle cx="11" cy="9" r="1.2" fill={c} stroke="none" /><path d="M6 12 L8 13 L10 12" />
              <line x1="1" y1="11" x2="-2" y2="10" /><line x1="1" y1="12" x2="-2" y2="13" /><line x1="15" y1="11" x2="18" y2="10" /><line x1="15" y1="12" x2="18" y2="13" />
            </g>

            {/* Victory/peace hand */}
            <g transform="translate(183,68)">
              <rect x="3" y="8" width="10" height="10" rx="3" /><line x1="5" y1="8" x2="4" y2="1" /><line x1="9" y1="8" x2="10" y2="1" />
            </g>

            {/* Gamepad */}
            <g transform="translate(210,68)">
              <rect x="0" y="2" width="22" height="13" rx="5" /><line x1="6" y1="6" x2="6" y2="10" /><line x1="4" y1="8" x2="8" y2="8" /><circle cx="15" cy="7" r="1.2" fill={c} stroke="none" /><circle cx="17" cy="9" r="1.2" fill={c} stroke="none" />
            </g>

            {/* Compass */}
            <g transform="translate(248,68)">
              <circle cx="8" cy="8" r="8" /><path d="M8 2 L10 8 L8 14 L6 8Z" /><circle cx="8" cy="8" r="1.5" fill={c} stroke="none" />
            </g>

            {/* Flower */}
            <g transform="translate(282,68)">
              <circle cx="8" cy="8" r="3" /><circle cx="8" cy="2" r="3" /><circle cx="13" cy="5" r="3" /><circle cx="13" cy="11" r="3" /><circle cx="8" cy="14" r="3" /><circle cx="3" cy="11" r="3" /><circle cx="3" cy="5" r="3" /><circle cx="8" cy="8" r="2" fill={c} stroke="none" />
            </g>

            {/* === Row 4 === */}
            {/* Envelope */}
            <g transform="translate(8,105)">
              <rect x="0" y="0" width="16" height="11" rx="1.5" /><path d="M0 1 L8 7 L16 1" />
            </g>

            {/* Eye */}
            <g transform="translate(42,107)">
              <path d="M0 6 C4 0 14 0 18 6 C14 12 4 12 0 6Z" /><circle cx="9" cy="6" r="3" /><circle cx="9" cy="6" r="1.5" fill={c} stroke="none" />
            </g>

            {/* Bicycle bell / ring */}
            <g transform="translate(76,103)">
              <path d="M8 0 L8 2" /><path d="M2 12 C2 6 14 6 14 12" /><rect x="1" y="12" width="14" height="3" rx="1.5" /><line x1="8" y1="15" x2="8" y2="17" /><line x1="6" y1="17" x2="10" y2="17" />
            </g>

            {/* "Hi" speech bubble */}
            <g transform="translate(108,102)">
              <rect x="0" y="0" width="18" height="12" rx="4" /><path d="M4 12 L2 17 L8 12" />
              <text x="4" y="10" fill={c} stroke="none" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Hi</text>
            </g>

            {/* Photos / pictures */}
            <g transform="translate(142,104)">
              <rect x="2" y="0" width="14" height="11" rx="1" /><rect x="0" y="2" width="14" height="11" rx="1" /><path d="M1 11 L5 7 L8 10 L11 6 L13 9" strokeWidth="0.8" />
            </g>

            {/* Trophy */}
            <g transform="translate(178,103)">
              <path d="M3 0 L13 0 L12 8 C12 12 4 12 4 8Z" /><path d="M3 2 C0 2 0 6 3 6" /><path d="M13 2 C16 2 16 6 13 6" /><line x1="8" y1="12" x2="8" y2="15" /><line x1="5" y1="15" x2="11" y2="15" />
            </g>

            {/* Clock showing 09:28 */}
            <g transform="translate(210,102)">
              <circle cx="9" cy="9" r="9" /><line x1="9" y1="4" x2="9" y2="9" /><line x1="9" y1="9" x2="13" y2="11" />
              <text x="2" y="22" fill={c} stroke="none" fontSize="7" fontFamily="sans-serif">09:28</text>
            </g>

            {/* Shopping bag */}
            <g transform="translate(248,103)">
              <rect x="1" y="5" width="14" height="12" rx="1" /><path d="M5 5 L5 3 C5 0 11 0 11 3 L11 5" />
            </g>

            {/* Crown */}
            <g transform="translate(280,107)">
              <path d="M0 12 L0 4 L5 8 L9 2 L13 8 L18 4 L18 12Z" />
            </g>

            {/* === Row 5 === */}
            {/* Magnifying glass */}
            <g transform="translate(15,140)">
              <circle cx="7" cy="7" r="7" /><line x1="12" y1="12" x2="17" y2="17" strokeWidth="2" />
            </g>

            {/* Coffee cup */}
            <g transform="translate(48,140)">
              <rect x="0" y="3" width="11" height="12" rx="1" /><path d="M11 5 C15 5 15 12 11 12" /><line x1="-1" y1="15" x2="12" y2="15" /><path d="M3 0 C4-2 5 0 6-2" strokeWidth="0.8" />
            </g>

            {/* Key */}
            <g transform="translate(82,142)">
              <circle cx="5" cy="5" r="5" /><line x1="10" y1="5" x2="20" y2="5" /><line x1="17" y1="5" x2="17" y2="8" /><line x1="20" y1="5" x2="20" y2="8" />
            </g>

            {/* Film strip */}
            <g transform="translate(118,138)">
              <rect x="0" y="0" width="18" height="14" rx="1" /><rect x="2" y="2" width="14" height="10" rx="0" strokeWidth="0.6" />
              <line x1="1" y1="4" x2="3" y2="4" strokeWidth="0.6" /><line x1="1" y1="7" x2="3" y2="7" strokeWidth="0.6" /><line x1="1" y1="10" x2="3" y2="10" strokeWidth="0.6" />
              <line x1="15" y1="4" x2="17" y2="4" strokeWidth="0.6" /><line x1="15" y1="7" x2="17" y2="7" strokeWidth="0.6" /><line x1="15" y1="10" x2="17" y2="10" strokeWidth="0.6" />
            </g>

            {/* Lightning bolt */}
            <g transform="translate(152,140)">
              <path d="M8 0 L3 8 L7 8 L4 16 L12 6 L8 6Z" />
            </g>

            {/* Pizza slice */}
            <g transform="translate(180,140)">
              <path d="M8 0 L0 16 L16 16Z" /><circle cx="6" cy="10" r="1.2" fill={c} stroke="none" /><circle cx="10" cy="12" r="1.2" fill={c} stroke="none" /><circle cx="8" cy="7" r="1" fill={c} stroke="none" />
            </g>

            {/* Palette */}
            <g transform="translate(210,140)">
              <circle cx="9" cy="9" r="9" /><circle cx="5" cy="6" r="1.5" fill={c} stroke="none" /><circle cx="9" cy="4" r="1.5" fill={c} stroke="none" /><circle cx="13" cy="6" r="1.5" fill={c} stroke="none" /><circle cx="5" cy="12" r="1.5" fill={c} stroke="none" />
            </g>

            {/* Paper airplane */}
            <g transform="translate(245,142)">
              <path d="M0 8 L18 0 L12 16Z" /><line x1="18" y1="0" x2="7" y2="10" strokeWidth="0.8" />
            </g>

            {/* Umbrella */}
            <g transform="translate(278,140)">
              <path d="M1 10 C1 3 15 3 15 10" /><line x1="8" y1="3" x2="8" y2="18" /><path d="M8 18 C6 18 5 16 6 15" />
            </g>

            {/* === Row 6 === */}
            {/* Music speaker */}
            <g transform="translate(8,175)">
              <rect x="0" y="0" width="12" height="16" rx="2" /><circle cx="6" cy="10" r="4" /><circle cx="6" cy="10" r="1.5" fill={c} stroke="none" /><circle cx="6" cy="4" r="1.5" />
            </g>

            {/* Donut */}
            <g transform="translate(38,178)">
              <circle cx="8" cy="8" r="8" /><circle cx="8" cy="8" r="3" /><path d="M3 5 Q5 2 8 1 Q12 2 14 6" strokeWidth="2" strokeDasharray="2 2" />
            </g>

            {/* Scissors */}
            <g transform="translate(68,178)">
              <circle cx="4" cy="14" r="3" /><circle cx="14" cy="14" r="3" /><line x1="5" y1="11" x2="13" y2="3" /><line x1="13" y1="11" x2="5" y2="3" />
            </g>

            {/* Globe */}
            <g transform="translate(100,175)">
              <circle cx="8" cy="8" r="8" /><ellipse cx="8" cy="8" rx="3.5" ry="8" /><line x1="0" y1="8" x2="16" y2="8" /><path d="M1 4 Q8 3 15 4" strokeWidth="0.7" /><path d="M1 12 Q8 13 15 12" strokeWidth="0.7" />
            </g>

            {/* Laptop */}
            <g transform="translate(132,178)">
              <rect x="2" y="0" width="16" height="11" rx="1.5" /><line x1="0" y1="13" x2="20" y2="13" /><path d="M0 13 L2 11" strokeWidth="0.8" /><path d="M20 13 L18 11" strokeWidth="0.8" />
            </g>

            {/* Stethoscope */}
            <g transform="translate(168,175)">
              <path d="M4 0 L4 8 C4 14 12 14 12 8 L12 0" /><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="1" fill={c} stroke="none" />
            </g>

            {/* Robot face */}
            <g transform="translate(200,175)">
              <rect x="2" y="4" width="14" height="12" rx="3" /><line x1="9" y1="0" x2="9" y2="4" /><circle cx="9" cy="0" r="1.5" /><rect x="5" y="8" width="3" height="2" rx="0.5" fill={c} stroke="none" /><rect x="10" y="8" width="3" height="2" rx="0.5" fill={c} stroke="none" /><line x1="6" y1="13" x2="12" y2="13" />
            </g>

            {/* Light bulb */}
            <g transform="translate(235,175)">
              <path d="M5 12 C2 9 2 3 8 1 C14 3 14 9 11 12" /><line x1="5" y1="12" x2="11" y2="12" /><line x1="5.5" y1="14" x2="10.5" y2="14" /><line x1="6" y1="16" x2="10" y2="16" />
            </g>

            {/* Clapperboard */}
            <g transform="translate(268,177)">
              <rect x="0" y="5" width="18" height="12" rx="1" /><path d="M0 5 L18 5 L16 0 L-2 0Z" /><line x1="4" y1="0" x2="6" y2="5" strokeWidth="0.8" /><line x1="9" y1="0" x2="11" y2="5" strokeWidth="0.8" /><line x1="14" y1="0" x2="16" y2="5" strokeWidth="0.8" />
            </g>

            {/* Scattered small dots / stars for density */}
            <circle cx="30" cy="28" r="1.2" fill={c} stroke="none" /><circle cx="165" cy="28" r="1" fill={c} stroke="none" />
            <circle cx="230" cy="15" r="1.3" fill={c} stroke="none" /><circle cx="305" cy="28" r="1" fill={c} stroke="none" />
            <circle cx="70" cy="58" r="1" fill={c} stroke="none" /><circle cx="200" cy="60" r="1.2" fill={c} stroke="none" />
            <circle cx="270" cy="95" r="1" fill={c} stroke="none" /><circle cx="35" cy="125" r="1.2" fill={c} stroke="none" />
            <circle cx="165" cy="130" r="1" fill={c} stroke="none" /><circle cx="300" cy="135" r="1.2" fill={c} stroke="none" />
            <circle cx="60" cy="165" r="1" fill={c} stroke="none" /><circle cx="155" cy="168" r="1" fill={c} stroke="none" />
            <circle cx="265" cy="165" r="1.2" fill={c} stroke="none" /><circle cx="310" cy="180" r="1" fill={c} stroke="none" />

            {/* Small 4-point stars */}
            <path d="M88 25 L89 28 L92 29 L89 30 L88 33 L87 30 L84 29 L87 28Z" fill={c} stroke="none" />
            <path d="M260 52 L261 55 L264 56 L261 57 L260 60 L259 57 L256 56 L259 55Z" fill={c} stroke="none" />
            <path d="M30 98 L31 101 L34 102 L31 103 L30 106 L29 103 L26 102 L29 101Z" fill={c} stroke="none" />
            <path d="M175 155 L176 158 L179 159 L176 160 L175 163 L174 160 L171 159 L174 158Z" fill={c} stroke="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wa-doodle)" />
      </svg>
    </div>
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
    type: 'default',
    color: '#ECE5DD',
    imageUrl: null,
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
    reader.onload = () => setWallpaper({ type: 'image', color: '', imageUrl: reader.result as string });
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
    setWallpaper({ type: 'default', color: '', imageUrl: null });
  };

  const resetAll = () => {
    setContact({ name: 'John Doe', status: 'online', avatar: null, initials: 'JD' });
    setMessages(DEFAULT_MESSAGES);
    setTheme('light');
    setWallpaper({ type: 'default', color: '#ECE5DD', imageUrl: null });
    setStatusBarTime('9:41');
    setBatteryLevel(85);
    setDateChipText('TODAY');
    setShowDateChip(true);
    setShowEncryption(true);
    setEditingId(null);
  };

  const t = theme === 'dark' ? DARK_THEME : LIGHT_THEME;

  // Wallpaper background
  const chatBg = (() => {
    if (wallpaper.type === 'image' && wallpaper.imageUrl) return undefined;
    if (wallpaper.type === 'doodle') return undefined; // doodle handles its own bg
    if (wallpaper.type === 'color') return wallpaper.color;
    return undefined; // default also handles its own bg via doodle
  })();

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
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">WhatsApp Doodle Wallpapers</label>
              <div className="flex flex-wrap gap-2 items-center mb-2">
                {DOODLE_WALLPAPERS.map(dw => (
                  <button key={dw.label}
                    onClick={() => setWallpaper({ type: 'doodle', color: '', doodleBg: dw.bg, doodleIcon: dw.icon, imageUrl: null })}
                    className={`w-8 h-8 rounded-lg border-2 transition-all relative overflow-hidden ${wallpaper.type === 'doodle' && wallpaper.doodleBg === dw.bg ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-300 dark:border-slate-600'}`}
                    style={{ backgroundColor: dw.bg }}
                    title={dw.label}>
                    {/* Mini doodle preview */}
                    <svg width="100%" height="100%" viewBox="0 0 32 32" style={{ position: 'absolute', inset: 0 }}>
                      <circle cx="8" cy="8" r="3" fill="none" stroke={dw.icon} strokeWidth="1" />
                      <rect x="18" y="5" width="6" height="6" rx="1" fill="none" stroke={dw.icon} strokeWidth="1" />
                      <path d="M6 20 C6 18 8 17 10 19 C12 17 14 18 14 20 C14 23 10 25 10 25 C10 25 6 23 6 20Z" fill="none" stroke={dw.icon} strokeWidth="0.8" />
                      <rect x="19" y="18" width="5" height="8" rx="1" fill="none" stroke={dw.icon} strokeWidth="0.8" />
                    </svg>
                  </button>
                ))}
              </div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Solid Colors</label>
              <div className="flex flex-wrap gap-2 items-center">
                {SOLID_WALLPAPERS.map(color => (
                  <button key={color}
                    onClick={() => setWallpaper({ type: 'color', color, imageUrl: null })}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${wallpaper.type === 'color' && wallpaper.color === color ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-300 dark:border-slate-600'}`}
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
                  backgroundColor: chatBg,
                  backgroundImage: wallpaper.type === 'image' && wallpaper.imageUrl
                    ? `url(${wallpaper.imageUrl})` : undefined,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }}>
                  {/* Wallpaper doodle pattern (only on default) */}
                  {(wallpaper.type === 'default' || wallpaper.type === 'doodle') && (
                    <WallpaperDoodle theme={theme} doodleBg={wallpaper.doodleBg} doodleIcon={wallpaper.doodleIcon} />
                  )}

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
