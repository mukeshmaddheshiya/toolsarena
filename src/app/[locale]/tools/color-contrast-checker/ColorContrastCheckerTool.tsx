'use client';
import { useState, useCallback } from 'react';
import { ArrowLeftRight, Check, X } from 'lucide-react';

// ─── Colour parsing ───────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(h)) return null;
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function parseRgb(str: string): [number, number, number] | null {
  const m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return null;
  return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
}

function parseHsl(str: string): [number, number, number] | null {
  const m = str.match(/hsla?\(\s*(\d+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/i);
  if (!m) return null;
  const h = parseInt(m[1]) / 360;
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

function parseColor(input: string): [number, number, number] | null {
  const s = input.trim();
  if (s.startsWith('#') || /^[0-9a-fA-F]{3,6}$/.test(s)) return hexToRgb(s.startsWith('#') ? s : '#' + s);
  if (/^rgba?/i.test(s)) return parseRgb(s);
  if (/^hsla?/i.test(s)) return parseHsl(s);
  return null;
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ─── WCAG luminance ──────────────────────────────────────────────────────────

function relativeLuminance(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ─── Presets ─────────────────────────────────────────────────────────────────

const PRESETS = [
  { label: 'White on Black', fg: '#ffffff', bg: '#000000' },
  { label: 'Black on White', fg: '#000000', bg: '#ffffff' },
  { label: 'White on Blue', fg: '#ffffff', bg: '#1d4ed8' },
  { label: 'Black on Yellow', fg: '#000000', bg: '#fde047' },
];

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
      <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
      {pass ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
          <Check className="w-3 h-3" /> Pass
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
          <X className="w-3 h-3" /> Fail
        </span>
      )}
    </div>
  );
}

// ─── Colour input ─────────────────────────────────────────────────────────────

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const rgb = parseColor(value);
  const hexForPicker = rgb ? rgbToHex(...rgb) : '#000000';

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="#000000"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
        />
        <input
          type="color"
          value={hexForPicker}
          onChange={e => onChange(e.target.value)}
          className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800 shrink-0"
        />
      </div>
      {value && !rgb && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1">Invalid colour value</p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ColorContrastCheckerTool() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');

  const fgRgb = parseColor(fg);
  const bgRgb = parseColor(bg);

  const ratio =
    fgRgb && bgRgb
      ? contrastRatio(relativeLuminance(...fgRgb), relativeLuminance(...bgRgb))
      : null;

  const swap = useCallback(() => {
    setFg(bg);
    setBg(fg);
  }, [fg, bg]);

  const ratioStr = ratio ? ratio.toFixed(2) + ':1' : '—';
  const ratioNum = ratio ?? 0;

  const level =
    ratioNum >= 7
      ? { label: 'AAA', color: 'text-green-600 dark:text-green-400' }
      : ratioNum >= 4.5
      ? { label: 'AA', color: 'text-blue-600 dark:text-blue-400' }
      : ratioNum >= 3
      ? { label: 'AA Large', color: 'text-amber-600 dark:text-amber-400' }
      : { label: 'Fail', color: 'text-red-600 dark:text-red-400' };

  return (
    <div className="space-y-6">
      {/* Colour inputs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <ColorInput label="Foreground Color" value={fg} onChange={setFg} />
        <ColorInput label="Background Color" value={bg} onChange={setBg} />
      </div>

      {/* Swap + Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={swap}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4" /> Swap Colors
        </button>
        <span className="text-xs text-slate-400 dark:text-slate-500">Presets:</span>
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => { setFg(p.fg); setBg(p.bg); }}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {ratio !== null && (
        <>
          {/* Live preview */}
          <div
            className="rounded-xl p-6 flex flex-col items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 min-h-[100px]"
            style={{ backgroundColor: bgRgb ? rgbToHex(...bgRgb) : '#fff' }}
          >
            <p
              className="text-3xl font-bold"
              style={{ color: fgRgb ? rgbToHex(...fgRgb) : '#000' }}
            >
              Sample Text Aa
            </p>
            <p
              className="text-sm"
              style={{ color: fgRgb ? rgbToHex(...fgRgb) : '#000' }}
            >
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>

          {/* Ratio display */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">
                Contrast Ratio
              </p>
              <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">{ratioStr}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mb-1">
                WCAG Level
              </p>
              <p className={`text-3xl font-bold ${level.color}`}>{level.label}</p>
            </div>
          </div>

          {/* WCAG badges */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              WCAG 2.1 Compliance
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              <Badge pass={ratioNum >= 4.5} label="AA — Normal Text (≥4.5:1)" />
              <Badge pass={ratioNum >= 3} label="AA — Large Text (≥3:1)" />
              <Badge pass={ratioNum >= 3} label="AA — UI Components (≥3:1)" />
              <Badge pass={ratioNum >= 7} label="AAA — Normal Text (≥7:1)" />
              <Badge pass={ratioNum >= 4.5} label="AAA — Large Text (≥4.5:1)" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
