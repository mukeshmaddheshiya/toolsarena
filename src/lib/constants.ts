import { TOOL_COUNT } from '@/lib/tools-registry';

export const SITE_NAME = 'ToolsArena';
export const SITE_URL = 'https://toolsarena.in';
export const SITE_DESCRIPTION = `${TOOL_COUNT}+ free online tools for images, PDFs, text, calculators and more. No signup required. Fast, free and privacy-first.`;
export const SITE_TWITTER = '@ToolsArena';
export const DEFAULT_OG_IMAGE = '/opengraph-image';
export const ADSENSE_PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX'; // Replace with actual ID

export const NAV_CATEGORIES = [
  { slug: 'image-tools', nameKey: 'nav.imageTools' as const, href: '/category/image-tools' },
  { slug: 'pdf-tools', nameKey: 'nav.pdfTools' as const, href: '/category/pdf-tools' },
  { slug: 'text-tools', nameKey: 'nav.textTools' as const, href: '/category/text-tools' },
  { slug: 'calculators', nameKey: 'nav.calculators' as const, href: '/category/calculators' },
  { slug: 'developer-tools', nameKey: 'nav.devTools' as const, href: '/category/developer-tools' },
  { slug: 'converters', nameKey: 'nav.converters' as const, href: '/category/converters' },
] as const;

export const CATEGORY_NAME_KEYS: Record<string, string> = {
  'image-tools': 'nav.imageTools',
  'pdf-tools': 'nav.pdfTools',
  'text-tools': 'nav.textTools',
  'calculators': 'nav.calculators',
  'developer-tools': 'nav.devTools',
  'converters': 'nav.converters',
  'utility-tools': 'nav.utilityTools',
  'seo-tools': 'nav.seoTools',
  'cricket-tools': 'nav.cricketTools',
};

export const MAX_FILE_SIZE_MB = 50;
export const MAX_IMAGE_SIZE_MB = 20;
export const MAX_BATCH_FILES = 20;
