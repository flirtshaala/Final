import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  ProximaNova_400Regular,
  ProximaNova_600SemiBold,
  ProximaNova_700Bold,
} from '@expo-google-fonts/proxima-nova';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import { adService } from '@/services/ads';
import { Platform } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'ProximaNova-Regular': ProximaNova_400Regular,
    'ProximaNova-SemiBold': ProximaNova_600SemiBold,
    'ProximaNova-Bold': ProximaNova_700Bold,
  });

  useEffect(() => {
    // Initialize ads only on mobile platforms
    if (Platform.OS !== 'web') {
      adService.initialize().catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <UserProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="premium" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="profile/edit" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </UserProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}