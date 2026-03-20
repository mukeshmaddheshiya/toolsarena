'use client';

import { useState, useCallback } from 'react';

interface UpiFormData {
  upiId: string;
  payeeName: string;
  amount: string;
  note: string;
}

interface ValidationErrors {
  upiId?: string;
  payeeName?: string;
  amount?: string;
}

const UPI_APPS = [
  { name: 'PhonePe', color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700' },
  { name: 'Google Pay', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' },
  { name: 'Paytm', color: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700' },
  { name: 'BHIM', color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700' },
  { name: 'Amazon Pay', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700' },
  { name: 'CRED', color: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600' },
];

function validateUpiId(upiId: string): boolean {
  const upiRegex = /^[a-zA-Z0-9.\-_+]+@[a-zA-Z][a-zA-Z0-9]+$/;
  return upiRegex.test(upiId.trim());
}

function buildUpiUri(data: UpiFormData): string {
  const params = new URLSearchParams();
  params.set('pa', data.upiId.trim());
  params.set('pn', data.payeeName.trim());
  params.set('cu', 'INR');
  if (data.amount.trim()) {
    params.set('am', data.amount.trim());
  }
  if (data.note.trim()) {
    params.set('tn', data.note.trim());
  }
  return `upi://pay?${params.toString()}`;
}

function buildQrApiUrl(upiUri: string): string {
  const encoded = encodeURIComponent(upiUri);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}&margin=10&format=png`;
}

export function UpiQrGeneratorTool() {
  const [form, setForm] = useState<UpiFormData>({
    upiId: '',
    payeeName: '',
    amount: '',
    note: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [qrUrl, setQrUrl] = useState<string>('');
  const [upiUri, setUpiUri] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  const handleChange = useCallback(
    (field: keyof UpiFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      if (qrGenerated) {
        setQrGenerated(false);
        setQrUrl('');
      }
    },
    [qrGenerated]
  );

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!form.upiId.trim()) {
      newErrors.upiId = 'UPI ID is required.';
    } else if (!validateUpiId(form.upiId)) {
      newErrors.upiId = 'Invalid UPI ID. Use format: username@handle (e.g., name@okicici)';
    }
    if (!form.payeeName.trim()) {
      newErrors.payeeName = 'Payee name is required.';
    }
    if (form.amount.trim()) {
      const amt = parseFloat(form.amount);
      if (isNaN(amt) || amt <= 0) {
        newErrors.amount = 'Amount must be a positive number.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    const uri = buildUpiUri(form);
    const url = buildQrApiUrl(uri);
    setUpiUri(uri);
    setQrUrl(url);
    setQrGenerated(true);
  };

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(form.upiId.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = form.upiId.trim();
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    window.open(qrUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">UPI QR Code Generator</h1>
        <p className="text-slate-500 text-sm">
          Create a scannable UPI payment QR code for PhonePe, Google Pay, Paytm, BHIM and all UPI apps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Payment Details</h2>

          {/* UPI ID */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              UPI ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.upiId}
              onChange={handleChange('upiId')}
              placeholder="e.g., yourname@okicici"
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            {errors.upiId && (
              <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>
            )}
            <p className="text-slate-400 text-xs">Supported handles: @okicici, @ybl, @paytm, @okaxis, @upi, etc.</p>
          </div>

          {/* Payee Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Payee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.payeeName}
              onChange={handleChange('payeeName')}
              placeholder="e.g., Rahul Sharma"
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            {errors.payeeName && (
              <p className="text-red-500 text-xs mt-1">{errors.payeeName}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Amount (₹) <span className="text-slate-400 font-normal text-xs">— optional</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">₹</span>
              <input
                type="number"
                value={form.amount}
                onChange={handleChange('amount')}
                placeholder="Leave blank for any amount"
                min="0"
                step="0.01"
                className="w-full border border-slate-200 dark:border-slate-600 rounded-lg pl-7 pr-3 py-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Transaction Note <span className="text-slate-400 font-normal text-xs">— optional</span>
            </label>
            <input
              type="text"
              value={form.note}
              onChange={handleChange('note')}
              placeholder="e.g., Payment for services"
              maxLength={100}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm shadow-sm"
          >
            Generate QR Code
          </button>

          {/* Supported Apps */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Works with all UPI apps</p>
            <div className="flex flex-wrap gap-2">
              {UPI_APPS.map((app) => (
                <span
                  key={app.name}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border ${app.color}`}
                >
                  {app.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* QR Preview Section */}
        <div className="space-y-4">
          {/* QR Code Box */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col items-center justify-center min-h-64 space-y-4">
            {qrGenerated && qrUrl ? (
              <>
                <div className="p-3 bg-white rounded-xl border-2 border-green-100 dark:border-green-800 shadow-inner">
                  <img
                    src={qrUrl}
                    alt="UPI Payment QR Code"
                    width={240}
                    height={240}
                    className="block"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '';
                      target.alt = 'Failed to load QR. Check your internet connection.';
                    }}
                  />
                </div>
                <p className="text-xs text-slate-400">Scan with any UPI app to pay</p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleDownload}
                    className="flex-1 border border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 font-medium py-2 rounded-lg text-sm transition-colors"
                  >
                    Download QR
                  </button>
                  <button
                    onClick={handleCopyUpiId}
                    className="flex-1 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium py-2 rounded-lg text-sm transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy UPI ID'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-3 py-8">
                <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-300 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm">Your QR code will appear here</p>
              </div>
            )}
          </div>

          {/* Preview Card */}
          {qrGenerated && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Payment Preview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500">UPI ID</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{form.upiId}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500">Payee Name</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{form.payeeName}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {form.amount ? `₹${parseFloat(form.amount).toFixed(2)}` : 'Any amount'}
                  </span>
                </div>
                {form.note && (
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-500">Note</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 max-w-40 text-right truncate">{form.note}</span>
                  </div>
                )}
              </div>

              {/* UPI URI (for reference) */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-medium mb-1">UPI URI</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 break-all font-mono">{upiUri}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">How to use this QR code</h3>
        <ul className="space-y-1.5 text-sm text-green-700 dark:text-green-400">
          <li>• Print or display this QR at your shop, stall, or send it digitally to receive payments.</li>
          <li>• Anyone with a UPI app can scan and pay instantly — no bank details needed.</li>
          <li>• Setting a fixed amount pre-fills the payment field for the payer.</li>
          <li>• Your QR is generated instantly using a secure QR API — no data is stored.</li>
        </ul>
      </div>
    </div>
  );
}
