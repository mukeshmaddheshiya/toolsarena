import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - ToolsArena',
  description: 'Terms of service for ToolsArena. Read our usage terms and conditions.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-6">Terms of Service</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Last updated: January 2025</p>
      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">1. Acceptance of Terms</h2>
          <p>By using ToolsArena, you agree to these Terms of Service. If you do not agree, please do not use our platform.</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">2. Use of Services</h2>
          <p>ToolsArena provides free online tools for personal and commercial use. You may not use our platform for: illegal activities, harassment, distributing malware, or any activity that violates applicable law.</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">3. Intellectual Property</h2>
          <p>The ToolsArena name, logo, and website design are owned by ToolsArena. The open-source libraries used (Next.js, pdf-lib, etc.) are used under their respective licenses. QR codes generated with our tool are in the public domain.</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">4. Disclaimer</h2>
          <p>ToolsArena tools are provided &quot;as is&quot; without warranty. We are not responsible for any data loss, incorrect calculations, or other issues arising from tool usage. Always verify critical calculations independently.</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">5. Limitation of Liability</h2>
          <p>ToolsArena shall not be liable for any indirect, incidental, or consequential damages arising from your use of our tools.</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">6. Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use of ToolsArena after changes constitutes acceptance of the new terms.</p>
        </section>
      </div>
    </div>
  );
}
