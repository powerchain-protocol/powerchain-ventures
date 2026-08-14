import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Page } from "@/components/page";
import { Card, Badge, EmptyState, Notice } from "@/components/ui";
import { PwrcCoin } from "@/components/brand";
import { useSales } from "@/hooks/use-sales";
import { usePowerChainTheme } from "@/theme/use-theme";

export default function Sales() {
  const { sales, loading, error, refresh } = useSales();
  const t = usePowerChainTheme();
  return (
    <Page title="Launches" subtitle="Verified PowerChain token sales on Solana." refreshing={loading && sales.length > 0} onRefresh={refresh}>
      {loading && sales.length === 0 ? <ActivityIndicator accessibilityLabel="Loading launches" color={t.colors.green} /> : null}
      {error ? <Notice title="Launches unavailable" body={error} tone="danger" /> : null}
      {!loading && !error && sales.length === 0 ? <EmptyState title="No active launches" body="Upcoming and active PowerChain token sales will appear here." action="Refresh" onAction={refresh} /> : null}
      {sales.map((s) => (
        <Pressable
          key={s.id}
          accessibilityRole="button"
          accessibilityLabel={`Open ${s.name}`}
          onPress={() => router.push({ pathname: "/sales/[saleId]", params: { saleId: s.id } })}
          style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
        >
          <Card style={{ gap: 12 }}>
            <View style={styles.head}>
              <PwrcCoin size={48} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: t.colors.text }]}>{s.name}</Text>
                <Text style={{ color: t.colors.textMuted }}>{s.symbol} • Token-2022</Text>
              </View>
              <Badge label={s.phase} />
            </View>
            <View style={styles.metrics}>
              <Metric label="Price" value={`$${(Number(s.price_usd_micros) / 1_000_000).toFixed(4)}`} />
              <Metric label="Allocation" value={s.allocation_base_units} />
            </View>
          </Card>
        </Pressable>
      ))}
    </Page>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  const t = usePowerChainTheme();
  return <View style={{ flex: 1 }}><Text style={{ color: t.colors.textMuted, fontSize: 11 }}>{label}</Text><Text numberOfLines={1} style={{ color: t.colors.text, fontSize: 15, fontWeight: "900" }}>{value}</Text></View>;
}
const styles = StyleSheet.create({ head: { flexDirection: "row", alignItems: "center", gap: 12 }, title: { fontSize: 17, fontWeight: "900" }, metrics: { flexDirection: "row", gap: 20 } });
