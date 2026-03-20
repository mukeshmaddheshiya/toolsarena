'use client';

import { useState } from 'react';
import { Heart, Users, MessageCircle, Star, RefreshCw } from 'lucide-react';

type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

interface ZodiacInfo {
  name: string;
  symbol: string;
  element: string;
  dates: string;
  traits: string[];
  bestMatch: string;
  worstMatch: string;
  description: string;
}

const ZODIAC_DATA: Record<ZodiacSign, ZodiacInfo> = {
  aries: {
    name: 'Aries', symbol: '♈', element: 'Fire', dates: 'Mar 21 – Apr 19',
    traits: ['Bold', 'Energetic', 'Impulsive', 'Confident', 'Pioneering'],
    bestMatch: 'Leo, Sagittarius, Gemini',
    worstMatch: 'Cancer, Capricorn',
    description: 'Aries is a natural-born leader who dives headfirst into every challenge. Passionate, direct, and fiercely independent, they bring energy and excitement to every relationship.',
  },
  taurus: {
    name: 'Taurus', symbol: '♉', element: 'Earth', dates: 'Apr 20 – May 20',
    traits: ['Reliable', 'Patient', 'Stubborn', 'Sensual', 'Devoted'],
    bestMatch: 'Virgo, Capricorn, Cancer',
    worstMatch: 'Leo, Aquarius',
    description: 'Taurus craves stability and comfort above all else. They are deeply loyal, wonderfully patient, and bring a grounded, nurturing energy to every relationship they commit to.',
  },
  gemini: {
    name: 'Gemini', symbol: '♊', element: 'Air', dates: 'May 21 – Jun 20',
    traits: ['Curious', 'Witty', 'Adaptable', 'Communicative', 'Restless'],
    bestMatch: 'Libra, Aquarius, Aries',
    worstMatch: 'Virgo, Pisces',
    description: 'Gemini is endlessly curious and socially magnetic. Their quick wit and adaptability make them fascinating companions, though they need mental stimulation and variety to stay engaged.',
  },
  cancer: {
    name: 'Cancer', symbol: '♋', element: 'Water', dates: 'Jun 21 – Jul 22',
    traits: ['Nurturing', 'Intuitive', 'Moody', 'Loyal', 'Protective'],
    bestMatch: 'Scorpio, Pisces, Taurus',
    worstMatch: 'Aries, Libra',
    description: 'Cancer leads with their heart. Deeply empathetic and fiercely protective of loved ones, they build warm, lasting bonds and value emotional security above all else.',
  },
  leo: {
    name: 'Leo', symbol: '♌', element: 'Fire', dates: 'Jul 23 – Aug 22',
    traits: ['Generous', 'Dramatic', 'Loyal', 'Confident', 'Warm-hearted'],
    bestMatch: 'Aries, Sagittarius, Gemini',
    worstMatch: 'Taurus, Scorpio',
    description: 'Leo radiates warmth and commands attention wherever they go. Incredibly generous and deeply loyal, they give everything to relationships — and expect the same appreciation in return.',
  },
  virgo: {
    name: 'Virgo', symbol: '♍', element: 'Earth', dates: 'Aug 23 – Sep 22',
    traits: ['Analytical', 'Hardworking', 'Practical', 'Critical', 'Meticulous'],
    bestMatch: 'Taurus, Capricorn, Cancer',
    worstMatch: 'Gemini, Sagittarius',
    description: 'Virgo notices what others miss. Detail-oriented and deeply caring, they show love through acts of service. They seek reliability and intellectual depth in their closest relationships.',
  },
  libra: {
    name: 'Libra', symbol: '♎', element: 'Air', dates: 'Sep 23 – Oct 22',
    traits: ['Diplomatic', 'Charming', 'Indecisive', 'Idealistic', 'Balanced'],
    bestMatch: 'Gemini, Aquarius, Leo',
    worstMatch: 'Cancer, Capricorn',
    description: 'Libra is the ultimate partner — charming, fair-minded, and endlessly romantic. They thrive in harmonious relationships and will go to great lengths to avoid conflict and maintain balance.',
  },
  scorpio: {
    name: 'Scorpio', symbol: '♏', element: 'Water', dates: 'Oct 23 – Nov 21',
    traits: ['Intense', 'Passionate', 'Secretive', 'Resourceful', 'Loyal'],
    bestMatch: 'Cancer, Pisces, Capricorn',
    worstMatch: 'Leo, Aquarius',
    description: 'Scorpio loves with unmatched depth and intensity. Fiercely loyal and perceptive, they form transformative bonds but require trust and honesty from anyone who wants to get close.',
  },
  sagittarius: {
    name: 'Sagittarius', symbol: '♐', element: 'Fire', dates: 'Nov 22 – Dec 21',
    traits: ['Adventurous', 'Optimistic', 'Philosophical', 'Blunt', 'Freedom-loving'],
    bestMatch: 'Aries, Leo, Aquarius',
    worstMatch: 'Virgo, Pisces',
    description: 'Sagittarius chases adventure and big ideas. Free-spirited and infectiously optimistic, they make exciting partners — as long as you give them room to roam and explore the world.',
  },
  capricorn: {
    name: 'Capricorn', symbol: '♑', element: 'Earth', dates: 'Dec 22 – Jan 19',
    traits: ['Ambitious', 'Disciplined', 'Cautious', 'Responsible', 'Patient'],
    bestMatch: 'Taurus, Virgo, Scorpio',
    worstMatch: 'Aries, Libra',
    description: 'Capricorn builds relationships the same way they build everything else — carefully, steadily, and with long-term vision. They are devoted partners who value loyalty and shared ambition.',
  },
  aquarius: {
    name: 'Aquarius', symbol: '♒', element: 'Air', dates: 'Jan 20 – Feb 18',
    traits: ['Independent', 'Innovative', 'Humanitarian', 'Detached', 'Eccentric'],
    bestMatch: 'Gemini, Libra, Sagittarius',
    worstMatch: 'Taurus, Scorpio',
    description: 'Aquarius marches to their own beat. Intellectually brilliant and deeply humanitarian, they form friendships and connections based on shared ideals rather than emotional dependency.',
  },
  pisces: {
    name: 'Pisces', symbol: '♓', element: 'Water', dates: 'Feb 19 – Mar 20',
    traits: ['Compassionate', 'Artistic', 'Dreamy', 'Gentle', 'Intuitive'],
    bestMatch: 'Cancer, Scorpio, Taurus',
    worstMatch: 'Gemini, Sagittarius',
    description: 'Pisces feels everything deeply and loves without boundaries. Creative, empathetic, and deeply spiritual, they seek soulful connections and thrive with partners who appreciate their sensitivity.',
  },
};

const SCORES: Record<ZodiacSign, Record<ZodiacSign, [number, number, number]>> = {
  aries: { aries: [72,70,68], taurus: [48,52,45], gemini: [82,85,90], cancer: [40,48,38], leo: [91,88,85], virgo: [44,50,47], libra: [75,72,78], scorpio: [62,55,50], sagittarius: [90,88,86], capricorn: [43,50,45], aquarius: [78,80,82], pisces: [55,58,52] },
  taurus: { aries: [48,52,45], taurus: [80,82,70], gemini: [50,58,55], cancer: [88,85,80], leo: [46,52,48], virgo: [92,90,85], libra: [60,65,62], scorpio: [75,70,65], sagittarius: [48,54,50], capricorn: [90,88,84], aquarius: [40,48,44], pisces: [82,80,75] },
  gemini: { aries: [82,85,90], taurus: [50,58,55], gemini: [76,80,85], cancer: [52,55,50], leo: [84,82,88], virgo: [45,50,48], libra: [90,88,92], scorpio: [48,52,46], sagittarius: [78,75,80], capricorn: [44,50,46], aquarius: [88,90,92], pisces: [46,52,44] },
  cancer: { aries: [40,48,38], taurus: [88,85,80], gemini: [52,55,50], cancer: [82,84,75], leo: [55,58,52], virgo: [80,82,78], libra: [46,52,48], scorpio: [92,90,86], sagittarius: [42,48,40], capricorn: [70,68,65], aquarius: [40,46,42], pisces: [90,88,84] },
  leo: { aries: [91,88,85], taurus: [46,52,48], gemini: [84,82,88], cancer: [55,58,52], leo: [78,75,72], virgo: [48,54,50], libra: [86,84,88], scorpio: [50,54,48], sagittarius: [90,88,85], capricorn: [46,52,48], aquarius: [60,64,62], pisces: [55,58,52] },
  virgo: { aries: [44,50,47], taurus: [92,90,85], gemini: [45,50,48], cancer: [80,82,78], leo: [48,54,50], virgo: [75,78,72], libra: [58,62,60], scorpio: [80,78,75], sagittarius: [40,46,42], capricorn: [92,90,86], aquarius: [44,50,48], pisces: [65,62,60] },
  libra: { aries: [75,72,78], taurus: [60,65,62], gemini: [90,88,92], cancer: [46,52,48], leo: [86,84,88], virgo: [58,62,60], libra: [72,76,80], scorpio: [52,56,50], sagittarius: [80,78,82], capricorn: [46,52,48], aquarius: [88,86,90], pisces: [60,64,58] },
  scorpio: { aries: [62,55,50], taurus: [75,70,65], gemini: [48,52,46], cancer: [92,90,86], leo: [50,54,48], virgo: [80,78,75], libra: [52,56,50], scorpio: [78,75,70], sagittarius: [48,52,46], capricorn: [84,82,78], aquarius: [40,46,42], pisces: [90,88,85] },
  sagittarius: { aries: [90,88,86], taurus: [48,54,50], gemini: [78,75,80], cancer: [42,48,40], leo: [90,88,85], virgo: [40,46,42], libra: [80,78,82], scorpio: [48,52,46], sagittarius: [82,80,78], capricorn: [44,50,46], aquarius: [84,82,86], pisces: [42,48,40] },
  capricorn: { aries: [43,50,45], taurus: [90,88,84], gemini: [44,50,46], cancer: [70,68,65], leo: [46,52,48], virgo: [92,90,86], libra: [46,52,48], scorpio: [84,82,78], sagittarius: [44,50,46], capricorn: [80,78,74], aquarius: [42,48,44], pisces: [72,70,66] },
  aquarius: { aries: [78,80,82], taurus: [40,48,44], gemini: [88,90,92], cancer: [40,46,42], leo: [60,64,62], virgo: [44,50,48], libra: [88,86,90], scorpio: [40,46,42], sagittarius: [84,82,86], capricorn: [42,48,44], aquarius: [76,80,82], pisces: [52,56,50] },
  pisces: { aries: [55,58,52], taurus: [82,80,75], gemini: [46,52,44], cancer: [90,88,84], leo: [55,58,52], virgo: [65,62,60], libra: [60,64,58], scorpio: [90,88,85], sagittarius: [42,48,40], capricorn: [72,70,66], aquarius: [52,56,50], pisces: [84,86,80] },
};

const SIGN_LIST: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

const elementColorMap: Record<string, string> = {
  Fire: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400',
  Earth: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
  Air: 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400',
  Water: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
};

function ScoreMeter({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) {
  const barColor =
    score >= 80 ? 'bg-green-500' :
    score >= 60 ? 'bg-yellow-500' :
    score >= 40 ? 'bg-orange-400' :
    'bg-red-400';

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
          {icon} {label}
        </span>
        <span className="text-sm font-bold text-slate-800 dark:text-white">{score}%</span>
      </div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function SignCard({ sign, selected, onClick }: { sign: ZodiacSign; selected: boolean; onClick: () => void }) {
  const info = ZODIAC_DATA[sign];
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-2 sm:p-3 rounded-xl border-2 transition-all ${
        selected
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md scale-105'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
      }`}
    >
      <span className="text-xl sm:text-2xl leading-none">{info.symbol}</span>
      <span className="text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1">{info.name}</span>
      <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 hidden sm:block">{info.element}</span>
    </button>
  );
}

export function ZodiacCompatibilityTool() {
  const [sign1, setSign1] = useState<ZodiacSign | null>(null);
  const [sign2, setSign2] = useState<ZodiacSign | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [result, setResult] = useState<{ love: number; friendship: number; communication: number } | null>(null);

  function handleSignSelect(sign: ZodiacSign) {
    if (step === 1) {
      setSign1(sign);
      setSign2(null);
      setResult(null);
      setStep(2);
    } else {
      if (sign === sign1) return;
      setSign2(sign);
      const [love, friendship, communication] = SCORES[sign1!][sign];
      setResult({ love, friendship, communication });
    }
  }

  function reset() {
    setSign1(null);
    setSign2(null);
    setResult(null);
    setStep(1);
  }

  const overall = result ? Math.round((result.love + result.friendship + result.communication) / 3) : 0;

  const overallColor =
    overall >= 80 ? 'text-green-600 dark:text-green-400' :
    overall >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
    overall >= 40 ? 'text-orange-500 dark:text-orange-400' :
    'text-red-500 dark:text-red-400';

  const overallLabel =
    overall >= 85 ? 'Exceptional Match' :
    overall >= 70 ? 'Great Chemistry' :
    overall >= 55 ? 'Decent Compatibility' :
    overall >= 40 ? 'Challenging Pair' :
    'Very Difficult Match';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/40 rounded-full mb-3">
          <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Zodiac Compatibility</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {step === 1
            ? 'Step 1 — Select the first zodiac sign'
            : sign2
            ? 'Compatibility results below'
            : 'Step 2 — Now select the second sign'}
        </p>
      </div>

      {/* Sign grid */}
      <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-5 shadow-sm">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 sm:gap-2">
          {SIGN_LIST.map(sign => (
            <SignCard
              key={sign}
              sign={sign}
              selected={sign === sign1 || sign === sign2}
              onClick={() => handleSignSelect(sign)}
            />
          ))}
        </div>

        {(sign1 || sign2) && (
          <div className="mt-4 flex items-center justify-between flex-wrap gap-2 px-1">
            <div className="flex items-center gap-2 flex-wrap">
              {sign1 && (
                <span className="inline-flex items-center gap-1.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold px-3 py-1 rounded-full">
                  {ZODIAC_DATA[sign1].symbol} {ZODIAC_DATA[sign1].name}
                </span>
              )}
              {sign2 && (
                <>
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="inline-flex items-center gap-1.5 bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 text-sm font-semibold px-3 py-1 rounded-full">
                    {ZODIAC_DATA[sign2].symbol} {ZODIAC_DATA[sign2].name}
                  </span>
                </>
              )}
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {result && sign1 && sign2 && (
        <div className="space-y-5">
          {/* Overall score */}
          <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-5 sm:p-6 shadow-sm text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Overall Compatibility</p>
            <p className={`text-5xl sm:text-6xl font-black ${overallColor}`}>{overall}%</p>
            <p className={`text-base sm:text-lg font-semibold mt-1 ${overallColor}`}>{overallLabel}</p>
            <div className="mt-4 h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mx-auto max-w-xs">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  overall >= 80 ? 'bg-green-500' :
                  overall >= 60 ? 'bg-yellow-500' :
                  overall >= 40 ? 'bg-orange-400' : 'bg-red-400'
                }`}
                style={{ width: `${overall}%` }}
              />
            </div>
          </div>

          {/* Score breakdown */}
          <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-800 dark:text-white">Score Breakdown</h3>
            <ScoreMeter label="Love & Romance" score={result.love} icon={<Heart className="w-4 h-4 text-pink-500" />} />
            <ScoreMeter label="Friendship" score={result.friendship} icon={<Users className="w-4 h-4 text-blue-500" />} />
            <ScoreMeter label="Communication" score={result.communication} icon={<MessageCircle className="w-4 h-4 text-green-500" />} />
          </div>

          {/* Sign profiles side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([sign1, sign2] as ZodiacSign[]).map(sign => {
              const info = ZODIAC_DATA[sign];
              return (
                <div key={sign} className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl sm:text-3xl">{info.symbol}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white">{info.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{info.dates}</p>
                    </div>
                    <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${elementColorMap[info.element]}`}>
                      {info.element}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{info.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {info.traits.map(t => (
                      <span key={t} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-green-600 dark:text-green-400">Best match:</span> {info.bestMatch}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-medium text-red-500 dark:text-red-400">Worst match:</span> {info.worstMatch}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-center text-slate-400 dark:text-slate-500">
            For entertainment purposes. Real relationships are shaped by communication, respect, and effort — not star signs.
          </p>
        </div>
      )}
    </div>
  );
}
