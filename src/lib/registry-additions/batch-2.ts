// REGISTRY ADDITIONS - BATCH 2 (Nepal Converters)
import type { Tool } from '@/types/tools';

export const batch2Registrations: Tool[] = [
  {
    slug: 'nepal-land-converter',
    name: 'Nepal Land Measurement Converter',
    shortDescription: 'Convert Nepal land units: Ropani, Aana, Paisa, Dam, Bigha, Kattha, Dhur to sqft, m², acres instantly.',
    longDescription: `Nepal uses two distinct land measurement systems that can be confusing for anyone dealing with property transactions, legal documents, or land registration. This comprehensive Nepal Land Measurement Converter handles both systems simultaneously — the Pahad (hilly) system used in Kathmandu Valley and mountain districts, and the Terai (plains) system used across the southern flatlands.

The Pahad system is built around the Ropani as its base unit. One Ropani equals 5,476 square feet or approximately 508.72 square meters. Each Ropani is subdivided into 16 Aana, each Aana into 4 Paisa, and each Paisa into 4 Dam. This hierarchical system means 1 Ropani equals 64 Paisa or 256 Dam. When reading property documents in Kathmandu, Pokhara, Bhaktapur, or most hilly districts, you will encounter these units.

The Terai system centers on the Bigha as its primary unit. One Bigha in Nepal equals 72,900 square feet or 6,772.63 square meters — significantly larger than a Ropani. A Bigha divides into 20 Kattha, and each Kattha further divides into 20 Dhur. So 1 Bigha equals 400 Dhur. Land in districts like Chitwan, Jhapa, Sarlahi, Bara, Parsa, Morang, and other Terai districts is measured using this system.

Cross-system conversions are essential when comparing properties across regions. One Bigha equals approximately 13.31 Ropani, making Terai land plots generally much larger when compared to typical Pahad plots. Conversely, 1 Ropani equals about 0.0751 Bigha.

For international comparisons, both systems connect to standard metric and imperial measurements. One Ropani is approximately 0.1257 acres, while 1 Bigha equals about 1.674 acres. In metric terms, 1 Ropani is 508.72 m² and 1 Bigha is 6,772.63 m².

This tool is indispensable for real estate agents, property buyers and sellers, government land registration offices, legal professionals handling property cases, NRNs (Non-Resident Nepalis) buying land back home, and students learning about Nepal's land measurement systems. All conversions happen instantly in your browser — no signup, no data sent to servers, fully private and free to use.`,
    category: 'converters',
    targetKeyword: 'nepal land converter',
    secondaryKeywords: [
      'ropani to sqft',
      'aana to sqft nepal',
      'bigha to ropani nepal',
      'nepal land measurement converter',
      'kattha to sqft',
      'dhur to sqft nepal',
      'ropani aana paisa dam calculator',
      'nepal land unit converter',
    ],
    metaTitle: 'Nepal Land Measurement Converter - Ropani, Aana, Bigha, Sqft',
    metaDescription:
      'Convert Nepal land units instantly. Ropani to sqft, Aana to m², Bigha to Kattha, and all Nepal land measurements. Pahad and Terai systems.',
    howToSteps: [
      'Select your land measurement system: Pahad (Ropani) or Terai (Bigha) or International units',
      'Enter the land area in any unit — e.g., type 2.5 in the Ropani field',
      'All equivalent values in other units update instantly across all three panels',
      'View Pahad units (Ropani, Aana, Paisa, Dam) and Terai units (Bigha, Kattha, Dhur) simultaneously',
      'Use Quick Presets buttons to try common land sizes with one click',
      'Scroll down to see the full conversion reference table',
    ],
    faqs: [
      {
        question: 'How many square feet is 1 Ropani?',
        answer:
          '1 Ropani = 5,476 square feet or 508.72 square meters. It is the standard land measurement unit in the hilly regions of Nepal including Kathmandu Valley, Pokhara, and most mountain districts.',
      },
      {
        question: 'How many Aana in 1 Ropani?',
        answer:
          '1 Ropani = 16 Aana. Each Aana = 4 Paisa, and each Paisa = 4 Dam. So 1 Ropani = 16 Aana = 64 Paisa = 256 Dam. The full hierarchy is: Ropani → Aana → Paisa → Dam.',
      },
      {
        question: 'How many square feet in 1 Bigha in Nepal?',
        answer:
          '1 Bigha = 72,900 square feet or 6,772.63 square meters in Nepal. It is divided into 20 Kattha, and each Kattha is 20 Dhur, so 1 Bigha = 400 Dhur. Note: Bigha size varies by country — the Nepal Bigha is different from the Indian Bigha.',
      },
      {
        question: 'What is the difference between Pahad and Terai land systems?',
        answer:
          "Nepal uses the Ropani system (Ropani-Aana-Paisa-Dam) in hilly/mountain regions including the Kathmandu Valley, and the Bigha system (Bigha-Kattha-Dhur) in the Terai plains. Your property's land certificate (lalpurja) will use the system applicable to that district.",
      },
      {
        question: 'How to convert Ropani to Bigha?',
        answer:
          '1 Ropani = 0.0751 Bigha, or conversely, 1 Bigha = 13.31 Ropani. So a 10 Ropani plot equals approximately 0.751 Bigha. Use this converter to get precise values for any amount.',
      },
    ],
    relatedToolSlugs: ['unit-converter', 'nepali-date-converter', 'area-calculator'],
    icon: 'Map',
    isNew: true,
    isPopular: true,
    estimatedTime: 'Instant',
  },
  {
    slug: 'shree-lipi-to-unicode',
    name: 'Shree Lipi to Unicode Converter',
    shortDescription:
      'Convert Shree Lipi legacy Nepali font text to Unicode Devanagari instantly. Also supports Unicode to Shree Lipi.',
    longDescription: `Shree Lipi is one of the most widely used legacy Nepali font systems in Nepal, developed before Unicode became the global standard for text encoding. Since the 1990s, Nepal's government offices, newspapers, publishing houses, and print media have relied on Shree Lipi and similar ASCII-mapped fonts to produce Devanagari text. Millions of documents, books, legal papers, and news archives still exist in Shree Lipi format.

The core problem with legacy fonts like Shree Lipi is that they use ASCII character codes to represent Devanagari letters. The font file simply maps ASCII characters to Devanagari glyphs, making the text appear correct when that specific font is installed — but when opened on any other device or shared digitally, it appears as a jumble of English letters and symbols. You cannot search, index, or process this text with modern tools.

Unicode Devanagari, standardized by the Unicode Consortium, assigns unique code points to every Devanagari character, ensuring text looks and works correctly on every device, operating system, browser, and app worldwide — with no special font required. Converting legacy Shree Lipi content to Unicode makes it discoverable by search engines, compatible with all modern software, and preservable for the long term.

This converter handles the character-by-character mapping between Shree Lipi's ASCII encoding and the corresponding Unicode Devanagari code points. It covers all primary vowels, consonants, matras (vowel signs), Nepali numerals (०-९), and common punctuation. Both conversion directions are supported: Shree Lipi to Unicode and Unicode to Shree Lipi.

Common use cases include converting old newspaper archives, government documents, books scanned from Shree Lipi text, court documents, land records, academic papers, and personal correspondence written using legacy Nepali fonts. Journalists, government staff, archivists, historians, and anyone digitizing Nepali content will find this tool invaluable.

Note: The full Shree Lipi system includes complex conjunct consonants and special combinations that require contextual rules. This tool handles the core character set. For highly complex conjunct consonants in the output, manual verification is recommended.`,
    category: 'text-tools',
    targetKeyword: 'shree lipi to unicode converter',
    secondaryKeywords: [
      'shree lipi unicode converter',
      'shree lipi to unicode online',
      'convert shree lipi to unicode',
      'nepali font converter shree lipi',
      'unicode to shree lipi',
      'shree lipi converter online free',
    ],
    metaTitle: 'Shree Lipi to Unicode Converter - Free Online Nepali Font Converter',
    metaDescription:
      'Convert Shree Lipi legacy Nepali font to Unicode instantly. Free online tool for newspaper editors, government staff. Also Unicode to Shree Lipi.',
    howToSteps: [
      'Paste your Shree Lipi encoded text into the input box on the left',
      'The Unicode Devanagari text appears instantly in the output box on the right',
      'Click the Copy button to copy the converted text to your clipboard',
      'Use the "Unicode → Shree Lipi" tab for reverse conversion',
      'Click Download to save the converted text as a .txt file',
      'Use the Sample Text button to see a demonstration of the conversion',
    ],
    faqs: [
      {
        question: 'What is Shree Lipi?',
        answer:
          "Shree Lipi is a legacy Nepali font widely used in Nepal before Unicode standardization. It maps ASCII characters to Devanagari glyphs and is still commonly used in government offices, newspapers, and print media. It was created by Lava Software and became one of Nepal's most popular Devanagari typing solutions.",
      },
      {
        question: 'Why convert Shree Lipi to Unicode?',
        answer:
          'Unicode Nepali text works across all modern systems, websites, and apps. Shree Lipi text appears as gibberish on devices without the font installed. Converting to Unicode makes text universally readable, searchable by search engines, compatible with all software, and preservable for the long term.',
      },
      {
        question: 'Is this the same as Preeti font?',
        answer:
          'No. Shree Lipi and Preeti are different legacy fonts with different character mappings. The ASCII-to-Devanagari mapping differs between these fonts, so you must use the correct converter. Use a Preeti to Unicode converter for Preeti font text.',
      },
      {
        question: 'Which Shree Lipi version is supported?',
        answer:
          'This tool handles Shree Lipi 7 and common Shree Lipi variants. The core vowels, consonants, matras, and numerals are fully supported. For highly specialized versions or complex conjunct consonants, output may need minor manual corrections.',
      },
    ],
    relatedToolSlugs: ['case-converter', 'word-counter', 'character-counter', 'remove-duplicate-lines'],
    icon: 'Type',
    isNew: true,
    isPopular: false,
    estimatedTime: 'Instant',
  },
];
