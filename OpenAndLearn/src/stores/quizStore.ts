import { create } from 'zustand';
import { QuestionItem, QuizResult } from '../domain/models';
import { quizFlowService } from '../domain/services/quizFlowService';
import { useSettingsStore } from './settingsStore';

type QuizPhase = 'loading' | 'question' | 'result';

type QuizState = {
    phase: QuizPhase;
    currentQuestion: QuestionItem | null;
    selectedIndex: number | null;
    result: QuizResult | null;
    isProcessing: boolean;

    loadQuestion: () => Promise<void>;
    submitAnswer: (index: number) => Promise<void>;
    skipQuestion: () => Promise<void>;
    reset: () => void;
};

export const useQuizStore = create<QuizState>((set, get) => ({
    phase: 'loading',
    currentQuestion: null,
    selectedIndex: null,
    result: null,
    isProcessing: false,

    loadQuestion: async () => {
        set({ phase: 'loading', currentQuestion: null, selectedIndex: null, result: null });
        const settings = useSettingsStore.getState().settings;
        const question = await quizFlowService.getNextQuestion(settings);
        if (question) {
            set({ phase: 'question', currentQuestion: question });
        }
    },

    submitAnswer: async (index: number) => {
        const { currentQuestion, isProcessing } = get();
        if (!currentQuestion || isProcessing) return;

        set({ isProcessing: true, selectedIndex: index });

        try {
            const settings = useSettingsStore.getState().settings;
            const result = await quizFlowService.processAnswer(
                currentQuestion,
                index,
                settings,
                'manual'
            );

            set({ phase: 'result', result, isProcessing: false });
        } catch (e) {
            console.error('submitAnswer error:', e);
            // エラー時でも結果を表示できるようフォールバック
            const isCorrect = index === currentQuestion.answerIndex;
            set({
                phase: 'result',
                result: {
                    isCorrect,
                    isSkipped: false,
                    unlockGranted: false,
                    explanation: currentQuestion.explanation,
                },
                isProcessing: false,
            });
        }
    },

    skipQuestion: async () => {
        const { currentQuestion, isProcessing } = get();
        if (!currentQuestion || isProcessing) return;

        set({ isProcessing: true });

        try {
            const settings = useSettingsStore.getState().settings;
            const result = await quizFlowService.processSkip(
                currentQuestion,
                settings,
                'manual'
            );

            set({ phase: 'result', result, isProcessing: false });
        } catch (e) {
            console.error('skipQuestion error:', e);
            set({
                phase: 'result',
                result: {
                    isCorrect: false,
                    isSkipped: true,
                    unlockGranted: false,
                    explanation: currentQuestion?.explanation || '',
                },
                isProcessing: false,
            });
        }
    },

    reset: () => {
        set({
            phase: 'loading',
            currentQuestion: null,
            selectedIndex: null,
            result: null,
            isProcessing: false,
        });
    },
}));
