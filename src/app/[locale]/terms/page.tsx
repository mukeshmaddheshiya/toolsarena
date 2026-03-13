import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getAlternateLanguages } from '@/lib/seo';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service - ToolsArena',
  description: 'Terms of Service for ToolsArena. Read our usage terms, acceptable use policy, intellectual property rights, and disclaimer for our 237+ free online tools.',
  alternates: {
    canonical: `${SITE_URL}/terms`,
    languages: getAlternateLanguages('/terms'),
  },
  openGraph: {
    title: 'Terms of Service - ToolsArena',
    description: 'Terms of Service for ToolsArena. Read our usage terms and conditions for our free online tools platform.',
    url: `${SITE_URL}/terms`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Terms of Service - ToolsArena' }],
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">Terms of Service</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Last updated: March 13, 2026</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">Effective date: February 1, 2026</p>

      <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">1. Acceptance of Terms</h2>
          <p className="mb-3">
            By accessing or using <strong>ToolsArena</strong> (&ldquo;the Platform&rdquo;), available at <strong>toolsarena.in</strong>, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do not use our platform.
          </p>
          <p>
            These Terms apply to all visitors, users, and others who access or use ToolsArena. By using the Platform, you represent that you are at least 13 years of age and have the legal capacity to enter into this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">2. Description of Service</h2>
          <p className="mb-3">
            ToolsArena is a free online tools platform providing 237+ utilities including image tools, PDF tools, text tools, calculators, developer tools, unit converters, and more. We also provide educational guides and tutorials related to our tools.
          </p>
          <p>
            All tools on ToolsArena are provided free of charge. We reserve the right to modify, suspend, or discontinue any tool or service at any time without notice. We will not be liable to you or any third party for any such modification, suspension, or discontinuation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">3. Acceptable Use Policy</h2>
          <p className="mb-3">You agree to use ToolsArena only for lawful purposes and in a manner consistent with all applicable local, national, and international laws and regulations. You agree NOT to use the Platform to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Upload, process, or transmit any content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable</li>
            <li>Infringe the intellectual property rights of any third party</li>
            <li>Distribute malware, viruses, or any other harmful code</li>
            <li>Attempt to gain unauthorised access to any part of our platform, servers, or related systems</li>
            <li>Use automated tools, bots, or scrapers to excessively access our platform in a way that interferes with normal operation</li>
            <li>Misrepresent your identity or impersonate any person or entity</li>
            <li>Engage in any activity that could damage, disable, or impair our platform</li>
            <li>Circumvent any technical measures we implement to restrict access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">4. User Content</h2>
          <p className="mb-3">
            When you use our tools, you may process files, images, text, or other content (&ldquo;User Content&rdquo;). You retain all ownership rights to your User Content. Since all tool processing happens in your browser, your files are never uploaded to our servers.
          </p>
          <p>
            You represent and warrant that you have the legal right to use any content you process using our tools, and that such use does not infringe the rights of any third party.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">5. Intellectual Property</h2>
          <p className="mb-3">
            The ToolsArena name, logo, website design, source code, guides, and all related content are the intellectual property of ToolsArena and are protected by applicable copyright, trademark, and other intellectual property laws.
          </p>
          <p className="mb-3">
            Our platform incorporates open-source libraries (including Next.js, React, pdf-lib, and others) used under their respective open-source licences. These licences are unaffected by these Terms.
          </p>
          <p>
            You may not reproduce, distribute, modify, or create derivative works of any ToolsArena content without our express written permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">6. Disclaimer of Warranties</h2>
          <p className="mb-3">
            ToolsArena is provided on an <strong>&ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo;</strong> basis, without any warranties of any kind, either express or implied, including but not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Warranties of merchantability or fitness for a particular purpose</li>
            <li>Warranties that the platform will be uninterrupted, error-free, or secure</li>
            <li>Warranties regarding the accuracy, reliability, or completeness of any tool output or guide content</li>
          </ul>
          <p className="mt-3">
            <strong>Important:</strong> Our calculators (EMI, income tax, SIP, BMI, etc.) are provided for informational and educational purposes only. Always verify critical financial, medical, or legal calculations with a qualified professional before making important decisions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">7. Limitation of Liability</h2>
          <p className="mb-3">
            To the fullest extent permitted by applicable law, ToolsArena and its operators shall not be liable for any:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Indirect, incidental, special, or consequential damages</li>
            <li>Loss of data, profits, goodwill, or business opportunities</li>
            <li>Damages arising from reliance on tool outputs or guide content</li>
            <li>Damages resulting from unauthorised access to or alteration of your data</li>
          </ul>
          <p className="mt-3">
            In no event shall our total liability to you exceed ₹0 (zero rupees), as ToolsArena is a free platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">8. Third-Party Links and Services</h2>
          <p>
            Our website may contain links to third-party websites or services. These links are provided for your convenience only. We have no control over the content, privacy policies, or practices of third-party websites and expressly disclaim any responsibility for them. We encourage you to review the terms and privacy policies of any third-party sites you visit.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">9. Advertising</h2>
          <p>
            ToolsArena displays advertisements served by Google AdSense. These advertisements are governed by Google&rsquo;s advertising policies and terms. We are not responsible for the content of advertisements displayed on our platform. The display of advertisements does not constitute our endorsement of the advertised products or services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">10. Privacy</h2>
          <p>
            Your use of ToolsArena is also governed by our <a href="/privacy-policy" className="text-blue-600 dark:text-blue-400 underline">Privacy Policy</a>, which is incorporated into these Terms by this reference. Please review our Privacy Policy to understand our practices regarding the collection and use of your information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">11. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless ToolsArena and its operators from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising out of or related to your use of the Platform, your violation of these Terms, or your violation of any rights of a third party.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">12. Termination</h2>
          <p>
            We reserve the right to terminate or restrict your access to ToolsArena at our sole discretion, without notice, if we believe you have violated these Terms or applicable law. Upon termination, all provisions of these Terms that by their nature should survive termination shall survive.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of <strong>India</strong>, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of India.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">14. Changes to These Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. When we make material changes, we will update the &ldquo;Last updated&rdquo; date at the top of this page. Your continued use of ToolsArena after any changes constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-slate-100 mb-3">15. Contact Us</h2>
          <p className="mb-3">If you have any questions about these Terms of Service, please contact us:</p>
          <ul className="list-none space-y-1">
            <li><strong>Email:</strong> mukeshdr005@gmail.com</li>
            <li><strong>Website:</strong> toolsarena.in/contact</li>
            <li><strong>Platform:</strong> ToolsArena, India</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
