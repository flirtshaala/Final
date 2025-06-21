import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const { colors } = useTheme();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setEmailSent(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedGradientBackground>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Sending reset email...</Text>
        </View>
      </ThemedGradientBackground>
    );
  }

  if (emailSent) {
    return (
      <ThemedGradientBackground style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successContainer}>
            <View style={[styles.successIcon, { backgroundColor: colors.success }]}>
              <CheckCircle size={48} color="white" />
            </View>
            <Text style={[styles.successTitle, { color: colors.text }]}>Email Sent!</Text>
            <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
              We've sent a password reset link to {email}. Please check your email and follow the instructions to reset your password.
            </Text>
            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => router.replace('/auth/login')}
            >
              <Text style={styles.backToLoginText}>Back to Login</Text>
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
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Forgot Password</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your email address and we'll send you a link to reset your password
          </Text>
        </View>

        {/* Reset Form */}
        <View style={[styles.formContainer, { backgroundColor: colors.cardBackground }]}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Mail size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            style={[styles.resetButton, { opacity: !email.trim() ? 0.6 : 1 }]}
            onPress={handleResetPassword}
            disabled={!email.trim()}
          >
            <Text style={styles.resetButtonText}>Send Reset Link</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backToLoginContainer}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={[styles.backToLoginLink, { color: colors.primary }]}>
              Back to Login
            </Text>
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
  },
  resetButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
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
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  backToLoginContainer: {
    alignItems: 'center',
  },
  backToLoginLink: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
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