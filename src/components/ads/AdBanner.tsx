interface AdBannerProps {
  slot?: string;
  className?: string;
}

// AdSense integration — replace data-ad-* with your real values
export function AdBanner({ slot = 'top-banner', className }: AdBannerProps) {
  return (
    <div
      className={`ad-slot w-full h-[90px] md:h-[90px] ${className || ''}`}
      data-ad-slot={slot}
      aria-label="Advertisement"
    >
      {/* Google AdSense code goes here:
      <ins className="adsbygoogle" style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true" />
      */}
      <span className="text-xs text-slate-400">Advertisement</span>
    </div>
  );
}
