import { Platform } from 'react-native';

// Only import AdMob on native platforms
let mobileAds: any = null;
let TestIds: any = null;
let InterstitialAd: any = null;
let RewardedAd: any = null;
let AdEventType: any = null;
let RewardedAdEventType: any = null;

if (Platform.OS !== 'web') {
  try {
    const adModule = require('react-native-google-mobile-ads');
    mobileAds = adModule.default;
    TestIds = adModule.TestIds;
    InterstitialAd = adModule.InterstitialAd;
    RewardedAd = adModule.RewardedAd;
    AdEventType = adModule.AdEventType;
    RewardedAdEventType = adModule.RewardedAdEventType;
  } catch (error) {
    console.warn('AdMob not available on this platform');
  }
}

class AdService {
  private isInitialized = false;
  private isWebPlatform = Platform.OS === 'web';

  async initialize() {
    if (this.isWebPlatform) {
      console.log('Ads disabled on web platform');
      return;
    }

    if (this.isInitialized || !mobileAds) return;
    
    try {
      await mobileAds().initialize();
      this.isInitialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  getBannerAdUnitId() {
    if (this.isWebPlatform) {
      return null;
    }

    const adUnitId = process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID;
    
    if (!adUnitId || adUnitId === 'your_banner_ad_unit_id_android') {
      return TestIds?.BANNER || null;
    }
    
    return adUnitId;
  }

  async showRewardedAd(): Promise<boolean> {
    if (this.isWebPlatform) {
      console.log('Rewarded ads not available on web, granting reward');
      return true; // Grant reward on web for better UX
    }

    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!RewardedAd || !TestIds) {
      console.warn('AdMob not available, granting reward');
      return true;
    }

    try {
      return new Promise((resolve) => {
        const adUnitId = process.env.EXPO_PUBLIC_ADMOB_REWARDED_ANDROID || TestIds.REWARDED;
        
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
      return true; // Grant reward on error for better UX
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    if (this.isWebPlatform) {
      console.log('Interstitial ads not available on web');
      return true;
    }

    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!InterstitialAd || !TestIds) {
      console.warn('AdMob not available');
      return true;
    }

    try {
      return new Promise((resolve) => {
        const adUnitId = process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID || TestIds.INTERSTITIAL;
        
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
      return true;
    }
  }
}

export const adService = new AdService();