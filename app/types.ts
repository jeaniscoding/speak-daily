export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface DailyProgress {
    day: number;
    completed: boolean;
    score?: number;
    transcript?: string;
    topic?: string;
    date: string; // ISO string
    videoPath?: string;
}

export interface UserState {
    currentDay: number; // 1-21
    history: DailyProgress[];
    interests: string[];
}

export const SCHEDULE_CONFIG = {
    easy: { start: 1, end: 7, duration: 60, label: 'Easy' },
    medium: { start: 8, end: 14, duration: 60, label: 'Medium' },
    hard: { start: 15, end: 21, duration: 90, label: 'Hard' },
} as const;
