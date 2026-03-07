'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, MapPin, User, IndianRupee, TrendingDown, Download,
  RotateCcw, ShieldCheck, History, Lightbulb, BarChart3, ChevronDown,
  ArrowUpDown, X, Home, Factory, Landmark, Tractor
} from 'lucide-react';

/* ─── Types ─── */
type PropertyType = 'residential' | 'commercial' | 'agricultural' | 'industrial';
type BuyerCategory = 'male' | 'female' | 'joint' | 'senior';
type ConstructionStatus = 'ready' | 'under_construction_affordable' | 'under_construction_non_affordable';

interface StampDutyRate {
  male: number;
  female: number;
  joint: number;
  senior: number;
}

interface StateData {
  name: string;
  stampDuty: StampDutyRate;
  registration: number;
  municipal: number;
  notes: string;
}

interface CalcResult {
  stampDuty: number;
  registration: number;
  municipal: number;
  gst: number;
  total: number;
  effectiveRate: number;
}

interface HistoryEntry {
  id: string;
  date: string;
  state: string;
  propertyValue: number;
  propertyType: PropertyType;
  buyer: BuyerCategory;
  result: CalcResult;
}

/* ─── State Data (28 States + 8 UTs) ─── */
const STATES_DATA: Record<string, StateData> = {
  'andhra-pradesh': { name: 'Andhra Pradesh', stampDuty: { male: 5, female: 5, joint: 5, senior: 5 }, registration: 0.5, municipal: 1, notes: '5% uniform stamp duty for all buyers' },
  'arunachal-pradesh': { name: 'Arunachal Pradesh', stampDuty: { male: 6, female: 6, joint: 6, senior: 6 }, registration: 1, municipal: 0, notes: '6% uniform stamp duty' },
  'assam': { name: 'Assam', stampDuty: { male: 8.25, female: 8.25, joint: 8.25, senior: 8.25 }, registration: 0, municipal: 0, notes: '8.25% inclusive of registration' },
  'bihar': { name: 'Bihar', stampDuty: { male: 6.3, female: 6.3, joint: 6.3, senior: 6.3 }, registration: 2, municipal: 0, notes: '6.3% stamp duty + 2% registration' },
  'chhattisgarh': { name: 'Chhattisgarh', stampDuty: { male: 5, female: 4, joint: 4.5, senior: 5 }, registration: 4, municipal: 0, notes: 'Women get 1% concession' },
  'goa': { name: 'Goa', stampDuty: { male: 3.5, female: 3.5, joint: 3.5, senior: 3.5 }, registration: 1, municipal: 0, notes: '3.5% for properties up to Rs 50L, higher slabs above' },
  'gujarat': { name: 'Gujarat', stampDuty: { male: 4.9, female: 4.9, joint: 4.9, senior: 4.9 }, registration: 1, municipal: 0, notes: '4.9% uniform stamp duty across Gujarat' },
  'haryana': { name: 'Haryana', stampDuty: { male: 7, female: 5, joint: 6, senior: 7 }, registration: 1.5, municipal: 0, notes: 'Urban: 7%M/5%F, Rural: 5%M/3%F. Shown: urban rates' },
  'himachal-pradesh': { name: 'Himachal Pradesh', stampDuty: { male: 6, female: 4, joint: 5, senior: 6 }, registration: 2, municipal: 0, notes: 'Women get 2% concession on stamp duty' },
  'jharkhand': { name: 'Jharkhand', stampDuty: { male: 4, female: 4, joint: 4, senior: 4 }, registration: 3, municipal: 0, notes: '4% stamp duty + 3% registration fee' },
  'karnataka': { name: 'Karnataka', stampDuty: { male: 5, female: 5, joint: 5, senior: 5 }, registration: 1, municipal: 0, notes: '5% stamp duty + 1% registration, surcharge on high-value properties' },
  'kerala': { name: 'Kerala', stampDuty: { male: 8, female: 8, joint: 8, senior: 8 }, registration: 2, municipal: 0, notes: '8% stamp duty + 2% registration (highest in India)' },
  'madhya-pradesh': { name: 'Madhya Pradesh', stampDuty: { male: 7.5, female: 7.5, joint: 7.5, senior: 7.5 }, registration: 3, municipal: 0, notes: '7.5% stamp duty + 3% registration' },
  'maharashtra': { name: 'Maharashtra', stampDuty: { male: 6, female: 5, joint: 5.5, senior: 6 }, registration: 1, municipal: 1, notes: 'Mumbai: 6%M/5%F. Rest of state: 5%M/4%F. Shown: Mumbai rates' },
  'manipur': { name: 'Manipur', stampDuty: { male: 7, female: 7, joint: 7, senior: 7 }, registration: 3, municipal: 0, notes: '7% stamp duty + 3% registration' },
  'meghalaya': { name: 'Meghalaya', stampDuty: { male: 9.9, female: 9.9, joint: 9.9, senior: 9.9 }, registration: 0, municipal: 0, notes: '9.9% inclusive of all charges' },
  'mizoram': { name: 'Mizoram', stampDuty: { male: 5, female: 5, joint: 5, senior: 5 }, registration: 0, municipal: 0, notes: '5% stamp duty on property transactions' },
  'nagaland': { name: 'Nagaland', stampDuty: { male: 8.25, female: 8.25, joint: 8.25, senior: 8.25 }, registration: 0, municipal: 0, notes: '8.25% inclusive of registration' },
  'odisha': { name: 'Odisha', stampDuty: { male: 5, female: 4, joint: 4.5, senior: 5 }, registration: 2, municipal: 0, notes: 'Women get 1% concession on stamp duty' },
  'punjab': { name: 'Punjab', stampDuty: { male: 7, female: 5, joint: 6, senior: 7 }, registration: 1, municipal: 0, notes: '7% male, 5% female, 6% joint ownership' },
  'rajasthan': { name: 'Rajasthan', stampDuty: { male: 5, female: 4, joint: 4.5, senior: 5 }, registration: 1, municipal: 0, notes: '5% male, 4% female + 1% registration' },
  'sikkim': { name: 'Sikkim', stampDuty: { male: 5, female: 5, joint: 5, senior: 5 }, registration: 1, municipal: 0, notes: '5% stamp duty + 1% registration' },
  'tamil-nadu': { name: 'Tamil Nadu', stampDuty: { male: 7, female: 7, joint: 7, senior: 7 }, registration: 4, municipal: 0, notes: '7% stamp duty + 4% registration (one of the highest total)' },
  'telangana': { name: 'Telangana', stampDuty: { male: 4, female: 4, joint: 4, senior: 4 }, registration: 0.5, municipal: 1, notes: '4% stamp duty + 0.5% registration + transfer duty' },
  'tripura': { name: 'Tripura', stampDuty: { male: 5, female: 5, joint: 5, senior: 5 }, registration: 1, municipal: 0, notes: '5% stamp duty + 1% registration' },
  'uttar-pradesh': { name: 'Uttar Pradesh', stampDuty: { male: 7, female: 6, joint: 6.5, senior: 7 }, registration: 1, municipal: 0, notes: '7% male, 6% female + 1% registration' },
  'uttarakhand': { name: 'Uttarakhand', stampDuty: { male: 5, female: 3.75, joint: 4.375, senior: 5 }, registration: 2, municipal: 0, notes: 'Women get 25% concession on stamp duty' },
  'west-bengal': { name: 'West Bengal', stampDuty: { male: 7, female: 7, joint: 7, senior: 7 }, registration: 1, municipal: 0, notes: '6% up to Rs 40L, 7% above Rs 40L. Shown: 7% rate' },
  /* Union Territories */
  'andaman-nicobar': { name: 'Andaman & Nicobar', stampDuty: { male: 5, female: 5, joint: 5, senior: 5 }, registration: 1, municipal: 0, notes: '5% stamp duty as per central norms' },
  'chandigarh': { name: 'Chandigarh', stampDuty: { male: 6, female: 4, joint: 5, senior: 6 }, registration: 1, municipal: 0, notes: 'Women get 2% concession' },
  'dadra-nagar-haveli': { name: 'Dadra & Nagar Haveli and Daman & Diu', stampDuty: { male: 5, female: 5, joint: 5, senior: 5 }, registration: 2, municipal: 0, notes: '5% stamp duty + 2% registration' },
  'delhi': { name: 'Delhi', stampDuty: { male: 6, female: 4, joint: 5, senior: 6 }, registration: 1, municipal: 0, notes: '6% male, 4% female + 1% registration' },
  'jammu-kashmir': { name: 'Jammu & Kashmir', stampDuty: { male: 7, female: 3, joint: 5, senior: 7 }, registration: 1.2, municipal: 0, notes: 'Women get significant concession at 3%' },
  'ladakh': { name: 'Ladakh', stampDuty: { male: 7, female: 3, joint: 5, senior: 7 }, registration: 1.2, municipal: 0, notes: 'Same rates as Jammu & Kashmir' },
  'lakshadweep': { name: 'Lakshadweep', stampDuty: { male: 5, female: 5, joint: 5, senior: 5 }, registration: 1, municipal: 0, notes: '5% stamp duty' },
  'puducherry': { name: 'Puducherry', stampDuty: { male: 6, female: 6, joint: 6, senior: 6 }, registration: 2, municipal: 0, notes: '6% stamp duty + 2% registration' },
};

const PROPERTY_TYPES: { value: PropertyType; label: string; icon: typeof Home }[] = [
  { value: 'residential', label: 'Residential', icon: Home },
  { value: 'commercial', label: 'Commercial', icon: Building2 },
  { value: 'agricultural', label: 'Agricultural', icon: Tractor },
  { value: 'industrial', label: 'Industrial', icon: Factory },
];

const BUYER_CATEGORIES: { value: BuyerCategory; label: string; desc: string }[] = [
  { value: 'male', label: 'Male', desc: 'Standard rate' },
  { value: 'female', label: 'Female', desc: 'Concession in many states' },
  { value: 'joint', label: 'Joint (M+F)', desc: 'Partial concession' },
  { value: 'senior', label: 'Senior Citizen', desc: 'May vary by state' },
];

/* ─── Helpers ─── */
const formatINR = (n: number): string => {
  if (n >= 10000000) return '\u20B9' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000) return '\u20B9' + (n / 100000).toFixed(2) + ' L';
  return '\u20B9' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

const formatINRFull = (n: number): string =>
  '\u20B9' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

const parseINRInput = (val: string): string => val.replace(/,/g, '');

const formatWithCommas = (val: string): string => {
  const num = val.replace(/[^0-9]/g, '');
  if (!num) return '';
  return parseInt(num).toLocaleString('en-IN');
};

/* ─── Component ─── */
export function StampDutyCalculatorTool() {
  const [selectedState, setSelectedState] = useState('maharashtra');
  const [propertyType, setPropertyType] = useState<PropertyType>('residential');
  const [buyerCategory, setBuyerCategory] = useState<BuyerCategory>('male');
  const [propertyValueRaw, setPropertyValueRaw] = useState('');
  const [constructionStatus, setConstructionStatus] = useState<ConstructionStatus>('ready');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [compSortKey, setCompSortKey] = useState<'name' | 'total'>('total');
  const [compSortAsc, setCompSortAsc] = useState(true);
  const [stateSearch, setStateSearch] = useState('');
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);

  const propertyValue = parseFloat(parseINRInput(propertyValueRaw)) || 0;
  const stateData = STATES_DATA[selectedState];

  /* Load history */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('stamp-duty-history');
      if (saved) setHistory(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  /* Save history */
  const saveHistory = useCallback((entry: HistoryEntry) => {
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 5);
      localStorage.setItem('stamp-duty-history', JSON.stringify(next));
      return next;
    });
  }, []);

  /* Calculate stamp duty for given state & buyer */
  const calcForState = useCallback((stateKey: string, buyer: BuyerCategory, value: number): CalcResult => {
    const sd = STATES_DATA[stateKey];
    if (!sd || value <= 0) return { stampDuty: 0, registration: 0, municipal: 0, gst: 0, total: 0, effectiveRate: 0 };

    let stampRate = sd.stampDuty[buyer];
    // Property type adjustments
    if (propertyType === 'agricultural') stampRate = Math.max(stampRate - 1, 2);
    if (propertyType === 'commercial') stampRate = Math.min(stampRate + 1, 12);
    if (propertyType === 'industrial') stampRate = Math.min(stampRate + 0.5, 10);

    const stampDuty = value * stampRate / 100;
    const registration = value * sd.registration / 100;
    const municipal = value * sd.municipal / 100;

    let gst = 0;
    if (constructionStatus === 'under_construction_non_affordable') gst = value * 5 / 100;
    else if (constructionStatus === 'under_construction_affordable') gst = value * 1 / 100;

    const total = stampDuty + registration + municipal + gst;
    const effectiveRate = value > 0 ? (total / value) * 100 : 0;

    return { stampDuty, registration, municipal, gst, total, effectiveRate };
  }, [propertyType, constructionStatus]);

  const result = useMemo(() => calcForState(selectedState, buyerCategory, propertyValue),
    [calcForState, selectedState, buyerCategory, propertyValue]);

  /* Comparison across top states */
  const comparisonData = useMemo(() => {
    if (propertyValue <= 0) return [];
    const topStates = [
      'maharashtra', 'delhi', 'karnataka', 'tamil-nadu', 'uttar-pradesh',
      'rajasthan', 'gujarat', 'telangana', 'west-bengal', 'haryana',
      'madhya-pradesh', 'kerala', 'punjab', 'bihar'
    ];
    const data = topStates.map(key => ({
      key,
      name: STATES_DATA[key].name,
      ...calcForState(key, buyerCategory, propertyValue),
    }));
    data.sort((a, b) => {
      if (compSortKey === 'name') return compSortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      return compSortAsc ? a.total - b.total : b.total - a.total;
    });
    return data;
  }, [propertyValue, buyerCategory, calcForState, compSortKey, compSortAsc]);

  /* Max for bar chart */
  const maxTotal = useMemo(() => Math.max(...comparisonData.map(d => d.total), 1), [comparisonData]);

  /* Handle property value input */
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '');
    if (raw === '' || /^\d+$/.test(raw)) {
      setPropertyValueRaw(raw ? formatWithCommas(raw) : '');
    }
  };

  /* Save calc to history */
  const handleSaveToHistory = () => {
    if (propertyValue <= 0) return;
    saveHistory({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-IN'),
      state: stateData.name,
      propertyValue,
      propertyType,
      buyer: buyerCategory,
      result,
    });
  };

  /* Export PDF */
  const handleExportPDF = () => {
    if (propertyValue <= 0) return;
    const content = `
STAMP DUTY CALCULATION REPORT
================================
Generated on: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
Source: ToolsArena.in

PROPERTY DETAILS
----------------
State: ${stateData.name}
Property Type: ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
Buyer Category: ${buyerCategory.charAt(0).toUpperCase() + buyerCategory.slice(1)}
Property Value: ${formatINRFull(propertyValue)}
Construction Status: ${constructionStatus === 'ready' ? 'Ready to Move' : constructionStatus === 'under_construction_affordable' ? 'Under Construction (Affordable)' : 'Under Construction (Non-Affordable)'}

COST BREAKDOWN
--------------
Stamp Duty:          ${formatINRFull(result.stampDuty)}
Registration Fee:    ${formatINRFull(result.registration)}
Municipal Charges:   ${formatINRFull(result.municipal)}
GST:                 ${formatINRFull(result.gst)}
                     ─────────────────
TOTAL PAYABLE:       ${formatINRFull(result.total)}
Effective Rate:      ${result.effectiveRate.toFixed(2)}%

STATE NOTES
-----------
${stateData.notes}

DISCLAIMER
----------
These are estimated charges based on general state-level rates.
Actual charges may vary based on specific location, property type,
circle rate, and prevailing government notifications.
Always verify with local sub-registrar office.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stamp-duty-${stateData.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* Reset */
  const handleReset = () => {
    setSelectedState('maharashtra');
    setPropertyType('residential');
    setBuyerCategory('male');
    setPropertyValueRaw('');
    setConstructionStatus('ready');
  };

  /* Filtered states for search */
  const filteredStates = useMemo(() => {
    const entries = Object.entries(STATES_DATA);
    if (!stateSearch.trim()) return entries;
    return entries.filter(([, s]) => s.name.toLowerCase().includes(stateSearch.toLowerCase()));
  }, [stateSearch]);

  /* Bar color based on effective rate */
  const getBarColor = (rate: number): string => {
    if (rate <= 6) return '#22c55e';
    if (rate <= 9) return '#f59e0b';
    if (rate <= 12) return '#f97316';
    return '#ef4444';
  };

  /* SVG stacked bar chart for breakdown */
  const renderBreakdownChart = () => {
    if (result.total <= 0) return null;
    const parts = [
      { label: 'Stamp Duty', value: result.stampDuty, color: '#6366f1' },
      { label: 'Registration', value: result.registration, color: '#8b5cf6' },
      { label: 'Municipal', value: result.municipal, color: '#a78bfa' },
      { label: 'GST', value: result.gst, color: '#c4b5fd' },
    ].filter(p => p.value > 0);

    const barWidth = 320;
    const barHeight = 40;

    let cumX = 0;
    const segments = parts.map(p => {
      const w = (p.value / result.total) * barWidth;
      const seg = { ...p, x: cumX, w };
      cumX += w;
      return seg;
    });

    return (
      <div className="mt-4">
        <svg viewBox={`0 0 ${barWidth} ${barHeight + 60}`} className="w-full max-w-md mx-auto">
          {segments.map((seg, i) => (
            <g key={i}>
              <rect x={seg.x} y={0} width={Math.max(seg.w, 1)} height={barHeight} rx={i === 0 ? 6 : 0} fill={seg.color} />
              {seg.w > 30 && (
                <text x={seg.x + seg.w / 2} y={barHeight / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="600">
                  {((seg.value / result.total) * 100).toFixed(0)}%
                </text>
              )}
            </g>
          ))}
          {/* Legend */}
          {segments.map((seg, i) => (
            <g key={`legend-${i}`} transform={`translate(${i * (barWidth / segments.length)}, ${barHeight + 14})`}>
              <rect width="10" height="10" rx="2" fill={seg.color} />
              <text x="14" y="9" fontSize="8" fill="currentColor" className="fill-slate-600 dark:fill-slate-400">{seg.label}</text>
              <text x="14" y="22" fontSize="7.5" fill="currentColor" className="fill-slate-500 dark:fill-slate-500">{formatINR(seg.value)}</text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex flex-wrap items-center gap-2 justify-end">
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <History className="w-3.5 h-3.5" /> History ({history.length})
        </button>
        <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
        <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
          <ShieldCheck className="w-3.5 h-3.5" /> No data stored on server
        </span>
      </div>

      {/* History panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Recent Calculations</h3>
                <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X className="w-4 h-4" /></button>
              </div>
              {history.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">No calculations saved yet</p>
              ) : (
                <div className="space-y-2">
                  {history.map(h => (
                    <div key={h.id} className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-xs">
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{h.state}</span>
                        <span className="text-slate-500 dark:text-slate-400 ml-2">{h.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-600 dark:text-slate-400">Property: {formatINR(h.propertyValue)}</span>
                        <span className="ml-3 font-semibold text-indigo-600 dark:text-indigo-400">Total: {formatINR(h.result.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main form grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: inputs */}
        <div className="space-y-5">
          {/* State selector */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <MapPin className="w-4 h-4 text-indigo-500" /> Select State / UT
            </label>
            <div className="relative">
              <button
                onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-left text-sm font-medium text-slate-800 dark:text-slate-200 hover:border-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {stateData.name}
                <ChevronDown className={`w-4 h-4 transition-transform ${stateDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {stateDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl max-h-72 overflow-hidden"
                  >
                    <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                      <input
                        type="text"
                        placeholder="Search state..."
                        value={stateSearch}
                        onChange={e => setStateSearch(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto max-h-56">
                      {filteredStates.map(([key, s]) => (
                        <button
                          key={key}
                          onClick={() => { setSelectedState(key); setStateDropdownOpen(false); setStateSearch(''); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/30 ${key === selectedState ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                        >
                          {s.name}
                          <span className="float-right text-xs text-slate-500 dark:text-slate-400">{s.stampDuty.male}% / {s.stampDuty.female}%</span>
                        </button>
                      ))}
                      {filteredStates.length === 0 && (
                        <p className="text-center text-xs text-slate-400 py-4">No state found</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{stateData.notes}</p>
          </div>

          {/* Property type */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Building2 className="w-4 h-4 text-indigo-500" /> Property Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PROPERTY_TYPES.map(pt => {
                const Icon = pt.icon;
                return (
                  <button
                    key={pt.value}
                    onClick={() => setPropertyType(pt.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${propertyType === pt.value ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-400 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}
                  >
                    <Icon className="w-5 h-5" />
                    {pt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buyer category */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <User className="w-4 h-4 text-indigo-500" /> Buyer Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BUYER_CATEGORIES.map(bc => (
                <button
                  key={bc.value}
                  onClick={() => setBuyerCategory(bc.value)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${buyerCategory === bc.value ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-400 dark:border-indigo-500 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                  <span className={`text-sm font-medium ${buyerCategory === bc.value ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>{bc.label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{bc.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Property value */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <IndianRupee className="w-4 h-4 text-indigo-500" /> Property Value (INR)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-lg font-semibold">{'\u20B9'}</span>
              <input
                type="text"
                value={propertyValueRaw}
                onChange={handleValueChange}
                placeholder="e.g. 50,00,000"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
            {/* Quick amount buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[2500000, 5000000, 7500000, 10000000, 20000000, 50000000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setPropertyValueRaw(formatWithCommas(amt.toString()))}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-400 transition-colors"
                >
                  {formatINR(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Construction status */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Landmark className="w-4 h-4 text-indigo-500" /> Construction Status
            </label>
            <div className="space-y-2">
              {[
                { value: 'ready' as const, label: 'Ready to Move / Resale', sub: 'No GST applicable' },
                { value: 'under_construction_affordable' as const, label: 'Under Construction (Affordable)', sub: 'GST: 1% (below Rs 45L)' },
                { value: 'under_construction_non_affordable' as const, label: 'Under Construction (Non-Affordable)', sub: 'GST: 5%' },
              ].map(cs => (
                <label key={cs.value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${constructionStatus === cs.value ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-400 dark:border-indigo-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    name="construction"
                    checked={constructionStatus === cs.value}
                    onChange={() => setConstructionStatus(cs.value)}
                    className="mt-0.5 text-indigo-600"
                  />
                  <div>
                    <span className={`text-sm font-medium ${constructionStatus === cs.value ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>{cs.label}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{cs.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: results */}
        <div className="space-y-5">
          <AnimatePresence mode="wait">
            {propertyValue > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                className="space-y-5"
              >
                {/* Total card */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-5 text-white shadow-lg">
                  <p className="text-sm font-medium text-indigo-200">Total Payable Amount</p>
                  <motion.p
                    key={result.total}
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl sm:text-4xl font-bold mt-1"
                  >
                    {formatINRFull(result.total)}
                  </motion.p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm text-indigo-200">Effective Rate: <strong className="text-white">{result.effectiveRate.toFixed(2)}%</strong></span>
                    <span className="text-sm text-indigo-200">on {formatINR(propertyValue)}</span>
                  </div>
                </div>

                {/* Breakdown cards */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Stamp Duty', value: result.stampDuty, rate: stateData.stampDuty[buyerCategory], color: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
                    { label: 'Registration Fee', value: result.registration, rate: stateData.registration, color: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300' },
                    { label: 'Municipal Charges', value: result.municipal, rate: stateData.municipal, color: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300' },
                    { label: 'GST', value: result.gst, rate: constructionStatus === 'under_construction_non_affordable' ? 5 : constructionStatus === 'under_construction_affordable' ? 1 : 0, color: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className={`p-3.5 rounded-xl border ${item.color}`}
                    >
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label} ({item.rate}%)</p>
                      <p className={`text-lg font-bold mt-0.5 ${item.text}`}>{formatINRFull(item.value)}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Stacked bar chart */}
                {renderBreakdownChart()}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  <button onClick={handleSaveToHistory} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                    <History className="w-4 h-4" /> Save
                  </button>
                  <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Download className="w-4 h-4" /> Export Report
                  </button>
                </div>

                {/* Circle rate info */}
                <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Circle Rate / Ready Reckoner Rate</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    Stamp duty is calculated on the higher of the transaction value or the circle rate (government-assessed minimum property value). If your property&apos;s circle rate is higher than the purchase price, stamp duty will be charged on the circle rate. Check your local sub-registrar office for exact circle rates.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-4">
                  <IndianRupee className="w-8 h-8 text-indigo-500" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Enter property value to see stamp duty breakdown</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Select state, property type, and buyer category for accurate calculation</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* State Comparison Table */}
      {propertyValue > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">State-wise Comparison</h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">For {formatINR(propertyValue)} | {buyerCategory.charAt(0).toUpperCase() + buyerCategory.slice(1)} buyer</span>
          </div>

          {/* Visual bar comparison */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <div className="space-y-2.5">
              {comparisonData.slice(0, 10).map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-3 ${item.key === selectedState ? 'font-semibold' : ''}`}
                >
                  <span className={`w-28 text-xs truncate text-right ${item.key === selectedState ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {item.name}
                  </span>
                  <div className="flex-1 h-6 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.total / maxTotal) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.04 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getBarColor(item.effectiveRate) }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                      {item.effectiveRate.toFixed(1)}%
                    </span>
                  </div>
                  <span className="w-24 text-xs text-right text-slate-700 dark:text-slate-300 tabular-nums">
                    {formatINR(item.total)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Data table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50">
                  <th
                    className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400 cursor-pointer hover:text-indigo-600"
                    onClick={() => { setCompSortKey('name'); setCompSortAsc(compSortKey === 'name' ? !compSortAsc : true); }}
                  >
                    <span className="flex items-center gap-1">State <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Stamp Duty</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Registration</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Municipal</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">GST</th>
                  <th
                    className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400 cursor-pointer hover:text-indigo-600"
                    onClick={() => { setCompSortKey('total'); setCompSortAsc(compSortKey === 'total' ? !compSortAsc : true); }}
                  >
                    <span className="flex items-center justify-end gap-1">Total <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Rate</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, i) => (
                  <tr
                    key={item.key}
                    className={`border-t border-slate-100 dark:border-slate-700 transition-colors ${item.key === selectedState ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : i % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/50'} hover:bg-indigo-50 dark:hover:bg-indigo-900/30`}
                  >
                    <td className={`px-4 py-2.5 font-medium ${item.key === selectedState ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>{item.name}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400 tabular-nums">{formatINR(item.stampDuty)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400 tabular-nums">{formatINR(item.registration)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400 tabular-nums">{formatINR(item.municipal)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400 tabular-nums">{formatINR(item.gst)}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{formatINR(item.total)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${item.effectiveRate <= 6 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : item.effectiveRate <= 9 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'}`}>
                        {item.effectiveRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Saving comparison: male vs female vs joint */}
      {propertyValue > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-green-500" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Potential Savings in {stateData.name}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {BUYER_CATEGORIES.map(bc => {
              const r = calcForState(selectedState, bc.value, propertyValue);
              const maleResult = calcForState(selectedState, 'male', propertyValue);
              const saving = maleResult.total - r.total;
              return (
                <div
                  key={bc.value}
                  className={`p-3.5 rounded-xl border transition-all ${buyerCategory === bc.value ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-200 dark:ring-indigo-800' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{bc.label}</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">{formatINR(r.total)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Rate: {r.effectiveRate.toFixed(2)}%</p>
                  {saving > 0 && (
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400 mt-1">Save {formatINR(saving)}</p>
                  )}
                  {saving === 0 && bc.value === 'male' && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Base rate</p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Tips section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">How to Save on Stamp Duty</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              title: 'Register in Woman\'s Name',
              desc: 'Many states like Delhi, Haryana, Rajasthan, Punjab, J&K offer 1-4% lower stamp duty for women buyers. This can save lakhs on high-value properties.',
            },
            {
              title: 'Joint Registration',
              desc: 'In states with women concessions, joint registration (husband + wife) still gets partial benefit. A simple way to save without full ownership transfer.',
            },
            {
              title: 'Buy Ready-to-Move Property',
              desc: 'Under-construction properties attract GST (1-5%) on top of stamp duty. Ready-to-move or resale properties have zero GST, saving up to 5% extra.',
            },
            {
              title: 'Check for Government Rebates',
              desc: 'States periodically offer stamp duty reductions. Maharashtra offered 2-3% rebate during COVID. Always check for ongoing schemes before registering.',
            },
            {
              title: 'First-Time Buyer Benefits',
              desc: 'Some states offer reduced stamp duty for first-time homebuyers or for properties below a certain value threshold. Check PMAY-linked concessions.',
            },
            {
              title: 'Optimize Property Value Declaration',
              desc: 'Stamp duty is charged on the higher of sale price or circle rate. If circle rate is lower, buying at circle rate saves duty. Never under-declare value.',
            },
            {
              title: 'Claim Section 80C Deduction',
              desc: 'Stamp duty and registration charges paid for a residential property can be claimed under Section 80C of the Income Tax Act (up to Rs 1.5 lakh per year).',
            },
            {
              title: 'Consider Nearby Areas',
              desc: 'Circle rates vary significantly between localities. A property just across a municipal boundary may have drastically lower circle rates and stamp duty.',
            },
          ].map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700"
            >
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{tip.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* State-wise rates reference */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Stamp Duty Rates - All Indian States & UTs</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quick reference for residential properties (rates may vary for other property types)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                <th className="px-4 py-2.5 text-left font-medium text-slate-600 dark:text-slate-400">State / UT</th>
                <th className="px-4 py-2.5 text-center font-medium text-slate-600 dark:text-slate-400">Male</th>
                <th className="px-4 py-2.5 text-center font-medium text-slate-600 dark:text-slate-400">Female</th>
                <th className="px-4 py-2.5 text-center font-medium text-slate-600 dark:text-slate-400">Registration</th>
                <th className="px-4 py-2.5 text-center font-medium text-slate-600 dark:text-slate-400">Municipal</th>
                <th className="px-4 py-2.5 text-center font-medium text-slate-600 dark:text-slate-400">Total (M)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(STATES_DATA).map(([key, s], i) => (
                <tr
                  key={key}
                  className={`border-t border-slate-100 dark:border-slate-700 ${key === selectedState ? 'bg-indigo-50/60 dark:bg-indigo-900/20' : i % 2 === 0 ? '' : 'bg-slate-50/30 dark:bg-slate-800/30'} hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 cursor-pointer transition-colors`}
                  onClick={() => setSelectedState(key)}
                >
                  <td className={`px-4 py-2 font-medium ${key === selectedState ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>{s.name}</td>
                  <td className="px-4 py-2 text-center text-slate-600 dark:text-slate-400">{s.stampDuty.male}%</td>
                  <td className="px-4 py-2 text-center text-slate-600 dark:text-slate-400">
                    {s.stampDuty.female}%
                    {s.stampDuty.female < s.stampDuty.male && (
                      <span className="ml-1 text-[10px] text-green-600 dark:text-green-400 font-semibold">(-{(s.stampDuty.male - s.stampDuty.female).toFixed(1)}%)</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center text-slate-600 dark:text-slate-400">{s.registration}%</td>
                  <td className="px-4 py-2 text-center text-slate-600 dark:text-slate-400">{s.municipal > 0 ? `${s.municipal}%` : '-'}</td>
                  <td className="px-4 py-2 text-center font-semibold text-slate-800 dark:text-slate-200">{(s.stampDuty.male + s.registration + s.municipal).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5"
      >
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            {
              q: 'What is stamp duty?',
              a: 'Stamp duty is a tax levied by the state government on the transfer of property ownership. It is payable at the time of property registration and is calculated as a percentage of the property value or circle rate, whichever is higher.',
            },
            {
              q: 'What is the difference between stamp duty and registration charges?',
              a: 'Stamp duty is a tax on the transaction document (sale deed), while registration charges are fees paid to the sub-registrar office for officially recording the property transfer in government records. Both are mandatory and payable at the time of registration.',
            },
            {
              q: 'Is stamp duty the same across all states in India?',
              a: 'No. Stamp duty is a state subject under the Indian Constitution. Each state sets its own rates. Rates vary from as low as 3.5% (Goa) to as high as 9.9% (Meghalaya). Many states also offer different rates based on gender, property location (urban/rural), and property value slabs.',
            },
            {
              q: 'Can I get a refund on stamp duty if the property deal is cancelled?',
              a: 'In most states, stamp duty refund is possible if the sale deed has not been registered. Once registered, refund is generally not available. Some states allow partial refund within a specified period (usually 6 months). Check your state-specific rules for exact provisions.',
            },
            {
              q: 'What is circle rate and how does it affect stamp duty?',
              a: 'Circle rate (also called guidance value, ready reckoner rate, or collector rate) is the minimum property value set by the government for each locality. Stamp duty is charged on the higher of the actual transaction value or the circle rate, preventing under-valuation.',
            },
            {
              q: 'Is GST applicable on property purchase?',
              a: 'GST is applicable only on under-construction properties: 5% for non-affordable housing (above Rs 45 lakh) and 1% for affordable housing (below Rs 45 lakh), without input tax credit. Ready-to-move and resale properties are exempt from GST.',
            },
            {
              q: 'Can stamp duty be claimed as tax deduction?',
              a: 'Yes. Stamp duty and registration charges paid for purchase of a residential house property can be claimed as deduction under Section 80C of the Income Tax Act, 1961, subject to the overall limit of Rs 1.5 lakh per financial year.',
            },
            {
              q: 'How can women buyers save on stamp duty?',
              a: 'Many states like Delhi, Haryana, Rajasthan, Punjab, UP, Uttarakhand, Himachal Pradesh, and Jammu & Kashmir offer reduced stamp duty rates for women buyers. Savings can range from 1% to 4%, which on a Rs 1 crore property translates to Rs 1-4 lakh savings.',
            },
          ].map((faq, i) => (
            <div key={i} className="border-b border-slate-100 dark:border-slate-700 last:border-0 pb-3 last:pb-0">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{faq.q}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key terms glossary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5"
      >
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3">Key Terms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { term: 'Stamp Duty', def: 'State tax on property transfer documents, calculated as percentage of property value.' },
            { term: 'Registration Fee', def: 'Charge by sub-registrar office for recording the property sale in government records.' },
            { term: 'Circle Rate', def: 'Government-set minimum property value per sq ft for each area, used as base for stamp duty.' },
            { term: 'Ready Reckoner Rate', def: 'Term used in Maharashtra for circle rate; published annually by the state government.' },
            { term: 'Sale Deed', def: 'Legal document transferring property ownership from seller to buyer after registration.' },
            { term: 'Conveyance Deed', def: 'Document transferring property title, commonly used in society flat transfers.' },
            { term: 'Municipal Transfer Duty', def: 'Additional charge by local municipal body in some states (e.g., Maharashtra, Telangana).' },
            { term: 'E-Stamping', def: 'Electronic method of paying stamp duty, replacing physical stamp papers in most states.' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40">
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">{item.term}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.def}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <strong className="text-slate-600 dark:text-slate-300">Disclaimer:</strong> Stamp duty and registration charges shown are approximate and based on general state-level rates as of 2025-26. Actual charges may differ based on specific municipal area, property location, government circle rate, property age, and any ongoing state government rebate schemes. For precise calculations, please consult your local sub-registrar office or a qualified legal advisor. This tool is for estimation purposes only.
        </p>
      </div>
    </div>
  );
}
