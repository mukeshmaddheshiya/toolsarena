import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: [] },
    sitemap: 'https://toolsarena.in/sitemap.xml',
  };
}
