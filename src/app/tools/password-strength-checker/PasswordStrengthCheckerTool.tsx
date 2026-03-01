'use client';

import { useState, useMemo } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface Check { label: string; ok: boolean; }

function analyzePassword(pwd: string) {
  const checks: Check[] = [
    { label: 'At least 8 characters', ok: pwd.length >= 8 },
    { label: 'At least 12 characters', ok: pwd.length >= 12 },
    { label: 'Uppercase letter (A-Z)', ok: /[A-Z]/.test(pwd) },
    { label: 'Lowercase letter (a-z)', ok: /[a-z]/.test(pwd) },
    { label: 'Number (0-9)', ok: /[0-9]/.test(pwd) },
    { label: 'Special character (!@#$…)', ok: /[^A-Za-z0-9]/.test(pwd) },
    { label: 'No common patterns', ok: !/^(password|123456|qwerty|abc|letmein|admin|welcome|monkey|dragon)/i.test(pwd) },
  ];
  const score = checks.filter(c => c.ok).length;
  let level: string, color: string, bgColor: string;
  if (!pwd) { level = '—'; color = 'text-gray-400'; bgColor = 'bg-gray-200 dark:bg-gray-700'; }
  else if (score <= 2) { level = 'Very Weak'; color = 'text-red-600 dark:text-red-400'; bgColor = 'bg-red-500'; }
  else if (score <= 3) { level = 'Weak'; color = 'text-orange-600 dark:text-orange-400'; bgColor = 'bg-orange-500'; }
  else if (score <= 4) { level = 'Fair'; color = 'text-yellow-600 dark:text-yellow-400'; bgColor = 'bg-yellow-400'; }
  else if (score <= 5) { level = 'Good'; color = 'text-blue-600 dark:text-blue-400'; bgColor = 'bg-blue-500'; }
  else if (score <= 6) { level = 'Strong'; color = 'text-green-600 dark:text-green-400'; bgColor = 'bg-green-500'; }
  else { level = 'Very Strong'; color = 'text-emerald-600 dark:text-emerald-400'; bgColor = 'bg-emerald-500'; }
  const pct = pwd ? (score / checks.length) * 100 : 0;
  // Entropy estimate
  const charset = (/[a-z]/.test(pwd) ? 26 : 0) + (/[A-Z]/.test(pwd) ? 26 : 0) + (/[0-9]/.test(pwd) ? 10 : 0) + (/[^A-Za-z0-9]/.test(pwd) ? 32 : 0);
  const entropy = charset > 0 ? Math.round(pwd.length * Math.log2(charset)) : 0;
  return { checks, score, level, color, bgColor, pct, entropy };
}

const COMMON_PASSWORDS = ['123456','password','123456789','12345678','12345','1234567','qwerty','abc123','football','iloveyou','1234','monkey','letmein','111111','mustang'];

export function PasswordStrengthCheckerTool() {
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);

  const analysis = useMemo(() => analyzePassword(pwd), [pwd]);
  const isCommon = COMMON_PASSWORDS.includes(pwd.toLowerCase());

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Enter Password to Check</span>
        </div>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            placeholder="Type or paste your password here…"
            className="w-full px-4 py-4 pr-12 text-lg bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none font-mono"
            autoComplete="off"
          />
          <button onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {/* Strength bar */}
        <div className="px-4 pb-4">
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${analysis.bgColor}`} style={{ width: `${analysis.pct}%` }} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-sm font-bold ${analysis.color}`}>{analysis.level}</span>
            {pwd && <span className="text-xs text-gray-400">~{analysis.entropy} bits entropy</span>}
          </div>
        </div>
      </div>

      {isCommon && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3 text-red-700 dark:text-red-400 text-sm font-medium">
          ⚠ This is one of the most common passwords. Never use it!
        </div>
      )}

      {/* Stats */}
      {pwd && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Length', value: pwd.length },
            { label: 'Uppercase', value: (pwd.match(/[A-Z]/g) || []).length },
            { label: 'Lowercase', value: (pwd.match(/[a-z]/g) || []).length },
            { label: 'Numbers', value: (pwd.match(/[0-9]/g) || []).length },
            { label: 'Symbols', value: (pwd.match(/[^A-Za-z0-9]/g) || []).length },
            { label: 'Entropy', value: analysis.entropy + ' bits' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Checklist */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Requirements</p>
        <div className="space-y-2.5">
          {analysis.checks.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${c.ok ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                {c.ok ? <Check className="w-3 h-3 text-green-600 dark:text-green-400" /> : <X className="w-3 h-3 text-gray-400" />}
              </div>
              <span className={`text-sm ${c.ok ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">Tips for a strong password</p>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>Use at least 12 characters — longer is stronger</li>
          <li>Mix uppercase, lowercase, numbers, and symbols</li>
          <li>Avoid dictionary words, names, and personal info</li>
          <li>Use a passphrase: &quot;Coffee$Runs#Every!Morning&quot;</li>
          <li>Use a unique password for every account</li>
        </ul>
      </div>
    </div>
  );
}
