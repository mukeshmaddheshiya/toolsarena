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
    metaTitle: 'Character Counter - Count Characters Online Free',
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
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    shortDescription: 'Calculate percentages, percent changes, and what percent one number is of another.',
    longDescription: `Percentages are everywhere — discounts, taxes, interest rates, exam scores, statistics — and our Percentage Calculator makes every type of percentage calculation simple and fast. The tool covers all common percentage problems in one place: finding X% of a number, calculating what percentage X is of Y, finding the original number before a percentage increase/decrease, and calculating percentage change between two values.

Students use it for calculating grade percentages and exam scores. Shoppers use it to calculate sale discounts and final prices. Accountants and business owners use it for profit margins, tax calculations, and growth rates. The tool shows step-by-step working for each calculation, so you understand how the result was reached.

All calculations happen instantly in your browser. No ads blocking your results, no popups, no account required. Just fast, accurate percentage math.`,
    category: 'calculators',
    targetKeyword: 'percentage calculator',
    secondaryKeywords: ['percent calculator', 'calculate percentage online', 'percentage change calculator', 'percent increase calculator', 'what percent of calculator'],
    metaTitle: 'Percentage Calculator - Calculate % Online Free | ToolsArena',
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
    metaTitle: 'EMI Calculator - Calculate Loan EMI Online Free | ToolsArena',
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
    metaTitle: 'QR Code Generator - Create QR Codes Free Online | ToolsArena',
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
    metaTitle: 'Hash Generator - MD5, SHA-256, SHA-512 Online Free | ToolsArena',
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
    metaTitle: 'Regex Tester - Test Regular Expressions Online Free | ToolsArena',
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
    metaTitle: 'HTML to Markdown Converter - Free Online Tool | ToolsArena',
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
    metaTitle: 'Image Compressor - Compress Images Online Free | ToolsArena',
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
    metaTitle: 'Image Resizer - Resize Images Online Free | ToolsArena',
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
    metaTitle: 'Image to Base64 Converter - Free Online Tool | ToolsArena',
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
    metaTitle: 'PDF Merge - Combine PDF Files Online Free | ToolsArena',
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
    metaTitle: 'PDF Split - Split PDF Pages Online Free | ToolsArena',
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
    estimatedTime: '3-15 seconds',
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
    isNew: true,
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
    metaTitle: 'Time Zone Checker - World Clock for Remote Teams | ToolsArena',
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
    isNew: true,
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
    metaTitle: 'Rashi Checker by Name - Find Your Rashi Free | ToolsArena',
    metaDescription: 'Find your Rashi (Vedic zodiac sign) by name instantly. Supports English & Hindi names. Get Rashi, ruling planet, element, lucky number & traits.',
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
    isNew: true,
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
    metaTitle: 'Gun Milan Calculator - Kundali Matching Free Online | ToolsArena',
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
    isNew: true,
    estimatedTime: 'Instant',
  },
];

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
  return tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.shortDescription.toLowerCase().includes(q) ||
    t.targetKeyword.toLowerCase().includes(q) ||
    t.secondaryKeywords.some(kw => kw.toLowerCase().includes(q)) ||
    t.category.toLowerCase().includes(q)
  );
}

export function getRelatedTools(slug: string, limit = 6): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tool.relatedToolSlugs
    .map(s => getToolBySlug(s))
    .filter((t): t is Tool => !!t)
    .slice(0, limit);
}
