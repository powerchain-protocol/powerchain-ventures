import * as Haptics from "expo-haptics";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type TextInputProps,
  type ViewProps,
} from "react-native";
import { usePowerChainTheme } from "@/theme/use-theme";

export function Screen({ children, style, ...props }: ViewProps) {
  const t = usePowerChainTheme();
  return <View {...props} style={[styles.screen, { backgroundColor: t.colors.background }, style]}>{children}</View>;
}

export function Card({ children, style, ...props }: ViewProps) {
  const t = usePowerChainTheme();
  return (
    <View
      {...props}
      style={[
        styles.card,
        { backgroundColor: t.colors.surface, borderColor: t.colors.border },
        Platform.OS === "ios" ? styles.cardShadow : styles.cardElevation,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function PText({ children, muted = false, style }: { children: React.ReactNode; muted?: boolean; style?: any }) {
  const t = usePowerChainTheme();
  return <Text style={[{ color: muted ? t.colors.textMuted : t.colors.text }, style]}>{children}</Text>;
}

export function Button({
  title,
  variant = "primary",
  loading = false,
  disabled,
  haptic = true,
  onPress,
  ...props
}: {
  title: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  disabled?: boolean;
  haptic?: boolean;
  onPress?: PressableProps["onPress"];
} & Omit<PressableProps, "children">) {
  const t = usePowerChainTheme();
  const primary = variant === "primary";
  const danger = variant === "danger";
  const background = primary ? t.colors.green : danger ? t.colors.danger : t.colors.surface;
  const border = primary ? t.colors.green : danger ? t.colors.danger : variant === "ghost" ? "transparent" : t.colors.border;
  const text = primary || danger ? "#FFFFFF" : variant === "secondary" ? t.colors.text : t.colors.green;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled || loading), busy: loading }}
      disabled={disabled || loading}
      onPress={(event) => {
        if (haptic) void Haptics.selectionAsync().catch(() => undefined);
        onPress?.(event);
      }}
      {...props}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed && primary ? t.colors.greenPressed : background,
          borderColor: border,
          opacity: disabled ? 0.5 : pressed ? 0.86 : 1,
        },
        typeof props.style === "function" ? props.style({ pressed }) : props.style,
      ]}
    >
      {loading ? <ActivityIndicator color={text} /> : <Text style={[styles.buttonText, { color: text }]}>{title}</Text>}
    </Pressable>
  );
}

export function Field({ label, hint, error, ...props }: TextInputProps & { label?: string; hint?: string; error?: string }) {
  const t = usePowerChainTheme();
  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={[styles.fieldLabel, { color: t.colors.text }]}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={t.colors.textMuted}
        {...props}
        accessibilityLabel={props.accessibilityLabel ?? label ?? props.placeholder}
        style={[
          styles.field,
          { color: t.colors.text, backgroundColor: t.colors.surface, borderColor: error ? t.colors.danger : t.colors.border },
          props.style,
        ]}
      />
      {error ? <Text style={[styles.fieldHint, { color: t.colors.danger }]}>{error}</Text> : hint ? <Text style={[styles.fieldHint, { color: t.colors.textMuted }]}>{hint}</Text> : null}
    </View>
  );
}

export function Badge({ label, tone = "green" }: { label: string; tone?: "green" | "muted" | "danger" | "warning" }) {
  const t = usePowerChainTheme();
  const bg = tone === "green" ? t.colors.greenSoft : tone === "danger" ? t.colors.dangerSoft : tone === "warning" ? t.colors.warningSoft : t.colors.surfaceMuted;
  const color = tone === "green" ? t.colors.green : tone === "danger" ? t.colors.danger : tone === "warning" ? t.colors.warning : t.colors.textMuted;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={{ fontSize: 11, fontWeight: "800", color }}>{label}</Text>
    </View>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const t = usePowerChainTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: t.colors.text }]}>{title}</Text>
      {action ? <Pressable accessibilityRole="button" hitSlop={12} onPress={onAction}><Text style={[styles.sectionAction, { color: t.colors.green }]}>{action}</Text></Pressable> : null}
    </View>
  );
}

export function Notice({ title, body, tone = "info" }: { title: string; body?: string; tone?: "info" | "success" | "warning" | "danger" }) {
  const t = usePowerChainTheme();
  const bg = tone === "success" ? t.colors.greenSoft : tone === "warning" ? t.colors.warningSoft : tone === "danger" ? t.colors.dangerSoft : t.colors.surfaceMuted;
  const accent = tone === "danger" ? t.colors.danger : tone === "warning" ? t.colors.warning : t.colors.green;
  return (
    <View accessibilityRole="summary" style={[styles.notice, { backgroundColor: bg, borderColor: t.colors.border }]}> 
      <View style={[styles.noticeDot, { backgroundColor: accent }]} />
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={[styles.noticeTitle, { color: t.colors.text }]}>{title}</Text>
        {body ? <Text style={[styles.noticeBody, { color: t.colors.textMuted }]}>{body}</Text> : null}
      </View>
    </View>
  );
}

export function EmptyState({ title, body, action, onAction }: { title: string; body: string; action?: string; onAction?: () => void }) {
  const t = usePowerChainTheme();
  return (
    <Card style={styles.empty}>
      <View style={[styles.emptyMark, { backgroundColor: t.colors.greenSoft }]}><Text style={{ color: t.colors.green, fontSize: 22, fontWeight: "900" }}>P</Text></View>
      <Text style={[styles.emptyTitle, { color: t.colors.text }]}>{title}</Text>
      <Text style={[styles.emptyBody, { color: t.colors.textMuted }]}>{body}</Text>
      {action ? <Button title={action} variant="secondary" onPress={onAction} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  card: { borderWidth: 1, borderRadius: 20, padding: 16 },
  cardShadow: { shadowColor: "#07120D", shadowOpacity: 0.045, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
  cardElevation: { elevation: 1 },
  button: { minHeight: 52, borderWidth: 1, borderRadius: 14, alignItems: "center", justifyContent: "center", paddingHorizontal: 18 },
  buttonText: { fontWeight: "800", fontSize: 15 },
  fieldWrap: { gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: "800" },
  field: { minHeight: 52, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, fontSize: 15 },
  fieldHint: { fontSize: 11, lineHeight: 16, paddingHorizontal: 2 },
  badge: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 34 },
  sectionTitle: { fontSize: 20, fontWeight: "900", letterSpacing: -0.35 },
  sectionAction: { fontSize: 13, fontWeight: "800" },
  notice: { borderWidth: 1, borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "flex-start", gap: 10 },
  noticeDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  noticeTitle: { fontSize: 13, fontWeight: "900" },
  noticeBody: { fontSize: 12, lineHeight: 18 },
  empty: { alignItems: "center", gap: 10, paddingVertical: 26 },
  emptyMark: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 17, fontWeight: "900", textAlign: "center" },
  emptyBody: { fontSize: 13, lineHeight: 19, textAlign: "center", maxWidth: 300 },
});
