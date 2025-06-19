import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';

interface ThemedGradientBackgroundProps {
  children: React.ReactNode;
  style?: any;
}

export function ThemedGradientBackground({ children, style }: ThemedGradientBackgroundProps) {
  const { isDarkMode } = useTheme();

  // Light mode: Soft pink to purple to blue gradient
  const lightColors = ['#FFF5F5', '#F7E6FF', '#E6F3FF'];
  
  // Dark mode: Deep purple gradient with better contrast
  const darkColors = ['#0F0F23', '#1A1B3A', '#252659'];

  return (
    <LinearGradient
      colors={isDarkMode ? darkColors : lightColors}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});