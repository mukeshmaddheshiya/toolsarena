'use client';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { CopyButton } from '@/components/common/CopyButton';

const NICHES = ['Education', 'Entertainment', 'Tech', 'Gaming', 'Finance', 'Food', 'Travel', 'Fitness', 'Music', 'News', 'Other'];

const INTRO_TEMPLATES = [
  (title: string, topic: string, keyword: string) =>
    `In this video, we dive deep into ${title}. ${topic} If you've been searching for everything about ${keyword}, you're in the right place.`,
  (title: string, topic: string, keyword: string) =>
    `Welcome! Today we're covering ${title}. ${topic} Whether you're a beginner or advanced, this guide on ${keyword} has everything you need.`,
  (title: string, topic: string, keyword: string) =>
    `Get ready to master ${keyword}! In this video about ${title}, we break it all down. ${topic}`,
  (title: string, topic: string, keyword: string) =>
    `Everything you need to know about ${keyword} is right here. ${topic} Watch this full video on ${title} to get the complete picture.`,
];

const CTA_TEMPLATES = [
  (channel: string) =>
    `If you found this video helpful, please LIKE and SUBSCRIBE to ${channel} for more content like this! Hit the BELL icon so you never miss an upload. Leave a COMMENT below with your thoughts or questions — I read every single one!`,
  (channel: string) =>
    `Did this video help you? Give it a THUMBS UP and SUBSCRIBE to ${channel}! Drop your questions in the COMMENTS and I'll reply. Don't forget to share this with someone who needs it!`,
  (channel: string) =>
    `SUBSCRIBE to ${channel} for weekly uploads! If this video added value, smash that LIKE button. Share your experience in the COMMENTS — I'd love to hear from you!`,
];

function generateHashtags(title: string, keyword: string, secondaryKeywords: string[], niche: string): string {
  const words = [keyword, ...secondaryKeywords, niche]
    .filter(Boolean)
    .map(w => w.trim().replace(/\s+/g, ''))
    .filter(w => w.length > 0);

  const titleWords = title
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 5)
    .map(w => w.replace(/[^a-zA-Z0-9]/g, ''));

  const allTags = [...new Set([...words, ...titleWords, niche.replace(/\s+/g, '')])].slice(0, 15);
  return allTags.map(t => `#${t}`).join(' ');
}

function generateBullets(topic: string, keyword: string, secondaryKeywords: string[]): string[] {
  const bullets: string[] = [];

  // Derive bullets from the actual topic/summary text if provided
  if (topic) {
    // Split topic into sentences and use the first 2 as actionable bullet points
    const topicSentences = topic
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);
    if (topicSentences[0]) bullets.push(topicSentences[0]);
    if (topicSentences[1]) bullets.push(topicSentences[1]);
  }

  // Fill remaining slots with keyword-based bullets
  if (bullets.length < 4 && keyword) bullets.push(`What is ${keyword} and why it matters`);
  if (bullets.length < 4 && secondaryKeywords[0]) bullets.push(`How to use ${secondaryKeywords[0]} effectively`);
  if (bullets.length < 4 && secondaryKeywords[1]) bullets.push(`Tips and tricks for ${secondaryKeywords[1]}`);
  if (bullets.length < 4 && secondaryKeywords[2]) bullets.push(`Common mistakes to avoid with ${secondaryKeywords[2]}`);
  if (bullets.length < 4) bullets.push(`Key takeaways and next steps`);

  return bullets.slice(0, 4);
}

function buildDescription(
  title: string,
  topic: string,
  keyword: string,
  secondaryKeywords: string[],
  channelName: string,
  niche: string,
  introIndex: number,
  ctaIndex: number
): string {
  if (!title && !topic && !keyword) return '';

  const intro = INTRO_TEMPLATES[introIndex % INTRO_TEMPLATES.length](title, topic, keyword);
  const bullets = generateBullets(topic, keyword, secondaryKeywords);
  const bulletText = bullets.map(b => `• ${b}`).join('\n');

  const timestamps = `📌 TIMESTAMPS\n0:00 Intro\n1:00 ${keyword || 'Main Topic'}\n3:00 Deep Dive\n7:00 Tips & Tricks\n10:00 Summary & Outro`;

  const cta = CTA_TEMPLATES[ctaIndex % CTA_TEMPLATES.length](channelName || 'our channel');

  const links = `📲 CONNECT WITH US\n🌐 Website: https://yourwebsite.com\n📸 Instagram: https://instagram.com/yourchannel\n🐦 Twitter/X: https://twitter.com/yourchannel\n💼 LinkedIn: https://linkedin.com/in/yourprofile`;

  const hashtags = generateHashtags(title, keyword, secondaryKeywords, niche);

  return [
    intro,
    '',
    `📚 WHAT YOU'LL LEARN`,
    bulletText,
    '',
    timestamps,
    '',
    cta,
    '',
    links,
    '',
    hashtags,
  ].join('\n');
}

export function YoutubeDescriptionGeneratorTool() {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');
  const [secondary, setSecondary] = useState(['', '', '']);
  const [channelName, setChannelName] = useState('');
  const [niche, setNiche] = useState('Education');
  const [introIndex, setIntroIndex] = useState(0);
  const [ctaIndex, setCtaIndex] = useState(0);

  const description = buildDescription(title, topic, keyword, secondary, channelName, niche, introIndex, ctaIndex);
  const charCount = description.length;

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-100';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  function handleSecondary(i: number, val: string) {
    setSecondary(prev => prev.map((v, idx) => (idx === i ? val : v)));
  }

  function regenerate() {
    setIntroIndex(i => (i + 1) % INTRO_TEMPLATES.length);
    setCtaIndex(i => (i + 1) % CTA_TEMPLATES.length);
  }

  return (
    <div className="space-y-6">
      {/* Inputs grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Video Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. How to Learn Python in 30 Days"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Channel Name</label>
          <input
            type="text"
            value={channelName}
            onChange={e => setChannelName(e.target.value)}
            placeholder="e.g. TechWithMike"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Video Topic / Summary (2–3 sentences)</label>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. This video walks through a complete Python crash course for beginners. We cover variables, loops, functions, and build a small project."
            rows={3}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Main Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="e.g. learn python"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Niche / Category</label>
          <select value={niche} onChange={e => setNiche(e.target.value)} className={inputClass}>
            {NICHES.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Secondary Keywords (up to 3)</label>
          <div className="grid sm:grid-cols-3 gap-3">
            {secondary.map((s, i) => (
              <input
                key={i}
                type="text"
                value={s}
                onChange={e => handleSecondary(i, e.target.value)}
                placeholder={`Keyword ${i + 1}`}
                className={inputClass}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Output */}
      {description && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${charCount > 5000 ? 'text-red-600 dark:text-red-400' : charCount > 4000 ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {charCount.toLocaleString()} / 5,000 characters
              </span>
              {charCount <= 500 && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                  ~{charCount} visible above fold
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={regenerate}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
              <CopyButton text={description} label="Copy Description" />
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
              {description}
            </pre>
          </div>
        </div>
      )}

      {!description && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-sm">Fill in the fields above to generate your YouTube description.</p>
        </div>
      )}
    </div>
  );
}
