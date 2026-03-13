'use client';
import { useState } from 'react';

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const LABEL_CLASS = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

interface FormulaResult {
  name: string;
  year: string;
  kg: number;
}

function calcIdealWeights(heightIn: number, isMale: boolean): FormulaResult[] {
  const excess = heightIn - 60;
  return [
    { name: 'Devine', year: '1974', kg: isMale ? 50 + 2.3 * excess : 45.5 + 2.3 * excess },
    { name: 'Robinson', year: '1983', kg: isMale ? 52 + 1.9 * excess : 49 + 1.7 * excess },
    { name: 'Miller', year: '1983', kg: isMale ? 56.2 + 1.41 * excess : 53.1 + 1.36 * excess },
    { name: 'Hamwi', year: '1964', kg: isMale ? 48 + 2.7 * excess : 45.5 + 2.2 * excess },
  ];
}

function kgToLbs(kg: number) { return kg * 2.20462; }

export function IdealWeightCalculatorTool() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'cm' | 'ftin'>('cm');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [resultUnit, setResultUnit] = useState<'kg' | 'lbs'>('kg');

  const isMale = gender === 'male';

  // Compute total inches
  let totalInches = 0;
  if (unit === 'cm') {
    const cm = parseFloat(heightCm);
    if (cm > 0) totalInches = cm / 2.54;
  } else {
    totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
  }

  const heightM = totalInches * 0.0254;
  const hasHeight = totalInches > 0 && totalInches >= 48; // >=4ft sanity

  const results = hasHeight ? calcIdealWeights(totalInches, isMale) : [];
  const validResults = results.filter(r => r.kg > 0);
  const avgKg = validResults.length > 0 ? validResults.reduce((s, r) => s + r.kg, 0) / validResults.length : 0;

  // Healthy BMI range
  const bmiMinKg = heightM > 0 ? 18.5 * heightM * heightM : 0;
  const bmiMaxKg = heightM > 0 ? 24.9 * heightM * heightM : 0;

  const display = (kg: number) =>
    resultUnit === 'kg' ? `${kg.toFixed(1)} kg` : `${kgToLbs(kg).toFixed(1)} lbs`;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
          {(['male', 'female'] as const).map(g => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`px-5 py-2 text-sm font-medium capitalize transition-colors ${gender === g ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {g === 'male' ? '♂ Male' : '♀ Female'}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
          {(['cm', 'ftin'] as const).map(u => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-5 py-2 text-sm font-medium transition-colors ${unit === u ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {u === 'cm' ? 'cm' : 'ft / in'}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
          {(['kg', 'lbs'] as const).map(u => (
            <button
              key={u}
              onClick={() => setResultUnit(u)}
              className={`px-5 py-2 text-sm font-medium transition-colors ${resultUnit === u ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Height input */}
      <div className="max-w-sm">
        <label className={LABEL_CLASS}>Height</label>
        {unit === 'cm' ? (
          <input
            type="number"
            value={heightCm}
            onChange={e => setHeightCm(e.target.value)}
            placeholder="e.g. 175"
            className={INPUT_CLASS}
          />
        ) : (
          <div className="flex gap-2">
            <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="ft" className={INPUT_CLASS} />
            <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="in" className={INPUT_CLASS} />
          </div>
        )}
      </div>

      {/* Results grid */}
      {validResults.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            {validResults.map(r => (
              <div key={r.name} className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
                  {r.name} ({r.year})
                </div>
                <div className="text-2xl font-bold font-heading text-primary-700 dark:text-primary-400">
                  {display(r.kg)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {resultUnit === 'kg' ? `${kgToLbs(r.kg).toFixed(1)} lbs` : `${r.kg.toFixed(1)} kg`}
                </div>
              </div>
            ))}
          </div>

          {/* Average + BMI range */}
          <div className="grid sm:grid-cols-2 gap-3">
            {avgKg > 0 && (
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800 p-4">
                <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-1">Average (4 Formulas)</div>
                <div className="text-2xl font-bold font-heading text-primary-700 dark:text-primary-300">{display(avgKg)}</div>
                <div className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">
                  {resultUnit === 'kg' ? `${kgToLbs(avgKg).toFixed(1)} lbs` : `${avgKg.toFixed(1)} kg`}
                </div>
              </div>
            )}
            {bmiMinKg > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700 p-4">
                <div className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-1">Healthy BMI Range (18.5–24.9)</div>
                <div className="text-xl font-bold font-heading text-green-700 dark:text-green-300">
                  {display(bmiMinKg)} &ndash; {display(bmiMaxKg)}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                  {resultUnit === 'kg'
                    ? `${kgToLbs(bmiMinKg).toFixed(0)}–${kgToLbs(bmiMaxKg).toFixed(0)} lbs`
                    : `${bmiMinKg.toFixed(1)}–${bmiMaxKg.toFixed(1)} kg`}
                </div>
              </div>
            )}
          </div>

          {/* Comparison bar */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Formula Comparison</div>
            <div className="space-y-2">
              {validResults.map(r => {
                const minVal = Math.min(...validResults.map(x => x.kg));
                const maxVal = Math.max(...validResults.map(x => x.kg));
                const range = maxVal - minVal || 1;
                const pct = ((r.kg - minVal) / range) * 70 + 15; // 15-85% range
                return (
                  <div key={r.name} className="flex items-center gap-3 text-sm">
                    <span className="w-20 text-xs text-slate-500 dark:text-slate-400 shrink-0">{r.name}</span>
                    <div className="flex-1 h-5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                      <div
                        className="absolute top-0 left-0 h-full bg-primary-500 dark:bg-primary-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-20 text-right text-xs font-medium text-slate-700 dark:text-slate-300 shrink-0">{display(r.kg)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {!hasHeight && totalInches > 0 && totalInches < 48 && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400">Please enter a height of at least 4 ft (122 cm).</p>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500">
        These formulas were developed for adults and may not apply to children, elderly, or athletic populations.
        They represent population averages, not individual targets.
      </p>
    </div>
  );
}
