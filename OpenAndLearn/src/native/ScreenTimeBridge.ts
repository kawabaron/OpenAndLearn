/**
 * Screen Time Bridge インターフェース
 * Phase 2 でネイティブ実装に差し替え
 */

export type ScreenTimeAuthStatus =
    | 'notDetermined'
    | 'denied'
    | 'approved'
    | 'unavailable'
    | 'unknown';

export type AppSelectionSummary = {
    selectionId: string | null;
    appCount: number;
    categoryCount?: number;
};

export type RestrictionApplyResult = {
    success: boolean;
    message?: string;
};

export interface IScreenTimeBridge {
    getAuthorizationStatus(): Promise<ScreenTimeAuthStatus>;
    requestAuthorization(): Promise<ScreenTimeAuthStatus>;

    presentAppSelectionPicker(): Promise<AppSelectionSummary>;
    getCurrentSelectionSummary(): Promise<AppSelectionSummary>;

    applyRestriction(selectionId: string): Promise<RestrictionApplyResult>;
    clearRestrictionTemporarily(selectionId: string): Promise<RestrictionApplyResult>;
    reapplyRestrictionIfNeeded(selectionId: string): Promise<RestrictionApplyResult>;

    setTemporaryUnlock(params: {
        selectionId: string;
        startAtISO: string;
        endAtISO: string;
        reason: 'correct' | 'skip';
    }): Promise<{ success: boolean }>;

    getTemporaryUnlockStatus(): Promise<{
        isActive: boolean;
        endAtISO?: string;
    }>;
}
