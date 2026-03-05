'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function HexRgbConverterTool() {
  const [hex, setHex] = useState('#3b82f6');
  const [r, setR] = useState(59);
  const [g, setG] = useState(130);
  const [b, setB] = useState(246);

  const updateFromHex = (val: string) => {
    setHex(val);
    const rgb = hexToRgb(val);
    if (rgb) { setR(rgb.r); setG(rgb.g); setB(rgb.b); }
  };

  const updateFromRgb = (nr: number, ng: number, nb: number) => {
    setR(nr); setG(ng); setB(nb);
    setHex(rgbToHex(nr, ng, nb));
  };

  const hsl = rgbToHsl(r, g, b);
  const rgbStr = `rgb(${r}, ${g}, ${b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HEX Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">HEX Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                className="w-12 h-11 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* RGB Inputs */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">RGB Values</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'R', value: r, color: 'text-red-600', set: (v: number) => updateFromRgb(v, g, b) },
                { label: 'G', value: g, color: 'text-green-600', set: (v: number) => updateFromRgb(r, v, b) },
                { label: 'B', value: b, color: 'text-blue-600', set: (v: number) => updateFromRgb(r, g, v) },
              ].map(({ label, value, color, set }) => (
                <div key={label}>
                  <label className={`block text-xs font-bold ${color} mb-1`}>{label}</label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={value}
                    onChange={(e) => set(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3">
            {[
              { label: 'Red', value: r, color: '#ef4444', set: (v: number) => updateFromRgb(v, g, b) },
              { label: 'Green', value: g, color: '#22c55e', set: (v: number) => updateFromRgb(r, v, b) },
              { label: 'Blue', value: b, color: '#3b82f6', set: (v: number) => updateFromRgb(r, g, v) },
            ].map(({ label, value, color, set }) => (
              <div key={label}>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: color }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Preview + Output */}
        <div className="space-y-4">
          <div
            className="w-full h-40 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner"
            style={{ backgroundColor: hex }}
          />

          <div className="space-y-3">
            {[
              { label: 'HEX', value: hex.toUpperCase() },
              { label: 'RGB', value: rgbStr },
              { label: 'HSL', value: hslStr },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-3">
                <span className="text-xs font-bold text-slate-500 w-8">{label}</span>
                <code className="flex-1 text-sm font-mono text-slate-800 dark:text-slate-200">{value}</code>
                <CopyButton text={value} />
              </div>
            ))}
          </div>

          {/* CSS */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-3">
            <p className="text-xs font-bold text-slate-500 mb-2">CSS</p>
            <code className="text-sm font-mono text-slate-800 dark:text-slate-200 block">
              color: {hex};<br />
              background-color: {hex};
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
