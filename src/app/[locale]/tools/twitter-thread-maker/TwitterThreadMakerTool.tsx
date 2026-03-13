'use client';
import { useState, useCallback } from 'react';
import { Scissors, Edit2, Check, X } from 'lucide-react';
import { CopyButton } from '@/components/common/CopyButton';

const MAX_TWEET = 280;

type NumberingFormat = 'prefix' | 'suffix';

// Estimate the numbering overhead for a given tweet index and total count
// We estimate worst case: largest index number + format chars
function numberingOverhead(format: NumberingFormat, estimatedTotal: number): number {
  const maxNumLen = String(estimatedTotal).length;
  if (format === 'prefix') {
    // "99/ " — num digits + "/ " = numLen + 2
    return maxNumLen + 2;
  } else {
    // " (99/99)" — " (" + num + "/" + total + ")" = 2 + maxNumLen + 1 + maxNumLen + 1 = 4 + 2*maxNumLen
    return 4 + 2 * maxNumLen;
  }
}

function splitIntoTweets(
  content: string,
  format: NumberingFormat,
  addHeader: boolean,
  headerText: string,
  addFooter: boolean,
  footerText: string
): string[] {
  if (!content.trim()) return [];

  // Estimate total parts to compute numbering overhead correctly
  // We do a first pass with a conservative overhead estimate, then re-check
  const extraParts = (addHeader && headerText.trim() ? 1 : 0) + (addFooter && footerText.trim() ? 1 : 0);
  // Start with estimated total of 10 for overhead calculation; refine below
  const estimatedTotal = 10 + extraParts;
  const overhead = numberingOverhead(format, estimatedTotal);
  const MAX_CONTENT = MAX_TWEET - overhead;

  const rawTweets: string[] = [];

  // Pre-process: split into sentences / chunks
  // Try to split at sentence boundaries first
  const sentences = content
    .replace(/([.!?])\s+/g, '$1\n')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  let current = '';

  for (const sentence of sentences) {
    // If sentence itself is too long, split at word boundaries
    if (sentence.length > MAX_CONTENT) {
      if (current) {
        rawTweets.push(current.trim());
        current = '';
      }
      // split long sentence at word boundaries
      const words = sentence.split(' ');
      let chunk = '';
      for (const word of words) {
        if ((chunk + ' ' + word).trim().length > MAX_CONTENT) {
          if (chunk) rawTweets.push(chunk.trim());
          chunk = word;
        } else {
          chunk = (chunk + ' ' + word).trim();
        }
      }
      if (chunk) current = chunk;
    } else {
      const candidate = current ? current + ' ' + sentence : sentence;
      if (candidate.length > MAX_CONTENT) {
        if (current) rawTweets.push(current.trim());
        current = sentence;
      } else {
        current = candidate;
      }
    }
  }
  if (current) rawTweets.push(current.trim());

  // Prepend header and append footer if enabled
  const allParts: string[] = [];
  if (addHeader && headerText.trim()) allParts.push(headerText.trim());
  allParts.push(...rawTweets);
  if (addFooter && footerText.trim()) allParts.push(footerText.trim());

  const total = allParts.length;
  // Recalculate overhead with actual total
  const actualOverhead = numberingOverhead(format, total);

  // Add numbering — if any tweet now exceeds 280 after adding number, truncate gracefully
  return allParts.map((tweet, i) => {
    const num = i + 1;
    let numbered: string;
    if (format === 'prefix') {
      numbered = `${num}/ ${tweet}`;
    } else {
      numbered = `${tweet} (${num}/${total})`;
    }
    // Truncate if over limit (edge case when header/footer is very long)
    if (numbered.length > MAX_TWEET) {
      const prefix = format === 'prefix' ? `${num}/ ` : '';
      const suffix = format === 'suffix' ? ` (${num}/${total})` : '';
      const maxContent = MAX_TWEET - prefix.length - suffix.length;
      numbered = `${prefix}${tweet.slice(0, maxContent)}${suffix}`;
    }
    return numbered;
  });
}

function charCountColor(count: number): string {
  if (count <= 240) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
  if (count <= 260) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
  return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
}

interface TweetCardProps {
  tweet: string;
  index: number;
  total: number;
  onEdit: (index: number, newText: string) => void;
}

function TweetCard({ tweet, index, total, onEdit }: TweetCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(tweet);
  const count = tweet.length;

  function startEdit() {
    setDraft(tweet);
    setEditing(true);
  }

  function saveEdit() {
    onEdit(index, draft);
    setEditing(false);
  }

  function cancelEdit() {
    setDraft(tweet);
    setEditing(false);
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      {/* Header row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-sky-500 flex-shrink-0 flex items-center justify-center">
          <span className="text-white text-xs font-bold">You</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Your Name</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">@yourhandle</div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${charCountColor(count)}`}>
            {count}/{MAX_TWEET}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full font-medium">
            {index + 1}/{total}
          </span>
        </div>
      </div>

      {/* Content */}
      {editing ? (
        <div className="space-y-2">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100 resize-none"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${charCountColor(draft.length)}`}>
              {draft.length}/{MAX_TWEET}
            </span>
            <button
              onClick={saveEdit}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              <Check className="w-3 h-3" /> Save
            </button>
            <button
              onClick={cancelEdit}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
          {tweet}
        </div>
      )}

      {/* Actions */}
      {!editing && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={startEdit}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Edit2 className="w-3 h-3" /> Edit
          </button>
          <CopyButton text={tweet} label={`Tweet #${index + 1}`} size="sm" />
        </div>
      )}
    </div>
  );
}

export function TwitterThreadMakerTool() {
  const [content, setContent] = useState('');
  const [format, setFormat] = useState<NumberingFormat>('prefix');
  const [addHeader, setAddHeader] = useState(false);
  const [headerText, setHeaderText] = useState('🧵 Thread:');
  const [addFooter, setAddFooter] = useState(true);
  const [footerText, setFooterText] = useState('Follow for more content like this! 🙌');
  const [tweets, setTweets] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  function handleSplit() {
    const result = splitIntoTweets(content, format, addHeader, headerText, addFooter, footerText);
    setTweets(result);
    setHasGenerated(true);
  }

  const handleEditTweet = useCallback((index: number, newText: string) => {
    setTweets(prev => prev.map((t, i) => (i === index ? newText : t)));
  }, []);

  const totalChars = tweets.reduce((sum, t) => sum + t.length, 0);
  const avgChars = tweets.length > 0 ? Math.round(totalChars / tweets.length) : 0;

  const copyAllText = tweets.map((t, i) => `--- Tweet ${i + 1}/${tweets.length} ---\n${t}`).join('\n\n');

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
        X/Twitter allows 280 characters per tweet. Threads can have unlimited tweets. Smart splitting tries sentence boundaries first, then word boundaries.
      </div>

      {/* Input */}
      <div>
        <label className={labelClass}>Your Content</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Paste or write your long-form content here. It will be intelligently split into a Twitter/X thread while preserving sentence meaning..."
          rows={10}
          className={inputClass + ' resize-none'}
        />
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{content.length} characters</p>
      </div>

      {/* Options */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Numbering Format</label>
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setFormat('prefix')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${format === 'prefix' ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              1/ Tweet text
            </button>
            <button
              onClick={() => setFormat('suffix')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${format === 'suffix' ? 'bg-primary-800 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              Tweet text (1/N)
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={addHeader}
              onChange={e => setAddHeader(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Add thread header (first tweet)</span>
          </label>
          {addHeader && (
            <input
              type="text"
              value={headerText}
              onChange={e => setHeaderText(e.target.value)}
              className={inputClass}
              placeholder="Thread header text..."
            />
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={addFooter}
              onChange={e => setAddFooter(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Add footer (last tweet)</span>
          </label>
          {addFooter && (
            <input
              type="text"
              value={footerText}
              onChange={e => setFooterText(e.target.value)}
              className={inputClass}
              placeholder="Follow for more..."
            />
          )}
        </div>
      </div>

      {/* Split button */}
      <button
        onClick={handleSplit}
        disabled={!content.trim()}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-primary-700 hover:bg-primary-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        <Scissors className="w-4 h-4" />
        Split into Thread
      </button>

      {/* Results */}
      {hasGenerated && tweets.length > 0 && (
        <div className="space-y-4">
          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Tweets: </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{tweets.length}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Total chars: </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{totalChars.toLocaleString()}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Avg per tweet: </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{avgChars}</span>
              </div>
            </div>
            <CopyButton text={copyAllText} label="Copy All" />
          </div>

          {/* Tweet cards */}
          <div className="space-y-3">
            {tweets.map((tweet, i) => (
              <TweetCard
                key={i}
                tweet={tweet}
                index={i}
                total={tweets.length}
                onEdit={handleEditTweet}
              />
            ))}
          </div>
        </div>
      )}

      {hasGenerated && tweets.length === 0 && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-sm">No tweets generated. Please enter some content above.</p>
        </div>
      )}
    </div>
  );
}
