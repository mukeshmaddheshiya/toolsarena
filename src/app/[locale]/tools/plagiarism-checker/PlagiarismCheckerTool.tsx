'use client';
import { useState, useMemo, useCallback } from 'react';
import {
  Copy, Check, FileSearch, Shield, BarChart3, Hash,
  Type, RefreshCw, AlignLeft, Layers, BookOpen,
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────────────────────────── */
const STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall','can',
  'to','of','in','for','on','with','at','by','from','as','into','through','during',
  'before','after','above','below','between','out','off','over','under','again',
  'further','then','once','here','there','when','where','why','how','all','each',
  'every','both','few','more','most','other','some','such','no','nor','not','only',
  'own','same','so','than','too','very','just','because','but','and','or','if','it',
  'its','this','that','these','those','i','me','my','we','our','you','your','he',
  'him','his','she','her','they','them','their','what','which','who','whom',
]);

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
}

function contentWords(text: string): string[] {
  return tokenize(text).filter(w => !STOP_WORDS.has(w) && w.length > 1);
}

function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 3);
}

function jaccardSim(a: string[], b: string[]): number {
  const setA = new Set(a.map(w => w.toLowerCase()));
  const setB = new Set(b.map(w => w.toLowerCase()));
  const inter = [...setA].filter(x => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : inter / union;
}

function getNgrams(words: string[], n: number): string[] {
  const grams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    grams.push(words.slice(i, i + n).join(' '));
  }
  return grams;
}

function wordFrequency(text: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const w of contentWords(text)) freq.set(w, (freq.get(w) || 0) + 1);
  return freq;
}

function cosineSimilarity(textA: string, textB: string): number {
  const freqA = wordFrequency(textA);
  const freqB = wordFrequency(textB);
  const allWords = new Set([...freqA.keys(), ...freqB.keys()]);
  // TF-IDF weighting (2-doc corpus)
  const idf = new Map<string, number>();
  for (const w of allWords) {
    const df = (freqA.has(w) ? 1 : 0) + (freqB.has(w) ? 1 : 0);
    idf.set(w, Math.log(2 / df) + 1);
  }
  let dot = 0, magA = 0, magB = 0;
  for (const w of allWords) {
    const a = (freqA.get(w) || 0) * (idf.get(w) || 1);
    const b = (freqB.get(w) || 0) * (idf.get(w) || 1);
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

/* ── example texts ───────────────────────────────────────────────────── */
const EXAMPLE_A = `Artificial intelligence is transforming the healthcare industry in remarkable ways. Machine learning algorithms can now analyze medical images with accuracy that rivals experienced radiologists. Natural language processing helps doctors extract insights from clinical notes and research papers. Predictive models identify patients at risk of developing chronic conditions before symptoms appear. Robotic surgery systems provide surgeons with enhanced precision during complex procedures. AI-powered drug discovery accelerates the identification of promising pharmaceutical compounds. These innovations are reducing costs while improving patient outcomes across hospitals worldwide.`;

const EXAMPLE_B = `AI is changing the healthcare sector in significant ways. Machine learning models are now able to examine medical scans with precision comparable to skilled radiologists. NLP technology assists physicians in gathering insights from clinical documentation and published studies. Prediction algorithms detect patients who may develop long-term health issues before symptoms manifest. Surgical robots give doctors better accuracy during difficult operations. Computer-aided drug research speeds up the process of finding new pharmaceutical candidates. These advances are lowering expenses while enhancing patient care in hospitals around the world.`;

type Tab = 'sentences' | 'ngrams' | 'frequency';

interface SentenceMatch {
  sentA: string;
  sentB: string;
  sim: number;
}

/* ── main component ──────────────────────────────────────────────────── */
export function PlagiarismCheckerTool() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [hasCompared, setHasCompared] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('sentences');
  const [copied, setCopied] = useState(false);

  const wordCountA = useMemo(() => tokenize(textA).length, [textA]);
  const wordCountB = useMemo(() => tokenize(textB).length, [textB]);

  /* ── analysis ────────────────────────────────────────────────────── */
  const analysis = useMemo(() => {
    if (!hasCompared || !textA.trim() || !textB.trim()) return null;

    const sentsA = splitSentences(textA);
    const sentsB = splitSentences(textB);

    // sentence matching
    const matches: SentenceMatch[] = [];
    const sentAScores: number[] = new Array(sentsA.length).fill(0);
    const sentBScores: number[] = new Array(sentsB.length).fill(0);

    for (let i = 0; i < sentsA.length; i++) {
      const wordsA = tokenize(sentsA[i]);
      for (let j = 0; j < sentsB.length; j++) {
        const wordsB = tokenize(sentsB[j]);
        const sim = jaccardSim(wordsA, wordsB);
        if (sim > 0.3) {
          matches.push({ sentA: sentsA[i], sentB: sentsB[j], sim });
          sentAScores[i] = Math.max(sentAScores[i], sim);
          sentBScores[j] = Math.max(sentBScores[j], sim);
        }
      }
    }
    matches.sort((a, b) => b.sim - a.sim);

    // n-gram analysis
    const wordsA = tokenize(textA);
    const wordsB = tokenize(textB);
    const trigA = getNgrams(wordsA, 3);
    const trigB = getNgrams(wordsB, 3);
    const pentA = getNgrams(wordsA, 5);
    const pentB = getNgrams(wordsB, 5);
    const trigSetB = new Set(trigB);
    const pentSetB = new Set(pentB);
    const commonTri = trigA.filter(g => trigSetB.has(g));
    const commonPent = pentA.filter(g => pentSetB.has(g));
    const totalTri = new Set([...trigA, ...trigB]).size;
    const triOverlap = totalTri === 0 ? 0 : new Set(commonTri).size / totalTri;

    // cosine & jaccard overall
    const cosine = cosineSimilarity(textA, textB);
    const overallJaccard = jaccardSim(tokenize(textA), tokenize(textB));

    // overall similarity (weighted average)
    const overall = Math.round(
      (overallJaccard * 0.3 + cosine * 0.4 + triOverlap * 0.3) * 100
    );

    // word frequency top 20
    const freqA = wordFrequency(textA);
    const freqB = wordFrequency(textB);
    const allWords = new Set([...freqA.keys(), ...freqB.keys()]);
    const freqPairs = [...allWords]
      .map(w => ({ word: w, countA: freqA.get(w) || 0, countB: freqB.get(w) || 0 }))
      .sort((a, b) => (b.countA + b.countB) - (a.countA + a.countB))
      .slice(0, 20);

    const matchingSents = sentAScores.filter(s => s > 0.3).length;
    const uniqueSentsA = sentAScores.filter(s => s <= 0.3).length;

    return {
      overall, sentsA, sentsB, sentAScores, sentBScores, matches,
      commonTri: [...new Set(commonTri)], commonPent: [...new Set(commonPent)],
      triOverlap, cosine, overallJaccard,
      freqPairs, matchingSents, uniqueSentsA,
    };
  }, [hasCompared, textA, textB]);

  const handleCompare = useCallback(() => {
    if (textA.trim() && textB.trim()) setHasCompared(true);
  }, [textA, textB]);

  const handleExample = useCallback(() => {
    setTextA(EXAMPLE_A);
    setTextB(EXAMPLE_B);
    setHasCompared(false);
  }, []);

  const handleCopyReport = useCallback(() => {
    if (!analysis) return;
    const report = [
      '=== Plagiarism Check Report ===',
      `Overall Similarity: ${analysis.overall}%`,
      `Jaccard Index: ${(analysis.overallJaccard * 100).toFixed(1)}%`,
      `Cosine Similarity: ${(analysis.cosine * 100).toFixed(1)}%`,
      `3-gram Overlap: ${(analysis.triOverlap * 100).toFixed(1)}%`,
      `Sentences (Text A): ${analysis.sentsA.length}`,
      `Sentences (Text B): ${analysis.sentsB.length}`,
      `Matching Sentences: ${analysis.matchingSents}`,
      `Unique Sentences (Text A): ${analysis.uniqueSentsA}`,
      `Common 3-grams: ${analysis.commonTri.length}`,
      `Common 5-grams: ${analysis.commonPent.length}`,
      '',
      '--- Matched Phrases ---',
      ...analysis.matches.slice(0, 10).map(
        (m, i) => `${i + 1}. [${(m.sim * 100).toFixed(0)}%] "${m.sentA}" <-> "${m.sentB}"`
      ),
    ].join('\n');
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [analysis]);

  /* ── verdict helpers ─────────────────────────────────────────────── */
  const getColor = (pct: number) =>
    pct <= 30 ? 'text-emerald-500' : pct <= 60 ? 'text-amber-500' : 'text-rose-500';
  const getRingColor = (pct: number) =>
    pct <= 30 ? 'stroke-emerald-500' : pct <= 60 ? 'stroke-amber-500' : 'stroke-rose-500';
  const getBgColor = (pct: number) =>
    pct <= 30
      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
      : pct <= 60
        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800';
  const getVerdict = (pct: number) =>
    pct <= 30
      ? 'Low Similarity -- Likely Original'
      : pct <= 60
        ? 'Moderate Similarity -- Review Highlighted Sections'
        : 'High Similarity -- Significant Overlap Detected';

  const highlightClass = (score: number) =>
    score > 0.8
      ? 'bg-rose-200 dark:bg-rose-800/50'
      : score > 0.5
        ? 'bg-amber-200 dark:bg-amber-700/50'
        : score > 0.3
          ? 'bg-yellow-100 dark:bg-yellow-800/30'
          : 'bg-emerald-100 dark:bg-emerald-900/30';

  /* ── circular progress SVG ────────────────────────────────────────── */
  const CircularProgress = ({ pct }: { pct: number }) => {
    const r = 54, c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;
    return (
      <svg width="140" height="140" className="mx-auto">
        <circle cx="70" cy="70" r={r} fill="none" strokeWidth="10"
          className="stroke-gray-200 dark:stroke-gray-700" />
        <circle cx="70" cy="70" r={r} fill="none" strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          className={`${getRingColor(pct)} transition-all duration-700`}
          transform="rotate(-90 70 70)" />
        <text x="70" y="70" textAnchor="middle" dominantBaseline="central"
          className={`text-2xl font-bold fill-current ${getColor(pct)}`}>
          {pct}%
        </text>
      </svg>
    );
  };

  /* ── render ─────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* trust badge */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
        <Shield className="w-4 h-4 text-rose-500 shrink-0" />
        100% Private -- texts are compared in your browser, never uploaded
      </div>

      {/* text areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { label: 'Source / Original Text', val: textA, set: setTextA, count: wordCountA, id: 'a' },
          { label: 'Text to Check', val: textB, set: setTextB, count: wordCountB, id: 'b' },
        ].map(({ label, val, set, count, id }) => (
          <div key={id} className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <AlignLeft className="w-4 h-4 text-rose-500" />
                {label}
              </label>
              <span className="text-xs text-gray-400">{count} words</span>
            </div>
            <textarea
              value={val}
              onChange={e => { set(e.target.value); setHasCompared(false); }}
              placeholder={`Paste ${id === 'a' ? 'original' : 'comparison'} text here...`}
              rows={10}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 text-sm resize-y focus:ring-2 focus:ring-rose-500 focus:border-transparent transition placeholder:text-gray-400"
            />
          </div>
        ))}
      </div>

      {/* action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleCompare}
          disabled={!textA.trim() || !textB.trim()}
          className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-rose-500/20"
        >
          <FileSearch className="w-4 h-4" /> Compare
        </button>
        <button onClick={handleExample}
          className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Try Example
        </button>
        {analysis && (
          <button onClick={handleCopyReport}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition flex items-center gap-2 ml-auto">
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Report'}
          </button>
        )}
      </div>

      {/* ── results ──────────────────────────────────────────────────── */}
      {analysis && (
        <div className="space-y-6">
          {/* score card */}
          <div className={`rounded-2xl border p-6 ${getBgColor(analysis.overall)}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center">
                <CircularProgress pct={analysis.overall} />
                <p className={`mt-2 font-semibold text-sm ${getColor(analysis.overall)}`}>
                  Similarity Score
                </p>
              </div>
              <div className="md:col-span-2 space-y-3">
                <h3 className={`text-lg font-bold ${getColor(analysis.overall)}`}>
                  {getVerdict(analysis.overall)}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Jaccard Index', val: `${(analysis.overallJaccard * 100).toFixed(1)}%` },
                    { label: 'Cosine (TF-IDF)', val: `${(analysis.cosine * 100).toFixed(1)}%` },
                    { label: '3-gram Overlap', val: `${(analysis.triOverlap * 100).toFixed(1)}%` },
                    { label: 'Matching Sents', val: `${analysis.matchingSents}` },
                    { label: 'Unique (Text A)', val: `${analysis.uniqueSentsA}` },
                    { label: 'Common 3-grams', val: `${analysis.commonTri.length}` },
                  ].map(s => (
                    <div key={s.label} className="bg-white/60 dark:bg-gray-800/60 rounded-lg px-3 py-2 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{s.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* sentence stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: AlignLeft, label: 'Sentences A', val: analysis.sentsA.length, color: 'text-blue-500' },
              { icon: AlignLeft, label: 'Sentences B', val: analysis.sentsB.length, color: 'text-violet-500' },
              { icon: Layers, label: 'Common 5-grams', val: analysis.commonPent.length, color: 'text-rose-500' },
              { icon: Hash, label: 'Common 3-grams', val: analysis.commonTri.length, color: 'text-amber-500' },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
                <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{s.val}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>

          {/* highlighted texts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { label: 'Source Text', sents: analysis.sentsA, scores: analysis.sentAScores },
              { label: 'Comparison Text', sents: analysis.sentsB, scores: analysis.sentBScores },
            ].map(({ label, sents, scores }) => (
              <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-rose-500" /> {label}
                </h4>
                <div className="text-sm leading-relaxed space-y-0.5">
                  {sents.map((s, i) => (
                    <span key={i} className={`${highlightClass(scores[i])} rounded px-0.5 inline`}>
                      {s}{' '}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 mt-3 text-[10px] text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700" /> Unique</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-200 dark:bg-amber-700/50 border border-amber-300 dark:border-amber-600" /> Similar</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-200 dark:bg-rose-800/50 border border-rose-300 dark:border-rose-700" /> Near-identical</span>
                </div>
              </div>
            ))}
          </div>

          {/* tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {([
                { id: 'sentences' as Tab, label: 'Sentence Matching', icon: AlignLeft },
                { id: 'ngrams' as Tab, label: 'N-gram Analysis', icon: Hash },
                { id: 'frequency' as Tab, label: 'Word Frequency', icon: BarChart3 },
              ]).map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-1.5 transition ${
                    activeTab === tab.id
                      ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50 dark:bg-rose-950/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}>
                  <tab.icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-4">
              {/* sentence matching */}
              {activeTab === 'sentences' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Each sentence from Text A matched against Text B using Jaccard word similarity.
                  </p>
                  {analysis.matches.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">No similar sentences found.</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {analysis.matches.slice(0, 20).map((m, i) => (
                        <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              m.sim > 0.8
                                ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'
                                : m.sim > 0.5
                                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                            }`}>
                              {(m.sim * 100).toFixed(0)}% match
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-1">
                            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs mr-1">A:</span>{m.sentA}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs mr-1">B:</span>{m.sentB}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* n-gram analysis */}
              {activeTab === 'ngrams' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">3-word N-grams</h5>
                      <p className="text-2xl font-bold text-rose-500">{analysis.commonTri.length}</p>
                      <p className="text-xs text-gray-500">common trigrams &middot; {(analysis.triOverlap * 100).toFixed(1)}% overlap</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">5-word N-grams</h5>
                      <p className="text-2xl font-bold text-rose-500">{analysis.commonPent.length}</p>
                      <p className="text-xs text-gray-500">common pentagrams</p>
                    </div>
                  </div>
                  {analysis.commonTri.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Shared 3-grams</h5>
                      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                        {analysis.commonTri.slice(0, 40).map((g, i) => (
                          <span key={i} className="px-2 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded text-xs border border-rose-200 dark:border-rose-800">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.commonPent.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Shared 5-grams</h5>
                      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                        {analysis.commonPent.slice(0, 20).map((g, i) => (
                          <span key={i} className="px-2 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded text-xs border border-violet-200 dark:border-violet-800">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* word frequency */}
              {activeTab === 'frequency' && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Top 20 content words by combined frequency (stop words excluded).
                  </p>
                  <div className="space-y-1.5 max-h-96 overflow-y-auto">
                    {analysis.freqPairs.map((fp, i) => {
                      const maxCount = Math.max(
                        ...analysis.freqPairs.map(f => Math.max(f.countA, f.countB)), 1
                      );
                      return (
                        <div key={i} className="grid grid-cols-[100px_1fr_32px_1fr_32px] gap-2 items-center text-sm">
                          <span className="text-right text-gray-600 dark:text-gray-400 truncate font-mono text-xs">{fp.word}</span>
                          <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                            <div
                              className="h-full bg-blue-400 dark:bg-blue-500 rounded transition-all"
                              style={{ width: `${(fp.countA / maxCount) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 text-center">{fp.countA}</span>
                          <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                            <div
                              className="h-full bg-violet-400 dark:bg-violet-500 rounded transition-all"
                              style={{ width: `${(fp.countB / maxCount) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 text-center">{fp.countB}</span>
                        </div>
                      );
                    })}
                    <div className="flex gap-6 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-400" /> Text A</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-violet-400" /> Text B</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* matched phrases panel */}
          {analysis.matches.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-rose-500" /> Matched Phrases ({analysis.matches.length})
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {analysis.matches.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className={`shrink-0 mt-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                      m.sim > 0.8
                        ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                    }`}>
                      {(m.sim * 100).toFixed(0)}%
                    </span>
                    <div className="min-w-0">
                      <p className="text-gray-700 dark:text-gray-300 truncate">{m.sentA}</p>
                      <p className="text-gray-500 dark:text-gray-400 truncate text-xs mt-0.5">{m.sentB}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
