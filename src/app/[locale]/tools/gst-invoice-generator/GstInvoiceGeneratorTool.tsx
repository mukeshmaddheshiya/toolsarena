'use client';

import { useState } from 'react';

interface LineItem {
  id: number;
  description: string;
  hsn: string;
  qty: number;
  rate: number;
  gstRate: number;
}

interface InvoiceData {
  sellerName: string;
  sellerGSTIN: string;
  sellerAddress: string;
  sellerPhone: string;
  buyerName: string;
  buyerGSTIN: string;
  buyerAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  supplyType: 'intra' | 'inter';
  items: LineItem[];
}

const GST_RATES = [0, 5, 12, 18, 28];

const formatINR = (n: number) =>
  n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function numToWords(n: number): string {
  const num = Math.round(n);
  if (num === 0) return 'Zero';
  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numToWords(num % 100) : '');
  if (num < 100000) return numToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numToWords(num % 1000) : '');
  if (num < 10000000) return numToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numToWords(num % 100000) : '');
  return numToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numToWords(num % 10000000) : '');
}

function amountInWords(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let result = 'Rupees ' + numToWords(rupees);
  if (paise > 0) result += ' and ' + numToWords(paise) + ' Paise';
  return result + ' Only';
}

const defaultInvoice: InvoiceData = {
  sellerName: '',
  sellerGSTIN: '',
  sellerAddress: '',
  sellerPhone: '',
  buyerName: '',
  buyerGSTIN: '',
  buyerAddress: '',
  invoiceNumber: 'INV-001',
  invoiceDate: new Date().toISOString().split('T')[0],
  supplyType: 'intra',
  items: [{ id: 1, description: '', hsn: '', qty: 1, rate: 0, gstRate: 18 }],
};

export function GstInvoiceGeneratorTool() {
  const [invoice, setInvoice] = useState<InvoiceData>(defaultInvoice);
  const [showPreview, setShowPreview] = useState(false);

  const updateField = (field: keyof InvoiceData, value: string) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (id: number, field: keyof LineItem, value: string | number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    const newId = Math.max(...invoice.items.map((i) => i.id)) + 1;
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { id: newId, description: '', hsn: '', qty: 1, rate: 0, gstRate: 18 }],
    }));
  };

  const removeItem = (id: number) => {
    if (invoice.items.length === 1) return;
    setInvoice((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
  };

  const calcItem = (item: LineItem) => {
    const taxable = item.qty * item.rate;
    const gstAmount = (taxable * item.gstRate) / 100;
    const total = taxable + gstAmount;
    const halfGST = gstAmount / 2;
    return { taxable, gstAmount, total, halfGST };
  };

  const totals = invoice.items.reduce(
    (acc, item) => {
      const c = calcItem(item);
      return {
        taxable: acc.taxable + c.taxable,
        gstAmount: acc.gstAmount + c.gstAmount,
        total: acc.total + c.total,
      };
    },
    { taxable: 0, gstAmount: 0, total: 0 }
  );

  const isIntra = invoice.supplyType === 'intra';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!showPreview ? (
        <>
          {/* Seller Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Seller (From) Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Business Name *</label>
                <input
                  type="text"
                  placeholder="Your Business Name"
                  value={invoice.sellerName}
                  onChange={(e) => updateField('sellerName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">GSTIN *</label>
                <input
                  type="text"
                  placeholder="27AAPFU0939F1ZV"
                  value={invoice.sellerGSTIN}
                  onChange={(e) => updateField('sellerGSTIN', e.target.value.toUpperCase())}
                  maxLength={15}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600 block mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Street, City, State, PIN"
                  value={invoice.sellerAddress}
                  onChange={(e) => updateField('sellerAddress', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={invoice.sellerPhone}
                  onChange={(e) => updateField('sellerPhone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Buyer Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Buyer (Bill To) Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Buyer Name *</label>
                <input
                  type="text"
                  placeholder="Customer / Company Name"
                  value={invoice.buyerName}
                  onChange={(e) => updateField('buyerName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Buyer GSTIN (optional)</label>
                <input
                  type="text"
                  placeholder="For ITC claims"
                  value={invoice.buyerGSTIN}
                  onChange={(e) => updateField('buyerGSTIN', e.target.value.toUpperCase())}
                  maxLength={15}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600 block mb-1">Buyer Address</label>
                <input
                  type="text"
                  placeholder="Street, City, State, PIN"
                  value={invoice.buyerAddress}
                  onChange={(e) => updateField('buyerAddress', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Invoice Info</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => updateField('invoiceNumber', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={invoice.invoiceDate}
                  onChange={(e) => updateField('invoiceDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Supply Type</label>
                <select
                  value={invoice.supplyType}
                  onChange={(e) => updateField('supplyType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="intra">Intra-State (CGST+SGST)</option>
                  <option value="inter">Inter-State (IGST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Line Items</h2>
            <div className="space-y-3">
              {invoice.items.map((item, idx) => {
                const c = calcItem(item);
                return (
                  <div key={item.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Item {idx + 1}</span>
                      {invoice.items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      <div className="col-span-3">
                        <label className="text-xs text-gray-500 block mb-1">Description</label>
                        <input
                          type="text"
                          placeholder="Product / Service"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">HSN/SAC</label>
                        <input
                          type="text"
                          placeholder="1234"
                          value={item.hsn}
                          onChange={(e) => updateItem(item.id, 'hsn', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">GST %</label>
                        <select
                          value={item.gstRate}
                          onChange={(e) => updateItem(item.id, 'gstRate', Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {GST_RATES.map((r) => (
                            <option key={r} value={r}>{r}%</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Total</label>
                        <div className="px-2 py-1.5 text-sm font-medium text-gray-800 bg-gray-50 rounded-lg">
                          ₹{formatINR(c.total)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Quantity</label>
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Unit Price (₹)</label>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={addItem}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add Another Item
            </button>
          </div>

          {/* Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Taxable Amount</span>
                <span>₹{formatINR(totals.taxable)}</span>
              </div>
              {isIntra ? (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>CGST</span>
                    <span>₹{formatINR(totals.gstAmount / 2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>SGST</span>
                    <span>₹{formatINR(totals.gstAmount / 2)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-gray-600">
                  <span>IGST</span>
                  <span>₹{formatINR(totals.gstAmount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800 text-base">
                <span>Grand Total</span>
                <span>₹{formatINR(totals.total)}</span>
              </div>
              <p className="text-xs text-gray-400 italic">{amountInWords(totals.total)}</p>
            </div>
          </div>

          <button
            onClick={() => setShowPreview(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Preview Invoice
          </button>
        </>
      ) : (
        /* Invoice Preview */
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(false)}
              className="flex-1 border border-gray-300 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              ← Edit Invoice
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Print / Download PDF
            </button>
          </div>

          <div id="invoice-print" className="bg-white border border-gray-200 rounded-2xl p-8 print:p-6 print:rounded-none print:border-none">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{invoice.sellerName || 'Your Business Name'}</h1>
                <p className="text-sm text-gray-500 mt-1">{invoice.sellerAddress}</p>
                {invoice.sellerPhone && <p className="text-sm text-gray-500">Ph: {invoice.sellerPhone}</p>}
                <p className="text-sm font-mono text-gray-600 mt-1">GSTIN: {invoice.sellerGSTIN || 'Not Entered'}</p>
              </div>
              <div className="text-right">
                <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">TAX INVOICE</div>
                <p className="text-sm text-gray-600">Invoice No: <strong>{invoice.invoiceNumber}</strong></p>
                <p className="text-sm text-gray-600">
                  Date: <strong>{new Date(invoice.invoiceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                </p>
                <p className="text-xs text-gray-400 mt-1">{isIntra ? 'Intra-State Supply' : 'Inter-State Supply'}</p>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Bill To</h3>
              <p className="font-semibold text-gray-800">{invoice.buyerName || 'Customer Name'}</p>
              <p className="text-sm text-gray-500">{invoice.buyerAddress}</p>
              {invoice.buyerGSTIN && (
                <p className="text-sm font-mono text-gray-600">GSTIN: {invoice.buyerGSTIN}</p>
              )}
            </div>

            {/* Items Table */}
            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-600">#</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-600">Description</th>
                  <th className="text-center py-2 px-2 font-semibold text-gray-600">HSN</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-600">Qty</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-600">Rate</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-600">Taxable</th>
                  {isIntra ? (
                    <>
                      <th className="text-right py-2 px-2 font-semibold text-gray-600">CGST</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-600">SGST</th>
                    </>
                  ) : (
                    <th className="text-right py-2 px-2 font-semibold text-gray-600">IGST</th>
                  )}
                  <th className="text-right py-2 px-3 font-semibold text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => {
                  const c = calcItem(item);
                  return (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-2 px-3 text-gray-500">{idx + 1}</td>
                      <td className="py-2 px-3 text-gray-800">{item.description || '—'}</td>
                      <td className="py-2 px-2 text-center text-gray-500 font-mono">{item.hsn || '—'}</td>
                      <td className="py-2 px-2 text-right text-gray-700">{item.qty}</td>
                      <td className="py-2 px-2 text-right text-gray-700">₹{formatINR(item.rate)}</td>
                      <td className="py-2 px-2 text-right text-gray-700">₹{formatINR(c.taxable)}</td>
                      {isIntra ? (
                        <>
                          <td className="py-2 px-2 text-right text-gray-600">
                            <span className="text-xs text-gray-400">{item.gstRate / 2}% </span>
                            ₹{formatINR(c.halfGST)}
                          </td>
                          <td className="py-2 px-2 text-right text-gray-600">
                            <span className="text-xs text-gray-400">{item.gstRate / 2}% </span>
                            ₹{formatINR(c.halfGST)}
                          </td>
                        </>
                      ) : (
                        <td className="py-2 px-2 text-right text-gray-600">
                          <span className="text-xs text-gray-400">{item.gstRate}% </span>
                          ₹{formatINR(c.gstAmount)}
                        </td>
                      )}
                      <td className="py-2 px-3 text-right font-semibold text-gray-800">₹{formatINR(c.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-72 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal (Taxable)</span>
                  <span>₹{formatINR(totals.taxable)}</span>
                </div>
                {isIntra ? (
                  <>
                    <div className="flex justify-between text-gray-600">
                      <span>CGST</span>
                      <span>₹{formatINR(totals.gstAmount / 2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>SGST</span>
                      <span>₹{formatINR(totals.gstAmount / 2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-gray-600">
                    <span>IGST</span>
                    <span>₹{formatINR(totals.gstAmount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-base text-gray-900">
                  <span>Grand Total</span>
                  <span>₹{formatINR(totals.total)}</span>
                </div>
              </div>
            </div>

            {/* Amount in words */}
            <div className="mt-4 bg-gray-50 rounded-lg px-4 py-2">
              <p className="text-xs text-gray-500">Amount in Words:</p>
              <p className="text-sm font-medium text-gray-700">{amountInWords(totals.total)}</p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-400">This is a computer-generated invoice.</p>
                <p className="text-xs text-gray-400">Subject to {invoice.sellerAddress?.split(',').pop()?.trim() || 'local'} jurisdiction.</p>
              </div>
              <div className="text-right">
                <div className="h-10 border-b border-gray-300 w-40 mb-1" />
                <p className="text-xs text-gray-500">Authorised Signatory</p>
                <p className="text-xs font-medium text-gray-700">{invoice.sellerName}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
