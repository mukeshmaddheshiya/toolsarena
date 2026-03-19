'use client';
import { useState, useMemo } from 'react';

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

function calcNewRegimeTax(taxable: number): number {
  const slabs = [
    { limit: 300000, rate: 0 }, { limit: 700000, rate: 0.05 }, { limit: 1000000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 }, { limit: 1500000, rate: 0.20 }, { limit: Infinity, rate: 0.30 },
  ];
  let tax = 0, prev = 0;
  for (const slab of slabs) {
    if (taxable <= prev) break;
    const chunk = Math.min(taxable, slab.limit) - prev;
    if (chunk > 0) tax += chunk * slab.rate;
    prev = slab.limit;
  }
  // Rebate u/s 87A: no tax if income ≤ 7L under new regime
  if (taxable <= 700000) tax = 0;
  return tax + tax * 0.04; // 4% cess
}

export function CTCToInHandCalculatorTool() {
  const [ctc, setCTC] = useState(1000000);
  const [basicPct, setBasicPct] = useState(40);
  const [hraPct, setHraPct] = useState(50);
  const [isMetro, setIsMetro] = useState(true);
  const [pfCapped, setPfCapped] = useState(false);
  const [profTax, setProfTax] = useState(200);
  const [regime, setRegime] = useState<'new' | 'old'>('new');

  const breakdown = useMemo(() => {
    const annualBasic = ctc * (basicPct / 100);
    const monthlyBasic = annualBasic / 12;
    const annualHRA = annualBasic * (hraPct / 100);
    const monthlyHRA = annualHRA / 12;

    const epfBasic = pfCapped ? Math.min(annualBasic, 15000 * 12) : annualBasic;
    const employerPF = epfBasic * 0.12;
    const employeePF = epfBasic * 0.12;
    const gratuity = (annualBasic * 15) / 26;

    const specialAllowance = Math.max(0, ctc - annualBasic - annualHRA - employerPF - gratuity);
    const grossSalary = ctc - employerPF - gratuity;

    // Tax calculation (New Regime)
    const stdDeduction = 75000;
    let taxableIncome = grossSalary - employeePF - stdDeduction;
    if (regime === 'old') taxableIncome = grossSalary - employeePF - stdDeduction - Math.min(annualHRA * 0.5, 150000);
    taxableIncome = Math.max(0, taxableIncome);
    const incomeTax = calcNewRegimeTax(taxableIncome);

    const annualProfTax = profTax * 12;
    const totalDeductions = employeePF + annualProfTax + incomeTax;
    const annualInHand = grossSalary - totalDeductions;
    const monthlyInHand = annualInHand / 12;

    return {
      monthlyBasic, monthlyHRA, annualBasic, annualHRA,
      specialAllowance, employerPF, employeePF, gratuity,
      grossSalary, incomeTax, annualProfTax, totalDeductions,
      annualInHand, monthlyInHand,
    };
  }, [ctc, basicPct, hraPct, pfCapped, profTax, regime]);

  const inHandPct = ctc > 0 ? (breakdown.annualInHand / ctc) * 100 : 0;
  const sliderClass = 'w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-800';
  const inputClass = 'mt-2 w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

  const rows = [
    { label: 'Basic Salary', monthly: breakdown.monthlyBasic, annual: breakdown.annualBasic, type: 'earning' as const },
    { label: 'HRA', monthly: breakdown.monthlyHRA, annual: breakdown.annualHRA, type: 'earning' as const },
    { label: 'Special Allowance', monthly: breakdown.specialAllowance / 12, annual: breakdown.specialAllowance, type: 'earning' as const },
    { label: 'Employer PF', monthly: breakdown.employerPF / 12, annual: breakdown.employerPF, type: 'employer' as const },
    { label: 'Gratuity', monthly: breakdown.gratuity / 12, annual: breakdown.gratuity, type: 'employer' as const },
    { label: 'Employee PF', monthly: breakdown.employeePF / 12, annual: breakdown.employeePF, type: 'deduction' as const },
    { label: 'Professional Tax', monthly: profTax, annual: breakdown.annualProfTax, type: 'deduction' as const },
    { label: 'Income Tax (est.)', monthly: breakdown.incomeTax / 12, annual: breakdown.incomeTax, type: 'deduction' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Annual CTC</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fmt(ctc)}</span></div>
          <input type="range" min={100000} max={10000000} step={50000} value={ctc} onChange={e => setCTC(+e.target.value)} className={sliderClass} />
          <input type="number" value={ctc} min={100000} max={100000000} step={50000} onChange={e => setCTC(Math.max(100000, +e.target.value || 100000))} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>Basic Salary (% of CTC)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{basicPct}%</span></div>
          <input type="range" min={30} max={50} step={1} value={basicPct} onChange={e => setBasicPct(+e.target.value)} className={sliderClass} />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className={labelClass}>HRA (% of Basic)</label><span className="text-sm font-bold text-primary-700 dark:text-primary-400">{hraPct}%</span></div>
          <input type="range" min={40} max={50} step={5} value={hraPct} onChange={e => setHraPct(+e.target.value)} className={sliderClass} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <label className={labelClass}>City Type</label>
          <div className="mt-1 flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {[{ v: true, l: 'Metro' }, { v: false, l: 'Non-Metro' }].map(c => (
              <button key={String(c.v)} onClick={() => { setIsMetro(c.v); setHraPct(c.v ? 50 : 40); }}
                className={`px-4 py-2 text-sm font-medium ${isMetro === c.v ? 'bg-primary-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{c.l}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>PF Contribution</label>
          <div className="mt-1 flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {[{ v: false, l: '12% of Basic' }, { v: true, l: 'Capped ₹1,800/mo' }].map(c => (
              <button key={String(c.v)} onClick={() => setPfCapped(c.v)}
                className={`px-4 py-2 text-sm font-medium ${pfCapped === c.v ? 'bg-primary-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{c.l}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Tax Regime</label>
          <div className="mt-1 flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {(['new', 'old'] as const).map(r => (
              <button key={r} onClick={() => setRegime(r)}
                className={`px-4 py-2 text-sm font-medium ${regime === r ? 'bg-primary-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{r === 'new' ? 'New Regime' : 'Old Regime'}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="text-sm text-green-200 mb-1">Monthly In-Hand Salary</div>
          <div className="text-4xl font-heading font-bold">{fmt(breakdown.monthlyInHand)}</div>
          <div className="text-sm text-green-300 mt-1">{fmt(breakdown.annualInHand)}/year ({inHandPct.toFixed(0)}% of CTC)</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-green-200">CTC</div><div className="font-bold">{fmt(ctc)}</div></div>
          <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-green-200">Gross Salary</div><div className="font-bold">{fmt(breakdown.grossSalary)}</div></div>
          <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-green-200">Deductions</div><div className="font-bold">{fmt(breakdown.totalDeductions)}</div></div>
          <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-green-200">Tax (est.)</div><div className="font-bold">{fmt(breakdown.incomeTax)}</div></div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Complete Salary Breakdown</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-900">
              <th className="px-5 py-2 text-left text-slate-600 dark:text-slate-400">Component</th>
              <th className="px-5 py-2 text-right text-slate-600 dark:text-slate-400">Monthly</th>
              <th className="px-5 py-2 text-right text-slate-600 dark:text-slate-400">Annual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map(r => (
              <tr key={r.label} className={r.type === 'deduction' ? 'bg-red-50/50 dark:bg-red-900/10' : r.type === 'employer' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}>
                <td className="px-5 py-2 text-slate-700 dark:text-slate-300">
                  {r.type === 'deduction' && <span className="text-red-500 mr-1">−</span>}
                  {r.type === 'employer' && <span className="text-blue-500 mr-1 text-xs">(employer)</span>}
                  {r.label}
                </td>
                <td className={`px-5 py-2 text-right font-medium ${r.type === 'deduction' ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}`}>{fmt(r.monthly)}</td>
                <td className={`px-5 py-2 text-right font-medium ${r.type === 'deduction' ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}`}>{fmt(r.annual)}</td>
              </tr>
            ))}
            <tr className="bg-emerald-50 dark:bg-emerald-900/20 font-bold">
              <td className="px-5 py-3 text-emerald-700 dark:text-emerald-400">In-Hand Salary</td>
              <td className="px-5 py-3 text-right text-emerald-700 dark:text-emerald-400">{fmt(breakdown.monthlyInHand)}</td>
              <td className="px-5 py-3 text-right text-emerald-700 dark:text-emerald-400">{fmt(breakdown.annualInHand)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Visual */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">CTC Breakdown</h3>
        <div className="h-6 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 transition-all" style={{ width: `${inHandPct}%` }} title="In-Hand" />
          <div className="bg-amber-500 transition-all" style={{ width: `${(breakdown.totalDeductions / ctc) * 100}%` }} title="Deductions" />
          <div className="bg-blue-500 flex-1" title="Employer costs" />
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1.5">
          <span>In-Hand {inHandPct.toFixed(0)}%</span>
          <span>Deductions {((breakdown.totalDeductions / ctc) * 100).toFixed(0)}%</span>
          <span>Employer Costs {(((breakdown.employerPF + breakdown.gratuity) / ctc) * 100).toFixed(0)}%</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">* This calculator provides approximate estimates. Actual in-hand salary depends on company salary structure, applicable tax regime, investments under Section 80C/80D, and other deductions. Consult your HR or a CA for exact figures.</p>
    </div>
  );
}
