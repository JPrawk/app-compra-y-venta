import { FontSize, Radius, Spacing, useTheme } from "@/theme";
import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const c = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.avatar, { backgroundColor: c.primary }]}>
        <Text style={styles.avatarText}>JP</Text>
      </View>
      <Text style={[styles.name, { color: c.text }]}>Juan Pablo</Text>
      <Text style={[styles.email, { color: c.textMuted }]}>
        juan@correo.com
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        <Row label="Teléfono" value="+591 700 00000" />
        <Row label="Ciudad" value="La Paz" />
        <Row label="Miembro desde" value="Octubre 2026" last />
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  const c = useTheme();
  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: c.border },
      ]}
    >
      <Text style={{ color: c.textMuted }}>{label}</Text>
      <Text style={{ color: c.text, fontWeight: "600" }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: Spacing.lg },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  avatarText: { color: "#fff", fontSize: FontSize.xl, fontWeight: "700" },
  name: { fontSize: FontSize.lg, fontWeight: "700", marginTop: Spacing.md },
  email: { fontSize: FontSize.md, marginTop: Spacing.xs },
  card: {
    width: "100%",
    marginTop: Spacing.xl,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
  },
});
