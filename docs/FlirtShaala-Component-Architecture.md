# FlirtShaala Component Architecture

## Overview

FlirtShaala follows a component-based architecture using React Native and Expo. This document outlines the responsibilities and relationships between components, contexts, and services.

## Component Hierarchy

```
App
├── RootLayout (_layout.tsx)
│   ├── AuthProvider
│   │   ├── ThemeProvider
│   │   │   ├── UserProvider
│   │   │   │   ├── SplashScreen
│   │   │   │   ├── AuthScreens
│   │   │   │   │   ├── Login
│   │   │   │   │   ├── Signup
│   │   │   │   │   └── ForgotPassword
│   │   │   │   ├── TabLayout
│   │   │   │   │   ├── ScreenshotTab
│   │   │   │   │   ├── ChatTab
│   │   │   │   │   ├── ResultTab
│   │   │   │   │   └── AccountTab
│   │   │   │   ├── PremiumScreen
│   │   │   │   ├── SettingsScreen
│   │   │   │   └── ProfileEditScreen
```

## Context Providers

### 1. AuthContext

**Purpose**: Manage authentication state and user profile data

**Key Responsibilities**:
- Track user authentication status
- Store and refresh auth tokens
- Provide user profile data
- Handle sign-up, sign-in, and sign-out
- Manage password reset flow
- Update user profile information

**Key Components**:
```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  incrementUsage: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
```

### 2. ThemeContext

**Purpose**: Manage app theme preferences

**Key Responsibilities**:
- Store theme preference (dark/light)
- Provide theme colors to components
- Toggle between themes
- Persist theme preference

**Key Components**:
```typescript
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: {
    background: string;
    surface: string;
    surfaceSecondary: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    cardBackground: string;
    inputBackground: string;
  };
}
```

### 3. UserContext

**Purpose**: Manage user data and usage statistics

**Key Responsibilities**:
- Track usage statistics
- Manage premium status
- Control daily usage limits
- Store language preferences
- Provide service access control

**Key Components**:
```typescript
interface UserContextType {
  userId: string | null;
  loading: boolean;
  isPremium: boolean;
  usageStats: UsageStats;
  preferredLanguage: Language;
  updateUsageStats: (type: 'reply' | 'action', watchedAd?: boolean) => Promise<void>;
  updateLanguagePreference: (language: Language) => Promise<void>;
  resetDailyUsage: () => Promise<void>;
  canUseService: () => { canUse: boolean; needsAd: boolean; reason?: string };
}
```

## Screen Components

### 1. ChatTab (`(tabs)/index.tsx`)

**Purpose**: Allow users to input chat text and generate responses

**Key Responsibilities**:
- Accept user text input
- Provide response style selection
- Generate AI responses
- Show "Break the Ice" feature
- Display usage statistics
- Navigate to result screen

**Key Functions**:
- `handleGenerateResponse()`: Process user input and generate response
- `handleBreakTheIce()`: Fetch random pickup lines
- `copyIceBreaker()`: Copy pickup line to clipboard
- `regenerateIceBreaker()`: Get a new pickup line

### 2. ScreenshotTab (`(tabs)/screenshot.tsx`)

**Purpose**: Allow users to upload screenshots for text extraction and response generation

**Key Responsibilities**:
- Image selection from gallery
- Camera capture (on mobile)
- OCR text extraction
- Response style selection
- Response generation
- Display usage statistics

**Key Functions**:
- `pickImage()`: Select image from gallery
- `takePhoto()`: Capture image with camera
- `handleProcessScreenshot()`: Process image and generate response
- `processScreenshot()`: Core processing logic

### 3. ResultTab (`(tabs)/result.tsx`)

**Purpose**: Display generated responses and manage response history

**Key Responsibilities**:
- Show original text/image
- Display generated response
- Provide copy, share, regenerate options
- Show response history
- Allow loading previous responses
- Manage response history (delete, etc.)

**Key Functions**:
- `loadHistory()`: Fetch response history
- `saveToHistory()`: Save current response
- `regenerateResponse()`: Generate new response for same input
- `copyToClipboard()`: Copy response to clipboard
- `shareResponse()`: Share response via platform sharing
- `deleteHistoryItem()`: Remove item from history

### 4. AccountTab (`(tabs)/account.tsx`)

**Purpose**: Display user account information and settings

**Key Responsibilities**:
- Show user profile information
- Display usage statistics
- Provide premium upgrade option
- Show account status
- Provide settings and sign-out options

**Key Functions**:
- `handleUpgradeToPremium()`: Navigate to premium screen
- `handleSettings()`: Navigate to settings screen
- `handleEditProfile()`: Navigate to profile edit screen
- `handleSignOut()`: Sign out user
- `handleSignIn()`: Navigate to login screen

## Service Components

### 1. OpenAI Service (`services/openai.ts`)

**Purpose**: Handle communication with OpenAI API

**Key Responsibilities**:
- Format prompts for OpenAI
- Send requests to OpenAI API
- Process and clean responses
- Provide fallback responses
- Detect language in input text

**Key Functions**:
- `generateFlirtyResponse()`: Generate response based on input text and style

### 2. OCR Service (`services/ocr.ts`)

**Purpose**: Extract text from images

**Key Responsibilities**:
- Prepare images for OCR
- Send requests to OCR.space API
- Process OCR results
- Provide fallback text extraction

**Key Functions**:
- `extractTextFromImage()`: Send image to OCR API and get text

### 3. API Service (`services/api.ts`)

**Purpose**: Handle communication with backend API

**Key Responsibilities**:
- Make HTTP requests to backend
- Handle request timeouts
- Process API responses
- Fetch pickup lines

**Key Functions**:
- `generateResponse()`: Get AI response from backend
- `processScreenshot()`: Process screenshot via backend
- `getPickupLine()`: Fetch random pickup line

### 4. Storage Service (`services/storage.ts`)

**Purpose**: Manage local storage

**Key Responsibilities**:
- Store user data locally
- Track usage statistics
- Store response history
- Handle daily usage reset
- Provide service access control

**Key Functions**:
- `getUserData()`: Get stored user data
- `updateUsageStats()`: Update usage statistics
- `getResponseHistory()`: Get stored response history
- `saveResponseToHistory()`: Save response to history
- `canUseService()`: Check if user can use service

### 5. Supabase Service (`services/supabase.ts`)

**Purpose**: Handle database operations

**Key Responsibilities**:
- Manage authentication
- Store and retrieve user profiles
- Track usage statistics
- Store and retrieve response history

**Key Functions**:
- Auth functions: `signUp()`, `signIn()`, `signOut()`, etc.
- Profile functions: `getUserProfile()`, `updateUserProfile()`, etc.
- History functions: `saveResponse()`, `getUserHistory()`, etc.

## UI Components

### 1. ThemedGradientBackground

**Purpose**: Provide theme-aware gradient background

**Key Responsibilities**:
- Apply gradient background based on theme
- Adapt colors to dark/light mode

### 2. LoadingSpinner

**Purpose**: Show animated loading indicator

**Key Responsibilities**:
- Display animated heart icon
- Provide visual feedback during loading

### 3. BannerAd

**Purpose**: Display advertisement banners

**Key Responsibilities**:
- Show ads for non-premium users
- Provide upgrade call-to-action
- Allow dismissing ads

### 4. SplashScreen

**Purpose**: Show animated app intro

**Key Responsibilities**:
- Display app logo and branding
- Provide animated intro sequence
- Transition to main app when ready

## Component Communication

### 1. Parent-Child Communication
- Props passing for configuration
- Callback functions for events

### 2. Context-Based Communication
- AuthContext for user data
- ThemeContext for styling
- UserContext for usage data

### 3. Navigation-Based Communication
- Route parameters for data passing
- Navigation state for screen transitions

### 4. Service-Based Communication
- API services for external data
- Storage services for persistence