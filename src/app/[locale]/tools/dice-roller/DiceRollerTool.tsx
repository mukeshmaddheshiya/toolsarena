'use client';
import { useState, useCallback } from 'react';

const DICE = [
  { sides: 4, label: 'D4' }, { sides: 6, label: 'D6' }, { sides: 8, label: 'D8' },
  { sides: 10, label: 'D10' }, { sides: 12, label: 'D12' }, { sides: 20, label: 'D20' }, { sides: 100, label: 'D100' },
];

const D6_DOTS: Record<number, string> = { 1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅' };

interface RollResult { dice: number[]; total: number; modifier: number; sides: number; timestamp: number }

export function DiceRollerTool() {
  const [selectedDice, setSelectedDice] = useState(6);
  const [numDice, setNumDice] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<RollResult[]>([]);

  const roll = useCallback(() => {
    setIsRolling(true);
    setTimeout(() => {
      const dice: number[] = [];
      for (let i = 0; i < numDice; i++) dice.push(Math.floor(Math.random() * selectedDice) + 1);
      setResults(dice);
      const total = dice.reduce((s, d) => s + d, 0);
      setHistory(prev => [{ dice, total, modifier, sides: selectedDice, timestamp: Date.now() }, ...prev].slice(0, 20));
      setIsRolling(false);
    }, 400);
  }, [selectedDice, numDice, modifier]);

  const total = results.reduce((s, d) => s + d, 0);
  const finalTotal = total + modifier;
  const allRolls = history.flatMap(h => h.dice);
  const stats = allRolls.length > 0 ? {
    avg: (allRolls.reduce((s, d) => s + d, 0) / allRolls.length).toFixed(1),
    min: Math.min(...allRolls), max: Math.max(...allRolls), count: history.length,
  } : null;

  const presets = [
    { label: '1d20', sides: 20, num: 1, mod: 0 },
    { label: '2d6', sides: 6, num: 2, mod: 0 },
    { label: '3d8+5', sides: 8, num: 3, mod: 5 },
    { label: '1d100', sides: 100, num: 1, mod: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Dice Type Selector */}
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Dice Type</label>
        <div className="flex flex-wrap gap-2">
          {DICE.map(d => (
            <button key={d.sides} onClick={() => setSelectedDice(d.sides)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedDice === d.sides
                ? 'bg-primary-700 text-white shadow-lg scale-105' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-400'}`}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Number of Dice</label>
          <div className="flex items-center mt-1 gap-2">
            <button onClick={() => setNumDice(Math.max(1, numDice - 1))} className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-lg hover:bg-slate-200 dark:hover:bg-slate-600">−</button>
            <input type="number" value={numDice} min={1} max={10} onChange={e => setNumDice(Math.min(10, Math.max(1, +e.target.value || 1)))}
              className="w-16 text-center px-2 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100" />
            <button onClick={() => setNumDice(Math.min(10, numDice + 1))} className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-lg hover:bg-slate-200 dark:hover:bg-slate-600">+</button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Modifier</label>
          <div className="flex items-center mt-1 gap-2">
            <button onClick={() => setModifier(modifier - 1)} className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-lg hover:bg-slate-200 dark:hover:bg-slate-600">−</button>
            <input type="number" value={modifier} onChange={e => setModifier(+e.target.value || 0)}
              className="w-16 text-center px-2 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100" />
            <button onClick={() => setModifier(modifier + 1)} className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-lg hover:bg-slate-200 dark:hover:bg-slate-600">+</button>
          </div>
        </div>
        <div className="flex items-end">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Range: {numDice}{modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''} to {numDice * selectedDice}{modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 self-center">Presets:</span>
        {presets.map(p => (
          <button key={p.label} onClick={() => { setSelectedDice(p.sides); setNumDice(p.num); setModifier(p.mod); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            {p.label}
          </button>
        ))}
      </div>

      {/* Roll Button */}
      <div className="text-center">
        <button onClick={roll} disabled={isRolling}
          className={`px-10 py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-900 shadow-lg transition-all ${isRolling ? 'scale-95 opacity-70' : 'hover:scale-105 hover:shadow-xl'}`}>
          {isRolling ? 'Rolling...' : `Roll ${numDice}D${selectedDice}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {results.map((d, i) => (
              <div key={i} className={`w-16 h-16 rounded-xl bg-white/15 flex items-center justify-center font-bold text-2xl transition-all ${isRolling ? 'animate-bounce' : ''} ${d === 1 ? 'ring-2 ring-red-400' : d === selectedDice ? 'ring-2 ring-yellow-400' : ''}`}>
                {selectedDice === 6 && D6_DOTS[d] ? <span className="text-3xl">{D6_DOTS[d]}</span> : d}
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="text-sm text-emerald-200">Total</div>
            <div className="text-4xl font-heading font-bold">
              {total}{modifier !== 0 && <span className="text-2xl text-emerald-300"> {modifier > 0 ? '+' : ''}{modifier} = {finalTotal}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Statistics ({stats.count} rolls)</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><div className="text-xs text-slate-500 dark:text-slate-400">Average</div><div className="text-lg font-bold text-slate-900 dark:text-slate-100">{stats.avg}</div></div>
            <div><div className="text-xs text-slate-500 dark:text-slate-400">Min Rolled</div><div className="text-lg font-bold text-red-600 dark:text-red-400">{stats.min}</div></div>
            <div><div className="text-xs text-slate-500 dark:text-slate-400">Max Rolled</div><div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.max}</div></div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Roll History</h3>
            <button onClick={() => { setHistory([]); setResults([]); }} className="text-xs text-red-500 hover:text-red-700">Clear</button>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {history.map((h, i) => (
              <div key={h.timestamp} className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-slate-500 dark:text-slate-400">#{history.length - i}</span>
                <span className="text-slate-600 dark:text-slate-300">{h.dice.length}d{h.sides}: [{h.dice.join(', ')}]</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{h.total + h.modifier}{h.modifier !== 0 && <span className="text-xs text-slate-400"> ({h.modifier > 0 ? '+' : ''}{h.modifier})</span>}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
