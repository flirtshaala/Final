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
    // Try to get API key from environment variables
    this.apiKey = process.env.EXPO_PUBLIC_OCR_API_KEY || '';
    
    // For web deployment, also check window object
    if (typeof window !== 'undefined' && !this.apiKey) {
      this.apiKey = (window as any).EXPO_PUBLIC_OCR_API_KEY || '';
    }
  }

  async extractTextFromImage(imageUri: string): Promise<string> {
    // Validate image URI first
    const validation = validateImageUri(imageUri);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    if (!this.apiKey || this.apiKey === 'your_ocrspace_key_here' || this.apiKey === '') {
      // Return mock extracted text for demo purposes
      const mockTexts = [
        "Hey! How are you doing today? 😊",
        "What's up? Want to hang out sometime?",
        "You look amazing in that photo! 💕",
        "Good morning! Hope you have a great day ahead ✨",
        "Thanks for the lovely message yesterday 😘"
      ];
      
      const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
      
      // Simulate OCR processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return randomText;
    }

    try {
      return await safeImageProcess(imageUri, async (buffer) => {
        // Process image for better OCR results
        const processedResult = await imageProcessingService.processImageForOCR(imageUri);
        
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
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Invalid OCR API key. Please check your EXPO_PUBLIC_OCR_API_KEY in .env file.');
          }
          throw new Error(`OCR API error: ${response.status}`);
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
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to extract text from image. Please try again with a clearer screenshot.');
    }
  }
}

export const ocrService = new OCRService();