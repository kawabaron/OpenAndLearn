import { create } from 'zustand';
import { answerLogRepository } from '../data/repositories/answerLogRepository';
import { AnswerLog } from '../domain/models';
import { AppSelectionSummary, screenTimeBridge } from '../native';
import { calculateTodayStats, DayStats } from '../utils/stats';

type AppState = {
    todayStats: DayStats;
    selectionSummary: AppSelectionSummary;
    allLogs: AnswerLog[];
    isLoading: boolean;

    refreshStats: () => Promise<void>;
    refreshSelection: () => Promise<void>;
    loadAllLogs: () => Promise<void>;
};

export const useAppStore = create<AppState>((set) => ({
    todayStats: {
        date: '',
        totalCount: 0,
        correctCount: 0,
        accuracy: 0,
    },
    selectionSummary: {
        selectionId: null,
        appCount: 0,
        categoryCount: 0,
    },
    allLogs: [],
    isLoading: true,

    refreshStats: async () => {
        const logs = await answerLogRepository.getAllLogs();
        const todayStats = calculateTodayStats(logs);
        set({ todayStats, allLogs: logs });
    },

    refreshSelection: async () => {
        try {
            const summary = await screenTimeBridge.getCurrentSelectionSummary();
            set({ selectionSummary: summary });
        } catch {
            // Phase 1ではエラーを無視
        }
    },

    loadAllLogs: async () => {
        const logs = await answerLogRepository.getAllLogs();
        const todayStats = calculateTodayStats(logs);
        set({ allLogs: logs, todayStats, isLoading: false });
    },
}));
