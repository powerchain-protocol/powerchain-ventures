import { POWERCHAIN_COLORS, POWERCHAIN_MOBILE } from "./src/constants";
import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: POWERCHAIN_MOBILE.name,
  slug: POWERCHAIN_MOBILE.slug,
  version: POWERCHAIN_MOBILE.version,
  orientation: "portrait",
  scheme: process.env.EXPO_PUBLIC_APP_SCHEME || "powerchain",
  userInterfaceStyle: "light",
  icon: "./assets/app-icon.png",
  ios: {
    bundleIdentifier: process.env.IOS_BUNDLE_IDENTIFIER || POWERCHAIN_MOBILE.iosBundleIdentifier,
    supportsTablet: true,
    requireFullScreen: false,
    config: { usesNonExemptEncryption: false },
    infoPlist: {
      NSFaceIDUsageDescription: "Use Face ID to protect your PowerChain account session.",
      CFBundleDisplayName: "PowerChain",
    },
  },
  android: {
    package: process.env.ANDROID_PACKAGE_NAME || POWERCHAIN_MOBILE.androidPackageName,
    adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: POWERCHAIN_COLORS.lightBackground },
    predictiveBackGestureEnabled: true,
    intentFilters: [
      {
        action: "VIEW",
        category: ["BROWSABLE", "DEFAULT"],
        data: [{ scheme: process.env.EXPO_PUBLIC_APP_SCHEME || "powerchain" }],
      },
    ],
  },
  plugins: [
    ["expo-dev-client", { launchMode: "most-recent", addGeneratedScheme: true }],
    "expo-router",
    ["expo-secure-store", { configureAndroidBackup: true, faceIDPermission: "Use Face ID to protect your PowerChain account session." }],
    ["expo-splash-screen", { image: "./assets/splash-icon.png", imageWidth: 180, resizeMode: "contain", backgroundColor: POWERCHAIN_COLORS.lightBackground, dark: { backgroundColor: "#0B1210" } }],
  ],
  experiments: { typedRoutes: true },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    appUrl: process.env.EXPO_PUBLIC_WEB_URL,
    solanaCluster: process.env.EXPO_PUBLIC_SOLANA_CLUSTER || POWERCHAIN_MOBILE.defaultCluster,
    solanaRpcUrl: process.env.EXPO_PUBLIC_SOLANA_RPC_URL,
    eas: { projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || undefined },
  },
});
