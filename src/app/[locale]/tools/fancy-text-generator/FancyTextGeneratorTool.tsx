'use client';

import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

// Unicode character maps
const transforms: { name: string; fn: (c: string) => string }[] = [
  { name: '𝗕𝗼𝗹𝗱', fn: c => {
    if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.codePointAt(0)! - 65 + 0x1D400);
    if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.codePointAt(0)! - 97 + 0x1D41A);
    if (c >= '0' && c <= '9') return String.fromCodePoint(c.codePointAt(0)! - 48 + 0x1D7CE);
    return c;
  }},
  { name: '𝘐𝘵𝘢𝘭𝘪𝘤', fn: c => {
    if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.codePointAt(0)! - 65 + 0x1D434);
    if (c >= 'a' && c <= 'z') return c === 'h' ? '\u210E' : String.fromCodePoint(c.codePointAt(0)! - 97 + 0x1D44E);
    return c;
  }},
  { name: '𝙱𝚘𝚕𝚍 𝙸𝚝𝚊𝚕𝚒𝚌', fn: c => {
    if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.codePointAt(0)! - 65 + 0x1D468);
    if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.codePointAt(0)! - 97 + 0x1D482);
    return c;
  }},
  { name: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎', fn: c => {
    if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.codePointAt(0)! - 65 + 0x1D670);
    if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.codePointAt(0)! - 97 + 0x1D68A);
    if (c >= '0' && c <= '9') return String.fromCodePoint(c.codePointAt(0)! - 48 + 0x1D7F6);
    return c;
  }},
  { name: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯', fn: c => {
    if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.codePointAt(0)! - 65 + 0x1D504);
    if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.codePointAt(0)! - 97 + 0x1D51E);
    return c;
  }},
  { name: '𝕊𝕔𝕣𝕚𝕡𝕥', fn: c => {
    if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.codePointAt(0)! - 65 + 0x1D4D0);
    if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.codePointAt(0)! - 97 + 0x1D4EA);
    return c;
  }},
  { name: 'Ⓒⓘⓡⓒⓛⓔ', fn: c => {
    if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.codePointAt(0)! - 65 + 0x24B6);
    if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.codePointAt(0)! - 97 + 0x24D0);
    if (c >= '0' && c <= '9') return c === '0' ? '⓪' : String.fromCodePoint(c.codePointAt(0)! - 49 + 0x2460);
    return c;
  }},
  { name: '🅱🅻🅾🅲🅺', fn: c => {
    if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.codePointAt(0)! - 65 + 0x1F170);
    if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.codePointAt(0)! - 97 + 0x1F170);
    return c;
  }},
  { name: 'S̶t̶r̶i̶k̶e̶', fn: c => c + '\u0336' },
  { name: 'U͟n͟d͟e͟r͟l͟i͟n͟e͟', fn: c => c + '\u0332' },
  { name: 'S̈ṁä̈l̈l̈', fn: c => c + '\u0308' },
  { name: 'ＷＩＤＥ', fn: c => {
    if (c >= 'A' && c <= 'Z') return String.fromCodePoint(c.codePointAt(0)! - 65 + 0xFF21);
    if (c >= 'a' && c <= 'z') return String.fromCodePoint(c.codePointAt(0)! - 97 + 0xFF41);
    if (c >= '0' && c <= '9') return String.fromCodePoint(c.codePointAt(0)! - 48 + 0xFF10);
    if (c === ' ') return '　';
    return c;
  }},
  { name: 'ᴛɪɴʏ ᴄᴀᴘꜱ', fn: c => {
    const map: Record<string, string> = {A:'ᴀ',B:'ʙ',C:'ᴄ',D:'ᴅ',E:'ᴇ',F:'ꜰ',G:'ɢ',H:'ʜ',I:'ɪ',J:'ᴊ',K:'ᴋ',L:'ʟ',M:'ᴍ',N:'ɴ',O:'ᴏ',P:'ᴘ',Q:'Q',R:'ʀ',S:'ꜱ',T:'ᴛ',U:'ᴜ',V:'ᴠ',W:'ᴡ',X:'x',Y:'ʏ',Z:'ᴢ'};
    return map[c.toUpperCase()] || c;
  }},
  { name: 'uʍop ǝpısdn', fn: c => {
    const map: Record<string, string> = {a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ɓ',h:'ɥ',i:'ᵻ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z',A:'∀',B:'q',C:'Ɔ',D:'p',E:'Ǝ',F:'Ⅎ',G:'פ',H:'H',I:'I',J:'ɾ',K:'ʞ',L:'˥',M:'W',N:'N',O:'O',P:'d',Q:'Q',R:'ɹ',S:'S',T:'ʇ',U:'∩',V:'Λ',W:'M',X:'X',Y:'⅄',Z:'Z'};
    return map[c] || c;
  }},
];

function applyTransform(text: string, fn: (c: string) => string): string {
  return [...text].map(fn).join('');
}

export function FancyTextGeneratorTool() {
  const [input, setInput] = useState('Hello World');
  const [copied, setCopied] = useState<number | null>(null);

  const results = useMemo(() =>
    transforms.map(t => ({ ...t, output: applyTransform(input, t.fn) })),
    [input]
  );

  const copy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Your Text</span>
        </div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type anything here…"
          className="w-full px-4 py-4 text-lg bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none"
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 px-1">Click any style to copy — paste directly to Instagram, Twitter, WhatsApp, etc.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map((r, idx) => (
          <button key={idx} onClick={() => copy(r.output, idx)}
            className="group flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3.5 hover:border-purple-400 hover:shadow-sm dark:hover:border-purple-500 transition-all text-left">
            <div className="min-w-0">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{r.name}</p>
              <p className="text-base text-gray-800 dark:text-gray-100 truncate">{r.output || '—'}</p>
            </div>
            <div className="shrink-0 ml-3 text-gray-300 group-hover:text-purple-500 transition-colors">
              {copied === idx ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
