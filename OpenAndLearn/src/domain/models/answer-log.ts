import { DifficultyLevel } from './question';

export type AnswerLog = {
    id: string;
    questionId: string;
    prompt: string;
    selectedIndex: number | null;
    correctIndex: number;
    selectedChoice?: string;  // 選択した選択肢のテキスト
    correctChoice?: string;   // 正解の選択肢のテキスト
    isCorrect: boolean;
    isSkipped: boolean;
    answeredAt: string; // ISO8601
    triggerContext: 'gate' | 'manual';
    level: DifficultyLevel;
};
