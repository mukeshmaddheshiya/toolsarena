import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, DEFAULT_OG_IMAGE } from './constants';
import type { Tool } from '@/types/tools';

export function generateToolMetadata(tool: Tool): Metadata {
  const url = `${SITE_URL}/tools/${tool.slug}`;
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: [tool.targetKeyword, ...tool.secondaryKeywords].join(', '),
    alternates: { canonical: url },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: tool.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.metaTitle,
      description: tool.metaDescription,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

export function generatePageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string;
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  return {
    title: `${opts.title} | ${SITE_NAME}`,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function getDefaultMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${SITE_NAME} - Free Online Tools`, template: `%s | ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', site: '@ToolsArena' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
    manifest: '/manifest.json',
  };
}
