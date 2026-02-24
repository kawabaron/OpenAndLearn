import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_SETTINGS } from '../../constants/defaults';
import { AppSettings } from '../../domain/models/settings';
import { STORAGE_KEYS } from '../storage/keys';

/**
 * 設定リポジトリ
 */
export const settingsRepository = {
    /**
     * 設定を取得（未保存の場合はデフォルト値を返す）
     */
    async getSettings(): Promise<AppSettings> {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
            if (json) {
                const saved = JSON.parse(json) as Partial<AppSettings>;
                // デフォルト値で補完
                return { ...DEFAULT_SETTINGS, ...saved };
            }
            return { ...DEFAULT_SETTINGS };
        } catch {
            return { ...DEFAULT_SETTINGS };
        }
    },

    /**
     * 設定を保存
     */
    async saveSettings(settings: AppSettings): Promise<void> {
        await AsyncStorage.setItem(
            STORAGE_KEYS.APP_SETTINGS,
            JSON.stringify(settings)
        );
    },

    /**
     * 設定を部分更新
     */
    async updateSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
        const current = await this.getSettings();
        const updated = { ...current, ...partial };
        await this.saveSettings(updated);
        return updated;
    },
};
