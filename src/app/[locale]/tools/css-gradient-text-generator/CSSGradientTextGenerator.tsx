'use client';
import { useState, useMemo, useCallback } from 'react';
import { Copy, Check, Type, Palette } from 'lucide-react';

const PRESETS = [
  { name: 'Sunset', from: '#ff6b6b', to: '#feca57', angle: 90 },
  { name: 'Ocean', from: '#0652DD', to: '#1B9CFC', angle: 135 },
  { name: 'Neon', from: '#00ff87', to: '#60efff', angle: 90 },
  { name: 'Forest', from: '#11998e', to: '#38ef7d', angle: 135 },
  { name: 'Berry', from: '#8E2DE2', to: '#4A00E0', angle: 90 },
  { name: 'Fire', from: '#f12711', to: '#f5af19', angle: 90 },
  { name: 'Galaxy', from: '#7F00FF', to: '#E100FF', angle: 135 },
  { name: 'Candy', from: '#fc5c7d', to: '#6a82fb', angle: 90 },
  { name: 'Midnight', from: '#232526', to: '#414345', angle: 135 },
  { name: 'Emerald', from: '#43e97b', to: '#38f9d7', angle: 90 },
  { name: 'Peach', from: '#ffecd2', to: '#fcb69f', angle: 135 },
  { name: 'Electric', from: '#4facfe', to: '#00f2fe', angle: 90 },
];

export function CSSGradientTextGenerator() {
  const [text, setText] = useState('Hello World');
  const [colorFrom, setColorFrom] = useState('#ff6b6b');
  const [colorTo, setColorTo] = useState('#feca57');
  const [angle, setAngle] = useState(90);
  const [fontSize, setFontSize] = useState(48);
  const [copied, setCopied] = useState(false);

  const cssCode = useMemo(() => {
    return `background: linear-gradient(${angle}deg, ${colorFrom}, ${colorTo});
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;`;
  }, [colorFrom, colorTo, angle]);

  const gradientStyle = useMemo(() => ({
    background: `linear-gradient(${angle}deg, ${colorFrom}, ${colorTo})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: `${fontSize}px`,
    lineHeight: 1.2,
  }), [colorFrom, colorTo, angle, fontSize]);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cssCode]);

  function applyPreset(p: typeof PRESETS[0]) {
    setColorFrom(p.from);
    setColorTo(p.to);
    setAngle(p.angle);
  }

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">CSS Gradient Text Generator</h2>
            <p className="text-pink-100 text-xs">Create stunning gradient text effects with live preview</p>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-center min-h-[140px] flex items-center justify-center">
        <p
          style={gradientStyle}
          className="font-black break-words max-w-full"
        >
          {text || 'Your Text Here'}
        </p>
      </div>

      {/* Text Input */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <label className="text-xs font-bold text-slate-500 mb-2 block">Preview Text</label>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type your text..."
          className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-pink-500 outline-none"
        />
      </div>

      {/* Controls */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Colors */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-pink-500" /> Gradient Colors
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 mb-1 block">Start Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={colorFrom} onChange={e => setColorFrom(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                <input type="text" value={colorFrom} onChange={e => setColorFrom(e.target.value)} className="flex-1 px-2 py-1.5 text-xs font-mono border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 uppercase" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 mb-1 block">End Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={colorTo} onChange={e => setColorTo(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                <input type="text" value={colorTo} onChange={e => setColorTo(e.target.value)} className="flex-1 px-2 py-1.5 text-xs font-mono border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 uppercase" />
              </div>
            </div>
          </div>
          {/* Gradient preview bar */}
          <div className="h-3 rounded-full" style={{ background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})` }} />
        </div>

        {/* Angle & Size */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[10px] font-medium text-slate-400">Angle</label>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{angle}°</span>
            </div>
            <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(parseInt(e.target.value))} className="w-full accent-pink-500" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[10px] font-medium text-slate-400">Font Size</label>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{fontSize}px</span>
            </div>
            <input type="range" min={16} max={120} value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full accent-pink-500" />
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <p className="text-xs font-bold text-slate-500 mb-3">Gradient Presets — Click to Apply</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className={`p-2 rounded-lg border transition-all hover:scale-105 ${
                colorFrom === p.from && colorTo === p.to
                  ? 'border-pink-400 shadow-md scale-105'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="h-5 rounded-md mb-1.5" style={{ background: `linear-gradient(90deg, ${p.from}, ${p.to})` }} />
              <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center">{p.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div className="p-4 bg-slate-900 rounded-xl relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CSS Code</span>
          <button
            onClick={copy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              copied ? 'bg-green-600 text-white' : 'bg-pink-600 text-white hover:bg-pink-700'
            }`}
          >
            {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy CSS</>}
          </button>
        </div>
        <pre className="text-sm text-green-400 font-mono leading-relaxed overflow-x-auto">{cssCode}</pre>
      </div>
    </div>
  );
}
