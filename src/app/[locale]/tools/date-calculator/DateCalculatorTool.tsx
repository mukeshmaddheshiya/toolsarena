'use client';
import { useState, useMemo } from 'react';

type Mode = 'between' | 'add-subtract' | 'weekday' | 'age-days';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const addDaysToStr = (dateStr: string, days: number) => { const d = new Date(dateStr); d.setDate(d.getDate() + days); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

function getBusinessDays(start: Date, end: Date) {
  let count = 0;
  const d = new Date(start);
  while (d <= end) { const day = d.getDay(); if (day !== 0 && day !== 6) count++; d.setDate(d.getDate() + 1); }
  return count;
}

function dateDiff(start: Date, end: Date) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  if (days < 0) { months--; const prev = new Date(end.getFullYear(), end.getMonth(), 0); days += prev.getDate(); }
  if (months < 0) { years--; months += 12; }
  return { years, months, days };
}

export function DateCalculatorTool() {
  const [mode, setMode] = useState<Mode>('between');
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState(addDaysToStr(today(), 30));
  const [includeEnd, setIncludeEnd] = useState(false);
  const [addDays, setAddDays] = useState(30);
  const [addOp, setAddOp] = useState<'add' | 'sub'>('add');
  const [addUnit, setAddUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');
  const [weekdayDate, setWeekdayDate] = useState(today());
  const [birthDate, setBirthDate] = useState('2000-01-01');

  const betweenResult = useMemo(() => {
    const s = new Date(startDate), e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    const diffMs = Math.abs(e.getTime() - s.getTime());
    let totalDays = Math.floor(diffMs / 86400000);
    if (includeEnd) totalDays += 1;
    const weeks = Math.floor(totalDays / 7);
    const remainDays = totalDays % 7;
    const bd = getBusinessDays(s < e ? s : e, s < e ? e : s);
    const diff = dateDiff(s < e ? s : e, s < e ? e : s);
    return { totalDays, weeks, remainDays, businessDays: bd, ...diff };
  }, [startDate, endDate, includeEnd]);

  const addResult = useMemo(() => {
    const d = new Date(startDate);
    if (isNaN(d.getTime())) return null;
    const val = addOp === 'sub' ? -addDays : addDays;
    switch (addUnit) {
      case 'days': d.setDate(d.getDate() + val); break;
      case 'weeks': d.setDate(d.getDate() + val * 7); break;
      case 'months': d.setMonth(d.getMonth() + val); break;
      case 'years': d.setFullYear(d.getFullYear() + val); break;
    }
    return { date: d, dayName: DAYS[d.getDay()] };
  }, [startDate, addDays, addOp, addUnit]);

  const weekdayResult = useMemo(() => {
    const d = new Date(weekdayDate);
    if (isNaN(d.getTime())) return null;
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((d.getTime() - startOfYear.getTime()) / 86400000) + 1;
    const endOfYear = new Date(d.getFullYear(), 11, 31);
    const daysInYear = isLeapYear(d.getFullYear()) ? 366 : 365;
    const weekNum = Math.ceil(dayOfYear / 7);
    const daysRemaining = daysInYear - dayOfYear;
    const daysTillSat = (6 - d.getDay() + 7) % 7 || 7;
    return { dayName: DAYS[d.getDay()], dayOfYear, weekNum, leap: isLeapYear(d.getFullYear()), daysRemaining, daysTillWeekend: daysTillSat };
  }, [weekdayDate]);

  const ageResult = useMemo(() => {
    const birth = new Date(birthDate);
    const now = new Date();
    if (isNaN(birth.getTime()) || birth > now) return null;
    const diff = dateDiff(birth, now);
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= now) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const daysTillBday = Math.ceil((nextBday.getTime() - now.getTime()) / 86400000);
    const bornDay = DAYS[birth.getDay()];
    let leapYears = 0;
    for (let y = birth.getFullYear(); y <= now.getFullYear(); y++) if (isLeapYear(y)) leapYears++;
    return { ...diff, totalDays, totalHours, totalMinutes, daysTillBday, bornDay, leapYears };
  }, [birthDate]);

  const modes: { value: Mode; label: string }[] = [
    { value: 'between', label: 'Days Between' },
    { value: 'add-subtract', label: 'Add/Subtract' },
    { value: 'weekday', label: 'Weekday Info' },
    { value: 'age-days', label: 'Age in Days' },
  ];

  const inputClass = 'w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button key={m.value} onClick={() => setMode(m.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m.value ? 'bg-primary-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-400'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'between' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} /></div>
            <div><label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">End Date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} /></div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <input type="checkbox" checked={includeEnd} onChange={e => setIncludeEnd(e.target.checked)} className="rounded border-slate-300" /> Include end date
          </label>
          {betweenResult && (
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
              <div className="text-center mb-4">
                <div className="text-sm text-amber-200 mb-1">Total Days</div>
                <div className="text-5xl font-heading font-bold">{betweenResult.totalDays}</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Weeks + Days</div><div className="font-bold">{betweenResult.weeks}w {betweenResult.remainDays}d</div></div>
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Yrs/Mo/Days</div><div className="font-bold">{betweenResult.years}y {betweenResult.months}m {betweenResult.days}d</div></div>
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Business Days</div><div className="font-bold">{betweenResult.businessDays}</div></div>
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Weekend Days</div><div className="font-bold">{betweenResult.totalDays - betweenResult.businessDays}</div></div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'add-subtract' && (
        <div className="space-y-4">
          <div><label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} /></div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              {(['add', 'sub'] as const).map(o => (
                <button key={o} onClick={() => setAddOp(o)} className={`px-4 py-2 text-sm font-medium ${addOp === o ? 'bg-primary-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{o === 'add' ? '+ Add' : '− Subtract'}</button>
              ))}
            </div>
            <input type="number" value={addDays} min={1} max={10000} onChange={e => setAddDays(Math.max(1, +e.target.value || 1))} className="w-24 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100" />
            <select value={addUnit} onChange={e => setAddUnit(e.target.value as typeof addUnit)} className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100">
              <option value="days">Days</option><option value="weeks">Weeks</option><option value="months">Months</option><option value="years">Years</option>
            </select>
          </div>
          {addResult && (
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white text-center">
              <div className="text-sm text-amber-200 mb-1">Result Date</div>
              <div className="text-3xl font-heading font-bold">{addResult.date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          )}
        </div>
      )}

      {mode === 'weekday' && (
        <div className="space-y-4">
          <div><label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Select Date</label><input type="date" value={weekdayDate} onChange={e => setWeekdayDate(e.target.value)} className={inputClass} /></div>
          {weekdayResult && (
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
              <div className="text-center mb-4">
                <div className="text-sm text-amber-200 mb-1">Day of the Week</div>
                <div className="text-4xl font-heading font-bold">{weekdayResult.dayName}</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Day of Year</div><div className="font-bold">{weekdayResult.dayOfYear}</div></div>
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Week Number</div><div className="font-bold">{weekdayResult.weekNum}</div></div>
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Leap Year?</div><div className="font-bold">{weekdayResult.leap ? 'Yes' : 'No'}</div></div>
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Days Left in Year</div><div className="font-bold">{weekdayResult.daysRemaining}</div></div>
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Days to Weekend</div><div className="font-bold">{weekdayResult.daysTillWeekend}</div></div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'age-days' && (
        <div className="space-y-4">
          <div><label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Your Birthdate</label><input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className={inputClass} /></div>
          {ageResult && (
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
              <div className="text-center mb-4">
                <div className="text-sm text-amber-200 mb-1">You are</div>
                <div className="text-3xl font-heading font-bold">{ageResult.years} years, {ageResult.months} months, {ageResult.days} days old</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Total Days</div><div className="font-bold">{ageResult.totalDays.toLocaleString()}</div></div>
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Total Hours</div><div className="font-bold">{ageResult.totalHours.toLocaleString()}</div></div>
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Total Minutes</div><div className="font-bold">{ageResult.totalMinutes.toLocaleString()}</div></div>
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Born on</div><div className="font-bold">{ageResult.bornDay}</div></div>
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Next Birthday</div><div className="font-bold">{ageResult.daysTillBday} days</div></div>
                <div className="bg-white/10 rounded-xl p-3"><div className="text-xs text-amber-200">Leap Years</div><div className="font-bold">{ageResult.leapYears}</div></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
