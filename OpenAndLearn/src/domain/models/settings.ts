import { DifficultyLevel } from './question';

export type AppSettings = {
    unlockDurationMinutes: 1 | 5 | 10;
    skipEnabled: boolean;
    skipUnlockMinutes: 0 | 1;
    difficultyLevel: DifficultyLevel;
    activeHoursEnabled: boolean;
    activeStartHour: number; // 0-23
    activeEndHour: number;   // 0-23
    onboardingCompleted: boolean;
};
