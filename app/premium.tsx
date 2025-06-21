import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import { Crown, Star, Check, ArrowLeft, Zap, Shield, Heart } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function PremiumScreen() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();
  const { colors } = useTheme();

  const handleUpgrade = () => {
    Alert.alert(
      'Coming Soon!',
      'Premium subscriptions will be available soon. We\'re working on integrating secure payment processing.',
      [
        { text: 'Notify Me', onPress: () => {
          Alert.alert('Thanks!', 'We\'ll notify you when Premium is available.');
        }},
        { text: 'OK', style: 'cancel' }
      ]
    );
  };

  const features = [
    {
      icon: <Zap size={24} color="#FFD700" />,
      title: 'Unlimited Responses',
      description: 'Generate unlimited AI responses daily without any restrictions'
    },
    {
      icon: <Shield size={24} color="#FFD700" />,
      title: 'Ad-Free Experience',
      description: 'Enjoy FlirtShaala without any advertisements or interruptions'
    },
    {
      icon: <Star size={24} color="#FFD700" />,
      title: 'Priority Support',
      description: 'Get faster response times and priority customer support'
    },
    {
      icon: <Heart size={24} color="#FFD700" />,
      title: 'Advanced AI Models',
      description: 'Access to more sophisticated AI models for better responses'
    },
    {
      icon: <Crown size={24} color="#FFD700" />,
      title: 'Premium Badge',
      description: 'Show off your premium status with exclusive badges'
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
          
          <View style={styles.titleContainer}>
            <Crown size={32} color="#FFD700" />
            <Text style={[styles.title, { color: colors.text }]}>FlirtShaala Premium</Text>
          </View>
          
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Unlock the full potential of AI-powered conversations
          </Text>
        </View>

        {/* Premium Features */}
        <View style={[styles.featuresContainer, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>Premium Features</Text>
          
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                {feature.icon}
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing Plans */}
        <View style={[styles.pricingContainer, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.pricingTitle, { color: colors.text }]}>Choose Your Plan</Text>
          
          {/* Monthly Plan */}
          <TouchableOpacity
            style={[
              styles.planCard,
              { 
                backgroundColor: colors.surface,
                borderColor: selectedPlan === 'monthly' ? '#FFD700' : colors.border,
                borderWidth: selectedPlan === 'monthly' ? 2 : 1
              }
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: colors.text }]}>Monthly</Text>
              {selectedPlan === 'monthly' && (
                <View style={styles.selectedBadge}>
                  <Check size={16} color="white" />
                </View>
              )}
            </View>
            <Text style={[styles.planPrice, { color: colors.text }]}>₹299</Text>
            <Text style={[styles.planPeriod, { color: colors.textSecondary }]}>per month</Text>
          </TouchableOpacity>

          {/* Yearly Plan */}
          <TouchableOpacity
            style={[
              styles.planCard,
              { 
                backgroundColor: colors.surface,
                borderColor: selectedPlan === 'yearly' ? '#FFD700' : colors.border,
                borderWidth: selectedPlan === 'yearly' ? 2 : 1
              }
            ]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: colors.text }]}>Yearly</Text>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>Save 33%</Text>
              </View>
              {selectedPlan === 'yearly' && (
                <View style={styles.selectedBadge}>
                  <Check size={16} color="white" />
                </View>
              )}
            </View>
            <Text style={[styles.planPrice, { color: colors.text }]}>₹1,999</Text>
            <Text style={[styles.planPeriod, { color: colors.textSecondary }]}>per year</Text>
            <Text style={[styles.planSavings, { color: colors.primary }]}>
              Save ₹1,589 compared to monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* Upgrade Button */}
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={handleUpgrade}
        >
          <Crown size={20} color="white" />
          <Text style={styles.upgradeButtonText}>
            Upgrade to Premium - {selectedPlan === 'monthly' ? '₹299/month' : '₹1,999/year'}
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Subscription automatically renews unless cancelled.
        </Text>

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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
  },
  featuresContainer: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
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
  featuresTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
  pricingContainer: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
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
  pricingTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
  },
  savingsBadge: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  savingsText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  selectedBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planPrice: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  planSavings: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 4,
  },
  upgradeButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 12px rgba(255, 215, 0, 0.3)',
      },
      default: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
      },
    }),
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginLeft: 8,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 40,
  },
});