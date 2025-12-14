'use client';

import { useState, useEffect } from 'react';
import { UserState, DailyProgress, SCHEDULE_CONFIG, Difficulty } from '../types';

const INITIAL_STATE: UserState = {
    currentDay: 1,
    history: [],
    interests: [],
};

export function useSchedule() {
    const [state, setState] = useState<UserState>(INITIAL_STATE);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const res = await fetch('/api/progress');
            if (res.ok) {
                const history: DailyProgress[] = await res.json();
                // Determine current day based on history
                // If no history, day 1. If history, last completed day + 1.
                // Assuming history is sorted by day.
                let nextDay = 1;
                if (history.length > 0) {
                    const lastEntry = history[history.length - 1];
                    nextDay = lastEntry.day + 1;
                }

                setState({
                    ...INITIAL_STATE,
                    history,
                    currentDay: Math.min(nextDay, 21) // Cap at 21 per logic
                });
            }
        } catch (error) {
            console.error('Failed to fetch progress:', error);
        } finally {
            setIsLoaded(true);
        }
    };

    const getDifficulty = (day: number): Difficulty => {
        if (day <= SCHEDULE_CONFIG.easy.end) return 'Easy';
        if (day <= SCHEDULE_CONFIG.medium.end) return 'Medium';
        return 'Hard';
    };

    const getTargetDuration = (day: number): number => {
        if (day <= SCHEDULE_CONFIG.easy.end) return SCHEDULE_CONFIG.easy.duration;
        if (day <= SCHEDULE_CONFIG.medium.end) return SCHEDULE_CONFIG.medium.duration;
        return SCHEDULE_CONFIG.hard.duration;
    };

    const completeDay = async (result: Omit<DailyProgress, 'day' | 'date' | 'completed'>) => {
        try {
            const payload = {
                ...result,
                day: state.currentDay,
                date: new Date().toISOString(),
                completed: true,
            };

            const res = await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const savedEntry = await res.json();
                setState(prev => ({
                    ...prev,
                    history: [...prev.history, savedEntry],
                    currentDay: Math.min(prev.currentDay + 1, 21)
                }));
            }
        } catch (error) {
            console.error('Failed to save progress:', error);
        }
    };

    return {
        currentDay: state.currentDay,
        difficulty: getDifficulty(state.currentDay),
        targetDuration: getTargetDuration(state.currentDay),
        history: state.history,
        isLoaded,
        completeDay,
    };
}
