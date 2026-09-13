/**
 * Job openings at Starset Intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * To publish a new role: add an entry below with `active: true`.
 * To close a role:       set `active: false` (or remove the entry).
 * The Careers page reads this array and renders it automatically.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type JobType = 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
export type JobDepartment = 'Engineering' | 'Data Ops' | 'AI / ML' | 'Language' | 'Growth' | 'Design';

export interface JobOpening {
  id: string;
  title: string;
  department: JobDepartment;
  type: JobType;
  location: string;
  posted: string;            // ISO date string
  active: boolean;
  summary: string;           // 1-2 line teaser shown on the card
  about: string;             // What the role is about
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  perks?: string[];
}

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: 'aiml-intern-2026',
    title: 'AI/ML Intern',
    department: 'AI / ML',
    type: 'Internship',
    location: 'Remote (India)',
    posted: '2026-09-13',
    active: true,
    summary:
      'Work on real-world data, build data pipelines and train machine learning models that create real impact.',
    about:
      'Join Starset Intelligence as an AI/ML Intern and work at the intersection of human data and machine intelligence. You will help build and improve the data pipelines that power our multilingual voice datasets, train and evaluate ML models, and contribute to making AI more inclusive for Indian languages.',
    responsibilities: [
      'Build and maintain data processing pipelines for audio and text data',
      'Train, evaluate and fine-tune ML models for speech and language tasks',
      'Analyze and improve data quality metrics across multilingual datasets',
      'Experiment with model architectures for ASR, TTS and audio classification',
      'Document experiments, results and model performance benchmarks',
      'Collaborate with the data ops team on collection quality and annotation workflows',
    ],
    requirements: [
      'Good understanding of data and ML fundamentals',
      'Hands-on experience with data pipelines (Python, ETL tools, etc.)',
      'Familiar with ML libraries (PyTorch, TensorFlow, scikit-learn)',
      'Comfortable with Python, Jupyter/Colab, and version control (Git)',
      'Curious, proactive and excited to work in a fast-paced startup',
    ],
    niceToHave: [
      'Experience with speech/audio processing (librosa, torchaudio)',
      'Familiarity with Hugging Face Transformers and model fine-tuning',
      'Knowledge of Indian languages or multilingual NLP',
      'Prior internship or project experience in data engineering or ML',
    ],
    perks: [
      'Work on real-world multilingual datasets used by AI companies',
      'Direct mentorship from the founding team',
      'Flexible remote work across India',
      'Pre-placement offer (PPO) for exceptional performers',
      'Certificate of completion and LinkedIn recommendation',
    ],
  },
];

/** Only the active openings. */
export const ACTIVE_JOBS = JOB_OPENINGS.filter((j) => j.active);

/** Count by department for the hero facts. */
export const OPEN_COUNT = ACTIVE_JOBS.length;
