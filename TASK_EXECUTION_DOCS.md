# TaskExecution.tsx - Detailed Documentation

## 📝 **Component Overview**

The `TaskExecution` component is responsible for executing different types of tasks. It handles:
- 🎤 **Audio recording** tasks
- 📸 **Image capture** tasks  
- ✍️ **Text annotation** tasks
- 📊 **Survey** tasks

---

## 🔄 **Component Flow**

The component follows a 4-step workflow:

```
1. BRIEF → 2. CONSENT → 3. EXECUTE → 4. SUBMITTED
```

### **Step 1: Brief**
- Shows task instructions
- Displays what the AI will learn from this data
- Explains compensation and time estimate

### **Step 2: Consent**
- User must agree to data usage terms
- Explains how data will be used
- Required before proceeding to execution

### **Step 3: Execute**
- User performs the actual task
- Different UI based on task type (audio, image, text, survey)
- Real-time feedback (recording timer, camera preview, etc.)

### **Step 4: Submitted**
- Confirmation screen
- Shows earnings added
- Option to return to task list

---

## 📊 **State Management**

### **Workflow State**
```typescript
const [step, setStep] = useState<Step>('brief');
```
- Tracks which step the user is currently on
- Type: `'brief' | 'consent' | 'execute' | 'submitted'`

### **Audio Recording State**
```typescript
const [isRecording, setIsRecording] = useState(false);        // Currently recording?
const [recordingTime, setRecordingTime] = useState(0);        // Duration in seconds
const [hasRecorded, setHasRecorded] = useState(false);        // Has user recorded?
const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Audio data
const [audioUrl, setAudioUrl] = useState<string | null>(null); // Playback URL
const [isPlaying, setIsPlaying] = useState(false);            // Playing audio?
```

**Refs for Audio:**
- `mediaRecorderRef` - MediaRecorder API instance
- `audioChunksRef` - Array of audio data chunks
- `audioRef` - HTML audio element for playback

### **Camera/Image State**
```typescript
const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
const [capturedImage, setCapturedImage] = useState<string | null>(null);
const [isCameraActive, setIsCameraActive] = useState(false);
```

**Refs for Camera:**
- `videoRef` - Video element showing camera preview
- `canvasRef` - Canvas for capturing the image

### **Text/Survey State**
```typescript
const [textInput, setTextInput] = useState('');               // User's text input
const [selectedOption, setSelectedOption] = useState<string | null>(null); // Survey choice
```

### **Form State**
```typescript
const [consentGiven, setConsentGiven] = useState(false);      // Consent checkbox
const [isSubmitting, setIsSubmitting] = useState(false);      // Submission in progress
```

---

## 🎤 **Audio Recording Functions**

### **`handleStartRecording()`**
```typescript
const handleStartRecording = async () => {
  // 1. Request microphone access
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
  // 2. Create MediaRecorder instance
  const mediaRecorder = new MediaRecorder(stream);
  
  // 3. Collect audio chunks as they're recorded
  mediaRecorder.ondataavailable = (event) => {
    audioChunksRef.current.push(event.data);
  };
  
  // 4. When recording stops, create audio blob
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const url = URL.createObjectURL(audioBlob);
    setAudioBlob(audioBlob);
    setAudioUrl(url);
    
    // Stop microphone stream
    stream.getTracks().forEach(track => track.stop());
  };
  
  // 5. Start recording
  mediaRecorder.start();
  setIsRecording(true);
  setRecordingTime(0);
};
```

**How it works:**
1. Asks browser for microphone permission
2. Creates a MediaRecorder to capture audio
3. Collects audio data in chunks
4. When stopped, combines chunks into a Blob
5. Creates a temporary URL for playback

### **`handleStopRecording()`**
```typescript
const handleStopRecording = () => {
  if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
    mediaRecorderRef.current.stop(); // Triggers onstop event
    setIsRecording(false);
    setHasRecorded(true);
  }
};
```

### **`handlePlayAudio()`**
```typescript
const handlePlayAudio = async () => {
  if (audioUrl && audioRef.current) {
    if (isPlaying) {
      // Pause and reset
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      // Play audio
      await audioRef.current.play();
      setIsPlaying(true);
    }
  }
};
```

---

## 📸 **Camera Functions**

### **`startCamera()`**
```typescript
const startCamera = async () => {
  // Request camera access
  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: 'user' } // Front camera
  });
  
  setCameraStream(stream);
  
  // Display camera preview in video element
  if (videoRef.current) {
    videoRef.current.srcObject = stream;
  }
  
  setIsCameraActive(true);
};
```

### **`captureImage()`**
```typescript
const captureImage = () => {
  if (videoRef.current && canvasRef.current) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    
    // Convert canvas to data URL
    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
    
    // Stop camera
    stopCamera();
  }
};
```

### **`stopCamera()`**
```typescript
const stopCamera = () => {
  if (cameraStream) {
    // Stop all camera tracks
    cameraStream.getTracks().forEach(track => track.stop());
    setCameraStream(null);
    setIsCameraActive(false);
  }
};
```

---

## 📤 **Submission Function**

### **`handleSubmit()`**
```typescript
const handleSubmit = async () => {
  setIsSubmitting(true);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // TODO: Upload audio blob to cloud storage
  // TODO: Save submission to database
  // TODO: Update user earnings
  
  setIsSubmitting(false);
  setStep('submitted');
};
```

**What needs to be added:**
1. Upload `audioBlob` to cloud storage (user's choice)
2. Save submission record to Supabase database
3. Update user's earnings in their profile
4. Send confirmation email (optional)

---

## 🔄 **Side Effects (useEffect)**

### **Effect 1: Cleanup on Unmount**
```typescript
useEffect(() => {
  return () => {
    stopCamera();                    // Stop camera if active
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop recording if active
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);  // Free memory
    }
  };
}, [audioUrl]);
```

**Why this is important:**
- Prevents memory leaks from blob URLs
- Stops camera/microphone when user leaves page
- Cleans up media streams properly

### **Effect 2: Recording Timer**
```typescript
useEffect(() => {
  if (isRecording) {
    // Update timer every second
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  } else {
    // Clear timer when not recording
    if (timerRef.current) clearInterval(timerRef.current);
  }
  
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, [isRecording]);
```

---

## 🎨 **UI Components by Task Type**

### **Audio Collection Task**
- Microphone button to start/stop recording
- Real-time recording timer (00:00 format)
- Play button to preview recorded audio
- Visual feedback (pulsing mic icon while recording)

### **Image Collection Task**
- Camera preview (live video stream)
- Capture button
- Preview of captured image
- Retake option

### **Text Annotation Task**
- Large text area for input
- Character/word count
- Validation for minimum length

### **Survey Task**
- Radio buttons for single choice
- Clear visual feedback for selection
- Submit button enabled only when option selected

---

## 🔐 **Security & Privacy**

### **Consent Screen**
- Required before task execution
- Explains data usage clearly
- User must explicitly agree
- Cannot proceed without consent

### **Data Handling**
- Audio/images stored temporarily in browser memory
- Blob URLs are revoked after use
- No data sent without user submission
- All uploads should be encrypted (TODO)

---

## 💡 **Key Concepts**

### **MediaRecorder API**
- Browser API for recording audio/video
- Works with getUserMedia() to access microphone
- Outputs data in chunks (Blob objects)
- Supported in all modern browsers

### **Blob URLs**
- Temporary URLs created from Blob data
- Format: `blob:http://localhost:3000/abc123`
- Must be revoked with `URL.revokeObjectURL()` to prevent memory leaks
- Used for audio playback without uploading to server

### **Canvas API**
- Used to capture still images from video stream
- `drawImage()` copies current video frame
- `toDataURL()` converts to base64 image string
- Can be uploaded or displayed directly

---

## 🐛 **Debugging Tips**

### **Audio Not Recording?**
1. Check browser console for permission errors
2. Ensure HTTPS or localhost (required for getUserMedia)
3. Check if microphone is already in use
4. Verify MediaRecorder is supported

### **Audio Not Playing?**
1. Check console logs for audio URL
2. Verify audioBlob is not null
3. Check browser autoplay policies
4. Ensure audio element ref is set

### **Camera Not Working?**
1. Check camera permissions in browser
2. Ensure video element ref is set
3. Check if camera is already in use
4. Verify getUserMedia constraints

---

**Created:** 2026-02-11  
**Purpose:** Detailed documentation for TaskExecution component  
**Status:** ✅ Complete
