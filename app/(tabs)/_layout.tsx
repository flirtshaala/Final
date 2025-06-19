import { Tabs } from 'expo-router';
import { User, Camera, MessageCircle, Clock } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { colors, isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
          ...Platform.select({
            web: {
              boxShadow: isDarkMode 
                ? '0px -4px 8px rgba(255, 255, 255, 0.05)' 
                : '0px -4px 8px rgba(0, 0, 0, 0.1)',
            },
            default: {
              elevation: 8,
              shadowColor: isDarkMode ? '#FFFFFF' : '#000000',
              shadowOffset: {
                width: 0,
                height: -4,
              },
              shadowOpacity: isDarkMode ? 0.05 : 0.1,
              shadowRadius: 8,
            },
          }),
        },
        tabBarActiveTintColor: '#FF6B7A',
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Poppins-SemiBold',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="screenshot"
        options={{
          title: 'Screenshot',
          tabBarIcon: ({ size, color }) => (
            <Camera size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ size, color }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}