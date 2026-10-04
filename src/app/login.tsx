import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { FontSize, Spacing, useTheme } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function LoginScreen() {
  const c = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    const newErrors: typeof errors = {};
    if (!email.includes("@")) newErrors.email = "Ingresa un correo válido";
    if (password.length < 6) newErrors.password = "Mínimo 6 caracteres";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Simulamos el login (luego lo conectaremos a un backend real)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/");
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: c.background }]}
    >
      <View>
        <Text style={[styles.title, { color: c.text }]}>Bienvenido 👋</Text>
        <Text style={[styles.subtitle, { color: c.textMuted }]}>
          Inicia sesión para continuar
        </Text>

        <Input
          label="Correo"
          placeholder="tu@correo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <Input
          label="Contraseña"
          placeholder="••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />

        <Button
          title="Iniciar sesión"
          onPress={handleLogin}
          loading={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: Spacing.lg },
  title: { fontSize: FontSize.xl, fontWeight: "700" },
  subtitle: {
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
});
