'use client';

import { useState, useMemo, useCallback } from 'react';
import { LayoutGrid, Copy, Check, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';

type Direction = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
type AlignItems = 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
type AlignSelf = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

interface FlexItem { id: number; flexGrow: number; flexShrink: number; flexBasis: string; alignSelf: AlignSelf; order: number; }

const COLORS = ['#3b82f6','#ef4444','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#f97316','#6366f1','#14b8a6','#e11d48','#84cc16'];
const SIZES = [60, 80, 50, 100, 70, 90, 55, 85, 65, 75, 45, 95];

const PRESETS: { name: string; dir: Direction; justify: JustifyContent; align: AlignItems; wrap: FlexWrap; gap: number; count: number }[] = [
  { name: 'Navbar', dir: 'row', justify: 'space-between', align: 'center', wrap: 'nowrap', gap: 8, count: 4 },
  { name: 'Card Grid', dir: 'row', justify: 'flex-start', align: 'stretch', wrap: 'wrap', gap: 16, count: 6 },
  { name: 'Holy Grail', dir: 'row', justify: 'flex-start', align: 'stretch', wrap: 'nowrap', gap: 8, count: 3 },
  { name: 'Centered', dir: 'row', justify: 'center', align: 'center', wrap: 'nowrap', gap: 0, count: 1 },
  { name: 'Sidebar', dir: 'row', justify: 'flex-start', align: 'stretch', wrap: 'nowrap', gap: 0, count: 2 },
];

const defaultItem = (id: number): FlexItem => ({ id, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 });

function BtnGroup<T extends string>({ options, value, onChange, label }: { options: T[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-1">
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)}
            className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${value === o ? 'bg-cyan-500 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CssFlexboxGeneratorTool() {
  const [direction, setDirection] = useState<Direction>('row');
  const [justifyContent, setJustifyContent] = useState<JustifyContent>('flex-start');
  const [alignItems, setAlignItems] = useState<AlignItems>('stretch');
  const [flexWrap, setFlexWrap] = useState<FlexWrap>('nowrap');
  const [gap, setGap] = useState(8);
  const [items, setItems] = useState<FlexItem[]>(() => Array.from({ length: 4 }, (_, i) => defaultItem(i + 1)));
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const addItem = () => { if (items.length < 12) setItems(p => [...p, defaultItem(p.length + 1)]); };
  const removeItem = () => { if (items.length > 1) setItems(p => p.slice(0, -1)); };
  const updateItem = (id: number, key: keyof FlexItem, val: string | number) =>
    setItems(p => p.map(it => it.id === id ? { ...it, [key]: val } : it));

  const applyPreset = useCallback((preset: typeof PRESETS[0]) => {
    setDirection(preset.dir);
    setJustifyContent(preset.justify);
    setAlignItems(preset.align);
    setFlexWrap(preset.wrap);
    setGap(preset.gap);
    const newItems = Array.from({ length: preset.count }, (_, i) => {
      const item = defaultItem(i + 1);
      if (preset.name === 'Holy Grail') item.flexGrow = i === 1 ? 1 : 0;
      if (preset.name === 'Sidebar') item.flexGrow = i === 1 ? 1 : 0;
      if (preset.name === 'Card Grid') item.flexBasis = '30%';
      return item;
    });
    setItems(newItems);
    setExpandedItem(null);
  }, []);

  const containerCss = useMemo(() => {
    const lines = ['display: flex;', `flex-direction: ${direction};`, `justify-content: ${justifyContent};`, `align-items: ${alignItems};`, `flex-wrap: ${flexWrap};`];
    if (gap > 0) lines.push(`gap: ${gap}px;`);
    return lines.join('\n  ');
  }, [direction, justifyContent, alignItems, flexWrap, gap]);

  const itemsCss = useMemo(() => {
    const customItems = items.filter(it => it.flexGrow !== 0 || it.flexShrink !== 1 || it.flexBasis !== 'auto' || it.alignSelf !== 'auto' || it.order !== 0);
    if (customItems.length === 0) return '';
    return customItems.map(it => {
      const props: string[] = [];
      if (it.flexGrow !== 0) props.push(`flex-grow: ${it.flexGrow};`);
      if (it.flexShrink !== 1) props.push(`flex-shrink: ${it.flexShrink};`);
      if (it.flexBasis !== 'auto') props.push(`flex-basis: ${it.flexBasis};`);
      if (it.alignSelf !== 'auto') props.push(`align-self: ${it.alignSelf};`);
      if (it.order !== 0) props.push(`order: ${it.order};`);
      return `.item-${it.id} {\n  ${props.join('\n  ')}\n}`;
    }).join('\n\n');
  }, [items]);

  const fullCss = useMemo(() => {
    let css = `.container {\n  ${containerCss}\n}`;
    if (itemsCss) css += `\n\n${itemsCss}`;
    return css;
  }, [containerCss, itemsCss]);

  const copyCSS = async () => {
    await navigator.clipboard.writeText(fullCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightCss = (code: string) =>
    code.split('\n').map((line, i) => {
      const highlighted = line
        .replace(/([a-z-]+)(?=\s*:)/g, '<span class="text-cyan-400">$1</span>')
        .replace(/(:\s*)([^;]+)(;)/g, '$1<span class="text-amber-300">$2</span>$3');
      return <div key={i} dangerouslySetInnerHTML={{ __html: highlighted }} />;
    });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <LayoutGrid className="w-8 h-8" />
          <h1 className="text-2xl font-bold">CSS Flexbox Generator</h1>
        </div>
        <p className="text-blue-100 text-sm">Build flexbox layouts visually. Adjust properties, see instant preview, copy production-ready CSS.</p>
      </div>

      {/* Presets */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => applyPreset(p)}
              className="px-3 py-1.5 text-sm rounded-lg bg-gray-700 text-gray-200 hover:bg-cyan-600 hover:text-white transition-all font-medium">
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Panel */}
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 space-y-4">
            <h2 className="text-sm font-bold text-white">Container Properties</h2>
            <BtnGroup label="flex-direction" options={['row','row-reverse','column','column-reverse'] as Direction[]} value={direction} onChange={setDirection} />
            <BtnGroup label="justify-content" options={['flex-start','flex-end','center','space-between','space-around','space-evenly'] as JustifyContent[]} value={justifyContent} onChange={setJustifyContent} />
            <BtnGroup label="align-items" options={['stretch','flex-start','flex-end','center','baseline'] as AlignItems[]} value={alignItems} onChange={setAlignItems} />
            <BtnGroup label="flex-wrap" options={['nowrap','wrap','wrap-reverse'] as FlexWrap[]} value={flexWrap} onChange={setFlexWrap} />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">gap: {gap}px</label>
              <input type="range" min={0} max={40} value={gap} onChange={e => setGap(Number(e.target.value))}
                className="w-full accent-cyan-500" />
            </div>
          </div>

          {/* Items Controls */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Items ({items.length})</h2>
              <div className="flex gap-2">
                <button onClick={removeItem} disabled={items.length <= 1}
                  className="p-1.5 rounded-lg bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <Minus className="w-4 h-4" />
                </button>
                <button onClick={addItem} disabled={items.length >= 12}
                  className="p-1.5 rounded-lg bg-gray-700 text-gray-300 hover:bg-cyan-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              {items.map(it => (
                <div key={it.id} className="border border-gray-700 rounded-lg overflow-hidden">
                  <button onClick={() => setExpandedItem(expandedItem === it.id ? null : it.id)}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-700/50 transition-all">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[(it.id - 1) % COLORS.length] }} />
                      <span className="text-xs font-medium text-gray-300">Item {it.id}</span>
                    </span>
                    {expandedItem === it.id ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
                  </button>
                  {expandedItem === it.id && (
                    <div className="px-3 pb-3 grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-500">flex-grow</label>
                        <input type="number" min={0} max={10} value={it.flexGrow} onChange={e => updateItem(it.id, 'flexGrow', Number(e.target.value))}
                          className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500">flex-shrink</label>
                        <input type="number" min={0} max={10} value={it.flexShrink} onChange={e => updateItem(it.id, 'flexShrink', Number(e.target.value))}
                          className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500">flex-basis</label>
                        <input type="text" value={it.flexBasis} onChange={e => updateItem(it.id, 'flexBasis', e.target.value)}
                          className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="auto" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500">order</label>
                        <input type="number" min={-10} max={10} value={it.order} onChange={e => updateItem(it.id, 'order', Number(e.target.value))}
                          className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] text-gray-500">align-self</label>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {(['auto','flex-start','flex-end','center','baseline','stretch'] as AlignSelf[]).map(v => (
                            <button key={v} onClick={() => updateItem(it.id, 'alignSelf', v)}
                              className={`px-1.5 py-0.5 text-[10px] rounded ${it.alignSelf === v ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview + Code */}
        <div className="space-y-4">
          {/* Live Preview */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <h2 className="text-sm font-bold text-white mb-3">Live Preview</h2>
            <div className="bg-gray-900 rounded-lg p-3 min-h-[300px] border border-gray-700 overflow-auto"
              style={{ display: 'flex', flexDirection: direction, justifyContent, alignItems, flexWrap, gap: `${gap}px` }}>
              {items.map(it => (
                <div key={it.id}
                  style={{
                    backgroundColor: COLORS[(it.id - 1) % COLORS.length],
                    flexGrow: it.flexGrow, flexShrink: it.flexShrink,
                    flexBasis: it.flexBasis === 'auto' ? undefined : it.flexBasis,
                    alignSelf: it.alignSelf === 'auto' ? undefined : it.alignSelf,
                    order: it.order,
                    minWidth: direction.startsWith('row') ? SIZES[(it.id - 1) % SIZES.length] : undefined,
                    minHeight: direction.startsWith('column') ? SIZES[(it.id - 1) % SIZES.length] : 40,
                    padding: '8px 12px',
                  }}
                  className="rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {it.id}
                </div>
              ))}
            </div>
          </div>

          {/* Generated CSS */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white">Generated CSS</h2>
              <button onClick={copyCSS}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-all">
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy CSS</>}
              </button>
            </div>
            <pre className="bg-gray-900 rounded-lg p-4 text-xs font-mono text-gray-300 overflow-x-auto border border-gray-700 leading-relaxed">
              {highlightCss(fullCss)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
