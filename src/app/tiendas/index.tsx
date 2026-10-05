import { useStore } from "@/store/StoreContext";
import { FontSize, Radius, Spacing, useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function StoresScreen() {
  const c = useTheme();
  const { stores, products } = useStore();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Tiendas",
          headerStyle: { backgroundColor: c.surface },
          headerTintColor: c.text,
        }}
      />
      <ScrollView
        style={{ backgroundColor: c.background }}
        contentContainerStyle={styles.container}
      >
        <Text style={[styles.title, { color: c.text }]}>
          Tiendas en vivo 🛍️
        </Text>
        <Text style={{ color: c.textMuted, marginBottom: Spacing.md }}>
          Reserva tu producto y coordina el pago directamente con la tienda.
        </Text>

        {stores.map((s) => {
          const available = products.filter(
            (p) => p.storeId === s.id && p.status === "available",
          ).length;
          return (
            <Pressable
              key={s.id}
              onPress={() =>
                router.push({ pathname: "/tiendas/[id]", params: { id: s.id } })
              }
              style={[
                styles.card,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
              <View
                style={[styles.iconBox, { backgroundColor: c.primary + "22" }]}
              >
                <Ionicons name={s.icon} size={28} color={c.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: c.text }]}>{s.name}</Text>
                <Text style={{ color: c.textMuted }} numberOfLines={1}>
                  {s.description}
                </Text>
                <Text
                  style={{ color: c.success, fontWeight: "600", marginTop: 2 }}
                >
                  {available} disponibles
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={c.textMuted} />
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, gap: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: "700" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: FontSize.lg, fontWeight: "700" },
});
