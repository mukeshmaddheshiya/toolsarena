'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Flame, RotateCcw, X, Check } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  completions: string[]; // ISO date strings e.g. "2025-03-19"
  createdAt: string;
}

const STORAGE_KEY = 'toolsarena_habits';
const MAX_HABITS = 10;

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function getWeekDates(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

function calculateStreak(completions: string[], frequency: 'daily' | 'weekly'): number {
  if (completions.length === 0) return 0;
  const sorted = [...completions].sort((a, b) => b.localeCompare(a));
  let streak = 0;
  const today = new Date();

  if (frequency === 'daily') {
    let cursor = new Date(today);
    for (let i = 0; i < 365; i++) {
      const iso = cursor.toISOString().split('T')[0];
      if (sorted.includes(iso)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        // Allow today to still count even if not yet done
        if (i === 0) {
          cursor.setDate(cursor.getDate() - 1);
          continue;
        }
        break;
      }
    }
  } else {
    // Weekly streak — count consecutive weeks with at least 1 completion
    let weekOffset = 0;
    for (let w = 0; w < 52; w++) {
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7) - weekOffset * 7);
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return date.toISOString().split('T')[0];
      });
      const hasCompletion = weekDates.some(d => sorted.includes(d));
      if (hasCompletion) {
        streak++;
        weekOffset++;
      } else {
        if (w === 0) { weekOffset++; continue; }
        break;
      }
    }
  }
  return streak;
}

function getStreakMessage(streak: number): string {
  if (streak === 0) return 'Start today!';
  if (streak === 1) return 'Great start!';
  if (streak < 5) return 'Keep it up!';
  if (streak < 10) return 'On a roll!';
  if (streak < 21) return 'Building momentum!';
  if (streak < 30) return 'Incredible discipline!';
  return 'Unstoppable!';
}

export function HabitTrackerTool() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newName, setNewName] = useState('');
  const [newFreq, setNewFreq] = useState<'daily' | 'weekly'>('daily');
  const [showAdd, setShowAdd] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHabits(JSON.parse(raw));
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits, loaded]);

  const today = getTodayISO();
  const weekDates = getWeekDates();

  function addHabit() {
    const name = newName.trim();
    if (!name || habits.length >= MAX_HABITS) return;
    const habit: Habit = {
      id: Date.now().toString(),
      name,
      frequency: newFreq,
      completions: [],
      createdAt: today,
    };
    setHabits(prev => [...prev, habit]);
    setNewName('');
    setShowAdd(false);
  }

  function toggleToday(id: string) {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== id) return h;
        const hasToday = h.completions.includes(today);
        return {
          ...h,
          completions: hasToday
            ? h.completions.filter(d => d !== today)
            : [...h.completions, today],
        };
      })
    );
  }

  function deleteHabit(id: string) {
    setHabits(prev => prev.filter(h => h.id !== id));
  }

  function resetAll() {
    setHabits([]);
    localStorage.removeItem(STORAGE_KEY);
    setShowResetConfirm(false);
  }

  function getWeekCompletion(habit: Habit): number {
    const done = weekDates.filter(d => habit.completions.includes(d)).length;
    const target = habit.frequency === 'daily' ? 7 : 1;
    return Math.min(100, Math.round((done / target) * 100));
  }

  if (!loaded) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckSquare className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Habit Tracker</h2>
            <p className="text-xs text-gray-500">Saved locally in your browser · {today}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {habits.length > 0 && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset All
            </button>
          )}
          {habits.length < MAX_HABITS && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Habit
            </button>
          )}
        </div>
      </div>

      {/* Reset confirm */}
      {showResetConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-3">
          <p className="text-sm text-red-700 font-medium">Reset all habits and history? This cannot be undone.</p>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={resetAll} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700">
              Yes, Reset
            </button>
            <button onClick={() => setShowResetConfirm(false)} className="text-xs border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add habit form */}
      {showAdd && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-800">New Habit</p>
            <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Habit name (e.g. Read 20 minutes)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addHabit()}
            maxLength={50}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-600">Frequency:</span>
            {(['daily', 'weekly'] as const).map(f => (
              <button
                key={f}
                onClick={() => setNewFreq(f)}
                className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                  newFreq === f
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-300 text-gray-600 hover:border-green-400'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={addHabit}
            disabled={!newName.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
          >
            Add Habit
          </button>
        </div>
      )}

      {/* Empty state */}
      {habits.length === 0 && !showAdd && (
        <div className="text-center py-14 bg-white border border-dashed border-gray-300 rounded-xl">
          <CheckSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No habits yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your first habit to get started</p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" /> Add Habit
          </button>
        </div>
      )}

      {/* Habit list */}
      <div className="space-y-4">
        {habits.map(habit => {
          const streak = calculateStreak(habit.completions, habit.frequency);
          const doneToday = habit.completions.includes(today);
          const weekPct = getWeekCompletion(habit);

          return (
            <div key={habit.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
              {/* Top row */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleToday(habit.id)}
                  className={`flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                    doneToday
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400 text-gray-300 hover:text-green-400'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${doneToday ? 'text-green-700' : 'text-gray-800'}`}>
                    {habit.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {habit.frequency} ·{' '}
                    <span className="text-orange-500 font-medium">
                      <Flame className="inline w-3 h-3 mb-0.5" /> {streak} streak
                    </span>
                    {streak > 0 && <span className="ml-1 text-gray-400">{getStreakMessage(streak)}</span>}
                  </p>
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Weekly calendar */}
              <div className="grid grid-cols-7 gap-1">
                {weekDates.map((date, i) => {
                  const done = habit.completions.includes(date);
                  const isToday = date === today;
                  return (
                    <div key={date} className="text-center">
                      <p className={`text-xs mb-1 ${isToday ? 'font-bold text-green-600' : 'text-gray-400'}`}>
                        {DAY_LABELS[i]}
                      </p>
                      <div
                        className={`w-full aspect-square rounded-md flex items-center justify-center ${
                          done
                            ? 'bg-green-500'
                            : isToday
                            ? 'bg-green-100 border border-green-300'
                            : 'bg-gray-100'
                        }`}
                      >
                        {done && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Week completion bar */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">This week</span>
                  <span className="text-xs font-semibold text-gray-700">{weekPct}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      weekPct >= 80 ? 'bg-green-500' : weekPct >= 50 ? 'bg-yellow-400' : 'bg-orange-400'
                    }`}
                    style={{ width: `${weekPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {habits.length > 0 && habits.length < MAX_HABITS && (
        <p className="text-center text-xs text-gray-400">
          {habits.length}/{MAX_HABITS} habits · {MAX_HABITS - habits.length} slot{MAX_HABITS - habits.length !== 1 ? 's' : ''} remaining
        </p>
      )}
    </div>
  );
}
