import { Difficulty } from '../types';

const MOCK_TOPICS: Record<Difficulty, string[]> = {
    Easy: [
        "Describe your favorite meal.",
        "Talk about a hobby you enjoy.",
        "What is your favorite season and why?",
        "Describe your best friend.",
        "What was the last movie you watched?",
    ],
    Medium: [
        "If you could travel anywhere, where would you go?",
        "Discuss the importance of daily exercise.",
        "What is a skill you would like to learn?",
        "Talk about a challenge you overcame recently.",
        "How do you handle stress?",
    ],
    Hard: [
        "Is technology making us more or less connected?",
        "Should education be free for everyone?",
        "The impact of climate change on future generations.",
        "What is the meaning of success to you?",
        "Discuss the ethics of artificial intelligence.",
    ],
};

export async function generateTopic(difficulty: Difficulty, interests: string[] = []): Promise<string> {
    // TODO: Integrate with LLM API (Gemini/OpenAI) using interests

    // For now, return a random mock topic based on difficulty
    const topics = MOCK_TOPICS[difficulty];
    const randomIndex = Math.floor(Math.random() * topics.length);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return topics[randomIndex];
}
