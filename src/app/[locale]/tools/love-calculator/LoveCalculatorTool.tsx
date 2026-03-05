'use client';
import { useState, useEffect, useRef } from 'react';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';

const MESSAGES: Record<string, string[]> = {
  high: [
    'You two are soulmates! The stars are perfectly aligned.',
    'A match made in heaven! Your love energy is off the charts.',
    'Incredible chemistry! You both complement each other beautifully.',
    'True love alert! This connection is destined to last.',
  ],
  medium: [
    'There is a solid foundation here. Keep nurturing this bond!',
    'A promising match! Communication will make it even stronger.',
    'Good vibes between you two. Patience and understanding are key.',
    'This relationship has real potential. Give it time to grow!',
  ],
  low: [
    'Opposites can attract! Sometimes the best love grows slowly.',
    'Every great love story has humble beginnings. Keep an open mind!',
    'The spark might be hidden. Try spending more quality time together.',
    'Don\'t give up! True love often surprises us.',
  ],
};

function calculateLove(name1: string, name2: string): number {
  const combined = (name1 + 'loves' + name2).toLowerCase().replace(/[^a-z]/g, '');
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash + combined.charCodeAt(i)) | 0;
  }
  // Ensure deterministic percentage between 25-99
  return 25 + Math.abs(hash % 75);
}

export function LoveCalculatorTool() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const calculate = () => {
    if (!name1.trim() || !name2.trim()) return;
    setCalculating(true);
    setShowResult(false);
    setAnimatedPercent(0);

    setTimeout(() => {
      const pct = calculateLove(name1.trim(), name2.trim());
      setResult(pct);
      setCalculating(false);
      setShowResult(true);
    }, 1200);
  };

  // Animate percentage counter
  useEffect(() => {
    if (!showResult || result === null) return;
    let current = 0;
    animRef.current = setInterval(() => {
      current += 2;
      if (current >= result) {
        current = result;
        if (animRef.current) clearInterval(animRef.current);
      }
      setAnimatedPercent(current);
    }, 20);
    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, [showResult, result]);

  const getMessage = () => {
    if (result === null) return '';
    const tier = result >= 70 ? 'high' : result >= 45 ? 'medium' : 'low';
    const msgs = MESSAGES[tier];
    const idx = Math.abs(name1.length + name2.length) % msgs.length;
    return msgs[idx];
  };

  const getHeartColor = () => {
    if (result === null) return 'text-slate-300';
    if (result >= 70) return 'text-red-500';
    if (result >= 45) return 'text-pink-400';
    return 'text-pink-300';
  };

  const reset = () => {
    setName1('');
    setName2('');
    setResult(null);
    setShowResult(false);
    setAnimatedPercent(0);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Name</label>
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            placeholder="Enter your name"
            maxLength={50}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-base text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            onKeyDown={(e) => e.key === 'Enter' && calculate()}
          />
        </div>

        <div className="flex justify-center">
          <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Partner's Name</label>
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            placeholder="Enter partner's name"
            maxLength={50}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-base text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            onKeyDown={(e) => e.key === 'Enter' && calculate()}
          />
        </div>

        <button
          onClick={calculate}
          disabled={!name1.trim() || !name2.trim() || calculating}
          className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-red-500 text-white text-base font-semibold rounded-xl hover:from-pink-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          {calculating ? (
            <span className="inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5 animate-spin" /> Calculating Love...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Heart className="w-5 h-5" /> Calculate Love
            </span>
          )}
        </button>
      </div>

      {/* Result */}
      {showResult && result !== null && (
        <div className="space-y-5 animate-in fade-in duration-500">
          {/* Heart with percentage */}
          <div className="text-center py-6">
            <div className="relative inline-block">
              <Heart className={`w-32 h-32 ${getHeartColor()} fill-current drop-shadow-lg`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-3xl font-bold drop-shadow-md">{animatedPercent}%</span>
              </div>
            </div>
          </div>

          {/* Names */}
          <div className="flex items-center justify-center gap-3 text-lg">
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[40%]">{name1.trim()}</span>
            <Heart className="w-5 h-5 text-red-500 fill-current flex-shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[40%]">{name2.trim()}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 to-red-500 transition-all duration-1000 ease-out"
              style={{ width: `${animatedPercent}%` }}
            />
          </div>

          {/* Message */}
          <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl p-4 text-center">
            <p className="text-sm text-pink-800 dark:text-pink-300 font-medium">{getMessage()}</p>
          </div>

          {/* Try again */}
          <div className="text-center">
            <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              <RotateCcw className="w-4 h-4" /> Try Another Pair
            </button>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-400 text-center">
        This is a fun, entertainment-only tool. Results are algorithmically generated and not based on any real compatibility science.
      </p>
    </div>
  );
}
