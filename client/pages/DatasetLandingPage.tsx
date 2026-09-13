import React, { useEffect } from 'react';
import { ArrowRight, Globe, Mic, Tag, MapPin, Languages, CheckCircle2 } from 'lucide-react';

import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';
import { Section, SectionHeading } from '../components/ui/Layout';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { SEOHead } from '../components/SEOHead';
import { DatasetLanding } from '../data/datasetLandings';

interface Props {
  dataset: DatasetLanding;
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
}

/**
 * Per-language dataset landing page.
 * Each page targets long-tail SEO queries like "Hindi voice dataset for AI"
 * and embeds schema.org/Dataset JSON-LD for Google Dataset Search.
 */
export const DatasetLandingPage: React.FC<Props> = ({ dataset, onNavigate, onEnterApp }) => {
  const d = dataset;

  // Schema.org/Dataset JSON-LD
  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${d.language} Voice Dataset — Starset Intelligence`,
    description: d.description,
    keywords: d.keywords.split(', '),
    inLanguage: d.isoCode,
    spatialCoverage: {
      '@type': 'Place',
      name: d.region + ', India',
    },
    creator: {
      '@type': 'Organization',
      name: 'Starset Intelligence',
      url: 'https://www.starset.online/',
    },
    url: `https://www.starset.online/datasets/${d.slug}`,
    license: 'https://www.starset.online/terms',
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Dialects', value: d.dialects.join(', ') },
      { '@type': 'PropertyValue', name: 'Task types', value: d.taskTypes.join(', ') },
      { '@type': 'PropertyValue', name: 'Region', value: d.region },
    ],
  };

  return (
    <PublicLayout currentPage="marketplace" onNavigate={onNavigate} onEnterApp={onEnterApp}>
      <SEOHead
        title={d.title}
        description={d.description}
        keywords={d.keywords}
        canonicalPath={`/datasets/${d.slug}`}
        structuredData={datasetSchema}
      />

      <PageHero
        eyebrow={`${d.language} Dataset`}
        title={[`High-Quality ${d.language}`, 'Voice Dataset for AI']}
        lede={d.definition}
        atmosphere="points"
        factsLabel="Dataset specs"
        facts={[
          { label: 'Language', value: `${d.language} (${d.nativeName})` },
          { label: 'ISO code', value: d.isoCode },
          { label: 'Region', value: d.region },
          { label: 'Dialects', value: d.dialects.join(', ') },
        ]}
      />

      {/* ─── About this dataset ─── */}
      <Section space="md">
        <SectionHeading
          eyebrow="About this dataset"
          title={`Why ${d.language} voice data matters`}
        />
        <Reveal>
          <div className="mt-8 card p-8 sm:p-10">
            <p className="text-body leading-relaxed text-lg">{d.body}</p>
          </div>
        </Reveal>
      </Section>

      {/* ─── Specs grid ─── */}
      <Section space="md">
        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          <Reveal delay={0} className="bg-surface">
            <div className="flex flex-col gap-2 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-signal-soft text-signal">
                <Languages className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <h3 className="t-h4">Dialects covered</h3>
              <ul className="space-y-1">
                {d.dialects.map((dial) => (
                  <li key={dial} className="flex items-center gap-2 text-body">
                    <CheckCircle2 className="h-3.5 w-3.5 text-ok" strokeWidth={1.75} /> {dial}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={70} className="bg-surface">
            <div className="flex flex-col gap-2 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-signal-soft text-signal">
                <Mic className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <h3 className="t-h4">Task types</h3>
              <ul className="space-y-1">
                {d.taskTypes.map((task) => (
                  <li key={task} className="flex items-center gap-2 text-body">
                    <CheckCircle2 className="h-3.5 w-3.5 text-ok" strokeWidth={1.75} /> {task}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={140} className="bg-surface">
            <div className="flex flex-col gap-2 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-signal-soft text-signal">
                <MapPin className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <h3 className="t-h4">Collection region</h3>
              <p className="text-body">{d.region}, India</p>
              <p className="text-sm text-muted">Speakers from this region provide natural, representative speech data</p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ─── CTA ─── */}
      <Section tone="sunk" bordered space="md">
        <Reveal>
          <div className="card mx-auto max-w-2xl p-8 text-center sm:p-10">
            <h2 className="t-h3">License this dataset</h2>
            <p className="mx-auto mt-3 max-w-md text-body">
              Request access to our {d.language} voice dataset, or commission a custom collection
              built to your specifications.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:data@starset.ai?subject=${encodeURIComponent(`Dataset enquiry: ${d.language} voice data`)}`}
                className="btn btn-lg btn-primary inline-flex items-center gap-2"
              >
                Request access <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
              <Button variant="secondary" size="lg" onClick={() => onNavigate('marketplace')}>
                Browse all datasets
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted">
              Or email <strong>data@starset.ai</strong> directly
            </p>
          </div>
        </Reveal>
      </Section>
    </PublicLayout>
  );
};
