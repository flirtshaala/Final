const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    alias: {
      '@': './src',
    },
    platforms: ['ios', 'android', 'native', 'web'],
  },
  transformer: {
    inlineRequires: false,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);