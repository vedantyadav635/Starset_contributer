import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Mic,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  User,
  FileText,
  Inbox,
} from 'lucide-react';

import { supabase } from '../supabaseClient';
import { API_ENDPOINTS } from '../config/api';
import { Button } from '../components/Button';
import { Waveform } from '../components/Waveform';
import { cn } from '../lib/utils';

interface Submission {
  id: string;
  task_id: string;
  user_id: string;
  audio_url: string | null;
  image_url: string | null;
  text_content: string | null;
  selected_option: string | null;
  file_size: number | null;
  mime_type: string | null;
  duration_seconds: number | null;
  status: string;
  validation_status: string | null;
  validation_errors: string[] | null;
  submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
  tasks: { title: string; type: string; prompt: string; compensation: number } | null;
  profiles: { full_name: string; email_text: string } | null;
}

const REJECTION_REASONS = [
  'Audio is silent or inaudible',
  'Background noise too loud',
  'Wrong script / did not follow prompt',
  'Recording too short',
  'Audio quality too poor',
  'Duplicate submission',
  'Other',
];

const STATUS_TONE: Record<string, string> = {
  pending_validation: 'tag-warn',
  approved: 'tag-ok',
  auto_passed: 'tag-signal',
  rejected: 'tag-danger',
};

export const AdminSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('pending_validation');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{ id: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState(REJECTION_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { fetchApi } = await import('../lib/api');
      const url =
        filterStatus === 'pending_validation'
          ? API_ENDPOINTS.ADMIN_SUBMISSIONS_PENDING
          : `${API_ENDPOINTS.ADMIN_SUBMISSIONS}?status=${filterStatus}&limit=100`;

      const res = await fetchApi(url);
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubmissions(); }, [filterStatus]);

  // Stop any playing clip when the queue changes or the view unmounts.
  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const getAdminId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || 'admin';
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const { fetchApi } = await import('../lib/api');
      const adminId = await getAdminId();
      const res = await fetchApi(API_ENDPOINTS.APPROVE_SUBMISSION(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert('Failed to approve submission');
      }
    } catch (err) {
      console.error(err);
      alert('Error approving submission');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog) return;
    const reason = rejectionReason === 'Other' ? customReason : rejectionReason;
    if (!reason.trim()) { alert('Please enter a rejection reason.'); return; }

    setProcessingId(rejectDialog.id);
    try {
      const { fetchApi } = await import('../lib/api');
      const adminId = await getAdminId();
      const res = await fetchApi(API_ENDPOINTS.REJECT_SUBMISSION(rejectDialog.id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, reason }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== rejectDialog.id));
        setRejectDialog(null);
        setRejectionReason(REJECTION_REASONS[0]);
        setCustomReason('');
      } else {
        alert('Failed to reject submission');
      }
    } catch (err) {
      console.error(err);
      alert('Error rejecting submission');
    } finally {
      setProcessingId(null);
    }
  };

  const handlePlayAudio = (sub: Submission) => {
    if (playingId === sub.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();

    const audio = new Audio(sub.audio_url || '');
    audio.onended = () => setPlayingId(null);
    audio.play();
    audioRef.current = audio;
    setPlayingId(sub.id);
  };

  const formatDuration = (s: number | null) => {
    if (!s) return '—';
    return `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '—';
    return bytes > 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="t-meta">Console</p>
          <h1 className="t-h2 mt-1.5">Review queue</h1>
          <p className="mt-2 text-sm text-body" role="status" aria-live="polite">
            {loading
              ? 'Loading…'
              : `${submissions.length} submission${submissions.length === 1 ? '' : 's'} in this view`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="submission-filter">Filter by status</label>
          <select
            id="submission-filter"
            className="field h-9 min-h-0 w-auto py-0 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="pending_validation">Pending review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            type="button"
            onClick={fetchSubmissions}
            aria-label="Refresh the queue"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* ── Queue ── */}
      {loading ? (
        <div className="card flex items-center justify-center gap-3 px-6 py-20 text-sm text-muted">
          <RefreshCw className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden="true" />
          Loading submissions…
        </div>
      ) : submissions.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 px-6 py-20 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper-sunk text-muted">
            <Inbox className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <p className="text-sm font-medium text-ink">
            {filterStatus === 'pending_validation' ? 'Queue is clear' : 'Nothing in this view'}
          </p>
          <p className="max-w-xs text-xs text-body">
            {filterStatus === 'pending_validation'
              ? 'Every submission has been reviewed.'
              : 'No submissions match this filter.'}
          </p>
        </div>
      ) : (
        <ul className="grid gap-4">
          {submissions.map((sub) => {
            const isPending = sub.status === 'pending_validation';
            const contributor =
              sub.profiles?.full_name || sub.profiles?.email_text || sub.user_id.slice(0, 8);

            return (
              <li key={sub.id}>
                <article className="panel overflow-hidden">
                  {/* Card header */}
                  <div className="panel-head">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-md border border-line bg-paper-sunk text-muted">
                        {sub.audio_url
                          ? <Mic className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                          : <FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
                      </span>

                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-ink">
                          {sub.tasks?.title || 'Unknown task'}
                        </h2>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                          <span className="flex items-center gap-1.5">
                            <User className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                            {contributor}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                            {new Date(sub.submitted_at).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </p>
                      </div>
                    </div>

                    <span className={cn('tag flex-none', STATUS_TONE[sub.status] ?? '')}>
                      {sub.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid gap-px bg-line md:grid-cols-2">
                    {/* ── Left: what was asked, what came back ── */}
                    <div className="space-y-4 bg-surface p-5">
                      {sub.tasks?.prompt && (
                        <div className="rounded-md border border-line bg-paper-sunk p-4">
                          <p className="t-meta">Prompt</p>
                          <p className="mt-2 text-sm leading-relaxed text-ink">
                            &ldquo;{sub.tasks.prompt}&rdquo;
                          </p>
                        </div>
                      )}

                      {sub.text_content && (
                        <div className="rounded-md border border-line p-4">
                          <p className="t-meta">Submitted text</p>
                          <div className="mt-2 text-sm text-body">
                            {(() => {
                              try {
                                const parsed = JSON.parse(sub.text_content || '{}');
                                if (typeof parsed === 'object' && parsed !== null) {
                                  return (
                                    <ol className="space-y-1.5">
                                      {Object.entries(parsed).map(([key, val]) => (
                                        <li key={key} className="flex gap-2.5 rounded border border-line-faint bg-paper-sunk px-2.5 py-1.5">
                                          <span className="font-mono text-xs text-muted">
                                            {String(parseInt(key, 10) + 1).padStart(2, '0')}
                                          </span>
                                          <span>{String(val)}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  );
                                }
                              } catch { /* plain text */ }
                              return <p className="whitespace-pre-line">{sub.text_content}</p>;
                            })()}
                          </div>
                        </div>
                      )}

                      {sub.selected_option && (
                        <div className="rounded-md border border-line p-4">
                          <p className="t-meta">Selected answer</p>
                          <p className="mt-2">
                            <span className="tag tag-signal">{sub.selected_option}</span>
                          </p>
                        </div>
                      )}

                      {sub.rejection_reason && (
                        <div className="rounded-md border border-[color-mix(in_srgb,var(--danger)_28%,transparent)] bg-danger-soft p-4">
                          <p className="t-meta">Rejection reason</p>
                          <p className="mt-1.5 text-sm text-[color:var(--danger)]">{sub.rejection_reason}</p>
                        </div>
                      )}
                    </div>

                    {/* ── Right: the artefact and the decision ── */}
                    <div className="space-y-4 bg-surface p-5">
                      {sub.audio_url && (
                        <div className="rounded-md border border-line bg-paper-sunk p-4">
                          <p className="t-meta">Recording</p>

                          <div className="mt-3 flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => handlePlayAudio(sub)}
                              aria-label={playingId === sub.id ? 'Pause playback' : 'Play this recording'}
                              className={cn(
                                'flex h-11 w-11 flex-none items-center justify-center rounded-full border transition-colors',
                                playingId === sub.id
                                  ? 'border-signal bg-signal text-white'
                                  : 'border-line bg-surface text-ink hover:border-line-strong',
                              )}
                            >
                              {playingId === sub.id
                                ? <Pause className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                                : <Play className="ml-0.5 h-4 w-4" strokeWidth={2} aria-hidden="true" />}
                            </button>

                            <div className="min-w-0 flex-1">
                              <Waveform
                                seed={sub.id}
                                bars={40}
                                height={30}
                                live={playingId === sub.id}
                                color={playingId === sub.id ? 'var(--signal)' : 'var(--line-strong)'}
                              />
                            </div>
                          </div>

                          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-3">
                            <div>
                              <dt className="t-meta">Duration</dt>
                              <dd className="t-mono mt-0.5 text-ink">{formatDuration(sub.duration_seconds)}</dd>
                            </div>
                            <div>
                              <dt className="t-meta">Size</dt>
                              <dd className="t-mono mt-0.5 text-ink">{formatFileSize(sub.file_size)}</dd>
                            </div>
                            {sub.mime_type && (
                              <div className="min-w-0">
                                <dt className="t-meta">Encoding</dt>
                                <dd className="t-mono mt-0.5 truncate text-ink">{sub.mime_type}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      )}

                      {sub.image_url && (
                        <div className="overflow-hidden rounded-md border border-line">
                          <img src={sub.image_url} alt="Submitted capture" loading="lazy" className="h-44 w-full object-cover" />
                        </div>
                      )}

                      {sub.validation_errors && sub.validation_errors.length > 0 && (
                        <div className="rounded-md border border-[color-mix(in_srgb,var(--warn)_28%,transparent)] bg-warn-soft p-4">
                          <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                            <AlertTriangle className="h-3.5 w-3.5 text-[color:var(--warn)]" strokeWidth={2} aria-hidden="true" />
                            Automated check warnings
                          </p>
                          <ul className="mt-2 space-y-1">
                            {sub.validation_errors.map((warning, i) => (
                              <li key={i} className="text-xs text-body">{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {isPending && (
                        <div className="flex gap-3 pt-1">
                          <Button
                            className="flex-1"
                            onClick={() => handleApprove(sub.id)}
                            isLoading={processingId === sub.id}
                            disabled={!!processingId}
                          >
                            <CheckCircle2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                            Approve
                          </Button>
                          <Button
                            variant="quiet-danger"
                            className="flex-1"
                            onClick={() => setRejectDialog({ id: sub.id })}
                            disabled={!!processingId}
                          >
                            <XCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {/* ── Reject dialog ── */}
      {rejectDialog && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-[color-mix(in_srgb,var(--ink)_45%,transparent)] backdrop-blur-[2px] sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-title"
          onClick={(e) => { if (e.target === e.currentTarget) setRejectDialog(null); }}
        >
          <div className="animate-scale-in w-full max-w-md overflow-hidden rounded-t-xl border border-line bg-surface shadow-lg sm:rounded-xl">
            <div className="border-b border-line px-5 py-4">
              <h2 id="reject-title" className="text-sm font-semibold text-ink">Reject this submission</h2>
              <p className="mt-1 text-xs text-body">
                The reason you pick is shown to the contributor, so choose the one that actually
                explains what went wrong.
              </p>
            </div>

            <div className="thin-scroll max-h-[50vh] overflow-y-auto p-5">
              <fieldset>
                <legend className="sr-only">Rejection reason</legend>
                <div className="grid gap-2">
                  {REJECTION_REASONS.map((reason) => {
                    const selected = rejectionReason === reason;
                    return (
                      <label
                        key={reason}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors',
                          selected ? 'border-signal bg-signal-soft text-ink' : 'border-line text-body hover:border-line-strong',
                        )}
                      >
                        <input
                          type="radio"
                          name="rejection-reason"
                          value={reason}
                          checked={selected}
                          onChange={() => setRejectionReason(reason)}
                          className="h-4 w-4 flex-none"
                        />
                        {reason}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {rejectionReason === 'Other' && (
                <div className="mt-4">
                  <label className="field-label" htmlFor="custom-reason">Describe the issue</label>
                  <textarea
                    id="custom-reason"
                    className="field min-h-[5rem]"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Be specific enough that the next take can fix it."
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 border-t border-line px-5 py-4">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  setRejectDialog(null);
                  setRejectionReason(REJECTION_REASONS[0]);
                  setCustomReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleReject}
                isLoading={processingId === rejectDialog.id}
              >
                Confirm rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
