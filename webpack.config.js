const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          'react-native-vector-icons',
          'react-native-svg',
        ],
      },
    },
    argv
  );

  // Customize the config before returning it.
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-vector-icons': 'react-native-vector-icons/dist',
  };

  // Add fallbacks for Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: false,
    stream: false,
    buffer: false,
  };

  return config;
};