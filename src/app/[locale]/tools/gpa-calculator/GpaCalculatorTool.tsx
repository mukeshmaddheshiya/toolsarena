'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Copy,
  Check,
  BookOpen,
  Target,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
} from 'lucide-react';

/* ───── Types & Constants ───── */

type GradingSystem = 'indian10' | 'us4' | 'percentage';

interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
  percentage: number;
}

interface Semester {
  id: string;
  name: string;
  subjects: Subject[];
  collapsed: boolean;
}

const INDIAN_GRADES: { label: string; value: string; point: number }[] = [
  { label: 'O (Outstanding)', value: 'O', point: 10 },
  { label: 'A+ (Excellent)', value: 'A+', point: 9 },
  { label: 'A (Very Good)', value: 'A', point: 8 },
  { label: 'B+ (Good)', value: 'B+', point: 7 },
  { label: 'B (Above Average)', value: 'B', point: 6 },
  { label: 'C (Average)', value: 'C', point: 5 },
  { label: 'P (Pass)', value: 'P', point: 4 },
  { label: 'F (Fail)', value: 'F', point: 0 },
];

const US_GRADES: { label: string; value: string; point: number }[] = [
  { label: 'A+ (4.0)', value: 'A+', point: 4.0 },
  { label: 'A (4.0)', value: 'A', point: 4.0 },
  { label: 'A- (3.7)', value: 'A-', point: 3.7 },
  { label: 'B+ (3.3)', value: 'B+', point: 3.3 },
  { label: 'B (3.0)', value: 'B', point: 3.0 },
  { label: 'B- (2.7)', value: 'B-', point: 2.7 },
  { label: 'C+ (2.3)', value: 'C+', point: 2.3 },
  { label: 'C (2.0)', value: 'C', point: 2.0 },
  { label: 'C- (1.7)', value: 'C-', point: 1.7 },
  { label: 'D+ (1.3)', value: 'D+', point: 1.3 },
  { label: 'D (1.0)', value: 'D', point: 1.0 },
  { label: 'F (0.0)', value: 'F', point: 0 },
];

const SYSTEMS: { key: GradingSystem; label: string; short: string }[] = [
  { key: 'indian10', label: 'Indian 10-Point CGPA', short: 'Indian 10' },
  { key: 'us4', label: 'US 4.0 GPA Scale', short: 'US 4.0' },
  { key: 'percentage', label: 'Percentage Based', short: 'Percentage' },
];

const uid = () => Math.random().toString(36).slice(2, 10);

function newSubject(): Subject {
  return { id: uid(), name: '', credits: 3, grade: '', percentage: 0 };
}

function newSemester(n: number): Semester {
  return {
    id: uid(),
    name: `Semester ${n}`,
    subjects: [newSubject(), newSubject(), newSubject()],
    collapsed: false,
  };
}

function gradePoint(system: GradingSystem, grade: string): number {
  if (system === 'indian10') return INDIAN_GRADES.find(g => g.value === grade)?.point ?? 0;
  if (system === 'us4') return US_GRADES.find(g => g.value === grade)?.point ?? 0;
  return 0;
}

function computeSGPA(system: GradingSystem, subjects: Subject[]): number {
  let totalCredits = 0;
  let weighted = 0;
  for (const s of subjects) {
    if (s.credits <= 0) continue;
    if (system === 'percentage') {
      if (s.percentage <= 0) continue;
      weighted += s.credits * s.percentage;
      totalCredits += s.credits;
    } else {
      if (!s.grade) continue;
      weighted += s.credits * gradePoint(system, s.grade);
      totalCredits += s.credits;
    }
  }
  return totalCredits > 0 ? weighted / totalCredits : 0;
}

function toPercentage(system: GradingSystem, gpa: number): number {
  if (system === 'indian10') return gpa * 9.5;
  if (system === 'us4') return gpa * 25;
  return gpa; // already percentage
}

function indianToUS(cgpa: number): number {
  return Math.min(4.0, (cgpa - 0.5) / 2.375);
}

function usToIndian(gpa: number): number {
  return gpa * 2.375 + 0.5;
}

function classify(system: GradingSystem, gpa: number): string {
  if (system === 'indian10') {
    if (gpa >= 8.0) return 'First Class with Distinction';
    if (gpa >= 6.5) return 'First Class';
    if (gpa >= 5.5) return 'Second Class';
    if (gpa >= 4.0) return 'Pass';
    return 'Fail';
  }
  if (system === 'us4') {
    if (gpa >= 3.7) return 'Summa Cum Laude';
    if (gpa >= 3.5) return 'Magna Cum Laude';
    if (gpa >= 3.0) return 'Cum Laude';
    if (gpa >= 2.0) return 'Pass';
    return 'Fail';
  }
  // percentage
  if (gpa >= 75) return 'First Class with Distinction';
  if (gpa >= 60) return 'First Class';
  if (gpa >= 50) return 'Second Class';
  if (gpa >= 40) return 'Pass';
  return 'Fail';
}

const SAMPLE_DATA: Record<GradingSystem, Semester[]> = {
  indian10: [
    { id: uid(), name: 'Semester 1', collapsed: false, subjects: [
      { id: uid(), name: 'Mathematics I', credits: 4, grade: 'A+', percentage: 0 },
      { id: uid(), name: 'Physics', credits: 4, grade: 'A', percentage: 0 },
      { id: uid(), name: 'Chemistry', credits: 3, grade: 'A+', percentage: 0 },
      { id: uid(), name: 'English', credits: 2, grade: 'O', percentage: 0 },
    ]},
    { id: uid(), name: 'Semester 2', collapsed: false, subjects: [
      { id: uid(), name: 'Mathematics II', credits: 4, grade: 'A', percentage: 0 },
      { id: uid(), name: 'Programming', credits: 4, grade: 'O', percentage: 0 },
      { id: uid(), name: 'Electronics', credits: 3, grade: 'B+', percentage: 0 },
      { id: uid(), name: 'Workshop', credits: 2, grade: 'A', percentage: 0 },
    ]},
    { id: uid(), name: 'Semester 3', collapsed: false, subjects: [
      { id: uid(), name: 'Data Structures', credits: 4, grade: 'O', percentage: 0 },
      { id: uid(), name: 'Discrete Math', credits: 4, grade: 'A+', percentage: 0 },
      { id: uid(), name: 'Digital Logic', credits: 3, grade: 'A', percentage: 0 },
      { id: uid(), name: 'Environmental Science', credits: 2, grade: 'B+', percentage: 0 },
    ]},
    { id: uid(), name: 'Semester 4', collapsed: false, subjects: [
      { id: uid(), name: 'Algorithms', credits: 4, grade: 'A+', percentage: 0 },
      { id: uid(), name: 'Database Systems', credits: 4, grade: 'O', percentage: 0 },
      { id: uid(), name: 'OS', credits: 3, grade: 'A', percentage: 0 },
      { id: uid(), name: 'Probability & Stats', credits: 3, grade: 'A+', percentage: 0 },
    ]},
  ],
  us4: [
    { id: uid(), name: 'Semester 1', collapsed: false, subjects: [
      { id: uid(), name: 'Calculus I', credits: 4, grade: 'A', percentage: 0 },
      { id: uid(), name: 'English Composition', credits: 3, grade: 'A-', percentage: 0 },
      { id: uid(), name: 'Intro to CS', credits: 3, grade: 'A+', percentage: 0 },
      { id: uid(), name: 'History', credits: 3, grade: 'B+', percentage: 0 },
    ]},
    { id: uid(), name: 'Semester 2', collapsed: false, subjects: [
      { id: uid(), name: 'Calculus II', credits: 4, grade: 'B+', percentage: 0 },
      { id: uid(), name: 'Physics I', credits: 4, grade: 'A', percentage: 0 },
      { id: uid(), name: 'Data Structures', credits: 3, grade: 'A', percentage: 0 },
      { id: uid(), name: 'Psychology', credits: 3, grade: 'A-', percentage: 0 },
    ]},
    { id: uid(), name: 'Semester 3', collapsed: false, subjects: [
      { id: uid(), name: 'Linear Algebra', credits: 3, grade: 'A', percentage: 0 },
      { id: uid(), name: 'Physics II', credits: 4, grade: 'B+', percentage: 0 },
      { id: uid(), name: 'Algorithms', credits: 3, grade: 'A+', percentage: 0 },
      { id: uid(), name: 'Technical Writing', credits: 3, grade: 'A', percentage: 0 },
    ]},
    { id: uid(), name: 'Semester 4', collapsed: false, subjects: [
      { id: uid(), name: 'Operating Systems', credits: 3, grade: 'A-', percentage: 0 },
      { id: uid(), name: 'Databases', credits: 3, grade: 'A', percentage: 0 },
      { id: uid(), name: 'Statistics', credits: 3, grade: 'B+', percentage: 0 },
      { id: uid(), name: 'Elective', credits: 3, grade: 'A', percentage: 0 },
    ]},
  ],
  percentage: [
    { id: uid(), name: 'Semester 1', collapsed: false, subjects: [
      { id: uid(), name: 'Mathematics I', credits: 4, grade: '', percentage: 88 },
      { id: uid(), name: 'Physics', credits: 4, grade: '', percentage: 76 },
      { id: uid(), name: 'Chemistry', credits: 3, grade: '', percentage: 82 },
      { id: uid(), name: 'English', credits: 2, grade: '', percentage: 91 },
    ]},
    { id: uid(), name: 'Semester 2', collapsed: false, subjects: [
      { id: uid(), name: 'Mathematics II', credits: 4, grade: '', percentage: 79 },
      { id: uid(), name: 'Programming', credits: 4, grade: '', percentage: 95 },
      { id: uid(), name: 'Electronics', credits: 3, grade: '', percentage: 71 },
      { id: uid(), name: 'Workshop', credits: 2, grade: '', percentage: 85 },
    ]},
    { id: uid(), name: 'Semester 3', collapsed: false, subjects: [
      { id: uid(), name: 'Data Structures', credits: 4, grade: '', percentage: 92 },
      { id: uid(), name: 'Discrete Math', credits: 4, grade: '', percentage: 84 },
      { id: uid(), name: 'Digital Logic', credits: 3, grade: '', percentage: 78 },
      { id: uid(), name: 'Environmental Science', credits: 2, grade: '', percentage: 73 },
    ]},
    { id: uid(), name: 'Semester 4', collapsed: false, subjects: [
      { id: uid(), name: 'Algorithms', credits: 4, grade: '', percentage: 89 },
      { id: uid(), name: 'Database Systems', credits: 4, grade: '', percentage: 94 },
      { id: uid(), name: 'OS', credits: 3, grade: '', percentage: 81 },
      { id: uid(), name: 'Probability & Stats', credits: 3, grade: '', percentage: 86 },
    ]},
  ],
};

/* ───── Conversion Reference Table ───── */

const CONVERSION_TABLE = [
  { indian: '10.0', us: '4.0', pct: '95', classif: 'Outstanding' },
  { indian: '9.0', us: '3.58', pct: '85.5', classif: 'Excellent' },
  { indian: '8.0', us: '3.16', pct: '76', classif: 'Very Good' },
  { indian: '7.0', us: '2.74', pct: '66.5', classif: 'Good' },
  { indian: '6.0', us: '2.32', pct: '57', classif: 'Above Average' },
  { indian: '5.0', us: '1.89', pct: '47.5', classif: 'Average' },
  { indian: '4.0', us: '1.47', pct: '38', classif: 'Pass' },
];

/* ───── Component ───── */

export function GpaCalculatorTool() {
  const [system, setSystem] = useState<GradingSystem>('indian10');
  const [semesters, setSemesters] = useState<Semester[]>([newSemester(1)]);
  const [copied, setCopied] = useState(false);
  const [showConversion, setShowConversion] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [targetGpa, setTargetGpa] = useState('');
  const [targetCredits, setTargetCredits] = useState('15');

  /* ── Semester / Subject CRUD ── */
  const addSemester = useCallback(() => {
    if (semesters.length >= 8) return;
    setSemesters(prev => [...prev, newSemester(prev.length + 1)]);
  }, [semesters.length]);

  const removeSemester = useCallback((semId: string) => {
    setSemesters(prev => prev.filter(s => s.id !== semId));
  }, []);

  const toggleCollapse = useCallback((semId: string) => {
    setSemesters(prev => prev.map(s => s.id === semId ? { ...s, collapsed: !s.collapsed } : s));
  }, []);

  const addSubject = useCallback((semId: string) => {
    setSemesters(prev => prev.map(s => s.id === semId ? { ...s, subjects: [...s.subjects, newSubject()] } : s));
  }, []);

  const removeSubject = useCallback((semId: string, subId: string) => {
    setSemesters(prev => prev.map(s => s.id === semId ? { ...s, subjects: s.subjects.filter(sub => sub.id !== subId) } : s));
  }, []);

  const updateSubject = useCallback((semId: string, subId: string, field: keyof Subject, value: string | number) => {
    setSemesters(prev => prev.map(s =>
      s.id === semId
        ? { ...s, subjects: s.subjects.map(sub => sub.id === subId ? { ...sub, [field]: value } : sub) }
        : s
    ));
  }, []);

  const handleSystemChange = useCallback((newSystem: GradingSystem) => {
    setSystem(newSystem);
    setSemesters([newSemester(1)]);
  }, []);

  const loadExample = useCallback(() => {
    setSemesters(SAMPLE_DATA[system].map(s => ({ ...s, id: uid(), subjects: s.subjects.map(sub => ({ ...sub, id: uid() })) })));
  }, [system]);

  /* ── Calculations ── */
  const semesterResults = useMemo(() => {
    return semesters.map(sem => {
      const sgpa = computeSGPA(system, sem.subjects);
      const totalCredits = sem.subjects.reduce((sum, s) => {
        if (system === 'percentage') return sum + (s.percentage > 0 ? s.credits : 0);
        return sum + (s.grade ? s.credits : 0);
      }, 0);
      return { id: sem.id, name: sem.name, sgpa, totalCredits };
    });
  }, [semesters, system]);

  const cgpa = useMemo(() => {
    let totalCredits = 0;
    let weighted = 0;
    for (const r of semesterResults) {
      if (r.totalCredits === 0) continue;
      weighted += r.sgpa * r.totalCredits;
      totalCredits += r.totalCredits;
    }
    return totalCredits > 0 ? weighted / totalCredits : 0;
  }, [semesterResults]);

  const totalCredits = useMemo(() => semesterResults.reduce((s, r) => s + r.totalCredits, 0), [semesterResults]);
  const maxSgpa = useMemo(() => Math.max(...semesterResults.map(r => r.sgpa), 1), [semesterResults]);
  const percentage = useMemo(() => toPercentage(system, cgpa), [system, cgpa]);
  const classification = useMemo(() => classify(system, cgpa), [system, cgpa]);

  const scaleMax = system === 'indian10' ? 10 : system === 'us4' ? 4 : 100;
  const scaleLabel = system === 'indian10' ? 'CGPA' : system === 'us4' ? 'GPA' : 'Avg %';

  /* ── Target GPA Calculator ── */
  const targetResult = useMemo(() => {
    const target = parseFloat(targetGpa);
    const nextCredits = parseInt(targetCredits);
    if (!target || !nextCredits || totalCredits === 0) return null;
    // required = (target * (totalCredits + nextCredits) - cgpa * totalCredits) / nextCredits
    const required = (target * (totalCredits + nextCredits) - cgpa * totalCredits) / nextCredits;
    return { required, possible: required <= scaleMax && required >= 0 };
  }, [targetGpa, targetCredits, totalCredits, cgpa, scaleMax]);

  /* ── Copy Results ── */
  const copyResults = useCallback(() => {
    const lines: string[] = [
      `=== GPA Calculator Results ===`,
      `Grading System: ${SYSTEMS.find(s => s.key === system)?.label}`,
      ``,
    ];
    for (const r of semesterResults) {
      lines.push(`${r.name}: ${system === 'percentage' ? r.sgpa.toFixed(1) + '%' : r.sgpa.toFixed(2)} (${r.totalCredits} credits)`);
    }
    lines.push('');
    lines.push(`Cumulative ${scaleLabel}: ${system === 'percentage' ? cgpa.toFixed(1) + '%' : cgpa.toFixed(2)}`);
    lines.push(`Equivalent Percentage: ${percentage.toFixed(1)}%`);
    lines.push(`Total Credits: ${totalCredits}`);
    lines.push(`Classification: ${classification}`);

    if (system === 'indian10') {
      lines.push(`Equivalent US GPA: ${indianToUS(cgpa).toFixed(2)}`);
    } else if (system === 'us4') {
      lines.push(`Equivalent Indian CGPA: ${usToIndian(cgpa).toFixed(2)}`);
    }

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [system, semesterResults, cgpa, percentage, totalCredits, classification, scaleLabel]);

  const grades = system === 'indian10' ? INDIAN_GRADES : US_GRADES;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── System Selector ── */}
      <div className="flex flex-wrap gap-2">
        {SYSTEMS.map(s => (
          <button
            key={s.key}
            onClick={() => handleSystemChange(s.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              system === s.key
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/25'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {s.short}
          </button>
        ))}
        <button
          onClick={loadExample}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-teal-600/10 text-teal-400 hover:bg-teal-600/20 border border-teal-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Try Example
        </button>
      </div>

      {/* ── Semesters ── */}
      <div className="space-y-4">
        {semesters.map((sem, semIdx) => {
          const result = semesterResults[semIdx];
          return (
            <div key={sem.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              {/* Semester Header */}
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => toggleCollapse(sem.id)}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  <span className="font-medium text-white">{sem.name}</span>
                  {result && result.totalCredits > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-600/20 text-teal-300">
                      {system === 'percentage' ? `${result.sgpa.toFixed(1)}%` : `SGPA: ${result.sgpa.toFixed(2)}`}
                      {' '}| {result.totalCredits} cr
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {semesters.length > 1 && (
                    <button
                      onClick={e => { e.stopPropagation(); removeSemester(sem.id); }}
                      className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                      aria-label="Remove semester"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {sem.collapsed ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {/* Subjects Table */}
              {!sem.collapsed && (
                <div className="px-4 pb-4 space-y-2">
                  {/* Header row - hidden on mobile */}
                  <div className="hidden sm:grid sm:grid-cols-[1fr_80px_1fr_40px] gap-2 text-xs text-gray-500 px-1">
                    <span>Subject</span>
                    <span>Credits</span>
                    <span>{system === 'percentage' ? 'Percentage' : 'Grade'}</span>
                    <span></span>
                  </div>
                  {sem.subjects.map(sub => (
                    <div key={sub.id} className="grid grid-cols-[1fr_60px_1fr_32px] sm:grid-cols-[1fr_80px_1fr_40px] gap-2 items-center">
                      <input
                        type="text"
                        value={sub.name}
                        onChange={e => updateSubject(sem.id, sub.id, 'name', e.target.value)}
                        placeholder="Subject name"
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                      />
                      <input
                        type="number"
                        value={sub.credits}
                        onChange={e => updateSubject(sem.id, sub.id, 'credits', Math.max(0, parseInt(e.target.value) || 0))}
                        min={0}
                        max={10}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm text-white text-center focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                      />
                      {system === 'percentage' ? (
                        <input
                          type="number"
                          value={sub.percentage || ''}
                          onChange={e => updateSubject(sem.id, sub.id, 'percentage', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                          min={0}
                          max={100}
                          placeholder="%"
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                        />
                      ) : (
                        <select
                          value={sub.grade}
                          onChange={e => updateSubject(sem.id, sub.id, 'grade', e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none appearance-none"
                        >
                          <option value="" className="bg-gray-900">Select</option>
                          {grades.map(g => (
                            <option key={g.value} value={g.value} className="bg-gray-900">{g.label}</option>
                          ))}
                        </select>
                      )}
                      <button
                        onClick={() => removeSubject(sem.id, sub.id)}
                        disabled={sem.subjects.length <= 1}
                        className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Remove subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addSubject(sem.id)}
                    className="flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 mt-1 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Subject
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {semesters.length < 8 && (
          <button
            onClick={addSemester}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-white/10 text-gray-400 hover:border-teal-500/30 hover:text-teal-400 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Semester ({semesters.length}/8)
          </button>
        )}
      </div>

      {/* ── Results Dashboard ── */}
      {cgpa > 0 && (
        <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-400" /> Results
            </h3>
            <button
              onClick={copyResults}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-white/10 text-white hover:bg-white/15 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Results'}
            </button>
          </div>

          {/* Large CGPA Display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
              <div className="text-3xl font-bold text-teal-400">
                {system === 'percentage' ? cgpa.toFixed(1) + '%' : cgpa.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400 mt-1">{scaleLabel}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
              <div className="text-3xl font-bold text-white">{percentage.toFixed(1)}%</div>
              <div className="text-xs text-gray-400 mt-1">Percentage</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
              <div className="text-3xl font-bold text-white">{totalCredits}</div>
              <div className="text-xs text-gray-400 mt-1">Total Credits</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
              <div className="text-lg font-bold text-teal-300 leading-tight">{classification}</div>
              <div className="text-xs text-gray-400 mt-1">Classification</div>
            </div>
          </div>

          {/* Cross-scale conversion */}
          {system === 'indian10' && cgpa > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 rounded-lg px-4 py-2.5">
              <Info className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Equivalent US GPA (4.0 scale): <strong className="text-white">{indianToUS(cgpa).toFixed(2)}</strong></span>
            </div>
          )}
          {system === 'us4' && cgpa > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 rounded-lg px-4 py-2.5">
              <Info className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Equivalent Indian CGPA (10-point): <strong className="text-white">{usToIndian(cgpa).toFixed(2)}</strong></span>
            </div>
          )}

          {/* Semester-wise SGPA bars */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-400">Semester-wise {system === 'percentage' ? 'Average' : 'SGPA'}</h4>
            {semesterResults.map(r => {
              if (r.totalCredits === 0) return null;
              const barWidth = system === 'percentage'
                ? Math.min(100, (r.sgpa / 100) * 100)
                : (r.sgpa / scaleMax) * 100;
              return (
                <div key={r.id} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-16 shrink-0 truncate">{r.name.replace('Semester ', 'Sem ')}</span>
                  <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${Math.max(barWidth, 8)}%` }}
                    >
                      <span className="text-[10px] font-bold text-white">
                        {system === 'percentage' ? r.sgpa.toFixed(1) + '%' : r.sgpa.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right">{r.totalCredits} cr</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Target GPA Calculator ── */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowTarget(!showTarget)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2 font-medium text-white">
            <Target className="w-4 h-4 text-teal-400" />
            Target {scaleLabel} Calculator
          </span>
          {showTarget ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showTarget && (
          <div className="px-4 pb-4 space-y-4">
            <p className="text-sm text-gray-400">
              What {system === 'percentage' ? 'average' : 'GPA'} do you need next semester to reach your target?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Target {scaleLabel}</label>
                <input
                  type="number"
                  value={targetGpa}
                  onChange={e => setTargetGpa(e.target.value)}
                  step={system === 'percentage' ? '1' : '0.1'}
                  min={0}
                  max={scaleMax}
                  placeholder={system === 'indian10' ? 'e.g. 8.5' : system === 'us4' ? 'e.g. 3.5' : 'e.g. 80'}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Next Semester Credits</label>
                <input
                  type="number"
                  value={targetCredits}
                  onChange={e => setTargetCredits(e.target.value)}
                  min={1}
                  max={30}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>
            {targetResult && (
              <div className={`rounded-lg px-4 py-3 text-sm ${
                targetResult.possible
                  ? 'bg-teal-500/10 border border-teal-500/20 text-teal-300'
                  : 'bg-red-500/10 border border-red-500/20 text-red-300'
              }`}>
                {targetResult.possible ? (
                  <>
                    You need a <strong>{system === 'percentage' ? targetResult.required.toFixed(1) + '%' : targetResult.required.toFixed(2)}</strong> {system === 'percentage' ? 'average' : scaleLabel} next semester to achieve your target.
                  </>
                ) : (
                  <>
                    This target is not achievable with {targetCredits} credits next semester. The required {scaleLabel} ({system === 'percentage' ? targetResult.required.toFixed(1) + '%' : targetResult.required.toFixed(2)}) exceeds the maximum of {scaleMax}.
                  </>
                )}
              </div>
            )}
            {totalCredits === 0 && (
              <p className="text-xs text-gray-500">Add grades above first to use the target calculator.</p>
            )}
          </div>
        )}
      </div>

      {/* ── GPA Conversion Reference Table ── */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowConversion(!showConversion)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2 font-medium text-white">
            <GraduationCap className="w-4 h-4 text-teal-400" />
            GPA Conversion Reference
          </span>
          {showConversion ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showConversion && (
          <div className="px-4 pb-4 overflow-x-auto">
            <table className="w-full text-sm mt-2">
              <thead>
                <tr className="text-left text-gray-500 border-b border-white/10">
                  <th className="py-2 pr-4">Indian CGPA</th>
                  <th className="py-2 pr-4">US GPA</th>
                  <th className="py-2 pr-4">Percentage</th>
                  <th className="py-2">Classification</th>
                </tr>
              </thead>
              <tbody>
                {CONVERSION_TABLE.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 text-gray-300">
                    <td className="py-2 pr-4 font-medium text-white">{row.indian}</td>
                    <td className="py-2 pr-4">{row.us}</td>
                    <td className="py-2 pr-4">{row.pct}%</td>
                    <td className="py-2 text-teal-300">{row.classif}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">
              * Conversions are approximate. Different universities may use slightly different formulas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
