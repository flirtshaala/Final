import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';

// Only import AdMob components on native platforms
let BannerAd: any = null;
let BannerAdSize: any = null;

if (Platform.OS !== 'web') {
  try {
    const adModule = require('react-native-google-mobile-ads');
    BannerAd = adModule.BannerAd;
    BannerAdSize = adModule.BannerAdSize;
  } catch (error) {
    console.warn('AdMob not available on this platform');
  }
}

import { adService } from '../services/ads';

export default function BannerAdComponent() {
  // Don't render ads on web
  if (Platform.OS === 'web') {
    return null;
  }

  // Don't render if AdMob is not available
  if (!BannerAd || !BannerAdSize) {
    return null;
  }

  const adUnitId = adService.getBannerAdUnitId();
  if (!adUnitId) {
    return null;
  }

  try {
    return (
      <View style={styles.container}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdLoaded={() => {
            console.log('Banner ad loaded');
          }}
          onAdFailedToLoad={(error: any) => {
            console.log('Banner ad failed to load:', error);
          }}
        />
      </View>
    );
  } catch (error) {
    console.warn('Error rendering banner ad:', error);
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
});