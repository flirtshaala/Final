import { Platform } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Purchases from 'react-native-purchases';

export async function initializeServices() {
  try {
    // Initialize AdMob
    if (Platform.OS !== 'web') {
      await mobileAds().initialize();
      console.log('AdMob initialized');
    }

    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: process.env.GOOGLE_WEB_CLIENT_ID || '',
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
    });

    // Initialize RevenueCat
    if (Platform.OS !== 'web') {
      Purchases.configure({
        apiKey: process.env.REVENUECAT_API_KEY || '',
      });
      console.log('RevenueCat initialized');
    }

    console.log('All services initialized successfully');
  } catch (error) {
    console.error('Service initialization error:', error);
  }
}