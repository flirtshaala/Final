module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
    'react-native-reanimated/plugin',
    ...(process.env.NODE_ENV === 'production' ? [] : ['react-native-web']),
  ],
};