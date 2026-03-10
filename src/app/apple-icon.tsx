import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '40px',
        }}
      >
        <svg
          width="110"
          height="130"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M13 2L4 14h7l-2 8 9-12h-7l2-8z"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="0.5"
          />
        </svg>
      </div>
    ),
    { width: 180, height: 180 }
  );
}
