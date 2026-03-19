'use client';
import { useState, useMemo } from 'react';

const ACTIVITIES = [
  { label: 'Sedentary (office job)', factor: 1.2 },
  { label: 'Lightly Active (1-3 days/wk)', factor: 1.375 },
  { label: 'Moderately Active (3-5 days/wk)', factor: 1.55 },
  { label: 'Very Active (6-7 days/wk)', factor: 1.725 },
  { label: 'Extra Active (athlete/physical job)', factor: 1.9 },
];

export function CalorieCalculatorTool() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(25);
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [activityIdx, setActivityIdx] = useState(1);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const heightDisplay = unit === 'imperial' ? Math.round(heightCm / 2.54) : heightCm;
  const weightDisplay = unit === 'imperial' ? Math.round(weightKg * 2.205) : weightKg;

  const { bmr, tdee } = useMemo(() => {
    const bmr = gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    const tdee = bmr * ACTIVITIES[activityIdx].factor;
    return { bmr: Math.round(bmr), tdee: Math.round(tdee) };
  }, [gender, age, heightCm, weightKg, activityIdx]);

  const targets = [
    { label: 'Extreme Loss (-1 kg/wk)', cal: tdee - 1000, color: 'text-red-600 dark:text-red-400' },
    { label: 'Moderate Loss (-0.5 kg/wk)', cal: tdee - 500, color: 'text-orange-600 dark:text-orange-400' },
    { label: 'Mild Loss (-0.25 kg/wk)', cal: tdee - 250, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Maintain Weight', cal: tdee, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Mild Gain (+0.25 kg/wk)', cal: tdee + 250, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Moderate Gain (+0.5 kg/wk)', cal: tdee + 500, color: 'text-indigo-600 dark:text-indigo-400' },
  ];

  const macros = useMemo(() => {
    const cal = tdee;
    const protein = Math.round((cal * 0.3) / 4);
    const carbs = Math.round((cal * 0.4) / 4);
    const fat = Math.round((cal * 0.3) / 9);
    return { protein, carbs, fat };
  }, [tdee]);

  const sliderClass = 'w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800';
  const inputClass = 'mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

  return (
    <div className="space-y-6">
      {/* Gender + Unit Toggle */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className={labelClass}>Gender</label>
          <div className="mt-1 flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {(['male', 'female'] as const).map(g => (
              <button key={g} onClick={() => setGender(g)}
                className={`px-5 py-2 text-sm font-medium transition-colors ${gender === g ? 'bg-primary-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                {g === 'male' ? 'Male' : 'Female'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Units</label>
          <div className="mt-1 flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {(['metric', 'imperial'] as const).map(u => (
              <button key={u} onClick={() => setUnit(u)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${unit === u ? 'bg-primary-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                {u === 'metric' ? 'cm / kg' : 'in / lbs'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Age</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{age} yr</span></div>
          <input type="range" min={15} max={80} value={age} onChange={e => setAge(+e.target.value)} className={sliderClass} />
          <input type="number" value={age} min={15} max={80} onChange={e => setAge(Math.max(15, +e.target.value || 15))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Height ({unit === 'metric' ? 'cm' : 'inches'})</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{heightDisplay}{unit === 'metric' ? ' cm' : '"'}</span></div>
          <input type="range" min={unit === 'metric' ? 100 : 39} max={unit === 'metric' ? 250 : 98} value={heightDisplay}
            onChange={e => setHeightCm(unit === 'metric' ? +e.target.value : Math.round(+e.target.value * 2.54))} className={sliderClass} />
          <input type="number" value={heightDisplay} min={unit === 'metric' ? 100 : 39} max={unit === 'metric' ? 250 : 98}
            onChange={e => { const v = +e.target.value || 100; setHeightCm(unit === 'metric' ? v : Math.round(v * 2.54)); }} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{weightDisplay} {unit === 'metric' ? 'kg' : 'lbs'}</span></div>
          <input type="range" min={unit === 'metric' ? 30 : 66} max={unit === 'metric' ? 200 : 440} value={weightDisplay}
            onChange={e => setWeightKg(unit === 'metric' ? +e.target.value : Math.round(+e.target.value / 2.205))} className={sliderClass} />
          <input type="number" value={weightDisplay} min={unit === 'metric' ? 30 : 66} max={unit === 'metric' ? 200 : 440}
            onChange={e => { const v = +e.target.value || 30; setWeightKg(unit === 'metric' ? v : Math.round(v / 2.205)); }} className={inputClass} />
        </div>
        <div>
          <label className={`block ${labelClass} mb-1`}>Activity Level</label>
          <select value={activityIdx} onChange={e => setActivityIdx(+e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100">
            {ACTIVITIES.map((a, i) => <option key={i} value={i}>{a.label}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="text-sm text-orange-200 mb-1">Daily Calorie Needs (TDEE)</div>
          <div className="text-4xl font-heading font-bold">{tdee.toLocaleString()} cal</div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm text-orange-200">BMR</div>
            <div className="font-bold text-xl">{bmr.toLocaleString()} cal</div>
            <div className="text-xs text-orange-300">Calories at rest</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-sm text-orange-200">Activity Factor</div>
            <div className="font-bold text-xl">×{ACTIVITIES[activityIdx].factor}</div>
            <div className="text-xs text-orange-300">{ACTIVITIES[activityIdx].label.split('(')[0]}</div>
          </div>
        </div>
      </div>

      {/* Calorie Targets */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Calorie Targets by Goal</h3>
        <div className="space-y-2">
          {targets.map(t => (
            <div key={t.label} className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <span className="text-sm text-slate-600 dark:text-slate-400">{t.label}</span>
              <span className={`text-sm font-bold ${t.color}`}>{Math.max(1200, t.cal).toLocaleString()} cal/day</span>
            </div>
          ))}
        </div>
      </div>

      {/* Macronutrients */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Macronutrient Breakdown (Maintenance)</h3>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{macros.protein}g</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Protein (30%)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{macros.carbs}g</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Carbs (40%)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{macros.fat}g</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Fat (30%)</div>
          </div>
        </div>
        <div className="h-4 rounded-full overflow-hidden flex">
          <div className="bg-blue-500 h-full" style={{ width: '30%' }} />
          <div className="bg-amber-500 h-full" style={{ width: '40%' }} />
          <div className="bg-emerald-500 h-full" style={{ width: '30%' }} />
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>Protein</span><span>Carbs</span><span>Fat</span>
        </div>
      </div>

      {/* Formula */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Mifflin-St Jeor Formula</h3>
        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-700 dark:text-slate-300 text-center">
          {gender === 'male' ? 'BMR = 10×weight + 6.25×height − 5×age + 5' : 'BMR = 10×weight + 6.25×height − 5×age − 161'}
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">TDEE = BMR × Activity Factor</div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">* Calorie estimates are based on the Mifflin-St Jeor equation. Individual needs vary based on metabolism, health conditions, and other factors. Consult a healthcare professional or registered dietitian for personalized advice.</p>
    </div>
  );
}
