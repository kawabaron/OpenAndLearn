/**
 * クイズフローサービス
 * 出題 → 判定 → ログ保存 → 解除付与 の一連処理
 */

import { answerLogRepository } from '../../data/repositories/answerLogRepository';
import { questionRepository } from '../../data/repositories/questionRepository';
import { sessionUnlockRepository } from '../../data/repositories/sessionUnlockRepository';
import { screenTimeBridge } from '../../native';
import { minutesFromNowISO, nowISO } from '../../utils/date';
import { generateId } from '../../utils/id';
import { AnswerLog, AppSettings, QuestionItem, QuizResult, SessionUnlock } from '../models';

export const quizFlowService = {
    /**
     * 次の問題を取得
     */
    async getNextQuestion(settings: AppSettings): Promise<QuestionItem | null> {
        return questionRepository.getNextQuestion(settings.difficultyLevel);
    },

    /**
     * 回答を処理
     */
    async processAnswer(
        question: QuestionItem,
        selectedIndex: number,
        settings: AppSettings,
        triggerContext: 'gate' | 'manual' = 'manual'
    ): Promise<QuizResult> {
        const isCorrect = selectedIndex === question.answerIndex;

        // ログ保存
        const log: AnswerLog = {
            id: generateId(),
            questionId: question.id,
            prompt: question.prompt,
            selectedIndex,
            correctIndex: question.answerIndex,
            isCorrect,
            isSkipped: false,
            answeredAt: nowISO(),
            triggerContext,
            level: question.level,
        };
        await answerLogRepository.save(log);
        await questionRepository.addRecentId(question.id);

        // 解除判定
        if (isCorrect) {
            const unlockEndAt = minutesFromNowISO(settings.unlockDurationMinutes);
            const session: SessionUnlock = {
                id: generateId(),
                startAt: nowISO(),
                endAt: unlockEndAt,
                reason: 'correct',
                isActive: true,
            };
            await sessionUnlockRepository.setUnlock(session);

            // Native bridge 通知（モック時はダミー処理）
            try {
                const summary = await screenTimeBridge.getCurrentSelectionSummary();
                if (summary.selectionId) {
                    await screenTimeBridge.setTemporaryUnlock({
                        selectionId: summary.selectionId,
                        startAtISO: session.startAt,
                        endAtISO: session.endAt,
                        reason: 'correct',
                    });
                }
            } catch {
                // Phase 1ではエラーを無視
            }

            return {
                isCorrect: true,
                isSkipped: false,
                unlockGranted: true,
                unlockEndAt,
                explanation: question.explanation,
            };
        }

        return {
            isCorrect: false,
            isSkipped: false,
            unlockGranted: false,
            explanation: question.explanation,
        };
    },

    /**
     * スキップ処理
     */
    async processSkip(
        question: QuestionItem,
        settings: AppSettings,
        triggerContext: 'gate' | 'manual' = 'manual'
    ): Promise<QuizResult> {
        // ログ保存
        const log: AnswerLog = {
            id: generateId(),
            questionId: question.id,
            prompt: question.prompt,
            selectedIndex: null,
            correctIndex: question.answerIndex,
            isCorrect: false,
            isSkipped: true,
            answeredAt: nowISO(),
            triggerContext,
            level: question.level,
        };
        await answerLogRepository.save(log);
        await questionRepository.addRecentId(question.id);

        // スキップ時の解除判定
        if (settings.skipUnlockMinutes > 0) {
            const unlockEndAt = minutesFromNowISO(settings.skipUnlockMinutes);
            const session: SessionUnlock = {
                id: generateId(),
                startAt: nowISO(),
                endAt: unlockEndAt,
                reason: 'skip',
                isActive: true,
            };
            await sessionUnlockRepository.setUnlock(session);

            try {
                const summary = await screenTimeBridge.getCurrentSelectionSummary();
                if (summary.selectionId) {
                    await screenTimeBridge.setTemporaryUnlock({
                        selectionId: summary.selectionId,
                        startAtISO: session.startAt,
                        endAtISO: session.endAt,
                        reason: 'skip',
                    });
                }
            } catch {
                // Phase 1ではエラーを無視
            }

            return {
                isCorrect: false,
                isSkipped: true,
                unlockGranted: true,
                unlockEndAt,
                explanation: question.explanation,
            };
        }

        return {
            isCorrect: false,
            isSkipped: true,
            unlockGranted: false,
            explanation: question.explanation,
        };
    },
};
