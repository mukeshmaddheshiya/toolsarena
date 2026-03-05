'use client';
import { useState, useMemo, useCallback } from 'react';
import { Zap, IndianRupee, TrendingDown, Info, BarChart3 } from 'lucide-react';

/* ─── Indian State Tariffs (Domestic, FY 2025-26 approximate) ─── */
interface TariffSlab {
  upto: number; // kWh upper limit (Infinity for last slab)
  rate: number; // per unit rate in INR
}

interface StateTariff {
  id: string;
  name: string;
  slabs: TariffSlab[];
  fixedCharge: number; // per month
  meterRent: number;
  dutyPct: number; // electricity duty %
  fuelSurchargePerUnit: number;
}

const TARIFFS: StateTariff[] = [
  {
    id: 'maharashtra', name: 'Maharashtra (MSEDCL)',
    slabs: [{ upto: 100, rate: 4.71 }, { upto: 300, rate: 7.88 }, { upto: 500, rate: 10.29 }, { upto: Infinity, rate: 12.54 }],
    fixedCharge: 130, meterRent: 30, dutyPct: 16, fuelSurchargePerUnit: 0.31,
  },
  {
    id: 'delhi', name: 'Delhi (BSES/Tata Power)',
    slabs: [{ upto: 200, rate: 3.0 }, { upto: 400, rate: 4.5 }, { upto: 800, rate: 6.5 }, { upto: Infinity, rate: 8.0 }],
    fixedCharge: 125, meterRent: 20, dutyPct: 5, fuelSurchargePerUnit: 0.20,
  },
  {
    id: 'karnataka', name: 'Karnataka (BESCOM)',
    slabs: [{ upto: 50, rate: 4.10 }, { upto: 100, rate: 5.45 }, { upto: 200, rate: 7.15 }, { upto: Infinity, rate: 8.85 }],
    fixedCharge: 90, meterRent: 25, dutyPct: 9, fuelSurchargePerUnit: 0.15,
  },
  {
    id: 'tamilnadu', name: 'Tamil Nadu (TNEB)',
    slabs: [{ upto: 100, rate: 0 }, { upto: 200, rate: 2.50 }, { upto: 500, rate: 4.60 }, { upto: Infinity, rate: 6.60 }],
    fixedCharge: 50, meterRent: 20, dutyPct: 5, fuelSurchargePerUnit: 0.10,
  },
  {
    id: 'up', name: 'Uttar Pradesh (UPPCL)',
    slabs: [{ upto: 150, rate: 3.85 }, { upto: 300, rate: 4.90 }, { upto: 500, rate: 5.90 }, { upto: Infinity, rate: 6.90 }],
    fixedCharge: 100, meterRent: 20, dutyPct: 5, fuelSurchargePerUnit: 0.15,
  },
  {
    id: 'rajasthan', name: 'Rajasthan (JVVNL)',
    slabs: [{ upto: 50, rate: 3.85 }, { upto: 150, rate: 5.45 }, { upto: 300, rate: 6.50 }, { upto: Infinity, rate: 7.55 }],
    fixedCharge: 110, meterRent: 25, dutyPct: 8, fuelSurchargePerUnit: 0.18,
  },
  {
    id: 'gujarat', name: 'Gujarat (UGVCL)',
    slabs: [{ upto: 50, rate: 3.20 }, { upto: 100, rate: 3.70 }, { upto: 250, rate: 4.90 }, { upto: Infinity, rate: 5.60 }],
    fixedCharge: 80, meterRent: 15, dutyPct: 5, fuelSurchargePerUnit: 0.12,
  },
  {
    id: 'mp', name: 'Madhya Pradesh (MPPKVVCL)',
    slabs: [{ upto: 100, rate: 3.90 }, { upto: 200, rate: 5.20 }, { upto: 500, rate: 6.30 }, { upto: Infinity, rate: 7.40 }],
    fixedCharge: 100, meterRent: 20, dutyPct: 6, fuelSurchargePerUnit: 0.15,
  },
  {
    id: 'wb', name: 'West Bengal (WBSEDCL)',
    slabs: [{ upto: 75, rate: 3.58 }, { upto: 150, rate: 4.65 }, { upto: 300, rate: 6.88 }, { upto: Infinity, rate: 8.52 }],
    fixedCharge: 80, meterRent: 20, dutyPct: 6, fuelSurchargePerUnit: 0.12,
  },
  {
    id: 'ap', name: 'Andhra Pradesh (APSPDCL)',
    slabs: [{ upto: 50, rate: 2.60 }, { upto: 100, rate: 3.60 }, { upto: 200, rate: 5.20 }, { upto: Infinity, rate: 7.50 }],
    fixedCharge: 70, meterRent: 20, dutyPct: 6, fuelSurchargePerUnit: 0.10,
  },
  {
    id: 'telangana', name: 'Telangana (TSSPDCL)',
    slabs: [{ upto: 50, rate: 2.60 }, { upto: 100, rate: 3.60 }, { upto: 200, rate: 5.30 }, { upto: Infinity, rate: 7.70 }],
    fixedCharge: 60, meterRent: 20, dutyPct: 5, fuelSurchargePerUnit: 0.12,
  },
  {
    id: 'kerala', name: 'Kerala (KSEB)',
    slabs: [{ upto: 50, rate: 3.15 }, { upto: 100, rate: 3.80 }, { upto: 200, rate: 5.40 }, { upto: 500, rate: 7.20 }, { upto: Infinity, rate: 8.10 }],
    fixedCharge: 75, meterRent: 20, dutyPct: 10, fuelSurchargePerUnit: 0.10,
  },
  {
    id: 'punjab', name: 'Punjab (PSPCL)',
    slabs: [{ upto: 100, rate: 4.29 }, { upto: 300, rate: 5.89 }, { upto: Infinity, rate: 7.39 }],
    fixedCharge: 90, meterRent: 20, dutyPct: 5, fuelSurchargePerUnit: 0.18,
  },
  {
    id: 'bihar', name: 'Bihar (SBPDCL)',
    slabs: [{ upto: 100, rate: 4.10 }, { upto: 200, rate: 5.70 }, { upto: Infinity, rate: 6.95 }],
    fixedCharge: 85, meterRent: 15, dutyPct: 6, fuelSurchargePerUnit: 0.15,
  },
  {
    id: 'haryana', name: 'Haryana (UHBVNL)',
    slabs: [{ upto: 50, rate: 2.50 }, { upto: 150, rate: 5.25 }, { upto: 250, rate: 6.30 }, { upto: 500, rate: 7.10 }, { upto: Infinity, rate: 7.80 }],
    fixedCharge: 100, meterRent: 25, dutyPct: 5, fuelSurchargePerUnit: 0.16,
  },
  {
    id: 'custom', name: 'Custom / Other State',
    slabs: [{ upto: Infinity, rate: 5.50 }],
    fixedCharge: 100, meterRent: 20, dutyPct: 5, fuelSurchargePerUnit: 0.15,
  },
];

function fmt(n: number): string {
  return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

/* ─── Slab Breakdown Bar ─── */
function SlabBar({ slabs, units }: { slabs: { from: number; to: number; units: number; rate: number; amount: number }[]; units: number }) {
  if (units <= 0) return null;
  return (
    <div className="space-y-1.5">
      {slabs.map((s, i) => (
        <div key={i} className="group">
          <div className="flex justify-between text-[11px] mb-0.5">
            <span className="text-slate-500 dark:text-slate-400">
              {s.from}-{s.to === Infinity ? '+' : s.to} units @ {'\u20B9'}{s.rate}/unit
            </span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">{'\u20B9'}{fmt(s.amount)}</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (s.units / units) * 100)}%`,
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ElectricityBillCalculatorTool() {
  const [stateId, setStateId] = useState('maharashtra');
  const [units, setUnits] = useState('250');
  const [customRate, setCustomRate] = useState('5.50');
  const [customFixed, setCustomFixed] = useState('100');

  const tariff = TARIFFS.find(t => t.id === stateId) || TARIFFS[0];

  const calculation = useMemo(() => {
    const u = parseFloat(units) || 0;
    if (u <= 0) return null;

    const slabs = stateId === 'custom'
      ? [{ upto: Infinity, rate: parseFloat(customRate) || 5.50 }]
      : tariff.slabs;

    const fixedCharge = stateId === 'custom' ? (parseFloat(customFixed) || 100) : tariff.fixedCharge;

    // Calculate slab-wise charges
    let remaining = u;
    let prev = 0;
    const slabBreakdown: { from: number; to: number; units: number; rate: number; amount: number }[] = [];
    let energyCharge = 0;

    for (const slab of slabs) {
      if (remaining <= 0) break;
      const slabUnits = Math.min(remaining, slab.upto - prev);
      const amount = slabUnits * slab.rate;
      slabBreakdown.push({ from: prev, to: slab.upto, units: slabUnits, rate: slab.rate, amount });
      energyCharge += amount;
      remaining -= slabUnits;
      prev = slab.upto;
    }

    const fuelSurcharge = u * tariff.fuelSurchargePerUnit;
    const subtotal = energyCharge + fixedCharge + tariff.meterRent + fuelSurcharge;
    const duty = subtotal * (tariff.dutyPct / 100);
    const total = subtotal + duty;
    const perUnit = total / u;
    const dailyAvg = total / 30;

    return { energyCharge, fixedCharge, meterRent: tariff.meterRent, fuelSurcharge, duty, total, perUnit, dailyAvg, slabBreakdown, dutyPct: tariff.dutyPct };
  }, [units, stateId, tariff, customRate, customFixed]);

  const n = useCallback((val: string) => parseFloat(val) || 0, []);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Electricity Bill Calculator</h2>
            <p className="text-yellow-100 text-xs">15 Indian States | Slab-wise Breakdown | FY 2025-26</p>
          </div>
        </div>
        {calculation && (
          <div className="mt-3 flex flex-wrap gap-4">
            <div>
              <div className="text-yellow-200 text-[10px] uppercase tracking-wider">Monthly Bill</div>
              <div className="text-2xl font-bold">{'\u20B9'}{fmt(calculation.total)}</div>
            </div>
            <div className="border-l border-white/30 pl-4">
              <div className="text-yellow-200 text-[10px] uppercase tracking-wider">Per Unit Cost</div>
              <div className="text-2xl font-bold">{'\u20B9'}{fmt(calculation.perUnit)}</div>
            </div>
            <div className="border-l border-white/30 pl-4">
              <div className="text-yellow-200 text-[10px] uppercase tracking-wider">Daily Average</div>
              <div className="text-2xl font-bold">{'\u20B9'}{fmt(calculation.dailyAvg)}</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Select State</label>
              <select
                value={stateId}
                onChange={e => setStateId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              >
                {TARIFFS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Monthly Units Consumed (kWh)
                <span className="group relative">
                  <Info className="w-3 h-3 text-slate-400 cursor-help" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">Check your electricity meter or last bill</span>
                </span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={units}
                onChange={e => setUnits(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="250"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            {stateId === 'custom' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Rate/Unit ({'\u20B9'})</label>
                  <input type="text" inputMode="decimal" value={customRate} onChange={e => setCustomRate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Fixed Charge ({'\u20B9'})</label>
                  <input type="text" inputMode="numeric" value={customFixed} onChange={e => setCustomFixed(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>
            )}

            {/* Quick presets */}
            <div>
              <div className="text-xs text-slate-500 mb-2">Quick Select Units</div>
              <div className="flex flex-wrap gap-1.5">
                {['50', '100', '150', '200', '250', '300', '400', '500', '750', '1000'].map(v => (
                  <button key={v} onClick={() => setUnits(v)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${units === v ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-orange-100'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tariff slabs display */}
          {stateId !== 'custom' && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">{tariff.name} - Domestic Tariff</div>
              <div className="space-y-1 text-[11px]">
                {tariff.slabs.map((s, i) => {
                  const from = i === 0 ? 0 : tariff.slabs[i - 1].upto;
                  return (
                    <div key={i} className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>{from}-{s.upto === Infinity ? '+ ' : s.upto} kWh</span>
                      <span className="font-medium">{'\u20B9'}{s.rate}/unit</span>
                    </div>
                  );
                })}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-1 mt-1">
                  <div className="flex justify-between"><span>Fixed Charge</span><span>{'\u20B9'}{tariff.fixedCharge}/mo</span></div>
                  <div className="flex justify-between"><span>Meter Rent</span><span>{'\u20B9'}{tariff.meterRent}/mo</span></div>
                  <div className="flex justify-between"><span>Electricity Duty</span><span>{tariff.dutyPct}%</span></div>
                  <div className="flex justify-between"><span>Fuel Surcharge</span><span>{'\u20B9'}{tariff.fuelSurchargePerUnit}/unit</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Saving Tips */}
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-green-800 dark:text-green-400">Tips to Reduce Bill</span>
            </div>
            <ul className="space-y-1 text-[11px] text-green-700 dark:text-green-300">
              <li>Use LED bulbs (save 80% vs incandescent)</li>
              <li>Set AC to 24-26 C (each degree saves 6% energy)</li>
              <li>Use 5-star rated appliances</li>
              <li>Switch off standby devices</li>
              <li>Use solar water heater for hot water</li>
              <li>Run washing machine with full load only</li>
            </ul>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {calculation ? (
            <>
              {/* Bill Breakdown */}
              <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Bill Breakdown</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  <div className="flex justify-between py-2"><span className="text-xs text-slate-500">Energy Charge ({n(units)} units)</span><span className="text-sm font-medium text-slate-700 dark:text-slate-300">{'\u20B9'}{fmt(calculation.energyCharge)}</span></div>
                  <div className="flex justify-between py-2"><span className="text-xs text-slate-500">Fixed Charge</span><span className="text-sm font-medium text-slate-700 dark:text-slate-300">{'\u20B9'}{fmt(calculation.fixedCharge)}</span></div>
                  <div className="flex justify-between py-2"><span className="text-xs text-slate-500">Meter Rent</span><span className="text-sm font-medium text-slate-700 dark:text-slate-300">{'\u20B9'}{fmt(calculation.meterRent)}</span></div>
                  <div className="flex justify-between py-2"><span className="text-xs text-slate-500">Fuel Surcharge</span><span className="text-sm font-medium text-slate-700 dark:text-slate-300">{'\u20B9'}{fmt(calculation.fuelSurcharge)}</span></div>
                  <div className="flex justify-between py-2"><span className="text-xs text-slate-500">Electricity Duty ({calculation.dutyPct}%)</span><span className="text-sm font-medium text-slate-700 dark:text-slate-300">{'\u20B9'}{fmt(calculation.duty)}</span></div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Total Monthly Bill</span>
                    <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{'\u20B9'}{fmt(calculation.total)}</span>
                  </div>
                </div>
              </div>

              {/* Slab-wise Visual */}
              <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Slab-wise Breakdown</span>
                </div>
                <SlabBar slabs={calculation.slabBreakdown} units={n(units)} />
              </div>

              {/* Annual Projection */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3 text-center border border-blue-200 dark:border-blue-800/40">
                  <div className="text-[10px] text-blue-500 uppercase tracking-wider">Monthly</div>
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-400">{'\u20B9'}{fmt(calculation.total)}</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-3 text-center border border-purple-200 dark:border-purple-800/40">
                  <div className="text-[10px] text-purple-500 uppercase tracking-wider">Quarterly</div>
                  <div className="text-lg font-bold text-purple-700 dark:text-purple-400">{'\u20B9'}{fmt(calculation.total * 3)}</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-3 text-center border border-orange-200 dark:border-orange-800/40">
                  <div className="text-[10px] text-orange-500 uppercase tracking-wider">Annual</div>
                  <div className="text-lg font-bold text-orange-700 dark:text-orange-400">{'\u20B9'}{fmt(calculation.total * 12)}</div>
                </div>
              </div>

              {/* Appliance Reference */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Appliance Power Consumption Guide</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  {[
                    { name: 'LED Bulb (9W)', kwh: '0.27' },
                    { name: 'Ceiling Fan', kwh: '2.1' },
                    { name: 'AC (1.5 Ton)', kwh: '36' },
                    { name: 'Refrigerator', kwh: '2.4' },
                    { name: 'Washing Machine', kwh: '1.5' },
                    { name: 'TV (LED 42")', kwh: '2.4' },
                    { name: 'Geyser (25L)', kwh: '6' },
                    { name: 'Mixer Grinder', kwh: '0.5' },
                    { name: 'Iron', kwh: '3' },
                  ].map(a => (
                    <div key={a.name} className="flex justify-between bg-white dark:bg-slate-800 rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-400">{a.name}</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{a.kwh} kWh/day</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 text-center text-sm text-slate-500">
              Enter your monthly units to see the bill breakdown
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
