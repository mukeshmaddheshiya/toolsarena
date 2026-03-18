'use client';
import { useState, useMemo } from 'react';
import { Home, IndianRupee, MapPin, TrendingDown, Shield, Calculator } from 'lucide-react';

export function HRACalculatorTool() {
  const [basicSalary, setBasicSalary] = useState('50000');
  const [da, setDA] = useState('0');
  const [hraReceived, setHraReceived] = useState('20000');
  const [rentPaid, setRentPaid] = useState('15000');
  const [isMetro, setIsMetro] = useState(true);
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');

  const basic = parseFloat(basicSalary) || 0;
  const daAmt = parseFloat(da) || 0;
  const hra = parseFloat(hraReceived) || 0;
  const rent = parseFloat(rentPaid) || 0;

  const result = useMemo(() => {
    const totalBasic = basic + daAmt;
    const metroRate = isMetro ? 0.5 : 0.4;

    // Three conditions for HRA exemption (monthly)
    const condition1 = hra; // Actual HRA received
    const condition2 = rent - 0.1 * totalBasic; // Rent paid - 10% of salary
    const condition3 = metroRate * totalBasic; // 50%/40% of salary

    const exemption = Math.max(0, Math.min(condition1, condition2, condition3));
    const taxable = Math.max(0, hra - exemption);

    return {
      condition1, condition2: Math.max(0, condition2), condition3,
      exemption, taxable, totalBasic,
      lowestCondition: exemption === condition1 ? 1 : exemption === Math.max(0, condition2) ? 2 : 3,
      annualExemption: exemption * 12,
      annualTaxable: taxable * 12,
    };
  }, [basic, daAmt, hra, rent, isMetro]);

  const fmt = (v: number) => {
    const val = viewMode === 'annual' ? v * 12 : v;
    return `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  const conditions = [
    { num: 1, label: 'Actual HRA Received', formula: 'HRA received from employer', value: result.condition1 },
    { num: 2, label: 'Rent - 10% of Salary', formula: `₹${rent.toLocaleString('en-IN')} - 10% of ₹${result.totalBasic.toLocaleString('en-IN')}`, value: result.condition2 },
    { num: 3, label: `${isMetro ? '50' : '40'}% of Basic + DA`, formula: `${isMetro ? '50' : '40'}% of ₹${result.totalBasic.toLocaleString('en-IN')}`, value: result.condition3 },
  ];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">HRA Exemption Calculator</h2>
            <p className="text-violet-200 text-xs">Calculate HRA tax exemption under Section 10(13A) | FY 2025-26</p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 justify-end">
        {(['monthly', 'annual'] as const).map(m => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === m
              ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            {m === 'monthly' ? 'Monthly' : 'Annual'}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Input */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-violet-600" /> Salary Details (Monthly)
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Basic Salary (₹/month)</label>
              <input type="number" value={basicSalary} onChange={e => setBasicSalary(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
              <input type="range" min="10000" max="300000" step="5000" value={basic}
                onChange={e => setBasicSalary(e.target.value)} className="w-full mt-1 accent-violet-600" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Dearness Allowance (₹/month)</label>
              <input type="number" value={da} onChange={e => setDA(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">HRA Received (₹/month)</label>
              <input type="number" value={hraReceived} onChange={e => setHraReceived(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
              <input type="range" min="0" max="150000" step="1000" value={hra}
                onChange={e => setHraReceived(e.target.value)} className="w-full mt-1 accent-violet-600" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Rent Paid (₹/month)</label>
              <input type="number" value={rentPaid} onChange={e => setRentPaid(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
              <input type="range" min="0" max="200000" step="1000" value={rent}
                onChange={e => setRentPaid(e.target.value)} className="w-full mt-1 accent-violet-600" />
            </div>
          </div>

          {/* Metro Toggle */}
          <div>
            <label className="text-xs text-slate-500 mb-2 block flex items-center gap-1">
              <MapPin className="w-3 h-3" /> City Type
            </label>
            <div className="flex gap-2">
              <button onClick={() => setIsMetro(true)}
                className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${isMetro
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                Metro City (50%)
                <div className="text-[9px] mt-0.5 opacity-75">Delhi, Mumbai, Kolkata, Chennai</div>
              </button>
              <button onClick={() => setIsMetro(false)}
                className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${!isMetro
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                Non-Metro (40%)
                <div className="text-[9px] mt-0.5 opacity-75">Bangalore, Pune, Hyderabad, etc.</div>
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 self-center">Quick:</span>
            {[
              { l: '₹30K Basic', b: 30000, h: 12000, r: 10000 },
              { l: '₹50K Basic', b: 50000, h: 20000, r: 15000 },
              { l: '₹75K Basic', b: 75000, h: 30000, r: 25000 },
              { l: '₹1L Basic', b: 100000, h: 40000, r: 35000 },
            ].map(p => (
              <button key={p.l} onClick={() => { setBasicSalary(String(p.b)); setHraReceived(String(p.h)); setRentPaid(String(p.r)); }}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-violet-50 hover:text-violet-700 transition-colors">
                {p.l}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {/* Main Result */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-5">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">HRA Exempt</div>
                <div className="text-2xl font-bold text-green-600">{fmt(result.exemption)}</div>
                <div className="text-[10px] text-slate-400">Tax-free / {viewMode}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">HRA Taxable</div>
                <div className="text-2xl font-bold text-red-500">{fmt(result.taxable)}</div>
                <div className="text-[10px] text-slate-400">Added to income / {viewMode}</div>
              </div>
            </div>
          </div>

          {/* Three Conditions */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Three Conditions (Lowest = Exemption)
            </h4>
            {conditions.map(c => {
              const isLowest = c.num === result.lowestCondition;
              return (
                <div key={c.num}
                  className={`rounded-xl p-3 border ${isLowest
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className={`text-xs font-medium ${isLowest ? 'text-green-700 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {isLowest && '✓ '}{c.label}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{c.formula}</p>
                    </div>
                    <span className={`text-sm font-bold ${isLowest ? 'text-green-600' : 'text-slate-700 dark:text-slate-300'}`}>
                      {fmt(c.value)}
                    </span>
                  </div>
                  {/* Bar */}
                  <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div className={`h-full rounded-full ${isLowest ? 'bg-green-500' : 'bg-violet-300 dark:bg-violet-600'}`}
                      style={{ width: `${Math.min(100, (c.value / Math.max(result.condition1, result.condition2, result.condition3, 1)) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Annual Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2">Annual Tax Saving</h4>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div>
                <div className="text-blue-600">Annual Exemption</div>
                <div className="font-bold text-slate-700 dark:text-slate-300">₹{result.annualExemption.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
              <div>
                <div className="text-blue-600">Tax Saved (30% slab)</div>
                <div className="font-bold text-green-600">₹{Math.round(result.annualExemption * 0.312).toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div className="text-blue-600">Tax Saved (20% slab)</div>
                <div className="font-bold text-green-600">₹{Math.round(result.annualExemption * 0.208).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Tip */}
      {result.exemption > 0 && result.lowestCondition === 2 && rent < basic * 0.5 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-xs text-green-700 dark:text-green-400">
          <strong>Tip:</strong> Your exemption is limited by rent paid. If you increase your rent to ₹{Math.round(basic * (isMetro ? 0.5 : 0.4) + basic * 0.1).toLocaleString('en-IN')}/month, you could maximize your HRA exemption to ₹{fmt(Math.min(hra, isMetro ? basic * 0.5 : basic * 0.4))}/month.
        </div>
      )}

      {/* Link to Rent Receipt Generator */}
      {result.exemption > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center justify-between">
          <div className="text-xs text-emerald-700 dark:text-emerald-400">
            <strong>Need rent receipts for HRA claim?</strong> Generate monthly rent receipts with PDF download.
          </div>
          <a href="/en/tools/rent-receipt-generator" className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors flex-shrink-0">
            Generate Receipts
          </a>
        </div>
      )}

      {/* Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">HRA Exemption Rules</h4>
        <div className="grid md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-2">
            <p><strong>Section 10(13A):</strong> Salaried employees receiving HRA can claim exemption equal to the minimum of: (1) Actual HRA received, (2) Rent paid minus 10% of basic+DA, (3) 50% of basic+DA for metro / 40% for non-metro.</p>
            <p><strong>Metro Cities:</strong> Only Delhi, Mumbai, Kolkata, and Chennai qualify as metro cities for HRA calculation. All others are non-metro.</p>
          </div>
          <div className="space-y-2">
            <p><strong>Documents Needed:</strong> Rent receipts, rent agreement, landlord PAN (if rent &gt; ₹1 lakh/year). Submit to employer for TDS adjustment.</p>
            <p><strong>New Tax Regime:</strong> HRA exemption is NOT available under the new tax regime (Section 115BAC). Only old regime allows HRA claim.</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-400">
        <strong>Disclaimer:</strong> HRA exemption calculations are estimates based on current tax rules. Tax laws change with each budget. Consult a qualified CA or tax professional for personalized advice before filing your returns.
      </div>
    </div>
  );
}
