import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, Linking, Platform } from 'react-native';
import { router } from 'expo-router';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import { ArrowLeft, Mail, Star, Moon, Sun, Info, Heart } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode, colors } = useTheme();

  const handleFeedback = () => {
    const email = 'flirtshaala@gmail.com';
    const subject = 'Flirtshaala App Feedback';
    const body = 'Hi Flirtshaala team,\n\nI have some feedback about the app:\n\n';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert(
        'Email Not Available',
        'Please send your feedback to: flirtshaala@gmail.com',
        [
          { text: 'Copy Email', onPress: () => {
            if (Platform.OS === 'web') {
              navigator.clipboard.writeText('flirtshaala@gmail.com');
            }
            Alert.alert('Email Copied', 'flirtshaala@gmail.com');
          }},
          { text: 'OK', style: 'cancel' }
        ]
      );
    });
  };

  const handleRateUs = () => {
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com/app/flirtshaala',
      android: 'https://play.google.com/store/apps/details?id=com.flirtshaala.app',
      default: 'https://flirtshaala.com'
    });

    Linking.openURL(storeUrl).catch(() => {
      Alert.alert('Store Not Available', 'Please rate us on your device\'s app store.');
    });
  };

  const handleAbout = () => {
    Alert.alert(
      'About Flirtshaala',
      'Flirtshaala is your AI wingman for crafting perfect chat responses. Our smart language detection helps you respond in the right tone and language.\n\nVersion: 1.0.0\nDeveloped with ❤️ for better conversations.',
      [{ text: 'OK' }]
    );
  };

  const handleToggleDarkMode = (value: boolean) => {
    toggleDarkMode();
  };

  return (
    <ThemedGradientBackground style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.settingsContainer}>
          {/* Appearance */}
          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
            
            <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
              <View style={styles.settingInfo}>
                {isDarkMode ? (
                  <Moon size={20} color={colors.textSecondary} />
                ) : (
                  <Sun size={20} color={colors.textSecondary} />
                )}
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Switch between light and dark themes
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleToggleDarkMode}
                trackColor={{ false: colors.border, true: '#FF6B7A' }}
                thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>

          {/* Feedback & Support */}
          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Feedback & Support</Text>
            
            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: colors.surface }]} 
              onPress={handleFeedback}
            >
              <View style={styles.settingInfo}>
                <Mail size={20} color={colors.textSecondary} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Send Feedback</Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Share your thoughts and suggestions
                  </Text>
                </View>
              </View>
              <ArrowLeft size={16} color={colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: colors.surface }]} 
              onPress={handleRateUs}
            >
              <View style={styles.settingInfo}>
                <Star size={20} color={colors.textSecondary} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Rate Us</Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Rate Flirtshaala on the app store
                  </Text>
                </View>
              </View>
              <ArrowLeft size={16} color={colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          </View>

          {/* About */}
          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
            
            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: colors.surface }]} 
              onPress={handleAbout}
            >
              <View style={styles.settingInfo}>
                <Info size={20} color={colors.textSecondary} />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>About Flirtshaala</Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    App version and information
                  </Text>
                </View>
              </View>
              <ArrowLeft size={16} color={colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.footerContent}>
            <Heart size={16} color="#FF6B7A" />
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Made with love for better conversations
            </Text>
          </View>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>Version 1.0.0</Text>
        </View>
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
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
  },
  settingsContainer: {
    flex: 1,
  },
  settingsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    marginLeft: 4,
  },
  settingItem: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});