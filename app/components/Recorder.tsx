import { useState, useRef, useEffect } from 'react';
import { Video, Mic, Square, Upload, Play, RotateCcw, CheckCircle } from 'lucide-react';

interface RecorderProps {
    targetDuration: number; // in seconds
    onComplete: (blob: Blob) => void;
    onBack: () => void;
}

export default function Recorder({ targetDuration, onComplete, onBack }: RecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(targetDuration);
    const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            stopStream();
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, []);

    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setError(null);
        } catch (err) {
            console.error('Error accessing media devices:', err);
            setError('Could not access camera/microphone. Please check permissions.');
        }
    };

    const stopStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const startRecording = async () => {
        if (!streamRef.current) await startStream();
        if (!streamRef.current) return;

        const mediaRecorder = new MediaRecorder(streamRef.current);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            setMediaBlob(blob);
            setPreviewUrl(URL.createObjectURL(blob));
            stopStream();
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Start timer
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    stopRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const resetRecording = () => {
        setMediaBlob(null);
        setPreviewUrl(null);
        setTimeLeft(targetDuration);
        startStream();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaBlob(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Initialize camera on mount
    useEffect(() => {
        startStream();
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-md animate-fade-in">
            {error && (
                <div className="p-4 mb-4 bg-error/10 text-error border border-error rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="card overflow-hidden bg-black aspect-video relative mb-4 flex items-center justify-center">
                {!mediaBlob ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                    />
                ) : (
                    <video
                        src={previewUrl!}
                        controls
                        className="w-full h-full object-contain"
                    />
                )}

                {isRecording && (
                    <div className="absolute top-4 right-4 bg-error text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full" />
                        REC {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            {!mediaBlob ? (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center gap-4">
                        {!isRecording ? (
                            <button
                                onClick={startRecording}
                                className="w-16 h-16 rounded-full bg-error border-4 border-surface-highlight flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-error/30"
                                aria-label="Start Recording"
                            >
                                <div className="w-6 h-6 bg-white rounded-full" />
                            </button>
                        ) : (
                            <button
                                onClick={stopRecording}
                                className="w-16 h-16 rounded-full bg-surface-highlight border-4 border-error flex items-center justify-center hover:scale-105 transition-transform"
                            >
                                <Square size={24} className="text-error" fill="currentColor" />
                            </button>
                        )}
                    </div>

                    <div className="text-center">
                        <p className="text-muted text-sm mb-2">or upload a video</p>
                        <label className="btn btn-secondary cursor-pointer text-sm py-2">
                            <Upload size={16} className="mr-2" />
                            Upload File
                            <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4">
                    <button onClick={resetRecording} className="btn btn-secondary flex-1">
                        <RotateCcw size={18} className="mr-2" />
                        Retry
                    </button>
                    <button onClick={() => onComplete(mediaBlob)} className="btn btn-primary flex-1">
                        Analyze <CheckCircle size={18} className="ml-2" />
                    </button>
                </div>
            )}

            {!isRecording && !mediaBlob && (
                <button onClick={onBack} className="mt-8 text-sm text-muted hover:text-white block mx-auto">
                    Cancel
                </button>
            )}
        </div>
    );
}
