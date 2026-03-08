'use client';

import { useState, useCallback, useRef } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  GripVertical,
  Copy,
  Download,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Check,
} from 'lucide-react';

/* ─── Types ─── */
type EssayType =
  | 'argumentative'
  | 'persuasive'
  | 'expository'
  | 'narrative'
  | 'compare-contrast'
  | 'cause-effect'
  | 'descriptive'
  | 'analytical';

interface SubPoint {
  id: string;
  text: string;
}

interface BodyParagraph {
  id: string;
  topicSentence: string;
  evidence: SubPoint[];
  analysis: string;
  transition: string;
}

interface Outline {
  hook: string;
  background: string;
  thesis: string;
  body: BodyParagraph[];
  restateThesis: string;
  summary: string;
  finalThought: string;
}

/* ─── Constants ─── */
const ESSAY_TYPES: { type: EssayType; label: string; icon: string; desc: string }[] = [
  { type: 'argumentative', label: 'Argumentative', icon: '⚔', desc: 'Take a stance and defend it' },
  { type: 'persuasive', label: 'Persuasive', icon: '📢', desc: 'Convince the reader' },
  { type: 'expository', label: 'Expository', icon: '📖', desc: 'Explain a topic clearly' },
  { type: 'narrative', label: 'Narrative', icon: '📝', desc: 'Tell a story or experience' },
  { type: 'compare-contrast', label: 'Compare & Contrast', icon: '⚖', desc: 'Analyze similarities & differences' },
  { type: 'cause-effect', label: 'Cause & Effect', icon: '🔗', desc: 'Explore causes and outcomes' },
  { type: 'descriptive', label: 'Descriptive', icon: '🎨', desc: 'Paint a vivid picture' },
  { type: 'analytical', label: 'Analytical', icon: '🔍', desc: 'Break down and evaluate' },
];

const TIPS: Record<EssayType, string[]> = {
  argumentative: [
    'Present a clear, debatable claim in your thesis.',
    'Address counterarguments and refute them.',
    'Use evidence from credible sources to support each point.',
    'Maintain a formal, objective tone throughout.',
    'End with a strong call to action or implication.',
  ],
  persuasive: [
    'Appeal to emotion (pathos), logic (logos), and credibility (ethos).',
    'Use rhetorical questions to engage the reader.',
    'Include vivid examples and anecdotes.',
    'Anticipate objections and address them proactively.',
    'End with a memorable, action-oriented conclusion.',
  ],
  expository: [
    'Present facts objectively without personal opinion.',
    'Use a logical progression: general to specific.',
    'Define key terms early in the essay.',
    'Include statistics, examples, and expert quotes.',
    'Conclude by summarizing the key takeaway.',
  ],
  narrative: [
    'Set the scene with sensory details.',
    'Include a clear beginning, climax, and resolution.',
    'Use dialogue to bring characters to life.',
    'Show, don\'t tell - use vivid descriptions.',
    'End with a reflection or lesson learned.',
  ],
  'compare-contrast': [
    'Choose a clear organizational pattern: block or point-by-point.',
    'Use transition words like "similarly", "however", "in contrast".',
    'Ensure both subjects receive equal treatment.',
    'Focus on meaningful similarities and differences.',
    'Draw a conclusion about which is better or what we learn from the comparison.',
  ],
  'cause-effect': [
    'Clearly distinguish between causes and effects.',
    'Use transitional phrases like "as a result", "consequently", "due to".',
    'Avoid oversimplifying complex causal relationships.',
    'Include both immediate and long-term effects.',
    'Support claims with data and real-world examples.',
  ],
  descriptive: [
    'Engage all five senses in your descriptions.',
    'Use figurative language: similes, metaphors, personification.',
    'Organize spatially, chronologically, or by importance.',
    'Create a dominant impression or mood.',
    'Show emotions through details, not direct statements.',
  ],
  analytical: [
    'Break the subject into components for examination.',
    'Evaluate each component with evidence and reasoning.',
    'Maintain objectivity - analyze, don\'t just describe.',
    'Use topic sentences that make analytical claims.',
    'Synthesize findings in the conclusion.',
  ],
};

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function makeEvidence(count: number): SubPoint[] {
  return Array.from({ length: count }, () => ({ id: uid(), text: '' }));
}

function makeBody(count: number, essayType: EssayType, topic: string): BodyParagraph[] {
  const prompts = getBodyPrompts(essayType, topic, count);
  return prompts.map((p, i) => ({
    id: uid(),
    topicSentence: p,
    evidence: makeEvidence(i === 0 ? 3 : 2),
    analysis: '',
    transition: '',
  }));
}

function getBodyPrompts(type: EssayType, topic: string, count: number): string[] {
  const t = topic || '[your topic]';
  const base: Record<EssayType, string[]> = {
    argumentative: [
      `Present your strongest argument supporting your position on ${t}`,
      `Provide additional evidence or a second reason for your stance on ${t}`,
      `Address and refute the strongest counterargument against your position`,
      `Discuss broader implications of ${t} for society or the field`,
      `Present supporting data or expert opinion reinforcing your thesis`,
    ],
    persuasive: [
      `Appeal to logic (logos): Present factual evidence about ${t}`,
      `Appeal to emotion (pathos): Share a compelling story or example about ${t}`,
      `Appeal to credibility (ethos): Cite expert opinions and address opposing views`,
      `Present additional real-world consequences related to ${t}`,
      `Reinforce urgency with a powerful example or statistic`,
    ],
    expository: [
      `Define and explain the first key aspect of ${t}`,
      `Explore the second major component or perspective on ${t}`,
      `Discuss the significance and real-world applications of ${t}`,
      `Examine historical context or evolution of ${t}`,
      `Analyze current trends or future outlook for ${t}`,
    ],
    narrative: [
      `Set the scene: Describe the setting and introduce the situation involving ${t}`,
      `Build the narrative: Describe the rising action and key events`,
      `Climax and resolution: Reveal the turning point and outcome`,
      `Reflect on the deeper meaning or lesson from the experience`,
      `Connect the narrative to a broader theme or universal truth`,
    ],
    'compare-contrast': [
      `Discuss the key similarities between the subjects related to ${t}`,
      `Examine the most important differences between the subjects`,
      `Analyze which aspects are more significant and why`,
      `Explore unexpected parallels or contrasts that reveal deeper insights`,
      `Evaluate overall strengths and weaknesses of each subject`,
    ],
    'cause-effect': [
      `Identify and explain the primary cause(s) of ${t}`,
      `Discuss the immediate and short-term effects`,
      `Analyze the long-term consequences and broader impact`,
      `Examine secondary causes or contributing factors`,
      `Explore potential future effects or chain reactions`,
    ],
    descriptive: [
      `Describe the visual and spatial aspects of ${t} in vivid detail`,
      `Capture the sounds, smells, and textures associated with ${t}`,
      `Convey the emotional atmosphere and mood surrounding ${t}`,
      `Describe the people, characters, or life connected to ${t}`,
      `Paint a final, lasting image that captures the essence of ${t}`,
    ],
    analytical: [
      `Analyze the first major component or element of ${t}`,
      `Examine the second key aspect and its significance`,
      `Evaluate the relationship between components and overall effectiveness`,
      `Assess strengths and weaknesses in the context of ${t}`,
      `Synthesize your analysis to draw broader conclusions`,
    ],
  };
  return base[type].slice(0, count);
}

function getHookPrompt(topic: string): string {
  return `Start with a surprising fact, thought-provoking question, or compelling anecdote about ${topic || '[your topic]'}`;
}

function getBackgroundPrompt(type: EssayType, topic: string): string {
  const t = topic || '[your topic]';
  const map: Record<EssayType, string> = {
    argumentative: `Provide background context on ${t} and explain why this issue is debatable`,
    persuasive: `Set the stage by explaining the current situation regarding ${t} and why the reader should care`,
    expository: `Introduce the topic of ${t} and provide essential background information for the reader`,
    narrative: `Establish the context and setting for your story about ${t}`,
    'compare-contrast': `Introduce both subjects being compared regarding ${t} and explain why the comparison matters`,
    'cause-effect': `Provide context about ${t} and briefly introduce the causal chain you will explore`,
    descriptive: `Set the scene and introduce what you will be describing about ${t}`,
    analytical: `Present the subject of ${t} and explain the framework or criteria for your analysis`,
  };
  return map[type];
}

function wordCount(outline: Outline): number {
  const all = [
    outline.hook,
    outline.background,
    outline.thesis,
    ...outline.body.flatMap((b) => [
      b.topicSentence,
      ...b.evidence.map((e) => e.text),
      b.analysis,
      b.transition,
    ]),
    outline.restateThesis,
    outline.summary,
    outline.finalThought,
  ];
  return all.join(' ').split(/\s+/).filter(Boolean).length;
}

function outlineToPlainText(outline: Outline, essayType: string): string {
  let text = `Essay Outline (${essayType})\n${'='.repeat(40)}\n\n`;
  text += `I. Introduction\n`;
  text += `   Hook: ${outline.hook}\n`;
  text += `   Background: ${outline.background}\n`;
  text += `   Thesis: ${outline.thesis}\n\n`;
  outline.body.forEach((b, i) => {
    text += `${toRoman(i + 2)}. Body Paragraph ${i + 1}\n`;
    text += `   Topic Sentence: ${b.topicSentence}\n`;
    b.evidence.forEach((e, j) => {
      text += `   Evidence ${j + 1}: ${e.text}\n`;
    });
    text += `   Analysis: ${b.analysis}\n`;
    text += `   Transition: ${b.transition}\n\n`;
  });
  const cNum = outline.body.length + 2;
  text += `${toRoman(cNum)}. Conclusion\n`;
  text += `   Restate Thesis: ${outline.restateThesis}\n`;
  text += `   Summary: ${outline.summary}\n`;
  text += `   Final Thought: ${outline.finalThought}\n`;
  return text;
}

function outlineToMarkdown(outline: Outline, essayType: string): string {
  let md = `# Essay Outline (${essayType})\n\n`;
  md += `## I. Introduction\n`;
  md += `- **Hook:** ${outline.hook}\n`;
  md += `- **Background:** ${outline.background}\n`;
  md += `- **Thesis:** ${outline.thesis}\n\n`;
  outline.body.forEach((b, i) => {
    md += `## ${toRoman(i + 2)}. Body Paragraph ${i + 1}\n`;
    md += `- **Topic Sentence:** ${b.topicSentence}\n`;
    b.evidence.forEach((e, j) => {
      md += `  - Evidence ${j + 1}: ${e.text}\n`;
    });
    md += `- **Analysis:** ${b.analysis}\n`;
    md += `- **Transition:** ${b.transition}\n\n`;
  });
  const cNum = outline.body.length + 2;
  md += `## ${toRoman(cNum)}. Conclusion\n`;
  md += `- **Restate Thesis:** ${outline.restateThesis}\n`;
  md += `- **Summary:** ${outline.summary}\n`;
  md += `- **Final Thought:** ${outline.finalThought}\n`;
  return md;
}

function toRoman(n: number): string {
  const map = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return map[n - 1] || String(n);
}

/* ─── Component ─── */
export function EssayOutlineBuilderTool() {
  const [essayType, setEssayType] = useState<EssayType>('argumentative');
  const [topic, setTopic] = useState('');
  const [thesis, setThesis] = useState('');
  const [bodyCount, setBodyCount] = useState(3);
  const [outline, setOutline] = useState<Outline | null>(null);
  const [showTips, setShowTips] = useState(true);
  const [copied, setCopied] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const outlineRef = useRef<HTMLDivElement>(null);

  const generate = useCallback(() => {
    const o: Outline = {
      hook: getHookPrompt(topic),
      background: getBackgroundPrompt(essayType, topic),
      thesis: thesis || 'Enter your thesis statement here',
      body: makeBody(bodyCount, essayType, topic),
      restateThesis: `Restate your thesis in different words, reinforcing your position on ${topic || '[your topic]'}`,
      summary: `Briefly summarize the ${bodyCount} main points discussed in your body paragraphs`,
      finalThought: essayType === 'persuasive' || essayType === 'argumentative'
        ? `End with a strong call to action about ${topic || '[your topic]'}`
        : `Leave the reader with a thought-provoking final reflection on ${topic || '[your topic]'}`,
    };
    setOutline(o);
    setTimeout(() => outlineRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [topic, thesis, essayType, bodyCount]);

  const tryExample = useCallback(() => {
    setEssayType('argumentative');
    setTopic('Should social media be banned for teenagers?');
    setThesis(
      'Social media should be restricted for teenagers under 16 because it negatively impacts mental health, reduces academic performance, and exposes minors to cyberbullying and predatory behavior.'
    );
    setBodyCount(3);
  }, []);

  const updateOutlineField = useCallback(
    (field: keyof Omit<Outline, 'body'>, value: string) => {
      setOutline((prev) => (prev ? { ...prev, [field]: value } : prev));
    },
    []
  );

  const updateBody = useCallback(
    (idx: number, field: keyof Omit<BodyParagraph, 'id' | 'evidence'>, value: string) => {
      setOutline((prev) => {
        if (!prev) return prev;
        const body = [...prev.body];
        body[idx] = { ...body[idx], [field]: value };
        return { ...prev, body };
      });
    },
    []
  );

  const updateEvidence = useCallback((bIdx: number, eIdx: number, value: string) => {
    setOutline((prev) => {
      if (!prev) return prev;
      const body = [...prev.body];
      const evidence = [...body[bIdx].evidence];
      evidence[eIdx] = { ...evidence[eIdx], text: value };
      body[bIdx] = { ...body[bIdx], evidence };
      return { ...prev, body };
    });
  }, []);

  const addEvidence = useCallback((bIdx: number) => {
    setOutline((prev) => {
      if (!prev) return prev;
      const body = [...prev.body];
      const evidence = [...body[bIdx].evidence, { id: uid(), text: '' }];
      body[bIdx] = { ...body[bIdx], evidence };
      return { ...prev, body };
    });
  }, []);

  const removeEvidence = useCallback((bIdx: number, eIdx: number) => {
    setOutline((prev) => {
      if (!prev) return prev;
      const body = [...prev.body];
      if (body[bIdx].evidence.length <= 1) return prev;
      const evidence = body[bIdx].evidence.filter((_, i) => i !== eIdx);
      body[bIdx] = { ...body[bIdx], evidence };
      return { ...prev, body };
    });
  }, []);

  const addBodyParagraph = useCallback(() => {
    setOutline((prev) => {
      if (!prev || prev.body.length >= 7) return prev;
      const newP: BodyParagraph = {
        id: uid(),
        topicSentence: `Topic sentence for body paragraph ${prev.body.length + 1}`,
        evidence: makeEvidence(2),
        analysis: '',
        transition: '',
      };
      return { ...prev, body: [...prev.body, newP] };
    });
  }, []);

  const removeBodyParagraph = useCallback((idx: number) => {
    setOutline((prev) => {
      if (!prev || prev.body.length <= 1) return prev;
      return { ...prev, body: prev.body.filter((_, i) => i !== idx) };
    });
  }, []);

  const moveBody = useCallback((from: number, dir: -1 | 1) => {
    setOutline((prev) => {
      if (!prev) return prev;
      const to = from + dir;
      if (to < 0 || to >= prev.body.length) return prev;
      const body = [...prev.body];
      [body[from], body[to]] = [body[to], body[from]];
      return { ...prev, body };
    });
  }, []);

  const handleDragStart = useCallback((idx: number) => {
    setDragIdx(idx);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (targetIdx: number) => {
      if (dragIdx === null || dragIdx === targetIdx) return;
      setOutline((prev) => {
        if (!prev) return prev;
        const body = [...prev.body];
        const [moved] = body.splice(dragIdx, 1);
        body.splice(targetIdx, 0, moved);
        return { ...prev, body };
      });
      setDragIdx(null);
    },
    [dragIdx]
  );

  const copyToClipboard = useCallback(async () => {
    if (!outline) return;
    const label = ESSAY_TYPES.find((e) => e.type === essayType)?.label || essayType;
    await navigator.clipboard.writeText(outlineToPlainText(outline, label));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [outline, essayType]);

  const downloadFile = useCallback(
    (format: 'txt' | 'md') => {
      if (!outline) return;
      const label = ESSAY_TYPES.find((e) => e.type === essayType)?.label || essayType;
      const content = format === 'md' ? outlineToMarkdown(outline, label) : outlineToPlainText(outline, label);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `essay-outline.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [outline, essayType]
  );

  const wc = outline ? wordCount(outline) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ─── Essay Type Selector ─── */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          1. Choose Essay Type
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ESSAY_TYPES.map((et) => (
            <button
              key={et.type}
              onClick={() => setEssayType(et.type)}
              className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                essayType === et.type
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
              }`}
            >
              <span className="text-2xl">{et.icon}</span>
              <p className="mt-1 font-medium text-sm text-gray-900 dark:text-white">{et.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{et.desc}</p>
              {essayType === et.type && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Inputs ─── */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            2. Enter Topic & Thesis
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Essay Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Should social media be banned for teenagers?"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thesis Statement
              </label>
              <textarea
                value={thesis}
                onChange={(e) => setThesis(e.target.value)}
                placeholder="State your main argument or central idea..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Body Paragraphs
              </label>
              <div className="flex gap-2">
                {[3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setBodyCount(n)}
                    className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${
                      bodyCount === n
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={generate}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate Outline
            </button>
            <button
              onClick={tryExample}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
            >
              <FileText className="w-4 h-4" />
              Try Example
            </button>
          </div>
        </div>

        {/* ─── Tips Sidebar ─── */}
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 p-5">
          <button
            onClick={() => setShowTips((v) => !v)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold">
              <Lightbulb className="w-5 h-5" />
              {ESSAY_TYPES.find((e) => e.type === essayType)?.label} Essay Tips
            </span>
            {showTips ? (
              <ChevronUp className="w-4 h-4 text-blue-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-blue-500" />
            )}
          </button>
          {showTips && (
            <ul className="mt-3 space-y-2">
              {TIPS[essayType].map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200"
                >
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ─── Generated Outline ─── */}
      {outline && (
        <div ref={outlineRef} className="space-y-6">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">
                Your Outline
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium">
                {wc} words
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium">
                {outline.body.length} body {outline.body.length === 1 ? 'paragraph' : 'paragraphs'}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={() => downloadFile('txt')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Download className="w-4 h-4" />
                .txt
              </button>
              <button
                onClick={() => downloadFile('md')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Download className="w-4 h-4" />
                .md
              </button>
            </div>
          </div>

          {/* I. Introduction */}
          <section className="rounded-xl border-2 border-blue-300 dark:border-blue-700 overflow-hidden">
            <div className="bg-blue-100 dark:bg-blue-900/50 px-5 py-3">
              <h3 className="font-bold text-blue-800 dark:text-blue-200">I. Introduction</h3>
            </div>
            <div className="p-5 space-y-4 bg-white dark:bg-gray-800">
              <div>
                <label className="block text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                  Hook
                </label>
                <textarea
                  value={outline.hook}
                  onChange={(e) => updateOutlineField('hook', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                  Background Context
                </label>
                <textarea
                  value={outline.background}
                  onChange={(e) => updateOutlineField('background', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                  Thesis Statement
                </label>
                <textarea
                  value={outline.thesis}
                  onChange={(e) => updateOutlineField('thesis', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-medium"
                />
              </div>
            </div>
          </section>

          {/* Body Paragraphs */}
          {outline.body.map((para, bIdx) => (
            <section
              key={para.id}
              draggable
              onDragStart={() => handleDragStart(bIdx)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(bIdx)}
              className={`rounded-xl border-2 border-green-300 dark:border-green-700 overflow-hidden transition-opacity ${
                dragIdx === bIdx ? 'opacity-50' : ''
              }`}
            >
              <div className="bg-green-100 dark:bg-green-900/50 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-green-500 cursor-grab" />
                  <h3 className="font-bold text-green-800 dark:text-green-200">
                    {toRoman(bIdx + 2)}. Body Paragraph {bIdx + 1}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveBody(bIdx, -1)}
                    disabled={bIdx === 0}
                    className="p-1 rounded hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-30 text-green-700 dark:text-green-300"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveBody(bIdx, 1)}
                    disabled={bIdx === outline.body.length - 1}
                    className="p-1 rounded hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-30 text-green-700 dark:text-green-300"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeBodyParagraph(bIdx)}
                    disabled={outline.body.length <= 1}
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 disabled:opacity-30 text-red-500"
                    title="Remove paragraph"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-4 bg-white dark:bg-gray-800">
                <div>
                  <label className="block text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-1">
                    Topic Sentence
                  </label>
                  <textarea
                    value={para.topicSentence}
                    onChange={(e) => updateBody(bIdx, 'topicSentence', e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
                      Supporting Evidence / Examples
                    </label>
                    <button
                      onClick={() => addEvidence(bIdx)}
                      className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {para.evidence.map((ev, eIdx) => (
                      <div key={ev.id} className="flex gap-2">
                        <span className="mt-2 text-xs text-gray-400 font-mono w-4 shrink-0">
                          {eIdx + 1}.
                        </span>
                        <input
                          type="text"
                          value={ev.text}
                          onChange={(e) => updateEvidence(bIdx, eIdx, e.target.value)}
                          placeholder={`Evidence or example ${eIdx + 1}...`}
                          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => removeEvidence(bIdx, eIdx)}
                          disabled={para.evidence.length <= 1}
                          className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900 disabled:opacity-30 text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-1">
                    Analysis / Explanation
                  </label>
                  <textarea
                    value={para.analysis}
                    onChange={(e) => updateBody(bIdx, 'analysis', e.target.value)}
                    rows={2}
                    placeholder="Explain how the evidence supports your topic sentence..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-1">
                    Transition Sentence
                  </label>
                  <input
                    type="text"
                    value={para.transition}
                    onChange={(e) => updateBody(bIdx, 'transition', e.target.value)}
                    placeholder="Write a sentence that connects to the next paragraph..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>
          ))}

          {/* Add Body Paragraph */}
          {outline.body.length < 7 && (
            <button
              onClick={addBodyParagraph}
              className="w-full py-3 rounded-xl border-2 border-dashed border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 flex items-center justify-center gap-2 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Body Paragraph
            </button>
          )}

          {/* Conclusion */}
          <section className="rounded-xl border-2 border-purple-300 dark:border-purple-700 overflow-hidden">
            <div className="bg-purple-100 dark:bg-purple-900/50 px-5 py-3">
              <h3 className="font-bold text-purple-800 dark:text-purple-200">
                {toRoman(outline.body.length + 2)}. Conclusion
              </h3>
            </div>
            <div className="p-5 space-y-4 bg-white dark:bg-gray-800">
              <div>
                <label className="block text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">
                  Restate Thesis
                </label>
                <textarea
                  value={outline.restateThesis}
                  onChange={(e) => updateOutlineField('restateThesis', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">
                  Summary of Main Points
                </label>
                <textarea
                  value={outline.summary}
                  onChange={(e) => updateOutlineField('summary', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">
                  Final Thought / Call to Action
                </label>
                <textarea
                  value={outline.finalThought}
                  onChange={(e) => updateOutlineField('finalThought', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
