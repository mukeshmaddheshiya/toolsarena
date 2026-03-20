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
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">World Clock</h2>
            <p className="text-xs text-gray-500">Current time in major cities worldwide</p>
          </div>
        </div>
        <button
          onClick={() => setUse24hr(v => !v)}
          className="text-xs border border-gray-300 hover:border-blue-400 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          Switch to {use24hr ? '12-hour' : '24-hour'}
        </button>
      </div>

      {/* Local time hero card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Your Local Time</p>
            <p className="text-4xl sm:text-5xl font-black tracking-tight font-mono">{localTime}</p>
            <p className="text-blue-200 text-sm mt-2">{localDate}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <Clock className="w-8 h-8 text-blue-300 mb-2 ml-auto" />
            <p className="text-blue-200 text-xs">{localTZ}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search city or country..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-gray-500 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-yellow-500" /> Daytime (6AM-8PM local)
        </span>
        <span className="flex items-center gap-1.5">
          <Moon className="w-3.5 h-3.5 text-blue-400" /> Nighttime
        </span>
        <span className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> Favorited
        </span>
      </div>

      {/* City grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map(cityConfig => {
          const { time, date, hour, utcOffset } = getTimeInZone(cityConfig.timezone, use24hr);
          const daytime = isDaytime(hour);
          const isFav = favorites.includes(cityConfig.city);

          const cardBase = 'relative rounded-xl border p-4 transition-all ';
          const cardStyle = daytime
            ? cardBase + 'bg-white border-gray-200 shadow-sm'
            : cardBase + 'bg-slate-900 border-slate-700';

          const cityNameStyle = 'font-bold text-sm leading-tight truncate ' + (daytime ? 'text-gray-900' : 'text-white');
          const countryStyle = 'text-xs truncate ' + (daytime ? 'text-gray-400' : 'text-slate-400');
          const timeStyle = 'text-2xl font-black font-mono tracking-tight ' + (daytime ? 'text-gray-900' : 'text-white');
          const dateStyle = 'text-xs mt-0.5 ' + (daytime ? 'text-gray-500' : 'text-slate-400');
          const footerBorder = 'flex items-center justify-between mt-3 pt-3 border-t ' + (daytime ? 'border-gray-100' : 'border-slate-700');
          const abbrevStyle = 'text-xs font-semibold ' + (daytime ? 'text-blue-600' : 'text-blue-400');
          const offsetStyle = 'text-xs ' + (daytime ? 'text-gray-400' : 'text-slate-500');
          const starStyle = 'w-4 h-4 ' + (isFav ? 'fill-yellow-400 text-yellow-400' : daytime ? 'text-gray-300 hover:text-yellow-400' : 'text-slate-600 hover:text-yellow-400');

          return (
            <div key={cityConfig.city + '-' + cityConfig.timezone} className={cardStyle}>
              <button
                onClick={() => toggleFavorite(cityConfig.city)}
                className="absolute top-3 right-3 transition-colors"
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={starStyle} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                {daytime ? (
                  <Sun className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                )}
                <div className="min-w-0 pr-6">
                  <p className={cityNameStyle}>{cityConfig.city}</p>
                  <p className={countryStyle}>{cityConfig.country}</p>
                </div>
              </div>

              <p className={timeStyle}>{time}</p>
              <p className={dateStyle}>{date}</p>

              <div className={footerBorder}>
                <span className={abbrevStyle}>{cityConfig.abbreviation}</span>
                <span className={offsetStyle}>{utcOffset}</span>
              </div>
            </div>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Globe className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="font-medium">No cities match your search.</p>
          <p className="text-sm mt-1">Try a different city or country name.</p>
        </div>
      )}
    </div>
  );
}
