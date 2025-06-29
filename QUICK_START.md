# FlirtShaala - Quick Start Guide

## 🚀 Get Your App Running in 10 Minutes

### Step 1: Setup Environment (5 minutes)

#### Install Prerequisites
```bash
# Install Node.js 18+ from nodejs.org
# Install Android Studio from developer.android.com/studio

# Install React Native CLI
npm install -g react-native-cli
```

#### Setup Android SDK
1. Open Android Studio
2. Go to SDK Manager
3. Install Android 14 (API 34)
4. Add to PATH:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Step 2: Configure API Keys (2 minutes)

#### Create `.env` file:
```bash
cp .env.example .env
```

#### Add your API keys to `.env`:
```env
# Required for AI responses
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-openai-key-here

# Optional for screenshot OCR
EXPO_PUBLIC_OCR_API_KEY=your-ocr-space-key

# Optional for ads
EXPO_PUBLIC_ADMOB_APP_ID=ca-app-pub-your-admob-id
```

**Get API Keys**:
- OpenAI: https://platform.openai.com/api-keys
- OCR.space: https://ocr.space/ocrapi (free tier available)
- AdMob: https://admob.google.com/

### Step 3: Test Development Build (2 minutes)

#### Start Android Emulator
1. Open Android Studio
2. AVD Manager → Create Virtual Device
3. Choose Pixel 6 Pro + Android 14
4. Start emulator

#### Run App
```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on emulator (new terminal)
npm run android
```

### Step 4: Test Core Features (1 minute)

✅ **Chat Tab**: Enter "Hey, how are you?" → Generate Response
✅ **Screenshot Tab**: Upload image → Process Image  
✅ **History Tab**: View generated responses
✅ **Account Tab**: Sign in/out functionality

---

## 🏗️ Build Production APK

### Quick Production Build
```bash
# Generate release keystore (first time only)
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Add to android/gradle.properties:
echo "MYAPP_UPLOAD_STORE_FILE=my-release-key.keystore" >> android/gradle.properties
echo "MYAPP_UPLOAD_KEY_ALIAS=my-key-alias" >> android/gradle.properties
echo "MYAPP_UPLOAD_STORE_PASSWORD=your_password" >> android/gradle.properties
echo "MYAPP_UPLOAD_KEY_PASSWORD=your_password" >> android/gradle.properties

# Build production APK
npm run build:android
```

**APK Location**: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🚀 Deploy to Play Store

### 1. Create Play Console Account
- Go to: https://play.google.com/console
- Pay $25 registration fee
- Complete developer profile

### 2. Prepare Assets
- **App Icon**: 512x512 px PNG
- **Screenshots**: 2-8 phone screenshots
- **Feature Graphic**: 1024x500 px
- **Privacy Policy**: Required for Play Store

### 3. Upload App
1. Create new app in Play Console
2. Complete store listing
3. Upload AAB file (recommended):
```bash
cd android && ./gradlew bundleRelease
```
4. Submit for review

**Review Time**: 2-3 hours for new apps

---

## 🔧 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Clean everything
npm run clean
npm run clean:android
npm install
npm run android
```

#### Metro Bundler Issues
```bash
npx react-native start --reset-cache
```

#### Permission Errors
- Enable USB debugging on device
- Check device is connected: `adb devices`

#### API Not Working
- Verify API keys in `.env`
- Check internet connection
- Review API quotas/limits

### Get Help
- Check `TESTING_GUIDE.md` for detailed testing
- Check `PLAY_STORE_DEPLOYMENT.md` for deployment
- Create GitHub issue for bugs

---

## 📱 App Features

✅ **AI Response Generation** - OpenAI GPT-powered responses
✅ **Screenshot OCR** - Extract text from chat screenshots  
✅ **Multi-Style Responses** - Flirty, witty, savage tones
✅ **Response History** - Track generated responses
✅ **AdMob Integration** - Monetization ready
✅ **Native Performance** - Hermes engine enabled
✅ **Production Ready** - Signed APK for Play Store

---

**🎉 You're ready to go! Your AI wingman app is now running!**

Need help? Check the detailed guides or create an issue on GitHub.