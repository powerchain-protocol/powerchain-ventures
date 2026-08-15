import { Image, StyleSheet, Text, View } from "react-native";
import { usePowerChainTheme } from "@/theme/use-theme";

export function Brand({ compact = false }: { compact?: boolean }) {
  const theme = usePowerChainTheme();
  const size = compact ? 34 : 44;

  return (
    <View style={styles.row} accessibilityLabel="PowerChain Launchpad">
      <Image
        source={require("../../assets/logo-dark.png")}
        style={[
          styles.mark,
          { width: size, height: size },
          theme.scheme === "dark" ? styles.lightMark : null,
        ]}
        resizeMode="contain"
      />
      {!compact && (
        <View>
          <Text style={[styles.name, { color: theme.colors.text }]}>PowerChain</Text>
          <Text style={[styles.sub, { color: theme.colors.textMuted }]}>LAUNCHPAD™</Text>
        </View>
      )}
    </View>
  );
}

export function PwrcCoin({ size = 52 }: { size?: number }) {
  return (
    <Image
      source={require("../../assets/pwrc.png")}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  mark: { flexShrink: 0 },
  lightMark: { tintColor: "#F7F8F8" },
  name: { fontSize: 18, fontWeight: "900", letterSpacing: -0.4 },
  sub: { fontSize: 10, fontWeight: "800", letterSpacing: 1.8, marginTop: 2 },
});
