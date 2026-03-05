'use client';
import { useState, useMemo } from 'react';
import { Gem, IndianRupee, Weight, Percent, Calculator, Info, TrendingDown, ArrowRightLeft, Scale } from 'lucide-react';

type Purity = '24k' | '22k' | '18k' | '14k';

const PURITY_DATA: Record<Purity, { name: string; fineness: number; desc: string; color: string }> = {
  '24k': { name: '24 Karat', fineness: 0.999, desc: 'Pure gold (99.9%)', color: 'bg-yellow-500' },
  '22k': { name: '22 Karat', fineness: 0.9166, desc: 'Most popular for jewellery (91.6%)', color: 'bg-amber-500' },
  '18k': { name: '18 Karat', fineness: 0.75, desc: 'Good for studded jewellery (75%)', color: 'bg-orange-500' },
  '14k': { name: '14 Karat', fineness: 0.585, desc: 'Affordable & durable (58.5%)', color: 'bg-orange-400' },
};

type WeightUnit = 'gram' | 'tola' | 'oz' | 'kg';

const WEIGHT_CONVERT: Record<WeightUnit, number> = {
  gram: 1,
  tola: 11.6638, // 1 tola = 11.6638 grams
  oz: 31.1035, // 1 troy oz = 31.1035 grams
  kg: 1000,
};

const WEIGHT_LABELS: Record<WeightUnit, string> = {
  gram: 'Grams',
  tola: 'Tola',
  oz: 'Troy Ounce',
  kg: 'Kilograms',
};

export function GoldPriceCalculatorTool() {
  const [goldRate, setGoldRate] = useState('7500'); // per gram for 24K
  const [purity, setPurity] = useState<Purity>('22k');
  const [weight, setWeight] = useState('10');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('gram');
  const [makingChargeType, setMakingChargeType] = useState<'percent' | 'per-gram' | 'flat'>('percent');
  const [makingCharge, setMakingCharge] = useState('12');
  const [gstRate, setGstRate] = useState('3');
  const [stoneCharge, setStoneCharge] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [showSellback, setShowSellback] = useState(false);
  const [wastagePercent, setWastagePercent] = useState('2');

  const result = useMemo(() => {
    const rate24k = parseFloat(goldRate) || 0;
    const wt = parseFloat(weight) || 0;
    const mc = parseFloat(makingCharge) || 0;
    const gst = parseFloat(gstRate) || 0;
    const stone = parseFloat(stoneCharge) || 0;
    const disc = parseFloat(discount) || 0;
    const wastage = parseFloat(wastagePercent) || 0;

    const weightInGrams = wt * WEIGHT_CONVERT[weightUnit];
    const purityFactor = PURITY_DATA[purity].fineness;
    const rateForPurity = rate24k * purityFactor;

    const goldValue = rateForPurity * weightInGrams;

    let makingCost = 0;
    if (makingChargeType === 'percent') makingCost = goldValue * (mc / 100);
    else if (makingChargeType === 'per-gram') makingCost = mc * weightInGrams;
    else makingCost = mc;

    const subtotal = goldValue + makingCost + stone;
    const gstAmount = subtotal * (gst / 100);
    const discountAmount = subtotal * (disc / 100);
    const total = subtotal + gstAmount - discountAmount;

    // Sell-back calculation
    const sellbackWastage = goldValue * (wastage / 100);
    const sellbackValue = goldValue - sellbackWastage;
    const makingLoss = total - sellbackValue;

    // Weight conversions
    const conversions: Record<WeightUnit, number> = {
      gram: weightInGrams,
      tola: weightInGrams / WEIGHT_CONVERT.tola,
      oz: weightInGrams / WEIGHT_CONVERT.oz,
      kg: weightInGrams / WEIGHT_CONVERT.kg,
    };

    return {
      weightInGrams, rateForPurity, goldValue, makingCost, stone,
      subtotal, gstAmount, discountAmount, total, rate24k, purityFactor,
      sellbackValue, sellbackWastage, makingLoss, conversions,
    };
  }, [goldRate, purity, weight, weightUnit, makingChargeType, makingCharge, gstRate, stoneCharge, discount, wastagePercent]);

  // Cost breakdown for donut
  const costBreakdown = useMemo(() => {
    const parts = [
      { label: 'Gold Value', value: result.goldValue, color: '#eab308' },
      { label: 'Making Charges', value: result.makingCost, color: '#f97316' },
      { label: 'GST', value: result.gstAmount, color: '#6366f1' },
    ];
    if (result.stone > 0) parts.push({ label: 'Stone', value: result.stone, color: '#ec4899' });
    return parts;
  }, [result]);

  // SVG donut chart
  const donutChart = useMemo(() => {
    const total = costBreakdown.reduce((s, p) => s + p.value, 0);
    if (total <= 0) return null;
    const size = 140;
    const r = 50;
    const cx = size / 2;
    const cy = size / 2;
    const circ = 2 * Math.PI * r;
    let offset = 0;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="18" />
        {costBreakdown.map((part, i) => {
          const len = (part.value / total) * circ;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={part.color} strokeWidth="18"
              strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={`${-offset}`}
              transform={`rotate(-90 ${cx} ${cy})`} className="transition-all duration-500" />
          );
          offset += len;
          return el;
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[10px] font-bold">
          {purity.toUpperCase()}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" className="fill-slate-500 text-[8px]">
          {result.weightInGrams.toFixed(1)}g
        </text>
      </svg>
    );
  }, [costBreakdown, purity, result.weightInGrams]);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Gem className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Gold Jewellery Price Calculator</h2>
            <p className="text-yellow-100 text-xs">Calculate gold jewellery cost with making charges & GST | India</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Input */}
        <div className="space-y-4">
          {/* Gold Rate */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <IndianRupee className="w-3 h-3" /> Gold Rate (24K per gram in Rs)
            </label>
            <input type="number" value={goldRate} onChange={e => setGoldRate(e.target.value)}
              placeholder="7500"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
            <input type="range" min="4000" max="12000" step="100" value={parseFloat(goldRate) || 7500}
              onChange={e => setGoldRate(e.target.value)}
              className="w-full mt-1.5 accent-yellow-500" />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Rs 4,000</span>
              <span>Rs 12,000</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {[7000, 7500, 8000, 8500, 9000, 10000].map(v => (
                <button key={v} onClick={() => setGoldRate(String(v))}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${parseFloat(goldRate) === v ? 'bg-yellow-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-yellow-50'}`}>
                  Rs {v.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Purity Selection */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Gold Purity (Karat)</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(PURITY_DATA) as Purity[]).map(k => (
                <button key={k} onClick={() => setPurity(k)}
                  className={`px-2 py-2 rounded-xl text-xs font-medium transition-all ${purity === k
                    ? `${PURITY_DATA[k].color} text-white shadow-md scale-105`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-yellow-50'}`}>
                  <div className="font-bold">{k.toUpperCase()}</div>
                  <div className="text-[9px] mt-0.5 opacity-80">{Math.round(PURITY_DATA[k].fineness * 100)}%</div>
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <Weight className="w-3 h-3" /> Weight
              </label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} step="0.1"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
              <input type="range" min="0.5" max={weightUnit === 'kg' ? '1' : weightUnit === 'oz' ? '10' : weightUnit === 'tola' ? '20' : '200'}
                step={weightUnit === 'kg' ? '0.01' : '0.5'} value={parseFloat(weight) || 10}
                onChange={e => setWeight(e.target.value)}
                className="w-full mt-1 accent-yellow-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Unit</label>
              <select value={weightUnit} onChange={e => setWeightUnit(e.target.value as WeightUnit)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-yellow-500 outline-none">
                <option value="gram">Grams</option>
                <option value="tola">Tola (1 = 11.66g)</option>
                <option value="oz">Troy Ounce (1 = 31.1g)</option>
                <option value="kg">Kilograms</option>
              </select>
            </div>
          </div>

          {/* Weight Conversion Display */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5 flex items-center gap-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-500">
              {(Object.keys(WEIGHT_CONVERT) as WeightUnit[]).filter(u => u !== weightUnit).map(u => (
                <span key={u}>{result.conversions[u].toFixed(u === 'kg' ? 4 : 2)} {WEIGHT_LABELS[u]}</span>
              ))}
            </div>
          </div>

          {/* Quick Weight Presets */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] text-slate-400 self-center">Quick:</span>
            {[1, 2, 5, 8, 10, 20, 50, 100].map(v => (
              <button key={v} onClick={() => { setWeight(String(v)); setWeightUnit('gram'); }}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-yellow-50">
                {v}g
              </button>
            ))}
          </div>

          {/* Making Charges */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Making Charges</label>
            <div className="flex gap-2 mb-2">
              {([['percent', '% of gold'], ['per-gram', 'Rs/gram'], ['flat', 'Flat Rs']] as const).map(([val, label]) => (
                <button key={val} onClick={() => setMakingChargeType(val)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${makingChargeType === val
                    ? 'bg-yellow-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {label}
                </button>
              ))}
            </div>
            <input type="number" value={makingCharge} onChange={e => setMakingCharge(e.target.value)}
              placeholder={makingChargeType === 'percent' ? '12' : makingChargeType === 'per-gram' ? '500' : '5000'}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
            {makingChargeType === 'percent' && (
              <input type="range" min="0" max="30" step="0.5" value={parseFloat(makingCharge) || 12}
                onChange={e => setMakingCharge(e.target.value)}
                className="w-full mt-1 accent-yellow-500" />
            )}
          </div>

          {/* Extra charges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">GST %</label>
              <input type="number" value={gstRate} onChange={e => setGstRate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Stone/Diamond Rs</label>
              <input type="number" value={stoneCharge} onChange={e => setStoneCharge(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Discount %</label>
              <input type="number" value={discount} onChange={e => setDiscount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {/* Total Price + Donut */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">{donutChart}</div>
              <div className="flex-1 text-center">
                <div className="text-xs text-yellow-600 uppercase tracking-wider mb-1">Total Jewellery Price</div>
                <div className="text-3xl font-bold text-amber-600">
                  Rs {result.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {result.weightInGrams.toFixed(2)}g of {purity.toUpperCase()} gold
                </div>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {costBreakdown.filter(p => p.value > 0).map(p => (
                    <span key={p.label} className="flex items-center gap-1 text-[9px] text-slate-500">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-700">
            {[
              { label: `Gold Value (${purity.toUpperCase()} x ${result.weightInGrams.toFixed(2)}g)`, value: result.goldValue, color: 'text-amber-600' },
              { label: `Making Charges`, value: result.makingCost },
              ...(result.stone > 0 ? [{ label: 'Stone/Diamond Charges', value: result.stone }] : []),
              { label: 'Subtotal', value: result.subtotal, bold: true },
              { label: `GST (${gstRate}%)`, value: result.gstAmount },
              ...(result.discountAmount > 0 ? [{ label: `Discount (${discount}%)`, value: -result.discountAmount, color: 'text-green-600' }] : []),
              { label: 'Total Price', value: result.total, bold: true, color: 'text-amber-600' },
            ].map((row, i) => (
              <div key={i} className={`flex justify-between px-4 py-2.5 text-sm ${'bold' in row && row.bold ? 'font-semibold bg-slate-50 dark:bg-slate-700/50' : ''}`}>
                <span className="text-slate-500">{row.label}</span>
                <span className={`font-medium ${'color' in row && row.color ? row.color : 'text-slate-700 dark:text-slate-300'}`}>
                  {row.value < 0 ? '-' : ''}Rs {Math.abs(row.value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>

          {/* Rate per gram comparison */}
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(PURITY_DATA) as Purity[]).map(k => (
              <div key={k} className={`rounded-xl p-3 text-center border transition-all ${k === purity
                ? 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 scale-105 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                <div className="text-[10px] text-slate-500 uppercase">{k.toUpperCase()}/g</div>
                <div className={`text-sm font-bold ${k === purity ? 'text-amber-600' : 'text-slate-700 dark:text-slate-300'}`}>
                  Rs {(result.rate24k * PURITY_DATA[k].fineness).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </div>
            ))}
          </div>

          {/* Per-gram cost */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-center">
            <div className="text-xs text-blue-600">Your effective cost per gram (including making + GST)</div>
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
              Rs {result.weightInGrams > 0 ? (result.total / result.weightInGrams).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0'}/gram
            </div>
            <div className="text-[10px] text-blue-500 mt-0.5">
              vs pure gold rate: Rs {result.rateForPurity.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/gram ({result.weightInGrams > 0 ? (((result.total / result.weightInGrams) / result.rateForPurity - 1) * 100).toFixed(1) : '0'}% premium)
            </div>
          </div>

          {/* Sell-back Estimator */}
          <div>
            <button onClick={() => setShowSellback(!showSellback)}
              className={`w-full py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${showSellback ? 'bg-red-100 dark:bg-red-900/30 text-red-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}>
              <TrendingDown className="w-3.5 h-3.5" />
              {showSellback ? 'Hide' : 'Show'} Sell-Back Value Estimator
            </button>
            {showSellback && (
              <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 space-y-3">
                <div>
                  <label className="text-xs text-red-600 font-medium mb-1 block">Wastage/Deduction (%)</label>
                  <div className="flex gap-2 items-center">
                    <input type="range" min="0" max="10" step="0.5" value={parseFloat(wastagePercent) || 2}
                      onChange={e => setWastagePercent(e.target.value)}
                      className="flex-1 accent-red-500" />
                    <span className="text-sm font-bold text-red-600 w-12 text-right">{wastagePercent}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-2">
                    <div className="text-[10px] text-slate-500">Gold Value</div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Rs {result.goldValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-2">
                    <div className="text-[10px] text-slate-500">Sell-Back Value</div>
                    <div className="text-xs font-bold text-green-600">Rs {result.sellbackValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-2">
                    <div className="text-[10px] text-slate-500">Total Loss</div>
                    <div className="text-xs font-bold text-red-600">Rs {result.makingLoss.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
                <p className="text-[10px] text-red-500">When you sell gold back, you only get the gold value (minus wastage). Making charges, GST, and stone charges are lost.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gold Buying Tips for India</h4>
        <div className="grid md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-2">
            <p><strong>GST on Gold:</strong> 3% GST is charged on the gold value + making charges. This is standard across India since July 2017.</p>
            <p><strong>Making Charges:</strong> Typically 8-25% depending on design complexity. Machine-made jewellery has lower charges (8-12%) vs handmade (15-25%).</p>
            <p><strong>Hallmarking:</strong> BIS hallmark is mandatory for gold jewellery sold in India. Look for the HUID number for authenticity.</p>
          </div>
          <div className="space-y-2">
            <p><strong>22K vs 24K:</strong> 22K (91.6% pure) is the most popular for Indian jewellery as pure 24K gold is too soft for daily wear.</p>
            <p><strong>Buyback:</strong> When selling gold back, you only get the gold value (minus wastage). Making charges are not refunded.</p>
            <p><strong>Digital Gold:</strong> You can also buy 24K digital gold from Rs 1 via apps like PhonePe, Google Pay, and Paytm.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
