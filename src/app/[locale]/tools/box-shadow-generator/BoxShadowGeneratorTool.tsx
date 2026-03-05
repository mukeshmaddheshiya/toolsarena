'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Plus, X } from 'lucide-react';

interface Shadow { id: string; x: number; y: number; blur: number; spread: number; color: string; opacity: number; inset: boolean; }

const newShadow = (): Shadow => ({ id: Math.random().toString(36).slice(2), x: 4, y: 4, blur: 10, spread: 0, color: '#000000', opacity: 20, inset: false });

const PRESETS: { name: string; shadows: Omit<Shadow, 'id'>[] }[] = [
  { name: 'Soft', shadows: [{ x: 0, y: 4, blur: 20, spread: 0, color: '#000000', opacity: 10, inset: false }] },
  { name: 'Medium', shadows: [{ x: 0, y: 8, blur: 24, spread: -4, color: '#000000', opacity: 20, inset: false }] },
  { name: 'Hard', shadows: [{ x: 4, y: 4, blur: 0, spread: 0, color: '#000000', opacity: 100, inset: false }] },
  { name: 'Layered', shadows: [{ x: 0, y: 2, blur: 4, spread: 0, color: '#000000', opacity: 8, inset: false }, { x: 0, y: 8, blur: 24, spread: -4, color: '#000000', opacity: 16, inset: false }] },
  { name: 'Glow Blue', shadows: [{ x: 0, y: 0, blur: 20, spread: 2, color: '#3b82f6', opacity: 60, inset: false }] },
  { name: 'Inset', shadows: [{ x: 0, y: 2, blur: 6, spread: 0, color: '#000000', opacity: 25, inset: true }] },
];

function shadowToCss(s: Shadow): string {
  const alpha = Math.round(s.opacity * 2.55).toString(16).padStart(2, '0');
  const color = s.color + alpha;
  return `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${color}`;
}

export function BoxShadowGeneratorTool() {
  const [shadows, setShadows] = useState<Shadow[]>([{ ...newShadow(), x: 0, y: 8, blur: 24, spread: -4, opacity: 20 }]);
  const [bgColor, setBgColor] = useState('#f1f5f9');
  const [boxColor, setBoxColor] = useState('#ffffff');
  const [radius, setRadius] = useState(12);
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => shadows.map(shadowToCss).join(',\n  '), [shadows]);
  const fullCss = `box-shadow: ${css};`;

  const copy = async () => {
    await navigator.clipboard.writeText(fullCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const add = () => setShadows(prev => [...prev, newShadow()]);
  const remove = (id: string) => { if (shadows.length > 1) setShadows(prev => prev.filter(s => s.id !== id)); };
  const update = <K extends keyof Shadow>(id: string, key: K, val: Shadow[K]) =>
    setShadows(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s));

  const applyPreset = (p: typeof PRESETS[0]) => {
    setShadows(p.shadows.map(s => ({ ...s, id: Math.random().toString(36).slice(2) })));
  };

  return (
    <div className="space-y-5">
      {/* Preview */}
      <div className="rounded-2xl p-12 flex items-center justify-center transition-all duration-300" style={{ background: bgColor }}>
        <div className="w-40 h-24 transition-all duration-300" style={{
          background: boxColor,
          borderRadius: radius,
          boxShadow: css,
        }} />
      </div>

      {/* CSS output */}
      <div className="bg-gray-900 rounded-2xl p-4 flex items-start gap-3">
        <code className="flex-1 text-green-400 font-mono text-sm whitespace-pre-wrap break-all">{fullCss}</code>
        <button onClick={copy} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs transition-colors">
          {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
        </button>
      </div>

      {/* Canvas settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex flex-wrap gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Background</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-9 w-16 rounded border border-gray-200 cursor-pointer" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Box Color</label>
          <input type="color" value={boxColor} onChange={e => setBoxColor(e.target.value)} className="h-9 w-16 rounded border border-gray-200 cursor-pointer" />
        </div>
        <div className="flex-1 min-w-32">
          <label className="block text-xs text-gray-500 mb-1">Border Radius: {radius}px</label>
          <input type="range" min={0} max={60} value={radius} onChange={e => setRadius(Number(e.target.value))} className="w-full accent-gray-500 mt-1" />
        </div>
      </div>

      {/* Shadow layers */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Shadow Layers</span>
          <button onClick={add} className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"><Plus className="w-3 h-3" /> Add</button>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {shadows.map((s, idx) => (
            <div key={s.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Layer {idx + 1}</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                    <input type="checkbox" checked={s.inset} onChange={e => update(s.id, 'inset', e.target.checked)} className="accent-indigo-500" />
                    Inset
                  </label>
                  <button onClick={() => remove(s.id)} disabled={shadows.length <= 1} className="p-1 text-gray-300 hover:text-red-500 disabled:opacity-20 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {([['X Offset', 'x', -50, 50], ['Y Offset', 'y', -50, 50], ['Blur', 'blur', 0, 100], ['Spread', 'spread', -50, 50]] as [string, keyof Shadow, number, number][]).map(([label, key, min, max]) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-400 mb-1">{label}: {String(s[key])}px</label>
                    <input type="range" min={min} max={max} value={s[key] as number} onChange={e => update(s.id, key, Number(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Opacity: {s.opacity}%</label>
                  <input type="range" min={0} max={100} value={s.opacity} onChange={e => update(s.id, 'opacity', Number(e.target.value))} className="w-full accent-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Color</label>
                  <input type="color" value={s.color} onChange={e => update(s.id, 'color', e.target.value)} className="h-8 w-full rounded border border-gray-200 cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => applyPreset(p)}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              style={{ boxShadow: p.shadows.map(s => ({ ...s, id: '' })).map(shadowToCss).join(', ') }}>
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
