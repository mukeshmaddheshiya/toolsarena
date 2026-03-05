'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { RotateCcw, Clock, Zap, Target, Trophy, ChevronDown } from 'lucide-react';

const PARAGRAPHS = [
  'The quick brown fox jumps over the lazy dog near the riverbank. She sells seashells by the seashore while the waves crash against the rocks. A journey of a thousand miles begins with a single step, and every great achievement starts with the decision to try.',
  'Technology has transformed the way we live, work, and communicate with each other. From smartphones to artificial intelligence, innovation continues to reshape our daily routines. The digital revolution has connected billions of people across the globe, making information accessible at the touch of a button.',
  'India is a land of diverse cultures, languages, and traditions that have evolved over thousands of years. From the snow-capped Himalayas in the north to the tropical beaches of Kerala in the south, the country offers breathtaking landscapes. Its rich history includes ancient civilizations, magnificent temples, and vibrant festivals.',
  'Programming is the art of telling a computer what to do through a set of instructions. Learning to code opens doors to countless career opportunities in software development, data science, and web design. Practice and patience are the keys to becoming a skilled programmer.',
  'The sun dipped below the horizon, painting the sky in shades of orange, pink, and purple. Birds returned to their nests as the cool evening breeze swept through the village. Children played in the streets while their parents prepared dinner, filling the air with the aroma of freshly cooked food.',
  'Climate change is one of the greatest challenges facing humanity today. Rising temperatures, melting glaciers, and extreme weather events are affecting communities worldwide. Scientists urge immediate action to reduce carbon emissions and protect our planet for future generations.',
  'Education is the most powerful weapon which you can use to change the world. Schools and universities provide the foundation for knowledge, critical thinking, and personal growth. Every child deserves access to quality education regardless of their background or circumstances.',
  'The internet has revolutionized how we access information, shop, and entertain ourselves. Social media platforms connect millions of people daily, while e-commerce has transformed the retail industry. However, digital literacy and online safety remain important concerns in this connected world.',
];

const DURATIONS = [
  { label: '1 min', seconds: 60 },
  { label: '2 min', seconds: 120 },
  { label: '3 min', seconds: 180 },
  { label: '5 min', seconds: 300 },
];

type TestState = 'idle' | 'running' | 'finished';

export function TypingSpeedTestTool() {
  const [duration, setDuration] = useState(60);
  const [testState, setTestState] = useState<TestState>('idle');
  const [text, setText] = useState('');
  const [typed, setTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [errors, setErrors] = useState(0);
  const [liveWpm, setLiveWpm] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateText = useCallback(() => {
    const shuffled = [...PARAGRAPHS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).join(' ');
  }, []);

  const startTest = useCallback(() => {
    const newText = generateText();
    setText(newText);
    setTyped('');
    setTimeLeft(duration);
    setTestState('running');
    setStartTime(Date.now());
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setTotalChars(0);
    setErrors(0);
    setLiveWpm(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [duration, generateText]);

  const finishTest = useCallback(() => {
    setTestState('finished');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Timer
  useEffect(() => {
    if (testState !== 'running') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [testState, finishTest]);

  // Live WPM calculation
  useEffect(() => {
    if (testState !== 'running') return;
    const elapsed = (Date.now() - startTime) / 60000;
    if (elapsed > 0) {
      const words = correctChars / 5;
      setLiveWpm(Math.round(words / elapsed));
    }
  }, [typed, testState, startTime, correctChars]);

  const handleTyping = (value: string) => {
    if (testState !== 'running') return;
    setTyped(value);

    let correct = 0;
    let errCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (i < text.length && value[i] === text[i]) {
        correct++;
      } else {
        errCount++;
      }
    }

    setCorrectChars(correct);
    setTotalChars(value.length);
    setErrors(errCount);

    const elapsed = (Date.now() - startTime) / 60000;
    if (elapsed > 0) {
      const words = correct / 5;
      const currentWpm = Math.round(words / elapsed);
      setWpm(currentWpm);
      setLiveWpm(currentWpm);
    }
    const acc = value.length > 0 ? Math.round((correct / value.length) * 100) : 100;
    setAccuracy(acc);

    // Auto-finish if they typed all the text
    if (value.length >= text.length) {
      finishTest();
    }
  };

  const reset = () => {
    setTestState('idle');
    setTyped('');
    setText('');
    setTimeLeft(duration);
    setWpm(0);
    setAccuracy(100);
    setLiveWpm(0);
    setCorrectChars(0);
    setTotalChars(0);
    setErrors(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const getWpmColor = (w: number) => {
    if (w >= 80) return 'text-emerald-500';
    if (w >= 50) return 'text-blue-500';
    if (w >= 30) return 'text-amber-500';
    return 'text-red-500';
  };

  const getWpmLabel = (w: number) => {
    if (w >= 80) return 'Excellent';
    if (w >= 60) return 'Fast';
    if (w >= 40) return 'Average';
    if (w >= 20) return 'Slow';
    return 'Beginner';
  };

  // Render highlighted text
  const renderText = () => {
    if (!text) return null;
    const chars = text.split('');
    return (
      <div className="font-mono text-base sm:text-lg leading-relaxed select-none">
        {chars.map((char, i) => {
          let cls = 'text-slate-400 dark:text-slate-500';
          if (i < typed.length) {
            cls = typed[i] === char
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
              : 'text-red-500 bg-red-100 dark:bg-red-900/30 underline decoration-red-400';
          } else if (i === typed.length) {
            cls = 'text-slate-800 dark:text-slate-200 border-l-2 border-primary-500 animate-pulse';
          }
          return <span key={i} className={cls}>{char}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      {testState === 'idle' && (
        <div className="text-center space-y-6">
          <div className="inline-flex flex-wrap justify-center gap-2">
            {DURATIONS.map(d => (
              <button
                key={d.seconds}
                onClick={() => { setDuration(d.seconds); setTimeLeft(d.seconds); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  duration === d.seconds
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div>
            <button
              onClick={startTest}
              className="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-2xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Start Typing Test
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Select duration and click start. Type the displayed text as fast and accurately as you can.
          </p>
        </div>
      )}

      {/* Running state */}
      {testState === 'running' && (
        <>
          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5" /> Time Left
              </div>
              <p className={`text-2xl font-bold font-mono ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-800 dark:text-slate-200'}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Zap className="w-3.5 h-3.5" /> WPM
              </div>
              <p className={`text-2xl font-bold font-mono ${getWpmColor(liveWpm)}`}>{liveWpm}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Target className="w-3.5 h-3.5" /> Accuracy
              </div>
              <p className={`text-2xl font-bold font-mono ${accuracy >= 95 ? 'text-emerald-500' : accuracy >= 80 ? 'text-amber-500' : 'text-red-500'}`}>{accuracy}%</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                Errors
              </div>
              <p className={`text-2xl font-bold font-mono ${errors === 0 ? 'text-emerald-500' : 'text-red-500'}`}>{errors}</p>
            </div>
          </div>

          {/* Text display */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 max-h-48 overflow-y-auto">
            {renderText()}
          </div>

          {/* Typing input */}
          <div className="relative">
            <textarea
              ref={inputRef}
              value={typed}
              onChange={(e) => handleTyping(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              className="w-full h-32 rounded-2xl border-2 border-primary-300 dark:border-primary-700 bg-white dark:bg-slate-800 px-4 py-3 text-base font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              placeholder="Start typing here..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button onClick={reset} className="absolute top-2 right-2 p-2 text-slate-400 hover:text-red-500 transition-colors" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {/* Results */}
      {testState === 'finished' && (
        <div className="space-y-6">
          {/* Main result card */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-6 sm:p-8 text-center">
            <Trophy className={`w-12 h-12 mx-auto mb-3 ${getWpmColor(wpm)}`} />
            <p className={`text-5xl sm:text-6xl font-bold font-mono mb-2 ${getWpmColor(wpm)}`}>{wpm}</p>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Words Per Minute</p>
            <p className={`text-sm font-semibold mt-1 ${getWpmColor(wpm)}`}>{getWpmLabel(wpm)}</p>
          </div>

          {/* Detailed stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Accuracy</p>
              <p className={`text-xl font-bold font-mono ${accuracy >= 95 ? 'text-emerald-500' : accuracy >= 80 ? 'text-amber-500' : 'text-red-500'}`}>{accuracy}%</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Characters</p>
              <p className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">{totalChars}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Correct</p>
              <p className="text-xl font-bold font-mono text-emerald-500">{correctChars}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Errors</p>
              <p className={`text-xl font-bold font-mono ${errors === 0 ? 'text-emerald-500' : 'text-red-500'}`}>{errors}</p>
            </div>
          </div>

          {/* Speed comparison */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">How do you compare?</h3>
            <div className="space-y-2">
              {[
                { label: 'Beginner', range: '0-20 WPM', min: 0, max: 20 },
                { label: 'Slow', range: '20-40 WPM', min: 20, max: 40 },
                { label: 'Average', range: '40-60 WPM', min: 40, max: 60 },
                { label: 'Fast', range: '60-80 WPM', min: 60, max: 80 },
                { label: 'Excellent', range: '80+ WPM', min: 80, max: 120 },
              ].map(tier => (
                <div key={tier.label} className="flex items-center gap-3">
                  <span className={`text-xs w-16 ${wpm >= tier.min && wpm < tier.max ? 'font-bold text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}>
                    {tier.label}
                  </span>
                  <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${wpm >= tier.min && wpm < tier.max ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      style={{ width: wpm >= tier.min ? `${Math.min(100, ((Math.min(wpm, tier.max) - tier.min) / (tier.max - tier.min)) * 100)}%` : '0%' }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 w-16 text-right">{tier.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={startTest}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-sm font-semibold transition-all shadow-md"
            >
              Try Again
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4 inline mr-1" /> Change Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
