import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Platform, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import BannerAd from '@/components/BannerAd';
import { Camera, Image as ImageIcon, Upload, X } from 'lucide-react-native';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { openaiService, ResponseType } from '@/services/openai';
import { apiService } from '@/services/api';
import { ocrService } from '@/services/ocr';
import { adService } from '@/services/ads';
import { validateImageUri } from '@/services/imageValidation';
import * as ImagePicker from 'expo-image-picker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ScreenshotTab() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseType, setResponseType] = useState<ResponseType>('flirty');
  const { canUseService, updateUsageStats, usageStats, isPremium } = useUser();
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();

  const requestPermissions = async () => {
    if (Platform.OS === 'web') {
      return true; // Web doesn't need permissions for file picker
    }
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your photos to upload screenshots.');
      return false;
    }
    return true;
  };

  const validateAndSetImage = (imageUri: string) => {
    try {
      const validation = validateImageUri(imageUri);
      if (!validation.isValid) {
        Alert.alert('Invalid Image', validation.error || 'Please select a valid image file.');
        return false;
      }
      
      setSelectedImage(imageUri);
      return true;
    } catch (error) {
      console.error('Image validation error:', error);
      Alert.alert('Invalid Image', 'Please select a valid image file.');
      return false;
    }
  };

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      // Web file input implementation
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          // Validate file size (50MB limit)
          if (file.size > 50 * 1024 * 1024) {
            Alert.alert('File Too Large', 'Please select an image smaller than 50MB.');
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) {
              validateAndSetImage(result);
            }
          };
          reader.onerror = () => {
            Alert.alert('Error', 'Failed to read the selected file.');
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.Images],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        validateAndSetImage(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Camera Not Available', 'Camera is not available on web. Please use the gallery option.');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your camera to take photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        validateAndSetImage(imageUri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleProcessScreenshot = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select a screenshot first!');
      return;
    }

    // Validate image before processing
    const validation = validateImageUri(selectedImage);
    if (!validation.isValid) {
      Alert.alert('Invalid Image', validation.error || 'Please select a valid image file.');
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
                await processScreenshot(true);
              } else {
                Alert.alert('Ad Incomplete', 'Please watch the complete ad to get your response.');
              }
            }
          }
        ]
      );
      return;
    }

    await processScreenshot(false);
  };

  const processScreenshot = async (watchedAd: boolean) => {
    if (!selectedImage) return;

    setLoading(true);
    
    try {
      console.log('Processing screenshot:', { selectedImage, responseType });
      
      // Extract text from image using OCR with validation
      const extractedText = await ocrService.extractTextFromImage(selectedImage);
      console.log('Extracted text:', extractedText);
      
      // Try backend API first, fallback to OpenAI service
      let response: string;
      
      try {
        // Call backend API
        const backendResponse = await apiService.generateResponse({
          chatText: extractedText.trim(),
          responseType
        });
        response = backendResponse.response;
        console.log('Backend response received:', response);
      } catch (backendError) {
        console.warn('Backend API failed, falling back to OpenAI service:', backendError);
        
        // Fallback to direct OpenAI service
        response = await openaiService.generateFlirtyResponse(extractedText.trim(), responseType);
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
      
      console.log('Navigating to history page with:', {
        response,
        originalText: extractedText,
        responseType,
        imageUri: selectedImage
      });
      
      router.push({
        pathname: '/(tabs)/history',
        params: { 
          response: response.trim(),
          originalText: extractedText.trim(),
          responseType,
          imageUri: selectedImage
        }
      });
    } catch (error: any) {
      console.error('Process screenshot error:', error);
      
      const errorMessage = error.message || 'Failed to process screenshot';
      
      Alert.alert(
        'Screenshot Processing Failed',
        errorMessage,
        [
          { text: 'Try Again', onPress: () => handleProcessScreenshot() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading animation when processing screenshot
  if (loading) {
    return (
      <ThemedGradientBackground>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Analyzing your screenshot...</Text>
          <Text style={[styles.loadingSubtext, { color: colors.textSecondary }]}>Extracting text and generating response</Text>
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
            <ImageIcon size={28} color="#9B59B6" />
            <Text style={[styles.title, { color: colors.text }]}>Screenshot Analysis</Text>
          </View>
        </View>

        {/* Sign In Prompt for Non-Authenticated Users */}
        {!user && (
          <View style={[styles.signInPromptCard, { backgroundColor: colors.cardBackground, borderColor: '#9B59B6' }]}>
            <Text style={[styles.signInPromptTitle, { color: colors.text }]}>Sign In Required</Text>
            <Text style={[styles.signInPromptText, { color: colors.textSecondary }]}>
              Please sign in to use screenshot analysis and generate AI responses
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
          <View style={[styles.usageCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.usageTitle, { color: colors.text }]}>Today's Usage</Text>
            <View style={styles.usageStats}>
              <View style={styles.usageStat}>
                <Text style={styles.usageNumber}>{usageStats.adReplies}/50</Text>
                <Text style={[styles.usageLabel, { color: colors.textSecondary }]}>Replies</Text>
              </View>
              <View style={styles.usageStat}>
                <Text style={styles.usageNumber}>{50 - usageStats.dailyReplies}</Text>
                <Text style={[styles.usageLabel, { color: colors.textSecondary }]}>Remaining</Text>
              </View>
            </View>
            {usageStats.dailyReplies >= 40 && (
              <TouchableOpacity
                style={[styles.upgradePrompt, { backgroundColor: colors.surfaceSecondary }]}
                onPress={() => router.push('/premium')}
              >
                <Text style={[styles.upgradePromptText, { color: colors.primary }]}>
                  Running low on replies? Upgrade to Premium for unlimited access!
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Premium Usage Stats */}
        {user && isPremium && (
          <View style={[styles.usageCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.usageTitle, { color: colors.text }]}>Premium Usage Today</Text>
            <View style={styles.usageStats}>
              <View style={styles.usageStat}>
                <Text style={styles.usageNumber}>{usageStats.adFreeReplies}/30</Text>
                <Text style={[styles.usageLabel, { color: colors.textSecondary }]}>Ad-free</Text>
              </View>
              <View style={styles.usageStat}>
                <Text style={styles.usageNumber}>{usageStats.adReplies}/50</Text>
                <Text style={[styles.usageLabel, { color: colors.textSecondary }]}>With ads</Text>
              </View>
            </View>
          </View>
        )}

        {/* Choose from Gallery Section - Only for authenticated users */}
        {user && (
          <View style={styles.imageSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upload Screenshot</Text>
            
            {selectedImage ? (
              <View style={styles.selectedImageContainer}>
                <View style={styles.imagePreviewHeader}>
                  <Text style={[styles.imagePreviewTitle, { color: colors.text }]}>Selected Screenshot</Text>
                  <TouchableOpacity
                    style={[styles.removeImageButton, { backgroundColor: colors.surfaceSecondary }]}
                    onPress={removeImage}
                  >
                    <X size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView 
                  style={styles.imageScrollContainer}
                  contentContainerStyle={styles.imageScrollContent}
                  showsVerticalScrollIndicator={true}
                  bounces={false}
                >
                  <Image 
                    source={{ uri: selectedImage }} 
                    style={[
                      styles.selectedImage,
                      { backgroundColor: colors.surfaceSecondary }
                    ]}
                    resizeMode="contain"
                    onError={(error) => {
                      console.error('Image load error:', error);
                      Alert.alert('Image Error', 'Failed to load the selected image. Please try another image.');
                      setSelectedImage(null);
                    }}
                  />
                </ScrollView>
                
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={[styles.changeImageButton, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
                    onPress={pickImage}
                  >
                    <Upload size={16} color={colors.text} />
                    <Text style={[styles.changeImageText, { color: colors.text }]}>Change Image</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.uploadOptions}>
                <TouchableOpacity 
                  style={[styles.uploadButton, { backgroundColor: colors.surface, borderColor: colors.border }]} 
                  onPress={pickImage}
                >
                  <Upload size={32} color="#9B59B6" />
                  <Text style={[styles.uploadButtonText, { color: colors.text }]}>Choose from Gallery</Text>
                  <Text style={[styles.uploadButtonSubtext, { color: colors.textSecondary }]}>Select a chat screenshot</Text>
                </TouchableOpacity>

                {Platform.OS !== 'web' && (
                  <TouchableOpacity 
                    style={[styles.uploadButton, { backgroundColor: colors.surface, borderColor: colors.border }]} 
                    onPress={takePhoto}
                  >
                    <Camera size={32} color="#9B59B6" />
                    <Text style={[styles.uploadButtonText, { color: colors.text }]}>Take Photo</Text>
                    <Text style={[styles.uploadButtonSubtext, { color: colors.textSecondary }]}>Capture a screenshot</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        {/* Response Type Selection - Only for authenticated users with selected image */}
        {user && selectedImage && (
          <View style={styles.responseTypeContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Response Style</Text>
            <View style={styles.responseTypeButtons}>
              {['flirty', 'witty', 'savage'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.responseTypeButton,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    responseType === type && styles.responseTypeButtonActive
                  ]}
                  onPress={() => setResponseType(type as ResponseType)}
                >
                  <Text style={[
                    styles.responseTypeText,
                    { color: colors.text },
                    responseType === type && styles.responseTypeTextActive
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Process Button - Only for authenticated users with selected image */}
        {user && selectedImage && (
          <TouchableOpacity
            style={[
              styles.processButton,
              (!selectedImage || loading) && styles.processButtonDisabled
            ]}
            onPress={handleProcessScreenshot}
            disabled={!selectedImage || loading}
          >
            <ImageIcon size={20} color="white" />
            <Text style={styles.processButtonText}>
              Get Witty Reply
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Banner Ad */}
      {(!user || !isPremium) && <BannerAd />}
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
    fontFamily: 'Poppins-Bold',
    marginLeft: 12,
  },
  signInPromptCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(155, 89, 182, 0.2)',
      },
      default: {
        shadowColor: '#9B59B6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
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
    backgroundColor: '#9B59B6',
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
  usageTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
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
    fontFamily: 'Poppins-Bold',
    color: '#9B59B6',
  },
  usageLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  upgradePrompt: {
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#9B59B6',
  },
  upgradePromptText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  imageSection: {
    marginBottom: 24,
  },
  uploadOptions: {
    gap: 16,
  },
  uploadButton: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
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
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 12,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  selectedImageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  imagePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePreviewTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  removeImageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  imageScrollContainer: {
    maxHeight: screenHeight * 0.5, // Limit to 50% of screen height
    borderRadius: 16,
    marginBottom: 16,
  },
  imageScrollContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  selectedImage: {
    width: screenWidth - 48, // Full width minus padding
    minHeight: 300,
    maxHeight: screenHeight * 0.7, // Max 70% of screen height
    borderRadius: 16,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  imageActions: {
    alignItems: 'center',
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  changeImageText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  responseTypeContainer: {
    marginBottom: 24,
  },
  responseTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  responseTypeButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  responseTypeButtonActive: {
    backgroundColor: '#9B59B6',
    borderColor: '#9B59B6',
  },
  responseTypeText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  responseTypeTextActive: {
    color: 'white',
  },
  processButton: {
    backgroundColor: '#9B59B6',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 8px rgba(155, 89, 182, 0.3)',
      },
      default: {
        shadowColor: '#9B59B6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  processButtonDisabled: {
    backgroundColor: '#A0AEC0',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowOpacity: 0.1,
      },
    }),
  },
  processButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});