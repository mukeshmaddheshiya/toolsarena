'use client';

import { useState, useMemo } from 'react';
import { Calendar, ArrowRight, Table2, Info } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
type Tab = 'ad-to-fy' | 'fy-label' | 'reference';

// ── Known FY → AD mappings ───────────────────────────────────────────────────
// FY BS year (first half) → { start AD date, end AD date }
interface FYMapping {
  bsYear: number;         // e.g. 2081 for FY 2081/82
  adStartYear: number;    // AD year when Shrawan 1 falls
  adStartMonth: number;   // 1-indexed month (July = 7)
  adStartDay: number;
  adEndYear: number;
  adEndMonth: number;
  adEndDay: number;
  adLabel: string;        // e.g. "July 2024 – July 2025"
}

const FY_MAPPINGS: FYMapping[] = [
  { bsYear: 2074, adStartYear: 2017, adStartMonth: 7, adStartDay: 16, adEndYear: 2018, adEndMonth: 7, adEndDay: 15, adLabel: 'July 2017 – July 2018' },
  { bsYear: 2075, adStartYear: 2018, adStartMonth: 7, adStartDay: 16, adEndYear: 2019, adEndMonth: 7, adEndDay: 15, adLabel: 'July 2018 – July 2019' },
  { bsYear: 2076, adStartYear: 2019, adStartMonth: 7, adStartDay: 16, adEndYear: 2020, adEndMonth: 7, adEndDay: 15, adLabel: 'July 2019 – July 2020' },
  { bsYear: 2077, adStartYear: 2020, adStartMonth: 7, adStartDay: 16, adEndYear: 2021, adEndMonth: 7, adEndDay: 15, adLabel: 'July 2020 – July 2021' },
  { bsYear: 2078, adStartYear: 2021, adStartMonth: 7, adStartDay: 16, adEndYear: 2022, adEndMonth: 7, adEndDay: 15, adLabel: 'July 2021 – July 2022' },
  { bsYear: 2079, adStartYear: 2022, adStartMonth: 7, adStartDay: 17, adEndYear: 2023, adEndMonth: 7, adEndDay: 16, adLabel: 'July 2022 – July 2023' },
  { bsYear: 2080, adStartYear: 2023, adStartMonth: 7, adStartDay: 17, adEndYear: 2024, adEndMonth: 7, adEndDay: 16, adLabel: 'July 2023 – July 2024' },
  { bsYear: 2081, adStartYear: 2024, adStartMonth: 7, adStartDay: 16, adEndYear: 2025, adEndMonth: 7, adEndDay: 15, adLabel: 'July 2024 – July 2025' },
  { bsYear: 2082, adStartYear: 2025, adStartMonth: 7, adStartDay: 16, adEndYear: 2026, adEndMonth: 7, adEndDay: 15, adLabel: 'July 2025 – July 2026' },
  { bsYear: 2083, adStartYear: 2026, adStartMonth: 7, adStartDay: 17, adEndYear: 2027, adEndMonth: 7, adEndDay: 16, adLabel: 'July 2026 – July 2027' },
  { bsYear: 2084, adStartYear: 2027, adStartMonth: 7, adStartDay: 17, adEndYear: 2028, adEndMonth: 7, adEndDay: 15, adLabel: 'July 2027 – July 2028' },
  { bsYear: 2085, adStartYear: 2028, adStartMonth: 7, adStartDay: 16, adEndYear: 2029, adEndMonth: 7, adEndDay: 15, adLabel: 'July 2028 – July 2029' },
];

// Additional entries for reference table (2076/77 – 2085/86)
const REFERENCE_TABLE_FYS = FY_MAPPINGS.filter(f => f.bsYear >= 2076);

// ── BS Month names ────────────────────────────────────────────────────────────
const BS_MONTHS = [
  'Baisakh (बैशाख)',   // 1
  'Jestha (जेठ)',       // 2
  'Ashadh (असार)',      // 3
  'Shrawan (श्रावण)',   // 4
  'Bhadra (भाद्र)',     // 5
  'Ashwin (असोज)',      // 6
  'Kartik (कार्तिक)',   // 7
  'Mangsir (मंसिर)',    // 8
  'Poush (पुष)',        // 9
  'Magh (माघ)',         // 10
  'Falgun (फाल्गुन)',   // 11
  'Chaitra (चैत)',      // 12
];

const BS_MONTHS_SHORT = [
  'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
];

// ── Quarter definitions (BS month numbers, 1-indexed) ────────────────────────
const QUARTERS = [
  { label: 'Q1', months: [4, 5, 6], name: 'Shrawan–Bhadra–Ashwin' },
  { label: 'Q2', months: [7, 8, 9], name: 'Kartik–Mangsir–Poush' },
  { label: 'Q3', months: [10, 11, 12], name: 'Magh–Falgun–Chaitra' },
  { label: 'Q4', months: [1, 2, 3], name: 'Baisakh–Jestha–Ashadh' },
];

// ── Quarter AD date ranges (approximate, per FY) ─────────────────────────────
// Given a FY mapping, returns Q1–Q4 AD label strings
function getQuarterADRanges(fy: FYMapping) {
  return [
    { label: 'Q1', bsMonths: 'Shrawan–Ashwin',    adRange: `mid-Jul ${fy.adStartYear} – mid-Oct ${fy.adStartYear}` },
    { label: 'Q2', bsMonths: 'Kartik–Poush',       adRange: `mid-Oct ${fy.adStartYear} – mid-Jan ${fy.adEndYear}` },
    { label: 'Q3', bsMonths: 'Magh–Chaitra',        adRange: `mid-Jan ${fy.adEndYear} – mid-Apr ${fy.adEndYear}` },
    { label: 'Q4', bsMonths: 'Baisakh–Ashadh',      adRange: `mid-Apr ${fy.adEndYear} – mid-Jul ${fy.adEndYear}` },
  ];
}

// ── AD date → FY / BS info ────────────────────────────────────────────────────
interface ADtoFYResult {
  fyLabel: string;
  bsYear: number;
  bsMonth: number;
  bsMonthName: string;
  quarter: string;
  quarterName: string;
  approxBSYear: number;
  approxBSMonthName: string;
  adDateLabel: string;
}

function adDateToFY(dateStr: string): ADtoFYResult | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;

  const adYear = d.getFullYear();
  const adMonth = d.getMonth() + 1; // 1-indexed
  const adDay = d.getDate();

  // Find the FY by checking which FY this AD date falls in
  let foundFY: FYMapping | null = null;
  for (const fy of FY_MAPPINGS) {
    const startDate = new Date(fy.adStartYear, fy.adStartMonth - 1, fy.adStartDay);
    const endDate = new Date(fy.adEndYear, fy.adEndMonth - 1, fy.adEndDay);
    if (d >= startDate && d <= endDate) {
      foundFY = fy;
      break;
    }
  }

  // Approximate BS year from AD
  // Baisakh-Ashadh (Apr-Jun) → BS year = AD year + 57 - 1 (they are in the prior BS year's last months)
  // Actually: Shrawan-Chaitra (Jul-Mar) → BS year = AD year + 57 - 1 = AD + 56...
  // Simple rule: if AD month >= 4 (April) and month <= 7 (before mid-July): BS year = AD + 57
  //              if AD month >= 7 (from mid-July on) through March: BS year = AD + 57 - 1 + 1 = AD + 57
  // More accurate: Jan-Apr → BS year = AD + 56; May-Dec → BS year = AD + 57
  let approxBSYear: number;
  let approxBSMonth: number;
  if (adMonth <= 4) {
    approxBSYear = adYear + 56;
    // Jan→Poush/Magh, Feb→Magh/Falgun, Mar→Falgun/Chaitra, Apr→Chaitra/Baisakh
    const monthMap: Record<number, number> = { 1: 9, 2: 10, 3: 11, 4: 12 };
    approxBSMonth = monthMap[adMonth] ?? 1;
  } else {
    approxBSYear = adYear + 57;
    // May→Baisakh/Jestha, Jun→Jestha/Ashadh, Jul→Ashadh/Shrawan, Aug→Shrawan/Bhadra
    // Sep→Bhadra/Ashwin, Oct→Ashwin/Kartik, Nov→Kartik/Mangsir, Dec→Mangsir/Poush
    const monthMap: Record<number, number> = { 5: 1, 6: 2, 7: adDay >= 16 ? 4 : 3, 8: 4, 9: 5, 10: 6, 11: 7, 12: 8 };
    approxBSMonth = monthMap[adMonth] ?? 1;
  }

  // Determine quarter from BS month
  let quarter = '';
  let quarterName = '';
  for (const q of QUARTERS) {
    if (q.months.includes(approxBSMonth)) {
      quarter = q.label;
      quarterName = q.name;
      break;
    }
  }

  const adMonthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const adDateLabel = `${adDay} ${adMonthNames[adMonth - 1]} ${adYear}`;

  if (foundFY) {
    return {
      fyLabel: `FY ${foundFY.bsYear}/${(foundFY.bsYear + 1) % 100}`,
      bsYear: foundFY.bsYear,
      bsMonth: approxBSMonth,
      bsMonthName: BS_MONTHS[approxBSMonth - 1],
      quarter,
      quarterName,
      approxBSYear,
      approxBSMonthName: BS_MONTHS_SHORT[approxBSMonth - 1],
      adDateLabel,
    };
  }

  // Fallback: compute FY from approximate BS info
  // Fiscal year: Shrawan(4) starts new FY. If BS month >= 4, FY start = current BS year, else FY start = BS year - 1
  const fyStart = approxBSMonth >= 4 ? approxBSYear : approxBSYear - 1;
  return {
    fyLabel: `FY ${fyStart}/${(fyStart + 1) % 100}`,
    bsYear: fyStart,
    bsMonth: approxBSMonth,
    bsMonthName: BS_MONTHS[approxBSMonth - 1],
    quarter,
    quarterName,
    approxBSYear,
    approxBSMonthName: BS_MONTHS_SHORT[approxBSMonth - 1],
    adDateLabel,
  };
}

// ── Shared UI classes ─────────────────────────────────────────────────────────
const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
const resultCardClass =
  'bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4';

// ── Main component ────────────────────────────────────────────────────────────
export function NepalFiscalYearConverterTool() {
  const [activeTab, setActiveTab] = useState<Tab>('ad-to-fy');
  const [adDate, setAdDate] = useState('');
  const [fyInput, setFyInput] = useState('');

  // Current FY is 2082/83 (Shrawan 2082 = ~July 2025 to Ashad 2083 = ~July 2026)
  const CURRENT_FY_BS = 2082;

  // ── Tab 1 result ────────────────────────────────────────────────────────────
  const adResult = useMemo(() => adDateToFY(adDate), [adDate]);

  // ── Tab 2 result ────────────────────────────────────────────────────────────
  const fyResult = useMemo(() => {
    if (!fyInput.trim()) return null;
    let bsYear: number;
    // Accept "2081" or "2081/82" formats
    const match = fyInput.trim().match(/^(\d{4})(?:\/\d{1,2})?$/);
    if (!match) return null;
    bsYear = parseInt(match[1], 10);
    if (isNaN(bsYear) || bsYear < 2070 || bsYear > 2090) return null;

    const fy = FY_MAPPINGS.find(f => f.bsYear === bsYear);
    if (!fy) {
      // Estimate for years not in our table
      const startADYear = bsYear - 57;
      return {
        fyLabel: `FY ${bsYear}/${(bsYear + 1) % 100}`,
        adLabel: `~July ${startADYear} – July ${startADYear + 1}`,
        quarters: [
          { label: 'Q1', bsMonths: 'Shrawan–Ashwin',  adRange: `mid-Jul ${startADYear} – mid-Oct ${startADYear}` },
          { label: 'Q2', bsMonths: 'Kartik–Poush',     adRange: `mid-Oct ${startADYear} – mid-Jan ${startADYear + 1}` },
          { label: 'Q3', bsMonths: 'Magh–Chaitra',      adRange: `mid-Jan ${startADYear + 1} – mid-Apr ${startADYear + 1}` },
          { label: 'Q4', bsMonths: 'Baisakh–Ashadh',    adRange: `mid-Apr ${startADYear + 1} – mid-Jul ${startADYear + 1}` },
        ],
        isEstimate: true,
      };
    }
    return {
      fyLabel: `FY ${fy.bsYear}/${(fy.bsYear + 1) % 100}`,
      adLabel: fy.adLabel,
      quarters: getQuarterADRanges(fy),
      isEstimate: false,
    };
  }, [fyInput]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'ad-to-fy', label: 'AD Date → Nepal FY', icon: <Calendar className="w-4 h-4" /> },
    { id: 'fy-label', label: 'FY Label Converter', icon: <ArrowRight className="w-4 h-4" /> },
    { id: 'reference', label: 'Reference Table', icon: <Table2 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-xs text-blue-800 dark:text-blue-300">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          Nepal&apos;s fiscal year (FY) runs from <strong>Shrawan 1 to Ashad end</strong> (approximately mid-July to mid-July AD), following the Bikram Sambat (BS) calendar.
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: AD Date → Nepal FY */}
      {activeTab === 'ad-to-fy' && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Enter AD (Gregorian) Date</label>
            <input
              type="date"
              value={adDate}
              onChange={e => setAdDate(e.target.value)}
              className={inputClass}
            />
          </div>

          {adResult && (
            <div className="space-y-3">
              {/* Main result */}
              <div className={`${resultCardClass} space-y-3`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">AD Date</p>
                    <p className="text-base font-semibold text-slate-800 dark:text-slate-200">{adResult.adDateLabel}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Nepal Fiscal Year</p>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{adResult.fyLabel}</p>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={resultCardClass}>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">BS Quarter</p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{adResult.quarter}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{adResult.quarterName}</p>
                </div>
                <div className={resultCardClass}>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Approx. BS Month</p>
                  <p className="text-base font-semibold text-slate-800 dark:text-slate-200">{adResult.approxBSMonthName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">BS Year ~{adResult.approxBSYear}</p>
                </div>
                <div className={resultCardClass}>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Full BS Month Name</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{adResult.bsMonthName}</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                BS month is approximate (±1 month). Use official BS calendar for exact dates.
              </p>
            </div>
          )}

          {!adDate && (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              Select an AD date above to see its Nepal Fiscal Year
            </div>
          )}
        </div>
      )}

      {/* Tab 2: FY Label Converter */}
      {activeTab === 'fy-label' && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Enter Nepal FY (BS Year)</label>
            <input
              type="text"
              value={fyInput}
              onChange={e => setFyInput(e.target.value)}
              placeholder='e.g. "2081" or "2081/82"'
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Enter the BS year number (e.g. 2081 for FY 2081/82) or full format like 2081/82
            </p>
          </div>

          {fyResult && (
            <div className="space-y-3">
              <div className={`${resultCardClass} flex items-center justify-between flex-wrap gap-2`}>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Nepal Fiscal Year</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{fyResult.fyLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Equivalent AD Period</p>
                  <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    {fyResult.isEstimate && '~'}{fyResult.adLabel}
                  </p>
                </div>
              </div>

              {/* Quarter breakdown */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quarterly Breakdown</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {fyResult.quarters.map(q => (
                    <div key={q.label} className={`${resultCardClass} flex items-start gap-3`}>
                      <span className="inline-block min-w-[2rem] text-center font-bold text-sm bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-md px-1.5 py-0.5">
                        {q.label}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{q.bsMonths}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{q.adRange}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {fyResult.isEstimate && (
                <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                  Estimated dates — this FY year is outside our verified mapping table.
                </p>
              )}
            </div>
          )}

          {!fyInput.trim() && (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              Enter a BS year above to see AD equivalent and quarterly breakdown
            </div>
          )}

          {fyInput.trim() && !fyResult && (
            <div className="text-center py-6 text-red-500 dark:text-red-400 text-sm">
              Invalid input. Please enter a 4-digit BS year (e.g. 2081 or 2081/82).
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Reference Table */}
      {activeTab === 'reference' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Nepal Fiscal Years with their AD equivalents. The current FY is highlighted.
          </p>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    {['Nepal FY (BS)', 'AD Period', 'AD Start', 'AD End', 'Status'].map(h => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {REFERENCE_TABLE_FYS.map(fy => {
                    const isCurrentFY = fy.bsYear === CURRENT_FY_BS;
                    const isPastFY = fy.bsYear < CURRENT_FY_BS;
                    return (
                      <tr
                        key={fy.bsYear}
                        className={
                          isCurrentFY
                            ? 'bg-primary-50 dark:bg-primary-900/20'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                          {fy.bsYear}/{(fy.bsYear + 1) % 100}
                          {isCurrentFY && (
                            <span className="ml-2 text-[10px] font-medium bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{fy.adLabel}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">
                          {fy.adStartDay} Jul {fy.adStartYear}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">
                          {fy.adEndDay} Jul {fy.adEndYear}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                              isCurrentFY
                                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                                : isPastFY
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                            }`}
                          >
                            {isCurrentFY ? 'Active' : isPastFY ? 'Past' : 'Upcoming'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quarter reference */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">Fiscal Year Quarter Guide (BS Months)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {QUARTERS.map(q => (
                <div key={q.label} className="bg-white dark:bg-slate-800 rounded-lg p-2 border border-amber-200 dark:border-amber-800">
                  <p className="font-bold text-amber-700 dark:text-amber-400">{q.label}</p>
                  <p className="text-slate-600 dark:text-slate-300">{q.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
