'use client';
import { useState, useEffect } from 'react';
import { Trophy, Info } from 'lucide-react';

interface Standing {
  pos: number;
  teamId: string;
  team: string;
  shortName: string;
  played: number;
  won: number;
  lost: number;
  nrr: number;
  points: number;
  form: string[];
}

interface TableData {
  season: string;
  seasonStart: string;
  lastUpdated: string;
  status: string;
  standings: Standing[];
}

const TEAM_COLORS: Record<string, string> = {
  csk: '#FDB913', mi: '#004C97', rcb: '#EC1C24', kkr: '#3A225D',
  dc: '#17479E', pbks: '#ED1B24', rr: '#EA1A85', srh: '#F26522',
  gt: '#1B2D61', lsg: '#A72B4E',
};

const TEAM_BG: Record<string, string> = {
  csk: 'from-yellow-400 to-yellow-600',
  mi: 'from-blue-700 to-blue-900',
  rcb: 'from-red-600 to-red-800',
  kkr: 'from-purple-700 to-purple-900',
  dc: 'from-blue-500 to-blue-700',
  pbks: 'from-red-500 to-red-700',
  rr: 'from-pink-500 to-pink-700',
  srh: 'from-orange-500 to-orange-700',
  gt: 'from-blue-800 to-blue-900',
  lsg: 'from-rose-700 to-rose-900',
};

export function IplPointsTableTool() {
  const [data, setData] = useState<TableData | null>(null);

  useEffect(() => {
    fetch('/data/ipl-2026-points-table.json').then(r => r.json()).then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <div className="animate-spin w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full mr-3" />
        Loading points table...
      </div>
    );
  }

  const seasonStart = new Date(data.seasonStart);
  const isPreSeason = data.status === 'pre-season';

  return (
    <div className="space-y-5">
      {/* Season header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-orange-500" />
          <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">{data.season} Points Table</h2>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Last updated: {new Date(data.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Pre-season banner */}
      {isPreSeason && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-orange-700 dark:text-orange-400 text-sm">Season Not Started Yet</div>
            <div className="text-orange-600 dark:text-orange-500 text-xs mt-0.5">
              IPL 2026 begins on {seasonStart.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}. The points table will update live once matches begin.
            </div>
          </div>
        </div>
      )}

      {/* Top 4 info */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 py-2">
        <span className="inline-block w-3 h-3 rounded-sm bg-green-500 shrink-0" />
        Top 4 qualify for playoffs
        <span className="inline-block w-3 h-3 rounded-sm bg-blue-500 shrink-0 ml-3" />
        Top 2 get direct final entry
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-700">
              <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">#</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Team</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">P</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">W</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">L</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">NRR</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Pts</th>
            </tr>
          </thead>
          <tbody>
            {data.standings.map((row, i) => (
              <tr
                key={row.teamId}
                className={`border-b border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  i < 2 ? 'bg-blue-50/50 dark:bg-blue-900/10' : i < 4 ? 'bg-green-50/50 dark:bg-green-900/10' : ''
                }`}
              >
                <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-300">{row.pos}</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                      style={{ background: TEAM_COLORS[row.teamId] || '#374151' }}
                    >
                      {row.shortName.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{row.team}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-300 font-medium">{row.played}</td>
                <td className="py-3 px-3 text-center text-green-600 dark:text-green-400 font-semibold">{row.won}</td>
                <td className="py-3 px-3 text-center text-red-600 dark:text-red-400 font-semibold">{row.lost}</td>
                <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400 font-medium">
                  {row.nrr === 0 ? '0.000' : row.nrr > 0 ? `+${row.nrr.toFixed(3)}` : row.nrr.toFixed(3)}
                </td>
                <td className="py-3 px-3 text-center font-heading font-bold text-slate-900 dark:text-slate-100 text-base">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {data.standings.map((row, i) => (
          <div
            key={row.teamId}
            className={`rounded-xl border p-3 ${
              i < 2
                ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
                : i < 4
                ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-xl font-heading font-bold text-slate-500 dark:text-slate-400 w-6 text-center">{row.pos}</div>
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${TEAM_BG[row.teamId]} flex items-center justify-center text-white text-xs font-bold shrink-0`}
              >
                {row.shortName}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{row.team}</div>
                <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>P: <b>{row.played}</b></span>
                  <span className="text-green-600 dark:text-green-400">W: <b>{row.won}</b></span>
                  <span className="text-red-600 dark:text-red-400">L: <b>{row.lost}</b></span>
                  <span>NRR: <b>{row.nrr === 0 ? '0.000' : row.nrr > 0 ? `+${row.nrr.toFixed(3)}` : row.nrr.toFixed(3)}</b></span>
                </div>
              </div>
              <div className="text-2xl font-heading font-bold text-slate-900 dark:text-slate-100">{row.points}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="text-xs text-slate-400 text-center">
        P = Played · W = Won · L = Lost · NRR = Net Run Rate · Pts = Points
      </div>
    </div>
  );
}
