import { CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { AnalysisResult } from '../services/SpeechAnalyzer';

interface ResultsProps {
    result: AnalysisResult;
    onComplete: () => void;
}

export default function Results({ result, onComplete }: ResultsProps) {
    return (
        <div className="w-full max-w-md animate-fade-in pb-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-highlight border-4 border-primary mb-4">
                    <span className="text-3xl font-bold text-primary">{result.score}</span>
                </div>
                <h2 className="text-2xl mb-1">Great Job!</h2>
                <p className="text-muted">Daily Challenge Completed</p>
            </div>

            <div className="card mb-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                    <AlertCircle size={18} className="mr-2 text-warning" />
                    Key Insights
                </h3>
                <div className="space-y-4">
                    {result.mistakes.map((mistake, i) => (
                        <div key={i} className="flex gap-3 text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                            <span className="font-mono text-muted">{mistake.timestamp}</span>
                            <span>{mistake.comment}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card mb-6">
                <h3 className="text-lg font-medium mb-2">Recommendation</h3>
                <p className="text-sm text-muted leading-relaxed">
                    {result.recommendation}
                </p>
            </div>

            <div className="card mb-8 bg-surface-highlight/50">
                <h3 className="text-sm font-medium mb-2 text-muted uppercase tracking-wider">Transcript</h3>
                <p className="text-sm italic text-text-dim">
                    "{result.transcript}"
                </p>
            </div>

            <button onClick={onComplete} className="btn btn-primary w-full">
                <Calendar size={18} className="mr-2" />
                Back to Dashboard
            </button>
        </div>
    );
}
