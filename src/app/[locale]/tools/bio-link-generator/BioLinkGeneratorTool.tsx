'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Link2, Download, RotateCcw, Shield, Plus, Trash2, GripVertical,
  Copy, Check, Sparkles, Palette, Type, Image, ExternalLink,
  Instagram, Twitter, Youtube, Linkedin, Github, Mail, Globe,
  Music2, User, FileText, ShoppingBag, Camera, Coffee, BookOpen,
  Gamepad2, Headphones, Podcast, Rocket, Heart, Star, Zap
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface BioLink {
  id: string;
  title: string;
  url: string;
  icon: string;
}

interface SocialLinks {
  instagram: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
  github: string;
  email: string;
}

interface ProfileData {
  name: string;
  bio: string;
  avatarUrl: string;
}

type ThemeId = 'minimal-light' | 'minimal-dark' | 'gradient-sunset' | 'gradient-ocean' | 'neon' | 'pastel' | 'professional' | 'glassmorphism';
type ButtonStyle = 'rounded' | 'pill' | 'outline' | 'filled' | 'shadow';
type FontFamily = 'sans' | 'serif' | 'mono' | 'rounded' | 'display';

interface Theme {
  id: ThemeId;
  name: string;
  bg: string;
  text: string;
  subtext: string;
  buttonBg: string;
  buttonText: string;
  buttonBorder: string;
  preview: string;
}

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const ICON_OPTIONS: { label: string; value: string; icon: React.ReactNode }[] = [
  { label: 'Link', value: 'link', icon: <Link2 size={14} /> },
  { label: 'Globe', value: 'globe', icon: <Globe size={14} /> },
  { label: 'Shopping', value: 'shopping', icon: <ShoppingBag size={14} /> },
  { label: 'Camera', value: 'camera', icon: <Camera size={14} /> },
  { label: 'Music', value: 'music', icon: <Music2 size={14} /> },
  { label: 'Coffee', value: 'coffee', icon: <Coffee size={14} /> },
  { label: 'Book', value: 'book', icon: <BookOpen size={14} /> },
  { label: 'Game', value: 'game', icon: <Gamepad2 size={14} /> },
  { label: 'Headphones', value: 'headphones', icon: <Headphones size={14} /> },
  { label: 'Podcast', value: 'podcast', icon: <Podcast size={14} /> },
  { label: 'Rocket', value: 'rocket', icon: <Rocket size={14} /> },
  { label: 'Heart', value: 'heart', icon: <Heart size={14} /> },
  { label: 'Star', value: 'star', icon: <Star size={14} /> },
  { label: 'File', value: 'file', icon: <FileText size={14} /> },
  { label: 'Zap', value: 'zap', icon: <Zap size={14} /> },
];

const THEMES: Theme[] = [
  { id: 'minimal-light', name: 'Minimal Light', bg: '#ffffff', text: '#1a1a2e', subtext: '#6b7280', buttonBg: '#f3f4f6', buttonText: '#1a1a2e', buttonBorder: '#e5e7eb', preview: 'bg-white border border-gray-200' },
  { id: 'minimal-dark', name: 'Minimal Dark', bg: '#0f0f23', text: '#e2e8f0', subtext: '#94a3b8', buttonBg: '#1e1e3f', buttonText: '#e2e8f0', buttonBorder: '#334155', preview: 'bg-[#0f0f23] border border-gray-700' },
  { id: 'gradient-sunset', name: 'Gradient Sunset', bg: 'linear-gradient(135deg, #f97316, #ec4899, #a855f7)', text: '#ffffff', subtext: 'rgba(255,255,255,0.8)', buttonBg: 'rgba(255,255,255,0.2)', buttonText: '#ffffff', buttonBorder: 'rgba(255,255,255,0.3)', preview: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500' },
  { id: 'gradient-ocean', name: 'Gradient Ocean', bg: 'linear-gradient(135deg, #0ea5e9, #06b6d4, #10b981)', text: '#ffffff', subtext: 'rgba(255,255,255,0.8)', buttonBg: 'rgba(255,255,255,0.2)', buttonText: '#ffffff', buttonBorder: 'rgba(255,255,255,0.3)', preview: 'bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500' },
  { id: 'neon', name: 'Neon', bg: '#0a0a0a', text: '#39ff14', subtext: '#00ffff', buttonBg: 'transparent', buttonText: '#39ff14', buttonBorder: '#39ff14', preview: 'bg-black border border-green-400' },
  { id: 'pastel', name: 'Pastel', bg: 'linear-gradient(135deg, #fce7f3, #e0e7ff, #dbeafe)', text: '#4c1d95', subtext: '#7c3aed', buttonBg: 'rgba(255,255,255,0.7)', buttonText: '#4c1d95', buttonBorder: '#c4b5fd', preview: 'bg-gradient-to-br from-pink-100 via-indigo-100 to-blue-100' },
  { id: 'professional', name: 'Professional', bg: '#f8fafc', text: '#0f172a', subtext: '#475569', buttonBg: '#0f172a', buttonText: '#f8fafc', buttonBorder: '#0f172a', preview: 'bg-slate-50 border border-slate-300' },
  { id: 'glassmorphism', name: 'Glassmorphism', bg: 'linear-gradient(135deg, #667eea, #764ba2)', text: '#ffffff', subtext: 'rgba(255,255,255,0.7)', buttonBg: 'rgba(255,255,255,0.15)', buttonText: '#ffffff', buttonBorder: 'rgba(255,255,255,0.25)', preview: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
];

const BUTTON_STYLES: { id: ButtonStyle; name: string }[] = [
  { id: 'rounded', name: 'Rounded' },
  { id: 'pill', name: 'Pill' },
  { id: 'outline', name: 'Outline' },
  { id: 'filled', name: 'Filled' },
  { id: 'shadow', name: 'Shadow' },
];

const FONTS: { id: FontFamily; name: string; css: string }[] = [
  { id: 'sans', name: 'Sans', css: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
  { id: 'serif', name: 'Serif', css: "Georgia, 'Times New Roman', serif" },
  { id: 'mono', name: 'Mono', css: "'SF Mono', 'Fira Code', monospace" },
  { id: 'rounded', name: 'Rounded', css: "'Nunito', 'Varela Round', system-ui, sans-serif" },
  { id: 'display', name: 'Display', css: "'Playfair Display', Georgia, serif" },
];

const FONT_CLASS: Record<FontFamily, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  rounded: 'font-sans',
  display: 'font-serif',
};

const EXAMPLE_DATA: { profile: ProfileData; links: BioLink[]; socials: SocialLinks } = {
  profile: { name: 'Alex Rivera', bio: 'Digital creator & designer. Building cool stuff on the internet.', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex' },
  links: [
    { id: '1', title: 'My Portfolio', url: 'https://alexrivera.design', icon: 'rocket' },
    { id: '2', title: 'Latest YouTube Video', url: 'https://youtube.com/@alexrivera', icon: 'music' },
    { id: '3', title: 'Buy Me a Coffee', url: 'https://buymeacoffee.com/alex', icon: 'coffee' },
    { id: '4', title: 'Free Design Resources', url: 'https://gumroad.com/alex', icon: 'star' },
    { id: '5', title: 'Read My Blog', url: 'https://alexrivera.blog', icon: 'book' },
  ],
  socials: { instagram: 'https://instagram.com/alexrivera', twitter: 'https://x.com/alexrivera', youtube: 'https://youtube.com/@alexrivera', tiktok: '', linkedin: 'https://linkedin.com/in/alexrivera', github: 'https://github.com/alexrivera', email: 'alex@example.com' },
};

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 9);

function getLinkIconSvg(icon: string): string {
  const svgs: Record<string, string> = {
    link: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    globe: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    shopping: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    camera: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
    music: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    coffee: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1"/><path d="M6 2v2"/></svg>',
    book: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
    game: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>',
    headphones: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>',
    podcast: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 11.1V6a5 5 0 0 0-10 0v5"/><circle cx="12" cy="12" r="2"/><path d="M12 14v7"/></svg>',
    rocket: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>',
    heart: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    star: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    file: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',
    zap: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>',
  };
  return svgs[icon] || svgs.link;
}

function getIconComponent(icon: string) {
  const map: Record<string, React.ReactNode> = {
    link: <Link2 size={14} />, globe: <Globe size={14} />, shopping: <ShoppingBag size={14} />,
    camera: <Camera size={14} />, music: <Music2 size={14} />, coffee: <Coffee size={14} />,
    book: <BookOpen size={14} />, game: <Gamepad2 size={14} />, headphones: <Headphones size={14} />,
    podcast: <Podcast size={14} />, rocket: <Rocket size={14} />, heart: <Heart size={14} />,
    star: <Star size={14} />, file: <FileText size={14} />, zap: <Zap size={14} />,
  };
  return map[icon] || map.link;
}

function socialSvg(type: string): string {
  const svgs: Record<string, string> = {
    instagram: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',
    twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>',
    youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>',
    tiktok: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>',
    linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
    github: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
    email: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  };
  return svgs[type] || '';
}

/* ------------------------------------------------------------------ */
/*  HTML GENERATOR                                                     */
/* ------------------------------------------------------------------ */

function generateHTML(profile: ProfileData, links: BioLink[], socials: SocialLinks, theme: Theme, btnStyle: ButtonStyle, accent: string, font: typeof FONTS[number]): string {
  const btnRadius = btnStyle === 'pill' ? '9999px' : btnStyle === 'rounded' || btnStyle === 'shadow' ? '12px' : '4px';
  const btnBg = btnStyle === 'outline' ? 'transparent' : btnStyle === 'filled' ? accent : theme.buttonBg;
  const btnBorder = btnStyle === 'outline' ? `2px solid ${accent}` : `1px solid ${theme.buttonBorder}`;
  const btnColor = btnStyle === 'filled' ? '#ffffff' : btnStyle === 'outline' ? accent : theme.buttonText;
  const btnShadow = btnStyle === 'shadow' ? '0 4px 14px rgba(0,0,0,0.15)' : 'none';
  const neonGlow = theme.id === 'neon' ? `0 0 10px ${accent}, 0 0 20px ${accent}40` : btnShadow;
  const bgStyle = theme.bg.includes('gradient') ? `background: ${theme.bg};` : `background-color: ${theme.bg};`;
  const glassBtn = theme.id === 'glassmorphism' ? 'backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);' : '';

  const activeSocials = Object.entries(socials).filter(([, v]) => v.trim());
  const socialHtml = activeSocials.map(([key, url]) => {
    const href = key === 'email' ? `mailto:${url}` : url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:${theme.text};opacity:0.7;transition:opacity 0.2s" onmouseover="this.style.opacity='1';this.style.color='${accent}'" onmouseout="this.style.opacity='0.7';this.style.color='${theme.text}'">${socialSvg(key)}</a>`;
  }).join('\n            ');

  const linksHtml = links.map(l => `
          <a href="${l.url}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:10px;padding:14px 20px;border-radius:${btnRadius};background:${btnBg};color:${btnColor};border:${btnBorder};text-decoration:none;font-weight:500;font-size:15px;transition:all 0.2s;box-shadow:${neonGlow};${glassBtn}" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='${neonGlow}'">
            ${getLinkIconSvg(l.icon)}
            <span>${l.title}</span>
          </a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:title" content="${profile.name} - Links">
  <meta property="og:description" content="${profile.bio}">
  <title>${profile.name} - Links</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { min-height: 100vh; ${bgStyle} font-family: ${font.css}; display: flex; justify-content: center; align-items: flex-start; padding: 40px 16px; }
    .container { max-width: 420px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .avatar { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; border: 3px solid ${accent}; }
    .avatar-placeholder { width: 96px; height: 96px; border-radius: 50%; background: ${accent}; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 36px; font-weight: 700; }
    .name { font-size: 22px; font-weight: 700; color: ${theme.text}; text-align: center; }
    .bio { font-size: 14px; color: ${theme.subtext}; text-align: center; max-width: 320px; line-height: 1.5; }
    .links { width: 100%; display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
    .socials { display: flex; gap: 16px; margin-top: 16px; justify-content: center; flex-wrap: wrap; }
    .footer { margin-top: 24px; font-size: 12px; color: ${theme.subtext}; opacity: 0.5; }
  </style>
</head>
<body>
  <div class="container">
    ${profile.avatarUrl
      ? `<img class="avatar" src="${profile.avatarUrl}" alt="${profile.name}" onerror="this.style.display='none'">`
      : `<div class="avatar-placeholder">${profile.name.charAt(0).toUpperCase()}</div>`}
    <div class="name">${profile.name}</div>
    ${profile.bio ? `<div class="bio">${profile.bio}</div>` : ''}
    <div class="links">
${linksHtml}
    </div>
    ${activeSocials.length ? `<div class="socials">${socialHtml}</div>` : ''}
  </div>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function BioLinkGeneratorTool() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'profile' | 'links' | 'socials' | 'style'>('profile');

  // Data
  const [profile, setProfile] = useState<ProfileData>({ name: '', bio: '', avatarUrl: '' });
  const [links, setLinks] = useState<BioLink[]>([]);
  const [socials, setSocials] = useState<SocialLinks>({ instagram: '', twitter: '', youtube: '', tiktok: '', linkedin: '', github: '', email: '' });

  // Style
  const [themeId, setThemeId] = useState<ThemeId>('minimal-light');
  const [btnStyle, setBtnStyle] = useState<ButtonStyle>('rounded');
  const [accent, setAccent] = useState('#8b5cf6');
  const [fontId, setFontId] = useState<FontFamily>('sans');

  const theme = THEMES.find(t => t.id === themeId)!;
  const font = FONTS.find(f => f.id === fontId)!;

  const addLink = useCallback(() => {
    setLinks(prev => [...prev, { id: uid(), title: '', url: '', icon: 'link' }]);
  }, []);

  const updateLink = useCallback((id: string, field: keyof BioLink, value: string) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  }, []);

  const removeLink = useCallback((id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
  }, []);

  const loadExample = useCallback(() => {
    setProfile(EXAMPLE_DATA.profile);
    setLinks(EXAMPLE_DATA.links.map(l => ({ ...l, id: uid() })));
    setSocials(EXAMPLE_DATA.socials);
    setThemeId('gradient-sunset');
    setBtnStyle('pill');
    setAccent('#f97316');
    setFontId('rounded');
  }, []);

  const resetAll = useCallback(() => {
    setProfile({ name: '', bio: '', avatarUrl: '' });
    setLinks([]);
    setSocials({ instagram: '', twitter: '', youtube: '', tiktok: '', linkedin: '', github: '', email: '' });
    setThemeId('minimal-light');
    setBtnStyle('rounded');
    setAccent('#8b5cf6');
    setFontId('sans');
  }, []);

  const html = generateHTML(profile, links, socials, theme, btnStyle, accent, font);

  const downloadHTML = useCallback(() => {
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(profile.name || 'bio-link').replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [html, profile.name]);

  const copyHTML = useCallback(async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [html]);

  const downloadPNG = useCallback(async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import('html2canvas-pro')).default;
    const canvas = await html2canvas(previewRef.current, { backgroundColor: null, scale: 2 });
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${(profile.name || 'bio-link').replace(/\s+/g, '-').toLowerCase()}.png`;
    a.click();
  }, [profile.name]);

  // Button style helpers for preview
  const btnRadius = btnStyle === 'pill' ? '9999px' : btnStyle === 'rounded' || btnStyle === 'shadow' ? '12px' : '4px';
  const btnBg = btnStyle === 'outline' ? 'transparent' : btnStyle === 'filled' ? accent : theme.buttonBg;
  const btnBorder = btnStyle === 'outline' ? `2px solid ${accent}` : `1px solid ${theme.buttonBorder}`;
  const btnColor = btnStyle === 'filled' ? '#ffffff' : btnStyle === 'outline' ? accent : theme.buttonText;
  const btnShadow = btnStyle === 'shadow' ? '0 4px 14px rgba(0,0,0,0.15)' : theme.id === 'neon' ? `0 0 8px ${accent}80` : 'none';
  const glassBackdrop = theme.id === 'glassmorphism' ? 'backdrop-blur-md' : '';
  const bgIsGradient = theme.bg.includes('gradient');

  const activeSocials = Object.entries(socials).filter(([, v]) => v.trim());
  const SOCIAL_ICONS: Record<string, React.ReactNode> = {
    instagram: <Instagram size={16} />, twitter: <Twitter size={16} />, youtube: <Youtube size={16} />,
    tiktok: <Music2 size={16} />, linkedin: <Linkedin size={16} />, github: <Github size={16} />, email: <Mail size={16} />,
  };

  const editorTabs = [
    { id: 'profile' as const, label: 'Profile', icon: <User size={15} /> },
    { id: 'links' as const, label: 'Links', icon: <Link2 size={15} /> },
    { id: 'socials' as const, label: 'Social', icon: <Instagram size={15} /> },
    { id: 'style' as const, label: 'Style', icon: <Palette size={15} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.95 }} onClick={loadExample}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors">
            <Sparkles size={15} /> Try Example
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={resetAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <RotateCcw size={15} /> Reset
          </motion.button>
        </div>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.95 }} onClick={downloadHTML}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors">
            <Download size={15} /> HTML
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={downloadPNG}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors">
            <Image size={15} /> PNG
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={copyHTML}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy HTML</>}
          </motion.button>
        </div>
      </div>

      {/* Main layout: Editor + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── EDITOR PANEL ───────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            {editorTabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors
                  ${tab === t.id ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                {t.icon} <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* PROFILE TAB */}
              {tab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</span>
                    <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Your name"
                      className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</span>
                    <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="A short bio about yourself" rows={3}
                      className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition resize-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avatar URL</span>
                    <input value={profile.avatarUrl} onChange={e => setProfile(p => ({ ...p, avatarUrl: e.target.value }))} placeholder="https://example.com/photo.jpg"
                      className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition" />
                  </label>
                </motion.div>
              )}

              {/* LINKS TAB */}
              {tab === 'links' && (
                <motion.div key="links" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                  <Reorder.Group axis="y" values={links} onReorder={setLinks} className="space-y-3">
                    {links.map(link => (
                      <Reorder.Item key={link.id} value={link}
                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 space-y-2">
                        <div className="flex items-center gap-2">
                          <GripVertical size={16} className="text-gray-400 cursor-grab shrink-0" />
                          <select value={link.icon} onChange={e => updateLink(link.id, 'icon', e.target.value)}
                            className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 outline-none shrink-0">
                            {ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                          <button onClick={() => removeLink(link.id)} className="ml-auto text-red-400 hover:text-red-600 transition-colors shrink-0">
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <input value={link.title} onChange={e => updateLink(link.id, 'title', e.target.value)} placeholder="Link title"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-violet-500 transition" />
                        <input value={link.url} onChange={e => updateLink(link.id, 'url', e.target.value)} placeholder="https://..."
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-violet-500 transition" />
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={addLink}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-sm font-medium hover:border-violet-400 hover:text-violet-500 transition-colors">
                    <Plus size={16} /> Add Link
                  </motion.button>
                </motion.div>
              )}

              {/* SOCIALS TAB */}
              {tab === 'socials' && (
                <motion.div key="socials" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                  {([
                    { key: 'instagram', label: 'Instagram', icon: <Instagram size={16} />, ph: 'https://instagram.com/username' },
                    { key: 'twitter', label: 'Twitter / X', icon: <Twitter size={16} />, ph: 'https://x.com/username' },
                    { key: 'youtube', label: 'YouTube', icon: <Youtube size={16} />, ph: 'https://youtube.com/@channel' },
                    { key: 'tiktok', label: 'TikTok', icon: <Music2 size={16} />, ph: 'https://tiktok.com/@username' },
                    { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16} />, ph: 'https://linkedin.com/in/username' },
                    { key: 'github', label: 'GitHub', icon: <Github size={16} />, ph: 'https://github.com/username' },
                    { key: 'email', label: 'Email', icon: <Mail size={16} />, ph: 'you@email.com' },
                  ] as const).map(s => (
                    <label key={s.key} className="flex items-center gap-3">
                      <span className="text-gray-500 dark:text-gray-400 shrink-0">{s.icon}</span>
                      <input value={socials[s.key]} onChange={e => setSocials(prev => ({ ...prev, [s.key]: e.target.value }))} placeholder={s.ph}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-violet-500 transition" />
                    </label>
                  ))}
                </motion.div>
              )}

              {/* STYLE TAB */}
              {tab === 'style' && (
                <motion.div key="style" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                  {/* Theme */}
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Theme</span>
                    <div className="grid grid-cols-4 gap-2">
                      {THEMES.map(t => (
                        <button key={t.id} onClick={() => setThemeId(t.id)}
                          className={`relative rounded-xl h-14 ${t.preview} transition-all ${themeId === t.id ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-gray-900' : 'hover:scale-105'}`}>
                          <span className="absolute inset-x-0 bottom-0 text-[9px] font-medium text-center pb-1 truncate px-1"
                            style={{ color: t.text }}>{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Button Style */}
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Button Style</span>
                    <div className="flex gap-2 flex-wrap">
                      {BUTTON_STYLES.map(b => (
                        <button key={b.id} onClick={() => setBtnStyle(b.id)}
                          className={`px-4 py-2 text-sm rounded-lg border transition-all ${btnStyle === b.id
                            ? 'bg-violet-600 text-white border-violet-600'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-violet-400'}`}>
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Accent Color</span>
                    <div className="flex items-center gap-3">
                      <input type="color" value={accent} onChange={e => setAccent(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                      <input value={accent} onChange={e => setAccent(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 font-mono outline-none focus:ring-2 focus:ring-violet-500 transition" />
                    </div>
                  </div>

                  {/* Font */}
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Font</span>
                    <div className="flex gap-2 flex-wrap">
                      {FONTS.map(f => (
                        <button key={f.id} onClick={() => setFontId(f.id)}
                          className={`px-4 py-2 text-sm rounded-lg border transition-all ${FONT_CLASS[f.id]} ${fontId === f.id
                            ? 'bg-violet-600 text-white border-violet-600'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-violet-400'}`}>
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── PHONE MOCKUP PREVIEW ───────────────────────────────────── */}
        <div className="flex justify-center items-start lg:sticky lg:top-24">
          <div ref={previewRef} className="relative">
            {/* Phone frame */}
            <div className="relative w-[320px] h-[640px] rounded-[48px] border-[6px] border-gray-900 dark:border-gray-700 bg-gray-900 dark:bg-gray-700 shadow-2xl overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-gray-900 dark:bg-gray-700 rounded-b-2xl z-20" />
              {/* Status bar */}
              <div className="absolute top-[6px] left-6 right-6 flex justify-between items-center z-20 text-[10px] font-semibold" style={{ color: theme.text }}>
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="4" width="2" height="6" rx="0.5"/><rect x="3" y="3" width="2" height="7" rx="0.5"/><rect x="6" y="1" width="2" height="9" rx="0.5"/><rect x="9" y="0" width="2" height="10" rx="0.5"/></svg>
                  <svg width="16" height="10" viewBox="0 0 24 12" fill="currentColor"><rect x="0" y="1" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/><rect x="21" y="3.5" width="2" height="5" rx="1"/><rect x="2" y="3" width="14" height="6" rx="1"/></svg>
                </div>
              </div>

              {/* Content */}
              <div className={`absolute inset-0 overflow-y-auto pt-10 pb-6 px-5 ${FONT_CLASS[fontId]}`}
                style={bgIsGradient ? { background: theme.bg } : { backgroundColor: theme.bg }}>
                <div className="flex flex-col items-center gap-3 mt-4">
                  {/* Avatar */}
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover"
                      style={{ border: `3px solid ${accent}` }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ backgroundColor: accent }}>
                      {profile.name ? profile.name.charAt(0).toUpperCase() : <User size={28} />}
                    </div>
                  )}

                  {/* Name */}
                  <div className="text-lg font-bold text-center leading-tight" style={{ color: theme.text }}>
                    {profile.name || 'Your Name'}
                  </div>

                  {/* Bio */}
                  {(profile.bio || !profile.name) && (
                    <div className="text-xs text-center leading-relaxed max-w-[240px]" style={{ color: theme.subtext }}>
                      {profile.bio || 'Your bio goes here'}
                    </div>
                  )}

                  {/* Links */}
                  <div className="w-full flex flex-col gap-2.5 mt-2">
                    {links.length === 0 && (
                      <div className="text-center py-6 text-xs" style={{ color: theme.subtext, opacity: 0.6 }}>
                        Add links in the editor
                      </div>
                    )}
                    {links.map(link => (
                      <motion.div key={link.id} layout
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer hover:scale-[1.02] ${glassBackdrop}`}
                        style={{
                          borderRadius: btnRadius, background: btnBg, color: btnColor,
                          border: btnBorder, boxShadow: btnShadow,
                        }}>
                        <span className="shrink-0">{getIconComponent(link.icon)}</span>
                        <span className="truncate">{link.title || 'Untitled Link'}</span>
                        <ExternalLink size={12} className="ml-auto shrink-0 opacity-40" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Social icons */}
                  {activeSocials.length > 0 && (
                    <div className="flex gap-3 mt-4 flex-wrap justify-center">
                      {activeSocials.map(([key]) => (
                        <div key={key} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                          style={{ color: theme.text }}>
                          {SOCIAL_ICONS[key]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Phone reflection */}
            <div className="absolute -inset-1 rounded-[52px] bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Trust badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-4">
        <Shield size={14} />
        <span>100% client-side. Nothing is uploaded or stored.</span>
      </div>
    </div>
  );
}
