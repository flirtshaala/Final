import mobileAds, { 
  BannerAd, 
  BannerAdSize, 
  TestIds, 
  InterstitialAd, 
  RewardedAd, 
  AdEventType, 
  RewardedAdEventType 
} from 'react-native-google-mobile-ads';

class AdService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await mobileAds().initialize();
      this.isInitialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  getBannerAdUnitId() {
    const adUnitId = process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID;
    
    if (!adUnitId || adUnitId === 'your_banner_ad_unit_id_android') {
      // Return test ID if not configured
      return TestIds.BANNER;
    }
    
    return adUnitId;
  }

  async showRewardedAd(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
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
      return false;
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
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
      return false;
    }
  }
}

export const adService = new AdService();