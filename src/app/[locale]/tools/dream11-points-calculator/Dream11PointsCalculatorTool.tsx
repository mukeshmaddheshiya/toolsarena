'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Trophy, RotateCcw, Sparkles, ChevronDown, ChevronUp,
  Users, Target, Shield, Zap, Star, Award, ArrowRightLeft,
} from 'lucide-react';

type Format = 'T20' | 'ODI' | 'Test';
type Role = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper';

interface PlayerStats {
  runs: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  wickets: number;
  oversBowled: number;
  maidens: number;
  dotBalls: number;
  catches: number;
  stumpings: number;
  runOutDirect: number;
  runOutIndirect: number;
  isCaptain: boolean;
  isViceCaptain: boolean;
}

interface PointBreakdown {
  label: string;
  value: number;
  detail: string;
}

const DEFAULT_STATS: PlayerStats = {
  runs: 0, ballsFaced: 0, fours: 0, sixes: 0,
  wickets: 0, oversBowled: 0, maidens: 0, dotBalls: 0,
  catches: 0, stumpings: 0, runOutDirect: 0, runOutIndirect: 0,
  isCaptain: false, isViceCaptain: false,
};

const VIRAT_EXAMPLE: PlayerStats = {
  runs: 82, ballsFaced: 53, fours: 7, sixes: 4,
  wickets: 0, oversBowled: 0, maidens: 0, dotBalls: 0,
  catches: 1, stumpings: 0, runOutDirect: 0, runOutIndirect: 0,
  isCaptain: true, isViceCaptain: false,
};

function calculatePoints(stats: PlayerStats, format: Format, role: Role): PointBreakdown[] {
  const breakdown: PointBreakdown[] = [];
  const add = (label: string, value: number, detail: string) => {
    if (value !== 0) breakdown.push({ label, value, detail });
  };

  // Playing XI
  add('Playing XI', 4, 'Part of starting XI');

  // --- BATTING ---
  if (stats.runs > 0) add('Runs Scored', stats.runs * 1, `${stats.runs} runs x 1`);
  if (stats.fours > 0) add('Boundary Bonus', stats.fours * 1, `${stats.fours} fours x 1`);
  if (stats.sixes > 0) add('Six Bonus', stats.sixes * 2, `${stats.sixes} sixes x 2`);

  // Half-century and century bonuses
  if (format === 'T20') {
    if (stats.runs >= 100) add('Century Bonus', 16, '100+ runs');
    else if (stats.runs >= 50) add('Half-Century Bonus', 8, '50+ runs');
    if (stats.runs >= 30 && stats.runs < 50) add('30-Run Bonus', 4, '30+ runs');
  } else {
    if (stats.runs >= 100) add('Century Bonus', 8, '100+ runs');
    else if (stats.runs >= 50) add('Half-Century Bonus', 4, '50+ runs');
  }

  // Duck penalty (only for batsman, all-rounder, wk)
  const isDuck = stats.runs === 0 && stats.ballsFaced > 0 &&
    (role === 'Batsman' || role === 'All-Rounder' || role === 'Wicket-Keeper');
  if (isDuck) {
    const duckPenalty = format === 'T20' ? -2 : format === 'ODI' ? -3 : -4;
    add('Duck Penalty', duckPenalty, `Out for 0 (${format})`);
  }

  // Strike rate bonus/penalty
  if (stats.ballsFaced > 0) {
    const sr = (stats.runs / stats.ballsFaced) * 100;
    if (format === 'T20' && stats.ballsFaced >= 10) {
      if (sr > 170) add('Strike Rate Bonus', 6, `SR ${sr.toFixed(1)} (>170)`);
      else if (sr >= 150) add('Strike Rate Bonus', 4, `SR ${sr.toFixed(1)} (150-170)`);
      else if (sr >= 130) add('Strike Rate Bonus', 2, `SR ${sr.toFixed(1)} (130-150)`);
      else if (sr >= 60 && sr < 70) add('Strike Rate Penalty', -2, `SR ${sr.toFixed(1)} (60-70)`);
      else if (sr >= 50 && sr < 60) add('Strike Rate Penalty', -4, `SR ${sr.toFixed(1)} (50-60)`);
      else if (sr < 50) add('Strike Rate Penalty', -6, `SR ${sr.toFixed(1)} (<50)`);
    } else if (format === 'ODI' && stats.ballsFaced >= 20) {
      if (sr > 140) add('Strike Rate Bonus', 6, `SR ${sr.toFixed(1)} (>140)`);
      else if (sr >= 120) add('Strike Rate Bonus', 4, `SR ${sr.toFixed(1)} (120-140)`);
      else if (sr >= 100) add('Strike Rate Bonus', 2, `SR ${sr.toFixed(1)} (100-120)`);
      else if (sr >= 50 && sr < 60) add('Strike Rate Penalty', -2, `SR ${sr.toFixed(1)} (50-60)`);
      else if (sr >= 40 && sr < 50) add('Strike Rate Penalty', -4, `SR ${sr.toFixed(1)} (40-50)`);
      else if (sr < 40) add('Strike Rate Penalty', -6, `SR ${sr.toFixed(1)} (<40)`);
    }
  }

  // --- BOWLING ---
  if (stats.wickets > 0) {
    const wicketPts = format === 'Test' ? 16 : 25;
    add('Wickets', stats.wickets * wicketPts, `${stats.wickets} wkt x ${wicketPts}`);
  }

  if (format === 'T20') {
    if (stats.wickets >= 5) add('5-Wicket Haul Bonus', 16, '5+ wickets');
    else if (stats.wickets >= 4) add('4-Wicket Haul Bonus', 8, '4 wickets');
    else if (stats.wickets >= 3) add('3-Wicket Haul Bonus', 4, '3 wickets');
  } else if (format === 'ODI') {
    if (stats.wickets >= 5) add('5-Wicket Haul Bonus', 8, '5+ wickets');
    else if (stats.wickets >= 4) add('4-Wicket Haul Bonus', 4, '4 wickets');
  } else {
    if (stats.wickets >= 5) add('5-Wicket Haul Bonus', 8, '5+ wickets');
    else if (stats.wickets >= 4) add('4-Wicket Haul Bonus', 4, '4 wickets');
  }

  if (stats.maidens > 0) {
    const maidenPts = format === 'T20' ? 12 : format === 'ODI' ? 4 : 0;
    if (maidenPts > 0) add('Maidens', stats.maidens * maidenPts, `${stats.maidens} maiden x ${maidenPts}`);
  }

  // Economy rate bonus/penalty
  if (stats.oversBowled >= (format === 'T20' ? 2 : 5)) {
    const runsConceded = stats.oversBowled > 0
      ? (stats.runs > 0 ? 0 : 0) // We need a separate field for runs conceded
      : 0;
    // Economy = runs conceded / overs. We calculate from dot balls and overs.
    // Actually, we need runs conceded. Let's compute from: total balls = overs * 6, economy = runsConceded / overs
    // Since we don't have runs conceded directly, we'll derive from economy
    // We'll add a runsConceeded calculation based on available data
    // For simplicity, let's calculate economy from dot balls proportion
    // Actually, let's just use the oversBowled and a derived economy
    // We need to add runs conceded - but it's not in the stats. Let me compute economy differently.
    // The user enters overs bowled; we need runs conceded for economy. Let me add that.
    // For now, skip economy - we'll handle it via a separate input (runsConceded).
  }

  // --- FIELDING ---
  if (stats.catches > 0) add('Catches', stats.catches * 8, `${stats.catches} catch x 8`);
  if (stats.stumpings > 0) add('Stumpings', stats.stumpings * 12, `${stats.stumpings} stumping x 12`);
  if (stats.runOutDirect > 0) add('Run-Out (Direct)', stats.runOutDirect * 12, `${stats.runOutDirect} x 12`);
  if (stats.runOutIndirect > 0) add('Run-Out (Indirect)', stats.runOutIndirect * 6, `${stats.runOutIndirect} x 6`);

  return breakdown;
}

function calculateEconomyPoints(runsConceded: number, oversBowled: number, format: Format): PointBreakdown | null {
  if (oversBowled <= 0) return null;
  const minOvers = format === 'T20' ? 2 : 5;
  if (oversBowled < minOvers) return null;

  const economy = runsConceded / oversBowled;

  if (format === 'T20') {
    if (economy < 5) return { label: 'Economy Rate Bonus', value: 6, detail: `Eco ${economy.toFixed(2)} (<5)` };
    if (economy < 6) return { label: 'Economy Rate Bonus', value: 4, detail: `Eco ${economy.toFixed(2)} (5-5.99)` };
    if (economy <= 7) return { label: 'Economy Rate Bonus', value: 2, detail: `Eco ${economy.toFixed(2)} (6-7)` };
    if (economy > 10 && economy <= 11) return { label: 'Economy Rate Penalty', value: -2, detail: `Eco ${economy.toFixed(2)} (10-11)` };
    if (economy > 11 && economy <= 12) return { label: 'Economy Rate Penalty', value: -4, detail: `Eco ${economy.toFixed(2)} (11-12)` };
    if (economy > 12) return { label: 'Economy Rate Penalty', value: -6, detail: `Eco ${economy.toFixed(2)} (>12)` };
  } else if (format === 'ODI') {
    if (economy < 2.5) return { label: 'Economy Rate Bonus', value: 6, detail: `Eco ${economy.toFixed(2)} (<2.5)` };
    if (economy < 3.5) return { label: 'Economy Rate Bonus', value: 4, detail: `Eco ${economy.toFixed(2)} (2.5-3.5)` };
    if (economy <= 4.5) return { label: 'Economy Rate Bonus', value: 2, detail: `Eco ${economy.toFixed(2)} (3.5-4.5)` };
    if (economy > 7 && economy <= 8) return { label: 'Economy Rate Penalty', value: -2, detail: `Eco ${economy.toFixed(2)} (7-8)` };
    if (economy > 8 && economy <= 9) return { label: 'Economy Rate Penalty', value: -4, detail: `Eco ${economy.toFixed(2)} (8-9)` };
    if (economy > 9) return { label: 'Economy Rate Penalty', value: -6, detail: `Eco ${economy.toFixed(2)} (>9)` };
  }
  return null;
}

const FORMATS: Format[] = ['T20', 'ODI', 'Test'];
const ROLES: { value: Role; icon: typeof Target }[] = [
  { value: 'Batsman', icon: Target },
  { value: 'Bowler', icon: Zap },
  { value: 'All-Rounder', icon: Star },
  { value: 'Wicket-Keeper', icon: Shield },
];

function InputField({
  label, value, onChange, min = 0, max = 999, step = 1,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Math.max(min, Number(e.target.value) || 0))}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
      />
    </div>
  );
}

interface PlayerPanelProps {
  label: string;
  stats: PlayerStats;
  setStats: (s: PlayerStats) => void;
  runsConceded: number;
  setRunsConceded: (v: number) => void;
  format: Format;
  role: Role;
  setRole: (r: Role) => void;
  breakdown: PointBreakdown[];
  totalPoints: number;
}

function PlayerPanel({
  label, stats, setStats, runsConceded, setRunsConceded,
  format, role, setRole, breakdown, totalPoints,
}: PlayerPanelProps) {
  const update = (key: keyof PlayerStats, value: number | boolean) =>
    setStats({ ...stats, [key]: value });

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3">
        <h3 className="text-white font-bold text-lg">{label}</h3>
      </div>

      <div className="p-4 space-y-5">
        {/* Role Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Player Role</label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map(r => {
              const Icon = r.icon;
              return (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    role === r.value
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {r.value}
                </button>
              );
            })}
          </div>
        </div>

        {/* Captain / VC Toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => update('isCaptain', !stats.isCaptain)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all border-2 ${
              stats.isCaptain
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
            }`}
          >
            C (2x)
          </button>
          <button
            onClick={() => update('isViceCaptain', !stats.isViceCaptain)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all border-2 ${
              stats.isViceCaptain
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
            }`}
          >
            VC (1.5x)
          </button>
        </div>

        {/* Batting Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-500" /> Batting
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Runs Scored" value={stats.runs} onChange={v => update('runs', v)} />
            <InputField label="Balls Faced" value={stats.ballsFaced} onChange={v => update('ballsFaced', v)} />
            <InputField label="Fours (4s)" value={stats.fours} onChange={v => update('fours', v)} />
            <InputField label="Sixes (6s)" value={stats.sixes} onChange={v => update('sixes', v)} />
          </div>
        </div>

        {/* Bowling Section */}
        {format !== 'Test' || role !== 'Batsman' ? (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" /> Bowling
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Wickets" value={stats.wickets} onChange={v => update('wickets', v)} />
              <InputField label="Overs Bowled" value={stats.oversBowled} onChange={v => update('oversBowled', v)} step={0.1} />
              <InputField label="Maidens" value={stats.maidens} onChange={v => update('maidens', v)} />
              <InputField label="Runs Conceded" value={runsConceded} onChange={setRunsConceded} />
            </div>
          </div>
        ) : null}

        {/* Fielding Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-500" /> Fielding
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Catches" value={stats.catches} onChange={v => update('catches', v)} />
            <InputField label="Stumpings" value={stats.stumpings} onChange={v => update('stumpings', v)} />
            <InputField label="Run-Out (Direct)" value={stats.runOutDirect} onChange={v => update('runOutDirect', v)} />
            <InputField label="Run-Out (Indirect)" value={stats.runOutIndirect} onChange={v => update('runOutIndirect', v)} />
          </div>
        </div>

        {/* Points Breakdown */}
        {breakdown.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" /> Points Breakdown
            </h4>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Component</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {breakdown.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-3 py-2">
                        <span className="text-gray-800 dark:text-gray-200">{item.label}</span>
                        <span className="block text-xs text-gray-400 dark:text-gray-500">{item.detail}</span>
                      </td>
                      <td className={`px-3 py-2 text-right font-semibold ${
                        item.value > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                      }`}>
                        {item.value > 0 ? '+' : ''}{item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Total Points */}
        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-center">
          <p className="text-orange-100 text-xs font-medium uppercase tracking-wider mb-1">Total Fantasy Points</p>
          <p className="text-white text-4xl font-black">{totalPoints.toFixed(1)}</p>
          {(stats.isCaptain || stats.isViceCaptain) && (
            <p className="text-orange-100 text-xs mt-1">
              {stats.isCaptain ? 'Captain (2x)' : 'Vice-Captain (1.5x)'} applied
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Dream11PointsCalculatorTool() {
  const [format, setFormat] = useState<Format>('T20');
  const [compareMode, setCompareMode] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const [role1, setRole1] = useState<Role>('Batsman');
  const [stats1, setStats1] = useState<PlayerStats>({ ...DEFAULT_STATS });
  const [runsConceded1, setRunsConceded1] = useState(0);

  const [role2, setRole2] = useState<Role>('Bowler');
  const [stats2, setStats2] = useState<PlayerStats>({ ...DEFAULT_STATS });
  const [runsConceded2, setRunsConceded2] = useState(0);

  const computeTotal = useCallback((stats: PlayerStats, role: Role, runsConceded: number) => {
    const breakdown = calculatePoints(stats, format, role);
    const ecoPts = calculateEconomyPoints(runsConceded, stats.oversBowled, format);
    if (ecoPts) breakdown.push(ecoPts);
    const base = breakdown.reduce((sum, b) => sum + b.value, 0);
    const multiplier = stats.isCaptain ? 2 : stats.isViceCaptain ? 1.5 : 1;
    return { breakdown, total: base * multiplier };
  }, [format]);

  const result1 = useMemo(() => computeTotal(stats1, role1, runsConceded1), [stats1, role1, runsConceded1, computeTotal]);
  const result2 = useMemo(() => computeTotal(stats2, role2, runsConceded2), [stats2, role2, runsConceded2, computeTotal]);

  const handleReset = () => {
    setStats1({ ...DEFAULT_STATS });
    setStats2({ ...DEFAULT_STATS });
    setRunsConceded1(0);
    setRunsConceded2(0);
    setRole1('Batsman');
    setRole2('Bowler');
  };

  const handleExample = () => {
    setFormat('T20');
    setRole1('Batsman');
    setStats1({ ...VIRAT_EXAMPLE });
    setRunsConceded1(0);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-6 md:p-8 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Trophy className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Dream11 Fantasy Points Calculator</h2>
        <p className="text-orange-100 text-sm md:text-base max-w-2xl mx-auto">
          Calculate exact Dream11 fantasy cricket points for any player. Supports T20, ODI, and Test formats with all bonus and penalty rules.
        </p>
      </div>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Format Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
          {FORMATS.map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                format === f
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              compareMode
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            Compare
          </button>
          <button
            onClick={handleExample}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Try Example
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Player Panels */}
      <div className={`grid gap-6 ${compareMode ? 'md:grid-cols-2' : 'grid-cols-1 max-w-xl mx-auto'}`}>
        <PlayerPanel
          label={compareMode ? 'Player 1' : 'Player Stats'}
          stats={stats1}
          setStats={setStats1}
          runsConceded={runsConceded1}
          setRunsConceded={setRunsConceded1}
          format={format}
          role={role1}
          setRole={setRole1}
          breakdown={result1.breakdown}
          totalPoints={result1.total}
        />
        {compareMode && (
          <PlayerPanel
            label="Player 2"
            stats={stats2}
            setStats={setStats2}
            runsConceded={runsConceded2}
            setRunsConceded={setRunsConceded2}
            format={format}
            role={role2}
            setRole={setRole2}
            breakdown={result2.breakdown}
            totalPoints={result2.total}
          />
        )}
      </div>

      {/* Compare Result */}
      {compareMode && (result1.total > 0 || result2.total > 0) && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Comparison Result</p>
          <div className="flex items-center justify-center gap-4 text-2xl font-black">
            <span className={result1.total >= result2.total ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
              {result1.total.toFixed(1)}
            </span>
            <span className="text-gray-300 dark:text-gray-600">vs</span>
            <span className={result2.total >= result1.total ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
              {result2.total.toFixed(1)}
            </span>
          </div>
          {result1.total !== result2.total && (
            <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold mt-2">
              {result1.total > result2.total ? 'Player 1' : 'Player 2'} wins by{' '}
              {Math.abs(result1.total - result2.total).toFixed(1)} points
            </p>
          )}
        </div>
      )}

      {/* Scoring Rules Reference */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <button
          onClick={() => setShowRules(!showRules)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
        >
          <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            Dream11 Scoring Rules ({format})
          </span>
          {showRules ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {showRules && (
          <div className="px-5 pb-5 space-y-4">
            {/* Batting Rules */}
            <div>
              <h4 className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-2">Batting</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">Playing XI</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+4</td></tr>
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">Per Run</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+1</td></tr>
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">Boundary (4)</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+1</td></tr>
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">Six (6)</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+2</td></tr>
                    {format === 'T20' && <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">30 Runs Bonus</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+4</td></tr>}
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">Half-Century</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+{format === 'T20' ? 8 : 4}</td></tr>
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">Century</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+{format === 'T20' ? 16 : 8}</td></tr>
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">Duck</td><td className="py-1.5 text-right font-semibold text-red-500">{format === 'T20' ? -2 : format === 'ODI' ? -3 : -4}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bowling Rules */}
            <div>
              <h4 className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-2">Bowling</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">Per Wicket</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+{format === 'Test' ? 16 : 25}</td></tr>
                    {format === 'T20' && <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">3-Wicket Haul</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+4</td></tr>}
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">4-Wicket Haul</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+{format === 'T20' ? 8 : 4}</td></tr>
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">5-Wicket Haul</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+{format === 'T20' ? 16 : 8}</td></tr>
                    {format !== 'Test' && <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">Maiden Over</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+{format === 'T20' ? 12 : 4}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fielding Rules */}
            <div>
              <h4 className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-2">Fielding</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">Catch</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+8</td></tr>
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">Stumping</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+12</td></tr>
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">Run-Out (Direct)</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+12</td></tr>
                    <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">Run-Out (Indirect)</td><td className="py-1.5 text-right font-semibold text-gray-800 dark:text-gray-200">+6</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strike Rate Rules */}
            {format !== 'Test' && (
              <div>
                <h4 className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-2">
                  Strike Rate Bonus/Penalty (min {format === 'T20' ? '10' : '20'} balls)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {format === 'T20' ? (
                        <>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">&gt;170</td><td className="py-1.5 text-right font-semibold text-green-600">+6</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">150-170</td><td className="py-1.5 text-right font-semibold text-green-600">+4</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">130-150</td><td className="py-1.5 text-right font-semibold text-green-600">+2</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">60-70</td><td className="py-1.5 text-right font-semibold text-red-500">-2</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">50-60</td><td className="py-1.5 text-right font-semibold text-red-500">-4</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">&lt;50</td><td className="py-1.5 text-right font-semibold text-red-500">-6</td></tr>
                        </>
                      ) : (
                        <>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">&gt;140</td><td className="py-1.5 text-right font-semibold text-green-600">+6</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">120-140</td><td className="py-1.5 text-right font-semibold text-green-600">+4</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">100-120</td><td className="py-1.5 text-right font-semibold text-green-600">+2</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">50-60</td><td className="py-1.5 text-right font-semibold text-red-500">-2</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">40-50</td><td className="py-1.5 text-right font-semibold text-red-500">-4</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">&lt;40</td><td className="py-1.5 text-right font-semibold text-red-500">-6</td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Economy Rate Rules */}
            {format !== 'Test' && (
              <div>
                <h4 className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-2">
                  Economy Rate Bonus/Penalty (min {format === 'T20' ? '2' : '5'} overs)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {format === 'T20' ? (
                        <>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">&lt;5</td><td className="py-1.5 text-right font-semibold text-green-600">+6</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">5-5.99</td><td className="py-1.5 text-right font-semibold text-green-600">+4</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">6-7</td><td className="py-1.5 text-right font-semibold text-green-600">+2</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">10-11</td><td className="py-1.5 text-right font-semibold text-red-500">-2</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">11-12</td><td className="py-1.5 text-right font-semibold text-red-500">-4</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">&gt;12</td><td className="py-1.5 text-right font-semibold text-red-500">-6</td></tr>
                        </>
                      ) : (
                        <>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">&lt;2.5</td><td className="py-1.5 text-right font-semibold text-green-600">+6</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">2.5-3.5</td><td className="py-1.5 text-right font-semibold text-green-600">+4</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">3.5-4.5</td><td className="py-1.5 text-right font-semibold text-green-600">+2</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">7-8</td><td className="py-1.5 text-right font-semibold text-red-500">-2</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">8-9</td><td className="py-1.5 text-right font-semibold text-red-500">-4</td></tr>
                          <tr><td className="py-1.5 text-gray-600 dark:text-gray-400">&gt;9</td><td className="py-1.5 text-right font-semibold text-red-500">-6</td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
