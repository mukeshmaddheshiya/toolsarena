/**
 * IndexNow Submission Script
 * Usage: node scripts/indexnow.mjs [--all | --url <url>]
 *
 * --all   Submit all tool pages across all locales
 * --url   Submit a single URL
 *
 * Submits to Bing's IndexNow API (covers Bing, Yandex, DuckDuckGo, and others)
 */

const SITE_HOST = 'toolsarena.in';
const KEY = '65c3dd9814c17d356f34e8fa424a9d3c';
const KEY_LOCATION = `https://${SITE_HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

async function submitUrls(urls) {
  console.log(`Submitting ${urls.length} URLs to IndexNow...`);

  const body = {
    host: SITE_HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.ok || res.status === 202) {
    console.log(`✓ Successfully submitted ${urls.length} URLs (status: ${res.status})`);
  } else {
    const text = await res.text();
    console.error(`✗ Failed (status: ${res.status}): ${text}`);
  }
}

async function getAllToolUrls() {
  // Dynamically import tools-registry to get all slugs
  const { readFileSync } = await import('fs');
  const registryPath = new URL('../src/lib/tools-registry.ts', import.meta.url);
  const content = readFileSync(registryPath, 'utf-8');

  // Extract all slugs from tools.push({ slug: '...' })
  const slugs = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

  const locales = ['', '/hi', '/ne'];
  const urls = [];

  // Add homepage for each locale
  for (const locale of locales) {
    urls.push(`https://${SITE_HOST}${locale}`);
  }

  // Add all tool pages for each locale
  for (const slug of slugs) {
    for (const locale of locales) {
      urls.push(`https://${SITE_HOST}${locale}/tools/${slug}`);
    }
  }

  return urls;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--url')) {
    const urlIndex = args.indexOf('--url') + 1;
    const url = args[urlIndex];
    if (!url) {
      console.error('Please provide a URL: node scripts/indexnow.mjs --url https://...');
      process.exit(1);
    }
    await submitUrls([url]);
  } else if (args.includes('--all')) {
    const urls = await getAllToolUrls();
    console.log(`Found ${urls.length} URLs`);

    // IndexNow allows max 10,000 URLs per request
    const batchSize = 10000;
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      await submitUrls(batch);
    }
  } else {
    console.log('Usage:');
    console.log('  node scripts/indexnow.mjs --all          Submit all tool pages');
    console.log('  node scripts/indexnow.mjs --url <url>    Submit a single URL');
  }
}

main().catch(console.error);
