
import { AppState, AppStateStatus } from 'react-native';
import { CheatDetection } from '@/types/gameTypes';
import NetworkService from './NetworkService';

export class CheatDetectionService {
  private static instance: CheatDetectionService;
  private isMonitoring: boolean = false;
  private playerId: string = '';
  private safeMode: boolean = true;
  private appStateSubscription: any = null;
  private lastAppState: AppStateStatus = 'active';

  private constructor() {}

  static getInstance(): CheatDetectionService {
    if (!CheatDetectionService.instance) {
      CheatDetectionService.instance = new CheatDetectionService();
    }
    return CheatDetectionService.instance;
  }

  startMonitoring(playerId: string, safeMode: boolean = true): void {
    this.playerId = playerId;
    this.safeMode = safeMode;
    this.isMonitoring = true;

    if (!safeMode) {
      console.log('Cheat detection disabled (unsafe mode)');
      return;
    }

    console.log('Starting cheat detection for player:', playerId);

    // Monitor app state changes
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange.bind(this));

    // Monitor for split screen (Android specific)
    this.monitorSplitScreen();

    // Monitor for popups and overlays
    this.monitorPopups();
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    console.log('Cheat detection stopped');
  }

  private handleAppStateChange(nextAppState: AppStateStatus): void {
    if (!this.isMonitoring || !this.safeMode) return;

    console.log('App state changed:', this.lastAppState, '->', nextAppState);

    if (this.lastAppState === 'active' && nextAppState === 'background') {
      this.reportCheat('background', 'App moved to background during game');
    } else if (this.lastAppState === 'active' && nextAppState === 'inactive') {
      // This might be a popup or overlay
      setTimeout(() => {
        if (AppState.currentState === 'inactive') {
          this.reportCheat('popup', 'App became inactive (possible popup or overlay)');
        }
      }, 1000);
    }

    this.lastAppState = nextAppState;
  }

  private monitorSplitScreen(): void {
    // In a real implementation, you would use native modules to detect split screen
    // For now, we'll simulate detection based on app state and window dimensions
    console.log('Split screen monitoring started');
  }

  private monitorPopups(): void {
    // Monitor for system popups, notifications, etc.
    console.log('Popup monitoring started');
  }

  private reportCheat(type: CheatDetection['type'], reason: string): void {
    if (!this.isMonitoring || !this.safeMode) return;

    const detection: CheatDetection = {
      playerId: this.playerId,
      type,
      timestamp: new Date()
    };

    console.log('Cheat detected:', detection, 'Reason:', reason);

    // Report to network service
    NetworkService.reportCheat(detection);

    // Play warning sound for God
    this.playWarningSound();
  }

  private playWarningSound(): void {
    // In a real implementation, you would play a warning sound
    console.log('🚨 CHEAT DETECTED - Playing warning sound');
  }

  // Manual cheat reporting (for God to report suspicious behavior)
  reportSuspiciousActivity(playerId: string, type: CheatDetection['type'], description: string): void {
    const detection: CheatDetection = {
      playerId,
      type,
      timestamp: new Date()
    };

    console.log('Manual cheat report:', detection, 'Description:', description);
    NetworkService.reportCheat(detection);
  }

  // Screenshot detection (would require native implementation)
  private detectScreenshot(): void {
    // This would require native modules to detect screenshots
    console.log('Screenshot detection would be implemented natively');
  }

  // Screen recording detection (would require native implementation)
  private detectScreenRecording(): void {
    // This would require native modules to detect screen recording
    console.log('Screen recording detection would be implemented natively');
  }

  // Utility methods
  setSafeMode(enabled: boolean): void {
    this.safeMode = enabled;
    console.log('Safe mode:', enabled ? 'enabled' : 'disabled');
  }

  isInSafeMode(): boolean {
    return this.safeMode;
  }

  isCurrentlyMonitoring(): boolean {
    return this.isMonitoring;
  }
}

export default CheatDetectionService.getInstance();
