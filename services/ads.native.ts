import { Platform } from 'react-native';
import mobileAds, {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

const getAdUnitId = (type: 'banner' | 'rewarded', platform: 'android' | 'ios') => {
  if (__DEV__) {
    return type === 'banner' ? TestIds.BANNER : TestIds.REWARDED;
  }
  
  const envKey = `EXPO_PUBLIC_ADMOB_${type.toUpperCase()}_${platform.toUpperCase()}`;
  return process.env[envKey] || (type === 'banner' ? TestIds.BANNER : TestIds.REWARDED);
};

class AdService {
  private interstitialAd: InterstitialAd | null = null;
  private rewardedAd: RewardedAd | null = null;
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
    const platform = Platform.OS as 'android' | 'ios';
    return getAdUnitId('banner', platform);
  }

  async showRewardedAd(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
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
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve) => {
      const platform = Platform.OS as 'android' | 'ios';
      const adUnitId = getAdUnitId('banner', platform); // Using banner for interstitial as fallback
      
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