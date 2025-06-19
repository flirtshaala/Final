const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure resolver to use mocks for web platform
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add platform-specific module resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Configure extraNodeModules to mock native-only modules for web
config.resolver.extraNodeModules = {
  // Mock react-native-google-mobile-ads for web builds
  'react-native-google-mobile-ads': path.resolve(__dirname, 'mocks/react-native-google-mobile-ads.js'),
};

// Add platform extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

module.exports = config;