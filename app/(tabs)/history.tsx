import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share, Image, ScrollView, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedGradientBackground } from '@/components/ThemedGradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import BannerAd from '@/components/BannerAd';
import { Copy, RefreshCw, Share2, ArrowLeft, Heart, Clock, Trash2, MoreHorizontal } from 'lucide-react-native';
import { openaiService, ResponseType } from '@/services/openai';
import { apiService } from '@/services/api';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { storageService } from '@/services/storage';
import { responseHistoryService, ResponseHistory } from '@/services/supabase';
import * as Clipboard from 'expo-clipboard';

interface LocalResponseHistory {
  id: string;
  response: string;
  originalText: string;
  responseType: ResponseType;
  timestamp: number;
  imageUri?: string;
}

export default function HistoryTab() {
  const params = useLocalSearchParams();
  const [response, setResponse] = useState(params.response as string || '');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState<(ResponseHistory | LocalResponseHistory)[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const originalText = params.originalText as string || '';
  const responseType = params.responseType as ResponseType || 'flirty';
  const imageUri = params.imageUri as string;
  
  const { isPremium } = useUser();
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    loadHistory();
    
    // Save current response to history if it exists
    if (response && originalText) {
      saveToHistory();
    }
  }, [response, originalText, user]);

  const loadHistory = async (page: number = 0, append: boolean = false) => {
    if (page === 0) {
      setHistoryLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let combinedHistory: (ResponseHistory | LocalResponseHistory)[] = [];

      if (user) {
        // Load from Supabase for authenticated users
        const dbHistory = await responseHistoryService.getUserHistory(user.id, page, ITEMS_PER_PAGE);
        
        // Convert database format to local format for consistency
        const convertedHistory = dbHistory.map(item => ({
          id: item.id,
          response: item.response,
          originalText: item.original_text,
          responseType: item.response_type as ResponseType,
          timestamp: new Date(item.created_at).getTime(),
          imageUri: item.image_uri,
        }));

        combinedHistory = convertedHistory;
        setHasMoreHistory(dbHistory.length === ITEMS_PER_PAGE);
      } else {
        // Load from local storage for guest users
        if (page === 0) {
          const localHistory = await storageService.getResponseHistory();
          combinedHistory = localHistory;
          setHasMoreHistory(false); // Local storage doesn't have pagination
        }
      }

      if (append && page > 0) {
        setHistory(prev => [...prev, ...combinedHistory]);
      } else {
        setHistory(combinedHistory);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Failed to load response history');
    } finally {
      setHistoryLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const loadMoreHistory = async () => {
    if (!hasMoreHistory || loadingMore) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await loadHistory(nextPage, true);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setCurrentPage(0);
    await loadHistory(0, false);
  }, [user]);

  const saveToHistory = async () => {
    if (!response || !originalText) return;
    
    try {
      if (user) {
        // Save to Supabase for authenticated users
        await responseHistoryService.saveResponse(user.id, {
          response,
          originalText,
          responseType,
          imageUri,
        });
      } else {
        // Save to local storage for guest users
        const newEntry: LocalResponseHistory = {
          id: Date.now().toString(),
          response,
          originalText,
          responseType,
          timestamp: Date.now(),
          imageUri,
        };
        
        console.log('Saving response to local history:', newEntry);
        await storageService.saveResponseToHistory(newEntry);
      }
      
      // Refresh history to show the new entry
      await loadHistory(0, false);
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const regenerateResponse = async () => {
    if (!originalText) {
      Alert.alert('Error', 'No original text found to regenerate response');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Regenerating response for:', { originalText, responseType });
      
      // Try backend API first, fallback to OpenAI service
      let newResponse: string;
      
      try {
        // Call backend API
        const backendResponse = await apiService.generateResponse({
          chatText: originalText.trim(),
          responseType
        });
        newResponse = backendResponse.response;
        console.log('Backend regeneration response received:', newResponse);
      } catch (backendError) {
        console.warn('Backend API failed during regeneration, falling back to OpenAI service:', backendError);
        
        // Fallback to direct OpenAI service
        newResponse = await openaiService.generateFlirtyResponse(originalText.trim(), responseType);
        console.log('OpenAI service regeneration response received:', newResponse);
      }
      
      if (!newResponse || newResponse.trim() === '') {
        throw new Error('Empty response received during regeneration');
      }
      
      setResponse(newResponse.trim());
      await saveToHistory();
      
      // Update URL params to reflect new response
      router.setParams({
        response: newResponse.trim(),
        originalText,
        responseType,
        imageUri: imageUri || '',
      });
    } catch (error: any) {
      console.error('Regenerate response error:', error);
      Alert.alert(
        'Regeneration Failed', 
        error.message || 'Failed to regenerate response',
        [
          { text: 'Try Again', onPress: () => regenerateResponse() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(response);
      Alert.alert('Copied!', 'Response copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const shareResponse = async () => {
    try {
      await Share.share({
        message: `Check out this witty response from FlirtShaala:\n\n"${response}"\n\nGet the app to craft your own perfect replies!`,
        title: 'FlirtShaala Response'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share response');
    }
  };

  const loadHistoryItem = (item: ResponseHistory | LocalResponseHistory) => {
    console.log('Loading history item:', item);
    setResponse(item.response);
    router.setParams({
      response: item.response,
      originalText: item.originalText,
      responseType: item.responseType,
      imageUri: item.imageUri || '',
    });
  };

  const deleteHistoryItem = async (item: ResponseHistory | LocalResponseHistory) => {
    Alert.alert(
      'Delete Response',
      'Are you sure you want to delete this response from your history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (user && 'created_at' in item) {
                // Delete from Supabase
                await responseHistoryService.deleteResponse(user.id, item.id);
              } else {
                // Delete from local storage (would need implementation in storageService)
                console.log('Local deletion not implemented yet');
              }
              
              // Remove from local state
              setHistory(prev => prev.filter(h => h.id !== item.id));
            } catch (error) {
              console.error('Error deleting history item:', error);
              Alert.alert('Error', 'Failed to delete response');
            }
          }
        }
      ]
    );
  };

  const formatTimestamp = (timestamp: number | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
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

  const isResponseHistory = (item: ResponseHistory | LocalResponseHistory): item is ResponseHistory => {
    return 'created_at' in item;
  };

  // Show loading animation when regenerating response
  if (loading) {
    return (
      <ThemedGradientBackground>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Regenerating your response...</Text>
          <Text style={[styles.loadingSubtext, { color: colors.textSecondary }]}>AI is crafting something even better...</Text>
        </View>
      </ThemedGradientBackground>
    );
  }

  if (!response && history.length === 0 && !historyLoading) {
    return (
      <ThemedGradientBackground style={styles.container}>
        <View style={styles.emptyState}>
          <Clock size={64} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No History Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Generate responses from the Chat or Screenshot tab to see them here
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.backButtonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ThemedGradientBackground>
    );
  }

  return (
    <ThemedGradientBackground style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            loadMoreHistory();
          }
        }}
        scrollEventThrottle={400}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Clock size={24} color="#FF6B7A" />
            <Text style={[styles.title, { color: colors.text }]}>Response History</Text>
          </View>
        </View>

        {/* Current Response */}
        {response && (
          <>
            {/* Original Content */}
            {imageUri && (
              <View style={styles.originalImageContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Original Screenshot</Text>
                <Image source={{ uri: imageUri }} style={styles.originalImage} />
              </View>
            )}

            {originalText && (
              <View style={styles.originalTextContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Original Chat</Text>
                <View style={[styles.originalTextCard, { backgroundColor: colors.cardBackground }]}>
                  <Text style={[styles.originalText, { color: colors.textSecondary }]}>{originalText}</Text>
                </View>
              </View>
            )}

            {/* Generated Response */}
            <View style={styles.responseContainer}>
              <View style={styles.responseHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {responseType.charAt(0).toUpperCase() + responseType.slice(1)} Response
                </Text>
                <View style={styles.responseTypeIndicator}>
                  <Text style={[styles.responseTypeText]}>{responseType}</Text>
                </View>
              </View>

              <View style={[styles.responseCard, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.responseText, { color: colors.text }]}>{response}</Text>
                <View style={styles.languageIndicator}>
                  <Text style={[styles.languageText, { color: colors.textSecondary }]}>
                    Style matched automatically by AI
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.cardBackground }]}
                onPress={copyToClipboard}
              >
                <Copy size={20} color="#FF6B7A" />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.cardBackground }]}
                onPress={shareResponse}
              >
                <Share2 size={20} color="#9B59B6" />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.regenerateButton]}
                onPress={regenerateResponse}
                disabled={loading}
              >
                <RefreshCw size={20} color="white" />
                <Text style={[styles.actionButtonText, { color: 'white' }]}>
                  Regenerate
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Response History */}
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Clock size={20} color={colors.textSecondary} />
            <Text style={[styles.historyTitle, { color: colors.text }]}>
              {user ? 'Your Response History' : 'Recent Responses'}
            </Text>
          </View>

          {historyLoading ? (
            <View style={styles.historyLoadingContainer}>
              <LoadingSpinner />
              <Text style={[styles.historyLoadingText, { color: colors.textSecondary }]}>
                Loading your history...
              </Text>
            </View>
          ) : history.length > 0 ? (
            <>
              {history.map((item) => (
                <View key={item.id} style={[styles.historyItem, { backgroundColor: colors.cardBackground }]}>
                  <TouchableOpacity
                    style={styles.historyContent}
                    onPress={() => loadHistoryItem(item)}
                  >
                    <View style={styles.historyTextContent}>
                      <Text style={[styles.historyResponse, { color: colors.text }]} numberOfLines={2}>
                        {item.response}
                      </Text>
                      <View style={styles.historyMeta}>
                        <Text style={[styles.historyType]}>{item.responseType}</Text>
                        <Text style={[styles.historyTime, { color: colors.textSecondary }]}>
                          {formatTimestamp(isResponseHistory(item) ? item.created_at : item.timestamp)}
                        </Text>
                      </View>
                    </View>
                    {item.imageUri && (
                      <Image source={{ uri: item.imageUri }} style={styles.historyThumbnail} />
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: colors.surfaceSecondary }]}
                    onPress={() => deleteHistoryItem(item)}
                  >
                    <Trash2 size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Load More Button */}
              {hasMoreHistory && (
                <TouchableOpacity
                  style={[styles.loadMoreButton, { backgroundColor: colors.cardBackground }]}
                  onPress={loadMoreHistory}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <MoreHorizontal size={20} color={colors.textSecondary} />
                  )}
                  <Text style={[styles.loadMoreText, { color: colors.textSecondary }]}>
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.emptyHistoryContainer}>
              <Clock size={48} color={colors.border} />
              <Text style={[styles.emptyHistoryTitle, { color: colors.text }]}>
                No History Yet
              </Text>
              <Text style={[styles.emptyHistoryText, { color: colors.textSecondary }]}>
                Your generated responses will appear here
              </Text>
            </View>
          )}
        </View>

        {/* New Response Button */}
        <TouchableOpacity
          style={styles.newResponseButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={[styles.newResponseButtonText]}>Create New Response</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Banner Ad */}
      {!isPremium && <BannerAd />}
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
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'ProximaNova-Bold',
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'ProximaNova-Bold',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'ProximaNova-Regular',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'ProximaNova-SemiBold',
  },
  originalImageContainer: {
    marginBottom: 24,
  },
  originalImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  originalTextContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'ProximaNova-SemiBold',
    marginBottom: 12,
  },
  originalTextCard: {
    borderRadius: 16,
    padding: 16,
  },
  originalText: {
    fontSize: 14,
    fontFamily: 'ProximaNova-Regular',
    lineHeight: 20,
  },
  responseContainer: {
    marginBottom: 32,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  responseTypeIndicator: {
    backgroundColor: '#FF6B7A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  responseTypeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'ProximaNova-SemiBold',
    textTransform: 'capitalize',
  },
  responseCard: {
    borderRadius: 20,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B7A',
  },
  responseText: {
    fontSize: 18,
    fontFamily: 'ProximaNova-Regular',
    lineHeight: 28,
    marginBottom: 12,
  },
  languageIndicator: {
    alignSelf: 'flex-end',
  },
  languageText: {
    fontSize: 12,
    fontFamily: 'ProximaNova-Regular',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  regenerateButton: {
    backgroundColor: '#FF6B7A',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'ProximaNova-SemiBold',
    marginLeft: 6,
  },
  historyContainer: {
    marginBottom: 24,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontFamily: 'ProximaNova-SemiBold',
    marginLeft: 8,
  },
  historyLoadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  historyLoadingText: {
    fontSize: 16,
    fontFamily: 'ProximaNova-Regular',
    marginTop: 16,
  },
  historyItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTextContent: {
    flex: 1,
    marginRight: 12,
  },
  historyResponse: {
    fontSize: 14,
    fontFamily: 'ProximaNova-Regular',
    marginBottom: 8,
  },
  historyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyType: {
    fontSize: 12,
    fontFamily: 'ProximaNova-SemiBold',
    color: '#FF6B7A',
    textTransform: 'capitalize',
  },
  historyTime: {
    fontSize: 12,
    fontFamily: 'ProximaNova-Regular',
  },
  historyThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    resizeMode: 'cover',
    marginRight: 12,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontFamily: 'ProximaNova-Regular',
    marginLeft: 8,
  },
  emptyHistoryContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyHistoryTitle: {
    fontSize: 18,
    fontFamily: 'ProximaNova-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyHistoryText: {
    fontSize: 14,
    fontFamily: 'ProximaNova-Regular',
    textAlign: 'center',
  },
  newResponseButton: {
    backgroundColor: '#9B59B6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  newResponseButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'ProximaNova-SemiBold',
  },
  bottomSpacing: {
    height: 100,
  },
});