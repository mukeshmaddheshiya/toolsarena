'use client';

import { useState, useMemo } from 'react';
import { Star, Languages } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RashiInfo {
  id: number;
  name: string;
  nameHindi: string;
  symbol: string;
  lord: string;
  lordHindi: string;
  element: string;
  elementHindi: string;
  color: string;
  bgLight: string;
  luckyColor: string;
  luckyNumber: number;
  luckyDay: string;
  luckyDayHindi: string;
  traits: string[];
  traitsHindi: string[];
  description: string;
  descriptionHindi: string;
  nakshatra: string;
  nakshatraHindi: string;
}

// ─── Rashi Data ───────────────────────────────────────────────────────────────
const RASHIS: RashiInfo[] = [
  {
    id: 1, name: 'Aries', nameHindi: 'मेष', symbol: '♈',
    lord: 'Mars', lordHindi: 'मंगल', element: 'Fire', elementHindi: 'अग्नि',
    color: 'from-red-500 to-orange-400', bgLight: 'bg-red-50 dark:bg-red-900/20',
    luckyColor: 'Red', luckyNumber: 9, luckyDay: 'Tuesday', luckyDayHindi: 'मंगलवार',
    traits: ['Leadership', 'Energy', 'Courage', 'Boldness'],
    traitsHindi: ['नेतृत्व', 'ऊर्जा', 'साहस', 'निडरता'],
    description: 'You are a natural leader with tremendous energy and enthusiasm. Ruled by Mars, you love adventure, are always ready to face challenges, and inspire others with your confidence.',
    descriptionHindi: 'आप एक स्वाभाविक नेता हैं जिनमें अपार ऊर्जा और उत्साह है। मंगल ग्रह के प्रभाव में आप साहसी, जोशीले और प्रेरणादायक होते हैं।',
    nakshatra: 'Ashwini, Bharani, Krittika (Pada 1)',
    nakshatraHindi: 'अश्विनी, भरणी, कृत्तिका (पद 1)',
  },
  {
    id: 2, name: 'Taurus', nameHindi: 'वृषभ', symbol: '♉',
    lord: 'Venus', lordHindi: 'शुक्र', element: 'Earth', elementHindi: 'पृथ्वी',
    color: 'from-emerald-600 to-teal-500', bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
    luckyColor: 'Green', luckyNumber: 6, luckyDay: 'Friday', luckyDayHindi: 'शुक्रवार',
    traits: ['Stability', 'Patience', 'Loyalty', 'Determination'],
    traitsHindi: ['स्थिरता', 'धैर्य', 'वफादारी', 'दृढ़ता'],
    description: 'Ruled by Venus, you are reliable, patient, and deeply devoted. You love comfort, beauty, and security. Your determination and practicality make you exceptionally dependable.',
    descriptionHindi: 'शुक्र ग्रह के प्रभाव में आप विश्वसनीय, धैर्यवान और सौंदर्यप्रिय होते हैं। आप स्थिरता और सुरक्षा को महत्व देते हैं।',
    nakshatra: 'Krittika (Pada 2–4), Rohini, Mrigashirsha (Pada 1–2)',
    nakshatraHindi: 'कृत्तिका (पद 2-4), रोहिणी, मृगशिरा (पद 1-2)',
  },
  {
    id: 3, name: 'Gemini', nameHindi: 'मिथुन', symbol: '♊',
    lord: 'Mercury', lordHindi: 'बुध', element: 'Air', elementHindi: 'वायु',
    color: 'from-yellow-500 to-amber-400', bgLight: 'bg-yellow-50 dark:bg-yellow-900/20',
    luckyColor: 'Yellow', luckyNumber: 5, luckyDay: 'Wednesday', luckyDayHindi: 'बुधवार',
    traits: ['Intelligence', 'Adaptability', 'Communication', 'Curiosity'],
    traitsHindi: ['बुद्धिमत्ता', 'अनुकूलनशीलता', 'संचार', 'जिज्ञासा'],
    description: 'Ruled by Mercury, you are intellectually gifted, quick-witted, and versatile. You thrive on communication, learning, and variety. Your adaptability lets you excel in many fields.',
    descriptionHindi: 'बुध ग्रह के प्रभाव में आप बुद्धिमान, चतुर और बहुमुखी होते हैं। आप बातचीत, सीखने और नई चीज़ों में रुचि रखते हैं।',
    nakshatra: 'Mrigashirsha (Pada 3–4), Ardra, Punarvasu (Pada 1–3)',
    nakshatraHindi: 'मृगशिरा (पद 3-4), आर्द्रा, पुनर्वसु (पद 1-3)',
  },
  {
    id: 4, name: 'Cancer', nameHindi: 'कर्क', symbol: '♋',
    lord: 'Moon', lordHindi: 'चंद्रमा', element: 'Water', elementHindi: 'जल',
    color: 'from-blue-400 to-cyan-400', bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    luckyColor: 'White', luckyNumber: 2, luckyDay: 'Monday', luckyDayHindi: 'सोमवार',
    traits: ['Nurturing', 'Intuition', 'Sensitivity', 'Compassion'],
    traitsHindi: ['पोषण करना', 'सहज ज्ञान', 'संवेदनशीलता', 'करुणा'],
    description: 'Ruled by the Moon, you are deeply intuitive, nurturing, and empathetic. You have strong family bonds and a natural ability to care for others. Home and loved ones are your world.',
    descriptionHindi: 'चंद्रमा के प्रभाव में आप भावुक, संवेदनशील और पोषण करने वाले होते हैं। परिवार और अपनों के प्रति आपका गहरा लगाव होता है।',
    nakshatra: 'Punarvasu (Pada 4), Pushya, Ashlesha',
    nakshatraHindi: 'पुनर्वसु (पद 4), पुष्य, आश्लेषा',
  },
  {
    id: 5, name: 'Leo', nameHindi: 'सिंह', symbol: '♌',
    lord: 'Sun', lordHindi: 'सूर्य', element: 'Fire', elementHindi: 'अग्नि',
    color: 'from-orange-500 to-yellow-400', bgLight: 'bg-orange-50 dark:bg-orange-900/20',
    luckyColor: 'Gold', luckyNumber: 1, luckyDay: 'Sunday', luckyDayHindi: 'रविवार',
    traits: ['Confidence', 'Generosity', 'Charisma', 'Creativity'],
    traitsHindi: ['आत्मविश्वास', 'उदारता', 'करिश्मा', 'रचनात्मकता'],
    description: 'Ruled by the Sun, you radiate warmth and confidence. A natural performer and leader, you are generous, loyal, and love being in the spotlight. Your charisma draws people to you.',
    descriptionHindi: 'सूर्य के प्रभाव में आप आत्मविश्वासी, उदार और करिश्माई होते हैं। आप प्राकृतिक नेता हैं और लोग स्वाभाविक रूप से आपकी ओर आकर्षित होते हैं।',
    nakshatra: 'Magha, Purva Phalguni, Uttara Phalguni (Pada 1)',
    nakshatraHindi: 'मघा, पूर्व फाल्गुनी, उत्तर फाल्गुनी (पद 1)',
  },
  {
    id: 6, name: 'Virgo', nameHindi: 'कन्या', symbol: '♍',
    lord: 'Mercury', lordHindi: 'बुध', element: 'Earth', elementHindi: 'पृथ्वी',
    color: 'from-lime-600 to-green-500', bgLight: 'bg-lime-50 dark:bg-lime-900/20',
    luckyColor: 'Green', luckyNumber: 5, luckyDay: 'Wednesday', luckyDayHindi: 'बुधवार',
    traits: ['Analysis', 'Perfectionism', 'Helpfulness', 'Precision'],
    traitsHindi: ['विश्लेषण', 'परिपूर्णता', 'सहायकता', 'सटीकता'],
    description: 'Ruled by Mercury, you are analytical, detail-oriented, and hardworking. You have a strong desire to be of service and are known for your precision, practicality, and high standards.',
    descriptionHindi: 'बुध ग्रह के प्रभाव में आप विश्लेषणात्मक, मेहनती और परिश्रमी होते हैं। आप हमेशा दूसरों की मदद के लिए तत्पर रहते हैं।',
    nakshatra: 'Uttara Phalguni (Pada 2–4), Hasta, Chitra (Pada 1–2)',
    nakshatraHindi: 'उत्तर फाल्गुनी (पद 2-4), हस्त, चित्रा (पद 1-2)',
  },
  {
    id: 7, name: 'Libra', nameHindi: 'तुला', symbol: '♎',
    lord: 'Venus', lordHindi: 'शुक्र', element: 'Air', elementHindi: 'वायु',
    color: 'from-pink-500 to-rose-400', bgLight: 'bg-pink-50 dark:bg-pink-900/20',
    luckyColor: 'Pink', luckyNumber: 6, luckyDay: 'Friday', luckyDayHindi: 'शुक्रवार',
    traits: ['Balance', 'Diplomacy', 'Harmony', 'Fairness'],
    traitsHindi: ['संतुलन', 'कूटनीति', 'सामंजस्य', 'न्याय'],
    description: 'Ruled by Venus, you seek balance, beauty, and harmony in all aspects of life. You are a natural diplomat — fair, charming, and always striving to find the middle ground.',
    descriptionHindi: 'शुक्र ग्रह के प्रभाव में आप संतुलन, सुंदरता और सद्भाव चाहते हैं। आप न्यायप्रिय, आकर्षक और कुशल मध्यस्थ होते हैं।',
    nakshatra: 'Chitra (Pada 3–4), Swati, Vishakha (Pada 1–3)',
    nakshatraHindi: 'चित्रा (पद 3-4), स्वाती, विशाखा (पद 1-3)',
  },
  {
    id: 8, name: 'Scorpio', nameHindi: 'वृश्चिक', symbol: '♏',
    lord: 'Mars', lordHindi: 'मंगल', element: 'Water', elementHindi: 'जल',
    color: 'from-purple-600 to-violet-500', bgLight: 'bg-purple-50 dark:bg-purple-900/20',
    luckyColor: 'Dark Red', luckyNumber: 9, luckyDay: 'Tuesday', luckyDayHindi: 'मंगलवार',
    traits: ['Intensity', 'Determination', 'Mystery', 'Passion'],
    traitsHindi: ['तीव्रता', 'दृढ़ता', 'रहस्यमयता', 'जुनून'],
    description: 'Ruled by Mars, you are intense, passionate, and fiercely determined. You possess deep emotional intelligence and are drawn to the mysteries of life. Your willpower is unmatched.',
    descriptionHindi: 'मंगल के प्रभाव में आप तीव्र, भावुक और अटल संकल्पी होते हैं। आपकी मनोवैज्ञानिक गहराई और इच्छाशक्ति असाधारण है।',
    nakshatra: 'Vishakha (Pada 4), Anuradha, Jyeshtha',
    nakshatraHindi: 'विशाखा (पद 4), अनुराधा, ज्येष्ठा',
  },
  {
    id: 9, name: 'Sagittarius', nameHindi: 'धनु', symbol: '♐',
    lord: 'Jupiter', lordHindi: 'बृहस्पति', element: 'Fire', elementHindi: 'अग्नि',
    color: 'from-violet-500 to-purple-400', bgLight: 'bg-violet-50 dark:bg-violet-900/20',
    luckyColor: 'Purple', luckyNumber: 3, luckyDay: 'Thursday', luckyDayHindi: 'गुरुवार',
    traits: ['Freedom', 'Wisdom', 'Optimism', 'Adventure'],
    traitsHindi: ['स्वतंत्रता', 'ज्ञान', 'आशावाद', 'साहसिकता'],
    description: 'Ruled by Jupiter, you are an optimistic adventurer and lifelong learner. You love philosophy, travel, and expanding your horizons. Your wisdom and enthusiasm are infectious.',
    descriptionHindi: 'बृहस्पति के प्रभाव में आप आशावादी, ज्ञानी और स्वतंत्रता-प्रेमी होते हैं। आप दर्शन, यात्रा और नई खोज में गहरी रुचि रखते हैं।',
    nakshatra: 'Mula, Purva Ashadha, Uttara Ashadha (Pada 1)',
    nakshatraHindi: 'मूल, पूर्व आषाढ़, उत्तर आषाढ़ (पद 1)',
  },
  {
    id: 10, name: 'Capricorn', nameHindi: 'मकर', symbol: '♑',
    lord: 'Saturn', lordHindi: 'शनि', element: 'Earth', elementHindi: 'पृथ्वी',
    color: 'from-slate-600 to-gray-500', bgLight: 'bg-slate-50 dark:bg-slate-900/20',
    luckyColor: 'Navy', luckyNumber: 8, luckyDay: 'Saturday', luckyDayHindi: 'शनिवार',
    traits: ['Discipline', 'Ambition', 'Responsibility', 'Perseverance'],
    traitsHindi: ['अनुशासन', 'महत्वाकांक्षा', 'जिम्मेदारी', 'दृढ़ता'],
    description: 'Ruled by Saturn, you are disciplined, ambitious, and incredibly hardworking. You set high goals and relentlessly pursue them. Your patience and perseverance always lead to success.',
    descriptionHindi: 'शनि ग्रह के प्रभाव में आप अनुशासित, महत्वाकांक्षी और अत्यंत परिश्रमी होते हैं। आपकी दृढ़ता आपको सफलता की ओर ले जाती है।',
    nakshatra: 'Uttara Ashadha (Pada 2–4), Shravana, Dhanishtha (Pada 1–2)',
    nakshatraHindi: 'उत्तर आषाढ़ (पद 2-4), श्रवण, धनिष्ठा (पद 1-2)',
  },
  {
    id: 11, name: 'Aquarius', nameHindi: 'कुम्भ', symbol: '♒',
    lord: 'Saturn', lordHindi: 'शनि', element: 'Air', elementHindi: 'वायु',
    color: 'from-sky-500 to-blue-400', bgLight: 'bg-sky-50 dark:bg-sky-900/20',
    luckyColor: 'Blue', luckyNumber: 8, luckyDay: 'Saturday', luckyDayHindi: 'शनिवार',
    traits: ['Innovation', 'Independence', 'Humanitarianism', 'Originality'],
    traitsHindi: ['नवाचार', 'स्वतंत्रता', 'मानवता', 'मौलिकता'],
    description: 'Ruled by Saturn, you are a visionary innovator and free spirit. You are drawn to humanitarian causes, progressive ideas, and community improvement. Your originality sets you apart.',
    descriptionHindi: 'शनि के प्रभाव में आप दूरदर्शी, नवोन्मेषी और स्वतंत्र विचारक होते हैं। आप मानवता की सेवा और समाज सुधार में रुचि रखते हैं।',
    nakshatra: 'Dhanishtha (Pada 3–4), Shatabhisha, Purva Bhadrapada (Pada 1–3)',
    nakshatraHindi: 'धनिष्ठा (पद 3-4), शतभिषा, पूर्व भाद्रपद (पद 1-3)',
  },
  {
    id: 12, name: 'Pisces', nameHindi: 'मीन', symbol: '♓',
    lord: 'Jupiter', lordHindi: 'बृहस्पति', element: 'Water', elementHindi: 'जल',
    color: 'from-teal-500 to-cyan-400', bgLight: 'bg-teal-50 dark:bg-teal-900/20',
    luckyColor: 'Sea Green', luckyNumber: 3, luckyDay: 'Thursday', luckyDayHindi: 'गुरुवार',
    traits: ['Empathy', 'Intuition', 'Creativity', 'Spirituality'],
    traitsHindi: ['सहानुभूति', 'सहज ज्ञान', 'रचनात्मकता', 'आध्यात्मिकता'],
    description: 'Ruled by Jupiter, you are deeply empathetic, creative, and spiritually inclined. You have a rich inner world and strong intuition. Your compassion for others is boundless.',
    descriptionHindi: 'बृहस्पति के प्रभाव में आप अत्यधिक संवेदनशील, रचनात्मक और आध्यात्मिक होते हैं। आपकी अंतर्ज्ञान शक्ति और करुणा अतुलनीय है।',
    nakshatra: 'Purva Bhadrapada (Pada 4), Uttara Bhadrapada, Revati',
    nakshatraHindi: 'पूर्व भाद्रपद (पद 4), उत्तर भाद्रपद, रेवती',
  },
];

// ─── Syllable → Rashi Mapping ─────────────────────────────────────────────────
// Based on traditional 108 Nakshatra-pada akshara system
// Longer matches are tried first
const SYLLABLE_MAP: [string, number][] = [
  // 3+ char matches (most specific)
  ['chu', 1], ['che', 1], ['cho', 1],         // Ashwini → Aries
  ['bhu', 9], ['bhi', 9], ['bha', 9],          // Mula → Sagittarius
  ['dha', 9], ['pha', 9], ['fa', 9],            // Purva Ashadha → Sagittarius
  ['sha', 6], ['shi', 6],                        // Hasta → Virgo
  ['tha', 6],                                    // Hasta → Virgo
  ['gha', 3],                                    // Ardra → Gemini
  ['kha', 10], ['khi', 10], ['khu', 10], ['khe', 10], ['kho', 10], // Shravana → Capricorn
  ['chi', 12], ['cha', 12],                      // Revati → Pisces
  ['jha', 12], ['tra', 12], ['tri', 12],         // Uttara Bhadrapada → Pisces
  ['dhu', 12],                                   // Uttara Bhadrapada → Pisces

  // 2-char sequences
  ['la', 1], ['li', 1], ['lu', 1], ['le', 1], ['lo', 1],   // Bharani → Aries
  ['va', 2], ['vi', 2], ['vu', 2], ['ve', 2], ['vo', 2],   // Rohini → Taurus
  ['ba', 2], ['bi', 2], ['bu', 2],                           // Rohini alt → Taurus
  ['ka', 2], ['ki', 3], ['ku', 3], ['ke', 3], ['ko', 3],   // Mrigashirsha → Taurus/Gemini
  ['ha', 3], ['hi', 3],                                      // Punarvasu → Gemini
  ['hu', 4], ['he', 4], ['ho', 4],                           // Pushya → Cancer
  ['da', 4], ['di', 4], ['do', 4],                           // Ashlesha → Cancer
  ['du', 12], ['de', 12],                                    // Uttara Bhadrapada → Pisces
  ['ma', 5], ['mi', 5], ['mu', 5], ['me', 5], ['mo', 5],   // Magha → Leo
  ['ta', 5], ['ti', 6], ['tu', 6], ['te', 6],               // Phalguni → Leo/Virgo
  ['pa', 6], ['pi', 6], ['pu', 6], ['pe', 6], ['po', 6],   // Hasta/Chitra → Virgo
  ['na', 6],                                                 // Hasta → Virgo
  ['ra', 7], ['ri', 7], ['ru', 7], ['re', 7], ['ro', 7],   // Chitra/Swati → Libra
  ['to', 7],                                                 // Swati → Libra
  ['ni', 8], ['nu', 8], ['ne', 8], ['no', 8],               // Anuradha/Jyeshtha → Scorpio
  ['ya', 8], ['yi', 8], ['yu', 8],                           // Jyeshtha → Scorpio
  ['ye', 9], ['yo', 9],                                      // Mula → Sagittarius
  ['be', 9], ['bo', 9],                                      // Uttara Ashadha pada 1 → Sagittarius
  ['ja', 9], ['ji', 9],                                      // Uttara Ashadha → Sagittarius
  ['ju', 10], ['je', 10], ['jo', 10],                        // Shravana → Capricorn
  ['ga', 10], ['gi', 10], ['gu', 10], ['ge', 10],           // Dhanishtha → Capricorn
  ['go', 11],                                                // Dhanishtha pada 3-4 → Aquarius
  ['sa', 11], ['si', 11], ['su', 11], ['se', 11], ['so', 11], // Shatabhisha → Aquarius

  // Single vowels (Krittika pada 1 → Aries)
  ['a', 1], ['e', 1], ['u', 1], ['i', 1],
  ['o', 2], // Rohini → Taurus
];

// Hindi (Devanagari) syllable → Rashi
const HINDI_SYLLABLE_MAP: Record<string, number> = {
  // Aries (मेष) — Ashwini, Bharani, Krittika pada 1
  'चु': 1, 'चे': 1, 'चो': 1,
  'ला': 1, 'लि': 1, 'ली': 1, 'लु': 1, 'लू': 1, 'ले': 1, 'लो': 1, 'ल': 1,
  'अ': 1, 'इ': 1, 'उ': 1, 'ए': 1,
  // Taurus (वृषभ) — Rohini, Mrigashirsha pada 1-2
  'ओ': 2, 'वा': 2, 'वि': 2, 'वी': 2, 'वु': 2, 'व': 2,
  'बा': 2, 'बि': 2, 'बी': 2, 'बु': 2, 'ब': 2,
  'वे': 2, 'वो': 2, 'का': 2, 'कि': 2,
  // Gemini (मिथुन) — Mrigashirsha pada 3-4, Ardra, Punarvasu
  'की': 3, 'कु': 3, 'घा': 3, 'घ': 3,
  'के': 3, 'को': 3, 'हा': 3, 'हि': 3, 'ह': 3,
  // Cancer (कर्क) — Pushya, Ashlesha
  'हु': 4, 'हे': 4, 'हो': 4, 'डा': 4, 'ड': 4,
  'डि': 4, 'डी': 4, 'डु': 4, 'डे': 4, 'डो': 4,
  // Leo (सिंह) — Magha, Purva Phalguni
  'मा': 5, 'मि': 5, 'मी': 5, 'मु': 5, 'मे': 5, 'म': 5,
  'मो': 5, 'टा': 5, 'टि': 5, 'टी': 5, 'टु': 5, 'ट': 5,
  'टे': 5, 'टो': 5,
  // Virgo (कन्या) — Uttara Phalguni, Hasta, Chitra pada 1-2
  'पा': 6, 'पि': 6, 'पी': 6,
  'पु': 6, 'षा': 6, 'ष': 6, 'णा': 6, 'ण': 6, 'ठा': 6, 'ठ': 6,
  'पे': 6, 'पो': 6, 'प': 6,
  'शा': 6, 'शि': 6, 'शी': 6, 'श': 6,
  'ना': 6, 'न': 6,
  // Libra (तुला) — Chitra pada 3-4, Swati, Vishakha pada 1-3
  'रा': 7, 'रि': 7, 'री': 7, 'र': 7,
  'रु': 7, 'रे': 7, 'रो': 7,
  'ता': 7, 'ति': 7, 'ती': 7, 'तु': 7, 'तू': 7, 'ते': 7, 'तो': 7, 'त': 7,
  // Scorpio (वृश्चिक) — Anuradha, Jyeshtha
  'नि': 8, 'नु': 8, 'नू': 8, 'ने': 8, 'नो': 8,
  'यि': 8, 'यु': 8, 'या': 8, 'य': 8,
  // Sagittarius (धनु) — Mula, Purva Ashadha, Uttara Ashadha pada 1
  'ये': 9, 'यो': 9,
  'भा': 9, 'भि': 9, 'भी': 9, 'भु': 9, 'भ': 9,
  'धा': 9, 'ध': 9, 'फा': 9, 'फ': 9,
  'जा': 9, 'जि': 9, 'जी': 9, 'ज': 9,
  // Capricorn (मकर) — Shravana, Dhanishtha pada 1-2
  'खि': 10, 'खु': 10, 'खे': 10, 'ख': 10,
  'गा': 10, 'गि': 10, 'गी': 10, 'गु': 10, 'गे': 10, 'ग': 10,
  // Aquarius (कुम्भ) — Dhanishtha pada 3-4, Shatabhisha, Purva Bhadrapada
  'गो': 11,
  'सा': 11, 'सि': 11, 'सी': 11, 'सु': 11, 'सू': 11, 'से': 11, 'सो': 11, 'स': 11,
  // Pisces (मीन) — Uttara Bhadrapada, Revati
  'दु': 12, 'दू': 12, 'था': 12, 'थ': 12, 'झा': 12, 'झ': 12, 'ञ': 12,
  'दे': 12, 'दो': 12,
  'चा': 12, 'चि': 12, 'ची': 12,
};

// ─── Helper Functions ─────────────────────────────────────────────────────────
function isDevanagari(str: string): boolean {
  return /[\u0900-\u097F]/.test(str);
}

function getRashiFromHindiName(name: string): number | null {
  const trimmed = name.trim();
  if (!trimmed) return null;

  // Try 2-char syllable (consonant + matra)
  const MATRAS = new Set([
    '\u093E','\u093F','\u0940','\u0941','\u0942','\u0943','\u0944',
    '\u0945','\u0946','\u0947','\u0948','\u0949','\u094A','\u094B','\u094C',
  ]);
  const chars = [...trimmed];
  let syllable = chars[0];
  if (chars.length > 1 && MATRAS.has(chars[1])) {
    syllable += chars[1];
  }

  if (HINDI_SYLLABLE_MAP[syllable] !== undefined) return HINDI_SYLLABLE_MAP[syllable];
  if (HINDI_SYLLABLE_MAP[chars[0]] !== undefined) return HINDI_SYLLABLE_MAP[chars[0]];
  return null;
}

function getRashiFromEnglishName(name: string): number | null {
  const normalized = name.trim().toLowerCase().replace(/[^a-z]/g, '');
  if (!normalized) return null;

  for (const [syllable, rashiId] of SYLLABLE_MAP) {
    if (normalized.startsWith(syllable)) return rashiId;
  }
  return null;
}

function getRashiFromName(name: string): { rashi: RashiInfo | null; syllable: string } {
  if (!name.trim()) return { rashi: null, syllable: '' };

  let rashiId: number | null = null;
  let syllable = '';

  if (isDevanagari(name)) {
    rashiId = getRashiFromHindiName(name);
    syllable = [...name.trim()].slice(0, 2).join('');
  } else {
    rashiId = getRashiFromEnglishName(name);
    const norm = name.trim().toLowerCase();
    // Find the matched syllable
    for (const [s] of SYLLABLE_MAP) {
      if (norm.startsWith(s)) { syllable = s; break; }
    }
  }

  const rashi = rashiId ? RASHIS.find(r => r.id === rashiId) ?? null : null;
  return { rashi, syllable };
}

// ─── Component ────────────────────────────────────────────────────────────────
export function RashiCheckerTool() {
  const [name, setName] = useState('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const { rashi, syllable } = useMemo(() => getRashiFromName(name), [name]);
  const isHindi = isDevanagari(name);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter your name (अपना नाम लिखें)
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Rahul or राहुल"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-lg"
            />
            <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
              {isHindi ? 'Hindi (Devanagari) detected' : 'English (Roman) detected'} — based on first syllable
            </p>
          </div>
          <button
            onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm font-medium shrink-0"
          >
            <Languages className="w-4 h-4" />
            {lang === 'en' ? 'हिंदी में देखें' : 'View in English'}
          </button>
        </div>
      </div>

      {/* Result */}
      {rashi ? (
        <RashiCard rashi={rashi} syllable={syllable} lang={lang} />
      ) : name.trim() ? (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 text-center">
          <p className="text-amber-700 dark:text-amber-400 font-medium">
            Could not determine Rashi for this name.
          </p>
          <p className="text-amber-600 dark:text-amber-500 text-sm mt-1">
            Try entering the full traditional name — the first syllable must match a Nakshatra akshara.
          </p>
        </div>
      ) : (
        <RashiGrid lang={lang} />
      )}
    </div>
  );
}

// ─── Rashi Result Card ────────────────────────────────────────────────────────
function RashiCard({ rashi, syllable, lang }: { rashi: RashiInfo; syllable: string; lang: 'en' | 'hi' }) {
  const hi = lang === 'hi';

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className={`bg-gradient-to-r ${rashi.color} rounded-2xl p-6 text-white shadow-lg`}>
        <div className="flex items-center gap-5">
          <div className="text-6xl leading-none select-none">{rashi.symbol}</div>
          <div>
            <p className="text-sm font-medium opacity-80 mb-0.5">
              {hi ? 'आपकी राशि' : 'Your Rashi'}
            </p>
            <h2 className="text-3xl font-bold">{hi ? rashi.nameHindi : rashi.name}</h2>
            {!hi && <p className="text-lg opacity-90">{rashi.nameHindi}</p>}
            {syllable && (
              <p className="mt-1 text-sm opacity-75">
                {hi ? `पहला अक्षर: "${syllable}"` : `First syllable: "${syllable}"`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: hi ? 'स्वामी ग्रह' : 'Ruling Planet',
            value: hi ? rashi.lordHindi : rashi.lord,
            icon: '🪐',
          },
          {
            label: hi ? 'तत्व' : 'Element',
            value: hi ? rashi.elementHindi : rashi.element,
            icon: rashi.element === 'Fire' ? '🔥' : rashi.element === 'Earth' ? '🌍' : rashi.element === 'Air' ? '💨' : '💧',
          },
          {
            label: hi ? 'शुभ अंक' : 'Lucky Number',
            value: String(rashi.luckyNumber),
            icon: '🔢',
          },
          {
            label: hi ? 'शुभ दिन' : 'Lucky Day',
            value: hi ? rashi.luckyDayHindi : rashi.luckyDay,
            icon: '📅',
          },
        ].map(item => (
          <div key={item.label} className={`${rashi.bgLight} rounded-xl p-4 text-center`}>
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="font-bold text-gray-900 dark:text-white text-sm">{item.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Nakshatra */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
          {hi ? 'नक्षत्र' : 'Nakshatra (Birth Star)'}
        </p>
        <p className="text-gray-800 dark:text-gray-200 font-medium">
          {hi ? rashi.nakshatraHindi : rashi.nakshatra}
        </p>
      </div>

      {/* Traits */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          {hi ? 'प्रमुख गुण' : 'Key Traits'}
        </p>
        <div className="flex flex-wrap gap-2">
          {(hi ? rashi.traitsHindi : rashi.traits).map(t => (
            <span key={t} className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${rashi.color} text-white`}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          {hi ? 'राशि विवरण' : 'About Your Rashi'}
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {hi ? rashi.descriptionHindi : rashi.description}
        </p>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        * Based on traditional Naam Nakshatra (name-based birth star) system. For accurate Janma Rashi, consult a Vedic astrologer with your birth details.
      </p>
    </div>
  );
}

// ─── Rashi Grid (shown when no name entered) ─────────────────────────────────
function RashiGrid({ lang }: { lang: 'en' | 'hi' }) {
  const hi = lang === 'hi';
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-violet-500" />
        <h2 className="font-semibold text-gray-800 dark:text-gray-200">
          {hi ? 'सभी 12 राशियाँ' : 'All 12 Rashis'}
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {RASHIS.map(r => (
          <div key={r.id} className={`bg-gradient-to-br ${r.color} rounded-xl p-3 text-white text-center`}>
            <div className="text-2xl mb-1">{r.symbol}</div>
            <div className="font-bold text-sm">{hi ? r.nameHindi : r.name}</div>
            <div className="text-xs opacity-80">{hi ? r.lordHindi : r.lord}</div>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        {hi ? 'अपना नाम ऊपर टाइप करें' : 'Type your name above to find your Rashi'}
      </p>
    </div>
  );
}
