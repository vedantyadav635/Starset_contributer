import React from 'react';
import { ArrowRight } from 'lucide-react';

import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';
import { Container, Section, Eyebrow } from '../components/ui/Layout';
import { Reveal } from '../components/Reveal';
import { HeroSignal } from '../components/HeroSignal';
import { SignalMorph } from '../components/SignalMorph';
import { StickyStory, SignalSeam, LineReveal, Parallax } from '../components/Story';
import { ContributorJourney } from '../components/ContributorJourney';
import { FAQ } from '../components/FAQ';
import { CTASection } from '../components/CTASection';
import { Waveform } from '../components/Waveform';
import { LANGUAGES } from '../data/languages';

export { LANGUAGES_DIRECTORY } from '../data/languages';

interface LandingPageProps {
  onEnterApp: () => void;
  onStartSignup: () => void;
  onNavigate: (page: PublicPageType) => void;
}

/* ═══════════════════════════ Content ═══════════════════════════ */

/**
 * The homepage speaks to one person: someone deciding whether to record.
 * Buyers have their own front door at /marketplace.
 */
const STORY_STEPS = [
  { label: 'You record', caption: 'A short prompt, read in your own accent.' },
  { label: 'We check', caption: 'Machines screen it, then a person listens.' },
  { label: 'We label it', caption: 'Duration, language and quality get attached.' },
  { label: 'You get paid', caption: 'Accepted work settles to your UPI ID.' },
];

const FAQ_ITEMS = [
  {
    q: 'What do I actually have to do?',
    a: 'Open a task, read the prompt aloud, listen back, and submit. Most audio tasks are under two minutes of recording.',
  },
  {
    q: 'Do I need a microphone or a studio?',
    a: 'No. The mic in your phone or laptop is what most tasks are collected on — that is deliberate. A quiet room matters far more than the hardware.',
  },
  {
    q: 'When do I get paid?',
    a: 'Compensation accrues on accepted submissions at the rate shown on the task, and settles to the UPI ID on your profile. Rejected submissions are not paid.',
  },
  {
    q: 'Why would a submission be rejected?',
    a: 'Silent audio, background noise, the wrong script, too short, or a duplicate. The specific reason is always shown, so the next take can fix it.',
  },
];

/* ═══════════════════════════ Page ═══════════════════════════ */

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onStartSignup, onNavigate }) => {
  const languages = LANGUAGES.filter((l) => l.active);

  return (
    <PublicLayout
      currentPage="home"
      onNavigate={onNavigate}
      onEnterApp={onEnterApp}
      onStartSignup={onStartSignup}
    >
      {/* ═════════════════ HERO ═════════════════ */}
      <section className="relative overflow-hidden">
        <div className="atmos atmos-mesh" aria-hidden="true" />
        <div className="atmos atmos-rules mask-radial" aria-hidden="true" />
        <div className="atmos atmos-grain" aria-hidden="true" />

        <Container className="relative pb-10 pt-14 lg:pb-16 lg:pt-20">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <div>
              <Reveal><Eyebrow>Human audio · Built for AI</Eyebrow></Reveal>

              <LineReveal
                as="h1"
                lines={['Real voices.', 'Structured data.', 'Better AI.']}
                className="t-display mt-6"
                delay={80}
              />
            </div>

            <Reveal delay={260} className="lg:pb-3">
              <p className="max-w-sm text-[1.0625rem] leading-relaxed text-body">
                Record short audio tasks in a language you speak. Get paid for every submission
                that passes review.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={onStartSignup}>
                  Start contributing
                  <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>

        {/* The instrument. Full container width — the page's centrepiece. */}
        <Container className="relative">
          <Reveal delay={340}>
            <HeroSignal className="h-[clamp(15rem,34vh,22rem)]" />
          </Reveal>

          <div className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {[
              ['Languages', `${languages.length} active`],
              ['Paid', 'Per accepted task'],
              ['Reviewed', 'By a person'],
              ['Signal above', 'Demo recording'],
            ].map(([label, value]) => (
              <div key={label} className="bg-surface px-4 py-3">
                <p className="t-meta">{label}</p>
                <p className="mt-1 text-sm font-medium text-ink">{value}</p>
              </div>
            ))}
          </div>
        </Container>

        <div className="h-[clamp(3rem,6vw,5rem)]" />
      </section>

      {/* ═════════════════ STATEMENT ═════════════════ */}
      <section className="relative overflow-hidden border-y border-line bg-paper-sunk">
        <div className="atmos atmos-points mask-y opacity-70" aria-hidden="true" />

        <Container className="relative py-[clamp(4rem,9vw,7rem)]">
          <Parallax distance={26}>
            <Reveal>
              <p className="t-mega text-ink">Your accent</p>
              <p className="t-mega t-outline">is missing</p>
              <p className="t-mega t-outline">from the data.</p>
            </Reveal>
          </Parallax>

          <Reveal delay={160}>
            <p className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-body">
              Two minutes of your speech starts changing that.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ═════════════════ SIGNATURE: WHAT HAPPENS TO YOUR RECORDING ═════════════════ */}
      <StickyStory
        eyebrow="Your recording"
        title={['From your voice', 'to a dataset.']}
        steps={STORY_STEPS}
        renderVisual={(progress) => <SignalMorph progress={progress} />}
      />

      <SignalSeam from="paper" to="sunk" />

      {/* ═════════════════ THE JOURNEY ═════════════════ */}
      <section className="relative overflow-hidden border-y border-line bg-paper-sunk">
        <div className="atmos atmos-bands mask-y" aria-hidden="true" />
        <div className="atmos atmos-mesh-soft" aria-hidden="true" />

        <Container className="relative py-[clamp(4rem,8vw,6.5rem)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Reveal><Eyebrow>How it goes</Eyebrow></Reveal>
              <LineReveal lines={['Four steps.', 'No experience.']} className="t-h2 mt-4" delay={60} />
            </div>
            <Reveal delay={140}>
              <Button onClick={onStartSignup}>
                Start contributing
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </Button>
            </Reveal>
          </div>

          <ContributorJourney className="mt-14" />

          <Reveal delay={200}>
            <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
              Paid per accepted submission. Every rejection tells you why.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ═════════════════ WHAT YOU EARN ═════════════════ */}
      <Section space="md" className="overflow-hidden">
        <div className="atmos atmos-mesh mask-radial" aria-hidden="true" />
        <div className="atmos atmos-grain" aria-hidden="true" />

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
          <div>
            <Reveal><Eyebrow>The terms</Eyebrow></Reveal>
            <LineReveal lines={['The rate is on', 'the task.']} className="t-h2 mt-4" delay={60} />

            <Reveal delay={140}>
              <p className="mt-5 max-w-sm text-[1.0625rem] leading-relaxed text-body">
                Before you open it. No bidding, no multipliers, no surprises.
              </p>
            </Reveal>
          </div>

          {/* A task card, exactly as it appears in the app. */}
          <Reveal delay={120}>
            <div className="card overflow-hidden shadow-md">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="t-meta">Task card</span>
                <span className="tag tag-signal">Available</span>
              </div>

              <div className="px-5 py-5">
                <h3 className="t-h4">Voice command — set an alarm</h3>
                <Waveform seed="home-task-card" bars={56} height={28} className="mt-4" color="var(--line-strong)" />
              </div>

              <dl className="grid grid-cols-3 border-t border-line">
                {[
                  { label: 'Compensation', value: '₹85.00' },
                  { label: 'Est. time', value: '20 sec' },
                  { label: 'Language', value: 'English' },
                ].map((item, i) => (
                  <div key={item.label} className={i < 2 ? 'border-r border-line px-4 py-3.5' : 'px-4 py-3.5'}>
                    <dt className="t-meta">{item.label}</dt>
                    <dd className="mt-1 text-sm font-semibold text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="border-t border-line bg-paper-sunk px-5 py-2.5 text-xs text-muted">
                Illustrative. Live tasks carry their own rates.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ═════════════════ COVERAGE ═════════════════ */}
      <section className="relative overflow-hidden border-y border-line bg-paper-sunk py-[clamp(3.5rem,7vw,5.5rem)]">
        <Container className="relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Reveal><Eyebrow>Languages</Eyebrow></Reveal>
              <Reveal delay={60}>
                <h2 className="t-h2 mt-4">Contribute in the language you actually speak.</h2>
              </Reveal>
            </div>
          </div>
        </Container>

        {/* Full-bleed strip: the roster reads as a signal running past. */}
        <div className="marquee-mask mt-10 overflow-hidden">
          <div className="flex w-max gap-3 px-[var(--gutter)]">
            {[...languages, ...languages].map((language, i) => (
              <button
                key={`${language.id}-${i}`}
                type="button"
                onClick={onStartSignup}
                aria-hidden={i >= languages.length}
                tabIndex={i >= languages.length ? -1 : 0}
                className="card card-interactive w-56 shrink-0 px-5 py-4 text-left"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">{language.name}</span>
                  <span className="text-xs text-muted">{language.nativeName}</span>
                </div>
                <Waveform seed={language.id} bars={26} height={18} className="mt-3" color="var(--line-strong)" />
                <span className="t-meta mt-3 block">{language.dialects.length} dialects</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════ FAQ ═════════════════ */}
      <Section space="md" className="overflow-hidden">
        <div className="atmos atmos-rules-fine mask-y" aria-hidden="true" />

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.6fr)] lg:gap-20">
          <div>
            <Reveal><Eyebrow>Questions</Eyebrow></Reveal>
            <LineReveal lines={['Short answers.']} className="t-h2 mt-4" delay={60} />
            <Reveal delay={120}>
              <button type="button" onClick={() => onNavigate('contact')} className="link mt-5 inline-block text-sm">
                Ask us something else
              </button>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <FAQ items={FAQ_ITEMS} defaultOpen={null} />
          </Reveal>
        </div>
      </Section>

      {/* ═════════════════ CTA ═════════════════ */}
      <CTASection
        eyebrow="Get started"
        title="Record your first task today."
        body="Free to join. Nothing to buy — just the device you already own."
        primary={
          <Button size="lg" onClick={onStartSignup}>
            Start contributing
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Button>
        }
      />
    </PublicLayout>
  );
};
