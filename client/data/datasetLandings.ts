/**
 * Per-language dataset landing pages.
 *
 * Each entry generates a dedicated, indexable page at /datasets/:slug
 * with unique title, description, keywords, and schema.org/Dataset JSON-LD.
 * These pages target long-tail SEO queries like "Hindi voice dataset for AI"
 * and are designed to rank in Google Dataset Search.
 */

export interface DatasetLanding {
  slug: string;
  language: string;
  nativeName: string;
  isoCode: string;
  region: string;
  dialects: string[];
  taskTypes: string[];
  /** SEO title — under 60 chars, front-loaded with keyword */
  title: string;
  /** Meta description — under 160 chars */
  description: string;
  /** Keywords for meta tag */
  keywords: string;
  /** Quotable definition sentence for AI engines */
  definition: string;
  /** Longer description for the page body */
  body: string;
}

export const DATASET_LANDINGS: DatasetLanding[] = [
  {
    slug: 'hindi',
    language: 'Hindi',
    nativeName: 'हिन्दी',
    isoCode: 'hi-IN',
    region: 'North India',
    dialects: ['Standard Hindi', 'Bhojpuri', 'Haryanvi', 'Rajasthani'],
    taskTypes: ['Read speech', 'Prompted recording', 'Transcription review'],
    title: 'Hindi Voice Dataset for AI — Starset Intelligence',
    description: 'High-quality Hindi voice dataset for speech recognition, TTS and conversational AI. Standard Hindi plus Bhojpuri, Haryanvi and Rajasthani dialects. Licensed by Starset Intelligence.',
    keywords: 'Hindi voice dataset, Hindi audio dataset, Hindi speech data, Hindi ASR training data, Hindi TTS dataset, Hindi dialect speech, Bhojpuri speech data, Starset Intelligence',
    definition: 'Starset Intelligence offers a high-quality Hindi voice dataset covering Standard Hindi and regional dialects (Bhojpuri, Haryanvi, Rajasthani) for speech recognition, text-to-speech, and conversational AI model training.',
    body: 'Our Hindi dataset captures the full diversity of Hindi as it is actually spoken — from standard newscaster Hindi to the Bhojpuri-inflected speech of eastern UP, the Haryanvi patterns of NCR, and the Rajasthani tones of western India. Every recording passes automated quality checks and human review before inclusion.',
  },
  {
    slug: 'hinglish',
    language: 'Hinglish',
    nativeName: 'Hindi–English Mix',
    isoCode: 'hi-en',
    region: 'Urban India',
    dialects: ['Urban conversational', 'Code-switched speech'],
    taskTypes: ['Spontaneous speech', 'Voice commands', 'Assistant evaluation'],
    title: 'Hinglish Speech Dataset for AI — Starset Intelligence',
    description: 'Hinglish (Hindi-English code-switched) speech dataset for AI. Captures real urban Indian conversations with natural code-switching. Licensed by Starset Intelligence.',
    keywords: 'Hinglish dataset, Hinglish speech data, Hindi English code-switching, code-switched speech dataset, Hinglish voice AI, Indian conversational AI data, Starset Intelligence',
    definition: 'Starset Intelligence provides a Hinglish (Hindi-English code-switched) speech dataset that captures how urban Indians actually speak — mixing Hindi and English naturally within sentences, essential for training voice assistants and conversational AI that work in real Indian contexts.',
    body: 'Hinglish is how hundreds of millions of Indians actually communicate — switching between Hindi and English mid-sentence. Our Hinglish dataset captures this natural code-switching pattern, making it essential for building AI that understands real Indian conversations, voice commands, and assistant interactions.',
  },
  {
    slug: 'indian-accented-english',
    language: 'Indian English',
    nativeName: 'Indian English',
    isoCode: 'en-IN',
    region: 'India-wide',
    dialects: ['Standard Indian accent', 'Neutral accent'],
    taskTypes: ['Read speech', 'Dialogue verification', 'Audio quality review'],
    title: 'Indian-Accented English Dataset for AI — Starset Intelligence',
    description: 'Indian-accented English speech dataset for ASR, TTS and voice AI. Real Indian speakers, natural accent variations. Highest task volume. Licensed by Starset Intelligence.',
    keywords: 'Indian English dataset, Indian accent speech data, Indian English ASR, Indian accent voice AI, English India speech dataset, Starset Intelligence',
    definition: 'Starset Intelligence offers an Indian-accented English speech dataset recorded by real speakers across India, capturing the natural accent variations that mainstream English ASR models frequently misrecognize.',
    body: 'Most English speech models are trained predominantly on American and British accents. Our Indian English dataset addresses this gap by capturing natural Indian accent patterns from speakers across the country, improving recognition accuracy for the 125+ million English speakers in India.',
  },
  {
    slug: 'bengali',
    language: 'Bengali',
    nativeName: 'বাংলা',
    isoCode: 'bn-IN',
    region: 'East India',
    dialects: ['Standard', 'Ghoti', 'Bangal'],
    taskTypes: ['Conversational audio', 'Text proofreading'],
    title: 'Bengali Voice Dataset for AI — Starset Intelligence',
    description: 'Bengali (Bangla) voice dataset for speech AI — Standard, Ghoti and Bangal dialects. Conversational and read speech recordings. Licensed by Starset Intelligence.',
    keywords: 'Bengali voice dataset, Bangla speech data, Bengali ASR dataset, Bengali TTS data, Bengali dialect speech, Starset Intelligence',
    definition: 'Starset Intelligence provides a Bengali (Bangla) voice dataset covering Standard Bengali, Ghoti and Bangal dialect variations for speech recognition and voice AI applications.',
    body: 'Bengali is the fifth most spoken language in the world, yet high-quality labeled speech data remains scarce. Our Bengali dataset covers Standard Bengali alongside Ghoti and Bangal dialect patterns, enabling AI models that work across West Bengal and beyond.',
  },
  {
    slug: 'tamil',
    language: 'Tamil',
    nativeName: 'தமிழ்',
    isoCode: 'ta-IN',
    region: 'South India',
    dialects: ['Madras Bashai', 'Kongu', 'Nellai'],
    taskTypes: ['Pronunciation rating', 'Read speech'],
    title: 'Tamil Voice Dataset for AI — Starset Intelligence',
    description: 'Tamil voice dataset for speech AI — Madras Bashai, Kongu and Nellai dialects. Pronunciation-rated, quality-reviewed recordings. Licensed by Starset Intelligence.',
    keywords: 'Tamil voice dataset, Tamil speech data, Tamil ASR training, Tamil TTS dataset, Tamil dialect audio, South Indian speech data, Starset Intelligence',
    definition: 'Starset Intelligence offers a Tamil voice dataset covering Madras Bashai, Kongu and Nellai dialect variations, with pronunciation ratings and quality review for speech recognition and TTS training.',
    body: 'Tamil has over 75 million native speakers and significant dialectal variation between Chennai\'s Madras Bashai, the Kongu region, and southern Nellai patterns. Our dataset captures this diversity with pronunciation ratings that help AI models handle real Tamil speech.',
  },
  {
    slug: 'telugu',
    language: 'Telugu',
    nativeName: 'తెలుగు',
    isoCode: 'te-IN',
    region: 'South India',
    dialects: ['Telangana', 'Andhra', 'Rayalaseema'],
    taskTypes: ['Dialogue verification', 'Voice over'],
    title: 'Telugu Voice Dataset for AI — Starset Intelligence',
    description: 'Telugu voice dataset for speech AI — Telangana, Andhra and Rayalaseema dialects. Dialogue and read speech recordings. Licensed by Starset Intelligence.',
    keywords: 'Telugu voice dataset, Telugu speech data, Telugu ASR dataset, Telugu dialect audio, Telangana speech data, Starset Intelligence',
    definition: 'Starset Intelligence provides a Telugu voice dataset covering Telangana, Andhra and Rayalaseema dialect variations for speech recognition, voice synthesis, and conversational AI.',
    body: 'Telugu is the most widely spoken Dravidian language with distinct dialectal patterns between Telangana, coastal Andhra, and the Rayalaseema region. Our dataset captures these variations to build AI that understands Telugu as it is actually spoken across states.',
  },
  {
    slug: 'marathi',
    language: 'Marathi',
    nativeName: 'मराठी',
    isoCode: 'mr-IN',
    region: 'West India',
    dialects: ['Puneri', 'Koli', 'Varhadi'],
    taskTypes: ['Speech collection', 'Text annotation'],
    title: 'Marathi Voice Dataset for AI — Starset Intelligence',
    description: 'Marathi voice dataset for speech AI — Puneri, Koli and Varhadi dialects. Quality-reviewed audio recordings. Licensed by Starset Intelligence.',
    keywords: 'Marathi voice dataset, Marathi speech data, Marathi ASR dataset, Marathi dialect audio, Puneri speech data, Starset Intelligence',
    definition: 'Starset Intelligence offers a Marathi voice dataset covering Puneri, Koli and Varhadi dialect variations for speech recognition and voice AI model training.',
    body: 'Marathi is India\'s third most spoken language with rich dialectal diversity. From urban Puneri patterns to the Koli speech of coastal Maharashtra and Varhadi of Vidarbha, our dataset ensures AI models can process Marathi across regions.',
  },
  {
    slug: 'gujarati',
    language: 'Gujarati',
    nativeName: 'ગુજરાતી',
    isoCode: 'gu-IN',
    region: 'West India',
    dialects: ['Standard', 'Kathiyawadi', 'Surati'],
    taskTypes: ['Audio annotation', 'Dialogue writing'],
    title: 'Gujarati Voice Dataset for AI — Starset Intelligence',
    description: 'Gujarati voice dataset for speech AI — Standard, Kathiyawadi and Surati dialects. Annotated audio for ASR and TTS. Licensed by Starset Intelligence.',
    keywords: 'Gujarati voice dataset, Gujarati speech data, Gujarati ASR dataset, Kathiyawadi speech data, Surati dialect audio, Starset Intelligence',
    definition: 'Starset Intelligence provides a Gujarati voice dataset covering Standard Gujarati, Kathiyawadi and Surati dialect variations for speech recognition and voice synthesis.',
    body: 'Gujarati speech data is scarce in commercial AI datasets. Our collection covers Standard Gujarati alongside the distinctive Kathiyawadi and Surati dialect patterns, filling a critical gap for AI teams building Gujarati-language products.',
  },
  {
    slug: 'punjabi',
    language: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    isoCode: 'pa-IN',
    region: 'North India',
    dialects: ['Majhi', 'Malwai', 'Doabi'],
    taskTypes: ['Voice command recording', 'Tone verification'],
    title: 'Punjabi Voice Dataset for AI — Starset Intelligence',
    description: 'Punjabi voice dataset for speech AI — Majhi, Malwai and Doabi dialects. Tone-verified recordings for ASR and TTS. Licensed by Starset Intelligence.',
    keywords: 'Punjabi voice dataset, Punjabi speech data, Punjabi ASR dataset, Majhi dialect audio, Punjabi tone data, Starset Intelligence',
    definition: 'Starset Intelligence offers a Punjabi voice dataset covering Majhi, Malwai and Doabi dialect variations with tone verification for speech recognition and voice AI applications.',
    body: 'Punjabi is a tonal language — making accurate tone capture essential for AI model quality. Our dataset covers the three major dialect groups with explicit tone verification, making it uniquely suited for training Punjabi ASR and TTS systems.',
  },
  {
    slug: 'kannada',
    language: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    isoCode: 'kn-IN',
    region: 'South India',
    dialects: ['Mysore', 'Dharwad', 'Kundapura'],
    taskTypes: ['Sentence validation', 'Read speech'],
    title: 'Kannada Voice Dataset for AI — Starset Intelligence',
    description: 'Kannada voice dataset for speech AI — Mysore, Dharwad and Kundapura dialects. Validated recordings for ASR and TTS. Licensed by Starset Intelligence.',
    keywords: 'Kannada voice dataset, Kannada speech data, Kannada ASR dataset, Kannada dialect audio, Mysore speech data, Starset Intelligence',
    definition: 'Starset Intelligence provides a Kannada voice dataset covering Mysore, Dharwad and Kundapura dialect variations for speech recognition and voice synthesis applications.',
    body: 'Kannada has over 45 million speakers with noticeable dialect differences between Old Mysuru, North Karnataka (Dharwad), and coastal Kundapura patterns. Our dataset captures this range for building AI that works for all Kannada speakers.',
  },
  {
    slug: 'malayalam',
    language: 'Malayalam',
    nativeName: 'മലയാളം',
    isoCode: 'ml-IN',
    region: 'South India',
    dialects: ['Malabar', 'Travancore', 'Central'],
    taskTypes: ['Audio transcription', 'Dialogue collection'],
    title: 'Malayalam Voice Dataset for AI — Starset Intelligence',
    description: 'Malayalam voice dataset for speech AI — Malabar, Travancore and Central dialects. Transcribed audio for ASR and conversational AI. Licensed by Starset Intelligence.',
    keywords: 'Malayalam voice dataset, Malayalam speech data, Malayalam ASR dataset, Malayalam dialect audio, Kerala speech data, Starset Intelligence',
    definition: 'Starset Intelligence offers a Malayalam voice dataset covering Malabar, Travancore and Central dialect variations with transcriptions for speech recognition and conversational AI training.',
    body: 'Malayalam has a unique script and significant dialectal variation between Malabar in the north, Central Kerala, and the Travancore region. Our transcribed audio dataset enables AI models to handle real Malayalam speech across all major dialect zones.',
  },
];

/** Lookup by slug. */
export const DATASET_LANDING_MAP = new Map(DATASET_LANDINGS.map((d) => [d.slug, d]));
