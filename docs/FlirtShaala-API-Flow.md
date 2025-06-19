# FlirtShaala API Flow

## Overview

FlirtShaala uses multiple APIs to provide its core functionality. This document outlines the API flow, endpoints, and integration points.

## API Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  User Input  │────▶│  FlirtShaala │────▶│  Backend API │
│  (Text/Image)│     │  Client App  │     │  (Serverless)│
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                           │                    │
                           │                    ▼
                           │            ┌─────────────┐
                           │            │  OpenAI API  │
                           │            └──────┬──────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐    ┌─────────────┐
                    │  OCR.space  │    │  Response to │
                    │  API        │    │  User        │
                    └─────────────┘    └─────────────┘
```

## API Endpoints

### 1. Backend API Endpoints

#### `/api/get-reply` (POST)
- **Purpose**: Generate AI response for chat text
- **Request Body**:
  ```json
  {
    "chatText": "User's chat message",
    "responseType": "flirty|witty|savage"
  }
  ```
- **Response**:
  ```json
  {
    "response": "AI-generated response"
  }
  ```
- **Error Response**:
  ```json
  {
    "error": "Error message",
    "details": "Detailed error information"
  }
  ```
- **Implementation**: `app/+api/get-reply+api.ts`

### 2. External APIs

#### OCR.space API
- **Endpoint**: `https://api.ocr.space/parse/image`
- **Method**: POST
- **Purpose**: Extract text from screenshot images
- **Request Parameters**:
  - `apikey`: OCR.space API key
  - `file`: Image file (multipart/form-data)
  - `language`: 'eng' (English)
  - `isOverlayRequired`: 'false'
  - `detectOrientation`: 'true'
  - `scale`: 'true'
  - `OCREngine`: '2'
- **Response Structure**:
  ```json
  {
    "ParsedResults": [
      {
        "ParsedText": "Extracted text from image"
      }
    ],
    "IsErroredOnProcessing": false
  }
  ```
- **Implementation**: `services/ocr.ts`

#### OpenAI API
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Method**: POST
- **Purpose**: Generate AI responses
- **Request Body**:
  ```json
  {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "System prompt with instructions"
      }
    ],
    "max_tokens": 100,
    "temperature": 0.8
  }
  ```
- **Response Structure**:
  ```json
  {
    "choices": [
      {
        "message": {
          "content": "Generated response text"
        }
      }
    ]
  }
  ```
- **Implementation**: `services/openai.ts` and `app/+api/get-reply+api.ts`

#### Pickup Line API
- **Endpoint**: `https://rizzapi.vercel.app/random`
- **Method**: GET
- **Purpose**: Get random pickup lines for "Break the Ice" feature
- **Response Structure**:
  ```json
  {
    "text": "Random pickup line text"
  }
  ```
- **Implementation**: `services/api.ts`

## Supabase API Integration

### Auth API
- **Purpose**: User authentication and session management
- **Key Methods**:
  - `signUp`: Register new users
  - `signIn`: Authenticate existing users
  - `signInWithOAuth`: Social authentication
  - `signOut`: End user session
  - `resetPassword`: Password recovery
- **Implementation**: `services/supabase.ts` (authService)

### Database API
- **Purpose**: Store and retrieve user data and response history
- **Key Methods**:
  - `getUserProfile`: Get user profile data
  - `updateUserProfile`: Update user information
  - `incrementUsageCount`: Update usage statistics
  - `saveResponse`: Save generated response to history
  - `getUserHistory`: Get user's response history
  - `deleteResponse`: Remove response from history
- **Implementation**: `services/supabase.ts` (authService, responseHistoryService)

## Error Handling and Fallbacks

### API Request Fallbacks
1. **Backend API Failure**:
   - If the backend API fails, the app falls back to direct OpenAI API calls
   - Implemented in `(tabs)/index.tsx` and `(tabs)/screenshot.tsx`

2. **OCR API Failure**:
   - If OCR.space API fails, mock text extraction is used
   - Predefined chat messages are returned as extracted text
   - Implemented in `services/ocr.ts`

3. **OpenAI API Failure**:
   - If OpenAI API fails, mock responses are used
   - Responses are categorized by type (flirty, witty, savage)
   - Implemented in `services/openai.ts` and `app/+api/get-reply+api.ts`

4. **Pickup Line API Failure**:
   - If the pickup line API fails, fallback lines are used
   - Multiple retry attempts are made before using fallbacks
   - Implemented in `services/api.ts`

### Error Handling Strategy
- All API calls are wrapped in try/catch blocks
- Specific error types are identified and handled appropriately
- User-friendly error messages are displayed
- Detailed error logging for debugging
- Retry mechanisms for transient failures