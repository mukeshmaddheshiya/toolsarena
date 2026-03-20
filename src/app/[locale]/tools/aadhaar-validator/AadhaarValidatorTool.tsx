'use client';

import { useState, useCallback } from 'react';
import { Shield, CheckCircle2, XCircle, Copy, Check, RotateCcw, Lock, Info, AlertTriangle } from 'lucide-react';

// ─── Verhoeff Algorithm Tables ───────────────────────────────────────────────

const VERHOEFF_D: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const VERHOEFF_P: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const VERHOEFF_INV: number[] = [0, 4, 3, 2, 1, 9, 8, 7, 6, 5];

function verhoeffValidate(num: string): boolean {
  let c = 0;
  const digits = num.split('').map(Number).reverse();
  for (let i = 0; i < digits.length; i++) {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digits[i]]];
  }
  return c === 0;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValidationResult {
  isValid: boolean;
  startsValid: boolean;
  checksumValid: boolean;
  digits: string;
  formatted: string;
  errorMessage: string | null;
  step: 'empty' | 'too-short' | 'invalid-start' | 'checksum-fail' | 'valid';
}

// ─── Validation Logic ─────────────────────────────────────────────────────────

function validateAadhaar(raw: string): ValidationResult {
  const digits = raw.replace(/\D/g, '').slice(0, 12);
  const formatted = digits.replace(/(\d{4})(\d{1,4})?(\d{1,4})?/, (_, a, b, c) =>
    [a, b, c].filter(Boolean).join(' ')
  );

  if (!digits) {
    return {
      isValid: false, startsValid: false, checksumValid: false,
      digits, formatted, errorMessage: 'Please enter an Aadhaar number.',
      step: 'empty',
    };
  }

  if (digits.length < 12) {
    return {
      isValid: false, startsValid: false, checksumValid: false,
      digits, formatted,
      errorMessage: `Aadhaar must be 12 digits. You have entered ${digits.length}.`,
      step: 'too-short',
    };
  }

  const firstDigit = parseInt(digits[0], 10);
  if (firstDigit === 0 || firstDigit === 1) {
    return {
      isValid: false, startsValid: false, checksumValid: false,
      digits, formatted,
      errorMessage: `Aadhaar numbers cannot start with ${firstDigit}. The first digit must be 2–9.`,
      step: 'invalid-start',
    };
  }

  const checksumValid = verhoeffValidate(digits);
  if (!checksumValid) {
    return {
      isValid: false, startsValid: true, checksumValid: false,
      digits, formatted,
      errorMessage: 'Verhoeff checksum validation failed. One or more digits may be incorrect.',
      step: 'checksum-fail',
    };
  }

  return {
    isValid: true, startsValid: true, checksumValid: true,
    digits, formatted, errorMessage: null,
    step: 'valid',
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AadhaarValidatorTool() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d\s]/g, '');
    setInput(raw);
    const digitsOnly = raw.replace(/\D/g, '');
    if (digitsOnly.length > 0) {
      setResult(validateAadhaar(digitsOnly));
    } else {
      setResult(null);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!result?.formatted) return;
    await navigator.clipboard.writeText(result.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleReset = useCallback(() => {
    setInput('');
    setResult(null);
    setCopied(false);
  }, []);

  const displayValue = result?.digits
    ? result.digits.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(' ')
      )
    : input;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Privacy Banner */}
      <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-700/50 rounded-2xl p-4 flex gap-3">
        <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm mb-1">
            Your privacy is fully protected
          </p>
          <p className="text-emerald-600/70 dark:text-emerald-300/70 text-sm leading-relaxed">
            This tool uses the Verhoeff mathematical algorithm only. No data is sent to any server.
            Your Aadhaar number never leaves your browser. All computation is done locally in
            JavaScript.
          </p>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Enter Aadhaar Number</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            placeholder="XXXX XXXX XXXX"
            maxLength={14}
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-2xl tracking-[0.25em] font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm font-mono">
            {result?.digits?.length ?? 0}/12
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Format: 12 digits — displayed as XXXX XXXX XXXX
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            disabled={!result?.isValid}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 text-white rounded-xl text-sm font-medium transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Formatted'}
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
      {result && result.step !== 'empty' && (
        <div
          className={`border rounded-2xl p-6 space-y-4 transition-all ${
            result.isValid
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-700/50'
              : result.step === 'too-short'
              ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-700/50'
          }`}
        >
          <div className="flex items-center gap-3">
            {result.isValid ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
            ) : result.step === 'too-short' ? (
              <Info className="w-6 h-6 text-slate-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-500 dark:text-rose-400 flex-shrink-0" />
            )}
            <div>
              <p
                className={`text-lg font-bold ${
                  result.isValid
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : result.step === 'too-short'
                    ? 'text-slate-600 dark:text-slate-300'
                    : 'text-rose-700 dark:text-rose-300'
                }`}
              >
                {result.isValid
                  ? 'Valid Aadhaar Number'
                  : result.step === 'too-short'
                  ? 'Keep typing...'
                  : 'Invalid Aadhaar Number'}
              </p>
              {result.errorMessage && result.step !== 'too-short' && (
                <p className="text-sm text-rose-600 dark:text-rose-400 mt-0.5">{result.errorMessage}</p>
              )}
              {result.step === 'too-short' && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{result.errorMessage}</p>
              )}
            </div>
          </div>

          {/* Validation steps breakdown */}
          {result.digits.length === 12 && (
            <>
              <div className="h-px bg-slate-200 dark:bg-slate-700/50" />
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Validation Checks
                </p>

                {/* Check 1: Length */}
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-slate-800 dark:text-slate-200 text-sm font-medium">12-digit length</p>
                    <p className="text-xs text-slate-500">Exactly 12 numeric digits</p>
                  </div>
                  <span className="ml-auto text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                    Pass
                  </span>
                </div>

                {/* Check 2: Starting digit */}
                <div
                  className={`flex items-center gap-3 rounded-xl p-3 ${
                    result.startsValid ? 'bg-slate-50 dark:bg-slate-800/60' : 'bg-rose-50 dark:bg-rose-950/30'
                  }`}
                >
                  {result.startsValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-slate-800 dark:text-slate-200 text-sm font-medium">First digit check</p>
                    <p className="text-xs text-slate-500">
                      Must start with 2–9 (found:{' '}
                      <span className="font-mono text-slate-700 dark:text-slate-300">{result.digits[0]}</span>)
                    </p>
                  </div>
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                      result.startsValid
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {result.startsValid ? 'Pass' : 'Fail'}
                  </span>
                </div>

                {/* Check 3: Verhoeff checksum */}
                <div
                  className={`flex items-center gap-3 rounded-xl p-3 ${
                    result.checksumValid ? 'bg-slate-50 dark:bg-slate-800/60' : 'bg-rose-50 dark:bg-rose-950/30'
                  }`}
                >
                  {result.checksumValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  ) : result.startsValid ? (
                    <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-slate-800 dark:text-slate-200 text-sm font-medium">Verhoeff checksum</p>
                    <p className="text-xs text-slate-500">
                      Mathematical algorithm on all 12 digits
                    </p>
                  </div>
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                      !result.startsValid
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                        : result.checksumValid
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {!result.startsValid ? 'Skipped' : result.checksumValid ? 'Pass' : 'Fail'}
                  </span>
                </div>
              </div>

              {result.isValid && (
                <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-700/40 rounded-xl p-4 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
                      All checks passed
                    </p>
                    <p className="text-indigo-600/70 dark:text-indigo-300/70 text-xs mt-0.5">
                      This number has a valid 12-digit format, correct starting digit, and passes
                      the Verhoeff checksum algorithm.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* How Verhoeff works */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          How the Verhoeff Algorithm Works
        </h3>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            The Verhoeff algorithm uses three mathematical tables — a{' '}
            <span className="text-slate-800 dark:text-slate-300">multiplication table (d)</span>, a{' '}
            <span className="text-slate-800 dark:text-slate-300">permutation table (p)</span>, and an{' '}
            <span className="text-slate-800 dark:text-slate-300">inverse table (inv)</span> — to compute a check digit.
          </p>
          <p>
            The digits are processed right-to-left. Each digit is permuted based on its position,
            then combined with the running total using the multiplication table. A valid Aadhaar
            number produces a final result of{' '}
            <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">0</span>.
          </p>
          <p>
            This algorithm detects 100% of single-digit errors and all adjacent transpositions
            (e.g. swapping two neighboring digits).
          </p>
        </div>

        {/* Mini table display */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-2">Inverse table (inv) used in final step:</p>
          <div className="flex gap-2 flex-wrap">
            {VERHOEFF_INV.map((val, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xs text-slate-400 dark:text-slate-600 font-mono">{idx}</div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold">{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-5 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <p className="text-amber-700 dark:text-amber-300 font-semibold text-sm">Important Disclaimer</p>
          <p className="text-amber-600/75 dark:text-amber-300/75 text-sm leading-relaxed">
            This tool validates Aadhaar number format using the Verhoeff checksum algorithm only.
            A passing result does not confirm the number is issued by UIDAI or belongs to a real
            person. For official Aadhaar authentication, use UIDAI services at{' '}
            <span className="text-amber-700 dark:text-amber-200">uidai.gov.in</span>.
          </p>
          <p className="text-amber-600/75 dark:text-amber-300/75 text-sm leading-relaxed">
            <strong className="text-amber-700 dark:text-amber-300">Privacy:</strong> Your Aadhaar number is processed
            entirely within your browser. Zero data is transmitted. Zero data is stored.
          </p>
        </div>
      </div>
    </div>
  );
}
