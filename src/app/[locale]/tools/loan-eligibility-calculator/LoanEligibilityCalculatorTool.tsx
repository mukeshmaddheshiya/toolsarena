'use client';

import { useState, useCallback } from 'react';
import { Home, IndianRupee, Percent, Calendar, Info, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

type LoanType = 'home' | 'personal' | 'car' | 'education';

interface LoanConfig {
  label: string;
  defaultRate: number;
  foirLow: number;
  foirMid: number;
  foirHigh: number;
  maxTenure: number;
}

const LOAN_CONFIGS: Record<LoanType, LoanConfig> = {
  home: { label: 'Home Loan', defaultRate: 8.5, foirLow: 40, foirMid: 45, foirHigh: 50, maxTenure: 30 },
  personal: { label: 'Personal Loan', defaultRate: 12, foirLow: 30, foirMid: 35, foirHigh: 40, maxTenure: 7 },
  car: { label: 'Car Loan', defaultRate: 9, foirLow: 40, foirMid: 45, foirHigh: 50, maxTenure: 7 },
  education: { label: 'Education Loan', defaultRate: 9, foirLow: 45, foirMid: 50, foirHigh: 55, maxTenure: 15 },
};

interface EligibilityResult {
  conservative: number;
  moderate: number;
  liberal: number;
  emiConservative: number;
  emiModerate: number;
  emiLiberal: number;
  foirConservative: number;
  foirModerate: number;
  foirLiberal: number;
  currentFoir: number;
}

const formatINR = (value: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const formatCompact = (value: number): string => {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)} L`;
  return formatINR(value);
};

function calcMaxLoan(emiCapacity: number, annualRate: number, months: number): number {
  if (emiCapacity <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return emiCapacity * months;
  const factor = (Math.pow(1 + r, months) - 1) / (r * Math.pow(1 + r, months));
  return emiCapacity * factor;
}

function calcEMI(principal: number, annualRate: number, months: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export function LoanEligibilityCalculatorTool() {
  const [income, setIncome] = useState('75000');
  const [existingEmi, setExistingEmi] = useState('5000');
  const [loanType, setLoanType] = useState<LoanType>('home');
  const [tenure, setTenure] = useState('20');
  const [interestRate, setInterestRate] = useState('8.5');
  const [results, setResults] = useState<EligibilityResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLoanTypeChange = (type: LoanType) => {
    setLoanType(type);
    setInterestRate(String(LOAN_CONFIGS[type].defaultRate));
    setTenure(String(Math.min(parseInt(tenure) || 20, LOAN_CONFIGS[type].maxTenure)));
  };

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    const inc = parseFloat(income);
    const emi = parseFloat(existingEmi);
    const rate = parseFloat(interestRate);
    const yr = parseInt(tenure);
    const cfg = LOAN_CONFIGS[loanType];

    if (!income || isNaN(inc) || inc < 5000) errs.income = 'Minimum income is ₹5,000';
    if (isNaN(emi) || emi < 0) errs.existingEmi = 'Enter 0 if no existing EMIs';
    if (emi >= inc) errs.existingEmi = 'Existing EMIs cannot exceed income';
    if (!interestRate || isNaN(rate) || rate < 1 || rate > 30) errs.interestRate = 'Rate must be 1–30%';
    if (!tenure || isNaN(yr) || yr < 1 || yr > cfg.maxTenure)
      errs.tenure = `Tenure must be 1–${cfg.maxTenure} years for ${cfg.label}`;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [income, existingEmi, loanType, tenure, interestRate]);

  const handleCalculate = () => {
    if (!validate()) return;
    const inc = parseFloat(income);
    const emi = parseFloat(existingEmi);
    const rate = parseFloat(interestRate);
    const months = parseInt(tenure) * 12;
    const cfg = LOAN_CONFIGS[loanType];
    const currentFoir = (emi / inc) * 100;

    const emiCapLow = Math.max(0, (inc * cfg.foirLow) / 100 - emi);
    const emiCapMid = Math.max(0, (inc * cfg.foirMid) / 100 - emi);
    const emiCapHigh = Math.max(0, (inc * cfg.foirHigh) / 100 - emi);

    const conservative = calcMaxLoan(emiCapLow, rate, months);
    const moderate = calcMaxLoan(emiCapMid, rate, months);
    const liberal = calcMaxLoan(emiCapHigh, rate, months);

    setResults({
      conservative,
      moderate,
      liberal,
      emiConservative: calcEMI(conservative, rate, months),
      emiModerate: calcEMI(moderate, rate, months),
      emiLiberal: calcEMI(liberal, rate, months),
      foirConservative: cfg.foirLow,
      foirModerate: cfg.foirMid,
      foirLiberal: cfg.foirHigh,
      currentFoir,
    });
  };

  const handleReset = () => {
    setIncome('75000');
    setExistingEmi('5000');
    setLoanType('home');
    setTenure('20');
    setInterestRate('8.5');
    setResults(null);
    setErrors({});
  };

  const cfg = LOAN_CONFIGS[loanType];

  const eligibilityTips = [
    'Add a co-applicant (spouse/parent) to combine incomes',
    'Close existing loans to reduce EMI obligations',
    'Opt for a longer tenure to increase eligible amount',
    'Maintain a CIBIL score above 750 for best rates',
    'Declare all income sources (rent, freelance, business)',
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
          <Home className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Loan Eligibility Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Find your maximum loan amount using the FOIR method
          </p>
        </div>
      </div>

      {/* Loan Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(LOAN_CONFIGS) as LoanType[]).map((type) => (
          <button
            key={type}
            onClick={() => handleLoanTypeChange(type)}
            className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all border ${
              loanType === type
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            {LOAN_CONFIGS[type].label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Monthly Income */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Monthly Net Income
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IndianRupee className="w-4 h-4" />
            </span>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.income ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="75000"
            />
          </div>
          {errors.income && <p className="text-xs text-red-500">{errors.income}</p>}
        </div>

        {/* Existing EMIs */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Existing Monthly EMIs
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IndianRupee className="w-4 h-4" />
            </span>
            <input
              type="number"
              value={existingEmi}
              onChange={(e) => setExistingEmi(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.existingEmi ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="5000"
            />
          </div>
          {errors.existingEmi && <p className="text-xs text-red-500">{errors.existingEmi}</p>}
          <p className="text-xs text-slate-400">Enter 0 if no existing loans</p>
        </div>

        {/* Interest Rate */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Expected Interest Rate (%)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Percent className="w-4 h-4" />
            </span>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.interestRate ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder={String(cfg.defaultRate)}
              step="0.1"
            />
          </div>
          {errors.interestRate && <p className="text-xs text-red-500">{errors.interestRate}</p>}
          <p className="text-xs text-slate-400">Default: {cfg.defaultRate}% for {cfg.label}</p>
        </div>

        {/* Tenure */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Preferred Loan Tenure
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Calendar className="w-4 h-4" />
            </span>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.tenure ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="20"
              min="1"
              max={cfg.maxTenure}
            />
          </div>
          {errors.tenure && <p className="text-xs text-red-500">{errors.tenure}</p>}
          <p className="text-xs text-slate-400">Max {cfg.maxTenure} years for {cfg.label}</p>
        </div>

        {/* Buttons */}
        <div className="sm:col-span-2 flex gap-3 pt-2">
          <button
            onClick={handleCalculate}
            className="flex-1 py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Check Eligibility
          </button>
          <button
            onClick={handleReset}
            className="py-2.5 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-lg text-sm transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-5">
          {/* Current FOIR Alert */}
          {results.currentFoir > 0 && (
            <div className={`flex gap-2 p-4 rounded-xl border ${
              results.currentFoir > 40
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
                : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
            }`}>
              {results.currentFoir > 40
                ? <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                : <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              }
              <p className={`text-sm ${results.currentFoir > 40 ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                Your current FOIR from existing EMIs is{' '}
                <span className="font-semibold">{results.currentFoir.toFixed(1)}%</span>.{' '}
                {results.currentFoir > 40
                  ? 'This is high — consider closing some loans to improve eligibility.'
                  : 'Good — you have healthy EMI capacity for a new loan.'}
              </p>
            </div>
          )}

          {/* Eligibility Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Conservative',
                desc: `${results.foirConservative}% FOIR`,
                loan: results.conservative,
                emi: results.emiConservative,
                color: 'slate',
              },
              {
                label: 'Moderate',
                desc: `${results.foirModerate}% FOIR`,
                loan: results.moderate,
                emi: results.emiModerate,
                color: 'indigo',
              },
              {
                label: 'Liberal',
                desc: `${results.foirLiberal}% FOIR`,
                loan: results.liberal,
                emi: results.emiLiberal,
                color: 'emerald',
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-4 rounded-xl border shadow-sm ${
                  item.color === 'indigo'
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${
                    item.color === 'indigo' ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {item.label}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.color === 'indigo'
                      ? 'bg-indigo-700 text-indigo-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {item.desc}
                  </span>
                </div>
                <p className={`text-xl font-bold mb-1 ${
                  item.color === 'indigo' ? 'text-white' : 'text-slate-800 dark:text-slate-100'
                }`}>
                  {formatCompact(item.loan)}
                </p>
                <p className={`text-xs ${
                  item.color === 'indigo' ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  Max Loan Amount
                </p>
                <div className={`mt-3 pt-3 border-t ${
                  item.color === 'indigo' ? 'border-indigo-500' : 'border-slate-100 dark:border-slate-800'
                }`}>
                  <p className={`text-sm font-semibold ${
                    item.color === 'indigo' ? 'text-white' : 'text-slate-700 dark:text-slate-200'
                  }`}>
                    {formatINR(Math.round(item.emi))}/mo
                  </p>
                  <p className={`text-xs mt-0.5 ${
                    item.color === 'indigo' ? 'text-indigo-200' : 'text-slate-400'
                  }`}>
                    Estimated EMI
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Eligibility Bar */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Eligibility Range
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Conservative Bank', value: results.conservative, max: results.liberal, color: 'bg-slate-400' },
                { label: 'Moderate Bank', value: results.moderate, max: results.liberal, color: 'bg-indigo-500' },
                { label: 'Liberal Bank', value: results.liberal, max: results.liberal, color: 'bg-emerald-500' },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-300">{bar.label}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{formatCompact(bar.value)}</span>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bar.color} rounded-full transition-all duration-700`}
                      style={{ width: bar.max > 0 ? `${(bar.value / bar.max) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Tips to Increase Your Loan Eligibility
            </h3>
            <ul className="space-y-2">
              {eligibilityTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="flex gap-2 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              <span className="font-semibold">Disclaimer:</span> Actual loan eligibility is determined by
              individual bank policies, credit score, employment type, and property valuation. This
              calculator provides an estimate only and does not constitute a loan offer.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoanEligibilityCalculatorTool;
