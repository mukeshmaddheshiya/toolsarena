'use client';

import { useState, useCallback } from 'react';
import {
  Smartphone,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RotateCcw,
  Info,
  Building2,
  HelpCircle,
} from 'lucide-react';

const UPI_REGEX = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/;

// Map of 50+ bank handles to bank names
const BANK_HANDLES: Record<string, string> = {
  // Google Pay handles
  oksbi: 'SBI (via Google Pay)',
  okicici: 'ICICI Bank (via Google Pay)',
  okaxis: 'Axis Bank (via Google Pay)',
  okhdfcbank: 'HDFC Bank (via Google Pay)',
  // PhonePe handles
  ybl: 'PhonePe / Yes Bank',
  axl: 'PhonePe / Axis Bank',
  // Paytm
  paytm: 'Paytm Payments Bank',
  // Amazon Pay
  apl: 'Amazon Pay (Axis Bank)',
  // NPCI
  upi: 'NPCI / Generic UPI',
  // Direct bank handles
  sbi: 'State Bank of India',
  icici: 'ICICI Bank',
  hdfcbank: 'HDFC Bank',
  axisbank: 'Axis Bank',
  kotak: 'Kotak Mahindra Bank',
  ibl: 'IndusInd Bank',
  indus: 'IndusInd Bank',
  federal: 'Federal Bank',
  idfcfirst: 'IDFC First Bank',
  aubank: 'AU Small Finance Bank',
  rbl: 'RBL Bank',
  jsb: 'Janata Sahakari Bank',
  pnb: 'Punjab National Bank',
  barodampay: 'Bank of Baroda',
  centralbank: 'Central Bank of India',
  cbi: 'Central Bank of India',
  cnrb: 'Canara Bank',
  mahb: 'Bank of Maharashtra',
  ucobank: 'UCO Bank',
  unionbank: 'Union Bank of India',
  allahabad: 'Allahabad Bank',
  indianbank: 'Indian Bank',
  corporation: 'Corporation Bank',
  dbs: 'DBS Bank India',
  hsbc: 'HSBC India',
  citi: 'Citibank India',
  sc: 'Standard Chartered',
  jkb: 'Jammu & Kashmir Bank',
  kvb: 'Karur Vysya Bank',
  tmb: 'Tamilnad Mercantile Bank',
  dcb: 'DCB Bank',
  equitas: 'Equitas Small Finance Bank',
  ujjivan: 'Ujjivan Small Finance Bank',
  esaf: 'ESAF Small Finance Bank',
  fino: 'Fino Payments Bank',
  airtel: 'Airtel Payments Bank',
  jio: 'Jio Payments Bank',
  gpay: 'Google Pay (HDFC / Axis)',
  yesbank: 'Yes Bank',
  bob: 'Bank of Baroda',
  iob: 'Indian Overseas Bank',
  syndicatebank: 'Syndicate Bank',
  vijayabank: 'Vijaya Bank',
  denabank: 'Dena Bank',
  obc: 'Oriental Bank of Commerce',
  andhra: 'Andhra Bank',
  icicibank: 'ICICI Bank',
  idbi: 'IDBI Bank',
  bandhan: 'Bandhan Bank',
  saraswat: 'Saraswat Bank',
  nsdl: 'NSDL Payments Bank',
};

interface ValidationResult {
  isValid: boolean;
  username: string | null;
  handle: string | null;
  bankName: string | null;
  isKnownHandle: boolean;
  errorMessage: string | null;
}

function validateUPI(upi: string): ValidationResult {
  const cleaned = upi.trim().toLowerCase();

  if (!cleaned) {
    return {
      isValid: false, username: null, handle: null,
      bankName: null, isKnownHandle: false,
      errorMessage: 'Please enter a UPI ID.',
    };
  }

  if (!cleaned.includes('@')) {
    return {
      isValid: false, username: null, handle: null,
      bankName: null, isKnownHandle: false,
      errorMessage: 'UPI ID must contain "@" symbol (e.g. username@bankhandle).',
    };
  }

  const atCount = (cleaned.match(/@/g) ?? []).length;
  if (atCount > 1) {
    return {
      isValid: false, username: null, handle: null,
      bankName: null, isKnownHandle: false,
      errorMessage: 'UPI ID must contain exactly one "@" symbol.',
    };
  }

  if (!UPI_REGEX.test(cleaned)) {
    const [userPart, handlePart] = cleaned.split('@');
    let hint = '';
    if (!userPart || userPart.length < 2) {
      hint = 'Username must be at least 2 characters before "@".';
    } else if (userPart.length > 256) {
      hint = 'Username cannot exceed 256 characters.';
    } else if (!handlePart || handlePart.length < 2) {
      hint = 'Bank handle must be at least 2 letters after "@".';
    } else if (!/^[a-zA-Z]+$/.test(handlePart)) {
      hint = 'Bank handle must contain only letters (no digits or symbols).';
    } else {
      hint = 'Username contains invalid characters. Only letters, digits, dots (.), hyphens (-), and underscores (_) are allowed.';
    }
    return {
      isValid: false, username: null, handle: null,
      bankName: null, isKnownHandle: false,
      errorMessage: `Invalid UPI ID format. ${hint}`,
    };
  }

  const [username, handle] = cleaned.split('@');
  const bankName = BANK_HANDLES[handle] ?? null;

  return {
    isValid: true,
    username,
    handle,
    bankName,
    isKnownHandle: bankName !== null,
    errorMessage: null,
  };
}

export function UpiIdValidatorTool() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInput(raw);
    if (raw.trim().length > 0) {
      setResult(validateUPI(raw));
    } else {
      setResult(null);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!input) return;
    await navigator.clipboard.writeText(input.trim().toLowerCase());
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
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Enter UPI ID (VPA)</h2>
        </div>

        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="e.g. yourname@oksbi"
          spellCheck={false}
          autoComplete="off"
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />

        <div className="flex gap-1.5 text-xs text-slate-600 dark:text-slate-400 items-center flex-wrap">
          <span className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-mono">username</span>
          <span className="text-slate-500 font-bold text-base">@</span>
          <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-mono">bankhandle</span>
          <span className="text-slate-600 ml-1">— username: letters, digits, . - _  &nbsp;|  handle: letters only</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            disabled={!input}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl text-sm font-medium transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy UPI ID'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-all"
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
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-700/50'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-700/50'
          }`}
        >
          <div className="flex items-center gap-3">
            {result.isValid ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-500 dark:text-rose-400 flex-shrink-0" />
            )}
            <div>
              <p
                className={`text-lg font-bold ${
                  result.isValid ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                }`}
              >
                {result.isValid ? 'Valid UPI ID Format' : 'Invalid UPI ID Format'}
              </p>
              {result.errorMessage && (
                <p className="text-sm text-rose-500 dark:text-rose-400 mt-0.5">{result.errorMessage}</p>
              )}
            </div>
          </div>

          {result.isValid && (
            <>
              <div className="h-px bg-emerald-200 dark:bg-emerald-700/30" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Username</p>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold font-mono">{result.username}</p>
                  <p className="text-xs text-slate-500 mt-1">Part before @</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Bank Handle
                  </p>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold font-mono">@{result.handle}</p>
                  <p className="text-xs text-slate-500 mt-1">PSP / Bank identifier</p>
                </div>
              </div>

              {/* Bank identification */}
              <div
                className={`rounded-xl p-4 flex items-center gap-3 ${
                  result.isKnownHandle
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-700/40'
                    : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {result.isKnownHandle ? (
                  <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                    Identified Bank / PSP
                  </p>
                  {result.isKnownHandle ? (
                    <p className="text-indigo-600 dark:text-indigo-300 font-semibold">{result.bankName}</p>
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Unknown bank handle — format is valid but handle is not in our database. May
                      be a newer or less common PSP.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Popular handles reference */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Popular UPI Bank Handles
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-72 overflow-y-auto pr-1">
          {Object.entries(BANK_HANDLES).map(([handle, bank]) => (
            <div
              key={handle}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/60 rounded-lg px-3 py-1.5 overflow-hidden"
            >
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-medium shrink-0">
                @{handle}
              </span>
              <span className="text-slate-600 dark:text-slate-400 text-xs truncate">{bank}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/40 rounded-2xl p-4 flex gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-700 dark:text-amber-300/80 text-sm leading-relaxed">
          <strong className="text-amber-800 dark:text-amber-300">Disclaimer:</strong> This tool validates UPI ID format
          and identifies the bank handle. It does not verify if the UPI ID is active or registered.
          No data is sent to any server. All validation happens in your browser.
        </p>
      </div>
    </div>
  );
}
