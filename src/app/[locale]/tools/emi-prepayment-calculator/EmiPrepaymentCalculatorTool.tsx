'use client';

import { useState, useMemo, useCallback } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Copy, Check, Sparkles, ShieldCheck, IndianRupee, Calendar, TrendingDown, Percent } from 'lucide-react';

/* ── helpers ── */
const fmt = (n: number) => '\u20B9' + Math.round(n).toLocaleString('en-IN');
const fmtShort = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1e7) return '\u20B9' + (n / 1e7).toFixed(2) + ' Cr';
  if (abs >= 1e5) return '\u20B9' + (n / 1e5).toFixed(2) + ' L';
  return fmt(n);
};

function calcEMI(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

interface Prepayment {
  id: string;
  month: number;
  amount: number;
  type: 'reduce-tenure' | 'reduce-emi';
}

interface AmortRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  prepayment: number;
  balance: number;
  hasPrepayment: boolean;
}

function buildSchedule(
  principal: number,
  annualRate: number,
  totalMonths: number,
  prepayments: Prepayment[],
  extraMonthly: number,
): { rows: AmortRow[]; totalInterest: number; totalPayment: number } {
  const r = annualRate / 12 / 100;
  let balance = principal;
  let emi = calcEMI(principal, annualRate, totalMonths);
  const rows: AmortRow[] = [];
  let totalInterest = 0;
  let totalPayment = 0;

  const prepMap = new Map<number, Prepayment[]>();
  prepayments.forEach(p => {
    const list = prepMap.get(p.month) || [];
    list.push(p);
    prepMap.set(p.month, list);
  });

  for (let m = 1; m <= totalMonths * 2 && balance > 0.5; m++) {
    const interest = balance * r;
    let principalPaid = Math.min(emi - interest, balance);
    if (principalPaid < 0) principalPaid = 0;
    const actualEmi = Math.min(emi, interest + balance);
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    totalPayment += actualEmi;

    let prepaymentAmount = 0;
    let hasPrepayment = false;
    const monthPrepayments = prepMap.get(m) || [];

    if (extraMonthly > 0 && balance > 0) {
      const extra = Math.min(extraMonthly, balance);
      prepaymentAmount += extra;
      balance = Math.max(0, balance - extra);
      totalPayment += extra;
      hasPrepayment = true;
    }

    for (const pp of monthPrepayments) {
      if (balance <= 0) break;
      const amt = Math.min(pp.amount, balance);
      prepaymentAmount += amt;
      balance = Math.max(0, balance - amt);
      totalPayment += amt;
      hasPrepayment = true;

      if (pp.type === 'reduce-emi' && balance > 0) {
        const remainingMonths = totalMonths - m;
        if (remainingMonths > 0) {
          emi = calcEMI(balance, annualRate, remainingMonths);
        }
      }
    }

    rows.push({
      month: m,
      emi: actualEmi,
      principal: principalPaid,
      interest,
      prepayment: prepaymentAmount,
      balance,
      hasPrepayment,
    });

    if (balance <= 0.5) break;
  }

  return { rows, totalInterest, totalPayment };
}

function buildOriginalSchedule(principal: number, annualRate: number, months: number) {
  const emi = calcEMI(principal, annualRate, months);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  return { totalInterest, totalPayment, emi, months };
}

export function EmiPrepaymentCalculatorTool() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenureValue, setTenureValue] = useState(20);
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [prepayments, setPrepayments] = useState<Prepayment[]>([]);
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [showAmort, setShowAmort] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalMonths = tenureUnit === 'years' ? tenureValue * 12 : tenureValue;

  const original = useMemo(() => buildOriginalSchedule(principal, rate, totalMonths), [principal, rate, totalMonths]);

  const withPrepay = useMemo(
    () => buildSchedule(principal, rate, totalMonths, prepayments, extraMonthly),
    [principal, rate, totalMonths, prepayments, extraMonthly],
  );

  const hasPrepayments = prepayments.length > 0 || extraMonthly > 0;
  const interestSaved = hasPrepayments ? original.totalInterest - withPrepay.totalInterest : 0;
  const monthsSaved = hasPrepayments ? original.months - withPrepay.rows.length : 0;

  const addPrepayment = useCallback(() => {
    setPrepayments(prev => [
      ...prev,
      { id: crypto.randomUUID(), month: 36, amount: 200000, type: 'reduce-tenure' },
    ]);
  }, []);

  const removePrepayment = useCallback((id: string) => {
    setPrepayments(prev => prev.filter(p => p.id !== id));
  }, []);

  const updatePrepayment = useCallback((id: string, field: keyof Prepayment, value: string | number) => {
    setPrepayments(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: field === 'amount' || field === 'month' ? Number(value) : value } : p)),
    );
  }, []);

  const loadExample = useCallback(() => {
    setPrincipal(5000000);
    setRate(8.5);
    setTenureValue(20);
    setTenureUnit('years');
    setExtraMonthly(5000);
    setPrepayments([
      { id: crypto.randomUUID(), month: 36, amount: 200000, type: 'reduce-tenure' },
    ]);
  }, []);

  const copySummary = useCallback(() => {
    const lines = [
      'EMI Prepayment Calculator - Summary',
      '====================================',
      `Loan Amount: ${fmt(principal)}`,
      `Interest Rate: ${rate}%`,
      `Tenure: ${tenureValue} ${tenureUnit}`,
      '',
      '--- Original Loan ---',
      `Monthly EMI: ${fmt(original.emi)}`,
      `Total Interest: ${fmt(original.totalInterest)}`,
      `Total Payment: ${fmt(original.totalPayment)}`,
      '',
      '--- After Prepayment ---',
      `New Tenure: ${withPrepay.rows.length} months (${(withPrepay.rows.length / 12).toFixed(1)} years)`,
      `Total Interest: ${fmt(withPrepay.totalInterest)}`,
      `Total Payment: ${fmt(withPrepay.totalPayment)}`,
      '',
      '--- Savings ---',
      `Interest Saved: ${fmt(interestSaved)}`,
      `Months Saved: ${monthsSaved}`,
      '',
      'Generated at toolsarena.in',
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [principal, rate, tenureValue, tenureUnit, original, withPrepay, interestSaved, monthsSaved]);

  /* ── bar chart data ── */
  const maxTotal = Math.max(original.totalPayment, withPrepay.totalPayment);
  const origPrincipalPct = (principal / maxTotal) * 100;
  const origInterestPct = (original.totalInterest / maxTotal) * 100;
  const prepPrincipalPct = (principal / maxTotal) * 100;
  const prepInterestPct = (withPrepay.totalInterest / maxTotal) * 100;
  const prepPrepayPct = ((withPrepay.totalPayment - principal - withPrepay.totalInterest) / maxTotal) * 100;

  const inputClass =
    'w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="space-y-6">
      {/* ── Loan Inputs ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Loan Details
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Principal Amount
            </label>
            <input
              type="number"
              value={principal}
              min={10000}
              max={500000000}
              step={10000}
              onChange={e => setPrincipal(Math.max(10000, Number(e.target.value)))}
              className={inputClass}
            />
            <p className="text-xs text-slate-400 mt-1">{fmtShort(principal)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              value={rate}
              min={0.1}
              max={30}
              step={0.1}
              onChange={e => setRate(Math.max(0.1, Number(e.target.value)))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Loan Tenure
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={tenureValue}
                min={1}
                max={tenureUnit === 'years' ? 40 : 480}
                step={1}
                onChange={e => setTenureValue(Math.max(1, Number(e.target.value)))}
                className={inputClass + ' flex-1'}
              />
              <select
                value={tenureUnit}
                onChange={e => {
                  const newUnit = e.target.value as 'years' | 'months';
                  if (newUnit === 'months' && tenureUnit === 'years') setTenureValue(tenureValue * 12);
                  if (newUnit === 'years' && tenureUnit === 'months') setTenureValue(Math.max(1, Math.round(tenureValue / 12)));
                  setTenureUnit(newUnit);
                }}
                className={inputClass + ' w-24'}
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Prepayment Section ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Prepayments
        </h2>

        {/* Extra monthly */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Recurring Extra Monthly Payment
          </label>
          <input
            type="number"
            value={extraMonthly}
            min={0}
            max={principal}
            step={500}
            onChange={e => setExtraMonthly(Math.max(0, Number(e.target.value)))}
            className={inputClass + ' max-w-xs'}
            placeholder="e.g. 5000"
          />
          {extraMonthly > 0 && (
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
              {fmt(extraMonthly)} extra every month on top of EMI
            </p>
          )}
        </div>

        {/* Lump-sum prepayments */}
        <div className="space-y-3">
          {prepayments.map((pp) => (
            <div
              key={pp.id}
              className="grid grid-cols-12 gap-2 items-end bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3"
            >
              <div className="col-span-3 sm:col-span-3">
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Month #</label>
                <input
                  type="number"
                  value={pp.month}
                  min={1}
                  max={totalMonths}
                  onChange={e => updatePrepayment(pp.id, 'month', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="col-span-4 sm:col-span-4">
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Amount</label>
                <input
                  type="number"
                  value={pp.amount}
                  min={1000}
                  step={1000}
                  onChange={e => updatePrepayment(pp.id, 'amount', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="col-span-4 sm:col-span-4">
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Effect</label>
                <select
                  value={pp.type}
                  onChange={e => updatePrepayment(pp.id, 'type', e.target.value)}
                  className={inputClass}
                >
                  <option value="reduce-tenure">Reduce Tenure</option>
                  <option value="reduce-emi">Reduce EMI</option>
                </select>
              </div>
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={() => removePrepayment(pp.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  aria-label="Remove prepayment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={addPrepayment}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Lump-Sum Prepayment
          </button>
          <button
            onClick={loadExample}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Try Example
          </button>
        </div>
      </div>

      {/* ── Results Dashboard ── */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Original Loan
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Monthly EMI</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{fmt(original.emi)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Interest</span>
              <span className="font-bold text-red-600 dark:text-red-400">{fmt(original.totalInterest)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Payment</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{fmt(original.totalPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Tenure</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {original.months} months ({(original.months / 12).toFixed(1)} yrs)
              </span>
            </div>
          </div>
        </div>

        {/* After Prepayment */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-5">
          <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-3">
            After Prepayment
          </h3>
          {hasPrepayments ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">New Tenure</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {withPrepay.rows.length} months ({(withPrepay.rows.length / 12).toFixed(1)} yrs)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Interest</span>
                <span className="font-bold text-green-600 dark:text-green-400">{fmt(withPrepay.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Payment</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{fmt(withPrepay.totalPayment)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              Add prepayments above to see the impact.
            </p>
          )}
        </div>
      </div>

      {/* ── Savings Highlight ── */}
      {hasPrepayments && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-green-100 mb-3">Your Savings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold">{fmtShort(interestSaved)}</div>
              <div className="text-sm text-green-100 mt-1">Interest Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold">{monthsSaved}</div>
              <div className="text-sm text-green-100 mt-1">Months Saved</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <button
              onClick={copySummary}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>
          </div>
        </div>
      )}

      {/* ── Visual Comparison Bar Chart ── */}
      {hasPrepayments && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Percent className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Visual Comparison
          </h3>
          <div className="space-y-4">
            {/* Original bar */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Original</span>
                <span className="text-slate-500 dark:text-slate-400">{fmt(original.totalPayment)}</span>
              </div>
              <div className="flex h-10 rounded-lg overflow-hidden">
                <div
                  className="bg-indigo-500 flex items-center justify-center text-xs text-white font-medium min-w-0"
                  ref={(el) => { if (el) el.style.width = origPrincipalPct.toFixed(1) + '%'; }}
                  title={`Principal: ${fmt(principal)}`}
                >
                  Principal
                </div>
                <div
                  className="bg-red-400 flex items-center justify-center text-xs text-white font-medium min-w-0"
                  ref={(el) => { if (el) el.style.width = origInterestPct.toFixed(1) + '%'; }}
                  title={`Interest: ${fmt(original.totalInterest)}`}
                >
                  Interest
                </div>
              </div>
            </div>

            {/* Prepayment bar */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">With Prepayment</span>
                <span className="text-slate-500 dark:text-slate-400">{fmt(withPrepay.totalPayment)}</span>
              </div>
              <div className="flex h-10 rounded-lg overflow-hidden">
                <div className="bg-indigo-500 flex items-center justify-center text-xs text-white font-medium min-w-0"
                  ref={(el) => { if (el) el.style.width = prepPrincipalPct.toFixed(1) + '%'; }}
                >
                  Principal
                </div>
                <div className="bg-green-500 flex items-center justify-center text-xs text-white font-medium min-w-0"
                  ref={(el) => { if (el) el.style.width = prepInterestPct.toFixed(1) + '%'; }}
                >
                  Interest
                </div>
                {prepPrepayPct > 0.5 && (
                  <div className="bg-amber-500 flex items-center justify-center text-xs text-white font-medium min-w-0"
                    ref={(el) => { if (el) el.style.width = prepPrepayPct.toFixed(1) + '%'; }}
                  >
                    Extra
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-500" /> Principal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-400" /> Interest (Original)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-green-500" /> Interest (After Prepay)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500" /> Extra Payments
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Amortization Schedule ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setShowAmort(!showAmort)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Amortization Schedule
            {hasPrepayments && (
              <span className="text-xs font-normal text-slate-400">
                ({withPrepay.rows.length} months)
              </span>
            )}
          </h3>
          {showAmort ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showAmort && (
          <div className="px-5 pb-5">
            <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Month</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">EMI</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Principal</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Interest</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Prepayment</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(hasPrepayments ? withPrepay.rows : buildSchedule(principal, rate, totalMonths, [], 0).rows).map(
                    (row) => (
                      <tr
                        key={row.month}
                        className={
                          row.hasPrepayment
                            ? 'bg-amber-50 dark:bg-amber-900/20'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }
                      >
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                          {row.month}
                          {row.hasPrepayment && (
                            <span className="ml-1 text-xs text-amber-600 dark:text-amber-400 font-medium">PP</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-300">{fmt(row.emi)}</td>
                        <td className="px-3 py-2 text-right text-indigo-600 dark:text-indigo-400">{fmt(row.principal)}</td>
                        <td className="px-3 py-2 text-right text-red-500 dark:text-red-400">{fmt(row.interest)}</td>
                        <td className="px-3 py-2 text-right text-amber-600 dark:text-amber-400">
                          {row.prepayment > 0 ? fmt(row.prepayment) : '-'}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-slate-800 dark:text-slate-200">
                          {fmt(row.balance)}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Trust Badge ── */}
      <div className="flex items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-500 py-2">
        <ShieldCheck className="w-4 h-4" />
        <span>All calculations happen in your browser. No data is stored or sent to any server.</span>
      </div>
    </div>
  );
}
