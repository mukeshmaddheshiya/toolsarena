'use client';
import { useState, useMemo } from 'react';

interface Row { id: number; name: string; score: number; total: number; weight: number }

const GRADES = [
  { min: 97, letter: 'A+', gpa: 4.0 }, { min: 93, letter: 'A', gpa: 4.0 }, { min: 90, letter: 'A-', gpa: 3.7 },
  { min: 87, letter: 'B+', gpa: 3.3 }, { min: 83, letter: 'B', gpa: 3.0 }, { min: 80, letter: 'B-', gpa: 2.7 },
  { min: 77, letter: 'C+', gpa: 2.3 }, { min: 73, letter: 'C', gpa: 2.0 }, { min: 70, letter: 'C-', gpa: 1.7 },
  { min: 60, letter: 'D', gpa: 1.0 }, { min: 0, letter: 'F', gpa: 0.0 },
];

function getLetter(pct: number) { return GRADES.find(g => pct >= g.min) || GRADES[GRADES.length - 1]; }

let nextId = 4;

export function GradeCalculatorTool() {
  const [mode, setMode] = useState<'weighted' | 'unweighted'>('weighted');
  const [rows, setRows] = useState<Row[]>([
    { id: 1, name: 'Homework', score: 85, total: 100, weight: 20 },
    { id: 2, name: 'Midterm Exam', score: 78, total: 100, weight: 30 },
    { id: 3, name: 'Final Exam', score: 90, total: 100, weight: 50 },
  ]);
  const [targetGrade, setTargetGrade] = useState(90);
  const [finalWeight, setFinalWeight] = useState(30);
  const [showRef, setShowRef] = useState(false);

  const updateRow = (id: number, field: keyof Row, value: string | number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };
  const addRow = () => { setRows(prev => [...prev, { id: nextId++, name: `Assignment ${prev.length + 1}`, score: 0, total: 100, weight: 10 }]); };
  const removeRow = (id: number) => { if (rows.length > 1) setRows(prev => prev.filter(r => r.id !== id)); };

  const { overallPct, letterInfo, totalEarned, totalPossible } = useMemo(() => {
    if (rows.length === 0) return { overallPct: 0, letterInfo: GRADES[GRADES.length - 1], totalEarned: 0, totalPossible: 0 };
    let totalEarned = 0, totalPossible = 0;
    if (mode === 'weighted') {
      let weightedSum = 0, totalWeight = 0;
      for (const r of rows) {
        if (r.total > 0) { weightedSum += (r.score / r.total) * r.weight; totalWeight += r.weight; }
        totalEarned += r.score; totalPossible += r.total;
      }
      const pct = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
      return { overallPct: pct, letterInfo: getLetter(pct), totalEarned, totalPossible };
    } else {
      for (const r of rows) { totalEarned += r.score; totalPossible += r.total; }
      const pct = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;
      return { overallPct: pct, letterInfo: getLetter(pct), totalEarned, totalPossible };
    }
  }, [rows, mode]);

  const neededScore = useMemo(() => {
    if (mode !== 'weighted') return null;
    const currentWeight = rows.reduce((s, r) => s + r.weight, 0);
    const currentWeightedSum = rows.reduce((s, r) => r.total > 0 ? s + (r.score / r.total) * r.weight : s, 0);
    const remainingWeight = finalWeight;
    const needed = ((targetGrade / 100) * (currentWeight + remainingWeight) - currentWeightedSum) / remainingWeight * 100;
    return Math.round(needed * 10) / 10;
  }, [rows, targetGrade, finalWeight, mode]);

  const inputClass = 'w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 w-fit">
        {(['weighted', 'unweighted'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-5 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-primary-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
            {m === 'weighted' ? 'Weighted' : 'Unweighted'}
          </button>
        ))}
      </div>

      {/* Grade Entries */}
      <div className="space-y-3">
        <div className={`grid ${mode === 'weighted' ? 'grid-cols-[1fr_80px_80px_80px_40px]' : 'grid-cols-[1fr_80px_80px_40px]'} gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 px-1`}>
          <div>Assignment</div><div>Score</div><div>Total</div>{mode === 'weighted' && <div>Weight %</div>}<div></div>
        </div>
        {rows.map(row => (
          <div key={row.id} className={`grid ${mode === 'weighted' ? 'grid-cols-[1fr_80px_80px_80px_40px]' : 'grid-cols-[1fr_80px_80px_40px]'} gap-2 items-center`}>
            <input type="text" value={row.name} onChange={e => updateRow(row.id, 'name', e.target.value)} className={inputClass} />
            <input type="number" value={row.score} min={0} onChange={e => updateRow(row.id, 'score', +e.target.value || 0)} className={inputClass} />
            <input type="number" value={row.total} min={1} onChange={e => updateRow(row.id, 'total', Math.max(1, +e.target.value || 1))} className={inputClass} />
            {mode === 'weighted' && <input type="number" value={row.weight} min={0} max={100} onChange={e => updateRow(row.id, 'weight', +e.target.value || 0)} className={inputClass} />}
            <button onClick={() => removeRow(row.id)} className="text-red-500 hover:text-red-700 text-lg" title="Remove">×</button>
          </div>
        ))}
        <div className="flex gap-3">
          <button onClick={addRow} className="px-4 py-2 text-sm font-medium bg-primary-700 hover:bg-primary-800 text-white rounded-lg transition-colors">+ Add Row</button>
          <button onClick={() => setRows([{ id: nextId++, name: 'Assignment 1', score: 0, total: 100, weight: 100 }])} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">Clear All</button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="text-center mb-4">
          <div className="text-sm text-purple-200 mb-1">Overall Grade</div>
          <div className="text-5xl font-heading font-bold">{overallPct.toFixed(1)}%</div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm text-purple-200">Letter</div>
            <div className="font-bold text-2xl">{letterInfo.letter}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm text-purple-200">GPA</div>
            <div className="font-bold text-2xl">{letterInfo.gpa.toFixed(1)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm text-purple-200">Points</div>
            <div className="font-bold text-2xl">{totalEarned}/{totalPossible}</div>
          </div>
        </div>
        {/* Grade position bar */}
        <div className="mt-5 relative">
          <div className="h-4 rounded-full overflow-hidden flex">
            <div className="bg-red-500 h-full" style={{ width: '60%' }} />
            <div className="bg-amber-500 h-full" style={{ width: '10%' }} />
            <div className="bg-yellow-400 h-full" style={{ width: '10%' }} />
            <div className="bg-emerald-400 h-full" style={{ width: '10%' }} />
            <div className="bg-green-500 h-full" style={{ width: '10%' }} />
          </div>
          <div className="absolute top-0 h-4 w-1 bg-white rounded shadow-lg transition-all" style={{ left: `${Math.min(100, overallPct)}%` }} />
          <div className="flex justify-between text-xs text-purple-300 mt-1"><span>F</span><span>D</span><span>C</span><span>B</span><span>A</span></div>
        </div>
      </div>

      {/* What Do I Need */}
      {mode === 'weighted' && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">What Do I Need on My Final?</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400">Target Grade (%)</label>
              <input type="number" value={targetGrade} min={0} max={100} onChange={e => setTargetGrade(+e.target.value || 0)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400">Final Exam Weight (%)</label>
              <input type="number" value={finalWeight} min={1} max={100} onChange={e => setFinalWeight(Math.max(1, +e.target.value || 1))} className={inputClass} />
            </div>
            <div className="flex items-end">
              <div className="w-full text-center py-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">You need</div>
                <div className={`text-xl font-bold ${neededScore !== null && neededScore <= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {neededScore !== null ? (neededScore <= 0 ? '0%' : neededScore > 100 ? 'Not possible' : `${neededScore}%`) : '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grade Scale Reference */}
      <div>
        <button onClick={() => setShowRef(!showRef)} className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
          {showRef ? 'Hide' : 'Show'} Grading Scale Reference &rarr;
        </button>
        {showRef && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GRADES.map(g => (
              <div key={g.letter} className="flex justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                <span className="font-bold text-slate-900 dark:text-slate-100">{g.letter}</span>
                <span className="text-slate-500 dark:text-slate-400">{g.min}%+ (GPA {g.gpa})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
