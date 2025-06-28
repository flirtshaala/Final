// Mock services for cross-platform compatibility

export const mockOCRService = {
  extractTextFromImage: async (imageUri: string): Promise<string> => {
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockTexts = [
      "Hey! How are you doing today? 😊",
      "What's up? Want to hang out sometime?",
      "You look amazing in that photo! 💕",
      "Good morning! Hope you have a great day ahead ✨",
      "Thanks for the lovely message yesterday 😘"
    ];
    
    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  }
};

export const mockOpenAIService = {
  generateResponse: async (text: string, style: 'flirty' | 'witty' | 'savage'): Promise<string> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const responses = {
      flirty: [
        "Hey there! 😊 That's such a sweet message!",
        "Aww, you're making me blush! 💕",
        "You know just what to say to make someone smile! ✨",
        "That's so thoughtful of you! 😍",
        "You always know how to make my day better! 💖"
      ],
      witty: [
        "Well, well, well... someone's got game! 😏",
        "That's actually pretty clever! I'm impressed 🤔",
        "Smooth operator alert! 🚨",
        "Are you a magician? Because that was smooth! ✨",
        "I see what you did there... nice move! 😎"
      ],
      savage: [
        "Oh really? That's your best shot? 😤",
        "Bold move, let's see how that works out! 💪",
        "Someone's feeling confident today! 🔥",
        "Interesting strategy... let's see if it pays off! 😈",
        "That's one way to get attention! 💯"
      ]
    };
    
    const styleResponses = responses[style];
    return styleResponses[Math.floor(Math.random() * styleResponses.length)];
  }
};

export const mockSupabaseService = {
  signIn: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { user: { id: '1', email }, session: { access_token: 'mock_token' } };
  },
  
  signUp: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { user: { id: '1', email }, session: { access_token: 'mock_token' } };
  },
  
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { error: null };
  },
  
  saveResponse: async (response: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { id: Date.now().toString(), ...response }, error: null };
  },
  
  getHistory: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: [], error: null };
  }
};

export const mockAdService = {
  showBanner: () => {
    console.log('Mock: Banner ad shown');
  },
  
  showRewarded: async (): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('Mock: Rewarded ad completed');
    return true;
  },
  
  showInterstitial: async (): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Mock: Interstitial ad shown');
    return true;
  }
};