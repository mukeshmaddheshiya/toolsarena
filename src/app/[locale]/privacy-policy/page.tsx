import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getAlternateLanguages } from '@/lib/seo';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy - ToolsArena',
  description: 'ToolsArena privacy policy. Learn how we collect, use, and protect your information. All tool processing is done locally in your browser — we never store your files.',
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
    languages: getAlternateLanguages('/privacy-policy'),
  },
  openGraph: {
    title: 'Privacy Policy - ToolsArena',
    description: 'ToolsArena privacy policy. Learn how we collect, use, and protect your information.',
    url: `${SITE_URL}/privacy-policy`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Privacy Policy - ToolsArena' }],
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">Privacy Policy</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Last updated: March 13, 2026</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">Effective date: February 1, 2026</p>

      <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">1. Introduction</h2>
          <p className="mb-3">
            Welcome to <strong>ToolsArena</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), operated at <strong>toolsarena.in</strong>. We are committed to protecting your privacy and being transparent about how we handle information when you use our platform.
          </p>
          <p>
            ToolsArena is a free online tools platform offering 237+ utilities including image tools, PDF tools, calculators, text tools, developer tools, and more. This Privacy Policy explains what information we collect, how we use it, and your rights with respect to that information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">2. Information We Collect</h2>

          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">2a. Information We Do NOT Collect</h3>
          <p className="mb-3">
            ToolsArena is built with a privacy-first architecture. <strong>All tool processing — including image compression, PDF manipulation, calculations, and text analysis — happens entirely in your browser using JavaScript.</strong> Your files and data are never uploaded to our servers. We do not store, transmit, or have access to any files or personal content you process using our tools.
          </p>

          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">2b. Information We Do Collect</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Usage data:</strong> Anonymous page views, tool usage counts, session duration, and navigation paths collected via Google Analytics 4.</li>
            <li><strong>Device information:</strong> Browser type, operating system, screen resolution, and device category (desktop/mobile/tablet) — collected anonymously.</li>
            <li><strong>Geographic data:</strong> Country and city-level location data derived from your IP address by Google Analytics. Your full IP address is anonymised.</li>
            <li><strong>Referral data:</strong> The website that referred you to ToolsArena (e.g., Google search, social media).</li>
            <li><strong>Contact form data:</strong> If you submit our contact form, we collect your name, email address, and message. This is used solely to respond to your inquiry.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">3. How We Use Information</h2>
          <p className="mb-3">We use the information we collect for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To understand which tools are most used and improve our platform</li>
            <li>To diagnose technical errors and fix bugs</li>
            <li>To measure the effectiveness of our content and guides</li>
            <li>To respond to contact form inquiries</li>
            <li>To display relevant advertisements via Google AdSense</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p className="mt-3">We do not sell, rent, or share your personal information with third parties for their marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">4. Google Analytics</h2>
          <p className="mb-3">
            We use <strong>Google Analytics 4 (GA4)</strong> to collect anonymous usage statistics. Google Analytics uses cookies to collect data about your visits. All IP addresses are anonymised before being stored by Google.
          </p>
          <p className="mb-3">
            Data collected by Google Analytics is governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google&rsquo;s Privacy Policy</a>.
          </p>
          <p>
            You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google Analytics Opt-out Browser Add-on</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">5. Google AdSense &amp; Advertising</h2>
          <p className="mb-3">
            We use <strong>Google AdSense</strong> to display advertisements on our website. Google AdSense uses cookies and web beacons to serve ads based on your prior visits to our website or other websites on the internet.
          </p>
          <p className="mb-3">
            Google&rsquo;s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and other sites on the Internet. You may opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google Ads Settings</a>.
          </p>
          <p className="mb-3">
            We also participate in the <strong>Google AdSense for Search</strong> programme and follow all Google Publisher Policies.
          </p>
          <p>
            Third-party vendors, including Google, use cookies to serve ads based on a user&rsquo;s prior visits to our website. Users may opt out of the use of the DART cookie by visiting the <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google ad and content network privacy policy</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">6. Cookies</h2>
          <p className="mb-3">We use the following types of cookies:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Preference cookies:</strong> We store your theme preference (dark/light mode) in your browser&rsquo;s local storage. This data never leaves your device.</li>
            <li><strong>Analytics cookies:</strong> Set by Google Analytics to track anonymous usage statistics. These cookies expire after 2 years.</li>
            <li><strong>Advertising cookies:</strong> Set by Google AdSense to serve relevant advertisements. These are third-party cookies governed by Google&rsquo;s privacy policy.</li>
          </ul>
          <p className="mt-3">
            You can control cookies through your browser settings. Disabling cookies may affect the functionality of some features. For more information, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">allaboutcookies.org</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">7. Third-Party Services</h2>
          <p className="mb-3">Our website integrates the following third-party services, each governed by their own privacy policies:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Google Analytics 4</strong> — website analytics (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google Privacy Policy</a>)</li>
            <li><strong>Google AdSense</strong> — display advertising (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google Privacy Policy</a>)</li>
            <li><strong>Google Fonts</strong> — typography rendering</li>
            <li><strong>Vercel</strong> — website hosting and infrastructure (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Vercel Privacy Policy</a>)</li>
          </ul>
          <p className="mt-3">We are not responsible for the privacy practices of these third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">8. Data Security</h2>
          <p className="mb-3">
            We take reasonable technical and organisational measures to protect the limited information we collect. Our website is served over <strong>HTTPS</strong> (SSL/TLS encryption). Contact form submissions are handled securely.
          </p>
          <p>
            Since all tool processing happens in your browser and we do not store your files or personal data on our servers, the risk of a data breach affecting your tool usage is minimal.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">9. Children&rsquo;s Privacy</h2>
          <p>
            ToolsArena does not knowingly collect personal information from children under the age of 13. Our services are intended for general audiences. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <strong>privacy@toolsarena.in</strong> and we will promptly delete such information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">10. Your Rights</h2>
          <p className="mb-3">Under applicable laws (including India&rsquo;s Digital Personal Data Protection Act 2023), you have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Know what personal data we hold about you</li>
            <li>Request correction of inaccurate personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Withdraw consent for data processing</li>
            <li>Lodge a complaint with the relevant data protection authority</li>
          </ul>
          <p className="mt-3">To exercise these rights, contact us at <strong>privacy@toolsarena.in</strong>.</p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">11. Links to Other Websites</h2>
          <p>
            Our guides and content may contain links to external websites. We are not responsible for the privacy practices or content of those websites. We encourage you to review the privacy policy of every website you visit.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">12. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. When we make changes, we will update the &ldquo;Last updated&rdquo; date at the top of this page. We encourage you to review this page periodically. Your continued use of ToolsArena after any changes constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">13. Contact Us</h2>
          <p className="mb-3">If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
          <ul className="list-none space-y-1">
            <li><strong>Email:</strong> privacy@toolsarena.in</li>
            <li><strong>Website:</strong> toolsarena.in/contact</li>
            <li><strong>Platform:</strong> ToolsArena, India</li>
          </ul>
          <p className="mt-3">We will respond to all privacy-related inquiries within 30 days.</p>
        </section>

      </div>
    </div>
  );
}
