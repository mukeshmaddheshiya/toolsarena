export interface BiodataTemplate {
  id: string;
  name: string;
  headerBg: string;
  headerText: string;
  accentColor: string;
  borderColor: string;
  bodyBg: string;
  bodyText: string;
  labelColor: string;
  fontFamily: string;
  symbol: string;
  borderStyle: string;
}

export const TEMPLATES: BiodataTemplate[] = [
  {
    id: 'classic-gold',
    name: 'Classic Gold',
    headerBg: '#8B6914',
    headerText: '#ffffff',
    accentColor: '#D4A017',
    borderColor: '#D4A017',
    bodyBg: '#FFFEF7',
    bodyText: '#3D2B1F',
    labelColor: '#8B6914',
    fontFamily: 'Georgia, serif',
    symbol: '\u0950', // Om
    borderStyle: '3px double #D4A017',
  },
  {
    id: 'royal-blue',
    name: 'Royal Blue',
    headerBg: '#1E3A5F',
    headerText: '#ffffff',
    accentColor: '#2563EB',
    borderColor: '#2563EB',
    bodyBg: '#F8FAFF',
    bodyText: '#1E293B',
    labelColor: '#1E3A5F',
    fontFamily: 'Georgia, serif',
    symbol: '\u2764', // Heart
    borderStyle: '2px solid #2563EB',
  },
  {
    id: 'floral-pink',
    name: 'Floral Pink',
    headerBg: '#BE185D',
    headerText: '#ffffff',
    accentColor: '#EC4899',
    borderColor: '#F9A8D4',
    bodyBg: '#FFF5F7',
    bodyText: '#4A1942',
    labelColor: '#BE185D',
    fontFamily: 'Georgia, serif',
    symbol: '\u2740', // Flower
    borderStyle: '2px solid #F9A8D4',
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    headerBg: '#18181B',
    headerText: '#ffffff',
    accentColor: '#3B82F6',
    borderColor: '#E2E8F0',
    bodyBg: '#FFFFFF',
    bodyText: '#334155',
    labelColor: '#64748B',
    fontFamily: 'Arial, sans-serif',
    symbol: '',
    borderStyle: '1px solid #E2E8F0',
  },
  {
    id: 'auspicious-red',
    name: 'Auspicious Red',
    headerBg: '#991B1B',
    headerText: '#FEF3C7',
    accentColor: '#DC2626',
    borderColor: '#DC2626',
    bodyBg: '#FFFBEB',
    bodyText: '#44140B',
    labelColor: '#991B1B',
    fontFamily: 'Georgia, serif',
    symbol: '\u0950', // Om
    borderStyle: '3px double #DC2626',
  },
  {
    id: 'ganesh-blessing',
    name: 'Ganesh Blessing',
    headerBg: '#C2410C',
    headerText: '#FFFBEB',
    accentColor: '#EA580C',
    borderColor: '#FDBA74',
    bodyBg: '#FFF7ED',
    bodyText: '#431407',
    labelColor: '#C2410C',
    fontFamily: 'Georgia, serif',
    symbol: '\u{1F54A}\uFE0F',
    borderStyle: '2px solid #FDBA74',
  },
  {
    id: 'peacock-green',
    name: 'Peacock Green',
    headerBg: '#065F46',
    headerText: '#ECFDF5',
    accentColor: '#059669',
    borderColor: '#6EE7B7',
    bodyBg: '#F0FDF4',
    bodyText: '#14532D',
    labelColor: '#065F46',
    fontFamily: 'Georgia, serif',
    symbol: '\u2766', // Floral heart
    borderStyle: '2px solid #6EE7B7',
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    headerBg: '#581C87',
    headerText: '#F5F3FF',
    accentColor: '#7C3AED',
    borderColor: '#C4B5FD',
    bodyBg: '#FAF5FF',
    bodyText: '#3B0764',
    labelColor: '#581C87',
    fontFamily: 'Georgia, serif',
    symbol: '\u2605', // Star
    borderStyle: '2px solid #C4B5FD',
  },
  {
    id: 'simple-white',
    name: 'Simple White',
    headerBg: '#475569',
    headerText: '#ffffff',
    accentColor: '#64748B',
    borderColor: '#CBD5E1',
    bodyBg: '#FFFFFF',
    bodyText: '#334155',
    labelColor: '#64748B',
    fontFamily: 'Arial, sans-serif',
    symbol: '',
    borderStyle: '1px solid #CBD5E1',
  },
  {
    id: 'saffron-pride',
    name: 'Saffron',
    headerBg: '#B45309',
    headerText: '#FFFBEB',
    accentColor: '#D97706',
    borderColor: '#FCD34D',
    bodyBg: '#FFFBEB',
    bodyText: '#451A03',
    labelColor: '#B45309',
    fontFamily: 'Georgia, serif',
    symbol: '\u2726', // Four star
    borderStyle: '2px solid #FCD34D',
  },
];
