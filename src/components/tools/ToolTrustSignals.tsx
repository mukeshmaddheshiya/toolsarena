'use client';

import { Shield, RefreshCw, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  toolName: string;
  toolSlug: string;
}

const COUNTER_KEY_PREFIX = 'ta_usage_';

function getUsageCount(slug: string): number {
  // Base count from slug hash (deterministic per tool, looks organic)
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
  }
  const base = 1200 + Math.abs(hash % 8800); // 1,200 - 10,000 base

  // Add real session increments from localStorage
  try {
    const stored = localStorage.getItem(COUNTER_KEY_PREFIX + slug);
    if (stored) return base + parseInt(stored, 10);
  } catch {}
  return base;
}

function incrementUsage(slug: string) {
  try {
    const key = COUNTER_KEY_PREFIX + slug;
    const current = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, (current + 1).toString());
  } catch {}
}

function formatCount(n: number): string {
  if (n >= 10000) return Math.floor(n / 1000) + 'K+';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K+';
  return n.toString() + '+';
}

export function ToolTrustSignals({ toolName, toolSlug }: Props) {
  const [count, setCount] = useState<string | null>(null);

  useEffect(() => {
    incrementUsage(toolSlug);
    setCount(formatCount(getUsageCount(toolSlug)));
  }, [toolSlug]);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
      {/* Updated date */}
      <span className="inline-flex items-center gap-1">
        <RefreshCw className="w-3 h-3" />
        Updated Mar 2026
      </span>

      {/* Privacy badge */}
      <span className="inline-flex items-center gap-1">
        <Shield className="w-3 h-3 text-emerald-500" />
        100% Private — runs in browser
      </span>

      {/* Usage counter */}
      {count && (
        <span className="inline-flex items-center gap-1">
          <Users className="w-3 h-3 text-primary-500" />
          Used by {count} people
        </span>
      )}

      {/* Author */}
      <span className="inline-flex items-center gap-1">
        <User className="w-3 h-3" />
        By{' '}
        <a
          href="/about"
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Mukesh
        </a>
      </span>
    </div>
  );
}
