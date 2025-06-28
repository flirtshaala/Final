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
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

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
        <TouchableOpacity style={styles.button} onPress={handleOCR}>
          <Text style={styles.buttonText}>OCR Screenshot</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleChatGPT}>
          <Text style={styles.buttonText}>Generate Response</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Screenshot Tab Component
function ScreenshotScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Screenshot Analysis</Text>
        <Text style={styles.subtitle}>Upload screenshots for analysis</Text>
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
      </View>
    </SafeAreaView>
  );
}

// Account Tab Component
function AccountScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Manage your profile</Text>
      </View>
    </SafeAreaView>
  );
}

// Banner Ad Component
function BannerAdComponent() {
  return (
    <View style={styles.adContainer}>
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded');
        }}
        onAdFailedToLoad={error => {
          console.log('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
}

function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize Supabase auth listener here
    console.log('🚀 FlirtShaala App initialized');
    
    // Enhanced Hermes detection with detailed logging
    console.log('🔍 Checking JavaScript Engine Status...');
    console.log('=====================================');
    
    // Check for Hermes
    const hasHermesInternal = typeof global.HermesInternal !== 'undefined' && global.HermesInternal !== null;
    const hasHermesGlobal = typeof global.HermesInternal === 'object';
    
    console.log('global.HermesInternal exists:', hasHermesInternal);
    console.log('global.HermesInternal type:', typeof global.HermesInternal);
    console.log('global.HermesInternal value:', global.HermesInternal);
    
    // Additional Hermes checks
    if (hasHermesInternal) {
      console.log('✅ HERMES JS ENGINE IS ACTIVE!');
      console.log('🐛 New React Native debugger is available');
      console.log('📱 To debug: Press "j" in Metro terminal');
      console.log('🔧 Or open dev menu and select "Open Debugger"');
      
      // Log Hermes version if available
      try {
        if (global.HermesInternal && global.HermesInternal.getRuntimeProperties) {
          const runtimeProps = global.HermesInternal.getRuntimeProperties();
          console.log('🏷️  Hermes Runtime Properties:', runtimeProps);
        }
      } catch (e) {
        console.log('ℹ️  Hermes runtime properties not available');
      }
    } else {
      console.log('❌ HERMES IS NOT ACTIVE - Using JSC');
      console.log('⚠️  The new experimental debugger requires Hermes');
      console.log('🔧 Check android/gradle.properties: hermesEnabled=true');
      console.log('🧹 Try: npm run clean-build');
    }
    
    // Check for other debugging tools
    if (typeof global.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
      console.log('🛠️  React DevTools detected and available');
    }
    
    // Check for Flipper
    if (typeof global.__FLIPPER__ !== 'undefined') {
      console.log('🐬 Flipper detected and available');
    }
    
    // Platform and build info
    console.log('=====================================');
    console.log('📱 Platform:', Platform.OS);
    console.log('🏗️  Debug mode:', __DEV__);
    console.log('🔧 React Native version: 0.73.6');
    
    // Instructions for debugging
    if (hasHermesInternal && __DEV__) {
      console.log('=====================================');
      console.log('🎯 DEBUGGING INSTRUCTIONS:');
      console.log('1. Make sure Metro is running with: npm run dev-debug');
      console.log('2. Press "j" in Metro terminal to open debugger');
      console.log('3. Chrome DevTools will open with full debugging support');
      console.log('4. Set breakpoints, inspect variables, view network requests');
      console.log('=====================================');
    }
    
  }, []);

  return (
    <NavigationContainer>
      <View style={styles.appContainer}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#FF6B7A',
            tabBarInactiveTintColor: '#718096',
          }}>
          <Tab.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              tabBarLabel: 'Chat',
            }}
          />
          <Tab.Screen
            name="Screenshot"
            component={ScreenshotScreen}
            options={{
              tabBarLabel: 'Screenshot',
            }}
          />
          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{
              tabBarLabel: 'History',
            }}
          />
          <Tab.Screen
            name="Account"
            component={AccountScreen}
            options={{
              tabBarLabel: 'Account',
            }}
          />
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
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF6B7A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    height: Platform.OS === 'ios' ? 90 : 70,
  },
  adContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
});

export default App;