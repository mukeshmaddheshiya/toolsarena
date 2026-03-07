'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import {
  AtSign, Copy, Code2, RotateCcw, Sparkles, Shield, Check,
  User, Briefcase, Building2, Phone, Mail, Globe, Linkedin,
  Twitter, Github, Instagram, Facebook, Youtube, Link2,
  Palette, Monitor, Smartphone, ChevronDown, ChevronUp,
  Image as ImageIcon, MousePointerClick,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface FormData {
  fullName: string;
  jobTitle: string;
  company: string;
  department: string;
  email: string;
  phone: string;
  mobile: string;
  website: string;
  photoUrl: string;
  logoUrl: string;
  linkedin: string;
  twitter: string;
  github: string;
  instagram: string;
  facebook: string;
  youtube: string;
  ctaText: string;
  ctaUrl: string;
  primaryColor: string;
  textColor: string;
}

type TemplateId = 'classic' | 'modern' | 'compact' | 'corporate' | 'creative' | 'minimal';

interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
  icon: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const EMPTY_FORM: FormData = {
  fullName: '', jobTitle: '', company: '', department: '',
  email: '', phone: '', mobile: '', website: '',
  photoUrl: '', logoUrl: '',
  linkedin: '', twitter: '', github: '', instagram: '', facebook: '', youtube: '',
  ctaText: '', ctaUrl: '',
  primaryColor: '#f97316', textColor: '#1f2937',
};

const EXAMPLE_DATA: FormData = {
  fullName: 'Priya Sharma',
  jobTitle: 'Senior Product Designer',
  company: 'ToolsArena',
  department: 'Design Team',
  email: 'priya@toolsarena.in',
  phone: '+91 98765 43210',
  mobile: '+91 91234 56789',
  website: 'https://toolsarena.in',
  photoUrl: 'https://i.pravatar.cc/128?img=47',
  logoUrl: '',
  linkedin: 'https://linkedin.com/in/priyasharma',
  twitter: 'https://x.com/priyasharma',
  github: 'https://github.com/priyasharma',
  instagram: '',
  facebook: '',
  youtube: '',
  ctaText: 'Book a Meeting',
  ctaUrl: 'https://calendly.com/priya',
  primaryColor: '#f97316',
  textColor: '#1f2937',
};

const TEMPLATES: TemplateOption[] = [
  { id: 'classic', name: 'Classic', description: 'Photo left, info right, horizontal divider', icon: <Monitor size={18} /> },
  { id: 'modern', name: 'Modern', description: 'Bold name, minimal layout', icon: <Sparkles size={18} /> },
  { id: 'compact', name: 'Compact', description: 'Single line, icon-based socials', icon: <Smartphone size={18} /> },
  { id: 'corporate', name: 'Corporate', description: 'Logo-heavy, structured layout', icon: <Building2 size={18} /> },
  { id: 'creative', name: 'Creative', description: 'Colorful accent bar, rounded photo', icon: <Palette size={18} /> },
  { id: 'minimal', name: 'Minimal', description: 'Text-only, clean typography', icon: <Code2 size={18} /> },
];

const SOCIAL_ICON_BASE = 'https://cdn.simpleicons.org';

/* ------------------------------------------------------------------ */
/*  SOCIAL ICON HELPER                                                 */
/* ------------------------------------------------------------------ */

function socialIconUrl(platform: string, color: string): string {
  const hex = color.replace('#', '');
  const map: Record<string, string> = {
    linkedin: 'linkedin',
    twitter: 'x',
    github: 'github',
    instagram: 'instagram',
    facebook: 'facebook',
    youtube: 'youtube',
  };
  return `${SOCIAL_ICON_BASE}/${map[platform] || platform}/${hex}`;
}

/* ------------------------------------------------------------------ */
/*  SIGNATURE HTML GENERATORS                                          */
/* ------------------------------------------------------------------ */

function buildSocialsHtml(d: FormData, iconSize: number = 18): string {
  const socials = [
    { key: 'linkedin', url: d.linkedin },
    { key: 'twitter', url: d.twitter },
    { key: 'github', url: d.github },
    { key: 'instagram', url: d.instagram },
    { key: 'facebook', url: d.facebook },
    { key: 'youtube', url: d.youtube },
  ].filter(s => s.url.trim());

  if (!socials.length) return '';

  return socials.map(s =>
    `<a href="${s.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;margin-right:6px;"><img src="${socialIconUrl(s.key, d.primaryColor)}" alt="${s.key}" width="${iconSize}" height="${iconSize}" style="border:0;display:inline-block;vertical-align:middle;" /></a>`
  ).join('');
}

function buildCtaHtml(d: FormData): string {
  if (!d.ctaText.trim() || !d.ctaUrl.trim()) return '';
  return `<a href="${d.ctaUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:8px 18px;background-color:${d.primaryColor};color:#ffffff;text-decoration:none;border-radius:4px;font-size:13px;font-weight:600;font-family:Arial,sans-serif;mso-padding-alt:8px 18px;">${d.ctaText}</a>`;
}

function contactLine(icon: string, value: string, href?: string, color?: string): string {
  if (!value.trim()) return '';
  const c = color || '#555555';
  const text = href
    ? `<a href="${href}" style="color:${c};text-decoration:none;font-size:13px;font-family:Arial,sans-serif;">${value}</a>`
    : `<span style="color:${c};font-size:13px;font-family:Arial,sans-serif;">${value}</span>`;
  return `<tr><td style="padding:2px 0;vertical-align:middle;font-size:13px;font-family:Arial,sans-serif;color:${c};">${icon} ${text}</td></tr>`;
}

function generateSignatureHtml(d: FormData, template: TemplateId): string {
  const pc = d.primaryColor;
  const tc = d.textColor;
  const hasPhoto = d.photoUrl.trim();
  const hasLogo = d.logoUrl.trim();
  const socialsHtml = buildSocialsHtml(d);
  const ctaHtml = buildCtaHtml(d);

  const phoneLines = [
    d.phone ? contactLine('&#128222;', d.phone, `tel:${d.phone.replace(/\s/g, '')}`, tc) : '',
    d.mobile ? contactLine('&#128241;', d.mobile, `tel:${d.mobile.replace(/\s/g, '')}`, tc) : '',
  ].join('');

  const emailLine = d.email ? contactLine('&#9993;', d.email, `mailto:${d.email}`, tc) : '';
  const webLine = d.website ? contactLine('&#127760;', d.website.replace(/^https?:\/\//, ''), d.website, tc) : '';

  const contactBlock = `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${emailLine}${phoneLines}${webLine}</table>`;

  const photoHtml = hasPhoto
    ? `<img src="${d.photoUrl}" alt="${d.fullName}" width="80" height="80" style="border-radius:${template === 'creative' ? '50%' : '4px'};display:block;border:0;object-fit:cover;" />`
    : '';

  const logoHtml = hasLogo
    ? `<img src="${d.logoUrl}" alt="${d.company}" width="120" height="40" style="display:block;border:0;object-fit:contain;" />`
    : '';

  const nameStyle = `font-size:18px;font-weight:700;color:${tc};font-family:Arial,sans-serif;margin:0;padding:0;`;
  const titleStyle = `font-size:13px;color:${pc};font-family:Arial,sans-serif;margin:0;padding:2px 0 0 0;`;
  const companyStyle = `font-size:13px;color:#777777;font-family:Arial,sans-serif;margin:0;padding:0;`;

  const nameBlock = `<p style="${nameStyle}">${d.fullName || 'Your Name'}</p>` +
    (d.jobTitle ? `<p style="${titleStyle}">${d.jobTitle}</p>` : '') +
    (d.company ? `<p style="${companyStyle}">${d.company}${d.department ? ` | ${d.department}` : ''}</p>` : '');

  switch (template) {
    case 'classic':
      return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,sans-serif;max-width:500px;">
  <tr>
    ${hasPhoto ? `<td style="vertical-align:top;padding-right:14px;">${photoHtml}</td>` : ''}
    <td style="vertical-align:top;">
      ${nameBlock}
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:8px;border-top:2px solid ${pc};padding-top:8px;">
        <tr><td style="padding-top:8px;">
          ${contactBlock}
          ${socialsHtml ? `<div style="margin-top:8px;">${socialsHtml}</div>` : ''}
          ${ctaHtml ? `<div style="margin-top:10px;">${ctaHtml}</div>` : ''}
        </td></tr>
      </table>
    </td>
  </tr>
  ${hasLogo ? `<tr><td colspan="2" style="padding-top:10px;">${logoHtml}</td></tr>` : ''}
</table>`;

    case 'modern':
      return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,sans-serif;max-width:500px;">
  <tr><td style="padding-bottom:6px;">
    <p style="font-size:22px;font-weight:800;color:${tc};margin:0;font-family:Arial,sans-serif;">${d.fullName || 'Your Name'}</p>
    ${d.jobTitle ? `<p style="font-size:14px;color:${pc};margin:4px 0 0 0;font-weight:600;font-family:Arial,sans-serif;">${d.jobTitle}</p>` : ''}
    ${d.company ? `<p style="font-size:12px;color:#999;margin:2px 0 0 0;text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif;">${d.company}</p>` : ''}
  </td>
  ${hasPhoto ? `<td style="vertical-align:top;padding-left:16px;"><img src="${d.photoUrl}" alt="${d.fullName}" width="70" height="70" style="border-radius:8px;display:block;border:0;object-fit:cover;" /></td>` : ''}
  </tr>
  <tr><td colspan="2" style="padding:10px 0 8px 0;">
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>
      ${d.email ? `<td style="padding-right:14px;font-size:13px;color:${tc};font-family:Arial,sans-serif;"><a href="mailto:${d.email}" style="color:${tc};text-decoration:none;">${d.email}</a></td>` : ''}
      ${d.phone ? `<td style="padding-right:14px;font-size:13px;color:${tc};font-family:Arial,sans-serif;">${d.phone}</td>` : ''}
      ${d.website ? `<td style="font-size:13px;font-family:Arial,sans-serif;"><a href="${d.website}" style="color:${pc};text-decoration:none;">${d.website.replace(/^https?:\/\//, '')}</a></td>` : ''}
    </tr></table>
  </td></tr>
  ${socialsHtml || ctaHtml ? `<tr><td colspan="2" style="padding-top:6px;">
    ${socialsHtml ? `<span style="margin-right:12px;">${socialsHtml}</span>` : ''}
    ${ctaHtml || ''}
  </td></tr>` : ''}
  ${hasLogo ? `<tr><td colspan="2" style="padding-top:12px;">${logoHtml}</td></tr>` : ''}
</table>`;

    case 'compact':
      return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,sans-serif;max-width:500px;">
  <tr>
    ${hasPhoto ? `<td style="vertical-align:middle;padding-right:10px;"><img src="${d.photoUrl}" alt="${d.fullName}" width="50" height="50" style="border-radius:50%;display:block;border:0;object-fit:cover;" /></td>` : ''}
    <td style="vertical-align:middle;">
      <span style="font-size:15px;font-weight:700;color:${tc};font-family:Arial,sans-serif;">${d.fullName || 'Your Name'}</span>
      ${d.jobTitle ? `<span style="color:#999;font-size:13px;font-family:Arial,sans-serif;"> &middot; ${d.jobTitle}</span>` : ''}
      ${d.company ? `<span style="color:#999;font-size:13px;font-family:Arial,sans-serif;"> &middot; ${d.company}</span>` : ''}
      <br/>
      <span style="font-size:12px;color:${tc};font-family:Arial,sans-serif;">
        ${d.email ? `<a href="mailto:${d.email}" style="color:${tc};text-decoration:none;">${d.email}</a>` : ''}
        ${d.phone ? ` &middot; ${d.phone}` : ''}
        ${d.website ? ` &middot; <a href="${d.website}" style="color:${pc};text-decoration:none;">${d.website.replace(/^https?:\/\//, '')}</a>` : ''}
      </span>
    </td>
    ${socialsHtml ? `<td style="vertical-align:middle;padding-left:12px;">${socialsHtml}</td>` : ''}
  </tr>
  ${ctaHtml || hasLogo ? `<tr><td colspan="3" style="padding-top:8px;">
    ${hasLogo ? `<span style="margin-right:12px;">${logoHtml}</span>` : ''}
    ${ctaHtml || ''}
  </td></tr>` : ''}
</table>`;

    case 'corporate':
      return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,sans-serif;max-width:520px;border-left:4px solid ${pc};padding-left:14px;">
  <tr>
    <td style="vertical-align:top;padding-right:16px;">
      ${hasLogo ? `<div style="margin-bottom:10px;">${logoHtml}</div>` : ''}
      ${nameBlock}
    </td>
    ${hasPhoto ? `<td style="vertical-align:top;">${photoHtml}</td>` : ''}
  </tr>
  <tr><td colspan="2" style="padding-top:10px;border-top:1px solid #e5e5e5;margin-top:8px;">
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:8px;">
      <tr>
        ${d.email ? `<td style="padding-right:18px;font-size:13px;color:${tc};font-family:Arial,sans-serif;">&#9993; <a href="mailto:${d.email}" style="color:${tc};text-decoration:none;">${d.email}</a></td>` : ''}
        ${d.phone ? `<td style="padding-right:18px;font-size:13px;color:${tc};font-family:Arial,sans-serif;">&#128222; ${d.phone}</td>` : ''}
      </tr>
      ${d.website || d.mobile ? `<tr>
        ${d.website ? `<td style="padding-right:18px;padding-top:4px;font-size:13px;font-family:Arial,sans-serif;">&#127760; <a href="${d.website}" style="color:${pc};text-decoration:none;">${d.website.replace(/^https?:\/\//, '')}</a></td>` : ''}
        ${d.mobile ? `<td style="padding-top:4px;font-size:13px;color:${tc};font-family:Arial,sans-serif;">&#128241; ${d.mobile}</td>` : ''}
      </tr>` : ''}
    </table>
  </td></tr>
  ${socialsHtml || ctaHtml ? `<tr><td colspan="2" style="padding-top:10px;">
    ${socialsHtml ? `<span>${socialsHtml}</span>` : ''}
    ${ctaHtml ? `<span style="margin-left:8px;">${ctaHtml}</span>` : ''}
  </td></tr>` : ''}
</table>`;

    case 'creative':
      return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,sans-serif;max-width:500px;">
  <tr><td colspan="2" style="height:4px;background:linear-gradient(90deg,${pc},#8b5cf6);border-radius:2px;"></td></tr>
  <tr>
    ${hasPhoto ? `<td style="vertical-align:top;padding:12px 14px 0 0;"><img src="${d.photoUrl}" alt="${d.fullName}" width="85" height="85" style="border-radius:50%;display:block;border:3px solid ${pc};object-fit:cover;" /></td>` : ''}
    <td style="vertical-align:top;padding-top:12px;">
      <p style="font-size:20px;font-weight:700;color:${tc};margin:0;font-family:Arial,sans-serif;">${d.fullName || 'Your Name'}</p>
      ${d.jobTitle ? `<p style="font-size:14px;color:${pc};margin:3px 0 0 0;font-family:Arial,sans-serif;font-weight:600;">${d.jobTitle}</p>` : ''}
      ${d.company ? `<p style="font-size:12px;color:#888;margin:2px 0 0 0;font-family:Arial,sans-serif;">${d.company}${d.department ? ` &mdash; ${d.department}` : ''}</p>` : ''}
      <div style="margin-top:8px;">
        ${contactBlock}
      </div>
    </td>
  </tr>
  ${socialsHtml || ctaHtml || hasLogo ? `<tr><td colspan="2" style="padding-top:10px;">
    ${socialsHtml || ''}
    ${ctaHtml ? `<span style="margin-left:6px;">${ctaHtml}</span>` : ''}
    ${hasLogo ? `<div style="margin-top:8px;">${logoHtml}</div>` : ''}
  </td></tr>` : ''}
</table>`;

    case 'minimal':
    default:
      return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,sans-serif;max-width:420px;">
  <tr><td>
    <p style="font-size:16px;font-weight:700;color:${tc};margin:0;font-family:Arial,sans-serif;">${d.fullName || 'Your Name'}</p>
    ${d.jobTitle || d.company ? `<p style="font-size:13px;color:#777;margin:3px 0 0 0;font-family:Arial,sans-serif;">${[d.jobTitle, d.company].filter(Boolean).join(' | ')}</p>` : ''}
    <p style="font-size:13px;color:${tc};margin:6px 0 0 0;font-family:Arial,sans-serif;">
      ${[d.email && `<a href="mailto:${d.email}" style="color:${tc};text-decoration:none;">${d.email}</a>`, d.phone, d.website && `<a href="${d.website}" style="color:${pc};text-decoration:none;">${d.website.replace(/^https?:\/\//, '')}</a>`].filter(Boolean).join(' &middot; ')}
    </p>
    ${socialsHtml ? `<div style="margin-top:8px;">${socialsHtml}</div>` : ''}
    ${ctaHtml ? `<div style="margin-top:8px;">${ctaHtml}</div>` : ''}
  </td></tr>
</table>`;
  }
}

/* ------------------------------------------------------------------ */
/*  SECTION WRAPPER                                                    */
/* ------------------------------------------------------------------ */

function Section({ title, icon, children, defaultOpen = true }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
      >
        <span className="flex items-center gap-2">{icon} {title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="px-4 py-3 space-y-3">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  INPUT COMPONENT                                                    */
/* ------------------------------------------------------------------ */

function Input({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-shadow"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  INSTRUCTION TABS                                                   */
/* ------------------------------------------------------------------ */

const INSTRUCTIONS: { tab: string; steps: string[] }[] = [
  {
    tab: 'Gmail',
    steps: [
      'Open Gmail and click the gear icon (Settings).',
      'Click "See all settings".',
      'Scroll down to the "Signature" section.',
      'Click "Create new" and give it a name.',
      'Click the signature text area, then press Ctrl+A (Cmd+A on Mac) and paste your copied signature.',
      'Scroll down and click "Save Changes".',
    ],
  },
  {
    tab: 'Outlook',
    steps: [
      'Open Outlook, go to File > Options > Mail > Signatures.',
      'Click "New" and name your signature.',
      'In the edit box, press Ctrl+A then paste your copied signature.',
      'Choose it as default for new messages and/or replies.',
      'Click OK to save.',
    ],
  },
  {
    tab: 'Apple Mail',
    steps: [
      'Open Mail, go to Mail > Settings > Signatures.',
      'Click the + button to create a new signature.',
      'Uncheck "Always match my default message font".',
      'Paste your copied signature into the preview area.',
      'Drag the signature to the desired email account.',
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function EmailSignatureGeneratorTool() {
  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM });
  const [template, setTemplate] = useState<TemplateId>('classic');
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedRich, setCopiedRich] = useState(false);
  const [instructionTab, setInstructionTab] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  const update = useCallback((key: keyof FormData, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
  }, []);

  const signatureHtml = useMemo(() => generateSignatureHtml(form, template), [form, template]);

  const hasContent = form.fullName.trim() || form.email.trim();

  /* copy raw HTML */
  const copyHtml = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(signatureHtml);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } catch { /* fallback */ }
  }, [signatureHtml]);

  /* copy rendered HTML (rich text) */
  const copyRich = useCallback(async () => {
    try {
      const blob = new Blob([signatureHtml], { type: 'text/html' });
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/html': blob, 'text/plain': new Blob([signatureHtml], { type: 'text/plain' }) }),
      ]);
      setCopiedRich(true);
      setTimeout(() => setCopiedRich(false), 2000);
    } catch {
      /* fallback — select and copy from DOM */
      if (previewRef.current) {
        const range = document.createRange();
        range.selectNodeContents(previewRef.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        document.execCommand('copy');
        sel?.removeAllRanges();
        setCopiedRich(true);
        setTimeout(() => setCopiedRich(false), 2000);
      }
    }
  }, [signatureHtml]);

  const tryExample = () => setForm({ ...EXAMPLE_DATA });
  const reset = () => { setForm({ ...EMPTY_FORM }); setTemplate('classic'); };

  return (
    <div className="space-y-6">
      {/* ---- HEADER ---- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AtSign className="text-orange-500" size={22} /> Email Signature Generator
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create professional HTML signatures that work in every email client.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={tryExample} className="px-3 py-2 text-sm font-medium rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50 transition-colors flex items-center gap-1.5">
            <Sparkles size={15} /> Try Example
          </button>
          <button onClick={reset} className="px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5">
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>

      {/* ---- TRUST BADGE ---- */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
        <Shield size={14} className="text-green-600 dark:text-green-400 shrink-0" />
        100% private — your data never leaves your browser. No signup required.
      </div>

      {/* ---- MAIN GRID ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ======== LEFT: FORM ======== */}
        <div className="space-y-4">
          {/* Template Picker */}
          <Section title="Template Style" icon={<Palette size={16} />}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 text-xs transition-all ${
                    template === t.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {t.icon}
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-[10px] leading-tight text-center opacity-70">{t.description}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* Personal */}
          <Section title="Personal Info" icon={<User size={16} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Full Name" value={form.fullName} onChange={v => update('fullName', v)} placeholder="Priya Sharma" />
              <Input label="Job Title" value={form.jobTitle} onChange={v => update('jobTitle', v)} placeholder="Product Designer" />
              <Input label="Company" value={form.company} onChange={v => update('company', v)} placeholder="ToolsArena" />
              <Input label="Department" value={form.department} onChange={v => update('department', v)} placeholder="Design Team" />
            </div>
          </Section>

          {/* Contact */}
          <Section title="Contact Details" icon={<Mail size={16} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Email" value={form.email} onChange={v => update('email', v)} placeholder="priya@company.com" type="email" />
              <Input label="Phone" value={form.phone} onChange={v => update('phone', v)} placeholder="+91 98765 43210" type="tel" />
              <Input label="Mobile" value={form.mobile} onChange={v => update('mobile', v)} placeholder="+91 91234 56789" type="tel" />
              <Input label="Website" value={form.website} onChange={v => update('website', v)} placeholder="https://company.com" type="url" />
            </div>
          </Section>

          {/* Photo & Logo */}
          <Section title="Photo & Logo" icon={<ImageIcon size={16} />} defaultOpen={false}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Photo URL" value={form.photoUrl} onChange={v => update('photoUrl', v)} placeholder="https://example.com/photo.jpg" type="url" />
              <Input label="Company Logo URL" value={form.logoUrl} onChange={v => update('logoUrl', v)} placeholder="https://example.com/logo.png" type="url" />
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">Tip: Upload images to imgur.com or imgbb.com first, then paste the direct URL here.</p>
          </Section>

          {/* Social Links */}
          <Section title="Social Links" icon={<Link2 size={16} />} defaultOpen={false}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="LinkedIn" value={form.linkedin} onChange={v => update('linkedin', v)} placeholder="https://linkedin.com/in/..." />
              <Input label="Twitter / X" value={form.twitter} onChange={v => update('twitter', v)} placeholder="https://x.com/..." />
              <Input label="GitHub" value={form.github} onChange={v => update('github', v)} placeholder="https://github.com/..." />
              <Input label="Instagram" value={form.instagram} onChange={v => update('instagram', v)} placeholder="https://instagram.com/..." />
              <Input label="Facebook" value={form.facebook} onChange={v => update('facebook', v)} placeholder="https://facebook.com/..." />
              <Input label="YouTube" value={form.youtube} onChange={v => update('youtube', v)} placeholder="https://youtube.com/@..." />
            </div>
          </Section>

          {/* CTA Button */}
          <Section title="CTA Button" icon={<MousePointerClick size={16} />} defaultOpen={false}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Button Text" value={form.ctaText} onChange={v => update('ctaText', v)} placeholder="Book a Meeting" />
              <Input label="Button URL" value={form.ctaUrl} onChange={v => update('ctaUrl', v)} placeholder="https://calendly.com/you" type="url" />
            </div>
          </Section>

          {/* Colors */}
          <Section title="Colors" icon={<Palette size={16} />} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Primary / Accent</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.primaryColor} onChange={e => update('primaryColor', e.target.value)} className="w-9 h-9 rounded cursor-pointer border border-gray-300 dark:border-gray-600" />
                  <input type="text" value={form.primaryColor} onChange={e => update('primaryColor', e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 font-mono focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.textColor} onChange={e => update('textColor', e.target.value)} className="w-9 h-9 rounded cursor-pointer border border-gray-300 dark:border-gray-600" />
                  <input type="text" value={form.textColor} onChange={e => update('textColor', e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 font-mono focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* ======== RIGHT: PREVIEW + ACTIONS ======== */}
        <div className="space-y-4">
          {/* Live Preview */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Live Preview</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">{TEMPLATES.find(t => t.id === template)?.name}</span>
            </div>
            <div className="p-6 bg-white dark:bg-gray-900 min-h-[180px]">
              <div ref={previewRef} dangerouslySetInnerHTML={{ __html: signatureHtml }} />
            </div>
          </div>

          {/* Copy Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={copyRich}
              disabled={!hasContent}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-colors bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copiedRich ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy to Clipboard</>}
            </button>
            <button
              onClick={copyHtml}
              disabled={!hasContent}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-colors bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copiedHtml ? <><Check size={16} /> Copied!</> : <><Code2 size={16} /> Copy HTML</>}
            </button>
          </div>

          {/* Raw HTML Preview */}
          <details className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden group">
            <summary className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 text-sm font-semibold text-gray-700 dark:text-gray-200 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
              View Raw HTML
            </summary>
            <pre className="p-4 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 overflow-x-auto max-h-64 whitespace-pre-wrap break-all font-mono">
              {signatureHtml}
            </pre>
          </details>

          {/* Instructions */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">How to Add Your Signature</span>
            </div>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {INSTRUCTIONS.map((inst, i) => (
                <button
                  key={inst.tab}
                  onClick={() => setInstructionTab(i)}
                  className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors ${
                    instructionTab === i
                      ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500 bg-orange-50/50 dark:bg-orange-900/10'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {inst.tab}
                </button>
              ))}
            </div>
            <ol className="p-4 space-y-2 text-sm text-gray-600 dark:text-gray-300 list-decimal list-inside">
              {INSTRUCTIONS[instructionTab].steps.map((step, i) => (
                <li key={i} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200 space-y-1">
            <p className="font-semibold">Pro Tips:</p>
            <ul className="list-disc list-inside text-xs space-y-1 text-amber-700 dark:text-amber-300">
              <li><strong>Copy to Clipboard</strong> pastes the formatted signature — best for Gmail.</li>
              <li><strong>Copy HTML</strong> gives you raw code — useful for Outlook desktop or HTML editors.</li>
              <li>Use a publicly hosted image URL for your photo (e.g., imgur, imgbb).</li>
              <li>Keep your signature under 10 KB for best deliverability.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
