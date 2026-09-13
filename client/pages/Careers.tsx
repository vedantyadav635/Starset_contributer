import React, { useState } from 'react';
import {
  ArrowRight, Code2, Headphones, Languages, LineChart,
  MapPin, Clock, Briefcase, ChevronDown, CheckCircle2,
  Sparkles, Database, Brain, Globe,
} from 'lucide-react';

import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';
import { Section, SectionHeading } from '../components/ui/Layout';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { cn } from '../lib/utils';
import { ACTIVE_JOBS, OPEN_COUNT, JobOpening } from '../data/jobs';

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

/* ═══════════════════════════ What you'll work with ═══════════════════════════ */

const PILLARS = [
  { icon: Database, title: 'Real World Data', body: 'Audio, text, image and more' },
  { icon: Sparkles, title: 'Data Pipelines', body: 'Collect, clean, process and scale data' },
  { icon: Brain, title: 'Machine Learning', body: 'Train, evaluate and deploy models' },
  { icon: Globe, title: 'Global Impact', body: 'Build AI for a more inclusive world' },
];

/* ═══════════════════════════ Job card ═══════════════════════════ */

const JobCard: React.FC<{ job: JobOpening }> = ({ job }) => {
  const [expanded, setExpanded] = useState(false);

  const applyUrl = `mailto:starset.intelligence@gmail.com?subject=Application:%20${encodeURIComponent(job.title)}`;

  return (
    <Reveal>
      <article className="card overflow-hidden">
        {/* ── Card header ── */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag tag-signal">{job.department}</span>
              <span className="tag">{job.type}</span>
            </div>
            <h3 className="t-h3 mt-2.5">{job.title}</h3>
            <p className="mt-1.5 text-body">{job.summary}</p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} /> {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.75} /> Posted {new Date(job.posted).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
            <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-primary inline-flex items-center gap-2">
              Apply Now <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-sm font-medium text-signal transition-colors hover:text-signal-hover"
            >
              {expanded ? 'Less' : 'Details'}
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', expanded && 'rotate-180')} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ── Expanded details ── */}
        <div
          className={cn(
            'grid transition-all duration-300 ease-in-out',
            expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="overflow-hidden">
            <div className="border-t border-line px-6 pb-6 pt-5 space-y-6">

              {/* About */}
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">About the Role</h4>
                <p className="mt-2 text-body leading-relaxed">{job.about}</p>
              </div>

              {/* Responsibilities */}
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">What You'll Do</h4>
                <ul className="mt-2 space-y-2">
                  {job.responsibilities.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-body">
                      <Briefcase className="mt-0.5 h-4 w-4 flex-none text-signal" strokeWidth={1.75} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">Ideal Candidate</h4>
                <ul className="mt-2 space-y-2">
                  {job.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-body">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-ok" strokeWidth={1.75} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nice to have */}
              {job.niceToHave && job.niceToHave.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">Nice to Have</h4>
                  <ul className="mt-2 space-y-2">
                    {job.niceToHave.map((r) => (
                      <li key={r} className="flex items-start gap-2.5 text-body">
                        <Sparkles className="mt-0.5 h-4 w-4 flex-none text-warning" strokeWidth={1.75} />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Perks */}
              {job.perks && job.perks.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">What You'll Get</h4>
                  <ul className="mt-2 space-y-2">
                    {job.perks.map((r) => (
                      <li key={r} className="flex items-start gap-2.5 text-body">
                        <ArrowRight className="mt-0.5 h-4 w-4 flex-none text-signal" strokeWidth={1.75} />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bottom CTA */}
              <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5">
                <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-primary inline-flex items-center gap-2">
                  Apply for {job.title} <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </a>
                <span className="text-sm text-muted">or email starset.intelligence@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
};

/* ═══════════════════════════ Page ═══════════════════════════ */

export const Careers: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => (
  <PublicLayout currentPage="careers" onNavigate={onNavigate} onEnterApp={onEnterApp}>
    <PageHero
      eyebrow="Careers"
      title={['Work on the', 'unglamorous half of AI.']}
      lede="Nobody writes headlines about audio validation. It is also the difference between a speech model that works for a region and one that does not."
      atmosphere="points"
      factsLabel="How we hire"
      facts={[
        {
          label: 'Open positions',
          value: OPEN_COUNT > 0 ? `${OPEN_COUNT} role${OPEN_COUNT > 1 ? 's' : ''} open` : 'None right now',
          hint: OPEN_COUNT > 0 ? 'Scroll down to see details' : 'We would rather say so than keep a stale page',
        },
        { label: 'How to apply', value: 'starset.intelligence@gmail.com', hint: 'Name the area your work maps to' },
        { label: 'Areas', value: 'Engineering · Data ops · AI/ML · Language · Growth' },
      ]}
    />

    {/* ═══════════════════ Open Positions ═══════════════════ */}
    {ACTIVE_JOBS.length > 0 && (
      <Section space="md">
        <SectionHeading
          eyebrow="Open positions"
          title={`We're hiring ${ACTIVE_JOBS.length === 1 ? 'for 1 role' : `for ${ACTIVE_JOBS.length} roles`}`}
          lede="Work on real-world data, build data pipelines and train machine learning models that create real impact."
        />

        {/* Pillars row */}
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 60} className="bg-surface">
              <div className="flex flex-col items-center gap-2 p-5 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-signal-soft text-signal">
                  <p.icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="text-sm font-semibold text-ink">{p.title}</h3>
                <p className="text-xs text-body">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Job cards */}
        <div className="mt-8 space-y-5">
          {ACTIVE_JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </Section>
    )}

    {/* ═══════════════════ Areas ═══════════════════ */}
    <Section space="md">
      <SectionHeading
        eyebrow="Where we hire"
        title="Areas we look for people in"
        lede={ACTIVE_JOBS.length > 0
          ? 'Even outside published openings, we are always interested in hearing from people in these areas.'
          : 'We are not running a public listings page right now. If your work sits in one of these areas, write to us directly and be specific about which.'
        }
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

    {/* ═══════════════════ General CTA ═══════════════════ */}
    <Section tone="sunk" bordered space="md">
      <Reveal>
        <div className="card mx-auto max-w-2xl p-8 text-center sm:p-10">
          <h2 className="t-h3">
            {ACTIVE_JOBS.length > 0 ? 'Don\'t see your role?' : 'No open listings today'}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-body">
            {ACTIVE_JOBS.length > 0
              ? 'We are always interested in great people. Send us what you have worked on and which area it maps to — we read everything that arrives.'
              : 'We would rather say that than keep a page of roles we are not actively filling. Send us what you have worked on and which area it maps to — we read everything that arrives.'
            }
          </p>
          <a href="mailto:starset.intelligence@gmail.com?subject=Careers%20at%20Starset" target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-primary mt-7 inline-flex items-center gap-2">
            Email starset.intelligence@gmail.com
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </a>

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
