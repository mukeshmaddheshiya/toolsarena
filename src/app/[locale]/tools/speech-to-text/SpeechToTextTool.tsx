'use client';
import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Copy, Check, Trash2, Download } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionInstance = any;

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function SpeechToTextTool() {
  const [text, setText] = useState('');
  const [interim, setInterim] = useState('');
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [copied, setCopied] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const start = useCallback(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) { setSupported(false); return; }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript;
        else interim += transcript;
      }
      if (final) setText(prev => prev + final + ' ');
      setInterim(interim);
    };

    recognition.onerror = () => { setListening(false); };
    recognition.onend = () => { setListening(false); setInterim(''); };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }, [language]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
    setInterim('');
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speech-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!supported) {
    return (
      <div className="text-center py-12">
        <MicOff className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">Speech Recognition Not Supported</p>
        <p className="text-sm text-slate-500">Your browser doesn&apos;t support the Web Speech API. Try using Google Chrome or Microsoft Edge.</p>
      </div>
    );
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      {/* Language + Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={listening}
            className="text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5">
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="hi-IN">Hindi</option>
            <option value="ne-NP">Nepali</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="ja-JP">Japanese</option>
            <option value="zh-CN">Chinese (Mandarin)</option>
            <option value="ar-SA">Arabic</option>
            <option value="pt-BR">Portuguese</option>
            <option value="ko-KR">Korean</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          {text && (
            <>
              <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" title="Copy">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button onClick={handleDownload} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" title="Download">
                <Download className="w-4 h-4" />
              </button>
              <button onClick={() => setText('')} className="p-2 text-slate-400 hover:text-red-500" title="Clear">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mic button */}
      <div className="text-center">
        <button
          onClick={listening ? stop : start}
          className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all ${listening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary-600 hover:bg-primary-700'} text-white`}
        >
          {listening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
        </button>
        <p className="text-sm text-slate-500 mt-3">
          {listening ? 'Listening... Click to stop' : 'Click the mic to start speaking'}
        </p>
      </div>

      {/* Output */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 min-h-[200px]">
        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
          {text}
          {interim && <span className="text-slate-400 italic">{interim}</span>}
          {!text && !interim && <span className="text-slate-400">Your transcribed text will appear here...</span>}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>{wordCount} words</span>
        <span>{text.length} characters</span>
      </div>
    </div>
  );
}
