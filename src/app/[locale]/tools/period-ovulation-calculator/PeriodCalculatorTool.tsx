'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Calendar, Download, RotateCcw, Lock, History, Trash2,
  ChevronLeft, ChevronRight, Info, X, Shield, Droplets, Moon, Sun, Baby, AlertCircle,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES & CONSTANTS                                                  */
/* ------------------------------------------------------------------ */

interface CycleData {
  lastPeriodDate: string;
  cycleLength: number;
  periodDuration: number;
}

interface PredictedCycle {
  periodStart: Date;
  periodEnd: Date;
  ovulationDate: Date;
  fertileStart: Date;
  fertileEnd: Date;
  lutealStart: Date;
  nextPeriod: Date;
}

interface HistoryItem {
  id: string;
  data: CycleData;
  timestamp: number;
}

const STORAGE_KEY = 'period-calc-history';
const MAX_HISTORY = 5;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PHASE_COLORS = {
  period: { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500', border: 'border-rose-300 dark:border-rose-700' },
  fertile: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500', border: 'border-emerald-300 dark:border-emerald-700' },
  ovulation: { bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-300', dot: 'bg-violet-500', border: 'border-violet-300 dark:border-violet-700' },
  luteal: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500', border: 'border-amber-300 dark:border-amber-700' },
  safe: { bg: 'bg-sky-50 dark:bg-sky-900/20', text: 'text-sky-600 dark:text-sky-400', dot: 'bg-sky-400', border: 'border-sky-200 dark:border-sky-700' },
};

/* ------------------------------------------------------------------ */
/*  CYCLE COMPUTATION                                                  */
/* ------------------------------------------------------------------ */

function predictCycles(data: CycleData, count: number): PredictedCycle[] {
  const cycles: PredictedCycle[] = [];
  const start = new Date(data.lastPeriodDate + 'T00:00:00');
  if (isNaN(start.getTime())) return [];

  for (let i = 0; i < count; i++) {
    const periodStart = new Date(start);
    periodStart.setDate(periodStart.getDate() + i * data.cycleLength);

    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + data.periodDuration - 1);

    const ovulationDate = new Date(periodStart);
    ovulationDate.setDate(ovulationDate.getDate() + data.cycleLength - 14);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    const lutealStart = new Date(ovulationDate);
    lutealStart.setDate(lutealStart.getDate() + 1);

    const nextPeriod = new Date(periodStart);
    nextPeriod.setDate(nextPeriod.getDate() + data.cycleLength);

    cycles.push({ periodStart, periodEnd, ovulationDate, fertileStart, fertileEnd, lutealStart, nextPeriod });
  }
  return cycles;
}

function getPhaseForDate(date: Date, cycles: PredictedCycle[]): 'period' | 'fertile' | 'ovulation' | 'luteal' | 'safe' | null {
  const d = date.getTime();
  for (const c of cycles) {
    if (d >= c.periodStart.getTime() && d <= c.periodEnd.getTime()) return 'period';
    if (d === c.ovulationDate.getTime()) return 'ovulation';
    if (d >= c.fertileStart.getTime() && d <= c.fertileEnd.getTime()) return 'fertile';
    if (d > c.periodEnd.getTime() && d < c.fertileStart.getTime()) return 'safe';
    if (d > c.fertileEnd.getTime() && d < c.nextPeriod.getTime()) return 'luteal';
  }
  return null;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysUntil(target: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

/* ------------------------------------------------------------------ */
/*  TOOLTIP                                                            */
/* ------------------------------------------------------------------ */

function Tip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex ml-1">
      <button type="button" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)} aria-label="Info"
        className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-pink-100 hover:text-pink-600 transition">
        <Info className="w-2.5 h-2.5" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-800 text-xs rounded-lg shadow-lg z-50 max-w-[220px] text-center whitespace-normal">
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  CALENDAR                                                           */
/* ------------------------------------------------------------------ */

function CycleCalendar({ year, month, cycles, onNav }: {
  year: number; month: number; cycles: PredictedCycle[];
  onNav: (dir: -1 | 1) => void;
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="select-none">
      {/* Nav */}
      <div className="flex items-center justify-between mb-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => onNav(-1)} aria-label="Previous month"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          <ChevronLeft className="w-4 h-4" />
        </motion.button>
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {MONTHS[month]} {year}
        </span>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => onNav(1)} aria-label="Next month"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {SHORT_DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-medium text-slate-400 dark:text-slate-500 py-1">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const date = new Date(year, month, day);
          const phase = getPhaseForDate(date, cycles);
          const isToday = date.getTime() === today.getTime();
          const colors = phase ? PHASE_COLORS[phase] : null;

          return (
            <motion.div key={day} whileHover={{ scale: 1.1 }}
              className={`relative aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all cursor-default
                ${colors ? colors.bg + ' ' + colors.text : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                ${isToday ? 'ring-2 ring-pink-400 dark:ring-pink-500' : ''}
              `}
              title={phase ? `${day} ${MONTHS[month]} — ${phase === 'ovulation' ? 'Ovulation Day' : phase.charAt(0).toUpperCase() + phase.slice(1) + ' Phase'}` : undefined}>
              {day}
              {phase === 'ovulation' && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-violet-500 ring-1 ring-white dark:ring-slate-800" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function PeriodCalculatorTool() {
  const [data, setData] = useState<CycleData>({
    lastPeriodDate: '',
    cycleLength: 28,
    periodDuration: 5,
  });
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showInfo, setShowInfo] = useState(false);

  /* Load history */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const saveHistory = useCallback((d: CycleData) => {
    if (!d.lastPeriodDate) return;
    setHistory(prev => {
      const item: HistoryItem = { id: Date.now().toString(36), data: { ...d }, timestamp: Date.now() };
      const updated = [item, ...prev.filter(h => h.data.lastPeriodDate !== d.lastPeriodDate)].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  /* Predicted cycles (6 months ahead) */
  const cycles = useMemo(() => {
    if (!data.lastPeriodDate) return [];
    const result = predictCycles(data, 8);
    return result;
  }, [data]);

  /* Save to history when prediction changes */
  useEffect(() => {
    if (cycles.length > 0) saveHistory(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.lastPeriodDate]);

  const nextCycle = cycles.length > 0 ? cycles.find(c => c.nextPeriod.getTime() > Date.now()) || cycles[1] : null;

  const navMonth = (dir: -1 | 1) => {
    let m = calMonth + dir;
    let y = calYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCalMonth(m);
    setCalYear(y);
  };

  const reset = () => {
    setData({ lastPeriodDate: '', cycleLength: 28, periodDuration: 5 });
  };

  const tryExample = () => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    setData({ lastPeriodDate: d.toISOString().slice(0, 10), cycleLength: 28, periodDuration: 5 });
  };

  const exportCSV = useCallback(() => {
    if (cycles.length === 0) return;
    let csv = 'Cycle,Period Start,Period End,Fertile Window Start,Ovulation Date,Fertile Window End,Next Period\n';
    cycles.forEach((c, i) => {
      csv += `${i + 1},${fmtDate(c.periodStart)},${fmtDate(c.periodEnd)},${fmtDate(c.fertileStart)},${fmtDate(c.ovulationDate)},${fmtDate(c.fertileEnd)},${fmtDate(c.nextPeriod)}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'cycle-predictions.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }, [cycles]);

  const loadFromHistory = (item: HistoryItem) => {
    setData(item.data);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasPrediction = cycles.length > 0;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 text-white p-5 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">Period & Ovulation Calculator</h2>
            <p className="text-pink-100 text-xs sm:text-sm mt-0.5 leading-relaxed">
              Track your menstrual cycle, predict periods, fertile windows & ovulation days.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-pink-100">
          <span className="inline-flex items-center gap-1"><Lock className="w-3 h-3" /> 100% private — nothing leaves your browser</span>
          <span className="inline-flex items-center gap-1"><Shield className="w-3 h-3" /> No account needed</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-pink-500" /> Your Cycle Details
          </h3>
          <div className="flex gap-1.5">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <History className="w-3 h-3" />
              {history.length > 0 && <span className="w-3.5 h-3.5 rounded-full bg-pink-500 text-white text-[9px] flex items-center justify-center">{history.length}</span>}
            </motion.button>
          </div>
        </div>

        {/* History */}
        <AnimatePresence>
          {showHistory && history.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 divide-y divide-slate-100 dark:divide-slate-600">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs font-medium text-slate-500">Recent Calculations</span>
                  <button onClick={clearHistory} className="text-[10px] text-red-500 hover:text-red-700 flex items-center gap-0.5"><Trash2 className="w-2.5 h-2.5" /> Clear</button>
                </div>
                {history.map(h => (
                  <button key={h.id} onClick={() => loadFromHistory(h)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white dark:hover:bg-slate-700 transition text-xs">
                    <span className="text-slate-700 dark:text-slate-300">LMP: {h.data.lastPeriodDate} &middot; {h.data.cycleLength} day cycle</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inputs */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Last Period Date <span className="text-red-400 ml-0.5">*</span>
              <Tip text="The first day of your most recent period (when bleeding started)." />
            </label>
            <input type="date" value={data.lastPeriodDate}
              onChange={e => setData(p => ({ ...p, lastPeriodDate: e.target.value }))}
              max={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 px-3 py-2.5 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
              aria-label="Last period date" />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Cycle Length
              <Tip text="Number of days from the start of one period to the start of the next. Average is 28 days (21-35 normal)." />
            </label>
            <div className="flex items-center gap-2">
              <input type="range" min={21} max={40} value={data.cycleLength}
                onChange={e => setData(p => ({ ...p, cycleLength: +e.target.value }))}
                className="flex-1 accent-pink-500 h-2 rounded-full" aria-label="Cycle length" />
              <span className="w-12 text-center text-sm font-semibold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 rounded-lg py-1">
                {data.cycleLength}d
              </span>
            </div>
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Period Duration
              <Tip text="How many days your period typically lasts. Average is 3-7 days." />
            </label>
            <div className="flex items-center gap-2">
              <input type="range" min={2} max={10} value={data.periodDuration}
                onChange={e => setData(p => ({ ...p, periodDuration: +e.target.value }))}
                className="flex-1 accent-pink-500 h-2 rounded-full" aria-label="Period duration" />
              <span className="w-12 text-center text-sm font-semibold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 rounded-lg py-1">
                {data.periodDuration}d
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <motion.button whileTap={{ scale: 0.95 }} onClick={tryExample}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-sm font-medium hover:bg-pink-100 dark:hover:bg-pink-900/50 transition">
            <Heart className="w-3.5 h-3.5" /> Try Example
          </motion.button>
          {hasPrediction && (
            <>
              <motion.button whileTap={{ scale: 0.95 }} onClick={exportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={reset}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-500 transition">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {!hasPrediction ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center py-12 text-slate-300 dark:text-slate-600">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Enter your last period date to see predictions</p>
            <p className="text-xs mt-1 text-slate-400">or click "Try Example" for a demo</p>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-5">

            {/* Countdown Cards */}
            {nextCycle && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: 'Next Period',
                    date: nextCycle.nextPeriod,
                    icon: Droplets,
                    color: 'from-rose-500 to-pink-600',
                    days: daysUntil(nextCycle.nextPeriod),
                  },
                  {
                    label: 'Ovulation',
                    date: nextCycle.ovulationDate,
                    icon: Sun,
                    color: 'from-violet-500 to-purple-600',
                    days: daysUntil(nextCycle.ovulationDate),
                  },
                  {
                    label: 'Fertile Window',
                    date: nextCycle.fertileStart,
                    icon: Baby,
                    color: 'from-emerald-500 to-green-600',
                    days: daysUntil(nextCycle.fertileStart),
                  },
                  {
                    label: 'Period Ends',
                    date: nextCycle.periodEnd,
                    icon: Moon,
                    color: 'from-amber-500 to-orange-600',
                    days: daysUntil(nextCycle.periodEnd),
                  },
                ].map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`rounded-xl bg-gradient-to-br ${card.color} text-white p-3 sm:p-4`}>
                      <Icon className="w-4 h-4 mb-1.5 opacity-80" />
                      <div className="text-[10px] sm:text-xs opacity-80 font-medium">{card.label}</div>
                      <div className="text-lg sm:text-xl font-bold mt-0.5">
                        {card.days > 0 ? `${card.days}d` : card.days === 0 ? 'Today' : `${Math.abs(card.days)}d ago`}
                      </div>
                      <div className="text-[10px] opacity-70 mt-0.5">{fmtDate(card.date)}</div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Calendar + Legend */}
            <div className="grid lg:grid-cols-[1fr_300px] gap-5">
              {/* Calendar */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <CycleCalendar year={calYear} month={calMonth} cycles={cycles} onNav={navMonth} />
                  <CycleCalendar
                    year={calMonth === 11 ? calYear + 1 : calYear}
                    month={calMonth === 11 ? 0 : calMonth + 1}
                    cycles={cycles}
                    onNav={navMonth}
                  />
                </div>
              </div>

              {/* Legend + Info */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-2.5">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Calendar Legend</h4>
                  {[
                    { phase: 'period' as const, label: 'Period / Menstruation', desc: 'Bleeding days' },
                    { phase: 'fertile' as const, label: 'Fertile Window', desc: 'Higher chance of conception' },
                    { phase: 'ovulation' as const, label: 'Ovulation Day', desc: 'Most fertile day' },
                    { phase: 'luteal' as const, label: 'Luteal Phase', desc: 'Post-ovulation' },
                    { phase: 'safe' as const, label: 'Follicular Phase', desc: 'Low fertility' },
                  ].map(item => (
                    <div key={item.phase} className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${PHASE_COLORS[item.phase].dot} shrink-0`} />
                      <div>
                        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.label}</div>
                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Disclaimer */}
                <motion.button onClick={() => setShowInfo(!showInfo)} whileTap={{ scale: 0.98 }}
                  className="w-full flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-left transition hover:bg-amber-100 dark:hover:bg-amber-900/30">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-amber-800 dark:text-amber-300">Medical Disclaimer</div>
                    <AnimatePresence>
                      {showInfo ? (
                        <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="text-[10px] text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                          This calculator provides estimates based on average cycle data. It should NOT be used as a birth control method or medical diagnosis.
                          Every body is different — cycles can vary due to stress, diet, illness, and other factors.
                          Consult a healthcare professional for medical advice.
                        </motion.p>
                      ) : (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400">Tap to read</p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Upcoming Cycles Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-500" /> Upcoming Cycle Predictions
              </h4>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-xs sm:text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      <th className="text-left py-2 px-3 font-medium text-slate-500">Cycle</th>
                      <th className="text-left py-2 px-3 font-medium text-rose-500">Period</th>
                      <th className="text-left py-2 px-3 font-medium text-emerald-500">Fertile Window</th>
                      <th className="text-left py-2 px-3 font-medium text-violet-500">Ovulation</th>
                      <th className="text-left py-2 px-3 font-medium text-slate-500">Next Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cycles.slice(0, 6).map((c, i) => (
                      <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                        className="border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                        <td className="py-2.5 px-3 font-medium text-slate-600 dark:text-slate-400">#{i + 1}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {fmtDate(c.periodStart)} — {fmtDate(c.periodEnd)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {fmtDate(c.fertileStart)} — {fmtDate(c.fertileEnd)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                            {fmtDate(c.ovulationDate)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{fmtDate(c.nextPeriod)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Privacy Reminder */}
            <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              <span>All data stored locally on your device. Nothing is sent to any server.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
