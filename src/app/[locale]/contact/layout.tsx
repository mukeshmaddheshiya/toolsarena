import type { Metadata } from 'next';
import { getAlternateLanguages } from '@/lib/seo';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact Us | ToolsArena',
  description: 'Contact ToolsArena for suggestions, bug reports, or partnership inquiries. We respond within 24 hours.',
  keywords: 'contact ToolsArena, feedback, bug report, suggestions, partnership',
  alternates: {
    canonical: `${SITE_URL}/contact`,
    languages: getAlternateLanguages('/contact'),
  },
  openGraph: {
    title: 'Contact Us - ToolsArena',
    description: 'Contact ToolsArena for suggestions, bug reports, or partnership inquiries.',
    url: `${SITE_URL}/contact`,
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Contact ToolsArena' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - ToolsArena',
    description: 'Contact ToolsArena for suggestions, bug reports, or partnership inquiries.',
  },
  robots: { index: true, follow: true },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
