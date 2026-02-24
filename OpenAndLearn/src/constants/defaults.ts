import { AppSettings } from '../domain/models/settings';

export const DEFAULT_SETTINGS: AppSettings = {
    unlockDurationMinutes: 5,
    skipEnabled: true,
    skipUnlockMinutes: 1,
    difficultyLevel: 'beginner',
    activeHoursEnabled: false,
    activeStartHour: 9,
    activeEndHour: 23,
    onboardingCompleted: false,
};
