// app/tools/dns-lookup/DnsLookupTool.tsx
'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Globe,
  Search,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type RecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'TXT' | 'SOA' | 'PTR' | 'SRV' | 'CAA';

interface DnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface DnsResponse {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: { name: string; type: number }[];
  Answer?: DnsAnswer[];
  Authority?: DnsAnswer[];
  Comment?: string;
}

interface RecordResult {
  type: RecordType;
  status: 'idle' | 'loading' | 'success' | 'error';
  answers: DnsAnswer[];
  error?: string;
  statusCode?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_RECORD_TYPES: RecordType[] = [
  'A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA', 'PTR', 'SRV', 'CAA',
];

const RECORD_TYPE_NUMBERS: Record<number, RecordType> = {
  1: 'A', 28: 'AAAA', 5: 'CNAME', 15: 'MX', 2: 'NS',
  16: 'TXT', 6: 'SOA', 12: 'PTR', 33: 'SRV', 257: 'CAA',
};

const STATUS_MESSAGES: Record<number, string> = {
  0: 'No error',
  1: 'Format error — the query was malformed',
  2: 'Server failure — the DNS server encountered an internal error',
  3: 'Non-existent domain — this domain does not exist',
  4: 'Not implemented — this query type is not supported',
  5: 'Refused — the server refused to respond',
};

const RECORD_DESCRIPTIONS: Record<RecordType, string> = {
  A: 'IPv4 address records',
  AAAA: 'IPv6 address records',
  CNAME: 'Canonical name (alias) records',
  MX: 'Mail exchange records',
  NS: 'Nameserver records',
  TXT: 'Text records (SPF, DKIM, DMARC, etc.)',
  SOA: 'Start of Authority records',
  PTR: 'Pointer records (reverse DNS)',
  SRV: 'Service location records',
  CAA: 'Certification Authority Authorization records',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeDomain(input: string): string {
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//i, '');
  domain = domain.replace(/^www\./i, '');
  domain = domain.split('/')[0];
  domain = domain.split('?')[0];
  domain = domain.split('#')[0];
  return domain;
}

function formatTTL(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  if (secs > 0) parts.push(`${secs}s`);
  return parts.join(' ');
}

function isIPAddress(input: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(input);
}

function ipToArpa(ip: string): string {
  return ip.split('.').reverse().join('.') + '.in-addr.arpa';
}

async function fetchDnsRecord(
  domain: string,
  type: RecordType
): Promise<{ answers: DnsAnswer[]; statusCode: number }> {
  const queryDomain = type === 'PTR' && isIPAddress(domain) ? ipToArpa(domain) : domain;
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(queryDomain)}&type=${type}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/dns-json' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data: DnsResponse = await response.json();
  return {
    answers: data.Answer ?? [],
    statusCode: data.Status,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      title="Copy value"
    >
      {copied ? <Check size={13} className="text-green-500 dark:text-green-400" /> : <Copy size={13} />}
    </button>
  );
}

function RecordBadge({ type }: { type: RecordType }) {
  const colors: Record<RecordType, string> = {
    A: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
    AAAA: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
    CNAME: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
    MX: 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30',
    NS: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
    TXT: 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30',
    SOA: 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30',
    PTR: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
    SRV: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
    CAA: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-bold ${colors[type]}`}>
      {type}
    </span>
  );
}

function parseMX(data: string): { priority: string; host: string } {
  const parts = data.trim().split(/\s+/);
  return { priority: parts[0] ?? '', host: parts[1] ?? data };
}

function parseSOA(data: string) {
  const parts = data.trim().split(/\s+/);
  return {
    primaryNS: parts[0] ?? '',
    responsibleEmail: (parts[1] ?? '').replace(/\.$/, '').replace('.', '@'),
    serial: parts[2] ?? '',
    refresh: formatTTL(parseInt(parts[3] ?? '0')),
    retry: formatTTL(parseInt(parts[4] ?? '0')),
    expire: formatTTL(parseInt(parts[5] ?? '0')),
    minimumTTL: formatTTL(parseInt(parts[6] ?? '0')),
  };
}

function RecordRow({ answer, type }: { answer: DnsAnswer; type: RecordType }) {
  const data = answer.data.replace(/^"(.*)"$/, '$1');

  const renderData = () => {
    if (type === 'MX') {
      const { priority, host } = parseMX(data);
      return (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded text-xs font-mono">
            Priority: {priority}
          </span>
          <span className="font-mono text-slate-800 dark:text-slate-200 text-sm break-all">{host}</span>
        </div>
      );
    }
    if (type === 'SOA') {
      const soa = parseSOA(data);
      return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm font-mono text-slate-700 dark:text-slate-300">
          <div><span className="text-slate-500">Primary NS:</span> {soa.primaryNS}</div>
          <div><span className="text-slate-500">Email:</span> {soa.responsibleEmail}</div>
          <div><span className="text-slate-500">Serial:</span> {soa.serial}</div>
          <div><span className="text-slate-500">Refresh:</span> {soa.refresh}</div>
          <div><span className="text-slate-500">Retry:</span> {soa.retry}</div>
          <div><span className="text-slate-500">Expire:</span> {soa.expire}</div>
          <div><span className="text-slate-500">Min TTL:</span> {soa.minimumTTL}</div>
        </div>
      );
    }
    return (
      <span className="font-mono text-slate-800 dark:text-slate-200 text-sm break-all">{data}</span>
    );
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 group hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
      <div className="flex-1 min-w-0">
        {renderData()}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
          TTL {formatTTL(answer.TTL)}
        </span>
        <CopyButton value={data} />
      </div>
    </div>
  );
}

function RecordSection({
  result,
  isExpanded,
  onToggle,
}: {
  result: RecordResult;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const hasData = result.answers.length > 0;
  const isLoading = result.status === 'loading';
  const isError = result.status === 'error';
  const isSuccess = result.status === 'success';

  return (
    <div className="border border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <RecordBadge type={result.type} />
          <span className="text-slate-700 dark:text-slate-300 text-sm">{RECORD_DESCRIPTIONS[result.type]}</span>
          {isSuccess && hasData && (
            <span className="bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30 px-2 py-0.5 rounded-full text-xs">
              {result.answers.length} record{result.answers.length !== 1 ? 's' : ''}
            </span>
          )}
          {isSuccess && !hasData && (
            <span className="text-slate-500 text-xs">No records</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 size={16} className="text-indigo-600 dark:text-indigo-400 animate-spin" />}
          {isError && <AlertCircle size={16} className="text-red-400" />}
          {isExpanded ? (
            <ChevronUp size={16} className="text-slate-500" />
          ) : (
            <ChevronDown size={16} className="text-slate-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 bg-slate-100 dark:bg-slate-900/60 space-y-2">
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 py-2">
              <Loader2 size={16} className="animate-spin text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm">Querying DNS...</span>
            </div>
          )}
          {isError && (
            <div className="flex items-center gap-2 text-red-500 dark:text-red-400 py-2">
              <AlertCircle size={16} />
              <span className="text-sm">{result.error}</span>
            </div>
          )}
          {isSuccess && !hasData && (
            <p className="text-slate-500 text-sm py-2">
              No {result.type} records found for this domain.
            </p>
          )}
          {isSuccess && hasData &&
            result.answers.map((ans, i) => (
              <RecordRow key={i} answer={ans} type={result.type} />
            ))}
          {isSuccess && result.statusCode !== undefined && result.statusCode !== 0 && (
            <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 text-xs mt-2">
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              <span>DNS Status {result.statusCode}: {STATUS_MESSAGES[result.statusCode] ?? 'Unknown status'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DnsLookupTool() {
  const [inputValue, setInputValue] = useState('');
  const [queriedDomain, setQueriedDomain] = useState('');
  const [records, setRecords] = useState<Map<RecordType, RecordResult>>(new Map());
  const [expandedTypes, setExpandedTypes] = useState<Set<RecordType>>(new Set());
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<RecordType>>(
    new Set(['A', 'MX', 'NS', 'TXT'])
  );
  const abortRef = useRef<AbortController | null>(null);

  const initRecords = useCallback((types: RecordType[]): Map<RecordType, RecordResult> => {
    const map = new Map<RecordType, RecordResult>();
    types.forEach((t) => map.set(t, { type: t, status: 'loading', answers: [] }));
    return map;
  }, []);

  const fetchRecords = useCallback(
    async (domain: string, types: RecordType[]) => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setQueriedDomain(domain);
      const initial = initRecords(types);
      setRecords(new Map(initial));
      setExpandedTypes(new Set(types));

      await Promise.all(
        types.map(async (type) => {
          try {
            const { answers, statusCode } = await fetchDnsRecord(domain, type);
            setRecords((prev) => {
              const next = new Map(prev);
              next.set(type, { type, status: 'success', answers, statusCode });
              return next;
            });
          } catch (err) {
            const isNetworkError =
              err instanceof TypeError && err.message.includes('fetch');
            setRecords((prev) => {
              const next = new Map(prev);
              next.set(type, {
                type,
                status: 'error',
                answers: [],
                error: isNetworkError
                  ? 'Network error — check your connection'
                  : 'Domain not found or record type unavailable',
              });
              return next;
            });
          }
        })
      );
    },
    [initRecords]
  );

  const handleCheckAll = async () => {
    const domain = normalizeDomain(inputValue);
    if (!domain) return;
    setIsCheckingAll(true);
    await fetchRecords(domain, ALL_RECORD_TYPES);
    setIsCheckingAll(false);
  };

  const handleCheckSelected = async () => {
    const domain = normalizeDomain(inputValue);
    if (!domain || selectedTypes.size === 0) return;
    await fetchRecords(domain, Array.from(selectedTypes));
  };

  const toggleType = (type: RecordType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const toggleExpanded = (type: RecordType) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const hasResults = records.size > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <Globe className="text-indigo-600 dark:text-indigo-400" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">DNS Lookup Tool</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Query DNS records via Cloudflare DNS-over-HTTPS
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckSelected()}
              placeholder="Enter domain (e.g., google.com)"
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-sm font-mono transition-colors"
            />
          </div>
          <button
            onClick={handleCheckSelected}
            disabled={!inputValue.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Search size={15} />
            Lookup
          </button>
          <button
            onClick={handleCheckAll}
            disabled={!inputValue.trim() || isCheckingAll}
            className="px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            {isCheckingAll ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <RefreshCw size={15} />
            )}
            Check All
          </button>
        </div>

        {/* Record Type Selector */}
        <div>
          <p className="text-xs text-slate-500 mb-2">Select record types to query:</p>
          <div className="flex flex-wrap gap-2">
            {ALL_RECORD_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                  selectedTypes.has(type)
                    ? 'bg-indigo-600/30 border-indigo-500/60 text-indigo-700 dark:text-indigo-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {hasResults && (
        <div className="space-y-3">
          {queriedDomain && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Globe size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span>Results for</span>
              <span className="font-mono text-indigo-700 dark:text-indigo-300 font-medium">{queriedDomain}</span>
            </div>
          )}
          {ALL_RECORD_TYPES.filter((t) => records.has(t)).map((type) => {
            const result = records.get(type)!;
            return (
              <RecordSection
                key={type}
                result={result}
                isExpanded={expandedTypes.has(type)}
                onToggle={() => toggleExpanded(type)}
              />
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!hasResults && (
        <div className="text-center py-16 text-slate-400 dark:text-slate-600">
          <Globe size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Enter a domain name and click Lookup to query DNS records.</p>
        </div>
      )}
    </div>
  );
}
