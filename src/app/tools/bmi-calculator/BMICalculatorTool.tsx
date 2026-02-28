'use client';
import { useState } from 'react';

const BMI_CATEGORIES = [
  { label: 'Underweight', min: 0, max: 18.5, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' },
  { label: 'Normal weight', min: 18.5, max: 25, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' },
  { label: 'Overweight', min: 25, max: 30, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800' },
  { label: 'Obese (Class I)', min: 30, max: 35, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800' },
  { label: 'Obese (Class II)', min: 35, max: 40, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800' },
  { label: 'Obese (Class III)', min: 40, max: Infinity, color: 'text-red-800 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700' },
];

function getBMICategory(bmi: number) {
  return BMI_CATEGORIES.find(c => bmi >= c.min && bmi < c.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
}

export function BMICalculatorTool() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');

  let bmi = 0;
  if (unit === 'metric') {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) bmi = w / (h * h);
  } else {
    const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
    const w = parseFloat(weight);
    if (totalInches > 0 && w > 0) bmi = (w / (totalInches * totalInches)) * 703;
  }

  const bmiStr = bmi > 0 ? bmi.toFixed(1) : '\u2014';
  const category = bmi > 0 ? getBMICategory(bmi) : null;

  // Healthy weight range for given height
  const heightM = unit === 'metric' ? parseFloat(height) / 100 : ((parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0)) * 0.0254;
  const minHealthyKg = 18.5 * heightM * heightM;
  const maxHealthyKg = 24.9 * heightM * heightM;

  return (
    <div className="space-y-5">
      {/* Unit selector */}
      <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
        {(['metric', 'imperial'] as const).map(u => (
          <button key={u} onClick={() => setUnit(u)} className={`px-5 py-2 text-sm font-medium capitalize transition-colors ${unit === u ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            {u} ({u === 'metric' ? 'kg/cm' : 'lbs/ft'})
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Height {unit === 'metric' ? '(cm)' : ''}
          </label>
          {unit === 'metric' ? (
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 175" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
          ) : (
            <div className="flex gap-2">
              <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="ft" className="flex-1 px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
              <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="in" className="flex-1 px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
        </div>
      </div>

      {/* Result */}
      {bmi > 0 && category && (
        <div className={`rounded-2xl border p-6 ${category.bg}`}>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-5xl font-heading font-bold ${category.color}`}>{bmiStr}</div>
              <div className="text-xs text-slate-500 mt-1">BMI (kg/m&sup2;)</div>
            </div>
            <div>
              <div className={`text-xl font-heading font-bold ${category.color}`}>{category.label}</div>
              {heightM > 0 && (
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Healthy weight for your height: {minHealthyKg.toFixed(1)}&ndash;{maxHealthyKg.toFixed(1)} kg
                </div>
              )}
            </div>
          </div>

          {/* BMI scale */}
          <div className="mt-4">
            <div className="flex h-3 rounded-full overflow-hidden">
              <div className="bg-blue-400" style={{ width: '18.5%' }} title="Underweight" />
              <div className="bg-green-400" style={{ width: '13%' }} title="Normal" />
              <div className="bg-yellow-400" style={{ width: '16.7%' }} title="Overweight" />
              <div className="bg-red-400 flex-1" title="Obese" />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
            </div>
          </div>
        </div>
      )}

      {/* Reference table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">BMI Range</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {BMI_CATEGORIES.slice(0, 5).map(c => (
              <tr key={c.label} className={bmi >= c.min && bmi < c.max ? 'bg-primary-50 dark:bg-primary-900/20' : ''}>
                <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{c.min} &ndash; {c.max === Infinity ? '40+' : c.max}</td>
                <td className={`px-4 py-2 font-medium ${c.color}`}>{c.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
