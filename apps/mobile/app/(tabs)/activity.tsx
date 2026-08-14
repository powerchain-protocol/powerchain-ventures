import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Page } from "@/components/page";
import { Badge, EmptyState, Notice, Card } from "@/components/ui";
import { useWallet } from "@/context/wallet-context";
import { api } from "@/lib/api";
import type { TransactionReceipt } from "@/types";
import { usePowerChainTheme } from "@/theme/use-theme";

export default function Activity() {
  const { wallet } = useWallet();
  const [rows, setRows] = useState<TransactionReceipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = usePowerChainTheme();

  const load = useCallback(async () => {
    if (!wallet) { setRows([]); return; }
    setLoading(true); setError("");
    try {
      const result = await api<{ transactions: TransactionReceipt[] }>(`/api/v1/transactions?wallet=${encodeURIComponent(wallet.address)}`);
      setRows(result.transactions ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load activity");
    } finally { setLoading(false); }
  }, [wallet]);

  useEffect(() => { void load(); }, [load]);

  return (
    <Page title="Activity" subtitle="Reviewed purchases, claims, transfers and creator operations." refreshing={loading} onRefresh={wallet ? load : undefined}>
      {!wallet ? <EmptyState title="No wallet selected" body="Add a wallet to view verified PowerChain activity." action="Open Wallet" onAction={() => router.push("/(tabs)/wallet")} /> : null}
      {error ? <Notice title="Activity unavailable" body={error} tone="danger" /> : null}
      {wallet && !loading && !error && rows.length === 0 ? <EmptyState title="No PowerChain activity yet" body="Purchases, claims and reviewed transfers for this wallet will appear here." /> : null}
      {rows.map((r) => (
        <Pressable
          key={r.id}
          accessibilityRole="button"
          accessibilityLabel={`Open ${r.kind} transaction`}
          onPress={() => router.push({ pathname: "/transactions/[reviewId]", params: { reviewId: r.id } })}
          style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
        >
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={{ color: t.colors.text, fontWeight: "900", textTransform: "capitalize" }}>{r.kind.replaceAll("-", " ")}</Text>
                <Text style={{ color: t.colors.textMuted, fontSize: 11 }}>{r.signature ? `${r.signature.slice(0, 7)}…${r.signature.slice(-6)}` : "Prepared"}</Text>
              </View>
              <Badge label={r.settlementStage} tone={r.settlementStage === "settled" ? "green" : r.settlementStage === "failed" ? "danger" : "muted"} />
            </View>
          </Card>
        </Pressable>
      ))}
    </Page>
  );
}
