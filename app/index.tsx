import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import { useTheme } from '@/context/ThemeContext';

export default function SplashScreen() {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to tabs after animation
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, slideAnim]);

  return (
    <ThemedGradientBackground style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Heart size={64} color="#FF6B7A" fill="#FF6B7A" />
        <Text style={[styles.appName, { color: colors.text }]}>FlirtShaala</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>Chat Smarter. Flirt Better.</Text>
      </Animated.View>
    </ThemedGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});