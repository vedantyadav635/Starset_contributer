import React, { useEffect, useMemo, useState } from 'react';
import {
  Smartphone,
  Inbox,
  AlertTriangle,
  Plus,
  X,
  Landmark,
  CheckCircle2,
  Info,
} from 'lucide-react';

import { Transaction } from '../types';
import { Button } from '../components/Button';
import { supabase } from '../supabaseClient';
import { cn } from '../lib/utils';

type StatusFilter = 'All' | 'Processed' | 'Pending';

export const Earnings: React.FC = () => {
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [addMethodTab, setAddMethodTab] = useState<'upi' | 'bank'>('upi');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [filter, setFilter] = useState<StatusFilter>('All');

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) setUserProfile(profile);

        const { data: submissions, error } = await supabase
          .from('submissions')
          .select('id, task_id, status, submitted_at')
          .eq('user_id', user.id)
          .order('submitted_at', { ascending: false });

        if (!error && submissions) {
          const txns: Transaction[] = submissions.map((sub, i) => ({
            id: sub.id,
            date: new Date(sub.submitted_at).toLocaleDateString('en-CA'),
            amount: 0,
            currency: 'INR',
            description: `Submission #${sub.task_id?.substring(0, 8) || i + 1}`,
            status:
              sub.status === 'accepted' || sub.status === 'validated' || sub.status === 'approved'
                ? 'Processed'
                : ('Pending' as 'Pending' | 'Processed' | 'Failed'),
          }));
          setTransactions(txns);
        }
      } catch (err) {
        console.error('Error fetching earnings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const accepted = transactions.filter((tx) => tx.status === 'Processed').length;
  const pending = transactions.filter((tx) => tx.status === 'Pending').length;

  const visible = useMemo(
    () => (filter === 'All' ? transactions : transactions.filter((tx) => tx.status === filter)),
    [transactions, filter],
  );

  const upiId = userProfile?.upi_id || '';
  const hasUpi = Boolean(upiId);

  // Escape closes the dialog.
  useEffect(() => {
    if (!showAddMethod) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowAddMethod(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showAddMethod]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <header className="border-b border-line pb-6">
        <p className="t-meta">Compensation</p>
        <h1 className="t-h2 mt-1.5">Submissions and settlement</h1>
        <p className="mt-2 max-w-2xl text-sm text-body">
          Every submission you have sent, and which of them have passed review. Accepted work
          settles to the UPI ID on your profile.
        </p>
      </header>

      {/* ── Settlement notice — accurate about the manual process ── */}
      <div className="flex gap-3.5 rounded-lg border border-[color-mix(in_srgb,var(--warn)_28%,transparent)] bg-warn-soft p-4">
        <AlertTriangle
          className="mt-0.5 h-4 w-4 flex-none text-[color:var(--warn)]"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-ink">Settlement is processed manually</p>
          <p className="mt-1 text-sm text-body">
            Payouts are currently handled by the team rather than triggered from this page, so
            there is no withdraw button here yet. Contributor support can tell you where a
            specific settlement stands.
          </p>
        </div>
      </div>

      {/* ── Counters ── */}
      <section aria-label="Submission counts">
        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
          {[
            { label: 'Total submissions', value: loading ? '—' : transactions.length, caption: 'Everything you have sent' },
            { label: 'Accepted', value: loading ? '—' : accepted, caption: 'Passed review' },
            { label: 'In review', value: loading ? '—' : pending, caption: 'Awaiting a decision' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface p-5">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value mt-3">{stat.value}</p>
              <p className="mt-1.5 text-xs text-muted">{stat.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Payment method ── */}
      <section className="panel overflow-hidden">
        <div className="panel-head">
          <h2 className="text-sm font-semibold text-ink">Payment method</h2>
          {hasUpi && <span className="tag tag-ok">On file</span>}
        </div>

        <div className="panel-body">
          {hasUpi ? (
            <div className="flex flex-wrap items-center gap-4 rounded-md border border-line bg-paper-sunk p-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-line bg-surface text-ink">
                <Smartphone className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="t-meta">UPI ID</p>
                <p className="t-mono mt-0.5 truncate text-ink">{upiId}</p>
              </div>
              <CheckCircle2 className="h-4 w-4 flex-none text-[color:var(--ok)]" strokeWidth={2} aria-hidden="true" />
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-line-strong p-6 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-md border border-line bg-paper-sunk text-muted">
                <Smartphone className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-medium text-ink">No UPI ID on file</p>
              <p className="mx-auto mt-1 max-w-xs text-xs text-body">
                Add one from your profile so accepted work has somewhere to settle.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAddMethod(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-line-strong px-4 py-3.5 text-sm font-medium text-body transition-colors hover:border-signal hover:bg-signal-soft hover:text-signal"
          >
            <Plus className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Add another account
          </button>
        </div>
      </section>

      {/* ── Ledger ── */}
      <section className="panel overflow-hidden">
        <div className="panel-head">
          <h2 className="text-sm font-semibold text-ink">Submission ledger</h2>

          <div className="segmented" role="group" aria-label="Filter submissions">
            {(['All', 'Processed', 'Pending'] as StatusFilter[]).map((option) => (
              <button
                key={option}
                type="button"
                data-active={filter === option}
                aria-pressed={filter === option}
                onClick={() => setFilter(option)}
              >
                {option === 'Processed' ? 'Accepted' : option === 'Pending' ? 'In review' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-muted">Loading your submissions…</div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper-sunk text-muted">
              <Inbox className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <p className="text-sm font-medium text-ink">
              {transactions.length === 0 ? 'No submissions yet' : 'Nothing matches this filter'}
            </p>
            <p className="max-w-xs text-xs text-body">
              {transactions.length === 0
                ? 'Complete a task and it will appear here with its review status.'
                : 'Try a different status filter.'}
            </p>
          </div>
        ) : (
          <div className="scroll-x">
            <table className="data-table">
              <caption className="sr-only">Your submissions and their review status</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Submission</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((tx) => (
                  <tr key={tx.id}>
                    <td className="font-mono text-xs text-muted">{tx.date}</td>
                    <td className="font-medium text-ink">{tx.description}</td>
                    <td>
                      <span className={cn('tag', tx.status === 'Processed' ? 'tag-ok' : tx.status === 'Pending' ? 'tag-warn' : 'tag-danger')}>
                        {tx.status === 'Processed' ? 'Accepted' : tx.status === 'Pending' ? 'In review' : tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-start gap-2 border-t border-line bg-paper-sunk px-5 py-3">
          <Info className="mt-0.5 h-3.5 w-3.5 flex-none text-muted" strokeWidth={1.75} aria-hidden="true" />
          <p className="text-xs text-body">
            Per-submission amounts are not itemised here yet — the rate for each task is shown on
            the task itself before you start.
          </p>
        </div>
      </section>

      {/* ── Add account dialog ── */}
      {showAddMethod && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-[color-mix(in_srgb,var(--ink)_45%,transparent)] p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-account-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddMethod(false); }}
        >
          <div className="animate-scale-in w-full max-w-md overflow-hidden rounded-t-xl border border-line bg-surface shadow-lg sm:rounded-xl">
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
              <h2 id="add-account-title" className="text-sm font-semibold text-ink">Add a payout account</h2>
              <button
                type="button"
                onClick={() => setShowAddMethod(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-paper-sunk hover:text-ink"
              >
                <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>

            <div className="p-5">
              <div className="segmented w-full" role="group" aria-label="Account type">
                <button
                  type="button"
                  className="flex-1"
                  data-active={addMethodTab === 'upi'}
                  aria-pressed={addMethodTab === 'upi'}
                  onClick={() => setAddMethodTab('upi')}
                >
                  <Smartphone className="mr-1.5 inline h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  UPI
                </button>
                <button
                  type="button"
                  className="flex-1"
                  data-active={addMethodTab === 'bank'}
                  aria-pressed={addMethodTab === 'bank'}
                  onClick={() => setAddMethodTab('bank')}
                >
                  <Landmark className="mr-1.5 inline h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  Bank
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {addMethodTab === 'upi' ? (
                  <>
                    <div>
                      <label className="field-label" htmlFor="new-upi">UPI ID</label>
                      <input id="new-upi" className="field font-mono" placeholder="yourname@bank" />
                      <p className="field-hint">Works with GPay, PhonePe, Paytm and BHIM.</p>
                    </div>
                    <div>
                      <label className="field-label" htmlFor="confirm-upi">Confirm UPI ID</label>
                      <input id="confirm-upi" className="field font-mono" placeholder="yourname@bank" />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="field-label" htmlFor="acct-number">Account number</label>
                      <input id="acct-number" className="field font-mono" inputMode="numeric" />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="acct-ifsc">IFSC code</label>
                      <input id="acct-ifsc" className="field font-mono uppercase" placeholder="ABCD0123456" />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="acct-name">Account holder name</label>
                      <input id="acct-name" className="field" autoComplete="name" />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-md border border-line bg-paper-sunk p-3">
                <Info className="mt-0.5 h-3.5 w-3.5 flex-none text-muted" strokeWidth={1.75} aria-hidden="true" />
                <p className="text-xs text-body">
                  Additional payout accounts are not yet wired to settlement. Your primary UPI ID
                  on your profile is the account currently used.
                </p>
              </div>
            </div>

            <div className="flex gap-3 border-t border-line px-5 py-4">
              <Button variant="ghost" className="flex-1" onClick={() => setShowAddMethod(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setShowAddMethod(false);
                  alert('Noted. Settlement still uses the UPI ID on your profile for now.');
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
