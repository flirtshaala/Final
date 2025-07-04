import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  TextInput,
  Image,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { openaiService } from './services/openai';
import { ocrService } from './services/ocr';
import { adService } from './services/ads';
import { imagePickerService } from './services/imagePickerService';
import BannerAdComponent from './components/BannerAd';

// Only import splash screen on native platforms
let SplashScreen: any = null;
if (Platform.OS !== 'web') {
  try {
    SplashScreen = require('react-native-splash-screen').default;
  } catch (error) {
    console.warn('Splash screen not available on this platform');
  }
}

const Tab = createBottomTabNavigator();

// Chat Tab Component
function ChatScreen() {
  const [message, setMessage] = useState('');
  const [responseType, setResponseType] = useState<'flirty' | 'witty' | 'savage'>('flirty');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateResponse = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message first!');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Check if user needs to watch ad (only on mobile)
      if (Platform.OS !== 'web') {
        const shouldShowAd = Math.random() > 0.7; // 30% chance to show ad
        if (shouldShowAd) {
          const adWatched = await adService.showRewardedAd();
          if (!adWatched) {
            Alert.alert('Ad Required', 'Please watch the ad to get your response.');
            setLoading(false);
            return;
          }
        }
      }

      // Generate response using OpenAI
      const response = await openaiService.generateFlirtyResponse(message.trim(), responseType);
      
      Alert.alert('Generated Response', response, [
        {
          text: 'Copy',
          onPress: () => {
            // Copy to clipboard logic would go here
            Alert.alert('Copied!', 'Response copied to clipboard');
          }
        },
        { 
          text: 'Retry', 
          onPress: () => handleGenerateResponse(),
          style: 'default'
        },
        { text: 'OK' }
      ]);
      
      setMessage('');
    } catch (error: any) {
      console.error('Generate response error:', error);
      setError(error.message || 'Failed to generate response');
      
      Alert.alert(
        'Error', 
        error.message || 'Failed to generate response. Please try again.',
        [
          { text: 'Retry', onPress: () => handleGenerateResponse() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>FlirtShaala Chat</Text>
        <Text style={styles.subtitle}>Generate perfect responses with AI</Text>
        
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => setError(null)}
            >
              <Text style={styles.retryButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Response Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Response Style</Text>
          <View style={styles.typeButtons}>
            {(['flirty', 'witty', 'savage'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  responseType === type && styles.typeButtonActive
                ]}
                onPress={() => setResponseType(type)}
              >
                <Text style={[
                  styles.typeButtonText,
                  responseType === type && styles.typeButtonTextActive
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Message Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Message</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter the message you want to respond to..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, loading && styles.generateButtonDisabled]}
          onPress={handleGenerateResponse}
          disabled={loading || !message.trim()}
        >
          <Text style={styles.generateButtonText}>
            {loading ? 'Generating...' : `Generate ${responseType.charAt(0).toUpperCase() + responseType.slice(1)} Response`}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>1. Enter the message you want to respond to</Text>
          <Text style={styles.infoText}>2. Choose your response style (flirty, witty, savage)</Text>
          <Text style={styles.infoText}>3. Get AI-generated perfect replies!</Text>
          {Platform.OS !== 'web' && (
            <Text style={styles.infoText}>4. Watch ads to unlock unlimited responses</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Screenshot Tab Component
function ScreenshotScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImagePicker = async () => {
    try {
      setError(null);
      
      if (Platform.OS === 'android') {
        const hasPermissions = await requestPermissions();
        if (!hasPermissions) {
          Alert.alert('Permissions Required', 'Please grant camera and storage permissions to use this feature.');
          return;
        }
      }

      const result = await imagePickerService.showImagePickerOptions();
      if (result) {
        setSelectedImage(result.uri);
      }
    } catch (error: any) {
      console.error('Image picker error:', error);
      setError('Failed to select image. Please try again.');
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'android') return true;
    
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      
      return (
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleProcessImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if user needs to watch ad (only on mobile)
      if (Platform.OS !== 'web') {
        const shouldShowAd = Math.random() > 0.7; // 30% chance to show ad
        if (shouldShowAd) {
          const adWatched = await adService.showRewardedAd();
          if (!adWatched) {
            Alert.alert('Ad Required', 'Please watch the ad to process your image.');
            setLoading(false);
            return;
          }
        }
      }

      // Extract text from image
      const extractedText = await ocrService.extractTextFromImage(selectedImage);
      
      if (!extractedText.trim()) {
        Alert.alert('No Text Found', 'Could not extract text from the image. Please try a clearer screenshot.');
        setLoading(false);
        return;
      }

      // Generate response
      const response = await openaiService.generateFlirtyResponse(extractedText, 'flirty');
      
      Alert.alert(
        'Extracted Text & Response',
        `Original: "${extractedText}"\n\nSuggested Reply: "${response}"`,
        [
          {
            text: 'Copy Reply',
            onPress: () => {
              Alert.alert('Copied!', 'Response copied to clipboard');
            }
          },
          { 
            text: 'Retry', 
            onPress: () => handleProcessImage(),
            style: 'default'
          },
          { text: 'OK' }
        ]
      );
    } catch (error: any) {
      console.error('Process image error:', error);
      setError(error.message || 'Failed to process image');
      
      Alert.alert(
        'Error', 
        error.message || 'Failed to process image. Please try again.',
        [
          { text: 'Retry', onPress: () => handleProcessImage() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Screenshot Analysis</Text>
        <Text style={styles.subtitle}>Upload screenshots for AI analysis</Text>
        
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => setError(null)}
            >
              <Text style={styles.retryButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {selectedImage ? (
          <View style={styles.imagePreview}>
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.previewImage}
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={[styles.processButton, loading && styles.processButtonDisabled]} 
              onPress={handleProcessImage}
              disabled={loading}
            >
              <Text style={styles.processButtonText}>
                {loading ? 'Processing...' : 'Process Image'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.changeImageButton} onPress={handleImagePicker}>
              <Text style={styles.changeImageText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadArea}>
            <Text style={styles.uploadIcon}>📱</Text>
            <Text style={styles.uploadText}>
              {Platform.OS === 'web' ? 'Tap to upload image' : 'Tap to upload screenshot'}
            </Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
              <Text style={styles.buttonText}>Choose Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// History Tab Component
function HistoryScreen() {
  const mockHistory = [
    {
      id: '1',
      response: "Hey there! 😊 That's such a sweet message!",
      originalText: "Hey, how are you?",
      type: 'flirty',
      timestamp: Date.now() - 3600000,
    },
    {
      id: '2',
      response: "Well, well, well... someone's got game! 😏",
      originalText: "Want to hang out?",
      type: 'witty',
      timestamp: Date.now() - 7200000,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Response History</Text>
        <Text style={styles.subtitle}>Your generated responses</Text>
        
        {mockHistory.length > 0 ? (
          mockHistory.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyType}>{item.type}</Text>
                <Text style={styles.historyTime}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              <Text style={styles.historyOriginal}>"{item.originalText}"</Text>
              <Text style={styles.historyResponse}>{item.response}</Text>
              <View style={styles.historyActions}>
                <TouchableOpacity 
                  style={styles.historyActionButton}
                  onPress={() => Alert.alert('Copied!', 'Response copied to clipboard')}
                >
                  <Text style={styles.historyActionText}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.historyActionButton}
                  onPress={() => Alert.alert('Shared!', 'Response shared successfully')}
                >
                  <Text style={styles.historyActionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No responses yet</Text>
            <Text style={styles.emptySubtext}>Generate your first response to see it here</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Account Tab Component
function AccountScreen() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleAuth = () => {
    if (isSignedIn) {
      setIsSignedIn(false);
      Alert.alert('Signed Out', 'You have been signed out successfully');
    } else {
      setIsSignedIn(true);
      Alert.alert('Signed In', 'Welcome to FlirtShaala!');
    }
  };

  const handlePremium = () => {
    Alert.alert('Premium', 'Premium subscription features coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Manage your profile</Text>
        
        <View style={styles.accountCard}>
          <Text style={styles.accountIcon}>👤</Text>
          <Text style={styles.accountText}>
            {isSignedIn ? 'Welcome back!' : 'Guest User'}
          </Text>
          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.buttonText}>
              {isSignedIn ? 'Sign Out' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {isSignedIn && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Today's Usage</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Responses</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>45</Text>
                <Text style={styles.statLabel}>Remaining</Text>
              </View>
            </View>
          </View>
        )}
        
        <TouchableOpacity style={styles.premiumCard} onPress={handlePremium}>
          <Text style={styles.premiumIcon}>👑</Text>
          <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          <Text style={styles.premiumSubtitle}>
            Unlimited responses • {Platform.OS !== 'web' ? 'Ad-free • ' : ''}Priority support
          </Text>
        </TouchableOpacity>

        <View style={styles.platformInfo}>
          <Text style={styles.platformText}>
            Platform: {Platform.OS === 'web' ? 'Web' : 'Mobile'}
          </Text>
          {Platform.OS === 'web' && (
            <Text style={styles.platformNote}>
              Web version has unlimited responses and no ads!
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  useEffect(() => {
    // Hide splash screen after app loads (only on native)
    if (SplashScreen) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);
    }

    // Initialize ads service (only on native)
    if (Platform.OS !== 'web') {
      adService.initialize().catch(console.error);
    }
  }, []);

  return (
    <NavigationContainer>
      <View style={styles.appContainer}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = '';

              switch (route.name) {
                case 'Account':
                  iconName = 'person';
                  break;
                case 'Screenshot':
                  iconName = 'camera-alt';
                  break;
                case 'Chat':
                  iconName = 'chat';
                  break;
                case 'History':
                  iconName = 'history';
                  break;
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#FF6B7A',
            tabBarInactiveTintColor: '#718096',
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
          })}
        >
          <Tab.Screen name="Account" component={AccountScreen} />
          <Tab.Screen name="Screenshot" component={ScreenshotScreen} />
          <Tab.Screen name="Chat" component={ChatScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
        </Tab.Navigator>
        {/* Only show banner ads on native platforms */}
        {Platform.OS !== 'web' && <BannerAdComponent />}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 30,
  },
  errorCard: {
    backgroundColor: '#FED7D7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FC8181',
  },
  errorText: {
    color: '#C53030',
    fontSize: 14,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#FF6B7A',
    borderColor: '#FF6B7A',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  generateButton: {
    backgroundColor: '#FF6B7A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#9B59B6',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 6,
    lineHeight: 20,
  },
  uploadArea: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginTop: 20,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#9B59B6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  imagePreview: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  processButton: {
    backgroundColor: '#FF6B7A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  processButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  processButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  changeImageButton: {
    backgroundColor: '#9B59B6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  changeImageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B7A',
    textTransform: 'uppercase',
  },
  historyTime: {
    fontSize: 12,
    color: '#718096',
  },
  historyOriginal: {
    fontSize: 14,
    color: '#718096',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  historyResponse: {
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 12,
  },
  historyActions: {
    flexDirection: 'row',
    gap: 12,
  },
  historyActionButton: {
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  historyActionText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  accountIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  accountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  authButton: {
    backgroundColor: '#FF6B7A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B7A',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  premiumCard: {
    backgroundColor: '#FFF5F5',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 20,
  },
  premiumIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  platformInfo: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  platformText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '600',
  },
  platformNote: {
    fontSize: 12,
    color: '#38A169',
    marginTop: 4,
    textAlign: 'center',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
    height: 70,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default App;