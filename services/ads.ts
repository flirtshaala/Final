// Web fallback implementation for ads service
class AdService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    // Mock initialization for web
    this.isInitialized = true;
    console.log('AdMob mock initialized for web');
  }

  getBannerAdUnitId() {
    // Return a mock ID for web
    return 'web-mock-banner-id';
  }

  async showRewardedAd(): Promise<boolean> {
    // Mock for web - simulate watching an ad
    console.log('Mock rewarded ad shown on web');
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 2000);
    });
  }

  async showInterstitialAd(): Promise<boolean> {
    // Mock for web - simulate showing an interstitial ad
    console.log('Mock interstitial ad shown on web');
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }
}

export const adService = new AdService();