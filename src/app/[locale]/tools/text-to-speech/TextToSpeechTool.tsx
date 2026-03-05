'use client';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';

export function TextToSpeechTool() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const v = speechSynthesis.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoice) {
        const defaultV = v.find(voice => voice.default) || v.find(voice => voice.lang.startsWith('en')) || v[0];
        setSelectedVoice(defaultV.name);
      }
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => { speechSynthesis.cancel(); };
  }, [selectedVoice]);

  const speak = () => {
    if (!text.trim()) return;
    if (paused) { speechSynthesis.resume(); setPaused(false); return; }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => { setSpeaking(false); setPaused(false); };
    utterance.onerror = () => { setSpeaking(false); setPaused(false); };
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const pause = () => { speechSynthesis.pause(); setPaused(true); };
  const stop = () => { speechSynthesis.cancel(); setSpeaking(false); setPaused(false); };

  // Group voices by language
  const groupedVoices = voices.reduce<Record<string, SpeechSynthesisVoice[]>>((acc, v) => {
    const lang = v.lang.split('-')[0].toUpperCase();
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(v);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Text input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enter text to speak</label>
          <span className="text-xs text-slate-500">{text.length} characters</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Type or paste any text here and click Play to hear it spoken aloud..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm p-4 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y"
        />
      </div>

      {/* Controls */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Voice selector */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Voice</label>
            <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm px-3 py-2">
              {Object.entries(groupedVoices).sort().map(([lang, vs]) => (
                <optgroup key={lang} label={lang}>
                  {vs.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Rate */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Speed: {rate}x</label>
            <input type="range" min={0.25} max={2} step={0.25} value={rate} onChange={(e) => setRate(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary-600" />
            <div className="flex justify-between text-[10px] text-slate-400"><span>0.25x</span><span>1x</span><span>2x</span></div>
          </div>
        </div>

        {/* Pitch */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Pitch: {pitch}</label>
          <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary-600" />
          <div className="flex justify-between text-[10px] text-slate-400"><span>Low</span><span>Normal</span><span>High</span></div>
        </div>
      </div>

      {/* Play controls */}
      <div className="flex items-center justify-center gap-4">
        {!speaking ? (
          <button onClick={speak} disabled={!text.trim()}
            className="w-16 h-16 rounded-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-lg transition-colors">
            <Play className="w-7 h-7 ml-1" fill="currentColor" />
          </button>
        ) : paused ? (
          <button onClick={speak}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-colors">
            <Play className="w-7 h-7 ml-1" fill="currentColor" />
          </button>
        ) : (
          <button onClick={pause}
            className="w-16 h-16 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center shadow-lg transition-colors">
            <Pause className="w-7 h-7" fill="currentColor" />
          </button>
        )}

        {speaking && (
          <button onClick={stop}
            className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors">
            <Square className="w-5 h-5" fill="currentColor" />
          </button>
        )}
      </div>

      {speaking && !paused && (
        <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400">
          <Volume2 className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium animate-pulse">Speaking...</span>
        </div>
      )}
    </div>
  );
}
