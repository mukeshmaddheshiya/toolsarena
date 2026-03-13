'use client';
import { useState, useMemo } from 'react';

const INPUT_CLASS = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const LABEL_CLASS = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
const CARD_CLASS = 'bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4';
const SELECT_CLASS = 'px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';

type SpeedUnit = 'km/h' | 'm/s' | 'mph' | 'knots';
type DistanceUnit = 'km' | 'm' | 'miles' | 'nmi';
type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days';

// Conversions to base units: km and hours
const toKmh: Record<SpeedUnit, number> = {
  'km/h': 1,
  'm/s': 3.6,
  'mph': 1.60934,
  'knots': 1.852,
};

const toKm: Record<DistanceUnit, number> = {
  'km': 1,
  'm': 0.001,
  'miles': 1.60934,
  'nmi': 1.852,
};

const toHours: Record<TimeUnit, number> = {
  'seconds': 1 / 3600,
  'minutes': 1 / 60,
  'hours': 1,
  'days': 24,
};

const QUICK_EXAMPLES = [
  { label: 'Car at 60 km/h for 2.5 h', speed: '60', speedUnit: 'km/h' as SpeedUnit, distance: '', distUnit: 'km' as DistanceUnit, time: '2.5', timeUnit: 'hours' as TimeUnit },
  { label: 'Marathon runner (42.2 km in 4 h)', speed: '', speedUnit: 'km/h' as SpeedUnit, distance: '42.2', distUnit: 'km' as DistanceUnit, time: '4', timeUnit: 'hours' as TimeUnit },
  { label: 'Speed of sound (343 m/s)', speed: '343', speedUnit: 'm/s' as SpeedUnit, distance: '', distUnit: 'km' as DistanceUnit, time: '1', timeUnit: 'seconds' as TimeUnit },
];

function fmt(n: number): string {
  if (!isFinite(n) || isNaN(n)) return '';
  if (Math.abs(n) < 0.0001 && n !== 0) return n.toExponential(4);
  const s = parseFloat(n.toPrecision(8)).toString();
  return s;
}

export function SpeedDistanceTimeTool() {
  const [speedVal, setSpeedVal] = useState('');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('km/h');
  const [distVal, setDistVal] = useState('');
  const [distUnit, setDistUnit] = useState<DistanceUnit>('km');
  const [timeVal, setTimeVal] = useState('');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('hours');

  const { result, formula, calculated } = useMemo(() => {
    const s = parseFloat(speedVal);
    const d = parseFloat(distVal);
    const t = parseFloat(timeVal);

    const hasS = !isNaN(s) && speedVal.trim() !== '';
    const hasD = !isNaN(d) && distVal.trim() !== '';
    const hasT = !isNaN(t) && timeVal.trim() !== '';

    const filled = [hasS, hasD, hasT].filter(Boolean).length;
    if (filled !== 2) return { result: null, formula: '', calculated: '' };

    // Convert to km and hours
    const sKmh = hasS ? s * toKmh[speedUnit] : 0;
    const dKm = hasD ? d * toKm[distUnit] : 0;
    const tH = hasT ? t * toHours[timeUnit] : 0;

    if (!hasS) {
      // Calculate speed
      if (tH === 0) return { result: null, formula: '', calculated: '' };
      const calcKmh = dKm / tH;
      const calcInUnit = calcKmh / toKmh[speedUnit];
      return {
        result: calcInUnit,
        formula: 'Speed = Distance ÷ Time',
        calculated: 'speed',
      };
    }
    if (!hasD) {
      // Calculate distance
      const calcKm = sKmh * tH;
      const calcInUnit = calcKm / toKm[distUnit];
      return {
        result: calcInUnit,
        formula: 'Distance = Speed × Time',
        calculated: 'distance',
      };
    }
    // Calculate time
    if (sKmh === 0) return { result: null, formula: '', calculated: '' };
    const calcH = dKm / sKmh;
    const calcInUnit = calcH / toHours[timeUnit];
    return {
      result: calcInUnit,
      formula: 'Time = Distance ÷ Speed',
      calculated: 'time',
    };
  }, [speedVal, speedUnit, distVal, distUnit, timeVal, timeUnit]);

  function applyExample(ex: typeof QUICK_EXAMPLES[0]) {
    setSpeedVal(ex.speed);
    setSpeedUnit(ex.speedUnit);
    setDistVal(ex.distance);
    setDistUnit(ex.distUnit);
    setTimeVal(ex.time);
    setTimeUnit(ex.timeUnit);
  }

  function clearAll() {
    setSpeedVal('');
    setDistVal('');
    setTimeVal('');
  }

  const fieldLabel = (field: string) => {
    if (calculated === field && result !== null)
      return <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-medium">Calculated</span>;
    return null;
  };

  const displayVal = (field: 'speed' | 'distance' | 'time') => {
    if (calculated === field && result !== null) return fmt(result);
    if (field === 'speed') return speedVal;
    if (field === 'distance') return distVal;
    return timeVal;
  };

  return (
    <div className="space-y-6">
      {/* Quick examples */}
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Quick Examples</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_EXAMPLES.map(ex => (
            <button
              key={ex.label}
              onClick={() => applyExample(ex)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors border border-slate-200 dark:border-slate-600"
            >
              {ex.label}
            </button>
          ))}
          <button
            onClick={clearAll}
            className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-800"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-xs text-blue-700 dark:text-blue-300">
        Fill in any <strong>2 fields</strong> and the third will be calculated automatically.
      </div>

      {/* Speed */}
      <div>
        <label className={LABEL_CLASS}>
          Speed {fieldLabel('speed')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={displayVal('speed')}
            onChange={e => { setSpeedVal(e.target.value); }}
            placeholder={calculated === 'speed' ? 'Calculated' : 'Enter speed'}
            disabled={calculated === 'speed'}
            className={INPUT_CLASS + (calculated === 'speed' ? ' bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-semibold' : '')}
          />
          <select value={speedUnit} onChange={e => setSpeedUnit(e.target.value as SpeedUnit)} className={SELECT_CLASS}>
            <option value="km/h">km/h</option>
            <option value="m/s">m/s</option>
            <option value="mph">mph</option>
            <option value="knots">knots</option>
          </select>
        </div>
      </div>

      {/* Distance */}
      <div>
        <label className={LABEL_CLASS}>
          Distance {fieldLabel('distance')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={displayVal('distance')}
            onChange={e => setDistVal(e.target.value)}
            placeholder={calculated === 'distance' ? 'Calculated' : 'Enter distance'}
            disabled={calculated === 'distance'}
            className={INPUT_CLASS + (calculated === 'distance' ? ' bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-semibold' : '')}
          />
          <select value={distUnit} onChange={e => setDistUnit(e.target.value as DistanceUnit)} className={SELECT_CLASS}>
            <option value="km">km</option>
            <option value="m">m</option>
            <option value="miles">miles</option>
            <option value="nmi">naut. miles</option>
          </select>
        </div>
      </div>

      {/* Time */}
      <div>
        <label className={LABEL_CLASS}>
          Time {fieldLabel('time')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={displayVal('time')}
            onChange={e => setTimeVal(e.target.value)}
            placeholder={calculated === 'time' ? 'Calculated' : 'Enter time'}
            disabled={calculated === 'time'}
            className={INPUT_CLASS + (calculated === 'time' ? ' bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-semibold' : '')}
          />
          <select value={timeUnit} onChange={e => setTimeUnit(e.target.value as TimeUnit)} className={SELECT_CLASS}>
            <option value="seconds">seconds</option>
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
            <option value="days">days</option>
          </select>
        </div>
      </div>

      {/* Result */}
      {result !== null && calculated && (
        <div className={CARD_CLASS + ' border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'}>
          <div className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">Formula Used</div>
          <div className="text-sm font-mono text-slate-700 dark:text-slate-300 mb-3">{formula}</div>
          <div className="text-3xl font-heading font-bold text-primary-700 dark:text-primary-300">
            {fmt(result)}{' '}
            <span className="text-lg font-normal text-slate-500 dark:text-slate-400">
              {calculated === 'speed' ? speedUnit : calculated === 'distance' ? distUnit : timeUnit}
            </span>
          </div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400 capitalize">{calculated} calculated</div>
        </div>
      )}

      {/* Reference formulas */}
      <div className={CARD_CLASS}>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Reference Formulas</h3>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          {[
            { label: 'Speed', formula: 'Distance ÷ Time' },
            { label: 'Distance', formula: 'Speed × Time' },
            { label: 'Time', formula: 'Distance ÷ Speed' },
          ].map(({ label, formula: f }) => (
            <div key={label} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-center">
              <div className="font-semibold text-slate-700 dark:text-slate-300">{label}</div>
              <div className="text-slate-500 dark:text-slate-400 font-mono text-xs mt-0.5">= {f}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
