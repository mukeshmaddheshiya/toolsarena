'use client';

import { useState, useCallback, useEffect } from 'react';
import { Copy, RefreshCw, Check, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const CHARS = {
  upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:   'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(len: number, opts: Record<string, boolean>): string {
  const pool = Object.entries(opts)
    .filter(([, v]) => v)
    .map(([k]) => CHARS[k as keyof typeof CHARS])
    .join('');
  if (!pool) return '';
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, n => pool[n % pool.length]).join('');
}

function getStrength(pwd: string, opts: Record<string, boolean>): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: 'None', color: 'bg-gray-200 dark:bg-gray-700' };
  const checks = [
    pwd.length >= 12,
    pwd.length >= 16,
    /[A-Z]/.test(pwd),
    /[a-z]/.test(pwd),
    /\d/.test(pwd),
    /[^A-Za-z0-9]/.test(pwd),
    Object.values(opts).filter(Boolean).length >= 3,
  ];
  const score = checks.filter(Boolean).length;
  if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (score <= 4) return { score: 2, label: 'Fair', color: 'bg-yellow-500' };
  if (score <= 5) return { score: 3, label: 'Good', color: 'bg-blue-500' };
  return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: false });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const generate = useCallback(() => {
    const pwd = generatePassword(length, opts);
    setPassword(pwd);
    if (pwd) setHistory(h => [pwd, ...h].slice(0, 5));
  }, [length, opts]);

  useEffect(() => { generate(); }, [generate]);

  const copy = async (text = password) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = getStrength(password, opts);
  const activeOpts = Object.values(opts).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Password display */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-violet-500" />
          <span className="font-semibold text-gray-800 dark:text-gray-200">Generated Password</span>
        </div>

        <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 mb-4">
          <code className={`flex-1 font-mono text-lg text-gray-900 dark:text-white break-all select-all ${!show ? 'blur-sm select-none' : ''}`}>
            {password || '—'}
          </code>
          <button onClick={() => setShow(s => !s)} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors shrink-0">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Strength bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
            <span>Strength</span>
            <span className={`font-semibold ${strength.score >= 4 ? 'text-emerald-500' : strength.score >= 3 ? 'text-blue-500' : strength.score >= 2 ? 'text-yellow-500' : 'text-red-500'}`}>
              {strength.label}
            </span>
          </div>
          <div className="flex gap-1">
            {[1,2,3,4].map(s => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${s <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'}`}
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={generate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Regenerate
          </button>
          <button
            onClick={() => copy()}
            disabled={!password}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-sm"
          >
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Password</>}
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Settings</h3>

        {/* Length */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Length</label>
            <span className="text-sm font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-2.5 py-0.5 rounded-lg">{length}</span>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-violet-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>6</span><span>16</span><span>32</span><span>64</span>
          </div>
        </div>

        {/* Character options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { key: 'upper',   label: 'Uppercase', example: 'A–Z' },
            { key: 'lower',   label: 'Lowercase', example: 'a–z' },
            { key: 'numbers', label: 'Numbers',   example: '0–9' },
            { key: 'symbols', label: 'Symbols',   example: '!@#$' },
          ] as const).map(({ key, label, example }) => {
            const active = opts[key];
            const isLast = !active && activeOpts === 1;
            return (
              <button
                key={key}
                onClick={() => { if (isLast) return; setOpts(o => ({ ...o, [key]: !o[key] })); }}
                disabled={isLast}
                className={`p-3 rounded-xl border-2 text-left transition-all duration-150 ${
                  active
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <div className={`font-semibold text-sm mb-0.5 ${active ? 'text-violet-700 dark:text-violet-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  {label}
                </div>
                <div className="text-xs text-gray-400 font-mono">{example}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick presets */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Quick Presets</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'PIN (4)', len: 4,  o: { upper: false, lower: false, numbers: true, symbols: false } },
            { label: 'Simple (8)', len: 8,  o: { upper: true, lower: true, numbers: true, symbols: false } },
            { label: 'Strong (16)', len: 16, o: { upper: true, lower: true, numbers: true, symbols: true } },
            { label: 'Max Security (32)', len: 32, o: { upper: true, lower: true, numbers: true, symbols: true } },
          ].map(p => (
            <button
              key={p.label}
              onClick={() => { setLength(p.len); setOpts(p.o); setTimeout(generate, 10); }}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      {history.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Passwords</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {history.slice(1).map((pwd, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <code className="flex-1 text-sm font-mono text-gray-600 dark:text-gray-400 truncate">{pwd}</code>
                <button onClick={() => copy(pwd)} className="text-xs text-gray-400 hover:text-violet-500 transition-colors shrink-0">
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
