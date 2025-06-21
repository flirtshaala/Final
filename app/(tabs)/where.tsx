import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { Heart, Copy, Share2, Clock } from 'lucide-react-native';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import * as Clipboard from 'expo-clipboard';
import BannerAd from '@/components/BannerAd';

export default function ResultsTab() {
  const { responses } = useAppStore();
  const { user } = useAuthStore();

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied!', 'Response copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const shareResponse = async (response: string) => {
    try {
      await Share.share({
        message: `Check out this witty response from Flirtshaala:\n\n"${response}"\n\nGet the app to craft your own perfect replies!`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share response');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flirty':
        return '#FF6B7A';
      case 'witty':
        return '#8B5CF6';
      case 'savage':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <Heart size={64} color="#FF6B7A" />
          <Text style={styles.authTitle}>Your Results</Text>
          <Text style={styles.authSubtitle}>
            Sign in to save and view your generated responses
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (responses.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Heart size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Responses Yet</Text>
          <Text style={styles.emptySubtitle}>
            Generate your first response from the Chat or Screenshot tab
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
          <Heart size={32} color="#FF6B7A" />
          <Text style={styles.title}>Your Results</Text>
        </View>

        {/* Responses List */}
        {responses.map((response) => (
          <View key={response.id} style={styles.responseCard}>
            {/* Response Type Badge */}
            <View style={styles.responseHeader}>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: getTypeColor(response.type) },
                ]}
              >
                <Text style={styles.typeBadgeText}>{response.type}</Text>
              </View>
              <View style={styles.timestampContainer}>
                <Clock size={14} color="#9CA3AF" />
                <Text style={styles.timestamp}>
                  {formatTimestamp(response.timestamp)}
                </Text>
              </View>
            </View>

            {/* Original Text */}
            <View style={styles.originalSection}>
              <Text style={styles.originalLabel}>Original:</Text>
              <Text style={styles.originalText}>{response.originalText}</Text>
            </View>

            {/* Generated Response */}
            <View style={styles.generatedSection}>
              <Text style={styles.generatedLabel}>Generated Response:</Text>
              <Text style={styles.generatedText}>{response.response}</Text>
            </View>

            {/* Image if available */}
            {response.imageUri && (
              <Image source={{ uri: response.imageUri }} style={styles.responseImage} />
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => copyToClipboard(response.response)}
              >
                <Copy size={16} color="#6B7280" />
                <Text style={styles.actionButtonText}>Copy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => shareResponse(response.response)}
              >
                <Share2 size={16} color="#6B7280" />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  responseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  originalSection: {
    marginBottom: 16,
  },
  originalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  originalText: {
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    lineHeight: 20,
  },
  generatedSection: {
    marginBottom: 16,
  },
  generatedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  generatedText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    fontWeight: '500',
  },
  responseImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});