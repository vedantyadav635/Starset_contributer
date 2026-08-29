import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';
import { Section } from '../components/ui/Layout';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { Waveform, Spectrogram, WaveLine } from '../components/Waveform';
import { CTASection } from '../components/CTASection';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
}

const SECTIONS = [
  {
    id: 'sound-to-numbers',
    kicker: '01',
    title: 'Sound becomes numbers',
    body: [
      'A microphone measures air pressure thousands of times a second. At 16 kHz — the sample rate most speech models expect — that is sixteen thousand numbers for every second of audio. Nothing about that sequence is meaningful yet; it is just a very long list.',
      'The first thing a speech system does is turn that list into a picture of energy across frequency and time. That is what a spectrogram is: loud in the low bands where vowels live, sparser and sharper where consonants cut through. Models learn on this representation rather than the raw wave.',
    ],
    visual: 'spectrogram' as const,
  },
  {
    id: 'patterns',
    kicker: '02',
    title: 'The model learns patterns, not language',
    body: [
      'Training pairs each stretch of audio with what was actually said. Over millions of pairs, the model learns which spectral shapes tend to correspond to which sounds, and which sequences of sounds tend to form real words.',
      'It never learns language the way a person does. It learns correlations in the data it was shown — which is why the composition of that data decides everything about what the model can hear.',
    ],
    visual: 'wave' as const,
  },
  {
    id: 'gap',
    kicker: '03',
    title: 'Which is why coverage is the whole game',
    body: [
      'If a training set contains mostly broadcast-standard accents recorded in quiet studios, that is the range the model is confident in. A regional dialect, a noisy kitchen, a cheap phone microphone — each of these is a distribution the model has barely seen, and error rates climb accordingly.',
      'This failure is not evenly distributed. It falls on exactly the speakers who were hardest to record in the first place, which is a reason to go and record them deliberately rather than hope a scrape happens to include them.',
    ],
    visual: 'line' as const,
  },
  {
    id: 'human',
    kicker: '04',
    title: 'Where a human contributor fits',
    body: [
      'Synthetic audio and augmentation help, but they can only recombine what already exists. They cannot invent the prosody of a dialect nobody recorded, or the specific way a phrase is clipped in ordinary conversation.',
      'A contributor recording a two-minute task is adding a genuinely new point to that distribution: their accent, their room, their device. Labelled, checked and described, that becomes something a model can learn from.',
    ],
    visual: 'wave' as const,
  },
  {
    id: 'structure',
    kicker: '05',
    title: 'And why the metadata matters as much as the audio',
    body: [
      'A folder of clips is not a dataset. Without knowing the language, the duration, the encoding, the prompt each clip answers and whether anyone verified it, a data team cannot filter, balance or debug what they have.',
      'Structure is what makes audio trainable. It is also what makes it auditable — which distribution you actually trained on, and which speakers you still have not heard from.',
    ],
    visual: 'spectrogram' as const,
  },
];

export const AITrainingGuide: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <PublicLayout currentPage="ai-training-guide" onNavigate={onNavigate} onEnterApp={onEnterApp}>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <PageHero
        eyebrow="Guide"
        title={['How AI models learn', 'from human audio.']}
        lede="No jargon, no hand-waving. What actually happens to a recording between a microphone and a working speech model — and why the data, not the architecture, is usually the limit."
        atmosphere="points"
        aside={
          <div className="card overflow-hidden">
            <div className="border-b border-line px-5 py-3">
              <span className="t-meta">Energy across frequency and time</span>
            </div>
            <div className="px-5 py-6">
              <Spectrogram seed="guide-hero-panel" columns={80} rows={16} height={110} />
              <div className="mt-3 flex justify-between">
                <span className="t-meta">0.0 s</span>
                <span className="t-meta">Spectrogram</span>
                <span className="t-meta">2.4 s</span>
              </div>
            </div>
            <p className="border-t border-line bg-paper-sunk px-5 py-3 text-xs text-muted">
              This representation — not the raw waveform — is what a speech model learns on.
            </p>
          </div>
        }
      />

      {/* ═══════════════════════ CONTENTS ═══════════════════════ */}
      <Section space="sm" tone="sunk" bordered>
        <nav aria-label="On this page">
          <p className="t-meta">Contents</p>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="flex items-baseline gap-3 rounded-md px-3 py-2 text-sm text-body transition-colors hover:bg-surface hover:text-ink"
                >
                  <span className="t-meta flex-none">{section.kicker}</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Section>

      {/* ═══════════════════════ BODY ═══════════════════════ */}
      <Section space="md">
        <div className="space-y-16 lg:space-y-24">
          {SECTIONS.map((section) => (
            <article key={section.id} id={section.id} className="scroll-mt-28">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] lg:gap-16">
                <Reveal>
                  <span className="t-meta">{section.kicker}</span>
                  <h2 className="t-h2 mt-3">{section.title}</h2>
                </Reveal>

                <div>
                  <Reveal delay={80}>
                    <div className="space-y-4">
                      {section.body.map((paragraph) => (
                        <p key={paragraph.slice(0, 24)} className="text-[1.0625rem] leading-relaxed text-body">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </Reveal>

                  <Reveal delay={140}>
                    <div className="mt-8 card overflow-hidden">
                      <div className="border-b border-line px-4 py-2.5">
                        <span className="t-meta">
                          {section.visual === 'spectrogram'
                            ? 'Energy across frequency and time'
                            : section.visual === 'line'
                              ? 'Amplitude over time'
                              : 'Speech envelope'}
                        </span>
                      </div>
                      <div className="px-4 py-5">
                        {section.visual === 'spectrogram' && (
                          <Spectrogram seed={section.id} columns={90} rows={16} height={90} />
                        )}
                        {section.visual === 'wave' && (
                          <Waveform seed={section.id} bars={90} height={70} />
                        )}
                        {section.visual === 'line' && (
                          <WaveLine seed={section.id} points={130} height={80} filled />
                        )}
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CTASection
        eyebrow="Contribute"
        title="Add your voice to the distribution"
        body="Two minutes of your speech is a data point no scrape can produce."
        primary={
          <Button size="lg" onClick={onEnterApp}>
            Start contributing
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Button>
        }
        secondary={
          <Button size="lg" variant="secondary" onClick={() => onNavigate('marketplace')}>
            Browse collections
          </Button>
        }
      />
    </PublicLayout>
  );
};
