'use client';

import { useState, useMemo } from 'react';

const TIP_PRESETS = [10, 15, 18, 20, 25, 30];

export function TipCalculatorTool() {
  const [bill, setBill] = useState('50');
  const [tip, setTip] = useState(18);
  const [people, setPeople] = useState(2);
  const [customTip, setCustomTip] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const tipPct = isCustom ? Number(customTip) || 0 : tip;
  const billNum = parseFloat(bill) || 0;

  const calc = useMemo(() => {
    const tipAmt = billNum * (tipPct / 100);
    const total = billNum + tipAmt;
    const perPerson = total / Math.max(1, people);
    const tipPerPerson = tipAmt / Math.max(1, people);
    return { tipAmt, total, perPerson, tipPerPerson };
  }, [billNum, tipPct, people]);

  const fmt = (n: number) => n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-5">
        {/* Bill */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bill Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
            <input type="number" min="0" value={bill} onChange={e => setBill(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        {/* Tip % */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tip Percentage</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {TIP_PRESETS.map(p => (
              <button key={p} onClick={() => { setTip(p); setIsCustom(false); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!isCustom && tip === p ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'}`}>
                {p}%
              </button>
            ))}
            <button onClick={() => setIsCustom(true)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isCustom ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'}`}>
              Custom
            </button>
          </div>
          {isCustom && (
            <div className="relative">
              <input type="number" min="0" max="100" value={customTip} onChange={e => setCustomTip(e.target.value)} placeholder="Enter tip %"
                className="w-full pr-8 px-4 py-2.5 rounded-xl border border-green-300 dark:border-green-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
          )}
        </div>

        {/* People */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Split between {people} {people === 1 ? 'person' : 'people'}</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setPeople(p => Math.max(1, p - 1))}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors">−</button>
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 w-8 text-center">{people}</span>
            <button onClick={() => setPeople(p => Math.min(20, p + 1))}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors">+</button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Tip Amount', value: fmt(calc.tipAmt), sub: `${tipPct}% of ${fmt(billNum)}`, highlight: false },
          { label: 'Total Bill', value: fmt(calc.total), sub: 'Bill + Tip', highlight: true },
          { label: 'Tip per Person', value: fmt(calc.tipPerPerson), sub: `÷ ${people}`, highlight: false },
          { label: 'Total per Person', value: fmt(calc.perPerson), sub: `Each pays`, highlight: true },
        ].map(({ label, value, sub, highlight }) => (
          <div key={label} className={`rounded-2xl border p-4 ${highlight ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
            <p className={`text-xl font-bold mt-1 ${highlight ? 'text-green-700 dark:text-green-300' : 'text-gray-800 dark:text-gray-100'}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Tip guide */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Tip Guide</p>
        <div className="space-y-1.5">
          {[
            { pct: '10%', label: 'Poor service' },
            { pct: '15%', label: 'Average service' },
            { pct: '18%', label: 'Good service (standard)' },
            { pct: '20%', label: 'Great service' },
            { pct: '25%+', label: 'Exceptional service' },
          ].map(({ pct, label }) => (
            <div key={pct} className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-green-600 dark:text-green-400 w-8">{pct}</span>
              <span className="text-gray-500 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
