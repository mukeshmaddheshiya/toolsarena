'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Briefcase, Home, Car, Plane, Landmark, Download, Copy, Sparkles,
  ShieldCheck, FileText, Calendar, MapPin, Building2, Check,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES                                                               */
/* ------------------------------------------------------------------ */

type TabId = 'employment' | 'property' | 'vehicle' | 'travel' | 'bank';

interface TabDef { id: TabId; label: string; icon: React.ReactNode; }

const TABS: TabDef[] = [
  { id: 'employment', label: 'Employment', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'property',   label: 'Property',   icon: <Home className="w-4 h-4" /> },
  { id: 'vehicle',    label: 'Vehicle',     icon: <Car className="w-4 h-4" /> },
  { id: 'travel',     label: 'Travel',      icon: <Plane className="w-4 h-4" /> },
  { id: 'bank',       label: 'Bank / Loan', icon: <Landmark className="w-4 h-4" /> },
];

interface Fields {
  // Common
  date: string;
  place: string;
  orgName: string;
  orgAddress: string;
  refNo: string;
  // Employment
  empEmployerName: string;
  empEmployeeName: string;
  empDesignation: string;
  empDepartment: string;
  empPurpose: string;
  // Property
  propOwnerName: string;
  propAddress: string;
  propPurpose: string;
  // Vehicle
  vehOwnerName: string;
  vehNumber: string;
  vehMakeModel: string;
  vehTransferRTO: string;
  // Travel
  trvIssuerName: string;
  trvIssuerRelation: string;
  trvTravellerName: string;
  trvDestination: string;
  trvFromDate: string;
  trvToDate: string;
  // Bank
  bnkBankName: string;
  bnkBorrowerName: string;
  bnkLoanAccountNo: string;
  bnkPurpose: string;
}

const today = new Date().toISOString().slice(0, 10);

const EMPTY: Fields = {
  date: today, place: '', orgName: '', orgAddress: '', refNo: '',
  empEmployerName: '', empEmployeeName: '', empDesignation: '', empDepartment: '', empPurpose: 'Higher Studies',
  propOwnerName: '', propAddress: '', propPurpose: 'Sale',
  vehOwnerName: '', vehNumber: '', vehMakeModel: '', vehTransferRTO: '',
  trvIssuerName: '', trvIssuerRelation: 'Employer', trvTravellerName: '', trvDestination: '', trvFromDate: today, trvToDate: '',
  bnkBankName: '', bnkBorrowerName: '', bnkLoanAccountNo: '', bnkPurpose: 'Loan Closure',
};

const EXAMPLES: Record<TabId, Partial<Fields>> = {
  employment: {
    orgName: 'Tata Consultancy Services Ltd.', orgAddress: 'TCS House, Raveline Street, Fort, Mumbai - 400001',
    empEmployerName: 'Rajesh Kumar Sharma', empEmployeeName: 'Priya Mehta', empDesignation: 'Senior Software Engineer',
    empDepartment: 'Digital Engineering', empPurpose: 'Higher Studies', place: 'Mumbai', refNo: 'TCS/HR/NOC/2026/1247',
  },
  property: {
    orgName: 'ABC Housing Society', orgAddress: 'Plot No. 45, Sector 12, Dwarka, New Delhi - 110078',
    propOwnerName: 'Amit Verma', propAddress: 'Flat No. 302, Tower B, Sunrise Apartments, Dwarka, New Delhi - 110078',
    propPurpose: 'Sale', place: 'New Delhi', refNo: 'ABCHS/NOC/2026/089',
  },
  vehicle: {
    orgName: 'Regional Transport Office', orgAddress: 'RTO Office, Andheri East, Mumbai - 400069',
    vehOwnerName: 'Sunil Patil', vehNumber: 'MH-02-AB-1234', vehMakeModel: 'Maruti Suzuki Swift Dzire (2022)',
    vehTransferRTO: 'RTO Pune (MH-12)', place: 'Mumbai', refNo: 'RTO/MH02/NOC/2026/5634',
  },
  travel: {
    orgName: 'Infosys Limited', orgAddress: 'Electronics City, Hosur Road, Bangalore - 560100',
    trvIssuerName: 'Vikram Desai', trvIssuerRelation: 'Employer', trvTravellerName: 'Ananya Rao',
    trvDestination: 'United Kingdom', trvFromDate: '2026-04-15', trvToDate: '2026-04-30', place: 'Bangalore',
    refNo: 'INFY/HR/TRVL/2026/312',
  },
  bank: {
    orgName: 'State Bank of India', orgAddress: 'Main Branch, Parliament Street, New Delhi - 110001',
    bnkBankName: 'State Bank of India', bnkBorrowerName: 'Deepak Joshi',
    bnkLoanAccountNo: 'SBIHL2023045678', bnkPurpose: 'Loan Closure', place: 'New Delhi',
    refNo: 'SBI/LOAN/NOC/2026/7821',
  },
};

/* ------------------------------------------------------------------ */
/*  HELPERS                                                             */
/* ------------------------------------------------------------------ */

function fmtDate(d: string) {
  if (!d) return '___________';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function genRef() {
  return `NOC/${new Date().getFullYear()}/${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

/* ------------------------------------------------------------------ */
/*  LETTER BODY BUILDERS                                                */
/* ------------------------------------------------------------------ */

function buildEmployment(f: Fields): string {
  const emp = f.empEmployeeName || '___________';
  const desig = f.empDesignation || '___________';
  const dept = f.empDepartment || '___________';
  const purpose = f.empPurpose || '___________';
  return `This is to certify that Mr./Ms. ${emp}, currently employed as ${desig} in the ${dept} department of our organization, is a bonafide employee since their date of joining.\n\nWe have no objection to Mr./Ms. ${emp} pursuing ${purpose.toLowerCase()}. This NOC is issued at the request of the employee for the purpose of ${purpose.toLowerCase()}.\n\nDuring the period of ${purpose.toLowerCase()}, the employee shall continue to abide by the terms and conditions of their employment contract. The organization reserves the right to revoke this certificate if any terms are violated.\n\nWe wish Mr./Ms. ${emp} all the best in their future endeavours.`;
}

function buildProperty(f: Fields): string {
  const owner = f.propOwnerName || '___________';
  const addr = f.propAddress || '___________';
  const purpose = f.propPurpose || '___________';
  return `This is to certify that Mr./Ms. ${owner} is the rightful owner of the property located at:\n\n${addr}\n\nWe hereby confirm that there are no pending dues, disputes, or legal encumbrances against the said property. The society/authority has no objection to the ${purpose.toLowerCase()} of the above-mentioned property.\n\nAll statutory charges and maintenance dues up to the current date have been duly cleared by the owner. This NOC is issued upon the request of the owner for the purpose of ${purpose.toLowerCase()} of the property.\n\nThis certificate is valid for a period of six months from the date of issue.`;
}

function buildVehicle(f: Fields): string {
  const owner = f.vehOwnerName || '___________';
  const num = f.vehNumber || '___________';
  const make = f.vehMakeModel || '___________';
  const rto = f.vehTransferRTO || '___________';
  return `This is to certify that the vehicle described below is registered in the name of Mr./Ms. ${owner}:\n\nVehicle Registration No.: ${num}\nMake & Model: ${make}\n\nAfter careful examination of our records, we confirm that there are no pending challans, hypothecation, theft complaints, or blacklisting entries against the above vehicle.\n\nWe have no objection to the transfer of this vehicle to the jurisdiction of ${rto}. The owner has fulfilled all requirements and cleared all dues pertaining to the said vehicle.\n\nThis NOC is issued for the purpose of inter-state/inter-RTO transfer and is valid for a period of six months from the date of issue.`;
}

function buildTravel(f: Fields): string {
  const issuer = f.trvIssuerName || '___________';
  const relation = f.trvIssuerRelation || '___________';
  const traveller = f.trvTravellerName || '___________';
  const dest = f.trvDestination || '___________';
  const from = fmtDate(f.trvFromDate);
  const to = fmtDate(f.trvToDate);
  return `I, ${issuer}, in my capacity as ${relation.toLowerCase()}, hereby confirm that I have no objection to Mr./Ms. ${traveller} travelling to ${dest} from ${from} to ${to}.\n\nI confirm that this travel is with my full knowledge and consent. Mr./Ms. ${traveller} will be responsible for all expenses incurred during this travel and will comply with all applicable laws and regulations of the destination country.\n\nI request the concerned authorities to kindly grant the necessary visa/travel permissions to Mr./Ms. ${traveller}.\n\nI shall be available for verification at the contact details mentioned in this letter.`;
}

function buildBank(f: Fields): string {
  const bank = f.bnkBankName || '___________';
  const borrower = f.bnkBorrowerName || '___________';
  const acc = f.bnkLoanAccountNo || '___________';
  const purpose = f.bnkPurpose || '___________';
  return `This is to certify that Mr./Ms. ${borrower} had availed a loan from ${bank} bearing Loan Account Number: ${acc}.\n\nWe hereby confirm that the said loan has been fully repaid and the account has been closed as on date. There are no outstanding dues or liabilities pending against the above-mentioned loan account.\n\nThe bank has no objection and hereby issues this No Objection Certificate for the purpose of ${purpose.toLowerCase()}. All original documents submitted as security have been returned to the borrower.\n\nThis NOC is being issued upon the request of the borrower and is valid for all legal and official purposes.`;
}

const BUILDERS: Record<TabId, (f: Fields) => string> = {
  employment: buildEmployment,
  property: buildProperty,
  vehicle: buildVehicle,
  travel: buildTravel,
  bank: buildBank,
};

/* ------------------------------------------------------------------ */
/*  INPUT COMPONENT                                                     */
/* ------------------------------------------------------------------ */

function Input({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  LETTER PREVIEW                                                      */
/* ------------------------------------------------------------------ */

function LetterPreview({ fields, tab, previewRef }: { fields: Fields; tab: TabId; previewRef: React.RefObject<HTMLDivElement | null>; }) {
  const org = fields.orgName || 'Organization Name';
  const addr = fields.orgAddress || 'Organization Address';
  const ref = fields.refNo || 'NOC/XXXX/XXXXXX';
  const date = fmtDate(fields.date);
  const place = fields.place || '___________';
  const body = BUILDERS[tab](fields);

  return (
    <div ref={previewRef} className="bg-white text-gray-900 shadow-lg" style={{ width: '100%', maxWidth: 720, margin: '0 auto', fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <div style={{ padding: '48px 56px 40px', minHeight: 900 }}>
        {/* Letterhead */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #065f46', paddingBottom: 16, marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#065f46', letterSpacing: 1 }}>{org}</h2>
          <p style={{ fontSize: 12, color: '#555', margin: '4px 0 0' }}>{addr}</p>
        </div>

        {/* Ref & Date row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#444', marginBottom: 20 }}>
          <span><strong>Ref:</strong> {ref}</span>
          <span><strong>Date:</strong> {date}</span>
        </div>

        {/* Title */}
        <h1 style={{ textAlign: 'center', fontSize: 18, fontWeight: 700, textDecoration: 'underline', margin: '0 0 24px', letterSpacing: 2 }}>
          NO OBJECTION CERTIFICATE
        </h1>

        {/* To Whom */}
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 20 }}>To Whom It May Concern,</p>

        {/* Body */}
        {body.split('\n\n').map((para, i) => (
          <p key={i} style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 14, textAlign: 'justify' }}>{para}</p>
        ))}

        {/* Closing */}
        <p style={{ fontSize: 13, lineHeight: 1.8, marginTop: 24 }}>
          This certificate is issued without any coercion or undue influence.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.8, marginTop: 8 }}>
          For any queries or verification, please contact us at the above address.
        </p>

        {/* Signature block */}
        <div style={{ marginTop: 56 }}>
          <p style={{ fontSize: 13, marginBottom: 4 }}>Yours faithfully,</p>
          <p style={{ fontSize: 13, fontWeight: 700, marginTop: 48 }}>Authorized Signatory</p>
          <p style={{ fontSize: 12, color: '#555' }}>{org}</p>
        </div>

        {/* Place */}
        <p style={{ fontSize: 12, color: '#555', marginTop: 32 }}>
          <strong>Place:</strong> {place}
        </p>

        {/* Stamp area */}
        <div style={{ marginTop: 24, padding: 12, border: '1px dashed #bbb', borderRadius: 4, textAlign: 'center', color: '#aaa', fontSize: 11 }}>
          Official Stamp / Seal
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TAB-SPECIFIC FORM FIELDS                                            */
/* ------------------------------------------------------------------ */

function EmploymentFields({ f, u }: { f: Fields; u: (k: keyof Fields, v: string) => void }) {
  return (
    <>
      <Input label="Employee Name" value={f.empEmployeeName} onChange={v => u('empEmployeeName', v)} placeholder="Priya Mehta" />
      <Input label="Designation" value={f.empDesignation} onChange={v => u('empDesignation', v)} placeholder="Senior Software Engineer" />
      <Input label="Department" value={f.empDepartment} onChange={v => u('empDepartment', v)} placeholder="Digital Engineering" />
      <Select label="Purpose" value={f.empPurpose} onChange={v => u('empPurpose', v)} options={['Higher Studies', 'Passport Application', 'Visa Application', 'Part-time Work', 'Freelancing', 'Other']} />
    </>
  );
}

function PropertyFields({ f, u }: { f: Fields; u: (k: keyof Fields, v: string) => void }) {
  return (
    <>
      <Input label="Owner Name" value={f.propOwnerName} onChange={v => u('propOwnerName', v)} placeholder="Amit Verma" />
      <Input label="Property Address" value={f.propAddress} onChange={v => u('propAddress', v)} placeholder="Flat 302, Tower B, Sunrise Apartments" />
      <Select label="Purpose" value={f.propPurpose} onChange={v => u('propPurpose', v)} options={['Sale', 'Mortgage', 'Construction', 'Renovation', 'Transfer', 'Other']} />
    </>
  );
}

function VehicleFields({ f, u }: { f: Fields; u: (k: keyof Fields, v: string) => void }) {
  return (
    <>
      <Input label="Owner Name" value={f.vehOwnerName} onChange={v => u('vehOwnerName', v)} placeholder="Sunil Patil" />
      <Input label="Vehicle Registration No." value={f.vehNumber} onChange={v => u('vehNumber', v)} placeholder="MH-02-AB-1234" />
      <Input label="Make & Model" value={f.vehMakeModel} onChange={v => u('vehMakeModel', v)} placeholder="Maruti Suzuki Swift Dzire (2022)" />
      <Input label="Transfer To (RTO)" value={f.vehTransferRTO} onChange={v => u('vehTransferRTO', v)} placeholder="RTO Pune (MH-12)" />
    </>
  );
}

function TravelFields({ f, u }: { f: Fields; u: (k: keyof Fields, v: string) => void }) {
  return (
    <>
      <Input label="Issuer Name (Employer/Parent)" value={f.trvIssuerName} onChange={v => u('trvIssuerName', v)} placeholder="Vikram Desai" />
      <Select label="Issuer Relation" value={f.trvIssuerRelation} onChange={v => u('trvIssuerRelation', v)} options={['Employer', 'Parent', 'Guardian', 'Spouse', 'Other']} />
      <Input label="Traveller Name" value={f.trvTravellerName} onChange={v => u('trvTravellerName', v)} placeholder="Ananya Rao" />
      <Input label="Destination" value={f.trvDestination} onChange={v => u('trvDestination', v)} placeholder="United Kingdom" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="From Date" value={f.trvFromDate} onChange={v => u('trvFromDate', v)} type="date" />
        <Input label="To Date" value={f.trvToDate} onChange={v => u('trvToDate', v)} type="date" />
      </div>
    </>
  );
}

function BankFields({ f, u }: { f: Fields; u: (k: keyof Fields, v: string) => void }) {
  return (
    <>
      <Input label="Bank Name" value={f.bnkBankName} onChange={v => u('bnkBankName', v)} placeholder="State Bank of India" />
      <Input label="Borrower Name" value={f.bnkBorrowerName} onChange={v => u('bnkBorrowerName', v)} placeholder="Deepak Joshi" />
      <Input label="Loan Account Number" value={f.bnkLoanAccountNo} onChange={v => u('bnkLoanAccountNo', v)} placeholder="SBIHL2023045678" />
      <Select label="Purpose" value={f.bnkPurpose} onChange={v => u('bnkPurpose', v)} options={['Loan Closure', 'Property Release', 'Vehicle Release', 'Transfer of Loan', 'Other']} />
    </>
  );
}

const TAB_FIELDS: Record<TabId, React.FC<{ f: Fields; u: (k: keyof Fields, v: string) => void }>> = {
  employment: EmploymentFields,
  property: PropertyFields,
  vehicle: VehicleFields,
  travel: TravelFields,
  bank: BankFields,
};

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                      */
/* ------------------------------------------------------------------ */

export function NocGeneratorTool() {
  const [tab, setTab] = useState<TabId>('employment');
  const [fields, setFields] = useState<Fields>({ ...EMPTY, refNo: genRef() });
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const update = useCallback((k: keyof Fields, v: string) => {
    setFields(prev => ({ ...prev, [k]: v }));
  }, []);

  const handleTab = (id: TabId) => {
    setTab(id);
    setFields({ ...EMPTY, refNo: genRef() });
    setCopied(false);
  };

  const fillExample = () => {
    setFields(prev => ({ ...prev, ...EXAMPLES[tab], date: today }));
  };

  const getPlainText = useCallback(() => {
    const org = fields.orgName || 'Organization Name';
    const addr = fields.orgAddress || 'Organization Address';
    const ref = fields.refNo || 'NOC/XXXX/XXXXXX';
    const date = fmtDate(fields.date);
    const place = fields.place || '___________';
    const body = BUILDERS[tab](fields);

    return `${org}\n${addr}\n\nRef: ${ref}\nDate: ${date}\n\nNO OBJECTION CERTIFICATE\n\nTo Whom It May Concern,\n\n${body}\n\nThis certificate is issued without any coercion or undue influence.\n\nFor any queries or verification, please contact us at the above address.\n\nYours faithfully,\n\n\nAuthorized Signatory\n${org}\n\nPlace: ${place}`;
  }, [fields, tab]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getPlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import('html2canvas-pro');
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `NOC-${tab}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const TabFields = TAB_FIELDS[tab];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Tab selector */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => handleTab(t.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-700'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <FileText className="w-5 h-5 text-emerald-600" />
                {TABS.find(t => t.id === tab)?.label} NOC
              </h2>
              <button
                onClick={fillExample}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"
              >
                <Sparkles className="w-3.5 h-3.5" /> Try Example
              </button>
            </div>

            {/* Common fields */}
            <div className="grid grid-cols-2 gap-3">
              <Input label="Date" value={fields.date} onChange={v => update('date', v)} type="date" />
              <Input label="Place / City" value={fields.place} onChange={v => update('place', v)} placeholder="Mumbai" />
            </div>
            <Input label="Organization / Company Name" value={fields.orgName} onChange={v => update('orgName', v)} placeholder="Tata Consultancy Services Ltd." />
            <Input label="Organization Address" value={fields.orgAddress} onChange={v => update('orgAddress', v)} placeholder="TCS House, Raveline Street, Mumbai" />
            <Input label="Reference Number" value={fields.refNo} onChange={v => update('refNo', v)} placeholder="NOC/2026/XXXXXX" />

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Tab-specific fields */}
            <TabFields f={fields} u={update} />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-60 transition"
            >
              <Download className="w-4 h-4" /> {downloading ? 'Generating...' : 'Download PNG'}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>

          {/* Trust badge */}
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">100% Private & Secure</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                Everything runs in your browser. Your data is never uploaded to any server. No signup or login required.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Calendar className="w-5 h-5 text-emerald-600" />
            Live Preview
          </h2>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4 overflow-auto">
            <LetterPreview fields={fields} tab={tab} previewRef={previewRef} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            The downloaded PNG will be high-resolution (2x scale) suitable for printing.
          </p>
        </div>
      </div>
    </div>
  );
}
