import { FontSize, Radius, Spacing, useTheme } from "@/theme";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  loading?: boolean;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  loading,
}: Props) {
  const c = useTheme();
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary ? c.primary : "transparent",
          borderColor: c.primary,
          opacity: pressed || loading ? 0.7 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#fff" : c.primary} />
      ) : (
        <Text style={[styles.text, { color: isPrimary ? "#fff" : c.primary }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: "center",
  },
  text: { fontSize: FontSize.md, fontWeight: "600" },
});
