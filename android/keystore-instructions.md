# Android Release Keystore Setup

## Generate Release Keystore

1. **Generate keystore file:**
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Enter the required information:**
   - Store password: (choose a strong password)
   - Key password: (choose a strong password)
   - First and last name: Your name or company name
   - Organizational unit: Your department/team
   - Organization: Your company name
   - City/Locality: Your city
   - State/Province: Your state
   - Country code: Your country (e.g., US, IN, etc.)

## Configure Gradle Properties

3. **Add to `android/gradle.properties`:**
```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your_store_password_here
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password_here
```

## Build Release APK

4. **Clean and build release:**
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

5. **Find your APK:**
The signed APK will be located at:
`android/app/build/outputs/apk/release/app-release.apk`

## Security Notes

- **NEVER commit keystore files to version control**
- **Keep keystore and passwords secure**
- **Backup your keystore file safely**
- **Use the same keystore for all app updates**

## For Google Play Store

- Upload the generated APK to Google Play Console
- Or use App Bundle format: `./gradlew bundleRelease`
- The AAB file will be at: `android/app/build/outputs/bundle/release/app-release.aab`