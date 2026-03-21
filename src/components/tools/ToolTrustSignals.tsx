'use client';

import { Shield, RefreshCw } from 'lucide-react';

interface Props {
  toolName: string;
  toolSlug: string;
}

export function ToolTrustSignals({ toolName, toolSlug }: Props) {
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
    </div>
  );
}
