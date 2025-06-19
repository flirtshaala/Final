# FlirtShaala Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [API Flow and Endpoints](#api-flow-and-endpoints)
4. [Component Responsibilities](#component-responsibilities)
5. [Authentication and Session Management](#authentication-and-session-management)
6. [Screenshot OCR Architecture](#screenshot-ocr-architecture)
7. [Database Schema](#database-schema)
8. [User Flow](#user-flow)
9. [API Keys and Services](#api-keys-and-services)
10. [Deployment Guide](#deployment-guide)

## Project Overview

FlirtShaala is an AI-powered mobile application that helps users craft perfect responses for their dating chats and conversations. The app uses advanced AI to analyze chat screenshots or text input and generate witty, flirty, or savage responses that match the original language and style.

### Key Features
- Smart language detection (English, Hindi, Hinglish, Marathi)
- Multiple response styles (flirty, witty, savage)
- Screenshot text extraction via OCR
- Response history tracking
- User authentication
- Premium subscription model
- Dark/light theme support

## Project Structure

The project follows Expo's managed workflow with Expo Router for navigation. Here's the high-level structure:

```
flirtshaala/
├── app/                    # Main application routes
│   ├── _layout.tsx         # Root layout with initialization
│   ├── index.tsx           # Entry point/splash screen
│   ├── (tabs)/             # Tab-based navigation
│   │   ├── _layout.tsx     # Tab configuration
│   │   ├── index.tsx       # Chat tab
│   │   ├── screenshot.tsx  # Screenshot tab
│   │   ├── result.tsx      # Results tab
│   │   └── account.tsx     # Account tab
│   ├── auth/               # Authentication routes
│   │   ├── login.tsx       # Login screen
│   │   ├── signup.tsx      # Signup screen
│   │   └── ...             # Other auth screens
│   ├── premium.tsx         # Premium subscription screen
│   ├── settings.tsx        # App settings screen
│   └── +api/               # API routes for server-side functions
│       └── get-reply+api.ts # API endpoint for generating replies
├── components/             # Reusable UI components
│   ├── BannerAd.tsx        # Ad banner component
│   ├── GradientBackground.tsx # Background gradient component
│   ├── LoadingSpinner.tsx  # Loading animation component
│   ├── SplashScreen.tsx    # App splash screen component
│   └── ThemedGradientBackground.tsx # Theme-aware background
├── context/                # React context providers
│   ├── AuthContext.tsx     # Authentication state management
│   ├── ThemeContext.tsx    # Theme state management
│   └── UserContext.tsx     # User data and preferences
├── services/               # Business logic and API services
│   ├── ads.ts              # Ad management service
│   ├── api.ts              # API communication service
│   ├── ocr.ts              # OCR text extraction service
│   ├── openai.ts           # OpenAI integration service
│   ├── storage.ts          # Local storage service
│   └── supabase.ts         # Supabase database service
├── supabase/               # Supabase configuration
│   └── migrations/         # Database migration files
├── assets/                 # Static assets
│   └── images/             # App images and icons
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── .env.example            # Environment variables template
├── app.json                # Expo configuration
└── package.json            # Project dependencies
```

## API Flow and Endpoints

### Client-Side API Flow

1. **User Input Processing**:
   - User enters text in Chat tab or uploads a screenshot in Screenshot tab
   - Client validates input and prepares request payload

2. **API Request**:
   - Client first attempts to call backend API endpoint
   - If backend fails, falls back to direct OpenAI service call

3. **Response Handling**:
   - Client processes response and updates UI
   - Response is saved to history (local storage or Supabase)
   - Usage statistics are updated

### Server-Side API Endpoints

#### 1. `/api/get-reply` (POST)
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

#### 2. External OCR API (OCR.space)
- **Endpoint**: `https://api.ocr.space/parse/image`
- **Method**: POST
- **Purpose**: Extract text from screenshot images
- **Request**: Multipart form data with image file
- **Response**: JSON with extracted text

#### 3. External OpenAI API
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Method**: POST
- **Purpose**: Generate AI responses
- **Request**: JSON with prompt and parameters
- **Response**: JSON with generated text

#### 4. External Pickup Line API
- **Endpoint**: `https://rizzapi.vercel.app/random`
- **Method**: GET
- **Purpose**: Get random pickup lines for "Break the Ice" feature
- **Response**: JSON with pickup line text

## Component Responsibilities

### Layout Components
- **`_layout.tsx`**: Root layout component that initializes the app, loads fonts, and sets up navigation
- **`(tabs)/_layout.tsx`**: Configures the tab-based navigation with icons and styling

### Screen Components
- **`index.tsx`** (Splash): Handles initial app loading and navigation
- **`(tabs)/index.tsx`** (Chat): Manages text input, response generation, and "Break the Ice" feature
- **`(tabs)/screenshot.tsx`**: Handles image selection, OCR processing, and response generation from screenshots
- **`(tabs)/result.tsx`**: Displays generated responses, manages response history, and provides sharing options
- **`(tabs)/account.tsx`**: Shows user profile, usage statistics, and account management options
- **`auth/*.tsx`**: Handles user authentication flows (login, signup, password reset)
- **`premium.tsx`**: Displays premium subscription options and benefits
- **`settings.tsx`**: Manages app settings like theme and notifications

### UI Components
- **`BannerAd.tsx`**: Displays advertisement banners for non-premium users
- **`GradientBackground.tsx`**: Provides a gradient background for light mode
- **`ThemedGradientBackground.tsx`**: Theme-aware gradient background that changes with dark/light mode
- **`LoadingSpinner.tsx`**: Animated loading indicator
- **`SplashScreen.tsx`**: Animated app intro screen

### Context Providers
- **`AuthContext.tsx`**: Manages authentication state, user session, and profile data
- **`ThemeContext.tsx`**: Handles theme preferences (dark/light mode)
- **`UserContext.tsx`**: Manages user data, usage statistics, and premium status

## Authentication and Session Management

### Authentication Flow

1. **User Registration**:
   - User enters email, password, and optional profile information
   - Data is validated client-side
   - Account creation request is sent to Supabase Auth
   - User profile is created in the database
   - Verification email is sent (optional)

2. **User Login**:
   - User enters email and password
   - Credentials are validated by Supabase Auth
   - JWT token is returned and stored
   - User profile is fetched from database

3. **Session Management**:
   - JWT token is stored securely (AsyncStorage on mobile, localStorage on web)
   - Token is refreshed automatically by Supabase client
   - Session state is managed by AuthContext

4. **Password Reset**:
   - User requests password reset via email
   - Reset link is sent to user's email
   - User sets new password
   - Session is updated with new credentials

5. **Social Authentication** (Google):
   - User initiates Google sign-in
   - OAuth flow is handled by Supabase Auth
   - User is redirected to callback URL
   - Profile is created or updated in database

### Session Storage
- **Mobile**: AsyncStorage via Supabase's React Native integration
- **Web**: localStorage via Supabase's web integration

## Screenshot OCR Architecture

### OCR Process Flow

1. **Image Selection**:
   - User selects image from gallery or takes photo
   - Image is displayed in UI for confirmation

2. **Image Processing**:
   - Image is prepared for OCR (no preprocessing in current implementation)
   - Image is converted to appropriate format (JPEG)

3. **OCR API Request**:
   - Image is sent to OCR.space API
   - API extracts text from image
   - Text is returned to client

4. **Response Generation**:
   - Extracted text is processed like regular chat input
   - AI generates appropriate response
   - Response is displayed to user

### OCR Fallback Mechanism
- If OCR API fails, mock text extraction is used for demo purposes
- Random predefined chat messages are returned as extracted text

## Database Schema

### Supabase Tables

#### 1. `users` Table
- **Purpose**: Store user profile information
- **Schema**:
  ```sql
  CREATE TABLE users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    name text,
    gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    age integer CHECK (age >= 13 AND age <= 120),
    usage_count integer DEFAULT 0,
    plan_type text DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
  ```

#### 2. `response_history` Table
- **Purpose**: Store user's generated responses
- **Schema**:
  ```sql
  CREATE TABLE response_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    response text NOT NULL,
    original_text text NOT NULL,
    response_type text NOT NULL CHECK (response_type IN ('flirty', 'witty', 'savage')),
    image_uri text,
    created_at timestamptz DEFAULT now()
  );
  ```

### Row-Level Security (RLS) Policies

#### Users Table Policies
1. **Users can read own data**:
   ```sql
   CREATE POLICY "Users can read own data"
     ON users
     FOR SELECT
     TO authenticated
     USING (auth.uid() = id);
   ```

2. **Users can update own data**:
   ```sql
   CREATE POLICY "Users can update own data"
     ON users
     FOR UPDATE
     TO authenticated
     USING (auth.uid() = id);
   ```

3. **Users can insert own profile**:
   ```sql
   CREATE POLICY "Users can insert own profile"
     ON users
     FOR INSERT
     TO authenticated
     WITH CHECK (auth.uid() = id);
   ```

#### Response History Table Policies
1. **Users can read own responses**:
   ```sql
   CREATE POLICY "Users can read own responses"
     ON response_history
     FOR SELECT
     TO authenticated
     USING (auth.uid() = user_id);
   ```

2. **Users can insert own responses**:
   ```sql
   CREATE POLICY "Users can insert own responses"
     ON response_history
     FOR INSERT
     TO authenticated
     WITH CHECK (auth.uid() = user_id);
   ```

3. **Users can delete own responses**:
   ```sql
   CREATE POLICY "Users can delete own responses"
     ON response_history
     FOR DELETE
     TO authenticated
     USING (auth.uid() = user_id);
   ```

## User Flow

### Guest User Flow
1. User opens app and sees splash screen
2. User is directed to main tabs (Screenshot tab is default)
3. User can:
   - Upload screenshot or take photo
   - Enter chat text
   - Generate responses (limited to daily quota)
   - View response history (stored locally)
   - Access settings
4. Usage statistics are stored locally
5. User can sign up or log in to access more features

### Authenticated User Flow
1. User logs in or creates account
2. User profile and preferences are loaded from database
3. User can:
   - All guest features
   - Sync data across devices
   - Edit profile information
   - Access premium features (if subscribed)
4. Usage statistics are stored in database
5. Response history is synced across devices

### Premium User Flow
1. User upgrades to premium subscription
2. User profile is updated with premium status
3. User gets:
   - Unlimited responses
   - Ad-free experience
   - Priority support
   - Advanced AI models

## API Keys and Services

### Required API Keys

1. **OpenAI API Key**
   - **Purpose**: Generate AI responses
   - **Where to Get**: [OpenAI Platform](https://platform.openai.com/)
   - **Environment Variable**: `EXPO_PUBLIC_OPENAI_API_KEY`
   - **Configuration**: Add to `.env` file

2. **OCR.space API Key**
   - **Purpose**: Extract text from screenshots
   - **Where to Get**: [OCR.space](https://ocr.space/ocrapi)
   - **Environment Variable**: `EXPO_PUBLIC_OCR_API_KEY`
   - **Configuration**: Add to `.env` file

3. **Supabase Project URL and Anon Key**
   - **Purpose**: Database and authentication
   - **Where to Get**: [Supabase Dashboard](https://app.supabase.io/)
   - **Environment Variables**:
     - `EXPO_PUBLIC_SUPABASE_URL`
     - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - **Configuration**: Add to `.env` file

4. **AdMob App ID** (for production)
   - **Purpose**: Display ads
   - **Where to Get**: [Google AdMob](https://admob.google.com/)
   - **Environment Variable**: `EXPO_PUBLIC_ADMOB_APP_ID`
   - **Configuration**: Add to `.env` file and update in `app.json`

### Environment Setup

1. Create a `.env` file in the project root with the following structure:
   ```
   # OpenAI API Key for generating responses
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key_here

   # OCR Space API Key for text extraction from images
   EXPO_PUBLIC_OCR_API_KEY=your_ocrspace_key_here

   # AdMob App ID for advertisements
   EXPO_PUBLIC_ADMOB_APP_ID=your_admob_app_id_here

   # Backend API URL (for production deployment)
   EXPO_PUBLIC_API_URL=https://flirtshaala.vercel.app/api

   # Supabase Configuration
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. For development, you can use mock services:
   - If OpenAI API key is not provided, the app will use mock responses
   - If OCR API key is not provided, the app will use mock text extraction
   - If Supabase credentials are not provided, the app will use local storage

## Deployment Guide

### 1. Environment Setup
- Create production `.env` file with all required API keys
- Ensure all services are properly configured

### 2. Supabase Setup
- Create Supabase project
- Run migrations from `supabase/migrations/` directory
- Set up authentication providers (email, Google)
- Configure storage buckets if needed

### 3. Expo Build
- Update app version in `app.json`
- Run `eas build` for iOS/Android builds
- For web, run `expo export --platform web`

### 4. Deployment
- Deploy web version to Vercel or Netlify
- Submit mobile apps to App Store and Google Play
- Configure production environment variables

### 5. Monitoring
- Set up error tracking (e.g., Sentry)
- Configure analytics (e.g., Firebase Analytics)
- Monitor API usage and costs