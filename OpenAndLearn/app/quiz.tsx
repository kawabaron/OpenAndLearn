import { ChoiceButton } from '@/src/components/ChoiceButton';
import { useQuizStore } from '@/src/stores/quizStore';
import { useSettingsStore } from '@/src/stores/settingsStore';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuizScreen() {
    const router = useRouter();
    const {
        phase,
        currentQuestion,
        selectedIndex,
        result,
        isProcessing,
        loadQuestion,
        submitAnswer,
        skipQuestion,
    } = useQuizStore();
    const { settings } = useSettingsStore();

    useEffect(() => {
        loadQuestion();
    }, []);

    const getChoiceState = (index: number) => {
        if (phase !== 'result' || !result || !currentQuestion) return 'default';
        if (index === currentQuestion.answerIndex) return 'correct';
        if (index === selectedIndex && !result.isCorrect) return 'wrong';
        return 'dimmed';
    };

    const handleAnswer = (index: number) => {
        if (phase !== 'question' || isProcessing) return;
        submitAnswer(index);
    };

    const handleGoToResult = () => {
        if (!result) return;
        router.replace({
            pathname: '/unlock-result',
            params: {
                isCorrect: result.isCorrect ? '1' : '0',
                isSkipped: result.isSkipped ? '1' : '0',
                unlockGranted: result.unlockGranted ? '1' : '0',
                unlockEndAt: result.unlockEndAt || '',
                explanation: result.explanation,
            },
        });
    };

    if (phase === 'loading') {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#6C5CE7" />
                    <Text style={styles.loadingText}>問題を読み込み中...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!currentQuestion) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loading}>
                    <Text style={styles.errorText}>問題が見つかりませんでした</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadQuestion}>
                        <Text style={styles.retryButtonText}>再読み込み</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.content}>
                {/* 問題文 */}
                <View style={styles.questionContainer}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>
                            {currentQuestion.level === 'beginner' ? '初級' : '中級'}
                        </Text>
                    </View>
                    <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
                </View>

                {/* 選択肢 */}
                <View style={styles.choicesContainer}>
                    {currentQuestion.choices.map((choice, index) => (
                        <ChoiceButton
                            key={index}
                            label={choice}
                            index={index}
                            onPress={handleAnswer}
                            disabled={phase === 'result' || isProcessing}
                            state={getChoiceState(index)}
                        />
                    ))}
                </View>

                {/* 結果表示エリア */}
                {phase === 'result' && result && (
                    <View style={styles.resultContainer}>
                        <View
                            style={[
                                styles.resultBanner,
                                {
                                    backgroundColor: result.isCorrect
                                        ? '#E8F5E9'
                                        : result.isSkipped
                                            ? '#FFF3E0'
                                            : '#FFEBEE',
                                },
                            ]}
                        >
                            <Text style={styles.resultEmoji}>
                                {result.isCorrect ? '🎉' : result.isSkipped ? '⏭️' : '😢'}
                            </Text>
                            <Text
                                style={[
                                    styles.resultText,
                                    {
                                        color: result.isCorrect
                                            ? '#2E7D32'
                                            : result.isSkipped
                                                ? '#E65100'
                                                : '#C62828',
                                    },
                                ]}
                            >
                                {result.isCorrect
                                    ? '正解！'
                                    : result.isSkipped
                                        ? 'スキップしました'
                                        : '不正解...'}
                            </Text>
                        </View>
                        <Text style={styles.explanation}>{result.explanation}</Text>

                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                {
                                    backgroundColor: result.unlockGranted ? '#6C5CE7' : '#8E8E93',
                                },
                            ]}
                            onPress={handleGoToResult}
                        >
                            <Text style={styles.continueButtonText}>
                                {result.unlockGranted ? '解除する →' : 'ホームへ戻る'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* スキップボタン */}
                {phase === 'question' && settings.skipEnabled && (
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={skipQuestion}
                        disabled={isProcessing}
                    >
                        <Text style={styles.skipButtonText}>スキップ</Text>
                    </TouchableOpacity>
                )}
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
        paddingTop: 8,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 15,
        color: '#8E8E93',
        marginTop: 12,
    },
    errorText: {
        fontSize: 16,
        color: '#C62828',
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#6C5CE7',
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    questionContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        alignItems: 'center',
    },
    levelBadge: {
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 16,
    },
    levelText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8E8E93',
    },
    questionText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1C1C1E',
        textAlign: 'center',
        lineHeight: 32,
    },
    choicesContainer: {
        marginBottom: 12,
    },
    resultContainer: {
        marginTop: 4,
    },
    resultBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 14,
        marginBottom: 12,
    },
    resultEmoji: {
        fontSize: 24,
        marginRight: 10,
    },
    resultText: {
        fontSize: 20,
        fontWeight: '800',
    },
    explanation: {
        fontSize: 14,
        color: '#636366',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    continueButton: {
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    skipButton: {
        alignItems: 'center',
        paddingVertical: 14,
    },
    skipButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#8E8E93',
    },
});
