'use client';

import { useState, useEffect, useCallback } from 'react';
import { Type, Copy, Check } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GradientSettings { color1: string; color2: string; direction: string }
interface NeonSettings { textColor: string; glowColor: string; intensity: number }
interface ThreeDSettings { color: string; depth: number; shadowColor: string }
interface OutlineSettings { strokeColor: string; strokeWidth: number; fillColor: string; transparent: boolean }
interface ShadowSettings { offsetX: number; offsetY: number; blur: number; color: string }
interface RetroSettings { mainColor: string; shadow1: string; shadow2: string }
interface FireSettings { speed: number }
interface IceSettings { speed: number }
interface MetallicSettings { lightColor: string; darkColor: string }
interface RainbowSettings { speed: number }

// ─── Google Fonts ─────────────────────────────────────────────────────────────

const FONTS = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Playfair Display', value: 'Playfair+Display' },
  { label: 'Oswald', value: 'Oswald' },
  { label: 'Raleway', value: 'Raleway' },
  { label: 'Merriweather', value: 'Merriweather' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Nunito', value: 'Nunito' },
];

// ─── CSS Generators ───────────────────────────────────────────────────────────

const DIRECTION_MAP: Record<string, string> = {
  'left-right': 'to right',
  'top-bottom': 'to bottom',
  'diagonal': '135deg',
};

function gradientCSS(s: GradientSettings, font: string, size: number): string {
  const dir = DIRECTION_MAP[s.direction] ?? 'to right';
  return `font-family: '${font}', sans-serif;\nfont-size: ${size}px;\nbackground: linear-gradient(${dir}, ${s.color1}, ${s.color2});\n-webkit-background-clip: text;\n-webkit-text-fill-color: transparent;\nbackground-clip: text;\ncolor: transparent;`;
}

function neonCSS(s: NeonSettings, font: string, size: number): string {
  const i = s.intensity;
  const g = s.glowColor;
  return `font-family: '${font}', sans-serif;\nfont-size: ${size}px;\ncolor: ${s.textColor};\ntext-shadow:\n  0 0 ${4 * i}px ${g},\n  0 0 ${8 * i}px ${g},\n  0 0 ${16 * i}px ${g},\n  0 0 ${32 * i}px ${g},\n  0 0 ${64 * i}px ${g};`;
}

function threeDCSS(s: ThreeDSettings, font: string, size: number): string {
  const shadows = Array.from({ length: s.depth }, (_, i) => {
    const o = i + 1;
    return `${o}px ${o}px 0 ${s.shadowColor}`;
  }).join(',\n  ');
  return `font-family: '${font}', sans-serif;\nfont-size: ${size}px;\ncolor: ${s.color};\ntext-shadow:\n  ${shadows};`;
}

function outlineCSS(s: OutlineSettings, font: string, size: number): string {
  return `font-family: '${font}', sans-serif;\nfont-size: ${size}px;\n-webkit-text-stroke: ${s.strokeWidth}px ${s.strokeColor};\ncolor: ${s.transparent ? 'transparent' : s.fillColor};`;
}

function shadowCSS(s: ShadowSettings, font: string, size: number): string {
  return `font-family: '${font}', sans-serif;\nfont-size: ${size}px;\ncolor: #f1f5f9;\ntext-shadow: ${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.color};`;
}

function retroCSS(s: RetroSettings, font: string, size: number): string {
  return `font-family: '${font}', sans-serif;\nfont-size: ${size}px;\ncolor: ${s.mainColor};\ntext-shadow:\n  3px 3px 0 ${s.shadow1},\n  6px 6px 0 ${s.shadow2},\n  9px 9px 0 rgba(0,0,0,0.2);`;
}

const FIRE_KEYFRAMES = `@keyframes fire {\n  0%   { text-shadow: 0 0 4px #fff, 0 -4px 8px #ff0, 0 -8px 16px #ff8c00, 0 -12px 24px #f00; }\n  50%  { text-shadow: 0 0 6px #fff, 0 -6px 12px #ff0, 0 -12px 20px #ff8c00, 0 -18px 30px #f00; }\n  100% { text-shadow: 0 0 4px #fff, 0 -4px 8px #ff0, 0 -8px 16px #ff8c00, 0 -12px 24px #f00; }\n}`;

function fireCSS(s: FireSettings, font: string, size: number): string {
  return `${FIRE_KEYFRAMES}\n\n.fire-text {\n  font-family: '${font}', sans-serif;\n  font-size: ${size}px;\n  color: #fff;\n  animation: fire ${(1.5 / s.speed).toFixed(1)}s ease-in-out infinite;\n}`;
}

const ICE_KEYFRAMES = `@keyframes ice {\n  0%   { text-shadow: 0 0 4px #fff, 0 0 10px #a8e6ff, 0 0 20px #0af, 0 0 40px #0088ff; }\n  50%  { text-shadow: 0 0 8px #fff, 0 0 16px #c8f0ff, 0 0 32px #0af, 0 0 60px #0088ff; }\n  100% { text-shadow: 0 0 4px #fff, 0 0 10px #a8e6ff, 0 0 20px #0af, 0 0 40px #0088ff; }\n}`;

function iceCSS(s: IceSettings, font: string, size: number): string {
  return `${ICE_KEYFRAMES}\n\n.ice-text {\n  font-family: '${font}', sans-serif;\n  font-size: ${size}px;\n  color: #e0f7ff;\n  animation: ice ${(2 / s.speed).toFixed(1)}s ease-in-out infinite;\n}`;
}

function metallicCSS(s: MetallicSettings, font: string, size: number): string {
  return `font-family: '${font}', sans-serif;\nfont-size: ${size}px;\nbackground: linear-gradient(\n  180deg,\n  ${s.lightColor} 0%,\n  ${s.darkColor} 25%,\n  ${s.lightColor} 50%,\n  ${s.darkColor} 75%,\n  ${s.lightColor} 100%\n);\n-webkit-background-clip: text;\n-webkit-text-fill-color: transparent;\nbackground-clip: text;\ncolor: transparent;`;
}

const RAINBOW_KEYFRAMES = `@keyframes rainbow {\n  0%   { background-position: 0% 50%; }\n  50%  { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}`;

function rainbowCSS(s: RainbowSettings, font: string, size: number): string {
  return `${RAINBOW_KEYFRAMES}\n\n.rainbow-text {\n  font-family: '${font}', sans-serif;\n  font-size: ${size}px;\n  background: linear-gradient(\n    90deg,\n    #ff0000, #ff7700, #ffff00,\n    #00ff00, #0000ff, #8b00ff, #ff0000\n  );\n  background-size: 300% 300%;\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n  color: transparent;\n  animation: rainbow ${(4 / s.speed).toFixed(1)}s linear infinite;\n}`;
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-indigo-600 text-slate-700 dark:text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors shrink-0"
    >
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy CSS'}
    </button>
  );
}

// ─── Color Input ──────────────────────────────────────────────────────────────

function ColorInput({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs text-slate-500 w-20 shrink-0">{label}</span>
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent p-0.5"
        />
      </div>
      <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{value}</span>
    </label>
  );
}

function Slider({
  label, min, max, step = 1, value, onChange, unit = '',
}: {
  label: string; min: number; max: number; step?: number;
  value: number; onChange: (v: number) => void; unit?: string;
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-20 shrink-0">{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-indigo-500 h-1.5"
      />
      <span className="text-xs font-mono text-indigo-600 dark:text-indigo-300 w-12 text-right">
        {value}{unit}
      </span>
    </label>
  );
}

// ─── Effect Panel ─────────────────────────────────────────────────────────────

function EffectPanel({
  title, previewStyle, previewText, fontSize, cssCode, children,
}: {
  title: string;
  previewStyle: React.CSSProperties;
  previewText: string;
  fontSize: number;
  cssCode: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700/60">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</span>
        <CopyButton value={cssCode} />
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center min-h-[100px] px-4 py-6 bg-slate-100 dark:bg-slate-950/60">
        <span style={{ ...previewStyle, fontSize: `${fontSize}px` }}>
          {previewText}
        </span>
      </div>

      {/* Controls */}
      {children && (
        <div className="px-4 pb-4 pt-2 space-y-3 border-t border-slate-200 dark:border-slate-800/60">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Animated Preview Components ─────────────────────────────────────────────

function AnimatedFireText({ text, fontSize, fontFamily, speed }: {
  text: string; fontSize: number; fontFamily: string; speed: number;
}) {
  return (
    <>
      <style>{`
        @keyframes ta-fire {
          0%   { text-shadow: 0 0 4px #fff, 0 -4px 8px #ff0, 0 -8px 16px #ff8c00, 0 -12px 24px #f00; }
          50%  { text-shadow: 0 0 6px #fff, 0 -6px 12px #ff0, 0 -12px 20px #ff8c00, 0 -18px 30px #f00; }
          100% { text-shadow: 0 0 4px #fff, 0 -4px 8px #ff0, 0 -8px 16px #ff8c00, 0 -12px 24px #f00; }
        }
      `}</style>
      <span
        style={{
          fontFamily: `'${fontFamily}', sans-serif`,
          fontSize: `${fontSize}px`,
          color: '#fff',
          animation: `ta-fire ${(1.5 / speed).toFixed(1)}s ease-in-out infinite`,
        }}
      >
        {text}
      </span>
    </>
  );
}

function AnimatedIceText({ text, fontSize, fontFamily, speed }: {
  text: string; fontSize: number; fontFamily: string; speed: number;
}) {
  return (
    <>
      <style>{`
        @keyframes ta-ice {
          0%   { text-shadow: 0 0 4px #fff, 0 0 10px #a8e6ff, 0 0 20px #0af, 0 0 40px #0088ff; }
          50%  { text-shadow: 0 0 8px #fff, 0 0 16px #c8f0ff, 0 0 32px #0af, 0 0 60px #0088ff; }
          100% { text-shadow: 0 0 4px #fff, 0 0 10px #a8e6ff, 0 0 20px #0af, 0 0 40px #0088ff; }
        }
      `}</style>
      <span
        style={{
          fontFamily: `'${fontFamily}', sans-serif`,
          fontSize: `${fontSize}px`,
          color: '#e0f7ff',
          animation: `ta-ice ${(2 / speed).toFixed(1)}s ease-in-out infinite`,
        }}
      >
        {text}
      </span>
    </>
  );
}

function AnimatedRainbowText({ text, fontSize, fontFamily, speed }: {
  text: string; fontSize: number; fontFamily: string; speed: number;
}) {
  return (
    <>
      <style>{`
        @keyframes ta-rainbow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .ta-rainbow-text {
          background: linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      <span
        className="ta-rainbow-text"
        style={{
          fontFamily: `'${fontFamily}', sans-serif`,
          fontSize: `${fontSize}px`,
          animation: `ta-rainbow ${(4 / speed).toFixed(1)}s linear infinite`,
        }}
      >
        {text}
      </span>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CssTextEffectsGeneratorTool() {
  const [previewText, setPreviewText] = useState('ToolsArena');
  const [fontSize, setFontSize] = useState(56);
  const [fontFamily, setFontFamily] = useState('Poppins');

  const [gradient, setGradient] = useState<GradientSettings>({ color1: '#6366f1', color2: '#ec4899', direction: 'left-right' });
  const [neon, setNeon] = useState<NeonSettings>({ textColor: '#ffffff', glowColor: '#a78bfa', intensity: 2 });
  const [threeD, setThreeD] = useState<ThreeDSettings>({ color: '#f1f5f9', depth: 6, shadowColor: '#4338ca' });
  const [outline, setOutline] = useState<OutlineSettings>({ strokeColor: '#6366f1', strokeWidth: 2, fillColor: 'transparent', transparent: true });
  const [shadow, setShadow] = useState<ShadowSettings>({ offsetX: 4, offsetY: 4, blur: 8, color: '#6366f1' });
  const [retro, setRetro] = useState<RetroSettings>({ mainColor: '#fbbf24', shadow1: '#f59e0b', shadow2: '#92400e' });
  const [fire, setFire] = useState<FireSettings>({ speed: 1 });
  const [ice, setIce] = useState<IceSettings>({ speed: 1 });
  const [metallic, setMetallic] = useState<MetallicSettings>({ lightColor: '#e2e8f0', darkColor: '#64748b' });
  const [rainbow, setRainbow] = useState<RainbowSettings>({ speed: 1 });

  useEffect(() => {
    const fontSlug = FONTS.find((f) => f.label === fontFamily)?.value ?? fontFamily;
    const id = `gfont-${fontSlug}`;
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontSlug}:wght@400;700&display=swap`;
      document.head.appendChild(link);
    }
  }, [fontFamily]);

  const text = previewText || 'ToolsArena';
  const baseStyle = { fontFamily: `'${fontFamily}', sans-serif`, fontSize: `${fontSize}px` };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <Type className="text-indigo-600 dark:text-indigo-400" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">CSS Text Effects Generator</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Live preview + one-click CSS copy</p>
        </div>
      </div>

      {/* Global Controls */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1.5">Preview Text</label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="ToolsArena"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div className="sm:w-52">
            <label className="block text-xs text-slate-500 mb-1.5">Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
            >
              {FONTS.map((f) => (
                <option key={f.value} value={f.label}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>
        <Slider label="Font Size" min={24} max={120} value={fontSize} onChange={setFontSize} unit="px" />
      </div>

      {/* Effects Grid */}
      <div className="grid grid-cols-1 gap-4">
        <EffectPanel title="1. Gradient Text" previewText={text} fontSize={fontSize} cssCode={gradientCSS(gradient, fontFamily, fontSize)} previewStyle={{ ...baseStyle, background: `linear-gradient(${DIRECTION_MAP[gradient.direction]}, ${gradient.color1}, ${gradient.color2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          <div className="flex flex-wrap gap-4">
            <ColorInput label="Color 1" value={gradient.color1} onChange={(v) => setGradient({ ...gradient, color1: v })} />
            <ColorInput label="Color 2" value={gradient.color2} onChange={(v) => setGradient({ ...gradient, color2: v })} />
            <label className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Direction</span>
              <select value={gradient.direction} onChange={(e) => setGradient({ ...gradient, direction: e.target.value })} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200">
                <option value="left-right">Left → Right</option>
                <option value="top-bottom">Top → Bottom</option>
                <option value="diagonal">Diagonal</option>
              </select>
            </label>
          </div>
        </EffectPanel>

        <EffectPanel title="2. Neon Glow" previewText={text} fontSize={fontSize} cssCode={neonCSS(neon, fontFamily, fontSize)} previewStyle={{ ...baseStyle, color: neon.textColor, textShadow: [`0 0 ${4*neon.intensity}px ${neon.glowColor}`,`0 0 ${8*neon.intensity}px ${neon.glowColor}`,`0 0 ${16*neon.intensity}px ${neon.glowColor}`,`0 0 ${32*neon.intensity}px ${neon.glowColor}`,`0 0 ${64*neon.intensity}px ${neon.glowColor}`].join(', ') }}>
          <div className="flex flex-wrap gap-4">
            <ColorInput label="Text Color" value={neon.textColor} onChange={(v) => setNeon({ ...neon, textColor: v })} />
            <ColorInput label="Glow Color" value={neon.glowColor} onChange={(v) => setNeon({ ...neon, glowColor: v })} />
          </div>
          <Slider label="Intensity" min={1} max={5} value={neon.intensity} onChange={(v) => setNeon({ ...neon, intensity: v })} />
        </EffectPanel>

        <EffectPanel title="3. 3D Text" previewText={text} fontSize={fontSize} cssCode={threeDCSS(threeD, fontFamily, fontSize)} previewStyle={{ ...baseStyle, color: threeD.color, textShadow: Array.from({ length: threeD.depth }, (_, i) => `${i+1}px ${i+1}px 0 ${threeD.shadowColor}`).join(', ') }}>
          <div className="flex flex-wrap gap-4">
            <ColorInput label="Text Color" value={threeD.color} onChange={(v) => setThreeD({ ...threeD, color: v })} />
            <ColorInput label="Shadow" value={threeD.shadowColor} onChange={(v) => setThreeD({ ...threeD, shadowColor: v })} />
          </div>
          <Slider label="Depth" min={2} max={16} value={threeD.depth} onChange={(v) => setThreeD({ ...threeD, depth: v })} unit="px" />
        </EffectPanel>

        <EffectPanel title="4. Outlined / Stroke" previewText={text} fontSize={fontSize} cssCode={outlineCSS(outline, fontFamily, fontSize)} previewStyle={{ ...baseStyle, WebkitTextStroke: `${outline.strokeWidth}px ${outline.strokeColor}`, color: outline.transparent ? 'transparent' : outline.fillColor }}>
          <div className="flex flex-wrap gap-4">
            <ColorInput label="Stroke" value={outline.strokeColor} onChange={(v) => setOutline({ ...outline, strokeColor: v })} />
            {!outline.transparent && <ColorInput label="Fill" value={outline.fillColor} onChange={(v) => setOutline({ ...outline, fillColor: v })} />}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={outline.transparent} onChange={(e) => setOutline({ ...outline, transparent: e.target.checked })} className="accent-indigo-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Transparent fill</span>
            </label>
          </div>
          <Slider label="Width" min={1} max={8} value={outline.strokeWidth} onChange={(v) => setOutline({ ...outline, strokeWidth: v })} unit="px" />
        </EffectPanel>

        <EffectPanel title="5. Shadow Text" previewText={text} fontSize={fontSize} cssCode={shadowCSS(shadow, fontFamily, fontSize)} previewStyle={{ ...baseStyle, color: '#f1f5f9', textShadow: `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.color}` }}>
          <div className="flex flex-wrap gap-4"><ColorInput label="Color" value={shadow.color} onChange={(v) => setShadow({ ...shadow, color: v })} /></div>
          <Slider label="Offset X" min={-20} max={20} value={shadow.offsetX} onChange={(v) => setShadow({ ...shadow, offsetX: v })} unit="px" />
          <Slider label="Offset Y" min={-20} max={20} value={shadow.offsetY} onChange={(v) => setShadow({ ...shadow, offsetY: v })} unit="px" />
          <Slider label="Blur" min={0} max={40} value={shadow.blur} onChange={(v) => setShadow({ ...shadow, blur: v })} unit="px" />
        </EffectPanel>

        <EffectPanel title="6. Retro / Vintage" previewText={text} fontSize={fontSize} cssCode={retroCSS(retro, fontFamily, fontSize)} previewStyle={{ ...baseStyle, color: retro.mainColor, textShadow: `3px 3px 0 ${retro.shadow1}, 6px 6px 0 ${retro.shadow2}, 9px 9px 0 rgba(0,0,0,0.2)` }}>
          <div className="flex flex-wrap gap-4">
            <ColorInput label="Main" value={retro.mainColor} onChange={(v) => setRetro({ ...retro, mainColor: v })} />
            <ColorInput label="Shadow 1" value={retro.shadow1} onChange={(v) => setRetro({ ...retro, shadow1: v })} />
            <ColorInput label="Shadow 2" value={retro.shadow2} onChange={(v) => setRetro({ ...retro, shadow2: v })} />
          </div>
        </EffectPanel>

        <EffectPanel title="7. Fire Effect" previewText={text} fontSize={fontSize} cssCode={fireCSS(fire, fontFamily, fontSize)} previewStyle={{}}>
          <AnimatedFireText text={text} fontSize={fontSize} fontFamily={fontFamily} speed={fire.speed} />
          <Slider label="Speed" min={0.5} max={3} step={0.5} value={fire.speed} onChange={(v) => setFire({ speed: v })} unit="x" />
        </EffectPanel>

        <EffectPanel title="8. Ice / Frozen" previewText={text} fontSize={fontSize} cssCode={iceCSS(ice, fontFamily, fontSize)} previewStyle={{}}>
          <AnimatedIceText text={text} fontSize={fontSize} fontFamily={fontFamily} speed={ice.speed} />
          <Slider label="Speed" min={0.5} max={3} step={0.5} value={ice.speed} onChange={(v) => setIce({ speed: v })} unit="x" />
        </EffectPanel>

        <EffectPanel title="9. Metallic / Chrome" previewText={text} fontSize={fontSize} cssCode={metallicCSS(metallic, fontFamily, fontSize)} previewStyle={{ ...baseStyle, background: `linear-gradient(180deg, ${metallic.lightColor} 0%, ${metallic.darkColor} 25%, ${metallic.lightColor} 50%, ${metallic.darkColor} 75%, ${metallic.lightColor} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          <div className="flex flex-wrap gap-4">
            <ColorInput label="Light" value={metallic.lightColor} onChange={(v) => setMetallic({ ...metallic, lightColor: v })} />
            <ColorInput label="Dark" value={metallic.darkColor} onChange={(v) => setMetallic({ ...metallic, darkColor: v })} />
          </div>
        </EffectPanel>

        <EffectPanel title="10. Rainbow Animated" previewText={text} fontSize={fontSize} cssCode={rainbowCSS(rainbow, fontFamily, fontSize)} previewStyle={{}}>
          <AnimatedRainbowText text={text} fontSize={fontSize} fontFamily={fontFamily} speed={rainbow.speed} />
          <Slider label="Speed" min={0.5} max={4} step={0.5} value={rainbow.speed} onChange={(v) => setRainbow({ speed: v })} unit="x" />
        </EffectPanel>
      </div>
    </div>
  );
}
