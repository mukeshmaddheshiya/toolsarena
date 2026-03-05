'use client';
import { useState, useCallback, useRef } from 'react';
import { Receipt, Download, IndianRupee, Building2, User, Calendar, FileText, Stamp, Loader2, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface ReceiptData {
  tenantName: string;
  landlordName: string;
  landlordPAN: string;
  address: string;
  city: string;
  monthlyRent: string;
  fromMonth: string;
  toMonth: string;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
  includeRevenueStamp: boolean;
}

interface GeneratedReceipt {
  month: string;
  year: number;
  amount: number;
  fromDate: string;
  toDate: string;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const FY_PRESETS = [
  { label: 'FY 2024-25', from: '2024-04', to: '2025-03' },
  { label: 'FY 2025-26', from: '2025-04', to: '2026-03' },
  { label: 'FY 2026-27', from: '2026-04', to: '2027-03' },
];

function getMonthsBetween(from: string, to: string): GeneratedReceipt[] {
  if (!from || !to) return [];
  const [fy, fm] = from.split('-').map(Number);
  const [ty, tm] = to.split('-').map(Number);
  const receipts: GeneratedReceipt[] = [];
  let y = fy, m = fm;
  while (y < ty || (y === ty && m <= tm)) {
    const daysInMonth = new Date(y, m, 0).getDate();
    receipts.push({
      month: MONTHS[m - 1],
      year: y,
      amount: 0,
      fromDate: `01/${String(m).padStart(2, '0')}/${y}`,
      toDate: `${daysInMonth}/${String(m).padStart(2, '0')}/${y}`,
    });
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return receipts;
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
  return convert(Math.round(num)) + ' Rupees Only';
}

function isValidPAN(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
}

export function RentReceiptGeneratorTool() {
  const [data, setData] = useState<ReceiptData>({
    tenantName: '', landlordName: '', landlordPAN: '', address: '', city: '',
    monthlyRent: '', fromMonth: '2025-04', toMonth: '2026-03',
    paymentMode: 'Bank Transfer', includeRevenueStamp: true,
  });
  const [generated, setGenerated] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const receiptRef = useRef<HTMLDivElement>(null);

  const update = useCallback((key: keyof ReceiptData, val: string | boolean) => {
    setData(d => ({ ...d, [key]: val }));
    setGenerated(false);
  }, []);

  const rent = parseFloat(data.monthlyRent) || 0;
  const receipts = getMonthsBetween(data.fromMonth, data.toMonth).map(r => ({ ...r, amount: rent }));
  const totalRent = receipts.length * rent;
  const panInvalid = data.landlordPAN.length > 0 && data.landlordPAN.length === 10 && !isValidPAN(data.landlordPAN);
  const panRequired = totalRent > 100000 && !data.landlordPAN;

  const canGenerate = data.tenantName.trim() && data.landlordName.trim() && data.address.trim() && rent > 0 && receipts.length > 0;

  // Validation progress
  const fields = [
    { done: !!data.tenantName.trim(), label: 'Tenant Name' },
    { done: !!data.landlordName.trim(), label: 'Landlord Name' },
    { done: !!data.address.trim(), label: 'Address' },
    { done: rent > 0, label: 'Rent Amount' },
    { done: receipts.length > 0, label: 'Date Range' },
  ];
  const completedFields = fields.filter(f => f.done).length;

  const handleDownloadPDF = useCallback(async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      const receiptElements = receiptRef.current.querySelectorAll('[data-receipt]');
      const perPage = 3;
      const pages = Math.ceil(receiptElements.length / perPage);

      for (let p = 0; p < pages; p++) {
        const container = document.createElement('div');
        container.style.width = '794px';
        container.style.padding = '20px';
        container.style.background = 'white';
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        for (let i = p * perPage; i < Math.min((p + 1) * perPage, receiptElements.length); i++) {
          const clone = receiptElements[i].cloneNode(true) as HTMLElement;
          clone.style.marginBottom = '16px';
          container.appendChild(clone);
        }
        document.body.appendChild(container);
        const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        document.body.removeChild(container);
        const imgBytes = await fetch(canvas.toDataURL('image/png')).then(r => r.arrayBuffer());
        const img = await doc.embedPng(imgBytes);
        const pageW = 595.28;
        const scale = pageW / img.width;
        const drawH = img.height * scale;
        const page = doc.addPage([pageW, Math.max(drawH, 841.89)]);
        page.drawImage(img, { x: 0, y: page.getHeight() - drawH, width: pageW, height: drawH });
      }
      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rent_Receipts_${data.fromMonth}_to_${data.toMonth}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }, [data.fromMonth, data.toMonth]);

  const fyLabel = (() => {
    const [fy] = data.fromMonth.split('-').map(Number);
    const [ty] = data.toMonth.split('-').map(Number);
    return `FY ${fy}-${String(ty).slice(2)}`;
  })();

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Rent Receipt Generator</h2>
            <p className="text-emerald-100 text-xs">Generate HRA rent receipts for tax saving | Free PDF Download | {fyLabel}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>{completedFields}/{fields.length} fields completed</span>
          <span>{fields.filter(f => !f.done).map(f => f.label).join(', ') || 'Ready to generate!'}</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${(completedFields / fields.length) * 100}%` }} />
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: IndianRupee, label: 'Monthly Rent', value: rent ? `₹${rent.toLocaleString('en-IN')}` : '—' },
          { icon: Calendar, label: 'Months', value: receipts.length || '—' },
          { icon: FileText, label: 'Total Rent', value: totalRent ? `₹${totalRent.toLocaleString('en-IN')}` : '—' },
          { icon: Stamp, label: 'Revenue Stamp', value: data.includeRevenueStamp ? 'Included' : 'No' },
        ].map(item => (
          <div key={item.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
            <item.icon className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.value}</div>
          </div>
        ))}
      </div>

      {/* FY Quick Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 self-center">Financial Year:</span>
        {FY_PRESETS.map(fy => (
          <button key={fy.label} onClick={() => { update('fromMonth', fy.from); setData(d => ({ ...d, fromMonth: fy.from, toMonth: fy.to })); setGenerated(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              data.fromMonth === fy.from && data.toMonth === fy.to
                ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50'}`}>
            {fy.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" /> Tenant Details
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Tenant Name (Your Name) *</label>
              <input type="text" value={data.tenantName} onChange={e => update('tenantName', e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Rented Property Address *</label>
              <textarea value={data.address} onChange={e => update('address', e.target.value)}
                placeholder="e.g. Flat 302, Sunshine Apartments, MG Road, Bangalore - 560001"
                rows={2}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">City (Optional)</label>
              <input type="text" value={data.city} onChange={e => update('city', e.target.value)}
                placeholder="e.g. Bangalore"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" /> Landlord Details
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Landlord Name *</label>
              <input type="text" value={data.landlordName} onChange={e => update('landlordName', e.target.value)}
                placeholder="e.g. Priya Verma"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1">
                Landlord PAN
                {panRequired && <span className="text-amber-500 text-[9px]">(Required - rent &gt; ₹1L/year)</span>}
              </label>
              <input type="text" value={data.landlordPAN} onChange={e => update('landlordPAN', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                placeholder="e.g. ABCDE1234F" maxLength={10}
                className={`w-full rounded-lg border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 outline-none font-mono ${
                  panInvalid ? 'border-red-400 focus:ring-red-500' : panRequired ? 'border-amber-400 focus:ring-amber-500' : 'border-slate-300 dark:border-slate-600 focus:ring-emerald-500'}`} />
              {panInvalid && <p className="text-[10px] text-red-500 mt-1">Invalid PAN format. Expected: ABCDE1234F</p>}
              {data.landlordPAN && isValidPAN(data.landlordPAN) && <p className="text-[10px] text-green-500 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Valid PAN format</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Rent Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-emerald-600" /> Rent Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Monthly Rent (₹) *</label>
            <input type="number" value={data.monthlyRent} onChange={e => update('monthlyRent', e.target.value)}
              placeholder="15000"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">From Month *</label>
            <input type="month" value={data.fromMonth} onChange={e => update('fromMonth', e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">To Month *</label>
            <input type="month" value={data.toMonth} onChange={e => update('toMonth', e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Payment Mode</label>
            <select value={data.paymentMode} onChange={e => update('paymentMode', e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
              <option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Cheque</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
          <input type="checkbox" checked={data.includeRevenueStamp} onChange={e => update('includeRevenueStamp', e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
          Include Revenue Stamp (₹1) on each receipt
        </label>
      </div>

      {/* Quick Rent Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 self-center">Quick Rent:</span>
        {[5000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 40000, 50000].map(v => (
          <button key={v} onClick={() => update('monthlyRent', String(v))}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              rent === v ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50'}`}>
            ₹{v.toLocaleString('en-IN')}
          </button>
        ))}
      </div>

      {/* Warnings */}
      {panRequired && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div><strong>PAN Required:</strong> Annual rent (₹{totalRent.toLocaleString('en-IN')}) exceeds ₹1,00,000. Landlord PAN is mandatory for HRA exemption.</div>
        </div>
      )}

      {/* Generate Button */}
      <button onClick={() => setGenerated(true)} disabled={!canGenerate}
        className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]">
        <FileText className="w-4 h-4" />
        Generate {receipts.length} Rent Receipt{receipts.length !== 1 ? 's' : ''}
      </button>

      {/* Generated Receipts */}
      {generated && canGenerate && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Generated {receipts.length} Receipts
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-200 transition-colors">
                {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              <button onClick={handleDownloadPDF} disabled={downloading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-60">
                {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                {downloading ? 'Generating PDF...' : 'Download All as PDF'}
              </button>
            </div>
          </div>

          <div ref={receiptRef} className={showPreview ? 'space-y-4' : 'space-y-4 absolute -left-[9999px]'}>
            {receipts.map((r, i) => (
              <div key={i} data-receipt className="bg-white border-2 border-slate-200 rounded-xl p-6 text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>
                <div className="text-center border-b-2 border-slate-300 pb-3 mb-4">
                  <h4 className="text-lg font-bold uppercase tracking-wider text-slate-700">Rent Receipt</h4>
                  <p className="text-xs text-slate-500 mt-1">For the month of {r.month} {r.year}</p>
                </div>
                <div className="flex justify-between text-xs text-slate-600 mb-4">
                  <span><strong>Receipt No:</strong> RR-{String(r.year).slice(2)}{String(MONTHS.indexOf(r.month) + 1).padStart(2, '0')}-{String(i + 1).padStart(3, '0')}</span>
                  <span><strong>Date:</strong> {r.toDate}</span>
                </div>
                <div className="text-sm leading-relaxed space-y-3">
                  <p>
                    Received a sum of <strong>₹{rent.toLocaleString('en-IN')}/-</strong> ({numberToWords(rent)})
                    from <strong>{data.tenantName}</strong> towards rent for the property located at:
                  </p>
                  <p className="bg-slate-50 rounded-lg px-3 py-2 text-sm font-medium">
                    {data.address}{data.city ? `, ${data.city}` : ''}
                  </p>
                  <p>for the period from <strong>{r.fromDate}</strong> to <strong>{r.toDate}</strong>.</p>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-lg p-3 text-xs">
                    <div><span className="text-slate-500">Payment Mode:</span> <strong>{data.paymentMode}</strong></div>
                    <div><span className="text-slate-500">Amount:</span> <strong>₹{rent.toLocaleString('en-IN')}</strong></div>
                    <div><span className="text-slate-500">Landlord:</span> <strong>{data.landlordName}</strong></div>
                    {data.landlordPAN && <div><span className="text-slate-500">Landlord PAN:</span> <strong>{data.landlordPAN}</strong></div>}
                  </div>
                </div>
                <div className="flex justify-between items-end mt-6 pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-500"><p>Tenant: {data.tenantName}</p></div>
                  {data.includeRevenueStamp && (
                    <div className="w-16 h-16 border-2 border-dashed border-emerald-400 rounded-lg flex items-center justify-center text-center">
                      <div className="text-[8px] text-emerald-600 font-bold leading-tight">REVENUE<br />STAMP<br />₹1</div>
                    </div>
                  )}
                  <div className="text-right text-xs text-slate-500">
                    <div className="border-t border-slate-400 pt-1 mb-1 w-32 ml-auto"></div>
                    <p className="font-medium">{data.landlordName}</p>
                    <p>(Landlord Signature)</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Download Button Bottom */}
          <button onClick={handleDownloadPDF} disabled={downloading}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]">
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? 'Generating PDF...' : `Download All ${receipts.length} Receipts as PDF`}
          </button>

          {/* Summary */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Summary for HRA Claim</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div><span className="text-emerald-600">Period:</span><br /><strong>{data.fromMonth} to {data.toMonth}</strong></div>
              <div><span className="text-emerald-600">Monthly Rent:</span><br /><strong>₹{rent.toLocaleString('en-IN')}</strong></div>
              <div><span className="text-emerald-600">Total Receipts:</span><br /><strong>{receipts.length}</strong></div>
              <div><span className="text-emerald-600">Total Rent Paid:</span><br /><strong>₹{totalRent.toLocaleString('en-IN')}</strong></div>
              <div><span className="text-emerald-600">Tax Saving (30%):</span><br /><strong className="text-green-600">₹{Math.round(Math.min(totalRent, rent * 12 * 0.5) * 0.312).toLocaleString('en-IN')}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Why Do You Need Rent Receipts?</h4>
        <div className="grid md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-2">
            <p><strong>HRA Tax Exemption:</strong> Salaried employees can claim HRA exemption under Section 10(13A) of the Income Tax Act by submitting rent receipts to their employer.</p>
            <p><strong>When is PAN required?</strong> If annual rent exceeds ₹1,00,000, the landlord&apos;s PAN is mandatory for claiming HRA exemption.</p>
            <p><strong>Revenue Stamp:</strong> A ₹1 revenue stamp is required on rent receipts for cash payments above ₹5,000 as per the Indian Stamp Act.</p>
          </div>
          <div className="space-y-2">
            <p><strong>Section 80GG:</strong> If you don&apos;t receive HRA but pay rent, you can claim deduction under Section 80GG (up to ₹5,000/month or 25% of total income).</p>
            <p><strong>Documents Needed:</strong> Rent receipts (monthly), rental agreement (photocopy), landlord PAN (if rent &gt; ₹1L/year). Keep all documents for 6 years for IT audit purposes.</p>
            <p><strong>Digital Payments:</strong> For UPI/bank transfers, rent receipts along with bank statements serve as double proof for HRA claims.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
