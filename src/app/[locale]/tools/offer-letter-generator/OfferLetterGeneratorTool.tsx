'use client';

import { useState, useRef, useCallback } from 'react';
import {
  FileText, Download, RotateCcw, Building2, User, Briefcase,
  IndianRupee, Calendar, Copy, Check, Shield, Sparkles, Eye,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface CompanyDetails {
  name: string;
  address: string;
  logoUrl: string;
  website: string;
}

interface CandidateDetails {
  fullName: string;
  email: string;
  phone: string;
}

interface PositionDetails {
  designation: string;
  department: string;
  reportingTo: string;
  workLocation: string;
}

interface CompensationDetails {
  annualCTC: string;
  basicPct: string;
  hraPct: string;
}

interface FormData {
  company: CompanyDetails;
  candidate: CandidateDetails;
  position: PositionDetails;
  compensation: CompensationDetails;
  joiningDate: string;
  offerExpiry: string;
  noticePeriod: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  probationPeriod: '3' | '6';
}

type TemplateStyle = 'formal' | 'modern' | 'minimal';

/* ------------------------------------------------------------------ */
/*  CTC BREAKDOWN                                                      */
/* ------------------------------------------------------------------ */

interface CTCBreakdown {
  basic: number;
  hra: number;
  pfEmployer: number;
  gratuity: number;
  specialAllowance: number;
  totalCTC: number;
}

function calculateCTC(ctc: number, basicPct: number, hraPct: number): CTCBreakdown {
  const basic = Math.round(ctc * basicPct / 100);
  const hra = Math.round(basic * hraPct / 100);
  const monthlyBasic = basic / 12;
  const pfEmployer = Math.round(Math.min(monthlyBasic * 0.12, 1800) * 12);
  const gratuity = Math.round(basic * 0.0481);
  const specialAllowance = Math.max(0, ctc - basic - hra - pfEmployer - gratuity);
  return { basic, hra, pfEmployer, gratuity, specialAllowance, totalCTC: ctc };
}

function formatINR(n: number): string {
  return n.toLocaleString('en-IN');
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '____________';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

/* ------------------------------------------------------------------ */
/*  DEFAULTS & EXAMPLES                                                */
/* ------------------------------------------------------------------ */

const defaultForm: FormData = {
  company: { name: '', address: '', logoUrl: '', website: '' },
  candidate: { fullName: '', email: '', phone: '' },
  position: { designation: '', department: '', reportingTo: '', workLocation: '' },
  compensation: { annualCTC: '', basicPct: '40', hraPct: '50' },
  joiningDate: '',
  offerExpiry: '',
  noticePeriod: '',
  employmentType: 'Full-time',
  probationPeriod: '6',
};

const exampleForm: FormData = {
  company: {
    name: 'TechNova Solutions Pvt. Ltd.',
    address: '4th Floor, Skyline Tower, Whitefield, Bengaluru, Karnataka 560066',
    logoUrl: '',
    website: 'www.technovasolutions.in',
  },
  candidate: { fullName: 'Priya Sharma', email: 'priya.sharma@gmail.com', phone: '+91 98765 43210' },
  position: {
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    reportingTo: 'Rahul Mehta, VP Engineering',
    workLocation: 'Bengaluru (Hybrid)',
  },
  compensation: { annualCTC: '1800000', basicPct: '40', hraPct: '50' },
  joiningDate: '2026-04-01',
  offerExpiry: '2026-03-20',
  noticePeriod: '30 days',
  employmentType: 'Full-time',
  probationPeriod: '6',
};

/* ------------------------------------------------------------------ */
/*  TEMPLATE CONFIGS                                                   */
/* ------------------------------------------------------------------ */

const templates: Record<TemplateStyle, { label: string; desc: string }> = {
  formal: { label: 'Formal', desc: 'Classic corporate look' },
  modern: { label: 'Modern', desc: 'Clean & contemporary' },
  minimal: { label: 'Minimal', desc: 'Simple & elegant' },
};

/* ------------------------------------------------------------------ */
/*  SECTION INPUT COMPONENT                                            */
/* ------------------------------------------------------------------ */

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-6 first:mt-0">
      <Icon className="w-4 h-4 text-blue-500" />
      <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 uppercase tracking-wide">{title}</h3>
    </div>
  );
}

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
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LETTER PREVIEW                                                     */
/* ------------------------------------------------------------------ */

function LetterPreview({ data, breakdown, template }: {
  data: FormData; breakdown: CTCBreakdown; template: TemplateStyle;
}) {
  const hasData = data.company.name || data.candidate.fullName;

  /* Style tokens per template */
  const tokens = {
    formal: {
      headerBg: '#1e3a5f', headerText: '#ffffff', accentColor: '#1e3a5f',
      bodyFont: 'Georgia, serif', borderStyle: '3px double #1e3a5f',
    },
    modern: {
      headerBg: '#2563eb', headerText: '#ffffff', accentColor: '#2563eb',
      bodyFont: "'Segoe UI', system-ui, sans-serif", borderStyle: '4px solid #2563eb',
    },
    minimal: {
      headerBg: '#f8fafc', headerText: '#1e293b', accentColor: '#475569',
      bodyFont: "'Segoe UI', system-ui, sans-serif", borderStyle: '2px solid #e2e8f0',
    },
  }[template];

  const tblBorder = '1px solid #cbd5e1';

  return (
    <div style={{
      fontFamily: tokens.bodyFont, color: '#1e293b', backgroundColor: '#ffffff',
      padding: '0', lineHeight: '1.7', fontSize: '13px', maxWidth: '100%',
    }}>
      {/* HEADER / LETTERHEAD */}
      <div style={{
        backgroundColor: tokens.headerBg, color: tokens.headerText,
        padding: '28px 36px', borderBottom: tokens.borderStyle,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '0.5px' }}>
              {data.company.name || 'Company Name'}
            </div>
            {data.company.website && (
              <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '2px' }}>{data.company.website}</div>
            )}
          </div>
          {data.company.logoUrl && (
            <img
              src={data.company.logoUrl}
              alt="Logo"
              style={{ height: '48px', maxWidth: '120px', objectFit: 'contain', borderRadius: '4px' }}
              crossOrigin="anonymous"
            />
          )}
        </div>
        {data.company.address && (
          <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '6px' }}>{data.company.address}</div>
        )}
      </div>

      {/* BODY */}
      <div style={{ padding: '32px 36px' }}>
        {/* Date & Ref */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '12px', color: '#64748b' }}>
          <span>Date: {formatDate(new Date().toISOString().split('T')[0])}</span>
          <span>Ref: OL/{new Date().getFullYear()}/{Math.floor(Math.random() * 9000 + 1000)}</span>
        </div>

        {/* Candidate Address */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontWeight: 600 }}>{data.candidate.fullName || 'Candidate Name'}</div>
          {data.candidate.email && <div style={{ fontSize: '12px', color: '#64748b' }}>{data.candidate.email}</div>}
          {data.candidate.phone && <div style={{ fontSize: '12px', color: '#64748b' }}>{data.candidate.phone}</div>}
        </div>

        {/* Subject */}
        <div style={{
          fontWeight: 700, fontSize: '15px', color: tokens.accentColor,
          borderBottom: `2px solid ${tokens.accentColor}`, paddingBottom: '6px', marginBottom: '20px',
        }}>
          Subject: Offer of Employment &mdash; {data.position.designation || 'Designation'}
        </div>

        {/* Greeting */}
        <p>Dear <strong>{data.candidate.fullName || 'Candidate'}</strong>,</p>

        <p>
          We are pleased to extend this offer of employment for the position of{' '}
          <strong>{data.position.designation || '[Designation]'}</strong> in the{' '}
          <strong>{data.position.department || '[Department]'}</strong> department at{' '}
          <strong>{data.company.name || '[Company]'}</strong>. We were impressed with your qualifications and believe
          you will be a valuable addition to our team.
        </p>

        {/* Key Details */}
        <div style={{
          backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px',
          padding: '16px 20px', margin: '20px 0',
        }}>
          <div style={{ fontWeight: 700, marginBottom: '10px', color: tokens.accentColor }}>Employment Details</div>
          <table style={{ width: '100%', fontSize: '12.5px', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Designation', data.position.designation],
                ['Department', data.position.department],
                ['Reporting To', data.position.reportingTo],
                ['Work Location', data.position.workLocation],
                ['Employment Type', data.employmentType],
                ['Date of Joining', formatDate(data.joiningDate)],
                ['Probation Period', `${data.probationPeriod} months`],
              ].filter(([, v]) => v).map(([k, v], i) => (
                <tr key={i}>
                  <td style={{ padding: '4px 0', fontWeight: 600, width: '40%', color: '#475569' }}>{k}</td>
                  <td style={{ padding: '4px 0' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTC Breakdown */}
        <div style={{ fontWeight: 700, marginBottom: '10px', color: tokens.accentColor }}>
          Compensation Details (Annual)
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: tokens.accentColor, color: '#fff' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', border: tblBorder }}>Component</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', border: tblBorder }}>Annual (INR)</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', border: tblBorder }}>Monthly (INR)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Basic Salary', breakdown.basic],
              ['House Rent Allowance (HRA)', breakdown.hra],
              ['Special Allowance', breakdown.specialAllowance],
              ['PF (Employer Contribution)', breakdown.pfEmployer],
              ['Gratuity', breakdown.gratuity],
            ].map(([label, val], i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                <td style={{ padding: '6px 12px', border: tblBorder }}>{label as string}</td>
                <td style={{ padding: '6px 12px', border: tblBorder, textAlign: 'right', fontFamily: 'monospace' }}>
                  {formatINR(val as number)}
                </td>
                <td style={{ padding: '6px 12px', border: tblBorder, textAlign: 'right', fontFamily: 'monospace' }}>
                  {formatINR(Math.round((val as number) / 12))}
                </td>
              </tr>
            ))}
            <tr style={{ fontWeight: 700, backgroundColor: '#e0e7ff' }}>
              <td style={{ padding: '8px 12px', border: tblBorder }}>Total Cost to Company (CTC)</td>
              <td style={{ padding: '8px 12px', border: tblBorder, textAlign: 'right', fontFamily: 'monospace' }}>
                {formatINR(breakdown.totalCTC)}
              </td>
              <td style={{ padding: '8px 12px', border: tblBorder, textAlign: 'right', fontFamily: 'monospace' }}>
                {formatINR(Math.round(breakdown.totalCTC / 12))}
              </td>
            </tr>
          </tbody>
        </table>

        {data.noticePeriod && (
          <p>
            As discussed, you are required to serve a notice period of <strong>{data.noticePeriod}</strong> at your
            current organization before joining us.
          </p>
        )}

        {/* Terms */}
        <div style={{ fontWeight: 700, marginBottom: '10px', marginTop: '20px', color: tokens.accentColor }}>
          Terms &amp; Conditions
        </div>
        <ol style={{ paddingLeft: '20px', fontSize: '12px', color: '#475569' }}>
          <li style={{ marginBottom: '6px' }}>
            This offer is contingent upon successful completion of background verification and submission of all
            required documents.
          </li>
          <li style={{ marginBottom: '6px' }}>
            You will be on probation for a period of <strong>{data.probationPeriod} months</strong> from the date of
            joining. Your performance will be reviewed at the end of the probation period.
          </li>
          <li style={{ marginBottom: '6px' }}>
            You are expected to maintain confidentiality regarding all proprietary and business-sensitive information.
          </li>
          <li style={{ marginBottom: '6px' }}>
            Your employment is governed by the company&apos;s policies and the applicable Indian labour laws.
          </li>
          <li style={{ marginBottom: '6px' }}>
            The compensation mentioned above is subject to applicable income tax deductions as per the Income Tax Act, 1961.
          </li>
          <li style={{ marginBottom: '6px' }}>
            This offer stands valid until <strong>{formatDate(data.offerExpiry)}</strong>. Failure to accept by this
            date will result in automatic withdrawal of the offer.
          </li>
        </ol>

        <p style={{ marginTop: '20px' }}>
          We look forward to welcoming you to the {data.company.name || '[Company]'} family. Please sign and return a
          copy of this letter as acceptance of this offer.
        </p>

        <p>Warm regards,</p>

        {/* Signature */}
        <div style={{ marginTop: '40px' }}>
          <div style={{ borderTop: '1px solid #94a3b8', width: '200px', paddingTop: '8px' }}>
            <div style={{ fontWeight: 600 }}>Authorized Signatory</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{data.company.name || 'Company Name'}</div>
          </div>
        </div>

        {/* Candidate Acceptance */}
        <div style={{
          marginTop: '40px', padding: '16px 20px', border: '1px dashed #94a3b8', borderRadius: '8px',
          backgroundColor: '#fafbfc',
        }}>
          <div style={{ fontWeight: 700, marginBottom: '10px', color: tokens.accentColor }}>Candidate Acceptance</div>
          <p style={{ fontSize: '12px', margin: '0 0 16px' }}>
            I, {data.candidate.fullName || '____________'}, accept the terms and conditions outlined in this offer
            letter and confirm my joining date as {formatDate(data.joiningDate)}.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', marginTop: '24px' }}>
            <div>
              <div style={{ borderTop: '1px solid #94a3b8', width: '180px', paddingTop: '6px', fontSize: '12px', color: '#64748b' }}>
                Signature
              </div>
            </div>
            <div>
              <div style={{ borderTop: '1px solid #94a3b8', width: '140px', paddingTop: '6px', fontSize: '12px', color: '#64748b' }}>
                Date
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        textAlign: 'center', fontSize: '10px', color: '#94a3b8', padding: '12px 36px',
        borderTop: '1px solid #e2e8f0',
      }}>
        This is a system-generated document. &bull; {data.company.name} &bull; {data.company.address}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function OfferLetterGeneratorTool() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [template, setTemplate] = useState<TemplateStyle>('formal');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);

  /* helpers to update nested form */
  const setCompany = useCallback((patch: Partial<CompanyDetails>) => {
    setForm(f => ({ ...f, company: { ...f.company, ...patch } }));
  }, []);
  const setCandidate = useCallback((patch: Partial<CandidateDetails>) => {
    setForm(f => ({ ...f, candidate: { ...f.candidate, ...patch } }));
  }, []);
  const setPosition = useCallback((patch: Partial<PositionDetails>) => {
    setForm(f => ({ ...f, position: { ...f.position, ...patch } }));
  }, []);
  const setComp = useCallback((patch: Partial<CompensationDetails>) => {
    setForm(f => ({ ...f, compensation: { ...f.compensation, ...patch } }));
  }, []);

  const ctc = parseFloat(form.compensation.annualCTC) || 0;
  const basicPct = parseFloat(form.compensation.basicPct) || 40;
  const hraPct = parseFloat(form.compensation.hraPct) || 50;
  const breakdown = calculateCTC(ctc, basicPct, hraPct);

  /* Download PNG */
  const handleDownload = useCallback(async () => {
    if (!hiddenRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(hiddenRef.current, {
        scale: 2, useCORS: true, backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `Offer_Letter_${form.candidate.fullName?.replace(/\s+/g, '_') || 'draft'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [form.candidate.fullName]);

  /* Copy text */
  const handleCopy = useCallback(() => {
    if (!previewRef.current) return;
    const text = previewRef.current.innerText;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  /* Reset */
  const handleReset = useCallback(() => {
    setForm(defaultForm);
    setTemplate('formal');
  }, []);

  /* Try Example */
  const handleExample = useCallback(() => {
    setForm(exampleForm);
    setTemplate('modern');
  }, []);

  return (
    <div className="space-y-6">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Template picker */}
        <div className="flex gap-2">
          {(Object.entries(templates) as [TemplateStyle, { label: string; desc: string }][]).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setTemplate(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                template === key
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400'
              }`}
              title={t.desc}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <button onClick={handleExample} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors">
          <Sparkles className="w-3.5 h-3.5" /> Try Example
        </button>
        <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Mobile preview toggle */}
      <button
        onClick={() => setShowPreview(p => !p)}
        className="lg:hidden w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium text-sm"
      >
        <Eye className="w-4 h-4" />
        {showPreview ? 'Show Form' : 'Preview Letter'}
      </button>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: FORM */}
        <div className={`space-y-1 ${showPreview ? 'hidden lg:block' : ''}`}>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
            {/* Company */}
            <SectionTitle icon={Building2} title="Company Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Company Name *" value={form.company.name} onChange={v => setCompany({ name: v })} placeholder="TechNova Solutions Pvt. Ltd." />
              <Input label="Website" value={form.company.website} onChange={v => setCompany({ website: v })} placeholder="www.company.in" />
            </div>
            <Input label="Address" value={form.company.address} onChange={v => setCompany({ address: v })} placeholder="Full company address" />
            <Input label="Logo URL (optional)" value={form.company.logoUrl} onChange={v => setCompany({ logoUrl: v })} placeholder="https://..." />

            {/* Candidate */}
            <SectionTitle icon={User} title="Candidate Details" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="Full Name *" value={form.candidate.fullName} onChange={v => setCandidate({ fullName: v })} placeholder="Priya Sharma" />
              <Input label="Email" value={form.candidate.email} onChange={v => setCandidate({ email: v })} placeholder="priya@email.com" type="email" />
              <Input label="Phone" value={form.candidate.phone} onChange={v => setCandidate({ phone: v })} placeholder="+91 98765 43210" />
            </div>

            {/* Position */}
            <SectionTitle icon={Briefcase} title="Position Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Designation *" value={form.position.designation} onChange={v => setPosition({ designation: v })} placeholder="Senior Software Engineer" />
              <Input label="Department" value={form.position.department} onChange={v => setPosition({ department: v })} placeholder="Engineering" />
              <Input label="Reporting To" value={form.position.reportingTo} onChange={v => setPosition({ reportingTo: v })} placeholder="Manager Name, Title" />
              <Input label="Work Location" value={form.position.workLocation} onChange={v => setPosition({ workLocation: v })} placeholder="Bengaluru (Hybrid)" />
            </div>

            {/* Compensation */}
            <SectionTitle icon={IndianRupee} title="Compensation" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="Annual CTC (INR) *" value={form.compensation.annualCTC} onChange={v => setComp({ annualCTC: v })} placeholder="1800000" type="number" />
              <Input label="Basic Salary %" value={form.compensation.basicPct} onChange={v => setComp({ basicPct: v })} placeholder="40" type="number" />
              <Input label="HRA (% of Basic)" value={form.compensation.hraPct} onChange={v => setComp({ hraPct: v })} placeholder="50" type="number" />
            </div>
            {ctc > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-1">
                <div className="font-medium text-blue-700 dark:text-blue-300 mb-1">Auto-calculated Breakdown (Annual):</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                  <span>Basic: INR {formatINR(breakdown.basic)}</span>
                  <span>HRA: INR {formatINR(breakdown.hra)}</span>
                  <span>PF (Employer): INR {formatINR(breakdown.pfEmployer)}</span>
                  <span>Gratuity: INR {formatINR(breakdown.gratuity)}</span>
                  <span className="col-span-2 font-medium">Special Allowance: INR {formatINR(breakdown.specialAllowance)}</span>
                </div>
              </div>
            )}

            {/* Dates & Misc */}
            <SectionTitle icon={Calendar} title="Other Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Joining Date *" value={form.joiningDate} onChange={v => setForm(f => ({ ...f, joiningDate: v }))} type="date" />
              <Input label="Offer Expiry Date" value={form.offerExpiry} onChange={v => setForm(f => ({ ...f, offerExpiry: v }))} type="date" />
              <Input label="Notice Period" value={form.noticePeriod} onChange={v => setForm(f => ({ ...f, noticePeriod: v }))} placeholder="30 days / Immediate" />
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Employment Type</label>
                <select
                  value={form.employmentType}
                  onChange={e => setForm(f => ({ ...f, employmentType: e.target.value as FormData['employmentType'] }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Intern</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Probation Period</label>
              <div className="flex gap-3">
                {(['3', '6'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setForm(f => ({ ...f, probationPeriod: m }))}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      form.probationPeriod === m
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400'
                    }`}
                  >
                    {m} months
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 py-3">
            <Shield className="w-3.5 h-3.5 text-green-500" />
            Your data stays in your browser &mdash; nothing is sent to any server.
          </div>
        </div>

        {/* RIGHT: PREVIEW */}
        <div className={`${!showPreview ? 'hidden lg:block' : ''}`}>
          <div className="sticky top-4 space-y-3">
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Generating...' : 'Download PNG'}
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>

            {/* Visible preview */}
            <div
              ref={previewRef}
              className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
              style={{ maxHeight: '80vh', overflowY: 'auto' }}
            >
              <LetterPreview data={form} breakdown={breakdown} template={template} />
            </div>
          </div>
        </div>
      </div>

      {/* HIDDEN full-size render target for html2canvas */}
      <div
        style={{ position: 'absolute', left: '-9999px', top: 0, width: '800px' }}
        aria-hidden="true"
      >
        <div ref={hiddenRef}>
          <LetterPreview data={form} breakdown={breakdown} template={template} />
        </div>
      </div>
    </div>
  );
}
