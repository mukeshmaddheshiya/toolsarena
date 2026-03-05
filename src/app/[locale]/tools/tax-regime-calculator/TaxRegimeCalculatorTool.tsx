'use client';
import { useState, useMemo } from 'react';
import { Shield, ChevronDown, ChevronUp, IndianRupee, Scale, TrendingUp } from 'lucide-react';

/* ─── FY 2025-26 Tax Slabs ─── */
const NEW_SLABS = [
  { upto: 400000, rate: 0 },
  { upto: 800000, rate: 0.05 },
  { upto: 1200000, rate: 0.10 },
  { upto: 1600000, rate: 0.15 },
  { upto: 2000000, rate: 0.20 },
  { upto: 2400000, rate: 0.25 },
  { upto: Infinity, rate: 0.30 },
];

const OLD_SLABS = [
  { upto: 250000, rate: 0 },
  { upto: 500000, rate: 0.05 },
  { upto: 1000000, rate: 0.20 },
  { upto: Infinity, rate: 0.30 },
];

function calcTax(taxable: number, slabs: { upto: number; rate: number }[]): number {
  let tax = 0, prev = 0;
  for (const s of slabs) {
    if (taxable <= prev) break;
    tax += (Math.min(taxable, s.upto) - prev) * s.rate;
    prev = s.upto;
  }
  return tax;
}

function addCess(tax: number, taxable: number): number {
  let sr = 0;
  if (taxable > 50000000) sr = 0.37;
  else if (taxable > 20000000) sr = 0.25;
  else if (taxable > 10000000) sr = 0.15;
  else if (taxable > 5000000) sr = 0.10;
  return (tax + tax * sr) * 1.04;
}

function fmt(n: number) { return '\u20B9' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 }); }

interface Inputs {
  grossIncome: string;
  hra: string;
  lta: string;
  sec80C: string;
  sec80D: string;
  sec80CCD: string;
  sec80E: string;
  homeLoan: string;
  otherOldDed: string;
  rentPaid: string;
  basic: string;
  metro: boolean;
}

const DEFAULTS: Inputs = {
  grossIncome: '1200000',
  hra: '200000',
  lta: '0',
  sec80C: '150000',
  sec80D: '25000',
  sec80CCD: '50000',
  sec80E: '0',
  homeLoan: '0',
  otherOldDed: '0',
  rentPaid: '15000',
  basic: '480000',
  metro: true,
};

export function TaxRegimeCalculatorTool() {
  const [inp, setInp] = useState<Inputs>(DEFAULTS);
  const [showDed, setShowDed] = useState(true);
  const set = (k: keyof Inputs, v: string | boolean) => setInp(p => ({ ...p, [k]: v }));
  const n = (v: string) => parseFloat(v) || 0;

  const calc = useMemo(() => {
    const gross = n(inp.grossIncome);
    if (gross <= 0) return null;

    // ─── New Regime ───
    const newStdDed = 75000;
    const newTaxable = Math.max(0, gross - newStdDed);
    let newTax = calcTax(newTaxable, NEW_SLABS);
    if (newTaxable <= 1200000) newTax = Math.max(0, newTax - 60000);
    const newTaxFinal = Math.round(addCess(newTax, newTaxable));

    // ─── Old Regime ───
    const oldStdDed = 50000;
    // HRA exemption
    const hraReceived = n(inp.hra);
    const basic = n(inp.basic);
    const rent = n(inp.rentPaid) * 12;
    const hraExempt = hraReceived > 0 && rent > 0
      ? Math.min(hraReceived, rent - 0.1 * basic, (inp.metro ? 0.5 : 0.4) * basic)
      : 0;
    const hraExemptFinal = Math.max(0, hraExempt);

    const total80C = Math.min(150000, n(inp.sec80C));
    const total80D = Math.min(100000, n(inp.sec80D));
    const total80CCD = Math.min(50000, n(inp.sec80CCD));
    const total80E = n(inp.sec80E);
    const totalHomeLoan = Math.min(200000, n(inp.homeLoan));
    const totalOther = n(inp.otherOldDed);

    const totalOldDed = oldStdDed + hraExemptFinal + total80C + total80D + total80CCD + total80E + totalHomeLoan + totalOther + n(inp.lta);
    const oldTaxable = Math.max(0, gross - totalOldDed);
    let oldTax = calcTax(oldTaxable, OLD_SLABS);
    if (oldTaxable <= 500000) oldTax = Math.max(0, oldTax - 12500);
    const oldTaxFinal = Math.round(addCess(oldTax, oldTaxable));

    const saving = oldTaxFinal - newTaxFinal;
    const better: 'new' | 'old' = newTaxFinal <= oldTaxFinal ? 'new' : 'old';

    return {
      gross,
      newStdDed, newTaxable, newTaxFinal,
      oldStdDed, hraExemptFinal, totalOldDed, oldTaxable, oldTaxFinal,
      total80C, total80D, total80CCD, total80E, totalHomeLoan, totalOther,
      saving, better,
      newInHand: gross - newTaxFinal,
      oldInHand: gross - oldTaxFinal,
    };
  }, [inp]);

  function field(label: string, key: keyof Inputs, opts?: { prefix?: string; suffix?: string; info?: string }) {
    return (
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
        <div className="relative">
          {opts?.prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">{opts.prefix}</span>}
          <input
            type="text" inputMode="numeric"
            value={inp[key] as string}
            onChange={e => set(key, e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="0"
            className={`w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none ${opts?.prefix ? 'pl-7' : ''} ${opts?.suffix ? 'pr-10' : ''}`}
          />
          {opts?.suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none">{opts.suffix}</span>}
        </div>
      </div>
    );
  }

  function slabTable(slabs: { upto: number; rate: number }[], taxable: number, color: string) {
    let prev = 0;
    return (
      <div className="space-y-1">
        {slabs.map((s, i) => {
          const from = prev;
          const chunk = Math.min(Math.max(0, taxable - from), s.upto - from);
          const tax = chunk * s.rate;
          prev = s.upto;
          return (
            <div key={i} className="flex items-center gap-2 text-[11px]">
              <span className="w-24 text-slate-500">{(from / 100000).toFixed(1)}L - {s.upto === Infinity ? '+' : `${(s.upto / 100000).toFixed(0)}L`}</span>
              <span className="w-10 text-right font-medium">{(s.rate * 100)}%</span>
              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${taxable > 0 ? Math.min(100, (chunk / taxable) * 100) : 0}%`, backgroundColor: color }} />
              </div>
              <span className="w-20 text-right text-slate-700 dark:text-slate-300 font-medium">{fmt(Math.round(tax))}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Old vs New Tax Regime Calculator</h2>
            <p className="text-blue-200 text-xs">FY 2025-26 (AY 2026-27) | Budget 2025 Updated</p>
          </div>
        </div>
        {calc && (
          <div className="mt-4 flex flex-wrap gap-4">
            <div>
              <div className="text-blue-200 text-[10px] uppercase tracking-wider">You Save</div>
              <div className="text-2xl font-bold">{fmt(Math.abs(calc.saving))}/year</div>
            </div>
            <div className="border-l border-white/30 pl-4">
              <div className="text-blue-200 text-[10px] uppercase tracking-wider">Better Regime</div>
              <div className="text-2xl font-bold flex items-center gap-1">
                <Shield className="w-5 h-5" />
                {calc.better === 'new' ? 'New Regime' : 'Old Regime'}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-blue-600" /> Income Details
            </div>
            {field('Annual Gross Income', 'grossIncome', { prefix: '\u20B9' })}
            <div className="grid grid-cols-2 gap-3">
              {field('Basic Salary (Annual)', 'basic', { prefix: '\u20B9' })}
              {field('HRA Received (Annual)', 'hra', { prefix: '\u20B9' })}
            </div>
            {field('LTA (Annual)', 'lta', { prefix: '\u20B9' })}

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={inp.metro} onChange={e => set('metro', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Metro city (Delhi, Mumbai, Chennai, Kolkata)</span>
            </label>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Monthly Rent Paid</label>
              <input type="text" inputMode="numeric" value={inp.rentPaid}
                onChange={e => set('rentPaid', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm pl-7 focus:ring-2 focus:ring-primary-500 outline-none" />
              <span className="absolute" style={{ display: 'none' }}>{'\u20B9'}</span>
            </div>
          </div>

          {/* Deductions section */}
          <button onClick={() => setShowDed(!showDed)}
            className="flex items-center gap-2 w-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">
            <Shield className="w-4 h-4" />
            Old Regime Deductions
            {showDed ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
          </button>
          {showDed && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 space-y-3">
              <p className="text-[10px] text-amber-700 dark:text-amber-400">These apply only under the Old Tax Regime.</p>
              <div className="grid grid-cols-2 gap-3">
                {field('Sec 80C (PPF, ELSS, LIC)', 'sec80C', { prefix: '\u20B9', suffix: 'Max 1.5L' })}
                {field('Sec 80D (Health Insurance)', 'sec80D', { prefix: '\u20B9', suffix: 'Max 1L' })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field('Sec 80CCD(1B) - NPS', 'sec80CCD', { prefix: '\u20B9', suffix: 'Max 50K' })}
                {field('Sec 80E (Education Loan)', 'sec80E', { prefix: '\u20B9' })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field('Home Loan Interest (24b)', 'homeLoan', { prefix: '\u20B9', suffix: 'Max 2L' })}
                {field('Other Deductions', 'otherOldDed', { prefix: '\u20B9' })}
              </div>
            </div>
          )}

          {/* Quick income presets */}
          <div>
            <div className="text-xs text-slate-500 mb-2">Quick Select Income</div>
            <div className="flex flex-wrap gap-1.5">
              {['500000', '700000', '1000000', '1200000', '1500000', '2000000', '2500000', '3000000', '5000000'].map(v => (
                <button key={v} onClick={() => set('grossIncome', v)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${inp.grossIncome === v ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100'}`}>
                  {parseInt(v) >= 100000 ? `${parseInt(v) / 100000}L` : `${parseInt(v) / 1000}K`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {calc ? (
            <>
              {/* Side-by-side comparison */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* New Regime */}
                <div className={`rounded-xl border-2 p-4 ${calc.better === 'new' ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80'}`}>
                  {calc.better === 'new' && <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2">Recommended</div>}
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">New Regime</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Gross Income</span><span>{fmt(calc.gross)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Standard Deduction</span><span className="text-green-600">- {fmt(calc.newStdDed)}</span></div>
                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1"><span className="text-slate-500">Taxable Income</span><span className="font-medium">{fmt(calc.newTaxable)}</span></div>
                    <div className="flex justify-between text-red-500 font-medium"><span>Tax Payable</span><span>{fmt(calc.newTaxFinal)}</span></div>
                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1 text-sm">
                      <span className="font-bold text-slate-900 dark:text-slate-100">In-Hand</span>
                      <span className="font-bold text-emerald-600">{fmt(calc.newInHand)}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Monthly: {fmt(Math.round(calc.newInHand / 12))}</div>
                  </div>
                </div>

                {/* Old Regime */}
                <div className={`rounded-xl border-2 p-4 ${calc.better === 'old' ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80'}`}>
                  {calc.better === 'old' && <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2">Recommended</div>}
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Old Regime</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Gross Income</span><span>{fmt(calc.gross)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Total Deductions</span><span className="text-green-600">- {fmt(calc.totalOldDed)}</span></div>
                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1"><span className="text-slate-500">Taxable Income</span><span className="font-medium">{fmt(calc.oldTaxable)}</span></div>
                    <div className="flex justify-between text-red-500 font-medium"><span>Tax Payable</span><span>{fmt(calc.oldTaxFinal)}</span></div>
                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1 text-sm">
                      <span className="font-bold text-slate-900 dark:text-slate-100">In-Hand</span>
                      <span className="font-bold text-emerald-600">{fmt(calc.oldInHand)}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Monthly: {fmt(Math.round(calc.oldInHand / 12))}</div>
                  </div>
                </div>
              </div>

              {/* Savings Badge */}
              <div className={`rounded-xl p-3 text-center text-sm font-medium ${calc.better === 'new'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                }`}>
                <Shield className="w-4 h-4 inline mr-1 -mt-0.5" />
                {calc.better === 'new' ? 'New Tax Regime' : 'Old Tax Regime'} saves you{' '}
                <strong>{fmt(Math.abs(calc.saving))}</strong>/year ({fmt(Math.round(Math.abs(calc.saving) / 12))}/month)
              </div>

              {/* Slab breakdowns */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800/40 p-4">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-3">New Regime Slabs</div>
                  {slabTable(NEW_SLABS, calc.newTaxable, '#10b981')}
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/40 p-4">
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-3">Old Regime Slabs</div>
                  {slabTable(OLD_SLABS, calc.oldTaxable, '#f59e0b')}
                </div>
              </div>

              {/* Deductions breakdown for Old Regime */}
              <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Old Regime Deductions Summary</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50 text-xs">
                  <div className="flex justify-between py-1.5"><span className="text-slate-500">Standard Deduction</span><span className="text-green-600 font-medium">{fmt(calc.oldStdDed)}</span></div>
                  {calc.hraExemptFinal > 0 && <div className="flex justify-between py-1.5"><span className="text-slate-500">HRA Exemption</span><span className="text-green-600 font-medium">{fmt(calc.hraExemptFinal)}</span></div>}
                  {calc.total80C > 0 && <div className="flex justify-between py-1.5"><span className="text-slate-500">Section 80C</span><span className="text-green-600 font-medium">{fmt(calc.total80C)}</span></div>}
                  {calc.total80D > 0 && <div className="flex justify-between py-1.5"><span className="text-slate-500">Section 80D</span><span className="text-green-600 font-medium">{fmt(calc.total80D)}</span></div>}
                  {calc.total80CCD > 0 && <div className="flex justify-between py-1.5"><span className="text-slate-500">Section 80CCD(1B)</span><span className="text-green-600 font-medium">{fmt(calc.total80CCD)}</span></div>}
                  {calc.total80E > 0 && <div className="flex justify-between py-1.5"><span className="text-slate-500">Section 80E</span><span className="text-green-600 font-medium">{fmt(calc.total80E)}</span></div>}
                  {calc.totalHomeLoan > 0 && <div className="flex justify-between py-1.5"><span className="text-slate-500">Home Loan Interest</span><span className="text-green-600 font-medium">{fmt(calc.totalHomeLoan)}</span></div>}
                  <div className="flex justify-between py-1.5 font-medium"><span className="text-slate-700 dark:text-slate-300">Total Deductions</span><span className="text-green-600">{fmt(calc.totalOldDed)}</span></div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 text-center text-sm text-slate-500">
              Enter your income to compare tax regimes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
