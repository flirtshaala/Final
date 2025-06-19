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
} from 'react-native';
import { MessageCircle, Send, Sparkles } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { apiService } from '@/services/api';
import { adService } from '@/services/ads';
import LoadingSpinner from '@/components/LoadingSpinner';
import BannerAd from '@/components/BannerAd';

export default function ChatTab() {
  const [message, setMessage] = useState('');
  const [responseType, setResponseType] = useState<'flirty' | 'witty' | 'savage'>('flirty');
  const [loading, setLoading] = useState(false);
  const [pickupLine, setPickupLine] = useState('');
  const [pickupLoading, setPickupLoading] = useState(false);

  const { user } = useAuthStore();
  const { addResponse } = useAppStore();

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

    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to generate responses.');
      return;
    }

    setLoading(true);
    try {
      // Show rewarded ad first
      const adWatched = await adService.showRewardedAd();
      if (!adWatched) {
        Alert.alert('Ad Required', 'Please watch the ad to generate a response.');
        return;
      }

      const result = await apiService.generateResponse(message.trim(), responseType);
      
      const newResponse = {
        id: Date.now().toString(),
        originalText: message.trim(),
        response: result.response,
        type: responseType,
        timestamp: Date.now(),
      };

      addResponse(newResponse);
      setMessage('');
      Alert.alert('Success', 'Response generated! Check the Results tab.');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate response. Please try again.');
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
      Alert.alert('Error', 'Failed to get pickup line. Please try again.');
    } finally {
      setPickupLoading(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <MessageCircle size={64} color="#FF6B7A" />
          <Text style={styles.authTitle}>Welcome to Flirtshaala</Text>
          <Text style={styles.authSubtitle}>
            Sign in to start generating witty responses for your chats
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
          <MessageCircle size={32} color="#FF6B7A" />
          <Text style={styles.title}>Chat Response Generator</Text>
        </View>

        {/* Pickup Line Section */}
        <View style={styles.pickupSection}>
          <View style={styles.pickupHeader}>
            <Sparkles size={20} color="#8B5CF6" />
            <Text style={styles.pickupTitle}>Break the Ice</Text>
          </View>
          
          {pickupLine ? (
            <View style={styles.pickupResult}>
              <Text style={styles.pickupText}>{pickupLine}</Text>
              <TouchableOpacity
                style={styles.newPickupButton}
                onPress={handleGetPickupLine}
                disabled={pickupLoading}
              >
                <Text style={styles.newPickupText}>Get Another</Text>
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
                  <Text style={styles.pickupButtonText}>Get Pickup Line</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Response Type Selection */}
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

        {/* Message Input */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Your Message</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Paste the message you want to respond to..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Generate Button */}
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
              <Text style={styles.generateButtonText}>Generate Response</Text>
            </>
          )}
        </TouchableOpacity>

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
  pickupSection: {
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
  pickupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
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
    fontWeight: '600',
    marginLeft: 8,
  },
  pickupResult: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
  },
  pickupText: {
    fontSize: 16,
    color: '#1F2937',
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
    fontWeight: '600',
  },
  typeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
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
  inputSection: {
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    fontWeight: '600',
    marginLeft: 8,
  },
});