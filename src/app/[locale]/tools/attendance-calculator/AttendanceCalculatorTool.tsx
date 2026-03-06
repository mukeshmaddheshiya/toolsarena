'use client';

import { useState, useMemo } from 'react';
import { ClipboardCheck, Target, TrendingUp, AlertTriangle, CheckCircle, XCircle, BookOpen } from 'lucide-react';

type Mode = 'check' | 'plan';

export function AttendanceCalculatorTool() {
  const [mode, setMode] = useState<Mode>('check');
  const [totalClasses, setTotalClasses] = useState<number | ''>('');
  const [attended, setAttended] = useState<number | ''>('');
  const [targetPercent, setTargetPercent] = useState(75);

  const stats = useMemo(() => {
    const total = Number(totalClasses) || 0;
    const att = Number(attended) || 0;
    if (total <= 0) return null;
    const capped = Math.min(att, total);
    const percentage = (capped / total) * 100;
    const missed = total - capped;
    // Classes needed to reach target
    // (att + x) / (total + x) >= target/100  =>  x = (target*total - 100*att) / (100 - target)
    const needed = targetPercent >= 100 ? Infinity : Math.ceil((targetPercent * total - 100 * capped) / (100 - targetPercent));
    const classesNeeded = Math.max(0, needed);
    // How many can you skip and still maintain target
    // att / (total + s) >= target/100  =>  s = (100*att - target*total) / target
    const skippable = Math.max(0, Math.floor((100 * capped - targetPercent * total) / targetPercent));
    const status: 'safe' | 'warning' | 'danger' = percentage >= 75 ? 'safe' : percentage >= 65 ? 'warning' : 'danger';
    return { percentage, missed, classesNeeded, skippable, status, total, attended: capped };
  }, [totalClasses, attended, targetPercent]);

  const statusColor = stats?.status === 'safe' ? '#10b981' : stats?.status === 'warning' ? '#f59e0b' : '#ef4444';
  const pct = stats?.percentage ?? 0;
  const circumference = 2 * Math.PI * 54;
  const strokeDash = (pct / 100) * circumference;

  const presets = [75, 80, 85, 90];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 p-6 text-white text-center">
        <ClipboardCheck className="mx-auto mb-2" size={36} />
        <h2 className="text-2xl font-bold">Attendance Calculator</h2>
        <p className="text-teal-100 text-sm mt-1">Check your attendance or plan ahead to stay above the cut-off</p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1">
        {[
          { key: 'check' as Mode, label: 'Check Attendance', icon: ClipboardCheck },
          { key: 'plan' as Mode, label: 'Plan Attendance', icon: Target },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === key
                ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Classes</label>
          <input
            type="number"
            min={0}
            value={totalClasses}
            onChange={(e) => setTotalClasses(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
            placeholder="e.g. 120"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Classes Attended</label>
          <input
            type="number"
            min={0}
            value={attended}
            onChange={(e) => setAttended(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
            placeholder="e.g. 90"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
      </div>

      {mode === 'plan' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Attendance %</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setTargetPercent(p)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  targetPercent === p
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1}
            max={100}
            value={targetPercent}
            onChange={(e) => setTargetPercent(Math.min(100, Math.max(1, Number(e.target.value))))}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
      )}

      {/* Results */}
      {stats && (
        <>
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Donut */}
            <div className="relative flex-shrink-0">
              <svg width="140" height="140" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke={statusColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${strokeDash} ${circumference}`}
                  transform="rotate(-90 60 60)"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: statusColor }}>{pct.toFixed(1)}%</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Attendance</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {stats.status === 'safe' && <CheckCircle size={20} className="text-emerald-500" />}
                {stats.status === 'warning' && <AlertTriangle size={20} className="text-amber-500" />}
                {stats.status === 'danger' && <XCircle size={20} className="text-red-500" />}
                <span className="text-lg font-semibold" style={{ color: statusColor }}>
                  {stats.status === 'safe' ? 'Safe Zone' : stats.status === 'warning' ? 'Warning Zone' : 'Danger Zone'}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Attended {stats.attended} of {stats.total} classes ({stats.missed} missed)
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 border border-teal-200 dark:border-teal-800 p-4 text-center">
              <TrendingUp size={20} className="mx-auto mb-1 text-teal-600 dark:text-teal-400" />
              <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{pct.toFixed(1)}%</p>
              <p className="text-xs text-teal-600/70 dark:text-teal-400/70">Current %</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 p-4 text-center">
              <Target size={20} className="mx-auto mb-1 text-blue-600 dark:text-blue-400" />
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {stats.classesNeeded === 0 ? 'None' : stats.classesNeeded}
              </p>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Classes to {targetPercent}%</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800 p-4 text-center">
              <AlertTriangle size={20} className="mx-auto mb-1 text-amber-600 dark:text-amber-400" />
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.skippable}</p>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Safe to Skip</p>
            </div>
          </div>

          {/* Plan mode extra info */}
          {mode === 'plan' && (
            <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 space-y-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Target size={18} className="text-teal-500" /> Plan Summary for {targetPercent}% Target
              </h3>
              {stats.classesNeeded === 0 ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle size={24} className="text-emerald-500" />
                  <div>
                    <p className="font-medium text-emerald-700 dark:text-emerald-300">Already above target!</p>
                    <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70">
                      You can skip up to <strong>{stats.skippable}</strong> more class{stats.skippable !== 1 ? 'es' : ''} and still maintain {targetPercent}%.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <TrendingUp size={24} className="text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-300">
                      Attend <strong>{stats.classesNeeded}</strong> more consecutive class{stats.classesNeeded !== 1 ? 'es' : ''} to reach {targetPercent}%.
                    </p>
                    <p className="text-sm text-blue-600/70 dark:text-blue-400/70">
                      After that your attendance will be {targetPercent}% or above.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Info Section */}
      <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6 space-y-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <BookOpen size={18} className="text-teal-500" /> Why 75% Attendance Matters
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
          <li>Most Indian universities (UGC guidelines) require a minimum of <strong>75% attendance</strong> to be eligible for exams.</li>
          <li>Some colleges set the bar at 80% or even 85% for certain courses.</li>
          <li>Falling below the threshold can lead to <strong>detention</strong>, loss of exam eligibility, or extra assignments.</li>
          <li>Use the <strong>Plan Attendance</strong> tab to figure out exactly how many classes you need to attend or can safely skip.</li>
        </ul>
      </div>
    </div>
  );
}
