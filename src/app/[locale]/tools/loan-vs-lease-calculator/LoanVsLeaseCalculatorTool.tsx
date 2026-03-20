'use client';

import { useState, useCallback } from 'react';
import {
  ArrowLeftRight,
  IndianRupee,
  Percent,
  Calendar,
  Info,
  CheckCircle,
  XCircle,
  Trophy,
} from 'lucide-react';

interface LoanInputs {
  vehiclePrice: string;
  downPayment: string;
  interestRate: string;
  tenureMonths: string;
  insurancePerYear: string;
  maintenancePerYear: string;
  resaleValue: string;
}

interface LeaseInputs {
  monthlyLease: string;
  securityDeposit: string;
  insuranceIncluded: boolean;
  maintenanceIncluded: boolean;
}

interface Results {
  loan: {
    totalEmi: number;
    totalInterest: number;
    totalInsurance: number;
    totalMaintenance: number;
    resaleValue: number;
    netCost: number;
    emi: number;
  };
  lease: {
    totalLeasePayments: number;
    securityDeposit: number;
    insurance: number;
    maintenance: number;
    netCost: number;
  };
  winner: 'loan' | 'lease' | 'equal';
  difference: number;
}

const formatINR = (v: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(v);

const formatCompact = (v: number): string => {
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(2)} Cr`;
  if (v >= 1_00_000) return `₹${(v / 1_00_000).toFixed(2)} L`;
  return formatINR(v);
};

function calcEMI(principal: number, annualRate: number, months: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export function LoanVsLeaseCalculatorTool() {
  const [loanInputs, setLoanInputs] = useState<LoanInputs>({
    vehiclePrice: '1200000',
    downPayment: '200000',
    interestRate: '9',
    tenureMonths: '60',
    insurancePerYear: '35000',
    maintenancePerYear: '15000',
    resaleValue: '550000',
  });

  const [leaseInputs, setLeaseInputs] = useState<LeaseInputs>({
    monthlyLease: '28000',
    securityDeposit: '100000',
    insuranceIncluded: true,
    maintenanceIncluded: true,
  });

  const [results, setResults] = useState<Results | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'loan' | 'lease'>('loan');

  const setLoan = (key: keyof LoanInputs, val: string) =>
    setLoanInputs((prev) => ({ ...prev, [key]: val }));
  const setLease = (key: keyof LeaseInputs, val: string | boolean) =>
    setLeaseInputs((prev) => ({ ...prev, [key]: val }));

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    const vp = parseFloat(loanInputs.vehiclePrice);
    const dp = parseFloat(loanInputs.downPayment);
    const ir = parseFloat(loanInputs.interestRate);
    const tm = parseInt(loanInputs.tenureMonths);
    const ml = parseFloat(leaseInputs.monthlyLease);

    if (!loanInputs.vehiclePrice || isNaN(vp) || vp < 10000) errs.vehiclePrice = 'Enter a valid vehicle price';
    if (isNaN(dp) || dp < 0) errs.downPayment = 'Down payment cannot be negative';
    if (dp >= vp) errs.downPayment = 'Down payment cannot exceed vehicle price';
    if (!loanInputs.interestRate || isNaN(ir) || ir < 1 || ir > 30) errs.interestRate = 'Interest rate must be 1–30%';
    if (!loanInputs.tenureMonths || isNaN(tm) || tm < 6 || tm > 360) errs.tenureMonths = 'Tenure must be 6–360 months';
    if (!leaseInputs.monthlyLease || isNaN(ml) || ml < 500) errs.monthlyLease = 'Enter a valid monthly lease amount';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [loanInputs, leaseInputs]);

  const handleCalculate = () => {
    if (!validate()) return;

    const vp = parseFloat(loanInputs.vehiclePrice);
    const dp = parseFloat(loanInputs.downPayment);
    const ir = parseFloat(loanInputs.interestRate);
    const tm = parseInt(loanInputs.tenureMonths);
    const insYear = parseFloat(loanInputs.insurancePerYear) || 0;
    const mntYear = parseFloat(loanInputs.maintenancePerYear) || 0;
    const resale = parseFloat(loanInputs.resaleValue) || 0;

    const principal = vp - dp;
    const emi = calcEMI(principal, ir, tm);
    const totalEmi = emi * tm;
    const totalInterest = totalEmi - principal;
    const years = tm / 12;
    const totalInsurance = insYear * years;
    const totalMaintenance = mntYear * years;
    const loanNetCost = dp + totalEmi + totalInsurance + totalMaintenance - resale;

    const ml = parseFloat(leaseInputs.monthlyLease);
    const sd = parseFloat(leaseInputs.securityDeposit) || 0;
    const leaseInsurance = leaseInputs.insuranceIncluded ? 0 : insYear * years;
    const leaseMaintenance = leaseInputs.maintenanceIncluded ? 0 : mntYear * years;
    const totalLease = ml * tm;
    const leaseNetCost = totalLease + leaseInsurance + leaseMaintenance;

    const diff = Math.abs(loanNetCost - leaseNetCost);
    const winner: 'loan' | 'lease' | 'equal' =
      diff < 1000 ? 'equal' : loanNetCost < leaseNetCost ? 'loan' : 'lease';

    setResults({
      loan: {
        totalEmi,
        totalInterest,
        totalInsurance,
        totalMaintenance,
        resaleValue: resale,
        netCost: loanNetCost,
        emi,
      },
      lease: {
        totalLeasePayments: totalLease,
        securityDeposit: sd,
        insurance: leaseInsurance,
        maintenance: leaseMaintenance,
        netCost: leaseNetCost,
      },
      winner,
      difference: diff,
    });
  };

  const handleReset = () => {
    setResults(null);
    setErrors({});
  };

  const considerations = [
    { label: 'Ownership at End', loan: true, lease: false, loanNote: 'You own the car', leaseNote: 'Car returned to lessor' },
    { label: 'Flexibility to Switch', loan: false, lease: true, loanNote: 'Sell first, then switch', leaseNote: 'Simply return at lease end' },
    { label: 'Customization (Accessories)', loan: true, lease: false, loanNote: 'Fully customizable', leaseNote: 'Modifications not allowed' },
    { label: 'No Mileage Restriction', loan: true, lease: false, loanNote: 'Drive as much as you like', leaseNote: 'Usually 1,500–2,000 km/month cap' },
    { label: 'Latest Model Access', loan: false, lease: true, loanNote: 'Keep existing car or sell', leaseNote: 'Get new model every cycle' },
    { label: 'Lower Monthly Outflow', loan: false, lease: true, loanNote: 'EMI + insurance + maintenance', leaseNote: 'Single all-inclusive payment' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
          <ArrowLeftRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Loan vs Lease Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Compare the true cost of buying vs leasing a vehicle
          </p>
        </div>
      </div>

      {/* Tab Switcher for inputs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('loan')}
          className={`py-2 px-5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'loan'
              ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          Loan Details
        </button>
        <button
          onClick={() => setActiveTab('lease')}
          className={`py-2 px-5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'lease'
              ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          Lease Details
        </button>
      </div>

      {/* Loan Inputs */}
      {activeTab === 'loan' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="sm:col-span-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Loan / Purchase Details
          </h3>
          {[
            { key: 'vehiclePrice' as const, label: 'Vehicle Price', placeholder: '1200000', prefix: true },
            { key: 'downPayment' as const, label: 'Down Payment', placeholder: '200000', prefix: true },
            { key: 'interestRate' as const, label: 'Loan Interest Rate (%)', placeholder: '9', prefix: false },
            { key: 'tenureMonths' as const, label: 'Loan Tenure (Months)', placeholder: '60', prefix: false },
            { key: 'insurancePerYear' as const, label: 'Insurance per Year (₹)', placeholder: '35000', prefix: true },
            { key: 'maintenancePerYear' as const, label: 'Maintenance per Year (₹)', placeholder: '15000', prefix: true },
            { key: 'resaleValue' as const, label: 'Expected Resale Value (₹)', placeholder: '550000', prefix: true },
          ].map(({ key, label, placeholder, prefix }) => (
            <div key={key} className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
              </label>
              <div className="relative">
                {prefix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <IndianRupee className="w-4 h-4" />
                  </span>
                )}
                {!prefix && key === 'interestRate' && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Percent className="w-4 h-4" />
                  </span>
                )}
                {!prefix && key === 'tenureMonths' && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                )}
                <input
                  type="number"
                  value={loanInputs[key]}
                  onChange={(e) => setLoan(key, e.target.value)}
                  className={`w-full ${prefix || !prefix ? 'pl-9' : 'pl-3'} pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors[key] ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
                  }`}
                  placeholder={placeholder}
                  step={key === 'interestRate' ? '0.1' : '1'}
                />
              </div>
              {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Lease Inputs */}
      {activeTab === 'lease' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="sm:col-span-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Lease / Subscription Details
          </h3>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Monthly Lease Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </span>
              <input
                type="number"
                value={leaseInputs.monthlyLease}
                onChange={(e) => setLease('monthlyLease', e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.monthlyLease ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
                }`}
                placeholder="28000"
              />
            </div>
            {errors.monthlyLease && <p className="text-xs text-red-500">{errors.monthlyLease}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Security Deposit (₹) <span className="text-slate-400 font-normal">(refundable)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </span>
              <input
                type="number"
                value={leaseInputs.securityDeposit}
                onChange={(e) => setLease('securityDeposit', e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="100000"
              />
            </div>
            <p className="text-xs text-slate-400">Deposit is returned at lease end — counted as ₹0 net cost</p>
          </div>

          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div
                onClick={() => setLease('insuranceIncluded', !leaseInputs.insuranceIncluded)}
                className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${
                  leaseInputs.insuranceIncluded ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    leaseInputs.insuranceIncluded ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Insurance Included</p>
                <p className="text-xs text-slate-400">
                  {leaseInputs.insuranceIncluded ? 'Insurance is part of lease fee' : 'You pay insurance separately'}
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div
                onClick={() => setLease('maintenanceIncluded', !leaseInputs.maintenanceIncluded)}
                className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${
                  leaseInputs.maintenanceIncluded ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    leaseInputs.maintenanceIncluded ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Maintenance Included</p>
                <p className="text-xs text-slate-400">
                  {leaseInputs.maintenanceIncluded ? 'Maintenance is part of lease fee' : 'You pay maintenance separately'}
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Calculate Button */}
      <div className="flex gap-3">
        <button
          onClick={handleCalculate}
          className="flex-1 py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Compare Loan vs Lease
        </button>
        <button
          onClick={handleReset}
          className="py-2.5 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-lg text-sm transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-5">
          {/* Winner Banner */}
          <div className={`p-5 rounded-xl border-2 flex items-center gap-4 ${
            results.winner === 'loan'
              ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-700'
              : results.winner === 'lease'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700'
              : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700'
          }`}>
            <Trophy className={`w-8 h-8 shrink-0 ${
              results.winner === 'loan' ? 'text-indigo-500' : results.winner === 'lease' ? 'text-emerald-500' : 'text-slate-400'
            }`} />
            <div>
              <p className={`text-base font-bold ${
                results.winner === 'loan'
                  ? 'text-indigo-700 dark:text-indigo-300'
                  : results.winner === 'lease'
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-300'
              }`}>
                {results.winner === 'equal'
                  ? 'Both options cost approximately the same!'
                  : `${results.winner === 'loan' ? 'Loan (Buy)' : 'Lease'} is cheaper by ${formatCompact(results.difference)}`}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Over {loanInputs.tenureMonths} months total tenure
              </p>
            </div>
          </div>

          {/* Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Loan Cost */}
            <div className={`p-5 rounded-xl border-2 shadow-sm ${
              results.winner === 'loan'
                ? 'border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Loan (Buy)</h3>
                {results.winner === 'loan' && (
                  <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-medium">
                    Cheaper
                  </span>
                )}
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Down Payment', value: parseFloat(loanInputs.downPayment) || 0, sign: '-' },
                  { label: 'Total EMI Paid', value: results.loan.totalEmi, sign: '-' },
                  { label: 'Total Interest', value: results.loan.totalInterest, sign: '(incl.)' },
                  { label: 'Total Insurance', value: results.loan.totalInsurance, sign: '-' },
                  { label: 'Total Maintenance', value: results.loan.totalMaintenance, sign: '-' },
                  { label: 'Resale Value', value: results.loan.resaleValue, sign: '+' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
                    <span className={`font-medium ${
                      row.sign === '+' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'
                    }`}>
                      {row.sign === '+' ? '+' : row.sign === '-' ? '-' : ''}{formatINR(row.value)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Net Cost of Ownership</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCompact(results.loan.netCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-xs">Monthly EMI</span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {formatINR(Math.round(results.loan.emi))}/mo
                  </span>
                </div>
              </div>
            </div>

            {/* Lease Cost */}
            <div className={`p-5 rounded-xl border-2 shadow-sm ${
              results.winner === 'lease'
                ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Lease</h3>
                {results.winner === 'lease' && (
                  <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-medium">
                    Cheaper
                  </span>
                )}
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Total Lease Payments', value: results.lease.totalLeasePayments, sign: '-' },
                  { label: 'Security Deposit', value: results.lease.securityDeposit, sign: '~0' },
                  ...(results.lease.insurance > 0
                    ? [{ label: 'Insurance (extra)', value: results.lease.insurance, sign: '-' }]
                    : [{ label: 'Insurance', value: 0, sign: 'incl' }]),
                  ...(results.lease.maintenance > 0
                    ? [{ label: 'Maintenance (extra)', value: results.lease.maintenance, sign: '-' }]
                    : [{ label: 'Maintenance', value: 0, sign: 'incl' }]),
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {row.sign === '~0'
                        ? 'Refunded'
                        : row.sign === 'incl'
                        ? 'Included'
                        : `-${formatINR(row.value)}`}
                    </span>
                  </div>
                ))}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Net Cost of Leasing</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCompact(results.lease.netCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-xs">Monthly Outflow</span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {formatINR(parseFloat(leaseInputs.monthlyLease))}/mo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Factor Comparison */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Factor-by-Factor Comparison
            </h3>
            <div className="space-y-0">
              {considerations.map((c, i) => (
                <div
                  key={c.label}
                  className={`grid grid-cols-5 gap-2 py-3 text-sm items-center ${
                    i < considerations.length - 1 ? 'border-b border-slate-50 dark:border-slate-800' : ''
                  }`}
                >
                  <div className="col-span-1 font-medium text-slate-700 dark:text-slate-200 text-xs leading-tight">
                    {c.label}
                  </div>
                  <div className="col-span-2 flex items-start gap-1.5">
                    {c.loan ? (
                      <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span className={`text-xs ${c.loan ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}>
                      {c.loanNote}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-start gap-1.5">
                    {c.lease ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span className={`text-xs ${c.lease ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}>
                      {c.leaseNote}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-indigo-500" />
                <span className="text-xs text-slate-500">Loan advantage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-slate-500">Lease advantage</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex gap-2 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              <span className="font-semibold">Disclaimer:</span> This comparison is indicative and based
              on inputs provided. Tax benefits under Section 10 for car lease perquisite exemption for
              salaried employees are not included. Fuel costs, depreciation, and road tax are excluded.
              Consult a financial advisor for a comprehensive analysis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
