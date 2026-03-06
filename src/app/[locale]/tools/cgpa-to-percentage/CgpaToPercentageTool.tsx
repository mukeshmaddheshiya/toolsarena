'use client';

import { useState, useMemo } from 'react';
import { GraduationCap, Calculator, Plus, Trash2, Info } from 'lucide-react';

type Scale = '10' | '4' | '5' | '7';

const SCALES: { id: Scale; label: string; max: number; formula: string }[] = [
  { id: '10', label: '10-Point (Indian)', max: 10, formula: 'CGPA x 9.5' },
  { id: '4',  label: '4-Point (US GPA)',  max: 4,  formula: 'Standard GPA mapping' },
  { id: '5',  label: '5-Point',           max: 5,  formula: 'CGPA x 20' },
  { id: '7',  label: '7-Point (Australian)', max: 7, formula: '(CGPA / 7) x 100' },
];

const GPA4_MAP: [number, number, string, string][] = [
  [4.0, 97, 'A+', '#16a34a'], [3.7, 93, 'A',  '#22c55e'], [3.3, 90, 'A-', '#4ade80'],
  [3.0, 87, 'B+', '#3b82f6'], [2.7, 83, 'B',  '#60a5fa'], [2.3, 80, 'B-', '#93c5fd'],
  [2.0, 77, 'C+', '#f59e0b'], [1.7, 73, 'C',  '#fbbf24'], [1.3, 70, 'C-', '#fcd34d'],
  [1.0, 67, 'D+', '#f97316'], [0.7, 63, 'D',  '#fb923c'], [0.0, 0,  'F',  '#ef4444'],
];

function toPercentage(cgpa: number, scale: Scale): number {
  if (scale === '10') return cgpa * 9.5;
  if (scale === '5')  return cgpa * 20;
  if (scale === '7')  return (cgpa / 7) * 100;
  // 4-point: interpolate from GPA map
  for (let i = 0; i < GPA4_MAP.length; i++) {
    if (cgpa >= GPA4_MAP[i][0]) {
      const upper = i === 0 ? [4.0, 100] : [GPA4_MAP[i - 1][0], GPA4_MAP[i - 1][1]];
      const lower = GPA4_MAP[i];
      if (upper[0] === lower[0]) return lower[1];
      return lower[1] + ((cgpa - lower[0]) / (upper[0] - lower[0])) * (upper[1] - lower[1]);
    }
  }
  return 0;
}

function getGrade(pct: number): { letter: string; color: string } {
  if (pct >= 90) return { letter: 'A+', color: '#16a34a' };
  if (pct >= 80) return { letter: 'A',  color: '#22c55e' };
  if (pct >= 70) return { letter: 'B+', color: '#3b82f6' };
  if (pct >= 60) return { letter: 'B',  color: '#f59e0b' };
  if (pct >= 50) return { letter: 'C',  color: '#f97316' };
  if (pct >= 40) return { letter: 'D',  color: '#fb923c' };
  return { letter: 'F', color: '#ef4444' };
}

function crossConvert(pct: number): { scale: string; value: string }[] {
  return [
    { scale: '10-Point', value: (pct / 9.5).toFixed(2) },
    { scale: '4-Point (US)', value: Math.min(4, Math.max(0, (pct - 50) / 12.5)).toFixed(2) },
    { scale: '5-Point', value: (pct / 20).toFixed(2) },
    { scale: '7-Point', value: ((pct / 100) * 7).toFixed(2) },
  ];
}

const GRADE_CHART: Record<Scale, { range: string; grade: string; color: string }[]> = {
  '10': [
    { range: '9.5 - 10.0', grade: 'O (Outstanding)', color: '#16a34a' },
    { range: '8.5 - 9.4',  grade: 'A+ (Excellent)',  color: '#22c55e' },
    { range: '7.5 - 8.4',  grade: 'A (Very Good)',    color: '#3b82f6' },
    { range: '6.5 - 7.4',  grade: 'B+ (Good)',        color: '#60a5fa' },
    { range: '5.5 - 6.4',  grade: 'B (Above Avg)',    color: '#f59e0b' },
    { range: '4.5 - 5.4',  grade: 'C (Average)',      color: '#f97316' },
    { range: '4.0 - 4.4',  grade: 'P (Pass)',         color: '#fb923c' },
    { range: '< 4.0',      grade: 'F (Fail)',         color: '#ef4444' },
  ],
  '4': GPA4_MAP.map(([gpa, , grade, color]) => ({
    range: gpa.toFixed(1), grade, color,
  })),
  '5': [
    { range: '4.5 - 5.0', grade: 'A (Distinction)', color: '#16a34a' },
    { range: '3.5 - 4.4', grade: 'B (First Class)',  color: '#3b82f6' },
    { range: '2.5 - 3.4', grade: 'C (Second Class)', color: '#f59e0b' },
    { range: '1.5 - 2.4', grade: 'D (Third Class)',  color: '#f97316' },
    { range: '< 1.5',     grade: 'F (Fail)',          color: '#ef4444' },
  ],
  '7': [
    { range: '6.5 - 7.0', grade: 'HD (High Dist.)',   color: '#16a34a' },
    { range: '5.5 - 6.4', grade: 'D (Distinction)',    color: '#22c55e' },
    { range: '4.5 - 5.4', grade: 'C (Credit)',         color: '#3b82f6' },
    { range: '3.5 - 4.4', grade: 'P (Pass)',           color: '#f59e0b' },
    { range: '< 3.5',     grade: 'F (Fail)',           color: '#ef4444' },
  ],
};

export function CgpaToPercentageTool() {
  const [scale, setScale] = useState<Scale>('10');
  const [cgpa, setCgpa] = useState(8.2);
  const [sgpas, setSgpas] = useState<string[]>(['', '']);

  const scaleInfo = SCALES.find(s => s.id === scale)!;
  const clamped = Math.min(Math.max(0, cgpa), scaleInfo.max);
  const pct = useMemo(() => toPercentage(clamped, scale), [clamped, scale]);
  const grade = getGrade(pct);
  const cross = useMemo(() => crossConvert(pct), [pct]);

  const sgpaCgpa = useMemo(() => {
    const valid = sgpas.map(Number).filter(n => !isNaN(n) && n > 0);
    if (!valid.length) return null;
    return valid.reduce((a, b) => a + b, 0) / valid.length;
  }, [sgpas]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-7 h-7" />
          <h2 className="text-xl font-bold">CGPA to Percentage Converter</h2>
        </div>
        <p className="text-purple-200 text-sm">Convert your CGPA to percentage across multiple grading systems worldwide.</p>
      </div>

      {/* Scale selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SCALES.map(s => (
          <button key={s.id} onClick={() => { setScale(s.id); setCgpa(Math.min(cgpa, s.max)); }}
            className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              scale === s.id
                ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-purple-200'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* CGPA input */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Calculator className="w-4 h-4" /> Enter CGPA
          </label>
          <span className="text-xs text-slate-400">Max: {scaleInfo.max}</span>
        </div>
        <div className="flex items-center gap-4">
          <input type="range" min={0} max={scaleInfo.max} step={0.1} value={clamped}
            onChange={e => setCgpa(parseFloat(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-purple-600" />
          <input type="number" min={0} max={scaleInfo.max} step={0.01} value={cgpa}
            onChange={e => setCgpa(parseFloat(e.target.value) || 0)}
            className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center text-lg font-bold text-purple-700 dark:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <p className="text-xs text-slate-400">Formula: {scaleInfo.formula}</p>
      </div>

      {/* Result */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Percentage</p>
            <p className="text-5xl font-bold text-purple-800 dark:text-purple-300">{pct.toFixed(2)}%</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: grade.color }}>
              {grade.letter}
            </div>
            <p className="text-xs text-slate-500 mt-1">Grade</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-purple-500 to-indigo-500"
            style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
      </div>

      {/* Cross conversion */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Equivalent on Other Scales</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cross.map(c => (
            <div key={c.scale} className="px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-center">
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{c.value}</p>
              <p className="text-[11px] text-slate-400">{c.scale}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grade chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Grade Chart ({SCALES.find(s => s.id === scale)!.label})
        </p>
        <div className="space-y-1.5">
          {GRADE_CHART[scale].map((row, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 w-24">{row.range}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{row.grade}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SGPA to CGPA */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-purple-500" /> SGPA to CGPA Calculator
          </p>
          <button onClick={() => setSgpas([...sgpas, ''])}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Semester
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {sgpas.map((val, i) => (
            <div key={i} className="relative">
              <label className="text-[10px] text-slate-400 mb-0.5 block">Sem {i + 1}</label>
              <div className="flex items-center gap-1">
                <input type="number" min={0} max={scaleInfo.max} step={0.01} value={val}
                  onChange={e => { const n = [...sgpas]; n[i] = e.target.value; setSgpas(n); }}
                  placeholder="SGPA"
                  className="w-full px-2.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                {sgpas.length > 1 && (
                  <button onClick={() => setSgpas(sgpas.filter((_, j) => j !== i))}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {sgpaCgpa !== null && (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cumulative CGPA</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{sgpaCgpa.toFixed(2)}</p>
            </div>
            <div className="h-10 w-px bg-purple-200 dark:bg-purple-700" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Equivalent %</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {toPercentage(Math.min(sgpaCgpa, scaleInfo.max), scale).toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-500" /> About CGPA Conversion
        </p>
        <div className="text-sm text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
          <p><strong>CGPA (Cumulative Grade Point Average)</strong> is a grading system used by educational institutions to measure academic performance across all semesters.</p>
          <p>The most common formula in Indian universities (followed by CBSE, VTU, Anna University, etc.) is <strong>Percentage = CGPA x 9.5</strong>. This multiplier may vary by institution.</p>
          <p>For the US 4-point GPA system, there is no single formula -- the conversion uses a standard mapping table. The 5-point and 7-point (Australian) scales use proportional conversion.</p>
          <p><strong>SGPA (Semester GPA)</strong> represents your grade point average for a single semester. The overall CGPA is the average of all semester SGPAs (assuming equal credit load).</p>
        </div>
      </div>
    </div>
  );
}
