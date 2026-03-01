'use client';
import { useState, useEffect } from 'react';
import { ArrowLeftRight, TrendingUp } from 'lucide-react';

interface BattingStats {
  matches: number;
  innings: number;
  runs: number;
  average: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
  highScore: string;
  fours: number;
  sixes: number;
}

interface BowlingStats {
  matches: number;
  wickets: number;
  economy: number;
  average: number;
  strikeRate: number;
  bestFigures: string;
}

interface Player {
  name: string;
  team: string;
  teamId: string;
  role: string;
  nationality: string;
  batting: BattingStats;
  bowling: BowlingStats;
}

interface StatsData {
  players: Player[];
}

const TEAM_COLORS: Record<string, string> = {
  csk: '#FDB913', mi: '#004C97', rcb: '#EC1C24', kkr: '#3A225D',
  dc: '#17479E', pbks: '#ED1B24', rr: '#EA1A85', srh: '#F26522',
  gt: '#1B2D61', lsg: '#A72B4E',
};

function StatRow({ label, v1, v2, higherIsBetter = true }: { label: string; v1: number; v2: number; higherIsBetter?: boolean }) {
  const better1 = higherIsBetter ? v1 > v2 : v1 < v2;
  const better2 = higherIsBetter ? v2 > v1 : v2 < v1;
  const equal = v1 === v2;

  return (
    <div className="flex items-center gap-2 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className={`flex-1 text-right text-sm font-semibold ${equal ? 'text-slate-700 dark:text-slate-300' : better1 ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-500'}`}>
        {v1 > 0 ? v1.toLocaleString() : '-'}
      </div>
      <div className="w-28 text-center text-xs text-slate-400 font-medium shrink-0">{label}</div>
      <div className={`flex-1 text-left text-sm font-semibold ${equal ? 'text-slate-700 dark:text-slate-300' : better2 ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-500'}`}>
        {v2 > 0 ? v2.toLocaleString() : '-'}
      </div>
    </div>
  );
}

function TextRow({ label, v1, v2 }: { label: string; v1: string; v2: string }) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex-1 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">{v1}</div>
      <div className="w-28 text-center text-xs text-slate-400 font-medium shrink-0">{label}</div>
      <div className="flex-1 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">{v2}</div>
    </div>
  );
}

export function IplPlayerComparisonTool() {
  const [data, setData] = useState<StatsData | null>(null);
  const [p1Name, setP1Name] = useState('Virat Kohli');
  const [p2Name, setP2Name] = useState('Rohit Sharma');

  useEffect(() => {
    fetch('/data/ipl-player-stats.json').then(r => r.json()).then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <div className="animate-spin w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full mr-3" />
        Loading player data...
      </div>
    );
  }

  const p1 = data.players.find(p => p.name === p1Name);
  const p2 = data.players.find(p => p.name === p2Name);

  const hasBowling1 = p1 && p1.bowling.wickets > 0;
  const hasBowling2 = p2 && p2.bowling.wickets > 0;
  const showBowling = hasBowling1 || hasBowling2;

  return (
    <div className="space-y-5">
      {/* Player selectors */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Player 1', value: p1Name, setter: setP1Name },
          { label: 'Player 2', value: p2Name, setter: setP2Name },
        ].map(({ label, value, setter }) => (
          <div key={label}>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              {label}
            </label>
            <select
              value={value}
              onChange={e => setter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {data.players.map(p => (
                <option key={p.name} value={p.name}>{p.name} ({p.team.split(' ').map(w => w[0]).join('')})</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {p1 && p2 && (
        <>
          {/* Player header cards */}
          <div className="grid grid-cols-2 gap-3">
            {[p1, p2].map(p => (
              <div
                key={p.name}
                className="rounded-xl p-3 text-white text-center"
                style={{ background: TEAM_COLORS[p.teamId] || '#374151' }}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 text-lg font-bold">
                  {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="font-heading font-bold text-sm leading-tight">{p.name}</div>
                <div className="text-white/80 text-xs mt-0.5">{p.team}</div>
                <div className="mt-2 flex justify-center gap-1 flex-wrap">
                  <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{p.role}</span>
                  <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{p.nationality}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button
              onClick={() => { const tmp = p1Name; setP1Name(p2Name); setP2Name(tmp); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-sm font-medium"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Swap Players
            </button>
          </div>

          {/* Batting comparison */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-heading font-semibold text-slate-700 dark:text-slate-300">Batting Stats (IPL Career)</h3>
            </div>
            <StatRow label="Matches" v1={p1.batting.matches} v2={p2.batting.matches} />
            <StatRow label="Runs" v1={p1.batting.runs} v2={p2.batting.runs} />
            <StatRow label="Average" v1={p1.batting.average} v2={p2.batting.average} />
            <StatRow label="Strike Rate" v1={p1.batting.strikeRate} v2={p2.batting.strikeRate} />
            <StatRow label="50s" v1={p1.batting.fifties} v2={p2.batting.fifties} />
            <StatRow label="100s" v1={p1.batting.hundreds} v2={p2.batting.hundreds} />
            <TextRow label="High Score" v1={p1.batting.highScore} v2={p2.batting.highScore} />
            <StatRow label="Fours" v1={p1.batting.fours} v2={p2.batting.fours} />
            <StatRow label="Sixes" v1={p1.batting.sixes} v2={p2.batting.sixes} />
          </div>

          {/* Bowling comparison */}
          {showBowling && (
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-heading font-semibold text-slate-700 dark:text-slate-300">Bowling Stats (IPL Career)</h3>
              </div>
              <StatRow label="Wickets" v1={p1.bowling.wickets} v2={p2.bowling.wickets} />
              <StatRow label="Economy" v1={p1.bowling.economy} v2={p2.bowling.economy} higherIsBetter={false} />
              <StatRow label="Average" v1={p1.bowling.average} v2={p2.bowling.average} higherIsBetter={false} />
              <StatRow label="Strike Rate" v1={p1.bowling.strikeRate} v2={p2.bowling.strikeRate} higherIsBetter={false} />
              <TextRow label="Best Figures" v1={p1.bowling.bestFigures} v2={p2.bowling.bestFigures} />
            </div>
          )}

          <p className="text-xs text-center text-slate-400">
            * Stats as of IPL 2025. Green = better value. Career IPL stats only.
          </p>
        </>
      )}
    </div>
  );
}
