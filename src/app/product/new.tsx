import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { CATEGORY_FIELDS, PAYMENT_LABELS, PaymentMethod } from "@/data/mock";
import { useStore } from "@/store/StoreContext";
import { FontSize, Radius, Spacing, useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const METHODS: PaymentMethod[] = ["qr", "transferencia", "efectivo"];

export default function NewProductScreen() {
  const c = useTheme();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { stores, addProduct } = useStore();
  const store = stores.find((s) => s.id === storeId) ?? stores[0];
  const fields = CATEGORY_FIELDS[store.category];

  const [image, setImage] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [methods, setMethods] = useState<PaymentMethod[]>(["qr"]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pickImage = async (fromCamera: boolean) => {
    if (fromCamera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          "Permiso necesario",
          "Habilita la cámara para tomar la foto.",
        );
        return;
      }
    }
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.7,
    };
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const toggleMethod = (m: PaymentMethod) =>
    setMethods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );

  const save = () => {
    const e: Record<string, string> = {};
    if (!code.trim()) e.code = "Ingresa un código";
    if (!name.trim()) e.name = "Ingresa el nombre";
    if (!(Number(price) > 0)) e.price = "Ingresa un precio válido";
    if (methods.length === 0) e.methods = "Elige al menos una forma de pago";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const cleanCode = code.trim().toUpperCase();
    const error = addProduct({
      storeId: store.id,
      code: cleanCode,
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      attributes,
      paymentMethods: methods,
      image: image ?? `https://picsum.photos/seed/${cleanCode}/400/500`,
    });

    if (error) setErrors({ code: error });
    else router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Nuevo · ${store.name}`,
          headerStyle: { backgroundColor: c.surface },
          headerTintColor: c.text,
        }}
      />
      <ScrollView
        style={{ backgroundColor: c.background }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Foto */}
        <View
          style={[
            styles.photo,
            { borderColor: c.border, backgroundColor: c.surface },
          ]}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.photoImg} />
          ) : (
            <Ionicons name="image-outline" size={48} color={c.textMuted} />
          )}
        </View>
        <View style={styles.photoButtons}>
          <View style={{ flex: 1 }}>
            <Button
              title="📷 Cámara"
              variant="outline"
              onPress={() => pickImage(true)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="🖼️ Galería"
              variant="outline"
              onPress={() => pickImage(false)}
            />
          </View>
        </View>

        {/* Datos generales */}
        <Text style={[styles.section, { color: c.text }]}>
          Datos del producto
        </Text>
        <Input
          label="Código"
          placeholder="Ej: PR010"
          autoCapitalize="characters"
          value={code}
          onChangeText={setCode}
          error={errors.code}
        />
        <Input
          label="Nombre"
          placeholder="Ej: Polera estampada"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <Input
          label="Precio (Bs)"
          placeholder="0"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
          error={errors.price}
        />
        <Input
          label="Descripción"
          placeholder="Detalles, estado, observaciones..."
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* Datos según el tipo de tienda */}
        {fields.map((f) => (
          <Input
            key={f.key}
            label={f.label}
            placeholder={f.placeholder}
            value={attributes[f.key] ?? ""}
            onChangeText={(v) =>
              setAttributes((prev) => ({ ...prev, [f.key]: v }))
            }
          />
        ))}

        {/* Formas de pago */}
        <Text style={[styles.section, { color: c.text }]}>
          Formas de pago aceptadas
        </Text>
        <View style={styles.methods}>
          {METHODS.map((m) => {
            const active = methods.includes(m);
            return (
              <Pressable
                key={m}
                onPress={() => toggleMethod(m)}
                style={[
                  styles.method,
                  {
                    borderColor: active ? c.primary : c.border,
                    backgroundColor: active ? c.primary + "22" : c.surface,
                  },
                ]}
              >
                <Ionicons
                  name={active ? "checkbox" : "square-outline"}
                  size={18}
                  color={active ? c.primary : c.textMuted}
                />
                <Text style={{ color: c.text }}>{PAYMENT_LABELS[m]}</Text>
              </Pressable>
            );
          })}
        </View>
        {errors.methods ? (
          <Text style={{ color: c.danger }}>{errors.methods}</Text>
        ) : null}

        <View style={{ marginTop: Spacing.lg }}>
          <Button title="Guardar producto" onPress={save} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: 60 },
  photo: {
    width: "60%",
    aspectRatio: 4 / 5,
    alignSelf: "center",
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photoImg: { width: "100%", height: "100%" },
  photoButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginVertical: Spacing.md,
  },
  section: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    marginVertical: Spacing.sm,
  },
  methods: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  method: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
});
