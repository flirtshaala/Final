import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Platform } from 'react-native';

export default function AuthCallbackScreen() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { colors } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      if (Platform.OS !== 'web') {
        // For mobile, the OAuth flow is handled differently
        // This callback is primarily for web
        setStatus('error');
        setErrorMessage('This callback is for web authentication only');
        return;
      }

      // Extract tokens from URL hash fragment
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const tokenType = hashParams.get('token_type');
      const expiresIn = hashParams.get('expires_in');
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');

      // Check for OAuth errors
      if (error) {
        console.error('OAuth error:', error, errorDescription);
        setStatus('error');
        setErrorMessage(errorDescription || 'Authentication failed');
        
        // Clean up URL and redirect to login after delay
        cleanupUrl();
        setTimeout(() => {
          router.replace('/auth/login');
        }, 3000);
        return;
      }

      // Check if we have the required tokens
      if (!accessToken) {
        console.error('No access token found in callback');
        setStatus('error');
        setErrorMessage('No authentication token received');
        
        // Clean up URL and redirect to login after delay
        cleanupUrl();
        setTimeout(() => {
          router.replace('/auth/login');
        }, 3000);
        return;
      }

      // Import Supabase client dynamically to avoid SSR issues
      const { supabase } = await import('@/services/supabase');

      // Set the session with the received tokens
      const { data, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      });

      if (sessionError) {
        console.error('Session error:', sessionError);
        setStatus('error');
        setErrorMessage('Failed to establish session');
        
        // Clean up URL and redirect to login after delay
        cleanupUrl();
        setTimeout(() => {
          router.replace('/auth/login');
        }, 3000);
        return;
      }

      if (data.session && data.user) {
        console.log('Authentication successful:', data.user.email);
        setStatus('success');
        
        // Clean up URL immediately
        cleanupUrl();
        
        // Redirect to main app after short delay
        setTimeout(() => {
          router.replace('/(tabs)/chat');
        }, 1500);
      } else {
        setStatus('error');
        setErrorMessage('Failed to create user session');
        
        // Clean up URL and redirect to login after delay
        cleanupUrl();
        setTimeout(() => {
          router.replace('/auth/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Callback handling error:', error);
      setStatus('error');
      setErrorMessage('An unexpected error occurred');
      
      // Clean up URL and redirect to login after delay
      cleanupUrl();
      setTimeout(() => {
        router.replace('/auth/login');
      }, 3000);
    }
  };

  const cleanupUrl = () => {
    try {
      // Remove hash fragment from URL without triggering navigation
      if (typeof window !== 'undefined' && window.history) {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch (error) {
      console.warn('Failed to clean up URL:', error);
    }
  };

  // If user is already authenticated, redirect immediately
  useEffect(() => {
    if (user && status === 'success') {
      router.replace('/(tabs)/chat');
    }
  }, [user, status]);

  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return 'Completing authentication...';
      case 'success':
        return 'Authentication successful! Redirecting...';
      case 'error':
        return `Authentication failed: ${errorMessage}`;
      default:
        return 'Processing...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return colors.textSecondary;
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <ThemedGradientBackground style={styles.container}>
      <View style={styles.content}>
        <LoadingSpinner />
        <Text style={[styles.title, { color: colors.text }]}>
          {status === 'loading' && 'Authenticating...'}
          {status === 'success' && 'Welcome to FlirtShaala!'}
          {status === 'error' && 'Authentication Error'}
        </Text>
        <Text style={[styles.message, { color: getStatusColor() }]}>
          {getStatusMessage()}
        </Text>
        {status === 'error' && (
          <Text style={[styles.redirectMessage, { color: colors.textSecondary }]}>
            Redirecting to login page...
          </Text>
        )}
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
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  redirectMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 16,
  },
});