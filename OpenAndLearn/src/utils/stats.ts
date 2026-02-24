import { AnswerLog } from '../domain/models';
import { formatDate, isToday } from './date';

export type DayStats = {
    date: string;
    totalCount: number;
    correctCount: number;
    accuracy: number; // 0-100
};

/**
 * 今日の統計情報を計算
 */
export function calculateTodayStats(logs: AnswerLog[]): DayStats {
    const todayLogs = logs.filter((log) => isToday(log.answeredAt));
    const totalCount = todayLogs.length;
    const correctCount = todayLogs.filter((log) => log.isCorrect).length;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    return {
        date: formatDate(new Date()),
        totalCount,
        correctCount,
        accuracy,
    };
}

/**
 * 指定日数分の日別統計を計算
 */
export function calculateDailyStats(logs: AnswerLog[], days: number): DayStats[] {
    const stats: DayStats[] = [];
    for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = formatDate(d);
        const dayLogs = logs.filter((log) => {
            const logDate = new Date(log.answeredAt);
            return formatDate(logDate) === dateStr;
        });
        const totalCount = dayLogs.length;
        const correctCount = dayLogs.filter((log) => log.isCorrect).length;
        stats.push({
            date: dateStr,
            totalCount,
            correctCount,
            accuracy: totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0,
        });
    }
    return stats;
}

/**
 * 不正解のログのみ抽出
 */
export function getWrongAnswerLogs(logs: AnswerLog[], limit: number): AnswerLog[] {
    return logs
        .filter((log) => !log.isCorrect && !log.isSkipped)
        .sort((a, b) => new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime())
        .slice(0, limit);
}
