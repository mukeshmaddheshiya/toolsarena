'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { Sparkles } from 'lucide-react';

const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum curabitur pretium tincidunt lacus cursus viverra mauris blandit aliquet ultrices posuere cubilia curae proin vel ante malesuada metus rhoncus semper nullam accumsan tortor ligula faucibus scelerisque'.split(' ');

function randomWord(exclude = ''): string {
  let w = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
  while (w === exclude) w = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
  return w;
}

function generateSentence(): string {
  const len = 8 + Math.floor(Math.random() * 12);
  const words = Array.from({ length: len }, (_, i) => i === 0 ? randomWord().charAt(0).toUpperCase() + randomWord().slice(1) : randomWord());
  return words.join(' ') + '.';
}

function generateParagraph(): string {
  const sentenceCount = 3 + Math.floor(Math.random() * 3);
  return Array.from({ length: sentenceCount }, generateSentence).join(' ');
}

function generateWords(count: number): string {
  return Array.from({ length: count }, randomWord).join(' ') + '.';
}

export function LoremIpsumTool() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');

  function generate() {
    let text = '';
    if (type === 'paragraphs') {
      const paras = Array.from({ length: count }, generateParagraph);
      if (startWithLorem) paras[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paras[0];
      text = paras.join('\n\n');
    } else if (type === 'sentences') {
      const sentences = Array.from({ length: count }, generateSentence);
      if (startWithLorem) sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      text = sentences.join(' ');
    } else {
      text = generateWords(count);
      if (startWithLorem) text = 'Lorem ipsum dolor sit amet, ' + text;
    }
    setOutput(text);
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Generate</label>
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {(['paragraphs', 'sentences', 'words'] as const).map(t => (
              <button key={t} onClick={() => setType(t)} className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${type === t ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Amount</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={startWithLorem} onChange={e => setStartWithLorem(e.target.checked)} className="w-4 h-4 rounded text-primary-800 focus:ring-primary-500" />
          <span className="text-sm text-slate-700 dark:text-slate-300">Start with &quot;Lorem ipsum&quot;</span>
        </label>
        <button
          onClick={generate}
          className="flex items-center gap-2 px-5 py-2 bg-primary-800 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm"
        >
          <Sparkles className="w-4 h-4" /> Generate
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">{output.split(/\s+/).length} words generated</span>
            <CopyButton text={output} />
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
            {output}
          </div>
        </div>
      )}

      {!output && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Click &quot;Generate&quot; to create lorem ipsum placeholder text</p>
        </div>
      )}
    </div>
  );
}
