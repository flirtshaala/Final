# FlirtShaala - Android APK Only

FlirtShaala is a native Android application that helps users craft perfect responses for their dating chats and conversations using AI technology.

## 🚀 Features

- **AI-Powered Responses**: Generate flirty, witty, or savage responses using OpenAI GPT
- **Screenshot Analysis**: Upload chat screenshots and get AI-generated replies
- **Native Android**: Pure React Native CLI implementation
- **Smart Language Detection**: Supports English, Hindi, Hinglish, and Marathi
- **Response History**: Track and manage your generated responses
- **AdMob Integration**: Monetization with banner, rewarded, and interstitial ads

## 📱 Android Only

This is a **pure Android APK application** built with React Native CLI. No web support, no Expo dependencies.

## 🛠️ Tech Stack

- **Framework**: React Native 0.73.6 (CLI)
- **Navigation**: React Navigation 6
- **AI Service**: OpenAI GPT-3.5-turbo
- **OCR**: OCR.space API
- **Ads**: Google AdMob
- **State Management**: React Context + Hooks

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio
- Java Development Kit (JDK) 11+

### 1. Clone & Install
```bash
git clone <repository-url>
cd flirtshaala
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Android Development
```bash
# Clean and build
npm run clean:android
npm run android
```

## 🔑 API Keys Required

### Essential (for core functionality)
- **OpenAI API Key**: For AI response generation
  - Get from: https://platform.openai.com/
  - Add to: `EXPO_PUBLIC_OPENAI_API_KEY`

### Optional (for enhanced features)
- **OCR.space API Key**: For screenshot text extraction
  - Get from: https://ocr.space/ocrapi
  - Add to: `EXPO_PUBLIC_OCR_API_KEY`

- **AdMob App ID**: For mobile ads
  - Get from: https://admob.google.com/
  - Add to: `EXPO_PUBLIC_ADMOB_APP_ID`

## 🚀 Build Commands

### Development:
```bash
npx react-native run-android
```

### Production APK:
```bash
npm run build:android
# APK location: android/app/build/outputs/apk/release/app-release.apk
```

### Clean Build:
```bash
npm run clean
npm run clean:android
```

## 🔧 Production Setup

### 1. Generate Release Keystore
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing in `android/gradle.properties`
```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your_password
MYAPP_UPLOAD_KEY_PASSWORD=your_password
```

### 3. Build Release APK
```bash
cd android && ./gradlew assembleRelease
```

## 🎯 Key Features

✅ **AI Chat Responses** - Generate perfect replies with OpenAI
✅ **Screenshot Analysis** - OCR text extraction and AI analysis
✅ **Response History** - Track generated responses
✅ **AdMob Ads** - Banner, rewarded, and interstitial ads
✅ **Camera Access** - Native image picker with camera/gallery
✅ **Offline Mode** - Works without internet for basic features
✅ **Native Performance** - Hermes engine enabled
✅ **Production Ready** - ProGuard/R8 optimization

## 🔒 Privacy & Security

- No user data stored without consent
- API keys secured in environment variables
- Local storage for guest users
- HTTPS-only API communications

## 📄 License

This project is licensed under the MIT License.

---

**FlirtShaala** - Your AI wingman for perfect responses! 💕

**Android APK Only - No Web Support**

---

## 🔧 Build & Deployment Guide

### 🌐 Web Build (Expo + Netlify/Vercel)

#### Prerequisites
- Node.js 18+ installed
- Expo CLI: `npm install -g @expo/cli`
- Git repository setup

#### 1. Environment Setup
```bash
# Clone and setup
git clone <your-repo-url>
cd flirtshaala
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys (OpenAI required, others optional)
```

#### 2. Local Web Development
```bash
# Start web development server
npm run web

# Open browser to http://localhost:19006
# Test all features: Chat, Screenshot, History, Account
```

#### 3. Build for Production
```bash
# Generate optimized web build
npm run build:web

# Output will be in: web-build/
# Ready for deployment to any static hosting
```

#### 4. Deploy to Netlify

**Option A: Drag & Drop (Easiest)**
1. Go to [netlify.com](https://netlify.com)
2. Drag `web-build/` folder to deploy area
3. Get instant live URL

**Option B: Git Integration (Recommended)**
1. Push code to GitHub/GitLab
2. Connect repository to Netlify
3. Build settings:
   - **Build command**: `npm run build:web`
   - **Publish directory**: `web-build`
   - **Node version**: 18
4. Add environment variables in Netlify dashboard
5. Deploy automatically on git push

#### 5. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project directory
vercel --prod

# Follow prompts:
# - Build command: npm run build:web
# - Output directory: web-build
# - Add environment variables when prompted
```

#### 6. Custom Domain (Optional)
- **Netlify**: Domain settings → Add custom domain
- **Vercel**: Project settings → Domains → Add domain
- Configure DNS records as instructed

---

### 📱 Android APK Build (React Native CLI)

#### Prerequisites
- **Java Development Kit (JDK) 11+**
- **Android Studio** with Android SDK (API 34)
- **Node.js 18+**
- **React Native CLI**: `npm install -g react-native-cli`

#### 1. Android Environment Setup

**Install Android Studio:**
1. Download from [developer.android.com/studio](https://developer.android.com/studio)
2. Install Android SDK (API level 34)
3. Create virtual device or connect physical device

**Set Environment Variables:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Reload shell
source ~/.bashrc  # or source ~/.zshrc
```

**Verify Setup:**
```bash
# Check Android SDK
adb --version

# Check connected devices
adb devices

# Run React Native doctor
npx react-native doctor
```

#### 2. Development Build & Testing
```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android (new terminal)
npm run android

# Test all features on device/emulator
```

#### 3. Generate Release Keystore (First Time Only)
```bash
# Navigate to Android app directory
cd android/app

# Generate release keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore flirtshaala-release.keystore \
  -alias flirtshaala-key \
  -keyalg RSA -keysize 2048 -validity 10000

# Enter required information:
# - Store password (remember this!)
# - Key password (remember this!)
# - Your name/organization details
```

**⚠️ CRITICAL: Backup your keystore file securely!**
- Store `flirtshaala-release.keystore` safely
- Save passwords in secure location
- Same keystore must be used for all app updates

#### 4. Configure Signing
```bash
# Add to android/gradle.properties
echo "MYAPP_UPLOAD_STORE_FILE=flirtshaala-release.keystore" >> android/gradle.properties
echo "MYAPP_UPLOAD_KEY_ALIAS=flirtshaala-key" >> android/gradle.properties
echo "MYAPP_UPLOAD_STORE_PASSWORD=your_store_password" >> android/gradle.properties
echo "MYAPP_UPLOAD_KEY_PASSWORD=your_key_password" >> android/gradle.properties
```

#### 5. Build Production APK
```bash
# Clean previous builds
npm run clean:android

# Build release APK
npm run build:android

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

#### 6. Test Release APK
```bash
# Install on connected device
adb install android/app/build/outputs/apk/release/app-release.apk

# Test thoroughly:
# - All features work
# - No crashes
# - Performance is good
# - Ads display correctly
```

#### 7. Build App Bundle (For Play Store)
```bash
# Generate AAB (recommended for Play Store)
cd android && ./gradlew bundleRelease

# AAB location: android/app/build/outputs/bundle/release/app-release.aab
```

---

### 🚀 Google Play Store Deployment

#### 1. Prepare Assets
- **App Icon**: 512x512 px (PNG, no transparency)
- **Screenshots**: 2-8 phone screenshots (1080x1920 px)
- **Feature Graphic**: 1024x500 px
- **Privacy Policy**: Required (host on your website)

#### 2. Play Console Setup
1. Create [Google Play Console](https://play.google.com/console) account ($25 fee)
2. Create new app
3. Complete store listing
4. Upload AAB file
5. Submit for review

#### 3. Release Process
- **Internal testing**: Immediate
- **Production review**: 2-3 hours
- **App goes live**: Within 24 hours

---

### 🔧 Build Commands Reference

```bash
# Development
npm start                    # Start Metro bundler
npm run android             # Run on Android device/emulator
npm run web                 # Start web development server

# Production Builds
npm run build:web           # Build optimized web version
npm run build:android       # Build release APK
npm run build:android-debug # Build debug APK for testing

# Maintenance
npm run clean               # Clean all build caches
npm run clean:android       # Clean Android build cache
```

---

### 🌍 Platform Features

| Feature | Web | Android |
|---------|-----|---------|
| AI Responses | ✅ | ✅ |
| Screenshot OCR | ✅ | ✅ |
| Image Upload | ✅ (File picker) | ✅ (Camera/Gallery) |
| AdMob Ads | ❌ | ✅ |
| Push Notifications | ❌ | ✅ (Future) |
| Offline Mode | ❌ | ✅ (Partial) |
| App Store Distribution | ❌ | ✅ |

---

### 🔑 Environment Variables

```env
# Required for AI responses
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-openai-key-here

# Optional for screenshot OCR
EXPO_PUBLIC_OCR_API_KEY=your-ocr-space-key

# Optional for Android ads
EXPO_PUBLIC_ADMOB_APP_ID=ca-app-pub-your-admob-id
EXPO_PUBLIC_ADMOB_BANNER_ANDROID=your-banner-ad-unit-id
EXPO_PUBLIC_ADMOB_REWARDED_ANDROID=your-rewarded-ad-unit-id
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID=your-interstitial-ad-unit-id

# Optional for user authentication
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

### 🐛 Troubleshooting

#### Web Build Issues
```bash
# Clear Expo cache
expo start --clear

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Android Build Issues
```bash
# Clean everything
npm run clean
npm run clean:android
cd android && ./gradlew clean

# Reset Metro cache
npx react-native start --reset-cache

# Check environment
npx react-native doctor
```

#### Common Errors
- **Gradle issues**: Ensure Java 11+ and Android SDK are properly installed
- **Metro bundler**: Clear cache with `--reset-cache` flag
- **Permission errors**: Enable USB debugging on Android device
- **API errors**: Verify API keys in `.env` file

---

### 📊 Deployment Checklist

#### Pre-Deployment
- [ ] All API keys configured
- [ ] Features tested on target platforms
- [ ] Error handling works properly
- [ ] Performance is acceptable
- [ ] Privacy policy created and hosted

#### Web Deployment
- [ ] Web build generates successfully
- [ ] All features work in production build
- [ ] Environment variables set in hosting platform
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate active

#### Android Deployment
- [ ] Release keystore generated and backed up
- [ ] Signed APK builds successfully
- [ ] App tested on multiple devices
- [ ] Play Store assets prepared
- [ ] Store listing completed
- [ ] App submitted for review

---

**🎉 Your FlirtShaala app is now ready for production deployment!**

**Live Demo**: [Web Version](https://your-netlify-url.netlify.app)  
**Download**: [Google Play Store](https://play.google.com/store/apps/details?id=com.flirtshaala)