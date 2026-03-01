export const SITE_NAME = 'ToolsArena';
export const SITE_URL = 'https://toolsarena.vercel.app';
export const SITE_DESCRIPTION = '80+ free online tools for images, PDFs, text, calculators and more. No signup required. Fast, free and privacy-first.';
export const SITE_TWITTER = '@ToolsArena';
export const DEFAULT_OG_IMAGE = '/opengraph-image';
export const ADSENSE_PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX'; // Replace with actual ID

export const NAV_CATEGORIES = [
  { slug: 'image-tools', name: 'Image Tools', href: '/category/image-tools' },
  { slug: 'pdf-tools', name: 'PDF Tools', href: '/category/pdf-tools' },
  { slug: 'text-tools', name: 'Text Tools', href: '/category/text-tools' },
  { slug: 'calculators', name: 'Calculators', href: '/category/calculators' },
  { slug: 'developer-tools', name: 'Dev Tools', href: '/category/developer-tools' },
  { slug: 'converters', name: 'Converters', href: '/category/converters' },
] as const;

export const MAX_FILE_SIZE_MB = 50;
export const MAX_IMAGE_SIZE_MB = 20;
export const MAX_BATCH_FILES = 20;
