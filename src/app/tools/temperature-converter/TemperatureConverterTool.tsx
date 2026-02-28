'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { Thermometer } from 'lucide-react';

function celsiusToAll(c: number) {
  return { c, f: c * 9/5 + 32, k: c + 273.15 };
}
function fahrenheitToAll(f: number) {
  const c = (f - 32) * 5/9;
  return { c, f, k: c + 273.15 };
}
function kelvinToAll(k: number) {
  const c = k - 273.15;
  return { c, f: c * 9/5 + 32, k };
}

const REFS = [
  { label: 'Absolute Zero', c: -273.15, emoji: '🥶' },
  { label: 'Water Freezing', c: 0, emoji: '🧊' },
  { label: 'Room Temperature', c: 22, emoji: '🏠' },
  { label: 'Body Temperature', c: 37, emoji: '🌡️' },
  { label: 'Water Boiling', c: 100, emoji: '♨️' },
  { label: 'Oven (Medium)', c: 180, emoji: '🍳' },
];

export function TemperatureConverterTool() {
  const [active, setActive] = useState<'c' | 'f' | 'k'>('c');
  const [value, setValue] = useState('0');

  const numVal = parseFloat(value);
  const temps = isNaN(numVal)
    ? null
    : active === 'c' ? celsiusToAll(numVal)
    : active === 'f' ? fahrenheitToAll(numVal)
    : kelvinToAll(numVal);

  const fmt = (n: number) => parseFloat(n.toFixed(4)).toString();

  function setRef(c: number) {
    setActive('c');
    setValue(String(c));
  }

  return (
    <div className="space-y-6">
      {/* Input grid */}
      <div className="grid grid-cols-3 gap-4">
        {([['c', '°C', 'Celsius'], ['f', '°F', 'Fahrenheit'], ['k', 'K', 'Kelvin']] as const).map(([unit, symbol, name]) => (
          <div key={unit}>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              {name} ({symbol})
            </label>
            <div className="relative">
              <input
                type="number"
                value={active === unit ? value : temps ? fmt(temps[unit]) : ''}
                onChange={e => { setActive(unit); setValue(e.target.value); }}
                onFocus={() => setActive(unit)}
                placeholder="Enter value"
                className={`w-full px-3 py-3 pr-10 rounded-xl border text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 ${active === unit ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{symbol}</span>
            </div>
            {temps && active !== unit && (
              <CopyButton text={fmt(temps[unit])} size="sm" className="mt-1" />
            )}
          </div>
        ))}
      </div>

      {/* Result display */}
      {temps && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 rounded-2xl p-5 border border-primary-100 dark:border-primary-800">
          <div className="flex items-center gap-2 mb-3">
            <Thermometer className="w-4 h-4 text-primary-700 dark:text-primary-400" />
            <span className="text-sm font-semibold text-primary-800 dark:text-primary-300">Conversion Result</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-heading font-bold text-primary-800 dark:text-primary-300">{fmt(temps.c)}°C</div>
              <div className="text-xs text-slate-500 mt-0.5">Celsius</div>
            </div>
            <div>
              <div className="text-2xl font-heading font-bold text-primary-800 dark:text-primary-300">{fmt(temps.f)}°F</div>
              <div className="text-xs text-slate-500 mt-0.5">Fahrenheit</div>
            </div>
            <div>
              <div className="text-2xl font-heading font-bold text-primary-800 dark:text-primary-300">{fmt(temps.k)} K</div>
              <div className="text-xs text-slate-500 mt-0.5">Kelvin</div>
            </div>
          </div>
        </div>
      )}

      {/* Reference temperatures */}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Common Reference Temperatures</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {REFS.map(ref => (
            <button key={ref.label} onClick={() => setRef(ref.c)} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left">
              <span className="text-lg">{ref.emoji}</span>
              <div>
                <div className="text-xs font-medium text-slate-900 dark:text-slate-100 leading-tight">{ref.label}</div>
                <div className="text-xs text-slate-500">{ref.c}°C / {(ref.c * 9/5 + 32).toFixed(1)}°F</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
