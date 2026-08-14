import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Page } from "@/components/page";
import { Button, Card, Field, Notice, SectionHeader } from "@/components/ui";
import { PwrcCoin } from "@/components/brand";
import { useWallet } from "@/context/wallet-context";
import { api } from "@/lib/api";
import type { WalletSnapshot } from "@/types";
import { usePowerChainTheme } from "@/theme/use-theme";

export default function Wallet() {
  const { wallet, setWatchWallet, disconnect } = useWallet();
  const [input, setInput] = useState("");
  const [data, setData] = useState<WalletSnapshot | null>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const t = usePowerChainTheme();

  const load = useCallback(async () => {
    if (!wallet) { setData(null); return; }
    setLoading(true); setMsg("");
    try { setData(await api<WalletSnapshot>(`/api/v1/wallets/${wallet.address}`)); }
    catch (e) { setMsg(e instanceof Error ? e.message : "Unable to load wallet"); }
    finally { setLoading(false); }
  }, [wallet]);

  useEffect(() => { void load(); }, [load]);

  return (
    <Page title="Wallet" subtitle="Non-custodial wallet data and verified PowerChain activity." refreshing={loading} onRefresh={wallet ? load : undefined}>
      {!wallet ? (
        <Card style={{ gap: 12 }}>
          <Text style={{ fontWeight: "900", color: t.colors.text, fontSize: 17 }}>Add a wallet</Text>
          <Text style={{ color: t.colors.textMuted, lineHeight: 20 }}>Watch balances and activity without giving PowerChain custody. Native signing remains fail-closed until an approved wallet adapter is enabled.</Text>
          <Field label="Solana wallet" autoCapitalize="none" autoCorrect={false} placeholder="Wallet address" value={input} onChangeText={setInput} error={msg || undefined} />
          <Button title="Add wallet" onPress={async () => { try { await setWatchWallet(input); setMsg(""); } catch (e) { setMsg(e instanceof Error ? e.message : "Invalid wallet"); } }} />
        </Card>
      ) : (
        <>
          <Card style={[styles.balance, { backgroundColor: t.colors.green, borderColor: t.colors.green }]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.balanceLabel}>SOL balance</Text>
              {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
            </View>
            <Text adjustsFontSizeToFit numberOfLines={1} style={styles.balanceValue}>{data?.sol?.sol ?? "—"} SOL</Text>
            <Text style={styles.address}>{wallet.address.slice(0, 7)}…{wallet.address.slice(-6)}</Text>
          </Card>
          {msg ? <Notice title="Wallet data unavailable" body={msg} tone="danger" /> : null}
          <SectionHeader title="Assets" />
          <Card>
            <View style={styles.asset}>
              <PwrcCoin size={48} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "900", color: t.colors.text }}>PWRC</Text>
                <Text style={{ color: t.colors.textMuted, fontSize: 12 }}>PowerChain Token-2022</Text>
              </View>
              <Text numberOfLines={1} style={[styles.assetValue, { color: t.colors.text }]}>{data?.pwrc?.amount ?? "—"}</Text>
            </View>
          </Card>
          <Notice title="Non-custodial by design" body="PowerChain can read this public wallet address, but never receives your private key or recovery phrase." />
          <Button title="Disconnect wallet" variant="secondary" onPress={disconnect} />
        </>
      )}
    </Page>
  );
}
const styles = StyleSheet.create({ balance: { gap: 7, padding: 22 }, balanceLabel: { color: "#CDEADC", fontSize: 12, fontWeight: "800" }, balanceValue: { color: "white", fontSize: 32, lineHeight: 38, fontWeight: "900", letterSpacing: -0.8 }, address: { color: "#DBF1E5", fontSize: 12 }, asset: { flexDirection: "row", gap: 12, alignItems: "center" }, assetValue: { maxWidth: "40%", fontWeight: "900", textAlign: "right" } });
