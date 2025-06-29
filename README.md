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