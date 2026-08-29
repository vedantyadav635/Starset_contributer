import React from 'react';
import { ArrowRight, Code2, Headphones, Languages, LineChart } from 'lucide-react';

import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';
import { Section, SectionHeading } from '../components/ui/Layout';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
}

const AREAS = [
  {
    icon: Code2,
    title: 'Engineering',
    body: 'The contributor app, the review console, and the validation pipeline between them. Browser audio capture, upload handling and quality checks that run before a human ever listens.',
  },
  {
    icon: Headphones,
    title: 'Data operations',
    body: 'Running collections end to end: turning a brief into a task definition, reviewing submissions against the prompt, and keeping the quality bar consistent across reviewers.',
  },
  {
    icon: Languages,
    title: 'Language quality',
    body: 'Native-speaker judgement on dialect, pronunciation and script accuracy — the work that decides whether a regional collection is genuinely representative.',
  },
  {
    icon: LineChart,
    title: 'Operations & growth',
    body: 'Speaker recruitment for specific dialects and regions, contributor support, and the commercial side of scoping collections with AI teams.',
  },
];

export const Careers: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => (
  <PublicLayout currentPage="careers" onNavigate={onNavigate} onEnterApp={onEnterApp}>
    <PageHero
      eyebrow="Careers"
      title={['Work on the', 'unglamorous half of AI.']}
      lede="Nobody writes headlines about audio validation. It is also the difference between a speech model that works for a region and one that does not."
      atmosphere="points"
      factsLabel="How we hire"
      facts={[
        { label: 'Open listings', value: 'None published right now', hint: 'We would rather say so than keep a stale page' },
        { label: 'How to apply', value: 'careers@starset.ai', hint: 'Name the area your work maps to' },
        { label: 'Areas', value: 'Engineering · Data ops · Language · Growth' },
      ]}
    />

    <Section space="md">
      <SectionHeading
        eyebrow="Where we hire"
        title="Areas we look for people in"
        lede="We are not running a public listings page right now. If your work sits in one of these areas, write to us directly and be specific about which."
      />

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
        {AREAS.map((area, i) => (
          <Reveal key={area.title} delay={i * 70} className="bg-surface">
            <article className="flex h-full flex-col gap-3.5 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-signal-soft text-signal">
                <area.icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h2 className="t-h4">{area.title}</h2>
              <p className="text-body">{area.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>

    <Section tone="sunk" bordered space="md">
      <Reveal>
        <div className="card mx-auto max-w-2xl p-8 text-center sm:p-10">
          <h2 className="t-h3">No open listings today</h2>
          <p className="mx-auto mt-3 max-w-md text-body">
            We would rather say that than keep a page of roles we are not actively filling. Send
            us what you have worked on and which area it maps to — we read everything that arrives.
          </p>
          <Button className="mt-7" size="lg" onClick={() => { window.location.href = 'mailto:careers@starset.ai?subject=Careers%20at%20Starset'; }}>
            Email careers@starset.ai
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Button>

          <p className="mt-8 border-t border-line pt-6 text-sm text-body">
            Looking to record rather than to be employed?{' '}
            <button type="button" className="link" onClick={onEnterApp}>
              Become a contributor
            </button>
            .
          </p>
        </div>
      </Reveal>
    </Section>
  </PublicLayout>
);
