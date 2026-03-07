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
    longDescription: `Our free online Word Counter tool gives you instant, accurate counts of words, characters (with and without spaces), sentences, and paragraphs as you type. Whether you're working on an essay, blog post, social media update, or any document with a character limit, this tool has you covered.

The Word Counter also estimates your reading time based on the average adult reading speed of 200 words per minute, and speaking time at 130 words per minute — perfect for preparing speeches, podcasts, or presentations.

Unlike Microsoft Word or Google Docs, our tool works entirely in your browser — no signup, no downloads, no account required. Your text never leaves your device, ensuring 100% privacy. It's fast, free, and works on all devices including smartphones and tablets.`,
    category: 'text-tools',
    targetKeyword: 'word counter',
    secondaryKeywords: ['character counter', 'word count tool', 'online word counter', 'count words online', 'word count checker'],
    metaTitle: 'Word Counter - Free Online Word & Character Count Tool',
    metaDescription: 'Count words, characters, sentences & paragraphs instantly. Free online word counter with reading time estimate. No signup needed. Works in real time.',
    faqs: [
      { question: 'How accurate is the word counter?', answer: 'Our word counter uses the same word-splitting algorithm as most word processors — it counts any sequence of characters separated by spaces or punctuation as a word, giving you results identical to Microsoft Word or Google Docs.' },
      { question: 'Does the word counter save my text?', answer: 'No. Your text is processed entirely in your browser and never sent to any server. Your content is 100% private.' },
      { question: 'What is the character limit?', answer: 'There is no practical limit. The tool handles very large texts (100,000+ words) without performance issues.' },
      { question: 'How is reading time calculated?', answer: 'Reading time is estimated at 200 words per minute, which is the average adult reading speed. Speaking time is calculated at 130 words per minute.' },
      { question: 'Can I use this for social media character limits?', answer: 'Yes! Twitter/X allows 280 characters, Instagram captions up to 2,200, and LinkedIn posts up to 3,000 characters. Use our character count to stay within limits.' },
    ],
    howToSteps: [
      'Paste or type your text into the text box above.',
      'Word, character, sentence, and paragraph counts update instantly in real time.',
      'Check the reading time and speaking time estimates below the counts.',
      'Use the "Clear" button to reset and start fresh.',
      'Copy any count by clicking on the number.',
    ],
    relatedToolSlugs: ['character-counter', 'case-converter', 'lorem-ipsum-generator', 'text-to-slug', 'remove-duplicate-lines'],
    icon: 'AlignLeft',
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'character-counter',
    name: 'Character Counter',
    shortDescription: 'Count characters with and without spaces, words, and lines instantly.',
    longDescription: `The Character Counter tool provides a precise count of every character in your text — including spaces, punctuation, and special characters. This is essential for meeting strict character limits on platforms like Twitter (280), SMS (160), meta descriptions (155), and ad copy.

The tool shows both total characters (with spaces) and characters without spaces, along with word count, line count, and paragraph count. This gives you a complete picture of your content's density and structure.

Everything runs locally in your browser, so your private text — whether it's passwords, confidential documents, or creative writing — never touches a server. It's fast, free, and works offline once the page is loaded.`,
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
    longDescription: `The Case Converter tool lets you instantly transform any text between 8 different letter cases: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case. This is invaluable for developers naming variables, writers fixing copy-pasted text, or anyone who needs to reformat text quickly.

Developers can convert user-facing text to camelCase for JavaScript variables, snake_case for Python, or kebab-case for CSS class names and URL slugs. Writers and editors can quickly fix text that was accidentally typed in all caps, or properly capitalize a title without manually editing each word.

The conversion happens instantly in your browser with zero latency. No data is sent to any server — your text stays private. Works on desktop, tablet, and mobile with no download or account needed.`,
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
    longDescription: `Lorem Ipsum is the de facto placeholder text used in publishing, graphic design, web development, and UI/UX prototyping since the 1500s. Our Lorem Ipsum Generator creates authentic, randomized placeholder text in seconds, perfect for filling in designs before real content is ready.

You can generate by paragraphs (each 3-5 sentences), by sentences, or by a specific word count. The generator uses the classic Cicero-derived Latin text, shuffled to produce unique variations every time, so your placeholder content never looks repetitive.

Whether you're a web designer building a mockup, a developer testing a layout, or a graphic designer creating a brochure template, this tool gives you the placeholder text you need instantly. Generate up to 100 paragraphs at once, copy with one click, and start from the classic "Lorem ipsum dolor sit amet…" or a random starting point.`,
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
    longDescription: `A URL slug is the part of a web address that identifies a specific page in a human-readable format. For example, the slug for this page is "text-to-slug". Clean, descriptive slugs are a crucial on-page SEO factor — they help search engines understand the page topic and improve click-through rates in search results.

Our Text to Slug converter automatically handles all the transformations needed: converts to lowercase, replaces spaces with hyphens, removes special characters and accents, removes stop words (optional), and ensures no double hyphens or leading/trailing hyphens remain.

This tool is essential for bloggers, SEO professionals, developers building CMS systems, and anyone creating web pages who wants clean, readable URLs. WordPress, Shopify, and other CMS platforms use this exact logic for their URL generation.`,
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
    longDescription: `The Remove Duplicate Lines tool quickly cleans up any text by eliminating repeated lines, with options to sort alphabetically, ignore case, trim whitespace, and remove blank lines. This is perfect for cleaning up exported spreadsheet data, email lists, keyword lists, log files, and any text where duplicates need to be eliminated.

Data analysts, SEO professionals managing keyword lists, developers cleaning log outputs, and marketers deduplicating email lists all rely on this type of tool daily. What would take minutes of manual work or complex Excel formulas is done in under a second here.

The tool handles large inputs — paste in thousands of lines and get clean, deduplicated output instantly. No data is sent to a server; all processing happens locally in your browser for complete privacy.`,
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

  // ─── CALCULATORS ──────────────────────────────────────────────────────────
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    shortDescription: 'Calculate your exact age in years, months, days and hours from date of birth.',
    longDescription: `Our Age Calculator gives you your exact age down to the day — no more guessing. Enter your date of birth and today's date, and instantly see your age in years, months, days, hours, minutes, and seconds. You'll also see how many days until your next birthday and what day of the week you were born on.

This tool is used by millions of people for a wide range of purposes: filling out official forms, verifying age eligibility, calculating retirement milestones, preparing for birthdays, or simply satisfying curiosity. It correctly handles leap years, so your birthday calculations are always accurate.

You can also calculate the age of anything — a car, a company, a tree — by entering any two dates. The tool shows the time difference in multiple units simultaneously, making it versatile for any date-based calculation.`,
    category: 'calculators',
    targetKeyword: 'age calculator',
    secondaryKeywords: ['date of birth age calculator', 'calculate my age', 'exact age calculator', 'age from date of birth', 'birthday age calculator'],
    metaTitle: 'Age Calculator - Calculate Your Exact Age Online Free',
    metaDescription: 'Calculate your exact age in years, months, days and hours from your date of birth. Find days until next birthday. Free online age calculator, no signup.',
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
    slug: 'text-diff',
    name: 'Text Diff Checker',
    shortDescription: 'Compare two texts side-by-side and highlight the differences line by line.',
    longDescription: 'Paste two versions of a text and instantly see what was added, removed, or unchanged. Uses a line-level LCS diff algorithm — similar to git diff. Split and unified views. Copy the diff output with one click.',
    category: 'text-tools',
    targetKeyword: 'text diff checker online',
    secondaryKeywords: ['compare two texts', 'text comparison tool', 'find differences in text', 'diff tool online free'],
    metaTitle: 'Text Diff Checker - Compare Two Texts Online Free',
    metaDescription: 'Compare two texts and highlight differences instantly. See added and removed lines with color coding. Split and unified views. Free online diff tool.',
    faqs: [
      { question: 'What algorithm does this use?', answer: 'It uses a Longest Common Subsequence (LCS) algorithm at the line level — the same approach used by git diff.' },
      { question: 'Can I compare code files?', answer: 'Yes! Paste any text including code. The comparison is line-by-line so it works well for code, prose, config files, etc.' },
      { question: 'What do the colors mean?', answer: 'Green lines with + were added (in Modified but not Original). Red lines with − were removed (in Original but not Modified). Unchanged lines are shown without color.' },
      { question: 'Is my text sent to a server?', answer: 'No. All comparison happens in your browser. Your text never leaves your device.' },
      { question: 'Can I copy the diff?', answer: 'Yes. Click "Copy Diff" to copy the unified diff format with + and − prefixes.' },
    ],
    howToSteps: ['Paste the original text in the left panel.', 'Paste the modified text in the right panel.', 'View differences highlighted in the diff result below.', 'Switch between Split and Unified views.', 'Click "Copy Diff" to export the diff.'],
    relatedToolSlugs: ['word-counter', 'case-converter', 'remove-duplicate-lines', 'regex-tester'],
    icon: 'GitCompare',
    estimatedTime: 'Instant',
  },
  {
    slug: 'fancy-text-generator',
    name: 'Fancy Text Generator',
    shortDescription: 'Convert text into cool Unicode fonts for Instagram, Twitter, WhatsApp and more.',
    longDescription: 'Transform any text into 14+ Unicode font styles — bold, italic, monospace, fraktur, script, circled, block letters, strikethrough, underline, wide, tiny caps, upside down, and more. Click any style to instantly copy it and paste anywhere.',
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
    longDescription: 'Generate cryptographically random UUIDs instantly. Choose UUID v4 (fully random), v1-like (time-based prefix), nil UUID (all zeros), or short 12-character IDs. Generate 1–20 at a time. Toggle uppercase, copy individual or all at once.',
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
    longDescription: 'Paste any JSON Web Token and instantly decode its header and payload. See the algorithm, all claims, issued-at and expiry dates, and whether the token is currently valid or expired. Color-coded sections for header, payload, and signature. Useful for debugging auth issues.',
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
    longDescription: 'Enter your bill amount, choose a tip percentage (or custom), and set how many people are splitting. Instantly see the tip amount, total bill, and per-person share. Includes a tipping etiquette guide for different service levels.',
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
    longDescription: 'Design stunning CSS gradients with a live preview. Choose linear, radial, or conic gradient type. Add unlimited color stops, set their positions, and adjust the angle. Includes 6 beautiful presets. Copy the CSS with one click.',
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
    longDescription: `Create eye-catching gradient text with our free CSS Gradient Text Generator. Choose from beautiful presets or create custom gradients using any colors — see the effect live on your custom text. Copy the exact CSS code with one click.

The tool generates standard CSS using background-clip and -webkit-background-clip for maximum browser compatibility. Supports linear gradients in any direction, and works on headings, paragraphs, buttons, and any text element.

Features include 12 beautiful gradient presets (Sunset, Ocean, Neon, Forest, Berry, Fire, Galaxy, Candy, Midnight, Emerald, Peach, Electric), custom color pickers for start and end colors, angle control, font size adjustment, and live preview with your own text. The generated CSS is clean and copy-paste ready.

Perfect for web designers creating hero headings, landing page titles, social media graphics, and any project that needs visually striking text effects.`,
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
    longDescription: 'Design CSS box shadows interactively with a live preview canvas. Control X/Y offset, blur, spread, opacity, and color for each shadow layer. Add multiple shadow layers for complex effects. Includes 6 presets (soft, hard, layered, glow, inset). Copy the CSS instantly.',
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
    longDescription: 'Interactive CSS Flexbox playground with real-time preview. Control flex-direction, justify-content, align-items, flex-wrap, and gap on the container. Customize per-item properties like flex-grow, flex-shrink, flex-basis, align-self, and order. Includes layout presets (Navbar, Card Grid, Holy Grail, Centered, Sidebar). Copy production-ready CSS instantly.',
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
    longDescription: 'Set a countdown timer with quick presets (1 min to 1 hour) or enter a custom hours/minutes/seconds value. A circular progress ring shows time remaining visually. Pause, resume, reset, or add 1 minute on the fly. Works entirely in your browser.',
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
    longDescription: 'Four tools in one: random number generator (set min/max/count), dice roller (D4 to D100, multiple dice), coin flipper (multiple flips with heads/tails count), and random list picker (paste items and pick N randomly). All use cryptographically random or Math.random generation.',
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
    longDescription: 'Analyze any password\'s strength against 7 security criteria including length, character variety, and common patterns. Shows a color-coded strength bar (Very Weak to Very Strong), entropy estimate in bits, character type counts, and detailed checklist. Warns if the password is in the list of most common passwords.',
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
    longDescription: 'Create complete HTML meta tags for any webpage in seconds. Covers Basic SEO (title, description, keywords, robots, canonical), Open Graph (for Facebook/LinkedIn sharing previews), and Twitter Card tags. Live generated code updates as you type. Copy individual sections or all tags at once.',
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
    longDescription: `A full-featured statistics calculator that goes far beyond just finding the average. Enter any list of numbers — separated by commas, spaces, or new lines — and instantly get:

**Central Tendency**: Arithmetic mean, geometric mean, harmonic mean, and mode.
**Spread**: Minimum, maximum, range, variance, and standard deviation (σ).
**Quartiles**: Q1 (25th percentile), Q2 (median), Q3 (75th percentile), and IQR.
**Distribution bar**: Visual bar chart showing relative distribution of each value.

All results update in real-time as you type. Each value has a copy button for easy use. Works with integers, decimals, and large datasets.`,
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
    longDescription: `Percentages are everywhere — discounts, taxes, interest rates, exam scores, statistics — and our Percentage Calculator makes every type of percentage calculation simple and fast. The tool covers all common percentage problems in one place: finding X% of a number, calculating what percentage X is of Y, finding the original number before a percentage increase/decrease, and calculating percentage change between two values.

Students use it for calculating grade percentages and exam scores. Shoppers use it to calculate sale discounts and final prices. Accountants and business owners use it for profit margins, tax calculations, and growth rates. The tool shows step-by-step working for each calculation, so you understand how the result was reached.

All calculations happen instantly in your browser. No ads blocking your results, no popups, no account required. Just fast, accurate percentage math.`,
    category: 'calculators',
    targetKeyword: 'percentage calculator',
    secondaryKeywords: ['percent calculator', 'calculate percentage online', 'percentage change calculator', 'percent increase calculator', 'what percent of calculator'],
    metaTitle: 'Percentage Calculator - Calculate % Online Free',
    metaDescription: 'Calculate percentages, percent change, discount & more. Free online percentage calculator with step-by-step solutions. All percentage types covered.',
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
    longDescription: `Our EMI Calculator helps you plan your loan repayments accurately before you commit to any loan. Enter the principal amount, annual interest rate, and loan tenure — instantly get your monthly EMI, total interest payable, and total amount payable. The tool also generates a complete month-by-month amortization schedule showing how much of each EMI goes toward principal vs. interest.

EMI (Equated Monthly Installment) is the fixed payment made to a lender each month for a specified number of months until the loan is fully paid off. Understanding your EMI breakdown helps you make informed financial decisions, compare loan offers, and plan your monthly budget.

This calculator works for all loan types: home loans, car loans, personal loans, education loans, and business loans. The formula used is the standard banking formula: EMI = [P × R × (1+R)^N] / [(1+R)^N - 1] where P = Principal, R = Monthly interest rate, N = Number of months.`,
    category: 'calculators',
    targetKeyword: 'EMI calculator',
    secondaryKeywords: ['loan EMI calculator', 'home loan EMI calculator', 'car loan calculator', 'personal loan EMI', 'monthly installment calculator India'],
    metaTitle: 'EMI Calculator - Calculate Loan EMI Online Free',
    metaDescription: 'Calculate monthly EMI for home, car or personal loans. See total interest, amortization schedule & pie chart. Free online EMI calculator — instant results.',
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
    longDescription: `India's Goods and Services Tax (GST) has multiple rate slabs — 0%, 5%, 12%, 18%, and 28% — and our GST Calculator makes it easy to calculate GST for any transaction. Whether you need to add GST to a base price or extract the GST from a GST-inclusive price, this tool handles both scenarios.

The calculator shows the breakdown of CGST (Central GST), SGST (State GST) for intra-state transactions, and IGST (Integrated GST) for inter-state transactions. This is essential for business owners, accountants, freelancers, and shoppers who need to understand the tax component of any purchase or sale.

GST calculations are needed when raising invoices, filing GST returns, calculating input tax credits, and verifying bills. Our tool provides clear, accurate calculations instantly, eliminating manual errors in tax computation.`,
    category: 'calculators',
    targetKeyword: 'GST calculator',
    secondaryKeywords: ['GST calculator India', 'GST calculation online', 'CGST SGST calculator', 'GST inclusive exclusive calculator', 'tax calculator India'],
    metaTitle: 'GST Calculator - Calculate GST Online Free | India',
    metaDescription: 'Calculate GST amount, CGST, SGST, IGST for any amount. Add or remove GST from price. Free online GST calculator for India — all GST rates supported.',
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
    longDescription: `BMI (Body Mass Index) is a widely used screening tool that estimates body fat based on your height and weight. Our BMI Calculator gives you an instant BMI score along with your weight category (Underweight, Normal weight, Overweight, or Obese) and a visual indicator on the BMI scale.

The tool supports both metric (kg/cm) and imperial (lbs/ft/in) units, making it accessible for users worldwide. Along with your BMI, you'll see the healthy weight range for your height — showing exactly how many kilograms you'd need to gain or lose to reach the normal BMI range.

BMI is used by healthcare professionals as a quick initial assessment of weight-related health risk. While BMI doesn't directly measure body fat and doesn't account for muscle mass, it's a valuable starting point for understanding your weight status. The World Health Organization (WHO) defines normal BMI as 18.5 to 24.9.`,
    category: 'calculators',
    targetKeyword: 'BMI calculator',
    secondaryKeywords: ['body mass index calculator', 'bmi calculator india', 'bmi calculator kg cm', 'healthy weight calculator', 'overweight calculator'],
    metaTitle: 'BMI Calculator - Calculate Body Mass Index Free Online',
    metaDescription: 'Calculate your BMI instantly. Find if you\'re underweight, normal, overweight, or obese. Supports metric & imperial. Free online BMI calculator — no signup.',
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
    longDescription: `SIP (Systematic Investment Plan) allows you to invest a fixed amount in mutual funds at regular intervals. Our SIP Calculator helps you estimate the future value of your SIP investments, taking into account the power of compound interest and rupee cost averaging.

Enter your monthly investment amount, expected annual returns, and investment duration to see your total invested amount, estimated returns, and final corpus. The calculator uses the standard SIP formula to show you how disciplined investing can grow your wealth significantly over time.

This is an essential planning tool for first-time investors, financial planners, and anyone looking to build long-term wealth through mutual funds in India. Understanding SIP returns helps you set realistic financial goals and choose the right investment amount to meet them.`,
    category: 'calculators',
    targetKeyword: 'SIP calculator',
    secondaryKeywords: ['SIP calculator India', 'mutual fund SIP calculator', 'SIP return calculator', 'systematic investment plan calculator', 'investment calculator India'],
    metaTitle: 'SIP Calculator - Calculate Mutual Fund SIP Returns Online Free',
    metaDescription: 'Calculate SIP returns and future value of mutual fund investments. See wealth growth chart. Free online SIP calculator for India — instant results.',
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
    longDescription: `India's most accurate CTC to In-Hand Salary Calculator for FY 2025-26 (AY 2026-27). Enter your annual CTC and instantly see your monthly take-home salary with a complete breakdown of all salary components — Basic, HRA, Special Allowance, PF, Gratuity, Professional Tax, and Income Tax.

Compare your tax liability under both Old and New Tax Regimes side by side. The calculator automatically recommends which regime saves you more money based on your deductions. Supports all standard Indian salary structures including employer PF (with 15K cap option), gratuity, LTA, and variable pay.

For the Old Tax Regime, enter your deductions under Section 80C (PPF, ELSS, LIC), 80D (health insurance), 80CCD(1B) (NPS), home loan interest (Section 24b), and HRA exemption. The tool calculates your exact taxable income and tax payable under both regimes, including surcharge and 4% health & education cess.

Features include visual salary distribution chart, annual/monthly toggle, quick CTC presets from 3L to 50L, and detailed tax slab reference for both regimes. Updated with the latest Budget 2025 changes — new regime basic exemption at 4L, rebate up to 12L, and 75K standard deduction. Perfect for job offer evaluation, salary negotiation, and annual tax planning.`,
    category: 'calculators',
    targetKeyword: 'CTC to in-hand salary calculator',
    secondaryKeywords: ['salary calculator India', 'CTC calculator', 'take home salary calculator', 'in-hand salary calculator', 'old vs new tax regime calculator', 'salary breakup calculator', 'income tax calculator FY 2025-26', 'CTC to net salary', 'salary after tax India'],
    metaTitle: 'Salary Calculator India - CTC to In-Hand | FY 2025-26',
    metaDescription: 'Calculate in-hand salary from CTC for FY 2025-26. Compare Old vs New Tax Regime, see full salary breakup with PF, HRA, tax. Free instant salary calculator India.',
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
    longDescription: `Our Discount Calculator makes shopping math easy. Enter the original price and the discount percentage, and instantly see the sale price, the rupee amount you save, and verify the savings percentage. Or work backwards — enter the original and sale price to calculate what percentage discount was applied.

This tool is perfect for shoppers comparing deals online, retailers calculating promotional prices, and students studying percentage problems. During sale seasons like Diwali, Big Billion Day, or Black Friday, quickly compare discounts across products to find the best deal.

The calculator also handles stacked discounts (discount on top of discount), which are common in retail. For example, an additional 10% off on an already 20%-discounted item is not the same as 30% off — our tool shows you the correct combined discount.`,
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
    longDescription: `Our JSON Formatter and Validator is an essential tool for any developer working with APIs, configuration files, or data interchange. Paste any JSON string — no matter how minified or messy — and instantly get a beautifully formatted, syntax-highlighted, human-readable output.

The tool validates your JSON as you type, showing clear error messages that identify exactly where the syntax error is (line number and column). This is far faster than hunting through raw JSON manually. You can also minify JSON to remove all whitespace for production use or API payloads, reducing the size of your data.

The tree view mode lets you explore nested JSON objects and arrays visually, collapse/expand nodes, and navigate complex data structures. This is particularly useful when working with deeply nested API responses or complex configuration objects.`,
    category: 'developer-tools',
    targetKeyword: 'JSON formatter',
    secondaryKeywords: ['JSON beautifier', 'JSON validator', 'JSON minifier', 'format JSON online', 'JSON prettifier', 'JSON viewer'],
    metaTitle: 'JSON Formatter & Validator - Format JSON Online Free',
    metaDescription: 'Format, validate, minify & beautify JSON instantly. Syntax highlighting, error detection & tree view. Free online JSON formatter — no signup needed.',
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
    longDescription: `Base64 is a binary-to-text encoding scheme that represents binary data using only printable ASCII characters. Our Base64 tool handles both encoding (text/file → Base64) and decoding (Base64 → text) in a clean, simple interface.

Base64 encoding is used widely in web development: embedding images directly in HTML/CSS, encoding binary data for JSON APIs, email attachments (MIME), HTTP Basic Authentication headers, and storing binary data in text-based formats like XML or JSON. Developers regularly need to encode and decode Base64 strings when debugging APIs or building integrations.

The tool also handles file encoding — upload any file (image, PDF, document) and get its Base64 representation, ready to embed in HTML img tags, CSS background URLs, or JSON payloads. The encoded string is shown with the appropriate data URI prefix for direct use.`,
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
    longDescription: `URL encoding (percent encoding) converts special characters in URLs into a format that can be safely transmitted over the internet. Characters like spaces, &, =, ?, #, and non-ASCII characters must be encoded to avoid breaking URL parsing.

Our URL Encoder/Decoder handles both full URL encoding and component encoding. Full URL encoding preserves the URL structure (keeping ://,?, &, =) while encoding only the parts that need encoding. Component encoding is stricter, encoding every special character — use this for individual query parameter values.

This tool is invaluable for developers debugging API requests, building URL parameters programmatically, decoding query strings from web analytics, and understanding redirect URLs in marketing campaigns. It correctly handles UTF-8 characters, emojis, and multi-byte Unicode characters.`,
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
    longDescription: `Our QR Code Generator creates high-quality QR codes instantly for any content: website URLs, plain text, email addresses, phone numbers, SMS messages, WhatsApp messages, and WiFi network credentials. Generated QR codes can be downloaded as PNG or SVG and are ready to use in print, digital media, or any application.

QR codes are used everywhere today — restaurant menus, business cards, product packaging, event tickets, payment systems, and digital marketing campaigns. A well-generated QR code is readable by any smartphone camera without a dedicated app.

Customize your QR code with different sizes, error correction levels, and colors to match your brand. Higher error correction levels make QR codes scannable even when partially damaged or obscured — perfect for outdoor signage or printed materials that might get scratched.`,
    category: 'developer-tools',
    targetKeyword: 'QR code generator',
    secondaryKeywords: ['qr code maker', 'free qr code generator', 'qr code creator online', 'generate qr code for url', 'wifi qr code generator'],
    metaTitle: 'QR Code Generator - Create QR Codes Free Online',
    metaDescription: 'Generate QR codes for URLs, text, WiFi & more. Download as PNG or SVG. Free online QR code generator — instant, no signup, customizable size & color.',
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
    longDescription: `Our Color Picker is a comprehensive color tool for designers and developers. Pick any color from a visual color palette and instantly get the values in all major color formats: HEX (#1e40af), RGB (30, 64, 175), HSL (226°, 71%, 40%), and HSV/HSB (226°, 83%, 69%).

The tool includes a color gradient picker, hue slider, and opacity/alpha channel control for full RGBA and HSLA support. It also generates lighter and darker shades of your chosen color, complementary colors, analogous colors, and the full color palette — perfect for building a design system or choosing accessible color combinations.

You can also input any HEX code or RGB values directly to convert between formats. This tool is built for Tailwind CSS, CSS custom properties, Figma, and any design or development workflow where accurate color values are needed.`,
    category: 'developer-tools',
    targetKeyword: 'color picker',
    secondaryKeywords: ['color converter online', 'hex to rgb converter', 'rgb to hex', 'hsl color picker', 'color code picker online'],
    metaTitle: 'Color Picker - HEX, RGB, HSL Color Converter Online Free',
    metaDescription: 'Pick colors & convert between HEX, RGB, HSL, HSV formats. Get shades, tints & complementary colors. Free online color picker — instant, no signup.',
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
    longDescription: `Our Hash Generator creates cryptographic hash digests from text or files using multiple algorithms: MD5, SHA-1, SHA-224, SHA-256, SHA-384, and SHA-512. A hash function takes any input and produces a fixed-length string — the same input always produces the same hash, and even a tiny change produces a completely different hash.

Hashes are used to verify file integrity (check if a downloaded file matches the expected hash), store passwords securely, create digital signatures, verify data hasn't been tampered with, and as unique identifiers in data systems.

Important security note: MD5 and SHA-1 are considered cryptographically broken for security purposes (collision attacks are known). For security applications like password hashing, use SHA-256 or SHA-512 (or better yet, bcrypt/Argon2 for passwords). This tool runs entirely in your browser — your sensitive input never reaches any server.`,
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
    longDescription: `Regular expressions (regex) are powerful pattern-matching tools used in virtually every programming language for string searching, validation, and text processing. Our Regex Tester provides a real-time environment to write, test, and debug regex patterns with instant visual feedback — matching text is highlighted in color as you type.

The tester shows all matches, capture groups, and group values clearly. You can enable flags (global, case insensitive, multiline, dotAll, sticky, unicode) with simple toggles. The tool also shows your regex pattern's structure breakdown, helping you understand what each part does.

Common use cases: validating email addresses, phone numbers, dates, and URLs; extracting specific data from text; find-and-replace operations; parsing log files; and building form validation in web applications. This is an indispensable tool for developers, data engineers, and QA engineers.`,
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
    longDescription: `Convert HTML to Markdown format with our fast, accurate HTML-to-Markdown converter. Whether you're migrating content from an HTML website to a static site generator (Hugo, Jekyll, Gatsby), converting web content to Markdown for a wiki, or moving blog posts to a Markdown-based CMS, this tool handles the conversion cleanly.

The converter handles all common HTML elements: headings (h1-h6), paragraphs, bold and italic text, links, images, ordered and unordered lists, blockquotes, code blocks and inline code, tables, horizontal rules, and more. It intelligently handles nested elements and preserves the document structure.

Content creators, developers building documentation systems, and writers migrating from WordPress to Markdown-based platforms use this tool daily to avoid the tedious work of manual conversion.`,
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
    longDescription: `Reduce your image file sizes by up to 90% while maintaining excellent visual quality with our free online Image Compressor. Large images slow down websites and consume mobile data — our tool uses advanced lossy and lossless compression algorithms to optimize your images for the web.

Upload up to 20 images at once, adjust the quality slider to find the perfect balance between file size and image quality, and download the compressed images individually or as a ZIP file. The tool shows you the before/after file sizes and the compression percentage for each image.

Our compressor works entirely in your browser using the browser-image-compression library — your images never leave your device, ensuring complete privacy. It supports JPEG, PNG, WebP, and GIF formats. No watermarks are added to compressed images.`,
    category: 'image-tools',
    targetKeyword: 'image compressor',
    secondaryKeywords: ['compress image online', 'reduce image size', 'jpg compressor', 'png compressor', 'image optimizer free', 'compress photo online'],
    metaTitle: 'Image Compressor - Compress Images Online Free',
    metaDescription: 'Compress JPEG, PNG & WebP images online without losing quality. Reduce file size up to 90%. Free, no watermark, privacy-first — images stay on your device.',
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
    relatedToolSlugs: ['image-resizer', 'png-to-jpg', 'jpg-to-png', 'webp-to-png', 'image-to-base64'],
    icon: 'ImageDown',
    isPopular: true,
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    shortDescription: 'Resize images to exact dimensions while maintaining aspect ratio.',
    longDescription: `Resize any image to exact pixel dimensions with our free online Image Resizer. Whether you need a specific thumbnail size, social media image dimensions, or need to reduce image dimensions before compression, this tool handles it quickly and accurately.

Set exact width and height in pixels, or just set one dimension and let the tool automatically maintain the aspect ratio to prevent distortion. The tool also lets you resize by percentage (e.g., 50% of original), which is useful when you need to quickly halve or double an image's size.

All resizing is done client-side in your browser using the HTML Canvas API — your images are never uploaded to a server. The tool preserves image quality as much as possible using high-quality image interpolation for smooth downscaling.`,
    category: 'image-tools',
    targetKeyword: 'image resizer',
    secondaryKeywords: ['resize image online', 'image resize tool', 'crop image online', 'change image size', 'reduce image dimensions', 'photo resizer online'],
    metaTitle: 'Image Resizer - Resize Images Online Free',
    metaDescription: 'Resize images to exact dimensions online. Maintain aspect ratio or set custom size. Free image resizer — no watermark, no upload, privacy-first.',
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
    relatedToolSlugs: ['image-compressor', 'png-to-jpg', 'jpg-to-png', 'webp-to-png'],
    icon: 'Maximize2',
    isPopular: true,
    estimatedTime: '1-3 seconds',
  },
  {
    slug: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    shortDescription: 'Convert PNG images to JPG format online with quality control.',
    longDescription: `Convert PNG images to JPG (JPEG) format quickly with our free online converter. JPG is ideal for photographs and complex images where file size matters — it uses lossy compression to achieve significantly smaller files than PNG, making it perfect for web pages where load speed is critical.

PNG supports transparency (alpha channel), which JPG does not. Our converter lets you choose the background color to replace transparent areas (white, black, or custom color) before conversion. You can also adjust the JPG quality (1-100) to balance file size against image quality.

Batch processing is supported — upload up to 20 PNG files at once and convert them all in seconds. All processing happens in your browser; your images stay private on your device.`,
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
    longDescription: `Convert JPG images to PNG format instantly with our free online converter. PNG offers lossless compression and transparency support, making it ideal for screenshots, logos, icons, and any image that will be edited further or requires a transparent background.

When you convert JPG to PNG, the image is re-saved without additional lossy compression. The output PNG will be slightly larger than the JPG (since PNG uses lossless compression) but will have no additional quality loss from the conversion process itself.

Note: since JPG compression is lossy, the original high-frequency detail lost during JPG compression cannot be recovered. Converting JPG to PNG gives you a lossless PNG, but it won't add back detail that was lost when the original JPEG was created.`,
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
    longDescription: `WebP is Google's modern image format offering superior compression, but not all applications and older software support it. Our WebP to PNG Converter instantly converts WebP files to universally compatible PNG format — no software installation required.

This is useful when you download images from modern websites (which increasingly serve WebP), want to edit images in older software that doesn't support WebP, or need to share images in a more universally supported format.

The conversion maintains the full quality of the WebP image in the PNG output. If the WebP image has transparency, it will be preserved in the PNG output since both formats support alpha transparency.`,
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
    longDescription: `Convert any image to a Base64-encoded data URI for direct embedding in HTML, CSS, or JSON without needing a separate image file. This technique is used to reduce HTTP requests for small images, store images in databases as text, embed images in email HTML, and include images in JSON API responses.

Upload any image (JPEG, PNG, WebP, GIF, SVG) and instantly get the Base64 string along with the ready-to-use data URI for HTML img tags and CSS background images. The tool shows you the encoded string length so you can judge if inlining is appropriate.

Best practice: inline Base64 images for small icons and UI elements (under 10KB). For larger images, serving from a CDN is almost always better for performance, as Base64 increases data size by ~33% and prevents browser caching.`,
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
    longDescription: `Combine multiple PDF files into a single, organized document with our free PDF Merge tool. Whether you're assembling a report from multiple chapters, combining invoices, or merging scanned documents, this tool handles it quickly and securely — entirely in your browser.

Drag and reorder the PDFs before merging to control the final page order. Upload up to 20 PDF files at once (up to 50MB each). The merged PDF is assembled client-side using the pdf-lib JavaScript library, meaning your documents never leave your device — essential for sensitive financial or legal documents.

The output PDF maintains the original quality, fonts, and formatting of all input PDFs. No watermarks are added to merged PDFs, unlike many online alternatives.`,
    category: 'pdf-tools',
    targetKeyword: 'PDF merge',
    secondaryKeywords: ['merge PDF files online', 'combine PDF', 'join PDF online free', 'PDF combiner', 'merge multiple PDFs'],
    metaTitle: 'PDF Merge - Combine PDF Files Online Free',
    metaDescription: 'Merge multiple PDF files into one online. Drag to reorder pages. Free, secure, no watermark — files never leave your device. No signup needed.',
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
    longDescription: `Split any PDF document into individual pages or custom page ranges with our free PDF Split tool. Extract specific pages from a large PDF, split each page into a separate file, or divide a PDF into equal chunks — all without uploading to any server.

Common use cases: extracting a specific chapter from an e-book, separating a combined invoice PDF into individual invoices, extracting pages for review before sharing, or splitting a scanned document into individual forms.

The tool uses pdf-lib to perform splitting client-side. Your PDF files never leave your device, making it safe for confidential contracts, medical documents, and financial records. No watermarks, no file size reductions, no quality loss.`,
    category: 'pdf-tools',
    targetKeyword: 'PDF split',
    secondaryKeywords: ['split PDF online', 'extract pages from PDF', 'divide PDF', 'PDF page extractor', 'separate PDF pages free'],
    metaTitle: 'PDF Split - Split PDF Pages Online Free',
    metaDescription: 'Split PDF into individual pages or custom ranges online. Extract specific pages from any PDF. Free, secure, no watermark — files stay on your device.',
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
    longDescription: `Reduce the file size of your PDF documents while maintaining acceptable quality with our free PDF Compressor. Smaller PDFs are faster to email, upload, and share — and many email clients and websites have file size limits that this tool helps you meet.

The compressor optimizes embedded images, removes redundant data streams, and applies lossless optimizations to the PDF structure. You can choose compression levels: maximum quality (slight reduction), balanced (good quality, smaller size), or maximum compression (smallest size, reduced image quality).

All compression happens client-side using pdf-lib — your sensitive documents never reach our servers. No watermarks are added. The tool shows you the compressed file size before you download.`,
    category: 'pdf-tools',
    targetKeyword: 'PDF compressor',
    secondaryKeywords: ['compress PDF online free', 'reduce PDF file size', 'PDF optimizer', 'shrink PDF', 'make PDF smaller online'],
    metaTitle: 'PDF Compressor - Compress PDF File Size Online Free',
    metaDescription: 'Compress PDF files to reduce size online. Choose quality level. Free, secure, no watermark — your PDFs stay private. Reduce PDF size for email & upload.',
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
    relatedToolSlugs: ['pdf-merge', 'pdf-split', 'pdf-to-image', 'image-compressor'],
    icon: 'FileArchive',
    isPopular: true,
    estimatedTime: '3-10 seconds',
  },
  {
    slug: 'pdf-to-image',
    name: 'PDF to Image',
    shortDescription: 'Convert PDF pages to high-quality PNG or JPG images online.',
    longDescription: `Convert any page of a PDF document to a high-quality PNG or JPG image with our free PDF to Image converter. This is useful for creating PDF thumbnails, extracting specific pages as images for presentations, sharing a non-editable view of a document page, or preparing PDF content for social media.

Select specific pages to convert or convert all pages at once. Adjust the output resolution (DPI) for the perfect balance of quality and file size — 150 DPI for web/screen use, 300 DPI for print. Output formats include PNG (best quality, supports transparency) and JPG (smaller files, good for photos).

The tool uses PDF.js for rendering, giving you high-fidelity image output that accurately represents the original PDF layout.`,
    category: 'pdf-tools',
    targetKeyword: 'PDF to image converter',
    secondaryKeywords: ['pdf to png', 'pdf to jpg converter', 'convert pdf page to image', 'pdf screenshot tool', 'extract image from pdf'],
    metaTitle: 'PDF to Image Converter - PDF to PNG/JPG Free Online',
    metaDescription: 'Convert PDF pages to PNG or JPG images online. Choose resolution (DPI) and format. Free, secure — your PDF never leaves your device. No signup needed.',
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
    longDescription: `Convert any PDF document to an editable Microsoft Word (.docx) file with our free PDF to Word converter. Extract text, paragraphs, and headings from your PDF and download a fully editable Word document — all processed entirely in your browser.

This tool uses PDF.js to accurately extract text content from each page of your PDF, then generates a properly formatted .docx file using the docx library. The output preserves paragraph structure, line breaks, and page separation, making it easy to edit the content in Microsoft Word, Google Docs, or any other word processor.

Perfect for editing scanned contracts, modifying old PDF reports, extracting text from academic papers, or converting PDF resumes into editable formats. Since everything runs client-side, your documents never leave your device — ideal for confidential or sensitive files.`,
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
    relatedToolSlugs: ['pdf-to-image', 'pdf-merge', 'pdf-split', 'image-to-text'],
    icon: 'FileText',
    isPopular: true,
    estimatedTime: '5-15 seconds',
  },

  // ─── CONVERTERS ───────────────────────────────────────────────────────────
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    shortDescription: 'Convert length, weight, volume, area, speed and data units instantly.',
    longDescription: `Our Unit Converter is a comprehensive measurement conversion tool covering all major unit categories: length (meters, feet, miles, kilometers), weight/mass (kilograms, pounds, ounces, grams), volume (liters, gallons, milliliters, cups), area (square meters, acres, hectares, square feet), speed (km/h, mph, m/s, knots), data storage (bytes, KB, MB, GB, TB), and more.

Each conversion is calculated with high precision (up to 10 significant figures), making it suitable for scientific, engineering, and everyday use. The interface is clean and intuitive — select the category, choose input and output units, enter your value, and get the result instantly.

This is an essential tool for engineers, students, scientists, travellers, shoppers comparing international prices, and anyone who regularly works with measurements from different systems (metric vs imperial).`,
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
    longDescription: `Convert temperatures between Celsius (°C), Fahrenheit (°F), and Kelvin (K) with our instant Temperature Converter. Enter a temperature in any unit and see the equivalent in all three scales simultaneously — no need to convert back and forth manually.

Temperature conversion is needed in weather forecasting (US uses Fahrenheit, most of the world uses Celsius), cooking (recipes from different countries use different scales), scientific work (Kelvin is the SI unit for thermodynamic temperature), and medicine (body temperature, fever thresholds differ by scale).

The converter also shows common temperature reference points (water freezing/boiling, body temperature, oven temperatures) as quick reference anchors for each scale.`,
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
    longDescription: `Convert Unix timestamps (epoch time) to human-readable dates and times, and vice versa. Unix timestamp is the number of seconds elapsed since January 1, 1970, 00:00:00 UTC (the Unix epoch). It's widely used in programming, databases, APIs, and system logs.

Our converter handles both seconds and milliseconds (used in JavaScript), shows the timestamp in multiple timezone formats, and lets you convert any date to its corresponding Unix timestamp. This is an essential tool for developers debugging API responses, analyzing logs, working with database timestamps, and understanding cron job schedules.

The current Unix timestamp is shown at the top and auto-updates every second — useful when you need the current timestamp for testing.`,
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
    longDescription: `Convert dates between Nepali Bikram Sambat (BS/विक्रम संवत) and English Gregorian (AD) calendars with our free Nepali Date Converter. Enter any date in BS and get the exact AD equivalent, or convert AD to BS — accurate from 2000 BS to 2099 BS (1943 AD to 2043 AD).

The converter displays results with Nepali month names (बैशाख, जेठ, असार...), day of the week in both Nepali and English, and Nepali numerals (१, २, ३...). It also shows today's date in both BS and AD formats — perfect for quickly checking the Nepali date.

Built with accurate BS calendar data that accounts for the variable number of days in each Nepali month (which differ from year to year, unlike the Gregorian calendar). This tool is essential for filling government forms, scheduling events across calendars, checking dates for festivals (Dashain, Tihar), and everyday date conversions.

Works 100% in your browser — no data is sent to any server. Fast, accurate, and free with no signup required.`,
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
    longDescription: `Convert Preeti font Nepali text to Unicode (standard Devanagari) instantly with our free Preeti to Unicode converter. Preeti is the most popular legacy Nepali font used in government offices, banks, newspapers, and older documents across Nepal. However, Preeti text doesn't display correctly on the web or modern devices without the font installed — Unicode solves this.

Simply paste your Preeti-encoded text in the input box and get perfectly formatted Unicode Nepali (देवनागरी) output in real time. The converter handles all Preeti characters, conjuncts (संयुक्त अक्षर), special symbols, numbers, and punctuation with high accuracy.

Also includes Unicode to Preeti reverse conversion for users who need to work with legacy documents. Both conversions happen instantly in your browser — your text is never sent to any server. No signup, no limits, completely free.

Essential for Nepali government employees, journalists, content creators, students, and anyone who works with Nepali text across old and modern systems.`,
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
    longDescription: `Type in Nepali using your regular English keyboard with our free Nepali Typing Tool. Simply type Romanized Nepali (like "namaste" → "नमस्ते") and the tool converts it to Devanagari script in real-time. No Nepali keyboard layout or special software needed.

The tool uses phonetic transliteration — type how the word sounds in English and get the Nepali Unicode output instantly. Supports all Nepali consonants, vowels, conjuncts (संयुक्त अक्षर), and special characters. Common mappings: ka→क, kha→ख, ga→ग, gha→घ, cha→च, chha→छ, ja→ज, etc.

Features include a virtual Nepali keyboard for clicking characters, real-time conversion as you type, word suggestions, copy to clipboard, and a complete character mapping reference. Output is in standard Unicode that works everywhere — websites, emails, social media, documents.

Perfect for Nepali speakers who are comfortable with English keyboards, students writing Nepali assignments, content creators, and anyone who needs to type Nepali text quickly and accurately.`,
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
    longDescription: `Nepal's most complete NEPSE Share Calculator with three powerful tools: Profit/Loss Calculator, WACC (Weighted Average Cost) Calculator, and Target Price Calculator. All with official SEBON-regulated broker commission tiers, SEBON fee, DP charge, and Capital Gains Tax.

Profit/Loss Calculator: Enter buy price, sell price, and quantity (kitta) to instantly see net profit/loss after all charges. Includes visual fee breakdown chart, circuit breaker limits, break-even price, effective buy/sell price per share, and detailed buy-side + sell-side fee breakdown.

WACC Calculator: Bought the same stock at different prices? Add multiple buy transactions and calculate your weighted average cost per share including all fees. See per-transaction weight distribution and total investment breakdown.

Target Price Calculator: Enter your desired profit amount and the tool calculates the exact sell price needed accounting for all broker commissions, SEBON fee, DP charge, and Capital Gains Tax. Know exactly what price target to set.

Commission tiers: 0.36% (up to Rs 50K), 0.33% (50K-5L), 0.31% (5L-20L), 0.27% (20L-1Cr), 0.24% (above 1Cr). CGT: 5% individual (>365 days), 7.5% individual (<=365 days), 10% institutional. Updated for fiscal year 2081/2082.`,
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
    longDescription: `Convert any number into its word representation with our Number to Words converter. Enter any number — from simple integers to large figures — and instantly get the written English equivalent. The tool supports both International (million, billion) and Indian (lakh, crore) numbering systems.

This is essential for writing cheques (where the amount must be written in words), drafting legal and financial documents, converting currency amounts, and preparing educational materials. The tool handles numbers up to 999 crore (Indian system) or 999 billion (International system).

The Indian numbering system (used in India, Pakistan, Bangladesh, Nepal) uses lakh (100,000) and crore (10,000,000) as primary groupings after ten thousand, which differs from the Western system that uses million and billion.`,
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
    longDescription: `Our free Internet Speed Test measures your real-time download speed and ping (latency) directly in the browser — no plugins, no apps, no sign-up required. It works by downloading a test payload from Cloudflare's global edge network and precisely timing the transfer using the browser's high-resolution Performance API.

Unlike other speed test tools that require Flash or native apps, this tool runs 100% in your browser. The test uses multiple progressive download rounds to produce a stable, averaged result that closely matches what you'd see from industry tools like Speedtest.net or fast.com.

The ping test measures your network latency — how quickly your device can communicate with a remote server. Lower ping means faster response times, which is crucial for gaming, video calls, and real-time applications.`,
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
    longDescription: `The Time Zone Checker — your Office Buddy for remote teams — lets you instantly see the current local time in cities around the world, all updating live every second. No more mentally calculating time differences or Googling "what time is it in Tokyo right now."

Add any city from our curated list of 50+ major business hubs across all time zones. The tool clearly shows each city's current time, date, day of the week, and UTC offset. A visual indicator highlights whether it's currently working hours, early/late hours, or nighttime — so you'll always know the best time to reach a colleague.

Perfect for scheduling international meetings, coordinating with remote teams, tracking market hours, or planning travel. All calculations happen locally in your browser using the Intl.DateTimeFormat API — no server calls, always accurate.`,
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
    longDescription: `A powerful, browser-based HTML/CSS/JavaScript live code editor with real-time preview. Write HTML, CSS, and JavaScript in the editor panels and see your output update instantly — no installation, no sign-up required.

Features a professional dark-themed code editor with tab support (Tab key inserts spaces), auto-run with 600ms debounce, manual run mode, full-screen preview, and a built-in console panel that captures console.log, console.error, and console.warn output from your code.

Choose from 4 layout modes: side-by-side (editor left, preview right), top/bottom split, editor-only, or preview-only. Load from 6 starter templates (Hello World, Counter, Todo App, Profile Card, Digital Clock, or Blank) to get started instantly. Download your project as a standalone HTML file.`,
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
    longDescription: `Convert one or multiple images (JPG, PNG, WebP, GIF, BMP) into a single PDF file instantly in your browser. No uploads, no server — everything happens locally for complete privacy.

Upload images, drag them to reorder the pages, choose your page size (A4, Letter, or fit to image), orientation, and margin. Then click convert to download a clean PDF.`,
    category: 'pdf-tools',
    targetKeyword: 'JPG to PDF converter',
    secondaryKeywords: ['jpg to pdf online', 'image to pdf', 'png to pdf', 'convert image to pdf free', 'photos to pdf'],
    metaTitle: 'JPG to PDF Converter - Free Online Image to PDF',
    metaDescription: 'Convert JPG, PNG, WebP images to PDF online for free. Upload multiple images, reorder pages, choose A4 or Letter size. No upload required — 100% private.',
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
    relatedToolSlugs: ['pdf-merge', 'pdf-compress', 'pdf-split', 'image-compressor'],
    icon: 'FilePlus',
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'pdf-rotate',
    name: 'Rotate PDF',
    shortDescription: 'Rotate PDF pages 90°, 180° or 270° — all pages or individually.',
    longDescription: `Rotate one, some, or all pages of a PDF file directly in your browser. No uploads required — everything stays on your device for complete privacy.

Choose to rotate all pages at once (90° clockwise, 90° counter-clockwise, or 180°) or fine-tune individual pages independently. Preview the rotation labels for each page before downloading.`,
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
    longDescription: `Stamp a custom text or logo watermark onto every page of your PDF — completely in your browser with no server upload needed.

Choose watermark type (text or image), customize the text, font size, color, opacity, rotation, and position (center, corners, or tiled). Download the watermarked PDF instantly.`,
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
    longDescription: `Insert page numbers into any PDF instantly — no upload, no sign-up, fully private. Choose position (bottom center, corners, top), format (1, 2, 3 / Page 1 of 10 / - 1 -), font size, color, and margin.

Optionally set the starting number and skip the first page (useful for cover pages).`,
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
    longDescription: `Rearrange, remove, or duplicate pages in any PDF file — completely in your browser with no file upload required.

Upload your PDF, see all pages listed in order, then use the arrow buttons to reorder them, trash icon to delete pages, or copy icon to duplicate pages. Download the reorganized PDF when done.`,
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
    slug: 'pdf-crop',
    name: 'Crop PDF',
    shortDescription: 'Crop and trim margins from all pages of a PDF file.',
    longDescription: `Remove unwanted white margins or trim specific edges from every page of your PDF — instantly in your browser with no upload required.

Set crop values for top, right, bottom, and left margins (in PDF points). Use quick presets (small, medium, large) or enter exact values. See a visual preview before downloading.`,
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
    longDescription: `Sign PDF documents electronically directly in your browser — no software to install, no server upload required. Choose from three signature methods:

**Draw**: Use your mouse or touchscreen to handwrite your signature on a digital canvas.
**Type**: Enter your name and pick a cursive font style for a clean typed signature.
**Upload**: Use an existing signature image (PNG with transparent background works best).

Place the signature on the last page, first page, all pages, or any specific page. Adjust size and position using sliders. Download the signed PDF instantly.`,
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
    longDescription: `Insert one or multiple images (PNG, JPG, WebP, GIF) into any PDF document — completely in your browser with no server upload required.

Upload your PDF and then add images one by one. For each image, configure which pages to apply it to (all, first, last, or a custom page), position (left/top offset in PDF points), width, and opacity. Great for adding company logos, stamps, or illustrations.`,
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
    longDescription: `Transform any CSV file or tabular data into a clean, professional PDF table — instantly in your browser with no server upload required.

Paste your CSV data or upload a .csv file. Customize delimiter (comma, semicolon, tab, pipe), table style (striped, bordered, minimal), header color, font size, and document title. Auto-paginates for large datasets. Live preview shows the table before you export.`,
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
    longDescription: `Create strong, cryptographically secure random passwords instantly. Choose length (6–64 characters), select character types (uppercase, lowercase, numbers, symbols), and generate with one click.

Uses the Web Crypto API (crypto.getRandomValues) for true cryptographic randomness. Passwords are never stored or sent anywhere. Includes strength indicator and quick presets.`,
    category: 'developer-tools',
    targetKeyword: 'password generator',
    secondaryKeywords: ['random password generator', 'strong password generator', 'secure password maker', 'password creator online'],
    metaTitle: 'Password Generator - Free Strong Password Creator',
    metaDescription: 'Generate strong, secure random passwords online. Choose length, character types & get instant strength rating. Uses crypto API — 100% secure, no storage.',
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
    longDescription: `Convert CSV data to JSON format and vice versa instantly. Paste data, upload a file, or type in the editor — output is generated in real time.

Supports multiple delimiters (comma, semicolon, tab, pipe), auto-detects numeric values, and handles quoted fields correctly. Download as .json or .csv file.`,
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
    longDescription: `Convert Markdown text to clean HTML with a live split-screen preview. Supports full Markdown: headings, bold, italic, code blocks, tables, lists, blockquotes, links, and images.

Download as a complete HTML file with CSS included. Perfect for bloggers, developers, and technical writers.`,
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

  // ─── ASTROLOGY TOOLS ──────────────────────────────────────────────────────
  {
    slug: 'rashi-checker',
    name: 'Rashi Checker',
    shortDescription: 'Find your Rashi (zodiac sign) by name — English & Hindi supported.',
    longDescription: `Discover your Vedic Rashi (Moon sign / zodiac sign) instantly by entering your name. Our Rashi Checker uses the traditional Hindu naming system based on Nakshatra (birth star) syllables, where the first syllable of your name reveals your Rashi.

In Vedic astrology, each of the 27 Nakshatras is divided into 4 Padas (quarters), each associated with a unique syllable (Akshara). Parents traditionally choose a baby's name beginning with the syllable matching the child's birth Nakshatra, making your name a window into your astrological sign.

This tool supports both English (Roman) and Hindi (Devanagari) name input. Once you enter your name, we identify the first syllable, match it to the corresponding Nakshatra, and display your Rashi along with its ruling planet, element, lucky numbers, key personality traits, and Nakshatra name — all in both English and Hindi.`,
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
    longDescription: `Our Gun Milan calculator checks marriage compatibility between a boy and a girl using the traditional Vedic Ashtakoota matching system. Simply enter both names and get an instant compatibility report with scores for all 8 Kootas (compatibility factors) out of 36 total points.

The Ashtakoota system evaluates 8 aspects of compatibility: Varna (temperament), Vashya (dominance), Tara (destiny), Yoni (nature), Graha Maitri (planetary friendship), Gana (character), Bhakoot (love & health), and Nadi (genetic compatibility). Each Koota has a maximum score and contributes to the total of 36 Gunas.

A score above 18 is generally considered acceptable, 25+ is good, and 32+ is excellent. The tool also highlights key doshas (flaws) like Nadi Dosha, Bhakoot Dosha, and Gana Dosha and explains their significance. Results are shown in both English and Hindi for easy understanding.`,
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
    longDescription: `The IPL Team Squad Explorer is a comprehensive fan tool to browse complete squad details for all 10 Indian Premier League 2026 teams. Whether you're a die-hard CSK fan or tracking Mumbai Indians' overseas players, this tool gives you all the information in one place.

Explore player details including their role (Batter, Bowler, All-rounder, Wicket-keeper), nationality (Indian/Overseas), auction price, and whether they were retained or bought at the mega auction. Filter across all 10 IPL franchises to compare squad strengths.

Each team card shows key information like the captain's name, home ground, total purse used, and squad composition at a glance. The search feature lets you find any IPL player instantly across all franchises without scrolling through endless lists.

This is a 100% free, unofficial fan-made tool. All squad data is based on publicly available information. For official squad details, visit the BCCI website. Data is updated based on official announcements.`,
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
    longDescription: `The IPL 2026 Match Schedule tool gives you the complete fixture list for the entire Indian Premier League season in one easy-to-browse interface. No more searching through multiple websites — get every match date, time, venue, and team pairing in a clean, mobile-friendly view.

Track your favourite team's upcoming matches with the team filter. Choose from all 10 IPL franchises and instantly see only their home and away fixtures. The venue filter lets you plan ahead if you're attending matches at specific stadiums like Wankhede, Chinnaswamy, or Eden Gardens.

A live countdown timer shows exactly how long until the next IPL match begins, keeping fans engaged throughout the season. Matches are grouped by month for easy navigation across the full season spanning March to June.

This is an unofficial fan-made schedule tool. Match timings are in IST (Indian Standard Time). For official schedule updates, check the BCCI website. Rescheduled matches will be updated as announcements are made.`,
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
    longDescription: `The IPL Player Comparison Tool lets cricket fans compare the career IPL statistics of any two players side by side. Select two players from the dropdown menus and instantly see a detailed head-to-head breakdown across batting and bowling metrics.

For batting comparisons, view total runs, matches played, batting average, strike rate, highest score, number of half-centuries (50s) and centuries (100s), and boundary counts. For bowling, compare wickets taken, economy rate, bowling average, and best bowling figures — all in one clean visual layout.

Each stat category highlights the better performer in green, making it easy to spot strengths and weaknesses at a glance. The tool covers top IPL players including legends and current stars across all franchises, with career IPL statistics (not just one season).

This is an unofficial fan-made comparison tool for entertainment and educational purposes. Statistics are based on historical IPL data and may not reflect mid-season updates. For live stats, visit the official IPL website.`,
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
    longDescription: `The IPL 2026 Points Table tool gives you a clear, up-to-date view of the Indian Premier League standings throughout the season. Track which teams are in the playoff qualification zone (Top 4) and which teams are leading on Net Run Rate (NRR).

The table displays all essential columns: team name, matches played, wins, losses, no-results, net run rate, and total points. The top 4 teams — who qualify for the playoffs — are highlighted in green, while the top 2 teams who earn a double chance are highlighted in blue.

Sort the table by any column to get different perspectives on the competition. Teams can be ranked by points, NRR, or number of wins. The NRR (Net Run Rate) column is especially useful for understanding close playoff races where multiple teams are level on points.

At the start of the season, all teams begin at 0 points. The table updates automatically when match results are reflected in the data. This is an unofficial fan-made tool — for real-time live scores, visit the official IPL website or Cricbuzz.`,
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
    longDescription: `The ToolsArena Invoice Generator is a free, no-signup tool that lets you create professional invoices in seconds and download them as PDF. Whether you're a freelancer billing a client, a small business owner, or a startup founder, this tool helps you generate clean, branded invoices without any accounting software.

Everything runs 100% in your browser. Your business data, client details, and invoice amounts never leave your device — making this one of the most private invoice generators available online. No account needed, no data stored on servers, unlimited invoices.

Choose from 3 professionally designed templates (Modern, Classic, Minimal), add your company logo, pick your brand color, and fill in your line items. The tool automatically calculates subtotal, tax (GST/VAT/Sales Tax), discounts, and grand total. Supports 30+ global currencies including USD, EUR, GBP, INR, NPR, AED, and more.

Save your business details as a template so you never have to re-enter them. Each invoice features auto-incrementing invoice numbers, customizable prefixes, date and due date fields, payment terms, and notes. The live preview updates in real-time as you type, and the final PDF is beautifully formatted with your brand colors and logo — ready to send to your clients.`,
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
    longDescription: `Compare up to 4 loan offers side-by-side with our free Loan Comparison Calculator. Enter the loan amount, interest rate, and tenure for each option — instantly see the monthly EMI, total interest paid, total amount payable, and savings compared to the most expensive option.

The calculator uses the standard EMI formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is principal, r is monthly interest rate, and n is number of months. Results are shown in a clean comparison table with visual bar charts highlighting the best and worst deals.

Perfect for comparing home loans, personal loans, car loans, education loans, or any EMI-based financing. Supports Indian Rupee (₹) formatting with lakh/crore notation. All calculations happen instantly in your browser — no data stored, no signup needed.

Essential for anyone shopping for loans and wanting to make an informed decision about which offer saves the most money.`,
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
    longDescription: `The ToolsArena Compound Interest Calculator is a free, no-signup tool that helps you calculate how your money grows with compound interest over time. Whether you're planning a fixed deposit (FD), recurring deposit (RD), PPF investment, or simply understanding how compounding works — this calculator gives you instant, accurate results.

Enter your principal amount, annual interest rate, time period, and choose your compounding frequency (monthly, quarterly, half-yearly, or yearly). The calculator instantly shows your total maturity value, total interest earned, and a detailed year-by-year breakdown of how your investment grows.

The tool also compares compound interest vs simple interest side by side, so you can see exactly how much extra you earn through the power of compounding. A visual breakdown bar shows the proportion of principal to interest in your final amount.

Everything runs 100% in your browser — no data is sent to any server, no signup required. The compound interest formula used is A = P × (1 + r/n)^(n×t), displayed transparently on the page so you can verify the math yourself. Perfect for students, investors, and anyone planning their financial future.`,
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
    longDescription: `The ToolsArena FD & RD Calculator is a free, no-signup tool that helps you calculate the maturity value of your Fixed Deposit (FD) and Recurring Deposit (RD) investments. Whether you're comparing FD rates across banks or planning a monthly RD savings goal, this calculator gives you instant, accurate results.

Switch between FD and RD modes with a single click. For Fixed Deposits, enter your lump sum deposit amount, interest rate, and tenure. For Recurring Deposits, enter your monthly deposit amount, interest rate, and tenure. Choose your compounding frequency (monthly, quarterly, half-yearly, or yearly) — most Indian banks use quarterly compounding for FDs and RDs.

The calculator shows your total maturity value, interest earned, effective return percentage, and a visual breakdown of deposit vs interest. A quick comparison table shows maturity values at different tenures (FD) or monthly amounts (RD) side by side. The year-by-year breakdown table lets you see exactly how your money grows each year.

Everything runs 100% in your browser — no data is sent to any server, no signup needed. Perfect for comparing bank FD rates, planning RD savings, or understanding how your deposits grow over time.`,
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
    longDescription: `The ToolsArena Resume Builder is a free, no-signup online tool that helps you create a professional, ATS-friendly resume in minutes. Whether you're a fresh graduate, experienced professional, or career changer, this tool gives you everything you need to build a standout resume and download it as a polished PDF.

Choose from 3 professionally designed templates — Modern (with accent sidebar), Classic (traditional ATS-optimized), and Minimal (clean and elegant). Pick your brand color from 8 accent options to personalize your resume. The live preview updates in real-time as you type, so you always see exactly how your resume will look.

Add and customize multiple sections: Personal Information, Professional Summary, Work Experience (with bullet points for achievements), Education, Skills (grouped by category), Projects (with tech stack and links), Certifications, and Languages. Toggle sections on or off to tailor your resume for different job applications. Each experience entry supports multiple bullet points to highlight your key achievements and responsibilities.

Your data is auto-saved to your browser's local storage — come back anytime and continue where you left off. Everything runs 100% in your browser: your personal details, career history, and resume data never leave your device. No account needed, no watermarks, no limits on downloads.

The generated PDF is clean, well-formatted, and ATS-compatible — meaning it passes through Applicant Tracking Systems used by recruiters at companies like Google, Amazon, TCS, Infosys, and more. Perfect for job applications, campus placements, internship applications, and freelance proposals.`,
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
    longDescription: `The ToolsArena Scientific Calculator is a free, full-featured online calculator designed for students, engineers, scientists, and anyone who needs advanced mathematical calculations. It looks and works like a real physical scientific calculator — right in your browser.

Perform basic arithmetic (addition, subtraction, multiplication, division) along with advanced scientific functions: trigonometric functions (sin, cos, tan and their inverses), hyperbolic functions, logarithms (log base 10 and natural log), square root, cube root, powers and exponents, factorial, absolute value, reciprocal, and modulo operations. Switch between degree (DEG) and radian (RAD) mode for angle calculations.

The calculator features a clean, modern UI with a realistic button layout. The display shows your current expression and result separately, supports keyboard input for fast calculations, and maintains a scrollable history of your last 20 calculations so you can revisit or reuse previous results.

Built entirely with JavaScript — no server-side processing, no signup required, works offline. Supports mathematical constants π (pi) and e (Euler's number), implicit multiplication (e.g., 2π = 6.28), and proper operator precedence. The expression parser handles nested parentheses and complex multi-function expressions accurately.

Perfect for homework, exam preparation, engineering calculations, physics problems, financial math, and everyday number crunching. Works on desktop, tablet, and mobile devices with responsive button sizing.`,
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
    longDescription: `Need to remove a background from an image but don't want to pay for Canva Pro or Adobe? You're in the right place. Our free AI Background Remover does it right inside your browser — no signup, no upload to any server, no watermarks. Your images stay on your device, always.

Here's how it works: the first time you use the tool, a small AI model (~40MB) downloads to your browser. After that, it's cached — so every future use is fast. The AI identifies the subject in your photo (a person, product, pet, logo — anything) and removes the background automatically. You get a clean, transparent PNG ready to download.

Is it as perfect as Photoshop? Let's be honest — not always. Complex edges like hair or fur can be tricky for any automated tool. But for most everyday needs — product photos, profile pictures, social media posts, presentations, school projects — it gets the job done really well. And unlike paid tools, you can use it unlimited times, completely free.

We built this for students, small business owners, freelancers, and creators who need professional-looking images without professional-level budgets. You deserve good tools without paywalls. Upload your image and see for yourself.`,
    category: 'image-tools',
    targetKeyword: 'remove background from image',
    secondaryKeywords: ['background remover', 'remove bg', 'transparent background maker', 'image background eraser', 'free background remover online', 'remove image background online', 'bg remover free', 'remove bg from photo', 'transparent background generator', 'background eraser online free', 'remove white background', 'product photo background remover'],
    metaTitle: 'Remove Background from Image Free Online — AI Background Remover',
    metaDescription: 'Remove image backgrounds for free using AI that runs in your browser. No signup, no watermark, unlimited use. Your photos never leave your device. Try it now!',
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
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'png-to-jpg', 'jpg-to-png', 'image-to-base64', 'webp-to-png'],
    icon: 'Eraser',
    isPopular: true,
    estimatedTime: '10-30 seconds',
  },
  {
    slug: 'svg-to-png',
    name: 'SVG to PNG Converter',
    shortDescription: 'Convert SVG files to high-quality PNG images with custom scale and background.',
    longDescription: `Convert your SVG (Scalable Vector Graphics) files to PNG images instantly with our free online converter. Choose custom scale factors (1x to 4x) for crisp, high-resolution output perfect for retina displays.

Upload an SVG file or paste SVG code directly. The tool renders your SVG on an HTML canvas and exports it as a PNG image. Choose transparent or custom-colored backgrounds, and select the output scale for the resolution you need.

All processing happens in your browser using the Canvas API — your files are never uploaded to any server. Perfect for designers who need rasterized versions of vector graphics for social media, presentations, or platforms that don't support SVG.`,
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
    longDescription: `Convert colors between HEX, RGB, and HSL formats instantly with our free color converter. Type a HEX code like #3b82f6, adjust RGB sliders, or use the native color picker — all formats update in real-time.

The tool displays your selected color as a large preview swatch, plus provides ready-to-copy CSS code snippets. Whether you're a web developer matching brand colors, a designer working across tools, or just curious about color values — this is the fastest way to convert.

Includes visual RGB sliders for intuitive color exploration and one-click copy buttons for every format. Everything runs client-side with zero latency.`,
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
    longDescription: `Minify your CSS code instantly to reduce file size and improve website loading speed. Our CSS Minifier removes comments, collapses whitespace, strips unnecessary semicolons, and applies basic optimizations like converting 0px to 0.

Paste your CSS code on the left, click "Minify CSS," and get the optimized output on the right. The tool shows you the exact bytes saved and compression percentage. Copy the minified CSS with one click and paste it into your production files.

All processing is done client-side in your browser — your code is never sent to any server. Perfect for quick minification without setting up build tools.`,
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
    longDescription: `A clean, distraction-free online notepad that auto-saves your notes to your browser. Start typing and your text is automatically saved — come back anytime and pick up where you left off.

Features include adjustable font size, real-time word/character/line count, download as .txt file, and a clean writing interface. No login, no account, no cloud sync — your notes are stored locally in your browser's localStorage.

Perfect for quick notes during meetings, brainstorming sessions, drafting messages, jotting down ideas, or anytime you need a quick, no-fuss text editor. Everything stays private on your device.`,
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
    longDescription: `Minify your JavaScript code instantly to shrink file sizes and boost website performance. Our JS Minifier strips out comments, collapses whitespace, removes unnecessary semicolons, and produces compact output ready for production.

Paste your JavaScript on the left, click "Minify JavaScript," and get optimized output on the right. The tool shows exact bytes saved and compression percentage. All processing happens in your browser — your code never leaves your device.

Perfect for quick minification of small scripts without configuring Webpack, Rollup, or other build tools. For production apps with multiple files, we recommend a proper bundler — but for single-file minification, this tool is fast, free, and private.`,
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
    longDescription: `Crop your images to the perfect size with our free online Image Cropper. Choose from preset aspect ratios (1:1 for Instagram, 16:9 for YouTube, 9:16 for Stories, 4:3, 3:2) or crop freely with custom dimensions.

Upload your image, select your desired crop area by dragging, and download the cropped result as a high-quality PNG. The tool shows a rule-of-thirds grid overlay to help you compose the perfect crop. A live pixel dimension indicator shows the exact output size.

Everything runs in your browser using the Canvas API — your images are never uploaded to any server. Perfect for social media posts, profile pictures, product photos, and any project that needs precisely cropped images.`,
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
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'image-watermark', 'image-background-remover', 'png-to-jpg'],
    icon: 'Crop',
    isPopular: true,
    estimatedTime: '2-5 seconds',
  },
  {
    slug: 'stopwatch',
    name: 'Online Stopwatch',
    shortDescription: 'Free online stopwatch with lap timer — accurate to centiseconds.',
    longDescription: `A clean, accurate online stopwatch with lap timing functionality. Start, pause, and reset with one click. Record unlimited laps and see split times with best/worst lap highlighting.

The stopwatch displays hours, minutes, seconds, and centiseconds (1/100th of a second) with a large, easy-to-read display. Lap times are shown in a scrollable list with the fastest lap highlighted in green and the slowest in red — just like a professional sports timer.

Built with high-resolution timing using Date.now() for accuracy. Perfect for workouts, cooking, study sessions, sports timing, or any task where you need precise time measurement. No installation needed — works instantly in your browser.`,
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
    longDescription: `Boost your productivity with our free Pomodoro Timer. The Pomodoro Technique breaks your work into focused 25-minute sessions separated by short 5-minute breaks, with a longer 15-minute break after every 4 sessions.

Features a beautiful circular progress indicator, audio notifications when timers complete, automatic session switching (work → break → work), and customizable durations. Track your completed sessions to see your daily productivity.

The timer runs entirely in your browser — no account, no data collection. Customize focus time (1-120 min), short break (1-30 min), and long break (1-60 min) to match your personal workflow. Used by millions of students, developers, writers, and professionals worldwide.`,
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
    longDescription: `Convert any text to natural-sounding speech right in your browser. Our Text to Speech tool uses the Web Speech API built into modern browsers to read your text aloud in dozens of voices and languages — completely free, no downloads, no signup.

Choose from 50+ voices across multiple languages (English, Hindi, Spanish, French, German, Japanese, and more). Adjust speech speed (0.25x to 2x) and pitch to find the perfect voice for your needs. Pause, resume, or stop at any time.

Perfect for proofreading by listening to your writing, language learning, accessibility, creating audio from articles, or simply having text read to you while you multitask. Everything runs locally in your browser — your text is never sent to any server.`,
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
    longDescription: `Clean up messy, minified, or poorly formatted HTML code with our free HTML Beautifier. Paste your HTML, choose your indent size, and get perfectly formatted, readable HTML in one click.

The formatter properly indents nested elements, handles void tags (br, img, input, etc.) correctly, preserves comments, and produces clean, consistent output. Choose between 2-space or 4-space indentation.

All processing is client-side — your code never leaves your browser. Perfect for debugging, code review, learning HTML structure, or cleaning up auto-generated HTML from CMS platforms and WYSIWYG editors.`,
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
    longDescription: `Protect your images with custom text watermarks. Our free Image Watermark tool lets you add text overlays with full control over font size, color, opacity, position, and rotation. Choose single placement (center, bottom-right, bottom-left) or tile the watermark across the entire image.

Upload any image, type your watermark text, adjust the settings in real-time, and download the watermarked image as a PNG. The live canvas preview updates instantly as you change settings — so you can see exactly how your watermark will look before downloading.

All processing happens in your browser using the Canvas API — your images are never uploaded to any server. Perfect for photographers, designers, content creators, and businesses who need to protect their visual content.`,
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
    longDescription: `Instantly convert file sizes between Bits, Bytes, Kilobytes (KB), Megabytes (MB), Gigabytes (GB), Terabytes (TB), and binary units (KiB, MiB, GiB). Enter a value in any unit and see all other conversions at once.

Includes a quick reference table for common conversions. One-click copy for any result. The tool uses binary (1024-based) calculations — the standard used by operating systems and file managers.

Perfect for developers, sysadmins, students, and anyone who needs to quickly convert between storage units. Completely client-side — no server calls needed for simple math.`,
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
    longDescription: `Format messy SQL queries into clean, readable code with our free SQL Formatter. The tool automatically uppercases SQL keywords, adds proper line breaks and indentation, and structures your queries for easy reading.

Supports SELECT, INSERT, UPDATE, DELETE, CREATE, JOIN, subqueries, and all standard SQL syntax. Choose between 2 or 4 space indentation. Paste a complex one-liner query and get beautifully formatted SQL in one click.

All formatting happens in your browser — your queries never leave your device. Essential for developers, DBAs, data analysts, and students working with databases. Makes code reviews, debugging, and learning SQL much easier.`,
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
    longDescription: `Convert XML to JSON instantly with our free online converter. The tool parses your XML, handles attributes (prefixed with @), nested elements, repeated elements (converted to arrays), and text content — producing clean, well-formatted JSON output.

Paste your XML, click convert, and get properly indented JSON. Choose between 2 or 4 space indentation. Error messages help you identify any XML parsing issues.

All conversion happens in your browser using the DOMParser API — your data never leaves your device. Perfect for API development, data migration, configuration file conversion, and any workflow that requires moving data between XML and JSON formats.`,
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
    longDescription: `Create cron expressions effortlessly with our visual Cron Generator. Select minutes, hours, days, months, and weekdays from dropdown menus — or choose from 10 common presets like "Every 5 minutes," "Every Monday at 9am," or "Every weekday."

The tool generates the cron expression in real-time and shows a plain English description of the schedule. You can also paste an existing cron expression to decode what it means.

Includes a syntax reference guide and supports all standard cron features: wildcards (*), lists (1,3,5), ranges (1-5), and step values (*/5). Perfect for setting up cron jobs, CI/CD schedules, cloud functions, and any system that uses cron syntax.`,
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
    longDescription: `Generate realistic fake data for testing, development, and prototyping with our free Fake Data Generator. Create random names, email addresses, phone numbers, physical addresses, company names, credit card numbers, dates, UUIDs, usernames, passwords, and more — all in one tool.

Choose from 10+ data types and generate up to 100 rows at once. Export as JSON, CSV, or copy individual values. The data looks realistic but is entirely fictional — perfect for populating test databases, creating demo content, filling mockups, testing form validation, and building prototypes without using real personal information.

Supports multiple locales including US, UK, India, and international formats. All generation happens in your browser — no API calls, no data stored, no signup required. GDPR-friendly since no real personal data is involved.

Essential for developers, QA testers, UI/UX designers, data analysts, and anyone who needs realistic-looking sample data without privacy concerns.`,
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
    longDescription: `Dictate text using your voice with our free Speech to Text tool. Click the microphone, start speaking, and watch your words appear in real-time. Supports continuous dictation with interim results shown in gray as the AI processes your speech.

Choose from 12+ languages including English, Hindi, Nepali, Spanish, French, German, Japanese, Chinese, and more. Download your transcription as a .txt file or copy it to clipboard.

Uses the Web Speech Recognition API built into Chrome and Edge — no downloads, no account, no data sent to ToolsArena servers. Note: the speech recognition engine itself is provided by your browser (Google for Chrome, Microsoft for Edge).`,
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
    longDescription: `Record your screen, a browser tab, or an application window directly in your browser — completely free with no watermarks, no time limits, and no downloads required. Optionally include microphone audio for narration.

Click "Start Recording," choose what to share (entire screen, app window, or browser tab), and the recording begins immediately. A live timer shows your recording duration. When done, preview your recording and download it as a WebM video file.

Uses the browser's native MediaRecorder API and getDisplayMedia API — your screen recording never touches any server. Everything is processed locally. Perfect for tutorials, bug reports, presentations, demos, and quick screen captures.`,
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
    longDescription: `Instantly see your public IP address along with detailed location information including city, region, country, timezone, postal code, ISP/organization, and geographic coordinates.

Your IP is displayed prominently with a one-click copy button. You can also look up any other IP address to see its location details. The tool uses the free ipinfo.io API to fetch accurate geolocation data.

Note: Unlike most ToolsArena tools, this one does make an external API call to ipinfo.io to look up IP information. We display a privacy notice about this. No data is stored by ToolsArena — the API call goes directly from your browser to ipinfo.io.`,
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
    longDescription: `Convert your images (JPEG, PNG) into a single PDF document with our free Image to PDF converter. Upload multiple images, arrange them in your preferred order, set page size (A4, US Letter, or fit-to-image), adjust margins, and generate a professional-looking PDF.

Each image becomes one page in the PDF. Images are centered on the page and scaled to fit while maintaining their aspect ratio. Reorder images before generating to control the page sequence.

All processing happens in your browser using the pdf-lib library — your images are never uploaded to any server. Perfect for scanning documents, combining photos into an album, creating portfolios, or sending multiple images as a single file.`,
    category: 'pdf-tools',
    targetKeyword: 'image to pdf converter',
    secondaryKeywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'convert image to pdf', 'photo to pdf', 'images to pdf online', 'picture to pdf free'],
    metaTitle: 'Image to PDF Converter — Convert Photos to PDF Online Free',
    metaDescription: 'Convert images to PDF online for free. Multiple images, custom page size & margins. Arrange pages before generating. No upload — images stay on your device.',
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
    longDescription: `A simple, distraction-free online whiteboard for sketching ideas, drawing diagrams, brainstorming, or just doodling. Choose from 9 preset colors plus a custom color picker, adjust brush size, use the eraser, and undo mistakes.

Features pen and eraser tools, 9+ colors, adjustable line width, undo history (up to 30 steps), and download as PNG. The canvas supports both mouse and touch input — works on tablets and touchscreen devices.

No account, no saving to cloud — it is a quick-use whiteboard for when you need to sketch something fast. Download your drawing as a PNG image when done. Everything runs locally in your browser with zero latency.`,
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
    longDescription: `Take the ultimate Typing Speed Test and find out how fast you can type! This free online tool measures your Words Per Minute (WPM) and accuracy in real time as you type a given passage. Choose from 1, 2, 3, or 5-minute test durations to match your practice routine.

As you type, the tool highlights correct characters in green and errors in red, giving you instant visual feedback. A live WPM counter, accuracy percentage, and error count are displayed throughout the test so you can track your performance in real time.

After the test, you get a detailed results page showing your final WPM, accuracy, total characters typed, correct characters, and errors. A visual comparison chart shows how your speed compares to beginner, average, fast, and excellent typists worldwide. Whether you're a student, professional, or competitive typist — practice daily to improve your speed and accuracy.

This tool works 100% in your browser. No sign-up, no downloads, no data collection. Your typing data never leaves your device.`,
    category: 'utility-tools',
    targetKeyword: 'typing speed test',
    secondaryKeywords: ['typing test', 'wpm test', 'typing speed test online', 'online typing test', 'free typing test', 'typing practice', 'words per minute test', 'keyboard speed test', 'typing test english', 'typing master online', 'fast typing test', 'typing speed checker'],
    metaTitle: 'Typing Speed Test - Free Online WPM Typing Test',
    metaDescription: 'Test your typing speed and accuracy with our free online typing test. Measure WPM, track errors, and compare your speed. No signup needed — works in your browser.',
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
    longDescription: `Create perfect passport size photos online for free with our Passport Photo Maker. Upload any photo, crop it to the exact dimensions required by your country, choose a background color, and download the result instantly — no sign-up or software needed.

Supports standard passport photo sizes for India (2x2 inches), US (2x2 inches), UK (35x45 mm), EU/Schengen (35x45 mm), China (33x48 mm), Japan (35x45 mm), and custom dimensions. The interactive crop tool with guide lines helps you position your face perfectly within the frame.

Need to print? Use the "Print Sheet" button to generate a 4x6 inch sheet with multiple passport photos arranged for easy printing at home or at a photo shop. All processing happens in your browser — your photo never leaves your device.`,
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
    longDescription: `Our Love Calculator is a fun, entertaining tool that calculates the love compatibility percentage between two names. Simply enter your name and your partner's name, and the algorithm generates a unique compatibility score with a personalized love message.

The tool uses a deterministic hash algorithm — meaning the same two names will always produce the same result, making it perfect for sharing with friends or your special someone. The beautiful animated heart displays your love percentage with smooth animations and color-coded results.

This is purely for entertainment purposes. Whether you score 99% or 30%, remember that real love is built on trust, respect, and communication — not algorithms! Share your results on social media and have fun with friends.`,
    category: 'utility-tools',
    targetKeyword: 'love calculator',
    secondaryKeywords: ['love meter', 'love percentage calculator', 'love tester', 'love compatibility test', 'love calculator by name', 'love match calculator', 'true love calculator', 'crush calculator', 'name love calculator', 'love calculator online'],
    metaTitle: 'Love Calculator - Free Love Compatibility Test by Name',
    metaDescription: 'Calculate your love compatibility! Enter two names and get your love percentage with a fun animated result. Free online love calculator — no signup needed.',
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
    longDescription: `Download YouTube video thumbnails in all available resolutions with our free YouTube Thumbnail Downloader. Simply paste the video URL or ID, and instantly get thumbnails in maximum resolution (1280x720), standard (640x480), high quality (480x360), medium (320x180), and default (120x90) sizes.

Each thumbnail can be downloaded with a single click or you can copy the direct image URL. The tool supports all YouTube URL formats including standard watch URLs, short youtu.be links, embed URLs, and YouTube Shorts.

Perfect for content creators, bloggers, and designers who need high-quality YouTube thumbnails for reference, analysis, or inspiration. All processing happens in your browser — no server-side storage or tracking.`,
    category: 'utility-tools',
    targetKeyword: 'youtube thumbnail downloader',
    secondaryKeywords: ['youtube thumbnail download', 'yt thumbnail downloader', 'youtube video thumbnail', 'download youtube thumbnail hd', 'youtube thumbnail grabber', 'youtube thumbnail saver', 'youtube thumbnail image download', 'yt thumbnail download hd'],
    metaTitle: 'YouTube Thumbnail Downloader - Download HD Thumbnails Free',
    metaDescription: 'Download YouTube video thumbnails in HD, SD, and all sizes. Paste the URL, get all thumbnails instantly. Free online tool — no signup needed.',
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
    longDescription: `Estimate how much money a YouTube channel or video earns with our free YouTube Money Calculator. Enter daily views, total video views, or subscribers to get instant earnings estimates based on real CPM (Cost Per Mille) data for different countries and niches.

The calculator uses industry-standard CPM ranges — from $0.25 for developing markets to $15+ for high-value niches like finance, insurance, and technology in the US. Customize the CPM slider to match your niche, select your primary audience country, and see estimated daily, monthly, and yearly revenue.

Features include a visual earnings breakdown chart, CPM comparison by country and niche, a subscriber milestone tracker showing projected earnings at 1K, 10K, 100K, and 1M subscribers, and tips to increase your YouTube revenue. All calculations are instant and run in your browser.

Perfect for aspiring YouTubers planning their content strategy, existing creators benchmarking earnings, and anyone curious about how much YouTubers make. No signup required, no data stored.`,
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
    longDescription: `Calculate your Instagram engagement rate with our free Instagram Engagement Calculator. Enter your total followers, average likes, and average comments per post to get your engagement rate percentage — the key metric brands use to evaluate influencer partnerships.

The tool calculates engagement rate using the standard formula: (Average Likes + Average Comments) / Total Followers × 100. It provides a rating (Excellent, Good, Average, Low) based on industry benchmarks, comparison with average rates by follower count, estimated post reach, and tips to improve your engagement.

Features include engagement rate by follower tier benchmarks (nano to mega influencers), estimated earnings per post based on your engagement rate, and a visual engagement score meter. Perfect for influencers checking their stats, brands evaluating creators, and social media managers tracking account health.

All calculations happen instantly in your browser — no Instagram login required, no data stored.`,
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
    longDescription: `Create a professional digital signature online for free with our Signature Maker. Choose between two modes: draw your signature with your mouse, trackpad, or touchscreen, or type your name and select from multiple signature fonts.

Customize your signature with different ink colors (black, blue, red, green, brown, purple), adjust pen thickness for drawn signatures, or change font style and size for typed signatures. The tool includes undo functionality and a clear canvas option for drawn signatures.

Download your signature as a standard PNG with a white background, or as a transparent PNG — perfect for placing on documents, contracts, PDFs, emails, or digital forms. All processing happens locally in your browser. Your signature data is never uploaded or stored.`,
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
    longDescription: `Create a professional marriage biodata online for free with our Marriage Biodata Maker. Choose from 10 beautifully designed templates — Classic Gold, Royal Blue, Floral Pink, Modern Minimal, Auspicious Red, Ganesh Blessing, Peacock Green, Elegant Purple, Simple White, and Saffron — each crafted for Indian matrimonial traditions.

Fill in your personal details, education, career, family information, and partner expectations through an easy step-by-step form. Upload your photo, preview the biodata in real time, and download it as a high-quality PNG image or PDF — ready to share with family, matrimonial agents, or on marriage portals.

All fields are optional except your name, so you can include as much or as little detail as you want. Your data never leaves your browser — everything is processed locally with 100% privacy. No signup, no watermarks, no hidden charges.`,
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
    longDescription: `India's most comprehensive Electricity Bill Calculator covering 15 states with accurate domestic tariff slabs for FY 2025-26. Select your state, enter units consumed, and instantly see a detailed bill breakdown including energy charges, fixed charges, meter rent, fuel surcharge, and electricity duty.

The calculator shows slab-wise breakdown with visual bars so you can understand exactly how your bill is computed at each tariff tier. Supported states include Maharashtra (MSEDCL), Delhi (BSES/Tata Power), Karnataka (BESCOM), Tamil Nadu (TNEB), Uttar Pradesh (UPPCL), Rajasthan, Gujarat, Madhya Pradesh, West Bengal, Andhra Pradesh, Telangana, Kerala, Punjab, Bihar, and Haryana.

View your bill in monthly, quarterly, and annual projections. Includes an appliance power consumption guide showing daily kWh usage for LED bulbs, fans, AC, refrigerator, and more. Also features energy-saving tips to help you reduce your electricity bill. Custom rate option available if your state is not listed.`,
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
    longDescription: `Text Repeater lets you duplicate any text, word, or phrase up to 10,000 times in a single click. Choose from multiple separator options — new line, space, comma, dash, tab, or a custom separator of your choice.

Features include optional line numbering (1. 2. 3...), live character and word count, and instant copy to clipboard. Quick count presets from 5x to 5000x make common tasks fast.

Perfect for generating test data, filling forms, creating WhatsApp/Instagram text art, SEO testing, load testing, and any task where you need repeated text. The tool runs 100% in your browser — your text is never sent to any server.`,
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
    longDescription: `India's most detailed Old vs New Tax Regime comparison calculator, updated for FY 2025-26 (AY 2026-27) as per Budget 2025. Enter your gross income and deductions to instantly see which regime saves you more money.

The calculator computes your taxable income and tax payable under both regimes with full slab-wise visual breakdown. For the Old Regime, enter your deductions: Section 80C (PPF, ELSS, LIC), Section 80D (health insurance), Section 80CCD(1B) (NPS), Section 80E (education loan interest), home loan interest (Section 24b), and HRA exemption.

New Regime features for FY 2025-26: basic exemption at Rs 4 lakh, standard deduction of Rs 75,000, and rebate under Section 87A making income up to Rs 12 lakh effectively tax-free. Old Regime features: basic exemption at Rs 2.5 lakh, standard deduction of Rs 50,000, all Chapter VIA deductions allowed, and HRA exemption.

Both calculations include surcharge (for income above 50L) and 4% health & education cess. Side-by-side comparison cards show the exact savings with a clear recommendation on which regime to choose.`,
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
    longDescription: `Upload any image and instantly extract its dominant color palette using advanced k-means clustering algorithm. The tool identifies 4 to 12 colors from your image, showing each color with HEX, RGB, and HSL values, plus the percentage of the image each color represents.

Click any color to copy its HEX code. The palette strip at the top shows all colors proportionally. Export the entire palette as CSS custom properties (variables) for use in your web projects.

The color extraction runs entirely in your browser using HTML5 Canvas — no image is uploaded to any server. Works with PNG, JPG, and WEBP images. Perfect for designers, web developers, illustrators, and anyone who needs to match colors from a reference image, create brand color schemes, or find complementary colors for their projects.`,
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
    longDescription: `Create hilarious memes in seconds with our free online Meme Generator. Upload any image or use a blank colored canvas, then add multiple text layers with full customization — font size, fill color, stroke color, bold styling, and precise positioning by drag-and-drop.

Each text layer can be independently styled and positioned anywhere on the image. The Impact font with white fill and black stroke gives you that classic meme look, but you can customize colors for any style. Add as many text layers as you need.

Features include drag-to-reposition text, adjustable canvas size, background color picker for blank canvas mode, and high-quality PNG download. Perfect for creating memes for social media, WhatsApp groups, Instagram stories, and Twitter posts. Everything runs in your browser — no watermark, no signup, no limits.`,
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
    longDescription: `Extract text from any image using powerful Optical Character Recognition (OCR) powered by Tesseract.js. Upload a photo, screenshot, scanned document, or handwritten note — the tool will recognize and extract all readable text from it.

Supports 18+ languages including English, Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati, Malayalam, Punjabi, Urdu, Arabic, French, German, Spanish, Japanese, Korean, and Chinese. Select the correct language for better accuracy.

The OCR engine runs 100% in your browser — your images are never uploaded to any server, ensuring complete privacy. Features include real-time progress tracking, word and character count, copy to clipboard, and download as .txt file.

Tips for best results: use clear, high-resolution images with good contrast between text and background. Ensure text is not rotated or heavily skewed. Cropping the image to include only the text area significantly improves accuracy.`,
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
    longDescription: `Create beautiful photo collages in seconds with our free online Photo Collage Maker. Choose from 10 professionally designed layouts — 2-photo splits, 3-photo focus layouts, 4/6/9 grids, and asymmetric designs. Upload your photos and they automatically fill the layout cells.

Customize every aspect: border width (0-14px), corner radius, and background color. Choose from preset output sizes for Instagram Post (1080x1080), Instagram Story (1080x1920), Facebook Cover (820x312), HD landscape (1920x1080), and more.

Photos are automatically center-cropped to fill each cell, ensuring the best composition regardless of original photo dimensions. Add, remove, and reorder photos easily. The collage preview updates in real-time as you make changes.

Download your collage as a high-quality PNG image. Perfect for social media posts, family photo albums, event galleries, before/after comparisons, and creative projects. Everything runs in your browser — no watermark, no signup, no limits.`,
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
    longDescription: `Compress any image to an exact target file size in KB with our free online tool. Need to compress an image to exactly 50 KB, 100 KB, or 200 KB for a form upload, email attachment, or website requirement? This tool uses a smart binary search algorithm to find the perfect JPEG quality setting that produces a file as close as possible to your target size.

Upload your JPG, PNG, or WebP image, enter your desired file size in KB, and the tool automatically iterates through quality levels (up to 20 iterations) to find the closest match. You get full details: the resulting file size, JPEG quality used, compression percentage, and iteration count.

All processing happens entirely in your browser using the HTML5 Canvas API — your images are never uploaded to any server. No watermarks, no signup, no limits. Perfect for government form uploads, job applications, passport photo submissions, and any scenario where exact file size matters.`,
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
    longDescription: `Paraphrase and rewrite your text in 6 different styles with our free online Paraphrasing Tool. Choose from Standard (clear rewording), Formal (professional tone), Casual (friendly & simple), Shorter (concise version), Longer (expanded version), or Creative (unique phrasing).

The tool uses an intelligent synonym replacement engine with context-aware transformations. Formal mode converts contractions and informal language to professional wording. Casual mode simplifies complex vocabulary. Shorter mode removes filler words. Longer mode adds connecting phrases for elaboration. Creative mode restructures sentences for fresh perspectives.

Features include live word count comparison between original and paraphrased text, percentage change indicator, copy to clipboard, and instant mode switching. Process runs 100% in your browser — your text is never sent to any server, ensuring complete privacy.

Perfect for students rewriting essays, professionals improving emails, content writers creating unique versions, and anyone who needs to express the same idea in different words.`,
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
    relatedToolSlugs: ['word-counter', 'case-converter', 'text-repeater', 'lorem-ipsum-generator'],
    icon: 'Wand2',
    isPopular: true,
    isNew: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'ai-text-humanizer',
    name: 'AI Text Humanizer',
    shortDescription: 'Make AI-generated text sound natural and human-written. Bypass AI detectors instantly.',
    longDescription: `Transform robotic AI-generated text into natural, human-sounding content with our free AI Text Humanizer. Whether you wrote with ChatGPT, Gemini, Claude, or any other AI, this tool restructures your text to sound authentic and bypass AI detection tools like GPTZero, Turnitin, and Originality.ai.

The humanizer applies 7 powerful transformations: adds natural contractions, replaces overused AI phrases ("delve into", "it's important to note"), varies sentence length, injects conversational transitions, removes robotic patterns, adds personal touches, and reduces passive voice. Choose from 4 intensity levels — Light, Medium, Heavy, and Aggressive — to control how much the text changes.

A built-in AI Detection Score gives you a real-time estimate of how "AI-like" or "human-like" your text sounds, with a visual meter. The tool processes text 100% in your browser — nothing is sent to any server, so your content stays completely private. No signup, no limits, no watermarks.

Perfect for students, bloggers, content writers, marketers, and professionals who use AI as a writing assistant but want the final output to read naturally and pass AI detection checks.`,
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
  // ─── NEW BATCH: Finance, Utility & Lifestyle Tools ──────────────────────────
  {
    slug: 'rent-receipt-generator',
    name: 'Rent Receipt Generator',
    shortDescription: 'Generate HRA rent receipts for tax saving with PDF download.',
    longDescription: `Generate professional rent receipts instantly for HRA tax exemption claims. Our Rent Receipt Generator creates multiple monthly receipts with all required details — tenant name, landlord name, address, rent amount, payment mode, and revenue stamp.

Enter your rental details once and generate receipts for any period (monthly, quarterly, or full financial year). Each receipt includes a unique receipt number, date, amount in words, and space for landlord signature and revenue stamp.

Download all receipts as a single PDF file — ready to submit to your employer for HRA exemption under Section 10(13A). The tool also shows a PAN warning when annual rent exceeds ₹1,00,000 as required by Income Tax rules. 100% free, no signup, works offline in your browser.`,
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
    longDescription: `Create professional salary slips (payslips) instantly with the ToolsArena Salary Slip Generator. Fill in company details, employee information, earnings, and deductions — and download a clean, well-formatted salary slip as PNG or PDF.

The tool auto-calculates HRA (40% or 50% of basic salary) and Provident Fund (12% of basic) with options to override with custom amounts. Add all standard Indian salary components including Basic Salary, HRA, Conveyance Allowance, Medical Allowance, Special Allowance, Professional Tax, TDS, and ESI.

Everything runs 100% in your browser — no data is sent to any server. Your employee details, salary figures, and company information stay completely private. Perfect for HR departments, small businesses, startups, and freelancers who need to generate monthly payslips quickly.

Features include live preview, company logo upload, custom earning/deduction line items, and instant PNG or PDF download. The generated salary slip includes company header, employee details grid, earnings and deductions table, net pay summary, and authorized signatory line.`,
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
    longDescription: `Generate WhatsApp click-to-chat links (wa.me) that let anyone message you without saving your number. Perfect for businesses, freelancers, and social media profiles.

Enter a phone number with country code, add an optional pre-filled message, and get your wa.me link instantly. The tool also generates the API link format for website integration, a QR code for print materials, and ready-to-use HTML button code.

Supports 20+ country codes including India (+91), USA (+1), UK (+44), UAE (+971), and more. Choose from quick message templates for common scenarios like order inquiries, appointments, support, and price quotes. Share your WhatsApp link on Instagram bio, Facebook, Google My Business, or embed it on your website.`,
    category: 'utility-tools',
    targetKeyword: 'WhatsApp link generator',
    secondaryKeywords: ['wa.me link generator', 'WhatsApp chat link', 'click to chat WhatsApp', 'WhatsApp direct message link', 'WhatsApp link for website', 'WhatsApp QR code generator'],
    metaTitle: 'WhatsApp Link Generator - Create wa.me Chat Links Free',
    metaDescription: 'Create WhatsApp click-to-chat links instantly. Generate wa.me links with pre-filled messages, QR codes & HTML buttons. Free WhatsApp link generator — no signup.',
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
    longDescription: `Calculate your gratuity entitlement as per India's Payment of Gratuity Act, 1972. Enter your last drawn basic salary, dearness allowance, and years of service to get an instant calculation of your gratuity amount.

The calculator supports both employee categories — those covered under the Act (organizations with 10+ employees, divisor = 26) and those not covered (divisor = 30). It automatically rounds up service years when the last year exceeds 6 months, as per the Act's rules.

See the complete breakdown including tax implications — gratuity up to ₹20 lakh is tax-free for employees covered under the Act. The visual tax bar shows your exempt vs taxable portions. Quick presets help you estimate gratuity for common salary-tenure combinations instantly.`,
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
    longDescription: `Calculate your House Rent Allowance (HRA) tax exemption under Section 10(13A) of the Income Tax Act. The calculator shows you exactly how much of your HRA is tax-exempt and how much is taxable — helping you plan your tax savings effectively.

HRA exemption is the minimum of three conditions: (1) Actual HRA received, (2) Rent paid minus 10% of basic salary + DA, and (3) 50% of basic + DA for metro cities or 40% for non-metro cities. Our calculator computes all three conditions and highlights which one determines your exemption.

See your annual tax savings at different slab rates (20% and 30%), switch between monthly and annual views, and use quick presets for common salary brackets. Metro cities include Delhi, Mumbai, Kolkata, and Chennai — all others are non-metro at 40% rate.`,
    category: 'calculators',
    targetKeyword: 'HRA calculator',
    secondaryKeywords: ['HRA exemption calculator', 'HRA calculator India', 'house rent allowance calculator', 'HRA tax exemption calculator', 'HRA calculator online', 'Section 10(13A) calculator'],
    metaTitle: 'HRA Calculator - Calculate HRA Exemption Online Free',
    metaDescription: 'Calculate HRA tax exemption under Section 10(13A). Free HRA calculator for metro & non-metro cities. See all 3 conditions, annual tax savings. Instant results.',
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
    longDescription: `Calculate your estimated due date (EDD) using four different methods — Last Menstrual Period (LMP), conception date, IVF transfer date, or ultrasound measurements. Our Pregnancy Calculator uses Naegele's rule and medical standards to provide accurate due date estimates.

See your current pregnancy week, trimester progress bar, and key milestone dates including first trimester end, anatomy scan week, full term date, and expected delivery. The week-by-week timeline shows 12 major pregnancy milestones with checkmarks for completed weeks.

Supports IVF pregnancies with Day 3 and Day 5 embryo options, and ultrasound-based calculation when you know gestational age from a scan. All calculations happen in your browser — your health data is never sent to any server.`,
    category: 'calculators',
    targetKeyword: 'pregnancy calculator',
    secondaryKeywords: ['due date calculator', 'pregnancy due date calculator', 'pregnancy week calculator', 'expected delivery date calculator', 'EDD calculator', 'pregnancy calculator India'],
    metaTitle: 'Pregnancy Due Date Calculator - Free EDD Calculator',
    metaDescription: 'Calculate your baby\'s due date by LMP, conception, IVF, or ultrasound. Free pregnancy calculator with week-by-week milestones & trimester tracker. Private & instant.',
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
    longDescription: `Calculate the total price of gold jewellery in India including gold value, making charges, GST, stone charges, and discounts. Supports all purity levels — 24K (99.9%), 22K (91.6%), 18K (75%), and 14K (58.5%).

Enter the current 24K gold rate per gram, select purity, enter weight in grams/tola/ounce/kg, and set making charges (percentage, per-gram, or flat). The calculator instantly shows a complete price breakdown with the effective cost per gram including all charges.

Compare rates across all four purity levels side by side. Use quick weight presets (1g to 100g) and rate presets for fast estimates. Essential tool for buying gold jewellery, evaluating prices at jewellers, or planning wedding jewellery budgets in India.`,
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
    longDescription: `Look up any Indian bank branch details using its IFSC code. Enter the 11-character IFSC code and instantly get the bank name, branch name, full address, city, district, state, MICR code, and supported payment methods (NEFT, RTGS, IMPS, UPI).

Powered by Razorpay's IFSC API with data for 150,000+ bank branches across India. The tool validates the IFSC format (AAAA0NNNNNN) and provides quick-access buttons for popular banks — SBI, HDFC, ICICI, Axis, PNB, BOB, Kotak, and more.

Essential for verifying bank details before making fund transfers, filling out forms, or setting up direct deposits. Copy any detail with one click. Works with all banks registered with RBI.`,
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
    longDescription: `Calculate your core numerology numbers using the Pythagorean system — the most widely used numerology method worldwide. Enter your full name and date of birth to discover five key numbers that reveal your life purpose, inner desires, and personality.

The calculator shows: Life Path Number (from DOB — your life journey), Destiny Number (from full name — your purpose), Soul Urge Number (from vowels — your inner desires), Personality Number (from consonants — how others see you), and Birthday Number (special talent).

See the letter-by-letter breakdown with color-coded vowels and consonants, detailed interpretations for each number including traits, strengths, challenges, and ideal careers. Supports Master Numbers (11, 22, 33) with special interpretations. For entertainment and self-reflection.`,
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
    longDescription: `Calculate the maturity amount of your Public Provident Fund (PPF) investment with our comprehensive PPF Calculator. Enter your annual deposit (₹500 to ₹1,50,000), interest rate, and tenure to see total invested amount, interest earned, and final maturity value.

The calculator features a visual donut chart showing the investment vs interest split, year-by-year breakdown table, and growth progress bar. Current PPF interest rate is 7.1% p.a. (Q4 FY 2025-26), compounded annually.

PPF is one of India's safest and most tax-efficient investment options with EEE (Exempt-Exempt-Exempt) status — your deposit qualifies for Section 80C deduction, interest earned is tax-free, and the maturity amount is also completely tax-free. Minimum tenure is 15 years, extendable in 5-year blocks.`,
    category: 'calculators',
    targetKeyword: 'PPF calculator',
    secondaryKeywords: ['PPF calculator India', 'PPF interest calculator', 'PPF maturity calculator', 'public provident fund calculator', 'PPF returns calculator', 'PPF calculator with yearly breakdown'],
    metaTitle: 'PPF Calculator India - Calculate PPF Returns Online Free',
    metaDescription: 'Calculate PPF maturity amount with year-by-year breakdown. Free PPF calculator India at 7.1% rate. See total interest earned, tax savings. Instant results.',
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
    longDescription: `Calculate expected returns on mutual fund investments with our comprehensive calculator. Supports three modes — SIP (monthly investment), Lumpsum (one-time investment), and SIP + Lumpsum (combined strategy).

Enter your investment amount, expected annual return rate, and investment period to see total invested amount, estimated returns, final corpus value, and wealth multiplier. The calculator features interactive sliders, visual growth bar chart, year-by-year breakdown table, and comparison metrics.

Browse fund category guidelines — Large Cap (10-12%), Mid Cap (12-15%), Small Cap (15-18%), Index Fund (10-13%), ELSS (12-15%), and Debt Fund (6-8%) — to set realistic return expectations. Understanding the power of compounding helps you make informed investment decisions for your financial goals.`,
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
    longDescription: `Create stunning greeting cards online for free with 50+ professionally designed templates. Choose from categories like Birthday, Wedding, Anniversary, Diwali, Holi, New Year, Valentine's Day, Mother's Day, Eid, Christmas, and many more.\n\nCustomize every detail — add the recipient's name, write a personal message, pick from 8 font styles, and choose accent colors. The live preview updates in real-time so you see exactly what your card looks like before downloading.\n\nShare your card instantly via a unique link (no sign-up required) or download as a high-quality PNG image. Everything runs in your browser — your data is never stored on any server. Perfect for sending wishes to loved ones via WhatsApp, email, or social media.`,
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
    longDescription: `Convert your CGPA to percentage instantly with support for all major grading systems worldwide. Whether you follow the Indian 10-point scale, the US 4.0 GPA system, the 5-point scale, or the Australian 7-point scale — get accurate percentage equivalents in one click.

**Key features:**
- **Multiple grading scales**: 10-point (CBSE, VTU, Anna University), 4-point (US GPA), 5-point, and 7-point (Australian).
- **Live conversion**: Adjust CGPA with a slider or number input and see percentage update in real-time.
- **Grade letter display**: See your grade (A+, A, B+, etc.) with color coding.
- **Cross-conversion table**: View equivalent GPA on all other scales simultaneously.
- **Grade chart**: Full grade range table for the selected scale.
- **SGPA to CGPA calculator**: Enter semester-wise SGPAs to compute cumulative CGPA and equivalent percentage.

Uses the standard Indian formula (CGPA x 9.5) and standard mapping tables for other systems. 100% browser-based — no data stored.`,
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
    longDescription: `Create perfect favicons for your website from any image or custom text/emoji. Upload a JPG, PNG, SVG, or WebP image, or design one from scratch using text characters and emojis with full control over colors, font, and border radius.

The tool generates favicons in all standard sizes: 16x16, 32x32, 48x48, 180x180 (Apple Touch Icon), 192x192, and 512x512 (PWA). Download individual PNG files and copy the ready-to-use HTML meta tags for your website's <head> section.

Everything runs in your browser using the Canvas API — no uploads to any server. Your images stay private and processing is instant.`,
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
    longDescription: `A must-have tool for college students to track and plan attendance. Two powerful modes:

**Check Attendance**: Enter total classes and classes attended to instantly see your current attendance percentage with a color-coded circular progress chart. Status indicators show whether you are in the Safe (>=75%), Warning (65-75%), or Danger (<65%) zone.

**Plan Attendance**: Set a target percentage (75%, 80%, 85%, or 90%) and find out exactly how many more classes you need to attend to reach your goal — or how many you can safely skip while staying above the threshold.

Visual SVG donut chart, real-time calculations, and quick-reference stats cards make it easy to stay on top of your attendance.`,
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
    longDescription: `Convert numbers between binary (base 2), decimal (base 10), octal (base 8), and hexadecimal (base 16) in real time. Type in any field and all other representations update instantly — no button clicks needed.

Supports arbitrarily large numbers using BigInt. See bit-level details including nibble and byte groupings, total bits needed, and whether the number fits in 8-bit, 16-bit, 32-bit, or 64-bit. Quick example chips let you explore common values like 255, 1024, and 65535.

Also includes a Text to Binary section: type any text and see each character's ASCII code, binary, and hex representation in a neat table. Perfect for programmers, students, and anyone working with number systems.`,
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
    longDescription: `Protect privacy by blurring faces, license plates, or any sensitive areas in your photos. Simply upload an image, draw rectangles over the areas you want to blur, adjust the blur intensity, and download the result.

Select multiple regions to blur at once. Each region is shown as a highlighted overlay so you can see exactly what will be blurred. Use the blur intensity slider to control the strength from subtle (5px) to heavy (50px). Undo individual regions or clear them all.

Everything runs 100% in your browser using the Canvas API — no images are uploaded to any server. Your photos remain completely private and processing is instant.`,
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
    longDescription: `The ToolsArena Certificate Maker is a free, no-signup tool that lets you create beautiful, professional certificates in seconds. Whether you need a Certificate of Achievement, Appreciation, Completion, Participation, Excellence, or Training — this tool has you covered.

Choose from 5 professionally designed templates: Classic (gold), Modern (blue), Elegant (green), Corporate (navy), and Creative (purple). Each template features ornamental borders, decorative accents, and elegant typography that looks like a real printed certificate.

Fill in the recipient name, certificate title, description, organization name, date, signatory details, and an optional certificate ID (auto-generated or custom). The live preview updates in real-time as you type, showing exactly how your certificate will look.

Everything runs 100% in your browser — your data never leaves your device. Download as a high-resolution PNG (2x scale) ready for printing or digital sharing. Perfect for schools, companies, training programs, workshops, and events.`,
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
    longDescription: `Protect your privacy by removing hidden EXIF metadata from your photos before sharing them online. EXIF data embedded in JPEG images can reveal your GPS location, camera make and model, date and time, software used, and other personal information.

This tool re-encodes your images using the Canvas API, which inherently strips all embedded metadata including EXIF, IPTC, XMP, GPS coordinates, camera info, and timestamps. Choose JPEG (with adjustable quality) or PNG output format. Process multiple images at once in batch mode.

Everything runs 100% in your browser — your images are never uploaded to any server and never leave your device.`,
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
    longDescription: `Create a production-ready robots.txt file with an intuitive visual editor. Add multiple user-agent groups with Allow/Disallow rules, set crawl-delay, and specify sitemap URLs.

Choose from quick presets — Allow All, Block All, Block AI Bots (GPTBot, ChatGPT-User, CCBot, Google-Extended), Standard, or WordPress Default — or build custom rules from scratch. The live preview updates in real time as you configure rules.

Copy the output to your clipboard or download it as a robots.txt file. Built-in validation warns you about conflicting rules, and the syntax guide explains every directive.`,
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
    longDescription: `Calculate and convert aspect ratios instantly with our free Aspect Ratio Calculator. Two powerful modes help you work with any ratio:

**Calculate Ratio**: Enter width and height to get the simplified aspect ratio (e.g., 1920x1080 = 16:9), decimal value, and percentage. A visual preview shows the proportional rectangle, and the tool highlights matching standard ratios like 16:9, 4:3, 1:1, and more.

**Resize by Ratio**: Select a preset ratio (16:9, 4:3, 1:1, 21:9, 3:2, 9:16, etc.) or use a custom ratio, enter one dimension, and the other calculates automatically. Lock/unlock width or height to control which dimension you set.

Includes a quick-reference table of common aspect ratios with names, use cases, and example resolutions. Click any ratio to instantly use it in the calculator. Perfect for video editors, photographers, designers, and developers working with responsive layouts.`,
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
  longDescription: `Generate professional barcodes online with our free Barcode Generator. Supports three popular formats: Code 128 (full ASCII alphanumeric), Code 39 (letters and numbers), and EAN-13 (13-digit product codes).

Customize bar width, height, colors, and toggle text display below the barcode. Download as PNG or copy to clipboard. Batch mode lets you generate multiple barcodes at once by entering one value per line.

Everything runs locally in your browser using the Canvas API — no data is uploaded to any server. Your barcode data stays completely private.`,
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
  longDescription: `Create a professional, legally-sounding privacy policy tailored to your website or application. Fill in your company details, select which types of data you collect, and toggle compliance sections for GDPR, CCPA, and COPPA.

The generated policy covers all essential sections including information collection, data usage, sharing practices, security measures, and user rights. Customize it for your specific needs — whether you collect personal info, cookies, payment data, location data, or use third-party analytics services like Google Analytics and Facebook Pixel.

Download as .txt or .html, or copy to clipboard instantly. The tool generates a comprehensive policy with a disclaimer that it is not legal advice — always consult a qualified attorney for your specific situation.`,
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
    longDescription: `Generate professional Terms & Conditions (Terms of Service) for your website, mobile app, e-commerce store, or SaaS product. Fill in your business details, select applicable clauses, and get a comprehensive legal document in minutes.

Choose which sections to include: user accounts, payments & refunds, intellectual property, user-generated content, prohibited activities, limitation of liability, termination, governing law, dispute resolution, and more.

The generated document uses standard legal language and covers all essential clauses. Download as HTML or plain text, or copy to clipboard. While comprehensive, we recommend consulting a legal professional for your specific jurisdiction. Completely free with no signup.`,
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
];

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
  // Word-boundary match: "ipl" matches "ipl squad" but not "multiple"
  const wordMatch = (text: string) =>
    new RegExp(`(^|\\s|-)${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(text);

  // Tier 1: name or slug starts with / contains query as a word, or targetKeyword word-matches
  const tier1 = tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.slug.includes(q) ||
    wordMatch(t.targetKeyword)
  );
  const seen = new Set(tier1.map(t => t.slug));

  // Tier 2: secondary keywords or category word-match
  const tier2 = tools.filter(t =>
    !seen.has(t.slug) && (
      t.secondaryKeywords.some(kw => wordMatch(kw)) ||
      wordMatch(t.category)
    )
  );

  return [...tier1, ...tier2];
}

export function getRelatedTools(slug: string, limit = 6): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tool.relatedToolSlugs
    .map(s => getToolBySlug(s))
    .filter((t): t is Tool => !!t)
    .slice(0, limit);
}
