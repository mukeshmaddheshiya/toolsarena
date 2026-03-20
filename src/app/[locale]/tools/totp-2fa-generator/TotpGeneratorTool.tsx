'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Lock,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Clock,
  ShieldAlert,
  Eye,
  EyeOff,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Algorithm = 'SHA-1' | 'SHA-256';
type Digits = 6 | 8;
type Period = 30 | 60;

interface TotpParams {
  secret: string;
  algorithm: Algorithm;
  digits: Digits;
  period: Period;
}

interface TotpResult {
  current: string;
  previous: string;
  next: string;
}

// ─── Base32 Decoder ───────────────────────────────────────────────────────────

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(input: string): Uint8Array {
  const str = input.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
  let bits = 0;
  let bitsCount = 0;
  const bytes: number[] = [];

  for (const char of str) {
    const value = BASE32_CHARS.indexOf(char);
    if (value < 0) throw new Error(`Invalid Base32 character: "${char}"`);
    bits = (bits << 5) | value;
    bitsCount += 5;
    if (bitsCount >= 8) {
      bitsCount -= 8;
      bytes.push((bits >>> bitsCount) & 0xff);
    }
  }
  return new Uint8Array(bytes);
}

// ─── TOTP Implementation ──────────────────────────────────────────────────────

async function computeTotp(
  secretBytes: Uint8Array,
  counter: number,
  algorithm: Algorithm,
  digits: Digits
): Promise<string> {
  // Counter as 8-byte big-endian
  const counterBytes = new Uint8Array(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    counterBytes[i] = c & 0xff;
    c = Math.floor(c / 256);
  }

  // Import key
  const key = await crypto.subtle.importKey(
    'raw',
    secretBytes.buffer as ArrayBuffer,
    { name: 'HMAC', hash: { name: algorithm } },
    false,
    ['sign']
  );

  // HMAC
  const signature = await crypto.subtle.sign('HMAC', key, counterBytes);
  const hash = new Uint8Array(signature);

  // Dynamic truncation
  const offset = hash[hash.length - 1] & 0x0f;
  const code =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  const otp = code % Math.pow(10, digits);
  return otp.toString().padStart(digits, '0');
}

async function generateTotpCodes(params: TotpParams): Promise<TotpResult> {
  const secretBytes = base32Decode(params.secret);
  const now = Math.floor(Date.now() / 1000);
  const counter = Math.floor(now / params.period);

  const [previous, current, next] = await Promise.all([
    computeTotp(secretBytes, counter - 1, params.algorithm, params.digits),
    computeTotp(secretBytes, counter, params.algorithm, params.digits),
    computeTotp(secretBytes, counter + 1, params.algorithm, params.digits),
  ]);

  return { previous, current, next };
}

// ─── otpauth URI Parser ───────────────────────────────────────────────────────

function parseOtpAuth(uri: string): Partial<TotpParams> | null {
  try {
    // otpauth://totp/Label?secret=X&algorithm=SHA1&digits=6&period=30
    if (!uri.startsWith('otpauth://')) return null;
    const url = new URL(uri);
    const params = url.searchParams;
    const secret = params.get('secret') ?? '';
    const algorithmRaw = (params.get('algorithm') ?? 'SHA1').toUpperCase();
    const algorithm: Algorithm = algorithmRaw === 'SHA256' ? 'SHA-256' : 'SHA-1';
    const digits = parseInt(params.get('digits') ?? '6') as Digits;
    const period = parseInt(params.get('period') ?? '30') as Period;
    return { secret, algorithm, digits, period };
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSecondsRemaining(period: number): number {
  return period - (Math.floor(Date.now() / 1000) % period);
}

function formatCode(code: string, digits: number): string {
  if (digits === 6) return `${code.slice(0, 3)} ${code.slice(3)}`;
  return `${code.slice(0, 4)} ${code.slice(4)}`;
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ value, className = '' }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={`flex items-center gap-1.5 transition-colors ${className}`}
      title="Copy code"
    >
      {copied ? (
        <Check size={16} className="text-green-400" />
      ) : (
        <Copy size={16} />
      )}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TotpGeneratorTool() {
  const [secret, setSecret] = useState('JBSWY3DPEHPK3PXP');
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-1');
  const [digits, setDigits] = useState<Digits>(6);
  const [period, setPeriod] = useState<Period>(30);
  const [showSecret, setShowSecret] = useState(false);
  const [otpauthUri, setOtpauthUri] = useState('');

  const [codes, setCodes] = useState<TotpResult | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(getSecondsRemaining(period));
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generate = useCallback(async (params: TotpParams) => {
    if (!params.secret.trim()) {
      setCodes(null);
      setError(null);
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateTotpCodes(params);
      setCodes(result);
    } catch (e) {
      setError((e as Error).message);
      setCodes(null);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Auto-generate + countdown
  useEffect(() => {
    const params: TotpParams = { secret, algorithm, digits, period };
    void generate(params);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const sLeft = getSecondsRemaining(period);
      setSecondsLeft(sLeft);
      // Regenerate when period rolls over
      if (sLeft === period) {
        void generate(params);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [secret, algorithm, digits, period, generate]);

  // otpauth URI paste
  const handleOtpauthChange = (value: string) => {
    setOtpauthUri(value);
    if (value.startsWith('otpauth://')) {
      const parsed = parseOtpAuth(value);
      if (parsed) {
        if (parsed.secret) setSecret(parsed.secret);
        if (parsed.algorithm) setAlgorithm(parsed.algorithm);
        if (parsed.digits) setDigits(parsed.digits);
        if (parsed.period) setPeriod(parsed.period);
      }
    }
  };

  const progressPct = (secondsLeft / period) * 100;
  const isExpiringSoon = secondsLeft <= 5;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <Lock className="text-indigo-600 dark:text-indigo-400" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">TOTP Authenticator Code Generator</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">RFC 6238 · Web Crypto API · 100% client-side</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 rounded-xl p-4">
        <ShieldAlert size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-200/80 leading-relaxed">
          <span className="font-semibold text-amber-700 dark:text-amber-300">Authorized use only.</span>{' '}
          Use this tool to test your own 2FA implementations or as a backup authenticator for
          accounts you own. Never use it for unauthorized access to accounts that do not belong to you.
        </p>
      </div>

      {/* Input Panel */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 space-y-4">
        {/* otpauth URI */}
        <div>
          <label className="block text-xs text-slate-500 mb-1.5">
            otpauth:// URI <span className="text-slate-600">(optional — auto-fills fields below)</span>
          </label>
          <input
            type="text"
            value={otpauthUri}
            onChange={(e) => handleOtpauthChange(e.target.value)}
            placeholder="otpauth://totp/MyApp:user@example.com?secret=ABC&issuer=MyApp"
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs font-mono"
          />
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800" />

        {/* Secret Key */}
        <div>
          <label className="block text-xs text-slate-500 mb-1.5">Base32 Secret Key</label>
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              value={secret}
              onChange={(e) => setSecret(e.target.value.toUpperCase().replace(/\s/g, ''))}
              placeholder="JBSWY3DPEHPK3PXP"
              className="w-full px-3 py-2.5 pr-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-sm tracking-widest"
              spellCheck={false}
              autoComplete="off"
            />
            <button
              onClick={() => setShowSecret((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Options Row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Algorithm */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Algorithm</label>
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {(['SHA-1', 'SHA-256'] as Algorithm[]).map((alg) => (
                <button
                  key={alg}
                  onClick={() => setAlgorithm(alg)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    algorithm === alg
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {alg.replace('-', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Digits */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Digits</label>
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {([6, 8] as Digits[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDigits(d)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    digits === d
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {d} digits
                </button>
              ))}
            </div>
          </div>

          {/* Period */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Period</label>
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {([30, 60] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    period === p
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {p}s
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-sm text-red-400">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Code Display */}
      {codes && !error && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden">
          {/* Current code */}
          <div className="px-6 pt-6 pb-4 text-center">
            <div className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Current Code</div>
            <div
              className={`font-mono text-5xl sm:text-6xl font-bold tracking-[0.15em] transition-colors ${
                isExpiringSoon ? 'text-red-400' : 'text-indigo-600 dark:text-indigo-300'
              }`}
            >
              {isGenerating ? (
                <RefreshCw size={40} className="mx-auto animate-spin text-slate-600" />
              ) : (
                formatCode(codes.current, digits)
              )}
            </div>

            {/* Countdown */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isExpiringSoon ? 'bg-red-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-mono font-semibold ${
                  isExpiringSoon ? 'text-red-400' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Clock size={13} />
                {secondsLeft}s
              </div>
            </div>

            {/* Copy */}
            <CopyButton
              value={codes.current}
              className="mx-auto mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium"
            />
          </div>

          {/* Previous / Next */}
          <div className="grid grid-cols-2 border-t border-slate-200 dark:border-slate-800">
            <div className="px-5 py-4 border-r border-slate-200 dark:border-slate-800 text-center">
              <div className="text-xs text-slate-600 mb-1.5">Previous</div>
              <div className="font-mono text-2xl text-slate-600 tracking-widest">
                {formatCode(codes.previous, digits)}
              </div>
            </div>
            <div className="px-5 py-4 text-center">
              <div className="text-xs text-slate-600 mb-1.5">Next</div>
              <div className="font-mono text-2xl text-slate-600 tracking-widest">
                {formatCode(codes.next, digits)}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="px-5 py-3 bg-slate-100 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-x-6 gap-y-1">
            {[
              { label: 'Algorithm', value: algorithm },
              { label: 'Digits', value: digits },
              { label: 'Period', value: `${period}s` },
              { label: 'Counter', value: String(BigInt(Math.floor(Date.now() / 1000)) / BigInt(period)) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-600">{label}:</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!codes && !error && !isGenerating && (
        <div className="text-center py-12 text-slate-600">
          <Lock size={36} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">Enter a Base32 secret key to generate TOTP codes.</p>
        </div>
      )}

      {/* RFC note */}
      <div className="text-xs text-slate-600 text-center space-y-1">
        <p>
          Implements <span className="text-slate-500">RFC 6238</span> (TOTP) using the{' '}
          <span className="text-slate-500">Web Crypto API</span> (SubtleCrypto HMAC).
          Zero server requests. Zero data stored.
        </p>
        <p>
          Most authenticator apps use{' '}
          <span className="text-slate-500">SHA-1 · 6 digits · 30s period</span>.
        </p>
      </div>
    </div>
  );
}
