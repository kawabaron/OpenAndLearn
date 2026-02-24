import { create } from 'zustand';
import { DEFAULT_SETTINGS } from '../constants/defaults';
import { settingsRepository } from '../data/repositories/settingsRepository';
import { AppSettings } from '../domain/models/settings';

type SettingsState = {
    settings: AppSettings;
    isLoaded: boolean;
    loadSettings: () => Promise<void>;
    updateSettings: (partial: Partial<AppSettings>) => Promise<void>;
    completeOnboarding: () => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: { ...DEFAULT_SETTINGS },
    isLoaded: false,

    loadSettings: async () => {
        const settings = await settingsRepository.getSettings();
        set({ settings, isLoaded: true });
    },

    updateSettings: async (partial: Partial<AppSettings>) => {
        const updated = await settingsRepository.updateSettings(partial);
        set({ settings: updated });
    },

    completeOnboarding: async () => {
        await get().updateSettings({ onboardingCompleted: true });
    },
}));
