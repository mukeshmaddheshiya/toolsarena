import { ImageResponse } from 'next/og';

export const size = { width: 96, height: 96 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f59e0b, #f97316, #ea580c)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '22px',
        }}
      >
        <svg
          width="58"
          height="58"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M13 2L4 14h7l-2 8 9-12h-7l2-8z"
            fill="#ffffff"
          />
        </svg>
      </div>
    ),
    { width: 96, height: 96 }
  );
}
