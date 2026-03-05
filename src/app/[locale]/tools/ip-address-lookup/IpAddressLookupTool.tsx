'use client';
import { useState, useEffect } from 'react';
import { Globe, MapPin, Building, Wifi, Copy, Check, RefreshCw } from 'lucide-react';

interface IpInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  timezone?: string;
  postal?: string;
}

export function IpAddressLookupTool() {
  const [info, setInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lookupIp, setLookupIp] = useState('');

  const fetchIp = async (ip?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = ip ? `https://ipinfo.io/${ip}/json` : 'https://ipinfo.io/json';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch IP info');
      const data = await res.json();
      setInfo(data);
    } catch {
      setError('Could not fetch IP information. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchIp(); }, []);

  const handleCopy = async () => {
    if (!info?.ip) return;
    await navigator.clipboard.writeText(info.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLookup = () => {
    const trimmed = lookupIp.trim();
    if (trimmed) fetchIp(trimmed);
    else fetchIp();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Main IP display */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-center text-white">
        <p className="text-sm opacity-80 mb-2">Your Public IP Address</p>
        {loading ? (
          <div className="h-12 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin opacity-60" />
          </div>
        ) : error ? (
          <p className="text-lg">{error}</p>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl sm:text-4xl font-mono font-bold tracking-wider">{info?.ip}</p>
              <button onClick={handleCopy} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors" title="Copy IP">
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {info?.org && <p className="text-sm opacity-70 mt-2">{info.org}</p>}
          </>
        )}
      </div>

      {/* Lookup different IP */}
      <div className="flex gap-2">
        <input type="text" value={lookupIp} onChange={(e) => setLookupIp(e.target.value)}
          placeholder="Look up a different IP address..."
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm" />
        <button onClick={handleLookup}
          className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-sm font-medium transition-colors">
          Lookup
        </button>
      </div>

      {/* Details */}
      {info && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: MapPin, label: 'Location', value: [info.city, info.region, info.country].filter(Boolean).join(', ') },
            { icon: Globe, label: 'Country', value: info.country },
            { icon: Building, label: 'Region', value: info.region },
            { icon: MapPin, label: 'City', value: info.city },
            { icon: Globe, label: 'Timezone', value: info.timezone },
            { icon: MapPin, label: 'Coordinates', value: info.loc },
            { icon: MapPin, label: 'Postal Code', value: info.postal },
            { icon: Wifi, label: 'ISP/Org', value: info.org },
          ].filter(item => item.value).map(item => (
            <div key={item.label} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700">
              <item.icon className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
        <strong>Privacy note:</strong> This tool uses the ipinfo.io API to look up your IP details. Your IP address is sent to their servers for the lookup. No data is stored by ToolsArena.
      </div>
    </div>
  );
}
