/**
 * Marketplace catalogue.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the single source of truth for everything the marketplace lists.
 * Replace these entries with real inventory as collections complete; the page
 * derives its filters, counts and facets from whatever is in this array, so
 * nothing else needs editing.
 *
 * `status` is what keeps the page honest:
 *   available   — collected, reviewed, ready to hand over
 *   collecting  — live now, growing
 *   planned     — specified, not yet recruiting
 *
 * Do not mark a collection `available` until it actually is.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type DatasetStatus = 'available' | 'collecting' | 'planned';

export type PromptStyle = 'Read speech' | 'Spontaneous' | 'Short command' | 'Conversational';

export type Environment = 'Quiet indoor' | 'Household' | 'Street' | 'Mixed';

export interface DatasetListing {
  id: string;
  name: string;
  language: string;
  languageCode: string;
  dialects: string[];
  region: string;
  prompt: PromptStyle;
  environment: Environment;
  status: DatasetStatus;
  /** Approximate hours of accepted audio. Omit while a collection is planned. */
  hours?: number;
  clips?: number;
  speakers?: string;
  sampleRate: string;
  format: string;
  annotation: string;
  summary: string;
}

export const STATUS_LABEL: Record<DatasetStatus, string> = {
  available: 'Available',
  collecting: 'Collecting',
  planned: 'Planned',
};

export const DATASETS: DatasetListing[] = [
  {
    id: 'hi-conversational',
    name: 'Hindi conversational speech',
    language: 'Hindi',
    languageCode: 'hi-IN',
    dialects: ['Standard', 'Haryanvi', 'Bhojpuri'],
    region: 'North India',
    prompt: 'Spontaneous',
    environment: 'Household',
    status: 'collecting',
    hours: 42,
    clips: 9800,
    speakers: 'Mixed age and gender',
    sampleRate: '16 kHz',
    format: 'WAV',
    annotation: 'On request',
    summary: 'Unscripted two-party speech with natural code-switching into English.',
  },
  {
    id: 'ta-read',
    name: 'Tamil read speech',
    language: 'Tamil',
    languageCode: 'ta-IN',
    dialects: ['Madras Bashai', 'Kongu', 'Nellai'],
    region: 'Tamil Nadu',
    prompt: 'Read speech',
    environment: 'Quiet indoor',
    status: 'available',
    hours: 31,
    clips: 12400,
    speakers: 'Dialect-tagged',
    sampleRate: '16 kHz',
    format: 'WAV',
    annotation: 'Transcript',
    summary: 'Prompted sentence reading with dialect labelled at the speaker level.',
  },
  {
    id: 'en-in-commands',
    name: 'Indian English voice commands',
    language: 'English',
    languageCode: 'en-IN',
    dialects: ['Standard Indian', 'Regional accent spread'],
    region: 'Pan-India',
    prompt: 'Short command',
    environment: 'Mixed',
    status: 'available',
    hours: 18,
    clips: 21000,
    speakers: 'Accent-spread',
    sampleRate: '16 kHz',
    format: 'WAV',
    annotation: 'Intent label',
    summary: 'Wake words and short utterances for intent and keyword spotting.',
  },
  {
    id: 'mr-spontaneous',
    name: 'Marathi spontaneous speech',
    language: 'Marathi',
    languageCode: 'mr-IN',
    dialects: ['Puneri', 'Varhadi'],
    region: 'Maharashtra',
    prompt: 'Spontaneous',
    environment: 'Household',
    status: 'collecting',
    hours: 12,
    clips: 3100,
    speakers: 'Mixed age and gender',
    sampleRate: '16 kHz',
    format: 'WAV',
    annotation: 'Transcript',
    summary: 'Everyday household speech recorded on the devices people already own.',
  },
  {
    id: 'hinglish-assistant',
    name: 'Hinglish assistant turns',
    language: 'Hinglish',
    languageCode: 'mixed',
    dialects: ['Urban conversational'],
    region: 'Metro India',
    prompt: 'Conversational',
    environment: 'Mixed',
    status: 'collecting',
    hours: 26,
    clips: 7400,
    speakers: 'Adults, mixed',
    sampleRate: '16 kHz',
    format: 'WAV',
    annotation: 'Transcript',
    summary: 'Code-switched turns of the kind assistants actually receive in India.',
  },
  {
    id: 'bn-read',
    name: 'Bengali read speech',
    language: 'Bengali',
    languageCode: 'bn-IN',
    dialects: ['Standard', 'Ghoti', 'Bangal'],
    region: 'West Bengal',
    prompt: 'Read speech',
    environment: 'Quiet indoor',
    status: 'available',
    hours: 22,
    clips: 8600,
    speakers: 'Dialect-tagged',
    sampleRate: '16 kHz',
    format: 'WAV',
    annotation: 'Transcript',
    summary: 'Scripted reads balanced across three dialect groups.',
  },
  {
    id: 'te-conversational',
    name: 'Telugu conversational speech',
    language: 'Telugu',
    languageCode: 'te-IN',
    dialects: ['Telangana', 'Andhra', 'Rayalaseema'],
    region: 'Telangana & Andhra',
    prompt: 'Conversational',
    environment: 'Household',
    status: 'collecting',
    hours: 9,
    clips: 2400,
    speakers: 'Mixed age and gender',
    sampleRate: '16 kHz',
    format: 'WAV',
    annotation: 'On request',
    summary: 'Regional conversational speech across three distinct dialect areas.',
  },
  {
    id: 'kn-commands',
    name: 'Kannada voice commands',
    language: 'Kannada',
    languageCode: 'kn-IN',
    dialects: ['Mysore', 'Dharwad'],
    region: 'Karnataka',
    prompt: 'Short command',
    environment: 'Quiet indoor',
    status: 'planned',
    speakers: 'To be recruited',
    sampleRate: '16 kHz',
    format: 'WAV',
    annotation: 'Intent label',
    summary: 'Specified and awaiting speaker recruitment in two dialect areas.',
  },
  {
    id: 'ml-read',
    name: 'Malayalam read speech',
    language: 'Malayalam',
    languageCode: 'ml-IN',
    dialects: ['Malabar', 'Travancore', 'Central'],
    region: 'Kerala',
    prompt: 'Read speech',
    environment: 'Quiet indoor',
    status: 'planned',
    speakers: 'To be recruited',
    sampleRate: '16 kHz',
    format: 'WAV',
    annotation: 'Transcript',
    summary: 'Dialect-balanced reads, ready to open once speakers are matched.',
  },
  {
    id: 'pa-street',
    name: 'Punjabi speech in noise',
    language: 'Punjabi',
    languageCode: 'pa-IN',
    dialects: ['Majhi', 'Malwai'],
    region: 'Punjab',
    prompt: 'Spontaneous',
    environment: 'Street',
    status: 'collecting',
    hours: 6,
    clips: 1600,
    speakers: 'Adults, mixed',
    sampleRate: '16 kHz',
    format: 'WAV',
    annotation: 'On request',
    summary: 'Deliberately noisy captures for models that ship outside a quiet room.',
  },
  {
    id: 'gu-read',
    name: 'Gujarati read speech',
    language: 'Gujarati',
    languageCode: 'gu-IN',
    dialects: ['Standard', 'Kathiyawadi', 'Surati'],
    region: 'Gujarat',
    prompt: 'Read speech',
    environment: 'Quiet indoor',
    status: 'available',
    hours: 15,
    clips: 6200,
    speakers: 'Dialect-tagged',
    sampleRate: '16 kHz',
    format: 'WAV',
    annotation: 'Transcript',
    summary: 'Balanced reads across three dialect groups, reviewed clip by clip.',
  },
  {
    id: 'en-in-longform',
    name: 'Indian English long-form',
    language: 'English',
    languageCode: 'en-IN',
    dialects: ['Standard Indian'],
    region: 'Pan-India',
    prompt: 'Spontaneous',
    environment: 'Quiet indoor',
    status: 'planned',
    speakers: 'To be recruited',
    sampleRate: '16 kHz',
    format: 'WAV',
    annotation: 'Transcript',
    summary: 'Extended monologue for models that need more than an utterance.',
  },
];

/** Facets, derived so the filter bar never drifts out of sync with the data. */
export const LANGUAGE_FACETS = Array.from(new Set(DATASETS.map((d) => d.language))).sort();
export const PROMPT_FACETS = Array.from(new Set(DATASETS.map((d) => d.prompt))).sort();
export const ENVIRONMENT_FACETS = Array.from(new Set(DATASETS.map((d) => d.environment))).sort();

export const TOTAL_HOURS = DATASETS.reduce((sum, d) => sum + (d.hours ?? 0), 0);
export const AVAILABLE_COUNT = DATASETS.filter((d) => d.status === 'available').length;
