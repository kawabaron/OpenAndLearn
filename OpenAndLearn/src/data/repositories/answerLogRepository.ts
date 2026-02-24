import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnswerLog } from '../../domain/models/answer-log';
import { STORAGE_KEYS } from '../storage/keys';

/**
 * 回答ログリポジトリ
 */
export const answerLogRepository = {
    /**
     * 全ログを取得
     */
    async getAllLogs(): Promise<AnswerLog[]> {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEYS.ANSWER_LOGS);
            return json ? JSON.parse(json) : [];
        } catch {
            return [];
        }
    },

    /**
     * ログを保存（末尾に追加）
     */
    async save(log: AnswerLog): Promise<void> {
        const logs = await this.getAllLogs();
        logs.push(log);
        await AsyncStorage.setItem(STORAGE_KEYS.ANSWER_LOGS, JSON.stringify(logs));
    },

    /**
     * 今日のログを取得
     */
    async getTodayLogs(): Promise<AnswerLog[]> {
        const logs = await this.getAllLogs();
        const today = new Date();
        return logs.filter((log) => {
            const d = new Date(log.answeredAt);
            return (
                d.getFullYear() === today.getFullYear() &&
                d.getMonth() === today.getMonth() &&
                d.getDate() === today.getDate()
            );
        });
    },

    /**
     * 直近N件のログを取得
     */
    async getRecentLogs(limit: number): Promise<AnswerLog[]> {
        const logs = await this.getAllLogs();
        return logs
            .sort(
                (a, b) =>
                    new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime()
            )
            .slice(0, limit);
    },

    /**
     * 不正解ログを取得（最新N件）
     */
    async getWrongLogs(limit: number): Promise<AnswerLog[]> {
        const logs = await this.getAllLogs();
        return logs
            .filter((log) => !log.isCorrect && !log.isSkipped)
            .sort(
                (a, b) =>
                    new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime()
            )
            .slice(0, limit);
    },
};
