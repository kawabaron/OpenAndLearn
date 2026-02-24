/**
 * Screen Time Bridge モック実装
 * 開発/テスト用。Phase 2 で本番ネイティブ実装に差し替え。
 */

import {
    AppSelectionSummary,
    IScreenTimeBridge,
    RestrictionApplyResult,
    ScreenTimeAuthStatus,
} from './ScreenTimeBridge';

let mockAuthStatus: ScreenTimeAuthStatus = 'notDetermined';
let mockSelection: AppSelectionSummary = {
    selectionId: null,
    appCount: 0,
    categoryCount: 0,
};
let mockUnlockStatus = {
    isActive: false,
    endAtISO: undefined as string | undefined,
};

export const MockScreenTimeBridge: IScreenTimeBridge = {
    async getAuthorizationStatus(): Promise<ScreenTimeAuthStatus> {
        return mockAuthStatus;
    },

    async requestAuthorization(): Promise<ScreenTimeAuthStatus> {
        // モック: 常に承認
        mockAuthStatus = 'approved';
        return mockAuthStatus;
    },

    async presentAppSelectionPicker(): Promise<AppSelectionSummary> {
        // モック: 3つのアプリが選択された
        mockSelection = {
            selectionId: 'mock-selection-001',
            appCount: 3,
            categoryCount: 1,
        };
        return mockSelection;
    },

    async getCurrentSelectionSummary(): Promise<AppSelectionSummary> {
        return mockSelection;
    },

    async applyRestriction(_selectionId: string): Promise<RestrictionApplyResult> {
        return { success: true, message: '[Mock] 制限を適用しました' };
    },

    async clearRestrictionTemporarily(
        _selectionId: string
    ): Promise<RestrictionApplyResult> {
        return { success: true, message: '[Mock] 制限を一時解除しました' };
    },

    async reapplyRestrictionIfNeeded(
        _selectionId: string
    ): Promise<RestrictionApplyResult> {
        return { success: true, message: '[Mock] 制限を再適用しました' };
    },

    async setTemporaryUnlock(params: {
        selectionId: string;
        startAtISO: string;
        endAtISO: string;
        reason: 'correct' | 'skip';
    }): Promise<{ success: boolean }> {
        mockUnlockStatus = {
            isActive: true,
            endAtISO: params.endAtISO,
        };
        return { success: true };
    },

    async getTemporaryUnlockStatus(): Promise<{
        isActive: boolean;
        endAtISO?: string;
    }> {
        return mockUnlockStatus;
    },
};
