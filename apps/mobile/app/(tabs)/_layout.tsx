import { Tabs } from "expo-router";
import { Platform, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePowerChainTheme } from "@/theme/use-theme";

const tabGlyphs: Record<string, string> = { index: "⌂", sales: "↗", wallet: "▣", activity: "◷", account: "○" };

export default function TabsLayout() {
  const t = usePowerChainTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: t.colors.green,
        tabBarInactiveTintColor: t.colors.textMuted,
        tabBarStyle: {
          backgroundColor: t.colors.surface,
          borderTopColor: t.colors.border,
          borderTopWidth: 1,
          height: 62 + Math.max(insets.bottom, Platform.OS === "ios" ? 10 : 8),
          paddingTop: 7,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarLabelStyle: { fontSize: 10, lineHeight: 13, fontWeight: "800" },
        tabBarIcon: ({ color, focused }) => (
          <Text accessibilityElementsHidden style={{ color, fontSize: focused ? 19 : 18, fontWeight: "900", lineHeight: 20 }}>{tabGlyphs[route.name] ?? "•"}</Text>
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="sales" options={{ title: "Launches" }} />
      <Tabs.Screen name="wallet" options={{ title: "Wallet" }} />
      <Tabs.Screen name="activity" options={{ title: "Activity" }} />
      <Tabs.Screen name="account" options={{ title: "Account" }} />
    </Tabs>
  );
}
