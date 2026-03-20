'use client';

import { useState, useCallback } from 'react';
import { FileCheck, CheckCircle2, XCircle, Copy, Check, RotateCcw, Info, MapPin } from 'lucide-react';

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const STATE_CODES: Record<string, string> = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '25': 'Daman & Diu',
  '26': 'Dadra & Nagar Haveli',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh (Old)',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
};

const GSTIN_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function calculateGSTINChecksum(gstin: string): string {
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const charValue = GSTIN_CHARS.indexOf(gstin[i]);
    const product = charValue * (i % 2 === 0 ? 1 : 2);
    sum += Math.floor(product / 36) + (product % 36);
  }
  const remainder = sum % 36;
  return GSTIN_CHARS[(36 - remainder) % 36];
}

interface ValidationResult {
  isValid: boolean;
  formatValid: boolean;
  checksumValid: boolean;
  stateCode: string | null;
  stateName: string | null;
  embeddedPAN: string | null;
  entityNumber: string | null;
  checksumChar: string | null;
  expectedChecksum: string | null;
  errorMessage: string | null;
}

function validateGSTIN(gstin: string): ValidationResult {
  const cleaned = gstin.toUpperCase().replace(/\s/g, '');

  if (!cleaned) {
    return {
      isValid: false, formatValid: false, checksumValid: false,
      stateCode: null, stateName: null, embeddedPAN: null,
      entityNumber: null, checksumChar: null, expectedChecksum: null,
      errorMessage: 'Please enter a GSTIN.',
    };
  }

  if (cleaned.length !== 15) {
    return {
      isValid: false, formatValid: false, checksumValid: false,
      stateCode: null, stateName: null, embeddedPAN: null,
      entityNumber: null, checksumChar: null, expectedChecksum: null,
      errorMessage: `GSTIN must be exactly 15 characters. You entered ${cleaned.length}.`,
    };
  }

  if (!GSTIN_REGEX.test(cleaned)) {
    let hint = '';
    if (!/^[0-9]{2}/.test(cleaned)) hint = 'First 2 characters must be digits (state code).';
    else if (!/^[0-9]{2}[A-Z]{5}/.test(cleaned)) hint = 'Characters 3–7 must be uppercase letters (PAN prefix).';
    else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}/.test(cleaned)) hint = 'Characters 8–11 must be digits (PAN number).';
    else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]/.test(cleaned)) hint = 'Character 12 must be an uppercase letter (PAN suffix).';
    else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]/.test(cleaned)) hint = 'Character 13 must be 1–9 or A–Z (entity number).';
    else if (cleaned[13] !== 'Z') hint = 'Character 14 must be Z.';
    else hint = 'Character 15 must be a digit or uppercase letter (checksum).';

    return {
      isValid: false, formatValid: false, checksumValid: false,
      stateCode: null, stateName: null, embeddedPAN: null,
      entityNumber: null, checksumChar: null, expectedChecksum: null,
      errorMessage: `Invalid GSTIN format. ${hint}`,
    };
  }

  const stateCode = cleaned.slice(0, 2);
  const stateName = STATE_CODES[stateCode] ?? 'Unknown State/UT';
  const embeddedPAN = cleaned.slice(2, 12);
  const entityNumber = cleaned[12];
  const checksumChar = cleaned[14];
  const expectedChecksum = calculateGSTINChecksum(cleaned);
  const checksumValid = checksumChar === expectedChecksum;

  return {
    isValid: checksumValid,
    formatValid: true,
    checksumValid,
    stateCode,
    stateName,
    embeddedPAN,
    entityNumber,
    checksumChar,
    expectedChecksum,
    errorMessage: checksumValid
      ? null
      : `Checksum mismatch. Expected "${expectedChecksum}", found "${checksumChar}". This GSTIN may contain a typo.`,
  };
}

export function GstinValidatorTool() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
    setInput(raw);
    if (raw.length > 0) {
      setResult(validateGSTIN(raw));
    } else {
      setResult(null);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!input) return;
    await navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [input]);

  const handleReset = useCallback(() => {
    setInput('');
    setResult(null);
    setCopied(false);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Input Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <FileCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-100">Enter GSTIN</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="e.g. 27ABCDE1234F1Z5"
            maxLength={15}
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-lg tracking-widest font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">
            {input.length}/15
          </div>
        </div>

        {/* Structure hint */}
        <div className="flex flex-wrap gap-1 items-center text-xs font-mono">
          <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">ST</span>
          <span className="text-slate-600">+</span>
          <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">AAAAA0000A</span>
          <span className="text-slate-600">+</span>
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">E</span>
          <span className="text-slate-600">+</span>
          <span className="bg-slate-600/50 text-slate-400 px-2 py-0.5 rounded">Z</span>
          <span className="text-slate-600">+</span>
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">C</span>
          <span className="ml-1 text-slate-500">State·PAN·Entity·Z·Check</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            disabled={!input}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl text-sm font-medium transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy GSTIN'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm font-medium transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Validation Result */}
      {result && (
        <div
          className={`border rounded-2xl p-6 space-y-4 transition-all ${
            result.isValid
              ? 'bg-emerald-950/40 border-emerald-700/50'
              : result.formatValid
              ? 'bg-amber-950/40 border-amber-700/50'
              : 'bg-rose-950/40 border-rose-700/50'
          }`}
        >
          <div className="flex items-center gap-3">
            {result.isValid ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            ) : (
              <XCircle className={`w-6 h-6 flex-shrink-0 ${result.formatValid ? 'text-amber-400' : 'text-rose-400'}`} />
            )}
            <div>
              <p
                className={`text-lg font-bold ${
                  result.isValid ? 'text-emerald-300' : result.formatValid ? 'text-amber-300' : 'text-rose-300'
                }`}
              >
                {result.isValid
                  ? 'Valid GSTIN'
                  : result.formatValid
                  ? 'Format Valid — Checksum Failed'
                  : 'Invalid GSTIN'}
              </p>
              {result.errorMessage && (
                <p className={`text-sm mt-0.5 ${result.formatValid ? 'text-amber-400' : 'text-rose-400'}`}>
                  {result.errorMessage}
                </p>
              )}
            </div>
          </div>

          {result.formatValid && (
            <>
              <div className="h-px bg-slate-700/50" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-800/60 rounded-xl p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> State / UT
                  </p>
                  <p className="text-slate-100 font-semibold">{result.stateName}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Code: <span className="text-blue-400 font-mono">{result.stateCode}</span>
                  </p>
                </div>

                <div className="bg-slate-800/60 rounded-xl p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Embedded PAN
                  </p>
                  <p className="text-slate-100 font-semibold font-mono tracking-widest">
                    {result.embeddedPAN}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Characters 3–12</p>
                </div>

                <div className="bg-slate-800/60 rounded-xl p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Entity Registration No.
                  </p>
                  <p className="text-slate-100 font-semibold font-mono text-2xl">
                    {result.entityNumber}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {/[1-9]/.test(result.entityNumber ?? '')
                      ? `Registration #${result.entityNumber} in this state`
                      : 'Alphabetical registration in this state'}
                  </p>
                </div>

                <div className="bg-slate-800/60 rounded-xl p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Checksum
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Found</p>
                      <p className={`font-mono text-xl font-bold ${result.checksumValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {result.checksumChar}
                      </p>
                    </div>
                    <div className="text-slate-600">/</div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Expected</p>
                      <p className="font-mono text-xl font-bold text-slate-300">
                        {result.expectedChecksum}
                      </p>
                    </div>
                    <div className="ml-auto">
                      {result.checksumValid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* GSTIN Breakdown Visual */}
              <div className="bg-slate-800/60 rounded-xl p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">
                  GSTIN Structure Breakdown
                </p>
                <div className="flex flex-wrap gap-2 font-mono text-sm">
                  {[
                    { chars: input.slice(0, 2), label: 'State', color: 'blue' },
                    { chars: input.slice(2, 12), label: 'PAN', color: 'indigo' },
                    { chars: input[12] ?? '', label: 'Entity', color: 'amber' },
                    { chars: input[13] ?? '', label: 'Fixed Z', color: 'slate' },
                    { chars: input[14] ?? '', label: 'Check', color: 'emerald' },
                  ].map(({ chars, label, color }) => {
                    const colorMap: Record<string, string> = {
                      blue: 'bg-blue-500/20 text-blue-300',
                      indigo: 'bg-indigo-500/20 text-indigo-300',
                      amber: 'bg-amber-500/20 text-amber-300',
                      slate: 'bg-slate-600/50 text-slate-400',
                      emerald: 'bg-emerald-500/20 text-emerald-300',
                    };
                    return (
                    <div key={label} className="flex flex-col items-center">
                      <span className={`${colorMap[color]} px-3 py-1.5 rounded-lg tracking-widest`}>
                        {chars || '?'}
                      </span>
                      <span className="text-xs text-slate-500 mt-1">{label}</span>
                    </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* State Codes Reference */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-400" />
          All Indian State / UT Codes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-64 overflow-y-auto pr-1">
          {Object.entries(STATE_CODES).map(([code, name]) => (
            <div
              key={code}
              className="flex items-center gap-2 bg-slate-900/60 rounded-lg px-3 py-1.5"
            >
              <span className="text-blue-400 font-mono font-bold text-xs w-6">{code}</span>
              <span className="text-slate-300 text-xs truncate">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-950/30 border border-amber-700/40 rounded-2xl p-4 flex gap-3">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-300/80 text-sm leading-relaxed">
          <strong className="text-amber-300">Disclaimer:</strong> Validates GSTIN format and
          checksum only. Does not connect to the GST portal or verify active registration status.
          For official verification, use the GST portal at{' '}
          <span className="text-amber-200">gst.gov.in</span>.
        </p>
      </div>
    </div>
  );
}
