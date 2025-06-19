import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: any;
}

export function GradientBackground({ children, style }: GradientBackgroundProps) {
  const colors = ['#FFF5F5', '#F7E6FF', '#E6F3FF'];

  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.gradient,
          {
            background: `linear-gradient(135deg, ${colors.join(', ')})`,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={colors}
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