import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionUnlock } from '../../domain/models/session-unlock';
import { isExpired } from '../../utils/date';
import { STORAGE_KEYS } from '../storage/keys';

/**
 * セッション解除リポジトリ
 */
export const sessionUnlockRepository = {
    /**
     * 現在の解除セッションを取得
     */
    async getCurrentUnlock(): Promise<SessionUnlock | null> {
        try {
            const json = await AsyncStorage.getItem(
                STORAGE_KEYS.SESSION_UNLOCK_CURRENT
            );
            return json ? JSON.parse(json) : null;
        } catch {
            return null;
        }
    },

    /**
     * 解除セッションを保存
     */
    async setUnlock(session: SessionUnlock): Promise<void> {
        await AsyncStorage.setItem(
            STORAGE_KEYS.SESSION_UNLOCK_CURRENT,
            JSON.stringify(session)
        );
    },

    /**
     * 解除が有効かどうかを判定
     */
    async isUnlockActive(): Promise<boolean> {
        const session = await this.getCurrentUnlock();
        if (!session) return false;
        if (!session.isActive) return false;
        return !isExpired(session.endAt);
    },

    /**
     * 期限切れの解除セッションをクリア
     */
    async clearExpiredUnlock(): Promise<void> {
        const session = await this.getCurrentUnlock();
        if (session && isExpired(session.endAt)) {
            const updated: SessionUnlock = { ...session, isActive: false };
            await this.setUnlock(updated);
        }
    },

    /**
     * 解除セッションをクリア
     */
    async clearUnlock(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_UNLOCK_CURRENT);
    },
};
