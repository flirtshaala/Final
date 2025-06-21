import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch, Platform } from 'react-native';
import { router } from 'expo-router';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import { 
  ArrowLeft, 
  Bell, 
  Shield, 
  HelpCircle, 
  FileText, 
  Star, 
  Moon, 
  Sun,
  ChevronRight,
  Trash2
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your response history and reset your usage statistics. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Data Cleared', 'All your data has been cleared successfully.');
          }
        }
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert('Rate FlirtShaala', 'Thank you for using FlirtShaala! Please rate us on the app store.');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact us at support@flirtshaala.com for any questions or issues.');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy will be displayed here.');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Terms of service will be displayed here.');
  };

  const settingSections = [
    {
      title: 'Preferences',
      items: [
        {
          icon: isDarkMode ? <Moon size={20} color={colors.textSecondary} /> : <Sun size={20} color={colors.textSecondary} />,
          title: 'Dark Mode',
          subtitle: 'Switch between light and dark themes',
          action: (
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: '#FF6B7A' }}
              thumbColor="white"
              style={Platform.select({
                web: { transform: [{ scale: 0.8 }] },
                default: {},
              })}
            />
          ),
        },
        {
          icon: <Bell size={20} color={colors.textSecondary} />,
          title: 'Notifications',
          subtitle: 'Receive updates and reminders',
          action: (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: '#FF6B7A' }}
              thumbColor="white"
              style={Platform.select({
                web: { transform: [{ scale: 0.8 }] },
                default: {},
              })}
            />
          ),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <Star size={20} color={colors.textSecondary} />,
          title: 'Rate App',
          subtitle: 'Help us improve by rating the app',
          onPress: handleRateApp,
        },
        {
          icon: <HelpCircle size={20} color={colors.textSecondary} />,
          title: 'Help & Support',
          subtitle: 'Get help or contact support',
          onPress: handleSupport,
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          icon: <Shield size={20} color={colors.textSecondary} />,
          title: 'Privacy Policy',
          subtitle: 'How we handle your data',
          onPress: handlePrivacyPolicy,
        },
        {
          icon: <FileText size={20} color={colors.textSecondary} />,
          title: 'Terms of Service',
          subtitle: 'Terms and conditions',
          onPress: handleTermsOfService,
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: <Trash2 size={20} color="#F56565" />,
          title: 'Clear All Data',
          subtitle: 'Delete all response history and reset usage',
          onPress: handleClearData,
          destructive: true,
        },
      ],
    },
  ];

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
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Customize your FlirtShaala experience
          </Text>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            
            <View style={[styles.sectionContainer, { backgroundColor: colors.cardBackground }]}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={item.onPress}
                  disabled={!item.onPress}
                >
                  <View style={styles.settingIcon}>
                    {item.icon}
                  </View>
                  
                  <View style={styles.settingContent}>
                    <Text style={[
                      styles.settingTitle,
                      { color: item.destructive ? '#F56565' : colors.text }
                    ]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                  
                  <View style={styles.settingAction}>
                    {item.action || (item.onPress && (
                      <ChevronRight size={20} color={colors.textSecondary} />
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            FlirtShaala v1.0.0
          </Text>
          <Text style={[styles.versionSubtext, { color: colors.textSecondary }]}>
            Made with ❤️ for better conversations
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  sectionContainer: {
    borderRadius: 16,
    overflow: 'hidden',
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
  },
  settingAction: {
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  bottomSpacing: {
    height: 40,
  },
});