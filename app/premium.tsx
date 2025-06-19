import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { GradientBackground } from '@/components/GradientBackground';
import { Crown, Star, ArrowLeft, Zap, Heart, Shield } from 'lucide-react-native';

export default function PremiumScreen() {
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

  return (
    <GradientBackground style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#2D3748" />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Crown size={32} color="#FFD700" />
            <Text style={styles.title}>Upgrade to Premium</Text>
          </View>
          
          <Text style={styles.subtitle}>Unlock unlimited flirty responses</Text>
        </View>

        {/* Premium Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Zap size={24} color="#FF6B7A" />
            <Text style={styles.featureTitle}>Unlimited Responses</Text>
            <Text style={styles.featureDescription}>
              Generate as many witty replies as you want, no daily limits
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Shield size={24} color="#9B59B6" />
            <Text style={styles.featureTitle}>Ad-Free Experience</Text>
            <Text style={styles.featureDescription}>
              Enjoy the app without any interruptions or advertisements
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Heart size={24} color="#F56565" />
            <Text style={styles.featureTitle}>Priority Support</Text>
            <Text style={styles.featureDescription}>
              Get faster response times and dedicated customer support
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Star size={24} color="#FFD700" />
            <Text style={styles.featureTitle}>Advanced AI Models</Text>
            <Text style={styles.featureDescription}>
              Access to more sophisticated AI models for better responses
            </Text>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingCard}>
          <Text style={styles.pricingTitle}>Premium Plan</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>₹</Text>
            <Text style={styles.price}>299</Text>
            <Text style={styles.period}>/month</Text>
          </View>
          <Text style={styles.pricingSubtext}>Cancel anytime • No hidden fees</Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={handleUpgrade}
        >
          <Crown size={20} color="white" />
          <Text style={styles.upgradeButtonText}>Start Premium</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footerText}>
          By upgrading, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </GradientBackground>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#2D3748',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#718096',
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#2D3748',
    marginLeft: 16,
    marginBottom: 4,
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#718096',
    marginLeft: 16,
    flex: 1,
    lineHeight: 20,
  },
  pricingCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  pricingTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#2D3748',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currency: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FF6B7A',
  },
  price: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    color: '#FF6B7A',
  },
  period: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#718096',
  },
  pricingSubtext: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#A0AEC0',
  },
  upgradeButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginLeft: 8,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 16,
  },
});