import { Platform } from 'react-native';

// Get API base URL from environment with fallback
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 
  (Platform.OS === 'web' ? window.location.origin : 'https://flirtshaala.vercel.app');

interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    console.log('🌐 API Request:', {
      url,
      method: options.method || 'GET',
      hasBody: !!options.body
    });
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log('📡 API Response Status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ API Response Data:', data);
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      
      // Return mock data for development/demo purposes
      if (endpoint.includes('get-reply') || endpoint.includes('generate-response')) {
        console.log('🎭 Using mock response due to API failure');
        return this.getMockResponse(options.body) as T;
      } else if (endpoint.includes('process-image')) {
        console.log('🎭 Using mock image response due to API failure');
        return this.getMockImageResponse(options.body) as T;
      } else if (endpoint.includes('pickup-line') || endpoint.includes('random')) {
        console.log('🎭 Using mock pickup line due to API failure');
        return this.getMockPickupLine() as T;
      }
      
      throw error;
    }
  }

  private getMockResponse(body: any) {
    try {
      const data = typeof body === 'string' ? JSON.parse(body) : body || {};
      const responseType = data.responseType || data.chatText ? 'flirty' : 'flirty';
      
      console.log('🎭 Generating mock response for type:', responseType);
      
      const mockResponses = {
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
      
      const responses = mockResponses[responseType as keyof typeof mockResponses] || mockResponses.flirty;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      console.log('🎭 Mock response generated:', randomResponse);
      return { response: randomResponse };
    } catch (error) {
      console.error('❌ Error generating mock response:', error);
      return { response: "Hey there! 😊 That's such a sweet message!" };
    }
  }

  private getMockImageResponse(body: any) {
    try {
      const data = typeof body === 'string' ? JSON.parse(body) : body || {};
      const mockTexts = [
        "Hey! How are you doing today? 😊",
        "What's up? Want to hang out sometime?",
        "You look amazing in that photo! 💕",
        "Good morning! Hope you have a great day ahead ✨",
        "Thanks for the lovely message yesterday 😘"
      ];
      
      const extractedText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
      const response = this.getMockResponse(JSON.stringify({ responseType: data.responseType }));
      
      return {
        extractedText,
        response: response.response
      };
    } catch (error) {
      return {
        extractedText: "Hey! How are you doing today? 😊",
        response: "Hey there! 😊 That's such a sweet message!"
      };
    }
  }

  private getMockPickupLine() {
    const pickupLines = [
      "Are you a magician? Because whenever I look at you, everyone else disappears! ✨",
      "Do you have a map? I keep getting lost in your eyes! 🗺️",
      "Is your name Google? Because you have everything I've been searching for! 🔍",
      "Are you WiFi? Because I'm really feeling a connection! 📶",
      "Do you believe in love at first sight, or should I walk by again? 💕",
      "Are you a parking ticket? Because you've got 'fine' written all over you! 🎫",
      "Is your dad a boxer? Because you're a knockout! 🥊",
      "Are you made of copper and tellurium? Because you're Cu-Te! ⚗️"
    ];
    
    return { 
      line: pickupLines[Math.floor(Math.random() * pickupLines.length)],
      text: pickupLines[Math.floor(Math.random() * pickupLines.length)]
    };
  }

  async generateResponse(data: { chatText: string; responseType: 'flirty' | 'witty' | 'savage' }) {
    console.log('🚀 ApiService.generateResponse called with:', data);
    
    const result = await this.request<{ response: string }>('/api/get-reply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    console.log('📦 ApiService.generateResponse result:', result);
    return result;
  }

  async processImage(imageBase64: string, responseType: 'flirty' | 'witty' | 'savage') {
    return this.request<{ extractedText: string; response: string }>('/api/process-image', {
      method: 'POST',
      body: JSON.stringify({
        image: imageBase64,
        responseType,
      }),
    });
  }

  async getPickupLine() {
    try {
      // Try the external API first
      const response = await this.request<{ text: string }>('https://rizzapi.vercel.app/random');
      return { line: response.text };
    } catch (error) {
      console.warn('External pickup line API failed, using fallback');
      return this.getMockPickupLine();
    }
  }
}

export const apiService = new ApiService();