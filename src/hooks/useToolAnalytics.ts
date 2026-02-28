'use client';
import { useCallback } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function useToolAnalytics(toolSlug: string) {
  const trackEvent = useCallback((action: string, params?: Record<string, string | number>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: 'tool_usage',
        event_label: toolSlug,
        ...params,
      });
    }
  }, [toolSlug]);

  const trackToolUse = useCallback(() => {
    trackEvent('tool_used', { tool: toolSlug });
  }, [toolSlug, trackEvent]);

  const trackDownload = useCallback((fileType?: string) => {
    trackEvent('file_downloaded', { tool: toolSlug, file_type: fileType || 'unknown' });
  }, [toolSlug, trackEvent]);

  const trackCopy = useCallback(() => {
    trackEvent('text_copied', { tool: toolSlug });
  }, [toolSlug, trackEvent]);

  return { trackEvent, trackToolUse, trackDownload, trackCopy };
}
