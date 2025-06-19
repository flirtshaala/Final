import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';

// Platform-specific imports with proper error handling
let BannerAd: any = null;
let BannerAdSize: any = null;
let adService: any = null;

if (Platform.OS !== 'web') {
  try {
    const googleMobileAds = require('react-native-google-mobile-ads');
    BannerAd = googleMobileAds.BannerAd;
    BannerAdSize = googleMobileAds.BannerAdSize;
    adService = require('@/services/ads').adService;
  } catch (error) {
    console.warn('Failed to load AdMob components:', error);
  }
}

export default function BannerAdComponent() {
  if (Platform.OS === 'web') {
    // Show a placeholder for web
    return (
      <View style={styles.webPlaceholder}>
        <Text style={styles.webPlaceholderText}>Ad Space</Text>
      </View>
    );
  }

  // Return null if AdMob components failed to load
  if (!BannerAd || !BannerAdSize || !adService) {
    return (
      <View style={styles.webPlaceholder}>
        <Text style={styles.webPlaceholderText}>Ad Loading...</Text>
      </View>
    );
  }

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
        onAdFailedToLoad={(error: any) => {
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
  webPlaceholder: {
    height: 50,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  webPlaceholderText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
});