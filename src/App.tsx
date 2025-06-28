import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Mock components for cross-platform compatibility
const BannerAdComponent = () => {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.adContainer}>
        <View style={styles.webAdPlaceholder}>
          <Text style={styles.webAdText}>Ad Space (Web)</Text>
        </View>
      </View>
    );
  }
  
  // For native platforms, show placeholder
  return (
    <View style={styles.adContainer}>
      <View style={styles.nativeAdPlaceholder}>
        <Text style={styles.nativeAdText}>AdMob Banner</Text>
      </View>
    </View>
  );
};

const Tab = createBottomTabNavigator();

// Chat Tab Component
function ChatScreen() {
  const handleOCR = () => {
    Alert.alert('OCR', 'OCR functionality will be implemented here');
  };

  const handleChatGPT = () => {
    Alert.alert('ChatGPT', 'ChatGPT functionality will be implemented here');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>FlirtShaala Chat</Text>
        <Text style={styles.subtitle}>Generate perfect responses with AI</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleOCR}>
          <Text style={styles.buttonText}>📷 OCR Screenshot</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleChatGPT}>
          <Text style={styles.buttonText}>🤖 Generate Response</Text>
        </TouchableOpacity>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>1. Upload a chat screenshot or enter text</Text>
          <Text style={styles.infoText}>2. Choose your response style (flirty, witty, savage)</Text>
          <Text style={styles.infoText}>3. Get AI-generated perfect replies!</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Screenshot Tab Component
function ScreenshotScreen() {
  const handleUpload = () => {
    Alert.alert('Upload', 'Image picker will be implemented here');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Screenshot Analysis</Text>
        <Text style={styles.subtitle}>Upload screenshots for AI analysis</Text>
        
        <View style={styles.uploadArea}>
          <Text style={styles.uploadIcon}>📱</Text>
          <Text style={styles.uploadText}>Tap to upload screenshot</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// History Tab Component
function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Response History</Text>
        <Text style={styles.subtitle}>Your generated responses</Text>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>No responses yet</Text>
          <Text style={styles.emptySubtext}>Generate your first response to see it here</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Account Tab Component
function AccountScreen() {
  const handleLogin = () => {
    Alert.alert('Login', 'Authentication will be implemented here');
  };

  const handlePremium = () => {
    Alert.alert('Premium', 'Subscription features coming soon');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Manage your profile</Text>
        
        <View style={styles.accountCard}>
          <Text style={styles.accountIcon}>👤</Text>
          <Text style={styles.accountText}>Guest User</Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.premiumCard} onPress={handlePremium}>
          <Text style={styles.premiumIcon}>👑</Text>
          <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          <Text style={styles.premiumSubtitle}>Unlimited responses • Ad-free • Priority support</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  useEffect(() => {
    console.log('🚀 FlirtShaala App initialized');
    console.log('📱 Platform:', Platform.OS);
    console.log('🌐 Running in:', Platform.OS === 'web' ? 'Browser' : 'Native App');
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
        <BannerAdComponent />
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
    paddingTop: Platform.OS === 'web' ? 40 : 60,
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
  button: {
    backgroundColor: '#9B59B6',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#FF6B7A',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  uploadButton: {
    backgroundColor: '#9B59B6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  loginButton: {
    backgroundColor: '#FF6B7A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  premiumCard: {
    backgroundColor: '#FFF5F5',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
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
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    height: Platform.OS === 'ios' ? 90 : 70,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  adContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  webAdPlaceholder: {
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  webAdText: {
    color: '#718096',
    fontSize: 12,
    fontWeight: '500',
  },
  nativeAdPlaceholder: {
    backgroundColor: '#FF6B7A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  nativeAdText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default App;