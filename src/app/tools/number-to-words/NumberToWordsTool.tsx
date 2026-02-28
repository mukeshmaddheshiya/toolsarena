'use client';
import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function belowThousand(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
  return ONES[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + belowThousand(n % 100) : '');
}

function toWordsInternational(n: number): string {
  if (n === 0) return 'Zero';
  const parts: string[] = [];
  const billions = Math.floor(n / 1e9);
  const millions = Math.floor((n % 1e9) / 1e6);
  const thousands = Math.floor((n % 1e6) / 1e3);
  const remainder = n % 1e3;
  if (billions) parts.push(belowThousand(billions) + ' Billion');
  if (millions) parts.push(belowThousand(millions) + ' Million');
  if (thousands) parts.push(belowThousand(thousands) + ' Thousand');
  if (remainder) parts.push(belowThousand(remainder));
  return parts.join(' ');
}

function toWordsIndian(n: number): string {
  if (n === 0) return 'Zero';
  const parts: string[] = [];
  const crore = Math.floor(n / 1e7);
  const lakh = Math.floor((n % 1e7) / 1e5);
  const thousand = Math.floor((n % 1e5) / 1e3);
  const remainder = n % 1e3;
  if (crore) parts.push(belowThousand(crore) + ' Crore');
  if (lakh) parts.push(belowThousand(lakh) + ' Lakh');
  if (thousand) parts.push(belowThousand(thousand) + ' Thousand');
  if (remainder) parts.push(belowThousand(remainder));
  return parts.join(' ');
}

export function NumberToWordsTool() {
  const [input, setInput] = useState('');
  const [system, setSystem] = useState<'indian' | 'international'>('indian');
  const [chequeMode, setChequeMode] = useState(false);

  const { intPart, fracPart } = useMemo(() => {
    if (!input) return { intPart: '', fracPart: '' };
    const [int, frac] = input.split('.');
    return { intPart: int || '', fracPart: frac || '' };
  }, [input]);

  const result = useMemo(() => {
    if (!intPart) return '';
    const n = parseInt(intPart.replace(/,/g, ''));
    if (isNaN(n) || n < 0 || n > 9999999999999) return 'Number out of range (max: 9,999,999,999,999)';
    const converter = system === 'indian' ? toWordsIndian : toWordsInternational;
    let words = converter(n);
    if (fracPart && system === 'indian') {
      const paisa = parseInt(fracPart.substring(0, 2).padEnd(2, '0'));
      if (paisa > 0) words += ' and ' + toWordsInternational(paisa) + ' Paise';
    } else if (fracPart) {
      const cents = parseInt(fracPart.substring(0, 2).padEnd(2, '0'));
      if (cents > 0) words += ' and ' + toWordsInternational(cents) + ' Cents';
    }
    if (chequeMode) words += ' Only';
    return words;
  }, [intPart, fracPart, system, chequeMode]);

  const EXAMPLES = [1234, 100000, 5000000, 123456789, 1000000000];

  return (
    <div className="space-y-5">
      {/* System selector */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
        {([['indian', 'Indian (Lakh/Crore)'], ['international', 'International (Million/Billion)']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setSystem(v)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${system === v ? 'bg-white dark:bg-slate-800 text-primary-800 dark:text-primary-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>{l}</button>
        ))}
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Enter Number</label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder="e.g. 123456.78"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
        />
      </div>

      {/* Cheque mode */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={chequeMode} onChange={e => setChequeMode(e.target.checked)} className="w-4 h-4 rounded accent-primary-800" />
        <span className="text-sm text-slate-700 dark:text-slate-300">Cheque mode (add "Only" at end)</span>
      </label>

      {/* Result */}
      {result && (
        <div className="p-5 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-2xl">
          <div className="flex items-start justify-between gap-3">
            <p className="text-base font-medium text-primary-900 dark:text-primary-200 leading-relaxed flex-1">{result}</p>
            {!result.includes('out of range') && <CopyButton text={result} />}
          </div>
        </div>
      )}

      {/* Quick examples */}
      <div>
        <p className="text-xs text-slate-400 mb-2">Quick examples:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map(n => (
            <button key={n} onClick={() => setInput(String(n))} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors font-mono">
              {n.toLocaleString('en-IN')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
