'use client';
import { useState, useCallback } from 'react';

type Result = 'heads' | 'tails';

export function CoinFlipTool() {
  const [result, setResult] = useState<Result | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [history, setHistory] = useState<Result[]>([]);
  const [bulkResults, setBulkResults] = useState<{ heads: number; tails: number } | null>(null);

  const flip = useCallback((count = 1) => {
    setIsFlipping(true);
    setBulkResults(null);
    setTimeout(() => {
      if (count === 1) {
        const r: Result = Math.random() < 0.5 ? 'heads' : 'tails';
        setResult(r);
        setHistory(prev => [r, ...prev].slice(0, 50));
        setBulkResults(null);
      } else {
        let heads = 0, tails = 0;
        const newHistory: Result[] = [];
        for (let i = 0; i < count; i++) {
          const r: Result = Math.random() < 0.5 ? 'heads' : 'tails';
          r === 'heads' ? heads++ : tails++;
          newHistory.push(r);
        }
        setResult(newHistory[0]);
        setHistory(prev => [...newHistory, ...prev].slice(0, 50));
        setBulkResults({ heads, tails });
      }
      setIsFlipping(false);
    }, 600);
  }, []);

  const totalFlips = history.length;
  const totalHeads = history.filter(h => h === 'heads').length;
  const totalTails = totalFlips - totalHeads;
  const headsPct = totalFlips > 0 ? ((totalHeads / totalFlips) * 100).toFixed(1) : '0';
  const tailsPct = totalFlips > 0 ? ((totalTails / totalFlips) * 100).toFixed(1) : '0';

  // Streak
  let currentStreak = 0, longestStreak = 0, streak = 0;
  if (history.length > 0) {
    let prev = history[0];
    streak = 1;
    currentStreak = 1;
    let isCurrentStreak = true;
    for (let i = 1; i < history.length; i++) {
      if (history[i] === prev) { streak++; if (isCurrentStreak) currentStreak++; }
      else { longestStreak = Math.max(longestStreak, streak); streak = 1; prev = history[i]; isCurrentStreak = false; }
    }
    longestStreak = Math.max(longestStreak, streak);
  }

  return (
    <div className="space-y-6">
      {/* Coin */}
      <div className="flex flex-col items-center">
        <div className={`w-44 h-44 rounded-full flex items-center justify-center text-5xl font-heading font-bold shadow-2xl transition-all duration-500 select-none ${
          isFlipping ? 'animate-spin' : ''} ${
          result === 'heads' ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-amber-900' :
          result === 'tails' ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-slate-800' :
          'bg-gradient-to-br from-amber-300 to-yellow-500 text-amber-800'}`}>
          {isFlipping ? '?' : result === 'heads' ? 'H' : result === 'tails' ? 'T' : '?'}
        </div>
        {result && !isFlipping && (
          <div className={`mt-4 text-2xl font-bold ${result === 'heads' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'}`}>
            {result === 'heads' ? 'HEADS!' : 'TAILS!'}
          </div>
        )}
      </div>

      {/* Flip Button */}
      <div className="text-center">
        <button onClick={() => flip(1)} disabled={isFlipping}
          className={`px-10 py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-lg transition-all ${isFlipping ? 'scale-95 opacity-70' : 'hover:scale-105 hover:shadow-xl'}`}>
          {isFlipping ? 'Flipping...' : 'Flip Coin'}
        </button>
      </div>

      {/* Bulk Flip */}
      <div className="flex flex-wrap justify-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 self-center">Flip multiple:</span>
        {[5, 10, 50, 100].map(n => (
          <button key={n} onClick={() => flip(n)} disabled={isFlipping}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50">
            {n}×
          </button>
        ))}
      </div>

      {/* Bulk Results */}
      {bulkResults && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Batch Results</h3>
          <div className="grid grid-cols-2 gap-4 text-center mb-3">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{bulkResults.heads}</div>
              <div className="text-xs text-amber-600 dark:text-amber-400">Heads ({((bulkResults.heads / (bulkResults.heads + bulkResults.tails)) * 100).toFixed(1)}%)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">{bulkResults.tails}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Tails ({((bulkResults.tails / (bulkResults.heads + bulkResults.tails)) * 100).toFixed(1)}%)</div>
            </div>
          </div>
          <div className="h-4 rounded-full overflow-hidden flex">
            <div className="bg-amber-500 transition-all" style={{ width: `${(bulkResults.heads / (bulkResults.heads + bulkResults.tails)) * 100}%` }} />
            <div className="bg-slate-400 flex-1" />
          </div>
        </div>
      )}

      {/* Statistics */}
      {totalFlips > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Overall Statistics</h3>
            <button onClick={() => { setHistory([]); setResult(null); setBulkResults(null); }} className="text-xs text-red-500 hover:text-red-700">Reset</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div><div className="text-xs text-slate-500 dark:text-slate-400">Total Flips</div><div className="text-lg font-bold text-slate-900 dark:text-slate-100">{totalFlips}</div></div>
            <div><div className="text-xs text-slate-500 dark:text-slate-400">Heads</div><div className="text-lg font-bold text-amber-600 dark:text-amber-400">{totalHeads} ({headsPct}%)</div></div>
            <div><div className="text-xs text-slate-500 dark:text-slate-400">Tails</div><div className="text-lg font-bold text-slate-600 dark:text-slate-400">{totalTails} ({tailsPct}%)</div></div>
            <div><div className="text-xs text-slate-500 dark:text-slate-400">Longest Streak</div><div className="text-lg font-bold text-primary-700 dark:text-primary-400">{longestStreak}</div></div>
          </div>
          <div className="mt-3 h-3 rounded-full overflow-hidden flex">
            <div className="bg-amber-500 transition-all" style={{ width: `${headsPct}%` }} />
            <div className="bg-slate-400 flex-1" />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Heads {headsPct}%</span><span>Tails {tailsPct}%</span></div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Flip History (last 50)</h3>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h, i) => (
              <span key={i} className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${h === 'heads' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                {h === 'heads' ? 'H' : 'T'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
