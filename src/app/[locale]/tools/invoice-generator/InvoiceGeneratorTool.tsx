'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  Plus, Trash2, Download, Printer, Upload, GripVertical,
  FileText, Building2, User, Calendar, Hash, DollarSign,
  Palette, Eye, ChevronDown, Save, RotateCcw,
} from 'lucide-react';
import { cn, downloadBlob, numberWithCommas } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessWebsite: string;
  businessTaxId: string;
  logoDataUrl: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientAddress: string;
  invoiceNumber: string;
  invoicePrefix: string;
  invoiceDate: string;
  dueDate: string;
  items: LineItem[];
  taxRate: number;
  taxLabel: string;
  discountRate: number;
  discountType: 'percent' | 'flat';
  currency: string;
  notes: string;
  paymentTerms: string;
  accentColor: string;
  template: 'classic' | 'modern' | 'minimal';
}

/* ------------------------------------------------------------------ */
/*  CURRENCIES                                                         */
/* ------------------------------------------------------------------ */

const CURRENCIES: { code: string; symbol: string; name: string }[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '\u20AC', name: 'Euro' },
  { code: 'GBP', symbol: '\u00A3', name: 'British Pound' },
  { code: 'INR', symbol: '\u20B9', name: 'Indian Rupee' },
  { code: 'NPR', symbol: '\u20B9', name: 'Nepalese Rupee' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '\u00A5', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '\u00A5', name: 'Chinese Yuan' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'THB', symbol: '\u0E3F', name: 'Thai Baht' },
  { code: 'KRW', symbol: '\u20A9', name: 'South Korean Won' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'NGN', symbol: '\u20A6', name: 'Nigerian Naira' },
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
  { code: 'BDT', symbol: '\u09F3', name: 'Bangladeshi Taka' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'PHP', symbol: '\u20B1', name: 'Philippine Peso' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'z\u0142', name: 'Polish Zloty' },
  { code: 'TRY', symbol: '\u20BA', name: 'Turkish Lira' },
  { code: 'RUB', symbol: '\u20BD', name: 'Russian Ruble' },
];

/* ------------------------------------------------------------------ */
/*  DEFAULTS                                                           */
/* ------------------------------------------------------------------ */

const today = () => new Date().toISOString().split('T')[0];
const thirtyDays = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
};

const newItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  rate: 0,
});

const defaultInvoice = (): InvoiceData => ({
  businessName: '',
  businessEmail: '',
  businessPhone: '',
  businessAddress: '',
  businessWebsite: '',
  businessTaxId: '',
  logoDataUrl: '',
  clientName: '',
  clientCompany: '',
  clientEmail: '',
  clientAddress: '',
  invoiceNumber: '001',
  invoicePrefix: 'INV-',
  invoiceDate: today(),
  dueDate: thirtyDays(),
  items: [newItem()],
  taxRate: 0,
  taxLabel: 'Tax',
  discountRate: 0,
  discountType: 'percent',
  currency: 'USD',
  notes: '',
  paymentTerms: 'Payment is due within 30 days of the invoice date.',
  accentColor: '#2563eb',
  template: 'modern',
});

/* ------------------------------------------------------------------ */
/*  HELPER: format money                                               */
/* ------------------------------------------------------------------ */

function getCurrencySymbol(code: string) {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

function fmtMoney(amount: number, currency: string) {
  const sym = getCurrencySymbol(currency);
  return `${sym}${numberWithCommas(amount.toFixed(2))}`;
}

/* ------------------------------------------------------------------ */
/*  SHARED UI                                                          */
/* ------------------------------------------------------------------ */

function InputField({ label, value, onChange, placeholder, type = 'text', className = '' }: {
  label: string; value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30">
        <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
      </div>
      <h3 className="text-sm font-heading font-bold text-slate-900 dark:text-slate-100">{title}</h3>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function InvoiceGeneratorTool() {
  const [inv, setInv] = useState<InvoiceData>(defaultInvoice);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [savedMsg, setSavedMsg] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('invoice-template');
      if (saved) {
        const parsed = JSON.parse(saved);
        setInv((prev) => ({ ...prev, ...parsed, items: prev.items }));
      }
    } catch { /* ignore */ }
  }, []);

  const set = useCallback(<K extends keyof InvoiceData>(key: K, val: InvoiceData[K]) => {
    setInv((prev) => ({ ...prev, [key]: val }));
  }, []);

  const addItem = () => set('items', [...inv.items, newItem()]);
  const removeItem = (id: string) => {
    if (inv.items.length <= 1) return;
    set('items', inv.items.filter((i) => i.id !== id));
  };
  const updateItem = (id: string, field: keyof LineItem, val: string | number) => {
    set('items', inv.items.map((i) => (i.id === id ? { ...i, [field]: val } : i)));
  };

  const onDragStart = (idx: number) => setDragIdx(idx);
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const reordered = [...inv.items];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(idx, 0, moved);
    set('items', reordered);
    setDragIdx(idx);
  };
  const onDragEnd = () => setDragIdx(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Logo must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = () => set('logoDataUrl', reader.result as string);
    reader.readAsDataURL(file);
  };

  const calcs = useMemo(() => {
    const subtotal = inv.items.reduce((sum, i) => sum + i.quantity * i.rate, 0);
    const discount = inv.discountType === 'percent'
      ? subtotal * (inv.discountRate / 100)
      : inv.discountRate;
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * (inv.taxRate / 100);
    const total = afterDiscount + tax;
    return { subtotal, discount, tax, total };
  }, [inv.items, inv.taxRate, inv.discountRate, inv.discountType]);

  const saveTemplate = () => {
    const { items, ...template } = inv;
    void items;
    localStorage.setItem('invoice-template', JSON.stringify(template));
    setSavedMsg('Template saved!');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  const resetForm = () => {
    if (!confirm('Reset all fields? This cannot be undone.')) return;
    setInv(defaultInvoice());
  };

  /* ---------------------------------------------------------------- */
  /*  PDF GENERATION                                                   */
  /* ---------------------------------------------------------------- */

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const doc = await PDFDocument.create();
      const page = doc.addPage([595.28, 841.89]);
      const { width, height } = page.getSize();

      const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
      const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

      const margin = 50;
      let y = height - margin;
      const cSym = getCurrencySymbol(inv.currency);

      const hex = inv.accentColor.replace('#', '');
      const acR = parseInt(hex.substring(0, 2), 16) / 255;
      const acG = parseInt(hex.substring(2, 4), 16) / 255;
      const acB = parseInt(hex.substring(4, 6), 16) / 255;
      const accent = rgb(acR, acG, acB);

      if (inv.template !== 'minimal') {
        page.drawRectangle({ x: 0, y: height - 8, width, height: 8, color: accent });
      }

      if (inv.logoDataUrl) {
        try {
          const logoBytes = Uint8Array.from(atob(inv.logoDataUrl.split(',')[1]), (c) => c.charCodeAt(0));
          const isPng = inv.logoDataUrl.includes('image/png');
          const logoImg = isPng ? await doc.embedPng(logoBytes) : await doc.embedJpg(logoBytes);
          const logoDims = logoImg.scale(Math.min(60 / logoImg.height, 120 / logoImg.width));
          page.drawImage(logoImg, { x: margin, y: y - logoDims.height, width: logoDims.width, height: logoDims.height });
          y -= logoDims.height + 10;
        } catch { /* skip logo if format error */ }
      }

      const titleSize = inv.template === 'modern' ? 28 : 24;
      page.drawText('INVOICE', {
        x: margin, y: y - titleSize, size: titleSize,
        font: fontBold, color: accent,
      });

      const rightX = width - margin;
      const smallSize = 9;
      const infoY = y - 10;
      const drawRight = (text: string, yPos: number, bold = false) => {
        const f = bold ? fontBold : fontRegular;
        const tw = f.widthOfTextAtSize(text, smallSize);
        page.drawText(text, { x: rightX - tw, y: yPos, size: smallSize, font: f, color: rgb(0.3, 0.3, 0.3) });
      };
      drawRight(`${inv.invoicePrefix}${inv.invoiceNumber}`, infoY, true);
      drawRight(`Date: ${inv.invoiceDate}`, infoY - 14);
      drawRight(`Due: ${inv.dueDate}`, infoY - 28);

      y -= titleSize + 30;

      if (inv.template === 'classic') {
        page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
        y -= 15;
      } else {
        y -= 5;
      }

      const colW = (width - margin * 2) / 2;
      const drawBlock = (label: string, lines: string[], startX: number, startY: number) => {
        page.drawText(label, { x: startX, y: startY, size: 9, font: fontBold, color: accent });
        let ly = startY - 16;
        for (const line of lines) {
          if (!line) continue;
          page.drawText(line, { x: startX, y: ly, size: 9, font: fontRegular, color: rgb(0.25, 0.25, 0.25) });
          ly -= 13;
        }
        return ly;
      };

      const fromLines = [inv.businessName, inv.businessAddress, inv.businessEmail, inv.businessPhone, inv.businessWebsite, inv.businessTaxId ? `Tax ID: ${inv.businessTaxId}` : ''].filter(Boolean);
      const toLines = [inv.clientName, inv.clientCompany, inv.clientAddress, inv.clientEmail].filter(Boolean);

      const fromEndY = drawBlock('From', fromLines, margin, y);
      const toEndY = drawBlock('Bill To', toLines, margin + colW, y);
      y = Math.min(fromEndY, toEndY) - 20;

      const tableLeft = margin;
      const colDesc = tableLeft;
      const colQty = width - margin - 180;
      const colRate = width - margin - 110;
      const colAmt = width - margin - 10;
      const headerH = 22;

      page.drawRectangle({ x: tableLeft, y: y - headerH, width: width - margin * 2, height: headerH, color: accent });

      const drawTableHeader = (text: string, x: number, alignRight = false) => {
        const tw = fontBold.widthOfTextAtSize(text, 9);
        page.drawText(text, { x: alignRight ? x - tw : x, y: y - 15, size: 9, font: fontBold, color: rgb(1, 1, 1) });
      };
      drawTableHeader('Description', colDesc + 8);
      drawTableHeader('Qty', colQty, true);
      drawTableHeader('Rate', colRate, true);
      drawTableHeader('Amount', colAmt, true);

      y -= headerH + 4;

      for (let i = 0; i < inv.items.length; i++) {
        const item = inv.items[i];
        const amt = item.quantity * item.rate;
        const rowY = y - 14;

        if (i % 2 === 0) {
          page.drawRectangle({ x: tableLeft, y: rowY - 5, width: width - margin * 2, height: 18, color: rgb(0.97, 0.97, 0.97) });
        }

        page.drawText(item.description || '-', { x: colDesc + 8, y: rowY, size: 9, font: fontRegular, color: rgb(0.2, 0.2, 0.2), maxWidth: colQty - colDesc - 30 });

        const drawNum = (text: string, x: number) => {
          const tw = fontRegular.widthOfTextAtSize(text, 9);
          page.drawText(text, { x: x - tw, y: rowY, size: 9, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
        };
        drawNum(String(item.quantity), colQty);
        drawNum(`${cSym}${item.rate.toFixed(2)}`, colRate);
        drawNum(`${cSym}${amt.toFixed(2)}`, colAmt);

        y -= 20;

        if (y < 180) {
          const newPage = doc.addPage([595.28, 841.89]);
          y = newPage.getSize().height - margin;
        }
      }

      y -= 10;
      page.drawLine({ start: { x: tableLeft, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
      y -= 5;

      const totalsX = width - margin - 160;
      const totalsValX = width - margin - 10;
      const drawTotalRow = (label: string, value: string, bold = false) => {
        y -= 18;
        const f = bold ? fontBold : fontRegular;
        const sz = bold ? 11 : 9;
        page.drawText(label, { x: totalsX, y, size: sz, font: f, color: rgb(0.3, 0.3, 0.3) });
        const tw = f.widthOfTextAtSize(value, sz);
        page.drawText(value, { x: totalsValX - tw, y, size: sz, font: f, color: bold ? accent : rgb(0.2, 0.2, 0.2) });
      };

      drawTotalRow('Subtotal', `${cSym}${calcs.subtotal.toFixed(2)}`);
      if (calcs.discount > 0) {
        const discLabel = inv.discountType === 'percent' ? `Discount (${inv.discountRate}%)` : 'Discount';
        drawTotalRow(discLabel, `-${cSym}${calcs.discount.toFixed(2)}`);
      }
      if (calcs.tax > 0) {
        drawTotalRow(`${inv.taxLabel} (${inv.taxRate}%)`, `${cSym}${calcs.tax.toFixed(2)}`);
      }
      y -= 4;
      page.drawLine({ start: { x: totalsX, y }, end: { x: totalsValX, y }, thickness: 1, color: accent });
      drawTotalRow('Total', `${cSym}${calcs.total.toFixed(2)}`, true);

      y -= 30;
      if (inv.notes) {
        page.drawText('Notes', { x: margin, y, size: 9, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
        y -= 14;
        const noteLines = inv.notes.split('\n');
        for (const line of noteLines) {
          page.drawText(line, { x: margin, y, size: 8, font: fontRegular, color: rgb(0.4, 0.4, 0.4), maxWidth: width - margin * 2 });
          y -= 12;
        }
      }

      if (inv.paymentTerms) {
        y -= 8;
        page.drawText('Payment Terms', { x: margin, y, size: 9, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
        y -= 14;
        page.drawText(inv.paymentTerms, { x: margin, y, size: 8, font: fontRegular, color: rgb(0.4, 0.4, 0.4), maxWidth: width - margin * 2 });
      }

      page.drawText(`Generated with ToolsArena.in`, {
        x: margin, y: 25, size: 7, font: fontRegular, color: rgb(0.7, 0.7, 0.7),
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: 'application/pdf' });
      downloadBlob(blob, `${inv.invoicePrefix}${inv.invoiceNumber}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please check your inputs and try again.');
    } finally {
      setGenerating(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                           */
  /* ---------------------------------------------------------------- */

  const selectClass = 'appearance-none w-full px-3 pr-8 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer focus:ring-2 focus:ring-primary-500 outline-none';

  return (
    <div className="space-y-5">
      {/* ── Top Actions Bar ── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Template */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Template</label>
            <select value={inv.template} onChange={(e) => set('template', e.target.value as InvoiceData['template'])} className={selectClass}>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
            </select>
            <ChevronDown className="absolute right-2.5 bottom-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Currency */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Currency</label>
            <select value={inv.currency} onChange={(e) => set('currency', e.target.value)} className={selectClass}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 bottom-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Accent color */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Accent Color</label>
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer h-[38px]">
              <Palette className="w-4 h-4 text-slate-400" />
              <input type="color" value={inv.accentColor} onChange={(e) => set('accentColor', e.target.value)} className="w-6 h-6 rounded border-0 cursor-pointer" />
              <span className="text-xs text-slate-500 uppercase">{inv.accentColor}</span>
            </label>
          </div>

          {/* Save / Reset */}
          <div className="flex flex-col">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Actions</label>
            <div className="flex gap-2 flex-1">
              <button onClick={saveTemplate} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save</span>
              </button>
              <button onClick={resetForm} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>
        {savedMsg && <p className="text-xs text-green-600 dark:text-green-400 mt-2 text-center font-medium">{savedMsg}</p>}
      </div>

      {/* ── Mobile tabs ── */}
      <div className="flex lg:hidden rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <button onClick={() => setActiveTab('edit')} className={cn('flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2', activeTab === 'edit' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300')}>
          <FileText className="w-4 h-4" />Edit
        </button>
        <button onClick={() => setActiveTab('preview')} className={cn('flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2', activeTab === 'preview' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300')}>
          <Eye className="w-4 h-4" />Preview
        </button>
      </div>

      {/* ── Main Layout: Form + Preview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ====== LEFT: FORM ====== */}
        <div className={cn('space-y-5', activeTab === 'preview' && 'hidden lg:block')}>

          {/* Business Details */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <SectionTitle icon={Building2} title="Your Business Details" />
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Logo</label>
              <div className="flex items-center gap-3">
                {inv.logoDataUrl ? (
                  <div className="relative group">
                    <img src={inv.logoDataUrl} alt="Logo" className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white" />
                    <button onClick={() => set('logoDataUrl', '')} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => logoInputRef.current?.click()} className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
                    <Upload className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Logo</span>
                  </button>
                )}
                <input ref={logoInputRef} type="file" accept="image/png,image/jpeg" onChange={handleLogoUpload} className="hidden" />
                <p className="text-[11px] text-slate-400">PNG or JPG, max 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField label="Business Name" value={inv.businessName} onChange={(v) => set('businessName', v)} placeholder="Your Company" className="sm:col-span-2" />
              <InputField label="Email" value={inv.businessEmail} onChange={(v) => set('businessEmail', v)} placeholder="you@company.com" />
              <InputField label="Phone" value={inv.businessPhone} onChange={(v) => set('businessPhone', v)} placeholder="+1 (555) 000-0000" />
              <InputField label="Address" value={inv.businessAddress} onChange={(v) => set('businessAddress', v)} placeholder="123 Main St, City, Country" className="sm:col-span-2" />
              <InputField label="Website" value={inv.businessWebsite} onChange={(v) => set('businessWebsite', v)} placeholder="www.company.com" />
              <InputField label="Tax ID / GST / VAT" value={inv.businessTaxId} onChange={(v) => set('businessTaxId', v)} placeholder="GST1234567890" />
            </div>
          </div>

          {/* Client Details */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <SectionTitle icon={User} title="Client Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField label="Client Name" value={inv.clientName} onChange={(v) => set('clientName', v)} placeholder="John Doe" />
              <InputField label="Company" value={inv.clientCompany} onChange={(v) => set('clientCompany', v)} placeholder="Client Inc." />
              <InputField label="Email" value={inv.clientEmail} onChange={(v) => set('clientEmail', v)} placeholder="client@email.com" />
              <InputField label="Address" value={inv.clientAddress} onChange={(v) => set('clientAddress', v)} placeholder="456 Client St, City" />
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <SectionTitle icon={Hash} title="Invoice Details" />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Prefix" value={inv.invoicePrefix} onChange={(v) => set('invoicePrefix', v)} placeholder="INV-" />
              <InputField label="Number" value={inv.invoiceNumber} onChange={(v) => set('invoiceNumber', v)} placeholder="001" />
              <InputField label="Invoice Date" value={inv.invoiceDate} onChange={(v) => set('invoiceDate', v)} type="date" />
              <InputField label="Due Date" value={inv.dueDate} onChange={(v) => set('dueDate', v)} type="date" />
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <SectionTitle icon={FileText} title="Items / Services" />

            {/* Desktop header row */}
            <div className="hidden sm:grid grid-cols-[24px_1fr_72px_90px_90px_32px] gap-2 mb-2 px-1">
              <div />
              <span className="text-xs font-medium text-slate-500">Description</span>
              <span className="text-xs font-medium text-slate-500 text-right">Qty</span>
              <span className="text-xs font-medium text-slate-500 text-right">Rate</span>
              <span className="text-xs font-medium text-slate-500 text-right">Amount</span>
              <div />
            </div>

            <div className="space-y-3 sm:space-y-2">
              {inv.items.map((item, idx) => (
                <div key={item.id}>
                  {/* Desktop row */}
                  <div
                    draggable
                    onDragStart={() => onDragStart(idx)}
                    onDragOver={(e) => onDragOver(e, idx)}
                    onDragEnd={onDragEnd}
                    className={cn(
                      'hidden sm:grid grid-cols-[24px_1fr_72px_90px_90px_32px] gap-2 items-center p-2 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors',
                      dragIdx === idx && 'opacity-50 border-primary-400',
                    )}
                  >
                    <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                    <input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full px-2 py-1.5 text-sm rounded border border-slate-200 dark:border-slate-600 bg-transparent text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Math.max(0, Number(e.target.value)))}
                      className="w-full px-2 py-1.5 text-sm rounded border border-slate-200 dark:border-slate-600 bg-transparent text-right text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', Math.max(0, Number(e.target.value)))}
                      className="w-full px-2 py-1.5 text-sm rounded border border-slate-200 dark:border-slate-600 bg-transparent text-right text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200 text-right pr-1">
                      {fmtMoney(item.quantity * item.rate, inv.currency)}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors" disabled={inv.items.length <= 1}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile card */}
                  <div className={cn(
                    'sm:hidden rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-3',
                    dragIdx === idx && 'opacity-50 border-primary-400',
                  )}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Item {idx + 1}</span>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors" disabled={inv.items.length <= 1}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Description</label>
                      <input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Qty</label>
                        <input
                          type="number"
                          min={0}
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', Math.max(0, Number(e.target.value)))}
                          className="w-full px-2 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-center text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Rate</label>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', Math.max(0, Number(e.target.value)))}
                          className="w-full px-2 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-center text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Amount</label>
                        <div className="flex items-center justify-center h-[38px] rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {fmtMoney(item.quantity * item.rate, inv.currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addItem} className="mt-3 flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-lg border border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-400 hover:text-primary-600 text-slate-500 dark:text-slate-400 transition-colors w-full justify-center">
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {/* Tax & Discount */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <SectionTitle icon={DollarSign} title="Tax & Discount" />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Tax Label" value={inv.taxLabel} onChange={(v) => set('taxLabel', v)} placeholder="Tax / GST / VAT" />
              <InputField label="Tax Rate (%)" value={inv.taxRate} onChange={(v) => set('taxRate', Math.max(0, Number(v)))} type="number" />
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Discount Type</label>
                <div className="relative">
                  <select
                    value={inv.discountType}
                    onChange={(e) => set('discountType', e.target.value as 'percent' | 'flat')}
                    className={selectClass}
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <InputField label={inv.discountType === 'percent' ? 'Discount (%)' : `Discount (${getCurrencySymbol(inv.currency)})`} value={inv.discountRate} onChange={(v) => set('discountRate', Math.max(0, Number(v)))} type="number" />
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <SectionTitle icon={Calendar} title="Notes & Payment Terms" />
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Notes</label>
                <textarea
                  value={inv.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Thank you for your business!"
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Payment Terms</label>
                <textarea
                  value={inv.paymentTerms}
                  onChange={(e) => set('paymentTerms', e.target.value)}
                  placeholder="Payment is due within 30 days..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ====== RIGHT: LIVE PREVIEW ====== */}
        <div className={cn('lg:sticky lg:top-20 lg:self-start', activeTab === 'edit' && 'hidden lg:block')}>
          {/* Preview Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-4 sm:px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Live Preview</span>
              <button
                onClick={generatePDF}
                disabled={generating}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                {generating ? 'Generating...' : 'Download PDF'}
              </button>
            </div>

            {/* Invoice Preview — scrollable horizontally on tiny screens */}
            <div className="p-3 sm:p-6 bg-slate-50 dark:bg-slate-900 overflow-x-auto">
              <div
                className="bg-white shadow-lg rounded-lg mx-auto overflow-hidden min-w-[320px]"
                style={{ maxWidth: '520px', fontSize: '11px', lineHeight: '1.5' }}
              >
                {inv.template !== 'minimal' && (
                  <div className="h-2" style={{ backgroundColor: inv.accentColor }} />
                )}

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                  {/* Header: Logo + INVOICE */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      {inv.logoDataUrl && (
                        <img src={inv.logoDataUrl} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-sm sm:text-base" style={{ color: inv.accentColor }}>INVOICE</div>
                        {inv.businessName && <div className="text-[10px] text-slate-500 truncate">{inv.businessName}</div>}
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-slate-500 space-y-0.5 shrink-0">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{inv.invoicePrefix}{inv.invoiceNumber}</div>
                      <div>Date: {inv.invoiceDate}</div>
                      <div>Due: {inv.dueDate}</div>
                    </div>
                  </div>

                  {/* From / To */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="font-semibold text-[10px] mb-1" style={{ color: inv.accentColor }}>From</div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 space-y-0.5">
                        {inv.businessName && <div className="font-medium text-slate-800 dark:text-slate-200">{inv.businessName}</div>}
                        {inv.businessAddress && <div>{inv.businessAddress}</div>}
                        {inv.businessEmail && <div>{inv.businessEmail}</div>}
                        {inv.businessPhone && <div>{inv.businessPhone}</div>}
                        {inv.businessTaxId && <div>Tax ID: {inv.businessTaxId}</div>}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-[10px] mb-1" style={{ color: inv.accentColor }}>Bill To</div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 space-y-0.5">
                        {inv.clientName && <div className="font-medium text-slate-800 dark:text-slate-200">{inv.clientName}</div>}
                        {inv.clientCompany && <div>{inv.clientCompany}</div>}
                        {inv.clientAddress && <div>{inv.clientAddress}</div>}
                        {inv.clientEmail && <div>{inv.clientEmail}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                    <div className="min-w-[280px]">
                      <div className="grid grid-cols-[1fr_40px_60px_65px] sm:grid-cols-[1fr_50px_70px_70px] gap-1 px-2 py-1.5 rounded-t text-white text-[10px] font-semibold" style={{ backgroundColor: inv.accentColor }}>
                        <div>Description</div>
                        <div className="text-right">Qty</div>
                        <div className="text-right">Rate</div>
                        <div className="text-right">Amount</div>
                      </div>
                      {inv.items.map((item, idx) => (
                        <div key={item.id} className={cn('grid grid-cols-[1fr_40px_60px_65px] sm:grid-cols-[1fr_50px_70px_70px] gap-1 px-2 py-1.5 text-[10px]', idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800')}>
                          <div className="text-slate-700 dark:text-slate-300 truncate">{item.description || '-'}</div>
                          <div className="text-right text-slate-600 dark:text-slate-400">{item.quantity}</div>
                          <div className="text-right text-slate-600 dark:text-slate-400">{fmtMoney(item.rate, inv.currency)}</div>
                          <div className="text-right font-medium text-slate-800 dark:text-slate-200">{fmtMoney(item.quantity * item.rate, inv.currency)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end">
                    <div className="w-full xs:w-52 space-y-1 text-[10px]">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Subtotal</span>
                        <span>{fmtMoney(calcs.subtotal, inv.currency)}</span>
                      </div>
                      {calcs.discount > 0 && (
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Discount {inv.discountType === 'percent' ? `(${inv.discountRate}%)` : ''}</span>
                          <span>-{fmtMoney(calcs.discount, inv.currency)}</span>
                        </div>
                      )}
                      {calcs.tax > 0 && (
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>{inv.taxLabel} ({inv.taxRate}%)</span>
                          <span>{fmtMoney(calcs.tax, inv.currency)}</span>
                        </div>
                      )}
                      <div className="border-t pt-1 flex justify-between font-bold text-xs" style={{ borderColor: inv.accentColor, color: inv.accentColor }}>
                        <span>Total</span>
                        <span>{fmtMoney(calcs.total, inv.currency)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {(inv.notes || inv.paymentTerms) && (
                    <div className="border-t border-slate-100 dark:border-slate-700 pt-3 space-y-2 text-[10px] text-slate-500 dark:text-slate-400">
                      {inv.notes && (
                        <div>
                          <div className="font-semibold text-slate-600 dark:text-slate-300 mb-0.5">Notes</div>
                          <div className="whitespace-pre-wrap">{inv.notes}</div>
                        </div>
                      )}
                      {inv.paymentTerms && (
                        <div>
                          <div className="font-semibold text-slate-600 dark:text-slate-300 mb-0.5">Payment Terms</div>
                          <div>{inv.paymentTerms}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card below preview */}
          <div className="mt-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">Invoice Summary</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">{inv.currency}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{fmtMoney(calcs.subtotal, inv.currency)}</span>
              </div>
              {calcs.discount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Discount</span>
                  <span>-{fmtMoney(calcs.discount, inv.currency)}</span>
                </div>
              )}
              {calcs.tax > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{inv.taxLabel}</span>
                  <span>{fmtMoney(calcs.tax, inv.currency)}</span>
                </div>
              )}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-base text-slate-900 dark:text-slate-100">
                <span>Total</span>
                <span style={{ color: inv.accentColor }}>{fmtMoney(calcs.total, inv.currency)}</span>
              </div>
            </div>

            {/* Download & Print buttons */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={generatePDF}
                disabled={generating}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{generating ? 'Generating...' : 'Download'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
