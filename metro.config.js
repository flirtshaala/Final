const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration for React Native 0.73 with enhanced Hermes debugging support
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // Enable CORS for debugging
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        
        if (req.method === 'OPTIONS') {
          res.sendStatus(200);
        } else {
          return middleware(req, res, next);
        }
      };
    },
  },
  resolver: {
    // Enable source maps and debugging extensions
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
    alias: {
      '@': './src',
    },
  },
  transformer: {
    // Ensure source maps are generated for debugging
    minifierConfig: {
      keep_fnames: true,
      mangle: {
        keep_fnames: true,
      },
    },
    // Disable inline requires for better debugging
    inlineRequires: false,
    // Enable source maps for Hermes debugging
    hermesParser: true,
  },
  serializer: {
    // Create source maps for debugging
    createModuleIdFactory: function () {
      return function (path) {
        // Use relative paths for better source map support
        return path.replace(__dirname, '.');
      };
    },
    // Generate source maps for debugging
    getModulesRunBeforeMainModule: () => [
      require.resolve('react-native/Libraries/Core/InitializeCore'),
    ],
  },
  symbolicator: {
    // Enable symbolication for better stack traces
    customizeFrame: (frame) => {
      return frame;
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);