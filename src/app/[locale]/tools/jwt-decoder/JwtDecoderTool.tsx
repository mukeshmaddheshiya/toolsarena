'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, AlertTriangle } from 'lucide-react';

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function b64Decode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '=='.slice(0, (4 - base64.length % 4) % 4);
  try {
    return decodeURIComponent(
      atob(padded).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    );
  } catch {
    return atob(padded);
  }
}

interface Decoded {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired: boolean | null;
  expDate: Date | null;
  iatDate: Date | null;
}

function decode(token: string): Decoded | string {
  const parts = token.trim().split('.');
  if (parts.length !== 3) return 'Invalid JWT — must have exactly 3 parts separated by dots.';
  try {
    const header = JSON.parse(b64Decode(parts[0]));
    const payload = JSON.parse(b64Decode(parts[1]));
    const exp = typeof payload.exp === 'number' ? new Date(payload.exp * 1000) : null;
    const iat = typeof payload.iat === 'number' ? new Date(payload.iat * 1000) : null;
    const isExpired = exp ? exp < new Date() : null;
    return { header, payload, signature: parts[2], isExpired, expDate: exp, iatDate: iat };
  } catch {
    return 'Failed to decode — invalid base64 or JSON in token.';
  }
}

export function JwtDecoderTool() {
  const [token, setToken] = useState(SAMPLE);
  const [copied, setCopied] = useState<string | null>(null);

  const result = useMemo(() => (token.trim() ? decode(token.trim()) : null), [token]);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const JsonBlock = ({ data, label, color, k }: { data: object; label: string; color: string; k: string }) => {
    const formatted = JSON.stringify(data, null, 2);
    return (
      <div className={`rounded-xl border overflow-hidden ${color}`}>
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-current/10">
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</span>
          <button onClick={() => copy(formatted, k)} className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity">
            {copied === k ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
          </button>
        </div>
        <pre className="p-4 text-sm font-mono overflow-x-auto leading-relaxed">{formatted}</pre>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">JWT Token</span>
          <button onClick={() => setToken(SAMPLE)} className="text-xs text-blue-500 hover:underline">Load sample</button>
        </div>
        <textarea value={token} onChange={e => setToken(e.target.value)} spellCheck={false}
          placeholder="Paste your JWT token here…"
          className="w-full h-28 p-4 font-mono text-sm bg-transparent text-gray-800 dark:text-gray-200 resize-none focus:outline-none break-all" />
      </div>

      {result === null && (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">Paste a JWT token above to decode it</div>
      )}

      {typeof result === 'string' && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3 text-red-700 dark:text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {result}
        </div>
      )}

      {result && typeof result !== 'string' && (
        <>
          {/* Status bar */}
          <div className={`flex flex-wrap gap-3 p-3 rounded-xl border ${result.isExpired === null ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700' : result.isExpired ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'}`}>
            <span className={`text-sm font-semibold ${result.isExpired === null ? 'text-gray-600 dark:text-gray-300' : result.isExpired ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
              {result.isExpired === null ? '⏳ No expiry' : result.isExpired ? '🔴 Token Expired' : '🟢 Token Valid'}
            </span>
            {result.iatDate && <span className="text-xs text-gray-500 dark:text-gray-400 self-center">Issued: {result.iatDate.toLocaleString()}</span>}
            {result.expDate && <span className="text-xs text-gray-500 dark:text-gray-400 self-center">Expires: {result.expDate.toLocaleString()}</span>}
            <span className="text-xs text-gray-500 dark:text-gray-400 self-center">Algorithm: <strong>{String(result.header.alg || '?')}</strong></span>
          </div>

          <JsonBlock data={result.header} label="Header" color="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-200" k="header" />
          <JsonBlock data={result.payload} label="Payload" color="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200" k="payload" />

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Signature</span>
              <span className="text-xs text-gray-400 italic">Cannot be verified client-side without secret</span>
            </div>
            <div className="p-4">
              <code className="text-sm font-mono text-gray-600 dark:text-gray-400 break-all">{result.signature}</code>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
