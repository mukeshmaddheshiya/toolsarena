'use client';

import { useState, useRef, useCallback, useEffect, forwardRef } from 'react';
import {
  Building2, User, Calendar, Download, RotateCcw, Copy, ShieldCheck,
  FileText, Award, Briefcase, Hash, Sparkles,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type LetterType = 'experience' | 'relieving';
type Rating = 'excellent' | 'good' | 'satisfactory';
type Reason = 'resignation' | 'contract_end' | 'mutual';

interface CompanyInfo {
  name: string;
  address: string;
  hrName: string;
  hrDesignation: string;
}

interface EmployeeInfo {
  name: string;
  employeeId: string;
  designation: string;
  department: string;
}

interface LetterData {
  letterType: LetterType;
  company: CompanyInfo;
  employee: EmployeeInfo;
  joiningDate: string;
  lastWorkingDate: string;
  rating: Rating;
  reason: Reason;
  issueDate: string;
  refNumber: string;
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function today() {
  return new Date().toISOString().slice(0, 10);
}

function generateRef() {
  const yr = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `HR/EXP/${yr}/${num}`;
}

function formatDate(d: string) {
  if (!d) return '___________';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function calcDuration(from: string, to: string): string {
  if (!from || !to) return '';
  const a = new Date(from + 'T00:00:00');
  const b = new Date(to + 'T00:00:00');
  if (b <= a) return '';
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  if (b.getDate() < a.getDate()) months--;
  if (months < 0) return '';
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y > 0) parts.push(`${y} year${y > 1 ? 's' : ''}`);
  if (m > 0) parts.push(`${m} month${m > 1 ? 's' : ''}`);
  return parts.join(' and ') || 'less than a month';
}

const ratingPhrases: Record<Rating, { adj: string; body: string }> = {
  excellent: {
    adj: 'an exceptionally talented and dedicated professional',
    body: 'demonstrated outstanding performance consistently throughout the tenure. Their commitment to excellence, proactive approach, and ability to deliver results beyond expectations have been truly commendable. They have been an invaluable asset to the organisation.',
  },
  good: {
    adj: 'a sincere and competent professional',
    body: 'demonstrated good performance and a positive attitude throughout the tenure. Their dedication to assigned responsibilities and willingness to contribute to team objectives have been appreciated by the management.',
  },
  satisfactory: {
    adj: 'a dependable professional',
    body: 'fulfilled the assigned duties and responsibilities in a satisfactory manner during the tenure. Their conduct and discipline during the period of employment have been found to be satisfactory.',
  },
};

const reasonPhrases: Record<Reason, string> = {
  resignation: 'tendered voluntary resignation, which has been duly accepted by the management',
  contract_end: 'completed the contractual tenure of employment with the organisation',
  mutual: 'separated from the organisation on mutually agreed terms',
};

/* ------------------------------------------------------------------ */
/*  DEFAULTS                                                           */
/* ------------------------------------------------------------------ */

const defaultData: LetterData = {
  letterType: 'experience',
  company: { name: '', address: '', hrName: '', hrDesignation: 'HR Manager' },
  employee: { name: '', employeeId: '', designation: '', department: '' },
  joiningDate: '',
  lastWorkingDate: '',
  rating: 'good',
  reason: 'resignation',
  issueDate: today(),
  refNumber: generateRef(),
};

const exampleData: LetterData = {
  letterType: 'experience',
  company: { name: 'Infosys Technologies Ltd.', address: '44 Electronics City, Hosur Road, Bengaluru, Karnataka 560100', hrName: 'Priya Sharma', hrDesignation: 'Senior HR Manager' },
  employee: { name: 'Rahul Kumar Verma', employeeId: 'INF-2019-4587', designation: 'Senior Software Engineer', department: 'Digital Experience' },
  joiningDate: '2019-07-15',
  lastWorkingDate: '2025-12-31',
  rating: 'excellent',
  reason: 'resignation',
  issueDate: '2026-01-15',
  refNumber: 'HR/EXP/2026/0412',
};

/* ------------------------------------------------------------------ */
/*  LETTER PREVIEW (forwardRef for html2canvas)                        */
/* ------------------------------------------------------------------ */

const LetterPreview = forwardRef<HTMLDivElement, { data: LetterData }>(
  ({ data }, ref) => {
    const { letterType, company, employee, joiningDate, lastWorkingDate, rating, reason, issueDate, refNumber } = data;
    const duration = calcDuration(joiningDate, lastWorkingDate);
    const rp = ratingPhrases[rating];
    const isExperience = letterType === 'experience';

    const s = {
      page: { width: '700px', margin: '0 auto', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '14px', color: '#1a1a1a', background: '#fff', padding: '48px 56px', lineHeight: 1.8 } as React.CSSProperties,
      header: { borderBottom: '3px solid #5b21b6', paddingBottom: '16px', marginBottom: '8px' } as React.CSSProperties,
      companyName: { fontSize: '22px', fontWeight: 700, color: '#5b21b6', letterSpacing: '0.5px' } as React.CSSProperties,
      companyAddr: { fontSize: '12px', color: '#555', marginTop: '4px' } as React.CSSProperties,
      refLine: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', margin: '16px 0 24px' } as React.CSSProperties,
      title: { textAlign: 'center' as const, fontSize: '17px', fontWeight: 700, margin: '20px 0 24px', color: '#5b21b6', textTransform: 'uppercase' as const, letterSpacing: '2px', textDecoration: 'underline', textUnderlineOffset: '6px' },
      subject: { textAlign: 'center' as const, fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '24px' } as React.CSSProperties,
      body: { textAlign: 'justify' as const, marginBottom: '16px' } as React.CSSProperties,
      sigBlock: { marginTop: '60px' } as React.CSSProperties,
      sigLine: { borderTop: '1px solid #333', width: '200px', marginTop: '48px', paddingTop: '4px' } as React.CSSProperties,
      sealArea: { marginTop: '20px', border: '2px dashed #ccc', borderRadius: '8px', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '11px', textAlign: 'center' as const } as React.CSSProperties,
      footer: { textAlign: 'center' as const, fontSize: '10px', color: '#999', marginTop: '32px', borderTop: '1px solid #e5e7eb', paddingTop: '8px' } as React.CSSProperties,
    };

    const titleText = isExperience ? 'Experience Certificate' : 'Relieving Letter';

    return (
      <div ref={ref} style={s.page}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.companyName}>{company.name || 'Company Name'}</div>
          {company.address && <div style={s.companyAddr}>{company.address}</div>}
        </div>

        {/* Ref & Date line */}
        <div style={s.refLine}>
          <span>Ref: {refNumber || 'HR/EXP/____/____'}</span>
          <span>Date: {formatDate(issueDate)}</span>
        </div>

        {/* Title */}
        <div style={s.title}>{titleText}</div>

        {/* Subject line */}
        <div style={s.subject}>To Whom It May Concern</div>

        {/* Body */}
        {isExperience ? (
          <>
            <p style={s.body}>
              This is to certify that <strong>{employee.name || '___________'}</strong> (Employee ID: {employee.employeeId || '___________'})
              was employed with <strong>{company.name || '___________'}</strong> as
              {' '}<strong>{employee.designation || '___________'}</strong> in the <strong>{employee.department || '___________'}</strong> department
              from <strong>{formatDate(joiningDate)}</strong> to <strong>{formatDate(lastWorkingDate)}</strong>
              {duration ? `, a total period of approximately ${duration}` : ''}.
            </p>
            <p style={s.body}>
              During the period of employment, {employee.name ? employee.name.split(' ')[0] : 'the employee'} {rp.body}
            </p>
            <p style={s.body}>
              {employee.name ? employee.name.split(' ')[0] : 'The employee'} has {reasonPhrases[reason]}.
              All dues and settlements have been cleared as on the date of separation.
            </p>
            <p style={s.body}>
              We found {employee.name ? employee.name.split(' ')[0] : 'the employee'} to be {rp.adj}.
              We wish {employee.name ? employee.name.split(' ')[0] : 'them'} all the very best in future endeavours.
            </p>
            <p style={s.body}>
              This certificate is issued upon request for the purpose of records and future reference.
            </p>
          </>
        ) : (
          <>
            <p style={s.body}>
              This is to certify that <strong>{employee.name || '___________'}</strong> (Employee ID: {employee.employeeId || '___________'})
              was employed with <strong>{company.name || '___________'}</strong> as
              {' '}<strong>{employee.designation || '___________'}</strong> in the <strong>{employee.department || '___________'}</strong> department
              from <strong>{formatDate(joiningDate)}</strong> to <strong>{formatDate(lastWorkingDate)}</strong>
              {duration ? `, a total period of approximately ${duration}` : ''}.
            </p>
            <p style={s.body}>
              {employee.name ? employee.name.split(' ')[0] : 'The employee'} has {reasonPhrases[reason]}.
              The last working day was <strong>{formatDate(lastWorkingDate)}</strong>.
            </p>
            <p style={s.body}>
              We hereby confirm that {employee.name ? employee.name.split(' ')[0] : 'the employee'} stands relieved from
              all duties and responsibilities with effect from <strong>{formatDate(lastWorkingDate)}</strong>.
              All dues, including full and final settlement, have been cleared satisfactorily as on the date of relieving.
            </p>
            <p style={s.body}>
              During the period of employment, {employee.name ? employee.name.split(' ')[0] : 'the employee'} {rp.body}
            </p>
            <p style={s.body}>
              We wish {employee.name ? employee.name.split(' ')[0] : 'them'} all the very best in future endeavours and professional growth.
            </p>
            <p style={s.body}>
              This relieving letter is issued upon request for the purpose of records.
            </p>
          </>
        )}

        {/* Signature Block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px' }}>
          <div style={s.sigBlock}>
            <div style={s.sigLine}>
              <div style={{ fontWeight: 700 }}>{company.hrName || '___________'}</div>
              <div style={{ fontSize: '12px', color: '#555' }}>{company.hrDesignation || 'HR Manager'}</div>
              <div style={{ fontSize: '12px', color: '#555' }}>{company.name || '___________'}</div>
            </div>
          </div>
          <div style={s.sealArea}>
            Company<br />Seal / Stamp
          </div>
        </div>

        <div style={s.footer}>
          This is a computer-generated letter. Please verify with the issuing authority for authenticity.
        </div>
      </div>
    );
  }
);
LetterPreview.displayName = 'LetterPreview';

/* ------------------------------------------------------------------ */
/*  REUSABLE INPUT COMPONENTS                                          */
/* ------------------------------------------------------------------ */

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1">
        {icon}{label}
      </span>
      {children}
    </label>
  );
}

const inputCls = 'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition';
const selectCls = inputCls;

/* ------------------------------------------------------------------ */
/*  SCALED PREVIEW WRAPPER                                             */
/* ------------------------------------------------------------------ */

function ScaledPreview({ data, letterRef }: { data: LetterData; letterRef: React.RefObject<HTMLDivElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentH, setContentH] = useState(700);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;
    const ro = new ResizeObserver(() => {
      const s = Math.min(container.clientWidth / 700, 1);
      setScale(s);
      setContentH(inner.scrollHeight);
    });
    ro.observe(container);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full" style={{ position: 'relative', height: contentH * scale, overflow: 'hidden' }}>
      <div ref={innerRef} style={{ position: 'absolute', top: 0, left: 0, width: 700, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <LetterPreview ref={letterRef} data={data} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function ExperienceLetterGeneratorTool() {
  const [data, setData] = useState<LetterData>({ ...defaultData });
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  const u = useCallback((patch: Partial<LetterData>) => setData(p => ({ ...p, ...patch })), []);
  const uc = useCallback((patch: Partial<CompanyInfo>) => setData(p => ({ ...p, company: { ...p.company, ...patch } })), []);
  const ue = useCallback((patch: Partial<EmployeeInfo>) => setData(p => ({ ...p, employee: { ...p.employee, ...patch } })), []);

  const duration = calcDuration(data.joiningDate, data.lastWorkingDate);

  /* --- Download PNG --- */
  const handleDownload = useCallback(async () => {
    if (!letterRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(letterRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      const link = document.createElement('a');
      link.download = `${data.letterType === 'experience' ? 'Experience_Certificate' : 'Relieving_Letter'}_${(data.employee.name || 'Employee').replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch { /* silent */ }
    setDownloading(false);
  }, [data.letterType, data.employee.name]);

  /* --- Copy text --- */
  const handleCopy = useCallback(() => {
    if (!letterRef.current) return;
    const text = letterRef.current.innerText;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  /* --- Reset --- */
  const handleReset = useCallback(() => {
    setData({ ...defaultData, refNumber: generateRef(), issueDate: today() });
  }, []);

  /* --- Try Example --- */
  const handleExample = useCallback(() => {
    setData({ ...exampleData });
  }, []);

  /* --- Tab classes --- */
  const tabCls = (active: boolean) =>
    `flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${
      active
        ? 'bg-violet-600 text-white shadow-md'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Action bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={handleExample} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition">
          <Sparkles className="w-4 h-4" /> Try Example
        </button>
        <button onClick={handleReset} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <div className="flex-1" />
        <button onClick={handleCopy} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
          <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy Text'}
        </button>
        <button onClick={handleDownload} disabled={downloading} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 transition shadow">
          <Download className="w-4 h-4" /> {downloading ? 'Saving...' : 'Download PNG'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ---- LEFT: FORM ---- */}
        <div className="lg:col-span-2 space-y-5">
          {/* Letter Type Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Letter Type</h3>
            <div className="flex gap-2">
              <button onClick={() => u({ letterType: 'experience' })} className={tabCls(data.letterType === 'experience')}>
                <Award className="w-4 h-4 inline mr-1.5" />Experience Certificate
              </button>
              <button onClick={() => u({ letterType: 'relieving' })} className={tabCls(data.letterType === 'relieving')}>
                <FileText className="w-4 h-4 inline mr-1.5" />Relieving Letter
              </button>
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Company Details
            </h3>
            <Field label="Company Name" icon={<Building2 className="w-3.5 h-3.5" />}>
              <input className={inputCls} value={data.company.name} onChange={e => uc({ name: e.target.value })} placeholder="e.g. Tata Consultancy Services Ltd." />
            </Field>
            <Field label="Company Address">
              <input className={inputCls} value={data.company.address} onChange={e => uc({ address: e.target.value })} placeholder="e.g. TCS House, Raveline Street, Mumbai 400001" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="HR / Signatory Name">
                <input className={inputCls} value={data.company.hrName} onChange={e => uc({ hrName: e.target.value })} placeholder="e.g. Anita Desai" />
              </Field>
              <Field label="Designation">
                <input className={inputCls} value={data.company.hrDesignation} onChange={e => uc({ hrDesignation: e.target.value })} placeholder="e.g. HR Manager" />
              </Field>
            </div>
          </div>

          {/* Employee Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4" /> Employee Details
            </h3>
            <Field label="Full Name" icon={<User className="w-3.5 h-3.5" />}>
              <input className={inputCls} value={data.employee.name} onChange={e => ue({ name: e.target.value })} placeholder="e.g. Rajesh Kumar Singh" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Employee ID" icon={<Hash className="w-3.5 h-3.5" />}>
                <input className={inputCls} value={data.employee.employeeId} onChange={e => ue({ employeeId: e.target.value })} placeholder="e.g. EMP-2020-1234" />
              </Field>
              <Field label="Designation" icon={<Briefcase className="w-3.5 h-3.5" />}>
                <input className={inputCls} value={data.employee.designation} onChange={e => ue({ designation: e.target.value })} placeholder="e.g. Senior Analyst" />
              </Field>
            </div>
            <Field label="Department">
              <input className={inputCls} value={data.employee.department} onChange={e => ue({ department: e.target.value })} placeholder="e.g. Information Technology" />
            </Field>
          </div>

          {/* Employment Period */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Employment Period
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Joining Date">
                <input type="date" className={inputCls} value={data.joiningDate} onChange={e => u({ joiningDate: e.target.value })} />
              </Field>
              <Field label="Last Working Date">
                <input type="date" className={inputCls} value={data.lastWorkingDate} onChange={e => u({ lastWorkingDate: e.target.value })} />
              </Field>
            </div>
            {duration && (
              <div className="text-sm text-violet-600 dark:text-violet-400 font-medium bg-violet-50 dark:bg-violet-900/20 px-3 py-1.5 rounded-lg">
                Duration: {duration}
              </div>
            )}
          </div>

          {/* Letter Options */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Letter Options
            </h3>
            <Field label="Performance Rating">
              <select className={selectCls} value={data.rating} onChange={e => u({ rating: e.target.value as Rating })}>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="satisfactory">Satisfactory</option>
              </select>
            </Field>
            <Field label="Reason for Leaving">
              <select className={selectCls} value={data.reason} onChange={e => u({ reason: e.target.value as Reason })}>
                <option value="resignation">Resignation</option>
                <option value="contract_end">End of Contract</option>
                <option value="mutual">Mutual Separation</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date of Issuance">
                <input type="date" className={inputCls} value={data.issueDate} onChange={e => u({ issueDate: e.target.value })} />
              </Field>
              <Field label="Reference Number">
                <input className={inputCls} value={data.refNumber} onChange={e => u({ refNumber: e.target.value })} placeholder="HR/EXP/2026/0001" />
              </Field>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex items-start gap-3 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
            <ShieldCheck className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">100% Private &amp; Secure</p>
              <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">
                All data stays in your browser. Nothing is uploaded to any server. Your information is never stored or shared.
              </p>
            </div>
          </div>
        </div>

        {/* ---- RIGHT: PREVIEW ---- */}
        <div className="lg:col-span-3">
          <div className="sticky top-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Live Preview
            </h3>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden bg-gray-50 dark:bg-gray-900 p-3">
              <ScaledPreview data={data} letterRef={letterRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-400">
        <strong>Disclaimer:</strong> This tool generates a template for reference purposes only. The generated letter should be reviewed and customized by your HR department or employer before use. It does not constitute a legally binding document on its own.
      </div>
    </div>
  );
}
