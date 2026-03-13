'use client';

import { useState, useMemo } from 'react';
import { Info, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

// ── BS Month data ─────────────────────────────────────────────────────────────
const BS_MONTHS = [
  { num: 1,  name: 'Baisakh',  nep: 'बैशाख',   adApprox: 'Apr–May' },
  { num: 2,  name: 'Jestha',   nep: 'जेठ',      adApprox: 'May–Jun' },
  { num: 3,  name: 'Ashadh',   nep: 'असार',     adApprox: 'Jun–Jul' },
  { num: 4,  name: 'Shrawan',  nep: 'श्रावण',   adApprox: 'Jul–Aug' },
  { num: 5,  name: 'Bhadra',   nep: 'भाद्र',    adApprox: 'Aug–Sep' },
  { num: 6,  name: 'Ashwin',   nep: 'असोज',     adApprox: 'Sep–Oct' },
  { num: 7,  name: 'Kartik',   nep: 'कार्तिक',  adApprox: 'Oct–Nov' },
  { num: 8,  name: 'Mangsir',  nep: 'मंसिर',    adApprox: 'Nov–Dec' },
  { num: 9,  name: 'Poush',    nep: 'पुष',      adApprox: 'Dec–Jan' },
  { num: 10, name: 'Magh',     nep: 'माघ',      adApprox: 'Jan–Feb' },
  { num: 11, name: 'Falgun',   nep: 'फाल्गुन',  adApprox: 'Feb–Mar' },
  { num: 12, name: 'Chaitra',  nep: 'चैत',      adApprox: 'Mar–Apr' },
];

// ── Post categories ────────────────────────────────────────────────────────────
type PostCategory =
  | 'non-gazetted'
  | 'gazetted-3'
  | 'gazetted-2'
  | 'gazetted-1'
  | 'police-apf-army';

interface PostCategoryInfo {
  id: PostCategory;
  label: string;
  nep: string;
  minAge: number;
  maxAgeGeneral: number;
  maxAgeWomenDisabled: number | null;
  maxAgeEmployee: number | null; // employees with 3+ yrs service
  noUpperLimit: boolean;
  note?: string;
}

const POST_CATEGORIES: PostCategoryInfo[] = [
  {
    id: 'non-gazetted',
    label: 'Non-Gazetted (Kharidar, etc.)',
    nep: 'राजपत्र अनंकित (खरिदार)',
    minAge: 18,
    maxAgeGeneral: 35,
    maxAgeWomenDisabled: 40,
    maxAgeEmployee: 45,
    noUpperLimit: false,
  },
  {
    id: 'gazetted-3',
    label: 'Gazetted Class III / Officer Level',
    nep: 'राजपत्रांकित तृतीय श्रेणी',
    minAge: 21,
    maxAgeGeneral: 35,
    maxAgeWomenDisabled: 40,
    maxAgeEmployee: 45,
    noUpperLimit: false,
  },
  {
    id: 'gazetted-2',
    label: 'Gazetted Class II',
    nep: 'राजपत्रांकित द्वितीय श्रेणी',
    minAge: 21,
    maxAgeGeneral: 40,
    maxAgeWomenDisabled: 45,
    maxAgeEmployee: null,
    noUpperLimit: false,
  },
  {
    id: 'gazetted-1',
    label: 'Gazetted Class I / Special Class',
    nep: 'राजपत्रांकित प्रथम श्रेणी / विशेष',
    minAge: 21,
    maxAgeGeneral: Infinity,
    maxAgeWomenDisabled: Infinity,
    maxAgeEmployee: null,
    noUpperLimit: true,
    note: 'No upper age limit (experience qualification required instead)',
  },
  {
    id: 'police-apf-army',
    label: 'Nepal Police / APF / Army',
    nep: 'नेपाल प्रहरी / सशस्त्र / सेना',
    minAge: 18,
    maxAgeGeneral: 25,
    maxAgeWomenDisabled: null,
    maxAgeEmployee: null,
    noUpperLimit: false,
  },
];

// ── BS → approximate AD conversion ───────────────────────────────────────────
// Baisakh(1)≈Apr, Jestha(2)≈May, Ashadh(3)≈Jun  → same AD year as BS-57
// Shrawan(4)≈Jul … Mangsir(8)≈Nov              → same AD year as BS-57
// Poush(9)≈Dec                                   → AD year = BS-57
// Magh(10)≈Jan, Falgun(11)≈Feb, Chaitra(12)≈Mar → AD year = BS-57+1 = BS-56
// (Magh-Chaitra fall in the January-March of the FOLLOWING AD year)
function bsToApproxAD(bsYear: number, bsMonth: number): { adYear: number; adMonthName: string } {
  const adMonthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];
  // Approximate AD month from BS month
  // Baisakh(1)=Apr, Jestha(2)=May, Ashadh(3)=Jun, Shrawan(4)=Jul,
  // Bhadra(5)=Aug, Ashwin(6)=Sep, Kartik(7)=Oct, Mangsir(8)=Nov,
  // Poush(9)=Dec, Magh(10)=Jan, Falgun(11)=Feb, Chaitra(12)=Mar
  const bsToAdMonthMap: Record<number, number> = {
    1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9,
    7: 10, 8: 11, 9: 12, 10: 1, 11: 2, 12: 3,
  };
  const adMonthNum = bsToAdMonthMap[bsMonth] ?? 1;
  // AD year: months 1–9 fall in BS year - 57; months 10–12 (Jan–Mar AD) fall in BS year - 56
  const adYear = bsMonth >= 10 ? bsYear - 56 : bsYear - 57;
  return { adYear, adMonthName: adMonthNames[adMonthNum - 1] };
}

// ── Today's approximate BS date ───────────────────────────────────────────────
function getTodayBS(): { year: number; month: number; day: number } {
  const today = new Date();
  const adYear = today.getFullYear();
  const adMonth = today.getMonth() + 1; // 1-indexed
  const adDay = today.getDate();

  // Approximate BS year
  let bsYear: number;
  let bsMonth: number;
  if (adMonth <= 4) {
    bsYear = adYear + 56;
    const map: Record<number, number> = { 1: 9, 2: 10, 3: 11, 4: 12 };
    bsMonth = map[adMonth] ?? 1;
  } else {
    bsYear = adYear + 57;
    const map: Record<number, number> = { 5: 1, 6: 2, 7: adDay >= 16 ? 4 : 3, 8: 4, 9: 5, 10: 6, 11: 7, 12: 8 };
    bsMonth = map[adMonth] ?? 1;
  }

  return { year: bsYear, month: bsMonth, day: adDay > 30 ? 30 : adDay };
}

// ── Age calculation in BS ─────────────────────────────────────────────────────
interface BSAge {
  years: number;
  months: number;
  days: number;
}

function calcBSAge(
  dobYear: number, dobMonth: number, dobDay: number,
  cutYear: number, cutMonth: number, cutDay: number,
): BSAge | null {
  // Validate
  if (dobYear <= 0 || dobMonth <= 0 || dobDay <= 0) return null;
  if (cutYear < dobYear || (cutYear === dobYear && cutMonth < dobMonth) ||
      (cutYear === dobYear && cutMonth === dobMonth && cutDay < dobDay)) {
    return null; // Cutoff before DOB
  }

  let years = cutYear - dobYear;
  let months = cutMonth - dobMonth;
  let days = cutDay - dobDay;

  if (days < 0) {
    months -= 1;
    days += 30; // approximate BS month as 30 days
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

// ── Eligibility check ─────────────────────────────────────────────────────────
type AgeGroup = 'general' | 'women-disabled' | 'employee';

interface EligibilityResult {
  eligible: boolean;
  reason: string;
  age: BSAge;
  maxAge: number | null;
  minAge: number;
}

function checkEligibility(
  age: BSAge,
  category: PostCategoryInfo,
  ageGroup: AgeGroup,
): EligibilityResult {
  // Min age check
  if (age.years < category.minAge) {
    return {
      eligible: false,
      reason: `You are ${age.years} years old. Minimum age is ${category.minAge} years.`,
      age,
      maxAge: null,
      minAge: category.minAge,
    };
  }

  if (category.noUpperLimit) {
    return {
      eligible: true,
      reason: `No upper age limit for ${category.label}. You meet the minimum age of ${category.minAge} years.`,
      age,
      maxAge: null,
      minAge: category.minAge,
    };
  }

  let maxAge: number | null = null;
  let groupLabel = '';

  if (ageGroup === 'women-disabled' && category.maxAgeWomenDisabled !== null) {
    maxAge = category.maxAgeWomenDisabled;
    groupLabel = 'Women/Disabled/Indigenous';
  } else if (ageGroup === 'employee' && category.maxAgeEmployee !== null) {
    maxAge = category.maxAgeEmployee;
    groupLabel = 'Employees with 3+ yrs service';
  } else {
    maxAge = category.maxAgeGeneral;
    groupLabel = 'General';
  }

  if (maxAge === null) {
    return {
      eligible: false,
      reason: `No special age concession available for this category under ${ageGroup}.`,
      age,
      maxAge: null,
      minAge: category.minAge,
    };
  }

  // Age exceeds max — check if age.years >= maxAge exactly (we allow up to maxAge, not completed)
  // PSC counts age completed as of cutoff date
  const hasExceededMax = age.years > maxAge || (age.years === maxAge && (age.months > 0 || age.days > 0));

  if (hasExceededMax) {
    return {
      eligible: false,
      reason: `You are ${age.years} years, ${age.months} months, ${age.days} days old. Maximum age for ${groupLabel} is ${maxAge} years.`,
      age,
      maxAge,
      minAge: category.minAge,
    };
  }

  const yearsLeft = maxAge - age.years - 1;
  const monthsLeft = 12 - age.months;

  return {
    eligible: true,
    reason: `Eligible under ${groupLabel} category. Age limit is ${maxAge} years. You have approximately ${yearsLeft} year(s) ${monthsLeft} month(s) remaining.`,
    age,
    maxAge,
    minAge: category.minAge,
  };
}

// ── Shared UI classes ─────────────────────────────────────────────────────────
const selectClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
const resultCardClass =
  'bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4';

// ── Main component ────────────────────────────────────────────────────────────
export function NepalLoksewaAgeCalculatorTool() {
  const todayBS = getTodayBS();

  const [dobYear, setDobYear] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');

  const [cutYear, setCutYear] = useState(String(todayBS.year));
  const [cutMonth, setCutMonth] = useState(String(todayBS.month));
  const [cutDay, setCutDay] = useState(String(todayBS.day));

  const [postCategory, setPostCategory] = useState<PostCategory>('non-gazetted');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('general');

  const result = useMemo(() => {
    const dy = parseInt(dobYear, 10);
    const dm = parseInt(dobMonth, 10);
    const dd = parseInt(dobDay, 10);
    const cy = parseInt(cutYear, 10);
    const cm = parseInt(cutMonth, 10);
    const cd = parseInt(cutDay, 10);

    if (!dy || !dm || !dd || !cy || !cm || !cd) return null;
    if (dm < 1 || dm > 12 || dd < 1 || dd > 32) return null;
    if (cm < 1 || cm > 12 || cd < 1 || cd > 32) return null;

    const age = calcBSAge(dy, dm, dd, cy, cm, cd);
    if (!age) return null;

    const category = POST_CATEGORIES.find(c => c.id === postCategory);
    if (!category) return null;

    const eligibility = checkEligibility(age, category, ageGroup);
    const approxAD = bsToApproxAD(dy, dm);

    return { eligibility, approxAD, dobYear: dy, dobMonth: dm };
  }, [dobYear, dobMonth, dobDay, cutYear, cutMonth, cutDay, postCategory, ageGroup]);

  const selectedCategory = POST_CATEGORIES.find(c => c.id === postCategory);

  // Year ranges
  const dobYears = Array.from({ length: 46 }, (_, i) => 2020 + i); // 2020–2065
  const cutYears = Array.from({ length: 10 }, (_, i) => todayBS.year - 2 + i);
  const days = Array.from({ length: 32 }, (_, i) => i + 1);

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-xs text-blue-800 dark:text-blue-300">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          Age is calculated as of the <strong>application deadline date (Dartaa Miiti)</strong> in BS (Bikram Sambat).
          Always verify with the official PSC vacancy notice.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left column: inputs */}
        <div className="space-y-4">
          {/* Date of Birth */}
          <div>
            <p className={`${labelClass} text-base`}>Date of Birth (BS — Bikram Sambat)</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className={labelClass}>Year</label>
                <select value={dobYear} onChange={e => setDobYear(e.target.value)} className={selectClass}>
                  <option value="">Year</option>
                  {dobYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Month</label>
                <select value={dobMonth} onChange={e => setDobMonth(e.target.value)} className={selectClass}>
                  <option value="">Month</option>
                  {BS_MONTHS.map(m => (
                    <option key={m.num} value={m.num}>{m.name} ({m.nep})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Day</label>
                <select value={dobDay} onChange={e => setDobDay(e.target.value)} className={selectClass}>
                  <option value="">Day</option>
                  {days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            {dobYear && dobMonth && (
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Approx. AD: {BS_MONTHS.find(m => m.num === parseInt(dobMonth))?.adApprox} {bsToApproxAD(parseInt(dobYear), parseInt(dobMonth)).adYear}
              </p>
            )}
          </div>

          {/* Application/Cutoff date */}
          <div>
            <p className={`${labelClass} text-base`}>Application Deadline Date / Dartaa Miiti (BS)</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className={labelClass}>Year</label>
                <select value={cutYear} onChange={e => setCutYear(e.target.value)} className={selectClass}>
                  {cutYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Month</label>
                <select value={cutMonth} onChange={e => setCutMonth(e.target.value)} className={selectClass}>
                  {BS_MONTHS.map(m => (
                    <option key={m.num} value={m.num}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Day</label>
                <select value={cutDay} onChange={e => setCutDay(e.target.value)} className={selectClass}>
                  {days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Post category */}
          <div>
            <label className={`${labelClass} text-base`}>Post Category</label>
            <select
              value={postCategory}
              onChange={e => setPostCategory(e.target.value as PostCategory)}
              className={selectClass}
            >
              {POST_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            {selectedCategory && (
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 italic">
                {selectedCategory.nep}
                {selectedCategory.note && ` — ${selectedCategory.note}`}
              </p>
            )}
          </div>

          {/* Age group / concession */}
          {selectedCategory && !selectedCategory.noUpperLimit && selectedCategory.id !== 'police-apf-army' && (
            <div>
              <label className={`${labelClass} text-base`}>Applicant Group</label>
              <div className="space-y-2">
                {[
                  { val: 'general' as AgeGroup, label: 'General (सामान्य)' },
                  ...(selectedCategory.maxAgeWomenDisabled !== null
                    ? [{ val: 'women-disabled' as AgeGroup, label: 'Women / Disabled / Indigenous (महिला / अपांग / आदिवासी)' }]
                    : []),
                  ...(selectedCategory.maxAgeEmployee !== null
                    ? [{ val: 'employee' as AgeGroup, label: 'Government Employee (3+ yrs service) (सरकारी कर्मचारी)' }]
                    : []),
                ].map(opt => (
                  <label key={opt.val} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="ageGroup"
                      value={opt.val}
                      checked={ageGroup === opt.val}
                      onChange={() => setAgeGroup(opt.val)}
                      className="accent-primary-500 w-4 h-4"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Age display */}
              <div className={resultCardClass}>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Your Age as of Cutoff Date (BS)</p>
                <div className="flex gap-4">
                  {[
                    { val: result.eligibility.age.years, unit: 'Years' },
                    { val: result.eligibility.age.months, unit: 'Months' },
                    { val: result.eligibility.age.days, unit: 'Days' },
                  ].map(item => (
                    <div key={item.unit} className="text-center">
                      <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{item.val}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.unit}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Approx. AD Birth: {BS_MONTHS.find(m => m.num === result.dobMonth)?.adApprox}{' '}
                  {result.approxAD.adYear}
                </p>
              </div>

              {/* Eligibility result */}
              <div
                className={`rounded-xl border p-4 ${
                  result.eligibility.eligible
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.eligibility.eligible ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-semibold text-sm ${
                        result.eligibility.eligible
                          ? 'text-green-800 dark:text-green-300'
                          : 'text-red-800 dark:text-red-300'
                      }`}
                    >
                      {result.eligibility.eligible ? 'Eligible' : 'Not Eligible'}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        result.eligibility.eligible
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-red-700 dark:text-red-400'
                      }`}
                    >
                      {result.eligibility.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Age limits for selected category */}
              {selectedCategory && (
                <div className={resultCardClass}>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Age Limits: {selectedCategory.label}
                  </p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Minimum Age</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCategory.minAge} years</span>
                    </div>
                    {!selectedCategory.noUpperLimit && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">General Maximum</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCategory.maxAgeGeneral} years</span>
                        </div>
                        {selectedCategory.maxAgeWomenDisabled && (
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Women/Disabled/Indigenous</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCategory.maxAgeWomenDisabled} years</span>
                          </div>
                        )}
                        {selectedCategory.maxAgeEmployee && (
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Gov. Employee (3+ yrs)</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCategory.maxAgeEmployee} years</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Conversion note */}
              <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2.5 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  This tool uses approximate BS–AD conversion. For exact results, verify with an official BS calendar.
                </span>
              </div>
            </>
          ) : (
            <div className={`${resultCardClass} text-center py-10 text-slate-400 dark:text-slate-500 text-sm`}>
              Fill in your Date of Birth and Application Date to see eligibility
            </div>
          )}
        </div>
      </div>

      {/* Reference table: all categories */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Age Limits Reference — All Loksewa Post Categories
        </h3>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  {['Post Category', 'Min Age', 'General Max', 'Women/Disabled', 'Employee (3+ yrs)'].map(h => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {POST_CATEGORIES.map(cat => (
                  <tr
                    key={cat.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      cat.id === postCategory ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{cat.label}</p>
                      <p className="text-slate-400 dark:text-slate-500">{cat.nep}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">{cat.minAge}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                      {cat.noUpperLimit ? <span className="text-green-600 dark:text-green-400">No limit</span> : cat.maxAgeGeneral}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {cat.maxAgeWomenDisabled !== null ? cat.maxAgeWomenDisabled : <span className="text-slate-400 dark:text-slate-500">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {cat.maxAgeEmployee !== null ? cat.maxAgeEmployee : <span className="text-slate-400 dark:text-slate-500">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400 dark:text-slate-500" />
        <span>
          Age limits are based on Public Service Commission (Lok Sewa Aayog / लोक सेवा आयोग) general guidelines.
          Specific vacancies may have different age requirements — always check the official vacancy notice (Bibidh Suchana).
        </span>
      </div>
    </div>
  );
}
