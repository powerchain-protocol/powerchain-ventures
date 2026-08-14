const { getDefaultConfig } = require("expo/metro-config");

// Expo SDK 52+ detects pnpm/npm/yarn/bun monorepos automatically.
// Keep this config minimal so Metro can use Expo's supported workspace resolver.
module.exports = getDefaultConfig(__dirname);
