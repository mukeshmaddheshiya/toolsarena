'use client';
import { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, ChevronRight, ChevronLeft, Eye, FileText, Image as ImageIcon, X } from 'lucide-react';
import { TEMPLATES, type BiodataTemplate } from './templates';

interface BiodataData {
  // Personal
  fullName: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
  height: string;
  weight: string;
  complexion: string;
  bloodGroup: string;
  religion: string;
  caste: string;
  subCaste: string;
  gotra: string;
  manglik: string;
  maritalStatus: string;
  diet: string;
  // Education & Career
  education: string;
  occupation: string;
  company: string;
  annualIncome: string;
  // Family
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  brothers: string;
  sisters: string;
  familyType: string;
  familyStatus: string;
  nativePlace: string;
  // Contact
  address: string;
  phone: string;
  email: string;
  // Extra
  aboutMe: string;
  expectations: string;
  hobbies: string;
  photo: string;
}

const INITIAL_DATA: BiodataData = {
  fullName: '', dob: '', birthTime: '', birthPlace: '', height: '', weight: '',
  complexion: '', bloodGroup: '', religion: 'Hindu', caste: '', subCaste: '', gotra: '',
  manglik: 'No', maritalStatus: 'Never Married', diet: '', education: '', occupation: '',
  company: '', annualIncome: '', fatherName: '', fatherOccupation: '', motherName: '',
  motherOccupation: '', brothers: '', sisters: '', familyType: 'Nuclear', familyStatus: '',
  nativePlace: '', address: '', phone: '', email: '', aboutMe: '', expectations: '',
  hobbies: '', photo: '',
};

const STEPS = ['Template', 'Personal', 'Education', 'Family', 'Contact', 'Preview'];

function ScaledBiodataPreview({ previewRef, data, template }: {
  previewRef: React.RefObject<HTMLDivElement | null>;
  data: BiodataData;
  template: BiodataTemplate;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentH, setContentH] = useState(600);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;
    const ro = new ResizeObserver(() => {
      const s = Math.min(container.clientWidth / 700, 1);
      setScale(s);
      setContentH(inner.scrollHeight);
    });
    ro.observe(container);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl bg-gray-100 dark:bg-slate-900 p-2 sm:p-4" style={{ overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: contentH * scale, overflow: 'hidden' }}>
        <div ref={innerRef} style={{ position: 'absolute', top: 0, left: 0, width: 700, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <BiodataPreview ref={previewRef} data={data} template={template} />
        </div>
      </div>
    </div>
  );
}

export function MarriageBiodataMakerTool() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BiodataData>(INITIAL_DATA);
  const [template, setTemplate] = useState<BiodataTemplate>(TEMPLATES[0]);
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof BiodataData, value: string) => setData(prev => ({ ...prev, [field]: value }));

  const handlePhoto = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => set('photo', e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const downloadImage = async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `${data.fullName || 'marriage'}-biodata.png`;
      a.click();
    } catch (err) { console.error(err); }
    setGenerating(false);
  };

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const imgBytes = await (await fetch(canvas.toDataURL('image/png'))).arrayBuffer();
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      const img = await doc.embedPng(imgBytes);
      const pageW = 595.28; // A4 width
      const scale = pageW / img.width;
      const drawW = pageW;
      const drawH = img.height * scale;
      const page = doc.addPage([pageW, drawH]);
      page.drawImage(img, { x: 0, y: 0, width: drawW, height: drawH });
      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${data.fullName || 'marriage'}-biodata.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) { console.error(err); }
    setGenerating(false);
  };

  const reset = () => { setData(INITIAL_DATA); setStep(0); setTemplate(TEMPLATES[0]); };

  // --- Inline form field helpers (plain JSX, not components, to avoid focus loss) ---
  const inputCls = "w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-200";
  const labelCls = "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1";
  const field = (label: string, key: keyof BiodataData, placeholder?: string) => (
    <div key={key}>
      <label className={labelCls}>{label}</label>
      <input type="text" value={data[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} className={inputCls} />
    </div>
  );
  const selectField = (label: string, key: keyof BiodataData, options: string[]) => (
    <div key={key}>
      <label className={labelCls}>{label}</label>
      <select value={data[key]} onChange={(e) => set(key, e.target.value)} className={inputCls}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
  const textArea = (label: string, key: keyof BiodataData, placeholder?: string, rows = 2) => (
    <div key={key}>
      <label className={labelCls}>{label}</label>
      <textarea value={data[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} rows={rows} className={inputCls + " resize-none"} />
    </div>
  );

  // --- Render steps ---
  const renderStep = () => {
    switch (step) {
      case 0: // Template selection
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Choose a template for your biodata. You can change it later.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setTemplate(t)}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all ${template.id === t.id ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800' : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'}`}>
                  <div className="h-24 flex flex-col">
                    <div className="h-8 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: t.headerBg, color: t.headerText }}>
                      {t.symbol && <span className="mr-1">{t.symbol}</span>} Biodata
                    </div>
                    <div className="flex-1 p-1.5" style={{ backgroundColor: t.bodyBg }}>
                      <div className="h-1.5 rounded-full mb-1" style={{ backgroundColor: t.accentColor, width: '60%' }} />
                      <div className="h-1 rounded-full mb-0.5" style={{ backgroundColor: t.borderColor, width: '80%', opacity: 0.3 }} />
                      <div className="h-1 rounded-full mb-0.5" style={{ backgroundColor: t.borderColor, width: '70%', opacity: 0.3 }} />
                      <div className="h-1 rounded-full" style={{ backgroundColor: t.borderColor, width: '50%', opacity: 0.3 }} />
                    </div>
                  </div>
                  <p className="text-[10px] font-medium text-center py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{t.name}</p>
                  {template.id === t.id && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 1: // Personal
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Personal Details</h3>
            {/* Photo */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {data.photo ? (
                  <div className="relative">
                    <img src={data.photo} alt="Profile" className="w-24 h-28 rounded-lg object-cover border border-slate-300" />
                    <button onClick={() => set('photo', '')} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-28 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:border-primary-500 hover:text-primary-500 transition-colors">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px]">Add Photo</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {field('Full Name *', 'fullName', 'e.g. Priya Sharma')}
                {field('Date of Birth', 'dob', 'e.g. 15 Jan 1998')}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {field('Birth Time', 'birthTime', 'e.g. 10:30 AM')}
              {field('Birth Place', 'birthPlace', 'e.g. Jaipur')}
              {field('Height', 'height', "e.g. 5'6\"")}
              {field('Weight', 'weight', 'e.g. 58 kg')}
              {selectField('Complexion', 'complexion', ['', 'Very Fair', 'Fair', 'Wheatish', 'Wheatish Brown', 'Dark'])}
              {selectField('Blood Group', 'bloodGroup', ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectField('Religion', 'religion', ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Other'])}
              {field('Caste', 'caste', 'e.g. Brahmin')}
              {field('Sub-caste', 'subCaste', 'e.g. Kanyakubj')}
              {field('Gotra', 'gotra', 'e.g. Bharadwaj')}
              {selectField('Manglik', 'manglik', ['No', 'Yes', 'Anshik (Partial)', "Don't Know"])}
              {selectField('Marital Status', 'maritalStatus', ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'])}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {selectField('Diet', 'diet', ['', 'Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain'])}
              {field('Hobbies', 'hobbies', 'e.g. Reading, Cooking, Travel')}
            </div>
          </div>
        );

      case 2: // Education & Career
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Education & Career</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field('Highest Education *', 'education', 'e.g. B.Tech (Computer Science)')}
              {field('Occupation *', 'occupation', 'e.g. Software Engineer')}
              {field('Company / Organization', 'company', 'e.g. TCS, Infosys')}
              {field('Annual Income', 'annualIncome', 'e.g. 8-10 LPA')}
            </div>
            {textArea('About Me (Optional)', 'aboutMe', 'Write a short description about yourself, your values, and what makes you unique...', 3)}
          </div>
        );

      case 3: // Family
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Family Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field("Father's Name *", 'fatherName', 'e.g. Shri Rajesh Sharma')}
              {field("Father's Occupation", 'fatherOccupation', 'e.g. Businessman')}
              {field("Mother's Name *", 'motherName', 'e.g. Smt. Sunita Sharma')}
              {field("Mother's Occupation", 'motherOccupation', 'e.g. Homemaker')}
              {field('Brother(s)', 'brothers', 'e.g. 1 Elder (Married), 1 Younger')}
              {field('Sister(s)', 'sisters', 'e.g. 1 Elder (Married)')}
              {selectField('Family Type', 'familyType', ['Nuclear', 'Joint', 'Extended'])}
              {selectField('Family Status', 'familyStatus', ['', 'Middle Class', 'Upper Middle Class', 'Rich', 'Affluent'])}
              {field('Native Place', 'nativePlace', 'e.g. Lucknow, Uttar Pradesh')}
            </div>
          </div>
        );

      case 4: // Contact
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact & Expectations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field('Phone Number', 'phone', 'e.g. +91 98765 43210')}
              {field('Email', 'email', 'e.g. family@email.com')}
            </div>
            {textArea('Address', 'address', 'e.g. 123, Sector 5, Jaipur, Rajasthan - 302001', 2)}
            {textArea('Partner Expectations (Optional)', 'expectations', 'Describe what you are looking for in a life partner — education, values, qualities...', 3)}
          </div>
        );

      case 5: // Preview
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Preview & Download</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={downloadImage} disabled={generating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium transition-colors">
                  <ImageIcon className="w-4 h-4" /> {generating ? 'Generating...' : <><span className="hidden sm:inline">Download</span> PNG</>}
                </button>
                <button onClick={downloadPDF} disabled={generating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 text-sm font-medium transition-colors">
                  <FileText className="w-4 h-4" /> {generating ? '...' : <><span className="hidden sm:inline">Download</span> PDF</>}
                </button>
              </div>
            </div>
            <ScaledBiodataPreview previewRef={previewRef} data={data} template={template} />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => setStep(i)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              i === step ? 'bg-primary-600 text-white' : i < step ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
              {i < step ? '\u2713' : i + 1}
            </span>
            <span className="hidden sm:inline">{s}</span>
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={reset} className="px-3 py-2 text-xs text-slate-500 hover:text-red-500 transition-colors">
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset
        </button>
        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 text-sm font-medium transition-colors">
              <ChevronLeft className="w-4 h-4 inline" /> Back
            </button>
          )}
          {step < STEPS.length - 1 && (
            <button onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors">
              {step === STEPS.length - 2 ? <><Eye className="w-4 h-4 inline mr-1" /> Preview</> : <>Next <ChevronRight className="w-4 h-4 inline" /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Biodata Preview Component ----
import { forwardRef } from 'react';

const BiodataPreview = forwardRef<HTMLDivElement, { data: BiodataData; template: BiodataTemplate }>(({ data, template: t }, ref) => {
  const Row = ({ label, value }: { label: string; value: string }) => {
    if (!value) return null;
    return (
      <tr>
        <td style={{ padding: '5px 12px 5px 0', fontWeight: 600, color: t.labelColor, fontSize: 14, whiteSpace: 'nowrap', verticalAlign: 'top', width: '35%' }}>{label}</td>
        <td style={{ padding: '5px 0', fontSize: 14, color: t.bodyText, verticalAlign: 'top' }}>{value}</td>
      </tr>
    );
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: t.headerBg, borderBottom: `2px solid ${t.accentColor}`, paddingBottom: 4, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>
        {title}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>{children}</tbody></table>
    </div>
  );

  return (
    <div ref={ref} style={{
      width: 700,
      fontFamily: t.fontFamily,
      backgroundColor: t.bodyBg,
      border: t.borderStyle,
      borderRadius: 4,
      overflow: 'hidden',
      color: t.bodyText,
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: t.headerBg,
        color: t.headerText,
        textAlign: 'center',
        padding: '24px 32px',
      }}>
        {t.symbol && <div style={{ fontSize: 28, marginBottom: 4 }}>{t.symbol}</div>}
        <div style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.8, marginBottom: 4 }}>Biodata</div>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 1 }}>{data.fullName || 'Your Name'}</div>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 32px' }}>
        {/* Photo + Personal side by side */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          {data.photo && (
            <div style={{ flexShrink: 0 }}>
              <img src={data.photo} alt="" style={{ width: 120, height: 150, objectFit: 'cover', borderRadius: 4, border: `2px solid ${t.borderColor}` }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <Section title="Personal Details">
              <Row label="Date of Birth" value={data.dob} />
              <Row label="Birth Time" value={data.birthTime} />
              <Row label="Birth Place" value={data.birthPlace} />
              <Row label="Height" value={data.height} />
              <Row label="Weight" value={data.weight} />
              <Row label="Complexion" value={data.complexion} />
              <Row label="Blood Group" value={data.bloodGroup} />
            </Section>
          </div>
        </div>

        <Section title="Religious Details">
          <Row label="Religion" value={data.religion} />
          <Row label="Caste" value={data.caste} />
          <Row label="Sub-caste" value={data.subCaste} />
          <Row label="Gotra" value={data.gotra} />
          <Row label="Manglik" value={data.manglik} />
          <Row label="Marital Status" value={data.maritalStatus} />
          <Row label="Diet" value={data.diet} />
        </Section>

        <Section title="Education & Career">
          <Row label="Education" value={data.education} />
          <Row label="Occupation" value={data.occupation} />
          <Row label="Company" value={data.company} />
          <Row label="Annual Income" value={data.annualIncome} />
          <Row label="Hobbies" value={data.hobbies} />
        </Section>

        {data.aboutMe && (
          <div style={{ marginBottom: 16, padding: '10px 14px', backgroundColor: `${t.accentColor}10`, borderRadius: 4, borderLeft: `3px solid ${t.accentColor}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.labelColor, textTransform: 'uppercase', marginBottom: 3 }}>About Me</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: t.bodyText }}>{data.aboutMe}</div>
          </div>
        )}

        <Section title="Family Details">
          <Row label="Father" value={[data.fatherName, data.fatherOccupation].filter(Boolean).join(' — ')} />
          <Row label="Mother" value={[data.motherName, data.motherOccupation].filter(Boolean).join(' — ')} />
          <Row label="Brother(s)" value={data.brothers} />
          <Row label="Sister(s)" value={data.sisters} />
          <Row label="Family Type" value={data.familyType} />
          <Row label="Family Status" value={data.familyStatus} />
          <Row label="Native Place" value={data.nativePlace} />
        </Section>

        {(data.phone || data.email || data.address) && (
          <Section title="Contact Details">
            <Row label="Phone" value={data.phone} />
            <Row label="Email" value={data.email} />
            <Row label="Address" value={data.address} />
          </Section>
        )}

        {data.expectations && (
          <div style={{ padding: '10px 14px', backgroundColor: `${t.accentColor}10`, borderRadius: 4, borderLeft: `3px solid ${t.accentColor}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.labelColor, textTransform: 'uppercase', marginBottom: 3 }}>Partner Expectations</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: t.bodyText }}>{data.expectations}</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '10px 32px', fontSize: 10, color: t.labelColor, opacity: 0.5, borderTop: `1px solid ${t.borderColor}` }}>
        Created with ToolsArena.in
      </div>
    </div>
  );
});
BiodataPreview.displayName = 'BiodataPreview';
