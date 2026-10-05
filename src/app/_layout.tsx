import { StoreProvider } from "@/store/StoreContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <StoreProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </StoreProvider>
  );
}
