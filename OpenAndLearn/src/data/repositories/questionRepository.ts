import AsyncStorage from '@react-native-async-storage/async-storage';
import { DifficultyLevel, QuestionItem } from '../../domain/models/question';
import beginnerQuestions from '../assets/questions_beginner.json';
import intermediateQuestions from '../assets/questions_intermediate.json';
import { STORAGE_KEYS } from '../storage/keys';

const allQuestions: QuestionItem[] = [
    ...(beginnerQuestions as QuestionItem[]),
    ...(intermediateQuestions as QuestionItem[]),
];

const RECENT_IDS_LIMIT = 20;

/**
 * 問題リポジトリ
 */
export const questionRepository = {
    /**
     * 全問題を取得
     */
    loadAllQuestions(): QuestionItem[] {
        return allQuestions;
    },

    /**
     * レベル別の問題プールから次の問題を取得
     * 直近N問は除外する
     */
    async getNextQuestion(
        level: DifficultyLevel,
        recentIds?: string[]
    ): Promise<QuestionItem | null> {
        const recent = recentIds ?? (await this.getRecentIds());

        // レベルに応じた問題プール
        let pool: QuestionItem[];
        if (level === 'mixed') {
            pool = allQuestions;
        } else {
            pool = allQuestions.filter((q) => q.level === level);
        }

        if (pool.length === 0) return null;

        // 直近回答済みを除外
        let candidates = pool.filter((q) => !recent.includes(q.id));

        // 除外後に候補がなければ全問題から選択（重複許可）
        if (candidates.length === 0) {
            candidates = pool;
        }

        // ランダム選択
        const index = Math.floor(Math.random() * candidates.length);
        return candidates[index];
    },

    /**
     * 直近のQuestion IDリストを取得
     */
    async getRecentIds(): Promise<string[]> {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEYS.QUESTION_RECENT_IDS);
            return json ? JSON.parse(json) : [];
        } catch {
            return [];
        }
    },

    /**
     * 直近のQuestion IDリストに追加
     */
    async addRecentId(questionId: string): Promise<void> {
        const recentIds = await this.getRecentIds();
        recentIds.unshift(questionId);
        // 上限を超えた分を削除
        const trimmed = recentIds.slice(0, RECENT_IDS_LIMIT);
        await AsyncStorage.setItem(
            STORAGE_KEYS.QUESTION_RECENT_IDS,
            JSON.stringify(trimmed)
        );
    },
};
