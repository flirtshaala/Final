import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import BannerAd from '@/components/BannerAd';
import { User, Crown, ChartBar as BarChart3, Star, Settings, LogOut, CreditCard as Edit } from 'lucide-react-native';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function AccountTab() {
  const [loading, setLoading] = useState(false);
  const { isPremium, usageStats } = useUser();
  const { user, userProfile, signOut } = useAuth();
  const { colors, isDarkMode, toggleDarkMode } = useTheme();

  const handleUpgradeToPremium = () => {
    router.push('/premium');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'Guest User';
    
    // Priority: userProfile.name > user metadata name > email username
    if (userProfile?.name) {
      return userProfile.name;
    }
    
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    if (user.user_metadata?.name) {
      return user.user_metadata.name;
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  };

  // Get user status
  const getUserStatus = () => {
    if (!user) return 'Not signed in';
    
    if (userProfile?.plan_type === 'premium' || isPremium) {
      return 'Premium User';
    }
    
    return 'Free User';
  };

  // Get status color
  const getStatusColor = () => {
    if (!user) return colors.textSecondary;
    
    if (userProfile?.plan_type === 'premium' || isPremium) {
      return '#FFD700'; // Gold for premium
    }
    
    return '#10B981'; // Green for free users
  };

  // Show loading animation when signing out
  if (loading) {
    return (
      <ThemedGradientBackground>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Signing you out...</Text>
          <Text style={[styles.loadingSubtext, { color: colors.textSecondary }]}>Please wait a moment</Text>
        </View>
      </ThemedGradientBackground>
    );
  }

  return (
    <ThemedGradientBackground style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <User size={28} color={colors.text} />
            <Text style={[styles.title, { color: colors.text }]}>Account</Text>
          </View>
          {(userProfile?.plan_type === 'premium' || isPremium) && (
            <View style={styles.premiumBadge}>
              <Crown size={16} color="#FFD700" />
              <Text style={[styles.premiumText]}>Premium</Text>
            </View>
          )}
        </View>

        {/* User Info Card */}
        <View style={[styles.userCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.userInfo}>
            <View style={[styles.avatarContainer, { backgroundColor: isDarkMode ? '#4A5568' : '#FFF5F5' }]}>
              <User size={32} color="#FF6B7A" />
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {getUserDisplayName()}
              </Text>
              <Text style={[styles.userStatus, { color: getStatusColor() }]}>
                {getUserStatus()}
              </Text>
              {user && (
                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                  {user.email}
                </Text>
              )}
              {!user && (
                <Text style={[styles.guestDescription, { color: colors.textSecondary }]}>
                  Sign in to sync your data across devices
                </Text>
              )}
            </View>
          </View>
          
          {user ? (
            <View style={styles.userActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.surfaceSecondary }]}
                onPress={handleEditProfile}
              >
                <Edit size={16} color={colors.text} />
              </TouchableOpacity>
              {(userProfile?.plan_type !== 'premium' && !isPremium) && (
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={handleUpgradeToPremium}
                >
                  <Crown size={16} color="white" />
                  <Text style={[styles.upgradeButtonText]}>Upgrade</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
            >
              <Text style={[styles.signInButtonText]}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Theme Toggle */}
        <View style={[styles.themeCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.themeInfo}>
            <Text style={[styles.themeTitle, { color: colors.text }]}>Dark Mode</Text>
            <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
              Switch between light and dark themes
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: isDarkMode ? '#FF6B7A' : colors.border }]}
            onPress={toggleDarkMode}
          >
            <View style={[styles.themeToggleThumb, { 
              backgroundColor: 'white',
              transform: [{ translateX: isDarkMode ? 20 : 0 }]
            }]} />
          </TouchableOpacity>
        </View>

        {/* Account Status Card */}
        {user && (
          <View style={[styles.statusCard, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.statusHeader}>
              <Text style={[styles.statusTitle, { color: colors.text }]}>
                Account Status
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: userProfile?.plan_type === 'premium' || isPremium ? '#FFD700' : '#10B981' }
              ]}>
                <Text style={[styles.statusBadgeText]}>
                  {userProfile?.plan_type === 'premium' || isPremium ? 'PREMIUM' : 'FREE'}
                </Text>
              </View>
            </View>
            
            <View style={styles.statusDetails}>
              <View style={styles.statusItem}>
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
                  Member since
                </Text>
                <Text style={[styles.statusValue, { color: colors.text }]}>
                  {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'Recently'}
                </Text>
              </View>
              
              <View style={styles.statusItem}>
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
                  Total responses
                </Text>
                <Text style={[styles.statusValue, { color: colors.text }]}>
                  {userProfile?.usage_count || 0}
                </Text>
              </View>
              
              <View style={styles.statusItem}>
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
                  Plan benefits
                </Text>
                <Text style={[styles.statusValue, { color: colors.text }]}>
                  {userProfile?.plan_type === 'premium' || isPremium ? 'Unlimited + Ad-free' : '50 daily replies'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Usage Statistics */}
        <View style={[styles.statsCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.statsHeader}>
            <BarChart3 size={24} color="#9B59B6" />
            <Text style={[styles.statsTitle, { color: colors.text }]}>
              {user ? "Today's Usage" : "Sign in Required"}
            </Text>
          </View>
          
          {user ? (
            <View style={styles.statsGrid}>
              {isPremium ? (
                <>
                  <View style={[styles.statItem, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text style={[styles.statNumber]}>{userProfile?.usage_count || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Usage</Text>
                  </View>
                  
                  <View style={[styles.statItem, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text style={[styles.statNumber]}>∞</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Daily Limit</Text>
                  </View>
                  
                  <View style={[styles.statItem, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text style={[styles.statNumber]}>Premium</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Plan</Text>
                  </View>
                  
                  <View style={[styles.statItem, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text style={[styles.statNumber]}>✓</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Ad-free</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={[styles.statItem, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text style={[styles.statNumber]}>
                      {userProfile?.usage_count || 0}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                      Total Usage
                    </Text>
                  </View>
                  
                  <View style={[styles.statItem, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text style={[styles.statNumber]}>50</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Daily Limit</Text>
                  </View>
                  
                  <View style={[styles.statItem, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text style={[styles.statNumber]}>Free</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Plan</Text>
                  </View>
                  
                  <View style={[styles.statItem, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text style={[styles.statNumber]}>Ads</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>With Ads</Text>
                  </View>
                </>
              )}
            </View>
          ) : (
            <View style={styles.signInPrompt}>
              <Text style={[styles.signInPromptText, { color: colors.textSecondary }]}>
                Sign in to track your usage statistics and sync data across devices
              </Text>
              <TouchableOpacity
                style={styles.signInPromptButton}
                onPress={handleSignIn}
              >
                <Text style={[styles.signInPromptButtonText]}>Sign In Now</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={[styles.resetInfo, { backgroundColor: isDarkMode ? '#2D5016' : '#F0FDF4', borderLeftColor: '#10B981' }]}>
            <Text style={[styles.resetInfoText, { color: isDarkMode ? '#68D391' : '#059669' }]}>
              {user ? 'Usage tracked across all your devices' : 'Sign in to track usage across devices'}
            </Text>
          </View>
        </View>

        {/* Premium Features */}
        {(!user || (userProfile?.plan_type !== 'premium' && !isPremium)) && (
          <View style={[styles.premiumCard, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.premiumHeader}>
              <Crown size={24} color="#FFD700" />
              <Text style={[styles.premiumTitle, { color: colors.text }]}>Upgrade to Premium</Text>
            </View>
            
            <Text style={[styles.premiumPrice]}>₹299/month</Text>
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Star size={16} color="#FFD700" />
                <Text style={[styles.featureText, { color: colors.text }]}>Unlimited responses daily</Text>
              </View>
              <View style={styles.featureItem}>
                <Star size={16} color="#FFD700" />
                <Text style={[styles.featureText, { color: colors.text }]}>Ad-free experience</Text>
              </View>
              <View style={styles.featureItem}>
                <Star size={16} color="#FFD700" />
                <Text style={[styles.featureText, { color: colors.text }]}>Priority support</Text>
              </View>
              <View style={styles.featureItem}>
                <Star size={16} color="#FFD700" />
                <Text style={[styles.featureText, { color: colors.text }]}>Advanced AI models</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.premiumUpgradeButton}
              onPress={handleUpgradeToPremium}
            >
              <Crown size={20} color="white" />
              <Text style={[styles.premiumUpgradeText]}>Upgrade Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Actions */}
        <View style={[styles.actionsCard, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity style={styles.actionItem} onPress={handleSettings}>
            <Settings size={20} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Settings</Text>
          </TouchableOpacity>
          
          {user && (
            <TouchableOpacity style={styles.actionItem} onPress={handleSignOut}>
              <LogOut size={20} color="#F56565" />
              <Text style={[styles.actionText, { color: '#F56565' }]}>Sign Out</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* App Info */}
        <View style={[styles.appInfoCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.appInfoTitle, { color: colors.text }]}>About FlirtShaala</Text>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
            Your AI wingman for crafting perfect chat responses. Smart language detection and witty replies in multiple languages!
          </Text>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>Version 1.0.0</Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Banner Ad */}
      {(!user || (userProfile?.plan_type !== 'premium' && !isPremium)) && <BannerAd />}
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
    fontFamily: 'ProximaNova-SemiBold',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    fontFamily: 'ProximaNova-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'ProximaNova-Bold',
    marginLeft: 12,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 12,
    fontFamily: 'ProximaNova-SemiBold',
    marginLeft: 4,
  },
  userCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'ProximaNova-SemiBold',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    fontFamily: 'ProximaNova-SemiBold',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    fontFamily: 'ProximaNova-Regular',
    marginTop: 2,
  },
  guestDescription: {
    fontSize: 12,
    fontFamily: 'ProximaNova-Regular',
    marginTop: 2,
    lineHeight: 16,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'ProximaNova-SemiBold',
    marginLeft: 4,
  },
  signInButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'ProximaNova-SemiBold',
  },
  themeCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeInfo: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontFamily: 'ProximaNova-SemiBold',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
    fontFamily: 'ProximaNova-Regular',
  },
  themeToggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
  },
  themeToggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  statusCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontFamily: 'ProximaNova-SemiBold',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'ProximaNova-SemiBold',
  },
  statusDetails: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: 'ProximaNova-Regular',
  },
  statusValue: {
    fontSize: 14,
    fontFamily: 'ProximaNova-SemiBold',
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: 'ProximaNova-SemiBold',
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'ProximaNova-Bold',
    color: '#9B59B6',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'ProximaNova-Regular',
    marginTop: 4,
    textAlign: 'center',
  },
  signInPrompt: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  signInPromptText: {
    fontSize: 14,
    fontFamily: 'ProximaNova-Regular',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  signInPromptButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  signInPromptButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'ProximaNova-SemiBold',
  },
  resetInfo: {
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
  },
  resetInfoText: {
    fontSize: 12,
    fontFamily: 'ProximaNova-Regular',
    textAlign: 'center',
  },
  premiumCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 20,
    fontFamily: 'ProximaNova-Bold',
    marginLeft: 12,
  },
  premiumPrice: {
    fontSize: 24,
    fontFamily: 'ProximaNova-Bold',
    color: '#FF6B7A',
    marginBottom: 20,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'ProximaNova-Regular',
    marginLeft: 12,
  },
  premiumUpgradeButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumUpgradeText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'ProximaNova-Bold',
    marginLeft: 8,
  },
  actionsCard: {
    borderRadius: 20,
    padding: 8,
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'ProximaNova-Regular',
    marginLeft: 12,
  },
  appInfoCard: {
    borderRadius: 20,
    padding: 20,
  },
  appInfoTitle: {
    fontSize: 18,
    fontFamily: 'ProximaNova-SemiBold',
    marginBottom: 8,
  },
  appInfoText: {
    fontSize: 14,
    fontFamily: 'ProximaNova-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'ProximaNova-Regular',
  },
  bottomSpacing: {
    height: 100,
  },
});