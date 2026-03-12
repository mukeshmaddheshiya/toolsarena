'use client';

import { useState, useCallback } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { RotateCcw } from 'lucide-react';

// ── Conversion constants ─────────────────────────────────────────────────────
// All values normalised to square feet
const TO_SQFT = {
  // Hilly (Pahad)
  ropani: 5476,
  aana:   342.25,
  paisa:  85.5625,
  dam:    21.390625,
  // Terai
  bigha:  72900,
  kattha: 3645,
  dhur:   182.25,
  // International
  sqft:   1,
  sqm:    10.7639,
  sqyard: 9,
  acre:   43560,
  hectare: 107639,
} as const;

type Unit = keyof typeof TO_SQFT;

const HILLY_UNITS: Unit[]       = ['ropani', 'aana', 'paisa', 'dam'];
const TERAI_UNITS: Unit[]       = ['bigha', 'kattha', 'dhur'];
const INTL_UNITS: Unit[]        = ['sqft', 'sqm', 'sqyard', 'acre', 'hectare'];

const LABELS: Record<Unit, string> = {
  ropani:  'Ropani (रोपनी)',
  aana:    'Aana (आना)',
  paisa:   'Paisa (पैसा)',
  dam:     'Dam (दाम)',
  bigha:   'Bigha (बिघा)',
  kattha:  'Kattha (कठ्ठा)',
  dhur:    'Dhur (धुर)',
  sqft:    'Square Feet (sq ft)',
  sqm:     'Square Meters (sq m)',
  sqyard:  'Square Yards (sq yd)',
  acre:    'Acres',
  hectare: 'Hectares',
};

const PLACEHOLDERS: Record<Unit, string> = {
  ropani:  '0', aana: '0', paisa: '0', dam: '0',
  bigha:   '0', kattha: '0', dhur: '0',
  sqft:    '0', sqm: '0', sqyard: '0', acre: '0', hectare: '0',
};

function fmt(val: number): string {
  if (val === 0) return '';
  // Show up to 6 significant digits, strip trailing zeros
  return parseFloat(val.toPrecision(7)).toString();
}

export function NepalLandConverterTool() {
  const [values, setValues] = useState<Partial<Record<Unit, string>>>({});

  const handleChange = useCallback((unit: Unit, raw: string) => {
    if (raw === '' || raw === '.') {
      setValues({ [unit]: raw });
      return;
    }
    const num = parseFloat(raw);
    if (isNaN(num) || num < 0) return;

    const sqft = num * TO_SQFT[unit];
    const next: Partial<Record<Unit, string>> = {};
    for (const u of Object.keys(TO_SQFT) as Unit[]) {
      next[u] = u === unit ? raw : fmt(sqft / TO_SQFT[u]);
    }
    setValues(next);
  }, []);

  const clear = () => setValues({});

  const hasValue = Object.values(values).some(v => v && v !== '0');

  const inputClass =
    'w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 font-mono';
  const labelClass = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1';

  function Section({
    title,
    units,
    badge,
    badgeColor,
  }: {
    title: string;
    units: Unit[];
    badge?: string;
    badgeColor?: string;
  }) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
          {badge && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {units.map(unit => (
            <div key={unit}>
              <label className={labelClass}>{LABELS[unit]}</label>
              <div className="flex gap-1 items-center">
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder={PLACEHOLDERS[unit]}
                  value={values[unit] ?? ''}
                  onChange={e => handleChange(unit, e.target.value)}
                  className={inputClass}
                />
                {values[unit] && values[unit] !== '0' && (
                  <CopyButton text={values[unit]!} size="sm" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-xs text-amber-800 dark:text-amber-300">
        Type any value in any field — all other units update instantly. Nepal uses two distinct systems: <strong>Ropani/Aana</strong> for hilly regions and <strong>Bigha/Kattha</strong> for the Terai.
      </div>

      <Section
        title="Hilly Region (पहाड) — Ropani System"
        units={HILLY_UNITS}
        badge="Pahad"
        badgeColor="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
      />
      <Section
        title="Terai Region (तराई) — Bigha System"
        units={TERAI_UNITS}
        badge="Terai"
        badgeColor="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
      />
      <Section
        title="International Units"
        units={INTL_UNITS}
        badge="Global"
        badgeColor="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
      />

      {hasValue && (
        <button
          onClick={clear}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear all
        </button>
      )}

      {/* Quick Reference Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Quick Reference — Hilly (Ropani)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                {['Unit', 'Sq Ft', 'Sq Meters', 'Aana', 'Paisa', 'Dam'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {[
                ['1 Ropani', '5,476', '508.72', '16', '64', '256'],
                ['1 Aana',   '342.25', '31.80', '1', '4', '16'],
                ['1 Paisa',  '85.56',  '7.95',  '—', '1', '4'],
                ['1 Dam',    '21.39',  '1.99',  '—', '—', '1'],
              ].map(row => (
                <tr key={row[0]} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  {row.map((cell, i) => (
                    <td key={i} className={`px-3 py-2 ${i === 0 ? 'font-medium text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Quick Reference — Terai (Bigha)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                {['Unit', 'Sq Ft', 'Sq Meters', 'Kattha', 'Dhur'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {[
                ['1 Bigha',  '72,900', '6,772.63', '20', '400'],
                ['1 Kattha', '3,645',  '338.63',   '1',  '20'],
                ['1 Dhur',   '182.25', '16.93',    '—',  '1'],
              ].map(row => (
                <tr key={row[0]} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  {row.map((cell, i) => (
                    <td key={i} className={`px-3 py-2 ${i === 0 ? 'font-medium text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
