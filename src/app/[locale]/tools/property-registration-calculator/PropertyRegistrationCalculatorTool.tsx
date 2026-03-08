'use client';
import { useState, useMemo, useCallback } from 'react';
import {
  Building2,
  MapPin,
  IndianRupee,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  BarChart3,
  User,
  Home,
} from 'lucide-react';

/* ─── STATE DATA ─────────────────────────────────────────────────────── */
interface StateRate {
  name: string;
  stampDuty: number;          // base % for male/general
  stampDutyFemale: number;    // % for female owner
  stampDutyJoint: number;     // % for joint (male+female)
  registrationFee: number;    // %
  registrationCap?: number;   // max registration fee ₹
  commercialExtra: number;    // extra stamp duty % for commercial
  agriculturalDiscount: number; // discount % off stamp duty for agri
}

const STATE_DATA: Record<string, StateRate> = {
  maharashtra:   { name: 'Maharashtra',       stampDuty: 5,   stampDutyFemale: 5,   stampDutyJoint: 5,   registrationFee: 1,   registrationCap: undefined, commercialExtra: 1,   agriculturalDiscount: 2 },
  karnataka:     { name: 'Karnataka',         stampDuty: 5,   stampDutyFemale: 5,   stampDutyJoint: 5,   registrationFee: 1,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 1 },
  tamilnadu:     { name: 'Tamil Nadu',        stampDuty: 7,   stampDutyFemale: 7,   stampDutyJoint: 7,   registrationFee: 4,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 3 },
  delhi:         { name: 'Delhi',             stampDuty: 6,   stampDutyFemale: 4,   stampDutyJoint: 5,   registrationFee: 1,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 2 },
  uttarpradesh:  { name: 'Uttar Pradesh',     stampDuty: 7,   stampDutyFemale: 5,   stampDutyJoint: 6,   registrationFee: 1,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 2 },
  rajasthan:     { name: 'Rajasthan',         stampDuty: 5,   stampDutyFemale: 4,   stampDutyJoint: 4.5, registrationFee: 1,   registrationCap: undefined, commercialExtra: 1,   agriculturalDiscount: 1 },
  gujarat:       { name: 'Gujarat',           stampDuty: 4.9, stampDutyFemale: 4.9, stampDutyJoint: 4.9, registrationFee: 1,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 1 },
  kerala:        { name: 'Kerala',            stampDuty: 8,   stampDutyFemale: 8,   stampDutyJoint: 8,   registrationFee: 2,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 3 },
  madhyapradesh: { name: 'Madhya Pradesh',    stampDuty: 7.5, stampDutyFemale: 7.5, stampDutyJoint: 7.5, registrationFee: 3,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 2 },
  telangana:     { name: 'Telangana',         stampDuty: 5,   stampDutyFemale: 5,   stampDutyJoint: 5,   registrationFee: 0.5, registrationCap: undefined, commercialExtra: 1,   agriculturalDiscount: 1 },
  westbengal:    { name: 'West Bengal',       stampDuty: 6,   stampDutyFemale: 6,   stampDutyJoint: 6,   registrationFee: 1,   registrationCap: undefined, commercialExtra: 1,   agriculturalDiscount: 2 },
  punjab:        { name: 'Punjab',            stampDuty: 7,   stampDutyFemale: 5,   stampDutyJoint: 6,   registrationFee: 1,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 2 },
  haryana:       { name: 'Haryana',           stampDuty: 7,   stampDutyFemale: 5,   stampDutyJoint: 6,   registrationFee: 0,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 2 },
  bihar:         { name: 'Bihar',             stampDuty: 6,   stampDutyFemale: 6,   stampDutyJoint: 6,   registrationFee: 2,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 2 },
  odisha:        { name: 'Odisha',            stampDuty: 5,   stampDutyFemale: 4,   stampDutyJoint: 4.5, registrationFee: 1,   registrationCap: undefined, commercialExtra: 1,   agriculturalDiscount: 1 },
  jharkhand:     { name: 'Jharkhand',         stampDuty: 4,   stampDutyFemale: 4,   stampDutyJoint: 4,   registrationFee: 3,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 1 },
  chhattisgarh:  { name: 'Chhattisgarh',      stampDuty: 5,   stampDutyFemale: 4,   stampDutyJoint: 4.5, registrationFee: 4,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 1 },
  assam:         { name: 'Assam',             stampDuty: 8,   stampDutyFemale: 8,   stampDutyJoint: 8,   registrationFee: 8.5, registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 2 },
  goa:           { name: 'Goa',              stampDuty: 3.5, stampDutyFemale: 3.5, stampDutyJoint: 3.5, registrationFee: 3,   registrationCap: undefined, commercialExtra: 1,   agriculturalDiscount: 0.5 },
  uttarakhand:   { name: 'Uttarakhand',       stampDuty: 5,   stampDutyFemale: 3.75,stampDutyJoint: 4.375,registrationFee: 2,  registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 1 },
  himachal:      { name: 'Himachal Pradesh',  stampDuty: 5,   stampDutyFemale: 4,   stampDutyJoint: 4.5, registrationFee: 2,   registrationCap: undefined, commercialExtra: 1,   agriculturalDiscount: 1 },
  meghalaya:     { name: 'Meghalaya',         stampDuty: 5,   stampDutyFemale: 5,   stampDutyJoint: 5,   registrationFee: 5,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 1 },
  tripura:       { name: 'Tripura',           stampDuty: 5,   stampDutyFemale: 5,   stampDutyJoint: 5,   registrationFee: 2,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 1 },
  manipur:       { name: 'Manipur',           stampDuty: 7,   stampDutyFemale: 7,   stampDutyJoint: 7,   registrationFee: 3,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 2 },
  mizoram:       { name: 'Mizoram',           stampDuty: 5,   stampDutyFemale: 5,   stampDutyJoint: 5,   registrationFee: 5,   registrationCap: undefined, commercialExtra: 0,   agriculturalDiscount: 1 },
};

type PropertyType = 'residential' | 'commercial' | 'agricultural' | 'plot';
type OwnerType = 'male' | 'female' | 'joint';

/* ─── HELPERS ────────────────────────────────────────────────────────── */
function formatINR(n: number): string {
  if (n >= 1_00_00_000) return `${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000) return `${(n / 1_00_000).toFixed(2)} L`;
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function formatRupee(n: number): string {
  return `\u20B9${formatINR(n)}`;
}

interface CalcResult {
  stampDutyRate: number;
  stampDuty: number;
  registrationFeeRate: number;
  registrationFee: number;
  gst: number;
  tds: number;
  totalCost: number;
  effectivePercent: number;
}

function calculate(
  value: number,
  stateKey: string,
  propertyType: PropertyType,
  ownerType: OwnerType,
  isFirstTimeBuyer: boolean,
  isUnderConstruction: boolean,
): CalcResult {
  const state = STATE_DATA[stateKey];
  if (!state || value <= 0) return { stampDutyRate: 0, stampDuty: 0, registrationFeeRate: 0, registrationFee: 0, gst: 0, tds: 0, totalCost: 0, effectivePercent: 0 };

  // stamp duty base rate by owner type
  let sdRate =
    ownerType === 'female' ? state.stampDutyFemale :
    ownerType === 'joint' ? state.stampDutyJoint :
    state.stampDuty;

  // commercial surcharge
  if (propertyType === 'commercial') sdRate += state.commercialExtra;
  // agricultural discount
  if (propertyType === 'agricultural') sdRate = Math.max(0, sdRate - state.agriculturalDiscount);

  // first-time buyer 1% concession (common in many states)
  if (isFirstTimeBuyer && propertyType === 'residential') sdRate = Math.max(0, sdRate - 1);

  const stampDuty = Math.round(value * sdRate / 100);

  const regRate = state.registrationFee;
  let regFee = Math.round(value * regRate / 100);
  if (state.registrationCap && regFee > state.registrationCap) regFee = state.registrationCap;

  // GST 5% on under-construction (no land component ~1/3, so effective ~5% on 2/3 ≈ 3.33%)
  // simplified: 5% of property value for under-construction
  const gst = isUnderConstruction ? Math.round(value * 5 / 100) : 0;

  // TDS 1% if value > 50 lakh
  const tds = value > 50_00_000 ? Math.round(value * 1 / 100) : 0;

  const totalCost = stampDuty + regFee + gst + tds;
  const effectivePercent = value > 0 ? (totalCost / value) * 100 : 0;

  return { stampDutyRate: sdRate, stampDuty, registrationFeeRate: regRate, registrationFee: regFee, gst, tds, totalCost, effectivePercent };
}

/* ─── COMPONENT ──────────────────────────────────────────────────────── */
export function PropertyRegistrationCalculatorTool() {
  const [stateKey, setStateKey] = useState('maharashtra');
  const [propertyValue, setPropertyValue] = useState<number>(75_00_000);
  const [propertyType, setPropertyType] = useState<PropertyType>('residential');
  const [ownerType, setOwnerType] = useState<OwnerType>('male');
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false);
  const [isUnderConstruction, setIsUnderConstruction] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const result = useMemo(
    () => calculate(propertyValue, stateKey, propertyType, ownerType, isFirstTimeBuyer, isUnderConstruction),
    [propertyValue, stateKey, propertyType, ownerType, isFirstTimeBuyer, isUnderConstruction],
  );

  const comparison = useMemo(() => {
    if (!showComparison || propertyValue <= 0) return [];
    return Object.entries(STATE_DATA)
      .map(([key, s]) => {
        const r = calculate(propertyValue, key, propertyType, ownerType, isFirstTimeBuyer, isUnderConstruction);
        return { key, name: s.name, ...r };
      })
      .sort((a, b) => a.totalCost - b.totalCost);
  }, [showComparison, propertyValue, propertyType, ownerType, isFirstTimeBuyer, isUnderConstruction]);

  const handleTryExample = useCallback(() => {
    setPropertyValue(75_00_000);
    setStateKey('maharashtra');
    setPropertyType('residential');
    setOwnerType('male');
    setIsFirstTimeBuyer(false);
    setIsUnderConstruction(false);
  }, []);

  const handleCopy = useCallback(() => {
    const state = STATE_DATA[stateKey];
    const lines = [
      `Property Registration Cost Summary`,
      `──────────────────────────────`,
      `State: ${state.name}`,
      `Property Value: ${formatRupee(propertyValue)}`,
      `Property Type: ${propertyType}`,
      `Owner: ${ownerType}${isFirstTimeBuyer ? ' (First-time buyer)' : ''}`,
      ``,
      `Stamp Duty (${result.stampDutyRate}%): ${formatRupee(result.stampDuty)}`,
      `Registration Fee (${result.registrationFeeRate}%): ${formatRupee(result.registrationFee)}`,
      ...(result.gst > 0 ? [`GST (5%): ${formatRupee(result.gst)}`] : []),
      ...(result.tds > 0 ? [`TDS (1%): ${formatRupee(result.tds)}`] : []),
      ``,
      `Total Cost: ${formatRupee(result.totalCost)}`,
      `Effective Rate: ${result.effectivePercent.toFixed(2)}%`,
      ``,
      `Generated by ToolsArena.in`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [stateKey, propertyValue, propertyType, ownerType, isFirstTimeBuyer, result]);

  const maxTotal = comparison.length > 0 ? comparison[comparison.length - 1].totalCost : 1;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <Building2 className="h-7 w-7" /> Property Registration Cost Calculator
            </h2>
            <p className="mt-1 text-amber-100">
              Calculate stamp duty, registration fee, GST &amp; TDS for any Indian state
            </p>
          </div>
          <button
            onClick={handleTryExample}
            className="flex items-center gap-1.5 self-start rounded-lg bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/30"
          >
            <Sparkles className="h-4 w-4" /> Try Example
          </button>
        </div>
      </div>

      {/* ── Input Form ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Property Details</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* State */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              <MapPin className="h-4 w-4 text-amber-500" /> State
            </label>
            <select
              value={stateKey}
              onChange={e => setStateKey(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {Object.entries(STATE_DATA)
                .sort((a, b) => a[1].name.localeCompare(b[1].name))
                .map(([key, s]) => (
                  <option key={key} value={key}>{s.name}</option>
                ))}
            </select>
          </div>

          {/* Property Value */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              <IndianRupee className="h-4 w-4 text-amber-500" /> Property Value
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{'\u20B9'}</span>
              <input
                type="number"
                min={0}
                value={propertyValue || ''}
                onChange={e => setPropertyValue(Number(e.target.value))}
                placeholder="e.g. 7500000"
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-7 pr-3 text-sm text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            {propertyValue > 0 && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatRupee(propertyValue)}</p>
            )}
          </div>

          {/* Property Type */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Home className="h-4 w-4 text-amber-500" /> Property Type
            </label>
            <select
              value={propertyType}
              onChange={e => setPropertyType(e.target.value as PropertyType)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="agricultural">Agricultural</option>
              <option value="plot">Plot / Land</option>
            </select>
          </div>

          {/* Owner Type */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4 text-amber-500" /> Owner
            </label>
            <select
              value={ownerType}
              onChange={e => setOwnerType(e.target.value as OwnerType)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="joint">Joint (Male + Female)</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={isFirstTimeBuyer}
              onChange={e => setIsFirstTimeBuyer(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            First-time home buyer (1% concession)
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={isUnderConstruction}
              onChange={e => setIsUnderConstruction(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            Under construction (GST applicable)
          </label>
        </div>
      </div>

      {/* ── Results ───────────────────────────────────────────────── */}
      {propertyValue > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cost Breakdown</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {copied ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy Summary</>}
            </button>
          </div>

          {/* Breakdown cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultCard
              label="Stamp Duty"
              rate={`${result.stampDutyRate}%`}
              amount={result.stampDuty}
              color="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
            />
            <ResultCard
              label="Registration Fee"
              rate={`${result.registrationFeeRate}%`}
              amount={result.registrationFee}
              color="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            />
            {result.gst > 0 && (
              <ResultCard
                label="GST (Under Construction)"
                rate="5%"
                amount={result.gst}
                color="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
              />
            )}
            {result.tds > 0 && (
              <ResultCard
                label="TDS (Value > \u20B950L)"
                rate="1%"
                amount={result.tds}
                color="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              />
            )}
          </div>

          {/* Total */}
          <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-white">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-amber-100">Total Registration Cost</p>
                <p className="text-2xl font-bold sm:text-3xl">{formatRupee(result.totalCost)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-amber-100">Effective Rate</p>
                <p className="text-xl font-bold">{result.effectivePercent.toFixed(2)}%</p>
              </div>
            </div>
          </div>

          {/* Visual bar breakdown */}
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Cost Distribution</p>
            <div className="flex h-4 w-full overflow-hidden rounded-full">
              {result.stampDuty > 0 && (
                <div
                  className="bg-amber-400 transition-all"
                  title={`Stamp Duty: ${formatRupee(result.stampDuty)}`}
                  style={{ width: `${(result.stampDuty / result.totalCost) * 100}%` }}
                />
              )}
              {result.registrationFee > 0 && (
                <div
                  className="bg-blue-400 transition-all"
                  title={`Registration Fee: ${formatRupee(result.registrationFee)}`}
                  style={{ width: `${(result.registrationFee / result.totalCost) * 100}%` }}
                />
              )}
              {result.gst > 0 && (
                <div
                  className="bg-purple-400 transition-all"
                  title={`GST: ${formatRupee(result.gst)}`}
                  style={{ width: `${(result.gst / result.totalCost) * 100}%` }}
                />
              )}
              {result.tds > 0 && (
                <div
                  className="bg-red-400 transition-all"
                  title={`TDS: ${formatRupee(result.tds)}`}
                  style={{ width: `${(result.tds / result.totalCost) * 100}%` }}
                />
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" /> Stamp Duty</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-400" /> Reg. Fee</span>
              {result.gst > 0 && <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-purple-400" /> GST</span>}
              {result.tds > 0 && <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-red-400" /> TDS</span>}
            </div>
          </div>
        </div>
      )}

      {/* ── State Comparison ──────────────────────────────────────── */}
      {propertyValue > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <button
            onClick={() => setShowComparison(v => !v)}
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <BarChart3 className="h-5 w-5 text-amber-500" /> State-wise Comparison
            </h3>
            {showComparison ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
          </button>

          {showComparison && comparison.length > 0 && (
            <div className="mt-4 space-y-2 overflow-x-auto">
              {/* Mobile: card layout, Desktop: bar chart */}
              <div className="hidden sm:block">
                <div className="min-w-0 space-y-1.5">
                  {comparison.map((c, i) => {
                    const isSelected = c.key === stateKey;
                    return (
                      <div
                        key={c.key}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${isSelected ? 'bg-amber-50 ring-1 ring-amber-300 dark:bg-amber-900/20 dark:ring-amber-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                      >
                        <span className="w-5 shrink-0 text-center text-xs font-bold text-gray-400">{i + 1}</span>
                        <span className="w-36 shrink-0 truncate font-medium text-gray-800 dark:text-gray-200">{c.name}</span>
                        <div className="flex-1">
                          <div
                            className={`h-5 rounded ${isSelected ? 'bg-amber-400' : 'bg-gray-300 dark:bg-gray-600'} transition-all`}
                            style={{ width: `${maxTotal > 0 ? (c.totalCost / maxTotal) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="w-24 shrink-0 text-right font-semibold text-gray-900 dark:text-white">{formatRupee(c.totalCost)}</span>
                        <span className="w-16 shrink-0 text-right text-xs text-gray-500 dark:text-gray-400">{c.effectivePercent.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile cards */}
              <div className="space-y-2 sm:hidden">
                {comparison.map((c, i) => {
                  const isSelected = c.key === stateKey;
                  return (
                    <div
                      key={c.key}
                      className={`rounded-lg border p-3 ${isSelected ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          <span className="mr-1.5 text-xs text-gray-400">#{i + 1}</span>{c.name}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatRupee(c.totalCost)}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className={`h-full rounded-full ${isSelected ? 'bg-amber-400' : 'bg-gray-400 dark:bg-gray-500'}`}
                            style={{ width: `${maxTotal > 0 ? (c.totalCost / maxTotal) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{c.effectivePercent.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Trust Badge ───────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
        <ShieldCheck className="h-4 w-4 text-green-500" />
        <span>All calculations are performed locally in your browser. No data is stored or sent to any server.</span>
      </div>
    </div>
  );
}

/* ─── SUB-COMPONENT ──────────────────────────────────────────────────── */
function ResultCard({ label, rate, amount, color }: { label: string; rate: string; amount: number; color: string }) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
        <span className="rounded-md bg-white/70 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-900/30 dark:text-gray-300">{rate}</span>
      </div>
      <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{formatRupee(amount)}</p>
    </div>
  );
}
