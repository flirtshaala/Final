# FlirtShaala - Testing Guide

## 🧪 Testing Your Android App

### Prerequisites
- Android Studio installed
- Android device or emulator
- USB debugging enabled (for physical device)

### 1. Setup Development Environment

#### Install Android Studio
1. Download from: https://developer.android.com/studio
2. Install Android SDK (API level 34)
3. Set environment variables:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### Setup React Native CLI
```bash
npm install -g react-native-cli
```

### 2. Test on Android Emulator

#### Create Virtual Device
1. Open Android Studio
2. Go to Tools → AVD Manager
3. Create Virtual Device
4. Choose Pixel 6 Pro (recommended)
5. Download Android 14 (API 34) system image
6. Start the emulator

#### Run Development Build
```bash
# Start Metro bundler
npm start

# In another terminal, run on emulator
npm run android
```

### 3. Test on Physical Device

#### Enable Developer Options
1. Go to Settings → About Phone
2. Tap "Build Number" 7 times
3. Go back to Settings → Developer Options
4. Enable "USB Debugging"

#### Connect Device
```bash
# Check if device is connected
adb devices

# Run on connected device
npm run android
```

### 4. Test Core Features

#### ✅ AI Response Generation
1. Open Chat tab
2. Enter a message: "Hey, how are you?"
3. Select response type (flirty/witty/savage)
4. Tap "Generate Response"
5. Verify AI response appears

#### ✅ Screenshot Analysis
1. Open Screenshot tab
2. Tap "Choose Image"
3. Select from Gallery or take photo
4. Tap "Process Image"
5. Verify OCR text extraction and AI response

#### ✅ Permissions Testing
1. Test camera permission request
2. Test storage permission request
3. Verify permissions work correctly

#### ✅ AdMob Integration
1. Verify banner ads appear at bottom
2. Test rewarded ads (may show after responses)
3. Check ad loading and display

### 5. Debug Build Testing

#### Generate Debug APK
```bash
npm run build:android-debug
```

#### Install Debug APK
```bash
# Find the APK
ls android/app/build/outputs/apk/debug/

# Install on device
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### 6. Performance Testing

#### Check App Performance
1. Monitor memory usage in Android Studio
2. Test app startup time
3. Check for memory leaks
4. Test on different Android versions

#### Test Network Conditions
1. Test with slow internet
2. Test offline functionality
3. Test API error handling

### 7. Release Build Testing

#### Generate Release APK
```bash
npm run build:android
```

#### Test Release APK
```bash
# Install release APK
adb install android/app/build/outputs/apk/release/app-release.apk
```

### 8. Common Issues & Solutions

#### Metro Bundler Issues
```bash
# Clear cache
npx react-native start --reset-cache

# Clean project
npm run clean
```

#### Build Failures
```bash
# Clean Android build
npm run clean:android

# Rebuild
npm run android
```

#### Permission Issues
- Ensure all permissions are declared in AndroidManifest.xml
- Test permission requests on Android 6.0+ devices

### 9. Testing Checklist

- [ ] App launches successfully
- [ ] All tabs navigate correctly
- [ ] AI response generation works
- [ ] Screenshot upload and OCR works
- [ ] Camera and gallery access works
- [ ] Ads display correctly
- [ ] App handles network errors gracefully
- [ ] App works on different screen sizes
- [ ] App performs well on low-end devices
- [ ] No crashes or ANRs (Application Not Responding)

### 10. Automated Testing (Optional)

#### Setup Jest Testing
```bash
npm test
```

#### Setup Detox E2E Testing
```bash
npm install -g detox-cli
detox build --configuration android.emu.debug
detox test --configuration android.emu.debug
```

---

**Ready for Play Store deployment once all tests pass!** ✅