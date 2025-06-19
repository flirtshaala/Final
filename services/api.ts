import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://your-backend-api.com';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      
      // Return mock data for development/demo purposes
      if (endpoint === '/generate-response') {
        return this.getMockResponse(options.body);
      } else if (endpoint === '/process-image') {
        return this.getMockImageResponse(options.body);
      } else if (endpoint === '/pickup-line') {
        return this.getMockPickupLine();
      }
      
      throw error;
    }
  }

  private getMockResponse(body: any) {
    const data = JSON.parse(body || '{}');
    const mockResponses = {
      flirty: [
        "Hey there! 😊 That's such a sweet message!",
        "Aww, you're making me blush! 💕",
        "You know just what to say to make someone smile! ✨"
      ],
      witty: [
        "Well, well, well... someone's got game! 😏",
        "That's actually pretty clever! I'm impressed 🤔",
        "Smooth operator alert! 🚨"
      ],
      savage: [
        "Oh really? That's your best shot? 😤",
        "Bold move, let's see how that works out! 💪",
        "Someone's feeling confident today! 🔥"
      ]
    };
    
    const responses = mockResponses[data.responseType as keyof typeof mockResponses] || mockResponses.flirty;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return { response: randomResponse };
  }

  private getMockImageResponse(body: any) {
    const data = JSON.parse(body || '{}');
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
  }

  private getMockPickupLine() {
    const pickupLines = [
      "Are you a magician? Because whenever I look at you, everyone else disappears! ✨",
      "Do you have a map? I keep getting lost in your eyes! 🗺️",
      "Is your name Google? Because you have everything I've been searching for! 🔍",
      "Are you WiFi? Because I'm really feeling a connection! 📶",
      "Do you believe in love at first sight, or should I walk by again? 💕"
    ];
    
    return { line: pickupLines[Math.floor(Math.random() * pickupLines.length)] };
  }

  async processImage(imageBase64: string, responseType: 'flirty' | 'witty' | 'savage') {
    return this.request('/process-image', {
      method: 'POST',
      body: JSON.stringify({
        image: imageBase64,
        responseType,
      }),
    });
  }

  async generateResponse(text: string, responseType: 'flirty' | 'witty' | 'savage') {
    return this.request('/generate-response', {
      method: 'POST',
      body: JSON.stringify({
        text,
        responseType,
      }),
    });
  }

  async getPickupLine() {
    return this.request('/pickup-line', {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService();