const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration for React Native with Web support
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      '@': './src',
    },
    platforms: ['ios', 'android', 'native', 'web'],
  },
  transformer: {
    // Disable inline requires for better compatibility
    inlineRequires: false,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);