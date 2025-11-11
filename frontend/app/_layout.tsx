import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Login - Finance Hub" }} />
      <Stack.Screen name="register" options={{ title: "Cadastro - Finance Hub" }} />
      <Stack.Screen name="dashboard" options={{ title: "Meu painel"}} />
    </Stack>
  );
}
