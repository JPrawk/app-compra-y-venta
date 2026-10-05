import { Radius, Spacing, useTheme } from "@/theme";
import { StyleSheet, Text, View } from "react-native";

type Tone = "success" | "warning" | "danger" | "primary" | "muted";

const STATUS: Record<string, { label: string; tone: Tone }> = {
  available: { label: "Disponible", tone: "success" },
  reserved: { label: "Reservada", tone: "warning" },
  sold: { label: "Vendida", tone: "muted" },
  confirmed: { label: "Venta confirmada", tone: "success" },
  cancelled: { label: "Cancelada", tone: "danger" },
  expired: { label: "Vencida", tone: "muted" },
};

export function StatusBadge({ status }: { status: string }) {
  const c = useTheme();
  const info = STATUS[status] ?? { label: status, tone: "muted" };
  const colors: Record<Tone, string> = {
    success: c.success,
    warning: c.warning,
    danger: c.danger,
    primary: c.primary,
    muted: c.textMuted,
  };
  const color = colors[info.tone];

  return (
    <View style={[styles.badge, { backgroundColor: color + "22" }]}>
      <Text style={[styles.text, { color }]}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  text: { fontSize: 12, fontWeight: "700" },
});
