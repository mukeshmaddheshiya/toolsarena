'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Plus, X } from 'lucide-react';

type GradType = 'linear' | 'radial' | 'conic';

interface Stop { id: string; color: string; pos: number; }

const PRESETS = [
  { name: 'Sunset', stops: [{ color: '#f97316', pos: 0 }, { color: '#ec4899', pos: 100 }], angle: 135 },
  { name: 'Ocean', stops: [{ color: '#0ea5e9', pos: 0 }, { color: '#6366f1', pos: 100 }], angle: 135 },
  { name: 'Forest', stops: [{ color: '#22c55e', pos: 0 }, { color: '#14b8a6', pos: 100 }], angle: 135 },
  { name: 'Fire', stops: [{ color: '#ef4444', pos: 0 }, { color: '#f97316', pos: 50 }, { color: '#facc15', pos: 100 }], angle: 90 },
  { name: 'Aurora', stops: [{ color: '#8b5cf6', pos: 0 }, { color: '#06b6d4', pos: 50 }, { color: '#10b981', pos: 100 }], angle: 120 },
  { name: 'Peach', stops: [{ color: '#fda4af', pos: 0 }, { color: '#fbbf24', pos: 100 }], angle: 45 },
];

export function CssGradientGeneratorTool() {
  const [type, setType] = useState<GradType>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', color: '#6366f1', pos: 0 },
    { id: '2', color: '#ec4899', pos: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    const stopsStr = stops.sort((a, b) => a.pos - b.pos).map(s => `${s.color} ${s.pos}%`).join(', ');
    if (type === 'linear') return `linear-gradient(${angle}deg, ${stopsStr})`;
    if (type === 'radial') return `radial-gradient(circle, ${stopsStr})`;
    return `conic-gradient(from ${angle}deg, ${stopsStr})`;
  }, [type, angle, stops]);

  const fullCss = `background: ${css};`;

  const copy = async () => {
    await navigator.clipboard.writeText(fullCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addStop = () => {
    setStops(prev => [...prev, { id: Math.random().toString(36).slice(2), color: '#ffffff', pos: 50 }]);
  };

  const updateStop = (id: string, key: 'color' | 'pos', val: string | number) => {
    setStops(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s));
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(prev => prev.filter(s => s.id !== id));
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setStops(p.stops.map((s, i) => ({ ...s, id: String(i) })));
    setAngle(p.angle);
    setType('linear');
  };

  return (
    <div className="space-y-5">
      {/* Preview */}
      <div className="rounded-2xl overflow-hidden shadow-lg h-40 transition-all duration-300" style={{ background: css }} />

      {/* CSS output */}
      <div className="bg-gray-900 rounded-2xl p-4 flex items-center gap-3">
        <code className="flex-1 text-green-400 font-mono text-sm break-all">{fullCss}</code>
        <button onClick={copy} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs transition-colors">
          {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-5">
        {/* Type + Angle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Type</label>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
              {(['linear', 'radial', 'conic'] as GradType[]).map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${type === t ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {type !== 'radial' && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Angle: {angle}°</label>
              <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full accent-indigo-500 mt-1" />
            </div>
          )}
        </div>

        {/* Color stops */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Color Stops</label>
            <button onClick={addStop} className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              <Plus className="w-3 h-3" /> Add stop
            </button>
          </div>
          <div className="space-y-3">
            {stops.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <input type="color" value={s.color} onChange={e => updateStop(s.id, 'color', e.target.value)}
                  className="w-10 h-9 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer shrink-0" />
                <span className="text-xs font-mono text-gray-500 w-16 shrink-0">{s.color}</span>
                <input type="range" min={0} max={100} value={s.pos} onChange={e => updateStop(s.id, 'pos', Number(e.target.value))} className="flex-1 accent-indigo-500" />
                <span className="text-xs text-gray-400 w-8 text-right shrink-0">{s.pos}%</span>
                <button onClick={() => removeStop(s.id)} disabled={stops.length <= 2}
                  className="p-1 rounded text-gray-300 hover:text-red-500 disabled:opacity-20 transition-colors shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Presets</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => applyPreset(p)}
              className="group flex flex-col items-center gap-1.5">
              <div className="w-full h-10 rounded-xl shadow-sm transition-transform group-hover:scale-105"
                style={{ background: `linear-gradient(${p.angle}deg, ${p.stops.map(s => `${s.color} ${s.pos}%`).join(', ')})` }} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
