'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const hideRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prevPath = useRef(pathname);

  const cleanup = useCallback(() => {
    clearInterval(timerRef.current);
    clearTimeout(hideRef.current);
  }, []);

  // Page arrived — complete and hide bar
  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    cleanup();
    setProgress(100);

    hideRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 200);

    return cleanup;
  }, [pathname, cleanup]);

  // Listen for clicks on internal links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (anchor.target === '_blank') return;
      // Skip if clicking the same page
      if (href === pathname || href === `${pathname}/`) return;

      cleanup();
      setVisible(true);
      setProgress(30);

      let current = 30;
      timerRef.current = setInterval(() => {
        current += Math.random() * 8;
        if (current >= 85) {
          current = 85;
          clearInterval(timerRef.current);
        }
        setProgress(current);
      }, 300);
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      cleanup();
    };
  }, [pathname, cleanup]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
    >
      <div
        className="h-full bg-gradient-to-r from-accent-500 via-primary-500 to-accent-400 shadow-sm shadow-accent-500/30"
        style={{
          width: `${progress}%`,
          transition: progress === 100 ? 'width 150ms ease-out' : 'width 300ms ease-out',
          opacity: visible || progress > 0 ? 1 : 0,
        }}
      />
    </div>
  );
}
