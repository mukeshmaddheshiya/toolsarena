'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { RotateCcw } from 'lucide-react';

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab';

const CASES: { type: CaseType; label: string; example: string }[] = [
  { type: 'upper', label: 'UPPER CASE', example: 'HELLO WORLD' },
  { type: 'lower', label: 'lower case', example: 'hello world' },
  { type: 'title', label: 'Title Case', example: 'Hello World' },
  { type: 'sentence', label: 'Sentence case', example: 'Hello world' },
  { type: 'camel', label: 'camelCase', example: 'helloWorld' },
  { type: 'pascal', label: 'PascalCase', example: 'HelloWorld' },
  { type: 'snake', label: 'snake_case', example: 'hello_world' },
  { type: 'kebab', label: 'kebab-case', example: 'hello-world' },
];

const STOP_WORDS = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'yet', 'so', 'at', 'by', 'in', 'of', 'on', 'to', 'up', 'as', 'is', 'it']);

function convertCase(text: string, type: CaseType): string {
  if (!text) return '';
  switch (type) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title':
      return text.toLowerCase().replace(/\b\w+/g, (w, i) =>
        (i === 0 || !STOP_WORDS.has(w)) ? w.charAt(0).toUpperCase() + w.slice(1) : w
      );
    case 'sentence':
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
    case 'camel': {
      const words = text.replace(/[^a-zA-Z0-9\s]/g, ' ').trim().split(/\s+/);
      return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    }
    case 'pascal':
      return text.replace(/[^a-zA-Z0-9\s]/g, ' ').trim().split(/\s+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'snake':
      return text.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/)
        .map(w => w.toLowerCase()).join('_');
    case 'kebab':
      return text.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/)
        .map(w => w.toLowerCase()).join('-');
    default: return text;
  }
}

export function CaseConverterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);

  function apply(type: CaseType) {
    setActiveCase(type);
    setOutput(convertCase(input || output, type));
  }

  return (
    <div className="space-y-4">
      {/* Conversion buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {CASES.map(({ type, label, example }) => (
          <button
            key={type}
            onClick={() => apply(type)}
            className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 text-left ${
              activeCase === type
                ? 'bg-primary-800 text-white border-primary-800'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
            }`}
          >
            <div className="font-semibold">{label}</div>
            <div className="text-xs opacity-60 mt-0.5">{example}</div>
          </button>
        ))}
      </div>

      {/* Input / Output */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Input Text</label>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setOutput(''); setActiveCase(null); }}
            placeholder="Enter your text here..."
            className="tool-textarea min-h-[200px]"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Converted Output</label>
            {output && <CopyButton text={output} size="sm" />}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Converted text will appear here..."
            className="tool-textarea min-h-[200px] bg-slate-50 dark:bg-slate-900"
          />
        </div>
      </div>

      {(input || output) && (
        <button onClick={() => { setInput(''); setOutput(''); setActiveCase(null); }} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Clear All
        </button>
      )}
    </div>
  );
}
