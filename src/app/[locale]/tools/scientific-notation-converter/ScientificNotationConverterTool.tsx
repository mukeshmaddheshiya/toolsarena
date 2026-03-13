'use client';
import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';

const INPUT_CLASS = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const LABEL_CLASS = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
const CARD_CLASS = 'bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4';

const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '-': '⁻', '+': '',
};

function toSuperscript(exp: number): string {
  return String(exp).split('').map(c => SUPERSCRIPTS[c] ?? c).join('');
}

interface Notation {
  scientific: string;       // e.g. "4.5 × 10⁻⁵"
  eNotation: string;        // e.g. "4.5e-5"
  engineering: string;      // e.g. "45 × 10⁻⁶"
  standard: string;         // plain decimal
  isValid: boolean;
  error?: string;
}

function toSigFigs(n: number, sigFigs: number): number {
  if (n === 0) return 0;
  const d = Math.ceil(Math.log10(Math.abs(n)));
  const power = sigFigs - d;
  const magnitude = Math.pow(10, power);
  return Math.round(n * magnitude) / magnitude;
}

function computeNotation(value: number, sigFigs: number): Notation {
  if (!isFinite(value) || isNaN(value)) {
    return { scientific: '', eNotation: '', engineering: '', standard: '', isValid: false, error: 'Invalid number' };
  }

  const rounded = toSigFigs(value, sigFigs);
  const sign = rounded < 0 ? '-' : '';
  const absVal = Math.abs(rounded);

  // Scientific notation
  let sciExp = 0;
  let sciCoeff = absVal;
  if (absVal !== 0) {
    sciExp = Math.floor(Math.log10(absVal));
    sciCoeff = absVal / Math.pow(10, sciExp);
    // Handle floating point drift
    sciCoeff = parseFloat(sciCoeff.toPrecision(sigFigs));
    if (sciCoeff >= 10) { sciCoeff /= 10; sciExp += 1; }
    if (sciCoeff < 1 && sciCoeff > 0) { sciCoeff *= 10; sciExp -= 1; }
  }

  const sciCoeffStr = Number.isInteger(sciCoeff) ? sciCoeff.toString() : sciCoeff.toPrecision(sigFigs).replace(/\.?0+$/, '');
  const scientific = absVal === 0
    ? '0'
    : `${sign}${sciCoeffStr} × 10${toSuperscript(sciExp)}`;
  const eNotation = absVal === 0
    ? '0'
    : `${sign}${sciCoeffStr}e${sciExp >= 0 ? '+' : ''}${sciExp}`;

  // Engineering notation (exponent multiple of 3)
  let engExp = 0;
  let engCoeff = absVal;
  if (absVal !== 0) {
    engExp = Math.floor(Math.log10(absVal));
    engExp = Math.floor(engExp / 3) * 3;
    engCoeff = absVal / Math.pow(10, engExp);
    engCoeff = parseFloat(engCoeff.toPrecision(sigFigs));
  }
  const engCoeffStr = Number.isInteger(engCoeff) ? engCoeff.toString() : engCoeff.toPrecision(sigFigs).replace(/\.?0+$/, '');
  const engineering = absVal === 0
    ? '0'
    : engExp === 0
    ? `${sign}${engCoeffStr}`
    : `${sign}${engCoeffStr} × 10${toSuperscript(engExp)}`;

  // Standard decimal
  let standard: string;
  try {
    standard = rounded.toLocaleString('en-US', { maximumSignificantDigits: 21 });
    // For very large/small, fall back
    if (standard.includes('e') || standard.includes('E')) {
      standard = rounded.toPrecision(sigFigs);
    }
  } catch {
    standard = rounded.toString();
  }

  return { scientific, eNotation, engineering, standard, isValid: true };
}

function parseScientificInput(input: string): number | null {
  const s = input.trim();
  if (!s) return null;

  // Try direct parse first (handles 4.5e-5)
  const direct = parseFloat(s);
  if (!isNaN(direct) && isFinite(direct) && !s.includes('×') && !s.includes('^')) {
    return direct;
  }

  // Handle "4.5 × 10^-5" or "4.5 × 10⁻⁵" or "4.5e-5"
  const pattern1 = /^([+-]?\d+\.?\d*)\s*[×x\*]\s*10\s*\^?\s*([+-]?\d+)$/i;
  const m1 = s.match(pattern1);
  if (m1) {
    return parseFloat(m1[1]) * Math.pow(10, parseInt(m1[2]));
  }

  // Handle superscript exponents
  const supMap: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+' };
  const normalized = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]/g, c => supMap[c] ?? c);
  const m2 = normalized.match(pattern1);
  if (m2) {
    return parseFloat(m2[1]) * Math.pow(10, parseInt(m2[2]));
  }

  return null;
}

const EXAMPLES_STD = ['0.000045', '299792458', '0.001234', '-0.000000001', '123456789000'];
const EXAMPLES_SCI = ['4.5e-5', '2.998e8', '1.234e-3', '6.022e23'];

export function ScientificNotationConverterTool() {
  const [tab, setTab] = useState<'std2sci' | 'sci2std'>('std2sci');
  const [stdInput, setStdInput] = useState('');
  const [sciInput, setSciInput] = useState('');
  const [sigFigs, setSigFigs] = useState(4);

  const stdResult = useMemo<Notation>(() => {
    const val = parseFloat(stdInput.trim());
    if (stdInput.trim() === '' || isNaN(val)) {
      return { scientific: '', eNotation: '', engineering: '', standard: '', isValid: false };
    }
    return computeNotation(val, sigFigs);
  }, [stdInput, sigFigs]);

  const sciResult = useMemo<Notation>(() => {
    if (sciInput.trim() === '') {
      return { scientific: '', eNotation: '', engineering: '', standard: '', isValid: false };
    }
    const val = parseScientificInput(sciInput);
    if (val === null) {
      return { scientific: '', eNotation: '', engineering: '', standard: '', isValid: false, error: 'Cannot parse. Try: 4.5e-5 or 4.5 × 10^-5' };
    }
    return computeNotation(val, sigFigs);
  }, [sciInput, sigFigs]);

  const activeResult = tab === 'std2sci' ? stdResult : sciResult;

  const resultRows = activeResult.isValid
    ? [
        { label: 'Scientific Notation', value: activeResult.scientific, desc: 'coefficient × 10^exp' },
        { label: 'E-Notation', value: activeResult.eNotation, desc: 'machine-readable format' },
        { label: 'Engineering Notation', value: activeResult.engineering, desc: 'exponent multiple of 3' },
        { label: 'Standard Decimal', value: activeResult.standard, desc: 'plain decimal number' },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
        {([
          { key: 'std2sci', label: 'Standard → Scientific' },
          { key: 'sci2std', label: 'Scientific → Standard' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors ${tab === key ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sig figs */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">Significant Figures:</label>
        <input
          type="range"
          min={1}
          max={10}
          value={sigFigs}
          onChange={e => setSigFigs(Number(e.target.value))}
          className="flex-1 max-w-32 accent-primary-600"
        />
        <span className="text-sm font-bold text-primary-600 dark:text-primary-400 w-4">{sigFigs}</span>
      </div>

      {/* Input */}
      {tab === 'std2sci' ? (
        <div>
          <label className={LABEL_CLASS}>Standard Number</label>
          <input
            type="text"
            value={stdInput}
            onChange={e => setStdInput(e.target.value)}
            placeholder="e.g. 0.000045 or 299792458"
            className={INPUT_CLASS}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {EXAMPLES_STD.map(ex => (
              <button key={ex} onClick={() => setStdInput(ex)} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                {ex}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className={LABEL_CLASS}>Scientific Notation Input</label>
          <input
            type="text"
            value={sciInput}
            onChange={e => setSciInput(e.target.value)}
            placeholder="e.g. 4.5e-5 or 4.5 × 10^-5"
            className={INPUT_CLASS}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {EXAMPLES_SCI.map(ex => (
              <button key={ex} onClick={() => setSciInput(ex)} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                {ex}
              </button>
            ))}
          </div>
          {!activeResult.isValid && activeResult.error && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">{activeResult.error}</p>
          )}
        </div>
      )}

      {/* Results */}
      {activeResult.isValid && resultRows.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Results</h2>
          {resultRows.map(({ label, value, desc }) => (
            <div key={label} className={CARD_CLASS + ' flex items-start justify-between gap-3'}>
              <div className="min-w-0">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{label} <span className="text-slate-400 dark:text-slate-500">({desc})</span></div>
                <div className="text-lg font-mono font-semibold text-slate-900 dark:text-slate-100 break-all">{value}</div>
              </div>
              <CopyButton text={value} size="sm" className="shrink-0 mt-1" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!activeResult.isValid && !activeResult.error && (
        <div className={CARD_CLASS + ' text-center py-8'}>
          <p className="text-slate-400 dark:text-slate-500 text-sm">Enter a number above to convert</p>
        </div>
      )}

      {/* Info */}
      <div className={CARD_CLASS}>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Format Guide</h3>
        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          <div><span className="font-mono text-slate-700 dark:text-slate-300">4.5e-5</span> — E-notation (machine format)</div>
          <div><span className="font-mono text-slate-700 dark:text-slate-300">4.5 × 10^-5</span> — Human-readable scientific notation</div>
          <div><span className="font-mono text-slate-700 dark:text-slate-300">45 × 10⁻⁶</span> — Engineering notation (exponent multiple of 3)</div>
        </div>
      </div>
    </div>
  );
}
