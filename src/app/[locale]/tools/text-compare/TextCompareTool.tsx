'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  ArrowUpDown, Upload, Copy, Check, Download, ChevronUp, ChevronDown,
  EyeOff, Eye, FileText, X, Search,
} from 'lucide-react';

/* ================================================================
   TYPES
   ================================================================ */

type DiffMode = 'line' | 'word' | 'char';
type ViewMode = 'split' | 'unified';
type DiffType = 'equal' | 'insert' | 'delete';

interface DiffPart {
  type: DiffType;
  value: string;
}

interface LineDiff {
  type: DiffType;
  leftLine?: string;
  rightLine?: string;
  leftNum?: number;
  rightNum?: number;
  inlineLeft?: DiffPart[];
  inlineRight?: DiffPart[];
}

interface IgnoreOptions {
  case: boolean;
  whitespace: boolean;
  punctuation: boolean;
  lineOrder: boolean;
}

/* ================================================================
   DIFF ALGORITHMS
   ================================================================ */

/** LCS-based diff on token arrays */
function lcs<T>(a: T[], b: T[], eq: (x: T, y: T) => boolean): DiffPart[] {
  const m = a.length, n = b.length;

  // Optimize for large inputs: use Myers-like approach for very long sequences
  if (m + n > 10000) {
    return simpleDiff(a, b, eq);
  }

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = eq(a[i - 1], b[j - 1]) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const result: DiffPart[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && eq(a[i - 1], b[j - 1])) {
      result.unshift({ type: 'equal', value: String(a[i - 1]) });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'insert', value: String(b[j - 1]) });
      j--;
    } else {
      result.unshift({ type: 'delete', value: String(a[i - 1]) });
      i--;
    }
  }
  return result;
}

/** Fallback for very large inputs */
function simpleDiff<T>(a: T[], b: T[], eq: (x: T, y: T) => boolean): DiffPart[] {
  const result: DiffPart[] = [];
  let ai = 0, bi = 0;
  while (ai < a.length && bi < b.length) {
    if (eq(a[ai], b[bi])) {
      result.push({ type: 'equal', value: String(a[ai]) });
      ai++; bi++;
    } else {
      // Look ahead for a match
      let foundA = -1, foundB = -1;
      const look = Math.min(50, Math.max(a.length - ai, b.length - bi));
      for (let k = 1; k < look; k++) {
        if (ai + k < a.length && eq(a[ai + k], b[bi])) { foundA = ai + k; break; }
        if (bi + k < b.length && eq(a[ai], b[bi + k])) { foundB = bi + k; break; }
      }
      if (foundA !== -1 && (foundB === -1 || foundA - ai <= foundB - bi)) {
        while (ai < foundA) { result.push({ type: 'delete', value: String(a[ai]) }); ai++; }
      } else if (foundB !== -1) {
        while (bi < foundB) { result.push({ type: 'insert', value: String(b[bi]) }); bi++; }
      } else {
        result.push({ type: 'delete', value: String(a[ai]) }); ai++;
        result.push({ type: 'insert', value: String(b[bi]) }); bi++;
      }
    }
  }
  while (ai < a.length) { result.push({ type: 'delete', value: String(a[ai]) }); ai++; }
  while (bi < b.length) { result.push({ type: 'insert', value: String(b[bi]) }); bi++; }
  return result;
}

function normalize(s: string, opts: IgnoreOptions): string {
  let r = s;
  if (opts.case) r = r.toLowerCase();
  if (opts.whitespace) r = r.replace(/\s+/g, ' ').trim();
  if (opts.punctuation) r = r.replace(/[^\w\s]/g, '');
  return r;
}

function tokenizeWords(s: string): string[] {
  return s.split(/(\s+)/).filter(t => t.length > 0);
}

function tokenizeChars(s: string): string[] {
  return s.split('');
}

function computeInlineDiff(a: string, b: string, mode: DiffMode, opts: IgnoreOptions): DiffPart[] {
  const tokenize = mode === 'char' ? tokenizeChars : tokenizeWords;
  const tokA = tokenize(a);
  const tokB = tokenize(b);
  const eq = (x: string, y: string) => normalize(x, opts) === normalize(y, opts);
  return lcs(tokA, tokB, eq);
}

function computeLineDiff(leftText: string, rightText: string, mode: DiffMode, opts: IgnoreOptions): LineDiff[] {
  let aLines = leftText.split('\n');
  let bLines = rightText.split('\n');

  if (opts.lineOrder) {
    aLines = [...aLines].sort((x, y) => normalize(x, opts).localeCompare(normalize(y, opts)));
    bLines = [...bLines].sort((x, y) => normalize(x, opts).localeCompare(normalize(y, opts)));
  }

  const eq = (x: string, y: string) => normalize(x, opts) === normalize(y, opts);
  const rawDiff = lcs(aLines, bLines, eq);

  // Build LineDiff array with line numbers and inline diffs
  const result: LineDiff[] = [];
  let leftNum = 0, rightNum = 0;

  // Pair up deletes and inserts for inline diff
  const parts = [...rawDiff];
  let idx = 0;

  while (idx < parts.length) {
    const p = parts[idx];

    if (p.type === 'equal') {
      leftNum++;
      rightNum++;
      result.push({ type: 'equal', leftLine: p.value, rightLine: p.value, leftNum, rightNum });
      idx++;
    } else {
      // Collect consecutive deletes and inserts
      const deletes: string[] = [];
      const inserts: string[] = [];
      while (idx < parts.length && parts[idx].type === 'delete') {
        deletes.push(parts[idx].value); idx++;
      }
      while (idx < parts.length && parts[idx].type === 'insert') {
        inserts.push(parts[idx].value); idx++;
      }

      // Pair them up for inline diff
      const maxLen = Math.max(deletes.length, inserts.length);
      for (let k = 0; k < maxLen; k++) {
        const del = k < deletes.length ? deletes[k] : undefined;
        const ins = k < inserts.length ? inserts[k] : undefined;

        if (del !== undefined && ins !== undefined) {
          // Modified line: compute inline diff
          leftNum++;
          rightNum++;
          const inline = mode !== 'line'
            ? computeInlineDiff(del, ins, mode, opts)
            : undefined;
          result.push({
            type: 'delete', // represents a change
            leftLine: del,
            rightLine: ins,
            leftNum,
            rightNum,
            inlineLeft: inline?.filter(d => d.type !== 'insert'),
            inlineRight: inline?.filter(d => d.type !== 'delete'),
          });
        } else if (del !== undefined) {
          leftNum++;
          result.push({ type: 'delete', leftLine: del, leftNum });
        } else if (ins !== undefined) {
          rightNum++;
          result.push({ type: 'insert', rightLine: ins, rightNum });
        }
      }
    }
  }

  return result;
}

/* ================================================================
   STATISTICS
   ================================================================ */

function computeStats(diffs: LineDiff[], leftText: string, rightText: string) {
  let added = 0, removed = 0, modified = 0, unchanged = 0;
  for (const d of diffs) {
    if (d.type === 'equal') unchanged++;
    else if (d.type === 'insert' && !d.leftLine) added++;
    else if (d.type === 'delete' && !d.rightLine) removed++;
    else modified++;
  }
  const totalLines = Math.max(unchanged + modified + removed + added, 1);
  const similarity = totalLines > 0
    ? Math.round((unchanged / (unchanged + modified + removed + added)) * 100)
    : leftText === rightText ? 100 : 0;
  return { added, removed, modified, unchanged, similarity };
}

/* ================================================================
   FILE READING
   ================================================================ */

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/* ================================================================
   INLINE DIFF RENDERER
   ================================================================ */

function InlineTokens({ parts, side }: { parts: DiffPart[]; side: 'left' | 'right' }) {
  return (
    <>
      {parts.map((p, i) => {
        if (p.type === 'equal') return <span key={i}>{p.value}</span>;
        const isHighlight = (side === 'left' && p.type === 'delete') || (side === 'right' && p.type === 'insert');
        if (!isHighlight) return <span key={i}>{p.value}</span>;
        return (
          <span
            key={i}
            className={
              p.type === 'delete'
                ? 'bg-red-300 dark:bg-red-700/60 rounded-sm px-px'
                : 'bg-green-300 dark:bg-green-700/60 rounded-sm px-px'
            }
          >
            {p.value}
          </span>
        );
      })}
    </>
  );
}

/* ================================================================
   DRAG & DROP TEXT AREA
   ================================================================ */

function DiffTextArea({
  label, value, onChange, onFileDrop, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onFileDrop: (f: File) => void;
  placeholder: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileDrop(file);
  }, [onFileDrop]);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl border shadow-sm overflow-hidden transition-colors ${
        dragOver
          ? 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900'
          : 'border-gray-200 dark:border-gray-700'
      }`}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {value.length} chars &middot; {value ? value.split('\n').length : 0} lines
          </span>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            title="Upload file"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          {value && (
            <button
              onClick={() => onChange('')}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              title="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        spellCheck={false}
        placeholder={placeholder}
        className="w-full h-52 p-4 font-mono text-sm bg-transparent text-gray-800 dark:text-gray-200 resize-none focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600"
      />
      <input
        ref={fileRef}
        type="file"
        accept=".txt,.md,.json,.csv,.xml,.html,.css,.js,.ts,.jsx,.tsx,.py,.java,.c,.cpp,.go,.rs,.rb,.php,.sql,.yaml,.yml,.log,.env,.ini,.cfg,.conf,.sh,.bat"
        className="hidden"
        onChange={async e => {
          const file = e.target.files?.[0];
          if (file) onFileDrop(file);
          e.target.value = '';
        }}
      />
      {dragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-indigo-50/80 dark:bg-indigo-900/30 rounded-2xl pointer-events-none">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
            <FileText className="w-5 h-5" />
            Drop file here
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

const EXAMPLE_LEFT = `function greet(name) {
  console.log("Hello, " + name + "!");
  return true;
}

const users = ["Alice", "Bob", "Charlie"];
users.forEach(user => {
  greet(user);
});

// End of file`;

const EXAMPLE_RIGHT = `function greet(name, greeting = "Hello") {
  console.log(greeting + ", " + name + "!");
  return { success: true, name };
}

const users = ["Alice", "Bob", "Diana"];
for (const user of users) {
  greet(user, "Hi");
}

// Updated greeting logic
// End of file`;

export function TextCompareTool() {
  const [left, setLeft] = useState(EXAMPLE_LEFT);
  const [right, setRight] = useState(EXAMPLE_RIGHT);
  const [diffMode, setDiffMode] = useState<DiffMode>('word');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [ignoreOpts, setIgnoreOpts] = useState<IgnoreOptions>({
    case: false, whitespace: false, punctuation: false, lineOrder: false,
  });
  const [hideUnchanged, setHideUnchanged] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentChange, setCurrentChange] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const diffRef = useRef<HTMLDivElement>(null);
  const changeRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  // Compute diff
  const lineDiffs = useMemo(
    () => computeLineDiff(left, right, diffMode, ignoreOpts),
    [left, right, diffMode, ignoreOpts]
  );

  const stats = useMemo(() => computeStats(lineDiffs, left, right), [lineDiffs, left, right]);

  // Filter diffs
  const filteredDiffs = useMemo(() => {
    let diffs = lineDiffs;
    if (hideUnchanged) diffs = diffs.filter(d => d.type !== 'equal');
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      diffs = diffs.filter(d =>
        (d.leftLine?.toLowerCase().includes(q)) ||
        (d.rightLine?.toLowerCase().includes(q))
      );
    }
    return diffs;
  }, [lineDiffs, hideUnchanged, searchQuery]);

  // Change indices for navigation
  const changeIndices = useMemo(
    () => filteredDiffs.reduce<number[]>((acc, d, i) => { if (d.type !== 'equal') acc.push(i); return acc; }, []),
    [filteredDiffs]
  );

  const navigateChange = useCallback((dir: 'prev' | 'next') => {
    if (changeIndices.length === 0) return;
    let next: number;
    if (dir === 'next') {
      next = currentChange + 1 >= changeIndices.length ? 0 : currentChange + 1;
    } else {
      next = currentChange - 1 < 0 ? changeIndices.length - 1 : currentChange - 1;
    }
    setCurrentChange(next);
    changeRefs.current[changeIndices[next]]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [changeIndices, currentChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowDown') { e.preventDefault(); navigateChange('next'); }
      if (e.altKey && e.key === 'ArrowUp') { e.preventDefault(); navigateChange('prev'); }
      if (e.ctrlKey && e.key === 'f' && diffRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        setShowSearch(s => !s);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigateChange]);

  const swapTexts = useCallback(() => {
    setLeft(right);
    setRight(left);
  }, [left, right]);

  const handleFileDrop = useCallback((side: 'left' | 'right') => async (file: File) => {
    try {
      const text = await readFileAsText(file);
      if (side === 'left') setLeft(text);
      else setRight(text);
    } catch {
      // silently ignore read errors
    }
  }, []);

  const copyDiff = useCallback(async () => {
    const text = lineDiffs.map(d => {
      if (d.type === 'equal') return '  ' + (d.leftLine ?? '');
      if (d.type === 'insert' && !d.leftLine) return '+ ' + (d.rightLine ?? '');
      if (d.type === 'delete' && !d.rightLine) return '- ' + (d.leftLine ?? '');
      return '- ' + (d.leftLine ?? '') + '\n+ ' + (d.rightLine ?? '');
    }).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [lineDiffs]);

  const downloadPng = useCallback(async () => {
    if (!diffRef.current) return;
    try {
      const { default: html2canvas } = await import('html2canvas-pro');
      const canvas = await html2canvas(diffRef.current, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = 'text-compare-diff.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // fallback: copy
      await copyDiff();
    }
  }, [copyDiff]);

  const toggleIgnore = useCallback((key: keyof IgnoreOptions) => {
    setIgnoreOpts(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const isIdentical = left === right;
  const isEmpty = !left && !right;

  return (
    <div className="space-y-4">
      {/* ========== INPUTS ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
        <DiffTextArea
          label="Original"
          value={left}
          onChange={setLeft}
          onFileDrop={handleFileDrop('left')}
          placeholder="Paste original text here or drop a file..."
        />

        {/* Swap button */}
        <button
          onClick={swapTexts}
          className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 shadow-lg hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xl transition-all group"
          title="Swap texts"
        >
          <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 rotate-90 transition-colors" />
        </button>

        <DiffTextArea
          label="Modified"
          value={right}
          onChange={setRight}
          onFileDrop={handleFileDrop('right')}
          placeholder="Paste modified text here or drop a file..."
        />
      </div>

      {/* Mobile swap */}
      <button
        onClick={swapTexts}
        className="lg:hidden w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:border-indigo-400 transition-colors"
      >
        <ArrowUpDown className="w-4 h-4" /> Swap Texts
      </button>

      {/* ========== TOOLBAR ========== */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Diff Mode */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            {(['line', 'word', 'char'] as const).map(m => (
              <button
                key={m}
                onClick={() => setDiffMode(m)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  diffMode === m
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            {(['split', 'unified'] as const).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  viewMode === v
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-lg font-semibold">
              +{stats.added}
            </span>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-lg font-semibold">
              &minus;{stats.removed}
            </span>
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-lg font-semibold">
              ~{stats.modified}
            </span>
            <span className={`px-2 py-1 rounded-lg font-bold ${
              stats.similarity >= 80
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                : stats.similarity >= 50
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {stats.similarity}% match
            </span>
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Nav */}
            {changeIndices.length > 0 && (
              <div className="flex items-center gap-1 mr-1">
                <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                  {changeIndices.length > 0 ? currentChange + 1 : 0}/{changeIndices.length}
                </span>
                <button
                  onClick={() => navigateChange('prev')}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                  title="Previous change (Alt+Up)"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigateChange('next')}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                  title="Next change (Alt+Down)"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => setShowSearch(s => !s)}
              className={`p-1.5 rounded-lg border transition-colors ${
                showSearch
                  ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title="Search in diff"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setHideUnchanged(h => !h)}
              className={`p-1.5 rounded-lg border transition-colors ${
                hideUnchanged
                  ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title={hideUnchanged ? 'Show all lines' : 'Hide unchanged lines'}
            >
              {hideUnchanged ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={copyDiff}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>

            <button
              onClick={downloadPng}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Download as PNG"
            >
              <Download className="w-3.5 h-3.5" /> PNG
            </button>
          </div>
        </div>

        {/* Ignore options row */}
        <div className="flex flex-wrap items-center gap-3 mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Ignore:</span>
          {([
            ['case', 'Case'],
            ['whitespace', 'Whitespace'],
            ['punctuation', 'Punctuation'],
            ['lineOrder', 'Line Order'],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-1.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={ignoreOpts[key]}
                onChange={() => toggleIgnore(key)}
                className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-700">
            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search in diff..."
              className="flex-1 text-sm bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========== DIFF OUTPUT ========== */}
      {isEmpty ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-400 dark:text-gray-500 text-sm">Paste text or drop files above to compare</p>
        </div>
      ) : isIdentical ? (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm p-8 text-center">
          <Check className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
          <p className="text-emerald-700 dark:text-emerald-400 font-semibold">Texts are identical</p>
          <p className="text-emerald-600/70 dark:text-emerald-500/70 text-sm mt-1">No differences found</p>
        </div>
      ) : viewMode === 'split' ? (
        <SplitView
          diffs={filteredDiffs}
          diffRef={diffRef}
          changeRefs={changeRefs}
          changeIndices={changeIndices}
          currentChange={currentChange}
        />
      ) : (
        <UnifiedView
          diffs={filteredDiffs}
          diffRef={diffRef}
          changeRefs={changeRefs}
          changeIndices={changeIndices}
          currentChange={currentChange}
        />
      )}

      {/* ========== KEYBOARD SHORTCUTS LEGEND ========== */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400 dark:text-gray-500 px-1">
        <span><kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono text-[10px]">Alt</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono text-[10px]">&uarr;&darr;</kbd> Navigate changes</span>
      </div>
    </div>
  );
}

/* ================================================================
   SPLIT VIEW
   ================================================================ */

function SplitView({
  diffs, diffRef, changeRefs, changeIndices, currentChange,
}: {
  diffs: LineDiff[];
  diffRef: React.RefObject<HTMLDivElement | null>;
  changeRefs: React.MutableRefObject<(HTMLTableRowElement | null)[]>;
  changeIndices: number[];
  currentChange: number;
}) {
  return (
    <div
      ref={diffRef}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="w-10 px-2 py-2 text-xs text-gray-400 dark:text-gray-500 font-medium text-right">#</th>
              <th className="w-1/2 px-3 py-2 text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider text-left">Original</th>
              <th className="w-10 px-2 py-2 text-xs text-gray-400 dark:text-gray-500 font-medium text-right">#</th>
              <th className="w-1/2 px-3 py-2 text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider text-left">Modified</th>
            </tr>
          </thead>
          <tbody>
            {diffs.map((d, i) => {
              const isActive = changeIndices[currentChange] === i;
              const isChange = d.type !== 'equal';

              return (
                <tr
                  key={i}
                  ref={el => { changeRefs.current[i] = el; }}
                  className={`border-b border-gray-50 dark:border-gray-800 ${
                    isActive ? 'ring-2 ring-inset ring-indigo-400 dark:ring-indigo-500' : ''
                  }`}
                >
                  {/* Left line number */}
                  <td className={`px-2 py-0.5 text-xs text-right select-none border-r ${
                    d.type === 'delete' || (isChange && d.leftLine !== undefined)
                      ? 'text-red-400 dark:text-red-500 bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                      : 'text-gray-300 dark:text-gray-600 border-gray-100 dark:border-gray-700'
                  }`}>
                    {d.leftNum ?? ''}
                  </td>

                  {/* Left content */}
                  <td className={`px-3 py-0.5 whitespace-pre-wrap break-all ${
                    d.type === 'equal'
                      ? 'text-gray-700 dark:text-gray-300'
                      : d.leftLine !== undefined
                        ? 'bg-red-50 dark:bg-red-900/15 text-red-800 dark:text-red-200'
                        : 'bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600'
                  }`}>
                    {d.inlineLeft
                      ? <InlineTokens parts={d.inlineLeft} side="left" />
                      : d.leftLine ?? ''
                    }
                  </td>

                  {/* Right line number */}
                  <td className={`px-2 py-0.5 text-xs text-right select-none border-l border-r ${
                    d.type === 'insert' || (isChange && d.rightLine !== undefined)
                      ? 'text-emerald-400 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30'
                      : 'text-gray-300 dark:text-gray-600 border-gray-100 dark:border-gray-700'
                  }`}>
                    {d.rightNum ?? ''}
                  </td>

                  {/* Right content */}
                  <td className={`px-3 py-0.5 whitespace-pre-wrap break-all ${
                    d.type === 'equal'
                      ? 'text-gray-700 dark:text-gray-300'
                      : d.rightLine !== undefined
                        ? 'bg-emerald-50 dark:bg-emerald-900/15 text-emerald-800 dark:text-emerald-200'
                        : 'bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600'
                  }`}>
                    {d.inlineRight
                      ? <InlineTokens parts={d.inlineRight} side="right" />
                      : d.rightLine ?? ''
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================================================================
   UNIFIED VIEW
   ================================================================ */

function UnifiedView({
  diffs, diffRef, changeRefs, changeIndices, currentChange,
}: {
  diffs: LineDiff[];
  diffRef: React.RefObject<HTMLDivElement | null>;
  changeRefs: React.MutableRefObject<(HTMLTableRowElement | null)[]>;
  changeIndices: number[];
  currentChange: number;
}) {
  // Flatten to unified rows
  const rows: { type: DiffType; num?: number; prefix: string; content: React.ReactNode; idx: number }[] = [];

  diffs.forEach((d, i) => {
    if (d.type === 'equal') {
      rows.push({ type: 'equal', num: d.leftNum, prefix: ' ', content: d.leftLine ?? '', idx: i });
    } else {
      if (d.leftLine !== undefined) {
        rows.push({
          type: 'delete',
          num: d.leftNum,
          prefix: '-',
          content: d.inlineLeft ? <InlineTokens parts={d.inlineLeft} side="left" /> : d.leftLine,
          idx: i,
        });
      }
      if (d.rightLine !== undefined) {
        rows.push({
          type: 'insert',
          num: d.rightNum,
          prefix: '+',
          content: d.inlineRight ? <InlineTokens parts={d.inlineRight} side="right" /> : d.rightLine,
          idx: i,
        });
      }
    }
  });

  return (
    <div
      ref={diffRef}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-sm border-collapse">
          <tbody>
            {rows.map((row, ri) => {
              const isActive = changeIndices[currentChange] === row.idx;
              return (
                <tr
                  key={ri}
                  ref={el => {
                    if (row.type !== 'equal') changeRefs.current[row.idx] = el;
                  }}
                  className={`border-b border-gray-50 dark:border-gray-800 ${
                    isActive ? 'ring-2 ring-inset ring-indigo-400 dark:ring-indigo-500' : ''
                  } ${
                    row.type === 'delete'
                      ? 'bg-red-50 dark:bg-red-900/15'
                      : row.type === 'insert'
                        ? 'bg-emerald-50 dark:bg-emerald-900/15'
                        : ''
                  }`}
                >
                  <td className={`w-10 px-2 py-0.5 text-xs text-right select-none border-r ${
                    row.type === 'delete'
                      ? 'text-red-400 dark:text-red-500 border-red-100 dark:border-red-900/30'
                      : row.type === 'insert'
                        ? 'text-emerald-400 dark:text-emerald-500 border-emerald-100 dark:border-emerald-900/30'
                        : 'text-gray-300 dark:text-gray-600 border-gray-100 dark:border-gray-700'
                  }`}>
                    {row.num ?? ''}
                  </td>
                  <td className={`w-6 px-2 py-0.5 text-xs text-center select-none font-bold ${
                    row.type === 'delete'
                      ? 'text-red-500 dark:text-red-400'
                      : row.type === 'insert'
                        ? 'text-emerald-500 dark:text-emerald-400'
                        : 'text-gray-300 dark:text-gray-600'
                  }`}>
                    {row.prefix}
                  </td>
                  <td className={`px-3 py-0.5 whitespace-pre-wrap break-all ${
                    row.type === 'delete'
                      ? 'text-red-800 dark:text-red-200'
                      : row.type === 'insert'
                        ? 'text-emerald-800 dark:text-emerald-200'
                        : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {row.content}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
