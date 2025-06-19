import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { useUser } from '@/context/UserContext';

// Dynamic import for mobile ads
const BannerAdComponent = React.lazy(async () => {
  if (Platform.OS === 'web') {
    // Return a mock component for web
    return {
      default: () => (
        <View style={styles.webPlaceholder}>
          <Text style={styles.webPlaceholderText}>Ad Space</Text>
        </View>
      )
    };
  }

  try {
    const { BannerAd, BannerAdSize } = await import('react-native-google-mobile-ads');
    const { adService } = await import('@/services/ads');

    return {
      default: () => (
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
      )
    };
  } catch (error) {
    console.error('Failed to load BannerAd:', error);
    return {
      default: () => (
        <View style={styles.webPlaceholder}>
          <Text style={styles.webPlaceholderText}>Ad Space</Text>
        </View>
      )
    };
  }
});

export default function BannerAdWrapper() {
  const { isPremium } = useUser();

  // Don't show ads for premium users
  if (isPremium) {
    return null;
  }

  return (
    <React.Suspense fallback={
      <View style={styles.webPlaceholder}>
        <Text style={styles.webPlaceholderText}>Loading Ad...</Text>
      </View>
    }>
      <BannerAdComponent />
    </React.Suspense>
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

// Export with a different name to avoid conflicts
export { BannerAdWrapper as BannerAd };