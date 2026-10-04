// src/theme/index.ts
export const Colors = {
  light: {
    primary: "#2563EB",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#64748B",
    border: "#E2E8F0",
    danger: "#DC2626",
  },
  dark: {
    primary: "#3B82F6",
    background: "#0F172A",
    surface: "#1E293B",
    text: "#F1F5F9",
    textMuted: "#94A3B8",
    border: "#334155",
    danger: "#F87171",
  },
};

export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const Radius = { sm: 8, md: 12, lg: 20 };
export const FontSize = { sm: 14, md: 16, lg: 20, xl: 28 };
import { useColorScheme } from "react-native";

export function useTheme() {
  const scheme = useColorScheme();
  return Colors[scheme === "dark" ? "dark" : "light"];
}
