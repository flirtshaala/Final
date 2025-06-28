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
    console.log('App initialized');
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