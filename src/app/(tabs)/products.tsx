import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/data/mock";
import { useStore } from "@/store/StoreContext";
import { Spacing, useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function ProductsScreen() {
  const c = useTheme();
  const { stores, products } = useStore();
  const [storeId, setStoreId] = useState(stores[0].id);

  const store = stores.find((s) => s.id === storeId) ?? stores[0];
  const items = products.filter((p) => p.storeId === store.id);
  const count = (status: Product["status"]) =>
    items.filter((p) => p.status === status).length;

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      {/* Selector de tienda */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.chips}
      >
        {stores.map((s) => {
          const active = s.id === store.id;
          return (
            <Pressable
              key={s.id}
              onPress={() => setStoreId(s.id)}
              style={[
                styles.chip,
                {
                  borderColor: active ? c.primary : c.border,
                  backgroundColor: active ? c.primary : c.surface,
                },
              ]}
            >
              <Ionicons
                name={s.icon}
                size={16}
                color={active ? "#fff" : c.text}
              />
              <Text
                style={{ color: active ? "#fff" : c.text, fontWeight: "600" }}
              >
                {s.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Resumen */}
      <View style={[styles.summary, { borderColor: c.border }]}>
        <Text style={{ color: c.success, fontWeight: "700" }}>
          {count("available")} disponibles
        </Text>
        <Text style={{ color: c.warning, fontWeight: "700" }}>
          {count("reserved")} reservados
        </Text>
        <Text style={{ color: c.textMuted, fontWeight: "700" }}>
          {count("sold")} vendidos
        </Text>
      </View>

      {/* Catálogo */}
      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{
          padding: Spacing.md,
          gap: Spacing.md,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => (
          <ProductCard product={item} category={store.category} />
        )}
        ListEmptyComponent={
          <Text
            style={{
              color: c.textMuted,
              textAlign: "center",
              marginTop: Spacing.xl,
            }}
          >
            Esta tienda aún no tiene productos. Toca + para agregar.
          </Text>
        }
      />

      {/* Botón flotante: agregar producto */}
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/product/new",
            params: { storeId: store.id },
          })
        }
        style={[styles.fab, { backgroundColor: c.primary }]}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { padding: Spacing.md, gap: Spacing.sm },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    bottom: Spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});
