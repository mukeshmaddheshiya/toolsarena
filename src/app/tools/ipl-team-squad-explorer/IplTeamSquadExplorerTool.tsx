'use client';
import { useState, useEffect, useMemo } from 'react';
import { Users, Filter, Star } from 'lucide-react';

interface Player {
  name: string;
  role: string;
  nationality: string;
  price: string;
  status: string;
  isCapped: boolean;
}

interface Team {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  captain: string;
  coach: string;
  homeGround: string;
  purseUsed: string;
  players: Player[];
}

interface SquadsData {
  teams: Team[];
}

const ROLE_COLORS: Record<string, string> = {
  'Batter': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Bowler': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'All-rounder': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Wicket-keeper': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export function IplTeamSquadExplorerTool() {
  const [data, setData] = useState<SquadsData | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState('csk');
  const [roleFilter, setRoleFilter] = useState('All');
  const [natFilter, setNatFilter] = useState('All');

  useEffect(() => {
    fetch('/data/ipl-2026-squads.json').then(r => r.json()).then(setData);
  }, []);

  const team = useMemo(() => data?.teams.find(t => t.id === selectedTeamId), [data, selectedTeamId]);

  const filtered = useMemo(() => {
    if (!team) return [];
    return team.players.filter(p => {
      if (roleFilter !== 'All' && p.role !== roleFilter) return false;
      if (natFilter !== 'All' && p.nationality !== natFilter) return false;
      return true;
    });
  }, [team, roleFilter, natFilter]);

  if (!data) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <div className="animate-spin w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full mr-3" />
        Loading squads...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Team selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
          Select Team
        </label>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {data.teams.map(t => (
            <button
              key={t.id}
              onClick={() => { setSelectedTeamId(t.id); setRoleFilter('All'); setNatFilter('All'); }}
              className={`py-2 px-1 rounded-lg text-xs font-bold transition-all border-2 ${
                selectedTeamId === t.id
                  ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {t.shortName}
            </button>
          ))}
        </div>
      </div>

      {team && (
        <>
          {/* Team info card */}
          <div
            className="rounded-xl p-4 text-white"
            style={{ background: `linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor})` }}
          >
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-heading font-bold">{team.name}</h2>
                <p className="text-white/80 text-sm mt-0.5">{team.homeGround}</p>
              </div>
              <div className="text-right">
                <div className="text-white/70 text-xs">Purse Used</div>
                <div className="font-bold text-lg">{team.purseUsed}</div>
              </div>
            </div>
            <div className="flex gap-6 mt-3 text-sm">
              <div>
                <span className="text-white/70">Captain: </span>
                <span className="font-semibold">{team.captain}</span>
              </div>
              <div>
                <span className="text-white/70">Coach: </span>
                <span className="font-semibold">{team.coach}</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <Filter className="w-4 h-4 text-slate-400" />
            <div className="flex gap-1.5 flex-wrap">
              {['All', 'Batter', 'Bowler', 'All-rounder', 'Wicket-keeper'].map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    roleFilter === role
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 ml-auto">
              {['All', 'Indian', 'Overseas'].map(nat => (
                <button
                  key={nat}
                  onClick={() => setNatFilter(nat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    natFilter === nat
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {nat}
                </button>
              ))}
            </div>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Total Players', value: team.players.length },
              { label: 'Indian', value: team.players.filter(p => p.nationality === 'Indian').length },
              { label: 'Overseas', value: team.players.filter(p => p.nationality === 'Overseas').length },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center">
                <div className="text-2xl font-heading font-bold text-slate-900 dark:text-slate-100">{s.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Player list */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Squad ({filtered.length} players)
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {filtered.map((player, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-sm shrink-0">
                    {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{player.name}</span>
                      {player.name === team.captain && (
                        <Star className="w-3 h-3 text-yellow-500 shrink-0" fill="currentColor" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${ROLE_COLORS[player.role] || 'bg-slate-100 text-slate-600'}`}>
                        {player.role}
                      </span>
                      <span className="text-[10px] text-slate-400">{player.nationality}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{player.price}</div>
                    <div className={`text-[10px] font-medium ${player.status === 'Retained' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      {player.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
