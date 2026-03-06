'use client';
import { useState, useMemo, useCallback } from 'react';
import { Copy, Check, RefreshCw, Sparkles, Shield, Zap, Eye, Bot, User, ArrowRight, BarChart3 } from 'lucide-react';

/* --- Types --- */
type Intensity = 'light' | 'medium' | 'heavy' | 'aggressive';

const INTENSITIES: { id: Intensity; name: string; desc: string; emoji: string; color: string; bg: string }[] = [
  { id: 'light', name: 'Light', desc: 'Minimal changes', emoji: '1', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  { id: 'medium', name: 'Medium', desc: 'Balanced rewrite', emoji: '2', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
  { id: 'heavy', name: 'Heavy', desc: 'Major restructuring', emoji: '3', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' },
  { id: 'aggressive', name: 'Aggressive', desc: 'Maximum humanization', emoji: '4', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
];

/* --- Hash for deterministic random --- */
function hash(str: string, seed = 0): number {
  let h = seed;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function pick<T>(arr: T[], str: string, seed = 0): T {
  return arr[hash(str, seed) % arr.length];
}

/* --- Word-level synonym map (covers broad AI vocabulary) --- */
const WORD_SYNONYMS: Record<string, string[]> = {
  'utilize': ['use', 'work with', 'rely on'],
  'utilizes': ['uses', 'works with', 'relies on'],
  'utilizing': ['using', 'working with', 'relying on'],
  'utilization': ['use', 'usage'],
  'leverage': ['use', 'tap into', 'take advantage of'],
  'leverages': ['uses', 'taps into', 'takes advantage of'],
  'leveraging': ['using', 'tapping into', 'taking advantage of'],
  'facilitate': ['help', 'make easier', 'enable'],
  'facilitates': ['helps', 'makes easier', 'enables'],
  'facilitating': ['helping', 'making easier', 'enabling'],
  'implement': ['set up', 'build', 'put in place'],
  'implements': ['sets up', 'builds', 'puts in place'],
  'implementing': ['setting up', 'building', 'putting in place'],
  'implementation': ['setup', 'rollout', 'execution'],
  'comprehensive': ['thorough', 'complete', 'full', 'detailed'],
  'robust': ['strong', 'solid', 'reliable', 'sturdy'],
  'seamless': ['smooth', 'easy', 'effortless'],
  'seamlessly': ['smoothly', 'easily', 'effortlessly'],
  'innovative': ['creative', 'fresh', 'new', 'clever'],
  'innovation': ['creativity', 'new ideas', 'fresh thinking'],
  'groundbreaking': ['game-changing', 'huge', 'major'],
  'cutting-edge': ['latest', 'modern', 'advanced'],
  'state-of-the-art': ['top-of-the-line', 'modern', 'latest'],
  'transforming': ['changing', 'reshaping', 'shaking up'],
  'transform': ['change', 'reshape', 'shake up'],
  'transforms': ['changes', 'reshapes', 'shakes up'],
  'transformative': ['game-changing', 'powerful', 'major'],
  'transformation': ['change', 'shift', 'overhaul'],
  'revolutionize': ['change', 'shake up', 'rethink'],
  'revolutionizing': ['changing', 'shaking up', 'rethinking'],
  'pivotal': ['key', 'major', 'crucial', 'big'],
  'paramount': ['critical', 'top priority', 'super important'],
  'essential': ['key', 'must-have', 'critical', 'vital'],
  'crucial': ['key', 'important', 'critical', 'vital'],
  'significant': ['big', 'major', 'notable', 'meaningful'],
  'significantly': ['a lot', 'quite a bit', 'noticeably', 'majorly'],
  'substantial': ['big', 'major', 'considerable', 'solid'],
  'substantially': ['a lot', 'quite a bit', 'greatly'],
  'numerous': ['many', 'lots of', 'plenty of', 'a bunch of'],
  'various': ['different', 'several', 'a range of'],
  'multifaceted': ['complex', 'layered', 'many-sided'],
  'intricate': ['complex', 'detailed', 'tricky'],
  'meticulous': ['careful', 'detailed', 'thorough'],
  'meticulously': ['carefully', 'thoroughly', 'with care'],
  'holistic': ['complete', 'all-around', 'full-picture'],
  'plethora': ['tons', 'lots', 'plenty', 'loads'],
  'myriad': ['tons of', 'lots of', 'countless'],
  'foster': ['encourage', 'build', 'grow'],
  'fosters': ['encourages', 'builds', 'grows'],
  'fostering': ['encouraging', 'building', 'growing'],
  'navigate': ['handle', 'deal with', 'work through'],
  'navigating': ['handling', 'dealing with', 'working through'],
  'underscore': ['highlight', 'show', 'point out'],
  'underscores': ['highlights', 'shows', 'points out'],
  'enhance': ['improve', 'boost', 'level up'],
  'enhances': ['improves', 'boosts', 'levels up'],
  'enhancing': ['improving', 'boosting', 'leveling up'],
  'enhancement': ['improvement', 'upgrade', 'boost'],
  'optimize': ['improve', 'fine-tune', 'speed up'],
  'optimizes': ['improves', 'fine-tunes', 'speeds up'],
  'optimizing': ['improving', 'fine-tuning', 'speeding up'],
  'optimization': ['improvement', 'fine-tuning', 'tweaking'],
  'streamline': ['simplify', 'speed up', 'clean up'],
  'streamlines': ['simplifies', 'speeds up', 'cleans up'],
  'streamlining': ['simplifying', 'speeding up', 'cleaning up'],
  'empower': ['help', 'enable', 'give the tools to'],
  'empowers': ['helps', 'enables', 'gives the tools to'],
  'empowering': ['helping', 'enabling', 'giving the tools to'],
  'endeavor': ['effort', 'project', 'attempt'],
  'endeavors': ['efforts', 'projects', 'attempts'],
  'encompasses': ['covers', 'includes', 'spans'],
  'encompass': ['cover', 'include', 'span'],
  'encompassing': ['covering', 'including', 'spanning'],
  'demonstrate': ['show', 'prove', 'make clear'],
  'demonstrates': ['shows', 'proves', 'makes clear'],
  'demonstrating': ['showing', 'proving', 'making clear'],
  'possess': ['have', 'carry', 'hold'],
  'possesses': ['has', 'carries', 'holds'],
  'commence': ['start', 'begin', 'kick off'],
  'commences': ['starts', 'begins', 'kicks off'],
  'commencing': ['starting', 'beginning', 'kicking off'],
  'subsequently': ['then', 'after that', 'later', 'next'],
  'consequently': ['so', 'because of this', 'as a result'],
  'furthermore': ['plus', 'also', 'on top of that', 'and'],
  'moreover': ['also', 'besides', 'on top of that'],
  'nevertheless': ['still', 'but', 'even so', 'that said'],
  'nonetheless': ['still', 'but', 'even so'],
  'notwithstanding': ['despite that', 'regardless'],
  'undeniably': ['clearly', 'obviously', 'no doubt'],
  'arguably': ['you could say', 'some think', 'maybe'],
  'predominantly': ['mostly', 'mainly', 'largely'],
  'inherently': ['by nature', 'naturally', 'basically'],
  'proficiency': ['skill', 'ability', 'know-how'],
  'proficient': ['skilled', 'good at', 'capable'],
  'methodology': ['method', 'approach', 'way of doing things'],
  'methodologies': ['methods', 'approaches', 'ways'],
  'paradigm': ['model', 'approach', 'framework'],
  'paradigms': ['models', 'approaches', 'frameworks'],
  'landscape': ['space', 'world', 'scene', 'field'],
  'ecosystem': ['space', 'environment', 'world'],
  'synergy': ['teamwork', 'combined effort', 'collaboration'],
  'scalable': ['flexible', 'growable', 'expandable'],
  'scalability': ['flexibility', 'growth potential'],
  'proliferation': ['spread', 'growth', 'rise'],
  'rapidly': ['quickly', 'fast', 'at a fast pace'],
  'increasingly': ['more and more', 'bit by bit'],
  'workflow': ['process', 'routine', 'setup'],
  'workflows': ['processes', 'routines', 'setups'],
  'functionality': ['feature', 'capability', 'what it can do'],
  'capabilities': ['features', 'abilities', 'what it can do'],
  'capability': ['ability', 'feature', 'skill'],
  'specifically': ['in particular', 'especially', 'namely'],
  'additionally': ['also', 'plus', 'on top of that'],
  'ultimately': ['in the end', 'at the end of the day'],
  'effectively': ['well', 'in a good way', 'properly'],
  'efficiently': ['quickly', 'well', 'without wasting time'],
  'aforementioned': ['the ones above', 'these', 'what we just mentioned'],
  'henceforth': ['from now on', 'going forward'],
  'thereby': ['and so', 'which means', 'this way'],
  'wherein': ['where', 'in which'],
  'thus': ['so', 'this way', 'because of this'],
  'hence': ['so', 'that\'s why', 'this is why'],
  'realm': ['area', 'field', 'world'],
  'delve': ['dig', 'look', 'dive'],
  'delves': ['digs', 'looks', 'dives'],
  'delving': ['digging', 'looking', 'diving'],
  'advent': ['rise', 'arrival', 'start'],
  'pertaining': ['related', 'about', 'connected'],
  'regarding': ['about', 'on', 'when it comes to'],
  'ensure': ['make sure', 'see to it', 'check that'],
  'ensures': ['makes sure', 'sees to it', 'checks that'],
  'ensuring': ['making sure', 'seeing to it', 'checking that'],
  'adopting': ['using', 'picking up', 'going with'],
  'adoption': ['use', 'uptake', 'spread'],
  'incorporate': ['add', 'include', 'bring in'],
  'incorporates': ['adds', 'includes', 'brings in'],
  'incorporating': ['adding', 'including', 'bringing in'],
  'automating': ['handling automatically', 'auto-running'],
  'automation': ['auto-processing', 'automatic handling'],
  'conventional': ['traditional', 'standard', 'usual'],
  'contemporary': ['modern', 'current', 'today\'s'],
  'repetitive': ['boring', 'repetitive', 'tedious'],
};

/* --- Phrase-level replacements --- */
const PHRASE_REPLACEMENTS: [RegExp, string[]][] = [
  [/\bit(?:'|'|')s important to note that\b/gi, ['keep in mind that', 'worth mentioning,', "here's the thing:"]],
  [/\bit(?:'|'|')s worth noting that\b/gi, ['thing is,', 'also,', "here's something:"]],
  [/\bin today(?:'|'|')s (?:world|landscape|environment|era|age|digital age)\b/gi, ['these days', 'right now', 'nowadays', 'lately']],
  [/\bin the realm of\b/gi, ['in', 'when it comes to', 'with']],
  [/\bin conclusion\b/gi, ['to wrap up', 'all in all', 'bottom line']],
  [/\bin summary\b/gi, ['to sum it up', 'basically', 'in short']],
  [/\bplays a (?:crucial|vital|key|important|significant|pivotal) role\b/gi, ['matters a lot', 'is really important', 'makes a big difference']],
  [/\bit is (?:clear|evident|obvious|apparent) that\b/gi, ['clearly,', 'obviously,', 'you can see that']],
  [/\bit can be argued that\b/gi, ["you could say", "some would say"]],
  [/\bit (?:is|was) (?:widely )?(?:known|believed|thought|considered|recognized) that\b/gi, ['most people think', 'the common view is']],
  [/\bcan be (?:seen|found|observed)\b/gi, ['shows up', 'appears', 'is visible']],
  [/\bshould be (?:noted|mentioned|considered)\b/gi, ["you should know", "keep in mind"]],
  [/\bon the other hand\b/gi, ['but then', 'flip side is', 'at the same time']],
  [/\bas a result\b/gi, ['so', 'because of this', 'which means']],
  [/\bin order to\b/gi, ['to', 'so you can', 'for']],
  [/\bdue to the fact that\b/gi, ['because', 'since']],
  [/\ba wide range of\b/gi, ['lots of', 'many different', 'all kinds of']],
  [/\ba growing number of\b/gi, ['more and more', 'an increasing number of']],
  [/\bon a daily basis\b/gi, ['every day', 'daily']],
  [/\bat the end of the day\b/gi, ['ultimately', 'when it comes down to it']],
  [/\bwith the advent of\b/gi, ['with the rise of', 'since', 'now that we have']],
  [/\bhave the potential to\b/gi, ['can', 'might', 'could']],
  [/\bare becoming (?:increasingly|more and more) (?:popular|common|widespread)\b/gi, ['are catching on', 'are getting more popular', 'are on the rise']],
  [/\bin this (?:article|blog post|post|guide|piece),?\s*we (?:will|shall|are going to)\b/gi, ["here, we'll", "let's", "we're going to"]],
  [/\blet(?:'|'|')s (?:explore|delve into|take a (?:closer )?look at|examine)\b/gi, ["let's check out", "let's look at", "let's break down"]],
  [/\bwe will explore\b/gi, ["we'll look at", "we'll go over", "we'll cover"]],
  [/\bhas (?:become|emerged as) (?:a |an )?(?:essential|integral|indispensable|crucial|vital) (?:part|component|aspect|element)\b/gi, ['is now a key part', 'has become really important', 'is a must-have']],
];

/* --- Contraction map --- */
const CONTRACTIONS: [RegExp, string][] = [
  [/\bI am\b/g, "I'm"], [/\bI have\b/g, "I've"], [/\bI will\b/g, "I'll"], [/\bI would\b/g, "I'd"],
  [/\bdo not\b/gi, "don't"], [/\bdoes not\b/gi, "doesn't"], [/\bdid not\b/gi, "didn't"],
  [/\bis not\b/gi, "isn't"], [/\bare not\b/gi, "aren't"], [/\bwas not\b/gi, "wasn't"],
  [/\bwere not\b/gi, "weren't"], [/\bwill not\b/gi, "won't"], [/\bwould not\b/gi, "wouldn't"],
  [/\bcould not\b/gi, "couldn't"], [/\bshould not\b/gi, "shouldn't"], [/\bcan not\b/gi, "can't"],
  [/\bcannot\b/gi, "can't"], [/\bhas not\b/gi, "hasn't"], [/\bhave not\b/gi, "haven't"],
  [/\bit is\b/gi, "it's"], [/\bthat is\b/gi, "that's"], [/\bthere is\b/gi, "there's"],
  [/\blet us\b/gi, "let's"], [/\bthey are\b/gi, "they're"], [/\bwe are\b/gi, "we're"],
  [/\byou are\b/gi, "you're"], [/\bwho is\b/gi, "who's"], [/\bwhat is\b/gi, "what's"],
  [/\bthey have\b/gi, "they've"], [/\bwe have\b/gi, "we've"], [/\byou have\b/gi, "you've"],
  [/\bthey will\b/gi, "they'll"], [/\bwe will\b/gi, "we'll"], [/\byou will\b/gi, "you'll"],
  [/\bhe is\b/gi, "he's"], [/\bshe is\b/gi, "she's"], [/\bhere is\b/gi, "here's"],
];

/* --- Sentence starters & transitions --- */
const SENTENCE_STARTERS = [
  'Honestly, ', 'Look, ', 'The thing is, ', "Here's the deal - ", 'So basically, ',
  'In my experience, ', 'From what I\'ve seen, ', 'Truth be told, ', 'Let me put it this way - ',
  'If you ask me, ', 'Real talk - ', 'I think ', 'To be fair, ', 'You know, ',
];

const TRANSITIONS = [
  'And honestly, ', "But here's the thing - ", 'Plus, ', 'That said, ', 'On the flip side, ',
  'Now, ', 'So, ', 'Actually, ', 'Thing is, ', 'Also, ',
];

/* --- AI Detection Scoring --- */
function getAIScore(text: string): number {
  if (!text.trim()) return 0;
  let score = 45;
  const lower = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());

  // AI vocabulary check
  const aiWords = Object.keys(WORD_SYNONYMS);
  let aiWordCount = 0;
  for (const word of aiWords) {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) aiWordCount += matches.length;
  }
  score += Math.min(aiWordCount * 3, 25);

  // AI phrase check
  for (const [pattern] of PHRASE_REPLACEMENTS) {
    if (pattern.test(lower)) score += 4;
    pattern.lastIndex = 0;
  }

  // Sentence uniformity
  if (sentences.length > 2) {
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / lengths.length;
    if (variance < 15) score += 8;
    if (variance > 40) score -= 5;
  }

  // No contractions = AI-like
  const hasContractions = /(?:'|'|')(?:s|t|re|ve|ll|d|m)\b/.test(text);
  if (!hasContractions && text.length > 100) score += 10;

  // Long sentences
  const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > 25).length;
  score += longSentences * 3;

  // Markdown headers = AI
  if (/^#{1,3}\s/m.test(text)) score += 5;

  // Listy structure with bold = AI
  if (/^\d+\.\s\*\*|\*\*.*\*\*/m.test(text)) score += 5;

  // Starts with common AI openers
  if (/^(?:In today|In the |Artificial|The (?:rise|advent|world))/i.test(text)) score += 8;

  // Human markers
  const humanMarkers = ["i'm", "i've", "i'll", "i'd", "don't", "doesn't", "can't", "won't", "honestly", "basically", "you know", "kind of", "sort of", "pretty much", "the thing is", "tbh", "imo", "ngl"];
  for (const marker of humanMarkers) {
    if (lower.includes(marker)) score -= 4;
  }

  // Short sentences mixed in = human
  const shortSentences = sentences.filter(s => s.trim().split(/\s+/).length < 6).length;
  if (shortSentences > 0) score -= shortSentences * 2;

  // Questions, exclamations = human
  score -= (text.match(/\?/g) || []).length * 3;
  score -= (text.match(/!/g) || []).length * 2;

  // First person = human
  if (/\bI\b/.test(text)) score -= 5;

  // Parenthetical asides = human
  if (/\(.*?\)/.test(text)) score -= 3;

  // Dashes for asides = human
  if (/ - /.test(text) || / -- /.test(text)) score -= 3;

  return Math.max(0, Math.min(100, Math.round(score)));
}

/* --- Main Humanize Function --- */
function humanize(text: string, intensity: Intensity, seed: number): string {
  if (!text.trim()) return '';

  let result = text;
  const level = { light: 1, medium: 2, heavy: 3, aggressive: 4 }[intensity];

  // 1. Replace AI phrases first (multi-word patterns)
  for (const [pattern, replacements] of PHRASE_REPLACEMENTS) {
    result = result.replace(pattern, (match) => {
      const replacement = pick(replacements, match + seed);
      if (match[0] === match[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  // 2. Word-level synonym replacement
  // Build a regex that matches any word in our synonym map
  const wordsToReplace = Object.keys(WORD_SYNONYMS);
  // Process text word by word to replace AI vocabulary
  result = result.replace(/\b[a-zA-Z][-a-zA-Z]*\b/g, (word) => {
    const lower = word.toLowerCase();
    if (WORD_SYNONYMS[lower]) {
      // On light mode, only replace ~40% of words. Medium ~65%, Heavy ~85%, Aggressive ~100%
      const threshold = { light: 0.4, medium: 0.65, heavy: 0.85, aggressive: 1.0 }[intensity];
      const wordHash = hash(word + seed) % 100;
      if (wordHash / 100 < threshold) {
        const replacement = pick(WORD_SYNONYMS[lower], word + seed);
        // Preserve case
        if (word[0] === word[0].toUpperCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      }
    }
    return word;
  });

  // 3. Add contractions
  for (const [pattern, replacement] of CONTRACTIONS) {
    result = result.replace(pattern, (match) => {
      if (match[0] === match[0].toUpperCase() && match[1] === match[1].toLowerCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  // 4. Sentence-level processing
  const sentences = result.split(/(?<=[.!?])\s+/);
  const processed = sentences.map((sentence, i) => {
    let s = sentence;

    // Remove overly formal sentence openers (medium+)
    if (level >= 2) {
      s = s.replace(/^(?:Additionally|Furthermore|Moreover|Consequently|Subsequently|Hence|Thus|Therefore|Notably|Specifically|Accordingly|Essentially|Fundamentally),?\s*/i, () => {
        return pick(TRANSITIONS, s + i + seed);
      });
    }

    // Break up long sentences (heavy+)
    if (level >= 3) {
      const words = s.split(/\s+/);
      if (words.length > 28) {
        const mid = Math.floor(words.length / 2);
        let splitAt = -1;
        for (let j = mid - 6; j <= mid + 6 && j < words.length; j++) {
          if (j > 0 && (words[j - 1].endsWith(',') || words[j].toLowerCase() === 'which' || words[j].toLowerCase() === 'and' || words[j].toLowerCase() === 'while')) {
            splitAt = j;
            break;
          }
        }
        if (splitAt > 0) {
          if (words[splitAt - 1].endsWith(',')) {
            words[splitAt - 1] = words[splitAt - 1].replace(/,$/, '.');
          } else {
            words.splice(splitAt, 0, '.');
            splitAt++;
          }
          if (splitAt < words.length) {
            words[splitAt] = words[splitAt].charAt(0).toUpperCase() + words[splitAt].slice(1);
          }
          s = words.join(' ');
        }
      }
    }

    // Add conversational starters (heavy+, every few sentences)
    if (level >= 3 && i > 0 && i % 3 === 0 && s.length > 30) {
      const starter = pick(SENTENCE_STARTERS, s + i + seed);
      if (!/^(?:Look|Honestly|So|But|And|Well|Now|Actually|Thing is|Here's|The thing|Real talk|In my|From what|If you|Truth|To be|You know)/i.test(s)) {
        s = starter + s.charAt(0).toLowerCase() + s.slice(1);
      }
    }

    // Aggressive: add short punchy follow-ups
    if (level >= 4 && i > 0 && i % 4 === 0) {
      const punches = ['And that matters.', 'Big difference.', 'Worth keeping in mind.', 'Pretty important.', 'Just saying.', 'Think about that.', 'Seriously.', 'No joke.'];
      s = s + ' ' + pick(punches, s + i + seed);
    }

    return s;
  });

  result = processed.join(' ');

  // 5. Remove markdown formatting (medium+)
  if (level >= 2) {
    result = result.replace(/^#{1,6}\s+/gm, '');
    result = result.replace(/\*\*(.*?)\*\*/g, '$1');
    result = result.replace(/\*(.*?)\*/g, '$1');
    result = result.replace(/^---+$/gm, '');
  }

  // 6. Vary punctuation slightly (aggressive)
  if (level >= 4) {
    // Occasionally add em-dashes
    result = result.replace(/, (?=which|but|and|or|though)/g, (match) => {
      return hash(match + seed) % 3 === 0 ? ' - ' : match;
    });
  }

  // 7. Final cleanup
  result = result.replace(/\s{2,}/g, ' ');
  result = result.replace(/\.\s*\./g, '.');
  result = result.replace(/,\s*,/g, ',');
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}

/* --- Component --- */
export function AITextHumanizerTool() {
  const [input, setInput] = useState('');
  const [intensity, setIntensity] = useState<Intensity>('medium');
  const [copied, setCopied] = useState(false);
  const [version, setVersion] = useState(0);

  const output = useMemo(() => humanize(input, intensity, version), [input, intensity, version]);
  const inputScore = useMemo(() => getAIScore(input), [input]);
  const outputScore = useMemo(() => getAIScore(output), [output]);

  const copy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const wordCount = (t: string) => t ? t.split(/\s+/).filter(Boolean).length : 0;

  const getScoreLabel = (score: number) => {
    if (score >= 70) return { label: 'AI Detected', color: 'text-red-600', bg: 'bg-red-500' };
    if (score >= 45) return { label: 'Likely AI', color: 'text-orange-600', bg: 'bg-orange-500' };
    if (score >= 25) return { label: 'Mixed', color: 'text-yellow-600', bg: 'bg-yellow-500' };
    return { label: 'Human-like', color: 'text-green-600', bg: 'bg-green-500' };
  };

  const inputLabel = getScoreLabel(inputScore);
  const outputLabel = getScoreLabel(outputScore);
  const scoreReduced = Math.max(0, inputScore - outputScore);
  const inputWords = wordCount(input);
  const outputWords = wordCount(output);
  const wordChange = inputWords > 0 ? Math.round(((outputWords - inputWords) / inputWords) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">AI Text Humanizer</h2>
            <p className="text-purple-200 text-xs">Transform AI text into natural, human-written content</p>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Shield, label: '100% Private', desc: 'Nothing leaves your browser' },
          { icon: Zap, label: 'Instant Results', desc: 'Real-time processing' },
          { icon: Eye, label: 'AI Score Check', desc: 'Built-in detection meter' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1" />
            <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{label}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Intensity Selector */}
      <div>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Humanization Intensity</p>
        <div className="grid grid-cols-4 gap-2">
          {INTENSITIES.map(m => (
            <button
              key={m.id}
              onClick={() => setIntensity(m.id)}
              className={`relative p-3 rounded-xl border-2 text-center transition-all ${
                intensity === m.id
                  ? `${m.bg} border-current ${m.color} shadow-sm scale-[1.02]`
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
              }`}
            >
              <div className={`text-lg font-black ${intensity === m.id ? m.color : 'text-slate-300 dark:text-slate-600'}`}>
                {m.emoji}
              </div>
              <div className={`text-xs font-bold mt-1 ${intensity === m.id ? m.color : ''}`}>{m.name}</div>
              <div className="text-[9px] text-slate-400 mt-0.5">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input / Output Panels */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-red-500" />
              AI-Generated Text
            </span>
            <span className="text-[10px] text-slate-400">{inputWords} words</span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your AI-generated text here (from ChatGPT, Gemini, Claude, etc.)..."
            rows={14}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none leading-relaxed placeholder:text-slate-400"
          />
          {input.trim() && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <BarChart3 className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-slate-500">Input AI Score</span>
                  <span className={`text-[10px] font-bold ${inputLabel.color}`}>{inputLabel.label} ({inputScore}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${inputLabel.bg} rounded-full transition-all duration-500`} style={{ width: `${inputScore}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-green-500" />
              Humanized Text
              <ArrowRight className="w-3 h-3 text-slate-300" />
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${INTENSITIES.find(m => m.id === intensity)?.color} ${INTENSITIES.find(m => m.id === intensity)?.bg} border`}>
                {INTENSITIES.find(m => m.id === intensity)?.name}
              </span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">{outputWords} words</span>
              <button onClick={() => setVersion(v => v + 1)} title="Regenerate"
                className="p-1 text-slate-400 hover:text-purple-600 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Humanized text will appear here..."
            rows={14}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-green-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 resize-none leading-relaxed focus:outline-none"
          />
          {output.trim() && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
              <BarChart3 className="w-4 h-4 text-green-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-slate-500">Output AI Score</span>
                  <span className={`text-[10px] font-bold ${outputLabel.color}`}>{outputLabel.label} ({outputScore}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${outputLabel.bg} rounded-full transition-all duration-500`} style={{ width: `${outputScore}%` }} />
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={copy} disabled={!output}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                copied
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-600/20'
              } disabled:opacity-40 disabled:shadow-none`}>
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Humanized Text</>}
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Stats */}
      {input && output && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-3 text-center">
            <div className="text-[10px] text-red-500/70 uppercase tracking-wider font-medium">Input Score</div>
            <div className={`text-2xl font-black ${inputLabel.color}`}>{inputScore}%</div>
            <div className={`text-[10px] font-bold ${inputLabel.color}`}>{inputLabel.label}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl p-3 text-center">
            <div className="text-[10px] text-green-500/70 uppercase tracking-wider font-medium">Output Score</div>
            <div className={`text-2xl font-black ${outputLabel.color}`}>{outputScore}%</div>
            <div className={`text-[10px] font-bold ${outputLabel.color}`}>{outputLabel.label}</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl p-3 text-center">
            <div className="text-[10px] text-purple-500/70 uppercase tracking-wider font-medium">Score Reduced</div>
            <div className="text-2xl font-black text-purple-600">
              {scoreReduced > 0 ? `-${scoreReduced}` : '0'}%
            </div>
            <div className="text-[10px] font-bold text-purple-500">Points dropped</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500/70 uppercase tracking-wider font-medium">Word Change</div>
            <div className="text-2xl font-black text-slate-700 dark:text-slate-300">
              {wordChange > 0 ? `+${wordChange}` : wordChange}%
            </div>
            <div className="text-[10px] font-bold text-slate-500">
              {outputWords >= inputWords ? 'Words added' : 'Words reduced'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
