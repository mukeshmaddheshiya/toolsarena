'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Building, Search, Copy, Check, AlertCircle, Loader2, MapPin, Clock, Trash2, ExternalLink } from 'lucide-react';

interface BankDetails {
  BANK: string;
  IFSC: string;
  BRANCH: string;
  CENTRE: string;
  DISTRICT: string;
  STATE: string;
  ADDRESS: string;
  CITY: string;
  CONTACT: string;
  MICR: string;
  UPI: boolean;
  RTGS: boolean;
  NEFT: boolean;
  IMPS: boolean;
  SWIFT: string;
}

const QUICK_CODES = [
  { bank: 'SBI', prefix: 'SBIN0', color: 'bg-blue-600' },
  { bank: 'HDFC', prefix: 'HDFC0', color: 'bg-blue-800' },
  { bank: 'ICICI', prefix: 'ICIC0', color: 'bg-orange-600' },
  { bank: 'Axis', prefix: 'UTIB0', color: 'bg-purple-700' },
  { bank: 'PNB', prefix: 'PUNB0', color: 'bg-pink-700' },
  { bank: 'BOB', prefix: 'BARB0', color: 'bg-orange-700' },
  { bank: 'Kotak', prefix: 'KKBK0', color: 'bg-red-600' },
  { bank: 'Canara', prefix: 'CNRB0', color: 'bg-yellow-700' },
  { bank: 'Union', prefix: 'UBIN0', color: 'bg-indigo-600' },
  { bank: 'BOI', prefix: 'BKID0', color: 'bg-teal-700' },
  { bank: 'IDBI', prefix: 'IBKL0', color: 'bg-green-700' },
  { bank: 'Yes Bank', prefix: 'YESB0', color: 'bg-blue-500' },
];

export function IFSCCodeFinderTool() {
  const [ifscCode, setIfscCode] = useState('');
  const [details, setDetails] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [history, setHistory] = useState<{ code: string; bank: string; branch: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ifsc_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const isValidFormat = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase());

  const lookupIFSC = useCallback(async (code?: string) => {
    const c = (code || ifscCode).trim().toUpperCase();
    if (!c) return;

    setLoading(true);
    setError('');
    setDetails(null);

    try {
      const res = await fetch(`https://ifsc.razorpay.com/${c}`);
      if (!res.ok) throw new Error('not found');
      const data = await res.json();
      setDetails(data);

      // Add to history
      setHistory(prev => {
        const filtered = prev.filter(h => h.code !== c);
        const newHistory = [{ code: c, bank: data.BANK, branch: data.BRANCH }, ...filtered].slice(0, 8);
        try { localStorage.setItem('ifsc_history', JSON.stringify(newHistory)); } catch { /* ignore */ }
        return newHistory;
      });
    } catch {
      setError(`IFSC code "${c}" not found. Please check and try again.`);
    } finally {
      setLoading(false);
    }
  }, [ifscCode]);

  // Auto-search when 11 chars entered
  useEffect(() => {
    if (ifscCode.length === 11 && isValidFormat) {
      lookupIFSC();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ifscCode]);

  const copyText = useCallback(async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && ifscCode.trim()) lookupIFSC();
  };

  const clearHistory = () => {
    setHistory([]);
    try { localStorage.removeItem('ifsc_history'); } catch { /* ignore */ }
  };

  // Format visual breakdown
  const formatBreakdown = ifscCode.length > 0 ? (
    <div className="flex items-center gap-0.5 mt-2">
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${ifscCode.length >= 4 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>
        {ifscCode.slice(0, 4) || '____'}
      </span>
      <span className="text-[10px] text-slate-300">-</span>
      <span className={`px-1 py-0.5 rounded text-[10px] font-mono font-bold ${ifscCode.length >= 5 ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
        {ifscCode[4] || '_'}
      </span>
      <span className="text-[10px] text-slate-300">-</span>
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${ifscCode.length > 5 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700' : 'bg-slate-100 text-slate-400'}`}>
        {ifscCode.slice(5) || '______'}
      </span>
      <span className="text-[10px] text-slate-400 ml-2">
        {ifscCode.length >= 4 ? 'Bank' : ''} {ifscCode.length >= 5 ? '| Check' : ''} {ifscCode.length > 5 ? '| Branch' : ''}
      </span>
    </div>
  ) : null;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">IFSC Code Finder</h2>
            <p className="text-blue-200 text-xs">Find bank branch details by IFSC code | NEFT, RTGS, IMPS, UPI | 1,50,000+ branches</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input ref={inputRef} type="text" value={ifscCode}
              onChange={e => { setIfscCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter IFSC Code (e.g. SBIN0001234)"
              maxLength={11}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-mono tracking-wider focus:ring-2 focus:ring-blue-500 outline-none uppercase pr-20" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {ifscCode.length > 0 && (
                <span className={`text-[10px] font-medium ${ifscCode.length === 11 ? (isValidFormat ? 'text-green-500' : 'text-red-500') : 'text-slate-400'}`}>
                  {ifscCode.length}/11
                </span>
              )}
              {ifscCode && (
                <button onClick={() => { setIfscCode(''); setDetails(null); setError(''); inputRef.current?.focus(); }}
                  className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <button onClick={() => lookupIFSC()} disabled={!ifscCode.trim() || loading}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </div>

        {/* Visual breakdown */}
        {formatBreakdown}

        {/* Quick bank prefixes */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] text-slate-400 self-center">Popular Banks:</span>
          {QUICK_CODES.map(q => (
            <button key={q.bank} onClick={() => { setIfscCode(q.prefix); setDetails(null); setError(''); inputRef.current?.focus(); }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                ifscCode.startsWith(q.prefix) ? `${q.color} text-white` : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-700'}`}>
              {q.bank}
            </button>
          ))}
        </div>
      </div>

      {/* Search History */}
      {history.length > 0 && !details && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Recent Searches
            </h4>
            <button onClick={clearHistory} className="text-[10px] text-slate-400 hover:text-red-500 transition-colors">Clear</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map(h => (
              <button key={h.code} onClick={() => { setIfscCode(h.code); lookupIFSC(h.code); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left">
                <span className="text-[10px] font-mono font-bold text-blue-600">{h.code}</span>
                <span className="text-[10px] text-slate-500">{h.bank} - {h.branch}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p>{error}</p>
            <p className="text-xs mt-1 text-red-500">Tips: Check for typos, ensure 5th character is 0, verify the code on your cheque book.</p>
          </div>
        </div>
      )}

      {/* Result */}
      {details && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Bank Header */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{details.BANK}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {details.BRANCH} Branch, {details.CITY || details.CENTRE}
                </p>
              </div>
              <button onClick={() => copyText(details.IFSC, 'ifsc')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${copied === 'ifsc'
                  ? 'bg-green-100 text-green-700 scale-105' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {copied === 'ifsc' ? <><Check className="w-3 h-3 inline mr-1" />Copied!</> : <><Copy className="w-3 h-3 inline mr-1" />{details.IFSC}</>}
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-700">
            {[
              { label: 'IFSC Code', value: details.IFSC, copyable: true },
              { label: 'MICR Code', value: details.MICR || 'N/A', copyable: !!details.MICR },
              { label: 'Branch', value: details.BRANCH },
              { label: 'Bank', value: details.BANK },
              { label: 'City', value: details.CITY || details.CENTRE },
              { label: 'District', value: details.DISTRICT },
              { label: 'State', value: details.STATE },
              { label: 'Address', value: details.ADDRESS },
              ...(details.CONTACT ? [{ label: 'Contact', value: details.CONTACT }] : []),
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <span className="text-xs text-slate-500 w-24 flex-shrink-0 pt-0.5">{row.label}</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1">{row.value}</span>
                {'copyable' in row && row.copyable && (
                  <button onClick={() => copyText(row.value, row.label)}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-1">
                    {copied === row.label ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Supported Services */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: 'NEFT', supported: details.NEFT, desc: 'Fund transfer', limit: 'No limit' },
              { name: 'RTGS', supported: details.RTGS, desc: 'Real-time', limit: 'Min ₹2L' },
              { name: 'IMPS', supported: details.IMPS, desc: 'Instant 24/7', limit: 'Up to ₹5L' },
              { name: 'UPI', supported: details.UPI, desc: 'UPI payments', limit: 'Up to ₹1L' },
            ].map(s => (
              <div key={s.name} className={`rounded-xl p-3 text-center border transition-all ${s.supported
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'}`}>
                <div className={`text-sm font-bold ${s.supported ? 'text-green-600' : 'text-slate-400'}`}>
                  {s.supported ? '✓' : '✗'} {s.name}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">{s.desc}</div>
                <div className="text-[8px] text-slate-400 mt-0.5">{s.limit}</div>
              </div>
            ))}
          </div>

          {/* Quick Copy All */}
          <button onClick={() => copyText(`Bank: ${details.BANK}\nBranch: ${details.BRANCH}\nIFSC: ${details.IFSC}\nMICR: ${details.MICR || 'N/A'}\nAddress: ${details.ADDRESS}\nCity: ${details.CITY || details.CENTRE}, ${details.STATE}`, 'all')}
            className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all ${copied === 'all' ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50'}`}>
            {copied === 'all' ? '✓ All Details Copied!' : 'Copy All Details'}
          </button>

          {/* Google Maps Link */}
          {details.ADDRESS && (
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(details.BANK + ' ' + details.BRANCH + ' ' + (details.CITY || details.CENTRE))}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <MapPin className="w-3 h-3" /> View on Google Maps <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">What is IFSC Code?</h4>
        <div className="grid md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-2">
            <p><strong>IFSC (Indian Financial System Code)</strong> is an 11-character alphanumeric code assigned by RBI to every bank branch in India. It is used for NEFT, RTGS, and IMPS fund transfers.</p>
            <p><strong>Format:</strong> First 4 characters = bank code, 5th character is always 0, last 6 characters = branch code. Example: SBIN0001234 (SBI, branch 001234).</p>
          </div>
          <div className="space-y-2">
            <p><strong>Where to find:</strong> IFSC code is printed on your cheque book, passbook, or bank account statement. You can also find it on your bank&apos;s website or net banking portal.</p>
            <p><strong>UPI & IFSC:</strong> While UPI uses VPA (Virtual Payment Address) for transfers, the underlying routing still uses IFSC codes to identify banks and branches.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
