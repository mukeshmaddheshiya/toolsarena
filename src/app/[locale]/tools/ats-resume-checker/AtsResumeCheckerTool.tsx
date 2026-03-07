'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  FileText, Briefcase, Sparkles, CheckCircle2, XCircle, AlertTriangle,
  Copy, Check, ShieldCheck, Target, BarChart3, Zap, Hash, AlignLeft,
  User, GraduationCap, Award, ClipboardList, Lightbulb, RotateCcw,
} from 'lucide-react';

/* ─── STOP WORDS ─────────────────────────────────────────────────────────── */
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','is','it','as','are','was','were','be','been','being','have','has',
  'had','do','does','did','will','would','shall','should','may','might','can',
  'could','this','that','these','those','i','me','my','we','our','you','your',
  'he','she','they','them','his','her','its','their','not','no','so','if',
  'about','up','out','then','than','too','very','just','also','more','most',
  'all','any','each','every','both','few','many','much','some','such','own',
  'same','other','into','over','after','before','between','through','during',
  'above','below','under','again','further','once','here','there','when',
  'where','why','how','what','which','who','whom','while','until','because',
  'against','per','via','etc','using','used','use','able','across','along',
  'well','new','work','working','worked','including','include','includes',
]);

/* ─── ACTION VERBS ───────────────────────────────────────────────────────── */
const ACTION_VERBS = [
  'achieved','administered','advanced','analyzed','approved','architected',
  'assembled','assessed','automated','boosted','budgeted','built','captured',
  'centralized','championed','coached','collaborated','communicated',
  'compiled','completed','composed','conducted','consolidated','constructed',
  'consulted','coordinated','created','cultivated','customized','decreased',
  'defined','delegated','delivered','demonstrated','deployed','designed',
  'developed','devised','diagnosed','directed','discovered','documented',
  'doubled','drove','earned','edited','eliminated','enabled','engineered',
  'enhanced','ensured','established','evaluated','exceeded','executed',
  'expanded','expedited','facilitated','finalized','forecasted','formulated',
  'founded','generated','governed','grew','guided','headed','hired',
  'identified','implemented','improved','incorporated','increased',
  'influenced','initiated','innovated','inspected','installed','instituted',
  'integrated','introduced','investigated','launched','led','leveraged',
  'maintained','managed','mapped','maximized','measured','mediated',
  'mentored','merged','minimized','mobilized','modernized','monitored',
  'motivated','navigated','negotiated','obtained','operated','optimized',
  'orchestrated','organized','outperformed','oversaw','partnered','performed',
  'persuaded','pioneered','planned','prepared','presented','prioritized',
  'produced','programmed','projected','promoted','proposed','provided',
  'published','purchased','rebuilt','recommended','reconciled','recruited',
  'redesigned','reduced','refined','regulated','remodeled','reorganized',
  'repaired','replaced','reported','represented','researched','resolved',
  'restructured','revamped','reviewed','revised','revitalized','saved',
  'scheduled','secured','served','shaped','simplified','solved','spearheaded',
  'standardized','steered','streamlined','strengthened','structured',
  'supervised','surpassed','sustained','synchronized','systematized',
  'targeted','tested','trained','transformed','translated','troubleshot',
  'unified','updated','upgraded','utilized','validated','visualized',
];

/* ─── SECTION PATTERNS ───────────────────────────────────────────────────── */
const SECTION_CHECKS: { key: string; label: string; patterns: RegExp }[] = [
  { key: 'contact', label: 'Contact Info', patterns: /(?:email|phone|address|linkedin|github|portfolio|@|(\+?\d[\d\s\-()]{7,}))/i },
  { key: 'summary', label: 'Summary / Objective', patterns: /(?:^|\n)\s*(?:summary|objective|profile|about\s*me|professional\s*summary|career\s*objective)/im },
  { key: 'experience', label: 'Work Experience', patterns: /(?:^|\n)\s*(?:experience|work\s*history|employment|professional\s*experience|work\s*experience)/im },
  { key: 'education', label: 'Education', patterns: /(?:^|\n)\s*(?:education|academic|qualifications|degree)/im },
  { key: 'skills', label: 'Skills', patterns: /(?:^|\n)\s*(?:skills|technical\s*skills|core\s*competencies|competencies|technologies|proficiencies)/im },
  { key: 'certifications', label: 'Certifications', patterns: /(?:^|\n)\s*(?:certifications?|licenses?|accreditations?|credentials?)/im },
];

/* ─── KEYWORD EXTRACTION ─────────────────────────────────────────────────── */
function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase().replace(/[^\w\s\-+#./]/g, ' ');
  const words = lower.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));

  // unigrams
  const unigrams = [...new Set(words)];

  // bigrams & trigrams
  const ngrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    if (!STOP_WORDS.has(words[i]) && !STOP_WORDS.has(words[i + 1])) {
      ngrams.push(`${words[i]} ${words[i + 1]}`);
    }
    if (i < words.length - 2 && !STOP_WORDS.has(words[i + 2])) {
      ngrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
  }

  const uniqueNgrams = [...new Set(ngrams)];
  return [...unigrams, ...uniqueNgrams];
}

/* ─── ANALYSIS ENGINE ────────────────────────────────────────────────────── */
interface AnalysisResult {
  overall: number;
  keywordScore: number;
  sectionScore: number;
  actionVerbScore: number;
  quantificationScore: number;
  formattingScore: number;
  foundKeywords: string[];
  missingKeywords: string[];
  sections: { key: string; label: string; found: boolean }[];
  foundVerbs: string[];
  quantifiers: string[];
  suggestions: string[];
  wordCount: number;
}

function analyzeResume(resume: string, jd: string): AnalysisResult {
  const resumeLower = resume.toLowerCase();
  const wordCount = resume.trim().split(/\s+/).filter(Boolean).length;

  /* 1 — Keyword match */
  const jdKeywords = extractKeywords(jd);
  // keep meaningful keywords (skip very common/short)
  const meaningful = jdKeywords.filter(k => k.length > 2);
  const unique = [...new Set(meaningful)];
  const found: string[] = [];
  const missing: string[] = [];

  unique.forEach(kw => {
    if (resumeLower.includes(kw)) found.push(kw);
    else missing.push(kw);
  });

  // prioritise unigrams for display, cap missing at 30
  const missingDisplay = missing.slice(0, 30);
  const foundDisplay = found.slice(0, 40);
  const keywordScore = unique.length > 0 ? Math.round((found.length / unique.length) * 100) : 0;

  /* 2 — Section detection */
  const sections = SECTION_CHECKS.map(s => ({ key: s.key, label: s.label, found: s.patterns.test(resume) }));
  const sectionScore = Math.round((sections.filter(s => s.found).length / sections.length) * 100);

  /* 3 — Action verbs */
  const foundVerbs = ACTION_VERBS.filter(v => {
    const re = new RegExp(`\\b${v}\\b`, 'i');
    return re.test(resume);
  });
  const actionVerbScore = Math.min(100, Math.round((foundVerbs.length / 12) * 100));

  /* 4 — Quantification */
  const quantMatches = resume.match(/\d+[%+]?|\$[\d,.]+[KMBkmb]?/g) || [];
  const quantifiers = [...new Set(quantMatches)].slice(0, 20);
  const quantificationScore = Math.min(100, Math.round((quantifiers.length / 6) * 100));

  /* 5 — Formatting */
  let fmtScore = 100;
  const fmtIssues: string[] = [];
  if (wordCount < 150) { fmtScore -= 30; fmtIssues.push('too_short'); }
  else if (wordCount < 300) { fmtScore -= 15; fmtIssues.push('short'); }
  if (wordCount > 1200) { fmtScore -= 20; fmtIssues.push('too_long'); }
  // special chars that break ATS
  const badChars = resume.match(/[^\x20-\x7E\n\r\t]/g);
  if (badChars && badChars.length > 10) { fmtScore -= 25; fmtIssues.push('special_chars'); }
  // excessive caps
  const capsRatio = (resume.match(/[A-Z]/g) || []).length / Math.max(resume.length, 1);
  if (capsRatio > 0.4) { fmtScore -= 15; fmtIssues.push('excessive_caps'); }
  fmtScore = Math.max(0, fmtScore);

  /* Overall (weighted) */
  const overall = Math.round(
    keywordScore * 0.35 +
    sectionScore * 0.20 +
    actionVerbScore * 0.15 +
    quantificationScore * 0.15 +
    fmtScore * 0.15
  );

  /* Suggestions */
  const suggestions: string[] = [];
  if (missingDisplay.length > 5) {
    const top = missingDisplay.filter(k => !k.includes(' ')).slice(0, 8);
    if (top.length) suggestions.push(`Add these missing keywords from the job description: ${top.join(', ')}.`);
  }
  if (!sections.find(s => s.key === 'skills')?.found) {
    suggestions.push('Add a dedicated "Skills" section -- most ATS systems specifically scan for this heading.');
  }
  if (!sections.find(s => s.key === 'summary')?.found) {
    suggestions.push('Include a "Summary" or "Objective" section at the top to introduce your profile.');
  }
  if (!sections.find(s => s.key === 'experience')?.found) {
    suggestions.push('Add a clearly labeled "Experience" or "Work Experience" section.');
  }
  if (foundVerbs.length < 5) {
    suggestions.push('Use more strong action verbs (e.g., "implemented", "spearheaded", "optimized") to describe your accomplishments.');
  }
  if (quantifiers.length < 3) {
    suggestions.push('Your experience section lacks quantifiable metrics. Add numbers like "20%", "$1M", "50+ clients" to demonstrate impact.');
  }
  if (fmtIssues.includes('too_short')) {
    suggestions.push('Your resume appears too short. Aim for 300-800 words for a standard one-page resume.');
  }
  if (fmtIssues.includes('too_long')) {
    suggestions.push('Your resume may be too long. Keep it concise -- 1-2 pages is ideal for most roles.');
  }
  if (fmtIssues.includes('special_chars')) {
    suggestions.push('Your resume contains special characters or unicode symbols that may confuse ATS parsers. Stick to standard ASCII characters.');
  }
  if (!sections.find(s => s.key === 'contact')?.found) {
    suggestions.push('Ensure your contact information (email, phone, LinkedIn) is clearly visible at the top.');
  }
  if (keywordScore < 40) {
    suggestions.push('Your resume has low keyword alignment with this job description. Tailor your resume to mirror the language used in the JD.');
  }

  return {
    overall, keywordScore, sectionScore, actionVerbScore, quantificationScore,
    formattingScore: fmtScore, foundKeywords: foundDisplay, missingKeywords: missingDisplay,
    sections, foundVerbs, quantifiers, suggestions, wordCount,
  };
}

/* ─── SAMPLE DATA ────────────────────────────────────────────────────────── */
const SAMPLE_RESUME = `John Smith
Email: john.smith@email.com | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/johnsmith

SUMMARY
Results-driven Full-Stack Developer with 5+ years of experience building scalable web applications. Proficient in React, Node.js, TypeScript, and cloud platforms. Passionate about clean code and delivering user-centric solutions.

WORK EXPERIENCE

Senior Software Engineer | TechCorp Inc. | Jan 2022 - Present
- Architected and deployed a microservices platform serving 2M+ daily active users
- Led a team of 6 engineers to deliver a real-time analytics dashboard, reducing report generation time by 75%
- Implemented CI/CD pipelines using GitHub Actions, cutting deployment time from 2 hours to 15 minutes
- Optimized database queries resulting in 40% improvement in API response times

Software Developer | StartupXYZ | Jun 2019 - Dec 2021
- Developed RESTful APIs using Node.js and Express, handling 500K+ requests per day
- Built responsive front-end interfaces with React and TypeScript for 3 client-facing products
- Reduced cloud infrastructure costs by 30% through AWS resource optimization
- Collaborated with product and design teams to ship 12 major features in 18 months

EDUCATION
Bachelor of Science in Computer Science | State University | 2019
GPA: 3.7/4.0

SKILLS
Languages: JavaScript, TypeScript, Python, SQL
Frameworks: React, Next.js, Node.js, Express, Django
Cloud: AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes
Tools: Git, GitHub Actions, Jenkins, Jira, Figma
Databases: PostgreSQL, MongoDB, Redis

CERTIFICATIONS
AWS Certified Solutions Architect - Associate
Google Cloud Professional Developer`;

const SAMPLE_JD = `Senior Full-Stack Developer

We are looking for a Senior Full-Stack Developer to join our engineering team. You will be responsible for designing, developing, and maintaining scalable web applications.

Requirements:
- 5+ years of experience in full-stack web development
- Strong proficiency in React, TypeScript, and Node.js
- Experience with cloud platforms (AWS preferred)
- Familiarity with CI/CD pipelines and DevOps practices
- Experience with microservices architecture
- Strong understanding of RESTful API design
- Experience with SQL and NoSQL databases (PostgreSQL, MongoDB)
- Familiarity with Docker and Kubernetes
- Excellent problem-solving and communication skills
- Experience leading or mentoring junior developers

Nice to have:
- Experience with Next.js
- Knowledge of Python or Django
- AWS certifications
- Experience with real-time data processing
- Familiarity with agile methodologies and Jira

Responsibilities:
- Design and implement scalable full-stack solutions
- Lead code reviews and mentor junior team members
- Collaborate with product managers and designers
- Optimize application performance and reliability
- Implement automated testing and CI/CD pipelines
- Contribute to system architecture decisions`;

/* ─── CIRCULAR PROGRESS ──────────────────────────────────────────────────── */
function CircularScore({ score, size = 160 }: { score: number; size?: number }) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 71 ? '#22c55e' : score >= 41 ? '#eab308' : '#ef4444';
  const bg = score >= 71 ? 'text-green-500' : score >= 41 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="currentColor" strokeWidth={stroke}
          className="text-gray-200 dark:text-gray-700" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-4xl font-bold ${bg}`}>{score}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">/ 100</span>
      </div>
    </div>
  );
}

/* ─── SCORE BAR ──────────────────────────────────────────────────────────── */
function ScoreBar({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) {
  const color = score >= 71 ? 'bg-green-500' : score >= 41 ? 'bg-yellow-500' : 'bg-red-500';
  const textColor = score >= 71 ? 'text-green-600 dark:text-green-400' : score >= 41 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Icon className="w-4 h-4" />
          {label}
        </div>
        <span className={`text-sm font-bold ${textColor}`}>{score}%</span>
      </div>
      <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export function AtsResumeCheckerTool() {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const canAnalyze = resume.trim().length > 30 && jd.trim().length > 20;

  const handleAnalyze = useCallback(() => {
    if (!canAnalyze) return;
    setResult(analyzeResume(resume, jd));
  }, [resume, jd, canAnalyze]);

  const handleExample = useCallback(() => {
    setResume(SAMPLE_RESUME);
    setJd(SAMPLE_JD);
    setResult(null);
  }, []);

  const handleReset = useCallback(() => {
    setResume('');
    setJd('');
    setResult(null);
  }, []);

  const reportText = useMemo(() => {
    if (!result) return '';
    const lines = [
      `ATS Resume Score Report`,
      `========================`,
      `Overall Score: ${result.overall}/100`,
      ``,
      `Dimension Scores:`,
      `  Keyword Match: ${result.keywordScore}%`,
      `  Section Detection: ${result.sectionScore}%`,
      `  Action Verbs: ${result.actionVerbScore}%`,
      `  Quantification: ${result.quantificationScore}%`,
      `  Formatting: ${result.formattingScore}%`,
      ``,
      `Sections Found: ${result.sections.filter(s => s.found).map(s => s.label).join(', ')}`,
      `Sections Missing: ${result.sections.filter(s => !s.found).map(s => s.label).join(', ') || 'None'}`,
      ``,
      `Found Keywords (${result.foundKeywords.length}): ${result.foundKeywords.slice(0, 20).join(', ')}`,
      `Missing Keywords (${result.missingKeywords.length}): ${result.missingKeywords.filter(k => !k.includes(' ')).slice(0, 15).join(', ')}`,
      ``,
      `Suggestions:`,
      ...result.suggestions.map((s, i) => `  ${i + 1}. ${s}`),
      ``,
      `Generated by ToolsArena ATS Resume Checker — 100% client-side analysis.`,
    ];
    return lines.join('\n');
  }, [result]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [reportText]);

  const gradeLabel = (s: number) => s >= 71 ? 'Great' : s >= 41 ? 'Needs Work' : 'Poor';

  return (
    <div className="space-y-6">
      {/* Privacy Badge */}
      <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
        <p className="text-sm font-medium text-green-700 dark:text-green-300">
          100% Private — your resume never leaves your browser. All analysis runs locally.
        </p>
      </div>

      {/* Input Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Resume */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <FileText className="w-4 h-4 text-green-600" />
            Resume Text
          </label>
          <textarea
            value={resume}
            onChange={e => { setResume(e.target.value); setResult(null); }}
            placeholder="Paste your resume content here..."
            rows={14}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {resume.trim() ? `${resume.trim().split(/\s+/).filter(Boolean).length} words` : 'Paste plain-text resume (no PDF)'}
          </p>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Briefcase className="w-4 h-4 text-green-600" />
            Job Description
          </label>
          <textarea
            value={jd}
            onChange={e => { setJd(e.target.value); setResult(null); }}
            placeholder="Paste the job description here..."
            rows={14}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {jd.trim() ? `${jd.trim().split(/\s+/).filter(Boolean).length} words` : 'Paste the target job posting'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-green-600/20"
        >
          <Sparkles className="w-5 h-5" />
          Analyze Resume
        </button>
        <button onClick={handleExample}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <ClipboardList className="w-4 h-4" />
          Try Example
        </button>
        {(resume || jd) && (
          <button onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* ─── RESULTS ─────────────────────────────────────────────────────────── */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Overall Score */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Overall ATS Score</h2>
            <CircularScore score={result.overall} />
            <p className={`text-lg font-semibold ${
              result.overall >= 71 ? 'text-green-600 dark:text-green-400'
              : result.overall >= 41 ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-red-600 dark:text-red-400'
            }`}>
              {gradeLabel(result.overall)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {result.overall >= 71
                ? 'Your resume is well-optimized for ATS systems. Review the suggestions below for fine-tuning.'
                : result.overall >= 41
                ? 'Your resume needs improvement to pass ATS filters. Follow the suggestions below.'
                : 'Your resume is unlikely to pass most ATS systems. Significant changes are recommended.'}
            </p>
          </div>

          {/* Dimension Scores */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-5">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Score Breakdown
            </h3>
            <div className="space-y-4">
              <ScoreBar label="Keyword Match" score={result.keywordScore} icon={Target} />
              <ScoreBar label="Section Detection" score={result.sectionScore} icon={AlignLeft} />
              <ScoreBar label="Action Verbs" score={result.actionVerbScore} icon={Zap} />
              <ScoreBar label="Quantification" score={result.quantificationScore} icon={Hash} />
              <ScoreBar label="Formatting" score={result.formattingScore} icon={FileText} />
            </div>
          </div>

          {/* Section Checklist + Keywords — two columns on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Section Checklist */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-3">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-green-600" />
                Section Checklist
              </h3>
              <ul className="space-y-2">
                {result.sections.map(s => (
                  <li key={s.key} className="flex items-center gap-2.5 text-sm">
                    {s.found
                      ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      : <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                    <span className={s.found ? 'text-gray-700 dark:text-gray-300' : 'text-red-600 dark:text-red-400 font-medium'}>
                      {s.label}
                    </span>
                    <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                      s.found ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {s.found ? 'Found' : 'Missing'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keyword Analysis */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Keyword Analysis
              </h3>

              {/* Found */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
                  Found ({result.foundKeywords.length})
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                  {result.foundKeywords.filter(k => !k.includes(' ')).slice(0, 25).map(kw => (
                    <span key={kw} className="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide">
                  Missing ({result.missingKeywords.filter(k => !k.includes(' ')).length})
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                  {result.missingKeywords.filter(k => !k.includes(' ')).slice(0, 20).map(kw => (
                    <span key={kw} className="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Density */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Keyword density</span>
                  <span className="font-semibold">{result.keywordScore}% match</span>
                </div>
                <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${
                    result.keywordScore >= 60 ? 'bg-green-500' : result.keywordScore >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} style={{ width: `${result.keywordScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="rounded-2xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10 p-6 space-y-3">
              <h3 className="text-base font-bold text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Suggestions to Improve Your Score
              </h3>
              <ul className="space-y-2.5">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-yellow-900 dark:text-yellow-200">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Verbs Found */}
          {result.foundVerbs.length > 0 && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-3">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                Action Verbs Detected ({result.foundVerbs.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {result.foundVerbs.map(v => (
                  <span key={v} className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 capitalize">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Copy Report */}
          <div className="flex justify-center">
            <button onClick={handleCopy}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Report'}
            </button>
          </div>

          {/* Privacy footer */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>No data was sent to any server. Your resume was analyzed entirely in your browser.</span>
          </div>
        </div>
      )}
    </div>
  );
}
