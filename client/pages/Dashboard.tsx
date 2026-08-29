import React, { useEffect, useState } from 'react';
import {
  Database,
  Clock,
  CheckCircle2,
  Percent,
  ArrowRight,
  ShieldCheck,
  BadgeIndianRupee,
} from 'lucide-react';

import { PageView } from '../types';
import { Button } from '../components/Button';
import { supabase } from '../supabaseClient';
import { Waveform } from '../components/Waveform';
import { cn } from '../lib/utils';

interface DashboardProps {
  onNavigate: (page: PageView) => void;
}

interface UserStats {
  totalSubmissions: number;
  inValidation: number;
  accepted: number;
  acceptanceRate: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<UserStats>({
    totalSubmissions: 0,
    inValidation: 0,
    accepted: 0,
    acceptanceRate: '—',
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    let subscription: any;

    const fetchUserStats = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        const { data: submissions } = await supabase
          .from('submissions')
          .select('status, validation_status')
          .eq('user_id', authUser.id);

        if (submissions) {
          const total = submissions.length;

          const accepted = submissions.filter((s: any) =>
            ['auto_passed', 'approved'].includes(s.validation_status) ||
            ['accepted', 'validated', 'approved'].includes(s.status)
          ).length;

          const inValidation = submissions.filter((s: any) =>
            s.validation_status === 'pending' ||
            (s.status === 'pending_validation' &&
              !['auto_passed', 'auto_failed', 'approved', 'rejected'].includes(s.validation_status))
          ).length;

          const rate = total > 0 ? `${((accepted / total) * 100).toFixed(0)}%` : '—';
          setStats({ totalSubmissions: total, inValidation, accepted, acceptanceRate: rate });
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', authUser.id)
          .single();
        if (profile?.full_name) setUserName(profile.full_name);

        // Live-update the counters when a submission's review outcome changes.
        subscription = supabase
          .channel('dashboard-submissions')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'submissions',
              filter: `user_id=eq.${authUser.id}`,
            },
            () => { fetchUserStats(); },
          )
          .subscribe();
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  const value = (v: string | number) => (statsLoading ? '—' : String(v));

  const cards: {
    label: string;
    value: string;
    caption: string;
    icon: typeof Database;
    tone?: 'ok' | 'warn';
  }[] = [
    {
      label: 'Submissions',
      value: value(stats.totalSubmissions),
      caption: 'Everything you have sent',
      icon: Database,
    },
    {
      label: 'In review',
      value: value(stats.inValidation),
      caption: 'Awaiting a decision',
      icon: Clock,
      tone: stats.inValidation > 0 ? 'warn' : undefined,
    },
    {
      label: 'Accepted',
      value: value(stats.accepted),
      caption: 'Passed review',
      icon: CheckCircle2,
      tone: stats.accepted > 0 ? 'ok' : undefined,
    },
    {
      label: 'Acceptance rate',
      value: value(stats.acceptanceRate),
      caption: stats.totalSubmissions > 0 ? 'Accepted ÷ submitted' : 'No submissions yet',
      icon: Percent,
    },
  ];

  const isNewContributor = !statsLoading && stats.totalSubmissions === 0;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="t-meta">Overview</p>
          <h1 className="t-h2 mt-1.5">
            {userName ? `Welcome back, ${userName.split(' ')[0]}` : 'Welcome back'}
          </h1>
        </div>
        <Button onClick={() => onNavigate('tasks')} className="self-start sm:self-auto">
          Browse tasks
          <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </Button>
      </header>

      {/* ── Stat row ── */}
      <section aria-label="Your submission statistics">
        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="stat-label">{card.label}</p>
                <card.icon
                  className={cn(
                    'h-4 w-4 flex-none',
                    card.tone === 'ok' ? 'text-[color:var(--ok)]'
                      : card.tone === 'warn' ? 'text-[color:var(--warn)]'
                      : 'text-muted',
                  )}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </div>
              <p className="stat-value mt-3">{card.value}</p>
              <p className="mt-1.5 text-xs text-muted">{card.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Primary action ── */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="panel overflow-hidden">
          <div className="panel-head">
            <h2 className="text-sm font-semibold text-ink">Available tasks</h2>
            <span className="t-meta">Open collections</span>
          </div>

          <div className="panel-body">
            <p className="max-w-prose text-body">
              {isNewContributor
                ? 'You have not submitted anything yet. Open the task list, pick a collection in a language you speak, and record your first one — the rate and time estimate are on every card.'
                : 'Pick up another task whenever you like. Rates and time estimates are shown before you start, and only accepted submissions are compensated.'}
            </p>

            <div className="mt-6">
              <Waveform seed="dashboard-cta" bars={96} height={34} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => onNavigate('tasks')}>
                Open task list
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </Button>
              <Button variant="ghost" onClick={() => onNavigate('guidelines')}>
                Quality standards
              </Button>
            </div>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="panel-head">
            <h2 className="text-sm font-semibold text-ink">Next steps</h2>
          </div>

          <ul className="divide-y divide-line-faint">
            {[
              {
                icon: ShieldCheck,
                title: 'Read the quality standards',
                body: 'What a reviewer listens for, and the reasons a submission gets rejected.',
                page: 'guidelines' as PageView,
              },
              {
                icon: BadgeIndianRupee,
                title: 'Check your payout details',
                body: 'Compensation settles to the UPI ID on your profile.',
                page: 'account' as PageView,
              },
              {
                icon: Clock,
                title: 'Track your submissions',
                body: 'See what is still in review and what has been accepted.',
                page: 'earnings' as PageView,
              },
            ].map((item) => (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.page)}
                  className="group flex w-full items-start gap-3.5 px-5 py-4 text-left transition-colors hover:bg-paper-sunk"
                >
                  <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-md border border-line bg-paper-sunk text-muted group-hover:text-ink">
                    <item.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">{item.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-body">{item.body}</span>
                  </span>
                  <ArrowRight
                    className="mt-2 h-4 w-4 flex-none text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
