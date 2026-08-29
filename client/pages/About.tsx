import React from 'react';
import { ArrowRight } from 'lucide-react';

import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';
import { Section, SectionHeading, Eyebrow } from '../components/ui/Layout';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { LineReveal, SignalSeam } from '../components/Story';
import { WaveLine } from '../components/Waveform';
import { CTASection } from '../components/CTASection';
import { DATASETS, TOTAL_HOURS } from '../data/datasets';
import { LANGUAGES } from '../data/languages';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
}

/* Counts come from the same source of truth the marketplace lists from, so the
   page can never quote a number the catalogue does not actually contain. */
const LANGUAGE_COUNT = LANGUAGES.length;
const DIALECT_COUNT = new Set(LANGUAGES.flatMap((l) => l.dialects)).size;
const REGION_COUNT = new Set(DATASETS.map((d) => d.region)).size;

/* ─────────────── What a collection actually goes through ─────────────── */

const STAGES = [
  {
    step: '01',
    title: 'The spec is written first',
    body: 'Language, dialect, region, recording environment, prompt style, clip length and annotation are agreed before anyone records. Nothing is collected against a vague brief.',
  },
  {
    step: '02',
    title: 'Speakers are recruited against it',
    body: 'We go looking for people who actually match the spec — the dialect, the region, the room. If we cannot reach them, we say so instead of substituting whoever is available.',
  },
  {
    step: '03',
    title: 'Contributors record and are paid per task',
    body: 'Each task shows its rate and names the capability the recording trains. Consent is given per task, not once at signup.',
  },
  {
    step: '04',
    title: 'Machines check, then a person listens',
    body: 'Automated checks remove clipping, silence and wrong-length takes. A reviewer then decides what is good, and every rejection carries a written reason.',
  },
  {
    step: '05',
    title: 'Audio ships with its paperwork',
    body: 'Files in the agreed format, per-clip metadata as structured JSON, the review outcome per submission, and the consent record per task.',
  },
];

export const About: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => (
  <PublicLayout currentPage="about" onNavigate={onNavigate} onEnterApp={onEnterApp}>
    {/* ═══════════════════════ HERO ═══════════════════════ */}
    <PageHero
      eyebrow="About Starset"
      title={['Speech data,', 'collected against', 'a written spec.']}
      lede="Starset is an audio collection platform for Indian languages. An AI team writes the spec — language, dialect, region, environment, prompt style. We recruit speakers who match it, pay them per accepted task, and hand over the audio with the metadata and consent record that say where every clip came from."
      actions={
        <>
          <Button size="lg" onClick={() => onNavigate('marketplace')}>
            Browse the marketplace
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Button>
          <Button size="lg" variant="secondary" onClick={onEnterApp}>
            Start contributing
          </Button>
        </>
      }
      factsLabel="Where we are today"
      facts={[
        { label: 'Languages open for recording', value: `${LANGUAGE_COUNT}`, hint: `${DIALECT_COUNT} dialects named across them` },
        { label: 'Collections in the catalogue', value: `${DATASETS.length}`, hint: `Across ${REGION_COUNT} regions` },
        { label: 'Accepted audio', value: `${TOTAL_HOURS}+ hours` },
        { label: 'Every clip', value: 'Machine-checked, then heard' },
      ]}
    />

    {/* ═══════════════════════ WHAT STARSET IS ═══════════════════════ */}
    <Section space="md" className="overflow-hidden">
      <div className="atmos atmos-rules-fine mask-y" aria-hidden="true" />

      <div className="relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <div>
            <Reveal><Eyebrow>In plain terms</Eyebrow></Reveal>
            <LineReveal
              lines={['What Starset', 'actually does.']}
              className="t-h2 mt-4"
              delay={60}
            />

            <Reveal delay={140}>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-body">
                Speech models fail on the voices they never heard, and that failure is a
                collection problem rather than a modelling one. Scraped, crowd-grabbed and
                synthesised audio all skip the same step: nobody decided whose voice was
                supposed to be in it.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-body">
                So we do that step deliberately. Starset runs the whole path from a written
                spec to delivered audio — recruiting the speakers, paying them per task,
                reviewing what they record, and shipping the result with its own paperwork.
                Two audiences use the same pipeline: the person recording and the team
                receiving the data see the same spec, the same bar and the same verdict.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="card overflow-hidden">
              <div className="border-b border-line px-5 py-3">
                <span className="t-meta">Two sides, one pipeline</span>
              </div>
              <ul className="divide-y divide-line-faint">
                {[
                  { k: 'Contributors', v: 'Record, submit, get paid' },
                  { k: 'Reviewers', v: 'Listen, approve, explain' },
                  { k: 'AI teams', v: 'Brief, receive, verify' },
                ].map((row) => (
                  <li key={row.k} className="px-5 py-4">
                    <p className="t-meta">{row.k}</p>
                    <p className="mt-1 text-sm font-medium text-ink">{row.v}</p>
                  </li>
                ))}
              </ul>
              <div className="border-t border-line bg-paper-sunk px-5 py-4">
                <WaveLine seed="about-panel" points={90} height={40} filled />
              </div>
            </div>
          </Reveal>
        </div>

        {/* What a corpus drifts toward when nobody specified it. */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
          {[
            { k: 'Unspecified data skews toward', v: 'Broadcast accents' },
            { k: 'And is recorded in', v: 'Quiet studios' },
            { k: 'Then arrives as', v: 'A folder of files' },
          ].map((item, i) => (
            <Reveal key={item.k} delay={i * 90} className="bg-surface">
              <div className="px-6 py-7">
                <p className="t-meta">{item.k}</p>
                <p className="mt-2 font-display text-xl font-semibold text-ink">{item.v}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={220}>
          <p className="mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-body">
            The gap that leaves is not random. It lands on the speakers who were hardest
            to reach — which is exactly the coverage a model is later judged on.
          </p>
        </Reveal>
      </div>
    </Section>

    <SignalSeam from="paper" to="sunk" />

    {/* ═══════════════════════ HOW A COLLECTION RUNS ═══════════════════════ */}
    <Section tone="sunk" bordered space="md">
      <SectionHeading
        eyebrow="End to end"
        title="How a collection runs"
        lede="Five stages, in this order, every time. Nothing skips ahead of the spec."
      />

      <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-2">
        {STAGES.map((stage, i) => (
          <Reveal
            key={stage.step}
            delay={i * 70}
            className={i === STAGES.length - 1 ? 'bg-surface lg:col-span-2' : 'bg-surface'}
          >
            <li className="flex h-full items-baseline gap-5 px-6 py-7">
              <span className="t-meta tnum flex-none text-signal">{stage.step}</span>
              <div>
                <h3 className="text-[0.9375rem] font-semibold text-ink">{stage.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-body">{stage.body}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={200}>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => onNavigate('marketplace')}>
            See what is in the catalogue
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </Reveal>
    </Section>

    {/* ═══════════════════════ WHERE WE'RE GOING ═══════════════════════ */}
    <Section tone="sunk" bordered space="md">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
        <Reveal>
          <Eyebrow>Direction</Eyebrow>
          <h2 className="t-h2 mt-4">What comes next</h2>
        </Reveal>

        <div className="space-y-8">
          <Reveal delay={60}>
            <div className="border-l-2 border-signal pl-6">
              <h3 className="t-h4">Deeper dialect coverage</h3>
              <p className="mt-2 text-body">
                Reaching the speakers whose pronunciation is absent from every corpus — and naming the ones we have not.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="border-l-2 border-line pl-6">
              <h3 className="t-h4">Richer annotation</h3>
              <p className="mt-2 text-body">
                Transcripts and speaker attributes produced during collection, not bolted on later.
              </p>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="border-l-2 border-line pl-6">
              <h3 className="t-h4">Better feedback to contributors</h3>
              <p className="mt-2 text-body">
                Showing contributors what a strong take sounds like, so quality improves rather than just gets filtered.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>

    <CTASection
      eyebrow="Work with us"
      title="Contribute your voice, or build the dataset you need"
      primary={
        <Button size="lg" onClick={onEnterApp}>
          Start contributing
          <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </Button>
      }
      secondary={
        <Button size="lg" variant="secondary" onClick={() => onNavigate('contact')}>
          Talk to Starset
        </Button>
      }
    />
  </PublicLayout>
);
