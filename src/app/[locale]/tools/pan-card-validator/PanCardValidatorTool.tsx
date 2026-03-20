'use client';

import { useState, useCallback } from 'react';
import { CreditCard, CheckCircle2, XCircle, Copy, Check, RotateCcw, Info } from 'lucide-react';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const TAXPAYER_TYPES: Record<string, string> = {
  P: 'Individual (Person)',
  C: 'Company',
  H: 'Hindu Undivided Family (HUF)',
  F: 'Firm / Partnership',
  A: 'Association of Persons (AOP)',
  T: 'Trust',
  B: 'Body of Individuals (BOI)',
  L: 'Local Authority',
  J: 'Artificial Juridical Person',
  G: 'Government Entity',
};

interface ValidationResult {
  isValid: boolean;
  taxpayerType: string | null;
  taxpayerTypeCode: string | null;
  nameInitial: string | null;
  serialChars: string | null;
  lastChar: string | null;
  errorMessage: string | null;
}

function validatePAN(pan: string): ValidationResult {
  const cleaned = pan.toUpperCase().replace(/\s/g, '');

  if (!cleaned) {
    return {
      isValid: false,
      taxpayerType: null,
      taxpayerTypeCode: null,
      nameInitial: null,
      serialChars: null,
      lastChar: null,
      errorMessage: 'Please enter a PAN number.',
    };
  }

  if (cleaned.length !== 10) {
    return {
      isValid: false,
      taxpayerType: null,
      taxpayerTypeCode: null,
      nameInitial: null,
      serialChars: null,
      lastChar: null,
      errorMessage: `PAN must be exactly 10 characters. You entered ${cleaned.length}.`,
    };
  }

  if (!PAN_REGEX.test(cleaned)) {
    let hint = '';
    if (!/^[A-Z]{5}/.test(cleaned)) hint = 'First 5 characters must be uppercase letters.';
    else if (!/^[A-Z]{5}[0-9]{4}/.test(cleaned)) hint = 'Characters 6–9 must be digits (0–9).';
    else hint = 'Last character must be an uppercase letter.';

    return {
      isValid: false,
      taxpayerType: null,
      taxpayerTypeCode: null,
      nameInitial: null,
      serialChars: null,
      lastChar: null,
      errorMessage: `Invalid PAN format. ${hint}`,
    };
  }

  const typeCode = cleaned[3];
  const taxpayerType = TAXPAYER_TYPES[typeCode] ?? 'Unknown Type';
  const nameInitial = cleaned[4];

  return {
    isValid: true,
    taxpayerType,
    taxpayerTypeCode: typeCode,
    nameInitial,
    serialChars: cleaned.slice(0, 3),
    lastChar: cleaned[9],
    errorMessage: null,
  };
}

export function PanCardValidatorTool() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setInput(raw);
    if (raw.length > 0) {
      setResult(validatePAN(raw));
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
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
            <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Enter PAN Number</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="e.g. ABCDE1234F"
            maxLength={10}
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-lg tracking-widest font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">
            {input.length}/10
          </div>
        </div>

        {/* PAN Structure Hint */}
        <div className="flex gap-1 items-center text-xs text-slate-600 dark:text-slate-400 font-mono">
          <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">AAA</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">X</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">Y</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">0000</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span className="bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded">Z</span>
          <span className="ml-2 text-slate-500">= Serial · Type · Initial · Number · Check</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            disabled={!input}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 text-white rounded-xl text-sm font-medium transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy PAN'}
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
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-500 dark:text-rose-400 flex-shrink-0" />
            )}
            <div>
              <p
                className={`text-lg font-bold ${
                  result.isValid ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
                }`}
              >
                {result.isValid ? 'Valid PAN Format' : 'Invalid PAN Format'}
              </p>
              {!result.isValid && result.errorMessage && (
                <p className="text-sm text-rose-500 dark:text-rose-400 mt-0.5">{result.errorMessage}</p>
              )}
            </div>
          </div>

          {result.isValid && (
            <>
              <div className="h-px bg-emerald-200 dark:bg-emerald-700/30" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800/60 rounded-xl p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Taxpayer Type
                  </p>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold">{result.taxpayerType}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Code: <span className="text-indigo-600 dark:text-indigo-400 font-mono">{result.taxpayerTypeCode}</span>{' '}
                    (4th character)
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800/60 rounded-xl p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                    {result.taxpayerTypeCode === 'P' ? 'Surname Initial' : 'Entity Name Initial'}
                  </p>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold font-mono text-2xl">
                    {result.nameInitial}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">5th character of PAN</p>
                </div>
              </div>

              {/* PAN Breakdown Visual */}
              <div className="bg-white dark:bg-slate-800/60 rounded-xl p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
                  PAN Structure Breakdown
                </p>
                <div className="flex flex-wrap gap-2 font-mono text-sm">
                  <div className="flex flex-col items-center">
                    <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg tracking-widest">
                      {input.slice(0, 3)}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Serial</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-lg">
                      {input[3]}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Type</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg">
                      {input[4]}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Initial</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg tracking-widest">
                      {input.slice(5, 9)}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Number</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-lg">
                      {input[9]}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Check</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Taxpayer Types Reference */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          PAN Taxpayer Type Codes (4th Character)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(TAXPAYER_TYPES).map(([code, type]) => (
            <div
              key={code}
              className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg px-3 py-2"
            >
              <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold text-sm w-4">{code}</span>
              <span className="text-slate-700 dark:text-slate-300 text-xs">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/40 rounded-2xl p-4 flex gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-800/80 dark:text-amber-300/80 text-sm leading-relaxed">
          <strong className="text-amber-800 dark:text-amber-300">Disclaimer:</strong> This tool validates PAN format
          only using the official regex pattern. It does not verify PAN with the Income Tax
          Department of India. For official verification, use the{' '}
          <span className="text-amber-900 dark:text-amber-200">Income Tax e-filing portal</span>.
        </p>
      </div>
    </div>
  );
}
