import { Button } from "@/components/Button";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore } from "@/store/StoreContext";
import { FontSize, Radius, Spacing, useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ComponentProps } from "react";
import {
    Image,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

function formatTime(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export default function LiveScreen() {
  const c = useTheme();
  const { stores, products, orders, now, confirm, cancel } = useStore();

  const findProduct = (id: string) => products.find((p) => p.id === id);
  const findStore = (id?: string) => stores.find((s) => s.id === id);

  const active = orders.filter((o) => o.status === "reserved");
  const confirmed = orders.filter((o) => o.status === "confirmed");
  const total = confirmed.reduce(
    (sum, o) => sum + (findProduct(o.productId)?.price ?? 0),
    0,
  );
  const history = orders.filter((o) => o.status !== "reserved").slice(0, 5);

  const openWhatsApp = (phone: string, client: string, product: string) => {
    const text = encodeURIComponent(
      `Hola ${client}, te escribo por tu reserva de "${product}". ¿Coordinamos el pago?`,
    );
    Linking.openURL(`https://wa.me/${phone}?text=${text}`);
  };

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.container}
    >
      {/* Encabezado */}
      <View style={[styles.hero, { backgroundColor: c.primary }]}>
        <View style={styles.liveChip}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>EN VIVO</Text>
        </View>
        <Text style={styles.heroTitle}>Hola, Juan Pablo 👋</Text>
        <Text style={styles.heroSubtitle}>
          {stores.length} tiendas ·{" "}
          {products.filter((p) => p.status === "available").length} productos
          disponibles
        </Text>
      </View>

      {/* Indicadores */}
      <View style={styles.stats}>
        <Stat label="Reservas" value={active.length} color={c.warning} />
        <Stat label="Ventas" value={confirmed.length} color={c.success} />
        <Stat label="Total Bs" value={total} color={c.primary} />
      </View>

      {/* Reservas activas */}
      <Text style={[styles.section, { color: c.text }]}>Reservas activas</Text>
      {active.length === 0 ? (
        <View style={[styles.empty, { borderColor: c.border }]}>
          <Ionicons name="time-outline" size={32} color={c.textMuted} />
          <Text style={{ color: c.textMuted, textAlign: "center" }}>
            Aún no hay reservas. Abre la vista del cliente y reserva un
            producto.
          </Text>
        </View>
      ) : (
        active.map((o) => {
          const p = findProduct(o.productId);
          const store = findStore(p?.storeId);
          const left = o.expiresAt - now;
          const urgent = left < 30_000;
          const timerColor = urgent ? c.danger : c.warning;

          return (
            <View
              key={o.id}
              style={[
                styles.card,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
              <View style={styles.row}>
                {p && <Image source={{ uri: p.image }} style={styles.thumb} />}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: c.text, fontWeight: "700" }}>
                    {p?.name}
                  </Text>
                  <Text style={{ color: c.textMuted, fontSize: 12 }}>
                    {p?.code} · {store?.name}
                  </Text>
                  <Text style={{ color: c.primary, fontWeight: "700" }}>
                    Bs {p?.price}
                  </Text>
                </View>
                <View
                  style={[styles.timer, { backgroundColor: timerColor + "22" }]}
                >
                  <Ionicons name="time" size={14} color={timerColor} />
                  <Text style={{ color: timerColor, fontWeight: "700" }}>
                    {formatTime(left)}
                  </Text>
                </View>
              </View>

              <Text style={{ color: c.text, marginTop: Spacing.sm }}>
                👤 {o.clientName} · +{o.clientPhone}
              </Text>

              <View style={styles.actions}>
                <ActionButton
                  icon="logo-whatsapp"
                  label="WhatsApp"
                  color="#25D366"
                  onPress={() =>
                    openWhatsApp(o.clientPhone, o.clientName, p?.name ?? "")
                  }
                />
                <ActionButton
                  icon="checkmark-circle"
                  label="Confirmar"
                  color={c.success}
                  onPress={() => confirm(o.id)}
                />
                <ActionButton
                  icon="close-circle"
                  label="Cancelar"
                  color={c.danger}
                  onPress={() => cancel(o.id)}
                />
              </View>
            </View>
          );
        })
      )}

      {/* Últimos movimientos */}
      {history.length > 0 && (
        <>
          <Text style={[styles.section, { color: c.text }]}>
            Últimos movimientos
          </Text>
          {history.map((o) => (
            <View
              key={o.id}
              style={[styles.historyRow, { borderColor: c.border }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: c.text, fontWeight: "600" }}>
                  {findProduct(o.productId)?.name}
                </Text>
                <Text style={{ color: c.textMuted, fontSize: 12 }}>
                  {o.clientName}
                </Text>
              </View>
              <StatusBadge status={o.status} />
            </View>
          ))}
        </>
      )}

      <View style={{ marginTop: Spacing.lg }}>
        <Button
          title="🛍️ Ver tiendas (vista del cliente)"
          variant="outline"
          onPress={() => router.push("/tiendas")}
        />
      </View>
    </ScrollView>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const c = useTheme();
  return (
    <View
      style={[
        styles.stat,
        { backgroundColor: c.surface, borderColor: c.border },
      ]}
    >
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={{ color: c.textMuted, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

type IconName = ComponentProps<typeof Ionicons>["name"];

function ActionButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: IconName;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        { borderColor: color, opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <Ionicons name={icon} size={18} color={color} />
      <Text style={{ color, fontWeight: "600", fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.md, paddingBottom: 40 },
  hero: { padding: Spacing.lg, borderRadius: Radius.lg },
  liveChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444" },
  liveText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  heroTitle: {
    color: "#fff",
    fontSize: FontSize.xl,
    fontWeight: "700",
    marginTop: Spacing.sm,
  },
  heroSubtitle: { color: "rgba(255,255,255,0.85)", marginTop: Spacing.xs },
  stats: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.md },
  stat: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  statValue: { fontSize: FontSize.xl, fontWeight: "700" },
  section: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  empty: {
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: Radius.lg,
  },
  card: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  thumb: { width: 56, height: 70, borderRadius: Radius.sm },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  actions: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.md },
  action: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
});
