'use client';

import { useState, useEffect } from 'react';
import { Globe, Sun, Moon, Star, Search, Clock } from 'lucide-react';

interface CityConfig {
  city: string;
  country: string;
  timezone: string;
  abbreviation: string;
}

const CITIES: CityConfig[] = [
  { city: 'New York', country: 'United States', timezone: 'America/New_York', abbreviation: 'EST/EDT' },
  { city: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
  { city: 'Chicago', country: 'United States', timezone: 'America/Chicago', abbreviation: 'CST/CDT' },
  { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', abbreviation: 'EST/EDT' },
  { city: 'Sao Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', abbreviation: 'BRT' },
  { city: 'London', country: 'United Kingdom', timezone: 'Europe/London', abbreviation: 'GMT/BST' },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris', abbreviation: 'CET/CEST' },
  { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', abbreviation: 'CET/CEST' },
  { city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', abbreviation: 'MSK' },
  { city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', abbreviation: 'TRT' },
  { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', abbreviation: 'EET' },
  { city: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi', abbreviation: 'EAT' },
  { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', abbreviation: 'GST' },
  { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', abbreviation: 'IST' },
  { city: 'Delhi', country: 'India', timezone: 'Asia/Kolkata', abbreviation: 'IST' },
  { city: 'Kathmandu', country: 'Nepal', timezone: 'Asia/Kathmandu', abbreviation: 'NPT' },
  { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', abbreviation: 'ICT' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', abbreviation: 'SGT' },
  { city: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', abbreviation: 'WIB' },
  { city: 'Beijing', country: 'China', timezone: 'Asia/Shanghai', abbreviation: 'CST' },
  { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', abbreviation: 'KST' },
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', abbreviation: 'JST' },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', abbreviation: 'AEDT/AEST' },
];

const FAVORITES_KEY = 'toolsarena_world_clock_favorites';

function getTimeInZone(
  timezone: string,
  use24hr: boolean
): { time: string; date: string; hour: number; utcOffset: string } {
  const now = new Date();

  const time = now.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !use24hr,
  });

  const date = now.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const hourStr = now.toLocaleString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false,
  });
  const hour = parseInt(hourStr, 10) % 24;

  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const diffMinutes = Math.round((tzDate.getTime() - utcDate.getTime()) / 60000);
  const sign = diffMinutes >= 0 ? '+' : '-';
  const absMin = Math.abs(diffMinutes);
  const h = Math.floor(absMin / 60);
  const m = absMin % 60;
  const utcOffset = 'UTC' + sign + h + (m > 0 ? ':' + String(m).padStart(2, '0') : '');

  return { time, date, hour, utcOffset };
}

function isDaytime(hour: number): boolean {
  return hour >= 6 && hour < 20;
}

export function WorldClockTool() {
  const [, setTick] = useState(0);
  const [use24hr, setUse24hr] = useState(false);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites, loaded]);

  function toggleFavorite(city: string) {
    setFavorites(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  }

  const localTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !use24hr,
  });
  const localDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const filtered = CITIES.filter(
    c =>
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aFav = favorites.includes(a.city) ? 0 : 1;
    const bFav = favorites.includes(b.city) ? 0 : 1;
    return aFav - bFav;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">World Clock</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Current time in major cities worldwide</p>
          </div>
        </div>
        <button
          onClick={() => setUse24hr(v => !v)}
          className="text-xs border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          Switch to {use24hr ? '12-hour' : '24-hour'}
        </button>
      </div>

      {/* Local time hero card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <p className="text-blue-200 text-sm font-medium mb-1">Your Local Time</p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-mono truncate">{localTime}</p>
            <p className="text-blue-200 text-xs sm:text-sm mt-2 truncate">{localDate}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300 mb-2 ml-auto" />
            <p className="text-blue-200 text-xs max-w-[100px] sm:max-w-none truncate">{localTZ}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search city or country..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 sm:gap-5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-yellow-500" /> Daytime
        </span>
        <span className="flex items-center gap-1.5">
          <Moon className="w-3.5 h-3.5 text-blue-400" /> Nighttime
        </span>
        <span className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> Favorited
        </span>
      </div>

      {/* City grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {sorted.map(cityConfig => {
          const { time, date, hour, utcOffset } = getTimeInZone(cityConfig.timezone, use24hr);
          const daytime = isDaytime(hour);
          const isFav = favorites.includes(cityConfig.city);

          return (
            <div
              key={cityConfig.city + '-' + cityConfig.timezone}
              className={`relative rounded-xl border p-3 sm:p-4 transition-all ${
                daytime
                  ? 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 shadow-sm'
                  : 'bg-slate-900 dark:bg-slate-900 border-slate-700'
              }`}
            >
              <button
                onClick={() => toggleFavorite(cityConfig.city)}
                className="absolute top-3 right-3 transition-colors"
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`w-4 h-4 ${
                  isFav
                    ? 'fill-yellow-400 text-yellow-400'
                    : daytime
                      ? 'text-slate-300 dark:text-slate-500 hover:text-yellow-400'
                      : 'text-slate-600 hover:text-yellow-400'
                }`} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                {daytime ? (
                  <Sun className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                )}
                <div className="min-w-0 pr-6">
                  <p className={`font-bold text-sm leading-tight truncate ${daytime ? 'text-slate-900 dark:text-white' : 'text-white'}`}>
                    {cityConfig.city}
                  </p>
                  <p className={`text-xs truncate ${daytime ? 'text-slate-400 dark:text-slate-400' : 'text-slate-400'}`}>
                    {cityConfig.country}
                  </p>
                </div>
              </div>

              <p className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${daytime ? 'text-slate-900 dark:text-white' : 'text-white'}`}>
                {time}
              </p>
              <p className={`text-xs mt-0.5 ${daytime ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400'}`}>
                {date}
              </p>

              <div className={`flex items-center justify-between mt-3 pt-3 border-t ${daytime ? 'border-slate-100 dark:border-slate-700' : 'border-slate-700'}`}>
                <span className={`text-xs font-semibold ${daytime ? 'text-blue-600 dark:text-blue-400' : 'text-blue-400'}`}>
                  {cityConfig.abbreviation}
                </span>
                <span className={`text-xs ${daytime ? 'text-slate-400 dark:text-slate-500' : 'text-slate-500'}`}>
                  {utcOffset}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <Globe className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="font-medium">No cities match your search.</p>
          <p className="text-sm mt-1">Try a different city or country name.</p>
        </div>
      )}
    </div>
  );
}
