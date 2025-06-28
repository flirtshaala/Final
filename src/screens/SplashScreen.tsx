import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedGradientBackground } from '../components/ThemedGradientBackground';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SplashScreen() {
  const navigation = useNavigation();
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        if (user) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        }
      }, 2000);
    }
  }, [user, loading, navigation]);

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
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
});