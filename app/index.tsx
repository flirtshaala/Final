import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function SplashScreen() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    if (!loading) {
      // Navigate to appropriate screen based on auth state
      if (user) {
        router.replace('/(tabs)/chat');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [user, loading]);

  return (
    <ThemedGradientBackground style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>FlirtShaala</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your AI wingman for perfect responses
        </Text>
        <LoadingSpinner />
      </View>
    </ThemedGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 32,
    textAlign: 'center',
  },
});