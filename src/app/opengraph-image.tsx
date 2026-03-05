import { ImageResponse } from 'next/og';
import { TOOL_COUNT } from '@/lib/tools-registry';

export const alt = `ToolsArena - ${TOOL_COUNT}+ Free Online Tools`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 60%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <div style={{
            width: '72px', height: '72px',
            background: '#f97316',
            borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '40px',
          }}>
            ⚡
          </div>
          <span style={{ fontSize: '56px', fontWeight: 'bold', color: 'white' }}>ToolsArena</span>
        </div>

        <div style={{ fontSize: '30px', color: '#93c5fd', marginBottom: '16px', textAlign: 'center', display: 'flex' }}>
          {`${TOOL_COUNT}+ Free Online Tools — No Signup Required`}
        </div>

        <div style={{
          display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {['Image Tools', 'PDF Tools', 'Text Tools', 'Calculators', 'Dev Tools'].map((tag) => (
            <div key={tag} style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '999px',
              padding: '8px 20px',
              color: '#e2e8f0',
              fontSize: '20px',
            }}>
              {tag}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', fontSize: '20px', color: '#64748b' }}>
          toolsarena.in
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
