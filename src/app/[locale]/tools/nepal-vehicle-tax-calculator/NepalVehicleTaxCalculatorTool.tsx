'use client';

import { useState, useMemo } from 'react';
import { Calculator, Info, CalendarClock, Zap } from 'lucide-react';

// ── Tax rate tables ───────────────────────────────────────────────────────────
type VehicleType = 'motorcycle' | 'car' | 'electric-motorcycle' | 'electric-car';

interface TaxSlabRow {
  label: string;
  ccMin: number;
  ccMax: number;  // Infinity for open-ended
  annualTax: number;
}

const MOTORCYCLE_SLABS: TaxSlabRow[] = [
  { label: 'Up to 125cc',  ccMin: 0,   ccMax: 125,      annualTax: 2500 },
  { label: '126 – 250cc',  ccMin: 126, ccMax: 250,      annualTax: 4500 },
  { label: '251cc and above', ccMin: 251, ccMax: Infinity, annualTax: 7500 },
];

const CAR_SLABS: TaxSlabRow[] = [
  { label: 'Up to 1000cc',    ccMin: 0,    ccMax: 1000,     annualTax: 5000  },
  { label: '1001 – 1500cc',   ccMin: 1001, ccMax: 1500,     annualTax: 7500  },
  { label: '1501 – 2000cc',   ccMin: 1501, ccMax: 2000,     annualTax: 10000 },
  { label: '2001 – 2500cc',   ccMin: 2001, ccMax: 2500,     annualTax: 15000 },
  { label: '2501cc and above',ccMin: 2501, ccMax: Infinity, annualTax: 25000 },
];

function getSlabs(type: VehicleType): TaxSlabRow[] | null {
  if (type === 'motorcycle') return MOTORCYCLE_SLABS;
  if (type === 'car')        return CAR_SLABS;
  return null; // electric — flat rate, no CC slabs
}

function getTaxFromSlabs(slabs: TaxSlabRow[], cc: number): TaxSlabRow | null {
  return slabs.find(s => cc >= s.ccMin && cc <= s.ccMax) ?? null;
}

function fmtRs(amount: number): string {
  return 'Rs ' + amount.toLocaleString('en-IN');
}

type Province = 'bagmati' | 'other';

const VEHICLE_TYPE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: 'motorcycle',        label: 'Motorcycle / Scooter' },
  { value: 'car',               label: 'Car / Jeep / Van' },
  { value: 'electric-motorcycle', label: 'Electric Motorcycle / Scooter' },
  { value: 'electric-car',      label: 'Electric Car / EV' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export function NepalVehicleTaxCalculatorTool() {
  const [vehicleType, setVehicleType] = useState<VehicleType>('motorcycle');
  const [cc, setCc] = useState('');
  const [province, setProvince] = useState<Province>('bagmati');
  const [calculated, setCalculated] = useState(false);

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass =
    'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  const isElectric = vehicleType === 'electric-motorcycle' || vehicleType === 'electric-car';
  const needsCc = !isElectric;

  const result = useMemo(() => {
    if (!calculated) return null;

    // Electric vehicles — flat rate
    if (isElectric) {
      const annualTax = vehicleType === 'electric-motorcycle' ? 2000 : 4000;
      return { annualTax, matchedSlab: null, isElectric: true };
    }

    const ccNum = parseInt(cc, 10);
    if (isNaN(ccNum) || ccNum <= 0) return null;

    const slabs = getSlabs(vehicleType)!;
    const matched = getTaxFromSlabs(slabs, ccNum);
    if (!matched) return null;

    return { annualTax: matched.annualTax, matchedSlab: matched, isElectric: false };
  }, [calculated, vehicleType, cc, isElectric]);

  const handleCalculate = () => {
    setCalculated(true);
  };

  const handleReset = () => {
    setCc('');
    setCalculated(false);
  };

  // When vehicle type changes, reset result
  const handleTypeChange = (t: VehicleType) => {
    setVehicleType(t);
    setCalculated(false);
  };

  const slabsForTable = getSlabs(
    vehicleType === 'electric-motorcycle' ? 'motorcycle' :
    vehicleType === 'electric-car'        ? 'car'        :
    vehicleType
  );

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-xs text-amber-800 dark:text-amber-300 flex gap-2">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          Rates shown are <strong>approximate for Bagmati Province (FY 2081/82)</strong>. Rates may vary slightly by province. Always confirm with your local transport office before payment.
        </span>
      </div>

      {/* Inputs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primary-500" />
          Vehicle Details
        </h3>

        {/* Vehicle Type */}
        <div>
          <label className={labelClass}>Vehicle Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {VEHICLE_TYPE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleTypeChange(opt.value)}
                className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors text-center ${
                  vehicleType === opt.value
                    ? 'bg-primary-600 dark:bg-primary-700 border-primary-600 dark:border-primary-700 text-white'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                {opt.value.startsWith('electric') && (
                  <Zap className="w-3.5 h-3.5 inline-block mr-1 mb-0.5 text-yellow-400" />
                )}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Electric vehicle note */}
        {isElectric && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 text-xs text-green-700 dark:text-green-300 flex gap-2">
            <Zap className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-500" />
            <span>
              Electric vehicles have significantly reduced tax rates in Nepal to encourage EV adoption.
              No engine CC entry is required — a flat rate applies.
            </span>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Engine CC */}
          {needsCc && (
            <div>
              <label className={labelClass}>Engine Displacement (CC)</label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 150"
                value={cc}
                onChange={e => { setCc(e.target.value); setCalculated(false); }}
                className={inputClass}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Enter the engine capacity in cubic centimetres</p>
            </div>
          )}

          {/* Province */}
          <div>
            <label className={labelClass}>Province</label>
            <select
              value={province}
              onChange={e => { setProvince(e.target.value as Province); setCalculated(false); }}
              className={inputClass}
            >
              <option value="bagmati">Bagmati Province (default)</option>
              <option value="other">Other Province (approximate)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={needsCc && (!cc || parseInt(cc, 10) <= 0)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm transition-colors"
        >
          <Calculator className="w-4 h-4" />
          Calculate Tax
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
          {/* Annual tax amount */}
          <div className="text-center">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Annual Vehicle Tax (Bagmati Province)</p>
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {fmtRs(result.annualTax)}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">per year</p>
            {province === 'other' && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 inline-block">
                Note: Rates shown are for Bagmati Province. Your province may have slightly different rates.
              </p>
            )}
            {result.isElectric && (
              <p className="mt-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 inline-block">
                EV discount applied — significantly lower than equivalent petrol vehicle tax.
              </p>
            )}
          </div>

          {/* Matched slab highlight */}
          {result.matchedSlab && (
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your engine category</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{result.matchedSlab.label}</p>
              </div>
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{fmtRs(result.matchedSlab.annualTax)} / yr</span>
            </div>
          )}

          {/* Renewal reminder */}
          <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
            <CalendarClock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Renewal Deadline</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                Vehicle tax renewal is due by <strong>Ashad (mid-July)</strong> each year in Nepal. Late renewal incurs a fine.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tax rate table for current vehicle type */}
      {slabsForTable && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Tax Rate Table —{' '}
              {vehicleType === 'electric-car' || vehicleType === 'car' ? 'Car / Jeep / Van' : 'Motorcycle / Scooter'}
              {' '}(Bagmati Province)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  {['Engine Capacity', 'Annual Tax'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {slabsForTable.map((row, i) => {
                  const ccNum = parseInt(cc, 10);
                  const isActive =
                    calculated &&
                    !isElectric &&
                    !isNaN(ccNum) &&
                    ccNum >= row.ccMin &&
                    ccNum <= row.ccMax;

                  return (
                    <tr
                      key={i}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 ${isActive ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                    >
                      <td className={`px-4 py-3 ${isActive ? 'font-semibold text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>
                        {row.label}
                        {isActive && <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full">Your vehicle</span>}
                      </td>
                      <td className={`px-4 py-3 font-mono font-semibold ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-slate-800 dark:text-slate-200'}`}>
                        {fmtRs(row.annualTax)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Electric vehicle rate reference */}
      {isElectric && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Electric Vehicle Tax Rates (Bagmati Province)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  {['Vehicle Type', 'Annual Tax', 'Note'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                <tr className={vehicleType === 'electric-motorcycle' ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}>
                  <td className={`px-4 py-3 font-medium ${vehicleType === 'electric-motorcycle' ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    Electric Motorcycle / Scooter
                    {vehicleType === 'electric-motorcycle' && <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full">Selected</span>}
                  </td>
                  <td className={`px-4 py-3 font-mono font-semibold ${vehicleType === 'electric-motorcycle' ? 'text-primary-700 dark:text-primary-300' : 'text-slate-800 dark:text-slate-200'}`}>Rs 2,000</td>
                  <td className="px-4 py-3 text-xs text-green-600 dark:text-green-400">Flat rate, all kW ratings</td>
                </tr>
                <tr className={vehicleType === 'electric-car' ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}>
                  <td className={`px-4 py-3 font-medium ${vehicleType === 'electric-car' ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    Electric Car / EV
                    {vehicleType === 'electric-car' && <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full">Selected</span>}
                  </td>
                  <td className={`px-4 py-3 font-mono font-semibold ${vehicleType === 'electric-car' ? 'text-primary-700 dark:text-primary-300' : 'text-slate-800 dark:text-slate-200'}`}>Rs 4,000</td>
                  <td className="px-4 py-3 text-xs text-green-600 dark:text-green-400">Flat rate, all kW ratings</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reset button */}
      <button
        onClick={handleReset}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      >
        <Calculator className="w-3.5 h-3.5" />
        Reset
      </button>
    </div>
  );
}
