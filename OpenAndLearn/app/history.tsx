import { AnswerLog } from '@/src/domain/models';
import { useAppStore } from '@/src/stores/appStore';
import { calculateDailyStats, getWrongAnswerLogs } from '@/src/utils/stats';
import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
    const { allLogs, loadAllLogs } = useAppStore();

    useFocusEffect(
        useCallback(() => {
            loadAllLogs();
        }, [])
    );

    const dailyStats = calculateDailyStats(allLogs, 7);
    const wrongLogs = getWrongAnswerLogs(allLogs, 20);

    const renderDayItem = ({
        item,
    }: {
        item: { date: string; totalCount: number; correctCount: number; accuracy: number };
    }) => (
        <View style={styles.dayRow}>
            <Text style={styles.dayDate}>{formatDisplayDate(item.date)}</Text>
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
        </View>
    );

    const renderWrongItem = ({ item }: { item: AnswerLog }) => (
        <View style={styles.wrongRow}>
            <View style={styles.wrongHeader}>
                <Text style={styles.wrongPrompt}>{item.prompt}</Text>
                <Text style={styles.wrongDate}>
                    {new Date(item.answeredAt).toLocaleDateString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                    })}
                </Text>
            </View>
            <Text style={styles.wrongDetail}>
                選択: {item.selectedIndex != null ? `選択肢${item.selectedIndex + 1}` : '-'} →
                正解: 選択肢{item.correctIndex + 1}
            </Text>
        </View>
    );

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
                            <View style={styles.sectionCard}>
                                {dailyStats.map((day, i) => (
                                    <View key={day.date}>
                                        {renderDayItem({ item: day })}
                                        {i < dailyStats.length - 1 && <View style={styles.divider} />}
                                    </View>
                                ))}
                                {dailyStats.length === 0 && (
                                    <Text style={styles.emptyText}>まだデータがありません</Text>
                                )}
                            </View>
                        </View>

                        {/* 誤答リスト */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>❌ 最近の誤答（最新20件）</Text>
                            <View style={styles.sectionCard}>
                                {wrongLogs.map((log, i) => (
                                    <View key={log.id}>
                                        {renderWrongItem({ item: log })}
                                        {i < wrongLogs.length - 1 && <View style={styles.divider} />}
                                    </View>
                                ))}
                                {wrongLogs.length === 0 && (
                                    <Text style={styles.emptyText}>誤答はありません 🎉</Text>
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
    dayDate: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1C1E',
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
    wrongRow: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    wrongHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    wrongPrompt: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1C1E',
        flex: 1,
        marginRight: 8,
    },
    wrongDate: {
        fontSize: 12,
        color: '#AEAEB2',
    },
    wrongDetail: {
        fontSize: 13,
        color: '#8E8E93',
    },
    emptyText: {
        fontSize: 14,
        color: '#AEAEB2',
        textAlign: 'center',
        paddingVertical: 24,
    },
});
