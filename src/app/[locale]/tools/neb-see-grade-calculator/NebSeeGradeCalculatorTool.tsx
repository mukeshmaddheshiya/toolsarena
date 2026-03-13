'use client';

import { useState, useMemo } from 'react';
import { PlusCircle, RotateCcw, BookOpen, Award } from 'lucide-react';

// ── Grade scale ───────────────────────────────────────────────────────────────
interface GradeEntry {
  minMarks: number;
  maxMarks: number;
  grade: string;
  gpa: number;
  label: string;
}

const GRADE_SCALE: GradeEntry[] = [
  { minMarks: 90, maxMarks: 100, grade: 'A+', gpa: 4.0, label: 'Outstanding' },
  { minMarks: 80, maxMarks: 89,  grade: 'A',  gpa: 3.6, label: 'Excellent' },
  { minMarks: 70, maxMarks: 79,  grade: 'B+', gpa: 3.2, label: 'Very Good' },
  { minMarks: 60, maxMarks: 69,  grade: 'B',  gpa: 2.8, label: 'Good' },
  { minMarks: 50, maxMarks: 59,  grade: 'C+', gpa: 2.4, label: 'Satisfactory' },
  { minMarks: 40, maxMarks: 49,  grade: 'C',  gpa: 2.0, label: 'Acceptable' },
  { minMarks: 30, maxMarks: 39,  grade: 'D',  gpa: 1.6, label: 'Partially Acceptable' },
  { minMarks: 0,  maxMarks: 29,  grade: 'NG', gpa: 0,   label: 'Not Graded' },
];

function getGradeInfo(marks: number): GradeEntry | null {
  if (isNaN(marks) || marks < 0 || marks > 100) return null;
  return GRADE_SCALE.find(g => marks >= g.minMarks && marks <= g.maxMarks) ?? null;
}

// ── Colour helpers ────────────────────────────────────────────────────────────
function gradeColour(grade: string): string {
  if (grade === 'A+' || grade === 'A')  return 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
  if (grade === 'B+' || grade === 'B')  return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  if (grade === 'C+' || grade === 'C')  return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
  if (grade === 'D')                    return 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
  return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
}

function gpaColour(gpa: number): string {
  if (gpa >= 3.6) return 'text-green-700 dark:text-green-300';
  if (gpa >= 2.8) return 'text-blue-700 dark:text-blue-300';
  if (gpa >= 2.0) return 'text-yellow-700 dark:text-yellow-300';
  if (gpa >= 1.6) return 'text-orange-700 dark:text-orange-300';
  return 'text-red-700 dark:text-red-300';
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Subject {
  id: number;
  name: string;
  marks: string;
}

const MAX_SUBJECTS = 8;

const INITIAL_SUBJECTS: Subject[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  name: '',
  marks: '',
}));

let nextId = 6;

// ── Component ─────────────────────────────────────────────────────────────────
export function NebSeeGradeCalculatorTool() {
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass =
    'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  const updateSubject = (id: number, field: 'name' | 'marks', value: string) => {
    setSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addSubject = () => {
    if (subjects.length >= MAX_SUBJECTS) return;
    setSubjects(prev => [...prev, { id: nextId++, name: '', marks: '' }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length <= 1) return;
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const clearAll = () => {
    setSubjects(INITIAL_SUBJECTS.map(s => ({ ...s, name: '', marks: '' })));
  };

  const result = useMemo(() => {
    const valid = subjects.filter(s => {
      const m = parseFloat(s.marks);
      return !isNaN(m) && m >= 0 && m <= 100;
    });
    if (valid.length === 0) return null;

    const subjectResults = valid.map(s => {
      const marks = parseFloat(s.marks);
      const info = getGradeInfo(marks)!;
      return { ...s, marks: marks, grade: info.grade, gpa: info.gpa };
    });

    const overallGpa = subjectResults.reduce((sum, s) => sum + s.gpa, 0) / subjectResults.length;
    const hasNG = subjectResults.some(s => s.grade === 'NG');
    const hasDOrC = subjectResults.some(s => s.grade === 'D' || s.grade === 'C');

    let status: 'promoted' | 'supplement' | 'not-promoted';
    let statusLabel: string;
    let statusColor: string;

    if (hasNG) {
      status = 'not-promoted';
      statusLabel = 'Not Promoted';
      statusColor = 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300';
    } else if (hasDOrC) {
      status = 'supplement';
      statusLabel = 'Pass (With Supplement / Back Exam)';
      statusColor = 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300';
    } else {
      status = 'promoted';
      statusLabel = 'Pass — Promoted';
      statusColor = 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300';
    }

    const overallGradeInfo = GRADE_SCALE.find(g => overallGpa >= g.gpa) ?? GRADE_SCALE[GRADE_SCALE.length - 1];

    return { subjectResults, overallGpa, status, statusLabel, statusColor, overallGradeInfo };
  }, [subjects]);

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-xs text-blue-800 dark:text-blue-300">
        <strong>NEB / SEE Grade System (Nepal).</strong> Enter marks (0–100) for each subject. Grades and GPA are calculated automatically. Maximum 8 subjects.
      </div>

      {/* Subject rows */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-500" />
            Enter Subject Marks
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">{subjects.length} / {MAX_SUBJECTS} subjects</span>
        </div>

        {/* Column headers */}
        <div className="hidden sm:grid grid-cols-[2fr_1fr_80px_80px_36px] gap-3 pb-1">
          <span className={labelClass + ' mb-0'}>Subject Name</span>
          <span className={labelClass + ' mb-0'}>Marks (0–100)</span>
          <span className={labelClass + ' mb-0 text-center'}>Grade</span>
          <span className={labelClass + ' mb-0 text-center'}>GPA</span>
          <span></span>
        </div>

        {subjects.map((subject, idx) => {
          const marksNum = parseFloat(subject.marks);
          const gradeInfo = subject.marks !== '' && !isNaN(marksNum) ? getGradeInfo(marksNum) : null;

          return (
            <div key={subject.id} className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_80px_80px_36px] gap-3 items-center">
              <div>
                <label className="sm:hidden block text-xs text-slate-500 dark:text-slate-400 mb-1">Subject {idx + 1}</label>
                <input
                  type="text"
                  placeholder={`Subject ${idx + 1}`}
                  value={subject.name}
                  onChange={e => updateSubject(subject.id, 'name', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="sm:hidden block text-xs text-slate-500 dark:text-slate-400 mb-1">Marks</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="0–100"
                  value={subject.marks}
                  onChange={e => updateSubject(subject.id, 'marks', e.target.value)}
                  className={inputClass}
                />
              </div>
              {/* Grade badge */}
              <div className="flex items-center justify-center">
                {gradeInfo ? (
                  <span className={`inline-flex items-center justify-center w-full py-2 rounded-xl border text-sm font-bold ${gradeColour(gradeInfo.grade)}`}>
                    {gradeInfo.grade}
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-300 dark:text-slate-600">—</span>
                )}
              </div>
              {/* GPA badge */}
              <div className="flex items-center justify-center">
                {gradeInfo ? (
                  <span className={`inline-flex items-center justify-center w-full py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold ${gpaColour(gradeInfo.gpa)}`}>
                    {gradeInfo.gpa.toFixed(1)}
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-full py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-300 dark:text-slate-600">—</span>
                )}
              </div>
              {/* Remove button */}
              <button
                onClick={() => removeSubject(subject.id)}
                disabled={subjects.length <= 1}
                className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Remove subject"
              >
                ✕
              </button>
            </div>
          );
        })}

        {/* Add subject button */}
        <div className="flex items-center gap-3 pt-1">
          {subjects.length < MAX_SUBJECTS && (
            <button
              onClick={addSubject}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Add Subject
            </button>
          )}
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Overall GPA card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Overall GPA</p>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <span className={`text-4xl font-bold ${gpaColour(result.overallGpa)}`}>
                    {result.overallGpa.toFixed(2)}
                  </span>
                  <span className={`text-lg font-bold px-3 py-1 rounded-xl border ${gradeColour(result.overallGradeInfo.grade)}`}>
                    {result.overallGradeInfo.grade}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {result.overallGradeInfo.label} · Based on {result.subjectResults.length} subject{result.subjectResults.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Status badge */}
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm ${result.statusColor}`}>
                <Award className="w-4 h-4 flex-shrink-0" />
                {result.statusLabel}
              </div>
            </div>

            {/* Status note */}
            {result.status === 'supplement' && (
              <div className="mt-3 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-lg px-3 py-2">
                One or more subjects have Grade C or D. Student may need to appear in supplementary/back examination.
              </div>
            )}
            {result.status === 'not-promoted' && (
              <div className="mt-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                One or more subjects have Grade NG (marks below 30). Student is not promoted.
              </div>
            )}
          </div>

          {/* Per-subject result summary */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Subject-wise Results</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    {['Subject', 'Marks', 'Grade', 'GPA', 'Remarks'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {result.subjectResults.map((s, i) => {
                    const info = getGradeInfo(s.marks)!;
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                          {s.name || `Subject ${i + 1}`}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-slate-700 dark:text-slate-300">{s.marks}</td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${gradeColour(s.grade)}`}>
                            {s.grade}
                          </span>
                        </td>
                        <td className={`px-4 py-2.5 font-mono font-semibold ${gpaColour(s.gpa)}`}>{s.gpa.toFixed(1)}</td>
                        <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400">{info.label}</td>
                      </tr>
                    );
                  })}
                  {/* GPA total row */}
                  <tr className="bg-slate-50 dark:bg-slate-900 border-t-2 border-slate-300 dark:border-slate-600">
                    <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200" colSpan={2}>Overall GPA</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${gradeColour(result.overallGradeInfo.grade)}`}>
                        {result.overallGradeInfo.grade}
                      </span>
                    </td>
                    <td className={`px-4 py-2.5 font-mono font-bold text-base ${gpaColour(result.overallGpa)}`}>{result.overallGpa.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400">{result.overallGradeInfo.label}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Grade scale reference table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">NEB / SEE Grade Scale Reference</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                {['Marks Range', 'Letter Grade', 'GPA', 'Remarks'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {GRADE_SCALE.map(g => (
                <tr key={g.grade} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-2.5 font-mono text-slate-700 dark:text-slate-300">
                    {g.minMarks} – {g.maxMarks}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${gradeColour(g.grade)}`}>
                      {g.grade}
                    </span>
                  </td>
                  <td className={`px-4 py-2.5 font-mono font-semibold ${gpaColour(g.gpa)}`}>{g.gpa.toFixed(1)}</td>
                  <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{g.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
