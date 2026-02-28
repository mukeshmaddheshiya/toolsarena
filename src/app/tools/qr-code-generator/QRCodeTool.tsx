'use client';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode } from 'lucide-react';

type QRType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi';

const ERROR_LEVELS = ['L', 'M', 'Q', 'H'] as const;

export function QRCodeTool() {
  const [type, setType] = useState<QRType>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMsg, setSmsMsg] = useState('');
  const [ssid, setSsid] = useState('');
  const [wifiPwd, setWifiPwd] = useState('');
  const [wifiSec, setWifiSec] = useState('WPA');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [error, setError] = useState('');

  function getQRContent(): string {
    switch (type) {
      case 'url':
        return url;
      case 'text':
        return text;
      case 'email':
        return `mailto:${email}`;
      case 'phone':
        return `tel:${phone}`;
      case 'sms':
        return `sms:${smsPhone}${smsMsg ? `?body=${encodeURIComponent(smsMsg)}` : ''}`;
      case 'wifi':
        return `WIFI:T:${wifiSec};S:${ssid};P:${wifiPwd};;`;
      default:
        return '';
    }
  }

  useEffect(() => {
    const content = getQRContent();
    if (!content) {
      setQrDataUrl('');
      return;
    }
    QRCode.toDataURL(content, {
      width: size,
      errorCorrectionLevel: errorLevel,
      color: { dark: fg, light: bg },
      margin: 2,
    })
      .then((dataUrl) => {
        setQrDataUrl(dataUrl);
        setError('');
      })
      .catch((e: Error) => {
        setError(e.message);
        setQrDataUrl('');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, url, text, email, phone, smsPhone, smsMsg, ssid, wifiPwd, wifiSec, size, errorLevel, fg, bg]);

  function download() {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qr-code-${type}.png`;
    a.click();
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';

  const TYPES: { id: QRType; label: string }[] = [
    { id: 'url', label: 'URL' },
    { id: 'text', label: 'Text' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'sms', label: 'SMS' },
    { id: 'wifi', label: 'WiFi' },
  ];

  return (
    <div className="space-y-5">
      {/* Type selector */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              type === t.id
                ? 'bg-white dark:bg-slate-800 text-primary-800 dark:text-primary-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-3">
          {type === 'url' && (
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className={inputClass}
            />
          )}
          {type === 'text' && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text content..."
              className="tool-textarea min-h-[100px]"
            />
          )}
          {type === 'email' && (
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              type="email"
              className={inputClass}
            />
          )}
          {type === 'phone' && (
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className={inputClass}
            />
          )}
          {type === 'sms' && (
            <div className="space-y-2">
              <input
                value={smsPhone}
                onChange={(e) => setSmsPhone(e.target.value)}
                placeholder="Phone number"
                className={inputClass}
              />
              <input
                value={smsMsg}
                onChange={(e) => setSmsMsg(e.target.value)}
                placeholder="Pre-filled message (optional)"
                className={inputClass}
              />
            </div>
          )}
          {type === 'wifi' && (
            <div className="space-y-2">
              <input
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                placeholder="Network name (SSID)"
                className={inputClass}
              />
              <input
                value={wifiPwd}
                onChange={(e) => setWifiPwd(e.target.value)}
                placeholder="Password"
                type="password"
                className={inputClass}
              />
              <select
                value={wifiSec}
                onChange={(e) => setWifiSec(e.target.value)}
                className={inputClass}
              >
                <option>WPA</option>
                <option>WEP</option>
                <option>nopass</option>
              </select>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Size: {size}px
              </label>
              <input
                type="range"
                min={128}
                max={512}
                step={64}
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full accent-primary-800"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Error Correction
              </label>
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                {ERROR_LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setErrorLevel(l)}
                    className={`flex-1 py-1 text-xs font-medium transition-colors ${
                      errorLevel === l
                        ? 'bg-primary-800 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                QR Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer border-0"
                />
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{fg}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer border-0"
                />
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{bg}</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-64 h-64 bg-white rounded-2xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 shadow-sm">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-300 dark:text-slate-600">
                <QrCode className="w-16 h-16" />
                <span className="text-xs">Enter content above</span>
              </div>
            )}
          </div>
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 text-center">{error}</p>
          )}
          {qrDataUrl && (
            <button
              onClick={download}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-800 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
