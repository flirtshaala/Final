interface GoogleAuthResult {
  success: boolean;
  session?: any;
  error?: string;
}

interface AuthMessage {
  type: 'auth_success' | 'auth_error' | 'auth_cancelled';
  session?: any;
  error?: string;
}

class GoogleAuthService {
  private popupWindow: Window | null = null;
  private messageListener: ((event: MessageEvent) => void) | null = null;

  async signInWithGooglePopup(): Promise<GoogleAuthResult> {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Google Sign-In is only available on web' };
    }

    try {
      // Import Supabase client
      const { supabase } = await import('@/services/supabase');

      // Get the OAuth URL from Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/google-callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error('Failed to get OAuth URL:', error);
        return { success: false, error: error.message };
      }

      if (!data.url) {
        return { success: false, error: 'Failed to generate authentication URL' };
      }

      // Open popup window
      const popup = this.openPopup(data.url);
      if (!popup) {
        return { success: false, error: 'Popup was blocked. Please allow popups for this site.' };
      }

      this.popupWindow = popup;

      // Wait for authentication result
      const result = await this.waitForAuthResult();
      
      // Clean up
      this.cleanup();

      return result;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      this.cleanup();
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  }

  private openPopup(url: string): Window | null {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      url,
      'google-auth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    return popup;
  }

  private waitForAuthResult(): Promise<GoogleAuthResult> {
    return new Promise((resolve) => {
      let resolved = false;

      // Set up message listener
      this.messageListener = (event: MessageEvent<AuthMessage>) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) {
          console.warn('Received message from untrusted origin:', event.origin);
          return;
        }

        if (resolved) return;
        resolved = true;

        const { type, session, error } = event.data;

        switch (type) {
          case 'auth_success':
            resolve({ success: true, session });
            break;
          case 'auth_error':
            resolve({ success: false, error: error || 'Authentication failed' });
            break;
          case 'auth_cancelled':
            resolve({ success: false, error: 'Authentication was cancelled' });
            break;
          default:
            // Ignore other message types
            resolved = false;
        }
      };

      window.addEventListener('message', this.messageListener);

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (this.popupWindow?.closed) {
          clearInterval(checkClosed);
          if (!resolved) {
            resolved = true;
            resolve({ success: false, error: 'Authentication was cancelled' });
          }
        }
      }, 1000);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkClosed);
        if (!resolved) {
          resolved = true;
          resolve({ success: false, error: 'Authentication timed out' });
        }
      }, 300000);
    });
  }

  private cleanup() {
    if (this.popupWindow && !this.popupWindow.closed) {
      this.popupWindow.close();
    }
    this.popupWindow = null;

    if (this.messageListener) {
      window.removeEventListener('message', this.messageListener);
      this.messageListener = null;
    }
  }

  // Method to cancel ongoing authentication
  cancelAuthentication() {
    this.cleanup();
  }
}

export const googleAuthService = new GoogleAuthService();