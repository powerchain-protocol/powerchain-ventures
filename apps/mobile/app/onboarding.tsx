import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Button, Card } from "@/components/ui";
import { Brand, PwrcCoin } from "@/components/brand";
import { Page } from "@/components/page";
import { useOnboarding } from "@/context/onboarding-context";
import { usePowerChainTheme } from "@/theme/use-theme";

const slides = [
  { k: "launch", title: "Discover verified launches", body: "See sale timing, allocation, eligibility and Token-2022 details before you participate.", kind: "coin" },
  { k: "wallet", title: "Your wallet stays yours", body: "PowerChain never stores private keys or recovery phrases. You approve every sensitive transaction in your wallet.", kind: "wallet" },
  { k: "verify", title: "Review before you sign", body: "Recipients, fees and token delivery are verified before settlement is recorded.", kind: "verify" },
  { k: "ready", title: "Explore first. Connect later.", body: "Browse without an account. Sign in for creator tools and connect a wallet only when you want to participate.", kind: "ready" },
] as const;

export default function Onboarding() {
  const [i, setI] = useState(0);
  const { complete } = useOnboarding();
  const t = usePowerChainTheme();
  const s = slides[i]!;

  async function finish() {
    await complete();
    router.replace("/(tabs)");
  }
  async function next() {
    void Haptics.selectionAsync().catch(() => undefined);
    if (i < slides.length - 1) setI(i + 1);
    else await finish();
  }
  function back() {
    if (i > 0) {
      void Haptics.selectionAsync().catch(() => undefined);
      setI(i - 1);
    }
  }

  return (
    <Page>
      <View style={styles.top}>
        <Brand />
        <Pressable accessibilityRole="button" accessibilityLabel="Skip onboarding" hitSlop={12} onPress={finish}>
          <Text style={{ color: t.colors.textMuted, fontWeight: "800" }}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.progress} accessibilityLabel={`Onboarding step ${i + 1} of ${slides.length}`}>
        {slides.map((x, index) => <View key={x.k} style={[styles.progressBar, { backgroundColor: index <= i ? t.colors.green : t.colors.border }]} />)}
      </View>

      <Card style={[styles.visual, { backgroundColor: t.colors.surfaceMuted }]}>
        {s.kind === "coin" ? <PwrcCoin size={188} /> : <View style={[styles.glyph, { backgroundColor: t.colors.green }]}><Text style={styles.glyphText}>{s.kind === "wallet" ? "◇" : s.kind === "verify" ? "✓" : "P"}</Text></View>}
      </Card>

      <View style={{ gap: 9 }}>
        <Text accessibilityRole="header" style={[styles.title, { color: t.colors.text }]}>{s.title}</Text>
        <Text style={[styles.body, { color: t.colors.textMuted }]}>{s.body}</Text>
      </View>

      <View style={styles.actions}>
        {i > 0 ? <Button title="Back" variant="secondary" onPress={back} style={{ flex: 1 }} /> : null}
        <Button title={i === slides.length - 1 ? "Start exploring" : "Continue"} onPress={next} style={{ flex: i > 0 ? 1.4 : 1 }} />
      </View>
      <Button title="Sign in" variant="ghost" onPress={() => router.push("/(auth)/sign-in")} />
    </Page>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  progress: { flexDirection: "row", gap: 6, marginTop: 4 },
  progressBar: { height: 4, borderRadius: 999, flex: 1 },
  visual: { minHeight: 300, alignItems: "center", justifyContent: "center", marginTop: 8 },
  glyph: { width: 156, height: 156, borderRadius: 78, alignItems: "center", justifyContent: "center" },
  glyphText: { color: "white", fontSize: 78, fontWeight: "900" },
  title: { fontSize: 34, lineHeight: 39, fontWeight: "900", letterSpacing: -1.1 },
  body: { fontSize: 15, lineHeight: 23 },
  actions: { flexDirection: "row", gap: 10, marginTop: 4 },
});
