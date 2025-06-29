# FlirtShaala - Production Build Guide

## 🚀 Production APK Generation

This guide will help you build a production-ready APK for your FlirtShaala React Native app.

### Prerequisites

- **Java Development Kit (JDK) 11 or higher**
- **Android SDK** (API level 34)
- **Node.js 18+**
- **React Native CLI**

### Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Generate a release keystore (first time only):**
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

3. **Configure signing (add to `android/gradle.properties`):**
```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your_store_password_here
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password_here
```

4. **Build release APK:**
```bash
npm run build:android
```

5. **Find your APK:**
The signed APK will be located at:
`android/app/build/outputs/apk/release/app-release.apk`

### Available Build Commands

```bash
# Development builds
npm run android              # Run on connected device/emulator
npm start                   # Start Metro bundler

# Production builds
npm run build:android       # Generate release APK
npm run build:android-debug # Generate debug APK for testing

# Cleaning
npm run clean              # Clean all platforms
npm run clean:android      # Clean Android build cache
```

### Build Features

✅ **Hermes Engine Enabled** - Faster startup and smaller bundle size
✅ **ProGuard/R8 Enabled** - Code obfuscation and size optimization
✅ **Multi-architecture Support** - ARM64, ARMv7, x86, x86_64
✅ **Production Optimizations** - Minified code, removed debug symbols
✅ **Proper Signing Configuration** - Ready for Google Play Store

### File Structure

```
android/
├── gradlew                    # Gradle wrapper (Unix)
├── gradlew.bat               # Gradle wrapper (Windows)
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── app/
│   ├── build.gradle          # App-level build configuration
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/flirtshaala/
│       └── res/
└── gradle.properties         # Project-wide Gradle settings
```

### Production Checklist

- [ ] API keys configured in `.env`
- [ ] Release keystore generated and configured
- [ ] App icons and splash screen updated
- [ ] Version code and name updated in `build.gradle`
- [ ] Permissions reviewed in `AndroidManifest.xml`
- [ ] ProGuard rules tested
- [ ] APK tested on multiple devices

### Troubleshooting

**Build fails with "Gradle not found":**
- Use the included Gradle wrapper: `./gradlew` instead of `gradle`

**Keystore errors:**
- Ensure keystore file exists in `android/app/`
- Check that passwords in `gradle.properties` are correct

**Out of memory errors:**
- Increase heap size in `gradle.properties`: `org.gradle.jvmargs=-Xmx4096m`

**APK too large:**
- Enable APK splitting in `build.gradle`
- Use App Bundle format: `./gradlew bundleRelease`

### Google Play Store Deployment

1. **Generate App Bundle (recommended):**
```bash
cd android && ./gradlew bundleRelease
```

2. **Upload to Google Play Console:**
- Use the `.aab` file from `android/app/build/outputs/bundle/release/`
- App bundles are smaller and optimized for each device

3. **Release Management:**
- Test with internal testing first
- Use staged rollouts for production releases
- Monitor crash reports and user feedback

### Security Notes

⚠️ **NEVER commit keystore files to version control**
⚠️ **Keep keystore and passwords secure and backed up**
⚠️ **Use the same keystore for all app updates**

---

**FlirtShaala** - Ready for production! 🚀