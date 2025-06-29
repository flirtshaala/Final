const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './index.web.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native-vector-icons': path.resolve(__dirname, 'src/components/MockIcons'),
      'react-native-google-mobile-ads': path.resolve(__dirname, 'src/mocks/mockAds'),
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/mocks/mockStorage'),
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules\/(?!(react-native-image-picker|react-native-document-picker|react-native-fs|react-native-keychain|react-native-permissions|react-native-device-info|@react-native-camera-roll\/camera-roll|@react-native-community\/netinfo|@react-native-google-signin\/google-signin|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|react-native-splash-screen|react-native-svg|react-native-vector-icons))/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              'babel-plugin-react-native-web',
              [
                'module-resolver',
                {
                  alias: {
                    '@': './src',
                  },
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/',
          },
        },
      },
      {
        test: /\.ttf$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    historyApiFallback: true,
    hot: true,
    open: false,
  },
};