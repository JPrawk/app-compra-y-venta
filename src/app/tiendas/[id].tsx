import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ProductCard } from "@/components/ProductCard";
import {
    describeProduct,
    PAYMENT_LABELS,
    Product,
    RESERVATION_MINUTES,
} from "@/data/mock";
import { useStore } from "@/store/StoreContext";
import { FontSize, Radius, Spacing, useTheme } from "@/theme";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Image,
    Linking,
    Modal,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function StoreCatalogScreen() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { stores, products, reserve } = useStore();
  const store = stores.find((s) => s.id === id);

  const [selected, setSelected] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!store) {
    return <Text style={{ padding: Spacing.lg }}>Tienda no encontrada</Text>;
  }

  const items = products.filter(
    (p) => p.storeId === store.id && p.status !== "sold",
  );

  const close = () => {
    setSelected(null);
    setError(null);
    setDone(false);
  };

  const handleReserve = () => {
    if (!selected) return;
    const digits = phone.replace(/\D/g, "");
    if (name.trim().length < 3) return setError("Ingresa tu nombre");
    if (digits.length < 8)
      return setError("Ingresa un número de WhatsApp válido");

    const fullPhone = digits.length === 8 ? `591${digits}` : digits;
    const err = reserve(selected.id, name.trim(), fullPhone);
    if (err) return setError(err);

    setError(null);
    setDone(true);
  };

  const contactStore = () => {
    const text = encodeURIComponent(
      `Hola ${store.name}, soy ${name} y reservé "${selected?.name}" (${selected?.code}). ¿Cómo realizo el pago?`,
    );
    Linking.openURL(`https://wa.me/${store.whatsapp}?text=${text}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: store.name,
          headerStyle: { backgroundColor: c.surface },
          headerTintColor: c.text,
        }}
      />
      <FlatList
        style={{ backgroundColor: c.background }}
        data={items}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: Spacing.md, gap: Spacing.md }}
        ListHeaderComponent={
          <Text style={{ color: c.textMuted, marginBottom: Spacing.sm }}>
            Toca un producto disponible para reservarlo.
          </Text>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            category={store.category}
            onPress={
              item.status === "available" ? () => setSelected(item) : undefined
            }
          />
        )}
      />

      {/* Ventana de reserva */}
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={close}
      >
        <View style={styles.backdrop}>
          <View style={[styles.sheet, { backgroundColor: c.surface }]}>
            {selected &&
              (done ? (
                <>
                  <Text style={[styles.title, { color: c.success }]}>
                    ✅ ¡Reservado!
                  </Text>
                  <Text style={{ color: c.text, marginBottom: Spacing.sm }}>
                    Tienes {RESERVATION_MINUTES} minutos para coordinar el pago
                    de{" "}
                    <Text style={{ fontWeight: "700" }}>{selected.name}</Text>{" "}
                    con {store.name}.
                  </Text>
                  <Text
                    style={{ color: c.textMuted, marginBottom: Spacing.md }}
                  >
                    Formas de pago:{" "}
                    {selected.paymentMethods
                      .map((m) => PAYMENT_LABELS[m])
                      .join(" · ")}
                  </Text>
                  <Button
                    title="💬 Escribir a la tienda por WhatsApp"
                    onPress={contactStore}
                  />
                  <View style={{ height: Spacing.sm }} />
                  <Button
                    title="Seguir viendo"
                    variant="outline"
                    onPress={close}
                  />
                </>
              ) : (
                <>
                  <View style={styles.productRow}>
                    <Image
                      source={{ uri: selected.image }}
                      style={styles.thumb}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.title, { color: c.text }]}>
                        {selected.name}
                      </Text>
                      <Text style={{ color: c.textMuted }}>
                        {describeProduct(selected, store.category)}
                      </Text>
                      <Text
                        style={{
                          color: c.primary,
                          fontWeight: "700",
                          fontSize: FontSize.lg,
                        }}
                      >
                        Bs {selected.price}
                      </Text>
                    </View>
                  </View>
                  {selected.description ? (
                    <Text style={{ color: c.text, marginBottom: Spacing.sm }}>
                      {selected.description}
                    </Text>
                  ) : null}
                  <Text
                    style={{ color: c.textMuted, marginBottom: Spacing.md }}
                  >
                    Pago:{" "}
                    {selected.paymentMethods
                      .map((m) => PAYMENT_LABELS[m])
                      .join(" · ")}
                  </Text>

                  <Input
                    label="Tu nombre"
                    placeholder="Nombre y apellido"
                    value={name}
                    onChangeText={setName}
                  />
                  <Input
                    label="Tu WhatsApp"
                    placeholder="71234567"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                  {error ? (
                    <Text style={{ color: c.danger, marginBottom: Spacing.sm }}>
                      {error}
                    </Text>
                  ) : null}

                  <Button title="Reservar" onPress={handleReserve} />
                  <View style={{ height: Spacing.sm }} />
                  <Button title="Cancelar" variant="outline" onPress={close} />
                </>
              ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    padding: Spacing.lg,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  productRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  thumb: { width: 80, height: 100, borderRadius: Radius.md },
  title: { fontSize: FontSize.lg, fontWeight: "700", marginBottom: Spacing.xs },
});
