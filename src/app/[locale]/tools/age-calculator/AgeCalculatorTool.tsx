'use client';
import { useState } from 'react';
import { CalendarDays, Clock, Gift, Star } from 'lucide-react';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function calculateAge(dob: Date, asOf: Date) {
  let years = asOf.getFullYear() - dob.getFullYear();
  let months = asOf.getMonth() - dob.getMonth();
  let days = asOf.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) { months += 12; years -= 1; }

  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor((asOf.getTime() - dob.getTime()) / msPerDay);
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const dayOfWeek = DAYS_OF_WEEK[dob.getDay()];

  // Next birthday
  const thisYearBday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
  const nextBday = thisYearBday <= asOf
    ? new Date(asOf.getFullYear() + 1, dob.getMonth(), dob.getDate())
    : thisYearBday;
  const daysUntilBday = Math.ceil((nextBday.getTime() - asOf.getTime()) / msPerDay);

  return { years, months, days, totalDays, totalHours, totalMinutes, dayOfWeek, daysUntilBday, nextBdayYear: nextBday.getFullYear() };
}

export function AgeCalculatorTool() {
  const today = new Date().toISOString().split('T')[0];
  const [dob, setDob] = useState('1990-01-01');
  const [asOf, setAsOf] = useState(today);
  const [result, setResult] = useState<ReturnType<typeof calculateAge> | null>(null);
  const [error, setError] = useState('');

  function calculate() {
    const dobDate = new Date(dob);
    const asOfDate = new Date(asOf);
    if (isNaN(dobDate.getTime()) || isNaN(asOfDate.getTime())) { setError('Please enter valid dates.'); return; }
    if (dobDate > asOfDate) { setError('Date of birth cannot be after the "as of" date.'); return; }
    setError('');
    setResult(calculateAge(dobDate, asOfDate));
  }

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date of Birth</label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)} max={today}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Age As Of</label>
          <input type="date" value={asOf} onChange={e => setAsOf(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button onClick={calculate} className="flex items-center gap-2 px-6 py-2.5 bg-primary-800 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
        <CalendarDays className="w-4 h-4" /> Calculate Age
      </button>

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Main result */}
          <div className="bg-gradient-to-br from-primary-800 to-primary-600 rounded-2xl p-6 text-white text-center">
            <div className="text-5xl font-heading font-bold mb-1">{result.years}</div>
            <div className="text-primary-200 mb-4">years old</div>
            <div className="flex justify-center gap-8 text-sm">
              <div><div className="font-bold text-xl">{result.months}</div><div className="text-primary-200">months</div></div>
              <div className="w-px bg-primary-600" />
              <div><div className="font-bold text-xl">{result.days}</div><div className="text-primary-200">days</div></div>
            </div>
          </div>

          {/* Detail cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: CalendarDays, label: 'Total Days', value: result.totalDays.toLocaleString() },
              { icon: Clock, label: 'Total Hours', value: result.totalHours.toLocaleString() },
              { icon: Star, label: 'Born On', value: result.dayOfWeek },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
                <Icon className="w-5 h-5 mx-auto mb-2 text-primary-700 dark:text-primary-400" />
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Next birthday */}
          <div className="flex items-center gap-3 p-4 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-xl">
            <Gift className="w-5 h-5 text-accent-600 dark:text-accent-400 shrink-0" />
            <p className="text-sm text-accent-800 dark:text-accent-300">
              Next birthday in <strong>{result.daysUntilBday}</strong> day{result.daysUntilBday !== 1 ? 's' : ''} ({result.nextBdayYear})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
