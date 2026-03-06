'use client';

import { useState, useCallback, useRef, useEffect, forwardRef } from 'react';
import {
  FileText, Download, Building2, User, RotateCcw, Upload, IndianRupee,
  Briefcase, CreditCard, Calendar,
} from 'lucide-react';
import { numberWithCommas } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface CompanyInfo {
  name: string;
  address: string;
  logoDataUrl: string;
}

interface EmployeeInfo {
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  pan: string;
  bankAccount: string;
}

interface Earnings {
  basic: number;
  hraMode: 'auto40' | 'auto50' | 'custom';
  hraCustom: number;
  conveyance: number;
  medical: number;
  special: number;
  otherLabel: string;
  otherAmount: number;
}

interface Deductions {
  pfMode: 'auto' | 'custom';
  pfCustom: number;
  professionalTax: number;
  tds: number;
  esi: number;
  otherLabel: string;
  otherAmount: number;
}

/* ------------------------------------------------------------------ */
/*  MONTHS                                                             */
/* ------------------------------------------------------------------ */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const fmt = (n: number) => numberWithCommas(n.toFixed(2));

function computeHRA(basic: number, mode: Earnings['hraMode'], custom: number) {
  if (mode === 'auto40') return Math.round(basic * 0.4);
  if (mode === 'auto50') return Math.round(basic * 0.5);
  return custom;
}

function computePF(basic: number, mode: Deductions['pfMode'], custom: number) {
  if (mode === 'auto') return Math.round(basic * 0.12);
  return custom;
}

/* ------------------------------------------------------------------ */
/*  DEFAULTS                                                           */
/* ------------------------------------------------------------------ */

const defaultCompany: CompanyInfo = { name: '', address: '', logoDataUrl: '' };
const defaultEmployee: EmployeeInfo = { name: '', employeeId: '', designation: '', department: '', pan: '', bankAccount: '' };
const defaultEarnings: Earnings = { basic: 0, hraMode: 'auto50', hraCustom: 0, conveyance: 1600, medical: 1250, special: 0, otherLabel: '', otherAmount: 0 };
const defaultDeductions: Deductions = { pfMode: 'auto', pfCustom: 0, professionalTax: 200, tds: 0, esi: 0, otherLabel: '', otherAmount: 0 };

/* ------------------------------------------------------------------ */
/*  SLIP PREVIEW (forwardRef for html2canvas)                          */
/* ------------------------------------------------------------------ */

interface SlipProps {
  company: CompanyInfo;
  employee: EmployeeInfo;
  earnings: Earnings;
  deductions: Deductions;
  month: string;
  year: number;
}

const SalarySlipPreview = forwardRef<HTMLDivElement, SlipProps>(
  ({ company, employee, earnings, deductions, month, year }, ref) => {
    const hra = computeHRA(earnings.basic, earnings.hraMode, earnings.hraCustom);
    const pf = computePF(earnings.basic, deductions.pfMode, deductions.pfCustom);

    const earningsRows = [
      { label: 'Basic Salary', amount: earnings.basic },
      { label: 'HRA', amount: hra },
      { label: 'Conveyance Allowance', amount: earnings.conveyance },
      { label: 'Medical Allowance', amount: earnings.medical },
      { label: 'Special Allowance', amount: earnings.special },
      ...(earnings.otherLabel ? [{ label: earnings.otherLabel, amount: earnings.otherAmount }] : []),
    ];
    const deductionRows = [
      { label: 'Provident Fund (PF)', amount: pf },
      { label: 'Professional Tax', amount: deductions.professionalTax },
      { label: 'Income Tax (TDS)', amount: deductions.tds },
      ...(deductions.esi > 0 ? [{ label: 'ESI', amount: deductions.esi }] : []),
      ...(deductions.otherLabel ? [{ label: deductions.otherLabel, amount: deductions.otherAmount }] : []),
    ];

    const totalEarnings = earningsRows.reduce((s, r) => s + r.amount, 0);
    const totalDeductions = deductionRows.reduce((s, r) => s + r.amount, 0);
    const netPay = totalEarnings - totalDeductions;
    const maxRows = Math.max(earningsRows.length, deductionRows.length);

    const s = {
      page: { width: '700px', margin: '0 auto', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '13px', color: '#1a1a1a', background: '#fff', padding: '32px', border: '1px solid #d1d5db' } as React.CSSProperties,
      header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #166534', paddingBottom: '12px', marginBottom: '6px' } as React.CSSProperties,
      companyName: { fontSize: '20px', fontWeight: 700, color: '#166534' } as React.CSSProperties,
      companyAddr: { fontSize: '11px', color: '#555', marginTop: '2px' } as React.CSSProperties,
      logo: { width: '60px', height: '60px', objectFit: 'contain' as const, borderRadius: '4px' } as React.CSSProperties,
      title: { textAlign: 'center' as const, fontSize: '15px', fontWeight: 700, margin: '10px 0', color: '#166534', textTransform: 'uppercase' as const, letterSpacing: '1px' },
      infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', fontSize: '12px', marginBottom: '14px', padding: '10px', background: '#f9fafb', borderRadius: '4px' } as React.CSSProperties,
      infoLabel: { fontWeight: 600, color: '#374151' } as React.CSSProperties,
      table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '12px', marginBottom: '14px' },
      th: { background: '#166534', color: '#fff', padding: '8px 10px', textAlign: 'left' as const, fontWeight: 600, fontSize: '12px' },
      thRight: { background: '#166534', color: '#fff', padding: '8px 10px', textAlign: 'right' as const, fontWeight: 600, fontSize: '12px' },
      td: { padding: '6px 10px', borderBottom: '1px solid #e5e7eb' } as React.CSSProperties,
      tdRight: { padding: '6px 10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' as const } as React.CSSProperties,
      totalRow: { fontWeight: 700, background: '#f0fdf4' } as React.CSSProperties,
      netBox: { textAlign: 'center' as const, padding: '14px', background: '#166534', color: '#fff', borderRadius: '6px', marginBottom: '20px' },
      netLabel: { fontSize: '12px', opacity: 0.9 } as React.CSSProperties,
      netAmount: { fontSize: '26px', fontWeight: 800 } as React.CSSProperties,
      footer: { display: 'flex', justifyContent: 'space-between', marginTop: '30px', fontSize: '11px', color: '#555' } as React.CSSProperties,
      sigLine: { borderTop: '1px solid #999', paddingTop: '4px', minWidth: '160px', textAlign: 'center' as const } as React.CSSProperties,
    };

    return (
      <div ref={ref} style={s.page}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <div style={s.companyName}>{company.name || 'Company Name'}</div>
            {company.address && <div style={s.companyAddr}>{company.address}</div>}
          </div>
          {company.logoDataUrl && <img src={company.logoDataUrl} alt="Logo" style={s.logo} />}
        </div>

        <div style={s.title}>Salary Slip &mdash; {month} {year}</div>

        {/* Employee Info */}
        <div style={s.infoGrid}>
          <div><span style={s.infoLabel}>Employee Name:</span> {employee.name || '---'}</div>
          <div><span style={s.infoLabel}>Employee ID:</span> {employee.employeeId || '---'}</div>
          <div><span style={s.infoLabel}>Designation:</span> {employee.designation || '---'}</div>
          <div><span style={s.infoLabel}>Department:</span> {employee.department || '---'}</div>
          <div><span style={s.infoLabel}>PAN:</span> {employee.pan || '---'}</div>
          <div><span style={s.infoLabel}>Bank A/C:</span> {employee.bankAccount || '---'}</div>
        </div>

        {/* Earnings / Deductions Table */}
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Earnings</th>
              <th style={s.thRight}>Amount (Rs.)</th>
              <th style={{ ...s.th, borderLeft: '2px solid #fff' }}>Deductions</th>
              <th style={s.thRight}>Amount (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, i) => (
              <tr key={i}>
                <td style={s.td}>{earningsRows[i]?.label || ''}</td>
                <td style={s.tdRight}>{earningsRows[i] ? fmt(earningsRows[i].amount) : ''}</td>
                <td style={{ ...s.td, borderLeft: '2px solid #e5e7eb' }}>{deductionRows[i]?.label || ''}</td>
                <td style={s.tdRight}>{deductionRows[i] ? fmt(deductionRows[i].amount) : ''}</td>
              </tr>
            ))}
            <tr style={s.totalRow}>
              <td style={s.td}>Total Earnings</td>
              <td style={s.tdRight}>{fmt(totalEarnings)}</td>
              <td style={{ ...s.td, borderLeft: '2px solid #e5e7eb' }}>Total Deductions</td>
              <td style={s.tdRight}>{fmt(totalDeductions)}</td>
            </tr>
          </tbody>
        </table>

        {/* Net Pay */}
        <div style={s.netBox}>
          <div style={s.netLabel}>Net Pay</div>
          <div style={s.netAmount}>Rs. {fmt(netPay)}</div>
        </div>

        {/* Footer */}
        <div style={s.footer}>
          <div style={s.sigLine}>Employee Signature</div>
          <div style={s.sigLine}>Authorized Signatory</div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '10px', color: '#999', marginTop: '12px' }}>
          This is a computer-generated salary slip and does not require a physical signature.
        </div>
      </div>
    );
  }
);
SalarySlipPreview.displayName = 'SalarySlipPreview';

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

const inputCls = 'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition';
const selectCls = inputCls;

/* ------------------------------------------------------------------ */
/*  SCALED PREVIEW WRAPPER                                             */
/* ------------------------------------------------------------------ */

function ScaledSlipPreview(props: SlipProps & { slipRef: React.RefObject<HTMLDivElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentH, setContentH] = useState(600);

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

  const { slipRef, ...slipProps } = props;

  return (
    <div ref={containerRef} className="w-full" style={{ position: 'relative', height: contentH * scale, overflow: 'hidden' }}>
      <div ref={innerRef} style={{ position: 'absolute', top: 0, left: 0, width: 700, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <SalarySlipPreview ref={slipRef} {...slipProps} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function SalarySlipGeneratorTool() {
  const [company, setCompany] = useState<CompanyInfo>({ ...defaultCompany });
  const [employee, setEmployee] = useState<EmployeeInfo>({ ...defaultEmployee });
  const [earnings, setEarnings] = useState<Earnings>({ ...defaultEarnings });
  const [deductions, setDeductions] = useState<Deductions>({ ...defaultDeductions });
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(currentYear);
  const [downloading, setDownloading] = useState(false);
  const slipRef = useRef<HTMLDivElement>(null);

  /* --- Logo upload --- */
  const handleLogo = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCompany(p => ({ ...p, logoDataUrl: reader.result as string }));
    reader.readAsDataURL(file);
  }, []);

  /* --- Download helpers --- */
  const captureCanvas = useCallback(async () => {
    if (!slipRef.current) return null;
    const html2canvas = (await import('html2canvas-pro')).default;
    return html2canvas(slipRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
  }, []);

  const downloadPNG = useCallback(async () => {
    setDownloading(true);
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `salary-slip-${month}-${year}.png`;
      a.click();
    } finally { setDownloading(false); }
  }, [captureCanvas, month, year]);

  const downloadPDF = useCallback(async () => {
    setDownloading(true);
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const imgBytes = await (await fetch(canvas.toDataURL('image/png'))).arrayBuffer();
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      const img = await doc.embedPng(imgBytes);
      const page = doc.addPage([img.width / 2, img.height / 2]);
      page.drawImage(img, { x: 0, y: 0, width: img.width / 2, height: img.height / 2 });
      const pdfBytes = await doc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `salary-slip-${month}-${year}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally { setDownloading(false); }
  }, [captureCanvas, month, year]);

  const reset = useCallback(() => {
    setCompany({ ...defaultCompany });
    setEmployee({ ...defaultEmployee });
    setEarnings({ ...defaultEarnings });
    setDeductions({ ...defaultDeductions });
    setMonth(MONTHS[new Date().getMonth()]);
    setYear(currentYear);
  }, []);

  /* --- Updaters --- */
  const uc = (k: keyof CompanyInfo, v: string) => setCompany(p => ({ ...p, [k]: v }));
  const ue = (k: keyof EmployeeInfo, v: string) => setEmployee(p => ({ ...p, [k]: v }));
  const uEarn = (k: keyof Earnings, v: number | string) => setEarnings(p => ({ ...p, [k]: v }));
  const uDed = (k: keyof Deductions, v: number | string) => setDeductions(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 text-white p-5 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Salary Slip Generator</h2>
            <p className="text-green-100 text-xs sm:text-sm mt-0.5">Fill in details and download as PNG or PDF</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-5 lg:gap-8">
        {/* ---- LEFT: FORM ---- */}
        <div className="space-y-6">
          {/* Company */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 space-y-3">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"><Building2 className="w-4 h-4 text-green-600" /> Company Details</h2>
            <Field label="Company Name"><input className={inputCls} value={company.name} onChange={e => uc('name', e.target.value)} placeholder="Acme Pvt Ltd" /></Field>
            <Field label="Address"><input className={inputCls} value={company.address} onChange={e => uc('address', e.target.value)} placeholder="123 Business Park, City" /></Field>
            <Field label="Logo (optional)" icon={<Upload className="w-3.5 h-3.5" />}>
              <input type="file" accept="image/*" onChange={handleLogo} className="text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 file:font-medium file:cursor-pointer" />
            </Field>
          </div>

          {/* Employee */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 space-y-3">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"><User className="w-4 h-4 text-green-600" /> Employee Details</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Full Name"><input className={inputCls} value={employee.name} onChange={e => ue('name', e.target.value)} placeholder="John Doe" /></Field>
              <Field label="Employee ID"><input className={inputCls} value={employee.employeeId} onChange={e => ue('employeeId', e.target.value)} placeholder="EMP-001" /></Field>
              <Field label="Designation"><input className={inputCls} value={employee.designation} onChange={e => ue('designation', e.target.value)} placeholder="Software Engineer" /></Field>
              <Field label="Department"><input className={inputCls} value={employee.department} onChange={e => ue('department', e.target.value)} placeholder="Engineering" /></Field>
              <Field label="PAN"><input className={inputCls} value={employee.pan} onChange={e => ue('pan', e.target.value)} placeholder="ABCDE1234F" /></Field>
              <Field label="Bank Account"><input className={inputCls} value={employee.bankAccount} onChange={e => ue('bankAccount', e.target.value)} placeholder="1234567890" /></Field>
            </div>
          </div>

          {/* Pay Period */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 space-y-3">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"><Calendar className="w-4 h-4 text-green-600" /> Pay Period</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Month">
                <select className={selectCls} value={month} onChange={e => setMonth(e.target.value)}>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Year">
                <select className={selectCls} value={year} onChange={e => setYear(Number(e.target.value))}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Earnings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 space-y-3">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"><IndianRupee className="w-4 h-4 text-green-600" /> Earnings</h2>
            <Field label="Basic Salary">
              <input type="number" min={0} className={inputCls} value={earnings.basic || ''} onChange={e => uEarn('basic', +e.target.value)} placeholder="0" />
            </Field>
            <Field label="HRA (House Rent Allowance)">
              <div className="flex gap-2 items-center">
                <select className={selectCls + ' max-w-[130px]'} value={earnings.hraMode} onChange={e => uEarn('hraMode', e.target.value)}>
                  <option value="auto50">50% of Basic</option>
                  <option value="auto40">40% of Basic</option>
                  <option value="custom">Custom</option>
                </select>
                {earnings.hraMode === 'custom'
                  ? <input type="number" min={0} className={inputCls} value={earnings.hraCustom || ''} onChange={e => uEarn('hraCustom', +e.target.value)} placeholder="0" />
                  : <span className="text-sm text-gray-500">Rs. {numberWithCommas(computeHRA(earnings.basic, earnings.hraMode, earnings.hraCustom))}</span>
                }
              </div>
            </Field>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Conveyance"><input type="number" min={0} className={inputCls} value={earnings.conveyance || ''} onChange={e => uEarn('conveyance', +e.target.value)} /></Field>
              <Field label="Medical"><input type="number" min={0} className={inputCls} value={earnings.medical || ''} onChange={e => uEarn('medical', +e.target.value)} /></Field>
              <Field label="Special Allowance"><input type="number" min={0} className={inputCls} value={earnings.special || ''} onChange={e => uEarn('special', +e.target.value)} /></Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Other (Label)"><input className={inputCls} value={earnings.otherLabel} onChange={e => uEarn('otherLabel', e.target.value)} placeholder="e.g. Bonus" /></Field>
              <Field label="Other (Amount)"><input type="number" min={0} className={inputCls} value={earnings.otherAmount || ''} onChange={e => uEarn('otherAmount', +e.target.value)} /></Field>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 space-y-3">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"><CreditCard className="w-4 h-4 text-green-600" /> Deductions</h2>
            <Field label="Provident Fund (PF)">
              <div className="flex gap-2 items-center">
                <select className={selectCls + ' max-w-[130px]'} value={deductions.pfMode} onChange={e => uDed('pfMode', e.target.value)}>
                  <option value="auto">12% of Basic</option>
                  <option value="custom">Custom</option>
                </select>
                {deductions.pfMode === 'custom'
                  ? <input type="number" min={0} className={inputCls} value={deductions.pfCustom || ''} onChange={e => uDed('pfCustom', +e.target.value)} placeholder="0" />
                  : <span className="text-sm text-gray-500">Rs. {numberWithCommas(computePF(earnings.basic, deductions.pfMode, deductions.pfCustom))}</span>
                }
              </div>
            </Field>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Professional Tax"><input type="number" min={0} className={inputCls} value={deductions.professionalTax || ''} onChange={e => uDed('professionalTax', +e.target.value)} /></Field>
              <Field label="Income Tax (TDS)"><input type="number" min={0} className={inputCls} value={deductions.tds || ''} onChange={e => uDed('tds', +e.target.value)} /></Field>
              <Field label="ESI"><input type="number" min={0} className={inputCls} value={deductions.esi || ''} onChange={e => uDed('esi', +e.target.value)} placeholder="0 if N/A" /></Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Other (Label)"><input className={inputCls} value={deductions.otherLabel} onChange={e => uDed('otherLabel', e.target.value)} placeholder="e.g. Loan EMI" /></Field>
              <Field label="Other (Amount)"><input type="number" min={0} className={inputCls} value={deductions.otherAmount || ''} onChange={e => uDed('otherAmount', +e.target.value)} /></Field>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
            <button onClick={downloadPNG} disabled={downloading} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-xl transition disabled:opacity-50 text-sm">
              <Download className="w-4 h-4" />{downloading ? 'Saving...' : 'PNG'}
            </button>
            <button onClick={downloadPDF} disabled={downloading} className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-xl transition disabled:opacity-50 text-sm">
              <FileText className="w-4 h-4" />{downloading ? 'Saving...' : 'PDF'}
            </button>
            <button onClick={reset} className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-4 rounded-xl transition text-sm">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        {/* ---- RIGHT: LIVE PREVIEW ---- */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-green-600" /> Live Preview
          </h2>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 overflow-hidden">
            <ScaledSlipPreview
              slipRef={slipRef}
              company={company}
              employee={employee}
              earnings={earnings}
              deductions={deductions}
              month={month}
              year={year}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
