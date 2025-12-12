import { Mic, Trophy, Calendar } from 'lucide-react';
import { Difficulty } from '../types';

interface DashboardProps {
    currentDay: number;
    difficulty: Difficulty;
    onStart: () => void;
}

export default function Dashboard({ currentDay, difficulty, onStart }: DashboardProps) {
    const progress = (currentDay / 21) * 100;

    return (
        <div className="w-full max-w-md animate-fade-in">
            <div className="card card-glass mb-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-surface-highlight border border-border">
                        <Calendar size={32} className="text-primary" />
                    </div>
                </div>
                <h2 className="text-2xl mb-2">Day {currentDay}</h2>
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${difficulty === 'Easy' ? 'border-success text-success' :
                        difficulty === 'Medium' ? 'border-warning text-warning' :
                            'border-error text-error'
                        }`}>
                        {difficulty} Mode
                    </span>
                </div>

                <div className="relative h-2 bg-surface-highlight rounded-full mb-2 overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-sm text-muted mb-8">{21 - currentDay} days remaining</p>

                <button onClick={onStart} className="btn btn-primary w-full">
                    <Mic className="mr-2" size={20} />
                    Start Daily Challenge
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="card p-4 text-center">
                    <div className="text-3xl font-bold mb-1">0</div>
                    <div className="text-xs text-muted uppercase tracking-wider">Streak</div>
                </div>
                <div className="card p-4 text-center">
                    <div className="text-3xl font-bold mb-1">0</div>
                    <div className="text-xs text-muted uppercase tracking-wider">Total Speeches</div>
                </div>
            </div>

            <a href="/history" className="btn btn-secondary w-full text-sm">
                View History
            </a>
        </div>
    );
}
