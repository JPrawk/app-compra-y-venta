import { Button } from "@/components/Button";
import { FontSize, Radius, Spacing, useTheme } from "@/theme";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const c = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        <Text style={[styles.title, { color: c.text }]}>Mi App</Text>
        <Text style={[styles.subtitle, { color: c.textMuted }]}>
          Base de diseño lista 🚀
        </Text>

        <View style={{ marginTop: Spacing.lg }}>
          <Button title="Ir al login" onPress={() => router.push("/login")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: Spacing.lg },
  card: { padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1 },
  title: { fontSize: FontSize.xl, fontWeight: "700", marginBottom: Spacing.sm },
  subtitle: { fontSize: FontSize.md },
});
