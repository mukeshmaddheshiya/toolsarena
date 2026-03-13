'use client';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

type DistanceUnit = 'km' | 'miles';
type EfficiencyUnit = 'km_per_l' | 'l_per_100km' | 'mpg';
type FuelType = 'petrol' | 'diesel' | 'electric';

interface Leg {
  id: number;
  label: string;
  distance: string;
}

const NEPAL_PRICES: Record<FuelType, number> = {
  petrol: 178,
  diesel: 163,
  electric: 15, // approx Rs/kWh
};

function toKm(distance: number, unit: DistanceUnit): number {
  return unit === 'miles' ? distance * 1.60934 : distance;
}

function fuelNeededLitres(distKm: number, efficiencyNum: number, effUnit: EfficiencyUnit): number {
  if (efficiencyNum <= 0) return 0;
  if (effUnit === 'km_per_l') return distKm / efficiencyNum;
  if (effUnit === 'l_per_100km') return (distKm / 100) * efficiencyNum;
  // mpg → litres: mpg to km/L = mpg * 0.425144
  const kmPerL = efficiencyNum * 0.425144;
  return distKm / kmPerL;
}

function kwhNeeded(distKm: number, kwhPer100km: number): number {
  return (distKm / 100) * kwhPer100km;
}

interface CalcResult {
  fuelOrEnergy: number;
  totalCost: number;
  costPerKm: number;
  costPer100km: number;
  costPerMile: number;
  costPerPerson: number;
}

function calculate(
  distKm: number,
  efficiencyNum: number,
  effUnit: EfficiencyUnit,
  fuelType: FuelType,
  fuelPrice: number,
  kwhPer100km: number,
  kwhPrice: number,
  passengers: number
): CalcResult | null {
  if (distKm <= 0 || fuelPrice <= 0) return null;

  let fuelOrEnergy = 0;
  let totalCost = 0;

  if (fuelType === 'electric') {
    if (kwhPer100km <= 0 || kwhPrice <= 0) return null;
    fuelOrEnergy = kwhNeeded(distKm, kwhPer100km);
    totalCost = fuelOrEnergy * kwhPrice;
  } else {
    if (efficiencyNum <= 0) return null;
    fuelOrEnergy = fuelNeededLitres(distKm, efficiencyNum, effUnit);
    totalCost = fuelOrEnergy * fuelPrice;
  }

  const costPerKm = distKm > 0 ? totalCost / distKm : 0;
  const costPer100km = costPerKm * 100;
  const costPerMile = costPerKm * 1.60934;
  const costPerPerson = passengers > 0 ? totalCost / passengers : totalCost;

  return { fuelOrEnergy, totalCost, costPerKm, costPer100km, costPerMile, costPerPerson };
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</div>
      <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
      {sub && <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}

let legIdCounter = 3;

export function FuelCostCalculatorTool() {
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('km');
  const [effUnit, setEffUnit] = useState<EfficiencyUnit>('km_per_l');
  const [fuelType, setFuelType] = useState<FuelType>('petrol');
  const [distance, setDistance] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [fuelPrice, setFuelPrice] = useState(String(NEPAL_PRICES.petrol));
  const [kwhPer100km, setKwhPer100km] = useState('15');
  const [kwhPrice, setKwhPrice] = useState(String(NEPAL_PRICES.electric));
  const [passengers, setPassengers] = useState(1);
  const [roundTrip, setRoundTrip] = useState(false);

  // Trip planner
  const [legs, setLegs] = useState<Leg[]>([
    { id: 1, label: 'Leg 1', distance: '' },
    { id: 2, label: 'Leg 2', distance: '' },
  ]);

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  const distNum = parseFloat(distance) || 0;
  const effNum = parseFloat(efficiency) || 0;
  const fuelPriceNum = parseFloat(fuelPrice) || 0;
  const kwhPer100Num = parseFloat(kwhPer100km) || 0;
  const kwhPriceNum = parseFloat(kwhPrice) || 0;

  const actualDistKm = toKm(distNum, distanceUnit) * (roundTrip ? 2 : 1);

  const result = calculate(actualDistKm, effNum, effUnit, fuelType, fuelPriceNum, kwhPer100Num, kwhPriceNum, passengers);

  // Trip planner total
  const totalLegKm = legs.reduce((sum, l) => sum + toKm(parseFloat(l.distance) || 0, distanceUnit), 0);
  const tripResult = totalLegKm > 0
    ? calculate(totalLegKm, effNum, effUnit, fuelType, fuelPriceNum, kwhPer100Num, kwhPriceNum, passengers)
    : null;

  function handleFuelTypeChange(ft: FuelType) {
    setFuelType(ft);
    setFuelPrice(String(NEPAL_PRICES[ft]));
  }

  function addLeg() {
    if (legs.length >= 5) return;
    legIdCounter++;
    setLegs(prev => [...prev, { id: legIdCounter, label: `Leg ${prev.length + 1}`, distance: '' }]);
  }

  function removeLeg(id: number) {
    setLegs(prev => prev.filter(l => l.id !== id));
  }

  function updateLeg(id: number, field: keyof Leg, val: string) {
    setLegs(prev => prev.map(l => l.id === id ? { ...l, [field]: val } : l));
  }

  const effLabel = effUnit === 'km_per_l' ? 'km/L' : effUnit === 'l_per_100km' ? 'L/100km' : 'mpg';
  const fuelUnit = fuelType === 'electric' ? 'kWh' : 'litres';
  const currency = 'Rs';

  return (
    <div className="space-y-6">
      {/* Fuel Type selector */}
      <div>
        <label className={labelClass}>Fuel Type</label>
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
          {(['petrol', 'diesel', 'electric'] as FuelType[]).map(ft => (
            <button
              key={ft}
              onClick={() => handleFuelTypeChange(ft)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${fuelType === ft ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {ft === 'electric' ? '⚡ Electric' : ft === 'petrol' ? '⛽ Petrol' : '🛢 Diesel'}
            </button>
          ))}
        </div>
      </div>

      {/* Main inputs */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Distance */}
        <div>
          <label className={labelClass}>Distance</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={distance}
              onChange={e => setDistance(e.target.value)}
              placeholder="e.g. 100"
              className={inputClass}
              min="0"
            />
            <select value={distanceUnit} onChange={e => setDistanceUnit(e.target.value as DistanceUnit)} className="px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100">
              <option value="km">km</option>
              <option value="miles">miles</option>
            </select>
          </div>
        </div>

        {/* Passengers */}
        <div>
          <label className={labelClass}>Passengers (for per-person cost)</label>
          <input
            type="number"
            value={passengers}
            onChange={e => setPassengers(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
            min="1"
            max="8"
            className={inputClass}
          />
        </div>

        {/* Fuel efficiency — hidden for electric */}
        {fuelType !== 'electric' && (
          <>
            <div>
              <label className={labelClass}>Fuel Efficiency</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={efficiency}
                  onChange={e => setEfficiency(e.target.value)}
                  placeholder={effUnit === 'km_per_l' ? 'e.g. 15' : effUnit === 'l_per_100km' ? 'e.g. 7' : 'e.g. 35'}
                  className={inputClass}
                  min="0"
                />
                <select value={effUnit} onChange={e => setEffUnit(e.target.value as EfficiencyUnit)} className="px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 whitespace-nowrap">
                  <option value="km_per_l">km/L</option>
                  <option value="l_per_100km">L/100km</option>
                  <option value="mpg">mpg</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Fuel Price per litre ({currency})
                <span className="ml-2 text-xs text-slate-400 dark:text-slate-500 font-normal">Nepal default — update as needed</span>
              </label>
              <input
                type="number"
                value={fuelPrice}
                onChange={e => setFuelPrice(e.target.value)}
                placeholder="e.g. 178"
                className={inputClass}
                min="0"
              />
            </div>
          </>
        )}

        {/* Electric specific */}
        {fuelType === 'electric' && (
          <>
            <div>
              <label className={labelClass}>Energy Consumption (kWh/100km)</label>
              <input
                type="number"
                value={kwhPer100km}
                onChange={e => setKwhPer100km(e.target.value)}
                placeholder="e.g. 15"
                className={inputClass}
                min="0"
              />
            </div>
            <div>
              <label className={labelClass}>
                Electricity Price per kWh ({currency})
                <span className="ml-2 text-xs text-slate-400 dark:text-slate-500 font-normal">Nepal default</span>
              </label>
              <input
                type="number"
                value={kwhPrice}
                onChange={e => setKwhPrice(e.target.value)}
                placeholder="e.g. 15"
                className={inputClass}
                min="0"
              />
            </div>
          </>
        )}
      </div>

      {/* Round trip toggle */}
      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <div
          onClick={() => setRoundTrip(r => !r)}
          className={`relative w-11 h-6 rounded-full transition-colors ${roundTrip ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}
        >
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${roundTrip ? 'translate-x-5' : ''}`} />
        </div>
        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Round trip (doubles distance)</span>
      </label>

      {/* Results */}
      {result && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Results for {actualDistKm.toFixed(1)} km{roundTrip ? ' (round trip)' : ''}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard
              label={fuelType === 'electric' ? 'Energy Needed' : 'Fuel Needed'}
              value={`${result.fuelOrEnergy.toFixed(2)} ${fuelUnit}`}
            />
            <StatCard
              label="Total Cost"
              value={`${currency} ${result.totalCost.toFixed(2)}`}
            />
            <StatCard
              label="Cost per km"
              value={`${currency} ${result.costPerKm.toFixed(2)}`}
            />
            <StatCard
              label="Cost per 100km"
              value={`${currency} ${result.costPer100km.toFixed(2)}`}
            />
            <StatCard
              label="Cost per mile"
              value={`${currency} ${result.costPerMile.toFixed(2)}`}
            />
            <StatCard
              label={`Cost per person`}
              value={`${currency} ${result.costPerPerson.toFixed(2)}`}
              sub={`${passengers} passenger${passengers > 1 ? 's' : ''}`}
            />
          </div>
        </div>
      )}

      {/* Trip planner */}
      <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Trip Planner (multiple legs)</h3>
          {legs.length < 5 && (
            <button
              onClick={addLeg}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 border border-primary-200 dark:border-primary-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Leg
            </button>
          )}
        </div>

        <div className="space-y-2">
          {legs.map((leg, i) => (
            <div key={leg.id} className="flex items-center gap-2">
              <input
                type="text"
                value={leg.label}
                onChange={e => updateLeg(leg.id, 'label', e.target.value)}
                placeholder={`Leg ${i + 1} label`}
                className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
              />
              <input
                type="number"
                value={leg.distance}
                onChange={e => updateLeg(leg.id, 'distance', e.target.value)}
                placeholder={`Distance (${distanceUnit})`}
                min="0"
                className="w-40 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
              />
              {legs.length > 1 && (
                <button
                  onClick={() => removeLeg(leg.id)}
                  className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {tripResult && (
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Total trip: {totalLegKm.toFixed(1)} km across {legs.filter(l => parseFloat(l.distance) > 0).length} leg(s)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard label="Total Fuel/Energy" value={`${tripResult.fuelOrEnergy.toFixed(2)} ${fuelUnit}`} />
              <StatCard label="Total Trip Cost" value={`${currency} ${tripResult.totalCost.toFixed(2)}`} />
              <StatCard label="Cost per Person" value={`${currency} ${tripResult.costPerPerson.toFixed(2)}`} sub={`${passengers} pax`} />
            </div>
          </div>
        )}

        {!tripResult && totalLegKm === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500">Enter distances for each leg above. Uses the same fuel settings from the calculator.</p>
        )}
      </div>
    </div>
  );
}
