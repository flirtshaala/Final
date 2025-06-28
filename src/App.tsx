import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';

// Navigation
import MainTabNavigator from './navigation/MainTabNavigator';
import AuthNavigator from './navigation/AuthNavigator';

// Screens
import SplashScreenComponent from './screens/SplashScreen';
import PremiumScreen from './screens/PremiumScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditProfileScreen from './screens/EditProfileScreen';

// Services
import { initializeServices } from './services/initialization';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeServices();
      } catch (error) {
        console.error('Failed to initialize services:', error);
      } finally {
        if (Platform.OS !== 'web') {
          SplashScreen.hide();
        }
      }
    };

    initApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <UserProvider>
              <NavigationContainer>
                <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
                <Stack.Navigator
                  initialRouteName="Splash"
                  screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                    cardStyleInterpolator: ({ current, layouts }) => {
                      return {
                        cardStyle: {
                          transform: [
                            {
                              translateX: current.progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [layouts.screen.width, 0],
                              }),
                            },
                          ],
                        },
                      };
                    },
                  }}
                >
                  <Stack.Screen name="Splash" component={SplashScreenComponent} />
                  <Stack.Screen name="Auth" component={AuthNavigator} />
                  <Stack.Screen name="Main" component={MainTabNavigator} />
                  <Stack.Screen name="Premium" component={PremiumScreen} />
                  <Stack.Screen name="Settings" component={SettingsScreen} />
                  <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </UserProvider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;