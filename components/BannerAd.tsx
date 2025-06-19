import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';

export default function BannerAdComponent() {
  // For web and development, show a placeholder
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
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  webPlaceholderText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
});