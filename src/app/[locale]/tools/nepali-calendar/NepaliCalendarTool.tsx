'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Sun } from 'lucide-react';

// ---------------------------------------------------------------------------
// BS Month data for 2081 BS (2024/2025 AD)
// days[monthIndex] = number of days in that BS month for year 2081
// ---------------------------------------------------------------------------
const BS_MONTHS_2081_DAYS = [31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30, 30];

const BS_MONTH_NAMES_EN = [
  'Baishakh', 'Jestha', 'Ashadh', 'Shrawan',
  'Bhadra', 'Ashwin', 'Kartik', 'Mangsir',
  'Poush', 'Magh', 'Falgun', 'Chaitra',
];

const BS_MONTH_NAMES_NP = [
  'बैशाख', 'जेठ', 'असार', 'श्रावण',
  'भाद्र', 'आश्विन', 'कार्तिक', 'मङ्सिर',
  'पुष', 'माघ', 'फाल्गुण', 'चैत',
];

const WEEK_DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ---------------------------------------------------------------------------
// BS 2081 starts on: Baishakh 1, 2081 = April 13, 2024 (Saturday, weekday 6)
// We store for each month: [startWeekday (0=Sun), daysInMonth]
// startWeekday is derived by cumulating days from Baishakh 1 (which is Sat=6)
// ---------------------------------------------------------------------------
const BS_2081_START_WEEKDAY = 6; // Saturday

function getMonthStartWeekday(monthIndex: number): number {
  let dayCount = 0;
  for (let i = 0; i < monthIndex; i++) {
    dayCount += BS_MONTHS_2081_DAYS[i];
  }
  return (BS_2081_START_WEEKDAY + dayCount) % 7;
}

// ---------------------------------------------------------------------------
// AD date corresponding to BS 2081 Baishakh 1 = April 13, 2024
// ---------------------------------------------------------------------------
const BS_2081_EPOCH_AD = new Date(2024, 3, 13); // April 13, 2024

function bsToAd(bsYear: number, bsMonth: number, bsDay: number): Date {
  if (bsYear !== 2081) {
    // Approximate conversion for other years
    const approxOffset = (bsYear - 2081) * 365;
    const d = new Date(BS_2081_EPOCH_AD);
    d.setDate(d.getDate() + approxOffset);
    // add month days
    let monthDays = 0;
    for (let m = 0; m < bsMonth; m++) {
      monthDays += BS_MONTHS_2081_DAYS[m];
    }
    d.setDate(d.getDate() + monthDays + (bsDay - 1));
    return d;
  }
  let totalDays = 0;
  for (let m = 0; m < bsMonth; m++) {
    totalDays += BS_MONTHS_2081_DAYS[m];
  }
  totalDays += bsDay - 1;
  const result = new Date(BS_2081_EPOCH_AD);
  result.setDate(result.getDate() + totalDays);
  return result;
}

function adToBs(adDate: Date): { year: number; month: number; day: number } {
  const diffMs = adDate.getTime() - BS_2081_EPOCH_AD.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { year: 2080, month: 11, day: 30 }; // approximate
  }

  let remaining = diffDays;
  let month = 0;
  while (month < 12 && remaining >= BS_MONTHS_2081_DAYS[month]) {
    remaining -= BS_MONTHS_2081_DAYS[month];
    month++;
  }
  if (month >= 12) {
    return { year: 2082, month: 0, day: remaining + 1 };
  }
  return { year: 2081, month, day: remaining + 1 };
}

// ---------------------------------------------------------------------------
// Festivals / Holidays hardcoded for BS 2081
// Key format: "month-day" (0-indexed month)
// ---------------------------------------------------------------------------
const HOLIDAYS_2081: Record<string, { name: string; type: 'holiday' | 'festival' }> = {
  '0-1':  { name: 'Labour Day / Baishakh 1', type: 'holiday' },
  '0-15': { name: 'Buddha Jayanti', type: 'festival' },
  '5-1':  { name: 'Ghatasthapana (Dashain begins)', type: 'festival' },
  '5-7':  { name: 'Fulpati', type: 'festival' },
  '5-8':  { name: 'Maha Ashtami', type: 'holiday' },
  '5-9':  { name: 'Maha Nawami', type: 'holiday' },
  '5-10': { name: 'Vijaya Dashami (Dashain)', type: 'holiday' },
  '5-11': { name: 'Ekadashi', type: 'festival' },
  '5-15': { name: 'Kojagrat Purnima', type: 'festival' },
  '6-1':  { name: 'Nepal Sambat New Year', type: 'festival' },
  '6-3':  { name: 'Tihar / Deepawali (Laxmi Puja)', type: 'holiday' },
  '6-4':  { name: 'Gobardhan Puja', type: 'holiday' },
  '6-5':  { name: 'Bhai Tika', type: 'holiday' },
  '9-5':  { name: "Martyrs' Day (Praja Diwas)", type: 'holiday' },
  '9-15': { name: 'Losar (Sonam Losar)', type: 'festival' },
  '9-27': { name: 'Prithvi Jayanti', type: 'holiday' },
  '10-7': { name: 'Democracy Day', type: 'holiday' },
  '10-25': { name: "International Women's Day", type: 'festival' },
  '10-30': { name: 'Holi (Fagu Purnima)', type: 'festival' },
};

const AD_MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatAdShort(d: Date): string {
  return `${d.getDate()} ${AD_MONTH_SHORT[d.getMonth()]}`;
}

// ---------------------------------------------------------------------------
// Today in BS
// ---------------------------------------------------------------------------
const TODAY_AD = new Date();
const TODAY_BS = adToBs(TODAY_AD);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function NepaliCalendarTool() {
  const [currentYear, setCurrentYear] = useState(2081);
  const [currentMonth, setCurrentMonth] = useState(TODAY_BS.month);

  const daysInMonth = BS_MONTHS_2081_DAYS[currentMonth] ?? 30;
  const startWeekday = getMonthStartWeekday(currentMonth);

  const todayBs = TODAY_BS;

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  const cells = useMemo(() => {
    const arr: Array<number | null> = [];
    for (let i = 0; i < startWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [startWeekday, daysInMonth]);

  const todayAdFormatted = TODAY_AD.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const todayBsFormatted = `${BS_MONTH_NAMES_EN[todayBs.month]} ${todayBs.day}, ${todayBs.year} BS`;
  const todayBsNp = `${BS_MONTH_NAMES_NP[todayBs.month]} ${todayBs.day}, ${todayBs.year}`;

  const availableYears = [2079, 2080, 2081, 2082, 2083];

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Nepali Calendar — Bikram Sambat
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          नेपाली पात्रो — विक्रम सम्बत
        </p>
      </div>

      {/* Calendar Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Month Navigation */}
        <div className="bg-red-600 text-white px-4 py-4 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-red-700 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="text-xl font-bold">
              {BS_MONTH_NAMES_NP[currentMonth]} — {BS_MONTH_NAMES_EN[currentMonth]}
            </div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="bg-red-700 text-white text-sm rounded px-2 py-0.5 border border-red-400 focus:outline-none"
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>{y} BS</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-red-700 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
          {WEEK_DAYS_EN.map((day, i) => (
            <div
              key={day}
              className={`text-center text-xs font-semibold py-2 ${
                i === 0 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-600">
          {cells.map((day, idx) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="bg-gray-50 dark:bg-gray-800 min-h-14"
                />
              );
            }

            const holidayKey = `${currentMonth}-${day}`;
            const holiday = HOLIDAYS_2081[holidayKey];
            const isToday =
              currentYear === todayBs.year &&
              currentMonth === todayBs.month &&
              day === todayBs.day;
            const isSunday = (startWeekday + day - 1) % 7 === 0;

            const adDate = bsToAd(currentYear, currentMonth, day);
            const adShort = formatAdShort(adDate);

            return (
              <div
                key={day}
                title={holiday ? holiday.name : undefined}
                className={`bg-white dark:bg-gray-800 min-h-14 p-1 relative flex flex-col cursor-default select-none
                  ${isToday ? 'ring-2 ring-inset ring-red-500' : ''}
                  ${holiday ? 'bg-amber-50 dark:bg-amber-900/20' : ''}
                `}
              >
                {/* BS Day number */}
                <span
                  className={`text-sm font-bold leading-none
                    ${isToday ? 'text-red-600 dark:text-red-400' : ''}
                    ${isSunday && !isToday ? 'text-red-400 dark:text-red-300' : ''}
                    ${!isSunday && !isToday ? 'text-gray-800 dark:text-gray-200' : ''}
                  `}
                >
                  {isToday && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                  )}
                  {day}
                </span>

                {/* AD date small */}
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-none">
                  {adShort}
                </span>

                {/* Holiday indicator */}
                {holiday && (
                  <span
                    className={`mt-auto text-xs font-medium leading-tight truncate
                      ${holiday.type === 'holiday' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}
                    `}
                  >
                    {holiday.name.split(' ')[0]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-500 inline-block" />
          <span className="text-gray-700 dark:text-gray-300">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-red-100 border border-red-300 inline-block" />
          <span className="text-gray-700 dark:text-gray-300">Public Holiday</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-amber-100 border border-amber-300 inline-block" />
          <span className="text-gray-700 dark:text-gray-300">Festival</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-500 font-bold text-sm">Sun</span>
          <span className="text-gray-700 dark:text-gray-300">Sunday (public day off)</span>
        </div>
      </div>

      {/* Holidays list for current month */}
      {(() => {
        const monthHolidays = Object.entries(HOLIDAYS_2081)
          .filter(([key]) => key.startsWith(`${currentMonth}-`))
          .map(([key, val]) => {
            const day = parseInt(key.split('-')[1], 10);
            return { day, ...val };
          })
          .sort((a, b) => a.day - b.day);

        if (monthHolidays.length === 0) return null;
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-red-500" />
              Holidays & Festivals — {BS_MONTH_NAMES_EN[currentMonth]} {currentYear}
            </h3>
            <ul className="space-y-2">
              {monthHolidays.map((h) => (
                <li key={h.day} className="flex items-center gap-3 text-sm">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                      ${h.type === 'holiday' ? 'bg-red-500' : 'bg-amber-500'}
                    `}
                  >
                    {h.day}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{h.name}</span>
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium
                      ${h.type === 'holiday'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}
                    `}
                  >
                    {h.type === 'holiday' ? 'Public Holiday' : 'Festival'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })()}

      {/* Today Card */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Sun className="w-5 h-5" />
          <span className="font-semibold text-lg">Today in BS</span>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold">{todayBsNp}</div>
          <div className="text-red-200 text-sm">{todayBsFormatted}</div>
          <div className="mt-2 pt-2 border-t border-red-500 text-red-100 text-sm">
            {todayAdFormatted}
          </div>
        </div>
      </div>

      {/* BS Month Reference */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
          BS Months Reference (2081 BS)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {BS_MONTH_NAMES_EN.map((name, i) => (
            <button
              key={name}
              onClick={() => { setCurrentMonth(i); setCurrentYear(2081); }}
              className={`flex items-center justify-between p-2 rounded-lg border transition-colors
                ${i === currentMonth && currentYear === 2081
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              <span>{BS_MONTH_NAMES_NP[i]} ({name})</span>
              <span className="text-gray-400 dark:text-gray-500 text-xs">{BS_MONTHS_2081_DAYS[i]}d</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
