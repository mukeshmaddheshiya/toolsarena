'use client';

import { useState, useMemo } from 'react';
import { MapPin, Info, ArrowRightLeft } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type LandCategory = 'residential' | 'commercial' | 'agricultural' | 'forest';
type AreaUnit = 'aana' | 'ropani' | 'bigha' | 'kattha' | 'sqft';

interface DistrictData {
  name: string;
  province: string;
  // All prices in NPR per Aana (residential baseline)
  priceMinPerAana: number;
  priceMaxPerAana: number;
  system: 'hilly' | 'terai';
}

// ---------------------------------------------------------------------------
// District price database — prices per Aana, NPR
// ---------------------------------------------------------------------------
const DISTRICTS: DistrictData[] = [
  // Bagmati Province
  { name: 'Kathmandu (Core)',      province: 'Bagmati',   priceMinPerAana: 30000000, priceMaxPerAana: 80000000, system: 'hilly' },
  { name: 'Kathmandu (Outskirts)', province: 'Bagmati',   priceMinPerAana: 8000000,  priceMaxPerAana: 25000000, system: 'hilly' },
  { name: 'Lalitpur',              province: 'Bagmati',   priceMinPerAana: 20000000, priceMaxPerAana: 50000000, system: 'hilly' },
  { name: 'Bhaktapur',             province: 'Bagmati',   priceMinPerAana: 10000000, priceMaxPerAana: 30000000, system: 'hilly' },
  { name: 'Kavrepalanchok',        province: 'Bagmati',   priceMinPerAana: 1000000,  priceMaxPerAana: 5000000,  system: 'hilly' },
  { name: 'Sindhupalchok',         province: 'Bagmati',   priceMinPerAana: 500000,   priceMaxPerAana: 2000000,  system: 'hilly' },
  { name: 'Makwanpur',             province: 'Bagmati',   priceMinPerAana: 800000,   priceMaxPerAana: 3000000,  system: 'hilly' },
  { name: 'Chitwan',               province: 'Bagmati',   priceMinPerAana: 1000000,  priceMaxPerAana: 4000000,  system: 'terai' },
  // Gandaki Province
  { name: 'Pokhara (Kaski)',       province: 'Gandaki',   priceMinPerAana: 5000000,  priceMaxPerAana: 20000000, system: 'hilly' },
  { name: 'Gorkha',                province: 'Gandaki',   priceMinPerAana: 300000,   priceMaxPerAana: 1500000,  system: 'hilly' },
  { name: 'Lamjung',               province: 'Gandaki',   priceMinPerAana: 300000,   priceMaxPerAana: 1200000,  system: 'hilly' },
  { name: 'Tanahu',                province: 'Gandaki',   priceMinPerAana: 400000,   priceMaxPerAana: 1800000,  system: 'hilly' },
  // Lumbini Province
  { name: 'Butwal (Rupandehi)',     province: 'Lumbini',   priceMinPerAana: 3000000,  priceMaxPerAana: 8000000,  system: 'terai' },
  { name: 'Bhairahawa (Rupandehi)',province: 'Lumbini',   priceMinPerAana: 2000000,  priceMaxPerAana: 6000000,  system: 'terai' },
  { name: 'Palpa',                 province: 'Lumbini',   priceMinPerAana: 400000,   priceMaxPerAana: 1500000,  system: 'hilly' },
  { name: 'Dang',                  province: 'Lumbini',   priceMinPerAana: 500000,   priceMaxPerAana: 2000000,  system: 'terai' },
  { name: 'Kapilvastu',            province: 'Lumbini',   priceMinPerAana: 300000,   priceMaxPerAana: 1200000,  system: 'terai' },
  // Madhesh Province
  { name: 'Janakpur (Dhanusha)',   province: 'Madhesh',   priceMinPerAana: 1000000,  priceMaxPerAana: 4000000,  system: 'terai' },
  { name: 'Birgunj (Parsa)',       province: 'Madhesh',   priceMinPerAana: 2000000,  priceMaxPerAana: 7000000,  system: 'terai' },
  { name: 'Rajbiraj (Saptari)',    province: 'Madhesh',   priceMinPerAana: 500000,   priceMaxPerAana: 2000000,  system: 'terai' },
  // Koshi Province
  { name: 'Biratnagar (Morang)',   province: 'Koshi',     priceMinPerAana: 2000000,  priceMaxPerAana: 6000000,  system: 'terai' },
  { name: 'Dharan (Sunsari)',      province: 'Koshi',     priceMinPerAana: 1500000,  priceMaxPerAana: 4000000,  system: 'terai' },
  { name: 'Itahari (Sunsari)',     province: 'Koshi',     priceMinPerAana: 1200000,  priceMaxPerAana: 3500000,  system: 'terai' },
  { name: 'Taplejung',             province: 'Koshi',     priceMinPerAana: 200000,   priceMaxPerAana: 800000,   system: 'hilly' },
  { name: 'Sankhuwasabha',         province: 'Koshi',     priceMinPerAana: 200000,   priceMaxPerAana: 700000,   system: 'hilly' },
  // Sudurpashchim Province
  { name: 'Dhangadhi (Kailali)',   province: 'Sudurpashchim', priceMinPerAana: 800000, priceMaxPerAana: 3000000, system: 'terai' },
  { name: 'Mahendranagar (Kanchanpur)', province: 'Sudurpashchim', priceMinPerAana: 500000, priceMaxPerAana: 2000000, system: 'terai' },
  { name: 'Bajhang',               province: 'Sudurpashchim', priceMinPerAana: 150000, priceMaxPerAana: 500000, system: 'hilly' },
  // Karnali Province
  { name: 'Surkhet',               province: 'Karnali',   priceMinPerAana: 500000,   priceMaxPerAana: 2000000,  system: 'hilly' },
  { name: 'Jumla',                 province: 'Karnali',   priceMinPerAana: 150000,   priceMaxPerAana: 600000,   system: 'hilly' },
  { name: 'Dolpa',                 province: 'Karnali',   priceMinPerAana: 100000,   priceMaxPerAana: 400000,   system: 'hilly' },
];

const PROVINCES = [...new Set(DISTRICTS.map((d) => d.province))];

// Category price multipliers relative to residential baseline
const CATEGORY_MULTIPLIERS: Record<LandCategory, { min: number; max: number; label: string }> = {
  residential:  { min: 1.0, max: 1.0,  label: 'Residential' },
  commercial:   { min: 1.5, max: 2.5,  label: 'Commercial' },
  agricultural: { min: 0.3, max: 0.6,  label: 'Agricultural' },
  forest:       { min: 0.1, max: 0.25, label: 'Forest/Jungle' },
};

// Unit conversion — everything converts to Aana
const AANA_PER_SQFT = 1 / 342.25;
const AANA_PER_UNIT: Record<AreaUnit, number> = {
  aana:   1,
  ropani: 16,
  bigha:  212.96,
  kattha: 10.65,
  sqft:   AANA_PER_SQFT,
};

const UNIT_LABELS: Record<AreaUnit, string> = {
  aana:   'Aana',
  ropani: 'Ropani',
  bigha:  'Bigha',
  kattha: 'Kattha',
  sqft:   'Sq. Feet',
};

function fmt(n: number): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtCrore(n: number): string {
  if (n >= 10000000) return `रु ${(n / 10000000).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr`;
  if (n >= 100000)   return `रु ${(n / 100000).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
  return `रु ${fmt(n)}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function NepalLandPriceEstimatorTool() {
  const [province, setProvince]     = useState<string>('Bagmati');
  const [district, setDistrict]     = useState<string>('Kathmandu (Core)');
  const [area, setArea]             = useState<string>('4');
  const [areaUnit, setAreaUnit]     = useState<AreaUnit>('aana');
  const [category, setCategory]     = useState<LandCategory>('residential');

  // Converter state
  const [convValue, setConvValue]   = useState<string>('1');
  const [convFrom, setConvFrom]     = useState<AreaUnit>('ropani');
  const [convTo, setConvTo]         = useState<AreaUnit>('sqft');

  const filteredDistricts = useMemo(
    () => DISTRICTS.filter((d) => d.province === province),
    [province],
  );

  const selectedDistrict = DISTRICTS.find((d) => d.name === district);

  const estimate = useMemo(() => {
    if (!selectedDistrict) return null;
    const areaNum = parseFloat(area) || 0;
    if (areaNum <= 0) return null;

    const aanaCount = areaNum * AANA_PER_UNIT[areaUnit];
    const mult = CATEGORY_MULTIPLIERS[category];

    const totalMin = selectedDistrict.priceMinPerAana * mult.min * aanaCount;
    const totalMax = selectedDistrict.priceMaxPerAana * mult.max * aanaCount;
    const totalMid = (totalMin + totalMax) / 2;

    const perAanaMin = selectedDistrict.priceMinPerAana * mult.min;
    const perAanaMax = selectedDistrict.priceMaxPerAana * mult.max;

    return { totalMin, totalMax, totalMid, perAanaMin, perAanaMax, aanaCount };
  }, [selectedDistrict, area, areaUnit, category]);

  // Converter
  const convResult = useMemo(() => {
    const n = parseFloat(convValue) || 0;
    if (n <= 0) return 0;
    const inAana = n * AANA_PER_UNIT[convFrom];
    return inAana / AANA_PER_UNIT[convTo];
  }, [convValue, convFrom, convTo]);

  function swapConv() {
    setConvFrom(convTo);
    setConvTo(convFrom);
  }

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-5 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Nepal Land Price Estimator
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Province */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Province
            </label>
            <select
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                const firstDistrict = DISTRICTS.find((d) => d.province === e.target.value);
                if (firstDistrict) setDistrict(firstDistrict.name);
              }}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">
              District / Area
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              {filteredDistricts.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Area */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Land Area
            </label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter area"
              min="0"
              step="0.5"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Unit
            </label>
            <select
              value={areaUnit}
              onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              {(Object.keys(UNIT_LABELS) as AreaUnit[]).map((u) => (
                <option key={u} value={u}>{UNIT_LABELS[u]}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Land Category
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.keys(CATEGORY_MULTIPLIERS) as LandCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={[
                    'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                    category === cat
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400',
                  ].join(' ')}
                >
                  {CATEGORY_MULTIPLIERS[cat].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Estimate result */}
      {estimate ? (
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:border-blue-900/50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <h3 className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            Estimated Price — {district} · {CATEGORY_MULTIPLIERS[category].label}
          </h3>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-500">
            {parseFloat(area)} {UNIT_LABELS[areaUnit]} ≈ {estimate.aanaCount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Aana
          </p>

          {/* Main range */}
          <div className="mb-4 rounded-xl bg-blue-600 px-6 py-4 text-center text-white">
            <p className="text-sm opacity-80">Estimated Price Range</p>
            <p className="mt-1 text-2xl font-bold">
              {fmtCrore(estimate.totalMin)} — {fmtCrore(estimate.totalMax)}
            </p>
            <p className="mt-1 text-sm opacity-80">
              Mid estimate: <span className="font-semibold">{fmtCrore(estimate.totalMid)}</span>
            </p>
          </div>

          {/* Per Aana */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white/70 p-3 text-center dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Price/Aana (Min)</p>
              <p className="mt-0.5 font-semibold text-gray-800 dark:text-gray-100">
                {fmtCrore(estimate.perAanaMin)}
              </p>
            </div>
            <div className="rounded-lg bg-white/70 p-3 text-center dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Price/Aana (Max)</p>
              <p className="mt-0.5 font-semibold text-gray-800 dark:text-gray-100">
                {fmtCrore(estimate.perAanaMax)}
              </p>
            </div>
            <div className="rounded-lg bg-white/70 p-3 text-center dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Area</p>
              <p className="mt-0.5 font-semibold text-gray-800 dark:text-gray-100">
                {estimate.aanaCount.toLocaleString('en-IN', { maximumFractionDigits: 3 })} Aana
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter a land area above to see the estimated price range.
          </p>
        </div>
      )}

      {/* District reference table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            Reference Price Ranges — Residential (per Aana)
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Indicative 2025 market figures · Commercial land 1.5–2.5x · Agricultural 0.3–0.6x
          </p>
        </div>
        {/* Mobile: card layout / Desktop: table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">
                <th className="px-4 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-400">Area</th>
                <th className="px-4 py-2.5 text-right font-semibold text-gray-600 dark:text-gray-400">Min / Aana</th>
                <th className="px-4 py-2.5 text-right font-semibold text-gray-600 dark:text-gray-400">Max / Aana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {DISTRICTS.map((d) => (
                <tr
                  key={d.name}
                  onClick={() => {
                    setProvince(d.province);
                    setDistrict(d.name);
                  }}
                  className="cursor-pointer hover:bg-blue-50/40 dark:hover:bg-blue-950/20"
                >
                  <td className="px-4 py-2.5">
                    <span className="font-medium text-gray-800 dark:text-gray-100">{d.name}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{d.province}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-400">
                    {fmtCrore(d.priceMinPerAana)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-800 dark:text-gray-100">
                    {fmtCrore(d.priceMaxPerAana)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile card list */}
        <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-700">
          {DISTRICTS.map((d) => (
            <button
              key={d.name}
              onClick={() => {
                setProvince(d.province);
                setDistrict(d.name);
              }}
              className="w-full px-4 py-3 text-left hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-100 text-sm">{d.name}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">{d.province}</span>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-medium text-gray-800 dark:text-gray-100">{fmtCrore(d.priceMaxPerAana)}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">{fmtCrore(d.priceMinPerAana)} min</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Unit converter */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 font-semibold text-gray-800 dark:text-gray-100">
          Nepal Land Unit Converter
        </h3>

        <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Amount
            </label>
            <input
              type="number"
              value={convValue}
              onChange={(e) => setConvValue(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              min="0"
            />
            <select
              value={convFrom}
              onChange={(e) => setConvFrom(e.target.value as AreaUnit)}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              {(Object.keys(UNIT_LABELS) as AreaUnit[]).map((u) => (
                <option key={u} value={u}>{UNIT_LABELS[u]}</option>
              ))}
            </select>
          </div>

          <button
            onClick={swapConv}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Result
            </label>
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
              {convResult.toLocaleString('en-IN', { maximumFractionDigits: 6 })}
            </div>
            <select
              value={convTo}
              onChange={(e) => setConvTo(e.target.value as AreaUnit)}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              {(Object.keys(UNIT_LABELS) as AreaUnit[]).map((u) => (
                <option key={u} value={u}>{UNIT_LABELS[u]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-700/40 dark:text-gray-400 sm:grid-cols-2">
          <p>1 Ropani = 16 Aana = 5476 sq ft = 508.72 sq m</p>
          <p>1 Aana = 4 Paisa = 342.25 sq ft = 31.8 sq m</p>
          <p>1 Bigha = 20 Kattha = 72,900 sq ft (Terai)</p>
          <p>1 Kattha = 20 Dhur = 3,645 sq ft (Terai)</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          These are indicative estimates only, based on approximate 2025 market data. Actual land
          prices vary significantly by exact location, road access, shape, legal status, and current
          market conditions. Always consult your local Land Revenue Office (Malpot Karyalaya) and
          registered brokers for official valuations before any transaction.
        </span>
      </div>
    </div>
  );
}
