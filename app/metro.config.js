// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname, {
  // Enable DOM components support
  transformer: {
    unstable_allowRequireContext: true,
    domTransformer: {
      enabled: true,
    },
  },
});

// Add support for Reanimated
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs"];

module.exports = config;
