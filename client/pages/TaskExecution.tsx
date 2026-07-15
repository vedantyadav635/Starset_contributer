import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskType } from '../types';
import { Button } from '../components/Button';
import { AlertTriangle, Mic, Square, Check, ArrowLeft, Play, Info, ShieldCheck, Clock, CheckCircle, Database, Lock, Cpu, Camera, RefreshCcw } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { API_ENDPOINTS } from '../config/api';

interface TaskExecutionProps {
  task: Task;
  onBack: () => void;
  onComplete: () => void;
}

type Step = 'brief' | 'consent' | 'execute' | 'submitted';

const SubtaskAudioRecorder = ({ onRecord, onClear, audioBlob }: { onRecord: (blob: Blob) => void, onClear: () => void, audioBlob: Blob | null }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecord(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert("Could not access microphone.");
    }
  };

  const stop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      {!audioBlob ? (
        !isRecording ? (
           <button onClick={start} className="group relative h-16 w-16 md:h-20 md:w-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-500/20 transition-all hover:scale-110">
             <Mic className="h-6 w-6 md:h-8 md:w-8" />
           </button>
        ) : (
           <div className="flex flex-col items-center gap-3">
             <button onClick={stop} className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white text-black flex items-center justify-center shadow-xl transition-all hover:scale-105">
               <Square className="h-5 w-5 md:h-6 md:w-6 fill-current" />
             </button>
             <div className="flex items-center gap-1.5 text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">
               Recording...
             </div>
           </div>
        )
      ) : (
        <div className="flex flex-col items-center gap-3">
           <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-full font-bold text-sm">
             <CheckCircle className="h-4 w-4" /> Audio Recorded
           </div>
           <button onClick={onClear} className="text-stone-400 hover:text-red-400 text-xs font-bold uppercase tracking-wider underline underline-offset-4 transition-colors">Retake Audio</button>
        </div>
      )}
    </div>
  );
};

export const TaskExecution: React.FC<TaskExecutionProps> = ({ task, onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('brief');

  // Audio State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Text/Survey State
  const [textInput, setTextInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Playlist State
  const [playlistAnswers, setPlaylistAnswers] = useState<Record<number, string | Blob>>({});

  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const timerRef = useRef<number | null>(null);

  const getSupportedMimeType = (): string => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];
    return types.find(t => MediaRecorder.isTypeSupported(t)) || '';
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const backendReadyRef = useRef(false);
  useEffect(() => {
    import('../config/api').then(({ API_URL }) => {
      fetch(`${API_URL}/health`)
        .then(r => { if (r.ok) backendReadyRef.current = true; })
        .catch(() => { });
    });
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      audioChunksRef.current = [];
      const suggestedMimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, suggestedMimeType ? { mimeType: suggestedMimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const actualMimeType = mediaRecorder.mimeType || suggestedMimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: actualMimeType });

        if (blob.size === 0) {
          console.error("❌ Recorded blob is empty!");
          alert("No audio data was captured. Please check your microphone settings and try again.");
          setHasRecorded(false);
          setIsRecording(false);
          return;
        }

        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioUrl(url);
        setHasRecorded(true);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setHasRecorded(false);
      setRecordingTime(0);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please allow microphone permissions.');
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
    if (!audioRef.current || !audioUrl) {
      console.warn("⚠️ Cannot play: audioRef or audioUrl is missing", { hasRef: !!audioRef.current, hasUrl: !!audioUrl });
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        // Reset to start and ensure volume is max
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 1.0;

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("❌ Playback failed:", error);
            setIsPlaying(false);
            // Fallback: If direct play fails, it might be a user gesture issue or codec issue
            alert("Playback failed. Please try again or check your browser's audio permissions.");
          });
        }
      } catch (err: any) {
        console.error('❌ Error in handlePlayAudio:', err);
        setIsPlaying(false);
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera", err);
      alert("Could not access camera. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
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
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setCapturedImage(dataUrl);
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
      const res = await fetchApi(url, { ...options, signal: AbortSignal.timeout(30000) });
      return res;
    } catch (err) {
      console.warn('⏳ Backend cold-starting, retrying in 15s...');
      setSubmitStatus('Backend waking up (15s)...');
      await new Promise(r => setTimeout(r, 15000));
      setSubmitStatus('Retrying submission...');
      const { fetchApi } = await import('../lib/api');
      return fetchApi(url, { ...options, signal: AbortSignal.timeout(60000) });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('Uploading...');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('User not authenticated. Please log in again.');
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

      else if (task.type === TaskType.IMAGE_LABELING ||
        task.type === TaskType.TEXT_ANNOTATION ||
        task.type === TaskType.SURVEY) {
        
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
      console.error('❌ Submission error:', error);
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
      console.error("Failed to parse playlist");
    }
  }

  const isSubmitDisabled = () => {
    if (isSubmitting) return true;
    if (task.type === TaskType.AUDIO_COLLECTION) return !hasRecorded;
    if (task.type === TaskType.IMAGE_COLLECTION) return !capturedImage;
    if (task.type === TaskType.IMAGE_LABELING) return textInput.length < 5;
    if (task.type === TaskType.TEXT_ANNOTATION || task.type === TaskType.SURVEY) return !selectedOption;
    if (task.type === TaskType.PLAYLIST) {
      const answeredCount = Object.keys(playlistAnswers).filter(k => {
        const val = playlistAnswers[Number(k)];
        return val instanceof Blob || (typeof val === 'string' && val.trim().length > 0);
      }).length;
      return answeredCount < parsedPlaylist.length;
    }
    return true;
  };

  // Step 1: Briefing & Instructions
  if (step === 'brief') {
    return (
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={onBack} className="flex items-center text-sm font-medium text-stone-500 hover:text-slate-900 dark:text-white mb-3 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Console
        </button>

        <div className="bg-slate-100 dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl shadow-none overflow-hidden">
          <div className="px-5 md:px-8 py-4 md:py-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-100 dark:bg-white/5 gap-4">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-500/20">Active Operation</span>
                <span className="font-mono text-[10px] text-stone-400"># {task.id.slice(0, 8)}</span>
              </div>
              <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">{task.title}</h2>
              <div className="flex flex-wrap items-center mt-3 gap-2 text-sm text-stone-500">
                <span className="flex items-center bg-white dark:bg-black/40 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm font-bold text-xs text-slate-700 dark:text-white"><Info className="h-3.5 w-3.5 mr-2 text-blue-500 dark:text-blue-400" /> {task.type}</span>
                <span className="flex items-center bg-white dark:bg-black/40 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm font-bold text-xs text-slate-700 dark:text-white"><Clock className="h-3.5 w-3.5 mr-2 text-stone-500 dark:text-stone-400" /> {task.estimatedTimeSec}s Est.</span>
              </div>
            </div>
            <div className="flex items-center md:flex-col justify-between w-full md:w-auto md:text-right border-t md:border-t-0 border-slate-200 dark:border-white/10 pt-4 md:pt-0">
              <div className="text-[10px] text-slate-600 dark:text-zinc-400 font-black uppercase tracking-[0.2em] mb-1">Compensation</div>
              <div className="text-2xl md:text-4xl font-black text-blue-400 drop-shadow-sm">₹{task.compensation.toFixed(2)}</div>
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-4 md:space-y-5">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 md:p-4 bg-blue-900/10 rounded-xl border border-blue-900/20">
                <div className="flex items-center gap-2 mb-2 text-blue-300 font-bold text-sm uppercase tracking-wide">
                  <Cpu className="h-4 w-4" /> AI Capability Purpose
                </div>
                <p className="text-blue-200 text-sm leading-relaxed">{task.aiCapability}</p>
              </div>
              <div className="p-3 md:p-4 bg-purple-900/10 rounded-xl border border-purple-900/20">
                <div className="flex items-center gap-2 mb-2 text-purple-300 font-bold text-sm uppercase tracking-wide">
                  <Database className="h-4 w-4" /> Data Usage Scope
                </div>
                <p className="text-purple-200 text-sm leading-relaxed">{task.dataUsage}</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-2">Operational Instructions</h3>
              <p className="text-stone-300 leading-relaxed bg-slate-100 dark:bg-white/5 p-3 md:p-4 rounded-xl border border-white/5 font-mono text-sm">{task.instructions}</p>
            </div>

            <div className="bg-amber-900/10 border border-amber-900/20 rounded-xl p-3 md:p-4 flex flex-col md:flex-row gap-3">
              <div className="h-10 w-10 bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="text-amber-200">
                <p className="font-bold text-base mb-1">Quality Standards</p>
                <p className="opacity-90 leading-relaxed text-sm">
                  {task.type === TaskType.AUDIO_COLLECTION ? "Strict Requirement: No background noise. Natural speaking pace." :
                    task.type === TaskType.IMAGE_COLLECTION ? "Ensure subject is in focus. Good lighting is mandatory." :
                      "Accuracy is critical."}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-white/10">
              <Button size="lg" onClick={() => setStep('consent')} className="w-full md:w-auto px-8 h-12 text-base">Proceed to Consent <ArrowLeft className="ml-2 h-5 w-5 rotate-180" /></Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Consent
  if (step === 'consent') {
    return (
      <div className="max-w-2xl mx-auto mt-4 md:mt-12 animate-in zoom-in-95 duration-300">
        <div className="bg-slate-100 dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-none p-6 md:p-12">
          <div className="flex items-center justify-center h-16 w-16 md:h-20 md:w-20 bg-blue-900/20 rounded-full mx-auto mb-6 md:mb-8">
            <Lock className="h-8 w-8 md:h-10 md:w-10 text-blue-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 text-center">Protocol Acceptance</h2>
          <p className="text-stone-500 text-center mb-8 md:mb-10 text-base md:text-lg">Confirm understanding of data handling protocols.</p>

          <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-white/5 mb-8 md:mb-10 text-sm md:text-base text-stone-300 space-y-5">
            <p className="leading-relaxed font-bold">
              You are contributing structured data for: <span className="text-blue-400">{task.aiCapability}</span>.
            </p>
            <div className="h-px bg-white/10"></div>
            <ul className="space-y-3">
              <li className="flex items-start"><Check className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" /> No personal identity data is collected.</li>
              <li className="flex items-start"><Check className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" /> Inputs are validated before acceptance.</li>
              <li className="flex items-start"><Check className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" /> Compensation transfers usage rights to Starset.</li>
            </ul>
          </div>

          <div className="flex items-start md:items-center mb-8 md:mb-10 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 p-5 rounded-xl cursor-pointer hover:border-blue-500 transition-colors" onClick={() => setConsentGiven(!consentGiven)}>
            <div className="flex items-center h-6">
              <input
                id="consent"
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="h-5 w-5 md:h-6 md:w-6 text-blue-600 border-stone-300 rounded focus:ring-blue-600 transition-all"
              />
            </div>
            <div className="ml-4 text-sm md:text-base select-none">
              <label htmlFor="consent" className="font-medium text-slate-900 dark:text-white cursor-pointer">I confirm this data is accurate and generated by human effort.</label>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4">
            <Button variant="ghost" onClick={() => setStep('brief')} className="w-full md:w-auto">Back</Button>
            <Button disabled={!consentGiven} onClick={() => setStep('execute')} size="lg" className="w-full md:w-48 h-12">Initialize Task</Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Submitted
  if (step === 'submitted') {
    return (
      <div className="max-w-xl mx-auto mt-8 md:mt-16 animate-in zoom-in-95 duration-500">
        <div className="bg-slate-100 dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl p-8 md:p-12 text-center">
          <div className="h-24 w-24 md:h-28 md:w-28 bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 animate-in zoom-in duration-300">
            <CheckCircle className="h-12 w-12 md:h-14 md:w-14 text-emerald-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Contribution Received</h2>
          <p className="text-stone-300 mb-8 md:mb-12 max-w-md mx-auto leading-relaxed text-base md:text-lg">
            Your data has been securely logged and queued for validation.
          </p>

          <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-6 border border-white/5 mb-8 md:mb-10 text-left space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-500 font-medium">Operation ID</span>
              <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{task.id}</span>
            </div>
            <div className="h-px bg-white/10 w-full"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-500 font-medium flex items-center"><Clock className="h-4 w-4 mr-2" /> Validation SLA</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">~24 Hours</span>
            </div>
            <div className="h-px bg-white/10 w-full"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-500 font-medium">Pending Compensation</span>
              <span className="text-sm font-bold text-blue-400 bg-blue-900/20 px-3 py-1 rounded border border-blue-800">₹{task.compensation.toFixed(2)}</span>
            </div>
          </div>

          <Button onClick={onComplete} className="w-full h-14 text-lg" size="lg">Return to Console</Button>
        </div>
      </div>
    );
  }

  // Step 3: Execution
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="bg-slate-100 dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* Sidebar for Task Context */}
        <div className="w-full md:w-1/3 bg-slate-50 dark:bg-black/30 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10 p-6 md:p-8 flex flex-col order-1 md:order-1">
          {task.imageUrl && task.type === TaskType.AUDIO_COLLECTION && (
            <div className="w-full h-32 md:h-48 rounded-xl overflow-hidden mb-6 border border-slate-200 dark:border-white/10 shadow-sm hidden md:block">
              <img src={task.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <h3 className="font-bold text-slate-900 dark:text-white mb-2 md:mb-4 text-base md:text-lg">Operational Context</h3>
          <div className="space-y-4 text-sm text-stone-400 flex-1">
            <p className="text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-none">{task.title}</p>
            <div className="p-3 md:p-4 bg-slate-100 dark:bg-white/5 rounded-xl border border-white/5 text-xs md:text-sm shadow-sm">
              <strong>Requirement:</strong> {task.type === TaskType.AUDIO_COLLECTION ? "Speak clearly." : task.type === TaskType.IMAGE_COLLECTION ? "Good lighting required." : "Be descriptive."}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 hidden md:block">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Completion Status</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {(() => {
                  if (task.type === TaskType.PLAYLIST && parsedPlaylist.length > 0) {
                    const answeredCount = Object.keys(playlistAnswers).filter(k => {
                      const val = playlistAnswers[Number(k)];
                      return val instanceof Blob || (typeof val === 'string' && val.trim().length > 0);
                    }).length;
                    return Math.round((answeredCount / parsedPlaylist.length) * 100);
                  }
                  if (hasRecorded || capturedImage || (textInput.trim().length > 0) || selectedOption) return 100;
                  return 0;
                })()}%
              </span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(() => {
                  if (task.type === TaskType.PLAYLIST && parsedPlaylist.length > 0) {
                    const answeredCount = Object.keys(playlistAnswers).filter(k => {
                      const val = playlistAnswers[Number(k)];
                      return val instanceof Blob || (typeof val === 'string' && val.trim().length > 0);
                    }).length;
                    return Math.round((answeredCount / parsedPlaylist.length) * 100);
                  }
                  if (hasRecorded || capturedImage || (textInput.trim().length > 0) || selectedOption) return 100;
                  return 0;
              })()}%` }}></div>
            </div>
          </div>
        </div>

        {/* Main Execution Area */}
        <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center relative bg-slate-100 dark:bg-zinc-900 order-2 md:order-2">

          {/* AUDIO TASK UI */}
          {task.type === TaskType.AUDIO_COLLECTION && (
            <>
              <div className="absolute top-4 right-4 md:top-8 md:right-10 text-right">
                <div className={`text-4xl md:text-5xl font-mono font-light tracking-tighter transition-colors ${isRecording ? 'text-slate-900 dark:text-white' : 'text-zinc-700'}`}>
                  {formatTime(recordingTime)}
                </div>
                {isRecording && (
                  <div className="flex items-center justify-center gap-1.5 h-6 mb-4">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-red-500 rounded-full animate-bounce"
                        style={{ height: '100%', animationDelay: `${i * 0.1}s`, animationDuration: '0.6s' }}
                      ></div>
                    ))}
                    <div className="flex items-center text-xs font-black text-red-500 uppercase ml-2 tracking-widest">
                      <div className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse"></div> Capturing
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full max-w-2xl mx-auto text-center space-y-6 md:space-y-8">
                <div className="space-y-3">
                  <span className="inline-block px-4 py-1.5 bg-blue-900/20 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full">Script</span>
                  <p className="text-xl md:text-3xl font-serif text-slate-900 dark:text-white leading-tight px-2">
                    "{task.prompt}"
                  </p>
                </div>

                <div className="flex flex-col items-center gap-5">
                  {!isRecording && !hasRecorded && (
                    <button
                      onClick={handleStartRecording}
                      className="group relative h-24 w-24 md:h-28 md:w-28 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-200 transition-all hover:scale-110"
                    >
                      <Mic className="h-10 w-10 md:h-12 md:w-12" />
                    </button>
                  )}

                  {isRecording && (
                    <button
                      onClick={handleStopRecording}
                      className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-white text-black flex items-center justify-center shadow-xl transition-all hover:scale-105"
                    >
                      <Square className="h-8 w-8 md:h-10 md:w-10 fill-current" />
                    </button>
                  )}

                  {hasRecorded && !isRecording && (
                    <div className="w-full animate-in slide-in-from-bottom-4 fade-in duration-500">
                      <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-white/10 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={handlePlayAudio}
                            className={`h-10 w-10 md:h-12 md:w-12 rounded-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 flex items-center justify-center transition-colors shadow-sm ${isPlaying
                              ? 'text-blue-400 border-blue-400'
                              : 'text-stone-300 hover:text-blue-400 hover:border-blue-400'
                              }`}
                          >
                            {isPlaying ? (
                              <Square className="h-5 w-5 md:h-6 md:w-6 fill-current" />
                            ) : (
                              <Play className="h-5 w-5 md:h-6 md:w-6 ml-1" />
                            )}
                          </button>
                          <div className="h-8 md:h-10 w-px bg-white/10 mx-2"></div>
                          <div className="h-6 md:h-8 flex items-center space-x-1">
                            {[...Array(8)].map((_, i) => (
                              <div key={i} className="w-1 md:w-1.5 bg-zinc-600 rounded-full transition-all" style={{ height: Math.random() * 20 + 6 + 'px' }}></div>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm font-mono text-stone-500 font-medium">{formatTime(recordingTime)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* IMAGE TASK UI */}
          {task.type === TaskType.IMAGE_COLLECTION && (
            <div className="w-full max-w-lg aspect-[4/3] bg-slate-100 dark:bg-black rounded-2xl overflow-hidden relative border-4 border-slate-200 dark:border-zinc-800 shadow-xl">
              {!capturedImage ? (
                !isCameraActive ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-zinc-900 p-6 text-center">
                    <Camera className="h-12 w-12 text-stone-300 mb-4" />
                    <Button onClick={startCamera} variant="primary">Access Camera</Button>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-6 inset-x-0 flex justify-center">
                      <button onClick={captureImage} className="h-14 w-14 rounded-full bg-white border-4 border-stone-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                        <div className="h-10 w-10 rounded-full bg-red-500" />
                      </button>
                    </div>
                  </>
                )
              ) : (
                <>
                  <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
                  <button onClick={retakePhoto} className="absolute bottom-4 right-4 px-4 h-9 bg-white/80 dark:bg-black/60 text-slate-900 dark:text-white font-bold text-xs rounded-lg backdrop-blur-md">Retake</button>
                </>
              )}
            </div>
          )}

          {/* TEXT/LABELS UI */}
          {(task.type === TaskType.IMAGE_LABELING || task.type === TaskType.TEXT_ANNOTATION || task.type === TaskType.SURVEY) && (
            <div className="w-full max-w-2xl space-y-8">
              <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 relative">
                <p className="text-xl md:text-2xl font-serif text-slate-900 dark:text-white leading-relaxed">
                  {task.prompt}
                </p>
              </div>
              {task.options ? (
                <div className="grid grid-cols-1 gap-3">
                  {task.options.map((opt, i) => (
                    <button key={i} onClick={() => setSelectedOption(opt)} className={`p-4 md:p-5 rounded-xl border-2 transition-all flex items-center justify-between ${selectedOption === opt ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200 dark:border-white/10'}`}>
                      <span className={`text-base font-medium ${selectedOption === opt ? 'text-blue-600' : 'text-stone-600'}`}>{opt}</span>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedOption === opt ? 'border-blue-600' : 'border-stone-300'}`}>
                        {selectedOption === opt && <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <textarea value={textInput} onChange={e => setTextInput(e.target.value)} className="w-full h-40 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-6 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="Enter output..." />
              )}
            </div>
          )}

          {/* PLAYLIST UI */}
          {task.type === TaskType.PLAYLIST && (
            <div className="w-full max-w-2xl space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {parsedPlaylist.length > 0 ? (
                parsedPlaylist.map((subtask, idx) => (
                  <div key={idx} className="bg-slate-100 dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">{idx + 1}</span>
                      <h4 className="font-bold text-slate-900 dark:text-white">{subtask.title}</h4>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 mb-4 text-sm leading-relaxed">{subtask.prompt}</p>
                    
                    <div className="pt-2">
                      <div className="flex justify-center bg-white dark:bg-black/30 rounded-2xl py-6 border border-slate-200 dark:border-white/5 shadow-inner">
                        <SubtaskAudioRecorder 
                          audioBlob={playlistAnswers[idx] instanceof Blob ? playlistAnswers[idx] as Blob : null}
                          onRecord={(b) => setPlaylistAnswers(prev => ({ ...prev, [idx]: b }))}
                          onClear={() => setPlaylistAnswers(prev => { const n = {...prev}; delete n[idx]; return n; })}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-stone-500 bg-white/5 rounded-2xl">
                  No subtasks found in this playlist.
                </div>
              )}
            </div>
          )}

          {/* Reset/Submit Actions */}
          <div className="w-full max-w-2xl mt-10 md:mt-12 flex gap-4 md:gap-5 justify-center">
            <Button variant="outline" onClick={() => {
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
            }} className="w-1/3 h-12 md:h-14" disabled={isSubmitting}>Reset</Button>
            <Button onClick={handleSubmit} className="w-2/3 h-12 md:h-14 text-base md:text-lg" isLoading={isSubmitting} disabled={isSubmitDisabled()}>
              {isSubmitting ? submitStatus : 'Submit Contribution'}
            </Button>
          </div>

        </div>
      </div>
      {/* Persistent Hidden Audio Player for stable React refs */}
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => console.error("🎵 Audio Element Error:", e)}
        className="hidden"
        preload="auto"
        playsInline
      />
    </div>
  );
};
