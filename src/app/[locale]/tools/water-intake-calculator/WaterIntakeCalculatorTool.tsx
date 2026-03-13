'use client';
import { useState } from 'react';

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const LABEL_CLASS = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

const ACTIVITY_LEVELS = [
  { key: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', extra: 0 },
  { key: 'light', label: 'Lightly Active', desc: '1–3 days/week exercise', extra: 0.3 },
  { key: 'moderate', label: 'Moderately Active', desc: '3–5 days/week exercise', extra: 0.5 },
  { key: 'very', label: 'Very Active', desc: '6–7 days/week hard exercise', extra: 0.7 },
  { key: 'athlete', label: 'Athlete', desc: 'Twice daily training', extra: 1.0 },
] as const;

const CLIMATES = [
  { key: 'temperate', label: 'Temperate', desc: 'Mild climate', extra: 0 },
  { key: 'hot', label: 'Hot & Humid', desc: 'Summer / tropical', extra: 0.5 },
  { key: 'cold', label: 'Cold & Dry', desc: 'Winter / dry climate', extra: -0.2 },
] as const;

// Waking hours: 7am–11pm = 16 hrs
const WAKE_HOUR = 7;
const SLEEP_HOUR = 23;
const WAKING_HOURS = SLEEP_HOUR - WAKE_HOUR; // 16

function buildSchedule(totalLitres: number): { time: string; glasses: number }[] {
  const totalGlasses = Math.round(totalLitres / 0.25);
  const glassesPerHour = totalGlasses / WAKING_HOURS;
  const schedule: { time: string; glasses: number }[] = [];

  let remaining = totalGlasses;
  let accumulated = 0;

  for (let h = WAKE_HOUR; h < SLEEP_HOUR && remaining > 0; h++) {
    accumulated += glassesPerHour;
    if (accumulated >= 1) {
      const glasses = Math.min(Math.round(accumulated), remaining);
      if (glasses > 0) {
        const hour12 = h % 12 || 12;
        const ampm = h < 12 ? 'am' : 'pm';
        schedule.push({ time: `${hour12}:00 ${ampm}`, glasses });
        remaining -= glasses;
        accumulated -= glasses;
      }
    }
  }
  // If any remaining, add to last slot
  if (remaining > 0 && schedule.length > 0) {
    schedule[schedule.length - 1].glasses += remaining;
  }
  return schedule;
}

export function WaterIntakeCalculatorTool() {
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState<typeof ACTIVITY_LEVELS[number]['key']>('moderate');
  const [climate, setClimate] = useState<typeof CLIMATES[number]['key']>('temperate');

  const weightKg =
    weightUnit === 'kg'
      ? parseFloat(weight)
      : (parseFloat(weight) || 0) * 0.453592;

  const activityExtra = ACTIVITY_LEVELS.find(a => a.key === activity)?.extra ?? 0;
  const climateExtra = CLIMATES.find(c => c.key === climate)?.extra ?? 0;

  let totalLitres = 0;
  const hasResult = weightKg > 0;
  if (hasResult) {
    totalLitres = Math.max(0, weightKg * 0.033 + activityExtra + climateExtra);
  }

  const glasses250 = Math.round(totalLitres / 0.25);
  const bottles1L = Math.ceil(totalLitres);
  const bottles500 = Math.ceil(totalLitres / 0.5);
  const schedule = hasResult ? buildSchedule(totalLitres) : [];

  return (
    <div className="space-y-5">
      {/* Weight */}
      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className={LABEL_CLASS}>Body Weight</label>
          <div className="flex gap-0 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder={weightUnit === 'kg' ? 'e.g. 70' : 'e.g. 154'}
              className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
            />
            <div className="flex border-l border-slate-200 dark:border-slate-700">
              {(['kg', 'lbs'] as const).map(u => (
                <button
                  key={u}
                  onClick={() => setWeightUnit(u)}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${weightUnit === u ? 'bg-primary-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity level */}
      <div>
        <label className={LABEL_CLASS}>Activity Level</label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {ACTIVITY_LEVELS.map(a => (
            <button
              key={a.key}
              onClick={() => setActivity(a.key)}
              className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${activity === a.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-300 dark:hover:border-primary-700'}`}
            >
              <div className={`font-medium ${activity === a.key ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>{a.label}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{a.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Climate */}
      <div>
        <label className={LABEL_CLASS}>Climate</label>
        <div className="grid sm:grid-cols-3 gap-2">
          {CLIMATES.map(c => (
            <button
              key={c.key}
              onClick={() => setClimate(c.key)}
              className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${climate === c.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-300 dark:hover:border-primary-700'}`}
            >
              <div className={`font-medium ${climate === c.key ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>{c.label}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{c.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {hasResult && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Daily Intake" value={`${totalLitres.toFixed(1)} L`} sub="litres per day" color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700" />
            <StatCard label="Glasses (250ml)" value={String(glasses250)} sub="glasses of water" color="text-green-600 dark:text-green-400" bg="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700" />
            <StatCard label="1L Bottles" value={String(bottles1L)} sub="1 litre bottles" color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700" />
            <StatCard label="500ml Bottles" value={String(bottles500)} sub="500 ml bottles" color="text-orange-600 dark:text-orange-400" bg="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700" />
          </div>

          {/* Hourly schedule */}
          {schedule.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Daily Drinking Schedule (7am–11pm)</div>
              <div className="flex flex-wrap gap-2">
                {schedule.map((slot, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{slot.time}</span>
                    <span className="text-slate-400 dark:text-slate-500">&mdash;</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{slot.glasses} glass{slot.glasses !== 1 ? 'es' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500">
        These are general guidelines. Increase intake when exercising, in hot weather, or if pregnant/breastfeeding.
        Individual hydration needs vary.
      </p>
    </div>
  );
}

function StatCard({ label, value, sub, color, bg }: { label: string; value: string; sub: string; color: string; bg: string }) {
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{label}</div>
      <div className={`text-3xl font-bold font-heading ${color}`}>{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub}</div>
    </div>
  );
}
