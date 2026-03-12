import { ImageResponse } from 'next/og';
import { getGuideBySlug, getAllGuides } from '@/lib/guides-registry';

export const alt = 'ToolsArena Guide';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const categoryColors: Record<string, { bg: string; accent: string }> = {
  'text-tools':      { bg: '#1d4ed8', accent: '#93c5fd' },
  'calculators':     { bg: '#059669', accent: '#6ee7b7' },
  'image-tools':     { bg: '#7c3aed', accent: '#c4b5fd' },
  'developer-tools': { bg: '#475569', accent: '#94a3b8' },
  'pdf-tools':       { bg: '#dc2626', accent: '#fca5a5' },
  'converters':      { bg: '#d97706', accent: '#fde68a' },
  'seo-tools':       { bg: '#4f46e5', accent: '#a5b4fc' },
};

const categoryLabels: Record<string, string> = {
  'text-tools':      'Text Tools Guide',
  'calculators':     'Calculator Guide',
  'image-tools':     'Image Tools Guide',
  'developer-tools': 'Developer Tools Guide',
  'pdf-tools':       'PDF Tools Guide',
  'converters':      'Converters Guide',
  'seo-tools':       'SEO Tools Guide',
};

export async function generateStaticParams() {
  return getAllGuides().map(g => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const guide = getGuideBySlug(slug, locale);

  const title = guide?.title ?? 'Free Online Tool Guide';
  const subtitle = guide?.subtitle ?? 'Expert tips, use cases, and step-by-step instructions';
  const category = guide?.category ?? 'text-tools';
  const readingTime = guide?.readingTime ?? '5 min read';
  const colors = categoryColors[category] ?? { bg: '#1e40af', accent: '#93c5fd' };
  const catLabel = categoryLabels[category] ?? 'Guide';

  // Truncate long titles/subtitles
  const displayTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;
  const displaySubtitle = subtitle.length > 100 ? subtitle.slice(0, 97) + '...' : subtitle;

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.bg} 0%, #0f172a 60%, #1e293b 100%)`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 70px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: `1px solid ${colors.accent}55`,
              borderRadius: '999px',
              padding: '7px 18px',
              color: colors.accent,
              fontSize: '18px',
              fontWeight: 600,
              display: 'flex',
            }}
          >
            {catLabel}
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '999px',
              padding: '7px 18px',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '18px',
              display: 'flex',
            }}
          >
            📖 {readingTime}
          </div>
        </div>

        {/* Middle: title + subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div
            style={{
              fontSize: displayTitle.length > 45 ? '44px' : '52px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.2,
              display: 'flex',
            }}
          >
            {displayTitle}
          </div>
          <div
            style={{
              fontSize: '22px',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.45,
              maxWidth: '880px',
              display: 'flex',
            }}
          >
            {displaySubtitle}
          </div>
          {/* Tags row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            {['Expert Guide', 'Pro Tips', 'Free Tool'].map(tag => (
              <div
                key={tag}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '16px',
                  display: 'flex',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: branding */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              ⚡
            </div>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>ToolsArena</span>
          </div>
          <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>toolsarena.in/guides</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
