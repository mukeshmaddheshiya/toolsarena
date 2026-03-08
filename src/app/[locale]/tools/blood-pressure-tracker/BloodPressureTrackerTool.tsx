'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Heart, Plus, Trash2, Download, Upload, Printer, ShieldCheck,
  ChevronDown, ChevronUp, Activity, TrendingUp, BarChart3, AlertTriangle, Database
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface BPReading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  date: string;
  time: string;
  arm: 'left' | 'right';
  position: 'sitting' | 'standing' | 'lying';
  notes: string;
}

type BPCategory = 'normal' | 'elevated' | 'high1' | 'high2' | 'crisis';

interface CategoryInfo {
  label: string;
  color: string;
  bg: string;
  textColor: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'bp-tracker-readings';

const CATEGORIES: Record<BPCategory, CategoryInfo> = {
  normal:   { label: 'Normal',           color: 'bg-green-500',  bg: 'bg-green-50 dark:bg-green-950/40',   textColor: 'text-green-700 dark:text-green-300' },
  elevated: { label: 'Elevated',         color: 'bg-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/40', textColor: 'text-yellow-700 dark:text-yellow-300' },
  high1:    { label: 'High - Stage 1',   color: 'bg-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/40', textColor: 'text-orange-700 dark:text-orange-300' },
  high2:    { label: 'High - Stage 2',   color: 'bg-red-500',    bg: 'bg-red-50 dark:bg-red-950/40',       textColor: 'text-red-700 dark:text-red-300' },
  crisis:   { label: 'Hypertensive Crisis', color: 'bg-red-800', bg: 'bg-red-100 dark:bg-red-950/60',      textColor: 'text-red-900 dark:text-red-200' },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function classify(sys: number, dia: number): BPCategory {
  if (sys > 180 || dia > 120) return 'crisis';
  if (sys >= 140 || dia >= 90) return 'high2';
  if (sys >= 130 || dia >= 80) return 'high1';
  if (sys >= 120 && dia < 80) return 'elevated';
  return 'normal';
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatDate(d: string): string {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatShortDate(d: string): string {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function nowTime(): string {
  return new Date().toTimeString().slice(0, 5);
}

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
function generateSampleData(): BPReading[] {
  const samples: BPReading[] = [];
  const now = Date.now();
  const variations = [
    { sys: 118, dia: 76, pulse: 72 },
    { sys: 122, dia: 78, pulse: 68 },
    { sys: 135, dia: 85, pulse: 75 },
    { sys: 128, dia: 79, pulse: 70 },
    { sys: 142, dia: 92, pulse: 80 },
    { sys: 116, dia: 74, pulse: 66 },
    { sys: 130, dia: 82, pulse: 74 },
    { sys: 124, dia: 77, pulse: 71 },
    { sys: 138, dia: 88, pulse: 78 },
    { sys: 120, dia: 75, pulse: 69 },
    { sys: 145, dia: 94, pulse: 82 },
    { sys: 119, dia: 76, pulse: 67 },
    { sys: 132, dia: 84, pulse: 73 },
    { sys: 126, dia: 80, pulse: 72 },
    { sys: 115, dia: 73, pulse: 65 },
  ];
  for (let i = 0; i < 15; i++) {
    const d = new Date(now - (29 - i * 2) * 86400000);
    const v = variations[i];
    samples.push({
      id: genId(),
      systolic: v.sys + Math.floor(Math.random() * 5 - 2),
      diastolic: v.dia + Math.floor(Math.random() * 4 - 2),
      pulse: v.pulse + Math.floor(Math.random() * 4 - 2),
      date: d.toISOString().split('T')[0],
      time: `${8 + Math.floor(Math.random() * 12)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      arm: Math.random() > 0.5 ? 'left' : 'right',
      position: 'sitting',
      notes: '',
    });
  }
  return samples;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export function BloodPressureTrackerTool() {
  const [readings, setReadings] = useState<BPReading[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Form state
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState(nowTime);
  const [arm, setArm] = useState<'left' | 'right'>('left');
  const [position, setPosition] = useState<'sitting' | 'standing' | 'lying'>('sitting');
  const [notes, setNotes] = useState('');

  const [sortAsc, setSortAsc] = useState(false);
  const [activeTab, setActiveTab] = useState<'log' | 'chart' | 'stats'>('log');

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setReadings(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
  }, [readings, loaded]);

  const addReading = useCallback(() => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    const pul = parseInt(pulse);
    if (isNaN(sys) || isNaN(dia) || sys < 50 || sys > 300 || dia < 30 || dia > 200) return;
    const reading: BPReading = {
      id: genId(),
      systolic: sys,
      diastolic: dia,
      pulse: isNaN(pul) ? 0 : pul,
      date,
      time,
      arm,
      position,
      notes,
    };
    setReadings(prev => [reading, ...prev]);
    setSystolic('');
    setDiastolic('');
    setPulse('');
    setNotes('');
  }, [systolic, diastolic, pulse, date, time, arm, position, notes]);

  const deleteReading = useCallback((id: string) => {
    setReadings(prev => prev.filter(r => r.id !== id));
  }, []);

  const sortedReadings = useMemo(() => {
    const sorted = [...readings].sort((a, b) => {
      const da = new Date(`${a.date}T${a.time}`).getTime();
      const db = new Date(`${b.date}T${b.time}`).getTime();
      return sortAsc ? da - db : db - da;
    });
    return sorted;
  }, [readings, sortAsc]);

  // ─── CHART DATA ──────────────────────────────────────────────────────
  const chartReadings = useMemo(() => {
    return [...readings]
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
      .slice(-30);
  }, [readings]);

  // ─── STATISTICS ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const now = Date.now();
    const d7 = now - 7 * 86400000;
    const d30 = now - 30 * 86400000;
    const calc = (arr: BPReading[]) => {
      if (arr.length === 0) return { avgSys: 0, avgDia: 0, avgPulse: 0, count: 0, highSys: 0, lowSys: 0, highDia: 0, lowDia: 0 };
      const avgSys = Math.round(arr.reduce((s, r) => s + r.systolic, 0) / arr.length);
      const avgDia = Math.round(arr.reduce((s, r) => s + r.diastolic, 0) / arr.length);
      const avgPulse = Math.round(arr.reduce((s, r) => s + r.pulse, 0) / arr.filter(r => r.pulse > 0).length) || 0;
      return {
        avgSys, avgDia, avgPulse, count: arr.length,
        highSys: Math.max(...arr.map(r => r.systolic)),
        lowSys: Math.min(...arr.map(r => r.systolic)),
        highDia: Math.max(...arr.map(r => r.diastolic)),
        lowDia: Math.min(...arr.map(r => r.diastolic)),
      };
    };
    return {
      week: calc(readings.filter(r => new Date(`${r.date}T${r.time}`).getTime() >= d7)),
      month: calc(readings.filter(r => new Date(`${r.date}T${r.time}`).getTime() >= d30)),
      all: calc(readings),
    };
  }, [readings]);

  // ─── EXPORT CSV ──────────────────────────────────────────────────────
  const exportCSV = useCallback(() => {
    const header = 'Date,Time,Systolic,Diastolic,Pulse,Arm,Position,Category,Notes';
    const rows = sortedReadings.map(r =>
      `${r.date},${r.time},${r.systolic},${r.diastolic},${r.pulse},${r.arm},${r.position},${CATEGORIES[classify(r.systolic, r.diastolic)].label},"${r.notes.replace(/"/g, '""')}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `blood-pressure-log-${todayStr()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }, [sortedReadings]);

  // ─── IMPORT CSV ──────────────────────────────────────────────────────
  const importCSV = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const lines = text.split('\n').slice(1).filter(l => l.trim());
        const imported: BPReading[] = [];
        for (const line of lines) {
          const parts = line.match(/(".*?"|[^,]+)/g);
          if (!parts || parts.length < 7) continue;
          const sys = parseInt(parts[2]);
          const dia = parseInt(parts[3]);
          const pul = parseInt(parts[4]) || 0;
          if (isNaN(sys) || isNaN(dia)) continue;
          imported.push({
            id: genId(),
            date: parts[0],
            time: parts[1],
            systolic: sys,
            diastolic: dia,
            pulse: pul,
            arm: (parts[5] === 'right' ? 'right' : 'left'),
            position: (['sitting', 'standing', 'lying'].includes(parts[6]) ? parts[6] : 'sitting') as BPReading['position'],
            notes: parts[8]?.replace(/^"|"$/g, '').replace(/""/g, '"') || '',
          });
        }
        if (imported.length > 0) setReadings(prev => [...imported, ...prev]);
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  // ─── PRINT ──────────────────────────────────────────────────────────
  const printReport = useCallback(() => { window.print(); }, []);

  // ─── CATEGORY BADGE ─────────────────────────────────────────────────
  const CategoryBadge = ({ sys, dia }: { sys: number; dia: number }) => {
    const cat = classify(sys, dia);
    const info = CATEGORIES[cat];
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${info.bg} ${info.textColor}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${info.color}`} />
        {info.label}
      </span>
    );
  };

  // ─── SVG CHART ──────────────────────────────────────────────────────
  const Chart = () => {
    if (chartReadings.length < 2) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
          <BarChart3 className="h-12 w-12 mb-3" />
          <p className="text-sm">Add at least 2 readings to see the chart</p>
        </div>
      );
    }

    const W = 700, H = 320, PAD_L = 48, PAD_R = 16, PAD_T = 24, PAD_B = 48;
    const plotW = W - PAD_L - PAD_R;
    const plotH = H - PAD_T - PAD_B;

    const allSys = chartReadings.map(r => r.systolic);
    const allDia = chartReadings.map(r => r.diastolic);
    const minVal = Math.min(Math.min(...allDia) - 10, 50);
    const maxVal = Math.max(Math.max(...allSys) + 10, 190);
    const range = maxVal - minVal;

    const yPos = (v: number) => PAD_T + plotH - ((v - minVal) / range) * plotH;
    const xPos = (i: number) => PAD_L + (i / (chartReadings.length - 1)) * plotW;

    const sysPoints = chartReadings.map((r, i) => `${xPos(i)},${yPos(r.systolic)}`).join(' ');
    const diaPoints = chartReadings.map((r, i) => `${xPos(i)},${yPos(r.diastolic)}`).join(' ');

    // Zone bands
    const zones = [
      { min: 50, max: 80, fill: 'rgba(34,197,94,0.08)' },   // green (normal dia)
      { min: 80, max: 120, fill: 'rgba(34,197,94,0.12)' },   // green (normal sys)
      { min: 120, max: 130, fill: 'rgba(234,179,8,0.10)' },   // yellow
      { min: 130, max: 140, fill: 'rgba(249,115,22,0.10)' },  // orange
      { min: 140, max: 190, fill: 'rgba(239,68,68,0.08)' },   // red
    ];

    const yTicks = [60, 80, 100, 120, 140, 160, 180].filter(v => v >= minVal && v <= maxVal);

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[500px]" preserveAspectRatio="xMidYMid meet">
          {/* Zone bands */}
          {zones.map((z, i) => {
            const y1 = Math.max(yPos(Math.min(z.max, maxVal)), PAD_T);
            const y2 = Math.min(yPos(Math.max(z.min, minVal)), PAD_T + plotH);
            if (y2 <= y1) return null;
            return <rect key={i} x={PAD_L} y={y1} width={plotW} height={y2 - y1} style={{ fill: z.fill }} />;
          })}

          {/* Grid lines */}
          {yTicks.map(v => (
            <g key={v}>
              <line x1={PAD_L} y1={yPos(v)} x2={W - PAD_R} y2={yPos(v)} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
              <text x={PAD_L - 6} y={yPos(v) + 4} textAnchor="end" className="fill-gray-500 dark:fill-gray-400 text-[10px]">{v}</text>
            </g>
          ))}

          {/* X-axis labels */}
          {chartReadings.map((r, i) => {
            const show = chartReadings.length <= 10 || i % Math.ceil(chartReadings.length / 8) === 0 || i === chartReadings.length - 1;
            if (!show) return null;
            return (
              <text key={i} x={xPos(i)} y={H - 8} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400 text-[9px]">
                {formatShortDate(r.date)}
              </text>
            );
          })}

          {/* Lines */}
          <polyline points={sysPoints} fill="none" className="stroke-rose-500" strokeWidth="2" strokeLinejoin="round" />
          <polyline points={diaPoints} fill="none" className="stroke-blue-500" strokeWidth="2" strokeLinejoin="round" />

          {/* Dots */}
          {chartReadings.map((r, i) => (
            <g key={r.id}>
              <circle cx={xPos(i)} cy={yPos(r.systolic)} r="3.5" className="fill-rose-500" />
              <circle cx={xPos(i)} cy={yPos(r.diastolic)} r="3.5" className="fill-blue-500" />
            </g>
          ))}

          {/* Legend */}
          <circle cx={PAD_L + 10} cy={PAD_T - 10} r="4" className="fill-rose-500" />
          <text x={PAD_L + 18} y={PAD_T - 6} className="fill-gray-700 dark:fill-gray-300 text-[11px]">Systolic</text>
          <circle cx={PAD_L + 85} cy={PAD_T - 10} r="4" className="fill-blue-500" />
          <text x={PAD_L + 93} y={PAD_T - 6} className="fill-gray-700 dark:fill-gray-300 text-[11px]">Diastolic</text>

          {/* Y-axis label */}
          <text x={12} y={PAD_T + plotH / 2} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400 text-[10px]" transform={`rotate(-90,12,${PAD_T + plotH / 2})`}>mmHg</text>
        </svg>
      </div>
    );
  };

  // ─── STAT CARD ──────────────────────────────────────────────────────
  const StatCard = ({ title, data }: { title: string; data: { avgSys: number; avgDia: number; avgPulse: number; count: number; highSys: number; lowSys: number; highDia: number; lowDia: number } }) => {
    if (!data || data.count === 0) {
      return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h4>
          <p className="text-xs text-gray-400 dark:text-gray-500">No data</p>
        </div>
      );
    }
    const cat = classify(data.avgSys, data.avgDia);
    const info = CATEGORIES[cat];
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
          <span className="text-xs text-gray-400 dark:text-gray-500">{data.count} readings</span>
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{data.avgSys}/{data.avgDia}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">mmHg</span>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${info.bg} ${info.textColor}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${info.color}`} />
          {info.label}
        </span>
        {data.avgPulse > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Avg Pulse: {data.avgPulse} bpm</p>
        )}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div>Highest: {data.highSys}/{data.highDia}</div>
          <div>Lowest: {data.lowSys}/{data.lowDia}</div>
        </div>
      </div>
    );
  };

  // Preview classification
  const previewCat = systolic && diastolic && !isNaN(parseInt(systolic)) && !isNaN(parseInt(diastolic))
    ? classify(parseInt(systolic), parseInt(diastolic))
    : null;

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 print:space-y-4">
      {/* Privacy badge */}
      <div className="flex items-center justify-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 px-4 py-2 text-sm text-rose-700 dark:text-rose-300">
        <ShieldCheck className="h-4 w-4 flex-shrink-0" />
        <span>100% Private — all data stays in your browser</span>
      </div>

      {/* Input Form */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm print:hidden">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
          <Heart className="h-5 w-5 text-rose-500" />
          Add Reading
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Systolic (mmHg) *</label>
            <input
              type="number" min={50} max={300} value={systolic}
              onChange={e => setSystolic(e.target.value)}
              placeholder="120"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Diastolic (mmHg) *</label>
            <input
              type="number" min={30} max={200} value={diastolic}
              onChange={e => setDiastolic(e.target.value)}
              placeholder="80"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Pulse (bpm)</label>
            <input
              type="number" min={30} max={220} value={pulse}
              onChange={e => setPulse(e.target.value)}
              placeholder="72"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Date</label>
            <input
              type="date" value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Time</label>
            <input
              type="time" value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Arm</label>
            <select
              value={arm} onChange={e => setArm(e.target.value as 'left' | 'right')}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Position</label>
            <select
              value={position} onChange={e => setPosition(e.target.value as BPReading['position'])}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
            >
              <option value="sitting">Sitting</option>
              <option value="standing">Standing</option>
              <option value="lying">Lying Down</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Notes</label>
            <input
              type="text" value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. after coffee"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
            />
          </div>
        </div>

        {/* Preview + Add */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {previewCat && (
            <div className="flex items-center gap-2">
              <CategoryBadge sys={parseInt(systolic)} dia={parseInt(diastolic)} />
              {previewCat === 'crisis' && (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-700 dark:text-red-300">
                  <AlertTriangle className="h-3.5 w-3.5" /> Seek medical attention immediately!
                </span>
              )}
            </div>
          )}
          <button
            onClick={addReading}
            disabled={!systolic || !diastolic || isNaN(parseInt(systolic)) || isNaN(parseInt(diastolic))}
            className="ml-auto flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Reading
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 print:hidden">
        <button onClick={() => setReadings(prev => [...generateSampleData(), ...prev])} className="flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Database className="h-3.5 w-3.5" /> Add Sample Data
        </button>
        <button onClick={importCSV} className="flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Upload className="h-3.5 w-3.5" /> Import CSV
        </button>
        <button onClick={exportCSV} disabled={readings.length === 0} className="flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
        <button onClick={printReport} disabled={readings.length === 0} className="flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors">
          <Printer className="h-3.5 w-3.5" /> Print Report
        </button>
      </div>

      {/* BP Range Reference */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Blood Pressure Categories (AHA)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {([
            { cat: 'normal' as BPCategory, range: '<120 / <80' },
            { cat: 'elevated' as BPCategory, range: '120-129 / <80' },
            { cat: 'high1' as BPCategory, range: '130-139 / 80-89' },
            { cat: 'high2' as BPCategory, range: '140+ / 90+' },
            { cat: 'crisis' as BPCategory, range: '>180 / >120' },
          ]).map(({ cat, range }) => {
            const info = CATEGORIES[cat];
            return (
              <div key={cat} className={`rounded-lg px-3 py-2 ${info.bg}`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`h-2 w-2 rounded-full ${info.color}`} />
                  <span className={`text-xs font-semibold ${info.textColor}`}>{info.label}</span>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{range} mmHg</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 print:hidden">
        {([
          { key: 'log' as const, label: 'Readings Log', icon: Activity },
          { key: 'chart' as const, label: 'Trend Chart', icon: TrendingUp },
          { key: 'stats' as const, label: 'Statistics', icon: BarChart3 },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-white dark:bg-gray-700 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Readings Log */}
      {(activeTab === 'log' || typeof window !== 'undefined' && window.matchMedia?.('print')?.matches) && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Readings Log ({readings.length})
            </h3>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 print:hidden"
            >
              {sortAsc ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {sortAsc ? 'Oldest first' : 'Newest first'}
            </button>
          </div>
          {sortedReadings.length === 0 ? (
            <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
              No readings yet. Add your first reading above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Date & Time</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">SYS/DIA</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Pulse</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Category</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Arm</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Position</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">Notes</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 print:hidden">Del</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReadings.map(r => (
                    <tr key={r.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-3 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                        {formatDate(r.date)} <span className="text-gray-400 dark:text-gray-500">{r.time}</span>
                      </td>
                      <td className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">
                        {r.systolic}/{r.diastolic}
                      </td>
                      <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">
                        {r.pulse > 0 ? r.pulse : '-'}
                      </td>
                      <td className="px-3 py-2"><CategoryBadge sys={r.systolic} dia={r.diastolic} /></td>
                      <td className="px-3 py-2 text-center capitalize text-gray-600 dark:text-gray-400 hidden md:table-cell">{r.arm}</td>
                      <td className="px-3 py-2 text-center capitalize text-gray-600 dark:text-gray-400 hidden md:table-cell">{r.position}</td>
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400 max-w-[150px] truncate hidden lg:table-cell">{r.notes || '-'}</td>
                      <td className="px-3 py-2 text-center print:hidden">
                        <button onClick={() => deleteReading(r.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Chart Tab */}
      {activeTab === 'chart' && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Blood Pressure Trend (Last 30 readings)</h3>
          <Chart />
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Last 7 Days" data={stats.week} />
            <StatCard title="Last 30 Days" data={stats.month} />
            <StatCard title="All Time" data={stats.all} />
          </div>
        </div>
      )}

      {/* Print-only sections */}
      <div className="hidden print:block">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Blood Pressure Trend Chart</h3>
        <Chart />
        <div className="grid grid-cols-3 gap-4 mt-6">
          <StatCard title="Last 7 Days" data={stats.week} />
          <StatCard title="Last 30 Days" data={stats.month} />
          <StatCard title="All Time" data={stats.all} />
        </div>
        <p className="text-xs text-gray-400 mt-6 text-center">Generated by ToolsArena Blood Pressure Tracker - toolsarena.in</p>
      </div>
    </div>
  );
}
