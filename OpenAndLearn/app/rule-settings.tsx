import { SettingRow } from '@/src/components/SettingRow';
import { DifficultyLevel } from '@/src/domain/models/question';
import { useSettingsStore } from '@/src/stores/settingsStore';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RuleSettingsScreen() {
    const { settings, updateSettings, loadSettings } = useSettingsStore();

    useEffect(() => {
        loadSettings();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 正解時の解除時間 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⏱️ 解除時間</Text>
                    <View style={styles.sectionContent}>
                        <SettingRow
                            type="select"
                            label="正解時の解除時間"
                            description="正解した後にアプリを使える時間"
                            value={String(settings.unlockDurationMinutes)}
                            options={[
                                { label: '1分', value: '1' },
                                { label: '5分', value: '5' },
                                { label: '10分', value: '10' },
                            ]}
                            onSelect={(v) =>
                                updateSettings({
                                    unlockDurationMinutes: Number(v) as 1 | 5 | 10,
                                })
                            }
                        />
                    </View>
                </View>

                {/* スキップ設定 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⏭️ スキップ設定</Text>
                    <View style={styles.sectionContent}>
                        <SettingRow
                            type="toggle"
                            label="スキップを許可"
                            description="問題をスキップできるようにする"
                            value={settings.skipEnabled}
                            onValueChange={(v) => updateSettings({ skipEnabled: v })}
                        />
                        {settings.skipEnabled && (
                            <SettingRow
                                type="select"
                                label="スキップ時の解除"
                                description="スキップした場合のアプリ解除時間"
                                value={String(settings.skipUnlockMinutes)}
                                options={[
                                    { label: '1分', value: '1' },
                                    { label: '5分', value: '5' },
                                    { label: '10分', value: '10' },
                                ]}
                                onSelect={(v) =>
                                    updateSettings({
                                        skipUnlockMinutes: Number(v) as 1 | 5 | 10,
                                    })
                                }
                            />
                        )}
                    </View>
                </View>

                {/* 難易度設定 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📚 難易度</Text>
                    <View style={styles.sectionContent}>
                        <SettingRow
                            type="select"
                            label="問題レベル"
                            description="出題される問題の難易度"
                            value={settings.difficultyLevel}
                            options={[
                                { label: '初級', value: 'beginner' },
                                { label: '中級', value: 'intermediate' },
                                { label: '混合', value: 'mixed' },
                            ]}
                            onSelect={(v) =>
                                updateSettings({
                                    difficultyLevel: v as DifficultyLevel,
                                })
                            }
                        />
                    </View>
                </View>

                {/* 時間帯設定 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🕐 アクティブ時間帯</Text>
                    <View style={styles.sectionContent}>
                        <SettingRow
                            type="toggle"
                            label="時間帯制限を有効化"
                            description="指定した時間帯のみ制限を適用（MVP: 保存のみ）"
                            value={settings.activeHoursEnabled}
                            onValueChange={(v) =>
                                updateSettings({ activeHoursEnabled: v })
                            }
                        />
                        {settings.activeHoursEnabled && (
                            <>
                                <SettingRow
                                    type="select"
                                    label="開始時刻"
                                    value={String(settings.activeStartHour)}
                                    options={[6, 7, 8, 9, 10, 11, 12].map((h) => ({
                                        label: `${h}:00`,
                                        value: String(h),
                                    }))}
                                    onSelect={(v) =>
                                        updateSettings({ activeStartHour: Number(v) })
                                    }
                                />
                                <SettingRow
                                    type="select"
                                    label="終了時刻"
                                    value={String(settings.activeEndHour)}
                                    options={[18, 19, 20, 21, 22, 23, 0].map((h) => ({
                                        label: `${h}:00`,
                                        value: String(h),
                                    }))}
                                    onSelect={(v) =>
                                        updateSettings({ activeEndHour: Number(v) })
                                    }
                                />
                            </>
                        )}
                    </View>
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
        paddingBottom: 40,
    },
    section: {
        marginTop: 24,
        marginHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#8E8E93',
        marginBottom: 8,
        marginLeft: 4,
    },
    sectionContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
});
