# FlirtShaala - AI-Powered Chat Response Generator

FlirtShaala is a cross-platform mobile application that helps users craft perfect responses for their dating chats and conversations using AI technology.

## 🚀 Features

- **AI-Powered Responses**: Generate flirty, witty, or savage responses using OpenAI GPT
- **Screenshot Analysis**: Upload chat screenshots and get AI-generated replies
- **Multi-Platform**: Runs on Android, iOS, and Web
- **Smart Language Detection**: Supports English, Hindi, Hinglish, and Marathi
- **Response History**: Track and manage your generated responses
- **Ad-Free Web Experience**: No ads on web version
- **Premium Features**: Unlimited responses and ad-free mobile experience

## 📱 Platforms

### ✅ Web (Bolt Preview Ready)
- Runs in browser with React Native Web
- No ads, full functionality
- File upload for screenshot analysis
- Real-time AI response generation

### ✅ Android
- Native Android app with Hermes engine
- AdMob integration for monetization
- Camera and gallery access for screenshots
- Full offline capability

### ✅ iOS
- Native iOS app with optimized performance
- AdMob integration
- Camera and photo library access
- iOS-specific UI adaptations

## 🛠️ Tech Stack

- **Framework**: React Native 0.73.6
- **Navigation**: React Navigation 6
- **AI Service**: OpenAI GPT-3.5-turbo
- **OCR**: OCR.space API
- **Database**: Supabase (optional)
- **Ads**: Google AdMob (mobile only)
- **Web**: React Native Web + Webpack
- **State Management**: React Context + Hooks

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)

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

### 3. Platform-Specific Setup

#### Web Development
```bash
npm run web
# Opens on http://localhost:3000
```

#### Android Development
```bash
# Clean and build
npm run clean:android
npm run android
```

#### iOS Development
```bash
# Install iOS dependencies
cd ios && pod install && cd ..
npm run ios
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

- **AdMob App ID**: For mobile ads (Android/iOS only)
  - Get from: https://admob.google.com/
  - Add to: `EXPO_PUBLIC_ADMOB_APP_ID`

- **Supabase**: For user authentication and data sync
  - Get from: https://app.supabase.io/
  - Add to: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 🚀 Deployment

### Web Deployment
```bash
npm run build:web
# Deploy dist/ folder to Netlify, Vercel, or any static hosting
```

### Android Release
```bash
npm run build:android
# Generates APK/AAB in android/app/build/outputs/
```

### iOS Release
```bash
npm run build:ios
# Generates archive for App Store submission
```

## 🎯 Key Features by Platform

| Feature | Web | Android | iOS |
|---------|-----|---------|-----|
| AI Chat Responses | ✅ | ✅ | ✅ |
| Screenshot Analysis | ✅ | ✅ | ✅ |
| Response History | ✅ | ✅ | ✅ |
| User Authentication | ✅ | ✅ | ✅ |
| AdMob Ads | ❌ | ✅ | ✅ |
| Camera Access | ❌ | ✅ | ✅ |
| File Upload | ✅ | ✅ | ✅ |
| Offline Mode | ❌ | ✅ | ✅ |

## 🔒 Privacy & Security

- No user data stored without consent
- API keys secured in environment variables
- Optional user authentication via Supabase
- Local storage for guest users
- HTTPS-only API communications

## 🐛 Troubleshooting

### Common Issues

1. **Web build fails**: Check babel and webpack configurations
2. **Android build fails**: Clean project and rebuild
3. **iOS build fails**: Update pods and check Xcode settings
4. **API errors**: Verify API keys in .env file
5. **AdMob issues**: Ensure proper app ID configuration

### Debug Commands
```bash
# Clean all platforms
npm run clean

# Reset Metro cache
npx react-native start --reset-cache

# Check React Native info
npx react-native info
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**FlirtShaala** - Your AI wingman for perfect responses! 💕