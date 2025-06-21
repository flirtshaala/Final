import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/services/supabase';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    // Check if we have valid reset tokens in the URL
    if (Platform.OS === 'web') {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (type === 'recovery' && accessToken) {
        setIsValidToken(true);
        // Set the session for password reset
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });
      }
    }
  }, []);

  const handleResetPassword = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      Alert.alert(
        'Password Updated',
        'Your password has been successfully updated. You can now sign in with your new password.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedGradientBackground>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Updating your password...</Text>
        </View>
      </ThemedGradientBackground>
    );
  }

  if (!isValidToken) {
    return (
      <ThemedGradientBackground style={styles.container}>
        <View style={styles.content}>
          <View style={styles.errorContainer}>
            <Text style={[styles.errorTitle, { color: colors.text }]}>Invalid Reset Link</Text>
            <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
              This password reset link is invalid or has expired. Please request a new password reset link.
            </Text>
            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => router.replace('/auth/forgot-password')}
            >
              <Text style={styles.backToLoginText}>Request New Reset Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedGradientBackground>
    );
  }

  return (
    <ThemedGradientBackground style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface }]}
            onPress={() => router.replace('/auth/login')}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your new password below
          </Text>
        </View>

        {/* Reset Form */}
        <View style={[styles.formContainer, { backgroundColor: colors.cardBackground }]}>
          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>New Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Lock size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder="Enter new password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Confirm New Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Lock size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder="Confirm new password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Update Password Button */}
          <TouchableOpacity
            style={[styles.updateButton, { opacity: (!password.trim() || !confirmPassword.trim()) ? 0.6 : 1 }]}
            onPress={handleResetPassword}
            disabled={!password.trim() || !confirmPassword.trim()}
          >
            <Text style={styles.updateButtonText}>Update Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginTop: 16,
    textAlign: 'center',
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
  },
  formContainer: {
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
      },
    }),
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginLeft: 12,
    marginRight: 8,
  },
  updateButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 12px rgba(255, 107, 122, 0.3)',
      },
      default: {
        shadowColor: '#FF6B7A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
      },
    }),
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  backToLoginButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  backToLoginText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});