import { Platform } from 'react-native';

// Web-safe ads service
class AdService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    if (Platform.OS === 'web') {
      // Mock initialization for web
      this.isInitialized = true;
      console.log('AdMob mock initialized for web');
      return;
    }

    try {
      // Import native ads only on mobile platforms
      const mobileAds = require('react-native-google-mobile-ads').default;
      await mobileAds().initialize();
      this.isInitialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  getBannerAdUnitId() {
    if (Platform.OS === 'web') {
      return 'web-mock-banner-id';
    }

    const platform = Platform.OS as 'android' | 'ios';
    const envKey = `EXPO_PUBLIC_ADMOB_BANNER_${platform.toUpperCase()}`;
    const adUnitId = process.env[envKey];
    
    if (!adUnitId || adUnitId === 'your_banner_ad_unit_id_' + platform) {
      // Return test IDs if not configured
      return platform === 'android' 
        ? 'ca-app-pub-3940256099942544/6300978111'
        : 'ca-app-pub-3940256099942544/2934735716';
    }
    
    return adUnitId;
  }

  async showRewardedAd(): Promise<boolean> {
    if (Platform.OS === 'web') {
      // Mock for web - simulate watching an ad
      console.log('Mock rewarded ad shown on web');
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 2000);
      });
    }

    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const { RewardedAd, TestIds, AdEventType, RewardedAdEventType } = require('react-native-google-mobile-ads');
      
      return new Promise((resolve) => {
        const platform = Platform.OS as 'android' | 'ios';
        const envKey = `EXPO_PUBLIC_ADMOB_REWARDED_${platform.toUpperCase()}`;
        const adUnitId = process.env[envKey] || TestIds.REWARDED;
        
        const rewardedAd = RewardedAd.createForAdRequest(adUnitId);
        
        const unsubscribeLoaded = rewardedAd.addAdEventListener(
          RewardedAdEventType.LOADED,
          () => {
            rewardedAd.show();
          }
        );

        const unsubscribeEarned = rewardedAd.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          () => {
            unsubscribeLoaded();
            unsubscribeEarned();
            resolve(true);
          }
        );

        const unsubscribeClosed = rewardedAd.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            unsubscribeLoaded();
            unsubscribeEarned();
            unsubscribeClosed();
            resolve(false);
          }
        );

        rewardedAd.load();
      });
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      return false;
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    if (Platform.OS === 'web') {
      // Mock for web - simulate showing an interstitial ad
      console.log('Mock interstitial ad shown on web');
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000);
      });
    }

    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const { InterstitialAd, TestIds, AdEventType } = require('react-native-google-mobile-ads');
      
      return new Promise((resolve) => {
        const platform = Platform.OS as 'android' | 'ios';
        const envKey = `EXPO_PUBLIC_ADMOB_INTERSTITIAL_${platform.toUpperCase()}`;
        const adUnitId = process.env[envKey] || TestIds.INTERSTITIAL;
        
        const interstitialAd = InterstitialAd.createForAdRequest(adUnitId);
        
        const unsubscribeLoaded = interstitialAd.addAdEventListener(
          AdEventType.LOADED,
          () => {
            interstitialAd.show();
          }
        );

        const unsubscribeClosed = interstitialAd.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            unsubscribeLoaded();
            unsubscribeClosed();
            resolve(true);
          }
        );

        interstitialAd.load();
      });
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      return false;
    }
  }
}

export const adService = new AdService();