import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { User, LogIn, LogOut, Settings, Crown } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { supabase } from '@/services/supabase';
import { router } from 'expo-router';
import BannerAd from '@/components/BannerAd';

export default function ProfileTab() {
  const { user, setUser, setSession } = useAuthStore();
  const { responses, clearResponses } = useAppStore();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              setUser(null);
              setSession(null);
              clearResponses();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleSignIn = () => {
    router.push('/auth');
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <User size={32} color="#FF6B7A" />
            <Text style={styles.title}>Profile</Text>
          </View>

          {/* Sign In Prompt */}
          <View style={styles.signInPrompt}>
            <User size={64} color="#D1D5DB" />
            <Text style={styles.signInTitle}>Welcome to Flirtshaala</Text>
            <Text style={styles.signInSubtitle}>
              Sign in to save your responses, sync across devices, and unlock premium features
            </Text>
            
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <LogIn size={20} color="white" />
              <Text style={styles.signInButtonText}>Sign In / Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Features Preview */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>What you get with an account:</Text>
            
            <View style={styles.featureItem}>
              <Crown size={20} color="#FFD700" />
              <Text style={styles.featureText}>Save and sync your responses</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Crown size={20} color="#FFD700" />
              <Text style={styles.featureText}>Access response history</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Crown size={20} color="#FFD700" />
              <Text style={styles.featureText}>Premium subscription options</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Crown size={20} color="#FFD700" />
              <Text style={styles.featureText}>Cross-device synchronization</Text>
            </View>
          </View>

          <BannerAd />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <User size={32} color="#FF6B7A" />
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <User size={32} color="#FF6B7A" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{responses.length}</Text>
              <Text style={styles.statLabel}>Responses Generated</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>Free</Text>
              <Text style={styles.statLabel}>Plan</Text>
            </View>
          </View>
        </View>

        {/* Premium Upgrade */}
        <View style={styles.premiumCard}>
          <View style={styles.premiumHeader}>
            <Crown size={24} color="#FFD700" />
            <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          </View>
          <Text style={styles.premiumDescription}>
            Get unlimited responses, ad-free experience, and priority support
          </Text>
          <TouchableOpacity style={styles.premiumButton}>
            <Crown size={16} color="white" />
            <Text style={styles.premiumButtonText}>Coming Soon</Text>
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionItem}>
            <Settings size={20} color="#6B7280" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleSignOut}>
            <LogOut size={20} color="#EF4444" />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <BannerAd />
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  signInPrompt: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  signInTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  signInSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  featuresSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B7A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  premiumCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  premiumDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  premiumButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 20,
  },
});