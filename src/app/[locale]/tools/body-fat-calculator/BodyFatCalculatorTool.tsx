'use client';
import { useState } from 'react';

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const LABEL_CLASS = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
const RESULT_CARD = 'bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4';

interface BFCategory {
  label: string;
  maleMin: number;
  maleMax: number;
  femaleMin: number;
  femaleMax: number;
  color: string;
  bg: string;
  badge: string;
}

const BF_CATEGORIES: BFCategory[] = [
  { label: 'Essential Fat', maleMin: 2, maleMax: 6, femaleMin: 10, femaleMax: 14, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700', badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
  { label: 'Athletic', maleMin: 6, maleMax: 14, femaleMin: 14, femaleMax: 21, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700', badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' },
  { label: 'Fitness', maleMin: 14, maleMax: 18, femaleMin: 21, femaleMax: 25, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-700', badge: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300' },
  { label: 'Average', maleMin: 18, maleMax: 25, femaleMin: 25, femaleMax: 32, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700', badge: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' },
  { label: 'Obese', maleMin: 25, maleMax: 100, femaleMin: 32, femaleMax: 100, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700', badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' },
];

function getCategory(bfp: number, isMale: boolean): BFCategory {
  return (
    BF_CATEGORIES.find(c =>
      isMale
        ? bfp >= c.maleMin && bfp < c.maleMax
        : bfp >= c.femaleMin && bfp < c.femaleMax
    ) || BF_CATEGORIES[BF_CATEGORIES.length - 1]
  );
}

function toInches(cm: number) { return cm / 2.54; }
function toCm(inches: number) { return inches * 2.54; }
function toKg(lbs: number) { return lbs * 0.453592; }

export function BodyFatCalculatorTool() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');

  const isMale = gender === 'male';
  const isMetric = unit === 'metric';

  // Convert all inputs to cm / kg
  const heightCm = isMetric ? parseFloat(height) : toCm(parseFloat(height));
  const neckCm = isMetric ? parseFloat(neck) : toCm(parseFloat(neck));
  const waistCm = isMetric ? parseFloat(waist) : toCm(parseFloat(waist));
  const hipCm = isMetric ? parseFloat(hip) : toCm(parseFloat(hip));
  const weightKg = isMetric ? parseFloat(weight) : toKg(parseFloat(weight));
  const ageNum = parseFloat(age);

  // Navy method
  let navyBFP: number | null = null;
  const navyValid = heightCm > 0 && neckCm > 0 && waistCm > 0 && (!isMale ? hipCm > 0 : true);
  if (navyValid) {
    try {
      if (isMale) {
        const val = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
        if (isFinite(val) && val > 0) navyBFP = val;
      } else {
        const val = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
        if (isFinite(val) && val > 0) navyBFP = val;
      }
    } catch (_) { navyBFP = null; }
  }

  // BMI method
  let bmiBFP: number | null = null;
  if (heightCm > 0 && weightKg > 0 && ageNum > 0) {
    const hM = heightCm / 100;
    const bmi = weightKg / (hM * hM);
    bmiBFP = 1.20 * bmi + 0.23 * ageNum - 10.8 * (isMale ? 1 : 0) - 5.4;
    if (!isFinite(bmiBFP) || bmiBFP < 0) bmiBFP = null;
  }

  const navyCategory = navyBFP !== null ? getCategory(navyBFP, isMale) : null;
  const bmiCategory = bmiBFP !== null ? getCategory(bmiBFP, isMale) : null;

  const unitLabel = isMetric ? 'cm' : 'in';

  return (
    <div className="space-y-5">
      {/* Gender toggle */}
      <div className="flex gap-3 flex-wrap">
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
          {(['metric', 'imperial'] as const).map(u => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-5 py-2 text-sm font-medium capitalize transition-colors ${unit === u ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {u === 'metric' ? 'Metric (cm)' : 'Imperial (in)'}
            </button>
          ))}
        </div>
      </div>

      {/* Navy Method Inputs */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">US Navy Method</h3>
        <div className={`grid gap-4 ${!isMale ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
          <div>
            <label className={LABEL_CLASS}>Height ({unitLabel})</label>
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder={isMetric ? '175' : '68.9'} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Neck ({unitLabel})</label>
            <input type="number" value={neck} onChange={e => setNeck(e.target.value)} placeholder={isMetric ? '38' : '15'} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Waist ({unitLabel})</label>
            <input type="number" value={waist} onChange={e => setWaist(e.target.value)} placeholder={isMetric ? '85' : '33.5'} className={INPUT_CLASS} />
          </div>
          {!isMale && (
            <div>
              <label className={LABEL_CLASS}>Hip ({unitLabel})</label>
              <input type="number" value={hip} onChange={e => setHip(e.target.value)} placeholder={isMetric ? '95' : '37.4'} className={INPUT_CLASS} />
            </div>
          )}
        </div>
      </div>

      {/* BMI Method Inputs */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">BMI Method (optional)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>Weight ({isMetric ? 'kg' : 'lbs'})</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder={isMetric ? '70' : '154'} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Age (years)</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" className={INPUT_CLASS} />
          </div>
        </div>
      </div>

      {/* Results */}
      {(navyBFP !== null || bmiBFP !== null) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {navyBFP !== null && navyCategory && (
            <ResultCard
              label="US Navy Method"
              bfp={navyBFP}
              category={navyCategory}
              isMale={isMale}
            />
          )}
          {bmiBFP !== null && bmiCategory && (
            <ResultCard
              label="BMI Method"
              bfp={bmiBFP}
              category={bmiCategory}
              isMale={isMale}
            />
          )}
        </div>
      )}

      {/* Reference table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">Category</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">Men</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">Women</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {BF_CATEGORIES.map(c => (
              <tr key={c.label} className={
                (navyBFP !== null && getCategory(navyBFP, isMale).label === c.label) ||
                (bmiBFP !== null && getCategory(bmiBFP, isMale).label === c.label)
                  ? 'bg-primary-50 dark:bg-primary-900/20' : ''
              }>
                <td className={`px-4 py-2 font-medium ${c.color}`}>{c.label}</td>
                <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{c.maleMin}&ndash;{c.maleMax === 100 ? '100+' : c.maleMax}%</td>
                <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{c.femaleMin}&ndash;{c.femaleMax === 100 ? '100+' : c.femaleMax}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-400">
        <strong>Disclaimer:</strong> Body fat estimates are approximate and may not be accurate for all body types. These formulas were developed for adults and may not apply to children, elderly, or athletic populations. Consult a healthcare professional for personalized health assessments.
      </div>
    </div>
  );
}

function ResultCard({ label, bfp, category, isMale }: { label: string; bfp: number; category: BFCategory; isMale: boolean }) {
  // Gauge: 0–50% range mapped to 0–100%
  const gaugeMax = isMale ? 40 : 50;
  const gaugePercent = Math.min((bfp / gaugeMax) * 100, 100);

  return (
    <div className={`rounded-xl border p-4 ${category.bg}`}>
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">{label}</div>
      <div className="flex items-end gap-3 mb-3">
        <span className={`text-4xl font-bold font-heading ${category.color}`}>{bfp.toFixed(1)}%</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-1 ${category.badge}`}>{category.label}</span>
      </div>
      {/* Gauge bar */}
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${gaugePercent}%`,
            background: 'linear-gradient(90deg, #22c55e 0%, #eab308 50%, #ef4444 100%)',
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
        <span>0%</span>
        <span>{gaugeMax / 2}%</span>
        <span>{gaugeMax}%+</span>
      </div>
    </div>
  );
}
