'use client';

import { useState, useRef, useCallback } from 'react';
import {
  FileText, Download, Copy, RotateCcw, Sparkles, AlertTriangle,
  User, MapPin, Calendar, Hash, Briefcase, GraduationCap, IndianRupee,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES & CONSTANTS                                                  */
/* ------------------------------------------------------------------ */

const AFFIDAVIT_TYPES = [
  { id: 'general', label: 'General Purpose', icon: FileText },
  { id: 'name-change', label: 'Name Change', icon: User },
  { id: 'address-change', label: 'Address Change', icon: MapPin },
  { id: 'dob-correction', label: 'DOB Correction', icon: Calendar },
  { id: 'income', label: 'Income Declaration', icon: IndianRupee },
  { id: 'gap-certificate', label: 'Gap Certificate', icon: GraduationCap },
  { id: 'identity', label: 'Identity Declaration', icon: Briefcase },
] as const;

type AffidavitType = (typeof AFFIDAVIT_TYPES)[number]['id'];

interface CommonFields {
  fullName: string;
  relation: 'S/o' | 'D/o' | 'W/o';
  relationName: string;
  age: string;
  address: string;
  city: string;
  state: string;
  idNumber: string;
  place: string;
  date: string;
}

interface TypeFields {
  // Name change
  oldName: string;
  newName: string;
  nameChangeReason: string;
  gazetteNumber: string;
  // Address change
  oldAddress: string;
  newAddress: string;
  addressChangeReason: string;
  // DOB correction
  incorrectDob: string;
  correctDob: string;
  supportingDocument: string;
  // Income
  annualIncome: string;
  incomeSource: string;
  financialYear: string;
  // Gap certificate
  gapFrom: string;
  gapTo: string;
  gapReason: string;
  // Identity
  identityPurpose: string;
  // General
  generalStatement: string;
}

const INITIAL_COMMON: CommonFields = {
  fullName: '', relation: 'S/o', relationName: '', age: '',
  address: '', city: '', state: '', idNumber: '',
  place: '', date: new Date().toISOString().slice(0, 10),
};

const INITIAL_TYPE: TypeFields = {
  oldName: '', newName: '', nameChangeReason: '', gazetteNumber: '',
  oldAddress: '', newAddress: '', addressChangeReason: '',
  incorrectDob: '', correctDob: '', supportingDocument: '',
  annualIncome: '', incomeSource: '', financialYear: '',
  gapFrom: '', gapTo: '', gapReason: '',
  identityPurpose: '',
  generalStatement: '',
};

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

function formatDate(d: string): string {
  if (!d) return '___________';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function or(val: string, placeholder: string): string {
  return val.trim() || placeholder;
}

/* ------------------------------------------------------------------ */
/*  PARAGRAPH GENERATORS                                               */
/* ------------------------------------------------------------------ */

function generateParagraphs(type: AffidavitType, c: CommonFields, t: TypeFields): string[] {
  const name = or(c.fullName, '[Full Name]');
  const paras: string[] = [];

  switch (type) {
    case 'general':
      paras.push(`That I am a resident of ${or(c.address, '[Address]')}, ${or(c.city, '[City]')}, ${or(c.state, '[State]')} and I am making this affidavit of my own free will.`);
      if (t.generalStatement.trim()) {
        paras.push(t.generalStatement.trim());
      } else {
        paras.push('That the facts stated herein are true and correct to the best of my knowledge and belief.');
      }
      paras.push('That I am aware that if any information given above is found to be false or incorrect, I shall be liable for legal action as per Indian law.');
      break;

    case 'name-change':
      paras.push(`That I am a resident of ${or(c.address, '[Address]')}, ${or(c.city, '[City]')}, ${or(c.state, '[State]')}.`);
      paras.push(`That my name was previously recorded as "${or(t.oldName, '[Old Name]')}" in my official documents.`);
      paras.push(`That I have changed my name from "${or(t.oldName, '[Old Name]')}" to "${or(t.newName, '[New Name]')}"${t.nameChangeReason ? ' due to ' + t.nameChangeReason : ''}.`);
      if (t.gazetteNumber) {
        paras.push(`That this name change has been notified in the Official Gazette vide Notification No. ${t.gazetteNumber}.`);
      }
      paras.push(`That henceforth I shall be known as "${or(t.newName, '[New Name]')}" for all purposes and in all official documents.`);
      paras.push('That the facts stated above are true and correct to the best of my knowledge and belief, and nothing has been concealed therein.');
      break;

    case 'address-change':
      paras.push(`That I was previously residing at ${or(t.oldAddress, '[Old Address]')}.`);
      paras.push(`That I have now shifted my residence to ${or(t.newAddress, '[New Address]')}${t.addressChangeReason ? ' due to ' + t.addressChangeReason : ''}.`);
      paras.push(`That my current and permanent address is ${or(t.newAddress, '[New Address]')}, and I request all concerned authorities to update their records accordingly.`);
      paras.push('That the facts stated above are true and correct to the best of my knowledge and belief.');
      break;

    case 'dob-correction':
      paras.push(`That I am a resident of ${or(c.address, '[Address]')}, ${or(c.city, '[City]')}, ${or(c.state, '[State]')}.`);
      paras.push(`That my date of birth has been incorrectly recorded as ${t.incorrectDob ? formatDate(t.incorrectDob) : '[Incorrect DOB]'} in some of my official documents.`);
      paras.push(`That my correct date of birth is ${t.correctDob ? formatDate(t.correctDob) : '[Correct DOB]'} as per my ${or(t.supportingDocument, '[Supporting Document, e.g., Birth Certificate / School Records]')}.`);
      paras.push('That I request all concerned authorities to correct my date of birth in their records accordingly.');
      paras.push('That the facts stated above are true and correct to the best of my knowledge and belief, and nothing has been concealed therein.');
      break;

    case 'income':
      paras.push(`That I am a resident of ${or(c.address, '[Address]')}, ${or(c.city, '[City]')}, ${or(c.state, '[State]')}.`);
      paras.push(`That my total annual income from all sources is Rs. ${or(t.annualIncome, '[Amount]')}/- (Rupees ${t.annualIncome ? numberToWords(t.annualIncome) : '[Amount in Words]'} only) for the Financial Year ${or(t.financialYear, '[Financial Year]')}.`);
      paras.push(`That my primary source of income is ${or(t.incomeSource, '[Source of Income]')}.`);
      paras.push('That I am not an income tax assessee unless otherwise stated, and the above income details are true to the best of my knowledge.');
      paras.push('That the facts stated above are true and correct to the best of my knowledge and belief.');
      break;

    case 'gap-certificate':
      paras.push(`That I am a resident of ${or(c.address, '[Address]')}, ${or(c.city, '[City]')}, ${or(c.state, '[State]')}.`);
      paras.push(`That there has been a gap in my education/employment from ${t.gapFrom ? formatDate(t.gapFrom) : '[Start Date]'} to ${t.gapTo ? formatDate(t.gapTo) : '[End Date]'}.`);
      paras.push(`That the reason for the above gap was: ${or(t.gapReason, '[Reason for gap, e.g., personal reasons, health issues, family circumstances, preparation for competitive exams]')}.`);
      paras.push('That during the above gap period, I was not involved in any criminal activity or any activity against the interests of the nation.');
      paras.push('That the facts stated above are true and correct to the best of my knowledge and belief, and nothing has been concealed therein.');
      break;

    case 'identity':
      paras.push(`That I am a resident of ${or(c.address, '[Address]')}, ${or(c.city, '[City]')}, ${or(c.state, '[State]')}.`);
      if (c.idNumber) {
        paras.push(`That my Aadhaar/ID number is ${c.idNumber}.`);
      }
      paras.push(`That I am the same person known by the name ${name}, and this affidavit is being made for the purpose of ${or(t.identityPurpose, '[Purpose, e.g., passport application, bank account opening, visa application]')}.`);
      paras.push('That I solemnly declare that the photograph affixed herewith is my recent photograph and I am the person mentioned in this affidavit.');
      paras.push('That the facts stated above are true and correct to the best of my knowledge and belief.');
      break;
  }

  return paras;
}

function numberToWords(num: string): string {
  const n = parseInt(num.replace(/,/g, ''), 10);
  if (isNaN(n)) return '[Amount in Words]';
  if (n === 0) return 'Zero';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  }

  return convert(n);
}

/* ------------------------------------------------------------------ */
/*  FULL AFFIDAVIT TEXT (for copy)                                     */
/* ------------------------------------------------------------------ */

function generateFullText(type: AffidavitType, c: CommonFields, t: TypeFields): string {
  const title = AFFIDAVIT_TYPES.find(a => a.id === type)?.label ?? 'General Purpose';
  const name = or(c.fullName, '[Full Name]');
  const paras = generateParagraphs(type, c, t);

  let text = `AFFIDAVIT\n(${title})\n\n`;
  text += `I, ${name}, aged ${or(c.age, '[Age]')} years, ${c.relation} ${or(c.relationName, '[Father/Mother/Husband Name]')}, `;
  text += `resident of ${or(c.address, '[Address]')}, ${or(c.city, '[City]')}, ${or(c.state, '[State]')}, `;
  text += `do hereby solemnly affirm and declare as under:\n\n`;

  paras.forEach((p, i) => { text += `${i + 1}. ${p}\n\n`; });

  text += `VERIFICATION\n\n`;
  text += `I, ${name}, the above-named deponent, do hereby verify that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.\n\n`;
  text += `Verified at ${or(c.place, '[Place]')} on this ${formatDate(c.date)}.\n\n\n`;
  text += `________________________\nDEPONENT\n(${name})\n\n\n`;
  text += `Before me,\n\n________________________\nNotary Public / Oath Commissioner`;

  return text;
}

/* ------------------------------------------------------------------ */
/*  EXAMPLE DATA                                                       */
/* ------------------------------------------------------------------ */

const EXAMPLE_COMMON: CommonFields = {
  fullName: 'Rajesh Kumar Sharma',
  relation: 'S/o',
  relationName: 'Shri Mohan Lal Sharma',
  age: '32',
  address: '45, Gandhi Nagar, Sector 12',
  city: 'Jaipur',
  state: 'Rajasthan',
  idNumber: '1234-5678-9012',
  place: 'Jaipur',
  date: new Date().toISOString().slice(0, 10),
};

const EXAMPLE_TYPE: TypeFields = {
  ...INITIAL_TYPE,
  oldName: 'Rajesh Sharma',
  newName: 'Rajesh Kumar Sharma',
  nameChangeReason: 'addition of middle name as per family tradition',
  gazetteNumber: 'GZ/RAJ/2026/4521',
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function AffidavitGeneratorTool() {
  const [activeType, setActiveType] = useState<AffidavitType>('general');
  const [common, setCommon] = useState<CommonFields>(INITIAL_COMMON);
  const [typeFields, setTypeFields] = useState<TypeFields>(INITIAL_TYPE);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateCommon = useCallback((key: keyof CommonFields, val: string) => {
    setCommon(prev => ({ ...prev, [key]: val }));
  }, []);

  const updateType = useCallback((key: keyof TypeFields, val: string) => {
    setTypeFields(prev => ({ ...prev, [key]: val }));
  }, []);

  const handleReset = useCallback(() => {
    setCommon(INITIAL_COMMON);
    setTypeFields(INITIAL_TYPE);
  }, []);

  const handleExample = useCallback(() => {
    setActiveType('name-change');
    setCommon(EXAMPLE_COMMON);
    setTypeFields(EXAMPLE_TYPE);
  }, []);

  const handleCopy = useCallback(async () => {
    const text = generateFullText(activeType, common, typeFields);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [activeType, common, typeFields]);

  const handleDownload = useCallback(async () => {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, useCORS: true, backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `affidavit-${activeType}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [activeType, downloading]);

  const paras = generateParagraphs(activeType, common, typeFields);
  const typeLabel = AFFIDAVIT_TYPES.find(a => a.id === activeType)?.label ?? '';

  /* ---- reusable input ---- */
  const Input = ({ label, value, onChange, placeholder, type = 'text' }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
  }) => (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
      />
    </label>
  );

  const TextArea = ({ label, value, onChange, placeholder, rows = 3 }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
  }) => (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors resize-none"
      />
    </label>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Disclaimer */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-4">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Disclaimer:</strong> This tool generates affidavit drafts for reference purposes only. The generated document must be printed on stamp paper of appropriate value and notarized/attested by a Notary Public or Oath Commissioner to be legally valid. Consult a legal professional for critical matters.
        </p>
      </div>

      {/* Type Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {AFFIDAVIT_TYPES.map(t => {
          const Icon = t.icon;
          const active = activeType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveType(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-300/30 dark:shadow-amber-900/40'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button onClick={handleExample} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-sm font-medium transition-colors">
          <Sparkles className="w-4 h-4" /> Try Example
        </button>
        <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
          <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy Text'}
        </button>
        <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors disabled:opacity-50">
          <Download className="w-4 h-4" /> {downloading ? 'Downloading...' : 'Download PNG'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── LEFT: FORM ─── */}
        <div className="space-y-6">
          {/* Common Fields */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" /> Personal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name *" value={common.fullName} onChange={v => updateCommon('fullName', v)} placeholder="e.g., Rajesh Kumar Sharma" />
              <div className="grid grid-cols-3 gap-2">
                <label className="block col-span-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Relation</span>
                  <select
                    value={common.relation}
                    onChange={e => updateCommon('relation', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="S/o">S/o</option>
                    <option value="D/o">D/o</option>
                    <option value="W/o">W/o</option>
                  </select>
                </label>
                <div className="col-span-2">
                  <Input label="Father/Spouse Name *" value={common.relationName} onChange={v => updateCommon('relationName', v)} placeholder="e.g., Shri Mohan Lal" />
                </div>
              </div>
              <Input label="Age (years) *" value={common.age} onChange={v => updateCommon('age', v)} placeholder="e.g., 32" />
              <Input label="Aadhaar / ID No. (optional)" value={common.idNumber} onChange={v => updateCommon('idNumber', v)} placeholder="e.g., 1234-5678-9012" />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <Input label="Address *" value={common.address} onChange={v => updateCommon('address', v)} placeholder="e.g., 45, Gandhi Nagar, Sector 12" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City *" value={common.city} onChange={v => updateCommon('city', v)} placeholder="e.g., Jaipur" />
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">State *</span>
                  <select
                    value={common.state}
                    onChange={e => updateCommon('state', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="">Select State</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Input label="Place of Execution *" value={common.place} onChange={v => updateCommon('place', v)} placeholder="e.g., Jaipur" />
              <Input label="Date *" value={common.date} onChange={v => updateCommon('date', v)} type="date" />
            </div>
          </div>

          {/* Type-Specific Fields */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Hash className="w-4 h-4 text-amber-600" /> {typeLabel} Details
            </h3>

            {activeType === 'general' && (
              <TextArea label="Declaration Statement" value={typeFields.generalStatement} onChange={v => updateType('generalStatement', v)} placeholder="Enter your declaration statement here. E.g., 'That I have lost my original Class 10 marksheet bearing Roll No. 123456...'" rows={4} />
            )}

            {activeType === 'name-change' && (
              <div className="space-y-4">
                <Input label="Old Name *" value={typeFields.oldName} onChange={v => updateType('oldName', v)} placeholder="Name as per old documents" />
                <Input label="New Name *" value={typeFields.newName} onChange={v => updateType('newName', v)} placeholder="New name to be used" />
                <Input label="Reason for Change" value={typeFields.nameChangeReason} onChange={v => updateType('nameChangeReason', v)} placeholder="e.g., marriage, religious conversion" />
                <Input label="Gazette Notification No. (optional)" value={typeFields.gazetteNumber} onChange={v => updateType('gazetteNumber', v)} placeholder="e.g., GZ/RAJ/2026/4521" />
              </div>
            )}

            {activeType === 'address-change' && (
              <div className="space-y-4">
                <TextArea label="Old Address *" value={typeFields.oldAddress} onChange={v => updateType('oldAddress', v)} placeholder="Previous residential address" />
                <TextArea label="New Address *" value={typeFields.newAddress} onChange={v => updateType('newAddress', v)} placeholder="Current residential address" />
                <Input label="Reason for Change" value={typeFields.addressChangeReason} onChange={v => updateType('addressChangeReason', v)} placeholder="e.g., job transfer, family relocation" />
              </div>
            )}

            {activeType === 'dob-correction' && (
              <div className="space-y-4">
                <Input label="Incorrect Date of Birth *" value={typeFields.incorrectDob} onChange={v => updateType('incorrectDob', v)} type="date" />
                <Input label="Correct Date of Birth *" value={typeFields.correctDob} onChange={v => updateType('correctDob', v)} type="date" />
                <Input label="Supporting Document *" value={typeFields.supportingDocument} onChange={v => updateType('supportingDocument', v)} placeholder="e.g., Birth Certificate, School Leaving Certificate" />
              </div>
            )}

            {activeType === 'income' && (
              <div className="space-y-4">
                <Input label="Annual Income (Rs.) *" value={typeFields.annualIncome} onChange={v => updateType('annualIncome', v)} placeholder="e.g., 500000" />
                <Input label="Source of Income *" value={typeFields.incomeSource} onChange={v => updateType('incomeSource', v)} placeholder="e.g., Salary, Business, Agriculture" />
                <Input label="Financial Year *" value={typeFields.financialYear} onChange={v => updateType('financialYear', v)} placeholder="e.g., 2025-26" />
              </div>
            )}

            {activeType === 'gap-certificate' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Gap From *" value={typeFields.gapFrom} onChange={v => updateType('gapFrom', v)} type="date" />
                  <Input label="Gap To *" value={typeFields.gapTo} onChange={v => updateType('gapTo', v)} type="date" />
                </div>
                <TextArea label="Reason for Gap *" value={typeFields.gapReason} onChange={v => updateType('gapReason', v)} placeholder="e.g., Preparation for UPSC, health issues, family responsibilities" rows={3} />
              </div>
            )}

            {activeType === 'identity' && (
              <div className="space-y-4">
                <Input label="Purpose of Declaration *" value={typeFields.identityPurpose} onChange={v => updateType('identityPurpose', v)} placeholder="e.g., Passport application, bank account opening" />
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT: PREVIEW ─── */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" /> Live Preview
          </h3>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white">
            <div
              ref={previewRef}
              style={{
                background: '#ffffff',
                color: '#1a1a1a',
                fontFamily: "'Georgia', 'Times New Roman', serif",
                padding: '48px 40px',
                minHeight: '700px',
                lineHeight: 1.8,
                fontSize: '14px',
              }}
            >
              {/* Border */}
              <div style={{
                border: '2px solid #92400e',
                padding: '36px 32px',
                minHeight: '600px',
              }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    letterSpacing: '6px',
                    textTransform: 'uppercase',
                    color: '#92400e',
                    margin: '0 0 6px 0',
                  }}>
                    AFFIDAVIT
                  </h2>
                  <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                    ({typeLabel})
                  </p>
                </div>

                {/* Opening */}
                <p style={{ textAlign: 'justify', marginBottom: '16px' }}>
                  I, <strong>{or(common.fullName, '[Full Name]')}</strong>, aged{' '}
                  <strong>{or(common.age, '[Age]')}</strong> years, {common.relation}{' '}
                  <strong>{or(common.relationName, '[Father/Mother/Husband Name]')}</strong>,
                  resident of{' '}
                  <strong>
                    {or(common.address, '[Address]')}, {or(common.city, '[City]')},{' '}
                    {or(common.state, '[State]')}
                  </strong>,
                  do hereby solemnly affirm and declare as under:
                </p>

                {/* Numbered Paragraphs */}
                <div style={{ marginBottom: '24px' }}>
                  {paras.map((p, i) => (
                    <p key={i} style={{ textAlign: 'justify', marginBottom: '10px', paddingLeft: '24px', textIndent: '-24px' }}>
                      <strong>{i + 1}.</strong>&nbsp;&nbsp;{p}
                    </p>
                  ))}
                </div>

                {/* Verification */}
                <div style={{ marginTop: '28px', borderTop: '1px solid #d4a843', paddingTop: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '12px', color: '#92400e' }}>
                    VERIFICATION
                  </h3>
                  <p style={{ textAlign: 'justify', marginBottom: '12px' }}>
                    I, <strong>{or(common.fullName, '[Full Name]')}</strong>, the above-named deponent, do hereby
                    verify that the contents of the above affidavit are true and correct to the best of my
                    knowledge and belief, and nothing material has been concealed therefrom.
                  </p>
                  <p style={{ marginBottom: '28px' }}>
                    Verified at <strong>{or(common.place, '[Place]')}</strong> on this{' '}
                    <strong>{formatDate(common.date)}</strong>.
                  </p>
                </div>

                {/* Signature Block */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ borderBottom: '1px solid #333', width: '200px', marginBottom: '6px', height: '40px' }} />
                    <p style={{ fontWeight: 'bold', fontSize: '14px', margin: '0 0 2px 0' }}>DEPONENT</p>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                      ({or(common.fullName, '[Full Name]')})
                    </p>
                  </div>
                </div>

                {/* Notary Section */}
                <div style={{ marginTop: '48px', paddingTop: '16px', borderTop: '1px dashed #ccc' }}>
                  <p style={{ fontSize: '13px', color: '#555', marginBottom: '6px' }}>Before me,</p>
                  <div style={{ marginTop: '36px' }}>
                    <div style={{ borderBottom: '1px solid #333', width: '220px', marginBottom: '6px' }} />
                    <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', margin: 0 }}>
                      Notary Public / Oath Commissioner
                    </p>
                    <p style={{ fontSize: '11px', color: '#888', margin: '4px 0 0 0' }}>
                      (Seal & Signature)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
