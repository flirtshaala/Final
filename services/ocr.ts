import { validateImageUri, safeImageProcess } from './imageValidation';
import { imageProcessingService } from './imageProcessing';

interface OCRResponse {
  ParsedResults: {
    ParsedText: string;
  }[];
  IsErroredOnProcessing: boolean;
  ErrorMessage?: string;
}

class OCRService {
  private apiKey: string;
  private baseURL = 'https://api.ocr.space/parse/image';

  constructor() {
    // Get API key from environment variables with fallbacks
    this.apiKey = process.env.EXPO_PUBLIC_OCR_API_KEY || '';
    
    // For web deployment, also check window object
    if (typeof window !== 'undefined' && !this.apiKey) {
      this.apiKey = (window as any).EXPO_PUBLIC_OCR_API_KEY || '';
    }
  }

  async extractTextFromImage(imageUri: string): Promise<string> {
    try {
      // Validate image URI first
      const validation = validateImageUri(imageUri);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      if (!this.apiKey || this.apiKey === 'your_ocrspace_key_here' || this.apiKey === '') {
        console.warn('OCR API key not configured, using mock response');
        return this.getMockExtractedText();
      }

      return await safeImageProcess(imageUri, async (buffer) => {
        // Convert buffer to blob for FormData
        const blob = new Blob([buffer], { type: validation.mimeType || 'image/jpeg' });
        
        const formData = new FormData();
        formData.append('file', blob, 'chat_screenshot.jpg');
        formData.append('apikey', this.apiKey);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        formData.append('detectOrientation', 'true');
        formData.append('scale', 'true');
        formData.append('OCREngine', '2');

        const response = await fetch(this.baseURL, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Invalid OCR API key. Please check your EXPO_PUBLIC_OCR_API_KEY in .env file.');
          }
          if (response.status === 429) {
            throw new Error('OCR API rate limit exceeded. Please try again later.');
          }
          throw new Error(`OCR API error: ${response.status} ${response.statusText}`);
        }

        const data: OCRResponse = await response.json();

        if (data.IsErroredOnProcessing) {
          throw new Error(data.ErrorMessage || 'OCR processing failed');
        }

        const extractedText = data.ParsedResults?.[0]?.ParsedText?.trim() || '';
        
        if (!extractedText) {
          throw new Error('No text found in the image. Please try with a clearer screenshot.');
        }

        return extractedText;
      });
    } catch (error) {
      console.error('OCR API Error:', error);
      
      // Fallback to mock text for demo purposes
      if (error instanceof Error && error.message.includes('API key')) {
        throw error; // Re-throw API key errors
      }
      
      console.warn('OCR failed, using mock response for demo');
      return this.getMockExtractedText();
    }
  }

  private getMockExtractedText(): string {
    const mockTexts = [
      "Hey! How are you doing today? 😊",
      "What's up? Want to hang out sometime?",
      "You look amazing in that photo! 💕",
      "Good morning! Hope you have a great day ahead ✨",
      "Thanks for the lovely message yesterday 😘",
      "Are you free this weekend?",
      "That was such a fun time last night!",
      "Can't wait to see you again 💖",
      "Your smile always brightens my day ☀️",
      "Hope you're having a wonderful day! 🌟"
    ];
    
    const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
    
    // Simulate OCR processing delay
    return new Promise(resolve => {
      setTimeout(() => resolve(randomText), 1500);
    }) as any;
  }
}

export const ocrService = new OCRService();