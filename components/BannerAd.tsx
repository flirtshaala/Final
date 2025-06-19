import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function BannerAdComponent() {
  // Web fallback - show a placeholder instead of actual ads
  return (
    <View style={styles.webPlaceholder}>
      <Text style={styles.webPlaceholderText}>Ad Space</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webPlaceholder: {
    height: 50,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  webPlaceholderText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
});