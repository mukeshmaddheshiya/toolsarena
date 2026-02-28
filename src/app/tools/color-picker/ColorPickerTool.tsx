'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function getShades(hex: string): string[] {
  const { r, g, b } = hexToRgb(hex);
  return [90, 75, 60, 45, 30, 15, 0].map((pct) => {
    const factor = pct / 100;
    const nr = Math.round(r + (255 - r) * factor);
    const ng = Math.round(g + (255 - g) * factor);
    const nb = Math.round(b + (255 - b) * factor);
    return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
  });
}

function getComplementary(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const cr = (255 - r).toString(16).padStart(2, '0');
  const cg = (255 - g).toString(16).padStart(2, '0');
  const cb = (255 - b).toString(16).padStart(2, '0');
  return `#${cr}${cg}${cb}`;
}

export function ColorPickerTool() {
  const [hex, setHex] = useState('#1e40af');
  const [hexInput, setHexInput] = useState('#1e40af');

  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const shades = getShades(hex);
  const complementary = getComplementary(hex);

  function handleHexInput(val: string) {
    setHexInput(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) setHex(val.toLowerCase());
  }

  function handleColorPicker(val: string) {
    setHex(val);
    setHexInput(val);
  }

  const colorValues = [
    { label: 'HEX', value: hex, copyVal: hex },
    { label: 'RGB', value: `rgb(${r}, ${g}, ${b})`, copyVal: `rgb(${r}, ${g}, ${b})` },
    { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)`, copyVal: `hsl(${h}, ${s}%, ${l}%)` },
    {
      label: 'RGBA',
      value: `rgba(${r}, ${g}, ${b}, 1)`,
      copyVal: `rgba(${r}, ${g}, ${b}, 1)`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Picker */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={hex}
              onChange={(e) => handleColorPicker(e.target.value)}
              className="w-20 h-20 rounded-2xl cursor-pointer border-0 shadow-md"
            />
            <div>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexInput(e.target.value)}
                placeholder="#000000"
                maxLength={7}
                className="w-36 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
              />
              <p className="text-xs text-slate-400 mt-1">Enter any hex code</p>
            </div>
          </div>

          {/* Color values */}
          <div className="space-y-2">
            {colorValues.map(({ label, value, copyVal }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              >
                <span className="w-10 text-xs font-bold text-slate-500 dark:text-slate-400">
                  {label}
                </span>
                <span className="flex-1 font-mono text-sm text-slate-900 dark:text-slate-100">
                  {value}
                </span>
                <CopyButton text={copyVal} size="sm" label="" />
              </div>
            ))}
          </div>
        </div>

        {/* Swatches */}
        <div className="space-y-4">
          {/* Shades */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Shades &amp; Tints
            </p>
            <div className="grid grid-cols-7 gap-1 h-14">
              {shades.map((shade, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setHex(shade);
                    setHexInput(shade);
                  }}
                  style={{ backgroundColor: shade }}
                  title={shade}
                  className="rounded-lg border border-white/20 hover:scale-105 transition-transform"
                />
              ))}
            </div>
          </div>

          {/* Complementary */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Complementary Color
            </p>
            <div className="flex gap-3">
              <div
                style={{ backgroundColor: hex }}
                className="flex-1 h-16 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
                title={hex}
              />
              <button
                style={{ backgroundColor: complementary }}
                onClick={() => {
                  setHex(complementary);
                  setHexInput(complementary);
                }}
                className="flex-1 h-16 rounded-xl border border-slate-200 dark:border-slate-700 hover:scale-[1.02] transition-transform"
                title={complementary}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs font-mono text-slate-400">
              <span>{hex}</span>
              <span>{complementary}</span>
            </div>
          </div>

          {/* Preset colors */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                '#1e40af',
                '#7c3aed',
                '#db2777',
                '#dc2626',
                '#ea580c',
                '#ca8a04',
                '#16a34a',
                '#0891b2',
                '#0f172a',
                '#ffffff',
              ].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setHex(c);
                    setHexInput(c);
                  }}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-lg border-2 hover:scale-110 transition-transform ${
                    hex === c
                      ? 'border-primary-500'
                      : 'border-slate-200 dark:border-slate-600'
                  }`}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
