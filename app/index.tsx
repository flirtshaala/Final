import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Heart } from 'lucide-react-native';

export default function WelcomeScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Always navigate to tabs - authentication is handled within the app
      router.replace('/(tabs)');
    }
  }, [loading]);

  // Show splash screen while loading
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Heart size={64} color="#FF6B7A" fill="#FF6B7A" />
          <Text style={styles.appName}>FlirtShaala</Text>
          <Text style={styles.tagline}>Chat Smarter. Flirt Better.</Text>
        </View>
      </View>
    );
  }

  // This return should never be reached due to navigation
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  logoContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 16,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
});