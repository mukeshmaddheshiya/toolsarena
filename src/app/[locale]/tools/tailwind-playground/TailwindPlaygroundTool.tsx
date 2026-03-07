'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, Check, RotateCcw, Code2, Paintbrush, Monitor, Tablet, Smartphone,
  ChevronDown, Sparkles, History, Shield, Type, Square, Layout, Palette,
  Move, Maximize2, Circle, Layers, Zap, Play, X, Search
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'editor' | 'builder';
type PreviewElement = 'div' | 'button' | 'card' | 'text' | 'input' | 'badge';
type Viewport = 'mobile' | 'tablet' | 'desktop';

interface HistoryEntry {
  id: string;
  classes: string;
  element: PreviewElement;
  content: string;
  timestamp: number;
}

interface BuilderCategory {
  name: string;
  icon: React.ReactNode;
  options: BuilderOption[];
}

interface BuilderOption {
  label: string;
  classes: string[];
}

// ─── Tailwind Color Palette ───────────────────────────────────────────────────

const TAILWIND_COLORS: Record<string, Record<string, string>> = {
  slate:   { '50':'#f8fafc','100':'#f1f5f9','200':'#e2e8f0','300':'#cbd5e1','400':'#94a3b8','500':'#64748b','600':'#475569','700':'#334155','800':'#1e293b','900':'#0f172a','950':'#020617' },
  gray:    { '50':'#f9fafb','100':'#f3f4f6','200':'#e5e7eb','300':'#d1d5db','400':'#9ca3af','500':'#6b7280','600':'#4b5563','700':'#374151','800':'#1f2937','900':'#111827','950':'#030712' },
  zinc:    { '50':'#fafafa','100':'#f4f4f5','200':'#e4e4e7','300':'#d4d4d8','400':'#a1a1aa','500':'#71717a','600':'#52525b','700':'#3f3f46','800':'#27272a','900':'#18181b','950':'#09090b' },
  neutral: { '50':'#fafafa','100':'#f5f5f5','200':'#e5e5e5','300':'#d4d4d4','400':'#a3a3a3','500':'#737373','600':'#525252','700':'#404040','800':'#262626','900':'#171717','950':'#0a0a0a' },
  stone:   { '50':'#fafaf9','100':'#f5f5f4','200':'#e7e5e0','300':'#d6d3d1','400':'#a8a29e','500':'#78716c','600':'#57534e','700':'#44403c','800':'#292524','900':'#1c1917','950':'#0c0a09' },
  red:     { '50':'#fef2f2','100':'#fee2e2','200':'#fecaca','300':'#fca5a5','400':'#f87171','500':'#ef4444','600':'#dc2626','700':'#b91c1c','800':'#991b1b','900':'#7f1d1d','950':'#450a0a' },
  orange:  { '50':'#fff7ed','100':'#ffedd5','200':'#fed7aa','300':'#fdba74','400':'#fb923c','500':'#f97316','600':'#ea580c','700':'#c2410c','800':'#9a3412','900':'#7c2d12','950':'#431407' },
  amber:   { '50':'#fffbeb','100':'#fef3c7','200':'#fde68a','300':'#fcd34d','400':'#fbbf24','500':'#f59e0b','600':'#d97706','700':'#b45309','800':'#92400e','900':'#78350f','950':'#451a03' },
  yellow:  { '50':'#fefce8','100':'#fef9c3','200':'#fef08a','300':'#fde047','400':'#facc15','500':'#eab308','600':'#ca8a04','700':'#a16207','800':'#854d0e','900':'#713f12','950':'#422006' },
  lime:    { '50':'#f7fee7','100':'#ecfccb','200':'#d9f99d','300':'#bef264','400':'#a3e635','500':'#84cc16','600':'#65a30d','700':'#4d7c0f','800':'#3f6212','900':'#365314','950':'#1a2e05' },
  green:   { '50':'#f0fdf4','100':'#dcfce7','200':'#bbf7d0','300':'#86efac','400':'#4ade80','500':'#22c55e','600':'#16a34a','700':'#15803d','800':'#166534','900':'#14532d','950':'#052e16' },
  emerald: { '50':'#ecfdf5','100':'#d1fae5','200':'#a7f3d0','300':'#6ee7b7','400':'#34d399','500':'#10b981','600':'#059669','700':'#047857','800':'#065f46','900':'#064e3b','950':'#022c22' },
  teal:    { '50':'#f0fdfa','100':'#ccfbf1','200':'#99f6e4','300':'#5eead4','400':'#2dd4bf','500':'#14b8a6','600':'#0d9488','700':'#0f766e','800':'#115e59','900':'#134e4a','950':'#042f2e' },
  cyan:    { '50':'#ecfeff','100':'#cffafe','200':'#a5f3fc','300':'#67e8f9','400':'#22d3ee','500':'#06b6d4','600':'#0891b2','700':'#0e7490','800':'#155e75','900':'#164e63','950':'#083344' },
  sky:     { '50':'#f0f9ff','100':'#e0f2fe','200':'#bae6fd','300':'#7dd3fc','400':'#38bdf8','500':'#0ea5e9','600':'#0284c7','700':'#0369a1','800':'#075985','900':'#0c4a6e','950':'#082f49' },
  blue:    { '50':'#eff6ff','100':'#dbeafe','200':'#bfdbfe','300':'#93c5fd','400':'#60a5fa','500':'#3b82f6','600':'#2563eb','700':'#1d4ed8','800':'#1e40af','900':'#1e3a8a','950':'#172554' },
  indigo:  { '50':'#eef2ff','100':'#e0e7ff','200':'#c7d2fe','300':'#a5b4fc','400':'#818cf8','500':'#6366f1','600':'#4f46e5','700':'#4338ca','800':'#3730a3','900':'#312e81','950':'#1e1b4b' },
  violet:  { '50':'#f5f3ff','100':'#ede9fe','200':'#ddd6fe','300':'#c4b5fd','400':'#a78bfa','500':'#8b5cf6','600':'#7c3aed','700':'#6d28d9','800':'#5b21b6','900':'#4c1d95','950':'#2e1065' },
  purple:  { '50':'#faf5ff','100':'#f3e8ff','200':'#e9d5ff','300':'#d8b4fe','400':'#c084fc','500':'#a855f7','600':'#9333ea','700':'#7e22ce','800':'#6b21a8','900':'#581c87','950':'#3b0764' },
  fuchsia: { '50':'#fdf4ff','100':'#fae8ff','200':'#f5d0fe','300':'#f0abfc','400':'#e879f9','500':'#d946ef','600':'#c026d3','700':'#a21caf','800':'#86198f','900':'#701a75','950':'#4a044e' },
  pink:    { '50':'#fdf2f8','100':'#fce7f3','200':'#fbcfe8','300':'#f9a8d4','400':'#f472b6','500':'#ec4899','600':'#db2777','700':'#be185d','800':'#9d174d','900':'#831843','950':'#500724' },
  rose:    { '50':'#fff1f2','100':'#ffe4e6','200':'#fecdd3','300':'#fda4af','400':'#fb7185','500':'#f43f5e','600':'#e11d48','700':'#be123c','800':'#9f1239','900':'#881337','950':'#4c0519' },
};

const COLOR_NAMES = Object.keys(TAILWIND_COLORS);
const SHADES = ['50','100','200','300','400','500','600','700','800','900','950'];

// ─── Tailwind Class to CSS Mapping ────────────────────────────────────────────

function buildSpacingMap(): Record<string, string> {
  const spacingScale: Record<string, string> = {
    '0':'0px','px':'1px','0.5':'0.125rem','1':'0.25rem','1.5':'0.375rem',
    '2':'0.5rem','2.5':'0.625rem','3':'0.75rem','3.5':'0.875rem','4':'1rem',
    '5':'1.25rem','6':'1.5rem','7':'1.75rem','8':'2rem','9':'2.25rem',
    '10':'2.5rem','11':'2.75rem','12':'3rem','14':'3.5rem','16':'4rem',
    '20':'5rem','24':'6rem','28':'7rem','32':'8rem','36':'9rem','40':'10rem',
    '44':'11rem','48':'12rem','52':'13rem','56':'14rem','60':'15rem',
    '64':'16rem','72':'18rem','80':'20rem','96':'24rem',
  };
  const map: Record<string, string> = {};
  const dirs: Record<string, string[]> = {
    'p': ['padding'], 'px': ['padding-left','padding-right'], 'py': ['padding-top','padding-bottom'],
    'pt': ['padding-top'], 'pr': ['padding-right'], 'pb': ['padding-bottom'], 'pl': ['padding-left'],
    'm': ['margin'], 'mx': ['margin-left','margin-right'], 'my': ['margin-top','margin-bottom'],
    'mt': ['margin-top'], 'mr': ['margin-right'], 'mb': ['margin-bottom'], 'ml': ['margin-left'],
  };
  for (const [prefix, props] of Object.entries(dirs)) {
    for (const [size, val] of Object.entries(spacingScale)) {
      const cls = `${prefix}-${size}`;
      map[cls] = props.map(p => `${p}: ${val}`).join('; ');
    }
    if (prefix.startsWith('m')) {
      for (const [size, val] of Object.entries(spacingScale)) {
        const cls = `-${prefix}-${size}`;
        map[cls] = props.map(p => `${p}: -${val}`).join('; ');
      }
    }
  }
  // gap
  for (const [size, val] of Object.entries(spacingScale)) {
    map[`gap-${size}`] = `gap: ${val}`;
    map[`gap-x-${size}`] = `column-gap: ${val}`;
    map[`gap-y-${size}`] = `row-gap: ${val}`;
  }
  return map;
}

function buildColorMap(): Record<string, string> {
  const map: Record<string, string> = {};
  const prefixes: Record<string, string> = {
    'bg': 'background-color', 'text': 'color', 'border': 'border-color',
    'ring': '--tw-ring-color', 'accent': 'accent-color',
    'decoration': 'text-decoration-color',
  };
  for (const [prefix, prop] of Object.entries(prefixes)) {
    map[`${prefix}-white`] = `${prop}: #ffffff`;
    map[`${prefix}-black`] = `${prop}: #000000`;
    map[`${prefix}-transparent`] = `${prop}: transparent`;
    map[`${prefix}-current`] = `${prop}: currentColor`;
    map[`${prefix}-inherit`] = `${prop}: inherit`;
    for (const color of COLOR_NAMES) {
      for (const shade of SHADES) {
        const hex = TAILWIND_COLORS[color][shade];
        map[`${prefix}-${color}-${shade}`] = `${prop}: ${hex}`;
      }
    }
  }
  return map;
}

function buildSizingMap(): Record<string, string> {
  const map: Record<string, string> = {};
  const spacingScale: Record<string, string> = {
    '0':'0px','px':'1px','0.5':'0.125rem','1':'0.25rem','1.5':'0.375rem',
    '2':'0.5rem','2.5':'0.625rem','3':'0.75rem','3.5':'0.875rem','4':'1rem',
    '5':'1.25rem','6':'1.5rem','7':'1.75rem','8':'2rem','9':'2.25rem',
    '10':'2.5rem','11':'2.75rem','12':'3rem','14':'3.5rem','16':'4rem',
    '20':'5rem','24':'6rem','28':'7rem','32':'8rem','36':'9rem','40':'10rem',
    '44':'11rem','48':'12rem','52':'13rem','56':'14rem','60':'15rem',
    '64':'16rem','72':'18rem','80':'20rem','96':'24rem',
  };
  for (const [size, val] of Object.entries(spacingScale)) {
    map[`w-${size}`] = `width: ${val}`;
    map[`h-${size}`] = `height: ${val}`;
    map[`min-w-${size}`] = `min-width: ${val}`;
    map[`min-h-${size}`] = `min-height: ${val}`;
    map[`max-w-${size}`] = `max-width: ${val}`;
    map[`max-h-${size}`] = `max-height: ${val}`;
    map[`size-${size}`] = `width: ${val}; height: ${val}`;
  }
  const fractions: Record<string, string> = {
    '1/2':'50%','1/3':'33.333333%','2/3':'66.666667%','1/4':'25%','2/4':'50%',
    '3/4':'75%','1/5':'20%','2/5':'40%','3/5':'60%','4/5':'80%',
    '1/6':'16.666667%','5/6':'83.333333%','full':'100%','screen':'100vw',
    'svw':'100svw','lvw':'100lvw','dvw':'100dvw','min':'min-content',
    'max':'max-content','fit':'fit-content','auto':'auto',
  };
  for (const [k, v] of Object.entries(fractions)) {
    map[`w-${k}`] = `width: ${v}`;
  }
  const hFractions: Record<string, string> = {
    '1/2':'50%','1/3':'33.333333%','2/3':'66.666667%','1/4':'25%','2/4':'50%',
    '3/4':'75%','1/5':'20%','2/5':'40%','3/5':'60%','4/5':'80%',
    '1/6':'16.666667%','5/6':'83.333333%','full':'100%','screen':'100vh',
    'svh':'100svh','lvh':'100lvh','dvh':'100dvh','min':'min-content',
    'max':'max-content','fit':'fit-content','auto':'auto',
  };
  for (const [k, v] of Object.entries(hFractions)) {
    map[`h-${k}`] = `height: ${v}`;
  }
  return map;
}

function buildStaticMap(): Record<string, string> {
  return {
    // Display
    'block': 'display: block', 'inline-block': 'display: inline-block', 'inline': 'display: inline',
    'flex': 'display: flex', 'inline-flex': 'display: inline-flex', 'grid': 'display: grid',
    'inline-grid': 'display: inline-grid', 'table': 'display: table', 'hidden': 'display: none',
    'contents': 'display: contents',
    // Position
    'static': 'position: static', 'fixed': 'position: fixed', 'absolute': 'position: absolute',
    'relative': 'position: relative', 'sticky': 'position: sticky',
    // Inset
    'inset-0': 'inset: 0px', 'inset-x-0': 'left: 0px; right: 0px', 'inset-y-0': 'top: 0px; bottom: 0px',
    'top-0': 'top: 0px', 'right-0': 'right: 0px', 'bottom-0': 'bottom: 0px', 'left-0': 'left: 0px',
    'top-1': 'top: 0.25rem', 'top-2': 'top: 0.5rem', 'top-4': 'top: 1rem',
    'right-1': 'right: 0.25rem', 'right-2': 'right: 0.5rem', 'right-4': 'right: 1rem',
    'bottom-1': 'bottom: 0.25rem', 'bottom-2': 'bottom: 0.5rem', 'bottom-4': 'bottom: 1rem',
    'left-1': 'left: 0.25rem', 'left-2': 'left: 0.5rem', 'left-4': 'left: 1rem',
    // Flex
    'flex-row': 'flex-direction: row', 'flex-col': 'flex-direction: column',
    'flex-row-reverse': 'flex-direction: row-reverse', 'flex-col-reverse': 'flex-direction: column-reverse',
    'flex-wrap': 'flex-wrap: wrap', 'flex-nowrap': 'flex-wrap: nowrap', 'flex-wrap-reverse': 'flex-wrap: wrap-reverse',
    'flex-1': 'flex: 1 1 0%', 'flex-auto': 'flex: 1 1 auto', 'flex-initial': 'flex: 0 1 auto', 'flex-none': 'flex: none',
    'grow': 'flex-grow: 1', 'grow-0': 'flex-grow: 0', 'shrink': 'flex-shrink: 1', 'shrink-0': 'flex-shrink: 0',
    // Justify / Align
    'justify-start': 'justify-content: flex-start', 'justify-end': 'justify-content: flex-end',
    'justify-center': 'justify-content: center', 'justify-between': 'justify-content: space-between',
    'justify-around': 'justify-content: space-around', 'justify-evenly': 'justify-content: space-evenly',
    'items-start': 'align-items: flex-start', 'items-end': 'align-items: flex-end',
    'items-center': 'align-items: center', 'items-baseline': 'align-items: baseline', 'items-stretch': 'align-items: stretch',
    'self-auto': 'align-self: auto', 'self-start': 'align-self: flex-start',
    'self-end': 'align-self: flex-end', 'self-center': 'align-self: center', 'self-stretch': 'align-self: stretch',
    'content-start': 'align-content: flex-start', 'content-end': 'align-content: flex-end',
    'content-center': 'align-content: center', 'content-between': 'align-content: space-between',
    // Grid
    'grid-cols-1': 'grid-template-columns: repeat(1, minmax(0, 1fr))',
    'grid-cols-2': 'grid-template-columns: repeat(2, minmax(0, 1fr))',
    'grid-cols-3': 'grid-template-columns: repeat(3, minmax(0, 1fr))',
    'grid-cols-4': 'grid-template-columns: repeat(4, minmax(0, 1fr))',
    'grid-cols-5': 'grid-template-columns: repeat(5, minmax(0, 1fr))',
    'grid-cols-6': 'grid-template-columns: repeat(6, minmax(0, 1fr))',
    'grid-cols-12': 'grid-template-columns: repeat(12, minmax(0, 1fr))',
    'grid-rows-1': 'grid-template-rows: repeat(1, minmax(0, 1fr))',
    'grid-rows-2': 'grid-template-rows: repeat(2, minmax(0, 1fr))',
    'grid-rows-3': 'grid-template-rows: repeat(3, minmax(0, 1fr))',
    'col-span-1': 'grid-column: span 1 / span 1', 'col-span-2': 'grid-column: span 2 / span 2',
    'col-span-3': 'grid-column: span 3 / span 3', 'col-span-4': 'grid-column: span 4 / span 4',
    'col-span-full': 'grid-column: 1 / -1',
    // Overflow
    'overflow-auto': 'overflow: auto', 'overflow-hidden': 'overflow: hidden',
    'overflow-visible': 'overflow: visible', 'overflow-scroll': 'overflow: scroll',
    'overflow-x-auto': 'overflow-x: auto', 'overflow-y-auto': 'overflow-y: auto',
    'overflow-x-hidden': 'overflow-x: hidden', 'overflow-y-hidden': 'overflow-y: hidden',
    // Typography
    'text-xs': 'font-size: 0.75rem; line-height: 1rem',
    'text-sm': 'font-size: 0.875rem; line-height: 1.25rem',
    'text-base': 'font-size: 1rem; line-height: 1.5rem',
    'text-lg': 'font-size: 1.125rem; line-height: 1.75rem',
    'text-xl': 'font-size: 1.25rem; line-height: 1.75rem',
    'text-2xl': 'font-size: 1.5rem; line-height: 2rem',
    'text-3xl': 'font-size: 1.875rem; line-height: 2.25rem',
    'text-4xl': 'font-size: 2.25rem; line-height: 2.5rem',
    'text-5xl': 'font-size: 3rem; line-height: 1',
    'text-6xl': 'font-size: 3.75rem; line-height: 1',
    'text-7xl': 'font-size: 4.5rem; line-height: 1',
    'text-8xl': 'font-size: 6rem; line-height: 1',
    'text-9xl': 'font-size: 8rem; line-height: 1',
    'font-thin': 'font-weight: 100', 'font-extralight': 'font-weight: 200',
    'font-light': 'font-weight: 300', 'font-normal': 'font-weight: 400',
    'font-medium': 'font-weight: 500', 'font-semibold': 'font-weight: 600',
    'font-bold': 'font-weight: 700', 'font-extrabold': 'font-weight: 800', 'font-black': 'font-weight: 900',
    'italic': 'font-style: italic', 'not-italic': 'font-style: normal',
    'text-left': 'text-align: left', 'text-center': 'text-align: center',
    'text-right': 'text-align: right', 'text-justify': 'text-align: justify',
    'underline': 'text-decoration-line: underline', 'overline': 'text-decoration-line: overline',
    'line-through': 'text-decoration-line: line-through', 'no-underline': 'text-decoration-line: none',
    'uppercase': 'text-transform: uppercase', 'lowercase': 'text-transform: lowercase',
    'capitalize': 'text-transform: capitalize', 'normal-case': 'text-transform: none',
    'truncate': 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap',
    'leading-none': 'line-height: 1', 'leading-tight': 'line-height: 1.25',
    'leading-snug': 'line-height: 1.375', 'leading-normal': 'line-height: 1.5',
    'leading-relaxed': 'line-height: 1.625', 'leading-loose': 'line-height: 2',
    'tracking-tighter': 'letter-spacing: -0.05em', 'tracking-tight': 'letter-spacing: -0.025em',
    'tracking-normal': 'letter-spacing: 0em', 'tracking-wide': 'letter-spacing: 0.025em',
    'tracking-wider': 'letter-spacing: 0.05em', 'tracking-widest': 'letter-spacing: 0.1em',
    'whitespace-normal': 'white-space: normal', 'whitespace-nowrap': 'white-space: nowrap',
    'whitespace-pre': 'white-space: pre', 'break-words': 'overflow-wrap: break-word',
    'break-all': 'word-break: break-all',
    // Border radius
    'rounded-none': 'border-radius: 0px', 'rounded-sm': 'border-radius: 0.125rem',
    'rounded': 'border-radius: 0.25rem', 'rounded-md': 'border-radius: 0.375rem',
    'rounded-lg': 'border-radius: 0.5rem', 'rounded-xl': 'border-radius: 0.75rem',
    'rounded-2xl': 'border-radius: 1rem', 'rounded-3xl': 'border-radius: 1.5rem',
    'rounded-full': 'border-radius: 9999px',
    'rounded-t-none': 'border-top-left-radius: 0px; border-top-right-radius: 0px',
    'rounded-t-lg': 'border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem',
    'rounded-b-lg': 'border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem',
    'rounded-l-lg': 'border-top-left-radius: 0.5rem; border-bottom-left-radius: 0.5rem',
    'rounded-r-lg': 'border-top-right-radius: 0.5rem; border-bottom-right-radius: 0.5rem',
    // Border width
    'border': 'border-width: 1px', 'border-0': 'border-width: 0px',
    'border-2': 'border-width: 2px', 'border-4': 'border-width: 4px', 'border-8': 'border-width: 8px',
    'border-t': 'border-top-width: 1px', 'border-t-0': 'border-top-width: 0px',
    'border-t-2': 'border-top-width: 2px', 'border-t-4': 'border-top-width: 4px',
    'border-b': 'border-bottom-width: 1px', 'border-b-0': 'border-bottom-width: 0px',
    'border-b-2': 'border-bottom-width: 2px', 'border-b-4': 'border-bottom-width: 4px',
    'border-l': 'border-left-width: 1px', 'border-l-0': 'border-left-width: 0px',
    'border-l-2': 'border-left-width: 2px', 'border-l-4': 'border-left-width: 4px',
    'border-r': 'border-right-width: 1px', 'border-r-0': 'border-right-width: 0px',
    'border-r-2': 'border-right-width: 2px', 'border-r-4': 'border-right-width: 4px',
    'border-solid': 'border-style: solid', 'border-dashed': 'border-style: dashed',
    'border-dotted': 'border-style: dotted', 'border-double': 'border-style: double', 'border-none': 'border-style: none',
    // Shadows
    'shadow-sm': 'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)',
    'shadow': 'box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    'shadow-md': 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    'shadow-lg': 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    'shadow-xl': 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    'shadow-2xl': 'box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25)',
    'shadow-inner': 'box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    'shadow-none': 'box-shadow: 0 0 #0000',
    // Opacity
    'opacity-0': 'opacity: 0', 'opacity-5': 'opacity: 0.05', 'opacity-10': 'opacity: 0.1',
    'opacity-15': 'opacity: 0.15', 'opacity-20': 'opacity: 0.2', 'opacity-25': 'opacity: 0.25',
    'opacity-30': 'opacity: 0.3', 'opacity-40': 'opacity: 0.4', 'opacity-50': 'opacity: 0.5',
    'opacity-60': 'opacity: 0.6', 'opacity-70': 'opacity: 0.7', 'opacity-75': 'opacity: 0.75',
    'opacity-80': 'opacity: 0.8', 'opacity-90': 'opacity: 0.9', 'opacity-95': 'opacity: 0.95',
    'opacity-100': 'opacity: 1',
    // Transform
    'rotate-0': 'transform: rotate(0deg)', 'rotate-1': 'transform: rotate(1deg)',
    'rotate-2': 'transform: rotate(2deg)', 'rotate-3': 'transform: rotate(3deg)',
    'rotate-6': 'transform: rotate(6deg)', 'rotate-12': 'transform: rotate(12deg)',
    'rotate-45': 'transform: rotate(45deg)', 'rotate-90': 'transform: rotate(90deg)',
    'rotate-180': 'transform: rotate(180deg)', '-rotate-1': 'transform: rotate(-1deg)',
    '-rotate-2': 'transform: rotate(-2deg)', '-rotate-3': 'transform: rotate(-3deg)',
    '-rotate-6': 'transform: rotate(-6deg)', '-rotate-12': 'transform: rotate(-12deg)',
    '-rotate-45': 'transform: rotate(-45deg)', '-rotate-90': 'transform: rotate(-90deg)',
    '-rotate-180': 'transform: rotate(-180deg)',
    'scale-0': 'transform: scale(0)', 'scale-50': 'transform: scale(.5)',
    'scale-75': 'transform: scale(.75)', 'scale-90': 'transform: scale(.9)',
    'scale-95': 'transform: scale(.95)', 'scale-100': 'transform: scale(1)',
    'scale-105': 'transform: scale(1.05)', 'scale-110': 'transform: scale(1.1)',
    'scale-125': 'transform: scale(1.25)', 'scale-150': 'transform: scale(1.5)',
    // Filters
    'blur-none': 'filter: blur(0)', 'blur-sm': 'filter: blur(4px)', 'blur': 'filter: blur(8px)',
    'blur-md': 'filter: blur(12px)', 'blur-lg': 'filter: blur(16px)', 'blur-xl': 'filter: blur(24px)',
    'blur-2xl': 'filter: blur(40px)', 'blur-3xl': 'filter: blur(64px)',
    'brightness-0': 'filter: brightness(0)', 'brightness-50': 'filter: brightness(.5)',
    'brightness-75': 'filter: brightness(.75)', 'brightness-90': 'filter: brightness(.9)',
    'brightness-95': 'filter: brightness(.95)', 'brightness-100': 'filter: brightness(1)',
    'brightness-105': 'filter: brightness(1.05)', 'brightness-110': 'filter: brightness(1.1)',
    'brightness-125': 'filter: brightness(1.25)', 'brightness-150': 'filter: brightness(1.5)',
    'brightness-200': 'filter: brightness(2)',
    // Animation
    'animate-spin': 'animation: spin 1s linear infinite',
    'animate-ping': 'animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    'animate-pulse': 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'animate-bounce': 'animation: bounce 1s infinite',
    'animate-none': 'animation: none',
    // Cursor
    'cursor-pointer': 'cursor: pointer', 'cursor-default': 'cursor: default',
    'cursor-wait': 'cursor: wait', 'cursor-text': 'cursor: text',
    'cursor-move': 'cursor: move', 'cursor-not-allowed': 'cursor: not-allowed',
    // Pointer events
    'pointer-events-none': 'pointer-events: none', 'pointer-events-auto': 'pointer-events: auto',
    // User select
    'select-none': 'user-select: none', 'select-text': 'user-select: text', 'select-all': 'user-select: all',
    // Z-index
    'z-0': 'z-index: 0', 'z-10': 'z-index: 10', 'z-20': 'z-index: 20',
    'z-30': 'z-index: 30', 'z-40': 'z-index: 40', 'z-50': 'z-index: 50',
    'z-auto': 'z-index: auto',
    // Transition
    'transition': 'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms',
    'transition-all': 'transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms',
    'transition-colors': 'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms',
    'transition-none': 'transition-property: none',
    'duration-75': 'transition-duration: 75ms', 'duration-100': 'transition-duration: 100ms',
    'duration-150': 'transition-duration: 150ms', 'duration-200': 'transition-duration: 200ms',
    'duration-300': 'transition-duration: 300ms', 'duration-500': 'transition-duration: 500ms',
    'duration-700': 'transition-duration: 700ms', 'duration-1000': 'transition-duration: 1000ms',
    'ease-linear': 'transition-timing-function: linear',
    'ease-in': 'transition-timing-function: cubic-bezier(0.4, 0, 1, 1)',
    'ease-out': 'transition-timing-function: cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out': 'transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)',
    // Object fit
    'object-contain': 'object-fit: contain', 'object-cover': 'object-fit: cover',
    'object-fill': 'object-fit: fill', 'object-none': 'object-fit: none',
    // Aspect ratio
    'aspect-auto': 'aspect-ratio: auto', 'aspect-square': 'aspect-ratio: 1 / 1',
    'aspect-video': 'aspect-ratio: 16 / 9',
    // Misc
    'ring': 'box-shadow: 0 0 0 3px rgb(59 130 246 / 0.5)',
    'ring-0': 'box-shadow: 0 0 0 0px rgb(59 130 246 / 0.5)',
    'ring-1': 'box-shadow: 0 0 0 1px rgb(59 130 246 / 0.5)',
    'ring-2': 'box-shadow: 0 0 0 2px rgb(59 130 246 / 0.5)',
    'ring-4': 'box-shadow: 0 0 0 4px rgb(59 130 246 / 0.5)',
    'outline-none': 'outline: 2px solid transparent; outline-offset: 2px',
    'outline': 'outline-style: solid',
    // Background
    'bg-gradient-to-t': 'background-image: linear-gradient(to top, var(--tw-gradient-stops))',
    'bg-gradient-to-tr': 'background-image: linear-gradient(to top right, var(--tw-gradient-stops))',
    'bg-gradient-to-r': 'background-image: linear-gradient(to right, var(--tw-gradient-stops))',
    'bg-gradient-to-br': 'background-image: linear-gradient(to bottom right, var(--tw-gradient-stops))',
    'bg-gradient-to-b': 'background-image: linear-gradient(to bottom, var(--tw-gradient-stops))',
    'bg-gradient-to-bl': 'background-image: linear-gradient(to bottom left, var(--tw-gradient-stops))',
    'bg-gradient-to-l': 'background-image: linear-gradient(to left, var(--tw-gradient-stops))',
    'bg-gradient-to-tl': 'background-image: linear-gradient(to top left, var(--tw-gradient-stops))',
  };
}

// Build combined map lazily
let _classMap: Record<string, string> | null = null;
function getClassMap(): Record<string, string> {
  if (!_classMap) {
    _classMap = {
      ...buildStaticMap(),
      ...buildSpacingMap(),
      ...buildColorMap(),
      ...buildSizingMap(),
    };
  }
  return _classMap;
}

function tailwindToCSS(classes: string): { css: string; valid: string[]; invalid: string[] } {
  const map = getClassMap();
  const tokens = classes.trim().split(/\s+/).filter(Boolean);
  const valid: string[] = [];
  const invalid: string[] = [];
  const declarations: string[] = [];

  for (const token of tokens) {
    // Skip responsive/state prefixes for preview but try to resolve base
    const base = token.replace(/^(sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|dark:|group-hover:|disabled:|first:|last:)+/, '');
    if (map[base]) {
      valid.push(token);
      declarations.push(`  ${map[base]};`);
    } else {
      invalid.push(token);
    }
  }

  const css = declarations.length > 0
    ? `.preview {\n${declarations.join('\n')}\n}`
    : '/* No valid classes */';

  return { css, valid, invalid };
}

// ─── All known class names for autocomplete ───────────────────────────────────

let _allClasses: string[] | null = null;
function getAllClasses(): string[] {
  if (!_allClasses) {
    _allClasses = Object.keys(getClassMap());
  }
  return _allClasses;
}

// ─── Snippets ─────────────────────────────────────────────────────────────────

const SNIPPETS: { name: string; classes: string; element: PreviewElement; content: string }[] = [
  { name: 'Primary Button', classes: 'bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition', element: 'button', content: 'Click Me' },
  { name: 'Outlined Button', classes: 'border-2 border-indigo-500 text-indigo-500 font-medium py-2 px-5 rounded-lg hover:bg-indigo-50 transition', element: 'button', content: 'Outlined' },
  { name: 'Card', classes: 'bg-white rounded-2xl shadow-lg p-6 border border-gray-100', element: 'card', content: 'Card Content' },
  { name: 'Badge', classes: 'inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full', element: 'badge', content: 'Active' },
  { name: 'Input Field', classes: 'w-full border border-gray-300 rounded-lg py-2 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500', element: 'input', content: 'Type here...' },
  { name: 'Alert', classes: 'bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm font-medium', element: 'div', content: 'Something went wrong!' },
  { name: 'Gradient Pill', classes: 'bg-gradient-to-r inline-block text-white font-bold py-3 px-8 rounded-full shadow-lg bg-purple-600', element: 'button', content: 'Gradient' },
  { name: 'Navbar Item', classes: 'text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition cursor-pointer', element: 'div', content: 'Dashboard' },
];

// ─── Builder Categories ───────────────────────────────────────────────────────

const BUILDER_CATEGORIES: BuilderCategory[] = [
  {
    name: 'Layout',
    icon: <Layout className="w-4 h-4" />,
    options: [
      { label: 'Flex', classes: ['flex', 'flex-row', 'flex-col', 'flex-wrap', 'flex-nowrap', 'inline-flex'] },
      { label: 'Grid', classes: ['grid', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-6', 'grid-cols-12'] },
      { label: 'Display', classes: ['block', 'inline-block', 'inline', 'hidden', 'contents'] },
      { label: 'Position', classes: ['relative', 'absolute', 'fixed', 'sticky', 'static'] },
      { label: 'Justify', classes: ['justify-start', 'justify-center', 'justify-end', 'justify-between', 'justify-around', 'justify-evenly'] },
      { label: 'Align', classes: ['items-start', 'items-center', 'items-end', 'items-baseline', 'items-stretch'] },
      { label: 'Overflow', classes: ['overflow-auto', 'overflow-hidden', 'overflow-visible', 'overflow-scroll'] },
    ],
  },
  {
    name: 'Spacing',
    icon: <Move className="w-4 h-4" />,
    options: [
      { label: 'Padding', classes: ['p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12', 'p-16', 'p-20'] },
      { label: 'Padding X', classes: ['px-0', 'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-8', 'px-10', 'px-12'] },
      { label: 'Padding Y', classes: ['py-0', 'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6', 'py-8', 'py-10', 'py-12'] },
      { label: 'Margin', classes: ['m-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10', 'm-12', 'm-auto'] },
      { label: 'Margin X', classes: ['mx-0', 'mx-1', 'mx-2', 'mx-3', 'mx-4', 'mx-6', 'mx-8', 'mx-auto'] },
      { label: 'Margin Y', classes: ['my-0', 'my-1', 'my-2', 'my-3', 'my-4', 'my-6', 'my-8', 'my-auto'] },
      { label: 'Gap', classes: ['gap-0', 'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-8', 'gap-10', 'gap-12'] },
    ],
  },
  {
    name: 'Sizing',
    icon: <Maximize2 className="w-4 h-4" />,
    options: [
      { label: 'Width', classes: ['w-0', 'w-4', 'w-8', 'w-12', 'w-16', 'w-20', 'w-24', 'w-32', 'w-40', 'w-48', 'w-56', 'w-64', 'w-full', 'w-screen', 'w-auto'] },
      { label: 'Height', classes: ['h-0', 'h-4', 'h-8', 'h-12', 'h-16', 'h-20', 'h-24', 'h-32', 'h-40', 'h-48', 'h-56', 'h-64', 'h-full', 'h-screen', 'h-auto'] },
      { label: 'Width Fraction', classes: ['w-1/2', 'w-1/3', 'w-2/3', 'w-1/4', 'w-3/4', 'w-1/5', 'w-2/5', 'w-3/5', 'w-4/5'] },
      { label: 'Size', classes: ['size-4', 'size-5', 'size-6', 'size-8', 'size-10', 'size-12', 'size-16', 'size-20'] },
    ],
  },
  {
    name: 'Typography',
    icon: <Type className="w-4 h-4" />,
    options: [
      { label: 'Font Size', classes: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl'] },
      { label: 'Font Weight', classes: ['font-thin', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black'] },
      { label: 'Text Align', classes: ['text-left', 'text-center', 'text-right', 'text-justify'] },
      { label: 'Line Height', classes: ['leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose'] },
      { label: 'Letter Spacing', classes: ['tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider', 'tracking-widest'] },
      { label: 'Decoration', classes: ['underline', 'overline', 'line-through', 'no-underline'] },
      { label: 'Transform', classes: ['uppercase', 'lowercase', 'capitalize', 'normal-case', 'italic', 'not-italic'] },
    ],
  },
  {
    name: 'Background',
    icon: <Palette className="w-4 h-4" />,
    options: [
      { label: 'Base', classes: ['bg-white', 'bg-black', 'bg-transparent'] },
      { label: 'Gradient Direction', classes: ['bg-gradient-to-r', 'bg-gradient-to-l', 'bg-gradient-to-t', 'bg-gradient-to-b', 'bg-gradient-to-tr', 'bg-gradient-to-br', 'bg-gradient-to-tl', 'bg-gradient-to-bl'] },
    ],
  },
  {
    name: 'Border',
    icon: <Square className="w-4 h-4" />,
    options: [
      { label: 'Width', classes: ['border', 'border-0', 'border-2', 'border-4', 'border-8'] },
      { label: 'Style', classes: ['border-solid', 'border-dashed', 'border-dotted', 'border-double', 'border-none'] },
      { label: 'Radius', classes: ['rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full'] },
    ],
  },
  {
    name: 'Effects',
    icon: <Layers className="w-4 h-4" />,
    options: [
      { label: 'Shadow', classes: ['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner', 'shadow-none'] },
      { label: 'Opacity', classes: ['opacity-0', 'opacity-10', 'opacity-20', 'opacity-25', 'opacity-30', 'opacity-40', 'opacity-50', 'opacity-60', 'opacity-70', 'opacity-75', 'opacity-80', 'opacity-90', 'opacity-100'] },
      { label: 'Blur', classes: ['blur-none', 'blur-sm', 'blur', 'blur-md', 'blur-lg', 'blur-xl', 'blur-2xl'] },
      { label: 'Brightness', classes: ['brightness-50', 'brightness-75', 'brightness-90', 'brightness-100', 'brightness-110', 'brightness-125', 'brightness-150', 'brightness-200'] },
    ],
  },
  {
    name: 'Transform',
    icon: <Circle className="w-4 h-4" />,
    options: [
      { label: 'Rotate', classes: ['rotate-0', 'rotate-1', 'rotate-2', 'rotate-3', 'rotate-6', 'rotate-12', 'rotate-45', 'rotate-90', 'rotate-180', '-rotate-6', '-rotate-12', '-rotate-45', '-rotate-90'] },
      { label: 'Scale', classes: ['scale-0', 'scale-50', 'scale-75', 'scale-90', 'scale-95', 'scale-100', 'scale-105', 'scale-110', 'scale-125', 'scale-150'] },
    ],
  },
  {
    name: 'Animation',
    icon: <Zap className="w-4 h-4" />,
    options: [
      { label: 'Animate', classes: ['animate-spin', 'animate-bounce', 'animate-pulse', 'animate-ping', 'animate-none'] },
      { label: 'Transition', classes: ['transition', 'transition-all', 'transition-colors', 'transition-none'] },
      { label: 'Duration', classes: ['duration-75', 'duration-100', 'duration-150', 'duration-200', 'duration-300', 'duration-500', 'duration-700', 'duration-1000'] },
      { label: 'Ease', classes: ['ease-linear', 'ease-in', 'ease-out', 'ease-in-out'] },
    ],
  },
];

// ─── Viewport Config ──────────────────────────────────────────────────────────

const VIEWPORTS: Record<Viewport, { width: number; icon: React.ReactNode; label: string }> = {
  mobile: { width: 375, icon: <Smartphone className="w-4 h-4" />, label: '375px' },
  tablet: { width: 768, icon: <Tablet className="w-4 h-4" />, label: '768px' },
  desktop: { width: 1280, icon: <Monitor className="w-4 h-4" />, label: '100%' },
};

const PREVIEW_ELEMENTS: { value: PreviewElement; label: string }[] = [
  { value: 'div', label: 'Div' },
  { value: 'button', label: 'Button' },
  { value: 'card', label: 'Card' },
  { value: 'text', label: 'Text' },
  { value: 'input', label: 'Input' },
  { value: 'badge', label: 'Badge' },
];

const STORAGE_KEY = 'tw-playground-history';

// ─── Animation keyframes injected via style tag ───────────────────────────────

const ANIMATION_KEYFRAMES = `
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
@keyframes pulse { 50% { opacity: .5; } }
@keyframes bounce { 0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); } 50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); } }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function TailwindPlaygroundTool() {
  const [mode, setMode] = useState<Mode>('editor');
  const [classes, setClasses] = useState('bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md');
  const [element, setElement] = useState<PreviewElement>('button');
  const [content, setContent] = useState('Click Me');
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [copiedClasses, setCopiedClasses] = useState(false);
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerPrefix, setColorPickerPrefix] = useState<'bg' | 'text' | 'border'>('bg');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Layout');
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const styleId = 'tw-playground-preview-style';

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: HistoryEntry[] = JSON.parse(stored);
        setHistory(parsed.slice(0, 5));
      }
    } catch {
      // ignore
    }
  }, []);

  // Process classes into CSS
  const { css, valid, invalid } = useMemo(() => tailwindToCSS(classes), [classes]);

  // Build inline CSS for preview
  const previewCSS = useMemo(() => {
    const map = getClassMap();
    const tokens = classes.trim().split(/\s+/).filter(Boolean);
    const decls: string[] = [];
    for (const token of tokens) {
      const base = token.replace(/^(sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|dark:|group-hover:|disabled:|first:|last:)+/, '');
      if (map[base]) {
        decls.push(map[base]);
      }
    }
    return decls.join('; ');
  }, [classes]);

  // Inject dynamic style tag
  useEffect(() => {
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = ANIMATION_KEYFRAMES + `\n.tw-pg-preview { ${previewCSS} }`;
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [previewCSS]);

  // Autocomplete handler
  const handleAutocomplete = useCallback((value: string) => {
    setClasses(value);
    const words = value.split(/\s+/);
    const lastWord = words[words.length - 1];
    if (lastWord && lastWord.length >= 2) {
      const all = getAllClasses();
      const matches = all.filter(c => c.startsWith(lastWord) && c !== lastWord).slice(0, 8);
      setAutocompleteResults(matches);
      setShowAutocomplete(matches.length > 0);
    } else {
      setShowAutocomplete(false);
      setAutocompleteResults([]);
    }
  }, []);

  const applyAutocomplete = useCallback((suggestion: string) => {
    const words = classes.split(/\s+/);
    words[words.length - 1] = suggestion;
    setClasses(words.join(' ') + ' ');
    setShowAutocomplete(false);
    textareaRef.current?.focus();
  }, [classes]);

  const addClass = useCallback((cls: string) => {
    setClasses(prev => {
      const existing = prev.trim().split(/\s+/).filter(Boolean);
      if (existing.includes(cls)) return prev;
      return [...existing, cls].join(' ');
    });
  }, []);

  const removeClass = useCallback((cls: string) => {
    setClasses(prev => prev.trim().split(/\s+/).filter(c => c !== cls).join(' '));
  }, []);

  const copyClasses = async () => {
    await navigator.clipboard.writeText(classes);
    setCopiedClasses(true);
    setTimeout(() => setCopiedClasses(false), 2000);
  };

  const copyCSSOutput = async () => {
    await navigator.clipboard.writeText(css);
    setCopiedCSS(true);
    setTimeout(() => setCopiedCSS(false), 2000);
  };

  const saveToHistory = useCallback(() => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      classes,
      element,
      content,
      timestamp: Date.now(),
    };
    const updated = [entry, ...history.filter(h => h.classes !== classes)].slice(0, 5);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [classes, element, content, history]);

  const loadFromHistory = useCallback((entry: HistoryEntry) => {
    setClasses(entry.classes);
    setElement(entry.element);
    setContent(entry.content);
    setShowHistory(false);
  }, []);

  const applySnippet = useCallback((snippet: typeof SNIPPETS[0]) => {
    setClasses(snippet.classes);
    setElement(snippet.element);
    setContent(snippet.content);
    setShowSnippets(false);
  }, []);

  const resetAll = useCallback(() => {
    setClasses('');
    setElement('div');
    setContent('Preview');
    setShowAutocomplete(false);
  }, []);

  const openColorPicker = useCallback((prefix: 'bg' | 'text' | 'border') => {
    setColorPickerPrefix(prefix);
    setShowColorPicker(true);
  }, []);

  // Render preview element
  const renderPreview = () => {
    const baseProps = { className: 'tw-pg-preview' };
    switch (element) {
      case 'button':
        return <button {...baseProps}>{content}</button>;
      case 'input':
        return <input {...baseProps} placeholder={content} readOnly />;
      case 'card':
        return (
          <div {...baseProps}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{content}</h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>This is a card preview with some sample text content to demonstrate the styling.</p>
          </div>
        );
      case 'badge':
        return <span {...baseProps}>{content}</span>;
      case 'text':
        return <p {...baseProps}>{content}</p>;
      default:
        return <div {...baseProps}>{content}</div>;
    }
  };

  // Highlighted class tokens
  const renderClassTokens = () => {
    const tokens = classes.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {tokens.map((token, i) => {
          const isValid = valid.includes(token);
          return (
            <motion.span
              key={`${token}-${i}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono ${
                isValid
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
              }`}
            >
              {token}
              <button
                onClick={() => removeClass(token)}
                className="ml-0.5 hover:text-red-500 transition-colors"
                aria-label={`Remove ${token}`}
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          );
        })}
      </div>
    );
  };

  // Box model visualizer
  const renderBoxModel = () => {
    const map = getClassMap();
    const tokens = classes.trim().split(/\s+/).filter(Boolean);
    const values: Record<string, string> = {};
    for (const token of tokens) {
      const base = token.replace(/^(sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|dark:)+/, '');
      const cssStr = map[base];
      if (cssStr) {
        const pairs = cssStr.split(';').map(s => s.trim()).filter(Boolean);
        for (const pair of pairs) {
          const [prop, val] = pair.split(':').map(s => s.trim());
          if (prop && val) values[prop] = val;
        }
      }
    }
    const mt = values['margin-top'] || values['margin'] || '0';
    const mr = values['margin-right'] || values['margin'] || '0';
    const mb = values['margin-bottom'] || values['margin'] || '0';
    const ml = values['margin-left'] || values['margin'] || '0';
    const pt = values['padding-top'] || values['padding'] || '0';
    const pr = values['padding-right'] || values['padding'] || '0';
    const pb = values['padding-bottom'] || values['padding'] || '0';
    const pl = values['padding-left'] || values['padding'] || '0';

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Box Model</h4>
        <div className="flex items-center justify-center">
          <div className="relative">
            {/* Margin */}
            <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-lg p-3 text-center min-w-[200px]">
              <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 absolute top-1 left-1">margin</span>
              <div className="flex justify-between text-[10px] font-mono text-orange-600 dark:text-orange-400 mb-1">
                <span>{ml}</span>
                <span>{mt}</span>
                <span>{mr}</span>
              </div>
              {/* Border */}
              <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 rounded-md p-2">
                <span className="text-[10px] font-mono text-yellow-700 dark:text-yellow-400">border</span>
                {/* Padding */}
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded p-2 mt-1">
                  <span className="text-[10px] font-mono text-green-600 dark:text-green-400 block">padding</span>
                  <div className="flex justify-between text-[10px] font-mono text-green-600 dark:text-green-400">
                    <span>{pl}</span>
                    <span>{pt}/{pb}</span>
                    <span>{pr}</span>
                  </div>
                  {/* Content */}
                  <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded p-2 mt-1 text-center">
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">content</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center text-[10px] font-mono text-orange-600 dark:text-orange-400 mt-1">
                <span>{mb}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle + Controls Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Segmented Control */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => setMode('editor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'editor'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Class Editor
          </button>
          <button
            onClick={() => setMode('builder')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'builder'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Paintbrush className="w-4 h-4" />
            Visual Builder
          </button>
        </div>

        {/* Viewport Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 gap-0.5">
          {(Object.keys(VIEWPORTS) as Viewport[]).map(vp => (
            <button
              key={vp}
              onClick={() => setViewport(vp)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewport === vp
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title={VIEWPORTS[vp].label}
            >
              {VIEWPORTS[vp].icon}
              <span className="hidden sm:inline">{VIEWPORTS[vp].label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSnippets(!showSnippets)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400 dark:hover:bg-violet-900/50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Snippets
          </button>
          <button
            onClick={() => { setShowHistory(!showHistory); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Snippets Dropdown */}
      <AnimatePresence>
        {showSnippets && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-4"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Common Snippets</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SNIPPETS.map(snippet => (
                <button
                  key={snippet.name}
                  onClick={() => applySnippet(snippet)}
                  className="text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">{snippet.name}</span>
                  <span className="block text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 font-mono">{snippet.classes}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Dropdown */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-4"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recent Playgrounds</h3>
            {history.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">No saved history yet. Changes are saved when you click the save button.</p>
            ) : (
              <div className="space-y-2">
                {history.map(entry => (
                  <button
                    key={entry.id}
                    onClick={() => loadFromHistory(entry)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <span className="text-xs font-mono text-gray-700 dark:text-gray-300 line-clamp-1">{entry.classes}</span>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {entry.element} &middot; {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content: Editor/Builder + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Panel */}
        <div className="space-y-4">
          {mode === 'editor' ? (
            <>
              {/* Element Selector */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Preview Element</label>
                <div className="flex flex-wrap gap-1.5">
                  {PREVIEW_ELEMENTS.map(pe => (
                    <button
                      key={pe.value}
                      onClick={() => setElement(pe.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        element === pe.value
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pe.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Inner Content</label>
                <input
                  type="text"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Preview content..."
                />
              </div>

              {/* Class Editor */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tailwind Classes</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={saveToHistory}
                      className="text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={copyClasses}
                      className="flex items-center gap-1 text-[10px] font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {copiedClasses ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      {copiedClasses ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={classes}
                    onChange={e => handleAutocomplete(e.target.value)}
                    onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Type Tailwind classes here..."
                    spellCheck={false}
                  />
                  {/* Autocomplete */}
                  <AnimatePresence>
                    {showAutocomplete && autocompleteResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute z-10 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                      >
                        {autocompleteResults.map(suggestion => (
                          <button
                            key={suggestion}
                            onMouseDown={() => applyAutocomplete(suggestion)}
                            className="w-full text-left px-3 py-1.5 text-xs font-mono text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            <Search className="w-3 h-3 inline mr-2 text-gray-400" />
                            {suggestion}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Token pills */}
                {renderClassTokens()}

                {/* Validation summary */}
                {classes.trim() && (
                  <div className="flex items-center gap-3 mt-3 text-[10px]">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{valid.length} valid</span>
                    {invalid.length > 0 && (
                      <span className="text-red-500 font-medium">{invalid.length} unknown</span>
                    )}
                  </div>
                )}
              </div>

              {/* Color Quick Pick */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Quick Color</label>
                <div className="flex gap-2">
                  {(['bg', 'text', 'border'] as const).map(prefix => (
                    <button
                      key={prefix}
                      onClick={() => openColorPicker(prefix)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        showColorPicker && colorPickerPrefix === prefix
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                      }`}
                    >
                      {prefix}-*
                    </button>
                  ))}
                </div>
              </div>

              {/* Box Model */}
              {renderBoxModel()}
            </>
          ) : (
            /* Visual Builder */
            <div className="space-y-3">
              {/* Element + Content for builder too */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[140px]">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Element</label>
                    <select
                      value={element}
                      onChange={e => setElement(e.target.value as PreviewElement)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {PREVIEW_ELEMENTS.map(pe => (
                        <option key={pe.value} value={pe.value}>{pe.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[140px]">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Content</label>
                    <input
                      type="text"
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Current classes display */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Active Classes</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={saveToHistory}
                      className="text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={copyClasses}
                      className="flex items-center gap-1 text-[10px] font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {copiedClasses ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      {copiedClasses ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="min-h-[40px] bg-gray-50 dark:bg-gray-900 rounded-lg p-2 font-mono text-xs text-gray-700 dark:text-gray-300 break-all">
                  {classes || <span className="text-gray-400 italic">Click options below to add classes</span>}
                </div>
                {renderClassTokens()}
              </div>

              {/* Builder Categories */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {BUILDER_CATEGORIES.map(cat => (
                  <div
                    key={cat.name}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === cat.name ? null : cat.name)}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      <span className="text-gray-500 dark:text-gray-400">{cat.icon}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white flex-1 text-left">{cat.name}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedCategory === cat.name ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedCategory === cat.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3">
                            {cat.options.map(opt => (
                              <div key={opt.label}>
                                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{opt.label}</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {opt.classes.map(cls => {
                                    const isActive = classes.trim().split(/\s+/).includes(cls);
                                    return (
                                      <button
                                        key={cls}
                                        onClick={() => isActive ? removeClass(cls) : addClass(cls)}
                                        className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                                          isActive
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                                        }`}
                                      >
                                        {cls}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}

                            {/* Color grid for Background category */}
                            {cat.name === 'Background' && (
                              <div>
                                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Colors</span>
                                <div className="mt-1 space-y-1">
                                  {COLOR_NAMES.map(color => (
                                    <div key={color} className="flex items-center gap-0.5">
                                      <span className="text-[9px] font-mono text-gray-400 w-12 shrink-0 truncate">{color}</span>
                                      <div className="flex gap-0.5">
                                        {SHADES.map(shade => (
                                          <button
                                            key={shade}
                                            onClick={() => addClass(`bg-${color}-${shade}`)}
                                            className="w-5 h-5 rounded-sm border border-gray-200 dark:border-gray-600 hover:scale-125 transition-transform"
                                            style={{ backgroundColor: TAILWIND_COLORS[color][shade] }}
                                            title={`bg-${color}-${shade}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Text color grid for Typography */}
                            {cat.name === 'Typography' && (
                              <div>
                                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Text Color</span>
                                <div className="mt-1 space-y-1">
                                  {COLOR_NAMES.slice(0, 10).map(color => (
                                    <div key={color} className="flex items-center gap-0.5">
                                      <span className="text-[9px] font-mono text-gray-400 w-12 shrink-0 truncate">{color}</span>
                                      <div className="flex gap-0.5">
                                        {SHADES.map(shade => (
                                          <button
                                            key={shade}
                                            onClick={() => addClass(`text-${color}-${shade}`)}
                                            className="w-5 h-5 rounded-sm border border-gray-200 dark:border-gray-600 hover:scale-125 transition-transform"
                                            style={{ backgroundColor: TAILWIND_COLORS[color][shade] }}
                                            title={`text-${color}-${shade}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Border color grid */}
                            {cat.name === 'Border' && (
                              <div>
                                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Border Color</span>
                                <div className="mt-1 space-y-1">
                                  {COLOR_NAMES.slice(0, 10).map(color => (
                                    <div key={color} className="flex items-center gap-0.5">
                                      <span className="text-[9px] font-mono text-gray-400 w-12 shrink-0 truncate">{color}</span>
                                      <div className="flex gap-0.5">
                                        {SHADES.map(shade => (
                                          <button
                                            key={shade}
                                            onClick={() => addClass(`border-${color}-${shade}`)}
                                            className="w-5 h-5 rounded-sm border border-gray-200 dark:border-gray-600 hover:scale-125 transition-transform"
                                            style={{ backgroundColor: TAILWIND_COLORS[color][shade] }}
                                            title={`border-${color}-${shade}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Box Model in builder mode too */}
              {renderBoxModel()}
            </div>
          )}
        </div>

        {/* Right Panel: Preview */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Live Preview</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
            </div>
            <div
              className="p-8 flex items-center justify-center min-h-[300px] bg-[repeating-conic-gradient(#f3f4f6_0%_25%,white_0%_50%)] dark:bg-[repeating-conic-gradient(#1f2937_0%_25%,#111827_0%_50%)] bg-[length:20px_20px] overflow-auto transition-all"
              style={{
                maxWidth: viewport === 'desktop' ? '100%' : `${VIEWPORTS[viewport].width}px`,
                margin: viewport === 'desktop' ? undefined : '0 auto',
              }}
            >
              <motion.div
                key={classes + element}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {renderPreview()}
              </motion.div>
            </div>
          </div>

          {/* Try Example Button */}
          <button
            onClick={() => {
              setClasses('bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-blue-700 transition-all text-lg');
              setElement('button');
              setContent('Get Started');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 transition-all shadow-md"
          >
            <Play className="w-4 h-4" />
            Try Example
          </button>

          {/* CSS Output */}
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">CSS Output</span>
              <button
                onClick={copyCSSOutput}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors"
              >
                {copiedCSS ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                {copiedCSS ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
            <div className="p-4 max-h-[320px] overflow-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {css.split('\n').map((line, i) => {
                  const trimmed = line.trim();
                  if (trimmed.startsWith('.') || trimmed.startsWith('/*')) {
                    return <div key={i} className="text-purple-400">{line}</div>;
                  }
                  if (trimmed === '}') {
                    return <div key={i} className="text-purple-400">{line}</div>;
                  }
                  const colonIdx = trimmed.indexOf(':');
                  if (colonIdx > -1) {
                    const prop = line.substring(0, line.indexOf(':'));
                    const val = line.substring(line.indexOf(':'));
                    return (
                      <div key={i}>
                        <span className="text-cyan-400">{prop}</span>
                        <span className="text-gray-300">{val}</span>
                      </div>
                    );
                  }
                  return <div key={i} className="text-gray-300">{line}</div>;
                })}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Color Picker Modal */}
      <AnimatePresence>
        {showColorPicker && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {colorPickerPrefix === 'bg' ? 'Background' : colorPickerPrefix === 'text' ? 'Text' : 'Border'} Color
              </h3>
              <button onClick={() => setShowColorPicker(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Base colors */}
            <div className="flex gap-2 mb-3">
              {['white', 'black', 'transparent'].map(c => (
                <button
                  key={c}
                  onClick={() => { addClass(`${colorPickerPrefix}-${c}`); setShowColorPicker(false); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
            {/* Full palette */}
            <div className="space-y-1.5 max-h-[350px] overflow-y-auto">
              {COLOR_NAMES.map(color => (
                <div key={color} className="flex items-center gap-1">
                  <span className="text-[10px] font-mono text-gray-400 w-14 shrink-0 text-right pr-1">{color}</span>
                  <div className="flex gap-0.5">
                    {SHADES.map(shade => (
                      <button
                        key={shade}
                        onClick={() => { addClass(`${colorPickerPrefix}-${color}-${shade}`); setShowColorPicker(false); }}
                        className="w-6 h-6 rounded border border-gray-200 dark:border-gray-600 hover:scale-125 hover:z-10 transition-transform relative group"
                        style={{ backgroundColor: TAILWIND_COLORS[color][shade] }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                          {colorPickerPrefix}-{color}-{shade}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Badge */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 dark:text-gray-500 py-2">
        <Shield className="w-3 h-3" />
        All processing happens in your browser. Nothing is sent to any server.
      </div>
    </div>
  );
}
