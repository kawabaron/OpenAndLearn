import { StatCard } from '@/src/components/StatCard';
import { useAppStore } from '@/src/stores/appStore';
import { useSettingsStore } from '@/src/stores/settingsStore';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const router = useRouter();
    const { todayStats, selectionSummary, refreshStats, refreshSelection, isLoading } =
        useAppStore();
    const { settings } = useSettingsStore();
    const [refreshing, setRefreshing] = React.useState(false);

    useFocusEffect(
        useCallback(() => {
            refreshStats();
            refreshSelection();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([refreshStats(), refreshSelection()]);
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C5CE7" />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* ヘッダー */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>📚</Text>
                    <Text style={styles.title}>OpenAndLearn</Text>
                    <Text style={styles.subtitle}>学んでから、開こう。</Text>
                </View>

                {/* 統計カード */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <StatCard
                            title="今日の回答"
                            value={todayStats.totalCount}
                            subtitle={`正解 ${todayStats.correctCount}問`}
                            icon="📝"
                            color="#6C5CE7"
                        />
                    </View>
                    <View style={styles.statItem}>
                        <StatCard
                            title="正答率"
                            value={`${todayStats.accuracy}%`}
                            subtitle="今日の成績"
                            icon="🎯"
                            color="#00B894"
                        />
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <StatCard
                            title="対象アプリ"
                            value={selectionSummary.appCount}
                            subtitle="制限中"
                            icon="📱"
                            color="#E17055"
                        />
                    </View>
                    <View style={styles.statItem}>
                        <StatCard
                            title="解除時間"
                            value={`${settings.unlockDurationMinutes}分`}
                            subtitle={settings.skipEnabled ? 'スキップ可' : 'スキップ不可'}
                            icon="⏱️"
                            color="#FDCB6E"
                        />
                    </View>
                </View>

                {/* CTAボタン */}
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.push('/quiz')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.primaryButtonIcon}>🧠</Text>
                    <Text style={styles.primaryButtonText}>今すぐ1問解く</Text>
                </TouchableOpacity>

                <View style={styles.secondaryButtons}>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push('/app-selection')}
                    >
                        <Text style={styles.secondaryButtonIcon}>📱</Text>
                        <Text style={styles.secondaryButtonText}>対象アプリを設定</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push('/rule-settings')}
                    >
                        <Text style={styles.secondaryButtonIcon}>⚙️</Text>
                        <Text style={styles.secondaryButtonText}>ルール設定</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push('/history')}
                    >
                        <Text style={styles.secondaryButtonIcon}>📊</Text>
                        <Text style={styles.secondaryButtonText}>学習履歴</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8FC',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 24,
    },
    greeting: {
        fontSize: 48,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1C1C1E',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#8E8E93',
        marginTop: 4,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    statItem: {
        flex: 1,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6C5CE7',
        paddingVertical: 18,
        borderRadius: 16,
        marginTop: 12,
        marginBottom: 20,
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    primaryButtonIcon: {
        fontSize: 22,
        marginRight: 10,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    secondaryButtons: {
        gap: 10,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    secondaryButtonIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
    },
});
