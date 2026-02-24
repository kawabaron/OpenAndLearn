import { DifficultyLevel } from './question';

export type AnswerLog = {
    id: string;
    questionId: string;
    prompt: string;
    selectedIndex: number | null;
    correctIndex: number;
    isCorrect: boolean;
    isSkipped: boolean;
    answeredAt: string; // ISO8601
    triggerContext: 'gate' | 'manual';
    level: DifficultyLevel;
};
