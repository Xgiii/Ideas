// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add any custom configuration here
config.resolver.assetExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
