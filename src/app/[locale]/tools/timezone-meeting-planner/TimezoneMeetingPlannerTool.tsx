// app/tools/utility-tools/timezone-meeting-planner/TimezoneMeetingPlannerTool.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import { Clock, Plus, X, Copy, CheckCheck, Calendar, Zap } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface TimezoneOption {
  label: string;
  abbr: string;
  iana: string;
}

interface SelectedZone extends TimezoneOption {
  id: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const ALL_TIMEZONES: TimezoneOption[] = [
  { label: 'India Standard Time', abbr: 'IST', iana: 'Asia/Kolkata' },
  { label: 'Eastern Time (US & Canada)', abbr: 'EST/EDT', iana: 'America/New_York' },
  { label: 'Pacific Time (US & Canada)', abbr: 'PST/PDT', iana: 'America/Los_Angeles' },
  { label: 'Greenwich Mean Time', abbr: 'GMT', iana: 'Europe/London' },
  { label: 'Central European Time', abbr: 'CET/CEST', iana: 'Europe/Berlin' },
  { label: 'Singapore Time', abbr: 'SGT', iana: 'Asia/Singapore' },
  { label: 'Japan Standard Time', abbr: 'JST', iana: 'Asia/Tokyo' },
  { label: 'Australian Eastern Time', abbr: 'AEST/AEDT', iana: 'Australia/Sydney' },
  { label: 'Nepal Time', abbr: 'NPT', iana: 'Asia/Kathmandu' },
  { label: 'Pakistan Standard Time', abbr: 'PKT', iana: 'Asia/Karachi' },
  { label: 'Gulf Standard Time', abbr: 'GST', iana: 'Asia/Dubai' },
  { label: 'Central Time (US & Canada)', abbr: 'CST/CDT', iana: 'America/Chicago' },
  { label: 'Mountain Time (US & Canada)', abbr: 'MST/MDT', iana: 'America/Denver' },
  { label: 'Brazil Time', abbr: 'BRT', iana: 'America/Sao_Paulo' },
  { label: 'Moscow Standard Time', abbr: 'MSK', iana: 'Europe/Moscow' },
  { label: 'Hong Kong Time', abbr: 'HKT', iana: 'Asia/Hong_Kong' },
  { label: 'Korea Standard Time', abbr: 'KST', iana: 'Asia/Seoul' },
  { label: 'New Zealand Time', abbr: 'NZST/NZDT', iana: 'Pacific/Auckland' },
];

const DEFAULT_ZONES: TimezoneOption[] = [
  ALL_TIMEZONES[0], // IST
  ALL_TIMEZONES[1], // EST
  ALL_TIMEZONES[3], // GMT
  ALL_TIMEZONES[5], // SGT
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function todayISO(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function getLocalHour(ianaZone: string, dateStr: string, utcHour: number): number {
  const baseDate = new Date(`${dateStr}T${String(utcHour).padStart(2, '0')}:00:00Z`);
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaZone,
    hour: 'numeric',
    hour12: false,
  });
  const parts = fmt.formatToParts(baseDate);
  const hourPart = parts.find((p) => p.type === 'hour');
  let h = parseInt(hourPart?.value ?? '0', 10);
  if (h === 24) h = 0;
  return h;
}

function formatTimeInZone(ianaZone: string, dateStr: string, utcHour: number): string {
  const baseDate = new Date(`${dateStr}T${String(utcHour).padStart(2, '0')}:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: ianaZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(baseDate);
}

function getOffsetLabel(ianaZone: string, dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00Z`);
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaZone,
    timeZoneName: 'short',
  });
  const parts = fmt.formatToParts(d);
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? ianaZone;
}

type SlotColor = 'green' | 'orange' | 'red';

function slotColor(localHour: number): SlotColor {
  if (localHour >= 9 && localHour < 18) return 'green';
  if ((localHour >= 7 && localHour < 9) || (localHour >= 18 && localHour < 20)) return 'orange';
  return 'red';
}

const COLOR_CLASSES: Record<SlotColor, string> = {
  green: 'bg-emerald-500/20 border-emerald-500/40 hover:bg-emerald-500/35 text-emerald-300',
  orange: 'bg-amber-500/20 border-amber-500/40 hover:bg-amber-500/35 text-amber-300',
  red: 'bg-red-500/10 border-red-500/20 hover:bg-red-500/25 text-red-400',
};

const SELECTED_CLASSES: Record<SlotColor, string> = {
  green: 'bg-emerald-500/60 border-emerald-400 ring-2 ring-emerald-400',
  orange: 'bg-amber-500/60 border-amber-400 ring-2 ring-amber-400',
  red: 'bg-red-500/40 border-red-400 ring-2 ring-red-400',
};

// ── Component ──────────────────────────────────────────────────────────────────
export function TimezoneMeetingPlannerTool() {
  const [selectedZones, setSelectedZones] = useState<SelectedZone[]>(
    DEFAULT_ZONES.map((z, i) => ({ ...z, id: `zone-${i}` }))
  );
  const [date, setDate] = useState<string>(todayISO());
  const [selectedUTCHour, setSelectedUTCHour] = useState<number | null>(null);
  const [addingZone, setAddingZone] = useState(false);
  const [copied, setCopied] = useState(false);

  const addZone = useCallback(
    (tz: TimezoneOption) => {
      if (selectedZones.length >= 6) return;
      if (selectedZones.some((z) => z.iana === tz.iana)) return;
      setSelectedZones((prev) => [...prev, { ...tz, id: `zone-${Date.now()}` }]);
      setAddingZone(false);
    },
    [selectedZones]
  );

  const removeZone = useCallback((id: string) => {
    setSelectedZones((prev) => prev.filter((z) => z.id !== id));
  }, []);

  const bestTimes = useMemo(() => {
    if (selectedZones.length === 0) return [];
    return HOURS.filter((utcH) => {
      return selectedZones.every((zone) => {
        const lh = getLocalHour(zone.iana, date, utcH);
        return slotColor(lh) === 'green';
      });
    });
  }, [selectedZones, date]);

  const copyInvite = useCallback(async () => {
    if (selectedUTCHour === null) return;
    const lines = [
      `Meeting Time — ${new Date(`${date}T${String(selectedUTCHour).padStart(2, '0')}:00:00Z`).toDateString()}`,
      '',
      ...selectedZones.map(
        (z) => `${z.abbr} (${z.label}): ${formatTimeInZone(z.iana, date, selectedUTCHour)}`
      ),
      '',
      'Generated by ToolsArena — Timezone Meeting Planner',
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [selectedUTCHour, selectedZones, date]);

  const availableToAdd = ALL_TIMEZONES.filter(
    (tz) => !selectedZones.some((z) => z.iana === tz.iana)
  );

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-800/60 rounded-xl border border-slate-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <label className="text-sm text-slate-300 font-medium">Meeting Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="ml-1 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {selectedZones.length < 6 && (
            <button
              onClick={() => setAddingZone((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Timezone
            </button>
          )}
          {selectedUTCHour !== null && (
            <button
              onClick={copyInvite}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors"
            >
              {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Invite'}
            </button>
          )}
        </div>
      </div>

      {/* Timezone add dropdown */}
      {addingZone && (
        <div className="p-4 bg-slate-800/80 rounded-xl border border-indigo-500/40 shadow-lg">
          <p className="text-sm text-slate-400 mb-3">Select a timezone to add ({selectedZones.length}/6 used):</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {availableToAdd.map((tz) => (
              <button
                key={tz.iana}
                onClick={() => addZone(tz)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors group"
              >
                <span className="text-xs font-bold text-indigo-400 w-16 shrink-0">{tz.abbr}</span>
                <span className="text-sm text-slate-300 truncate">{tz.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {[
          { color: 'bg-emerald-500/30 border-emerald-500/50', label: 'Working (9am–6pm)' },
          { color: 'bg-amber-500/30 border-amber-500/50', label: 'Early/Late (7–9am, 6–8pm)' },
          { color: 'bg-red-500/20 border-red-500/30', label: 'Off hours / Sleeping' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded border ${l.color} inline-block`} />
            <span className="text-slate-400">{l.label}</span>
          </div>
        ))}
        {selectedUTCHour !== null && (
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded border-2 border-indigo-400 inline-block bg-indigo-500/30" />
            <span className="text-slate-400">Selected time</span>
          </div>
        )}
      </div>

      {/* Grid */}
      {selectedZones.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
          <Clock className="w-12 h-12 opacity-40" />
          <p>Add at least one timezone to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="min-w-max w-full text-xs">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="sticky left-0 z-10 bg-slate-800 px-4 py-3 text-left text-slate-400 font-medium min-w-[180px] border-r border-slate-700">
                  Timezone
                </th>
                {HOURS.map((h) => (
                  <th
                    key={h}
                    className="px-1.5 py-3 text-center text-slate-500 font-normal min-w-[36px]"
                  >
                    {h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {selectedZones.map((zone) => {
                const offset = getOffsetLabel(zone.iana, date);
                return (
                  <tr key={zone.id} className="group">
                    <td className="sticky left-0 z-10 bg-slate-900 border-r border-slate-700 px-4 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="font-semibold text-slate-200">{zone.abbr}</div>
                          <div className="text-slate-500 text-[10px] truncate max-w-[130px]">{offset}</div>
                        </div>
                        <button
                          onClick={() => removeZone(zone.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-red-400 text-slate-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    {HOURS.map((utcH) => {
                      const localH = getLocalHour(zone.iana, date, utcH);
                      const color = slotColor(localH);
                      const isSelected = selectedUTCHour === utcH;
                      const baseClass = isSelected
                        ? SELECTED_CLASSES[color]
                        : COLOR_CLASSES[color];
                      return (
                        <td key={utcH} className="px-0.5 py-1.5">
                          <button
                            onClick={() =>
                              setSelectedUTCHour((prev) => (prev === utcH ? null : utcH))
                            }
                            title={`${zone.abbr}: ${formatTimeInZone(zone.iana, date, utcH)}`}
                            className={`w-8 h-8 rounded border text-[10px] font-medium transition-all ${baseClass}`}
                          >
                            {localH}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected time details */}
      {selectedUTCHour !== null && (
        <div className="p-4 bg-slate-800/60 rounded-xl border border-indigo-500/30">
          <h3 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Selected Meeting Time — All Zones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedZones.map((zone) => {
              const localH = getLocalHour(zone.iana, date, selectedUTCHour);
              const color = slotColor(localH);
              const bgMap = { green: 'bg-emerald-500/10 border-emerald-500/30', orange: 'bg-amber-500/10 border-amber-500/30', red: 'bg-red-500/10 border-red-500/20' };
              return (
                <div key={zone.id} className={`p-3 rounded-lg border ${bgMap[color]}`}>
                  <div className="font-bold text-slate-200 text-sm">{zone.abbr}</div>
                  <div className="text-slate-300 text-sm mt-0.5">
                    {formatTimeInZone(zone.iana, date, selectedUTCHour)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 truncate">{zone.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Best meeting times */}
      {selectedZones.length > 1 && (
        <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Best Meeting Times (all zones in working hours)
          </h3>
          {bestTimes.length === 0 ? (
            <p className="text-sm text-slate-500">
              No overlapping working-hour slots found for the selected timezones on this date.
              Consider flexible orange-zone slots.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {bestTimes.map((utcH) => (
                <button
                  key={utcH}
                  onClick={() => setSelectedUTCHour(utcH)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    selectedUTCHour === utcH
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                  }`}
                >
                  {utcH === 0 ? '12:00 AM' : utcH < 12 ? `${utcH}:00 AM` : utcH === 12 ? '12:00 PM' : `${utcH - 12}:00 PM`}{' '}
                  <span className="text-xs opacity-70">UTC</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-slate-600 text-center">
        All times calculated using browser Intl API — no server calls. DST handled automatically.
      </p>
    </div>
  );
}
