# FlirtShaala API Keys Guide

This document provides instructions on where and how to configure API keys for all services used in the FlirtShaala application.

## Environment Variables Setup

FlirtShaala uses Expo's environment variable system to manage API keys and configuration. Follow these steps to set up your environment:

1. Create a `.env` file in the project root directory
2. Copy the contents from `.env.example`
3. Replace placeholder values with your actual API keys

## Required API Keys

### 1. OpenAI API Key

**Purpose**: Generate AI responses for chat messages

**Where to Get**:
1. Create an account at [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API Keys section
3. Create a new secret key
4. Copy the key (you won't be able to see it again)

**Where to Configure**:
- Add to `.env` file:
  ```
  EXPO_PUBLIC_OPENAI_API_KEY=sk-your_openai_key_here
  ```

**Usage in Code**:
- `services/openai.ts`: Used for direct API calls
- `app/+api/get-reply+api.ts`: Used in serverless function

**Testing Without Key**:
- The app will use mock responses if no key is provided
- Suitable for development and testing

### 2. OCR.space API Key

**Purpose**: Extract text from screenshots

**Where to Get**:
1. Register at [OCR.space](https://ocr.space/ocrapi)
2. Get your free API key (or premium for higher limits)

**Where to Configure**:
- Add to `.env` file:
  ```
  EXPO_PUBLIC_OCR_API_KEY=your_ocrspace_key_here
  ```

**Usage in Code**:
- `services/ocr.ts`: Used for OCR API calls

**Testing Without Key**:
- The app will use mock text extraction if no key is provided
- Returns predefined chat messages for testing

### 3. Supabase Configuration

**Purpose**: Database and authentication

**Where to Get**:
1. Create a project at [Supabase](https://app.supabase.io/)
2. Navigate to Project Settings > API
3. Copy the URL and anon/public key

**Where to Configure**:
- Add to `.env` file:
  ```
  EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

**Usage in Code**:
- `services/supabase.ts`: Used for database and auth operations

**Database Setup**:
1. Run migrations from `supabase/migrations/` directory
2. Set up authentication providers in Supabase dashboard

### 4. AdMob Configuration (for production)

**Purpose**: Display advertisements

**Where to Get**:
1. Create an account at [Google AdMob](https://admob.google.com/)
2. Create a new app
3. Get your App ID and ad unit IDs

**Where to Configure**:
- Add to `.env` file:
  ```
  EXPO_PUBLIC_ADMOB_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
  ```
- Update in `app.json`:
  ```json
  "android": {
    "config": {
      "googleMobileAdsAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
    }
  },
  "ios": {
    "config": {
      "googleMobileAdsAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
    }
  }
  ```

**Usage in Code**:
- `services/ads.ts`: Used for ad management
- `components/BannerAd.tsx`: Used for displaying banner ads

**Testing Without Key**:
- The app will use mock ads if no key is provided
- Suitable for development and testing

## Backend API URL (for production)

**Purpose**: Connect to backend API for serverless functions

**Where to Configure**:
- Add to `.env` file:
  ```
  EXPO_PUBLIC_API_URL=https://your-backend-url.com/api
  ```

**Usage in Code**:
- `services/api.ts`: Used for API calls

**Local Development**:
- For local development, the app will use built-in API routes
- No configuration needed for local testing

## Environment Files for Different Environments

For different environments, create separate environment files:

1. `.env.development` - Development environment
2. `.env.staging` - Staging environment
3. `.env.production` - Production environment

## Security Considerations

1. **Never commit API keys to version control**:
   - Ensure `.env` files are in `.gitignore`
   - Use environment variables in CI/CD pipelines

2. **Use appropriate key restrictions**:
   - Set up API key restrictions in provider dashboards
   - Limit API key usage to specific domains/IPs

3. **Monitor API usage**:
   - Regularly check API usage and costs
   - Set up alerts for unusual activity

4. **Rotate keys periodically**:
   - Change API keys regularly for security
   - Update environment variables after rotation

## Troubleshooting

### OpenAI API Issues
- Check API key validity
- Verify rate limits and quotas
- Check for specific error messages in console

### OCR API Issues
- Verify API key is active
- Check image format and size
- Test with different images

### Supabase Issues
- Confirm URL and anon key are correct
- Check database migrations are applied
- Verify RLS policies are set up correctly

### AdMob Issues
- Ensure app ID is correctly configured
- Check ad unit IDs
- Verify app is properly set up in AdMob dashboard