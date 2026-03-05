'use client';
import { useState, useCallback, useMemo } from 'react';
import { MessageCircle, Copy, Check, ExternalLink, QrCode, Phone, Link2, Globe } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '91', country: 'India', flag: '🇮🇳' },
  { code: '1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '44', country: 'UK', flag: '🇬🇧' },
  { code: '971', country: 'UAE', flag: '🇦🇪' },
  { code: '966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '61', country: 'Australia', flag: '🇦🇺' },
  { code: '65', country: 'Singapore', flag: '🇸🇬' },
  { code: '60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '977', country: 'Nepal', flag: '🇳🇵' },
  { code: '880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '49', country: 'Germany', flag: '🇩🇪' },
  { code: '33', country: 'France', flag: '🇫🇷' },
  { code: '81', country: 'Japan', flag: '🇯🇵' },
  { code: '86', country: 'China', flag: '🇨🇳' },
  { code: '55', country: 'Brazil', flag: '🇧🇷' },
  { code: '27', country: 'South Africa', flag: '🇿🇦' },
  { code: '234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '254', country: 'Kenya', flag: '🇰🇪' },
];

const MESSAGE_TEMPLATES = [
  { label: 'Order Inquiry', text: 'Hi! I would like to inquire about your products/services. Could you please share the details?' },
  { label: 'Appointment', text: 'Hello, I would like to book an appointment. Please let me know the available slots.' },
  { label: 'Support', text: 'Hi, I need help with an issue. Can you please assist me?' },
  { label: 'Price Quote', text: 'Hello! Can you please share the pricing details for your services?' },
  { label: 'Feedback', text: 'Hi, I wanted to share some feedback about my recent experience with your service.' },
  { label: 'Custom', text: '' },
];

export function WhatsAppLinkGeneratorTool() {
  const [countryCode, setCountryCode] = useState('91');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  const cleanPhone = phone.replace(/\D/g, '');
  const fullNumber = countryCode + cleanPhone;
  const phoneValid = cleanPhone.length >= 7 && cleanPhone.length <= 15;
  const waLink = useMemo(() => {
    if (!cleanPhone) return '';
    const base = `https://wa.me/${fullNumber}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }, [fullNumber, cleanPhone, message]);

  const apiLink = useMemo(() => {
    if (!cleanPhone) return '';
    const base = `https://api.whatsapp.com/send?phone=${fullNumber}`;
    return message ? `${base}&text=${encodeURIComponent(message)}` : base;
  }, [fullNumber, cleanPhone, message]);

  const qrUrl = useMemo(() => {
    if (!waLink) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(waLink)}`;
  }, [waLink]);

  const copyToClipboard = useCallback(async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">WhatsApp Link Generator</h2>
            <p className="text-green-100 text-xs">Create click-to-chat links instantly | No need to save contacts</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          {/* Country Code + Phone */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Phone Number *</label>
            <div className="flex gap-2">
              <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                className="w-36 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none">
                {COUNTRY_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} +{c.code} {c.country}</option>
                ))}
              </select>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9\s-]/g, ''))}
                placeholder="9876543210"
                className={`flex-1 rounded-lg border bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 outline-none ${
                  cleanPhone && !phoneValid ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-green-500'}`} />
            </div>
            {cleanPhone && !phoneValid && <p className="text-[10px] text-red-500 mt-1">Enter a valid phone number (7-15 digits)</p>}
            {cleanPhone && phoneValid && <p className="text-[10px] text-green-500 mt-1">+{countryCode} {cleanPhone} — looks good!</p>}
          </div>

          {/* Message Templates */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Quick Templates</label>
            <div className="flex flex-wrap gap-1.5">
              {MESSAGE_TEMPLATES.map(t => (
                <button key={t.label} onClick={() => setMessage(t.text)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-green-50 hover:text-green-700 transition-colors">
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Pre-filled Message (Optional)</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Hi! I saw your ad and would like to know more..."
              rows={4}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none" />
            <div className="text-[10px] text-slate-400 mt-1">{message.length} characters</div>
          </div>
        </div>

        {/* Preview & Output */}
        <div className="space-y-4">
          {/* Live Preview */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Preview</h3>
            {cleanPhone ? (
              <div className="space-y-3">
                <div className="bg-white dark:bg-slate-700 rounded-lg p-3 text-sm space-y-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedCountry?.flag} +{countryCode} {cleanPhone}</span>
                  </div>
                  {message && (
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-2 text-xs text-green-800 dark:text-green-300 border-l-[3px] border-green-400">
                      {message}
                    </div>
                  )}
                </div>

                {/* wa.me Link */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">wa.me Link</label>
                  <div className="flex gap-1.5">
                    <input readOnly value={waLink} className="flex-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-2 text-xs font-mono text-green-700 dark:text-green-400" />
                    <button onClick={() => copyToClipboard(waLink, 'wa')}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${copied === 'wa' ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                      {copied === 'wa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* API Link */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">API Link (for websites)</label>
                  <div className="flex gap-1.5">
                    <input readOnly value={apiLink} className="flex-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-2 text-xs font-mono text-green-700 dark:text-green-400" />
                    <button onClick={() => copyToClipboard(apiLink, 'api')}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${copied === 'api' ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                      {copied === 'api' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Open in WhatsApp
                  </a>
                  <button onClick={() => setShowQR(!showQR)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${showQR ? 'bg-green-100 text-green-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'}`}>
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* QR Code */}
                {showQR && (
                  <div className="text-center bg-white dark:bg-slate-700 rounded-lg p-4">
                    <img src={qrUrl} alt="WhatsApp QR Code" className="mx-auto rounded-lg" width={200} height={200} />
                    <p className="text-[10px] text-slate-500 mt-2">Scan to open WhatsApp chat</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                Enter a phone number to generate link
              </div>
            )}
          </div>

          {/* HTML Embed Code */}
          {cleanPhone && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">HTML Button Code</label>
              <div className="relative">
                <pre className="bg-slate-900 text-green-400 rounded-lg p-3 text-[11px] overflow-x-auto font-mono">
{`<a href="${waLink}"
   target="_blank"
   style="background:#25D366;color:#fff;
   padding:10px 20px;border-radius:8px;
   text-decoration:none;font-weight:bold;
   display:inline-flex;align-items:center;
   gap:8px">
  💬 Chat on WhatsApp
</a>`}
                </pre>
                <button onClick={() => copyToClipboard(`<a href="${waLink}" target="_blank" style="background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-flex;align-items:center;gap:8px">💬 Chat on WhatsApp</a>`, 'html')}
                  className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-medium transition-colors ${copied === 'html' ? 'bg-green-700 text-green-100' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                  {copied === 'html' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">How Businesses Use WhatsApp Links</h4>
        <div className="grid md:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-1">
            <strong className="text-slate-700 dark:text-slate-300">E-commerce & Shops</strong>
            <p>Add &quot;Order on WhatsApp&quot; buttons to product pages. Customers can inquire about products without saving your number.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-700 dark:text-slate-300">Social Media Bios</strong>
            <p>Put wa.me links in Instagram, Facebook & YouTube bios. Followers can message you directly with one tap.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-700 dark:text-slate-300">Google My Business</strong>
            <p>Add WhatsApp links to your Google Business profile. Customers can chat instead of calling.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
