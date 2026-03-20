'use client';

import { useState } from 'react';
import { FileSearch, CheckCircle, XCircle, AlertCircle, TrendingUp, Lightbulb } from 'lucide-react';

// Common stop words to filter out from keyword extraction
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'must', 'shall', 'can', 'this', 'that', 'these', 'those', 'i', 'we',
  'you', 'he', 'she', 'it', 'they', 'what', 'which', 'who', 'when',
  'where', 'how', 'all', 'each', 'both', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'not', 'only', 'same', 'so', 'than', 'too',
  'very', 'just', 'as', 'if', 'then', 'because', 'while', 'our', 'your',
  'their', 'its', 'my', 'his', 'her', 'also', 'any', 'new', 'good',
]);

const ACTION_VERBS = [
  'achieved', 'improved', 'managed', 'led', 'developed', 'created', 'built',
  'designed', 'implemented', 'delivered', 'increased', 'decreased', 'reduced',
  'generated', 'launched', 'drove', 'established', 'coordinated', 'executed',
  'analyzed', 'optimized', 'streamlined', 'collaborated', 'mentored', 'trained',
  'negotiated', 'resolved', 'spearheaded', 'transformed', 'automated', 'scaled',
  'maintained', 'supported', 'enhanced', 'accelerated', 'deployed', 'migrated',
];

interface SectionResult {
  name: string;
  found: boolean;
  tip: string;
}

interface AnalysisResult {
  overallScore: number;
  keywordScore: number;
  sectionScore: number;
  actionVerbScore: number;
  achievementScore: number;
  keywordMatchPct: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  sections: SectionResult[];
  actionVerbsFound: string[];
  hasQuantifiableAchievements: boolean;
  suggestions: string[];
}

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

function checkSection(text: string, patterns: RegExp[]): boolean {
  return patterns.some(p => p.test(text));
}

function analyzeResume(resumeText: string, jdText: string): AnalysisResult {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  // Extract keywords from JD
  const jdKeywords = [...new Set(extractKeywords(jdLower))].filter(w => w.length > 3);

  // Check which JD keywords appear in resume
  const matched = jdKeywords.filter(kw => resumeLower.includes(kw));
  const missing = jdKeywords.filter(kw => !resumeLower.includes(kw));
  const keywordMatchPct = jdKeywords.length > 0 ? Math.round((matched.length / jdKeywords.length) * 100) : 0;
  const keywordScore = Math.min(40, Math.round((keywordMatchPct / 100) * 40));

  // Section detection
  const sectionChecks: Array<{ name: string; patterns: RegExp[]; tip: string }> = [
    {
      name: 'Contact Information',
      patterns: [/\b[\w.-]+@[\w.-]+\.\w+\b/, /\b\d{10}\b/, /linkedin\.com/, /github\.com/],
      tip: 'Add your email address, phone number, and LinkedIn profile URL.',
    },
    {
      name: 'Education',
      patterns: [/\b(education|degree|bachelor|master|b\.?sc|m\.?sc|phd|university|college|diploma)\b/i],
      tip: 'Add an Education section with your degree, institution, and graduation year.',
    },
    {
      name: 'Work Experience',
      patterns: [/\b(experience|employment|work history|career|position|job|role|company|organization)\b/i],
      tip: 'Add a Work Experience section with your job titles, companies, and responsibilities.',
    },
    {
      name: 'Skills',
      patterns: [/\b(skills|technologies|tools|proficient|expertise|competencies|tech stack)\b/i],
      tip: 'Add a dedicated Skills section listing your technical and soft skills.',
    },
    {
      name: 'Summary / Objective',
      patterns: [/\b(summary|objective|profile|about me|professional summary|career objective)\b/i],
      tip: 'Add a 2-3 sentence professional summary at the top of your resume.',
    },
  ];

  const sections: SectionResult[] = sectionChecks.map(s => ({
    name: s.name,
    found: checkSection(resumeLower, s.patterns),
    tip: s.tip,
  }));

  const foundSections = sections.filter(s => s.found).length;
  const sectionScore = Math.round((foundSections / sections.length) * 30);

  // Action verb check
  const actionVerbsFound = ACTION_VERBS.filter(v => resumeLower.includes(v));
  const actionVerbScore = Math.min(15, actionVerbsFound.length >= 5 ? 15 : actionVerbsFound.length >= 3 ? 10 : actionVerbsFound.length >= 1 ? 5 : 0);

  // Quantifiable achievements check
  const hasQuantifiableAchievements = /\b\d+[\s%+x]/.test(resumeText);
  const achievementScore = hasQuantifiableAchievements ? 15 : 0;

  const overallScore = Math.min(100, keywordScore + sectionScore + actionVerbScore + achievementScore);

  // Build suggestions
  const suggestions: string[] = [];
  if (keywordMatchPct < 50) suggestions.push('Add more keywords from the job description — aim for at least 50% match.');
  if (missing.length > 0) suggestions.push(`Include these key terms: ${missing.slice(0, 8).join(', ')}.`);
  if (actionVerbsFound.length < 3) suggestions.push('Start bullet points with strong action verbs like "developed", "led", "increased", or "optimized".');
  if (!hasQuantifiableAchievements) suggestions.push('Add numbers to your achievements — e.g., "Increased sales by 30%" or "Managed a team of 8 engineers".');
  sections.filter(s => !s.found).forEach(s => suggestions.push(s.tip));

  return {
    overallScore,
    keywordScore,
    sectionScore,
    actionVerbScore,
    achievementScore,
    keywordMatchPct,
    matchedKeywords: matched.slice(0, 20),
    missingKeywords: missing.slice(0, 20),
    sections,
    actionVerbsFound,
    hasQuantifiableAchievements,
    suggestions,
  };
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 75 ? '#22c55e' :
    score >= 50 ? '#f59e0b' :
    '#ef4444';

  const label =
    score >= 85 ? 'Excellent' :
    score >= 75 ? 'Good' :
    score >= 50 ? 'Fair' :
    'Needs Work';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${score}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-gray-900 dark:text-gray-100">{score}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

export function AtsResumeScoreFixerTool() {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  function analyze() {
    setError('');
    if (resumeText.trim().length < 100) {
      setError('Please paste your full resume text (at least 100 characters).');
      return;
    }
    if (jdText.trim().length < 50) {
      setError('Please paste the job description (at least 50 characters).');
      return;
    }
    setResult(analyzeResume(resumeText, jdText));
  }

  function reset() {
    setResumeText('');
    setJdText('');
    setResult(null);
    setError('');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
          <FileSearch className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">ATS Resume Score Fixer</h2>
          <p className="text-xs text-gray-500">Pure keyword analysis — no AI, no data sent anywhere</p>
        </div>
      </div>

      {/* Input panels */}
      {!result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
              Your Resume Text
              <span className="text-gray-400 font-normal ml-2">({resumeText.length} chars)</span>
            </label>
            <textarea
              rows={14}
              placeholder="Paste your full resume text here — plain text works best. Include all sections: contact info, summary, experience, education, skills."
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none leading-relaxed"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
              Job Description
              <span className="text-gray-400 font-normal ml-2">({jdText.length} chars)</span>
            </label>
            <textarea
              rows={14}
              placeholder="Paste the full job description from the job posting. Include requirements, responsibilities, and any qualifications listed."
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none leading-relaxed"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {!result ? (
        <button
          onClick={analyze}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" /> Analyze Resume
        </button>
      ) : (
        <button
          onClick={reset}
          className="w-full border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold py-2.5 rounded-xl transition-colors"
        >
          Start Over
        </button>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {/* Score overview */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreRing score={result.overallScore} />
              <div className="flex-1 space-y-3 w-full">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Score Breakdown</h3>
                {[
                  { label: 'Keyword Match (40 pts)', score: result.keywordScore, max: 40 },
                  { label: 'Resume Sections (30 pts)', score: result.sectionScore, max: 30 },
                  { label: 'Action Verbs (15 pts)', score: result.actionVerbScore, max: 15 },
                  { label: 'Quantifiable Achievements (15 pts)', score: result.achievementScore, max: 15 },
                ].map(({ label, score, max }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{label}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{score}/{max}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${score / max >= 0.7 ? 'bg-green-500' : score / max >= 0.4 ? 'bg-yellow-400' : 'bg-red-400'}`}
                        style={{ width: `${(score / max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Keyword analysis */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Keyword Match: {result.keywordMatchPct}%
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Matched Keywords ({result.matchedKeywords.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedKeywords.length > 0 ? (
                    result.matchedKeywords.map(kw => (
                      <span key={kw} className="text-xs bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">{kw}</span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No keyword matches found</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Missing Keywords ({result.missingKeywords.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.length > 0 ? (
                    result.missingKeywords.map(kw => (
                      <span key={kw} className="text-xs bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-full">{kw}</span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">Great — no significant keywords missing!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section analysis */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Resume Sections</h3>
            <div className="space-y-2">
              {result.sections.map(section => (
                <div key={section.name} className={`flex items-center gap-3 p-3 rounded-lg border ${section.found ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'}`}>
                  {section.found ? (
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${section.found ? 'text-green-800 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>{section.name}</p>
                    {!section.found && <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{section.tip}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action verbs */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              Action Verbs Found
              <span className={`text-xs px-2 py-0.5 rounded-full font-normal ${result.actionVerbsFound.length >= 5 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'}`}>
                {result.actionVerbsFound.length} found
              </span>
            </h3>
            {result.actionVerbsFound.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {result.actionVerbsFound.map(v => (
                  <span key={v} className="text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">{v}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No strong action verbs detected. Start bullets with words like &quot;Led&quot;, &quot;Built&quot;, &quot;Achieved&quot;, &quot;Increased&quot;.</p>
            )}
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
              <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Improvement Suggestions
              </h3>
              <ul className="space-y-2">
                {result.suggestions.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                    <span className="mt-0.5 w-5 h-5 flex-shrink-0 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-200 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
