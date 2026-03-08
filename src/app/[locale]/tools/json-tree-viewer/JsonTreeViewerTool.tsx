'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Expand,
  Shrink,
  Search,
  FileJson,
  Sparkles,
  Minimize2,
  Maximize2,
  ShieldCheck,
  Hash,
  Layers,
  HardDrive,
  X,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface TreeNodeData {
  key: string;
  value: unknown;
  path: string;
  depth: number;
  isArrayItem: boolean;
  index?: number;
}

interface JsonStats {
  totalKeys: number;
  maxDepth: number;
  sizeBytes: number;
}

// ── Example JSON ─────────────────────────────────────────────────────────────
const EXAMPLE_JSON = {
  company: 'ToolsArena',
  founded: 2024,
  isActive: true,
  headquarters: null,
  data: {
    users: [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        roles: ['admin', 'editor'],
        settings: { theme: 'dark', notifications: true, language: 'en' },
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob@example.com',
        roles: ['viewer'],
        settings: { theme: 'light', notifications: false, language: 'hi' },
      },
    ],
    metadata: {
      totalPages: 5,
      currentPage: 1,
      perPage: 20,
      tags: ['api', 'v2', 'stable'],
    },
  },
  endpoints: ['/api/users', '/api/posts', '/api/settings'],
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function getType(v: unknown): string {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v;
}

function countKeys(obj: unknown): number {
  if (obj === null || typeof obj !== 'object') return 0;
  let count = 0;
  if (Array.isArray(obj)) {
    for (const item of obj) count += countKeys(item);
  } else {
    const o = obj as Record<string, unknown>;
    for (const k of Object.keys(o)) {
      count += 1 + countKeys(o[k]);
    }
  }
  return count;
}

function getMaxDepth(obj: unknown, depth = 0): number {
  if (obj === null || typeof obj !== 'object') return depth;
  if (Array.isArray(obj)) {
    if (obj.length === 0) return depth;
    return Math.max(...obj.map((item) => getMaxDepth(item, depth + 1)));
  }
  const o = obj as Record<string, unknown>;
  const keys = Object.keys(o);
  if (keys.length === 0) return depth;
  return Math.max(...keys.map((k) => getMaxDepth(o[k], depth + 1)));
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function parseJsonSafe(text: string): { data: unknown; error: string | null } {
  try {
    const data = JSON.parse(text);
    return { data, error: null };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Invalid JSON';
    return { data: null, error: msg };
  }
}

function getAllPaths(obj: unknown, prefix = ''): Set<string> {
  const paths = new Set<string>();
  if (obj === null || typeof obj !== 'object') return paths;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      const p = `${prefix}[${i}]`;
      paths.add(p);
      for (const sub of getAllPaths(item, p)) paths.add(sub);
    });
  } else {
    const o = obj as Record<string, unknown>;
    for (const k of Object.keys(o)) {
      const p = prefix ? `${prefix}.${k}` : k;
      paths.add(p);
      for (const sub of getAllPaths(o[k], p)) paths.add(sub);
    }
  }
  return paths;
}

function getParentPaths(path: string): string[] {
  const parents: string[] = [];
  let current = '';
  const parts = path.replace(/\[/g, '.[').split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    current = current ? `${current}.${parts[i]}` : parts[i];
    // Clean up leading dots from array notation
    current = current.replace(/^\./, '');
    parents.push(current);
  }
  return parents;
}

function matchesSearch(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

function findMatchingPaths(
  obj: unknown,
  query: string,
  prefix = ''
): Set<string> {
  const matches = new Set<string>();
  if (!query) return matches;

  if (obj === null || typeof obj !== 'object') {
    if (matchesSearch(String(obj), query)) {
      matches.add(prefix);
    }
    return matches;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      const p = `${prefix}[${i}]`;
      if (matchesSearch(String(i), query)) matches.add(p);
      for (const sub of findMatchingPaths(item, query, p)) matches.add(sub);
    });
  } else {
    const o = obj as Record<string, unknown>;
    for (const k of Object.keys(o)) {
      const p = prefix ? `${prefix}.${k}` : k;
      if (matchesSearch(k, query)) matches.add(p);
      for (const sub of findMatchingPaths(o[k], p, p)) matches.add(sub);
    }
  }
  return matches;
}

// ── Value Display ────────────────────────────────────────────────────────────
function ValueDisplay({
  value,
  searchQuery,
}: {
  value: unknown;
  searchQuery: string;
}) {
  const type = getType(value);

  const highlight = (text: string) => {
    if (!searchQuery) return text;
    const idx = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5">
          {text.slice(idx, idx + searchQuery.length)}
        </span>
        {text.slice(idx + searchQuery.length)}
      </>
    );
  };

  switch (type) {
    case 'string':
      return (
        <span className="text-emerald-600 dark:text-emerald-400">
          &quot;{highlight(value as string)}&quot;
        </span>
      );
    case 'number':
      return (
        <span className="text-blue-600 dark:text-blue-400">
          {highlight(String(value))}
        </span>
      );
    case 'boolean':
      return (
        <span className="text-purple-600 dark:text-purple-400">
          {highlight(String(value))}
        </span>
      );
    case 'null':
      return (
        <span className="text-gray-400 dark:text-gray-500 italic">
          {highlight('null')}
        </span>
      );
    default:
      return <span>{String(value)}</span>;
  }
}

// ── Tree Node ────────────────────────────────────────────────────────────────
function TreeNode({
  node,
  expandedPaths,
  toggleExpand,
  onCopyPath,
  searchQuery,
  matchingPaths,
  copiedPath,
}: {
  node: TreeNodeData;
  expandedPaths: Set<string>;
  toggleExpand: (path: string) => void;
  onCopyPath: (path: string) => void;
  searchQuery: string;
  matchingPaths: Set<string>;
  copiedPath: string | null;
}) {
  const type = getType(node.value);
  const isExpandable = type === 'object' || type === 'array';
  const isExpanded = expandedPaths.has(node.path);
  const isMatch = matchingPaths.has(node.path);

  const childCount = isExpandable
    ? type === 'array'
      ? (node.value as unknown[]).length
      : Object.keys(node.value as Record<string, unknown>).length
    : 0;

  const children: TreeNodeData[] = useMemo(() => {
    if (!isExpandable || !isExpanded) return [];
    if (type === 'array') {
      return (node.value as unknown[]).map((item, i) => ({
        key: `[${i}]`,
        value: item,
        path: `${node.path}[${i}]`,
        depth: node.depth + 1,
        isArrayItem: true,
        index: i,
      }));
    }
    const obj = node.value as Record<string, unknown>;
    return Object.keys(obj).map((k) => ({
      key: k,
      value: obj[k],
      path: node.path ? `${node.path}.${k}` : k,
      depth: node.depth + 1,
      isArrayItem: false,
    }));
  }, [isExpandable, isExpanded, type, node.value, node.path, node.depth]);

  const highlightKey = (text: string) => {
    if (!searchQuery) return text;
    const idx = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5">
          {text.slice(idx, idx + searchQuery.length)}
        </span>
        {text.slice(idx + searchQuery.length)}
      </>
    );
  };

  return (
    <div>
      <div
        className={`group flex items-center gap-1 py-0.5 pr-2 rounded-md cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors ${
          isMatch
            ? 'bg-yellow-50 dark:bg-yellow-900/20 ring-1 ring-yellow-300 dark:ring-yellow-700'
            : ''
        }`}
        style={{ paddingLeft: `${node.depth * 20 + 4}px` }}
        onClick={() => {
          if (isExpandable) toggleExpand(node.path);
        }}
      >
        {/* Expand/Collapse arrow */}
        <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
          {isExpandable ? (
            isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            )
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
          )}
        </span>

        {/* Key name */}
        <span className="font-mono text-sm">
          {node.isArrayItem ? (
            <span className="text-orange-600 dark:text-orange-400">
              {highlightKey(node.key)}
            </span>
          ) : (
            <span className="text-gray-800 dark:text-gray-200">
              {highlightKey(node.key)}
            </span>
          )}
          <span className="text-gray-400 dark:text-gray-500">: </span>
        </span>

        {/* Value or type badge */}
        {isExpandable ? (
          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
            {type === 'array' ? '[' : '{'}
            {!isExpanded && (
              <span className="mx-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                {childCount} {childCount === 1 ? 'item' : 'items'}
              </span>
            )}
            {!isExpanded && (type === 'array' ? ']' : '}')}
          </span>
        ) : (
          <span className="font-mono text-sm">
            <ValueDisplay value={node.value} searchQuery={searchQuery} />
          </span>
        )}

        {/* Copy path button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopyPath(node.path);
          }}
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
          title={`Copy path: ${node.path}`}
        >
          {copiedPath === node.path ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Children */}
      {isExpanded && children.length > 0 && (
        <div>
          {children.map((child, i) => (
            <TreeNode
              key={`${child.path}-${i}`}
              node={child}
              expandedPaths={expandedPaths}
              toggleExpand={toggleExpand}
              onCopyPath={onCopyPath}
              searchQuery={searchQuery}
              matchingPaths={matchingPaths}
              copiedPath={copiedPath}
            />
          ))}
          {/* Closing bracket */}
          <div
            className="text-xs text-gray-400 dark:text-gray-500 font-mono py-0.5"
            style={{ paddingLeft: `${node.depth * 20 + 24}px` }}
          >
            {type === 'array' ? ']' : '}'}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-sm font-medium animate-in slide-in-from-bottom-4 fade-in duration-300">
      <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
      {message}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export function JsonTreeViewerTool() {
  const [input, setInput] = useState('');
  const [parsedData, setParsedData] = useState<unknown>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isMinified, setIsMinified] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Parse JSON on input change
  const handleInputChange = useCallback((text: string) => {
    setInput(text);
    if (!text.trim()) {
      setParsedData(null);
      setParseError(null);
      setExpandedPaths(new Set());
      return;
    }
    const { data, error } = parseJsonSafe(text);
    if (error) {
      setParseError(error);
      setParsedData(null);
    } else {
      setParseError(null);
      setParsedData(data);
      // Auto-expand first level
      if (data !== null && typeof data === 'object') {
        const firstLevel = new Set<string>();
        firstLevel.add('root');
        setExpandedPaths(firstLevel);
      }
    }
  }, []);

  // Stats
  const stats: JsonStats | null = useMemo(() => {
    if (parsedData === null && !input.trim()) return null;
    if (parsedData === null) return null;
    return {
      totalKeys: countKeys(parsedData),
      maxDepth: getMaxDepth(parsedData),
      sizeBytes: new TextEncoder().encode(input).length,
    };
  }, [parsedData, input]);

  // All expandable paths
  const allPaths = useMemo(() => {
    if (!parsedData) return new Set<string>();
    const paths = getAllPaths(parsedData);
    paths.add('root');
    return paths;
  }, [parsedData]);

  // Search matching
  const matchingPaths = useMemo(() => {
    if (!searchQuery || !parsedData) return new Set<string>();
    return findMatchingPaths(parsedData, searchQuery);
  }, [parsedData, searchQuery]);

  // Auto-expand parents of matching paths when searching
  useEffect(() => {
    if (!searchQuery || matchingPaths.size === 0) return;
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      next.add('root');
      for (const p of matchingPaths) {
        for (const parent of getParentPaths(p)) {
          next.add(parent);
        }
        // Also expand the matching node itself if it's expandable
        next.add(p);
      }
      return next;
    });
  }, [matchingPaths, searchQuery]);

  const toggleExpand = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedPaths(new Set(allPaths));
  }, [allPaths]);

  const collapseAll = useCallback(() => {
    setExpandedPaths(new Set(['root']));
  }, []);

  const expandToDepth = useCallback(
    (maxD: number) => {
      if (!parsedData) return;
      const paths = new Set<string>();
      paths.add('root');

      const walk = (obj: unknown, prefix: string, depth: number) => {
        if (depth >= maxD || obj === null || typeof obj !== 'object') return;
        if (Array.isArray(obj)) {
          obj.forEach((item, i) => {
            const p = `${prefix}[${i}]`;
            paths.add(p);
            walk(item, p, depth + 1);
          });
        } else {
          const o = obj as Record<string, unknown>;
          for (const k of Object.keys(o)) {
            const p = prefix ? `${prefix}.${k}` : k;
            paths.add(p);
            walk(o[k], p, depth + 1);
          }
        }
      };
      walk(parsedData, '', 0);
      setExpandedPaths(paths);
    },
    [parsedData]
  );

  const handleCopyPath = useCallback((path: string) => {
    const cleanPath = path === 'root' ? '$' : path;
    navigator.clipboard.writeText(cleanPath).then(() => {
      setCopiedPath(path);
      setToast(`Copied: ${cleanPath}`);
      setTimeout(() => setCopiedPath(null), 2000);
    });
  }, []);

  const handleCopyFormatted = useCallback(() => {
    if (!parsedData) return;
    const formatted = JSON.stringify(parsedData, null, 2);
    navigator.clipboard.writeText(formatted).then(() => {
      setToast('Formatted JSON copied to clipboard');
    });
  }, [parsedData]);

  const handleFormat = useCallback(() => {
    if (!parsedData) return;
    const formatted = JSON.stringify(parsedData, null, 2);
    setInput(formatted);
    setIsMinified(false);
  }, [parsedData]);

  const handleMinify = useCallback(() => {
    if (!parsedData) return;
    const minified = JSON.stringify(parsedData);
    setInput(minified);
    setIsMinified(true);
  }, [parsedData]);

  const handleTryExample = useCallback(() => {
    const text = JSON.stringify(EXAMPLE_JSON, null, 2);
    setInput(text);
    handleInputChange(text);
  }, [handleInputChange]);

  const handleClear = useCallback(() => {
    setInput('');
    setParsedData(null);
    setParseError(null);
    setExpandedPaths(new Set());
    setSearchQuery('');
    inputRef.current?.focus();
  }, []);

  // Build root nodes for tree
  const rootNodes: TreeNodeData[] = useMemo(() => {
    if (!parsedData || typeof parsedData !== 'object') return [];
    if (Array.isArray(parsedData)) {
      return parsedData.map((item, i) => ({
        key: `[${i}]`,
        value: item,
        path: `[${i}]`,
        depth: 0,
        isArrayItem: true,
        index: i,
      }));
    }
    const obj = parsedData as Record<string, unknown>;
    return Object.keys(obj).map((k) => ({
      key: k,
      value: obj[k],
      path: k,
      depth: 0,
      isArrayItem: false,
    }));
  }, [parsedData]);

  const rootType = parsedData
    ? Array.isArray(parsedData)
      ? 'array'
      : 'object'
    : null;
  const rootExpanded = expandedPaths.has('root');
  const rootChildCount = rootNodes.length;

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      {stats && (
        <div className="flex flex-wrap gap-4 items-center text-sm bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
            <Hash className="w-4 h-4" />
            <span className="font-medium">{stats.totalKeys}</span>
            <span className="text-emerald-600 dark:text-emerald-400">keys</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
            <Layers className="w-4 h-4" />
            <span className="font-medium">{stats.maxDepth}</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              max depth
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
            <HardDrive className="w-4 h-4" />
            <span className="font-medium">{formatBytes(stats.sizeBytes)}</span>
            <span className="text-emerald-600 dark:text-emerald-400">size</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs">Processed locally in your browser</span>
          </div>
        </div>
      )}

      {/* Main layout: two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left panel: Input */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FileJson className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              JSON Input
            </label>
            <div className="flex items-center gap-2">
              {parsedData !== null && (
                <>
                  <button
                    onClick={handleFormat}
                    className="text-xs px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    Format
                  </button>
                  <button
                    onClick={handleMinify}
                    className="text-xs px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                  >
                    <Minimize2 className="w-3 h-3" />
                    Minify
                  </button>
                </>
              )}
              {input && (
                <button
                  onClick={handleClear}
                  className="text-xs px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder='Paste your JSON here...\n\n{\n  "key": "value"\n}'
            className="w-full h-80 lg:h-[500px] p-4 font-mono text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-600 text-gray-800 dark:text-gray-200"
            spellCheck={false}
          />

          {/* Error display */}
          {parseError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400 font-mono">
              <span className="font-semibold">Parse Error:</span> {parseError}
            </div>
          )}

          {/* Try example / empty state */}
          {!input.trim() && (
            <button
              onClick={handleTryExample}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              Try Example JSON
            </button>
          )}
        </div>

        {/* Right panel: Tree View */}
        <div className="flex flex-col gap-3">
          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Tree View
            </label>
            {parsedData !== null && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={expandAll}
                  className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <Expand className="w-3 h-3" />
                  All
                </button>
                <button
                  onClick={collapseAll}
                  className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <Shrink className="w-3 h-3" />
                  Collapse
                </button>
                {[1, 2, 3].map((d) => (
                  <button
                    key={d}
                    onClick={() => expandToDepth(d)}
                    className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    L{d}
                  </button>
                ))}
                <button
                  onClick={handleCopyFormatted}
                  className="text-xs px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
            )}
          </div>

          {/* Search */}
          {parsedData !== null && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keys and values..."
                className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-600 text-gray-800 dark:text-gray-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {searchQuery && (
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {matchingPaths.size} match{matchingPaths.size !== 1 ? 'es' : ''}
                </span>
              )}
            </div>
          )}

          {/* Tree container */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-auto h-80 lg:h-[500px]">
            {parsedData ? (
              <div className="p-3 font-mono text-sm min-w-0">
                {/* Root bracket */}
                <div
                  className="group flex items-center gap-1 py-0.5 pr-2 rounded-md cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                  onClick={() => toggleExpand('root')}
                >
                  <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                    {rootExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    )}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500">
                    {rootType === 'array' ? '[' : '{'}
                    {!rootExpanded && (
                      <span className="mx-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                        {rootChildCount}{' '}
                        {rootChildCount === 1 ? 'item' : 'items'}
                      </span>
                    )}
                    {!rootExpanded &&
                      (rootType === 'array' ? ']' : '}')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyPath('root');
                    }}
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                    title="Copy root path"
                  >
                    {copiedPath === 'root' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Root children */}
                {rootExpanded && (
                  <>
                    {rootNodes.map((node, i) => (
                      <TreeNode
                        key={`${node.path}-${i}`}
                        node={node}
                        expandedPaths={expandedPaths}
                        toggleExpand={toggleExpand}
                        onCopyPath={handleCopyPath}
                        searchQuery={searchQuery}
                        matchingPaths={matchingPaths}
                        copiedPath={copiedPath}
                      />
                    ))}
                    <div className="text-gray-400 dark:text-gray-500 py-0.5 pl-6">
                      {rootType === 'array' ? ']' : '}'}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600 gap-3">
                <FileJson className="w-12 h-12 opacity-40" />
                <p className="text-sm">
                  {parseError
                    ? 'Fix the JSON error to see the tree'
                    : 'Paste JSON to visualize the tree'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg px-4 py-2.5 border border-gray-100 dark:border-gray-800">
        <span className="font-medium text-gray-600 dark:text-gray-300">
          Value colors:
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          String
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          Number
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          Boolean
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
          Null
        </span>
        <span className="ml-auto text-gray-400 dark:text-gray-500">
          Click any node to copy its JSON path
        </span>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
