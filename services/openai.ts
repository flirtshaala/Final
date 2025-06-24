interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export type ResponseType = 'flirty' | 'witty' | 'savage';

class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    // Try to get API key from environment variables
    this.apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
    
    // For web deployment, also check window object
    if (typeof window !== 'undefined' && !this.apiKey) {
      this.apiKey = (window as any).EXPO_PUBLIC_OPENAI_API_KEY || '';
    }
  }

  private getResponseTypePrompt(responseType: ResponseType): string {
    const prompts = {
      flirty: "Make the response extra flirty, charming, and romantic. Use playful language and subtle innuendos.",
      witty: "Make the response clever, smart, and humorous. Use wordplay and intelligent humor.",
      savage: "Make the response bold, confident, and sassy. Show attitude while keeping it playful."
    };
    
    return prompts[responseType];
  }

  private parseConversationContext(chatContext: string): string {
    // Remove common non-human prompts and system messages
    const cleanedContext = chatContext
      .replace(/^(AI|Bot|Assistant|System):/gmi, '')
      .replace(/I am (good|fine|ready|here to help)/gi, '')
      .replace(/How can I (help|assist) you/gi, '')
      .replace(/Is there anything else/gi, '')
      .trim();

    return cleanedContext || chatContext;
  }

  async generateFlirtyResponse(
    chatContext: string, 
    responseType: ResponseType = 'flirty'
  ): Promise<string> {
    console.log('🤖 OpenAI Service called with:', { chatContext, responseType });
    console.log('🔑 API Key available:', !!this.apiKey && this.apiKey !== 'your_openai_key_here');

    if (!this.apiKey || this.apiKey === 'your_openai_key_here' || this.apiKey === '') {
      console.log('🎭 No OpenAI API key, using mock response');
      
      // Return a mock response for demo purposes when API key is not available
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
      
      const responses = mockResponses[responseType];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      console.log('🎭 Mock OpenAI response:', randomResponse);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return randomResponse;
    }

    const cleanedContext = this.parseConversationContext(chatContext);
    const responsePrompt = this.getResponseTypePrompt(responseType);

    const systemPrompt = `You are an assistant that helps users turn boring conversations into flirty ones. Use the same language or code-mixed tone as the ongoing conversation. Do not switch to English unless it's already in use. Match the mood, tone, and formality. Make the conversation witty, playful, flirtatious, and fun—but never cringey or creepy. Responses should feel natural and culturally grounded. Prioritize charm, light teasing, humor, and subtle flirtation over cheesy lines. Avoid generic compliments. Be clever.

${responsePrompt}

CRITICAL RESPONSE RULES:
1. Keep responses under 50 words
2. Make it sound natural and conversational - like a real person texting
3. Use the EXACT same language, script, and mixing pattern as the input
4. Consider the context and tone of the conversation
5. Avoid being offensive or inappropriate
6. Make it engaging and likely to get a positive response
7. NEVER respond as a chatbot or AI assistant
8. Focus on understanding flirt cues, emojis, and romantic context
9. Generate human-like replies suitable for dating/chatting
10. Use appropriate emojis and modern texting style
11. If input is in Hindi/Devanagari, respond in Hindi/Devanagari
12. If input is in Hinglish/Roman script, respond in Hinglish/Roman script
13. If input is in Marathi, respond in Marathi with same script
14. Match the cultural context and references

Chat context: "${cleanedContext}"

Generate ONLY the response text, no explanations, quotes, or meta-commentary. Respond in the SAME language and script as the input.`;

    try {
      console.log('🌐 Making OpenAI API request...');
      
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            }
          ],
          max_tokens: 100,
          temperature: 0.8,
        }),
      });

      console.log('📡 OpenAI API Response Status:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid OpenAI API key. Please check your EXPO_PUBLIC_OPENAI_API_KEY in .env file.');
        }
        if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again in a moment.');
        }
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      console.log('📦 OpenAI API Response Data:', data);
      
      const generatedResponse = data.choices[0]?.message?.content?.trim();
      
      if (!generatedResponse) {
        throw new Error('No response generated');
      }

      // Clean up any remaining AI-like responses
      const cleanedResponse = generatedResponse
        .replace(/^(As an AI|I'm an AI|I am an AI)/gi, '')
        .replace(/I'm here to help/gi, '')
        .replace(/How can I assist/gi, '')
        .trim();

      const finalResponse = cleanedResponse || 'Hey! 😊';
      console.log('✅ Final OpenAI response:', finalResponse);
      
      return finalResponse;
    } catch (error) {
      console.error('❌ OpenAI API Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate response. Please check your connection and try again.');
    }
  }
}

export const openaiService = new OpenAIService();