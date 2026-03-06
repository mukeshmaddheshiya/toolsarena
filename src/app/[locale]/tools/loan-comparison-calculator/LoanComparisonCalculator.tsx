'use client';
import { useState, useMemo } from 'react';
import { Plus, Trash2, TrendingDown, IndianRupee, Award, BarChart3 } from 'lucide-react';

interface LoanInput {
  id: number;
  name: string;
  amount: number;
  rate: number;
  tenure: number; // years
}

interface LoanResult extends LoanInput {
  emi: number;
  totalInterest: number;
  totalPayable: number;
}

function calculateEMI(principal: number, annualRate: number, years: number): { emi: number; totalInterest: number; totalPayable: number } {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return { emi: 0, totalInterest: 0, totalPayable: 0 };
  const r = annualRate / 12 / 100;
  const n = years * 12;
  const emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const totalPayable = emi * n;
  return { emi, totalInterest: totalPayable - principal, totalPayable };
}

function formatINR(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

let nextId = 3;

export function LoanComparisonCalculator() {
  const [loans, setLoans] = useState<LoanInput[]>([
    { id: 1, name: 'Bank A', amount: 3000000, rate: 8.5, tenure: 20 },
    { id: 2, name: 'Bank B', amount: 3000000, rate: 9.0, tenure: 20 },
  ]);

  const results: LoanResult[] = useMemo(() => {
    return loans.map(loan => {
      const calc = calculateEMI(loan.amount, loan.rate, loan.tenure);
      return { ...loan, ...calc };
    });
  }, [loans]);

  const bestIdx = useMemo(() => {
    if (results.length === 0) return -1;
    let best = 0;
    for (let i = 1; i < results.length; i++) {
      if (results[i].totalPayable < results[best].totalPayable) best = i;
    }
    return best;
  }, [results]);

  const worstTotal = useMemo(() => Math.max(...results.map(r => r.totalPayable), 0), [results]);

  function updateLoan(id: number, field: keyof LoanInput, value: string | number) {
    setLoans(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  }

  function addLoan() {
    if (loans.length >= 4) return;
    const names = ['Bank C', 'Bank D'];
    setLoans(prev => [...prev, { id: nextId++, name: names[prev.length - 2] || `Option ${prev.length + 1}`, amount: 3000000, rate: 9.5, tenure: 20 }]);
  }

  function removeLoan(id: number) {
    if (loans.length <= 1) return;
    setLoans(prev => prev.filter(l => l.id !== id));
  }

  const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500'];
  const LIGHT_COLORS = ['bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800', 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800', 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800', 'bg-teal-50 dark:bg-teal-900/10 border-teal-200 dark:border-teal-800'];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Loan Comparison Calculator</h2>
            <p className="text-blue-100 text-xs">Compare up to 4 loan offers side-by-side</p>
          </div>
        </div>
      </div>

      {/* Loan Input Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {loans.map((loan, idx) => (
          <div key={loan.id} className={`p-4 rounded-xl border ${LIGHT_COLORS[idx]} space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${COLORS[idx]}`} />
                <input
                  type="text" value={loan.name}
                  onChange={e => updateLoan(loan.id, 'name', e.target.value)}
                  className="text-sm font-bold bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 w-24"
                />
              </div>
              {loans.length > 1 && (
                <button onClick={() => removeLoan(loan.id)} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-400 font-medium">Loan Amount (₹)</label>
                <input type="number" value={loan.amount} min={0}
                  onChange={e => updateLoan(loan.id, 'amount', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-medium">Interest Rate (%)</label>
                  <input type="number" value={loan.rate} min={0} step={0.1}
                    onChange={e => updateLoan(loan.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-medium">Tenure (Years)</label>
                  <input type="number" value={loan.tenure} min={1} max={40}
                    onChange={e => updateLoan(loan.id, 'tenure', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loans.length < 4 && (
        <button onClick={addLoan} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Another Loan
        </button>
      )}

      {/* Comparison Results */}
      {results.length > 0 && results[0].emi > 0 && (
        <div className="space-y-4">
          {/* EMI Comparison */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-green-500" /> Monthly EMI Comparison
            </h3>
            <div className="space-y-3">
              {results.map((r, idx) => (
                <div key={r.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${COLORS[idx]}`} /> {r.name}
                    </span>
                    <span className="font-black text-slate-900 dark:text-slate-100">{formatINR(r.emi)}/mo</span>
                  </div>
                  <div className="w-full h-5 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${COLORS[idx]} rounded-lg transition-all duration-700 flex items-center justify-end pr-2`}
                      style={{ width: `${worstTotal > 0 ? (r.totalPayable / worstTotal) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900">
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase">Metric</th>
                  {results.map((r, idx) => (
                    <th key={r.id} className="px-4 py-3 text-right text-[10px] font-bold text-slate-400 uppercase">
                      <span className="flex items-center justify-end gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${COLORS[idx]}`} /> {r.name}
                        {idx === bestIdx && <Award className="w-3 h-3 text-green-500" />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { label: 'Loan Amount', key: 'amount' as const },
                  { label: 'Interest Rate', key: 'rate' as const },
                  { label: 'Tenure', key: 'tenure' as const },
                  { label: 'Monthly EMI', key: 'emi' as const },
                  { label: 'Total Interest', key: 'totalInterest' as const },
                  { label: 'Total Payable', key: 'totalPayable' as const },
                ].map(row => (
                  <tr key={row.label} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">{row.label}</td>
                    {results.map((r, idx) => (
                      <td key={r.id} className={`px-4 py-2.5 text-right text-xs font-bold ${idx === bestIdx && (row.key === 'totalPayable' || row.key === 'totalInterest' || row.key === 'emi') ? 'text-green-600' : 'text-slate-800 dark:text-slate-200'}`}>
                        {row.key === 'rate' ? `${r.rate}%` : row.key === 'tenure' ? `${r.tenure} yrs` : formatINR(r[row.key])}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Savings row */}
                <tr className="bg-green-50 dark:bg-green-900/10">
                  <td className="px-4 py-2.5 text-xs font-bold text-green-700 dark:text-green-400">
                    <TrendingDown className="w-3.5 h-3.5 inline mr-1" /> You Save
                  </td>
                  {results.map((r, idx) => {
                    const saving = worstTotal - r.totalPayable;
                    return (
                      <td key={r.id} className={`px-4 py-2.5 text-right text-xs font-black ${saving > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                        {saving > 0 ? formatINR(saving) : '—'}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Best Deal */}
          {bestIdx >= 0 && results.length > 1 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
              <Award className="w-8 h-8 text-green-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-800 dark:text-green-300">
                  {results[bestIdx].name} is the best deal!
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                  You save {formatINR(worstTotal - results[bestIdx].totalPayable)} compared to the most expensive option
                  ({formatINR(results[bestIdx].emi)}/mo EMI vs {formatINR(Math.max(...results.map(r => r.emi)))}/mo)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
