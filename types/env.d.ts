declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      EXPO_PUBLIC_API_BASE_URL: string;
      EXPO_PUBLIC_ADMOB_ANDROID_APP_ID: string;
      EXPO_PUBLIC_ADMOB_IOS_APP_ID: string;
      EXPO_PUBLIC_ADMOB_BANNER_ANDROID: string;
      EXPO_PUBLIC_ADMOB_BANNER_IOS: string;
      EXPO_PUBLIC_ADMOB_REWARDED_ANDROID: string;
      EXPO_PUBLIC_ADMOB_REWARDED_IOS: string;
    }
  }
}

export {};