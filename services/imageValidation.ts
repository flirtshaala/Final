/**
 * Image validation utilities for FlirtShaala
 * Provides robust validation for image buffers and URIs
 */

interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  mimeType?: string;
  size?: number;
}

/**
 * Validates image buffer before processing
 */
function validateImageBuffer(buffer: ArrayBuffer | Buffer | Uint8Array | null | undefined): ImageValidationResult {
  if (!buffer) {
    return {
      isValid: false,
      error: "Invalid image buffer: Buffer is null or undefined"
    };
  }

  // Check if buffer has content
  if (buffer.byteLength === 0) {
    return {
      isValid: false,
      error: "Invalid image buffer: Buffer is empty"
    };
  }

  // Check minimum size (should be at least a few bytes for any valid image)
  if (buffer.byteLength < 10) {
    return {
      isValid: false,
      error: "Invalid image buffer: Buffer too small to be a valid image"
    };
  }

  // Check maximum size (50MB limit)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (buffer.byteLength > maxSize) {
    return {
      isValid: false,
      error: "Invalid image buffer: Image too large (max 50MB)"
    };
  }

  // Detect image type by magic bytes
  const uint8Array = new Uint8Array(buffer);
  const mimeType = detectImageMimeType(uint8Array);
  
  if (!mimeType) {
    return {
      isValid: false,
      error: "Invalid image buffer: Unrecognized image format"
    };
  }

  return {
    isValid: true,
    mimeType,
    size: buffer.byteLength
  };
}

/**
 * Validates image URI before processing
 */
export function validateImageUri(uri: string | null | undefined): ImageValidationResult {
  if (!uri) {
    return {
      isValid: false,
      error: "Invalid image URI: URI is null or undefined"
    };
  }

  if (typeof uri !== 'string' || uri.trim() === '') {
    return {
      isValid: false,
      error: "Invalid image URI: URI is empty or not a string"
    };
  }

  // Check if it's a valid URI format
  try {
    // For data URIs
    if (uri.startsWith('data:image/')) {
      const base64Match = uri.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
      if (!base64Match) {
        return {
          isValid: false,
          error: "Invalid image URI: Malformed data URI"
        };
      }
      
      const [, format, base64Data] = base64Match;
      
      // Validate base64 data
      try {
        const buffer = Buffer.from(base64Data, 'base64');
        return validateImageBuffer(buffer);
      } catch (error) {
        return {
          isValid: false,
          error: "Invalid image URI: Invalid base64 data"
        };
      }
    }
    
    // For file URIs or HTTP URLs
    if (uri.startsWith('file://') || uri.startsWith('http://') || uri.startsWith('https://')) {
      return {
        isValid: true,
        mimeType: 'unknown' // Will be determined when loaded
      };
    }
    
    // For content URIs (Android)
    if (uri.startsWith('content://')) {
      return {
        isValid: true,
        mimeType: 'unknown'
      };
    }
    
    return {
      isValid: false,
      error: "Invalid image URI: Unsupported URI scheme"
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid image URI: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Detects image MIME type from buffer magic bytes
 */
function detectImageMimeType(buffer: Uint8Array): string | null {
  // JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return 'image/jpeg';
  }
  
  // PNG
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return 'image/png';
  }
  
  // GIF
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return 'image/gif';
  }
  
  // WebP
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
    return 'image/webp';
  }
  
  // BMP
  if (buffer[0] === 0x42 && buffer[1] === 0x4D) {
    return 'image/bmp';
  }
  
  return null;
}

/**
 * Converts image URI to buffer with validation
 */
async function uriToBuffer(uri: string): Promise<ArrayBuffer> {
  const validation = validateImageUri(uri);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  try {
    if (uri.startsWith('data:image/')) {
      // Handle data URI
      const base64Data = uri.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      const bufferValidation = validateImageBuffer(buffer);
      if (!bufferValidation.isValid) {
        throw new Error(bufferValidation.error);
      }
      
      return buffer.buffer;
    } else {
      // Handle file URI or HTTP URL
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      const buffer = await response.arrayBuffer();
      
      const bufferValidation = validateImageBuffer(buffer);
      if (!bufferValidation.isValid) {
        throw new Error(bufferValidation.error);
      }
      
      return buffer;
    }
  } catch (error) {
    throw new Error(`Failed to convert URI to buffer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Safe image processing wrapper
 */
export async function safeImageProcess<T>(
  imageSource: string | ArrayBuffer | Buffer | Uint8Array,
  processor: (validBuffer: ArrayBuffer) => Promise<T>
): Promise<T> {
  let buffer: ArrayBuffer;
  
  if (typeof imageSource === 'string') {
    // It's a URI
    buffer = await uriToBuffer(imageSource);
  } else {
    // It's already a buffer
    const validation = validateImageBuffer(imageSource);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    
    if (imageSource instanceof ArrayBuffer) {
      buffer = imageSource;
    } else {
      buffer = imageSource.buffer.slice(imageSource.byteOffset, imageSource.byteOffset + imageSource.byteLength);
    }
  }
  
  return await processor(buffer);
}