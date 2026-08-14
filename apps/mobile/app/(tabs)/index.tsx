import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Brand, PwrcCoin } from "@/components/brand";
import { Button, Card, Badge, SectionHeader } from "@/components/ui";
import { Page } from "@/components/page";
import { usePowerChainTheme } from "@/theme/use-theme";

const quick = [
  { label: "Launches", glyph: "↗", route: "/(tabs)/sales" },
  { label: "Wallet", glyph: "▣", route: "/(tabs)/wallet" },
  { label: "Claims", glyph: "↓", route: "/claims" },
  { label: "Activity", glyph: "◷", route: "/(tabs)/activity" },
] as const;

export default function Home() {
  const t = usePowerChainTheme();
  return (
    <Page>
      <Brand />
      <Card style={[styles.hero, { backgroundColor: t.colors.green, borderColor: t.colors.green }]}>
        <Text style={styles.eyebrow}>POWERCHAIN LAUNCHPAD™</Text>
        <Text style={styles.heroTitle}>Launch the future. Power the world.</Text>
        <Text style={styles.heroBody}>Discover verified Token-2022 sales, review every transaction and stay in control of your wallet.</Text>
        <Button title="Explore launches" variant="secondary" onPress={() => router.push("/(tabs)/sales")} />
      </Card>

      <SectionHeader title="Quick actions" />
      <View style={styles.quickGrid}>
        {quick.map((item) => (
          <Pressable key={item.label} accessibilityRole="button" accessibilityLabel={item.label} onPress={() => router.push(item.route)} style={({ pressed }) => [{ flex: 1, minWidth: "46%", opacity: pressed ? 0.86 : 1 }]}>
            <Card style={styles.quickCard}>
              <View style={[styles.quickIcon, { backgroundColor: t.colors.greenSoft }]}><Text style={{ color: t.colors.green, fontWeight: "900", fontSize: 20 }}>{item.glyph}</Text></View>
              <Text style={{ color: t.colors.text, fontWeight: "900" }}>{item.label}</Text>
            </Card>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}><Text style={[styles.h2, { color: t.colors.text }]}>Featured</Text><Badge label="Mainnet" /></View>
      <Card style={{ gap: 12 }}>
        <View style={styles.saleHead}>
          <PwrcCoin size={54} />
          <View style={{ flex: 1 }}><Text style={[styles.saleTitle, { color: t.colors.text }]}>PowerChain PWRC</Text><Text style={{ color: t.colors.textMuted, fontSize: 12 }}>Token-2022 • Solana</Text></View>
          <Badge label="Runtime config" tone="muted" />
        </View>
        <Text style={{ color: t.colors.textMuted, lineHeight: 20 }}>The native app reads the canonical sale catalog from the same PowerChain backend as the web Launchpad.</Text>
        <Button title="View launches" onPress={() => router.push("/(tabs)/sales")} />
      </Card>
    </Page>
  );
}
const styles = StyleSheet.create({ hero: { gap: 14, padding: 22 }, eyebrow: { color: "#BEE7D4", fontSize: 10, fontWeight: "900", letterSpacing: 2 }, heroTitle: { color: "white", fontSize: 34, lineHeight: 38, fontWeight: "900", letterSpacing: -1.2 }, heroBody: { color: "#DCF1E7", fontSize: 14, lineHeight: 21 }, quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 }, quickCard: { minHeight: 116, justifyContent: "space-between", gap: 16 }, quickIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" }, section: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }, h2: { fontSize: 20, fontWeight: "900" }, saleHead: { flexDirection: "row", gap: 12, alignItems: "center" }, saleTitle: { fontSize: 17, fontWeight: "900" } });
