interface AdBannerProps {
  slot?: string;
  className?: string;
}

// AdSense — replace with real ins tag after approval
// <ins className="adsbygoogle" style={{ display: 'block' }}
//   data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
//   data-ad-slot="XXXXXXXXXX"
//   data-ad-format="auto"
//   data-full-width-responsive="true" />
export function AdBanner({ slot = 'top-banner', className }: AdBannerProps) {
  return (
    <div
      className={`ad-slot w-full ${className || ''}`}
      data-ad-slot={slot}
      aria-hidden="true"
    />
  );
}
