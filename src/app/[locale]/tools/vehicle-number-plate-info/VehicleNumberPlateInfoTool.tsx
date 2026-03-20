'use client';

import { useState, useCallback } from 'react';
import {
  Car,
  MapPin,
  Hash,
  AlignLeft,
  AlertCircle,
  Info,
  ChevronRight,
  Globe,
  Search,
} from 'lucide-react';

// ─── Data ──────────────────────────────────────────────────────────────────

const STATE_CODES: Record<string, string> = {
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CG: 'Chhattisgarh',
  GA: 'Goa',
  GJ: 'Gujarat',
  HR: 'Haryana',
  HP: 'Himachal Pradesh',
  JK: 'Jammu & Kashmir',
  JH: 'Jharkhand',
  KA: 'Karnataka',
  KL: 'Kerala',
  MP: 'Madhya Pradesh',
  MH: 'Maharashtra',
  MN: 'Manipur',
  ML: 'Meghalaya',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OD: 'Odisha',
  PB: 'Punjab',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TN: 'Tamil Nadu',
  TS: 'Telangana',
  TR: 'Tripura',
  UP: 'Uttar Pradesh',
  UK: 'Uttarakhand',
  WB: 'West Bengal',
  AN: 'Andaman & Nicobar Islands',
  CH: 'Chandigarh',
  DD: 'Daman & Diu',
  DL: 'Delhi',
  DN: 'Dadra & Nagar Haveli',
  LD: 'Lakshadweep',
  PY: 'Puducherry',
  LA: 'Ladakh',
};

// ─── Types ─────────────────────────────────────────────────────────────────

interface DecodedPlate {
  raw: string;
  normalized: string;
  isBH: boolean;
  stateCode?: string;
  stateName?: string;
  rtoCode?: string;
  series?: string;
  regNumber?: string;
  bhYear?: string;
  bhSerial?: string;
  bhSuffix?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function normalize(input: string): string {
  return input.replace(/[\s\-]/g, '').toUpperCase();
}

const BH_REGEX = /^(\d{2})BH(\d{4})([A-Z]{1,2})$/;
const STANDARD_REGEX = /^([A-Z]{2})(\d{2})([A-Z]{1,3})(\d{1,4})$/;

function decode(input: string): { result: DecodedPlate } | { error: string } {
  const normalized = normalize(input);

  if (normalized.length < 6) {
    return { error: 'Please enter a valid Indian vehicle registration number.' };
  }

  const bhMatch = normalized.match(BH_REGEX);
  if (bhMatch) {
    return {
      result: {
        raw: input,
        normalized,
        isBH: true,
        bhYear: bhMatch[1],
        bhSerial: bhMatch[2],
        bhSuffix: bhMatch[3],
      },
    };
  }

  const stdMatch = normalized.match(STANDARD_REGEX);
  if (!stdMatch) {
    return {
      error:
        'Invalid format. Expected: SS NN LLLL NNNN (e.g., MH 02 AH 1234). Also supports BH series (e.g., 22 BH 1234 AB).',
    };
  }

  const stateCode = stdMatch[1];
  const stateName = STATE_CODES[stateCode];

  if (!stateName) {
    return {
      error: `Unknown state code "${stateCode}". Please verify your registration number.`,
    };
  }

  return {
    result: {
      raw: input,
      normalized,
      isBH: false,
      stateCode,
      stateName,
      rtoCode: stdMatch[2],
      series: stdMatch[3],
      regNumber: stdMatch[4],
    },
  };
}

const EXAMPLE_PLATES = ['MH 02 AH 1234', 'KA-03-MH-2023', 'DL5CAB1234', '22 BH 1234 AB', 'TN 09 BF 7890'];

// ─── Component ─────────────────────────────────────────────────────────────

export function VehicleNumberPlateInfoTool() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<DecodedPlate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter a vehicle registration number.');
      setDecoded(null);
      return;
    }
    const res = decode(input.trim());
    if ('error' in res) {
      setError(res.error);
      setDecoded(null);
    } else {
      setError(null);
      setDecoded(res.result);
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleDecode();
  };

  const useExample = (plate: string) => {
    setInput(plate);
    const res = decode(plate.trim());
    if ('error' in res) {
      setError(res.error);
      setDecoded(null);
    } else {
      setError(null);
      setDecoded(res.result);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Enter Registration Number
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. MH 02 AH 1234"
              maxLength={14}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-base font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 uppercase"
            />
          </div>
          <button
            onClick={handleDecode}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
          >
            <Search className="w-4 h-4" />
            Decode
          </button>
        </div>

        {/* Example chips */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-slate-400 dark:text-slate-500 self-center">Try:</span>
          {EXAMPLE_PLATES.map((plate) => (
            <button
              key={plate}
              onClick={() => useExample(plate)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 font-mono transition-colors"
            >
              {plate}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* BH Series Result */}
      {decoded?.isBH && (
        <div className="space-y-4">
          <PlateVisual text={decoded.normalized} isBH />

          <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 overflow-hidden">
            <div className="px-5 py-3.5 bg-indigo-50 dark:bg-indigo-950/40 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                Bharat Series (BH) Plate
              </h3>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ResultCard
                icon={<Hash className="w-4 h-4" />}
                label="Year of Registration"
                value={`20${decoded.bhYear}`}
                color="indigo"
              />
              <ResultCard
                icon={<AlignLeft className="w-4 h-4" />}
                label="Serial Number"
                value={decoded.bhSerial!}
                color="indigo"
              />
              <ResultCard
                icon={<AlignLeft className="w-4 h-4" />}
                label="Suffix"
                value={decoded.bhSuffix!}
                color="indigo"
              />
            </div>
            <div className="px-5 pb-4">
              <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900">
                <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  <strong>BH (Bharat) Series</strong> — Introduced in August 2021, this nationwide registration format is
                  not tied to any state. It is available for government employees, defence personnel, and private-sector
                  employees with offices in 8+ states. No re-registration is needed when relocating.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standard Plate Result */}
      {decoded && !decoded.isBH && (
        <div className="space-y-4">
          <PlateVisual
            text={`${decoded.stateCode} ${decoded.rtoCode} ${decoded.series} ${decoded.regNumber}`}
          />

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                Decoded Information
              </h3>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultCard
                icon={<MapPin className="w-4 h-4" />}
                label="State / UT"
                value={decoded.stateName!}
                sub={decoded.stateCode}
                color="indigo"
                wide
              />
              <ResultCard
                icon={<Hash className="w-4 h-4" />}
                label="RTO District Code"
                value={decoded.rtoCode!}
                sub="Regional Transport Office"
                color="violet"
              />
              <ResultCard
                icon={<AlignLeft className="w-4 h-4" />}
                label="Series"
                value={decoded.series!}
                sub="Letter series"
                color="sky"
              />
              <ResultCard
                icon={<Car className="w-4 h-4" />}
                label="Registration No."
                value={decoded.regNumber!}
                sub="Unique serial number"
                color="emerald"
              />
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      {decoded && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Important Disclaimer</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              This tool decodes the state and RTO from the registration number format only. It does{' '}
              <strong>NOT</strong> look up owner details, vehicle information, or connect to any government
              database (Vahan). For official vehicle information, use the official{' '}
              <a
                href="https://vahan.parivahan.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                Vahan portal
              </a>
              .
            </p>
          </div>
        </div>
      )}

      {/* Format guide */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-2">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Registration Format Guide
        </p>
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          <FormatRow parts={['MH', '02', 'AH', '1234']} labels={['State', 'RTO', 'Series', 'Number']} />
          <p className="text-slate-400 text-xs flex items-center gap-1 pt-1">
            <ChevronRight className="w-3 h-3" />
            BH series: <span className="font-mono">22 BH 1234 AB</span> (Year · BH · Serial · Suffix)
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function PlateVisual({ text, isBH }: { text: string; isBH?: boolean }) {
  return (
    <div className="flex justify-center">
      <div
        className={`
          inline-flex items-center gap-2 px-6 py-3 rounded-xl border-4 font-black text-2xl tracking-[0.25em] shadow-md
          ${isBH
            ? 'border-blue-600 bg-white text-blue-700'
            : 'border-slate-800 bg-yellow-400 text-slate-900'
          }
        `}
        style={{ fontFamily: 'monospace', minWidth: '280px', justifyContent: 'center' }}
      >
        {text}
      </div>
    </div>
  );
}

interface ResultCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
  wide?: boolean;
}

const CARD_COLORS: Record<string, { icon: string; border: string; bg: string }> = {
  indigo: {
    icon: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-100 dark:border-indigo-900',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
  },
  violet: {
    icon: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-100 dark:border-violet-900',
    bg: 'bg-violet-50 dark:bg-violet-950/20',
  },
  sky: {
    icon: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-100 dark:border-sky-900',
    bg: 'bg-sky-50 dark:bg-sky-950/20',
  },
  emerald: {
    icon: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-900',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
  },
};

function ResultCard({ icon, label, value, sub, color, wide }: ResultCardProps) {
  const c = CARD_COLORS[color] ?? CARD_COLORS.indigo;
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${c.border} ${c.bg} ${wide ? 'sm:col-span-2' : ''}`}>
      <div className={`mt-0.5 ${c.icon}`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        <p className="text-base font-bold text-slate-800 dark:text-slate-100">{value}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function FormatRow({ parts, labels }: { parts: string[]; labels: string[] }) {
  return (
    <div className="flex flex-wrap items-start gap-x-3 gap-y-1">
      {parts.map((part, i) => (
        <div key={i} className="text-center">
          <div className="font-mono font-bold text-slate-700 dark:text-slate-200 text-sm">{part}</div>
          <div className="text-slate-400 dark:text-slate-500 text-[10px]">{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}
