'use client';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownloadButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function DownloadButton({ onClick, label = 'Download', className, disabled }: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-800 text-white font-medium text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  );
}
