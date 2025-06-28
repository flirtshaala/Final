import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface ResponseHistory {
  id: string;
  user_id: string;
  response: string;
  original_text: string;
  response_type: 'flirty' | 'witty' | 'savage';
  image_uri?: string;
  created_at: string;
}

export class ResponseHistoryService {
  async saveResponse(userId: string, data: {
    response: string;
    originalText: string;
    responseType: 'flirty' | 'witty' | 'savage';
    imageUri?: string;
  }): Promise<ResponseHistory | null> {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase not configured, skipping save');
        return null;
      }

      const { data: result, error } = await supabase
        .from('response_history')
        .insert({
          user_id: userId,
          response: data.response,
          original_text: data.originalText,
          response_type: data.responseType,
          image_uri: data.imageUri,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving response:', error);
        return null;
      }

      return result;
    } catch (error) {
      console.error('Error saving response:', error);
      return null;
    }
  }

  async getUserHistory(userId: string, page: number = 0, limit: number = 20): Promise<ResponseHistory[]> {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase not configured, returning empty history');
        return [];
      }

      const { data, error } = await supabase
        .from('response_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

      if (error) {
        console.error('Error fetching history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  }

  async deleteResponse(userId: string, responseId: string): Promise<boolean> {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase not configured, skipping delete');
        return false;
      }

      const { error } = await supabase
        .from('response_history')
        .delete()
        .eq('id', responseId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting response:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting response:', error);
      return false;
    }
  }
}

export const responseHistoryService = new ResponseHistoryService();