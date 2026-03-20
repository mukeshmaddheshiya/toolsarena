'use client';

import { useState, useCallback, useRef } from 'react';
import {
  MapPin,
  Search,
  Copy,
  Check,
  Building2,
  Truck,
  Globe,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Package,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────

interface PostOffice {
  Name: string;
  Description: string | null;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  Block: string;
  State: string;
  Country: string;
  Pincode: string;
  Taluk?: string;
}

interface ApiResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[] | null;
}

// ─── Postal Circles ────────────────────────────────────────────────────────

const STATE_TO_CIRCLE: Record<string, string> = {
  'Andhra Pradesh': 'Andhra Pradesh Circle',
  'Arunachal Pradesh': 'North East Circle',
  'Assam': 'Assam Circle',
  'Bihar': 'Bihar Circle',
  'Chhattisgarh': 'Chhattisgarh Circle',
  'Goa': 'Goa Circle',
  'Gujarat': 'Gujarat Circle',
  'Haryana': 'Haryana Circle',
  'Himachal Pradesh': 'Himachal Pradesh Circle',
  'Jammu & Kashmir': 'Jammu & Kashmir Circle',
  'Jharkhand': 'Jharkhand Circle',
  'Karnataka': 'Karnataka Circle',
  'Kerala': 'Kerala Circle',
  'Madhya Pradesh': 'Madhya Pradesh Circle',
  'Maharashtra': 'Maharashtra Circle',
  'Manipur': 'North East Circle',
  'Meghalaya': 'North East Circle',
  'Mizoram': 'North East Circle',
  'Nagaland': 'North East Circle',
  'Odisha': 'Odisha Circle',
  'Punjab': 'Punjab Circle',
  'Rajasthan': 'Rajasthan Circle',
  'Sikkim': 'North East Circle',
  'Tamil Nadu': 'Tamil Nadu Circle',
  'Telangana': 'Telangana Circle',
  'Tripura': 'North East Circle',
  'Uttar Pradesh': 'Uttar Pradesh Circle',
  'Uttarakhand': 'Uttarakhand Circle',
  'West Bengal': 'West Bengal Circle',
  'Andaman and Nicobar Islands': 'Andaman & Nicobar Islands Circle',
  'Chandigarh': 'Punjab Circle',
  'Dadra and Nagar Haveli and Daman and Diu': 'Gujarat Circle',
  'Delhi': 'Delhi Circle',
  'Lakshadweep': 'Kerala Circle',
  'Puducherry': 'Tamil Nadu Circle',
  'Ladakh': 'Jammu & Kashmir Circle',
};

function getCircle(state: string): string {
  for (const [key, val] of Object.entries(STATE_TO_CIRCLE)) {
    if (state.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(state.toLowerCase())) {
      return val;
    }
  }
  return state + ' Circle';
}

// ─── Popular PIN quick-select ───────────────────────────────────────────────

const POPULAR_PINS = [
  { pin: '110001', label: 'Delhi (Connaught Place)' },
  { pin: '400001', label: 'Mumbai (Fort)' },
  { pin: '700001', label: 'Kolkata (GPO)' },
  { pin: '600001', label: 'Chennai (GPO)' },
  { pin: '560001', label: 'Bengaluru (GPO)' },
  { pin: '500001', label: 'Hyderabad (GPO)' },
];

// ─── Component ─────────────────────────────────────────────────────────────

export function PincodeLookupTool() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PostOffice[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastPin, setLastPin] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (pin: string) => {
    const cleanPin = pin.trim();

    if (!/^\d{6}$/.test(cleanPin)) {
      setError('Please enter a valid 6-digit PIN code.');
      setResults(null);
      return;
    }

    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);
    setResults(null);
    setLastPin(cleanPin);
    setExpandedIndex(null);

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: ApiResponse[] = await res.json();
      const record = data[0];

      if (record.Status === 'Error' || !record.PostOffice || record.PostOffice.length === 0) {
        setError('PIN code not found. Please verify and try again.');
      } else {
        setResults(record.PostOffice);
        setExpandedIndex(0); // auto-expand first result
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    search(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') search(input);
  };

  const copyPin = async () => {
    await navigator.clipboard.writeText(lastPin || input.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const usePopular = (pin: string) => {
    setInput(pin);
    search(pin);
  };

  const circle = results?.[0] ? getCircle(results[0].State) : null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Search input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Enter 6-Digit PIN Code
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={6}
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 110001"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-base font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </button>
        </div>

        {/* Popular pins */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-400 dark:text-slate-500">Popular:</span>
          {POPULAR_PINS.map(({ pin, label }) => (
            <button
              key={pin}
              type="button"
              onClick={() => usePopular(pin)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              title={label}
            >
              {pin}
            </button>
          ))}
        </div>
      </form>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-lg" />
              <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-800 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Results header */}
      {results && !isLoading && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 text-lg tracking-widest">
                  {lastPin}
                </span>
              </div>
              <button
                onClick={copyPin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {results.length} post office{results.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* Postal circle badge */}
          {circle && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit">
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{circle}</span>
            </div>
          )}

          {/* Post office cards */}
          <div className="space-y-3">
            {results.map((po, idx) => {
              const isExpanded = expandedIndex === idx;
              const isHead = po.BranchType.toLowerCase() === 'head post office';
              const isDelivery = po.DeliveryStatus.toLowerCase() === 'delivery';

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-shadow hover:shadow-sm"
                >
                  {/* Card header */}
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`mt-0.5 p-1.5 rounded-lg ${isHead ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        <Building2 className={`w-4 h-4 ${isHead ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                          {po.Name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {po.District}, {po.State}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <BadgePill
                        label={po.BranchType}
                        color={isHead ? 'indigo' : 'slate'}
                      />
                      <BadgePill
                        label={isDelivery ? 'Delivery' : 'Non-Delivery'}
                        color={isDelivery ? 'emerald' : 'amber'}
                        icon={isDelivery ? <Truck className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                      />
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-slate-400" />
                        : <ChevronDown className="w-4 h-4 text-slate-400" />
                      }
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 p-5">
                      <div className="grid grid-cols-2 gap-3">
                        <DetailField label="Post Office" value={po.Name} />
                        <DetailField label="Branch Type" value={po.BranchType} />
                        <DetailField label="Delivery Status" value={po.DeliveryStatus} />
                        <DetailField label="District" value={po.District} />
                        <DetailField label="Division" value={po.Division} />
                        <DetailField label="Region" value={po.Region} />
                        {po.Block && po.Block !== 'NA' && (
                          <DetailField label="Taluk / Block" value={po.Block} />
                        )}
                        <DetailField label="State" value={po.State} />
                        <DetailField label="Postal Circle" value={getCircle(po.State)} />
                        <DetailField label="Country" value={po.Country} />
                        <DetailField label="PIN Code" value={po.Pincode} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
        <p className="font-semibold text-slate-600 dark:text-slate-300">About PIN Codes</p>
        <p>
          PIN (Postal Index Number) is a 6-digit code. The first digit is the zone (1–9), digits 1–2 identify the
          sub-zone, and digits 1–3 identify the sorting district. Digits 4–6 are the specific delivery post office.
        </p>
        <p className="text-slate-400 dark:text-slate-500">
          Data source: India Post public API (api.postalpincode.in)
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg px-3 py-2.5 border border-slate-100 dark:border-slate-800">
      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

interface BadgePillProps {
  label: string;
  color: 'indigo' | 'slate' | 'emerald' | 'amber';
  icon?: React.ReactNode;
}

const PILL_COLORS: Record<string, string> = {
  indigo: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
  amber: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
};

function BadgePill({ label, color, icon }: BadgePillProps) {
  return (
    <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${PILL_COLORS[color]}`}>
      {icon}
      {label}
    </span>
  );
}
