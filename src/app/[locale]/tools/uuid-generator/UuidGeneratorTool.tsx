'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

type UuidVersion = 'v4' | 'v1-like' | 'nil' | 'short';

function genV4(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

function genShortId(): string {
  const bytes = new Uint8Array(9);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, c => c === '+' ? '-' : c === '/' ? '_' : '').slice(0, 12);
}

function generateUuid(version: UuidVersion): string {
  if (version === 'v4') return genV4();
  if (version === 'v1-like') {
    const now = Date.now().toString(16).padStart(12, '0');
    const rand = genV4().replace(/-/g, '').slice(12);
    return `${now.slice(0,8)}-${now.slice(8,12)}-1${rand.slice(0,3)}-${rand.slice(3,7)}-${rand.slice(7,19)}`;
  }
  if (version === 'nil') return '00000000-0000-0000-0000-000000000000';
  return genShortId();
}

export function UuidGeneratorTool() {
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, () => genV4()));
  const [copied, setCopied] = useState<number | 'all' | null>(null);

  const generate = () => {
    setUuids(Array.from({ length: count }, () => generateUuid(version)));
  };

  const fmt = (s: string) => uppercase ? s.toUpperCase() : s;

  const copy = async (text: string, key: number | 'all') => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Options</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Version</label>
            <select value={version} onChange={e => setVersion(e.target.value as UuidVersion)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="v4">UUID v4 (Random)</option>
              <option value="v1-like">UUID v1-like (Time-based)</option>
              <option value="short">Short ID (12 chars)</option>
              <option value="nil">Nil UUID</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Count: {count}</label>
            <input type="range" min={1} max={20} value={count} onChange={e => setCount(Number(e.target.value))} className="w-full accent-blue-500 mt-1" />
          </div>
          <div className="flex items-center gap-3 pt-5">
            <input type="checkbox" id="uc" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="w-4 h-4 accent-blue-500" />
            <label htmlFor="uc" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">Uppercase</label>
          </div>
        </div>
        <button onClick={generate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
          <RefreshCw className="w-4 h-4" /> Generate
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{uuids.length} UUID{uuids.length !== 1 ? 's' : ''}</span>
          <button onClick={() => copy(uuids.map(fmt).join('\n'), 'all')}
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">
            {copied === 'all' ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copied all</> : <><Copy className="w-3.5 h-3.5" /> Copy all</>}
          </button>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 group transition-colors">
              <span className="text-xs text-gray-400 w-5 shrink-0">{i + 1}</span>
              <code className="flex-1 text-sm font-mono text-gray-800 dark:text-gray-200 select-all">{fmt(uuid)}</code>
              <button onClick={() => copy(fmt(uuid), i)}
                className="shrink-0 p-1.5 rounded text-gray-300 group-hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                {copied === i ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
