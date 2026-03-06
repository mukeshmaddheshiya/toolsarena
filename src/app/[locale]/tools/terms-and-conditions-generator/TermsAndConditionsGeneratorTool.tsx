'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Scale, FileText, Copy, Download, CheckCircle, AlertTriangle,
  Globe, Mail, Building2, Calendar, ChevronDown,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES & CONSTANTS                                                  */
/* ------------------------------------------------------------------ */

interface FormData {
  companyName: string;
  websiteUrl: string;
  contactEmail: string;
  effectiveDate: string;
  country: string;
  websiteType: string;
}

interface SectionToggles {
  userAccounts: boolean;
  paymentRefund: boolean;
  intellectualProperty: boolean;
  userGeneratedContent: boolean;
  prohibitedActivities: boolean;
  limitationOfLiability: boolean;
  terminationClause: boolean;
  governingLaw: boolean;
  disputeResolution: boolean;
  privacyPolicyRef: boolean;
  cookiePolicyRef: boolean;
  thirdPartyLinks: boolean;
  indemnification: boolean;
}

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'India',
  'Germany', 'France', 'Singapore', 'UAE', 'Brazil', 'Japan',
  'South Korea', 'Netherlands', 'Sweden', 'Switzerland', 'New Zealand',
  'South Africa', 'Nigeria', 'Kenya', 'Philippines', 'Mexico',
];

const WEBSITE_TYPES = ['Blog', 'E-commerce', 'SaaS', 'Mobile App', 'Marketplace', 'Other'];

const SECTION_LABELS: Record<keyof SectionToggles, string> = {
  userAccounts: 'User Accounts & Registration',
  paymentRefund: 'Payment & Refund Policy',
  intellectualProperty: 'Intellectual Property',
  userGeneratedContent: 'User-Generated Content',
  prohibitedActivities: 'Prohibited Activities',
  limitationOfLiability: 'Limitation of Liability',
  terminationClause: 'Termination Clause',
  governingLaw: 'Governing Law',
  disputeResolution: 'Dispute Resolution',
  privacyPolicyRef: 'Privacy Policy Reference',
  cookiePolicyRef: 'Cookie Policy Reference',
  thirdPartyLinks: 'Third-Party Links',
  indemnification: 'Indemnification',
};

const DEFAULT_FORM: FormData = {
  companyName: '',
  websiteUrl: '',
  contactEmail: '',
  effectiveDate: new Date().toISOString().split('T')[0],
  country: 'United States',
  websiteType: 'Blog',
};

const DEFAULT_TOGGLES: SectionToggles = {
  userAccounts: true,
  paymentRefund: false,
  intellectualProperty: true,
  userGeneratedContent: false,
  prohibitedActivities: true,
  limitationOfLiability: true,
  terminationClause: true,
  governingLaw: true,
  disputeResolution: true,
  privacyPolicyRef: true,
  cookiePolicyRef: false,
  thirdPartyLinks: true,
  indemnification: true,
};

/* ------------------------------------------------------------------ */
/*  TEMPLATE BUILDER                                                   */
/* ------------------------------------------------------------------ */

function buildDocument(form: FormData, toggles: SectionToggles): string {
  const c = form.companyName || '[Company Name]';
  const url = form.websiteUrl || '[Website URL]';
  const email = form.contactEmail || '[Contact Email]';
  const date = form.effectiveDate
    ? new Date(form.effectiveDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '[Effective Date]';
  const country = form.country || '[Country]';
  const type = form.websiteType || 'website';

  const sections: string[] = [];

  sections.push(`TERMS AND CONDITIONS\n\nEffective Date: ${date}\n`);
  sections.push(`Welcome to ${c}. These Terms and Conditions ("Terms") govern your access to and use of the ${type.toLowerCase()} located at ${url} (the "Service"), operated by ${c} ("we", "us", or "our"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service.\n`);

  sections.push(`1. ACCEPTANCE OF TERMS\n\nBy accessing or using our Service, you confirm that you are at least 18 years of age (or the age of majority in your jurisdiction) and have the legal capacity to enter into these Terms. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.\n`);

  if (toggles.userAccounts) {
    sections.push(`2. USER ACCOUNTS & REGISTRATION\n\nTo access certain features of the Service, you may be required to create an account. You agree to:\n\n- Provide accurate, current, and complete information during registration.\n- Maintain the security and confidentiality of your login credentials.\n- Notify us immediately of any unauthorized use of your account.\n- Accept responsibility for all activities that occur under your account.\n\nWe reserve the right to suspend or terminate accounts that violate these Terms or that have been inactive for an extended period.\n`);
  }

  if (toggles.paymentRefund) {
    sections.push(`${getNextNum(sections)}. PAYMENT & REFUND POLICY\n\nCertain features or services may require payment. By making a purchase, you agree to the following:\n\n- All fees are listed in the applicable currency and are due at the time of purchase.\n- You authorize us to charge your chosen payment method for all fees incurred.\n- Prices are subject to change with reasonable notice.\n- Refund requests must be submitted within 30 days of purchase to ${email}.\n- Refunds are granted at our sole discretion and may be subject to processing fees.\n- Subscriptions auto-renew unless cancelled before the next billing cycle.\n`);
  }

  if (toggles.intellectualProperty) {
    sections.push(`${getNextNum(sections)}. INTELLECTUAL PROPERTY\n\nAll content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, images, audio, video, software, and underlying code, are the exclusive property of ${c} or its licensors and are protected by copyright, trademark, patent, and other intellectual property laws.\n\nYou may not:\n\n- Copy, modify, distribute, sell, or lease any part of the Service.\n- Reverse engineer or attempt to extract the source code of any software.\n- Use our trademarks or branding without prior written consent.\n- Remove or alter any proprietary notices or labels on the Service.\n`);
  }

  if (toggles.userGeneratedContent) {
    sections.push(`${getNextNum(sections)}. USER-GENERATED CONTENT\n\nOur Service may allow you to post, submit, or share content ("User Content"). By submitting User Content, you:\n\n- Grant us a worldwide, non-exclusive, royalty-free, perpetual license to use, display, reproduce, modify, and distribute your User Content in connection with the Service.\n- Represent that you own or have the necessary rights to submit the content.\n- Agree not to submit content that is illegal, offensive, defamatory, or infringes on third-party rights.\n\nWe reserve the right to remove any User Content that violates these Terms without prior notice. We do not endorse or assume liability for any User Content.\n`);
  }

  if (toggles.prohibitedActivities) {
    sections.push(`${getNextNum(sections)}. PROHIBITED ACTIVITIES\n\nYou agree not to engage in any of the following activities:\n\n- Violating any applicable laws, regulations, or these Terms.\n- Using the Service for fraudulent, misleading, or deceptive purposes.\n- Attempting to gain unauthorized access to any portion of the Service.\n- Interfering with or disrupting the Service or its servers and networks.\n- Uploading or transmitting viruses, malware, or other harmful code.\n- Scraping, data mining, or using automated tools to access the Service without permission.\n- Harassing, threatening, or intimidating other users.\n- Impersonating any person or entity or misrepresenting your affiliation.\n`);
  }

  if (toggles.limitationOfLiability) {
    sections.push(`${getNextNum(sections)}. LIMITATION OF LIABILITY\n\nTO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ${c.toUpperCase()} AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:\n\n- YOUR USE OF OR INABILITY TO USE THE SERVICE.\n- ANY UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR DATA.\n- ANY THIRD-PARTY CONDUCT ON THE SERVICE.\n- ANY OTHER MATTER RELATING TO THE SERVICE.\n\nOUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU HAVE PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER.\n`);
  }

  if (toggles.terminationClause) {
    sections.push(`${getNextNum(sections)}. TERMINATION\n\nWe may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including but not limited to a breach of these Terms.\n\nUpon termination:\n\n- Your right to use the Service will immediately cease.\n- We may delete your account and any associated data.\n- Provisions that by their nature should survive termination shall remain in effect, including ownership, warranty disclaimers, indemnification, and limitations of liability.\n\nYou may terminate your account at any time by contacting us at ${email}.\n`);
  }

  if (toggles.governingLaw) {
    sections.push(`${getNextNum(sections)}. GOVERNING LAW\n\nThese Terms shall be governed by and construed in accordance with the laws of ${country}, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be brought exclusively in the courts located in ${country}, and you consent to the personal jurisdiction of such courts.\n`);
  }

  if (toggles.disputeResolution) {
    sections.push(`${getNextNum(sections)}. DISPUTE RESOLUTION\n\nAny dispute, controversy, or claim arising out of or relating to these Terms shall first be resolved through good-faith negotiation. If the dispute cannot be resolved through negotiation within 30 days, either party may submit the dispute to binding arbitration in accordance with the rules of the applicable arbitration association in ${country}.\n\nYou agree that any arbitration shall be conducted on an individual basis and not as a class action or representative proceeding. You waive any right to participate in a class action lawsuit or class-wide arbitration.\n`);
  }

  if (toggles.privacyPolicyRef) {
    sections.push(`${getNextNum(sections)}. PRIVACY POLICY\n\nYour use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy at ${url}/privacy-policy to understand how we collect, use, and protect your personal information.\n`);
  }

  if (toggles.cookiePolicyRef) {
    sections.push(`${getNextNum(sections)}. COOKIE POLICY\n\nOur Service uses cookies and similar tracking technologies to enhance your experience. By using the Service, you consent to our use of cookies as described in our Cookie Policy. You can manage your cookie preferences through your browser settings.\n`);
  }

  if (toggles.thirdPartyLinks) {
    sections.push(`${getNextNum(sections)}. THIRD-PARTY LINKS\n\nThe Service may contain links to third-party websites, services, or resources that are not owned or controlled by ${c}. We do not endorse and are not responsible for the content, privacy policies, or practices of any third-party sites or services. You acknowledge and agree that we shall not be liable for any damage or loss caused by or in connection with the use of any third-party content, goods, or services.\n`);
  }

  if (toggles.indemnification) {
    sections.push(`${getNextNum(sections)}. INDEMNIFICATION\n\nYou agree to defend, indemnify, and hold harmless ${c}, its officers, directors, employees, contractors, agents, licensors, and suppliers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service.\n`);
  }

  // Always-included closing sections
  sections.push(`${getNextNum(sections)}. CHANGES TO TERMS\n\nWe reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect by posting the updated Terms on the Service and updating the "Effective Date" above. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.\n`);

  sections.push(`${getNextNum(sections)}. SEVERABILITY\n\nIf any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced to the fullest extent under law.\n`);

  sections.push(`${getNextNum(sections)}. CONTACT US\n\nIf you have any questions about these Terms, please contact us at:\n\n${c}\nEmail: ${email}\nWebsite: ${url}\n`);

  return sections.join('\n');
}

function getNextNum(sections: string[]): number {
  // Count numbered sections (skip the title block)
  let count = 1;
  for (const s of sections) {
    if (/^\d+\.\s/.test(s)) count++;
  }
  return count;
}

function buildHtml(plain: string, form: FormData): string {
  const c = form.companyName || 'Company';
  const lines = plain.split('\n');
  let html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Terms and Conditions - ${c}</title>\n<style>\nbody{font-family:system-ui,-apple-system,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.7;color:#1e293b}\nh1{font-size:1.75rem;border-bottom:2px solid #6366f1;padding-bottom:.5rem}\nh2{font-size:1.25rem;color:#4338ca;margin-top:2rem}\nul{padding-left:1.5rem}\nli{margin:.25rem 0}\np{margin:.75rem 0}\n</style>\n</head>\n<body>\n`;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed === 'TERMS AND CONDITIONS') {
      html += `<h1>Terms and Conditions</h1>\n`;
    } else if (/^\d+\.\s[A-Z]/.test(trimmed)) {
      const heading = trimmed.replace(/^\d+\.\s/, '');
      html += `<h2>${trimmed.split('. ')[0]}. ${heading.charAt(0)}${heading.slice(1).toLowerCase().replace(/\b(us|uk|uae)\b/gi, m => m.toUpperCase())}</h2>\n`;
    } else if (trimmed.startsWith('Effective Date:')) {
      html += `<p><strong>${trimmed}</strong></p>\n`;
    } else if (trimmed.startsWith('- ')) {
      html += `<ul><li>${trimmed.slice(2)}</li></ul>\n`;
    } else {
      html += `<p>${trimmed}</p>\n`;
    }
  }

  html += `</body>\n</html>`;
  // Merge consecutive <ul> blocks
  html = html.replace(/<\/ul>\n<ul>/g, '\n');
  return html;
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function TermsAndConditionsGeneratorTool() {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [toggles, setToggles] = useState<SectionToggles>(DEFAULT_TOGGLES);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);

  const document = useMemo(() => buildDocument(form, toggles), [form, toggles]);

  const updateForm = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleSection = useCallback((key: keyof SectionToggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleGenerate = useCallback(() => {
    setGenerated(true);
    setTimeout(() => {
      const el = window.document.getElementById('tc-preview');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(document);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [document]);

  const handleDownloadTxt = useCallback(() => {
    const blob = new Blob([document], { type: 'text/plain;charset=utf-8' });
    const a = window.document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'terms-and-conditions.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  }, [document]);

  const handleDownloadHtml = useCallback(() => {
    const html = buildHtml(document, form);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const a = window.document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'terms-and-conditions.html';
    a.click();
    URL.revokeObjectURL(a.href);
  }, [document, form]);

  const selectAll = useCallback(() => {
    setToggles(prev => {
      const next = { ...prev };
      for (const k of Object.keys(next) as (keyof SectionToggles)[]) next[k] = true;
      return next;
    });
  }, []);

  const deselectAll = useCallback(() => {
    setToggles(prev => {
      const next = { ...prev };
      for (const k of Object.keys(next) as (keyof SectionToggles)[]) next[k] = false;
      return next;
    });
  }, []);

  /* ---- Render ---- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 py-16 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoMnY0aC0yem0tNiA2aC0ydi00aDJ2NHptMC02di00aDJ2NGgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="container mx-auto max-w-4xl px-4 text-center relative">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Scale className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Terms &amp; Conditions Generator</h1>
          <p className="mx-auto mt-3 max-w-2xl text-blue-100 text-lg">
            Generate a professional, comprehensive Terms &amp; Conditions document for your website or app in seconds.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-10">
        {/* Disclaimer */}
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
          <p>
            <strong>Disclaimer:</strong> This is a template for informational purposes only. It does not constitute legal advice. Consult a qualified lawyer to ensure your Terms &amp; Conditions comply with applicable laws.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ---- LEFT: Form ---- */}
          <div className="space-y-6">
            {/* Business Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <Building2 className="h-5 w-5 text-indigo-500" /> Business Details
              </h2>
              <div className="space-y-4">
                <InputField label="Company / Website Name" value={form.companyName} onChange={v => updateForm('companyName', v)} placeholder="Acme Inc." />
                <InputField label="Website URL" value={form.websiteUrl} onChange={v => updateForm('websiteUrl', v)} placeholder="https://example.com" icon={<Globe className="h-4 w-4 text-slate-400" />} />
                <InputField label="Contact Email" value={form.contactEmail} onChange={v => updateForm('contactEmail', v)} placeholder="legal@example.com" icon={<Mail className="h-4 w-4 text-slate-400" />} />
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Effective Date</label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={form.effectiveDate}
                      onChange={e => updateForm('effectiveDate', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <SelectField label="Country / Jurisdiction" value={form.country} onChange={v => updateForm('country', v)} options={COUNTRIES} />
                <SelectField label="Type of Website" value={form.websiteType} onChange={v => updateForm('websiteType', v)} options={WEBSITE_TYPES} />
              </div>
            </div>

            {/* Section Toggles */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <FileText className="h-5 w-5 text-indigo-500" /> Sections to Include
                </h2>
                <div className="flex gap-2 text-xs">
                  <button onClick={selectAll} className="rounded-md bg-indigo-50 px-2.5 py-1 font-medium text-indigo-600 hover:bg-indigo-100 transition-colors">All</button>
                  <button onClick={deselectAll} className="rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-600 hover:bg-slate-200 transition-colors">None</button>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {(Object.keys(SECTION_LABELS) as (keyof SectionToggles)[]).map(key => (
                  <label key={key} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-100 p-2.5 hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={toggles[key]}
                      onChange={() => toggleSection(key)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                    />
                    <span className="text-sm text-slate-700">{SECTION_LABELS[key]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all"
            >
              Generate Terms &amp; Conditions
            </button>
          </div>

          {/* ---- RIGHT: Preview ---- */}
          <div id="tc-preview" className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <Scale className="h-5 w-5 text-indigo-500" /> Preview
                </h2>
                {generated && (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle className="h-3.5 w-3.5" /> Generated
                  </span>
                )}
              </div>
              <div className="max-h-[600px] overflow-y-auto px-6 py-4">
                {!generated ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <FileText className="mb-3 h-12 w-12 opacity-40" />
                    <p className="text-sm">Fill in the form and click Generate to preview your document.</p>
                  </div>
                ) : (
                  <div className="prose prose-sm prose-slate max-w-none">
                    {document.split('\n').map((line, i) => {
                      const t = line.trim();
                      if (!t) return <div key={i} className="h-2" />;
                      if (t === 'TERMS AND CONDITIONS') return <h1 key={i} className="!text-xl !font-bold text-slate-900 border-b border-indigo-200 pb-2">{t}</h1>;
                      if (/^\d+\.\s[A-Z]/.test(t)) return <h2 key={i} className="!text-base !font-bold text-indigo-700 !mt-6">{t}</h2>;
                      if (t.startsWith('Effective Date:')) return <p key={i} className="font-medium text-slate-600">{t}</p>;
                      if (t.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-slate-600">{t.slice(2)}</li>;
                      return <p key={i} className="text-slate-600 leading-relaxed">{t}</p>;
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {generated && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopy}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors min-w-[140px]"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors min-w-[140px]"
                >
                  <Download className="h-4 w-4" /> Download .txt
                </button>
                <button
                  onClick={handleDownloadHtml}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-colors min-w-[140px]"
                >
                  <Download className="h-4 w-4" /> Download .html
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SHARED FORM COMPONENTS                                             */
/* ------------------------------------------------------------------ */

function InputField({ label, value, onChange, placeholder, icon }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-slate-300 py-2.5 pr-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-colors ${icon ? 'pl-10' : 'pl-3'}`}
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-colors"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}
