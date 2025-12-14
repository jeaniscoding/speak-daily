'use client';

import { useState } from 'react';
import { useSchedule } from './hooks/useSchedule';
import { analyzeSpeech, AnalysisResult } from './services/SpeechAnalyzer';
import Dashboard from './components/Dashboard';
import TopicReveal from './components/TopicReveal';
import Recorder from './components/Recorder';
import Results from './components/Results';

type Step = 'DASHBOARD' | 'TOPIC' | 'RECORDING' | 'ANALYZING' | 'RESULTS';

export default function Home() {
  const { currentDay, difficulty, targetDuration, completeDay, isLoaded } = useSchedule();
  const [step, setStep] = useState<Step>('DASHBOARD');
  const [currentTopic, setCurrentTopic] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleRecordingComplete = async (blob: Blob) => {
    setStep('ANALYZING');
    try {
      // 1. Upload Video
      const formData = new FormData();
      formData.append('file', blob);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url: videoPath } = await uploadRes.json();

      // 2. Analyze
      const result = await analyzeSpeech(blob, currentTopic);
      setAnalysisResult(result);

      // 3. Save Progress
      await completeDay({
        score: result.score,
        transcript: result.transcript,
        topic: currentTopic,
        videoPath: videoPath
      });

      setStep('RESULTS');
    } catch (error) {
      console.error('Process failed', error);
      setStep('DASHBOARD');
    }
  };

  if (!isLoaded) {
    return (
      <main className="container flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted">Loading...</div>
      </main>
    );
  }

  return (
    <main className="container flex flex-col items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-md mb-8 flex justify-between items-center animate-fade-in">
        <h1 className="text-xl font-bold">Speak Daily</h1>
        <div className="text-sm text-muted">Day {currentDay}</div>
      </div>

      {step === 'DASHBOARD' && (
        <Dashboard
          currentDay={currentDay}
          difficulty={difficulty}
          onStart={() => setStep('TOPIC')}
        />
      )}

      {step === 'TOPIC' && (
        <TopicReveal
          difficulty={difficulty}
          onNext={(topic) => {
            setCurrentTopic(topic);
            setStep('RECORDING');
          }}
          onBack={() => setStep('DASHBOARD')}
        />
      )}

      {step === 'RECORDING' && (
        <Recorder
          targetDuration={targetDuration}
          onComplete={handleRecordingComplete}
          onBack={() => setStep('TOPIC')}
        />
      )}

      {step === 'ANALYZING' && (
        <div className="text-center animate-fade-in">
          <div className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-xl mb-2">Analyzing Speech...</h2>
          <p className="text-muted">Generating insights and transcript</p>
        </div>
      )}

      {step === 'RESULTS' && analysisResult && (
        <Results
          result={analysisResult}
          onComplete={() => setStep('DASHBOARD')}
        />
      )}
    </main>
  );
}
