import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { adService } from '@/services/ads';

export default function BannerAdComponent() {
  if (Platform.OS === 'web') {
    // Show a placeholder for web
    return (
      <View style={styles.webPlaceholder}>
        <Text style={styles.webPlaceholderText}>Ad Space</Text>
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