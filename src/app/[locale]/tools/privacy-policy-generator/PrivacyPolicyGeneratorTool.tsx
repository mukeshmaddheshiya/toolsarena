'use client';

import { useState, useMemo, useCallback } from 'react';
import { Shield, FileText, Copy, Check, Download, Eye, Settings, Lock } from 'lucide-react';

const COUNTRIES = ['India', 'USA', 'UK', 'Canada', 'Australia', 'EU', 'Other'] as const;

interface FormData {
  companyName: string;
  websiteUrl: string;
  contactEmail: string;
  effectiveDate: string;
  country: string;
  collectPersonalInfo: boolean;
  collectUsageData: boolean;
  collectCookies: boolean;
  collectPayment: boolean;
  collectLocation: boolean;
  collectSocialMedia: boolean;
  collectThirdParty: boolean;
  includeGDPR: boolean;
  includeCCPA: boolean;
  includeCOPPA: boolean;
  includeRetention: boolean;
}

const DEFAULT_FORM: FormData = {
  companyName: '',
  websiteUrl: '',
  contactEmail: '',
  effectiveDate: new Date().toISOString().split('T')[0],
  country: 'India',
  collectPersonalInfo: true,
  collectUsageData: true,
  collectCookies: true,
  collectPayment: false,
  collectLocation: false,
  collectSocialMedia: false,
  collectThirdParty: true,
  includeGDPR: false,
  includeCCPA: false,
  includeCOPPA: false,
  includeRetention: true,
};

export function PrivacyPolicyGeneratorTool() {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  const set = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggle = useCallback((key: keyof FormData) => {
    setForm(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const name = form.companyName || '[Company Name]';
  const url = form.websiteUrl || '[Website URL]';
  const email = form.contactEmail || '[contact@example.com]';
  const date = form.effectiveDate || '[Date]';

  const policy = useMemo(() => {
    const sections: string[] = [];

    sections.push(`PRIVACY POLICY\n\nLast updated: ${date}\n\nThis Privacy Policy describes how ${name} ("we," "us," or "our") collects, uses, and shares information about you when you visit or use our website at ${url} (the "Website"). By using our Website, you agree to the collection and use of information in accordance with this policy.\n\nPlease read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Website.`);

    // Information We Collect
    let collectSection = `\n\nINFORMATION WE COLLECT\n\nWe may collect various types of information from and about users of our Website, including:`;

    if (form.collectPersonalInfo) {
      collectSection += `\n\nPersonal Information: We may collect personally identifiable information such as your name, email address, phone number, mailing address, and other contact details that you voluntarily provide to us when you register on the Website, place an order, subscribe to our newsletter, fill out a form, or engage in other activities on the Website.`;
    }
    if (form.collectUsageData) {
      collectSection += `\n\nUsage Data and Analytics: We automatically collect certain information when you visit, use, or navigate the Website. This information may include your IP address, browser type, operating system, referring URLs, pages viewed, links clicked, date and time of visits, and other diagnostic data. This information is primarily needed to maintain the security and operation of our Website and for analytics purposes.`;
    }
    if (form.collectCookies) {
      collectSection += `\n\nCookies and Tracking Technologies: We use cookies and similar tracking technologies to track activity on our Website and store certain information. Cookies are small data files placed on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Website. Types of cookies we may use include:\n- Essential Cookies: Required for the Website to function properly.\n- Analytics Cookies: Help us understand how visitors interact with our Website.\n- Preference Cookies: Remember your settings and preferences.\n- Marketing Cookies: Used to deliver relevant advertisements.`;
    }
    if (form.collectPayment) {
      collectSection += `\n\nPayment Information: If you make a purchase or transaction through our Website, we may collect payment-related information such as credit card numbers, billing addresses, and other financial data. Payment processing is handled by secure third-party payment processors, and we do not store your full payment card details on our servers.`;
    }
    if (form.collectLocation) {
      collectSection += `\n\nLocation Data: We may collect and process information about your approximate or precise location. We use various technologies to determine location, including IP address, GPS, and other sensors. You may opt out of location data collection by adjusting your device settings.`;
    }
    if (form.collectSocialMedia) {
      collectSection += `\n\nSocial Media Data: If you interact with us through social media platforms or use social login features, we may collect information from your social media profile, including your name, profile picture, email address, and public profile information, in accordance with the social media platform's privacy settings.`;
    }
    if (form.collectThirdParty) {
      collectSection += `\n\nThird-Party Services: We may use third-party services such as Google Analytics, Facebook Pixel, and other analytics and advertising tools that collect, monitor, and analyze usage data. These third-party service providers have their own privacy policies addressing how they use such information.`;
    }
    sections.push(collectSection);

    // How We Use Information
    sections.push(`\n\nHOW WE USE YOUR INFORMATION\n\nWe use the information we collect for various purposes, including:\n- To provide, operate, and maintain our Website and services\n- To improve, personalize, and expand our Website\n- To understand and analyze how you use our Website\n- To develop new products, services, features, and functionality\n- To communicate with you, including for customer service, updates, and promotional purposes\n- To process transactions and send related information\n- To send you emails, newsletters, and marketing communications (with your consent where required)\n- To find and prevent fraud, abuse, and security issues\n- To comply with legal obligations and enforce our policies`);

    // Sharing Information
    sections.push(`\n\nSHARING YOUR INFORMATION\n\nWe may share your information in the following situations:\n- Service Providers: We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf.\n- Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business.\n- Legal Requirements: We may disclose your information where required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).\n- With Your Consent: We may share your information for any other purpose with your consent.\n\nWe do not sell your personal information to third parties.`);

    // Data Security
    sections.push(`\n\nDATA SECURITY\n\nThe security of your personal information is important to us. We implement appropriate technical and organizational security measures designed to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.`);

    // Data Retention
    if (form.includeRetention) {
      sections.push(`\n\nDATA RETENTION\n\nWe will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies. When your personal information is no longer needed, we will securely delete or anonymize it.`);
    }

    // GDPR
    if (form.includeGDPR) {
      sections.push(`\n\nGDPR COMPLIANCE (FOR EUROPEAN ECONOMIC AREA USERS)\n\nIf you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). ${name} aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal data.\n\nYour rights under the GDPR include:\n- Right of Access: You have the right to request copies of your personal data.\n- Right to Rectification: You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.\n- Right to Erasure: You have the right to request that we erase your personal data, under certain conditions.\n- Right to Restrict Processing: You have the right to request that we restrict the processing of your personal data, under certain conditions.\n- Right to Data Portability: You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.\n- Right to Object: You have the right to object to our processing of your personal data, under certain conditions.\n- Right to Withdraw Consent: Where we rely on your consent, you have the right to withdraw that consent at any time.\n\nLegal Basis for Processing: We process your personal data based on one or more of the following legal bases:\n- Your consent\n- Performance of a contract\n- Compliance with legal obligations\n- Our legitimate interests\n\nTo exercise any of these rights, please contact us at ${email}. We will respond to your request within 30 days.`);
    }

    // CCPA
    if (form.includeCCPA) {
      sections.push(`\n\nCCPA COMPLIANCE (FOR CALIFORNIA RESIDENTS)\n\nIf you are a California resident, the California Consumer Privacy Act (CCPA) grants you specific rights regarding your personal information.\n\nYour rights under the CCPA include:\n- Right to Know: You have the right to request that we disclose the categories and specific pieces of personal information we have collected about you, the categories of sources from which personal information is collected, the business purpose for collecting personal information, and the categories of third parties with whom we share personal information.\n- Right to Delete: You have the right to request the deletion of personal information we have collected from you, subject to certain exceptions.\n- Right to Opt-Out: You have the right to opt out of the sale of your personal information. We do not sell personal information.\n- Right to Non-Discrimination: We will not discriminate against you for exercising any of your CCPA rights.\n\nTo exercise your rights under the CCPA, please contact us at ${email}. We will verify your identity before processing your request and respond within 45 days.`);
    }

    // COPPA
    if (form.includeCOPPA) {
      sections.push(`\n\nCHILDREN'S PRIVACY (COPPA COMPLIANCE)\n\nOur Website is not intended for children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us at ${email}. If we become aware that we have collected personal information from children without verification of parental consent, we will take steps to remove that information from our servers.\n\nIf you are between 13 and 18 years of age, you may use our Website only with the involvement and consent of a parent or guardian.`);
    }

    // Links to Other Sites
    sections.push(`\n\nLINKS TO OTHER WEBSITES\n\nOur Website may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.`);

    // Changes
    sections.push(`\n\nCHANGES TO THIS PRIVACY POLICY\n\nWe may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.`);

    // Contact
    sections.push(`\n\nCONTACT US\n\nIf you have any questions about this Privacy Policy, please contact us:\n- By email: ${email}\n- By visiting our website: ${url}\n\n---\n\nDISCLAIMER: This privacy policy was generated using an automated tool and is provided for informational purposes only. It does not constitute legal advice. We strongly recommend consulting with a qualified legal professional to ensure your privacy policy complies with all applicable laws and regulations specific to your business and jurisdiction.`);

    return sections.join('');
  }, [form, name, url, email, date]);

  const policyHtml = useMemo(() => {
    return policy
      .replace(/^(PRIVACY POLICY)$/m, '<h1>$1</h1>')
      .replace(/^((?:INFORMATION|HOW|SHARING|DATA|GDPR|CCPA|CHILDREN|LINKS|CHANGES|CONTACT|DISCLAIMER)[A-Z\s()]*)/gm, '<h2>$1</h2>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/((?:<li>.*<\/li>\n?)+)/gm, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n(?!<)/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }, [policy]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(policy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (type: 'txt' | 'html') => {
    const content = type === 'html'
      ? `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Privacy Policy - ${name}</title><style>body{font-family:system-ui,-apple-system,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.7;color:#1a1a1a}h1{font-size:1.8rem;border-bottom:2px solid #6b21a8;padding-bottom:.5rem}h2{font-size:1.3rem;color:#6b21a8;margin-top:2rem}ul{padding-left:1.5rem}li{margin:.3rem 0}p{margin:.8rem 0}</style></head><body>${policyHtml}</body></html>`
      : policy;
    const blob = new Blob([content], { type: type === 'html' ? 'text/html' : 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `privacy-policy.${type}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const Input = ({ label, value, onChange, type = 'text', placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
    </div>
  );

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={`relative w-10 h-5.5 rounded-full transition-colors ${checked ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`} onClick={onChange}>
        <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
    </label>
  );

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-6 sm:p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8"><Shield className="w-24 h-24" /></div>
          <div className="absolute bottom-4 left-8"><Lock className="w-16 h-16" /></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Privacy Policy Generator</h2>
          </div>
          <p className="text-purple-100 text-sm sm:text-base max-w-xl">
            Generate a comprehensive, professional privacy policy for your website or app. Customize sections based on your data practices.
          </p>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex sm:hidden rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
        <button onClick={() => setActiveTab('form')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'form' ? 'bg-purple-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}>
          <Settings className="w-4 h-4" /> Configure
        </button>
        <button onClick={() => setActiveTab('preview')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'preview' ? 'bg-purple-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}>
          <Eye className="w-4 h-4" /> Preview
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Form Panel */}
        <div className={`space-y-5 ${activeTab === 'preview' ? 'hidden sm:block' : ''}`}>
          {/* Basic Info */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-4 border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" /> Basic Information
            </h3>
            <Input label="Company / Website Name" value={form.companyName} onChange={v => set('companyName', v)} placeholder="Acme Inc." />
            <Input label="Website URL" value={form.websiteUrl} onChange={v => set('websiteUrl', v)} placeholder="https://example.com" />
            <Input label="Contact Email" value={form.contactEmail} onChange={v => set('contactEmail', v)} placeholder="privacy@example.com" type="email" />
            <Input label="Effective Date" value={form.effectiveDate} onChange={v => set('effectiveDate', v)} type="date" />
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Country</label>
              <select value={form.country} onChange={e => set('country', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Data Collection */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" /> Data Collection
            </h3>
            <Toggle label="Personal info (name, email, phone)" checked={form.collectPersonalInfo} onChange={() => toggle('collectPersonalInfo')} />
            <Toggle label="Usage data / analytics" checked={form.collectUsageData} onChange={() => toggle('collectUsageData')} />
            <Toggle label="Cookies" checked={form.collectCookies} onChange={() => toggle('collectCookies')} />
            <Toggle label="Payment information" checked={form.collectPayment} onChange={() => toggle('collectPayment')} />
            <Toggle label="Location data" checked={form.collectLocation} onChange={() => toggle('collectLocation')} />
            <Toggle label="Social media data" checked={form.collectSocialMedia} onChange={() => toggle('collectSocialMedia')} />
            <Toggle label="Third-party services (GA, FB Pixel)" checked={form.collectThirdParty} onChange={() => toggle('collectThirdParty')} />
          </div>

          {/* Compliance Sections */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-600" /> Compliance Sections
            </h3>
            <Toggle label="GDPR compliance (EU users)" checked={form.includeGDPR} onChange={() => toggle('includeGDPR')} />
            <Toggle label="CCPA compliance (California)" checked={form.includeCCPA} onChange={() => toggle('includeCCPA')} />
            <Toggle label="Children's privacy (COPPA)" checked={form.includeCOPPA} onChange={() => toggle('includeCOPPA')} />
            <Toggle label="Data retention policy" checked={form.includeRetention} onChange={() => toggle('includeRetention')} />
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`${activeTab === 'form' ? 'hidden sm:block' : ''}`}>
          <div className="sticky top-24 space-y-3">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">
                {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Text</>}
              </button>
              <button onClick={() => downloadFile('txt')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors">
                <Download className="w-4 h-4" /> .txt
              </button>
              <button onClick={() => downloadFile('html')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors">
                <Download className="w-4 h-4" /> .html
              </button>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 max-h-[70vh] overflow-y-auto">
              <div className="prose prose-sm prose-slate dark:prose-invert max-w-none
                prose-headings:text-purple-700 dark:prose-headings:text-purple-400
                prose-h1:text-lg prose-h1:border-b prose-h1:border-purple-200 prose-h1:pb-2
                prose-h2:text-sm prose-h2:font-bold prose-h2:mt-5
                prose-p:text-xs prose-p:leading-relaxed
                prose-li:text-xs prose-li:my-0"
                dangerouslySetInnerHTML={{ __html: policyHtml }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
