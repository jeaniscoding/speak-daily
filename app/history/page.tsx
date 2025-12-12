'use client';

import { ArrowLeft, Calendar, Trophy, MessageSquare } from 'lucide-react';
import { useSchedule } from '../hooks/useSchedule';
import Link from 'next/link';
import { Difficulty } from '../types';

export default function HistoryPage() {
    const { history, isLoaded } = useSchedule();

    if (!isLoaded) {
        return (
            <main className="container flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-muted">Loading...</div>
            </main>
        );
    }

    // Sort history by date desc
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <main className="container flex flex-col min-h-screen py-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="btn btn-secondary p-2 rounded-full">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold">Speech History</h1>
            </div>

            {sortedHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center opacity-50">
                    <div className="p-6 bg-surface-highlight rounded-full mb-4">
                        <Calendar size={48} />
                    </div>
                    <p className="text-xl mb-2">No speeches yet</p>
                    <p className="text-muted">Complete your first daily challenge!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {sortedHistory.map((item, index) => (
                        <div key={index} className="card flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-primary font-medium">Day {item.day}</span>
                                        <span className="text-muted text-xs">• {new Date(item.date).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-medium text-lg">"{item.topic}"</h3>
                                </div>
                                <div className="flex items-center gap-1 bg-surface-highlight px-3 py-1 rounded-full border border-border">
                                    <Trophy size={14} className="text-warning" />
                                    <span className="font-bold">{item.score}</span>
                                </div>
                            </div>

                            {item.transcript && (
                                <div className="bg-surface-highlight/50 p-3 rounded-md text-sm text-text-muted italic relative">
                                    <MessageSquare size={16} className="absolute top-3 left-3 opacity-20" />
                                    <p className="pl-6 line-clamp-2">"{item.transcript}"</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
