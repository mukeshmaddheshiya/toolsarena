'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  IndianRupee,
  TrendingUp,
  Shield,
  Copy,
  Check,
  Sparkles,
  Calendar,
  Percent,
  Wallet,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

const fmt = (n: number) =>
  '\u20B9' + Math.round(n).toLocaleString('en-IN');

const fmtLakh = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_00_00_000) return '\u20B9' + (n / 1_00_00_000).toFixed(2) + ' Cr';
  if (abs >= 1_00_000) return '\u20B9' + (n / 1_00_000).toFixed(2) + ' L';
  return fmt(n);
};

interface YearRow {
  year: number;
  age: number;
  openingBalance: number;
  employeeContribution: number;
  employerContribution: number;
  interestEarned: number;
  closingBalance: number;
  monthlySalary: number;
}

function computeEpf(
  basicSalary: number,
  employeeRate: number,
  interestRate: number,
  currentAge: number,
  retirementAge: number,
  annualIncrement: number,
  existingBalance: number
): { rows: YearRow[]; totalEmployee: number; totalEmployer: number; totalInterest: number; maturityAmount: number } {
  const years = retirementAge - currentAge;
  if (years <= 0) return { rows: [], totalEmployee: 0, totalEmployer: 0, totalInterest: 0, maturityAmount: 0 };

  const rows: YearRow[] = [];
  let balance = existingBalance;
  let salary = basicSalary;
  let totalEmployee = 0;
  let totalEmployer = 0;
  let totalInterest = 0;

  const monthlyInterestRate = interestRate / 100 / 12;
  const employerEpfRate = 3.67;

  for (let i = 0; i < years; i++) {
    const openingBalance = balance;
    const monthlyEmployee = salary * (employeeRate / 100);
    const monthlyEmployer = salary * (employerEpfRate / 100);
    const annualEmployee = monthlyEmployee * 12;
    const annualEmployer = monthlyEmployer * 12;

    // Monthly compounding for interest calculation
    let yearInterest = 0;
    let runningBalance = openingBalance;
    for (let m = 0; m < 12; m++) {
      runningBalance += monthlyEmployee + monthlyEmployer;
      const monthInterest = runningBalance * monthlyInterestRate;
      yearInterest += monthInterest;
      runningBalance += monthInterest;
    }

    const closingBalance = runningBalance;

    totalEmployee += annualEmployee;
    totalEmployer += annualEmployer;
    totalInterest += yearInterest;

    rows.push({
      year: i + 1,
      age: currentAge + i,
      openingBalance,
      employeeContribution: annualEmployee,
      employerContribution: annualEmployer,
      interestEarned: yearInterest,
      closingBalance,
      monthlySalary: salary,
    });

    balance = closingBalance;
    salary = salary * (1 + annualIncrement / 100);
  }

  return { rows, totalEmployee, totalEmployer, totalInterest, maturityAmount: balance };
}

export function EpfCalculatorTool() {
  const [basicSalary, setBasicSalary] = useState(25000);
  const [employeeRate, setEmployeeRate] = useState(12);
  const [interestRate, setInterestRate] = useState(8.25);
  const [currentAge, setCurrentAge] = useState(28);
  const [retirementAge, setRetirementAge] = useState(58);
  const [annualIncrement, setAnnualIncrement] = useState(5);
  const [existingBalance, setExistingBalance] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(
    () => computeEpf(basicSalary, employeeRate, interestRate, currentAge, retirementAge, annualIncrement, existingBalance),
    [basicSalary, employeeRate, interestRate, currentAge, retirementAge, annualIncrement, existingBalance]
  );

  const { rows, totalEmployee, totalEmployer, totalInterest, maturityAmount } = result;
  const totalContributions = totalEmployee + totalEmployer + existingBalance;
  const yearsToRetire = retirementAge - currentAge;

  const handleTryExample = useCallback(() => {
    setBasicSalary(25000);
    setEmployeeRate(12);
    setInterestRate(8.25);
    setCurrentAge(28);
    setRetirementAge(58);
    setAnnualIncrement(5);
    setExistingBalance(0);
  }, []);

  const handleCopy = useCallback(() => {
    const lines = [
      'EPF Calculator Results',
      '========================',
      `Basic Salary (+ DA): ${fmt(basicSalary)}/month`,
      `Employee Contribution Rate: ${employeeRate}%`,
      `Employer EPF Rate: 3.67%`,
      `EPF Interest Rate: ${interestRate}% p.a.`,
      `Current Age: ${currentAge} | Retirement Age: ${retirementAge}`,
      `Annual Salary Increment: ${annualIncrement}%`,
      existingBalance > 0 ? `Existing EPF Balance: ${fmt(existingBalance)}` : '',
      '',
      `Maturity Amount: ${fmt(maturityAmount)}`,
      `Total Employee Contribution: ${fmt(totalEmployee)}`,
      `Total Employer Contribution: ${fmt(totalEmployer)}`,
      `Total Interest Earned: ${fmt(totalInterest)}`,
      `Investment Period: ${yearsToRetire} years`,
      '',
      'Year-by-Year Breakdown:',
      'Year | Age | Opening Bal | Employee | Employer | Interest | Closing Bal',
      ...rows.map(
        (r) =>
          `${r.year} | ${r.age} | ${fmt(r.openingBalance)} | ${fmt(r.employeeContribution)} | ${fmt(r.employerContribution)} | ${fmt(r.interestEarned)} | ${fmt(r.closingBalance)}`
      ),
      '',
      'Calculated at toolsarena.in/tools/epf-calculator',
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [basicSalary, employeeRate, interestRate, currentAge, retirementAge, annualIncrement, existingBalance, maturityAmount, totalEmployee, totalEmployer, totalInterest, yearsToRetire, rows]);

  const maxClosing = rows.length > 0 ? rows[rows.length - 1].closingBalance : 1;

  return (
    <div className="space-y-6">
      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl px-4 py-2.5 border border-emerald-200 dark:border-emerald-800">
        <Shield className="w-4 h-4 shrink-0" />
        <span>100% Private — calculated entirely in your browser</span>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            EPF Details
          </h2>
          <button
            onClick={handleTryExample}
            className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Try Example
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Basic Salary */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <IndianRupee className="w-3.5 h-3.5" />
              Monthly Basic Salary + DA
            </label>
            <input
              type="number"
              value={basicSalary}
              min={1000}
              max={1000000}
              step={500}
              onChange={(e) => setBasicSalary(Math.max(1000, Number(e.target.value) || 1000))}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-100"
            />
            <input
              type="range"
              min={1000}
              max={200000}
              step={500}
              value={basicSalary}
              onChange={(e) => setBasicSalary(Number(e.target.value))}
              className="w-full mt-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Employee Contribution Rate */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <Percent className="w-3.5 h-3.5" />
              Employee Contribution Rate
            </label>
            <input
              type="number"
              value={employeeRate}
              min={1}
              max={100}
              step={0.5}
              onChange={(e) => setEmployeeRate(Math.max(1, Math.min(100, Number(e.target.value) || 12)))}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-100"
            />
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Default: 12% of Basic + DA</div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              EPF Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              value={interestRate}
              min={1}
              max={15}
              step={0.05}
              onChange={(e) => setInterestRate(Math.max(1, Math.min(15, Number(e.target.value) || 8.25)))}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-100"
            />
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">FY 2025-26 rate: 8.25%</div>
          </div>

          {/* Current Age */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Current Age
            </label>
            <input
              type="number"
              value={currentAge}
              min={18}
              max={57}
              step={1}
              onChange={(e) => setCurrentAge(Math.max(18, Math.min(57, Number(e.target.value) || 28)))}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-100"
            />
            <input
              type="range"
              min={18}
              max={57}
              step={1}
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full mt-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Retirement Age */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Retirement Age
            </label>
            <input
              type="number"
              value={retirementAge}
              min={currentAge + 1}
              max={70}
              step={1}
              onChange={(e) => setRetirementAge(Math.max(currentAge + 1, Math.min(70, Number(e.target.value) || 58)))}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-100"
            />
            <input
              type="range"
              min={currentAge + 1}
              max={70}
              step={1}
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full mt-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Annual Increment */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Annual Salary Increment (%)
            </label>
            <input
              type="number"
              value={annualIncrement}
              min={0}
              max={30}
              step={0.5}
              onChange={(e) => setAnnualIncrement(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-100"
            />
            <input
              type="range"
              min={0}
              max={30}
              step={0.5}
              value={annualIncrement}
              onChange={(e) => setAnnualIncrement(Number(e.target.value))}
              className="w-full mt-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

        {/* Existing Balance */}
        <div className="mt-5 max-w-sm">
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            <Wallet className="w-3.5 h-3.5" />
            Existing EPF Balance (optional)
          </label>
          <input
            type="number"
            value={existingBalance}
            min={0}
            step={1000}
            onChange={(e) => setExistingBalance(Math.max(0, Number(e.target.value) || 0))}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-100"
            placeholder="0"
          />
        </div>

        {/* Employer split info */}
        <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>
            Employer contributes 12% of Basic + DA, split as <strong>3.67% to EPF</strong> and <strong>8.33% to EPS</strong> (Pension Scheme).
            Only the EPF portion (3.67%) is included in your EPF balance.
          </span>
        </div>
      </div>

      {/* Results Hero */}
      {yearsToRetire > 0 && (
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
          <div className="text-center mb-6">
            <div className="text-sm text-emerald-200 mb-1">EPF Maturity Amount at Age {retirementAge}</div>
            <div className="text-4xl sm:text-5xl font-heading font-bold tracking-tight">{fmtLakh(maturityAmount)}</div>
            <div className="text-sm text-emerald-200 mt-1">{fmt(maturityAmount)}</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-emerald-200">Your Contribution</div>
              <div className="font-bold text-lg">{fmtLakh(totalEmployee)}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-emerald-200">Employer (EPF)</div>
              <div className="font-bold text-lg">{fmtLakh(totalEmployer)}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-emerald-200">Interest Earned</div>
              <div className="font-bold text-lg">{fmtLakh(totalInterest)}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-emerald-200">Period</div>
              <div className="font-bold text-lg">{yearsToRetire} yrs</div>
            </div>
          </div>

          {/* Contribution vs Interest bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-emerald-200 mb-1">
              <span>Total Contributions ({((totalContributions / maturityAmount) * 100).toFixed(1)}%)</span>
              <span>Interest ({((totalInterest / maturityAmount) * 100).toFixed(1)}%)</span>
            </div>
            <div className="h-3 bg-emerald-800 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-300 transition-all duration-500"
                style={{ width: `${(totalContributions / maturityAmount) * 100}%` }}
              />
              <div
                className="bg-yellow-300 transition-all duration-500"
                style={{ width: `${(totalInterest / maturityAmount) * 100}%` }}
              />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-emerald-200">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-300 inline-block" /> Contributions</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-300 inline-block" /> Interest</span>
            </div>
          </div>

          {/* Copy Button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Results'}
            </button>
          </div>
        </div>
      )}

      {/* Growth Chart */}
      {rows.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Year-by-Year Growth
          </h3>

          {/* Visual Bar Chart */}
          <div className="space-y-1.5 mb-2">
            {rows.map((r) => {
              const contributionWidth = ((r.employeeContribution + r.employerContribution) / maxClosing) * 100;
              const interestWidth = (r.interestEarned / maxClosing) * 100;
              const openingWidth = (r.openingBalance / maxClosing) * 100;
              return (
                <div key={r.year} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 w-12 text-right shrink-0 tabular-nums">
                    Yr {r.year}
                  </span>
                  <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden flex">
                    <div
                      className="bg-emerald-200 dark:bg-emerald-900 transition-all duration-300"
                      style={{ width: `${openingWidth}%` }}
                      title={`Opening: ${fmt(r.openingBalance)}`}
                    />
                    <div
                      className="bg-emerald-500 dark:bg-emerald-600 transition-all duration-300"
                      style={{ width: `${contributionWidth}%` }}
                      title={`Contributions: ${fmt(r.employeeContribution + r.employerContribution)}`}
                    />
                    <div
                      className="bg-yellow-400 dark:bg-yellow-500 transition-all duration-300"
                      style={{ width: `${interestWidth}%` }}
                      title={`Interest: ${fmt(r.interestEarned)}`}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300 w-20 text-right shrink-0 tabular-nums hidden sm:block">
                    {fmtLakh(r.closingBalance)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-200 dark:bg-emerald-900 inline-block" /> Previous Balance</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 dark:bg-emerald-600 inline-block" /> Contributions</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-400 dark:bg-yellow-500 inline-block" /> Interest</span>
          </div>
        </div>
      )}

      {/* Detailed Table */}
      {rows.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button
            onClick={() => setShowTable(!showTable)}
            className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Detailed Year-by-Year Table
            </h3>
            {showTable ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {showTable && (
            <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-50 dark:bg-emerald-950/40 text-slate-600 dark:text-slate-300">
                    <th className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">Year</th>
                    <th className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">Age</th>
                    <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">Monthly Salary</th>
                    <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">Opening Bal.</th>
                    <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">Employee</th>
                    <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">Employer (EPF)</th>
                    <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">Interest</th>
                    <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">Closing Bal.</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr
                      key={r.year}
                      className={`border-t border-slate-100 dark:border-slate-700 ${
                        idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-850'
                      } hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors`}
                    >
                      <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-200 tabular-nums">{r.year}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300 tabular-nums">{r.age}</td>
                      <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-300 tabular-nums whitespace-nowrap">{fmt(r.monthlySalary)}</td>
                      <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-300 tabular-nums whitespace-nowrap">{fmt(r.openingBalance)}</td>
                      <td className="px-3 py-2 text-right text-emerald-700 dark:text-emerald-400 font-medium tabular-nums whitespace-nowrap">{fmt(r.employeeContribution)}</td>
                      <td className="px-3 py-2 text-right text-teal-700 dark:text-teal-400 font-medium tabular-nums whitespace-nowrap">{fmt(r.employerContribution)}</td>
                      <td className="px-3 py-2 text-right text-yellow-700 dark:text-yellow-400 font-medium tabular-nums whitespace-nowrap">{fmt(r.interestEarned)}</td>
                      <td className="px-3 py-2 text-right font-bold text-slate-800 dark:text-slate-100 tabular-nums whitespace-nowrap">{fmt(r.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 font-bold text-slate-700 dark:text-slate-200">
                    <td className="px-3 py-2.5" colSpan={3}>Total</td>
                    <td className="px-3 py-2.5 text-right tabular-nums whitespace-nowrap">{existingBalance > 0 ? fmt(existingBalance) : '-'}</td>
                    <td className="px-3 py-2.5 text-right text-emerald-700 dark:text-emerald-400 tabular-nums whitespace-nowrap">{fmt(totalEmployee)}</td>
                    <td className="px-3 py-2.5 text-right text-teal-700 dark:text-teal-400 tabular-nums whitespace-nowrap">{fmt(totalEmployer)}</td>
                    <td className="px-3 py-2.5 text-right text-yellow-700 dark:text-yellow-400 tabular-nums whitespace-nowrap">{fmt(totalInterest)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums whitespace-nowrap">{fmt(maturityAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Key Insights */}
      {yearsToRetire > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Key Numbers
            </h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Monthly Employee Contribution</dt>
                <dd className="font-medium text-slate-700 dark:text-slate-200">{fmt(basicSalary * employeeRate / 100)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Monthly Employer EPF</dt>
                <dd className="font-medium text-slate-700 dark:text-slate-200">{fmt(basicSalary * 3.67 / 100)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Monthly EPS (Pension)</dt>
                <dd className="font-medium text-slate-700 dark:text-slate-200">{fmt(basicSalary * 8.33 / 100)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Total Monthly to EPF</dt>
                <dd className="font-bold text-emerald-700 dark:text-emerald-400">
                  {fmt(basicSalary * employeeRate / 100 + basicSalary * 3.67 / 100)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Wealth Multiplier
            </h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Total You Invested</dt>
                <dd className="font-medium text-slate-700 dark:text-slate-200">{fmtLakh(totalEmployee)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Employer Added (EPF)</dt>
                <dd className="font-medium text-slate-700 dark:text-slate-200">{fmtLakh(totalEmployer)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Interest Earned</dt>
                <dd className="font-medium text-yellow-700 dark:text-yellow-400">{fmtLakh(totalInterest)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 dark:border-slate-700 pt-2">
                <dt className="text-slate-500 dark:text-slate-400">Return on Your Investment</dt>
                <dd className="font-bold text-emerald-700 dark:text-emerald-400">
                  {totalEmployee > 0 ? ((maturityAmount / totalEmployee - 1) * 100).toFixed(1) : 0}%
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {yearsToRetire <= 0 && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">Retirement age must be greater than current age</p>
          <p className="text-sm mt-1">Please adjust the ages above to see your EPF projection.</p>
        </div>
      )}
    </div>
  );
}
