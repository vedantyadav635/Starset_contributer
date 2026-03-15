import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { API_ENDPOINTS } from '../config/api';
import {
    CheckCircle, XCircle, Clock, Mic, Play, Pause,
    ChevronDown, RefreshCw, Filter, AlertTriangle, User, FileAudio,
} from 'lucide-react';
import { Button } from '../components/Button';

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
            const url = filterStatus === 'pending_validation'
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
                setSubmissions(prev => prev.filter(s => s.id !== id));
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
                setSubmissions(prev => prev.filter(s => s.id !== rejectDialog.id));
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
        if (audioRef.current) {
            audioRef.current.pause();
        }
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

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            pending_validation: 'bg-amber-900/30 text-amber-400',
            approved: 'bg-emerald-900/30 text-emerald-400',
            rejected: 'bg-red-900/30 text-red-400',
            auto_passed: 'bg-blue-900/30 text-blue-400',
        };
        return map[status] || 'bg-zinc-800 text-zinc-400';
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Submission Review</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        {loading ? 'Loading...' : `${submissions.length} submission${submissions.length !== 1 ? 's' : ''} found`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="pl-9 pr-8 h-9 text-sm rounded-lg border border-white/10 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 appearance-none"
                        >
                            <option value="pending_validation">Pending Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 pointer-events-none" />
                    </div>
                    <button
                        onClick={fetchSubmissions}
                        className="h-9 w-9 flex items-center justify-center rounded-lg border border-white/10 bg-zinc-900 hover:bg-white/5 transition-colors"
                    >
                        <RefreshCw className={`h-4 w-4 text-zinc-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Submissions List */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-zinc-400">
                    <RefreshCw className="h-5 w-5 animate-spin mr-3" /> Loading submissions...
                </div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-20">
                    <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                    <p className="text-zinc-500 font-medium">No submissions here</p>
                    <p className="text-zinc-400 text-sm mt-1">
                        {filterStatus === 'pending_validation' ? 'All submissions have been reviewed!' : 'No submissions match this filter.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {submissions.map(sub => (
                        <div
                            key={sub.id}
                            className="bg-zinc-900 rounded-2xl border border-white/10 shadow-sm overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between p-5 pb-4 border-b border-white/5">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        {sub.audio_url ? (
                                            <Mic className="h-5 w-5 text-blue-400" />
                                        ) : (
                                            <FileAudio className="h-5 w-5 text-purple-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-sm">
                                            {sub.tasks?.title || 'Unknown Task'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <User className="h-3 w-3 text-zinc-400" />
                                            <span className="text-xs text-zinc-500">
                                                {sub.profiles?.full_name || sub.profiles?.email_text || sub.user_id.slice(0, 8)}
                                            </span>
                                            <span className="text-zinc-700">•</span>
                                            <Clock className="h-3 w-3 text-zinc-400" />
                                            <span className="text-xs text-zinc-500">
                                                {new Date(sub.submitted_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(sub.status)}`}>
                                        {sub.status.replace(/_/g, ' ')}
                                    </span>
                                    {sub.rejection_reason && (
                                        <span className="text-xs text-red-500 italic max-w-[180px] truncate" title={sub.rejection_reason}>
                                            "{sub.rejection_reason}"
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 grid md:grid-cols-2 gap-5">
                                {/* Left: Prompt + Audio/Content */}
                                <div className="space-y-3">
                                    {sub.tasks?.prompt && (
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Script / Prompt</p>
                                            <p className="text-sm text-zinc-200 font-serif leading-relaxed">
                                                "{sub.tasks.prompt}"
                                            </p>
                                        </div>
                                    )}

                                    {sub.text_content && (
                                        <div className="bg-white/5 rounded-xl p-4">
                                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Submitted Text</p>
                                            <p className="text-sm text-zinc-300">{sub.text_content}</p>
                                        </div>
                                    )}

                                    {sub.selected_option && (
                                        <div className="bg-white/5 rounded-xl p-4">
                                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Selected Answer</p>
                                            <span className="inline-block px-3 py-1 bg-blue-900/30 text-blue-400 text-sm font-semibold rounded-lg">
                                                {sub.selected_option}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Metadata + Audio Player + Actions */}
                                <div className="space-y-3">
                                    {/* Audio Player */}
                                    {sub.audio_url && (
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Audio Recording</p>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handlePlayAudio(sub)}
                                                    className={`h-12 w-12 rounded-full flex items-center justify-center shadow-sm transition-all border ${playingId === sub.id
                                                        ? 'bg-blue-600 border-blue-500 text-white scale-95'
                                                        : 'bg-zinc-800 border-white/10 text-zinc-300 hover:border-blue-500 hover:text-blue-600'
                                                        }`}
                                                >
                                                    {playingId === sub.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                                                </button>
                                                <div className="flex-1">
                                                    <div className="flex gap-1 items-end h-8">
                                                        {[...Array(20)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`w-1 rounded-full transition-all ${playingId === sub.id ? 'bg-blue-500 animate-pulse' : 'bg-zinc-700'
                                                                    }`}
                                                                style={{ height: `${Math.random() * 24 + 4}px` }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-mono font-bold text-white">
                                                        {formatDuration(sub.duration_seconds)}
                                                    </p>
                                                    <p className="text-xs text-zinc-400">{formatFileSize(sub.file_size)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Image preview */}
                                    {sub.image_url && (
                                        <div className="rounded-xl overflow-hidden border border-white/10">
                                            <img src={sub.image_url} alt="submission" className="w-full h-40 object-cover" />
                                        </div>
                                    )}

                                    {/* Auto-validation warnings */}
                                    {sub.validation_errors && sub.validation_errors.length > 0 && (
                                        <div className="flex items-start gap-2 bg-amber-900/10 border border-amber-900/30 rounded-xl p-3">
                                            <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-amber-400 mb-1">Auto-Validation Warnings</p>
                                                {sub.validation_errors.map((w, i) => (
                                                    <p key={i} className="text-xs text-amber-300">{w}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons - only on pending */}
                                    {sub.status === 'pending_validation' && (
                                        <div className="flex gap-3 pt-1">
                                            <Button
                                                onClick={() => handleApprove(sub.id)}
                                                isLoading={processingId === sub.id}
                                                disabled={!!processingId}
                                                className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 text-white text-sm"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1.5" /> Approve
                                            </Button>
                                            <Button
                                                onClick={() => setRejectDialog({ id: sub.id })}
                                                disabled={!!processingId}
                                                variant="outline"
                                                className="flex-1 h-10 border-red-900 text-red-400 hover:bg-red-900/20 text-sm"
                                            >
                                                <XCircle className="h-4 w-4 mr-1.5" /> Reject
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reject Dialog */}
            {rejectDialog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-white mb-1">Reject Submission</h3>
                            <p className="text-sm text-zinc-500 mb-5">Select a reason — this will be shown to the contributor.</p>

                            <div className="space-y-2 mb-4">
                                {REJECTION_REASONS.map(reason => (
                                    <label
                                        key={reason}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${rejectionReason === reason
                                            ? 'border-red-500 bg-red-900/10'
                                            : 'border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="reason"
                                            value={reason}
                                            checked={rejectionReason === reason}
                                            onChange={() => setRejectionReason(reason)}
                                            className="accent-red-600"
                                        />
                                        <span className="text-sm text-zinc-300">{reason}</span>
                                    </label>
                                ))}
                            </div>

                            {rejectionReason === 'Other' && (
                                <textarea
                                    value={customReason}
                                    onChange={e => setCustomReason(e.target.value)}
                                    placeholder="Describe the issue..."
                                    className="w-full p-3 rounded-xl border border-white/10 bg-black/20 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none h-20"
                                />
                            )}

                            <div className="flex gap-3 mt-5">
                                <Button
                                    variant="ghost"
                                    onClick={() => { setRejectDialog(null); setRejectionReason(REJECTION_REASONS[0]); setCustomReason(''); }}
                                    className="flex-1 h-10"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleReject}
                                    isLoading={processingId === rejectDialog.id}
                                    className="flex-1 h-10 bg-red-600 hover:bg-red-500 border-red-500/50 text-white"
                                >
                                    Confirm Reject
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
