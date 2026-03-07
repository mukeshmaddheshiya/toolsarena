'use client';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Building2,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  Download,
  RotateCcw,
  ShieldCheck,
  Bookmark,
  Trash2,
  Info,
  Scale,
  Sparkles,
  Calculator,
  Clock,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BuyingInputs {
  propertyPrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTenure: number;
  appreciationRate: number;
  maintenancePerMonth: number;
  stampDutyPercent: number;
  registrationPercent: number;
  gstPercent: number;
  homeInsurancePerYear: number;
  propertyTaxPerYear: number;
  annualRepairPercent: number;
  section24bEnabled: boolean;
  section80CEnabled: boolean;
}

interface RentingInputs {
  monthlyRent: number;
  rentIncreasePercent: number;
  securityDepositMonths: number;
  brokerFee: number;
  hraEnabled: boolean;
  basicSalary: number;
  isMetro: boolean;
}

interface InvestmentInputs {
  returnRate: number;
}

interface YearlyBreakdown {
  year: number;
  buyingCumulative: number;
  rentingCumulative: number;
  propertyValue: number;
  investmentCorpus: number;
  buyNetWorth: number;
  rentNetWorth: number;
  emi: number;
  rent: number;
}

interface SavedComparison {
  id: string;
  timestamp: number;
  label: string;
  verdict: string;
  breakEvenYear: number | null;
  analysisPeriod: number;
  totalBuyCost: number;
  totalRentCost: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatINR(n: number): string {
  if (Math.abs(n) >= 10_000_000) return `${(n / 10_000_000).toFixed(2)} Cr`;
  if (Math.abs(n) >= 100_000) return `${(n / 100_000).toFixed(2)} L`;
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function formatINRFull(n: number): string {
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function parseFormattedNumber(val: string): number {
  const cleaned = val.replace(/,/g, '').replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

function calculateEMI(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
  const r = annualRate / 12 / 100;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function getLoanBreakdown(
  principal: number,
  annualRate: number,
  years: number
): { principalPaid: number[]; interestPaid: number[] } {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  const emi = calculateEMI(principal, annualRate, years);
  const principalPaid: number[] = [];
  const interestPaid: number[] = [];
  let balance = principal;

  for (let yr = 0; yr < years; yr++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    for (let m = 0; m < 12; m++) {
      if (yr * 12 + m >= n) break;
      const interest = balance * r;
      const princ = emi - interest;
      yearInterest += interest;
      yearPrincipal += princ;
      balance -= princ;
    }
    principalPaid.push(yearPrincipal);
    interestPaid.push(yearInterest);
  }
  return { principalPaid, interestPaid };
}

// ─── Input Component ─────────────────────────────────────────────────────────

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
  formatComma?: boolean;
}

function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
  tooltip,
  formatComma = false,
}: NumberInputProps) {
  const [focused, setFocused] = useState(false);
  const displayValue = focused
    ? String(value)
    : formatComma
      ? formatINRFull(value)
      : String(value);

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
        {label}
        {tooltip && (
          <span className="group relative">
            <Info className="w-3 h-3 text-gray-400 cursor-help" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 max-w-[220px] text-wrap">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-all">
        {prefix && (
          <span className="px-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 h-full py-2 border-r border-gray-200 dark:border-gray-700">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            const num = parseFormattedNumber(e.target.value);
            if (max !== undefined && num > max) return;
            onChange(num);
          }}
          className="w-full px-2 py-2 text-sm bg-transparent outline-none text-gray-900 dark:text-white"
        />
        {suffix && (
          <span className="px-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Slider Input ────────────────────────────────────────────────────────────

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}

function SliderInput({ label, value, onChange, min, max, step = 1, suffix = '' }: SliderInputProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</label>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600"
        style={{
          background: `linear-gradient(to right, #2563eb ${pct}%, #e5e7eb ${pct}%)`,
        }}
      />
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>
          {min}
          {suffix}
        </span>
        <span>
          {max}
          {suffix}
        </span>
      </div>
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

function Toggle({
  label,
  checked,
  onChange,
  tooltip,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  tooltip?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
        {label}
        {tooltip && (
          <span className="group relative">
            <Info className="w-3 h-3 text-gray-400 cursor-help" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 max-w-[220px] text-wrap">
              {tooltip}
            </span>
          </span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : ''}`}
        />
      </button>
    </label>
  );
}

// ─── SVG Chart ───────────────────────────────────────────────────────────────

function CostComparisonChart({
  data,
  breakEvenYear,
}: {
  data: YearlyBreakdown[];
  breakEvenYear: number | null;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 700;
  const height = 320;
  const padding = { top: 30, right: 30, bottom: 40, left: 70 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  if (data.length === 0) return null;

  const maxCost = Math.max(
    ...data.map((d) => Math.max(d.buyingCumulative, d.rentingCumulative))
  );
  const maxY = maxCost * 1.1;

  const xScale = (year: number) => padding.left + ((year - 1) / (data.length - 1 || 1)) * chartW;
  const yScale = (val: number) => padding.top + chartH - (val / maxY) * chartH;

  const buyPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year)} ${yScale(d.buyingCumulative)}`)
    .join(' ');
  const rentPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year)} ${yScale(d.rentingCumulative)}`)
    .join(' ');

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => (maxY / yTicks) * i);

  const xTickInterval = data.length <= 10 ? 1 : data.length <= 20 ? 2 : 5;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-[700px] mx-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {yTickValues.map((val, i) => (
          <g key={`grid-${i}`}>
            <line
              x1={padding.left}
              y1={yScale(val)}
              x2={width - padding.right}
              y2={yScale(val)}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
              strokeWidth={0.5}
            />
            <text
              x={padding.left - 8}
              y={yScale(val) + 4}
              textAnchor="end"
              className="fill-gray-500 dark:fill-gray-400"
              fontSize={10}
            >
              {formatINR(val)}
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {data
          .filter((d) => (d.year - 1) % xTickInterval === 0 || d.year === data.length)
          .map((d) => (
            <text
              key={`x-${d.year}`}
              x={xScale(d.year)}
              y={height - 8}
              textAnchor="middle"
              className="fill-gray-500 dark:fill-gray-400"
              fontSize={10}
            >
              Yr {d.year}
            </text>
          ))}

        {/* Break-even line */}
        {breakEvenYear && breakEvenYear <= data.length && (
          <>
            <line
              x1={xScale(breakEvenYear)}
              y1={padding.top}
              x2={xScale(breakEvenYear)}
              y2={padding.top + chartH}
              stroke="#f59e0b"
              strokeDasharray="6 3"
              strokeWidth={1.5}
            />
            <text
              x={xScale(breakEvenYear)}
              y={padding.top - 8}
              textAnchor="middle"
              className="fill-amber-600 dark:fill-amber-400"
              fontSize={10}
              fontWeight="bold"
            >
              Break-even: Yr {breakEvenYear}
            </text>
          </>
        )}

        {/* Buy line */}
        <motion.path
          d={buyPath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {/* Rent line */}
        <motion.path
          d={rentPath}
          fill="none"
          stroke="#ef4444"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
        />

        {/* Data points */}
        {data.map((d) => (
          <g key={`dots-${d.year}`}>
            <circle
              cx={xScale(d.year)}
              cy={yScale(d.buyingCumulative)}
              r={3}
              fill="#3b82f6"
              className="opacity-60"
            />
            <circle
              cx={xScale(d.year)}
              cy={yScale(d.rentingCumulative)}
              r={3}
              fill="#ef4444"
              className="opacity-60"
            />
          </g>
        ))}

        {/* Legend */}
        <rect x={padding.left + 10} y={padding.top + 4} width={10} height={3} rx={1} fill="#3b82f6" />
        <text x={padding.left + 24} y={padding.top + 8} fontSize={10} className="fill-gray-700 dark:fill-gray-300">
          Buying Cost
        </text>
        <rect x={padding.left + 100} y={padding.top + 4} width={10} height={3} rx={1} fill="#ef4444" />
        <text x={padding.left + 114} y={padding.top + 8} fontSize={10} className="fill-gray-700 dark:fill-gray-300">
          Renting Cost
        </text>
      </svg>
    </div>
  );
}

// ─── Net Worth Chart ─────────────────────────────────────────────────────────

function NetWorthChart({ data }: { data: YearlyBreakdown[] }) {
  const width = 700;
  const height = 280;
  const padding = { top: 30, right: 30, bottom: 40, left: 70 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  if (data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => Math.max(d.buyNetWorth, d.rentNetWorth)));
  const minVal = Math.min(...data.map((d) => Math.min(d.buyNetWorth, d.rentNetWorth)), 0);
  const range = (maxVal - minVal) * 1.1 || 1;

  const xScale = (year: number) => padding.left + ((year - 1) / (data.length - 1 || 1)) * chartW;
  const yScale = (val: number) => padding.top + chartH - ((val - minVal) / range) * chartH;

  const buyPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year)} ${yScale(d.buyNetWorth)}`)
    .join(' ');
  const rentPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year)} ${yScale(d.rentNetWorth)}`)
    .join(' ');

  const xTickInterval = data.length <= 10 ? 1 : data.length <= 20 ? 2 : 5;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[700px] mx-auto" preserveAspectRatio="xMidYMid meet">
        {/* Zero line */}
        {minVal < 0 && (
          <line
            x1={padding.left}
            y1={yScale(0)}
            x2={width - padding.right}
            y2={yScale(0)}
            stroke="#9ca3af"
            strokeWidth={0.5}
          />
        )}

        {/* X axis labels */}
        {data
          .filter((d) => (d.year - 1) % xTickInterval === 0 || d.year === data.length)
          .map((d) => (
            <text key={`nw-x-${d.year}`} x={xScale(d.year)} y={height - 8} textAnchor="middle" fontSize={10} className="fill-gray-500 dark:fill-gray-400">
              Yr {d.year}
            </text>
          ))}

        <motion.path
          d={buyPath}
          fill="none"
          stroke="#10b981"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        <motion.path
          d={rentPath}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
        />

        <rect x={padding.left + 10} y={padding.top + 4} width={10} height={3} rx={1} fill="#10b981" />
        <text x={padding.left + 24} y={padding.top + 8} fontSize={10} className="fill-gray-700 dark:fill-gray-300">
          Buy Net Worth (Property)
        </text>
        <rect x={padding.left + 170} y={padding.top + 4} width={10} height={3} rx={1} fill="#8b5cf6" />
        <text x={padding.left + 184} y={padding.top + 8} fontSize={10} className="fill-gray-700 dark:fill-gray-300">
          Rent Net Worth (Investments)
        </text>
      </svg>
    </div>
  );
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_BUY: BuyingInputs = {
  propertyPrice: 8000000,
  downPaymentPercent: 20,
  interestRate: 8.5,
  loanTenure: 20,
  appreciationRate: 5,
  maintenancePerMonth: 5000,
  stampDutyPercent: 5,
  registrationPercent: 1,
  gstPercent: 0,
  homeInsurancePerYear: 10000,
  propertyTaxPerYear: 15000,
  annualRepairPercent: 0.5,
  section24bEnabled: true,
  section80CEnabled: true,
};

const DEFAULT_RENT: RentingInputs = {
  monthlyRent: 25000,
  rentIncreasePercent: 7,
  securityDepositMonths: 2,
  brokerFee: 25000,
  hraEnabled: true,
  basicSalary: 50000,
  isMetro: true,
};

const DEFAULT_INVEST: InvestmentInputs = {
  returnRate: 12,
};

const EXAMPLE_MUMBAI: { buy: BuyingInputs; rent: RentingInputs; invest: InvestmentInputs; period: number } = {
  buy: {
    propertyPrice: 12000000,
    downPaymentPercent: 20,
    interestRate: 8.5,
    loanTenure: 20,
    appreciationRate: 6,
    maintenancePerMonth: 8000,
    stampDutyPercent: 6,
    registrationPercent: 1,
    gstPercent: 0,
    homeInsurancePerYear: 15000,
    propertyTaxPerYear: 20000,
    annualRepairPercent: 0.5,
    section24bEnabled: true,
    section80CEnabled: true,
  },
  rent: {
    monthlyRent: 35000,
    rentIncreasePercent: 8,
    securityDepositMonths: 3,
    brokerFee: 35000,
    hraEnabled: true,
    basicSalary: 80000,
    isMetro: true,
  },
  invest: { returnRate: 12 },
  period: 15,
};

// ─── Storage Key ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'rent-vs-buy-history';

function loadHistory(): SavedComparison[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedComparison[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: SavedComparison[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 5)));
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function RentVsBuyCalculatorTool() {
  const [buy, setBuy] = useState<BuyingInputs>(DEFAULT_BUY);
  const [rent, setRent] = useState<RentingInputs>(DEFAULT_RENT);
  const [invest, setInvest] = useState<InvestmentInputs>(DEFAULT_INVEST);
  const [analysisPeriod, setAnalysisPeriod] = useState(15);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [history, setHistory] = useState<SavedComparison[]>([]);
  const [calculated, setCalculated] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // ─── Updaters ────────────────────────────────────────────────────────────

  const updateBuy = useCallback(
    <K extends keyof BuyingInputs>(key: K, val: BuyingInputs[K]) => {
      setBuy((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  const updateRent = useCallback(
    <K extends keyof RentingInputs>(key: K, val: RentingInputs[K]) => {
      setRent((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  // ─── Calculations ───────────────────────────────────────────────────────

  const results = useMemo(() => {
    const downPayment = (buy.propertyPrice * buy.downPaymentPercent) / 100;
    const loanAmount = buy.propertyPrice - downPayment;
    const stampDuty = (buy.propertyPrice * buy.stampDutyPercent) / 100;
    const registration = (buy.propertyPrice * buy.registrationPercent) / 100;
    const gst = (buy.propertyPrice * buy.gstPercent) / 100;
    const upfrontBuyCost = downPayment + stampDuty + registration + gst;
    const emi = calculateEMI(loanAmount, buy.interestRate, buy.loanTenure);
    const loanBreakdown = getLoanBreakdown(loanAmount, buy.interestRate, buy.loanTenure);

    // Renting upfront
    const securityDeposit = rent.monthlyRent * rent.securityDepositMonths;
    const upfrontRentCost = securityDeposit + rent.brokerFee;

    // Opportunity cost: difference invested
    const investableUpfront = upfrontBuyCost - upfrontRentCost;
    const monthlyInvestReturn = invest.returnRate / 12 / 100;

    const yearlyData: YearlyBreakdown[] = [];
    let buyCumulative = upfrontBuyCost;
    let rentCumulative = upfrontRentCost;
    let investmentCorpus = Math.max(investableUpfront, 0);
    let currentRent = rent.monthlyRent;
    let propertyValue = buy.propertyPrice;
    let loanOutstanding = loanAmount;
    let breakEvenYear: number | null = null;
    let prevBuyAdvantage: number | null = null;

    for (let yr = 1; yr <= analysisPeriod; yr++) {
      // ── Buying costs this year ──
      const isLoanActive = yr <= buy.loanTenure;
      const yearlyEMI = isLoanActive ? emi * 12 : 0;
      const yearInterest = isLoanActive && yr <= loanBreakdown.interestPaid.length
        ? loanBreakdown.interestPaid[yr - 1]
        : 0;
      const yearPrincipal = isLoanActive && yr <= loanBreakdown.principalPaid.length
        ? loanBreakdown.principalPaid[yr - 1]
        : 0;
      const yearMaintenance = buy.maintenancePerMonth * 12;
      const yearRepairs = (buy.propertyPrice * buy.annualRepairPercent) / 100;
      const yearBuyCost =
        yearlyEMI +
        yearMaintenance +
        buy.homeInsurancePerYear +
        buy.propertyTaxPerYear +
        yearRepairs;

      // Tax benefits for buying
      let taxBenefit = 0;
      if (buy.section24bEnabled && isLoanActive) {
        taxBenefit += Math.min(yearInterest, 200000) * 0.3; // 30% tax bracket
      }
      if (buy.section80CEnabled && isLoanActive) {
        taxBenefit += Math.min(yearPrincipal, 150000) * 0.3;
      }

      buyCumulative += yearBuyCost - taxBenefit;

      // Property appreciation
      propertyValue *= 1 + buy.appreciationRate / 100;
      if (isLoanActive) {
        loanOutstanding -= yearPrincipal;
      }

      // ── Renting costs this year ──
      const yearRentCost = currentRent * 12;
      let hraExemption = 0;
      if (rent.hraEnabled && rent.basicSalary > 0) {
        const hraReceived = rent.basicSalary * (rent.isMetro ? 0.5 : 0.4);
        const rentMinusBasic = currentRent - rent.basicSalary * 0.1;
        const actualHRA = Math.max(Math.min(hraReceived, rentMinusBasic, rent.basicSalary * 0.5), 0);
        hraExemption = actualHRA * 12 * 0.3; // tax saving
      }

      rentCumulative += yearRentCost - hraExemption;

      // Monthly savings invested (EMI - rent, if positive)
      const monthlySaving = isLoanActive ? emi - currentRent : -currentRent;
      if (monthlySaving > 0) {
        // Rent is cheaper, surplus invested
        for (let m = 0; m < 12; m++) {
          investmentCorpus = investmentCorpus * (1 + monthlyInvestReturn) + monthlySaving;
        }
      } else {
        // Buying is cheaper monthly, just grow existing corpus
        for (let m = 0; m < 12; m++) {
          investmentCorpus = investmentCorpus * (1 + monthlyInvestReturn);
        }
      }

      // Also invest the maintenance / insurance / tax diff for renter
      const extraBuyCosts = yearMaintenance + buy.homeInsurancePerYear + buy.propertyTaxPerYear + yearRepairs;
      if (!isLoanActive) {
        // After loan tenure, invest the full EMI savings too
        for (let m = 0; m < 12; m++) {
          investmentCorpus = investmentCorpus * (1 + monthlyInvestReturn) + emi;
        }
      }

      // Rent increase for next year
      currentRent *= 1 + rent.rentIncreasePercent / 100;

      // Net worth
      const buyNetWorth = propertyValue - Math.max(loanOutstanding, 0);
      const rentNetWorth = investmentCorpus + securityDeposit;

      // Break-even detection
      const buyAdvantage = rentCumulative - buyCumulative;
      if (prevBuyAdvantage !== null && prevBuyAdvantage < 0 && buyAdvantage >= 0 && !breakEvenYear) {
        breakEvenYear = yr;
      }
      prevBuyAdvantage = buyAdvantage;

      yearlyData.push({
        year: yr,
        buyingCumulative: buyCumulative,
        rentingCumulative: rentCumulative,
        propertyValue,
        investmentCorpus,
        buyNetWorth,
        rentNetWorth,
        emi: isLoanActive ? emi : 0,
        rent: currentRent / (1 + rent.rentIncreasePercent / 100), // current year rent
      });
    }

    const lastYear = yearlyData[yearlyData.length - 1];
    const totalBuyCost = buyCumulative;
    const totalRentCost = rentCumulative;
    const isBuyingBetter = lastYear ? lastYear.buyNetWorth > lastYear.rentNetWorth : false;

    let verdict: string;
    if (breakEvenYear) {
      verdict = isBuyingBetter
        ? `Buying becomes better after year ${breakEvenYear}. Over ${analysisPeriod} years, buying builds more wealth.`
        : `Despite break-even at year ${breakEvenYear} on costs, renting + investing yields higher net worth over ${analysisPeriod} years.`;
    } else if (totalBuyCost < totalRentCost) {
      verdict = `Buying is cheaper over ${analysisPeriod} years by ${formatINR(totalRentCost - totalBuyCost)}.`;
    } else {
      verdict = `Renting is better for ${analysisPeriod} years. You save ${formatINR(totalBuyCost - totalRentCost)} in total costs.`;
    }

    return {
      yearlyData,
      breakEvenYear,
      totalBuyCost,
      totalRentCost,
      emi,
      loanAmount,
      upfrontBuyCost,
      upfrontRentCost,
      propertyValue: lastYear?.propertyValue ?? buy.propertyPrice,
      investmentCorpus: lastYear?.investmentCorpus ?? 0,
      buyNetWorth: lastYear?.buyNetWorth ?? 0,
      rentNetWorth: lastYear?.rentNetWorth ?? 0,
      isBuyingBetter,
      verdict,
    };
  }, [buy, rent, invest, analysisPeriod]);

  // ─── Actions ────────────────────────────────────────────────────────────

  const handleCalculate = () => {
    setCalculated(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setBuy(DEFAULT_BUY);
    setRent(DEFAULT_RENT);
    setInvest(DEFAULT_INVEST);
    setAnalysisPeriod(15);
    setCalculated(false);
  };

  const handleTryExample = () => {
    setBuy(EXAMPLE_MUMBAI.buy);
    setRent(EXAMPLE_MUMBAI.rent);
    setInvest(EXAMPLE_MUMBAI.invest);
    setAnalysisPeriod(EXAMPLE_MUMBAI.period);
    setCalculated(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleSaveComparison = () => {
    const entry: SavedComparison = {
      id: Date.now().toString(36),
      timestamp: Date.now(),
      label: `${formatINR(buy.propertyPrice)} property, ${analysisPeriod}yr`,
      verdict: results.isBuyingBetter ? 'Buy' : 'Rent',
      breakEvenYear: results.breakEvenYear,
      analysisPeriod,
      totalBuyCost: results.totalBuyCost,
      totalRentCost: results.totalRentCost,
    };
    const updated = [entry, ...history].slice(0, 5);
    setHistory(updated);
    saveHistory(updated);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    saveHistory(updated);
  };

  const handleExportCSV = () => {
    const headers = [
      'Year',
      'Buying Cumulative (INR)',
      'Renting Cumulative (INR)',
      'Property Value (INR)',
      'Investment Corpus (INR)',
      'Buy Net Worth (INR)',
      'Rent Net Worth (INR)',
      'EMI (INR)',
      'Monthly Rent (INR)',
    ];
    const rows = results.yearlyData.map((d) =>
      [
        d.year,
        Math.round(d.buyingCumulative),
        Math.round(d.rentingCumulative),
        Math.round(d.propertyValue),
        Math.round(d.investmentCorpus),
        Math.round(d.buyNetWorth),
        Math.round(d.rentNetWorth),
        Math.round(d.emi),
        Math.round(d.rent),
      ].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rent-vs-buy-${analysisPeriod}yr.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm">
            <Scale className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold">Rent vs Buy Calculator</h2>
            <p className="text-blue-100 text-sm mt-1">
              Compare the true cost of renting vs buying a home in India with tax benefits, appreciation, and investment returns.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleTryExample}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Try Mumbai Example
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </motion.div>

      {/* Two-column Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── LEFT: Buying ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
            <Home className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Buying Details</h3>
          </div>

          <NumberInput
            label="Property Price"
            value={buy.propertyPrice}
            onChange={(v) => updateBuy('propertyPrice', v)}
            prefix="INR"
            formatComma
            tooltip="Total market price of the property"
          />

          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Down Payment"
              value={buy.downPaymentPercent}
              onChange={(v) => updateBuy('downPaymentPercent', v)}
              suffix="%"
              max={90}
              tooltip="Percentage of property price paid upfront"
            />
            <NumberInput
              label="Loan Interest Rate"
              value={buy.interestRate}
              onChange={(v) => updateBuy('interestRate', v)}
              suffix="% p.a."
              max={20}
              step={0.1}
            />
          </div>

          <SliderInput
            label="Loan Tenure"
            value={buy.loanTenure}
            onChange={(v) => updateBuy('loanTenure', v)}
            min={5}
            max={30}
            suffix=" yrs"
          />

          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Appreciation Rate"
              value={buy.appreciationRate}
              onChange={(v) => updateBuy('appreciationRate', v)}
              suffix="% p.a."
              max={20}
              step={0.5}
              tooltip="Annual property value increase"
            />
            <NumberInput
              label="Maintenance / Month"
              value={buy.maintenancePerMonth}
              onChange={(v) => updateBuy('maintenancePerMonth', v)}
              prefix="INR"
              formatComma
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Stamp Duty"
              value={buy.stampDutyPercent}
              onChange={(v) => updateBuy('stampDutyPercent', v)}
              suffix="%"
              max={12}
              step={0.5}
              tooltip="Varies by state: Maharashtra 5%, Karnataka 5.6%, Delhi 6%"
            />
            <NumberInput
              label="Registration Charges"
              value={buy.registrationPercent}
              onChange={(v) => updateBuy('registrationPercent', v)}
              suffix="%"
              max={5}
              step={0.5}
            />
          </div>

          {/* Tax benefits */}
          <div className="space-y-2 pt-2">
            <Toggle
              label="Section 24(b) - Interest Deduction (up to 2L)"
              checked={buy.section24bEnabled}
              onChange={(v) => updateBuy('section24bEnabled', v)}
              tooltip="Deduction on home loan interest up to Rs 2,00,000 per year"
            />
            <Toggle
              label="Section 80C - Principal Deduction (up to 1.5L)"
              checked={buy.section80CEnabled}
              onChange={(v) => updateBuy('section80CEnabled', v)}
              tooltip="Deduction on home loan principal up to Rs 1,50,000 per year"
            />
          </div>

          {/* Advanced */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium pt-1"
          >
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Advanced Settings
          </button>
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-3"
              >
                <NumberInput
                  label="GST (Under-construction)"
                  value={buy.gstPercent}
                  onChange={(v) => updateBuy('gstPercent', v)}
                  suffix="%"
                  max={18}
                  step={0.5}
                  tooltip="5% GST on under-construction properties, 0% for ready-to-move"
                />
                <div className="grid grid-cols-2 gap-3">
                  <NumberInput
                    label="Home Insurance / Year"
                    value={buy.homeInsurancePerYear}
                    onChange={(v) => updateBuy('homeInsurancePerYear', v)}
                    prefix="INR"
                    formatComma
                  />
                  <NumberInput
                    label="Property Tax / Year"
                    value={buy.propertyTaxPerYear}
                    onChange={(v) => updateBuy('propertyTaxPerYear', v)}
                    prefix="INR"
                    formatComma
                  />
                </div>
                <NumberInput
                  label="Annual Maintenance & Repair"
                  value={buy.annualRepairPercent}
                  onChange={(v) => updateBuy('annualRepairPercent', v)}
                  suffix="% of property"
                  max={3}
                  step={0.1}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── RIGHT: Renting ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
            <Building2 className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Renting Details</h3>
          </div>

          <NumberInput
            label="Monthly Rent"
            value={rent.monthlyRent}
            onChange={(v) => updateRent('monthlyRent', v)}
            prefix="INR"
            formatComma
          />

          <NumberInput
            label="Rent Increase Per Year"
            value={rent.rentIncreasePercent}
            onChange={(v) => updateRent('rentIncreasePercent', v)}
            suffix="% p.a."
            max={20}
            step={0.5}
            tooltip="Typical rental escalation is 5-10% per year in Indian metros"
          />

          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Security Deposit"
              value={rent.securityDepositMonths}
              onChange={(v) => updateRent('securityDepositMonths', v)}
              suffix="months"
              max={12}
            />
            <NumberInput
              label="Broker Fee (one-time)"
              value={rent.brokerFee}
              onChange={(v) => updateRent('brokerFee', v)}
              prefix="INR"
              formatComma
            />
          </div>

          {/* HRA */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <Toggle
              label="Claim HRA Tax Exemption"
              checked={rent.hraEnabled}
              onChange={(v) => updateRent('hraEnabled', v)}
              tooltip="House Rent Allowance tax exemption for salaried employees"
            />
            {rent.hraEnabled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 pl-2 border-l-2 border-blue-200 dark:border-blue-800 ml-1"
              >
                <NumberInput
                  label="Basic Salary / Month"
                  value={rent.basicSalary}
                  onChange={(v) => updateRent('basicSalary', v)}
                  prefix="INR"
                  formatComma
                  tooltip="Your basic salary component (not gross)"
                />
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 dark:text-gray-400">City:</span>
                  <button
                    onClick={() => updateRent('isMetro', true)}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                      rent.isMetro
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Metro (50% HRA)
                  </button>
                  <button
                    onClick={() => updateRent('isMetro', false)}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                      !rent.isMetro
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Non-Metro (40% HRA)
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Investment */}
          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Investment Returns</h4>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 -mt-1">
              If renting, the saved down payment + stamp duty amount gets invested. Monthly EMI-rent difference also invested.
            </p>
            <NumberInput
              label="Expected Annual Return"
              value={invest.returnRate}
              onChange={(v) => setInvest({ returnRate: v })}
              suffix="% p.a."
              max={25}
              step={0.5}
              tooltip="Equity MF ~12%, FD ~7%, Index Fund ~10-14%"
            />
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'FD (7%)', rate: 7 },
                { label: 'Index Fund (10%)', rate: 10 },
                { label: 'Equity MF (12%)', rate: 12 },
                { label: 'Aggressive (15%)', rate: 15 },
              ].map((preset) => (
                <button
                  key={preset.rate}
                  onClick={() => setInvest({ returnRate: preset.rate })}
                  className={`px-2.5 py-1 text-[11px] rounded-full transition-colors ${
                    invest.returnRate === preset.rate
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 ring-1 ring-green-300 dark:ring-green-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Analysis Period + Calculate */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4"
      >
        <SliderInput
          label="Analysis Period"
          value={analysisPeriod}
          onChange={setAnalysisPeriod}
          min={5}
          max={30}
          suffix=" years"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCalculate}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
          >
            <Calculator className="w-4 h-4" />
            Compare Rent vs Buy
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </button>
        </div>
      </motion.div>

      {/* ─── Results ────────────────────────────────────────────────────────── */}
      {calculated && (
        <div ref={resultsRef} className="space-y-5">
          {/* Verdict Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl p-6 border-2 ${
              results.isBuyingBetter
                ? 'bg-blue-50 dark:bg-blue-900/15 border-blue-200 dark:border-blue-800'
                : 'bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl ${
                  results.isBuyingBetter
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}
              >
                {results.isBuyingBetter ? (
                  <Home className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Building2 className="w-7 h-7 text-red-500 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {results.isBuyingBetter ? 'Buying is Better' : 'Renting is Better'}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                    over {analysisPeriod} years
                  </span>
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{results.verdict}</p>
                {results.breakEvenYear && (
                  <div className="flex items-center gap-1.5 mt-2 text-amber-700 dark:text-amber-400 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Break-even at Year {results.breakEvenYear}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: 'Monthly EMI',
                value: `${formatINR(results.emi)}`,
                sub: `Loan: ${formatINR(results.loanAmount)}`,
                icon: IndianRupee,
                color: 'text-blue-600 dark:text-blue-400',
                bg: 'bg-blue-50 dark:bg-blue-900/15',
              },
              {
                label: 'Total Buy Cost',
                value: `${formatINR(results.totalBuyCost)}`,
                sub: `Upfront: ${formatINR(results.upfrontBuyCost)}`,
                icon: Home,
                color: 'text-blue-600 dark:text-blue-400',
                bg: 'bg-blue-50 dark:bg-blue-900/15',
              },
              {
                label: 'Total Rent Cost',
                value: `${formatINR(results.totalRentCost)}`,
                sub: `Upfront: ${formatINR(results.upfrontRentCost)}`,
                icon: Building2,
                color: 'text-red-500 dark:text-red-400',
                bg: 'bg-red-50 dark:bg-red-900/15',
              },
              {
                label: 'Cost Difference',
                value: `${formatINR(Math.abs(results.totalBuyCost - results.totalRentCost))}`,
                sub: results.totalBuyCost > results.totalRentCost ? 'Renting saves' : 'Buying saves',
                icon: results.totalBuyCost > results.totalRentCost ? TrendingDown : TrendingUp,
                color:
                  results.totalBuyCost > results.totalRentCost
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-blue-600 dark:text-blue-400',
                bg:
                  results.totalBuyCost > results.totalRentCost
                    ? 'bg-green-50 dark:bg-green-900/15'
                    : 'bg-blue-50 dark:bg-blue-900/15',
              },
            ].map((card) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`${card.bg} rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50`}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                  <span className="text-[11px] text-gray-600 dark:text-gray-400 font-medium">{card.label}</span>
                </div>
                <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{card.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Net Worth Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/15 dark:to-green-900/10 rounded-xl p-5 border border-green-200/50 dark:border-green-800/50"
            >
              <h4 className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-2">
                Buy Net Worth (Year {analysisPeriod})
              </h4>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatINR(results.buyNetWorth)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Property value: {formatINR(results.propertyValue)}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/15 dark:to-purple-900/10 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/50"
            >
              <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide mb-2">
                Rent Net Worth (Year {analysisPeriod})
              </h4>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatINR(results.rentNetWorth)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Investment corpus: {formatINR(results.investmentCorpus)}
              </p>
            </motion.div>
          </div>

          {/* Charts */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Cumulative Cost Over Time
            </h3>
            <CostComparisonChart data={results.yearlyData} breakEvenYear={results.breakEvenYear} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Net Worth Comparison Over Time
            </h3>
            <NetWorthChart data={results.yearlyData} />
          </motion.div>

          {/* Year-by-Year Table */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                Year-by-Year Breakdown
              </h3>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-400">Year</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-blue-600 dark:text-blue-400">Buy Cost</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-red-500 dark:text-red-400">Rent Cost</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Property Val.</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Invest. Corpus</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-green-600 dark:text-green-400 hidden md:table-cell">Buy NW</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-purple-600 dark:text-purple-400 hidden md:table-cell">Rent NW</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-gray-600 dark:text-gray-400">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyData.map((row) => {
                    const winner = row.buyNetWorth > row.rentNetWorth;
                    const isBreakEven = row.year === results.breakEvenYear;
                    return (
                      <tr
                        key={row.year}
                        className={`border-t border-gray-100 dark:border-gray-700/50 ${
                          isBreakEven ? 'bg-amber-50 dark:bg-amber-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                      >
                        <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                          {row.year}
                          {isBreakEven && (
                            <span className="ml-1 text-[9px] text-amber-600 dark:text-amber-400 font-bold">
                              BE
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right text-blue-700 dark:text-blue-300">
                          {formatINR(row.buyingCumulative)}
                        </td>
                        <td className="px-3 py-2 text-right text-red-600 dark:text-red-300">
                          {formatINR(row.rentingCumulative)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                          {formatINR(row.propertyValue)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                          {formatINR(row.investmentCorpus)}
                        </td>
                        <td className="px-3 py-2 text-right text-green-700 dark:text-green-300 hidden md:table-cell">
                          {formatINR(row.buyNetWorth)}
                        </td>
                        <td className="px-3 py-2 text-right text-purple-700 dark:text-purple-300 hidden md:table-cell">
                          {formatINR(row.rentNetWorth)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              winner
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300'
                            }`}
                          >
                            {winner ? 'Buy' : 'Rent'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSaveComparison}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-100 dark:bg-indigo-900/20 hover:bg-indigo-200 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-medium transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              Save Comparison
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export as CSV
            </button>
          </div>
        </div>
      )}

      {/* ─── History ───────────────────────────────────────────────────────── */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Saved Comparisons
          </h3>
          <div className="space-y-2">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {h.label}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Verdict:{' '}
                    <span
                      className={
                        h.verdict === 'Buy'
                          ? 'text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-red-500 dark:text-red-400 font-semibold'
                      }
                    >
                      {h.verdict}
                    </span>
                    {h.breakEvenYear && ` | Break-even: Yr ${h.breakEvenYear}`}
                    {' | '}Buy: {formatINR(h.totalBuyCost)} | Rent: {formatINR(h.totalRentCost)}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(h.timestamp).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteHistory(h.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Privacy Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 py-2">
        <ShieldCheck className="w-4 h-4" />
        All calculations run locally in your browser. No data is sent to any server.
      </div>
    </div>
  );
}
