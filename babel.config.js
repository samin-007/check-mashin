module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@theme': './src/theme',
          '@navigation': './src/navigation',
          '@assets': './src/assets',
          '@utils': './src/utils',
          '@services': './src/services',
          '@hooks': './src/hooks',
        },
      },
    ],
  ],
};
