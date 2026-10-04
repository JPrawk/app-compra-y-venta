import { Button } from "@/components/Button";
import { Radius, Spacing, useTheme } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

export default function SettingsScreen() {
  const c = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        <View
          style={[
            styles.row,
            { borderBottomWidth: 1, borderBottomColor: c.border },
          ]}
        >
          <Text style={{ color: c.text }}>Notificaciones</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: c.primary }}
          />
        </View>
        <View style={styles.row}>
          <Text style={{ color: c.text }}>Ubicación</Text>
          <Switch
            value={location}
            onValueChange={setLocation}
            trackColor={{ true: c.primary }}
          />
        </View>
      </View>

      <View style={{ marginTop: Spacing.xl }}>
        <Button
          title="Cerrar sesión"
          variant="outline"
          onPress={() => router.replace("/login")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
});
