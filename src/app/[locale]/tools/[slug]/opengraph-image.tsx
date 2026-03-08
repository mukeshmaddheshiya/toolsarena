import { ImageResponse } from 'next/og';
import { getToolBySlug } from '@/lib/tools-registry';

export const alt = 'ToolsArena';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const categoryColors: Record<string, { bg: string; accent: string }> = {
  'image-tools': { bg: '#7c3aed', accent: '#a78bfa' },
  'pdf-tools': { bg: '#dc2626', accent: '#f87171' },
  'text-tools': { bg: '#2563eb', accent: '#60a5fa' },
  'calculators': { bg: '#059669', accent: '#34d399' },
  'developer-tools': { bg: '#475569', accent: '#94a3b8' },
  'converters': { bg: '#d97706', accent: '#fbbf24' },
  'utility-tools': { bg: '#0891b2', accent: '#22d3ee' },
  'seo-tools': { bg: '#4f46e5', accent: '#818cf8' },
  'cricket-tools': { bg: '#16a34a', accent: '#4ade80' },
};

const categoryLabels: Record<string, string> = {
  'image-tools': 'Image Tools',
  'pdf-tools': 'PDF Tools',
  'text-tools': 'Text Tools',
  'calculators': 'Calculators',
  'developer-tools': 'Developer Tools',
  'converters': 'Converters',
  'utility-tools': 'Utility Tools',
  'seo-tools': 'SEO Tools',
  'cricket-tools': 'Cricket Tools',
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  const name = tool?.name ?? 'ToolsArena';
  const desc = tool?.shortDescription ?? 'Free Online Tools';
  const category = tool?.category ?? 'utility-tools';
  const colors = categoryColors[category] ?? { bg: '#1e40af', accent: '#60a5fa' };
  const catLabel = categoryLabels[category] ?? 'Tools';

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.bg} 0%, #0f172a 100%)`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: Category badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '999px',
              padding: '8px 20px',
              color: colors.accent,
              fontSize: '20px',
              fontWeight: 600,
            }}
          >
            {catLabel}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '20px', display: 'flex' }}>
            Free &bull; No Signup
          </div>
        </div>

        {/* Middle: Tool name + description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: name.length > 30 ? '48px' : '56px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.15,
              display: 'flex',
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.4,
              maxWidth: '900px',
              display: 'flex',
            }}
          >
            {desc.length > 120 ? desc.slice(0, 117) + '...' : desc}
          </div>
        </div>

        {/* Bottom: Branding */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                background: '#f97316',
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
          <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.4)' }}>
            toolsarena.in
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
