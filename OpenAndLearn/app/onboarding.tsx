import { screenTimeBridge } from '@/src/native';
import { useSettingsStore } from '@/src/stores/settingsStore';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type OnboardingPage = {
    id: string;
    emoji: string;
    title: string;
    description: string;
    color: string;
};

const PAGES: OnboardingPage[] = [
    {
        id: '1',
        emoji: '🎯',
        title: '学んでから、開こう',
        description:
            'SNSやゲームを開く前に\n英語の4択問題を1問解くだけ。\n\nスクリーンタイムを減らしながら\n英語力をアップできます。',
        color: '#6C5CE7',
    },
    {
        id: '2',
        emoji: '📱',
        title: '使い方はかんたん',
        description:
            '1. 制限したいアプリを選ぶ\n2. アプリを開こうとすると問題が出る\n3. 正解すると一時的に使える\n\nスキップ設定もカスタマイズ可能！',
        color: '#00B894',
    },
    {
        id: '3',
        emoji: '🔒',
        title: 'Screen Time 権限',
        description:
            'アプリの使用制限には\niOSのScreen Time権限が必要です。\n\n次のステップで権限を\n許可してください。',
        color: '#E17055',
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const { completeOnboarding } = useSettingsStore();
    const [isRequesting, setIsRequesting] = useState(false);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const page = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentPage(page);
    };

    const goToNext = () => {
        if (currentPage < PAGES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentPage + 1 });
        }
    };

    const handleRequestPermission = async () => {
        setIsRequesting(true);
        try {
            await screenTimeBridge.requestAuthorization();
        } catch {
            // Phase 1では無視
        }
        setIsRequesting(false);
    };

    const handleComplete = async () => {
        await completeOnboarding();
        router.replace('/');
    };

    const renderPage = ({ item }: { item: OnboardingPage }) => (
        <View style={[styles.page, { width }]}>
            <View style={[styles.emojiContainer, { backgroundColor: item.color + '15' }]}>
                <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={[styles.pageTitle, { color: item.color }]}>{item.title}</Text>
            <Text style={styles.pageDescription}>{item.description}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={PAGES}
                renderItem={renderPage}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            />

            {/* ページインジケータ */}
            <View style={styles.indicatorContainer}>
                {PAGES.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.indicator,
                            currentPage === i && styles.indicatorActive,
                        ]}
                    />
                ))}
            </View>

            {/* ボタン */}
            <View style={styles.buttonContainer}>
                {currentPage < PAGES.length - 1 ? (
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: PAGES[currentPage].color }]}
                        onPress={goToNext}
                    >
                        <Text style={styles.buttonText}>次へ</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.lastPageButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.permissionButton]}
                            onPress={handleRequestPermission}
                            disabled={isRequesting}
                        >
                            <Text style={styles.buttonText}>
                                {isRequesting ? '要求中...' : '🔒 Screen Time権限を許可'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#6C5CE7' }]}
                            onPress={handleComplete}
                        >
                            <Text style={styles.buttonText}>はじめる 🚀</Text>
                        </TouchableOpacity>
                    </View>
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
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emojiContainer: {
        width: 120,
        height: 120,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    emoji: {
        fontSize: 56,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: -0.5,
    },
    pageDescription: {
        fontSize: 16,
        color: '#636366',
        textAlign: 'center',
        lineHeight: 26,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 20,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D1D1D6',
    },
    indicatorActive: {
        width: 24,
        backgroundColor: '#6C5CE7',
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    button: {
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    lastPageButtons: {
        gap: 12,
    },
    permissionButton: {
        backgroundColor: '#E17055',
    },
});
