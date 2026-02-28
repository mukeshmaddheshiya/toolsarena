'use client';
import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { ArrowLeftRight } from 'lucide-react';

type Category = 'length' | 'weight' | 'volume' | 'area' | 'speed' | 'data' | 'energy' | 'pressure';

const UNITS: Record<Category, { name: string; units: { label: string; factor: number }[] }> = {
  length: { name: 'Length', units: [
    { label: 'Meter (m)', factor: 1 },
    { label: 'Kilometer (km)', factor: 1000 },
    { label: 'Centimeter (cm)', factor: 0.01 },
    { label: 'Millimeter (mm)', factor: 0.001 },
    { label: 'Mile (mi)', factor: 1609.344 },
    { label: 'Yard (yd)', factor: 0.9144 },
    { label: 'Foot (ft)', factor: 0.3048 },
    { label: 'Inch (in)', factor: 0.0254 },
    { label: 'Nautical Mile', factor: 1852 },
  ]},
  weight: { name: 'Weight / Mass', units: [
    { label: 'Kilogram (kg)', factor: 1 },
    { label: 'Gram (g)', factor: 0.001 },
    { label: 'Milligram (mg)', factor: 0.000001 },
    { label: 'Pound (lb)', factor: 0.453592 },
    { label: 'Ounce (oz)', factor: 0.028349 },
    { label: 'Metric Ton (t)', factor: 1000 },
    { label: 'Stone (st)', factor: 6.35029 },
    { label: 'Quintal', factor: 100 },
  ]},
  volume: { name: 'Volume', units: [
    { label: 'Liter (L)', factor: 1 },
    { label: 'Milliliter (mL)', factor: 0.001 },
    { label: 'Cubic Meter (m³)', factor: 1000 },
    { label: 'US Gallon', factor: 3.78541 },
    { label: 'UK Gallon', factor: 4.54609 },
    { label: 'US Quart', factor: 0.946353 },
    { label: 'US Pint', factor: 0.473176 },
    { label: 'US Cup', factor: 0.236588 },
    { label: 'Tablespoon (US)', factor: 0.0147868 },
    { label: 'Teaspoon (US)', factor: 0.00492892 },
  ]},
  area: { name: 'Area', units: [
    { label: 'Square Meter (m²)', factor: 1 },
    { label: 'Square Kilometer (km²)', factor: 1000000 },
    { label: 'Square Centimeter (cm²)', factor: 0.0001 },
    { label: 'Square Foot (ft²)', factor: 0.092903 },
    { label: 'Square Inch (in²)', factor: 0.00064516 },
    { label: 'Acre', factor: 4046.86 },
    { label: 'Hectare (ha)', factor: 10000 },
    { label: 'Square Mile', factor: 2589988.11 },
  ]},
  speed: { name: 'Speed', units: [
    { label: 'km/h', factor: 1 },
    { label: 'm/s', factor: 3.6 },
    { label: 'mph', factor: 1.60934 },
    { label: 'Knot', factor: 1.852 },
    { label: 'ft/s', factor: 1.09728 },
    { label: 'Mach (at sea level)', factor: 1225.08 },
  ]},
  data: { name: 'Data Storage', units: [
    { label: 'Byte (B)', factor: 1 },
    { label: 'Kilobyte (KB)', factor: 1024 },
    { label: 'Megabyte (MB)', factor: 1048576 },
    { label: 'Gigabyte (GB)', factor: 1073741824 },
    { label: 'Terabyte (TB)', factor: 1099511627776 },
    { label: 'Bit (b)', factor: 0.125 },
    { label: 'Kilobit (Kb)', factor: 125 },
    { label: 'Megabit (Mb)', factor: 125000 },
  ]},
  energy: { name: 'Energy', units: [
    { label: 'Joule (J)', factor: 1 },
    { label: 'Kilojoule (kJ)', factor: 1000 },
    { label: 'Calorie (cal)', factor: 4.184 },
    { label: 'Kilocalorie (kcal)', factor: 4184 },
    { label: 'Watt-hour (Wh)', factor: 3600 },
    { label: 'Kilowatt-hour (kWh)', factor: 3600000 },
    { label: 'BTU', factor: 1055.06 },
    { label: 'Electron-volt (eV)', factor: 1.60218e-19 },
  ]},
  pressure: { name: 'Pressure', units: [
    { label: 'Pascal (Pa)', factor: 1 },
    { label: 'Kilopascal (kPa)', factor: 1000 },
    { label: 'Bar', factor: 100000 },
    { label: 'PSI', factor: 6894.76 },
    { label: 'Atmosphere (atm)', factor: 101325 },
    { label: 'mmHg (Torr)', factor: 133.322 },
  ]},
};

function formatNumber(n: number): string {
  if (!isFinite(n) || isNaN(n)) return 'Invalid';
  if (n === 0) return '0';
  if (Math.abs(n) >= 1e-4 && Math.abs(n) < 1e12) {
    const str = parseFloat(n.toPrecision(8)).toString();
    return str;
  }
  return n.toExponential(4);
}

export function UnitConverterTool() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [value, setValue] = useState('1');

  const cat = UNITS[category];
  const fromFactor = cat.units[fromUnit]?.factor || 1;
  const toFactor = cat.units[toUnit]?.factor || 1;
  const result = parseFloat(value) * fromFactor / toFactor;
  const resultStr = formatNumber(result);

  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  function changeCategory(c: Category) {
    setCategory(c);
    setFromUnit(0);
    setToUnit(1);
    setValue('1');
  }

  const allResults = useMemo(() => {
    const inputVal = parseFloat(value) * fromFactor;
    return cat.units.map((u, i) => ({
      label: u.label,
      value: formatNumber(inputVal / u.factor),
      active: i === toUnit,
    }));
  }, [value, fromFactor, cat, toUnit]);

  return (
    <div className="space-y-5">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
        {(Object.keys(UNITS) as Category[]).map(c => (
          <button key={c} onClick={() => changeCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${category === c ? 'bg-white dark:bg-slate-800 text-primary-800 dark:text-primary-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>
            {UNITS[c].name}
          </button>
        ))}
      </div>

      {/* Main converter */}
      <div className="grid sm:grid-cols-[1fr,auto,1fr] gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">From</label>
          <select value={fromUnit} onChange={e => setFromUnit(parseInt(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 mb-2">
            {cat.units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
          </select>
          <input type="number" value={value} onChange={e => setValue(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
        </div>
        <button onClick={swapUnits} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-400 transition-colors mb-0.5">
          <ArrowLeftRight className="w-4 h-4 text-slate-500" />
        </button>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">To</label>
          <select value={toUnit} onChange={e => setToUnit(parseInt(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 mb-2">
            {cat.units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
          </select>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
            <span className="flex-1 text-lg font-bold text-primary-800 dark:text-primary-300">{resultStr}</span>
            <CopyButton text={resultStr} size="sm" label="" />
          </div>
        </div>
      </div>

      {/* All units table */}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">All {cat.name} Conversions</p>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="min-w-full text-sm">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {allResults.map((r, i) => (
                <tr key={i} onClick={() => setToUnit(i)} className={`cursor-pointer transition-colors ${r.active ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{r.label}</td>
                  <td className="px-4 py-2 text-right font-mono font-medium text-slate-900 dark:text-slate-100">{r.value}</td>
                  <td className="px-3 py-2"><CopyButton text={r.value} size="sm" label="" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
