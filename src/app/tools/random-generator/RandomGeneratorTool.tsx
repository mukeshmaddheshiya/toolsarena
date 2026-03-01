'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

type Tab = 'number' | 'dice' | 'coin' | 'list';

const DICE_FACES = ['⚀','⚁','⚂','⚃','⚄','⚅'];

export function RandomGeneratorTool() {
  const [tab, setTab] = useState<Tab>('number');
  const [copied, setCopied] = useState(false);

  // Number
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [numCount, setNumCount] = useState(1);
  const [numResult, setNumResult] = useState<number[]>([]);

  // Dice
  const [diceType, setDiceType] = useState(6);
  const [diceCount, setDiceCount] = useState(1);
  const [diceResult, setDiceResult] = useState<number[]>([]);

  // Coin
  const [coinCount, setCoinCount] = useState(1);
  const [coinResult, setCoinResult] = useState<string[]>([]);

  // List picker
  const [listInput, setListInput] = useState('Alice\nBob\nCarol\nDavid\nEmma');
  const [pickCount, setPickCount] = useState(1);
  const [listResult, setListResult] = useState<string[]>([]);

  const rng = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo + 1)) + lo;

  const genNumbers = () => setNumResult(Array.from({ length: numCount }, () => rng(min, max)));
  const genDice = () => setDiceResult(Array.from({ length: diceCount }, () => rng(1, diceType)));
  const genCoin = () => setCoinResult(Array.from({ length: coinCount }, () => Math.random() < 0.5 ? 'Heads' : 'Tails'));
  const genList = () => {
    const items = listInput.split('\n').map(s => s.trim()).filter(Boolean);
    if (!items.length) return;
    const n = Math.min(pickCount, items.length);
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setListResult(shuffled.slice(0, n));
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const TABS = [
    { id: 'number', label: '🔢 Number' },
    { id: 'dice', label: '🎲 Dice' },
    { id: 'coin', label: '🪙 Coin' },
    { id: 'list', label: '📋 List' },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">

        {/* NUMBER */}
        {tab === 'number' && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {([['Min', min, setMin], ['Max', max, setMax], ['Count', numCount, setNumCount]] as [string, number, (v: number) => void][]).map(([label, val, setter]) => (
                <div key={label}>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</label>
                  <input type="number" value={val} onChange={e => setter(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
            </div>
            <button onClick={genNumbers} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
              <RefreshCw className="w-4 h-4" /> Generate
            </button>
            {numResult.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {numResult.map((n, i) => (
                  <span key={i} className="text-3xl font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl">{n}</span>
                ))}
              </div>
            )}
          </>
        )}

        {/* DICE */}
        {tab === 'dice' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Dice type</label>
                <select value={diceType} onChange={e => setDiceType(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {[4, 6, 8, 10, 12, 20, 100].map(d => <option key={d} value={d}>D{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Count: {diceCount}</label>
                <input type="range" min={1} max={10} value={diceCount} onChange={e => setDiceCount(Number(e.target.value))} className="w-full accent-blue-500 mt-2" />
              </div>
            </div>
            <button onClick={genDice} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
              <RefreshCw className="w-4 h-4" /> Roll
            </button>
            {diceResult.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {diceResult.map((n, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-4xl">{diceType === 6 ? DICE_FACES[n - 1] : '🎲'}</span>
                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{n}</span>
                  </div>
                ))}
                {diceResult.length > 1 && (
                  <div className="self-end text-sm text-gray-500 dark:text-gray-400 ml-2">
                    Sum: <strong>{diceResult.reduce((a, b) => a + b, 0)}</strong>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* COIN */}
        {tab === 'coin' && (
          <>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Flips: {coinCount}</label>
              <input type="range" min={1} max={10} value={coinCount} onChange={e => setCoinCount(Number(e.target.value))} className="w-48 accent-blue-500" />
            </div>
            <button onClick={genCoin} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
              <RefreshCw className="w-4 h-4" /> Flip
            </button>
            {coinResult.length > 0 && (
              <div className="space-y-2 mt-2">
                <div className="flex flex-wrap gap-3">
                  {coinResult.map((r, i) => (
                    <div key={i} className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl font-bold ${r === 'Heads' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                      <span className="text-3xl">{r === 'Heads' ? '🪙' : '🔘'}</span>
                      <span className="text-sm">{r}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">H: {coinResult.filter(r => r === 'Heads').length} · T: {coinResult.filter(r => r === 'Tails').length}</p>
              </div>
            )}
          </>
        )}

        {/* LIST */}
        {tab === 'list' && (
          <>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Items (one per line)</label>
              <textarea value={listInput} onChange={e => setListInput(e.target.value)} rows={6}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Pick {pickCount}</label>
              <input type="range" min={1} max={10} value={pickCount} onChange={e => setPickCount(Number(e.target.value))} className="w-48 accent-blue-500" />
            </div>
            <button onClick={genList} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
              <RefreshCw className="w-4 h-4" /> Pick Random
            </button>
            {listResult.length > 0 && (
              <div className="space-y-2 mt-2">
                {listResult.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">#{i+1}</span>
                    <span className="text-gray-800 dark:text-gray-100 font-medium">{r}</span>
                  </div>
                ))}
                <button onClick={() => copyText(listResult.join('\n'))} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                  {copied ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy results</>}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
