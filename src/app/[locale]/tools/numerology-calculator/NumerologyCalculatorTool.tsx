'use client';
import { useState, useMemo } from 'react';
import { Sparkles, Hash, User, Calendar, Star, Heart, Palette, Gem, Zap } from 'lucide-react';

const PYTHAGOREAN: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

const MEANINGS: Record<number, { title: string; traits: string; strengths: string; challenges: string; careers: string; color: string }> = {
  1: { title: 'The Leader', traits: 'Independent, ambitious, innovative, courageous, original', strengths: 'Natural leadership, determination, creativity, pioneering spirit', challenges: 'Stubbornness, impatience, ego, isolation', careers: 'Entrepreneur, CEO, inventor, freelancer, military', color: 'from-red-500 to-orange-500' },
  2: { title: 'The Peacemaker', traits: 'Diplomatic, sensitive, cooperative, gentle, intuitive', strengths: 'Harmony, partnership, empathy, patience, attention to detail', challenges: 'Over-sensitivity, indecisiveness, dependency, shyness', careers: 'Counselor, mediator, teacher, artist, healer', color: 'from-blue-400 to-cyan-500' },
  3: { title: 'The Communicator', traits: 'Creative, expressive, social, optimistic, inspiring', strengths: 'Artistic expression, communication, joy, imagination, charm', challenges: 'Scattered energy, superficiality, mood swings, gossip', careers: 'Writer, actor, designer, marketing, entertainer', color: 'from-yellow-400 to-orange-400' },
  4: { title: 'The Builder', traits: 'Practical, disciplined, reliable, hardworking, loyal', strengths: 'Organization, stability, dedication, logic, endurance', challenges: 'Rigidity, stubbornness, workaholism, narrow-mindedness', careers: 'Engineer, accountant, architect, manager, banker', color: 'from-green-500 to-teal-500' },
  5: { title: 'The Adventurer', traits: 'Dynamic, versatile, freedom-loving, curious, energetic', strengths: 'Adaptability, resourcefulness, adventure, progressive thinking', challenges: 'Restlessness, impulsiveness, inconsistency, excess', careers: 'Travel, journalism, sales, event planning, pilot', color: 'from-orange-500 to-red-500' },
  6: { title: 'The Nurturer', traits: 'Caring, responsible, loving, protective, harmonious', strengths: 'Family devotion, service, beauty, healing, responsibility', challenges: 'Self-sacrifice, worry, perfectionism, control issues', careers: 'Doctor, teacher, chef, interior designer, social worker', color: 'from-pink-500 to-rose-500' },
  7: { title: 'The Seeker', traits: 'Analytical, introspective, spiritual, wise, mysterious', strengths: 'Deep thinking, research, intuition, spirituality, knowledge', challenges: 'Isolation, overthinking, skepticism, secretiveness', careers: 'Researcher, scientist, philosopher, analyst, detective', color: 'from-purple-500 to-violet-500' },
  8: { title: 'The Powerhouse', traits: 'Ambitious, authoritative, successful, material, confident', strengths: 'Business acumen, leadership, wealth attraction, management', challenges: 'Materialism, workaholism, power struggles, ruthlessness', careers: 'Business owner, banker, lawyer, real estate, politics', color: 'from-slate-600 to-slate-800' },
  9: { title: 'The Humanitarian', traits: 'Compassionate, generous, idealistic, artistic, global', strengths: 'Universal love, wisdom, selflessness, creativity, vision', challenges: 'Impracticality, moodiness, detachment, aloofness', careers: 'NGO worker, artist, philosopher, healer, teacher', color: 'from-emerald-500 to-teal-600' },
  11: { title: 'The Illuminator (Master)', traits: 'Visionary, intuitive, inspirational, spiritual, idealistic', strengths: 'Spiritual insight, inspiration, charisma, healing, invention', challenges: 'Nervous tension, impracticality, self-doubt, overwhelm', careers: 'Spiritual leader, inventor, psychic, motivational speaker', color: 'from-amber-400 to-yellow-500' },
  22: { title: 'The Master Builder', traits: 'Visionary builder, practical idealist, powerful, disciplined', strengths: 'Turning dreams into reality, large-scale vision, leadership', challenges: 'Enormous pressure, control issues, high expectations', careers: 'Architect, diplomat, global leader, philanthropist', color: 'from-indigo-500 to-purple-600' },
  33: { title: 'The Master Teacher', traits: 'Selfless, devoted, nurturing, healing, spiritually evolved', strengths: 'Unconditional love, spiritual teaching, healing, devotion', challenges: 'Martyrdom, emotional burden, unrealistic idealism', careers: 'Spiritual teacher, healer, humanitarian, counselor', color: 'from-rose-400 to-pink-600' },
};

const LUCKY_DATA: Record<number, { colors: string[]; day: string; gemstone: string; element: string; planet: string }> = {
  1: { colors: ['Red', 'Gold', 'Orange'], day: 'Sunday', gemstone: 'Ruby', element: 'Fire', planet: 'Sun' },
  2: { colors: ['White', 'Silver', 'Light Green'], day: 'Monday', gemstone: 'Pearl', element: 'Water', planet: 'Moon' },
  3: { colors: ['Yellow', 'Purple', 'Mauve'], day: 'Thursday', gemstone: 'Yellow Sapphire', element: 'Fire', planet: 'Jupiter' },
  4: { colors: ['Blue', 'Grey', 'Khaki'], day: 'Saturday', gemstone: 'Hessonite', element: 'Earth', planet: 'Rahu' },
  5: { colors: ['Green', 'Light Grey', 'White'], day: 'Wednesday', gemstone: 'Emerald', element: 'Air', planet: 'Mercury' },
  6: { colors: ['Pink', 'Blue', 'White'], day: 'Friday', gemstone: 'Diamond', element: 'Water', planet: 'Venus' },
  7: { colors: ['White', 'Light Green', 'Yellow'], day: 'Monday', gemstone: 'Cat\'s Eye', element: 'Water', planet: 'Ketu' },
  8: { colors: ['Black', 'Dark Blue', 'Purple'], day: 'Saturday', gemstone: 'Blue Sapphire', element: 'Earth', planet: 'Saturn' },
  9: { colors: ['Red', 'Crimson', 'Pink'], day: 'Tuesday', gemstone: 'Red Coral', element: 'Fire', planet: 'Mars' },
  11: { colors: ['Silver', 'White', 'Violet'], day: 'Monday', gemstone: 'Pearl', element: 'Air', planet: 'Moon' },
  22: { colors: ['Red', 'Gold', 'Orange'], day: 'Saturday', gemstone: 'Red Coral', element: 'Earth', planet: 'Saturn' },
  33: { colors: ['Pink', 'Turquoise', 'Gold'], day: 'Friday', gemstone: 'Diamond', element: 'Water', planet: 'Venus' },
};

const COMPATIBILITY: Record<number, number[]> = {
  1: [1, 3, 5, 9],
  2: [2, 4, 6, 8],
  3: [1, 3, 5, 9],
  4: [2, 4, 6, 8],
  5: [1, 3, 5, 7, 9],
  6: [2, 4, 6, 8, 9],
  7: [3, 5, 7],
  8: [2, 4, 6, 8],
  9: [1, 3, 5, 6, 9],
};

function reduceToSingle(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = String(num).split('').reduce((s, d) => s + parseInt(d), 0);
    if (num === 11 || num === 22 || num === 33) return num;
  }
  return num;
}

function nameToNumber(name: string): { total: number; breakdown: { letter: string; value: number }[] } {
  const breakdown: { letter: string; value: number }[] = [];
  let sum = 0;
  for (const ch of name.toUpperCase()) {
    if (PYTHAGOREAN[ch]) {
      const val = PYTHAGOREAN[ch];
      breakdown.push({ letter: ch, value: val });
      sum += val;
    }
  }
  return { total: reduceToSingle(sum), breakdown };
}

function getVowelConsonant(name: string): { soul: number; personality: number } {
  let vowelSum = 0, consonantSum = 0;
  for (const ch of name.toUpperCase()) {
    if (!PYTHAGOREAN[ch]) continue;
    if (VOWELS.has(ch)) vowelSum += PYTHAGOREAN[ch];
    else consonantSum += PYTHAGOREAN[ch];
  }
  return { soul: reduceToSingle(vowelSum), personality: reduceToSingle(consonantSum) };
}

function dobToLifePath(dob: string): number {
  if (!dob) return 0;
  const [yearStr, monthStr, dayStr] = dob.split('-');
  if (!yearStr || !monthStr || !dayStr) return 0;
  // Standard method: reduce month, day, year separately, then sum and reduce
  const monthNum = reduceToSingle(monthStr.split('').reduce((s, d) => s + parseInt(d), 0));
  const dayNum = reduceToSingle(dayStr.split('').reduce((s, d) => s + parseInt(d), 0));
  const yearNum = reduceToSingle(yearStr.split('').reduce((s, d) => s + parseInt(d), 0));
  return reduceToSingle(monthNum + dayNum + yearNum);
}

function getBaseNum(n: number): number {
  if (n <= 9) return n;
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

export function NumerologyCalculatorTool() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [tab, setTab] = useState<'numbers' | 'lucky' | 'compatibility'>('numbers');

  const result = useMemo(() => {
    const nameResult = nameToNumber(name);
    const { soul, personality } = getVowelConsonant(name);
    const lifePath = dobToLifePath(dob);

    let birthdayNum = 0;
    if (dob) {
      const day = parseInt(dob.split('-')[2] || '0');
      birthdayNum = reduceToSingle(day);
    }

    // Personal year (current year)
    let personalYear = 0;
    if (dob) {
      const [, month, day] = dob.split('-');
      const currentYear = new Date().getFullYear();
      const pyDigits = `${month}${day}${currentYear}`.split('').reduce((s, d) => s + parseInt(d), 0);
      personalYear = reduceToSingle(pyDigits);
    }

    return {
      destiny: nameResult.total,
      breakdown: nameResult.breakdown,
      soul,
      personality,
      lifePath,
      birthdayNum,
      personalYear,
    };
  }, [name, dob]);

  const getMeaning = (num: number) => MEANINGS[num] || MEANINGS[reduceToSingle(num)] || MEANINGS[1];
  const getLucky = (num: number) => LUCKY_DATA[num] || LUCKY_DATA[getBaseNum(num)] || LUCKY_DATA[1];

  // Compatibility check
  const primaryNum = result.lifePath || result.destiny;
  const compatibleNums = primaryNum > 0 ? (COMPATIBILITY[getBaseNum(primaryNum)] || []) : [];

  function renderNumberCard(label: string, num: number, icon: React.ReactElement, desc: string) {
    if (!num) return null;
    const m = getMeaning(num);
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div className={`bg-gradient-to-r ${m.color} px-4 py-2 text-white flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-xs font-medium">{label}</span>
          </div>
          <span className="text-2xl font-bold">{num}</span>
        </div>
        <div className="p-4 space-y-2">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">{m.title}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">{desc}</p>
          <div className="space-y-1.5 text-xs">
            <div><span className="text-slate-500">Traits:</span> <span className="text-slate-700 dark:text-slate-300">{m.traits}</span></div>
            <div><span className="text-slate-500">Strengths:</span> <span className="text-green-600">{m.strengths}</span></div>
            <div><span className="text-slate-500">Challenges:</span> <span className="text-amber-600">{m.challenges}</span></div>
            <div><span className="text-slate-500">Best Careers:</span> <span className="text-blue-600">{m.careers}</span></div>
          </div>
        </div>
      </div>
    );
  }

  const PERSONAL_YEAR_THEMES: Record<number, string> = {
    1: 'New beginnings, fresh starts, independence',
    2: 'Partnerships, patience, cooperation',
    3: 'Creativity, self-expression, socializing',
    4: 'Hard work, building foundations, discipline',
    5: 'Change, freedom, adventure, travel',
    6: 'Family, responsibility, love, home',
    7: 'Reflection, spirituality, inner growth',
    8: 'Success, power, financial gain, career',
    9: 'Completion, endings, letting go, wisdom',
    11: 'Spiritual awakening, inspiration, intuition',
    22: 'Master building, large-scale achievement',
    33: 'Master teaching, service, healing',
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Numerology Calculator</h2>
            <p className="text-violet-200 text-xs">Discover your Life Path, Destiny & Soul numbers | Pythagorean system</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
            <User className="w-3 h-3" /> Full Name (as per birth certificate)
          </label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Date of Birth
          </label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
        </div>
      </div>

      {/* Letter Breakdown */}
      {name && result.breakdown.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Letter Values (Pythagorean)</h4>
          <div className="flex flex-wrap gap-1">
            {name.split('').map((ch, i) => {
              const upper = ch.toUpperCase();
              const val = PYTHAGOREAN[upper];
              if (ch === ' ') return <div key={i} className="w-3" />;
              return (
                <div key={i} className={`w-8 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-medium ${
                  val ? (VOWELS.has(upper) ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border border-pink-200 dark:border-pink-800'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800')
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  <span className="text-[10px] font-bold">{ch.toUpperCase()}</span>
                  {val && <span className="text-[9px]">{val}</span>}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-pink-400" /> Vowels (Soul)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-400" /> Consonants (Personality)</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      {(name || dob) && (
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {([['numbers', 'Your Numbers', Hash], ['lucky', 'Lucky Attributes', Gem], ['compatibility', 'Compatibility', Heart]] as const).map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${tab === key ? 'bg-white dark:bg-slate-700 text-violet-700 dark:text-violet-300 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>
      )}

      {/* Numbers Tab */}
      {tab === 'numbers' && (name || dob) && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {name && renderNumberCard('Destiny Number', result.destiny, <Hash className="w-3.5 h-3.5" />,
              'Derived from your full name. Reveals your life purpose and the talents you are meant to develop.')}
            {dob && renderNumberCard('Life Path Number', result.lifePath, <Star className="w-3.5 h-3.5" />,
              'Derived from your date of birth. The most important number — reveals your life journey and lessons.')}
            {name && renderNumberCard('Soul Urge Number', result.soul, <Heart className="w-3.5 h-3.5" />,
              'From the vowels in your name. Reveals your inner desires, motivations, and what truly drives you.')}
            {name && renderNumberCard('Personality Number', result.personality, <User className="w-3.5 h-3.5" />,
              'From the consonants in your name. Shows how others perceive you and your outer personality.')}
            {dob && renderNumberCard('Birthday Number', result.birthdayNum, <Calendar className="w-3.5 h-3.5" />,
              'From your birth day alone. A special talent or gift you possess that supports your life path.')}
          </div>

          {/* Personal Year */}
          {result.personalYear > 0 && (
            <div className={`bg-gradient-to-r ${getMeaning(result.personalYear).color} rounded-xl p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase opacity-80">Personal Year {new Date().getFullYear()}</div>
                  <div className="font-bold text-lg">Year of Number {result.personalYear}</div>
                  <div className="text-xs mt-1 opacity-90">{PERSONAL_YEAR_THEMES[result.personalYear] || ''}</div>
                </div>
                <div className="text-4xl font-bold opacity-30">{result.personalYear}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lucky Attributes Tab */}
      {tab === 'lucky' && primaryNum > 0 && (
        <div className="space-y-4">
          <div className="text-center text-xs text-slate-500 mb-2">
            Based on your {result.lifePath > 0 ? 'Life Path' : 'Destiny'} Number: <strong className="text-violet-600">{primaryNum}</strong>
          </div>
          {(() => {
            const lucky = getLucky(primaryNum);
            return (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
                  <Palette className="w-5 h-5 mx-auto mb-2 text-pink-500" />
                  <div className="text-[10px] text-slate-500 uppercase mb-1">Lucky Colors</div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{lucky.colors.join(', ')}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                  <div className="text-[10px] text-slate-500 uppercase mb-1">Lucky Day</div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{lucky.day}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
                  <Gem className="w-5 h-5 mx-auto mb-2 text-emerald-500" />
                  <div className="text-[10px] text-slate-500 uppercase mb-1">Gemstone</div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{lucky.gemstone}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
                  <Zap className="w-5 h-5 mx-auto mb-2 text-amber-500" />
                  <div className="text-[10px] text-slate-500 uppercase mb-1">Element</div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{lucky.element}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center col-span-2 md:col-span-1">
                  <Star className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
                  <div className="text-[10px] text-slate-500 uppercase mb-1">Ruling Planet</div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{lucky.planet}</div>
                </div>
              </div>
            );
          })()}
          {/* Lucky numbers */}
          <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4 text-center">
            <div className="text-xs text-violet-600 mb-2 font-medium">Your Lucky Numbers</div>
            <div className="flex justify-center gap-2">
              {compatibleNums.map(n => (
                <span key={n} className={`w-9 h-9 rounded-full bg-gradient-to-br ${getMeaning(n).color} text-white flex items-center justify-center font-bold text-sm`}>
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compatibility Tab */}
      {tab === 'compatibility' && primaryNum > 0 && (
        <div className="space-y-4">
          <div className="text-center text-xs text-slate-500 mb-2">
            Based on your {result.lifePath > 0 ? 'Life Path' : 'Destiny'} Number: <strong className="text-violet-600">{primaryNum}</strong>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
              const isCompat = compatibleNums.includes(n);
              const isSelf = getBaseNum(primaryNum) === n;
              return (
                <div key={n} className={`rounded-xl p-3 text-center border transition-all ${
                  isSelf ? 'border-violet-400 bg-violet-100 dark:bg-violet-900/30 scale-105 shadow-md'
                  : isCompat ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 opacity-60'
                }`}>
                  <div className={`text-xl font-bold ${isSelf ? 'text-violet-600' : isCompat ? 'text-green-600' : 'text-slate-400'}`}>{n}</div>
                  <div className="text-[8px] mt-0.5 text-slate-500">
                    {isSelf ? 'You' : isCompat ? 'Good' : 'Neutral'}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <h5 className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">Best Compatible Numbers</h5>
            <div className="space-y-2">
              {compatibleNums.map(n => {
                const m = getMeaning(n);
                return (
                  <div key={n} className="flex items-center gap-3 text-xs">
                    <span className={`w-7 h-7 rounded-full bg-gradient-to-br ${m.color} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>{n}</span>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{m.title}</span>
                      <span className="text-slate-500 ml-1">— {m.traits.split(',').slice(0, 3).join(', ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 text-center">Compatibility is based on traditional numerology pairings. For entertainment purposes only.</p>
        </div>
      )}

      {/* Summary */}
      {result.lifePath > 0 && result.destiny > 0 && (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-violet-800 dark:text-violet-300 mb-2">Your Numerology Summary</h4>
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { label: 'Life Path', num: result.lifePath },
              { label: 'Destiny', num: result.destiny },
              { label: 'Soul', num: result.soul },
              { label: 'Personality', num: result.personality },
              { label: 'Birthday', num: result.birthdayNum },
            ].map(item => (
              <div key={item.label}>
                <div className={`w-10 h-10 mx-auto rounded-full bg-gradient-to-br ${getMeaning(item.num).color} text-white flex items-center justify-center text-lg font-bold`}>
                  {item.num}
                </div>
                <div className="text-[9px] text-slate-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">About Numerology</h4>
        <div className="grid md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-2">
            <p><strong>Pythagorean System:</strong> The most widely used numerology system, named after the Greek mathematician Pythagoras. Each letter is assigned a number 1-9.</p>
            <p><strong>Master Numbers:</strong> 11, 22, and 33 are considered master numbers with heightened spiritual significance and are not reduced further.</p>
          </div>
          <div className="space-y-2">
            <p><strong>Use Your Birth Name:</strong> For most accurate results, use your full name as it appears on your birth certificate, not a nickname or married name.</p>
            <p><strong>For Entertainment:</strong> Numerology is a belief system and should be used for self-reflection and entertainment, not as a basis for major life decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
