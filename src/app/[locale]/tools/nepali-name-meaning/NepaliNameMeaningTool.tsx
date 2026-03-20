'use client';

import { useState, useMemo } from 'react';
import { Search, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

type Gender = 'M' | 'F' | 'U';
type Origin = 'Sanskrit' | 'Tibetan' | 'Newari' | 'Maithili' | 'Persian';

interface NameEntry {
  name: string;
  meaning: string;
  meaningNepali: string;
  gender: Gender;
  origin: Origin;
  pronunciation: string;
  numerology: number;
  luckyColor: string;
  luckyDay: string;
  traits: string[];
}

const NAME_DB: NameEntry[] = [
  { name: 'Aarav',     meaning: 'Peaceful, calm and wise',           meaningNepali: 'शान्त, बुद्धिमान',        gender: 'M', origin: 'Sanskrit', pronunciation: 'AA-ruv',       numerology: 1, luckyColor: 'Gold',         luckyDay: 'Sunday',    traits: ['Calm', 'Analytical', 'Creative'] },
  { name: 'Aashish',   meaning: 'Blessing, benediction',             meaningNepali: 'आशीर्वाद',                gender: 'M', origin: 'Sanskrit', pronunciation: 'AA-sheesh',    numerology: 5, luckyColor: 'Blue',         luckyDay: 'Wednesday', traits: ['Optimistic', 'Helpful', 'Spiritual'] },
  { name: 'Abhishek',  meaning: 'Ceremonial bath, anointment',       meaningNepali: 'अभिषेक',                  gender: 'M', origin: 'Sanskrit', pronunciation: 'ab-hi-SHEK',   numerology: 7, luckyColor: 'White',        luckyDay: 'Monday',    traits: ['Devoted', 'Serious', 'Principled'] },
  { name: 'Aditya',    meaning: 'Sun, son of Aditi',                 meaningNepali: 'सूर्य',                   gender: 'M', origin: 'Sanskrit', pronunciation: 'a-DIT-ya',     numerology: 3, luckyColor: 'Orange',       luckyDay: 'Sunday',    traits: ['Energetic', 'Leadership', 'Enthusiastic'] },
  { name: 'Akash',     meaning: 'Sky, ether',                        meaningNepali: 'आकाश',                    gender: 'M', origin: 'Sanskrit', pronunciation: 'a-KAASH',      numerology: 2, luckyColor: 'Sky Blue',     luckyDay: 'Monday',    traits: ['Imaginative', 'Free-spirited', 'Thoughtful'] },
  { name: 'Anil',      meaning: 'Wind, air, god of wind',            meaningNepali: 'वायु, हावा',              gender: 'M', origin: 'Sanskrit', pronunciation: 'a-NIL',        numerology: 4, luckyColor: 'White',        luckyDay: 'Wednesday', traits: ['Free', 'Strong', 'Independent'] },
  { name: 'Anish',     meaning: 'Supreme, without a master',         meaningNepali: 'सर्वोच्च',                gender: 'M', origin: 'Sanskrit', pronunciation: 'a-NEESH',      numerology: 4, luckyColor: 'Green',        luckyDay: 'Friday',    traits: ['Independent', 'Confident', 'Artistic'] },
  { name: 'Arjun',     meaning: 'Bright, clear, white',              meaningNepali: 'उज्ज्वल, सफेद',           gender: 'M', origin: 'Sanskrit', pronunciation: 'AR-jun',       numerology: 9, luckyColor: 'Red',          luckyDay: 'Tuesday',   traits: ['Brave', 'Skilled', 'Righteous'] },
  { name: 'Ashok',     meaning: 'Without sorrow',                    meaningNepali: 'दुःखरहित',                gender: 'M', origin: 'Sanskrit', pronunciation: 'a-SHOK',       numerology: 6, luckyColor: 'Yellow',       luckyDay: 'Thursday',  traits: ['Peaceful', 'Compassionate', 'Generous'] },
  { name: 'Bibek',     meaning: 'Wisdom, discernment',               meaningNepali: 'विवेक, बुद्धि',           gender: 'M', origin: 'Sanskrit', pronunciation: 'bi-BEK',       numerology: 7, luckyColor: 'Purple',       luckyDay: 'Saturday',  traits: ['Intellectual', 'Discerning', 'Thoughtful'] },
  { name: 'Bikash',    meaning: 'Development, progress, bloom',      meaningNepali: 'विकास, प्रगति',           gender: 'M', origin: 'Sanskrit', pronunciation: 'bi-KAASH',     numerology: 5, luckyColor: 'Green',        luckyDay: 'Wednesday', traits: ['Progressive', 'Dynamic', 'Ambitious'] },
  { name: 'Binod',     meaning: 'Joy, fun, delight',                 meaningNepali: 'आनन्द, खुशी',             gender: 'M', origin: 'Sanskrit', pronunciation: 'bi-NOD',       numerology: 3, luckyColor: 'Yellow',       luckyDay: 'Thursday',  traits: ['Joyful', 'Sociable', 'Humorous'] },
  { name: 'Deepak',    meaning: 'Lamp, light-giver, illumination',   meaningNepali: 'दीपक, प्रकाश',            gender: 'M', origin: 'Sanskrit', pronunciation: 'DEE-pak',      numerology: 8, luckyColor: 'Gold',         luckyDay: 'Sunday',    traits: ['Inspiring', 'Illuminating', 'Wise'] },
  { name: 'Dipesh',    meaning: 'Lord of light',                     meaningNepali: 'प्रकाशको स्वामी',        gender: 'M', origin: 'Sanskrit', pronunciation: 'dee-PESH',     numerology: 4, luckyColor: 'Orange',       luckyDay: 'Sunday',    traits: ['Visionary', 'Strong', 'Reliable'] },
  { name: 'Ganesh',    meaning: 'Lord of the masses, elephant god',  meaningNepali: 'गणको स्वामी',            gender: 'M', origin: 'Sanskrit', pronunciation: 'ga-NESH',      numerology: 5, luckyColor: 'Red',          luckyDay: 'Wednesday', traits: ['Wise', 'Auspicious', 'Problem-solver'] },
  { name: 'Gopal',     meaning: 'Protector of cows, Krishna',        meaningNepali: 'गाईको पालक',             gender: 'M', origin: 'Sanskrit', pronunciation: 'go-PAAL',      numerology: 6, luckyColor: 'Blue',         luckyDay: 'Thursday',  traits: ['Nurturing', 'Protective', 'Gentle'] },
  { name: 'Hari',      meaning: 'Lord Vishnu, the green one',        meaningNepali: 'विष्णु भगवान',           gender: 'M', origin: 'Sanskrit', pronunciation: 'HA-ri',        numerology: 1, luckyColor: 'Green',        luckyDay: 'Thursday',  traits: ['Devoted', 'Pure', 'Faithful'] },
  { name: 'Ishaan',    meaning: 'Sun, northeast direction, Shiva',   meaningNepali: 'सूर्य, उत्तरपूर्व',      gender: 'M', origin: 'Sanskrit', pronunciation: 'ee-SHAAN',     numerology: 9, luckyColor: 'Orange',       luckyDay: 'Sunday',    traits: ['Bright', 'Guiding', 'Spiritual'] },
  { name: 'Kiran',     meaning: 'Ray of light, beam of sun',         meaningNepali: 'प्रकाशको किरण',          gender: 'U', origin: 'Sanskrit', pronunciation: 'ki-RAN',       numerology: 6, luckyColor: 'Silver',       luckyDay: 'Monday',    traits: ['Radiant', 'Hopeful', 'Warm'] },
  { name: 'Krishna',   meaning: 'Dark, all-attractive divine one',   meaningNepali: 'श्याम, सर्वाकर्षक',      gender: 'M', origin: 'Sanskrit', pronunciation: 'KRISH-na',     numerology: 9, luckyColor: 'Blue',         luckyDay: 'Wednesday', traits: ['Charming', 'Playful', 'Wise'] },
  { name: 'Manoj',     meaning: 'Born of the mind',                  meaningNepali: 'मनमा जन्मेको',           gender: 'M', origin: 'Sanskrit', pronunciation: 'ma-NOJ',       numerology: 2, luckyColor: 'White',        luckyDay: 'Monday',    traits: ['Thoughtful', 'Sensitive', 'Creative'] },
  { name: 'Mohan',     meaning: 'Enchanting, attractive',            meaningNepali: 'मनमोहक, आकर्षक',         gender: 'M', origin: 'Sanskrit', pronunciation: 'MO-han',       numerology: 7, luckyColor: 'Blue',         luckyDay: 'Wednesday', traits: ['Charismatic', 'Artistic', 'Lovable'] },
  { name: 'Nabin',     meaning: 'New, young, fresh',                 meaningNepali: 'नयाँ, युवा',              gender: 'M', origin: 'Sanskrit', pronunciation: 'na-BIN',       numerology: 3, luckyColor: 'Green',        luckyDay: 'Friday',    traits: ['Fresh', 'Innovative', 'Youthful'] },
  { name: 'Pradip',    meaning: 'Lamp, light, illumination',         meaningNepali: 'दियो, प्रकाश',            gender: 'M', origin: 'Sanskrit', pronunciation: 'pra-DEEP',     numerology: 7, luckyColor: 'Gold',         luckyDay: 'Sunday',    traits: ['Bright', 'Guiding', 'Hopeful'] },
  { name: 'Prashant',  meaning: 'Calm, peaceful, composed',          meaningNepali: 'शान्त, स्थिर',           gender: 'M', origin: 'Sanskrit', pronunciation: 'pra-SHANT',    numerology: 6, luckyColor: 'Blue',         luckyDay: 'Monday',    traits: ['Serene', 'Stable', 'Balanced'] },
  { name: 'Raj',       meaning: 'King, ruler',                       meaningNepali: 'राजा, शासक',              gender: 'M', origin: 'Sanskrit', pronunciation: 'RAJ',          numerology: 1, luckyColor: 'Gold',         luckyDay: 'Sunday',    traits: ['Leader', 'Confident', 'Noble'] },
  { name: 'Rajesh',    meaning: 'Lord of kings',                     meaningNepali: 'राजाहरूको स्वामी',       gender: 'M', origin: 'Sanskrit', pronunciation: 'ra-JESH',      numerology: 9, luckyColor: 'Royal Blue',   luckyDay: 'Thursday',  traits: ['Authoritative', 'Responsible', 'Dignified'] },
  { name: 'Ram',       meaning: 'Pleasing, Lord Rama',               meaningNepali: 'मनभावन, भगवान राम',     gender: 'M', origin: 'Sanskrit', pronunciation: 'RAAM',         numerology: 2, luckyColor: 'Blue',         luckyDay: 'Tuesday',   traits: ['Righteous', 'Dutiful', 'Honorable'] },
  { name: 'Rohan',     meaning: 'Ascending, growing',                meaningNepali: 'चढ्दो, बढ्दो',          gender: 'M', origin: 'Sanskrit', pronunciation: 'RO-han',       numerology: 4, luckyColor: 'Green',        luckyDay: 'Wednesday', traits: ['Progressive', 'Strong', 'Resilient'] },
  { name: 'Sagar',     meaning: 'Ocean, vast sea',                   meaningNepali: 'समुद्र, सागर',           gender: 'M', origin: 'Sanskrit', pronunciation: 'SA-gar',       numerology: 3, luckyColor: 'Blue',         luckyDay: 'Monday',    traits: ['Vast', 'Calm', 'Deep'] },
  { name: 'Sanjay',    meaning: 'Victorious, triumphant',            meaningNepali: 'विजयी',                   gender: 'M', origin: 'Sanskrit', pronunciation: 'SAN-jay',      numerology: 5, luckyColor: 'Red',          luckyDay: 'Tuesday',   traits: ['Victorious', 'Determined', 'Bold'] },
  { name: 'Santosh',   meaning: 'Contentment, satisfaction',         meaningNepali: 'सन्तुष्टि, सुख',         gender: 'M', origin: 'Sanskrit', pronunciation: 'san-TOSH',     numerology: 8, luckyColor: 'Yellow',       luckyDay: 'Thursday',  traits: ['Content', 'Grateful', 'Peaceful'] },
  { name: 'Saroj',     meaning: 'Lotus, born of a pond',             meaningNepali: 'कमल',                     gender: 'U', origin: 'Sanskrit', pronunciation: 'sa-ROJ',       numerology: 3, luckyColor: 'Pink',         luckyDay: 'Friday',    traits: ['Pure', 'Beautiful', 'Serene'] },
  { name: 'Shyam',     meaning: 'Dark-complexioned, Krishna',        meaningNepali: 'श्याम, कृष्ण',           gender: 'M', origin: 'Sanskrit', pronunciation: 'SHYAAM',       numerology: 6, luckyColor: 'Dark Blue',    luckyDay: 'Wednesday', traits: ['Charming', 'Mystical', 'Artistic'] },
  { name: 'Suresh',    meaning: 'Lord of gods, Indra',               meaningNepali: 'देवताहरूको राजा',        gender: 'M', origin: 'Sanskrit', pronunciation: 'su-RESH',      numerology: 7, luckyColor: 'White',        luckyDay: 'Monday',    traits: ['Divine', 'Powerful', 'Generous'] },
  { name: 'Vijay',     meaning: 'Victory, triumph',                  meaningNepali: 'विजय, जित',               gender: 'M', origin: 'Sanskrit', pronunciation: 'vi-JAY',       numerology: 5, luckyColor: 'Saffron',      luckyDay: 'Tuesday',   traits: ['Courageous', 'Competitive', 'Determined'] },
  { name: 'Bishnu',    meaning: 'Lord Vishnu, the protector',        meaningNepali: 'भगवान विष्णु',           gender: 'M', origin: 'Sanskrit', pronunciation: 'BISH-nu',      numerology: 4, luckyColor: 'Yellow',       luckyDay: 'Thursday',  traits: ['Protective', 'Nurturing', 'Spiritual'] },
  { name: 'Prakash',   meaning: 'Light, brilliance',                 meaningNepali: 'प्रकाश, चमक',            gender: 'M', origin: 'Sanskrit', pronunciation: 'pra-KAASH',    numerology: 9, luckyColor: 'Gold',         luckyDay: 'Sunday',    traits: ['Bright', 'Inspiring', 'Illuminating'] },
  { name: 'Sulav',     meaning: 'Easy, simple, accessible',          meaningNepali: 'सहज, सरल',               gender: 'M', origin: 'Sanskrit', pronunciation: 'su-LAV',       numerology: 6, luckyColor: 'Green',        luckyDay: 'Wednesday', traits: ['Easygoing', 'Adaptable', 'Kind'] },
  { name: 'Tenzing',   meaning: 'Holder of Buddhist teachings',      meaningNepali: 'धर्म धारण गर्ने',       gender: 'M', origin: 'Tibetan',  pronunciation: 'TEN-zing',     numerology: 8, luckyColor: 'Maroon',       luckyDay: 'Saturday',  traits: ['Wise', 'Spiritual', 'Disciplined'] },
  { name: 'Pasang',    meaning: 'Born on Friday, Venus',             meaningNepali: 'शुक्रबार जन्मेको',      gender: 'U', origin: 'Tibetan',  pronunciation: 'PA-sang',      numerology: 7, luckyColor: 'White',        luckyDay: 'Friday',    traits: ['Peaceful', 'Blessed', 'Sociable'] },
  { name: 'Dorje',     meaning: 'Thunderbolt, indestructible diamond', meaningNepali: 'वज्र, हीरा',          gender: 'M', origin: 'Tibetan',  pronunciation: 'DOR-je',       numerology: 5, luckyColor: 'Blue',         luckyDay: 'Saturday',  traits: ['Strong', 'Resilient', 'Spiritual'] },
  { name: 'Karma',     meaning: 'Action, deed, fate',                meaningNepali: 'कर्म, भाग्य',            gender: 'U', origin: 'Tibetan',  pronunciation: 'KAR-ma',       numerology: 2, luckyColor: 'White',        luckyDay: 'Saturday',  traits: ['Principled', 'Devoted', 'Calm'] },
  { name: 'Sonam',     meaning: 'Merit, virtue, good fortune',       meaningNepali: 'पुण्य, सुभाग्य',        gender: 'U', origin: 'Tibetan',  pronunciation: 'SO-nam',       numerology: 6, luckyColor: 'Yellow',       luckyDay: 'Thursday',  traits: ['Fortunate', 'Generous', 'Warm'] },
  { name: 'Dawa',      meaning: 'Moon, born on Monday',              meaningNepali: 'चन्द्रमा, सोमबार',       gender: 'U', origin: 'Tibetan',  pronunciation: 'DA-wa',        numerology: 4, luckyColor: 'Silver',       luckyDay: 'Monday',    traits: ['Gentle', 'Intuitive', 'Dreamy'] },
  { name: 'Pema',      meaning: 'Lotus flower',                      meaningNepali: 'कमल फूल',                gender: 'U', origin: 'Tibetan',  pronunciation: 'PE-ma',        numerology: 6, luckyColor: 'White',        luckyDay: 'Friday',    traits: ['Pure', 'Compassionate', 'Serene'] },
  { name: 'Tenzin',    meaning: 'Upholder of Buddha-dharma',         meaningNepali: 'बौद्धधर्म पालक',        gender: 'U', origin: 'Tibetan',  pronunciation: 'TEN-zin',      numerology: 8, luckyColor: 'Maroon',       luckyDay: 'Saturday',  traits: ['Spiritual', 'Disciplined', 'Wise'] },
  { name: 'Tsering',   meaning: 'Long life, longevity',              meaningNepali: 'दीर्घायु',                gender: 'U', origin: 'Tibetan',  pronunciation: 'TSHE-ring',    numerology: 9, luckyColor: 'Green',        luckyDay: 'Thursday',  traits: ['Enduring', 'Blessed', 'Patient'] },
  { name: 'Aasha',     meaning: 'Hope, wish, aspiration',            meaningNepali: 'आशा, इच्छा',             gender: 'F', origin: 'Sanskrit', pronunciation: 'AA-sha',       numerology: 1, luckyColor: 'White',        luckyDay: 'Monday',    traits: ['Hopeful', 'Optimistic', 'Inspiring'] },
  { name: 'Alisha',    meaning: 'Protected by God, noble',           meaningNepali: 'ईश्वरद्वारा रक्षित',    gender: 'F', origin: 'Persian',  pronunciation: 'a-LEE-sha',    numerology: 6, luckyColor: 'Pink',         luckyDay: 'Friday',    traits: ['Graceful', 'Caring', 'Warm'] },
  { name: 'Anjali',    meaning: 'Offering, divine gift',             meaningNepali: 'भेट, आराधना',            gender: 'F', origin: 'Sanskrit', pronunciation: 'AN-ja-li',    numerology: 4, luckyColor: 'Peach',        luckyDay: 'Thursday',  traits: ['Devoted', 'Generous', 'Graceful'] },
  { name: 'Anita',     meaning: 'Grace, favour, graceful',           meaningNepali: 'अनुग्रह, सुन्दर',        gender: 'F', origin: 'Sanskrit', pronunciation: 'a-NEE-ta',    numerology: 3, luckyColor: 'Lavender',     luckyDay: 'Friday',    traits: ['Gracious', 'Elegant', 'Sociable'] },
  { name: 'Anusha',    meaning: 'Beautiful morning star',            meaningNepali: 'सुन्दर बिहान',           gender: 'F', origin: 'Sanskrit', pronunciation: 'a-NU-sha',    numerology: 7, luckyColor: 'Light Blue',   luckyDay: 'Wednesday', traits: ['Bright', 'Refreshing', 'Cheerful'] },
  { name: 'Archana',   meaning: 'Worship, adoration, prayer',        meaningNepali: 'पूजा, आराधना',           gender: 'F', origin: 'Sanskrit', pronunciation: 'ar-CHA-na',   numerology: 5, luckyColor: 'Red',          luckyDay: 'Friday',    traits: ['Devoted', 'Religious', 'Pure'] },
  { name: 'Bina',      meaning: 'Musical instrument, melodious',     meaningNepali: 'वीणा, सुरीलो',          gender: 'F', origin: 'Sanskrit', pronunciation: 'BEE-na',       numerology: 2, luckyColor: 'Turquoise',    luckyDay: 'Friday',    traits: ['Artistic', 'Harmonious', 'Creative'] },
  { name: 'Deepa',     meaning: 'Lamp, bright light, flame',         meaningNepali: 'दियो, उज्यालो',          gender: 'F', origin: 'Sanskrit', pronunciation: 'DEE-pa',       numerology: 8, luckyColor: 'Gold',         luckyDay: 'Sunday',    traits: ['Bright', 'Illuminating', 'Warm'] },
  { name: 'Gita',      meaning: 'Song, Bhagavad Gita',              meaningNepali: 'गीत, भगवद्गीता',        gender: 'F', origin: 'Sanskrit', pronunciation: 'GEE-ta',       numerology: 6, luckyColor: 'Saffron',      luckyDay: 'Thursday',  traits: ['Wise', 'Philosophical', 'Calm'] },
  { name: 'Jyoti',     meaning: 'Light, sacred flame',               meaningNepali: 'ज्योति, प्रकाश',         gender: 'F', origin: 'Sanskrit', pronunciation: 'JYO-ti',       numerology: 4, luckyColor: 'Orange',       luckyDay: 'Sunday',    traits: ['Bright', 'Energetic', 'Inspiring'] },
  { name: 'Kamala',    meaning: 'Lotus, Goddess Lakshmi',            meaningNepali: 'कमल, लक्ष्मी',           gender: 'F', origin: 'Sanskrit', pronunciation: 'ka-MA-la',    numerology: 3, luckyColor: 'Pink',         luckyDay: 'Friday',    traits: ['Pure', 'Prosperous', 'Beautiful'] },
  { name: 'Kavita',    meaning: 'Poem, poetry',                      meaningNepali: 'कविता',                   gender: 'F', origin: 'Sanskrit', pronunciation: 'ka-VEE-ta',   numerology: 9, luckyColor: 'Violet',       luckyDay: 'Wednesday', traits: ['Creative', 'Expressive', 'Imaginative'] },
  { name: 'Kopila',    meaning: 'Young flower bud',                  meaningNepali: 'कोपिला, फूलको मुकुल',   gender: 'F', origin: 'Sanskrit', pronunciation: 'ko-PI-la',    numerology: 5, luckyColor: 'Rose',         luckyDay: 'Friday',    traits: ['Fresh', 'Delicate', 'Promising'] },
  { name: 'Laxmi',     meaning: 'Goddess of wealth and fortune',     meaningNepali: 'सम्पदाकी देवी',         gender: 'F', origin: 'Sanskrit', pronunciation: 'LAK-shmi',    numerology: 7, luckyColor: 'Gold',         luckyDay: 'Friday',    traits: ['Prosperous', 'Graceful', 'Auspicious'] },
  { name: 'Maya',      meaning: 'Illusion, grace, compassion',       meaningNepali: 'माया, भ्रम',              gender: 'F', origin: 'Sanskrit', pronunciation: 'MAA-ya',       numerology: 2, luckyColor: 'Blue',         luckyDay: 'Monday',    traits: ['Compassionate', 'Mysterious', 'Nurturing'] },
  { name: 'Menuka',    meaning: 'Jasmine-type flower',               meaningNepali: 'सुन्दर फूल',             gender: 'F', origin: 'Sanskrit', pronunciation: 'me-NU-ka',    numerology: 3, luckyColor: 'White',        luckyDay: 'Friday',    traits: ['Fragrant', 'Delicate', 'Cheerful'] },
  { name: 'Nisha',     meaning: 'Night, dream',                      meaningNepali: 'रात',                     gender: 'F', origin: 'Sanskrit', pronunciation: 'NEE-sha',      numerology: 6, luckyColor: 'Midnight Blue', luckyDay: 'Saturday', traits: ['Mysterious', 'Calm', 'Deep'] },
  { name: 'Parbati',   meaning: 'Daughter of the mountain',          meaningNepali: 'पर्वतकी छोरी, पार्वती', gender: 'F', origin: 'Sanskrit', pronunciation: 'par-BA-ti',   numerology: 9, luckyColor: 'Green',        luckyDay: 'Monday',    traits: ['Strong', 'Devoted', 'Powerful'] },
  { name: 'Pooja',     meaning: 'Worship, prayer, reverence',        meaningNepali: 'पूजा, प्रार्थना',        gender: 'F', origin: 'Sanskrit', pronunciation: 'POO-ja',       numerology: 7, luckyColor: 'Saffron',      luckyDay: 'Friday',    traits: ['Devout', 'Pure', 'Spiritual'] },
  { name: 'Priya',     meaning: 'Beloved, dear one',                 meaningNepali: 'प्रिय, माया लाग्दो',     gender: 'F', origin: 'Sanskrit', pronunciation: 'PREE-ya',      numerology: 4, luckyColor: 'Pink',         luckyDay: 'Friday',    traits: ['Loving', 'Charming', 'Affectionate'] },
  { name: 'Rekha',     meaning: 'Line, streak, boundary',            meaningNepali: 'रेखा, लकिर',             gender: 'F', origin: 'Sanskrit', pronunciation: 'RE-kha',       numerology: 1, luckyColor: 'White',        luckyDay: 'Sunday',    traits: ['Precise', 'Artistic', 'Clear-minded'] },
  { name: 'Sabitri',   meaning: 'Goddess Savitri, the sun',          meaningNepali: 'सूर्यकी देवी',           gender: 'F', origin: 'Sanskrit', pronunciation: 'sa-BI-tri',   numerology: 8, luckyColor: 'Yellow',       luckyDay: 'Sunday',    traits: ['Devoted', 'Powerful', 'Faithful'] },
  { name: 'Sanjana',   meaning: 'Gentle, kind, agreeable',           meaningNepali: 'कोमल, दयालु',            gender: 'F', origin: 'Sanskrit', pronunciation: 'san-JA-na',   numerology: 2, luckyColor: 'Pastel Green', luckyDay: 'Wednesday', traits: ['Gentle', 'Kind', 'Caring'] },
  { name: 'Saraswati', meaning: 'Goddess of learning and arts',      meaningNepali: 'ज्ञानकी देवी',           gender: 'F', origin: 'Sanskrit', pronunciation: 'sa-RAS-wa-ti', numerology: 3, luckyColor: 'White',        luckyDay: 'Wednesday', traits: ['Wise', 'Artistic', 'Eloquent'] },
  { name: 'Sita',      meaning: 'Sacred furrow, Goddess Sita',       meaningNepali: 'सीता देवी',              gender: 'F', origin: 'Sanskrit', pronunciation: 'SEE-ta',       numerology: 6, luckyColor: 'Yellow',       luckyDay: 'Wednesday', traits: ['Devoted', 'Pure', 'Patient'] },
  { name: 'Smriti',    meaning: 'Memory, remembrance',               meaningNepali: 'स्मृति, यादगार',         gender: 'F', origin: 'Sanskrit', pronunciation: 'SMRI-ti',      numerology: 9, luckyColor: 'Silver',       luckyDay: 'Monday',    traits: ['Thoughtful', 'Retrospective', 'Gentle'] },
  { name: 'Sunita',    meaning: 'Well-behaved, good conduct',        meaningNepali: 'सुनीति, शिष्ट',         gender: 'F', origin: 'Sanskrit', pronunciation: 'su-NEE-ta',    numerology: 5, luckyColor: 'Cream',        luckyDay: 'Thursday',  traits: ['Disciplined', 'Ethical', 'Kind'] },
  { name: 'Sushmita',  meaning: 'With a beautiful smile',            meaningNepali: 'सुन्दर मुस्कान भएकी',   gender: 'F', origin: 'Sanskrit', pronunciation: 'sush-MI-ta',   numerology: 4, luckyColor: 'Pink',         luckyDay: 'Friday',    traits: ['Charming', 'Radiant', 'Joyful'] },
  { name: 'Trishna',   meaning: 'Thirst, yearning, longing',         meaningNepali: 'प्यास, तृष्णा',          gender: 'F', origin: 'Sanskrit', pronunciation: 'TRISH-na',     numerology: 7, luckyColor: 'Deep Blue',    luckyDay: 'Saturday',  traits: ['Passionate', 'Seeking', 'Intense'] },
  { name: 'Usha',      meaning: 'Dawn, sunrise, new beginning',      meaningNepali: 'उषा, बिहानीपख',         gender: 'F', origin: 'Sanskrit', pronunciation: 'OO-sha',       numerology: 1, luckyColor: 'Dawn Pink',    luckyDay: 'Sunday',    traits: ['Fresh', 'Hopeful', 'Energetic'] },
  { name: 'Yashoda',   meaning: 'Famous, successful, glorious',      meaningNepali: 'यशोदा, प्रसिद्ध',       gender: 'F', origin: 'Sanskrit', pronunciation: 'ya-SHO-da',   numerology: 8, luckyColor: 'Blue',         luckyDay: 'Thursday',  traits: ['Nurturing', 'Loving', 'Famous'] },
  { name: 'Nima',      meaning: 'Born on Sunday, the sun',           meaningNepali: 'आइतबारमा जन्मेको',     gender: 'U', origin: 'Tibetan',  pronunciation: 'NEE-ma',       numerology: 2, luckyColor: 'Golden',       luckyDay: 'Sunday',    traits: ['Radiant', 'Spiritual', 'Calm'] },
  { name: 'Lhakpa',    meaning: 'Born on Wednesday, Mercury',        meaningNepali: 'बुधबारमा जन्मेको',     gender: 'U', origin: 'Tibetan',  pronunciation: 'LHAK-pa',      numerology: 5, luckyColor: 'Green',        luckyDay: 'Wednesday', traits: ['Communicative', 'Clever', 'Adaptable'] },
  { name: 'Rinchen',   meaning: 'Precious jewel, treasure',          meaningNepali: 'अमूल्य, रत्न',           gender: 'U', origin: 'Tibetan',  pronunciation: 'RIN-chen',     numerology: 9, luckyColor: 'Gold',         luckyDay: 'Thursday',  traits: ['Valuable', 'Wise', 'Cherished'] },
  { name: 'Mithila',   meaning: 'Ancient kingdom of Janakpur',       meaningNepali: 'मिथिला राज्य',          gender: 'F', origin: 'Maithili', pronunciation: 'mi-THI-la',   numerology: 4, luckyColor: 'Red',          luckyDay: 'Tuesday',   traits: ['Cultural', 'Strong', 'Traditional'] },
  { name: 'Janaki',    meaning: 'Daughter of King Janak, Sita',      meaningNepali: 'जनककी छोरी, सीता',     gender: 'F', origin: 'Maithili', pronunciation: 'JA-na-ki',    numerology: 3, luckyColor: 'Yellow',       luckyDay: 'Wednesday', traits: ['Devoted', 'Pure', 'Faithful'] },
  { name: 'Himal',     meaning: 'Mountain, the Himalayas',           meaningNepali: 'पहाड, हिमाल',           gender: 'M', origin: 'Newari',   pronunciation: 'hi-MAAL',      numerology: 5, luckyColor: 'White',        luckyDay: 'Monday',    traits: ['Strong', 'Steadfast', 'Majestic'] },
  { name: 'Ratna',     meaning: 'Jewel, gem, precious stone',        meaningNepali: 'रत्न, मणि',              gender: 'U', origin: 'Newari',   pronunciation: 'RAT-na',       numerology: 1, luckyColor: 'Gold',         luckyDay: 'Sunday',    traits: ['Precious', 'Brilliant', 'Rare'] },
];

type GenderFilter = 'all' | 'M' | 'F';

const ORIGIN_CLASSES: Record<Origin, string> = {
  Sanskrit: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Tibetan:  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Newari:   'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  Maithili: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Persian:  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

const GENDER_LABEL: Record<Gender, string> = { M: 'Male', F: 'Female', U: 'Unisex' };

export function NepaliNameMeaningTool() {
  const [query, setQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NAME_DB.filter((n) => {
      const matchesQuery =
        q === '' ||
        n.name.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q) ||
        n.meaningNepali.includes(q);
      const matchesGender =
        genderFilter === 'all' ||
        n.gender === genderFilter ||
        n.gender === 'U';
      return matchesQuery && matchesGender;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [query, genderFilter]);

  function toggleExpand(name: string) {
    setExpanded((prev) => (prev === name ? null : name));
  }

  return (
    <div className="space-y-6">
      {/* Search and filter */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Nepali Name Meaning Finder
          </h2>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Search name e.g. Aarav, Sita, Maya..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'M', 'F'] as GenderFilter[]).map((g) => {
            const labels: Record<GenderFilter, string> = { all: 'All Names', M: 'Male', F: 'Female' };
            return (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={[
                  'rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors',
                  genderFilter === g
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400',
                ].join(' ')}
              >
                {labels[g]}
              </button>
            );
          })}
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {results.length} name{results.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Results grid */}
      {results.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            No names found matching &quot;{query}&quot;. Try a different spelling or variant.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((entry) => {
            const isOpen = expanded === entry.name;
            return (
              <div
                key={entry.name}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <button
                  onClick={() => toggleExpand(entry.name)}
                  className="w-full px-4 py-4 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
                          {entry.name}
                        </h3>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          ({entry.pronunciation})
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                        {entry.meaning}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {entry.meaningNepali}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span
                      className={[
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        ORIGIN_CLASSES[entry.origin],
                      ].join(' ')}
                    >
                      {entry.origin}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      {GENDER_LABEL[entry.gender]}
                    </span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                      No. {entry.numerology}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50/50 px-4 pb-4 pt-3 dark:border-gray-700 dark:bg-gray-750/30">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Lucky Color
                        </span>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {entry.luckyColor}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Lucky Day
                        </span>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {entry.luckyDay}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Personality Traits
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {entry.traits.map((trait) => (
                          <span
                            key={trait}
                            className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Origin info */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
          Name Origins in Nepal
        </h3>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <span className={['mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', ORIGIN_CLASSES.Sanskrit].join(' ')}>Sanskrit</span>
            <p className="text-gray-600 dark:text-gray-400">Most common origin, used across Brahmin, Chhetri, and Hindu communities throughout Nepal.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className={['mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', ORIGIN_CLASSES.Tibetan].join(' ')}>Tibetan</span>
            <p className="text-gray-600 dark:text-gray-400">Common among Sherpa, Tamang, and Buddhist communities. Many names indicate the day of birth.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className={['mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', ORIGIN_CLASSES.Newari].join(' ')}>Newari</span>
            <p className="text-gray-600 dark:text-gray-400">Traditional names from the Kathmandu Valley&apos;s indigenous Newar community with unique roots.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className={['mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', ORIGIN_CLASSES.Maithili].join(' ')}>Maithili</span>
            <p className="text-gray-600 dark:text-gray-400">Names from the Maithili-speaking Terai region along the Nepal-Bihar border.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
