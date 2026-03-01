'use client';

import { useState, useEffect, useCallback } from 'react';
import { Globe, Plus, X, Search, Clock, Sun, Moon, Sunset } from 'lucide-react';

interface CityEntry {
  id: string;
  name: string;
  country: string;
  timezone: string;
  isLocal?: boolean;
}

const ALL_CITIES: Omit<CityEntry, 'id'>[] = [
  { name: 'New York', country: 'USA', timezone: 'America/New_York' },
  { name: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  { name: 'Chicago', country: 'USA', timezone: 'America/Chicago' },
  { name: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
  { name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver' },
  { name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City' },
  { name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  { name: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires' },
  { name: 'London', country: 'UK', timezone: 'Europe/London' },
  { name: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  { name: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam' },
  { name: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid' },
  { name: 'Rome', country: 'Italy', timezone: 'Europe/Rome' },
  { name: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm' },
  { name: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw' },
  { name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow' },
  { name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul' },
  { name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { name: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh' },
  { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Delhi', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Bangalore', country: 'India', timezone: 'Asia/Kolkata' },
  { name: 'Karachi', country: 'Pakistan', timezone: 'Asia/Karachi' },
  { name: 'Dhaka', country: 'Bangladesh', timezone: 'Asia/Dhaka' },
  { name: 'Colombo', country: 'Sri Lanka', timezone: 'Asia/Colombo' },
  { name: 'Kathmandu', country: 'Nepal', timezone: 'Asia/Kathmandu' },
  { name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
  { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { name: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur' },
  { name: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta' },
  { name: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong' },
  { name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' },
  { name: 'Beijing', country: 'China', timezone: 'Asia/Shanghai' },
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul' },
  { name: 'Taipei', country: 'Taiwan', timezone: 'Asia/Taipei' },
  { name: 'Lahore', country: 'Pakistan', timezone: 'Asia/Karachi' },
  { name: 'Tashkent', country: 'Uzbekistan', timezone: 'Asia/Tashkent' },
  { name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo' },
  { name: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos' },
  { name: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi' },
  { name: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg' },
  { name: 'Casablanca', country: 'Morocco', timezone: 'Africa/Casablanca' },
  { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne' },
  { name: 'Perth', country: 'Australia', timezone: 'Australia/Perth' },
  { name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland' },
  { name: 'Honolulu', country: 'USA', timezone: 'Pacific/Honolulu' },
  { name: 'Anchorage', country: 'USA', timezone: 'America/Anchorage' },
];

function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getLocalCityName(tz: string): string {
  const match = ALL_CITIES.find(c => c.timezone === tz);
  return match ? match.name : tz.split('/').pop()?.replace(/_/g, ' ') || 'Local';
}

function getTimeInfo(timezone: string, now: Date) {
  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-US', { timeZone: timezone, ...opts }).format(now);

  const hour = parseInt(fmt({ hour: 'numeric', hour12: false }), 10);
  const time12 = fmt({ hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
  const time24 = fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const date = fmt({ weekday: 'short', month: 'short', day: 'numeric' });
  const year = fmt({ year: 'numeric' });

  const offset = new Intl.DateTimeFormat('en', { timeZone: timezone, timeZoneName: 'short' })
    .formatToParts(now)
    .find(p => p.type === 'timeZoneName')?.value || '';

  return { time12, time24, date, year, hour, offset };
}

type DayStatus = 'work' | 'early' | 'evening' | 'night';

function getDayStatus(hour: number): DayStatus {
  if (hour >= 9 && hour < 18) return 'work';
  if (hour >= 6 && hour < 9) return 'early';
  if (hour >= 18 && hour < 21) return 'evening';
  return 'night';
}

const STATUS_STYLES: Record<DayStatus, { bg: string; badge: string; icon: typeof Sun; label: string }> = {
  work:    { bg: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30',    badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',    icon: Sun,    label: 'Working hours' },
  early:   { bg: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30', badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400', icon: Sunset, label: 'Early morning' },
  evening: { bg: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400', icon: Sunset, label: 'Evening' },
  night:   { bg: 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50',    badge: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400',          icon: Moon,   label: 'Night time' },
};

const DEFAULT_CITIES: CityEntry[] = [
  { id: 'local', name: '', country: '', timezone: '', isLocal: true },
  { id: 'nyc', name: 'New York', country: 'USA', timezone: 'America/New_York' },
  { id: 'lon', name: 'London', country: 'UK', timezone: 'Europe/London' },
  { id: 'dxb', name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { id: 'mum', name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
  { id: 'tky', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
];

export function TimezoneCheckerTool() {
  const [cities, setCities] = useState<CityEntry[]>(() => {
    const localTz = getLocalTimezone();
    return DEFAULT_CITIES.map(c =>
      c.isLocal ? { ...c, name: getLocalCityName(localTz), country: 'Your Location', timezone: localTz } : c
    );
  });

  const [now, setNow] = useState(new Date());
  const [use24h, setUse24h] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const filteredCities = ALL_CITIES.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.timezone.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  const addCity = useCallback((city: Omit<CityEntry, 'id'>) => {
    const alreadyExists = cities.some(c => c.timezone === city.timezone && c.name === city.name);
    if (!alreadyExists) {
      setCities(prev => [...prev, { ...city, id: `${city.name}-${Date.now()}` }]);
    }
    setShowSearch(false);
    setSearchQuery('');
  }, [cities]);

  const removeCity = useCallback((id: string) => {
    setCities(prev => prev.filter(c => c.id !== id));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {cities.length} {cities.length === 1 ? 'city' : 'cities'} tracked
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* 12/24h toggle */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setUse24h(false)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${!use24h ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >12h</button>
            <button
              onClick={() => setUse24h(true)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${use24h ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >24h</button>
          </div>
          {/* Add city button */}
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add City
          </button>
        </div>
      </div>

      {/* Search overlay */}
      {showSearch && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-700 shadow-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search city or country..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => { setShowSearch(false); setSearchQuery(''); }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {filteredCities.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No cities found</p>
            ) : (
              filteredCities.map(city => {
                const info = getTimeInfo(city.timezone, now);
                return (
                  <button
                    key={`${city.name}-${city.timezone}`}
                    onClick={() => addCity(city)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left group"
                  >
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{city.name}</span>
                      <span className="text-gray-400 text-xs ml-2">{city.country}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
                        {use24h ? info.time24.slice(0, 5) : info.time12.replace(':00 ', ' ')}
                      </div>
                      <div className="text-xs text-gray-400">{info.offset}</div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* City cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map(city => {
          const info = getTimeInfo(city.timezone, now);
          const status = getDayStatus(info.hour);
          const style = STATUS_STYLES[status];
          const StatusIcon = style.icon;

          return (
            <div
              key={city.id}
              className={`relative rounded-xl border-2 p-5 transition-all ${style.bg} ${city.isLocal ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''}`}
            >
              {/* Remove button */}
              {!city.isLocal && (
                <button
                  onClick={() => removeCity(city.id)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:!opacity-100 shadow-sm transition-opacity border border-gray-200 dark:border-gray-600"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              )}

              {/* City name + badge */}
              <div className="flex items-start justify-between mb-3 pr-6">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{city.name}</h3>
                    {city.isLocal && (
                      <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 px-1.5 py-0.5 rounded font-medium">You</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{city.country}</p>
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${style.badge}`}>
                  <StatusIcon className="w-3 h-3" />
                  {style.label}
                </span>
              </div>

              {/* Time */}
              <div className="mb-2">
                <div className="text-3xl font-bold font-mono text-gray-900 dark:text-white tracking-tight">
                  {use24h ? info.time24 : info.time12}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {info.date}, {info.year}
                </div>
              </div>

              {/* Offset */}
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600/50">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">{info.offset} · {city.timezone}</span>
              </div>
            </div>
          );
        })}

        {/* Add city quick card */}
        <button
          onClick={() => setShowSearch(true)}
          className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-5 flex flex-col items-center justify-center gap-2 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all min-h-[160px] group"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <span className="text-sm text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium transition-colors">Add City</span>
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-full">Status Legend</p>
        {Object.entries(STATUS_STYLES).map(([key, val]) => {
          const Icon = val.icon;
          return (
            <div key={key} className="flex items-center gap-2">
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${val.badge}`}>
                <Icon className="w-3 h-3" />
                {val.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
