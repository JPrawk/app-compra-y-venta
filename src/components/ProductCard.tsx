import { Category, describeProduct, Product } from "@/data/mock";
import { FontSize, Radius, Spacing, useTheme } from "@/theme";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBadge } from "./StatusBadge";

type Props = { product: Product; category: Category; onPress?: () => void };

export function ProductCard({ product, category, onPress }: Props) {
  const c = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.card,
        { backgroundColor: c.surface, borderColor: c.border },
        product.status === "sold" && { opacity: 0.5 },
      ]}
    >
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.code, { color: c.textMuted }]}>
          {product.code}
        </Text>
        <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={{ color: c.textMuted, fontSize: 12 }} numberOfLines={1}>
          {describeProduct(product, category)}
        </Text>
        <Text style={[styles.price, { color: c.primary }]}>
          Bs {product.price}
        </Text>
        <StatusBadge status={product.status} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  image: { width: "100%", aspectRatio: 4 / 5 },
  info: { padding: Spacing.sm, gap: 2 },
  code: { fontSize: 12, fontWeight: "600" },
  name: { fontSize: FontSize.md, fontWeight: "600" },
  price: { fontSize: FontSize.md, fontWeight: "700", marginBottom: Spacing.xs },
});
