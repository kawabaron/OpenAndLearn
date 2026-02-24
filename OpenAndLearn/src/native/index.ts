/**
 * Screen Time Bridge エクスポート
 * Phase 1: モック使用
 * Phase 2: ネイティブ実装に切替
 */

import { IScreenTimeBridge } from './ScreenTimeBridge';
import { MockScreenTimeBridge } from './ScreenTimeBridge.mock';

// Phase 2でここを変更してネイティブ実装に切替
// import { IOSScreenTimeBridge } from './ScreenTimeBridge.ios';
// export const screenTimeBridge: IScreenTimeBridge = IOSScreenTimeBridge;

export const screenTimeBridge: IScreenTimeBridge = MockScreenTimeBridge;

export type {
    AppSelectionSummary, IScreenTimeBridge, RestrictionApplyResult, ScreenTimeAuthStatus
} from './ScreenTimeBridge';

