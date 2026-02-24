import { screenTimeBridge } from '@/src/native';
import { useAppStore } from '@/src/stores/appStore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppSelectionScreen() {
    const { selectionSummary, refreshSelection } = useAppStore();
    const [authStatus, setAuthStatus] = useState<string>('unknown');
    const [isSelecting, setIsSelecting] = useState(false);

    useEffect(() => {
        checkAuth();
        refreshSelection();
    }, []);

    const checkAuth = async () => {
        const status = await screenTimeBridge.getAuthorizationStatus();
        setAuthStatus(status);
    };

    const handleRequestAuth = async () => {
        const status = await screenTimeBridge.requestAuthorization();
        setAuthStatus(status);
    };

    const handleSelectApps = async () => {
        setIsSelecting(true);
        try {
            const result = await screenTimeBridge.presentAppSelectionPicker();
            await refreshSelection();
        } catch (e) {
            Alert.alert('エラー', 'アプリ選択に失敗しました');
        }
        setIsSelecting(false);
    };

    const handleApplyRestriction = async () => {
        if (!selectionSummary.selectionId) {
            Alert.alert('エラー', '先にアプリを選択してください');
            return;
        }
        const result = await screenTimeBridge.applyRestriction(
            selectionSummary.selectionId
        );
        if (result.success) {
            Alert.alert('完了', '制限を適用しました');
        } else {
            Alert.alert('エラー', result.message || '制限の適用に失敗しました');
        }
    };

    const handleClearRestriction = async () => {
        if (!selectionSummary.selectionId) return;
        const result = await screenTimeBridge.clearRestrictionTemporarily(
            selectionSummary.selectionId
        );
        if (result.success) {
            Alert.alert('完了', '制限を一時解除しました');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.content}>
                {/* 権限状態 */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🔒 Screen Time 権限</Text>
                    <View style={styles.statusRow}>
                        <View
                            style={[
                                styles.statusDot,
                                {
                                    backgroundColor:
                                        authStatus === 'approved' ? '#4CAF50' : '#FF9800',
                                },
                            ]}
                        />
                        <Text style={styles.statusText}>
                            {authStatus === 'approved'
                                ? '許可済み'
                                : authStatus === 'denied'
                                    ? '拒否されています'
                                    : authStatus === 'notDetermined'
                                        ? '未設定'
                                        : authStatus}
                        </Text>
                    </View>
                    {authStatus !== 'approved' && (
                        <TouchableOpacity
                            style={styles.authButton}
                            onPress={handleRequestAuth}
                        >
                            <Text style={styles.authButtonText}>権限を許可する</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* 選択済みアプリ */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📱 対象アプリ</Text>
                    <View style={styles.selectionInfo}>
                        <Text style={styles.selectionCount}>
                            {selectionSummary.appCount}
                        </Text>
                        <Text style={styles.selectionLabel}>アプリ選択中</Text>
                    </View>
                    {selectionSummary.categoryCount != null && selectionSummary.categoryCount > 0 && (
                        <Text style={styles.categoryText}>
                            {selectionSummary.categoryCount} カテゴリ
                        </Text>
                    )}
                </View>

                {/* アクションボタン */}
                <TouchableOpacity
                    style={styles.selectButton}
                    onPress={handleSelectApps}
                    disabled={isSelecting}
                >
                    <Text style={styles.selectButtonIcon}>📋</Text>
                    <Text style={styles.selectButtonText}>
                        {isSelecting ? '選択中...' : 'アプリを選択する'}
                    </Text>
                </TouchableOpacity>

                {selectionSummary.selectionId && (
                    <View style={styles.restrictionButtons}>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={handleApplyRestriction}
                        >
                            <Text style={styles.applyButtonText}>🔒 制限を適用</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={handleClearRestriction}
                        >
                            <Text style={styles.clearButtonText}>🔓 制限を解除</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Phase 1 注意書き */}
                <View style={styles.notice}>
                    <Text style={styles.noticeText}>
                        ⚠️ Phase 1ではモック動作です。{'\n'}
                        実際のScreen Time連携はPhase 2で実装されます。
                    </Text>
                </View>
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
        paddingTop: 12,
    },
    card: {
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
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 12,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    statusText: {
        fontSize: 15,
        color: '#636366',
    },
    authButton: {
        marginTop: 12,
        backgroundColor: '#E17055',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    authButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    selectionInfo: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    selectionCount: {
        fontSize: 40,
        fontWeight: '800',
        color: '#6C5CE7',
    },
    selectionLabel: {
        fontSize: 15,
        color: '#8E8E93',
        fontWeight: '500',
    },
    categoryText: {
        fontSize: 13,
        color: '#AEAEB2',
        marginTop: 4,
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6C5CE7',
        paddingVertical: 16,
        borderRadius: 14,
        marginBottom: 12,
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    selectButtonIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    selectButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    restrictionButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    applyButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: '#E17055',
    },
    applyButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    clearButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: '#00B894',
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    notice: {
        marginTop: 24,
        backgroundColor: '#FFF3E0',
        borderRadius: 12,
        padding: 16,
    },
    noticeText: {
        fontSize: 13,
        color: '#E65100',
        textAlign: 'center',
        lineHeight: 20,
    },
});
