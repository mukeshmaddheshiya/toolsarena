'use client';

import { useState, useCallback, useRef } from 'react';
import {
  FileText, Download, Copy, RotateCcw, Sparkles, ShieldCheck, Calendar, User, Building2, Briefcase, Hash,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES & CONSTANTS                                                   */
/* ------------------------------------------------------------------ */

type LetterType = 'standard' | 'grateful' | 'immediate' | 'short';
type Tone = 'formal' | 'warm' | 'brief';
type Reason = '' | 'better-opportunity' | 'personal' | 'higher-studies' | 'relocation' | 'health' | 'other';

interface FormData {
  yourName: string;
  designation: string;
  department: string;
  employeeId: string;
  managerName: string;
  managerDesignation: string;
  companyName: string;
  noticePeriodDays: number;
  lastWorkingDate: string;
  reason: Reason;
  tone: Tone;
}

const LETTER_TYPES: { key: LetterType; label: string }[] = [
  { key: 'standard', label: 'Standard' },
  { key: 'grateful', label: 'Grateful' },
  { key: 'immediate', label: 'Immediate' },
  { key: 'short', label: 'Short & Simple' },
];

const REASONS: { value: Reason; label: string }[] = [
  { value: '', label: 'Prefer not to mention' },
  { value: 'better-opportunity', label: 'Better opportunity' },
  { value: 'personal', label: 'Personal reasons' },
  { value: 'higher-studies', label: 'Higher studies' },
  { value: 'relocation', label: 'Relocation' },
  { value: 'health', label: 'Health reasons' },
  { value: 'other', label: 'Other' },
];

const NOTICE_OPTIONS = [15, 30, 60, 90];

const TONES: { key: Tone; label: string }[] = [
  { key: 'formal', label: 'Formal' },
  { key: 'warm', label: 'Warm' },
  { key: 'brief', label: 'Brief' },
];

function calcLWD(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function formatDate(iso: string): string {
  if (!iso) return '___________';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

const todayISO = new Date().toISOString().split('T')[0];

const defaultForm: FormData = {
  yourName: '', designation: '', department: '', employeeId: '',
  managerName: '', managerDesignation: '', companyName: '',
  noticePeriodDays: 30, lastWorkingDate: calcLWD(30), reason: '', tone: 'formal',
};

const exampleForm: FormData = {
  yourName: 'Rahul Sharma', designation: 'Senior Software Engineer', department: 'Engineering',
  employeeId: 'EMP-4521', managerName: 'Priya Mehta', managerDesignation: 'Engineering Manager',
  companyName: 'TechNova Solutions Pvt. Ltd.', noticePeriodDays: 30,
  lastWorkingDate: calcLWD(30), reason: 'better-opportunity', tone: 'formal',
};

/* ------------------------------------------------------------------ */
/*  LETTER GENERATION                                                   */
/* ------------------------------------------------------------------ */

function reasonText(reason: Reason, tone: Tone): string {
  const map: Record<string, string> = {
    'better-opportunity': 'I have received an opportunity that aligns closely with my long-term career aspirations',
    'personal': 'due to personal reasons that require my full attention',
    'higher-studies': 'as I have decided to pursue higher studies to further my professional development',
    'relocation': 'as I am relocating to a different city due to personal commitments',
    'health': 'due to health-related reasons that necessitate this change',
    'other': 'due to circumstances that require me to make this transition',
  };
  if (!reason) return '';
  const base = map[reason] || '';
  if (tone === 'brief') return base.split(',')[0];
  return base;
}

function generateLetter(type: LetterType, form: FormData): string {
  const n = form.yourName || '[Your Name]';
  const des = form.designation || '[Your Designation]';
  const dept = form.department || '[Department]';
  const empId = form.employeeId || '[Employee ID]';
  const mn = form.managerName || '[Manager Name]';
  const md = form.managerDesignation || '[Manager Designation]';
  const co = form.companyName || '[Company Name]';
  const lwd = formatDate(form.lastWorkingDate);
  const today = formatDate(todayISO);
  const rText = reasonText(form.reason, form.tone);
  const tone = form.tone;

  const header = `${today}\n\nTo,\n${mn}\n${md}\n${co}\n\nSubject: Resignation from the position of ${des}\n\nDear ${mn},\n\n`;
  const footer = `\nSincerely,\n${n}\n${des}, ${dept}\nEmployee ID: ${empId}`;

  if (type === 'short') {
    const body = `I am writing to formally notify you of my resignation from the position of ${des} at ${co}. My last working day will be ${lwd}.${rText ? `\n\n${rText.charAt(0).toUpperCase() + rText.slice(1)}.` : ''}\n\nI am happy to assist with the transition during my notice period. Thank you for the opportunity.`;
    return header + body + '\n' + footer;
  }

  if (type === 'immediate') {
    const apology = tone === 'formal'
      ? 'I sincerely apologize for the short notice and understand the inconvenience this may cause.'
      : tone === 'warm'
        ? 'I truly apologize for not being able to serve the standard notice period and understand the challenges this may present.'
        : 'I apologize for the short notice.';
    const reasonLine = rText ? ` ${rText.charAt(0).toUpperCase() + rText.slice(1)}, and` : '';
    const body = `I am writing to inform you of my resignation from the position of ${des} at ${co}, effective immediately.${reasonLine} the circumstances require me to step down without serving the standard notice period.\n\n${apology}\n\nI will ensure that all pending work, documents, and company assets are handed over promptly. I am available to brief my colleagues or replacement on ongoing projects to minimize disruption.\n\nI request you to kindly process my full and final settlement, including any pending salary, leave encashment, and other dues, at the earliest convenience.\n\nThank you for the opportunities and experiences during my tenure at ${co}. I wish the team and the organization continued success.`;
    return header + body + '\n' + footer;
  }

  if (type === 'grateful') {
    const reasonLine = rText ? `\n\n${rText.charAt(0).toUpperCase() + rText.slice(1)}.` : '';
    const warmth = tone === 'warm'
      ? `\n\nThe time I have spent at ${co} has been incredibly enriching both professionally and personally. The collaborative spirit of the team, the mentorship I received, and the challenging projects I got to work on have shaped me into a better professional. I will always cherish the relationships I have built here.`
      : `\n\nI have had the privilege of working with an exceptional team at ${co}. The professional growth, mentorship, and learning opportunities I received here have been invaluable to my career.`;
    const body = `I am writing to formally resign from my position as ${des} in the ${dept} department at ${co}. As per my notice period, my last working day will be ${lwd}.${reasonLine}${warmth}\n\nI am deeply grateful to you and the entire leadership team for your constant support and guidance. The skills and experiences I have gained here will remain with me throughout my career.\n\nDuring my notice period, I am committed to ensuring a smooth transition. I will complete all pending tasks, document my responsibilities, and assist in training my replacement if needed.\n\nThank you once again for everything. I look forward to staying in touch and wish ${co} continued success.`;
    return header + body + '\n' + footer;
  }

  // Standard
  const reasonLine = rText ? ` ${rText.charAt(0).toUpperCase() + rText.slice(1)}.` : '';
  const transitionLine = tone === 'formal'
    ? 'During my notice period, I shall ensure an orderly handover of all ongoing projects, documentation, and responsibilities to my successor or team members.'
    : tone === 'warm'
      ? 'During my notice period, I will do my best to ensure a smooth transition and am happy to assist in training whoever takes over my responsibilities.'
      : 'I will ensure a smooth handover during my notice period.';
  const body = `I am writing to formally tender my resignation from the position of ${des} in the ${dept} department at ${co}. In accordance with my notice period of ${form.noticePeriodDays} days, my last working day will be ${lwd}.${reasonLine}\n\n${transitionLine}\n\nI request you to kindly initiate the exit formalities and process the full and final settlement, including any pending salary, earned leave encashment, gratuity (if applicable), and other dues as per company policy.\n\nI appreciate the opportunities for professional growth that ${co} has provided me during my tenure. Thank you for your support and guidance.\n\nI wish the team and ${co} all the best going forward.`;
  return header + body + '\n' + footer;
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                           */
/* ------------------------------------------------------------------ */

export function ResignationLetterGeneratorTool() {
  const [form, setForm] = useState<FormData>({ ...defaultForm });
  const [letterType, setLetterType] = useState<LetterType>('standard');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const set = useCallback(<K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm(p => ({ ...p, [key]: val }));
  }, []);

  const handleNoticePeriod = useCallback((days: number) => {
    setForm(p => ({ ...p, noticePeriodDays: days, lastWorkingDate: calcLWD(days) }));
  }, []);

  const letterText = generateLetter(letterType, form);

  const copyText = useCallback(async () => {
    await navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [letterText]);

  const downloadPNG = useCallback(async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `resignation-letter-${form.yourName.replace(/\s+/g, '-').toLowerCase() || 'draft'}.png`;
      a.click();
    } finally { setDownloading(false); }
  }, [form.yourName]);

  const reset = useCallback(() => {
    setForm({ ...defaultForm });
    setLetterType('standard');
  }, []);

  const tryExample = useCallback(() => {
    setForm({ ...exampleForm });
    setLetterType('standard');
  }, []);

  /* ---- input helpers ---- */
  const inputCls = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-rose-500 dark:focus:ring-rose-900/30';
  const labelCls = 'mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400';

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ── Letter Type Segmented Control ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Letter Type</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LETTER_TYPES.map(t => (
            <button key={t.key} onClick={() => setLetterType(t.key)}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${letterType === t.key
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200 dark:shadow-rose-900/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── LEFT: Form ── */}
        <div className="space-y-5">
          {/* Your Details */}
          <fieldset className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <legend className="flex items-center gap-1.5 px-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4 text-rose-500" /> Your Details
            </legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Full Name</label>
                <input className={inputCls} placeholder="e.g. Rahul Sharma" value={form.yourName}
                  onChange={e => set('yourName', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}><Briefcase className="h-3 w-3" /> Designation</label>
                <input className={inputCls} placeholder="e.g. Senior Software Engineer" value={form.designation}
                  onChange={e => set('designation', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Department</label>
                <input className={inputCls} placeholder="e.g. Engineering" value={form.department}
                  onChange={e => set('department', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}><Hash className="h-3 w-3" /> Employee ID</label>
                <input className={inputCls} placeholder="e.g. EMP-4521" value={form.employeeId}
                  onChange={e => set('employeeId', e.target.value)} />
              </div>
            </div>
          </fieldset>

          {/* Manager & Company */}
          <fieldset className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <legend className="flex items-center gap-1.5 px-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              <Building2 className="h-4 w-4 text-rose-500" /> Manager & Company
            </legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Manager&apos;s Name</label>
                <input className={inputCls} placeholder="e.g. Priya Mehta" value={form.managerName}
                  onChange={e => set('managerName', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Manager&apos;s Designation</label>
                <input className={inputCls} placeholder="e.g. Engineering Manager" value={form.managerDesignation}
                  onChange={e => set('managerDesignation', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}><Building2 className="h-3 w-3" /> Company Name</label>
                <input className={inputCls} placeholder="e.g. TechNova Solutions Pvt. Ltd." value={form.companyName}
                  onChange={e => set('companyName', e.target.value)} />
              </div>
            </div>
          </fieldset>

          {/* Notice Period & LWD */}
          <fieldset className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <legend className="flex items-center gap-1.5 px-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              <Calendar className="h-4 w-4 text-rose-500" /> Notice Period & Last Working Date
            </legend>
            <div className="mt-2 space-y-3">
              {letterType !== 'immediate' && (
                <>
                  <div>
                    <label className={labelCls}>Notice Period</label>
                    <div className="flex gap-2">
                      {NOTICE_OPTIONS.map(d => (
                        <button key={d} onClick={() => handleNoticePeriod(d)}
                          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${form.noticePeriodDays === d
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
                          {d} days
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Last Working Date</label>
                    <input type="date" className={inputCls} value={form.lastWorkingDate} min={todayISO}
                      onChange={e => set('lastWorkingDate', e.target.value)} />
                  </div>
                  <div className="rounded-lg bg-rose-50 px-3 py-2 text-center text-sm font-medium text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                    Last working date: <span className="font-bold">{formatDate(form.lastWorkingDate)}</span>
                  </div>
                </>
              )}
              {letterType === 'immediate' && (
                <div className="rounded-lg bg-amber-50 px-3 py-2 text-center text-sm font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                  Immediate resignation — no notice period. Effective from today.
                </div>
              )}
            </div>
          </fieldset>

          {/* Reason & Tone */}
          <fieldset className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <legend className="flex items-center gap-1.5 px-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              <FileText className="h-4 w-4 text-rose-500" /> Reason & Tone
            </legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Reason for Leaving (optional)</label>
                <select className={inputCls} value={form.reason} onChange={e => set('reason', e.target.value as Reason)}>
                  {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Tone</label>
                <div className="flex gap-2">
                  {TONES.map(t => (
                    <button key={t.key} onClick={() => set('tone', t.key)}
                      className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${form.tone === t.key
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button onClick={tryExample}
              className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-200 transition hover:bg-rose-600 dark:shadow-rose-900/30">
              <Sparkles className="h-4 w-4" /> Try Example
            </button>
            <button onClick={reset}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        {/* ── RIGHT: Preview ── */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">Letter Preview</h2>
            <div className="flex gap-2">
              <button onClick={copyText}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                <Copy className="h-3.5 w-3.5" /> {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button onClick={downloadPNG} disabled={downloading}
                className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-600 disabled:opacity-50">
                <Download className="h-3.5 w-3.5" /> {downloading ? 'Saving...' : 'Download PNG'}
              </button>
            </div>
          </div>

          {/* Paper */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-5">
            <div ref={previewRef}
              className="mx-auto bg-white p-8 shadow-lg sm:p-12"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif", maxWidth: 680 }}>
              <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-gray-800 sm:text-[14px]"
                style={{ fontFamily: 'inherit' }}>
                {letterText}
              </pre>
            </div>
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50/60 py-3 text-xs text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
            <ShieldCheck className="h-4 w-4" />
            All processing happens in your browser. No data is sent to any server.
          </div>
        </div>
      </div>
    </div>
  );
}
