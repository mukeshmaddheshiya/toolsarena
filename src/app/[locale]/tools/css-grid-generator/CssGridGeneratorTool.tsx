'use client';

import { useState, useMemo, useCallback } from 'react';
import { Grid3X3, Copy, Check, RotateCcw, Plus, Trash2, ShieldCheck, Columns3, Rows3 } from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────── */
type JustifyItems = 'start' | 'end' | 'center' | 'stretch';
type AlignItems = 'start' | 'end' | 'center' | 'stretch';
type JustifyContent = 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
type AlignContent = 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
type GapUnit = 'px' | 'rem';

interface GridItem {
  id: number;
  label: string;
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
}

interface Preset {
  name: string;
  cols: string;
  rows: string;
  colGap: number;
  rowGap: number;
  gapUnit: GapUnit;
  justifyItems: JustifyItems;
  alignItems: AlignItems;
  justifyContent: JustifyContent;
  alignContent: AlignContent;
  items: Omit<GridItem, 'id'>[];
}

/* ─── Constants ──────────────────────────────────────────────────────── */
const CELL_COLORS = [
  'bg-cyan-500/80', 'bg-teal-500/80', 'bg-emerald-500/80', 'bg-sky-500/80',
  'bg-indigo-500/80', 'bg-violet-500/80', 'bg-pink-500/80', 'bg-amber-500/80',
  'bg-rose-500/80', 'bg-lime-500/80', 'bg-fuchsia-500/80', 'bg-orange-500/80',
];

const PRESETS: Preset[] = [
  {
    name: 'Holy Grail',
    cols: '200px 1fr 200px', rows: 'auto 1fr auto',
    colGap: 8, rowGap: 8, gapUnit: 'px',
    justifyItems: 'stretch', alignItems: 'stretch', justifyContent: 'stretch', alignContent: 'stretch',
    items: [
      { label: 'Header', colStart: 1, colSpan: 3, rowStart: 1, rowSpan: 1 },
      { label: 'Sidebar', colStart: 1, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { label: 'Main', colStart: 2, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { label: 'Aside', colStart: 3, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { label: 'Footer', colStart: 1, colSpan: 3, rowStart: 3, rowSpan: 1 },
    ],
  },
  {
    name: 'Dashboard',
    cols: '1fr 1fr 1fr', rows: 'auto 1fr 1fr',
    colGap: 12, rowGap: 12, gapUnit: 'px',
    justifyItems: 'stretch', alignItems: 'stretch', justifyContent: 'stretch', alignContent: 'stretch',
    items: [
      { label: 'Top Bar', colStart: 1, colSpan: 3, rowStart: 1, rowSpan: 1 },
      { label: 'Chart', colStart: 1, colSpan: 2, rowStart: 2, rowSpan: 1 },
      { label: 'Stats', colStart: 3, colSpan: 1, rowStart: 2, rowSpan: 2 },
      { label: 'Table', colStart: 1, colSpan: 2, rowStart: 3, rowSpan: 1 },
    ],
  },
  {
    name: 'Gallery',
    cols: 'repeat(3, 1fr)', rows: 'repeat(3, 1fr)',
    colGap: 8, rowGap: 8, gapUnit: 'px',
    justifyItems: 'stretch', alignItems: 'stretch', justifyContent: 'stretch', alignContent: 'stretch',
    items: [
      { label: 'Hero', colStart: 1, colSpan: 2, rowStart: 1, rowSpan: 2 },
      { label: 'Img 1', colStart: 3, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { label: 'Img 2', colStart: 3, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { label: 'Img 3', colStart: 1, colSpan: 1, rowStart: 3, rowSpan: 1 },
      { label: 'Img 4', colStart: 2, colSpan: 1, rowStart: 3, rowSpan: 1 },
      { label: 'Img 5', colStart: 3, colSpan: 1, rowStart: 3, rowSpan: 1 },
    ],
  },
  {
    name: 'Blog',
    cols: '1fr 300px', rows: 'auto 1fr auto',
    colGap: 16, rowGap: 16, gapUnit: 'px',
    justifyItems: 'stretch', alignItems: 'stretch', justifyContent: 'stretch', alignContent: 'stretch',
    items: [
      { label: 'Header', colStart: 1, colSpan: 2, rowStart: 1, rowSpan: 1 },
      { label: 'Article', colStart: 1, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { label: 'Sidebar', colStart: 2, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { label: 'Footer', colStart: 1, colSpan: 2, rowStart: 3, rowSpan: 1 },
    ],
  },
  {
    name: '2-Column',
    cols: '1fr 1fr', rows: '1fr',
    colGap: 16, rowGap: 0, gapUnit: 'px',
    justifyItems: 'stretch', alignItems: 'stretch', justifyContent: 'stretch', alignContent: 'stretch',
    items: [
      { label: 'Left', colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { label: 'Right', colStart: 2, colSpan: 1, rowStart: 1, rowSpan: 1 },
    ],
  },
  {
    name: '3-Column',
    cols: '1fr 1fr 1fr', rows: '1fr',
    colGap: 16, rowGap: 0, gapUnit: 'px',
    justifyItems: 'stretch', alignItems: 'stretch', justifyContent: 'stretch', alignContent: 'stretch',
    items: [
      { label: 'Col 1', colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { label: 'Col 2', colStart: 2, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { label: 'Col 3', colStart: 3, colSpan: 1, rowStart: 1, rowSpan: 1 },
    ],
  },
  {
    name: '4-Column',
    cols: 'repeat(4, 1fr)', rows: '1fr',
    colGap: 12, rowGap: 0, gapUnit: 'px',
    justifyItems: 'stretch', alignItems: 'stretch', justifyContent: 'stretch', alignContent: 'stretch',
    items: [
      { label: 'Col 1', colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { label: 'Col 2', colStart: 2, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { label: 'Col 3', colStart: 3, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { label: 'Col 4', colStart: 4, colSpan: 1, rowStart: 1, rowSpan: 1 },
    ],
  },
];

const JUSTIFY_ITEMS_OPTS: JustifyItems[] = ['start', 'end', 'center', 'stretch'];
const ALIGN_ITEMS_OPTS: AlignItems[] = ['start', 'end', 'center', 'stretch'];
const JUSTIFY_CONTENT_OPTS: JustifyContent[] = ['start', 'end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly'];
const ALIGN_CONTENT_OPTS: AlignContent[] = ['start', 'end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly'];

/* ─── Helper: Button group ───────────────────────────────────────────── */
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

/* ─── Helper: number input ───────────────────────────────────────────── */
function NumberInput({ label, value, onChange, min = 0, max = 200 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      <input type="number" min={min} max={max} value={value}
        onChange={e => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))}
        className="w-full px-3 py-1.5 rounded-md bg-gray-700 text-white text-sm border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
    </div>
  );
}

/* ─── Syntax highlighting for code ───────────────────────────────────── */
function highlightCSS(code: string) {
  return code.split('\n').map((line, i) => {
    const colored = line
      .replace(/(\/\*.*?\*\/)/g, '<span class="text-gray-500">$1</span>')
      .replace(/([a-z-]+)(\s*:\s*)/g, '<span class="text-cyan-400">$1</span><span class="text-gray-400">$2</span>')
      .replace(/(:\s*)([^;]+)(;)/g, '$1<span class="text-amber-300">$2</span><span class="text-gray-400">$3</span>')
      .replace(/(\.[\w-]+)/g, '<span class="text-teal-300">$1</span>');
    return <div key={i} dangerouslySetInnerHTML={{ __html: colored }} />;
  });
}

function highlightHTML(code: string) {
  return code.split('\n').map((line, i) => {
    const colored = line
      .replace(/(&lt;|<)(\/?\w+)/g, '<span class="text-rose-400">$1$2</span>')
      .replace(/(class)(=)(".*?")/g, '<span class="text-amber-300">$1</span><span class="text-gray-400">$2</span><span class="text-emerald-300">$3</span>')
      .replace(/(style)(=)(".*?")/g, '<span class="text-amber-300">$1</span><span class="text-gray-400">$2</span><span class="text-emerald-300">$3</span>')
      .replace(/(>)/g, '<span class="text-rose-400">$1</span>');
    return <div key={i} dangerouslySetInnerHTML={{ __html: colored }} />;
  });
}

/* ─── Main Component ─────────────────────────────────────────────────── */
let nextId = 1;

export function CssGridGeneratorTool() {
  const [colsTemplate, setColsTemplate] = useState('1fr 1fr 1fr');
  const [rowsTemplate, setRowsTemplate] = useState('1fr 1fr');
  const [colGap, setColGap] = useState(12);
  const [rowGap, setRowGap] = useState(12);
  const [gapUnit, setGapUnit] = useState<GapUnit>('px');
  const [justifyItems, setJustifyItems] = useState<JustifyItems>('stretch');
  const [alignItems, setAlignItems] = useState<AlignItems>('stretch');
  const [justifyContent, setJustifyContent] = useState<JustifyContent>('stretch');
  const [alignContent, setAlignContent] = useState<AlignContent>('stretch');
  const [items, setItems] = useState<GridItem[]>(() => {
    const initial: GridItem[] = [];
    for (let r = 1; r <= 2; r++) {
      for (let c = 1; c <= 3; c++) {
        initial.push({ id: nextId++, label: `Item ${initial.length + 1}`, colStart: c, colSpan: 1, rowStart: r, rowSpan: 1 });
      }
    }
    return initial;
  });
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [copiedHTML, setCopiedHTML] = useState(false);
  const [codeTab, setCodeTab] = useState<'css' | 'html'>('css');

  /* ─── Derived column/row counts for display ────────────────────────── */
  const colCount = useMemo(() => {
    const tpl = colsTemplate.trim();
    const repeatMatch = tpl.match(/^repeat\((\d+)/);
    if (repeatMatch) return parseInt(repeatMatch[1], 10);
    return tpl.split(/\s+/).filter(Boolean).length;
  }, [colsTemplate]);

  const rowCount = useMemo(() => {
    const tpl = rowsTemplate.trim();
    const repeatMatch = tpl.match(/^repeat\((\d+)/);
    if (repeatMatch) return parseInt(repeatMatch[1], 10);
    return tpl.split(/\s+/).filter(Boolean).length;
  }, [rowsTemplate]);

  /* ─── Actions ──────────────────────────────────────────────────────── */
  const addItem = useCallback(() => {
    setItems(prev => [...prev, { id: nextId++, label: `Item ${prev.length + 1}`, colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1 }]);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems(prev => prev.filter(it => it.id !== id));
    setSelectedItem(prev => prev === id ? null : prev);
  }, []);

  const updateItem = useCallback((id: number, key: keyof GridItem, val: string | number) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [key]: val } : it));
  }, []);

  const applyPreset = useCallback((preset: Preset) => {
    setColsTemplate(preset.cols);
    setRowsTemplate(preset.rows);
    setColGap(preset.colGap);
    setRowGap(preset.rowGap);
    setGapUnit(preset.gapUnit);
    setJustifyItems(preset.justifyItems);
    setAlignItems(preset.alignItems);
    setJustifyContent(preset.justifyContent);
    setAlignContent(preset.alignContent);
    setItems(preset.items.map((it, i) => ({ ...it, id: nextId++ })));
    setSelectedItem(null);
  }, []);

  const reset = useCallback(() => {
    setColsTemplate('1fr 1fr 1fr');
    setRowsTemplate('1fr 1fr');
    setColGap(12);
    setRowGap(12);
    setGapUnit('px');
    setJustifyItems('stretch');
    setAlignItems('stretch');
    setJustifyContent('stretch');
    setAlignContent('stretch');
    const initial: GridItem[] = [];
    for (let r = 1; r <= 2; r++) {
      for (let c = 1; c <= 3; c++) {
        initial.push({ id: nextId++, label: `Item ${initial.length + 1}`, colStart: c, colSpan: 1, rowStart: r, rowSpan: 1 });
      }
    }
    setItems(initial);
    setSelectedItem(null);
  }, []);

  /* ─── Generated CSS ────────────────────────────────────────────────── */
  const cssCode = useMemo(() => {
    const lines = ['.grid-container {', '  display: grid;'];
    lines.push(`  grid-template-columns: ${colsTemplate};`);
    lines.push(`  grid-template-rows: ${rowsTemplate};`);
    if (colGap > 0 || rowGap > 0) {
      if (colGap === rowGap) {
        lines.push(`  gap: ${colGap}${gapUnit};`);
      } else {
        lines.push(`  row-gap: ${rowGap}${gapUnit};`);
        lines.push(`  column-gap: ${colGap}${gapUnit};`);
      }
    }
    if (justifyItems !== 'stretch') lines.push(`  justify-items: ${justifyItems};`);
    if (alignItems !== 'stretch') lines.push(`  align-items: ${alignItems};`);
    if (justifyContent !== 'stretch') lines.push(`  justify-content: ${justifyContent};`);
    if (alignContent !== 'stretch') lines.push(`  align-content: ${alignContent};`);
    lines.push('}');

    items.forEach((item, idx) => {
      const hasSpan = item.colSpan > 1 || item.rowSpan > 1 || item.colStart > 1 || item.rowStart > 1;
      if (hasSpan) {
        lines.push('');
        lines.push(`.item-${idx + 1} {`);
        if (item.colStart > 1 || item.colSpan > 1) {
          lines.push(`  grid-column: ${item.colStart} / span ${item.colSpan};`);
        }
        if (item.rowStart > 1 || item.rowSpan > 1) {
          lines.push(`  grid-row: ${item.rowStart} / span ${item.rowSpan};`);
        }
        lines.push('}');
      }
    });

    return lines.join('\n');
  }, [colsTemplate, rowsTemplate, colGap, rowGap, gapUnit, justifyItems, alignItems, justifyContent, alignContent, items]);

  /* ─── Generated HTML ───────────────────────────────────────────────── */
  const htmlCode = useMemo(() => {
    const lines = ['<div class="grid-container">'];
    items.forEach((item, idx) => {
      lines.push(`  <div class="item-${idx + 1}">${item.label}</div>`);
    });
    lines.push('</div>');
    return lines.join('\n');
  }, [items]);

  /* ─── Copy handlers ────────────────────────────────────────────────── */
  const copyCSS = useCallback(() => {
    navigator.clipboard.writeText(cssCode);
    setCopiedCSS(true);
    setTimeout(() => setCopiedCSS(false), 2000);
  }, [cssCode]);

  const copyHTML = useCallback(() => {
    navigator.clipboard.writeText(htmlCode);
    setCopiedHTML(true);
    setTimeout(() => setCopiedHTML(false), 2000);
  }, [htmlCode]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 rounded-xl">
            <Grid3X3 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">CSS Grid Generator</h2>
            <p className="text-sm text-gray-400">Visual CSS Grid layout builder with live code output</p>
          </div>
        </div>
        <button onClick={reset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Preset layouts */}
      <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Preset Layouts</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => applyPreset(p)}
              className="px-3 py-1.5 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all border border-gray-600 hover:border-cyan-500/40">
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ─── LEFT: Controls ────────────────────────────────────────── */}
        <div className="xl:col-span-1 space-y-5">
          {/* Grid Template */}
          <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Columns3 className="w-4 h-4 text-cyan-400" /> Grid Template
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Columns</label>
              <input type="text" value={colsTemplate} onChange={e => setColsTemplate(e.target.value)}
                placeholder="e.g. 1fr 1fr 1fr"
                className="w-full px-3 py-1.5 rounded-md bg-gray-700 text-white text-sm border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none font-mono" />
              <p className="text-[10px] text-gray-500">Use fr, px, %, auto, repeat(), minmax()</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Rows</label>
              <input type="text" value={rowsTemplate} onChange={e => setRowsTemplate(e.target.value)}
                placeholder="e.g. 1fr 1fr"
                className="w-full px-3 py-1.5 rounded-md bg-gray-700 text-white text-sm border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none font-mono" />
              <p className="text-[10px] text-gray-500">Use fr, px, %, auto, repeat(), minmax()</p>
            </div>
          </div>

          {/* Gap */}
          <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Rows3 className="w-4 h-4 text-cyan-400" /> Gap
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <NumberInput label="Column Gap" value={colGap} onChange={setColGap} max={100} />
              </div>
              <div className="flex-1">
                <NumberInput label="Row Gap" value={rowGap} onChange={setRowGap} max={100} />
              </div>
            </div>
            <BtnGroup options={['px', 'rem'] as GapUnit[]} value={gapUnit} onChange={setGapUnit} label="Unit" />
          </div>

          {/* Alignment */}
          <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 space-y-4">
            <p className="text-sm font-semibold text-white">Alignment</p>
            <BtnGroup options={JUSTIFY_ITEMS_OPTS} value={justifyItems} onChange={setJustifyItems} label="justify-items" />
            <BtnGroup options={ALIGN_ITEMS_OPTS} value={alignItems} onChange={setAlignItems} label="align-items" />
            <BtnGroup options={JUSTIFY_CONTENT_OPTS} value={justifyContent} onChange={setJustifyContent} label="justify-content" />
            <BtnGroup options={ALIGN_CONTENT_OPTS} value={alignContent} onChange={setAlignContent} label="align-content" />
          </div>
        </div>

        {/* ─── CENTER: Preview ───────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-5">
          {/* Grid preview */}
          <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
            <p className="text-sm font-semibold text-white mb-3">Live Preview</p>
            <div className="p-4 rounded-lg bg-gray-900/70 border border-gray-700 min-h-[300px] overflow-auto">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: colsTemplate,
                  gridTemplateRows: rowsTemplate,
                  columnGap: `${colGap}${gapUnit}`,
                  rowGap: `${rowGap}${gapUnit}`,
                  justifyItems,
                  alignItems,
                  justifyContent,
                  alignContent,
                  minHeight: '260px',
                }}
              >
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                    className={`${CELL_COLORS[idx % CELL_COLORS.length]} rounded-lg flex items-center justify-center text-white text-sm font-semibold cursor-pointer transition-all hover:scale-[1.02] ${selectedItem === item.id ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900' : ''}`}
                    style={{
                      gridColumn: `${item.colStart} / span ${item.colSpan}`,
                      gridRow: `${item.rowStart} / span ${item.rowSpan}`,
                      minHeight: '60px',
                      padding: '8px 12px',
                    }}
                  >
                    <span className="text-center leading-tight">
                      {item.label}
                      <span className="block text-[10px] font-normal text-white/60 mt-0.5">
                        c{item.colStart}:{item.colSpan} r{item.rowStart}:{item.rowSpan}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Click an item to select it for editing. Grid: {colCount} cols x {rowCount} rows, {items.length} items.</p>
          </div>

          {/* Grid Items Panel */}
          <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white">Grid Items ({items.length})</p>
              <button onClick={addItem}
                className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors">
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={item.id}
                  className={`p-3 rounded-lg border transition-colors ${selectedItem === item.id ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-sm ${CELL_COLORS[idx % CELL_COLORS.length]}`} />
                    <input type="text" value={item.label}
                      onChange={e => updateItem(item.id, 'label', e.target.value)}
                      className="flex-1 px-2 py-0.5 text-sm bg-transparent text-white border-b border-gray-600 focus:border-cyan-500 outline-none" />
                    <button onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                      className="text-xs text-gray-400 hover:text-cyan-400 transition-colors">
                      {selectedItem === item.id ? 'Collapse' : 'Edit'}
                    </button>
                    <button onClick={() => removeItem(item.id)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  {selectedItem === item.id && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      <div>
                        <label className="text-[10px] text-gray-500 block">Col Start</label>
                        <input type="number" min={1} max={20} value={item.colStart}
                          onChange={e => updateItem(item.id, 'colStart', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-2 py-1 text-xs rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block">Col Span</label>
                        <input type="number" min={1} max={20} value={item.colSpan}
                          onChange={e => updateItem(item.id, 'colSpan', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-2 py-1 text-xs rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block">Row Start</label>
                        <input type="number" min={1} max={20} value={item.rowStart}
                          onChange={e => updateItem(item.id, 'rowStart', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-2 py-1 text-xs rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block">Row Span</label>
                        <input type="number" min={1} max={20} value={item.rowSpan}
                          onChange={e => updateItem(item.id, 'rowSpan', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-2 py-1 text-xs rounded bg-gray-700 text-white border border-gray-600 focus:border-cyan-500 outline-none" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Code Output */}
          <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1">
                <button onClick={() => setCodeTab('css')}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${codeTab === 'css' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                  CSS
                </button>
                <button onClick={() => setCodeTab('html')}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${codeTab === 'html' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                  HTML
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={copyCSS}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
                  {copiedCSS ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedCSS ? 'Copied!' : 'Copy CSS'}
                </button>
                <button onClick={copyHTML}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
                  {copiedHTML ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedHTML ? 'Copied!' : 'Copy HTML'}
                </button>
              </div>
            </div>
            <div className="rounded-lg bg-gray-900/80 border border-gray-700 p-4 font-mono text-xs leading-relaxed overflow-x-auto max-h-[350px] overflow-y-auto">
              {codeTab === 'css' ? highlightCSS(cssCode) : highlightHTML(htmlCode)}
            </div>
          </div>
        </div>
      </div>

      {/* Trust badge */}
      <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <p className="text-xs text-gray-400">
          100% client-side. Your layouts are never sent to any server. Free, private, no signup required.
        </p>
      </div>
    </div>
  );
}
