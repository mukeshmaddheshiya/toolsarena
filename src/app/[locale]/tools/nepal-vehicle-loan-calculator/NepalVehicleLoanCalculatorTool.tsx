'use client';

import { useState, useMemo } from 'react';
import { Car, Info, ChevronDown, ChevronUp } from 'lucide-react';

// ── Types & Constants ──────────────────────────────────────────────────────────
type VehicleType = 'car' | 'bike' | 'ev' | 'commercial';

interface VehicleConfig {
  label: string;
  emoji: string;
  minDownPct: number;
  maxTenureYears: number;
  rateRange: [number, number];
  nrbNote: string;
  defaultRate: number;
}

const VEHICLE_CONFIGS: Record<VehicleType, VehicleConfig> = {
  car: {
    label: 'Car (4-Wheeler)',
    emoji: '🚗',
    minDownPct: 20,
    maxTenureYears: 7,
    rateRange: [10, 13],
    nrbNote: 'Minimum 20% down payment required per NRB directive. Maximum loan tenure: 7 years.',
    defaultRate: 11.5,
  },
  bike: {
    label: 'Motorcycle / Scooter',
    emoji: '🏍️',
    minDownPct: 15,
    maxTenureYears: 5,
    rateRange: [12, 14],
    nrbNote: 'Minimum 15% down payment required per NRB directive. Maximum loan tenure: 5 years.',
    defaultRate: 13,
  },
  ev: {
    label: 'Electric Vehicle (EV)',
    emoji: '⚡',
    minDownPct: 20,
    maxTenureYears: 7,
    rateRange: [8, 10],
    nrbNote: 'EVs qualify for subsidized interest rates under Nepal government green vehicle incentives. Min 20% down payment.',
    defaultRate: 9,
  },
  commercial: {
    label: 'Truck / Commercial Vehicle',
    emoji: '🚛',
    minDownPct: 25,
    maxTenureYears: 7,
    rateRange: [11, 14],
    nrbNote: 'Minimum 25% down payment required for commercial vehicles per NRB directive. Maximum tenure: 7 years.',
    defaultRate: 12,
  },
};

// ── Formatting ─────────────────────────────────────────────────────────────────
function formatNPR(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return '₨ 0';
  const str = Math.round(amount).toString();
  const lastThree = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree : lastThree;
  return `₨ ${formatted}`;
}

// ── EMI & Amortization ─────────────────────────────────────────────────────────
interface AmortRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

function calcEMI(principal: number, annualRate: number, tenureMonths: number): number {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) return 0;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
}

function buildAmortization(principal: number, annualRate: number, tenureMonths: number): AmortRow[] {
  const emi = calcEMI(principal, annualRate, tenureMonths);
  const r = annualRate / 100 / 12;
  const rows: AmortRow[] = [];
  let balance = principal;

  for (let m = 1; m <= tenureMonths; m++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance = Math.max(balance - principalPaid, 0);
    rows.push({
      month: m,
      emi,
      principal: principalPaid,
      interest,
      balance,
    });
  }
  return rows;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function NepalVehicleLoanCalculatorTool() {
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [vehiclePrice, setVehiclePrice] = useState<string>('2500000');
  const [downPaymentPct, setDownPaymentPct] = useState<string>('20');
  const [interestRate, setInterestRate] = useState<string>('11.5');
  const [tenureYears, setTenureYears] = useState<string>('5');
  const [showAmort, setShowAmort] = useState(false);

  const config = VEHICLE_CONFIGS[vehicleType];

  const handleVehicleTypeChange = (type: VehicleType) => {
    setVehicleType(type);
    const cfg = VEHICLE_CONFIGS[type];
    setDownPaymentPct(String(cfg.minDownPct));
    setInterestRate(String(cfg.defaultRate));
    setTenureYears(String(Math.min(parseInt(tenureYears) || cfg.maxTenureYears, cfg.maxTenureYears)));
  };

  const results = useMemo(() => {
    const price = parseFloat(vehiclePrice) || 0;
    const dpPct = parseFloat(downPaymentPct) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseInt(tenureYears) || 0;

    if (price <= 0 || rate <= 0 || years <= 0) return null;

    const downPaymentAmt = (price * dpPct) / 100;
    const minDownAmt = (price * config.minDownPct) / 100;
    const loanAmount = price - downPaymentAmt;
    const tenureMonths = years * 12;
    const emi = calcEMI(loanAmount, rate, tenureMonths);
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - loanAmount;

    return {
      price,
      downPaymentAmt,
      minDownAmt,
      loanAmount,
      emi,
      totalPayment,
      totalInterest,
      tenureMonths,
      dpPct,
      rate,
      years,
      belowMinDown: dpPct < config.minDownPct,
    };
  }, [vehiclePrice, downPaymentPct, interestRate, tenureYears, vehicleType, config.minDownPct]);

  const amortRows = useMemo(() => {
    if (!results || !showAmort) return [];
    return buildAmortization(results.loanAmount, results.rate, results.tenureMonths);
  }, [results, showAmort]);

  return (
    <div className="space-y-6">
      {/* Vehicle type selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Vehicle Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(VEHICLE_CONFIGS) as VehicleType[]).map((type) => {
            const cfg = VEHICLE_CONFIGS[type];
            return (
              <button
                key={type}
                onClick={() => handleVehicleTypeChange(type)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-sm transition-all ${
                  vehicleType === type
                    ? 'bg-indigo-100 dark:bg-indigo-600/30 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <span className="text-xl">{cfg.emoji}</span>
                <span className="text-xs text-center leading-tight">{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* NRB note */}
      <div className="flex gap-2 p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-lg">
        <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">{config.nrbNote}</p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Vehicle Price */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Vehicle Price (NPR)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 font-medium text-sm">₨</span>
            <input
              type="number"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(e.target.value)}
              className="w-full pl-7 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
              placeholder="2500000"
              min="0"
            />
          </div>
          {vehiclePrice && parseFloat(vehiclePrice) > 0 && (
            <p className="text-xs text-slate-500 mt-1">{formatNPR(parseFloat(vehiclePrice))}</p>
          )}
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Down Payment %</label>
            <span className="text-xs text-slate-500">NRB Min: {config.minDownPct}%</span>
          </div>
          <input
            type="number"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
            min="0"
            max="100"
            step="1"
          />
          {results && (
            <p className="text-xs text-slate-500 mt-1">
              Down payment: {formatNPR(results.downPaymentAmt)}
            </p>
          )}
          {results?.belowMinDown && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Below NRB minimum of {config.minDownPct}%. Minimum required: {formatNPR(results.minDownAmt)}
            </p>
          )}
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Annual Interest Rate (%)</label>
            <span className="text-xs text-slate-500">Typical: {config.rateRange[0]}–{config.rateRange[1]}%</span>
          </div>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
            min="1"
            max="30"
            step="0.25"
          />
        </div>

        {/* Tenure */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Loan Tenure (Years)</label>
            <span className="text-xs text-slate-500">Max: {config.maxTenureYears} years</span>
          </div>
          <select
            value={tenureYears}
            onChange={(e) => setTenureYears(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
          >
            {Array.from({ length: config.maxTenureYears }, (_, i) => i + 1).map((y) => (
              <option key={y} value={y}>{y} {y === 1 ? 'Year' : 'Years'} ({y * 12} months)</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {results && results.loanAmount > 0 && results.emi > 0 && (
        <>
          <div className="p-5 bg-gradient-to-br from-indigo-50 dark:from-indigo-500/10 to-slate-50 dark:to-slate-800/60 rounded-xl border border-indigo-200 dark:border-indigo-500/30">
            <div className="text-center mb-4">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Monthly EMI</div>
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-300">{formatNPR(results.emi)}</div>
              <div className="text-sm text-slate-500 mt-1">per month for {results.years} year{results.years !== 1 ? 's' : ''}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { label: 'Loan Amount', value: formatNPR(results.loanAmount), color: 'text-slate-800 dark:text-slate-200' },
                { label: 'Down Payment', value: formatNPR(results.downPaymentAmt), color: 'text-sky-600 dark:text-sky-300' },
                { label: 'Total Interest', value: formatNPR(results.totalInterest), color: 'text-amber-700 dark:text-amber-300' },
                { label: 'Total Payment', value: formatNPR(results.totalPayment), color: 'text-emerald-700 dark:text-emerald-300' },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 bg-white/70 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                  <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Interest vs Principal bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Principal: {Math.round((results.loanAmount / results.totalPayment) * 100)}%</span>
                <span>Interest: {Math.round((results.totalInterest / results.totalPayment) * 100)}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{ width: `${(results.loanAmount / results.totalPayment) * 100}%` }}
                />
                <div className="h-full bg-amber-500 flex-1" />
              </div>
            </div>
          </div>

          {/* Amortization toggle */}
          <button
            onClick={() => setShowAmort((v) => !v)}
            className="flex items-center gap-2 w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
          >
            {showAmort ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAmort ? 'Hide' : 'Show'} Month-wise Amortization Table ({results.tenureMonths} months)
          </button>

          {showAmort && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                  <tr>
                    {['Month', 'EMI', 'Principal', 'Interest', 'Balance'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {amortRows.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.month}</td>
                      <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200">{formatNPR(row.emi)}</td>
                      <td className="px-4 py-2.5 text-indigo-600 dark:text-indigo-300">{formatNPR(row.principal)}</td>
                      <td className="px-4 py-2.5 text-amber-700 dark:text-amber-300">{formatNPR(row.interest)}</td>
                      <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{formatNPR(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-600 text-center">
        For informational purposes only. Actual rates, terms and eligibility are subject to bank policy and NRB regulations.
        Interest rates are indicative for 2024–2025.
      </p>
    </div>
  );
}
