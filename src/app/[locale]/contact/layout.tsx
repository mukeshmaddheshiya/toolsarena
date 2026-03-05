import type { Metadata } from 'next';
import { getAlternateLanguages } from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact Us | ToolsArena',
  description: 'Contact ToolsArena for suggestions, bug reports, or partnership inquiries.',
  alternates: {
    canonical: `${SITE_URL}/contact`,
    languages: getAlternateLanguages('/contact'),
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
