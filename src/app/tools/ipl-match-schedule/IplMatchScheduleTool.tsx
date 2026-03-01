'use client';
import { useState, useEffect, useMemo } from 'react';
import { Calendar, MapPin, Clock, ChevronDown } from 'lucide-react';

interface Match {
  id: number;
  date: string;
  time: string;
  team1: string;
  team2: string;
  venue: string;
  city: string;
  matchType?: string;
}

interface ScheduleData {
  matches: Match[];
}

const TEAM_SHORT: Record<string, string> = {
  'Chennai Super Kings': 'CSK',
  'Mumbai Indians': 'MI',
  'Royal Challengers Bengaluru': 'RCB',
  'Kolkata Knight Riders': 'KKR',
  'Delhi Capitals': 'DC',
  'Punjab Kings': 'PBKS',
  'Rajasthan Royals': 'RR',
  'Sunrisers Hyderabad': 'SRH',
  'Gujarat Titans': 'GT',
  'Lucknow Super Giants': 'LSG',
};

const TEAM_COLORS: Record<string, string> = {
  CSK: '#FDB913', MI: '#004C97', RCB: '#EC1C24', KKR: '#3A225D',
  DC: '#17479E', PBKS: '#ED1B24', RR: '#EA1A85', SRH: '#F26522',
  GT: '#1B2D61', LSG: '#A72B4E',
};

const ALL_TEAMS = ['All Teams', 'CSK', 'MI', 'RCB', 'KKR', 'DC', 'PBKS', 'RR', 'SRH', 'GT', 'LSG'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function getMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function IplMatchScheduleTool() {
  const [data, setData] = useState<ScheduleData | null>(null);
  const [teamFilter, setTeamFilter] = useState('All Teams');
  const [showCount, setShowCount] = useState(14);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetch('/data/ipl-2026-schedule.json').then(r => r.json()).then(setData);
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (teamFilter === 'All Teams') return data.matches;
    return data.matches.filter(m => {
      const t1 = TEAM_SHORT[m.team1] || m.team1;
      const t2 = TEAM_SHORT[m.team2] || m.team2;
      return t1 === teamFilter || t2 === teamFilter;
    });
  }, [data, teamFilter]);

  const upcoming = filtered.filter(m => m.date >= today);
  const past = filtered.filter(m => m.date < today);

  if (!data) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <div className="animate-spin w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full mr-3" />
        Loading schedule...
      </div>
    );
  }

  const displayed = filtered.slice(0, showCount);

  // Group by month
  const groups: Record<string, Match[]> = {};
  displayed.forEach(m => {
    const month = getMonth(m.date);
    if (!groups[month]) groups[month] = [];
    groups[month].push(m);
  });

  return (
    <div className="space-y-5">
      {/* Stats banner */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Total Matches', value: data.matches.length, color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' },
          { label: 'Upcoming', value: upcoming.length, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
          { label: 'Completed', value: past.length, color: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
            <div className="text-2xl font-heading font-bold">{s.value}</div>
            <div className="text-xs font-medium mt-0.5 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Team filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
          Filter by Team
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TEAMS.map(t => (
            <button
              key={t}
              onClick={() => { setTeamFilter(t); setShowCount(14); }}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
                teamFilter === t
                  ? 'border-orange-400 bg-orange-500 text-white'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Match list by month groups */}
      {Object.entries(groups).map(([month, matches]) => (
        <div key={month}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-heading font-semibold text-slate-700 dark:text-slate-300">{month}</h3>
          </div>
          <div className="space-y-2">
            {matches.map(match => {
              const t1Short = TEAM_SHORT[match.team1] || match.team1;
              const t2Short = TEAM_SHORT[match.team2] || match.team2;
              const isPast = match.date < today;
              const isToday = match.date === today;
              return (
                <div
                  key={match.id}
                  className={`rounded-xl border p-3 transition-colors ${
                    isToday
                      ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/10'
                      : isPast
                      ? 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 opacity-60'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:border-orange-300 dark:hover:border-orange-700'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Date & time */}
                    <div className="text-xs text-slate-500 dark:text-slate-400 w-20 shrink-0">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{formatDate(match.date)}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {match.time}
                      </div>
                    </div>

                    {/* Teams */}
                    <div className="flex-1 flex items-center justify-center gap-3">
                      <span
                        className="font-heading font-bold text-sm px-2 py-0.5 rounded"
                        style={{ background: `${TEAM_COLORS[t1Short]}20`, color: TEAM_COLORS[t1Short] }}
                      >
                        {t1Short}
                      </span>
                      <span className="text-xs font-bold text-slate-400">vs</span>
                      <span
                        className="font-heading font-bold text-sm px-2 py-0.5 rounded"
                        style={{ background: `${TEAM_COLORS[t2Short]}20`, color: TEAM_COLORS[t2Short] }}
                      >
                        {t2Short}
                      </span>
                    </div>

                    {/* Venue */}
                    <div className="text-right text-xs text-slate-500 dark:text-slate-400 shrink-0 max-w-[140px]">
                      <div className="flex items-center gap-1 justify-end">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{match.city}</span>
                      </div>
                      {match.matchType && (
                        <div className="mt-0.5 font-semibold text-orange-600 dark:text-orange-400">{match.matchType}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Load more */}
      {showCount < filtered.length && (
        <button
          onClick={() => setShowCount(c => c + 14)}
          className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:border-orange-300 hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
        >
          <ChevronDown className="w-4 h-4" />
          Load more matches ({filtered.length - showCount} remaining)
        </button>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-10 text-slate-400 text-sm">No matches found for selected team.</div>
      )}
    </div>
  );
}
