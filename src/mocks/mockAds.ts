// Mock AdMob for web compatibility
export const BannerAd = () => null;
export const BannerAdSize = {
  BANNER: 'banner',
  LARGE_BANNER: 'large_banner',
  MEDIUM_RECTANGLE: 'medium_rectangle',
  FULL_BANNER: 'full_banner',
  LEADERBOARD: 'leaderboard',
};

export const TestIds = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
};

export const InterstitialAd = {
  createForAdRequest: () => ({
    addAdEventListener: () => () => {},
    load: () => {},
    show: () => {},
  }),
};

export const RewardedAd = {
  createForAdRequest: () => ({
    addAdEventListener: () => () => {},
    load: () => {},
    show: () => {},
  }),
};

export const AdEventType = {
  LOADED: 'loaded',
  CLOSED: 'closed',
  ERROR: 'error',
};

export const RewardedAdEventType = {
  LOADED: 'loaded',
  EARNED_REWARD: 'earned_reward',
};

const mobileAds = () => ({
  initialize: async () => {
    console.log('Mock AdMob initialized for web');
    return Promise.resolve();
  },
});

export default mobileAds;