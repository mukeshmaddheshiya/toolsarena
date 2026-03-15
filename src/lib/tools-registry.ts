import type { Tool, ToolCategory, CategoryInfo } from '@/types/tools';

export type { Tool, ToolCategory, CategoryInfo };

export const categories: Record<ToolCategory, CategoryInfo> = {
  'image-tools': {
    name: 'Image Tools',
    description: 'Compress, resize, convert and optimize images online for free. No signup required.',
    icon: 'Image',
    color: 'from-purple-500 to-pink-500',
  },
  'pdf-tools': {
    name: 'PDF Tools',
    description: 'Merge, split, compress and convert PDF files instantly in your browser.',
    icon: 'FileText',
    color: 'from-red-500 to-orange-500',
  },
  'text-tools': {
    name: 'Text Tools',
    description: 'Count words, change case, generate lorem ipsum and more text utilities.',
    icon: 'Type',
    color: 'from-blue-500 to-cyan-500',
  },
  'calculators': {
    name: 'Calculators',
    description: 'Free online calculators for EMI, SIP, GST, BMI, age and percentage.',
    icon: 'Calculator',
    color: 'from-green-500 to-teal-500',
  },
  'developer-tools': {
    name: 'Developer Tools',
    description: 'JSON formatter, Base64 encoder, regex tester, QR code generator and more.',
    icon: 'Code2',
    color: 'from-slate-600 to-slate-800',
  },
  'converters': {
    name: 'Converters',
    description: 'Convert units, temperatures, timestamps and numbers instantly online.',
    icon: 'ArrowLeftRight',
    color: 'from-amber-500 to-yellow-500',
  },
  'utility-tools': {
    name: 'Utility Tools',
    description: 'Everyday utility tools — timers, random generators, and more.',
    icon: 'Wrench',
    color: 'from-sky-500 to-cyan-500',
  },
  'seo-tools': {
    name: 'SEO Tools',
    description: 'Generate meta tags, sitemaps, and optimize your website for search engines.',
    icon: 'Search',
    color: 'from-violet-500 to-purple-500',
  },
  'cricket-tools': {
    name: 'Cricket Tools',
    description: 'IPL 2026 squad explorer, match schedule, player comparison and points table. Free fan tools.',
    icon: 'Trophy',
    color: 'from-orange-500 to-yellow-500',
  },
};

export const tools: Tool[] = [
  // ─── TEXT TOOLS ───────────────────────────────────────────────────────────
  {
    slug: 'word-counter',
    name: 'Word Counter',
    shortDescription: 'Count words, characters, sentences and paragraphs in real time.',
    longDescription: `<p>Our free online <strong>word counter</strong> tool gives you instant, accurate counts of words, characters (with and without spaces), sentences, and paragraphs as you type. Whether you're working on an essay, blog post, social media update, or any document with a character limit, this tool has you covered.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Real-Time Counting</strong>: Word, character, sentence, and paragraph counts update instantly as you type.</li>
<li><strong>Reading Time Estimate</strong>: Calculates reading time at 200 words per minute — perfect for blog posts and speeches.</li>
<li><strong>Speaking Time</strong>: Estimates speaking time at 130 words per minute for presentations and podcasts.</li>
<li><strong>No Limits</strong>: Handles 100,000+ words without performance issues.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Writers crafting essays, bloggers checking post length, students meeting assignment word limits, social media managers staying within platform character limits (Twitter: 280, Instagram: 2,200, LinkedIn: 3,000), and anyone preparing speeches or presentations.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored. Your text never leaves your device.</p>`,
    category: 'text-tools',
    targetKeyword: 'word counter',
    secondaryKeywords: ['character counter', 'word count tool', 'online word counter', 'count words online', 'word count checker', 'word counter online', 'word counter free', 'word character counter', 'words count tool online', 'paragraph counter online'],
    metaTitle: 'Word Counter - Count Words & Characters Online Free',
    metaDescription: 'Count words, characters, sentences & paragraphs instantly. Free online word counter with reading time & speaking time estimate. No signup, works in real time.',
    faqs: [
      { question: 'How accurate is the word counter?', answer: 'Our word counter uses the same word-splitting algorithm as most word processors — it counts any sequence of characters separated by spaces or punctuation as a word, giving you results identical to Microsoft Word or Google Docs.' },
      { question: 'Does the word counter save my text?', answer: 'No. Your text is processed entirely in your browser and never sent to any server. Your content is 100% private.' },
      { question: 'What is the character limit?', answer: 'There is no practical limit. The tool handles very large texts (100,000+ words) without performance issues.' },
      { question: 'How is reading time calculated?', answer: 'Reading time is estimated at 238 words per minute, which is the research-backed average adult silent reading speed. Speaking time uses 130 words per minute. For a more detailed breakdown with custom WPM, try our Reading Time Calculator.' },
      { question: 'Can I use this for social media character limits?', answer: 'Yes! Twitter/X allows 280 characters, Instagram captions up to 2,200, and LinkedIn posts up to 3,000 characters. Use our character count to stay within limits.' },
    ],
    howToSteps: [
      'Paste or type your text into the text box above.',
      'Word, character, sentence, and paragraph counts update instantly in real time.',
      'Check the reading time and speaking time estimates below the counts.',
      'Use the "Clear" button to reset and start fresh.',
      'Copy any count by clicking on the number.',
    ],
    relatedToolSlugs: ['reading-time-calculator', 'character-counter', 'case-converter', 'lorem-ipsum-generator', 'text-to-slug'],
    icon: 'AlignLeft',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'character-counter',
    name: 'Character Counter',
    shortDescription: 'Count characters with and without spaces, words, and lines instantly.',
    longDescription: `<p>The <strong>character counter</strong> tool provides a precise count of every character in your text — including spaces, punctuation, and special characters. This is essential for meeting strict character limits on platforms like Twitter (280), SMS (160), meta descriptions (155), and ad copy.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Characters With & Without Spaces</strong>: See both totals for complete flexibility.</li>
<li><strong>Full Content Breakdown</strong>: Word count, line count, and paragraph count displayed together.</li>
<li><strong>Emoji Support</strong>: Correctly counts emojis, including their platform-specific character values.</li>
<li><strong>No Practical Limit</strong>: Handles large documents without slowdown.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Social media managers checking Twitter, SMS, and Instagram limits; SEO professionals optimizing meta descriptions (120–155 characters); copywriters working on ad copy with strict character budgets; and developers testing input field lengths.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored. Your text never leaves your device.</p>`,
    category: 'text-tools',
    targetKeyword: 'character counter',
    secondaryKeywords: ['char counter', 'count characters online', 'letter counter', 'character count tool', 'text length counter'],
    metaTitle: 'Character Counter - Count Characters & Words Online Free',
    metaDescription: 'Count characters with & without spaces instantly. Free online character counter for Twitter, SMS, meta descriptions & more. Real-time, no signup.',
    faqs: [
      { question: 'What is the difference between characters with and without spaces?', answer: 'Characters with spaces counts every keystroke including spaces, tabs, and newlines. Characters without spaces counts only visible non-whitespace characters, useful for strict letter-only limits.' },
      { question: 'What is Twitter\'s character limit?', answer: 'Twitter/X allows 280 characters per tweet. URLs count as 23 characters regardless of their actual length.' },
      { question: 'What is the SMS character limit?', answer: 'A single SMS message supports 160 characters. Messages longer than 160 characters are split into multiple SMS messages, each costing extra.' },
      { question: 'How many characters should a meta description be?', answer: 'Google typically displays 150–160 characters in search results. We recommend keeping your meta description between 120 and 155 characters for best visibility.' },
      { question: 'Does this tool count emojis correctly?', answer: 'Yes, emojis are counted. Note that most emojis use 2 bytes (some use 4), and platforms like Twitter count emojis as 2 characters.' },
    ],
    howToSteps: [
      'Type or paste your text into the input box.',
      'Character counts update instantly as you type.',
      'See the breakdown: total characters, without spaces, words, and lines.',
      'Compare against the character limits for your target platform.',
      'Clear the text and start over with the reset button.',
    ],
    relatedToolSlugs: ['word-counter', 'case-converter', 'lorem-ipsum-generator', 'text-to-slug'],
    icon: 'Hash',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    shortDescription: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case and more.',
    longDescription: `<p>The <strong>case converter</strong> tool lets you instantly transform any text between 8 different letter cases: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case. Invaluable for developers naming variables, writers fixing copy-pasted text, or anyone reformatting text quickly.</p>
<h2>Key Features</h2>
<ul>
<li><strong>8 Case Formats</strong>: UPPER, lower, Title, Sentence, camelCase, PascalCase, snake_case, kebab-case.</li>
<li><strong>Instant Conversion</strong>: Results appear as soon as you click a format button — zero latency.</li>
<li><strong>Large Text Support</strong>: Handles entire documents with thousands of words without slowdown.</li>
<li><strong>One-Click Copy</strong>: Copy converted text to clipboard immediately.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers converting variable names between programming languages (camelCase for JavaScript, snake_case for Python, kebab-case for CSS); writers and editors fixing incorrectly capitalized text; content creators properly titling headings and articles.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored. Your text never leaves your device.</p>`,
    category: 'text-tools',
    targetKeyword: 'case converter',
    secondaryKeywords: ['text case converter', 'uppercase converter', 'camelcase converter', 'snake case converter', 'title case converter online'],
    metaTitle: 'Case Converter - UPPER, lower, camelCase, snake_case Online',
    metaDescription: 'Convert text to uppercase, lowercase, title case, camelCase, snake_case & more. Free online case converter tool. Instant results, no signup needed.',
    faqs: [
      { question: 'What is camelCase?', answer: 'camelCase writes compound words with no spaces, starting with a lowercase letter, and capitalizing the first letter of each subsequent word. Example: "my variable name" → "myVariableName". Used widely in JavaScript and Java.' },
      { question: 'What is the difference between snake_case and kebab-case?', answer: 'snake_case uses underscores to separate words (e.g., my_variable_name) and is common in Python. kebab-case uses hyphens (e.g., my-variable-name) and is used in CSS class names and URLs.' },
      { question: 'What is Title Case?', answer: 'Title Case capitalizes the first letter of every major word. Minor words like "a", "the", "and", "of" are kept lowercase unless they start the title. Example: "the quick brown fox" → "The Quick Brown Fox".' },
      { question: 'Can I convert a whole document?', answer: 'Yes, you can paste an entire document. The tool handles large texts with thousands of words without any slowdown.' },
      { question: 'What is PascalCase?', answer: 'PascalCase (also called UpperCamelCase) capitalizes the first letter of every word. Example: "my class name" → "MyClassName". Commonly used for class names in Java, C#, and TypeScript.' },
    ],
    howToSteps: [
      'Paste or type your text in the input box.',
      'Click any of the 8 conversion buttons: UPPER, lower, Title, Sentence, camelCase, PascalCase, snake_case, or kebab-case.',
      'The converted text appears instantly in the output box.',
      'Click "Copy" to copy the result to your clipboard.',
      'Use "Clear" to reset and convert different text.',
    ],
    relatedToolSlugs: ['word-counter', 'text-to-slug', 'lorem-ipsum-generator', 'remove-duplicate-lines'],
    icon: 'CaseSensitive',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    shortDescription: 'Generate placeholder lorem ipsum text by paragraphs, sentences, or words.',
    longDescription: `<p>Our <strong>Lorem Ipsum generator</strong> creates authentic, randomized placeholder text in seconds — the de facto dummy text used in publishing, graphic design, web development, and UI/UX prototyping since the 1500s. Fill your designs with realistic content before real copy is ready.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Three Generation Modes</strong>: Generate by paragraphs, sentences, or a specific word count.</li>
<li><strong>Classic or Random Start</strong>: Toggle to always begin with the classic "Lorem ipsum dolor sit amet…" phrase.</li>
<li><strong>Up to 100 Paragraphs</strong>: Generate large amounts of placeholder text in one click.</li>
<li><strong>Unique Each Time</strong>: The Cicero-derived text is shuffled so output never looks repetitive.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Web designers building mockups, developers testing layouts, graphic designers creating brochure and print templates, and UX designers prototyping interfaces — anyone who needs realistic-looking placeholder content before real copy is available.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'text-tools',
    targetKeyword: 'lorem ipsum generator',
    secondaryKeywords: ['placeholder text generator', 'dummy text generator', 'lorem ipsum online', 'generate lorem ipsum', 'fake text generator'],
    metaTitle: 'Lorem Ipsum Generator - Free Placeholder Text Online',
    metaDescription: 'Generate lorem ipsum placeholder text by paragraphs, sentences or words. Free online tool. Start with classic or random text. Copy in one click.',
    faqs: [
      { question: 'What is Lorem Ipsum?', answer: 'Lorem ipsum is placeholder text derived from a Latin work by Cicero (45 BC). It has been the industry standard dummy text for printing and typesetting since the 1960s when it was popularized by Letraset sheets.' },
      { question: 'Why do designers use Lorem Ipsum?', answer: 'Designers use it because readable text distracts viewers from evaluating layout and design. Lorem ipsum\'s pseudo-Latin is meaningless, so viewers focus on typography, spacing, and visual hierarchy instead.' },
      { question: 'Can I generate custom length text?', answer: 'Yes! You can specify the exact number of paragraphs (1-100), sentences, or words. This gives you precise control over how much placeholder content you need.' },
      { question: 'Is the generated text always the same?', answer: 'No. While all variations are based on the classic Cicero text, the sentences and paragraphs are randomized each time, so you get unique placeholder text with every generation.' },
      { question: 'Can I start with "Lorem ipsum dolor sit amet"?', answer: 'Yes, toggle the "Start with Lorem ipsum" option to always begin with the classic opening phrase.' },
    ],
    howToSteps: [
      'Select your generation type: Paragraphs, Sentences, or Words.',
      'Enter the quantity you need (e.g., 5 paragraphs).',
      'Toggle "Start with Lorem ipsum" if you want the classic opening.',
      'Click "Generate" to create your placeholder text.',
      'Click "Copy" to copy all generated text to your clipboard.',
    ],
    relatedToolSlugs: ['word-counter', 'character-counter', 'case-converter', 'text-to-slug'],
    icon: 'FileText',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'text-to-slug',
    name: 'Text to Slug',
    shortDescription: 'Convert any text into a clean, SEO-friendly URL slug instantly.',
    longDescription: `<p>Our <strong>text to slug converter</strong> instantly transforms any title, phrase, or heading into a clean, SEO-friendly URL slug. A URL slug — the human-readable part of a web address like "text-to-slug" — is a crucial on-page SEO factor that helps search engines understand page topics and improves click-through rates.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Full Slug Normalization</strong>: Converts to lowercase, replaces spaces with hyphens, removes special characters and accents.</li>
<li><strong>Stop Word Removal</strong>: Optionally strips common words (the, a, and, of) to keep URLs short and keyword-focused.</li>
<li><strong>No Double Hyphens</strong>: Automatically cleans up consecutive or leading/trailing hyphens.</li>
<li><strong>Instant Output</strong>: Slug generated in real time as you type.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Bloggers and content creators setting post URLs, SEO professionals optimizing permalinks, developers building CMS systems, and anyone using WordPress, Shopify, or custom web platforms that require clean URL slugs.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'text-tools',
    targetKeyword: 'text to slug converter',
    secondaryKeywords: ['url slug generator', 'slug converter', 'seo friendly url generator', 'permalink generator', 'string to slug'],
    metaTitle: 'Text to Slug Converter - Free URL Slug Generator Online',
    metaDescription: 'Convert any text into an SEO-friendly URL slug instantly. Free online slug generator — removes special chars, converts spaces to hyphens. No signup.',
    faqs: [
      { question: 'What is a URL slug?', answer: 'A URL slug is the human-readable part of a URL that identifies a page. For example, in "example.com/blog/my-first-post", the slug is "my-first-post". Good slugs are short, descriptive, and use hyphens to separate words.' },
      { question: 'Should I use hyphens or underscores in slugs?', answer: 'Always use hyphens (-). Google treats hyphens as word separators, making it easier to understand your URL. Underscores (_) are treated as word joiners, so "my_page" is read as one word "mypage" by Google.' },
      { question: 'What characters should be removed from slugs?', answer: 'Remove all special characters except hyphens: no spaces (replace with -), no punctuation, no accented characters (convert to ASCII equivalents), no uppercase letters. Keep only a-z, 0-9, and hyphens.' },
      { question: 'How long should a URL slug be?', answer: 'Keep slugs under 60 characters for best SEO. Include your primary keyword and remove unnecessary words. Shorter slugs are easier to share and remember.' },
      { question: 'Should I remove stop words from slugs?', answer: 'It depends. For SEO, removing common stop words (the, a, and, or, in, of) shortens the URL and emphasizes keywords. However, if the stop word is part of a brand name or proper noun, keep it.' },
    ],
    howToSteps: [
      'Type or paste your text (title, heading, phrase) into the input.',
      'The slug is generated instantly below.',
      'Toggle options like "Remove stop words" or "Lowercase only" to customize.',
      'Click "Copy" to copy the slug to your clipboard.',
      'Use the slug in your CMS, blog, or web application.',
    ],
    relatedToolSlugs: ['case-converter', 'word-counter', 'url-encode-decode', 'html-to-markdown'],
    icon: 'Link',
    estimatedTime: 'Instant',
  },
  {
    slug: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    shortDescription: 'Remove duplicate lines from text, sort lines, and clean up lists instantly.',
    longDescription: `<p>The <strong>remove duplicate lines</strong> tool quickly cleans up any text by eliminating repeated lines. With options to sort alphabetically, ignore case, trim whitespace, and remove blank lines, it handles spreadsheet exports, email lists, keyword lists, and log files in under a second.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Instant Deduplication</strong>: Removes repeated lines while preserving original order by default.</li>
<li><strong>Case-Insensitive Matching</strong>: Optionally treat "Apple" and "apple" as duplicates.</li>
<li><strong>Whitespace Trimming</strong>: Normalize lines before comparing so "  apple  " matches "apple".</li>
<li><strong>Blank Line Removal</strong>: Strip empty lines from output in the same pass.</li>
<li><strong>Large Input Support</strong>: Handles 500,000+ lines entirely in your browser.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Data analysts cleaning exported CSVs, SEO professionals deduplicating keyword lists, developers filtering log outputs, and marketers cleaning email subscriber lists — anyone who needs fast, reliable text deduplication.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'text-tools',
    targetKeyword: 'remove duplicate lines',
    secondaryKeywords: ['deduplicate text online', 'remove duplicate text', 'unique lines extractor', 'text deduplication tool', 'remove repeated lines'],
    metaTitle: 'Remove Duplicate Lines - Free Online Text Deduplication Tool',
    metaDescription: 'Remove duplicate lines from text instantly. Sort, deduplicate, trim & clean lists online for free. No signup. Handles large inputs. Privacy-first.',
    faqs: [
      { question: 'Does the tool preserve the original order of lines?', answer: 'Yes, by default the tool keeps lines in their original order and removes subsequent duplicates. Enable "Sort lines" to alphabetically sort the output.' },
      { question: 'Is the comparison case-sensitive?', answer: 'By default, the comparison is case-sensitive, so "Apple" and "apple" are treated as different lines. Enable "Ignore case" to treat them as duplicates.' },
      { question: 'Can I remove blank lines too?', answer: 'Yes! Enable the "Remove blank lines" option to strip out all empty lines from the output along with duplicates.' },
      { question: 'What is the maximum input size?', answer: 'The tool can handle very large inputs (500,000+ lines) since all processing is done locally in your browser memory.' },
      { question: 'Will leading or trailing spaces affect matching?', answer: 'Only if whitespace trimming is disabled. Enable "Trim whitespace" to normalize lines before comparing, so "  apple  " matches "apple".' },
    ],
    howToSteps: [
      'Paste your text with duplicate lines into the input box.',
      'Configure options: case sensitivity, sort order, trim whitespace, remove blanks.',
      'Click "Remove Duplicates" to process the text.',
      'Review the cleaned output and the count of removed duplicates.',
      'Click "Copy" to copy the result to your clipboard.',
    ],
    relatedToolSlugs: ['word-counter', 'case-converter', 'text-to-slug', 'character-counter'],
    icon: 'ListFilter',
    estimatedTime: 'Instant',
  },

  {
    slug: 'hook-caption-scorer',
    name: 'Hook & Caption Scorer',
    shortDescription: 'Score your hooks, captions & headlines on 5 dimensions. Get actionable tips to boost engagement.',
    longDescription: `<p>Rate any hook, caption, or headline with our free <strong>hook scorer</strong>. The tool analyzes your text across 5 proven engagement dimensions — Power Words, Emotional Trigger, Clarity, Curiosity Gap, and Specificity — and gives you an overall score from 0 to 100 with actionable improvement tips.</p>
<h2>Key Features</h2>
<ul>
<li><strong>5-Dimension Scoring</strong>: Power Words, Emotional Trigger, Clarity, Curiosity Gap, and Specificity — each scored 0–20.</li>
<li><strong>Platform Context</strong>: Adjusts ideal length targets and tone for YouTube, Instagram, Twitter/X, Blog, Email, TikTok, or LinkedIn.</li>
<li><strong>200+ Power Words Database</strong>: Checks urgency, emotion, value, curiosity, authority, and action words.</li>
<li><strong>Actionable Suggestions</strong>: Get 3–5 specific tips to improve your score after every analysis.</li>
<li><strong>Score History</strong>: Last 5 scored hooks saved in your browser so you can compare iterations.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Content creators writing YouTube titles and TikTok hooks, social media managers crafting Instagram captions, email marketers optimizing subject lines, and bloggers improving headline click-through rates.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no AI, no API calls, no data sent to any server. Instant, private, and free.</p>`,
    category: 'text-tools',
    targetKeyword: 'hook scorer',
    secondaryKeywords: ['caption scorer', 'headline analyzer', 'hook rating tool', 'caption analyzer', 'headline score', 'engagement scorer', 'hook grader', 'caption grader', 'title scorer', 'youtube title scorer'],
    metaTitle: 'Hook & Caption Scorer - Rate Your Headlines & Captions | Free',
    metaDescription: 'Score your hooks, captions & headlines on 5 dimensions. Get actionable suggestions to boost engagement. Free online tool — no signup, instant results.',
    faqs: [
      { question: 'How does the scoring work?', answer: 'The scorer analyzes your text across 5 dimensions: Power Words (emotional/action words), Emotional Trigger (impact and feeling), Clarity (readability and optimal length), Curiosity Gap (questions and open loops), and Specificity (numbers, data, named entities). Each dimension scores 0-20, totaling 0-100.' },
      { question: 'What is a good hook score?', answer: 'A score above 70 is considered strong and likely to drive engagement. 40-70 is decent but has room for improvement. Below 40 means your hook needs significant work. Most viral hooks score 75+.' },
      { question: 'Does the platform selection matter?', answer: 'Yes! Each platform has different ideal lengths, emoji preferences, and tone expectations. A YouTube title should be 40-65 characters, while an email subject line works best at 30-50 characters. The scorer adjusts accordingly.' },
      { question: 'Is this tool using AI?', answer: 'No. The scorer uses a rule-based algorithm with a curated database of 200+ power words, pattern matching for curiosity gaps, and platform-specific length checks. All processing happens instantly in your browser — no API calls or AI involved.' },
      { question: 'Is my text private?', answer: 'Yes. Everything runs 100% in your browser. Your text is never sent to any server. History is stored in your browser\'s localStorage only.' },
    ],
    howToSteps: [
      'Select your platform context (YouTube, Instagram, Twitter, etc.).',
      'Type or paste your hook, caption, or headline in the text area.',
      'View your real-time score across 5 engagement dimensions.',
      'Read the actionable suggestions to improve your score.',
      'Click "Copy Report" to share your score breakdown.',
    ],
    relatedToolSlugs: ['word-counter', 'ai-text-humanizer', 'case-converter', 'character-counter'],
    icon: 'Target',
    isNew: true,
    estimatedTime: 'Instant',
  },

  // ─── CALCULATORS ──────────────────────────────────────────────────────────
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    shortDescription: 'Calculate your exact age in years, months, days and hours from date of birth.',
    longDescription: `<p>Our free <strong>age calculator</strong> gives you your exact age down to the day — enter your date of birth and instantly see your age in years, months, days, hours, minutes, and seconds. You'll also see how many days until your next birthday and what day of the week you were born on.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Exact Age Breakdown</strong>: View age in years, months, days, hours, and minutes simultaneously.</li>
<li><strong>Leap Year Accurate</strong>: Correctly handles February 29 birthdays and all leap year calculations.</li>
<li><strong>Birthday Countdown</strong>: Shows the exact number of days until your next birthday.</li>
<li><strong>Day of Birth</strong>: Reveals what day of the week you were born.</li>
<li><strong>Any Two Dates</strong>: Calculate the age of anything — a car, a company, a project — using custom dates.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Anyone filling out official forms, verifying age eligibility, calculating retirement milestones, parents tracking children's ages, or simply curious about their exact age in days, hours, and minutes.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'calculators',
    targetKeyword: 'age calculator',
    secondaryKeywords: ['age calculator online', 'date of birth age calculator', 'calculate my age', 'exact age calculator', 'age from date of birth', 'birthday age calculator', 'age calculator by date of birth', 'online age calculator India', 'how old am I calculator', 'age in days calculator'],
    metaTitle: 'Age Calculator Online - Calculate Exact Age from Date of Birth',
    metaDescription: 'Calculate your exact age in years, months, days, hours & minutes from date of birth. Days until next birthday. Free online age calculator — instant, no signup.',
    faqs: [
      { question: 'How does the age calculator handle leap years?', answer: 'The calculator correctly accounts for leap years (years divisible by 4, with century-year exceptions). A leap year has 366 days, which affects the day count for anyone born on or after February 29.' },
      { question: 'What if I was born on February 29 (leap day)?', answer: 'Leap day birthdays are handled correctly. In non-leap years, your birthday is considered to fall on February 28 or March 1 depending on convention. Our calculator uses February 28.' },
      { question: 'Can I calculate the age between two custom dates?', answer: 'Yes! You can change both the "Date of Birth" and "As of Date" fields to calculate the time between any two dates — not just from birth to today.' },
      { question: 'How is age calculated officially?', answer: 'In most countries, age is calculated by counting completed years from birth to the current date. If your birthday hasn\'t occurred yet this year, you are still the age you turned on your last birthday.' },
      { question: 'What day of the week was I born on?', answer: 'The calculator shows the day of the week for your date of birth using the Zeller\'s congruence algorithm, which is accurate for any date from 1582 onward (Gregorian calendar).' },
    ],
    howToSteps: [
      'Enter your date of birth using the date picker.',
      'The "As of date" defaults to today — change it for historical calculations.',
      'Click "Calculate Age" to see your exact age.',
      'View your age in years, months, days, hours, and minutes.',
      'Check the countdown to your next birthday and the day you were born.',
    ],
    relatedToolSlugs: ['timestamp-converter', 'percentage-calculator', 'bmi-calculator', 'emi-calculator'],
    icon: 'CalendarDays',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'text-compare',
    name: 'Text Compare Tool',
    shortDescription: 'Compare two texts side-by-side with word-level highlighting, file upload, and instant diff.',
    longDescription: `<p>The most powerful free <strong>text compare tool</strong> online. Compare two texts side-by-side with line, word, or character-level precision, complete with color-coded diff highlighting, similarity percentage, and one-click PNG export. All processing happens in your browser — your text never leaves your device.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Three Diff Modes</strong>: Line, Word, or Character-level comparison with inline highlighting.</li>
<li><strong>File Upload</strong>: Drag-and-drop .txt, .md, .json, .csv, .js, .py, and many more file types.</li>
<li><strong>Ignore Options</strong>: Ignore case, whitespace, punctuation, or line order for flexible comparisons.</li>
<li><strong>Navigate Changes</strong>: Jump between differences with arrow buttons or Alt+Up/Down shortcuts.</li>
<li><strong>Export as PNG</strong>: Download a screenshot of the diff for sharing or documentation.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers reviewing code changes, writers comparing document revisions, QA engineers checking test outputs, content editors tracking changes, and anyone who needs to quickly find differences between two pieces of text.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored. Your text never leaves your device.</p>`,
    category: 'text-tools',
    targetKeyword: 'text compare online',
    secondaryKeywords: ['text diff checker', 'compare two texts online', 'text comparison tool', 'find differences in text', 'diff tool online free', 'text compare tool', 'online diff checker', 'compare text files'],
    metaTitle: 'Text Compare Tool - Compare Two Texts Online Free | Diff Checker',
    metaDescription: 'Compare two texts side-by-side with word-level highlighting. Upload files, ignore case/whitespace, navigate changes, export as PNG. Free online text diff tool — 100% private, runs in your browser.',
    faqs: [
      { question: 'What diff modes are available?', answer: 'Three modes: Line (compares whole lines), Word (highlights exact words that differ within each line), and Character (shows character-by-character differences). Word mode is the default and most useful for most cases.' },
      { question: 'Can I upload files to compare?', answer: 'Yes! Click the upload icon or drag and drop text files (.txt, .md, .json, .csv, .js, .py, .html, .css, and many more) directly onto either input panel.' },
      { question: 'What do the ignore options do?', answer: 'Case: treats "Hello" and "hello" as equal. Whitespace: ignores extra spaces, tabs, and trailing whitespace. Punctuation: ignores commas, periods, etc. Line Order: sorts lines before comparing, useful when order doesn\'t matter.' },
      { question: 'What does the similarity percentage mean?', answer: 'It shows what percentage of lines are unchanged between the two texts. 100% means identical, 0% means completely different.' },
      { question: 'Is my text sent to a server?', answer: 'No. All comparison happens entirely in your browser using JavaScript. Your text never leaves your device — it is 100% private.' },
      { question: 'How do I navigate between changes?', answer: 'Use the up/down arrows in the toolbar, or press Alt+Up and Alt+Down keyboard shortcuts to jump between changes.' },
      { question: 'Can I compare code files?', answer: 'Absolutely. The tool works great for code — it uses a monospace font, shows line numbers, and the word-level diff highlights exactly which variables or values changed.' },
      { question: 'Can I export the diff result?', answer: 'Yes. Click "Copy" for plain text diff output, or "PNG" to download a screenshot of the diff result.' },
    ],
    howToSteps: ['Paste original text in the left panel (or drag and drop a file).', 'Paste modified text in the right panel (or upload a file).', 'Choose diff mode: Line, Word, or Character.', 'Toggle ignore options if needed (case, whitespace, punctuation, line order).', 'View color-coded differences in the split or unified view below.', 'Navigate between changes with the arrow buttons or Alt+Up/Down.', 'Copy the diff or download as PNG.'],
    relatedToolSlugs: ['word-counter', 'case-converter', 'remove-duplicate-lines', 'regex-tester', 'json-formatter'],
    icon: 'GitCompare',
    estimatedTime: 'Instant',
  },
  {
    slug: 'text-diff',
    name: 'Text Diff Checker',
    shortDescription: 'Compare two texts side-by-side and highlight the differences line by line.',
    longDescription: `<p>Our <strong>text diff checker</strong> compares two texts side-by-side and highlights every added, removed, and changed line in color-coded output. It uses word-level diffing so you can pinpoint the exact words that changed, not just the full lines.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Word-Level Diff</strong>: Highlights the specific words that differ within each changed line.</li>
<li><strong>Color-Coded Output</strong>: Green for additions, red for removals — instantly scannable.</li>
<li><strong>File Upload</strong>: Compare text files directly without copy-pasting.</li>
<li><strong>Similarity Score</strong>: Shows the percentage of lines that are identical between the two texts.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Writers comparing drafts, developers reviewing code snippets, editors tracking revisions, and students checking for differences between documents.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'text-tools',
    targetKeyword: 'text diff checker online',
    secondaryKeywords: ['compare two texts', 'text comparison tool', 'find differences in text', 'diff tool online free'],
    metaTitle: 'Text Diff Checker - Compare Two Texts Online Free',
    metaDescription: 'Compare two texts and highlight differences instantly. See added and removed lines with color coding. Split and unified views. Free online diff tool.',
    faqs: [],
    howToSteps: [],
    relatedToolSlugs: ['text-compare'],
    icon: 'GitCompare',
    estimatedTime: 'Instant',
  },
  {
    slug: 'fancy-text-generator',
    name: 'Fancy Text Generator',
    shortDescription: 'Convert text into cool Unicode fonts for Instagram, Twitter, WhatsApp and more.',
    longDescription: `<p>Transform any text into 14+ Unicode font styles with our free <strong>fancy text generator</strong>. Choose from bold, italic, monospace, fraktur, script, circled, block letters, strikethrough, underline, wide, tiny caps, upside down, and more — then copy and paste anywhere these characters are supported.</p>
<h2>Key Features</h2>
<ul>
<li><strong>14+ Style Options</strong>: Bold, italic, script, fraktur, circled, block letters, strikethrough, upside down, and more.</li>
<li><strong>One-Click Copy</strong>: Click any style card to instantly copy it to your clipboard.</li>
<li><strong>Works Everywhere</strong>: Uses real Unicode characters that work on all modern platforms.</li>
<li><strong>Number Support</strong>: Several styles (bold, monospace, circled) also transform numbers.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Social media users decorating Instagram bios and posts, content creators standing out in Twitter/X feeds, gamers styling usernames, and anyone who wants to add visual flair to their text on WhatsApp, Discord, or any platform.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'text-tools',
    targetKeyword: 'fancy text generator',
    secondaryKeywords: ['unicode font generator', 'cool text generator', 'instagram fonts', 'fancy letters online', 'stylish text maker'],
    metaTitle: 'Fancy Text Generator - Cool Unicode Fonts for Instagram & Twitter',
    metaDescription: 'Generate 14+ fancy text styles using Unicode fonts. Bold, italic, script, circled, upside-down and more. Copy with one click for Instagram, Twitter, WhatsApp.',
    faqs: [
      { question: 'Why do fancy fonts work on social media?', answer: 'These are actual Unicode characters that look like different fonts. Since they are standard characters, they work everywhere text is supported.' },
      { question: 'Will these show on all devices?', answer: 'Most modern devices and browsers support Unicode 6.0+ which includes these character ranges. Older devices may show boxes for unsupported characters.' },
      { question: 'Can I use these in my Instagram bio?', answer: 'Yes! That\'s one of the most popular uses. Copy any style and paste directly into your Instagram bio, posts, or stories.' },
      { question: 'Why do some letters look the same?', answer: 'Not all Unicode mathematical letter ranges include every character. Some styles skip certain letters and fall back to the original character.' },
      { question: 'Does this work for numbers?', answer: 'Several styles (bold, monospace, circled) support numbers as well.' },
    ],
    howToSteps: ['Type your text in the input box.', 'Browse the 14+ style options below.', 'Click any style card to copy it.', 'Paste into Instagram, Twitter, WhatsApp, etc.'],
    relatedToolSlugs: ['case-converter', 'word-counter', 'text-to-slug', 'character-counter'],
    icon: 'Sparkles',
    estimatedTime: 'Instant',
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    shortDescription: 'Generate UUID v4, v1-style, nil UUIDs and short IDs in bulk.',
    longDescription: `<p>Generate cryptographically random UUIDs instantly with our free <strong>UUID generator online</strong>. Choose from UUID v4 (fully random), v1-like (time-based prefix), nil UUID (all zeros), or compact 12-character short IDs — generate up to 20 at a time with one click.</p>
<h2>Key Features</h2>
<ul>
<li><strong>UUID v4</strong>: Fully random, 122 bits of entropy — effectively unique for all practical purposes.</li>
<li><strong>UUID v1-Like</strong>: Time-based prefix for sortable identifiers.</li>
<li><strong>Short IDs</strong>: Compact 12-character URL-safe base64 strings for when UUID length is too long.</li>
<li><strong>Bulk Generation</strong>: Generate 1–20 UUIDs at once; copy individually or all together.</li>
<li><strong>Cryptographically Secure</strong>: Uses the Web Crypto API (crypto.getRandomValues).</li>
</ul>
<h2>Who Is This For?</h2>
<p>Backend developers seeding database primary keys, frontend engineers generating temporary IDs, QA engineers creating test data, and developers building distributed systems that need globally unique identifiers.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'UUID generator online',
    secondaryKeywords: ['uuid v4 generator', 'generate unique id online', 'guid generator', 'random uuid', 'bulk uuid generator'],
    metaTitle: 'UUID Generator Free Online - UUID v4, v1, GUID',
    metaDescription: 'Generate UUID v4, v1-style, nil UUIDs and short IDs online free. Bulk generate 1-20 at once. Cryptographically random using Web Crypto API. No signup.',
    faqs: [
      { question: 'What is a UUID?', answer: 'UUID (Universally Unique Identifier) is a 128-bit identifier formatted as 8-4-4-4-12 hexadecimal groups. Used to uniquely identify database records, API resources, session tokens, etc.' },
      { question: 'What is the difference between UUID v4 and v1?', answer: 'UUID v4 is fully random (except 6 version/variant bits). UUID v1 embeds the current timestamp, making it sortable by creation time but potentially revealing the machine MAC address.' },
      { question: 'Are the generated UUIDs truly unique?', answer: 'UUID v4 has 122 random bits, giving 2^122 possible values. The probability of collision is astronomically low — effectively unique for all practical purposes.' },
      { question: 'Is this cryptographically secure?', answer: 'Yes. We use the Web Crypto API (crypto.getRandomValues) for generation, the same standard used by browsers for TLS.' },
      { question: 'What is a short ID?', answer: 'A short ID is a 12-character URL-safe base64 string generated from 9 random bytes. Useful when you need a compact unique identifier.' },
    ],
    howToSteps: ['Select UUID version (v4, v1-like, short, or nil).', 'Set how many to generate (1-20).', 'Toggle uppercase if needed.', 'Click Generate.', 'Click individual copy buttons or "Copy all".'],
    relatedToolSlugs: ['password-generator', 'hash-generator', 'base64-encode-decode', 'json-formatter'],
    icon: 'Fingerprint',
    estimatedTime: 'Instant',
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    shortDescription: 'Decode and inspect JWT tokens — header, payload, expiry and claims.',
    longDescription: `<p>Paste any JSON Web Token and instantly decode it with our free <strong>JWT decoder online</strong>. View the header, payload claims, issued-at and expiry dates, and a color-coded validity badge — all in your browser without sending your token anywhere.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Full Claim Inspection</strong>: Displays all standard and custom claims (sub, name, iat, exp, iss, aud, etc.).</li>
<li><strong>Expiry Status</strong>: Compares the "exp" claim to current time — shows green "Valid" or red "Expired" badge.</li>
<li><strong>Color-Coded Sections</strong>: Header (purple), Payload (blue), and Signature clearly separated.</li>
<li><strong>Algorithm Display</strong>: Shows the signing algorithm (HS256, RS256, ES256, etc.).</li>
</ul>
<h2>Who Is This For?</h2>
<p>Backend and frontend developers debugging authentication flows, security engineers inspecting token claims, and anyone troubleshooting JWT-based API access issues without needing a full development environment.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your token is never sent to any server. No signup, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'JWT decoder online',
    secondaryKeywords: ['decode jwt token', 'jwt parser online', 'json web token decoder', 'jwt inspector', 'jwt claims viewer'],
    metaTitle: 'JWT Decoder Online Free - Decode JSON Web Tokens',
    metaDescription: 'Decode and inspect JWT tokens instantly. View header, payload claims, expiry status and algorithm. Free online JWT parser — no server, 100% private.',
    faqs: [
      { question: 'Can this verify the JWT signature?', answer: 'No. Signature verification requires the secret or public key, which should never be shared in a browser tool. This tool only decodes the base64-encoded parts.' },
      { question: 'Is my JWT sent to a server?', answer: 'No. All decoding happens locally in your browser using JavaScript. Your token never leaves your device.' },
      { question: 'What claims does it show?', answer: 'All standard claims (sub, name, iat, exp, iss, aud, etc.) and any custom claims in the payload are displayed.' },
      { question: 'How do I know if my token is expired?', answer: 'The tool reads the "exp" claim and compares it to the current time, showing a green "Token Valid" or red "Token Expired" badge.' },
      { question: 'What JWT formats are supported?', answer: 'Standard 3-part JWTs (header.payload.signature) with base64url encoding, which covers HS256, RS256, ES256, and all common algorithms.' },
    ],
    howToSteps: ['Paste your JWT token into the input.', 'View the decoded Header (purple) section.', 'View the decoded Payload (blue) with all claims.', 'Check the validity status bar for expiry info.', 'Copy sections individually using the copy buttons.'],
    relatedToolSlugs: ['base64-encode-decode', 'hash-generator', 'json-formatter', 'url-encode-decode'],
    icon: 'KeyRound',
    estimatedTime: 'Instant',
  },
  {
    slug: 'tip-calculator',
    name: 'Tip Calculator',
    shortDescription: 'Calculate tip amount and split the bill between multiple people.',
    longDescription: `<p>Our free <strong>tip calculator</strong> makes splitting restaurant bills effortless. Enter the bill amount, choose a tip percentage (or enter a custom one), set how many people are splitting, and instantly see the tip amount, total bill, and per-person share.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Quick Tip Presets</strong>: Common percentages (10%, 15%, 18%, 20%) selectable in one tap.</li>
<li><strong>Custom Tip Percentage</strong>: Enter any percentage for complete flexibility.</li>
<li><strong>Bill Splitting</strong>: Divide the total evenly among any number of people.</li>
<li><strong>Tipping Guide</strong>: Includes etiquette reference for different service levels and countries.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Diners splitting restaurant bills with friends, travelers who need tipping guidance in unfamiliar countries, and anyone who wants fast, accurate bill math without mental arithmetic.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'calculators',
    targetKeyword: 'tip calculator',
    secondaryKeywords: ['bill split calculator', 'restaurant tip calculator', 'tip and split calculator free', 'how much to tip calculator'],
    metaTitle: 'Tip Calculator - Calculate Tip & Split Bill',
    metaDescription: 'Free tip calculator: enter bill amount, tip percentage and number of people. Instantly see tip amount, total and per-person split. Includes tipping guide.',
    faqs: [
      { question: 'What is the standard tip percentage in India?', answer: 'Tipping is optional in India. At restaurants, 10% is appreciated, and 15-20% for excellent service. At hotels and spas, ₹50-200 per service is common.' },
      { question: 'How is the tip calculated?', answer: 'Tip = Bill × Tip% ÷ 100. Total = Bill + Tip. Per person = Total ÷ Number of people.' },
      { question: 'Can I enter a custom tip percentage?', answer: 'Yes. Click "Custom" to enter any tip percentage.' },
      { question: 'What if the bill is being split unevenly?', answer: 'This calculator splits evenly. For uneven splits, you would need to adjust individual amounts manually.' },
      { question: 'Should I tip on the pre-tax or post-tax amount?', answer: 'Traditionally tip on the pre-tax amount, but many people tip on the total. This calculator uses the bill amount you enter, so enter pre-tax or post-tax as preferred.' },
    ],
    howToSteps: ['Enter the total bill amount.', 'Click a tip percentage preset or enter a custom %.', 'Set how many people are splitting the bill.', 'View tip amount, total, and per-person amounts.'],
    relatedToolSlugs: ['discount-calculator', 'percentage-calculator', 'emi-calculator', 'gst-calculator'],
    icon: 'Receipt',
    estimatedTime: 'Instant',
  },
  {
    slug: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    shortDescription: 'Create beautiful linear, radial, and conic CSS gradients visually.',
    longDescription: `<p>Design stunning backgrounds with our free <strong>CSS gradient generator</strong>. Choose from linear, radial, or conic gradient types, add unlimited color stops, adjust the angle, and get production-ready CSS code with a single click.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Three Gradient Types</strong>: Linear (directional), radial (circular), and conic (rotating) gradients.</li>
<li><strong>Unlimited Color Stops</strong>: Add as many stops as you need, each with its own color and position.</li>
<li><strong>Live Preview</strong>: See your gradient update in real time as you adjust settings.</li>
<li><strong>6 Built-In Presets</strong>: Start from beautiful preset gradients and customize from there.</li>
<li><strong>Standard CSS Output</strong>: Clean, vendor-prefix-free CSS ready to paste into any project.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Web designers styling hero sections, landing pages, and UI components; frontend developers building design systems; and anyone who wants to create polished gradient backgrounds without manually writing CSS.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'CSS gradient generator',
    secondaryKeywords: ['css gradient maker', 'linear gradient generator', 'gradient color picker', 'css background gradient tool'],
    metaTitle: 'CSS Gradient Generator - Free Online Gradient Maker',
    metaDescription: 'Create CSS gradients visually. Linear, radial, conic gradients with color stops, angle control and live preview. Copy CSS instantly. Free, no signup.',
    faqs: [
      { question: 'What CSS gradient types are supported?', answer: 'Linear (directional), radial (circular from center), and conic (rotating around a center point).' },
      { question: 'Can I add more than 2 colors?', answer: 'Yes! Click "Add stop" to add unlimited color stops. Each can have its own color and position percentage.' },
      { question: 'How do I use the CSS in my project?', answer: 'Copy the generated CSS and paste it as the background property of any HTML element.' },
      { question: 'Does this generate vendor prefixes?', answer: 'Modern browsers support standard gradient syntax without prefixes. The output uses standard CSS.' },
      { question: 'Can I create a transparent gradient?', answer: 'Yes. Use any color as a starting point and white or the background color as the end to simulate transparency in many contexts.' },
    ],
    howToSteps: ['Select gradient type: linear, radial, or conic.', 'Adjust the angle (for linear/conic).', 'Click color swatches to change colors.', 'Drag sliders to adjust stop positions.', 'Click "Copy" to get the CSS.'],
    relatedToolSlugs: ['color-picker', 'box-shadow-generator', 'html-css-js-editor', 'image-compressor'],
    icon: 'Palette',
    estimatedTime: 'Instant',
  },
  {
    slug: 'css-gradient-text-generator',
    name: 'CSS Gradient Text Generator',
    shortDescription: 'Create stunning gradient text effects with live preview. Copy CSS instantly.',
    longDescription: `<p>Create eye-catching text effects with our free <strong>CSS gradient text generator</strong>. Choose from 12 beautiful presets or build custom gradients with any colors, see the effect live on your own text, and copy the exact CSS code with one click.</p>\n<h2>Key Features</h2>\n<ul>\n<li><strong>12 Gradient Presets</strong>: Sunset, Ocean, Neon, Forest, Berry, Fire, Galaxy, Candy, Midnight, Emerald, Peach, and Electric.</li>\n<li><strong>Custom Color Pickers</strong>: Set start and end colors and gradient angle for fully unique effects.</li>\n<li><strong>Live Preview</strong>: Type your own text and see the gradient applied in real time.</li>\n<li><strong>Cross-Browser CSS</strong>: Generates both standard and -webkit- prefixed properties for maximum compatibility.</li>\n<li><strong>Works on Any Element</strong>: CSS applies to headings, paragraphs, buttons, spans, and any text element.</li>\n</ul>\n<h2>Who Is This For?</h2>\n<p>Web designers creating hero headings and landing page titles, frontend developers adding visual flair to UI, and content creators designing social media graphics that need striking, colorful text effects.</p>\n<h2>Privacy & Security</h2>\n<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'CSS gradient text generator',
    secondaryKeywords: ['gradient text css', 'text gradient generator', 'css text color gradient', 'gradient text effect css', 'rainbow text css', 'gradient heading generator', 'colorful text css generator'],
    metaTitle: 'CSS Gradient Text Generator - Create Gradient Text Free Online',
    metaDescription: 'Create beautiful gradient text effects with CSS. 12 presets, custom colors, live preview. Copy CSS code instantly. Free online tool — no signup needed.',
    faqs: [
      { question: 'How does CSS gradient text work?', answer: 'It uses a combination of background: linear-gradient(), -webkit-background-clip: text, and color: transparent to apply a gradient as the text color instead of the background. This technique works in all modern browsers.' },
      { question: 'Does gradient text work in all browsers?', answer: 'Yes, gradient text works in all modern browsers including Chrome, Firefox, Safari, and Edge. The generated code includes both standard and -webkit- prefixed properties for maximum compatibility.' },
      { question: 'Can I use this on any text element?', answer: 'Yes! The CSS works on headings (h1-h6), paragraphs, spans, links, buttons, and any text element. Just apply the generated CSS properties to your element.' },
      { question: 'Is gradient text accessible?', answer: 'Gradient text can be less readable than solid colors, especially with low contrast gradients. Use it for decorative headings and titles, not for body text. Ensure sufficient contrast with the background.' },
    ],
    howToSteps: ['Type your text or use the default preview text.', 'Select a gradient preset or pick custom start and end colors.', 'Adjust the gradient angle and font size.', 'See the live preview update instantly.', 'Click "Copy CSS" to copy the code to your clipboard.'],
    relatedToolSlugs: ['css-gradient-generator', 'color-picker', 'box-shadow-generator', 'fancy-text-generator'],
    icon: 'Type',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'box-shadow-generator',
    name: 'Box Shadow Generator',
    shortDescription: 'Generate CSS box-shadow code visually with live preview and presets.',
    longDescription: `<p>Design CSS box shadows interactively with our free <strong>CSS box shadow generator</strong>. Control every shadow property visually on a live canvas and copy production-ready CSS with a single click.</p>\n<h2>Key Features</h2>\n<ul>\n<li><strong>Full Control</strong>: Adjust X/Y offset, blur radius, spread, opacity, and color per layer.</li>\n<li><strong>Multiple Layers</strong>: Stack multiple shadow layers for realistic, complex effects.</li>\n<li><strong>6 Presets</strong>: Soft, hard, layered, glow, and inset shadows to start from.</li>\n<li><strong>Inset Shadows</strong>: Create "pressed" or "embedded" inner shadow effects.</li>\n<li><strong>Instant Copy</strong>: One-click copy of the complete box-shadow CSS declaration.</li>\n</ul>\n<h2>Who Is This For?</h2>\n<p>UI designers perfecting card and button shadows, frontend developers implementing design specs, and anyone who wants to create polished depth effects without manually tuning CSS values.</p>\n<h2>Privacy & Security</h2>\n<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'CSS box shadow generator',
    secondaryKeywords: ['box shadow css tool', 'css shadow generator online', 'box-shadow maker', 'drop shadow generator css'],
    metaTitle: 'CSS Box Shadow Generator - Free Online Shadow Maker',
    metaDescription: 'Create CSS box shadows visually with live preview. Control offset, blur, spread, opacity per layer. Multiple shadow layers, presets. Copy CSS instantly.',
    faqs: [
      { question: 'What does each shadow property do?', answer: 'X Offset: horizontal position. Y Offset: vertical position. Blur: softness of the edge. Spread: size of shadow. Opacity: transparency. Inset: shadow inside the element.' },
      { question: 'Can I combine multiple shadow layers?', answer: 'Yes! CSS box-shadow supports comma-separated values. Click "Add" to stack multiple shadows for realistic layered effects.' },
      { question: 'What is an inset shadow?', answer: 'An inset shadow appears inside the element\'s boundary rather than outside, creating an "embedded" or "pressed" look.' },
      { question: 'How do I copy the CSS?', answer: 'Click the Copy button next to the code output to copy the full box-shadow CSS declaration.' },
      { question: 'Does this support colored shadows?', answer: 'Yes. Each shadow layer has its own color picker and opacity slider, so you can create colored glows and shadows.' },
    ],
    howToSteps: ['Adjust shadow sliders (X, Y, Blur, Spread, Opacity).', 'Change shadow color with the color picker.', 'Add more layers with the "Add" button.', 'Try presets for quick starting points.', 'Copy the CSS output.'],
    relatedToolSlugs: ['css-gradient-generator', 'color-picker', 'html-css-js-editor', 'image-compressor'],
    icon: 'Square',
    estimatedTime: 'Instant',
  },
  {
    slug: 'css-flexbox-generator',
    name: 'CSS Flexbox Generator',
    shortDescription: 'Build CSS flexbox layouts visually with a live interactive playground.',
    longDescription: `<p>Build CSS layouts visually with our free <strong>CSS flexbox generator</strong> playground. Control every flexbox property on the container and individual items, preview the result in real time, and copy production-ready CSS instantly.</p>\n<h2>Key Features</h2>\n<ul>\n<li><strong>Container Controls</strong>: flex-direction, justify-content, align-items, flex-wrap, and gap.</li>\n<li><strong>Per-Item Controls</strong>: flex-grow, flex-shrink, flex-basis, align-self, and order for each item.</li>\n<li><strong>Layout Presets</strong>: Navbar, Card Grid, Holy Grail, Centered, and Sidebar to get started fast.</li>\n<li><strong>Live Preview</strong>: See layout changes update in real time as you adjust values.</li>\n<li><strong>Instant CSS Export</strong>: Copy the generated CSS with all properties ready for production.</li>\n</ul>\n<h2>Who Is This For?</h2>\n<p>Frontend developers learning flexbox concepts visually, designers prototyping layouts, and developers who want to experiment with flexbox properties without writing CSS manually.</p>\n<h2>Privacy & Security</h2>\n<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'CSS flexbox generator',
    secondaryKeywords: ['flexbox playground', 'css flex generator online', 'flexbox layout builder', 'flexbox cheat sheet visual', 'css flex tool'],
    metaTitle: 'CSS Flexbox Generator - Free Visual Flexbox Playground',
    metaDescription: 'Build CSS flexbox layouts visually with live preview. Control direction, justify, align, wrap, gap, and per-item properties. Layout presets included. Copy CSS instantly.',
    faqs: [
      { question: 'What is CSS Flexbox?', answer: 'Flexbox is a CSS layout model that lets you distribute space and align items in a container, even when their sizes are unknown or dynamic.' },
      { question: 'What does justify-content do?', answer: 'justify-content aligns flex items along the main axis (horizontal for row, vertical for column). Options include flex-start, center, space-between, space-around, and space-evenly.' },
      { question: 'What is the difference between align-items and align-self?', answer: 'align-items is set on the container and applies to all items. align-self overrides this alignment for a single item.' },
      { question: 'What does flex-grow do?', answer: 'flex-grow determines how much an item should grow relative to siblings when extra space is available. A value of 0 means no growth; 1 means it takes its share of available space.' },
      { question: 'Can I use these presets in my project?', answer: 'Yes! Click any preset to load a common layout pattern, then copy the generated CSS and paste it into your project.' },
    ],
    howToSteps: ['Select container properties: direction, justify-content, align-items, wrap, and gap.', 'Add or remove flex items (1-12).', 'Click an item to expand per-item controls (grow, shrink, basis, align-self, order).', 'Try a preset for common layouts like Navbar or Card Grid.', 'Copy the generated CSS with one click.'],
    relatedToolSlugs: ['box-shadow-generator', 'css-gradient-generator', 'html-css-js-editor', 'css-minifier'],
    icon: 'LayoutGrid',
    estimatedTime: 'Instant',
  },
  {
    slug: 'countdown-timer',
    name: 'Countdown Timer',
    shortDescription: 'A simple, beautiful countdown timer with circular progress and presets.',
    longDescription: `<p>Set a free <strong>countdown timer online</strong> with quick presets from 1 minute to 1 hour, or enter a custom hours/minutes/seconds value. A beautiful circular progress ring shows the time remaining at a glance.</p>\n<h2>Key Features</h2>\n<ul>\n<li><strong>Quick Presets</strong>: 1, 5, 10, 15, 25, 30, and 60-minute presets for instant setup.</li>\n<li><strong>Custom Time</strong>: Set any hours, minutes, and seconds combination — no maximum limit.</li>\n<li><strong>Circular Progress Ring</strong>: Visual arc indicator shows how much time remains.</li>\n<li><strong>Pause & Resume</strong>: Stop and continue the timer without losing your place.</li>\n<li><strong>+1 Minute</strong>: Add a minute on the fly while the timer is running.</li>\n</ul>\n<h2>Who Is This For?</h2>\n<p>Students using the Pomodoro technique (25 min work / 5 min break), cooks timing recipes, teachers managing classroom activities, and anyone who needs a quick, reliable timer without installing an app.</p>\n<h2>Privacy & Security</h2>\n<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'utility-tools',
    targetKeyword: 'countdown timer online',
    secondaryKeywords: ['online countdown timer', 'free timer online', 'kitchen timer online', 'study timer', 'pomodoro timer'],
    metaTitle: 'Countdown Timer Online Free - Set Timer with Presets',
    metaDescription: 'Free online countdown timer with circular progress ring. Quick presets (1-60 min) or custom time. Pause, resume, reset. Works in any browser, no app needed.',
    faqs: [
      { question: 'Can I use this as a Pomodoro timer?', answer: 'Yes! Set 25 minutes for work, then 5 minutes for a break. Repeat 4 times and take a longer 15-30 minute break.' },
      { question: 'Will the timer alert me when done?', answer: 'The timer shows "Time\'s Up!" with a red color when it reaches zero. Browser notifications are not currently implemented.' },
      { question: 'Does the timer work in background tabs?', answer: 'Yes, it uses setInterval which continues running in background tabs in most browsers.' },
      { question: 'Can I add time while the timer is running?', answer: 'Yes! Click the + button to add 1 minute to the current time at any point.' },
      { question: 'What is the maximum timer duration?', answer: 'You can set any hours, minutes, seconds combination. There is no maximum limit in the custom input.' },
    ],
    howToSteps: ['Click a quick preset (1 min, 5 min, 25 min, etc.)', 'Or enter custom hours/minutes/seconds and click "Set Timer".', 'Press the Play button to start.', 'Use Pause, Reset, or +1 min buttons as needed.'],
    relatedToolSlugs: ['internet-speed-test', 'timezone-checker', 'timestamp-converter', 'age-calculator'],
    icon: 'Timer',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'random-generator',
    name: 'Random Generator',
    shortDescription: 'Generate random numbers, roll dice, flip coins, and pick from a list.',
    longDescription: `<p>Four tools in one free <strong>random number generator</strong>: generate numbers in any range, roll virtual dice, flip coins, and pick randomly from a custom list — all with one click.</p>\n<h2>Key Features</h2>\n<ul>\n<li><strong>Number Generator</strong>: Set custom min, max, and count — generate multiple numbers at once.</li>\n<li><strong>Dice Roller</strong>: D4, D6, D8, D10, D12, D20, and D100 — roll up to 10 dice simultaneously.</li>\n<li><strong>Coin Flipper</strong>: Flip multiple coins and see the heads/tails breakdown.</li>\n<li><strong>List Picker</strong>: Paste any list of items and randomly pick one or more winners.</li>\n</ul>\n<h2>Who Is This For?</h2>\n<p>Tabletop RPG and board game players, teachers picking random students, contest organizers drawing winners, developers needing quick random test data, and anyone who needs a fast, fair random decision.</p>\n<h2>Privacy & Security</h2>\n<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'utility-tools',
    targetKeyword: 'random number generator',
    secondaryKeywords: ['dice roller online', 'coin flip online', 'random picker', 'random name picker', 'online dice roll'],
    metaTitle: 'Random Generator - Numbers, Dice, Coin Flip, List Picker',
    metaDescription: 'Free random generator: random numbers with range, dice roller (D4-D100), coin flipper, and random list item picker. All in one tool — instant results.',
    faqs: [
      { question: 'Can I roll multiple dice at once?', answer: 'Yes. Set the count slider to roll 1-10 dice simultaneously. The sum of all dice is shown.' },
      { question: 'What dice types are available?', answer: 'D4, D6, D8, D10, D12, D20, and D100 (percentile die).' },
      { question: 'Can I pick multiple items from a list?', answer: 'Yes. Set the "Pick" count and up to that many items will be randomly selected without repetition.' },
      { question: 'Is this truly random?', answer: 'The number generator and short ID use Math.random() which is suitable for non-cryptographic purposes. For truly secure randomness, use the Password Generator which uses Web Crypto API.' },
      { question: 'Can I use this to pick a contest winner?', answer: 'Yes! Paste participant names in the List tab, set Pick to 1, and click "Pick Random" for a fair random selection.' },
    ],
    howToSteps: ['Choose a tab: Number, Dice, Coin, or List.', 'Configure the settings (range, dice type, count, etc.)', 'Click Generate/Roll/Flip/Pick.', 'View the results.'],
    relatedToolSlugs: ['password-generator', 'uuid-generator', 'hash-generator', 'average-calculator'],
    icon: 'Shuffle',
    estimatedTime: 'Instant',
  },
  {
    slug: 'password-strength-checker',
    name: 'Password Strength Checker',
    shortDescription: 'Check how strong your password is with detailed analysis and tips.',
    longDescription: `<p>Analyze any password instantly with our free <strong>password strength checker</strong>. Get a color-coded strength rating, entropy score in bits, and a detailed security checklist — all without your password ever leaving your device.</p>\n<h2>Key Features</h2>\n<ul>\n<li><strong>7-Criteria Analysis</strong>: Checks length, uppercase, lowercase, numbers, symbols, uniqueness, and common patterns.</li>\n<li><strong>Strength Bar</strong>: Color-coded rating from Very Weak to Very Strong.</li>\n<li><strong>Entropy Estimate</strong>: Shows password entropy in bits — aim for 60+ bits for good security.</li>\n<li><strong>Common Password Warning</strong>: Flags if your password matches the 15 most commonly used passwords.</li>\n<li><strong>Improvement Tips</strong>: Actionable advice on how to make your password stronger.</li>\n</ul>\n<h2>Who Is This For?</h2>\n<p>Anyone creating new account passwords, IT administrators setting password policies, security-conscious users auditing existing passwords, and developers building password validation features.</p>\n<h2>Privacy & Security</h2>\n<p>Runs 100% in your browser — your password is never sent to any server. No signup, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'password strength checker',
    secondaryKeywords: ['password strength tester', 'how strong is my password', 'check password security', 'password analyzer online'],
    metaTitle: 'Password Strength Checker Free Online',
    metaDescription: 'Check your password strength instantly. Get color-coded strength rating, entropy score, character breakdown and security checklist. 100% private, no server.',
    faqs: [
      { question: 'Is my password sent to a server?', answer: 'No. All analysis happens entirely in your browser. Your password never leaves your device.' },
      { question: 'What is entropy?', answer: 'Password entropy (in bits) measures how unpredictable a password is. Higher entropy = harder to crack. Aim for 60+ bits for good security.' },
      { question: 'What makes a password strong?', answer: 'Length (12+ characters), a mix of uppercase/lowercase/numbers/symbols, no dictionary words, and uniqueness per account.' },
      { question: 'How is strength level determined?', answer: 'We check 7 criteria. 1-2 passed = Very Weak, 3 = Weak, 4 = Fair, 5 = Good, 6 = Strong, 7 = Very Strong.' },
      { question: 'What are common passwords?', answer: 'We check against a list of the 15 most commonly used passwords (like "123456", "password", "qwerty") and warn if your password matches.' },
    ],
    howToSteps: ['Type or paste your password.', 'Toggle the eye icon to show/hide characters.', 'View the strength bar and level (Very Weak to Very Strong).', 'Check which criteria are met in the requirements list.', 'Read the tips panel for advice on improving your password.'],
    relatedToolSlugs: ['password-generator', 'hash-generator', 'base64-encode-decode', 'jwt-decoder'],
    icon: 'ShieldCheck',
    estimatedTime: 'Instant',
  },
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    shortDescription: 'Generate SEO meta tags, Open Graph, and Twitter Card tags for your website.',
    longDescription: `<p>Create complete HTML meta tags for any webpage in seconds with our free <strong>meta tag generator</strong>. Covers Basic SEO, Open Graph, and Twitter Card tags — live code updates as you type, ready to paste into your site's &lt;head&gt;.</p>\n<h2>Key Features</h2>\n<ul>\n<li><strong>Basic SEO Tags</strong>: Title, description, keywords, robots directives, and canonical URL.</li>\n<li><strong>Open Graph Tags</strong>: Control how your page looks when shared on Facebook, LinkedIn, and WhatsApp.</li>\n<li><strong>Twitter Card Tags</strong>: Set card type, title, description, and image for Twitter/X link previews.</li>\n<li><strong>Character Counter</strong>: Live counter warns when title (60 chars) or description (160 chars) is too long.</li>\n<li><strong>Copy All or Per-Section</strong>: Copy individual tag groups or all tags at once.</li>\n</ul>\n<h2>Who Is This For?</h2>\n<p>SEO professionals optimizing new pages, web developers adding social sharing support, bloggers improving link previews, and anyone who wants their site to display correctly in search results and on social media.</p>\n<h2>Privacy & Security</h2>\n<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'seo-tools',
    targetKeyword: 'meta tag generator',
    secondaryKeywords: ['seo meta tags generator', 'open graph meta tag generator', 'twitter card generator', 'html meta tags maker', 'og tags generator'],
    metaTitle: 'Meta Tag Generator - SEO, Open Graph & Twitter Card Tags',
    metaDescription: 'Generate complete SEO meta tags, Open Graph, and Twitter Card tags instantly. Live preview, copy with one click. Free online meta tag maker for any website.',
    faqs: [
      { question: 'What are meta tags?', answer: 'Meta tags are HTML elements in the <head> section that provide information about a webpage to search engines and social media platforms.' },
      { question: 'What is Open Graph?', answer: 'Open Graph (og:) meta tags control how your page appears when shared on Facebook, LinkedIn, WhatsApp, and other platforms — including the title, description, and preview image.' },
      { question: 'What is a Twitter Card?', answer: 'Twitter Card meta tags control how links appear when shared on Twitter/X. The "summary_large_image" type shows a large image with title and description.' },
      { question: 'How long should my meta description be?', answer: 'Google typically displays 150-160 characters. The tool shows a character counter and turns red when you exceed 160.' },
      { question: 'How long should my meta title be?', answer: 'Keep it under 60 characters. Google typically truncates titles longer than 60 characters in search results.' },
    ],
    howToSteps: ['Fill in Basic SEO fields: title, description, keywords.', 'Switch to "Open Graph" tab and add image URL and page URL.', 'Switch to "Twitter Card" and set card type and image.', 'Copy individual tab code or "Copy all" for complete tags.', 'Paste into the <head> section of your HTML.'],
    relatedToolSlugs: ['qr-code-generator', 'html-css-js-editor', 'text-to-slug', 'json-formatter'],
    icon: 'Tag',
    estimatedTime: 'Instant',
  },
  {
    slug: 'average-calculator',
    name: 'Average Calculator',
    shortDescription: 'Calculate mean, median, mode, standard deviation and more from a list of numbers.',
    longDescription: `<p>Our full-featured <strong>average calculator</strong> goes far beyond the mean. Enter any list of numbers and instantly get a complete statistical breakdown — central tendency, spread, and quartiles — all updating in real time as you type.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Central Tendency</strong>: Arithmetic mean, geometric mean, harmonic mean, and mode.</li>
<li><strong>Spread</strong>: Minimum, maximum, range, variance, and standard deviation (σ).</li>
<li><strong>Quartiles</strong>: Q1 (25th percentile), Q2 (median), Q3 (75th percentile), and IQR.</li>
<li><strong>Distribution Bar</strong>: Visual chart showing the relative distribution of each value.</li>
<li><strong>Flexible Input</strong>: Separate numbers by commas, spaces, semicolons, or new lines.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Students doing statistics homework, data analysts summarizing datasets, teachers checking student scores, researchers performing descriptive statistics, and anyone who needs more than just the average from a list of numbers.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'calculators',
    targetKeyword: 'average calculator',
    secondaryKeywords: ['mean median mode calculator', 'statistics calculator', 'standard deviation calculator', 'arithmetic mean calculator', 'number average online'],
    metaTitle: 'Average Calculator - Mean, Median, Mode, Std Dev',
    metaDescription: 'Free average calculator online. Find mean, median, mode, range, variance, standard deviation, and quartiles instantly. Enter numbers and get full stats.',
    faqs: [
      { question: 'What is the difference between mean, median, and mode?', answer: 'Mean is the arithmetic average (sum ÷ count). Median is the middle value when sorted. Mode is the most frequently occurring value. For symmetric distributions they are equal; for skewed data they differ.' },
      { question: 'What is standard deviation?', answer: 'Standard deviation (σ) measures how spread out numbers are from the mean. A low σ means values are clustered close to the mean; a high σ means they are spread widely.' },
      { question: 'What is geometric mean used for?', answer: 'Geometric mean is used for growth rates, investment returns, and ratios. It is only valid for positive numbers and less affected by extreme values than arithmetic mean.' },
      { question: 'What are quartiles?', answer: 'Quartiles divide sorted data into four equal parts. Q1 = 25th percentile, Q2 = median (50th), Q3 = 75th percentile. IQR = Q3 − Q1 and measures the spread of the middle 50% of data.' },
      { question: 'Can I enter decimal numbers?', answer: 'Yes. Enter numbers like 1.5, 3.14, 0.001 — they are all supported. Non-numeric values are automatically skipped with a warning.' },
    ],
    howToSteps: [
      'Type or paste your numbers into the input box.',
      'Separate values with commas, spaces, semicolons, or new lines.',
      'All statistics update instantly as you type.',
      'Click the copy icon next to any result to copy it.',
      'Use the distribution bar to visually compare values.',
    ],
    relatedToolSlugs: ['percentage-calculator', 'discount-calculator', 'sip-calculator', 'bmi-calculator'],
    icon: 'BarChart2',
    estimatedTime: 'Instant',
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    shortDescription: 'Calculate percentages, percent changes, and what percent one number is of another.',
    longDescription: `<p>Our free <strong>percentage calculator</strong> covers every common percentage problem in one place — finding X% of a number, calculating what percentage X is of Y, finding the original value before a change, and calculating percent change between two values. With step-by-step working shown for every result.</p>
<h2>Key Features</h2>
<ul>
<li><strong>All Percentage Types</strong>: X% of Y, Y as % of X, original value, and percent change.</li>
<li><strong>Step-by-Step Solutions</strong>: See the formula and working for every calculation.</li>
<li><strong>Instant Results</strong>: Results update as you type — no need to click Calculate.</li>
<li><strong>Multi-Tab Layout</strong>: Switch between calculation types without losing your input.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Students calculating exam scores and grade percentages, shoppers computing sale discounts, business owners working out profit margins and growth rates, and accountants doing tax and GST calculations.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'calculators',
    targetKeyword: 'percentage calculator',
    secondaryKeywords: ['percent calculator', 'calculate percentage online', 'percentage change calculator', 'percent increase calculator', 'what percent of calculator', 'percentage calculator online', 'how to calculate percentage', 'percentage difference calculator', 'marks percentage calculator', 'discount percentage calculator'],
    metaTitle: 'Percentage Calculator - Calculate Percentage Online Free',
    metaDescription: 'Calculate percentages, percent change, increase/decrease & discount. Free online percentage calculator with step-by-step solutions — all types covered.',
    faqs: [
      { question: 'How do I calculate X% of Y?', answer: 'Multiply X by Y and divide by 100. For example, 15% of 200 = (15 × 200) / 100 = 30. Our calculator does this instantly.' },
      { question: 'How do I calculate percentage change?', answer: 'Percentage change = ((New Value - Old Value) / Old Value) × 100. A positive result is a percentage increase; negative is a percentage decrease.' },
      { question: 'How do I find the original price after a percentage discount?', answer: 'Original Price = Discounted Price / (1 - Discount%). For example, if an item costs ₹850 after a 15% discount, the original price was 850 / 0.85 = ₹1,000.' },
      { question: 'What is the percentage difference between two numbers?', answer: 'Percentage difference = |Value1 - Value2| / ((Value1 + Value2) / 2) × 100. This is different from percentage change as it doesn\'t assume one value is the "starting" point.' },
      { question: 'How do I add a percentage to a number?', answer: 'To increase a number by X%: New Value = Original × (1 + X/100). For example, adding 10% to 500: 500 × 1.10 = 550. Use our calculator to find this instantly.' },
    ],
    howToSteps: [
      'Choose the type of percentage calculation you need from the tabs.',
      'Enter the numbers in the input fields provided.',
      'The result updates instantly as you type.',
      'Read the step-by-step explanation below the result to understand the math.',
      'Switch between calculation types without losing your inputs.',
    ],
    relatedToolSlugs: ['emi-calculator', 'gst-calculator', 'discount-calculator', 'bmi-calculator', 'age-calculator'],
    icon: 'Percent',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'emi-calculator',
    name: 'EMI Calculator',
    shortDescription: 'Calculate your monthly EMI for home, car or personal loans with amortization schedule.',
    longDescription: `<p>Our free <strong>EMI calculator</strong> helps you plan loan repayments accurately before you commit. Enter the principal amount, annual interest rate, and tenure — instantly get your monthly EMI, total interest payable, and a complete month-by-month amortization schedule.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Instant EMI Calculation</strong>: Uses the standard banking formula EMI = [P × R × (1+R)^N] / [(1+R)^N - 1].</li>
<li><strong>Amortization Schedule</strong>: Full month-by-month breakdown of principal vs. interest per EMI.</li>
<li><strong>Total Cost Summary</strong>: See total interest payable and total amount over the loan life.</li>
<li><strong>All Loan Types</strong>: Works for home loans, car loans, personal loans, and education loans.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Anyone evaluating a loan offer in India, homebuyers comparing home loan EMIs across banks, car buyers planning monthly budgets, and borrowers who want to understand the true cost of a loan before signing.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'calculators',
    targetKeyword: 'EMI calculator',
    secondaryKeywords: ['loan EMI calculator', 'home loan EMI calculator', 'home loan EMI calculator India', 'car loan EMI calculator', 'personal loan EMI calculator', 'monthly installment calculator India', 'EMI calculator online', 'loan calculator India', 'bank loan EMI calculator', 'housing loan EMI calculator'],
    metaTitle: 'EMI Calculator - Home Loan, Car & Personal Loan EMI Online Free',
    metaDescription: 'Calculate monthly EMI for home loan, car loan & personal loan with amortization schedule. Free online EMI calculator India — instant results, no signup.',
    faqs: [
      { question: 'What is EMI?', answer: 'EMI (Equated Monthly Installment) is a fixed monthly payment paid by a borrower to a lender on a specified date. Each EMI includes a portion of the principal amount and the interest. Over time, the interest portion decreases while the principal portion increases.' },
      { question: 'What is the EMI formula?', answer: 'EMI = [P × R × (1+R)^N] / [(1+R)^N - 1] where P = Principal loan amount, R = Monthly interest rate (Annual rate ÷ 12 ÷ 100), and N = Total number of monthly installments.' },
      { question: 'How does a longer tenure affect my EMI?', answer: 'A longer tenure reduces your monthly EMI but increases the total interest you pay over the life of the loan. A shorter tenure means higher EMI but less total interest. Always balance monthly affordability with total cost.' },
      { question: 'Does this calculator account for processing fees?', answer: 'The basic EMI calculation does not include processing fees, insurance, or other charges. Your bank\'s actual EMI may be slightly different due to these additional costs.' },
      { question: 'Can I use this for home loans in India?', answer: 'Yes, this calculator works perfectly for Indian home loans, car loans, and personal loans. Enter your loan amount in rupees, annual interest rate (e.g., 8.5%), and tenure in months or years.' },
    ],
    howToSteps: [
      'Enter the loan amount (principal) in the first field.',
      'Enter the annual interest rate offered by your bank.',
      'Enter the loan tenure in years or months.',
      'Your monthly EMI is calculated instantly.',
      'View the total interest, total payment, and the month-by-month amortization table.',
    ],
    relatedToolSlugs: ['sip-calculator', 'gst-calculator', 'percentage-calculator', 'discount-calculator'],
    icon: 'Landmark',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'gst-calculator',
    name: 'GST Calculator',
    shortDescription: 'Calculate GST amount, CGST, SGST, IGST for any amount and tax rate.',
    longDescription: `<p>Our free <strong>GST calculator India</strong> handles all five GST rate slabs — 0%, 5%, 12%, 18%, and 28% — for both exclusive (add GST) and inclusive (extract GST) scenarios, with a full CGST/SGST/IGST breakdown.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Add or Remove GST</strong>: Calculate GST-inclusive price from base price, or extract GST from a total.</li>
<li><strong>CGST & SGST Breakdown</strong>: Shows split for intra-state transactions (Central + State GST).</li>
<li><strong>IGST for Inter-State</strong>: Toggle to show Integrated GST for transactions across state borders.</li>
<li><strong>All GST Slabs</strong>: Covers 5%, 12%, 18%, and 28% rate slabs.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Business owners raising GST invoices, accountants filing GST returns, freelancers calculating tax on services, shoppers verifying bills, and anyone who needs quick, accurate GST computation for Indian transactions.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'calculators',
    targetKeyword: 'GST calculator',
    secondaryKeywords: ['GST calculator India', 'GST calculation online', 'CGST SGST calculator', 'GST inclusive exclusive calculator', 'tax calculator India', 'GST calculator online', 'GST rate calculator', '18% GST calculator', 'reverse GST calculator', 'IGST calculator India'],
    metaTitle: 'GST Calculator India - Calculate CGST SGST IGST Online Free',
    metaDescription: 'Calculate GST amount with CGST, SGST & IGST breakdown. Add or remove GST at 5%, 12%, 18%, 28%. Free online GST calculator India — instant, no signup.',
    faqs: [
      { question: 'What are the GST rates in India?', answer: 'India has 5 GST rate slabs: 0% (essential goods like fresh food, books), 5% (packaged food, medicine), 12% (processed food, electronics accessories), 18% (most goods and services, restaurants), and 28% (luxury goods, automobiles, tobacco).' },
      { question: 'What is the difference between CGST, SGST, and IGST?', answer: 'For intra-state transactions (buyer and seller in the same state): CGST + SGST = Total GST, each being half the total rate. For inter-state transactions: IGST = Total GST rate. IGST is then split between central and destination state governments.' },
      { question: 'How do I calculate GST exclusive price from GST inclusive price?', answer: 'GST-exclusive price = GST-inclusive price / (1 + GST rate/100). For example, if a product costs ₹1,180 with 18% GST, the base price = 1180 / 1.18 = ₹1,000.' },
      { question: 'How do I add GST to a base price?', answer: 'GST-inclusive price = Base price × (1 + GST rate/100). For example, ₹1,000 with 18% GST = 1000 × 1.18 = ₹1,180.' },
      { question: 'Is GST applicable on exports?', answer: 'No, exports are zero-rated under GST. Exporters can claim refund of input tax credit on zero-rated supplies.' },
    ],
    howToSteps: [
      'Enter the original amount (either base price or GST-inclusive price).',
      'Select the applicable GST rate: 5%, 12%, 18%, or 28%.',
      'Choose whether the amount already includes GST or excludes GST.',
      'View the GST amount, CGST, SGST/IGST breakdown, and final price instantly.',
      'Toggle between intra-state and inter-state to switch between CGST+SGST and IGST.',
    ],
    relatedToolSlugs: ['percentage-calculator', 'emi-calculator', 'discount-calculator', 'sip-calculator'],
    icon: 'Receipt',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    shortDescription: 'Calculate your Body Mass Index and find out if you are underweight, normal or obese.',
    longDescription: `<p>Our free <strong>BMI calculator</strong> gives you an instant Body Mass Index score along with your weight category — Underweight, Normal, Overweight, or Obese — and a visual position on the WHO BMI scale. Supports both metric (kg/cm) and imperial (lbs/ft/in) units.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Instant BMI Score</strong>: Calculates BMI = Weight (kg) / Height (m)² in real time.</li>
<li><strong>Weight Category</strong>: Shows your WHO classification and a visual scale indicator.</li>
<li><strong>Healthy Weight Range</strong>: Displays exactly how much weight to gain or lose to reach normal BMI.</li>
<li><strong>Metric & Imperial</strong>: Switch between kg/cm and lbs/ft/in units.</li>
<li><strong>Asian BMI Standards</strong>: Option to apply lower WHO cutoffs recommended for Asian populations.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Adults monitoring their weight status, people on fitness journeys tracking progress, healthcare students learning BMI assessment, and anyone filling out health forms that ask for BMI.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'calculators',
    targetKeyword: 'BMI calculator',
    secondaryKeywords: ['body mass index calculator', 'BMI calculator India', 'BMI calculator kg cm', 'healthy weight calculator', 'BMI calculator online', 'BMI check online', 'BMI calculator for men', 'BMI calculator for women', 'Asian BMI calculator', 'weight calculator BMI'],
    metaTitle: 'BMI Calculator - Check Body Mass Index Online Free',
    metaDescription: 'Calculate your BMI instantly with height & weight. Check if underweight, normal, overweight or obese. Free online BMI calculator — metric & imperial, no signup.',
    faqs: [
      { question: 'What is a normal BMI range?', answer: 'According to WHO: Underweight: BMI < 18.5, Normal weight: 18.5–24.9, Overweight: 25.0–29.9, Obese Class I: 30.0–34.9, Obese Class II: 35.0–39.9, Obese Class III (Morbidly Obese): ≥ 40.' },
      { question: 'What is the BMI formula?', answer: 'BMI = Weight (kg) / Height (m)². For imperial units: BMI = (Weight in pounds / Height in inches²) × 703.' },
      { question: 'Is BMI accurate for athletes and bodybuilders?', answer: 'No. BMI does not distinguish between muscle and fat. Athletes and bodybuilders often have high BMI scores despite having low body fat percentages. For them, body fat percentage measurement is more accurate.' },
      { question: 'Is BMI different for Asians?', answer: 'Yes. The WHO has recommended lower BMI cutoffs for Asian populations. For Asians: Underweight <18.5, Normal 18.5–22.9, Overweight 23.0–24.9, Obese ≥25. Our calculator uses standard WHO thresholds with an option to apply Asian standards.' },
      { question: 'Can children use this BMI calculator?', answer: 'This calculator is designed for adults (18+). For children and teens, BMI is interpreted differently using age and sex-specific percentiles. Consult a pediatrician for children\'s weight assessment.' },
    ],
    howToSteps: [
      'Select your unit system: Metric (kg/cm) or Imperial (lbs/ft/in).',
      'Enter your height in the appropriate unit.',
      'Enter your current weight.',
      'Your BMI and weight category are calculated instantly.',
      'View the healthy weight range for your height and your position on the BMI scale.',
    ],
    relatedToolSlugs: ['age-calculator', 'percentage-calculator', 'unit-converter', 'temperature-converter'],
    icon: 'Activity',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'sip-calculator',
    name: 'SIP Calculator',
    shortDescription: 'Calculate SIP returns and future value of your mutual fund investments.',
    longDescription: `<p>Our free <strong>SIP calculator India</strong> estimates the future value of your mutual fund Systematic Investment Plan. Enter your monthly amount, expected annual returns, and duration — instantly see your total invested amount, estimated returns, and final wealth corpus.</p>
<h2>Key Features</h2>
<ul>
<li><strong>SIP Returns Calculation</strong>: Uses the standard SIP formula to project maturity value accurately.</li>
<li><strong>Growth Chart</strong>: Visual chart showing how your wealth compounds over the investment period.</li>
<li><strong>Total vs. Returns Breakdown</strong>: See exactly how much is your investment vs. gains.</li>
<li><strong>Adjustable Inputs</strong>: Tweak monthly amount, rate, and duration to model different scenarios.</li>
</ul>
<h2>Who Is This For?</h2>
<p>First-time mutual fund investors in India, financial planners building wealth projections, anyone comparing SIP options, and salaried professionals wanting to understand how small monthly investments grow over 10–30 years.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'calculators',
    targetKeyword: 'SIP calculator',
    secondaryKeywords: ['SIP calculator India', 'mutual fund SIP calculator', 'SIP return calculator', 'systematic investment plan calculator', 'investment calculator India', 'SIP calculator online', 'monthly SIP calculator', 'SIP interest calculator', 'SIP maturity calculator', 'best SIP calculator India'],
    metaTitle: 'SIP Calculator India - Mutual Fund SIP Returns Calculator Free',
    metaDescription: 'Calculate SIP returns & future value of mutual fund investments with growth chart. Free online SIP calculator India — instant results, no signup needed.',
    faqs: [
      { question: 'What is SIP?', answer: 'SIP (Systematic Investment Plan) is a method of investing a fixed sum regularly in mutual funds. Instead of investing a lump sum, SIP allows you to invest monthly, weekly, or quarterly, reducing market timing risk through rupee cost averaging.' },
      { question: 'What is the SIP formula?', answer: 'M = P × ({[1 + i]^n – 1} / i) × (1 + i), where M = Maturity amount, P = Monthly investment, i = Monthly interest rate (Annual rate / 12 / 100), n = Number of months.' },
      { question: 'What is a good expected return rate for SIP?', answer: 'For equity mutual funds, 10-15% annual returns are historically reasonable over long periods (10+ years). Debt funds: 6-8%. Balanced funds: 8-12%. These are estimates; actual returns vary with market conditions.' },
      { question: 'What is the minimum SIP amount?', answer: 'Most mutual funds allow SIPs starting from ₹100 or ₹500 per month. Many platforms have reduced minimums to ₹100 to encourage small investors.' },
      { question: 'Is SIP risk-free?', answer: 'No. SIP in equity mutual funds involves market risk. SIP reduces timing risk through averaging but does not eliminate investment risk. Debt fund SIPs are lower risk but offer lower returns.' },
    ],
    howToSteps: [
      'Enter your monthly SIP amount in rupees.',
      'Enter the expected annual return rate (e.g., 12 for 12%).',
      'Enter the investment period in years.',
      'View the total invested, estimated returns, and final wealth amount.',
      'Adjust values to see how different amounts and periods affect your goals.',
    ],
    relatedToolSlugs: ['emi-calculator', 'percentage-calculator', 'gst-calculator', 'discount-calculator'],
    icon: 'TrendingUp',
    estimatedTime: 'Instant',
  },
  {
    slug: 'salary-calculator',
    name: 'Salary Calculator (CTC to In-Hand)',
    shortDescription: 'Calculate your in-hand salary from CTC with Old vs New Tax Regime comparison for FY 2025-26.',
    longDescription: `<p>India's most accurate <strong>salary calculator India</strong> for FY 2025-26. Enter your annual CTC and instantly see your monthly take-home salary with a complete component breakdown — Basic, HRA, PF, Gratuity, Professional Tax, and Income Tax — plus an Old vs New Tax Regime comparison.</p>\n<h2>Key Features</h2>\n<ul>\n<li><strong>Full Salary Breakup</strong>: Basic, HRA, Special Allowance, employer PF, gratuity, and all deductions.</li>\n<li><strong>Old vs New Tax Regime</strong>: Side-by-side comparison with automatic recommendation of which saves more.</li>\n<li><strong>Deductions Support</strong>: Enter 80C, 80D, 80CCD(1B), home loan interest, and HRA exemption for Old Regime.</li>\n<li><strong>Budget 2025 Updated</strong>: New regime basic exemption at ₹4L, rebate up to ₹12L, ₹75K standard deduction.</li>\n<li><strong>Visual Chart & Presets</strong>: Salary distribution chart, annual/monthly toggle, CTC presets from ₹3L to ₹50L.</li>\n</ul>\n<h2>Who Is This For?</h2>\n<p>Salaried employees evaluating job offers, HR professionals explaining CTC structures, individuals doing annual tax planning, and anyone who wants to understand their exact take-home salary under both tax regimes in India.</p>\n<h2>Privacy & Security</h2>\n<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'calculators',
    targetKeyword: 'salary calculator India',
    secondaryKeywords: ['CTC to in-hand salary calculator', 'CTC calculator', 'take home salary calculator', 'in-hand salary calculator', 'old vs new tax regime calculator', 'salary breakup calculator', 'income tax calculator FY 2025-26', 'CTC to net salary', 'salary after tax India', 'salary calculator online India', 'CTC to take home calculator', 'monthly salary calculator'],
    metaTitle: 'Salary Calculator India - CTC to In-Hand Salary | FY 2025-26',
    metaDescription: 'Calculate in-hand salary from CTC for FY 2025-26. Compare Old vs New Tax Regime with full breakup — PF, HRA, tax. Free salary calculator India — instant results.',
    faqs: [
      { question: 'What is CTC and how is it different from in-hand salary?', answer: 'CTC (Cost to Company) is the total amount a company spends on an employee per year, including Basic, HRA, PF (employer share), gratuity, bonus, and all allowances. In-hand (take-home) salary is what you actually receive after deducting employee PF, professional tax, and income tax from your gross salary.' },
      { question: 'How is in-hand salary calculated from CTC?', answer: 'Gross Salary = CTC - Employer PF - Gratuity. Then In-Hand = Gross Salary - Employee PF - Professional Tax - Income Tax. For example, on a 10 LPA CTC with 40% basic, your monthly in-hand is approximately 69,000-72,000 depending on your tax regime and deductions.' },
      { question: 'Which is better — Old or New Tax Regime for FY 2025-26?', answer: 'The New Regime is better if your total deductions (80C, 80D, HRA, home loan) are less than about 3-4 lakhs. The Old Regime is better if you have significant deductions like home loan interest, HRA exemption, and full 80C investments. Our calculator compares both automatically.' },
      { question: 'What is the PF cap of 15,000?', answer: 'Most companies cap PF contribution at a basic salary of 15,000/month. This means both employer and employee PF is calculated on 15,000 (i.e., 1,800/month each) regardless of actual basic salary. Some companies contribute PF on the full basic salary — toggle the cap option accordingly.' },
      { question: 'What are the new tax slabs for FY 2025-26?', answer: 'Under the New Regime: 0-4L (Nil), 4-8L (5%), 8-12L (10%), 12-16L (15%), 16-20L (20%), 20-24L (25%), above 24L (30%). Standard deduction is 75,000. Income up to 12L is effectively tax-free due to the rebate under Section 87A.' },
      { question: 'Is Professional Tax the same in all states?', answer: 'No. Professional Tax varies by state. Most states charge 2,400/year (200/month). Karnataka charges 2,400 for salary above 15,000/month. Some states like Rajasthan and Delhi do not levy professional tax. Adjust the value in the calculator as per your state.' },
    ],
    howToSteps: [
      'Enter your Annual CTC (Cost to Company) in rupees, or use a quick preset.',
      'Adjust Basic Salary percentage (default 40%) and HRA percentage if different from your offer letter.',
      'Toggle PF cap and Gratuity options based on your company policy.',
      'For Old Regime comparison, expand "Old Regime Deductions" and enter 80C, 80D, rent, home loan values.',
      'View your complete salary breakup, tax comparison, and which regime saves you more money.',
      'Switch between Annual and Monthly views. Use the visual chart to understand salary distribution.',
    ],
    relatedToolSlugs: ['emi-calculator', 'gst-calculator', 'sip-calculator', 'percentage-calculator'],
    icon: 'IndianRupee',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    shortDescription: 'Calculate sale price, discount amount and savings percentage instantly.',
    longDescription: `<p>Our free <strong>discount calculator</strong> makes shopping math instant. Enter the original price and discount percentage to see the sale price and your savings — or work backwards from the sale price to find the discount percentage applied.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Discount to Sale Price</strong>: Enter original price + discount % → get sale price and savings amount.</li>
<li><strong>Reverse Mode</strong>: Enter original and sale price to calculate the discount percentage.</li>
<li><strong>Stacked Discounts</strong>: Calculate the correct combined discount when discounts are applied on top of each other.</li>
<li><strong>Instant Results</strong>: All calculations update in real time as you type.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Online shoppers comparing deals during Diwali or Big Billion Day sales, retailers setting promotional prices, students studying percentage problems, and anyone who wants quick, accurate discount math without mental arithmetic.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'calculators',
    targetKeyword: 'discount calculator',
    secondaryKeywords: ['sale price calculator', 'percent off calculator', 'discount percentage calculator', 'how much discount calculator', 'savings calculator'],
    metaTitle: 'Discount Calculator - Calculate Sale Price & Savings Online',
    metaDescription: 'Calculate discount amount, sale price & savings percentage instantly. Find what % off any price. Free online discount calculator — no signup required.',
    faqs: [
      { question: 'How do I calculate a 20% discount?', answer: 'Discounted price = Original price × (1 - 20/100) = Original price × 0.80. For example, 20% off ₹1,000 = ₹1,000 × 0.80 = ₹800. You save ₹200.' },
      { question: 'How do I calculate the original price from a discounted price?', answer: 'Original price = Sale price / (1 - Discount%). If a product costs ₹600 after a 25% discount, original = 600 / 0.75 = ₹800.' },
      { question: 'What is the difference between 20% off and 20% discount?', answer: 'These mean the same thing. "20% off" and "20% discount" both mean the price is reduced by 20% of the original price.' },
      { question: 'How does stacked/double discount work?', answer: 'A stacked discount multiplies the savings. 20% off, then an additional 10% off = 1 - (0.80 × 0.90) = 1 - 0.72 = 28% total discount, NOT 30%.' },
      { question: 'What is the best way to compare discounts?', answer: 'Always compare the final price, not just the discount percentage. A 50% off item that was overpriced may be more expensive than a 20% off item at a fair price.' },
    ],
    howToSteps: [
      'Enter the original price of the product.',
      'Enter the discount percentage (e.g., 30 for 30% off).',
      'The sale price and savings amount are shown instantly.',
      'Use the reverse mode to enter sale price and find the discount percentage.',
      'Add a second discount for stacked discount calculations.',
    ],
    relatedToolSlugs: ['percentage-calculator', 'gst-calculator', 'emi-calculator', 'bmi-calculator'],
    icon: 'Tag',
    estimatedTime: 'Instant',
  },

  // ─── DEVELOPER TOOLS ──────────────────────────────────────────────────────
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    shortDescription: 'Format, validate, minify and beautify JSON data online instantly.',
    longDescription: `<p>Our free online <strong>JSON formatter</strong> and validator is an essential tool for any developer working with APIs, config files, or data interchange. Paste any minified or messy JSON and instantly get a beautifully formatted, syntax-highlighted, human-readable output.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Format & Beautify</strong>: Adds proper indentation and line breaks for readability.</li>
<li><strong>Validate with Error Location</strong>: Shows the exact line and column of any syntax error.</li>
<li><strong>Minify</strong>: Removes all whitespace for compact production payloads.</li>
<li><strong>Tree View</strong>: Visually explore nested objects and arrays with collapse/expand nodes.</li>
<li><strong>Handles Large JSON</strong>: Processes multi-MB JSON files comfortably in modern browsers.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Backend and frontend developers debugging API responses, DevOps engineers reading config files, data engineers inspecting large JSON datasets, and anyone who needs to quickly read or validate JSON data.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'JSON formatter',
    secondaryKeywords: ['JSON beautifier', 'JSON validator', 'JSON minifier', 'format JSON online', 'JSON prettifier', 'JSON viewer', 'JSON formatter online', 'JSON format validator', 'JSON editor online', 'beautify JSON online free'],
    metaTitle: 'JSON Formatter Online - Format, Validate & Beautify JSON Free',
    metaDescription: 'Format, validate, minify & beautify JSON instantly. Syntax highlighting, error detection, tree view. Free online JSON formatter — no signup needed.',
    faqs: [
      { question: 'What is JSON?', answer: 'JSON (JavaScript Object Notation) is a lightweight data-interchange format. It\'s easy for humans to read and write, and easy for machines to parse and generate. JSON is used extensively in web APIs, configuration files, and data storage.' },
      { question: 'What is the difference between formatting and minifying JSON?', answer: 'Formatting (beautifying) adds indentation and line breaks to make JSON readable by humans. Minifying removes all unnecessary whitespace, making the file smaller for faster network transfer and production use.' },
      { question: 'What are common JSON syntax errors?', answer: 'Common errors: missing/extra commas, unquoted keys, single quotes instead of double quotes, trailing commas in arrays/objects, unescaped special characters in strings, and unclosed brackets or braces.' },
      { question: 'Can I use this to validate JSON from an API?', answer: 'Yes. Copy the response body from any API call (Postman, browser DevTools, etc.) and paste it here to validate and format it for easy reading.' },
      { question: 'What is the maximum JSON size this tool handles?', answer: 'The tool handles JSON up to several MB comfortably in modern browsers. For very large JSON files (50MB+), consider using a desktop tool like VS Code.' },
    ],
    howToSteps: [
      'Paste your raw or minified JSON into the input panel.',
      'The tool validates and formats it instantly with syntax highlighting.',
      'If there\'s an error, the error message shows the exact location.',
      'Switch between "Formatted", "Minified", and "Tree View" modes.',
      'Click "Copy" to copy the formatted JSON to your clipboard.',
    ],
    relatedToolSlugs: ['base64-encode-decode', 'url-encode-decode', 'hash-generator', 'regex-tester', 'html-to-markdown'],
    icon: 'Braces',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'base64-encode-decode',
    name: 'Base64 Encode & Decode',
    shortDescription: 'Encode text or files to Base64 and decode Base64 strings back to text.',
    longDescription: `<p>Our free <strong>Base64 encode decode</strong> tool handles both encoding (text or file → Base64) and decoding (Base64 → text) in a clean, simple interface. Base64 is the standard encoding for embedding images in HTML/CSS, HTTP auth headers, MIME email attachments, and JSON/XML binary payloads.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Text & File Encoding</strong>: Encode any text string or upload a file (image, PDF, document) to Base64.</li>
<li><strong>Instant Decoding</strong>: Paste any Base64 string and decode it back to text or download as a file.</li>
<li><strong>Data URI Ready</strong>: Output includes the correct data URI prefix for direct use in HTML and CSS.</li>
<li><strong>URL-Safe Option</strong>: Replaces + and / with - and _ for URL-safe Base64 output.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers debugging API authentication headers, web developers embedding images in HTML without separate files, backend engineers encoding binary data for JSON payloads, and anyone working with Base64-encoded data in any context.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'Base64 encode decode',
    secondaryKeywords: ['base64 encoder', 'base64 decoder', 'base64 online', 'encode to base64', 'decode base64 string', 'base64 converter'],
    metaTitle: 'Base64 Encode & Decode - Free Online Base64 Converter',
    metaDescription: 'Encode text or files to Base64 and decode Base64 strings instantly. Free online Base64 encoder/decoder — supports images, text & binary files.',
    faqs: [
      { question: 'What is Base64 encoding?', answer: 'Base64 converts binary data into a 64-character ASCII alphabet (A-Z, a-z, 0-9, +, /) so binary data can be safely transmitted over text-based protocols like email or HTTP headers. Every 3 bytes of binary data becomes 4 Base64 characters.' },
      { question: 'Why does Base64 encoded data end with "=="?', answer: 'Base64 encodes data in 3-byte groups. If the input length isn\'t divisible by 3, padding characters (=) are added to make the output length a multiple of 4. One = means 2 bytes remain; == means 1 byte remains.' },
      { question: 'Is Base64 the same as encryption?', answer: 'No! Base64 is encoding, not encryption. Anyone can decode a Base64 string. Do NOT use Base64 to hide sensitive data — use proper encryption like AES or RSA instead.' },
      { question: 'How do I embed a Base64 image in HTML?', answer: 'Use this format: <img src="data:image/png;base64,{BASE64_STRING}" />. Replace {BASE64_STRING} with your encoded image data and change "image/png" to the correct MIME type.' },
      { question: 'What is URL-safe Base64?', answer: 'Standard Base64 uses + and / which have special meanings in URLs. URL-safe Base64 replaces + with - and / with _, making it safe for use in URLs and filenames without percent-encoding.' },
    ],
    howToSteps: [
      'Select "Encode" or "Decode" mode using the toggle.',
      'For encoding: paste your text or upload a file.',
      'For decoding: paste your Base64 string.',
      'The result appears instantly below.',
      'Click "Copy" to copy the output, or "Download" for file results.',
    ],
    relatedToolSlugs: ['url-encode-decode', 'hash-generator', 'json-formatter', 'image-to-base64'],
    icon: 'Binary',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'url-encode-decode',
    name: 'URL Encode & Decode',
    shortDescription: 'Encode and decode URL components and query strings instantly.',
    longDescription: `<p>Our free <strong>URL encode decode</strong> tool converts special characters in URLs to their percent-encoded equivalents and back. Handles both full URL encoding (preserves URL structure) and component encoding (strictly encodes all special characters for query parameter values).</p>
<h2>Key Features</h2>
<ul>
<li><strong>Full URL Mode</strong>: Encodes only unsafe characters while preserving :, /, ?, &, = structure.</li>
<li><strong>Component Mode</strong>: Strictly encodes every special character for safe use in query parameter values.</li>
<li><strong>Unicode & Emoji Support</strong>: Correctly handles UTF-8 multi-byte characters and emojis.</li>
<li><strong>Instant Decode</strong>: Paste any percent-encoded string to decode it back to readable text.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers building and debugging API requests, web analytics engineers decoding query strings, marketers inspecting redirect URLs, and anyone who needs to understand or construct properly encoded URLs.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'URL encode decode',
    secondaryKeywords: ['percent encoding', 'url encoder', 'url decoder online', 'encode url parameters', 'query string encoder', 'uri encode decode'],
    metaTitle: 'URL Encode & Decode - Free Online URL Encoder Decoder',
    metaDescription: 'Encode and decode URL components and query strings instantly. Handles UTF-8, emojis & special chars. Free online URL encoder/decoder — no signup.',
    faqs: [
      { question: 'What is URL encoding?', answer: 'URL encoding replaces unsafe ASCII characters with a % followed by two hexadecimal digits. For example, a space becomes %20, & becomes %26, and = becomes %3D. This ensures URLs are safely transmitted and parsed correctly.' },
      { question: 'What characters need to be URL encoded?', answer: 'Reserved characters with special meaning in URLs (? & = # % + / : @ ! $ \' , ; *), spaces, and any non-ASCII character (including Unicode/emojis) must be encoded.' },
      { question: 'What is the difference between encodeURI and encodeURIComponent?', answer: 'encodeURI encodes a full URL, preserving characters like :, /, ?, &, =, #. encodeURIComponent encodes a single URL component (like a query parameter value), encoding ALL special characters including those preserved by encodeURI.' },
      { question: 'Why is + sometimes used for space in URLs?', answer: 'In query strings (after ?), application/x-www-form-urlencoded format uses + to represent spaces (legacy from HTML form encoding). In path segments, spaces must be encoded as %20. Our tool handles both conventions.' },
      { question: 'How do I encode a URL with Chinese or Arabic characters?', answer: 'Non-ASCII characters are first encoded to UTF-8 bytes, then each byte is percent-encoded. For example, the Chinese character 中 (UTF-8: E4 B8 AD) becomes %E4%B8%AD.' },
    ],
    howToSteps: [
      'Select "Encode" or "Decode" mode.',
      'Paste your URL or query string into the input field.',
      'Choose "Full URL" mode to preserve URL structure or "Component" for strict encoding.',
      'The encoded/decoded result appears instantly.',
      'Click "Copy" to copy the result to your clipboard.',
    ],
    relatedToolSlugs: ['base64-encode-decode', 'json-formatter', 'hash-generator', 'text-to-slug'],
    icon: 'Link2',
    estimatedTime: 'Instant',
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    shortDescription: 'Generate QR codes for URLs, text, email, phone numbers and WiFi credentials.',
    longDescription: `<p>Our free <strong>QR code generator</strong> creates high-quality QR codes instantly for URLs, plain text, email addresses, phone numbers, SMS, WhatsApp messages, and WiFi credentials — downloadable as PNG or SVG, no watermark.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Multiple Content Types</strong>: URL, text, email, phone, SMS, WhatsApp, WiFi, and more.</li>
<li><strong>PNG & SVG Download</strong>: SVG for print (infinite resolution), PNG for digital use.</li>
<li><strong>Error Correction Levels</strong>: L, M, Q, H — higher levels allow scanning even if partially damaged.</li>
<li><strong>Custom Colors & Size</strong>: Match your brand with color customization and size control.</li>
<li><strong>WiFi QR Codes</strong>: Guests scan to connect to your network automatically — no password typing needed.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Businesses creating restaurant menus, business cards, and product packaging; event organizers linking to tickets; marketers running print campaigns; and anyone who needs a free, instant, no-watermark QR code.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'QR code generator',
    secondaryKeywords: ['QR code maker', 'free QR code generator', 'QR code generator online', 'generate QR code for URL', 'WiFi QR code generator', 'QR code creator online free', 'custom QR code generator', 'QR code generator free', 'WhatsApp QR code generator', 'QR code for business card'],
    metaTitle: 'QR Code Generator Free - Create Custom QR Codes Online',
    metaDescription: 'Generate QR codes for URLs, text, WiFi, email & more. Download PNG or SVG. Free online QR code generator — instant, customizable, no signup needed.',
    faqs: [
      { question: 'Are the generated QR codes free to use commercially?', answer: 'Yes. QR codes themselves are in the public domain. QR codes generated with our tool can be used freely for personal and commercial purposes without any attribution or license fee.' },
      { question: 'What is error correction level in QR codes?', answer: 'Error correction allows a QR code to be readable even if part of it is damaged or covered. Levels: L (7% damage), M (15%), Q (25%), H (30%). Higher levels make the QR code larger but more resilient — recommended for printed materials.' },
      { question: 'What is the maximum data a QR code can hold?', answer: 'Up to 7,089 numeric characters, 4,296 alphanumeric characters, 2,953 bytes of binary data, or 1,817 Kanji characters at the lowest error correction level. Simpler data (short URLs) creates smaller, faster-scanning QR codes.' },
      { question: 'Can I generate QR codes for WiFi networks?', answer: 'Yes! Enter your WiFi SSID, password, and security type (WPA/WEP/None). Scanning the QR code connects to the network automatically on Android and iOS without manually typing the password.' },
      { question: 'What format should I download the QR code in?', answer: 'For print: download SVG — it scales to any size without pixelation. For digital use: PNG at 512px or higher. Avoid JPG as compression artifacts can make the QR code harder to scan.' },
    ],
    howToSteps: [
      'Select the QR code type: URL, Text, Email, Phone, WiFi, etc.',
      'Enter the content for your QR code.',
      'Adjust size, error correction level, and colors if needed.',
      'The QR code preview updates in real time.',
      'Click "Download PNG" or "Download SVG" to save your QR code.',
    ],
    relatedToolSlugs: ['base64-encode-decode', 'url-encode-decode', 'color-picker', 'hash-generator'],
    icon: 'QrCode',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    shortDescription: 'Pick colors and convert between HEX, RGB, HSL, and HSV color formats.',
    longDescription: `<p>Our comprehensive free <strong>color picker</strong> lets you pick any color visually and instantly get its values in all major formats: HEX, RGB, HSL, and HSV/HSB — with full alpha/opacity support for RGBA and HSLA.</p>\n<h2>Key Features</h2>\n<ul>\n<li><strong>All Color Formats</strong>: Pick once and get HEX, RGB, HSL, and HSV values simultaneously.</li>\n<li><strong>Alpha Channel</strong>: Full opacity/transparency control with RGBA and HSLA output.</li>\n<li><strong>Shades & Tints</strong>: Auto-generated lighter and darker variations of your chosen color.</li>\n<li><strong>Complementary Colors</strong>: See complementary, analogous, and triadic color combinations.</li>\n<li><strong>Direct Input</strong>: Type any HEX or RGB value to convert to all other formats instantly.</li>\n</ul>\n<h2>Who Is This For?</h2>\n<p>Web designers picking brand colors, frontend developers converting HEX to RGB for CSS variables, Figma and Tailwind CSS users finding exact color values, and anyone building accessible, harmonious color palettes.</p>\n<h2>Privacy & Security</h2>\n<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'color picker',
    secondaryKeywords: ['color converter online', 'hex to rgb converter', 'rgb to hex', 'hsl color picker', 'color code picker online', 'color picker online', 'html color picker', 'hex color picker', 'color picker from image', 'color code generator'],
    metaTitle: 'Color Picker Online - HEX, RGB, HSL Converter & Palette Free',
    metaDescription: 'Pick colors & convert between HEX, RGB, HSL, HSV. Get shades, tints & complementary colors. Free online color picker — instant, no signup needed.',
    faqs: [
      { question: 'What is the difference between HEX, RGB, and HSL?', answer: 'HEX (#RRGGBB) is a 6-digit hexadecimal representation of red, green, blue values. RGB(r, g, b) uses numbers 0-255 for each channel. HSL(h, s, l) uses Hue (0-360°), Saturation (0-100%), and Lightness (0-100%) — more intuitive for designers.' },
      { question: 'How do I convert HEX to RGB?', answer: 'Split the HEX code into 3 pairs of hex digits and convert each to decimal. For #1e40af: R=0x1e=30, G=0x40=64, B=0xaf=175, so RGB(30, 64, 175). Our tool does this automatically.' },
      { question: 'What is opacity/alpha in colors?', answer: 'Alpha channel represents transparency (0 = fully transparent, 1 = fully opaque). In CSS, use rgba(30, 64, 175, 0.5) for 50% transparent, or HEX with alpha like #1e40af80.' },
      { question: 'What are complementary colors?', answer: 'Complementary colors are opposite each other on the color wheel (hue difference of 180°). They create high contrast when used together. Example: Blue (#1e40af) and Orange (#af7a1e) are complementary.' },
      { question: 'How do I use this for Tailwind CSS?', answer: 'Tailwind uses a specific color palette. Use our tool to find the closest Tailwind color to your HEX code, or use it to define custom colors in tailwind.config.js using the exact HEX values.' },
    ],
    howToSteps: [
      'Click anywhere on the color palette to pick a color, or drag the crosshair.',
      'Adjust the hue slider to change the base color.',
      'Adjust the opacity slider for transparent colors.',
      'Copy the color value in HEX, RGB, HSL, or HSV format using the copy buttons.',
      'Enter a HEX or RGB value directly in the input to convert to all formats.',
    ],
    relatedToolSlugs: ['image-compressor', 'qr-code-generator', 'hash-generator', 'html-to-markdown'],
    icon: 'Palette',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    shortDescription: 'Generate MD5, SHA-1, SHA-256, SHA-512 cryptographic hashes from text or files.',
    longDescription: `<p>Our free <strong>hash generator</strong> creates cryptographic hash digests from text or files using MD5, SHA-1, SHA-224, SHA-256, SHA-384, and SHA-512 algorithms — all computed simultaneously so you can compare and choose the right one.</p>
<h2>Key Features</h2>
<ul>
<li><strong>6 Algorithms</strong>: MD5, SHA-1, SHA-224, SHA-256, SHA-384, and SHA-512 all shown at once.</li>
<li><strong>Text & File Input</strong>: Hash any string or upload a file to generate its checksum.</li>
<li><strong>Verify Mode</strong>: Check if an input matches a known hash value — useful for download verification.</li>
<li><strong>Security Notes</strong>: Warns that MD5 and SHA-1 are broken for security; recommends SHA-256 or higher.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers verifying file downloads, security engineers checking data integrity, DevOps professionals comparing checksums, and anyone who needs to generate or verify cryptographic hash values.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your input never reaches any server. No signup, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'hash generator',
    secondaryKeywords: ['md5 generator', 'sha256 generator', 'sha-1 online', 'cryptographic hash tool', 'file hash calculator', 'checksum generator'],
    metaTitle: 'Hash Generator - MD5, SHA-256, SHA-512 Online Free',
    metaDescription: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text or files. Free online hash generator — verify file integrity & checksums. 100% private.',
    faqs: [
      { question: 'What is a cryptographic hash?', answer: 'A hash function takes arbitrary-length input and produces a fixed-length output (digest). It\'s a one-way function — you cannot reverse a hash to get the original input. The same input always gives the same hash; different inputs give different hashes (ideally).' },
      { question: 'What is MD5 used for?', answer: 'MD5 produces a 128-bit (32 hex characters) hash, commonly used to verify file downloads (checksums). While broken for security purposes, MD5 is still fine for non-security checksums like checking if a file was corrupted during transfer.' },
      { question: 'Is SHA-256 safe for passwords?', answer: 'Bare SHA-256 is NOT recommended for passwords. It\'s too fast — attackers can test billions of guesses per second. Use bcrypt, Argon2id, or PBKDF2 for passwords as they are intentionally slow and include salting.' },
      { question: 'How do I verify a file\'s integrity with a hash?', answer: 'Upload the file, generate its hash with the same algorithm used by the source (usually SHA-256). Compare your generated hash with the hash provided by the source. If they match exactly, the file is unmodified.' },
      { question: 'What is a hash collision?', answer: 'A collision is when two different inputs produce the same hash output. MD5 and SHA-1 have known collision attacks. SHA-256 has no known practical collision attacks and is considered secure.' },
    ],
    howToSteps: [
      'Type or paste text in the input field, or upload a file.',
      'The hashes are calculated instantly for all algorithms.',
      'Select which algorithm(s) you need: MD5, SHA-1, SHA-256, etc.',
      'Click the "Copy" button next to any hash to copy it.',
      'Use the "Verify" tab to check if an input matches a known hash.',
    ],
    relatedToolSlugs: ['base64-encode-decode', 'url-encode-decode', 'json-formatter', 'regex-tester'],
    icon: 'ShieldCheck',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    shortDescription: 'Test and debug regular expressions with real-time match highlighting.',
    longDescription: `<p>Our free <strong>regex tester</strong> provides a real-time environment to write, test, and debug regular expressions with instant visual feedback — matches are color-highlighted as you type, with full capture group and flag support.</p>\n<h2>Key Features</h2>\n<ul>\n<li><strong>Real-Time Highlighting</strong>: Matches highlighted instantly as you type your pattern.</li>\n<li><strong>All Regex Flags</strong>: Toggle g, i, m, s, u, and y flags with simple buttons.</li>\n<li><strong>Capture Groups</strong>: See all named and numbered capture group values clearly displayed.</li>\n<li><strong>JavaScript Engine</strong>: Uses browser RegExp — compatible with JS, TypeScript, and most modern languages.</li>\n</ul>\n<h2>Who Is This For?</h2>\n<p>Developers building form validation and data extraction, data engineers parsing log files, QA engineers writing test patterns, and anyone learning or debugging regular expressions.</p>\n<h2>Privacy &amp; Security</h2>\n<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'regex tester',
    secondaryKeywords: ['regular expression tester', 'regex validator online', 'regex debugger', 'test regex online', 'regex checker', 'javascript regex tester'],
    metaTitle: 'Regex Tester - Test Regular Expressions Online Free',
    metaDescription: 'Test & debug regular expressions with real-time highlighting. See matches, groups & captures. Free online regex tester — JavaScript regex, all flags supported.',
    faqs: [
      { question: 'What is a regular expression?', answer: 'A regular expression (regex) is a sequence of characters that defines a search pattern. Regex can match specific strings, validate formats (email, phone), extract data, and perform find-and-replace operations in text.' },
      { question: 'What regex engine does this tool use?', answer: 'This tool uses JavaScript\'s built-in RegExp engine, which follows the ECMAScript regex specification. It\'s compatible with patterns used in JavaScript, TypeScript, and most modern programming languages.' },
      { question: 'What are regex flags?', answer: 'Flags modify how the pattern matches: g (global) — find all matches; i (case insensitive) — match regardless of case; m (multiline) — ^ and $ match line start/end; s (dotAll) — dot matches newlines; u (unicode) — full Unicode support.' },
      { question: 'How do I match an email address with regex?', answer: 'A simple email regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/. Note that a truly comprehensive email regex is extremely complex — for production, use an email validation library.' },
      { question: 'What are capture groups?', answer: 'Parentheses () create capture groups that extract specific parts of a match. (?:...) is a non-capturing group. Named groups (?<name>...) let you reference captures by name instead of number.' },
    ],
    howToSteps: [
      'Enter your regular expression pattern in the "Regex" field.',
      'Toggle flags (g, i, m, s, u) using the flag buttons.',
      'Enter or paste your test string in the "Test String" area.',
      'Matches are highlighted in real time with different colors for each match.',
      'See all match details, capture groups, and indices in the results panel.',
    ],
    relatedToolSlugs: ['json-formatter', 'hash-generator', 'base64-encode-decode', 'url-encode-decode'],
    icon: 'Search',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'html-to-markdown',
    name: 'HTML to Markdown',
    shortDescription: 'Convert HTML code to clean Markdown syntax instantly.',
    longDescription: `<p>Convert HTML to Markdown format with our fast, accurate <strong>HTML to Markdown converter</strong>. Whether you're migrating content from an HTML website to a static site generator (Hugo, Jekyll, Gatsby), converting web content for a wiki, or moving blog posts to a Markdown-based CMS, this tool handles the conversion cleanly.</p>
<h2>Supported HTML Elements</h2>
<ul>
<li><strong>Headings</strong>: h1–h6 converted to # through ###### syntax.</li>
<li><strong>Text Formatting</strong>: Bold, italic, links, images, blockquotes, inline code.</li>
<li><strong>Lists</strong>: Ordered and unordered lists including nested lists.</li>
<li><strong>Code Blocks</strong>: Fenced code blocks with language hints for syntax highlighting.</li>
<li><strong>Tables</strong>: HTML tables converted to GitHub Flavored Markdown (GFM) table syntax.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Content creators migrating from WordPress, developers building documentation systems, and writers moving blog posts to Markdown-based platforms like Ghost, Notion, or Obsidian.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'HTML to Markdown converter',
    secondaryKeywords: ['html to md converter', 'convert html to markdown online', 'html markdown tool', 'webpage to markdown', 'html to github markdown'],
    metaTitle: 'HTML to Markdown Converter - Free Online Tool',
    metaDescription: 'Convert HTML to Markdown instantly. Handles headings, lists, tables, code blocks & more. Free online HTML to Markdown converter — clean output, no signup.',
    faqs: [
      { question: 'What is Markdown?', answer: 'Markdown is a lightweight markup language with plain text formatting syntax. It\'s designed to be readable as plain text while being convertible to HTML. GitHub, Reddit, Stack Overflow, and many CMSs use Markdown for content.' },
      { question: 'Does it handle tables?', answer: 'Yes, HTML tables are converted to GitHub Flavored Markdown (GFM) table syntax. For complex tables with merged cells, a simplified version is generated.' },
      { question: 'What happens to HTML that has no Markdown equivalent?', answer: 'HTML attributes not representable in standard Markdown (like CSS classes, inline styles, data attributes) are stripped, keeping only the semantic content. You can choose to keep some HTML as raw HTML in the output.' },
      { question: 'Can I convert a whole web page?', answer: 'You can paste the full HTML source of any page. The tool will convert all supported elements and ignore non-content HTML (script, style, meta tags). For best results, paste only the body content.' },
      { question: 'Is the output compatible with GitHub Markdown?', answer: 'Yes, the output uses GitHub Flavored Markdown (GFM) syntax, which includes tables, task lists, and fenced code blocks with language syntax highlighting hints.' },
    ],
    howToSteps: [
      'Paste your HTML code into the left input panel.',
      'The Markdown conversion appears instantly in the right panel.',
      'Preview the rendered Markdown to check the output.',
      'Adjust conversion options if needed (keep HTML for unsupported elements).',
      'Click "Copy Markdown" to copy the result.',
    ],
    relatedToolSlugs: ['json-formatter', 'base64-encode-decode', 'url-encode-decode', 'text-to-slug'],
    icon: 'FileCode',
    estimatedTime: 'Instant',
  },

  // ─── IMAGE TOOLS ──────────────────────────────────────────────────────────
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    shortDescription: 'Compress JPEG, PNG, WebP images online without losing visible quality.',
    longDescription: `<p>Reduce your image file sizes by up to 90% while maintaining excellent visual quality with our free online <strong>image compressor</strong>. Large images slow down websites and consume mobile data — our tool uses advanced compression algorithms to optimize images for the web.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Batch Upload</strong>: Compress up to 20 images at once and download as a ZIP.</li>
<li><strong>Quality Slider</strong>: Fine-tune the balance between file size and visual quality.</li>
<li><strong>Before/After Stats</strong>: See original vs compressed size and compression percentage for each image.</li>
<li><strong>No Watermarks</strong>: Output is clean and ready to use, unlike many online alternatives.</li>
<li><strong>All Formats</strong>: Supports JPEG, PNG, WebP, and GIF.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Web developers optimizing page load times, bloggers reducing image sizes before uploading, e-commerce sellers compressing product photos, and anyone who needs smaller images without visible quality loss.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your images never leave your device. No signup required.</p>`,
    category: 'image-tools',
    targetKeyword: 'compress image online',
    secondaryKeywords: ['image compressor', 'compress image', 'reduce image size', 'jpg compressor online', 'png compressor', 'image optimizer free', 'compress photo online', 'compress image to 100KB', 'compress image to 50KB', 'image size reducer online', 'photo compressor free'],
    metaTitle: 'Compress Image Online - Reduce Image Size Free | No Quality Loss',
    metaDescription: 'Compress JPEG, PNG & WebP images online — reduce file size up to 90% without losing quality. Free image compressor, no watermark, 100% private.',
    faqs: [
      { question: 'Does compressing an image reduce its quality?', answer: 'Lossy compression (used for JPEG) does reduce quality slightly, but at 70-85% quality settings the difference is invisible to the human eye while reducing file sizes by 60-80%. PNG uses lossless compression — no quality loss.' },
      { question: 'What is the maximum image size I can compress?', answer: 'The tool handles images up to 20MB per file. Files larger than 20MB may cause browser memory issues. For very large images, we recommend reducing the dimensions first using our Image Resizer.' },
      { question: 'Will the compressed image have a watermark?', answer: 'No. We never add watermarks to your compressed images. The output is clean and ready to use.' },
      { question: 'Which format gives the best compression: JPEG or WebP?', answer: 'WebP typically achieves 25-34% smaller file sizes than JPEG at equivalent quality. If your target browsers support WebP (all modern browsers do), use WebP for the best compression.' },
      { question: 'What quality setting should I use?', answer: 'For web use: 70-80% quality is the sweet spot — significantly smaller files with no visible quality loss. For print or professional use, use 85-95%.' },
    ],
    howToSteps: [
      'Drag and drop images onto the upload area, or click to browse files.',
      'Adjust the quality slider (70% is recommended for web).',
      'The tool compresses your images automatically.',
      'Compare the original vs compressed file sizes for each image.',
      'Download each image individually or all as a ZIP file.',
    ],
    relatedToolSlugs: ['image-flip-rotate', 'photo-effects-editor', 'image-resizer', 'png-to-jpg', 'jpg-to-png'],
    icon: 'ImageDown',
    isPopular: true,
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    shortDescription: 'Resize images to exact dimensions while maintaining aspect ratio.',
    longDescription: `<p>Resize any image to exact pixel dimensions with our free online <strong>image resizer</strong>. Whether you need a specific thumbnail size, social media dimensions, or want to reduce image dimensions before compression, this tool handles it accurately.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Exact Dimensions</strong>: Set precise width and height in pixels.</li>
<li><strong>Aspect Ratio Lock</strong>: Set one dimension and the other adjusts automatically to prevent distortion.</li>
<li><strong>Percentage Resize</strong>: Resize to 50%, 75%, or any percentage of the original.</li>
<li><strong>Batch Processing</strong>: Resize up to 10 images simultaneously to the same dimensions.</li>
<li><strong>High Quality</strong>: Uses high-quality interpolation for smooth results when downscaling.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Social media managers resizing images for specific platforms, web developers preparing thumbnails, bloggers optimizing images before upload, and anyone needing images at exact pixel sizes.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser using the HTML Canvas API — your images are never uploaded to any server.</p>`,
    category: 'image-tools',
    targetKeyword: 'resize image online',
    secondaryKeywords: ['image resizer', 'resize image online free', 'image resize tool', 'change image size', 'reduce image dimensions', 'photo resizer online', 'resize image to specific size', 'resize image pixels', 'image resizer online free', 'resize photo for passport', 'resize image KB'],
    metaTitle: 'Resize Image Online - Free Image Resizer to Any Size',
    metaDescription: 'Resize images to exact pixel dimensions online. Maintain aspect ratio or set custom size. Free image resizer — no watermark, no upload, works in browser.',
    faqs: [
      { question: 'Will resizing an image reduce its quality?', answer: 'Downscaling (making smaller) generally produces good results. Upscaling (making larger) can cause pixelation or blurriness because pixels are being "invented". For upscaling, use AI upscaling tools for best results.' },
      { question: 'What image sizes do social media platforms require?', answer: 'Facebook profile: 180×180px. Instagram post: 1080×1080px. Twitter header: 1500×500px. LinkedIn profile: 400×400px. YouTube thumbnail: 1280×720px. Our tool makes it easy to resize to any of these.' },
      { question: 'Can I resize multiple images at once?', answer: 'Yes, you can upload and resize up to 10 images simultaneously. All images will be resized to the same dimensions.' },
      { question: 'What is aspect ratio lock?', answer: 'When aspect ratio lock is enabled, changing the width automatically adjusts the height (and vice versa) to maintain the original proportions. This prevents distortion (stretching or squishing).' },
      { question: 'What output format will the resized image be in?', answer: 'The output format matches the input format (JPEG stays JPEG, PNG stays PNG). You can also choose to convert to a different format after resizing.' },
    ],
    howToSteps: [
      'Upload your image by dragging and dropping or clicking the upload area.',
      'Enter the target width and height in pixels, or a percentage.',
      'Enable "Lock aspect ratio" to prevent distortion.',
      'Preview the resized image and compare with the original.',
      'Click "Download Resized Image" to save.',
    ],
    relatedToolSlugs: ['image-flip-rotate', 'photo-effects-editor', 'image-compressor', 'png-to-jpg', 'jpg-to-png'],
    icon: 'Maximize2',
    isPopular: true,
    estimatedTime: '1-3 seconds',
  },
  {
    slug: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    shortDescription: 'Convert PNG images to JPG format online with quality control.',
    longDescription: `<p>Convert PNG images to JPG format quickly with our free online <strong>PNG to JPG converter</strong>. JPG is ideal for photographs where file size matters — its lossy compression achieves significantly smaller files than PNG, perfect for web pages where load speed is critical.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Background Color Choice</strong>: Replace PNG transparency with white, black, or a custom color.</li>
<li><strong>Quality Control</strong>: Adjust JPG quality (1–100) to balance file size against visual quality.</li>
<li><strong>Batch Conversion</strong>: Upload up to 20 PNG files and convert them all at once.</li>
<li><strong>No Watermarks</strong>: Clean output files ready for immediate use.</li>
</ul>
<h2>When to Use JPG Instead of PNG</h2>
<p>Use JPG for photographs and images with many colors where small file size matters. Keep PNG for logos, icons, screenshots, and images requiring transparent backgrounds.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your images never leave your device. No signup required.</p>`,
    category: 'image-tools',
    targetKeyword: 'PNG to JPG converter',
    secondaryKeywords: ['png to jpeg converter', 'convert png to jpg online free', 'png jpg conversion', 'png to jpg online', 'batch png to jpg'],
    metaTitle: 'PNG to JPG Converter - Free Online PNG to JPEG Tool',
    metaDescription: 'Convert PNG to JPG online free. Adjust quality, set background color for transparency. Batch convert up to 20 files. No signup, no watermark.',
    faqs: [
      { question: 'When should I use JPG instead of PNG?', answer: 'Use JPG for photographs and images with many colors where a small size is important. Use PNG for images requiring transparency, screenshots, logos, icons, and images with sharp edges or text where lossless quality matters.' },
      { question: 'Will I lose transparency when converting PNG to JPG?', answer: 'Yes. JPG does not support transparency. Our converter fills transparent areas with a solid background color (you choose: white, black, or custom). If transparency must be preserved, stay with PNG or use WebP.' },
      { question: 'What quality should I choose for JPG output?', answer: '85-90% quality retains excellent visual quality with significantly smaller files than PNG. For web thumbnails, 70-80% is fine. For archival/printing purposes, use 95%+.' },
      { question: 'Will converting PNG to JPG reduce image dimensions?', answer: 'No, the dimensions (width × height) stay the same. Only the format and file size change.' },
      { question: 'Can I convert multiple PNG files at once?', answer: 'Yes, upload up to 20 PNG images at once and they will all be converted to JPG. Download each individually or as a ZIP.' },
    ],
    howToSteps: [
      'Upload your PNG file(s) — drag and drop or click to browse.',
      'Choose the background color to replace transparent areas.',
      'Set JPG quality (80% recommended for web).',
      'Preview the converted image.',
      'Download the JPG file or all files as a ZIP.',
    ],
    relatedToolSlugs: ['jpg-to-png', 'image-compressor', 'image-resizer', 'webp-to-png', 'image-to-base64'],
    icon: 'FileImage',
    isPopular: true,
    estimatedTime: '1-3 seconds',
  },
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    shortDescription: 'Convert JPG/JPEG images to PNG format online free with lossless output.',
    longDescription: `<p>Convert JPG images to PNG format instantly with our free online <strong>JPG to PNG converter</strong>. PNG offers lossless compression and transparency support — ideal for screenshots, logos, icons, and images that need further editing.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Lossless Output</strong>: PNG stores the full image without any additional compression artifacts.</li>
<li><strong>Transparency Support</strong>: PNG supports alpha transparency, unlike JPG.</li>
<li><strong>Batch Conversion</strong>: Upload up to 20 JPG files and convert them all at once.</li>
<li><strong>No Extra Quality Loss</strong>: The conversion itself adds no degradation beyond what the original JPEG already had.</li>
</ul>
<h2>When to Use PNG Instead of JPG</h2>
<p>Use PNG when you need a transparent background, plan to edit the image further, or need sharp edges for text and logos. For photos and images where file size matters, JPG is usually the better choice.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your images never leave your device. No signup required.</p>`,
    category: 'image-tools',
    targetKeyword: 'JPG to PNG converter',
    secondaryKeywords: ['jpeg to png converter', 'convert jpg to png online free', 'jpg png conversion', 'photo to png', 'batch jpg to png'],
    metaTitle: 'JPG to PNG Converter - Free Online JPEG to PNG Tool',
    metaDescription: 'Convert JPG/JPEG images to PNG format online free. Lossless output, supports transparency. Batch convert up to 20 files. No signup, no watermark.',
    faqs: [
      { question: 'Why would I convert JPG to PNG?', answer: 'You\'d convert to PNG when you need: (1) a transparent background, (2) to edit the image without further quality loss, (3) sharp edges for text/logos, or (4) lossless storage for further editing in Photoshop or similar.' },
      { question: 'Will converting JPG to PNG improve image quality?', answer: 'No. The quality of the original JPG is preserved, but any quality loss that happened when the JPG was created cannot be recovered. PNG just stores what\'s already there without further compression artifacts.' },
      { question: 'Will the PNG file be larger than the JPG?', answer: 'Yes, significantly. PNG uses lossless compression which doesn\'t discard image data. A JPEG photo might be 500KB while the equivalent PNG could be 2-5MB. This is a trade-off for quality and editability.' },
      { question: 'Can JPG images have a transparent background?', answer: 'No. JPG does not support transparency. If you need to add a transparent background to a JPG, you\'ll need to use a background removal tool after converting to PNG.' },
      { question: 'Is batch conversion supported?', answer: 'Yes, upload up to 20 JPG files at once for batch conversion to PNG.' },
    ],
    howToSteps: [
      'Upload your JPG/JPEG file(s) — drag and drop or click to browse.',
      'The conversion starts automatically.',
      'Preview the converted PNG image.',
      'Download the PNG file(s).',
      'Use a background removal tool next if you need transparent backgrounds.',
    ],
    relatedToolSlugs: ['png-to-jpg', 'image-compressor', 'image-resizer', 'webp-to-png', 'image-to-base64'],
    icon: 'FileImage',
    isPopular: true,
    estimatedTime: '1-3 seconds',
  },
  {
    slug: 'webp-to-png',
    name: 'WebP to PNG Converter',
    shortDescription: 'Convert WebP images to PNG format online free instantly.',
    longDescription: `<p>Convert WebP files to universally compatible PNG format instantly with our free <strong>WebP to PNG converter</strong>. WebP is Google's modern image format with superior compression, but not all apps and older software support it — PNG works everywhere.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Transparency Preserved</strong>: WebP alpha transparency carries over to PNG automatically.</li>
<li><strong>Full Quality</strong>: No additional quality loss during the WebP to PNG conversion.</li>
<li><strong>Batch Conversion</strong>: Convert up to 20 WebP files at once.</li>
<li><strong>No Installation</strong>: Works directly in your browser — no software needed.</li>
</ul>
<h2>When Do You Need This?</h2>
<p>When you download images from modern websites (which often serve WebP), need to edit them in older software like Photoshop CS6 or Microsoft Paint, or want to share images in a format that opens everywhere.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your images never leave your device. No signup required.</p>`,
    category: 'image-tools',
    targetKeyword: 'WebP to PNG converter',
    secondaryKeywords: ['convert webp to png online', 'webp to jpg', 'webp converter', 'webp to png free', 'google webp converter'],
    metaTitle: 'WebP to PNG Converter - Convert WebP to PNG Free Online',
    metaDescription: 'Convert WebP images to PNG online free. Preserves transparency & quality. Batch convert up to 20 WebP files. No signup, no watermark, instant conversion.',
    faqs: [
      { question: 'What is WebP format?', answer: 'WebP is an image format developed by Google that provides superior lossless and lossy compression. WebP images are typically 25-34% smaller than JPEG and 26% smaller than PNG at equivalent quality.' },
      { question: 'Does WebP support transparency?', answer: 'Yes, WebP supports both lossy and lossless compression with and without transparency (alpha channel). Our converter preserves transparency when converting WebP to PNG.' },
      { question: 'Why can\'t some software open WebP files?', answer: 'WebP is relatively new (2010) and older software like Photoshop CS6, Microsoft Paint (older versions), and some image viewers haven\'t updated to support it. Converting to PNG ensures universal compatibility.' },
      { question: 'Will the PNG be larger than the WebP?', answer: 'Yes. WebP is designed for smaller file sizes. Converting to PNG will produce a larger file, but with full compatibility and lossless quality.' },
      { question: 'Can I also convert WebP to JPG?', answer: 'Our PNG to JPG converter works on any PNG, so you can: WebP → PNG (this tool), then PNG → JPG (our PNG to JPG tool). Or request the WebP to JPG tool directly.' },
    ],
    howToSteps: [
      'Upload your WebP file(s) — drag and drop or click to browse.',
      'The conversion happens automatically in your browser.',
      'Preview the PNG output.',
      'Download the converted PNG file(s).',
      'Transparency is preserved automatically.',
    ],
    relatedToolSlugs: ['png-to-jpg', 'jpg-to-png', 'image-compressor', 'image-resizer', 'image-to-base64'],
    icon: 'FileImage',
    estimatedTime: '1-3 seconds',
  },
  {
    slug: 'image-to-base64',
    name: 'Image to Base64',
    shortDescription: 'Convert images to Base64 encoded strings for embedding in HTML and CSS.',
    longDescription: `<p>Convert any image to a Base64-encoded data URI for direct embedding in HTML, CSS, or JSON with our free <strong>image to Base64 converter</strong>. No separate image file needed — embed images directly in your code.</p>
<h2>Key Features</h2>
<ul>
<li><strong>All Formats</strong>: Supports JPEG, PNG, WebP, GIF, and SVG.</li>
<li><strong>Ready-to-Use Output</strong>: Generates the Base64 string, HTML img tag, and CSS background-image syntax.</li>
<li><strong>Size Indicator</strong>: Shows encoded string length so you can judge if inlining is appropriate.</li>
<li><strong>Instant Conversion</strong>: Results appear immediately after upload.</li>
</ul>
<h2>When to Use Base64 Images</h2>
<p>Ideal for small icons and UI elements under 10KB to reduce HTTP requests. Also useful for email HTML templates (where remote images may be blocked) and offline apps. For larger images, serving from a CDN is better — Base64 increases size by ~33% and prevents browser caching.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your images never leave your device. No signup required.</p>`,
    category: 'image-tools',
    targetKeyword: 'image to base64',
    secondaryKeywords: ['image to base64 converter', 'base64 image encoder', 'convert image to base64 online', 'img to base64', 'base64 image online'],
    metaTitle: 'Image to Base64 Converter - Free Online Tool',
    metaDescription: 'Convert images to Base64 encoded strings. Get HTML & CSS data URIs instantly. Free online image to Base64 converter — JPEG, PNG, WebP, SVG supported.',
    faqs: [
      { question: 'When should I use Base64 image embedding?', answer: 'Use it for: small icons/UI elements (<10KB), reducing critical HTTP requests, email HTML (where remote images may be blocked), offline apps, and storing images in JSON. Avoid for large images — increases size by ~33% and prevents caching.' },
      { question: 'How do I use a Base64 image in HTML?', answer: '<img src="data:image/png;base64,iVBORw0KGgo..." alt="My image" /> — replace the Base64 string with your encoded image data and adjust the MIME type.' },
      { question: 'How do I use a Base64 image in CSS?', answer: '.element { background-image: url("data:image/png;base64,iVBORw0KGgo..."); } — use the full data URI as the background-image value.' },
      { question: 'Why does Base64 increase file size?', answer: 'Base64 encoding represents every 3 bytes of binary data as 4 ASCII characters, resulting in a 33% size increase. This overhead is why Base64 embedding is only recommended for small images.' },
      { question: 'What is a data URI?', answer: 'A data URI (data URL) is a URL that contains data directly instead of pointing to an external file. Format: data:[mimetype][;base64],[data]. Supported in all modern browsers for images, fonts, and other resources.' },
    ],
    howToSteps: [
      'Upload an image by dragging and dropping or clicking to browse.',
      'The Base64 encoded string is generated instantly.',
      'Copy the Base64 string, HTML img tag, or CSS background-image syntax.',
      'Paste directly into your HTML, CSS, or JSON.',
      'Use the size indicator to confirm the encoded image is small enough to inline.',
    ],
    relatedToolSlugs: ['base64-encode-decode', 'image-compressor', 'png-to-jpg', 'jpg-to-png'],
    icon: 'Code',
    estimatedTime: '1-2 seconds',
  },

  // ─── PDF TOOLS ────────────────────────────────────────────────────────────
  {
    slug: 'pdf-merge',
    name: 'PDF Merge',
    shortDescription: 'Merge multiple PDF files into a single PDF online — free and secure.',
    longDescription: `<p>Combine multiple PDF files into one organized document with our free <strong>PDF merge</strong> tool. Assemble reports, combine invoices, or merge scanned documents — entirely in your browser, with no file uploads to any server.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Drag to Reorder</strong>: Arrange PDFs in any order before merging to control page sequence.</li>
<li><strong>Up to 20 Files</strong>: Merge up to 20 PDFs at once (up to 50MB each).</li>
<li><strong>No Watermarks</strong>: Output is clean — unlike many online PDF tools.</li>
<li><strong>Quality Preserved</strong>: Fonts, formatting, and image quality are fully maintained.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Professionals combining multi-chapter reports, accountants merging invoices, lawyers assembling document packages, and anyone who needs to combine PDF files without installing software.</p>
<h2>Privacy & Security</h2>
<p>Uses pdf-lib entirely in your browser — your documents never leave your device. No signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'merge PDF',
    secondaryKeywords: ['merge PDF online', 'merge PDF files online free', 'combine PDF', 'join PDF online free', 'PDF combiner', 'merge multiple PDFs', 'PDF merger online', 'combine PDF files free', 'PDF joiner', 'merge PDF without watermark'],
    metaTitle: 'Merge PDF - Combine PDF Files Online Free | No Watermark',
    metaDescription: 'Merge multiple PDF files into one document online. Drag to reorder pages. Free, secure, no watermark — files never leave your device. No signup needed.',
    faqs: [
      { question: 'Is PDF merging safe with this tool?', answer: 'Yes, completely safe. All PDF processing happens in your browser using JavaScript. Your PDF files are never uploaded to our servers, ensuring your documents remain private.' },
      { question: 'How many PDFs can I merge at once?', answer: 'You can merge up to 20 PDF files at once. If you need to merge more, merge them in batches and then merge the results.' },
      { question: 'What is the maximum file size?', answer: 'Each PDF can be up to 50MB. For very large PDFs, processing may take a few seconds depending on your device\'s processing power.' },
      { question: 'Can I change the order of PDFs before merging?', answer: 'Yes! After uploading, drag and drop the PDF items to reorder them. The final merged PDF will follow the order you set.' },
      { question: 'Will the merged PDF have the same quality as the originals?', answer: 'Yes. pdf-lib performs direct PDF merging without re-rendering or re-encoding the content, so quality is fully preserved.' },
    ],
    howToSteps: [
      'Upload the PDF files you want to merge — drag and drop or click to browse.',
      'Drag and drop files in the list to arrange them in the desired order.',
      'Click "Merge PDFs" to combine them.',
      'Preview the page count and file size of the merged PDF.',
      'Click "Download Merged PDF" to save the combined file.',
    ],
    relatedToolSlugs: ['pdf-split', 'pdf-compress', 'pdf-to-image'],
    icon: 'FilePlus2',
    isPopular: true,
    estimatedTime: '3-10 seconds',
  },
  {
    slug: 'pdf-split',
    name: 'PDF Split',
    shortDescription: 'Split a PDF into individual pages or specific page ranges online.',
    longDescription: `<p>Split any PDF into individual pages or custom page ranges with our free <strong>split PDF</strong> tool. Extract specific pages, separate each page into its own file, or divide a document into chunks — all without uploading to any server.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Custom Ranges</strong>: Enter page ranges like "1-5, 8, 11-15" to extract exactly the pages you need.</li>
<li><strong>Split All Pages</strong>: Create one separate PDF per page, packaged into a ZIP.</li>
<li><strong>No Quality Loss</strong>: Pages are extracted without re-rendering — fonts and formatting stay intact.</li>
<li><strong>No Watermarks</strong>: Clean, unmodified output files.</li>
</ul>
<h2>Common Use Cases</h2>
<p>Extracting a chapter from an e-book, separating combined invoices into individual files, extracting pages for review, or splitting a scanned document into individual forms.</p>
<h2>Privacy & Security</h2>
<p>Uses pdf-lib entirely in your browser — your documents never leave your device. No signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'split PDF',
    secondaryKeywords: ['split PDF online', 'split PDF online free', 'extract pages from PDF', 'divide PDF', 'PDF page extractor', 'separate PDF pages free', 'PDF splitter online', 'split PDF by pages', 'PDF cutter online', 'extract PDF pages free'],
    metaTitle: 'Split PDF - Extract Pages from PDF Online Free | No Watermark',
    metaDescription: 'Split PDF into individual pages or custom ranges online. Extract specific pages from any PDF. Free, secure, no watermark — files never leave your device.',
    faqs: [
      { question: 'Can I extract only specific pages from a PDF?', answer: 'Yes. Enter page ranges like "1-5, 8, 11-15" to extract exactly those pages into a new PDF. You can create multiple output PDFs with different page ranges.' },
      { question: 'Can I split every page into a separate file?', answer: 'Yes. Choose "Split into individual pages" to create one PDF file per page. All files are packaged into a ZIP for easy download.' },
      { question: 'Will splitting a PDF affect the quality?', answer: 'No. PDF splitting with pdf-lib is a direct operation — pages are extracted without re-rendering, so quality, fonts, and formatting are fully preserved.' },
      { question: 'What is the maximum PDF size for splitting?', answer: 'The tool handles PDFs up to 100MB. For large PDFs with many pages, splitting may take a few seconds.' },
      { question: 'Can I split a password-protected PDF?', answer: 'Not directly. You\'d need to remove the password protection first, then use this tool to split it.' },
    ],
    howToSteps: [
      'Upload the PDF file you want to split.',
      'Choose split mode: "All pages", "Custom ranges", or "Every N pages".',
      'For custom ranges, enter your page numbers (e.g., "1-3, 5, 7-10").',
      'Click "Split PDF" to process.',
      'Download individual PDFs or all as a ZIP file.',
    ],
    relatedToolSlugs: ['pdf-merge', 'pdf-compress', 'pdf-to-image'],
    icon: 'Scissors',
    isPopular: true,
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'pdf-compress',
    name: 'PDF Compressor',
    shortDescription: 'Compress PDF files to reduce size while maintaining quality online.',
    longDescription: `<p>Reduce PDF file sizes while keeping acceptable quality with our free <strong>PDF compressor</strong>. Smaller PDFs email faster, upload quicker, and fit within file size limits imposed by email clients and websites.</p>
<h2>Key Features</h2>
<ul>
<li><strong>3 Compression Levels</strong>: Maximum Quality, Balanced, or Maximum Compression — choose your trade-off.</li>
<li><strong>Image Optimization</strong>: Compresses embedded images which account for most PDF size.</li>
<li><strong>Size Preview</strong>: See the compressed file size before downloading.</li>
<li><strong>No Watermarks</strong>: Clean output with no added marks or branding.</li>
</ul>
<h2>How Much Can a PDF Be Compressed?</h2>
<p>PDFs with large embedded images can shrink 50–80%. Text-only PDFs may only reduce by 10–20%. Scanned documents (which are essentially image PDFs) can often be significantly reduced.</p>
<h2>Privacy & Security</h2>
<p>Uses pdf-lib entirely in your browser — your documents never leave your device. No signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'compress PDF',
    secondaryKeywords: ['compress PDF online free', 'reduce PDF file size', 'PDF compressor', 'PDF compressor online', 'shrink PDF', 'make PDF smaller online', 'compress PDF to 100KB', 'compress PDF to 200KB', 'reduce PDF size online', 'PDF size reducer free'],
    metaTitle: 'Compress PDF - Reduce PDF File Size Online Free | No Watermark',
    metaDescription: 'Compress PDF files to reduce size by up to 80% online. Choose quality level. Free, secure, no watermark — PDFs never leave your device. Instant results.',
    faqs: [
      { question: 'How much can a PDF be compressed?', answer: 'Depends on content. PDFs with large images can often be reduced by 50-80%. Text-only PDFs are already highly compressed and may only reduce by 10-20%. Scanned document PDFs can often be reduced significantly.' },
      { question: 'What does PDF compression actually do?', answer: 'It reduces image resolution/quality within the PDF, removes duplicate image data, applies more aggressive stream compression, strips unnecessary metadata, and removes embedded fonts if possible.' },
      { question: 'Will compressed PDFs print at lower quality?', answer: 'At "Balanced" compression level, print quality is preserved for most documents. "Maximum compression" may reduce image sharpness. For archival/print PDFs, use "Minimum compression".' },
      { question: 'Can I compress a password-protected PDF?', answer: 'No. Remove the password protection first, compress, then re-add password protection if needed.' },
      { question: 'What is the maximum PDF file size?', answer: 'The tool handles PDFs up to 100MB. Very large PDFs (50MB+) may take longer to process depending on your device.' },
    ],
    howToSteps: [
      'Upload the PDF file you want to compress.',
      'Choose compression level: Maximum Quality, Balanced, or Maximum Compression.',
      'Click "Compress PDF" and wait for processing.',
      'View the compression results: original vs compressed size.',
      'Download the compressed PDF.',
    ],
    relatedToolSlugs: ['word-to-pdf', 'pdf-to-excel', 'pdf-merge', 'pdf-split', 'pdf-to-image'],
    icon: 'FileArchive',
    isPopular: true,
    estimatedTime: '3-10 seconds',
  },
  {
    slug: 'pdf-to-image',
    name: 'PDF to Image',
    shortDescription: 'Convert PDF pages to high-quality PNG or JPG images online.',
    longDescription: `<p>Convert any PDF page to a high-quality PNG or JPG image with our free <strong>PDF to JPG</strong> converter. Create thumbnails, extract pages for presentations, share non-editable document views, or prepare PDF content for social media.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Select Specific Pages</strong>: Convert all pages or enter a custom range (e.g., "1, 3, 5-8").</li>
<li><strong>DPI Control</strong>: Choose 72–600 DPI — 150 DPI for web, 300 DPI for print quality.</li>
<li><strong>PNG or JPG Output</strong>: PNG for crisp text and graphics; JPG for smaller file sizes.</li>
<li><strong>ZIP Download</strong>: Multiple pages are packaged into a ZIP file automatically.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Marketers creating social media images from PDF slides, developers generating PDF thumbnails, teachers sharing individual PDF pages, and anyone needing images from a PDF document.</p>
<h2>Privacy & Security</h2>
<p>Uses PDF.js entirely in your browser — your documents never leave your device. No signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'PDF to JPG',
    secondaryKeywords: ['PDF to image converter', 'PDF to PNG', 'PDF to JPG converter online', 'convert PDF to JPG', 'convert PDF to image free', 'PDF to JPG online free', 'PDF to photo converter', 'extract image from PDF', 'PDF page to image', 'PDF to JPEG converter'],
    metaTitle: 'PDF to JPG - Convert PDF to Image Online Free | PNG & JPG',
    metaDescription: 'Convert PDF pages to JPG or PNG images online for free. Choose resolution, select pages. Secure — PDF never leaves your device. Instant, no signup.',
    faqs: [
      { question: 'What resolution should I choose?', answer: '72-96 DPI: screen/web display. 150 DPI: good general quality for most uses. 300 DPI: suitable for print quality. 600 DPI: high-resolution print. Higher DPI means better quality but larger file sizes.' },
      { question: 'Can I convert specific pages only?', answer: 'Yes. Enter specific page numbers or ranges (e.g., "1, 3, 5-8") to convert only those pages, rather than the entire document.' },
      { question: 'Should I choose PNG or JPG output?', answer: 'PNG: higher quality, larger files, supports transparency — best for documents with text and crisp graphics. JPG: smaller files, slight quality loss — better for photo-heavy PDFs.' },
      { question: 'How are multi-page conversions downloaded?', answer: 'When converting multiple pages, all images are packaged into a ZIP file for easy download.' },
      { question: 'What types of PDFs work with this tool?', answer: 'Standard PDFs work well. Scanned PDFs (images of documents) also convert but the output quality depends on the original scan quality. Password-protected PDFs require the password to be removed first.' },
    ],
    howToSteps: [
      'Upload the PDF file you want to convert.',
      'Select which pages to convert (all pages or specific page range).',
      'Choose output format (PNG or JPG) and resolution (DPI).',
      'Click "Convert to Images".',
      'Download individual images or all as a ZIP file.',
    ],
    relatedToolSlugs: ['pdf-merge', 'pdf-split', 'pdf-compress', 'image-compressor'],
    icon: 'FileImage',
    isPopular: true,
    estimatedTime: '3-15 seconds',
  },
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word Converter',
    shortDescription: 'Convert PDF files to editable Word documents (.docx) online — free and secure.',
    longDescription: `<p>Convert any PDF to an editable Microsoft Word (.docx) file with our free <strong>PDF to Word converter</strong>. Extract text, paragraphs, and headings from your PDF — all processed entirely in your browser, never uploaded to any server.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Accurate Text Extraction</strong>: PDF.js extracts text content from each page faithfully.</li>
<li><strong>Paragraph Structure</strong>: Output preserves paragraphs, line breaks, and page separation.</li>
<li><strong>Universal .docx Format</strong>: Opens in Microsoft Word, Google Docs, LibreOffice, and Apple Pages.</li>
<li><strong>No Watermarks</strong>: Clean, unbranded output file.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Anyone who needs to edit a PDF contract, modify an old report, extract text from an academic paper, or convert a PDF resume into an editable format — without spending money on Adobe Acrobat.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your documents never leave your device. No signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'PDF to Word converter',
    secondaryKeywords: ['pdf to docx', 'convert pdf to word online free', 'pdf to word converter free', 'pdf to editable word', 'extract text from pdf to word'],
    metaTitle: 'PDF to Word Converter - Convert PDF to DOCX Free Online',
    metaDescription: 'Convert PDF to editable Word document (.docx) online for free. Extracts text and paragraphs accurately. Secure — your file never leaves your browser. No signup.',
    faqs: [
      { question: 'Is this PDF to Word converter free?', answer: 'Yes, completely free with no limits on file size or number of conversions. There are no watermarks added to the output file.' },
      { question: 'Are my PDF files uploaded to a server?', answer: 'No. All processing happens locally in your browser using JavaScript. Your PDF files never leave your device, making it safe for confidential documents.' },
      { question: 'Does it preserve formatting from the PDF?', answer: 'The tool extracts text content and preserves paragraph structure and page breaks. Complex formatting like tables, columns, and images are not carried over — the focus is on accurate text extraction into an editable format.' },
      { question: 'Can I convert scanned PDFs?', answer: 'This tool works best with text-based PDFs (where text is selectable). For scanned PDFs (image-based), the text extraction may be limited. Use our Image to Text (OCR) tool first for scanned documents.' },
      { question: 'What word processors can open the output file?', answer: 'The output .docx file can be opened in Microsoft Word, Google Docs, LibreOffice Writer, Apple Pages, and any other application that supports the .docx format.' },
    ],
    howToSteps: [
      'Upload your PDF file — drag and drop or click to browse (max 50MB).',
      'Click "Convert to Word" to start the conversion.',
      'Preview the extracted text from each page.',
      'Click "Download Word Document" to save the .docx file.',
      'Open the downloaded file in Word, Google Docs, or any word processor to edit.',
    ],
    relatedToolSlugs: ['word-to-pdf', 'pdf-to-excel', 'pdf-to-image', 'pdf-merge', 'pdf-split'],
    icon: 'FileText',
    isPopular: true,
    estimatedTime: '5-15 seconds',
  },

  // ─── CONVERTERS ───────────────────────────────────────────────────────────
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    shortDescription: 'Convert length, weight, volume, area, speed and data units instantly.',
    longDescription: `<p>Our <strong>unit converter</strong> is a comprehensive measurement conversion tool covering all major categories: length (meters, feet, miles, kilometers), weight/mass (kilograms, pounds, ounces, grams), volume (liters, gallons, milliliters, cups), area (square meters, acres, hectares, square feet), speed (km/h, mph, m/s, knots), data storage (bytes, KB, MB, GB, TB), and more.</p>
<h2>Key Features</h2>
<ul>
<li><strong>High Precision</strong>: Conversions calculated with up to 10 significant figures — ideal for scientific and engineering work.</li>
<li><strong>All Major Categories</strong>: Length, Weight, Volume, Area, Speed, Temperature, Data Storage, Energy, Pressure, and more.</li>
<li><strong>Bidirectional Conversion</strong>: See both directions simultaneously (e.g., meters to feet and feet to meters at once).</li>
<li><strong>Metric and Imperial</strong>: Full support for metric, imperial, and US customary measurement systems.</li>
<li><strong>Instant Results</strong>: Select the category, choose units, enter your value — result appears instantly.</li>
</ul>
<h2>Who Is This For?</h2>
<p>This is an essential tool for engineers, students, scientists, travellers, shoppers comparing international prices, and anyone who regularly works with measurements from different systems.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'converters',
    targetKeyword: 'unit converter',
    secondaryKeywords: ['measurement converter', 'length converter', 'weight converter', 'metric to imperial', 'unit conversion calculator', 'convert units online'],
    metaTitle: 'Unit Converter - Convert Length, Weight, Volume & More Free',
    metaDescription: 'Convert length, weight, volume, area, speed & data units instantly. Free online unit converter — metric to imperial and all major measurement systems.',
    faqs: [
      { question: 'What unit categories are supported?', answer: 'Length, Weight/Mass, Volume, Area, Speed, Temperature, Data Storage, Energy, Pressure, Frequency, Fuel Economy, and Plane Angle. We\'re adding more categories regularly.' },
      { question: 'How many significant figures are used in conversions?', answer: 'Conversions are calculated with up to 10 significant figures for precision. The display rounds to 6 significant figures for readability, but the full precision is used in calculations.' },
      { question: 'Can I convert in both directions simultaneously?', answer: 'Yes. Our converter shows the conversion in both directions at once (e.g., 10 meters = 32.808 feet, AND 10 feet = 3.048 meters).' },
      { question: 'How do I convert meters to feet?', answer: '1 meter = 3.28084 feet. Multiply meters by 3.28084 to get feet. Or just use our converter: enter your value in meters, select meters → feet, and get the instant result.' },
      { question: 'What is the difference between a US gallon and a UK gallon?', answer: 'They\'re different! 1 US gallon = 3.785 liters. 1 UK (Imperial) gallon = 4.546 liters. Our converter supports both — make sure to select the correct gallon type.' },
    ],
    howToSteps: [
      'Select the measurement category (Length, Weight, Volume, etc.).',
      'Choose your input unit from the left dropdown.',
      'Choose your output unit from the right dropdown.',
      'Enter your value in the input field.',
      'The converted value appears instantly.',
    ],
    relatedToolSlugs: ['temperature-converter', 'bmi-calculator', 'timestamp-converter', 'number-to-words'],
    icon: 'Ruler',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'temperature-converter',
    name: 'Temperature Converter',
    shortDescription: 'Convert temperatures between Celsius, Fahrenheit, and Kelvin instantly.',
    longDescription: `<p>Our <strong>temperature converter</strong> instantly converts between Celsius (°C), Fahrenheit (°F), and Kelvin (K). Enter a temperature in any unit and see the equivalent in all three scales simultaneously — no need to convert back and forth manually.</p>
<h2>Key Features</h2>
<ul>
<li><strong>All Three Scales at Once</strong>: Celsius, Fahrenheit, and Kelvin results shown simultaneously.</li>
<li><strong>Instant Conversion</strong>: Results update live as you type — no button press needed.</li>
<li><strong>Reference Points</strong>: Common landmarks like water freezing/boiling, body temperature, and oven temperatures shown for each scale.</li>
<li><strong>Swap Direction</strong>: Easily reverse the conversion direction with the swap button.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Temperature conversion is needed in weather forecasting (US uses Fahrenheit, most of the world uses Celsius), cooking (recipes from different countries use different scales), scientific work (Kelvin is the SI unit for thermodynamic temperature), and medicine (body temperature and fever thresholds differ by scale).</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'converters',
    targetKeyword: 'temperature converter',
    secondaryKeywords: ['celsius to fahrenheit', 'fahrenheit to celsius', 'celsius to kelvin', 'convert temperature online', 'temperature conversion calculator'],
    metaTitle: 'Temperature Converter - Celsius, Fahrenheit, Kelvin Free',
    metaDescription: 'Convert temperatures between Celsius, Fahrenheit & Kelvin instantly. See all three scales at once. Free online temperature converter — no signup needed.',
    faqs: [
      { question: 'How do I convert Celsius to Fahrenheit?', answer: '°F = (°C × 9/5) + 32. Example: 100°C = (100 × 9/5) + 32 = 180 + 32 = 212°F (boiling point of water).' },
      { question: 'How do I convert Fahrenheit to Celsius?', answer: '°C = (°F - 32) × 5/9. Example: 98.6°F (normal body temp) = (98.6 - 32) × 5/9 = 66.6 × 5/9 = 37°C.' },
      { question: 'What is Kelvin used for?', answer: 'Kelvin is the SI unit of thermodynamic temperature used in science and engineering. 0 K is absolute zero (−273.15°C), the coldest possible temperature. Kelvin has the same size as Celsius degrees.' },
      { question: 'What temperature is the same in Celsius and Fahrenheit?', answer: '-40°C = -40°F. This is the only temperature where the two scales coincide.' },
      { question: 'What is normal human body temperature?', answer: '37°C (98.6°F). However, "normal" actually ranges from 36.1°C to 37.2°C (97°F to 99°F) depending on the person, time of day, and where the measurement is taken.' },
    ],
    howToSteps: [
      'Enter your temperature value in any field (Celsius, Fahrenheit, or Kelvin).',
      'The equivalent values in the other two scales update instantly.',
      'Reference the common temperature landmarks shown below for context.',
      'Use the swap button to reverse the conversion direction.',
      'Clear the field to enter a new temperature.',
    ],
    relatedToolSlugs: ['unit-converter', 'bmi-calculator', 'percentage-calculator'],
    icon: 'Thermometer',
    estimatedTime: 'Instant',
  },
  {
    slug: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    shortDescription: 'Convert Unix timestamps to readable dates and dates to Unix timestamps.',
    longDescription: `<p>Convert <strong>Unix timestamps</strong> (epoch time) to human-readable dates and times, and vice versa. A Unix timestamp is the number of seconds elapsed since January 1, 1970, 00:00:00 UTC (the Unix epoch). It is widely used in programming, databases, APIs, and system logs.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Seconds and Milliseconds</strong>: Handles both Unix seconds (10-digit) and JavaScript milliseconds (13-digit) timestamps.</li>
<li><strong>Multiple Formats</strong>: Shows results in local time, UTC, and ISO 8601 format simultaneously.</li>
<li><strong>Date to Timestamp</strong>: Convert any date and time back to its Unix timestamp with timezone selection.</li>
<li><strong>Live Counter</strong>: Current Unix timestamp shown at the top, auto-updating every second — handy for testing.</li>
<li><strong>Copy Results</strong>: One-click copy for any output value.</li>
</ul>
<h2>Who Is This For?</h2>
<p>This is an essential tool for developers debugging API responses, analyzing logs, working with database timestamps, and understanding cron job schedules. Anyone who encounters epoch time in their work will benefit from this converter.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'converters',
    targetKeyword: 'Unix timestamp converter',
    secondaryKeywords: ['epoch converter', 'timestamp to date', 'date to timestamp', 'unix epoch converter', 'milliseconds converter', 'epoch time converter'],
    metaTitle: 'Unix Timestamp Converter - Epoch to Date Online Free',
    metaDescription: 'Convert Unix timestamps to readable dates and dates to Unix timestamps. Supports seconds & milliseconds. Free online epoch converter — timezone aware.',
    faqs: [
      { question: 'What is a Unix timestamp?', answer: 'A Unix timestamp is the number of seconds elapsed since January 1, 1970, 00:00:00 UTC (called the Unix epoch). It\'s a single number representing any point in time, independent of timezone.' },
      { question: 'What is the difference between seconds and milliseconds timestamps?', answer: 'Unix timestamps in seconds are standard (10 digits as of 2024). Millisecond timestamps (used in JavaScript\'s Date.now()) are 1000x larger (13 digits). Use seconds for most systems; milliseconds for JavaScript.' },
      { question: 'What is the maximum Unix timestamp?', answer: 'The 32-bit signed integer max is 2,147,483,647 = January 19, 2038, 03:14:07 UTC (the "Year 2038 problem"). 64-bit timestamps can represent dates billions of years into the future.' },
      { question: 'What timezone are Unix timestamps in?', answer: 'Unix timestamps are always in UTC (Coordinated Universal Time). They represent the same moment regardless of what timezone you\'re in. The local time display depends on your browser\'s timezone setting.' },
      { question: 'How do I get the current Unix timestamp in JavaScript?', answer: 'Math.floor(Date.now() / 1000) for seconds, or Date.now() for milliseconds. In Python: import time; int(time.time()). In PHP: time().' },
    ],
    howToSteps: [
      'View the current Unix timestamp at the top of the page (auto-updates).',
      'To convert timestamp to date: enter the Unix timestamp (seconds or ms) and click "Convert".',
      'To convert date to timestamp: enter the date and time, select the timezone, and click "Convert".',
      'View the timestamp in multiple formats: local time, UTC, ISO 8601.',
      'Copy any result with the copy button.',
    ],
    relatedToolSlugs: ['age-calculator', 'unit-converter', 'json-formatter', 'number-to-words'],
    icon: 'Clock',
    estimatedTime: 'Instant',
  },
  {
    slug: 'nepali-date-converter',
    name: 'Nepali Date Converter',
    shortDescription: 'Convert dates between Bikram Sambat (BS) and Gregorian (AD) calendar instantly.',
    longDescription: `<p>Our free <strong>Nepali date converter</strong> converts dates between Nepali Bikram Sambat (BS/विक्रम संवत) and English Gregorian (AD) calendars. Enter any date in BS and get the exact AD equivalent, or convert AD to BS — accurate from 2000 BS to 2099 BS (1943 AD to 2043 AD).</p>
<h2>Key Features</h2>
<ul>
<li><strong>BS to AD and AD to BS</strong>: Full bidirectional conversion with a single toggle.</li>
<li><strong>Nepali Month Names</strong>: Results displayed with Nepali month names (बैशाख, जेठ, असार...) and Nepali numerals (१, २, ३...).</li>
<li><strong>Day of Week</strong>: Shows the day of the week in both Nepali and English.</li>
<li><strong>Today's Date</strong>: Instantly see the current date in both BS and AD formats.</li>
<li><strong>Accurate Data</strong>: Built with verified BS calendar data that accounts for the variable days in each Nepali month.</li>
</ul>
<h2>Who Is This For?</h2>
<p>This tool is essential for filling government forms, scheduling events across calendars, checking dates for festivals (Dashain, Tihar), and everyday date conversions for anyone living or working in Nepal.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'converters',
    targetKeyword: 'Nepali date converter',
    secondaryKeywords: ['BS to AD converter', 'AD to BS converter', 'Nepali calendar converter', 'bikram sambat to english date', 'nepali date today', 'miti converter', 'nepali miti pariwartan', 'english to nepali date'],
    metaTitle: 'Nepali Date Converter - BS to AD & AD to BS | Free Online',
    metaDescription: 'Convert Nepali Bikram Sambat (BS) dates to English (AD) and vice versa. Shows Nepali month names, day of week & today\'s date. Free, fast & accurate.',
    faqs: [
      { question: 'What is Bikram Sambat (BS)?', answer: 'Bikram Sambat (BS) is the official calendar of Nepal, approximately 56 years and 8.5 months ahead of the Gregorian (AD) calendar. For example, 2080 BS corresponds roughly to 2023-2024 AD. The Nepali new year starts in mid-April (Baisakh 1).' },
      { question: 'How accurate is this converter?', answer: 'The converter uses verified BS calendar data with the exact number of days in each month for every year from 2000 BS to 2099 BS. It accounts for the irregular month lengths in the Nepali calendar, ensuring precise conversions.' },
      { question: 'What date range does it support?', answer: 'The converter supports dates from 2000 BS (1943 AD) to 2099 BS (2043 AD), covering over 100 years of conversions. This covers all practical date conversion needs.' },
      { question: 'What are the Nepali month names?', answer: 'The 12 Nepali months are: Baisakh (बैशाख), Jestha (जेठ), Ashadh (असार), Shrawan (श्रावण), Bhadra (भाद्र), Ashwin (असोज), Kartik (कार्तिक), Mangsir (मंसिर), Poush (पुष), Magh (माघ), Falgun (फागुन), and Chaitra (चैत्र).' },
      { question: 'Why do Nepali months have different numbers of days each year?', answer: 'Unlike the Gregorian calendar where months have fixed days (except February), Nepali months vary from 29 to 32 days and change every year. This is based on solar calculations, making an accurate data table essential for conversions.' },
    ],
    howToSteps: [
      'Select the conversion direction — BS to AD or AD to BS.',
      'Enter the year, month, and day in the input fields.',
      'The converted date appears instantly with full details.',
      'View the result in Nepali script with month names and day of week.',
      'Check "Today\'s Date" section for the current date in both calendars.',
    ],
    relatedToolSlugs: ['timestamp-converter', 'age-calculator', 'countdown-timer', 'timezone-checker'],
    icon: 'CalendarDays',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'preeti-to-unicode',
    name: 'Preeti to Unicode Converter',
    shortDescription: 'Convert Preeti font Nepali text to standard Unicode (युनिकोड) instantly. Free online tool.',
    longDescription: `<p>Our free <strong>Preeti to Unicode converter</strong> instantly converts Preeti font Nepali text to standard Unicode Devanagari. Preeti is the most popular legacy Nepali font used in government offices, banks, newspapers, and older documents across Nepal — but it doesn't display correctly on modern devices without the font installed. Unicode solves this.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Bidirectional Conversion</strong>: Preeti to Unicode and Unicode to Preeti — switch modes with a toggle.</li>
<li><strong>High Accuracy</strong>: Handles all Preeti characters, conjuncts (संयुक्त अक्षर), special symbols, numbers, and punctuation.</li>
<li><strong>Real-Time Output</strong>: Paste text and get perfectly formatted Unicode Nepali (देवनागरी) output instantly.</li>
<li><strong>Copy to Clipboard</strong>: One-click copy to paste anywhere — websites, emails, social media, Google Docs.</li>
<li><strong>No Limits</strong>: Convert unlimited text with no restrictions.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Essential for Nepali government employees, journalists, content creators, students, and anyone who works with Nepali text across old and modern systems.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'converters',
    targetKeyword: 'Preeti to Unicode converter',
    secondaryKeywords: ['preeti to unicode', 'unicode to preeti', 'nepali font converter', 'preeti unicode converter online', 'preeti to unicode nepali', 'convert preeti to unicode online free', 'nepali unicode converter', 'preeti font to unicode'],
    metaTitle: 'Preeti to Unicode Converter - Nepali Font Converter Free Online',
    metaDescription: 'Convert Preeti font text to Unicode Nepali (देवनागरी) instantly. Also supports Unicode to Preeti. Free online converter — no signup needed.',
    faqs: [
      { question: 'What is Preeti font?', answer: 'Preeti is the most widely used traditional Nepali font in Nepal. It maps Nepali characters to English keyboard keys. However, Preeti text only displays correctly when the Preeti font is installed — on the web and modern devices, Unicode is the standard.' },
      { question: 'What is Unicode?', answer: 'Unicode is the universal text encoding standard that allows Nepali text (देवनागरी) to display correctly on any device, browser, or operating system without needing special fonts installed. It is the standard for web content, emails, and modern documents.' },
      { question: 'Why convert Preeti to Unicode?', answer: 'Preeti text cannot be read on devices without the Preeti font installed. Converting to Unicode ensures your Nepali text is universally readable — on websites, social media, emails, Google Docs, and any modern application.' },
      { question: 'Does it handle conjuncts (जोडाक्षर)?', answer: 'Yes. The converter handles all standard Preeti conjunct characters (संयुक्त अक्षर) and maps them to their correct Unicode equivalents, including complex conjuncts used in formal Nepali writing.' },
      { question: 'Can I convert Unicode back to Preeti?', answer: 'Yes! The tool supports both directions — Preeti to Unicode and Unicode to Preeti. Use the mode toggle to switch between conversion directions.' },
    ],
    howToSteps: [
      'Select the conversion direction — Preeti to Unicode or Unicode to Preeti.',
      'Paste or type your text in the input box.',
      'The converted text appears instantly in the output panel.',
      'Click "Copy" to copy the converted text to your clipboard.',
      'Use the converted text on websites, emails, or documents.',
    ],
    relatedToolSlugs: ['nepali-date-converter', 'unicode-to-preeti', 'case-converter', 'text-to-speech'],
    icon: 'Languages',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'nepali-typing',
    name: 'Nepali Typing Tool',
    shortDescription: 'Type in Nepali (नेपाली) using your English keyboard. Romanized to Devanagari conversion.',
    longDescription: `<p>Type in <strong>Nepali</strong> using your regular English keyboard with our free Nepali Typing Tool. Simply type Romanized Nepali (like "namaste" to get "नमस्ते") and the tool converts it to Devanagari script in real-time. No Nepali keyboard layout or special software needed.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Phonetic Transliteration</strong>: Type how the word sounds in English and get Nepali Unicode output instantly.</li>
<li><strong>Virtual Keyboard</strong>: Click Nepali characters directly if you are unsure of the mapping.</li>
<li><strong>All Characters Supported</strong>: Consonants, vowels, conjuncts (संयुक्त अक्षर), and special characters all supported.</li>
<li><strong>Universal Unicode Output</strong>: Output works on websites, emails, social media, and documents everywhere.</li>
<li><strong>Character Mapping Reference</strong>: Built-in reference showing all Romanized-to-Devanagari mappings (ka→क, kha→ख, ga→ग, etc.).</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for Nepali speakers comfortable with English keyboards, students writing Nepali assignments, content creators, and anyone who needs to type Nepali text quickly and accurately without installing extra software.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'converters',
    targetKeyword: 'Nepali typing',
    secondaryKeywords: ['type in nepali', 'nepali typing online', 'romanized nepali to unicode', 'nepali keyboard online', 'english to nepali typing', 'nepali unicode typing', 'type nepali online free', 'nepali font typing'],
    metaTitle: 'Nepali Typing Tool - Type in Nepali Online Free | नेपाली टाइपिङ',
    metaDescription: 'Type in Nepali using English keyboard. Romanized to Devanagari conversion in real-time. Free online Nepali typing tool — no software needed.',
    faqs: [
      { question: 'How do I type in Nepali?', answer: 'Just type the Romanized version of the Nepali word using your English keyboard. For example: "nepal" → "नेपाल", "namaste" → "नमस्ते", "dhanyabad" → "धन्यवाद". The tool converts it to Devanagari Unicode automatically.' },
      { question: 'What is the mapping for Nepali characters?', answer: 'Common mappings: ka→क, kha→ख, ga→ग, gha→घ, nga→ङ, cha→च, chha→छ, ja→ज, jha→झ, ta→त, tha→थ, da→द, dha→ध, na→न, pa→प, pha→फ, ba→ब, bha→भ, ma→म, ya→य, ra→र, la→ल, wa→व, sha→श, sa→स, ha→ह.' },
      { question: 'Can I use the output on Facebook and WhatsApp?', answer: 'Yes! The output is in standard Unicode, which works on all platforms — Facebook, WhatsApp, Twitter, Instagram, Gmail, Google Docs, Word, and any modern application.' },
      { question: 'Do I need to install any software?', answer: 'No. This tool works entirely in your browser. No downloads, no installations, no fonts needed. Just open the page and start typing.' },
    ],
    howToSteps: ['Start typing Romanized Nepali in the input box (e.g., "namaste").', 'The Nepali Unicode text appears in real-time in the output.', 'Use the virtual keyboard for characters you are unsure about.', 'Click "Copy" to copy the Nepali text to your clipboard.', 'Paste the text in any application — email, social media, documents.'],
    relatedToolSlugs: ['preeti-to-unicode', 'nepali-date-converter', 'text-to-speech', 'word-counter'],
    icon: 'Keyboard',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'nepse-calculator',
    name: 'NEPSE Share Calculator',
    shortDescription: 'Calculate NEPSE share profit/loss, WACC & target price with broker commission, SEBON fee, DP charge & CGT.',
    longDescription: `<p>Nepal's most complete <strong>NEPSE calculator</strong> with three powerful tools in one: Profit/Loss Calculator, WACC (Weighted Average Cost) Calculator, and Target Price Calculator — all using official SEBON-regulated broker commission tiers, SEBON fee, DP charge, and Capital Gains Tax.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Profit/Loss Calculator</strong>: Enter buy price, sell price, and quantity (kitta) to see net profit/loss after all charges, with a visual fee breakdown chart and break-even price.</li>
<li><strong>WACC Calculator</strong>: Add multiple buy transactions to calculate your weighted average cost per share including all fees.</li>
<li><strong>Target Price Calculator</strong>: Enter your desired profit amount and find the exact sell price needed after all charges and Capital Gains Tax.</li>
<li><strong>Official Commission Tiers</strong>: 0.36% (up to Rs 50K) down to 0.24% (above 1Cr) — updated for FY 2081/2082.</li>
<li><strong>CGT Calculation</strong>: 5% individual (more than 365 days), 7.5% individual (365 days or less), 10% institutional.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Essential for Nepal stock market investors who want to accurately calculate net returns after all SEBON fees, broker commissions, DP charges, and capital gains tax on NEPSE share transactions.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'calculators',
    targetKeyword: 'NEPSE calculator',
    secondaryKeywords: ['nepse share calculator', 'nepse profit calculator', 'share calculator nepal', 'stock calculator nepal', 'nepse profit loss calculator', 'nepse share profit calculator', 'broker commission nepal', 'nepse tax calculator', 'share market calculator nepal', 'nepse break even calculator', 'sebon commission rate', 'capital gains tax nepal shares', 'nepse wacc calculator', 'share average cost calculator nepal', 'nepse target price calculator', 'नेप्से क्यालकुलेटर', 'नेप्से शेयर क्यालकुलेटर', 'शेयर नाफा नोक्सानी', 'नेप्से ब्रोकर कमिसन'],
    metaTitle: 'NEPSE Share Calculator - Profit/Loss, WACC & Target Price | Free',
    metaDescription: 'Calculate NEPSE share profit/loss, WACC & target price with broker commission, SEBON fee, DP charge & capital gains tax. Updated 2081 rates. Free Nepal stock calculator.',
    faqs: [
      { question: 'How is broker commission calculated in NEPSE?', answer: 'SEBON has set tiered commission rates: 0.36% for amounts up to Rs 50,000, 0.33% for Rs 50,001-5,00,000, 0.31% for Rs 5,00,001-20,00,000, 0.27% for Rs 20,00,001-1,00,00,000, and 0.24% for amounts above Rs 1 crore. The minimum commission is Rs 10 per transaction.' },
      { question: 'What is SEBON fee?', answer: 'SEBON (Securities Board of Nepal) charges a regulatory fee of 0.015% on every buy and sell transaction in NEPSE. This fee is separate from the broker commission.' },
      { question: 'What is DP charge?', answer: 'DP (Depository Participant) charge is a flat fee of Rs 25 charged per transaction for maintaining and transferring shares electronically through CDS (Central Depository System).' },
      { question: 'How much capital gains tax do I pay on NEPSE profits?', answer: 'Individual investors pay 5% CGT on profits from shares held more than 365 days, and 7.5% on shares held 365 days or less. Institutional investors pay 10% regardless of holding period. CGT is only applied when you make a profit.' },
      { question: 'What is the break-even price?', answer: 'The break-even price is the minimum selling price at which you neither make a profit nor a loss, after accounting for all charges (broker commission, SEBON fee, DP charge) and capital gains tax on both buy and sell sides.' },
      { question: 'Does this calculator work for all types of NEPSE securities?', answer: 'Yes, this calculator works for all listed securities on NEPSE including ordinary shares, preference shares, mutual funds, and debentures. The fee structure is the same across all security types.' },
      { question: 'What is WACC in share market?', answer: 'WACC (Weighted Average Cost of Capital) in the context of share trading means the average price you paid per share when you bought the same stock at different times and prices. It helps you know your true cost basis for calculating profit/loss.' },
      { question: 'How does the Target Price Calculator work?', answer: 'Enter your buy price, quantity, and desired profit amount. The calculator reverse-engineers the exact sell price you need, factoring in all broker commissions, SEBON fee, DP charge, and Capital Gains Tax. This helps you set realistic price targets.' },
      { question: 'What is the circuit breaker in NEPSE?', answer: 'NEPSE has a circuit breaker (price band) of ±10% per day for regular trading. This means a stock cannot increase or decrease more than 10% from its previous closing price in a single trading day.' },
    ],
    howToSteps: [
      'Choose a mode: Profit/Loss, WACC, or Target Price calculator.',
      'For Profit/Loss: Enter buy price, sell price, and quantity (kitta).',
      'Select investor type and holding period for CGT calculation.',
      'View net profit/loss, fee breakdown chart, circuit limits, and break-even price.',
      'For WACC: Add multiple buy transactions to get your average cost per share.',
      'For Target Price: Enter desired profit to find the exact sell price needed.',
    ],
    relatedToolSlugs: ['loan-comparison-calculator', 'nepali-date-converter', 'emi-calculator', 'percentage-calculator'],
    icon: 'TrendingUp',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'number-to-words',
    name: 'Number to Words',
    shortDescription: 'Convert numbers to words in Indian and international formats.',
    longDescription: `<p>Our <strong>number to words converter</strong> instantly converts any number into its written English equivalent. Enter any figure — from simple integers to large amounts — and get the word representation in either Indian (lakh, crore) or International (million, billion) numbering format.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Indian and International Formats</strong>: Switch between Indian (lakh/crore) and International (million/billion) numbering systems.</li>
<li><strong>Cheque Format</strong>: Output includes "Only" suffix — ready for writing on cheques and financial documents.</li>
<li><strong>Decimal Support</strong>: Handles decimal numbers (e.g., 1234.56 becomes "One Thousand Two Hundred Thirty-Four and Fifty-Six Paise").</li>
<li><strong>Large Numbers</strong>: Supports up to 99,999 crore (Indian) or nearly 1 trillion (International).</li>
<li><strong>One-Click Copy</strong>: Copy the word output directly to your clipboard.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Essential for writing cheques, drafting legal and financial documents, converting currency amounts, and preparing educational materials — for anyone in India, Nepal, Pakistan, or Bangladesh using the Indian numbering system.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'converters',
    targetKeyword: 'number to words converter',
    secondaryKeywords: ['number to words India', 'convert number to words', 'amount in words', 'cheque amount in words', 'number spelling converter', 'crore lakh in words'],
    metaTitle: 'Number to Words Converter - Indian & International Format Free',
    metaDescription: 'Convert numbers to words in Indian (lakh/crore) & international (million/billion) format. Perfect for cheques & legal docs. Free online tool — instant.',
    faqs: [
      { question: 'How does the Indian number system differ from the international system?', answer: 'International: 100,000 = one hundred thousand; 1,000,000 = one million. Indian: 100,000 = one lakh; 1,00,00,000 = one crore. The Indian system groups digits as 2-2-3 from right (e.g., 12,34,56,789), while international uses 3-3-3.' },
      { question: 'What is one crore in the international system?', answer: '1 crore = 10 million = 10,000,000. So ₹1 crore = $1 million approximately (at 100 INR/USD exchange rate for easy math, not actual rate).' },
      { question: 'Can I use this for writing cheques?', answer: 'Yes! Enter the numerical amount and get the words format ready for cheque writing. For example: 45,250 → "Forty-Five Thousand Two Hundred Fifty Only".' },
      { question: 'Does it support decimal numbers?', answer: 'Yes. Enter 1234.56 and get "One Thousand Two Hundred Thirty-Four and Fifty-Six Paise/Cents".' },
      { question: 'What is the maximum number supported?', answer: 'The tool supports numbers up to 999,99,99,99,999 (Indian: 99,999 crore; International: nearly 1 trillion).' },
    ],
    howToSteps: [
      'Enter any number in the input field.',
      'Select the format: Indian (lakh/crore) or International (million/billion).',
      'The number in words appears instantly below.',
      'For cheque writing, the output includes "Only" at the end.',
      'Click "Copy" to copy the words to your clipboard.',
    ],
    relatedToolSlugs: ['unit-converter', 'percentage-calculator', 'timestamp-converter', 'gst-calculator'],
    icon: 'Hash',
    estimatedTime: 'Instant',
  },

  // ─── DEVELOPER TOOLS (extra) ──────────────────────────────────────────────
  {
    slug: 'internet-speed-test',
    name: 'Internet Speed Test',
    shortDescription: 'Test your internet download speed and ping directly in your browser.',
    longDescription: `<p>Our free <strong>internet speed test</strong> measures your real-time download speed and ping (latency) directly in the browser — no plugins, no apps, no sign-up required. It downloads a test payload from Cloudflare's global edge network and precisely times the transfer using the browser's high-resolution Performance API.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Download Speed Test</strong>: Multiple progressive download rounds produce a stable, averaged result comparable to Speedtest.net or fast.com.</li>
<li><strong>Ping/Latency Test</strong>: Measures round-trip time in milliseconds — critical for gaming, video calls, and real-time apps.</li>
<li><strong>No App Required</strong>: Runs 100% in your browser — no Flash, no plugins, no installation needed.</li>
<li><strong>Quick Results</strong>: Full test completes in approximately 10-15 seconds.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for anyone wanting to verify their broadband, Wi-Fi, or mobile internet speed. Use it to troubleshoot slow connections, check if your ISP is delivering promised speeds, or test before important video calls or gaming sessions.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — no signup, no server-side processing, no personal data collected.</p>`,
    category: 'developer-tools',
    targetKeyword: 'internet speed test',
    secondaryKeywords: ['online speed test', 'check internet speed', 'download speed test', 'ping test', 'broadband speed test', 'wifi speed test', 'network speed checker'],
    metaTitle: 'Internet Speed Test - Free Online Download Speed & Ping Checker',
    metaDescription: 'Test your internet download speed and ping instantly in your browser. No app needed. Free online speed test — accurate & fast results in 15 seconds.',
    faqs: [
      { question: 'How does this speed test work?', answer: 'It downloads a test file from a CDN and measures the time taken using the browser\'s Performance API. Results are averaged over multiple rounds for accuracy.' },
      { question: 'Why is my result different from other speed tests?', answer: 'Results vary based on server location, time of day, browser overhead, and network conditions. For best results, close other tabs, connect via Ethernet, and run the test a few times.' },
      { question: 'What is ping / latency?', answer: 'Ping measures the round-trip time (ms) for a signal to travel from your device to a server and back. Lower is better: <20ms excellent, 20–50ms good, 50–100ms average, >100ms may affect real-time apps.' },
      { question: 'What download speed do I need?', answer: 'Browsing: 1–5 Mbps. HD streaming: 5–25 Mbps. 4K streaming: 25+ Mbps. Video calls: 3–10 Mbps. Online gaming: 3–6 Mbps. Working from home: 10–50 Mbps recommended.' },
      { question: 'Does this test use my data?', answer: 'Yes, a small amount of data is downloaded (up to ~25 MB) during the test. Use this tool on Wi-Fi if you are on a limited mobile data plan.' },
    ],
    howToSteps: [
      'Click the "Start Test" button to begin.',
      'The tool first measures your ping (latency) with quick requests.',
      'Then it downloads progressively larger payloads to measure download speed.',
      'Wait 10–15 seconds for the results to display.',
      'Click "Test Again" to run another measurement for comparison.',
    ],
    relatedToolSlugs: ['timezone-checker', 'json-formatter', 'url-encode-decode', 'base64-encode-decode'],
    icon: 'Wifi',
    isPopular: true,
    estimatedTime: '15 seconds',
  },

  // ─── CONVERTERS (extra) ───────────────────────────────────────────────────
  {
    slug: 'timezone-checker',
    name: 'Time Zone Checker',
    shortDescription: 'See current time across multiple world cities. Perfect for remote teams.',
    longDescription: `<p>The <strong>Time Zone Checker</strong> — your Office Buddy for remote teams — lets you instantly see the current local time in cities around the world, all updating live every second. No more mentally calculating time differences or searching what time it is in Tokyo right now.</p>
<h2>Key Features</h2>
<ul>
<li><strong>50+ World Cities</strong>: Add any major business hub from a curated list covering all global time zones.</li>
<li><strong>Live Clocks</strong>: Every city card shows current time, date, day of week, and UTC offset — updating every second.</li>
<li><strong>Working Hours Indicator</strong>: Color-coded status (green = working hours, yellow = early/evening, dark = nighttime) so you instantly know who is available.</li>
<li><strong>DST Aware</strong>: Automatically handles Daylight Saving Time transitions using the browser's Intl.DateTimeFormat API.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for scheduling international meetings, coordinating with remote teams, tracking market hours, or planning travel across multiple time zones.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'converters',
    targetKeyword: 'time zone checker',
    secondaryKeywords: ['world clock', 'time zone converter', 'international time zones', 'remote team time zones', 'office time zones', 'what time is it in', 'meeting time planner'],
    metaTitle: 'Time Zone Checker - World Clock for Remote Teams',
    metaDescription: 'See live current time across 50+ world cities. Office buddy for remote teams — add cities, track time zones, find the best meeting time. Free & instant.',
    faqs: [
      { question: 'How many cities can I add?', answer: 'You can add as many cities as you like from our list of 50+ major cities covering all time zones. Remove any city with the × button.' },
      { question: 'Does it account for daylight saving time (DST)?', answer: 'Yes. The tool uses the browser\'s Intl.DateTimeFormat API with IANA timezone names which automatically handles DST transitions for every region.' },
      { question: 'How accurate is the time shown?', answer: 'The time is derived from your device\'s system clock. It updates every second and is accurate to within a second of the true local time.' },
      { question: 'What do the colored indicators mean?', answer: 'Green = working hours (9am–6pm). Yellow = early/evening (6am–9am or 6pm–9pm). Dark = nighttime (9pm–6am). This helps you see who is available.' },
      { question: 'Can I find the best meeting time?', answer: 'Yes! Add all your team members\' cities and look for a time when most cities show green (working hours) simultaneously.' },
    ],
    howToSteps: [
      'Your local time zone is shown automatically at the top.',
      'Click "Add City" and search for any city by name.',
      'Select a city from the dropdown to add it to your world clock.',
      'All clocks update live every second automatically.',
      'Click the × button on any card to remove a city.',
    ],
    relatedToolSlugs: ['timestamp-converter', 'internet-speed-test', 'age-calculator', 'unit-converter'],
    icon: 'Globe',
    estimatedTime: 'Instant',
  },

  // ─── NEW TOOLS ────────────────────────────────────────────────────────────
  {
    slug: 'html-css-js-editor',
    name: 'HTML CSS JS Editor',
    shortDescription: 'Live HTML, CSS & JavaScript editor with instant preview — like CodePen.',
    longDescription: `<p>A powerful, browser-based <strong>online HTML CSS JS editor</strong> with real-time preview. Write HTML, CSS, and JavaScript in the editor panels and see your output update instantly — no installation, no sign-up required.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Live Preview</strong>: Output updates automatically 600ms after you stop typing, or run manually with one click.</li>
<li><strong>Built-in Console</strong>: Captures console.log, console.error, and console.warn output directly in the panel.</li>
<li><strong>4 Layout Modes</strong>: Side-by-side, top/bottom split, editor-only, or preview-only — choose what works for you.</li>
<li><strong>6 Starter Templates</strong>: Hello World, Counter, Todo App, Profile Card, Digital Clock, or Blank — get started instantly.</li>
<li><strong>Download Project</strong>: Save your work as a standalone HTML file with CSS and JavaScript embedded.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for front-end developers prototyping ideas, students learning web development, and anyone who needs a quick CodePen-style playground without leaving their browser.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'online HTML CSS JS editor',
    secondaryKeywords: ['html css js compiler', 'online code editor', 'live html editor', 'codepen alternative', 'html preview online', 'javascript playground', 'web code editor free'],
    metaTitle: 'HTML CSS JS Editor - Live Code Playground Online',
    metaDescription: 'Free online HTML, CSS & JavaScript live editor with instant preview. Like CodePen — with dark theme, console, 6 templates, 4 layouts & file download. No signup.',
    faqs: [
      { question: 'How does the live preview work?', answer: 'Your HTML, CSS, and JavaScript are combined and injected into a sandboxed iframe. The preview updates automatically 600ms after you stop typing (auto-run mode). You can also disable auto-run and click "Run" manually.' },
      { question: 'Can I use external libraries like Bootstrap or jQuery?', answer: 'Yes! Add a <link> tag for CSS libraries in your HTML panel and a <script src="..."> tag for JavaScript libraries like jQuery, Bootstrap, or Tailwind CSS CDN before your code.' },
      { question: 'How do I see console.log output?', answer: 'Click the "Console" bar at the bottom of the preview panel to expand it. All console.log, console.warn, console.error, and unhandled errors from your code will appear there.' },
      { question: 'Can I download my project?', answer: 'Yes. Click the download button (↓) in the toolbar to download a complete, standalone HTML file with your CSS and JavaScript embedded, ready to open in any browser.' },
      { question: 'Is my code saved automatically?', answer: 'Code is not auto-saved between sessions in the current version. Download your project or copy the code before leaving the page.' },
    ],
    howToSteps: [
      'Choose a starter template from the "Templates" dropdown or start with Blank.',
      'Write your HTML in the HTML tab, CSS in the CSS tab, and JavaScript in the JS tab.',
      'Watch the preview update live on the right (or below in vertical layout).',
      'Click the Console bar to see console.log output and error messages.',
      'Click the download button to save your project as a standalone HTML file.',
    ],
    relatedToolSlugs: ['html-to-markdown', 'markdown-to-html', 'json-formatter', 'base64-encode-decode', 'regex-tester'],
    icon: 'Code2',
    estimatedTime: 'Instant',
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    shortDescription: 'Convert JPG, PNG and WebP images to a single PDF file online.',
    longDescription: `<p>Convert one or multiple images into a single PDF file instantly with our free <strong>JPG to PDF</strong> converter. Supports JPG, PNG, WebP, GIF, and BMP formats. No uploads, no server — everything happens locally in your browser for complete privacy.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Multiple Images</strong>: Upload as many images as you need — each image becomes one page in the PDF.</li>
<li><strong>Drag to Reorder</strong>: Rearrange pages before converting by dragging images into your preferred order.</li>
<li><strong>Page Size Options</strong>: Choose A4, Letter, or Fit to Image which sizes each page to match the image dimensions exactly.</li>
<li><strong>Orientation and Margin</strong>: Set portrait or landscape orientation and customize the page margin.</li>
<li><strong>All Image Formats</strong>: JPG, PNG, WebP, GIF, and BMP are all supported.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for students, professionals, and anyone who needs to combine photos or scanned documents into a single PDF file for easy sharing or submission.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — your images never leave your device, no signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'JPG to PDF',
    secondaryKeywords: ['JPG to PDF converter', 'JPG to PDF online', 'image to PDF', 'PNG to PDF', 'convert JPG to PDF free', 'photos to PDF', 'JPG to PDF converter online free', 'multiple JPG to PDF', 'picture to PDF', 'convert image to PDF online'],
    metaTitle: 'JPG to PDF - Convert JPG to PDF Online Free | No Signup',
    metaDescription: 'Convert JPG, PNG & WebP images to PDF online free. Upload multiple images, reorder pages, choose A4 or Letter. 100% private — images never leave your device.',
    faqs: [
      { question: 'Can I convert multiple images to one PDF?', answer: 'Yes! Upload as many images as you need. Each image becomes one page in the PDF. You can reorder pages before converting.' },
      { question: 'What image formats are supported?', answer: 'JPG/JPEG, PNG, WebP, GIF, and BMP are all supported.' },
      { question: 'Is my image data uploaded to a server?', answer: 'No. All conversion happens entirely in your browser. Your images never leave your device.' },
      { question: 'Can I choose the PDF page size?', answer: 'Yes. Choose A4, Letter, or "Fit to Image" which sizes each page to match the image dimensions exactly.' },
      { question: 'Is there a limit on number of images?', answer: 'No hard limit, but for performance, convert in batches of 20–30 high-resolution images.' },
    ],
    howToSteps: [
      'Click "Browse" or drag images onto the upload area.',
      'Use arrow buttons to reorder pages if needed.',
      'Select page size, orientation, and margin.',
      'Click "Convert to PDF & Download".',
      'Open the PDF to verify all pages look correct.',
    ],
    relatedToolSlugs: ['word-to-pdf', 'pdf-merge', 'pdf-compress', 'pdf-split', 'image-flip-rotate'],
    icon: 'FilePlus',
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'pdf-rotate',
    name: 'Rotate PDF',
    shortDescription: 'Rotate PDF pages 90°, 180° or 270° — all pages or individually.',
    longDescription: `<p>Easily <strong>rotate PDF</strong> pages online — rotate one, some, or all pages of a PDF file directly in your browser. No uploads required — everything stays on your device for complete privacy.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Bulk Rotation</strong>: Rotate all pages at once — 90° clockwise, 90° counter-clockwise, or 180°.</li>
<li><strong>Per-Page Control</strong>: Fine-tune individual pages independently with different rotation values.</li>
<li><strong>Rotation Preview</strong>: Rotation labels are shown for each page before you download.</li>
<li><strong>Supports Most PDFs</strong>: Works with standard PDFs and attempts to open most encrypted files too.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Useful for anyone who has received a PDF with incorrectly oriented pages — scanned documents, reports, or presentations that need to be fixed before sharing or printing.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser using pdf-lib — your PDF never leaves your device, no signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'rotate PDF online',
    secondaryKeywords: ['rotate pdf pages', 'turn pdf sideways', 'flip pdf', 'pdf rotation tool free'],
    metaTitle: 'Rotate PDF Online Free - Rotate Pages 90° or 180°',
    metaDescription: 'Rotate PDF pages online for free — rotate all pages or individual pages 90°, 180° or 270°. No upload needed. Fast, private, works in your browser.',
    faqs: [
      { question: 'Can I rotate only specific pages?', answer: 'Yes. Use the per-page controls to set different rotations for individual pages while leaving others unchanged.' },
      { question: 'Does rotating permanently change the PDF?', answer: 'Yes, the downloaded PDF will have the rotation baked in. Keep the original file if you need it.' },
      { question: 'Is my PDF uploaded to a server?', answer: 'No. All processing happens entirely in your browser using pdf-lib. Your file never leaves your device.' },
      { question: 'Can I rotate encrypted PDFs?', answer: 'We attempt to open PDFs with ignoreEncryption mode, which works for most files, but heavily secured PDFs may not process correctly.' },
      { question: 'What rotation values are supported?', answer: '0° (no change), 90° clockwise, 180°, and 270° clockwise (= 90° counter-clockwise).' },
    ],
    howToSteps: [
      'Upload your PDF by dropping it or clicking the upload area.',
      'Use "Rotate All Pages" buttons to quickly rotate all pages at once.',
      'Optionally fine-tune rotation for individual pages using the per-page controls.',
      'Click "Download Rotated PDF" to save the result.',
      'Open the file to confirm all pages are correctly oriented.',
    ],
    relatedToolSlugs: ['pdf-merge', 'pdf-split', 'pdf-compress', 'pdf-organize'],
    icon: 'RotateCw',
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'pdf-watermark',
    name: 'Watermark PDF',
    shortDescription: 'Add text or image watermarks to every page of your PDF.',
    longDescription: `<p>Stamp a custom text or logo watermark onto every page of your PDF with our free tool to <strong>add watermark to PDF online</strong> — completely in your browser with no server upload needed.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Text Watermarks</strong>: Add custom text with control over font size, color, opacity, and rotation angle.</li>
<li><strong>Image Watermarks</strong>: Upload a PNG or JPG logo to use as an image watermark centered on every page.</li>
<li><strong>Flexible Positioning</strong>: Place the watermark at the center, corners, or tile it in a repeating grid across the page.</li>
<li><strong>Opacity Control</strong>: Adjust the opacity slider — 30% is typical for document watermarks, 10-20% for subtle branding.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Ideal for businesses protecting documents, lawyers watermarking contracts, photographers protecting proofs, and anyone who needs to mark PDFs as confidential, draft, or branded before sharing.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser using pdf-lib — your files stay private, no signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'add watermark to PDF online',
    secondaryKeywords: ['pdf watermark tool', 'stamp pdf watermark', 'confidential watermark pdf', 'watermark pdf free'],
    metaTitle: 'Add Watermark to PDF Free Online - Text & Image Stamps',
    metaDescription: 'Add text or image watermarks to every PDF page for free. Customize opacity, rotation, position and color. No upload required — 100% private & instant.',
    faqs: [
      { question: 'Can I add an image as a watermark?', answer: 'Yes! Switch to "Image Watermark" mode and upload a PNG or JPG logo. It will be centered on every page.' },
      { question: 'How do I make the watermark semi-transparent?', answer: 'Use the Opacity slider. 30% is typical for document watermarks, 10-20% for subtle branding.' },
      { question: 'Can I tile the watermark across the entire page?', answer: 'Yes. Set Position to "Tile (repeat)" to stamp the watermark in a repeating grid pattern.' },
      { question: 'Is my PDF sent to a server?', answer: 'No. Watermarking runs entirely in your browser using pdf-lib. Your files stay private.' },
      { question: 'What text styles can I use?', answer: 'Text watermarks use Helvetica Bold. You can control size (12–120px), color, opacity, and rotation angle.' },
    ],
    howToSteps: [
      'Upload your PDF file.',
      'Choose "Text Watermark" or "Image Watermark".',
      'Configure text, size, color, opacity, rotation, and position.',
      'Click "Download Watermarked PDF".',
      'Verify all pages have the watermark as expected.',
    ],
    relatedToolSlugs: ['pdf-merge', 'pdf-rotate', 'pdf-page-numbers', 'pdf-compress'],
    icon: 'Stamp',
    estimatedTime: '3-10 seconds',
  },
  {
    slug: 'pdf-page-numbers',
    name: 'Add Page Numbers to PDF',
    shortDescription: 'Automatically add page numbers to every page of your PDF.',
    longDescription: `<p>Automatically <strong>add page numbers to PDF</strong> online — insert page numbers into any PDF instantly with no upload, no sign-up, and full privacy. Choose from multiple position and format options.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Multiple Positions</strong>: Place page numbers at the bottom center, corners, or top of each page.</li>
<li><strong>Format Options</strong>: Choose from simple numbers, "Page 1 of 10" style, or custom prefixed formats.</li>
<li><strong>Custom Starting Number</strong>: Set a starting number to account for a table of contents or front matter.</li>
<li><strong>Skip Cover Page</strong>: Enable the "Skip first page" option to leave the cover unnumbered.</li>
<li><strong>Font and Color</strong>: Customize font size and color to match your document style.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for authors, students, and professionals who need to add page numbers to reports, theses, manuals, or any multi-page PDF document before printing or submitting.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — your PDF never leaves your device, no signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'add page numbers to PDF online',
    secondaryKeywords: ['pdf page numbering', 'number pdf pages', 'insert page numbers pdf free', 'pdf footer numbering'],
    metaTitle: 'Add Page Numbers to PDF Free Online - Custom Numbering',
    metaDescription: 'Add page numbers to any PDF free online. Choose position, format, font size and color. Skip cover pages, set custom starting number. No upload required.',
    faqs: [
      { question: 'Can I start numbering from a custom number?', answer: 'Yes. Set "Start from" to any number, e.g. start from 5 to account for a table of contents.' },
      { question: 'Can I skip numbering the first page (cover)?', answer: 'Yes. Enable the "Skip first page" checkbox to leave the cover unnumbered.' },
      { question: 'What formats are supported?', answer: '"1, 2, 3", "Page 1 of 10" style, or "- 1 -" style. You can also add a custom prefix like "P.".' },
      { question: 'Is my PDF uploaded anywhere?', answer: 'No. Everything runs in your browser. Your PDF is never sent to a server.' },
      { question: 'Can I change the font or use a custom font?', answer: 'Currently uses Helvetica (built into the PDF standard). Custom fonts require the full pdf-lib font loading, which may be added in a future update.' },
    ],
    howToSteps: [
      'Upload your PDF file.',
      'Choose position, format, and styling options.',
      'Preview the page number placement in the visual preview.',
      'Click "Download PDF with Page Numbers".',
      'Open the file to verify the numbering looks correct.',
    ],
    relatedToolSlugs: ['pdf-watermark', 'pdf-rotate', 'pdf-merge', 'pdf-organize'],
    icon: 'Hash',
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'pdf-organize',
    name: 'Organize PDF',
    shortDescription: 'Reorder, delete, and duplicate PDF pages with a click.',
    longDescription: `<p>Rearrange, remove, or duplicate pages in any PDF file with our free tool to <strong>organize PDF pages online</strong> — completely in your browser with no file upload required.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Reorder Pages</strong>: Use the arrow buttons to move any page up or down to your desired position.</li>
<li><strong>Delete Pages</strong>: Click the trash icon next to any page to remove it from the PDF.</li>
<li><strong>Duplicate Pages</strong>: Click the copy icon to insert a duplicate of any page immediately after it.</li>
<li><strong>Undo/Reset</strong>: Click "Reset order" to restore the original page sequence at any time.</li>
<li><strong>No Page Limit</strong>: No hard limit on pages, though very large PDFs may be slower to load.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Useful for anyone who needs to restructure a PDF — removing blank pages, reordering chapters, duplicating sections, or cleaning up a document before sharing.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — your PDF never leaves your device, no signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'organize PDF pages online',
    secondaryKeywords: ['reorder pdf pages', 'delete pdf pages', 'rearrange pdf free', 'pdf page organizer'],
    metaTitle: 'Organize PDF Pages Free Online - Reorder, Delete, Duplicate',
    metaDescription: 'Reorder, delete and duplicate PDF pages free online. Upload your PDF, drag pages to rearrange, remove unwanted pages and download. No upload to server.',
    faqs: [
      { question: 'Can I delete multiple pages?', answer: 'Yes. Click the trash icon next to any page to remove it. Repeat for each unwanted page.' },
      { question: 'Can I duplicate a page?', answer: 'Yes. Click the copy icon next to any page to insert a duplicate immediately after it.' },
      { question: 'Is there a limit on pages?', answer: 'No hard limit, but very large PDFs (500+ pages) may be slow to load.' },
      { question: 'Can I undo a change?', answer: 'Yes — click "Reset order" to restore the original page sequence. Individual deletions cannot be undone without resetting.' },
      { question: 'Is my PDF uploaded to a server?', answer: 'No. All processing happens in your browser. Your PDF stays completely private.' },
    ],
    howToSteps: [
      'Upload your PDF file.',
      'Use ↑ ↓ arrows to reorder pages.',
      'Click the trash icon to remove unwanted pages.',
      'Click the copy icon to duplicate a page.',
      'Click "Download Organized PDF" to save the result.',
    ],
    relatedToolSlugs: ['pdf-merge', 'pdf-split', 'pdf-rotate', 'pdf-compress'],
    icon: 'LayoutList',
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'redact-pdf',
    name: 'Redact PDF',
    shortDescription: 'Black out sensitive content in your PDF — draw redaction boxes and download a clean file.',
    longDescription: `<p>Easily <strong>redact PDF online free</strong> — remove sensitive information from PDF documents entirely in your browser with no server upload and no data exposure. Draw redaction rectangles over any text, images, or content you want hidden.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Draw Redaction Boxes</strong>: Click and drag to draw black, white, or gray redaction rectangles on any page.</li>
<li><strong>Select and Edit</strong>: Move, resize, or delete individual redaction boxes before finalizing.</li>
<li><strong>Undo/Redo</strong>: Full undo/redo support for all drawing operations.</li>
<li><strong>Text Search and Auto-Redact</strong>: Enter a name, number, or phrase and automatically redact all matching text across all pages.</li>
<li><strong>Page Thumbnails</strong>: Sidebar thumbnails for quick navigation through multi-page documents.</li>
<li><strong>Permanent Redactions</strong>: Downloaded PDF has solid filled rectangles burned into the page content.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Essential for legal professionals, HR teams, healthcare workers, and anyone who needs to share documents with sensitive information such as names, addresses, or financial data removed.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser using pdf-lib and PDF.js — your document never leaves your device, no signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'redact PDF online free',
    secondaryKeywords: ['black out pdf text', 'censor pdf', 'remove sensitive info pdf', 'pdf redaction tool', 'hide text in pdf'],
    metaTitle: 'Redact PDF Online Free - Black Out Sensitive Content Securely',
    metaDescription: 'Redact and black out sensitive content in PDF files online for free. Draw redaction boxes, search & auto-redact text. 100% client-side — your PDF never leaves your browser.',
    faqs: [
      { question: 'Are the redactions permanent?', answer: 'Yes. The downloaded PDF has solid filled rectangles drawn over the redacted areas using pdf-lib. The underlying text is visually covered. For maximum security, the rectangles are burned into the PDF page content.' },
      { question: 'Is my PDF uploaded to any server?', answer: 'No. All processing happens entirely in your browser using JavaScript. Your file never leaves your device.' },
      { question: 'Can I redact specific text automatically?', answer: 'Yes. Use the search feature to enter text (e.g., a name or phone number), and the tool will find and redact all matching text across all pages.' },
      { question: 'Can I undo a redaction?', answer: 'Yes. Before downloading, you can undo/redo any redaction using Ctrl+Z / Ctrl+Shift+Z or the toolbar buttons. You can also select and delete individual boxes.' },
      { question: 'What redaction colors are available?', answer: 'Black (default), white, and gray. Choose the color from the toolbar before drawing.' },
    ],
    howToSteps: [
      'Upload your PDF file by dragging it or clicking to browse.',
      'Navigate to the page with sensitive content using thumbnails or arrows.',
      'Switch to Draw mode and click-drag to create redaction rectangles.',
      'Use Select mode to move, resize, or delete existing redactions.',
      'Optionally use text search to auto-redact matching text across all pages.',
      'Click "Redact All" to apply redactions and download the clean PDF.',
    ],
    relatedToolSlugs: ['pdf-sign', 'pdf-watermark', 'pdf-crop', 'pdf-compress'],
    icon: 'ShieldOff',
    estimatedTime: '5-30 seconds',
  },
  {
    slug: 'pdf-crop',
    name: 'Crop PDF',
    shortDescription: 'Crop and trim margins from all pages of a PDF file.',
    longDescription: `<p>Remove unwanted white margins or trim specific edges from every page of your PDF with our free tool to <strong>crop PDF online</strong> — instantly in your browser with no upload required.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Custom Crop Values</strong>: Set exact top, right, bottom, and left crop values in PDF points (72pt = 1 inch).</li>
<li><strong>Quick Presets</strong>: Use small, medium, or large presets for fast cropping without manual entry.</li>
<li><strong>Visual Preview</strong>: See a crop preview before downloading so you can verify the result.</li>
<li><strong>All Pages at Once</strong>: Uniform cropping is applied to every page of the PDF in one step.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for removing excess white space from scanned documents, trimming oversized margins from academic papers, or resizing PDFs to fit a specific layout before printing or publishing.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — your PDF never leaves your device, no signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'crop PDF online',
    secondaryKeywords: ['trim pdf margins', 'remove pdf white space', 'crop pdf pages free', 'cut pdf border'],
    metaTitle: 'Crop PDF Online Free - Trim & Remove PDF Margins',
    metaDescription: 'Crop and trim PDF page margins online for free. Set top, right, bottom, left crop values. Visual preview included. No upload — 100% private & instant.',
    faqs: [
      { question: 'What unit are the crop values in?', answer: 'PDF points. 72 points = 1 inch = 25.4mm. A typical A4 page is 595 × 842 points.' },
      { question: 'Can I crop different pages differently?', answer: 'Currently uniform cropping is applied to all pages. Per-page cropping may be added in a future update.' },
      { question: 'Does cropping remove content or just hide it?', answer: 'PDF crop boxes hide content visually but technically the underlying content is still in the file. To truly remove it, you would need to render and re-encode the PDF.' },
      { question: 'Is my PDF uploaded to a server?', answer: 'No. All processing runs in your browser. Your file never leaves your device.' },
      { question: 'What happens if I crop too much?', answer: 'The tool prevents invalid crop values (where margins exceed page size). The visual preview also helps you judge the result.' },
    ],
    howToSteps: [
      'Upload your PDF file.',
      'Use a quick preset or enter custom top/right/bottom/left values.',
      'Check the visual crop preview to confirm the result.',
      'Click "Download Cropped PDF" to save.',
      'Verify the output pages are cropped as expected.',
    ],
    relatedToolSlugs: ['pdf-rotate', 'pdf-merge', 'pdf-compress', 'pdf-organize'],
    icon: 'Crop',
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'pdf-sign',
    name: 'Sign PDF',
    shortDescription: 'Add your electronic signature to any PDF — draw, type, or upload.',
    longDescription: `<p><strong>Sign PDF online free</strong> — add your electronic signature to PDF documents directly in your browser with no software to install and no server upload required. Choose from three signature methods.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Draw</strong>: Use your mouse or touchscreen to handwrite your signature on a digital canvas.</li>
<li><strong>Type</strong>: Enter your name and pick a cursive font style for a clean typed signature.</li>
<li><strong>Upload</strong>: Use an existing signature image (PNG with transparent background works best).</li>
<li><strong>Flexible Placement</strong>: Place the signature on the last page, first page, all pages, or any specific page number.</li>
<li><strong>Size and Position</strong>: Adjust signature size and position precisely using sliders.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for remote workers, freelancers, and professionals who need to sign contracts, agreements, or forms digitally without printing, signing, and scanning.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser using pdf-lib — your PDF and signature never leave your device, no signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'sign PDF online free',
    secondaryKeywords: ['electronic signature pdf', 'digital signature pdf', 'pdf e-sign', 'sign pdf without printing', 'draw signature pdf'],
    metaTitle: 'Sign PDF Online Free - Draw, Type or Upload Signature',
    metaDescription: 'Sign PDF files online for free. Draw your signature, type it in cursive, or upload an image. Add e-signature to any PDF page. 100% private.',
    faqs: [
      { question: 'Is this a legally binding electronic signature?', answer: 'This tool adds a visual signature image to the PDF. For legally binding e-signatures, you may need a service with audit trails like DocuSign or Adobe Sign.' },
      { question: 'Can I draw my signature on a phone or tablet?', answer: 'Yes! The drawing canvas supports touch input on mobile and tablet devices.' },
      { question: 'What is the best image format for uploading a signature?', answer: 'PNG with a transparent background gives the cleanest result. JPEG works too but will have a white background.' },
      { question: 'Can I sign only the last page?', answer: 'Yes. By default the signature is added to the last page. You can also choose first page, all pages, or a specific page number.' },
      { question: 'Is my PDF sent to a server?', answer: 'No. All signing happens in your browser using pdf-lib. Your file never leaves your device.' },
    ],
    howToSteps: [
      'Upload your PDF file.',
      'Choose "Draw", "Type", or "Upload" to create your signature.',
      'Set where to place the signature (last page, all pages, etc.).',
      'Adjust the size and position using the sliders.',
      'Click "Download Signed PDF" to save the result.',
    ],
    relatedToolSlugs: ['pdf-watermark', 'pdf-page-numbers', 'pdf-add-image', 'pdf-merge'],
    icon: 'PenLine',
    estimatedTime: '1-2 minutes',
  },
  {
    slug: 'pdf-add-image',
    name: 'Insert Image into PDF',
    shortDescription: 'Add logos, stamps, and images to PDF pages at any position.',
    longDescription: `<p><strong>Insert images into PDF</strong> online — add logos, stamps, illustrations, or any PNG, JPG, WebP, or GIF image to your PDF pages completely in your browser with no server upload required.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Multiple Images</strong>: Add several images to the same PDF, each with independent settings.</li>
<li><strong>Page Selection</strong>: Apply each image to all pages, first page, last page, or a specific custom page number.</li>
<li><strong>Position and Size</strong>: Control the left/top offset in PDF points and set the width precisely.</li>
<li><strong>Opacity Control</strong>: Adjust image opacity to create subtle watermarks or solid stamps.</li>
<li><strong>All Image Formats</strong>: PNG with transparency, JPG, WebP, and GIF are all supported.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Great for businesses adding company logos to every page, professionals stamping documents, and designers embedding illustrations into PDF presentations or reports.</p>
<h2>Privacy &amp; Security</h2>
<p>Runs 100% in your browser — your PDF and images never leave your device, no signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'insert image into PDF online',
    secondaryKeywords: ['add image to pdf', 'add logo to pdf', 'insert logo pdf', 'pdf stamp image free', 'embed image pdf'],
    metaTitle: 'Insert Image into PDF Free Online - Add Logo & Stamps',
    metaDescription: 'Insert images, logos and stamps into PDF pages free online. Control position, size, opacity. Apply to all pages or specific pages. No upload to server.',
    faqs: [
      { question: 'Can I add a logo to every page?', answer: 'Yes. Set "Apply to" to "All pages" to stamp the image on every single page of the PDF.' },
      { question: 'Can I add multiple different images?', answer: 'Yes! Click "Add Image" multiple times to insert several images, each with independent settings.' },
      { question: 'What image formats are supported?', answer: 'PNG, JPG, WebP, and GIF are accepted. PNG is recommended for logos with transparent backgrounds.' },
      { question: 'How do I position the image accurately?', answer: 'Use the Left and Top offset sliders. PDF coordinates are in points (72pt = 1 inch). Typical A4 page is 595 × 842 points.' },
      { question: 'Is my PDF uploaded to a server?', answer: 'No. All processing runs in your browser. Your PDF and images never leave your device.' },
    ],
    howToSteps: [
      'Upload your PDF file.',
      'Click "Add Image" and select a PNG or JPG image.',
      'Set which pages to apply the image to.',
      'Adjust width, position (left/top), and opacity.',
      'Click "Download PDF with Images" to save.',
    ],
    relatedToolSlugs: ['pdf-watermark', 'pdf-sign', 'pdf-page-numbers', 'jpg-to-pdf'],
    icon: 'ImagePlus',
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'csv-to-pdf',
    name: 'CSV to PDF',
    shortDescription: 'Convert CSV and Excel spreadsheet data into a formatted PDF table.',
    longDescription: `<p>Transform any CSV file or tabular data into a clean, professional PDF table with our free <strong>CSV to PDF converter</strong> — instantly in your browser with no server upload required.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Multiple Delimiters</strong>: Supports comma, semicolon, tab, and pipe-delimited files.</li>
<li><strong>Table Styles</strong>: Choose striped, bordered, or minimal table design.</li>
<li><strong>Customization</strong>: Set header color, font size, and document title.</li>
<li><strong>Auto-Pagination</strong>: Large datasets automatically paginate across A4 landscape pages.</li>
<li><strong>Live Preview</strong>: See the formatted table before exporting to PDF.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Data analysts sharing reports, accountants presenting financial tables, developers generating PDF exports, and anyone needing a professional table PDF from spreadsheet data.</p>
<h2>Privacy & Security</h2>
<p>Uses pdf-lib in your browser — your CSV data never leaves your device. No signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'CSV to PDF converter online',
    secondaryKeywords: ['csv to pdf', 'excel to pdf table', 'convert csv to pdf free', 'spreadsheet to pdf', 'csv pdf export'],
    metaTitle: 'CSV to PDF Converter Free Online - Table PDF from CSV',
    metaDescription: 'Convert CSV or Excel data to a formatted PDF table online free. Customize style, header color, font size. Live preview included. No upload — 100% private.',
    faqs: [
      { question: 'Can I convert Excel files directly?', answer: 'Excel (.xlsx) is not supported directly, but you can export your Excel sheet as CSV first and then convert here.' },
      { question: 'Does it handle large CSV files?', answer: 'Yes. The tool auto-paginates across multiple A4 landscape pages for datasets with many rows.' },
      { question: 'What delimiters are supported?', answer: 'Comma (,), semicolon (;), tab, and pipe (|). Select the correct one in the dropdown to parse your file correctly.' },
      { question: 'Can I add a title to the PDF?', answer: 'Yes. Enter a document title in the settings and it will appear prominently at the top of the first page.' },
      { question: 'Is my data uploaded to a server?', answer: 'No. All conversion runs in your browser using pdf-lib. Your CSV data never leaves your device.' },
    ],
    howToSteps: [
      'Paste CSV data into the text area or upload a .csv file.',
      'Select the correct delimiter.',
      'Customize title, table style, header color, and font size.',
      'Preview the table in the live preview panel.',
      'Click "Convert CSV to PDF" to download.',
    ],
    relatedToolSlugs: ['csv-to-json', 'pdf-page-numbers', 'pdf-merge', 'pdf-watermark'],
    icon: 'Table',
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    shortDescription: 'Generate strong, secure random passwords with one click.',
    longDescription: `<p>Generate strong, cryptographically secure random <strong>passwords</strong> instantly. Choose length (6–64 characters), select character types, and click once to get a secure password you can trust.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Crypto Randomness</strong>: Uses Web Crypto API (crypto.getRandomValues) — the same standard used by security software.</li>
<li><strong>Character Options</strong>: Mix uppercase, lowercase, numbers, and symbols freely.</li>
<li><strong>Strength Indicator</strong>: Visual score shows how strong your generated password is.</li>
<li><strong>Quick Presets</strong>: PIN, Simple, Strong, and Maximum Security presets for common use cases.</li>
<li><strong>Never Stored</strong>: Passwords are generated in your browser and never sent anywhere.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Anyone creating new accounts, IT admins setting up credentials, developers generating API secrets, and security-conscious users who want passwords that can't be guessed or brute-forced.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your passwords are never stored or transmitted. No signup required.</p>`,
    category: 'developer-tools',
    targetKeyword: 'password generator',
    secondaryKeywords: ['random password generator', 'strong password generator', 'secure password maker', 'password creator online', 'password generator online', 'generate strong password', 'random password generator online', 'password generator free', '16 character password generator', 'safe password generator'],
    metaTitle: 'Password Generator - Generate Strong Random Passwords Free',
    metaDescription: 'Generate strong, secure random passwords online. Choose length, character types & strength rating. Uses crypto API — 100% secure, no storage. Free & instant.',
    faqs: [
      { question: 'Is this password generator truly random?', answer: 'Yes. We use the Web Crypto API (crypto.getRandomValues) — the same standard used by security software.' },
      { question: 'Are my generated passwords stored?', answer: 'No. Passwords are generated in your browser and never sent to any server.' },
      { question: 'What makes a strong password?', answer: 'At least 12 characters, mixing uppercase, lowercase, numbers, and symbols. Unique for each account.' },
      { question: 'What are the presets?', answer: 'PIN (4-digit), Simple (8-char), Strong (16-char with symbols), Maximum Security (32-char all types).' },
      { question: 'Should I use a password manager?', answer: 'Yes! Use this tool to generate unique passwords and store them in a password manager like Bitwarden or 1Password.' },
    ],
    howToSteps: [
      'Adjust the length slider (8–16 is typical for most accounts).',
      'Select character types: uppercase, lowercase, numbers, symbols.',
      'Click "Regenerate" to create a new password.',
      'Check the strength indicator — aim for "Strong" or higher.',
      'Click "Copy Password" to copy to clipboard.',
    ],
    relatedToolSlugs: ['hash-generator', 'base64-encode-decode', 'qr-code-generator'],
    icon: 'Lock',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'csv-to-json',
    name: 'CSV to JSON',
    shortDescription: 'Convert CSV to JSON and JSON to CSV — fast bidirectional converter.',
    longDescription: `<p>Convert CSV data to JSON and JSON back to CSV instantly with our free bidirectional <strong>CSV to JSON converter</strong>. Paste data, upload a file, and get results in real time.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Bidirectional</strong>: Convert CSV→JSON or JSON→CSV with a single toggle.</li>
<li><strong>Multiple Delimiters</strong>: Supports comma, semicolon, tab, and pipe-delimited files.</li>
<li><strong>Auto Type Detection</strong>: Numeric string values like "42" are automatically converted to JSON numbers.</li>
<li><strong>Quoted Fields</strong>: Handles quoted fields containing commas correctly per CSV spec.</li>
<li><strong>Download Output</strong>: Save result as .json or .csv file.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers transforming data between formats, data analysts working with spreadsheets and APIs, and anyone needing a quick CSV/JSON conversion without writing code.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no data is sent to any server. No signup required.</p>`,
    category: 'developer-tools',
    targetKeyword: 'CSV to JSON converter',
    secondaryKeywords: ['csv to json online', 'json to csv converter', 'convert csv to json free', 'data converter online'],
    metaTitle: 'CSV to JSON Converter - Free Online Bidirectional Tool',
    metaDescription: 'Convert CSV to JSON and JSON to CSV online instantly. Auto number detection, multiple delimiters, file upload & download. Free, no signup required.',
    faqs: [
      { question: 'Does it handle quoted CSV fields?', answer: 'Yes. Fields containing commas or quotes enclosed in double quotes are parsed correctly per CSV spec.' },
      { question: 'What delimiters are supported?', answer: 'Comma (,), semicolon (;), tab, and pipe (|).' },
      { question: 'Does it convert string numbers to JSON numbers?', answer: 'Yes. Numeric string values like "42" are automatically converted to JSON numbers.' },
      { question: 'Can I convert JSON back to CSV?', answer: 'Yes! Click the swap button (⇄) to switch to JSON-to-CSV mode.' },
      { question: 'Is there a file size limit?', answer: 'No strict limit, but very large files (>10MB) may be slow. Split into smaller chunks if needed.' },
    ],
    howToSteps: [
      'Paste CSV data or click "Upload file" to load a .csv file.',
      'Select the correct delimiter for your CSV.',
      'JSON output appears instantly in the right panel.',
      'Click "Copy" or "Download" to save the result.',
      'Use the swap button to convert JSON back to CSV.',
    ],
    relatedToolSlugs: ['json-formatter', 'base64-encode-decode', 'url-encode-decode', 'html-to-markdown'],
    icon: 'Table',
    estimatedTime: 'Instant',
  },
  {
    slug: 'markdown-to-html',
    name: 'Markdown to HTML',
    shortDescription: 'Convert Markdown to HTML with live preview — split-screen editor.',
    longDescription: `<p>Convert Markdown text to clean HTML with a live split-screen preview using our free <strong>Markdown to HTML converter</strong>. See your rendered output instantly as you type.</p>
<h2>Supported Markdown Features</h2>
<ul>
<li><strong>Headings & Text</strong>: H1–H6, bold, italic, strikethrough, inline code.</li>
<li><strong>Lists & Quotes</strong>: Ordered lists, unordered lists, nested lists, blockquotes.</li>
<li><strong>Code Blocks</strong>: Fenced code blocks with language hints for syntax highlighting.</li>
<li><strong>Tables</strong>: GitHub Flavored Markdown (GFM) tables with header rows.</li>
<li><strong>Links & Images</strong>: Inline links, reference links, and image embeds.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Bloggers previewing Markdown posts, developers converting README files, technical writers creating documentation, and anyone working with Markdown-based platforms like Ghost, Jekyll, or Notion.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no data is sent to any server. No signup required.</p>`,
    category: 'developer-tools',
    targetKeyword: 'Markdown to HTML converter',
    secondaryKeywords: ['markdown to html online', 'md to html', 'markdown preview online', 'convert markdown free', 'markdown renderer'],
    metaTitle: 'Markdown to HTML Converter - Live Preview Online',
    metaDescription: 'Convert Markdown to HTML with live preview. Supports tables, code blocks, lists, links & more. Download as HTML file. Free online Markdown to HTML tool.',
    faqs: [
      { question: 'What Markdown features are supported?', answer: 'Headings H1–H6, bold, italic, strikethrough, inline code, fenced code blocks, links, images, lists, blockquotes, tables, and horizontal rules.' },
      { question: 'Can I download the HTML?', answer: 'Yes. Click "Download .html" to get a complete standalone HTML file with embedded CSS styling.' },
      { question: 'Does it support GFM tables?', answer: 'Yes, GitHub Flavored Markdown tables with header row are fully supported.' },
      { question: 'Is conversion done on a server?', answer: 'No. Everything runs in your browser. Your content is never sent to any server.' },
      { question: 'Can I convert README.md files?', answer: 'Yes! Paste your README.md content and see it rendered exactly as it would appear on GitHub.' },
    ],
    howToSteps: [
      'Type or paste your Markdown into the editor.',
      'See the live HTML preview update instantly.',
      'Switch to "HTML" view to see raw HTML output.',
      'Click "Copy HTML" to copy the code.',
      'Click "Download .html" for a complete styled HTML file.',
    ],
    relatedToolSlugs: ['html-to-markdown', 'json-formatter', 'url-encode-decode', 'csv-to-json'],
    icon: 'FileCode2',
    estimatedTime: 'Instant',
  },
  {
    slug: 'json-to-typescript',
    name: 'JSON to TypeScript',
    shortDescription: 'Convert JSON to TypeScript interfaces and types instantly online.',
    longDescription: `<p>Paste any JSON and instantly get clean, well-structured TypeScript interfaces with our free <strong>JSON to TypeScript converter</strong>. Stop writing type definitions by hand — generate production-ready types in seconds.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Recursive Analysis</strong>: Handles nested objects, arrays, mixed-type arrays (union types), and null values.</li>
<li><strong>Named Sub-Interfaces</strong>: Automatically creates separate named interfaces for nested objects (e.g., Address, Order).</li>
<li><strong>Output Options</strong>: Choose interface vs type alias, optional properties, readonly modifiers, and exports.</li>
<li><strong>Union Types</strong>: Mixed-type arrays generate proper TypeScript union types.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Frontend and backend developers working with REST APIs, GraphQL responses, or any JSON data source who need TypeScript type definitions quickly without writing them by hand.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your JSON is never sent to any server. No signup required.</p>`,
    category: 'developer-tools',
    targetKeyword: 'JSON to TypeScript converter',
    secondaryKeywords: ['json to ts', 'json to typescript online', 'json to interface', 'json to type', 'generate typescript from json', 'json to ts converter'],
    metaTitle: 'JSON to TypeScript Converter - Generate Interfaces Online Free',
    metaDescription: 'Convert JSON to TypeScript interfaces and types instantly. Handles nested objects, arrays, union types & null values. Free online JSON to TS converter.',
    faqs: [
      { question: 'How does this convert JSON to TypeScript?', answer: 'The tool parses your JSON, recursively analyzes each value\'s type, creates named interfaces for nested objects, determines array element types (including union types for mixed arrays), and generates clean TypeScript output with proper indentation.' },
      { question: 'What is the difference between interface and type in TypeScript?', answer: 'Interfaces are extendable and mergeable — ideal for object shapes. Type aliases are more flexible and can represent unions, intersections, and primitives. For most JSON-to-TS conversions, interfaces are preferred, but the tool lets you choose either.' },
      { question: 'Does it handle nested objects and arrays?', answer: 'Yes. Nested objects automatically get their own named interface (e.g., an "address" field generates an Address interface). Arrays are typed by their element type, and mixed-type arrays produce union types.' },
      { question: 'What happens with null values?', answer: 'By default, null values are typed as null. You can toggle the "Use unknown for null" option to type them as unknown instead, which is stricter and forces type checking before use.' },
      { question: 'Is my JSON data safe?', answer: 'Yes. Everything runs 100% in your browser. Your JSON is never sent to any server — the conversion happens entirely client-side using JavaScript.' },
    ],
    howToSteps: [
      'Paste your JSON into the left input panel (or click "Try Example").',
      'TypeScript interfaces appear instantly in the right panel.',
      'Open Settings to customize: root name, interface vs type, optional/readonly, export, etc.',
      'Click "Copy" to copy the generated TypeScript to your clipboard.',
      'Use "Prettify" to format messy JSON before converting.',
    ],
    relatedToolSlugs: ['json-formatter', 'csv-to-json', 'base64-encode-decode', 'regex-tester', 'markdown-to-html'],
    icon: 'Braces',
    estimatedTime: 'Instant',
  },

  // ─── ASTROLOGY TOOLS ──────────────────────────────────────────────────────
  {
    slug: 'rashi-checker',
    name: 'Rashi Checker',
    shortDescription: 'Find your Rashi (zodiac sign) by name — English & Hindi supported.',
    longDescription: `<p>Discover your Vedic <strong>Rashi by name</strong> instantly. Our Rashi Checker uses the traditional Hindu naming system based on Nakshatra syllables — the first syllable of your name reveals your zodiac sign in Vedic astrology.</p>
<h2>What You Get</h2>
<ul>
<li><strong>Your Rashi</strong>: The Vedic zodiac sign (Mesh through Meen) linked to your name's first syllable.</li>
<li><strong>Nakshatra</strong>: The birth star associated with your name syllable.</li>
<li><strong>Ruling Planet & Element</strong>: Planetary ruler and element for your Rashi.</li>
<li><strong>Personality Traits</strong>: Key characteristics associated with your Rashi.</li>
<li><strong>Lucky Numbers</strong>: Traditionally auspicious numbers for your sign.</li>
</ul>
<h2>English & Hindi Support</h2>
<p>Enter your name in English (Roman) or Hindi (Devanagari) — the tool detects the script automatically and identifies your Rashi from the first syllable using the traditional 108-syllable Nakshatra system.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no data is sent to any server. No signup required.</p>`,
    category: 'converters',
    targetKeyword: 'Rashi checker by name',
    secondaryKeywords: ['rashi by name', 'find rashi from name', 'naam se rashi', 'rashi kaise jane', 'janm rashi', 'zodiac by name hindi', 'rashi calculator'],
    metaTitle: 'Rashi Checker by Name - Find Your Vedic Zodiac Sign Free',
    metaDescription: 'Find your Rashi (Vedic zodiac sign) by name instantly. Supports English & Hindi names. Get Rashi, ruling planet, element, lucky number & personality traits.',
    faqs: [
      { question: 'What is a Rashi?', answer: 'Rashi is a Sanskrit term meaning "zodiac sign" in Vedic astrology. There are 12 Rashis corresponding to the 12 signs of the zodiac (Mesh/Aries through Meen/Pisces). Your Janma Rashi (birth Rashi) is determined by the position of the Moon at the time of your birth.' },
      { question: 'How does the Rashi Checker work?', answer: 'In Hindu tradition, babies are named using the syllable (Akshara) associated with their birth Nakshatra (lunar mansion). This tool identifies the first syllable of your name and matches it to the corresponding Nakshatra and Rashi using the traditional 108-syllable system.' },
      { question: 'Is Rashi the same as Sun sign?', answer: 'No. In Western astrology, your zodiac sign is based on the Sun\'s position (Sun sign). In Vedic astrology, Rashi typically refers to the Moon sign (Janma Rashi). This tool finds the Naam Rashi — the Rashi associated with your name\'s starting syllable.' },
      { question: 'Why does my name not match my actual Rashi?', answer: 'Not all names follow the traditional Nakshatra-based naming convention. If you were named based on family preference, English conventions, or modern practice, your name\'s syllable may not match your birth Rashi. The actual Rashi from a birth chart (Kundali) is more accurate.' },
      { question: 'Can I enter my name in Hindi?', answer: 'Yes! This tool fully supports Devanagari (Hindi) script. Type your name in Hindi and the tool will detect the language automatically and identify your Rashi from the first syllable.' },
    ],
    howToSteps: [
      'Type your name in the input box (English or Hindi both work).',
      'The tool identifies the first syllable of your name automatically.',
      'Your Rashi, ruling planet, element, and Nakshatra are displayed instantly.',
      'View personality traits and lucky details for your Rashi.',
      'Switch between English and Hindi display using the language toggle.',
    ],
    relatedToolSlugs: ['gun-milan', 'age-calculator', 'timezone-checker', 'number-to-words'],
    icon: 'Star',
    estimatedTime: 'Instant',
  },
  {
    slug: 'gun-milan',
    name: 'Gun Milan',
    shortDescription: 'Check marriage compatibility with Ashtakoota Gun Milan — 36 points score.',
    longDescription: `<p>Check marriage compatibility using the traditional Vedic Ashtakoota system with our free <strong>Gun Milan calculator</strong>. Enter both names and get an instant 36-point compatibility report with detailed Koota breakdown.</p>
<h2>The 8 Kootas Evaluated</h2>
<ul>
<li><strong>Varna</strong>: Spiritual compatibility and temperament.</li>
<li><strong>Vashya</strong>: Dominance and mutual control.</li>
<li><strong>Tara</strong>: Destiny and birth star compatibility.</li>
<li><strong>Yoni</strong>: Nature and physical compatibility.</li>
<li><strong>Graha Maitri</strong>: Planetary friendship and mental compatibility.</li>
<li><strong>Gana</strong>: Character and nature (Deva, Manushya, Rakshasa).</li>
<li><strong>Bhakoot</strong>: Love, health, and financial compatibility.</li>
<li><strong>Nadi</strong>: Genetic and health compatibility — highest weight of all 8.</li>
</ul>
<h2>Score Interpretation</h2>
<p>Below 18 points: not recommended. 18–24: acceptable. 25–32: good match. 33–36: excellent match. Key doshas (Nadi, Bhakoot, Gana) are flagged with explanations in both English and Hindi.</p>`,
    category: 'converters',
    targetKeyword: 'Gun Milan calculator',
    secondaryKeywords: ['kundali matching', 'kundli milan', 'ashtakoota matching', 'marriage compatibility calculator', 'guna milan online', '36 gun milan', 'shaadi compatibility'],
    metaTitle: 'Gun Milan Calculator - Kundali Matching Free Online',
    metaDescription: 'Check marriage compatibility with Gun Milan (Ashtakoota). Enter boy & girl names to get 36-point compatibility score, Nadi Dosha check & detailed analysis.',
    faqs: [
      { question: 'What is Gun Milan (Ashtakoota)?', answer: 'Gun Milan is the Vedic astrology system of checking marriage compatibility. "Ashtakoota" means 8 groups (Ashta = 8, Koota = group). Each Koota tests a different aspect of compatibility — from personality to health to genetics. The maximum score is 36 Gunas.' },
      { question: 'What is a good Gun Milan score?', answer: 'Less than 18 points is considered inauspicious (not recommended). 18–24 is average (acceptable with remedies). 25–32 is good (recommended). 33–36 is excellent (very auspicious).' },
      { question: 'What is Nadi Dosha and is it serious?', answer: 'Nadi Dosha occurs when both partners have the same Nadi (one of three types: Vata, Pitta, Kapha). It is considered the most serious dosha in Gun Milan, affecting health and offspring. Remedies include specific rituals and donations as advised by a qualified astrologer.' },
      { question: 'What is Bhakoot Dosha?', answer: 'Bhakoot Dosha occurs when the Rashis of the boy and girl are in a 2/12, 5/9, or 6/8 relationship. It can indicate challenges in finances, progeny, or longevity. Bhakoot Dosha may be cancelled if the Rashi lords are friendly or the same planet.' },
      { question: 'Is this tool based on names or birth charts?', answer: 'This tool uses name-based Nakshatra identification (the traditional Naam Nakshatra system) to determine the birth star from the first syllable of the name. For the most accurate Gun Milan, consult a Jyotishi (Vedic astrologer) using the actual birth charts (Kundalis) of both individuals.' },
    ],
    howToSteps: [
      'Enter the boy\'s name in the first field (English or Hindi).',
      'Enter the girl\'s name in the second field.',
      'Click "Check Compatibility" to calculate the Gun Milan score.',
      'View the detailed breakdown of all 8 Kootas with individual scores.',
      'Check for any doshas (Nadi, Bhakoot, Gana) and their implications.',
    ],
    relatedToolSlugs: ['rashi-checker', 'age-calculator', 'timezone-checker', 'number-to-words'],
    icon: 'Heart',
    estimatedTime: 'Instant',
  },

  // ─── CRICKET TOOLS ────────────────────────────────────────────────────────
  {
    slug: 'ipl-team-squad-explorer',
    name: 'IPL Team Squad Explorer',
    shortDescription: 'Explore all 10 IPL 2026 team squads. Filter by role, nationality and view auction prices.',
    longDescription: `<p>Browse complete <strong>IPL 2026 squad</strong> details for all 10 teams in one place. Find player roles, nationalities, auction prices, and retained players — free fan tool, no signup needed.</p>
<h2>What You Can Explore</h2>
<ul>
<li><strong>Full Squads</strong>: All 10 IPL 2026 teams with complete player lists.</li>
<li><strong>Player Details</strong>: Role (Batter, Bowler, All-rounder, WK), nationality, auction price, retained/bought status.</li>
<li><strong>Team Summary</strong>: Captain, home ground, purse used, and squad composition at a glance.</li>
<li><strong>Smart Filters</strong>: Filter by role or nationality across any team.</li>
<li><strong>Search</strong>: Find any IPL player instantly across all 10 franchises.</li>
</ul>
<h2>Who Is This For?</h2>
<p>IPL fans tracking their favourite team's squad, fantasy cricket players picking their XI, and cricket enthusiasts comparing franchise strengths before the season.</p>
<p><em>Unofficial fan-made tool. Not affiliated with BCCI or IPL.</em></p>`,
    category: 'cricket-tools',
    targetKeyword: 'IPL 2026 squad',
    secondaryKeywords: ['IPL team squad', 'IPL 2026 players list', 'CSK squad 2026', 'MI squad 2026', 'IPL squad explorer', 'IPL auction 2026', 'IPL retained players'],
    metaTitle: 'IPL 2026 Team Squad Explorer - All 10 Teams & Players',
    metaDescription: 'Explore complete IPL 2026 squad for all 10 teams. Filter by role & nationality. View auction prices, retained players & captain details. Free fan tool.',
    faqs: [
      { question: 'How many players are in each IPL 2026 team?', answer: 'Each IPL 2026 team can have a maximum of 25 players in their squad, with up to 8 overseas players allowed. However, only 4 overseas players can play in any single match.' },
      { question: 'What is the IPL 2026 auction purse for each team?', answer: 'Each IPL franchise receives a base purse of ₹120 crore for the auction. Teams can earn additional funds by releasing players. Retained players\' costs are deducted from this purse.' },
      { question: 'How many players can be retained before IPL 2026?', answer: 'IPL teams were allowed to retain up to 6 players before the mega auction, including a combination of capped and uncapped Indian players and overseas players.' },
      { question: 'Who are the uncapped players in IPL 2026?', answer: 'Uncapped players are those who have not played international cricket for India. They are often bought at lower prices and are a key part of the talent pipeline in IPL squads.' },
      { question: 'Can I track overseas players for each IPL team?', answer: 'Yes! Use the "Overseas" filter in the Squad Explorer to see all foreign players in any IPL team. Each team can have a maximum of 8 overseas players in their full squad.' },
      { question: 'Is this an official BCCI or IPL tool?', answer: 'No. This is an unofficial fan-made tool built for cricket enthusiasts. It is not affiliated with BCCI, IPL, or any franchise. All data is sourced from publicly available information.' },
    ],
    howToSteps: [
      'Click on any team card to expand and view the full squad.',
      'Use the Role filter to show only Batters, Bowlers, All-rounders, or Wicket-keepers.',
      'Use the Nationality filter to toggle between Indian and Overseas players.',
      'Use the search box to find any specific player across all 10 IPL teams instantly.',
      'View team summary cards for captain, purse used, and squad composition.',
    ],
    relatedToolSlugs: ['ipl-match-schedule', 'ipl-player-comparison', 'ipl-points-table', 'age-calculator', 'percentage-calculator'],
    icon: 'Trophy',
    estimatedTime: 'Instant',
  },
  {
    slug: 'ipl-match-schedule',
    name: 'IPL 2026 Match Schedule',
    shortDescription: 'Full IPL 2026 fixture list with live countdown to next match. Filter by team or venue.',
    longDescription: `<p>View the complete <strong>IPL 2026 match schedule</strong> — every fixture, date, time, venue, and team pairing in one clean interface. No more searching multiple websites.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Live Countdown</strong>: Real-time timer showing exactly when the next IPL match begins.</li>
<li><strong>Team Filter</strong>: Instantly view only your favourite franchise's home and away fixtures.</li>
<li><strong>Venue Filter</strong>: Plan ahead for matches at Wankhede, Chinnaswamy, Eden Gardens, and more.</li>
<li><strong>Monthly Grouping</strong>: Fixtures organized by month for easy navigation across the full season.</li>
<li><strong>Add to Calendar</strong>: One click to add any match to Google Calendar.</li>
</ul>
<h2>Who Is This For?</h2>
<p>IPL fans planning which matches to watch or attend, fantasy cricket players tracking upcoming fixtures, and cricket enthusiasts wanting to follow the full season schedule. All times in IST.</p>
<p><em>Unofficial fan-made tool. Not affiliated with BCCI or IPL.</em></p>`,
    category: 'cricket-tools',
    targetKeyword: 'IPL 2026 match schedule',
    secondaryKeywords: ['IPL 2026 fixtures', 'IPL schedule 2026', 'IPL match time table', 'IPL 2026 dates', 'IPL next match', 'IPL 2026 venue', 'IPL schedule today'],
    metaTitle: 'IPL 2026 Match Schedule - Full Fixture List & Countdown',
    metaDescription: 'View complete IPL 2026 match schedule with live countdown to next match. Filter by team or venue. All match dates, times & venues in IST. Free fan tool.',
    faqs: [
      { question: 'When does IPL 2026 start?', answer: 'IPL 2026 is scheduled to begin in late March 2026. The exact opening match date and venue will be confirmed by BCCI. Check back for the latest official announcement.' },
      { question: 'How many matches are played in IPL 2026?', answer: 'IPL 2026 features 74 matches in total — 70 league stage matches (each team plays 14 games) plus 4 playoff matches including Qualifier 1, Eliminator, Qualifier 2, and the Final.' },
      { question: 'What time are IPL matches played?', answer: 'IPL 2026 matches are typically played at two time slots: afternoon matches at 3:30 PM IST and evening matches at 7:30 PM IST. Double-header days feature both time slots.' },
      { question: 'How many home games does each IPL team play?', answer: 'Each of the 10 IPL teams plays 7 home matches and 7 away matches in the league stage, totalling 14 matches per team before the playoffs.' },
      { question: 'Can I add IPL matches to Google Calendar?', answer: 'Yes! Click the "Add to Calendar" button next to any match in the schedule. This creates a Google Calendar event with the match details, time, and venue automatically filled in.' },
      { question: 'Is this an official IPL schedule?', answer: 'No. This is an unofficial fan-made schedule tool. While we strive for accuracy, always verify match times on the official BCCI or IPL website for the most up-to-date information.' },
    ],
    howToSteps: [
      'The page loads with a live countdown timer to the very next IPL 2026 match.',
      'Scroll down to see the full match schedule grouped by month.',
      'Use the "Filter by Team" dropdown to see only your favourite team\'s matches.',
      'Use the "Filter by Venue" dropdown to see matches at a specific stadium.',
      'Click "Add to Calendar" on any match to save it to your Google Calendar.',
    ],
    relatedToolSlugs: ['ipl-team-squad-explorer', 'ipl-player-comparison', 'ipl-points-table', 'countdown-timer', 'age-calculator'],
    icon: 'Calendar',
    estimatedTime: 'Instant',
  },
  {
    slug: 'ipl-player-comparison',
    name: 'IPL Player Comparison Tool',
    shortDescription: 'Compare any 2 IPL players side by side with career stats, averages and strike rates.',
    longDescription: `<p>Compare the career IPL statistics of any two players side by side with our free <strong>IPL player comparison</strong> tool. Instant head-to-head breakdown across all key batting and bowling metrics.</p>
<h2>Stats Compared</h2>
<ul>
<li><strong>Batting</strong>: Matches, innings, runs, average, strike rate, highest score, 50s, 100s, 4s, and 6s.</li>
<li><strong>Bowling</strong>: Wickets, economy rate, bowling average, and best bowling figures.</li>
<li><strong>Winner Highlight</strong>: The better performer in each category is highlighted in green.</li>
</ul>
<h2>60+ Top IPL Players</h2>
<p>Covers current stars and legends — Virat Kohli, Rohit Sharma, MS Dhoni, Jasprit Bumrah, and many more. Compare any two players regardless of their primary role.</p>
<p><em>Unofficial fan-made tool using historical IPL career data. Not affiliated with BCCI or IPL.</em></p>`,
    category: 'cricket-tools',
    targetKeyword: 'IPL player comparison',
    secondaryKeywords: ['compare IPL players', 'IPL player stats', 'IPL batting stats', 'IPL bowling stats', 'Virat Kohli vs Rohit Sharma IPL', 'IPL player head to head', 'IPL career stats'],
    metaTitle: 'IPL Player Comparison Tool - Compare Career Stats Side by Side',
    metaDescription: 'Compare any 2 IPL players side by side. View career batting & bowling stats, averages, strike rates and more. Free unofficial IPL fan tool by ToolsArena.',
    faqs: [
      { question: 'Which players can I compare in this tool?', answer: 'The tool includes the top 60+ IPL players with complete career statistics. This covers current stars like Virat Kohli, Rohit Sharma, MS Dhoni, Jasprit Bumrah, and many more.' },
      { question: 'What stats are shown in the IPL player comparison?', answer: 'Batting stats include: Matches, Innings, Runs, Average, Strike Rate, Highest Score, 50s, 100s, 4s, and 6s. Bowling stats include: Wickets, Economy, Bowling Average, and Best Figures.' },
      { question: 'Does this show current season stats or career IPL stats?', answer: 'The comparison tool shows career IPL statistics — the complete record across all IPL seasons a player has participated in, not just one season.' },
      { question: 'How does the winner highlight work?', answer: 'For each stat category, the player with the better value is highlighted in green. For batting, higher is better (runs, average, strike rate). For bowling economy, lower is better.' },
      { question: 'Can I compare a batter vs a bowler?', answer: 'Yes! You can compare any two players regardless of their primary role. If a player has both batting and bowling stats, both sections will be shown. Stats not applicable to a player will show as N/A.' },
      { question: 'Are these official IPL statistics?', answer: 'No. This is an unofficial fan-made tool for entertainment. Stats are based on historical data and may have minor variations from official records. Visit the official IPL website for authoritative statistics.' },
    ],
    howToSteps: [
      'Select "Player 1" from the first dropdown — search by typing the player\'s name.',
      'Select "Player 2" from the second dropdown.',
      'The comparison table appears instantly with all batting and bowling stats.',
      'Green highlights show the better performer in each stat category.',
      'Scroll down to see all stat categories including boundaries and bowling figures.',
    ],
    relatedToolSlugs: ['ipl-team-squad-explorer', 'ipl-match-schedule', 'ipl-points-table', 'percentage-calculator', 'age-calculator'],
    icon: 'Users',
    estimatedTime: 'Instant',
  },
  {
    slug: 'ipl-points-table',
    name: 'IPL 2026 Points Table',
    shortDescription: 'Live IPL 2026 standings with NRR, qualification zones and sortable columns.',
    longDescription: `<p>Track the <strong>IPL 2026 points table</strong> — standings, Net Run Rate, wins/losses, and playoff qualification zones for all 10 teams in one clear view.</p>
<h2>Table Columns</h2>
<ul>
<li><strong>Points</strong>: 2 per win, 1 for no-result, 0 for loss.</li>
<li><strong>NRR</strong>: Net Run Rate — tiebreaker when teams are level on points.</li>
<li><strong>Qualification Zones</strong>: Top 2 (double chance) highlighted in blue; 3rd–4th (also qualify) in green.</li>
<li><strong>Sortable</strong>: Click any column header to rank teams by points, NRR, or wins.</li>
</ul>
<h2>Who Is This For?</h2>
<p>IPL fans monitoring the playoff race, fantasy cricket players tracking their teams' standings, and cricket enthusiasts understanding the NRR tiebreaker dynamics as the season progresses.</p>
<p><em>Unofficial fan-made tool. Not affiliated with BCCI or IPL.</em></p>`,
    category: 'cricket-tools',
    targetKeyword: 'IPL 2026 points table',
    secondaryKeywords: ['IPL standings 2026', 'IPL points table today', 'IPL NRR calculator', 'IPL qualification table', 'IPL league table', 'IPL team rankings', 'IPL playoff qualification'],
    metaTitle: 'IPL 2026 Points Table - Live Standings, NRR & Playoffs',
    metaDescription: 'View IPL 2026 points table with live standings, NRR, wins/losses. See which teams qualify for playoffs. Sortable by points, NRR and wins. Free fan tool.',
    faqs: [
      { question: 'How does the IPL points system work?', answer: 'In IPL, each win earns a team 2 points. A loss gives 0 points. A no-result or abandoned match gives both teams 1 point each. Teams are ranked by total points, with NRR as the tiebreaker.' },
      { question: 'What is Net Run Rate (NRR) in IPL?', answer: 'NRR = (Total runs scored ÷ Total overs faced) − (Total runs conceded ÷ Total overs bowled). A positive NRR means a team scores faster than they concede. It is used as a tiebreaker when teams have equal points.' },
      { question: 'How many teams qualify for the IPL 2026 playoffs?', answer: 'The top 4 teams from the league stage qualify for the playoffs. Teams finishing 1st and 2nd get a double chance (they play in Qualifier 1 and if they lose, get another chance in Qualifier 2). Teams finishing 3rd and 4th play the Eliminator.' },
      { question: 'When does the IPL 2026 league stage end?', answer: 'The IPL 2026 league stage typically runs from late March to late May, with playoffs and the final held in June. The exact dates are confirmed by BCCI closer to the season.' },
      { question: 'What happens if two teams are level on points?', answer: 'If two or more teams have equal points at the end of the league stage, Net Run Rate (NRR) is used as the tiebreaker. If NRR is also equal, head-to-head results between those teams are considered.' },
      { question: 'Is this the official IPL points table?', answer: 'No. This is an unofficial fan-made tool. For the live official points table updated in real-time, visit the official IPL website or Cricbuzz. This tool is for reference and educational purposes.' },
    ],
    howToSteps: [
      'View the current IPL 2026 standings at a glance on the points table.',
      'Teams highlighted in blue (top 2) have a double chance in the playoffs.',
      'Teams highlighted in green (3rd and 4th) also qualify for the playoffs.',
      'Click any column header to sort the table by that statistic.',
      'Check the NRR column to understand tiebreakers between teams with equal points.',
    ],
    relatedToolSlugs: ['ipl-team-squad-explorer', 'ipl-match-schedule', 'ipl-player-comparison', 'percentage-calculator', 'age-calculator'],
    icon: 'BarChart2',
    estimatedTime: 'Instant',
  },

  // ─── BUSINESS TOOLS ─────────────────────────────────────────────────────
  {
    slug: 'invoice-generator',
    name: 'Invoice Generator',
    shortDescription: 'Create professional invoices in seconds. Download as PDF — free, no signup.',
    longDescription: `<p>Create professional invoices in seconds and download them as PDF with our free <strong>invoice generator</strong>. No accounting software, no signup, no data stored on servers — unlimited invoices.</p>
<h2>Key Features</h2>
<ul>
<li><strong>3 Templates</strong>: Modern, Classic, and Minimal — professionally designed for any business.</li>
<li><strong>Logo & Branding</strong>: Upload your company logo and pick your brand color.</li>
<li><strong>Auto Calculations</strong>: Subtotal, tax (GST/VAT/Sales Tax), discounts, and grand total calculated automatically.</li>
<li><strong>30+ Currencies</strong>: USD, EUR, GBP, INR, NPR, AED, CAD, AUD, and more.</li>
<li><strong>Save Template</strong>: Store your business details in browser localStorage for instant re-use.</li>
<li><strong>Live Preview</strong>: See your invoice update in real time as you type.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Freelancers billing clients, small business owners creating invoices, and startup founders who need professional invoices without paying for accounting software.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your business data and invoice amounts never leave your device. No signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'free invoice generator',
    secondaryKeywords: ['invoice generator online', 'invoice maker', 'create invoice online free', 'invoice generator pdf', 'free invoice maker no signup', 'GST invoice generator', 'online bill maker', 'invoice template generator', 'professional invoice creator', 'freelance invoice tool'],
    metaTitle: 'Free Invoice Generator - Create & Download PDF Invoices Online',
    metaDescription: 'Create professional invoices in seconds with our free invoice generator. Add logo, taxes, discounts, 30+ currencies. Download as PDF — no signup, 100% private.',
    faqs: [
      { question: 'Is this invoice generator really free?', answer: 'Yes, 100% free with no hidden costs. You can create unlimited invoices, download them as PDF, and use all features including logo upload, multiple templates, and 30+ currencies — no signup or payment required.' },
      { question: 'Is my data safe? Where is it stored?', answer: 'Your data is completely safe. Everything runs in your browser using JavaScript. Your business details, client information, and invoice data never leave your device. Nothing is sent to any server. You can also save your template locally for convenience.' },
      { question: 'Can I add my company logo to the invoice?', answer: 'Yes! Click the logo upload area in the Business Details section to upload your company logo (PNG or JPG, max 2MB). The logo will appear on your invoice PDF and in the live preview.' },
      { question: 'What currencies are supported?', answer: 'The tool supports 30+ currencies including USD ($), EUR, GBP, INR, NPR, CAD, AUD, JPY, AED, SGD, BRL, ZAR, MYR, THB, KRW, NGN, PKR, BDT, IDR, PHP, and more. Select your currency from the dropdown at the top.' },
      { question: 'Can I add tax (GST/VAT) and discounts?', answer: 'Yes. You can set a custom tax label (Tax, GST, VAT, Sales Tax), enter the tax percentage, and add either a percentage-based or flat discount. All calculations are done automatically.' },
      { question: 'How do I save my business details for next time?', answer: 'Click the "Save Template" button at the top. Your business name, address, email, phone, logo, tax ID, and other details will be saved in your browser\'s local storage and auto-filled next time you use the tool.' },
    ],
    howToSteps: [
      'Enter your business details — name, address, email, phone, and optionally upload your logo.',
      'Fill in your client\'s name, company, email, and address.',
      'Set the invoice number, date, and due date.',
      'Add line items with description, quantity, and rate. Click "Add Item" for more rows.',
      'Set tax rate and discount if applicable. Choose your currency.',
      'Review the live preview on the right. Click "Download PDF" to save your invoice.',
    ],
    relatedToolSlugs: ['csv-to-pdf', 'pdf-merge', 'number-to-words', 'qr-code-generator', 'gst-calculator'],
    icon: 'Receipt',
    isPopular: true,
    estimatedTime: 'Instant',
  },

  // ─── FINANCE CALCULATORS ────────────────────────────────────────────────
  {
    slug: 'loan-comparison-calculator',
    name: 'Loan Comparison Calculator',
    shortDescription: 'Compare multiple loan offers side-by-side. See EMI, total interest & total cost differences.',
    longDescription: `<p>Compare up to 4 loan offers side by side with our free <strong>loan comparison calculator</strong>. See exactly which loan saves you the most money in total interest paid.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Side-by-Side Comparison</strong>: Enter amount, rate, and tenure for up to 4 loan options.</li>
<li><strong>Full Breakdown</strong>: See monthly EMI, total interest, total payable, and savings vs the worst deal.</li>
<li><strong>Visual Charts</strong>: Bar charts highlight the best and worst loan offers at a glance.</li>
<li><strong>Standard EMI Formula</strong>: EMI = P × r × (1+r)^n / ((1+r)^n - 1) — transparent calculations.</li>
<li><strong>₹ Lakh/Crore Formatting</strong>: Indian Rupee notation for easy reading of large amounts.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Anyone shopping for home loans, personal loans, car loans, or education loans who wants to make an informed decision about which bank offer is genuinely cheaper over the full tenure.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no data stored, no signup required.</p>`,
    category: 'calculators',
    targetKeyword: 'loan comparison calculator',
    secondaryKeywords: ['compare loans', 'EMI comparison calculator', 'loan interest comparison', 'home loan comparison', 'best loan calculator', 'loan EMI compare', 'compare home loan rates', 'loan offer comparison tool'],
    metaTitle: 'Loan Comparison Calculator - Compare EMI & Interest Free Online',
    metaDescription: 'Compare up to 4 loan offers side-by-side. See EMI, total interest & savings instantly. Free loan comparison calculator — no signup needed.',
    faqs: [
      { question: 'How does loan comparison work?', answer: 'Enter the loan amount, interest rate, and tenure for each loan option. The calculator computes EMI, total interest, and total payable for each, then highlights which offer saves you the most money.' },
      { question: 'What is EMI?', answer: 'EMI (Equated Monthly Installment) is the fixed monthly payment you make to repay a loan. It includes both principal repayment and interest. The EMI stays the same throughout the loan tenure.' },
      { question: 'Is a lower EMI always better?', answer: 'Not always. A lower EMI might mean a longer tenure, which increases total interest paid. Compare the total cost (principal + total interest) to find the truly cheaper loan.' },
      { question: 'Can I compare different loan amounts?', answer: 'Yes! Each loan slot is independent — you can compare different amounts, rates, and tenures. This is useful when comparing, say, a larger loan at lower interest vs a smaller loan at higher interest.' },
    ],
    howToSteps: ['Enter the loan amount for the first loan option.', 'Set the annual interest rate and loan tenure (in years).', 'Add more loan options (up to 4) for comparison.', 'View EMI, total interest, and total cost side-by-side.', 'The best deal is highlighted in green — showing how much you save.'],
    relatedToolSlugs: ['emi-calculator', 'compound-interest-calculator', 'sip-calculator', 'fd-rd-calculator'],
    icon: 'Scale',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    shortDescription: 'Calculate compound interest with yearly breakdown. Supports monthly, quarterly & yearly compounding.',
    longDescription: `<p>The <strong>compound interest calculator</strong> by ToolsArena is a free, no-signup tool that helps you calculate how your money grows over time. Whether you're planning a fixed deposit (FD), recurring deposit (RD), PPF investment, or simply understanding the power of compounding — get instant, accurate results.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Multiple Compounding Frequencies</strong>: Choose monthly, quarterly, half-yearly, or yearly compounding to match your investment.</li>
<li><strong>Year-by-Year Breakdown</strong>: See exactly how your investment grows each year with a detailed table.</li>
<li><strong>CI vs SI Comparison</strong>: Compare compound interest vs simple interest side by side to see the real advantage of compounding.</li>
<li><strong>Visual Breakdown Bar</strong>: Shows the proportion of principal to interest in your final maturity amount.</li>
<li><strong>Transparent Formula</strong>: Uses A = P × (1 + r/n)^(n×t), displayed on the page so you can verify the math.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Students, investors, and anyone planning their financial future. Ideal for comparing FD rates, understanding PPF growth, or learning how compounding accelerates wealth creation over time.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no data is sent to any server, no signup required.</p>`,
    category: 'calculators',
    targetKeyword: 'compound interest calculator',
    secondaryKeywords: ['CI calculator', 'compound interest formula', 'compound interest calculator with steps', 'monthly compound interest calculator', 'quarterly compound interest calculator', 'compound interest calculator India', 'FD interest calculator', 'compound interest calculator online free', 'power of compounding calculator', 'interest on interest calculator'],
    metaTitle: 'Compound Interest Calculator - Calculate CI Online Free',
    metaDescription: 'Free compound interest calculator with year-by-year breakdown. Supports monthly, quarterly & yearly compounding. Compare CI vs SI — no signup required.',
    faqs: [
      { question: 'What is compound interest?', answer: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest (calculated only on the principal), compound interest makes your money grow faster because you earn "interest on interest". This is often called the power of compounding.' },
      { question: 'What is the compound interest formula?', answer: 'The compound interest formula is A = P × (1 + r/n)^(n×t), where A is the final amount, P is the principal, r is the annual interest rate (as a decimal), n is the number of times interest is compounded per year, and t is the time in years. The compound interest earned is CI = A - P.' },
      { question: 'What compounding frequencies are supported?', answer: 'This calculator supports four compounding frequencies: Monthly (12 times/year), Quarterly (4 times/year), Half-Yearly (2 times/year), and Yearly (1 time/year). Monthly compounding gives you the highest returns, while yearly compounding gives the lowest — for the same rate and time period.' },
      { question: 'How does compound interest differ from simple interest?', answer: 'Simple interest is calculated only on the original principal: SI = P × r × t. Compound interest is calculated on principal plus accumulated interest. Over time, compound interest grows exponentially while simple interest grows linearly. Our calculator shows both side-by-side so you can compare.' },
      { question: 'Is this compound interest calculator accurate?', answer: 'Yes, this calculator uses the standard mathematical compound interest formula and provides accurate results. It runs entirely in your browser using JavaScript — no rounding shortcuts or approximations. The year-by-year breakdown lets you verify each step of the calculation.' },
      { question: 'Can I use this for FD/RD/PPF calculations?', answer: 'Yes! Fixed Deposits typically use quarterly compounding, PPF uses yearly compounding, and some savings accounts use monthly or daily compounding. Simply select the appropriate compounding frequency, enter your deposit amount and interest rate, and the calculator will show your maturity value.' },
    ],
    howToSteps: [
      'Enter your principal (initial investment) amount using the slider or type it directly.',
      'Set the annual interest rate (e.g., 7% for FD, 7.1% for PPF).',
      'Choose the time period in years.',
      'Select the compounding frequency — monthly, quarterly, half-yearly, or yearly.',
      'View your total maturity amount, interest earned, and CI vs SI comparison instantly.',
      'Click "Show Year-by-Year Breakdown" to see how your investment grows each year.',
    ],
    relatedToolSlugs: ['emi-calculator', 'sip-calculator', 'percentage-calculator', 'gst-calculator', 'discount-calculator'],
    icon: 'TrendingUp',
    estimatedTime: 'Instant',
  },
  {
    slug: 'fd-rd-calculator',
    name: 'FD & RD Calculator',
    shortDescription: 'Calculate Fixed Deposit & Recurring Deposit maturity amount with year-by-year breakdown.',
    longDescription: `<p>The <strong>FD calculator</strong> and RD Calculator by ToolsArena is a free, no-signup tool to calculate the maturity value of your Fixed Deposit and Recurring Deposit investments. Whether comparing bank FD rates or planning a monthly RD savings goal, get instant, accurate results.</p>
<h2>Key Features</h2>
<ul>
<li><strong>FD & RD Modes</strong>: Switch between Fixed Deposit and Recurring Deposit modes with a single click.</li>
<li><strong>Compounding Frequency</strong>: Choose monthly, quarterly, half-yearly, or yearly — most Indian banks use quarterly compounding.</li>
<li><strong>Year-by-Year Breakdown</strong>: See exactly how your deposit grows each year with a detailed table.</li>
<li><strong>Visual Breakdown</strong>: Proportional bar chart showing deposit amount vs interest earned.</li>
<li><strong>Comparison Table</strong>: Instantly compare maturity values across different tenures or monthly amounts.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Ideal for bank customers comparing FD rates, salaried individuals planning RD savings, and anyone who wants to understand how their deposits compound over time.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no data is sent to any server, no signup needed.</p>`,
    category: 'calculators',
    targetKeyword: 'FD calculator',
    secondaryKeywords: ['RD calculator', 'fixed deposit calculator', 'recurring deposit calculator', 'FD maturity calculator', 'RD maturity calculator', 'FD interest calculator', 'bank FD calculator India', 'RD calculator with monthly deposit', 'fixed deposit return calculator', 'FD RD comparison calculator'],
    metaTitle: 'FD & RD Calculator - Fixed & Recurring Deposit Online',
    metaDescription: 'Free FD & RD calculator with year-by-year breakdown. Calculate fixed deposit & recurring deposit maturity and interest earned. No signup needed.',
    faqs: [
      { question: 'What is a Fixed Deposit (FD)?', answer: 'A Fixed Deposit is a financial instrument where you deposit a lump sum amount with a bank for a fixed period at a predetermined interest rate. The interest is compounded (usually quarterly in India) and paid at maturity along with the principal. FDs are considered one of the safest investment options.' },
      { question: 'What is a Recurring Deposit (RD)?', answer: 'A Recurring Deposit is a savings scheme where you deposit a fixed amount every month for a set tenure. Interest is compounded (usually quarterly) and the total maturity amount includes all your monthly deposits plus the accumulated interest. RDs are ideal for building savings discipline.' },
      { question: 'How is FD interest calculated?', answer: 'FD interest is calculated using the compound interest formula: A = P x (1 + r/n)^(n*t), where P is the principal, r is the annual rate, n is the compounding frequency per year, and t is the tenure in years. Most banks in India compound FD interest quarterly (n=4).' },
      { question: 'What compounding frequency do banks use?', answer: 'Most Indian banks use quarterly compounding (4 times per year) for both FD and RD. Some banks may use monthly compounding for specific products. This calculator lets you choose between monthly, quarterly, half-yearly, and yearly compounding to match your bank\'s method.' },
      { question: 'Is TDS applicable on FD/RD interest?', answer: 'Yes, Tax Deducted at Source (TDS) is applicable on FD/RD interest if it exceeds Rs 40,000 per year (Rs 50,000 for senior citizens). Banks deduct 10% TDS if PAN is provided, or 20% without PAN. You can submit Form 15G/15H to avoid TDS if your total income is below the taxable limit.' },
      { question: 'Which gives better returns — FD or RD?', answer: 'For the same interest rate and tenure, an FD typically earns more total interest than an RD because the entire principal earns interest from day one. In an RD, deposits are staggered monthly, so earlier deposits earn more interest than later ones. However, RDs are better for those who want to save a fixed amount monthly.' },
    ],
    howToSteps: [
      'Select the mode — Fixed Deposit (FD) or Recurring Deposit (RD).',
      'For FD: enter deposit amount, interest rate, and tenure. For RD: enter monthly deposit, rate, and tenure.',
      'Choose compounding frequency (quarterly is standard for most banks).',
      'View maturity value, interest earned, and effective return percentage instantly.',
      'Check the comparison table to see returns at different tenures or monthly amounts.',
      'Click "Show Year-by-Year Breakdown" to see detailed growth each year.',
    ],
    relatedToolSlugs: ['compound-interest-calculator', 'emi-calculator', 'sip-calculator', 'gst-calculator', 'percentage-calculator'],
    icon: 'Landmark',
    estimatedTime: 'Instant',
  },

  // ─── CAREER TOOLS ───────────────────────────────────────────────────────
  {
    slug: 'resume-builder',
    name: 'Resume Builder',
    shortDescription: 'Build a professional resume in minutes. Choose from templates, add sections, and download as PDF — free.',
    longDescription: `<p>The <strong>free resume builder</strong> by ToolsArena helps you create a professional, ATS-friendly resume in minutes. Whether you're a fresh graduate, experienced professional, or career changer, this tool gives you everything you need to build a standout resume and download it as a polished PDF — no signup required.</p>
<h2>Key Features</h2>
<ul>
<li><strong>3 Professional Templates</strong>: Modern (with accent sidebar), Classic (traditional ATS-optimized), and Minimal (clean and elegant).</li>
<li><strong>8 Accent Colors</strong>: Personalize your resume with your preferred brand color.</li>
<li><strong>Multiple Sections</strong>: Personal Info, Summary, Work Experience (with bullet points), Education, Skills, Projects, Certifications, and Languages.</li>
<li><strong>Live Preview</strong>: See your resume update in real-time as you type.</li>
<li><strong>Auto-Save</strong>: Your data is saved to browser localStorage so you can return and continue anytime.</li>
<li><strong>ATS-Compatible PDF</strong>: Clean formatting that passes Applicant Tracking Systems used by top recruiters.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Ideal for freshers, students, experienced professionals, and career changers. Perfect for job applications, campus placements, internships, and freelance proposals.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your personal details and career history never leave your device. No account needed, no watermarks, unlimited downloads.</p>`,
    category: 'utility-tools',
    targetKeyword: 'free resume builder',
    secondaryKeywords: ['resume builder online free', 'resume maker', 'CV builder free', 'resume generator', 'ATS resume builder', 'professional resume maker', 'resume builder no signup', 'free resume download PDF', 'online CV maker', 'resume builder for freshers', 'resume builder India', 'job resume creator'],
    metaTitle: 'Free Resume Builder - Create Professional Resume & Download PDF',
    metaDescription: 'Build a professional ATS-friendly resume in minutes. 3 templates, live preview, auto-save, PDF download. No signup, no watermark — 100% free online.',
    faqs: [
      { question: 'Is this resume builder really free?', answer: 'Yes, 100% free with no hidden costs, no watermarks, and no download limits. You can create unlimited resumes, switch between templates, and download as many PDFs as you want. No signup or credit card required.' },
      { question: 'Is my resume data safe and private?', answer: 'Absolutely. Everything runs entirely in your browser using JavaScript. Your personal information, work history, and resume data never leave your device — nothing is sent to any server. Your data is auto-saved locally in your browser for convenience, and you can clear it anytime with the Reset button.' },
      { question: 'Are the resumes ATS-friendly?', answer: 'Yes. The generated PDF uses standard fonts (Helvetica), clean formatting, and proper text hierarchy — making it easily parseable by Applicant Tracking Systems (ATS) used by companies like Google, Amazon, Microsoft, TCS, Infosys, and more. Avoid using images or graphics in your resume content for best ATS compatibility.' },
      { question: 'What sections can I add to my resume?', answer: 'You can add: Personal Information (name, email, phone, location, LinkedIn, website), Professional Summary, Work Experience (with multiple bullet points per job), Education (with GPA), Skills (grouped by category), Projects (with tech stack and links), Certifications, and Languages. You can toggle any section on or off.' },
      { question: 'Can I save my resume and edit it later?', answer: 'Yes! Your resume data is automatically saved to your browser\'s local storage every time you make a change. When you return to the tool, all your data will be restored. Note: clearing your browser data will remove the saved resume.' },
      { question: 'What templates are available?', answer: 'Three professional templates are available: Modern (clean design with accent color bar — great for tech and creative roles), Classic (traditional format optimized for ATS — ideal for corporate applications), and Minimal (simple and elegant — perfect for academic and research positions). You can also choose from 8 accent colors.' },
      { question: 'Can freshers use this resume builder?', answer: 'Absolutely! This resume builder is perfect for freshers and students. You can highlight your education, projects, skills, certifications, and internships. Toggle off the Work Experience section if you don\'t have professional experience yet, and focus on Projects and Skills instead.' },
      { question: 'How do I download my resume as PDF?', answer: 'Simply click the "Download PDF" button at the top of the page. Your resume will be generated as a clean, professional PDF file and downloaded to your device instantly. The file will be named with your full name (e.g., John_Doe_Resume.pdf).' },
    ],
    howToSteps: [
      'Choose a template (Modern, Classic, or Minimal) and pick your accent color.',
      'Fill in your personal details — name, email, phone, location, LinkedIn, and a professional summary.',
      'Add your work experience with company name, job title, dates, and bullet points for achievements.',
      'Add your education details including institution, degree, field of study, and GPA.',
      'Add skills grouped by category (e.g., Programming Languages, Frameworks, Tools).',
      'Optionally add Projects, Certifications, and Languages sections.',
      'Review the live preview on the right to see your resume in real-time.',
      'Click "Download PDF" to save your professional resume.',
    ],
    relatedToolSlugs: ['invoice-generator', 'word-counter', 'text-to-slug', 'csv-to-pdf', 'pdf-merge'],
    icon: 'FileUser',
    isPopular: true,
    estimatedTime: '5-10 minutes',
  },
  {
    slug: 'scientific-calculator',
    name: 'Scientific Calculator',
    shortDescription: 'Free online scientific calculator with trigonometry, logarithms, powers, factorial, and more.',
    longDescription: `<p>The <strong>scientific calculator online</strong> by ToolsArena is a free, full-featured calculator for students, engineers, and scientists. It looks and works just like a real physical scientific calculator — right in your browser, no download needed.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Scientific Functions</strong>: sin, cos, tan, asin, acos, atan, log, ln, square root, cube root, powers, factorial, absolute value, and modulo.</li>
<li><strong>DEG/RAD Mode</strong>: Toggle between degree and radian mode for angle calculations.</li>
<li><strong>Keyboard Input</strong>: Type calculations directly using your keyboard for faster use.</li>
<li><strong>Calculation History</strong>: Scrollable history of your last 20 calculations — click any result to reload it.</li>
<li><strong>Constants</strong>: Built-in π (pi) and e (Euler's number), with proper operator precedence and nested parentheses support.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Students doing homework or exam prep, engineers and scientists for calculations, and anyone needing advanced math beyond basic arithmetic. Works on desktop, tablet, and mobile.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no server-side processing, no signup required, works offline.</p>`,
    category: 'calculators',
    targetKeyword: 'scientific calculator online',
    secondaryKeywords: ['scientific calculator', 'online calculator', 'free scientific calculator', 'scientific calculator with steps', 'trigonometry calculator', 'logarithm calculator online', 'sin cos tan calculator', 'advanced calculator online', 'math calculator free', 'calculator with history', 'scientific calculator for students', 'engineering calculator online'],
    metaTitle: 'Scientific Calculator Online - Free Advanced Math Calculator',
    metaDescription: 'Free online scientific calculator with sin, cos, tan, log, ln, powers, roots, factorial, DEG/RAD mode, and calculation history. No signup — works on any device.',
    faqs: [
      { question: 'What functions does this scientific calculator support?', answer: 'This calculator supports: basic arithmetic (+, -, ×, ÷, %), trigonometric functions (sin, cos, tan, asin, acos, atan), logarithms (log base 10, natural log ln), powers (x², xʸ, 10ˣ), roots (√), factorial (x!), absolute value (|x|), reciprocal (1/x), and constants (π, e). It also supports nested parentheses and proper operator precedence.' },
      { question: 'How do I switch between degrees and radians?', answer: 'Click the DEG/RAD button in the top-left of the calculator to toggle between degree mode and radian mode. In DEG mode, sin(90) = 1. In RAD mode, sin(π/2) = 1. The current mode is shown in the display area.' },
      { question: 'Can I use my keyboard to type calculations?', answer: 'Yes! You can type numbers (0-9), operators (+, -, *, /), parentheses, decimal point, and press Enter to calculate or Escape to clear. The calculator captures keyboard input automatically when focused on the page.' },
      { question: 'Does the calculator save my calculation history?', answer: 'Yes, the calculator keeps your last 20 calculations in a scrollable history. Click "History" in the display area to view past calculations. Click any previous result to load it back into the calculator. History is kept for the current session.' },
      { question: 'Is this calculator accurate for exams and homework?', answer: 'Yes, this calculator uses JavaScript\'s built-in Math library which provides IEEE 754 double-precision floating-point accuracy — the same precision used by most desktop scientific calculators. Results are displayed with up to 12 significant digits.' },
      { question: 'Does it support order of operations (BODMAS/PEMDAS)?', answer: 'Yes, the calculator follows standard mathematical order of operations: Parentheses first, then Exponents/Powers, then Multiplication/Division (left to right), then Addition/Subtraction (left to right). This ensures correct results for complex expressions.' },
      { question: 'Can I calculate factorials?', answer: 'Yes, press the x! button to enter the factorial function. For example, fact(5) = 120, fact(10) = 3628800. The calculator supports factorials up to 170! (beyond that, the result is Infinity due to floating-point limits).' },
      { question: 'Does it work on mobile phones?', answer: 'Yes, the calculator is fully responsive. On mobile devices, the buttons are sized for easy touch input, and the display adapts to smaller screens. It works on all modern browsers including Chrome, Safari, Firefox, and Edge.' },
    ],
    howToSteps: [
      'Open the Scientific Calculator — it\'s ready to use immediately.',
      'Type numbers using the on-screen buttons or your keyboard.',
      'Use function buttons (sin, cos, log, √, etc.) for scientific calculations.',
      'Toggle DEG/RAD mode for trigonometric calculations.',
      'Press = or Enter to calculate the result.',
      'View calculation history by clicking "History" in the display.',
      'Press AC or Escape to clear and start a new calculation.',
    ],
    relatedToolSlugs: ['percentage-calculator', 'compound-interest-calculator', 'emi-calculator', 'unit-converter', 'number-to-words'],
    icon: 'Calculator',
    isPopular: true,
    estimatedTime: 'Instant',
  },

  // ─── NEW BATCH: HIGH-DEMAND CLIENT-SIDE TOOLS ──────────────────────────────
  {
    slug: 'image-background-remover',
    name: 'Image Background Remover',
    shortDescription: 'Remove image backgrounds instantly using AI — 100% free, no signup, works right in your browser.',
    longDescription: `<p>Need to <strong>remove background from image</strong> without paying for Canva Pro or Adobe? Our free AI Background Remover does it right inside your browser — no signup, no upload to any server, no watermarks. Your images stay on your device, always.</p>
<h2>Key Features</h2>
<ul>
<li><strong>AI-Powered Removal</strong>: Uses U2-Net AI model (runs locally in your browser via WebAssembly) to identify and remove backgrounds automatically.</li>
<li><strong>Transparent PNG Output</strong>: Download a clean, transparent PNG ready for use anywhere.</li>
<li><strong>No Watermarks</strong>: Use it unlimited times, completely free, with no branding on results.</li>
<li><strong>Works On Any Subject</strong>: People, products, pets, logos — the AI handles a wide range of subjects.</li>
<li><strong>Cached After First Use</strong>: The AI model downloads once (~40MB) and is cached for fast future use.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Students, small business owners, freelancers, and content creators who need professional-looking images without professional-level budgets. Ideal for product photos, profile pictures, social media posts, and presentations.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your images never leave your device, no server uploads, no data stored.</p>`,
    category: 'image-tools',
    targetKeyword: 'remove background from image',
    secondaryKeywords: ['background remover', 'remove bg', 'transparent background maker', 'image background eraser', 'free background remover online', 'remove image background online', 'bg remover free', 'remove bg from photo', 'transparent background generator', 'background eraser online free', 'remove white background', 'product photo background remover', 'background remover online free', 'remove background from photo free', 'AI background remover'],
    metaTitle: 'Remove Background from Image - Free AI Background Remover Online',
    metaDescription: 'Remove image backgrounds instantly using AI — 100% free, no signup, no watermark, unlimited use. Photos never leave your device. Works in your browser.',
    faqs: [
      { question: 'How does the background removal work?', answer: 'The tool uses an AI model (U2-Net) that runs entirely in your browser using WebAssembly technology. It analyzes your image, identifies the main subject, and removes everything else. No server processing — it all happens on your device.' },
      { question: 'Is my image uploaded to any server?', answer: 'No, never. This is one of the few background removers that is truly private. The AI runs locally in your browser — your images never leave your device. We don\'t see, store, or process your photos on any server.' },
      { question: 'Why does it take longer the first time?', answer: 'The first time you use the tool, your browser downloads the AI model (~40MB). Think of it like installing a small app. After that first download, the model is cached in your browser, so every future use loads much faster (typically 10-30 seconds per image).' },
      { question: 'What image formats and sizes are supported?', answer: 'You can upload JPEG, PNG, and WebP images up to 10MB. The result is always a PNG file with a transparent background. For best results, use clear, well-lit photos where the subject stands out from the background.' },
      { question: 'How good is the quality compared to paid tools?', answer: 'For most photos — especially product images, portraits, and objects with clear edges — the results are excellent. Complex edges like wispy hair or transparent objects can be challenging for any AI tool. If you need pixel-perfect results for professional print work, a manual editing tool like Photoshop may be better. But for web, social media, and everyday use? This tool absolutely holds its own.' },
      { question: 'Can I use this for my business or e-commerce store?', answer: 'Yes! Many small business owners use this tool for product photography. Upload your product photo, remove the background, and you get a clean transparent PNG perfect for Amazon, Shopify, Etsy, or any online marketplace. No watermarks, no usage limits.' },
      { question: 'Does it work on mobile phones?', answer: 'Yes, it works on modern smartphones with a decent browser. However, the AI processing is more demanding on phone hardware — it may be slower on older or budget devices. For the best experience, use a laptop or desktop computer.' },
      { question: 'Is there a limit on how many images I can process?', answer: 'No limits at all. Since everything runs in your browser, there are no server costs on our end — which means no reason to restrict you. Use it as many times as you want, forever free.' },
    ],
    howToSteps: [
      'Drag and drop your image onto the upload area, or click to browse your files (JPEG, PNG, or WebP up to 10MB).',
      'Wait for the AI to process — first use takes a bit longer as the model downloads. A progress bar shows you exactly where it is.',
      'Preview the original and the background-removed result side by side.',
      'Click "Download PNG" to save your transparent image.',
      'Click "New Image" to process another photo. No limits!',
    ],
    relatedToolSlugs: ['photo-effects-editor', 'image-flip-rotate', 'image-compressor', 'image-resizer', 'png-to-jpg'],
    icon: 'Eraser',
    isPopular: true,
    estimatedTime: '10-30 seconds',
  },
  {
    slug: 'svg-to-png',
    name: 'SVG to PNG Converter',
    shortDescription: 'Convert SVG files to high-quality PNG images with custom scale and background.',
    longDescription: `<p>Convert your SVG files to PNG images instantly with our free <strong>SVG to PNG converter</strong>. Choose custom scale factors (1x to 4x) for crisp, high-resolution output perfect for retina displays — no upload required.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Custom Scale</strong>: Output at 1x, 2x, 3x, or 4x scale for standard or high-DPI displays.</li>
<li><strong>Transparent Background</strong>: Enable transparent background or set a custom background color.</li>
<li><strong>Paste SVG Code</strong>: Upload an .svg file or paste SVG markup directly into the text area.</li>
<li><strong>Pixel-Perfect Output</strong>: A 100x100 SVG at 2x produces a crisp 200x200 PNG with no quality loss.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Designers and developers who need rasterized versions of vector graphics for social media, presentations, email templates, or platforms that don't support SVG format.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser using the Canvas API — your files are never uploaded to any server.</p>`,
    category: 'converters',
    targetKeyword: 'svg to png converter',
    secondaryKeywords: ['convert svg to png', 'svg to png online', 'svg converter', 'vector to png', 'svg to image', 'svg to raster'],
    metaTitle: 'SVG to PNG Converter - Convert Vector to PNG Online',
    metaDescription: 'Convert SVG files to high-quality PNG images online for free. Custom scale (1x-4x), transparent backgrounds supported. No upload — runs in your browser.',
    faqs: [
      { question: 'What scale should I use?', answer: '1x gives you the original SVG dimensions. 2x is recommended for retina/HiDPI displays. 3x-4x are for very high resolution needs like print.' },
      { question: 'Can I paste SVG code instead of uploading a file?', answer: 'Yes! You can either upload an .svg file or paste the SVG markup directly into the text area.' },
      { question: 'Does it support transparent backgrounds?', answer: 'Yes. Transparent background is enabled by default. You can also choose a custom background color if needed.' },
      { question: 'Is the output quality good?', answer: 'The PNG output is pixel-perfect at the chosen scale. A 100x100 SVG at 2x scale produces a crisp 200x200 PNG.' },
    ],
    howToSteps: [
      'Upload an SVG file or paste SVG code into the text area.',
      'Choose the output scale (1x, 2x, 3x, or 4x).',
      'Toggle transparent background on/off and set a background color if needed.',
      'Click "Convert to PNG" to generate the image.',
      'Download the PNG file.',
    ],
    relatedToolSlugs: ['png-to-jpg', 'jpg-to-png', 'image-resizer', 'image-compressor', 'webp-to-png'],
    icon: 'FileImage',
    estimatedTime: '1-2 seconds',
  },
  {
    slug: 'hex-rgb-converter',
    name: 'HEX to RGB Converter',
    shortDescription: 'Convert colors between HEX, RGB, and HSL formats instantly.',
    longDescription: `<p>Convert colors between HEX, RGB, and HSL formats instantly with our free <strong>hex to RGB converter</strong>. Type a HEX code like #3b82f6, adjust RGB sliders, or use the native color picker — all formats update in real-time.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Real-Time Conversion</strong>: All formats (HEX, RGB, HSL, CSS) update simultaneously as you type or adjust sliders.</li>
<li><strong>Color Preview Swatch</strong>: Large visual preview of your selected color.</li>
<li><strong>One-Click Copy</strong>: Copy any format to clipboard instantly.</li>
<li><strong>Shorthand Support</strong>: Shorthand codes like #f00 are automatically expanded to #ff0000.</li>
<li><strong>Native Color Picker</strong>: Click the swatch to open your browser's built-in color picker.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Web developers matching brand colors, UI designers working across tools like Figma and CSS, and anyone who needs to quickly convert between color code formats.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% client-side — zero latency, no server calls, completely private.</p>`,
    category: 'developer-tools',
    targetKeyword: 'hex to rgb converter',
    secondaryKeywords: ['rgb to hex', 'hex to rgb', 'color converter', 'hex color code', 'rgb to hex converter', 'hsl converter', 'css color converter'],
    metaTitle: 'HEX to RGB Converter - Color Code Converter Online',
    metaDescription: 'Convert colors between HEX, RGB & HSL instantly. Visual color picker, RGB sliders, one-click copy. Free online color converter for developers & designers.',
    faqs: [
      { question: 'What is HEX color format?', answer: 'HEX is a 6-character code (e.g., #3b82f6) representing Red, Green, and Blue channels in hexadecimal (00-FF). It\'s the most common format in CSS and web design.' },
      { question: 'What is the difference between RGB and HSL?', answer: 'RGB defines colors by Red, Green, Blue intensity (0-255). HSL defines colors by Hue (0-360°), Saturation (0-100%), and Lightness (0-100%) — HSL is more intuitive for humans.' },
      { question: 'Can I input a 3-character HEX code?', answer: 'Yes. Shorthand codes like #f00 are automatically expanded to #ff0000.' },
      { question: 'Can I use the native color picker?', answer: 'Yes! Click the color swatch next to the HEX input to open your browser\'s built-in color picker.' },
    ],
    howToSteps: [
      'Enter a HEX color code (e.g., #3b82f6) or use the color picker.',
      'Or adjust the R, G, B number inputs or sliders.',
      'See the color preview and all formats update in real time.',
      'Copy any format (HEX, RGB, HSL, CSS) with one click.',
    ],
    relatedToolSlugs: ['color-picker', 'css-gradient-generator', 'css-minifier', 'box-shadow-generator'],
    icon: 'Palette',
    estimatedTime: 'Instant',
  },
  {
    slug: 'css-minifier',
    name: 'CSS Minifier',
    shortDescription: 'Minify CSS code to reduce file size — remove comments, whitespace, and optimize.',
    longDescription: `<p>Minify your CSS code instantly with our free <strong>CSS minifier</strong>. Remove comments, collapse whitespace, strip unnecessary semicolons, and apply basic optimizations like converting 0px to 0 — all with one click.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Instant Minification</strong>: Paste your CSS and get optimized output immediately.</li>
<li><strong>Bytes Saved Display</strong>: Shows exact bytes saved and compression percentage.</li>
<li><strong>Safe Transformations</strong>: Removes formatting only — your CSS rules remain functionally identical.</li>
<li><strong>One-Click Copy</strong>: Copy the minified CSS to clipboard instantly.</li>
<li><strong>Typical Savings</strong>: Reduces file size by 20-60% depending on formatting style.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Front-end developers who need quick minification of stylesheets without configuring Webpack, Gulp, or other build tools. Great for one-off files, code challenges, and CMS themes.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your code is never sent to any server.</p>`,
    category: 'developer-tools',
    targetKeyword: 'css minifier',
    secondaryKeywords: ['minify css', 'css compressor', 'css optimizer', 'compress css online', 'css minify online', 'reduce css file size'],
    metaTitle: 'CSS Minifier - Minify & Compress CSS Online Free',
    metaDescription: 'Minify CSS code online for free. Removes comments, whitespace & optimizes syntax. See bytes saved instantly. No signup, privacy-first — code stays in your browser.',
    faqs: [
      { question: 'What does CSS minification do?', answer: 'It removes comments, extra whitespace, line breaks, and unnecessary characters from your CSS. This reduces file size by 20-60% typically, making your website load faster.' },
      { question: 'Will minification break my CSS?', answer: 'No. Minification only removes formatting — it does not change the meaning of your CSS rules. The output is functionally identical to the input.' },
      { question: 'How much file size can I save?', answer: 'Typically 20-60% depending on how your CSS is formatted. Well-commented CSS with lots of whitespace will see larger savings.' },
      { question: 'Is my code sent to a server?', answer: 'No. All processing happens in your browser. Your CSS code never leaves your device.' },
    ],
    howToSteps: [
      'Paste your CSS code in the input area on the left.',
      'Click "Minify CSS" to process.',
      'See the minified output on the right with file size stats.',
      'Copy the minified CSS with the copy button.',
      'Paste into your production CSS files.',
    ],
    relatedToolSlugs: ['json-formatter', 'html-to-markdown', 'css-gradient-generator', 'box-shadow-generator', 'hex-rgb-converter'],
    icon: 'Minimize2',
    estimatedTime: 'Instant',
  },
  {
    slug: 'online-notepad',
    name: 'Online Notepad',
    shortDescription: 'A simple, distraction-free online notepad with auto-save and word count.',
    longDescription: `<p>A clean, distraction-free <strong>online notepad</strong> that auto-saves your notes to your browser. Start typing and your text is automatically saved — come back anytime and pick up where you left off.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Auto-Save</strong>: Notes are saved to localStorage every half second — no manual saving needed.</li>
<li><strong>Word & Character Count</strong>: Real-time word, character, and line count as you type.</li>
<li><strong>Adjustable Font Size</strong>: Choose your preferred reading and writing size.</li>
<li><strong>Download as .txt</strong>: Save your notes as a plain text file to your computer anytime.</li>
<li><strong>Distraction-Free</strong>: Clean, minimal interface focused entirely on writing.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for quick notes during meetings, brainstorming sessions, drafting messages, jotting down ideas, or anytime you need a fast, no-fuss text editor.</p>
<h2>Privacy & Security</h2>
<p>No login, no account, no cloud sync — your notes are stored locally in your browser and never sent to any server.</p>`,
    category: 'utility-tools',
    targetKeyword: 'online notepad',
    secondaryKeywords: ['notepad online', 'online text editor', 'quick notepad', 'online notes', 'free notepad', 'web notepad', 'simple text editor'],
    metaTitle: 'Online Notepad - Free Text Editor with Auto-Save',
    metaDescription: 'Free online notepad with auto-save, word count & download. No signup — your notes stay private in your browser. Simple, fast, distraction-free writing.',
    faqs: [
      { question: 'Are my notes saved?', answer: 'Yes, automatically! Your text is saved to your browser\'s localStorage every time you pause typing. Come back to the same browser and your notes will be there.' },
      { question: 'Can I access my notes from another device?', answer: 'No. Notes are stored locally in your browser. There is no cloud sync or account system — this keeps your data completely private.' },
      { question: 'Is there a character limit?', answer: 'localStorage typically allows 5-10MB of data, which is roughly 5-10 million characters — more than enough for notes.' },
      { question: 'Can I download my notes?', answer: 'Yes! Click "Download .txt" to save your notes as a plain text file to your computer.' },
      { question: 'Will clearing my browser data delete my notes?', answer: 'Yes. If you clear your browser\'s localStorage or site data, your notes will be lost. Download important notes as .txt files to keep them safe.' },
    ],
    howToSteps: [
      'Start typing in the editor — your notes auto-save every half second.',
      'Adjust font size using the dropdown in the toolbar.',
      'See real-time word, character, and line counts below the editor.',
      'Click "Download .txt" to save your notes as a file.',
      'Click "Clear" to erase all notes and start fresh.',
    ],
    relatedToolSlugs: ['word-counter', 'character-counter', 'case-converter', 'text-to-slug', 'lorem-ipsum-generator'],
    icon: 'StickyNote',
    estimatedTime: 'Instant',
  },
  {
    slug: 'js-minifier',
    name: 'JavaScript Minifier',
    shortDescription: 'Minify JavaScript code to reduce file size — remove comments, whitespace, and optimize.',
    longDescription: `<p>Minify your JavaScript code instantly with our free <strong>JavaScript minifier</strong>. Strip out comments, collapse whitespace, remove unnecessary semicolons, and produce compact output ready for production — all in one click.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Instant Minification</strong>: Paste your JS and get a compact, production-ready output immediately.</li>
<li><strong>Bytes Saved Display</strong>: Shows exact bytes saved and the compression percentage.</li>
<li><strong>Safe Transformations</strong>: Removes whitespace and comments only — does not rename variables or break logic.</li>
<li><strong>One-Click Copy</strong>: Copy the minified code to clipboard in a single click.</li>
<li><strong>Typical Savings</strong>: Reduces file size by 20-50% for well-commented code.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers needing quick, one-off minification of scripts without setting up Webpack, Rollup, or Vite. Ideal for small projects, code snippets, and CMS-based sites.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your code never leaves your device.</p>`,
    category: 'developer-tools',
    targetKeyword: 'javascript minifier',
    secondaryKeywords: ['minify javascript', 'js compressor', 'js minifier online', 'compress javascript', 'minify js online free', 'javascript compressor online'],
    metaTitle: 'JavaScript Minifier - Minify JS Code Online Free',
    metaDescription: 'Minify JavaScript code online for free. Removes comments & whitespace, shows bytes saved. No signup, code stays in your browser. Instant JS compression.',
    faqs: [
      { question: 'What does JavaScript minification do?', answer: 'It removes comments, extra whitespace, and unnecessary characters from your JS code. This typically reduces file size by 20-50%, making your website load faster.' },
      { question: 'Will minification break my code?', answer: 'Our minifier performs safe transformations — removing whitespace and comments. It does not rename variables or perform advanced optimizations. For most code, the output is functionally identical.' },
      { question: 'Is my code sent to a server?', answer: 'No. All minification happens in your browser using JavaScript. Your code never leaves your device.' },
      { question: 'Should I use this for production?', answer: 'For quick, one-off minification of small scripts, absolutely. For production apps with many files, use a bundler like Webpack or Vite that can also do tree-shaking and code splitting.' },
    ],
    howToSteps: ['Paste your JavaScript code in the input area.', 'Click "Minify JavaScript" to process.', 'See the minified output with file size stats.', 'Copy the minified code with one click.'],
    relatedToolSlugs: ['css-minifier', 'json-formatter', 'html-beautifier', 'html-to-markdown', 'regex-tester'],
    icon: 'Minimize2',
    estimatedTime: 'Instant',
  },
  {
    slug: 'image-cropper',
    name: 'Image Cropper',
    shortDescription: 'Crop images online with preset aspect ratios — free, instant, no upload required.',
    longDescription: `<p>Crop your images to the perfect size with our free online tool to <strong>crop image online</strong>. Choose from preset aspect ratios (1:1 for Instagram, 16:9 for YouTube, 9:16 for Stories, 4:3, 3:2) or crop freely with custom dimensions.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Preset Aspect Ratios</strong>: 1:1 (Instagram), 16:9 (YouTube), 9:16 (Stories), 4:3, 3:2, and free crop.</li>
<li><strong>Rule-of-Thirds Grid</strong>: Overlay grid helps you compose the perfect crop.</li>
<li><strong>Live Pixel Dimensions</strong>: Shows exact output width and height as you adjust the crop area.</li>
<li><strong>High-Quality PNG Output</strong>: Downloads the cropped image at full original resolution — no quality loss.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Content creators, social media managers, and photographers who need precisely cropped images for Instagram posts, profile pictures, product photos, and thumbnails.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser using the Canvas API — your images are never uploaded to any server.</p>`,
    category: 'image-tools',
    targetKeyword: 'crop image online',
    secondaryKeywords: ['image cropper', 'crop photo online', 'free image cropper', 'online photo cropper', 'crop picture', 'resize and crop image', 'crop image for instagram'],
    metaTitle: 'Crop Image Online Free — Photo Cropper with Aspect Ratios',
    metaDescription: 'Crop images online for free with preset aspect ratios (1:1, 16:9, 9:16, 4:3). Rule-of-thirds grid, pixel-perfect output. No upload — images stay on your device.',
    faqs: [
      { question: 'What aspect ratios are available?', answer: 'Free crop (no constraint), 1:1 (square — perfect for Instagram), 16:9 (YouTube/desktop), 9:16 (Stories/Reels), 4:3 (photos), and 3:2 (prints).' },
      { question: 'What is the output format?', answer: 'Cropped images are saved as PNG files at the original resolution of the cropped area — no quality loss.' },
      { question: 'Can I see the exact dimensions?', answer: 'Yes! A pixel dimension indicator at the top of the crop area shows the exact width and height of your crop in the original image resolution.' },
      { question: 'Are my images uploaded?', answer: 'No. Everything runs locally in your browser using the Canvas API. Your images never leave your device.' },
    ],
    howToSteps: ['Upload an image by dragging or clicking the upload area.', 'Select an aspect ratio preset or use free crop.', 'Drag the crop area to position it. Resize using the corner handle.', 'Click "Crop" to generate the cropped image.', 'Download the cropped PNG or click "Crop Again" to adjust.'],
    relatedToolSlugs: ['image-flip-rotate', 'photo-effects-editor', 'image-compressor', 'image-resizer', 'image-background-remover'],
    icon: 'Crop',
    isPopular: true,
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'stopwatch',
    name: 'Online Stopwatch',
    shortDescription: 'Free online stopwatch with lap timer — accurate to centiseconds.',
    longDescription: `<p>A clean, accurate <strong>online stopwatch</strong> with lap timing functionality. Start, pause, and reset with one click. Record unlimited laps and see split times with best/worst lap highlighting.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Centisecond Accuracy</strong>: Displays hours, minutes, seconds, and centiseconds (1/100th of a second).</li>
<li><strong>Lap Timer</strong>: Record unlimited laps with split times shown in a scrollable list.</li>
<li><strong>Best/Worst Lap Highlighting</strong>: Fastest lap shown in green, slowest in red — just like a professional sports timer.</li>
<li><strong>Tab-Accurate</strong>: Uses absolute timestamps so the timer stays accurate even if you switch browser tabs.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Ideal for athletes timing workouts, students timing study sessions, cooks timing recipes, and anyone who needs precise elapsed time measurement.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no installation needed, no data collected.</p>`,
    category: 'utility-tools',
    targetKeyword: 'online stopwatch',
    secondaryKeywords: ['stopwatch', 'stopwatch online', 'free stopwatch', 'lap timer online', 'timer stopwatch', 'digital stopwatch', 'sports timer'],
    metaTitle: 'Online Stopwatch — Free Lap Timer with Centiseconds',
    metaDescription: 'Free online stopwatch with lap timer, centisecond accuracy, and best/worst lap highlighting. Clean design, works instantly. No download or signup needed.',
    faqs: [
      { question: 'How accurate is the stopwatch?', answer: 'The stopwatch uses Date.now() which provides millisecond-level accuracy. The display shows centiseconds (1/100th of a second) for practical precision.' },
      { question: 'How do I record laps?', answer: 'Click the blue flag button while the stopwatch is running. Each lap records the split time (time since last lap) and total elapsed time.' },
      { question: 'What do the green and red highlights mean?', answer: 'When you have 2+ laps, the fastest lap is highlighted in green and the slowest in red — helping you identify your best and worst splits.' },
      { question: 'Does it keep running if I switch tabs?', answer: 'Yes! The timer uses absolute timestamps, so it stays accurate even if you switch browser tabs or minimize the window.' },
    ],
    howToSteps: ['Click the green play button to start the stopwatch.', 'Click the blue flag button to record a lap while running.', 'Click the yellow pause button to pause the timer.', 'Click the reset button to clear the timer and all laps.'],
    relatedToolSlugs: ['countdown-timer', 'pomodoro-timer', 'timezone-checker', 'age-calculator'],
    icon: 'Timer',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    shortDescription: 'Stay focused with the Pomodoro Technique — customizable work/break intervals with audio alerts.',
    longDescription: `<p>Boost your productivity with our free <strong>Pomodoro Timer</strong>. Work in focused 25-minute sessions with 5-minute breaks — the Pomodoro Technique trusted by millions of students, developers, and professionals worldwide.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Circular Progress</strong>: Beautiful visual timer shows how much of the session remains.</li>
<li><strong>Audio Alerts</strong>: Gentle notification when each interval completes.</li>
<li><strong>Auto-Switch</strong>: Automatically moves from work → short break → work → long break after 4 sessions.</li>
<li><strong>Customizable</strong>: Set focus time (1–120 min), short break (1–30 min), long break (1–60 min).</li>
<li><strong>Session Tracker</strong>: Count completed sessions to measure your daily productivity.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Students studying for exams, developers working on deep focus tasks, writers battling distraction, and anyone who wants to work more effectively using time-boxing.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no account, no data collection.</p>`,
    category: 'utility-tools',
    targetKeyword: 'pomodoro timer',
    secondaryKeywords: ['pomodoro timer online', 'pomodoro technique', 'focus timer', 'study timer', 'productivity timer', 'work timer', '25 minute timer'],
    metaTitle: 'Pomodoro Timer — Free Focus Timer for Productivity',
    metaDescription: 'Free Pomodoro timer with customizable work/break intervals, audio alerts & session tracking. Boost focus and productivity. No signup, works in your browser.',
    faqs: [
      { question: 'What is the Pomodoro Technique?', answer: 'It is a time management method: work for 25 minutes (one "pomodoro"), take a 5-minute break, repeat. After 4 pomodoros, take a longer 15-minute break. It helps maintain focus and prevent burnout.' },
      { question: 'Can I customize the timer durations?', answer: 'Yes! Click the gear icon to set custom durations for focus time (1-120 min), short break (1-30 min), and long break (1-60 min).' },
      { question: 'Does it play a sound when the timer ends?', answer: 'Yes, a gentle beep plays when each interval completes. Your browser may ask for audio permission on first use.' },
      { question: 'Does it auto-switch between work and break?', answer: 'Yes! When a focus session ends, it automatically switches to a break. After the break, it switches back to focus. After every 4 focus sessions, you get a long break.' },
    ],
    howToSteps: ['Click the play button to start your focus session (default: 25 min).', 'Work until the timer completes — an audio alert will notify you.', 'Take a short break (5 min) when prompted.', 'After 4 focus sessions, enjoy a long break (15 min).', 'Click the gear icon to customize durations.'],
    relatedToolSlugs: ['stopwatch', 'countdown-timer', 'online-notepad', 'word-counter'],
    icon: 'Brain',
    estimatedTime: 'Instant',
  },
  {
    slug: 'text-to-speech',
    name: 'Text to Speech',
    shortDescription: 'Convert text to speech online — listen to any text read aloud in 50+ voices and languages.',
    longDescription: `<p>Convert any text to natural-sounding speech right in your browser with our free <strong>text to speech</strong> tool. Listen to any text read aloud in 50+ voices and languages — no downloads, no signup.</p>
<h2>Key Features</h2>
<ul>
<li><strong>50+ Voices</strong>: Multiple voices per language — choose the one that sounds best to you.</li>
<li><strong>12+ Languages</strong>: English, Hindi, Spanish, French, German, Japanese, Chinese, Arabic, and more.</li>
<li><strong>Speed & Pitch Control</strong>: Adjust from 0.25x to 2x speed and customize pitch.</li>
<li><strong>Pause/Resume</strong>: Full playback controls for listening at your own pace.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Writers proofreading by ear, language learners hearing native pronunciation, accessibility users, and anyone who wants articles or documents read aloud while multitasking.</p>
<h2>Privacy & Security</h2>
<p>Uses the Web Speech API built into your browser — your text is never sent to ToolsArena servers.</p>`,
    category: 'text-tools',
    targetKeyword: 'text to speech online',
    secondaryKeywords: ['text to speech', 'tts online', 'read text aloud', 'text reader online', 'text to voice', 'free text to speech', 'convert text to audio'],
    metaTitle: 'Text to Speech Online Free — Read Text Aloud in 50+ Voices',
    metaDescription: 'Convert text to speech online for free. 50+ voices, multiple languages, adjustable speed & pitch. No signup, runs in your browser. Listen to any text instantly.',
    faqs: [
      { question: 'What voices are available?', answer: 'The available voices depend on your browser and operating system. Chrome typically offers 20+ voices, while Edge offers 100+ premium voices. The tool automatically lists all voices available on your device.' },
      { question: 'Which languages are supported?', answer: 'Most modern browsers support English, Hindi, Spanish, French, German, Japanese, Chinese, Korean, Arabic, Portuguese, and many more. The exact list depends on your browser.' },
      { question: 'Can I download the audio?', answer: 'The Web Speech API does not support audio file export. For downloadable audio files, you would need a server-side TTS service. This tool is designed for instant playback.' },
      { question: 'Is my text sent to a server?', answer: 'No. The Web Speech API processes text locally on your device using your browser\'s built-in speech engine. Your text never leaves your browser.' },
    ],
    howToSteps: ['Type or paste your text in the text area.', 'Select a voice from the dropdown (grouped by language).', 'Adjust speed and pitch using the sliders.', 'Click the play button to hear your text spoken aloud.', 'Use pause/stop buttons to control playback.'],
    relatedToolSlugs: ['speech-to-text', 'word-counter', 'character-counter', 'case-converter', 'online-notepad'],
    icon: 'Volume2',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'html-beautifier',
    name: 'HTML Beautifier',
    shortDescription: 'Format and beautify messy HTML code with proper indentation — free online tool.',
    longDescription: `<p>Clean up messy, minified, or poorly formatted HTML with our free <strong>HTML beautifier</strong>. Paste your code, choose indent size, and get perfectly readable HTML in one click.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Proper Indentation</strong>: Correctly indents nested elements with 2 or 4 spaces.</li>
<li><strong>Void Tag Handling</strong>: br, img, input, meta, and other void tags handled correctly.</li>
<li><strong>Comment Preservation</strong>: HTML comments are kept intact in the output.</li>
<li><strong>No Behavior Change</strong>: Only adds/removes whitespace — your HTML structure stays identical.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers debugging HTML, doing code reviews, learning HTML structure, or cleaning up auto-generated code from CMS platforms and WYSIWYG editors.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your code never leaves your device. No signup required.</p>`,
    category: 'developer-tools',
    targetKeyword: 'html beautifier',
    secondaryKeywords: ['html formatter', 'format html online', 'html prettifier', 'beautify html', 'html indenter', 'html code formatter', 'pretty print html'],
    metaTitle: 'HTML Beautifier — Format & Prettify HTML Online Free',
    metaDescription: 'Beautify and format messy HTML code online for free. Proper indentation, clean output. No signup, code stays in your browser. Instant HTML formatter.',
    faqs: [
      { question: 'Does it handle self-closing tags?', answer: 'Yes. Void elements like <br>, <img>, <input>, <meta>, etc. are handled correctly — they don\'t increase the indent level.' },
      { question: 'Will it change my HTML\'s behavior?', answer: 'No. The beautifier only adds/removes whitespace for formatting. The HTML structure and behavior remain identical.' },
      { question: 'Can I beautify HTML with inline CSS/JS?', answer: 'The tool formats the HTML structure. Inline CSS and JS within tags are preserved as-is. For CSS/JS formatting, use our dedicated CSS Minifier or JS Minifier tools.' },
    ],
    howToSteps: ['Paste your HTML code in the input area.', 'Choose your indent size (2 or 4 spaces).', 'Click "Beautify HTML" to format.', 'Copy the formatted output with one click.'],
    relatedToolSlugs: ['css-minifier', 'js-minifier', 'html-to-markdown', 'html-css-js-editor', 'json-formatter'],
    icon: 'FileCode2',
    estimatedTime: 'Instant',
  },
  {
    slug: 'image-watermark',
    name: 'Image Watermark',
    shortDescription: 'Add text watermarks to images — custom font, color, position, opacity, and tiling.',
    longDescription: `<p>Protect your images with custom text watermarks using our free <strong>image watermark</strong> tool. Full control over font, color, opacity, position, and rotation — live preview before you download.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Flexible Positioning</strong>: Center, bottom-right, bottom-left, or tiled across the entire image.</li>
<li><strong>Full Customization</strong>: Font size, color, opacity (5–100%), and rotation angle.</li>
<li><strong>Live Preview</strong>: Canvas updates instantly as you adjust settings.</li>
<li><strong>PNG Output</strong>: Download your watermarked image as a clean PNG file.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Photographers protecting their work, content creators branding their images, and businesses adding copyright notices to visual content before sharing online.</p>
<h2>Privacy & Security</h2>
<p>Uses the Canvas API in your browser — your images are never uploaded to any server. No signup required.</p>`,
    category: 'image-tools',
    targetKeyword: 'add watermark to image',
    secondaryKeywords: ['image watermark', 'watermark photo online', 'add watermark free', 'watermark tool', 'text watermark', 'photo watermark online', 'watermark image online free'],
    metaTitle: 'Add Watermark to Image Free — Text Watermark Tool Online',
    metaDescription: 'Add text watermarks to images for free. Custom font, color, opacity, tiling & position. No signup, images stay on your device. Protect your photos instantly.',
    faqs: [
      { question: 'Can I tile the watermark across the entire image?', answer: 'Yes! Select "Tile (Repeat)" from the position dropdown to cover the entire image with your watermark text — great for preventing unauthorized use.' },
      { question: 'What about image watermarks (logo overlay)?', answer: 'Currently the tool supports text watermarks only. For logo overlays, we recommend using our Image Cropper in combination with a design tool.' },
      { question: 'Can I adjust the transparency?', answer: 'Yes. The opacity slider lets you set the watermark transparency from 5% (barely visible) to 100% (fully opaque). 30% is a good default for most use cases.' },
    ],
    howToSteps: ['Upload your image by dropping or clicking.', 'Type your watermark text (e.g., your name or brand).', 'Choose position (center, corner, or tile), font size, opacity, color, and rotation.', 'Preview updates live on the canvas.', 'Click "Download" to save the watermarked image as PNG.'],
    relatedToolSlugs: ['image-cropper', 'image-compressor', 'image-resizer', 'image-background-remover', 'image-to-pdf'],
    icon: 'Droplets',
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'file-size-converter',
    name: 'File Size Converter',
    shortDescription: 'Convert between bytes, KB, MB, GB, TB — instant file size unit conversion.',
    longDescription: `<p>Convert file sizes between Bits, Bytes, KB, MB, GB, TB, and binary units (KiB, MiB, GiB) instantly with our free <strong>file size converter</strong>. Enter any value and see all conversions at once.</p>
<h2>Key Features</h2>
<ul>
<li><strong>All Storage Units</strong>: Bits, Bytes, KB, MB, GB, TB, and binary equivalents (KiB, MiB, GiB).</li>
<li><strong>Enter in Any Unit</strong>: Type a value in whichever unit you know — all others update instantly.</li>
<li><strong>One-Click Copy</strong>: Copy any converted value to clipboard.</li>
<li><strong>Quick Reference Table</strong>: Common conversions shown for fast lookup.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers checking API limits, sysadmins planning storage, students learning about data units, and anyone who needs to quickly convert between KB, MB, and GB.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — pure math, no server calls needed.</p>`,
    category: 'converters',
    targetKeyword: 'file size converter',
    secondaryKeywords: ['bytes to mb', 'kb to mb', 'mb to gb', 'file size calculator', 'bytes converter', 'data size converter', 'storage unit converter', 'gb to mb'],
    metaTitle: 'File Size Converter — Bytes to KB, MB, GB, TB Online',
    metaDescription: 'Convert file sizes between Bytes, KB, MB, GB & TB instantly. Quick reference table, one-click copy. Free online file size calculator.',
    faqs: [
      { question: 'Is 1 KB equal to 1000 or 1024 bytes?', answer: 'In computing, 1 KB = 1024 bytes (binary). In the SI system, 1 kB = 1000 bytes (decimal). This tool uses binary (1024-based) calculations, which is what your OS reports.' },
      { question: 'What is the difference between KB and KiB?', answer: 'KB (kilobyte) traditionally means 1024 bytes in computing. KiB (kibibyte) is the IEC standard term for exactly 1024 bytes. In this tool, both use 1024 bytes.' },
    ],
    howToSteps: ['Enter a numeric value in the input field.', 'Select the unit you are converting from.', 'See all conversions displayed instantly.', 'Click the copy button next to any result.'],
    relatedToolSlugs: ['unit-converter', 'number-to-words', 'percentage-calculator', 'temperature-converter'],
    icon: 'HardDrive',
    estimatedTime: 'Instant',
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    shortDescription: 'Format and beautify SQL queries with proper indentation and keyword highlighting.',
    longDescription: `<p>Format messy SQL queries into clean, readable code with our free <strong>SQL formatter</strong>. Auto-uppercase keywords, proper indentation, and well-structured output in one click.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Keyword Uppercasing</strong>: SELECT, FROM, WHERE, JOIN, etc. are automatically uppercased.</li>
<li><strong>Proper Indentation</strong>: Choose 2 or 4 space indentation for your preferred style.</li>
<li><strong>Full SQL Support</strong>: SELECT, INSERT, UPDATE, DELETE, CREATE, JOINs, and subqueries.</li>
<li><strong>Multi-Dialect</strong>: Works with MySQL, PostgreSQL, SQLite, SQL Server, and Oracle syntax.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers debugging complex queries, DBAs doing code reviews, data analysts cleaning up ad-hoc SQL, and students learning to write readable database queries.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your queries never leave your device. No signup required.</p>`,
    category: 'developer-tools',
    targetKeyword: 'sql formatter',
    secondaryKeywords: ['sql beautifier', 'format sql online', 'sql formatter online', 'sql pretty print', 'sql query formatter', 'beautify sql', 'sql indenter'],
    metaTitle: 'SQL Formatter — Format & Beautify SQL Queries Online Free',
    metaDescription: 'Format SQL queries online for free. Auto-uppercase keywords, proper indentation, clean output. No signup, queries stay in your browser. Instant SQL beautifier.',
    faqs: [
      { question: 'What SQL dialects are supported?', answer: 'The formatter supports standard SQL syntax including SELECT, JOIN, INSERT, UPDATE, DELETE, CREATE, and subqueries. It works with MySQL, PostgreSQL, SQLite, SQL Server, and Oracle syntax.' },
      { question: 'Does it modify my query logic?', answer: 'No. The formatter only changes whitespace and keyword casing — your query logic remains exactly the same.' },
      { question: 'Is my SQL query sent to a server?', answer: 'No. All formatting is done client-side in your browser. Your queries never leave your device.' },
    ],
    howToSteps: ['Paste your SQL query in the input area.', 'Choose your preferred indent size.', 'Click "Format SQL" to beautify.', 'Copy the formatted SQL with one click.'],
    relatedToolSlugs: ['json-formatter', 'html-beautifier', 'css-minifier', 'js-minifier', 'csv-to-json'],
    icon: 'Database',
    estimatedTime: 'Instant',
  },
  {
    slug: 'xml-to-json',
    name: 'XML to JSON Converter',
    shortDescription: 'Convert XML data to JSON format instantly — handles attributes, nested elements, and arrays.',
    longDescription: `<p>Convert XML to JSON instantly with our free online <strong>XML to JSON converter</strong>. Handles attributes, nested elements, repeated elements, and text content — producing clean, properly indented JSON output.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Attribute Handling</strong>: XML attributes converted to JSON keys with @ prefix (e.g., &lt;user id="1"&gt; → {"@id":"1"}).</li>
<li><strong>Array Detection</strong>: Repeated child elements with the same tag are automatically converted to arrays.</li>
<li><strong>CDATA Support</strong>: CDATA content is included as text content in the output.</li>
<li><strong>Error Reporting</strong>: Clear error messages help identify XML parsing issues.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers working with legacy XML APIs, data engineers migrating XML data to JSON, and anyone needing to quickly convert configuration files or API responses between formats.</p>
<h2>Privacy & Security</h2>
<p>Uses the DOMParser API in your browser — your data never leaves your device. No signup required.</p>`,
    category: 'developer-tools',
    targetKeyword: 'xml to json converter',
    secondaryKeywords: ['xml to json', 'convert xml to json', 'xml to json online', 'xml converter', 'xml to json tool', 'xml json converter free'],
    metaTitle: 'XML to JSON Converter — Convert XML to JSON Online Free',
    metaDescription: 'Convert XML to JSON online for free. Handles attributes, nested elements & arrays. No signup, data stays in your browser. Instant XML to JSON conversion.',
    faqs: [
      { question: 'How are XML attributes handled?', answer: 'Attributes are converted to JSON keys with an @ prefix. For example, <user id="1"> becomes {"@id": "1"}.' },
      { question: 'What about repeated elements?', answer: 'Repeated child elements with the same tag name are automatically converted to JSON arrays.' },
      { question: 'Does it handle CDATA sections?', answer: 'CDATA content is treated as text content and included in the JSON output.' },
    ],
    howToSteps: ['Paste your XML in the input area.', 'Choose your JSON indent size.', 'Click "Convert to JSON" to process.', 'Copy the JSON output with one click.'],
    relatedToolSlugs: ['json-formatter', 'csv-to-json', 'html-to-markdown', 'base64-encode-decode'],
    icon: 'FileJson',
    estimatedTime: 'Instant',
  },
  {
    slug: 'cron-generator',
    name: 'Cron Expression Generator',
    shortDescription: 'Build and decode cron expressions visually — with presets, builder UI, and plain English descriptions.',
    longDescription: `<p>Build cron expressions visually without memorizing syntax with our free <strong>cron expression generator</strong>. Select fields from dropdowns or pick a preset — the expression and its English description update in real time.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Visual Builder</strong>: Dropdowns for minute, hour, day, month, and weekday fields.</li>
<li><strong>10+ Presets</strong>: "Every 5 minutes", "Every Monday at 9am", "Every weekday", and more.</li>
<li><strong>Plain English</strong>: Instantly see what your cron expression means in human-readable language.</li>
<li><strong>Decode Mode</strong>: Paste an existing cron expression to decode it back to plain English.</li>
<li><strong>Syntax Reference</strong>: Built-in guide covering wildcards, lists, ranges, and step values.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers setting up cron jobs, DevOps engineers scheduling CI/CD pipelines, and cloud engineers configuring scheduled functions on AWS, GCP, or Azure.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup required.</p>`,
    category: 'developer-tools',
    targetKeyword: 'cron expression generator',
    secondaryKeywords: ['cron generator', 'crontab generator', 'cron builder', 'cron schedule generator', 'cron expression builder', 'crontab guru', 'cron job generator'],
    metaTitle: 'Cron Expression Generator — Visual Cron Builder Online',
    metaDescription: 'Generate cron expressions visually with presets, dropdowns & plain English descriptions. Decode existing cron jobs. Free cron builder — no signup needed.',
    faqs: [
      { question: 'What is a cron expression?', answer: 'A cron expression is a string of 5 fields (minute, hour, day-of-month, month, day-of-week) that defines a recurring schedule. It is used in Unix/Linux cron jobs, CI/CD pipelines, cloud schedulers, and more.' },
      { question: 'What does */5 mean?', answer: 'The / is a step value. */5 in the minute field means "every 5 minutes." Similarly, */2 in the hour field means "every 2 hours."' },
      { question: 'Can I decode an existing cron expression?', answer: 'Yes! Paste any valid cron expression in the decode field and click "Decode" to see the schedule in plain English and populate the visual builder.' },
    ],
    howToSteps: ['Select values for minute, hour, day, month, and weekday from the dropdowns.', 'Or click a preset like "Every 5 minutes" to populate the fields.', 'See the cron expression and English description update in real time.', 'Copy the cron expression with one click.', 'To decode: paste an existing cron expression and click "Decode."'],
    relatedToolSlugs: ['json-formatter', 'regex-tester', 'timestamp-converter', 'uuid-generator'],
    icon: 'Clock',
    estimatedTime: 'Instant',
  },
  {
    slug: 'fake-data-generator',
    name: 'Fake Data Generator',
    shortDescription: 'Generate realistic fake names, emails, addresses, phone numbers & more for testing.',
    longDescription: `<p>Generate realistic fake data for testing and prototyping with our free <strong>fake data generator</strong>. Create names, emails, phone numbers, addresses, company names, dates, UUIDs, and more — entirely fictional and ready for test databases.</p>
<h2>Key Features</h2>
<ul>
<li><strong>10+ Data Types</strong>: Names, emails, phones, addresses, companies, credit cards, dates, UUIDs, usernames, and passwords.</li>
<li><strong>Bulk Generation</strong>: Generate up to 100 rows at once in a single click.</li>
<li><strong>Export Options</strong>: Download as JSON or CSV, or copy individual values.</li>
<li><strong>Multiple Locales</strong>: US, UK, India, and international formats.</li>
<li><strong>GDPR-Friendly</strong>: All data is fictional — no real personal information involved.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers seeding test databases, QA testers filling forms, UI/UX designers populating mockups, and data analysts creating sample datasets without privacy concerns.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no API calls, no data stored, no signup required.</p>`,
    category: 'developer-tools',
    targetKeyword: 'fake data generator',
    secondaryKeywords: ['random data generator', 'test data generator', 'mock data generator', 'fake name generator', 'random email generator', 'fake address generator', 'dummy data generator', 'sample data generator'],
    metaTitle: 'Fake Data Generator - Random Names, Emails & Addresses Free',
    metaDescription: 'Generate fake names, emails, phone numbers, addresses & more for testing. Export as JSON or CSV. Free, private — no signup needed.',
    faqs: [
      { question: 'Is the generated data real?', answer: 'No. All data is randomly generated and fictional. Names, emails, addresses, and phone numbers are created using algorithms and do not correspond to real people or locations.' },
      { question: 'Can I use this data in my database?', answer: 'Yes! The generated data is perfect for seeding test databases, populating development environments, and creating sample datasets. Export as JSON or CSV for easy import.' },
      { question: 'How many records can I generate at once?', answer: 'You can generate up to 100 records at a time. Need more? Simply generate multiple batches and combine them.' },
      { question: 'Are the credit card numbers real?', answer: 'No. Generated credit card numbers follow valid format patterns (Luhn algorithm) but are not connected to any real accounts. They are suitable for testing payment form UI only.' },
      { question: 'Is this tool GDPR compliant?', answer: 'Yes. Since all data is randomly generated and fictional, there are no privacy concerns. No real personal data is processed or stored.' },
    ],
    howToSteps: [
      'Select the data fields you want to generate (name, email, phone, etc.).',
      'Choose the number of records (1-100).',
      'Click "Generate" to create the fake data.',
      'Preview the data in the table view.',
      'Export as JSON or CSV, or copy individual values.',
    ],
    relatedToolSlugs: ['uuid-generator', 'password-generator', 'json-formatter', 'csv-to-json'],
    icon: 'Database',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'speech-to-text',
    name: 'Speech to Text',
    shortDescription: 'Convert speech to text in real time — free voice typing in 12+ languages.',
    longDescription: `<p>Dictate text using your voice with our free <strong>speech to text</strong> tool. Click the microphone, start speaking, and watch your words appear in real time — no downloads, no signup.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Real-Time Transcription</strong>: Words appear instantly as you speak, with interim results shown in gray.</li>
<li><strong>12+ Languages</strong>: English, Hindi, Nepali, Spanish, French, German, Japanese, Chinese, Arabic, and more.</li>
<li><strong>Download Output</strong>: Save your transcription as a .txt file or copy to clipboard.</li>
<li><strong>Continuous Dictation</strong>: Keep speaking without interruption for long-form transcription.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Writers who prefer dictating over typing, students taking notes hands-free, professionals creating quick voice memos, and accessibility users who find typing difficult.</p>
<h2>Privacy & Security</h2>
<p>Uses the Web Speech Recognition API in Chrome/Edge — speech processing is done by your browser, not by ToolsArena. Best in Chrome and Edge.</p>`,
    category: 'text-tools',
    targetKeyword: 'speech to text online',
    secondaryKeywords: ['speech to text', 'voice to text', 'voice typing', 'dictation online', 'speech recognition online', 'free voice to text', 'transcribe speech'],
    metaTitle: 'Speech to Text Online Free — Voice Typing in 12+ Languages',
    metaDescription: 'Convert speech to text in real time. Free voice typing in 12+ languages with download option. Works in Chrome & Edge. No signup, instant transcription.',
    faqs: [
      { question: 'Which browsers support this?', answer: 'Speech recognition works best in Google Chrome and Microsoft Edge. Safari has partial support. Firefox does not currently support the Web Speech Recognition API.' },
      { question: 'Is my voice data private?', answer: 'Your audio is processed by your browser\'s speech engine (Google for Chrome, Microsoft for Edge). ToolsArena does not receive, store, or process your voice data. The transcribed text stays in your browser.' },
      { question: 'Can I dictate in Hindi or other languages?', answer: 'Yes! Select your language from the dropdown before starting. The tool supports 12+ languages including Hindi, Nepali, Spanish, French, German, Japanese, Chinese, Arabic, Portuguese, and Korean.' },
      { question: 'Can I download the transcription?', answer: 'Yes! Click the download button to save your transcribed text as a .txt file.' },
    ],
    howToSteps: ['Select your language from the dropdown.', 'Click the microphone button to start listening.', 'Speak clearly — your words appear in real time.', 'Click the mic again to stop recording.', 'Copy the text or download as .txt file.'],
    relatedToolSlugs: ['text-to-speech', 'word-counter', 'character-counter', 'online-notepad', 'case-converter'],
    icon: 'Mic',
    estimatedTime: 'Real-time',
  },
  {
    slug: 'screen-recorder',
    name: 'Screen Recorder',
    shortDescription: 'Record your screen directly in the browser — free, no download, no watermark.',
    longDescription: `<p>Record your screen directly in your browser — free, no downloads, no watermarks, no time limits with our <strong>screen recorder online</strong> tool. Choose to capture your full screen, a window, or a single browser tab.</p>
<h2>Key Features</h2>
<ul>
<li><strong>No Installation</strong>: Works entirely in Chrome, Edge, and Firefox — nothing to download.</li>
<li><strong>Microphone Audio</strong>: Optionally include your voice narration alongside screen capture.</li>
<li><strong>Live Timer</strong>: See your recording duration in real time.</li>
<li><strong>WebM Download</strong>: Save your recording as a WebM video file — plays in any modern browser.</li>
<li><strong>No Time Limit</strong>: Record for as long as you need.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Developers recording bug reports, teachers creating tutorials, designers presenting mockups, and anyone needing a quick screen capture without installing software.</p>
<h2>Privacy & Security</h2>
<p>Uses the native MediaRecorder API — your recording is saved locally and never touches any server.</p>`,
    category: 'utility-tools',
    targetKeyword: 'screen recorder online',
    secondaryKeywords: ['screen recorder', 'free screen recorder', 'online screen recorder', 'record screen online', 'screen capture online', 'browser screen recorder', 'screen recording no download'],
    metaTitle: 'Screen Recorder Online Free — No Download, No Watermark',
    metaDescription: 'Record your screen for free directly in your browser. No download, no watermark, no time limit. Include mic audio. Download as WebM. Privacy-first screen capture.',
    faqs: [
      { question: 'Do I need to install anything?', answer: 'No! The screen recorder uses your browser\'s built-in APIs. Just click "Start Recording" and choose what to share. Works in Chrome, Edge, and Firefox.' },
      { question: 'Is there a recording time limit?', answer: 'No. You can record for as long as you want. The only limit is your available disk space/memory.' },
      { question: 'What format is the recording?', answer: 'Recordings are saved as WebM (VP9 codec) — a widely supported video format. You can play it in any modern browser or convert it to MP4 using a free converter.' },
      { question: 'Can I record my microphone audio?', answer: 'Yes! Check the "Include microphone audio" option before starting. The tool will ask for mic permission and mix your narration with any tab audio.' },
      { question: 'Is my recording uploaded anywhere?', answer: 'No. Your screen recording is processed entirely in your browser and saved directly to your computer. Nothing is uploaded to any server.' },
    ],
    howToSteps: ['Optionally check "Include microphone audio" for narration.', 'Click "Start Recording" — your browser will ask what to share.', 'Choose to share your entire screen, a window, or a browser tab.', 'A timer shows your recording duration. Click "Stop Recording" when done.', 'Preview your recording and click "Download WebM" to save.'],
    relatedToolSlugs: ['online-whiteboard', 'countdown-timer', 'stopwatch', 'image-compressor'],
    icon: 'MonitorPlay',
    isPopular: true,
    estimatedTime: 'Unlimited',
  },
  {
    slug: 'ip-address-lookup',
    name: 'IP Address Lookup',
    shortDescription: 'Find your public IP address and location — city, country, ISP, timezone, and coordinates.',
    longDescription: `<p>Instantly find out <strong>what is my IP address</strong> — your public IP with full location details including city, region, country, timezone, ISP, and geographic coordinates.</p>
<h2>What You Get</h2>
<ul>
<li><strong>Your Public IP</strong>: Displayed prominently with one-click copy.</li>
<li><strong>Location Details</strong>: City, region, country, postal code, and coordinates.</li>
<li><strong>ISP Info</strong>: Your internet service provider and organization name.</li>
<li><strong>Timezone</strong>: Your connection's detected timezone.</li>
<li><strong>Lookup Any IP</strong>: Enter any IP address to see its location details.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Anyone checking their IP before connecting to a VPN, developers debugging network issues, and IT professionals verifying ISP and location information.</p>
<h2>Privacy Note</h2>
<p>This tool calls the ipinfo.io API directly from your browser to fetch geolocation data. ToolsArena does not store your IP address.</p>`,
    category: 'utility-tools',
    targetKeyword: 'what is my ip',
    secondaryKeywords: ['my ip address', 'ip address lookup', 'ip lookup', 'find my ip', 'check my ip', 'ip location', 'ip geolocation', 'what is my ip address'],
    metaTitle: 'What Is My IP Address? — IP Lookup with Location',
    metaDescription: 'Find your public IP address instantly with city, country, ISP, timezone & coordinates. Look up any IP address. Free IP geolocation tool.',
    faqs: [
      { question: 'What is a public IP address?', answer: 'Your public IP is the address that websites and services see when you connect to the internet. It is assigned by your ISP and identifies your connection to the outside world.' },
      { question: 'Is this tool accurate?', answer: 'IP geolocation is typically accurate to the city level. The exact location shown is approximate — it identifies the general area of your ISP, not your physical address.' },
      { question: 'Can I look up other IP addresses?', answer: 'Yes! Enter any IP address in the lookup field to see its location details.' },
      { question: 'Does ToolsArena store my IP?', answer: 'No. The lookup request goes directly from your browser to ipinfo.io. ToolsArena does not log, store, or process your IP address.' },
    ],
    howToSteps: ['Open the tool — your public IP is displayed automatically.', 'See your location, ISP, timezone, and coordinates.', 'Click the copy button to copy your IP address.', 'To look up another IP, enter it in the search field and click "Lookup."'],
    relatedToolSlugs: ['internet-speed-test', 'timezone-checker', 'qr-code-generator', 'json-formatter'],
    icon: 'Globe',
    estimatedTime: '1-2 seconds',
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF Converter',
    shortDescription: 'Convert multiple images to a single PDF — arrange pages, set margins, choose page size.',
    longDescription: `<p>Convert multiple images into a single PDF document with our free <strong>image to PDF</strong> converter. Upload, arrange, and download a professional PDF — all in your browser, no server upload.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Multiple Images</strong>: Each image becomes one page in the PDF — no hard limit on number of pages.</li>
<li><strong>Page Size Options</strong>: A4, US Letter, or Fit-to-Image (page matches image dimensions).</li>
<li><strong>Reorder Pages</strong>: Drag pages up/down to control the sequence before generating.</li>
<li><strong>Margin Control</strong>: Set custom margins for a professional look.</li>
<li><strong>Aspect Ratio Preserved</strong>: Images are scaled to fit the page without distortion.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Anyone scanning documents with their phone, combining photos into a portfolio, creating image-based reports, or sending multiple images as a single email attachment.</p>
<h2>Privacy & Security</h2>
<p>Uses pdf-lib in your browser — your images never leave your device. No signup required.</p>`,
    category: 'pdf-tools',
    targetKeyword: 'image to PDF',
    secondaryKeywords: ['image to PDF converter', 'image to PDF converter online', 'JPG to PDF', 'PNG to PDF', 'convert image to PDF', 'photo to PDF', 'images to PDF online', 'picture to PDF free', 'multiple images to PDF', 'image to PDF online free', 'convert photo to PDF free'],
    metaTitle: 'Image to PDF - Convert Images to PDF Online Free | Multiple Photos',
    metaDescription: 'Convert multiple images to a single PDF online free. Custom page size, margins & page order. No upload — images stay on your device. Instant results.',
    faqs: [
      { question: 'How many images can I add?', answer: 'There is no hard limit. You can add as many images as your browser can handle. For very large batches (50+), processing may be slower.' },
      { question: 'What page sizes are available?', answer: 'A4 (210 x 297mm), US Letter (8.5 x 11 inches), and Fit to Image (page size matches the image dimensions).' },
      { question: 'Can I reorder the pages?', answer: 'Yes! Use the Up/Down buttons next to each image to rearrange the page order before generating the PDF.' },
      { question: 'Are my images uploaded?', answer: 'No. The PDF is generated entirely in your browser using the pdf-lib JavaScript library. Your images never leave your device.' },
    ],
    howToSteps: ['Upload images by dropping or clicking (JPEG, PNG supported).', 'Reorder images using the Up/Down buttons if needed.', 'Choose page size (A4, Letter, or Fit to Image) and adjust margins.', 'Click "Generate PDF" to create and download the PDF.'],
    relatedToolSlugs: ['jpg-to-pdf', 'pdf-merge', 'image-compressor', 'image-resizer', 'pdf-compress'],
    icon: 'FileImage',
    isPopular: true,
    estimatedTime: '2-10 seconds',
  },
  {
    slug: 'online-whiteboard',
    name: 'Online Whiteboard',
    shortDescription: 'A free drawing whiteboard — sketch, doodle, and brainstorm right in your browser.',
    longDescription: `<p>A simple, distraction-free <strong>online whiteboard</strong> for sketching ideas, drawing diagrams, and brainstorming — directly in your browser with zero latency and no account needed.</p>
<h2>Key Features</h2>
<ul>
<li><strong>9+ Colors</strong>: Preset colors plus a custom color picker for any shade.</li>
<li><strong>Adjustable Brush</strong>: Set line width for thin lines or thick strokes.</li>
<li><strong>Undo History</strong>: Up to 30 undo steps (Ctrl+Z supported).</li>
<li><strong>Touch Support</strong>: Draw with your finger or stylus on tablets and touchscreens.</li>
<li><strong>Save as PNG</strong>: Download your drawing as a PNG image anytime.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Anyone who needs to quickly sketch an idea, draw a diagram for a meeting, brainstorm on a virtual board, or doodle without installing drawing software.</p>
<h2>Privacy & Security</h2>
<p>Runs locally in your browser — no cloud saving, no account, no data collection.</p>`,
    category: 'utility-tools',
    targetKeyword: 'online whiteboard',
    secondaryKeywords: ['whiteboard online', 'free whiteboard', 'drawing board online', 'online drawing tool', 'digital whiteboard', 'sketch online', 'web whiteboard free'],
    metaTitle: 'Online Whiteboard — Free Drawing Board & Sketch Tool',
    metaDescription: 'Free online whiteboard for drawing, sketching & brainstorming. 9+ colors, eraser, undo, adjustable brush. Download as PNG. Works on desktop & touch devices.',
    faqs: [
      { question: 'Does it work on tablets and phones?', answer: 'Yes! The whiteboard supports touch input, so you can draw with your finger or a stylus on tablets and touchscreen devices.' },
      { question: 'Can I undo my strokes?', answer: 'Yes. Click the undo button (or use Ctrl+Z) to undo up to 30 strokes.' },
      { question: 'Can I save my drawing?', answer: 'Yes! Click "Save PNG" to download your whiteboard as a PNG image. There is no cloud save — drawings are only saved when you download them.' },
      { question: 'Is there a collaboration feature?', answer: 'Not currently. This is a single-user whiteboard for quick personal sketching. For collaborative whiteboards, tools like Excalidraw or Miro are better suited.' },
    ],
    howToSteps: ['Select the pen tool (selected by default).', 'Choose a color and adjust brush thickness.', 'Draw on the canvas with your mouse or touch.', 'Use the eraser to remove parts, or undo to revert strokes.', 'Click "Save PNG" to download your drawing.'],
    relatedToolSlugs: ['screen-recorder', 'online-notepad', 'image-compressor', 'color-picker'],
    icon: 'PenTool',
    estimatedTime: 'Instant',
  },

  // ─── TYPING & PRODUCTIVITY TOOLS ──────────────────────────────────────────
  {
    slug: 'typing-speed-test',
    name: 'Typing Speed Test',
    shortDescription: 'Test your typing speed and accuracy with a free online WPM typing test.',
    longDescription: `<p>Measure your typing speed and accuracy with our free <strong>typing speed test</strong>. Find your WPM in real time as you type — with live error highlighting and a detailed results breakdown.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Live WPM Counter</strong>: See your words per minute update in real time as you type.</li>
<li><strong>Error Highlighting</strong>: Correct characters in green, mistakes in red — instant feedback.</li>
<li><strong>Multiple Durations</strong>: Choose 1, 2, 3, or 5-minute tests to match your practice routine.</li>
<li><strong>Detailed Results</strong>: Final WPM, accuracy %, total characters, errors, and comparison with global averages.</li>
<li><strong>Speed Benchmark</strong>: See how you compare to beginner, average, fast, and excellent typists.</li>
</ul>
<h2>What Is a Good Typing Speed?</h2>
<p>Average: 40 WPM. Professional: 60–80 WPM. Excellent: 80+ WPM. Practice daily focusing on accuracy first — speed follows naturally.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your typed text never leaves your device. No signup required.</p>`,
    category: 'utility-tools',
    targetKeyword: 'typing speed test',
    secondaryKeywords: ['typing test', 'wpm test', 'typing speed test online', 'online typing test', 'free typing test', 'typing practice', 'words per minute test', 'keyboard speed test', 'typing test English', 'typing master online', 'fast typing test', 'typing speed checker', 'typing test online free', '1 minute typing test'],
    metaTitle: 'Typing Speed Test Online - Free WPM Typing Test',
    metaDescription: 'Test your typing speed & accuracy with our free online typing test. Measure WPM, track errors, compare your speed. 1-5 minute tests — no signup, works in browser.',
    faqs: [
      { question: 'How is WPM (Words Per Minute) calculated?', answer: 'WPM is calculated by dividing the number of correctly typed characters by 5 (the standard word length) and then dividing by the elapsed time in minutes. Only correct characters count toward your WPM score.' },
      { question: 'What is a good typing speed?', answer: 'The average typing speed is 40 WPM. Professional typists usually type 60-80 WPM. Speed above 80 WPM is considered excellent. Competitive typists can reach 120+ WPM.' },
      { question: 'How can I improve my typing speed?', answer: 'Practice regularly with typing tests, maintain proper finger placement on the home row (ASDF JKL;), look at the screen instead of the keyboard, and focus on accuracy first — speed will follow naturally.' },
      { question: 'Does this typing test work on mobile?', answer: 'Yes, the typing test works on mobile devices and tablets. However, for the most accurate results, use a physical keyboard on a desktop or laptop computer.' },
      { question: 'Is my typing data saved or shared?', answer: 'No. This tool runs entirely in your browser. Your typed text and results are never sent to any server or stored anywhere.' },
      { question: 'Which test duration should I choose?', answer: 'For a quick check, use the 1-minute test. For a more accurate measurement, the 2 or 3-minute test is recommended. Use the 5-minute test for endurance practice.' },
    ],
    howToSteps: [
      'Select your preferred test duration (1, 2, 3, or 5 minutes).',
      'Click "Start Typing Test" to begin.',
      'Type the displayed passage in the text box as fast and accurately as you can.',
      'Watch your live WPM, accuracy, and errors update in real time.',
      'When the timer runs out, review your detailed results and speed comparison.',
      'Click "Try Again" to retake the test and improve your score.',
    ],
    relatedToolSlugs: ['word-counter', 'online-notepad', 'text-to-speech', 'pomodoro-timer', 'countdown-timer', 'random-generator'],
    icon: 'Keyboard',
    isPopular: true,
    estimatedTime: '1-5 minutes',
  },
  {
    slug: 'passport-photo-maker',
    name: 'Passport Photo Maker',
    shortDescription: 'Create passport size photos for India, US, UK, and more. Free online tool.',
    longDescription: `<p>Create perfect <strong>passport size photos</strong> online for free. Upload any photo, crop to the exact dimensions required for your country, set the background color, and download instantly — no software, no signup.</p>
<h2>Supported Countries & Sizes</h2>
<ul>
<li><strong>India</strong>: 2×2 inches (51×51 mm) — white background recommended.</li>
<li><strong>US</strong>: 2×2 inches — white background required.</li>
<li><strong>UK</strong>: 35×45 mm — plain light gray or cream background.</li>
<li><strong>EU/Schengen</strong>: 35×45 mm.</li>
<li><strong>China</strong>: 33×48 mm. <strong>Japan</strong>: 35×45 mm.</li>
<li><strong>Custom</strong>: Enter any dimensions.</li>
</ul>
<h2>Key Features</h2>
<ul>
<li><strong>Print Sheet</strong>: Generate a 4×6 inch sheet with multiple passport photos for home printing.</li>
<li><strong>Interactive Crop</strong>: Guide lines help position your face correctly within the frame.</li>
</ul>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser using HTML5 Canvas — your photo never leaves your device. No signup required.</p>`,
    category: 'image-tools',
    targetKeyword: 'passport size photo maker',
    secondaryKeywords: ['passport photo online', 'passport size photo', 'passport photo maker free', 'passport photo editor', 'visa photo maker', 'passport photo generator', '2x2 photo maker', 'passport photo india', 'passport photo crop', 'photo print sheet', 'passport photo background'],
    metaTitle: 'Passport Photo Maker - Free Online Passport Size Photo Tool',
    metaDescription: 'Create passport size photos for India, US, UK & more. Crop, set background, and download or print — all free, online, and private. No signup needed.',
    faqs: [
      { question: 'What passport photo sizes are supported?', answer: 'We support India (2x2 in), US (2x2 in), UK (35x45 mm), EU/Schengen (35x45 mm), China (33x48 mm), Japan (35x45 mm), and custom dimensions.' },
      { question: 'How do I use this for Indian passport photos?', answer: 'Select the "India" size (2x2 inches / 51x51 mm), upload a clear front-facing photo, position the crop over your face, and click Generate. Use the white background option for Indian passport applications.' },
      { question: 'Can I print multiple passport photos on one sheet?', answer: 'Yes! After generating your photo, click the "Print Sheet" button to create a 4x6 inch sheet with multiple photos arranged for easy printing.' },
      { question: 'Is my photo stored or uploaded to any server?', answer: 'No. All processing happens entirely in your browser using HTML5 Canvas. Your photo never leaves your device — 100% private.' },
      { question: 'What background color should I use?', answer: 'For Indian passports, a plain white background is recommended. US passports also require white. UK passports accept plain light gray or cream. Select the appropriate background color before generating.' },
      { question: 'What image quality is supported?', answer: 'For best results, upload a high-resolution photo (at least 600x600 pixels). The output is generated at the exact pixel dimensions required for each passport size.' },
    ],
    howToSteps: [
      'Upload a clear, front-facing photo (JPEG or PNG).',
      'Select the passport photo size for your country.',
      'Choose the background color (white recommended for most countries).',
      'Position the crop area over your face using the interactive guide.',
      'Click "Generate Photo" to create your passport photo.',
      'Download the single photo or generate a print sheet with multiple copies.',
    ],
    relatedToolSlugs: ['image-cropper', 'image-compressor', 'image-resizer', 'image-watermark', 'png-to-jpg', 'jpg-to-png'],
    icon: 'User',
    isPopular: true,
    estimatedTime: '1 minute',
  },
  {
    slug: 'love-calculator',
    name: 'Love Calculator',
    shortDescription: 'Calculate love compatibility between two names. Fun & free love meter.',
    longDescription: `<p>Calculate the <strong>love compatibility</strong> between two names with our fun, free love calculator. Enter two names and get an instant compatibility percentage with an animated heart result.</p>
<h2>How It Works</h2>
<p>A deterministic hash algorithm converts both names into a unique compatibility score — meaning the same two names always produce the same result. Share it with friends and have fun comparing results.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Animated Result</strong>: Beautiful heart animation with color-coded percentage.</li>
<li><strong>Personalized Message</strong>: A unique love message based on your score.</li>
<li><strong>Consistent Results</strong>: Same names always give the same percentage.</li>
</ul>
<p><em>For entertainment only — real love is built on trust, respect, and communication, not algorithms!</em></p>`,
    category: 'utility-tools',
    targetKeyword: 'love calculator',
    secondaryKeywords: ['love meter', 'love percentage calculator', 'love tester', 'love compatibility test', 'love calculator by name', 'love match calculator', 'true love calculator', 'crush calculator', 'name love calculator', 'love calculator online', 'love calculator percentage', 'flame calculator', 'love test online'],
    metaTitle: 'Love Calculator - Test Love Compatibility by Name Free',
    metaDescription: 'Calculate your love compatibility! Enter two names and get your love percentage with animated heart result. Free online love calculator — fun, instant, no signup.',
    faqs: [
      { question: 'How does the love calculator work?', answer: 'It uses a hash algorithm based on the combined letters of both names to generate a deterministic compatibility percentage. The same names will always give the same result.' },
      { question: 'Is the love calculator accurate?', answer: 'This is an entertainment tool only. The results are algorithmically generated and not based on any scientific compatibility analysis. Have fun with it, but don\'t take the results seriously!' },
      { question: 'Will the same names always give the same result?', answer: 'Yes! The algorithm is deterministic, so entering the same two names will always produce the same love percentage.' },
      { question: 'Can I share my results?', answer: 'Absolutely! Take a screenshot of your results and share them with friends or on social media.' },
    ],
    howToSteps: [
      'Enter your name in the first field.',
      'Enter your partner\'s or crush\'s name in the second field.',
      'Click "Calculate Love" to see your compatibility.',
      'View your animated love percentage and personalized message.',
      'Click "Try Another Pair" to test different names.',
    ],
    relatedToolSlugs: ['random-generator', 'age-calculator', 'countdown-timer', 'emoji-picker'],
    icon: 'Heart',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'youtube-thumbnail-downloader',
    name: 'YouTube Thumbnail Downloader',
    shortDescription: 'Download YouTube video thumbnails in all sizes. Free and instant.',
    longDescription: `<p>Download YouTube video thumbnails in all available resolutions instantly with our free <strong>YouTube thumbnail downloader</strong>. Paste any YouTube URL and get all sizes in one click.</p>
<h2>Available Thumbnail Sizes</h2>
<ul>
<li><strong>Max Resolution</strong>: 1280×720 (HD) — best for design use.</li>
<li><strong>Standard</strong>: 640×480.</li>
<li><strong>High Quality</strong>: 480×360.</li>
<li><strong>Medium</strong>: 320×180.</li>
<li><strong>Default</strong>: 120×90.</li>
</ul>
<h2>Supported URL Formats</h2>
<p>Works with standard watch URLs, short youtu.be links, embed URLs, and YouTube Shorts. Download any thumbnail with one click or copy the direct image URL.</p>
<h2>Privacy & Security</h2>
<p>Runs in your browser — no server-side storage or tracking. No signup required.</p>`,
    category: 'utility-tools',
    targetKeyword: 'YouTube thumbnail downloader',
    secondaryKeywords: ['YouTube thumbnail download', 'yt thumbnail downloader', 'YouTube video thumbnail', 'download YouTube thumbnail HD', 'YouTube thumbnail grabber', 'YouTube thumbnail saver', 'YouTube thumbnail image download', 'yt thumbnail download HD', 'YouTube thumbnail downloader online', 'download thumbnail from YouTube video'],
    metaTitle: 'YouTube Thumbnail Downloader - Download HD Thumbnails Free Online',
    metaDescription: 'Download YouTube video thumbnails in HD (1280x720) and all sizes. Paste URL, get thumbnails instantly. Free YouTube thumbnail downloader — no signup needed.',
    faqs: [
      { question: 'How do I download a YouTube thumbnail?', answer: 'Paste the YouTube video URL in the input field and click "Get Thumbnails". You\'ll see all available thumbnail sizes. Click the download icon next to any size to save it.' },
      { question: 'What thumbnail sizes are available?', answer: 'YouTube provides thumbnails in 5 sizes: Max Resolution (1280x720), Standard (640x480), High Quality (480x360), Medium (320x180), and Default (120x90).' },
      { question: 'Does it work with YouTube Shorts?', answer: 'Yes! The tool supports all YouTube URL formats including Shorts, standard watch URLs, short youtu.be links, and embed URLs.' },
      { question: 'Can I use downloaded thumbnails commercially?', answer: 'YouTube thumbnails are owned by the video creator. Using them may be subject to copyright. Always credit the original creator and check usage rights before commercial use.' },
      { question: 'Why is the max resolution thumbnail not available for some videos?', answer: 'Not all YouTube videos have max resolution (1280x720) thumbnails. In that case, the tool automatically falls back to the highest available quality.' },
    ],
    howToSteps: [
      'Copy the YouTube video URL from your browser or the YouTube app.',
      'Paste the URL in the input field above.',
      'Click "Get Thumbnails" to fetch all available sizes.',
      'Preview the thumbnails and click the download icon to save.',
      'You can also copy the direct thumbnail URL for embedding.',
    ],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'png-to-jpg', 'screen-recorder', 'qr-code-generator'],
    icon: 'Youtube',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'youtube-money-calculator',
    name: 'YouTube Money Calculator',
    shortDescription: 'Estimate YouTube earnings from views, subscribers, and CPM. Free & instant.',
    longDescription: `<p>Estimate how much money a YouTube channel or video earns with our free <strong>YouTube Money Calculator</strong>. Enter daily views, total views, or subscribers to get instant earnings estimates based on real CPM data for different countries and niches.</p>
<h2>Key Features</h2>
<ul>
<li><strong>CPM Slider</strong>: Customize CPM from $0.25 (developing markets) to $15+ (finance/tech in US) to match your niche.</li>
<li><strong>Country Selection</strong>: Choose your primary audience country for region-specific revenue estimates.</li>
<li><strong>Daily/Monthly/Yearly Breakdown</strong>: See projected earnings across all time horizons.</li>
<li><strong>Subscriber Milestones</strong>: Projected earnings at 1K, 10K, 100K, and 1M subscribers.</li>
<li><strong>Visual Chart</strong>: Earnings breakdown chart and CPM comparison by country and niche.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for aspiring YouTubers planning their content strategy, existing creators benchmarking their earnings, and anyone curious about how much YouTubers actually make.</p>
<h2>Privacy & Security</h2>
<p>All calculations run instantly in your browser — no signup required, no data stored.</p>`,
    category: 'utility-tools',
    targetKeyword: 'YouTube money calculator',
    secondaryKeywords: ['youtube earnings calculator', 'how much do youtubers make', 'youtube revenue calculator', 'youtube income calculator', 'youtube CPM calculator', 'youtube money estimator', 'youtube pay calculator', 'how much youtube pays'],
    metaTitle: 'YouTube Money Calculator - Estimate Channel Earnings Free',
    metaDescription: 'Calculate YouTube earnings from views and subscribers. Estimate daily, monthly & yearly revenue with CPM data by country. Free calculator — no signup needed.',
    faqs: [
      { question: 'How accurate is this YouTube earnings calculator?', answer: 'The calculator provides estimates based on industry-average CPM ranges. Actual earnings vary based on niche, audience location, ad engagement, video length, and seasonality. Use it as a benchmark, not an exact figure.' },
      { question: 'What is CPM and how does it affect earnings?', answer: 'CPM (Cost Per Mille) is the amount advertisers pay per 1,000 ad impressions. Higher CPM niches like finance ($12-15), tech ($8-12), and health ($6-10) pay more than entertainment ($2-4) or gaming ($3-5). US/UK audiences have higher CPMs than India or Southeast Asia.' },
      { question: 'How much does YouTube pay per 1,000 views?', answer: 'YouTube typically pays $1-5 per 1,000 views on average, but this varies widely. After YouTube takes its 45% cut, creators earn 55% of ad revenue. High-CPM niches in the US can earn $8-15 per 1,000 views.' },
      { question: 'Do all views generate revenue?', answer: 'No. Only monetized views (with ads) generate revenue. Typically 40-60% of total views are monetized. Viewers using ad blockers, viewers in low-ad regions, and some video types reduce monetized view percentage.' },
      { question: 'How many subscribers do I need to start earning?', answer: 'You need at least 1,000 subscribers and 4,000 watch hours in the past 12 months to join the YouTube Partner Program. Alternatively, 1,000 subscribers with 10 million Shorts views in 90 days also qualifies.' },
    ],
    howToSteps: [
      'Enter your daily video views or total channel views.',
      'Adjust the CPM slider to match your niche and audience region.',
      'Select your primary audience country for region-specific estimates.',
      'View your estimated daily, monthly, and yearly earnings instantly.',
      'Explore the earnings breakdown by subscriber milestones for growth planning.',
    ],
    relatedToolSlugs: ['youtube-thumbnail-downloader', 'invoice-generator', 'salary-calculator', 'compound-interest-calculator'],
    icon: 'DollarSign',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'instagram-engagement-calculator',
    name: 'Instagram Engagement Calculator',
    shortDescription: 'Calculate your Instagram engagement rate from followers, likes, and comments. Free tool.',
    longDescription: `<p>Calculate your <strong>Instagram engagement rate</strong> with our free Instagram Engagement Calculator. Enter your followers, average likes, and average comments to get your engagement rate — the key metric brands use to evaluate influencer partnerships.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Standard Formula</strong>: Calculates using (Avg Likes + Avg Comments) / Followers × 100.</li>
<li><strong>Engagement Rating</strong>: Rates your result as Excellent, Good, Average, or Low based on industry benchmarks.</li>
<li><strong>Follower Tier Benchmarks</strong>: Compare against nano, micro, mid-tier, and mega influencer averages.</li>
<li><strong>Earnings Estimate</strong>: See estimated earnings per post based on your engagement rate and follower count.</li>
<li><strong>Visual Score Meter</strong>: See your engagement score at a glance with improvement tips.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for influencers checking their stats, brands evaluating creators before partnerships, and social media managers tracking account health.</p>
<h2>Privacy & Security</h2>
<p>No Instagram login required — all calculations happen instantly in your browser with no data stored.</p>`,
    category: 'utility-tools',
    targetKeyword: 'Instagram engagement calculator',
    secondaryKeywords: ['instagram engagement rate calculator', 'ig engagement calculator', 'instagram engagement rate', 'check instagram engagement', 'instagram engagement checker', 'instagram rate calculator', 'calculate engagement rate instagram'],
    metaTitle: 'Instagram Engagement Calculator - Check Engagement Rate Free',
    metaDescription: 'Calculate your Instagram engagement rate from followers, likes & comments. See your rating vs benchmarks. Free tool — no login required.',
    faqs: [
      { question: 'What is a good Instagram engagement rate?', answer: 'For most accounts: 1-3% is average, 3-6% is good, 6%+ is excellent. Smaller accounts (under 10K followers) typically have higher engagement rates (3-8%) than large accounts (100K+) which average 1-3%.' },
      { question: 'How is engagement rate calculated?', answer: 'Engagement Rate = (Average Likes + Average Comments) / Total Followers × 100. Some formulas also include saves and shares, but likes + comments is the most standard and widely used formula.' },
      { question: 'Do I need to connect my Instagram account?', answer: 'No. Simply enter your follower count, average likes, and average comments manually. No Instagram login or API connection is needed.' },
      { question: 'Why is my engagement rate low?', answer: 'Common reasons: posting at wrong times, using irrelevant hashtags, low-quality content, inconsistent posting schedule, buying fake followers, or Instagram algorithm changes. Focus on creating valuable content for your specific audience.' },
      { question: 'How much can I earn based on my engagement rate?', answer: 'Earnings vary widely, but as a rough guide: Nano (1K-10K followers) earn $10-100/post, Micro (10K-100K) earn $100-1,000/post, Mid-tier (100K-500K) earn $1,000-5,000/post, and Macro (500K+) earn $5,000-25,000+ per post. Higher engagement rates command premium rates.' },
    ],
    howToSteps: [
      'Enter your total Instagram follower count.',
      'Enter your average likes per post (check your last 10-12 posts).',
      'Enter your average comments per post.',
      'View your engagement rate, rating, and comparison with benchmarks instantly.',
      'Check the estimated earnings and tips to improve your engagement.',
    ],
    relatedToolSlugs: ['youtube-money-calculator', 'youtube-thumbnail-downloader', 'qr-code-generator', 'whatsapp-link-generator'],
    icon: 'Heart',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'online-signature-maker',
    name: 'Online Signature Maker',
    shortDescription: 'Create a digital signature by drawing or typing. Download as PNG.',
    longDescription: `<p>Create a professional <strong>digital signature online</strong> for free with our Signature Maker. Draw with your mouse, trackpad, or touchscreen, or type your name and choose from multiple signature fonts.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Draw Mode</strong>: Sign on canvas with mouse, trackpad, or touchscreen with adjustable pen thickness.</li>
<li><strong>Type Mode</strong>: Generate a signature from your name with multiple font styles and sizes.</li>
<li><strong>Color Options</strong>: Choose ink color — black, blue, red, green, brown, or purple.</li>
<li><strong>Transparent PNG</strong>: Download with white background or transparent background for overlaying on documents.</li>
<li><strong>Undo & Clear</strong>: Undo strokes or clear the canvas and start over.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for professionals needing a quick digital signature for contracts, PDFs, emails, or digital forms without a full e-signature service.</p>
<h2>Privacy & Security</h2>
<p>All processing happens locally in your browser — your signature is never uploaded or stored on any server.</p>`,
    category: 'utility-tools',
    targetKeyword: 'online signature maker',
    secondaryKeywords: ['signature maker', 'digital signature maker', 'free signature maker', 'electronic signature creator', 'signature generator', 'create signature online', 'draw signature online', 'signature maker free', 'e-signature maker', 'handwritten signature generator'],
    metaTitle: 'Online Signature Maker - Free Digital Signature Creator',
    metaDescription: 'Create a digital signature by drawing or typing your name. Download as PNG or transparent PNG. Free online signature maker — no signup needed.',
    faqs: [
      { question: 'How do I create a signature?', answer: 'Choose "Draw" mode to draw with your mouse/touch, or "Type" mode to generate a signature from your name. Customize the color and style, then download as PNG.' },
      { question: 'Can I download a transparent signature?', answer: 'Yes! Click "Transparent PNG" to download your signature with no background — perfect for placing on documents and PDFs.' },
      { question: 'Is this legally valid as a signature?', answer: 'Digital signatures created here can be used for informal documents. For legally binding electronic signatures, you may need a certified e-signature service that complies with local laws (e.g., IT Act 2000 in India, ESIGN Act in the US).' },
      { question: 'Does this work on mobile and tablets?', answer: 'Yes! The draw mode works with touch input on smartphones and tablets. For best results, draw with your finger or a stylus on a touchscreen device.' },
      { question: 'Is my signature stored or shared?', answer: 'No. Everything runs in your browser. Your signature is never uploaded to any server — 100% private.' },
    ],
    howToSteps: [
      'Choose "Draw" to hand-draw or "Type" to generate from text.',
      'For draw mode: use your mouse or finger to sign on the canvas.',
      'For type mode: enter your name, choose a font and size.',
      'Select your preferred ink color.',
      'Click "Download PNG" for a white-background signature.',
      'Click "Transparent PNG" for a signature without background.',
    ],
    relatedToolSlugs: ['online-whiteboard', 'image-watermark', 'online-notepad', 'screen-recorder'],
    icon: 'PenLine',
    isPopular: true,
    estimatedTime: '1 minute',
  },
  {
    slug: 'marriage-biodata-maker',
    name: 'Marriage Biodata Maker',
    shortDescription: 'Create beautiful marriage biodata online for free. 10 templates, PDF & image download.',
    longDescription: `<p>Create a professional <strong>marriage biodata online</strong> for free with our Marriage Biodata Maker. Choose from 10 beautifully designed templates crafted for Indian matrimonial traditions — Classic Gold, Royal Blue, Floral Pink, Modern Minimal, Auspicious Red, and more.</p>
<h2>Key Features</h2>
<ul>
<li><strong>10 Templates</strong>: Classic Gold, Royal Blue, Floral Pink, Modern Minimal, Auspicious Red, Ganesh Blessing, Peacock Green, Elegant Purple, Simple White, and Saffron.</li>
<li><strong>Step-by-Step Form</strong>: Fill personal, education, career, family, and partner expectations easily.</li>
<li><strong>Photo Upload</strong>: Add your photo — processed locally, never stored on any server.</li>
<li><strong>PDF & PNG Download</strong>: Download as high-quality PNG image or PDF for printing or digital sharing.</li>
<li><strong>Real-Time Preview</strong>: See your biodata update live as you fill in the form.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for individuals and families creating biodata for matrimonial platforms, sharing with relatives, or submitting to marriage bureaus. All fields except name are optional.</p>
<h2>Privacy & Security</h2>
<p>Your data never leaves your browser — 100% private, no signup, no watermarks, no hidden charges.</p>`,
    category: 'utility-tools',
    targetKeyword: 'marriage biodata maker',
    secondaryKeywords: ['biodata for marriage', 'marriage biodata format', 'biodata maker online', 'marriage biodata template', 'biodata format for marriage', 'shadi biodata', 'marriage biodata pdf', 'biodata for marriage free download', 'marriage biodata maker online free', 'vivah biodata', 'wedding biodata maker', 'biodata for marriage format in hindi'],
    metaTitle: 'Marriage Biodata Maker - Free Online | 10 Templates, PDF',
    metaDescription: 'Create beautiful marriage biodata online free. 10 templates, photo upload, PDF & image download. Indian-friendly format — no signup, 100% private.',
    faqs: [
      { question: 'How do I create a marriage biodata?', answer: 'Choose a template, fill in your details step by step (personal, education, family, contact), upload your photo, preview the biodata, and download it as PNG or PDF.' },
      { question: 'Is this marriage biodata maker free?', answer: 'Yes, completely free with no hidden charges, no watermarks, and no signup required. All 10 templates are available for free.' },
      { question: 'Which template should I choose?', answer: 'For traditional Hindu biodatas, Classic Gold, Auspicious Red, or Ganesh Blessing work great. For a modern look, try Modern Minimal or Simple White. For Sikh/Muslim biodatas, Royal Blue or Elegant Purple are popular choices.' },
      { question: 'Can I download the biodata as PDF?', answer: 'Yes! You can download your biodata as both a high-quality PNG image and a PDF document, ready for printing or sharing digitally.' },
      { question: 'Is my personal data safe?', answer: 'Absolutely. All processing happens in your browser. Your personal details and photo are never uploaded to any server — 100% private.' },
      { question: 'Can I include my photo in the biodata?', answer: 'Yes. Upload a clear, front-facing photo and it will be included in the biodata. The photo is processed locally and never stored on our servers.' },
      { question: 'What details should I include?', answer: 'Typically include: name, date of birth, height, education, occupation, family details (parents, siblings), religion, caste, gotra, manglik status, and contact information. All fields except name are optional.' },
    ],
    howToSteps: [
      'Choose from 10 beautiful biodata templates.',
      'Fill in your personal details — name, DOB, height, religion, caste, etc.',
      'Add education, career, and income details.',
      'Enter family information — parents, siblings, family type.',
      'Add contact details and partner expectations.',
      'Upload your photo (optional) and preview the biodata.',
      'Download as PNG image or PDF — ready to share!',
    ],
    relatedToolSlugs: ['passport-photo-maker', 'image-to-pdf', 'online-signature-maker', 'resume-builder', 'image-compressor', 'pdf-compress'],
    icon: 'Heart',
    isPopular: true,
    estimatedTime: '5 minutes',
  },
  {
    slug: 'electricity-bill-calculator',
    name: 'Electricity Bill Calculator',
    shortDescription: 'Calculate your monthly electricity bill based on units consumed and state tariff slabs.',
    longDescription: `<p>India's most comprehensive <strong>electricity bill calculator</strong> covering 15 states with accurate domestic tariff slabs for FY 2025-26. Select your state, enter units consumed, and instantly see a detailed bill breakdown.</p>
<h2>Key Features</h2>
<ul>
<li><strong>15 States Covered</strong>: Maharashtra (MSEDCL), Delhi, Karnataka (BESCOM), Tamil Nadu (TNEB), UP (UPPCL), Rajasthan, Gujarat, MP, West Bengal, AP, Telangana, Kerala, Punjab, Bihar, and Haryana.</li>
<li><strong>Slab-Wise Breakdown</strong>: Visual bars showing energy charges, fixed charges, meter rent, fuel surcharge, and electricity duty at each tariff tier.</li>
<li><strong>Projections</strong>: Monthly, quarterly, and annual bill projections for budget planning.</li>
<li><strong>Appliance Guide</strong>: Daily kWh usage for LED bulbs, fans, AC, refrigerator, and more.</li>
<li><strong>Energy-Saving Tips</strong>: Actionable tips to reduce your electricity consumption.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for households tracking monthly electricity costs, renters verifying bills, and anyone comparing appliance power consumption across Indian states.</p>
<h2>Privacy & Security</h2>
<p>All calculations run instantly in your browser — no data stored, no signup required.</p>`,
    category: 'calculators',
    targetKeyword: 'electricity bill calculator India',
    secondaryKeywords: ['electricity bill calculator', 'bijli bill calculator', 'electricity unit rate calculator', 'MSEDCL bill calculator', 'state wise electricity tariff', 'electricity bill per unit rate', 'monthly electricity cost calculator'],
    metaTitle: 'Electricity Bill Calculator India - 15 States | Slab Rates',
    metaDescription: 'Calculate electricity bill with state-wise tariff slabs for 15 Indian states. See slab breakdown, energy charges, duty & projections. Free & instant.',
    faqs: [
      { question: 'How is the electricity bill calculated in India?', answer: 'Electricity bills are calculated using a slab-based tariff system. Each slab has a per-unit rate that increases with consumption. The bill includes energy charges (units x rate per slab), fixed charges, meter rent, fuel surcharge, and electricity duty (a percentage of the subtotal).' },
      { question: 'What is the average electricity rate per unit in India?', answer: 'The average rate varies by state from Rs 3 to Rs 12 per unit. Tamil Nadu offers free electricity for the first 100 units. Maharashtra has higher rates (Rs 4.71 to Rs 12.54/unit). Delhi rates range from Rs 3 to Rs 8/unit.' },
      { question: 'How many units does a 1.5 ton AC consume per day?', answer: 'A 1.5 ton 5-star inverter AC typically consumes 1-1.5 units per hour, averaging about 8-12 units for 8 hours of daily use. This translates to 240-360 units per month, adding Rs 1,200-3,600 to your bill depending on your state tariff.' },
      { question: 'What is electricity duty and fuel surcharge?', answer: 'Electricity duty is a tax levied by state governments on electricity consumption, typically 5-16% of the bill. Fuel surcharge is an additional charge per unit to cover fluctuating fuel costs for power generation, typically Rs 0.10-0.31 per unit.' },
    ],
    howToSteps: [
      'Select your state from the dropdown (15 Indian states supported).',
      'Enter the number of units consumed this month (check your meter or last bill).',
      'View the complete bill breakdown with energy charges, fixed charges, and taxes.',
      'Check the slab-wise visual breakdown to understand your tariff tiers.',
      'See monthly, quarterly, and annual projections for budget planning.',
    ],
    relatedToolSlugs: ['emi-calculator', 'gst-calculator', 'salary-calculator', 'percentage-calculator'],
    icon: 'Zap',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'text-repeater',
    name: 'Text Repeater',
    shortDescription: 'Repeat any text up to 10,000 times with custom separators. Copy instantly.',
    longDescription: `<p>The <strong>Text Repeater</strong> lets you duplicate any text, word, or phrase up to 10,000 times in a single click — with flexible separator options and instant copy to clipboard.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Up to 10,000 Repetitions</strong>: Repeat any text thousands of times instantly.</li>
<li><strong>Custom Separators</strong>: Choose new line, space, comma, dash, tab, or enter a custom separator.</li>
<li><strong>Line Numbering</strong>: Optionally prefix each line with 1. 2. 3. for numbered output.</li>
<li><strong>Quick Presets</strong>: One-click presets for 5x, 10x, 50x, 100x, 500x, 1000x, and 5000x.</li>
<li><strong>Live Count</strong>: Real-time character and word count as you type.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for generating test data, filling forms, creating WhatsApp/Instagram text art, SEO testing, and load testing scenarios.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your text is never sent to any server.</p>`,
    category: 'text-tools',
    targetKeyword: 'text repeater',
    secondaryKeywords: ['repeat text online', 'text repeater tool', 'copy paste repeater', 'word repeater', 'text multiplier', 'repeat text 1000 times', 'WhatsApp text repeater'],
    metaTitle: 'Text Repeater - Repeat Any Text Up to 10,000 Times Online Free',
    metaDescription: 'Repeat any text up to 10,000 times with custom separators. Line numbers, word count, instant copy. Free online text repeater — no signup required.',
    faqs: [
      { question: 'How do I repeat text 1000 times?', answer: 'Enter your text in the input box, set the repeat count to 1000, choose a separator (new line, space, comma, etc.), and the repeated text appears instantly. Click "Copy" to copy it to your clipboard.' },
      { question: 'Can I add numbers before each repeated line?', answer: 'Yes! Check the "Add line numbers" option and each repeated line will be prefixed with 1. 2. 3. and so on.' },
      { question: 'Is there a limit to how many times I can repeat?', answer: 'The tool supports up to 10,000 repetitions. This is capped to keep your browser responsive. For most use cases, 10,000 is more than sufficient.' },
      { question: 'Does this tool work on mobile?', answer: 'Yes, the text repeater works on all devices — desktop, tablet, and mobile. It runs entirely in your browser with no app download needed.' },
    ],
    howToSteps: [
      'Enter the text you want to repeat in the input box.',
      'Set the repeat count (or use a quick preset like 10x, 100x, 1000x).',
      'Choose a separator — new line, space, comma, dash, tab, or custom.',
      'Optionally enable line numbers for numbered output.',
      'Click "Copy" to copy the repeated text to your clipboard.',
    ],
    relatedToolSlugs: ['word-counter', 'lorem-ipsum-generator', 'case-converter', 'text-to-binary'],
    icon: 'Repeat',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'tax-regime-calculator',
    name: 'Old vs New Tax Regime Calculator',
    shortDescription: 'Compare Old vs New Tax Regime for FY 2025-26 and find which saves you more tax.',
    longDescription: `<p>India's most detailed <strong>Old vs New Tax Regime calculator</strong>, updated for FY 2025-26 (AY 2026-27) as per Budget 2025. Enter your gross income and deductions to instantly see which regime saves you more money.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Full Deduction Support</strong>: Enter 80C, 80D, 80CCD(1B) NPS, Section 24b home loan interest, and HRA exemption for Old Regime.</li>
<li><strong>Slab-Wise Breakdown</strong>: Visual tax slab breakdown for both regimes including surcharge and 4% cess.</li>
<li><strong>New Regime 2025-26</strong>: Reflects Rs 4L basic exemption, Rs 75K standard deduction, and 87A rebate making up to Rs 12L tax-free.</li>
<li><strong>Side-by-Side Comparison</strong>: Clear comparison cards showing tax payable under both regimes with annual and monthly savings.</li>
<li><strong>Regime Recommendation</strong>: Instant recommendation on which regime is better for your income profile.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for salaried employees deciding which regime to choose at the start of a financial year, and for anyone verifying their Form 16 or TDS deductions.</p>
<h2>Privacy & Security</h2>
<p>All calculations run in your browser instantly — no data stored, no signup required.</p>`,
    category: 'calculators',
    targetKeyword: 'old vs new tax regime calculator',
    secondaryKeywords: ['tax regime comparison calculator', 'income tax calculator 2025-26', 'which tax regime is better', 'new tax regime calculator', 'old regime vs new regime', 'tax calculator India FY 2025-26', 'income tax slab calculator'],
    metaTitle: 'Old vs New Tax Regime Calculator FY 2025-26 | Compare',
    metaDescription: 'Compare Old vs New Tax Regime for FY 2025-26. See slab-wise breakdown, deductions, and which regime saves you more. Budget 2025 updated. Free calculator.',
    faqs: [
      { question: 'Which tax regime should I choose for FY 2025-26?', answer: 'Choose the New Regime if your total deductions (80C, 80D, HRA, home loan) are less than about Rs 3-4 lakhs. The Old Regime is better if you claim significant deductions like full 80C (1.5L), 80D, HRA exemption, and home loan interest. Use our calculator for exact comparison.' },
      { question: 'Is income up to 12 lakh tax-free under new regime?', answer: 'Yes, for FY 2025-26, income up to Rs 12 lakh is effectively tax-free under the New Regime due to the enhanced rebate under Section 87A (up to Rs 60,000). After the Rs 75,000 standard deduction, this applies to gross income up to approximately Rs 12.75 lakh.' },
      { question: 'Can I switch between old and new regime every year?', answer: 'Salaried individuals can switch between regimes every financial year. However, business owners who opt for the Old Regime can switch to New only once (and cannot switch back). The New Regime is the default from FY 2023-24.' },
      { question: 'What deductions are not available under the new regime?', answer: 'The New Regime does not allow deductions under Sections 80C, 80D, 80CCD(1B), HRA exemption, LTA, home loan interest (Section 24b), and most Chapter VIA deductions. Only the standard deduction of Rs 75,000 and employer NPS contribution (Section 80CCD(2)) are available.' },
    ],
    howToSteps: [
      'Enter your annual gross income (total salary before deductions).',
      'Enter your basic salary and HRA received for HRA exemption calculation.',
      'Fill in Old Regime deductions: 80C, 80D, NPS, home loan interest, monthly rent.',
      'View side-by-side comparison of tax payable under both regimes.',
      'Check which regime is recommended and how much you save annually and monthly.',
    ],
    relatedToolSlugs: ['salary-calculator', 'emi-calculator', 'gst-calculator', 'percentage-calculator'],
    icon: 'Scale',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'color-palette-from-image',
    name: 'Color Palette from Image',
    shortDescription: 'Extract dominant colors from any image. Get HEX, RGB, HSL codes with one click.',
    longDescription: `<p>Upload any image and instantly extract its dominant <strong>color palette</strong> using an advanced k-means clustering algorithm. Get 4 to 12 dominant colors with HEX, RGB, and HSL values plus the percentage each color represents.</p>
<h2>Key Features</h2>
<ul>
<li><strong>K-Means Clustering</strong>: Samples ~10,000 pixels to accurately identify the most dominant colors in your image.</li>
<li><strong>HEX, RGB & HSL Values</strong>: Every color shows all three formats — click to copy HEX instantly.</li>
<li><strong>Proportional Palette Strip</strong>: Visual strip showing colors sized by their percentage in the image.</li>
<li><strong>CSS Export</strong>: Copy all colors as CSS custom properties (--color-1, --color-2) ready for your stylesheet.</li>
<li><strong>Adjustable Count</strong>: Extract 4, 6, 8, 10, or 12 colors depending on your needs.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for designers matching colors from reference images, developers building color schemes, and brand teams extracting palette colors from logos or photography.</p>
<h2>Privacy & Security</h2>
<p>Runs entirely in your browser using HTML5 Canvas — no image is ever uploaded to any server.</p>`,
    category: 'image-tools',
    targetKeyword: 'color palette from image',
    secondaryKeywords: ['extract colors from image', 'image color picker', 'color palette generator', 'get colors from photo', 'image to color palette', 'dominant colors from image', 'color scheme from photo'],
    metaTitle: 'Color Palette from Image - Extract Dominant Colors Online Free',
    metaDescription: 'Extract dominant colors from any image. Get HEX, RGB, HSL codes. Copy colors & export as CSS. Free online color palette generator — runs in your browser.',
    faqs: [
      { question: 'How does color extraction work?', answer: 'The tool uses a k-means clustering algorithm to group similar pixels in the image. It samples ~10,000 pixels, quantizes them to reduce noise, and then clusters them into the number of colors you select (4-12). The centroid of each cluster becomes a color in your palette.' },
      { question: 'Is my image uploaded to a server?', answer: 'No. The entire process runs in your browser using HTML5 Canvas. Your image never leaves your device. This ensures complete privacy and fast processing.' },
      { question: 'What image formats are supported?', answer: 'PNG, JPG/JPEG, and WEBP images are supported. The tool can handle high-resolution images — they are automatically scaled down for processing while maintaining color accuracy.' },
      { question: 'Can I use the extracted colors in my CSS?', answer: 'Yes! Click "Copy CSS" to get all colors as CSS custom properties (--color-1, --color-2, etc.) ready to paste into your stylesheet. You can also click individual colors to copy their HEX codes.' },
    ],
    howToSteps: [
      'Upload an image by clicking or dragging a file (PNG, JPG, WEBP).',
      'The tool automatically extracts the dominant colors.',
      'Adjust the number of colors (4, 6, 8, 10, or 12) using the buttons.',
      'Click any color to copy its HEX code to your clipboard.',
      'Export all colors as CSS variables using the "Copy CSS" button.',
    ],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'webp-to-png', 'hex-to-rgb'],
    icon: 'Palette',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'meme-generator',
    name: 'Meme Generator',
    shortDescription: 'Create memes with custom text, fonts, and colors. Upload image or use blank canvas.',
    longDescription: `<p>Create hilarious memes in seconds with our free online <strong>Meme Generator</strong>. Upload any image or use a blank colored canvas, then add multiple text layers with full customization and drag-and-drop positioning.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Multiple Text Layers</strong>: Add as many text layers as you need, each independently styled and positioned.</li>
<li><strong>Full Customization</strong>: Adjust font size, fill color, stroke color, and bold styling for each text layer.</li>
<li><strong>Classic Meme Look</strong>: Impact font with white fill and black stroke pre-configured for the iconic meme style.</li>
<li><strong>Drag & Drop</strong>: Click and drag text directly on the canvas to position it exactly where you want.</li>
<li><strong>No Watermark</strong>: Download high-quality PNG memes with no branding or watermark.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for creating memes for social media, WhatsApp groups, Instagram stories, and Twitter posts — with no app download needed.</p>
<h2>Privacy & Security</h2>
<p>Everything runs in your browser — no signup, no limits, no uploads.</p>`,
    category: 'image-tools',
    targetKeyword: 'meme generator',
    secondaryKeywords: ['meme maker online', 'free meme generator', 'create meme', 'meme creator', 'custom meme maker', 'meme generator no watermark', 'WhatsApp meme maker'],
    metaTitle: 'Meme Generator - Create Custom Memes Online Free | No Watermark',
    metaDescription: 'Create memes with custom text, colors & fonts. Upload any image, add multiple text layers, drag to position. Free meme generator — no watermark, no signup.',
    faqs: [
      { question: 'Can I upload my own image for a meme?', answer: 'Yes! Click "Upload Image" to use any photo from your device. The tool supports PNG, JPG, and WEBP formats. You can also create memes on a solid color background without uploading an image.' },
      { question: 'How do I move text on the meme?', answer: 'Click and drag the text directly on the canvas to reposition it. You can also click a text layer in the sidebar to select it, then drag it to the desired position.' },
      { question: 'Is there a watermark on downloaded memes?', answer: 'No. Memes downloaded from our tool have no watermark, no branding, and no limitations. The downloaded PNG is exactly what you see on screen.' },
      { question: 'Can I add more than two text lines?', answer: 'Yes! Click "Add Text" to add as many text layers as you want. Each layer has independent font size, color, stroke, and positioning.' },
    ],
    howToSteps: [
      'Upload an image or set a canvas background color and size.',
      'Edit the default top and bottom text, or add new text layers.',
      'Customize font size, fill color, and stroke color for each text.',
      'Drag text on the canvas to position it exactly where you want.',
      'Click "Download Meme" to save your creation as a PNG image.',
    ],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'photo-collage-maker', 'color-palette-from-image'],
    icon: 'Smile',
    isPopular: true,
    isNew: true,
    estimatedTime: '1 minute',
  },
  {
    slug: 'image-to-text',
    name: 'Image to Text (OCR)',
    shortDescription: 'Extract text from images using OCR. Supports 18+ languages including Hindi, Tamil, Bengali.',
    longDescription: `<p>Extract text from any image using powerful <strong>OCR (Optical Character Recognition)</strong> powered by Tesseract.js. Upload a photo, screenshot, scanned document, or handwritten note and get the text instantly.</p>
<h2>Key Features</h2>
<ul>
<li><strong>18+ Languages</strong>: English, Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati, Malayalam, Punjabi, Urdu, Arabic, French, German, Spanish, Japanese, Korean, and Chinese.</li>
<li><strong>Browser-Based OCR</strong>: Tesseract.js runs entirely in your browser — no image ever leaves your device.</li>
<li><strong>Progress Tracking</strong>: Real-time progress bar shows OCR processing status.</li>
<li><strong>Copy & Download</strong>: Copy extracted text to clipboard or download as a .txt file.</li>
<li><strong>Word & Character Count</strong>: Instant count of extracted words and characters.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for digitizing printed documents, extracting text from screenshots, converting scanned PDFs to editable text, and processing images with Indian regional language text.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your images are never uploaded to any server, ensuring complete privacy.</p>`,
    category: 'image-tools',
    targetKeyword: 'image to text',
    secondaryKeywords: ['OCR online', 'image to text converter', 'extract text from image', 'photo to text', 'OCR Hindi', 'scan image to text', 'picture to text converter', 'handwriting to text'],
    metaTitle: 'Image to Text (OCR) - Extract Text from Images | 18+ Languages',
    metaDescription: 'Extract text from images using free OCR. Supports Hindi, Tamil, Bengali & 15+ languages. Upload photo, get text instantly. 100% private — runs in browser.',
    faqs: [
      { question: 'How accurate is the OCR?', answer: 'Accuracy depends on image quality. Clear, high-resolution images with printed text achieve 95-99% accuracy. Handwritten text, low resolution, or blurry images may have lower accuracy. Selecting the correct language significantly improves results.' },
      { question: 'Is my image uploaded to a server?', answer: 'No. The OCR engine (Tesseract.js) runs entirely in your browser. Your images never leave your device. The language model files are downloaded once from CDN and cached locally.' },
      { question: 'Can I extract Hindi or regional language text?', answer: 'Yes! Select the appropriate language from the dropdown. Supported Indian languages: Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati, Malayalam, Punjabi, and Urdu. The tool downloads the language-specific model for accurate recognition.' },
      { question: 'Does it work with handwritten text?', answer: 'The tool can recognize clear handwriting with moderate accuracy. Printed text works best. For handwritten notes, ensure the writing is dark, well-spaced, and the image has good contrast.' },
    ],
    howToSteps: [
      'Select the language of the text in your image.',
      'Upload an image by clicking or dragging (PNG, JPG, WEBP, BMP, TIFF).',
      'Wait for the OCR engine to process — progress bar shows status.',
      'Review the extracted text in the output panel.',
      'Copy the text to clipboard or download as a .txt file.',
    ],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'pdf-to-image', 'word-counter'],
    icon: 'FileText',
    isPopular: true,
    isNew: true,
    estimatedTime: '10-30 seconds',
  },
  {
    slug: 'photo-collage-maker',
    name: 'Photo Collage Maker',
    shortDescription: 'Create stunning photo collages with 10 layouts, custom borders, and social media sizes.',
    longDescription: `<p>Create beautiful photo collages in seconds with our free online <strong>photo collage maker</strong>. Choose from 10 professionally designed layouts — 2-photo splits, 3-photo focus layouts, 4/6/9 grids, and asymmetric designs. Upload your photos and they automatically fill the layout cells.</p>
<h2>Key Features</h2>
<ul>
<li><strong>10 Layouts</strong>: Choose from 2-cell to 9-cell grids, splits, and asymmetric designs for varied compositions.</li>
<li><strong>Social Media Sizes</strong>: Preset sizes for Instagram Post (1080x1080), Instagram Story (1080x1920), Facebook Cover, HD landscape, and more.</li>
<li><strong>Customizable Borders</strong>: Adjust border width (0-14px), corner radius, and background color.</li>
<li><strong>Auto Center-Crop</strong>: Photos are automatically center-cropped to fill cells regardless of original dimensions.</li>
<li><strong>Real-Time Preview</strong>: See changes live as you adjust layouts and settings.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for social media creators, families making photo albums, event photographers, and anyone needing before/after comparisons or creative collage projects.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no watermark, no signup, no limits, and photos never leave your device.</p>`,
    category: 'image-tools',
    targetKeyword: 'photo collage maker',
    secondaryKeywords: ['collage maker online', 'photo grid maker', 'Instagram collage maker', 'free collage maker', 'photo collage generator', 'picture collage online', 'grid photo maker'],
    metaTitle: 'Photo Collage Maker - 10 Layouts, Custom Borders | Free Online',
    metaDescription: 'Create photo collages with 10 layouts, custom borders & social media sizes. Instagram, Facebook, HD presets. Free online collage maker — no watermark.',
    faqs: [
      { question: 'How many photos can I add to a collage?', answer: 'You can add any number of photos. The layout determines how many cells are displayed (2-9). If you add more photos than cells, extra photos cycle through the cells. If fewer, photos are repeated to fill all cells.' },
      { question: 'What output sizes are available?', answer: 'Preset sizes include: Instagram Post (1080x1080), Instagram Story (1080x1920), Facebook Cover (820x312), HD landscape (1920x1080), Square (1000x1000), and A4 Landscape (1123x794). The downloaded PNG matches the selected size exactly.' },
      { question: 'Are my photos uploaded to a server?', answer: 'No. All processing happens in your browser using HTML5 Canvas. Your photos never leave your device. This ensures complete privacy and fast processing.' },
      { question: 'Can I customize the border between photos?', answer: 'Yes! Adjust border width from 0 to 14 pixels, set corner radius for rounded edges, and choose from 8 background colors (visible between photo cells).' },
    ],
    howToSteps: [
      'Click "Add Photos" to upload multiple images from your device.',
      'Select a layout from the 10 available options (2 to 9 cells).',
      'Choose an output size preset (Instagram, Facebook, HD, etc.).',
      'Customize border width, corner radius, and background color.',
      'Click "Download Collage" to save your creation as a PNG image.',
    ],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'meme-generator', 'passport-photo-maker'],
    icon: 'LayoutGrid',
    isPopular: true,
    isNew: true,
    estimatedTime: '1 minute',
  },
  {
    slug: 'compress-image-to-kb',
    name: 'Compress Image to KB',
    shortDescription: 'Compress any image to an exact target file size in KB — 50 KB, 100 KB, 200 KB, or any custom size.',
    longDescription: `<p>Compress any image to an <strong>exact target file size in KB</strong> with our free online tool. Need exactly 50 KB, 100 KB, or 200 KB for a form, application, or email? Our smart binary search algorithm finds the perfect JPEG quality setting for your target.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Binary Search Compression</strong>: Iterates up to 20 quality levels to find the closest match to your target KB.</li>
<li><strong>Custom Target Size</strong>: Enter any KB value — 50 KB, 100 KB, 200 KB, or any custom size.</li>
<li><strong>Detailed Results</strong>: Shows resulting file size, JPEG quality used, compression percentage, and iteration count.</li>
<li><strong>Multiple Input Formats</strong>: Accepts JPG, PNG, and WebP images.</li>
<li><strong>Instant Download</strong>: Download the compressed image with one click.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for government form uploads, job applications, passport photo submissions, and any scenario where an exact file size limit is enforced.</p>
<h2>Privacy & Security</h2>
<p>All processing happens in your browser using HTML5 Canvas — your images are never uploaded to any server. No watermarks, no signup, no limits.</p>`,
    category: 'image-tools',
    targetKeyword: 'compress image to kb',
    secondaryKeywords: ['compress image to 50kb', 'compress image to 100kb', 'compress image to 200kb', 'reduce image to exact size', 'image size reducer kb', 'compress photo to kb online', 'resize image to kb'],
    metaTitle: 'Compress Image to Exact KB Size — 50KB, 100KB, 200KB | Free Online',
    metaDescription: 'Compress any image to an exact file size in KB. Target 50KB, 100KB, 200KB or custom. Free online tool — no watermark, no upload, privacy-first.',
    faqs: [
      { question: 'How accurate is the target file size?', answer: 'The tool uses binary search with up to 20 iterations to find the JPEG quality that produces a file size within 1% of your target. In most cases, the result is within a few KB of the target.' },
      { question: 'What image formats are supported?', answer: 'You can upload JPG, PNG, and WebP images. The compressed output is always in JPEG format since JPEG allows quality-based compression for precise file size control.' },
      { question: 'Why is the output always JPEG?', answer: 'JPEG compression allows fine-grained quality control (1-100%), making it possible to target a specific file size. PNG uses lossless compression and does not support quality-based size targeting.' },
      { question: 'What if my target size is too small?', answer: 'If the target is very small (e.g., 5 KB for a large image), the tool will compress to the lowest possible quality. The result may be visually degraded but will be as close to the target as possible.' },
      { question: 'Are my images uploaded to a server?', answer: 'No. All compression happens in your browser using the Canvas API. Your images never leave your device, ensuring complete privacy.' },
    ],
    howToSteps: [
      'Upload an image by dragging and dropping or clicking the upload area.',
      'Enter your desired target file size in KB (e.g., 50, 100, 200).',
      'Click "Compress" to start the binary search compression.',
      'View the result: compressed size, quality used, reduction percentage, and iterations.',
      'Download the compressed image with one click.',
    ],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'png-to-jpg', 'jpg-to-png', 'passport-photo-maker'],
    icon: 'ImageDown',
    isPopular: true,
    isNew: true,
    estimatedTime: '3-10 seconds',
  },
  {
    slug: 'paraphrasing-tool',
    name: 'Paraphrasing Tool',
    shortDescription: 'Rewrite text in 6 styles — Standard, Formal, Casual, Shorter, Longer, Creative.',
    longDescription: `<p>Paraphrase and rewrite your text in 6 different styles with our free online <strong>Paraphrasing Tool</strong>. Choose Standard, Formal, Casual, Shorter, Longer, or Creative mode to instantly transform your writing.</p>
<h2>Key Features</h2>
<ul>
<li><strong>6 Rewriting Modes</strong>: Standard (clear rewording), Formal (professional tone), Casual (friendly & simple), Shorter (concise), Longer (expanded), Creative (unique phrasing).</li>
<li><strong>Intelligent Transformations</strong>: Context-aware synonym replacement, contraction handling, passive voice reduction, and filler word removal.</li>
<li><strong>Word Count Comparison</strong>: Live word count for both original and paraphrased text with percentage change indicator.</li>
<li><strong>Instant Mode Switching</strong>: Toggle between all 6 modes without re-entering your text.</li>
<li><strong>Copy to Clipboard</strong>: One-click copy of the rewritten output.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for students rewriting essays, professionals improving emails, content writers creating unique versions, and anyone needing to express the same idea in different words.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your text is never sent to any server.</p>`,
    category: 'text-tools',
    targetKeyword: 'paraphrasing tool',
    secondaryKeywords: ['paraphrase online', 'text rewriter', 'sentence rewriter', 'rephrase tool', 'paraphrasing tool free', 'reword text online', 'text paraphraser'],
    metaTitle: 'Paraphrasing Tool - Rewrite Text in 6 Styles | Free Online',
    metaDescription: 'Paraphrase text in 6 styles: Standard, Formal, Casual, Shorter, Longer, Creative. Free online paraphrasing tool — instant results, no signup required.',
    faqs: [
      { question: 'How does the paraphrasing tool work?', answer: 'The tool uses an intelligent synonym replacement engine with mode-specific transformations. It identifies words that have synonyms and replaces them based on context and the selected mode. Formal/Casual modes also apply tone-specific word swaps.' },
      { question: 'Is this tool free to use?', answer: 'Yes, completely free with no limits on usage. No signup or account required. The tool runs entirely in your browser, so your text is never sent to any server.' },
      { question: 'Which mode should I use?', answer: 'Standard for general rewording, Formal for business/academic writing, Casual for social media/messages, Shorter to reduce word count, Longer to expand ideas, and Creative for unique phrasing. Try different modes to find the best fit.' },
      { question: 'Is the paraphrased text plagiarism-free?', answer: 'The tool rewrites text by replacing words with synonyms and restructuring sentences. While it creates different versions of the original text, you should always review the output and make further adjustments for important submissions.' },
    ],
    howToSteps: [
      'Enter or paste your text in the input box.',
      'Select a paraphrasing mode: Standard, Formal, Casual, Shorter, Longer, or Creative.',
      'The paraphrased text appears instantly in the output panel.',
      'Compare word counts between original and paraphrased versions.',
      'Click "Copy Result" to copy the paraphrased text to your clipboard.',
    ],
    relatedToolSlugs: ['reading-time-calculator', 'word-counter', 'case-converter', 'ai-text-humanizer', 'lorem-ipsum-generator'],
    icon: 'Wand2',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'ai-text-humanizer',
    name: 'AI Text Humanizer',
    shortDescription: 'Make AI-generated text sound natural and human-written. Bypass AI detectors instantly.',
    longDescription: `<p>Transform robotic AI-generated text into natural, human-sounding content with our free <strong>AI Text Humanizer</strong>. Restructure ChatGPT, Gemini, or Claude output to sound authentic and bypass AI detection tools.</p>
<h2>Key Features</h2>
<ul>
<li><strong>7 Transformations</strong>: Adds contractions, replaces overused AI phrases, varies sentence length, injects conversational transitions, removes robotic patterns, adds personal touches, and reduces passive voice.</li>
<li><strong>4 Intensity Levels</strong>: Light, Medium, Heavy, and Aggressive — control how much your text changes.</li>
<li><strong>AI Detection Score</strong>: Built-in visual meter estimates how "AI-like" or "human-like" your text sounds before and after humanizing.</li>
<li><strong>Bypass AI Detectors</strong>: Reduces patterns that tools like GPTZero, Turnitin, and Originality.ai look for.</li>
<li><strong>No Limits</strong>: Process any amount of text — no word caps, no signup, no watermarks.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for students, bloggers, content writers, and professionals who use AI writing tools but want the final output to read naturally and authentically.</p>
<h2>Privacy & Security</h2>
<p>Processes text 100% in your browser — nothing is sent to any server, your content stays completely private.</p>`,
    category: 'text-tools',
    targetKeyword: 'AI text humanizer',
    secondaryKeywords: ['humanize AI text', 'AI to human text converter', 'bypass AI detection', 'make AI text human', 'AI humanizer free', 'ChatGPT humanizer', 'undetectable AI text', 'AI text converter'],
    metaTitle: 'AI Text Humanizer - Make AI Text Sound Human | Free Online',
    metaDescription: 'Humanize AI-generated text instantly. Make ChatGPT, Gemini & Claude content sound natural and bypass AI detectors. Free, private — no signup needed.',
    faqs: [
      { question: 'How does the AI Text Humanizer work?', answer: 'The tool applies multiple transformation layers: replacing overused AI phrases, adding natural contractions, varying sentence structure, injecting conversational elements, reducing passive voice, and removing robotic patterns. These changes make the text read more naturally while preserving the original meaning.' },
      { question: 'Will humanized text pass AI detection tools?', answer: 'The tool significantly reduces AI detection scores by removing common patterns that detectors look for. However, no tool can guarantee 100% bypass rates. We recommend using the Medium or Heavy mode and reviewing the output for best results.' },
      { question: 'Does it change the meaning of my text?', answer: 'The tool preserves the core meaning while changing how it is expressed. Light mode makes minimal changes, while Aggressive mode restructures more heavily. Always review the output to ensure accuracy for important content.' },
      { question: 'Is this free and private?', answer: 'Yes, 100% free with no usage limits, no signup, and no watermarks. All processing happens in your browser — your text is never sent to any server, ensuring complete privacy.' },
      { question: 'Which AI-generated text does it work with?', answer: 'It works with text from any AI tool — ChatGPT, GPT-4, Gemini, Claude, Jasper, Copy.ai, and others. The humanizer targets common patterns shared across all AI language models.' },
    ],
    howToSteps: [
      'Paste your AI-generated text in the input box.',
      'Select the humanization intensity — Light, Medium, Heavy, or Aggressive.',
      'The humanized text appears instantly in the output panel.',
      'Check the AI Detection Score meter to see how human your text sounds.',
      'Click "Copy Humanized Text" to copy the result to your clipboard.',
    ],
    relatedToolSlugs: ['paraphrasing-tool', 'word-counter', 'case-converter', 'text-to-speech'],
    icon: 'UserCheck',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'ats-resume-checker',
    name: 'ATS Resume Score Checker',
    shortDescription: 'Check your resume against a job description and get an ATS compatibility score with actionable tips.',
    longDescription: `<p>Check how well your resume matches a job description with our free <strong>ATS Resume Score Checker</strong>. Get an instant ATS compatibility score out of 100 with detailed breakdown across 5 key dimensions.</p>
<h2>Key Features</h2>
<ul>
<li><strong>5-Dimension Score</strong>: Keyword match (35%), section detection (20%), action verbs (15%), quantifiable metrics (15%), and formatting (15%).</li>
<li><strong>Keyword Analysis</strong>: Color-coded chips showing which job description keywords are present or missing in your resume.</li>
<li><strong>Section Checklist</strong>: Scans for Contact Info, Summary, Experience, Education, Skills, and Certifications.</li>
<li><strong>Personalized Suggestions</strong>: 5-8 actionable tips to improve your ATS score based on your specific gaps.</li>
<li><strong>Copy Report</strong>: Copy your full analysis report with one click for easy sharing.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for job seekers, career changers, and anyone applying to competitive roles who wants to ensure their resume passes automated screening systems.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your resume is never uploaded, stored, or sent to any server.</p>`,
    category: 'text-tools',
    targetKeyword: 'ATS resume checker',
    secondaryKeywords: ['ATS score checker', 'resume ATS score', 'ATS resume scanner', 'resume keyword checker', 'ATS friendly resume checker', 'resume score checker free', 'ATS compatibility checker'],
    metaTitle: 'ATS Resume Score Checker - Free Resume ATS Compatibility Test',
    metaDescription: 'Check your resume ATS score free. Compare resume vs job description, find missing keywords, get section checklist & actionable tips. 100% private — runs in your browser.',
    faqs: [
      { question: 'What is an ATS and why does it matter?', answer: 'An Applicant Tracking System (ATS) is software used by employers to filter resumes before a human reviews them. Over 75% of large companies use ATS. If your resume is not optimized for ATS, it may be rejected automatically — even if you are qualified for the role.' },
      { question: 'How does the ATS score work?', answer: 'The score is a weighted average of 5 dimensions: keyword match (35%), section detection (20%), action verbs (15%), quantification (15%), and formatting (15%). A score of 71+ is considered good, 41-70 needs improvement, and below 40 is poor.' },
      { question: 'Is my resume data safe?', answer: 'Yes, 100%. All analysis runs entirely in your browser using JavaScript. Your resume text is never sent to any server, never stored, and never shared. You can verify this in your browser developer tools — no network requests are made during analysis.' },
      { question: 'Should I paste my resume as plain text?', answer: 'Yes. Copy the text content of your resume and paste it into the input box. The tool analyzes text content, not PDF formatting. Most ATS systems also parse resumes as plain text, so this gives you the most accurate assessment.' },
      { question: 'How can I improve a low score?', answer: 'Focus on the suggestions panel. The most impactful improvements are: adding missing keywords from the job description, ensuring all standard sections are present (especially Skills), using strong action verbs, and including quantifiable metrics (numbers, percentages, dollar amounts) in your experience bullets.' },
    ],
    howToSteps: [
      'Paste your resume text in the left panel.',
      'Paste the target job description in the right panel.',
      'Click "Analyze Resume" to get your ATS score.',
      'Review the score breakdown, keyword analysis, and section checklist.',
      'Follow the personalized suggestions to improve your score.',
      'Click "Copy Report" to save or share your results.',
    ],
    relatedToolSlugs: ['word-counter', 'ai-text-humanizer', 'case-converter', 'paraphrasing-tool'],
    icon: 'FileSearch',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  // ─── NEW BATCH: Finance, Utility & Lifestyle Tools ──────────────────────────
  {
    slug: 'rent-receipt-generator',
    name: 'Rent Receipt Generator',
    shortDescription: 'Generate HRA rent receipts for tax saving with PDF download.',
    longDescription: `<p>Generate professional <strong>rent receipts for HRA tax exemption</strong> instantly. Enter your rental details once and download all monthly receipts as a single PDF — ready to submit to your employer.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Bulk Generation</strong>: Create receipts for any period — monthly, quarterly, or a full financial year — in one click.</li>
<li><strong>Complete Details</strong>: Each receipt includes unique receipt number, date, amount in words, payment mode, and space for landlord signature and revenue stamp.</li>
<li><strong>PAN Warning</strong>: Automatically alerts when annual rent exceeds ₹1,00,000 (landlord PAN required for HRA claim).</li>
<li><strong>PDF Download</strong>: All receipts bundled into a single PDF file ready for employer submission.</li>
<li><strong>Section 10(13A) Ready</strong>: Complies with Income Tax Act requirements for HRA exemption claims.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for salaried employees who pay rent and need to claim HRA exemption from their employer's TDS deductions.</p>
<h2>Privacy & Security</h2>
<p>100% free, no signup — works offline in your browser with no data sent to any server.</p>`,
    category: 'utility-tools',
    targetKeyword: 'rent receipt generator',
    secondaryKeywords: ['rent receipt generator online', 'HRA rent receipt', 'house rent receipt PDF', 'rent receipt for income tax', 'rent receipt format India', 'free rent receipt generator'],
    metaTitle: 'Rent Receipt Generator - Free HRA Receipt PDF Download',
    metaDescription: 'Generate rent receipts for HRA tax exemption instantly. Free PDF download with revenue stamp, landlord PAN. Rent receipt generator India — no signup needed.',
    faqs: [
      { question: 'Why do I need rent receipts?', answer: 'Rent receipts are required to claim HRA (House Rent Allowance) exemption under Section 10(13A) of the Income Tax Act. Your employer needs these receipts to adjust TDS on your salary.' },
      { question: 'Is landlord PAN mandatory on rent receipts?', answer: 'Yes, if your annual rent exceeds ₹1,00,000 (₹1 lakh), you must provide your landlord\'s PAN card number to claim HRA exemption.' },
      { question: 'Do I need a revenue stamp on rent receipts?', answer: 'A ₹1 revenue stamp is required on rent receipts for cash payments above ₹5,000 as per the Indian Stamp Act. For digital payments (UPI/bank transfer), it is not mandatory but recommended.' },
      { question: 'Can I claim HRA without rent receipts?', answer: 'For rent up to ₹3,000/month, rent receipts are not mandatory. However, for higher amounts, your employer will require rent receipts and a rent agreement for processing HRA exemption.' },
      { question: 'Does this tool store my data?', answer: 'No. All data is processed in your browser. Nothing is sent to any server. Your personal information remains completely private.' },
    ],
    howToSteps: [
      'Enter tenant name (your name) and rented property address.',
      'Enter landlord name and PAN (if annual rent exceeds ₹1 lakh).',
      'Set monthly rent amount, date range, and payment mode.',
      'Click "Generate Receipts" to create all monthly receipts.',
      'Download all receipts as a single PDF file for submission.',
    ],
    relatedToolSlugs: ['hra-calculator', 'salary-calculator', 'tax-regime-calculator', 'invoice-generator'],
    icon: 'Receipt',
    isNew: true,
    estimatedTime: 'Under 1 min',
  },
  {
    slug: 'salary-slip-generator',
    name: 'Salary Slip Generator',
    shortDescription: 'Generate professional salary slips / payslips with earnings, deductions & net pay. Download as PNG or PDF.',
    longDescription: `<p>Create professional <strong>salary slips (payslips)</strong> instantly with our free Salary Slip Generator. Fill in company details, employee information, earnings, and deductions — then download a clean payslip as PNG or PDF.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Auto-Calculation</strong>: HRA (40% or 50% of basic) and PF (12% of basic) calculated automatically with custom override option.</li>
<li><strong>Standard Components</strong>: Basic Salary, HRA, Conveyance Allowance, Medical Allowance, Special Allowance, Professional Tax, TDS, and ESI.</li>
<li><strong>Company Logo</strong>: Upload your logo (PNG, JPG, SVG) to include in the payslip header.</li>
<li><strong>Custom Line Items</strong>: Add any custom earnings or deductions beyond the standard fields.</li>
<li><strong>Live Preview</strong>: See the final payslip update in real time as you enter details.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for HR departments, small businesses, startups, and freelancers who need to generate clean, professional monthly payslips quickly.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no data sent to any server. Your salary and company information stays completely private.</p>`,
    category: 'utility-tools',
    targetKeyword: 'salary slip generator',
    secondaryKeywords: ['salary slip generator online', 'payslip generator free', 'salary slip format PDF', 'salary slip maker', 'pay slip download', 'salary slip template India'],
    metaTitle: 'Salary Slip Generator - Free Payslip Maker | Download PNG & PDF',
    metaDescription: 'Generate professional salary slips online for free. Add earnings, deductions, company logo & download as PNG or PDF. No signup required — 100% private.',
    faqs: [
      { question: 'Is this salary slip generator free?', answer: 'Yes, completely free with no signup required. Generate unlimited salary slips and download them as PNG or PDF.' },
      { question: 'Is my salary data safe?', answer: 'Absolutely. Everything runs in your browser. No data is sent to any server — your salary details, employee information, and company data remain 100% private.' },
      { question: 'What is HRA and how is it calculated?', answer: 'HRA (House Rent Allowance) is a salary component for rental expenses. It is typically 50% of basic salary for metro cities or 40% for non-metro cities. You can also enter a custom amount.' },
      { question: 'What is PF deduction?', answer: 'PF (Provident Fund) is a retirement savings deduction. The standard employee contribution is 12% of basic salary. You can override this with a custom amount.' },
      { question: 'Can I add a company logo?', answer: 'Yes, you can upload your company logo (PNG, JPG, SVG) and it will appear on the salary slip header.' },
      { question: 'Can I add custom earnings or deductions?', answer: 'Yes, each section has an "Other" field where you can add a custom label and amount for any additional earning or deduction.' },
    ],
    howToSteps: [
      'Enter your company name, address, and optionally upload a logo.',
      'Fill in employee details — name, ID, designation, department, PAN, and bank account.',
      'Select the pay period (month and year).',
      'Enter earnings — basic salary, HRA (auto or custom), allowances, and any other earnings.',
      'Enter deductions — PF (auto or custom), professional tax, TDS, ESI, and any other deductions.',
      'Review the live preview on the right side.',
      'Click "Download PNG" or "Download PDF" to save your salary slip.',
    ],
    relatedToolSlugs: ['invoice-generator', 'rent-receipt-generator', 'hra-calculator', 'salary-calculator', 'tax-regime-calculator'],
    icon: 'FileText',
    isNew: true,
    estimatedTime: 'Under 2 min',
  },
  {
    slug: 'whatsapp-link-generator',
    name: 'WhatsApp Link Generator',
    shortDescription: 'Create click-to-chat WhatsApp links with pre-filled messages instantly.',
    longDescription: `<p>Generate <strong>WhatsApp click-to-chat links (wa.me)</strong> that let anyone message you without saving your number. Perfect for businesses, freelancers, and social media profiles.</p>
<h2>Key Features</h2>
<ul>
<li><strong>wa.me Link</strong>: Instant WhatsApp chat link with optional pre-filled message — URL-encoded automatically.</li>
<li><strong>QR Code</strong>: Generate a QR code for your WhatsApp link to use on business cards and print materials.</li>
<li><strong>HTML Button Code</strong>: Ready-to-use HTML code for a WhatsApp chat button on your website.</li>
<li><strong>20+ Country Codes</strong>: India (+91), USA (+1), UK (+44), UAE (+971), and more.</li>
<li><strong>Quick Templates</strong>: Pre-built message templates for order inquiries, appointments, support, and price quotes.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for e-commerce stores, customer support teams, freelancers, and anyone adding WhatsApp to their Instagram bio, Facebook page, or website.</p>
<h2>Privacy & Security</h2>
<p>No data stored — your phone number and messages are never sent to any server.</p>`,
    category: 'utility-tools',
    targetKeyword: 'WhatsApp link generator',
    secondaryKeywords: ['wa.me link generator', 'WhatsApp chat link', 'click to chat WhatsApp', 'WhatsApp direct message link', 'WhatsApp link for website', 'WhatsApp QR code generator', 'WhatsApp link generator online', 'create WhatsApp link', 'WhatsApp link for Instagram bio', 'WhatsApp business link generator'],
    metaTitle: 'WhatsApp Link Generator - Create wa.me Chat Links Free Online',
    metaDescription: 'Create WhatsApp click-to-chat links instantly. Generate wa.me links with pre-filled messages, QR codes & HTML buttons. Free — perfect for Instagram bio & websites.',
    faqs: [
      { question: 'What is a wa.me link?', answer: 'wa.me is WhatsApp\'s official short link service. A link like wa.me/919876543210 opens a WhatsApp chat with that number directly, without the sender needing to save the number first.' },
      { question: 'Can I add a pre-filled message?', answer: 'Yes! Add ?text=YourMessage to the link. Our tool does this automatically — just type your message and it will be URL-encoded and appended to the link.' },
      { question: 'Does the recipient need to have my number saved?', answer: 'No. That\'s the main benefit of wa.me links — anyone can message you by clicking the link without saving your contact first.' },
      { question: 'Can I use this for business?', answer: 'Absolutely! WhatsApp links are perfect for e-commerce, customer support, appointment booking, and lead generation. Add the link to your website, social media bios, or Google My Business profile.' },
      { question: 'How do I add a WhatsApp button to my website?', answer: 'Our tool generates ready-to-use HTML code for a WhatsApp chat button. Simply copy the HTML code and paste it into your website\'s source code.' },
    ],
    howToSteps: [
      'Select your country code (India +91 is default).',
      'Enter the phone number without leading zero.',
      'Optionally add a pre-filled message or use a quick template.',
      'Copy the generated wa.me link or API link.',
      'Use the QR code for print materials or copy the HTML button code for websites.',
    ],
    relatedToolSlugs: ['qr-code-generator', 'fancy-text-generator', 'meta-tag-generator'],
    icon: 'MessageCircle',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'gratuity-calculator',
    name: 'Gratuity Calculator India',
    shortDescription: 'Calculate gratuity amount under the Payment of Gratuity Act, 1972.',
    longDescription: `<p>Calculate your <strong>gratuity entitlement</strong> as per India's Payment of Gratuity Act, 1972. Enter your basic salary, dearness allowance, and years of service for an instant, accurate calculation.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Both Categories</strong>: Supports employees covered under the Act (divisor 26) and those not covered (divisor 30).</li>
<li><strong>Auto Rounding</strong>: Automatically rounds up service years when the last year exceeds 6 months, as per Act rules.</li>
<li><strong>Tax Breakdown</strong>: Shows exempt vs taxable portions — gratuity up to ₹20 lakh is tax-free under the Act.</li>
<li><strong>Visual Tax Bar</strong>: Clear visual showing how much of your gratuity is tax-free.</li>
<li><strong>Quick Presets</strong>: Common salary-tenure presets for instant estimates.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for employees nearing retirement or resignation who want to verify their gratuity entitlement before leaving a job.</p>
<h2>Privacy & Security</h2>
<p>All calculations run instantly in your browser — no data stored, no signup required.</p>`,
    category: 'calculators',
    targetKeyword: 'gratuity calculator',
    secondaryKeywords: ['gratuity calculator India', 'gratuity calculation formula', 'gratuity amount calculator', 'payment of gratuity act calculator', 'gratuity tax exemption calculator'],
    metaTitle: 'Gratuity Calculator India - Calculate Gratuity Online Free',
    metaDescription: 'Calculate gratuity under Payment of Gratuity Act, 1972. Free gratuity calculator India with tax exemption breakdown. Instant results for covered & non-covered employees.',
    faqs: [
      { question: 'What is the gratuity formula?', answer: 'For employees covered under the Act: Gratuity = (15 × Last Drawn Salary × Years of Service) / 26. For non-covered employees: Gratuity = (15 × Last Drawn Salary × Years) / 30. Last Drawn Salary = Basic + DA.' },
      { question: 'Who is eligible for gratuity?', answer: 'Any employee who has completed 5 or more years of continuous service with the same employer is eligible. Exception: in case of death or disability, gratuity is payable even without completing 5 years.' },
      { question: 'What is the maximum gratuity amount?', answer: 'The maximum gratuity payable is ₹20,00,000 (₹20 lakh) as per the latest amendment. Any amount above this is taxable.' },
      { question: 'Is gratuity taxable?', answer: 'Gratuity up to ₹20 lakh is tax-exempt for employees covered under the Payment of Gratuity Act. For government employees, the entire amount is tax-free. Amounts exceeding the limit are taxed at your income tax slab rate.' },
      { question: 'How are service years rounded?', answer: 'If an employee has worked for more than 6 months in the last year of service, it is rounded up to the next full year. For example, 7 years 8 months = 8 years for gratuity calculation.' },
    ],
    howToSteps: [
      'Enter your last drawn Basic Salary (monthly) in rupees.',
      'Enter Dearness Allowance if applicable (common in government jobs).',
      'Enter total years and months of service.',
      'Select whether your organization is covered under the Gratuity Act.',
      'View your gratuity amount with tax-free and taxable breakdown.',
    ],
    relatedToolSlugs: ['salary-calculator', 'hra-calculator', 'ppf-calculator', 'tax-regime-calculator'],
    icon: 'Award',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'hra-calculator',
    name: 'HRA Exemption Calculator',
    shortDescription: 'Calculate HRA tax exemption under Section 10(13A) for salaried employees.',
    longDescription: `<p>Calculate your <strong>HRA tax exemption</strong> under Section 10(13A) of the Income Tax Act. See exactly how much of your House Rent Allowance is tax-exempt and how much is taxable.</p>
<h2>Key Features</h2>
<ul>
<li><strong>3-Condition Calculation</strong>: Computes all three HRA exemption conditions and highlights which one determines your exemption.</li>
<li><strong>Metro vs Non-Metro</strong>: 50% of Basic+DA for Delhi, Mumbai, Kolkata, Chennai; 40% for all other cities.</li>
<li><strong>Tax Savings</strong>: Shows annual savings at both 20% and 30% tax slab rates.</li>
<li><strong>Monthly & Annual Views</strong>: Toggle between monthly and annual HRA figures.</li>
<li><strong>Quick Presets</strong>: Common salary bracket presets for instant estimates.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for salaried employees deciding between old vs new tax regime, or verifying HRA deductions before submitting rent receipts to their employer.</p>
<h2>Privacy & Security</h2>
<p>All calculations run instantly in your browser — no data stored, no signup required.</p>`,
    category: 'calculators',
    targetKeyword: 'HRA calculator',
    secondaryKeywords: ['HRA exemption calculator', 'HRA calculator India', 'house rent allowance calculator', 'HRA tax exemption calculator', 'HRA calculator online', 'Section 10(13A) calculator', 'HRA exemption calculation online', 'HRA calculator for salaried', 'HRA calculator metro non-metro', 'HRA tax benefit calculator'],
    metaTitle: 'HRA Calculator India - HRA Exemption Calculator Online Free',
    metaDescription: 'Calculate HRA tax exemption under Section 10(13A) for metro & non-metro cities. See all 3 conditions & annual tax savings. Free HRA calculator — instant results.',
    faqs: [
      { question: 'How is HRA exemption calculated?', answer: 'HRA exemption is the minimum of: (1) Actual HRA received from employer, (2) Rent paid minus 10% of Basic + DA, (3) 50% of Basic + DA for metro cities or 40% for non-metro cities. The lowest value is your tax-exempt HRA.' },
      { question: 'Which cities are considered metro for HRA?', answer: 'Only Delhi, Mumbai, Kolkata, and Chennai are classified as metro cities for HRA exemption (50% rate). All other cities including Bangalore, Hyderabad, Pune, and Ahmedabad are non-metro (40% rate).' },
      { question: 'Can I claim HRA under the new tax regime?', answer: 'No. HRA exemption under Section 10(13A) is NOT available under the new tax regime (Section 115BAC). You must choose the old tax regime to claim HRA exemption.' },
      { question: 'What documents are needed for HRA claim?', answer: 'Rent receipts (monthly), rent agreement, and landlord PAN (mandatory if annual rent exceeds ₹1 lakh). Submit these to your employer for TDS adjustment.' },
      { question: 'Can I claim HRA if I own a house?', answer: 'Yes, you can claim HRA even if you own a house, as long as you are paying rent for a different property where you actually live. You can also claim home loan interest deduction simultaneously under Section 24(b).' },
    ],
    howToSteps: [
      'Enter your monthly Basic Salary and Dearness Allowance.',
      'Enter the HRA amount received from your employer per month.',
      'Enter the monthly rent you pay.',
      'Select Metro or Non-Metro city type.',
      'View all three HRA conditions and your exempt/taxable HRA with annual tax savings.',
    ],
    relatedToolSlugs: ['rent-receipt-generator', 'salary-calculator', 'tax-regime-calculator', 'gratuity-calculator'],
    icon: 'Home',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'pregnancy-calculator',
    name: 'Pregnancy Due Date Calculator',
    shortDescription: 'Calculate your baby\'s expected due date with week-by-week milestones.',
    longDescription: `<p>Calculate your baby's <strong>expected due date (EDD)</strong> using four methods — Last Menstrual Period (LMP), conception date, IVF transfer date, or ultrasound measurements — using Naegele's rule and medical standards.</p>
<h2>Key Features</h2>
<ul>
<li><strong>4 Calculation Methods</strong>: LMP (Naegele's rule), conception date, IVF transfer (Day 3 or Day 5 embryo), and ultrasound gestational age.</li>
<li><strong>Trimester Progress Bar</strong>: Visual progress through first, second, and third trimesters.</li>
<li><strong>Milestone Timeline</strong>: 12 major pregnancy milestones with checkmarks for completed weeks.</li>
<li><strong>Key Dates</strong>: First trimester end, anatomy scan week (18-20 weeks), full term date, and expected delivery.</li>
<li><strong>IVF Support</strong>: Day 3 and Day 5 embryo transfer options for IVF pregnancies.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for expecting mothers tracking their pregnancy journey and planning appointments, scans, and preparation milestones.</p>
<h2>Privacy & Security</h2>
<p>All calculations happen in your browser — your health data is never sent to any server.</p>`,
    category: 'calculators',
    targetKeyword: 'pregnancy calculator',
    secondaryKeywords: ['due date calculator', 'pregnancy due date calculator', 'pregnancy week calculator', 'expected delivery date calculator', 'EDD calculator', 'pregnancy calculator India', 'pregnancy calculator by LMP', 'pregnancy due date calculator online', 'delivery date calculator', 'how many weeks pregnant calculator'],
    metaTitle: 'Pregnancy Calculator - Due Date Calculator by LMP, IVF Free',
    metaDescription: 'Calculate your baby\'s due date by LMP, conception, IVF or ultrasound. Week-by-week milestones & trimester tracker. Free pregnancy calculator — private & instant.',
    faqs: [
      { question: 'How is the due date calculated from LMP?', answer: 'Using Naegele\'s Rule: Due Date = LMP + 280 days (40 weeks). This assumes a regular 28-day cycle with ovulation on day 14. It is the most commonly used method by doctors worldwide.' },
      { question: 'How accurate is the due date?', answer: 'Only about 5% of babies are born on their exact due date. Most births occur between 38-42 weeks. Early ultrasound (before 12 weeks) provides the most accurate dating, within ±5 days.' },
      { question: 'What are the three trimesters?', answer: 'First Trimester: Weeks 1-12 (organ formation). Second Trimester: Weeks 13-27 (baby movement, anatomy scan). Third Trimester: Weeks 28-40 (baby gains weight, preparing for birth).' },
      { question: 'When is full term?', answer: 'A pregnancy is considered full term at 37 weeks. Early term is 37-38 weeks, full term is 39-40 weeks, and late term is 41-42 weeks. Post-term is beyond 42 weeks.' },
      { question: 'Is my data private?', answer: 'Yes, 100%. All calculations happen locally in your browser. No health data is sent to any server or stored anywhere.' },
    ],
    howToSteps: [
      'Select your calculation method: LMP, Conception, IVF, or Ultrasound.',
      'Enter the relevant date (last period, conception, transfer, or scan date).',
      'For IVF, select Day 3 or Day 5 embryo. For ultrasound, enter gestational age.',
      'View your estimated due date, current week, and trimester progress.',
      'Check the milestone timeline to see upcoming pregnancy events.',
    ],
    relatedToolSlugs: ['age-calculator', 'bmi-calculator', 'countdown-timer'],
    icon: 'Baby',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'gold-price-calculator',
    name: 'Gold Jewellery Price Calculator',
    shortDescription: 'Calculate gold jewellery price with making charges, GST, and purity.',
    longDescription: `<p>Calculate the total price of <strong>gold jewellery in India</strong> including gold value, making charges, GST, stone charges, and discounts. Supports all purity levels — 24K, 22K, 18K, and 14K.</p>
<h2>Key Features</h2>
<ul>
<li><strong>All Purity Levels</strong>: 24K (99.9%), 22K (91.6%), 18K (75%), and 14K (58.5%) purity calculations.</li>
<li><strong>Flexible Making Charges</strong>: Enter as percentage of gold value, per-gram rate, or flat amount.</li>
<li><strong>Multiple Weight Units</strong>: Calculate in grams, tola, ounce, or kg.</li>
<li><strong>Complete Breakdown</strong>: Gold value + making charges + stone charges + 3% GST + discounts.</li>
<li><strong>Side-by-Side Comparison</strong>: Compare rates across all four purity levels simultaneously.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Essential for buying gold jewellery, evaluating prices at jewellers, or planning wedding jewellery budgets in India.</p>
<h2>Privacy & Security</h2>
<p>All calculations run instantly in your browser — no data stored, no signup required.</p>`,
    category: 'calculators',
    targetKeyword: 'gold price calculator',
    secondaryKeywords: ['gold jewellery price calculator', 'gold rate calculator India', 'gold making charges calculator', 'gold price with GST calculator', '22k gold price calculator', 'gold price per gram calculator'],
    metaTitle: 'Gold Jewellery Price Calculator India - With Making & GST',
    metaDescription: 'Calculate gold jewellery price with making charges & 3% GST. Free gold price calculator for 24K, 22K, 18K gold. Enter weight, purity, get total cost instantly.',
    faqs: [
      { question: 'How is gold jewellery price calculated?', answer: 'Total Price = (Gold Rate × Purity Factor × Weight) + Making Charges + Stone Charges + GST. For example, 10g of 22K gold at ₹7,500/g = ₹7,500 × 0.9166 × 10 = ₹68,745 (gold value) + making charges + 3% GST.' },
      { question: 'What is the GST on gold in India?', answer: '3% GST is applicable on the total value of gold jewellery (gold value + making charges). GST on making charges separately was earlier 5%, but now it is uniformly 3% on the total invoice value.' },
      { question: 'What are typical making charges?', answer: 'Machine-made jewellery: 8-12% of gold value. Handmade/designer pieces: 15-25%. Antique/temple jewellery: 20-35%. Always ask for making charges upfront before purchasing.' },
      { question: 'Why is 22K gold more popular than 24K for jewellery?', answer: '24K gold is pure (99.9%) but too soft for daily-wear jewellery. 22K (91.6%) mixes gold with copper/silver for durability while maintaining the rich gold color. Most Indian jewellery is 22K.' },
      { question: 'What is BIS hallmarking?', answer: 'BIS (Bureau of Indian Standards) hallmarking certifies gold purity. Since June 2021, hallmarking is mandatory for gold jewellery sold in India. Look for the HUID (Hallmark Unique Identification) number for authenticity.' },
    ],
    howToSteps: [
      'Enter the current 24K gold rate per gram (check today\'s rate online).',
      'Select gold purity — 22K is most common for Indian jewellery.',
      'Enter the jewellery weight in grams, tola, ounce, or kg.',
      'Set making charges as percentage, per-gram, or flat amount.',
      'View the complete price breakdown with GST, and effective cost per gram.',
    ],
    relatedToolSlugs: ['gst-calculator', 'emi-calculator', 'percentage-calculator', 'discount-calculator'],
    icon: 'Gem',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'ifsc-code-finder',
    name: 'IFSC Code Finder',
    shortDescription: 'Find bank branch details by IFSC code — supports NEFT, RTGS, IMPS, UPI.',
    longDescription: `<p>Look up any Indian bank branch details using its <strong>IFSC code</strong>. Enter the 11-character IFSC code and instantly get the bank name, branch, full address, MICR code, and supported payment methods.</p>
<h2>Key Features</h2>
<ul>
<li><strong>150,000+ Branches</strong>: Powered by Razorpay's IFSC API with comprehensive data for all RBI-registered banks.</li>
<li><strong>Complete Details</strong>: Bank name, branch name, address, city, district, state, MICR code, NEFT/RTGS/IMPS/UPI support.</li>
<li><strong>IFSC Validation</strong>: Validates the AAAA0NNNNNN format before lookup.</li>
<li><strong>Popular Bank Shortcuts</strong>: Quick-access buttons for SBI, HDFC, ICICI, Axis, PNB, BOB, Kotak, and more.</li>
<li><strong>One-Click Copy</strong>: Copy IFSC code, MICR code, or any other detail instantly.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Essential for verifying bank details before fund transfers, filling out online forms, or setting up direct deposits and salary transfers.</p>
<h2>Privacy & Security</h2>
<p>No data stored — your searches are not logged or tracked.</p>`,
    category: 'utility-tools',
    targetKeyword: 'IFSC code finder',
    secondaryKeywords: ['IFSC code search', 'bank IFSC code', 'IFSC code lookup', 'find IFSC code by bank name', 'IFSC MICR code finder', 'bank branch details by IFSC'],
    metaTitle: 'IFSC Code Finder - Search Bank Branch Details Online',
    metaDescription: 'Find bank branch details by IFSC code. Get bank name, address, MICR, NEFT/RTGS/UPI support. Free IFSC code finder for all Indian banks — instant lookup.',
    faqs: [
      { question: 'What is an IFSC code?', answer: 'IFSC (Indian Financial System Code) is an 11-character alphanumeric code assigned by RBI to every bank branch in India. Format: First 4 characters = bank code, 5th = always 0, last 6 = branch code. Example: SBIN0001234.' },
      { question: 'Where can I find my IFSC code?', answer: 'Your IFSC code is printed on your cheque book (usually at the bottom), bank passbook, account statement, or internet banking portal. You can also look it up on the RBI website or using our tool.' },
      { question: 'What is IFSC used for?', answer: 'IFSC is required for electronic fund transfers via NEFT, RTGS, and IMPS. It identifies the specific bank branch for routing payments correctly. UPI internally uses IFSC for bank identification.' },
      { question: 'What is a MICR code?', answer: 'MICR (Magnetic Ink Character Recognition) is a 9-digit code printed on cheques using magnetic ink. It identifies the bank, branch, and city. While IFSC is used for electronic transfers, MICR is used for cheque-based clearing.' },
      { question: 'How many IFSC codes exist in India?', answer: 'There are over 150,000 unique IFSC codes in India, covering all RBI-registered banks including public sector, private sector, cooperative, and regional rural banks.' },
    ],
    howToSteps: [
      'Enter the 11-character IFSC code in the search box.',
      'Or click a popular bank prefix (SBI, HDFC, ICICI, etc.) to start.',
      'Click "Search" or press Enter to look up the branch.',
      'View bank name, branch, address, MICR code, and supported payment methods.',
      'Click copy buttons to copy IFSC or MICR codes to clipboard.',
    ],
    relatedToolSlugs: ['qr-code-generator', 'random-generator', 'invoice-generator'],
    icon: 'Building',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'numerology-calculator',
    name: 'Numerology Calculator',
    shortDescription: 'Discover your Life Path, Destiny, Soul & Personality numbers instantly.',
    longDescription: `<p>Calculate your core <strong>numerology numbers</strong> using the Pythagorean system. Enter your full name and date of birth to discover five key numbers that reveal your life purpose, inner desires, and personality.</p>
<h2>Key Features</h2>
<ul>
<li><strong>5 Core Numbers</strong>: Life Path (from DOB), Destiny (full name), Soul Urge (vowels), Personality (consonants), and Birthday Number.</li>
<li><strong>Letter-by-Letter Breakdown</strong>: Color-coded vowels and consonants showing how each number is derived.</li>
<li><strong>Detailed Interpretations</strong>: Traits, strengths, challenges, and ideal careers for each number.</li>
<li><strong>Master Numbers</strong>: Special interpretations for Master Numbers 11, 22, and 33.</li>
<li><strong>Pythagorean System</strong>: The most widely used numerology method worldwide.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for anyone curious about numerology, self-reflection, or exploring personality insights through name and birth date analysis. For entertainment purposes.</p>
<h2>Privacy & Security</h2>
<p>All calculations run instantly in your browser — no data stored, no signup required.</p>`,
    category: 'calculators',
    targetKeyword: 'numerology calculator',
    secondaryKeywords: ['numerology calculator by name', 'life path number calculator', 'destiny number calculator', 'numerology name calculator', 'name numerology calculator', 'Pythagorean numerology calculator'],
    metaTitle: 'Numerology Calculator - Life Path & Destiny Number Free',
    metaDescription: 'Calculate your Life Path, Destiny, Soul & Personality numbers. Free numerology calculator by name and date of birth. Pythagorean system with detailed meanings.',
    faqs: [
      { question: 'What is a Life Path Number?', answer: 'The Life Path Number is the most important number in numerology. It is calculated from your complete date of birth by adding all digits until you get a single digit (or Master Number). It reveals your life purpose, lessons, and overall journey.' },
      { question: 'How is the Destiny Number calculated?', answer: 'The Destiny Number (also called Expression Number) is calculated by assigning each letter of your full birth name a number (A=1, B=2... I=9, J=1...) using the Pythagorean chart, then reducing the sum to a single digit.' },
      { question: 'What are Master Numbers?', answer: 'Master Numbers are 11, 22, and 33. They carry heightened spiritual significance and are not reduced to single digits. 11 = Illuminator/Intuition, 22 = Master Builder, 33 = Master Teacher.' },
      { question: 'Should I use my birth name or current name?', answer: 'For the most accurate Destiny Number, use your full name exactly as it appears on your birth certificate. Married names, nicknames, or legally changed names carry different energies.' },
      { question: 'Is numerology scientifically proven?', answer: 'Numerology is a belief system and is not supported by scientific evidence. It is best used for entertainment, self-reflection, and personal insight — not as a basis for major life decisions.' },
    ],
    howToSteps: [
      'Enter your full name as it appears on your birth certificate.',
      'Enter your date of birth.',
      'View the letter-by-letter breakdown showing each letter\'s numerical value.',
      'Read detailed interpretations for each of your five core numbers.',
      'Explore traits, strengths, challenges, and ideal careers for each number.',
    ],
    relatedToolSlugs: ['love-calculator', 'age-calculator', 'random-generator'],
    icon: 'Sparkles',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'ppf-calculator',
    name: 'PPF Calculator India',
    shortDescription: 'Calculate PPF maturity amount with year-by-year growth and tax savings.',
    longDescription: `<p>Calculate the maturity amount of your <strong>PPF (Public Provident Fund)</strong> investment. Enter annual deposit, interest rate, and tenure to see total invested amount, interest earned, and final maturity value.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Current Rate Pre-filled</strong>: 7.1% p.a. (Q4 FY 2025-26) pre-loaded, adjustable for scenario planning.</li>
<li><strong>Visual Donut Chart</strong>: Investment vs interest split displayed visually.</li>
<li><strong>Year-by-Year Breakdown</strong>: Annual balance, contribution, and interest table for all 15+ years.</li>
<li><strong>EEE Tax Status</strong>: Shows Section 80C deduction benefit and confirms tax-free interest and maturity.</li>
<li><strong>Extension Planning</strong>: Plan returns for 15, 20, 25-year tenures (5-year extension blocks).</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for long-term savers, tax planners, and anyone building a safe, government-backed retirement corpus with tax-free returns.</p>
<h2>Privacy & Security</h2>
<p>All calculations run instantly in your browser — no data stored, no signup required.</p>`,
    category: 'calculators',
    targetKeyword: 'PPF calculator',
    secondaryKeywords: ['PPF calculator India', 'PPF interest calculator', 'PPF maturity calculator', 'public provident fund calculator', 'PPF returns calculator', 'PPF calculator with yearly breakdown', 'PPF calculator online', 'PPF calculator 2025', 'PPF maturity amount calculator', 'PPF account calculator India'],
    metaTitle: 'PPF Calculator India - PPF Maturity & Interest Calculator Free',
    metaDescription: 'Calculate PPF maturity amount with year-by-year breakdown at 7.1% rate. See total interest earned & tax savings. Free PPF calculator India — instant results.',
    faqs: [
      { question: 'What is the current PPF interest rate?', answer: 'The current PPF interest rate is 7.1% per annum (Q4 FY 2025-26). The rate is set by the Government of India quarterly and has been 7.1% since April 2020.' },
      { question: 'What are the PPF deposit limits?', answer: 'Minimum: ₹500 per year. Maximum: ₹1,50,000 per year. You can deposit in lump sum or up to 12 monthly installments. Deposits beyond ₹1.5L will not earn interest.' },
      { question: 'What is the PPF lock-in period?', answer: 'PPF has a mandatory lock-in period of 15 years from the date of account opening. After maturity, you can extend in blocks of 5 years with or without contributions.' },
      { question: 'Is PPF tax-free?', answer: 'Yes, PPF enjoys EEE (Exempt-Exempt-Exempt) status. Deposits up to ₹1.5L qualify for Section 80C deduction, interest earned is completely tax-free, and the maturity amount is also tax-free.' },
      { question: 'Can I withdraw from PPF before maturity?', answer: 'Partial withdrawal is allowed from the 7th financial year onwards. You can withdraw up to 50% of the balance at the end of the 4th preceding year or the immediate preceding year, whichever is lower.' },
    ],
    howToSteps: [
      'Enter your annual deposit amount (₹500 to ₹1,50,000).',
      'Set the interest rate (current: 7.1% p.a.) or adjust for scenarios.',
      'Set tenure — minimum 15 years, can extend in 5-year blocks.',
      'View maturity amount, total interest earned, and visual charts.',
      'Toggle year-by-year breakdown to see growth over time.',
    ],
    relatedToolSlugs: ['sip-calculator', 'mutual-fund-calculator', 'compound-interest-calculator', 'fd-rd-calculator'],
    icon: 'PiggyBank',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'mutual-fund-calculator',
    name: 'Mutual Fund Returns Calculator',
    shortDescription: 'Calculate SIP and lumpsum mutual fund returns with growth visualization.',
    longDescription: `<p>Calculate expected returns on <strong>mutual fund investments</strong> with our comprehensive calculator. Supports SIP (monthly investment), Lumpsum (one-time), and SIP + Lumpsum combined strategy.</p>
<h2>Key Features</h2>
<ul>
<li><strong>3 Investment Modes</strong>: SIP, Lumpsum, or SIP + Lumpsum combined strategy.</li>
<li><strong>Visual Growth Chart</strong>: Bar chart showing investment vs returns over time.</li>
<li><strong>Wealth Multiplier</strong>: See how many times your investment grows.</li>
<li><strong>Year-by-Year Breakdown</strong>: Annual corpus and returns table for the full investment period.</li>
<li><strong>Fund Category Guidelines</strong>: Large Cap (10-12%), Mid Cap (12-15%), Small Cap (15-18%), Index (10-13%), ELSS (12-15%), Debt (6-8%) reference rates.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for investors planning SIPs, evaluating lumpsum opportunities, or understanding the power of compounding for long-term financial goals.</p>
<h2>Privacy & Security</h2>
<p>All calculations run instantly in your browser — no data stored, no signup required.</p>`,
    category: 'calculators',
    targetKeyword: 'mutual fund calculator',
    secondaryKeywords: ['mutual fund returns calculator', 'mutual fund SIP calculator', 'lumpsum calculator', 'mutual fund calculator India', 'investment return calculator', 'SIP lumpsum calculator'],
    metaTitle: 'Mutual Fund Calculator - SIP & Lumpsum Returns Free',
    metaDescription: 'Calculate mutual fund returns for SIP & lumpsum investments. Free calculator with growth chart, wealth multiplier, year-by-year breakdown. Instant results.',
    faqs: [
      { question: 'What is the difference between SIP and Lumpsum?', answer: 'SIP (Systematic Investment Plan) is investing a fixed amount monthly, which averages out market volatility. Lumpsum is a one-time investment, which works better in a rising market. Combining both optimizes returns and risk.' },
      { question: 'What return rate should I use?', answer: 'For equity funds: 12-15% for long-term (10+ years). Large Cap: 10-12%. Mid Cap: 12-15%. Small Cap: 15-18%. Debt funds: 6-8%. Index funds: 10-13%. Use conservative estimates for planning.' },
      { question: 'How does SIP compounding work?', answer: 'Each SIP installment earns compound interest from its investment date. Early installments compound for longer, creating exponential growth. A ₹10,000/month SIP at 12% for 20 years creates ₹1 crore — where only ₹24L is your investment and ₹76L is returns.' },
      { question: 'What is the tax on mutual fund returns?', answer: 'Equity funds: STCG (20%) if sold within 1 year, LTCG (12.5%) above ₹1.25L/year if held over 1 year. Debt funds (from April 2023): Taxed at your income tax slab rate regardless of holding period.' },
      { question: 'Can I lose money in mutual funds?', answer: 'Yes, mutual funds carry market risk. Equity funds can show negative returns in the short term. However, historically, quality equity funds have delivered positive returns over 7+ year periods. SIP helps reduce timing risk through rupee cost averaging.' },
    ],
    howToSteps: [
      'Select investment mode: SIP (monthly), Lumpsum (one-time), or both.',
      'Enter your investment amount using the input box or slider.',
      'Set expected annual return rate — use fund category guidelines for reference.',
      'Set investment period in years using the slider (1-40 years).',
      'View returns, wealth multiplier, growth chart, and toggle year-by-year breakdown.',
    ],
    relatedToolSlugs: ['sip-calculator', 'ppf-calculator', 'emi-calculator', 'compound-interest-calculator'],
    icon: 'TrendingUp',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'greeting-card-maker',
    name: 'Greeting Card Maker',
    shortDescription: 'Create beautiful greeting cards online. 50+ templates for Birthday, Wedding, Diwali, Anniversary & more. Download PNG or share via link.',
    longDescription: `<p>Create stunning <strong>greeting cards online</strong> for free with 50+ professionally designed templates — Birthday, Wedding, Anniversary, Diwali, Holi, New Year, Valentine's Day, Eid, Christmas, and more.</p>
<h2>Key Features</h2>
<ul>
<li><strong>50+ Templates</strong>: Professionally designed cards across 15+ occasion categories.</li>
<li><strong>Full Customization</strong>: Add recipient name, personal message, choose from 8 font styles and accent colors.</li>
<li><strong>Live Preview</strong>: Real-time preview updates as you customize.</li>
<li><strong>Share via Link</strong>: Generate a unique URL to share your card on WhatsApp, email, or social media — no download needed.</li>
<li><strong>PNG Download</strong>: High-quality PNG image ready to save or print.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for sending digital wishes to family and friends for birthdays, festivals, and special occasions via WhatsApp, Instagram, or email.</p>
<h2>Privacy & Security</h2>
<p>Runs in your browser — no data stored on any server. Share links encode card data in the URL itself.</p>`,
    category: 'utility-tools',
    targetKeyword: 'greeting card maker online free',
    secondaryKeywords: [
      'wish card maker', 'birthday card maker', 'greeting card generator',
      'free greeting card online', 'diwali greeting card maker', 'wedding card maker',
      'anniversary card maker', 'online card maker free', 'shareable greeting card',
      'download greeting card png', 'wish card generator', 'invitation card maker',
      'holi greeting card', 'new year card maker', 'eid mubarak card maker',
      'christmas card maker', 'valentines day card', 'mothers day card maker',
    ],
    metaTitle: 'Greeting Card Maker - 50+ Free Templates | Download PNG & Share Link',
    metaDescription: 'Create beautiful greeting cards online free. 50+ templates for Birthday, Wedding, Diwali, Holi, New Year & more. Customize text, fonts, colors. Download PNG or share via link instantly.',
    faqs: [
      { question: 'How do I create a greeting card?', answer: 'Choose a category (Birthday, Wedding, Diwali, etc.), pick a template, customize the recipient name, message, font, and colors, then download as PNG or share via a link.' },
      { question: 'Can I share my greeting card without downloading?', answer: 'Yes! Click "Share via Link" to generate a unique URL. Anyone who opens the link will see your customized greeting card. Works great on WhatsApp, email, and social media.' },
      { question: 'Is this greeting card maker really free?', answer: 'Yes, completely free with no sign-up, no watermarks, and unlimited cards. Create as many cards as you want!' },
      { question: 'Do you store my card data on a server?', answer: 'No. Everything runs 100% in your browser. For shared links, the card data is encoded directly in the URL — nothing is stored on any server.' },
      { question: 'What occasions and categories are supported?', answer: "Birthday, Wedding, Anniversary, Diwali, Holi, New Year, Valentine's Day, Mother's Day, Father's Day, Thank You, Congratulations, Invitation, Eid, Christmas, Raksha Bandhan, and Friendship Day — over 50 templates in total." },
    ],
    howToSteps: [
      'Choose a category (Birthday, Wedding, Diwali, etc.) from the tabs at the top.',
      'Pick a template design from the grid on the left panel.',
      "Enter the recipient's name, greeting title, personal message, and your name.",
      'Optionally customize the font style and accent color to match your preference.',
      'Preview your card in real-time on the right panel.',
      'Click "Download PNG" to save as image or "Share via Link" to send via WhatsApp, email, etc.',
    ],
    relatedToolSlugs: ['marriage-biodata-maker', 'fancy-text-generator', 'qr-code-generator', 'whatsapp-link-generator'],
    icon: 'PartyPopper',
    isNew: true,
    estimatedTime: '2 minutes',
  },
  {
    slug: 'cgpa-to-percentage',
    name: 'CGPA to Percentage Converter',
    shortDescription: 'Convert CGPA to percentage for 10-point (Indian), 4-point (US), 5-point, and 7-point (Australian) grading scales.',
    longDescription: `<p>Convert your <strong>CGPA to percentage</strong> instantly with support for all major grading systems — Indian 10-point, US 4.0 GPA, 5-point, and Australian 7-point scales.</p>
<h2>Key Features</h2>
<ul>
<li><strong>All Grading Scales</strong>: 10-point (CBSE, VTU, Anna University), 4-point (US GPA), 5-point, and 7-point (Australian).</li>
<li><strong>Live Conversion</strong>: Slider and number input with real-time percentage update.</li>
<li><strong>Grade Letter Display</strong>: Color-coded grade (A+, A, B+, etc.) for your CGPA.</li>
<li><strong>Cross-Conversion Table</strong>: See your equivalent GPA on all other scales simultaneously.</li>
<li><strong>SGPA to CGPA Calculator</strong>: Enter semester-wise SGPAs to compute your cumulative CGPA.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for Indian students applying to universities abroad, converting grades for job applications, or calculating cumulative CGPA from semester results.</p>
<h2>Privacy & Security</h2>
<p>100% browser-based — no data stored, no signup required.</p>`,
    category: 'calculators',
    targetKeyword: 'cgpa to percentage',
    secondaryKeywords: ['cgpa to percentage calculator', 'gpa to percentage', 'cgpa converter', 'sgpa to cgpa calculator', '10 point cgpa to percentage', 'cbse cgpa to percentage', 'us gpa to percentage', 'australian gpa to percentage'],
    metaTitle: 'CGPA to Percentage Converter - All Grading Scales',
    metaDescription: 'Free CGPA to percentage converter for 10-point (Indian), 4-point (US), 5-point, and 7-point (Australian) scales. Includes SGPA to CGPA calculator and grade charts.',
    faqs: [
      { question: 'How is CGPA converted to percentage in India?', answer: 'Most Indian universities (including CBSE) use the formula: Percentage = CGPA x 9.5. For example, a CGPA of 8.5 equals 80.75%. Some institutions may use slightly different multipliers.' },
      { question: 'How do I convert US GPA to percentage?', answer: 'The US 4.0 GPA system does not have a direct formula. It uses a standard mapping table where 4.0 = ~97%, 3.0 = ~87%, 2.0 = ~77%, etc. This tool uses interpolation for values in between.' },
      { question: 'What is the difference between SGPA and CGPA?', answer: 'SGPA (Semester Grade Point Average) is for a single semester. CGPA (Cumulative Grade Point Average) is the average of all semester SGPAs, representing your overall academic performance.' },
      { question: 'Can I use this for CBSE, VTU, or Anna University?', answer: 'Yes! The 10-point scale with the x9.5 formula is used by CBSE, VTU, Anna University, Mumbai University, and most Indian institutions.' },
    ],
    howToSteps: [
      'Select your grading scale (10-point, 4-point, 5-point, or 7-point).',
      'Enter your CGPA using the slider or number input.',
      'View your percentage, grade letter, and progress bar instantly.',
      'Check the cross-conversion table for equivalents on other scales.',
      'Use the SGPA to CGPA section to calculate cumulative CGPA from semester grades.',
    ],
    relatedToolSlugs: ['percentage-calculator', 'average-calculator', 'scientific-calculator', 'number-to-words'],
    icon: 'GraduationCap',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'favicon-generator',
    name: 'Favicon Generator',
    shortDescription: 'Generate favicons from an image or text/emoji. Download PNGs in all standard sizes.',
    longDescription: `<p>Create perfect <strong>favicons for your website</strong> from any image or custom text/emoji — generate all standard sizes with one tool.</p>
<h2>Key Features</h2>
<ul>
<li><strong>From Image</strong>: Upload JPG, PNG, SVG, or WebP and auto-crop to favicon proportions.</li>
<li><strong>From Text/Emoji</strong>: Design from scratch with any character or emoji — choose colors, font, and border radius.</li>
<li><strong>All Standard Sizes</strong>: 16x16, 32x32, 48x48, 180x180 (Apple Touch), 192x192, and 512x512 (PWA).</li>
<li><strong>HTML Meta Tags</strong>: Ready-to-copy HTML meta tags for your website's &lt;head&gt; section.</li>
<li><strong>Individual Downloads</strong>: Download each size as a separate PNG file.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for web developers, indie makers, and anyone launching a website who needs a complete favicon set in minutes.</p>
<h2>Privacy & Security</h2>
<p>Runs in your browser using Canvas API — no uploads to any server, instant processing.</p>`,
    category: 'image-tools',
    targetKeyword: 'favicon generator',
    secondaryKeywords: ['favicon maker', 'favicon from image', 'favicon from text', 'favicon creator online', 'generate favicon png'],
    metaTitle: 'Favicon Generator - Create Favicons from Image or Text/Emoji',
    metaDescription: 'Generate favicons from any image or text/emoji. Download PNGs in all sizes (16x16 to 512x512). Copy HTML meta tags. Free online favicon maker.',
    faqs: [
      { question: 'What sizes do I need for a favicon?', answer: '16x16 and 32x32 are essential for browser tabs. 180x180 is needed for Apple Touch Icon. 192x192 and 512x512 are required for Progressive Web Apps (PWA) and Android home screen icons.' },
      { question: 'Can I use an emoji as a favicon?', answer: 'Yes! Switch to the "From Text/Emoji" tab and paste any emoji. Customize the background color, border radius, and size to create a unique favicon.' },
      { question: 'Is my image uploaded to a server?', answer: 'No. All processing happens locally in your browser using the Canvas API. Your image never leaves your device.' },
      { question: 'What image formats are supported?', answer: 'You can upload JPG, PNG, SVG, or WebP images. The output is always PNG for maximum compatibility.' },
    ],
    howToSteps: [
      'Choose "From Image" to upload a picture, or "From Text/Emoji" to design from scratch.',
      'For images: drag & drop or click to upload a JPG, PNG, SVG, or WebP file.',
      'For text: enter 1-2 characters, pick colors, font, and border radius.',
      'Preview your favicon at all standard sizes.',
      'Click the download button on any size to save the PNG.',
      'Copy the HTML meta tags and paste them into your website\'s <head>.',
    ],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'svg-to-png', 'qr-code-generator', 'meta-tag-generator'],
    icon: 'Image',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'attendance-calculator',
    name: 'Attendance Calculator',
    shortDescription: 'Check your attendance percentage and plan how many classes to attend or skip.',
    longDescription: `<p>A must-have <strong>attendance calculator</strong> for college students to track and plan classes. Two powerful modes in one tool.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Check Attendance Mode</strong>: Enter total classes and attended classes — instantly see your percentage with a color-coded progress chart (Safe ≥75%, Warning 65-75%, Danger &lt;65%).</li>
<li><strong>Plan Attendance Mode</strong>: Set a target (75%, 80%, 85%, 90%) and find exactly how many classes you must attend or can safely skip.</li>
<li><strong>Visual Donut Chart</strong>: SVG progress chart with real-time updates as you enter values.</li>
<li><strong>Status Zones</strong>: Clear Safe, Warning, and Danger indicators with actionable guidance.</li>
<li><strong>Quick Stats Cards</strong>: Key numbers at a glance — current %, classes needed, classes can skip.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for college and university students in India who need to maintain 75% attendance for exam eligibility.</p>
<h2>Privacy & Security</h2>
<p>All calculations run instantly in your browser — no data stored, no signup required.</p>`,
    category: 'calculators',
    targetKeyword: 'attendance calculator',
    secondaryKeywords: ['college attendance calculator', 'attendance percentage calculator', 'how many classes can I skip', 'attendance tracker', '75 percent attendance calculator'],
    metaTitle: 'Attendance Calculator - Check & Plan Your College Attendance',
    metaDescription: 'Free attendance calculator for students. Check your attendance %, find how many classes you can skip or need to attend to reach 75% target. Visual donut chart.',
    faqs: [
      { question: 'What is the minimum attendance required in Indian colleges?', answer: 'Most Indian universities following UGC guidelines require a minimum of 75% attendance to be eligible for exams. Some institutions set higher thresholds of 80% or 85%.' },
      { question: 'How is attendance percentage calculated?', answer: 'Attendance % = (Classes Attended / Total Classes) x 100. For example, attending 90 out of 120 classes gives 75%.' },
      { question: 'How many classes can I skip and still have 75%?', answer: 'Use the Plan Attendance mode with a 75% target. It will tell you exactly how many classes you can safely miss while maintaining the required percentage.' },
      { question: 'What happens if my attendance falls below 75%?', answer: 'Consequences vary by institution but may include detention, loss of exam eligibility, grade penalties, or mandatory extra assignments.' },
    ],
    howToSteps: [
      'Enter total classes held so far.',
      'Enter the number of classes you have attended.',
      'View your current attendance % and status.',
      'Switch to Plan Attendance to set a target % and see classes needed or safe to skip.',
    ],
    relatedToolSlugs: ['percentage-calculator', 'average-calculator', 'bmi-calculator', 'scientific-calculator'],
    icon: 'ClipboardCheck',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'binary-hex-octal-converter',
    name: 'Binary, Hex & Octal Converter',
    shortDescription: 'Convert numbers between binary, decimal, octal, and hexadecimal instantly.',
    longDescription: `<p>Convert numbers between <strong>binary, decimal, octal, and hexadecimal</strong> in real time. Type in any field and all other representations update instantly — no button clicks needed.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Real-Time Conversion</strong>: All four bases (binary, decimal, octal, hex) update simultaneously as you type.</li>
<li><strong>BigInt Support</strong>: Handles arbitrarily large numbers beyond the 64-bit limit.</li>
<li><strong>Bit Analysis</strong>: Shows nibble and byte groupings, total bits needed, and 8/16/32/64-bit fit status.</li>
<li><strong>Quick Examples</strong>: Chips for common values (255, 1024, 65535) for quick exploration.</li>
<li><strong>Text to Binary</strong>: Convert any text to see each character's ASCII code, binary, and hex in a table.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for programmers working with low-level data, CS students learning number systems, and anyone debugging binary or hex values.</p>
<h2>Privacy & Security</h2>
<p>All conversions run instantly in your browser — no data stored, no signup required.</p>`,
    category: 'converters',
    targetKeyword: 'binary to hex converter',
    secondaryKeywords: ['binary to decimal', 'hex to binary', 'octal converter', 'number base converter', 'decimal to binary', 'hex to decimal', 'binary translator', 'base converter'],
    metaTitle: 'Binary, Hex & Octal Converter - Number Base Converter Online',
    metaDescription: 'Convert between binary, decimal, octal, and hexadecimal instantly. Supports large numbers, bit analysis, and text-to-binary conversion. Free online tool.',
    faqs: [
      { question: 'How large a number can I convert?', answer: 'The tool uses JavaScript BigInt, so it supports numbers of virtually unlimited size — far beyond the 64-bit limit of regular numbers.' },
      { question: 'What characters are valid for each base?', answer: 'Binary: 0-1. Octal: 0-7. Decimal: 0-9. Hexadecimal: 0-9 and A-F (case insensitive).' },
      { question: 'Does it handle negative numbers?', answer: 'Currently the tool supports non-negative integers. For negative numbers, convert the absolute value and apply the sign or two\'s complement manually.' },
      { question: 'What is the Text to Binary section?', answer: 'It converts each character of your text into its ASCII decimal value, 8-bit binary, and 2-digit hex representation — useful for understanding character encoding.' },
    ],
    howToSteps: [
      'Type a number in any field (decimal, binary, octal, or hex).',
      'All other fields update instantly in real time.',
      'Use quick example chips to explore common values.',
      'Check the info cards for bit count, nibble/byte grouping, and size fit.',
      'Use the Text to Binary section to see character codes for any text.',
    ],
    relatedToolSlugs: ['number-to-words', 'base64-encode-decode', 'hex-rgb-converter', 'unit-converter', 'file-size-converter'],
    icon: 'Binary',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'blur-face-in-photo',
    name: 'Blur Face in Photo',
    shortDescription: 'Blur faces or sensitive areas in photos online. Draw rectangles to select regions, adjust blur intensity, and download instantly.',
    longDescription: `<p>Protect privacy by <strong>blurring faces, license plates, or any sensitive areas</strong> in your photos. Draw rectangles to select regions, adjust blur intensity, and download instantly.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Multiple Regions</strong>: Draw as many blur rectangles as you need — each numbered and independently removable.</li>
<li><strong>Adjustable Intensity</strong>: Blur strength slider from subtle (5px) to heavy (50px) for full control.</li>
<li><strong>Live Overlay</strong>: Highlighted overlay shows exactly which regions will be blurred before applying.</li>
<li><strong>Undo & Clear</strong>: Undo last region, remove individual regions, or clear all selections.</li>
<li><strong>PNG & JPEG Download</strong>: Download the blurred result in lossless PNG or smaller JPEG format.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for protecting privacy in social media photos, blurring sensitive documents, censoring license plates, or anonymizing any personal information in images.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser using Canvas API — no images are uploaded to any server, completely private.</p>`,
    category: 'image-tools',
    targetKeyword: 'blur face in photo online',
    secondaryKeywords: ['blur face online', 'blur photo face', 'blur image area', 'pixelate face', 'censor photo', 'blur sensitive area in image'],
    metaTitle: 'Blur Face in Photo Online - Free Privacy Tool',
    metaDescription: 'Blur faces or sensitive areas in photos online for free. Draw blur regions, adjust intensity, and download instantly. No upload, 100% private.',
    faqs: [
      { question: 'Is my photo uploaded to a server?', answer: 'No. All processing happens locally in your browser using the Canvas API. Your photo never leaves your device.' },
      { question: 'Can I blur multiple faces in one photo?', answer: 'Yes! Draw as many blur rectangles as you need. Each region is numbered and can be individually removed.' },
      { question: 'What blur intensity should I use?', answer: 'For faces, 15-25px works well. For text or license plates, 30-50px ensures the content is unreadable. Use the slider to preview different levels.' },
      { question: 'Can I undo a blur region?', answer: 'Yes. Use the "Undo" button to remove the last region, click the X on any individual region, or use "Clear All" to start over. Once you click "Apply Blur", the blur is baked into the image.' },
      { question: 'What formats are supported?', answer: 'You can upload JPEG, PNG, and WebP images. Download the result as either PNG (lossless) or JPEG (smaller file size).' },
    ],
    howToSteps: [
      'Upload your image by dragging & dropping or clicking the upload area.',
      'Click and drag on the image to draw rectangles over areas you want to blur.',
      'Adjust the blur intensity using the slider (5-50px).',
      'Add multiple blur regions as needed. Remove individual regions with the X button.',
      'Click "Apply Blur" to process all selected regions.',
      'Download the result as PNG or JPEG.',
    ],
    relatedToolSlugs: ['image-cropper', 'image-compressor', 'image-resizer', 'image-watermark', 'passport-photo-maker', 'image-background-remover'],
    icon: 'EyeOff',
    isNew: true,
    estimatedTime: '10-30 seconds',
  },

  // ─── CERTIFICATE MAKER ─────────────────────────────────────────────────
  {
    slug: 'certificate-maker',
    name: 'Certificate Maker',
    shortDescription: 'Create professional certificates online for free. 5 templates, PNG download — no signup.',
    longDescription: `<p>Create beautiful, professional <strong>certificates online for free</strong> in seconds. Choose from 5 elegant templates and 6 certificate types — Achievement, Appreciation, Completion, Participation, Excellence, and Training.</p>
<h2>Key Features</h2>
<ul>
<li><strong>5 Templates</strong>: Classic (gold), Modern (blue), Elegant (green), Corporate (navy), and Creative (purple) with ornamental borders and elegant typography.</li>
<li><strong>6 Certificate Types</strong>: Achievement, Appreciation, Completion, Participation, Excellence, and Training.</li>
<li><strong>Live Preview</strong>: Real-time preview updates as you fill in the form.</li>
<li><strong>Custom Certificate ID</strong>: Auto-generated or enter your own custom certificate number.</li>
<li><strong>High-Resolution Download</strong>: PNG at 2x scale — print-ready at A4 landscape ratio.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for schools, companies, training programs, workshops, and events needing professional certificates without design software.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your data never leaves your device. No signup required.</p>`,
    category: 'converters',
    targetKeyword: 'certificate maker online free',
    secondaryKeywords: ['certificate generator', 'certificate of achievement maker', 'free certificate maker', 'online certificate creator', 'certificate template generator', 'certificate of completion maker', 'certificate of appreciation maker', 'certificate of participation maker', 'professional certificate maker'],
    metaTitle: 'Free Certificate Maker - Create & Download Professional Certificates Online',
    metaDescription: 'Create professional certificates online for free. 5 beautiful templates, 6 certificate types. Customize text, download as PNG — no signup, 100% private.',
    faqs: [
      { question: 'Is this certificate maker really free?', answer: 'Yes, 100% free with no hidden costs. Create unlimited certificates, download as high-resolution PNG, and use all 5 templates — no signup or payment required.' },
      { question: 'What types of certificates can I create?', answer: 'You can create certificates for Achievement, Appreciation, Completion, Participation, Excellence, and Training. Each type can be fully customized with your own title and description.' },
      { question: 'Is my data safe?', answer: 'Absolutely. Everything runs in your browser using JavaScript. Your certificate data never leaves your device — nothing is sent to any server.' },
      { question: 'Can I print the certificate?', answer: 'Yes! The certificate is downloaded as a high-resolution PNG (2x scale) at landscape A4 ratio. You can print it directly or insert it into a document for printing.' },
      { question: 'Can I add a custom certificate number?', answer: 'Yes. By default, a unique certificate ID is auto-generated. You can also uncheck the auto-generate option and enter your own custom certificate number.' },
    ],
    howToSteps: [
      'Select a certificate type (Achievement, Appreciation, Completion, etc.).',
      'Choose a template style from the 5 available designs.',
      'Fill in the recipient name, certificate title, and description.',
      'Add your organization name, date, and signatory details.',
      'Preview your certificate in real-time on the right panel.',
      'Click "Download PNG" to save your professional certificate.',
    ],
    relatedToolSlugs: ['greeting-card-maker', 'invoice-generator', 'resume-builder', 'marriage-biodata-maker', 'image-watermark'],
    icon: 'Award',
    isNew: true,
    estimatedTime: 'Under 2 min',
  },
  {
    slug: 'exif-metadata-remover',
    name: 'EXIF Metadata Remover',
    shortDescription: 'Remove hidden EXIF metadata from images — strip GPS location, camera info, timestamps, and more.',
    longDescription: `<p>Protect your privacy by removing hidden <strong>EXIF metadata from your photos</strong> before sharing online. EXIF data can reveal your GPS location, camera model, date/time, and other personal information.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Complete Metadata Strip</strong>: Removes EXIF, IPTC, XMP, GPS coordinates, camera info, and timestamps.</li>
<li><strong>Batch Processing</strong>: Process multiple images at once in a single session.</li>
<li><strong>Output Format Choice</strong>: Download as JPEG (with adjustable quality) or lossless PNG.</li>
<li><strong>Canvas Re-encoding</strong>: Re-encodes images via HTML5 Canvas, inherently stripping all embedded metadata.</li>
<li><strong>Instant Processing</strong>: No waiting — results are ready immediately after upload.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for anyone sharing photos on social media, journalists protecting source locations, and privacy-conscious users who don't want GPS or device information embedded in their images.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your images are never uploaded to any server and never leave your device.</p>`,
    category: 'image-tools',
    targetKeyword: 'exif metadata remover',
    secondaryKeywords: ['remove exif data', 'strip metadata from image', 'remove gps from photo', 'image metadata remover online', 'exif remover', 'photo metadata cleaner', 'remove image metadata'],
    metaTitle: 'EXIF Metadata Remover - Strip GPS, Camera Info & Hidden Data from Images',
    metaDescription: 'Remove hidden EXIF metadata from images instantly. Strip GPS location, camera info, timestamps, and more. 100% browser-based, private, and free.',
    faqs: [
      { question: 'What is EXIF metadata?', answer: 'EXIF (Exchangeable Image File Format) is hidden data embedded in images by cameras and phones. It can include GPS coordinates, camera make/model, date/time, lens info, and software used.' },
      { question: 'Why should I remove EXIF data?', answer: 'EXIF data can reveal your exact location, device information, and when a photo was taken. Removing it protects your privacy when sharing images online.' },
      { question: 'Does this tool upload my images?', answer: 'No. All processing happens locally in your browser using the Canvas API. Your images never leave your device.' },
      { question: 'Which image formats are supported?', answer: 'You can upload JPEG, PNG, and WebP images. Output can be saved as JPEG (with adjustable quality) or PNG.' },
      { question: 'Does re-encoding affect image quality?', answer: 'For JPEG output, you can set quality from 70% to 100%. At 92%+ the quality loss is virtually imperceptible. PNG output is lossless.' },
    ],
    howToSteps: [
      'Select your preferred output format (JPEG or PNG) and quality level.',
      'Upload one or more images by dragging and dropping or clicking the upload area.',
      'The tool automatically strips all metadata by re-encoding via Canvas.',
      'Review the before/after file sizes and metadata removal status.',
      'Download individual cleaned images or all at once.',
    ],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'image-cropper', 'png-to-jpg', 'jpg-to-png', 'passport-photo-maker'],
    icon: 'ShieldCheck',
    isNew: true,
    estimatedTime: '1-3 seconds',
  },
  {
    slug: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    shortDescription: 'Generate a valid robots.txt file to control search engine crawling of your website.',
    longDescription: `<p>Create a production-ready <strong>robots.txt file</strong> with an intuitive visual editor — control which pages search engine crawlers can or cannot access on your website.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Quick Presets</strong>: Allow All, Block All, Block AI Bots (GPTBot, ChatGPT-User, CCBot, Google-Extended), Standard, and WordPress Default.</li>
<li><strong>Custom Rules</strong>: Add multiple user-agent groups with Allow/Disallow paths, crawl-delay, and sitemap URLs.</li>
<li><strong>Live Preview</strong>: See your robots.txt output update in real time as you configure rules.</li>
<li><strong>Validation</strong>: Built-in warnings for conflicting rules.</li>
<li><strong>Copy & Download</strong>: Copy to clipboard or download as a robots.txt file.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for SEO professionals, web developers, and website owners who want to control search engine and AI bot crawling without manually writing syntax.</p>
<h2>Privacy & Security</h2>
<p>All generation runs in your browser — no data stored, no signup required.</p>`,
    category: 'seo-tools',
    targetKeyword: 'robots txt generator',
    secondaryKeywords: ['robots.txt generator', 'robots txt file generator', 'create robots txt', 'robots txt maker', 'block ai bots robots txt', 'wordpress robots txt'],
    metaTitle: 'Robots.txt Generator - Create & Download robots.txt File',
    metaDescription: 'Free robots.txt generator with presets for blocking AI bots, WordPress, and more. Visual editor, live preview, copy & download. Create a valid robots.txt in seconds.',
    faqs: [
      { question: 'What is robots.txt?', answer: 'robots.txt is a text file placed at the root of your website (e.g. example.com/robots.txt) that tells search engine crawlers which pages or sections they are allowed or not allowed to crawl.' },
      { question: 'Does robots.txt block pages from appearing in Google?', answer: 'No. robots.txt prevents crawling, not indexing. If other pages link to a disallowed URL, Google may still index it. Use a "noindex" meta tag to prevent indexing.' },
      { question: 'How do I block AI bots like ChatGPT and GPTBot?', answer: 'Add separate User-agent rules for GPTBot, ChatGPT-User, CCBot, and Google-Extended with Disallow: /. Use the "Block AI Bots" preset in this tool for a one-click setup.' },
      { question: 'Does Google respect Crawl-delay?', answer: 'No. Google ignores the Crawl-delay directive. Use Google Search Console to adjust crawl rate for Googlebot. Bing and Yandex do honor Crawl-delay.' },
      { question: 'Where do I put the robots.txt file?', answer: 'Place it at the root of your domain: https://example.com/robots.txt. It must be accessible at that exact URL for crawlers to find it.' },
    ],
    howToSteps: [
      'Choose a quick preset or start from scratch by adding user-agent groups.',
      'Select a user-agent (*, Googlebot, Bingbot, or custom) for each group.',
      'Add Allow and Disallow paths using the + buttons.',
      'Optionally set a Crawl-delay and add Sitemap URLs.',
      'Review the live preview, then copy to clipboard or download the file.',
    ],
    relatedToolSlugs: ['meta-tag-generator', 'text-to-slug', 'html-css-js-editor', 'json-formatter'],
    icon: 'Bot',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'aspect-ratio-calculator',
    name: 'Aspect Ratio Calculator',
    shortDescription: 'Calculate, simplify, and resize aspect ratios for images, videos, and screens.',
    longDescription: `<p>Calculate and convert <strong>aspect ratios</strong> instantly. Two powerful modes help you work with any ratio — check what ratio your dimensions are, or calculate missing dimensions from a known ratio.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Calculate Ratio Mode</strong>: Enter width and height to get the simplified ratio (e.g., 1920x1080 = 16:9), decimal value, and matching standard ratios.</li>
<li><strong>Resize by Ratio Mode</strong>: Pick a preset ratio (16:9, 4:3, 1:1, 21:9, 3:2, 9:16) or custom, enter one dimension, the other calculates automatically.</li>
<li><strong>Visual Preview</strong>: Proportional rectangle preview for the calculated ratio.</li>
<li><strong>Ratio Reference Table</strong>: Common ratios with names, use cases, and example resolutions — click any to use it.</li>
<li><strong>Lock Dimension</strong>: Lock/unlock width or height to control which dimension you're setting.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for video editors, photographers, UI designers, and developers working with responsive layouts, canvas sizes, or social media image dimensions.</p>
<h2>Privacy & Security</h2>
<p>All calculations run instantly in your browser — no data stored, no signup required.</p>`,
    category: 'calculators',
    targetKeyword: 'aspect ratio calculator',
    secondaryKeywords: ['aspect ratio converter', 'screen ratio calculator', 'video aspect ratio', 'image aspect ratio', '16:9 calculator', 'resize aspect ratio'],
    metaTitle: 'Aspect Ratio Calculator - Calculate & Resize Ratios Online Free',
    metaDescription: 'Free aspect ratio calculator. Calculate simplified ratios, resize by preset (16:9, 4:3, 1:1, 21:9), visual preview, and common ratios reference table.',
    faqs: [
      { question: 'What is an aspect ratio?', answer: 'An aspect ratio is the proportional relationship between width and height. For example, 16:9 means for every 16 units of width there are 9 units of height. It is used in screens, videos, images, and print media.' },
      { question: 'What is the most common aspect ratio for videos?', answer: '16:9 is the standard for HD video, YouTube, and modern TVs. Other common ratios include 9:16 for vertical videos (TikTok, Stories), 1:1 for Instagram squares, and 21:9 for ultrawide cinema.' },
      { question: 'How do I calculate aspect ratio from dimensions?', answer: 'Divide both width and height by their Greatest Common Divisor (GCD). For example, 1920/120 = 16 and 1080/120 = 9, giving 16:9.' },
      { question: 'What aspect ratio is 1920x1080?', answer: '1920x1080 is 16:9, the standard Full HD (1080p) resolution used by most monitors, TVs, and video platforms.' },
    ],
    howToSteps: [
      'Enter width and height to calculate the simplified aspect ratio.',
      'View the ratio, decimal value, percentage, and visual preview.',
      'Switch to Resize mode to calculate dimensions from a preset ratio.',
      'Click any ratio in the reference table to use it instantly.',
    ],
    relatedToolSlugs: ['image-resizer', 'image-cropper', 'percentage-calculator', 'unit-converter'],
    icon: 'Maximize',
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'barcode-generator',
  name: 'Barcode Generator',
  shortDescription: 'Generate Code 128, Code 39, and EAN-13 barcodes instantly in your browser.',
  longDescription: `<p>Generate professional <strong>barcodes online</strong> for free. Supports Code 128 (full ASCII), Code 39 (alphanumeric), and EAN-13 (13-digit product codes) — customizable and instantly downloadable.</p>
<h2>Key Features</h2>
<ul>
<li><strong>3 Formats</strong>: Code 128 (most versatile), Code 39 (letters and numbers), and EAN-13 (retail product barcodes with check digit).</li>
<li><strong>Full Customization</strong>: Adjust bar width, height, foreground/background colors, and toggle human-readable text below the barcode.</li>
<li><strong>Batch Mode</strong>: Enter multiple values (one per line) to generate all barcodes simultaneously.</li>
<li><strong>Download & Copy</strong>: Save as PNG or copy to clipboard for immediate use.</li>
<li><strong>Real-Time Preview</strong>: Barcode updates instantly as you type.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for product labeling, inventory management, library systems, shipping labels, and developers testing barcode scanning applications.</p>
<h2>Privacy & Security</h2>
<p>Runs locally in your browser using Canvas API — no data uploaded to any server, completely private.</p>`,
  category: 'developer-tools',
  targetKeyword: 'barcode generator',
  secondaryKeywords: ['barcode maker', 'code 128 generator', 'ean-13 barcode', 'code 39 barcode', 'free barcode generator online', 'barcode creator'],
  metaTitle: 'Barcode Generator - Create Code 128, Code 39 & EAN-13 Barcodes Free',
  metaDescription: 'Generate barcodes online for free. Supports Code 128, Code 39, and EAN-13 formats. Customize colors and size. Download PNG or copy to clipboard. No signup required.',
  faqs: [
    { question: 'What barcode formats are supported?', answer: 'Code 128 (full ASCII, most versatile), Code 39 (A-Z, 0-9, simple), and EAN-13 (13-digit product barcodes with check digit).' },
    { question: 'Is my data uploaded to a server?', answer: 'No. All barcode generation happens locally in your browser using the Canvas API. Your data never leaves your device.' },
    { question: 'Can I generate multiple barcodes at once?', answer: 'Yes! Enable batch mode to enter multiple values (one per line) and generate all barcodes simultaneously.' },
    { question: 'What is the difference between Code 128 and Code 39?', answer: 'Code 128 supports all ASCII characters (32-127) and produces more compact barcodes. Code 39 only supports uppercase letters, digits, and a few symbols but is simpler and widely used in non-retail industries.' },
  ],
  howToSteps: [
    'Select a barcode type: Code 128, Code 39, or EAN-13.',
    'Enter the text or number to encode.',
    'Adjust bar width, height, colors, and text display using the options panel.',
    'Preview the barcode in real-time on the right.',
    'Click "Download PNG" to save or "Copy to Clipboard" to paste elsewhere.',
    'Enable batch mode to generate multiple barcodes from a list.',
  ],
  relatedToolSlugs: ['qr-code-generator', 'uuid-generator', 'hash-generator', 'random-generator'],
  icon: 'BarChart3',
  isNew: true,
  estimatedTime: 'Instant',
  },
  {
    slug: 'privacy-policy-generator',
  name: 'Privacy Policy Generator',
  shortDescription: 'Generate a free, comprehensive privacy policy for your website or app in seconds.',
  longDescription: `<p>Generate a professional <strong>privacy policy</strong> tailored to your website or application in minutes. Fill in your details, select what data you collect, and toggle compliance sections.</p>
<h2>Key Features</h2>
<ul>
<li><strong>GDPR, CCPA & COPPA</strong>: Toggle compliance sections for EU, California, and children's privacy laws.</li>
<li><strong>Data Collection Options</strong>: Select what you collect — personal info, cookies, payment data, location, analytics (Google Analytics, Facebook Pixel).</li>
<li><strong>All Essential Sections</strong>: Information collection, data usage, sharing practices, security measures, and user rights.</li>
<li><strong>Download & Copy</strong>: Save as .txt or .html, or copy to clipboard instantly.</li>
<li><strong>Free & Unlimited</strong>: Generate unlimited policies with no signup.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for website owners, app developers, and SaaS founders who need a comprehensive privacy policy template quickly. Always consult a qualified attorney for legal advice specific to your situation.</p>
<h2>Privacy & Security</h2>
<p>All generation runs in your browser — no data stored on any server.</p>`,
  category: 'seo-tools',
  targetKeyword: 'privacy policy generator',
  secondaryKeywords: ['free privacy policy generator', 'website privacy policy generator', 'privacy policy template', 'GDPR privacy policy generator', 'CCPA privacy policy generator', 'online privacy policy maker'],
  metaTitle: 'Privacy Policy Generator - Free Online Policy Maker',
  metaDescription: 'Generate a free, professional privacy policy for your website or app. Covers GDPR, CCPA, COPPA, cookies, analytics & more. Download as TXT or HTML instantly.',
  faqs: [
    { question: 'Is this privacy policy legally binding?', answer: 'This tool generates a template for informational purposes. While it covers standard legal language, we strongly recommend having a qualified attorney review your privacy policy to ensure it meets all applicable laws for your jurisdiction and business.' },
    { question: 'Do I need a privacy policy for my website?', answer: 'Yes. Most jurisdictions require websites that collect any personal data (including via cookies or analytics) to have a privacy policy. Laws like GDPR (EU), CCPA (California), and IT Act (India) mandate transparency about data practices.' },
    { question: 'What is GDPR and do I need it?', answer: 'GDPR (General Data Protection Regulation) is an EU law that protects personal data of EU residents. If your website has visitors from the EU or you process data of EU citizens, you should include GDPR compliance sections.' },
    { question: 'What is CCPA?', answer: 'CCPA (California Consumer Privacy Act) gives California residents rights over their personal data, including the right to know, delete, and opt-out. Include this section if you have California-based users.' },
    { question: 'Can I download the generated policy?', answer: 'Yes! You can download the privacy policy as a plain text (.txt) file or as a formatted HTML (.html) file. You can also copy the text to clipboard with one click.' },
  ],
  howToSteps: [
    'Enter your company or website name, URL, and contact email.',
    'Select your country and set the effective date.',
    'Toggle the types of data your website collects (personal info, cookies, analytics, etc.).',
    'Enable compliance sections as needed (GDPR, CCPA, COPPA, data retention).',
    'Preview the generated policy, then copy or download as .txt or .html.',
  ],
  relatedToolSlugs: ['meta-tag-generator', 'qr-code-generator', 'password-generator', 'invoice-generator'],
  icon: 'Shield',
  isNew: true,
  estimatedTime: '1-2 minutes',
  },
  {
    slug: 'terms-and-conditions-generator',
    name: 'Terms & Conditions Generator',
    shortDescription: 'Generate comprehensive terms and conditions for your website, app or SaaS. Free template with all essential clauses.',
    longDescription: `<p>Generate professional <strong>Terms & Conditions</strong> (Terms of Service) for your website, mobile app, e-commerce store, or SaaS product. Fill in your business details, select clauses, and get a comprehensive legal document in minutes.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Customizable Clauses</strong>: Toggle user accounts, payments & refunds, intellectual property, user-generated content, prohibited activities, limitation of liability, termination, governing law, and more.</li>
<li><strong>Multiple Site Types</strong>: Blog, e-commerce, SaaS, app, marketplace — each with relevant default clauses.</li>
<li><strong>Standard Legal Language</strong>: Professionally worded to cover all essential legal bases.</li>
<li><strong>Download & Copy</strong>: Save as HTML or plain text, or copy to clipboard.</li>
<li><strong>Free & Unlimited</strong>: Generate unlimited T&C documents with no signup.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for website owners, app developers, and SaaS founders who need T&C documentation quickly. Consulting a legal professional for jurisdiction-specific advice is recommended.</p>
<h2>Privacy & Security</h2>
<p>All generation runs in your browser — no data stored on any server.</p>`,
    category: 'utility-tools',
    targetKeyword: 'terms and conditions generator',
    secondaryKeywords: ['terms and conditions generator free', 'terms of service generator', 'terms and conditions template', 'terms of use generator', 'tos generator', 'free terms and conditions maker', 'website terms generator', 'terms and conditions for website'],
    metaTitle: 'Terms & Conditions Generator - Free T&C Template Online',
    metaDescription: 'Generate free terms & conditions for your website or app. Customizable clauses for payments, privacy, IP, liability & more. Download as HTML or text.',
    faqs: [
      { question: 'Are these terms and conditions legally binding?', answer: 'Our generator creates a comprehensive template based on standard legal practices. For the terms to be enforceable, users must agree to them (e.g., checkbox at signup). We recommend legal review for your specific jurisdiction.' },
      { question: 'What clauses should terms and conditions include?', answer: 'Essential clauses include: acceptance of terms, user responsibilities, intellectual property, limitation of liability, termination, governing law, and dispute resolution. Our generator covers all these and more.' },
      { question: 'Is this generator free?', answer: 'Yes, completely free with no signup, no restrictions, and unlimited use.' },
      { question: 'What is the difference between Terms & Conditions and Privacy Policy?', answer: 'Terms & Conditions govern how users interact with your service (rules, responsibilities, liability). Privacy Policy explains how you collect, use, and protect personal data. Both are needed for most websites.' },
    ],
    howToSteps: [
      'Enter your company/website name, URL, and contact email.',
      'Select your website type (Blog, E-commerce, SaaS, App, etc.).',
      'Toggle which clauses to include in your terms.',
      'Preview the generated terms in real-time.',
      'Copy to clipboard or download as HTML/text file.',
    ],
    relatedToolSlugs: ['privacy-policy-generator', 'robots-txt-generator', 'meta-tag-generator'],
    icon: 'Scale',
    isNew: true,
    estimatedTime: '3 minutes',
  },
  {
    slug: 'rent-agreement-generator',
    name: 'Rent Agreement Generator',
    shortDescription: 'Generate legally formatted rent agreements for India. All states, customizable clauses, free PDF download.',
    longDescription: `<p>Create professional <strong>rent agreements</strong> for any Indian state in minutes — legally formatted documents with all essential clauses ready to print on stamp paper.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Complete Details</strong>: Landlord/tenant info, property details, rent & deposit terms, lock-in period, notice period, and payment mode.</li>
<li><strong>Customizable Clauses</strong>: Toggle pets, parking, sub-letting, smoking, maintenance, and add unlimited custom clauses.</li>
<li><strong>All Property Types</strong>: Apartment, house, room, shop, and office space support.</li>
<li><strong>State Stamp Duty Info</strong>: State-specific stamp duty guidance for all major Indian states.</li>
<li><strong>Aadhaar Masking</strong>: Numbers automatically masked (XXXX-XXXX-1234) for privacy.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for landlords and tenants creating 11-month rental agreements for apartments, rooms, shops, or offices across India.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — Aadhaar, PAN, and financial details never leave your device.</p>`,
    category: 'utility-tools',
    targetKeyword: 'rent agreement generator',
    secondaryKeywords: ['rent agreement format India', 'rental agreement online free', 'rent agreement PDF download', 'rent agreement maker', 'lease agreement generator India', 'rent agreement format PDF', '11 month rent agreement', 'house rent agreement online', 'room rent agreement format'],
    metaTitle: 'Rent Agreement Generator India - Free Rental Agreement PDF Online',
    metaDescription: 'Generate rent agreements for all Indian states. Customizable clauses, stamp duty info, PDF download. Free rent agreement maker — no signup, 100% private.',
    faqs: [
      { question: 'Is this rent agreement legally valid?', answer: 'This tool generates a properly formatted rent agreement with all standard legal clauses. For legal enforceability, print the agreement on appropriate stamp paper (varies by state), get it signed by both parties and two witnesses, and optionally get it notarized or registered.' },
      { question: 'Why is 11 months the standard duration in India?', answer: 'Rent agreements of 11 months or less do not require mandatory registration under the Registration Act, 1908. This saves time and money on registration fees. Agreements of 12 months or more must be registered with the Sub-Registrar office.' },
      { question: 'What stamp paper value do I need?', answer: 'Stamp duty varies by state. For example: Maharashtra charges 0.25% of total rent, Delhi requires Rs 100 stamp paper for up to 5 years, Karnataka charges 1% of annual rent. Our tool shows state-specific stamp duty info.' },
      { question: 'Do I need to register a rent agreement?', answer: 'For agreements up to 11 months, registration is optional in most states but recommended. For 12+ months, registration is mandatory. Registration typically costs 1% of annual rent plus a fixed registration fee.' },
      { question: 'Does this tool store my personal data?', answer: 'Absolutely not. Everything runs in your browser. Your Aadhaar, PAN, address, and financial details are never sent to any server. When you close the page, all data is gone.' },
      { question: 'Can I use this for commercial property?', answer: 'Yes! The tool supports apartments, houses, rooms, shops, and office spaces. Clauses are automatically adjusted based on property type.' },
    ],
    howToSteps: [
      'Enter landlord details — name, address, phone, Aadhaar, PAN.',
      'Enter tenant details — name, address, phone, Aadhaar, occupation.',
      'Add property details — address, city, state, type, furnishing, area.',
      'Set rent terms — monthly rent, deposit, duration, increment, lock-in, notice period.',
      'Toggle clauses — pets, parking, sub-letting, smoking, repairs, custom clauses.',
      'Preview the complete agreement and download as PDF or text.',
    ],
    relatedToolSlugs: ['rent-receipt-generator', 'hra-calculator', 'invoice-generator', 'privacy-policy-generator'],
    icon: 'FileText',
    isNew: true,
    estimatedTime: '3-5 minutes',
  },
  {
    slug: 'letter-application-writer',
    name: 'Letter & Application Writer',
    shortDescription: 'Generate professionally formatted letters and applications for employment, banking, school, and official purposes. India-focused templates.',
    longDescription: `<p>Write professional letters and applications in minutes with our free <strong>Letter & Application Writer</strong>. Choose from 18+ India-focused templates — employment, banking, school/college, official, and personal letters.</p>
<h2>Key Features</h2>
<ul>
<li><strong>18+ Templates</strong>: Leave Application, Resignation, Experience Certificate, Salary Increment, Bank Letters, School Applications, Complaint, NOC Request, Character Certificate, and more.</li>
<li><strong>Fill-in-the-Blank Format</strong>: Just fill your details — the template handles the professional language.</li>
<li><strong>Real-Time Preview</strong>: See your formatted letter update live as you type.</li>
<li><strong>Letter History</strong>: Last 5 letters stored locally for quick access.</li>
<li><strong>PDF & Text Download</strong>: Download in your preferred format, or copy to clipboard.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for employees, students, and individuals in India who need properly formatted official letters quickly without knowing the correct format.</p>
<h2>Privacy & Security</h2>
<p>Works completely offline — no data ever leaves your browser, your personal details stay 100% private.</p>`,
    category: 'utility-tools',
    targetKeyword: 'letter writing format',
    secondaryKeywords: ['leave application format', 'resignation letter format India', 'formal letter generator', 'application letter maker', 'bank letter format', 'letter writing online', 'school leave application', 'complaint letter format', 'official letter format India', 'letter format in English'],
    metaTitle: 'Letter & Application Writer - Free Formal Letter Generator India',
    metaDescription: 'Generate leave applications, resignation letters, bank letters, school applications & more. 18+ India-focused templates. Free PDF download, no signup.',
    faqs: [
      { question: 'What types of letters can I generate?', answer: 'Employment (leave, resignation, experience certificate, salary increment, transfer), Banking (account opening/closing, cheque book, address change), School/College (leave, bonafide, TC), Official (complaint, NOC), and Personal (notice to vacate, character certificate, permission) letters.' },
      { question: 'Are these letters legally valid?', answer: 'These are professionally formatted templates following standard Indian letter-writing conventions. For legal documents, please consult a legal professional. For routine office/school/bank correspondence, these formats are widely accepted.' },
      { question: 'Can I customize the letter content?', answer: 'Yes! Every template has fill-in-the-blank fields. The generated letter updates in real-time as you type. You can also copy and edit the text before downloading.' },
      { question: 'Does this tool store my personal information?', answer: 'No. All processing happens in your browser. Your history is stored in your browser\'s localStorage (only on your device). Nothing is ever sent to a server.' },
      { question: 'Can I download the letter as PDF?', answer: 'Yes! Download as a professional PDF with proper formatting, or as plain text. You can also copy the text to clipboard.' },
    ],
    howToSteps: [
      'Browse or search from 18+ letter templates across 5 categories.',
      'Select the letter type you need (e.g., Leave Application, Bank Letter).',
      'Fill in the required fields — name, date, reason, etc.',
      'Preview your letter in real-time as you type.',
      'Download as PDF or TXT, or copy to clipboard.',
    ],
    relatedToolSlugs: ['rent-agreement-generator', 'invoice-generator', 'resume-builder', 'rent-receipt-generator'],
    icon: 'PenLine',
    isNew: true,
    estimatedTime: '2 minutes',
  },
  {
    slug: 'experience-letter-generator',
    name: 'Experience Letter Generator',
    shortDescription: 'Generate professional experience certificates and relieving letters. Download as PNG — free, instant, no signup.',
    longDescription: `<p>Create professional <strong>experience certificates and relieving letters</strong> instantly. Fill in company and employee details, and download a clean, formal letter as PNG.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Two Letter Types</strong>: Experience Certificate (attesting employment history and performance) or Relieving Letter (confirming formal separation and clearance of dues).</li>
<li><strong>Auto-Adjusted Wording</strong>: Letter language automatically adapts based on performance rating (Excellent/Good/Satisfactory) and reason for leaving (Resignation/End of Contract/Mutual Separation).</li>
<li><strong>Auto Calculations</strong>: Employment duration and reference number auto-generated.</li>
<li><strong>Professional Formatting</strong>: Indian corporate letter format with company seal placeholder and HR signature block.</li>
<li><strong>PNG Download</strong>: High-quality PNG ready for printing on company letterhead.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for HR departments, small businesses, startups, and managers who need to issue employment documents quickly without starting from scratch.</p>
<h2>Privacy & Security</h2>
<p>100% private — all data stays in your browser, nothing is uploaded to any server.</p>`,
    category: 'utility-tools',
    targetKeyword: 'experience letter generator',
    secondaryKeywords: ['experience certificate generator', 'relieving letter generator', 'employment certificate maker', 'work experience letter format', 'experience letter format India', 'relieving letter format', 'service certificate generator', 'experience certificate online', 'HR letter generator free', 'job experience letter maker'],
    metaTitle: 'Experience Letter Generator - Free Experience Certificate & Relieving Letter Maker',
    metaDescription: 'Generate professional experience certificates & relieving letters instantly. Auto-adjusts wording for performance ratings. Download as PNG. Free, private, no signup.',
    faqs: [
      { question: 'What is the difference between an experience certificate and a relieving letter?', answer: 'An experience certificate attests to an employee\'s tenure, role, and performance at a company. A relieving letter confirms that the employee has been formally relieved of duties and all dues have been settled. Both are commonly required when joining a new organisation in India.' },
      { question: 'Is this experience letter legally valid?', answer: 'This tool generates a professional format for reference. For the letter to be legally valid, it must be printed on company letterhead, signed by an authorised signatory, and stamped with the company seal. The generated letter serves as a template/draft.' },
      { question: 'Is my data private and secure?', answer: 'Yes, 100%. All processing happens entirely in your browser. No data is sent to any server, stored, or shared. Your information stays completely private.' },
      { question: 'Can I edit the reference number?', answer: 'Yes, the reference number is auto-generated in the format HR/EXP/YEAR/NUMBER but you can edit it to match your company\'s reference numbering system.' },
    ],
    howToSteps: [
      'Select the letter type — Experience Certificate or Relieving Letter.',
      'Enter company details — name, address, HR name, and designation.',
      'Enter employee details — name, ID, designation, and department.',
      'Set joining date and last working date (duration auto-calculates).',
      'Choose performance rating and reason for leaving.',
      'Preview the letter live and download as PNG.',
    ],
    relatedToolSlugs: ['salary-slip-generator', 'rent-receipt-generator', 'formal-letter-writer', 'invoice-generator', 'resume-builder'],
    icon: 'Award',
    isNew: true,
    estimatedTime: 'Under 2 min',
  },
  {
    slug: 'resignation-letter-generator',
    name: 'Resignation Letter Generator',
    shortDescription: 'Generate professional resignation letters instantly. 4 templates — Standard, Grateful, Immediate & Short. India-focused, free download.',
    longDescription: `<p>Create a professional <strong>resignation letter</strong> in minutes. Choose from 4 templates tailored for different resignation scenarios common in Indian workplaces.</p>
<h2>Key Features</h2>
<ul>
<li><strong>4 Letter Types</strong>: Standard, Grateful (with appreciation), Immediate (with short notice apology), and Short & Simple (3-4 lines).</li>
<li><strong>Auto Last Working Date</strong>: Select notice period (15/30/60/90 days) — last working date calculates automatically.</li>
<li><strong>Tone Options</strong>: Choose Formal, Warm, or Brief tone to match your relationship with the employer.</li>
<li><strong>India-Focused</strong>: Mentions notice period, handover, full & final settlement as Indian HR departments expect.</li>
<li><strong>Preview & Download</strong>: Paper-style preview, copy text, or download as PNG.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for employees in India who need a properly formatted resignation letter quickly — whether giving standard notice or resigning immediately.</p>
<h2>Privacy & Security</h2>
<p>100% client-side — your personal details never leave your browser.</p>`,
    category: 'utility-tools',
    targetKeyword: 'resignation letter generator',
    secondaryKeywords: ['resignation letter format India', 'resignation letter template', 'professional resignation letter', 'resignation letter maker', 'resignation letter online', 'how to write resignation letter', 'notice period resignation letter', 'immediate resignation letter', 'short resignation letter format', 'resignation letter with notice period'],
    metaTitle: 'Resignation Letter Generator - Free Professional Templates India',
    metaDescription: 'Generate professional resignation letters instantly. 4 templates — Standard, Grateful, Immediate & Short. Auto notice period calculator, free PNG download. No signup.',
    faqs: [
      { question: 'What types of resignation letters can I generate?', answer: 'Four types: Standard (professional with notice period), Grateful (emphasizes appreciation and learning), Immediate (urgent resignation with apology for short notice), and Short & Simple (3-4 line minimal resignation). Each adapts based on your chosen tone and reason.' },
      { question: 'How does the notice period calculator work?', answer: 'Select your notice period (15, 30, 60, or 90 days) and the tool automatically calculates your last working date from today. You can also manually pick a custom last working date.' },
      { question: 'Is my personal data safe?', answer: 'Yes. Everything runs in your browser. Your name, company details, and letter content are never sent to any server. Your data stays 100% private.' },
      { question: 'Can I use these letters for actual resignation?', answer: 'Absolutely. The letters follow standard Indian corporate resignation format and mention all necessary elements like notice period, handover, full & final settlement, and exit formalities that HR departments expect.' },
      { question: 'What tone options are available?', answer: 'Three tones: Formal (corporate and professional), Warm (friendly and appreciative), and Brief (concise and to-the-point). The tone adjusts the language throughout the letter.' },
    ],
    howToSteps: [
      'Select a letter type — Standard, Grateful, Immediate, or Short & Simple.',
      'Fill in your details — name, designation, department, and employee ID.',
      'Enter manager name, designation, and company name.',
      'Choose notice period to auto-calculate last working date.',
      'Optionally select reason for leaving and preferred tone.',
      'Preview your letter, then copy text or download as PNG.',
    ],
    relatedToolSlugs: ['letter-application-writer', 'experience-letter-generator', 'salary-slip-generator', 'resume-builder'],
    icon: 'FileText',
    isNew: true,
    estimatedTime: '2 minutes',
  },
  {
    slug: 'period-ovulation-calculator',
    name: 'Period & Ovulation Calculator',
    shortDescription: 'Track your menstrual cycle, predict periods, ovulation dates, and fertile windows. Privacy-first — all calculations happen in your browser.',
    longDescription: `<p>Track and predict your menstrual cycle with our free <strong>period calculator</strong>. Enter your last period date, average cycle length, and period duration to get accurate predictions for upcoming periods, ovulation dates, and fertile windows.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Color-Coded Calendar</strong>: A beautiful 2-month calendar shows period days, ovulation, fertile window, and luteal phase at a glance.</li>
<li><strong>Countdown Cards</strong>: See days remaining until your next period, ovulation, and fertile window.</li>
<li><strong>8-Cycle Forecast Table</strong>: View predicted start dates, end dates, ovulation dates, and fertile windows for up to 8 upcoming cycles.</li>
<li><strong>CSV Export</strong>: Download your cycle data for personal records or to share with your healthcare provider.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Ideal for anyone tracking their menstrual health, planning family, or monitoring fertility. Healthcare providers can use the exported data during consultations.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored on any server. Your cycle history is saved only in your browser's localStorage on your device.</p>`,
    category: 'calculators',
    targetKeyword: 'period calculator',
    secondaryKeywords: ['ovulation calculator', 'fertility calculator', 'menstrual cycle tracker', 'period tracker online', 'ovulation date calculator', 'fertile window calculator', 'next period predictor', 'menstrual calendar', 'cycle length calculator', 'period calculator online free'],
    metaTitle: 'Period & Ovulation Calculator - Free Cycle Tracker & Fertility Predictor',
    metaDescription: 'Track periods, predict ovulation & fertile windows with our free calculator. Color-coded calendar, 8-cycle predictions, CSV export. 100% private — no data leaves your browser.',
    faqs: [
      { question: 'How does the period calculator predict my next period?', answer: 'It uses your last period start date and average cycle length to calculate future period dates. Ovulation is estimated at cycle length minus 14 days, and the fertile window spans 5 days before to 1 day after ovulation.' },
      { question: 'How accurate is the ovulation prediction?', answer: 'The calculator uses the standard medical estimation (ovulation occurs approximately 14 days before your next period). However, actual ovulation can vary. For family planning, consult your healthcare provider and consider using additional methods like ovulation test kits.' },
      { question: 'Is my menstrual data private?', answer: 'Absolutely. All calculations happen entirely in your browser. No data is ever sent to any server. Your saved history is stored only in your browser\'s localStorage on your device.' },
      { question: 'Can I export my cycle data?', answer: 'Yes! Click the "Export CSV" button to download your predicted cycles as a CSV file. You can open this in Excel, Google Sheets, or share it with your healthcare provider.' },
      { question: 'What do the calendar colors mean?', answer: 'Red/pink indicates period days, purple marks ovulation day, blue shows your fertile window, and green represents the luteal phase (between ovulation and your next period).' },
    ],
    howToSteps: [
      'Enter the start date of your last menstrual period.',
      'Set your average cycle length (default 28 days) and period duration (default 5 days).',
      'Click "Calculate Cycle" to see predictions.',
      'View the color-coded calendar, countdown cards, and upcoming cycles table.',
      'Export your data as CSV or save to history for future reference.',
    ],
    relatedToolSlugs: ['bmi-calculator', 'age-calculator', 'calorie-calculator', 'loan-comparison-calculator'],
    icon: 'Heart',
    isNew: true,
    estimatedTime: '1 minute',
  },
  {
    slug: 'social-media-post-mockup',
    name: 'Social Media Post Mockup Generator',
    shortDescription: 'Create realistic social media post mockups for Twitter/X, Instagram, Facebook, and LinkedIn. Download as PNG.',
    longDescription: `<p>Create pixel-perfect <strong>social media post mockups</strong> for Twitter/X, Instagram, Facebook, and LinkedIn. Customize profile name, handle, avatar, post text, engagement numbers, and timestamp. Toggle dark/light mode for each platform.</p>
<h2>Key Features</h2>
<ul>
<li><strong>4 Platforms</strong>: Twitter/X, Instagram, Facebook, and LinkedIn — each matching the real platform UI exactly.</li>
<li><strong>Full Customization</strong>: Set profile name, handle, avatar, post text, engagement stats, and timestamp.</li>
<li><strong>Dark/Light Mode</strong>: Toggle themes for any platform mockup.</li>
<li><strong>PNG Download</strong>: Export as a high-resolution PNG perfect for presentations and marketing.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for marketers, designers, content creators, and social media managers creating presentations, mockups, or social proof assets.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored on any server.</p>`,
    category: 'image-tools',
    targetKeyword: 'social media post mockup generator',
    secondaryKeywords: ['twitter post generator', 'fake tweet generator', 'instagram post mockup', 'linkedin post mockup', 'facebook post generator', 'social media mockup tool', 'tweet screenshot generator', 'social media post template', 'X post mockup'],
    metaTitle: 'Social Media Post Mockup Generator - Twitter, Instagram, Facebook, LinkedIn',
    metaDescription: 'Create realistic social media post mockups for Twitter/X, Instagram, Facebook & LinkedIn. Custom profile, engagement stats, dark mode. Free PNG download.',
    faqs: [
      { question: 'Which social media platforms are supported?', answer: 'Twitter/X, Instagram, Facebook, and LinkedIn. Each mockup matches the real platform UI pixel-perfectly.' },
      { question: 'Can I customize engagement numbers?', answer: 'Yes! You can set custom likes, retweets/reposts, comments, shares, and views for each platform.' },
      { question: 'Is the mockup downloadable?', answer: 'Yes, download as a high-resolution PNG image perfect for presentations and marketing.' },
      { question: 'Does this store my data?', answer: 'No. All processing happens in your browser. History is stored locally on your device only.' },
    ],
    howToSteps: [
      'Select a social media platform (Twitter/X, Instagram, Facebook, or LinkedIn).',
      'Enter profile name, handle, and optionally upload an avatar.',
      'Write your post text and set engagement numbers.',
      'Toggle dark/light mode and preview in real-time.',
      'Download your mockup as PNG.',
    ],
    relatedToolSlugs: ['instagram-carousel-maker', 'youtube-thumbnail-tester', 'og-image-generator', 'screenshot-beautifier'],
    icon: 'Share2',
    isNew: true,
    estimatedTime: '2 minutes',
  },
  {
    slug: 'business-card-maker',
    name: 'Business Card / Visiting Card Maker',
    shortDescription: 'Design professional business cards with 8 templates, QR code, front/back flip preview, and PNG download.',
    longDescription: `<p>Design stunning professional business cards in minutes with our free <strong>business card maker online</strong>. Choose from 8 beautiful templates — Minimal, Corporate, Creative, Gradient, Dark Luxury, Tech, Nature, and Bold. Customize colors, fonts, and add your logo.</p>
<h2>Key Features</h2>
<ul>
<li><strong>8 Templates</strong>: Minimal, Corporate, Creative, Gradient, Dark Luxury, Tech, Nature, and Bold styles.</li>
<li><strong>Front & Back Design</strong>: Realistic flip animation to preview both sides of your card.</li>
<li><strong>Auto QR Code</strong>: Auto-generated vCard QR code on the back with your contact details.</li>
<li><strong>Logo Upload</strong>: Add your company logo to personalize the card.</li>
<li><strong>PNG Download</strong>: Download both sides as high-quality PNG images.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for freelancers, entrepreneurs, professionals, and businesses who need a polished visiting card without hiring a designer.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored on any server.</p>`,
    category: 'image-tools',
    targetKeyword: 'business card maker online',
    secondaryKeywords: ['visiting card maker', 'business card generator free', 'visiting card design online', 'business card template', 'professional card maker', 'free business card creator', 'business card with QR code', 'visiting card maker India'],
    metaTitle: 'Business Card Maker Online Free - 8 Professional Templates with QR Code',
    metaDescription: 'Design professional business cards with 8 templates, custom colors, logo upload, QR code. Front & back preview with flip animation. Free PNG download.',
    faqs: [
      { question: 'How many templates are available?', answer: '8 professionally designed templates: Minimal, Corporate, Creative, Gradient, Dark Luxury, Tech, Nature, and Bold.' },
      { question: 'Can I add a QR code?', answer: 'Yes! A vCard QR code is automatically generated on the back of the card with your contact details.' },
      { question: 'What format is the download?', answer: 'Cards are downloaded as high-quality PNG images, with separate files for front and back.' },
      { question: 'Can I upload my company logo?', answer: 'Yes, you can upload a logo that will be displayed on your business card.' },
    ],
    howToSteps: [
      'Choose a card template from the visual grid.',
      'Enter your details — name, title, company, phone, email, website.',
      'Customize colors, font, and optionally upload a logo.',
      'Preview front and back with the flip animation.',
      'Download as PNG.',
    ],
    relatedToolSlugs: ['social-media-post-mockup', 'invoice-generator', 'resume-builder', 'qr-code-generator'],
    icon: 'CreditCard',
    isNew: true,
    estimatedTime: '3 minutes',
  },
  {
    slug: 'tdee-macro-calculator',
    name: 'TDEE & Macro Calculator (Indian Foods)',
    shortDescription: 'Calculate your TDEE and macros with Mifflin-St Jeor formula. Includes 45+ Indian food database and meal planner.',
    longDescription: `<p>Calculate your <strong>TDEE (Total Daily Energy Expenditure)</strong> and macronutrient breakdown using the Mifflin-St Jeor equation. Features a comprehensive Indian food database with 45+ items across 8 categories.</p>
<h2>Key Features</h2>
<ul>
<li><strong>3-Step Wizard</strong>: Personal details, activity level, and goal (lose/maintain/gain weight).</li>
<li><strong>BMR & TDEE</strong>: Mifflin-St Jeor calculation with animated donut chart macro breakdown.</li>
<li><strong>Indian Food Database</strong>: 45+ dishes — Dal, Paneer, Biryani, Roti, Dosa across 8 categories.</li>
<li><strong>Meal Planner</strong>: Track running calorie totals vs your TDEE target.</li>
<li><strong>CSV Export</strong>: Download your meal plan with full nutritional details.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Ideal for fitness enthusiasts, dieters, and anyone tracking calorie intake using Indian foods. Great for weight loss, muscle gain, and maintenance goals.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored on any server.</p>`,
    category: 'calculators',
    targetKeyword: 'TDEE calculator',
    secondaryKeywords: ['macro calculator', 'calorie calculator India', 'TDEE calculator with Indian food', 'macronutrient calculator', 'BMR calculator', 'Indian food calories', 'meal planner India', 'calorie counter Indian food', 'protein calculator India'],
    metaTitle: 'TDEE & Macro Calculator - Indian Foods Database & Meal Planner',
    metaDescription: 'Calculate TDEE & macros with Mifflin-St Jeor formula. 45+ Indian foods database, meal planner, animated donut chart. Free, private, no signup.',
    faqs: [
      { question: 'What is TDEE?', answer: 'Total Daily Energy Expenditure — the total calories your body burns in a day, including exercise. It is calculated by multiplying your BMR by an activity factor.' },
      { question: 'Which formula is used?', answer: 'The Mifflin-St Jeor equation, which is considered the most accurate BMR formula. Male: 10W + 6.25H - 5A + 5. Female: 10W + 6.25H - 5A - 161.' },
      { question: 'What Indian foods are included?', answer: '45+ items across 8 categories: Dal & Pulses, Rice & Roti, Vegetables, Non-Veg, Snacks, Dairy, Fruits, and Sweets. Each with calories, protein, carbs, and fat per serving.' },
      { question: 'Can I export my meal plan?', answer: 'Yes! Export your meal plan as CSV with all nutritional details and daily totals.' },
    ],
    howToSteps: [
      'Enter your age, gender, height, and weight.',
      'Select your activity level (Sedentary to Extremely Active).',
      'Choose your goal — lose, maintain, or gain weight.',
      'View your TDEE, BMR, and macro breakdown.',
      'Build a meal plan from the Indian food database.',
    ],
    relatedToolSlugs: ['bmi-calculator', 'calorie-calculator', 'period-ovulation-calculator', 'age-calculator'],
    icon: 'Apple',
    isNew: true,
    estimatedTime: '2 minutes',
  },
  {
    slug: 'stamp-duty-calculator',
    name: 'Stamp Duty Calculator (All Indian States)',
    shortDescription: 'Calculate stamp duty, registration fees, and total charges for property purchase across all 28 Indian states and 8 UTs.',
    longDescription: `<p>Calculate <strong>stamp duty</strong> and registration charges for property purchases across all 28 Indian states and 8 Union Territories. Get accurate rates with concessions for women buyers, senior citizens, and joint registrations.</p>
<h2>Key Features</h2>
<ul>
<li><strong>All States & UTs</strong>: Covers all 28 states and 8 Union Territories with current stamp duty and registration rates.</li>
<li><strong>GST Calculation</strong>: Includes GST for under-construction properties and total cost breakdown with animated stacked bar chart.</li>
<li><strong>State Comparison</strong>: Compare stamp duty across top states for the same property value.</li>
<li><strong>Women Buyer Concessions</strong>: Auto-applies reduced stamp duty for female buyers where applicable.</li>
<li><strong>Saving Tips & Glossary</strong>: Helpful tips, complete rates reference, and property registration terminology.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Ideal for home buyers, real estate investors, and property sellers across India looking to plan registration costs before purchasing.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored on any server.</p>`,
    category: 'calculators',
    targetKeyword: 'stamp duty calculator',
    secondaryKeywords: ['stamp duty calculator India', 'registration charges calculator', 'stamp duty rates all states', 'property registration cost', 'stamp duty for women', 'stamp duty Maharashtra', 'stamp duty Delhi', 'property stamp duty calculator', 'house registration charges India'],
    metaTitle: 'Stamp Duty Calculator India - All States & UTs with Registration Charges',
    metaDescription: 'Calculate stamp duty & registration fees for all 28 Indian states. Women buyer concessions, GST, state comparison. Free instant calculator.',
    faqs: [
      { question: 'Which states are covered?', answer: 'All 28 Indian states and 8 Union Territories with accurate stamp duty and registration rates.' },
      { question: 'Do women get concessions?', answer: 'Yes! Many states offer reduced stamp duty for women buyers and joint registrations. The calculator automatically applies these concessions.' },
      { question: 'Is GST included?', answer: 'Yes, for under-construction properties. Affordable housing has 1% GST, non-affordable has 5% GST. Ready-to-move properties have no GST.' },
      { question: 'How accurate are the rates?', answer: 'Rates are based on current published state government data. Always verify with your local sub-registrar office for the latest rates.' },
    ],
    howToSteps: [
      'Select your state and property type.',
      'Enter the property value and choose buyer category.',
      'View instant stamp duty, registration, and total cost breakdown.',
      'Compare rates across states.',
      'Export the calculation report.',
    ],
    relatedToolSlugs: ['rent-vs-buy-calculator', 'emi-calculator', 'rent-agreement-generator', 'hra-calculator'],
    icon: 'Landmark',
    isNew: true,
    estimatedTime: '1 minute',
  },
  {
    slug: 'youtube-thumbnail-tester',
    name: 'YouTube Thumbnail A/B Tester',
    shortDescription: 'Compare YouTube thumbnails in realistic contexts — homepage, search, sidebar, mobile. A/B vote mode with analysis.',
    longDescription: `<p>Upload 2–4 thumbnails and use our free <strong>YouTube thumbnail tester</strong> to preview them in realistic contexts — homepage feed, search results, sidebar, and mobile feed. Compare side by side to pick the best one.</p>
<h2>Key Features</h2>
<ul>
<li><strong>4 Preview Contexts</strong>: Homepage feed, search results, sidebar suggestions, and mobile feed.</li>
<li><strong>A/B Vote Mode</strong>: Head-to-head comparison with animated vote counters and percentage bars.</li>
<li><strong>Analysis Tips</strong>: Feedback on contrast, brightness, aspect ratio, and resolution.</li>
<li><strong>Dark/Light Mode</strong>: Toggle YouTube themes to see thumbnails in both display modes.</li>
<li><strong>PNG Download</strong>: Download your thumbnail comparison to share with collaborators.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for YouTubers, video marketers, and content creators optimizing click-through rates before publishing.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no server uploads, no data stored.</p>`,
    category: 'image-tools',
    targetKeyword: 'youtube thumbnail tester',
    secondaryKeywords: ['youtube thumbnail preview', 'thumbnail A/B test', 'youtube thumbnail comparison', 'thumbnail tester online', 'youtube thumbnail checker', 'youtube thumbnail preview tool', 'thumbnail AB testing', 'CTR optimization youtube'],
    metaTitle: 'YouTube Thumbnail A/B Tester - Preview & Compare Thumbnails Free',
    metaDescription: 'Compare YouTube thumbnails in realistic contexts. A/B vote mode, analysis tips, dark/light mode. Upload 2-4 thumbnails and find the best one. Free.',
    faqs: [
      { question: 'How many thumbnails can I compare?', answer: 'Upload 2 to 4 thumbnails at once for comparison across all YouTube contexts.' },
      { question: 'What preview contexts are available?', answer: 'Homepage feed (grid), search results (list), sidebar suggestions (small thumbnails), and mobile feed (full-width cards).' },
      { question: 'How does the A/B vote mode work?', answer: 'Two thumbnails are shown side by side. Click to vote for the better one. Vote counts and percentages update in real-time with animations.' },
      { question: 'Does this upload my thumbnails to a server?', answer: 'No. Everything is processed locally in your browser. Your images never leave your device.' },
    ],
    howToSteps: [
      'Upload 2-4 thumbnail images via drag & drop or file picker.',
      'Preview in different YouTube contexts — homepage, search, sidebar, mobile.',
      'Set video title, channel name, and view count.',
      'Use A/B vote mode to compare thumbnails.',
      'Download comparison as PNG.',
    ],
    relatedToolSlugs: ['social-media-post-mockup', 'instagram-carousel-maker', 'image-resizer', 'og-image-generator'],
    icon: 'Youtube',
    isNew: true,
    estimatedTime: '2 minutes',
  },
  {
    slug: 'instagram-carousel-maker',
    name: 'Instagram Carousel Maker',
    shortDescription: 'Create beautiful Instagram carousel posts with up to 10 slides. Custom backgrounds, text, templates, and PNG download.',
    longDescription: `<p>Create stunning <strong>Instagram carousel</strong> posts with up to 10 slides. Choose from solid colors, gradient backgrounds, or upload images. Add headlines, body text, and customize fonts, colors, and alignment.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Up to 10 Slides</strong>: Match Instagram's maximum slide count per post.</li>
<li><strong>5 Templates</strong>: Title Slide, Quote Slide, Tip/Fact, Numbered List, and CTA Slide.</li>
<li><strong>Custom Backgrounds</strong>: Solid colors, 17+ gradient presets, or upload your own image.</li>
<li><strong>Live Preview</strong>: Instagram-style swipe navigation with dots indicator.</li>
<li><strong>PNG Download</strong>: Export individual or all slides as 1080x1080 PNG images.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for content creators, marketers, educators, and brands building engaging Instagram carousel content without design software.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored on any server.</p>
`,
    category: 'image-tools',
    targetKeyword: 'instagram carousel maker',
    secondaryKeywords: ['instagram carousel creator', 'carousel post maker', 'instagram slide maker', 'instagram carousel template', 'social media carousel', 'carousel post generator', 'instagram carousel design', 'free carousel maker online'],
    metaTitle: 'Instagram Carousel Maker - Create Multi-Slide Posts Free',
    metaDescription: 'Create Instagram carousels with up to 10 slides. Custom backgrounds, gradients, text, 5 templates. Download as 1080x1080 PNG. Free, no signup.',
    faqs: [
      { question: 'How many slides can I create?', answer: 'Up to 10 slides per carousel, matching Instagram\'s maximum.' },
      { question: 'What templates are available?', answer: '5 templates: Title Slide, Quote Slide, Tip/Fact Slide, Numbered List, and CTA (Call to Action) Slide.' },
      { question: 'What size are the slides?', answer: 'All slides are 1080x1080 pixels (1:1 ratio), the standard Instagram post size.' },
      { question: 'Can I use custom backgrounds?', answer: 'Yes! Choose from solid colors, 17+ gradient presets, or upload your own background image.' },
    ],
    howToSteps: [
      'Add slides and choose a template or start blank.',
      'Set background (color, gradient, or image) for each slide.',
      'Add headline and body text with custom fonts and colors.',
      'Preview with Instagram-style swipe navigation.',
      'Download slides as PNG.',
    ],
    relatedToolSlugs: ['social-media-post-mockup', 'youtube-thumbnail-tester', 'image-resizer', 'og-image-generator'],
    icon: 'LayoutGrid',
    isNew: true,
    estimatedTime: '5 minutes',
  },
  {
    slug: 'citation-generator',
    name: 'Citation Generator',
    shortDescription: 'Generate academic citations in APA, MLA, Chicago, Harvard, IEEE, and Vancouver. Support 8 source types with bibliography builder.',
    longDescription: `<p>Generate properly formatted academic citations with our free <strong>citation generator</strong>. Supports APA 7th, MLA 9th, Chicago, Harvard, IEEE, and Vancouver styles across 8 source types: Book, Journal Article, Website, Conference Paper, Thesis, Newspaper, Video, and Report.</p>
<h2>Key Features</h2>
<ul>
<li><strong>6 Citation Styles</strong>: APA 7th, MLA 9th, Chicago, Harvard, IEEE, and Vancouver.</li>
<li><strong>8 Source Types</strong>: Book, Journal Article, Website, Conference Paper, Thesis, Newspaper, Video, Report.</li>
<li><strong>Multiple Authors</strong>: Proper "et al." rules automatically applied per style.</li>
<li><strong>Real-Time Preview</strong>: See both in-text citation and reference list entry instantly.</li>
<li><strong>Bibliography Builder</strong>: Add, reorder, sort alphabetically, and export as TXT.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Essential for students, researchers, academics, and writers who need accurate, consistently formatted citations for essays, papers, and publications.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored on any server.</p>`,
    category: 'text-tools',
    targetKeyword: 'citation generator',
    secondaryKeywords: ['APA citation generator', 'MLA citation generator', 'Harvard referencing generator', 'bibliography generator', 'reference generator free', 'Chicago citation maker', 'IEEE citation format', 'academic citation tool', 'cite sources online', 'Vancouver citation generator'],
    metaTitle: 'Citation Generator - APA, MLA, Chicago, Harvard, IEEE, Vancouver Free',
    metaDescription: 'Generate citations in APA 7th, MLA 9th, Chicago, Harvard, IEEE & Vancouver. 8 source types, bibliography builder. Free, accurate, no signup.',
    faqs: [
      { question: 'Which citation styles are supported?', answer: 'APA 7th Edition, MLA 9th Edition, Chicago (Notes-Bibliography), Harvard, IEEE, and Vancouver.' },
      { question: 'What source types can I cite?', answer: 'Book, Journal Article, Website, Conference Paper, Thesis/Dissertation, Newspaper Article, Video/Film, and Report.' },
      { question: 'Can I build a bibliography?', answer: 'Yes! Add multiple citations to a bibliography list, sort alphabetically, reorder, and export the entire list as a text file.' },
      { question: 'Are the citations accurate?', answer: 'Citations follow the official formatting rules for each style, including proper "et al." rules, italics, and punctuation. Always verify with your institution\'s guidelines.' },
    ],
    howToSteps: [
      'Select a citation style (APA, MLA, Chicago, etc.).',
      'Choose the source type (Book, Journal, Website, etc.).',
      'Fill in the source details — author(s), title, year, etc.',
      'Copy the generated in-text citation and reference entry.',
      'Add to bibliography and export when done.',
    ],
    relatedToolSlugs: ['essay-counter-readability', 'ai-text-humanizer', 'word-counter', 'case-converter'],
    icon: 'BookOpen',
    isNew: true,
    estimatedTime: '2 minutes',
  },
  {
    slug: 'rent-vs-buy-calculator',
    name: 'Rent vs Buy Calculator (India)',
    shortDescription: 'Compare renting vs buying a home in India. Factors in stamp duty, tax benefits (80C, 24b), HRA, and investment returns.',
    longDescription: `<p>Decide whether to rent or buy a home with our free <strong>rent vs buy calculator India</strong>. Accounts for stamp duty, registration charges, GST, Section 24b home loan interest deduction, Section 80C principal deduction, and HRA tax exemption.</p>
<h2>Key Features</h2>
<ul>
<li><strong>5–30 Year Analysis</strong>: Animated line charts comparing cumulative costs and net worth over time.</li>
<li><strong>Tax Benefits</strong>: Factors in Section 80C, Section 24b, and HRA exemption for accurate comparisons.</li>
<li><strong>Investment Returns</strong>: Calculates returns on surplus savings if you rent instead of buy.</li>
<li><strong>Year-by-Year Table</strong>: Clear winner badges showing which option is better each year.</li>
<li><strong>CSV Export</strong>: Download the full breakdown for reference or sharing with a financial advisor.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Ideal for Indian home buyers, renters, and financial planners evaluating the long-term economics of renting versus buying property.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored on any server.</p>`,
    category: 'calculators',
    targetKeyword: 'rent vs buy calculator India',
    secondaryKeywords: ['rent or buy calculator', 'should I rent or buy India', 'rent vs buy comparison', 'home buying calculator India', 'rent vs EMI calculator', 'property investment calculator', 'rent vs buy break even', 'housing affordability calculator India'],
    metaTitle: 'Rent vs Buy Calculator India - Compare with Tax Benefits & Investment Returns',
    metaDescription: 'Should you rent or buy in India? Compare costs with stamp duty, Section 80C/24b tax benefits, HRA, investment returns. Year-by-year analysis. Free.',
    faqs: [
      { question: 'What Indian-specific factors are included?', answer: 'Stamp duty, registration charges, GST on under-construction, Section 24(b) interest deduction (up to 2L), Section 80C principal deduction (up to 1.5L), and HRA tax exemption.' },
      { question: 'How is the investment return calculated?', answer: 'If renting, the money saved on down payment and stamp duty is assumed to be invested. Monthly surplus (EMI minus rent) is also invested. You choose the return rate (FD, Index Fund, or Equity MF).' },
      { question: 'What is the break-even year?', answer: 'The year when the total cost of buying becomes less than the total cost of renting, including investment returns on saved money.' },
      { question: 'Can I export the comparison?', answer: 'Yes! Export the year-by-year breakdown as CSV for your records.' },
    ],
    howToSteps: [
      'Enter property price, down payment, and loan details.',
      'Set monthly rent and expected rent increase.',
      'Choose investment return rate for surplus savings.',
      'Set analysis period (5-30 years).',
      'View verdict, charts, and year-by-year breakdown.',
    ],
    relatedToolSlugs: ['stamp-duty-calculator', 'emi-calculator', 'hra-calculator', 'rent-agreement-generator'],
    icon: 'Home',
    isNew: true,
    estimatedTime: '3 minutes',
  },
  {
    slug: 'css-animation-generator',
    name: 'CSS Animation Generator',
    shortDescription: 'Visual CSS animation builder with 17 presets, keyframe editor, cubic-bezier curve editor, and live preview.',
    longDescription: `<p>Build CSS animations visually with our free <strong>CSS animation generator</strong>. Choose from 17 presets — Bounce, Fade, Slide, Spin, Pulse, Shake, Flip, and more — or create fully custom animations from scratch.</p>
<h2>Key Features</h2>
<ul>
<li><strong>17 Presets</strong>: Bounce, Fade In/Out, Slide, Spin, Pulse, Shake, Flip, Swing, Zoom, and more.</li>
<li><strong>Keyframe Editor</strong>: Visual timeline with per-keyframe property controls for transform, opacity, and filters.</li>
<li><strong>Cubic-Bezier Editor</strong>: Drag control points to define custom easing functions with live curve preview.</li>
<li><strong>Real CSS Preview</strong>: Live preview injects actual @keyframes CSS — exactly what your code will produce.</li>
<li><strong>Code Export</strong>: Copy generated CSS with syntax highlighting ready for your project.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for front-end developers, UI designers, and CSS learners who want to create polished animations without writing code from scratch.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored on any server.</p>
`,
    category: 'developer-tools',
    targetKeyword: 'CSS animation generator',
    secondaryKeywords: ['CSS keyframe generator', 'CSS animation builder', 'CSS animation maker online', 'keyframe animation tool', 'CSS transition generator', 'cubic bezier editor', 'CSS animation code generator', 'animate CSS online', 'CSS animation playground'],
    metaTitle: 'CSS Animation Generator - Visual Keyframe Builder & Cubic Bezier Editor',
    metaDescription: 'Build CSS animations visually. 17 presets, keyframe editor, cubic-bezier curve editor, live preview. Copy generated CSS code. Free online tool.',
    faqs: [
      { question: 'What animation presets are available?', answer: '17 presets: Bounce, Fade In/Out, Slide In (4 directions), Spin, Pulse, Shake, Flip, Swing, Rubber Band, Jello, Heart Beat, Zoom In/Out.' },
      { question: 'Can I create custom animations?', answer: 'Yes! Add keyframes at any percentage, customize transform, opacity, background, border-radius, shadow, and filter properties for each keyframe.' },
      { question: 'Does the preview use real CSS?', answer: 'Yes! The live preview uses actual CSS @keyframes injected via a style tag, not a JavaScript animation library. What you see is exactly what the CSS will produce.' },
      { question: 'What is the cubic-bezier editor?', answer: 'A visual curve editor where you drag two control points to define a custom timing function. The curve updates in real-time.' },
    ],
    howToSteps: [
      'Choose an animation preset or start custom.',
      'Adjust duration, timing, delay, and other properties.',
      'Edit keyframes on the visual timeline.',
      'Preview the animation with play/pause/restart controls.',
      'Copy the generated CSS code.',
    ],
    relatedToolSlugs: ['tailwind-playground', 'css-gradient-text-generator', 'color-palette-generator', 'box-shadow-generator'],
    icon: 'Sparkles',
    isNew: true,
    estimatedTime: '3 minutes',
  },
  {
    slug: 'essay-counter-readability',
    name: 'Essay Counter + Readability Analyzer',
    shortDescription: 'Count words, characters, sentences. Get Flesch, Gunning Fog, SMOG readability scores. Word frequency and writing tips.',
    longDescription: `<p>Comprehensive text analysis counting words, characters, sentences, and paragraphs. Calculate 6 readability scores with our free <strong>essay word counter</strong> — Flesch Reading Ease, Gunning Fog, SMOG, Coleman-Liau, and more — all updating in real-time as you type.</p>
<h2>Key Features</h2>
<ul>
<li><strong>6 Readability Scores</strong>: Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog, Coleman-Liau, SMOG, and ARI.</li>
<li><strong>Visual Gauges</strong>: Semi-circular gauge visualizations for each readability score.</li>
<li><strong>Word Frequency</strong>: Bar chart analysis of top content words, excluding stop words.</li>
<li><strong>Sentence Distribution</strong>: Histogram showing sentence length patterns in your text.</li>
<li><strong>Writing Suggestions</strong>: Actionable tips to improve clarity and readability.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Ideal for students, writers, bloggers, content creators, and SEO professionals who need to optimize writing for clarity, grade level, and engagement.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored on any server.</p>`,
    category: 'text-tools',
    targetKeyword: 'essay word counter',
    secondaryKeywords: ['readability checker', 'word counter online', 'readability score calculator', 'Flesch reading ease calculator', 'text analyzer', 'essay readability checker', 'Gunning Fog calculator', 'writing analyzer', 'character counter', 'sentence counter'],
    metaTitle: 'Essay Counter + Readability Analyzer - Flesch, Gunning Fog, SMOG & More',
    metaDescription: 'Count words, characters, sentences. Get 6 readability scores (Flesch, Gunning Fog, SMOG, ARI). Word frequency, writing tips. Free real-time analysis.',
    faqs: [
      { question: 'What readability scores are calculated?', answer: 'Flesch Reading Ease (0-100), Flesch-Kincaid Grade Level, Gunning Fog Index, Coleman-Liau Index, SMOG Index, and Automated Readability Index (ARI).' },
      { question: 'How is reading time calculated?', answer: 'Based on an average reading speed of 200 words per minute. Speaking time uses 130 words per minute.' },
      { question: 'What writing suggestions does it provide?', answer: 'Flags long sentences (>30 words), passive voice hints, overused words, vocabulary richness feedback, and paragraph structure suggestions.' },
      { question: 'Does it work in real-time?', answer: 'Yes! All statistics, readability scores, and suggestions update instantly as you type.' },
    ],
    howToSteps: [
      'Paste or type your text in the editor.',
      'View real-time word count, character count, and other stats.',
      'Check readability scores with visual gauges.',
      'Review word frequency and sentence distribution.',
      'Read writing improvement suggestions.',
    ],
    relatedToolSlugs: ['reading-time-calculator', 'word-counter', 'citation-generator', 'ai-text-humanizer', 'paraphrasing-tool'],
    icon: 'FileText',
    isNew: true,
    estimatedTime: '1 minute',
  },
  {
    slug: 'font-identifier',
    name: 'Font Identifier from Image',
    shortDescription: 'Upload an image with text and visually match it against 50+ system fonts. Compare side by side, adjust size/weight/spacing.',
    longDescription: `<p>Use our free <strong>font identifier from image</strong> to find fonts by visual comparison. Upload an image with text, type the same text, and browse 50+ system fonts to find the closest match.</p>
<h2>Key Features</h2>
<ul>
<li><strong>50+ Fonts</strong>: Grouped by Sans-Serif, Serif, Monospace, Display, and Handwriting categories.</li>
<li><strong>Precise Matching</strong>: Adjust font size, weight (100–900), style, letter spacing, and line height.</li>
<li><strong>Side-by-Side Compare</strong>: Star your best matches and compare up to 3 fonts against the original image.</li>
<li><strong>CSS Export</strong>: Copy the CSS font-family declaration for your matched font.</li>
<li><strong>Grid/List View</strong>: Toggle between gallery views for easy browsing.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for designers, developers, and branding professionals who need to identify or recreate fonts from logos, screenshots, and printed materials.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored on any server.</p>
`,
    category: 'image-tools',
    targetKeyword: 'font identifier from image',
    secondaryKeywords: ['what font is this', 'identify font from image', 'font finder', 'font matcher', 'font recognition', 'what font is used', 'font detector', 'find font from screenshot', 'font identification tool'],
    metaTitle: 'Font Identifier from Image - Match & Compare 50+ Fonts Free',
    metaDescription: 'Upload an image and identify the font by visual comparison. 50+ fonts, side-by-side matching, adjust size/weight/spacing. Copy CSS. Free, no signup.',
    faqs: [
      { question: 'How does the font identification work?', answer: 'Upload an image with text, type the same text, and visually compare it against 50+ system fonts. Adjust font properties until you find the closest match.' },
      { question: 'What fonts are available for comparison?', answer: '50+ cross-platform system fonts across 5 categories: Sans-Serif, Serif, Monospace, Display, and Handwriting.' },
      { question: 'Can I compare multiple fonts at once?', answer: 'Yes! Star your best matches and use the side-by-side comparison mode to compare up to 3 fonts against the original image.' },
      { question: 'Does this use AI or machine learning?', answer: 'No, this is a visual matching tool. You compare fonts manually which gives you full control over the matching process. All processing is client-side.' },
    ],
    howToSteps: [
      'Upload an image containing the text/font you want to identify.',
      'Type the same text in the sample text field.',
      'Browse fonts by category or search by name.',
      'Adjust size, weight, and spacing to match.',
      'Star best matches and copy CSS.',
    ],
    relatedToolSlugs: ['social-media-post-mockup', 'business-card-maker', 'css-gradient-text-generator', 'image-to-text'],
    icon: 'Type',
    isNew: true,
    estimatedTime: '3 minutes',
  },
  {
    slug: 'roast-my-website',
    name: 'Roast My Website',
    shortDescription: 'Get a humorous but helpful website audit. URL analysis, 20-point checklist, and a witty roast report with actionable feedback.',
    longDescription: `<p>Get your website roasted with humor and helpful feedback! Enter your URL, upload a screenshot, and answer a quick 20-question audit checklist to get your free <strong>roast my website</strong> report covering SEO, performance, design, content, security, and UX.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Comprehensive Score</strong>: Overall score (0–100) with letter grade and fun titles from "Digital Dumpster Fire" to "Absolute Legend."</li>
<li><strong>20-Point Checklist</strong>: Category-by-category audit across SEO, performance, design, content, security, and UX.</li>
<li><strong>URL Analysis</strong>: Automatically checks HTTPS, domain quality, TLD, and URL structure.</li>
<li><strong>Witty Commentary</strong>: Humorous roast commentary alongside serious actionable recommendations.</li>
<li><strong>PNG Share</strong>: Download and share your roast result as a PNG image.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for developers, startup founders, and marketers who want a fun but honest reality check on their website's fundamentals.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no server access to your website, no data stored.</p>`,
    category: 'developer-tools',
    targetKeyword: 'roast my website',
    secondaryKeywords: ['website roast', 'website audit tool', 'website checker', 'website analyzer', 'site audit free', 'website review tool', 'website grader', 'web audit checklist', 'website score checker'],
    metaTitle: 'Roast My Website - Fun Website Audit with Scores & Actionable Tips',
    metaDescription: 'Get your website roasted! URL analysis, 20-point audit, witty roast report with scores in SEO, performance, design, UX. Share as PNG. Free & fun.',
    faqs: [
      { question: 'How does the roasting work?', answer: 'Enter your URL, upload a screenshot, and answer 20 yes/no questions about your site. The tool analyzes your URL and checklist answers to generate a humorous but helpful roast report.' },
      { question: 'Is this a real website audit?', answer: 'It combines automated URL analysis with a self-reported checklist. While it is not a replacement for tools like Lighthouse, it covers key areas (SEO, performance, design, content, security, UX) and provides actionable tips.' },
      { question: 'Can I share my roast result?', answer: 'Yes! Download your roast report as a PNG image to share on social media.' },
      { question: 'Does this access my website?', answer: 'No. Due to browser security (CORS), the tool cannot fetch your website directly. URL analysis is done on the URL text itself, and site features are self-reported via the checklist.' },
    ],
    howToSteps: [
      'Enter your website URL.',
      'Optionally upload a homepage screenshot.',
      'Answer the 20-question quick audit checklist.',
      'Click "Roast My Website" to generate the report.',
      'Review scores, roast commentary, and recommendations.',
    ],
    relatedToolSlugs: ['meta-tag-generator', 'og-image-generator', 'privacy-policy-generator', 'css-animation-generator'],
    icon: 'Flame',
    isNew: true,
    estimatedTime: '3 minutes',
  },
  {
    slug: 'tailwind-playground',
    name: 'Tailwind CSS Playground',
    shortDescription: 'Live Tailwind CSS playground with class editor, visual builder, color palette, autocomplete, and CSS output.',
    longDescription: `<p>A live <strong>Tailwind CSS playground</strong> where you type classes and see an instant visual preview. Two modes: Class Editor for typing classes directly, and Visual Builder for clicking through categorized Tailwind utilities.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Class Editor</strong>: Autocomplete suggestions, class validation (green = valid, red = unknown), and box model visualizer.</li>
<li><strong>Visual Builder</strong>: 9 categories with clickable class buttons and full Tailwind color palette grids.</li>
<li><strong>Responsive Preview</strong>: Toggle between mobile, tablet, and desktop breakpoints.</li>
<li><strong>CSS Output</strong>: See the equivalent raw CSS for every Tailwind class you apply.</li>
<li><strong>8 Snippets</strong>: Pre-built examples to jump-start your prototyping.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for front-end developers learning Tailwind CSS, rapid UI prototyping, and anyone who wants to see what Tailwind classes produce without setting up a project.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no uploads, no data stored on any server.</p>
`,
    category: 'developer-tools',
    targetKeyword: 'tailwind playground',
    secondaryKeywords: ['tailwind CSS playground', 'tailwind CSS tester', 'tailwind class to CSS', 'tailwind live preview', 'tailwind builder online', 'tailwind CSS converter', 'tailwind visual builder', 'tailwind CSS generator', 'tailwind editor online'],
    metaTitle: 'Tailwind CSS Playground - Live Preview, Visual Builder & CSS Output',
    metaDescription: 'Live Tailwind CSS playground with class editor, visual builder, color palette, autocomplete, responsive preview. See CSS output. Free online tool.',
    faqs: [
      { question: 'What are the two modes?', answer: 'Class Editor mode lets you type Tailwind classes directly with autocomplete and validation. Visual Builder mode lets you click through categorized utilities to build classes visually.' },
      { question: 'Can I see the raw CSS?', answer: 'Yes! The CSS output panel shows the equivalent raw CSS for every Tailwind class you apply, with syntax highlighting.' },
      { question: 'Does it support all Tailwind classes?', answer: 'It covers the most commonly used Tailwind utilities: spacing, colors, typography, display, flex, grid, border, shadow, transform, animation, and more.' },
      { question: 'Is this an official Tailwind tool?', answer: 'No, this is an independent playground. It maps Tailwind classes to CSS client-side without running the actual Tailwind compiler.' },
    ],
    howToSteps: [
      'Choose Class Editor or Visual Builder mode.',
      'Type or select Tailwind classes.',
      'See live preview of the styled element.',
      'Check the CSS output panel for raw CSS.',
      'Copy classes or CSS for your project.',
    ],
    relatedToolSlugs: ['css-animation-generator', 'css-gradient-text-generator', 'color-palette-generator', 'box-shadow-generator'],
    icon: 'Wind',
    isNew: true,
    estimatedTime: '5 minutes',
  },
  {
    slug: 'whatsapp-chat-generator',
    name: 'WhatsApp Chat Generator',
    shortDescription: 'Create realistic WhatsApp chat screenshots with pixel-perfect UI. Edit messages, contacts, ticks, wallpaper. Download as PNG.',
    longDescription: `<p>Create pixel-perfect <strong>WhatsApp chat screenshots</strong> that look exactly like the real app — fully editable for presentations, mockups, and social media content.</p>
<h2>Key Features</h2>
<ul>
<li><strong>4 Message Types</strong>: Text, voice messages (with waveform), image placeholders (with caption), and deleted messages.</li>
<li><strong>Read Receipts</strong>: Single tick (sent), double tick (delivered), blue double tick (read) — per message.</li>
<li><strong>Light & Dark Themes</strong>: Toggle between WhatsApp light and dark UI themes.</li>
<li><strong>Custom Wallpaper</strong>: 14 color presets or upload your own background image.</li>
<li><strong>High-Res PNG</strong>: 3x scale download for crisp presentations and print quality.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for presentations, UI/UX design mockups, social media content creators, and educational materials. Not for creating deceptive content.</p>
<h2>Privacy & Security</h2>
<p>100% private — everything runs in your browser. No messages are sent, no data uploaded.</p>`,
    category: 'image-tools',
    targetKeyword: 'whatsapp chat generator',
    secondaryKeywords: ['fake whatsapp chat generator', 'whatsapp screenshot generator', 'whatsapp chat maker online', 'whatsapp message generator', 'fake chat generator', 'whatsapp conversation generator', 'whatsapp mockup generator', 'whatsapp chat screenshot maker', 'fake whatsapp conversation', 'whatsapp chat creator'],
    metaTitle: 'WhatsApp Chat Generator - Create Realistic Chat Screenshots Free',
    metaDescription: 'Create pixel-perfect WhatsApp chat screenshots. Edit messages, ticks, profile, wallpaper, dark/light mode. Download as PNG. Free, no signup, 100% private.',
    faqs: [
      { question: 'Does this create real WhatsApp messages?', answer: 'No. This tool generates realistic-looking mockup screenshots for presentations, design, and educational purposes only. No actual WhatsApp messages are sent or received.' },
      { question: 'Can I customize the read receipts (ticks)?', answer: 'Yes! Each sent message can show single tick (sent), double tick (delivered), or blue double tick (read). Received messages show no ticks, just like real WhatsApp.' },
      { question: 'Does it support dark mode?', answer: 'Yes! Toggle between WhatsApp light theme and dark theme. The colors match the real WhatsApp app exactly.' },
      { question: 'Can I add different message types?', answer: 'Yes — text messages, voice messages (with waveform), image placeholders (with optional caption), and deleted messages are all supported.' },
      { question: 'What resolution is the downloaded image?', answer: 'The PNG is rendered at 3x scale for crisp, high-resolution output suitable for presentations and print.' },
      { question: 'Is my data private?', answer: 'Absolutely. All processing happens in your browser. Nothing is uploaded to any server. Your chat content stays on your device.' },
    ],
    howToSteps: [
      'Set the contact name, status (online/typing/last seen), and optionally upload a profile photo.',
      'Add messages — choose text, voice, image, or deleted type for each.',
      'Set each message as sent or received, customize time and tick status.',
      'Choose light or dark theme and pick a wallpaper color or upload a custom one.',
      'Download the chat screenshot as a high-resolution PNG.',
    ],
    relatedToolSlugs: ['social-media-post-mockup', 'instagram-carousel-maker', 'youtube-thumbnail-tester', 'business-card-maker'],
    icon: 'MessageCircle',
    isNew: true,
    estimatedTime: '3 minutes',
  },
  {
    slug: 'email-signature-generator',
    name: 'Email Signature Generator',
    shortDescription: 'Create professional HTML email signatures with 6 templates, social icons, CTA button, and photo. Works in Gmail, Outlook & Apple Mail.',
    longDescription: `<p>Design stunning professional <strong>email signatures</strong> that work in Gmail, Outlook, Apple Mail, and all major email clients. Choose from 6 beautiful templates and customize to match your brand.</p>
<h2>Key Features</h2>
<ul>
<li><strong>6 Templates</strong>: Classic, Modern, Compact, Corporate, Creative, and Minimal designs.</li>
<li><strong>Photo & Logo</strong>: Add profile photo and company logo via URL.</li>
<li><strong>Social Icons</strong>: LinkedIn, Twitter/X, GitHub, Instagram, Facebook, and YouTube icon links.</li>
<li><strong>CTA Button</strong>: Custom call-to-action like "Book a Meeting" or "Visit Our Website".</li>
<li><strong>Email-Safe HTML</strong>: Table-based layouts with inline styles — maximum compatibility with all email clients.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for professionals, freelancers, and businesses who want a polished, consistent email signature that renders correctly in every inbox.</p>
<h2>Privacy & Security</h2>
<p>100% private — all processing happens in your browser. Step-by-step setup instructions for Gmail, Outlook, and Apple Mail included.</p>`,
    category: 'utility-tools',
    targetKeyword: 'email signature generator',
    secondaryKeywords: ['email signature maker', 'HTML email signature', 'professional email signature', 'Gmail signature generator', 'Outlook signature creator', 'free email signature template', 'email signature with logo', 'email signature with social icons', 'business email signature maker'],
    metaTitle: 'Email Signature Generator - Free Professional HTML Signatures for Gmail & Outlook',
    metaDescription: 'Create professional HTML email signatures with 6 templates, photo, logo, social icons & CTA button. Works in Gmail, Outlook & Apple Mail. Free, no signup.',
    faqs: [
      { question: 'Will my signature work in Gmail?', answer: 'Yes! The signatures use HTML tables with inline styles, which is the most compatible format for Gmail. Follow the included step-by-step instructions to add it to your Gmail settings.' },
      { question: 'Can I add my company logo and photo?', answer: 'Yes! Add both a profile photo and company logo via URL. The images are displayed with proper dimensions for email clients.' },
      { question: 'Which social media platforms are supported?', answer: 'LinkedIn, Twitter/X, GitHub, Instagram, Facebook, and YouTube. Each appears as a recognizable icon linking to your profile.' },
      { question: 'Does the signature work in Outlook?', answer: 'Yes! Table-based HTML signatures work in all versions of Outlook, including desktop, web, and mobile. Instructions are included for adding the signature.' },
      { question: 'Is my data stored anywhere?', answer: 'No. All processing happens entirely in your browser. Your personal information never leaves your device.' },
    ],
    howToSteps: [
      'Fill in your personal details — name, title, company, and contact info.',
      'Add your photo URL and company logo URL (optional).',
      'Enter social media profile URLs for the icons you want to display.',
      'Choose a template style and customize colors.',
      'Preview the live signature and copy HTML or rendered signature.',
      'Follow the instructions to add it to Gmail, Outlook, or Apple Mail.',
    ],
    relatedToolSlugs: ['business-card-maker', 'social-media-post-mockup', 'qr-code-generator', 'invoice-generator'],
    icon: 'AtSign',
    isNew: true,
    estimatedTime: '3 minutes',
  },

  // ─── NOC GENERATOR ─────────────────────────────────────────────────────
  {
    slug: 'noc-generator',
    name: 'NOC Generator',
    shortDescription: 'Generate professional No Objection Certificate (NOC) letters for employment, property, vehicle, travel & bank purposes.',
    longDescription: `<p>Create professional <strong>No Objection Certificates (NOC)</strong> instantly with 5 ready-made templates — Employment, Property, Vehicle Transfer, Travel, and Bank/Loan.</p>
<h2>Key Features</h2>
<ul>
<li><strong>5 NOC Types</strong>: Employment, Property, Vehicle Transfer, Travel consent, and Bank/Loan closure.</li>
<li><strong>Professional Wording</strong>: Each template follows Indian legal and business standards with proper letterhead format.</li>
<li><strong>Live Preview</strong>: Formal document preview with reference number, date, and official formatting.</li>
<li><strong>Try Example Button</strong>: Pre-fills all fields to show the format instantly.</li>
<li><strong>PNG Download</strong>: High-resolution 2x scale image ready for printing, or copy text for your own letterhead.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for HR departments, housing societies, banks, RTOs, and individuals who need to issue or draft NOC letters quickly.</p>
<h2>Privacy & Security</h2>
<p>100% private — everything runs in your browser with no data uploaded to any server.</p>`,
    category: 'text-tools',
    targetKeyword: 'noc generator',
    secondaryKeywords: ['no objection certificate generator', 'noc letter format', 'noc format india', 'noc certificate maker', 'employment noc format', 'vehicle noc format', 'property noc format', 'bank noc format', 'travel noc format', 'noc letter maker online'],
    metaTitle: 'NOC Generator - Free No Objection Certificate Maker Online',
    metaDescription: 'Generate professional NOC letters for employment, property, vehicle, travel & bank. 5 templates, live preview, download as PNG. Free, no signup, 100% private.',
    faqs: [
      { question: 'What is a No Objection Certificate (NOC)?', answer: 'A No Objection Certificate (NOC) is a legal document issued by an organization, institution, or individual declaring that they have no objection to the details mentioned in the certificate. It is commonly used in India for employment, property transactions, vehicle transfers, travel, and loan closures.' },
      { question: 'Is this NOC legally valid?', answer: 'This tool generates a professionally formatted draft NOC. For legal validity, the letter must be printed on official letterhead, signed by an authorized person, and stamped by the issuing organization. The generated document serves as a ready-to-use template.' },
      { question: 'What NOC types are supported?', answer: 'We support 5 types: Employment NOC (for higher studies, passport, visa), Property NOC (for sale, mortgage, construction), Vehicle NOC (for RTO transfer), Travel NOC (employer/parent consent), and Bank/Loan NOC (for loan closure, property release).' },
      { question: 'Can I download the NOC as a PDF?', answer: 'Currently you can download the NOC as a high-resolution PNG image (2x scale) which is suitable for printing. You can also copy the text and paste it into any word processor to create a PDF.' },
      { question: 'Is my data private?', answer: 'Absolutely. All processing happens in your browser. Your information is never sent to any server. No signup or account is required.' },
    ],
    howToSteps: [
      'Select the NOC type — Employment, Property, Vehicle, Travel, or Bank/Loan.',
      'Fill in the organization name, address, date, and other required details.',
      'Use the "Try Example" button to see a sample filled-out NOC.',
      'Review the live preview on the right side of the screen.',
      'Download the NOC as a PNG image or copy the text to clipboard.',
    ],
    relatedToolSlugs: ['certificate-maker', 'business-card-maker', 'resignation-letter-generator', 'invoice-generator'],
    icon: 'FileText',
    isNew: true,
    estimatedTime: '2 minutes',
  },

  // ─── FONT PAIRING ──────────────────────────────────────────────────────
  {
    slug: 'font-pairing',
    name: 'Font Pairing Tool',
    shortDescription: 'Browse 27 curated Google Font pairings with live preview, type scale, and one-click CSS export.',
    longDescription: `<p>Find the perfect <strong>font combination</strong> for your next project with 27+ curated Google Font pairings. Filter by style or use case and export code with one click.</p>
<h2>Key Features</h2>
<ul>
<li><strong>27+ Curated Pairings</strong>: Organized by style (Modern, Classic, Elegant, Playful, Technical, Minimal, Bold, Warm) and use case (Blog, Portfolio, SaaS, E-commerce, Agency, etc.).</li>
<li><strong>Live Preview</strong>: Editable heading and body text, full type scale (H1–small), and long-form reading preview.</li>
<li><strong>Dark/Light Toggle</strong>: Preview fonts on both light and dark backgrounds.</li>
<li><strong>One-Click Export</strong>: Copy CSS font-family, Google Fonts HTML import link, or Tailwind CSS config snippet.</li>
<li><strong>Random Discovery</strong>: Hit "Random" to discover unexpected combinations.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for designers, developers, and content creators picking typography for websites, apps, and marketing materials.</p>
<h2>Privacy & Security</h2>
<p>100% free, no signup — fonts loaded from Google Fonts, everything else runs in your browser.</p>`,
    category: 'developer-tools',
    targetKeyword: 'font pairing tool',
    secondaryKeywords: ['google font pairing', 'font combination generator', 'font pair finder', 'best font pairings', 'heading body font pairing', 'typography pairing tool', 'font pairing generator'],
    metaTitle: 'Font Pairing Tool - 27+ Curated Google Font Combinations with Live Preview',
    metaDescription: 'Browse 27+ curated font pairings with live preview. Filter by style & use case. Copy CSS, Google Fonts link, or Tailwind config instantly. Free, no signup.',
    faqs: [
      { question: 'How many font pairings are available?', answer: 'The tool includes 27 curated font pairings using popular Google Fonts, organized across 8 style categories and 9 use cases.' },
      { question: 'Are these fonts free to use?', answer: 'Yes! All fonts are from Google Fonts, which are free and open-source. You can use them in any personal or commercial project.' },
      { question: 'Can I preview with my own text?', answer: 'Absolutely. Click any pairing card to enter the detail view where both the heading and body text are fully editable.' },
      { question: 'How do I add the fonts to my project?', answer: 'Use the export buttons to copy the Google Fonts HTML link tag, CSS font-family declarations, or Tailwind CSS config — then paste into your project.' },
      { question: 'Does the tool work offline?', answer: 'The tool itself runs in your browser, but fonts are loaded from Google Fonts servers, so an internet connection is needed for the live preview.' },
    ],
    howToSteps: [
      'Browse the grid of 27+ font pairings or use filters to narrow by style and use case.',
      'Click a pairing card to see the full preview with editable text and type scale.',
      'Toggle dark/light preview to see how the fonts look on different backgrounds.',
      'Copy the CSS, Google Fonts link, or Tailwind config with one click.',
    ],
    relatedToolSlugs: ['css-gradient-text-generator', 'color-picker', 'css-gradient-generator', 'box-shadow-generator'],
    icon: 'Type',
    isNew: true,
    estimatedTime: '2 minutes',
  },
  {
    slug: 'offer-letter-generator',
    name: 'Offer Letter Generator',
    shortDescription: 'Generate professional offer letters for Indian businesses with CTC breakdown, terms & conditions, and PNG download.',
    longDescription: `<p>Generate professional <strong>offer letters for Indian businesses</strong> with accurate CTC breakdown in seconds. Fill in details and download a formal, ready-to-send letter.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Accurate CTC Breakdown</strong>: Auto-calculates Basic, HRA, Special Allowance, PF (capped at ₹1,800/month per EPFO), and Gratuity (4.81% of basic).</li>
<li><strong>3 Template Styles</strong>: Formal (classic corporate), Modern (clean contemporary), and Minimal (simple and elegant).</li>
<li><strong>Adjustable Percentages</strong>: Set Basic % of CTC and HRA % of Basic — all other components auto-calculate.</li>
<li><strong>Employment Terms</strong>: Include joining date, offer expiry, probation period, and employment type.</li>
<li><strong>PNG Download</strong>: High-resolution image ready to send, or copy text for your own letterhead.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for HR teams, startups, and small businesses in India who need correctly formatted offer letters quickly.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no data uploaded, completely private.</p>`,
    category: 'utility-tools',
    targetKeyword: 'offer letter generator',
    secondaryKeywords: ['offer letter format India', 'offer letter maker', 'job offer letter generator', 'CTC breakdown generator', 'employment offer letter template', 'offer letter with salary breakup', 'HR offer letter tool'],
    metaTitle: 'Offer Letter Generator - Free Indian Offer Letter Maker with CTC Breakdown',
    metaDescription: 'Generate professional offer letters for Indian businesses. Auto CTC breakdown (Basic, HRA, PF, Gratuity), 3 templates, PNG download. Free, private, no signup.',
    faqs: [
      { question: 'How is the CTC breakdown calculated?', answer: 'Basic = CTC x Basic%. HRA = Basic x HRA%. PF employer contribution = 12% of Basic (capped at INR 1,800/month per EPFO rules). Gratuity = 4.81% of Basic. Special Allowance = CTC minus all other components.' },
      { question: 'Is my data safe?', answer: 'Yes. Everything runs in your browser. No data is sent to any server. Your company and candidate information stays completely private.' },
      { question: 'Can I customize the salary percentages?', answer: 'Yes. You can set the Basic Salary percentage (of CTC) and HRA percentage (of Basic). The remaining components are auto-calculated.' },
      { question: 'What templates are available?', answer: 'Three styles: Formal (classic corporate with serif fonts), Modern (clean contemporary look), and Minimal (simple and elegant).' },
      { question: 'Can I download the offer letter?', answer: 'Yes. Download as a high-resolution PNG image, or copy the text to paste into your own document or email.' },
    ],
    howToSteps: [
      'Enter company details - name, address, and optional logo URL.',
      'Fill in candidate name, email, phone, and position details.',
      'Set the Annual CTC and adjust Basic/HRA percentages. The breakdown is auto-calculated.',
      'Choose joining date, offer expiry, employment type, and probation period.',
      'Select a template style (Formal, Modern, or Minimal) and download as PNG or copy the text.',
    ],
    relatedToolSlugs: ['business-card-maker', 'certificate-maker', 'invoice-generator', 'email-signature-generator'],
    icon: 'FileText',
    isNew: true,
    estimatedTime: '5 minutes',
  },

  // ─── BIO LINK GENERATOR ─────────────────────────────────────────────────
  {
    slug: 'bio-link-generator',
    name: 'Bio Link Page Generator',
    shortDescription: 'Create a beautiful link-in-bio page with a live phone preview — export as HTML or PNG.',
    longDescription: `<p>Build a stunning <strong>link-in-bio page</strong> in minutes — a free Linktree alternative with full customization and live phone preview.</p>
<h2>Key Features</h2>
<ul>
<li><strong>8 Themes</strong>: Minimal Light, Minimal Dark, Gradient Sunset, Gradient Ocean, Neon, Pastel, Professional, and Glassmorphism.</li>
<li><strong>Unlimited Links</strong>: Add any number of links with custom icons — drag to reorder.</li>
<li><strong>Social Icons</strong>: Instagram, Twitter/X, YouTube, TikTok, LinkedIn, GitHub, and Email icon row.</li>
<li><strong>Live Phone Preview</strong>: Real-time phone mockup shows exactly how your page will look on mobile.</li>
<li><strong>Export Options</strong>: Download as self-contained HTML (host anywhere), PNG screenshot, or copy raw HTML.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for creators, influencers, freelancers, and small businesses who want a free, fully-owned link-in-bio page without ongoing subscription fees.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no sign-up, no server uploads, no data collection.</p>`,
    category: 'utility-tools',
    targetKeyword: 'bio link generator',
    secondaryKeywords: ['link in bio', 'bio link page', 'linktree alternative', 'free link in bio', 'bio link maker', 'link page generator', 'social media link page', 'one page link site'],
    metaTitle: 'Bio Link Page Generator - Free Link-in-Bio Maker with Live Preview',
    metaDescription: 'Create a beautiful link-in-bio page with 8 themes, custom colors & live phone preview. Export as HTML or PNG. Free, no signup, 100% client-side.',
    faqs: [
      { question: 'Is this really free with no account needed?', answer: 'Yes. The tool runs entirely in your browser. There is no sign-up, no login, and no data sent to any server. You can use it unlimited times for free.' },
      { question: 'How do I host the exported HTML file?', answer: 'Upload the downloaded HTML file to any static hosting service — GitHub Pages, Netlify, Vercel, Cloudflare Pages, or even your own web server. It is a single self-contained file with no dependencies.' },
      { question: 'Can I customize the colors and fonts?', answer: 'Absolutely. Pick from 8 built-in themes, 5 button styles, a custom accent color picker, and 5 font families. You can mix and match to create a unique look.' },
      { question: 'Does the exported page work on mobile?', answer: 'Yes. The generated HTML is fully responsive and looks great on phones, tablets, and desktops. It includes a viewport meta tag and mobile-optimized CSS.' },
      { question: 'Can I add social media icons?', answer: 'Yes. There are dedicated fields for Instagram, Twitter/X, YouTube, TikTok, LinkedIn, GitHub, and Email. Filled-in socials appear as an icon row at the bottom of your page.' },
    ],
    howToSteps: [
      'Enter your name, bio text, and optional avatar URL in the Profile tab.',
      'Add links with titles, URLs, and icons in the Links tab — drag to reorder.',
      'Add your social media URLs in the Social tab.',
      'Pick a theme, button style, accent color, and font in the Style tab.',
      'Preview your page live in the phone mockup, then download as HTML or PNG.',
    ],
    relatedToolSlugs: ['qr-code-generator', 'meta-tag-generator', 'social-media-post-mockup', 'business-card-maker'],
    icon: 'Link2',
    isNew: true,
    estimatedTime: '3 minutes',
  },
  {
    slug: 'social-media-bio-generator',
    name: 'Social Media Bio Generator',
    shortDescription: 'Generate creative bios for Instagram, Twitter/X, LinkedIn, TikTok & YouTube. 120+ templates, personalization, emoji picker, and one-click copy.',
    longDescription: `<p>Create the perfect <strong>social media bio</strong> with 120+ professionally written templates across Instagram, Twitter/X, LinkedIn, TikTok, and YouTube.</p>
<h2>Key Features</h2>
<ul>
<li><strong>120+ Templates</strong>: Across 8 styles — Creator, Business, Personal, Funny/Witty, Professional, Motivational, Minimalist, and Aesthetic.</li>
<li><strong>Smart Placeholders</strong>: Fill in [name], [niche], [company] fields and see the bio personalize in real time.</li>
<li><strong>Platform Character Counts</strong>: Live counter for each platform's limit (Instagram 150, Twitter 160, LinkedIn 220, TikTok 80, YouTube 1000).</li>
<li><strong>Emoji Picker</strong>: 50 popular bio emojis plus Instagram invisible line break formatter.</li>
<li><strong>Favorites System</strong>: Save your best bios locally and access them anytime.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for influencers, content creators, and professionals who need a catchy, on-brand bio for their social media profiles.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your bio text and personal details are never sent to any server.</p>`,
    category: 'text-tools',
    targetKeyword: 'social media bio generator',
    secondaryKeywords: ['instagram bio generator', 'twitter bio generator', 'linkedin bio generator', 'tiktok bio ideas', 'youtube about generator', 'bio ideas for instagram', 'professional bio generator', 'funny bio generator', 'aesthetic bio ideas', 'social media bio ideas'],
    metaTitle: 'Social Media Bio Generator - 120+ Templates for Instagram, Twitter, LinkedIn, TikTok & YouTube',
    metaDescription: 'Generate creative social media bios with 120+ templates for Instagram, Twitter/X, LinkedIn, TikTok & YouTube. Personalize, copy & paste. Free, no signup.',
    faqs: [
      { question: 'Which social media platforms are supported?', answer: 'Instagram (150 chars), Twitter/X (160 chars), LinkedIn (220 chars), TikTok (80 chars), and YouTube (1000 chars). Each platform has its own curated templates and character limit tracker.' },
      { question: 'Can I personalize the bio templates?', answer: 'Yes! Templates contain smart placeholders like [name], [niche], [company], [role], etc. Input fields appear automatically so you can fill in your details and see the bio update in real time.' },
      { question: 'How many bio templates are included?', answer: 'Over 120 unique bio templates across 5 platforms and 8 style categories: Creator, Business, Personal, Funny/Witty, Professional, Motivational, Minimalist, and Aesthetic.' },
      { question: 'Can I save my favorite bios?', answer: 'Yes! Click the heart icon to save any bio to your favorites. They are stored in your browser\'s localStorage and persist between sessions.' },
      { question: 'Does this tool store my data?', answer: 'No. Everything runs 100% in your browser. Your bio text and personal details are never sent to any server.' },
    ],
    howToSteps: [
      'Select your social media platform (Instagram, Twitter/X, LinkedIn, TikTok, or YouTube).',
      'Choose a bio style category (Creator, Business, Professional, Funny, etc.).',
      'Browse templates and click Shuffle to see more options.',
      'Fill in the placeholder fields to personalize your bio.',
      'Copy your bio with one click and paste it into your profile.',
    ],
    relatedToolSlugs: ['social-media-post-mockup', 'instagram-carousel-maker', 'email-signature-generator', 'character-counter'],
    icon: 'UserPen',
    isNew: true,
    estimatedTime: '2 minutes',
  },
  {
    slug: 'github-readme-generator',
    name: 'GitHub Profile README Generator',
    shortDescription: 'Create a stunning GitHub profile README with badges, stats, tech stack and social links.',
    longDescription: `<p>Build a professional <strong>GitHub profile README</strong> in minutes with a visual editor — toggle sections, pick tech badges, and preview Markdown in real time.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Section Builder</strong>: Header with typing animation, About Me, social connect badges, tech stack, GitHub stats cards, blog post placeholders, and support links.</li>
<li><strong>100+ Tech Badges</strong>: shields.io badges for all major technologies with official brand colors.</li>
<li><strong>GitHub Stats Cards</strong>: Auto-fetched github-readme-stats cards — just enter your username.</li>
<li><strong>Live Markdown Preview</strong>: See your README update in real time as you build it.</li>
<li><strong>Download .md File</strong>: Copy raw Markdown or download the .md file directly.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for developers who want a visually impressive GitHub profile without manually writing Markdown syntax for badges and stats cards.</p>
<h2>Privacy & Security</h2>
<p>Runs in your browser — no signup, no server, 100% private. Works on desktop and mobile with full dark mode support.</p>`,
    category: 'developer-tools',
    targetKeyword: 'github readme generator',
    secondaryKeywords: ['github profile readme generator', 'github readme maker', 'github profile readme builder', 'github readme creator', 'awesome github profile readme'],
    metaTitle: 'GitHub Profile README Generator - Free Online Builder',
    metaDescription: 'Create a stunning GitHub profile README with tech stack badges, stats cards, social links & typing animations. Free visual builder with live preview. No signup.',
    faqs: [
      { question: 'What is a GitHub profile README?', answer: 'A GitHub profile README is a special repository (named the same as your username) whose README.md is displayed on your GitHub profile page. It lets you showcase your skills, projects, and personality.' },
      { question: 'How do I use the generated README?', answer: 'Create a repository with the same name as your GitHub username. Copy the generated markdown and paste it into the README.md file of that repository. It will automatically appear on your profile.' },
      { question: 'Do the GitHub stats cards require any setup?', answer: 'No setup needed. The stats cards use github-readme-stats which fetches your public data automatically. Just make sure your GitHub username is correct in the Connect section.' },
      { question: 'Can I customize the badge colors?', answer: 'The tool uses the official brand colors from shields.io for each technology. You can manually edit the hex color codes in the generated markdown if you want custom colors.' },
      { question: 'Is my data saved anywhere?', answer: 'No. All processing happens locally in your browser. Nothing is sent to any server and no data is stored. Your content stays completely private.' },
    ],
    howToSteps: [
      'Toggle and fill in sections: Header, About Me, Connect, Tech Stack, Stats.',
      'Pick your technologies from the categorized badge grid.',
      'Preview your README in real-time in the right panel.',
      'Switch between visual preview and raw markdown view.',
      'Copy the markdown or download the .md file.',
    ],
    relatedToolSlugs: ['json-formatter', 'hash-generator', 'uuid-generator', 'tailwind-playground'],
    icon: 'Github',
    isNew: true,
    estimatedTime: '5 minutes',
  },
];

// ─── PLAGIARISM CHECKER ─────────────────────────────────────────────────
tools.push({
  slug: 'plagiarism-checker',
  name: 'Plagiarism Checker',
  shortDescription: 'Compare two texts for similarity using Jaccard, cosine & n-gram analysis. 100% private.',
  longDescription: `<p>Compare two texts for <strong>plagiarism and similarity</strong> using three powerful algorithms — all running 100% in your browser with complete privacy.</p>
<h2>Key Features</h2>
<ul>
<li><strong>3 Algorithms</strong>: Jaccard index (word overlap), cosine similarity with TF-IDF vectors, and n-gram overlap (3-word and 5-word phrases).</li>
<li><strong>Color-Coded Sentences</strong>: Each sentence individually scored — green (unique), yellow (somewhat similar), red (near-identical).</li>
<li><strong>Verdict</strong>: Overall score with clear classification — Low (likely original), Moderate (review needed), or High (significant overlap).</li>
<li><strong>Deep Analysis Tabs</strong>: Sentence matching pairs, n-gram analysis of shared phrases, and word frequency comparison charts.</li>
<li><strong>No Limits</strong>: Unlimited comparisons, no signup, no data collection.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for students checking essays, writers verifying originality, teachers reviewing submissions, and researchers comparing drafts between two known documents.</p>
<h2>Privacy & Security</h2>
<p>Your texts never leave your device — everything computed client-side with zero server calls.</p>`,
  category: 'text-tools',
  targetKeyword: 'plagiarism checker',
  secondaryKeywords: ['plagiarism detector', 'text similarity checker', 'check plagiarism online', 'compare two texts', 'similarity checker', 'text comparison tool', 'plagiarism checker free'],
  metaTitle: 'Plagiarism Checker - Free Online Text Similarity Comparison Tool',
  metaDescription: 'Compare two texts for plagiarism using Jaccard, cosine similarity & n-gram analysis. Free online plagiarism checker — 100% private, runs in your browser.',
  faqs: [
    { question: 'How does the plagiarism checker work?', answer: 'The tool compares two texts using three algorithms: Jaccard similarity (word set overlap), cosine similarity (TF-IDF vector comparison), and n-gram overlap (shared 3-word and 5-word phrases). The overall score is a weighted average of all three methods.' },
    { question: 'Is my text safe and private?', answer: 'Yes, completely. Both texts are processed entirely in your browser using JavaScript. Nothing is sent to any server — your content stays 100% private on your device.' },
    { question: 'Can this replace professional plagiarism checkers?', answer: 'This tool compares two specific texts you provide. Professional tools like Turnitin compare against massive databases of published work. Use this for quick self-checks between two known documents, and professional tools for comprehensive plagiarism screening.' },
    { question: 'What do the similarity colors mean?', answer: 'Green (0-30%) means low similarity and likely original content. Yellow (31-60%) indicates moderate similarity that should be reviewed. Red (61-100%) signals high similarity with significant text overlap between the two passages.' },
  ],
  howToSteps: [
    'Paste your original/source text in the left text area.',
    'Paste the text you want to check in the right text area.',
    'Click the "Compare" button to run the analysis.',
    'Review the overall similarity score and color-coded verdict.',
    'Explore Sentence Matching, N-gram Analysis, and Word Frequency tabs for detailed insights.',
    'Click "Copy Report" to save the full analysis to your clipboard.',
  ],
  relatedToolSlugs: ['word-counter', 'ai-text-humanizer', 'paraphrasing-tool', 'case-converter'],
  icon: 'FileSearch',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── TDS CALCULATOR ───────────────────────────────────────────────────
tools.push({
  slug: 'tds-calculator',
  name: 'TDS Calculator India',
  shortDescription: 'Calculate TDS on salary, rent, professional fees, interest & property sale for FY 2025-26. Old vs New regime comparison.',
  longDescription: 'India\'s most comprehensive TDS (Tax Deducted at Source) Calculator covering all major TDS sections. Calculate TDS on Salary (Section 192) with full Old vs New Tax Regime comparison, TDS on Rent (Section 194-IB), Professional/Technical Fees (Section 194J), Interest Income (Section 194A), and Property Sale (Section 194-IA). For salary TDS, enter your annual CTC along with deductions under Section 80C, 80D, HRA exemption, NPS (80CCD), and home loan interest (Section 24b). The calculator shows a side-by-side comparison of Old and New Tax Regime with taxable income, tax, cess, monthly/annual TDS, and recommends which regime saves you more. Updated with Budget 2025 changes for FY 2025-26: New Regime slabs (0-4L Nil, 4-8L 5%, 8-12L 10%, 12-16L 15%, 16-20L 20%, 20-24L 25%, above 24L 30%), Rs.75,000 standard deduction, and Section 87A rebate up to Rs.60,000 for income up to 12 Lakh. All calculations are instant, run entirely in your browser, and support FY 2024-25, 2025-26, and 2026-27.',
  category: 'calculators',
  targetKeyword: 'TDS calculator',
  secondaryKeywords: ['TDS calculator India', 'TDS on salary calculator', 'TDS on rent calculator', 'TDS calculator FY 2025-26', 'Section 194 TDS calculator', 'TDS on property sale', 'TDS on professional fees', 'old vs new regime TDS', 'income tax TDS calculator India', 'TDS calculator online', 'TDS rate calculator 2025'],
  metaTitle: 'TDS Calculator India - Salary, Rent & Professional Fees | FY 2025-26',
  metaDescription: 'Calculate TDS on salary, rent, professional fees, interest & property. Old vs New regime comparison for FY 2025-26. Free TDS calculator India — instant results.',
  faqs: [
    { question: 'What is TDS and who deducts it?', answer: 'TDS (Tax Deducted at Source) is a method of collecting income tax where the payer deducts tax before making a payment. Employers deduct TDS on salary (Sec 192), tenants on rent above Rs.50,000/month (Sec 194-IB), businesses on professional fees (Sec 194J), banks on interest (Sec 194A), and property buyers on sale above Rs.50 Lakh (Sec 194-IA).' },
    { question: 'What are the new tax slabs for FY 2025-26 under New Regime?', answer: '0-4 Lakh: Nil, 4-8 Lakh: 5%, 8-12 Lakh: 10%, 12-16 Lakh: 15%, 16-20 Lakh: 20%, 20-24 Lakh: 25%, Above 24 Lakh: 30%. Standard deduction is Rs.75,000 and Section 87A rebate of up to Rs.60,000 applies for taxable income up to Rs.12 Lakh.' },
    { question: 'What is the TDS rate on rent?', answer: 'Under Section 194-IB, if monthly rent exceeds Rs.50,000, the tenant must deduct TDS at 2% on the rent amount. This applies to individual and HUF tenants who are not liable for tax audit.' },
    { question: 'How is TDS on property sale calculated?', answer: 'Under Section 194-IA, the buyer deducts TDS at 1% on the total sale consideration if the property value exceeds Rs.50 Lakh. The TDS is on the full amount, not just the excess over 50 Lakh.' },
    { question: 'Which tax regime is better for salary TDS?', answer: 'It depends on your deductions. If your total deductions (80C, 80D, HRA, home loan, NPS) exceed Rs.3-4 Lakh, the Old Regime may be better. Otherwise, the New Regime with lower slab rates is usually more beneficial. Our calculator compares both and recommends the better option.' },
  ],
  howToSteps: [
    'Select the TDS type: Salary, Rent, Professional Fees, Interest, or Property Sale.',
    'Choose the Financial Year (FY 2024-25, 2025-26, or 2026-27).',
    'Enter the relevant amount and deduction details.',
    'For salary, view Old vs New Regime comparison with monthly and annual TDS breakdown.',
    'Copy the results or click "Try Example" to see a sample calculation.',
  ],
  relatedToolSlugs: ['salary-calculator', 'gst-calculator', 'emi-calculator', 'percentage-calculator'],
  icon: 'Receipt',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── DREAM11 FANTASY POINTS CALCULATOR ─────────────────────────────────
tools.push({
  slug: 'dream11-points-calculator',
  name: 'Fantasy Cricket Points Calculator',
  shortDescription: 'Calculate fantasy cricket points for any player based on match performance stats for T20, ODI & Test.',
  longDescription: `<p>Calculate <strong>fantasy cricket points</strong> for any player based on match performance stats. Supports T20, ODI, and Test match formats with format-specific scoring rules.</p>
<h2>Key Features</h2>
<ul>
<li><strong>All Formats</strong>: T20, ODI, and Test with format-specific strike rate/economy rate bonuses and penalties.</li>
<li><strong>Complete Breakdown</strong>: Batting, bowling, and fielding points with milestone bonuses (50s, 100s, wicket hauls) and duck penalties.</li>
<li><strong>Captain & VC Multipliers</strong>: Toggle Captain (2x) or Vice-Captain (1.5x) to see adjusted totals.</li>
<li><strong>Two-Player Comparison</strong>: Compare stats of two players side by side to make smarter team picks.</li>
<li><strong>Scoring Rules Reference</strong>: Full point chart for each format included in the tool.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for Dream11, MPL, and other fantasy cricket players building optimal lineups for IPL, World Cup, and domestic cricket matches.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no app download. Not affiliated with any fantasy sports platform.</p>`,
  category: 'cricket-tools',
  targetKeyword: 'fantasy cricket points calculator',
  secondaryKeywords: ['cricket fantasy points calculator', 'fantasy scoring system cricket', 'fantasy points calculator IPL', 'T20 fantasy points', 'ODI fantasy scoring', 'captain points calculator fantasy cricket', 'IPL fantasy points calculator'],
  metaTitle: 'Fantasy Cricket Points Calculator - Free Online Tool',
  metaDescription: 'Calculate fantasy cricket points for T20, ODI & Test. Batting, bowling, fielding breakdown with captain/VC multiplier. Free online calculator.',
  faqs: [
    { question: 'How are fantasy cricket points calculated?', answer: 'Fantasy cricket leagues award points for runs scored (+1 each), boundaries (+1 for 4s, +2 for 6s), wickets (+25 in T20/ODI, +16 in Test), catches (+8), stumpings (+12), and run-outs (+12 direct, +6 indirect). Bonus points are given for half-centuries, centuries, and wicket hauls. Penalties apply for ducks and poor strike/economy rates.' },
    { question: 'What is the difference between Captain and Vice-Captain points?', answer: 'The Captain receives 2x the total fantasy points, and the Vice-Captain receives 1.5x the total points. Choosing the right Captain is crucial as it can significantly impact your overall team score.' },
    { question: 'How does strike rate bonus work in fantasy cricket?', answer: 'In T20 (min 10 balls): SR >170 gives +6, 150-170 gives +4, 130-150 gives +2. Penalties: SR 60-70 gives -2, 50-60 gives -4, <50 gives -6. In ODI (min 20 balls): SR >140 gives +6, 120-140 gives +4, 100-120 gives +2. Penalties are for SR below 60.' },
    { question: 'How does economy rate bonus work?', answer: 'In T20 (min 2 overs): Economy <5 gives +6, 5-5.99 gives +4, 6-7 gives +2. Penalties: 10-11 gives -2, 11-12 gives -4, >12 gives -6. In ODI (min 5 overs): Economy <2.5 gives +6, thresholds are lower for the longer format.' },
    { question: 'Are fantasy scoring rules different for Test matches?', answer: 'Yes. Test matches have different point values: wickets are worth +16 (vs +25 in limited overs), ducks carry a -4 penalty (highest), and there are no strike rate or economy rate bonuses/penalties. Half-century (+4) and century (+8) bonuses are the same as ODI.' },
    { question: 'Can I compare two players side by side?', answer: 'Yes! Click the "Compare" button to enable two-player comparison mode. Enter stats for both players and see which one earns more fantasy points. This helps you decide between two players for your fantasy team.' },
  ],
  howToSteps: [
    'Select the match format: T20, ODI, or Test.',
    'Choose the player role: Batsman, Bowler, All-Rounder, or Wicket-Keeper.',
    'Enter batting stats: runs, balls faced, fours, and sixes.',
    'Enter bowling stats: wickets, overs bowled, maidens, and runs conceded.',
    'Enter fielding stats: catches, stumpings, and run-outs.',
    'Toggle Captain (2x) or Vice-Captain (1.5x) if applicable.',
    'View the detailed points breakdown and total fantasy points.',
    'Click "Compare" to compare two players side by side.',
  ],
  relatedToolSlugs: ['ipl-team-squad-explorer', 'ipl-player-comparison', 'ipl-match-schedule', 'ipl-points-table'],
  icon: 'Trophy',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── RECIPE SCALER ─────────────────────────────────────────────────────
tools.push({
  slug: 'recipe-scaler',
  name: 'Recipe Scaler & Converter',
  shortDescription: 'Scale any recipe up or down with smart fractions. Convert between metric and imperial units instantly.',
  longDescription: `<p>Scale any recipe to the servings you need with our free <strong>Recipe Scaler</strong>. Get smart fractions like "1½ cups" instead of "1.5 cups" — perfect for cooking.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Smart Fractions</strong>: Displays results as ½, ⅓, ¼ etc. instead of decimals for easy measuring.</li>
<li><strong>Quick Scale Buttons</strong>: Halve, double, triple, or quadruple your recipe with one click.</li>
<li><strong>Whole-Number Intelligence</strong>: Eggs, pieces, and slices always rounded to nearest whole number.</li>
<li><strong>Unit Conversion</strong>: Switch between original, metric (ml, g, kg), and imperial (cups, oz, lb) units on the fly.</li>
<li><strong>Temperature Converter</strong>: Fahrenheit ↔ Celsius converter for oven temperatures.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for home cooks scaling recipes for more or fewer guests, meal preppers, and bakers adjusting batch sizes.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no data stored.</p>`,
  category: 'converters',
  targetKeyword: 'recipe scaler',
  secondaryKeywords: ['recipe converter', 'scale recipe up', 'recipe multiplier', 'recipe serving calculator', 'double recipe calculator', 'half recipe calculator', 'recipe unit converter', 'cooking measurement converter', 'recipe scaling tool'],
  metaTitle: 'Recipe Scaler & Converter - Scale Recipes with Smart Fractions Free',
  metaDescription: 'Scale any recipe up or down with smart fractions. Convert cups to ml, oz to grams & more. Quick-scale buttons, copy recipe. Free online tool \u2014 no signup.',
  faqs: [
    { question: 'How does the smart fraction display work?', answer: 'Instead of showing decimals like 0.333 or 1.5, the tool converts quantities to proper fractions: \u2153, \u00BD, \u00BE, etc. For whole items like eggs or pieces, it rounds to the nearest whole number.' },
    { question: 'What unit conversions are supported?', answer: 'The tool converts between cups and ml (1 cup = 236.59 ml), tablespoons and ml (1 tbsp = 14.79 ml), teaspoons and ml (1 tsp = 4.93 ml), ounces and grams (1 oz = 28.35 g), and pounds and kilograms (1 lb = 0.454 kg). A separate temperature converter handles Fahrenheit and Celsius.' },
    { question: 'Can I scale a recipe to any number of servings?', answer: 'Yes! Enter any number in the desired servings field, or use quick-scale buttons to halve, double, triple, or quadruple the recipe. The tool calculates the exact scaling factor automatically.' },
    { question: 'Is my recipe data saved anywhere?', answer: 'No. All calculations happen entirely in your browser. Nothing is stored on any server. Your recipe data stays completely private.' },
    { question: 'How do I copy the scaled recipe?', answer: 'Click the "Copy" button next to the scaled recipe output. The recipe is formatted as plain text with ingredient quantities, units, and names \u2014 ready to paste into notes, messages, or documents.' },
  ],
  howToSteps: [
    'Enter a recipe name (optional) and set the original number of servings.',
    'Add ingredients with quantity, unit, and name. Use "Add Ingredient" for more rows.',
    'Set your desired servings using the number input or quick-scale buttons (Half, Double, Triple, x4).',
    'View the scaled recipe with smart fractions in the output panel.',
    'Toggle between Original, Metric, or Imperial units if needed.',
    'Copy the scaled recipe to clipboard or use the temperature converter for oven temps.',
  ],
  relatedToolSlugs: ['unit-converter', 'number-to-words', 'calorie-calculator', 'percentage-calculator'],
  icon: 'ChefHat',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'epf-calculator',
  name: 'EPF Calculator India',
  shortDescription: 'Calculate your Employee Provident Fund maturity amount at retirement with year-by-year breakdown.',
  longDescription: `<p>Plan your retirement with our free <strong>EPF Calculator for India</strong>. Enter monthly basic salary and DA to see exactly how your Provident Fund grows by retirement.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Latest Rate Pre-filled</strong>: 8.25% EPF interest rate (FY 2025-26) — adjustable for scenario planning.</li>
<li><strong>Year-by-Year Breakdown</strong>: Opening balance, employee (12%) and employer (3.67%) contributions, interest, and closing balance for each year.</li>
<li><strong>Salary Increment</strong>: Factor in annual pay raises for accurate long-term projections.</li>
<li><strong>Employer Split Explained</strong>: Shows the 3.67% EPF vs 8.33% EPS employer contribution split.</li>
<li><strong>Existing Balance</strong>: Add your current EPF balance for a complete retirement projection.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for salaried employees in India planning for retirement and wanting to understand the power of EPF compounding over a career.</p>
<h2>Privacy & Security</h2>
<p>All calculations happen privately in your browser — no data stored on any server.</p>`,
  category: 'calculators',
  targetKeyword: 'EPF calculator',
  secondaryKeywords: ['PF calculator India', 'provident fund calculator', 'EPF maturity calculator', 'PF interest calculator 2026', 'employee provident fund calculator', 'EPF retirement calculator', 'EPF balance calculator'],
  metaTitle: 'EPF Calculator India - PF Maturity & Interest Free',
  metaDescription: 'Calculate your EPF maturity amount at retirement with year-by-year breakdown. Latest 8.25% interest rate, salary increments, employer split. Free PF calculator.',
  faqs: [
    { question: 'What is the current EPF interest rate for FY 2025-26?', answer: 'The EPF interest rate for FY 2025-26 is 8.25% per annum, as declared by the EPFO. This calculator uses this rate by default but allows you to adjust it.' },
    { question: 'How is the employer contribution split in EPF?', answer: 'The employer contributes 12% of Basic + DA, but it is split: 3.67% goes to the EPF account (included in your balance) and 8.33% goes to the Employee Pension Scheme (EPS). Only the 3.67% EPF portion grows in your PF account.' },
    { question: 'How is EPF interest calculated?', answer: 'EPF interest is calculated monthly on the running balance (opening balance + contributions received that month). The annual rate is divided by 12 for monthly compounding. Interest is credited to the account at the end of the financial year.' },
    { question: 'Can I withdraw my EPF before retirement?', answer: 'Partial withdrawals are allowed for specific purposes like home purchase, medical emergencies, or education after completing certain years of service. Full withdrawal is allowed after 2 months of unemployment or at age 58. Early withdrawal may have tax implications.' },
    { question: 'Is EPF maturity amount taxable?', answer: 'EPF withdrawals after 5 years of continuous service are completely tax-free. If withdrawn before 5 years, the employer contribution, interest on both contributions, and your contribution (if claimed under 80C) become taxable.' },
    { question: 'What happens if my salary increases every year?', answer: 'This calculator includes an annual salary increment option. As your salary increases, your monthly contributions (both employee and employer) also increase proportionally, leading to a significantly higher maturity amount over time.' },
  ],
  howToSteps: [
    'Enter your monthly basic salary plus Dearness Allowance (DA).',
    'Set your employee contribution rate (default 12%) and EPF interest rate (default 8.25%).',
    'Enter your current age and expected retirement age.',
    'Optionally set an annual salary increment percentage and existing EPF balance.',
    'View your projected EPF maturity amount prominently displayed.',
    'Explore the year-by-year growth chart and detailed table for complete breakdown.',
    'Click Copy Results to save or share your EPF projection.',
  ],
  relatedToolSlugs: ['sip-calculator', 'fd-rd-calculator', 'compound-interest-calculator', 'emi-calculator', 'salary-calculator'],
  icon: 'Landmark',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'emi-prepayment-calculator',
  name: 'EMI Prepayment Calculator',
  shortDescription: 'Calculate how much you save by making prepayments on home, car, or personal loans.',
  longDescription: `<p>Find out exactly how much money and time you save by making prepayments on your loan with our free <strong>EMI Prepayment Calculator</strong>.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Side-by-Side Comparison</strong>: Original loan vs. loan with prepayments — interest saved and months reduced displayed prominently.</li>
<li><strong>Tenure or EMI Reduction</strong>: Choose whether each prepayment reduces your tenure (faster payoff) or your monthly EMI (lower payments).</li>
<li><strong>Multiple Prepayments</strong>: Add lump-sum prepayments at different months plus a recurring extra monthly payment.</li>
<li><strong>Highlighted Amortization</strong>: Month-by-month schedule with prepayment months highlighted in amber.</li>
<li><strong>INR Formatting</strong>: Indian numbering system (lakhs/crores) throughout.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for home loan borrowers, car loan holders, and anyone with an EMI-based loan who wants to understand the benefit of part payments.</p>
<h2>Privacy & Security</h2>
<p>All calculations happen entirely in your browser — no data sent to any server.</p>`,
  category: 'calculators',
  targetKeyword: 'EMI prepayment calculator',
  secondaryKeywords: ['home loan prepayment calculator', 'loan prepayment benefit calculator', 'part payment calculator', 'prepayment interest savings', 'loan prepayment savings calculator', 'EMI prepayment benefit', 'home loan part payment calculator', 'car loan prepayment calculator', 'personal loan prepayment calculator', 'loan tenure reduction calculator'],
  metaTitle: 'EMI Prepayment Calculator - See How Much You Save | Free Online',
  metaDescription: 'Calculate how much interest and time you save by making loan prepayments. Compare original vs prepaid loan with amortization schedule. Free EMI prepayment calculator.',
  faqs: [
    { question: 'What is a loan prepayment?', answer: 'A loan prepayment (or part payment) is an extra payment you make towards your loan principal, over and above your regular EMI. This reduces your outstanding balance, which in turn reduces the total interest you pay over the loan tenure.' },
    { question: 'Should I reduce tenure or reduce EMI when making a prepayment?', answer: 'Reducing tenure saves you more interest in the long run because the loan gets paid off faster. Reducing EMI lowers your monthly outgo, which is helpful if you need more cash flow. If your goal is maximum savings, choose "Reduce Tenure".' },
    { question: 'Is there a penalty for prepaying a loan?', answer: 'For floating-rate home loans in India, RBI has mandated that banks cannot charge prepayment penalties. For fixed-rate loans and personal loans, banks may charge 2-4% of the prepaid amount. Check with your lender.' },
    { question: 'How much can I save by making prepayments?', answer: 'The savings depend on your loan amount, interest rate, tenure, and prepayment amount. For example, on a Rs 50 lakh home loan at 8.5% for 20 years, a Rs 2 lakh prepayment in year 3 plus Rs 5,000 extra monthly can save over Rs 10 lakh in interest and reduce tenure by several years.' },
    { question: 'Can I make multiple prepayments?', answer: 'Yes! You can add multiple lump-sum prepayments at different months, plus set a recurring extra monthly payment. The calculator accounts for all of them.' },
    { question: 'Does the amortization schedule show prepayment months?', answer: 'Yes, months where a prepayment is made are highlighted in amber/yellow in the amortization schedule, with a "PP" marker next to the month number.' },
  ],
  howToSteps: [
    'Enter your loan principal amount, interest rate, and tenure (years or months).',
    'Add a recurring extra monthly payment and/or lump-sum prepayments with month number and amount.',
    'Choose whether each prepayment should reduce tenure or reduce EMI.',
    'View the comparison: original loan vs. loan with prepayments — interest saved and months saved.',
    'Expand the amortization schedule to see the month-by-month breakdown.',
    'Copy the summary to share or save for reference.',
  ],
  relatedToolSlugs: ['emi-calculator', 'loan-comparison-calculator', 'compound-interest-calculator', 'sip-calculator'],
  icon: 'TrendingDown',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'json-tree-viewer',
  name: 'JSON Tree Viewer',
  shortDescription: 'Paste JSON and explore it as an interactive collapsible tree with path copying.',
  longDescription: `<p>Visualize any JSON as a beautiful, <strong>interactive tree structure</strong> with collapsible nodes, color-coded values, and one-click JSON path copying.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Interactive Tree</strong>: Collapsible nodes with array indices, item count badges, and color-coded types (strings green, numbers blue, booleans purple, null gray).</li>
<li><strong>JSON Path Copy</strong>: Hover any node and click to copy its path (e.g., "data.users[0].name") to clipboard.</li>
<li><strong>Search</strong>: Find keys or values deep in the tree — matches highlighted, parent nodes auto-expand.</li>
<li><strong>Expand Controls</strong>: Expand All, Collapse All, or expand to depth L1, L2, or L3.</li>
<li><strong>Validation</strong>: Real-time JSON validation with detailed error messages for invalid JSON.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Ideal for developers working with REST APIs, GraphQL responses, config files, database exports, or any deeply nested JSON data.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% client-side — your data never leaves your browser.</p>`,
  category: 'developer-tools',
  targetKeyword: 'JSON tree viewer',
  secondaryKeywords: ['JSON viewer online', 'JSON explorer', 'JSON path finder', 'JSON tree visualizer', 'interactive JSON viewer', 'JSON path copier', 'collapsible JSON viewer', 'JSON navigator', 'JSON data explorer'],
  metaTitle: 'JSON Tree Viewer - Interactive JSON Explorer & Path Finder | Free Online',
  metaDescription: 'Visualize JSON as an interactive collapsible tree. Click nodes to copy JSON paths, search keys & values, expand/collapse all. Free online JSON tree viewer.',
  faqs: [
    { question: 'What is a JSON tree viewer?', answer: 'A JSON tree viewer converts raw JSON text into a visual, hierarchical tree structure with collapsible nodes. It makes it easy to navigate deeply nested JSON data, understand its structure, and find specific values — much easier than reading raw text.' },
    { question: 'How do I copy a JSON path?', answer: 'Hover over any node in the tree and click the copy icon that appears on the right side. The full JSON path (e.g., "data.users[0].name") is copied to your clipboard. A toast notification confirms the copy.' },
    { question: 'Does this tool send my JSON data to a server?', answer: 'No. All parsing and rendering happens entirely in your browser using JavaScript. Your JSON data never leaves your device, making it safe for sensitive or proprietary data.' },
    { question: 'What is the maximum JSON size supported?', answer: 'There is no hard limit. The tool handles JSON files of several megabytes comfortably. Very large files (10MB+) may cause slight lag in the browser due to DOM rendering, but parsing will still work.' },
    { question: 'Can I search for specific keys or values?', answer: 'Yes. Use the search bar above the tree view to search for keys or values. Matching nodes are highlighted in yellow and their parent nodes auto-expand so you can locate results instantly.' },
    { question: 'What do the depth buttons (L1, L2, L3) do?', answer: 'They expand the tree to a specific nesting depth. L1 shows only the first level, L2 shows two levels deep, and L3 shows three levels. This is useful for getting a quick overview of large JSON structures without expanding everything.' },
  ],
  howToSteps: [
    'Paste your JSON into the left input panel (or click "Try Example JSON" to load sample data).',
    'The right panel instantly shows your JSON as an interactive tree with collapsible nodes.',
    'Click the arrow icons to expand or collapse sections. Use Expand All, Collapse, or depth buttons (L1/L2/L3) for bulk control.',
    'Hover over any node and click the copy icon to copy the JSON path to your clipboard.',
    'Use the search bar to find specific keys or values — matches are highlighted and parents auto-expand.',
    'Use Format or Minify buttons to reformat your JSON input. Copy formatted JSON with the Copy button.',
  ],
  relatedToolSlugs: ['json-formatter', 'csv-to-json', 'xml-to-json', 'jwt-decoder'],
  icon: 'FileJson',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── CSS GRID GENERATOR ─────────────────────────────────────────────────
tools.push({
  slug: 'css-grid-generator',
  name: 'CSS Grid Generator',
  shortDescription: 'Build CSS Grid layouts visually with live code output. Set columns, rows, gaps, alignment and item spans.',
  longDescription: `<p>Create complex <strong>CSS Grid layouts</strong> effortlessly with our free visual builder. Define columns, rows, gaps, and alignment — then copy production-ready code.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Full Grid Support</strong>: Set grid-template-columns, grid-template-rows, column-gap, row-gap, justify-items, align-items, justify-content, and align-content.</li>
<li><strong>Spanning Items</strong>: Click any grid cell to set its column/row start and span — create headers, sidebars, and full-width footers.</li>
<li><strong>7 Preset Layouts</strong>: Holy Grail, Dashboard, Gallery, Blog, 2-Column, 3-Column, and 4-Column to jumpstart your design.</li>
<li><strong>Live Code Output</strong>: Production-ready CSS and HTML with syntax highlighting, updated in real time.</li>
<li><strong>All CSS Values</strong>: Supports fr, px, %, auto, repeat(), and minmax() in template fields.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for web developers and designers building responsive grid layouts without memorizing complex CSS Grid syntax.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no server calls, layouts stay completely private.</p>`,
  category: 'developer-tools',
  targetKeyword: 'CSS grid generator',
  secondaryKeywords: ['CSS grid layout builder', 'CSS grid template generator', 'visual CSS grid tool', 'CSS grid code generator', 'grid layout maker online', 'CSS grid template columns generator'],
  metaTitle: 'CSS Grid Generator - Visual Grid Layout Builder Free',
  metaDescription: 'Build CSS Grid layouts visually with live code. Set columns, rows, gaps, alignment & item spans. 7 presets, copy CSS/HTML. Free online tool — no signup.',
  faqs: [
    { question: 'What CSS Grid properties can I configure?', answer: 'You can set grid-template-columns, grid-template-rows, column-gap, row-gap (in px or rem), justify-items, align-items, justify-content, and align-content. For individual items, you can set grid-column start/span and grid-row start/span.' },
    { question: 'What are fr units in CSS Grid?', answer: 'The fr (fraction) unit represents a fraction of the available space in the grid container. For example, "1fr 2fr" creates two columns where the second is twice as wide as the first. It is the most flexible unit for responsive grid layouts.' },
    { question: 'Can I create spanning grid items like a full-width header?', answer: 'Yes. Click any grid item in the preview or expand it in the Grid Items panel. Set Column Span to the number of columns you want it to span. For a full-width header in a 3-column grid, set Col Start to 1 and Col Span to 3.' },
    { question: 'What preset layouts are available?', answer: 'The tool includes 7 presets: Holy Grail (header, 3-column body, footer), Dashboard (top bar, chart, stats, table), Gallery (hero image with thumbnails), Blog (article + sidebar), and simple 2-Column, 3-Column, and 4-Column layouts.' },
    { question: 'Is my layout data saved anywhere?', answer: 'No. All processing happens entirely in your browser. Nothing is sent to any server and no data is stored. Your layout stays completely private.' },
    { question: 'Can I use repeat() and minmax() in the template fields?', answer: 'Yes. The template fields accept any valid CSS grid-template value including repeat(3, 1fr), minmax(200px, 1fr), auto-fill, auto-fit, and combinations of different units.' },
  ],
  howToSteps: [
    'Set your grid-template-columns and grid-template-rows using fr, px, %, auto, or repeat().',
    'Adjust column-gap and row-gap values and choose px or rem units.',
    'Set alignment properties: justify-items, align-items, justify-content, align-content.',
    'Click a grid item in the preview to edit its column/row start and span values.',
    'Use the Add Item button to add more grid children, or choose a preset layout.',
    'Copy the generated CSS and HTML code using the copy buttons.',
  ],
  relatedToolSlugs: ['css-flexbox-generator', 'css-gradient-generator', 'box-shadow-generator', 'css-animation-generator', 'html-css-js-editor'],
  icon: 'Grid3X3',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── PROPERTY REGISTRATION CALCULATOR ──────────────────────────────────
tools.push({
  slug: 'property-registration-calculator',
  name: 'Property Registration Cost Calculator',
  shortDescription: 'Calculate total property registration cost — stamp duty, registration fee, GST & TDS — for all Indian states.',
  longDescription: `<p>Calculate the complete cost of <strong>property registration in India</strong> with an instant breakdown of stamp duty, registration fee, GST, and TDS — tailored to your state and profile.</p>
<h2>Key Features</h2>
<ul>
<li><strong>25+ States Covered</strong>: Accurate stamp duty and registration fee rates for all major Indian states and union territories.</li>
<li><strong>Owner Concessions</strong>: Female buyer discounts in Delhi, UP, Rajasthan, Punjab, Haryana, Odisha, Uttarakhand, and more.</li>
<li><strong>All Property Types</strong>: Residential, commercial, agricultural, and plot with type-specific rates.</li>
<li><strong>GST & TDS</strong>: GST for under-construction properties, 1% TDS for properties above ₹50 lakh.</li>
<li><strong>State Comparison Chart</strong>: See how registration costs compare across all states for the same property value.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for property buyers budgeting total purchase cost, real estate investors comparing states, and first-time buyers understanding registration charges.</p>
<h2>Privacy & Security</h2>
<p>All calculations happen entirely in your browser — no data sent to any server.</p>`,
  category: 'calculators',
  targetKeyword: 'property registration calculator India',
  secondaryKeywords: ['stamp duty calculator state wise', 'registry cost calculator', 'property registration charges India', 'stamp duty calculator India', 'registration fee calculator', 'property stamp duty by state', 'stamp duty for female owners India', 'property buying cost calculator', 'total property cost India', 'stamp duty and registration charges'],
  metaTitle: 'Property Registration Cost Calculator India - Stamp Duty & Fees by State',
  metaDescription: 'Calculate stamp duty, registration fee, GST & TDS for property registration in any Indian state. Compare costs across states. Free online calculator.',
  faqs: [
    { question: 'What is stamp duty on property?', answer: 'Stamp duty is a tax levied by state governments on property transactions. It is a percentage of the property value (or circle rate, whichever is higher) and must be paid at the time of property registration. Rates vary from 3% to 8% depending on the state.' },
    { question: 'Do women get concession on stamp duty?', answer: 'Yes, several Indian states offer reduced stamp duty rates for female property buyers. For example, Delhi charges 4% for women vs. 6% for men, UP charges 5% vs. 7%, Rajasthan charges 4% vs. 5%, and Punjab charges 5% vs. 7%. Joint registration with a woman also gets concessions in many states.' },
    { question: 'What is the registration fee for property?', answer: 'Registration fee is a separate charge (in addition to stamp duty) for getting the sale deed registered at the sub-registrar office. It typically ranges from 0.5% to 4% of the property value depending on the state. Some states like Haryana do not charge a separate registration fee.' },
    { question: 'Is GST applicable on property purchase?', answer: 'GST at 5% is applicable only on under-construction properties (without input tax credit). Ready-to-move-in properties and resale properties are exempt from GST. Only stamp duty and registration fee apply to completed properties.' },
    { question: 'What is TDS on property purchase?', answer: 'If the property value exceeds ₹50 lakh, the buyer must deduct 1% TDS (Tax Deducted at Source) under Section 194-IA of the Income Tax Act and deposit it with the government using Form 26QB.' },
    { question: 'Which state has the lowest stamp duty?', answer: 'Among major states, Goa (3.5%), Jharkhand (4%), and Gujarat (4.9%) have some of the lowest stamp duty rates. However, total registration cost also depends on the registration fee, which varies separately.' },
    { question: 'What is the first-time buyer concession?', answer: 'Many states offer a 1% concession on stamp duty for first-time residential property buyers. This is typically available for properties below a certain value threshold. Our calculator applies a 1% reduction for first-time buyers on residential properties.' },
  ],
  howToSteps: [
    'Select your state from the dropdown (25+ Indian states available).',
    'Enter the property value in rupees.',
    'Choose the property type — Residential, Commercial, Agricultural, or Plot.',
    'Select the owner type — Male, Female, or Joint.',
    'Toggle first-time buyer concession or under-construction GST if applicable.',
    'View the detailed breakdown: stamp duty, registration fee, GST, TDS, total cost, and effective rate.',
    'Expand the state comparison to see how costs differ across all states for the same property value.',
    'Copy the summary to share with your broker or advisor.',
  ],
  relatedToolSlugs: ['emi-calculator', 'emi-prepayment-calculator', 'loan-comparison-calculator', 'gst-calculator', 'sip-calculator', 'compound-interest-calculator'],
  icon: 'Building2',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── PIXEL ART MAKER ──────────────────────────────────────────────────────
tools.push({
  slug: 'pixel-art-maker',
  name: 'Pixel Art Maker',
  shortDescription: 'Create pixel art on a grid canvas and export as PNG. Free online pixel art creator.',
  longDescription: `<p>Design stunning <strong>pixel art</strong> directly in your browser with an intuitive grid canvas, full drawing tools, and crisp PNG export at up to 16x scale.</p>
<h2>Key Features</h2>
<ul>
<li><strong>4 Canvas Sizes</strong>: 8x8, 16x16, 32x32, and 64x64 grid options.</li>
<li><strong>5 Drawing Tools</strong>: Pencil, Eraser, Flood Fill, Eyedropper, and Line tools with keyboard shortcuts.</li>
<li><strong>Mirror Mode</strong>: Horizontal symmetry for creating balanced characters, icons, and sprites.</li>
<li><strong>50-Step Undo/Redo</strong>: Full undo history so you never lose progress.</li>
<li><strong>Crisp PNG Export</strong>: Export at 1x, 2x, 4x, 8x, or 16x scale — perfect for game sprites and avatars.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for game developers making sprites, designers creating retro-style icons, and anyone who wants to make pixel art without installing software.</p>
<h2>Privacy & Security</h2>
<p>Runs entirely in your browser — zero uploads, complete privacy.</p>`,
  category: 'image-tools',
  targetKeyword: 'pixel art maker online',
  secondaryKeywords: ['pixel art creator free', 'pixel art generator', 'pixel art editor online', 'pixel drawing tool', 'sprite maker online', 'pixel art grid', 'make pixel art free', '8 bit art maker', 'retro pixel art creator'],
  metaTitle: 'Pixel Art Maker - Free Online Pixel Art Creator & Editor',
  metaDescription: 'Create pixel art on a grid canvas with pencil, fill, line & mirror tools. Export as PNG at up to 16x scale. Free online pixel art maker, no signup needed.',
  faqs: [
    { question: 'What grid sizes are available?', answer: 'You can choose from 8x8, 16x16, 32x32, and 64x64 grids. When switching sizes, your existing artwork is preserved (cropped or padded as needed).' },
    { question: 'How do I export my pixel art?', answer: 'Click the "Export PNG" button after selecting your preferred scale (1x, 2x, 4x, 8x, or 16x). The image is downloaded as a transparent PNG with crisp pixel edges — no blurring.' },
    { question: 'What is Mirror Mode?', answer: 'Mirror Mode enables horizontal symmetry. Everything you draw on the left side is automatically mirrored on the right, perfect for creating characters, faces, and symmetrical icons.' },
    { question: 'Does this tool save my artwork?', answer: 'The tool runs entirely in your browser. Your pixel art is not uploaded or saved on any server. Use the Export PNG button to save your work as an image file.' },
    { question: 'Can I undo mistakes?', answer: 'Yes! The tool supports up to 50 undo/redo steps. Press Ctrl+Z to undo and Ctrl+Shift+Z to redo, or use the toolbar buttons.' },
    { question: 'What tools are available for drawing?', answer: 'Five drawing tools: Pencil (freehand), Eraser (remove pixels), Fill (flood fill connected area), Eyedropper (pick color from canvas), and Line (draw straight lines between two points).' },
  ],
  howToSteps: [
    'Select a canvas size (8x8, 16x16, 32x32, or 64x64) from the sidebar.',
    'Pick a color from the palette or use the color picker for a custom hex color.',
    'Choose a tool — Pencil, Eraser, Fill, Eyedropper, or Line — and start drawing on the grid.',
    'Enable Mirror Mode for symmetrical designs, or toggle the grid overlay as needed.',
    'Use Undo/Redo to correct mistakes (up to 50 steps).',
    'Export your finished pixel art as a PNG at your preferred scale (1x to 16x).',
  ],
  relatedToolSlugs: ['color-picker', 'image-resizer', 'svg-to-png', 'hex-rgb-converter', 'online-whiteboard', 'css-gradient-generator'],
  icon: 'Grid3X3',
  isNew: true,
  estimatedTime: '5-15 min',
});

// ─── INCOME TAX CALCULATOR ─────────────────────────────────────────────
tools.push({
  slug: 'income-tax-calculator',
  name: 'Income Tax Calculator India',
  shortDescription: 'Calculate income tax for FY 2024-27 with all deductions, Old vs New regime comparison, slab-wise breakdown, and monthly take-home.',
  longDescription: `<p>India's most comprehensive <strong>Income Tax Calculator</strong>, updated for FY 2024-25, 2025-26, and 2026-27. Get a precise side-by-side comparison of Old vs New Tax Regime with all deductions.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Multi-Year Support</strong>: FY 2024-25, 2025-26, and 2026-27 with year-specific slabs and rates.</li>
<li><strong>All Old Regime Deductions</strong>: 80C, 80D, 80CCD(1B) NPS, 80TTA, Section 24(b) home loan, 80E education loan, 80G donations, and full HRA exemption.</li>
<li><strong>New Regime 2025-26</strong>: Rs 75K standard deduction, revised slabs, Section 87A rebate making up to Rs 12L tax-free.</li>
<li><strong>Complete Tax Calculation</strong>: Surcharge (10%-37%), 4% Health & Education Cess, and Section 87A rebate included.</li>
<li><strong>Visual Breakdown</strong>: Donut charts, comparison bars, monthly take-home estimate, and recommendation badge.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for salaried employees comparing regimes before declaring investments, and for anyone wanting precise tax liability for multiple income sources.</p>
<h2>Privacy & Security</h2>
<p>All calculations happen entirely in your browser — no data sent to any server.</p>`,
  category: 'calculators',
  targetKeyword: 'income tax calculator India',
  secondaryKeywords: ['income tax calculator 2025-26', 'tax calculator India', 'income tax old vs new regime', 'income tax slab calculator', 'tax calculator FY 2025-26', 'income tax calculator online', 'old regime tax calculator', 'new regime tax calculator', 'income tax deductions calculator', 'salary tax calculator India', 'income tax calculator online India', 'new tax regime calculator 2025', 'income tax calculator with deductions'],
  metaTitle: 'Income Tax Calculator India FY 2025-26 - Old vs New Regime Free',
  metaDescription: 'Calculate income tax for FY 2024-27 with all deductions — 80C, 80D, HRA, NPS. Old vs New regime comparison with slab breakdown. Free income tax calculator India.',
  faqs: [
    { question: 'How is income tax calculated in India?', answer: 'Income tax is calculated by first computing your gross total income (salary + house property + capital gains + other sources), then subtracting eligible deductions to arrive at taxable income. Tax is computed on taxable income using the applicable slab rates, then rebate u/s 87A, surcharge, and 4% cess are applied to get the final tax payable.' },
    { question: 'What deductions are available under the Old Tax Regime?', answer: 'The Old Regime allows Section 80C (Rs 1.5L for PPF, ELSS, LIC), Section 80D (health insurance), Section 80CCD(1B) for NPS (Rs 50K), Section 80TTA (savings interest Rs 10K), Section 24(b) home loan interest (Rs 2L), Section 80E education loan, Section 80G donations, HRA exemption, and standard deduction of Rs 50,000.' },
    { question: 'What deductions are allowed under the New Tax Regime?', answer: 'The New Regime (FY 2025-26+) only allows a standard deduction of Rs 75,000 and employer NPS contribution under Section 80CCD(2). No other Chapter VIA deductions (80C, 80D, etc.) or HRA exemption are available.' },
    { question: 'Is income up to Rs 12 lakh tax-free under the New Regime?', answer: 'Yes, for FY 2025-26 onwards, taxable income up to Rs 12 lakh is effectively tax-free due to the enhanced Section 87A rebate of up to Rs 60,000. With the Rs 75,000 standard deduction, salaried individuals with gross income up to approximately Rs 12.75 lakh pay zero tax.' },
    { question: 'How is surcharge calculated on income tax?', answer: 'Surcharge is levied on the tax amount (not income) at: 10% for income Rs 50L-1Cr, 15% for Rs 1Cr-2Cr, 25% for Rs 2Cr-5Cr, and 37% above Rs 5Cr (Old Regime). Under the New Regime, surcharge is capped at 25%. The 4% Health & Education Cess is applied on tax + surcharge.' },
    { question: 'Which tax regime should I choose?', answer: 'Choose the Old Regime if your total deductions (80C + 80D + HRA + home loan + NPS) exceed Rs 3-4 lakh. The New Regime is better if you have fewer deductions. Use this calculator to compare exact tax under both regimes for your specific income and deductions.' },
  ],
  howToSteps: [
    'Select the Financial Year (2024-25, 2025-26, or 2026-27) and your age group.',
    'Enter your income: gross salary, house property income, capital gains, and other sources.',
    'Fill in Old Regime deductions: 80C, 80D, NPS, home loan interest, HRA details, and more.',
    'Add employer NPS contribution for New Regime if applicable.',
    'View the side-by-side comparison with tax breakdown, donut charts, and recommendation.',
    'Copy the summary or check monthly take-home estimate.',
  ],
  relatedToolSlugs: ['tax-regime-calculator', 'salary-calculator', 'tds-calculator', 'hra-calculator', 'epf-calculator', 'sip-calculator'],
  icon: 'Calculator',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── HASHTAG GENERATOR ──────────────────────────────────────────────────
tools.push({
  slug: 'hashtag-generator',
  name: 'Hashtag Generator',
  shortDescription: 'Generate relevant hashtags for Instagram, TikTok, Twitter & LinkedIn grouped by popularity tier.',
  longDescription: `<p>Find the perfect hashtags for your social media posts with our free <strong>Hashtag Generator</strong>. Get curated hashtags organized by popularity tier for maximum reach.</p>
<h2>Key Features</h2>
<ul>
<li><strong>3 Popularity Tiers</strong>: High-reach (500K+ posts), Medium (50K-500K), and Niche/low competition (under 50K posts).</li>
<li><strong>16 Niche Presets</strong>: Travel, Food, Fitness, Fashion, Tech, Photography, and more — each with 50+ handpicked hashtags.</li>
<li><strong>Platform Optimization</strong>: Select your platform to get the right number of hashtags per best practices.</li>
<li><strong>Select & Copy</strong>: Click individual hashtags to select/deselect, copy all or a curated set.</li>
<li><strong>No API Needed</strong>: 100% offline, browser-based — no rate limits, no signup.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for content creators, social media managers, and brands who want to maximize post reach on Instagram, TikTok, Twitter, and LinkedIn.</p>
<h2>Privacy & Security</h2>
<p>100% free, no signup, no API calls — runs entirely in your browser.</p>`,
  category: 'seo-tools',
  targetKeyword: 'hashtag generator',
  secondaryKeywords: ['Instagram hashtag generator', 'TikTok hashtag generator', 'best hashtags for Instagram', 'hashtag finder', 'trending hashtags generator', 'social media hashtags', 'hashtag generator for Instagram', 'hashtag generator online', 'free hashtag generator', 'Instagram hashtag generator free', 'YouTube hashtag generator'],
  metaTitle: 'Hashtag Generator - Best Hashtags for Instagram & TikTok Free',
  metaDescription: 'Generate trending hashtags for Instagram, TikTok, Twitter & LinkedIn. 16 niches, 800+ hashtags grouped by popularity. Free hashtag generator — no signup needed.',
  faqs: [
    { question: 'How many hashtags should I use on Instagram?', answer: 'Instagram allows up to 30 hashtags per post. Use 20-30 with a mix of high-reach, medium, and niche tags for maximum visibility.' },
    { question: 'What are the three popularity tiers?', answer: 'High (500K+ posts) for broad exposure, Medium (50K-500K) for balanced reach, and Niche (under 50K) for targeted discoverability.' },
    { question: 'Does the tool track my searches?', answer: 'No. All hashtags are stored locally. Nothing is sent to any server.' },
    { question: 'What are banned hashtags?', answer: 'Instagram bans certain hashtags associated with spam. Using them can reduce reach. Our tool flags known banned hashtags.' },
    { question: 'How often are hashtags updated?', answer: 'Our database includes evergreen and trending hashtags that remain relevant. We periodically update to add new trending tags.' },
  ],
  howToSteps: [
    'Enter a topic or keyword in the search box.',
    'Select your platform: Instagram, TikTok, Twitter/X, or LinkedIn.',
    'Optionally choose a niche preset for curated sets.',
    'Browse hashtags grouped by High, Medium, and Niche tiers.',
    'Click individual hashtags to select/deselect, or use Copy All.',
    'Use Copy Set of 30 for an Instagram-optimized mix.',
  ],
  relatedToolSlugs: ['instagram-engagement-calculator', 'social-media-bio-generator', 'hook-caption-scorer', 'youtube-title-generator'],
  icon: 'Hash',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── INDIAN FOOD CALORIE COUNTER ────────────────────────────────────────
tools.push({
  slug: 'indian-food-calorie-counter',
  name: 'Indian Food Calorie Counter',
  shortDescription: 'Search calories in 200+ Indian dishes. Track daily meals with protein, carbs & fat breakdown.',
  longDescription: `<p>Track your daily calorie intake with our <strong>Indian Food Calorie Counter</strong> — a database of 200+ Indian dishes with calories, protein, carbs, fat, and fiber in standard Indian portions.</p>
<h2>Key Features</h2>
<ul>
<li><strong>200+ Indian Dishes</strong>: Comprehensive database using IFCT and NIN nutritional references.</li>
<li><strong>Standard Portions</strong>: Values in natural Indian measures — "1 medium roti", "1 katori dal", "1 plate rice".</li>
<li><strong>Category Browsing</strong>: Breakfast, Dal & Curries, Rice Dishes, Roti & Bread, Snacks, Sweets, Drinks, Salads.</li>
<li><strong>Daily Meal Tracker</strong>: Add items to Breakfast/Lunch/Dinner/Snacks, set your calorie goal, track with a visual ring.</li>
<li><strong>Quantity Multiplier</strong>: Adjust portions from 0.5x to 2x for each food item.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for health-conscious Indians tracking their diet, fitness enthusiasts, and anyone managing their weight on traditional Indian food.</p>
<h2>Privacy & Security</h2>
<p>All data stays in your browser — no app download, no account required, nothing sent to any server.</p>`,
  category: 'calculators',
  targetKeyword: 'Indian food calorie counter',
  secondaryKeywords: ['calories in Indian food', 'Indian food calorie chart', 'Indian diet calorie calculator', 'calories in dal rice', 'calories in roti', 'calorie counter India'],
  metaTitle: 'Indian Food Calorie Counter - 200+ Dishes Free',
  metaDescription: 'Search calories in 200+ Indian dishes with protein, carbs & fat. Daily meal tracker with calorie budget. Free Indian food calorie counter — no signup needed.',
  faqs: [
    { question: 'How accurate are the calorie values?', answer: 'Our database uses nutritional data from IFCT and NIN references. Values are per standard serving and may vary by preparation method.' },
    { question: 'What serving sizes are used?', answer: 'Standard Indian portions: 1 medium roti (~40g), 1 katori dal (~150ml), 1 plate rice (~150g cooked), etc.' },
    { question: 'Does it include non-vegetarian items?', answer: 'Yes — chicken curry, fish curry, egg bhurji, mutton biryani, and more alongside all vegetarian options.' },
    { question: 'Is my food data saved?', answer: 'The tracker resets on refresh. All data stays in your browser — nothing is sent to any server.' },
    { question: 'Can I adjust portion sizes?', answer: 'Yes, use the 0.5x to 2x quantity multiplier to adjust serving sizes for each food item.' },
  ],
  howToSteps: [
    'Search for an Indian food item or browse by category.',
    'Click a food item to see its full nutritional breakdown.',
    'Adjust quantity and add it to a meal (Breakfast/Lunch/Dinner/Snacks).',
    'Track your daily intake with the visual calorie budget ring.',
    'Copy your daily summary to save or share.',
  ],
  relatedToolSlugs: ['bmi-calculator', 'tdee-macro-calculator', 'recipe-scaler', 'percentage-calculator'],
  icon: 'UtensilsCrossed',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── WEDDING BUDGET CALCULATOR ──────────────────────────────────────────
tools.push({
  slug: 'wedding-budget-calculator',
  name: 'Wedding Budget Calculator India',
  shortDescription: 'Plan your Indian wedding budget with pre-filled categories — venue, catering, lehenga, mehndi, baraat & more.',
  longDescription: `<p>Plan your dream <strong>Indian wedding within budget</strong>. Enter your total budget and guest count, and the tool allocates across 13 wedding categories with visual tracking.</p>
<h2>Key Features</h2>
<ul>
<li><strong>13 Indian Wedding Categories</strong>: Venue & Mandap, Catering, Decoration, Photography, Bride's Outfit, Groom's Outfit, Mehndi & Sangeet, Baraat & Band, Invitations, Makeup, Transport, Pandit & Rituals, and Miscellaneous.</li>
<li><strong>Smart Defaults</strong>: Pre-filled percentages based on typical Indian wedding spending patterns.</li>
<li><strong>Actual vs Budget Tracking</strong>: Enter actual spending for each category with visual progress bars.</li>
<li><strong>Per-Guest Cost</strong>: Real-time per-guest cost calculation based on guest count.</li>
<li><strong>INR Formatting</strong>: All amounts in Indian numbering format (lakhs/crores).</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for couples and families planning Indian weddings — from simple ₹5-10L celebrations to grand ₹50L+ events.</p>
<h2>Privacy & Security</h2>
<p>All data stays in your browser session — nothing sent to any server.</p>`,
  category: 'calculators',
  targetKeyword: 'wedding budget calculator India',
  secondaryKeywords: ['marriage budget planner', 'shaadi budget calculator', 'Indian wedding cost estimator', 'wedding cost calculator', 'wedding budget planner'],
  metaTitle: 'Wedding Budget Calculator India - Plan Shaadi Free',
  metaDescription: 'Plan your Indian wedding budget with 13 categories — venue, catering, lehenga, mehndi, baraat & more. Track spending vs budget. Free calculator.',
  faqs: [
    { question: 'What categories are included?', answer: '13 Indian-specific categories: Venue & Mandap (25%), Catering (20%), Decoration (10%), Photography (8%), Bride\'s Outfit (10%), Groom\'s Outfit (5%), Mehndi & Sangeet (5%), Baraat (3%), Invitations (2%), Makeup (3%), Transport (3%), Pandit (2%), Miscellaneous (4%).' },
    { question: 'How much does an Indian wedding cost?', answer: 'Varies from ₹5-10L for simple to ₹50L+ for grand celebrations. Average is ₹10-25L depending on city and preferences.' },
    { question: 'Can I customize the percentages?', answer: 'Yes! Default percentages are suggestions. Edit any category amount to match your priorities.' },
    { question: 'How is per-guest cost calculated?', answer: 'Total budget divided by guest count. Helps understand the cost of each additional guest.' },
    { question: 'Is my data saved?', answer: 'Data stays in your browser session. Copy the summary before closing. Nothing is sent to any server.' },
  ],
  howToSteps: [
    'Enter your total wedding budget in INR.',
    'Set the expected guest count.',
    'Review auto-allocated budget for each category.',
    'Edit amounts to match your priorities.',
    'Enter actual spending as you book vendors.',
    'Monitor progress bars for over/under budget status.',
    'Copy budget summary to share with family.',
  ],
  relatedToolSlugs: ['emi-calculator', 'discount-calculator', 'percentage-calculator', 'invoice-generator'],
  icon: 'Heart',
  isNew: true,
  estimatedTime: '5 min',
});

// ─── SOCIAL MEDIA IMAGE RESIZER ─────────────────────────────────────────
tools.push({
  slug: 'social-media-image-resizer',
  name: 'Social Media Image Resizer',
  shortDescription: 'Upload one image and resize for Instagram, Facebook, Twitter, LinkedIn, YouTube & more at once.',
  longDescription: `<p>Resize images for every <strong>social media platform</strong> in one go. Upload a single image and get perfectly sized versions for Instagram, Facebook, Twitter, LinkedIn, YouTube, and 10+ more platforms instantly.</p>
<h2>Key Features</h2>
<ul>
<li><strong>15+ Platform Presets</strong>: Instagram Post/Story/Reel, Facebook Post/Cover/Story, Twitter/X, LinkedIn, YouTube Thumbnail, Pinterest, WhatsApp, TikTok, and more.</li>
<li><strong>Smart Center-Cropping</strong>: Automatically scales and crops each image from center to fit the exact required dimensions.</li>
<li><strong>Batch Download</strong>: Download all selected sizes at once — each file named with platform and dimensions.</li>
<li><strong>Format & Quality Control</strong>: Choose JPG or PNG output with quality from 60–100%.</li>
<li><strong>100% Browser-Based</strong>: All processing uses Canvas API — images never leave your device.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Perfect for social media managers, content creators, and marketers who need to repurpose a single image across multiple platforms without manually resizing in design tools.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no uploads, no server processing, no data stored. Your images stay completely private.</p>`,
  category: 'image-tools',
  targetKeyword: 'social media image resizer',
  secondaryKeywords: ['resize image for Instagram', 'social media image sizes 2026', 'multi-platform image resizer', 'Instagram post size', 'YouTube thumbnail size'],
  metaTitle: 'Social Media Image Resizer - All Platforms Free',
  metaDescription: 'Resize one image for Instagram, Facebook, Twitter, LinkedIn, YouTube & more. Preview all sizes, download all. Free social media image resizer — 100% private.',
  faqs: [
    { question: 'What platforms are supported?', answer: 'Instagram (Post, Story, Reel), Facebook (Post, Cover, Story), Twitter/X, LinkedIn, YouTube, Pinterest, WhatsApp, TikTok — 15+ presets.' },
    { question: 'Are my images uploaded?', answer: 'No. All processing happens in your browser using Canvas API. Images never leave your device.' },
    { question: 'What formats are supported?', answer: 'Upload JPG, PNG, or WebP. Choose JPG or PNG output with 60-100% quality.' },
    { question: 'Can I download all sizes at once?', answer: 'Yes! Download All gets all selected sizes, each named with platform and dimensions.' },
    { question: 'How does cropping work?', answer: 'Smart center-cropping scales and crops from center to fit each dimension.' },
  ],
  howToSteps: [
    'Upload an image by dragging or clicking.',
    'Select platform sizes using checkboxes.',
    'Preview how your image looks at each size.',
    'Choose output format and quality.',
    'Download individual sizes or click Download All.',
  ],
  relatedToolSlugs: ['image-resizer', 'image-compressor', 'image-cropper', 'aspect-ratio-calculator'],
  icon: 'Smartphone',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── LEGAL NOTICE GENERATOR INDIA ───────────────────────────────────────
tools.push({
  slug: 'legal-notice-generator',
  name: 'Legal Notice Generator India',
  shortDescription: 'Generate formatted legal notices for cheque bounce, recovery, rent eviction & more.',
  longDescription: `<p>Generate properly formatted <strong>Indian legal notices</strong> for common scenarios with correct legal language and section references — in minutes, not hours.</p>
<h2>Key Features</h2>
<ul>
<li><strong>6 Notice Types</strong>: Cheque Bounce (Section 138), Recovery of Money, Rent Eviction, Breach of Contract, Defamation, and Property Dispute.</li>
<li><strong>Proper Legal Format</strong>: Numbered paragraphs, demand clause, statutory references, and consequence statements in formal legal language.</li>
<li><strong>Advocate Details</strong>: Optional advocate name, enrollment number, and bar council field for professional notices.</li>
<li><strong>Live Preview</strong>: See the formatted notice update in real-time as you fill in details.</li>
<li><strong>Download & Copy</strong>: Save as PNG or copy plain text to use on letterhead.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Individuals and businesses needing to draft legal notices for cheque bounce recovery, unpaid dues, rent eviction, or contract breaches before approaching a lawyer. Note: These are templates — consult an advocate for legal validity.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your personal and legal information is never sent to any server.</p>`,
  category: 'utility-tools',
  targetKeyword: 'legal notice format India',
  secondaryKeywords: ['legal notice generator free', 'cheque bounce notice format', 'legal notice template India', 'legal notice for recovery', 'Section 138 notice'],
  metaTitle: 'Legal Notice Generator India - Free Templates Online',
  metaDescription: 'Generate legal notices for cheque bounce, recovery, rent eviction & more. Proper Indian legal format. Free legal notice generator — no signup.',
  faqs: [
    { question: 'Is this legally valid?', answer: 'This generates properly formatted templates. For legal validity, have it reviewed by an advocate, printed on letterhead, and sent via registered post.' },
    { question: 'What types are supported?', answer: 'Cheque Bounce (Sec 138), Recovery of Money, Rent Eviction, Breach of Contract, Defamation, and Property Dispute.' },
    { question: 'Do I need a lawyer?', answer: 'Recommended but not required. A lawyer-sent notice carries more weight. Our tool has an optional advocate details field.' },
    { question: 'What is the response deadline?', answer: 'Standard is 15-30 days. For cheque bounce (Sec 138), the recipient must pay within 15 days of receiving the notice.' },
    { question: 'Is my data saved?', answer: 'No. Everything stays in your browser. Your personal and legal information remains private.' },
  ],
  howToSteps: [
    'Select the type of legal notice.',
    'Enter sender and recipient details.',
    'Fill in notice-specific fields.',
    'Optionally add advocate details.',
    'Preview the formatted notice.',
    'Download as PNG or copy the text.',
  ],
  relatedToolSlugs: ['noc-generator', 'affidavit-generator', 'rent-agreement-generator', 'privacy-policy-generator'],
  icon: 'Scale',
  isNew: true,
  estimatedTime: '5 min',
});

// ─── AFFIDAVIT GENERATOR INDIA ──────────────────────────────────────────
tools.push({
  slug: 'affidavit-generator',
  name: 'Affidavit Generator India',
  shortDescription: 'Generate formatted Indian affidavits — name change, address change, DOB correction & more.',
  longDescription: `<p>Create properly formatted <strong>Indian affidavits</strong> for common legal purposes with correct declaration language, verification clause, and notary section — ready to print on stamp paper.</p>
<h2>Key Features</h2>
<ul>
<li><strong>7 Affidavit Types</strong>: General Purpose, Name Change, Address Change, DOB Correction, Income Declaration, Gap Certificate, and Identity Declaration.</li>
<li><strong>Correct Legal Format</strong>: Declaration paragraphs, verification clause, deponent signature area, and notary/oath commissioner section.</li>
<li><strong>Type-Specific Fields</strong>: Each affidavit type has fields specific to its purpose — old/new name for name change, old/new address for address change, etc.</li>
<li><strong>Print-Ready Download</strong>: Download as PNG sized for A4 paper — print on stamp paper and get notarized.</li>
<li><strong>Date & Place</strong>: Set the place and date of execution for legal completeness.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Individuals needing affidavits for passport applications, bank name changes, college gap certificates, government document corrections, or income declarations. After downloading, sign before a Notary Public to make it legally valid.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — personal details are never sent to any server or stored anywhere.</p>`,
  category: 'utility-tools',
  targetKeyword: 'affidavit format India',
  secondaryKeywords: ['name change affidavit format', 'affidavit generator online', 'general affidavit format', 'affidavit for passport', 'gap certificate affidavit'],
  metaTitle: 'Affidavit Generator India - Name Change & More Free',
  metaDescription: 'Generate Indian affidavits for name change, address change, DOB correction & more. Proper legal format. Free affidavit generator — no signup.',
  faqs: [
    { question: 'What types are supported?', answer: 'General Purpose, Name Change, Address Change, DOB Correction, Income Declaration, Gap Certificate, and Identity Declaration.' },
    { question: 'Is it legally valid?', answer: 'Print on stamp paper (₹10-100 by state), sign before a Notary Public or Oath Commissioner to make it legally valid.' },
    { question: 'Do I need a lawyer?', answer: 'No, but it must be signed before a Notary Public who verifies your identity.' },
    { question: 'What stamp paper value is needed?', answer: 'Generally ₹10-50 non-judicial stamp paper. Check your state\'s requirements.' },
    { question: 'Is my data stored?', answer: 'No. Everything is processed in your browser. Personal details are never sent to any server.' },
  ],
  howToSteps: [
    'Select the affidavit type.',
    'Enter personal details: name, parent\'s name, age, address.',
    'Fill in type-specific fields.',
    'Set date and place of execution.',
    'Preview the formatted affidavit.',
    'Download as PNG to print on stamp paper.',
  ],
  relatedToolSlugs: ['legal-notice-generator', 'noc-generator', 'rent-agreement-generator', 'experience-letter-generator'],
  icon: 'FileCheck',
  isNew: true,
  estimatedTime: '5 min',
});

// ─── TEXT BEHIND IMAGE GENERATOR ────────────────────────────────────────
tools.push({
  slug: 'text-behind-image',
  name: 'Text Behind Image Generator',
  shortDescription: 'Create the viral text-behind-subject effect — text appears to go behind a person or object.',
  longDescription: `<p>Create the viral <strong>text behind image</strong> effect that makes text appear to go behind a person or object. Upload, mask, and download — no Photoshop needed.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Three-Layer Rendering</strong>: Background image → text layer → masked foreground — creates the perfect depth illusion using Canvas API.</li>
<li><strong>Brush Masking Tool</strong>: Paint over the subject (person, object) to extract it above the text. Adjustable brush size and eraser for precision.</li>
<li><strong>10 Font Choices</strong>: Arial, Impact, Georgia, Playfair Display, Bebas Neue, Oswald, Montserrat, Lobster, Roboto Condensed, and Anton.</li>
<li><strong>Full Text Customization</strong>: Adjust size, weight, letter spacing, color, opacity, and position.</li>
<li><strong>High-Quality Output</strong>: Download as PNG at original image resolution with no watermarks.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Content creators, social media influencers, designers, and marketers wanting to create the trending text-behind-subject effect for Instagram posts, YouTube thumbnails, and promotional graphics.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser using Canvas API — images never leave your device. No AI, no signup required.</p>`,
  category: 'image-tools',
  targetKeyword: 'text behind image generator',
  secondaryKeywords: ['text behind image online free', 'text behind photo effect', 'text behind subject tool', 'text behind person effect'],
  metaTitle: 'Text Behind Image Generator - Free Online Tool',
  metaDescription: 'Create the viral text-behind-subject effect online free. Paint mask, add text, download PNG. No AI, no signup. Text behind image generator.',
  faqs: [
    { question: 'How does it work?', answer: 'Three layers: original image as background, text in the middle, masked foreground on top. Paint over the subject to extract it above the text.' },
    { question: 'Do I need to be precise?', answer: 'Stay within subject edges. Use smaller brush for details and eraser for mistakes.' },
    { question: 'What fonts are available?', answer: '10 fonts: Arial, Impact, Georgia, Playfair Display, Bebas Neue, Oswald, Montserrat, Lobster, Roboto Condensed, Anton.' },
    { question: 'Are images uploaded?', answer: 'No. All processing happens in your browser using Canvas API. Images never leave your device.' },
    { question: 'What quality is the download?', answer: 'PNG matches original image resolution with full quality.' },
  ],
  howToSteps: [
    'Upload a photo with a clear subject.',
    'Type text and customize font, size, color, position.',
    'Paint over the subject that should appear in front.',
    'Use eraser to fix masking mistakes.',
    'Preview the effect in real-time.',
    'Download as high-quality PNG.',
  ],
  relatedToolSlugs: ['image-background-remover', 'meme-generator', 'image-watermark', 'image-cropper'],
  icon: 'Layers',
  isNew: true,
  estimatedTime: '3 min',
});

// ─── YOUTUBE TITLE & DESCRIPTION GENERATOR ──────────────────────────────
tools.push({
  slug: 'youtube-title-generator',
  name: 'YouTube Title & Description Generator',
  shortDescription: 'Generate SEO-optimized YouTube titles and descriptions using proven template formulas.',
  longDescription: `<p>Generate click-worthy, SEO-optimized <strong>YouTube titles</strong> and professional video descriptions using proven viral formulas — no AI, no API, instant results.</p>
<h2>Key Features</h2>
<ul>
<li><strong>10+ Title Formulas</strong>: Templates based on top-performing videos — curiosity gaps, numbered lists, how-tos, challenges, reviews, and more.</li>
<li><strong>14 Content Niches</strong>: Tech, Gaming, Vlog, Tutorial, Review, Cooking, Fitness, Finance, Travel, Education, Entertainment, News, Music, and Motivation.</li>
<li><strong>SEO Score & Length</strong>: Each title shows a character count with color indicators for optimal 50–70 character range.</li>
<li><strong>Description Generator</strong>: Structured descriptions with hook paragraph, timestamps, key points, resource links, social links, hashtags, and disclaimer.</li>
<li><strong>5000-Char Tracker</strong>: Real-time character counter keeps descriptions within YouTube's limit.</li>
</ul>
<h2>Who Is This For?</h2>
<p>YouTubers, video marketers, and content creators who want to quickly generate optimized titles and descriptions without staring at a blank screen.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no AI calls, no data sent to any server, completely free and private.</p>`,
  category: 'seo-tools',
  targetKeyword: 'YouTube title generator',
  secondaryKeywords: ['YouTube description generator', 'YouTube SEO title tool', 'video title ideas generator', 'YouTube title ideas', 'YouTube description template'],
  metaTitle: 'YouTube Title & Description Generator - Free SEO Tool',
  metaDescription: 'Generate SEO-optimized YouTube titles and descriptions using proven formulas. 14 niches, 100+ templates. Free generator — no AI, no signup.',
  faqs: [
    { question: 'How are titles generated?', answer: 'The tool uses proven formula templates from top-performing YouTube videos. You enter your topic and it fills in patterns. No AI — pure template-based.' },
    { question: 'What is the ideal title length?', answer: '50-70 characters for optimal click-through rate. Each title shows its character count with color indicators.' },
    { question: 'What niches are supported?', answer: '14 niches: Tech, Gaming, Vlog, Tutorial, Review, Cooking, Fitness, Finance, Travel, Education, Entertainment, News, Music, Motivation.' },
    { question: 'What does the description include?', answer: 'Hook paragraph, timestamps section, key points, links & resources, social media links, hashtags, and disclaimer.' },
    { question: 'Does this use AI?', answer: 'No. Handcrafted template formulas. Works instantly, no API keys, no data sent anywhere.' },
  ],
  howToSteps: [
    'Select Title Generator or Description Generator tab.',
    'Enter your video topic or keyword.',
    'Choose your content niche.',
    'Browse 10+ generated titles with SEO scores.',
    'Click any title to copy it.',
    'Use Description mode for structured video descriptions.',
    'Copy the complete description for YouTube Studio.',
  ],
  relatedToolSlugs: ['youtube-thumbnail-tester', 'youtube-money-calculator', 'youtube-thumbnail-downloader', 'hook-caption-scorer'],
  icon: 'Youtube',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── OPEN GRAPH PREVIEW TESTER ──────────────────────────────────────────
tools.push({
  slug: 'og-preview-tester',
  name: 'Open Graph Preview Tester',
  shortDescription: 'Preview how your OG meta tags appear on Google, Facebook, Twitter, LinkedIn, Discord & WhatsApp.',
  longDescription: `<p>Preview exactly how your website appears when shared on social media with our free <strong>Open Graph preview tester</strong> — pixel-accurate mockups across 7 platforms, instant and client-side.</p>
<h2>Key Features</h2>
<ul>
<li><strong>7 Platform Previews</strong>: Google Search, Facebook, Twitter/X, LinkedIn, Discord, WhatsApp, and Slack — each rendered as an accurate card mockup.</li>
<li><strong>Auto-Extract from HTML</strong>: Paste your HTML &lt;head&gt; section and all OG tags are auto-extracted into the fields.</li>
<li><strong>Tag Validation</strong>: Checks for required tags, warns about suboptimal title/description lengths, and validates image dimensions.</li>
<li><strong>One-Click HTML Generator</strong>: Copy the complete HTML meta tag block ready to paste into your website's &lt;head&gt;.</li>
<li><strong>Instant Results</strong>: No URL fetching, no CORS issues — works entirely in your browser.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Web developers, SEO specialists, and marketers who need to verify that social sharing previews look correct before publishing — without waiting for platform caches to update.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% client-side — no URLs are fetched, no data is sent to any server. Instant and completely private.</p>`,
  category: 'seo-tools',
  targetKeyword: 'open graph preview',
  secondaryKeywords: ['OG tag tester', 'social media card preview', 'meta tag preview tool', 'Twitter card preview', 'Facebook share preview', 'og meta tag tester'],
  metaTitle: 'Open Graph Preview Tester - Social Card Preview Free',
  metaDescription: 'Preview OG meta tags on Google, Facebook, Twitter, LinkedIn, Discord & WhatsApp. Validate tags, generate HTML. Free OG preview tester — client-side.',
  faqs: [
    { question: 'What are OG meta tags?', answer: 'Open Graph tags in your HTML <head> control how content appears on social media. Key tags: og:title, og:description, og:image, og:url.' },
    { question: 'Why not fetch URLs directly?', answer: 'This tool is 100% client-side. You paste meta content directly for instant previews without CORS issues or caching delays.' },
    { question: 'What image size is recommended?', answer: '1200x630 pixels works across all platforms. Facebook needs 600x315 minimum, Twitter recommends 800x418.' },
    { question: 'What is the ideal title length?', answer: '40-60 characters. Facebook truncates at ~60, Twitter at ~70, Google at ~50-60.' },
    { question: 'Can I generate the HTML tags?', answer: 'Yes! Click Copy OG Meta Tags to get the complete HTML meta tag block.' },
  ],
  howToSteps: [
    'Enter og:title, og:description, og:image URL, and other fields.',
    'Or paste your HTML <head> section to auto-extract.',
    'Preview on Google, Facebook, Twitter, LinkedIn, Discord, WhatsApp, Slack.',
    'Review validation warnings.',
    'Click Copy OG Meta Tags to generate HTML.',
    'Paste into your website\'s <head> section.',
  ],
  relatedToolSlugs: ['meta-tag-generator', 'robots-txt-generator', 'favicon-generator', 'roast-my-website'],
  icon: 'Eye',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── BLOOD PRESSURE TRACKER ─────────────────────────────────────────────
tools.push({
  slug: 'blood-pressure-tracker',
  name: 'Blood Pressure Tracker & Log',
  shortDescription: 'Log BP readings, visualize trends with charts, and generate printable reports for your doctor.',
  longDescription: `<p>Log, visualize, and analyze your blood pressure over time with our free <strong>blood pressure tracker</strong> — complete with trend charts, automatic classification, and printable doctor reports.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Auto-Classification</strong>: Each reading is automatically classified as Normal (&lt;120/80), Elevated, High Stage 1, Stage 2, or Crisis — with color-coded badges.</li>
<li><strong>Trend Chart</strong>: SVG line chart with color-coded background zones shows systolic, diastolic, and pulse trends over time.</li>
<li><strong>Averages Dashboard</strong>: View 7-day, 30-day, and all-time average readings at a glance.</li>
<li><strong>CSV Export & Import</strong>: Export readings for backup or import a previous export to restore data.</li>
<li><strong>Print Reports</strong>: Generate a formatted summary with readings, averages, and chart — ideal for doctor visits.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Patients monitoring hypertension, people tracking cardiovascular health, or anyone advised by their doctor to keep a blood pressure log. Data is stored locally in your browser — never shared.</p>
<h2>Privacy & Security</h2>
<p>Health data stays in your browser's localStorage only — nothing is ever sent to any server or third party.</p>`,
  category: 'calculators',
  targetKeyword: 'blood pressure tracker online',
  secondaryKeywords: ['BP log chart', 'blood pressure chart', 'hypertension tracker', 'blood pressure monitor log', 'BP tracker web'],
  metaTitle: 'Blood Pressure Tracker - Log, Chart & Report Free',
  metaDescription: 'Log BP readings, visualize trends with charts, track averages. Export CSV, print reports. Free BP tracker — data stays in your browser.',
  faqs: [
    { question: 'What is normal blood pressure?', answer: 'Below 120/80 mmHg. Elevated: 120-129/<80. High Stage 1: 130-139/80-89. Stage 2: 140+/90+. Crisis: >180/>120.' },
    { question: 'Where is data stored?', answer: 'In your browser\'s localStorage. Nothing sent to any server. Use CSV export for backups.' },
    { question: 'Can I import readings?', answer: 'Yes! Export as CSV and import back using the Import CSV button.' },
    { question: 'How often should I measure?', answer: 'For hypertension monitoring, twice daily (morning and evening) at the same times. Take 2-3 readings each time.' },
    { question: 'Can I share with my doctor?', answer: 'Yes! Print report feature generates a formatted summary with readings, averages, and chart.' },
  ],
  howToSteps: [
    'Enter systolic, diastolic, and pulse rate.',
    'Select date, time, arm, and position.',
    'Click Add Reading to log it.',
    'View the trend chart with color-coded zones.',
    'Check averages in the statistics panel.',
    'Export as CSV or print a report for your doctor.',
  ],
  relatedToolSlugs: ['bmi-calculator', 'tdee-macro-calculator', 'age-calculator', 'pregnancy-due-date-calculator'],
  icon: 'HeartPulse',
  isNew: true,
  estimatedTime: '2 min',
});

// ─── ESSAY OUTLINE BUILDER ──────────────────────────────────────────────
tools.push({
  slug: 'essay-outline-builder',
  name: 'Essay Outline Builder',
  shortDescription: 'Generate structured essay outlines for argumentative, persuasive, expository & more essay types.',
  longDescription: `<p>Generate a structured, complete <strong>essay outline</strong> in seconds — choose your essay type, enter your topic and thesis, and get a ready-to-fill framework with introduction, body paragraphs, and conclusion.</p>
<h2>Key Features</h2>
<ul>
<li><strong>8 Essay Types</strong>: Argumentative, Persuasive, Expository, Narrative, Compare &amp; Contrast, Cause &amp; Effect, Descriptive, and Analytical.</li>
<li><strong>Full Structure</strong>: Introduction (hook, background, thesis statement), 3–5 Body Paragraphs (topic sentence, evidence slots, analysis, transitions), and Conclusion.</li>
<li><strong>Fully Editable</strong>: All sections are editable. Add or remove body paragraphs and reorder them with drag.</li>
<li><strong>Multiple Export Formats</strong>: Export as plain text, Markdown, or copy to clipboard instantly.</li>
<li><strong>Academic Conventions</strong>: Follows standard academic essay structure with evidence and analysis prompts in each paragraph.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Students from high school to university, writers working on structured articles, and educators creating essay templates for classroom use.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — no signup, no data stored, completely free and private.</p>`,
  category: 'text-tools',
  targetKeyword: 'essay outline generator',
  secondaryKeywords: ['essay outline builder', 'essay structure template', 'essay planner', 'how to outline an essay', 'argumentative essay outline'],
  metaTitle: 'Essay Outline Builder - Generate Essay Outlines Free',
  metaDescription: 'Generate structured essay outlines for argumentative, persuasive, expository & more. Editable sections, export as text. Free essay outline builder.',
  faqs: [
    { question: 'What essay types are supported?', answer: '8 types: Argumentative, Persuasive, Expository, Narrative, Compare & Contrast, Cause & Effect, Descriptive, Analytical.' },
    { question: 'Does it write the essay?', answer: 'No. It generates an outline framework with guiding prompts. You fill in the content yourself.' },
    { question: 'Can I customize the outline?', answer: 'Yes! All sections are editable. Add/remove body paragraphs (3-5), reorder, modify structure.' },
    { question: 'What export formats?', answer: 'Plain text, Markdown, or copy to clipboard.' },
    { question: 'Is this suitable for academic essays?', answer: 'Yes! Follows standard academic conventions with evidence and analysis sections.' },
  ],
  howToSteps: [
    'Select your essay type from 8 options.',
    'Enter your topic and thesis statement.',
    'Choose number of body paragraphs (3-5).',
    'Click Generate Outline.',
    'Fill in each section with your content.',
    'Reorder and add/remove sections as needed.',
    'Export as text, Markdown, or copy to clipboard.',
  ],
  relatedToolSlugs: ['word-counter', 'essay-counter-readability', 'citation-generator', 'paraphrasing-tool'],
  icon: 'FileText',
  isNew: true,
  estimatedTime: '5 min',
});

// ─── GPA CALCULATOR ─────────────────────────────────────────────────────
tools.push({
  slug: 'gpa-calculator',
  name: 'GPA Calculator',
  shortDescription: 'Calculate GPA/CGPA across Indian 10-point, US 4.0, and percentage scales with semester tracking.',
  longDescription: `<p>Calculate your <strong>GPA and CGPA</strong> across multiple grading systems — Indian 10-point, US 4.0, and percentage-based — with full semester-by-semester tracking and a target GPA planner.</p>
<h2>Key Features</h2>
<ul>
<li><strong>3 Grading Systems</strong>: Indian 10-point CGPA (O=10 through F=0), US 4.0 GPA (A+=4.0 through F=0), and percentage-based grading.</li>
<li><strong>Semester Tracking</strong>: Add up to 8 semesters with unlimited subjects, credits, and grades — see SGPA per semester and cumulative CGPA.</li>
<li><strong>Visual Progress Bars</strong>: Color-coded bars show SGPA for each semester at a glance.</li>
<li><strong>Percentage Conversion</strong>: Automatically converts CGPA to equivalent percentage and academic classification (Distinction, First Class, etc.).</li>
<li><strong>Target GPA Calculator</strong>: Enter your desired CGPA and see exactly what SGPA you need next semester to reach it.</li>
</ul>
<h2>Who Is This For?</h2>
<p>College and university students in India and abroad who need to track academic performance, plan for target grades, or convert CGPA for job applications and graduate school admissions.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — all calculations happen locally with no data sent to any server.</p>`,
  category: 'calculators',
  targetKeyword: 'GPA calculator',
  secondaryKeywords: ['CGPA calculator', 'SGPA to CGPA calculator', 'GPA calculator India', 'college GPA calculator', 'grade calculator'],
  metaTitle: 'GPA Calculator - CGPA, SGPA & Grades Free',
  metaDescription: 'Calculate GPA/CGPA across Indian 10-point, US 4.0 & percentage scales. Semester tracking, conversion, target GPA. Free GPA calculator.',
  faqs: [
    { question: 'What grading systems are supported?', answer: 'Indian 10-point CGPA (O=10 through F=0), US 4.0 GPA (A+=4.0 through F=0), and percentage-based grading.' },
    { question: 'How is CGPA converted to percentage?', answer: 'Indian 10-point: Percentage = CGPA x 9.5. Example: 8.5 CGPA ≈ 80.75%. Some universities use different formulas.' },
    { question: 'What is SGPA vs CGPA?', answer: 'SGPA is weighted average for one semester. CGPA is cumulative across all semesters, weighted by credits.' },
    { question: 'Can I convert Indian CGPA to US GPA?', answer: 'Roughly: Indian CGPA / 2.5 ≈ US GPA. Example: 8.0 ≈ 3.2 GPA. Exact conversions vary by institution.' },
    { question: 'How does Target GPA work?', answer: 'Enter your desired CGPA and it calculates the SGPA needed next semester based on current CGPA and credits completed.' },
  ],
  howToSteps: [
    'Select grading system: Indian 10-point, US 4.0, or Percentage.',
    'Add a semester with subject name, credits, and grade.',
    'View SGPA per semester and cumulative CGPA.',
    'Add more semesters to track progress.',
    'Check equivalent percentage and classification.',
    'Use Target GPA calculator for future planning.',
    'Copy results to save or share.',
  ],
  relatedToolSlugs: ['cgpa-to-percentage', 'percentage-calculator', 'attendance-calculator', 'average-calculator'],
  icon: 'GraduationCap',
  isNew: true,
  estimatedTime: '3 min',
});

// ─── PDF EDITOR ─────────────────────────────────────────────────────────
tools.push({
  slug: 'pdf-editor',
  name: 'PDF Editor',
  shortDescription: 'Edit PDF files online free — add text, images, shapes, highlights, signatures, stamps & more. 100% private.',
  longDescription: `<p>The most powerful free <strong>PDF editor online</strong> that runs entirely in your browser — add text, images, shapes, highlights, signatures, and stamps without uploading your file to any server.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Rich Annotation Tools</strong>: Text (custom fonts, sizes, colors), freehand pen, rectangles, circles, lines, arrows, highlights, whiteout/redaction, images, signatures, and professional stamps (APPROVED, DRAFT, CONFIDENTIAL, VOID, etc.).</li>
<li><strong>Signature Pad</strong>: Draw your signature with mouse or touch, then place and resize it anywhere on the PDF.</li>
<li><strong>Multi-Page Support</strong>: Navigate pages with thumbnail preview, zoom in/out, and keyboard shortcuts (V, T, P, R, H, Ctrl+Z, Ctrl+Y, Ctrl+S).</li>
<li><strong>No Watermarks</strong>: Downloaded PDF is clean — no branding, no "Created with..." stamps, no hidden overlays.</li>
<li><strong>No File Size Limits</strong>: No artificial caps or daily limits — works on PDFs up to 50–100 MB on modern browsers.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Anyone needing to sign contracts, fill forms, annotate reports, redact sensitive information, or add text to PDF documents — without paying for Adobe Acrobat or uploading files to iLovePDF or SmallPDF.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser — your PDF never leaves your device. No signup, no upload, no data stored. Completely private, always free.</p>`,
  category: 'pdf-tools',
  targetKeyword: 'PDF editor online',
  secondaryKeywords: ['edit PDF online', 'PDF editor free', 'online PDF editor', 'edit PDF online free', 'PDF editor no signup', 'add text to PDF', 'sign PDF online', 'annotate PDF free', 'highlight PDF online', 'free PDF editor no watermark', 'PDF editor without upload', 'edit PDF in browser', 'PDF markup tool'],
  metaTitle: 'PDF Editor Online Free - Edit, Sign & Annotate PDF | No Upload',
  metaDescription: 'Edit PDF online for free — add text, images, shapes, highlights, signatures & stamps. 100% private, no upload, no watermark. Works in your browser.',
  faqs: [
    { question: 'Is my PDF uploaded to any server?', answer: 'No, never. This is a 100% client-side PDF editor. Your PDF is loaded and processed entirely in your browser using JavaScript. It never leaves your device — making this one of the most private PDF editors available online.' },
    { question: 'Can I add text to a PDF?', answer: 'Yes! Click the Text tool (T), then click anywhere on the PDF page to place a text box. Type your text, choose font, size, color, bold/italic, and alignment. Double-click any text annotation to edit it.' },
    { question: 'How do I sign a PDF?', answer: 'Click the Signature tool to open the signature pad. Draw your signature with your mouse or finger (on touch devices), then click "Add Signature" to place it on the PDF. Move and resize it to the perfect position.' },
    { question: 'Can I highlight or whiteout text?', answer: 'Yes. Use the Highlight tool (H) to draw a semi-transparent yellow highlight over text. Use the Whiteout tool to cover sensitive content with a white rectangle — perfect for redacting information before sharing.' },
    { question: 'What annotations can I add?', answer: 'Text, freehand drawing, rectangles, circles, lines, arrows, highlights, whiteouts, images, signatures, and stamps (APPROVED, DRAFT, CONFIDENTIAL, etc.). All support custom color, opacity, and positioning.' },
    { question: 'Are there file size limits?', answer: 'No artificial limits. The only limitation is your browser memory. PDFs up to 50-100MB typically work well on modern devices. Very large PDFs with many high-resolution images may be slower to load.' },
    { question: 'Does the editor add watermarks?', answer: 'No. The downloaded PDF is clean with no watermarks, no branding, no "Created with..." stamps. The output is exactly your PDF with your annotations.' },
    { question: 'What keyboard shortcuts are available?', answer: 'V: Select, T: Text, P: Pen, R: Rectangle, H: Highlight. Ctrl+Z: Undo, Ctrl+Y: Redo, Ctrl+D: Duplicate, Ctrl+S: Save, Delete: Remove selected, Escape: Deselect.' },
  ],
  howToSteps: [
    'Upload your PDF by dragging and dropping or clicking the upload area.',
    'Choose a tool from the toolbar — Text, Draw, Shapes, Highlight, Whiteout, Image, Signature, or Stamp.',
    'Click or drag on the PDF page to add your annotation.',
    'Use the properties bar to adjust color, font size, line width, opacity, and other options.',
    'Navigate pages using the arrows or click page thumbnails at the bottom.',
    'Click "Download PDF" to save the edited file with all annotations baked in.',
  ],
  relatedToolSlugs: ['pdf-merge', 'pdf-compress', 'pdf-split', 'pdf-to-image', 'image-to-pdf'],
  icon: 'FileEdit',
  isPopular: true,
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── NEPAL INCOME TAX CALCULATOR ─────────────────────────────────────────
tools.push({
  slug: 'nepal-income-tax-calculator',
  name: 'Nepal Income Tax Calculator',
  shortDescription: 'Calculate Nepal income tax for FY 2081/82 with full slab breakdown — for individuals, couples, and businesses.',
  longDescription: `<p>Nepal's income tax system uses progressive slabs that differ for single and married taxpayers. This calculator applies the official FY 2081/82 (2024/25) slabs and shows exactly how much tax falls in each bracket, your effective tax rate, and total tax liability.</p>
<h2>FY 2081/82 Tax Slabs</h2>
<p>For single individuals: 1% up to Rs 5,00,000; 10% on Rs 5,00,001–7,00,000; 20% on Rs 7,00,001–20,00,000; 30% on Rs 20,00,001–40,00,000; 36% above Rs 40,00,000. Married individuals get Rs 1,00,000 additional exemption. A 1% social security surtax applies on income above Rs 20,00,000.</p>
<h2>Deductions Available</h2>
<p>Employee PF/CIT/SSF contributions, approved life insurance premiums (up to Rs 40,000), and other approved expenses reduce your taxable income before tax is calculated.</p>`,
  category: 'calculators',
  targetKeyword: 'nepal income tax calculator',
  secondaryKeywords: ['nepal income tax 2081 82', 'nepal tax calculator 2024 25', 'nepal tax slab calculator', 'nepal individual income tax', 'nepal tds calculator', 'nepali income tax', 'nepal tax slab 2081 82 calculator'],
  metaTitle: 'Nepal Income Tax Calculator 2081/82 — Free Tax Slab Tool',
  metaDescription: 'Calculate Nepal income tax for FY 2081/82 with slab-by-slab breakdown. Updated rates for single & married taxpayers. Free online Nepal tax calculator.',
  faqs: [
    { question: 'What are Nepal\'s income tax slabs for FY 2081/82?', answer: 'Single: 1% up to Rs 5L, 10% on 5-7L, 20% on 7-20L, 30% on 20-40L, 36% above 40L. Married: 1% up to Rs 6L, 10% on 6-8L, 20% on 8-20L, 30% on 20-40L, 36% above 40L.' },
    { question: 'What is the social security surtax in Nepal?', answer: 'An additional 1% social security surtax is levied on the portion of taxable income that exceeds Rs 20,00,000 (Rs 20 lakh). This is on top of the regular income tax.' },
    { question: 'How do I reduce my taxable income in Nepal?', answer: 'Approved deductions include: PF/CIT/SSF contributions, life insurance premiums (up to Rs 40,000), medical insurance premiums, and contributions to approved organisations. These reduce your taxable income before the slabs are applied.' },
    { question: 'Does Nepal have advance tax (TDS)?', answer: 'Yes. Employers deduct TDS (Tax Deducted at Source) from salaries each month based on estimated annual tax. Individuals earning from other sources may need to pay advance tax quarterly.' },
    { question: 'Is the tax year the same as the calendar year in Nepal?', answer: 'No. Nepal\'s fiscal year runs from Shrawan 1 to Ashad End (approximately mid-July to mid-July). FY 2081/82 = approximately July 2024 – July 2025.' },
  ],
  howToSteps: [
    'Enter your annual taxable income (or monthly salary × 12 if salaried).',
    'Select marital status to apply the correct tax-free threshold.',
    'The calculator shows tax for each slab, total annual tax, and effective tax rate.',
    'Use the deductions section to subtract PF/CIT/SSF and insurance premiums.',
    'View monthly TDS amount (annual tax ÷ 12) at the bottom.',
  ],
  relatedToolSlugs: ['nepal-salary-calculator', 'nepal-salary-tax-calculator', 'nepal-land-converter', 'nepse-calculator', 'emi-calculator'],
  icon: 'Receipt',
  isNew: true,
  isPopular: true,
  estimatedTime: 'Instant',
});

// ─── NEPAL SALARY CALCULATOR (detailed version) ───────────────────────────
tools.push({
  slug: 'nepal-salary-calculator',
  name: 'Nepal Salary Calculator',
  shortDescription: 'Calculate Nepal net salary with PF, CIT, SSF deductions and FY 2081/82 tax slabs including grade & dearness allowance.',
  longDescription: `<p>Calculate your exact take-home salary in Nepal for FY 2081/82 (2024/25). Enter your basic salary, grade allowance, dearness allowance, and other allowances, then choose your deduction scheme — PF, CIT, or SSF — and instantly see your net pay and full tax slab breakdown.</p>
<h2>Nepal Tax Slabs FY 2081/82</h2>
<p>Single: 1% up to Rs 5L, 10% on 5-7L, 20% on 7-20L, 30% on 20-40L, 36% above 40L. Married: 1% up to Rs 6L, 10% on 6-8L, 20% on 8-20L, 30% on 20-40L, 36% above 40L. Additional 1% social security surtax applies above Rs 20L.</p>
<h2>Deduction Options</h2>
<p>PF: Employee contributes 10% of basic; CIT: Employee contributes 10% of basic (optional but common); SSF: Employee contributes 11% of gross (alternative to PF+CIT). All employee contributions are deductible from taxable income.</p>`,
  category: 'calculators',
  targetKeyword: 'nepal salary calculator',
  secondaryKeywords: ['nepal salary calculator 2081 82', 'nepal take home salary calculator', 'nepal PF CIT calculator', 'nepal SSF salary calculator', 'nepali salary tax calculator', 'nepal gross to net salary', 'salary calculator nepal 2024'],
  metaTitle: 'Nepal Salary Calculator 2081/82 — Net Pay & Tax Breakdown',
  metaDescription: 'Calculate Nepal net salary with PF, CIT, SSF and income tax for FY 2081/82. Enter basic + allowances for full monthly/annual breakdown. Free Nepal payroll tool.',
  faqs: [
    { question: 'What is the Nepal income tax rate for 2081/82?', answer: 'For single individuals: 1% up to Rs 5L, 10% on 5-7L, 20% on 7-20L, 30% on 20-40L, 36% above 40L. Married taxpayers get Rs 1L extra exemption. Additional 1% surtax on income above Rs 20L.' },
    { question: 'What are grade allowance and dearness allowance?', answer: 'Grade Allowance (श्रेणी भत्ता) is an increment added to basic salary based on position/grade. Dearness Allowance (महँगी भत्ता) is a cost-of-living adjustment. Both are part of gross salary.' },
    { question: 'What is the difference between PF and CIT?', answer: 'PF (Provident Fund) and CIT (Citizens Investment Trust) are both retirement savings schemes. Both require 10% employee contribution + 10% employer contribution of basic salary. PF is managed by government; CIT is a separate fund.' },
    { question: 'Can I choose between PF and CIT?', answer: 'Most government employees are under PF. Private sector employees may be in PF or CIT. SSF (Social Security Fund) is a newer scheme for private sector. You can only be in one scheme at a time.' },
    { question: 'Is SSF better than PF+CIT?', answer: 'SSF provides more comprehensive benefits including health insurance and accident coverage. Employees contribute 11% of gross (vs 10% of basic for PF/CIT), but the employer contributes 20% of gross under SSF.' },
  ],
  howToSteps: [
    'Enter your basic salary, grade allowance, dearness allowance, and other allowances.',
    'Select deduction type: PF, CIT, or SSF.',
    'Choose marital status for the correct tax-free threshold.',
    'View monthly and annual net salary with full breakdown.',
    'See the tax slab table showing how much tax falls in each bracket.',
  ],
  relatedToolSlugs: ['nepal-salary-tax-calculator', 'nepal-income-tax-calculator', 'nepse-calculator', 'emi-calculator', 'nepal-land-converter'],
  icon: 'Wallet',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── NEPAL LAND CONVERTER ─────────────────────────────────────────────────
tools.push({
  slug: 'nepal-land-converter',
  name: 'Nepal Land Measurement Converter',
  shortDescription: 'Convert between Nepal land units — Ropani, Aana, Paisa, Dam, Bigha, Kattha, Dhur and square feet/meters.',
  longDescription: `<p>Nepal uses two completely unique land measurement systems that no global converter supports. This tool is built specifically for Nepali land units — whether you're buying property in Kathmandu, registering land in the Terai, or checking land area for legal documents.</p>
<h2>Hilly Region (Pahad) Units</h2>
<p>The Ropani system is used in hilly districts including Kathmandu Valley, Pokhara, and hill districts. 1 Ropani = 16 Aana = 64 Paisa = 256 Dam = 5,476 sq ft = 508.72 sq meters.</p>
<h2>Terai Region Units</h2>
<p>The Bigha system is used in the Terai (plains) districts. 1 Bigha = 20 Kattha = 400 Dhur = 72,900 sq ft = 6,772.63 sq meters.</p>
<h2>How to Use</h2>
<p>Simply type a value in any field — Ropani, Aana, Paisa, Dam, Bigha, Kattha, Dhur, Square Feet, Square Meters, Acres, or Hectares — and all other fields update instantly. The tool also includes a quick reference table for common conversions.</p>
<h2>Why This Tool?</h2>
<p>When registering land in Nepal, government documents use these local units. Property listings use mixed units. This tool lets you instantly cross-check any quoted area in any unit, saving time and avoiding costly mistakes.</p>`,
  category: 'converters',
  targetKeyword: 'nepal land measurement converter',
  secondaryKeywords: ['ropani to sqft', 'aana to sqft nepal', 'bigha to sqft nepal', 'ropani aana paisa dam calculator', 'kattha to sqft', 'dhur to sqft', 'nepal land unit converter', 'ropani in square feet', 'bigha in square feet nepal', 'nepal land area calculator'],
  metaTitle: 'Nepal Land Converter - Ropani Aana Bigha to Sq Ft/Meter',
  metaDescription: 'Convert Nepal land units instantly: Ropani, Aana, Paisa, Dam (Pahad) ↔ Bigha, Kattha, Dhur (Terai) ↔ Sq Ft, Sq Meter, Acres. Free Nepal land calculator.',
  faqs: [
    { question: 'How many square feet in 1 Ropani?', answer: '1 Ropani = 5,476 square feet = 508.72 square meters. It is further divided into 16 Aana.' },
    { question: 'How many square feet in 1 Aana?', answer: '1 Aana = 342.25 square feet = 31.80 square meters. There are 4 Paisa in 1 Aana.' },
    { question: 'What is the difference between Ropani and Bigha?', answer: 'Ropani (and Aana/Paisa/Dam) is used in hilly/mountain districts of Nepal (Kathmandu, Pokhara). Bigha (and Kattha/Dhur) is used in Terai (plains) districts. 1 Bigha = 13.31 Ropani approximately.' },
    { question: 'How many Kattha in 1 Bigha?', answer: '1 Bigha = 20 Kattha = 400 Dhur = 72,900 sq ft = 6,772.63 sq meters.' },
    { question: 'How many square meters in 1 Ropani?', answer: '1 Ropani = 508.72 square meters = 0.05087 hectares.' },
    { question: 'How many Dhur in 1 Kattha?', answer: '1 Kattha = 20 Dhur = 3,645 sq ft = 338.63 sq meters.' },
  ],
  howToSteps: [
    'Type a value in any field — Ropani, Aana, Paisa, Dam, Bigha, Kattha, Dhur, Sq Ft, Sq Meter, Acre, or Hectare.',
    'All other fields update instantly with the converted values.',
    'Use the copy button next to any result to copy it.',
    'Refer to the quick reference tables at the bottom for standard conversions.',
    'Click "Clear all" to reset and start a new conversion.',
  ],
  relatedToolSlugs: ['unit-converter', 'nepali-date-converter', 'nepal-salary-tax-calculator', 'percentage-calculator'],
  icon: 'Map',
  isNew: true,
  isPopular: true,
  estimatedTime: 'Instant',
});

// ─── NEPAL SALARY & TAX CALCULATOR ───────────────────────────────────────────
tools.push({
  slug: 'nepal-salary-tax-calculator',
  name: 'Nepal Salary & Tax Calculator',
  shortDescription: 'Calculate net take-home salary in Nepal with PF, CIT, SSF deductions and income tax slabs for FY 2081/82.',
  longDescription: `<p>Nepal's payroll system is unique — employees have mandatory deductions for Provident Fund (PF), Citizens Investment Trust (CIT), or Social Security Fund (SSF), plus income tax based on Nepal's own tax slabs. This calculator handles all of it accurately for FY 2081/82 (2024/25).</p>
<h2>Nepal Tax Slabs FY 2081/82</h2>
<p>For unmarried individuals: 1% up to Rs. 5,00,000; 10% on next Rs. 2,00,000 (up to Rs. 7L); 20% on next Rs. 13,00,000 (up to Rs. 20L); 30% on next Rs. 20,00,000 (up to Rs. 40L); 36% above Rs. 40,00,000. Married couples get an extra Rs. 1,00,000 tax-free threshold (exempt up to Rs. 6L).</p>
<h2>PF + CIT vs SSF</h2>
<p>Most government and large company employees contribute to PF (10% of basic) + CIT (10% of basic). Newer employees may be under SSF (11% of gross), with employers contributing 20% under SSF. Both employee contributions are tax-deductible.</p>
<h2>Employer Contributions</h2>
<p>Under PF+CIT: employer also contributes 10%+10% of basic (not deducted from your salary — extra cost to employer). Under SSF: employer contributes 20% of gross salary.</p>`,
  category: 'calculators',
  targetKeyword: 'nepal salary tax calculator',
  secondaryKeywords: ['nepal income tax calculator 2081 82', 'PF CIT calculator nepal', 'SSF calculator nepal', 'net salary calculator nepal', 'take home salary nepal', 'nepal payroll calculator', 'nepal tax slab 2081', 'nepali salary calculator', 'nepal income tax 2024 25'],
  metaTitle: 'Nepal Salary & Tax Calculator 2081/82 — PF, CIT, SSF',
  metaDescription: 'Calculate Nepal net salary with PF, CIT & SSF deductions + income tax slabs FY 2081/82. Monthly/annual breakdown. Free Nepal payroll calculator.',
  faqs: [
    { question: 'What is PF in Nepal salary?', answer: 'Provident Fund (PF) requires employees to contribute 10% of their basic salary each month. The employer also contributes 10% of basic. Employee PF is deductible for income tax purposes.' },
    { question: 'What is CIT in Nepal?', answer: 'Citizens Investment Trust (CIT) is a government fund where employees contribute 10% of basic salary (employer matches 10%). Similar to PF, the employee\'s contribution is tax-deductible.' },
    { question: 'What is SSF in Nepal?', answer: 'Social Security Fund (SSF) is an alternative to PF+CIT. Employee contributes 11% of gross salary; employer contributes 20%. SSF provides more social security benefits.' },
    { question: 'What is the income tax rate in Nepal for 2081/82?', answer: 'For unmarried individuals: 1% up to Rs 5L, 10% on Rs 5–7L, 20% on Rs 7–20L, 30% on Rs 20–40L, 36% above Rs 40L. Married individuals get Rs 6L tax-free threshold (1% up to Rs 6L).' },
    { question: 'How is basic salary determined in Nepal?', answer: 'Basic salary is typically 50-60% of gross salary. The percentage is set by the employer. PF, CIT, and other deductions are calculated as a % of basic.' },
  ],
  howToSteps: [
    'Enter your gross monthly salary in Rupees.',
    'Set the basic salary percentage (typically 60%).',
    'Select marital status — married individuals get a higher tax-free threshold.',
    'Choose your deduction scheme: PF+CIT (most common) or SSF.',
    'View the full monthly and annual salary breakdown with each deduction and tax slab.',
  ],
  relatedToolSlugs: ['nepal-salary-calculator', 'nepal-income-tax-calculator', 'emi-calculator', 'nepse-calculator', 'nepal-land-converter'],
  icon: 'Calculator',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── NEPSE BONUS & RIGHTS CALCULATOR ─────────────────────────────────────────
tools.push({
  slug: 'nepse-bonus-calculator',
  name: 'NEPSE Bonus & Rights Share Calculator',
  shortDescription: 'Calculate adjusted price after NEPSE bonus share, TERP for rights issue, and dividend yield with tax.',
  longDescription: `<p>Nepal's stock market (NEPSE) has over 5 million registered investors who need accurate calculations when companies announce bonus shares, rights issues, or cash dividends. This tool provides three calculators in one.</p>
<h2>Bonus Share Calculator</h2>
<p>When a company announces bonus shares (e.g., 20%), the market price adjusts downward. Enter your current price, shares held, and bonus %, and the tool calculates the exact adjusted (ex-bonus) price and your new total shares. It also shows the 5% tax on bonus shares (at face value Rs. 100).</p>
<h2>Rights Share Calculator</h2>
<p>Rights issues let existing shareholders buy additional shares at a set price. The Theoretical Ex-Rights Price (TERP) shows the expected market price after the rights issue. Enter current price, shares held, rights %, and issue price to get TERP and the cost to subscribe.</p>
<h2>Cash Dividend Calculator</h2>
<p>Calculate dividend per share and dividend yield based on the announced dividend % and current market price. Shows 5% TDS deducted at source and net dividend per share.</p>`,
  category: 'calculators',
  targetKeyword: 'NEPSE bonus share calculator',
  secondaryKeywords: ['nepse bonus share adjusted price', 'nepse rights share calculator', 'TERP calculator nepal', 'bonus share adjusted price calculator nepal', 'nepse dividend yield calculator', 'nepse bonus rights calculator', 'share adjusted price nepal', 'bonus share tax nepal', 'rights share nepal calculator'],
  metaTitle: 'NEPSE Bonus & Rights Share Calculator — Adjusted Price',
  metaDescription: 'Calculate NEPSE bonus share adjusted price, rights share TERP & cost, and dividend yield with 5% tax. Free Nepal stock calculator for investors.',
  faqs: [
    { question: 'What is a bonus share in Nepal?', answer: 'Bonus shares are additional free shares given to existing shareholders from the company\'s retained earnings or share premium. They don\'t cost money but the market price adjusts proportionally downward.' },
    { question: 'How is adjusted price calculated after bonus?', answer: 'Adjusted Price = (Market Price × Old Shares) ÷ (Old Shares + Bonus Shares). For example, if price is Rs 500 and 20% bonus is announced: Rs 500 ÷ 1.20 = Rs 416.67.' },
    { question: 'What is TERP for rights share?', answer: 'TERP (Theoretical Ex-Rights Price) is the expected share price after a rights issue. Formula: (Market Price × Old Shares + Issue Price × Rights Shares) ÷ Total Shares.' },
    { question: 'Is there tax on bonus shares in Nepal?', answer: 'Yes. A 5% capital gains tax is levied on the face value (Rs. 100) of each bonus share received. So for 10 bonus shares, you pay 5% × Rs. 100 × 10 = Rs. 50 tax.' },
    { question: 'What is dividend yield?', answer: 'Dividend yield = (Dividend per Share ÷ Market Price) × 100. In Nepal, cash dividend is declared as % of face value (Rs. 100). A 5% TDS is withheld from cash dividends.' },
  ],
  howToSteps: [
    'Select a tab: Bonus Share, Rights Share, or Cash Dividend.',
    'For Bonus Share: enter current market price, shares held, and bonus % announced.',
    'View the adjusted price, new bonus shares, total shares after, and tax on bonus.',
    'For Rights Share: enter price, shares, rights %, and issue price to get TERP.',
    'For Dividend: enter dividend % and market price to get yield and net dividend after TDS.',
  ],
  relatedToolSlugs: ['nepse-calculator', 'sip-calculator', 'compound-interest-calculator', 'percentage-calculator', 'nepal-salary-tax-calculator'],
  icon: 'TrendingUp',
  isNew: true,
  isPopular: true,
  estimatedTime: 'Instant',
});

// ─── SHREE LIPI TO UNICODE CONVERTER ──────────────────────────────────────────
tools.push({
  slug: 'shree-lipi-to-unicode',
  name: 'Shree Lipi to Unicode Converter',
  shortDescription: 'Convert Shree Lipi encoded Nepali text to Unicode Devanagari, and vice versa. Supports Shree Lipi 7.',
  longDescription: `<p>Shree Lipi is one of the most widely used legacy Nepali fonts, alongside Preeti. Government offices, newspapers, and businesses across Nepal have years of documents typed in Shree Lipi encoding. This tool converts Shree Lipi text to proper Unicode Devanagari, making old documents searchable, copyable, and web-compatible.</p>
<h2>Why Convert from Shree Lipi to Unicode?</h2>
<p>Shree Lipi is a font-based encoding — the text appears Nepali on screen but is stored as random ASCII characters. When you copy-paste Shree Lipi text into email, web pages, or databases, it appears as gibberish. Unicode Devanagari is the international standard and works everywhere.</p>
<h2>Bidirectional Conversion</h2>
<p>This tool supports both directions — Shree Lipi to Unicode AND Unicode to Shree Lipi. This is useful when you need to create content for legacy systems that still use Shree Lipi fonts.</p>
<h2>What's Supported</h2>
<p>All standalone vowels (अ आ इ ई उ ऊ ए ऐ ओ औ), consonants (क to ह), matras (vowel signs like ा ि ी ु ू), anusvara (ं), visarga (ः), chandrabindu (ँ), halant (्), and Nepali numerals (०–९) are fully converted. Complex conjunct consonants may need manual review.</p>`,
  category: 'text-tools',
  targetKeyword: 'shree lipi to unicode converter',
  secondaryKeywords: ['shree lipi unicode converter online', 'convert shree lipi to unicode', 'shreelipito unicode', 'unicode to shree lipi', 'nepali font converter shree lipi', 'shree lipi 7 converter', 'legacy nepali font converter', 'shree lipi devanagari converter'],
  metaTitle: 'Shree Lipi to Unicode Converter — Free Nepali Font Tool',
  metaDescription: 'Convert Shree Lipi legacy Nepali font to Unicode Devanagari instantly. Supports Shree Lipi 7, bidirectional conversion. Free online tool — no install needed.',
  faqs: [
    { question: 'What is Shree Lipi?', answer: 'Shree Lipi is a legacy Nepali font encoding system widely used in Nepal before Unicode. It maps ASCII keyboard characters to Devanagari glyphs, so the text is stored as ASCII but displayed as Nepali when the Shree Lipi font is installed.' },
    { question: 'Why do I need to convert Shree Lipi to Unicode?', answer: 'Shree Lipi text doesn\'t work on websites, email, or modern apps without the specific font. Unicode Devanagari works everywhere — search engines can index it, screen readers can read it, and it displays correctly on all devices.' },
    { question: 'What version of Shree Lipi is supported?', answer: 'This tool supports Shree Lipi 7, which is the most common version. Core characters including all vowels, consonants, matras, and Nepali numerals are fully supported.' },
    { question: 'Are complex conjunct consonants supported?', answer: 'Basic conjuncts formed with halant (्) are supported. Very complex multi-consonant conjuncts may need manual correction, as the encoding varies across different Shree Lipi versions.' },
    { question: 'Can I convert Unicode back to Shree Lipi?', answer: 'Yes! Click the "Unicode → Shree Lipi" tab to reverse-convert. This is useful when you need to generate content for legacy systems that still use Shree Lipi fonts.' },
  ],
  howToSteps: [
    'Select the conversion direction: "Shree Lipi → Unicode" or "Unicode → Shree Lipi".',
    'Paste your text in the left panel, or click "Paste from Clipboard".',
    'The converted text appears instantly in the right panel.',
    'Click "Copy All" to copy the output, or "Download .txt" to save it.',
    'Use "Swap & Reverse" to flip the direction and re-convert the output.',
  ],
  relatedToolSlugs: ['preeti-to-unicode', 'nepali-typing', 'nepali-date-converter', 'case-converter'],
  icon: 'Type',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'neb-see-grade-calculator',
  name: 'NEB/SEE Grade Calculator',
  shortDescription: 'Convert marks to NEB/SEE grades and GPA. Calculate overall GPA for Grade 10 SEE and Grade 11/12 NEB exams.',
  longDescription: `<p>The <strong>NEB/SEE Grade Calculator</strong> instantly converts your raw marks (0–100) into the official NEB grade letter and GPA for Nepal's national examinations. Whether you're a SEE (Grade 10) student or appearing in NEB (Grade 11/12), this tool gives you accurate results without any guesswork.</p>
<h2>How the NEB Grading System Works</h2>
<p>Nepal's National Examinations Board (NEB) uses a GPA-based grading system. Marks are converted to grades as follows: 90–100 = A+ (4.0 GPA), 80–89 = A (3.6), 70–79 = B+ (3.2), 60–69 = B (2.8), 50–59 = C+ (2.4), 40–49 = C (2.0), 30–39 = D (1.6), and below 30 = NG (Not Graded).</p>
<h2>Features</h2>
<p>Enter marks for up to 8 subjects. The calculator instantly shows the grade and GPA for each subject, computes your overall GPA as the average across all subjects, and tells you whether you are Promoted, Pass with Supplement, or Not Promoted. A full grade reference table is included below the calculator.</p>
<h2>SEE vs NEB</h2>
<p>The Secondary Education Examination (SEE) is taken at Grade 10, while NEB examinations cover Grades 11 and 12. Both use the same A+ to NG grading scale, making this calculator useful for all levels.</p>`,
  category: 'calculators',
  targetKeyword: 'NEB SEE grade calculator Nepal',
  secondaryKeywords: ['SEE result grade calculator', 'NEB GPA calculator', 'SEE GPA calculator nepal', 'convert marks to grade nepal', 'NEB grading system'],
  metaTitle: 'NEB/SEE Grade Calculator — Convert Marks to Grade & GPA',
  metaDescription: 'Free NEB/SEE Grade Calculator for Nepal. Convert marks to A+/A/B+/B/C+/C/D/NG grades and GPA. Calculate overall GPA for up to 8 subjects instantly.',
  faqs: [
    { question: 'What marks are needed to get A+ in NEB?', answer: 'You need 90 or above (out of 100) to achieve an A+ grade with a 4.0 GPA in the NEB grading system.' },
    { question: 'What is the minimum passing marks in SEE?', answer: 'You need at least 35 marks (Grade D, 1.6 GPA) to pass a subject. Getting NG (below 30) in any subject means you are Not Promoted.' },
    { question: 'How is overall GPA calculated in NEB?', answer: 'Overall GPA is the average of GPA points across all subjects. For example, if you have 4.0, 3.6, and 3.2 in three subjects, your overall GPA is (4.0+3.6+3.2)/3 = 3.6.' },
    { question: 'What does NG mean in NEB result?', answer: 'NG stands for Not Graded. It is assigned when a student scores below 30 marks. Getting NG in any subject means the student is Not Promoted.' },
    { question: 'Can I use this for Grade 11 and 12 NEB results?', answer: 'Yes, NEB uses the same grading scale for both SEE (Grade 10) and Grade 11/12 examinations.' },
  ],
  howToSteps: [
    'Enter your subject names and marks (0–100) for each subject.',
    'Grades and GPA are calculated instantly as you type.',
    'Add up to 8 subjects using the "Add Subject" button.',
    'View your overall GPA and promotion status at the top.',
    'Check the grade reference table for the complete NEB grading scale.',
  ],
  relatedToolSlugs: ['gpa-calculator', 'cgpa-to-percentage', 'percentage-calculator', 'nepal-loksewa-age-calculator'],
  icon: 'GraduationCap',
  isNew: true,
  isPopular: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'nepal-vehicle-tax-calculator',
  name: 'Nepal Vehicle Tax Calculator',
  shortDescription: 'Calculate annual vehicle tax renewal amount for motorcycles and cars in Nepal by engine CC and province.',
  longDescription: `<p>The <strong>Nepal Vehicle Tax Calculator</strong> helps vehicle owners quickly find out how much annual tax they need to pay for vehicle renewal. Whether you own a motorcycle, car, jeep, or van, this tool calculates your tax based on engine CC and province.</p>
<h2>How Vehicle Tax Works in Nepal</h2>
<p>In Nepal, vehicle owners must pay annual tax (नवीकरण कर) to renew their vehicle registration. The tax amount depends on the vehicle type, engine capacity (CC), and the province where the vehicle is registered. Bagmati Province (Kathmandu Valley) has the highest rates due to higher traffic volume and urban infrastructure costs.</p>
<h2>Motorcycle Tax Rates (Bagmati Province)</h2>
<p>Motorcycles up to 125cc pay Rs 2,500 per year. Bikes from 126–250cc pay Rs 4,500/year, and bikes above 250cc pay Rs 7,500/year. Electric motorcycles enjoy a discounted rate of approximately Rs 2,000/year.</p>
<h2>Car Tax Rates (Bagmati Province)</h2>
<p>Cars up to 1000cc pay Rs 5,000/year. The rate increases with engine size: 1001–1500cc (Rs 7,500), 1501–2000cc (Rs 10,000), 2001–2500cc (Rs 15,000), and above 2500cc (Rs 25,000). Electric cars are charged approximately Rs 4,000/year.</p>
<h2>Renewal Deadline</h2>
<p>Vehicle tax in Nepal must be renewed by the end of Ashad (mid-July) each year. Late renewal attracts additional fines.</p>`,
  category: 'calculators',
  targetKeyword: 'nepal vehicle tax calculator',
  secondaryKeywords: ['bike tax calculator nepal', 'vehicle renewal tax nepal', 'motorcycle tax nepal', 'car tax calculator nepal', 'नेपाल सवारी कर'],
  metaTitle: 'Nepal Vehicle Tax Calculator — Bike & Car Annual Tax 2081/82',
  metaDescription: 'Calculate your annual vehicle renewal tax in Nepal. Motorcycle, car, jeep, van — enter engine CC to get exact tax amount for Bagmati and other provinces.',
  faqs: [
    { question: 'How much is the annual tax for a 150cc motorcycle in Nepal?', answer: 'A 150cc motorcycle falls in the 126–250cc bracket and pays Rs 4,500 per year in Bagmati Province.' },
    { question: 'When is the vehicle tax renewal deadline in Nepal?', answer: 'Vehicle tax must be renewed by the end of Ashad (approximately mid-July) each year. After this date, late fees apply.' },
    { question: 'How much tax does a 1600cc car pay in Nepal?', answer: 'A 1600cc car falls in the 1501–2000cc bracket and pays Rs 10,000 per year in Bagmati Province.' },
    { question: 'Do electric vehicles pay lower tax in Nepal?', answer: 'Yes, the government provides a discount for electric vehicles to promote green transport. Electric motorcycles pay approximately Rs 2,000/year and electric cars pay approximately Rs 4,000/year.' },
    { question: 'Are vehicle tax rates the same across all provinces?', answer: 'No, rates vary slightly by province. Bagmati Province (Kathmandu) has the highest rates. This calculator shows Bagmati Province rates as they apply to the largest number of vehicles.' },
  ],
  howToSteps: [
    'Select your vehicle type: Motorcycle, Car/Jeep/Van, Electric Motorcycle, or Electric Car.',
    'Enter your vehicle\'s engine capacity in CC (e.g., 150, 1600).',
    'Select your province (Bagmati Province is the default).',
    'Click "Calculate Tax" to see your annual vehicle tax amount.',
    'Check the rate table to understand which CC bracket your vehicle falls in.',
  ],
  relatedToolSlugs: ['nepal-income-tax-calculator', 'nepal-salary-tax-calculator', 'nepal-fiscal-year-converter', 'gst-calculator'],
  icon: 'Car',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'nrb-forex-converter',
  name: 'NRB Forex Rate Converter',
  shortDescription: 'Convert NPR to USD, EUR, INR, AED, SAR and 20+ currencies using Nepal Rastra Bank reference rates.',
  longDescription: `<p>The <strong>NRB Forex Rate Converter</strong> lets you convert between Nepalese Rupees (NPR) and 21 major foreign currencies using reference rates based on Nepal Rastra Bank (NRB) published rates. Whether you're a migrant worker calculating remittances, a business tracking forex, or a traveller planning abroad, this tool gives you quick NPR conversions.</p>
<h2>Currencies Supported</h2>
<p>Convert NPR to and from USD, EUR, GBP, INR, AUD, CAD, CHF, JPY, CNY, SGD, AED, SAR, QAR, MYR, KRW, HKD, THB, SEK, DKK, KWD, and BHD. All major remittance corridors for Nepali workers are covered — including UAE (AED), Saudi Arabia (SAR), Qatar (QAR), and Malaysia (MYR).</p>
<h2>INR/NPR Pegged Rate</h2>
<p>The Indian Rupee (INR) and Nepalese Rupee (NPR) maintain a fixed exchange rate of 100 INR = 160 NPR, established under a bilateral agreement between Nepal and India. This rate is managed by NRB and does not fluctuate freely.</p>
<h2>Remittance Calculator</h2>
<p>Nepal receives over $9 billion in annual remittances — one of the highest per-capita globally. The remittance calculator tab shows how much NPR you will receive after accounting for typical bank/transfer service fees (0–5%), helping you compare options before sending money home.</p>
<h2>Important Note</h2>
<p>Rates in this tool are reference rates and may differ from live NRB daily rates. For official daily rates, visit Nepal Rastra Bank (nrb.org.np). Actual exchange rates at banks and remittance companies may include a spread.</p>`,
  category: 'converters',
  targetKeyword: 'NRB forex rate converter Nepal',
  secondaryKeywords: ['nepal currency converter', 'NPR to USD converter', 'NRB exchange rate', 'nepal rupee converter', 'remittance calculator nepal'],
  metaTitle: 'NRB Forex Converter — Nepal Rupee (NPR) Exchange Rate Calculator',
  metaDescription: 'Convert NPR to USD, EUR, INR, AED, SAR and 20+ currencies. NRB reference rates, remittance calculator, full rate table. Free Nepal currency converter.',
  faqs: [
    { question: 'What is the INR to NPR exchange rate?', answer: 'The Indian Rupee to Nepali Rupee rate is fixed at 100 INR = 160 NPR (1 INR = 1.60 NPR). This is a pegged rate maintained by Nepal Rastra Bank and does not change freely with the market.' },
    { question: 'Where does NRB publish official forex rates?', answer: 'Nepal Rastra Bank publishes official daily exchange rates on their website at nrb.org.np. Rates are updated on business days.' },
    { question: 'How much NPR will I receive if I send money from UAE?', answer: 'Use the Remittance tab to calculate. Enter your AED amount and the fee percentage charged by your remittance service. Typical bank fees range from 1.5–3%. The calculator shows your NPR after deducting the fee.' },
    { question: 'Why are there buying and selling rates?', answer: 'Banks buy foreign currency from you at the buying rate (slightly lower) and sell currency to you at the selling rate (slightly higher). The difference is the bank\'s margin. NRB publishes both rates daily.' },
    { question: 'Can I use this for live/real-time rates?', answer: 'No, this tool uses reference rates based on approximate NRB rates. For live real-time rates, check nrb.org.np or your bank directly. Rates can change daily.' },
  ],
  howToSteps: [
    'Select the currency you want to convert FROM in the first dropdown.',
    'Select the currency you want to convert TO in the second dropdown.',
    'Enter the amount and see the converted value instantly.',
    'Use the Swap button to reverse the conversion direction.',
    'For remittance calculations, go to the Remittance tab and enter your transfer amount and fee percentage.',
  ],
  relatedToolSlugs: ['nepal-income-tax-calculator', 'nepal-salary-tax-calculator', 'unit-converter', 'nepali-date-converter'],
  icon: 'ArrowLeftRight',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'nepal-fiscal-year-converter',
  name: 'Nepal Fiscal Year Converter',
  shortDescription: 'Convert any AD date to Nepal fiscal year (FY) and BS quarter. Convert FY labels between BS and AD calendar years.',
  longDescription: `<p>The <strong>Nepal Fiscal Year Converter</strong> helps accountants, government employees, students, and business owners quickly find which Nepal fiscal year (आर्थिक वर्ष) any date falls in, and convert FY labels between Bikram Sambat (BS) and Gregorian (AD) calendar years.</p>
<h2>Nepal's Fiscal Year System</h2>
<p>Nepal follows a fiscal year that runs from Shrawan 1 to Ashad end (approximately mid-July to mid-July in the Gregorian calendar). This is unique compared to most countries and can cause confusion when working with international reports, audits, or remittances.</p>
<h2>FY Label Format</h2>
<p>Nepal fiscal years are named using both BS years they span. For example, FY 2081/82 starts in Shrawan 2081 BS and ends in Ashad 2082 BS (approximately July 2024 to July 2025 AD). This dual-year naming convention is used in all government documents, budget reports, and tax filings.</p>
<h2>Fiscal Year Quarters</h2>
<p>Each Nepal FY is divided into four quarters: Q1 (Shrawan–Ashwin), Q2 (Kartik–Poush), Q3 (Magh–Chaitra), Q4 (Baisakh–Ashad). Government departments and companies submit quarterly reports based on this structure.</p>
<h2>How to Use</h2>
<p>Use the AD Date tab to find the Nepal FY for any Gregorian date. Use the FY Converter tab to look up the AD equivalent of any BS fiscal year. The Reference Table shows a decade of FY mappings at a glance.</p>`,
  category: 'converters',
  targetKeyword: 'nepal fiscal year converter',
  secondaryKeywords: ['nepal FY calculator', 'BS AD fiscal year nepal', 'आर्थिक वर्ष converter', 'nepal fiscal year 2081/82', 'BS year to AD year nepal'],
  metaTitle: 'Nepal Fiscal Year Converter — BS/AD FY Calculator',
  metaDescription: 'Convert any date to Nepal fiscal year (FY). Find which BS fiscal quarter a date falls in. Convert FY 2081/82 labels to AD calendar years. Free online tool.',
  faqs: [
    { question: 'When does Nepal fiscal year start and end?', answer: 'Nepal fiscal year starts on Shrawan 1 (approximately July 16–17 in AD) and ends on Ashad end (approximately July 15–16 AD). So FY 2081/82 runs from mid-July 2024 to mid-July 2025.' },
    { question: 'What is FY 2081/82 in AD calendar?', answer: 'Nepal FY 2081/82 corresponds to approximately July 16, 2024 to July 15, 2025 in the Gregorian (AD) calendar.' },
    { question: 'Why does Nepal use BS years for fiscal year names?', answer: 'Nepal officially uses the Bikram Sambat (BS) calendar system for government and administrative purposes. The fiscal year is named after the two BS years it spans — e.g. FY 2081/82 starts in BS year 2081 and ends in BS year 2082.' },
    { question: 'What are Nepal fiscal year quarters?', answer: 'Q1: Shrawan–Ashwin (approx Aug–Oct), Q2: Kartik–Poush (approx Nov–Jan), Q3: Magh–Chaitra (approx Feb–Apr), Q4: Baisakh–Ashad (approx May–Jul).' },
    { question: 'How do I convert a Nepal FY to AD year?', answer: 'For any Nepal FY like 2081/82, the first AD year is BS year minus 57 (for the first half) or minus 56 (second half). FY 2081/82 = July 2024 – July 2025. Use the FY Converter tab above for instant results.' },
  ],
  howToSteps: [
    'To find the Nepal FY for any date: go to the "AD Date" tab and pick your date.',
    'To convert a FY label: go to the "FY Converter" tab and enter a BS year (e.g. 2081).',
    'To browse multiple fiscal years at once: check the "Reference Table" tab.',
    'The current active fiscal year is highlighted in the reference table.',
  ],
  relatedToolSlugs: ['nepali-date-converter', 'nepal-income-tax-calculator', 'nepal-vehicle-tax-calculator', 'timestamp-converter'],
  icon: 'Calendar',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'nepal-loksewa-age-calculator',
  name: 'Nepal Loksewa Age Calculator',
  shortDescription: 'Check your age eligibility for Nepal Loksewa (PSC) exams. Calculate age in BS and verify min/max age limits by post category.',
  longDescription: `<p>The <strong>Nepal Loksewa Age Calculator</strong> helps candidates check whether they meet the age eligibility criteria for Nepal's Public Service Commission (Lok Sewa Aayog) examinations. Enter your date of birth in BS (Bikram Sambat) and the application deadline to instantly see your age and eligibility status.</p>
<h2>Why Age Matters in Loksewa</h2>
<p>Every Loksewa vacancy notice specifies a minimum and maximum age limit based on the post category. Age is calculated as of the application deadline (dartaa miiti) in BS calendar. Even being one day over the maximum age disqualifies a candidate, making accurate calculation critical.</p>
<h2>Age Limits by Post Category</h2>
<p><strong>Non-Gazetted posts</strong> (Kharidar, etc.): Minimum 18, Maximum 35 years for general candidates. Women, disabled, and indigenous candidates get a 5-year relaxation (max 40). Government employees with 3+ years service can apply up to age 45.</p>
<p><strong>Gazetted Class III / Officer Level</strong>: Minimum 21, Maximum 35 (general), 40 (women/disabled/indigenous), 45 (government employees).</p>
<p><strong>Gazetted Class II</strong>: Minimum 21, Maximum 40 (general), 45 (women/disabled).</p>
<p><strong>Police / APF / Army</strong>: Minimum 18, Maximum 25 (no relaxation).</p>
<h2>BS Calendar Note</h2>
<p>This calculator uses BS dates for input, as Loksewa age is officially calculated in the Bikram Sambat calendar. The tool also shows an approximate AD (Gregorian) equivalent of your birthdate.</p>`,
  category: 'calculators',
  targetKeyword: 'nepal loksewa age calculator',
  secondaryKeywords: ['PSC age calculator nepal', 'lok sewa age eligibility', 'loksewa BS age calculator', 'civil service age nepal', 'loksewa aayog age limit'],
  metaTitle: 'Nepal Loksewa Age Calculator — PSC Age Eligibility Checker',
  metaDescription: 'Check age eligibility for Nepal Loksewa (PSC) exams. Calculate your age in BS from date of birth and verify min/max limits for all post categories. Free tool.',
  faqs: [
    { question: 'What is the maximum age for Loksewa in Nepal?', answer: 'It depends on the post: Non-Gazetted and Gazetted Class III posts have a maximum age of 35 (general), 40 (women/disabled/indigenous), or 45 (government employees). Gazetted Class II allows up to 40 (general). Police/APF/Army posts have a maximum of 25.' },
    { question: 'How is Loksewa age calculated?', answer: 'Age is calculated as of the application deadline (dartaa miiti) in BS (Bikram Sambat) calendar. You count full years from your BS date of birth to the deadline date.' },
    { question: 'Do women get age relaxation in Loksewa?', answer: 'Yes, women, persons with disabilities, and indigenous (Adivasi Janajati) candidates generally get a 5-year relaxation on the maximum age limit for most post categories.' },
    { question: 'What is the minimum age for Loksewa?', answer: 'For most posts, the minimum age is 18 years (Non-Gazetted) or 21 years (Gazetted posts). Police/APF/Army has a minimum age of 18.' },
    { question: 'Can government employees apply for higher Loksewa posts?', answer: 'Yes, existing government employees with 3 or more years of service get a maximum age relaxation of 10 years (up to 45) for Non-Gazetted and Gazetted Class III/Officer Level posts.' },
  ],
  howToSteps: [
    'Enter your date of birth in BS using the Year, Month, and Day dropdowns.',
    'Set the application deadline date (dartaa miiti) — defaults to today\'s approximate BS date.',
    'Select your target post category from the dropdown.',
    'Choose your applicant group (General / Women-Disabled-Indigenous / Government Employee).',
    'View your age in years, months, and days, plus your eligibility status with explanation.',
  ],
  relatedToolSlugs: ['nepali-date-converter', 'age-calculator', 'neb-see-grade-calculator', 'nepal-fiscal-year-converter'],
  icon: 'UserCheck',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'body-fat-calculator',
  name: 'Body Fat Percentage Calculator',
  shortDescription: 'Calculate your body fat percentage using the US Navy method and BMI-based estimate. View body fat category and gauge.',
  longDescription: `<p>The <strong>Body Fat Percentage Calculator</strong> estimates your body fat using the scientifically validated US Navy method and the BMI-based formula. Knowing your body fat percentage gives a more accurate picture of your fitness than weight alone — two people can weigh the same but have very different body compositions.</p>
<h2>US Navy Method</h2>
<p>The US Navy body fat formula uses circumference measurements (neck, waist, and hip for women) along with height to estimate body fat percentage. For men: 495 ÷ (1.0324 − 0.19077 × log(waist − neck) + 0.15456 × log(height)) − 450. This method is widely used by the military and fitness professionals.</p>
<h2>Body Fat Categories</h2>
<p>Essential fat (2–5% men, 10–13% women) is the minimum for basic body functions. Athletic (6–13% men, 14–20% women), Fitness (14–17% men, 21–24% women), Average (18–24% men, 25–31% women), and Obese (25%+ men, 32%+ women).</p>`,
  category: 'calculators',
  targetKeyword: 'body fat percentage calculator',
  secondaryKeywords: ['body fat calculator online free', 'US navy body fat calculator', 'body fat percentage formula', 'how to calculate body fat'],
  metaTitle: 'Body Fat Percentage Calculator — US Navy Method & BMI Formula',
  metaDescription: 'Calculate your body fat % using the US Navy method and BMI formula. View your body fat category (athletic, fitness, average, obese) with a visual gauge.',
  faqs: [
    { question: 'What is a healthy body fat percentage?', answer: 'For men, 6–17% is considered athletic to fitness level, and 18–24% is average. For women, 14–24% is athletic to fitness, and 25–31% is average. Below essential fat levels can be dangerous.' },
    { question: 'How accurate is the Navy body fat calculator?', answer: 'The US Navy method is generally accurate within 3–4% of DEXA scan results when measurements are taken correctly. It is commonly used in military fitness assessments.' },
    { question: 'What measurements do I need for this calculator?', answer: 'For men: height, neck circumference, and waist circumference (at navel). For women: height, neck, waist, and hip circumference (at widest point).' },
  ],
  howToSteps: [
    'Select your gender (Male or Female).',
    'Choose Metric (cm) or Imperial (inches) units.',
    'Enter your height, neck, waist, and (for women) hip measurements.',
    'Optionally enter your weight and age for the BMI-based estimate.',
    'View your body fat percentage, category, and visual gauge instantly.',
  ],
  relatedToolSlugs: ['bmi-calculator', 'ideal-weight-calculator', 'tdee-macro-calculator', 'water-intake-calculator'],
  icon: 'Activity',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'ideal-weight-calculator',
  name: 'Ideal Weight Calculator',
  shortDescription: 'Calculate your ideal body weight using 4 medical formulas: Devine, Robinson, Miller, and Hamwi. Plus healthy BMI weight range.',
  longDescription: `<p>The <strong>Ideal Weight Calculator</strong> computes your ideal body weight using four established medical formulas simultaneously — Devine (1974), Robinson (1983), Miller (1983), and Hamwi (1964). Rather than relying on a single formula, seeing all four together gives a more balanced picture of the healthy weight range for your height and gender.</p>
<h2>The Four Formulas</h2>
<p><strong>Devine Formula</strong> (1974) was originally created for calculating medication dosages. It's the most widely used in medical settings. <strong>Robinson Formula</strong> (1983) is a modification of Devine that is slightly more conservative. <strong>Miller Formula</strong> (1983) tends to give the highest ideal weight estimates. <strong>Hamwi Formula</strong> (1964) is one of the oldest and simplest methods, widely used by dietitians.</p>
<h2>Healthy BMI Range</h2>
<p>The calculator also shows the weight range corresponding to a healthy BMI of 18.5–24.9 for your height, which is the World Health Organization's standard for healthy weight.</p>`,
  category: 'calculators',
  targetKeyword: 'ideal weight calculator',
  secondaryKeywords: ['ideal body weight calculator', 'Devine formula ideal weight', 'healthy weight for height', 'IBW calculator'],
  metaTitle: 'Ideal Weight Calculator — Devine, Robinson, Miller & Hamwi Formulas',
  metaDescription: 'Calculate your ideal body weight using all 4 medical formulas (Devine, Robinson, Miller, Hamwi) plus healthy BMI range. Results in kg and lbs.',
  faqs: [
    { question: 'Which ideal weight formula is most accurate?', answer: 'No single formula is universally "best." The Devine formula is most used in clinical settings. Viewing results from all four formulas gives you a realistic range rather than a single number.' },
    { question: 'Is ideal weight the same as healthy weight?', answer: 'Not exactly. Ideal weight formulas give a specific target based on height and gender. Healthy weight is typically a range based on BMI 18.5–24.9. Both are useful references, not strict targets.' },
    { question: 'Does the ideal weight calculator account for muscle mass?', answer: 'No. These formulas are based only on height and gender. Athletes and muscular individuals may weigh more than the formula suggests while still being very healthy.' },
  ],
  howToSteps: [
    'Enter your height in cm or feet/inches.',
    'Select your gender.',
    'View results from all 4 formulas simultaneously.',
    'Compare with the healthy BMI weight range shown at the bottom.',
    'Toggle between kg and lbs for your preferred unit.',
  ],
  relatedToolSlugs: ['bmi-calculator', 'body-fat-calculator', 'tdee-macro-calculator', 'water-intake-calculator'],
  icon: 'Scale',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'sleep-cycle-calculator',
  name: 'Sleep Cycle Calculator',
  shortDescription: 'Find the best times to wake up or go to sleep based on 90-minute sleep cycles. Wake up refreshed, not groggy.',
  longDescription: `<p>The <strong>Sleep Cycle Calculator</strong> helps you find the optimal times to wake up or go to sleep based on natural 90-minute sleep cycles. Waking up in the middle of a deep sleep cycle leaves you feeling groggy — waking between cycles lets you feel alert and refreshed.</p>
<h2>How Sleep Cycles Work</h2>
<p>A complete sleep cycle lasts approximately 90 minutes and includes light sleep, deep sleep, and REM (dream) sleep phases. A full night's sleep consists of 5–6 complete cycles (7.5–9 hours). The calculator adds 15 minutes for the time it typically takes to fall asleep.</p>
<h2>Two Calculation Modes</h2>
<p>Enter your desired wake-up time to find the best bedtimes, or enter your bedtime to find the ideal wake-up windows. Up to 6 options are shown for each scenario, ranging from short naps (1–2 cycles) to full rest (5–6 cycles).</p>`,
  category: 'utility-tools',
  targetKeyword: 'sleep cycle calculator',
  secondaryKeywords: ['when to wake up calculator', 'sleep time calculator', 'best time to wake up', 'sleep cycle wake up time'],
  metaTitle: 'Sleep Cycle Calculator — Best Wake Up Times Based on Sleep Cycles',
  metaDescription: 'Find the ideal time to wake up or go to sleep using 90-minute sleep cycles. Wake refreshed, not groggy. Free sleep calculator online.',
  faqs: [
    { question: 'How long is a sleep cycle?', answer: 'One sleep cycle lasts approximately 90 minutes, progressing through light sleep, deep sleep, and REM sleep. Most adults go through 5–6 cycles per night (7.5–9 hours total).' },
    { question: 'Why do I feel groggy even after 8 hours of sleep?', answer: 'If your alarm wakes you in the middle of a deep sleep phase, you will feel groggy regardless of total sleep duration. This is called sleep inertia. Waking between cycles minimises this effect.' },
    { question: 'What if I cannot fall asleep in exactly 15 minutes?', answer: 'The 15-minute fall-asleep estimate is an average. If you typically fall asleep faster or slower, adjust your target bedtime by the difference.' },
  ],
  howToSteps: [
    'Choose mode: "I want to wake up at" or "I want to sleep at".',
    'Enter your desired time using the hour, minute, and AM/PM selectors.',
    'View 6 optimal times based on 1–6 complete sleep cycles.',
    'Choose the time marked "Recommended" (6 cycles = 9 hours) or "Optimal" (5 cycles = 7.5 hours).',
    'Use the quick buttons to calculate wake times from right now.',
  ],
  relatedToolSlugs: ['water-intake-calculator', 'heart-rate-zone-calculator', 'pomodoro-timer', 'countdown-timer'],
  icon: 'Moon',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'water-intake-calculator',
  name: 'Daily Water Intake Calculator',
  shortDescription: 'Calculate how much water you should drink daily based on weight, activity level, and climate. Get a personalised hourly schedule.',
  longDescription: `<p>The <strong>Daily Water Intake Calculator</strong> gives you a personalised daily water goal based on your body weight, activity level, and climate. Proper hydration is essential for energy, concentration, digestion, and overall health.</p>
<h2>How Much Water Do You Need?</h2>
<p>The base formula is weight (kg) × 0.033 litres. However, this is adjusted upward for physical activity and hot/humid climates, which increase fluid loss through sweat. A sedentary person in a temperate climate needs less water than an athlete training in a hot environment.</p>
<h2>Hourly Drinking Schedule</h2>
<p>Rather than drinking large amounts infrequently, spreading water intake throughout the day is healthier for digestion and kidneys. The calculator generates a personalised hourly schedule from 7am to 11pm based on your daily target.</p>`,
  category: 'calculators',
  targetKeyword: 'water intake calculator',
  secondaryKeywords: ['how much water should I drink calculator', 'daily water intake calculator', 'water consumption calculator', 'hydration calculator'],
  metaTitle: 'Daily Water Intake Calculator — How Much Water Should I Drink?',
  metaDescription: 'Calculate your daily water intake based on weight, activity level, and climate. Get results in litres, glasses, and bottles with an hourly drinking schedule.',
  faqs: [
    { question: 'How much water should I drink per day?', answer: 'The general guideline is 2–3 litres per day, but the right amount depends on your body weight, activity level, and climate. Use the calculator for a personalised recommendation.' },
    { question: 'Does coffee or tea count toward daily water intake?', answer: 'Caffeinated drinks have a mild diuretic effect, but moderate consumption of coffee and tea still contributes to hydration. Water and non-caffeinated drinks are the best sources.' },
    { question: 'Should I drink more water when exercising?', answer: 'Yes. Sweating during exercise increases fluid loss significantly. Drink 250–500ml of water before exercise, and 150–250ml every 15–20 minutes during exercise.' },
  ],
  howToSteps: [
    'Enter your body weight in kg or lbs.',
    'Select your activity level from Sedentary to Athlete.',
    'Choose your climate (Temperate, Hot & Humid, or Cold & Dry).',
    'View your daily water goal in litres, glasses, and bottle counts.',
    'Follow the hourly drinking schedule for optimal hydration throughout the day.',
  ],
  relatedToolSlugs: ['bmi-calculator', 'body-fat-calculator', 'ideal-weight-calculator', 'tdee-macro-calculator'],
  icon: 'Droplets',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'heart-rate-zone-calculator',
  name: 'Heart Rate Zone Calculator',
  shortDescription: 'Calculate your 5 heart rate training zones based on age and resting heart rate. Optimize your cardio workouts.',
  longDescription: `<p>The <strong>Heart Rate Zone Calculator</strong> determines your five personalised heart rate training zones based on your age and optionally your resting heart rate. Training in the right zone ensures you are getting the intended benefit from your workout — whether that is fat burning, aerobic fitness, or peak performance.</p>
<h2>The 5 Heart Rate Zones</h2>
<p><strong>Zone 1 (50–60%)</strong>: Warm-up and active recovery. <strong>Zone 2 (60–70%)</strong>: Fat burning and endurance base — the "fat burn zone." <strong>Zone 3 (70–80%)</strong>: Aerobic fitness and cardiovascular improvement. <strong>Zone 4 (80–90%)</strong>: Anaerobic threshold — improves speed and performance. <strong>Zone 5 (90–100%)</strong>: Maximum effort — only sustainable for short bursts.</p>
<h2>Karvonen Method</h2>
<p>If you provide your resting heart rate, the calculator uses the more precise Karvonen formula: Target HR = ((Max HR − Resting HR) × intensity%) + Resting HR. This accounts for your cardiovascular fitness level and gives more personalised zones than the simple percentage method.</p>`,
  category: 'calculators',
  targetKeyword: 'heart rate zone calculator',
  secondaryKeywords: ['target heart rate calculator', 'exercise heart rate zones', 'Karvonen heart rate calculator', 'cardio heart rate zones'],
  metaTitle: 'Heart Rate Zone Calculator — 5 Training Zones for Cardio Workouts',
  metaDescription: 'Calculate your 5 heart rate training zones by age and resting HR. Uses Karvonen method for precise zones. Optimise fat burn, aerobic fitness, and performance.',
  faqs: [
    { question: 'What is the maximum heart rate formula?', answer: 'The most common formula is Max HR = 220 − age. This is an estimate — actual maximum heart rate can vary by ±10–20 bpm between individuals of the same age.' },
    { question: 'What heart rate zone burns the most fat?', answer: 'Zone 2 (60–70% of max HR) is often called the "fat burn zone" because fat is the primary fuel at this intensity. However, higher zones burn more total calories overall.' },
    { question: 'What is the Karvonen method?', answer: 'The Karvonen method accounts for your resting heart rate (HRR — Heart Rate Reserve) when calculating zones: Target HR = ((Max HR − Resting HR) × intensity%) + Resting HR. It gives more personalised results than simple percentage calculations.' },
  ],
  howToSteps: [
    'Enter your age to calculate maximum heart rate (220 − age).',
    'Optionally enter your resting heart rate for the more precise Karvonen method.',
    'View all 5 training zones with BPM ranges and colour-coded labels.',
    'Use the zone that matches your workout goal: Zone 2 for fat burn, Zone 3-4 for fitness improvement.',
  ],
  relatedToolSlugs: ['bmi-calculator', 'body-fat-calculator', 'water-intake-calculator', 'tdee-macro-calculator'],
  icon: 'HeartPulse',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'roi-calculator',
  name: 'ROI Calculator',
  shortDescription: 'Calculate return on investment (ROI) percentage, net profit, and annualised ROI. Compare multiple investments side by side.',
  longDescription: `<p>The <strong>ROI Calculator</strong> helps you quickly determine the return on investment for any investment, project, or business decision. Enter your initial investment and final value (or net profit) to calculate ROI percentage, annualised ROI, and profit or loss.</p>
<h2>What is ROI?</h2>
<p>Return on Investment (ROI) is the percentage gain or loss on an investment relative to its cost. Formula: ROI% = (Net Profit ÷ Initial Investment) × 100. A positive ROI means you gained money; a negative ROI means a loss.</p>
<h2>Annualised ROI</h2>
<p>For investments held over multiple years, annualised ROI (CAGR) shows the equivalent annual return: Annualised ROI = ((1 + ROI/100)^(1/years) − 1) × 100. This allows fair comparison between investments held for different time periods.</p>
<h2>Compare Investments</h2>
<p>The comparison feature lets you add up to 3 investments side by side and ranks them by ROI, helping you identify which investment performed best.</p>`,
  category: 'calculators',
  targetKeyword: 'ROI calculator',
  secondaryKeywords: ['return on investment calculator', 'roi percentage calculator', 'annualised ROI calculator', 'investment return calculator'],
  metaTitle: 'ROI Calculator — Return on Investment Calculator Free Online',
  metaDescription: 'Calculate ROI percentage, net profit/loss, and annualised ROI instantly. Compare up to 3 investments side by side. Free return on investment calculator.',
  faqs: [
    { question: 'What is a good ROI percentage?', answer: 'A "good" ROI depends on the investment type and risk. Stock market average is ~10%/year. Real estate typically 8–12%. Savings accounts 3–5%. Higher ROI usually comes with higher risk.' },
    { question: 'What is the difference between ROI and annualised ROI?', answer: 'ROI is the total return over the entire investment period. Annualised ROI (CAGR) converts this to an equivalent annual rate, allowing fair comparison between investments held for different durations.' },
    { question: 'How do I calculate ROI from initial and final value?', answer: 'ROI% = ((Final Value − Initial Investment) ÷ Initial Investment) × 100. For example, investing Rs 1,00,000 and getting Rs 1,40,000 back = 40% ROI.' },
  ],
  howToSteps: [
    'Enter your initial investment amount.',
    'Enter either the final value or net profit (toggle between modes).',
    'Optionally enter the investment period in years and months for annualised ROI.',
    'View ROI %, net profit/loss, and annualised ROI instantly.',
    'Use "Compare Investments" to add more investments and rank them by performance.',
  ],
  relatedToolSlugs: ['compound-interest-calculator', 'sip-calculator', 'break-even-calculator', 'markup-margin-calculator'],
  icon: 'TrendingUp',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'break-even-calculator',
  name: 'Break-Even Calculator',
  shortDescription: 'Calculate your break-even point in units and revenue. See contribution margin, profit at various sales volumes, and margin of safety.',
  longDescription: `<p>The <strong>Break-Even Calculator</strong> helps businesses find the exact sales volume where total revenue equals total costs — the break-even point. Above this point, every unit sold generates profit; below it, the business makes a loss.</p>
<h2>Key Concepts</h2>
<p><strong>Contribution Margin</strong> = Selling Price − Variable Cost per unit. This is the amount each unit contributes toward covering fixed costs and generating profit. <strong>Break-Even Units</strong> = Fixed Costs ÷ Contribution Margin. <strong>Break-Even Revenue</strong> = Fixed Costs ÷ Contribution Margin Ratio.</p>
<h2>Profit/Loss Table</h2>
<p>The calculator shows projected profit or loss at 50%, 75%, 100% (break-even), 150%, and 200% of break-even volume. This helps you understand how quickly you can reach profitability with increased sales.</p>
<h2>Margin of Safety</h2>
<p>If you enter your current or projected sales volume, the margin of safety shows how far above the break-even point you are — the cushion before you start making a loss.</p>`,
  category: 'calculators',
  targetKeyword: 'break even calculator',
  secondaryKeywords: ['break even point calculator', 'break even analysis calculator', 'BEP calculator', 'contribution margin calculator'],
  metaTitle: 'Break-Even Calculator — Break-Even Point & Contribution Margin',
  metaDescription: 'Calculate your break-even point in units and revenue. View contribution margin, profit at various sales volumes, and margin of safety. Free break-even analysis tool.',
  faqs: [
    { question: 'What is a break-even point?', answer: 'The break-even point is the sales volume at which total revenue exactly equals total costs — neither profit nor loss. It is calculated as: Fixed Costs ÷ (Selling Price − Variable Cost per unit).' },
    { question: 'What is contribution margin?', answer: 'Contribution margin = Selling Price − Variable Cost per unit. It represents how much each unit sold contributes toward covering fixed costs. Once fixed costs are covered, contribution margin becomes profit.' },
    { question: 'How can I lower my break-even point?', answer: 'You can lower your break-even point by: (1) reducing fixed costs, (2) reducing variable costs per unit, or (3) increasing selling price. Any combination of these will reduce the number of units needed to break even.' },
  ],
  howToSteps: [
    'Enter your total fixed costs (rent, salaries, etc.).',
    'Enter variable cost per unit (materials, direct labour, etc.).',
    'Enter your selling price per unit.',
    'View break-even units, break-even revenue, and contribution margin instantly.',
    'Optionally enter current sales volume to see your margin of safety.',
  ],
  relatedToolSlugs: ['roi-calculator', 'markup-margin-calculator', 'loan-amortization-calculator', 'gst-calculator'],
  icon: 'BarChart2',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'markup-margin-calculator',
  name: 'Markup & Profit Margin Calculator',
  shortDescription: 'Bidirectional markup and margin calculator. Edit any field — cost, selling price, profit, markup %, or margin % — and all others update instantly.',
  longDescription: `<p>The <strong>Markup & Profit Margin Calculator</strong> is a fully bidirectional tool — edit any of the five fields (cost price, selling price, gross profit, markup %, or margin %) and all others update instantly. It also clearly explains the critical difference between markup and margin, which are often confused.</p>
<h2>Markup vs Margin: The Key Difference</h2>
<p><strong>Markup</strong> is calculated on <em>cost</em>: Markup% = (Gross Profit ÷ Cost) × 100. <strong>Margin</strong> is calculated on <em>selling price</em>: Margin% = (Gross Profit ÷ Selling Price) × 100. They are different numbers for the same transaction — a 50% markup equals only a 33.3% profit margin.</p>
<h2>Quick Markup Buttons</h2>
<p>Use the preset buttons (10%, 20%, 25%, 33%, 50%, 100%) to quickly apply a standard markup to your cost price, then see the resulting selling price and margin percentage instantly.</p>`,
  category: 'calculators',
  targetKeyword: 'markup calculator',
  secondaryKeywords: ['profit margin calculator', 'markup vs margin calculator', 'gross profit calculator', 'selling price calculator'],
  metaTitle: 'Markup & Profit Margin Calculator — Bidirectional Online Tool',
  metaDescription: 'Calculate markup % and profit margin % from any field. Edit cost, selling price, gross profit, markup, or margin and all update instantly. Free online tool.',
  faqs: [
    { question: 'What is the difference between markup and margin?', answer: 'Markup is based on cost: (Profit ÷ Cost) × 100. Margin is based on selling price: (Profit ÷ Selling Price) × 100. A 50% markup gives a 33.3% margin — they are NOT the same number.' },
    { question: 'How do I calculate selling price from cost and markup?', answer: 'Selling Price = Cost × (1 + Markup% / 100). For example, a product costing Rs 100 with a 40% markup: Selling Price = 100 × 1.40 = Rs 140.' },
    { question: 'What is a good profit margin for a business?', answer: 'It varies significantly by industry. Retail typically targets 20–50% gross margin. SaaS businesses often aim for 60–80%. Restaurants operate on thin 3–9% net margins. Use this tool to work backwards from your target margin.' },
  ],
  howToSteps: [
    'Enter your cost price to start.',
    'Type in any field — selling price, gross profit, markup %, or margin % — and all others update.',
    'Or use the quick markup buttons (10%–100%) to apply a preset markup.',
    'See the clear breakdown with formulas below the calculator.',
  ],
  relatedToolSlugs: ['roi-calculator', 'break-even-calculator', 'gst-calculator', 'discount-calculator'],
  icon: 'Percent',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'loan-amortization-calculator',
  name: 'Loan Amortization Schedule',
  shortDescription: 'Calculate EMI and view the full month-by-month loan amortization table showing principal, interest, and outstanding balance for every instalment.',
  longDescription: `<p>The <strong>Loan Amortization Schedule Calculator</strong> computes your monthly EMI and generates a complete month-by-month amortization table showing exactly how much of each payment goes toward principal and how much goes toward interest — for every single instalment over the life of the loan.</p>
<h2>What is Loan Amortization?</h2>
<p>Amortization is the process of paying off a loan through regular equal payments. In the early months, most of each payment is interest; as the loan balance decreases, more of each payment goes toward principal. The amortization schedule shows this breakdown for every month.</p>
<h2>EMI Formula</h2>
<p>Monthly EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P = loan amount, r = monthly interest rate, n = total months. The total interest paid over the loan life is often surprisingly large — this calculator makes that visible.</p>
<h2>Difference from Basic EMI Calculator</h2>
<p>While a basic EMI calculator only shows the monthly payment amount, this tool provides the complete amortization schedule table so you can see the exact principal-interest split for any given month.</p>`,
  category: 'calculators',
  targetKeyword: 'loan amortization calculator',
  secondaryKeywords: ['loan amortization schedule', 'EMI schedule calculator', 'loan repayment schedule', 'mortgage amortization calculator'],
  metaTitle: 'Loan Amortization Schedule Calculator — Full EMI Breakdown Table',
  metaDescription: 'Calculate EMI and generate a full month-by-month loan amortization schedule. See principal vs interest split for every payment. Free loan calculator online.',
  faqs: [
    { question: 'What is a loan amortization schedule?', answer: 'A loan amortization schedule is a table showing each monthly payment broken down into the principal portion and the interest portion, along with the remaining loan balance after each payment.' },
    { question: 'Why is most of the early EMI interest?', answer: 'Because interest is calculated on the outstanding balance. At the start, the full loan amount is outstanding, so interest is high. As you repay principal, the balance decreases and so does the interest portion.' },
    { question: 'How is this different from the EMI calculator?', answer: 'The basic EMI calculator shows only the monthly payment amount. This loan amortization tool shows the complete month-by-month schedule with principal/interest breakdown and running balance for every instalment.' },
    { question: 'Can I use this for home loans, car loans, and personal loans?', answer: 'Yes, this calculator works for any fixed-rate loan — home loan, car loan, personal loan, or business loan. Just enter the loan amount, interest rate, and tenure.' },
  ],
  howToSteps: [
    'Enter the loan amount.',
    'Enter the annual interest rate (e.g. 10.5 for 10.5% per year).',
    'Enter the loan tenure in years or months.',
    'View your monthly EMI, total interest, and total payment in the summary cards.',
    'Scroll down to see the full month-by-month amortization table. Click "Show All" to expand beyond 12 rows.',
  ],
  relatedToolSlugs: ['emi-calculator', 'emi-prepayment-calculator', 'loan-comparison-calculator', 'roi-calculator'],
  icon: 'CalendarRange',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'color-contrast-checker',
  name: 'Color Contrast Checker',
  shortDescription: 'Check WCAG 2.1 color contrast ratio between foreground and background. Get AA/AAA pass/fail for text, large text, and UI components.',
  longDescription: `<p>The <strong>Color Contrast Checker</strong> calculates the contrast ratio between any two colors and checks them against WCAG 2.1 accessibility standards. Building accessible websites requires ensuring sufficient contrast between text and its background so that people with low vision or color blindness can read your content.</p>
<h2>WCAG 2.1 Standards</h2>
<p><strong>AA (minimum):</strong> Normal text requires 4.5:1, large text (18pt+ or 14pt bold+) requires 3:1, UI components require 3:1. <strong>AAA (enhanced):</strong> Normal text requires 7:1, large text requires 4.5:1.</p>
<h2>How Contrast Ratio is Calculated</h2>
<p>Contrast ratio = (L1 + 0.05) ÷ (L2 + 0.05), where L1 is the relative luminance of the lighter color and L2 is the relative luminance of the darker color. Luminance is computed from the sRGB values using the WCAG formula.</p>
<h2>Input Formats</h2>
<p>Accepts hex codes (#1d4ed8), rgb() values, and hsl() values for both foreground and background colors. Use the native color picker for visual selection.</p>`,
  category: 'developer-tools',
  targetKeyword: 'color contrast checker',
  secondaryKeywords: ['WCAG contrast checker', 'accessibility contrast ratio', 'web accessibility color checker', 'contrast ratio calculator'],
  metaTitle: 'Color Contrast Checker — WCAG 2.1 AA/AAA Accessibility Tool',
  metaDescription: 'Check WCAG 2.1 contrast ratio between foreground and background colors. Get instant AA/AAA pass/fail for normal text, large text, and UI components.',
  faqs: [
    { question: 'What contrast ratio do I need to pass WCAG AA?', answer: 'For WCAG AA compliance: normal text needs 4.5:1, large text (18pt+ or 14pt bold) needs 3:1, and UI components/graphical objects need 3:1 contrast ratio.' },
    { question: 'What is WCAG AAA contrast?', answer: 'WCAG AAA is the enhanced accessibility level requiring 7:1 for normal text and 4.5:1 for large text. It is harder to achieve but provides better readability for users with low vision.' },
    { question: 'How do I enter colors in this tool?', answer: 'You can enter colors as hex codes (#ffffff), rgb() values (rgb(255,255,255)), or hsl() values. You can also click the color swatch to use the native color picker.' },
  ],
  howToSteps: [
    'Enter your foreground (text) color as a hex, rgb, or hsl value — or use the color picker.',
    'Enter your background color.',
    'View the contrast ratio and WCAG AA/AAA pass/fail badges instantly.',
    'Use the live preview to see how your text looks on the background.',
    'Try the preset pairs or use the Swap button to reverse foreground and background.',
  ],
  relatedToolSlugs: ['color-picker', 'hex-rgb-converter', 'css-gradient-generator', 'html-css-js-editor'],
  icon: 'Eye',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'html-minifier',
  name: 'HTML Minifier',
  shortDescription: 'Minify HTML online — remove whitespace, comments, and optional tags. See file size savings instantly.',
  longDescription: `<p>The <strong>HTML Minifier</strong> compresses your HTML code by removing unnecessary whitespace, comments, and optional closing tags, reducing file size for faster page loading. Smaller HTML files improve page speed scores and reduce bandwidth costs.</p>
<h2>What Gets Removed</h2>
<p>The minifier removes HTML comments (<!-- ... -->), collapses whitespace and newlines between tags, removes indentation, and optionally strips optional closing tags like </li> and </td> that browsers handle automatically.</p>
<h2>How Much Can HTML Be Compressed?</h2>
<p>Typical HTML files compress 10–40% with minification alone. Files with heavy indentation, many comments, and verbose formatting compress more. Minification is most effective when combined with gzip compression on the server.</p>
<h2>CSS and JS Minifiers</h2>
<p>For complete optimization, also minify your CSS and JavaScript files using the dedicated CSS Minifier and JS Minifier tools available on this site.</p>`,
  category: 'developer-tools',
  targetKeyword: 'html minifier online',
  secondaryKeywords: ['minify html', 'html compressor online', 'html minify free', 'compress html online'],
  metaTitle: 'HTML Minifier Online — Compress & Minify HTML Free',
  metaDescription: 'Minify and compress HTML online. Remove whitespace, comments, and optional tags. See before/after file size comparison. Free HTML minifier tool.',
  faqs: [
    { question: 'Is it safe to minify HTML?', answer: 'Yes, HTML minification is safe for production use. It only removes whitespace and comments that have no effect on how the page renders. Optional: removing optional closing tags is also safe in all modern browsers.' },
    { question: 'How much does HTML minification reduce file size?', answer: 'Typically 10–40%, depending on how much whitespace and comments your original HTML contains. Files with heavy indentation and many comments compress the most.' },
    { question: 'Should I minify HTML before or after gzip compression?', answer: 'Minify first, then serve with gzip. Both work together — minification removes redundant characters, while gzip further compresses the remaining patterns. Most servers (nginx, Apache) apply gzip automatically.' },
  ],
  howToSteps: [
    'Paste your HTML code into the input area.',
    'Choose your minification options (remove comments, collapse whitespace, etc.).',
    'Click "Minify" or wait for automatic processing for smaller files.',
    'View the size savings and copy the minified output.',
  ],
  relatedToolSlugs: ['css-minifier', 'js-minifier', 'html-beautifier', 'html-css-js-editor'],
  icon: 'Code',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'roman-numeral-converter',
  name: 'Roman Numeral Converter',
  shortDescription: 'Convert numbers to Roman numerals and Roman numerals to numbers. Supports 1–3999 with step-by-step conversion breakdown.',
  longDescription: `<p>The <strong>Roman Numeral Converter</strong> instantly converts integers (1–3999) to Roman numerals and vice versa. It also shows a step-by-step breakdown of how each conversion works, making it a great learning tool for students.</p>
<h2>Roman Numeral Symbols</h2>
<p>The seven Roman numeral symbols are: I (1), V (5), X (10), L (50), C (100), D (500), and M (1000). Roman numerals use subtractive notation for values like 4 (IV), 9 (IX), 40 (XL), 90 (XC), 400 (CD), and 900 (CM).</p>
<h2>Step-by-Step Breakdown</h2>
<p>For each conversion, the tool shows exactly which Roman numeral symbols were used and what value they represent. For example, 1994 = M (1000) + CM (900) + XC (90) + IV (4) = MCMXCIV.</p>
<h2>Range</h2>
<p>Standard Roman numerals cover 1 to 3999. The number 4000 would require a vinculum (overline) notation which is outside the standard system.</p>`,
  category: 'converters',
  targetKeyword: 'roman numeral converter',
  secondaryKeywords: ['number to roman numerals', 'roman numeral calculator', 'roman to number converter', 'convert to roman numerals'],
  metaTitle: 'Roman Numeral Converter — Numbers to Roman Numerals & Back',
  metaDescription: 'Convert any number (1–3999) to Roman numerals or decode Roman numerals to numbers. Shows step-by-step breakdown. Free online Roman numeral calculator.',
  faqs: [
    { question: 'How do you write 4 in Roman numerals?', answer: 'Four is written as IV in Roman numerals. I (1) before V (5) means subtract: 5 − 1 = 4. Similarly, 9 = IX, 40 = XL, 90 = XC, 400 = CD, 900 = CM.' },
    { question: 'What is the largest Roman numeral?', answer: 'Using standard notation, the largest is 3999 = MMMCMXCIX. To write 4000 and above, extended notations like vinculum (overline) are needed, which are not part of the standard system.' },
    { question: 'How do you read Roman numerals?', answer: 'Add symbol values left to right. If a smaller symbol precedes a larger one, subtract it instead of adding (e.g. IV = 4, not 6). Otherwise just add: VIII = 5+1+1+1 = 8.' },
  ],
  howToSteps: [
    'Select "Number to Roman" tab and type any integer from 1 to 3999.',
    'Or select "Roman to Number" tab and type a Roman numeral string.',
    'The conversion result appears instantly.',
    'View the step-by-step breakdown showing each symbol and its value.',
    'Use the Copy button to copy the result.',
  ],
  relatedToolSlugs: ['number-to-words', 'binary-hex-octal-converter', 'scientific-notation-converter', 'unit-converter'],
  icon: 'Hash',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'morse-code-converter',
  name: 'Morse Code Translator',
  shortDescription: 'Translate text to Morse code and Morse code to text. Includes audio playback of the Morse code signal.',
  longDescription: `<p>The <strong>Morse Code Translator</strong> converts text to Morse code and Morse code back to text in real time. It also plays the Morse code as audio beeps using the Web Audio API, letting you hear the actual dots and dashes.</p>
<h2>What is Morse Code?</h2>
<p>Morse code is a character encoding system that represents letters, numbers, and punctuation as sequences of short (dot ·) and long (dash −) signals. Developed by Samuel Morse in the 1830s, it was the primary means of long-distance communication before the telephone and remains in use in aviation and amateur radio today.</p>
<h2>Encoding Standard</h2>
<p>This translator uses International Morse Code (ITU standard): A=·−, B=−···, S=···, O=−−−, and so on. Letters are separated by spaces; words are separated by " / ".</p>
<h2>Audio Playback</h2>
<p>The play button generates a 600Hz sine wave tone using the Web Audio API. Dots are 80ms, dashes are 240ms, gaps between symbols are 80ms, gaps between letters are 240ms, and gaps between words are 560ms.</p>`,
  category: 'converters',
  targetKeyword: 'morse code translator',
  secondaryKeywords: ['morse code converter', 'text to morse code', 'morse code decoder', 'morse code generator'],
  metaTitle: 'Morse Code Translator — Text to Morse Code with Audio Playback',
  metaDescription: 'Translate text to Morse code or decode Morse code to text. Includes real-time conversion and audio playback of the Morse signal. Free online tool.',
  faqs: [
    { question: 'How do I read Morse code?', answer: 'Each letter is represented by a pattern of dots (·) and dashes (−). A (·−), E (·), T (−), S (···), O (−−−). Letters are separated by spaces; words by "/" in written Morse.' },
    { question: 'What does SOS look like in Morse code?', answer: 'SOS is ··· −−− ··· (three dots, three dashes, three dots). It is the universal distress signal chosen because it is simple and easily recognisable even in poor conditions.' },
    { question: 'Is Morse code still used today?', answer: 'Yes, Morse code is still used in aviation (navigational beacons transmit their identifiers in Morse), amateur (ham) radio, and as a supplemental communication method for people with disabilities.' },
  ],
  howToSteps: [
    'Select "Text to Morse" tab and type your text — Morse code appears instantly below.',
    'Select "Morse to Text" tab and type Morse code (use dots and dashes, space between letters, "/" between words).',
    'Click the Play button to hear the Morse code as audio beeps.',
    'Click the Stop button to stop audio playback.',
    'Use the Copy button to copy the result.',
  ],
  relatedToolSlugs: ['roman-numeral-converter', 'text-encryption', 'binary-hex-octal-converter', 'base64-encode-decode'],
  icon: 'Radio',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'text-encryption',
  name: 'Text Encryption & Decryption',
  shortDescription: 'Encrypt and decrypt text with Caesar cipher, ROT13, Atbash, and Vigenère cipher. Learn classic cryptography online.',
  longDescription: `<p>The <strong>Text Encryption & Decryption</strong> tool lets you encode and decode text using four classic cipher techniques: Caesar cipher, ROT13, Atbash, and Vigenère cipher. All processing happens in your browser — your text is never sent to any server.</p>
<h2>Caesar Cipher</h2>
<p>One of the oldest and simplest encryption methods, used by Julius Caesar. Each letter is shifted by a fixed number of positions in the alphabet (1–25). A shift of 13 is the special case known as ROT13.</p>
<h2>ROT13</h2>
<p>ROT13 ("rotate by 13 places") is a Caesar cipher with a fixed shift of 13. Applying ROT13 twice returns the original text, making it its own inverse. Historically used to hide spoilers and off-topic content in online forums.</p>
<h2>Atbash Cipher</h2>
<p>An ancient Hebrew cipher where A↔Z, B↔Y, C↔X, etc. — the alphabet is reversed. Like ROT13, applying it twice returns the original.</p>
<h2>Vigenère Cipher</h2>
<p>A polyalphabetic cipher using a keyword. Each letter of the plaintext is shifted by the corresponding letter of the keyword, making it much harder to crack than simple Caesar ciphers. Considered unbreakable for centuries.</p>`,
  category: 'text-tools',
  targetKeyword: 'caesar cipher encoder decoder',
  secondaryKeywords: ['ROT13 converter', 'text encryption online', 'cipher decoder', 'Vigenère cipher online', 'atbash cipher'],
  metaTitle: 'Text Encryption & Decryption — Caesar, ROT13, Atbash, Vigenère',
  metaDescription: 'Encrypt and decrypt text with Caesar cipher, ROT13, Atbash, and Vigenère cipher online. Real-time encoding/decoding, no data sent to server.',
  faqs: [
    { question: 'What is the Caesar cipher?', answer: 'The Caesar cipher shifts each letter in the text by a fixed number of positions (1–25) in the alphabet. For example, with a shift of 3: A→D, B→E, Z→C. It is one of the oldest encryption methods.' },
    { question: 'What is ROT13?', answer: 'ROT13 is a special Caesar cipher with a shift of exactly 13. Since the alphabet has 26 letters, applying ROT13 twice returns the original text. A→N, B→O, N→A, etc.' },
    { question: 'Is Vigenère cipher secure?', answer: 'The Vigenère cipher is stronger than Caesar cipher but is still breakable with modern techniques (Kasiski examination, frequency analysis). It is not suitable for real security — use AES or other modern encryption for actual security needs.' },
  ],
  howToSteps: [
    'Select Encrypt or Decrypt mode.',
    'Choose your cipher: Caesar, ROT13, Atbash, or Vigenère.',
    'For Caesar cipher, set the shift value (1–25) using the slider.',
    'For Vigenère cipher, enter your keyword (letters only).',
    'Type your text and see the result appear instantly. Use the Copy button to copy the output.',
  ],
  relatedToolSlugs: ['morse-code-converter', 'roman-numeral-converter', 'base64-encode-decode', 'hash-generator'],
  icon: 'Lock',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'youtube-description-generator',
  name: 'YouTube Description Generator',
  shortDescription: 'Generate SEO-optimised YouTube video descriptions with intro, timestamps, CTAs, and hashtags. Free template-based generator.',
  longDescription: `<p>The <strong>YouTube Description Generator</strong> helps creators write professional, SEO-optimised video descriptions in seconds. A well-written description improves your video's discoverability in YouTube search and gives viewers and the YouTube algorithm essential context about your content.</p>
<h2>What Makes a Great YouTube Description?</h2>
<p>The ideal YouTube description includes a keyword-rich first 2–3 lines (shown before "Show more"), a detailed summary of the video content, timestamps for easy navigation, a call to action (subscribe, like), links to related content, and relevant hashtags.</p>
<h2>How This Generator Works</h2>
<p>Enter your video title, topic summary, target keyword, and channel niche. The generator creates a structured description with an intro paragraph using your keywords, "What you'll learn" bullet points, a timestamps template, a customisable CTA, and 10–15 relevant hashtags. Click Regenerate to cycle through alternative intro phrasings.</p>
<h2>Character Limits</h2>
<p>YouTube descriptions can be up to 5,000 characters. The first ~150 characters appear in search results, so front-loading your main keyword is crucial for SEO.</p>`,
  category: 'seo-tools',
  targetKeyword: 'youtube description generator',
  secondaryKeywords: ['youtube video description template', 'youtube description SEO', 'youtube description writer', 'auto youtube description'],
  metaTitle: 'YouTube Description Generator — Free SEO Description Template',
  metaDescription: 'Generate SEO-optimised YouTube descriptions with intro, timestamps, CTA, and hashtags. Template-based generator with keyword integration. Free online tool.',
  faqs: [
    { question: 'How long should a YouTube description be?', answer: 'YouTube allows up to 5,000 characters. Aim for at least 200–300 words for SEO. The first 150 characters are shown in search results, so put your most important information first.' },
    { question: 'What should I include in a YouTube description?', answer: 'Include: (1) keyword-rich intro paragraph, (2) what the video covers, (3) timestamps, (4) call to action (subscribe/like), (5) links to related videos or social media, (6) relevant hashtags.' },
    { question: 'Do hashtags in YouTube descriptions help SEO?', answer: 'Yes. YouTube displays up to 3 hashtags above the video title and uses hashtags for categorisation. Use 10–15 relevant hashtags — more than 15 and YouTube ignores all of them.' },
  ],
  howToSteps: [
    'Enter your video title and a brief summary of the video topic.',
    'Add your main keyword and up to 3 secondary keywords.',
    'Enter your channel name and select your niche/category.',
    'Click "Generate Description" to create a structured YouTube description.',
    'Click "Regenerate" to get an alternative intro phrasing. Copy the final description with one click.',
  ],
  relatedToolSlugs: ['youtube-title-generator', 'youtube-thumbnail-tester', 'hashtag-generator', 'meta-tag-generator'],
  icon: 'Youtube',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'linkedin-post-formatter',
  name: 'LinkedIn Post Formatter',
  shortDescription: 'Format LinkedIn posts with bold and italic text using Unicode characters. Live preview, character counter, and emoji inserter.',
  longDescription: `<p>The <strong>LinkedIn Post Formatter</strong> lets you add bold and italic formatting to LinkedIn posts using Unicode characters. LinkedIn's text editor doesn't support native bold/italic, but Unicode mathematical bold and italic characters display as formatted text in posts and comments.</p>
<h2>How LinkedIn Formatting Works</h2>
<p>LinkedIn renders Unicode Mathematical Bold Sans-Serif characters (𝗔-𝗭, 𝗮-𝘇) as bold text and Mathematical Italic characters as italic. These are actual Unicode characters, not HTML tags, so they work in LinkedIn's plain-text editor.</p>
<h2>Character Limit</h2>
<p>LinkedIn posts are limited to 3,000 characters. The character counter turns red when you approach or exceed this limit. Note: each Unicode bold/italic character counts as one character in LinkedIn's counter.</p>
<h2>Live Preview</h2>
<p>The preview panel shows exactly how your post will appear on LinkedIn, with line breaks, Unicode formatting, and emojis rendered as they will display to your audience.</p>`,
  category: 'text-tools',
  targetKeyword: 'linkedin post formatter',
  secondaryKeywords: ['linkedin text formatter bold', 'format linkedin post', 'linkedin bold text generator', 'linkedin post editor'],
  metaTitle: 'LinkedIn Post Formatter — Bold & Italic Text with Live Preview',
  metaDescription: 'Format LinkedIn posts with bold and italic Unicode text. Live preview, emoji inserter, 3000 character counter. Write better LinkedIn content for free.',
  faqs: [
    { question: 'How do I make text bold on LinkedIn?', answer: 'LinkedIn does not natively support bold formatting. However, you can use Unicode Mathematical Bold Sans-Serif characters that visually appear bold. This tool converts your selected text to these Unicode characters automatically.' },
    { question: 'Will Unicode bold text work on all LinkedIn versions?', answer: 'Yes. Unicode characters are stored in the text itself, not as formatting markup, so they display correctly across all LinkedIn interfaces — web, mobile app, and in notifications.' },
    { question: 'Does LinkedIn have a character limit for posts?', answer: 'Yes, LinkedIn posts are limited to 3,000 characters. The character counter in this tool tracks your count and turns red when you approach or exceed the limit.' },
  ],
  howToSteps: [
    'Type or paste your LinkedIn post text in the left panel.',
    'Select text you want to bold, then click the Bold button.',
    'Select text you want to italicise, then click the Italic button.',
    'Use the emoji buttons to quickly insert common emojis.',
    'Check the preview on the right, then click Copy to copy your formatted text to paste into LinkedIn.',
  ],
  relatedToolSlugs: ['twitter-thread-maker', 'social-media-bio-generator', 'hashtag-generator', 'text-to-slug'],
  icon: 'Linkedin',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'fuel-cost-calculator',
  name: 'Fuel Cost Calculator',
  shortDescription: 'Calculate trip fuel cost for petrol, diesel, or electric vehicles. Supports km/miles, multiple efficiency units, and per-person cost.',
  longDescription: `<p>The <strong>Fuel Cost Calculator</strong> helps you estimate how much fuel and money you will spend on any road trip or daily commute. Enter your distance, vehicle fuel efficiency, and current fuel price to get an instant cost breakdown.</p>
<h2>Nepal Fuel Prices</h2>
<p>For Nepal users, the calculator is pre-filled with current NOC (Nepal Oil Corporation) fuel prices — petrol at Rs 178/litre and diesel at Rs 163/litre. You can update these to the latest prices at any time. Electric vehicle users can enter their electricity rate per kWh.</p>
<h2>Multiple Efficiency Formats</h2>
<p>Enter fuel efficiency in any format: km/L (most common in Asia), L/100km (common in Europe), or MPG (used in the US and UK). The calculator converts between formats automatically.</p>
<h2>Trip Planner</h2>
<p>Plan multi-leg trips by adding up to 5 route segments with different distances. The total fuel cost and consumption is calculated across all legs.</p>`,
  category: 'calculators',
  targetKeyword: 'fuel cost calculator',
  secondaryKeywords: ['petrol cost calculator for trip', 'trip fuel calculator', 'mileage cost calculator', 'fuel consumption calculator'],
  metaTitle: 'Fuel Cost Calculator — Petrol, Diesel & EV Trip Cost Estimator',
  metaDescription: 'Calculate fuel cost for any trip. Supports petrol, diesel, and electric vehicles. Nepal fuel prices pre-filled. Multi-leg trip planner. Free online tool.',
  faqs: [
    { question: 'What is the current petrol price in Nepal?', answer: 'As of 2024/25, Nepal Oil Corporation (NOC) has set petrol at Rs 178/litre and diesel at Rs 163/litre. Prices are subject to change — update the price field with the current rate for accurate results.' },
    { question: 'How do I calculate fuel cost for a trip?', answer: 'Fuel needed = Distance ÷ Fuel efficiency (km/L). Fuel cost = Fuel needed × Price per litre. For example, a 200km trip at 15km/L with fuel at Rs 178/L costs 200÷15×178 = Rs 2,373.' },
    { question: 'How do I convert mpg to km/L?', answer: '1 MPG (US) = 0.425 km/L. 1 MPG (UK) = 0.354 km/L. The calculator accepts any efficiency unit and converts internally.' },
  ],
  howToSteps: [
    'Enter the trip distance in km or miles.',
    'Enter your vehicle\'s fuel efficiency (km/L, L/100km, or mpg).',
    'Enter the fuel price per litre (Nepal prices are pre-filled).',
    'Select fuel type: Petrol, Diesel, or Electric.',
    'Toggle Round Trip if applicable, and enter passenger count for per-person cost.',
  ],
  relatedToolSlugs: ['unit-converter', 'nepal-income-tax-calculator', 'nepal-vehicle-tax-calculator', 'tip-calculator'],
  icon: 'Fuel',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'twitter-thread-maker',
  name: 'Twitter / X Thread Maker',
  shortDescription: 'Split long content into a numbered Twitter/X thread. Preview each tweet, edit inline, and copy all at once.',
  longDescription: `<p>The <strong>Twitter / X Thread Maker</strong> helps you convert long-form content into a properly formatted Twitter/X thread. Write your full content, and the tool automatically splits it into numbered tweets respecting the 280-character limit.</p>
<h2>Smart Splitting</h2>
<p>The thread maker tries to split at natural sentence boundaries (periods, exclamation marks, question marks) first. If a sentence is too long for a single tweet, it falls back to word boundaries to avoid cutting words mid-way. This produces natural, readable threads rather than awkward mid-sentence breaks.</p>
<h2>Numbering Formats</h2>
<p>Choose between "1/ text" prefix format (common on Twitter) or "text (1/N)" suffix format. Both automatically update if you add or remove content.</p>
<h2>Per-Tweet Editing</h2>
<p>Each generated tweet can be edited inline — perfect for polishing specific tweets, adjusting breaks, or adding hashtags to the final tweet in a thread.</p>`,
  category: 'utility-tools',
  targetKeyword: 'twitter thread maker',
  secondaryKeywords: ['tweet thread generator', 'X thread creator', 'twitter thread splitter', 'long tweet to thread'],
  metaTitle: 'Twitter / X Thread Maker — Split Text into Numbered Tweets',
  metaDescription: 'Convert long content into a Twitter/X thread automatically. Smart sentence splitting, inline editing, per-tweet copy, and thread stats. Free online tool.',
  faqs: [
    { question: 'How many characters is each tweet in a thread?', answer: 'Each tweet in a Twitter/X thread can be up to 280 characters. The thread maker ensures no generated tweet exceeds this limit.' },
    { question: 'How many tweets can a thread have?', answer: 'Twitter/X allows unlimited tweets in a thread. However, very long threads (25+ tweets) tend to see drop-off in engagement. Aim for 5–15 tweets for the best reach.' },
    { question: 'How do I start a thread on Twitter/X?', answer: 'Compose your first tweet, click the "+" button to add more tweets in sequence, then post them all together. Use this tool to plan and draft your full thread content before posting.' },
  ],
  howToSteps: [
    'Type or paste your full content into the text area.',
    'Click "Split into Thread" to automatically divide it into tweets.',
    'Choose your numbering format (prefix "1/" or suffix "(1/N)").',
    'Edit any individual tweet by clicking the Edit button on that card.',
    'Copy individual tweets or use "Copy All" to copy the full thread at once.',
  ],
  relatedToolSlugs: ['linkedin-post-formatter', 'hashtag-generator', 'social-media-bio-generator', 'character-counter'],
  icon: 'MessageSquare',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'statistics-calculator',
  name: 'Statistics Calculator',
  shortDescription: 'Calculate mean, median, mode, standard deviation, variance, quartiles, and more from any list of numbers.',
  longDescription: `<p>The <strong>Statistics Calculator</strong> computes a full statistical summary from any list of numbers — paste or type comma, space, or newline-separated values and get 14 key statistics instantly. Ideal for students, data analysts, researchers, and anyone working with numerical data.</p>
<h2>Statistics Calculated</h2>
<p>Count, Sum, Mean (arithmetic average), Median, Mode, Minimum, Maximum, Range, Population Variance, Population Standard Deviation, Q1 (first quartile), Q2 (median), Q3 (third quartile), and IQR (interquartile range).</p>
<h2>Sorted List and Frequency Table</h2>
<p>The calculator also displays the input numbers sorted in ascending order and a frequency table showing how many times each unique value appears — useful for spotting patterns and outliers quickly.</p>`,
  category: 'calculators',
  targetKeyword: 'statistics calculator',
  secondaryKeywords: ['mean median mode calculator', 'standard deviation calculator online', 'variance calculator', 'quartile calculator'],
  metaTitle: 'Statistics Calculator — Mean, Median, Mode, Std Dev & More',
  metaDescription: 'Calculate mean, median, mode, standard deviation, variance, quartiles, and IQR from any list of numbers. Free online statistics calculator.',
  faqs: [
    { question: 'What is the difference between mean and median?', answer: 'The mean is the arithmetic average (sum ÷ count). The median is the middle value when numbers are sorted. The median is less affected by extreme outliers than the mean.' },
    { question: 'What is standard deviation?', answer: 'Standard deviation measures how spread out the numbers are from the mean. A low SD means values are close to the mean; a high SD means values are spread widely.' },
    { question: 'What are Q1, Q2, Q3 and IQR?', answer: 'Q1, Q2, Q3 are the first, second (median), and third quartiles — the values that divide the sorted dataset into four equal quarters. IQR (Interquartile Range) = Q3 − Q1, representing the spread of the middle 50% of data.' },
  ],
  howToSteps: [
    'Enter your numbers in the text area, separated by commas, spaces, or new lines.',
    'All 14 statistics are calculated and displayed instantly.',
    'View the sorted list and frequency table below the stats grid.',
    'Use the Copy button to copy all statistics as formatted text.',
  ],
  relatedToolSlugs: ['average-calculator', 'percentage-calculator', 'scientific-calculator', 'permutation-combination'],
  icon: 'BarChart',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'speed-distance-time',
  name: 'Speed Distance Time Calculator',
  shortDescription: 'Calculate speed, distance, or time — enter any two values and the third is computed automatically. Multiple unit support.',
  longDescription: `<p>The <strong>Speed Distance Time Calculator</strong> solves for any one of the three variables when the other two are known. Enter speed and time to find distance, distance and time to find speed, or speed and distance to find time. Supports multiple units for each variable.</p>
<h2>The Formula</h2>
<p>The relationship between speed, distance, and time follows three simple formulas: Distance = Speed × Time, Speed = Distance ÷ Time, Time = Distance ÷ Speed. This calculator handles unit conversions automatically, so you can mix and match units freely.</p>
<h2>Supported Units</h2>
<p><strong>Speed:</strong> km/h, m/s, mph, knots. <strong>Distance:</strong> kilometres, metres, miles, nautical miles. <strong>Time:</strong> seconds, minutes, hours, days.</p>`,
  category: 'calculators',
  targetKeyword: 'speed distance time calculator',
  secondaryKeywords: ['how long will it take to travel calculator', 'distance calculator time speed', 'velocity calculator', 'travel time calculator'],
  metaTitle: 'Speed Distance Time Calculator — Solve for Any Variable',
  metaDescription: 'Calculate speed, distance, or time by entering any two values. Supports km/h, mph, m/s, knots, km, miles. Free online speed distance time solver.',
  faqs: [
    { question: 'How do I calculate travel time?', answer: 'Time = Distance ÷ Speed. For example, a 300km journey at 60km/h takes 300÷60 = 5 hours. Enter the distance and speed in this calculator and it calculates time automatically.' },
    { question: 'How do I convert km/h to m/s?', answer: 'Divide by 3.6. So 90 km/h = 90÷3.6 = 25 m/s. The calculator handles this conversion automatically when you select different units.' },
    { question: 'What is a knot in speed?', answer: 'A knot is one nautical mile per hour = 1.852 km/h. It is the standard speed unit in aviation and maritime navigation.' },
  ],
  howToSteps: [
    'Enter values for any two of the three fields: Speed, Distance, or Time.',
    'Select the appropriate unit for each field.',
    'The third field calculates automatically.',
    'View the formula used below the calculator.',
    'Try the quick example presets for common scenarios.',
  ],
  relatedToolSlugs: ['unit-converter', 'scientific-calculator', 'fuel-cost-calculator', 'statistics-calculator'],
  icon: 'Gauge',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'scientific-notation-converter',
  name: 'Scientific Notation Converter',
  shortDescription: 'Convert numbers to scientific notation, E-notation, and engineering notation. Bidirectional with adjustable significant figures.',
  longDescription: `<p>The <strong>Scientific Notation Converter</strong> converts numbers between standard decimal form and scientific notation (also called standard form). It supports scientific notation (4.5 × 10⁻⁵), E-notation (4.5e-5), and engineering notation (45 × 10⁻⁶), and allows you to set the number of significant figures.</p>
<h2>Scientific vs Engineering Notation</h2>
<p><strong>Scientific notation</strong> uses a coefficient between 1 and 10 multiplied by a power of 10: 4.5 × 10⁻⁵. <strong>Engineering notation</strong> uses a coefficient between 1 and 1000 with the exponent always a multiple of 3: 45 × 10⁻⁶. Engineering notation aligns with SI prefixes (μ, m, k, M, G).</p>
<h2>Use Cases</h2>
<p>Scientific notation is used in physics, chemistry, astronomy, and engineering to express very large numbers (speed of light: 3 × 10⁸ m/s) or very small numbers (electron mass: 9.11 × 10⁻³¹ kg) compactly without long strings of zeros.</p>`,
  category: 'converters',
  targetKeyword: 'scientific notation converter',
  secondaryKeywords: ['standard form calculator', 'convert to scientific notation', 'E notation converter', 'engineering notation calculator'],
  metaTitle: 'Scientific Notation Converter — Standard Form Calculator Online',
  metaDescription: 'Convert numbers to scientific notation, E-notation, and engineering notation. Bidirectional, adjustable significant figures. Free standard form calculator.',
  faqs: [
    { question: 'How do you convert a number to scientific notation?', answer: 'Move the decimal point until you have a number between 1 and 10, then multiply by 10 to the power of how many places you moved. For 0.000045: move decimal 5 places right → 4.5 × 10⁻⁵.' },
    { question: 'What is the difference between scientific and engineering notation?', answer: 'Scientific notation has the exponent as any integer (4.5 × 10⁻⁵). Engineering notation restricts the exponent to multiples of 3 (45 × 10⁻⁶), which aligns with SI prefixes like micro (10⁻⁶), milli (10⁻³), kilo (10³).' },
    { question: 'What does "e" mean in calculator notation?', answer: 'E-notation (4.5e-5) means 4.5 × 10⁻⁵. The "e" stands for "exponent" and is used in calculators and programming languages because superscript formatting is not always available.' },
  ],
  howToSteps: [
    'Select "Standard to Scientific" tab and enter any decimal number (e.g. 0.000045 or 299792458).',
    'Or select "Scientific to Standard" tab and enter scientific notation (e.g. 4.5e-5 or 4.5×10^-5).',
    'Adjust significant figures (1–10) using the selector.',
    'View results in all three formats: scientific, E-notation, and engineering notation.',
    'Copy any result with the Copy button.',
  ],
  relatedToolSlugs: ['roman-numeral-converter', 'binary-hex-octal-converter', 'unit-converter', 'scientific-calculator'],
  icon: 'Superscript',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'permutation-combination',
  name: 'Permutation & Combination Calculator',
  shortDescription: 'Calculate nPr (permutations), nCr (combinations), and n! (factorial) with step-by-step working.',
  longDescription: `<p>The <strong>Permutation and Combination Calculator</strong> computes nPr (permutations), nCr (combinations), and factorial (n!) simultaneously, with a clear step-by-step breakdown of each calculation. Essential for probability, statistics, and combinatorics problems.</p>
<h2>Permutations vs Combinations</h2>
<p><strong>Permutations (nPr)</strong>: Order matters. How many ways can you arrange r items from n? Formula: n! ÷ (n−r)!. Example: How many ways can 3 people finish 1st, 2nd, 3rd in a race of 10? = 10P3 = 720.</p>
<p><strong>Combinations (nCr)</strong>: Order doesn't matter. How many ways can you choose r items from n? Formula: n! ÷ (r! × (n−r)!). Example: How many 3-person committees from 10 people? = 10C3 = 120.</p>
<h2>Factorial Calculator</h2>
<p>The separate factorial calculator handles values from 0 to 10,000 using logarithm approximations for very large numbers, with exact BigInt results for n ≤ 20.</p>`,
  category: 'calculators',
  targetKeyword: 'permutation calculator',
  secondaryKeywords: ['combination calculator nCr', 'nPr nCr calculator', 'factorial calculator', 'combinatorics calculator'],
  metaTitle: 'Permutation & Combination Calculator — nPr, nCr, Factorial',
  metaDescription: 'Calculate nPr (permutations), nCr (combinations), and n! (factorial) with step-by-step working. Free online permutation and combination calculator.',
  faqs: [
    { question: 'What is the difference between permutation and combination?', answer: 'Permutation (nPr): order matters — selecting and arranging. Combination (nCr): order doesn\'t matter — just selecting. Choosing 3 from 10 people for specific roles (President, VP, Secretary) is a permutation. Choosing a 3-person committee is a combination.' },
    { question: 'What is nCr formula?', answer: 'nCr = n! ÷ (r! × (n−r)!). For 10C3: 10! ÷ (3! × 7!) = 3,628,800 ÷ (6 × 5040) = 3,628,800 ÷ 30,240 = 120.' },
    { question: 'What is 0! (zero factorial)?', answer: '0! = 1, by mathematical convention. This is necessary for the combination formula to work correctly when r = n (nCn = 1) or r = 0 (nC0 = 1).' },
  ],
  howToSteps: [
    'Enter n (total items) and r (items to choose/arrange).',
    'View nPr, nCr, and n! calculated simultaneously.',
    'Read the step-by-step working below for each calculation.',
    'Use the separate Factorial Calculator section for computing n! alone.',
  ],
  relatedToolSlugs: ['statistics-calculator', 'scientific-calculator', 'percentage-calculator', 'average-calculator'],
  icon: 'Shuffle',
  isNew: true,
  estimatedTime: 'Instant',
});

tools.push({
  slug: 'matrix-calculator',
  name: 'Matrix Calculator',
  shortDescription: 'Add, subtract, multiply matrices. Calculate determinant, transpose, and inverse for 2×2 and 3×3 matrices with step-by-step working.',
  longDescription: `<p>The <strong>Matrix Calculator</strong> performs common matrix operations on 2×2 and 3×3 matrices: addition, subtraction, multiplication, determinant, transpose, and inverse. Each operation includes a step-by-step explanation of the calculation.</p>
<h2>Supported Operations</h2>
<p><strong>Add/Subtract</strong>: Element-wise addition or subtraction of two matrices of the same size. <strong>Multiply</strong>: Standard matrix multiplication (dot product). <strong>Determinant</strong>: Scalar value det(A) — 2×2 uses ad−bc; 3×3 uses cofactor expansion along the first row. <strong>Transpose</strong>: Flip rows and columns. <strong>Inverse</strong>: For 2×2 matrices, (1/det) × [[d,−b],[−c,a]].</p>
<h2>When is a Matrix Invertible?</h2>
<p>A matrix is invertible (non-singular) only if its determinant is non-zero. If det = 0, the matrix is singular and has no inverse — the calculator will show an appropriate message.</p>`,
  category: 'calculators',
  targetKeyword: 'matrix calculator',
  secondaryKeywords: ['2x2 matrix calculator', 'matrix multiplication calculator', 'determinant calculator', 'matrix inverse calculator'],
  metaTitle: 'Matrix Calculator — Add, Multiply, Determinant, Inverse Online',
  metaDescription: 'Calculate matrix addition, subtraction, multiplication, determinant, transpose, and inverse for 2×2 and 3×3 matrices with step-by-step working.',
  faqs: [
    { question: 'How do you multiply two matrices?', answer: 'Matrix multiplication (not element-wise): each element of the result matrix is the dot product of a row from the first matrix and a column from the second. For 2×2: C[i][j] = A[i][0]×B[0][j] + A[i][1]×B[1][j].' },
    { question: 'How do you find the determinant of a 2×2 matrix?', answer: 'For a 2×2 matrix [[a,b],[c,d]], the determinant = ad − bc. For example, det([[3,2],[1,4]]) = 3×4 − 2×1 = 12 − 2 = 10.' },
    { question: 'What does it mean if a matrix has no inverse?', answer: 'A matrix with determinant = 0 is called singular and has no inverse. This means the matrix equations it represents have either no solution or infinitely many solutions.' },
  ],
  howToSteps: [
    'Select the matrix size (2×2 or 3×3).',
    'Select the operation you want to perform.',
    'Enter values into Matrix A (and Matrix B for add/subtract/multiply).',
    'The result appears instantly in the result grid.',
    'Read the step-by-step calculation below the result.',
  ],
  relatedToolSlugs: ['statistics-calculator', 'scientific-calculator', 'permutation-combination', 'speed-distance-time'],
  icon: 'Grid3x3',
  isNew: true,
  estimatedTime: 'Instant',
});

// ─── IMAGE FLIP & ROTATE ─────────────────────────────────────────────────────
tools.push({
  slug: 'image-flip-rotate',
  name: 'Image Flip & Rotate',
  shortDescription: 'Flip images horizontally or vertically, rotate by 90°/180°/270° or any custom angle. Batch support, instant preview.',
  longDescription: `<p>Flip, mirror, and rotate any image instantly with our free online <strong>image flip and rotate tool</strong>. Whether you need to fix a photo taken upside down, create a mirror reflection, or rotate an image to the perfect angle, this tool handles it all — 100% in your browser with zero uploads.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Flip Horizontal & Vertical</strong>: Create perfect mirror images in one click — ideal for logos, product photos, and social media graphics.</li>
<li><strong>Rotate 90°, 180°, 270°</strong>: Fix portrait/landscape orientation instantly.</li>
<li><strong>Custom Angle Slider</strong>: Rotate to any angle from -180° to +180° with a smooth precision slider.</li>
<li><strong>Batch Processing</strong>: Upload multiple images and apply the same transformation to all at once.</li>
<li><strong>Transparency Support</strong>: Checkerboard preview shows transparent areas on PNG output.</li>
<li><strong>No Quality Loss</strong>: Canvas-based rendering preserves original image quality.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Photographers fixing camera orientation, designers creating mirror/reflection effects, social media managers preparing properly oriented graphics, and developers needing quick image transforms without installing software.</p>
<h2>Privacy & Security</h2>
<p>Runs 100% in your browser using the HTML5 Canvas API — your images are never uploaded to any server. No watermarks added.</p>`,
  category: 'image-tools',
  targetKeyword: 'flip image online',
  secondaryKeywords: ['rotate image online', 'flip photo online', 'mirror image online', 'flip image horizontally', 'flip image vertically', 'rotate image 90 degrees', 'image rotator online', 'flip picture online free', 'rotate photo free', 'mirror photo online', 'image flipper', 'turn image upside down'],
  metaTitle: 'Flip & Rotate Image Online Free — Mirror, 90°/180° or Custom Angle',
  metaDescription: 'Flip images horizontally or vertically, rotate 90°/180°/270° or any custom angle online. Batch support, instant preview, no upload, no watermark. Free.',
  faqs: [
    { question: 'What is the difference between flip and rotate?', answer: 'Flipping creates a mirror image — Flip Horizontal reverses left-right (like a mirror), Flip Vertical reverses top-bottom (upside down mirror). Rotating turns the image by a set number of degrees (90°, 180°, etc.) while keeping the same content orientation.' },
    { question: 'Can I flip and rotate at the same time?', answer: 'Yes. You can combine any flip (horizontal, vertical, or both) with any rotation angle. The transforms are applied together in a single step.' },
    { question: 'What output format is used?', answer: 'All output images are saved as PNG to preserve quality and support transparency. This is ideal for images with transparent backgrounds.' },
    { question: 'Does rotating to a custom angle add white or transparent borders?', answer: 'When rotating to a non-90° angle, the canvas size expands to fit the rotated image, and corners are transparent (saved as PNG with alpha channel).' },
    { question: 'How many images can I process at once?', answer: 'You can upload and process multiple images in one batch. All images receive the same flip and rotation settings. Download them individually or all at once.' },
  ],
  howToSteps: [
    'Choose your flip and/or rotation settings using the control buttons.',
    'Use the custom angle slider for precise rotation between -180° and +180°.',
    'Upload one or more images by dragging them onto the upload area.',
    'Preview the transformed result instantly.',
    'Click "Download" to save each image, or "Download All" for batch downloads.',
  ],
  relatedToolSlugs: ['image-compressor', 'image-resizer', 'image-cropper', 'image-watermark', 'png-to-jpg'],
  icon: 'RotateCw',
  isNew: true,
  isPopular: true,
  estimatedTime: 'Instant',
});

// ─── READING TIME CALCULATOR ─────────────────────────────────────────────────
tools.push({
  slug: 'reading-time-calculator',
  name: 'Reading Time Calculator',
  shortDescription: 'Calculate reading time for any text. Adjustable WPM, speaking time, readability score, paragraph breakdown, and keyword frequency.',
  longDescription: `<p>Accurately calculate the <strong>reading time</strong> for any article, blog post, essay, speech, or document. Paste your text and instantly see reading time for different reader profiles, speaking time for presentations, and a full Flesch readability score.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Adjustable Reading Speed</strong>: Set your personal WPM from 80 to 700. Average adult reads at 238 WPM.</li>
<li><strong>4 Reader Profiles</strong>: See estimated time for Slow (150 WPM), Average (238 WPM), Fast (350 WPM), and Speed Reader (600 WPM) — all at once.</li>
<li><strong>Speaking & Audiobook Time</strong>: Perfect for speech writers, podcasters, and presenters.</li>
<li><strong>Flesch Readability Score</strong>: Instantly know if your text is Too Complex, Standard, or Very Easy to read.</li>
<li><strong>Paragraph Breakdown</strong>: See word count and reading time for each individual paragraph.</li>
<li><strong>Top Keywords</strong>: Automatic keyword frequency analysis (stop-words removed).</li>
<li><strong>Live Stats</strong>: Words, characters, sentences, paragraphs update in real-time.</li>
</ul>
<h2>Who Is This For?</h2>
<p>Bloggers checking estimated reading time before publishing, teachers calculating student reading loads, public speakers timing their speeches, SEO writers targeting article length, and students estimating how long to study a text.</p>
<h2>Privacy & Security</h2>
<p>All processing is done locally in your browser — your text is never sent to any server.</p>`,
  category: 'text-tools',
  targetKeyword: 'reading time calculator',
  secondaryKeywords: ['reading time estimator', 'how long to read', 'calculate reading time', 'words per minute calculator', 'article reading time', 'blog reading time', 'speech time calculator', 'reading speed calculator', 'wpm calculator', 'text reading time', 'minutes to read calculator', 'flesch reading score'],
  metaTitle: 'Reading Time Calculator — Estimate Article & Speech Time Free',
  metaDescription: 'Calculate reading time for any text instantly. Set your WPM, see 4 reader profiles, speaking time, Flesch readability score & paragraph breakdown. Free.',
  faqs: [
    { question: 'How is reading time calculated?', answer: 'Reading time = Total word count ÷ Words Per Minute (WPM). The average adult reads at 238 WPM silently. Speaking time uses 130 WPM. Audiobook narration averages 150 WPM. You can set your own custom WPM using the slider.' },
    { question: 'What is a good reading speed?', answer: 'The average adult reads 200-250 WPM silently. Slow readers average 100-150 WPM. Fast/efficient readers average 300-400 WPM. Speed readers using techniques like skimming can reach 600+ WPM, though comprehension often decreases above 400 WPM.' },
    { question: 'What is the Flesch Reading Ease score?', answer: 'The Flesch Reading Ease score (0-100) measures how easy a text is to read. 90-100 = Very Easy (5th grade). 60-70 = Standard (8th-9th grade). 0-30 = Very Difficult (college graduate). Most web content should aim for 60-70.' },
    { question: 'How long should a blog post be to rank on Google?', answer: 'Most top-ranking blog posts are 1,500-2,500 words (~6-10 minutes reading time). However, quality and relevance matter more than length. For technical topics, 2,000-4,000 words is common. For news, 300-600 words works fine.' },
    { question: 'How long should a speech be for different times?', answer: 'A 5-minute speech needs ~650 words (at 130 WPM). 10 minutes = ~1,300 words. 20 minutes = ~2,600 words. A 1-hour keynote = ~7,800 words.' },
  ],
  howToSteps: [
    'Paste your text into the text area at the bottom of the tool.',
    'Adjust the "Your Reading Speed" slider to match your personal WPM.',
    'See real-time reading time, speaking time, and audiobook time.',
    'Check the Flesch readability score and paragraph-by-paragraph breakdown.',
    'Expand "Top Keywords" to see the most frequent meaningful words.',
  ],
  relatedToolSlugs: ['word-counter', 'character-counter', 'paraphrasing-tool', 'essay-counter-readability', 'text-to-speech'],
  icon: 'Clock',
  isNew: true,
  isPopular: true,
  estimatedTime: 'Instant',
});

// ─── PHOTO EFFECTS EDITOR ────────────────────────────────────────────────────
tools.push({
  slug: 'photo-effects-editor',
  name: 'Photo Effects Editor',
  shortDescription: 'Apply 12 artistic photo effects: Pencil Sketch, Sepia, Vintage, Grayscale, Emboss, Posterize, Vignette, Sharpen & more. Free, no signup.',
  longDescription: `<p>Transform your photos with 12 stunning artistic effects using our free online <strong>photo effects editor</strong>. Apply pencil sketch, vintage film, sepia tone, vignette, posterize, and more — all processed instantly in your browser with no uploads and no watermarks.</p>
<h2>Available Effects</h2>
<ul>
<li><strong>Pencil Sketch</strong>: Converts your photo into a realistic hand-drawn pencil sketch using color dodge blending.</li>
<li><strong>Sepia</strong>: Classic warm brownish-tone effect that makes photos look aged and nostalgic.</li>
<li><strong>Vintage</strong>: Faded retro film look with reduced saturation and warm highlights.</li>
<li><strong>Grayscale</strong>: Classic black & white conversion using luminance-weighted averaging.</li>
<li><strong>Warm / Cool</strong>: Adjust the color temperature to give photos a warm golden or cool blue tone.</li>
<li><strong>Negative</strong>: Inverts all colors for a striking photographic negative look.</li>
<li><strong>Emboss</strong>: Creates a 3D relief texture effect that makes photos look like raised metal.</li>
<li><strong>Posterize</strong>: Reduces colors to a limited palette for a pop-art poster style.</li>
<li><strong>Vignette</strong>: Darkens edges to draw focus to the center of the image.</li>
<li><strong>Sharpen</strong>: Enhances edges and fine details for a crisper, more defined look.</li>
</ul>
<h2>Key Features</h2>
<ul>
<li><strong>Intensity Slider</strong>: Blend any effect from subtle to full strength.</li>
<li><strong>Real-Time Preview</strong>: See the effect applied instantly as you select it.</li>
<li><strong>No Watermarks</strong>: Download clean, watermark-free PNG files.</li>
<li><strong>Privacy First</strong>: All processing runs locally — photos never leave your device.</li>
</ul>`,
  category: 'image-tools',
  targetKeyword: 'photo effects editor online',
  secondaryKeywords: ['photo filter online', 'pencil sketch effect online', 'vintage photo effect', 'sepia photo online', 'photo to sketch', 'image filter online free', 'artistic photo effects', 'photo effect maker', 'old photo effect online', 'grayscale photo converter', 'vignette effect online', 'photo cartoon effect free'],
  metaTitle: 'Photo Effects Editor Online — 12 Artistic Filters Free, No Signup',
  metaDescription: 'Apply 12 photo effects online: Pencil Sketch, Sepia, Vintage, Grayscale, Emboss, Vignette & more. Intensity slider, instant preview, no watermark, 100% private.',
  faqs: [
    { question: 'How does the Pencil Sketch effect work?', answer: 'The sketch effect uses a technique called color dodge blending. First, the image is converted to grayscale. Then a blurred version of the inverted grayscale is created. These two layers are blended using color dodge math (base × 256 / (256 - blend)), which creates the characteristic pencil-stroke look.' },
    { question: 'Can I adjust the strength of each effect?', answer: 'Yes. The Intensity slider (10%–100%) blends between the original image and the full effect. At 50%, you get a subtle version; at 100%, you get the maximum effect strength. The slider is available for all effects except Original.' },
    { question: 'What image formats are supported?', answer: 'You can upload JPEG, PNG, WebP, and GIF files. The output is always saved as a PNG file to preserve any transparency and maintain maximum quality.' },
    { question: 'Will my photo be uploaded to a server?', answer: 'No. All effects are applied using the HTML5 Canvas API and JavaScript pixel manipulation. Your photo never leaves your device — no server, no uploads, no cloud storage.' },
    { question: 'What is the maximum image size?', answer: 'Images up to 20MB can be processed. Internally, images larger than 1600px on either dimension are scaled down for faster processing while maintaining visual quality.' },
  ],
  howToSteps: [
    'Upload your photo by dragging it onto the upload area or clicking to browse.',
    'Click any of the 12 effect buttons to apply it instantly.',
    'Use the Intensity slider to adjust the effect strength from subtle to full.',
    'Preview the result in the large canvas below the effect buttons.',
    'Click "Download PNG" to save your edited photo — no watermark.',
  ],
  relatedToolSlugs: ['image-compressor', 'image-background-remover', 'image-resizer', 'image-cropper', 'image-watermark'],
  icon: 'Wand2',
  isNew: true,
  isPopular: true,
  estimatedTime: '< 5 seconds',
});

// ─── WORD TO PDF ─────────────────────────────────────────────────────────────
tools.push({
  slug: 'word-to-pdf',
  name: 'Word to PDF Converter',
  shortDescription: 'Convert .docx Word files to PDF online. Preserves headings, bold, italic, lists. Choose page size, margins, font size. Free, no signup.',
  longDescription: `<p>Convert Microsoft Word documents (.docx) to professional PDF files instantly with our free online <strong>Word to PDF converter</strong>. No software to install, no sign-up required — your document is processed entirely in your browser for complete privacy.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Preserves Formatting</strong>: Headings (H1, H2, H3), bold text, italic text, bullet lists, and numbered lists are all converted accurately.</li>
<li><strong>Page Size Options</strong>: Choose A4 (international standard), US Letter (8.5×11 in), or US Legal (8.5×14 in).</li>
<li><strong>Margin Control</strong>: Narrow (0.5 in), Normal (1 in), or Wide (1.5 in) margins.</li>
<li><strong>Font Size Slider</strong>: Adjust base font size from 8pt to 18pt to control text density.</li>
<li><strong>Line Spacing</strong>: From single (1.0×) to double (2.5×) spacing.</li>
<li><strong>Instant Conversion</strong>: Processing happens in seconds, entirely client-side.</li>
<li><strong>No File Size Limit</strong>: Handles standard business documents of any page count.</li>
</ul>
<h2>What Is Converted</h2>
<p>Headings, paragraphs, bold/italic text, bullet and numbered lists. Complex elements like tables and embedded images are converted to their text representation.</p>
<h2>Privacy & Security</h2>
<p>Your document is never uploaded to any server. All conversion happens locally using mammoth.js and pdf-lib — 100% private.</p>`,
  category: 'pdf-tools',
  targetKeyword: 'word to pdf converter',
  secondaryKeywords: ['docx to pdf', 'convert word to pdf online', 'word to pdf free', 'doc to pdf converter', 'word document to pdf', 'word to pdf no signup', 'convert docx to pdf free', 'microsoft word to pdf', 'word file to pdf', 'online word to pdf converter free', 'word to pdf converter without watermark'],
  metaTitle: 'Word to PDF Converter — Convert .docx to PDF Free Online',
  metaDescription: 'Convert Word documents (.docx) to PDF online. Preserves headings, bold, italic & lists. Choose A4/Letter, margins & font size. Free, no signup, 100% private.',
  faqs: [
    { question: 'What Word formats are supported?', answer: 'The tool supports .docx files (Microsoft Word 2007 and later). Legacy .doc files (Word 97-2003) are not supported. If you have a .doc file, first open it in Word or LibreOffice and save as .docx.' },
    { question: 'Is my document kept private?', answer: 'Yes, 100%. The conversion runs entirely in your browser using JavaScript (mammoth.js + pdf-lib). Your file is never uploaded to any server, and no data is stored anywhere.' },
    { question: 'Does it preserve formatting like bold and headings?', answer: 'Yes. The converter preserves: Headings (H1-H3 with appropriate font sizes), bold text, italic text, bullet lists, and numbered lists. Complex elements like tables, images, headers/footers, and text boxes are simplified to text.' },
    { question: 'What is the difference between A4 and US Letter?', answer: 'A4 (210×297mm) is the standard paper size used internationally. US Letter (8.5×11 inches = 216×279mm) is the standard in the United States and Canada. A4 is slightly taller and narrower than Letter.' },
    { question: 'Can I convert multiple Word files at once?', answer: 'Currently the tool converts one file at a time. For each conversion, you can adjust page size, margins, font size, and line spacing independently.' },
  ],
  howToSteps: [
    'Select your page size (A4, Letter, or Legal) and margins in the settings panel.',
    'Adjust font size and line spacing to your preference.',
    'Drag and drop your .docx file onto the upload area, or click to browse.',
    'The conversion runs automatically — see the page count and file size when done.',
    'Click "Download PDF" to save your converted document.',
  ],
  relatedToolSlugs: ['pdf-to-word', 'pdf-compress', 'pdf-merge', 'pdf-split', 'jpg-to-pdf'],
  icon: 'FileOutput',
  isNew: true,
  isPopular: true,
  estimatedTime: '5-15 seconds',
});

// ─── PDF TO EXCEL ────────────────────────────────────────────────────────────
tools.push({
  slug: 'pdf-to-excel',
  name: 'PDF to Excel Converter',
  shortDescription: 'Extract text and tables from PDF files and export to Excel (.xlsx) or CSV. Multi-column detection, page-by-page preview. Free, no upload.',
  longDescription: `<p>Extract data from PDF files and convert it to editable Excel spreadsheets or CSV files with our free online <strong>PDF to Excel converter</strong>. Perfect for extracting data from reports, invoices, financial statements, and data tables.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Smart Column Detection</strong>: Automatically detects multi-column layouts and preserves column alignment in the output spreadsheet.</li>
<li><strong>Page-by-Page Preview</strong>: Preview extracted data for each page before exporting to verify accuracy.</li>
<li><strong>Export to Excel (.xlsx)</strong>: Creates properly formatted spreadsheets with page tabs, column widths, and a summary sheet for multi-page PDFs.</li>
<li><strong>Export to CSV</strong>: Universal format compatible with any spreadsheet application including Google Sheets.</li>
<li><strong>Export Both Formats</strong>: Download .xlsx and .csv simultaneously in one click.</li>
<li><strong>Multi-Page PDFs</strong>: Handles PDFs with up to 100+ pages, with each page as a separate sheet.</li>
<li><strong>No Upload Required</strong>: All text extraction happens in your browser using PDF.js.</li>
</ul>
<h2>Best For</h2>
<p>Bank statements, financial reports, invoices, price lists, and any text-based PDF containing tabular data. Works on text-based PDFs (not scanned image PDFs).</p>
<h2>Privacy & Security</h2>
<p>Your PDF is processed entirely in your browser — never uploaded to any server. No account required.</p>`,
  category: 'pdf-tools',
  targetKeyword: 'pdf to excel converter',
  secondaryKeywords: ['pdf to xlsx', 'convert pdf to excel online', 'pdf to spreadsheet', 'extract table from pdf', 'pdf table to excel', 'pdf to csv converter', 'pdf data extraction', 'pdf to excel free', 'convert pdf table to excel online free', 'extract data from pdf', 'pdf to google sheets', 'bank statement pdf to excel'],
  metaTitle: 'PDF to Excel Converter — Extract PDF Tables to .xlsx Free Online',
  metaDescription: 'Convert PDF to Excel (.xlsx) or CSV online. Smart column detection, page preview, multi-page support. Extract tables from PDF free, no upload, no signup.',
  faqs: [
    { question: 'What types of PDFs work best?', answer: 'Text-based PDFs work best — these are PDFs where the text was generated digitally (from Word, Excel, or a report tool). Scanned PDFs (photos of documents) contain images, not text, and require OCR to extract. Our tool will show no content for image-only PDFs.' },
    { question: 'How does column detection work?', answer: 'The tool analyzes the X-position (horizontal placement) of each text item on the page. Items at similar X positions are grouped into the same column. This works well for simple two or three-column layouts. Very complex tables with merged cells may not align perfectly.' },
    { question: 'What is the Excel output structure?', answer: 'For single-page PDFs: one sheet with rows matching the PDF content. For multi-page PDFs: a Summary sheet showing page previews, plus one sheet per page (up to 10 pages). Each sheet is named "Page 1", "Page 2", etc.' },
    { question: 'Can I open the CSV in Google Sheets?', answer: 'Yes. Download the CSV file, then in Google Sheets go to File → Import → Upload and select the CSV file. The data will import into columns and rows matching the PDF structure.' },
    { question: 'Why does the extracted data look scrambled?', answer: 'PDFs with complex multi-column layouts, rotated text, or tables with merged cells may not extract perfectly. Try switching to single-page PDFs or extracting specific page ranges. For complex tables, manual cleanup in Excel after export is sometimes needed.' },
  ],
  howToSteps: [
    'Upload your PDF file by dragging it onto the upload area.',
    'Wait for the extraction to complete — you will see the row count per page.',
    'Use the page selector to preview extracted data for each page.',
    'Choose your export format: Excel (.xlsx), CSV, or both.',
    'Click the Export button to download your spreadsheet file.',
  ],
  relatedToolSlugs: ['pdf-to-word', 'pdf-merge', 'pdf-compress', 'pdf-split', 'csv-to-pdf'],
  icon: 'FileSpreadsheet',
  isNew: true,
  isPopular: true,
  estimatedTime: '10-30 seconds',
});

tools.push({
  slug: 'excel-to-pdf',
  name: 'Excel to PDF Converter',
  shortDescription: 'Convert Excel spreadsheets (.xlsx, .xls, .csv) to PDF files instantly — free, offline, no upload.',
  longDescription: `<p>Convert your <strong>Excel spreadsheets to PDF</strong> format directly in your browser — no file upload to any server, completely private and free.</p><h2>Why Convert Excel to PDF?</h2><p>PDF format preserves your spreadsheet layout across all devices and operating systems. Share financial reports, invoices, data tables, and business documents as professional PDFs that anyone can open without Excel installed.</p><h2>Features</h2><ul><li>Supports .xlsx, .xls, and .csv files</li><li>Multiple sheet support — select and convert any sheet</li><li>Preview before converting</li><li>100% client-side — your data never leaves your browser</li><li>Free, no signup, no watermark</li></ul>`,
  category: 'pdf-tools',
  targetKeyword: 'excel to pdf converter',
  secondaryKeywords: ['convert excel to pdf', 'xlsx to pdf', 'spreadsheet to pdf', 'excel to pdf free online', 'csv to pdf'],
  metaTitle: 'Excel to PDF Converter — Free Online, No Upload',
  metaDescription: 'Convert Excel (.xlsx, .xls, .csv) to PDF instantly in your browser. Free, no upload, no signup. Preview and download professional PDFs.',
  faqs: [
    { question: 'Is my Excel file uploaded to a server?', answer: 'No. Everything happens in your browser. Your file never leaves your device.' },
    { question: 'Can I convert .csv files too?', answer: 'Yes. This tool supports .xlsx, .xls, and .csv file formats.' },
    { question: 'Does it preserve formatting?', answer: 'The tool renders your data in a clean table format in the PDF. Complex Excel formatting like charts and conditional formatting may not be preserved.' },
  ],
  howToSteps: [
    'Upload your Excel file (.xlsx, .xls, or .csv)',
    'Preview the spreadsheet and select a sheet if needed',
    'Click Convert to PDF and download the result',
  ],
  relatedToolSlugs: ['pdf-to-excel', 'csv-to-json', 'word-to-pdf'],
  icon: 'FileSpreadsheet',
  isNew: true,
  isPopular: false,
});

tools.push({
  slug: 'html-to-pdf',
  name: 'HTML to PDF Converter',
  shortDescription: 'Convert HTML code or web pages to PDF documents — free, instant, no server upload.',
  longDescription: `<p>Convert <strong>HTML to PDF</strong> directly in your browser. Paste your HTML code or upload an .html file, preview the rendered output, and download a clean PDF — all without any server upload.</p><h2>Why Convert HTML to PDF?</h2><p>Developers, designers, and content creators frequently need to save HTML content as PDF for documentation, invoices, reports, or archiving. This tool renders your HTML faithfully and converts it to a downloadable PDF.</p><h2>Features</h2><ul><li>Paste HTML code or upload .html files</li><li>Live preview of rendered HTML</li><li>Page size options (A4, Letter, Legal)</li><li>Portrait and landscape orientation</li><li>100% client-side — your code stays private</li><li>Free, no signup, no watermark</li></ul>`,
  category: 'pdf-tools',
  targetKeyword: 'html to pdf converter',
  secondaryKeywords: ['convert html to pdf', 'html to pdf online', 'html to pdf free', 'save html as pdf', 'webpage to pdf'],
  metaTitle: 'HTML to PDF Converter — Free Online, No Upload',
  metaDescription: 'Convert HTML code to PDF instantly. Paste HTML or upload a file, preview, and download as PDF. Free, no server upload, works offline.',
  faqs: [
    { question: 'Does it support CSS styling?', answer: 'Yes. Inline styles and embedded <style> blocks are fully rendered. External stylesheets (linked via URL) may not load due to browser security restrictions.' },
    { question: 'Is my HTML code sent to a server?', answer: 'No. Everything is processed in your browser. Your HTML code never leaves your device.' },
    { question: 'Can I convert a live website to PDF?', answer: 'This tool works with HTML code, not URLs. To convert a live page, right-click the page, select "View Page Source", copy the HTML, and paste it here.' },
  ],
  howToSteps: [
    'Paste your HTML code or upload an .html file',
    'Preview the rendered output in the preview pane',
    'Select page size and orientation, then click Convert to PDF',
  ],
  relatedToolSlugs: ['html-to-markdown', 'word-to-pdf', 'markdown-to-html'],
  icon: 'Code',
  isNew: true,
  isPopular: false,
});

tools.push({
  slug: 'mp4-to-mp3',
  name: 'MP4 to Audio Converter',
  shortDescription: 'Extract audio from MP4, WebM, and other video files — free, offline, no upload to server.',
  longDescription: `<p>Extract <strong>audio from video files</strong> directly in your browser. Upload an MP4, WebM, or MOV file and download the audio track — completely offline, no file upload to any server.</p><h2>Why Extract Audio from Video?</h2><p>Convert video lectures to audio for listening on the go, extract music from music videos, pull audio from screen recordings for podcasts, or save audio from any video format. All processing happens in your browser for complete privacy.</p><h2>Features</h2><ul><li>Supports MP4, WebM, MOV, and other video formats</li><li>Preview audio before downloading</li><li>High-quality WAV audio output</li><li>100% client-side — your video never leaves your device</li><li>Free, no signup, no watermark, no file size limits</li></ul>`,
  category: 'converters',
  targetKeyword: 'mp4 to mp3 converter',
  secondaryKeywords: ['extract audio from video', 'video to audio converter', 'mp4 to audio online', 'convert video to mp3 free', 'extract sound from video'],
  metaTitle: 'MP4 to Audio Converter — Extract Audio from Video Free',
  metaDescription: 'Extract audio from MP4, WebM, MOV videos instantly. Free online converter — no upload, works offline. Download high-quality audio from any video.',
  faqs: [
    { question: 'Is my video uploaded to a server?', answer: 'No. All processing happens locally in your browser. Your video file never leaves your device.' },
    { question: 'What audio format is the output?', answer: 'The audio is extracted as high-quality WAV format. WAV is uncompressed and compatible with all devices and audio editors.' },
    { question: 'Is there a file size limit?', answer: 'There is no hard limit, but very large videos (over 500MB) may be slow to process depending on your device.' },
  ],
  howToSteps: [
    'Upload your video file (MP4, WebM, MOV)',
    'Wait for the audio extraction to complete',
    'Preview the audio and click Download to save',
  ],
  relatedToolSlugs: ['text-to-speech', 'speech-to-text', 'audio-trimmer'],
  icon: 'Music',
  isNew: true,
  isPopular: false,
});

tools.push({
  slug: 'markdown-editor',
  name: 'Markdown Editor',
  shortDescription: 'Write and preview markdown in real time — free online editor with toolbar, file upload, and HTML export.',
  longDescription: `<p>Write, edit, and preview <strong>Markdown</strong> in real time with this free online editor. A split-pane layout shows your raw Markdown on the left and a beautifully rendered HTML preview on the right — all running entirely in your browser.</p><h2>Why Use This Markdown Editor?</h2><p>Whether you're drafting a README, writing documentation, or composing blog posts, this editor gives you instant visual feedback. No signup, no server upload, and no distractions — just write.</p><h2>Features</h2><ul><li>Live split-pane preview that updates as you type</li><li>Toolbar buttons for bold, italic, headings, links, images, code, lists, blockquotes, and horizontal rules</li><li>Upload existing .md files and continue editing</li><li>Download your work as a .md file</li><li>Copy the rendered HTML to your clipboard</li><li>Word, character, and line count</li><li>Dark mode support</li><li>Responsive design — works on mobile and desktop</li><li>100% client-side — your content never leaves your device</li></ul>`,
  category: 'developer-tools',
  targetKeyword: 'markdown editor online',
  secondaryKeywords: ['markdown editor', 'markdown preview', 'online markdown editor', 'markdown to html', 'md editor', 'markdown writer', 'live markdown preview', 'free markdown editor'],
  metaTitle: 'Markdown Editor — Free Online Live Preview Editor',
  metaDescription: 'Write and preview Markdown in real time. Free online editor with toolbar, file upload, .md download, and HTML copy. No signup, runs in your browser.',
  faqs: [
    { question: 'Is my content saved or uploaded anywhere?', answer: 'No. Everything runs in your browser. Your markdown content is never sent to any server. If you close the tab, your work is lost — use the Download button to save.' },
    { question: 'Can I upload an existing Markdown file?', answer: 'Yes. Click the Upload button in the toolbar to load any .md or .txt file. The content will appear in the editor instantly.' },
    { question: 'How do I export the rendered HTML?', answer: 'Click the Copy HTML button in the toolbar. The rendered HTML is copied to your clipboard, ready to paste into your website, CMS, or email.' },
    { question: 'Does it support all Markdown syntax?', answer: 'It supports the most common Markdown features: headings, bold, italic, links, images, code blocks, inline code, lists, blockquotes, and horizontal rules. Some extended syntax like tables and footnotes are not yet supported.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. On smaller screens, the editor and preview stack vertically for a comfortable mobile editing experience.' },
  ],
  howToSteps: [
    'Type or paste your Markdown in the editor pane',
    'Use the toolbar buttons to insert formatting quickly',
    'View the live HTML preview on the right (or below on mobile)',
    'Download as .md or copy the rendered HTML when done',
  ],
  relatedToolSlugs: ['markdown-to-html', 'html-to-markdown', 'json-formatter', 'code-formatter', 'word-counter'],
  icon: 'FileCode',
  isNew: true,
  isPopular: false,
});

export const TOOL_COUNT = tools.length;

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter(t => t.category === category);
}

export function getPopularTools(limit = 8): Tool[] {
  return tools.filter(t => t.isPopular).slice(0, limit);
}

export function getNewTools(limit = 6): Tool[] {
  return tools.filter(t => t.isNew).slice(0, limit);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase().trim();
  if (!q) return tools;

  // Split multi-word queries into tokens for better matching
  const tokens = q.split(/\s+/).filter(Boolean);
  const isSingleToken = tokens.length === 1;

  // Word-boundary match for a single term
  const wordMatch = (text: string, term: string) =>
    new RegExp(`(^|\\s|-)${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(text);

  // All tokens must match somewhere in the tool's searchable text
  const allTokensMatch = (t: Tool) => {
    const searchable = [
      t.name, t.slug, t.targetKeyword,
      ...t.secondaryKeywords, t.category, t.shortDescription,
    ].join(' ').toLowerCase();
    return tokens.every(tok => searchable.includes(tok));
  };

  // Tier 0: name starts with query, or slug word-boundary match (highest priority)
  const tier0 = tools.filter(t => {
    const name = t.name.toLowerCase();
    return name.startsWith(q) || wordMatch(name, isSingleToken ? q : tokens[0]) && tokens.every(tok => name.includes(tok));
  });
  const seen0 = new Set(tier0.map(t => t.slug));

  // Tier 1: exact phrase in name/slug, or targetKeyword matches all tokens
  const tier1 = tools.filter(t => {
    if (seen0.has(t.slug)) return false;
    const name = t.name.toLowerCase();
    const slug = t.slug;
    if (isSingleToken) {
      return name.includes(q) || slug.includes(q) || wordMatch(t.targetKeyword, q);
    }
    // Multi-word: name/slug contains full phrase, OR all tokens found across searchable fields
    return name.includes(q) || slug.includes(q.replace(/\s+/g, '-')) || allTokensMatch(t);
  });
  const seen = new Set([...seen0, ...tier1.map(t => t.slug)]);

  // Tier 2: secondary keywords or category match (single token only)
  const tier2 = isSingleToken ? tools.filter(t =>
    !seen.has(t.slug) && (
      t.secondaryKeywords.some(kw => wordMatch(kw, q)) ||
      wordMatch(t.category, q)
    )
  ) : [];

  return [...tier0, ...tier1, ...tier2];
}

export function getRelatedTools(slug: string, limit = 6): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tool.relatedToolSlugs
    .map(s => getToolBySlug(s))
    .filter((t): t is Tool => !!t)
    .slice(0, limit);
}
