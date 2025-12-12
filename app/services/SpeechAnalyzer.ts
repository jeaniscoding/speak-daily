import { DailyProgress } from '../types';

export interface AnalysisResult {
    transcript: string;
    score: number;
    mistakes: { timestamp: string; comment: string }[];
    recommendation: string;
}

export async function analyzeSpeech(mediaBlob: Blob, topic: string): Promise<AnalysisResult> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock response
    return {
        transcript: "I think... uh... the topic is very interesting because... um... it affects everyone. I believe that we should... like... do more about it.",
        score: 75,
        mistakes: [
            { timestamp: "0:02", comment: "Excessive use of filler words ('uh')." },
            { timestamp: "0:08", comment: "Hesitation ('um')." },
            { timestamp: "0:12", comment: "Filler word ('like')." },
        ],
        recommendation: "Try to pause silently instead of using filler words. Your pacing is good, but work on confidence in your opening statement.",
    };
}
