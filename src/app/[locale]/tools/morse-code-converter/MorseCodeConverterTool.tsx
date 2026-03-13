'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { Volume2, Square } from 'lucide-react';

// ─── Morse code map ───────────────────────────────────────────────────────────

const MORSE_MAP: Record<string, string> = {
  A: '·−', B: '−···', C: '−·−·', D: '−··', E: '·', F: '··−·',
  G: '−−·', H: '····', I: '··', J: '·−−−', K: '−·−', L: '·−··',
  M: '−−', N: '−·', O: '−−−', P: '·−−·', Q: '−−·−', R: '·−·',
  S: '···', T: '−', U: '··−', V: '···−', W: '·−−', X: '−··−',
  Y: '−·−−', Z: '−−··',
  '0': '−−−−−', '1': '·−−−−', '2': '··−−−', '3': '···−−',
  '4': '····−', '5': '·····', '6': '−····', '7': '−−···',
  '8': '−−−··', '9': '−−−−·',
  '.': '·−·−·−', ',': '−−··−−', '?': '··−−··', '!': '−·−·−−',
  "'": '·−−−−·', '-': '−····−', '/': '−··−·', '@': '·−−·−·',
  '(': '−·−−·', ')': '−·−−·−',
};

// Reverse map for decoding
const REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

// ─── Encoding / Decoding ──────────────────────────────────────────────────────

function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split(' ')
    .map(word =>
      word
        .split('')
        .map(ch => MORSE_MAP[ch] ?? '')
        .filter(Boolean)
        .join(' ')
    )
    .join(' / ');
}

function morseToText(morse: string): string {
  return morse
    .trim()
    .split(/\s*\/\s*/)
    .map(word =>
      word
        .trim()
        .split(/\s+/)
        .map(code => REVERSE_MAP[code] ?? '?')
        .join('')
    )
    .join(' ');
}

// ─── Audio playback ───────────────────────────────────────────────────────────

const DOT_MS = 80;
const DASH_MS = 240;
const SYM_GAP_MS = 80;
const LETTER_GAP_MS = 240;
const WORD_GAP_MS = 560;
const FREQ = 600;

function playMorse(
  morse: string,
  onDone: () => void
): AudioContext {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();
  let time = ctx.currentTime;

  const beep = (duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = FREQ;
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.setValueAtTime(0, time + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + duration / 1000);
    time += duration / 1000;
  };

  const gap = (duration: number) => {
    time += duration / 1000;
  };

  const words = morse.trim().split(/\s*\/\s*/);
  for (const word of words) {
    const letters = word.trim().split(/\s+/);
    for (const letter of letters) {
      const symbols = letter.split('');
      for (let si = 0; si < symbols.length; si++) {
        const sym = symbols[si];
        if (sym === '·') beep(DOT_MS);
        else if (sym === '−') beep(DASH_MS);
        if (si < symbols.length - 1) gap(SYM_GAP_MS);
      }
      gap(LETTER_GAP_MS);
    }
    gap(WORD_GAP_MS);
  }

  const totalTime = time - ctx.currentTime;
  const timer = setTimeout(() => {
    ctx.close().catch(() => undefined);
    onDone();
  }, totalTime * 1000 + 300);

  // Attach timer id to ctx for cleanup
  (ctx as AudioContext & { _timer?: ReturnType<typeof setTimeout> })._timer = timer;

  return ctx;
}

// ─── Component ────────────────────────────────────────────────────────────────

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

export function MorseCodeConverterTool() {
  const [mode, setMode] = useState<'text' | 'morse'>('text');
  const [textInput, setTextInput] = useState('');
  const [morseInput, setMorseInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const morseOutput = textInput ? textToMorse(textInput) : '';
  const textOutput = morseInput ? morseToText(morseInput) : '';

  const displayMorse = mode === 'text' ? morseOutput : morseInput;

  // Clean up AudioContext on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        const ctx = audioCtxRef.current as AudioContext & { _timer?: ReturnType<typeof setTimeout> };
        if (ctx._timer !== undefined) clearTimeout(ctx._timer);
        ctx.close().catch(() => undefined);
        audioCtxRef.current = null;
      }
    };
  }, []);

  const handlePlay = useCallback(() => {
    const morseStr = mode === 'text' ? morseOutput : morseInput;
    if (!morseStr || isPlaying) return;
    setIsPlaying(true);
    // AudioContext must be created inside a user gesture handler
    const ctx = playMorse(morseStr, () => {
      audioCtxRef.current = null;
      setIsPlaying(false);
    });
    audioCtxRef.current = ctx;
  }, [mode, morseOutput, morseInput, isPlaying]);

  const handleStop = useCallback(() => {
    if (audioCtxRef.current) {
      const ctx = audioCtxRef.current as AudioContext & { _timer?: ReturnType<typeof setTimeout> };
      if (ctx._timer !== undefined) clearTimeout(ctx._timer);
      ctx.close().catch(() => undefined);
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 gap-1 bg-slate-50 dark:bg-slate-900">
        {(
          [
            { key: 'text', label: 'Text → Morse' },
            { key: 'morse', label: 'Morse → Text' },
          ] as const
        ).map(tab => (
          <button
            key={tab.key}
            onClick={() => setMode(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === tab.key
                ? 'bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input */}
      {mode === 'text' ? (
        <div>
          <label className={labelClass}>Text</label>
          <textarea
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Type your text here..."
            className={`${inputClass} min-h-[120px] resize-y`}
          />
        </div>
      ) : (
        <div>
          <label className={labelClass}>
            Morse Code
            <span className="ml-2 text-xs text-slate-400 dark:text-slate-500 font-normal">
              (separate letters with space, words with " / ")
            </span>
          </label>
          <textarea
            value={morseInput}
            onChange={e => setMorseInput(e.target.value)}
            placeholder="e.g. ···  −  ·−  ·−−"
            className={`${inputClass} min-h-[120px] font-mono resize-y`}
            dir="ltr"
          />
        </div>
      )}

      {/* Output */}
      {(mode === 'text' ? morseOutput : textOutput) && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {mode === 'text' ? 'Morse Code' : 'Decoded Text'}
            </span>
            <div className="flex items-center gap-2">
              {/* Play/Stop audio */}
              <button
                onClick={isPlaying ? handleStop : handlePlay}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isPlaying
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {isPlaying ? (
                  <><Square className="w-3 h-3" /> Stop</>
                ) : (
                  <><Volume2 className="w-3 h-3" /> Play</>
                )}
              </button>
              <CopyButton text={mode === 'text' ? morseOutput : textOutput} size="sm" />
            </div>
          </div>
          <p
            className={`${
              mode === 'text' ? 'font-mono text-lg tracking-widest' : 'text-2xl font-bold'
            } text-slate-900 dark:text-slate-100 break-all leading-relaxed`}
          >
            {mode === 'text' ? morseOutput : textOutput}
          </p>
        </div>
      )}

      {/* Note about morse input */}
      {mode === 'morse' && displayMorse && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700/50 p-3">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Use · (dot) and − (dash) characters. Letters separated by a single space, words by " / ".
          </p>
        </div>
      )}
    </div>
  );
}
