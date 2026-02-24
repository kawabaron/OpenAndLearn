import { remainingMinutesText } from '@/src/utils/date';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UnlockResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        isCorrect: string;
        isSkipped: string;
        unlockGranted: string;
        unlockEndAt: string;
        explanation: string;
    }>();

    const isCorrect = params.isCorrect === '1';
    const isSkipped = params.isSkipped === '1';
    const unlockGranted = params.unlockGranted === '1';
    const unlockEndAt = params.unlockEndAt || '';
    const explanation = params.explanation || '';

    const [remainingText, setRemainingText] = useState('');

    useEffect(() => {
        if (unlockEndAt) {
            setRemainingText(remainingMinutesText(unlockEndAt));
            const interval = setInterval(() => {
                setRemainingText(remainingMinutesText(unlockEndAt));
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [unlockEndAt]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* ヒーローエリア */}
                <View
                    style={[
                        styles.hero,
                        {
                            backgroundColor: unlockGranted ? '#E8F5E9' : '#FFF3E0',
                        },
                    ]}
                >
                    <Text style={styles.heroEmoji}>
                        {unlockGranted ? '🔓' : isCorrect ? '✅' : '❌'}
                    </Text>
                    <Text
                        style={[
                            styles.heroTitle,
                            {
                                color: unlockGranted ? '#2E7D32' : '#E65100',
                            },
                        ]}
                    >
                        {unlockGranted
                            ? isSkipped
                                ? 'スキップで一時解除'
                                : '正解！アプリが使えます'
                            : '不正解'}
                    </Text>

                    {unlockGranted && remainingText && (
                        <View style={styles.timerContainer}>
                            <Text style={styles.timerIcon}>⏱️</Text>
                            <Text style={styles.timerText}>{remainingText}</Text>
                        </View>
                    )}
                </View>

                {/* 解説 */}
                {explanation && (
                    <View style={styles.explanationCard}>
                        <Text style={styles.explanationTitle}>📖 解説</Text>
                        <Text style={styles.explanationText}>{explanation}</Text>
                    </View>
                )}

                {/* メッセージ */}
                {unlockGranted && (
                    <View style={styles.messageCard}>
                        <Text style={styles.messageText}>
                            対象アプリが一時的に利用可能です。{'\n'}
                            時間が過ぎると再度制限がかかります。
                        </Text>
                    </View>
                )}

                {!unlockGranted && !isSkipped && (
                    <View style={styles.messageCard}>
                        <Text style={styles.messageText}>
                            残念、正解ではありませんでした。{'\n'}
                            次回チャレンジしてみましょう！
                        </Text>
                    </View>
                )}
            </View>

            {/* フッターボタン */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => router.replace('/')}
                >
                    <Text style={styles.homeButtonText}>🏠 ホームへ戻る</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8FC',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    hero: {
        alignItems: 'center',
        paddingVertical: 40,
        borderRadius: 24,
        marginBottom: 24,
    },
    heroEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    timerIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    timerText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2E7D32',
    },
    explanationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    explanationTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    explanationText: {
        fontSize: 15,
        color: '#636366',
        lineHeight: 24,
    },
    messageCard: {
        backgroundColor: '#F2F2F7',
        borderRadius: 14,
        padding: 16,
    },
    messageText: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 22,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    homeButton: {
        backgroundColor: '#6C5CE7',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    homeButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
