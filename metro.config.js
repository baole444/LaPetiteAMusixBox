const path = require("path");
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const exclusionList = require('metro-config/src/defaults/exclusionList');
const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Exclude duplicate react-native modules
    blacklistRE: exclusionList([
      /node_modules\/.*\/node_modules\/react-native\/.*/, // Exclude nested react-native
    ]),
    // Add support for wasm and ttf extensions
    assetExts: [...defaultConfig.resolver.assetExts, "wasm"],
    sourceExts: [...defaultConfig.resolver.sourceExts],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  watchFolders: [
    path.resolve(__dirname), // project root
    path.resolve(__dirname, "../"), // parent folder
  ],
};

module.exports = mergeConfig(defaultConfig, config);