import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';

interface ImageProcessingResult {
  processedImageUri: string;
  width: number;
  height: number;
  size: number;
}

class ImageProcessingService {
  async processImageForOCR(imageUri: string): Promise<ImageProcessingResult> {
    if (Platform.OS === 'web') {
      return {
        processedImageUri: imageUri,
        width: 0,
        height: 0,
        size: 0,
      };
    }

    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          { resize: { width: 1920 } }, // Resize if needed
        ],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      return {
        processedImageUri: manipResult.uri,
        width: manipResult.width ?? 0,
        height: manipResult.height ?? 0,
        size: 0, // Optionally get file size using FileSystem API
      };
    } catch (error) {
      console.error('Image processing error:', error);
      return {
        processedImageUri: imageUri,
        width: 0,
        height: 0,
        size: 0,
      };
    }
  }

  async compressImage(imageUri: string, quality: number = 0.8): Promise<string> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [],
        { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
      );
      return result.uri;
    } catch (error) {
      console.error('Image compression error:', error);
      return imageUri;
    }
  }

  validateImage(imageUri: string): { isValid: boolean; error?: string } {
    try {
      if (!imageUri || typeof imageUri !== 'string') {
        return { isValid: false, error: 'Invalid image URI' };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Failed to validate image' };
    }
  }
}

export const imageProcessingService = new ImageProcessingService();
