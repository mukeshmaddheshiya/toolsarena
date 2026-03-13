'use client';
import { useState } from 'react';

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const LABEL_CLASS = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

interface Zone {
  zone: number;
  name: string;
  minPct: number;
  maxPct: number;
  purpose: string;
  color: string;
  bg: string;
  border: string;
  bar: string;
}

const ZONES: Zone[] = [
  { zone: 1, name: 'Warm Up', minPct: 50, maxPct: 60, purpose: 'Active recovery, warm up', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-700', bar: 'bg-emerald-400 dark:bg-emerald-500' },
  { zone: 2, name: 'Fat Burn', minPct: 60, maxPct: 70, purpose: 'Fat burning, endurance base', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', bar: 'bg-blue-400 dark:bg-blue-500' },
  { zone: 3, name: 'Aerobic', minPct: 70, maxPct: 80, purpose: 'Cardiovascular fitness', color: 'text-yellow-700 dark:text-yellow-300', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-700', bar: 'bg-yellow-400 dark:bg-yellow-500' },
  { zone: 4, name: 'Anaerobic', minPct: 80, maxPct: 90, purpose: 'Speed, performance', color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-700', bar: 'bg-orange-400 dark:bg-orange-500' },
  { zone: 5, name: 'Maximum', minPct: 90, maxPct: 100, purpose: 'Max effort, short bursts', color: 'text-red-700 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-700', bar: 'bg-red-400 dark:bg-red-500' },
];

function calcBpm(maxHr: number, restingHr: number | null, minPct: number, maxPct: number) {
  if (restingHr !== null) {
    // Karvonen
    const hrr = maxHr - restingHr;
    const low = Math.round(hrr * (minPct / 100) + restingHr);
    const high = Math.round(hrr * (maxPct / 100) + restingHr);
    return { low, high };
  }
  return {
    low: Math.round(maxHr * (minPct / 100)),
    high: Math.round(maxHr * (maxPct / 100)),
  };
}

export function HeartRateZoneCalculatorTool() {
  const [age, setAge] = useState('');
  const [restingHr, setRestingHr] = useState('');

  const ageNum = parseInt(age, 10);
  const restingNum = restingHr !== '' ? parseInt(restingHr, 10) : null;
  const hasAge = ageNum > 0 && ageNum < 120;
  const maxHr = hasAge ? 220 - ageNum : 0;
  const useKarvonen = restingNum !== null && restingNum > 0 && restingNum < maxHr;

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4 max-w-md">
        <div>
          <label className={LABEL_CLASS}>Age (years) <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={age}
            onChange={e => setAge(e.target.value)}
            placeholder="e.g. 30"
            min={1}
            max={119}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Resting Heart Rate (optional)</label>
          <input
            type="number"
            value={restingHr}
            onChange={e => setRestingHr(e.target.value)}
            placeholder="e.g. 65 bpm"
            min={30}
            max={120}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {hasAge && (
        <>
          {/* Max HR card */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Max Heart Rate</div>
                <div className="text-4xl font-bold font-heading text-red-600 dark:text-red-400 mt-1">{maxHr} <span className="text-lg font-normal text-slate-500 dark:text-slate-400">bpm</span></div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">220 &minus; {ageNum} = {maxHr} bpm</div>
              </div>
            </div>
            {useKarvonen && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700 p-4">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Method</div>
                <div className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-1">Karvonen</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Heart Rate Reserve used</div>
              </div>
            )}
            {!useKarvonen && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Method</div>
                <div className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-1">% Max HR</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Add resting HR for Karvonen</div>
              </div>
            )}
          </div>

          {/* Zones table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Zone</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">% Max HR</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">BPM Range</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400 hidden sm:table-cell">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {ZONES.map(z => {
                  const { low, high } = calcBpm(maxHr, useKarvonen ? restingNum : null, z.minPct, z.maxPct);
                  return (
                    <tr key={z.zone} className={`${z.bg}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-6 rounded-sm ${z.bar}`} />
                          <span className={`font-bold ${z.color}`}>{z.zone}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 font-semibold ${z.color}`}>{z.name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{z.minPct}&ndash;{z.maxPct}%</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${z.color}`}>{low}&ndash;{high}</span>
                        <span className="text-slate-400 dark:text-slate-500 text-xs ml-1">bpm</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs hidden sm:table-cell">{z.purpose}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Visual zone bar */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Heart Rate Zones Overview</div>
            <div className="flex h-8 rounded-full overflow-hidden">
              {ZONES.map(z => (
                <div
                  key={z.zone}
                  className={`${z.bar} flex-1 flex items-center justify-center text-xs font-bold text-white`}
                  title={`Zone ${z.zone}: ${z.name}`}
                >
                  Z{z.zone}
                </div>
              ))}
            </div>
            <div className="flex mt-2 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex-1 text-center">{Math.round(maxHr * 0.5)}</span>
              <span className="flex-1 text-center">{Math.round(maxHr * 0.6)}</span>
              <span className="flex-1 text-center">{Math.round(maxHr * 0.7)}</span>
              <span className="flex-1 text-center">{Math.round(maxHr * 0.8)}</span>
              <span className="flex-1 text-center">{Math.round(maxHr * 0.9)}</span>
              <span className="flex-1 text-center">{maxHr}</span>
            </div>
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-1">bpm</div>
          </div>
        </>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500">
        Maximum heart rate formula (220 &minus; age) is an estimate. Actual max HR may vary by &plusmn;10&ndash;20 bpm.
        Consult a doctor before starting a new exercise program.
      </p>
    </div>
  );
}
