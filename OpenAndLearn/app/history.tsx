import { AnswerLog } from '@/src/domain/models';
import { useAppStore } from '@/src/stores/appStore';
import { formatDate } from '@/src/utils/date';
import { calculateDailyStats, getWrongAnswerLogs } from '@/src/utils/stats';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
    const { allLogs, loadAllLogs } = useAppStore();
    const [expandedDate, setExpandedDate] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            loadAllLogs();
        }, [])
    );

    const dailyStats = calculateDailyStats(allLogs, 7);
    const wrongLogs = getWrongAnswerLogs(allLogs, 20);

    // 特定の日のログを取得
    const getLogsForDate = (dateStr: string): AnswerLog[] => {
        return allLogs
            .filter((log) => {
                const logDate = new Date(log.answeredAt);
                return formatDate(logDate) === dateStr;
            })
            .sort(
                (a, b) =>
                    new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime()
            );
    };

    const toggleDate = (dateStr: string) => {
        setExpandedDate(expandedDate === dateStr ? null : dateStr);
    };

    // 共通のログ表示コンポーネント
    const renderLogItem = (item: AnswerLog) => (
        <View style={styles.logRow} key={item.id}>
            <View style={styles.logHeader}>
                <Text style={styles.logPrompt}>{item.prompt}</Text>
                <View
                    style={[
                        styles.logResultBadge,
                        {
                            backgroundColor: item.isCorrect
                                ? '#E8F5E9'
                                : item.isSkipped
                                    ? '#FFF3E0'
                                    : '#FFEBEE',
                        },
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 11,
                            fontWeight: '700',
                            color: item.isCorrect
                                ? '#2E7D32'
                                : item.isSkipped
                                    ? '#E65100'
                                    : '#C62828',
                        }}
                    >
                        {item.isCorrect ? '正解' : item.isSkipped ? 'スキップ' : '不正解'}
                    </Text>
                </View>
            </View>
            <Text style={styles.logDetail}>
                選択: {item.selectedChoice ?? (item.selectedIndex != null ? `選択肢${item.selectedIndex + 1}` : '-')}
                {' → '}
                正解: {item.correctChoice ?? `選択肢${item.correctIndex + 1}`}
            </Text>
        </View>
    );

    const renderDayItem = ({
        item,
    }: {
        item: { date: string; totalCount: number; correctCount: number; accuracy: number };
    }) => {
        const isExpanded = expandedDate === item.date;
        const dayLogs = isExpanded ? getLogsForDate(item.date) : [];

        return (
            <View>
                <TouchableOpacity
                    style={styles.dayRow}
                    onPress={() => item.totalCount > 0 && toggleDate(item.date)}
                    activeOpacity={item.totalCount > 0 ? 0.6 : 1}
                >
                    <View style={styles.dayLeft}>
                        <Text style={styles.dayDate}>
                            {formatDisplayDate(item.date)}
                        </Text>
                        {item.totalCount > 0 && (
                            <Text style={styles.expandIcon}>
                                {isExpanded ? '▼' : '▶'}
                            </Text>
                        )}
                    </View>
                    <View style={styles.dayStats}>
                        <Text style={styles.dayCount}>{item.totalCount}問</Text>
                        <View
                            style={[
                                styles.accuracyBadge,
                                {
                                    backgroundColor:
                                        item.accuracy >= 80
                                            ? '#E8F5E9'
                                            : item.accuracy >= 50
                                                ? '#FFF3E0'
                                                : '#FFEBEE',
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.accuracyText,
                                    {
                                        color:
                                            item.accuracy >= 80
                                                ? '#2E7D32'
                                                : item.accuracy >= 50
                                                    ? '#E65100'
                                                    : '#C62828',
                                    },
                                ]}
                            >
                                {item.totalCount > 0 ? `${item.accuracy}%` : '-'}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* 展開時の詳細 */}
                {isExpanded && dayLogs.length > 0 && (
                    <View style={styles.expandedContainer}>
                        {dayLogs.map((log, i) => (
                            <View key={log.id}>
                                {renderLogItem(log)}
                                {i < dayLogs.length - 1 && (
                                    <View style={styles.logDivider} />
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <FlatList
                data={[]}
                renderItem={null}
                ListHeaderComponent={
                    <View style={styles.content}>
                        {/* 直近7日統計 */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>📊 直近7日間</Text>
                            <Text style={styles.sectionHint}>
                                日付をタップで詳細を表示
                            </Text>
                            <View style={styles.sectionCard}>
                                {dailyStats.map((day, i) => (
                                    <View key={day.date}>
                                        {renderDayItem({ item: day })}
                                        {i < dailyStats.length - 1 && (
                                            <View style={styles.divider} />
                                        )}
                                    </View>
                                ))}
                                {dailyStats.length === 0 && (
                                    <Text style={styles.emptyText}>
                                        まだデータがありません
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* 誤答リスト */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                ❌ 最近の誤答（最新20件）
                            </Text>
                            <View style={styles.sectionCard}>
                                {wrongLogs.map((log, i) => (
                                    <View key={log.id}>
                                        {renderLogItem(log)}
                                        {i < wrongLogs.length - 1 && (
                                            <View style={styles.divider} />
                                        )}
                                    </View>
                                ))}
                                {wrongLogs.length === 0 && (
                                    <Text style={styles.emptyText}>
                                        誤答はありません 🎉
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            />
        </SafeAreaView>
    );
}

function formatDisplayDate(dateStr: string): string {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === formatSimple(today)) return '今日';
    if (dateStr === formatSimple(yesterday)) return '昨日';

    return d.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
    });
}

function formatSimple(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
    ).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8FC',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#8E8E93',
        marginBottom: 4,
        marginLeft: 4,
    },
    sectionHint: {
        fontSize: 12,
        color: '#AEAEB2',
        marginBottom: 10,
        marginLeft: 4,
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    dayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    dayLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dayDate: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    expandIcon: {
        fontSize: 10,
        color: '#AEAEB2',
    },
    dayStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dayCount: {
        fontSize: 14,
        color: '#8E8E93',
    },
    accuracyBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        minWidth: 48,
        alignItems: 'center',
    },
    accuracyText: {
        fontSize: 13,
        fontWeight: '700',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#E5E5EA',
        marginHorizontal: 16,
    },
    expandedContainer: {
        backgroundColor: '#F9F9FB',
        marginHorizontal: 8,
        marginBottom: 8,
        borderRadius: 10,
        paddingVertical: 4,
    },
    logRow: {
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    logPrompt: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1C1E',
        flex: 1,
        marginRight: 8,
    },
    logResultBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    logDetail: {
        fontSize: 13,
        color: '#636366',
        lineHeight: 20,
    },
    logDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 14,
    },
    emptyText: {
        fontSize: 14,
        color: '#AEAEB2',
        textAlign: 'center',
        paddingVertical: 24,
    },
});
