'use client';
import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { CheckCircle, XCircle } from 'lucide-react';

const FLAGS = [
  { flag: 'g', label: 'g', title: 'Global — find all matches' },
  { flag: 'i', label: 'i', title: 'Case insensitive' },
  { flag: 'm', label: 'm', title: 'Multiline — ^ $ match line boundaries' },
  { flag: 's', label: 's', title: 'Dot-All — . matches newlines' },
  { flag: 'u', label: 'u', title: 'Unicode support' },
];

const EXAMPLES = [
  {
    name: 'Email',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    test: 'Contact: alice@example.com or bob@test.org',
  },
  {
    name: 'Phone (IN)',
    pattern: '(?:\\+91|0)?[6-9]\\d{9}',
    test: 'Call +919876543210 or 09812345678',
  },
  {
    name: 'URL',
    pattern: 'https?://[\\w.-]+(?:\\.[\\w.-]+)+[\\w.,@?^=%&:/~+#-]*',
    test: 'Visit https://toolsarena.in or http://example.com/path?q=test',
  },
  {
    name: 'IP Address',
    pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
    test: 'Server IPs: 192.168.1.1 and 10.0.0.254',
  },
];

interface Match {
  value: string;
  index: number;
  groups: Record<string, string> | undefined;
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState<Set<string>>(new Set(['g']));
  const [testStr, setTestStr] = useState('');

  function toggleFlag(f: string) {
    setFlags((prev) => {
      const n = new Set(prev);
      n.has(f) ? n.delete(f) : n.add(f);
      return n;
    });
  }

  const flagStr = [...flags].join('');

  const result = useMemo(() => {
    if (!pattern || !testStr) return { matches: [] as Match[], error: null, valid: null };
    try {
      // Validate the regex first
      new RegExp(pattern, flagStr);
      const matches: Match[] = [];
      const globalFlags = flagStr.includes('g') ? flagStr : flagStr + 'g';
      const re = new RegExp(pattern, globalFlags);
      let m: RegExpExecArray | null;
      while ((m = re.exec(testStr)) !== null) {
        matches.push({ value: m[0], index: m.index, groups: m.groups });
        // Prevent infinite loop on zero-length matches
        if (m[0].length === 0) {
          re.lastIndex++;
        }
        if (!flagStr.includes('g')) break;
      }
      return { matches, error: null, valid: true };
    } catch (e) {
      return { matches: [] as Match[], error: (e as Error).message, valid: false };
    }
  }, [pattern, flagStr, testStr]);

  // Highlighted test string
  const highlighted = useMemo(() => {
    if (!testStr || result.matches.length === 0) return null;
    const parts: { text: string; match: boolean }[] = [];
    let last = 0;
    result.matches.forEach((m) => {
      if (m.index > last) parts.push({ text: testStr.slice(last, m.index), match: false });
      parts.push({ text: m.value, match: true });
      last = m.index + m.value.length;
    });
    if (last < testStr.length) parts.push({ text: testStr.slice(last), match: false });
    return parts;
  }, [testStr, result.matches]);

  function loadExample(ex: (typeof EXAMPLES)[0]) {
    setPattern(ex.pattern);
    setTestStr(ex.test);
    setFlags(new Set(['g']));
  }

  return (
    <div className="space-y-4">
      {/* Pattern input */}
      <div>
        <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <span className="text-slate-400 font-mono text-lg shrink-0">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regular expression..."
            className="flex-1 bg-transparent font-mono text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
          />
          <span className="text-slate-400 font-mono text-lg shrink-0">/{flagStr}</span>
          {result.valid !== null &&
            (result.valid ? (
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
            ))}
        </div>
        {result.error && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{result.error}</p>
        )}
      </div>

      {/* Flags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Flags:
        </span>
        {FLAGS.map(({ flag, label, title }) => (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            title={title}
            className={`w-7 h-7 rounded-lg font-mono text-sm font-bold transition-colors ${
              flags.has(flag)
                ? 'bg-primary-800 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Examples */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-400">Examples:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.name}
            onClick={() => loadExample(ex)}
            className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* Test string */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Test String
        </label>
        <textarea
          value={testStr}
          onChange={(e) => setTestStr(e.target.value)}
          placeholder="Enter test string here..."
          className="tool-textarea min-h-[120px]"
        />
      </div>

      {/* Highlighted output */}
      {highlighted && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Matches:{' '}
              <span className="text-primary-700 dark:text-primary-400">
                {result.matches.length}
              </span>
            </label>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
            {highlighted.map((part, i) =>
              part.match ? (
                <mark
                  key={i}
                  className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded px-0.5"
                >
                  {part.text}
                </mark>
              ) : (
                <span key={i} className="text-slate-700 dark:text-slate-300">
                  {part.text}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* Match details */}
      {result.matches.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
            Match Details
          </label>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {result.matches.slice(0, 20).map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              >
                <span className="text-slate-400 w-6">#{i + 1}</span>
                <code className="flex-1 font-mono text-primary-700 dark:text-primary-400 truncate">
                  &quot;{m.value}&quot;
                </code>
                <span className="text-slate-400">index: {m.index}</span>
                {m.groups && (
                  <CopyButton text={JSON.stringify(m.groups)} size="sm" label="groups" />
                )}
              </div>
            ))}
            {result.matches.length > 20 && (
              <p className="text-xs text-slate-400 pl-3">
                ...and {result.matches.length - 20} more matches
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
