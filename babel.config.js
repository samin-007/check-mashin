module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
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
};
