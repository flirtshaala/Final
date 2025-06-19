// Mock module for react-native-google-mobile-ads on web
// This prevents Metro from trying to resolve native-only modules

const TestIds = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
};

const BannerAdSize = {
  BANNER: 'BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  FULL_BANNER: 'FULL_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  SMART_BANNER: 'SMART_BANNER',
};

const AdEventType = {
  LOADED: 'loaded',
  ERROR: 'error',
  OPENED: 'opened',
  CLOSED: 'closed',
  CLICKED: 'clicked',
};

const RewardedAdEventType = {
  LOADED: 'loaded',
  ERROR: 'error',
  OPENED: 'opened',
  CLOSED: 'closed',
  EARNED_REWARD: 'earned_reward',
};

// Mock BannerAd component for web
const BannerAd = () => null;

// Mock InterstitialAd class
class InterstitialAd {
  static createForAdRequest() {
    return new InterstitialAd();
  }
  
  addAdEventListener() {
    return () => {}; // Return unsubscribe function
  }
  
  load() {}
  show() {}
}

// Mock RewardedAd class
class RewardedAd {
  static createForAdRequest() {
    return new RewardedAd();
  }
  
  addAdEventListener() {
    return () => {}; // Return unsubscribe function
  }
  
  load() {}
  show() {}
}

// Mock mobileAds function
const mobileAds = () => ({
  initialize: () => Promise.resolve(),
  setRequestConfiguration: () => {},
});

module.exports = {
  default: mobileAds,
  TestIds,
  BannerAdSize,
  AdEventType,
  RewardedAdEventType,
  BannerAd,
  InterstitialAd,
  RewardedAd,
  mobileAds,
};