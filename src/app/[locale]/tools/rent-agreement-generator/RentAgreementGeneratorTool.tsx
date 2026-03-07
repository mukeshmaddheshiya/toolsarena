'use client';

import { useState, useCallback, useRef } from 'react';
import {
  FileText, Download, Building2, User, Calendar, MapPin, IndianRupee,
  Shield, CheckCircle2, ChevronRight, ChevronLeft, RotateCcw, Eye,
  Home, Briefcase, PawPrint, Car, Wrench, Lock, Plus, Trash2, Copy, Check,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface LandlordInfo {
  name: string;
  fatherName: string;
  address: string;
  phone: string;
  aadhaar: string;
  pan: string;
}

interface TenantInfo {
  name: string;
  fatherName: string;
  address: string;
  phone: string;
  aadhaar: string;
  occupation: string;
}

interface PropertyInfo {
  address: string;
  city: string;
  state: string;
  pincode: string;
  propertyType: 'apartment' | 'house' | 'room' | 'shop' | 'office';
  furnishing: 'unfurnished' | 'semi-furnished' | 'fully-furnished';
  area: string;
  areaUnit: 'sqft' | 'sqm';
  floor: string;
}

interface AgreementTerms {
  startDate: string;
  duration: '11' | '12' | '24' | '36' | 'custom';
  customMonths: string;
  monthlyRent: string;
  securityDeposit: string;
  maintenanceAmount: string;
  maintenanceIncluded: boolean;
  rentDueDay: string;
  annualIncrement: string;
  lockInMonths: string;
  noticePeriod: '1' | '2' | '3';
  paymentMode: 'Bank Transfer' | 'UPI' | 'Cash' | 'Cheque';
}

interface Clauses {
  petsAllowed: boolean;
  parkingIncluded: boolean;
  parkingDetails: string;
  sublettingAllowed: boolean;
  commercialUseAllowed: boolean;
  smokingAllowed: boolean;
  majorRepairByLandlord: boolean;
  additionalClauses: string[];
}

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

const STAMP_DUTY_INFO: Record<string, string> = {
  'Maharashtra': 'Stamp duty: 0.25% of total rent for agreement period. E-stamping mandatory.',
  'Karnataka': 'Stamp duty: 1% of annual rent. Registration mandatory for 12+ months.',
  'Delhi': 'Stamp paper: Rs 100 for up to 5 years. Rs 110 for 5-10 years.',
  'Tamil Nadu': 'Stamp duty: 1% of annual rent. Registration within 4 months.',
  'Telangana': 'Stamp duty: 0.4% of total rent. E-stamping available.',
  'Gujarat': 'Stamp duty: 1% of annual rent. Registration for 12+ months.',
  'Uttar Pradesh': 'Stamp paper: Rs 100 for 11 months. Registration optional.',
  'Rajasthan': 'Stamp duty: 1% of annual rent + registration fee.',
  'West Bengal': 'Stamp duty: 0.25% or Rs 1 per Rs 400 of annual rent.',
  'Kerala': 'Stamp duty: Rs 100 for up to 1 year. Higher for longer terms.',
  'Haryana': 'Stamp paper: Rs 100 for 11 months. Registration for 12+ months.',
  'Punjab': 'Stamp duty: 1% of annual rent. Registration for 12+ months.',
  'Madhya Pradesh': 'Stamp duty: 2% of annual rent. Registration mandatory.',
  'Bihar': 'Stamp duty: 2% of annual rent + registration fee.',
};

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment/Flat', icon: Building2 },
  { value: 'house', label: 'Independent House', icon: Home },
  { value: 'room', label: 'Single Room/PG', icon: Home },
  { value: 'shop', label: 'Shop/Commercial', icon: Briefcase },
  { value: 'office', label: 'Office Space', icon: Briefcase },
] as const;

const STEPS = ['Landlord', 'Tenant', 'Property', 'Terms', 'Clauses', 'Preview'];

const inputCls = 'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition';
const selectCls = inputCls;
const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string): string {
  if (!dateStr) return '___________';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function getEndDate(startDate: string, months: number): string {
  if (!startDate) return '___________';
  const d = new Date(startDate + 'T00:00:00');
  d.setMonth(d.getMonth() + months);
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatCurrency(amount: string | number): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(n) || n === 0) return 'Rs. ___________';
  return `Rs. ${n.toLocaleString('en-IN')}/-`;
}

function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  function convert(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  }
  return convert(Math.round(num)) + ' Only';
}

function maskAadhaar(aadhaar: string): string {
  const clean = aadhaar.replace(/\D/g, '');
  if (clean.length < 8) return aadhaar;
  return 'XXXX-XXXX-' + clean.slice(-4);
}

/* ------------------------------------------------------------------ */
/*  FIELD COMPONENT                                                    */
/* ------------------------------------------------------------------ */

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GENERATE AGREEMENT TEXT                                            */
/* ------------------------------------------------------------------ */

function generateAgreementText(
  landlord: LandlordInfo,
  tenant: TenantInfo,
  property: PropertyInfo,
  terms: AgreementTerms,
  clauses: Clauses,
): string {
  const months = terms.duration === 'custom' ? parseInt(terms.customMonths) || 11 : parseInt(terms.duration);
  const rent = parseFloat(terms.monthlyRent) || 0;
  const deposit = parseFloat(terms.securityDeposit) || 0;
  const maintenance = terms.maintenanceIncluded ? 0 : (parseFloat(terms.maintenanceAmount) || 0);
  const increment = parseFloat(terms.annualIncrement) || 0;
  const lockIn = parseInt(terms.lockInMonths) || 0;
  const propType = PROPERTY_TYPES.find(p => p.value === property.propertyType)?.label || 'Property';
  const furnishing = property.furnishing === 'fully-furnished' ? 'fully furnished' : property.furnishing === 'semi-furnished' ? 'semi-furnished' : 'unfurnished';

  let text = `RENT AGREEMENT / LEASE DEED

This Rent Agreement is executed on ${formatDate(terms.startDate)} at ${property.city || '___________'}, ${property.state || '___________'}.

BETWEEN

${landlord.name || '___________'}, S/o / D/o ${landlord.fatherName || '___________'}, residing at ${landlord.address || '___________'}, hereinafter referred to as the "LANDLORD" (which expression shall include his/her heirs, successors, executors, and assigns) of the FIRST PART.

AND

${tenant.name || '___________'}, S/o / D/o ${tenant.fatherName || '___________'}, residing at ${tenant.address || '___________'}, hereinafter referred to as the "TENANT" (which expression shall include his/her heirs, successors, executors, and assigns) of the SECOND PART.

WHEREAS the Landlord is the owner of the ${propType} situated at ${property.address || '___________'}, ${property.city || '___________'}, ${property.state || '___________'} - ${property.pincode || '___________'}${property.area ? ` measuring approximately ${property.area} ${property.areaUnit}` : ''}${property.floor ? ` on Floor ${property.floor}` : ''} (hereinafter referred to as the "Premises").

AND WHEREAS the Landlord has agreed to let out and the Tenant has agreed to take on rent the said Premises on the terms and conditions mentioned hereunder.

NOW THEREFORE, in consideration of the mutual covenants and agreements herein contained, the parties agree as follows:

1. TERM OF AGREEMENT
   This Agreement shall be for a period of ${months} months, commencing from ${formatDate(terms.startDate)} and ending on ${getEndDate(terms.startDate, months)}, unless terminated earlier by either party as per the terms herein.

2. RENT
   The Tenant shall pay a monthly rent of ${formatCurrency(terms.monthlyRent)} (Rupees ${rent > 0 ? numberToWords(rent) : '___________'}) to the Landlord.${maintenance > 0 ? `\n   Additionally, a monthly maintenance charge of ${formatCurrency(terms.maintenanceAmount)} shall be payable by the Tenant.` : terms.maintenanceIncluded ? '\n   The maintenance charges are included in the monthly rent.' : ''}
   The rent shall be payable on or before the ${terms.rentDueDay || '5'}th of each month via ${terms.paymentMode}.

3. SECURITY DEPOSIT
   The Tenant has deposited a sum of ${formatCurrency(terms.securityDeposit)} (Rupees ${deposit > 0 ? numberToWords(deposit) : '___________'}) as refundable security deposit with the Landlord.
   This deposit shall be refunded to the Tenant at the time of vacating the Premises, after deducting any outstanding rent, utility bills, or damages to the property, if any, within 30 days of vacating.

4. ANNUAL RENT INCREMENT
   ${increment > 0 ? `The rent shall be increased by ${increment}% annually from the date of commencement of this Agreement.` : 'There shall be no annual increment in rent during the term of this Agreement.'}

5. LOCK-IN PERIOD
   ${lockIn > 0 ? `Neither party shall terminate this Agreement during the first ${lockIn} months ("Lock-in Period"). Any termination during the lock-in period shall require the defaulting party to pay ${lockIn} month(s) rent as compensation.` : 'There is no lock-in period. Either party may terminate this Agreement as per the notice period mentioned herein.'}

6. NOTICE PERIOD
   Either party may terminate this Agreement by giving ${terms.noticePeriod} month(s) prior written notice to the other party.

7. PROPERTY CONDITION
   The Premises is let out in ${furnishing} condition. The Tenant shall maintain the Premises in good condition and shall not make any structural alterations without the prior written consent of the Landlord.

8. UTILITIES
   The Tenant shall be responsible for payment of all utility bills including electricity, water, gas, internet, and any other services consumed during the tenancy period.

9. REPAIRS AND MAINTENANCE
   ${clauses.majorRepairByLandlord ? 'Major repairs (structural, plumbing, electrical wiring) shall be the responsibility of the Landlord. Minor repairs and day-to-day maintenance shall be borne by the Tenant.' : 'All minor repairs and day-to-day maintenance of the Premises shall be the responsibility of the Tenant.'}

10. SUB-LETTING
    The Tenant shall ${clauses.sublettingAllowed ? 'be permitted to' : 'NOT'} sub-let, assign, or transfer the Premises or any part thereof to any third party ${clauses.sublettingAllowed ? 'with prior written consent of the Landlord' : 'under any circumstances'}.`;

  let clauseNum = 11;

  if (property.propertyType !== 'shop' && property.propertyType !== 'office') {
    text += `\n\n${clauseNum}. USE OF PREMISES
    The Premises shall be used for residential purposes only. The Tenant shall ${clauses.commercialUseAllowed ? 'be permitted to use a portion for work-from-home activities' : 'NOT use the Premises for any commercial, illegal, or immoral purpose'}.`;
    clauseNum++;
  }

  text += `\n\n${clauseNum}. PETS
    ${clauses.petsAllowed ? 'The Tenant is permitted to keep domestic pets in the Premises, provided they do not cause nuisance to other residents or damage to the property.' : 'The Tenant shall NOT keep any pets in the Premises without prior written consent of the Landlord.'}`;
  clauseNum++;

  if (clauses.parkingIncluded) {
    text += `\n\n${clauseNum}. PARKING
    ${clauses.parkingDetails ? `The Landlord shall provide parking: ${clauses.parkingDetails}.` : 'The Landlord shall provide one designated parking space for the Tenant.'}`;
    clauseNum++;
  }

  text += `\n\n${clauseNum}. SMOKING
    ${clauses.smokingAllowed ? 'Smoking is permitted in designated areas of the Premises only.' : 'Smoking is strictly prohibited inside the Premises.'}`;
  clauseNum++;

  text += `\n\n${clauseNum}. RIGHT OF INSPECTION
    The Landlord or his/her authorized agent shall have the right to inspect the Premises at reasonable hours after giving prior notice of at least 24 hours to the Tenant.`;
  clauseNum++;

  text += `\n\n${clauseNum}. VACATING THE PREMISES
    Upon expiry or termination of this Agreement, the Tenant shall vacate the Premises and hand over possession in the same condition as received (subject to normal wear and tear) along with all keys, fittings, and fixtures belonging to the Landlord.`;
  clauseNum++;

  text += `\n\n${clauseNum}. DISPUTE RESOLUTION
    Any dispute arising out of this Agreement shall be resolved amicably through mutual negotiation. In case of failure, the matter shall be referred to the courts having jurisdiction at ${property.city || '___________'}, ${property.state || '___________'}.`;
  clauseNum++;

  if (clauses.additionalClauses.length > 0) {
    text += `\n\n${clauseNum}. ADDITIONAL TERMS`;
    clauses.additionalClauses.forEach((c, i) => {
      text += `\n    ${String.fromCharCode(97 + i)}) ${c}`;
    });
    clauseNum++;
  }

  text += `\n\n${clauseNum}. GENERAL
    a) This Agreement constitutes the entire understanding between the parties.
    b) Any modification to this Agreement must be in writing and signed by both parties.
    c) Both parties have read, understood, and agreed to the terms and conditions mentioned above.
    d) This Agreement is executed in duplicate — one copy for each party.`;

  text += `\n\nIN WITNESS WHEREOF, the parties have set their hands on this Agreement on the date first mentioned above.


LANDLORD                                    TENANT

Signature: _________________               Signature: _________________

Name: ${landlord.name || '___________'}                              Name: ${tenant.name || '___________'}

Phone: ${landlord.phone || '___________'}                            Phone: ${tenant.phone || '___________'}

${landlord.aadhaar ? `Aadhaar: ${maskAadhaar(landlord.aadhaar)}` : 'Aadhaar: ___________'}                          ${tenant.aadhaar ? `Aadhaar: ${maskAadhaar(tenant.aadhaar)}` : 'Aadhaar: ___________'}


WITNESS 1                                   WITNESS 2

Signature: _________________               Signature: _________________

Name: _________________________            Name: _________________________

Address: ______________________            Address: ______________________`;

  return text;
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function RentAgreementGeneratorTool() {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [landlord, setLandlord] = useState<LandlordInfo>({
    name: '', fatherName: '', address: '', phone: '', aadhaar: '', pan: '',
  });
  const [tenant, setTenant] = useState<TenantInfo>({
    name: '', fatherName: '', address: '', phone: '', aadhaar: '', occupation: '',
  });
  const [property, setProperty] = useState<PropertyInfo>({
    address: '', city: '', state: 'Maharashtra', pincode: '',
    propertyType: 'apartment', furnishing: 'semi-furnished',
    area: '', areaUnit: 'sqft', floor: '',
  });
  const [terms, setTerms] = useState<AgreementTerms>({
    startDate: new Date().toISOString().slice(0, 10),
    duration: '11', customMonths: '11',
    monthlyRent: '', securityDeposit: '', maintenanceAmount: '',
    maintenanceIncluded: false, rentDueDay: '5', annualIncrement: '5',
    lockInMonths: '6', noticePeriod: '1', paymentMode: 'Bank Transfer',
  });
  const [clauses, setClauses] = useState<Clauses>({
    petsAllowed: false, parkingIncluded: true, parkingDetails: '',
    sublettingAllowed: false, commercialUseAllowed: false,
    smokingAllowed: false, majorRepairByLandlord: true,
    additionalClauses: [],
  });
  const [newClause, setNewClause] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  const ul = (k: keyof LandlordInfo, v: string) => setLandlord(p => ({ ...p, [k]: v }));
  const ut = (k: keyof TenantInfo, v: string) => setTenant(p => ({ ...p, [k]: v }));
  const up = (k: keyof PropertyInfo, v: string) => setProperty(p => ({ ...p, [k]: v }));
  const uterms = (k: keyof AgreementTerms, v: string | boolean) => setTerms(p => ({ ...p, [k]: v }));
  const uc = (k: keyof Clauses, v: boolean | string | string[]) => setClauses(p => ({ ...p, [k]: v }));

  const addClause = () => {
    if (newClause.trim()) {
      setClauses(p => ({ ...p, additionalClauses: [...p.additionalClauses, newClause.trim()] }));
      setNewClause('');
    }
  };
  const removeClause = (i: number) => {
    setClauses(p => ({ ...p, additionalClauses: p.additionalClauses.filter((_, idx) => idx !== i) }));
  };

  const agreementText = generateAgreementText(landlord, tenant, property, terms, clauses);

  const downloadPDF = useCallback(async () => {
    setDownloading(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.TimesRoman);
      const boldFont = await doc.embedFont(StandardFonts.TimesRomanBold);

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 60;
      const maxWidth = pageWidth - 2 * margin;
      const fontSize = 11;
      const lineHeight = fontSize * 1.5;
      const titleFontSize = 16;

      const lines = agreementText.split('\n');
      let page = doc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      const addNewPage = () => {
        page = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      };

      for (const rawLine of lines) {
        const line = rawLine.trimEnd();

        if (y < margin + lineHeight) addNewPage();

        // Title line
        if (line === 'RENT AGREEMENT / LEASE DEED') {
          const tw = boldFont.widthOfTextAtSize(line, titleFontSize);
          page.drawText(line, { x: (pageWidth - tw) / 2, y, size: titleFontSize, font: boldFont, color: rgb(0.05, 0.15, 0.4) });
          y -= titleFontSize * 2;
          continue;
        }

        // Section headers (numbered items)
        const isHeader = /^\d+\.\s+[A-Z]/.test(line.trim());
        const isBetween = line.trim() === 'BETWEEN' || line.trim() === 'AND' || line.trim().startsWith('IN WITNESS');
        const isSignature = line.trim().startsWith('LANDLORD') || line.trim().startsWith('TENANT') || line.trim().startsWith('WITNESS');
        const useFont = isHeader || isBetween || isSignature ? boldFont : font;
        const useFontSize = isHeader ? fontSize + 1 : fontSize;

        if (line.trim() === '') {
          y -= lineHeight * 0.5;
          continue;
        }

        // Word wrap
        const words = line.split(' ');
        let currentLine = '';
        for (const word of words) {
          const testLine = currentLine ? currentLine + ' ' + word : word;
          const testWidth = useFont.widthOfTextAtSize(testLine, useFontSize);
          if (testWidth > maxWidth && currentLine) {
            if (y < margin + lineHeight) addNewPage();
            page.drawText(currentLine, { x: margin, y, size: useFontSize, font: useFont, color: rgb(0.1, 0.1, 0.1) });
            y -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          if (y < margin + lineHeight) addNewPage();
          page.drawText(currentLine, { x: margin, y, size: useFontSize, font: useFont, color: rgb(0.1, 0.1, 0.1) });
          y -= lineHeight;
        }
      }

      const pdfBytes = await doc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Rent-Agreement-${landlord.name || 'Draft'}-${tenant.name || 'Draft'}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setDownloading(false);
    }
  }, [agreementText, landlord.name, tenant.name]);

  const copyText = useCallback(() => {
    navigator.clipboard.writeText(agreementText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [agreementText]);

  const downloadText = useCallback(() => {
    const blob = new Blob([agreementText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Rent-Agreement-${landlord.name || 'Draft'}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [agreementText, landlord.name]);

  const reset = () => {
    setLandlord({ name: '', fatherName: '', address: '', phone: '', aadhaar: '', pan: '' });
    setTenant({ name: '', fatherName: '', address: '', phone: '', aadhaar: '', occupation: '' });
    setProperty({ address: '', city: '', state: 'Maharashtra', pincode: '', propertyType: 'apartment', furnishing: 'semi-furnished', area: '', areaUnit: 'sqft', floor: '' });
    setTerms({ startDate: new Date().toISOString().slice(0, 10), duration: '11', customMonths: '11', monthlyRent: '', securityDeposit: '', maintenanceAmount: '', maintenanceIncluded: false, rentDueDay: '5', annualIncrement: '5', lockInMonths: '6', noticePeriod: '1', paymentMode: 'Bank Transfer' });
    setClauses({ petsAllowed: false, parkingIncluded: true, parkingDetails: '', sublettingAllowed: false, commercialUseAllowed: false, smokingAllowed: false, majorRepairByLandlord: true, additionalClauses: [] });
    setStep(0);
  };

  const stampInfo = STAMP_DUTY_INFO[property.state];
  const durationMonths = terms.duration === 'custom' ? parseInt(terms.customMonths) || 11 : parseInt(terms.duration);
  const totalRent = (parseFloat(terms.monthlyRent) || 0) * durationMonths;

  /* --- Render Steps --- */
  const renderStep = () => {
    switch (step) {
      case 0: // Landlord
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold mb-3">
              <Building2 className="w-5 h-5" /> Landlord / Owner Details
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Full Name" required>
                <input className={inputCls} value={landlord.name} onChange={e => ul('name', e.target.value)} placeholder="e.g. Rajesh Kumar Sharma" />
              </Field>
              <Field label="Father's / Husband's Name">
                <input className={inputCls} value={landlord.fatherName} onChange={e => ul('fatherName', e.target.value)} placeholder="e.g. Ramesh Sharma" />
              </Field>
            </div>
            <Field label="Permanent Address" required>
              <input className={inputCls} value={landlord.address} onChange={e => ul('address', e.target.value)} placeholder="Full residential address" />
            </Field>
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Phone Number">
                <input className={inputCls} value={landlord.phone} onChange={e => ul('phone', e.target.value)} placeholder="+91 98765 43210" />
              </Field>
              <Field label="Aadhaar Number">
                <input className={inputCls} value={landlord.aadhaar} onChange={e => ul('aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="1234 5678 9012" />
              </Field>
              <Field label="PAN (if rent > 1L/yr)">
                <input className={inputCls} value={landlord.pan} onChange={e => ul('pan', e.target.value.toUpperCase().slice(0, 10))} placeholder="ABCDE1234F" />
              </Field>
            </div>
          </div>
        );

      case 1: // Tenant
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold mb-3">
              <User className="w-5 h-5" /> Tenant / Lessee Details
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Full Name" required>
                <input className={inputCls} value={tenant.name} onChange={e => ut('name', e.target.value)} placeholder="e.g. Priya Gupta" />
              </Field>
              <Field label="Father's / Husband's Name">
                <input className={inputCls} value={tenant.fatherName} onChange={e => ut('fatherName', e.target.value)} placeholder="e.g. Suresh Gupta" />
              </Field>
            </div>
            <Field label="Permanent Address" required>
              <input className={inputCls} value={tenant.address} onChange={e => ut('address', e.target.value)} placeholder="Full residential address (different from rented property)" />
            </Field>
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Phone Number">
                <input className={inputCls} value={tenant.phone} onChange={e => ut('phone', e.target.value)} placeholder="+91 98765 43210" />
              </Field>
              <Field label="Aadhaar Number">
                <input className={inputCls} value={tenant.aadhaar} onChange={e => ut('aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="1234 5678 9012" />
              </Field>
              <Field label="Occupation">
                <input className={inputCls} value={tenant.occupation} onChange={e => ut('occupation', e.target.value)} placeholder="e.g. Software Engineer" />
              </Field>
            </div>
          </div>
        );

      case 2: // Property
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold mb-3">
              <Home className="w-5 h-5" /> Property Details
            </div>

            {/* Property Type Selection */}
            <div>
              <label className={labelCls}>Property Type</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {PROPERTY_TYPES.map(pt => {
                  const Icon = pt.icon;
                  const active = property.propertyType === pt.value;
                  return (
                    <button key={pt.value} type="button" onClick={() => up('propertyType', pt.value)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${active ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'border-slate-200 dark:border-slate-600 hover:border-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-center leading-tight">{pt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Field label="Full Property Address" required>
              <input className={inputCls} value={property.address} onChange={e => up('address', e.target.value)} placeholder="Flat No, Floor, Building Name, Street, Area" />
            </Field>

            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="City" required>
                <input className={inputCls} value={property.city} onChange={e => up('city', e.target.value)} placeholder="e.g. Mumbai" />
              </Field>
              <Field label="State" required>
                <select className={selectCls} value={property.state} onChange={e => up('state', e.target.value)}>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="PIN Code">
                <input className={inputCls} value={property.pincode} onChange={e => up('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="400001" />
              </Field>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Furnishing">
                <select className={selectCls} value={property.furnishing} onChange={e => up('furnishing', e.target.value)}>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="fully-furnished">Fully Furnished</option>
                </select>
              </Field>
              <Field label="Area">
                <div className="flex gap-1.5">
                  <input className={inputCls} value={property.area} onChange={e => up('area', e.target.value)} placeholder="e.g. 950" />
                  <select className={selectCls + ' w-24 shrink-0'} value={property.areaUnit} onChange={e => up('areaUnit', e.target.value)}>
                    <option value="sqft">sq.ft</option>
                    <option value="sqm">sq.m</option>
                  </select>
                </div>
              </Field>
              <Field label="Floor">
                <input className={inputCls} value={property.floor} onChange={e => up('floor', e.target.value)} placeholder="e.g. 3rd" />
              </Field>
            </div>

            {/* Stamp duty info */}
            {stampInfo && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-300">
                <Shield className="w-4 h-4 mt-0.5 shrink-0" />
                <div><strong>{property.state} Stamp Duty:</strong> {stampInfo}</div>
              </div>
            )}
          </div>
        );

      case 3: // Terms
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold mb-3">
              <IndianRupee className="w-5 h-5" /> Rent & Terms
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Agreement Start Date" required>
                <input type="date" className={inputCls} value={terms.startDate} onChange={e => uterms('startDate', e.target.value)} />
              </Field>
              <Field label="Duration">
                <select className={selectCls} value={terms.duration} onChange={e => uterms('duration', e.target.value)}>
                  <option value="11">11 Months (Standard)</option>
                  <option value="12">12 Months</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="36">36 Months (3 Years)</option>
                  <option value="custom">Custom</option>
                </select>
              </Field>
            </div>

            {terms.duration === 'custom' && (
              <Field label="Custom Duration (Months)">
                <input type="number" min={1} max={120} className={inputCls} value={terms.customMonths} onChange={e => uterms('customMonths', e.target.value)} />
              </Field>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Monthly Rent (Rs.)" required>
                <input type="number" min={0} className={inputCls} value={terms.monthlyRent} onChange={e => uterms('monthlyRent', e.target.value)} placeholder="e.g. 25000" />
              </Field>
              <Field label="Security Deposit (Rs.)" required>
                <input type="number" min={0} className={inputCls} value={terms.securityDeposit} onChange={e => uterms('securityDeposit', e.target.value)} placeholder="e.g. 50000" />
              </Field>
            </div>

            {/* Maintenance */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="maintInc" checked={terms.maintenanceIncluded}
                  onChange={e => uterms('maintenanceIncluded', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="maintInc" className="text-sm text-slate-700 dark:text-slate-300">Maintenance included in rent</label>
              </div>
              {!terms.maintenanceIncluded && (
                <Field label="Monthly Maintenance (Rs.)">
                  <input type="number" min={0} className={inputCls} value={terms.maintenanceAmount} onChange={e => uterms('maintenanceAmount', e.target.value)} placeholder="e.g. 3000" />
                </Field>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Rent Due Day">
                <select className={selectCls} value={terms.rentDueDay} onChange={e => uterms('rentDueDay', e.target.value)}>
                  {[1, 5, 7, 10, 15].map(d => <option key={d} value={String(d)}>{d}th of month</option>)}
                </select>
              </Field>
              <Field label="Annual Increment (%)">
                <select className={selectCls} value={terms.annualIncrement} onChange={e => uterms('annualIncrement', e.target.value)}>
                  <option value="0">No Increment</option>
                  {[3, 5, 7, 10].map(n => <option key={n} value={String(n)}>{n}%</option>)}
                </select>
              </Field>
              <Field label="Lock-in (Months)">
                <select className={selectCls} value={terms.lockInMonths} onChange={e => uterms('lockInMonths', e.target.value)}>
                  <option value="0">No Lock-in</option>
                  {[3, 6, 9, 12].map(n => <option key={n} value={String(n)}>{n} Months</option>)}
                </select>
              </Field>
              <Field label="Notice Period">
                <select className={selectCls} value={terms.noticePeriod} onChange={e => uterms('noticePeriod', e.target.value)}>
                  <option value="1">1 Month</option>
                  <option value="2">2 Months</option>
                  <option value="3">3 Months</option>
                </select>
              </Field>
            </div>

            <Field label="Payment Mode">
              <select className={selectCls} value={terms.paymentMode} onChange={e => uterms('paymentMode', e.target.value)}>
                <option value="Bank Transfer">Bank Transfer / NEFT / RTGS</option>
                <option value="UPI">UPI (Google Pay, PhonePe, etc.)</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </Field>

            {/* Summary Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Quick Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-blue-700 dark:text-blue-400">
                <div>Monthly Rent: <strong>{formatCurrency(terms.monthlyRent)}</strong></div>
                <div>Security Deposit: <strong>{formatCurrency(terms.securityDeposit)}</strong></div>
                <div>Duration: <strong>{durationMonths} months</strong></div>
                <div>Total Rent: <strong>{formatCurrency(String(totalRent))}</strong></div>
              </div>
            </div>
          </div>
        );

      case 4: // Clauses
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold mb-3">
              <Shield className="w-5 h-5" /> Additional Clauses
            </div>

            {/* Toggle Clauses */}
            <div className="space-y-3">
              {[
                { key: 'petsAllowed' as const, label: 'Pets Allowed', icon: PawPrint, desc: 'Tenant can keep domestic pets' },
                { key: 'parkingIncluded' as const, label: 'Parking Included', icon: Car, desc: 'Landlord provides parking space' },
                { key: 'sublettingAllowed' as const, label: 'Sub-letting Allowed', icon: Home, desc: 'Tenant can sub-let to others' },
                { key: 'commercialUseAllowed' as const, label: 'Work-from-Home Allowed', icon: Briefcase, desc: 'Use for work-from-home activities' },
                { key: 'smokingAllowed' as const, label: 'Smoking Allowed', icon: Home, desc: 'Smoking permitted in premises' },
                { key: 'majorRepairByLandlord' as const, label: 'Major Repairs by Landlord', icon: Wrench, desc: 'Structural repairs by owner' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <div>
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                      </div>
                    </div>
                    <button type="button" onClick={() => uc(item.key, !clauses[item.key])}
                      className={`relative w-11 h-6 rounded-full transition-colors ${clauses[item.key] ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${clauses[item.key] ? 'left-[22px]' : 'left-0.5'}`} />
                    </button>
                  </div>
                );
              })}
            </div>

            {clauses.parkingIncluded && (
              <Field label="Parking Details (optional)">
                <input className={inputCls} value={clauses.parkingDetails} onChange={e => uc('parkingDetails', e.target.value)} placeholder="e.g. One covered car parking in basement" />
              </Field>
            )}

            {/* Custom Clauses */}
            <div className="space-y-2 pt-2">
              <label className={labelCls}>Custom Clauses</label>
              <div className="flex gap-2">
                <input className={inputCls} value={newClause} onChange={e => setNewClause(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addClause()}
                  placeholder="e.g. Tenant shall not alter wall paint colors" />
                <button type="button" onClick={addClause}
                  className="shrink-0 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {clauses.additionalClauses.map((c, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm">
                  <span className="flex-1 text-slate-700 dark:text-slate-300">{i + 1}. {c}</span>
                  <button type="button" onClick={() => removeClause(i)} className="text-red-500 hover:text-red-700 shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 5: // Preview
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold">
                <Eye className="w-5 h-5" /> Preview & Download
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={downloadPDF} disabled={downloading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition">
                  <Download className="w-4 h-4" /> {downloading ? 'Generating...' : 'PDF'}
                </button>
                <button onClick={downloadText}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 text-sm font-medium transition">
                  <FileText className="w-4 h-4" /> TXT
                </button>
                <button onClick={copyText}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 text-sm font-medium transition">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Privacy notice */}
            <div className="flex items-center gap-2 p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-xs text-green-700 dark:text-green-400">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              100% private — all data stays in your browser. Nothing is sent to any server.
            </div>

            {/* Agreement Preview */}
            <div ref={previewRef} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-6 max-h-[70vh] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-serif text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 break-words">
                {agreementText}
              </pre>
            </div>

            {/* Stamp duty reminder */}
            {stampInfo && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-300">
                <Shield className="w-4 h-4 mt-0.5 shrink-0" />
                <div><strong>Remember:</strong> {stampInfo} Print this agreement on appropriate stamp paper and get it notarized if required.</div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Rent Agreement Generator</h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-0.5">Create legally formatted rental agreements in minutes. Free PDF download.</p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => setStep(i)}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              i === step
                ? 'bg-blue-600 text-white'
                : i < step
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}>
            {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">{i + 1}</span>}
            <span className="hidden sm:inline">{s}</span>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-40">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2.5 text-slate-500 hover:text-red-600 text-sm transition">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>

        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(step + 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={downloadPDF} disabled={downloading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition disabled:opacity-50">
            <Download className="w-4 h-4" /> {downloading ? 'Generating...' : 'Download PDF'}
          </button>
        )}
      </div>
    </div>
  );
}
