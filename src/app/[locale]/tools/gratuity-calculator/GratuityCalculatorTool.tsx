'use client';
import { useState, useMemo } from 'react';
import { Briefcase, IndianRupee, Calendar, TrendingUp, Info, Award, ArrowUpRight } from 'lucide-react';

type EmployeeType = 'covered' | 'not-covered';

function calculateGratuity(basic: number, da: number, years: number, months: number, type: EmployeeType): number {
  const totalYears = years + months / 12;
  const eligibleYears = months % 12 >= 6 ? Math.ceil(totalYears) : Math.floor(totalYears);
  const lastSalary = basic + da;
  if (type === 'covered') return (15 * lastSalary * eligibleYears) / 26;
  return (15 * lastSalary * eligibleYears) / 30;
}

function calculateGratuityByYear(basic: number, da: number, type: EmployeeType): { year: number; amount: number }[] {
  const data: { year: number; amount: number }[] = [];
  for (let y = 5; y <= 35; y += 5) {
    data.push({ year: y, amount: calculateGratuity(basic, da, y, 0, type) });
  }
  return data;
}

export function GratuityCalculatorTool() {
  const [basicSalary, setBasicSalary] = useState('50000');
  const [da, setDA] = useState('0');
  const [years, setYears] = useState('10');
  const [months, setMonths] = useState('0');
  const [type, setType] = useState<EmployeeType>('covered');

  const basic = parseFloat(basicSalary) || 0;
  const daAmt = parseFloat(da) || 0;
  const yrs = parseInt(years) || 0;
  const mos = parseInt(months) || 0;
  const totalYears = yrs + mos / 12;
  const eligibleYears = mos % 12 >= 6 ? Math.ceil(totalYears) : Math.floor(totalYears);

  const gratuity = useMemo(() => calculateGratuity(basic, daAmt, yrs, mos, type), [basic, daAmt, yrs, mos, type]);

  const isEligible = totalYears >= 5;
  const maxExempt = 2000000; // 20 lakh tax exempt
  const taxableGratuity = Math.max(0, gratuity - maxExempt);
  const exemptAmount = Math.min(gratuity, maxExempt);

  // Quick presets
  const presets = [
    { label: '₹25K × 5Y', basic: 25000, years: 5 },
    { label: '₹40K × 10Y', basic: 40000, years: 10 },
    { label: '₹60K × 15Y', basic: 60000, years: 15 },
    { label: '₹80K × 20Y', basic: 80000, years: 20 },
    { label: '₹1L × 25Y', basic: 100000, years: 25 },
  ];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Gratuity Calculator India</h2>
            <p className="text-amber-100 text-xs">Calculate gratuity under Payment of Gratuity Act, 1972 | FY 2025-26</p>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 self-center">Quick:</span>
        {presets.map(p => (
          <button key={p.label} onClick={() => { setBasicSalary(String(p.basic)); setYears(String(p.years)); setMonths('0'); }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-50 hover:text-amber-700 transition-colors">
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Input */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-600" /> Employment Details
          </h3>

          {/* Employee Type */}
          <div className="flex gap-2">
            {([['covered', 'Covered under Act'], ['not-covered', 'Not Covered']] as const).map(([val, label]) => (
              <button key={val} onClick={() => setType(val)}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${type === val
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Last Basic Salary (₹/month)</label>
              <input type="number" value={basicSalary} onChange={e => setBasicSalary(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Dearness Allowance (₹/month)</label>
              <input type="number" value={da} onChange={e => setDA(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Years of Service</label>
              <input type="number" value={years} onChange={e => setYears(e.target.value)} min="0" max="50"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Additional Months</label>
              <input type="number" value={months} onChange={e => setMonths(e.target.value)} min="0" max="11"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
          </div>

          {/* Eligibility Warning */}
          {!isEligible && totalYears > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-xs text-red-700 dark:text-red-400">
              <strong>Not Eligible:</strong> Minimum 5 years of continuous service is required for gratuity under the Payment of Gratuity Act, 1972.
              You need {Math.ceil(5 - totalYears)} more year{Math.ceil(5 - totalYears) > 1 ? 's' : ''}.
            </div>
          )}

          {/* Formula */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Formula Used</h4>
            <div className="bg-white dark:bg-slate-700 rounded-lg p-3 text-center">
              <p className="text-sm font-mono text-amber-700 dark:text-amber-400">
                Gratuity = (15 × Last Salary × Years) / {type === 'covered' ? '26' : '30'}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Last Salary = Basic + DA = ₹{(basic + daAmt).toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-500">
                Eligible Years = {eligibleYears} | Divisor = {type === 'covered' ? '26 (working days/month)' : '30 (calendar days/month)'}
              </p>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="space-y-4">
          <div className={`rounded-xl p-5 text-center ${isEligible ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Your Gratuity Amount</div>
            <div className={`text-3xl font-bold ${isEligible ? 'text-amber-600' : 'text-slate-400'}`}>
              ₹{gratuity.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            {!isEligible && <p className="text-xs text-red-500 mt-1">Not eligible (min 5 years required)</p>}
          </div>

          {/* Breakdown */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-700">
            {[
              { label: 'Last Basic Salary', value: `₹${basic.toLocaleString('en-IN')}/month` },
              { label: 'Dearness Allowance', value: `₹${daAmt.toLocaleString('en-IN')}/month` },
              { label: 'Last Drawn Salary (Basic + DA)', value: `₹${(basic + daAmt).toLocaleString('en-IN')}/month`, bold: true },
              { label: 'Total Service Period', value: `${yrs} years ${mos} months` },
              { label: 'Eligible Years (for calculation)', value: `${eligibleYears} years` },
              { label: 'Employee Category', value: type === 'covered' ? 'Covered under Act' : 'Not Covered under Act' },
            ].map(row => (
              <div key={row.label} className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-500">{row.label}</span>
                <span className={`font-medium text-slate-700 dark:text-slate-300 ${'bold' in row ? 'text-amber-600' : ''}`}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Tax Implications */}
          {gratuity > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-300">Tax Implications</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-blue-600">Total Gratuity:</span>
                  <div className="font-bold text-slate-700 dark:text-slate-300">₹{gratuity.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                </div>
                <div>
                  <span className="text-blue-600">Tax-Free Limit:</span>
                  <div className="font-bold text-slate-700 dark:text-slate-300">₹20,00,000</div>
                </div>
                <div>
                  <span className="text-blue-600">Exempt Amount:</span>
                  <div className="font-bold text-green-600">₹{exemptAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                </div>
                <div>
                  <span className="text-blue-600">Taxable Amount:</span>
                  <div className="font-bold text-red-600">₹{taxableGratuity.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
            </div>
          )}

          {/* Visual Bar */}
          {gratuity > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Tax-Free: ₹{exemptAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                {taxableGratuity > 0 && <span>Taxable: ₹{taxableGratuity.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>}
              </div>
              <div className="h-4 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
                <div className="bg-green-500 h-full" style={{ width: `${Math.min(100, (exemptAmount / gratuity) * 100)}%` }} />
                {taxableGratuity > 0 && <div className="bg-red-400 h-full" style={{ width: `${(taxableGratuity / gratuity) * 100}%` }} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Growth Chart - Gratuity over years */}
      {basic > 0 && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Gratuity Growth by Service Years (at current salary)
          </h4>
          <div className="flex items-end gap-2 h-32">
            {calculateGratuityByYear(basic, daAmt, type).map(d => {
              const max = calculateGratuityByYear(basic, daAmt, type).slice(-1)[0]?.amount || 1;
              const heightPct = (d.amount / max) * 100;
              const isCurrent = d.year === eligibleYears || (eligibleYears > d.year - 5 && eligibleYears <= d.year && d.year === Math.ceil(eligibleYears / 5) * 5);
              return (
                <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[8px] text-slate-500">₹{(d.amount / 100000).toFixed(1)}L</span>
                  <div className={`w-full rounded-t transition-all ${isCurrent ? 'bg-amber-500' : 'bg-amber-300 dark:bg-amber-700'}`}
                    style={{ height: `${heightPct}%`, minHeight: '4px' }} />
                  <span className={`text-[9px] font-medium ${isCurrent ? 'text-amber-600' : 'text-slate-400'}`}>{d.year}Y</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Covered vs Not Covered Comparison */}
      {basic > 0 && eligibleYears >= 5 && (
        <div className="grid grid-cols-2 gap-3">
          {(['covered', 'not-covered'] as const).map(t => {
            const amt = calculateGratuity(basic, daAmt, yrs, mos, t);
            return (
              <div key={t} className={`rounded-xl p-4 text-center border ${t === type
                ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                <div className="text-[10px] text-slate-500 uppercase">{t === 'covered' ? 'Covered (÷26)' : 'Not Covered (÷30)'}</div>
                <div className={`text-lg font-bold ${t === type ? 'text-amber-600' : 'text-slate-600 dark:text-slate-400'}`}>
                  ₹{amt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[9px] text-slate-400 mt-1">{t === type ? '(Selected)' : ''}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gratuity Rules in India</h4>
        <div className="grid md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-2">
            <p><strong>Eligibility:</strong> Minimum 5 years of continuous service with the same employer. Exception: death or disability (no minimum period).</p>
            <p><strong>Covered Employees:</strong> Organizations with 10+ employees are covered under the Payment of Gratuity Act, 1972. Formula uses 26 working days/month.</p>
            <p><strong>Maximum Limit:</strong> The maximum gratuity payable is ₹20,00,000 (₹20 lakh) as per the latest amendment.</p>
          </div>
          <div className="space-y-2">
            <p><strong>Tax Exemption:</strong> Gratuity up to ₹20 lakh is tax-free for employees covered under the Act. For government employees, the entire amount is exempt.</p>
            <p><strong>When Payable:</strong> On superannuation, retirement, resignation, death, or disablement of the employee.</p>
            <p><strong>Rounding of Service:</strong> If an employee has worked for more than 6 months in the last year, it is rounded up to the next full year.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
