import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ToolsArena',
  description: 'ToolsArena privacy policy. Learn how we handle your data — all processing is done locally in your browser.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-6">Privacy Policy</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Last updated: January 2025</p>
      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">1. Data We Collect</h2>
          <p>ToolsArena is designed with privacy as the first principle. <strong>We do not collect, store, or transmit any files, text, or personal data you use with our tools.</strong> All tool processing happens entirely in your browser using JavaScript.</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">2. Analytics</h2>
          <p>We use Google Analytics 4 to collect anonymous usage statistics such as page views, device type, and geographic region. This helps us understand which tools are popular and improve our platform. No personally identifiable information is collected.</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">3. Advertising</h2>
          <p>We display advertisements via Google AdSense. Google may use cookies to serve personalized ads based on your interests. You can opt out of personalized ads by visiting Google&apos;s Ad Settings.</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">4. Cookies</h2>
          <p>We use minimal cookies: one for your theme preference (dark/light mode). Analytics and advertising cookies are set by Google. We do not use session cookies or tracking cookies for our own purposes.</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">5. Third-Party Services</h2>
          <p>Our website uses: Google Analytics (analytics), Google AdSense (ads), Google Fonts (typography). Each service has its own privacy policy governing their data practices.</p>
        </section>
        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">6. Contact</h2>
          <p>For privacy concerns, contact us at privacy@toolsarena.in</p>
        </section>
      </div>
    </div>
  );
}
