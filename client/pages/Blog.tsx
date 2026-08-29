import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';
import { Section, SectionHeading } from '../components/ui/Layout';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { Waveform, Spectrogram } from '../components/Waveform';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
}

/**
 * Notes indexes the explanatory writing that actually exists on the site.
 * No dated posts are invented to make the page look busier than it is.
 */
const NOTES: {
  kicker: string;
  title: string;
  summary: string;
  page: PublicPageType;
  seed: string;
  spectro?: boolean;
}[] = [
  {
    kicker: 'Explainer',
    title: 'How AI models learn from human audio',
    summary:
      'A plain account of how speech and voice models are trained, why recorded human speech is still the constraint, and where a contributor sits in that process.',
    page: 'ai-training-guide',
    seed: 'note-training',
    spectro: true,
  },
];

export const Blog: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => (
  <PublicLayout currentPage="blog" onNavigate={onNavigate} onEnterApp={onEnterApp}>
    <PageHero
      eyebrow="Notes"
      title={['Working notes', 'on audio data.']}
      lede="How we collect, what we check for, and why. Written for the people on both ends of the pipeline."
      atmosphere="points"
      factsLabel="In this section"
      facts={[
        { label: 'Explainer', value: 'How speech models learn from audio' },
      ]}
    />

    <Section space="md">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {NOTES.map((note, i) => (
          <Reveal key={note.page} delay={i * 80}>
            <article className="card card-interactive flex h-full flex-col overflow-hidden">
              <div className="border-b border-line bg-paper-sunk px-5 py-6">
                {note.spectro
                  ? <Spectrogram seed={note.seed} columns={48} rows={12} height={56} />
                  : <Waveform seed={note.seed} bars={44} height={56} />}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span className="t-meta">{note.kicker}</span>
                <h2 className="t-h4 mt-2.5">{note.title}</h2>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-body">{note.summary}</p>

                <button
                  type="button"
                  onClick={() => onNavigate(note.page)}
                  className="link-arrow mt-5 self-start text-signal"
                >
                  Read
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>

    <Section tone="sunk" bordered space="sm">
      <Reveal>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <SectionHeading
              title="More is being written"
              lede="Longer notes on dialect recruitment, validation thresholds and annotation are in progress. We publish them when they say something specific — not on a content calendar."
              size="h3"
            />
          </div>
          <Button variant="secondary" onClick={() => onNavigate('contact')} className="flex-none self-start sm:self-auto">
            Suggest a topic
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </Reveal>
    </Section>
  </PublicLayout>
);
