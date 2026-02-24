export type SessionUnlock = {
    id: string;
    startAt: string; // ISO8601
    endAt: string;   // ISO8601
    reason: 'correct' | 'skip';
    isActive: boolean;
};

export type QuizResult = {
    isCorrect: boolean;
    isSkipped: boolean;
    unlockGranted: boolean;
    unlockEndAt?: string;
    explanation: string;
};
