import React, { useState } from 'react';
import { ArrowRight, Mic, Building2, Mail, Send, CheckCircle2 } from 'lucide-react';

import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';
import { Section } from '../components/ui/Layout';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { cn } from '../lib/utils';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
}

type Audience = 'contributor' | 'company';

const AUDIENCES: Record<Audience, {
  icon: typeof Mic;
  label: string;
  blurb: string;
  email: string;
  subjectPrefix: string;
  topics: string[];
  detailLabel: string;
  detailPlaceholder: string;
}> = {
  contributor: {
    icon: Mic,
    label: 'I contribute recordings',
    blurb: 'Help with a task, a rejected submission, your profile, or a payout.',
    email: 'support@starset.ai',
    subjectPrefix: 'Contributor support',
    topics: ['A task or recording problem', 'A rejected submission', 'Payout or UPI details', 'Account access', 'Something else'],
    detailLabel: 'What do you need help with?',
    detailPlaceholder: 'Include the task title or submission reference if you have it — it gets you a faster answer.',
  },
  company: {
    icon: Building2,
    label: 'I need audio data',
    blurb: 'Scope a collection, check whether a language is feasible, or ask about delivery.',
    email: 'data@starset.ai',
    subjectPrefix: 'Dataset enquiry',
    topics: ['New dataset request', 'Language or dialect feasibility', 'Annotation and delivery format', 'Existing project', 'Something else'],
    detailLabel: 'What are you looking for?',
    detailPlaceholder: 'Language and accent, roughly how much audio, recording conditions, and what the model is for.',
  },
};

export const Contact: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
  const [audience, setAudience] = useState<Audience>('contributor');
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', topic: '', detail: '' });

  const config = AUDIENCES[audience];

  const pick = (next: Audience) => {
    setAudience(next);
    setSent(false);
    setForm({ name: '', email: '', topic: '', detail: '' });
  };

  // No enquiry endpoint exists server-side, so the message is composed into a
  // real email rather than swallowed by a fake success toast.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `${config.subjectPrefix}${form.topic ? ` — ${form.topic}` : ''}`;
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Topic: ${form.topic || '—'}`,
      '',
      form.detail,
    ].join('\n');

    window.location.href =
      `mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <PublicLayout currentPage="contact" onNavigate={onNavigate} onEnterApp={onEnterApp}>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <PageHero
        eyebrow="Contact"
        title={['Two doors,', 'depending on why', 'you are here.']}
        lede="Contributor questions and dataset enquiries go to different people. Pick the one that fits and you skip a forwarding step."
        atmosphere="points"
        factsLabel="Reach us directly"
        facts={[
          { label: 'Contributor support', value: 'support@starset.ai', hint: 'Tasks, submissions, payouts' },
          { label: 'Dataset enquiries', value: 'data@starset.ai', hint: 'Scoping and feasibility' },
          { label: 'Everything else', value: 'hello@starset.ai' },
        ]}
      />

      {/* ═══════════════════════ PATH PICKER + FORM ═══════════════════════ */}
      <Section space="md">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          {/* Paths */}
          <div>
            <Reveal>
              <p className="t-meta">Choose a path</p>
              <div className="mt-4 grid gap-3">
                {(Object.keys(AUDIENCES) as Audience[]).map((key) => {
                  const entry = AUDIENCES[key];
                  const active = audience === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => pick(key)}
                      aria-pressed={active}
                      className={cn(
                        'card flex items-start gap-4 p-5 text-left transition-colors',
                        active
                          ? 'border-signal bg-signal-soft'
                          : 'hover:border-line-strong',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-10 w-10 flex-none items-center justify-center rounded-md',
                          active ? 'bg-signal text-white' : 'border border-line bg-paper-sunk text-ink',
                        )}
                      >
                        <entry.icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.9375rem] font-semibold text-ink">{entry.label}</span>
                        <span className="mt-1 block text-sm text-body">{entry.blurb}</span>
                        <span className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                          <Mail className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                          {entry.email}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-8 card p-5">
                <p className="t-meta">Might answer it faster</p>
                <ul className="mt-3 space-y-2.5">
                  {[
                    { label: 'Marketplace', page: 'marketplace' as PublicPageType },
                  ].map((item) => (
                    <li key={item.page}>
                      <button
                        type="button"
                        onClick={() => onNavigate(item.page)}
                        className="link-arrow text-body hover:text-ink"
                      >
                        {item.label}
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={80}>
            <div className="card p-6 sm:p-8">
              {sent ? (
                <div className="py-10 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ok-soft text-[var(--ok)]">
                    <CheckCircle2 className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <h2 className="t-h4 mt-5">Your email client should be open</h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-body">
                    The message is addressed to{' '}
                    <a className="link" href={`mailto:${config.email}`}>{config.email}</a> with your
                    details filled in, so you keep a copy of what you sent. If nothing opened,
                    email that address directly.
                  </p>
                  <Button className="mt-6" variant="secondary" onClick={() => setSent(false)}>
                    Edit the message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="t-h3">{config.label}</h2>
                    <p className="mt-1.5 text-sm text-body">
                      Goes to <span className="font-medium text-ink">{config.email}</span>
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="field-label" htmlFor="contact-name">Name</label>
                      <input
                        id="contact-name"
                        className="field"
                        required
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="contact-email">Email</label>
                      <input
                        id="contact-email"
                        type="email"
                        className="field"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="contact-topic">Topic</label>
                    <select
                      id="contact-topic"
                      className="field"
                      required
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    >
                      <option value="" disabled>Select a topic</option>
                      {config.topics.map((topic) => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="contact-detail">{config.detailLabel}</label>
                    <textarea
                      id="contact-detail"
                      className="field"
                      required
                      rows={6}
                      value={form.detail}
                      onChange={(e) => setForm({ ...form, detail: e.target.value })}
                      placeholder={config.detailPlaceholder}
                    />
                    <p className="field-hint">
                      This opens your email client with the message filled in — nothing is stored on this page.
                    </p>
                  </div>

                  <Button type="submit" size="lg" block>
                    Send message
                    <Send className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Section>

    </PublicLayout>
  );
};
