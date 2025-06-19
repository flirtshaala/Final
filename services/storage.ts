import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { validateImageUri } from './imageValidation';

interface UsageStats {
  dailyReplies: number;
  adFreeReplies: number;
  adReplies: number;
  totalActions: number;
  lastResetDate: string;
}

interface UserData {
  userId: string;
  usageStats: UsageStats;
  isPremium: boolean;
  preferredLanguage: string;
}

interface ResponseHistory {
  id: string;
  response: string;
  originalText: string;
  responseType: string;
  language: string;
  timestamp: number;
  imageUri?: string;
}

class StorageService {
  private readonly USER_DATA_KEY = 'flirtshaala_user_data';
  private readonly RESPONSE_HISTORY_KEY = 'flirtshaala_response_history';

  private async getStorage(): Promise<Storage | typeof AsyncStorage> {
    if (Platform.OS === 'web') {
      return localStorage;
    }
    return AsyncStorage;
  }

  private async setItem(key: string, value: string): Promise<void> {
    const storage = await this.getStorage();
    if (Platform.OS === 'web') {
      (storage as Storage).setItem(key, value);
    } else {
      await (storage as typeof AsyncStorage).setItem(key, value);
    }
  }

  private async getItem(key: string): Promise<string | null> {
    const storage = await this.getStorage();
    if (Platform.OS === 'web') {
      return (storage as Storage).getItem(key);
    } else {
      return await (storage as typeof AsyncStorage).getItem(key);
    }
  }

  private shouldResetUsage(lastResetDate: string): boolean {
    const today = new Date();
    const lastReset = new Date(lastResetDate);
    
    // Reset if it's a new day (after midnight)
    return today.toDateString() !== lastReset.toDateString();
  }

  async getUserData(): Promise<UserData> {
    try {
      const userData = await this.getItem(this.USER_DATA_KEY);
      
      if (userData) {
        const parsed = JSON.parse(userData);
        
        // Migrate old data structure if needed
        if (!parsed.usageStats.adReplies) {
          parsed.usageStats.adReplies = 0;
        }
        if (!parsed.preferredLanguage) {
          parsed.preferredLanguage = 'auto';
        }
        
        // Check if we need to reset daily usage
        if (this.shouldResetUsage(parsed.usageStats.lastResetDate)) {
          parsed.usageStats = {
            dailyReplies: 0,
            adFreeReplies: 0,
            adReplies: 0,
            totalActions: 0,
            lastResetDate: new Date().toDateString(),
          };
          await this.saveUserData(parsed);
        }
        
        return parsed;
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }

    // Create new user data if none exists
    const newUserData: UserData = {
      userId: uuidv4(),
      usageStats: {
        dailyReplies: 0,
        adFreeReplies: 0,
        adReplies: 0,
        totalActions: 0,
        lastResetDate: new Date().toDateString(),
      },
      isPremium: false,
      preferredLanguage: 'auto',
    };

    await this.saveUserData(newUserData);
    return newUserData;
  }

  async saveUserData(userData: UserData): Promise<void> {
    try {
      await this.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  async updateUsageStats(type: 'reply' | 'action', watchedAd: boolean = false): Promise<UsageStats> {
    const userData = await this.getUserData();
    
    if (type === 'reply') {
      userData.usageStats.dailyReplies += 1;
      
      if (userData.isPremium) {
        // Premium users: 30 ad-free + 50 with ads
        if (userData.usageStats.adFreeReplies < 30) {
          userData.usageStats.adFreeReplies += 1;
        } else if (watchedAd) {
          userData.usageStats.adReplies += 1;
        }
      } else {
        // Free users: only replies after watching ads
        if (watchedAd) {
          userData.usageStats.adReplies += 1;
        }
      }
    }
    userData.usageStats.totalActions += 1;

    await this.saveUserData(userData);
    return userData.usageStats;
  }

  async updateLanguagePreference(language: string): Promise<void> {
    const userData = await this.getUserData();
    userData.preferredLanguage = language;
    await this.saveUserData(userData);
  }

  async resetDailyUsage(): Promise<void> {
    const userData = await this.getUserData();
    userData.usageStats = {
      dailyReplies: 0,
      adFreeReplies: 0,
      adReplies: 0,
      totalActions: 0,
      lastResetDate: new Date().toDateString(),
    };
    await this.saveUserData(userData);
  }

  canUseService(usageStats: UsageStats, isPremium: boolean): { canUse: boolean; needsAd: boolean; reason?: string } {
    if (isPremium) {
      const totalAllowed = 80; // 30 ad-free + 50 with ads
      if (usageStats.dailyReplies >= totalAllowed) {
        return { 
          canUse: false, 
          needsAd: false, 
          reason: 'Daily limit reached (80/80). Try again tomorrow!' 
        };
      }
      
      if (usageStats.adFreeReplies >= 30) {
        return { canUse: true, needsAd: true };
      }
      
      return { canUse: true, needsAd: false };
    }

    // Free tier: 50 replies total, all require ads
    if (usageStats.dailyReplies >= 50) {
      return { 
        canUse: false, 
        needsAd: false, 
        reason: 'Daily limit reached (50/50). Upgrade to Premium for more replies!' 
      };
    }

    return { canUse: true, needsAd: true };
  }

  // Response History Methods
  async getResponseHistory(): Promise<ResponseHistory[]> {
    try {
      const historyData = await this.getItem(this.RESPONSE_HISTORY_KEY);
      if (historyData) {
        const history = JSON.parse(historyData);
        
        // Validate image URIs in history and filter out invalid ones
        const validHistory = history.filter((item: ResponseHistory) => {
          if (item.imageUri) {
            const validation = validateImageUri(item.imageUri);
            if (!validation.isValid) {
              console.warn(`Invalid image URI in history item ${item.id}:`, validation.error);
              return false;
            }
          }
          return true;
        });
        
        // Sort by timestamp, newest first
        return validHistory.sort((a: ResponseHistory, b: ResponseHistory) => b.timestamp - a.timestamp);
      }
    } catch (error) {
      console.error('Error loading response history:', error);
    }
    return [];
  }

  async saveResponseToHistory(response: ResponseHistory): Promise<void> {
    try {
      // Validate image URI if present
      if (response.imageUri) {
        const validation = validateImageUri(response.imageUri);
        if (!validation.isValid) {
          console.warn('Invalid image URI, saving response without image:', validation.error);
          response.imageUri = undefined;
        }
      }
      
      const currentHistory = await this.getResponseHistory();
      
      // Add new response to the beginning
      const updatedHistory = [response, ...currentHistory];
      
      // Keep only the last 50 responses to prevent storage bloat
      const trimmedHistory = updatedHistory.slice(0, 50);
      
      await this.setItem(this.RESPONSE_HISTORY_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Error saving response to history:', error);
    }
  }

  async clearResponseHistory(): Promise<void> {
    try {
      await this.setItem(this.RESPONSE_HISTORY_KEY, JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing response history:', error);
    }
  }
}

export const storageService = new StorageService();