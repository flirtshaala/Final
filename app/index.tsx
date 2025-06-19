import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import { useTheme } from '@/context/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

export default function SplashScreen() {
  const { colors } = useTheme();
  
  // Animation values
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  const titleOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    // Start animations sequence
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.back(1.5)),
    });
    
    logoOpacity.value = withTiming(1, {
      duration: 600,
    });

    titleTranslateY.value = withDelay(300, withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.quad),
    }));
    
    titleOpacity.value = withDelay(300, withTiming(1, {
      duration: 600,
    }));

    taglineOpacity.value = withDelay(600, withTiming(1, {
      duration: 600,
    }));

    // Navigate to tabs after animation
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleTranslateY.value }],
    opacity: titleOpacity.value,
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <ThemedGradientBackground style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.View style={[styles.heartContainer, logoAnimatedStyle]}>
          <Heart size={64} color="#FF6B7A" fill="#FF6B7A" />
        </Animated.View>
        
        <Animated.Text style={[styles.appName, { color: colors.text }, titleAnimatedStyle]}>
          FlirtShaala
        </Animated.Text>
        
        <Animated.Text style={[styles.tagline, { color: colors.textSecondary }, taglineAnimatedStyle]}>
          Chat Smarter. Flirt Better.
        </Animated.Text>
      </View>
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
  heartContainer: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});