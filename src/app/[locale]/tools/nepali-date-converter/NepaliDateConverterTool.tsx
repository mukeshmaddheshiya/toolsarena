'use client';
import { useState, useMemo } from 'react';
import { ArrowLeftRight, CalendarDays, Clock, Info } from 'lucide-react';
import {
  BS_CALENDAR, BS_MONTHS_EN, BS_MONTHS_NP, AD_MONTHS, DAYS_EN, DAYS_NP,
  toNepaliNum, bsToAd, adToBs,
} from './bs-data';

type Mode = 'bs-to-ad' | 'ad-to-bs';

export function NepaliDateConverterTool() {
  const [mode, setMode] = useState<Mode>('bs-to-ad');

  // BS inputs
  const [bsYear, setBsYear] = useState(2082);
  const [bsMonth, setBsMonth] = useState(11);
  const [bsDay, setBsDay] = useState(22);

  // AD inputs
  const [adYear, setAdYear] = useState(2026);
  const [adMonth, setAdMonth] = useState(3);
  const [adDay, setAdDay] = useState(6);

  // Today's date in both
  const today = useMemo(() => {
    const now = new Date();
    const bs = adToBs(now);
    return { ad: now, bs };
  }, []);

  // Max days in selected BS month
  const bsMaxDays = BS_CALENDAR[bsYear]?.[bsMonth - 1] || 30;

  // Conversion result
  const result = useMemo(() => {
    if (mode === 'bs-to-ad') {
      const ad = bsToAd(bsYear, bsMonth, bsDay);
      if (!ad) return null;
      const dayOfWeek = ad.getDay();
      return {
        ad,
        bsYear, bsMonth, bsDay,
        adYear: ad.getFullYear(),
        adMonth: ad.getMonth() + 1,
        adDay: ad.getDate(),
        dayEN: DAYS_EN[dayOfWeek],
        dayNP: DAYS_NP[dayOfWeek],
        bsMonthEN: BS_MONTHS_EN[bsMonth - 1],
        bsMonthNP: BS_MONTHS_NP[bsMonth - 1],
        adMonthEN: AD_MONTHS[ad.getMonth()],
      };
    } else {
      const ad = new Date(adYear, adMonth - 1, adDay);
      const bs = adToBs(ad);
      if (!bs) return null;
      const dayOfWeek = ad.getDay();
      return {
        ad,
        bsYear: bs.year, bsMonth: bs.month, bsDay: bs.day,
        adYear, adMonth, adDay,
        dayEN: DAYS_EN[dayOfWeek],
        dayNP: DAYS_NP[dayOfWeek],
        bsMonthEN: BS_MONTHS_EN[bs.month - 1],
        bsMonthNP: BS_MONTHS_NP[bs.month - 1],
        adMonthEN: AD_MONTHS[adMonth - 1],
      };
    }
  }, [mode, bsYear, bsMonth, bsDay, adYear, adMonth, adDay]);

  function toggleMode() {
    setMode(m => m === 'bs-to-ad' ? 'ad-to-bs' : 'bs-to-ad');
  }

  // Generate year options
  const bsYears = Array.from({ length: 100 }, (_, i) => 2000 + i);
  const adYears = Array.from({ length: 101 }, (_, i) => 1943 + i);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">नेपाली मिति परिवर्तक</h2>
            <p className="text-blue-200 text-xs">Nepali Date Converter — BS ⇄ AD</p>
          </div>
        </div>
      </div>

      {/* Today's Date */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-xl">
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Today (BS)
          </p>
          {today.bs ? (
            <div>
              <p className="text-sm font-black text-orange-800 dark:text-orange-300">
                {toNepaliNum(today.bs.day)} {BS_MONTHS_NP[today.bs.month - 1]} {toNepaliNum(today.bs.year)}
              </p>
              <p className="text-[10px] text-orange-600 dark:text-orange-400">
                {today.bs.day} {BS_MONTHS_EN[today.bs.month - 1]} {today.bs.year}
              </p>
            </div>
          ) : <p className="text-xs text-orange-400">—</p>}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Today (AD)
          </p>
          <p className="text-sm font-black text-blue-800 dark:text-blue-300">
            {today.ad.getDate()} {AD_MONTHS[today.ad.getMonth()]} {today.ad.getFullYear()}
          </p>
          <p className="text-[10px] text-blue-600 dark:text-blue-400">
            {DAYS_EN[today.ad.getDay()]}
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center justify-center">
        <button
          onClick={toggleMode}
          className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-sm hover:shadow-md transition-all group"
        >
          <span className={`text-sm font-bold ${mode === 'bs-to-ad' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-400'}`}>
            BS (बि.सं.)
          </span>
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/40 transition-colors">
            <ArrowLeftRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className={`text-sm font-bold ${mode === 'ad-to-bs' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-400'}`}>
            AD (ई.सं.)
          </span>
        </button>
      </div>

      {/* Input Section */}
      <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
          {mode === 'bs-to-ad' ? 'Enter BS Date (बि.सं. मिति)' : 'Enter AD Date (English Date)'}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {mode === 'bs-to-ad' ? (
            <>
              {/* BS Year */}
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">Year (साल)</label>
                <select
                  value={bsYear}
                  onChange={e => setBsYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {bsYears.map(y => <option key={y} value={y}>{y} ({toNepaliNum(y)})</option>)}
                </select>
              </div>
              {/* BS Month */}
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">Month (महिना)</label>
                <select
                  value={bsMonth}
                  onChange={e => setBsMonth(parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {BS_MONTHS_EN.map((m, i) => (
                    <option key={i} value={i + 1}>{m} ({BS_MONTHS_NP[i]})</option>
                  ))}
                </select>
              </div>
              {/* BS Day */}
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">Day (गते)</label>
                <select
                  value={Math.min(bsDay, bsMaxDays)}
                  onChange={e => setBsDay(parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {Array.from({ length: bsMaxDays }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} ({toNepaliNum(i + 1)})</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              {/* AD Year */}
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">Year</label>
                <select
                  value={adYear}
                  onChange={e => setAdYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {adYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              {/* AD Month */}
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">Month</label>
                <select
                  value={adMonth}
                  onChange={e => setAdMonth(parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {AD_MONTHS.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              {/* AD Day */}
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">Day</label>
                <select
                  value={adDay}
                  onChange={e => setAdDay(parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Result */}
      {result ? (
        <div className="space-y-4">
          {/* Main Result Card */}
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl">
            <div className="grid grid-cols-2 gap-4">
              {/* BS Side */}
              <div className="text-center">
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-2">Bikram Sambat (BS)</p>
                <p className="text-3xl font-black text-indigo-800 dark:text-indigo-300">
                  {toNepaliNum(result.bsDay)}
                </p>
                <p className="text-base font-bold text-indigo-700 dark:text-indigo-400 mt-1">
                  {result.bsMonthNP} {toNepaliNum(result.bsYear)}
                </p>
                <p className="text-xs text-indigo-500 mt-0.5">
                  {result.bsDay} {result.bsMonthEN} {result.bsYear}
                </p>
                <p className="text-xs text-indigo-400 mt-1">{result.dayNP}</p>
              </div>

              {/* Divider */}
              <div className="text-center border-l border-indigo-200 dark:border-indigo-700 pl-4">
                <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-2">Gregorian (AD)</p>
                <p className="text-3xl font-black text-purple-800 dark:text-purple-300">
                  {result.adDay}
                </p>
                <p className="text-base font-bold text-purple-700 dark:text-purple-400 mt-1">
                  {result.adMonthEN} {result.adYear}
                </p>
                <p className="text-xs text-purple-500 mt-0.5">
                  {String(result.adMonth).padStart(2, '0')}/{String(result.adDay).padStart(2, '0')}/{result.adYear}
                </p>
                <p className="text-xs text-purple-400 mt-1">{result.dayEN}</p>
              </div>
            </div>
          </div>

          {/* Full Nepali Display */}
          <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-xl text-center">
            <p className="text-lg font-black text-orange-800 dark:text-orange-300">
              {result.dayNP}, {toNepaliNum(result.bsDay)} {result.bsMonthNP} {toNepaliNum(result.bsYear)} बि.सं.
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
              {result.dayEN}, {result.adDay} {result.adMonthEN} {result.adYear} AD
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl text-center">
          <p className="text-sm text-red-600 dark:text-red-400">Invalid date or out of supported range (2000-2099 BS)</p>
        </div>
      )}

      {/* Month Table for Selected Year */}
      {mode === 'bs-to-ad' && BS_CALENDAR[bsYear] && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-indigo-500" />
            BS {bsYear} ({toNepaliNum(bsYear)}) — Days per Month
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {BS_CALENDAR[bsYear].map((days, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-center transition-all ${
                  i === bsMonth - 1
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-300 dark:border-indigo-700'
                    : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <p className="text-[10px] font-bold text-slate-500">{BS_MONTHS_EN[i]}</p>
                <p className="text-[9px] text-slate-400">{BS_MONTHS_NP[i]}</p>
                <p className={`text-base font-black mt-0.5 ${i === bsMonth - 1 ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {days}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Total: {BS_CALENDAR[bsYear].reduce((a, b) => a + b, 0)} days in BS {bsYear}
          </p>
        </div>
      )}
    </div>
  );
}
