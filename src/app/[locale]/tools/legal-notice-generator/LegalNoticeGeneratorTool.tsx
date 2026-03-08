'use client';

import { useState, useRef, useCallback } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Scale,
  Sparkles,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type NoticeType =
  | 'cheque-bounce'
  | 'recovery'
  | 'rent-eviction'
  | 'breach-of-contract'
  | 'defamation'
  | 'property-dispute';

interface SenderDetails {
  name: string;
  address: string;
  throughAdvocate: boolean;
  advocateName: string;
  enrollmentNumber: string;
}

interface RecipientDetails {
  name: string;
  address: string;
}

interface ChequeBounceFields {
  chequeNumber: string;
  amount: string;
  chequeDate: string;
  bankName: string;
  presentationDate: string;
  dishonorReason: string;
}

interface RecoveryFields {
  amountOwed: string;
  transactionDate: string;
  natureOfTransaction: string;
}

interface RentEvictionFields {
  propertyAddress: string;
  rentAmount: string;
  monthsPending: string;
  agreementDate: string;
}

interface BreachFields {
  contractDate: string;
  natureOfContract: string;
  breachDescription: string;
}

interface DefamationFields {
  incidentDate: string;
  medium: string;
  description: string;
}

interface PropertyDisputeFields {
  propertyDetails: string;
  natureOfDispute: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const NOTICE_TYPES: { key: NoticeType; label: string; section: string }[] = [
  { key: 'cheque-bounce', label: 'Cheque Bounce', section: 'Sec 138, Negotiable Instruments Act, 1881' },
  { key: 'recovery', label: 'Recovery of Money', section: 'Order XXXVII, CPC' },
  { key: 'rent-eviction', label: 'Rent Eviction', section: 'Transfer of Property Act, 1882' },
  { key: 'breach-of-contract', label: 'Breach of Contract', section: 'Sec 73, Indian Contract Act, 1872' },
  { key: 'defamation', label: 'Defamation', section: 'Sec 499 & 500, Indian Penal Code' },
  { key: 'property-dispute', label: 'Property Dispute', section: 'Specific Relief Act, 1963' },
];

const DEADLINE_OPTIONS = [
  { value: 15, label: '15 Days' },
  { value: 30, label: '30 Days' },
];

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(iso: string) {
  if (!iso) return '___________';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatCurrency(v: string) {
  const n = parseFloat(v);
  if (isNaN(n)) return '___________';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

// ─── Example Data ────────────────────────────────────────────────────────────

function getExampleData() {
  return {
    sender: {
      name: 'Rajesh Kumar Sharma',
      address: '45, MG Road, Connaught Place, New Delhi - 110001',
      throughAdvocate: true,
      advocateName: 'Adv. Priya Mehta',
      enrollmentNumber: 'D/1234/2020',
    },
    recipient: {
      name: 'Suresh Babu Agarwal',
      address: '78, Nehru Nagar, Sector 15, Gurugram, Haryana - 122001',
    },
    noticeType: 'cheque-bounce' as NoticeType,
    chequeBounce: {
      chequeNumber: '456789',
      amount: '500000',
      chequeDate: '2026-01-15',
      bankName: 'State Bank of India',
      presentationDate: '2026-02-01',
      dishonorReason: 'Insufficient Funds',
    },
    noticeDate: todayISO(),
    deadline: 15,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function LegalNoticeGeneratorTool() {
  const previewRef = useRef<HTMLDivElement>(null);
  const previewPanelRef = useRef<HTMLDivElement>(null);

  // State
  const [noticeType, setNoticeType] = useState<NoticeType>('cheque-bounce');
  const [sender, setSender] = useState<SenderDetails>({
    name: '', address: '', throughAdvocate: false, advocateName: '', enrollmentNumber: '',
  });
  const [recipient, setRecipient] = useState<RecipientDetails>({ name: '', address: '' });
  const [noticeDate, setNoticeDate] = useState(todayISO());
  const [deadline, setDeadline] = useState(15);

  const [chequeBounce, setChequeBounce] = useState<ChequeBounceFields>({
    chequeNumber: '', amount: '', chequeDate: '', bankName: '', presentationDate: '', dishonorReason: '',
  });
  const [recovery, setRecovery] = useState<RecoveryFields>({
    amountOwed: '', transactionDate: '', natureOfTransaction: '',
  });
  const [rentEviction, setRentEviction] = useState<RentEvictionFields>({
    propertyAddress: '', rentAmount: '', monthsPending: '', agreementDate: '',
  });
  const [breach, setBreach] = useState<BreachFields>({
    contractDate: '', natureOfContract: '', breachDescription: '',
  });
  const [defamation, setDefamation] = useState<DefamationFields>({
    incidentDate: '', medium: 'written', description: '',
  });
  const [propertyDispute, setPropertyDispute] = useState<PropertyDisputeFields>({
    propertyDetails: '', natureOfDispute: '',
  });

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  // Helpers
  const or = (v: string, fallback = '___________') => v.trim() || fallback;
  const currentSection = NOTICE_TYPES.find(t => t.key === noticeType)!.section;

  const loadExample = useCallback(() => {
    const ex = getExampleData();
    setSender(ex.sender);
    setRecipient(ex.recipient);
    setNoticeType(ex.noticeType);
    setChequeBounce(ex.chequeBounce);
    setNoticeDate(ex.noticeDate);
    setDeadline(ex.deadline);
  }, []);

  // ─── Generate notice body paragraphs ───────────────────────────────────────

  function getNoticeBody(): string[] {
    const sName = or(sender.name, '[SENDER NAME]');
    const rName = or(recipient.name, '[RECIPIENT NAME]');

    switch (noticeType) {
      case 'cheque-bounce':
        return [
          `TAKE NOTICE THAT my client, ${sName}, is the lawful holder of Cheque No. ${or(chequeBounce.chequeNumber, '[CHEQUE NO.]')} dated ${formatDate(chequeBounce.chequeDate)} for an amount of ${formatCurrency(chequeBounce.amount)} drawn on ${or(chequeBounce.bankName, '[BANK NAME]')} issued by you, ${rName}, towards discharge of a legally enforceable debt/liability.`,
          `That the said cheque was presented for encashment on ${formatDate(chequeBounce.presentationDate)} but was dishonored and returned unpaid with the remark "${or(chequeBounce.dishonorReason, '[REASON]')}". A memo of dishonor was received by my client from the bank.`,
          `That under Section 138 of the Negotiable Instruments Act, 1881, the dishonor of a cheque issued for the discharge of a debt or liability constitutes a criminal offence punishable with imprisonment up to two years, or with a fine up to twice the amount of the cheque, or both.`,
          `You are hereby called upon to make the payment of the said sum of ${formatCurrency(chequeBounce.amount)} (${or(chequeBounce.amount, '___________')} only) within ${deadline} days from the receipt of this notice, failing which my client shall be constrained to initiate criminal proceedings against you under Section 138 of the NI Act, 1881, at your risk, cost, and consequences.`,
        ];

      case 'recovery':
        return [
          `TAKE NOTICE THAT my client, ${sName}, had advanced/paid a sum of ${formatCurrency(recovery.amountOwed)} to you, ${rName}, on ${formatDate(recovery.transactionDate)} on account of ${or(recovery.natureOfTransaction, '[NATURE OF TRANSACTION]')}.`,
          `That despite repeated requests and assurances given by you, you have failed and neglected to repay the said amount. The said amount is long overdue and is legally recoverable from you.`,
          `You are hereby called upon to pay the outstanding amount of ${formatCurrency(recovery.amountOwed)} along with interest thereon within ${deadline} days from the receipt of this notice, failing which my client shall be compelled to initiate appropriate legal proceedings, including filing a civil suit for recovery of money and damages, at your risk, cost, and consequences.`,
        ];

      case 'rent-eviction':
        return [
          `TAKE NOTICE THAT my client, ${sName}, is the lawful owner/landlord of the premises situated at ${or(rentEviction.propertyAddress, '[PROPERTY ADDRESS]')}, which has been let out to you, ${rName}, under a rent agreement dated ${formatDate(rentEviction.agreementDate)} at a monthly rent of ${formatCurrency(rentEviction.rentAmount)}.`,
          `That you have failed to pay rent for the last ${or(rentEviction.monthsPending, '___')} months, and the total arrears of rent now stand at ${formatCurrency(String(parseFloat(rentEviction.rentAmount || '0') * parseFloat(rentEviction.monthsPending || '0')))}. Despite repeated oral and written reminders, you have willfully defaulted in payment of rent.`,
          `You are hereby called upon to (a) pay the entire arrears of rent within ${deadline} days of receipt of this notice, and (b) vacate and hand over peaceful possession of the said premises in its original condition, failing which my client shall be constrained to initiate eviction proceedings and a suit for recovery of arrears with damages in the competent court, at your risk, cost, and consequences.`,
        ];

      case 'breach-of-contract':
        return [
          `TAKE NOTICE THAT my client, ${sName}, entered into a contract/agreement with you, ${rName}, dated ${formatDate(breach.contractDate)} pertaining to ${or(breach.natureOfContract, '[NATURE OF CONTRACT]')}.`,
          `That you have committed breach of the said contract by ${or(breach.breachDescription, '[DESCRIPTION OF BREACH]')}. The said breach has caused substantial loss and damage to my client.`,
          `Under Section 73 of the Indian Contract Act, 1872, the party suffering from breach of contract is entitled to receive compensation for any loss or damage caused by such breach.`,
          `You are hereby called upon to remedy the breach and/or compensate my client for all losses and damages suffered within ${deadline} days from receipt of this notice, failing which my client shall be compelled to initiate appropriate civil proceedings for specific performance/damages, at your risk, cost, and consequences.`,
        ];

      case 'defamation':
        return [
          `TAKE NOTICE THAT on ${formatDate(defamation.incidentDate)}, you, ${rName}, made defamatory statements/publications against my client, ${sName}, through ${or(defamation.medium, '[MEDIUM]')}.`,
          `The defamatory content is as follows: ${or(defamation.description, '[DESCRIPTION OF DEFAMATORY CONTENT]')}. The said statements are false, malicious, and have caused irreparable harm to the reputation, goodwill, and standing of my client in society.`,
          `Under Sections 499 and 500 of the Indian Penal Code, defamation is a criminal offence punishable with imprisonment up to two years, or with fine, or both. Further, my client is entitled to claim civil damages for the harm caused to reputation.`,
          `You are hereby called upon to (a) immediately take down/retract the defamatory content, (b) issue a public apology, and (c) pay compensation of a suitable amount within ${deadline} days from receipt of this notice, failing which my client shall initiate both criminal and civil proceedings against you, at your risk, cost, and consequences.`,
        ];

      case 'property-dispute':
        return [
          `TAKE NOTICE THAT my client, ${sName}, is the lawful owner of the property described as: ${or(propertyDispute.propertyDetails, '[PROPERTY DETAILS]')}.`,
          `That you, ${rName}, have ${or(propertyDispute.natureOfDispute, '[NATURE OF DISPUTE - e.g., illegally encroached upon / claimed ownership of / obstructed access to]')} the said property of my client without any legal right or authority.`,
          `Under the Specific Relief Act, 1963, and the Transfer of Property Act, 1882, my client is entitled to the peaceful possession and enjoyment of the said property and to seek injunction and damages against any unlawful interference.`,
          `You are hereby called upon to cease and desist from the said unlawful activities and restore the status quo within ${deadline} days from receipt of this notice, failing which my client shall be compelled to initiate appropriate legal proceedings, including filing a suit for injunction, declaration, and damages, at your risk, cost, and consequences.`,
        ];
    }
  }

  function getFullNoticeText(): string {
    const lines: string[] = [];
    lines.push('LEGAL NOTICE');
    lines.push(`Under ${currentSection}`);
    lines.push('');
    lines.push(`Date: ${formatDate(noticeDate)}`);
    lines.push('');
    if (sender.throughAdvocate && sender.advocateName) {
      lines.push(`Through: ${sender.advocateName}${sender.enrollmentNumber ? `, Enrollment No. ${sender.enrollmentNumber}` : ''}`);
      lines.push('');
    }
    lines.push(`From:\n${or(sender.name, '[SENDER NAME]')}\n${or(sender.address, '[SENDER ADDRESS]')}`);
    lines.push('');
    lines.push(`To:\n${or(recipient.name, '[RECIPIENT NAME]')}\n${or(recipient.address, '[RECIPIENT ADDRESS]')}`);
    lines.push('');
    lines.push(`Subject: Legal Notice under ${currentSection}`);
    lines.push('');
    const body = getNoticeBody();
    body.forEach((p, i) => {
      lines.push(`${i + 1}. ${p}`);
      lines.push('');
    });
    lines.push('This notice is being sent to you through Registered Post A.D. / Speed Post / Hand Delivery and a copy of the same is retained in the office for record and further reference.');
    lines.push('');
    lines.push(`${or(sender.name, '[SENDER NAME]')}`);
    if (sender.throughAdvocate && sender.advocateName) {
      lines.push(`Through: ${sender.advocateName}`);
    }
    lines.push(`Date: ${formatDate(noticeDate)}`);
    lines.push('Place: ___________');
    return lines.join('\n');
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(getFullNoticeText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sender, recipient, noticeType, noticeDate, deadline, chequeBounce, recovery, rentEviction, breach, defamation, propertyDispute]);

  const handleDownload = useCallback(async () => {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    try {
      // On mobile the preview panel may be hidden (hidden lg:block),
      // html2canvas can't capture hidden elements — temporarily reveal it
      const panel = previewPanelRef.current;
      const wasHidden = panel?.classList.contains('hidden');
      if (panel && wasHidden) {
        panel.classList.remove('hidden');
      }

      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });

      // Restore hidden class if it was removed
      if (panel && wasHidden) {
        panel.classList.add('hidden');
      }

      const link = document.createElement('a');
      link.download = `legal-notice-${noticeType}-${noticeDate}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [noticeType, noticeDate, downloading]);

  // ─── Input helpers ─────────────────────────────────────────────────────────

  const inputCls = 'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500';
  const labelCls = 'block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1';

  function Input({ label, value, onChange, placeholder, type = 'text' }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
  }) {
    return (
      <div>
        <label className={labelCls}>{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} className={inputCls} />
      </div>
    );
  }

  function TextArea({ label, value, onChange, placeholder, rows = 2 }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
  }) {
    return (
      <div>
        <label className={labelCls}>{label}</label>
        <textarea value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} rows={rows} className={inputCls + ' resize-none'} />
      </div>
    );
  }

  // ─── Notice-specific fields ────────────────────────────────────────────────

  function renderTypeFields() {
    switch (noticeType) {
      case 'cheque-bounce':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Cheque Number" value={chequeBounce.chequeNumber} onChange={v => setChequeBounce(p => ({ ...p, chequeNumber: v }))} placeholder="e.g. 456789" />
            <Input label="Amount (INR)" value={chequeBounce.amount} onChange={v => setChequeBounce(p => ({ ...p, amount: v }))} placeholder="e.g. 500000" type="number" />
            <Input label="Cheque Date" value={chequeBounce.chequeDate} onChange={v => setChequeBounce(p => ({ ...p, chequeDate: v }))} type="date" />
            <Input label="Bank Name" value={chequeBounce.bankName} onChange={v => setChequeBounce(p => ({ ...p, bankName: v }))} placeholder="e.g. State Bank of India" />
            <Input label="Presentation Date" value={chequeBounce.presentationDate} onChange={v => setChequeBounce(p => ({ ...p, presentationDate: v }))} type="date" />
            <Input label="Dishonor Reason" value={chequeBounce.dishonorReason} onChange={v => setChequeBounce(p => ({ ...p, dishonorReason: v }))} placeholder="e.g. Insufficient Funds" />
          </div>
        );
      case 'recovery':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Amount Owed (INR)" value={recovery.amountOwed} onChange={v => setRecovery(p => ({ ...p, amountOwed: v }))} placeholder="e.g. 200000" type="number" />
            <Input label="Transaction Date" value={recovery.transactionDate} onChange={v => setRecovery(p => ({ ...p, transactionDate: v }))} type="date" />
            <div className="sm:col-span-2">
              <Input label="Nature of Transaction" value={recovery.natureOfTransaction} onChange={v => setRecovery(p => ({ ...p, natureOfTransaction: v }))} placeholder="e.g. Loan given for business purposes" />
            </div>
          </div>
        );
      case 'rent-eviction':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <TextArea label="Property Address" value={rentEviction.propertyAddress} onChange={v => setRentEviction(p => ({ ...p, propertyAddress: v }))} placeholder="Full address of rented property" />
            </div>
            <Input label="Monthly Rent (INR)" value={rentEviction.rentAmount} onChange={v => setRentEviction(p => ({ ...p, rentAmount: v }))} placeholder="e.g. 25000" type="number" />
            <Input label="Months Pending" value={rentEviction.monthsPending} onChange={v => setRentEviction(p => ({ ...p, monthsPending: v }))} placeholder="e.g. 6" type="number" />
            <Input label="Agreement Date" value={rentEviction.agreementDate} onChange={v => setRentEviction(p => ({ ...p, agreementDate: v }))} type="date" />
          </div>
        );
      case 'breach-of-contract':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Contract Date" value={breach.contractDate} onChange={v => setBreach(p => ({ ...p, contractDate: v }))} type="date" />
            <Input label="Nature of Contract" value={breach.natureOfContract} onChange={v => setBreach(p => ({ ...p, natureOfContract: v }))} placeholder="e.g. Supply agreement" />
            <div className="sm:col-span-2">
              <TextArea label="Breach Description" value={breach.breachDescription} onChange={v => setBreach(p => ({ ...p, breachDescription: v }))} placeholder="Describe how the contract was breached" rows={3} />
            </div>
          </div>
        );
      case 'defamation':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Date of Incident" value={defamation.incidentDate} onChange={v => setDefamation(p => ({ ...p, incidentDate: v }))} type="date" />
            <div>
              <label className={labelCls}>Medium</label>
              <select value={defamation.medium} onChange={e => setDefamation(p => ({ ...p, medium: e.target.value }))} className={inputCls}>
                <option value="written">Written</option>
                <option value="verbal">Verbal</option>
                <option value="social media">Social Media</option>
                <option value="print media">Print Media</option>
                <option value="electronic media">Electronic Media</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <TextArea label="Description of Defamatory Content" value={defamation.description} onChange={v => setDefamation(p => ({ ...p, description: v }))} placeholder="Describe the defamatory statements made" rows={3} />
            </div>
          </div>
        );
      case 'property-dispute':
        return (
          <div className="grid grid-cols-1 gap-3">
            <TextArea label="Property Details" value={propertyDispute.propertyDetails} onChange={v => setPropertyDispute(p => ({ ...p, propertyDetails: v }))} placeholder="e.g. Plot No. 45, Survey No. 123, Village XYZ, District ABC" rows={2} />
            <TextArea label="Nature of Dispute" value={propertyDispute.natureOfDispute} onChange={v => setPropertyDispute(p => ({ ...p, natureOfDispute: v }))} placeholder="e.g. illegally encroached upon the eastern boundary of the said plot" rows={3} />
          </div>
        );
    }
  }

  // ─── Preview (inline styles for html2canvas) ──────────────────────────────

  const body = getNoticeBody();

  const previewContent = (
    <div
      ref={previewRef}
      style={{
        fontFamily: "'Times New Roman', 'Georgia', serif",
        fontSize: '13px',
        lineHeight: '1.7',
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        padding: '48px 40px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '3px', textDecoration: 'underline' }}>
          LEGAL NOTICE
        </div>
        <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
          Under {currentSection}
        </div>
      </div>

      <div style={{ textAlign: 'right', margin: '16px 0 8px' }}>
        <strong>Date:</strong> {formatDate(noticeDate)}
      </div>

      {sender.throughAdvocate && sender.advocateName && (
        <div style={{ marginBottom: '12px', fontStyle: 'italic' }}>
          <strong>Through:</strong> {sender.advocateName}
          {sender.enrollmentNumber && `, Enrollment No. ${sender.enrollmentNumber}`}
        </div>
      )}

      <div style={{ marginBottom: '12px' }}>
        <strong>From:</strong><br />
        {or(sender.name, '[SENDER NAME]')}<br />
        <span style={{ whiteSpace: 'pre-wrap' }}>{or(sender.address, '[SENDER ADDRESS]')}</span>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <strong>To:</strong><br />
        {or(recipient.name, '[RECIPIENT NAME]')}<br />
        <span style={{ whiteSpace: 'pre-wrap' }}>{or(recipient.address, '[RECIPIENT ADDRESS]')}</span>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <strong>Subject:</strong> Legal Notice under {currentSection}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Sir/Madam,</strong>
      </div>

      <div style={{ textAlign: 'justify' }}>
        {body.map((para, idx) => (
          <p key={idx} style={{ marginBottom: '12px', textIndent: '0' }}>
            <strong>{idx + 1}.</strong> {para}
          </p>
        ))}
      </div>

      <p style={{ marginTop: '16px', textAlign: 'justify' }}>
        This notice is being sent to you through Registered Post A.D. / Speed Post / Hand Delivery and a copy of the same is retained in the office for record and further reference.
      </p>

      <div style={{ marginTop: '40px' }}>
        <div style={{ fontWeight: 'bold' }}>{or(sender.name, '[SENDER NAME]')}</div>
        {sender.throughAdvocate && sender.advocateName && (
          <div>Through: {sender.advocateName}</div>
        )}
        <div>Date: {formatDate(noticeDate)}</div>
        <div>Place: ___________</div>
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/30 p-4">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Disclaimer:</strong> This tool generates a template for informational purposes only. It does not constitute legal advice. Please consult a qualified lawyer before sending any legal notice.
        </p>
      </div>

      {/* Top actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={loadExample}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <Sparkles className="w-4 h-4" /> Try Example
        </button>
        <button onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-600 hover:bg-slate-700 px-4 py-2 text-sm font-medium text-white transition-colors">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Text'}
        </button>
        <button onClick={handleDownload} disabled={downloading}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-slate-100 dark:text-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50">
          <Download className="w-4 h-4" /> {downloading ? 'Generating...' : 'Download PNG'}
        </button>
      </div>

      {/* Mobile tab switcher */}
      <div className="flex lg:hidden rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
        <button onClick={() => setMobileTab('form')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mobileTab === 'form' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
          Form
        </button>
        <button onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mobileTab === 'preview' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
          Preview
        </button>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Form Panel ── */}
        <div className={`space-y-5 ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}>
          {/* Notice type selector */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notice Type</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NOTICE_TYPES.map(t => (
                <button key={t.key} onClick={() => setNoticeType(t.key)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium border transition-colors text-left ${
                    noticeType === t.key
                      ? 'border-slate-600 dark:border-slate-400 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sender details */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sender Details</h3>
            <Input label="Full Name" value={sender.name} onChange={v => setSender(p => ({ ...p, name: v }))} placeholder="Your full name" />
            <TextArea label="Address" value={sender.address} onChange={v => setSender(p => ({ ...p, address: v }))} placeholder="Full address including pin code" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={sender.throughAdvocate}
                onChange={e => setSender(p => ({ ...p, throughAdvocate: e.target.checked }))}
                className="rounded border-slate-300 dark:border-slate-600 text-slate-600 focus:ring-slate-500" />
              <span className="text-xs text-slate-700 dark:text-slate-300">Through Advocate</span>
            </label>
            {sender.throughAdvocate && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Advocate Name" value={sender.advocateName} onChange={v => setSender(p => ({ ...p, advocateName: v }))} placeholder="e.g. Adv. Priya Mehta" />
                <Input label="Enrollment Number" value={sender.enrollmentNumber} onChange={v => setSender(p => ({ ...p, enrollmentNumber: v }))} placeholder="e.g. D/1234/2020" />
              </div>
            )}
          </div>

          {/* Recipient details */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recipient Details</h3>
            <Input label="Full Name" value={recipient.name} onChange={v => setRecipient(p => ({ ...p, name: v }))} placeholder="Recipient's full name" />
            <TextArea label="Address" value={recipient.address} onChange={v => setRecipient(p => ({ ...p, address: v }))} placeholder="Full address including pin code" />
          </div>

          {/* Notice-specific fields */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {NOTICE_TYPES.find(t => t.key === noticeType)!.label} Details
            </h3>
            {renderTypeFields()}
          </div>

          {/* Date and deadline */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Notice Date" value={noticeDate} onChange={setNoticeDate} type="date" />
              <div>
                <label className={labelCls}>Response Deadline</label>
                <div className="flex gap-2">
                  {DEADLINE_OPTIONS.map(d => (
                    <button key={d.value} onClick={() => setDeadline(d.value)}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium border transition-colors ${
                        deadline === d.value
                          ? 'border-slate-600 dark:border-slate-400 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400'
                      }`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Preview Panel ── */}
        <div ref={previewPanelRef} className={`${mobileTab === 'form' ? 'hidden lg:block' : ''}`}>
          <div className="sticky top-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Live Preview</span>
              </div>
              <div className="overflow-auto max-h-[75vh]">
                {previewContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
