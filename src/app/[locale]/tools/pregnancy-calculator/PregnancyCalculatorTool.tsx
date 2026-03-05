'use client';
import { useState, useMemo } from 'react';
import { Baby, Calendar, Heart, Clock, Info, Star } from 'lucide-react';

type CalcMethod = 'lmp' | 'conception' | 'ivf' | 'ultrasound';

const TRIMESTERS = [
  { name: 'First Trimester', weeks: '1-12', desc: 'Organ formation, morning sickness phase', color: 'bg-pink-500' },
  { name: 'Second Trimester', weeks: '13-27', desc: 'Baby kicks, gender reveal possible', color: 'bg-purple-500' },
  { name: 'Third Trimester', weeks: '28-40', desc: 'Baby gains weight, preparing for birth', color: 'bg-blue-500' },
];

const MILESTONES = [
  { week: 4, event: 'Positive pregnancy test possible' },
  { week: 6, event: 'Heartbeat detectable on ultrasound' },
  { week: 8, event: 'First prenatal visit recommended' },
  { week: 12, event: 'First trimester screening / NT scan' },
  { week: 16, event: 'Gender can be determined' },
  { week: 20, event: 'Anatomy scan (anomaly scan)' },
  { week: 24, event: 'Viability milestone reached' },
  { week: 28, event: 'Third trimester begins, GD test' },
  { week: 32, event: 'Baby in head-down position usually' },
  { week: 36, event: 'Weekly doctor visits begin' },
  { week: 37, event: 'Full term — baby is ready!' },
  { week: 40, event: 'Expected due date (EDD)' },
];

// Baby size comparisons (fruit/object)
const BABY_SIZE: Record<number, { size: string; length: string; weight: string }> = {
  4: { size: 'Poppy seed', length: '0.1 cm', weight: '<1 g' },
  6: { size: 'Lentil', length: '0.6 cm', weight: '<1 g' },
  8: { size: 'Raspberry', length: '1.6 cm', weight: '1 g' },
  10: { size: 'Prune', length: '3.1 cm', weight: '4 g' },
  12: { size: 'Lime', length: '5.4 cm', weight: '14 g' },
  14: { size: 'Lemon', length: '8.7 cm', weight: '43 g' },
  16: { size: 'Avocado', length: '11.6 cm', weight: '100 g' },
  18: { size: 'Bell pepper', length: '14.2 cm', weight: '190 g' },
  20: { size: 'Banana', length: '16.4 cm', weight: '300 g' },
  22: { size: 'Papaya', length: '19 cm', weight: '430 g' },
  24: { size: 'Corn cob', length: '21 cm', weight: '600 g' },
  26: { size: 'Lettuce head', length: '23 cm', weight: '760 g' },
  28: { size: 'Eggplant', length: '25 cm', weight: '1 kg' },
  30: { size: 'Cabbage', length: '27 cm', weight: '1.3 kg' },
  32: { size: 'Coconut', length: '29 cm', weight: '1.7 kg' },
  34: { size: 'Pineapple', length: '32 cm', weight: '2.1 kg' },
  36: { size: 'Honeydew melon', length: '34 cm', weight: '2.6 kg' },
  38: { size: 'Pumpkin', length: '35 cm', weight: '3 kg' },
  40: { size: 'Watermelon', length: '36 cm', weight: '3.4 kg' },
};

function getBabySize(week: number): { size: string; length: string; weight: string } | null {
  const keys = Object.keys(BABY_SIZE).map(Number).sort((a, b) => a - b);
  let closest = keys[0];
  for (const k of keys) {
    if (k <= week) closest = k;
  }
  return week >= 4 ? BABY_SIZE[closest] || null : null;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
}

function daysBetween(d1: Date, d2: Date): number {
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export function PregnancyCalculatorTool() {
  const [method, setMethod] = useState<CalcMethod>('lmp');
  const [lmpDate, setLmpDate] = useState('');
  const [conceptionDate, setConceptionDate] = useState('');
  const [ivfDate, setIvfDate] = useState('');
  const [ivfDay, setIvfDay] = useState<3 | 5>(5);
  const [ultrasoundDate, setUltrasoundDate] = useState('');
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState('8');
  const [ultrasoundDays, setUltrasoundDays] = useState('0');

  const result = useMemo(() => {
    let dueDate: Date | null = null;
    let conceptionEst: Date | null = null;

    if (method === 'lmp' && lmpDate) {
      const lmp = new Date(lmpDate);
      dueDate = addDays(lmp, 280); // Naegele's rule: 280 days from LMP
      conceptionEst = addDays(lmp, 14);
    } else if (method === 'conception' && conceptionDate) {
      const cd = new Date(conceptionDate);
      dueDate = addDays(cd, 266); // 266 days from conception
      conceptionEst = cd;
    } else if (method === 'ivf' && ivfDate) {
      const ivf = new Date(ivfDate);
      // IVF: due = transfer date + (266 - embryo age)
      dueDate = addDays(ivf, 266 - ivfDay);
      conceptionEst = addDays(ivf, -ivfDay);
    } else if (method === 'ultrasound' && ultrasoundDate) {
      const usd = new Date(ultrasoundDate);
      const weeksAtScan = parseInt(ultrasoundWeeks) || 0;
      const daysAtScan = parseInt(ultrasoundDays) || 0;
      const totalDaysAtScan = weeksAtScan * 7 + daysAtScan;
      const lmpEst = addDays(usd, -totalDaysAtScan);
      dueDate = addDays(lmpEst, 280);
      conceptionEst = addDays(lmpEst, 14);
    }

    if (!dueDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lmpEst = addDays(dueDate, -280);
    const totalDays = daysBetween(lmpEst, today);
    const currentWeek = Math.max(0, Math.floor(totalDays / 7));
    const currentDay = Math.max(0, totalDays % 7);
    const daysLeft = Math.max(0, daysBetween(today, dueDate));
    const weeksLeft = Math.floor(daysLeft / 7);
    const progress = Math.min(100, Math.max(0, (totalDays / 280) * 100));

    const trimester = currentWeek <= 12 ? 1 : currentWeek <= 27 ? 2 : 3;

    // Key dates
    const firstTrimesterEnd = addDays(lmpEst, 12 * 7);
    const secondTrimesterEnd = addDays(lmpEst, 27 * 7);
    const fullTerm = addDays(lmpEst, 37 * 7);

    return {
      dueDate, conceptionEst, lmpEst,
      currentWeek, currentDay, daysLeft, weeksLeft, progress, trimester,
      firstTrimesterEnd, secondTrimesterEnd, fullTerm,
      isPast: daysLeft === 0 && daysBetween(today, dueDate) <= 0,
    };
  }, [method, lmpDate, conceptionDate, ivfDate, ivfDay, ultrasoundDate, ultrasoundWeeks, ultrasoundDays]);

  const methods: { id: CalcMethod; name: string; desc: string }[] = [
    { id: 'lmp', name: 'Last Period', desc: 'Most common method' },
    { id: 'conception', name: 'Conception Date', desc: 'If you know the date' },
    { id: 'ivf', name: 'IVF Transfer', desc: 'For IVF pregnancies' },
    { id: 'ultrasound', name: 'Ultrasound', desc: 'From scan results' },
  ];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Baby className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Pregnancy Due Date Calculator</h2>
            <p className="text-pink-100 text-xs">Calculate your baby&apos;s expected due date | Week-by-week tracker</p>
          </div>
        </div>
      </div>

      {/* Method Selector */}
      <div className="flex flex-wrap gap-2">
        {methods.map(m => (
          <button key={m.id} onClick={() => setMethod(m.id)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${method === m.id
              ? 'bg-pink-500 text-white shadow-md scale-105'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-pink-50'}`}>
            <div>{m.name}</div>
            <div className={`text-[9px] mt-0.5 ${method === m.id ? 'text-white/80' : 'text-slate-400'}`}>{m.desc}</div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Input */}
        <div className="space-y-4">
          {method === 'lmp' && (
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">First day of your last menstrual period (LMP)</label>
              <input type="date" value={lmpDate} onChange={e => setLmpDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
              <p className="text-[10px] text-slate-400 mt-1">Uses Naegele&apos;s rule: LMP + 280 days</p>
            </div>
          )}

          {method === 'conception' && (
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Date of Conception (Ovulation)</label>
              <input type="date" value={conceptionDate} onChange={e => setConceptionDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
              <p className="text-[10px] text-slate-400 mt-1">Due date = conception + 266 days</p>
            </div>
          )}

          {method === 'ivf' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">IVF Transfer Date</label>
                <input type="date" value={ivfDate} onChange={e => setIvfDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Embryo Age at Transfer</label>
                <div className="flex gap-2">
                  {([3, 5] as const).map(d => (
                    <button key={d} onClick={() => setIvfDay(d)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${ivfDay === d
                        ? 'bg-pink-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                      Day {d} Embryo
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {method === 'ultrasound' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Date of Ultrasound</label>
                <input type="date" value={ultrasoundDate} onChange={e => setUltrasoundDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Weeks at Scan</label>
                  <input type="number" value={ultrasoundWeeks} onChange={e => setUltrasoundWeeks(e.target.value)}
                    min="4" max="40"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Days</label>
                  <input type="number" value={ultrasoundDays} onChange={e => setUltrasoundDays(e.target.value)}
                    min="0" max="6"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* Trimester Info Cards */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Trimesters</h4>
            {TRIMESTERS.map((t, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${
                result && result.trimester === i + 1
                  ? 'border-pink-300 dark:border-pink-700 bg-pink-50 dark:bg-pink-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}>
                <div className={`w-2 h-8 rounded-full ${t.color}`} />
                <div className="flex-1">
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.name} {result && result.trimester === i + 1 && <span className="text-pink-500 text-[10px]">(You are here)</span>}
                  </div>
                  <div className="text-[10px] text-slate-500">Weeks {t.weeks} — {t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Due Date */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-200 dark:border-pink-800 rounded-xl p-5 text-center">
                <div className="text-xs text-pink-500 uppercase tracking-wider mb-1">Your Estimated Due Date</div>
                <div className="text-2xl font-bold text-pink-600">{formatDate(result.dueDate)}</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {result.daysLeft > 0
                    ? <span><strong>{result.weeksLeft} weeks, {result.daysLeft % 7} days</strong> to go!</span>
                    : <span className="text-pink-600 font-bold">Your baby could arrive any moment!</span>
                  }
                </div>
              </div>

              {/* Baby Size */}
              {result.currentWeek >= 4 && (() => {
                const babyInfo = getBabySize(result.currentWeek);
                return babyInfo ? (
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">Your Baby Right Now (Week {result.currentWeek})</h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-[10px] text-purple-500">Size of a</div>
                        <div className="text-sm font-bold text-purple-700 dark:text-purple-300">{babyInfo.size}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-purple-500">Length</div>
                        <div className="text-sm font-bold text-purple-700 dark:text-purple-300">{babyInfo.length}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-purple-500">Weight</div>
                        <div className="text-sm font-bold text-purple-700 dark:text-purple-300">{babyInfo.weight}</div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Current Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Week {result.currentWeek}, Day {result.currentDay}</span>
                  <span>{Math.round(result.progress)}% complete</span>
                </div>
                <div className="h-4 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-500"
                    style={{ width: `${result.progress}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>Week 1</span>
                  <span>Week 12</span>
                  <span>Week 27</span>
                  <span>Week 40</span>
                </div>
              </div>

              {/* Key Dates */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-700">
                {[
                  { label: 'Estimated Conception', date: result.conceptionEst, icon: Heart },
                  { label: 'First Trimester Ends', date: result.firstTrimesterEnd, icon: Calendar },
                  { label: 'Second Trimester Ends', date: result.secondTrimesterEnd, icon: Calendar },
                  { label: 'Full Term (37 weeks)', date: result.fullTerm, icon: Star },
                  { label: 'Due Date (40 weeks)', date: result.dueDate, icon: Baby },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                    <item.icon className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                    <span className="text-xs text-slate-500 flex-1">{item.label}</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {item.date ? item.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Milestones Timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Week-by-Week Milestones</h4>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {MILESTONES.map(m => {
                    const isPast = result.currentWeek >= m.week;
                    const isCurrent = result.currentWeek >= m.week - 1 && result.currentWeek <= m.week;
                    return (
                      <div key={m.week} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${
                        isCurrent ? 'bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800'
                        : isPast ? 'bg-green-50 dark:bg-green-900/10' : 'bg-white dark:bg-slate-800'
                      }`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          isPast ? 'bg-green-500 text-white' : isCurrent ? 'bg-pink-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}>
                          {isPast ? '✓' : m.week}
                        </div>
                        <span className={`flex-1 ${isPast ? 'text-green-700 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>
                          <strong>Week {m.week}:</strong> {m.event}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-10 text-center text-slate-400 text-sm">
              <Baby className="w-10 h-10 mx-auto mb-3 opacity-30" />
              Select a calculation method and enter the date to see your results
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-400">
        <strong>Disclaimer:</strong> This calculator provides an estimated due date. Only about 5% of babies are born on their exact due date. Most births occur between 38-42 weeks. Always consult your doctor or healthcare provider for accurate medical guidance.
      </div>
    </div>
  );
}
