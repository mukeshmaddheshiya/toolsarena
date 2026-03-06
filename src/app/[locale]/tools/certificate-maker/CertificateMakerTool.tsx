'use client';

import { useState, useRef, useEffect, forwardRef } from 'react';
import { Award, Download, RotateCcw, FileText, Building2, User, Calendar, Hash, Sparkles } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES & CONSTANTS                                                  */
/* ------------------------------------------------------------------ */

const CERT_TYPES = ['Achievement', 'Appreciation', 'Completion', 'Participation', 'Excellence', 'Training'] as const;

interface Template {
  id: string; name: string; accent: string; border: string;
  bg: string; ribbon: string; textPrimary: string; textSecondary: string;
}

const TEMPLATES: Template[] = [
  { id: 'classic', name: 'Classic', accent: '#b8860b', border: '#d4a843', bg: 'linear-gradient(135deg, #fffef5 0%, #fdf6e3 50%, #faf0d7 100%)', ribbon: '#8b6914', textPrimary: '#2c1810', textSecondary: '#5a3e28' },
  { id: 'modern', name: 'Modern', accent: '#1e5faa', border: '#2563eb', bg: 'linear-gradient(135deg, #f0f7ff 0%, #e8f2ff 50%, #dbeafe 100%)', ribbon: '#1d4ed8', textPrimary: '#0f172a', textSecondary: '#334155' },
  { id: 'elegant', name: 'Elegant', accent: '#166534', border: '#22c55e', bg: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #dcfce7 100%)', ribbon: '#15803d', textPrimary: '#14532d', textSecondary: '#365314' },
  { id: 'corporate', name: 'Corporate', accent: '#1e293b', border: '#475569', bg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)', ribbon: '#334155', textPrimary: '#0f172a', textSecondary: '#475569' },
  { id: 'creative', name: 'Creative', accent: '#7c3aed', border: '#a855f7', bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #ede9fe 100%)', ribbon: '#6d28d9', textPrimary: '#1e1b4b', textSecondary: '#4c1d95' },
];

interface CertData {
  recipientName: string; certTitle: string; description: string;
  organization: string; issuedDate: string; signatoryName: string;
  signatoryTitle: string; certNumber: string; autoNumber: boolean;
}

const INITIAL: CertData = {
  recipientName: '', certTitle: '', description: '', organization: '',
  issuedDate: new Date().toISOString().slice(0, 10), signatoryName: '',
  signatoryTitle: '', certNumber: '', autoNumber: true,
};

/* ------------------------------------------------------------------ */
/*  CERTIFICATE PREVIEW (all inline styles for html2canvas)            */
/* ------------------------------------------------------------------ */

interface CertPreviewProps { data: CertData; template: Template; certType: string; }

const CertificatePreview = forwardRef<HTMLDivElement, CertPreviewProps>(
  ({ data, template: t, certType }, ref) => {
    const title = data.certTitle || `Certificate of ${certType}`;
    const name = data.recipientName || 'Recipient Name';
    const desc = data.description || `This is to certify that ${name} has been awarded this certificate in recognition of outstanding ${certType.toLowerCase()}.`;
    const org = data.organization || 'Organization Name';
    const date = data.issuedDate
      ? new Date(data.issuedDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '';
    const num = data.autoNumber ? `CERT-${Date.now().toString(36).toUpperCase().slice(-6)}` : data.certNumber;

    return (
      <div ref={ref} style={{ width: 800, height: 566, background: t.bg, position: 'relative', fontFamily: "'Georgia', 'Times New Roman', serif", overflow: 'hidden', boxSizing: 'border-box' }}>
        {/* Outer ornamental border */}
        <div style={{ position: 'absolute', inset: 12, border: `3px solid ${t.border}`, borderRadius: 4 }}>
          <div style={{ position: 'absolute', inset: 6, border: `1px solid ${t.accent}`, borderRadius: 2 }} />
        </div>
        {/* Corner ornaments */}
        {([{ top: 18, left: 18 }, { top: 18, right: 18 }, { bottom: 18, left: 18 }, { bottom: 18, right: 18 }] as const).map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', ...pos, width: 40, height: 40,
            borderTop: i < 2 ? `3px solid ${t.accent}` : 'none',
            borderBottom: i >= 2 ? `3px solid ${t.accent}` : 'none',
            borderLeft: i % 2 === 0 ? `3px solid ${t.accent}` : 'none',
            borderRight: i % 2 === 1 ? `3px solid ${t.accent}` : 'none',
          }} />
        ))}
        {/* Top ribbon */}
        <div style={{ position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)', width: 120, height: 4, background: t.ribbon, borderRadius: 2 }} />
        {/* Main content */}
        <div style={{ position: 'absolute', inset: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 30px' }}>
          <div style={{ fontSize: 28, color: t.accent, marginBottom: 2, letterSpacing: 6 }}>&#9733;</div>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: t.accent, margin: '0 0 6px 0', letterSpacing: 3, textTransform: 'uppercase', lineHeight: 1.2 }}>{title}</h1>
          <div style={{ width: 200, height: 1, background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)`, margin: '8px 0' }} />
          <p style={{ fontSize: 13, color: t.textSecondary, margin: '6px 0 4px 0', fontStyle: 'italic', letterSpacing: 2 }}>This certificate is proudly presented to</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: t.textPrimary, margin: '4px 0', fontFamily: "'Georgia', 'Palatino', serif", fontStyle: 'italic', borderBottom: `2px solid ${t.accent}`, paddingBottom: 4, lineHeight: 1.3 }}>{name}</h2>
          <p style={{ fontSize: 12.5, color: t.textSecondary, margin: '10px 0', lineHeight: 1.6, maxWidth: 560 }}>{desc}</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary, margin: '8px 0 16px 0', letterSpacing: 1 }}>{org}</p>
          {/* Footer: date + signature */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', maxWidth: 600, marginTop: 'auto' }}>
            <div style={{ textAlign: 'center', minWidth: 140 }}>
              <p style={{ fontSize: 11, color: t.textSecondary, margin: '0 0 2px 0' }}>{date}</p>
              <div style={{ width: 120, height: 1, background: t.accent, margin: '0 auto' }} />
              <p style={{ fontSize: 10, color: t.textSecondary, margin: '3px 0 0 0', textTransform: 'uppercase', letterSpacing: 1 }}>Date</p>
            </div>
            <div style={{ textAlign: 'center', minWidth: 160 }}>
              <p style={{ fontSize: 13, fontStyle: 'italic', color: t.textPrimary, margin: '0 0 2px 0', fontFamily: "'Georgia', serif" }}>{data.signatoryName || 'Authorized Signatory'}</p>
              <div style={{ width: 140, height: 1, background: t.accent, margin: '0 auto' }} />
              <p style={{ fontSize: 10, color: t.textSecondary, margin: '3px 0 0 0', textTransform: 'uppercase', letterSpacing: 1 }}>{data.signatoryTitle || 'Director'}</p>
            </div>
          </div>
          {/* Cert number */}
          {num && <p style={{ fontSize: 9, color: t.textSecondary, opacity: 0.7, marginTop: 6 }}>{num}</p>}
        </div>
        {/* Bottom ribbon */}
        <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', width: 120, height: 4, background: t.ribbon, borderRadius: 2 }} />
      </div>
    );
  }
);
CertificatePreview.displayName = 'CertificatePreview';

/* ------------------------------------------------------------------ */
/*  SCALED PREVIEW WRAPPER                                             */
/* ------------------------------------------------------------------ */

function ScaledPreview(props: CertPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => setScale(container.clientWidth / 800));
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden rounded-lg shadow-lg" style={{ aspectRatio: '800/566' }}>
      <div ref={innerRef} style={{ width: 800, height: 566, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <CertificatePreview {...props} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  REUSABLE INPUT                                                     */
/* ------------------------------------------------------------------ */

function Input({ label, icon, value, onChange, placeholder, type = 'text' }: {
  label: string; icon?: React.ReactNode; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 text-sm ${icon ? 'pl-9 pr-3' : 'px-3'}`} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function CertificateMakerTool() {
  const [data, setData] = useState<CertData>(INITIAL);
  const [certType, setCertType] = useState<string>(CERT_TYPES[0]);
  const [templateId, setTemplateId] = useState('classic');
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const set = (key: keyof CertData, val: string | boolean) => setData(prev => ({ ...prev, [key]: val }));

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `certificate-${(data.recipientName || 'certificate').replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch { alert('Download failed. Please try again.'); }
    finally { setDownloading(false); }
  };

  const handleReset = () => { setData(INITIAL); setCertType(CERT_TYPES[0]); setTemplateId('classic'); };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-amber-500 to-yellow-400 p-6 sm:p-10 text-white">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Award className="w-8 h-8" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Certificate Maker</h1>
            <p className="text-white/80 mt-1 text-sm sm:text-base">Create professional certificates in seconds</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ---- Form Panel ---- */}
        <div className="space-y-6">
          {/* Type & Template */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" /> Type & Style</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Certificate Type</label>
              <select value={certType} onChange={e => setCertType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm">
                {CERT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Template Style</label>
              <div className="grid grid-cols-5 gap-2">
                {TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => setTemplateId(t.id)}
                    className={`rounded-lg border-2 p-2 text-xs font-medium transition-all ${templateId === t.id ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800' : 'border-gray-200 dark:border-gray-600 hover:border-gray-400'}`}>
                    <div className="w-full h-5 rounded mb-1" style={{ background: t.bg, border: `2px solid ${t.border}` }} />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Certificate Details</h2>
            <Input label="Certificate Title" icon={<FileText className="w-4 h-4" />} placeholder={`Certificate of ${certType}`} value={data.certTitle} onChange={v => set('certTitle', v)} />
            <Input label="Recipient Name" icon={<User className="w-4 h-4" />} placeholder="John Doe" value={data.recipientName} onChange={v => set('recipientName', v)} />
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea rows={3} placeholder="This is to certify that..." value={data.description} onChange={e => set('description', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm resize-none" />
            </div>
            <Input label="Organization" icon={<Building2 className="w-4 h-4" />} placeholder="Acme Corporation" value={data.organization} onChange={v => set('organization', v)} />
            <Input label="Issued Date" type="date" icon={<Calendar className="w-4 h-4" />} value={data.issuedDate} onChange={v => set('issuedDate', v)} />
          </div>

          {/* Signatory & ID */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2"><User className="w-5 h-5 text-green-500" /> Signatory & ID</h2>
            <Input label="Signatory Name" placeholder="Jane Smith" value={data.signatoryName} onChange={v => set('signatoryName', v)} />
            <Input label="Signatory Title" placeholder="Director of Education" value={data.signatoryTitle} onChange={v => set('signatoryTitle', v)} />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={data.autoNumber} onChange={e => set('autoNumber', e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                Auto-generate Certificate ID
              </label>
            </div>
            {!data.autoNumber && (
              <Input label="Certificate Number" icon={<Hash className="w-4 h-4" />} placeholder="CERT-2026-001" value={data.certNumber} onChange={v => set('certNumber', v)} />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button onClick={handleDownload} disabled={downloading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 transition-colors disabled:opacity-50">
              <Download className="w-5 h-5" /> {downloading ? 'Generating...' : 'Download PNG'}
            </button>
            <button onClick={handleReset}
              className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium py-3 px-4 transition-colors">
              <RotateCcw className="w-5 h-5" /> Reset
            </button>
          </div>
        </div>

        {/* ---- Preview Panel ---- */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> Live Preview</h2>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 p-4">
            <ScaledPreview data={data} template={template} certType={certType} />
          </div>
        </div>
      </div>

      {/* Hidden full-size render target for html2canvas */}
      <div style={{ position: 'absolute', left: -9999, top: -9999 }}>
        <CertificatePreview ref={certRef} data={data} template={template} certType={certType} />
      </div>
    </div>
  );
}
