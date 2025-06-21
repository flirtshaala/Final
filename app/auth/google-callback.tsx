import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTheme } from '@/context/ThemeContext';
import { Platform } from 'react-native';

interface AuthMessage {
  type: 'auth_success' | 'auth_error' | 'auth_cancelled';
  session?: any;
  error?: string;
}

export default function GoogleCallbackScreen() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const { colors } = useTheme();

  useEffect(() => {
    handleGoogleCallback();
  }, []);

  const handleGoogleCallback = async () => {
    try {
      if (Platform.OS !== 'web') {
        sendMessageToParent({
          type: 'auth_error',
          error: 'This callback is for web authentication only'
        });
        return;
      }

      // Extract tokens from URL hash fragment
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');

      // Check for OAuth errors
      if (error) {
        console.error('OAuth error:', error, errorDescription);
        setStatus('error');
        setMessage(errorDescription || 'Authentication failed');
        
        sendMessageToParent({
          type: 'auth_error',
          error: errorDescription || 'Authentication failed'
        });
        
        // Close popup after delay
        setTimeout(() => {
          window.close();
        }, 2000);
        return;
      }

      // Check if we have the required tokens
      if (!accessToken) {
        console.error('No access token found in callback');
        setStatus('error');
        setMessage('No authentication token received');
        
        sendMessageToParent({
          type: 'auth_error',
          error: 'No authentication token received'
        });
        
        // Close popup after delay
        setTimeout(() => {
          window.close();
        }, 2000);
        return;
      }

      // Import Supabase client
      const { supabase } = await import('@/services/supabase');

      // Set the session with the received tokens
      const { data, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      });

      if (sessionError) {
        console.error('Session error:', sessionError);
        setStatus('error');
        setMessage('Failed to establish session');
        
        sendMessageToParent({
          type: 'auth_error',
          error: 'Failed to establish session'
        });
        
        // Close popup after delay
        setTimeout(() => {
          window.close();
        }, 2000);
        return;
      }

      if (data.session && data.user) {
        console.log('Authentication successful:', data.user.email);
        setStatus('success');
        setMessage('Authentication successful!');
        
        // Send success message to parent window
        sendMessageToParent({
          type: 'auth_success',
          session: data.session
        });
        
        // Close popup after short delay
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        setStatus('error');
        setMessage('Failed to create user session');
        
        sendMessageToParent({
          type: 'auth_error',
          error: 'Failed to create user session'
        });
        
        // Close popup after delay
        setTimeout(() => {
          window.close();
        }, 2000);
      }
    } catch (error) {
      console.error('Callback handling error:', error);
      setStatus('error');
      setMessage('An unexpected error occurred');
      
      sendMessageToParent({
        type: 'auth_error',
        error: 'An unexpected error occurred'
      });
      
      // Close popup after delay
      setTimeout(() => {
        window.close();
      }, 2000);
    }
  };

  const sendMessageToParent = (message: AuthMessage) => {
    try {
      if (window.opener && !window.opener.closed) {
        // Send message to parent window
        window.opener.postMessage(message, window.location.origin);
      }
    } catch (error) {
      console.error('Failed to send message to parent:', error);
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

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <LoadingSpinner />;
      case 'success':
        return <Text style={[styles.icon, { color: colors.success }]}>✓</Text>;
      case 'error':
        return <Text style={[styles.icon, { color: colors.error }]}>✗</Text>;
      default:
        return <LoadingSpinner />;
    }
  };

  return (
    <ThemedGradientBackground style={styles.container}>
      <View style={styles.content}>
        {getStatusIcon()}
        <Text style={[styles.title, { color: colors.text }]}>
          {status === 'loading' && 'Authenticating...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Authentication Failed'}
        </Text>
        <Text style={[styles.message, { color: getStatusColor() }]}>
          {message}
        </Text>
        {status !== 'loading' && (
          <Text style={[styles.closeMessage, { color: colors.textSecondary }]}>
            This window will close automatically
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
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  closeMessage: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});