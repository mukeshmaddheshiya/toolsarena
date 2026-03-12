'use client';

import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { RotateCcw } from 'lucide-react';

type Tab = 'bonus' | 'rights' | 'dividend';

function fmtN(n: number, decimals = 2) {
  return n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function fmtRs(n: number) { return 'Rs. ' + fmtN(n); }

// ── Bonus Share Calculator ────────────────────────────────────────────────────
function BonusSection() {
  const [price, setPrice]       = useState('');
  const [units, setUnits]       = useState('');
  const [bonusPct, setBonusPct] = useState('');

  const p    = parseFloat(price);
  const n    = parseFloat(units);
  const bPct = parseFloat(bonusPct);
  const valid = p > 0 && n > 0 && bPct > 0;

  const newShares       = valid ? (n * bPct) / 100 : 0;
  const totalShares     = valid ? n + newShares : 0;
  const adjPrice        = valid ? (p * n) / totalShares : 0;
  const totalValue      = valid ? p * n : 0;
  const totalValueAfter = valid ? adjPrice * totalShares : 0;
  const taxOnBonus      = valid ? (newShares * 100) * 0.05 : 0;

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Current Market Price (Rs.)</label>
          <input type="number" min="0" step="0.01" placeholder="e.g. 500" value={price}
            onChange={e => setPrice(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Shares Held (Kitta)</label>
          <input type="number" min="0" step="1" placeholder="e.g. 100" value={units}
            onChange={e => setUnits(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Bonus Share % Announced</label>
          <input type="number" min="0" step="0.01" placeholder="e.g. 20 for 20%" value={bonusPct}
            onChange={e => setBonusPct(e.target.value)} className={inputClass} />
        </div>
      </div>

      {valid && (
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Adjusted Price', value: fmtRs(adjPrice), highlight: true },
                { label: 'New Bonus Shares', value: fmtN(newShares, 2) + ' kitta' },
                { label: 'Total Shares After', value: fmtN(totalShares, 2) + ' kitta' },
                { label: 'Tax on Bonus (5% of FV)', value: fmtRs(taxOnBonus) },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{item.label}</div>
                  <div className={`font-bold font-mono ${item.highlight ? 'text-xl text-green-700 dark:text-green-400' : 'text-base text-slate-800 dark:text-slate-200'}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="min-w-full text-sm">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {[
                  ['Current Price', fmtRs(p)],
                  ['Shares Held', fmtN(n, 0) + ' kitta'],
                  ['Total Holding Value', fmtRs(totalValue)],
                  ['Bonus %', bPct + '%'],
                  ['New Bonus Shares Received', fmtN(newShares, 2) + ' kitta'],
                  ['Total Shares After Bonus', fmtN(totalShares, 2) + ' kitta'],
                  ['Adjusted (Ex-Bonus) Price', fmtRs(adjPrice)],
                  ['Total Portfolio Value After', fmtRs(totalValueAfter)],
                  ['Tax on Bonus @ 5% of face value (Rs.100)', fmtRs(taxOnBonus)],
                ].map(([k, v]) => (
                  <tr key={k} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{k}</td>
                    <td className="px-4 py-2.5 font-mono font-medium text-slate-800 dark:text-slate-200 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {v} <CopyButton text={v.replace(/Rs\. /, '')} size="sm" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-xs text-amber-800 dark:text-amber-300">
            <strong>Formula:</strong> Adjusted Price = (Current Price × Old Shares) ÷ (Old Shares + Bonus Shares)
            = ({fmtRs(p)} × {fmtN(n, 0)}) ÷ {fmtN(totalShares, 2)} = <strong>{fmtRs(adjPrice)}</strong>
            <br className="my-1" />NEPSE adjusts the market price automatically on the ex-bonus date.
          </div>
        </div>
      )}
    </div>
  );
}

// ── Rights Share Calculator ───────────────────────────────────────────────────
function RightsSection() {
  const [price,      setPrice]      = useState('');
  const [units,      setUnits]      = useState('');
  const [rightsPct,  setRightsPct]  = useState('');
  const [issuePrice, setIssuePrice] = useState('100');

  const p    = parseFloat(price);
  const n    = parseFloat(units);
  const rPct = parseFloat(rightsPct);
  const ip   = parseFloat(issuePrice);
  const valid = p > 0 && n > 0 && rPct > 0 && ip > 0;

  const newShares    = valid ? (n * rPct) / 100 : 0;
  const totalShares  = valid ? n + newShares : 0;
  const costOfRights = valid ? newShares * ip : 0;
  const terp         = valid ? (p * n + ip * newShares) / totalShares : 0;
  const valueGain    = valid ? (terp - ip) * newShares : 0;

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Current Market Price (Rs.)</label>
          <input type="number" min="0" step="0.01" placeholder="e.g. 800" value={price}
            onChange={e => setPrice(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Shares Held (Kitta)</label>
          <input type="number" min="0" step="1" placeholder="e.g. 100" value={units}
            onChange={e => setUnits(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Rights Issue % (e.g. 20 for 1:5)</label>
          <input type="number" min="0" step="0.01" placeholder="e.g. 20" value={rightsPct}
            onChange={e => setRightsPct(e.target.value)} className={inputClass} />
          <p className="text-xs text-slate-400 mt-1">20% = 20 new shares per 100 old shares</p>
        </div>
        <div>
          <label className={labelClass}>Rights Issue Price (Rs.)</label>
          <input type="number" min="0" step="0.01" placeholder="e.g. 100" value={issuePrice}
            onChange={e => setIssuePrice(e.target.value)} className={inputClass} />
          <p className="text-xs text-slate-400 mt-1">Usually Rs.100 (face value) or at premium</p>
        </div>
      </div>

      {valid && (
        <div className="space-y-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'TERP (Ex-Rights Price)', value: fmtRs(terp), highlight: true },
                { label: 'Rights Shares Allotted', value: fmtN(newShares, 2) + ' kitta' },
                { label: 'Cost to Subscribe', value: fmtRs(costOfRights) },
                { label: 'Paper Value Gain', value: fmtRs(valueGain) },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{item.label}</div>
                  <div className={`font-bold font-mono ${item.highlight ? 'text-xl text-blue-700 dark:text-blue-400' : 'text-base text-slate-800 dark:text-slate-200'}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="min-w-full text-sm">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {[
                  ['Current Market Price', fmtRs(p)],
                  ['Existing Shares', fmtN(n, 0) + ' kitta'],
                  ['Rights %', rPct + '%'],
                  ['Rights Shares Allotted', fmtN(newShares, 2) + ' kitta'],
                  ['Rights Issue Price', fmtRs(ip)],
                  ['Total Cost to Subscribe', fmtRs(costOfRights)],
                  ['Total Shares After Rights', fmtN(totalShares, 2) + ' kitta'],
                  ['TERP (Theoretical Ex-Rights Price)', fmtRs(terp)],
                  ['Immediate Value Gain on Rights', fmtRs(valueGain)],
                ].map(([k, v]) => (
                  <tr key={k} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{k}</td>
                    <td className="px-4 py-2.5 font-mono font-medium text-slate-800 dark:text-slate-200 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {v} <CopyButton text={v.replace(/Rs\. /, '')} size="sm" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
            <strong>TERP Formula:</strong> (Market Price × Old Shares + Issue Price × Rights Shares) ÷ Total Shares
            = ({fmtRs(p)} × {fmtN(n,0)} + {fmtRs(ip)} × {fmtN(newShares,2)}) ÷ {fmtN(totalShares,2)} = <strong>{fmtRs(terp)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Dividend Yield Calculator ─────────────────────────────────────────────────
function DividendSection() {
  const [cashDivPct, setCashDivPct] = useState('');
  const [price,      setPrice]      = useState('');

  const p    = parseFloat(price);
  const dPct = parseFloat(cashDivPct);
  const fv   = 100; // face value always Rs. 100 in Nepal
  const valid = p > 0 && dPct > 0;

  const divPerShare   = valid ? (fv * dPct) / 100 : 0;
  const dividendYield = valid ? (divPerShare / p) * 100 : 0;
  const taxOnDiv      = valid ? divPerShare * 0.05 : 0;
  const netDiv        = valid ? divPerShare - taxOnDiv : 0;

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Cash Dividend % Announced</label>
          <input type="number" min="0" step="0.01" placeholder="e.g. 10 for 10%" value={cashDivPct}
            onChange={e => setCashDivPct(e.target.value)} className={inputClass} />
          <p className="text-xs text-slate-400 mt-1">Calculated on face value of Rs. 100</p>
        </div>
        <div>
          <label className={labelClass}>Current Market Price (Rs.)</label>
          <input type="number" min="0" step="0.01" placeholder="e.g. 450" value={price}
            onChange={e => setPrice(e.target.value)} className={inputClass} />
        </div>
      </div>

      {valid && (
        <div className="space-y-3">
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Dividend per Share', value: fmtRs(divPerShare), highlight: true },
                { label: 'Dividend Yield', value: dividendYield.toFixed(2) + '%', highlight: true },
                { label: 'TDS Withheld (5%)', value: fmtRs(taxOnDiv) },
                { label: 'Net Dividend per Share', value: fmtRs(netDiv) },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{item.label}</div>
                  <div className={`font-bold font-mono ${item.highlight ? 'text-xl text-purple-700 dark:text-purple-400' : 'text-base text-slate-800 dark:text-slate-200'}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            In Nepal, cash dividend is declared as a % of face value (Rs. 100). A 5% TDS is deducted at source.
            Dividend Yield = Dividend per Share ÷ Market Price × 100.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function NepseBonusCalculatorTool() {
  const [tab, setTab] = useState<Tab>('bonus');

  const tabs = [
    { id: 'bonus' as Tab,    label: 'Bonus Share',   desc: 'Adjusted price after bonus' },
    { id: 'rights' as Tab,   label: 'Rights Share',  desc: 'TERP & subscription cost' },
    { id: 'dividend' as Tab, label: 'Cash Dividend', desc: 'Yield & tax calculation' },
  ];

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 px-2 rounded-lg text-center transition-all ${
              tab === t.id
                ? 'bg-white dark:bg-slate-700 shadow text-primary-700 dark:text-primary-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}>
            <div className="text-sm font-medium">{t.label}</div>
            <div className="text-[11px] opacity-70 hidden sm:block">{t.desc}</div>
          </button>
        ))}
      </div>

      {tab === 'bonus'    && <BonusSection />}
      {tab === 'rights'   && <RightsSection />}
      {tab === 'dividend' && <DividendSection />}

      <button
        onClick={() => setTab(tab)}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      >
        <RotateCcw className="w-3 h-3" /> Reset this tab
      </button>
    </div>
  );
}
