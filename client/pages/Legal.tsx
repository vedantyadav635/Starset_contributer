import React from 'react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Container, Section, Eyebrow } from '../components/ui/Layout';
import { Reveal } from '../components/Reveal';

type LegalPageType = 'terms' | 'privacy' | 'cookies' | 'data-processing';

interface LegalProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
  pageType: LegalPageType;
}

interface Clause {
  id: string;
  heading: string;
  body: React.ReactNode;
}

interface LegalDocument {
  title: string;
  intro: string;
  lastUpdated: string;
  clauses: Clause[];
}

const LAST_UPDATED = 'May 30, 2026';

const DOCUMENTS: Record<LegalPageType, LegalDocument> = {
  terms: {
    title: 'Terms of Service',
    intro: 'The agreement covering your use of the Starset platform, your contributions, and how compensation works.',
    lastUpdated: LAST_UPDATED,
    clauses: [
      {
        id: 'acceptance',
        heading: 'Acceptance of terms',
        body: (
          <p>
            By accessing or using the Starset Intelligence platform (the &ldquo;Service&rdquo;), you agree to
            be bound by these Terms of Service. If you do not agree to these terms, please do not use
            our Service. The Service is operated by Starset Intelligence Inc.
          </p>
        ),
      },
      {
        id: 'obligations',
        heading: 'Contributor obligations',
        body: (
          <>
            <p>
              As a contributor, you agree to provide accurate, honest, and high-quality data
              submissions. You acknowledge that:
            </p>
            <ul>
              <li>You are at least 18 years of age.</li>
              <li>You will not use automated scripts, bots, or AI to complete tasks.</li>
              <li>
                You will maintain the confidentiality of any proprietary data or information you
                encounter during tasks.
              </li>
              <li>Your submitted data is original and you have the right to submit it.</li>
            </ul>
          </>
        ),
      },
      {
        id: 'compensation',
        heading: 'Compensation and payouts',
        body: (
          <p>
            Starset Intelligence compensates contributors based on successfully validated tasks.
            Payment is calculated per task as indicated on the task brief. We reserve the right to
            reject submissions that do not meet our quality standards, and such submissions will not
            be compensated.
          </p>
        ),
      },
      {
        id: 'ip',
        heading: 'Intellectual property',
        body: (
          <p>
            Upon submission and acceptance of a task, you assign all rights, title, and interest,
            including intellectual property rights, in and to the submitted data to Starset
            Intelligence. You waive any moral rights you may have in the submitted data.
          </p>
        ),
      },
      {
        id: 'termination',
        heading: 'Termination',
        body: (
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability,
            for any reason whatsoever, including without limitation if you breach the Terms. Quality
            control failures or fraudulent activity will result in immediate termination.
          </p>
        ),
      },
    ],
  },

  privacy: {
    title: 'Privacy Policy',
    intro: 'What personal information Starset collects, how it is used, and how your recordings are handled.',
    lastUpdated: LAST_UPDATED,
    clauses: [
      {
        id: 'collect',
        heading: 'Information we collect',
        body: (
          <>
            <p>
              When you register as a contributor on Starset Intelligence, we collect personal
              information including but not limited to:
            </p>
            <ul>
              <li>Name, email address, and demographic information.</li>
              <li>Payment details (UPI ID, bank account details) for compensation.</li>
              <li>Device and browser information, IP address, and platform usage data.</li>
              <li>Data you actively submit as part of tasks (for example audio recordings and images).</li>
            </ul>
          </>
        ),
      },
      {
        id: 'use',
        heading: 'How we use your information',
        body: (
          <>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>To provide and maintain our Service.</li>
              <li>To notify you about changes to our Service.</li>
              <li>To process compensation payments.</li>
              <li>To verify your identity and prevent fraudulent activity.</li>
              <li>
                To train and improve artificial intelligence models, using only data submitted
                explicitly for tasks.
              </li>
            </ul>
          </>
        ),
      },
      {
        id: 'sharing',
        heading: 'Data sharing and disclosure',
        body: (
          <p>
            We do not sell your personal data to third parties. We may share your data with trusted
            partners and service providers who assist us in operating our platform, conducting our
            business, or processing payments, so long as those parties agree to keep this information
            confidential.
          </p>
        ),
      },
      {
        id: 'security',
        heading: 'Security',
        body: (
          <p>
            The security of your data is important to us, but no method of transmission over the
            internet or method of electronic storage is completely secure. While we strive to use
            commercially acceptable means to protect your personal data, we cannot guarantee its
            absolute security.
          </p>
        ),
      },
    ],
  },

  cookies: {
    title: 'Cookie Policy',
    intro: 'The cookies Starset sets, what each one is for, and how to refuse the optional ones.',
    lastUpdated: LAST_UPDATED,
    clauses: [
      {
        id: 'what',
        heading: 'What cookies are',
        body: (
          <p>
            Cookies are small files placed on your computer, mobile device or any other device by a
            website, containing details of your browsing activity on that site among other uses.
          </p>
        ),
      },
      {
        id: 'how',
        heading: 'How we use cookies',
        body: (
          <>
            <p>Starset Intelligence uses cookies for several reasons:</p>
            <ul>
              <li>
                <strong>Essential cookies.</strong> Required to authenticate users and prevent
                fraudulent use of accounts.
              </li>
              <li>
                <strong>Preference cookies.</strong> Used to remember settings that change how the
                platform behaves or looks, such as your theme choice.
              </li>
              <li>
                <strong>Analytics cookies.</strong> Help us understand how visitors interact with the
                platform by collecting and reporting information anonymously.
              </li>
            </ul>
          </>
        ),
      },
      {
        id: 'choices',
        heading: 'Your choices',
        body: (
          <p>
            If you prefer to avoid the use of cookies, disable them in your browser and delete the
            cookies already saved for this site. You may do this at any time, though it may degrade
            or break parts of the platform&rsquo;s functionality.
          </p>
        ),
      },
    ],
  },

  'data-processing': {
    title: 'Data Processing Agreement',
    intro: 'How data submitted through Starset is processed, de-identified, stored and shared with sub-processors.',
    lastUpdated: LAST_UPDATED,
    clauses: [
      {
        id: 'scope',
        heading: 'Scope and applicability',
        body: (
          <p>
            This Data Processing Agreement (&ldquo;DPA&rdquo;) applies to the processing of personal
            data by Starset Intelligence in the context of providing the platform to you and
            collecting training data for artificial intelligence models.
          </p>
        ),
      },
      {
        id: 'nature',
        heading: 'Nature of processing',
        body: (
          <p>
            Processing consists of collecting, recording, organising, structuring, storing, adapting,
            retrieving, and transmitting data specifically for the purpose of training, fine-tuning,
            and evaluating machine learning and AI models.
          </p>
        ),
      },
      {
        id: 'anonymisation',
        heading: 'Anonymisation and de-identification',
        body: (
          <p>
            Starset Intelligence is committed to minimising the processing of personally identifiable
            information (PII). Any data submitted as part of a task that contains accidental PII will
            undergo automated and manual de-identification before being used in model training
            pipelines.
          </p>
        ),
      },
      {
        id: 'subprocessors',
        heading: 'Sub-processors',
        body: (
          <p>
            You agree that Starset Intelligence may engage third-party sub-processors, such as cloud
            hosting and storage providers and payment processors, to process data on our behalf. We
            ensure such sub-processors are bound by written agreements requiring at least the level
            of data protection required by this DPA.
          </p>
        ),
      },
    ],
  },
};

export const Legal: React.FC<LegalProps> = ({ onNavigate, onEnterApp, pageType }) => {
  const document = DOCUMENTS[pageType] ?? DOCUMENTS.terms;

  return (
    <PublicLayout currentPage={pageType} onNavigate={onNavigate} onEnterApp={onEnterApp}>
      <section className="border-b border-line">
        <Container className="py-12 lg:py-16">
          <Reveal>
            <Eyebrow>Legal</Eyebrow>
            <h1 className="t-h1 mt-4">{document.title}</h1>
            <p className="t-lead mt-4 max-w-2xl">{document.intro}</p>
            <p className="t-meta mt-6">Last updated · {document.lastUpdated}</p>
          </Reveal>
        </Container>
      </section>

      <Section space="md">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">
          {/* Contents */}
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className="t-meta">Contents</p>
            <ol className="mt-4 space-y-1">
              {document.clauses.map((clause, i) => (
                <li key={clause.id}>
                  <a
                    href={`#${clause.id}`}
                    className="flex gap-3 rounded-md px-2 py-1.5 text-sm text-body transition-colors hover:bg-paper-sunk hover:text-ink"
                  >
                    <span className="t-meta flex-none pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    {clause.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Document */}
          <div className="legal-body max-w-prose">
            {document.clauses.map((clause, i) => (
              <section key={clause.id} id={clause.id} className="scroll-mt-28">
                <h2>
                  <span className="t-meta mr-3 align-middle">{String(i + 1).padStart(2, '0')}</span>
                  {clause.heading}
                </h2>
                {clause.body}
              </section>
            ))}

            <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
              Questions about this document?{' '}
              <button type="button" className="link" onClick={() => onNavigate('contact')}>
                Contact us
              </button>
              .
            </p>
          </div>
        </div>
      </Section>
    </PublicLayout>
  );
};
