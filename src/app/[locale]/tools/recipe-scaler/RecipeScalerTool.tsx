'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Plus, Trash2, Copy, RotateCcw, ChefHat, ArrowRightLeft,
  Check, Scale, Flame, Clipboard, Lightbulb,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface Ingredient {
  id: number;
  quantity: number;
  unit: string;
  name: string;
}

type ConversionSystem = 'original' | 'metric' | 'imperial';

/* ─── Constants ──────────────────────────────────────────────────────────── */

const UNITS = [
  'cups', 'tbsp', 'tsp', 'ml', 'liters',
  'grams', 'kg', 'oz', 'lbs',
  'pieces', 'pinch', 'dash', 'bunch', 'cloves', 'slices', 'whole',
];

const WHOLE_UNITS = new Set(['pieces', 'whole', 'cloves', 'slices', 'bunch']);

const EXAMPLE_RECIPE = {
  name: 'Chocolate Chip Cookies',
  originalServings: 24,
  desiredServings: 24,
  ingredients: [
    { id: 1, quantity: 2.25, unit: 'cups', name: 'all-purpose flour' },
    { id: 2, quantity: 1, unit: 'tsp', name: 'baking soda' },
    { id: 3, quantity: 1, unit: 'tsp', name: 'salt' },
    { id: 4, quantity: 1, unit: 'cups', name: 'butter, softened' },
    { id: 5, quantity: 0.75, unit: 'cups', name: 'granulated sugar' },
    { id: 6, quantity: 0.75, unit: 'cups', name: 'brown sugar, packed' },
    { id: 7, quantity: 2, unit: 'pieces', name: 'large eggs' },
    { id: 8, quantity: 2, unit: 'tsp', name: 'vanilla extract' },
    { id: 9, quantity: 2, unit: 'cups', name: 'chocolate chips' },
  ],
};

/* ─── Fraction helpers ───────────────────────────────────────────────────── */

const FRACTION_MAP: [number, string][] = [
  [0.125, '\u215B'],   // ⅛
  [0.25,  '\u00BC'],   // ¼
  [0.333, '\u2153'],   // ⅓
  [0.375, '\u215C'],   // ⅜
  [0.5,   '\u00BD'],   // ½
  [0.625, '\u215D'],   // ⅝
  [0.667, '\u2154'],   // ⅔
  [0.75,  '\u00BE'],   // ¾
  [0.875, '\u215E'],   // ⅞
];

function toFraction(value: number): string {
  if (value <= 0) return '0';
  if (WHOLE_UNITS.has('')) return String(value); // never hit, just TS guard

  const whole = Math.floor(value);
  const frac = value - whole;

  if (frac < 0.05) return String(whole || '0');

  // find closest fraction
  let best = FRACTION_MAP[0];
  let bestDist = Math.abs(frac - best[0]);
  for (const entry of FRACTION_MAP) {
    const d = Math.abs(frac - entry[0]);
    if (d < bestDist) { best = entry; bestDist = d; }
  }

  if (bestDist < 0.04) {
    return whole > 0 ? `${whole}${best[1]}` : best[1];
  }
  // fallback to 2 decimal
  return value % 1 === 0 ? String(value) : value.toFixed(2).replace(/\.?0+$/, '');
}

function formatQuantity(value: number, unit: string): string {
  if (value <= 0) return '0';
  if (WHOLE_UNITS.has(unit)) return String(Math.round(value));
  return toFraction(value);
}

/* ─── Unit conversion ────────────────────────────────────────────────────── */

const CONVERSIONS: Record<string, { metric: { value: number; unit: string }; imperial: { value: number; unit: string } }> = {
  cups:   { metric: { value: 236.588, unit: 'ml' },    imperial: { value: 1, unit: 'cups' } },
  tbsp:   { metric: { value: 14.787, unit: 'ml' },     imperial: { value: 1, unit: 'tbsp' } },
  tsp:    { metric: { value: 4.929, unit: 'ml' },      imperial: { value: 1, unit: 'tsp' } },
  ml:     { metric: { value: 1, unit: 'ml' },           imperial: { value: 1 / 236.588, unit: 'cups' } },
  liters: { metric: { value: 1, unit: 'liters' },       imperial: { value: 1000 / 236.588, unit: 'cups' } },
  oz:     { metric: { value: 28.35, unit: 'grams' },    imperial: { value: 1, unit: 'oz' } },
  grams:  { metric: { value: 1, unit: 'grams' },        imperial: { value: 1 / 28.35, unit: 'oz' } },
  lbs:    { metric: { value: 0.4536, unit: 'kg' },      imperial: { value: 1, unit: 'lbs' } },
  kg:     { metric: { value: 1, unit: 'kg' },            imperial: { value: 1 / 0.4536, unit: 'lbs' } },
};

function convertUnit(qty: number, fromUnit: string, system: ConversionSystem): { qty: number; unit: string } {
  if (system === 'original' || !CONVERSIONS[fromUnit]) return { qty, unit: fromUnit };
  const conv = CONVERSIONS[fromUnit][system];
  return { qty: qty * conv.value, unit: conv.unit };
}

function convertTemp(val: number, direction: 'f2c' | 'c2f'): number {
  return direction === 'f2c' ? (val - 32) * 5 / 9 : val * 9 / 5 + 32;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

let nextId = 100;

export function RecipeScalerTool() {
  const [recipeName, setRecipeName] = useState('');
  const [originalServings, setOriginalServings] = useState(4);
  const [desiredServings, setDesiredServings] = useState(4);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, quantity: 1, unit: 'cups', name: '' },
  ]);
  const [conversionSystem, setConversionSystem] = useState<ConversionSystem>('original');
  const [copied, setCopied] = useState(false);

  // Temperature converter state
  const [tempInput, setTempInput] = useState('');
  const [tempDirection, setTempDirection] = useState<'f2c' | 'c2f'>('f2c');

  const scaleFactor = useMemo(() => {
    if (originalServings <= 0) return 1;
    return desiredServings / originalServings;
  }, [originalServings, desiredServings]);

  const scaledIngredients = useMemo(() => {
    return ingredients.map(ing => {
      const scaledQty = ing.quantity * scaleFactor;
      const converted = convertUnit(scaledQty, ing.unit, conversionSystem);
      return {
        ...ing,
        scaledQuantity: converted.qty,
        displayUnit: converted.unit,
        formatted: formatQuantity(converted.qty, converted.unit),
      };
    });
  }, [ingredients, scaleFactor, conversionSystem]);

  const tempResult = useMemo(() => {
    const v = parseFloat(tempInput);
    if (isNaN(v)) return '';
    return convertTemp(v, tempDirection).toFixed(1);
  }, [tempInput, tempDirection]);

  /* ── Handlers ──────────────────────────────────────────────────────────── */

  const addIngredient = useCallback(() => {
    setIngredients(prev => [...prev, { id: nextId++, quantity: 1, unit: 'cups', name: '' }]);
  }, []);

  const removeIngredient = useCallback((id: number) => {
    setIngredients(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);
  }, []);

  const updateIngredient = useCallback((id: number, field: keyof Ingredient, value: string | number) => {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  }, []);

  const applyQuickScale = useCallback((multiplier: number) => {
    setDesiredServings(Math.round(originalServings * multiplier));
  }, [originalServings]);

  const loadExample = useCallback(() => {
    setRecipeName(EXAMPLE_RECIPE.name);
    setOriginalServings(EXAMPLE_RECIPE.originalServings);
    setDesiredServings(EXAMPLE_RECIPE.desiredServings);
    setIngredients(EXAMPLE_RECIPE.ingredients);
  }, []);

  const resetAll = useCallback(() => {
    setRecipeName('');
    setOriginalServings(4);
    setDesiredServings(4);
    setIngredients([{ id: nextId++, quantity: 1, unit: 'cups', name: '' }]);
    setConversionSystem('original');
    setCopied(false);
  }, []);

  const copyRecipe = useCallback(async () => {
    const header = recipeName ? `${recipeName} (Scaled to ${desiredServings} servings)\n${'─'.repeat(40)}\n\n` : '';
    const lines = scaledIngredients
      .filter(i => i.name.trim())
      .map(i => `${i.formatted} ${i.displayUnit} ${i.name}`)
      .join('\n');
    const text = `${header}${lines}\n`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  }, [recipeName, desiredServings, scaledIngredients]);

  /* ── Styles ────────────────────────────────────────────────────────────── */

  const card = 'rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
  const input = 'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition';
  const btnPrimary = 'inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 text-sm transition shadow-sm';
  const btnSecondary = 'inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium px-3 py-2 text-sm transition';
  const quickBtn = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${active ? 'bg-amber-500 text-white shadow' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-600'}`;

  /* ── Render ─────────────────────────────────────────────────────────────── */

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
          <ChefHat className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Recipe Scaler & Converter</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
          Scale any recipe up or down, see smart fractions, and convert between metric and imperial units instantly.
        </p>
      </div>

      {/* Action buttons row */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={loadExample} className={btnSecondary}>
          <Lightbulb className="w-4 h-4 text-amber-500" /> Try Example
        </button>
        <button onClick={resetAll} className={btnSecondary}>
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── LEFT: Input ──────────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Recipe info */}
          <div className={`${card} p-5 space-y-4`}>
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-500" /> Recipe Details
            </h2>
            <div>
              <label className={label}>Recipe Name (optional)</label>
              <input type="text" className={input} placeholder="e.g. Chocolate Chip Cookies" value={recipeName} onChange={e => setRecipeName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>Original Servings</label>
                <input type="number" min={1} className={input} value={originalServings} onChange={e => setOriginalServings(Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
              <div>
                <label className={label}>Desired Servings</label>
                <input type="number" min={1} className={input} value={desiredServings} onChange={e => setDesiredServings(Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
            </div>

            {/* Quick scale buttons */}
            <div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Quick Scale</span>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {[
                  { label: 'Half (\u00F72)', mult: 0.5 },
                  { label: 'Double (\u00D72)', mult: 2 },
                  { label: 'Triple (\u00D73)', mult: 3 },
                  { label: '\u00D74', mult: 4 },
                ].map(b => (
                  <button
                    key={b.label}
                    onClick={() => applyQuickScale(b.mult)}
                    className={quickBtn(desiredServings === Math.round(originalServings * b.mult))}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ingredients input */}
          <div className={`${card} p-5 space-y-3`}>
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clipboard className="w-4 h-4 text-amber-500" /> Ingredients
            </h2>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={ing.id} className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400 w-5 text-right shrink-0">{idx + 1}.</span>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    placeholder="Qty"
                    className={`${input} !w-20 shrink-0`}
                    value={ing.quantity || ''}
                    onChange={e => updateIngredient(ing.id, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                  <select
                    className={`${input} !w-24 shrink-0`}
                    value={ing.unit}
                    onChange={e => updateIngredient(ing.id, 'unit', e.target.value)}
                  >
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    className={`${input} flex-1 min-w-0`}
                    value={ing.name}
                    onChange={e => updateIngredient(ing.id, 'name', e.target.value)}
                  />
                  <button
                    onClick={() => removeIngredient(ing.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition shrink-0"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={addIngredient} className={btnPrimary}>
              <Plus className="w-4 h-4" /> Add Ingredient
            </button>
          </div>

          {/* Unit converter toggle */}
          <div className={`${card} p-5 space-y-4`}>
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-amber-500" /> Unit Conversion
            </h2>
            <div className="flex flex-wrap gap-2">
              {(['original', 'metric', 'imperial'] as ConversionSystem[]).map(s => (
                <button
                  key={s}
                  onClick={() => setConversionSystem(s)}
                  className={quickBtn(conversionSystem === s)}
                >
                  {s === 'original' ? 'Original Units' : s === 'metric' ? 'Metric' : 'Imperial'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {conversionSystem === 'original' && 'Showing quantities in the original recipe units.'}
              {conversionSystem === 'metric' && 'Cups, tbsp, tsp \u2192 ml | oz \u2192 grams | lbs \u2192 kg'}
              {conversionSystem === 'imperial' && 'ml \u2192 cups | grams \u2192 oz | kg \u2192 lbs'}
            </p>

            {/* Temperature converter */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" /> Temperature Converter
              </h3>
              <div className="flex gap-2 items-center flex-wrap">
                <input
                  type="number"
                  placeholder="Enter temp"
                  className={`${input} !w-28`}
                  value={tempInput}
                  onChange={e => setTempInput(e.target.value)}
                />
                <select
                  className={`${input} !w-auto`}
                  value={tempDirection}
                  onChange={e => setTempDirection(e.target.value as 'f2c' | 'c2f')}
                >
                  <option value="f2c">\u00B0F \u2192 \u00B0C</option>
                  <option value="c2f">\u00B0C \u2192 \u00B0F</option>
                </select>
                {tempResult && (
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    = {tempResult}{tempDirection === 'f2c' ? '\u00B0C' : '\u00B0F'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Output ─────────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Scaled recipe */}
          <div className={`${card} p-5 space-y-4`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-amber-500" /> Scaled Recipe
              </h2>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  {scaleFactor === 1 ? '1\u00D7' : `${scaleFactor.toFixed(2).replace(/\.?0+$/, '')}\u00D7`}
                </span>
                <button onClick={copyRecipe} className={btnSecondary}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {recipeName && (
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {recipeName}
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({desiredServings} servings)
                </span>
              </p>
            )}

            {/* Scaled list */}
            <div className="space-y-1.5">
              {scaledIngredients.filter(i => i.name.trim()).length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 italic py-4 text-center">
                  Add ingredients on the left to see the scaled recipe here.
                </p>
              ) : (
                scaledIngredients
                  .filter(i => i.name.trim())
                  .map(i => (
                    <div key={i.id} className="flex items-baseline gap-2 py-1.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                      <span className="font-semibold text-amber-600 dark:text-amber-400 min-w-[3rem] text-right">
                        {i.formatted}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm min-w-[3rem]">{i.displayUnit}</span>
                      <span className="text-gray-900 dark:text-gray-100">{i.name}</span>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Comparison table */}
          {scaledIngredients.filter(i => i.name.trim()).length > 0 && (
            <div className={`${card} p-5 space-y-3`}>
              <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Original vs Scaled Comparison</h2>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Ingredient</th>
                      <th className="text-right py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Original</th>
                      <th className="text-right py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Scaled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scaledIngredients.filter(i => i.name.trim()).map(i => {
                      const origConverted = convertUnit(i.quantity, i.unit, conversionSystem);
                      return (
                        <tr key={i.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                          <td className="py-1.5 px-2 text-gray-700 dark:text-gray-300 max-w-[10rem] truncate">{i.name}</td>
                          <td className="py-1.5 px-2 text-right text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {formatQuantity(origConverted.qty, origConverted.unit)} {origConverted.unit}
                          </td>
                          <td className="py-1.5 px-2 text-right font-medium text-amber-600 dark:text-amber-400 whitespace-nowrap">
                            {i.formatted} {i.displayUnit}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quick reference */}
          <div className={`${card} p-5 space-y-3`}>
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Quick Reference</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <span>1 cup = 236.59 ml</span>
              <span>1 tbsp = 14.79 ml</span>
              <span>1 tsp = 4.93 ml</span>
              <span>1 oz = 28.35 g</span>
              <span>1 lb = 453.6 g</span>
              <span>1 cup = 16 tbsp</span>
              <span>1 tbsp = 3 tsp</span>
              <span>350\u00B0F = 177\u00B0C</span>
            </div>
          </div>

          {/* Trust badge */}
          <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 p-4 text-center space-y-1">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">100% Private & Free</p>
            <p className="text-xs text-amber-700/70 dark:text-amber-400/70">
              All calculations happen in your browser. Nothing is stored or sent to any server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
