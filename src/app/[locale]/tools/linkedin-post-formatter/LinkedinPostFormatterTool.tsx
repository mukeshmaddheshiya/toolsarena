'use client';
import { useState, useRef } from 'react';
import { CopyButton } from '@/components/common/CopyButton';

// Unicode Bold: A-Z → 𝗔-𝗭 (U+1D5D4-U+1D5ED), a-z → 𝗮-𝘇 (U+1D5EE-U+1D607), 0-9 → 𝟬-𝟵 (U+1D7EC-U+1D7F5)
function toBold(char: string): string {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D5D4 + (code - 65));
  if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D5EE + (code - 97));
  if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7EC + (code - 48));
  return char;
}

// Unicode Italic: A-Z → 𝐴-𝑍 (U+1D434-U+1D44D), a-z → 𝑎-𝑧 (U+1D44E-U+1D467)
function toItalic(char: string): string {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D434 + (code - 65));
  if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D44E + (code - 97));
  return char;
}

function convertText(text: string, convert: (c: string) => string): string {
  return text.split('').map(convert).join('');
}

const QUICK_EMOJIS = ['🔥', '💡', '✅', '🚀', '📌', '👇', '💰', '🎯', '⚡', '📈'];

export function LinkedinPostFormatterTool() {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = text.length;
  const isOverLimit = charCount > 3000;

  function getSelection(): { start: number; end: number; selected: string } {
    const el = textareaRef.current;
    if (!el) return { start: 0, end: 0, selected: '' };
    return {
      start: el.selectionStart,
      end: el.selectionEnd,
      selected: text.slice(el.selectionStart, el.selectionEnd),
    };
  }

  function applyFormat(convertFn: (c: string) => string) {
    const { start, end, selected } = getSelection();
    if (!selected) return;
    const converted = convertText(selected, convertFn);
    const newText = text.slice(0, start) + converted + text.slice(end);
    setText(newText);
    // Restore selection after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start, start + converted.length);
      }
    }, 0);
  }

  function insertLineBreak() {
    const el = textareaRef.current;
    if (!el) return;
    const pos = el.selectionStart;
    const newText = text.slice(0, pos) + '\n\n' + text.slice(pos);
    setText(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(pos + 2, pos + 2);
      }
    }, 0);
  }

  function insertEmoji(emoji: string) {
    const el = textareaRef.current;
    if (!el) return;
    const pos = el.selectionStart;
    const newText = text.slice(0, pos) + emoji + text.slice(pos);
    setText(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(pos + emoji.length, pos + emoji.length);
      }
    }, 0);
  }

  const toolbarBtnClass = 'px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors';

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
        LinkedIn renders Unicode bold/italic characters as visual formatting. The actual characters are stored as Unicode text — they copy and paste correctly on LinkedIn.
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => applyFormat(toBold)}
          className={toolbarBtnClass}
          title="Select text then click Bold"
        >
          <span className="font-bold">B</span> Bold
        </button>
        <button
          onClick={() => applyFormat(toItalic)}
          className={toolbarBtnClass}
          title="Select text then click Italic"
        >
          <span className="italic">I</span> Italic
        </button>
        <button
          onClick={insertLineBreak}
          className={toolbarBtnClass}
          title="Insert blank line"
        >
          ↵ Line Break
        </button>
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
        {QUICK_EMOJIS.map(emoji => (
          <button
            key={emoji}
            onClick={() => insertEmoji(emoji)}
            className="w-8 h-8 flex items-center justify-center text-base rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            title={`Insert ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Editor + Preview */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left: Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Your Post
            </label>
            <span className={`text-xs font-medium tabular-nums ${isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {charCount} / 3,000
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write your LinkedIn post here...&#10;&#10;Select any text and click Bold or Italic to format it."
            rows={18}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 resize-none font-mono leading-relaxed"
          />
          {isOverLimit && (
            <p className="text-xs text-red-600 dark:text-red-400">
              Post exceeds 3,000 characters. LinkedIn may truncate it.
            </p>
          )}
        </div>

        {/* Right: Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Preview
            </label>
            {text && <CopyButton text={text} label="Copy Post" size="sm" />}
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 min-h-[18rem]">
            {/* Fake LinkedIn post card */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold">You</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Your Name</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Just now • 🌐</div>
              </div>
            </div>
            {text ? (
              <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {text}
              </div>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">Your formatted post will appear here...</p>
            )}
          </div>
        </div>
      </div>

      {/* Tip */}
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Tip: Select text in the editor, then click <strong>Bold</strong> or <strong>Italic</strong> to apply Unicode formatting.
      </p>
    </div>
  );
}
