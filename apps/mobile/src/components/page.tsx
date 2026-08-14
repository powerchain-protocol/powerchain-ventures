import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePowerChainTheme } from "@/theme/use-theme";

export function Page({
  children,
  title,
  subtitle,
  scroll = true,
  refreshing = false,
  onRefresh,
}: {
  children: React.ReactNode;
  title?: string | undefined;
  subtitle?: string | undefined;
  scroll?: boolean | undefined;
  refreshing?: boolean | undefined;
  onRefresh?: (() => void | Promise<void>) | undefined;
}) {
  const t = usePowerChainTheme();
  const content = (
    <View style={styles.content}>
      {title ? <Text accessibilityRole="header" style={[styles.title, { color: t.colors.text }]}>{title}</Text> : null}
      {subtitle ? <Text style={[styles.subtitle, { color: t.colors.textMuted }]}>{subtitle}</Text> : null}
      {children}
    </View>
  );
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.colors.background }]} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={8}>
        {scroll ? (
          <ScrollView
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={() => { void onRefresh(); }} tintColor={t.colors.green} colors={[t.colors.green]} /> : undefined}
            contentContainerStyle={styles.scrollContent}
          >
            {content}
          </ScrollView>
        ) : content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { width: "100%", maxWidth: 720, alignSelf: "center", paddingHorizontal: 18, paddingTop: 12, gap: 14 },
  scrollContent: { paddingBottom: 128 },
  title: { fontSize: 28, lineHeight: 33, fontWeight: "900", letterSpacing: -0.7 },
  subtitle: { fontSize: 14, lineHeight: 21, marginTop: -8 },
});
