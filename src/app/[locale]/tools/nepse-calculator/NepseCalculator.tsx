'use client';
import { useState, useMemo, useCallback } from 'react';
import {
  TrendingUp, TrendingDown, Calculator, DollarSign, BarChart3, ArrowRight,
  Info, RefreshCw, Minus, ChevronDown, ChevronUp, Target, Scale, PieChart,
  ArrowUpDown, Shield, Zap, Plus, Trash2, CircleDollarSign,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   NEPSE Fee Structure (Updated Fiscal Year 2081/2082)
   ═══════════════════════════════════════════════════════════ */

function getBrokerCommission(amount: number): number {
  if (amount <= 0) return 0;
  let commission = 0;
  let remaining = amount;
  const tiers = [
    { limit: 50000, rate: 0.0036 },
    { limit: 500000, rate: 0.0033 },
    { limit: 2000000, rate: 0.0031 },
    { limit: 10000000, rate: 0.0027 },
    { limit: Infinity, rate: 0.0024 },
  ];
  let prevLimit = 0;
  for (const tier of tiers) {
    const taxable = Math.min(remaining, tier.limit - prevLimit);
    if (taxable <= 0) break;
    commission += taxable * tier.rate;
    remaining -= taxable;
    prevLimit = tier.limit;
  }
  return Math.max(commission, 10);
}

const SEBON_FEE_RATE = 0.00015; // 0.015%
const DP_CHARGE = 25;
const CGT_RATES = {
  individual_long: 0.05,    // 5%
  individual_short: 0.075,  // 7.5%
  institutional: 0.10,      // 10%
};

// Circuit breaker: NEPSE uses 10% for regular, 5% for first day listing
const CIRCUIT_PERCENT = 0.10;

type InvestorType = 'individual' | 'institutional';
type HoldingPeriod = 'short' | 'long';
type TabMode = 'profit' | 'wacc' | 'target';

interface CalcResult {
  buyAmount: number; buyCommission: number; buySebonFee: number; buyDp: number; totalBuyCost: number;
  sellAmount: number; sellCommission: number; sellSebonFee: number; sellDp: number; totalSellReceive: number;
  capitalGainTax: number; cgtRate: number; netProfit: number; netProfitPercent: number;
  breakEvenPrice: number; isProfit: boolean;
  totalBuyFees: number; totalSellFees: number; totalFees: number;
  priceChange: number; priceChangePercent: number;
  upperCircuit: number; lowerCircuit: number;
}

function calculate(
  buyPrice: number, sellPrice: number, quantity: number,
  investorType: InvestorType, holdingPeriod: HoldingPeriod
): CalcResult | null {
  if (buyPrice <= 0 || quantity <= 0) return null;

  const buyAmount = buyPrice * quantity;
  const buyCommission = getBrokerCommission(buyAmount);
  const buySebonFee = buyAmount * SEBON_FEE_RATE;
  const buyDp = DP_CHARGE;
  const totalBuyFees = buyCommission + buySebonFee + buyDp;
  const totalBuyCost = buyAmount + totalBuyFees;

  const sellAmount = sellPrice * quantity;
  const sellCommission = getBrokerCommission(sellAmount);
  const sellSebonFee = sellAmount * SEBON_FEE_RATE;
  const sellDp = DP_CHARGE;
  const totalSellFees = sellCommission + sellSebonFee + sellDp;
  const totalSellReceive = sellAmount - totalSellFees;

  const cgtRate = investorType === 'institutional'
    ? CGT_RATES.institutional
    : holdingPeriod === 'short' ? CGT_RATES.individual_short : CGT_RATES.individual_long;

  const rawProfit = totalSellReceive - totalBuyCost;
  const capitalGainTax = rawProfit > 0 ? rawProfit * cgtRate : 0;
  const netProfit = rawProfit - capitalGainTax;
  const netProfitPercent = totalBuyCost > 0 ? (netProfit / totalBuyCost) * 100 : 0;

  // Break-even via binary search
  let lo = 0, hi = buyPrice * 5;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const sAmt = mid * quantity;
    const sReceive = sAmt - getBrokerCommission(sAmt) - sAmt * SEBON_FEE_RATE - DP_CHARGE;
    const rProfit = sReceive - totalBuyCost;
    const nProfit = rProfit - (rProfit > 0 ? rProfit * cgtRate : 0);
    if (nProfit < 0) lo = mid; else hi = mid;
  }

  return {
    buyAmount, buyCommission, buySebonFee, buyDp, totalBuyCost,
    sellAmount, sellCommission, sellSebonFee, sellDp, totalSellReceive,
    capitalGainTax, cgtRate, netProfit, netProfitPercent,
    breakEvenPrice: Math.ceil((lo + hi) / 2 * 100) / 100,
    isProfit: netProfit >= 0,
    totalBuyFees, totalSellFees, totalFees: totalBuyFees + totalSellFees + capitalGainTax,
    priceChange: sellPrice - buyPrice,
    priceChangePercent: buyPrice > 0 ? ((sellPrice - buyPrice) / buyPrice) * 100 : 0,
    upperCircuit: Math.round(buyPrice * (1 + CIRCUIT_PERCENT) * 100) / 100,
    lowerCircuit: Math.round(buyPrice * (1 - CIRCUIT_PERCENT) * 100) / 100,
  };
}

function formatNPR(n: number): string {
  const abs = Math.abs(n);
  const parts = abs.toFixed(2).split('.');
  let intPart = parts[0];
  const decimal = parts[1];
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3);
    const remaining = intPart.slice(0, -3);
    intPart = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }
  const formatted = `Rs ${intPart}.${decimal}`;
  return n < 0 ? `-${formatted}` : formatted;
}

function formatNPRShort(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${(n / 100000).toFixed(2)} L`;
  if (abs >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toFixed(0);
}

const COMMISSION_TIERS = [
  { range: 'Up to Rs 50,000', rate: '0.36%', color: 'bg-blue-500' },
  { range: 'Rs 50,001 - 5,00,000', rate: '0.33%', color: 'bg-blue-400' },
  { range: 'Rs 5,00,001 - 20,00,000', rate: '0.31%', color: 'bg-cyan-500' },
  { range: 'Rs 20,00,001 - 1,00,00,000', rate: '0.27%', color: 'bg-cyan-400' },
  { range: 'Above Rs 1,00,00,000', rate: '0.24%', color: 'bg-teal-500' },
];

interface WaccEntry { price: string; qty: string }

/* ═══════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════ */
export function NepseCalculator() {
  const [tab, setTab] = useState<TabMode>('profit');

  // Profit/Loss tab
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [investorType, setInvestorType] = useState<InvestorType>('individual');
  const [holdingPeriod, setHoldingPeriod] = useState<HoldingPeriod>('long');
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(false);
  const [showCommissionTable, setShowCommissionTable] = useState(false);

  // WACC tab
  const [waccEntries, setWaccEntries] = useState<WaccEntry[]>([
    { price: '', qty: '' }, { price: '', qty: '' },
  ]);

  // Target Price tab
  const [targetBuyPrice, setTargetBuyPrice] = useState('');
  const [targetQty, setTargetQty] = useState('');
  const [targetProfit, setTargetProfit] = useState('');
  const [targetInvestor, setTargetInvestor] = useState<InvestorType>('individual');
  const [targetHolding, setTargetHolding] = useState<HoldingPeriod>('long');

  // Profit/Loss calculation
  const result = useMemo(() => {
    const bp = parseFloat(buyPrice), sp = parseFloat(sellPrice), qty = parseInt(quantity);
    if (isNaN(bp) || isNaN(sp) || isNaN(qty)) return null;
    return calculate(bp, sp, qty, investorType, holdingPeriod);
  }, [buyPrice, sellPrice, quantity, investorType, holdingPeriod]);

  // WACC calculation
  const waccResult = useMemo(() => {
    let totalCost = 0, totalQty = 0;
    const valid: { price: number; qty: number }[] = [];
    for (const e of waccEntries) {
      const p = parseFloat(e.price), q = parseInt(e.qty);
      if (!isNaN(p) && !isNaN(q) && p > 0 && q > 0) {
        totalCost += p * q;
        totalQty += q;
        valid.push({ price: p, qty: q });
      }
    }
    if (valid.length < 1 || totalQty === 0) return null;
    const avgPrice = totalCost / totalQty;
    const totalCommission = getBrokerCommission(totalCost);
    const totalSebon = totalCost * SEBON_FEE_RATE;
    const totalDp = DP_CHARGE * valid.length;
    const totalInvestment = totalCost + totalCommission + totalSebon + totalDp;
    const effectivePrice = totalInvestment / totalQty;
    return { avgPrice, totalQty, totalCost, totalCommission, totalSebon, totalDp, totalInvestment, effectivePrice, entries: valid };
  }, [waccEntries]);

  // Target Price calculation
  const targetResult = useMemo(() => {
    const bp = parseFloat(targetBuyPrice), qty = parseInt(targetQty), profit = parseFloat(targetProfit);
    if (isNaN(bp) || isNaN(qty) || isNaN(profit) || bp <= 0 || qty <= 0) return null;

    const cgtRate = targetInvestor === 'institutional'
      ? CGT_RATES.institutional
      : targetHolding === 'short' ? CGT_RATES.individual_short : CGT_RATES.individual_long;

    const buyAmount = bp * qty;
    const totalBuyCost = buyAmount + getBrokerCommission(buyAmount) + buyAmount * SEBON_FEE_RATE + DP_CHARGE;

    // Binary search for target sell price
    let lo = 0, hi = bp * 10;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const sAmt = mid * qty;
      const sReceive = sAmt - getBrokerCommission(sAmt) - sAmt * SEBON_FEE_RATE - DP_CHARGE;
      const rProfit = sReceive - totalBuyCost;
      const nProfit = rProfit - (rProfit > 0 ? rProfit * cgtRate : 0);
      if (nProfit < profit) lo = mid; else hi = mid;
    }
    const targetSellPrice = Math.ceil((lo + hi) / 2 * 100) / 100;
    const priceIncrease = targetSellPrice - bp;
    const percentIncrease = (priceIncrease / bp) * 100;

    return { targetSellPrice, totalBuyCost, priceIncrease, percentIncrease, cgtRate };
  }, [targetBuyPrice, targetQty, targetProfit, targetInvestor, targetHolding]);

  const reset = useCallback(() => {
    setBuyPrice(''); setSellPrice(''); setQuantity('');
  }, []);

  const addWaccEntry = () => setWaccEntries(prev => [...prev, { price: '', qty: '' }]);
  const removeWaccEntry = (i: number) => setWaccEntries(prev => prev.filter((_, idx) => idx !== i));
  const updateWaccEntry = (i: number, field: 'price' | 'qty', val: string) => {
    setWaccEntries(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  };

  const tabs: { id: TabMode; label: string; icon: typeof Calculator; desc: string }[] = [
    { id: 'profit', label: 'Profit/Loss', icon: TrendingUp, desc: 'नाफा/नोक्सानी (Buy & Sell)' },
    { id: 'wacc', label: 'WACC', icon: Scale, desc: 'औसत लागत (Avg Cost)' },
    { id: 'target', label: 'Target Price', icon: Target, desc: 'लक्ष्य मूल्य (Profit Goal)' },
  ];

  return (
    <div className="space-y-5">
      {/* Hero Banner with animated stock chart */}
      <div className="bg-gradient-to-br from-blue-800 via-blue-600 to-cyan-500 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            <polyline fill="none" stroke="white" strokeWidth="1.5"
              points="0,160 20,155 40,140 60,145 80,120 100,130 120,100 140,110 160,80 180,90 200,60 220,70 240,45 260,55 280,35 300,40 320,25 340,30 360,15 380,20 400,5" />
            <polyline fill="url(#hGrad)" stroke="none"
              points="0,160 20,155 40,140 60,145 80,120 100,130 120,100 140,110 160,80 180,90 200,60 220,70 240,45 260,55 280,35 300,40 320,25 340,30 360,15 380,20 400,5 400,200 0,200" />
            <defs>
              <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">NEPSE Share Calculator <span className="text-blue-200 text-sm font-normal">(नेप्से शेयर क्यालकुलेटर)</span></h2>
            <p className="text-blue-200 text-[11px] mt-0.5">नाफा/नोक्सानी, WACC र लक्ष्य मूल्य — Broker Commission, SEBON Fee, DP Charge & CGT सहित</p>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Shield, label: 'SEBON 2081 Rates', desc: 'आधिकारिक दर (Official rates)' },
          { icon: Zap, label: 'Instant Results', desc: 'तुरुन्तै नतिजा (Real-time)' },
          { icon: CircleDollarSign, label: 'All Charges', desc: 'कमिसन+SEBON+DP+CGT' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
            <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{label}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Tab Selector */}
      <div className="grid grid-cols-3 gap-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative p-3 rounded-xl border-2 text-center transition-all ${
              tab === t.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400 shadow-sm shadow-blue-500/10'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
            }`}
          >
            <t.icon className={`w-5 h-5 mx-auto ${tab === t.id ? 'text-blue-600' : 'text-slate-300 dark:text-slate-600'}`} />
            <div className={`text-xs font-bold mt-1.5 ${tab === t.id ? 'text-blue-700 dark:text-blue-400' : ''}`}>{t.label}</div>
            <div className="text-[9px] text-slate-400 mt-0.5">{t.desc}</div>
          </button>
        ))}
      </div>

      {/* ═══════════════════ TAB 1: PROFIT/LOSS ═══════════════════ */}
      {tab === 'profit' && (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-500" /> Transaction Details
              </h3>
              <button onClick={reset} className="text-[10px] text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Buy Price / किनेको मूल्य (Rs)', value: buyPrice, set: setBuyPrice, ph: 'e.g. 500' },
                { label: 'Sell Price / बेचेको मूल्य (Rs)', value: sellPrice, set: setSellPrice, ph: 'e.g. 600' },
                { label: 'Quantity / कित्ता (Kitta)', value: quantity, set: setQuantity, ph: 'e.g. 100' },
              ].map(inp => (
                <div key={inp.label}>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{inp.label}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inp.value}
                      onChange={e => inp.set(e.target.value)}
                      placeholder={inp.ph}
                      min="0"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400 transition-shadow"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Investor Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['individual', 'institutional'] as const).map(type => (
                    <button key={type} onClick={() => setInvestorType(type)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                        investorType === type
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 hover:border-slate-300'
                      }`}
                    >{type === 'individual' ? 'Individual' : 'Institutional'}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Holding Period</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: 'long' as const, label: '> 365 Days', desc: investorType === 'individual' ? '5% CGT' : '10% CGT' },
                    { id: 'short' as const, label: '≤ 365 Days', desc: investorType === 'individual' ? '7.5% CGT' : '10% CGT' },
                  ]).map(p => (
                    <button key={p.id} onClick={() => setHoldingPeriod(p.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                        holdingPeriod === p.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <div>{p.label}</div>
                      <div className="text-[9px] font-normal text-slate-400 mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Circuit Breaker */}
          {buyPrice && parseFloat(buyPrice) > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-[9px] text-green-600/70 uppercase tracking-wider font-medium">Upper Circuit / माथिल्लो सर्किट (+10%)</div>
                  <div className="text-sm font-black text-green-700 dark:text-green-400">Rs {(parseFloat(buyPrice) * 1.1).toFixed(2)}</div>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="text-[9px] text-red-600/70 uppercase tracking-wider font-medium">Lower Circuit / तल्लो सर्किट (-10%)</div>
                  <div className="text-sm font-black text-red-700 dark:text-red-400">Rs {(parseFloat(buyPrice) * 0.9).toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <>
              {/* Profit/Loss Hero */}
              <div className={`rounded-2xl p-5 text-white relative overflow-hidden ${
                result.isProfit
                  ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500'
                  : 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-500'
              }`}>
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  {result.isProfit
                    ? <TrendingUp className="w-full h-full" />
                    : <TrendingDown className="w-full h-full" />
                  }
                </div>
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] opacity-70 font-semibold uppercase tracking-widest">
                        {result.isProfit ? 'Net Profit (खुद नाफा)' : 'Net Loss (खुद नोक्सानी)'}
                      </p>
                      <p className="text-2xl sm:text-4xl font-black mt-1 tracking-tight break-all">
                        {formatNPR(Math.abs(result.netProfit))}
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      result.isProfit ? 'bg-white/20' : 'bg-white/20'
                    }`}>
                      {result.netProfitPercent >= 0 ? '+' : ''}{result.netProfitPercent.toFixed(2)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs opacity-80">
                    <span className="flex items-center gap-1">
                      <ArrowUpDown className="w-3 h-3" />
                      Price: Rs {result.priceChange >= 0 ? '+' : ''}{result.priceChange.toFixed(2)} ({result.priceChangePercent >= 0 ? '+' : ''}{result.priceChangePercent.toFixed(1)}%)
                    </span>
                    <span>Total Fees: {formatNPR(result.totalFees)}</span>
                  </div>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Investment', ne: 'कुल लगानी', value: formatNPR(result.totalBuyCost), color: 'blue', sub: `${parseInt(quantity)} कित्ता` },
                  { label: 'Receivable', ne: 'प्राप्त रकम', value: formatNPR(result.totalSellReceive), color: 'orange', sub: 'शुल्क कटाएर' },
                  { label: 'CGT', ne: 'पूँजीगत लाभ कर', value: formatNPR(result.capitalGainTax), color: 'purple', sub: `${(result.cgtRate * 100)}% CGT` },
                  { label: 'Break-even', ne: 'बराबर मूल्य', value: `Rs ${result.breakEvenPrice.toFixed(2)}`, color: 'cyan', sub: 'न्यूनतम बिक्री मूल्य' },
                ].map(card => (
                  <div key={card.label} className={`bg-${card.color}-50 dark:bg-${card.color}-900/10 border border-${card.color}-100 dark:border-${card.color}-900/30 rounded-xl p-3 text-center`}>
                    <div className={`text-[9px] sm:text-[10px] text-${card.color}-500/70 uppercase tracking-wider font-medium leading-tight`}>{card.label}<br /><span className="normal-case">{card.ne}</span></div>
                    <div className={`text-xs sm:text-base font-black text-${card.color}-700 dark:text-${card.color}-400 mt-1 break-all`}>{card.value}</div>
                    <div className={`text-[9px] text-${card.color}-400 mt-0.5`}>{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Visual Fee Breakdown Bar */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <PieChart className="w-3.5 h-3.5 text-blue-500" /> Fee Distribution
                </h4>
                <div className="w-full h-6 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-700">
                  {(() => {
                    const total = result.totalFees;
                    if (total <= 0) return null;
                    const segments = [
                      { label: 'Buy Commission', val: result.buyCommission, color: 'bg-blue-500' },
                      { label: 'Sell Commission', val: result.sellCommission, color: 'bg-indigo-500' },
                      { label: 'SEBON Fees', val: result.buySebonFee + result.sellSebonFee, color: 'bg-cyan-500' },
                      { label: 'DP Charges', val: result.buyDp + result.sellDp, color: 'bg-slate-400' },
                      { label: 'CGT', val: result.capitalGainTax, color: 'bg-red-500' },
                    ].filter(s => s.val > 0);
                    return segments.map((seg, i) => (
                      <div key={i} className={`${seg.color} h-full transition-all duration-500`}
                        style={{ width: `${(seg.val / total) * 100}%` }}
                        title={`${seg.label}: ${formatNPR(seg.val)}`}
                      />
                    ));
                  })()}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
                  {[
                    { label: 'Buy Comm.', val: result.buyCommission, color: 'bg-blue-500' },
                    { label: 'Sell Comm.', val: result.sellCommission, color: 'bg-indigo-500' },
                    { label: 'SEBON', val: result.buySebonFee + result.sellSebonFee, color: 'bg-cyan-500' },
                    { label: 'DP', val: result.buyDp + result.sellDp, color: 'bg-slate-400' },
                    ...(result.capitalGainTax > 0 ? [{ label: 'CGT', val: result.capitalGainTax, color: 'bg-red-500' }] : []),
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span>{item.label}: {formatNPR(item.val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Fee Breakdown */}
              <button onClick={() => setShowFeeBreakdown(!showFeeBreakdown)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" /> Detailed Fee Breakdown (Buy + Sell)
                </span>
                {showFeeBreakdown ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {showFeeBreakdown && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: 'BUY SIDE', color: 'blue', rows: [
                      { label: 'Share Amount', value: result.buyAmount },
                      { label: 'Broker Commission', value: result.buyCommission },
                      { label: 'SEBON Fee (0.015%)', value: result.buySebonFee },
                      { label: 'DP Charge', value: result.buyDp },
                    ], total: result.totalBuyCost, totalLabel: 'Total Cost' },
                    { title: 'SELL SIDE', color: 'green', rows: [
                      { label: 'Share Amount', value: result.sellAmount },
                      { label: 'Broker Commission', value: -result.sellCommission },
                      { label: 'SEBON Fee (0.015%)', value: -result.sellSebonFee },
                      { label: 'DP Charge', value: -result.sellDp },
                    ], total: result.totalSellReceive, totalLabel: 'Total Receivable' },
                  ].map(side => (
                    <div key={side.title} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className={`bg-${side.color}-50 dark:bg-${side.color}-900/20 px-4 py-2.5 border-b border-${side.color}-100 dark:border-${side.color}-800`}>
                        <h4 className={`text-xs font-bold text-${side.color}-700 dark:text-${side.color}-400`}>{side.title}</h4>
                      </div>
                      <div className="p-4 space-y-2">
                        {side.rows.map(row => (
                          <div key={row.label} className="flex justify-between text-xs">
                            <span className="text-slate-500">{row.value < 0 && <Minus className="w-2.5 h-2.5 inline mr-0.5 text-red-400" />}{row.label}</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{formatNPR(Math.abs(row.value))}</span>
                          </div>
                        ))}
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 flex justify-between text-xs">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{side.totalLabel}</span>
                          <span className={`font-black text-${side.color}-600`}>{formatNPR(side.total)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* P&L Summary */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">PROFIT / LOSS SUMMARY</h4>
                </div>
                <div className="p-4 space-y-2.5">
                  {[
                    { label: 'Total Buy Cost (all fees)', value: result.totalBuyCost, color: '' },
                    { label: 'Total Sell Receivable (after fees)', value: result.totalSellReceive, color: '' },
                    { label: 'Gross Profit/Loss', value: result.totalSellReceive - result.totalBuyCost, color: result.totalSellReceive - result.totalBuyCost >= 0 ? 'text-green-600' : 'text-red-600' },
                    { label: `Capital Gains Tax (${(result.cgtRate * 100)}%)`, value: -result.capitalGainTax, color: 'text-red-500' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between text-xs">
                      <span className="text-slate-500">{row.label}</span>
                      <span className={`font-semibold ${row.color || 'text-slate-700 dark:text-slate-300'}`}>
                        {row.value < 0 ? `- ${formatNPR(Math.abs(row.value))}` : formatNPR(row.value)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t-2 border-slate-200 dark:border-slate-700 pt-2.5 mt-2 flex justify-between">
                    <span className="text-sm font-black text-slate-700 dark:text-slate-300">Net Profit/Loss</span>
                    <span className={`text-sm font-black ${result.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                      {formatNPR(result.netProfit)} ({result.netProfitPercent >= 0 ? '+' : ''}{result.netProfitPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Effective Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Effective Buy / Share</div>
                  <div className="text-lg font-black text-slate-700 dark:text-slate-300 mt-1">
                    Rs {(result.totalBuyCost / parseInt(quantity || '1')).toFixed(2)}
                  </div>
                  <div className="text-[9px] text-slate-400">incl. all buy-side fees</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Effective Sell / Share</div>
                  <div className="text-lg font-black text-slate-700 dark:text-slate-300 mt-1">
                    Rs {(result.totalSellReceive / parseInt(quantity || '1')).toFixed(2)}
                  </div>
                  <div className="text-[9px] text-slate-400">after all sell-side fees</div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ═══════════════════ TAB 2: WACC ═══════════════════ */}
      {tab === 'wacc' && (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-500" /> Weighted Average Cost Calculator
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 -mt-2">
              Bought the same stock at different prices? Calculate your average cost per share including all fees.
            </p>

            <div className="space-y-3">
              {waccEntries.map((entry, i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      {i === 0 ? 'Buy Price (Rs)' : ''}
                    </label>
                    <input type="number" value={entry.price}
                      onChange={e => updateWaccEntry(i, 'price', e.target.value)}
                      placeholder={`Buy #${i + 1} price`}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      {i === 0 ? 'Quantity (Kitta)' : ''}
                    </label>
                    <input type="number" value={entry.qty}
                      onChange={e => updateWaccEntry(i, 'qty', e.target.value)}
                      placeholder="Kitta"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {waccEntries.length > 2 && (
                    <button onClick={() => removeWaccEntry(i)}
                      className="p-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={addWaccEntry}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Another Buy Transaction
            </button>
          </div>

          {waccResult && (
            <>
              {/* WACC Result Hero */}
              <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-2xl p-5 text-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] opacity-70 font-semibold uppercase tracking-widest">Weighted Average Cost (औसत लागत)</p>
                    <p className="text-2xl sm:text-3xl font-black mt-1 break-all">Rs {waccResult.avgPrice.toFixed(2)}</p>
                    <p className="text-[11px] opacity-80 mt-1">per share (before fees)</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[10px] opacity-70 font-semibold uppercase tracking-widest">Effective Cost (प्रभावकारी लागत)</p>
                    <p className="text-2xl sm:text-3xl font-black mt-1 break-all">Rs {waccResult.effectivePrice.toFixed(2)}</p>
                    <p className="text-[11px] opacity-80 mt-1">per share (with all fees)</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Shares', value: `${waccResult.totalQty} kitta`, color: 'blue' },
                  { label: 'Total Investment', value: formatNPR(waccResult.totalInvestment), color: 'green' },
                  { label: 'Total Commission', value: formatNPR(waccResult.totalCommission), color: 'orange' },
                  { label: 'SEBON + DP', value: formatNPR(waccResult.totalSebon + waccResult.totalDp), color: 'purple' },
                ].map(card => (
                  <div key={card.label} className={`bg-${card.color}-50 dark:bg-${card.color}-900/10 border border-${card.color}-100 dark:border-${card.color}-900/30 rounded-xl p-3 text-center`}>
                    <div className={`text-[10px] text-${card.color}-500/70 uppercase tracking-wider font-medium`}>{card.label}</div>
                    <div className={`text-xs sm:text-sm font-black text-${card.color}-700 dark:text-${card.color}-400 mt-1 break-all`}>{card.value}</div>
                  </div>
                ))}
              </div>

              {/* Per-transaction breakdown */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">TRANSACTION BREAKDOWN</h4>
                </div>
                <div className="overflow-x-auto -mx-px">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left px-2.5 sm:px-4 py-2 font-bold text-slate-500">#</th>
                        <th className="text-right px-2.5 sm:px-4 py-2 font-bold text-slate-500">Price</th>
                        <th className="text-right px-2.5 sm:px-4 py-2 font-bold text-slate-500">Kitta</th>
                        <th className="text-right px-2.5 sm:px-4 py-2 font-bold text-slate-500">Amount</th>
                        <th className="text-right px-2.5 sm:px-4 py-2 font-bold text-slate-500">Wt%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waccResult.entries.map((e, i) => (
                        <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50">
                          <td className="px-2.5 sm:px-4 py-2 text-slate-500 whitespace-nowrap">#{i + 1}</td>
                          <td className="px-2.5 sm:px-4 py-2 text-right font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Rs {e.price.toFixed(0)}</td>
                          <td className="px-2.5 sm:px-4 py-2 text-right text-slate-600 dark:text-slate-400">{e.qty}</td>
                          <td className="px-2.5 sm:px-4 py-2 text-right font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{formatNPR(e.price * e.qty)}</td>
                          <td className="px-2.5 sm:px-4 py-2 text-right text-blue-600 font-bold">{((e.qty / waccResult.totalQty) * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ═══════════════════ TAB 3: TARGET PRICE ═══════════════════ */}
      {tab === 'target' && (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Target Price Calculator</h3>
            </div>
            <p className="text-[11px] text-slate-500 -mt-2">
              Enter your desired profit amount and get the exact sell price needed (after all fees & tax).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Buy Price (Rs)</label>
                <input type="number" value={targetBuyPrice} onChange={e => setTargetBuyPrice(e.target.value)}
                  placeholder="e.g. 500" min="0"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Quantity (Kitta)</label>
                <input type="number" value={targetQty} onChange={e => setTargetQty(e.target.value)}
                  placeholder="e.g. 100" min="1"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Desired Profit (Rs)</label>
                <input type="number" value={targetProfit} onChange={e => setTargetProfit(e.target.value)}
                  placeholder="e.g. 5000" min="0"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Investor Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['individual', 'institutional'] as const).map(type => (
                    <button key={type} onClick={() => setTargetInvestor(type)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                        targetInvestor === type
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500'
                      }`}
                    >{type === 'individual' ? 'Individual' : 'Institutional'}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Holding Period</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: 'long' as const, label: '> 365 Days' },
                    { id: 'short' as const, label: '≤ 365 Days' },
                  ]).map(p => (
                    <button key={p.id} onClick={() => setTargetHolding(p.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                        targetHolding === p.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500'
                      }`}
                    >{p.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {targetResult && (
            <>
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] opacity-70 font-semibold uppercase tracking-widest">Target Sell Price (लक्ष्य बिक्री मूल्य)</p>
                    <p className="text-2xl sm:text-4xl font-black mt-1 break-all">Rs {targetResult.targetSellPrice.toFixed(2)}</p>
                    <p className="text-[11px] opacity-80 mt-1">
                      per share to earn {formatNPR(parseFloat(targetProfit))} नाफा
                    </p>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-full bg-white/20 text-[11px] font-bold shrink-0">
                    +{targetResult.percentIncrease.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Buy Price', value: `Rs ${parseFloat(targetBuyPrice).toFixed(2)}`, color: 'blue' },
                  { label: 'Price Increase Needed', value: `Rs ${targetResult.priceIncrease.toFixed(2)}`, color: 'orange' },
                  { label: 'Total Investment', value: formatNPR(targetResult.totalBuyCost), color: 'green' },
                  { label: 'CGT Rate', value: `${(targetResult.cgtRate * 100)}%`, color: 'purple' },
                ].map(card => (
                  <div key={card.label} className={`bg-${card.color}-50 dark:bg-${card.color}-900/10 border border-${card.color}-100 dark:border-${card.color}-900/30 rounded-xl p-3 text-center`}>
                    <div className={`text-[10px] text-${card.color}-500/70 uppercase tracking-wider font-medium`}>{card.label}</div>
                    <div className={`text-sm font-black text-${card.color}-700 dark:text-${card.color}-400 mt-1`}>{card.value}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* ═══════════════════ Commission Table (always visible) ═══════════════════ */}
      <button onClick={() => setShowCommissionTable(!showCommissionTable)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5" /> SEBON Broker Commission Tiers (2081/2082)
        </span>
        {showCommissionTable ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {showCommissionTable && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50">
                <th className="text-left px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Transaction Amount</th>
                <th className="text-right px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Rate</th>
              </tr>
            </thead>
            <tbody>
              {COMMISSION_TIERS.map((tier, i) => (
                <tr key={i} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${tier.color}`} />
                    {tier.range}
                  </td>
                  <td className="px-4 py-2.5 text-right font-bold text-blue-600 dark:text-blue-400">{tier.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/10 border-t border-amber-100 dark:border-amber-900/30 space-y-1">
            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">Other Charges:</p>
            <div className="text-[10px] text-amber-600 dark:text-amber-500 grid grid-cols-1 sm:grid-cols-3 gap-1">
              <span>SEBON Fee: 0.015%</span>
              <span>DP Charge: Rs 25/transaction</span>
              <span>Min. Commission: Rs 10</span>
            </div>
          </div>
          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-900/30 space-y-1">
            <p className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold">Capital Gains Tax (CGT):</p>
            <div className="text-[10px] text-blue-600 dark:text-blue-500 grid grid-cols-1 sm:grid-cols-3 gap-1">
              <span>Individual (&gt;365 days): 5%</span>
              <span>Individual (≤365 days): 7.5%</span>
              <span>Institutional: 10%</span>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4">
        <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
          <Info className="w-3.5 h-3.5" /> नेप्से शेयर क्यालकुलेटर कसरी काम गर्छ (How It Works)
        </h3>
        <ul className="text-[11px] text-blue-600/80 dark:text-blue-400/80 space-y-1.5">
          <li className="flex gap-2"><ArrowRight className="w-3 h-3 shrink-0 mt-0.5" /> <strong>नाफा/नोक्सानी (Profit/Loss):</strong> किनेको मूल्य, बेचेको मूल्य र कित्ता हालेर खुद नाफा/नोक्सानी हेर्नुहोस्</li>
          <li className="flex gap-2"><ArrowRight className="w-3 h-3 shrink-0 mt-0.5" /> <strong>औसत लागत (WACC):</strong> फरक-फरक मूल्यमा किनेको शेयरको औसत लागत मूल्य गणना गर्नुहोस्</li>
          <li className="flex gap-2"><ArrowRight className="w-3 h-3 shrink-0 mt-0.5" /> <strong>लक्ष्य मूल्य (Target Price):</strong> आफ्नो चाहेको नाफा हाल्नुहोस् र बिक्री मूल्य पत्ता लगाउनुहोस्</li>
          <li className="flex gap-2"><ArrowRight className="w-3 h-3 shrink-0 mt-0.5" /> ब्रोकर कमिसन SEBON को ५-तहको दर अनुसार (०.३६% देखि ०.२४%)</li>
          <li className="flex gap-2"><ArrowRight className="w-3 h-3 shrink-0 mt-0.5" /> सबै शुल्क समावेश: Broker Commission + SEBON Fee (0.015%) + DP (रु २५) + पूँजीगत लाभ कर</li>
          <li className="flex gap-2"><ArrowRight className="w-3 h-3 shrink-0 mt-0.5" /> सर्किट ब्रेकर (Circuit Breaker): किनेको मूल्यबाट ±१०% माथिल्लो/तल्लो सीमा</li>
        </ul>
      </div>
    </div>
  );
}
