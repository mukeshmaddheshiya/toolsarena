'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar, Star, Gem, Trophy, Copy, CheckCheck, Clock } from 'lucide-react';

interface ZodiacSign { name: string; symbol: string; dateRange: string; element: string; }

function getZodiac(month: number, day: number): ZodiacSign {
  const signs: [number, number, ZodiacSign][] = [
    [1, 20, { name: 'Capricorn', symbol: '\u2651', dateRange: 'Dec 22 – Jan 19', element: 'Earth' }],
    [2, 19, { name: 'Aquarius', symbol: '\u2652', dateRange: 'Jan 20 – Feb 18', element: 'Air' }],
    [3, 20, { name: 'Pisces', symbol: '\u2653', dateRange: 'Feb 19 – Mar 20', element: 'Water' }],
    [4, 20, { name: 'Aries', symbol: '\u2648', dateRange: 'Mar 21 – Apr 19', element: 'Fire' }],
    [5, 21, { name: 'Taurus', symbol: '\u2649', dateRange: 'Apr 20 – May 20', element: 'Earth' }],
    [6, 21, { name: 'Gemini', symbol: '\u264A', dateRange: 'May 21 – Jun 20', element: 'Air' }],
    [7, 23, { name: 'Cancer', symbol: '\u264B', dateRange: 'Jun 21 – Jul 22', element: 'Water' }],
    [8, 23, { name: 'Leo', symbol: '\u264C', dateRange: 'Jul 23 – Aug 22', element: 'Fire' }],
    [9, 23, { name: 'Virgo', symbol: '\u264D', dateRange: 'Aug 23 – Sep 22', element: 'Earth' }],
    [10, 23, { name: 'Libra', symbol: '\u264E', dateRange: 'Sep 23 – Oct 22', element: 'Air' }],
    [11, 22, { name: 'Scorpio', symbol: '\u264F', dateRange: 'Oct 23 – Nov 21', element: 'Water' }],
    [12, 22, { name: 'Sagittarius', symbol: '\u2650', dateRange: 'Nov 22 – Dec 21', element: 'Fire' }],
    [12, 31, { name: 'Capricorn', symbol: '\u2651', dateRange: 'Dec 22 – Jan 19', element: 'Earth' }],
  ];
  for (const [m, d, sign] of signs) {
    if (month < m || (month === m && day <= d)) return sign;
  }
  return signs[0][2];
}

const BIRTHSTONES: Record<number, { stone: string; color: string }> = {
  1: { stone: 'Garnet', color: 'text-red-400' }, 2: { stone: 'Amethyst', color: 'text-purple-400' },
  3: { stone: 'Aquamarine', color: 'text-cyan-400' }, 4: { stone: 'Diamond', color: 'text-slate-200' },
  5: { stone: 'Emerald', color: 'text-emerald-400' }, 6: { stone: 'Pearl', color: 'text-slate-300' },
  7: { stone: 'Ruby', color: 'text-red-500' }, 8: { stone: 'Peridot', color: 'text-lime-400' },
  9: { stone: 'Sapphire', color: 'text-blue-400' }, 10: { stone: 'Opal', color: 'text-pink-400' },
  11: { stone: 'Topaz', color: 'text-amber-400' }, 12: { stone: 'Turquoise', color: 'text-teal-400' },
};

const INDIA_FACTS: Record<number, string> = {
  1950: 'India became a Republic on January 26, adopting its Constitution.',
  1951: 'India held its first general elections — the largest democratic exercise in history at the time.',
  1952: 'India won its first Olympic gold medal in field hockey.',
  1953: 'Tenzing Norgay and Edmund Hillary became the first to summit Everest.',
  1954: 'India and China signed the Panchsheel Agreement.',
  1955: 'The Bandung Conference established the Non-Aligned Movement.',
  1956: 'States Reorganisation Act divided India on linguistic lines.',
  1957: 'India launched its first Five Year Plan showing strong progress.',
  1958: 'India established the Defence Research and Development Organisation (DRDO).',
  1959: 'Dalai Lama sought asylum in India after fleeing Tibet.',
  1960: 'Bombay was divided into Maharashtra and Gujarat states.',
  1961: 'India liberated Goa from Portuguese rule.',
  1962: 'India-China War — India faced defeat in the border conflict.',
  1963: 'India launched its first rocket from Thumba, Kerala.',
  1964: 'Prime Minister Jawaharlal Nehru passed away; Lal Bahadur Shastri became PM.',
  1965: 'India-Pakistan War; ended with the Tashkent Declaration.',
  1966: 'Indira Gandhi became India\'s first female Prime Minister.',
  1967: 'Green Revolution transformed India\'s agricultural output.',
  1968: 'India signed the Nuclear Non-Proliferation Treaty.',
  1969: 'ISRO was established to develop India\'s space program.',
  1970: 'India launched its first satellite Aryabhata in 1970s planning phase.',
  1971: 'India won the Bangladesh Liberation War; Bangladesh became independent.',
  1972: 'Shimla Agreement signed after 1971 war.',
  1973: 'Project Tiger was launched to conserve the Bengal tiger.',
  1974: 'India conducted its first nuclear test — Pokhran-I, "Smiling Buddha".',
  1975: 'National Emergency declared by PM Indira Gandhi.',
  1976: 'India launched Aryabhata — its first satellite.',
  1977: 'Emergency ended; Janata Party won elections — first non-Congress government.',
  1978: 'Indira Gandhi returned to power in state elections.',
  1979: 'Mother Teresa of Calcutta was awarded the Nobel Peace Prize.',
  1980: 'Indira Gandhi returned as PM; India won the Hockey World Cup.',
  1981: 'India\'s first remote sensing satellite APPLE was launched.',
  1982: 'India hosted the Asian Games in New Delhi.',
  1983: 'India won the Cricket World Cup under Kapil Dev.',
  1984: 'Operation Blue Star and assassination of PM Indira Gandhi.',
  1985: 'Rajiv Gandhi became PM; SAARC was founded in Dhaka.',
  1986: 'India launched INSAT-1B, boosting telecommunications.',
  1987: 'India deployed peacekeeping forces in Sri Lanka (IPKF).',
  1988: 'India launched INS Chakra, its first nuclear submarine.',
  1989: 'Rajiv Gandhi\'s government fell; V.P. Singh became PM.',
  1990: 'Mandal Commission controversy and reservation protests.',
  1991: 'Economic liberalization under PM Narasimha Rao and FM Manmohan Singh.',
  1992: 'Demolition of Babri Masjid and subsequent communal riots.',
  1993: 'Mumbai serial bomb blasts killed hundreds.',
  1994: 'Sushmita Sen became the first Indian to win Miss Universe.',
  1995: 'India launched its first Internet service via VSNL.',
  1996: 'India won the Cricket World Cup co-hosted in the subcontinent.',
  1997: 'K.R. Narayanan became India\'s first Dalit President.',
  1998: 'India conducted Pokhran-II nuclear tests — Operation Shakti.',
  1999: 'Kargil War with Pakistan; India declared victory.',
  2000: 'India\'s population crossed one billion for the first time.',
  2001: 'Bhuj earthquake devastated Gujarat; Parliament attack in December.',
  2002: 'Gujarat riots; Rajdhani Express blast.',
  2003: 'India-Pakistan cricket series resumed after a long break.',
  2004: 'Tsunami devastated coastal India; Congress won general elections.',
  2005: 'Right to Information Act was passed.',
  2006: 'Mumbai train bombings; Indo-US nuclear deal announced.',
  2007: 'Pratibha Patil became India\'s first female President.',
  2008: 'Mumbai terror attacks (26/11); India won first individual Olympic gold (Abhinav Bindra).',
  2009: 'Indian Space Research Organisation launched Chandrayaan-1 to the Moon.',
  2010: 'India hosted the Commonwealth Games in New Delhi.',
};

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function addDays(date: Date, days: number): Date { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function addMonths(date: Date, months: number): Date { const d = new Date(date); d.setMonth(d.getMonth() + months); return d; }
function diffYMD(from: Date, to: Date) { let years = to.getFullYear() - from.getFullYear(); let months = to.getMonth() - from.getMonth(); let days = to.getDate() - from.getDate(); if (days < 0) { months--; const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0); days += prevMonth.getDate(); } if (months < 0) { years--; months += 12; } return { years, months, days }; }
function diffDays(from: Date, to: Date): number { return Math.floor((to.getTime() - from.getTime()) / 86400000); }
function formatMilestoneDate(date: Date): string { return `${DAYS_OF_WEEK[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`; }

export function DetailedAgeCalculatorTool() {
  const [dob, setDob] = useState<string>('1995-06-15');
  const [calcTo, setCalcTo] = useState<string>(new Date().toISOString().split('T')[0]);
  const [liveSeconds, setLiveSeconds] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const birthDate = useMemo(() => new Date(dob + 'T00:00:00'), [dob]);
  const toDate = useMemo(() => new Date(calcTo + 'T00:00:00'), [calcTo]);
  const isValid = !isNaN(birthDate.getTime()) && !isNaN(toDate.getTime()) && birthDate <= toDate;
  const age = useMemo(() => (isValid ? diffYMD(birthDate, toDate) : null), [isValid, birthDate, toDate]);
  const totalDays = useMemo(() => (isValid ? diffDays(birthDate, toDate) : 0), [isValid, birthDate, toDate]);

  useEffect(() => {
    if (!isValid) return;
    const updateSeconds = () => { setLiveSeconds(Math.floor((new Date().getTime() - birthDate.getTime()) / 1000)); };
    updateSeconds();
    const id = setInterval(updateSeconds, 1000);
    return () => clearInterval(id);
  }, [isValid, birthDate]);

  const zodiac = useMemo(() => (isValid ? getZodiac(birthDate.getMonth() + 1, birthDate.getDate()) : null), [isValid, birthDate]);
  const birthstone = useMemo(() => (isValid ? BIRTHSTONES[birthDate.getMonth() + 1] : null), [isValid, birthDate]);
  const indiaFact = useMemo(() => (isValid ? INDIA_FACTS[birthDate.getFullYear()] ?? null : null), [isValid, birthDate]);

  const milestones = useMemo(() => {
    if (!isValid) return [];
    const today = new Date();
    const items = [
      { label: '1,000 Days Old', date: addDays(birthDate, 1000) },
      { label: '5,000 Days Old', date: addDays(birthDate, 5000) },
      { label: '10,000 Days Old', date: addDays(birthDate, 10000) },
      { label: '100 Months Old', date: addMonths(birthDate, 100) },
      { label: '500 Months Old', date: addMonths(birthDate, 500) },
      { label: '1,000 Weeks Old', date: addDays(birthDate, 7000) },
    ];
    return items.map((m) => ({ ...m, past: m.date <= today, formatted: formatMilestoneDate(m.date) }));
  }, [isValid, birthDate]);

  const nextBirthday = useMemo(() => {
    if (!isValid) return null;
    const today = new Date();
    let next = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (next <= today) next = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
    if (birthDate.getMonth() === 1 && birthDate.getDate() === 29) {
      while (next.getDate() !== 29) { next = new Date(next.getFullYear() + 1, 1, 29); }
    }
    return { date: formatMilestoneDate(next), daysAway: diffDays(today, next), age: next.getFullYear() - birthDate.getFullYear() };
  }, [isValid, birthDate]);

  const dobDayOfWeek = useMemo(() => (isValid ? DAYS_OF_WEEK[birthDate.getDay()] : null), [isValid, birthDate]);

  const copyText = useCallback(async () => {
    if (!age) return;
    const text = [`Age: ${age.years} years, ${age.months} months, ${age.days} days`, `Total Days: ${totalDays.toLocaleString()}`, `Total Weeks: ${Math.floor(totalDays / 7).toLocaleString()}`, `Total Hours: ${(totalDays * 24).toLocaleString()}`, zodiac ? `Zodiac: ${zodiac.symbol} ${zodiac.name}` : '', birthstone ? `Birthstone: ${birthstone.stone}` : '', nextBirthday ? `Next Birthday: ${nextBirthday.date} (${nextBirthday.daysAway} days away)` : '', '', 'Calculated with ToolsArena — Detailed Age Calculator'].filter(Boolean).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [age, totalDays, zodiac, birthstone, nextBirthday]);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" /> Date of Birth
          </label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={calcTo} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" /> Calculate To
          </label>
          <input type="date" value={calcTo} onChange={(e) => setCalcTo(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm" />
        </div>
      </div>

      {!isValid && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-700 dark:text-amber-300">
          Please enter a valid date of birth that is before the "Calculate to" date.
        </div>
      )}

      {isValid && age && (
        <>
          <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-slate-100 dark:to-slate-800/60 rounded-2xl border border-indigo-500/30 text-center">
            <div className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Your Age</div>
            <div className="flex justify-center gap-6 flex-wrap">
              {[{ value: age.years, label: 'Years' }, { value: age.months, label: 'Months' }, { value: age.days, label: 'Days' }].map((a) => (
                <div key={a.label} className="flex flex-col items-center">
                  <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-300">{a.value}</span>
                  <span className="text-xs text-slate-500 mt-1">{a.label}</span>
                </div>
              ))}
            </div>
            {dobDayOfWeek && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                You were born on a <span className="text-indigo-600 dark:text-indigo-300 font-medium">{dobDayOfWeek}</span>
              </p>
            )}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Age in Every Unit</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Total Days', value: totalDays.toLocaleString() },
                { label: 'Total Weeks', value: Math.floor(totalDays / 7).toLocaleString() },
                { label: 'Total Months', value: (age.years * 12 + age.months).toLocaleString() },
                { label: 'Total Hours', value: (totalDays * 24).toLocaleString() },
                { label: 'Total Minutes', value: (totalDays * 24 * 60).toLocaleString() },
                { label: 'Live Seconds', value: (<span className="text-amber-400 font-mono animate-pulse">{liveSeconds.toLocaleString()}</span>) },
              ].map((s) => (
                <div key={s.label} className="p-3 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 mb-0.5">{s.label}</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {nextBirthday && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2"><Star className="w-4 h-4 text-amber-400" /><h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Next Birthday</h3></div>
              <p className="text-sm text-slate-800 dark:text-slate-200">{nextBirthday.date}</p>
              <div className="flex gap-4 mt-2 text-xs text-slate-500">
                <span><span className="text-amber-400 font-bold">{nextBirthday.daysAway}</span> days away</span>
                <span>Turning <span className="text-indigo-400 font-bold">{nextBirthday.age}</span></span>
              </div>
            </div>
          )}

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3"><Trophy className="w-4 h-4 text-amber-400" /><h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Life Milestones</h3></div>
            <div className="space-y-2">
              {milestones.map((m) => (
                <div key={m.label} className="flex items-center justify-between gap-4 py-1.5 border-b border-slate-200 dark:border-slate-700/50 last:border-0">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-36 shrink-0">{m.label}</span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 flex-1">{m.formatted}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${m.past ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>{m.past ? 'Reached' : 'Upcoming'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {zodiac && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2"><Star className="w-4 h-4 text-indigo-400" /><h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Zodiac Sign</h3></div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{zodiac.symbol}</span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{zodiac.name}</div>
                    <div className="text-xs text-slate-500">{zodiac.dateRange}</div>
                    <div className="text-xs text-indigo-400 mt-0.5">{zodiac.element} sign</div>
                  </div>
                </div>
              </div>
            )}
            {birthstone && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2"><Gem className="w-4 h-4 text-indigo-400" /><h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Birth Month Stone</h3></div>
                <div className="flex items-center gap-3">
                  <Gem className={`w-8 h-8 ${birthstone.color}`} />
                  <div>
                    <div className={`font-bold text-lg ${birthstone.color}`}>{birthstone.stone}</div>
                    <div className="text-xs text-slate-500">{MONTHS[birthDate.getMonth()]} birthstone</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {indiaFact && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Did you know? — {birthDate.getFullYear()}</div>
              <p className="text-sm text-slate-700 dark:text-slate-300">{indiaFact}</p>
            </div>
          )}

          <div className="flex justify-center">
            <button onClick={copyText} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors">
              {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Age Summary'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
