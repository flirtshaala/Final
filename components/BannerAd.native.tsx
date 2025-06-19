import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { adService } from '@/services/ads';

export default function BannerAdComponent() {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adService.getBannerAdUnitId()}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.log('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
});