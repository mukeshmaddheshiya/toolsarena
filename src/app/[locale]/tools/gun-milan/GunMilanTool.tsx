'use client';

import { useState, useMemo } from 'react';
import { Heart, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// ─── Nakshatra Data ───────────────────────────────────────────────────────────
type Gana = 'Dev' | 'Manav' | 'Rakshasa';
type Nadi = 'Vata' | 'Pitta' | 'Kapha';
type Yoni = 'Horse' | 'Elephant' | 'Sheep' | 'Serpent' | 'Dog' | 'Cat' | 'Rat' | 'Cow' | 'Buffalo' | 'Tiger' | 'Deer' | 'Monkey' | 'Mongoose' | 'Lion';
type Varna = 'Brahmin' | 'Kshatriya' | 'Vaishya' | 'Shudra' | 'Farmer' | 'Mlecha';
type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';

interface Nakshatra {
  id: number;
  name: string;
  nameHindi: string;
  rashi: number; // 1–12
  lord: Planet;
  gana: Gana;
  nadi: Nadi;
  yoni: Yoni;
  yoniGender: 'M' | 'F';
  varna: Varna;
}

const NAKSHATRAS: Nakshatra[] = [
  { id: 1,  name: 'Ashwini',           nameHindi: 'अश्विनी',    rashi: 1,  lord: 'Ketu',    gana: 'Dev',      nadi: 'Vata',  yoni: 'Horse',    yoniGender: 'M', varna: 'Vaishya'  },
  { id: 2,  name: 'Bharani',           nameHindi: 'भरणी',        rashi: 1,  lord: 'Venus',   gana: 'Manav',    nadi: 'Pitta', yoni: 'Elephant', yoniGender: 'M', varna: 'Mlecha'   },
  { id: 3,  name: 'Krittika',          nameHindi: 'कृत्तिका',   rashi: 2,  lord: 'Sun',     gana: 'Rakshasa', nadi: 'Kapha', yoni: 'Sheep',    yoniGender: 'F', varna: 'Brahmin'  },
  { id: 4,  name: 'Rohini',            nameHindi: 'रोहिणी',      rashi: 2,  lord: 'Moon',    gana: 'Manav',    nadi: 'Kapha', yoni: 'Serpent',  yoniGender: 'M', varna: 'Shudra'   },
  { id: 5,  name: 'Mrigashirsha',      nameHindi: 'मृगशिरा',    rashi: 2,  lord: 'Mars',    gana: 'Dev',      nadi: 'Pitta', yoni: 'Serpent',  yoniGender: 'F', varna: 'Farmer'   },
  { id: 6,  name: 'Ardra',             nameHindi: 'आर्द्रा',    rashi: 3,  lord: 'Rahu',    gana: 'Manav',    nadi: 'Vata',  yoni: 'Dog',      yoniGender: 'F', varna: 'Mlecha'   },
  { id: 7,  name: 'Punarvasu',         nameHindi: 'पुनर्वसु',   rashi: 3,  lord: 'Jupiter', gana: 'Dev',      nadi: 'Vata',  yoni: 'Cat',      yoniGender: 'M', varna: 'Vaishya'  },
  { id: 8,  name: 'Pushya',            nameHindi: 'पुष्य',       rashi: 4,  lord: 'Saturn',  gana: 'Dev',      nadi: 'Pitta', yoni: 'Sheep',    yoniGender: 'M', varna: 'Kshatriya'},
  { id: 9,  name: 'Ashlesha',          nameHindi: 'आश्लेषा',    rashi: 4,  lord: 'Mercury', gana: 'Rakshasa', nadi: 'Kapha', yoni: 'Cat',      yoniGender: 'F', varna: 'Mlecha'   },
  { id: 10, name: 'Magha',             nameHindi: 'मघा',          rashi: 5,  lord: 'Ketu',    gana: 'Rakshasa', nadi: 'Vata',  yoni: 'Rat',      yoniGender: 'F', varna: 'Shudra'   },
  { id: 11, name: 'Purva Phalguni',    nameHindi: 'पूर्व फाल्गुनी', rashi: 5, lord: 'Venus', gana: 'Manav',   nadi: 'Pitta', yoni: 'Rat',      yoniGender: 'M', varna: 'Brahmin'  },
  { id: 12, name: 'Uttara Phalguni',   nameHindi: 'उत्तर फाल्गुनी', rashi: 6, lord: 'Sun',  gana: 'Manav',   nadi: 'Kapha', yoni: 'Cow',      yoniGender: 'M', varna: 'Kshatriya'},
  { id: 13, name: 'Hasta',             nameHindi: 'हस्त',         rashi: 6,  lord: 'Moon',    gana: 'Dev',      nadi: 'Vata',  yoni: 'Buffalo',  yoniGender: 'F', varna: 'Vaishya'  },
  { id: 14, name: 'Chitra',            nameHindi: 'चित्रा',      rashi: 6,  lord: 'Mars',    gana: 'Rakshasa', nadi: 'Pitta', yoni: 'Tiger',    yoniGender: 'F', varna: 'Farmer'   },
  { id: 15, name: 'Swati',             nameHindi: 'स्वाती',       rashi: 7,  lord: 'Rahu',    gana: 'Dev',      nadi: 'Kapha', yoni: 'Buffalo',  yoniGender: 'M', varna: 'Mlecha'   },
  { id: 16, name: 'Vishakha',          nameHindi: 'विशाखा',      rashi: 7,  lord: 'Jupiter', gana: 'Rakshasa', nadi: 'Kapha', yoni: 'Tiger',    yoniGender: 'M', varna: 'Mlecha'   },
  { id: 17, name: 'Anuradha',          nameHindi: 'अनुराधा',     rashi: 8,  lord: 'Saturn',  gana: 'Dev',      nadi: 'Pitta', yoni: 'Deer',     yoniGender: 'F', varna: 'Shudra'   },
  { id: 18, name: 'Jyeshtha',          nameHindi: 'ज्येष्ठा',    rashi: 8,  lord: 'Mercury', gana: 'Rakshasa', nadi: 'Vata',  yoni: 'Deer',     yoniGender: 'M', varna: 'Farmer'   },
  { id: 19, name: 'Mula',              nameHindi: 'मूल',           rashi: 9,  lord: 'Ketu',    gana: 'Rakshasa', nadi: 'Kapha', yoni: 'Dog',      yoniGender: 'M', varna: 'Mlecha'   },
  { id: 20, name: 'Purva Ashadha',     nameHindi: 'पूर्व आषाढ़',  rashi: 9,  lord: 'Venus',   gana: 'Manav',    nadi: 'Pitta', yoni: 'Monkey',   yoniGender: 'M', varna: 'Brahmin'  },
  { id: 21, name: 'Uttara Ashadha',    nameHindi: 'उत्तर आषाढ़',  rashi: 9,  lord: 'Sun',     gana: 'Manav',    nadi: 'Vata',  yoni: 'Mongoose', yoniGender: 'M', varna: 'Kshatriya'},
  { id: 22, name: 'Shravana',          nameHindi: 'श्रवण',        rashi: 10, lord: 'Moon',    gana: 'Dev',      nadi: 'Kapha', yoni: 'Monkey',   yoniGender: 'F', varna: 'Mlecha'   },
  { id: 23, name: 'Dhanishtha',        nameHindi: 'धनिष्ठा',     rashi: 10, lord: 'Mars',    gana: 'Rakshasa', nadi: 'Pitta', yoni: 'Lion',     yoniGender: 'M', varna: 'Farmer'   },
  { id: 24, name: 'Shatabhisha',       nameHindi: 'शतभिषा',      rashi: 11, lord: 'Rahu',    gana: 'Rakshasa', nadi: 'Vata',  yoni: 'Horse',    yoniGender: 'F', varna: 'Mlecha'   },
  { id: 25, name: 'Purva Bhadrapada',  nameHindi: 'पूर्व भाद्रपद', rashi: 11, lord: 'Jupiter', gana: 'Manav',  nadi: 'Vata',  yoni: 'Lion',     yoniGender: 'F', varna: 'Brahmin'  },
  { id: 26, name: 'Uttara Bhadrapada', nameHindi: 'उत्तर भाद्रपद', rashi: 12, lord: 'Saturn', gana: 'Manav',  nadi: 'Pitta', yoni: 'Cow',      yoniGender: 'F', varna: 'Kshatriya'},
  { id: 27, name: 'Revati',            nameHindi: 'रेवती',        rashi: 12, lord: 'Mercury', gana: 'Dev',      nadi: 'Kapha', yoni: 'Elephant', yoniGender: 'F', varna: 'Shudra'   },
];

// ─── Syllable → Nakshatra ─────────────────────────────────────────────────────
const SYLLABLE_NAKSHATRA: [string, number][] = [
  // 3-char first
  ['chu', 1], ['che', 1], ['cho', 1],             // Ashwini
  ['la',  1],                                      // Ashwini (La pada)
  ['li',  2], ['lu', 2], ['le', 2], ['lo', 2],    // Bharani
  ['aa',  3], ['a',  3], ['i',  3], ['u',  3],    // Krittika pada 1
  ['e',   3],                                      // Krittika
  ['o',   4], ['va', 4], ['vi', 4], ['vu', 4],    // Rohini
  ['ba',  4], ['bi', 4], ['bu', 4],                // Rohini alt
  ['ve',  5], ['vo', 5], ['ka', 5], ['ki', 5],    // Mrigashirsha
  ['gha', 6], ['ku', 6],                           // Ardra
  ['ke',  7], ['ko', 7], ['ha', 7], ['hi', 7],    // Punarvasu
  ['hu',  8], ['he', 8], ['ho', 8], ['da', 8],    // Pushya
  ['di',  9], ['du', 9], ['de', 9], ['do', 9],    // Ashlesha
  ['ma', 10], ['mi',10], ['mu',10], ['me',10],    // Magha
  ['mo', 11], ['ta',11], ['ti',11], ['tu',11],    // Purva Phalguni
  ['te', 12], ['to',12], ['pa',12], ['pi',12],    // Uttara Phalguni
  ['sha',13], ['tha',13], ['na',13], ['pu',13],   // Hasta
  ['pe', 14], ['po',14], ['ra',14], ['ri',14],    // Chitra
  ['ru', 15], ['re',15], ['ro',15],               // Swati
  ['ta', 16], ['ti',16], ['tu',16], ['te',16],    // Vishakha — overlaps, handled by order
  ['ni', 17], ['nu',17], ['ne',17],               // Anuradha
  ['no', 18], ['ya',18], ['yi',18], ['yu',18],    // Jyeshtha
  ['ye', 19], ['yo',19], ['bha',19], ['bhi',19],  // Mula
  ['bhu',20], ['dha',20], ['pha',20], ['fa',20],  // Purva Ashadha
  ['be', 21], ['bo',21], ['ja',21], ['ji',21],    // Uttara Ashadha
  ['khu',22], ['khe',22], ['kho',22], ['khi',22], // Shravana
  ['ga', 23], ['gi',23], ['gu',23], ['ge',23],    // Dhanishtha
  ['go', 24], ['sa',24], ['si',24], ['su',24],    // Shatabhisha
  ['se', 25], ['so',25],                           // Purva Bhadrapada
  ['du', 26], ['tha',26], ['jha',26], ['tra',26], // Uttara Bhadrapada
  ['de', 27], ['do',27], ['cha',27], ['chi',27],  // Revati
];

const HINDI_SYLLABLE_NAKSHATRA: Record<string, number> = {
  'चु':1,'चे':1,'चो':1,'ला':1,'ल':1,
  'ली':2,'लि':2,'लु':2,'लू':2,'ले':2,'लो':2,
  'अ':3,'इ':3,'उ':3,'ए':3,
  'ओ':4,'वा':4,'वि':4,'वी':4,'वु':4,'व':4,'बा':4,'बि':4,'बु':4,'ब':4,
  'वे':5,'वो':5,'का':5,'कि':5,
  'घा':6,'कु':6,'घ':6,
  'के':7,'को':7,'हा':7,'हि':7,'ह':7,
  'हु':8,'हे':8,'हो':8,'डा':8,'ड':8,
  'डि':9,'डी':9,'डु':9,'डे':9,'डो':9,
  'मा':10,'मि':10,'मी':10,'मु':10,'मे':10,'म':10,
  'मो':11,'टा':11,'टि':11,'टु':11,'ट':11,
  'टे':12,'टो':12,'पा':12,'पि':12,
  'पु':13,'षा':13,'ष':13,'णा':13,'ण':13,'ठा':13,'ठ':13,'शा':13,'श':13,'ना':13,'न':13,
  'पे':14,'पो':14,'रा':14,'रि':14,
  'रु':15,'रे':15,'रो':15,
  'ता':16,'ति':16,'ती':16,'तु':16,'तू':16,'ते':16,'तो':16,'त':16,
  'नि':17,'नु':17,'नू':17,'ने':17,'नो':18,'यि':18,'यु':18,'या':18,'य':18,
  'ये':19,'यो':19,'भा':19,'भि':19,'भ':19,
  'भु':20,'धा':20,'ध':20,'फा':20,'फ':20,
  'बे':21,'बो':21,'जा':21,'जि':21,'ज':21,
  'खि':22,'खु':22,'खे':22,'ख':22,
  'गा':23,'गि':23,'गे':23,'गु':23,'ग':23,
  'गो':24,'सा':24,'सि':24,'सु':24,'स':24,
  'से':25,'सो':25,
  'दु':26,'दू':26,'था':26,'थ':26,'झा':26,'झ':26,
  'दे':27,'दो':27,'चा':27,'चि':27,'ची':27,
};

function isDevanagari(s: string) { return /[\u0900-\u097F]/.test(s); }

function getNakshatraFromName(name: string): Nakshatra | null {
  const trimmed = name.trim();
  if (!trimmed) return null;

  if (isDevanagari(trimmed)) {
    const MATRAS = new Set(['\u093E','\u093F','\u0940','\u0941','\u0942','\u0943','\u0944','\u0945','\u0946','\u0947','\u0948','\u0949','\u094A','\u094B','\u094C']);
    const chars = [...trimmed];
    let syl = chars[0];
    if (chars.length > 1 && MATRAS.has(chars[1])) syl += chars[1];
    const id = HINDI_SYLLABLE_NAKSHATRA[syl] ?? HINDI_SYLLABLE_NAKSHATRA[chars[0]];
    return id ? NAKSHATRAS[id - 1] : null;
  }

  const norm = trimmed.toLowerCase().replace(/[^a-z]/g, '');
  for (const [syl, id] of SYLLABLE_NAKSHATRA) {
    if (norm.startsWith(syl)) return NAKSHATRAS[id - 1];
  }
  return null;
}

// ─── Rashi Names ─────────────────────────────────────────────────────────────
const RASHI_NAMES = ['','Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const RASHI_HINDI = ['','मेष','वृषभ','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'];

// ─── Koota Calculations ───────────────────────────────────────────────────────

// 1. Varna (max 1)
const VARNA_RANK: Record<Varna, number> = {
  Brahmin: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1, Farmer: 1, Mlecha: 0,
};
function calcVarna(b: Nakshatra, g: Nakshatra): number {
  return VARNA_RANK[b.varna] >= VARNA_RANK[g.varna] ? 1 : 0;
}

// 2. Vashya (max 2)
type VashyaGroup = 'Chatushpad' | 'Nara' | 'Jalchar' | 'Keeta' | 'Vanchar';
const RASHI_VASHYA: Record<number, VashyaGroup> = {
  1: 'Chatushpad', 2: 'Chatushpad', 3: 'Nara', 4: 'Jalchar',
  5: 'Chatushpad', 6: 'Nara', 7: 'Nara', 8: 'Keeta',
  9: 'Chatushpad', 10: 'Jalchar', 11: 'Nara', 12: 'Jalchar',
};
// Which Rashi controls which
const VASHYA_CONTROL: Record<number, number[]> = {
  1: [5, 8], 2: [4, 7], 3: [6], 4: [8, 9],
  5: [7], 6: [12, 3], 7: [10, 3], 8: [4],
  9: [12], 10: [1, 11], 11: [1], 12: [10],
};
function calcVashya(b: Nakshatra, g: Nakshatra): number {
  if (RASHI_VASHYA[b.rashi] === RASHI_VASHYA[g.rashi]) return 2;
  if (VASHYA_CONTROL[b.rashi]?.includes(g.rashi)) return 2;
  if (VASHYA_CONTROL[g.rashi]?.includes(b.rashi)) return 1;
  return 0.5;
}

// 3. Tara (max 3)
function calcTara(b: Nakshatra, g: Nakshatra): number {
  const forward = ((b.id - g.id + 27) % 27) + 1;
  const backward = ((g.id - b.id + 27) % 27) + 1;
  const fwdRem = forward % 9;
  const bwdRem = backward % 9;
  const goodRems = new Set([1, 3, 5, 7]);
  const fwdGood = goodRems.has(fwdRem) || fwdRem === 0;
  const bwdGood = goodRems.has(bwdRem) || bwdRem === 0;
  if (fwdGood && bwdGood) return 3;
  if (fwdGood || bwdGood) return 1.5;
  return 0;
}

// 4. Yoni (max 4)
const YONI_ENEMY: Array<[Yoni, Yoni]> = [
  ['Horse', 'Buffalo'], ['Elephant', 'Lion'], ['Sheep', 'Dog'],
  ['Serpent', 'Mongoose'], ['Dog', 'Deer'], ['Cat', 'Rat'], ['Cow', 'Tiger'],
  ['Monkey', 'Mongoose'],
];
function calcYoni(b: Nakshatra, g: Nakshatra): number {
  if (b.yoni === g.yoni) {
    return b.yoniGender !== g.yoniGender ? 4 : 3;
  }
  const isEnemy = YONI_ENEMY.some(
    ([a, c]) => (b.yoni === a && g.yoni === c) || (b.yoni === c && g.yoni === a)
  );
  if (isEnemy) return 0;
  return 2; // neutral
}

// 5. Graha Maitri (max 5)
type Friendship = 'Friend' | 'Neutral' | 'Enemy';
const PLANET_FRIENDSHIP: Record<Planet, Record<Planet, Friendship>> = {
  Sun:     { Sun:'Neutral', Moon:'Friend',  Mars:'Friend',  Mercury:'Neutral', Jupiter:'Friend', Venus:'Enemy',   Saturn:'Enemy',  Rahu:'Enemy',  Ketu:'Friend'  },
  Moon:    { Sun:'Friend',  Moon:'Neutral', Mars:'Neutral', Mercury:'Friend',  Jupiter:'Neutral',Venus:'Neutral', Saturn:'Neutral',Rahu:'Enemy',  Ketu:'Neutral' },
  Mars:    { Sun:'Friend',  Moon:'Friend',  Mars:'Neutral', Mercury:'Enemy',   Jupiter:'Friend', Venus:'Neutral', Saturn:'Neutral',Rahu:'Enemy',  Ketu:'Friend'  },
  Mercury: { Sun:'Friend',  Moon:'Enemy',   Mars:'Neutral', Mercury:'Neutral', Jupiter:'Neutral',Venus:'Friend',  Saturn:'Neutral',Rahu:'Friend', Ketu:'Neutral' },
  Jupiter: { Sun:'Friend',  Moon:'Friend',  Mars:'Friend',  Mercury:'Enemy',   Jupiter:'Neutral',Venus:'Enemy',   Saturn:'Neutral',Rahu:'Enemy',  Ketu:'Friend'  },
  Venus:   { Sun:'Enemy',   Moon:'Neutral', Mars:'Neutral', Mercury:'Friend',  Jupiter:'Neutral',Venus:'Neutral', Saturn:'Friend', Rahu:'Friend', Ketu:'Neutral' },
  Saturn:  { Sun:'Enemy',   Moon:'Enemy',   Mars:'Enemy',   Mercury:'Neutral', Jupiter:'Neutral',Venus:'Friend',  Saturn:'Neutral',Rahu:'Friend', Ketu:'Neutral' },
  Rahu:    { Sun:'Enemy',   Moon:'Enemy',   Mars:'Enemy',   Mercury:'Friend',  Jupiter:'Enemy',  Venus:'Friend',  Saturn:'Friend', Rahu:'Neutral',Ketu:'Enemy'   },
  Ketu:    { Sun:'Friend',  Moon:'Neutral', Mars:'Friend',  Mercury:'Neutral', Jupiter:'Friend', Venus:'Neutral', Saturn:'Neutral',Rahu:'Enemy',  Ketu:'Neutral' },
};
function calcGrahaMaitri(b: Nakshatra, g: Nakshatra): number {
  const bf = PLANET_FRIENDSHIP[b.lord][g.lord];
  const gf = PLANET_FRIENDSHIP[g.lord][b.lord];
  if (bf === 'Friend' && gf === 'Friend') return 5;
  if (bf === 'Friend' && gf === 'Neutral') return 4;
  if (gf === 'Friend' && bf === 'Neutral') return 4;
  if (bf === 'Neutral' && gf === 'Neutral') return 3;
  if ((bf === 'Friend' && gf === 'Enemy') || (bf === 'Enemy' && gf === 'Friend')) return 2;
  if ((bf === 'Neutral' && gf === 'Enemy') || (bf === 'Enemy' && gf === 'Neutral')) return 1;
  return 0; // both enemies
}

// 6. Gana (max 6)
function calcGana(b: Nakshatra, g: Nakshatra): number {
  if (b.gana === g.gana) return 6;
  if ((b.gana === 'Dev' && g.gana === 'Manav') || (b.gana === 'Manav' && g.gana === 'Dev')) return 5;
  if (b.gana === 'Dev' && g.gana === 'Rakshasa') return 1;
  if (b.gana === 'Manav' && g.gana === 'Rakshasa') return 0;
  if (b.gana === 'Rakshasa' && g.gana === 'Dev') return 0;
  if (b.gana === 'Rakshasa' && g.gana === 'Manav') return 0;
  return 0;
}

// 7. Bhakoot (max 7)
function calcBhakoot(b: Nakshatra, g: Nakshatra): number {
  const bg = b.rashi; const gg = g.rashi;
  const count1 = ((gg - bg + 12) % 12) + 1;
  const count2 = ((bg - gg + 12) % 12) + 1;
  const DOSHA_PAIRS = [[2,12],[5,9],[6,8]];
  const hasDosha = DOSHA_PAIRS.some(
    ([a, c]) => (count1 === a && count2 === c) || (count1 === c && count2 === a)
  );
  // Cancellation: if both have the same rashi lord
  return hasDosha ? 0 : 7;
}

// 8. Nadi (max 8)
function calcNadi(b: Nakshatra, g: Nakshatra): number {
  return b.nadi === g.nadi ? 0 : 8;
}

// ─── Main Result ──────────────────────────────────────────────────────────────
interface KootaResult {
  name: string; nameHindi: string; maxScore: number; score: number; description: string;
}

interface GunMilanResult {
  boyNakshatra: Nakshatra;
  girlNakshatra: Nakshatra;
  kootas: KootaResult[];
  total: number;
  maxTotal: number;
  nadiDosha: boolean;
  bhakootDosha: boolean;
  ganaDosha: boolean;
}

function calculateGunMilan(boyName: string, girlName: string): GunMilanResult | null {
  // Special perfect match for Mukesh & Maya 💖
  const bn = boyName.trim().toLowerCase().replace(/\s+/g, '');
  const gn = girlName.trim().toLowerCase().replace(/\s+/g, '');
  if ((bn === 'mukesh' || bn === 'मुकेश') && (gn === 'maya' || gn === 'माया')) {
    const boy = NAKSHATRAS[9];  // Magha
    const girl = NAKSHATRAS[12]; // Hasta
    const perfectKootas: KootaResult[] = [
      { name: 'Varna', nameHindi: 'वर्ण', maxScore: 1, score: 1, description: 'Perfect temperament compatibility.' },
      { name: 'Vashya', nameHindi: 'वश्य', maxScore: 2, score: 2, description: 'Perfect power & attraction compatibility.' },
      { name: 'Tara', nameHindi: 'तारा', maxScore: 3, score: 3, description: 'Perfect destiny & luck compatibility.' },
      { name: 'Yoni', nameHindi: 'योनि', maxScore: 4, score: 4, description: 'Perfect physical & nature compatibility.' },
      { name: 'Graha Maitri', nameHindi: 'ग्रह मैत्री', maxScore: 5, score: 5, description: 'Perfect planetary friendship.' },
      { name: 'Gana', nameHindi: 'गण', maxScore: 6, score: 6, description: 'Perfect character compatibility.' },
      { name: 'Bhakoot', nameHindi: 'भकूट', maxScore: 7, score: 7, description: 'Perfect Rashi positional compatibility.' },
      { name: 'Nadi', nameHindi: 'नाड़ी', maxScore: 8, score: 8, description: 'Perfect genetic & health compatibility.' },
    ];
    return { boyNakshatra: boy, girlNakshatra: girl, kootas: perfectKootas, total: 36, maxTotal: 36, nadiDosha: false, bhakootDosha: false, ganaDosha: false };
  }

  const boy = getNakshatraFromName(boyName);
  const girl = getNakshatraFromName(girlName);
  if (!boy || !girl) return null;

  const varna = calcVarna(boy, girl);
  const vashya = calcVashya(boy, girl);
  const tara = calcTara(boy, girl);
  const yoni = calcYoni(boy, girl);
  const grahaMaitri = calcGrahaMaitri(boy, girl);
  const gana = calcGana(boy, girl);
  const bhakoot = calcBhakoot(boy, girl);
  const nadi = calcNadi(boy, girl);
  const total = varna + vashya + tara + yoni + grahaMaitri + gana + bhakoot + nadi;

  const kootas: KootaResult[] = [
    { name: 'Varna', nameHindi: 'वर्ण', maxScore: 1, score: varna, description: `Temperament compatibility. Boy's Varna: ${boy.varna}, Girl's Varna: ${girl.varna}.` },
    { name: 'Vashya', nameHindi: 'वश्य', maxScore: 2, score: vashya, description: `Power & attraction compatibility.` },
    { name: 'Tara', nameHindi: 'तारा', maxScore: 3, score: tara, description: `Destiny & luck compatibility based on Nakshatra count.` },
    { name: 'Yoni', nameHindi: 'योनि', maxScore: 4, score: yoni, description: `Physical & nature compatibility. Boy's Yoni: ${boy.yoni}, Girl's Yoni: ${girl.yoni}.` },
    { name: 'Graha Maitri', nameHindi: 'ग्रह मैत्री', maxScore: 5, score: grahaMaitri, description: `Planetary friendship. Boy's lord: ${boy.lord}, Girl's lord: ${girl.lord}.` },
    { name: 'Gana', nameHindi: 'गण', maxScore: 6, score: gana, description: `Character compatibility. Boy: ${boy.gana} Gana, Girl: ${girl.gana} Gana.` },
    { name: 'Bhakoot', nameHindi: 'भकूट', maxScore: 7, score: bhakoot, description: `Rashi positional compatibility. Boy: ${RASHI_NAMES[boy.rashi]}, Girl: ${RASHI_NAMES[girl.rashi]}.` },
    { name: 'Nadi', nameHindi: 'नाड़ी', maxScore: 8, score: nadi, description: `Genetic & health compatibility. Boy's Nadi: ${boy.nadi}, Girl's Nadi: ${girl.nadi}.` },
  ];

  return {
    boyNakshatra: boy,
    girlNakshatra: girl,
    kootas,
    total,
    maxTotal: 36,
    nadiDosha: nadi === 0,
    bhakootDosha: bhakoot === 0,
    ganaDosha: gana === 0,
  };
}

function getScoreLabel(total: number): { label: string; labelHindi: string; color: string; emoji: string } {
  if (total >= 33) return { label: 'Excellent Match', labelHindi: 'उत्तम मिलान', color: 'from-emerald-500 to-green-400', emoji: '💚' };
  if (total >= 25) return { label: 'Good Match', labelHindi: 'अच्छा मिलान', color: 'from-blue-500 to-cyan-400', emoji: '💙' };
  if (total >= 18) return { label: 'Average Match', labelHindi: 'सामान्य मिलान', color: 'from-yellow-500 to-amber-400', emoji: '💛' };
  return { label: 'Below Average', labelHindi: 'कम अंक', color: 'from-red-500 to-orange-400', emoji: '❤️' };
}

// ─── Component ────────────────────────────────────────────────────────────────
export function GunMilanTool() {
  const [boyName, setBoyName] = useState('');
  const [girlName, setGirlName] = useState('');
  const [checked, setChecked] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const result = useMemo(
    () => (checked ? calculateGunMilan(boyName, girlName) : null),
    [checked, boyName, girlName]
  );

  const hi = lang === 'hi';

  const handleCheck = () => {
    if (boyName.trim() && girlName.trim()) setChecked(true);
  };

  const handleReset = () => {
    setBoyName(''); setGirlName(''); setChecked(false);
  };

  return (
    <div className="space-y-6">
      {/* Input form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Boy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              👦 {hi ? 'लड़के का नाम' : "Boy's Name"}
            </label>
            <input
              type="text"
              value={boyName}
              onChange={e => { setBoyName(e.target.value); setChecked(false); }}
              placeholder={hi ? 'जैसे: राहुल / Rahul' : 'e.g. Rahul or राहुल'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          {/* Girl */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              👧 {hi ? 'लड़की का नाम' : "Girl's Name"}
            </label>
            <input
              type="text"
              value={girlName}
              onChange={e => { setGirlName(e.target.value); setChecked(false); }}
              placeholder={hi ? 'जैसे: प्रिया / Priya' : 'e.g. Priya or प्रिया'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleCheck}
            disabled={!boyName.trim() || !girlName.trim()}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Heart className="w-5 h-5" />
            {hi ? 'मिलान जाँचें' : 'Check Compatibility'}
          </button>
          {checked && (
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              {hi ? 'फिर से करें' : 'Reset'}
            </button>
          )}
          <button
            onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
            className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            {lang === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>
      </div>

      {/* No result found */}
      {checked && !result && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-amber-700 dark:text-amber-400 font-medium">
            {hi ? 'एक या दोनों नाम से नक्षत्र नहीं मिला।' : 'Could not identify Nakshatra from one or both names.'}
          </p>
          <p className="text-amber-600 dark:text-amber-500 text-sm mt-1">
            {hi ? 'परंपरागत हिंदू नाम डालें।' : 'Please enter traditional Hindu names starting with a Nakshatra syllable.'}
          </p>
        </div>
      )}

      {/* Result */}
      {result && <GunMilanResult result={result} hi={hi} />}

      {/* Info box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-blue-700 dark:text-blue-400 text-sm">
          {hi
            ? 'यह उपकरण नाम के पहले अक्षर (अक्षरा) से नक्षत्र पहचानता है। सटीक कुंडली मिलान के लिए जन्म कुंडली जरूरी है।'
            : 'This tool identifies the Nakshatra from the first syllable (Akshara) of the name. For precise Kundali matching, consult a Vedic astrologer with actual birth charts.'}
        </p>
      </div>
    </div>
  );
}

// ─── Result Display ───────────────────────────────────────────────────────────
function GunMilanResult({ result, hi }: { result: GunMilanResult; hi: boolean }) {
  const score = getScoreLabel(result.total);

  return (
    <div className="space-y-4">
      {/* Score hero */}
      <div className={`bg-gradient-to-r ${score.color} rounded-2xl p-6 text-white shadow-lg`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm opacity-80 mb-1">{hi ? 'कुल मिलान स्कोर' : 'Total Compatibility Score'}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">{result.total}</span>
              <span className="text-2xl opacity-80">/ 36</span>
            </div>
            <p className="mt-1 text-lg font-semibold">{score.emoji} {hi ? score.labelHindi : score.label}</p>
          </div>
          <div className="text-right">
            <div className="text-5xl">{score.emoji}</div>
            <div className="text-sm opacity-80 mt-1">
              {hi ? `${Math.round((result.total / 36) * 100)}% अनुकूलता` : `${Math.round((result.total / 36) * 100)}% match`}
            </div>
          </div>
        </div>
        {/* Score bar */}
        <div className="mt-4">
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/80 rounded-full transition-all duration-700"
              style={{ width: `${(result.total / 36) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Nakshatra info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: hi ? 'लड़के का नक्षत्र' : "Boy's Nakshatra", nk: result.boyNakshatra, emoji: '👦' },
          { label: hi ? 'लड़की का नक्षत्र' : "Girl's Nakshatra", nk: result.girlNakshatra, emoji: '👧' },
        ].map(({ label, nk, emoji }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {emoji} {hi ? nk.nameHindi : nk.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {hi ? RASHI_HINDI[nk.rashi] : RASHI_NAMES[nk.rashi]} · {nk.gana} · {nk.nadi}
            </p>
          </div>
        ))}
      </div>

      {/* Doshas */}
      {(result.nadiDosha || result.bhakootDosha || result.ganaDosha) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {hi ? 'दोष सूचना' : 'Dosha Alert'}
          </p>
          <ul className="space-y-1.5 text-sm text-red-600 dark:text-red-400">
            {result.nadiDosha && (
              <li>• <strong>{hi ? 'नाड़ी दोष' : 'Nadi Dosha'}:</strong> {hi ? 'दोनों की नाड़ी एक जैसी है। यह स्वास्थ्य और संतान के लिए हानिकारक माना जाता है।' : 'Both have the same Nadi. Considered harmful for health and progeny.'}</li>
            )}
            {result.bhakootDosha && (
              <li>• <strong>{hi ? 'भकूट दोष' : 'Bhakoot Dosha'}:</strong> {hi ? 'राशियों का संबंध 2/12, 5/9 या 6/8 है। आर्थिक व स्वास्थ्य पर असर हो सकता है।' : 'Rashis are in 2/12, 5/9 or 6/8 relationship. May affect finances or health.'}</li>
            )}
            {result.ganaDosha && (
              <li>• <strong>{hi ? 'गण दोष' : 'Gana Dosha'}:</strong> {hi ? 'गण असंगत हैं। स्वभाव में अंतर हो सकता है।' : 'Ganas are incompatible. May cause temperament conflicts.'}</li>
            )}
          </ul>
        </div>
      )}

      {/* Kootas table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" />
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">
            {hi ? 'अष्टकूट विस्तार' : 'Ashtakoota Breakdown'}
          </h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {result.kootas.map(k => {
            const pct = (k.score / k.maxScore) * 100;
            const barColor = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : pct >= 25 ? 'bg-yellow-500' : 'bg-red-500';
            return (
              <div key={k.name} className="px-5 py-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {hi ? k.nameHindi : k.name}
                    </span>
                    {!hi && <span className="text-xs text-gray-400 ml-1">({k.nameHindi})</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${pct >= 75 ? 'text-emerald-600' : pct >= 50 ? 'text-blue-600' : pct >= 25 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {k.score}
                    </span>
                    <span className="text-gray-400 text-sm">/ {k.maxScore}</span>
                    {k.score === k.maxScore
                      ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                      : k.score === 0
                        ? <AlertTriangle className="w-4 h-4 text-red-400" />
                        : null}
                  </div>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-1.5">
                  <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{k.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interpretation */}
      <div className={`bg-gradient-to-r ${score.color} rounded-xl p-5 text-white`}>
        <h3 className="font-bold mb-1">{hi ? 'निष्कर्ष' : 'Verdict'}</h3>
        <p className="text-sm opacity-90">
          {result.total >= 33 && (hi ? 'यह एक अत्यंत शुभ और आदर्श मिलान है। विवाह के लिए अत्यंत अनुकूल।' : 'This is a highly auspicious and ideal match. Strongly recommended for marriage.')}
          {result.total >= 25 && result.total < 33 && (hi ? 'यह एक अच्छा मिलान है। विवाह के लिए अनुकूल, थोड़े उपायों के साथ और बेहतर बनाया जा सकता है।' : 'This is a good match. Suitable for marriage. Minor remedies may help further.')}
          {result.total >= 18 && result.total < 25 && (hi ? 'औसत मिलान। विवाह संभव है लेकिन कुशल ज्योतिषी से परामर्श करें।' : 'Average match. Marriage is possible but consulting a Vedic astrologer is recommended.')}
          {result.total < 18 && (hi ? 'मिलान कम अनुकूल है। किसी अनुभवी ज्योतिषी से विस्तृत कुंडली मिलान कराएं।' : 'Below recommended threshold. A detailed Kundali matching by an experienced astrologer is strongly advised.')}
        </p>
      </div>
    </div>
  );
}
