/**
 * 日付ユーティリティ
 */

/**
 * 今日の日付を YYYY-MM-DD 形式で返す
 */
export function getTodayDateString(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * ISO8601文字列が今日の日付かどうかを判定
 */
export function isToday(isoString: string): boolean {
    const date = new Date(isoString);
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

/**
 * 現在時刻のISO8601文字列を返す
 */
export function nowISO(): string {
    return new Date().toISOString();
}

/**
 * 指定分数後のISO8601文字列を返す
 */
export function minutesFromNowISO(minutes: number): string {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date.toISOString();
}

/**
 * ISO8601文字列が現在より前かどうかを判定
 */
export function isExpired(isoString: string): boolean {
    return new Date(isoString).getTime() < Date.now();
}

/**
 * ISO8601文字列から「あとN分」の表示文字列を返す
 */
export function remainingMinutesText(endAtISO: string): string {
    const remaining = new Date(endAtISO).getTime() - Date.now();
    if (remaining <= 0) return '期限切れ';
    const minutes = Math.ceil(remaining / (1000 * 60));
    return `あと${minutes}分`;
}

/**
 * 日付を YYYY-MM-DD 形式の文字列に変換
 */
export function formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * N日前の日付文字列の配列を返す (今日含む)
 */
export function getRecentDateStrings(days: number): string[] {
    const dates: string[] = [];
    for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(formatDate(d));
    }
    return dates;
}
