import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskType } from '../types';
import { Button } from '../components/Button';
import { AlertTriangle, Mic, Square, Check, ArrowLeft, Play, Info, ShieldCheck, Clock, CheckCircle, Database, Lock, Cpu, Camera, RefreshCcw } from 'lucide-react';

interface TaskExecutionProps {
  task: Task;
  onBack: () => void;
  onComplete: () => void;
}

type Step = 'brief' | 'consent' | 'execute' | 'submitted';

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

  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<number | null>(null);

  // Clean up stream on unmount
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(url);

        console.log('🎵 Audio blob created:', audioBlob);
        console.log('🎵 Audio URL:', url);
        console.log('🎵 Audio chunks:', audioChunksRef.current.length);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setHasRecorded(false);
      setRecordingTime(0);
      console.log('🎤 Recording started');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please allow microphone permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setHasRecorded(true);
      console.log('🎤 Recording stopped');
    }
  };

  const handlePlayAudio = async () => {
    console.log('🔊 Play button clicked');
    console.log('Audio URL:', audioUrl);
    console.log('Audio Ref:', audioRef.current);

    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        console.log('⏸️ Audio paused');
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          console.log('▶️ Audio playing');
        } catch (err) {
          console.error('❌ Error playing audio:', err);
          alert('Could not play audio. Error: ' + err);
        }
      }
    } else {
      console.warn('⚠️ No audio URL or audio element not ready');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      setIsCameraActive(true);
      // Delay slighty to ensure ref is populated if rendering conditionally
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

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('submitted');
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isSubmitDisabled = () => {
    if (isSubmitting) return true;
    if (task.type === TaskType.AUDIO_COLLECTION) return !hasRecorded;
    if (task.type === TaskType.IMAGE_COLLECTION) return !capturedImage;
    if (task.type === TaskType.IMAGE_LABELING) return textInput.length < 5;
    if (task.type === TaskType.TEXT_ANNOTATION || task.type === TaskType.SURVEY) return !selectedOption;
    return true;
  };

  // Step 1: Briefing & Instructions
  if (step === 'brief') {
    return (
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={onBack} className="flex items-center text-sm font-medium text-stone-500 hover:text-stone-900 dark:hover:text-white mb-3 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Console
        </button>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200 dark:border-white/10 shadow-xl shadow-stone-200/50 dark:shadow-none overflow-hidden">
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-stone-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#FAF9F7] dark:bg-white/5 gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#121212] dark:text-white leading-tight">{task.title}</h2>
              <div className="flex flex-wrap items-center mt-2 gap-2 text-sm text-stone-500">
                <span className="flex items-center bg-white dark:bg-black px-3 py-1 rounded border border-stone-200 dark:border-white/10 shadow-sm font-medium"><Info className="h-4 w-4 mr-2 text-[#0f766e] dark:text-blue-400" /> {task.type}</span>
                <span className="font-mono text-xs text-stone-400">OP_ID: {task.id}</span>
              </div>
            </div>
            <div className="flex items-center md:block w-full md:w-auto justify-between md:text-right border-t md:border-t-0 border-stone-200 dark:border-white/10 pt-4 md:pt-0">
              <div className="text-sm text-stone-500 font-medium uppercase tracking-wider mb-1">Compensation</div>
              <div className="text-xl md:text-2xl font-bold text-[#0f766e] dark:text-emerald-400">₹{task.compensation.toFixed(2)}</div>
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-4 md:space-y-5">
            {/* Infrastructure Context */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 md:p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                <div className="flex items-center gap-2 mb-2 text-blue-800 dark:text-blue-300 font-bold text-sm uppercase tracking-wide">
                  <Cpu className="h-4 w-4" /> AI Capability Purpose
                </div>
                <p className="text-blue-900 dark:text-blue-200 text-sm leading-relaxed">{task.aiCapability}</p>
              </div>
              <div className="p-3 md:p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/20">
                <div className="flex items-center gap-2 mb-2 text-purple-800 dark:text-purple-300 font-bold text-sm uppercase tracking-wide">
                  <Database className="h-4 w-4" /> Data Usage Scope
                </div>
                <p className="text-purple-900 dark:text-purple-200 text-sm leading-relaxed">{task.dataUsage}</p>
              </div>
            </div>

            <div className="prose prose-stone dark:prose-invert max-w-none">
              <h3 className="text-base md:text-lg font-bold text-[#121212] dark:text-white mb-2">Operational Instructions</h3>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed bg-[#FAF9F7] dark:bg-white/5 p-3 md:p-4 rounded-xl border border-stone-100 dark:border-white/5 font-mono text-sm">{task.instructions}</p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl p-3 md:p-4 flex flex-col md:flex-row gap-3">
              <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-amber-900 dark:text-amber-200">
                <p className="font-bold text-base mb-1">Quality Standards</p>
                <p className="opacity-90 leading-relaxed text-sm">
                  {task.type === TaskType.AUDIO_COLLECTION ? "Strict Requirement: No background noise. Natural speaking pace. Inputs with static/echo will fail validation." :
                    task.type === TaskType.IMAGE_COLLECTION ? "Ensure subject is in focus. Good lighting is mandatory. No blurry images." :
                      task.type === TaskType.IMAGE_LABELING ? "Precision Required. List items separated by commas. Do not hallucinate objects not present." :
                        "Accuracy is critical. Random selection patterns will trigger account review."}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-100 dark:border-white/10">
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
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200 dark:border-white/10 shadow-xl shadow-stone-200/50 dark:shadow-none p-6 md:p-12">
          <div className="flex items-center justify-center h-16 w-16 md:h-20 md:w-20 bg-teal-50 dark:bg-teal-900/20 rounded-full mx-auto mb-6 md:mb-8">
            <Lock className="h-8 w-8 md:h-10 md:w-10 text-[#0f766e] dark:text-teal-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#121212] dark:text-white mb-3 text-center">Protocol Acceptance</h2>
          <p className="text-stone-500 text-center mb-8 md:mb-10 text-base md:text-lg">Confirm understanding of data handling protocols.</p>

          <div className="bg-[#FAF9F7] dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-stone-100 dark:border-white/5 mb-8 md:mb-10 text-sm md:text-base text-stone-600 dark:text-stone-300 space-y-5">
            <p className="leading-relaxed font-bold">
              You are contributing structured data for: <span className="text-blue-600 dark:text-blue-400">{task.aiCapability}</span>.
            </p>
            <div className="h-px bg-stone-200 dark:bg-white/10"></div>
            <ul className="space-y-3">
              <li className="flex items-start"><Check className="h-5 w-5 text-[#0f766e] dark:text-emerald-400 mr-3 mt-0.5 flex-shrink-0" /> No personal identity data is collected.</li>
              <li className="flex items-start"><Check className="h-5 w-5 text-[#0f766e] dark:text-emerald-400 mr-3 mt-0.5 flex-shrink-0" /> Inputs are validated before acceptance.</li>
              <li className="flex items-start"><Check className="h-5 w-5 text-[#0f766e] dark:text-emerald-400 mr-3 mt-0.5 flex-shrink-0" /> Compensation transfers usage rights to Starset.</li>
            </ul>
          </div>

          <div className="flex items-start md:items-center mb-8 md:mb-10 bg-white dark:bg-black/20 border border-stone-200 dark:border-white/10 p-5 rounded-xl cursor-pointer hover:border-[#0f766e] dark:hover:border-teal-500 transition-colors" onClick={() => setConsentGiven(!consentGiven)}>
            <div className="flex items-center h-6">
              <input
                id="consent"
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="h-5 w-5 md:h-6 md:w-6 text-[#0f766e] border-stone-300 rounded focus:ring-[#0f766e] transition-all"
              />
            </div>
            <div className="ml-4 text-sm md:text-base select-none">
              <label htmlFor="consent" className="font-medium text-[#121212] dark:text-white cursor-pointer">I confirm this data is accurate and generated by human effort.</label>
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

  // Step 4: Submission Confirmation
  if (step === 'submitted') {
    return (
      <div className="max-w-xl mx-auto mt-8 md:mt-16 animate-in zoom-in-95 duration-500">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200 dark:border-white/10 shadow-xl shadow-stone-200/50 dark:shadow-none p-8 md:p-12 text-center">
          <div className="h-24 w-24 md:h-28 md:w-28 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 animate-in zoom-in duration-300 delay-150">
            <CheckCircle className="h-12 w-12 md:h-14 md:w-14 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#121212] dark:text-white mb-4">Contribution Received</h2>
          <p className="text-stone-600 dark:text-stone-300 mb-8 md:mb-12 max-w-md mx-auto leading-relaxed text-base md:text-lg">
            Your data has been securely logged and queued for validation.
          </p>

          <div className="bg-[#FAF9F7] dark:bg-white/5 rounded-2xl p-6 border border-stone-100 dark:border-white/5 mb-8 md:mb-10 text-left space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-500 font-medium">Operation ID</span>
              <span className="text-sm font-mono font-bold text-[#121212] dark:text-white">{task.id}</span>
            </div>
            <div className="h-px bg-stone-200 dark:bg-white/10 w-full"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-500 font-medium flex items-center"><Clock className="h-4 w-4 mr-2" /> Validation SLA</span>
              <span className="text-sm font-bold text-[#121212] dark:text-white">~24 Hours</span>
            </div>
            <div className="h-px bg-stone-200 dark:bg-white/10 w-full"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-500 font-medium">Pending Compensation</span>
              <span className="text-sm font-bold text-[#0f766e] dark:text-emerald-400 bg-teal-50 dark:bg-emerald-900/20 px-3 py-1 rounded border border-teal-100 dark:border-emerald-800">₹{task.compensation.toFixed(2)}</span>
            </div>
          </div>

          <Button onClick={onComplete} className="w-full h-14 text-lg" size="lg">Return to Console</Button>
        </div>
      </div>
    );
  }

  // Step 3: Execution - DYNAMIC RENDERER
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200 dark:border-white/10 shadow-2xl shadow-stone-200/50 dark:shadow-none overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* Sidebar for Task Context - Collapses on Mobile to top */}
        <div className="w-full md:w-1/3 bg-[#FAF9F7] dark:bg-black/30 border-b md:border-b-0 md:border-r border-stone-100 dark:border-white/10 p-6 md:p-8 flex flex-col order-1 md:order-1">
          {task.imageUrl && task.type === TaskType.AUDIO_COLLECTION && (
            <div className="w-full h-32 md:h-48 rounded-xl overflow-hidden mb-6 border border-stone-200 dark:border-white/10 shadow-sm hidden md:block">
              <img src={task.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <h3 className="font-bold text-[#121212] dark:text-white mb-2 md:mb-4 text-base md:text-lg">Operational Context</h3>
          <div className="space-y-4 text-sm text-stone-600 dark:text-stone-400 flex-1">
            <p className="text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-none">{task.title}</p>
            <div className="p-3 md:p-4 bg-white dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/5 text-xs md:text-sm shadow-sm">
              <strong>Requirement:</strong> {task.type === TaskType.AUDIO_COLLECTION ? "Speak clearly." : task.type === TaskType.IMAGE_COLLECTION ? "Good lighting required." : "Be descriptive."}
            </div>
          </div>
          {/* Progress Bar - Hidden on mobile to save space */}
          <div className="mt-8 pt-6 border-t border-stone-200 dark:border-white/10 hidden md:block">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Completion Status</span>
              <span className="text-xs font-bold text-[#121212] dark:text-white">0%</span>
            </div>
            <div className="h-2 bg-stone-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#0f766e] dark:bg-blue-500 w-0"></div>
            </div>
          </div>
        </div>

        {/* Main Execution Area */}
        <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center relative bg-white dark:bg-zinc-900 order-2 md:order-2">

          {/* AUDIO TASK UI */}
          {task.type === TaskType.AUDIO_COLLECTION && (
            <>
              <div className="absolute top-4 right-4 md:top-8 md:right-10 text-right">
                <div className={`text-4xl md:text-5xl font-mono font-light tracking-tighter transition-colors ${isRecording ? 'text-[#121212] dark:text-white' : 'text-stone-300 dark:text-zinc-700'}`}>
                  {formatTime(recordingTime)}
                </div>
                {isRecording && (
                  <div className="flex items-center justify-end text-xs font-bold text-red-500 uppercase mt-2 tracking-widest animate-pulse">
                    <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div> Capturing
                  </div>
                )}
              </div>

              <div className="w-full max-w-2xl mx-auto text-center space-y-6 md:space-y-8">
                <div className="space-y-3">
                  <span className="inline-block px-4 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-[#0f766e] dark:text-teal-400 text-xs font-bold uppercase tracking-wider rounded-full">Script</span>
                  <p className="text-xl md:text-3xl font-serif text-[#121212] dark:text-white leading-tight px-2">
                    "{task.prompt}"
                  </p>
                </div>

                <div className="flex flex-col items-center gap-5">
                  {!isRecording && !hasRecorded && (
                    <button
                      onClick={handleStartRecording}
                      className="group relative h-24 w-24 md:h-28 md:w-28 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-200 dark:shadow-red-900/20 transition-all hover:scale-110 hover:shadow-2xl hover:shadow-red-400 focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900"
                    >
                      <Mic className="h-10 w-10 md:h-12 md:w-12 group-hover:animate-bounce" />
                      <span className="absolute -bottom-8 md:-bottom-10 text-xs md:text-sm text-stone-400 font-medium opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Initialize Record</span>
                    </button>
                  )}

                  {isRecording && (
                    <button
                      onClick={handleStopRecording}
                      className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-[#121212] dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xl shadow-stone-300 dark:shadow-white/10 transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-stone-200 dark:focus:ring-zinc-700"
                    >
                      <Square className="h-8 w-8 md:h-10 md:w-10 fill-current" />
                    </button>
                  )}

                  {hasRecorded && !isRecording && (
                    <div className="w-full animate-in slide-in-from-bottom-4 fade-in duration-500">
                      <div className="bg-[#FAF9F7] dark:bg-white/5 rounded-2xl p-4 md:p-6 border border-stone-200 dark:border-white/10 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={handlePlayAudio}
                            className={`h-10 w-10 md:h-12 md:w-12 rounded-full bg-white dark:bg-black border border-stone-200 dark:border-white/10 flex items-center justify-center transition-colors shadow-sm ${isPlaying
                              ? 'text-[#0f766e] dark:text-teal-400 border-[#0f766e] dark:border-teal-400'
                              : 'text-stone-700 dark:text-stone-300 hover:text-[#0f766e] dark:hover:text-teal-400 hover:border-[#0f766e] dark:hover:border-teal-400'
                              }`}
                          >
                            <Play className="h-5 w-5 md:h-6 md:w-6 ml-1" />
                          </button>
                          <div className="h-8 md:h-10 w-px bg-stone-200 dark:bg-white/10 mx-2"></div>
                          <div className="h-6 md:h-8 flex items-center space-x-1">
                            {[...Array(8)].map((_, i) => (
                              <div key={i} className="w-1 md:w-1.5 bg-stone-300 dark:bg-zinc-600 rounded-full transition-all hover:bg-[#0f766e] dark:hover:bg-teal-400" style={{ height: Math.random() * 20 + 6 + 'px' }}></div>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm font-mono text-stone-500 font-medium">{formatTime(recordingTime)}</div>
                      </div>
                      {/* Hidden audio element */}
                      <audio
                        ref={audioRef}
                        src={audioUrl || undefined}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* IMAGE COLLECTION UI */}
          {task.type === TaskType.IMAGE_COLLECTION && (
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
              <div className="space-y-2 text-center mb-8">
                <span className="inline-block px-4 py-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 text-xs font-bold uppercase tracking-wider rounded-full">Objective</span>
                <p className="text-2xl md:text-4xl font-serif text-[#121212] dark:text-white leading-tight">
                  "{task.prompt}"
                </p>
              </div>

              <div className="w-full max-w-lg aspect-[4/3] bg-black rounded-2xl overflow-hidden relative border-4 border-stone-200 dark:border-zinc-800 shadow-2xl">
                {!capturedImage ? (
                  <>
                    {!isCameraActive ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 dark:bg-zinc-900 p-6 text-center">
                        <Camera className="h-12 w-12 md:h-16 md:w-16 text-stone-300 dark:text-zinc-700 mb-4" />
                        <Button onClick={startCamera} variant="primary">Access Camera</Button>
                      </div>
                    ) : (
                      <>
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                        <div className="absolute bottom-6 inset-x-0 flex justify-center">
                          <button
                            onClick={captureImage}
                            className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-white border-4 border-stone-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                          >
                            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-red-500"></div>
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                      <Button onClick={retakePhoto} variant="secondary" size="sm">
                        <RefreshCcw className="h-4 w-4 mr-2" /> Retake
                      </Button>
                    </div>
                  </>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {isCameraActive && (
                <div className="mt-4 flex items-center text-xs text-red-500 font-bold uppercase tracking-widest animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div> Live Feed
                </div>
              )}
            </div>
          )}

          {/* IMAGE LABELING UI */}
          {task.type === TaskType.IMAGE_LABELING && (
            <div className="w-full max-w-4xl mx-auto space-y-6 md:space-y-8">
              {task.imageUrl && (
                <div className="w-full h-48 md:h-96 bg-stone-100 dark:bg-black/40 rounded-xl overflow-hidden border border-stone-200 dark:border-white/10 relative group">
                  <img src={task.imageUrl} className="w-full h-full object-contain" alt="Task Context" />
                  <div className="absolute bottom-4 left-4 right-4 md:right-auto bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm text-xs md:text-sm">
                    {task.prompt}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-3 uppercase tracking-wide">Input Data</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full h-32 md:h-40 p-4 md:p-6 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#0f766e]/20 dark:focus:ring-teal-500/20 focus:border-[#0f766e] dark:focus:border-teal-500 outline-none transition-all resize-none text-base md:text-lg bg-[#FAF9F7] dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 dark:text-white"
                  placeholder="Type your description here..."
                ></textarea>
                <p className="text-right text-xs text-stone-400 mt-2">{textInput.length} characters</p>
              </div>
            </div>
          )}

          {/* TEXT ANNOTATION / SURVEY UI */}
          {(task.type === TaskType.TEXT_ANNOTATION || task.type === TaskType.SURVEY) && (
            <div className="w-full max-w-2xl mx-auto space-y-8 md:space-y-10">
              <div className="bg-[#FAF9F7] dark:bg-white/5 p-6 md:p-8 rounded-2xl border border-stone-200 dark:border-white/10 relative">
                <div className="absolute -top-3 left-6 bg-white dark:bg-zinc-800 px-2 py-0.5 text-xs font-bold text-stone-400 border border-stone-200 dark:border-white/10 rounded uppercase tracking-wide">Prompt</div>
                <p className="text-xl md:text-2xl font-serif text-[#121212] dark:text-white leading-relaxed">
                  {task.prompt}
                </p>
                {task.type === TaskType.TEXT_ANNOTATION && task.imageUrl && (
                  <img src={task.imageUrl} className="mt-6 rounded-lg w-full h-32 md:h-48 object-cover opacity-80" alt="context" />
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">Select Annotation</label>
                <div className="grid grid-cols-1 gap-3">
                  {task.options?.map((option, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedOption(option)}
                      className={`p-4 md:p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group
                             ${selectedOption === option
                          ? 'border-[#0f766e] dark:border-teal-500 bg-teal-50/30 dark:bg-teal-900/10 shadow-sm'
                          : 'border-stone-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-stone-300 dark:hover:border-white/20'}`}
                    >
                      <span className={`text-base md:text-lg font-medium ${selectedOption === option ? 'text-[#0f766e] dark:text-teal-400' : 'text-stone-600 dark:text-stone-300'}`}>{option}</span>
                      <div className={`h-5 w-5 md:h-6 md:w-6 rounded-full border-2 flex items-center justify-center
                              ${selectedOption === option ? 'border-[#0f766e] dark:border-teal-500' : 'border-stone-300 dark:border-zinc-600 group-hover:border-stone-400'}`}>
                        {selectedOption === option && <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-[#0f766e] dark:bg-teal-500"></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Common Action Buttons */}
          <div className="w-full max-w-2xl mt-8 md:mt-12 flex gap-4 md:gap-5 justify-center mx-auto pb-4">
            <Button variant="outline" onClick={() => {
              setHasRecorded(false);
              setRecordingTime(0);
              setTextInput('');
              setSelectedOption(null);
              setCapturedImage(null);
              stopCamera();
            }} className="w-1/3 h-12 md:h-14 text-sm md:text-base" disabled={isSubmitting}>
              Reset
            </Button>
            <Button onClick={handleSubmit} className="w-2/3 h-12 md:h-14 text-base md:text-lg" isLoading={isSubmitting} disabled={isSubmitDisabled()}>
              Submit
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};