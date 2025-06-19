import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { apiService } from '@/services/api';
import { adService } from '@/services/ads';
import LoadingSpinner from '@/components/LoadingSpinner';
import BannerAd from '@/components/BannerAd';

export default function CameraTab() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [responseType, setResponseType] = useState<'flirty' | 'witty' | 'savage'>('flirty');
  const [loading, setLoading] = useState(false);

  const { user } = useAuthStore();
  const { addResponse } = useAppStore();

  const responseTypes = [
    { key: 'flirty', label: 'Flirty', color: '#FF6B7A' },
    { key: 'witty', label: 'Witty', color: '#8B5CF6' },
    { key: 'savage', label: 'Savage', color: '#EF4444' },
  ] as const;

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

  const processImage = async (uri: string) => {
    try {
      if (Platform.OS === 'web') {
        // For web, return the URI as is
        return uri;
      }
      
      // Resize and compress image for mobile
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      
      return manipulatedImage.base64;
    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error('Failed to process image');
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.Images],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
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

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleProcessImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first!');
      return;
    }

    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to process images.');
      return;
    }

    setLoading(true);
    try {
      // Show rewarded ad first
      const adWatched = await adService.showRewardedAd();
      if (!adWatched) {
        Alert.alert('Ad Required', 'Please watch the ad to process the image.');
        return;
      }

      const base64Image = await processImage(selectedImage);
      const result = await apiService.processImage(base64Image!, responseType);
      
      const newResponse = {
        id: Date.now().toString(),
        originalText: result.extractedText,
        response: result.response,
        type: responseType,
        timestamp: Date.now(),
        imageUri: selectedImage,
      };

      addResponse(newResponse);
      setSelectedImage(null);
      Alert.alert('Success', 'Image processed! Check the Results tab.');
    } catch (error) {
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <Camera size={64} color="#FF6B7A" />
          <Text style={styles.authTitle}>Screenshot Analysis</Text>
          <Text style={styles.authSubtitle}>
            Sign in to upload chat screenshots and get AI-powered responses
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Camera size={32} color="#FF6B7A" />
          <Text style={styles.title}>Screenshot Analysis</Text>
        </View>

        {/* Image Selection */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Upload Screenshot</Text>
          
          {selectedImage ? (
            <View style={styles.selectedImageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.removeImageText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadOptions}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Upload size={32} color="#8B5CF6" />
                <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
              
              {Platform.OS !== 'web' && (
                <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                  <Camera size={32} color="#8B5CF6" />
                  <Text style={styles.uploadButtonText}>Take Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Response Type Selection */}
        {selectedImage && (
          <View style={styles.typeSection}>
            <Text style={styles.sectionTitle}>Response Style</Text>
            <View style={styles.typeButtons}>
              {responseTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeButton,
                    responseType === type.key && { backgroundColor: type.color },
                  ]}
                  onPress={() => setResponseType(type.key)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
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

        {/* Process Button */}
        {selectedImage && (
          <TouchableOpacity
            style={[styles.processButton, loading && styles.processButtonDisabled]}
            onPress={handleProcessImage}
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <ImageIcon size={20} color="white" />
                <Text style={styles.processButtonText}>Process Screenshot</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        <BannerAd />
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
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 12,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  imageSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  uploadOptions: {
    gap: 16,
  },
  uploadButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
  },
  selectedImageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeImageButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  removeImageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  typeSection: {
    marginBottom: 24,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  processButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  processButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  processButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});