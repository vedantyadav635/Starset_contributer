/**
 * Languages and dialects Starset collects audio in.
 *
 * `indicativeRate` is a guide only — the actual compensation for any task is
 * set on the task itself and shown to the contributor before they start.
 */

export type LanguageCategory = 'north' | 'south' | 'conversational';

export interface LanguageEntry {
  id: string;
  name: string;
  nativeName: string;
  category: LanguageCategory;
  /** Indicative hourly guide. Never presented as a guaranteed rate. */
  indicativeRate: string;
  dialects: string[];
  tasks: string[];
  note?: string;
  active: boolean;
}

export const CATEGORY_LABEL: Record<LanguageCategory | 'all', string> = {
  all: 'All languages',
  north: 'North Indian',
  south: 'South Indian',
  conversational: 'Conversational',
};

export const LANGUAGES: LanguageEntry[] = [
  {
    id: 'english',
    name: 'English',
    nativeName: 'Indian English',
    category: 'conversational',
    indicativeRate: '₹250 – ₹450 / hr',
    dialects: ['Standard Indian', 'Neutral accent'],
    tasks: ['Read speech', 'Dialogue verification', 'Audio quality review'],
    note: 'Highest task volume',
    active: true,
  },
  {
    id: 'hinglish',
    name: 'Hinglish',
    nativeName: 'Hindi–English mix',
    category: 'conversational',
    indicativeRate: '₹250 – ₹400 / hr',
    dialects: ['Urban conversational', 'Code-switched speech'],
    tasks: ['Spontaneous speech', 'Voice commands', 'Assistant evaluation'],
    note: 'Code-switching is specifically requested',
    active: true,
  },
  {
    id: 'hindi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    category: 'north',
    indicativeRate: '₹180 – ₹320 / hr',
    dialects: ['Standard', 'Bhojpuri', 'Haryanvi', 'Rajasthani'],
    tasks: ['Read speech', 'Prompted recording', 'Transcription review'],
    active: true,
  },
  {
    id: 'bengali',
    name: 'Bengali',
    nativeName: 'বাংলা',
    category: 'north',
    indicativeRate: '₹200 – ₹350 / hr',
    dialects: ['Standard', 'Ghoti', 'Bangal'],
    tasks: ['Conversational audio', 'Text proofreading'],
    active: true,
  },
  {
    id: 'punjabi',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    category: 'north',
    indicativeRate: '₹220 – ₹360 / hr',
    dialects: ['Majhi', 'Malwai', 'Doabi'],
    tasks: ['Voice command recording', 'Tone verification'],
    active: true,
  },
  {
    id: 'gujarati',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    category: 'north',
    indicativeRate: '₹190 – ₹330 / hr',
    dialects: ['Standard', 'Kathiyawadi', 'Surati'],
    tasks: ['Audio annotation', 'Dialogue writing'],
    active: true,
  },
  {
    id: 'marathi',
    name: 'Marathi',
    nativeName: 'मराठी',
    category: 'north',
    indicativeRate: '₹200 – ₹340 / hr',
    dialects: ['Puneri', 'Koli', 'Varhadi'],
    tasks: ['Speech collection', 'Text annotation'],
    active: true,
  },
  {
    id: 'tamil',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    category: 'south',
    indicativeRate: '₹220 – ₹380 / hr',
    dialects: ['Madras Bashai', 'Kongu', 'Nellai'],
    tasks: ['Pronunciation rating', 'Read speech'],
    note: 'Dialect coverage actively expanding',
    active: true,
  },
  {
    id: 'telugu',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    category: 'south',
    indicativeRate: '₹210 – ₹360 / hr',
    dialects: ['Telangana', 'Andhra', 'Rayalaseema'],
    tasks: ['Dialogue verification', 'Voice over'],
    active: true,
  },
  {
    id: 'kannada',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    category: 'south',
    indicativeRate: '₹200 – ₹350 / hr',
    dialects: ['Mysore', 'Dharwad', 'Kundapura'],
    tasks: ['Sentence validation', 'Read speech'],
    active: true,
  },
  {
    id: 'malayalam',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    category: 'south',
    indicativeRate: '₹220 – ₹370 / hr',
    dialects: ['Malabar', 'Travancore', 'Central'],
    tasks: ['Audio transcription', 'Dialogue collection'],
    active: true,
  },
];

/**
 * Kept for backwards compatibility with the previous export shape.
 * New code should import `LANGUAGES`.
 */
export const LANGUAGES_DIRECTORY = LANGUAGES;
