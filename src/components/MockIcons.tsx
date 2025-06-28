import React from 'react';
import { Text } from 'react-native';

// Mock icon component for web compatibility
const Icon = ({ name, size = 24, color = '#000', ...props }: any) => {
  const iconMap: { [key: string]: string } = {
    'person': '👤',
    'camera-alt': '📷',
    'chat': '💬',
    'history': '📝',
    'home': '🏠',
    'settings': '⚙️',
    'search': '🔍',
    'favorite': '❤️',
    'star': '⭐',
    'menu': '☰',
    'close': '✕',
    'check': '✓',
    'arrow-back': '←',
    'arrow-forward': '→',
    'add': '+',
    'remove': '-',
  };

  return (
    <Text style={{ fontSize: size, color }} {...props}>
      {iconMap[name] || '📱'}
    </Text>
  );
};

export default Icon;