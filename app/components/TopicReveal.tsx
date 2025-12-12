import { RefreshCw, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateTopic } from '../services/TopicGenerator';
import { Difficulty } from '../types';

interface TopicRevealProps {
    difficulty: Difficulty;
    onNext: (topic: string) => void;
    onBack: () => void;
}

export default function TopicReveal({ difficulty, onNext, onBack }: TopicRevealProps) {
    const [topic, setTopic] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const loadTopic = async () => {
        setLoading(true);
        const newTopic = await generateTopic(difficulty);
        setTopic(newTopic);
        setLoading(false);
    };

    useEffect(() => {
        loadTopic();
    }, [difficulty]);

    return (
        <div className="w-full max-w-md animate-fade-in text-center">
            <div className="mb-8">
                <h3 className="text-muted text-sm uppercase tracking-wider mb-2">Your Topic</h3>
                <div className="card card-glass min-h-[200px] flex items-center justify-center p-8 mb-4">
                    {loading ? (
                        <div className="animate-pulse text-muted">Generating topic...</div>
                    ) : (
                        <h2 className="text-2xl font-medium leading-relaxed">"{topic}"</h2>
                    )}
                </div>

                <button
                    onClick={loadTopic}
                    disabled={loading}
                    className="text-sm text-muted hover:text-primary flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                    <RefreshCw size={14} />
                    Generate New Topic
                </button>
            </div>

            <div className="flex gap-4">
                <button onClick={onBack} className="btn btn-secondary flex-1">
                    Back
                </button>
                <button
                    onClick={() => onNext(topic)}
                    disabled={loading}
                    className="btn btn-primary flex-1"
                >
                    I'm Ready <ArrowRight className="ml-2" size={18} />
                </button>
            </div>
        </div>
    );
}
