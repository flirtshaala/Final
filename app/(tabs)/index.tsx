import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { MessageCircle, Send, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import { BannerAd } from '@/components/BannerAd';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { openaiService, ResponseType } from '@/services/openai';
import { apiService } from '@/services/api';
import { adService } from '@/services/ads';

export default function ChatTab() {
  const [message, setMessage] = useState('');
  const [responseType, setResponseType] = useState<ResponseType>('flirty');
  const [loading, setLoading] = useState(false);
  const [pickupLine, setPickupLine] = useState('');
  const [pickupLoading, setPickupLoading] = useState(false);

  const { canUseService, updateUsageStats, usageStats, isPremium } = useUser();
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();

  const responseTypes = [
    { key: 'flirty', label: 'Flirty', color: '#FF6B7A' },
    { key: 'witty', label: 'Witty', color: '#8B5CF6' },
    { key: 'savage', label: 'Savage', color: '#EF4444' },
  ] as const;

  const handleGenerateResponse = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message first!');
      return;
    }

    const serviceCheck = canUseService();
    
    if (!serviceCheck.canUse) {
      Alert.alert(
        'Service Unavailable', 
        serviceCheck.reason || 'Please sign in to use FlirtShaala',
        [
          { text: 'OK', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }

    if (serviceCheck.needsAd) {
      Alert.alert(
        'Watch Ad for Response',
        isPremium 
          ? 'You\'ve used your 30 ad-free replies today. Watch a quick ad to continue!'
          : 'Watch a quick ad to get your response!',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Watch Ad', 
            onPress: async () => {
              const adWatched = await adService.showRewardedAd();
              if (adWatched) {
                await generateResponse(true);
              } else {
                Alert.alert('Ad Incomplete', 'Please watch the complete ad to get your response.');
              }
            }
          }
        ]
      );
      return;
    }

    await generateResponse(false);
  };

  const generateResponse = async (watchedAd: boolean) => {
    setLoading(true);
    
    try {
      console.log('Generating response for:', { message, responseType });
      
      // Try backend API first, fallback to OpenAI service
      let response: string;
      
      try {
        // Call backend API
        const backendResponse = await apiService.generateResponse({
          chatText: message.trim(),
          responseType
        });
        response = backendResponse.response;
        console.log('Backend response received:', response);
      } catch (backendError) {
        console.warn('Backend API failed, falling back to OpenAI service:', backendError);
        
        // Fallback to direct OpenAI service
        response = await openaiService.generateFlirtyResponse(message.trim(), responseType);
        console.log('OpenAI service response received:', response);
      }
      
      if (!response || response.trim() === '') {
        throw new Error('Empty response received from server');
      }
      
      await updateUsageStats('reply', watchedAd);
      
      // Show interstitial ad every 5 actions for free users
      if (!isPremium && usageStats.totalActions > 0 && usageStats.totalActions % 5 === 0) {
        await adService.showInterstitialAd();
      }
      
      console.log('Navigating to result page with:', {
        response,
        originalText: message,
        responseType
      });
      
      router.push({
        pathname: '/(tabs)/result',
        params: { 
          response: response.trim(),
          originalText: message.trim(),
          responseType
        }
      });
      
      setMessage('');
    } catch (error: any) {
      console.error('Generate response error:', error);
      
      const errorMessage = error.message || 'Failed to generate response';
      
      Alert.alert(
        'Response Generation Failed',
        errorMessage,
        [
          { text: 'Try Again', onPress: () => handleGenerateResponse() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetPickupLine = async () => {
    setPickupLoading(true);
    try {
      const result = await apiService.getPickupLine();
      setPickupLine(result.line);
    } catch (error) {
      console.error('Pickup line error:', error);
      Alert.alert('Error', 'Failed to get pickup line. Please try again.');
    } finally {
      setPickupLoading(false);
    }
  };

  // Show loading animation when generating response
  if (loading) {
    return (
      <ThemedGradientBackground>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Generating your response...</Text>
          <Text style={[styles.loadingSubtext, { color: colors.textSecondary }]}>AI is crafting the perfect reply...</Text>
        </View>
      </ThemedGradientBackground>
    );
  }

  return (
    <ThemedGradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <MessageCircle size={28} color="#FF6B7A" />
              <Text style={[styles.title, { color: colors.text, fontFamily: 'Poppins-Bold' }]}>FlirtShaala</Text>
            </View>
          </View>

          {/* Sign In Prompt for Non-Authenticated Users */}
          {!user && (
            <View style={[styles.signInPromptCard, { backgroundColor: colors.cardBackground, borderColor: '#FF6B7A', ...Platform.select({
              web: {
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
              },
              default: {
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              },
            }) }]}>
              <Text style={[styles.signInPromptTitle, { color: colors.text }]}>Sign In Required</Text>
              <Text style={[styles.signInPromptText, { color: colors.textSecondary }]}>
                Please sign in to generate AI responses and access all features
              </Text>
              <TouchableOpacity
                style={styles.signInPromptButton}
                onPress={() => router.push('/auth/login')}
              >
                <Text style={styles.signInPromptButtonText}>Sign In Now</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Today's Usage - Only for authenticated users */}
          {user && !isPremium && (
            <View style={[styles.usageCard, { backgroundColor: colors.cardBackground, ...Platform.select({
              web: {
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
              },
              default: {
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              },
            }) }]}>
              <Text style={[styles.usageTitle, { color: colors.text, fontFamily: 'Poppins-SemiBold' }]}>Today's Usage</Text>
              <View style={styles.usageStats}>
                <View style={styles.usageStat}>
                  <Text style={[styles.usageNumber, { fontFamily: 'Poppins-Bold' }]}>{usageStats.adReplies}/50</Text>
                  <Text style={[styles.usageLabel, { color: colors.textSecondary, fontFamily: 'Poppins-Regular' }]}>Replies</Text>
                </View>
                <View style={styles.usageStat}>
                  <Text style={[styles.usageNumber, { fontFamily: 'Poppins-Bold' }]}>{50 - usageStats.dailyReplies}</Text>
                  <Text style={[styles.usageLabel, { color: colors.textSecondary, fontFamily: 'Poppins-Regular' }]}>Remaining</Text>
                </View>
              </View>
              {usageStats.dailyReplies >= 40 && (
                <TouchableOpacity
                  style={[styles.upgradePrompt, { backgroundColor: colors.surfaceSecondary }]}
                  onPress={() => router.push('/premium')}
                >
                  <Text style={[styles.upgradePromptText, { color: colors.primary, fontFamily: 'Poppins-SemiBold' }]}>
                    Running low on replies? Upgrade to Premium for unlimited access!
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Premium Usage Stats */}
          {user && isPremium && (
            <View style={[styles.usageCard, { backgroundColor: colors.cardBackground, ...Platform.select({
              web: {
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
              },
              default: {
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              },
            }) }]}>
              <Text style={[styles.usageTitle, { color: colors.text, fontFamily: 'Poppins-SemiBold' }]}>Premium Usage Today</Text>
              <View style={styles.usageStats}>
                <View style={styles.usageStat}>
                  <Text style={[styles.usageNumber, { fontFamily: 'Poppins-Bold' }]}>{usageStats.adFreeReplies}/30</Text>
                  <Text style={[styles.usageLabel, { color: colors.textSecondary, fontFamily: 'Poppins-Regular' }]}>Ad-free</Text>
                </View>
                <View style={styles.usageStat}>
                  <Text style={[styles.usageNumber, { fontFamily: 'Poppins-Bold' }]}>{usageStats.adReplies}/50</Text>
                  <Text style={[styles.usageLabel, { color: colors.textSecondary, fontFamily: 'Poppins-Regular' }]}>With ads</Text>
                </View>
              </View>
            </View>
          )}

          {/* Pickup Line Section - Only for authenticated users */}
          {user && (
            <View style={[styles.pickupSection, { backgroundColor: colors.cardBackground, ...Platform.select({
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
            }) }]}>
              <View style={styles.pickupHeader}>
                <Sparkles size={20} color="#8B5CF6" />
                <Text style={[styles.pickupTitle, { color: colors.text, fontFamily: 'Poppins-SemiBold' }]}>Break the Ice</Text>
              </View>
              
              {pickupLine ? (
                <View style={[styles.pickupResult, { backgroundColor: colors.surfaceSecondary }]}>
                  <Text style={[styles.pickupText, { color: colors.text, fontFamily: 'Poppins-Regular' }]}>{pickupLine}</Text>
                  <TouchableOpacity
                    style={styles.newPickupButton}
                    onPress={handleGetPickupLine}
                    disabled={pickupLoading}
                  >
                    <Text style={[styles.newPickupText, { fontFamily: 'Poppins-SemiBold' }]}>Get Another</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.pickupButton}
                  onPress={handleGetPickupLine}
                  disabled={pickupLoading}
                >
                  {pickupLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <Sparkles size={16} color="white" />
                      <Text style={[styles.pickupButtonText, { fontFamily: 'Poppins-SemiBold' }]}>Get Pickup Line</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Response Type Selection - Only for authenticated users */}
          {user && (
            <View style={styles.typeSection}>
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Poppins-SemiBold' }]}>Response Style</Text>
              <View style={styles.typeButtons}>
                {responseTypes.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.typeButton,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      responseType === type.key && { backgroundColor: type.color, borderColor: type.color },
                    ]}
                    onPress={() => setResponseType(type.key)}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        { color: colors.text, fontFamily: 'Poppins-SemiBold' },
                        responseType === type.key && { color: 'white' },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Message Input - Only for authenticated users */}
          {user && (
            <View style={styles.inputSection}>
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Poppins-SemiBold' }]}>Your Message</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                placeholder="Paste the message you want to respond to..."
                placeholderTextColor={colors.textSecondary}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
              />
            </View>
          )}

          {/* Generate Button - Only for authenticated users */}
          {user && (
            <TouchableOpacity
              style={[
                styles.generateButton,
                (!message.trim() || loading) && styles.generateButtonDisabled,
              ]}
              onPress={handleGenerateResponse}
              disabled={!message.trim() || loading}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Send size={20} color="white" />
                  <Text style={[styles.generateButtonText, { fontFamily: 'Poppins-Bold' }]}>Generate Response</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
      
      {/* Banner Ad */}
      {(!user || !isPremium) && <BannerAd />}
    </ThemedGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
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
    fontFamily: 'Poppins-SemiBold',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginLeft: 12,
  },
  signInPromptCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    alignItems: 'center',
  },
  signInPromptTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  signInPromptText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  signInPromptButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  signInPromptButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  usageCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  usageTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  usageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  usageStat: {
    alignItems: 'center',
  },
  usageNumber: {
    fontSize: 20,
    color: '#FF6B7A',
  },
  usageLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  upgradePrompt: {
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B7A',
  },
  upgradePromptText: {
    fontSize: 14,
    textAlign: 'center',
  },
  pickupSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  pickupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickupTitle: {
    fontSize: 18,
    marginLeft: 8,
  },
  pickupButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  pickupResult: {
    borderRadius: 12,
    padding: 16,
  },
  pickupText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  newPickupButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  newPickupText: {
    color: 'white',
    fontSize: 14,
  },
  typeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  typeButtonText: {
    fontSize: 16,
  },
  inputSection: {
    marginBottom: 24,
  },
  textInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
    borderWidth: 1,
  },
  generateButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  generateButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});