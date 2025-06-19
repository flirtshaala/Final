import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: {
    background: string;
    surface: string;
    surfaceSecondary: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    cardBackground: string;
    inputBackground: string;
  };
}

const lightColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSecondary: '#F7FAFC',
  primary: '#FF6B7A',
  secondary: '#9B59B6',
  text: '#2D3748',
  textSecondary: '#718096',
  border: '#E2E8F0',
  error: '#F56565',
  success: '#10B981',
  cardBackground: '#FFFFFF',
  inputBackground: '#FFFFFF',
};

// Improved dark mode colors with better contrast and readability
const darkColors = {
  background: '#0F0F23', // Deep purple-blue background
  surface: '#1A1B3A', // Lighter purple surface
  surfaceSecondary: '#252659', // Even lighter purple for cards
  primary: '#FF6B7A',
  secondary: '#B794F6', // Lighter purple for better visibility
  text: '#FFFFFF', // Pure white for maximum contrast
  textSecondary: '#CBD5E0', // Light gray for secondary text
  border: '#4A5568',
  error: '#F56565',
  success: '#68D391',
  cardBackground: '#252659', // Purple-tinted cards
  inputBackground: '#2D3748', // Darker input backgrounds
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      if (Platform.OS === 'web') {
        const saved = localStorage.getItem('flirtshaala_dark_mode');
        if (saved !== null) {
          setIsDarkMode(JSON.parse(saved));
        }
      } else {
        const saved = await AsyncStorage.getItem('flirtshaala_dark_mode');
        if (saved !== null) {
          setIsDarkMode(JSON.parse(saved));
        }
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('flirtshaala_dark_mode', JSON.stringify(newMode));
      } else {
        await AsyncStorage.setItem('flirtshaala_dark_mode', JSON.stringify(newMode));
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      colors,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}