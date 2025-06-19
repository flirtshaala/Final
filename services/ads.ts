import { Platform } from 'react-native';

// Platform-specific imports with proper error handling
let mobileAds: any = null;
let TestIds: any = null;
let InterstitialAd: any = null;
let RewardedAd: any = null;
let AdEventType: any = null;
let RewardedAdEventType: any = null;

if (Platform.OS !== 'web') {
  try {
    const googleMobileAds = require('react-native-google-mobile-ads');
    mobileAds = googleMobileAds.default;
    TestIds = googleMobileAds.TestIds;
    InterstitialAd = googleMobileAds.InterstitialAd;
    RewardedAd = googleMobileAds.RewardedAd;
    AdEventType = googleMobileAds.AdEventType;
    RewardedAdEventType = googleMobileAds.RewardedAdEventType;
  } catch (error) {
    console.warn('Failed to load AdMob services:', error);
  }
}

const getAdUnitId = (type: 'banner' | 'rewarded', platform: 'android' | 'ios') => {
  if (__DEV__ || Platform.OS === 'web') {
    return type === 'banner' ? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-3940256099942544/5224354917';
  }
  
  const envKey = `EXPO_PUBLIC_ADMOB_${type.toUpperCase()}_${platform.toUpperCase()}`;
  return process.env[envKey] || (type === 'banner' ? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-3940256099942544/5224354917');
};

class AdService {
  private interstitialAd: any = null;
  private rewardedAd: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized || Platform.OS === 'web' || !mobileAds) return;

    try {
      await mobileAds().initialize();
      this.isInitialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  getBannerAdUnitId() {
    if (Platform.OS === 'web') return 'ca-app-pub-3940256099942544/6300978111';
    
    const platform = Platform.OS as 'android' | 'ios';
    return getAdUnitId('banner', platform);
  }

  async showRewardedAd(): Promise<boolean> {
    if (Platform.OS === 'web') {
      // Mock for web - simulate watching an ad
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 2000);
      });
    }

    if (!this.isInitialized || !RewardedAd || !RewardedAdEventType || !AdEventType) {
      console.warn('AdMob not properly initialized or components not available');
      return false;
    }

    return new Promise((resolve) => {
      const platform = Platform.OS as 'android' | 'ios';
      const adUnitId = getAdUnitId('rewarded', platform);
      
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
          unsubscribeClosed();
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
  }

  async showInterstitialAd(): Promise<boolean> {
    if (Platform.OS === 'web') {
      // Mock for web - simulate showing an ad
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000);
      });
    }

    if (!this.isInitialized || !InterstitialAd || !AdEventType) {
      console.warn('AdMob not properly initialized or components not available');
      return false;
    }

    return new Promise((resolve) => {
      const platform = Platform.OS as 'android' | 'ios';
      const adUnitId = getAdUnitId('banner', platform); // Using banner ID for interstitial as fallback
      
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
  }
}

export const adService = new AdService();