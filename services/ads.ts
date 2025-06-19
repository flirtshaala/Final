import { Platform } from 'react-native';

// Mock ads service for web and development
class MockAdService {
  async initialize() {
    console.log('Mock AdService initialized for web platform');
    return true;
  }

  getBannerAdUnitId() {
    return 'ca-app-pub-3940256099942544/6300978111'; // Test banner ad unit
  }

  async showRewardedAd(): Promise<boolean> {
    // Mock for web - simulate watching an ad
    return new Promise((resolve) => {
      console.log('Mock rewarded ad shown');
      setTimeout(() => resolve(true), 2000);
    });
  }

  async showInterstitialAd(): Promise<boolean> {
    // Mock for web - simulate showing interstitial
    return new Promise((resolve) => {
      console.log('Mock interstitial ad shown');
      setTimeout(() => resolve(true), 1000);
    });
  }
}

// Real ads service for mobile platforms
class MobileAdService {
  private isInitialized = false;
  private mobileAds: any = null;
  private TestIds: any = null;
  private InterstitialAd: any = null;
  private RewardedAd: any = null;
  private AdEventType: any = null;
  private RewardedAdEventType: any = null;

  async initialize() {
    if (this.isInitialized || Platform.OS === 'web') return;

    try {
      // Dynamic import to avoid issues on web
      const {
        default: mobileAds,
        TestIds,
        InterstitialAd,
        RewardedAd,
        AdEventType,
        RewardedAdEventType,
      } = await import('react-native-google-mobile-ads');

      this.mobileAds = mobileAds;
      this.TestIds = TestIds;
      this.InterstitialAd = InterstitialAd;
      this.RewardedAd = RewardedAd;
      this.AdEventType = AdEventType;
      this.RewardedAdEventType = RewardedAdEventType;

      await this.mobileAds().initialize();
      this.isInitialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  private getAdUnitId(type: 'banner' | 'rewarded' | 'interstitial', platform: 'android' | 'ios') {
    if (__DEV__ || !this.TestIds) {
      const testIds = {
        banner: 'ca-app-pub-3940256099942544/6300978111',
        rewarded: 'ca-app-pub-3940256099942544/5224354917',
        interstitial: 'ca-app-pub-3940256099942544/1033173712',
      };
      return testIds[type];
    }
    
    const envKey = `EXPO_PUBLIC_ADMOB_${type.toUpperCase()}_${platform.toUpperCase()}`;
    return process.env[envKey] || this.TestIds[type.toUpperCase()];
  }

  getBannerAdUnitId() {
    if (Platform.OS === 'web') return 'ca-app-pub-3940256099942544/6300978111';
    
    const platform = Platform.OS as 'android' | 'ios';
    return this.getAdUnitId('banner', platform);
  }

  async showRewardedAd(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.RewardedAd || !this.RewardedAdEventType || !this.AdEventType) {
      console.warn('AdMob not properly initialized');
      return false;
    }

    return new Promise((resolve) => {
      const platform = Platform.OS as 'android' | 'ios';
      const adUnitId = this.getAdUnitId('rewarded', platform);
      
      const rewardedAd = this.RewardedAd.createForAdRequest(adUnitId);
      
      const unsubscribeLoaded = rewardedAd.addAdEventListener(
        this.RewardedAdEventType.LOADED,
        () => {
          rewardedAd.show();
        }
      );

      const unsubscribeEarned = rewardedAd.addAdEventListener(
        this.RewardedAdEventType.EARNED_REWARD,
        () => {
          unsubscribeLoaded();
          unsubscribeEarned();
          unsubscribeClosed();
          resolve(true);
        }
      );

      const unsubscribeClosed = rewardedAd.addAdEventListener(
        this.AdEventType.CLOSED,
        () => {
          unsubscribeLoaded();
          unsubscribeEarned();
          unsubscribeClosed();
          resolve(false);
        }
      );

      rewardedAd.load();
    });
  }

  async showInterstitialAd(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.InterstitialAd || !this.AdEventType) {
      console.warn('AdMob not properly initialized');
      return false;
    }

    return new Promise((resolve) => {
      const platform = Platform.OS as 'android' | 'ios';
      const adUnitId = this.getAdUnitId('interstitial', platform);
      
      const interstitialAd = this.InterstitialAd.createForAdRequest(adUnitId);
      
      const unsubscribeLoaded = interstitialAd.addAdEventListener(
        this.AdEventType.LOADED,
        () => {
          interstitialAd.show();
        }
      );

      const unsubscribeClosed = interstitialAd.addAdEventListener(
        this.AdEventType.CLOSED,
        () => {
          unsubscribeLoaded();
          unsubscribeClosed();
          resolve(true);
        }
      );

      interstitialAd.load();
    });
  }
}

// Export the appropriate service based on platform
export const adService = Platform.OS === 'web' ? new MockAdService() : new MobileAdService();