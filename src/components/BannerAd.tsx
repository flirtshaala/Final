import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';

export default function BannerAdComponent() {
  // Disable ads completely on web
  if (Platform.OS === 'web') {
    return null;
  }

  // For native platforms, try to load the actual AdMob component
  try {
    const { BannerAd, BannerAdSize } = require('react-native-google-mobile-ads');
    const { adService } = require('../services/ads');

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
  } catch (error) {
    // Fallback for development or if AdMob is not available
    return (
      <View style={styles.container}>
        <View style={styles.fallbackAd}>
          <Text style={styles.fallbackText}>Ad Space</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  fallbackAd: {
    height: 50,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  fallbackText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
});