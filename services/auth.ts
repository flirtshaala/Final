import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Configure WebBrowser for OAuth
if (Platform.OS !== 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' ? undefined : require('@react-native-async-storage/async-storage').default,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

// Google OAuth Configuration
const redirectUri = Platform.OS === 'web' 
  ? `${window?.location?.origin || 'http://localhost:8081'}/auth/callback`
  : AuthSession.makeRedirectUri({
      scheme: 'flirtshaala',
      path: 'auth/callback',
    });

export class AuthService {
  // Sign in with Google
  static async signInWithGoogle() {
    try {
      if (Platform.OS === 'web') {
        // Web OAuth flow
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;
        return data;
      } else {
        // Mobile OAuth flow
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUri,
            skipBrowserRedirect: true,
          },
        });

        if (error) throw error;

        // Open browser for OAuth
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri
        );

        if (result.type === 'success') {
          const url = result.url;
          const parsedUrl = Linking.parse(url);
          
          // Extract tokens from URL
          const accessToken = parsedUrl.queryParams?.access_token as string;
          const refreshToken = parsedUrl.queryParams?.refresh_token as string;

          if (accessToken) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) throw sessionError;
            return sessionData;
          }
        }

        throw new Error('OAuth flow was cancelled or failed');
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
  }

  // Sign in with email and password
  static async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  // Sign up with email and password
  static async signUpWithEmail(email: string, password: string, userData?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) throw error;
    return data;
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Get current session
  static async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  // Get current user
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  // Reset password
  static async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Platform.OS === 'web' 
        ? `${window.location.origin}/auth/reset-password`
        : 'flirtshaala://auth/reset-password',
    });

    if (error) throw error;
    return data;
  }

  // Update user profile
  static async updateProfile(updates: any) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) throw error;
    return data;
  }
}