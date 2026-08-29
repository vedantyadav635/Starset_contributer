import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Mic,
  Square,
  Check,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Database,
  Lock,
  Cpu,
  Camera,
  RotateCcw,
} from 'lucide-react';

import { Task, TaskType } from '../types';
import { Button } from '../components/Button';
import { Waveform } from '../components/Waveform';
import { supabase } from '../supabaseClient';
import { API_ENDPOINTS } from '../config/api';
import { cn } from '../lib/utils';

interface TaskExecutionProps {
  task: Task;
  onBack: () => void;
  onComplete: () => void;
}

type Step = 'brief' | 'consent' | 'execute' | 'submitted';

const STEPS: { id: Step; label: string }[] = [
  { id: 'brief', label: 'Brief' },
  { id: 'consent', label: 'Consent' },
  { id: 'execute', label: 'Record' },
  { id: 'submitted', label: 'Submitted' },
];

/* ═══════════════════════ Step rail ═══════════════════════ */

const StepRail: React.FC<{ current: Step }> = ({ current }) => {
  const index = STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="flex items-center gap-2 overflow-x-auto no-scrollbar" aria-label="Task progress">
      {STEPS.map((step, i) => {
        const state = i < index ? 'done' : i === index ? 'current' : 'todo';
        return (
          <li key={step.id} className="flex flex-none items-center gap-2">
            <span
              className={cn(
                'flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
                state === 'current' && 'border-signal bg-signal-soft text-signal',
                state === 'done' && 'border-line bg-surface text-body',
                state === 'todo' && 'border-line bg-surface text-faint',
              )}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              {state === 'done'
                ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                : <span className="font-mono text-[0.6875rem]">{String(i + 1).padStart(2, "0")}</span>}
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="h-px w-4 flex-none bg-line sm:w-6" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
};

/* ═══════════════════════ Playlist subtask recorder ═══════════════════════ */

const SubtaskAudioRecorder = ({
  onRecord,
  onClear,
  audioBlob,
  seed,
}: {
  onRecord: (blob: Blob) => void;
  onClear: () => void;
  audioBlob: Blob | null;
  seed: string;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecord(blob);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert('Could not access the microphone. Check your browser permissions.');
    }
  };

  const stop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  if (audioBlob) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="tag tag-ok">
          <CheckCircle2 className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
          Recorded
        </span>
        <div className="min-w-[8rem] flex-1">
          <Waveform seed={seed} bars={36} height={20} color="var(--ok)" />
        </div>
        <Button size="sm" variant="ghost" onClick={onClear}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          Retake
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {isRecording ? (
        <>
          <button
            type="button"
            onClick={stop}
            aria-label="Stop recording"
            className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-line bg-surface text-ink transition-transform active:scale-95"
          >
            <Square className="h-4 w-4 fill-current" strokeWidth={2} aria-hidden="true" />
          </button>
          <div className="min-w-[8rem] flex-1">
            <Waveform seed={seed} bars={36} height={22} live color="var(--danger)" />
          </div>
          <span className="flex flex-none items-center gap-2">
            <span className="rec-dot" aria-hidden="true" />
            <span className="t-meta">Recording</span>
          </span>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={start}
            aria-label="Start recording this step"
            className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[var(--danger)] text-white transition-transform active:scale-95"
          >
            <Mic className="h-4.5 w-4.5" strokeWidth={2} aria-hidden="true" />
          </button>
          <span className="text-sm text-body">Tap to record this step</span>
        </>
      )}
    </div>
  );
};

/* ═══════════════════════ Main ═══════════════════════ */

export const TaskExecution: React.FC<TaskExecutionProps> = ({ task, onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('brief');

  // Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Text / survey state
  const [textInput, setTextInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Playlist state
  const [playlistAnswers, setPlaylistAnswers] = useState<Record<number, string | Blob>>({});

  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const timerRef = useRef<number | null>(null);

  const getSupportedMimeType = (): string => {
    const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
    return types.find((t) => MediaRecorder.isTypeSupported(t)) || '';
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const backendReadyRef = useRef(false);
  useEffect(() => {
    import('../config/api').then(({ API_URL }) => {
      fetch(`${API_URL}/health`)
        .then((r) => { if (r.ok) backendReadyRef.current = true; })
        .catch(() => { });
    });
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });

      audioChunksRef.current = [];
      const suggestedMimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(
        stream,
        suggestedMimeType ? { mimeType: suggestedMimeType } : undefined,
      );
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const actualMimeType = mediaRecorder.mimeType || suggestedMimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: actualMimeType });

        if (blob.size === 0) {
          console.error('Recorded blob is empty');
          alert('No audio was captured. Check your microphone settings and try again.');
          setHasRecorded(false);
          setIsRecording(false);
          return;
        }

        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setHasRecorded(true);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setHasRecorded(false);
      setRecordingTime(0);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access the microphone. Please allow microphone permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.volume = 1.0;
      audioRef.current.load();
    }
  }, [audioUrl]);

  const handlePlayAudio = async () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1.0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Playback failed:', error);
          setIsPlaying(false);
          alert('Playback failed. Try again, or check your browser audio permissions.');
        });
      }
    } catch (err) {
      console.error('Error in handlePlayAudio:', err);
      setIsPlaying(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch (err) {
      console.error('Error accessing camera', err);
      alert('Could not access the camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        setCapturedImage(canvasRef.current.toDataURL('image/png'));
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const fetchWithRetry = async (url: string, options: RequestInit): Promise<Response> => {
    try {
      const { fetchApi } = await import('../lib/api');
      return await fetchApi(url, { ...options, signal: AbortSignal.timeout(30000) });
    } catch (err) {
      console.warn('Backend cold-starting, retrying in 15s…');
      setSubmitStatus('Waking the server (15s)…');
      await new Promise((r) => setTimeout(r, 15000));
      setSubmitStatus('Retrying submission…');
      const { fetchApi } = await import('../lib/api');
      return fetchApi(url, { ...options, signal: AbortSignal.timeout(60000) });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('Uploading…');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('You are not signed in. Please sign in again.');
        setIsSubmitting(false);
        setSubmitStatus('');
        return;
      }

      if (task.type === TaskType.AUDIO_COLLECTION && audioBlob) {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('taskId', task.id);
        formData.append('userId', user.id);
        formData.append('duration', recordingTime.toString());

        const response = await fetchWithRetry(API_ENDPOINTS.SUBMIT_AUDIO, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          if (response.status === 422 && error.validationErrors?.length > 0) {
            throw new Error(error.validationErrors[0]);
          }
          throw new Error(error.error || 'Failed to submit audio');
        }
      }

      else if (task.type === TaskType.IMAGE_COLLECTION && capturedImage) {
        const base64Response = await fetch(capturedImage);
        const imageBlob = await base64Response.blob();

        const formData = new FormData();
        formData.append('image', imageBlob, 'capture.png');
        formData.append('taskId', task.id);
        formData.append('userId', user.id);

        const response = await fetchWithRetry(API_ENDPOINTS.SUBMIT_IMAGE, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to submit image');
        }
      }

      else if (task.type === TaskType.PLAYLIST) {
        const formData = new FormData();
        formData.append('taskId', task.id);
        formData.append('userId', user.id);

        const textPayload: Record<string, string> = {};

        Object.entries(playlistAnswers).forEach(([idx, val]) => {
          if (val instanceof Blob) {
            formData.append(`audio_${idx}`, val, `audio_${idx}.webm`);
          } else {
            textPayload[idx] = val as string;
          }
        });

        formData.append('textContent', JSON.stringify(textPayload));

        const response = await fetchWithRetry(API_ENDPOINTS.SUBMIT_PLAYLIST, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to submit playlist');
        }
      }

      else if (
        task.type === TaskType.IMAGE_LABELING ||
        task.type === TaskType.TEXT_ANNOTATION ||
        task.type === TaskType.SURVEY
      ) {
        const response = await fetchWithRetry(API_ENDPOINTS.SUBMIT_TEXT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: task.id,
            userId: user.id,
            textContent: textInput || null,
            selectedOption: selectedOption || null,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to submit text');
        }
      }

      setIsSubmitting(false);
      setSubmitStatus('');
      setStep('submitted');
    } catch (error: any) {
      console.error('Submission error:', error);
      alert(`Submission failed: ${error.message}`);
      setIsSubmitting(false);
      setSubmitStatus('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  let parsedPlaylist: { title: string; prompt: string }[] = [];
  if (task.type === TaskType.PLAYLIST) {
    try {
      parsedPlaylist = JSON.parse(task.prompt);
    } catch (e) {
      console.error('Failed to parse playlist');
    }
  }

  const answeredPlaylistCount = Object.keys(playlistAnswers).filter((k) => {
    const val = playlistAnswers[Number(k)];
    return val instanceof Blob || (typeof val === 'string' && val.trim().length > 0);
  }).length;

  const isSubmitDisabled = () => {
    if (isSubmitting) return true;
    if (task.type === TaskType.AUDIO_COLLECTION) return !hasRecorded;
    if (task.type === TaskType.IMAGE_COLLECTION) return !capturedImage;
    if (task.type === TaskType.IMAGE_LABELING) return textInput.length < 5;
    if (task.type === TaskType.TEXT_ANNOTATION || task.type === TaskType.SURVEY) return !selectedOption;
    if (task.type === TaskType.PLAYLIST) return answeredPlaylistCount < parsedPlaylist.length;
    return true;
  };

  const completionPercent = (() => {
    if (task.type === TaskType.PLAYLIST && parsedPlaylist.length > 0) {
      return Math.round((answeredPlaylistCount / parsedPlaylist.length) * 100);
    }
    if (hasRecorded || capturedImage || textInput.trim().length > 0 || selectedOption) return 100;
    return 0;
  })();

  const resetInputs = () => {
    setHasRecorded(false);
    setRecordingTime(0);
    setTextInput('');
    setSelectedOption(null);
    setPlaylistAnswers({});
    setCapturedImage(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    stopCamera();
  };

  const qualityNote =
    task.type === TaskType.AUDIO_COLLECTION
      ? 'No background noise. Speak at a natural pace and read the script exactly as written.'
      : task.type === TaskType.IMAGE_COLLECTION
        ? 'The subject must be in focus, and lighting has to be good enough to make out detail.'
        : 'Accuracy against the brief is what gets judged.';

  /* ───────────────────────── STEP 1 · BRIEF ───────────────────────── */

  if (step === 'brief') {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <button type="button" onClick={onBack} className="link-arrow text-muted hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          Back to tasks
        </button>

        <StepRail current="brief" />

        <article className="panel overflow-hidden">
          {/* Header */}
          <header className="flex flex-col gap-5 border-b border-line p-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag tag-signal">{task.type}</span>
                <span className="tag">{task.language}</span>
                <span className="t-meta">#{task.id.slice(0, 8)}</span>
              </div>
              <h1 className="t-h3 mt-3">{task.title}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-body">
                <Clock className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} aria-hidden="true" />
                About {task.estimatedTimeSec} seconds
              </p>
            </div>

            <div className="flex-none rounded-md border border-line bg-paper-sunk px-5 py-4 sm:text-right">
              <p className="t-meta">Compensation</p>
              <p className="mt-1 font-display text-2xl font-semibold text-ink tnum">
                ₹{task.compensation.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-muted">If accepted</p>
            </div>
          </header>

          <div className="space-y-6 p-6">
            {/* Purpose */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-line bg-paper-sunk p-4">
                <p className="t-meta flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  AI capability
                </p>
                <p className="mt-2 text-sm text-ink">{task.aiCapability || 'Not specified'}</p>
              </div>
              <div className="rounded-md border border-line bg-paper-sunk p-4">
                <p className="t-meta flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  Data usage scope
                </p>
                <p className="mt-2 text-sm text-ink">{task.dataUsage || 'Not specified'}</p>
              </div>
            </div>

            {/* Instructions */}
            <section>
              <h2 className="t-h4">Instructions</h2>
              <p className="mt-3 whitespace-pre-line rounded-md border border-line bg-paper-sunk p-4 text-sm leading-relaxed text-body">
                {task.instructions}
              </p>
            </section>

            {/* Requirements */}
            {task.requirements?.some((r) => r && r !== 'NA') && (
              <section>
                <h2 className="t-meta">Requirements</h2>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {task.requirements.filter((r) => r && r !== 'NA').map((req) => (
                    <span key={req} className="tag">{req}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Quality bar */}
            <div className="flex gap-3.5 rounded-md border border-[color-mix(in_srgb,var(--warn)_28%,transparent)] bg-warn-soft p-4">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 flex-none text-[color:var(--warn)]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-ink">Quality standard for this task</p>
                <p className="mt-1 text-sm text-body">{qualityNote}</p>
              </div>
            </div>
          </div>

          <footer className="flex flex-col gap-3 border-t border-line p-6 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={onBack}>Cancel</Button>
            <Button size="lg" onClick={() => setStep('consent')}>
              Continue to consent
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Button>
          </footer>
        </article>
      </div>
    );
  }

  /* ───────────────────────── STEP 2 · CONSENT ───────────────────────── */

  if (step === 'consent') {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <button type="button" onClick={() => setStep('brief')} className="link-arrow text-muted hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          Back to brief
        </button>

        <StepRail current="consent" />

        <article className="panel overflow-hidden">
          <header className="border-b border-line p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-signal-soft text-signal">
              <Lock className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h1 className="t-h3 mt-4">Consent for this task</h1>
            <p className="mt-2 text-body">
              Read this before recording. It applies to this task specifically, not to your account
              in general.
            </p>
          </header>

          <div className="p-6">
            <div className="rounded-md border border-line bg-paper-sunk p-5">
              <p className="text-sm text-body">
                You are contributing data toward:{' '}
                <span className="font-medium text-ink">{task.aiCapability || 'the capability described in the brief'}</span>.
              </p>

              <ul className="mt-4 space-y-3 border-t border-line pt-4">
                {[
                  'No personal identity data is collected as part of this recording.',
                  'Your submission is validated automatically and reviewed by a person before acceptance.',
                  'Accepted submissions are compensated and transfer usage rights to Starset.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-body">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-signal" strokeWidth={2} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <label
              htmlFor="consent"
              className={cn(
                'mt-5 flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-colors',
                consentGiven ? 'border-signal bg-signal-soft' : 'border-line hover:border-line-strong',
              )}
            >
              <input
                id="consent"
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-none"
              />
              <span className="text-sm text-ink">
                I confirm this contribution is accurate, produced by me, and I accept the terms above.
              </span>
            </label>
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-line p-6 sm:flex-row sm:justify-between">
            <Button variant="ghost" onClick={() => setStep('brief')}>Back</Button>
            <Button size="lg" disabled={!consentGiven} onClick={() => setStep('execute')}>
              Start the task
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Button>
          </footer>
        </article>
      </div>
    );
  }

  /* ───────────────────────── STEP 4 · SUBMITTED ───────────────────────── */

  if (step === 'submitted') {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <StepRail current="submitted" />

        <article className="panel overflow-hidden">
          <header className="border-b border-line p-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ok-soft text-[color:var(--ok)]">
              <CheckCircle2 className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
            </span>
            <h1 className="t-h3 mt-5">Submission received</h1>
            <p className="mx-auto mt-2 max-w-md text-body">
              It is queued for validation. Automated checks run first, then a reviewer listens
              against the prompt.
            </p>
          </header>

          <div className="px-6 py-2">
            <dl className="speclist">
              <div className="specrow">
                <dt>Task</dt>
                <dd className="max-w-[60%] truncate">{task.title}</dd>
              </div>
              <div className="specrow">
                <dt>Reference</dt>
                <dd className="font-mono text-xs">{task.id}</dd>
              </div>
              <div className="specrow">
                <dt>Review time</dt>
                <dd>Typically within 24 hours</dd>
              </div>
              <div className="specrow">
                <dt>Pending compensation</dt>
                <dd className="tnum">₹{task.compensation.toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-line bg-paper-sunk px-6 py-4">
            <p className="text-xs text-body">
              If it is rejected you will see the specific reason, so the next take can fix it.
            </p>
          </div>

          <footer className="border-t border-line p-6">
            <Button size="lg" block onClick={onComplete}>
              Back to tasks
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Button>
          </footer>
        </article>
      </div>
    );
  }

  /* ───────────────────────── STEP 3 · EXECUTE ───────────────────────── */

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <button type="button" onClick={() => setStep('consent')} className="link-arrow text-muted hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        Back
      </button>

      <StepRail current="execute" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        {/* ── Context rail ── */}
        <aside className="panel h-max overflow-hidden lg:sticky lg:top-4">
          <div className="panel-head">
            <h2 className="text-sm font-semibold text-ink">Context</h2>
            <span className="t-meta">{task.type}</span>
          </div>

          {task.imageUrl && task.type === TaskType.AUDIO_COLLECTION && (
            <div className="border-b border-line">
              <img src={task.imageUrl} alt="" className="h-36 w-full object-cover" loading="lazy" />
            </div>
          )}

          <div className="panel-body space-y-4">
            <div>
              <p className="t-meta">Task</p>
              <p className="mt-1 text-sm text-ink">{task.title}</p>
            </div>

            <div>
              <p className="t-meta">Requirement</p>
              <p className="mt-1 text-sm text-body">{qualityNote}</p>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <span className="t-meta">Completion</span>
                <span className="t-meta tnum">{completionPercent}%</span>
              </div>
              <div
                className="meter mt-2"
                role="progressbar"
                aria-valuenow={completionPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Task completion"
              >
                <span style={{ width: `${completionPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="border-t border-line bg-paper-sunk px-4 py-3">
            <div className="flex items-baseline justify-between">
              <span className="t-meta">Compensation</span>
              <span className="font-display text-base font-semibold text-ink tnum">
                ₹{task.compensation.toFixed(2)}
              </span>
            </div>
          </div>
        </aside>

        {/* ── Work area ── */}
        <section className="panel overflow-hidden">
          {/* ═══ AUDIO ═══ */}
          {task.type === TaskType.AUDIO_COLLECTION && (
            <>
              <div className="panel-head">
                <h2 className="text-sm font-semibold text-ink">Record</h2>
                <span className="t-mono text-ink">{formatTime(recordingTime)}</span>
              </div>

              <div className="panel-body">
                <div className="rounded-md border border-line bg-paper-sunk p-5 sm:p-7">
                  <p className="t-meta">Script</p>
                  <p className="mt-3 font-display text-xl leading-snug text-ink sm:text-2xl">
                    &ldquo;{task.prompt}&rdquo;
                  </p>
                </div>

                {/* Transport */}
                <div className="mt-8 flex flex-col items-center gap-6">
                  <div className="w-full max-w-xl">
                    <Waveform
                      seed={task.id}
                      bars={72}
                      height={64}
                      live={isRecording}
                      color={isRecording ? 'var(--danger)' : hasRecorded ? 'var(--signal)' : 'var(--line-strong)'}
                    />
                  </div>

                  {!isRecording && !hasRecorded && (
                    <div className="flex flex-col items-center gap-3">
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        aria-label="Start recording"
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--danger)] text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                      >
                        <Mic className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                      </button>
                      <p className="text-sm text-body">Tap to start recording</p>
                    </div>
                  )}

                  {isRecording && (
                    <div className="flex flex-col items-center gap-3">
                      <button
                        type="button"
                        onClick={handleStopRecording}
                        aria-label="Stop recording"
                        className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-sm transition-transform hover:scale-105 active:scale-95"
                      >
                        <Square className="h-5 w-5 fill-current" strokeWidth={2} aria-hidden="true" />
                      </button>
                      <p className="flex items-center gap-2">
                        <span className="rec-dot" aria-hidden="true" />
                        <span className="t-meta">Recording — tap to stop</span>
                      </p>
                    </div>
                  )}

                  {hasRecorded && !isRecording && (
                    <div className="w-full max-w-xl rounded-md border border-line bg-paper-sunk p-4">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={handlePlayAudio}
                          aria-label={isPlaying ? 'Pause playback' : 'Play your recording'}
                          className={cn(
                            'flex h-11 w-11 flex-none items-center justify-center rounded-full border transition-colors',
                            isPlaying
                              ? 'border-signal bg-signal text-white'
                              : 'border-line bg-surface text-ink hover:border-line-strong',
                          )}
                        >
                          {isPlaying
                            ? <Pause className="h-4.5 w-4.5" strokeWidth={2} aria-hidden="true" />
                            : <Play className="ml-0.5 h-4.5 w-4.5" strokeWidth={2} aria-hidden="true" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-ink">Your take</p>
                          <p className="t-meta mt-0.5">Listen back before you submit</p>
                        </div>

                        <span className="t-mono flex-none text-ink">{formatTime(recordingTime)}</span>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setHasRecorded(false);
                            setAudioBlob(null);
                            setAudioUrl(null);
                            setRecordingTime(0);
                            setIsPlaying(false);
                          }}
                        >
                          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                          Retake
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ═══ IMAGE ═══ */}
          {task.type === TaskType.IMAGE_COLLECTION && (
            <>
              <div className="panel-head">
                <h2 className="text-sm font-semibold text-ink">Capture</h2>
                <span className="t-meta">{capturedImage ? 'Captured' : 'Camera'}</span>
              </div>

              <div className="panel-body">
                <div className="rounded-md border border-line bg-paper-sunk p-5">
                  <p className="t-meta">Brief</p>
                  <p className="mt-2 text-ink">{task.prompt}</p>
                </div>

                <div className="mt-6 overflow-hidden rounded-md border border-line bg-paper-sunk">
                  <div className="relative aspect-[4/3] w-full">
                    {!capturedImage ? (
                      !isCameraActive ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-muted">
                            <Camera className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                          </span>
                          <p className="max-w-xs text-sm text-body">
                            The photo is taken in the app — your gallery is not used.
                          </p>
                          <Button onClick={startCamera}>Enable camera</Button>
                        </div>
                      ) : (
                        <>
                          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                          <div className="absolute inset-x-0 bottom-5 flex justify-center">
                            <button
                              type="button"
                              onClick={captureImage}
                              aria-label="Take photo"
                              className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-white/20 backdrop-blur transition-transform active:scale-95"
                            >
                              <span className="h-10 w-10 rounded-full bg-white" />
                            </button>
                          </div>
                        </>
                      )
                    ) : (
                      <>
                        <img src={capturedImage} alt="Your capture" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={retakePhoto}
                          className="btn btn-sm btn-secondary absolute bottom-4 right-4"
                        >
                          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                          Retake
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ═══ TEXT / LABEL / EVALUATION ═══ */}
          {(task.type === TaskType.IMAGE_LABELING ||
            task.type === TaskType.TEXT_ANNOTATION ||
            task.type === TaskType.SURVEY) && (
            <>
              <div className="panel-head">
                <h2 className="text-sm font-semibold text-ink">
                  {task.options ? 'Choose an answer' : 'Write your response'}
                </h2>
              </div>

              <div className="panel-body">
                <div className="rounded-md border border-line bg-paper-sunk p-5">
                  <p className="t-meta">Prompt</p>
                  <p className="mt-3 text-lg leading-relaxed text-ink">{task.prompt}</p>
                </div>

                {task.options ? (
                  <fieldset className="mt-6">
                    <legend className="sr-only">Select an answer</legend>
                    <div className="grid gap-2">
                      {task.options.map((opt) => {
                        const selected = selectedOption === opt;
                        return (
                          <label
                            key={opt}
                            className={cn(
                              'flex cursor-pointer items-center justify-between gap-4 rounded-md border p-4 transition-colors',
                              selected ? 'border-signal bg-signal-soft' : 'border-line hover:border-line-strong',
                            )}
                          >
                            <span className={cn('text-sm', selected ? 'font-medium text-ink' : 'text-body')}>
                              {opt}
                            </span>
                            <input
                              type="radio"
                              name="task-option"
                              className="h-4 w-4 flex-none"
                              checked={selected}
                              onChange={() => setSelectedOption(opt)}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ) : (
                  <div className="mt-6">
                    <label className="field-label" htmlFor="task-text">Your response</label>
                    <textarea
                      id="task-text"
                      className="field min-h-[10rem]"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Be specific. A short accurate description beats a long vague one."
                    />
                    <p className="field-hint">
                      {textInput.length < 5
                        ? 'At least 5 characters required.'
                        : `${textInput.length} characters`}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ═══ PLAYLIST ═══ */}
          {task.type === TaskType.PLAYLIST && (
            <>
              <div className="panel-head">
                <h2 className="text-sm font-semibold text-ink">Steps</h2>
                <span className="t-meta tnum">
                  {answeredPlaylistCount}/{parsedPlaylist.length} recorded
                </span>
              </div>

              <div className="panel-body">
                {parsedPlaylist.length > 0 ? (
                  <ol className="grid gap-3">
                    {parsedPlaylist.map((subtask, idx) => {
                      const answered = playlistAnswers[idx] instanceof Blob;
                      return (
                        <li
                          key={idx}
                          className={cn(
                            'rounded-md border p-5 transition-colors',
                            answered ? 'border-[color-mix(in_srgb,var(--ok)_35%,transparent)] bg-ok-soft' : 'border-line bg-paper-sunk',
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-line bg-surface font-mono text-[0.6875rem] text-ink">
                              {idx + 1}
                            </span>
                            <h3 className="text-sm font-semibold text-ink">{subtask.title}</h3>
                          </div>

                          <p className="mt-2.5 text-sm leading-relaxed text-body">{subtask.prompt}</p>

                          <div className="mt-4 border-t border-line-faint pt-4">
                            <SubtaskAudioRecorder
                              seed={`${task.id}-${idx}`}
                              audioBlob={playlistAnswers[idx] instanceof Blob ? (playlistAnswers[idx] as Blob) : null}
                              onRecord={(b) => setPlaylistAnswers((prev) => ({ ...prev, [idx]: b }))}
                              onClear={() =>
                                setPlaylistAnswers((prev) => {
                                  const next = { ...prev };
                                  delete next[idx];
                                  return next;
                                })
                              }
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <div className="rounded-md border border-line bg-paper-sunk p-8 text-center">
                    <p className="text-sm text-body">This playlist has no steps configured.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Submit bar ── */}
          <footer className="flex flex-col-reverse gap-3 border-t border-line p-5 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" onClick={resetInputs} disabled={isSubmitting}>
              <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              Reset
            </Button>

            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-4">
              <p className="flex items-center gap-1.5 text-xs text-muted sm:justify-end">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                Checked automatically, then reviewed
              </p>
              <Button
                size="lg"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitDisabled()}
              >
                {isSubmitting ? (submitStatus || 'Submitting…') : 'Submit contribution'}
                {!isSubmitting && <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
              </Button>
            </div>
          </footer>
        </section>
      </div>

      {/* Hidden capture/playback elements */}
      <canvas ref={canvasRef} className="hidden" />
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => console.error('Audio element error:', e)}
        className="hidden"
        preload="auto"
        playsInline
      />
    </div>
  );
};
