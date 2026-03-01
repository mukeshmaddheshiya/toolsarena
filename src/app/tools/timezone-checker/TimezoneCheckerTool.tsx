'use client';

import { useState, useEffect } from 'react';
import { Globe, Plus, X, Search, Clock, Copy, Check, Users } from 'lucide-react';

interface City {
  id: string;
  name: string;
  country: string;
  tz: string;
  isLocal?: boolean;
}

const ALL_CITIES: Omit<City, 'id'>[] = [
  // ── Americas ──
  { name: 'New York',        country: 'USA',              tz: 'America/New_York' },
  { name: 'Los Angeles',     country: 'USA',              tz: 'America/Los_Angeles' },
  { name: 'Chicago',         country: 'USA',              tz: 'America/Chicago' },
  { name: 'Denver',          country: 'USA',              tz: 'America/Denver' },
  { name: 'Phoenix',         country: 'USA',              tz: 'America/Phoenix' },
  { name: 'Miami',           country: 'USA',              tz: 'America/New_York' },
  { name: 'Seattle',         country: 'USA',              tz: 'America/Los_Angeles' },
  { name: 'Dallas',          country: 'USA',              tz: 'America/Chicago' },
  { name: 'Honolulu',        country: 'USA',              tz: 'Pacific/Honolulu' },
  { name: 'Anchorage',       country: 'USA',              tz: 'America/Anchorage' },
  { name: 'Toronto',         country: 'Canada',           tz: 'America/Toronto' },
  { name: 'Vancouver',       country: 'Canada',           tz: 'America/Vancouver' },
  { name: 'Montreal',        country: 'Canada',           tz: 'America/Toronto' },
  { name: 'Calgary',         country: 'Canada',           tz: 'America/Edmonton' },
  { name: 'Mexico City',     country: 'Mexico',           tz: 'America/Mexico_City' },
  { name: 'Havana',          country: 'Cuba',             tz: 'America/Havana' },
  { name: 'Bogotá',          country: 'Colombia',         tz: 'America/Bogota' },
  { name: 'Lima',            country: 'Peru',             tz: 'America/Lima' },
  { name: 'Caracas',         country: 'Venezuela',        tz: 'America/Caracas' },
  { name: 'São Paulo',       country: 'Brazil',           tz: 'America/Sao_Paulo' },
  { name: 'Rio de Janeiro',  country: 'Brazil',           tz: 'America/Sao_Paulo' },
  { name: 'Buenos Aires',    country: 'Argentina',        tz: 'America/Argentina/Buenos_Aires' },
  { name: 'Santiago',        country: 'Chile',            tz: 'America/Santiago' },
  { name: 'Montevideo',      country: 'Uruguay',          tz: 'America/Montevideo' },

  // ── Europe ──
  { name: 'London',          country: 'UK',               tz: 'Europe/London' },
  { name: 'Dublin',          country: 'Ireland',          tz: 'Europe/Dublin' },
  { name: 'Lisbon',          country: 'Portugal',         tz: 'Europe/Lisbon' },
  { name: 'Madrid',          country: 'Spain',            tz: 'Europe/Madrid' },
  { name: 'Paris',           country: 'France',           tz: 'Europe/Paris' },
  { name: 'Brussels',        country: 'Belgium',          tz: 'Europe/Brussels' },
  { name: 'Amsterdam',       country: 'Netherlands',      tz: 'Europe/Amsterdam' },
  { name: 'Berlin',          country: 'Germany',          tz: 'Europe/Berlin' },
  { name: 'Zurich',          country: 'Switzerland',      tz: 'Europe/Zurich' },
  { name: 'Vienna',          country: 'Austria',          tz: 'Europe/Vienna' },
  { name: 'Rome',            country: 'Italy',            tz: 'Europe/Rome' },
  { name: 'Milan',           country: 'Italy',            tz: 'Europe/Rome' },
  { name: 'Oslo',            country: 'Norway',           tz: 'Europe/Oslo' },
  { name: 'Stockholm',       country: 'Sweden',           tz: 'Europe/Stockholm' },
  { name: 'Copenhagen',      country: 'Denmark',          tz: 'Europe/Copenhagen' },
  { name: 'Helsinki',        country: 'Finland',          tz: 'Europe/Helsinki' },
  { name: 'Warsaw',          country: 'Poland',           tz: 'Europe/Warsaw' },
  { name: 'Prague',          country: 'Czech Republic',   tz: 'Europe/Prague' },
  { name: 'Budapest',        country: 'Hungary',          tz: 'Europe/Budapest' },
  { name: 'Bucharest',       country: 'Romania',          tz: 'Europe/Bucharest' },
  { name: 'Sofia',           country: 'Bulgaria',         tz: 'Europe/Sofia' },
  { name: 'Athens',          country: 'Greece',           tz: 'Europe/Athens' },
  { name: 'Belgrade',        country: 'Serbia',           tz: 'Europe/Belgrade' },
  { name: 'Kyiv',            country: 'Ukraine',          tz: 'Europe/Kyiv' },
  { name: 'Minsk',           country: 'Belarus',          tz: 'Europe/Minsk' },
  { name: 'Istanbul',        country: 'Turkey',           tz: 'Europe/Istanbul' },
  { name: 'Moscow',          country: 'Russia',           tz: 'Europe/Moscow' },
  { name: 'Saint Petersburg',country: 'Russia',           tz: 'Europe/Moscow' },

  // ── Middle East ──
  { name: 'Dubai',           country: 'UAE',              tz: 'Asia/Dubai' },
  { name: 'Abu Dhabi',       country: 'UAE',              tz: 'Asia/Dubai' },
  { name: 'Riyadh',          country: 'Saudi Arabia',     tz: 'Asia/Riyadh' },
  { name: 'Jeddah',          country: 'Saudi Arabia',     tz: 'Asia/Riyadh' },
  { name: 'Doha',            country: 'Qatar',            tz: 'Asia/Qatar' },
  { name: 'Kuwait City',     country: 'Kuwait',           tz: 'Asia/Kuwait' },
  { name: 'Muscat',          country: 'Oman',             tz: 'Asia/Muscat' },
  { name: 'Manama',          country: 'Bahrain',          tz: 'Asia/Bahrain' },
  { name: 'Beirut',          country: 'Lebanon',          tz: 'Asia/Beirut' },
  { name: 'Amman',           country: 'Jordan',           tz: 'Asia/Amman' },
  { name: 'Damascus',        country: 'Syria',            tz: 'Asia/Damascus' },
  { name: 'Tel Aviv',        country: 'Israel',           tz: 'Asia/Jerusalem' },
  { name: 'Baghdad',         country: 'Iraq',             tz: 'Asia/Baghdad' },
  { name: 'Tehran',          country: 'Iran',             tz: 'Asia/Tehran' },
  { name: 'Baku',            country: 'Azerbaijan',       tz: 'Asia/Baku' },
  { name: 'Tbilisi',         country: 'Georgia',          tz: 'Asia/Tbilisi' },
  { name: 'Yerevan',         country: 'Armenia',          tz: 'Asia/Yerevan' },

  // ── Central & South Asia ──
  { name: 'Kabul',           country: 'Afghanistan',      tz: 'Asia/Kabul' },
  { name: 'Tashkent',        country: 'Uzbekistan',       tz: 'Asia/Tashkent' },
  { name: 'Almaty',          country: 'Kazakhstan',       tz: 'Asia/Almaty' },
  { name: 'Bishkek',         country: 'Kyrgyzstan',       tz: 'Asia/Bishkek' },
  { name: 'Karachi',         country: 'Pakistan',         tz: 'Asia/Karachi' },
  { name: 'Lahore',          country: 'Pakistan',         tz: 'Asia/Karachi' },
  { name: 'Islamabad',       country: 'Pakistan',         tz: 'Asia/Karachi' },
  { name: 'Kathmandu',       country: 'Nepal',            tz: 'Asia/Kathmandu' },
  { name: 'Mumbai',          country: 'India',            tz: 'Asia/Kolkata' },
  { name: 'Delhi',           country: 'India',            tz: 'Asia/Kolkata' },
  { name: 'Bangalore',       country: 'India',            tz: 'Asia/Kolkata' },
  { name: 'Chennai',         country: 'India',            tz: 'Asia/Kolkata' },
  { name: 'Hyderabad',       country: 'India',            tz: 'Asia/Kolkata' },
  { name: 'Kolkata',         country: 'India',            tz: 'Asia/Kolkata' },
  { name: 'Dhaka',           country: 'Bangladesh',       tz: 'Asia/Dhaka' },
  { name: 'Colombo',         country: 'Sri Lanka',        tz: 'Asia/Colombo' },

  // ── East & Southeast Asia ──
  { name: 'Yangon',          country: 'Myanmar',          tz: 'Asia/Rangoon' },
  { name: 'Bangkok',         country: 'Thailand',         tz: 'Asia/Bangkok' },
  { name: 'Phnom Penh',      country: 'Cambodia',         tz: 'Asia/Phnom_Penh' },
  { name: 'Vientiane',       country: 'Laos',             tz: 'Asia/Vientiane' },
  { name: 'Ho Chi Minh City',country: 'Vietnam',          tz: 'Asia/Ho_Chi_Minh' },
  { name: 'Hanoi',           country: 'Vietnam',          tz: 'Asia/Bangkok' },
  { name: 'Kuala Lumpur',    country: 'Malaysia',         tz: 'Asia/Kuala_Lumpur' },
  { name: 'Singapore',       country: 'Singapore',        tz: 'Asia/Singapore' },
  { name: 'Jakarta',         country: 'Indonesia',        tz: 'Asia/Jakarta' },
  { name: 'Bali',            country: 'Indonesia',        tz: 'Asia/Makassar' },
  { name: 'Manila',          country: 'Philippines',      tz: 'Asia/Manila' },
  { name: 'Hong Kong',       country: 'China',            tz: 'Asia/Hong_Kong' },
  { name: 'Shanghai',        country: 'China',            tz: 'Asia/Shanghai' },
  { name: 'Beijing',         country: 'China',            tz: 'Asia/Shanghai' },
  { name: 'Taipei',          country: 'Taiwan',           tz: 'Asia/Taipei' },
  { name: 'Seoul',           country: 'South Korea',      tz: 'Asia/Seoul' },
  { name: 'Tokyo',           country: 'Japan',            tz: 'Asia/Tokyo' },
  { name: 'Osaka',           country: 'Japan',            tz: 'Asia/Tokyo' },
  { name: 'Ulaanbaatar',     country: 'Mongolia',         tz: 'Asia/Ulaanbaatar' },

  // ── Africa ──
  { name: 'Casablanca',      country: 'Morocco',          tz: 'Africa/Casablanca' },
  { name: 'Tunis',           country: 'Tunisia',          tz: 'Africa/Tunis' },
  { name: 'Algiers',         country: 'Algeria',          tz: 'Africa/Algiers' },
  { name: 'Tripoli',         country: 'Libya',            tz: 'Africa/Tripoli' },
  { name: 'Cairo',           country: 'Egypt',            tz: 'Africa/Cairo' },
  { name: 'Khartoum',        country: 'Sudan',            tz: 'Africa/Khartoum' },
  { name: 'Addis Ababa',     country: 'Ethiopia',         tz: 'Africa/Addis_Ababa' },
  { name: 'Nairobi',         country: 'Kenya',            tz: 'Africa/Nairobi' },
  { name: 'Kampala',         country: 'Uganda',           tz: 'Africa/Kampala' },
  { name: 'Dar es Salaam',   country: 'Tanzania',         tz: 'Africa/Dar_es_Salaam' },
  { name: 'Lagos',           country: 'Nigeria',          tz: 'Africa/Lagos' },
  { name: 'Accra',           country: 'Ghana',            tz: 'Africa/Accra' },
  { name: 'Abidjan',         country: 'Ivory Coast',      tz: 'Africa/Abidjan' },
  { name: 'Dakar',           country: 'Senegal',          tz: 'Africa/Dakar' },
  { name: 'Johannesburg',    country: 'South Africa',     tz: 'Africa/Johannesburg' },
  { name: 'Cape Town',       country: 'South Africa',     tz: 'Africa/Johannesburg' },
  { name: 'Harare',          country: 'Zimbabwe',         tz: 'Africa/Harare' },
  { name: 'Lusaka',          country: 'Zambia',           tz: 'Africa/Lusaka' },
  { name: 'Kinshasa',        country: 'DR Congo',         tz: 'Africa/Kinshasa' },

  // ── Oceania ──
  { name: 'Sydney',          country: 'Australia',        tz: 'Australia/Sydney' },
  { name: 'Melbourne',       country: 'Australia',        tz: 'Australia/Melbourne' },
  { name: 'Brisbane',        country: 'Australia',        tz: 'Australia/Brisbane' },
  { name: 'Perth',           country: 'Australia',        tz: 'Australia/Perth' },
  { name: 'Adelaide',        country: 'Australia',        tz: 'Australia/Adelaide' },
  { name: 'Auckland',        country: 'New Zealand',      tz: 'Pacific/Auckland' },
  { name: 'Suva',            country: 'Fiji',             tz: 'Pacific/Fiji' },
  { name: 'Guam',            country: 'Guam',             tz: 'Pacific/Guam' },
];

function getHour(tz: string, d: Date): number {
  if (!tz) return 0;
  const h = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).format(d));
  return isNaN(h) ? 0 : h % 24;
}

function fmtLive(tz: string, d: Date, h24: boolean): string {
  if (!tz) return '--:--:--';
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: !h24 }).format(d);
}

function fmtShort(tz: string, d: Date, h24: boolean): string {
  if (!tz) return '';
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: !h24 }).format(d);
}

function getOffsetStr(tz: string, d: Date): string {
  if (!tz) return '';
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
    .formatToParts(d).find(p => p.type === 'timeZoneName')?.value ?? '';
}

function fmtDay(tz: string, d: Date): string {
  if (!tz) return '';
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' }).format(d);
}

type Status = 'work' | 'early' | 'evening' | 'night';

function statusOf(h: number): Status {
  if (h >= 9 && h < 18) return 'work';
  if (h >= 6 && h < 9)  return 'early';
  if (h >= 18 && h < 22) return 'evening';
  return 'night';
}

// Column `col` (0-23) represents hour `col` in the reference city.
// Given reference city's current hour `refH`, compute what Date that column maps to.
function colToDate(col: number, now: Date, refH: number): Date {
  return new Date(now.getTime() + (col - refH) * 3_600_000);
}

function hLabel(c: number, h24: boolean): string {
  if (h24) return String(c).padStart(2, '0');
  if (c === 0) return '12a';
  if (c < 12) return `${c}a`;
  if (c === 12) return '12p';
  return `${c - 12}p`;
}

const CL: Record<Status, { bg: string; hov: string; text: string }> = {
  work:    { bg: 'bg-green-100 dark:bg-green-900/40',   hov: 'hover:bg-green-200 dark:hover:bg-green-800/60',   text: 'text-green-800 dark:text-green-300' },
  early:   { bg: 'bg-yellow-100 dark:bg-yellow-800/30', hov: 'hover:bg-yellow-200 dark:hover:bg-yellow-700/50', text: 'text-yellow-800 dark:text-yellow-300' },
  evening: { bg: 'bg-orange-100 dark:bg-orange-800/30', hov: 'hover:bg-orange-200 dark:hover:bg-orange-700/50', text: 'text-orange-800 dark:text-orange-300' },
  night:   { bg: 'bg-slate-100 dark:bg-slate-800/40',   hov: 'hover:bg-slate-200 dark:hover:bg-slate-700/60',  text: 'text-slate-500 dark:text-slate-400' },
};

const STATUS_DOT: Record<Status, string> = {
  work: 'bg-green-500', early: 'bg-yellow-500', evening: 'bg-orange-500', night: 'bg-slate-400',
};

const DEFAULT_CITIES: City[] = [
  { id: 'local', name: '', country: '', tz: '', isLocal: true },
  { id: 'nyc',   name: 'New York', country: 'USA',   tz: 'America/New_York' },
  { id: 'lon',   name: 'London',   country: 'UK',    tz: 'Europe/London' },
  { id: 'dxb',   name: 'Dubai',    country: 'UAE',   tz: 'Asia/Dubai' },
  { id: 'mum',   name: 'Mumbai',   country: 'India', tz: 'Asia/Kolkata' },
  { id: 'tky',   name: 'Tokyo',    country: 'Japan', tz: 'Asia/Tokyo' },
];

export function TimezoneCheckerTool() {
  const [cities, setCities] = useState<City[]>(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localName = ALL_CITIES.find(c => c.tz === tz)?.name
      ?? tz.split('/').pop()?.replace(/_/g, ' ')
      ?? 'Local';
    return DEFAULT_CITIES.map(c => c.isLocal ? { ...c, name: localName, country: 'Your Location', tz } : c);
  });

  const [now, setNow] = useState(new Date());
  const [use24h, setUse24h] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const refTz = cities[0]?.tz || 'UTC';
  const refH  = getHour(refTz, now);
  const COLS  = Array.from({ length: 24 }, (_, i) => i);

  // Columns where ALL cities are simultaneously in working hours (9–18)
  const overlapCols = COLS.filter(c => {
    if (cities.length < 2) return false;
    const d = colToDate(c, now, refH);
    return cities.every(city => statusOf(getHour(city.tz, d)) === 'work');
  });

  const foundCities = ALL_CITIES.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.tz.toLowerCase().includes(q);
  }).slice(0, 8);

  function addCity(c: Omit<City, 'id'>) {
    if (!cities.some(x => x.tz === c.tz && x.name === c.name)) {
      setCities(p => [...p, { ...c, id: `${c.name}-${Date.now()}` }]);
    }
    setShowSearch(false);
    setSearch('');
  }

  function removeCity(id: string) {
    setCities(p => p.filter(c => c.id !== id));
  }

  async function copyMeeting() {
    if (!overlapCols.length) return;
    const text = cities.map(city => {
      const s = fmtShort(city.tz, colToDate(overlapCols[0], now, refH), use24h);
      const e = fmtShort(city.tz, colToDate(overlapCols[overlapCols.length - 1] + 1, now, refH), use24h);
      return `${city.name}: ${s} – ${e}`;
    }).join('\n');
    await navigator.clipboard.writeText(`Best meeting times:\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="space-y-4">

      {/* ── Controls ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Globe className="w-4 h-4 text-primary-500" />
          {cities.length} cities tracked
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 text-xs">
            {(['12h', '24h'] as const).map(v => (
              <button key={v}
                onClick={() => setUse24h(v === '24h')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${(v === '24h') === use24h ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}
              >{v}</button>
            ))}
          </div>
          <button
            onClick={() => setShowSearch(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add City
          </button>
        </div>
      </div>

      {/* ── Search panel ── */}
      {showSearch && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-3">
          <div className="flex gap-2 mb-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search city or country…"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={() => { setShowSearch(false); setSearch(''); }}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-52 overflow-y-auto space-y-0.5">
            {foundCities.length === 0
              ? <p className="text-sm text-slate-400 text-center py-3">No cities found</p>
              : foundCities.map(city => (
                <button
                  key={`${city.name}-${city.tz}`}
                  onClick={() => addCity(city)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left transition-colors"
                >
                  <div>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{city.name}</span>
                    <span className="text-xs text-slate-400 ml-2">{city.country}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{fmtShort(city.tz, now, use24h)}</span>
                </button>
              ))
            }
          </div>
        </div>
      )}

      {/* ── Timeline grid ── */}
      <div
        className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900"
        onMouseLeave={() => setHoveredCol(null)}
      >
        <div className="overflow-x-auto">
          {/* min-width: 160px (left panel) + 24 × 36px (cells) = 1024px */}
          <div style={{ minWidth: '1024px' }}>

            {/* Hour header row */}
            <div className="flex border-b-2 border-slate-200 dark:border-slate-700">
              <div className="w-40 shrink-0 sticky left-0 z-20 bg-slate-50 dark:bg-slate-800/90 border-r border-slate-200 dark:border-slate-700 px-3 py-2 flex items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</span>
              </div>
              {COLS.map(c => {
                const isNow   = c === refH;
                const isOvlp  = overlapCols.includes(c);
                const isHov   = hoveredCol === c;
                return (
                  <div
                    key={c}
                    onMouseEnter={() => setHoveredCol(c)}
                    className={`w-9 shrink-0 flex flex-col items-center justify-end pb-1.5 pt-1 select-none cursor-default transition-colors
                      ${isNow   ? 'bg-primary-50 dark:bg-primary-950/60'
                      : isOvlp  ? 'bg-emerald-50 dark:bg-emerald-950/30'
                      : isHov   ? 'bg-slate-100 dark:bg-slate-800'
                      : 'bg-slate-50 dark:bg-slate-800/90'}
                    `}
                  >
                    <span className={`text-[10px] leading-none font-bold ${isNow ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'}`}>
                      {hLabel(c, use24h)}
                    </span>
                    {isNow && <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-0.5 shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* City rows */}
            {cities.map(city => {
              const liveTime  = fmtLive(city.tz, now, use24h);
              const offsetStr = getOffsetStr(city.tz, now);
              const dot       = STATUS_DOT[statusOf(getHour(city.tz, now))];
              return (
                <div key={city.id} className="flex border-b border-slate-100 dark:border-slate-800 last:border-0 group/row">

                  {/* Sticky city info panel */}
                  <div className="w-40 shrink-0 sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 px-3 py-2 relative flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">{city.name}</span>
                      {city.isLocal && (
                        <span className="shrink-0 text-[9px] font-bold bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-400 px-1 py-0.5 rounded uppercase">You</span>
                      )}
                    </div>
                    <div className="font-mono text-[11px] font-bold text-slate-900 dark:text-slate-100 leading-tight mt-0.5 tabular-nums">{liveTime}</div>
                    <div className="text-[9px] text-slate-400 leading-tight">{offsetStr} · {city.country}</div>
                    {!city.isLocal && (
                      <button
                        onClick={() => removeCity(city.id)}
                        className="absolute top-1.5 right-1.5 opacity-0 group-hover/row:opacity-100 p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-300 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Hour cells */}
                  {COLS.map(c => {
                    const d     = colToDate(c, now, refH);
                    const h     = getHour(city.tz, d);
                    const s     = statusOf(h);
                    const { bg, hov, text } = CL[s];
                    const isNow  = c === refH;
                    const isOvlp = overlapCols.includes(c);
                    const isHov  = hoveredCol === c;
                    return (
                      <div
                        key={c}
                        onMouseEnter={() => setHoveredCol(c)}
                        className={`w-9 shrink-0 h-14 relative flex flex-col items-center justify-center cursor-default transition-colors
                          ${bg} ${isHov ? hov : ''}
                          ${isNow  ? 'ring-2 ring-inset ring-primary-400 dark:ring-primary-500'
                          : isOvlp ? 'ring-1 ring-inset ring-emerald-300/70 dark:ring-emerald-600/50'
                          : ''}
                        `}
                      >
                        {isNow && <div className="absolute top-0 inset-x-0 h-0.5 bg-primary-500" />}
                        <span className={`text-xs font-bold leading-none ${text}`}>
                          {use24h
                            ? String(h).padStart(2, '0')
                            : (h === 0 ? '12' : h > 12 ? String(h - 12) : String(h))}
                        </span>
                        {!use24h && (
                          <span className={`text-[9px] leading-none mt-0.5 ${text} opacity-60`}>
                            {h < 12 ? 'am' : 'pm'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hover info bar */}
        {hoveredCol !== null && (
          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 px-4 py-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                When it&apos;s {hLabel(hoveredCol, use24h)} in {cities[0]?.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {cities.map(city => {
                const d   = colToDate(hoveredCol, now, refH);
                const t   = fmtShort(city.tz, d, use24h);
                const day = fmtDay(city.tz, d);
                return (
                  <div key={city.id} className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{city.name}:</span>
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">{t}</span>
                    <span className="text-[10px] text-slate-400">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Color legend ── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        {[
          { label: 'Working (9–18)',    cls: 'bg-green-200 dark:bg-green-800/70' },
          { label: 'Early morning',     cls: 'bg-yellow-200 dark:bg-yellow-700/60' },
          { label: 'Evening (18–22)',   cls: 'bg-orange-200 dark:bg-orange-700/60' },
          { label: 'Night',             cls: 'bg-slate-200 dark:bg-slate-700/50' },
        ].map(({ label, cls }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`inline-block w-3 h-3 rounded-sm ${cls}`} />
            <span className="text-slate-500 dark:text-slate-400">{label}</span>
          </span>
        ))}
        <span className="flex items-center gap-1.5 ml-auto">
          <span className="inline-block w-3 h-3 rounded-sm bg-primary-50 dark:bg-primary-950/40 ring-2 ring-primary-400 dark:ring-primary-500" />
          <span className="text-slate-500 dark:text-slate-400">Current hour</span>
        </span>
      </div>

      {/* ── Meeting Planner ── */}
      {cities.length >= 2 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">Meeting Planner</span>
            </div>
            {overlapCols.length > 0 && (
              <button
                onClick={copyMeeting}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                {copied
                  ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copied!</>
                  : <><Copy className="w-3.5 h-3.5" /> Copy times</>
                }
              </button>
            )}
          </div>

          {overlapCols.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-3">
              No common working hours found across all {cities.length} cities. Try removing a city to find overlapping windows.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{overlapCols.length}h</span> overlap — hours when all cities are between 9 AM – 6 PM
              </p>
              {cities.map(city => {
                const startDate = colToDate(overlapCols[0], now, refH);
                const endDate   = colToDate(overlapCols[overlapCols.length - 1] + 1, now, refH);
                const s = fmtShort(city.tz, startDate, use24h);
                const e = fmtShort(city.tz, endDate, use24h);
                return (
                  <div key={city.id} className="flex items-center gap-3">
                    <span className="w-24 text-xs font-medium text-slate-600 dark:text-slate-400 shrink-0 truncate">{city.name}</span>
                    <span className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-400">{s} – {e}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
