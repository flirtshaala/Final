import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/services/auth';

interface UsageStats {
  dailyReplies: number;
  adFreeReplies: number;
  adReplies: number;
  totalActions: number;
  lastResetDate: string;
}

interface UserContextType {
  userId: string | null;
  loading: boolean;
  isPremium: boolean;
  usageStats: UsageStats;
  updateUsageStats: (type: 'reply' | 'action', watchedAd?: boolean) => Promise<void>;
  resetDailyUsage: () => Promise<void>;
  canUseService: () => { canUse: boolean; needsAd: boolean; reason?: string };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    dailyReplies: 0,
    adFreeReplies: 0,
    adReplies: 0,
    totalActions: 0,
    lastResetDate: new Date().toDateString(),
  });

  const isPremium = userProfile?.plan_type === 'premium';
  const userId = user?.id || null;

  useEffect(() => {
    if (user) {
      loadUsageStats();
    } else {
      // Reset stats for non-authenticated users
      setUsageStats({
        dailyReplies: 0,
        adFreeReplies: 0,
        adReplies: 0,
        totalActions: 0,
        lastResetDate: new Date().toDateString(),
      });
    }
  }, [user]);

  const loadUsageStats = async () => {
    if (!user) return;
    
    try {
      // For authenticated users, we can track usage in the database
      // For now, we'll use the usage_count from the user profile
      const today = new Date().toDateString();
      
      setUsageStats({
        dailyReplies: userProfile?.usage_count || 0,
        adFreeReplies: isPremium ? Math.min(userProfile?.usage_count || 0, 30) : 0,
        adReplies: Math.max((userProfile?.usage_count || 0) - (isPremium ? 30 : 0), 0),
        totalActions: userProfile?.usage_count || 0,
        lastResetDate: today,
      });
    } catch (error) {
      console.error('Error loading usage stats:', error);
    }
  };

  const updateUsageStats = async (type: 'reply' | 'action', watchedAd: boolean = false) => {
    if (!user) return;
    
    try {
      if (type === 'reply') {
        // Increment usage count in database
        const { error } = await supabase
          .from('users')
          .update({ 
            usage_count: supabase.sql`usage_count + 1`,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;
        
        // Update local stats
        setUsageStats(prev => ({
          ...prev,
          dailyReplies: prev.dailyReplies + 1,
          adFreeReplies: isPremium && prev.adFreeReplies < 30 ? prev.adFreeReplies + 1 : prev.adFreeReplies,
          adReplies: watchedAd ? prev.adReplies + 1 : prev.adReplies,
          totalActions: prev.totalActions + 1,
        }));
      }
    } catch (error) {
      console.error('Error updating usage stats:', error);
    }
  };

  const resetDailyUsage = async () => {
    setUsageStats({
      dailyReplies: 0,
      adFreeReplies: 0,
      adReplies: 0,
      totalActions: 0,
      lastResetDate: new Date().toDateString(),
    });
  };

  const canUseService = () => {
    if (!user) {
      return { 
        canUse: false, 
        needsAd: false, 
        reason: 'Please sign in to use FlirtShaala' 
      };
    }

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
  };

  return (
    <UserContext.Provider value={{
      userId,
      loading,
      isPremium,
      usageStats,
      updateUsageStats,
      resetDailyUsage,
      canUseService,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}