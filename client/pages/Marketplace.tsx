import React, { useMemo, useState } from 'react';
import { ArrowRight, Search, SlidersHorizontal, X, Send, CheckCircle2 } from 'lucide-react';

import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';
import { Section, Eyebrow, SpecList } from '../components/ui/Layout';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { LineReveal } from '../components/Story';
import { Waveform } from '../components/Waveform';
import { Configurator } from '../components/Configurator';
import { CTASection } from '../components/CTASection';
import { cn } from '../lib/utils';
import {
  DATASETS,
  STATUS_LABEL,
  LANGUAGE_FACETS,
  PROMPT_FACETS,
  ENVIRONMENT_FACETS,
  TOTAL_HOURS,
  AVAILABLE_COUNT,
  DatasetListing,
  DatasetStatus,
} from '../data/datasets';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
}

const STATUS_TONE: Record<DatasetStatus, string> = {
  available: 'tag-ok',
  collecting: 'tag-signal',
  planned: 'tag',
};

/* ═══════════════════════ Listing card ═══════════════════════ */

const Listing: React.FC<{
  dataset: DatasetListing;
  onOpen: () => void;
}> = ({ dataset, onOpen }) => (
  <article className="card card-interactive flex h-full flex-col overflow-hidden">
    <header className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 border-b border-line px-5 py-4">
      <div className="min-w-0">
        <p className="t-meta">{dataset.language} · {dataset.languageCode}</p>
        <h3 className="mt-1 text-[0.9375rem] font-semibold text-ink">{dataset.name}</h3>
      </div>
      <span className={cn('tag flex-none', STATUS_TONE[dataset.status])}>
        {STATUS_LABEL[dataset.status]}
      </span>
    </header>

    <div className="border-b border-line bg-paper-sunk px-5 py-4">
      <Waveform seed={dataset.id} bars={56} height={30} />
    </div>

    <div className="flex flex-1 flex-col gap-4 px-5 py-4">
      <p className="text-sm leading-relaxed text-body">{dataset.summary}</p>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div>
          <dt className="t-meta">Prompt</dt>
          <dd className="mt-0.5 text-sm text-ink">{dataset.prompt}</dd>
        </div>
        <div>
          <dt className="t-meta">Environment</dt>
          <dd className="mt-0.5 text-sm text-ink">{dataset.environment}</dd>
        </div>
        <div>
          <dt className="t-meta">Hours</dt>
          <dd className="mt-0.5 text-sm text-ink tnum">
            {dataset.hours ? `${dataset.hours} h` : '—'}
          </dd>
        </div>
        <div>
          <dt className="t-meta">Dialects</dt>
          <dd className="mt-0.5 text-sm text-ink tnum">{dataset.dialects.length}</dd>
        </div>
      </dl>
    </div>

    <footer className="border-t border-line px-5 py-3.5">
      <button type="button" onClick={onOpen} className="link-arrow text-signal">
        View collection
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      </button>
    </footer>
  </article>
);

/* ═══════════════════════ Detail drawer ═══════════════════════ */

const Detail: React.FC<{
  dataset: DatasetListing;
  onClose: () => void;
  onRequest: (dataset: DatasetListing) => void;
}> = ({ dataset, onClose, onRequest }) => {
  // Escape closes, matching every other dialog in the product.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[color-mix(in_srgb,var(--ink)_45%,transparent)] backdrop-blur-[2px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dataset-detail-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="animate-scale-in flex max-h-[92svh] w-full max-w-lg flex-col overflow-hidden rounded-t-xl border border-line bg-surface shadow-lg sm:rounded-xl">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <p className="t-meta">{dataset.language} · {dataset.languageCode}</p>
            <h2 id="dataset-detail-title" className="t-h4 mt-1">{dataset.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-md text-muted transition-colors hover:bg-paper-sunk hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="thin-scroll flex-1 overflow-y-auto">
          <div className="border-b border-line bg-paper-sunk px-5 py-5">
            <Waveform seed={dataset.id} bars={80} height={44} />
            <div className="mt-3 flex items-center justify-between">
              <span className="t-meta">Representative sample</span>
              <span className={cn('tag', STATUS_TONE[dataset.status])}>
                {STATUS_LABEL[dataset.status]}
              </span>
            </div>
          </div>

          <div className="px-5 py-2">
            <SpecList
              items={[
                { label: 'Region', value: dataset.region },
                { label: 'Dialects', value: dataset.dialects.join(', ') },
                { label: 'Prompt style', value: dataset.prompt },
                { label: 'Environment', value: dataset.environment },
                { label: 'Speakers', value: dataset.speakers ?? '—' },
                { label: 'Hours', value: dataset.hours ? `${dataset.hours} h` : 'Not yet collected' },
                { label: 'Clips', value: dataset.clips ? dataset.clips.toLocaleString() : '—' },
                { label: 'Sample rate', value: dataset.sampleRate },
                { label: 'Format', value: dataset.format },
                { label: 'Annotation', value: dataset.annotation },
                { label: 'Review', value: 'Automated checks, then human' },
              ]}
            />
          </div>

          <p className="px-5 pb-5 pt-3 text-sm leading-relaxed text-body">{dataset.summary}</p>
        </div>

        <div className="flex gap-3 border-t border-line px-5 py-4">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Close</Button>
          <Button className="flex-1" onClick={() => onRequest(dataset)}>
            Request access
            <Send className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════ Page ═══════════════════════ */

export const Marketplace: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('All');
  const [prompt, setPrompt] = useState('All');
  const [environment, setEnvironment] = useState('All');
  const [status, setStatus] = useState<'All' | DatasetStatus>('All');
  const [open, setOpen] = useState<DatasetListing | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATASETS.filter((d) => {
      if (language !== 'All' && d.language !== language) return false;
      if (prompt !== 'All' && d.prompt !== prompt) return false;
      if (environment !== 'All' && d.environment !== environment) return false;
      if (status !== 'All' && d.status !== status) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.language.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.dialects.some((x) => x.toLowerCase().includes(q))
      );
    });
  }, [query, language, prompt, environment, status]);

  const filtersActive =
    query !== '' || language !== 'All' || prompt !== 'All' || environment !== 'All' || status !== 'All';

  const clearFilters = () => {
    setQuery(''); setLanguage('All'); setPrompt('All'); setEnvironment('All'); setStatus('All');
  };

  /** No enquiry endpoint exists, so a request composes a real, pre-filled email. */
  const requestAccess = (dataset: DatasetListing) => {
    const subject = `Dataset request — ${dataset.name}`;
    const body = [
      `Collection: ${dataset.name} (${dataset.id})`,
      `Language: ${dataset.language} · ${dataset.languageCode}`,
      `Status: ${STATUS_LABEL[dataset.status]}`,
      '',
      'Our requirement:',
      '',
    ].join('\n');
    window.location.href =
      `mailto:data@starset.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const requestCustom = (brief: string) => {
    const body = ['Custom collection brief:', '', brief, ''].join('\n');
    window.location.href =
      `mailto:data@starset.ai?subject=${encodeURIComponent('Custom collection brief')}&body=${encodeURIComponent(body)}`;
  };

  const select = (
    id: string,
    label: string,
    value: string,
    options: string[],
    onChange: (v: string) => void,
  ) => (
    <div>
      <label className="sr-only" htmlFor={id}>{label}</label>
      <select
        id={id}
        className="field h-10 min-h-0 w-full py-0 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="All">{label}: all</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <PublicLayout currentPage="marketplace" onNavigate={onNavigate} onEnterApp={onEnterApp}>
      {/* ═════════════ HERO ═════════════ */}
      <PageHero
        eyebrow="Marketplace"
        title={['Human audio,', 'collected and', 'documented.']}
        lede="Browse collections by language, dialect and recording condition. Request access, or build the dataset that does not exist yet."
        actions={
          <>
            <Button
              size="lg"
              onClick={() => document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Browse collections
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => onNavigate('contact')}>
              Talk to Starset
            </Button>
          </>
        }
        factsLabel="Catalogue"
        facts={[
          { label: 'Collections listed', value: String(DATASETS.length) },
          { label: 'Ready now', value: `${AVAILABLE_COUNT} available`, hint: 'The rest are collecting or planned' },
          { label: 'Accepted audio', value: `${TOTAL_HOURS}+ hours` },
          { label: 'Every clip', value: 'Machine-checked, then heard' },
        ]}
      />

      {/* ═════════════ CATALOGUE ═════════════ */}
      <Section space="md" id="catalogue" className="overflow-hidden">
        <div className="atmos atmos-rules-fine mask-y" aria-hidden="true" />

        <div className="relative">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Reveal><Eyebrow>Catalogue</Eyebrow></Reveal>
              <LineReveal lines={['Collections.']} className="t-h2 mt-4" delay={60} />
            </div>
            <Reveal delay={120}>
              <p className="max-w-xs text-sm text-body">
                Availability is confirmed on request. Nothing is listed as ready before it is.
              </p>
            </Reveal>
          </div>

          {/* ── Filters ── */}
          <Reveal delay={100}>
            <div className="mt-10 card p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} aria-hidden="true" />
                <span className="t-meta">Filter</span>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                <div className="relative lg:col-span-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <label className="sr-only" htmlFor="dataset-search">Search collections</label>
                  <input
                    id="dataset-search"
                    type="search"
                    className="field field-with-icon h-10 min-h-0 py-0 text-sm"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                {select('f-language', 'Language', language, LANGUAGE_FACETS, setLanguage)}
                {select('f-prompt', 'Prompt', prompt, PROMPT_FACETS as string[], setPrompt)}
                {select('f-env', 'Environment', environment, ENVIRONMENT_FACETS as string[], setEnvironment)}
                {select('f-status', 'Status', status, ['available', 'collecting', 'planned'], (v) => setStatus(v as 'All' | DatasetStatus))}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line-faint pt-3">
                <p className="t-meta" role="status" aria-live="polite">
                  {results.length} {results.length === 1 ? 'collection' : 'collections'}
                </p>
                {filtersActive && (
                  <button type="button" onClick={clearFilters} className="link text-xs">
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          {/* ── Grid ── */}
          {results.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((dataset, i) => (
                <Reveal key={dataset.id} delay={Math.min(i, 6) * 60}>
                  <Listing dataset={dataset} onOpen={() => setOpen(dataset)} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-6 card flex flex-col items-center gap-4 px-6 py-16 text-center">
              <h3 className="t-h4">Nothing matches those filters</h3>
              <p className="max-w-sm text-body">
                We may still be able to collect it. Coverage depends on reaching those speakers.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>
                <Button onClick={() => document.getElementById('build')?.scrollIntoView({ behavior: 'smooth' })}>
                  Build your dataset
                  <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ═════════════ BUILD YOUR DATASET ═════════════ */}
      <section className="relative overflow-hidden border-y border-line bg-paper-sunk" id="build">
        <div className="atmos atmos-mesh mask-radial" aria-hidden="true" />
        <div className="atmos atmos-grain" aria-hidden="true" />

        <Section space="md" bare>
          <div className="shell relative grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
            <div>
              <Reveal><Eyebrow>Not listed</Eyebrow></Reveal>
              <LineReveal lines={['Build your', 'dataset.']} className="t-h2 mt-4" delay={60} />

              <Reveal delay={140}>
                <p className="mt-5 max-w-sm text-[1.0625rem] leading-relaxed text-body">
                  Set the language, the accent, the room and the prompt. The brief assembles
                  itself as you choose, and we say honestly whether we can recruit for it.
                </p>

                <ol className="mt-8 grid gap-4">
                  {[
                    { step: '01', label: 'Shape it', value: 'Pick the axes your model is missing' },
                    { step: '02', label: 'Send the brief', value: 'We answer feasibility, not a quote' },
                    { step: '03', label: 'We collect', value: 'Machine-checked, then heard by a person' },
                  ].map((item, i) => (
                    <Reveal key={item.step} delay={160 + i * 70}>
                      <li className="flex items-baseline gap-4">
                        <span className="t-meta tnum flex-none text-signal">{item.step}</span>
                        <span>
                          <span className="text-sm font-semibold text-ink">{item.label}</span>
                          <span className="mt-0.5 block text-sm text-body">{item.value}</span>
                        </span>
                      </li>
                    </Reveal>
                  ))}
                </ol>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={() => onNavigate('contact')}>
                    Talk to Starset
                    <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <Configurator onRequest={requestCustom} />
            </Reveal>
          </div>
        </Section>
      </section>

      {/* ═════════════ WHAT SHIPS ═════════════ */}
      <Section space="md" className="overflow-hidden">
        <div className="atmos atmos-points mask-y opacity-60" aria-hidden="true" />

        <div className="relative">
          <Reveal><Eyebrow>Every delivery</Eyebrow></Reveal>
          <LineReveal lines={['What ships with', 'the audio.']} className="t-h2 mt-4" delay={60} />

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Audio files', value: 'In the agreed format' },
              { label: 'Per-clip metadata', value: 'Structured JSON' },
              { label: 'Review outcome', value: 'Per submission' },
              { label: 'Consent record', value: 'Per task' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 70} className="bg-surface">
                <div className="flex items-start gap-3 px-5 py-6">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 flex-none text-[color:var(--ok)]"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="t-meta">{item.label}</p>
                    <p className="mt-1 text-sm font-medium text-ink">{item.value}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <CTASection
        eyebrow="Next step"
        title="Tell us what your model is missing."
        body="We answer feasibility before anything is agreed."
        primary={
          <Button size="lg" onClick={() => onNavigate('contact')}>
            Talk to Starset
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Button>
        }
        secondary={
          <Button size="lg" variant="secondary" onClick={() => onNavigate('about')}>
            About Starset
          </Button>
        }
      />

      {open && (
        <Detail dataset={open} onClose={() => setOpen(null)} onRequest={requestAccess} />
      )}
    </PublicLayout>
  );
};
