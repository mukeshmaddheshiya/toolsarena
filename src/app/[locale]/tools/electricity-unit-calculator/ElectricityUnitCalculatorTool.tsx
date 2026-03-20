'use client';

import { useState, useMemo, useCallback } from 'react';
import { Zap, Plus, X, ChevronDown, Lightbulb, AlertCircle } from 'lucide-react';

interface Appliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  daysPerMonth: number;
  enabled: boolean;
}

interface StateTariff {
  name: string;
  rate: number;
  note: string;
}

const STATE_TARIFFS: StateTariff[] = [
  { name: 'Default / Custom', rate: 6, note: 'Flat ₹6/unit' },
  { name: 'Delhi', rate: 5.5, note: '₹3–8/unit (avg ₹5.5)' },
  { name: 'Maharashtra', rate: 7, note: '₹2.5–11/unit (avg ₹7)' },
  { name: 'Karnataka', rate: 5.75, note: '₹4.5–7/unit (avg ₹5.75)' },
  { name: 'Uttar Pradesh', rate: 4.75, note: '₹3.5–6/unit (avg ₹4.75)' },
  { name: 'Tamil Nadu', rate: 4.5, note: '₹1.5–7/unit (avg ₹4.5)' },
  { name: 'Gujarat', rate: 5, note: '₹3–7/unit (avg ₹5)' },
  { name: 'Rajasthan', rate: 6, note: '₹4–8/unit (avg ₹6)' },
  { name: 'West Bengal', rate: 7.5, note: '₹5–10/unit (avg ₹7.5)' },
  { name: 'Punjab', rate: 5, note: '₹3–7/unit (avg ₹5)' },
];

const DEFAULT_APPLIANCES: Appliance[] = [
  { id: 'ac15', name: 'AC (1.5 ton)', watts: 1500, hoursPerDay: 8, daysPerMonth: 30, enabled: true },
  { id: 'ac2', name: 'AC (2 ton)', watts: 2000, hoursPerDay: 0, daysPerMonth: 30, enabled: false },
  { id: 'cfan', name: 'Ceiling Fan', watts: 75, hoursPerDay: 10, daysPerMonth: 30, enabled: true },
  { id: 'tfan', name: 'Table Fan', watts: 45, hoursPerDay: 6, daysPerMonth: 30, enabled: false },
  { id: 'led', name: 'LED Bulb (×6)', watts: 60, hoursPerDay: 6, daysPerMonth: 30, enabled: true },
  { id: 'fridge', name: 'Refrigerator', watts: 150, hoursPerDay: 24, daysPerMonth: 30, enabled: true },
  { id: 'wm', name: 'Washing Machine', watts: 500, hoursPerDay: 1, daysPerMonth: 26, enabled: true },
  { id: 'mw', name: 'Microwave', watts: 1200, hoursPerDay: 0.5, daysPerMonth: 30, enabled: false },
  { id: 'geyser', name: 'Electric Geyser', watts: 2000, hoursPerDay: 0.5, daysPerMonth: 30, enabled: true },
  { id: 'tv32', name: 'TV (LED 32")', watts: 60, hoursPerDay: 5, daysPerMonth: 30, enabled: true },
  { id: 'tv55', name: 'TV (LED 55")', watts: 120, hoursPerDay: 0, daysPerMonth: 30, enabled: false },
  { id: 'laptop', name: 'Laptop', watts: 65, hoursPerDay: 8, daysPerMonth: 26, enabled: true },
  { id: 'desktop', name: 'Desktop PC', watts: 300, hoursPerDay: 0, daysPerMonth: 26, enabled: false },
  { id: 'iron', name: 'Iron', watts: 1000, hoursPerDay: 0.25, daysPerMonth: 26, enabled: false },
  { id: 'hdryer', name: 'Hair Dryer', watts: 1200, hoursPerDay: 0.1, daysPerMonth: 30, enabled: false },
  { id: 'pump', name: 'Water Pump', watts: 750, hoursPerDay: 1, daysPerMonth: 30, enabled: true },
  { id: 'mixer', name: 'Mixer / Grinder', watts: 750, hoursPerDay: 0.25, daysPerMonth: 30, enabled: false },
  { id: 'induction', name: 'Induction Cooktop', watts: 1800, hoursPerDay: 1, daysPerMonth: 30, enabled: false },
  { id: 'cooler', name: 'Air Cooler', watts: 200, hoursPerDay: 0, daysPerMonth: 30, enabled: false },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function calcKwh(watts: number, hours: number, days: number): number {
  return (watts * hours * days) / 1000;
}

function formatCurrency(value: number): string {
  return (
    '₹' +
    new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  );
}

export function ElectricityUnitCalculatorTool() {
  const [appliances, setAppliances] = useState<Appliance[]>(DEFAULT_APPLIANCES);
  const [selectedStateIndex, setSelectedStateIndex] = useState<number>(0);
  const [customTariff, setCustomTariff] = useState<string>('');
  const [showAll, setShowAll] = useState(false);

  const isCustom = selectedStateIndex === 0;
  const tariffRate = isCustom
    ? parseFloat(customTariff) || STATE_TARIFFS[0].rate
    : STATE_TARIFFS[selectedStateIndex].rate;

  const enabledAppliances = useMemo(
    () => appliances.filter((a) => a.enabled),
    [appliances]
  );

  const applianceKwh = useMemo(
    () =>
      enabledAppliances.map((a) => ({
        ...a,
        kwh: calcKwh(a.watts, a.hoursPerDay, a.daysPerMonth),
      })),
    [enabledAppliances]
  );

  const totalKwh = useMemo(
    () => applianceKwh.reduce((sum, a) => sum + a.kwh, 0),
    [applianceKwh]
  );

  const totalBill = totalKwh * tariffRate;

  const topAppliance = useMemo(() => {
    if (!applianceKwh.length) return null;
    return applianceKwh.reduce((max, a) => (a.kwh > max.kwh ? a : max));
  }, [applianceKwh]);

  const updateAppliance = useCallback(
    (id: string, field: keyof Appliance, value: number | string | boolean) => {
      setAppliances((prev) =>
        prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
      );
    },
    []
  );

  const toggleAppliance = useCallback((id: string) => {
    setAppliances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  }, []);

  const removeAppliance = useCallback((id: string) => {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addAppliance = () => {
    setAppliances((prev) => [
      ...prev,
      {
        id: uid(),
        name: 'New Appliance',
        watts: 100,
        hoursPerDay: 1,
        daysPerMonth: 30,
        enabled: true,
      },
    ]);
  };

  const displayedAppliances = showAll ? appliances : appliances.slice(0, 10);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-amber-100 dark:bg-amber-900/40 rounded-xl">
          <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Electricity Unit Calculator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Calculate your monthly electricity bill appliance by appliance
          </p>
        </div>
      </div>

      {/* Tariff Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h2 className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-3">
          Electricity Tariff Settings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              State / Region
            </label>
            <div className="relative">
              <select
                value={selectedStateIndex}
                onChange={(e) => setSelectedStateIndex(Number(e.target.value))}
                className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {STATE_TARIFFS.map((s, i) => (
                  <option key={s.name} value={i}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              {isCustom ? 'Custom Tariff (₹ per unit)' : 'Indicative Rate'}
            </label>
            {isCustom ? (
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0.5"
                  max="30"
                  step="0.1"
                  value={customTariff}
                  onChange={(e) => setCustomTariff(e.target.value)}
                  placeholder="6.00"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            ) : (
              <div className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-600 dark:text-slate-400">
                ₹{STATE_TARIFFS[selectedStateIndex].rate}/unit —{' '}
                {STATE_TARIFFS[selectedStateIndex].note}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appliance Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            Appliances ({enabledAppliances.length} active)
          </h2>
          <button
            onClick={addAppliance}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Appliance
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_80px_70px_70px_70px_32px] gap-1 px-4 py-2 bg-slate-50 dark:bg-slate-700/40 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Appliance</span>
          <span className="text-center">Watts</span>
          <span className="text-center">Hrs/Day</span>
          <span className="text-center">Days/Mo</span>
          <span className="text-right">kWh/Mo</span>
          <span></span>
        </div>

        {/* Appliance Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {displayedAppliances.map((appliance) => {
            const kwh = calcKwh(appliance.watts, appliance.hoursPerDay, appliance.daysPerMonth);
            return (
              <div
                key={appliance.id}
                className={`grid grid-cols-[1fr_80px_70px_70px_70px_32px] gap-1 items-center px-4 py-2 transition-colors ${
                  appliance.enabled
                    ? 'bg-white dark:bg-slate-800'
                    : 'bg-slate-50 dark:bg-slate-800/40 opacity-50'
                }`}
              >
                {/* Name + toggle */}
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => toggleAppliance(appliance.id)}
                    className={`w-4 h-4 rounded border-2 flex-shrink-0 transition-colors ${
                      appliance.enabled
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {appliance.enabled && (
                      <svg viewBox="0 0 10 10" className="w-full h-full p-0.5">
                        <path
                          d="M1.5 5l2.5 2.5 4.5-4.5"
                          stroke="white"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </button>
                  <input
                    type="text"
                    value={appliance.name}
                    onChange={(e) => updateAppliance(appliance.id, 'name', e.target.value)}
                    className="text-xs text-slate-700 dark:text-slate-300 bg-transparent focus:outline-none min-w-0 truncate w-full"
                  />
                </div>

                {/* Watts */}
                <input
                  type="number"
                  min="1"
                  value={appliance.watts}
                  onChange={(e) =>
                    updateAppliance(appliance.id, 'watts', parseFloat(e.target.value) || 0)
                  }
                  className="text-xs text-center px-1 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 tabular-nums w-full"
                />

                {/* Hours/day */}
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={appliance.hoursPerDay}
                  onChange={(e) =>
                    updateAppliance(appliance.id, 'hoursPerDay', parseFloat(e.target.value) || 0)
                  }
                  className="text-xs text-center px-1 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 tabular-nums w-full"
                />

                {/* Days/month */}
                <input
                  type="number"
                  min="0"
                  max="31"
                  value={appliance.daysPerMonth}
                  onChange={(e) =>
                    updateAppliance(appliance.id, 'daysPerMonth', parseFloat(e.target.value) || 0)
                  }
                  className="text-xs text-center px-1 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 tabular-nums w-full"
                />

                {/* kWh */}
                <div
                  className={`text-xs text-right font-medium tabular-nums ${
                    appliance.enabled ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {appliance.enabled ? kwh.toFixed(1) : '—'}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeAppliance(appliance.id)}
                  className="p-1 rounded text-slate-300 hover:text-red-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Show More */}
        {appliances.length > 10 && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="w-full py-2.5 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-t border-slate-100 dark:border-slate-700"
          >
            {showAll ? 'Show less' : `Show all ${appliances.length} appliances`}
          </button>
        )}

        {/* Total Row */}
        <div className="px-5 py-3.5 bg-indigo-50 dark:bg-indigo-900/20 border-t border-indigo-100 dark:border-indigo-800 flex items-center justify-between">
          <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
            Total Monthly Consumption
          </span>
          <span className="text-base font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">
            {totalKwh.toFixed(1)} kWh
          </span>
        </div>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 col-span-2 sm:col-span-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Units</div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {totalKwh.toFixed(1)}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">kWh / month</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Est. Monthly Bill</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatCurrency(totalBill)}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            @₹{tariffRate}/unit
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Daily Average</div>
          <div className="text-xl font-bold text-slate-700 dark:text-slate-300 tabular-nums">
            {(totalKwh / 30).toFixed(1)}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">kWh / day</div>
        </div>
      </div>

      {/* Top Appliance */}
      {topAppliance && topAppliance.kwh > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-4 flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Most power-hungry:
            </span>{' '}
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
              {topAppliance.name}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
              — {topAppliance.kwh.toFixed(1)} kWh/month (
              {((topAppliance.kwh / totalKwh) * 100).toFixed(0)}% of total)
            </span>
          </div>
        </div>
      )}

      {/* Savings Tip */}
      {totalKwh > 300 && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">
              High Consumption Alert — Savings Opportunity
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
              Your estimated consumption exceeds 300 units/month. Consider: upgrading to 5-star rated
              appliances, setting AC to 24°C instead of 18°C (saves ~36%), using LED lights, and
              switching off appliances at the plug when not in use. These steps can reduce your bill
              by 20–35%.
            </p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <strong>Disclaimer:</strong> The estimated bill is based on a flat per-unit rate. Actual
          electricity bills include slab-based tariffs, fixed charges, meter rental, government
          taxes, and surcharges. Refer to your DISCOM website or your electricity bill for exact
          tariff details applicable to your connection category.
        </p>
      </div>
    </div>
  );
}
