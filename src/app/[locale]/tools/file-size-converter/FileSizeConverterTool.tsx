'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';

const UNITS = [
  { name: 'Bits', short: 'b', factor: 1 },
  { name: 'Bytes', short: 'B', factor: 8 },
  { name: 'Kilobytes', short: 'KB', factor: 8 * 1024 },
  { name: 'Megabytes', short: 'MB', factor: 8 * 1024 * 1024 },
  { name: 'Gigabytes', short: 'GB', factor: 8 * 1024 * 1024 * 1024 },
  { name: 'Terabytes', short: 'TB', factor: 8 * 1024 * 1024 * 1024 * 1024 },
  { name: 'Kibibytes', short: 'KiB', factor: 8 * 1024 },
  { name: 'Mebibytes', short: 'MiB', factor: 8 * 1024 * 1024 },
  { name: 'Gibibytes', short: 'GiB', factor: 8 * 1024 * 1024 * 1024 },
];

export function FileSizeConverterTool() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('GB');

  const fromFactor = UNITS.find(u => u.short === fromUnit)?.factor || 1;
  const bits = parseFloat(value || '0') * fromFactor;

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-lg font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="w-40">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Unit</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-3 text-sm">
            {UNITS.map(u => <option key={u.short} value={u.short}>{u.name} ({u.short})</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {UNITS.filter(u => u.short !== fromUnit).map(u => {
          const converted = bits / u.factor;
          const display = converted < 0.001 ? converted.toExponential(4) : converted % 1 === 0 ? converted.toLocaleString() : converted.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
          return (
            <div key={u.short} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700">
              <div>
                <p className="text-xs text-slate-500">{u.name}</p>
                <p className="text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">{display} <span className="text-slate-400">{u.short}</span></p>
              </div>
              <CopyButton text={`${display} ${u.short}`} />
            </div>
          );
        })}
      </div>

      {/* Quick reference */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Quick Reference</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-700 dark:text-blue-400">
          <span>1 Byte = 8 Bits</span>
          <span>1 KB = 1,024 Bytes</span>
          <span>1 MB = 1,024 KB</span>
          <span>1 GB = 1,024 MB</span>
          <span>1 TB = 1,024 GB</span>
          <span>1 PB = 1,024 TB</span>
        </div>
      </div>
    </div>
  );
}
