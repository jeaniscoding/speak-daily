'use client';

import { useState, useEffect } from 'react';
import { UserState, DailyProgress, SCHEDULE_CONFIG, Difficulty } from '../types';

const STORAGE_KEY = 'speak_daily_progress';

const INITIAL_STATE: UserState = {
    currentDay: 1,
    history: [],
    interests: [],
};

export function useSchedule() {
    const [state, setState] = useState<UserState>(INITIAL_STATE);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setState(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse progress', e);
            }
        }
        setIsLoaded(true);
    }, []);

    const saveState = (newState: UserState) => {
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
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

    const completeDay = (result: Omit<DailyProgress, 'day' | 'date' | 'completed'>) => {
        const newHistory = [
            ...state.history,
            {
                ...result,
                day: state.currentDay,
                date: new Date().toISOString(),
                completed: true,
            },
        ];

        const nextDay = Math.min(state.currentDay + 1, 21); // Cap at 21 for now, or loop?
        // Actually, user might want to continue practicing. Let's cap at 21 for the "Challenge" but allow free practice later.

        saveState({
            ...state,
            history: newHistory,
            currentDay: nextDay,
        });
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
